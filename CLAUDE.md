# OpenClaw Dev Mode

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw
- **Fork point**: commit `029c47372` (V2026.3.2)
- **Current base**: V2026.10.4 on `main` (clean-room from tag `v2026.10.4`, deployed and promoted 2026-10-16). See "V2026.10.4 Upgrade". Previous: V2026.9.6 (tag `main-pre-2026.10.4`), V2026.7.1 (tag `main-pre-2026.9.6`).
- **Purpose**: one env flag (`OPENCLAW_DEV_MODE=1`) relaxes OpenClaw's security for a single-owner dev VPS, plus WhatsApp and Control UI conveniences. User-facing summary with reasons: `README.md`.

## Branches

- `main` — Ariel's ONLY branch, at the V2026.10.4 base. Has `dist/` + `packages/ai/dist/` committed for easy VPS deployment. Experimental, practical, no polish needed.
- Tags (pushed): `main-pre-2026.10.4` (V2026.9.6-era head `a58f108dbdd`), `main-pre-2026.9.6` (V2026.7.1-era head `89a6d855229`), `main-pre-2026.7.1` (V2026.6.11-era head `244849d3575`).
- Future upgrades: same clean-room pattern — branch from the upstream tag, re-apply patches, deploy, force-move `main`.

## Post-Merge Cleanup Checklist (run after EVERY upstream merge)

1. **Remove the whole `.github/` directory** — `git rm -r .github` (workflows, composite actions, codeql, templates, policies: 230 files at 10.4). Ariel's rule (2026-10-16): "anything that is running on GitHub delete, anything running local keep" — so GitHub automation goes; local tooling (git-hooks, pre-commit config, vitest/oxlint scripts, deploy manifests) stays. Nothing in the build or at runtime reads `.github/`.
   Also: the upstream tag has NO `dev-mode/`, no fork `README.md` and no fork `CLAUDE.md` — after branching from the tag, `git checkout main -- dev-mode README.md CLAUDE.md` (10.4 lesson: the source patch alone leaves the VPS update recipe without `dev-mode/link-dist-plugin-deps.sh`).
   Since 10.4 the vitest worker compiler copies `.github/workflows/plugin-npm-release.yml` as a worker asset and the whole compiled-subprocess build (every `|infra|`-style test) dies with ENOENT without it → fork guard in `scripts/lib/vitest-worker-compiler.mts` (skip missing assets; see "Source Files Modified"). Re-check after each upgrade that the guard is still in the asset-copy loop.
2. **WhatsApp build exclusion** — since 9.x the ONLY source is `package.json` `files` (`!dist/extensions/whatsapp/**`); `scripts/lib/root-package-bundled-plugin-excludes.mjs` derives the build excludes from it. Delete that line. If it slips back, the build DELETES `dist/extensions/whatsapp` and the VPS falls back to the stock ClawHub package.
3. **Keep-ours on `README.md`** — Ariel's landing page; see "README is Ariel's domain" below.
4. **Stage dist — regular files only**: `find dist packages/ai/dist -type f > /tmp/dist-files.txt && git add -f --pathspec-from-file=/tmp/dist-files.txt`, then commit with `--no-verify` (the pre-commit formatter would rewrite generated files). Plain `git add -f dist/` also grabs ~300 symlinks the build's `external-plugins:local-dist` step leaves under `dist/extensions/*/node_modules/` (links into this machine's pnpm store) — never commit those. The real-file shim `dist/extensions/node_modules/openclaw/` (plugin-sdk) IS committed. See the ⚠️ in Build & Deploy.
5. **Re-verify patches survived** — grep `isDevMode()` anchors in src/; on the VPS after deploy: `grep -rl attachWaHistoryLogger /opt/openclaw-dev-mode/dist/extensions/whatsapp/` and `grep -rl formatDevModeReasoningPayload /opt/openclaw-dev-mode/dist/extensions/whatsapp/` must be NON-empty.
6. **Self-referencing symlinks** — the TRACKED `packages/speech-core/node_modules/openclaw` → repo-root link (7.1-era `.git`-corruption hazard, see Upgrade History) is gone at 9.6. `pnpm install` still creates UNTRACKED `node_modules/openclaw` links in ~40 workspace packages (ignored dirs git never traverses) — never `git add -f` anything under `node_modules/`. On a 7.1-era checkout, `rm packages/speech-core/node_modules/openclaw` (plain rm) before switching branches.
7. **Stage `packages/ai/dist` with `git add -f packages/ai/dist/`** after every build — root `dependencies` has `"@openclaw/ai": "workspace:*"` and dist imports `@openclaw/ai/internal/*` at runtime. It is the ONLY workspace package dist imports at runtime at 9.6 (`@openclaw/session-url-contract` is a devDependency bundled into dist; `@openclaw/fs-safe`/`@openclaw/proxyline` are npm deps). Re-check per upgrade: `grep -rhoE "from ['\"]@openclaw/[a-z0-9-]+" dist | sort | uniq -c` vs root `dependencies`.
8. **Re-read the upstream-owned hooks** listed in "Source Files Modified" and the regression checklists in the fork-owned files' headers.
9. **Delete upstream test files** (Ariel, 2026-10-16: "delete from our fork all upstream tests"; under the same day's rule the fork's own tests and the local test tooling stay because they run locally) — the fork keeps only its own 6 tests. After branching from the tag: `git ls-files | grep -E '\.test\.(ts|tsx|mts|mjs|js)$' | grep -vE 'dev-mode/(echo-guard|reasoning)\.test|config-validate-fix\.test|config-content-fix\.test|dev-mode-greeting/handler\.test|fork-update-block\.test' > /tmp/t.txt && git rm -q --pathspec-from-file=/tmp/t.txt` (19,232 files / 275 MB at 10.4). Test infrastructure stays (`test/` setup + helpers, `*.test-support.ts`, `*.test-harness.ts`, `test-helpers/`, `test-utils/`): the fork tests import some of it, and the tsgo configs already exclude all of it. Upstream's suites are never run in the fork; validate re-homed hooks by reading the diff and running the fork tests.

## Dev Environment

