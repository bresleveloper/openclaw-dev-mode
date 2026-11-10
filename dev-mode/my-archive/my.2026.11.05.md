tasks (2026-11-04/05, Windows PC session):

1. "the server openclaw is dead, audit and revive, it worked on glm, moved it back to opus and it crashed"
2. "keep uploads out of the indexed folders. thats it for now"
3. "HuggingFaceGames/ACE/ delete this, its old shit. put uploads in git ignore"
4. "i want the cron of blog to always use opus 5.5. does opustream solved the issues with using claude -p as
   engine? our issues is that its 2 steps instead of 1 (ollama = api call. claude = sdk call + api call) and thats
   the hub 30s issue, its a temp patch for that. also moving between models. i want my default model to be kimi2.7
   but to be able to spwan claude subagents, and have crons to opus. dont change anything. send legion of sonnets
   each to investigate 1 issue. but 1st update this local to upstream, remember to not bring any automations and
   git actions, just the latest code, them re implement my changes, then send a sonnet to update my dev. when all
   the update is done then sent the sonnets to investigations, and prepare report i will be back tomorow. and put a
   line in the readme for nov 5 about updating to whatever major release is available"

---

# Claude — session log (2026-11-04/05)

## 0. Where things stand (read this first)

- **Done:**
  - The VPS was revived on 11-04: runtime pin cleared, CPU hog found.
  - Uploads are out of the memory index, ACE is deleted, uploads are git-ignored.
  - The **source upgrade to V2026.10.10** is complete and validated: typecheck, lint and fork tests 48/48 pass. It
    sits on local branch `upgrade-2026.10.10` (`2d3b4dc767e`) with the README "2026-11-05 updated to v2026.10.10"
    line.
  - Five read-only investigations (§5).
  - Nothing on the VPS was changed after 21:21 UTC.
- **Not done:**
  - Build, push and deploy. Claude Code stopped the build for low memory (§4), and its rule is no restart without your
    OK.
  - **More important: 10.10 must not go to the VPS as is.** It refuses every scheduled Claude (claude-cli) run when
    Claude Code is fed the pasted setup-token instead of its own login. That is your setup, so all your crons fail,
    the 03:00 blog included (§5.0).
- **One root, three symptoms.** The VPS's `claude` binary has no native login: our 10-11 notes say so, and one
  `claude auth status` on the VPS will confirm it. OpenClaw feeds it the pasted setup-token instead. 10.10 counts
  that as "missing auth" for:
  - crons (verified)
  - Claude subagents (likely)
  - `/model` runtime choice, which is the `/opus` → "Runtime set to openclaw" bug you hit on 11-04 (likely; already
    present in 10.4)

  **Recommended fix: log Claude Code in natively on the VPS** (`claude auth login` as root, about 5 minutes, needs
  you), then retire the pasted token profile. This is upstream's supported path, needs no fork code, and is the
  cleanest under the compliance doc. It can be done and tested on 10.4 before the deploy. The alternative is fork
  patches (FIX-12 cron gate + FIX-11-A readiness).

- **Your questions, short:**
  - **Blog cron on Opus:** pin it per job (`openclaw cron edit <id> --model anthropic/claude-opus-5-5 --thinking high
--fallbacks ""`). It works on 10.4 today, and then flipping main to kimi won't move it (§5.A).
  - **"Did upstream solve claude -p?"** No. There is no compliant single-step route, and upstream chose the CLI
    latency on purpose. The second step isn't what kills the hub: Opus turns take 6–14 s when the CPU is calm (§5.B).
  - **Hub 30 s:** the real fix is OpenClaw's webhook `POST /hooks/agent`. It returns at once, the run can't be killed,
    it uses its own session, and OpenClaw delivers the reply to WhatsApp. It works on 10.4 today with a hot config
    block (§5.C).
  - **Moving between models:** use `/opus --runtime default` until the root fix. Every compaction or `prompt-tools`
    reset wipes Claude's session memory (§5.D).
  - **kimi default + Claude children:** one hot config change plus `/new`. Children pick their own runtime, so they
    land on claude-cli. Probe one Haiku and one Opus child after the root fix (§5.E).
