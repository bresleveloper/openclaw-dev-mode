# OpenClaw Rescue Playbook

How to revive a dev-mode OpenClaw VPS instance when the gateway is "choking" (boot stalls, WS handshakes time out, status command hangs, exit code 9 from systemd).

This is field-written from the **2026-04-25 incident** — full timeline at the bottom under "Reference incident".

---

## TL;DR — the sequence that always works

When the gateway is unresponsive:

1. **Stop it.** `openclaw gateway stop` — let any node process settle, `pgrep -af openclaw-gateway` to confirm gone.
2. **Diagnose what's choking it.** Pick the first one that fits — they're listed in the order you should check.
3. **Apply the matching fix from the catalog below.**
4. **Backup before every config or state change.** Single recovery dir per incident: `mkdir -p ~/.openclaw/.recovery-$(date -u +%Y%m%d-%H%M%S)` and use that for all backups in this incident.
5. **Restart and verify.** `openclaw gateway start` → wait → `openclaw gateway status` → `openclaw health`.
6. **Send the WhatsApp confirmation** so you (Ariel) know it's back: `openclaw message send --channel whatsapp --target +972542634114 --message '...'`.

---

## Diagnose — what kind of choke is it?

Before flipping anything, gather facts. None of these is destructive:

```bash
# Service state + last exit code (9 = SIGKILL = systemd watchdog or OOM)
openclaw gateway status

# Memory pressure (5+ GB free is healthy; if not, OOM-killer is the suspect)
free -h
dmesg -T | grep -iE 'killed process|oom|out of memory' | tail -5

# Real CPU + RSS of the gateway, plus child processes
ps -e -o pid,ppid,etime,pcpu,rss,args | awk 'NR==1 || $6~/openclaw/'

# Are channel-side reconnect storms hammering it? Cloudflare = Discord, etc.
ss -tnp 2>/dev/null | grep openclaw-gateway | awk '{print $1, $5}' | head

# Latest log activity and last error/warn — JSON lines, parse with node not jq
LOG=/tmp/openclaw/openclaw-$(date -u +%F).log
ls -la $LOG
stat -c 'mtime: %y' $LOG    # is the log even moving?
tail -5 $LOG | grep -oE '"date":"[^"]+"|"logLevelName":"[^"]+"|"1":"[^"]{1,150}'
```

If `openclaw gateway status` itself hangs, the WS handshake is starved. The gateway PID is alive but the JS event loop is pegged in synchronous work.

**Always check VPS-host CPU steal first**, before assuming our code is the bottleneck:

```bash
top -bn1 | head -3
# Look at the third line: if "%Cpu(s)" shows "st" > 20, the hypervisor is
# stealing CPU from us (noisy neighbor on the VPS host). Boot can take 5–15 min
# under heavy steal even with everything else healthy. There is nothing the
# gateway can do about this — wait it out, or reboot the VPS to land on a
# different host. Observed during the 2026-04-25 incident: 60% steal sustained.
```

### The five patterns we've seen

