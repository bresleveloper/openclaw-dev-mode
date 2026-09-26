tasks:

(dev ip is the usual one — see ~/.ssh/known_hosts, not committed here)

1. last time we added a plugin name openclaw-kapso. it created some issues. remove it completely from dev
2. we moved the handling of the wa db to that plugin. so loog at prev vesrsions and bring back the we db change where we log all wa activity to the db. look in server to correct last location.
3. last update we disabled force reset session (FIX-05), that also causes some issues. so lets change it that:
  current - if no reset session value set never reset
  required - if no reset session value set DO NOT new session but instead compact session
  instruction - the compact can recieve some prompt, use "this is auto compact, so try to remember everything the user talked with you other than daily news or security or hub notifications"
4. upgrade to upstream 2026.7.1, remember that we always prefer upstream code an repatch our stuff
5. currently whatsapp disconnects every update so make sure you can send me a message to the wa channel


any questions for append to this file and i will answer inline

---

# Claude — findings + questions (2026-07-21)

I ran four read-only investigations first (VPS inventory, git archaeology on the old WA
recorder, FIX-05/compaction code paths, upstream 7.1 scoping). Nothing was changed anywhere.
Answer inline under each **A:** — a bare "yes" means take my recommendation.

## What I found that changes the shape of your list

- **Kapso is already dead on the VPS, twice over.** (a) `channels.whatsapp-kapso` is GONE from
  the live `openclaw.json` — there's a backup literally named `openclaw.json.bak-kapso-park`
  dated Jul 3 08:51 holding the old block with real creds. (b) Independently, the plugin is
  blocked at load: `suspicious ownership (… uid=1001, expected uid=0)` — every file under
  `~/.openclaw/npm/projects/whatsapp-kapso-claw/` is owned by `coder:coder`, not root. It never
  even appears in `openclaw plugins list`. So task 1 is cleanup of a corpse, not a live surgery.

**A:** — i dont care, do a full cleanup

- **WA history recording has been dead ~2 weeks.** `~/.openclaw/wa-claw-kapso/wa-claw-baileys.db`
  is 227 MB, last written **Jul 7 11:00**. Nothing since.

**A:** — so when u talke old commit for baylies, use the path last used there. move and rename this db there.

- **The old in-fork recorder is fully recoverable** — 163 lines, `node:sqlite` built-in (zero new
  deps), last good version at commit `5475e57965`. The hook site in `session.ts` (right before
  `return sock;`) is byte-stable to this day. Re-applying it is genuinely easy.

**A:** — yes

- **Upgrade 6.11 → 7.1 is 3,368 commits / 8,767 files.** Good news: WhatsApp is *additive only*
  (82 files, +2.7K/-354, no deletes/renames) — this is NOT another 3.13 disaster. 12 of our 36
  patched files are byte-identical at 7.1. Bad news: **upstream deleted the entire `ui/src/ui/`
  tree** (386 files, -163K lines) and rebuilt the Control UI as a page-router layout. All six
  SEC-97 UI files no longer exist. That's a rewrite, not a re-apply — it's the single biggest
  cost in this whole list. See Q14.

**A:** — wait with this one, just build new ui, and let me see it and point you to the goal of auto show settings

- **The VPS checkout is dirty**: `M npm-shrinkwrap.json` + ~17 `T` type-changes on CLAUDE.md
  files (the known `core.symlinks` drift). I'll reset it as part of the deploy, just flagging it.

**A:** — yes


- **Loose credential**: `/root/.config/systemd/user/wa-claw-panel.service` is disabled+dead but
  still on disk with a plaintext `OPENCLAW_GATEWAY_TOKEN=VeXUMe-…` in it. Covered by Q4.

**A:** — part of kapso cleanup, clean it all


## Task 1 — remove openclaw-kapso completely

**Q1. The three kapso agents.** `kapso-pinhas` / `kapso-elhanan-k` / `kapso-igal` still exist as
agents (`agents.list[1..3]`), with bindings (`bindings[0..2]`) pointing at the now-nonexistent
`whatsapp-kapso` channel, plus workspaces at `~/.openclaw/workspaces/kapso-*` and agent dirs at
`~/.openclaw/agents/kapso-*`. Delete all of it, or keep the agents and re-point their bindings at
the normal `whatsapp` channel so Pinhas/Elhanan/Igal still reach their agents through your own line?
*Recommendation: delete bindings + agents from config, but leave the workspace/agent dirs on disk
(they hold conversation history and cost nothing) — reversible.*
**A:** remove them all, the workspaces, from the openclaw.json, and look for other mentions. user `openclaw agents delete ...` 1st then make sure workspace and openclaw.json are clean from them