- **Decisions waiting for you:**
  1. Restart the build? Close heavy apps first.
  2. Native Claude login on the VPS (recommended), or fork patches?
  3. The README FIX-10 diff in §6.
  4. Which proposals to apply. Nothing was applied, per "dont change anything":
     - blog pin
     - hub → `/hooks/agent`
     - kimi flip (`agents.entries.main.model`)
     - `/opus --runtime default` habit

## 1. VPS "dead" after `/opus` (2026-11-04 19:32–20:01 UTC)

The gateway never crashed (up since 2026-10-31 20:15 UTC). Two separate problems made it look dead:

- **Runtime pin.** `/opus` after GLM answered "Session model reset to configured default (opus…). Runtime set to
  openclaw for this session." The session entry then held `agentRuntimeOverride: "openclaw"`, so Opus skipped
  claude-cli and ran embedded on the setup-token (direct API = extra usage: 7 direct calls 19:28–19:33 plus the
  hub's turns). Embedded Opus first had to compact the WhatsApp session (one session since 2026-09-28, ~9,900
  events; GLM turns were sending ~800k tokens of history): 5 minutes, during which Ariel's messages queued, and
  `/new` killed the run ("⚠️ couldn't produce or deliver a reply"). Fixed 19:46 UTC with
  `openclaw gateway call sessions.patch --params '{"key":"<chat key>","agentRuntime":null}'` (no restart, no
  config change, no doctor; entry backup `/root/.openclaw/.recovery-20261104-194618/`). Next Opus turn: 27 s,
  `cli exec: provider=claude-cli model=claude-opus-5-5 … useResume=true`.
- **CPU.** The local memory-search embedder (`ollama` `qwen3-embedding:0.6b`, CPU) embedded a 1.4 MB upload saved
  at 13:10 into an indexed folder (`ari-vault/self-workshop/content-creation/uploads/…`): 1,076 chunks, both
  vCPUs at 100% for 6.5 h, the host throttled the VM (steal 63–80%; since-boot steal only 2.2%, so
  self-inflicted, not a neighbour). Finished ~19:57; afterwards ~93% idle, steal ~5%.
- 8 SSH logins 19:33–19:54 (each one is a hub "SSH Login Alert" on WhatsApp).

## 2. Uploads out of the memory index (21:12–21:17 UTC)

- Moved `ari-vault/self-workshop/content-creation/uploads/` → `/root/.openclaw/workspace/uploads/content-creation/`
  (same ACL: coder rwx, opusstudio r-x); the old path is a relative symlink to it. The indexer walks with
  `symlinks: "skip"`, so all 1,076 chunks left the index within 20 s, 0 embed calls since. No config change.
- Appended a marker-guarded rule to the workspace `AGENTS.md`
  (`<!-- openclaw-dev-mode: uploads-outside-memory-index (added 2026-11-04) -->` … `<!-- /… -->`): raw files go to
  `workspace/uploads/<topic>/`, never into `docs/`, `japps/`, `BresleveloperAiAgentsGitHub/` or `ari-vault/`.
- 2 SSH logins.

## 3. ACE deleted, uploads git-ignored (21:20 UTC)

- `BresleveloperAiAgentsGitHub/HuggingFaceGames/ACE/` deleted (66 MB, Feb 2026 Python venv + `ace-song` outputs;
  no process, unit, cron or container used it; untracked, so no git copy). Its 58 chunks left the index in 20 s.
  `HuggingFaceGames/` is left empty.
- Workspace `.gitignore` (the 01:17 `workspace-git-sync.sh` backup) gained `/uploads/` and
  `/ari-vault/self-workshop/content-creation/uploads` (the symlink).
- 1 SSH login.

## 4. Upgrade V2026.10.4 → V2026.10.10 (clean-room, no GitHub automation)

**Which release.** `v2026.10.10` (upstream 2026-11-02) is the latest stable; `v2026.11.5-beta.1` is only a beta.
10.4 is not an ancestor of 10.10: the common base is `8ea8bb11a5b` (2026-10-04). The 10.10 side has 7,174 commits
since then, 7,067 of them dated October.

**Process** (Opus wrote all the code, one session, no subagents):