| Pattern                                     | Symptom                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Cause                                                                                                                                                                                                                                                                                                                                                                         | Fix section                                                                                                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| **A. Plugin-load thrash**                   | 90–100% CPU sustained for 5–10 min after boot, log silent for minutes, `strace` shows iterating `dist-runtime/extensions/*/openclaw.plugin.json` (alphabetically a→z), eventually converges if you wait                                                                                                                                                                                                                                                                                                                       | Jiti `require()` pulls in 60–100 enabled-by-default bundled extensions on the main thread. V8 parses + compiles + executes each one synchronously, starving WS handshake                                                                                                                                                                                                      | "Pin plugins.allow"                                                                                                                                           |
| **B. Channel reconnect storm**              | High CPU, log shows tight loop of `discord gateway error: socket hang up` / `fetch failed                                                                                                                                                                                                                                                                                                                                                                                                                                     | write EPIPE`/ Boom 408, mass`CLOSE-WAIT`to`162.159.x.x` (Cloudflare = Discord)                                                                                                                                                                                                                                                                                                | Discord bot REST/gateway misbehaving on this VPS — token issue, rate-limit, or upstream churn. Same family for WhatsApp 408 + Bonjour stuck-announcing storms | "Disable a misbehaving channel" |
| **C. State pile-up**                        | Boot completes but is sluggish; `agents/<a>/sessions/` has hundreds of `.jsonl` + `.deleted.*` + `.checkpoint.*` files; `delivery-queue/` has stale retries from before the outage                                                                                                                                                                                                                                                                                                                                            | A cron pile-up (e.g. ShopMate Orchestrator hourly into `main`) + the cron-cleanup safety net not running while gateway was down                                                                                                                                                                                                                                               | "Reset session indexes + clear stale queue"                                                                                                                   |
| **D. WhatsApp stale-session**               | WA listener attaches and heartbeat reports `uptimeMs` growing, BUT every send fails immediately with `Error: Connection Closed` (200–1000ms latency), and `messagesHandled: 0, lastInboundAt: null` indefinitely. Often preceded by Boom 428 "Precondition Required - Connection Terminated" during reconnect                                                                                                                                                                                                                 | WhatsApp Web has revoked or replaced the device session on their side (commonly after >24h offline, multi-device collision, or upstream WA churn). Baileys' transport is alive but the WA server rejects every message                                                                                                                                                        | "Re-pair WhatsApp" — needs Ariel + QR code                                                                                                                    |
| **E. Single-session model-call retry loop** | Gateway healthy (probe ok, admin-capable, low CPU), but ONE session is stuck `state=processing` for 5+ min with `lastProgress=model_call:started` re-firing every 5–30s, age never finishing. TUI / WA / channel that's bound to that sessionKey is unresponsive (queued behind the active model_call). Surviving multiple gateway restarts. Often preceded by `[context-overflow-diag] ... compactionAttempts=0` then `context overflow detected (attempt 1/3); attempting auto-compaction`. Other agents/sessions work fine | A specific session hit context-overflow on a model that times out per-attempt without falling over (e.g. `ollama/kimi-k2.6:cloud` with `fallbackConfigured: false`). Auto-compaction can't progress because every compaction attempt also hits the same timing-out model. The channel key in `sessions.json` pins the broken sessionId across restarts, so reboots don't help | "Drop a single stuck session key"                                                                                                                             |

Patterns can overlap (the 2026-04-25 incident had all four; pattern E was first seen 2026-05-07).

---

## Fix catalog

Always: stop the gateway first, take backups into `$BAK = ~/.openclaw/.recovery-$TS/`, then apply.

### Pin `plugins.allow` (fix for pattern A)

The gateway scans every directory under `/opt/openclaw-dev-mode/dist-runtime/extensions/` (106+ entries) on boot. Without `plugins.allow`, every one whose default state is "enabled" gets fully `import()`-ed via Jiti — synchronous, on the main thread, in series.

Setting `plugins.allow` to an explicit list makes the loader skip every plugin not on the list (filter at `src/gateway/gateway-startup-plugin-ids.ts:113-117`). Channels declared in `channels.<name>` config still load even if not in `allow` (the `explicitBundledChannelConfig` exception), so this is safe.

```bash
# Backup
cp /root/.openclaw/openclaw.json "$BAK/openclaw.json.before-plugins-allow-$TS"

# Apply (10-plugin set proven loaded in V2026.4.5)
node -e '
const fs=require("fs");
const p="/root/.openclaw/openclaw.json";
const raw=fs.readFileSync(p,"utf8");
const bom=raw.startsWith("﻿")?"﻿":"";
const c=JSON.parse(raw.replace(/^﻿/,""));
c.plugins.allow = ["acpx","browser","device-pair","memory-core","ollama","openai","openclaw-web-search","phone-control","talk-voice","whatsapp"];
fs.writeFileSync(p+".tmp", bom+JSON.stringify(c,null,2)+"\n", {mode:0o600});
fs.renameSync(p+".tmp", p);
console.log("plugins.allow set");
'
```

To verify the right list, look at the most recent successful `[gateway] ready (N plugins: ...)` line in the daily log — those names are what's actually being used. Plus include the model-provider plugins that show up in `plugins.entries` (`ollama`, `openai`, ...).

