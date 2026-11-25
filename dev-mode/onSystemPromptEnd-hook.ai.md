# `onSystemPromptEnd` hook (FIX-11): how-to for AI agents

Hands-on how-to for an agent with a shell (a Claude Code session, or an OpenClaw agent on the VPS). It takes one plugin through its whole life: write it, install it on the VPS, test it without touching Ariel's chats, change it, and remove it so `openclaw.json` ends exactly as it began.
The contract is in [fix-11-system-prompt-end.md](fix-11-system-prompt-end.md) ("the reference"). This page links there and repeats only what a step needs. Verified live on 2026-11-25 (V2026.11.10, build `ca12fb63b3e`, embedded runtime, `ollama/kimi-k2.7-code:cloud`): the plugin layout and the `openclaw` commands below. Not run live: the shell helpers in step 2 (they wrap those commands) and the claude-cli path.

> **Before you start**
>
> - **What it can do.** It runs after OpenClaw composed the final system prompt (every model request when embedded, once per turn on claude-cli). Your handler gets `event` (`systemPrompt`, `runtime`, `provider`, `model`, `requestId?`) and `ctx` (`sessionKey`, `agentId`, `trigger`, ...). Return a string or `{ systemPrompt }` to replace the prompt. Return `undefined` to keep it. [Contract](fix-11-system-prompt-end.md#2-contract)
> - **It fires for every session**, background ones included (the live probe also hit `agent:main:internal-session-effects:...`). The event has no session field: filter on `ctx.sessionKey` or `ctx.agentId`, and return `undefined` for everything that is not yours.
> - **It fails open.** A handler that throws or runs past its 15 s budget is skipped and the original prompt goes out. A broken plugin never blocks a reply, it just does nothing. [Operator switches](fix-11-system-prompt-end.md#6-operator-switches)
> - **It cannot touch** compaction summaries, utility completions (titles, classifiers), the codex harness, ACP, the `llm_input` hook, or text added below the hook. [Details](fix-11-system-prompt-end.md#4-what-it-does-not-cover)
> - **Keep the cache marker** `<!-- OPENCLAW_CACHE_BOUNDARY -->` in the prompt ([why](fix-11-system-prompt-end.md#5-the-cache-boundary-marker)). On claude-cli a changed prompt restarts the warm `claude` process ([details](fix-11-system-prompt-end.md#3-where-it-runs)), so keep the edit deterministic: no timestamps, counters or random ids.
> - **The prompt is private and about 83,000 characters** (it carries Ariel's workspace files, such as MEMORY.md). Log lengths, never the text. Keep additions short: they ride on every request.

**Rules.** Never run `openclaw doctor`. Do not edit `README.md`. No commit or push without asking Ariel. Do not run openclaw on the dev PC. Never test in Ariel's WhatsApp session (`agent:main:whatsapp:direct:+...`) and never send commands into it with `chat.send` ([CLAUDE.md, VPS Operational Lessons](../CLAUDE.md#vps-operational-lessons)). Tell Ariel before each gateway restart: WhatsApp is offline for about a minute.

**Running commands.** All VPS commands run as root. `<your-vps-alias>` is your SSH alias for the VPS. From a dev machine send each batch in ONE SSH session, because every root login posts an "SSH Login Alert" into Ariel's chat. Use the same SSH config for `scp` as for `ssh`. On the VPS itself, run each batch body directly (drop the `ssh` line and `EOF`).

```bash
ssh <your-vps-alias> 'bash -s' <<'EOF'
# commands here
EOF
```

Put `< /dev/null` on every `openclaw` call (interactive prompts hang the pipe). One CLI call takes 10 to 25 seconds. If you are an OpenClaw agent inside this gateway, a restart ends your own turn. Your system prompt says to restart with the `gateway` tool, not exec: use it instead of `oc_restart`. In your next turn, confirm `curl -fsS http://127.0.0.1:18789/readyz` answers before you go on (`oc_wait` alone is not enough there: it needs the log position that only `oc_restart` records).

## Step 1: write the plugin

Pick an id (`prompt-end-demo` here; replace it in every file, in the helpers and in the session key if you pick another). Create a directory of that name with three files. CommonJS, no dependencies: this is the layout verified live. The TypeScript variant is in [reference section 7](fix-11-system-prompt-end.md#7-example-plugin) and was not run.

`prompt-end-demo/package.json`

```json
{
  "name": "prompt-end-demo",
  "version": "1.0.0",
  "private": true,
  "main": "./index.cjs",
  "openclaw": { "extensions": ["./index.cjs"] }
}
```

`prompt-end-demo/openclaw.plugin.json` (keep `activation.onStartup`: the gateway then loads the plugin at start)

```json
{
  "id": "prompt-end-demo",
  "name": "Prompt End Demo",
  "activation": { "onStartup": true },
  "configSchema": { "type": "object", "additionalProperties": false }
}
```

`prompt-end-demo/index.cjs`

```js
"use strict";
// onSystemPromptEnd fires on EVERY model request of EVERY session: filter first, and return
// undefined (= keep the prompt) on every path that does not edit. Never log the prompt text.
// WHO: the exact session to edit; must equal agent:main:<plugin id>-test. Widen on purpose only
// (ctx.agentId, ctx.trigger, event.model, ctx.sessionKey.startsWith(...)).
const TARGET_SESSION = "agent:main:prompt-end-demo-test";
// WHAT: your edit. Deterministic (no Date.now(), counters, random ids). Keep the cache marker if
// you rewrite text. To learn the prompt's shape, log only its "## " headings, never the bodies.
const edit = (prompt) =>
  `${prompt}\n\nPE test: if the user's message is exactly PE-PING, reply with exactly PE-PONG and nothing else.`;

module.exports = {
  id: "prompt-end-demo",
  name: "Prompt End Demo",
  description: "Appends a PING/PONG test instruction to the final system prompt of one session.",
  register(api) {
    const log = (line) => {
      try {
        api.logger.info(line);
      } catch (_err) {
        // logging must never break the prompt path
      }
    };
    api.on("onSystemPromptEnd", (event, ctx) => {
      try {
        if (!event || typeof event.systemPrompt !== "string") return undefined;
        // log(`[prompt-end-demo] saw session=${ctx && ctx.sessionKey}`); // debug: every request, noisy
        if (!ctx || ctx.sessionKey !== TARGET_SESSION) return undefined;
        const next = edit(event.systemPrompt);
        if (typeof next !== "string" || next === event.systemPrompt) return undefined;
        log(
          `[prompt-end-demo] edited runtime=${event.runtime} provider=${event.provider} model=${event.model} len=${event.systemPrompt.length}->${next.length} session=${ctx.sessionKey}`,
        );
        return next;
      } catch (err) {
        log(`[prompt-end-demo] handler error: ${err instanceof Error ? err.message : String(err)}`);
        return undefined;
      }
    });
  },
};
```

Edit only the two marked places. `register()` also runs in the CLI process (`plugins inspect --runtime`), so it must have no side effects. Dry run it with plain Node (no gateway), from the directory that holds `prompt-end-demo/`:

```bash
node -e '
const plugin = require(require("path").resolve("prompt-end-demo/index.cjs"));
let handler;
plugin.register({ logger: { info: console.log }, on: (name, fn) => { if (name === "onSystemPromptEnd") handler = fn; } });
const event = { systemPrompt: "BASE PROMPT", runtime: "embedded", provider: "ollama", model: "kimi-k2.7-code:cloud" };
console.log(handler(event, { sessionKey: "agent:main:prompt-end-demo-test" }));
console.log(handler(event, { sessionKey: "agent:main:whatsapp:direct:+000" }));
console.log(handler(event, undefined));
'
```

Expect one `edited` log line and the edited prompt (97 characters longer in the unmodified example), then `undefined` twice. Fix problems here: every gateway restart costs about a minute of WhatsApp downtime.

## Step 2: copy to the VPS, fix ownership, add the helpers

The loader blocks a plugin directory or entry file that root does not own (files copied from Windows arrive with a foreign uid: `blocked plugin candidate: suspicious ownership (..., uid=..., expected uid=0 or root)`) or that anyone can write to (`world-writable path`). Fix both with `chown` and `chmod` before the install.

```bash
scp -r ./prompt-end-demo <your-vps-alias>:/root/        # skip when you wrote the files on the VPS
ssh <your-vps-alias> 'bash -s' <<'EOF'
chown -R root:root /root/prompt-end-demo && chmod -R go-w /root/prompt-end-demo
node --check /root/prompt-end-demo/index.cjs && echo "syntax ok" && ls -ld /root/prompt-end-demo/*   # expect: root root
EOF
```

Save the next block as `/root/prompt-end-lib.sh` on the VPS (write it locally and `scp` it like the plugin; use LF line endings, or it fails with `$'\r': command not found`). Every later batch starts with `. /root/prompt-end-lib.sh`. `oc_restart` waits for three signals: `/readyz` answers, the WhatsApp listener line appears after the restart, and MainPID stays unchanged for 25 s. Only then is the gateway up ([CLAUDE.md, VPS Update Recipe](../CLAUDE.md#vps-update-recipe)).

```bash
ID=prompt-end-demo                     # your plugin id
SESSION=agent:main:$ID-test            # the dedicated test session
BACKUP=/root/openclaw.json.pre-$ID     # config backup, never overwritten (step 3)
READY=http://127.0.0.1:18789/readyz
export XDG_RUNTIME_DIR=/run/user/$(id -u)
oc_log() { ls -t ~/.openclaw/logs/openclaw-*.log | head -n 1; }

oc_restart() {   # restart the gateway and wait until it is really up (about a minute)
  N0=$(stat -c %s "$(oc_log)")         # log size before the restart
  systemctl --user restart openclaw-gateway || return 1
  oc_wait
}
oc_wait() {
  local i up=0 p1 p2
  for i in $(seq 120); do              # up to 10 minutes
    if curl -fsS "$READY" > /dev/null 2>&1 && tail -c +$((N0 + 1)) "$(oc_log)" | grep -aq 'Listening for WhatsApp inbound messages'; then up=1; break; fi
    sleep 5
  done
  [ "$up" = 1 ] || { echo "NOT UP after 10 minutes: see Troubleshooting"; return 1; }
  p1=$(systemctl --user show openclaw-gateway -p MainPID --value); sleep 25
  p2=$(systemctl --user show openclaw-gateway -p MainPID --value)
  [ "$p1" = "$p2" ] && curl -fsS "$READY" > /dev/null 2>&1 && { echo "UP: MainPID $p2 stable"; return 0; }
  echo "NOT STABLE ($p1 -> $p2): run oc_wait again"; return 1
}
ask() {          # ask <session-key> <message>: one turn on kimi (embedded runtime), prints the reply text
  local rc=0
  timeout 300 openclaw agent --agent main --session-key "$1" --model ollama/kimi-k2.7-code:cloud \
    --message "$2" --json < /dev/null > /tmp/$ID-turn.json 2> /tmp/$ID-turn.err || rc=$?
  [ "$rc" -eq 0 ] || { echo "turn failed, rc=$rc"; head -c 600 /tmp/$ID-turn.err; return 1; }
  node -e 'const t = require("fs").readFileSync(process.argv[1], "utf8"), o = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
    const p = (o.result && o.result.payloads) || o.payloads || [];
    console.log("reply:", p.map((x) => x.text).filter(Boolean).join(" "));' /tmp/$ID-turn.json
}
cfg_same() {     # cfg_same <backup> <current>: same config? top-level meta ignored; prints key paths, never values
  node - "$1" "$2" <<'JS'
const fs = require("fs");
const { isDeepStrictEqual } = require("util");
let parse = JSON.parse;
try { const m = require("/opt/openclaw-dev-mode/node_modules/json5"); parse = (m.parse ? m : m.default).parse; } catch (_e) { /* plain JSON */ }
const load = (f) => { const o = parse(fs.readFileSync(f, "utf8")); delete o.meta; return o; };
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const diff = (a, b, p) => isDeepStrictEqual(a, b) ? [] : !isObj(a) || !isObj(b) ? [p]
  : [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => diff(a[k], b[k], p ? `${p}.${k}` : k));
const d = diff(load(process.argv[2]), load(process.argv[3]), "");
console.log(d.length ? "CONFIG DIFFERS at: " + d.join(", ") : "CONFIG_EQUALS_BACKUP=yes (top-level meta ignored)");
JS
}
```

## Step 3: back up, install, enable, restart, verify

```bash
ssh <your-vps-alias> 'bash -s' <<'EOF'
. /root/prompt-end-lib.sh; set -e                                  # stop at the first failing command
[ -e "$BACKUP" ] || cp -a ~/.openclaw/openclaw.json "$BACKUP"     # never overwrite: it may be the only clean copy
openclaw plugins install --link /root/$ID --force < /dev/null     # warns "outside ClawHub review": expected, you wrote it
openclaw plugins enable $ID < /dev/null                           # expect: Enabled plugin "prompt-end-demo"
oc_restart                                                        # expect: UP: MainPID <n> stable
openclaw plugins inspect $ID --runtime --json < /dev/null > /tmp/$ID-inspect.json
grep -c onSystemPromptEnd /tmp/$ID-inspect.json                   # expect: 1 or more
grep -ciE 'blocked|ignored' /tmp/$ID-inspect.json || true         # expect: 0 (else read the matching lines)
EOF
```

`install --link` records the path (the code stays in `/root/$ID`) and adds the id to `plugins.allow`. The running gateway may pick the plugin up before the restart: the live probe fired once in the old process, so treat your filter as live from `install` on. `inspect --runtime` loads the plugin in the CLI process, so it proves the file loads and registers the hook, not that the gateway runs it. Step 4 is that proof.

## Step 4: test in a dedicated session

Test on the kimi model (embedded runtime, the path verified live) in the dedicated session, never in Ariel's. Do not add `--deliver`, `--to`, `--channel` or `--reply-*` (they send the reply to a phone). The control turn uses another session key, so the filter must leave it alone.

```bash
ssh <your-vps-alias> 'bash -s' <<'EOF'
. /root/prompt-end-lib.sh
ask $SESSION PE-PING                                              # expect: reply: PE-PONG
ask agent:main:$ID-control PE-PING                                # expect: anything but PE-PONG
grep -aF "[$ID] edited" "$(oc_log)" | tail -n 3                   # expect a line for the test session
grep -aF "[$ID] edited" "$(oc_log)" | grep -vc "session=$SESSION" || true   # expect: 0
EOF
```

The plugin's line lands in `~/.openclaw/logs/openclaw-YYYY-MM-DD.log` (JSON lines) and in journald (`journalctl --user -u openclaw-gateway`). The live probe logged `len=82978->83086`. Pass when (1) the test reply is exactly `PE-PONG`; (2) the log has an `edited` line for `$SESSION` with `runtime=embedded provider=ollama`, and in its `len=A->B` the difference B - A is the length of your addition; (3) no `edited` line names another session. `runtime=claude-cli` means kimi failed and a fallback model ran. Nothing may reach Ariel's chat.

## Step 5: change the plugin

Edit `/root/prompt-end-demo/index.cjs` on the VPS, or edit it locally, `scp` it again and redo the `chown`. A code change in a `--link`ed plugin loads only after a gateway restart. Dry-run locally first (step 1) to save restarts.

```bash
ssh <your-vps-alias> 'bash -s' <<'EOF'
. /root/prompt-end-lib.sh; set -e                                  # stop at the first failing command
node --check /root/$ID/index.cjs && chown -R root:root /root/$ID && chmod -R go-w /root/$ID
# manifest or package.json changed? first repeat the install line of step 3 (a precaution, not tested)
oc_restart && ask $SESSION PE-PING
EOF
```

Repeat the checks of step 4. Widening the filter to a real chat (Ariel's, or another agent's) changes that chat's live prompt: ask Ariel first.

## Step 6: remove the plugin

```bash
ssh <your-vps-alias> 'bash -s' <<'EOF'
. /root/prompt-end-lib.sh
openclaw plugins disable $ID < /dev/null
openclaw plugins uninstall $ID --force --keep-files < /dev/null   # keeps /root/$ID on disk
grep -q "$ID" ~/.openclaw/openclaw.json && openclaw config unset plugins.entries.$ID < /dev/null   # uninstall leaves this key
cfg_same "$BACKUP" ~/.openclaw/openclaw.json                      # expect: CONFIG_EQUALS_BACKUP=yes
oc_restart                                                        # unloads the handler from the running gateway
openclaw plugins list --json < /dev/null | grep -c "\"$ID\"" || true   # expect: 0 (a hit: read that line)
EOF
```

If `cfg_same` names keys your plugin added, remove each with `openclaw config unset <path>`. If it names keys you never touched, someone changed them since the backup: leave them and tell Ariel. Restore the backup (`cp -a "$BACKUP" ~/.openclaw/openclaw.json`, then `oc_restart`) only when nothing else changed. When it is clean, delete the scratch files: `rm -rf /root/$ID /root/prompt-end-lib.sh "$BACKUP" /tmp/$ID-*` (the backup holds the same secrets as the config). The test sessions stay in the agent DB, which is harmless.

## Troubleshooting

| Symptom                                                                                                                               | Cause                                                                                              | Fix                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blocked plugin candidate: suspicious ownership (...)` or `world-writable path` in the plugin diagnostics or gateway log              | Plugin directory or entry file not owned by root, or writable by everyone                          | `chown -R root:root /root/$ID && chmod -R go-w /root/$ID`, run `install --link --force` again, `oc_restart`                                                                   |
| Plugin missing from `plugins list`                                                                                                    | Id in `plugins.deny`, missing from `plugins.allow`, or `plugins.enabled` false                     | `openclaw config get plugins.allow < /dev/null`; `install` appends the id; ask Ariel before touching deny                                                                     |
| Diagnostics: `unknown typed hook "onSystemPromptEnd" ignored`                                                                         | The running build has no FIX-11                                                                    | On the VPS, `cd /opt/openclaw-dev-mode && git grep -n "openclaw-dev-mode FIX-11" -- src ':!src/agents/fork-*'` must list 11 lines; if not, ask Ariel to deploy the fork build |
| Diagnostics: `typed hook "onSystemPromptEnd" blocked by plugins.entries.<id>.hooks.allowPromptModification=false`                     | Operator switch is off                                                                             | Ask Ariel; then `openclaw config unset plugins.entries.$ID.hooks.allowPromptModification`                                                                                     |
| Hook listed, turn rc=0, no `edited` line                                                                                              | Filter does not match, or the gateway still runs the old code                                      | Uncomment the "saw session" debug line, `oc_restart`, retest, compare `ctx.sessionKey` with `$SESSION`; restart after every code change                                       |
| `edited` line present, reply ignores the instruction                                                                                  | Weak instruction, or a fallback model ran                                                          | Make the instruction explicit and short; read `runtime=` and `provider=` in the line; read `/tmp/$ID-turn.err`                                                                |
| Gateway log: `[hooks] onSystemPromptEnd handler from <id> failed: ...` (error) or `onSystemPromptEnd skipped for this request` (warn) | The handler threw or ran past 15 s, or the hook layer itself failed; the prompt went out unchanged | Fix the code and keep it fast; more time: `plugins.entries.<id>.hooks.timeouts.onSystemPromptEnd` (ms, 600000 at most). A `skipped` warning is not yours: report it to Ariel  |
| Turn fails with `429 ... weekly limit`                                                                                                | Ollama Cloud quota                                                                                 | Wait for the reset, or ask Ariel to allow a Claude model: that is the claude-cli path, not verified live                                                                      |
| claude-cli replies restart or slow down every turn                                                                                    | The edit changes between turns (timestamp, counter)                                                | Make `edit()` deterministic                                                                                                                                                   |
| `oc_wait` says NOT UP or MainPID keeps changing                                                                                       | Crash loop, or a config write restarted the gateway again                                          | `journalctl --user -u openclaw-gateway -n 80 --no-pager`; then `cp -a "$BACKUP" ~/.openclaw/openclaw.json`, `oc_restart`; then [rescue.md](trouble-shooting/rescue.md)        |
| WhatsApp replies garbled or delayed after a restart ("Bad MAC")                                                                       | The restart corrupted the WhatsApp Signal session once before                                      | `oc_restart` again and ask Ariel to confirm WhatsApp answers                                                                                                                  |

## Final checklist

- [ ] Three files exist, JSON parses, `node --check` passes, the dry run edits the test session only. `/root/$ID` is `root:root` and not world-writable. Helpers saved with LF endings.
- [ ] `$BACKUP` exists and was taken before `install`. `install --link --force` and `enable` ran with `< /dev/null`; `inspect` lists `onSystemPromptEnd`, nothing blocked or ignored.
- [ ] Gateway restarted with `oc_restart`: `/readyz`, the WhatsApp listener line and a stable MainPID.
- [ ] Test ran in `agent:main:$ID-test` on kimi: reply `PE-PONG`, an `edited` line with `len=A->B`, control session untouched, nothing sent into Ariel's WhatsApp session.
- [ ] After every code change: `node --check`, `oc_restart`, the step 4 checks again.
- [ ] Removal done: disable, `uninstall --force --keep-files`, `config unset plugins.entries.$ID`, `cfg_same` says equal, `oc_restart`, id gone from `plugins list`, scratch files deleted.
- [ ] No `openclaw doctor`, no `README.md` change, nothing committed or pushed. Ariel got a short report: the reply, the `edited` lines, the `cfg_same` result.