- The fork patch is `git diff v2026.10.4 main` over added and modified files only, minus dist, docs and the tsconfig
  lists: 53 files.
- Checked per file against a temp index of the tag: 36 applied clean, 17 had drifted.
- Branched from the tag, then `git rm -r .github` (236 files: workflows, actions, codeql, templates; Ariel's rule
  "anything running on GitHub delete").
- `git apply --3way` left 12 conflicts. I resolved them by hand, then read `git diff v2026.10.10` of every touched
  file.
- Brought `dev-mode/`, `README.md` and `CLAUDE.md` over from `main`.
- Deleted upstream's tests (checklist 9: 20,263 files) and their entries in the three tsconfig file lists, plus the
  orphan `tsconfig.crabline-candidate.json`.
- Result against the tag: 18 files added, 37 modified, 20,500 deleted.

**Validation:**

- `tsgo:core` 2m21s, `tsgo:extensions` 2m29s, `tsgo:ui` pass
- oxfmt done, oxlint clean
- fork tests 48/48 (7 files)

**What upstream moved under the patches:**

- **SEC-98:** the "## OpenClaw Control" section moved to `src/agents/system-prompt-control.ts`, so the dev-mode update
  lines live there now. The tooling/hint block of `system-prompt.ts` was restructured, so that file was reset to the
  tag and its three hooks re-applied by hand: the `devMode` const, the Care line, the approval lines.
- **SEC-71:** `web_fetch`'s size helper was inlined into the tool body. The hook is now a ternary on
  `maxResponseBytes`.
- **SEC-101:** `agent-tools.ts` sits at its max-lines cap (an inline hook made it 702 > 700). The hook became a
  fork-owned same-name wrapper, `src/agents/fork-message-provider-policy.ts`, and `agent-tools.ts` only changes an
  import.
- **SEC-100 (still disabled):** the comment sites were re-anchored. `session-portal-target.ts` now calls
  `resolveGatewayOwnerOnlyToolDenylist()`; `reply-tool-authority.ts` lost `isReplyToolAllowed()`.
- **FIX-04:** the reset ACK goes through `commandReply()`.
- **SEC-WA1:** merged into the 10.10 WhatsApp reply plan.
- **SEC-103:** the provenance writer moved into a `compareAndApply` loop, and the hook moved with it.
- **FIX-07:** doctor's size-drop refusal is now one generic message, so one test assertion changed.
- **FIX-10 dropped:** upstream fixed it. Persistent cron wakes keep the chat's stable reply mode
  (`src/cron/isolated-agent/run-prepare.ts`, `usesExactRunSession`). The fork file, its test and the
  `run-executor.ts` hook are gone, and `run-executor.ts` is upstream again.

**What the deploy will meet:**

- **New startup gate:** 10.10 refuses to start with ACP metadata in the session DBs. The 21:53 preflight found 0 rows
  (state `acp_sessions` 0, `embedded_acp` 0 in all five agent DBs).
- **Agent DB schema 24 → 27:** `dev-mode/migrate-agent-dbs.mts` works unchanged (smoke run on an empty state dir:
  exit 0, target v27). `vps-deploy.sh` copies the DBs first and rolls back by itself.
- **pnpm pin 12.15.0:** the VPS's global 12.5.1 switches itself to the pin.
- **Node engines** are unchanged; VPS Node 24.21.0 is fine.

**Commits** (local, nothing pushed):

- `2d3b4dc767e` on branch `upgrade-2026.10.10`, holding the source plus the README line
- local tag `main-pre-2026.10.10` → `a3fff995871` (the 10.4-era `main`, one docs commit ahead of GitHub)

**Build: stopped by Claude Code, waiting for your OK.**

- `pnpm build` started 22:05 UTC. `tsdown-ai` finished in 2m43s.
- At 22:15, during `tsdown-packages`, Claude Code stopped it because the PC was critically low on memory: the
  build's `tsc.exe` was at ~10 GB while a Remotion render (`Downloads\VIDS\shorts\…\render.mjs`) also ran.
- Claude Code's rule after such a stop is to restart only when asked, so I did not restart it.
- I killed the orphaned build processes. Free RAM went 3.5 → 14 GB, and it was 17.6 GB at 00:20 Israel time once the
  render had finished.