### Disable a misbehaving channel (fix for pattern B)

Top-level boolean `channels.<name>.enabled = false` is the cleanest kill — no need to remove accounts or guilds. After the V2026.4.5 schema, Discord and WhatsApp both honor it.

```bash
cp /root/.openclaw/openclaw.json "$BAK/openclaw.json.before-discord-off-$TS"
node -e '
const fs=require("fs"); const p="/root/.openclaw/openclaw.json";
const raw=fs.readFileSync(p,"utf8"); const bom=raw.startsWith("﻿")?"﻿":"";
const c=JSON.parse(raw.replace(/^﻿/,""));
c.channels.discord.enabled = false;
fs.writeFileSync(p+".tmp", bom+JSON.stringify(c,null,2)+"\n", {mode:0o600});
fs.renameSync(p+".tmp", p);
'
```

To re-enable later, flip back to `true` and restart the gateway.

### Reset session indexes + clear stale queue (fix for pattern C)

The session **index** (`sessions.json` per agent) is rebuildable from inbound traffic. Channel keys like `agent:main:whatsapp:direct:+972…` get bound to a fresh `sessionId` on the next inbound message. Moving the index aside is a safe "fresh sessions" reset.

```bash
mkdir -p "$BAK/sessions-indexes"
for agent in $(ls /root/.openclaw/agents/); do
  src=/root/.openclaw/agents/$agent/sessions/sessions.json
  if [ -f "$src" ]; then
    cp "$src" "$BAK/sessions-indexes/$agent.sessions.json"
    mv "$src" "$src.bak.$TS"
  fi
done
```

Stale `delivery-queue` retries (anything older than ~1 hour is usually pointless to deliver):

```bash
mkdir -p "$BAK/delivery-queue"
shopt -s nullglob
mv /root/.openclaw/delivery-queue/*.json "$BAK/delivery-queue/" 2>/dev/null
# Keep delivery-queue/failed/ — that's the dead-letter dir
```

### Drop bloated transcripts (last resort, only if pattern A persists after `plugins.allow`)

If `agents/main/sessions/` has hundreds of MB of `.jsonl` + `.deleted.*` + `.checkpoint.*` and the gateway is still slow, archive them. The transcripts are NOT needed for runtime operation once the index is gone.

```bash
ATTIC=$BAK/main-sessions-attic-$TS
mkdir -p "$ATTIC"
cd /root/.openclaw/agents/main/sessions
shopt -s nullglob
for f in *.jsonl *.jsonl.deleted.* *.trajectory.jsonl* *.trajectory-path.json *.checkpoint.* ; do
  [ -e "$f" ] && mv "$f" "$ATTIC/"
done
```

The `_quarantine-*` directory and `.jsonl.reset.*` archive files are kept by default — they're already-archived prior `/new` resets.

### Remove a runaway cron job (no live UI)

The cron jobs live in `~/.openclaw/cron/jobs.json` (definitions) and `~/.openclaw/cron/jobs-state.json` (run state). Edit both atomically:

```bash
cp /root/.openclaw/cron/jobs.json "$BAK/jobs.json.before"
cp /root/.openclaw/cron/jobs-state.json "$BAK/jobs-state.json.before"
node -e '
const fs=require("fs");
const REMOVE = new Set(["dc683069-b267-4ee1-bc2b-3269b4aef3d6"]);  // <-- list cron IDs here
for (const file of ["/root/.openclaw/cron/jobs.json","/root/.openclaw/cron/jobs-state.json"]) {
  const j = JSON.parse(fs.readFileSync(file,"utf8"));
  if (Array.isArray(j.jobs)) j.jobs = j.jobs.filter(x => !REMOVE.has(x.id));
  if (j.jobs && typeof j.jobs === "object" && !Array.isArray(j.jobs)) {
    for (const id of REMOVE) delete j.jobs[id];
  }
  fs.writeFileSync(file+".tmp", JSON.stringify(j,null,2)+"\n", {mode:0o600});
  fs.renameSync(file+".tmp", file);
}
'
```