**Q2. The 227 MB message database.** `~/.openclaw/wa-claw-kapso/wa-claw-baileys.db` holds all WA
history up to Jul 7. Keep it and have the restored in-fork recorder (task 2) continue writing to
that same file, or start clean and archive this one?
*Recommendation: keep and continue writing to it — you lose nothing and history stays continuous.
Ties into Q6.*
**A:** answered above

**Q3. The socket tap in our fork.** `extensions/whatsapp/src/session.ts` carries the
`__waClawSocks` / `__waClawSockTap` lines that exist purely to feed the kapso plugin. If the
plugin is gone and the recorder comes back in-fork, that's dead code. Remove it?
*Recommendation: remove it — one less keep-ours patch to carry through every future merge.*
**A:** yes

**Q4. The panel + its network surface.** Currently: nginx `/etc/nginx/conf.d/wa-claw.conf`
listening on HTTPS **:17890** (open in ufw, cert at `/etc/ssl/wa-claw/`) proxying to the gateway's
`/whatsapp-kapso/panel/`, plus the dead `wa-claw-panel.service` unit with the plaintext token.
Tear the whole thing down — nginx conf, ufw rule, cert, unit file? And do you want *any* way to
browse WA history afterwards, or is the sqlite file alone enough?
*Recommendation: tear it all down (that's an internet-exposed port serving a dead app), and treat
"a panel" as a separate future task if you want one. Also rotate that gateway token.*
**A:** yes

**Q5. Backups and leftovers.** Delete `openclaw.json.bak-kapso-park` (has real Kapso creds in
plaintext), `~/.openclaw/dev-mode/wa-claw.env`, the compat symlinks, and the 225 MB pre-migration
backup `openclaw-whatsapp-claw.db.bak-20260702`?
*Recommendation: delete the two credential files, keep the .db backup until task 2 is verified
working, then delete.*
**A:** remove all

**Q6. Also, the `coder` thing.** Lots of stuff under `~/.openclaw` (the DBs, browser profiles,
JarvisHub's `hub.db`) is owned by `coder:coder` (uid 1001) while the gateway runs as root. That's
what blocked the plugin. Do you know why that account touches these files — is something else on
the box running as `coder`? If I chown the WA db to root, will that break whatever `coder` is?
**A:** mistake. code is a user for a browser based mini vscode so i asked it to have read write perms on everything on this machine. maybe you can set it correctly? it has its specific app (read docs/ari-japps md or something, its port is 38080)

## Task 2 — bring the WA→db logging back into the fork

**Q7. DB path — confirm.** You said "look in server to correct last location". The current
location is `~/.openclaw/wa-claw-kapso/wa-claw-baileys.db`. The fork's *original* default was
`~/.openclaw/dev-mode/wa-history.db` (which today is a symlink chain pointing at the kapso one).
Which do you want as the real path going forward?
*Recommendation: keep the data file where it is but rename the directory to something
plugin-neutral, e.g. `~/.openclaw/dev-mode/wa-history.db` as a real file (move the 227 MB there),
since the kapso plugin is being deleted and the name would be a lie.*
**A:** i want u to move and rename it to `~/.openclaw/dev-mode/wa-history.db`, just like old code

**Q8. Schema.** The plugin's DB added a `phone_e164` column to both tables that the old fork
recorder didn't have (it handles the `@lid` JIDs that Baileys 7.x introduced — genuinely useful).
Restore the old recorder verbatim, or restore it *with* that column ported in so it stays
compatible with the existing 227 MB file?
*Recommendation: port the column in. Verbatim restore would write NULLs into an existing column
and lose phone-number resolution on modern Baileys.*
**A:** add it in

**Q9. Activation.** Old behaviour required BOTH `OPENCLAW_DEV_MODE=1` and
`OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES=1`. Keep it opt-in, or always-on whenever dev-mode is on?
*Recommendation: always-on under dev-mode. One less flag to forget after a redeploy — which is
exactly how it silently died before.*
**A:** remove all flags from everywhere and only keep `OPENCLAW_DEV_MODE=1` for everything

## Task 3 — FIX-05: compact instead of new session

Feasible, and the machinery is already there: the same `compactEmbeddedAgentSession` that `/compact`
uses accepts a `customInstructions` string that lands in the summarization prompt. The existing
inline "force a compaction before this turn runs" stage (`runPreflightCompactionIfNeeded`) is the
natural hook — it already sits where workspace/provider/model are known. So the plan is: let the
session detect "you'd normally roll over now", but instead of minting a new session id, force a
compaction with your prompt and keep going.

**Q10. Timing.** The compaction should run *before* the agent answers the first message after the
gap (so the reply lands post-compaction, exactly like `/compact` does) — which means that one
message is slower. The alternative is fire-and-forget, which is fast but the reply is generated
against the un-compacted context. Which?
*Recommendation: block. It's once per day and correctness beats latency.*
**A:** yes + one of our fixes brough back that after compact do a greeting, so we have a warmup. so we are double ok

**Q11. When exactly does it fire?** Today with no `session.reset` configured, the *stock* default
would be "daily at 04:00 local". So: compact once per day at the 4am boundary (i.e. on the first
message after 4am)? Or a different trigger, e.g. idle-based?
*Recommendation: daily 4am boundary — same schedule stock openclaw would have reset on, just
compacting instead of resetting.*
**A:** current upstream is time trigger base. 4am just "/new". so we so the same just "/compact" at 4am


**Q12. Memory flush too?** FIX-06 already forces a `memory/YYYY-MM-DD.md` flush on `/compact` and
`/new`. Should this auto-compact also force that flush?
*Recommendation: yes — it's the same "end of a chapter" moment, and it's the thing that actually
makes the day's context survivable.*
**A:** YES, very important! 

**Q13. The prompt.** Hardcode `"this is auto compact, so try to remember everything the user talked
with you other than daily news or security or hub notifications"`, or make it overridable via env
(`OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT`) so you can tune it without a rebuild+redeploy?
*Recommendation: env-overridable, with your text as the built-in default. Costs nothing and you'll
want to tune it.*
**A:** yes

## Task 4 — upgrade to upstream 2026.7.1

**Q14. SEC-97 (the Control UI dev-mode patches) — this is the expensive one.** Upstream deleted
every file those patches live in and rebuilt the config UI around a page router. SEC-97 does four
things: skip Quick Settings, force the raw JSON view, un-blur sensitive values, and a localStorage
hint so the first paint after reload doesn't flash Quick-Settings first. Pick one:
  - **(a) full re-implementation** against the new layout — biggest time cost, same end result.
  - **(b) minimal subset** — force raw view + un-blur only, drop the pre-paint flash fix.
  - **(c) defer entirely** — ship the upgrade with stock UI behaviour, revisit later.
  Also relevant: upstream shipped "declutter Settings + persistent Simple/Advanced switch" in this
  window, which may already give you most of (a) natively.
*Recommendation: (b) now, and look at upstream's persistent Simple/Advanced switch first — it may
make (b) a config toggle rather than a patch.*
**A:** answered, leave it now, let me see the new ui, and point you later. skip for now

**Q15. Order of operations.** I'd rather do the **upgrade first**, then apply tasks 1/2/3 on top of
7.1 — otherwise I write the FIX-05 and recorder patches twice (once on 6.11, again after the
rebase). Downside: you're on the old build a bit longer. Agree?
*Recommendation: yes — upgrade first, then patches, one deploy at the end. Task 1 (kapso removal)
is VPS-side and can happen immediately in parallel since it's already dead.*
**A:** same

**Q16. Version.** Upstream already has `v2026.7.2-beta.3` tagged. Stick with the stable `v2026.7.1`
as you asked, or jump?
*Recommendation: stick with 7.1. Betas on a box you actually use is how you lose a weekend.*
**A:** stable
 
## Task 5 — WhatsApp survives the update

Nothing to decide, just confirming the plan: after deploy I wait out the known ~2-minute WA
listener warm-up, then send you a real message via
`openclaw message send --channel whatsapp` (the `--channel` flag is mandatory since two WA-family
channels existed — and after task 1 removes kapso, implicit sends should start working again).
If the listener doesn't come back I'll dig into the log rather than blind-restarting.

**Q17.** Anything else you want in that test message beyond "deploy N done, WA alive"?
**A:** send me some love ♥ ☺