- To avoid a repeat, close heavy apps first, or start Claude Code with `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`.

**After your OK:**

1. Full `pnpm build` (~45 min here).
2. Stage dist (regular files only, `--no-verify`) and check runtime `@openclaw/*` imports.
3. Squash onto `main` as one commit (`commit-tree` + `update-ref`) and push `main` plus the tag. The VPS pulls only
   the new files.
4. A Sonnet deploys with `dev-mode/vps-deploy.sh`: DB copies, migration, auto-rollback, no doctor. One login for the
   deploy and one for the checks.
5. Keep clear of the blog crons (01:00 and 01:30 UTC) and the 01:17 UTC workspace git sync.

## 5. Investigations (five Sonnet agents, read-only, no SSH)

Five Sonnet agents worked from the 10.10 source plus a read-only VPS snapshot taken in the 21:53 login (config
subsets, crons, session rows, filtered logs; `dev-mode/tmp/vps-snapshot-2026-11-04.txt`, gitignored). None of them
logged in. Their full reports are in `dev-mode/tmp/investigations/` (gitignored, they quote raw VPS data). Opus
re-checked the claims below in the code. Nothing was changed anywhere ("dont change anything").

### 5.0 Deploy blocker found by the cron investigation: 10.10 refuses scheduled claude-cli runs

- **The new gate.** 10.10 adds "inference account continuity" for automations. A scheduled run on claude-cli is
  refused when OpenClaw would forward a stored login to the `claude` binary and the job has no recorded inference
  account. The error is "Automation has no recorded inference account. Explicitly select its account with a
  model@profile update before running it." There is no fallback to another model, by design.
  - Code: `src/cron/isolated-agent/run-prompt-executor.ts:513` (isolated jobs),
    `src/auto-reply/reply/agent-runner-cli-candidate.ts:215` (chat-bound jobs), `src/agents/cli-runner/prepare.ts:423`
    (`nativeAuthOnly`). None of it exists in 10.4.