To list crons before removing:

```bash
node -e '
const j=JSON.parse(require("fs").readFileSync("/root/.openclaw/cron/jobs.json","utf8"));
for (const x of j.jobs) {
  const sch = x.schedule||{};
  const s = sch.kind==="cron"?"cron "+sch.expr+(sch.tz?" tz="+sch.tz:""):
            sch.kind==="every"?"every "+(sch.everyMs/60000)+"m":
            sch.kind==="at"?"at "+sch.at:"?";
  console.log([x.id, x.enabled?"ON ":"off", x.sessionTarget||"?", s, x.name].join(" | "));
}
'
```

### Drop a single stuck session key (fix for pattern E)

When the gateway is otherwise healthy but ONE session is stuck in a model_call retry loop, you don't need to wipe all of `sessions.json` (pattern C). Just drop the one channel key and archive that one sessionId's files. Other agents and other channels for the same agent are untouched.

Diagnose first — confirm the pattern:

```bash
LOG=/tmp/openclaw/openclaw-$(date -u +%F).log

# Which sessionId(s) are stuck right now?
grep 'long-running session' $LOG | tail -10 | grep -oE 'sessionId=[a-z0-9-]+|sessionKey=[^ ]+|age=[0-9]+s|lastProgress=[a-z_:]+'

# Confirm context-overflow + model timeout (the usual driver)
grep -E 'context-overflow-diag|model fallback decision|chain_exhausted' $LOG | tail -5

# Confirm the channel key still maps to the broken sessionId in the index
node -e '
const j = JSON.parse(require("fs").readFileSync("/root/.openclaw/agents/main/sessions/sessions.json","utf8"));
console.log(j["agent:main:tui-..."] || "(not present)");
'
```

You're looking for: same `sessionId` appearing in `long-running session` warnings repeatedly with `lastProgress=model_call:started` and a growing `age`, AND that sessionId still bound in the index.

Apply the fix — gateway must be stopped (in-memory session state has to clear, otherwise the running model_call keeps the channel pinned and `sessions.json` gets re-checkpointed with the dropped key restored):

```bash
TS=$(date -u +%Y%m%d-%H%M%S)
BAK=/root/.openclaw/.recovery-$TS
mkdir -p $BAK/sessions-indexes $BAK/main-stuck-jsonl
cp /root/.openclaw/agents/main/sessions/sessions.json $BAK/sessions-indexes/main.sessions.json

openclaw gateway stop
sleep 2

# Drop ONLY the one channel key. Set CHANNEL_KEY and STUCK_SID.
CHANNEL_KEY='agent:main:tui-1630e401-b42f-4730-af4c-eab3fdc5fce1'
STUCK_SID='dabebefd-d3ba-48d8-96e0-dae34dda257b'

node -e '
const fs=require("fs"); const p="/root/.openclaw/agents/main/sessions/sessions.json";
const j=JSON.parse(fs.readFileSync(p,"utf8")); const k=process.argv[1];
if (j[k]) { console.log("dropping "+k+" -> "+j[k].sessionId); delete j[k]; }
else { console.log("key not present"); }
fs.writeFileSync(p+".tmp", JSON.stringify(j,null,2)+"\n", {mode:0o600});
fs.renameSync(p+".tmp", p);
' "$CHANNEL_KEY"

# Move ALL files for that one sessionId aside (jsonl, .lock, .trajectory.jsonl,
# .trajectory-path.json, .checkpoint.<uuid>.jsonl, .jsonl.reset.* if present).
# Use a glob — without `set -e` so missing-file races don't abort:
cd /root/.openclaw/agents/main/sessions
shopt -s nullglob
for f in ${STUCK_SID}* ; do mv "$f" $BAK/main-stuck-jsonl/ ; done

openclaw gateway start
# Wait for boot + WA listener (~30–60s normally, longer post-upgrade — see CLAUDE.md)
sleep 60

# Verify: no new long-running warnings for the same sessionId since restart
grep "long-running session" /tmp/openclaw/openclaw-$(date -u +%F).log | tail -5
```