- **Build machine (since 2026-09)**: Linux laptop (Arch/Omarchy), Node 26.8.1 via mise, pnpm via `npm i -g pnpm@<pinned>` (Node 26 ships no corepack; 10.4 pins 12.5.1). Git has no `user.name` — commits are authored `Claude <noreply@anthropic.com>` via `GIT_AUTHOR_*`/`GIT_COMMITTER_*` env.
- **Windows PC (built 10.4 on 2026-10-16)**: Node 24.18, Git Bash. The managed pnpm's `.CMD` shim is broken; call `node C:/Users/Ariel/AppData/Local/pnpm/.tools/pnpm/12.4.0/node_modules/pnpm/bin/pnpm.mjs` (it self-switches to the pinned version) and put a `pnpm` + `pnpm.cmd` wrapper dir first on PATH for scripts that spawn `pnpm`. Same commit authorship via env. Lint's `plugin-sdk boundary dts` prep step has a 300 s cap and times out here if tsgo runs alongside — run `pnpm build` first, lint after.
- **VPS**: Linux, OpenClaw installed with dev-mode. Ariel pulls and tests there.
- **Workflow**: Build/edit here → push → pull on VPS and restart gateway. Always ask permission before pushing. Always run full `pnpm build`. Do NOT run openclaw itself locally.

### Delegation: Opus writes code, Sonnet executes simple work

**Ariel, 2026-09-27**: the main thread (Opus) writes ALL code changes. Delegate to a Sonnet subagent (Agent tool, `subagent_type: general-purpose`, `model: sonnet`) only simple execution: VPS/SSH ops, git fetch, read-only investigations/fan-out analysis, builds/test runs. Verify subagent claims before acting — the 9.6 analyses were wrong three times (FIX-06 helper "compiles unchanged", `session-url-contract` "needs a dist force-add", "non-main sessions are sandboxed by default").

**Fork patch style (Ariel, 2026-09-28)**: touch upstream code as little as possible — logic in fork-owned files (`extensions/whatsapp/src/dev-mode/*`), one guarded hook in the upstream file, comments with a regression checklist.

### README is Ariel's domain

**NEVER change `README.md` without Ariel's explicit permission** (Ariel, 2026-09-29) — not even a typo, a changelog line, or formatting. Propose the exact diff and wait for his OK. When he hands over a README, commit it **exactly as written**: `git commit --no-verify` (the pre-commit formatter would realign his tables) and verify with `git show HEAD:README.md | cmp - <his file>`.

**Ariel, 2026-09-28** (after Claude rewrote the whole README): changes to `README.md` must ALWAYS be minimal. Before touching it, read the current README and learn Ariel's taste and style — his voice and wording (typos included), the header and logo block, emoji, table shapes, the changelog format — and match it. Add or adjust only the lines a change requires (e.g. one changelog entry, one table row). Never rewrite, restructure, re-order, or "improve" it. Detailed explanations belong in `CLAUDE.md` / `dev-mode/`, not the README. When in doubt, propose the diff and let Ariel decide.

### SSH Access to VPS

Laptop: dedicated key `~/.ssh/dev_vps_claude` (ed25519, comment `claude-code-dev-vps-laptop`, installed 2026-09-28) behind the alias `dev-vps` in `~/.ssh/config` (holds address, custom port, key). The old Windows PC used `~/.ssh/dev_vps`.
```
ssh dev-vps "COMMAND"          # batch several commands: ssh dev-vps 'bash -s' <<'EOF' ... EOF
```
Never log VPS connection details in commits or output. Batch commands into few sessions (see "VPS Watchdog"). Append `< /dev/null` to `openclaw` CLI calls over SSH (interactive prompts hang the pipe).

### VPS Layout