- **The suggested fix doesn't work for CLI jobs.** A claude-cli job can never get such an account: cron
  create/edit records none for CLI routes (`src/gateway/server-methods/cron-input-validation.ts:370-397`, "CLI
  backends own their login"). So the `model@profile` advice in the error does not help. Upstream's docs say it
  outright: "CLI-native login and configured credentialless inference do not require adopting a host profile; an
  unbound CLI job cannot select or automatically borrow one. Doctor does not infer a job's historical inference
  account." (`docs/automation/cron-jobs/troubleshooting.md:37`).
- **Why it hits the VPS.** The VPS runs Claude through the pasted setup-token profile `anthropic:manual`, and the
  binary has no native login of its own. On 10.10, **every cron that runs on Opus through claude-cli would fail**:
  today that is all of main's crons, the 03:00 blog included. The run starts and is then refused.
  - Chat turns are not affected ("normal agent turns can also use a saved subscription token").
  - Webhook runs are not affected either (`trigger: "event"`, `src/gateway/server/hooks.ts:540`).
- **How sure.** The code path is certain, and upstream's own test pins it. That the VPS auth state triggers it rests
  on our docs ("no native login", profile `anthropic:manual`): about 90%. One read-only look on the VPS settles it.
- **Ways out (your call):**
  - **(a) Native Claude login on the VPS, no code.** This is upstream's supported path, and the most compliant one:
    the official binary on its own login.
    - Run `claude auth login` as root over SSH: it prints a URL, you open it on any machine and paste the code back.
    - Then stop OpenClaw from forwarding the pasted token: remove `anthropic:manual`, or leave only the native
      profile in the Anthropic auth order.
    - Chat turns then use the native login too, and the WhatsApp chat's Claude session restarts once with a history
      note.
  - **(b) Fork patch (FIX-12).** In dev-mode, scheduled claude-cli runs may forward the stored token like chat turns.
    That means three guarded hooks plus a fork-owned helper and test. It keeps today's setup, but adds fork surface
    in code upstream just reworked.
  - Recommended: (a). It needs no fork code and follows upstream's own model. Choose (b) if you want to keep the
    setup-token.
- **Until this is settled, 10.10 is not deployed**, even after the build. Today's one-shot reminders and the 03:00
  blog run on 10.4 as usual.

### 5.A Blog cron (and crons in general) always on Opus 5.5

Report: `dev-mode/tmp/investigations/A-crons-on-opus.md`.

- **How a cron picks its model** (10.10, same as 10.4; verified in `src/cron/isolated-agent/model-selection.ts:295-343`):
  1. the job's own `payload.model`
  2. a stored override on the cron's session row
  3. `subagents.model` (agent-level, then defaults)
  4. the agent's primary

  There is no cron-level default. **None of your 20 jobs pins a model**, so today they run Opus only because main's
  primary is Opus. Flip main to kimi and every unpinned cron silently moves to kimi.

- **Pin the blog jobs**, harmless on 10.4. One SSH session; ids in the report:
  ```
  openclaw cron edit <daily-blog-create id> --model anthropic/claude-opus-5-5 --thinking high --fallbacks "" < /dev/null
  openclaw cron edit <daily-blog-notify id> --model anthropic/claude-opus-5-5 --thinking high --fallbacks "" < /dev/null
  ```
  - `--fallbacks ""` makes the job Opus-only. Without it, a failed Opus run can end "ok" on main's fallback, kimi.
  - The blog jobs have no failure route (`delivery: none`). `--failure-alert --failure-alert-after 1
--failure-alert-channel whatsapp --failure-alert-to <your number> --failure-alert-mode announce` makes failures
    loud.
  - A cron edit writes the cron store, not `openclaw.json`, so it doesn't restart the gateway.
- **The route stays compliant.** An Opus pin on an isolated job resolves to claude-cli via
  `agents.defaults.models["anthropic/claude-opus-5-5"].agentRuntime.id`. Main's default model is not an input. 16
  cron runs on 11-03/04 logged `cli exec: provider=claude-cli model=claude-opus-5-5`.
- **Trap: `current` jobs copy the chat's state.** The 8 `sessionTarget: "current"` jobs copy the chat row's model
  override at fire time, plus its runtime pin when an override exists. Proof: on 11-04 at 14:00 UTC,
  `daily-calendar-check` ran GLM embedded with `agentRuntimeOverride: openclaw` copied from the chat. So switch main
  to kimi in config, not with `/kimi` in the chat. Reminders that only send a WhatsApp nudge are better as `isolated`
  - announce.
- **Limits.** A ~7 min blog run is safe: the scheduler ceiling is 60 min and the claude-cli silence watchdog is
  10 min.
- **10.10 extras.**
  - The two `skill-collection-review:*` jobs are deleted when the store loads, so 20 jobs become 18 (verified,
    `src/cron/store/load.kernel.ts`).
  - Missed slots after a restart are caught up about 2 min later instead of being dropped.
  - **The auth gate in §5.0** decides whether any of this works on 10.10.
- **Config drift found.** The VPS config now has only 5 models: 3 Ollama, plus Opus 5.5 and Haiku 5.5 on claude-cli.
  CLAUDE.md and `claude-compliance.md` still say 10 Claude models.

### 5.B Did upstream fix the `claude -p` two-step overhead?

Report: `dev-mode/tmp/investigations/B-claude-cli-engine-overhead.md`.

- **No, and there is no compliant way to remove the second step.** 10.10 drives Claude Code exactly like 10.4:
  - one persistent `claude --print` process per OpenClaw session, speaking stream-json (the Agent SDK's own protocol)
  - `--resume` after a restart
  - OpenClaw tools over an in-gateway MCP loopback
  - 10 min idle limit, cap 16 processes

  The live-session registry and fingerprint files are byte-identical to 10.4 (verified). Upstream says it outright:
  "Subscription-auth callers opt into CLI latency to avoid metered direct-API passthrough"
  (`src/agents/embedded-agent-runner/cli-backend-dispatch.ts:1`). The only single-step Claude route is embedded on the
  token (forbidden by the compliance doc). `--bare` is stripped because it "drops OAuth". "opustream" = "upstream"
  (no such thing in the code).

- **But the second step is not what blows the 30 s.** Measured on 10.4 data:
  - With a calm CPU (11-04 21:09–21:25), Opus turns via claude-cli took 6.4–13.9 s (median 9.1 s). A cold start
    added only +0.3 to +2.2 s over a warm process.
  - The 30 s was eaten by OpenClaw's own work before the model call: on the embedded GLM hub turns, a median 16.3 s,
    58% of the window.
  - The rest went to slow first Ollama calls on the ~800k-token chat (22–35 s in a third of the runs), 16–75 s of
    queueing behind other turns, and the 6.5 h CPU hog (×1.6–3).
  - "Ollama = 1 step = fast" does not hold for this chat session.
- **What is claude-cli-specific: the abort loop.** When the hub hangs up, the abort kills the warm `claude` process
  (`extensions/anthropic/cli.runtime.ts:657`), so the next turn starts cold. 5 of 14 cold starts followed such an
  abort, and only 5 of 19 non-cron Opus turns found a warm process.
- **What 10.5–10.10 improves around the engine:**
  - session/SQLite work moved off the main thread (session actors; the VPS saw 20 s writes and 9.5 s history reads)
  - runtime facts out of Claude's system prompt, so fewer drift restarts
  - mid-turn steering
  - prompt-cache fixes
- **New 10.10 risk (verified):** a change in the tool list between turns now starts a **fresh** Claude session
  (`src/agents/cli-session.ts:310-314`; 10.4 resumed with a drift note). The VPS logged `reusable-drift:…,prompt-tools`
  often, e.g. when hub turns and WhatsApp turns alternate, so the chat's Claude session may reset more often on 10.10.
  Watch for `cli session reset: … reason=prompt-tools` after the deploy. One more reason to move the hub out of the
  chat (§5.C).
- **Best next measures, in order:**
  1. hub on its own path or session (§5.C)
  2. keep the 2 vCPUs free of the embedder
  3. smaller context windows for GLM/DeepSeek (900k/1M today), or periodic `/new` for heavy sessions
  4. lower thinking effort per session for routine traffic: per session, never per call, because a change restarts
     the process
  5. measure for a day with `OPENCLAW_DIAGNOSTICS=reply.profiler,ingress.timing` before touching engine code

  No keep-warm or idle knob exists.

### 5.C Hub 30 s: the real fix, not a timeout bump

Report: `dev-mode/tmp/investigations/C-hub-30s.md`.

- **Why it dies.** `/v1/chat/completions` ties the agent run to the HTTP socket. When the hub's `urlopen(timeout=30)`
  gives up, OpenClaw aborts the run. This is identical on 10.4 and 10.10, the docs say it outright
  (`docs/gateway/openai-http-api.md:255`), and nothing opts out. `stream: true` doesn't help either: no keepalives, and
  Python's timeout is per read.
- **The 30 s also covers the queue.** The 30 s includes waiting in your chat's lane: one alert waited 19.8 s and then
  ran 10 s, another waited 75 s and never started. Embedded prep alone took 9–17 s, and isolated claude-cli cron turns
  take 25–100 s. No 30 s synchronous design can work.
- **Where the 30 s came from.** The hub repo on GitHub has `timeout=120` and no session-key header. The VPS copy
  changed both. Your agent's own "todoz" backlog says: "hub wake 30s stopwatch + fat-session turns >30s since the
  claude-code-sdk change … restore 120s + add retry, compact the session, wire the sweeper"
  (`research/ollama-alerts-issues.md` on the VPS). That is the temp patch.
- **The real fix: post to OpenClaw's webhook `POST /hooks/agent`.** Verified in code and docs.
  - It answers `{ok, runId}` once the run is admitted (≤15 s).
  - The run is detached from the socket and is never killed.
  - It runs in its own isolated session, not your chat lane.
  - With `deliver: true, channel: "whatsapp", to: <your number>`, OpenClaw itself delivers the final reply to
    WhatsApp, the same way your bedtime and baby-love crons already deliver.
  - Hook runs use `trigger: "event"`, so the §5.0 gate doesn't touch them.
  - It works on 10.4 today.
- **What it needs:**
  - **A `hooks` block:** `enabled`, its own token (not the gateway token), `allowedAgentIds: ["main"]`. `hooks` is
    hot-reloaded, so no deploy.
  - **About 30 lines in the hub:**
    - an `Idempotency-Key` per alert
    - retry on 503
    - coalesce bursts, e.g. four SSH logins become one message
    - drop the "use the message tool + curl /done" instructions; the hub marks done itself
    - fallback when hooks are down: a direct no-LLM `openclaw message send`

  The exact config and Python sketch are in the report.

- **Side benefits:**
  - alerts leave your chat: no more orphaned "merged" messages, no lane waits for your own messages
  - the alert text, which can be attacker-influenced (SSH usernames and hosts), arrives wrapped as external content in
    a non-owner turn instead of an owner turn
  - the hub no longer holds the gateway admin token
  - on 10.10 the delivered alert is also mirrored into your DM transcript, so "was that me?" has context

### 5.D Moving between models (the `/opus` → "Runtime set to openclaw" bug)

Report: `dev-mode/tmp/investigations/D-model-switching.md`.

- **Still in 10.10.** The relevant code is the same as 10.4 (verified):
  - When `/opus` is evaluated, OpenClaw lists the runtimes that are "available" for Opus and takes the first one if
    claude-cli isn't among them (`src/agents/model-runtime-choice.ts:416-420`).
  - A stored `openclaw` pin is accepted for every provider (`src/agents/session-runtime-compat.ts:64-66`), so it
    survives every later `/glm` and `/opus` and keeps Opus embedded.
- **Root cause.** claude-cli counts as available only with a native Claude login, or with an Anthropic account
  _selected_ on the session. `/glm` drops the session's Anthropic account pin (`src/sessions/model-overrides.ts:127`).
  So at the next `/opus` nothing is selected, the only choice is `openclaw`, and that is written and announced. Code
  verified; the chat row's exact values at that moment are inferred (80%).
  - A plain Opus→Opus session works because every reply re-pins the only Anthropic account.
- **What a switch does to context:**
  - The Claude session binding survives an Ollama detour. Claude never sees the other model's messages: 10.10 adds a
    one-line note ("N messages from glm, call `sessions_history`"), and 10.4 added nothing.
  - Embedded runs (GLM/kimi/embedded Opus) run OpenClaw's own compaction on the 37-day chat. A compaction wipes
    **every** Claude binding (`session-entry-projection.ts:112`), so the next Claude turn starts fresh.
- **`cli session history refused across auth boundary: reason=auth-unknown`** (your open item) means "this transcript
  has events Claude did not write (GLM/kimi/hub turns), so ownership is unprovable", not an auth failure.
  - It is harmless on resumed turns.
  - After any binding loss (compaction, the new 10.10 `prompt-tools` reset, `/new`) the fresh Claude session gets no
    history at all. That is the amnesia.
- **Fixes:**
  - **Habit now, 10.4 and 10.10:** switch back with `/opus --runtime default`. It clears the pin and skips the broken
    choice. Check `/status`.
  - **Root fix, no code:** a native Claude login on the VPS. claude-cli then counts as available, so the choice
    includes it (same fix as §5.0 and §5.E).
  - **Fork alternative:** FIX-11-A, about two hooked lines in `model-auth-availability.cli-runtime.ts` plus a fork
    helper: in dev-mode a stored Anthropic token counts as claude-cli readiness. It fixes `/opus` and Claude children,
    but not the cron gate.
  - **Optional invariant:** FIX-11-B, never accept `openclaw` for `anthropic` in dev-mode.
  - The config-only `@anthropic:manual` on main's primary only helps while Opus _is_ the primary, which clashes with
    the kimi plan.
  - Simplest workflow: keep the chat on one model and run other models as children.

### 5.E kimi as main's default, Claude subagents on demand

Report: `dev-mode/tmp/investigations/E-kimi-default-claude-subagents.md`.

- **The switch is one hot config change.** `agents.defaults.model` is already kimi; only main overrides it. Set
  `agents.entries.main.model = { primary: "ollama/kimi-k2.7-code:cloud", fallbacks: ["anthropic/claude-opus-5-5"] }`.
  - The fallback must sit on `main` itself: an agent-level `model` does not inherit the defaults' fallbacks.
  - Opus is the only fallback independent of the Ollama quota, and it runs via claude-cli unless the session carries
    an `openclaw` pin.
  - Thinking `high` is valid for both models.
  - Then send `/new` in WhatsApp. That avoids a multi-minute kimi-side compaction of the 37-day transcript and clears
    any pin.
- **Children pick their own runtime.** A kimi parent spawning `model: "anthropic/claude-opus-5-5"` gets a child whose
  runtime is resolved from the child's model (claude-cli), never inherited from the parent. Your past Claude children
  show exactly that.
  - kimi only sees the aliases KIMI, GLM, DEEPSEEK and HAIKU. Add an `OPUS` alias, plus a marker-guarded
    "which model for which task" rule appended to AGENTS.md, so it actually picks Claude when it should.
- **10.10 risk (verified in code, effect on the VPS needs a probe).** 10.10 refuses to spawn a model whose
  native-runtime route is not confirmed available ("The selected account or native runtime is unavailable for
  anthropic/claude-opus-5-5"). Without a native Claude login the claude-cli route counts as "missing auth"
  (`src/agents/model-runtime-choice.ts:194-206`, new `src/agents/model-auth-availability.cli-runtime.ts`).
  - The runtime-choice list also drops routes that aren't confirmed available, so this is most likely the root of the
    `/opus` → "Runtime set to openclaw" bug as well (§5.D).
  - Since the 10.4 deploy no Claude child has been created at all. Your 11-04 Haiku child left no session row.
  - Upstream's workaround is an account pin on the model string (`OPUS@anthropic:manual`). A native login fixes it
    properly.
- **No `claude` agent exists.** `agents.entries` has only `main` and `skill-suggester`. The ACP harness called
  `claude` runs Claude Code against Ollama/kimi, not Anthropic. A dedicated Opus agent is possible, but not under
  that name (report option C).
- **Mind the Claude processes.** Each Claude child is one warm `claude` process: 10 min idle, cap 16. `swarm` is on by
  default with up to 32 collectors, far more than 7.8 GB can host. Keep Claude children ≤3 (`subagents.maxConcurrent`)
  and consider `tools.swarm.enabled: false`.
- **FIX-08 is not in the way.** `openclaw`/`gateway` are on every subagent's deny list, and a kimi parent runs tools
  in-process. The 10-10 child crash ("session writer claim changed…") is now retried by upstream. Don't `/new` the
  chat while children run.
- **Don't set `subagents.model`.** It also becomes the default of every unpinned cron, and of every child spawned
  without a model.

## 6. README

- **Added, as you asked**, in the shape of the 2026-10-16 entry. It is part of `2d3b4dc767e` and reaches `main`
  with the squash:
  ```
  - 2026-11-05
    - updated to v2026.10.10
  ```
- **Proposed only, NOT made** (your README rule). FIX-10 no longer exists in the fork, but the README still has its
  row. Your style for a dropped fix (FIX-05/06) is: delete the row and add a changelog line. The proposed diff:
  ```diff
   - 2026-11-05
     - updated to v2026.10.10
  +  - removed FIX-10 => upstream fixed it, cron jobs aimed at a chat keep the chat's session now
  ...
  -| FIX-10 | cron job aimed at a chat (`sessionTarget: "session:<key>"`) keeps that chat's Claude CLI session - upstream reset it on every run and again on the next chat turn, so the agent forgot the chat |
  ```
  Say OK and I commit it exactly as shown, with `--no-verify` and a `cmp` check.
- Still open from 2026-10-17: the "Care" question (`my.2026.10.16.md` §8). If dev-mode keeps the config caution
  line, the SEC-98 row's "(approval, config caution)" should lose ", config caution".

## 7. SSH logins this session

12 logins, all mine: 8 between 19:33 and 19:54 UTC (revive), 3 between 21:12 and 21:20 (uploads, ACE), 1 at 21:53
(read-only preflight + snapshot for the upgrade and the investigators). Each became a hub "SSH Login Alert" on
WhatsApp. The investigators did not log in; they worked from the snapshot.