The next inbound on that channel key gets a brand-new sessionId and starts fresh. The archived jsonl + trajectory are recoverable from `$BAK/main-stuck-jsonl/` if you need the conversation history.

**When NOT to use this fix:**

- Multiple stuck sessions across many channel keys — that's pattern C, wipe the whole index instead.
- The model itself is broken for ALL sessions (e.g. Ollama service down) — fixing one session won't help; address the model.
- Gateway is unresponsive at the WS layer (status hangs) — that's not pattern E; you're in pattern A or B territory.

**Followups worth considering** to reduce recurrence:

- Set `agents.<id>.fallback` to a second model so the broken model can fail over instead of looping (the 2026-05-07 incident had `fallbackConfigured: false`).
- Audit recent context-overflow diagnostics (`grep context-overflow-diag $LOG`) to spot sessions approaching the limit before they stick.
- Re-evaluate models with known timeout patterns (`ollama/kimi-k2.6:cloud` failed twice in one day on 2026-05-07).

### Re-pair WhatsApp (fix for pattern D, requires Ariel + QR scan)

This is the only fix that requires Ariel physically — there is no automated way to bypass the WhatsApp Web pairing flow.

Symptoms that confirm pattern D (vs the more benign WA warm-up flap):

- Listener attached for >5 minutes per `module:web-heartbeat`'s `uptimeMs` field
- `messagesHandled: 0` and `lastInboundAt: null` over that whole period (no inbound traffic at all)
- Every outbound send fails in <1s with `errorCode=UNAVAILABLE errorMessage=Error: Connection Closed`
- Initial connect attempt was rejected with Boom 428 `Precondition Required - Connection Terminated`

To re-pair:

```bash
# Stop the gateway
openclaw gateway stop

# Backup the WA credentials (DO NOT skip — these are the only thing tying the
# bot identity to your phone. Lose them and you re-link from scratch.)
mkdir -p "$BAK/whatsapp-creds"
cp -a /root/.openclaw/credentials/whatsapp/default/. "$BAK/whatsapp-creds/"

# Conservative attempt first: clear ONLY the app-state-sync version files. If WA
# rejected the session because of a stale app-state-sync version mismatch, this
# lets Baileys do a fresh sync without re-linking. Often works.
rm /root/.openclaw/credentials/whatsapp/default/app-state-sync-version-*.json

openclaw gateway start
# Watch /tmp/openclaw/openclaw-$(date -u +%F).log for "Listening for personal WhatsApp"
# AND for the first inbound (lastInboundAt becomes non-null). If both happen
# without "Connection Closed" loops, you're back. If not, do the full re-link below.
```

If the conservative attempt doesn't recover within ~5 min:

```bash
# Full re-pair — need Ariel to scan a QR code in WhatsApp
openclaw gateway stop
mv /root/.openclaw/credentials/whatsapp/default "$BAK/whatsapp-creds-full-$TS"
openclaw channels login --channel whatsapp --account default
# Follow the QR-code prompt. Ariel scans from WhatsApp → Linked Devices → Link a device.
# Once paired, "openclaw gateway start" picks up the fresh creds.
```

### Cleanup orphan cron `.tmp` files

If you see hundreds of zero-byte `jobs.json.<pid>.<hash>.tmp` files in `~/.openclaw/cron/` (atomic-write tmps from a process that died mid-write), they slow every cron-store load. Safe to wipe:

```bash
find /root/.openclaw/cron -maxdepth 1 -name '*.tmp' -size 0 -delete
```

### Fix the `openclaw-web-search` extension ownership warning

Cosmetic but spammy on every startup. Plugin loader rejects extensions whose owner uid != root:

```bash
chown -R root:root /root/.openclaw/extensions/openclaw-web-search
```

---

## Verify after restart