- **Fork**: `/opt/openclaw-dev-mode`; `/usr/lib/node_modules/openclaw → /opt/openclaw-dev-mode`; CLI wrapper `/usr/local/bin/openclaw` (runs `node /opt/openclaw-dev-mode/openclaw.mjs`)
- **Self-ref symlink**: `/opt/openclaw-dev-mode/node_modules/openclaw → /opt/openclaw-dev-mode` — still recreated by the update recipe (V2026.5.6 proved it necessary; re-verify on 9.6)
- **Home**: `~/.openclaw/` — config `openclaw.json`, env `.env` (`OPENCLAW_DEV_MODE=1`), WA creds `credentials/whatsapp/default/`, WA history `dev-mode/wa-history.db`
- **Gateway**: user-level systemd `openclaw-gateway.service` (`~/.config/systemd/user/`), port 18789, loopback. `journalctl` is empty — logs are `/tmp/openclaw/openclaw-YYYY-MM-DD.log` (JSON lines)
- **Owner (2026-10-11)**: `commands.ownerAllowFrom` = Ariel's WhatsApp number + Discord user id (`whatsapp:+…`, `discord:<id>` — the `discord:user:<id>` form is skipped by the matcher). It is the only source of owner status for chat turns now that SEC-100 is disabled. Config backup from before: `~/.openclaw/openclaw.json.pre-2026-10-11-fix09`.
- **Node**: v24.21.0 (nodesource apt, 2026-09-28) — satisfies 9.6 engines. OS: Ubuntu 24.04; pnpm 12.4.0 via `npm i -g`
- **Models (2026-09-28)**: default `ollama/kimi-k2.7-code:cloud`; `ollama/glm-5.3-flash:cloud` configured (reasoning always on, tools, 1M ctx, paid via Ollama Cloud credits) — good for testing 💭. Web search: `tools.web.search.provider = ollama` (works with any model; Z.ai's native search is not an OpenClaw provider).
- **Main agent on the Claude subscription (since 2026-10-10)**: `main` → `anthropic/claude-opus-5-5` (thinking `high`, fallback `ollama/kimi-k2.7-code:cloud`, `heartbeat.every: "0m"`) through the `claude-cli` runtime. Each session is a warm official `claude` binary (`/root/.local/bin/claude`, native installer; run `claude update` now and then) that gets Ariel's `claude setup-token` token on fd 3 (profile `anthropic:manual`, stored with `openclaw models auth paste-token --provider anthropic --agent main`). All 10 configured `anthropic/*` models carry `agentRuntime.id: "claude-cli"`. A Claude model without that route runs embedded and calls the API directly with the token (extra usage). Never add a `user-agent` or other header overlay on `models.providers.anthropic`. Known gap: the utility model `anthropic/claude-haiku-4-5` still calls the API directly (Ariel is handling it). Docs: `dev-mode/claude-sub/`.

## Build & Deploy

- **Build**: `pnpm build` (includes `ui:build`; ~7–11 min on the laptop). tsdown (esbuild) → `dist/`
- **Format**: `pnpm exec oxfmt <files>` (sorts imports; keep a file-header comment above the import that sorts first). **Lint**: `node scripts/run-oxlint.mjs <files>`. **Typecheck**: `pnpm tsgo:core`, `pnpm tsgo:extensions`, `pnpm tsgo:ui`. **Tests**: `node scripts/run-vitest.mjs run <paths>` — one command at a time; lint and vitest both rebuild stale dist artifacts under `.artifacts/dist-artifacts.lock`, so parallel runs serialize and look hung. Only the fork's 6 test files exist since 2026-10-16 (checklist item 9): `extensions/whatsapp/src/dev-mode/{echo-guard,reasoning}.test.ts`, `src/cli/config-validate-fix.test.ts`, `src/commands/doctor/config-content-fix.test.ts`, `src/hooks/bundled/dev-mode-greeting/handler.test.ts`, `src/infra/fork-update-block.test.ts`. The wrapper stops at the first failed shard, so rerun the rest after a failure.
- **dist/ is committed** on `main` (~13.5k files at 9.6, incl. the Control UI assets).
- **⚠️ `dist/` is in `.gitignore`** but tracked. `git add -A` skips NEW hashed chunks → first gateway start fails with `Cannot find module`. **Always force-add dist after a build** (checklist item 4; learned the hard way: commit `e2441cf1d9` force-added 626 missing chunks).
- **Package manager**: pnpm everywhere (plain npm fails on `workspace:*` with `EUNSUPPORTEDPROTOCOL`). **10.4 pins pnpm 12.5.1** (9.6 pinned 12.4.0; every upgrade so far bumped the pin — check `packageManager` first and `npm i -g pnpm@<pin>` on the VPS) and sets `minimumReleaseAgeStrict: true` (a very fresh transitive dep can be refused — report, don't hack the yaml). VPS: `CI=true pnpm install --ignore-scripts`; if it refuses to remove `node_modules` without a TTY, `rm -rf node_modules` first.
- **Node engines (9.6 and 10.4)**: `>=24.16.0 <25 || >=26.1.0`.

### WhatsApp — the heart of this fork

`extensions/whatsapp/` carries SEC-WA1, the echo guard and the history recorder, so it MUST ship as a bundled build. Since V2026.5.12 upstream publishes WhatsApp on ClawHub; a managed install in `~/.openclaw/extensions/whatsapp/` (loader origin `global`) silently overrides the in-repo code (5.12 did exactly that: `wa-history.db` froze until the fix). Hence checklist item 2.

- **One-time (already done on the VPS)**: `openclaw plugins uninstall whatsapp < /dev/null`, restart. Once `dist/extensions/whatsapp/` exists, upgrade repair skips bundled plugins.
- **Verify after EVERY deploy**: the two greps in checklist item 5; `openclaw plugins list` shows WhatsApp under the bundled root, not `global`; gateway log shows `[dev-mode] WhatsApp history logger attached` after the first WA message.

### VPS Update Recipe

```
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks && CI=true pnpm install --ignore-scripts && sh dev-mode/link-dist-plugin-deps.sh && ln -sfn /opt/openclaw-dev-mode node_modules/openclaw && openclaw gateway restart
```
(`core.symlinks false` also covers pulls where a tracked symlink became a regular file, e.g. `CLAUDE.md`. `dev-mode/link-dist-plugin-deps.sh` recreates the `dist/extensions/<id>/node_modules` links the build makes on the build machine but that are never committed — without it `acpx` fails with "required dependencies are missing".)

- **What a deploy looks like at 9.6 (2026-10-11)**: seconds after `git pull` the running gateway logs `Installation replaced: running … build <old>; on-disk … build <new>`, shuts itself down and systemd starts it on the new build. Its shutdown logs `Cannot find module …/dist/<old-chunk>.mjs` (the pull deleted its chunks): expected. `openclaw gateway stop` refuses without `--force` ("This stops the operator's running gateway service"), and a manual `gateway start` right after fails with "another OpenClaw process owns state-lifecycle" because systemd already restarted it. Verify: `systemctl --user show openclaw-gateway -p ExecMainStartTimestamp` is after the pull, and the log has `gateway ready`, `Listening for WhatsApp inbound messages`, `[dev-mode] WhatsApp history logger attached`.
- Self-ref link: use `ln -sfn` (fixed 2026-10-11). Plain `ln -sf` follows the existing link into the repo root and creates a stray `/opt/openclaw-dev-mode/openclaw-dev-mode` → itself (still there; `rm` it, it is only a symlink).
- WA/model warmup fails with `Cannot find package 'openclaw'` → re-run the `ln -sfn` self-ref symlink, restart.
- Plugin runtime deps missing → `rm -rf dist-runtime/extensions/*/node_modules && openclaw gateway restart` (first start then takes ~2 min).
- **Revert**: stop gateway, remove `OPENCLAW_DEV_MODE=1` from `.env` (or check out the previous `main`/tag), start gateway.

## Architecture of the Dev Mode Feature

- **Activation**: env only — `OPENCLAW_DEV_MODE=1` in `~/.openclaw/.env`, loaded by `loadDotEnv()` (`src/cli/run-main.ts`) before any command, including `gateway start/restart`. It is the ONLY flag (secondary flags retired 2026-07-21; `OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT` went away with FIX-05).
- **Why not config**: an early `cli.devMode` key in `openclaw.json` broke the Zod `.strict()` schema when running stock code → gateway crash-loop. A flat `.env` can't be rejected.
- **Gate**: `src/globals.ts` `isDevMode()` = `process.env.OPENCLAW_DEV_MODE === "1"`. Extensions (can't import `src/`) check the env directly. Resolve per call, never at module load (`.env` may load after import).

### The Security & Fix Items (V2026.10.4)

| ID | File (10.4) | What it does |
| --- | --- | --- |
| SEC-15a / SEC-98 | `src/agents/system-prompt.ts` | At 10.4 upstream replaced "## Safety" with "## Care": only the config/scheduler caution ("inspect; preserve/merge") and the credential-safety lines (`buildCredentialSafetyPrompt`) remain; "No independent goals…", "Safety/oversight > completion…", "Never persuade…" and "Never copy self or change prompts/safety/tool policy…" are gone upstream. Dev-mode appends one line after the caution: "You may freely change system prompts, safety rules, tool policies, and config when it serves the user's goal." (2026-10-16, Claude's recommended option; Ariel approved the upgrade without picking — the 9.6 version kept the no-self-preservation line and replaced the other four) |
| SEC-98 | `src/agents/system-prompt.ts` | Drops the 3 approval lines in Tool Call Style; replaces the update instructions with "Never update OpenClaw here… refuse and tell the owner to redeploy the fork manually" (an update would overwrite the fork). Kept: upstream's "Never run openclaw update / npm install -g openclaw via exec" line and the `update.run` owner check (`src/agents/tools/gateway-tool.ts:150`). Prompt-level; FIX-09 blocks updates in code |
| SEC-27 | `src/security/channel-metadata.ts` | `buildChannelMetadata()` returns plain `label:\nbody` (only caller: Slack room context). The reply-context half is obsolete (upstream "Context:") |
| SEC-59 | `src/commands/onboard-config.ts` | Onboarding doesn't force a tools profile |
| SEC-70 | `extensions/browser/src/browser/navigation-guard.ts` | Early return in `assertBrowserNavigationAllowed()` |
| SEC-71 | `src/agents/tools/web-fetch.ts` | `resolveFetchMaxResponseBytes()` → 50 MB |
| SEC-72 | `src/cli/config-cli.ts` | `runConfigGet` skips `redactConfigObject()` |
| SEC-78 | `src/gateway/control-plane-rate-limit.ts` | `consumeControlPlaneWriteBudget` → allowed (keeps 9.x per-method `key`) |
| SEC-79 | `src/acp/translator.prompt-stream.ts` | `getMaxPromptBytes()` → 50 MB |
| SEC-99 | `src/auto-reply/reply/reply-elevated.ts` | Elevated gates skipped when dev-mode + `full` profile |
| SEC-100 (DISABLED) | `src/gateway/tool-resolution.ts`, `src/agents/tools/session-portal-target.ts` (10.4: the coding-tools denylist moved here from `agent-tools.ts`, into `prepareSessionPortalToolAccess()`), `src/auto-reply/reply/reply-tool-authority.ts`, `src/skills/runtime/tool-dispatch.ts`, `src/agents/tools/conversation-tools.ts` | **Disabled 2026-10-11** (Ariel: "remove sec-100, and do proper owner thing. only comment the lines"): active code = upstream exactly; the SEC-100 lines (and 4 now-unused `isDevMode` imports) stay as `SEC-100 disabled 2026-10-11 … To restore, swap…` comments. Owner now comes from `commands.ownerAllowFrom` on the VPS (Ariel's WhatsApp + Discord ids). Known trade-off, accepted: senderless turns (cron, hooks, `sessions_send`, heartbeat) can never be owner and lose these tools; subagents are never owner (spawned with a write-scope synthetic client, `src/gateway/agent-turn/agent-run-user-turn.ts:214`) and hit the hard-deny list anyway. Was: owner-only tools (`GATEWAY_OWNER_ONLY_CORE_TOOLS`: gateway, plugins, automations, sessions, screen, terminal, portal, conversations_*, nodes, computer, mobile_ui, openclaw) stay available on every turn. Why: allowlisted ≠ owner (`src/auto-reply/command-auth.ts:487` — only `commands.ownerAllowFrom`/admin scope count), so Ariel's own chats and all cron/hook/API turns lost them (Ariel 2026-09-28: "i am owner… i dont have guests") |
| SEC-101 | `src/agents/agent-tools.ts` | Skips `filterToolsByMessageProvider()` |
| SEC-102 | `src/media/local-media-access.ts` | `resolveLocalMediaBoundary()` → roots `"any"` (covers assert AND read; 9.x re-checks at read) |
| SEC-WA1 | `extensions/whatsapp/src/dev-mode/reasoning.ts` + hooks in `auto-reply/monitor/inbound-dispatch.ts`, `auto-reply/deliver-reply.ts` | Reasoning (flag or `Reasoning:`/`Thinking` preamble, prefix stripped) → `💭 Reasoning:` + italic lines; needs `/reasoning on` |
| WA echo guard | `extensions/whatsapp/src/dev-mode/echo-guard.ts` + hook in `auto-reply/monitor/on-message.ts` | Safety net for self-chat reasoning echoes; info log `Dropped self-chat reasoning echo (dev-mode safety net)` = upstream id dedupe missed one |
| WA history | `extensions/whatsapp/src/dev-mode/wa-history.ts` + hook in `session.ts` | Baileys `messages.upsert` → `~/.openclaw/dev-mode/wa-history.db`; normal (not "directory") sockets only |
| FIX-01 | `src/agents/workspace.ts` | `MEMORY.md` via `publishBootstrapFile` only after `setupCompletedAt` (earlier seeding cancels onboarding) |
| FIX-03 | `src/status/status-message.ts` | Dev-mode `▶️ Active model` line/row (model + auth that ran) |
| FIX-04 | `src/auto-reply/reply/commands-reset.ts` | Skip the hardcoded reset ACK so the bare-reset greeting runs |
| FIX-07 | `src/commands/doctor/config-content-fix.ts` + `src/cli/config-validate-fix.ts` (fork-owned) + hook in `src/cli/config-cli.ts` | `openclaw config validate --fix [--dry-run]` (not dev-mode gated): runs only doctor's config stages on `openclaw.json` (legacy migrations, value-format normalizers, unknown-key removal), then writes via doctor's `restoreDoctorConfigEnvRefs` + `transformConfigFile` only if the result validates (`.bak` kept, size-drop guard on). No installs, state migrations or service changes. Skips `$include` configs and rosters that need doctor's one-time migration (`agents.list`, `default` markers, multi-agent roster without `agents.ownership`); drops the reader's in-memory `agents.entries.main` placeholder (an invalid file's candidate is otherwise written as-is). 10.4: upstream removed `migratePersistedImplicitMainRoster`, so the roster gate now mirrors doctor's `rosterMigrationNeeded` (`findLegacyConfigRuleIssues` + `LEGACY_AGENT_ROSTER_RULES`, `listAgentEntries` on `sourceConfigBeforeMigrations`, which is pre-placeholder while `sourceConfig` is post); `normalizeCompatibilityConfigValues` no longer takes `sourceConfigBeforeMigrations`. Tests at 10.4: fixtures are pre-stamped with `meta.migrations.webhookListeners: true` because doctor now writes that one-time marker ("Recorded webhook listener decisions…") into any config without it (fresh test HOMEs have no state-DB evidence, so the stamp always fires there), and `agents.defaults.contextTokens` reads as a legacy-rule issue instead of a valid read-time migration |
| FIX-09 | `src/infra/fork-update-block.ts` (fork-owned, regression checklist in header) + first-statement hooks in `src/gateway/server-methods/update.ts` (`update.run`), `src/cli/update-cli/update-command.ts` (`updateCommand()`), `src/infra/update-startup-auto-run.ts` (`runAutoUpdateCommand()`), `src/commands/doctor-update.ts` (`maybeOfferUpdateBeforeDoctor()`) | Hard block on OpenClaw's own update flow (Ariel 2026-10-11: "no way to actually initiate the upstream update"). NOT dev-mode gated, no env/config switch: module state that only `setForkUpdateBlockForTest()` lifts (called at module top level of `test/setup.shared.ts` so upstream's update tests run the real paths). Refuses the Control UI update button, the agent `gateway` → `update.run`, `/update`, any API client, `openclaw update` / `--update` / `update wizard` / managed handoffs, startup auto-update + update campaigns, and doctor's "Update OpenClaw from git before running doctor?". Still allowed: `openclaw update status`, update notices, `openclaw plugins update`, manual `git pull` deploys. Not blockable in code: the agent running `npm i -g openclaw` in a shell (SEC-98 prompt rule). 10.4: `updateCommand()` first tries `tryRunImmutableUpdateCommand()` and gained a caller in `src/infra/update-migrated-finalize.worker.ts` — both sit behind the assert, which stays the first statement; `update.ts` is 735 lines (oxlint `max-lines` 700, warning only) |

**Dropped** (with reasons in `README.md`): FIX-05, FIX-06, Ollama `think` injection (upstream native at 9.6), FIX-03 selection merge, SEC-27 reply-context half, OpenAI reasoning injection (5.12), SEC-67 (skipped by choice), SEC-80, SEC-96, FIX-02, 7.x UI patches + localStorage cache, kapso plugin + socket tap, secondary env flags.

### Decisions 2026-09-28 — deliberately kept upstream

SSRF private-network block for `web_fetch` (knob if ever needed: `tools.web.fetch.ssrfPolicy`), the untrusted-content wrapper on fetched content (`EXTERNAL_UNTRUSTED_CONTENT` markers, `src/security/external-content.ts:37` at 10.4), the prompt line "OpenClaw messaging: use messaging tools, never shell/CLI/curl/RPC" (`src/agents/system-prompt-messaging.ts:45` at 10.4), the credential-safety prompt lines, the `gateway` tool description still mentioning self-update ("just a tool, not worth it"), ACP always-ask approvals (no IDE use), the subagent hard-deny list (→ open idea).

### Open ideas

- **Subagents talking** (`message` / `sessions_send` / `conversations_*` for subagents) — `dev-mode/open-ideas/subagent-talk.md`. Parked 2026-09-28; depth-5 spawning (upstream default) is enough for now.

### Remaining upstream gates (verified at 9.6, anchors re-checked at 10.4)

| Gate | Default | Status |
| --- | --- | --- |
| Exec approvals | `security: "full"`, `ask: "off"` (`src/infra/exec-approvals-config.ts:141`) | Nothing to relax |
| Sandbox | `mode: "off"` (`src/agents/sandbox/config.ts:233`); forced only for sessions created under a multi-user operator role | Not applicable |
| `tools.fs.workspaceOnly` | false | Nothing to relax |
| Subagent hard-deny (`src/agents/agent-tools.policy.ts`, `SUBAGENT_*` lists) | always; not config-overridable since #120025 | Kept → open idea |
| Gateway HTTP `/tools/invoke` deny list (`src/security/dangerous-tools.ts`) | on | Config `gateway.tools.allow` if ever needed |
| ACP approval classes (`src/acp/approval-classifier.ts`) | always ask | Kept (no IDE) |
| SSRF, SECURITY NOTICE, messaging routing line | on | Kept (decisions above) |

## Source Files Modified

Upstream files carry small guarded hooks; fork-owned files hold the logic.

- Infrastructure: `src/globals.ts`
- Core hooks: `src/agents/system-prompt.ts`, `src/security/channel-metadata.ts`, `src/commands/onboard-config.ts`, `src/agents/tools/web-fetch.ts`, `src/cli/config-cli.ts`, `src/gateway/control-plane-rate-limit.ts`, `src/acp/translator.prompt-stream.ts`, `src/gateway/tool-resolution.ts`, `src/agents/agent-tools.ts`, `src/auto-reply/reply/reply-tool-authority.ts`, `src/skills/runtime/tool-dispatch.ts`, `src/agents/tools/conversation-tools.ts`, `src/media/local-media-access.ts`, `src/agents/workspace.ts`, `src/auto-reply/reply/reply-elevated.ts`, `src/auto-reply/reply/commands-reset.ts`, `src/status/status-message.ts`, FIX-09: `src/gateway/server-methods/update.ts`, `src/cli/update-cli/update-command.ts`, `src/infra/update-startup-auto-run.ts`, `src/commands/doctor-update.ts`. SEC-100 comment-only files (active code = upstream since 2026-10-11): `src/gateway/tool-resolution.ts`, `src/agents/tools/session-portal-target.ts` (10.4), `src/auto-reply/reply/reply-tool-authority.ts`, `src/skills/runtime/tool-dispatch.ts`, `src/agents/tools/conversation-tools.ts`
- Test setup: `test/setup.shared.ts` (FIX-09 test switch)
- Extension hooks: `extensions/browser/src/browser/navigation-guard.ts`; `extensions/whatsapp/src/session.ts`, `auto-reply/monitor/inbound-dispatch.ts`, `auto-reply/deliver-reply.ts`, `auto-reply/monitor/on-message.ts`
- Fork-owned: `extensions/whatsapp/src/dev-mode/{wa-history,reasoning,echo-guard}.ts`, `src/commands/doctor/config-content-fix.ts`, `src/cli/config-validate-fix.ts`, `src/infra/fork-update-block.ts`, `src/hooks/bundled/dev-mode-greeting/` (HOOK.md + handler.ts: FIX-04's greeting after `/new`, `/reset`, `/compact` and auto-compaction; directory-discovered like upstream's bundled hooks, so it ports by copy) (+ colocated tests)
- Build: `package.json` `files` (WhatsApp exclusion removed). Test tooling: `scripts/lib/vitest-worker-compiler.mts` (10.4: `existsSync` guard in the worker-asset copy loop, because the fork has no `.github/workflows`). Docs: `README.md`, `CLAUDE.md`, `dev-mode/**`

## Key OpenClaw Internals

- Commander.js CLI; route-first commands (`tryRouteCli()`: `config get`, `health`, `status`) bypass Commander preAction hooks (`src/cli/program/preaction.ts`).
- Config: JSON5 → Zod (`.strict()` rejects unknown keys!) → runtime defaults. `loadConfig()` calls `loadDotEnv` internally — use `createConfigIO({ env: { ...process.env } })` to skip. `setConfigOverride()` is runtime-only.
- `.env` loading: CWD `.env`, then `~/.openclaw/.env`.
- Plugins: `openclaw.plugin.json` manifest + `register(api)`; discovered from `plugins.load.paths` + `extensions/`. Extension code can't import `src/` — use `openclaw/plugin-sdk/*` or read `params.cfg`.
- Owner ≠ allowlisted: owner comes from `commands.ownerAllowFrom` / channel owner entries / Control UI admin scope (`src/auto-reply/command-auth.ts`, grep `ownerAllowFrom`). Senderless turns (cron, hooks, `sessions_send`, heartbeat) never match; the claude-cli MCP grant turns an unknown owner into `false` (`src/agents/cli-runner/mcp-grant-context.ts`, grep `senderIsOwner`). Owner status does not raise the operator-scope ceiling (that is FIX-08's problem).
- Owner test from chat: `/update` is an owner-only gateway control command with `silentUnauthorized` (`src/auto-reply/reply/command-gates.ts`). A non-owner gets no reply at all; the owner gets "⚠️ Update request failed: … (openclaw-dev-mode FIX-09)". `/debug` is a poor test: it also needs `commands.debug` (`configKey: "debug"`, `src/auto-reply/reply/commands-config.ts:156` at 10.4), which is off on the VPS.
- Sessions (9.6): no automatic reset by default (`src/config/sessions/reset-policy.ts`); any `session.reset` block re-enables daily. Compaction manages size with a pre-compaction memory flush.
- Bootstrap files (MEMORY.md etc.) are injected into agent context, max 20K chars each.

## Key Gotchas

- oxlint: braces on every `if`; `catch (err)` is `unknown` → `err instanceof Error ? err.message : String(err)`; no duplicate imports from one module.
- Adding unknown fields to `openclaw.json` crashes the gateway (Zod strict). `bindings` is a top-level key, not under `agents`.
- Discord: a user must be in BOTH the guild `users` list and the account `allowFrom`, or messages drop silently. Valid bot tokens are ~72 chars; 100+ means corrupted.
- Debug-patching compiled `dist/*.js` on the VPS: use the already-imported `writeFileSync`, never `require("fs")` (ESM). Restore with `git config core.symlinks false && git checkout -- dist/<file> && git config --unset core.symlinks`.
- Ollama `gemini-3-flash-preview:cloud` misbehaves on native `/api/chat`; set that model's `api` to `"openai-completions"` in `models.providers.ollama.models[]`.
- Raw config tab: at 7.x new Zod defaults broke the raw round-trip (`config.get` → `raw: null`). At 9.6 the check compares against the pre-default parsed file, so new defaults can't break it. If Raw is ever unclickable again, diff `snapshot.config` vs `JSON5.parse(snapshot.raw)` with a throwaway `.mts` under `dev-mode/` run via `./node_modules/.bin/tsx`.

## VPS Operational Lessons

- **Any config write can restart the gateway**; a restart once corrupted the WA Signal session ("Bad MAC", delayed bursts) — restart again and verify WhatsApp answers.
- **WA listener needs ~2 min after an upgrade restart** (`No active WhatsApp Web listener` meanwhile). Check `/tmp/openclaw/openclaw-*.log` only if it persists.
- **VPS watchdog flags our SSH bursts** (many sub-2-second root logins, key comment `claude-code-dev-vps`) and asks Ariel whether to block the IP. Correlate timestamps with our session; never block the IP or revoke the key over a burst alone.
- Channels are `["whatsapp", "discord"]` since the kapso teardown; implicit sends work again.
- **Ollama Cloud quota**: once the plan limit is hit (`429 You reached your Pro weekly limit`), `ollama:default` goes into a long cooldown. Every kimi/glm agent, and main's fallback, then fails until the limit resets (2026-10-10, still out on 10-11). Test on a Claude model meanwhile.

## WhatsApp Notes

- **SEC-WA1 (9.6 rebuild)**: stock 9.x blocks reasoning on WhatsApp at three points — core drops `isReasoning` payloads unless `replyOptions.reasoningPayloadsEnabled`; `resolveWhatsAppDeliverablePayload` (inbound-dispatch); `isReasoningReplyPayload` (deliver-reply, also matches text starting `Reasoning:`/`Thinking`). Dev-mode opts in and converts before the filters. 7.1 showed most reasoning WITHOUT 💭 because core formats reasoning with a "Thinking" preamble (`formatReasoningMessage`, `src/agents/embedded-agent-utils.ts`) while the old regex matched only "Reasoning:". Works for any model that emits reasoning; core emits it only with reasoning level `on` and thinking not `off`.
- **Echo loop history**: in self-chat every send echoes back as inbound. 7.x matched echoes by text, SEC-WA1 rewrote the text, and the agent answered its own reasoning forever. 9.x dedupes by message id (`inbound/socket-session.ts` `rememberOutboundMessage`, `inbound/message-normalization.ts` `shouldSkipRecentOutboundEcho`); the fork keeps `echo-guard.ts` as a safety net only.
- **History recorder**: `/root/.openclaw/dev-mode/wa-history.db` (continuous since the kapso era; 227 MB in July, 496 MB on 2026-09-28). Verified 2026-09-28: the running gateway has exactly this file open and the 9.6 code resolves the same path (`$HOME/.openclaw/dev-mode/wa-history.db`, no override). Empty leftover `openclaw-whatsapp-claw.db` (Sep 15) in the same dir is unused. Schema `messages` + `chats` incl. `phone_e164`; `jidToPhoneE164()` resolves Baileys 7.x `@lid` via `remoteJidAlt`; `ensureColumn()` migration guard; `node:sqlite`, zero deps. Group names backfilled on connect and updated live. No UI — the sqlite file is the interface.
- **Kapso era (2026-07-02 → 07-21) is over**: plugin, panel, agents, bindings, nginx/ufw/cert/systemd all removed. Plugin repo still exists (not installed). Lesson kept: Meta's 24h window opens only on the peer's own inbound message; sends outside it fail with 422 unless paid templates.

## Upgrade History — durable lessons

- **3.13 (2026-03-21)**: a 15K-line WhatsApp refactor broke WA (echoes, dropped creds); rolled back to 3.11. → Before any upgrade, `git diff --stat` on `extensions/whatsapp/`; test WA thoroughly if it's big.
- **4.5 (2026-04-07)**: config schema migrations — run `openclaw doctor --fix` after upgrades. Extensions can't import `src/globals.ts`.
- **4.24 (2026-04-26)**: VPS needs the self-ref symlink `node_modules/openclaw` (kept in the update recipe).
- **5.12 (2026-05-17)**: WhatsApp moved to ClawHub → fork patches silently bypassed → bundled build (checklist item 2).
- **7.1 (2026-07-21)**:
  - Node floor raised (the build's last step runs the fresh CLI); don't auto-install Node on Ariel's machines — ask.
  - `@openclaw/ai` became a runtime workspace dep → pnpm on the VPS + `packages/ai/dist` force-add.
  - Startup-migration gate crash-looped the gateway (~10 min outage) on permanent warnings: legacy memory-core `.dreams/*.json` (archived to `~/.openclaw/legacy-state-archive-20260721/`) and the broken `openclaw-web-search` package (removed; no web-search provider configured now — bundled `duckduckgo`/`brave` exist). At 9.6 warnings only log; refusals are still fatal.
  - Tracked self-ref symlink `packages/speech-core/node_modules/openclaw` corrupted `.git` twice during checkouts (and likely wiped the laptop clone's `.git/index` on 2026-09-26). Gone at 9.6.
  - Upstream rebuilt the Control UI.
  - `session.test.ts` failed on pristine 7.1 on Windows — pre-existing.
- **9.6** and **10.4** — see below.

### V2026.9.6 Upgrade (2026-09-27/28, branch `upgrade-2026.9.6`)

Clean-room from tag `v2026.9.6` (upstream 2026-09-22), ~33.4k commits / 48k files since 7.1. Upstream rewrote history: `v2026.7.1` is NOT an ancestor of `v2026.9.6` (merge-base `b81666c`) — don't trust `v2026.7.1..v2026.9.6` counts.

**Process that worked**: 4 parallel read-only Sonnet analyses (per patch SEAMLESS / ADAPT / THINK / DROP with 9.6 file:line) → Opus ports the confident set (`git apply --3way` of the fork diff for small hunks, manual re-homing otherwise) → Ariel decides THINK items one by one → rendered the real dev-mode system prompt (`buildAgentSystemPrompt` via `node --import ./scripts/tsx.mjs`) and swept runtime gates → docs.

**Upstream changes that shaped the port**: automatic session reset OFF by default (#111140, `e23dde3de55`; no doctor migration re-adds it) → FIX-05/06 dropped; bundled `session-memory` hook (opt-in); reasoning delivery/suppression + "Thinking" preamble → SEC-WA1 rebuilt; message-id echo dedupe → echo filter kept as safety net; WA "directory" sockets → history logger on normal sockets only; `readLocalMediaFile` re-checks roots → SEC-102 moved; `MEMORY.md` = setup-completion evidence → FIX-01 after setup; subagent deny list non-overridable + `message` added (#120025, `8994c7799ba`) while default spawn depth went 1 → 5; WhatsApp exclusion derived from `package.json` only; fork WA code bundles under `dist/extensions/whatsapp/`; ~20 new state migrations; pnpm 12.4.0; `CLAUDE.md` had been committed as a symlink (mode `120000`) holding 69 KB of markdown → fixed in `89a6d85522`.

**Deploy (2026-09-28)** — OS `apt full-upgrade` first (40 packages, Node 24.19 → 24.21, kernel 6.8.0-142 installed, reboot pending), full backup `/root/.openclaw.bak-pre-9.6-20260928` (9.6 GB), then the recipe. Lessons:
- Run `openclaw doctor --fix` with the gateway STOPPED — while it runs, migrations refuse with "Agent main database is still open in another process" and every later step is skipped (looks like scary failures, isn't).
- `doctor` migrated the config to the 9.6 shape (`agents.list` → `agents.entries`, `memorySearch` → `memory.search`, `messages.tts` → `tts`, …) and restored `openclaw.json.last-good` over a clobbered write — verified no settings lost (same 3 agents).
- `acpx` failed to load: the VPS had stale real `dist/extensions/*/node_modules` dirs from npm-era deploys (7 of them; old acpx without `./agent-registry`) and never gets the build's local links → `dev-mode/link-dist-plugin-deps.sh` (now in the update recipe) replaces them with one link per plugin.
- `agents.defaults.subagents.maxSpawnDepth` was pinned to 2 in the config → set to 5 (Ariel: "if i have 5 depths i'm ok").
- Empty leftover `dev-mode/openclaw-whatsapp-claw.db` deleted.
- Verified after deploy: reboot into kernel 6.8.0-142 with `Linger=yes` — gateway came back by itself; 💭 reasoning in WhatsApp self-chat with `ollama/glm-5.3-flash:cloud` + `/reasoning on`, no loop.

**Pre-existing test failure**: `src/acp/translator.abort-cause.e2e.test.ts` fails on pristine `v2026.9.6` too (Linux, Node 26.8; A/B verified) — ignore.

**First-deploy checklist for 9.6 (VPS)**: snapshot `~/.openclaw`; upgrade pnpm to 12.4.0; update recipe; confirm no `session.reset` block in `openclaw.json` (any block re-enables daily reset); check `agents.defaults.subagents.maxSpawnDepth` isn't pinned below 5; `openclaw hooks enable session-memory < /dev/null`; `openclaw doctor --fix < /dev/null` and read every warning; restart; WA checks (checklist item 5); `/reasoning on` in self-chat → `💭 Reasoning:` messages, no loop, no `Dropped self-chat reasoning echo` log line; `/status` shows `▶️ Active model`; `commands.ownerAllowFrom` set → `/update` from WhatsApp answers with the FIX-09 message (no reply at all = not owner) and the agent can use `gateway` `config.get` there (SEC-100 disabled 2026-10-11); `openclaw update --dry-run < /dev/null` refuses with the FIX-09 message.

### V2026.10.4 Upgrade (2026-10-16, branch `upgrade-2026.10.4`, built on the Windows PC)

Clean-room from tag `v2026.10.4` (upstream 2026-10-15), 6.7k commits after 9.6. Upstream rewrote history again: `v2026.9.6` is NOT an ancestor of `v2026.10.4` (merge-base `814a7e752`), and `git diff --stat` between the tags is inflated by the rename-detection limit — don't quote its numbers. Layout unchanged; all 28 upstream hook files survived.

**Process (one session, no subagents)**: save `git diff --binary v2026.9.6 main -- . ':!dist' ':!packages/ai/dist' ':!README.md' ':!CLAUDE.md' ':!dev-mode' ':!.github'` as the fork patch → dry-run per file with `git apply --cached --check` against a temp index (`GIT_INDEX_FILE=… git read-tree v2026.10.4`) to classify → `git tag main-pre-2026.10.4 main` → `git checkout -b upgrade-2026.10.4 v2026.10.4` → `git rm -r .github/workflows` → `git apply --3way <patch>` (30 of 43 files merged by itself, 13 left conflict markers: import drift plus small re-homes; a Node script replaced each block) → `git checkout main -- dev-mode README.md CLAUDE.md` → typecheck (`tsgo:core/extensions/ui`), `oxfmt`, lint, vitest, `pnpm build`, dist force-add → deploy → force-move `main`. Watch for a hunk the 3-way merge applies "cleanly" that only made sense with its conflicted neighbour: it dropped the `nowMs` line in `control-plane-rate-limit.ts` (SEC-78 had moved it) — always `git diff v<tag>` every touched file and read it.

**Upstream changes that shaped the port**: "## Safety" → "## Care" (see SEC-15a row); the coding-tools owner-only denylist moved from `agent-tools.ts` into `prepareSessionPortalToolAccess()` (`src/agents/tools/session-portal-target.ts`) and `tool-resolution.ts`'s list gained sessions/portal cases → SEC-100 comments re-anchored; `updateCommand()` gained an immutable-install path + a worker caller → FIX-09 assert still first (sweep: `grep -rn 'updateCommand(\|runAutoUpdateCommand(\|startManagedServiceUpdateHandoff(\|"update.run"' src` lists only hooked paths plus `triage-failure.ts`); `migratePersistedImplicitMainRoster` removed and `normalizeCompatibilityConfigValues` narrowed → FIX-07 rebuilt its roster gate (see its row; the test file needed no change); `ensureAgentWorkspace` guard renamed `beforePersistentApply` → `beforeFileMutation` (FIX-01); status layout `modelLines` → `modelValue` + a new `🌐 Endpoint` row (FIX-03 inserts after Model); `web-fetch` sizes via `resolveIntegerOption` (SEC-71 early return kept); pnpm 12.5.1; 10.3 fixed "Claude CLI session tools keep working after the turn that started the MCP loopback ends" (#165432 — FIX-08 territory); 10.1 added a Doctor migration for unscoped WhatsApp credentials; 9.7 removed Tasks/TaskFlow and migrates retired `heartbeat`/`sandbox.perSession` keys.

## Open Items

- **Claude as main driver + subagents** (Ariel 2026-10-11: "claude as my main agent driver, and spawn subagents"). Driver = `claude-cli` only. Subagents = both OpenClaw `sessions_spawn` and Claude Code's own Agent tool. Children may run any Claude or Ollama model. Done and deployed 2026-10-11: SEC-100 disabled + `commands.ownerAllowFrom`, and FIX-09. Ariel's test of a `sessions_spawn` child on a Claude model passed the same day. Next, in order:
  1. **FIX-08**: on `claude-cli` runs, the `openclaw` tool fails with `missing scope: operator.admin`, while read/write tools such as `gateway` `config.get` pass. Loopback-MCP tool calls dispatch in-process with least-privilege scopes. `resolveInProcessGatewaySyntheticScopes` (`src/gateway/server-plugin-in-process-scopes.ts`) then projects them onto a non-admin ceiling. Top hypothesis: the lazily started loopback listener (`ensureMcpLoopbackServer`, `src/gateway/mcp-http.ts`) inherits the AsyncLocalStorage request scope of whichever gateway request booted it. Ariel has the VPS agent's brief (`FIX-08-operator-admin-scope.md`, 2026-10-10; not in the repo, since it holds his number). It says to instrument first: log `operatorScopes` in `server-plugin-in-process-dispatch.ts` and `server-plugin-in-process-scopes.ts`, then call `openclaw` from WhatsApp. **10.4 note**: upstream 10.3 shipped #165432 ("Claude CLI session tools keep working after the turn that started the MCP loopback ends") — re-test the `openclaw` tool from WhatsApp on 10.4 before instrumenting anything.
  2. Child crashes seen 2026-10-10 (`session writer claim changed before transcript persistence`, `session rebound for sessionKey`) were never investigated. If a child dies, grep the log for those strings.
  3. Any Claude model a child may use needs a `claude-cli` route; a wildcard `agents.defaults.models["anthropic/*"]` entry also covers future models. Otherwise the child runs embedded on the token.
  4. Claude Code's own Agent tool inside main's process: the runtime supports background agents (`extensions/anthropic/cli.runtime.ts`); confirm OpenClaw's tool policy lets it run.
- Delete `/root/.openclaw.bak-pre-9.6-20260928` (9.6 GB) once 9.6 is trusted.
- `doctor` advisories: legacy `agents.defaults.models` needs explicit provider/model refs before it can migrate to `agents.defaults.modelPolicy.allow`; bundled `github` plugin not in `plugins.allow` (link previews off); 9 historical transcripts deferred (header mismatch, originals untouched); command owner configured 2026-10-11 (`commands.ownerAllowFrom`, WhatsApp + Discord), `/update` hard-blocked by FIX-09; service policy refresh skipped because `~/.openclaw` is owned by `coder`.
- Gateway token NOT rotated (was plaintext in the deleted kapso-era `wa-claw-panel.service`) — Ariel's call.
- No web-search provider configured (bundled `duckduckgo`/`brave` available).
- Systemd unit carries a stale version stamp — cosmetic, `gateway status` warns.
- `~/.openclaw` ownership mess (`coder` uid 1001 owns much of it; Ariel's browser mini-VSCode on port 38080 needs read-write) — unresolved.

## Project File Structure (our additions)

```
dev-mode/
  install-guide.md        -- fork install/update guide
  claude-sub/             -- main agent on the Claude subscription (2026-10-10/11)
    claude-compliance.md  -- Anthropic's rules, the 3 routes, verified VPS state, re-check commands
    claude-cli-flow.md    -- how the claude-cli runtime drives Claude Code per turn (observed argv)
    my.2026.10.10.claude-opus-handoff.md -- setup + troubleshooting history (its user-agent overlay is superseded)
  tmp/                    -- gitignored scratch (VPS log copies); never commit
  link-dist-plugin-deps.sh -- VPS: link bundled plugins to their pnpm deps (update recipe)
  open-ideas/             -- parked ideas (subagent-talk.md)
  list.sec/               -- original per-item security plans (historical, 2026-03)
  my-archive/             -- session notes/handoffs (latest: my.2026.10.07.greeting-handoff.md; 9.6 upgrade: my.2026.09.28.md)
  trouble-shooting/       -- rescue + WhatsApp troubleshooting notes
  system-prompt/          -- captured system prompt (2026.5.2)
extensions/whatsapp/src/dev-mode/   -- wa-history, reasoning (SEC-WA1), echo-guard
```