```bash
openclaw gateway start

# Wait — bundled-channel warm-up can take ~2 min after a fresh start (per CLAUDE.md).
# WhatsApp Baileys reconnect takes additional 4-7 min when the gateway has been down
# for many hours: 1-2 retry cycles of Boom 428 "Precondition Required" before the
# session re-attaches and "Listening for personal WhatsApp inbound messages" appears.
# This is normal post-long-outage behavior, not a failure.
sleep 60

# Service alive?
openclaw gateway status | grep -E 'Runtime|Connectivity|Capability'

# WS responsive? (will hang if event loop is still starved)
timeout 20 openclaw health

# Most recent INFO/WARN/ERROR (use a custom node parser — jq chokes on the log shape)
LOG=/tmp/openclaw/openclaw-$(date -u +%F).log
tail -10 $LOG | grep -oE '"date":"[^"]+"|"logLevelName":"[^"]+"|"1":"[^"]{1,150}'

# Watch for WA listener attach in real time
tail -F $LOG 2>/dev/null | grep --line-buffered -E 'Sent message|Listening for personal WhatsApp|channel exited|FATAL'

# Send confirmation to Ariel
openclaw message send --channel whatsapp --target +972542634114 \
  --message 'gateway recovered: <what you fixed in one line>'
```

### When `openclaw message send` hangs (gateway WS unhealthy)

If WA is flapping and `openclaw message send` is timing out / returning `Error: Connection Closed`, you can write the delivery directly to the queue. The gateway's `recoverPendingDeliveries` (`src/infra/outbound/delivery-queue-recovery.ts:344`, fire-and-forget on startup, then every ~60s thereafter) will retry it automatically as soon as the WA listener stabilizes:

```bash
node -e '
const fs=require("fs"); const {randomUUID}=require("crypto");
const id=randomUUID();
const entry={
  id, enqueuedAt:Date.now(),
  channel:"whatsapp", to:"+972542634114", accountId:"default",
  payloads:[{text:"<your message here>"}],
  threadId:null, replyToId:null, gifPlayback:false, retryCount:0
};
fs.writeFileSync("/root/.openclaw/delivery-queue/"+id+".json", JSON.stringify(entry,null,2)+"\n", {mode:0o600});
console.log("queued:", id);
'
```

Verify it gets picked up by tailing the log for `Recovered delivery <id-prefix>`.

---

## Backups discipline

One recovery dir per incident, every change goes in there. Example layout:

```
~/.openclaw/.recovery-20260425-190410/
  openclaw.json.before-discord-off-20260425-191955
  openclaw.json.before-plugins-allow-20260425-194007
  jobs.json.before
  jobs-state.json.before
  sessions-indexes/
    main.sessions.json
    ceo.sessions.json
    ...
  delivery-queue/
    15da1eca-...json
    b6fbda02-...json
  main-sessions-attic-20260425-192534/
    <1240 transcript files>
```

To roll back any single change, copy from there back into place.

---

## Reference incident: 2026-04-25 (left for 30 hrs, came back to a dead gateway)

Symptoms on arrival:

- `openclaw gateway status`: `state failed, sub failed, last exit 9` (SIGKILL)
- 30+ hr-stale `delivery-queue` entries retry-looping
- 1284 files (244 MB) in `agents/main/sessions/` (vs 1–3 in every other agent)
- Plugin warning: `blocked plugin candidate: suspicious ownership (/root/.openclaw/extensions/openclaw-web-search, uid=1001, expected uid=0 or root)`
- Two ShopMate crons firing (1h into `main`, 4h isolated) — primary cause of the session pile-up

Memory and CPU were _fine_ (5.6 GB free of 7.8 GB; swap untouched). dmesg `workqueue: css_killed_work_fn hogged CPU` is just cgroup cleanup churn from the repeated SIGKILLs, NOT OOM.

What we did, in order:

1. **chown** `~/.openclaw/extensions/openclaw-web-search` → root (cleared the "blocked plugin candidate" loop)
2. **Removed 2 ShopMate crons** by ID from `jobs.json` + `jobs-state.json` (`dc683069-b267-4ee1-bc2b-3269b4aef3d6`, `ef122654-ba76-477b-9c4d-41fbd194173c`)
3. **Wiped session indexes** for all 13 agents (moved `sessions.json` aside)
4. **Cleared stale delivery-queue** (2 entries from 30 hrs prior)
5. **Cleaned 84 zero-byte cron `.tmp` files** from a long-dead PID 4095113
6. **Started gateway** — booted to `ready (9 plugins; 55.6s)` but immediately got into a Discord reconnect storm at 99% CPU
7. **Disabled Discord** at the channel level (`channels.discord.enabled = false`) — Cloudflare CLOSE-WAIT mass dropped to zero, but CPU stayed at 97%
8. **Moved 1240 main session transcripts to attic** (`agents/main/sessions/` 244 MB → 43 MB) — no immediate change but made boot scan less heavy
9. **Diagnosed the _real_ root cause** with strace: gateway was iterating `dist-runtime/extensions/*/openclaw.plugin.json` alphabetically (a → z), Jiti `require()`-ing each enabled bundled extension on the main thread. `src/plugins/discovery.ts:821` (`discoverInDirectory`) → `src/plugins/loader.ts:2330` (synchronous `getJiti(safeSource)(safeImportSource)`). With ~80 enabled-by-default plugins out of 106 bundled, V8 parses+compiles+executes each in series.
10. **Set `plugins.allow`** to the 10-plugin verified-needed set: `acpx, browser, device-pair, memory-core, ollama, openai, openclaw-web-search, phone-control, talk-voice, whatsapp`. Filter is at `src/gateway/gateway-startup-plugin-ids.ts:113-117` — when non-empty, every other plugin is excluded from startup load (channels declared in `channels.*` are exempt, so the channel disable still works).
11. **Restart** → boot reached `ready (8 plugins; 32.1s)` (down from 55.6s), RSS dropped from ~900 MB to ~620 MB during boot.
12. **Pattern D appeared**: WhatsApp listener attached at 19:49:19 (per `Listening for personal WhatsApp inbound messages`), heartbeat reported `uptimeMs` growing past 8 minutes, but every outbound send returned `Error: Connection Closed` in <1s and `messagesHandled` stayed at 0. Initial reconnect cycles produced Boom 428 `Precondition Required - Connection Terminated`. Conclusion: WhatsApp Web revoked our session on their side after the 30-hr offline period. Re-pair (QR scan) was needed but Ariel was AFK.
13. **Queued the recovery confirmation message** directly to `~/.openclaw/delivery-queue/` so it would deliver via `recoverPendingDeliveries` on the next clean gateway start (after re-pair).

Total backup dir for the incident: `~/.openclaw/.recovery-20260425-190410/`.

- `jobs.json.before` / `jobs-state.json.before` — pre-cron-removal cron config
- `sessions-indexes/<agent>.sessions.json` — pre-wipe per-agent session indexes
- `main-sessions-attic-20260425-192534/` — 1240 archived main transcripts
- `delivery-queue/` — 2 stale 30-hr-old retries that got cleared
- `openclaw.json.before-discord-off-20260425-191955` — pre-discord-disable config
- `openclaw.json.before-plugins-allow-20260425-194007` — pre-allowlist config

What didn't matter:

- The 1284 session files on disk. The transcripts weren't being scanned at boot — the index file (`sessions.json`) was. Wiping the index alone solved that aspect.
- dmesg "workqueue hogged CPU" warnings. Always present after repeated SIGKILLs of the gateway, never the cause.
- Discord disable, in isolation. CPU stayed at 97% even after Discord stopped reconnecting; the real choke was JITI plugin imports (pattern A), not Discord.

What might come back:

- Discord. Leave `channels.discord.enabled: false` until you investigate why the bot tokens / Cloudflare path are misbehaving on this IP.
- Cron pile-up. Keep the `Cleanup stale cron+dream sessions` cron (`f0ed01c7-802a-45b8-9993-9a5c44097e6c`) enabled — it's the safety net.
- Boot time creeping back up. If you add new bundled extensions or the upstream merge introduces new auto-enabled ones, the `plugins.allow` whitelist must be extended too, or boot will slow again.
- WhatsApp stale-session (pattern D) every time the gateway is offline for >24h. The fix is in the catalog above ("Re-pair WhatsApp"). Try the conservative `app-state-sync-version-*.json` clear first — that often recovers without a full re-pair.
