# OpenClaw Dev Mode

## Project Identity

- **Repo**: https://github.com/bresleveloper/openclaw-dev-mode
- **Fork of**: https://github.com/openclaw/openclaw
- **Fork point**: commit `029c47372` (V2026.3.2)
- **Current base**: V2026.9.6 on `main` (clean-room from tag `v2026.9.6`, deployed and promoted 2026-09-28). See "V2026.9.6 Upgrade". Previous: V2026.7.1 (tag `main-pre-2026.9.6`).
- **Purpose**: one env flag (`OPENCLAW_DEV_MODE=1`) relaxes OpenClaw's security for a single-owner dev VPS, plus WhatsApp and Control UI conveniences. User-facing summary with reasons: `README.md`.

## Branches

- `main` — Ariel's ONLY branch, at the V2026.9.6 base. Has `dist/` + `packages/ai/dist/` committed for easy VPS deployment. Experimental, practical, no polish needed.
- Tags (pushed): `main-pre-2026.9.6` (V2026.7.1-era head `89a6d855229`), `main-pre-2026.7.1` (V2026.6.11-era head `244849d3575`).
- Future upgrades: same clean-room pattern — branch from the upstream tag, re-apply patches, deploy, force-move `main`.

## Post-Merge Cleanup Checklist (run after EVERY upstream merge)

1. **Remove GitHub Actions workflows** — `git rm -r .github/workflows` (106 files at 9.6). No CI in this fork. Leave other `.github/` content.
2. **WhatsApp build exclusion** — since 9.x the ONLY source is `package.json` `files` (`!dist/extensions/whatsapp/**`); `scripts/lib/root-package-bundled-plugin-excludes.mjs` derives the build excludes from it. Delete that line. If it slips back, the build DELETES `dist/extensions/whatsapp` and the VPS falls back to the stock ClawHub package.
3. **Keep-ours on `README.md`** — Ariel's landing page; see "README is Ariel's domain" below.
4. **Stage dist — regular files only**: `find dist packages/ai/dist -type f > /tmp/dist-files.txt && git add -f --pathspec-from-file=/tmp/dist-files.txt`, then commit with `--no-verify` (the pre-commit formatter would rewrite generated files). Plain `git add -f dist/` also grabs ~300 symlinks the build's `external-plugins:local-dist` step leaves under `dist/extensions/*/node_modules/` (links into this machine's pnpm store) — never commit those. The real-file shim `dist/extensions/node_modules/openclaw/` (plugin-sdk) IS committed. See the ⚠️ in Build & Deploy.
5. **Re-verify patches survived** — grep `isDevMode()` anchors in src/; on the VPS after deploy: `grep -rl attachWaHistoryLogger /opt/openclaw-dev-mode/dist/extensions/whatsapp/` and `grep -rl formatDevModeReasoningPayload /opt/openclaw-dev-mode/dist/extensions/whatsapp/` must be NON-empty.
6. **Self-referencing symlinks** — the TRACKED `packages/speech-core/node_modules/openclaw` → repo-root link (7.1-era `.git`-corruption hazard, see Upgrade History) is gone at 9.6. `pnpm install` still creates UNTRACKED `node_modules/openclaw` links in ~40 workspace packages (ignored dirs git never traverses) — never `git add -f` anything under `node_modules/`. On a 7.1-era checkout, `rm packages/speech-core/node_modules/openclaw` (plain rm) before switching branches.
7. **Stage `packages/ai/dist` with `git add -f packages/ai/dist/`** after every build — root `dependencies` has `"@openclaw/ai": "workspace:*"` and dist imports `@openclaw/ai/internal/*` at runtime. It is the ONLY workspace package dist imports at runtime at 9.6 (`@openclaw/session-url-contract` is a devDependency bundled into dist; `@openclaw/fs-safe`/`@openclaw/proxyline` are npm deps). Re-check per upgrade: `grep -rhoE "from ['\"]@openclaw/[a-z0-9-]+" dist | sort | uniq -c` vs root `dependencies`.
8. **Re-read the upstream-owned hooks** listed in "Source Files Modified" and the regression checklists in the fork-owned files' headers.

## Dev Environment

- **Build machine (since 2026-09)**: Linux laptop (Arch/Omarchy), Node 26.8.1 via mise, pnpm 12.4.0 via `npm i -g pnpm@12.4.0` (Node 26 ships no corepack). Git has no `user.name` — commits are authored `Claude <noreply@anthropic.com>` via `GIT_AUTHOR_*`/`GIT_COMMITTER_*` env. (Older notes referenced a Windows PC.)
- **VPS**: Linux, OpenClaw installed with dev-mode. Ariel pulls and tests there.
- **Workflow**: Build/edit here → push → pull on VPS and restart gateway. Always ask permission before pushing. Always run full `pnpm build`. Do NOT run openclaw itself locally.

### Delegation: Opus writes code, Sonnet executes simple work

**Ariel, 2026-09-27**: the main thread (Opus) writes ALL code changes. Delegate to a Sonnet subagent (Agent tool, `subagent_type: general-purpose`, `model: sonnet`) only simple execution: VPS/SSH ops, git fetch, read-only investigations/fan-out analysis, builds/test runs. Verify subagent claims before acting — the 9.6 analyses were wrong three times (FIX-06 helper "compiles unchanged", `session-url-contract` "needs a dist force-add", "non-main sessions are sandboxed by default").

**Fork patch style (Ariel, 2026-09-28)**: touch upstream code as little as possible — logic in fork-owned files (`extensions/whatsapp/src/dev-mode/*`, `ui/src/pages/config/dev-mode.ts`), one guarded hook in the upstream file, comments with a regression checklist.

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
- **Node**: v24.21.0 (nodesource apt, 2026-09-28) — satisfies 9.6 engines. OS: Ubuntu 24.04; pnpm 12.4.0 via `npm i -g`
- **Models (2026-09-28)**: default `ollama/kimi-k2.7-code:cloud`; `ollama/glm-5.3-flash:cloud` configured (reasoning always on, tools, 1M ctx, paid via Ollama Cloud credits) — good for testing 💭. Web search: `tools.web.search.provider = ollama` (works with any model; Z.ai's native search is not an OpenClaw provider).

## Build & Deploy

- **Build**: `pnpm build` (includes `ui:build`; ~7–11 min on the laptop). tsdown (esbuild) → `dist/`
- **Format**: `pnpm exec oxfmt <files>` (sorts imports; keep a file-header comment above the import that sorts first). **Lint**: `node scripts/run-oxlint.mjs <files>`. **Typecheck**: `pnpm tsgo:core`, `pnpm tsgo:extensions`, `pnpm tsgo:ui`. **Tests**: `node scripts/run-vitest.mjs run <paths>` — one command at a time; lint and vitest both rebuild stale dist artifacts under `.artifacts/dist-artifacts.lock`, so parallel runs serialize and look hung.
- **dist/ is committed** on `main` (~13.5k files at 9.6, incl. the Control UI assets).
- **⚠️ `dist/` is in `.gitignore`** but tracked. `git add -A` skips NEW hashed chunks → first gateway start fails with `Cannot find module`. **Always force-add dist after a build** (checklist item 4; learned the hard way: commit `e2441cf1d9` force-added 626 missing chunks).
- **Package manager**: pnpm everywhere (plain npm fails on `workspace:*` with `EUNSUPPORTEDPROTOCOL`). **9.6 pins pnpm 12.4.0** (VPS must upgrade from 11.2.2) and sets `minimumReleaseAgeStrict: true` (a very fresh transitive dep can be refused — report, don't hack the yaml). VPS: `CI=true pnpm install --ignore-scripts`; if it refuses to remove `node_modules` without a TTY, `rm -rf node_modules` first.
- **Node engines (9.6)**: `>=24.16.0 <25 || >=26.1.0`.

### WhatsApp — the heart of this fork

`extensions/whatsapp/` carries SEC-WA1, the echo guard and the history recorder, so it MUST ship as a bundled build. Since V2026.5.12 upstream publishes WhatsApp on ClawHub; a managed install in `~/.openclaw/extensions/whatsapp/` (loader origin `global`) silently overrides the in-repo code (5.12 did exactly that: `wa-history.db` froze until the fix). Hence checklist item 2.

- **One-time (already done on the VPS)**: `openclaw plugins uninstall whatsapp < /dev/null`, restart. Once `dist/extensions/whatsapp/` exists, upgrade repair skips bundled plugins.
- **Verify after EVERY deploy**: the two greps in checklist item 5; `openclaw plugins list` shows WhatsApp under the bundled root, not `global`; gateway log shows `[dev-mode] WhatsApp history logger attached` after the first WA message.

### VPS Update Recipe

```
cd /opt/openclaw-dev-mode && git config core.symlinks false && git checkout -- . 2>/dev/null; git pull && git config --unset core.symlinks && CI=true pnpm install --ignore-scripts && sh dev-mode/link-dist-plugin-deps.sh && ln -sf /opt/openclaw-dev-mode node_modules/openclaw && openclaw gateway restart
```
(`core.symlinks false` also covers pulls where a tracked symlink became a regular file, e.g. `CLAUDE.md`. `dev-mode/link-dist-plugin-deps.sh` recreates the `dist/extensions/<id>/node_modules` links the build makes on the build machine but that are never committed — without it `acpx` fails with "required dependencies are missing".)

- WA/model warmup fails with `Cannot find package 'openclaw'` → re-run the `ln -sf` self-ref symlink, restart.
- Plugin runtime deps missing → `rm -rf dist-runtime/extensions/*/node_modules && openclaw gateway restart` (first start then takes ~2 min).
- **Revert**: stop gateway, remove `OPENCLAW_DEV_MODE=1` from `.env` (or check out the previous `main`/tag), start gateway.

## Architecture of the Dev Mode Feature

- **Activation**: env only — `OPENCLAW_DEV_MODE=1` in `~/.openclaw/.env`, loaded by `loadDotEnv()` (`src/cli/run-main.ts`) before any command, including `gateway start/restart`. It is the ONLY flag (secondary flags retired 2026-07-21; `OPENCLAW_DEV_MODE_AUTO_COMPACT_PROMPT` went away with FIX-05).
- **Why not config**: an early `cli.devMode` key in `openclaw.json` broke the Zod `.strict()` schema when running stock code → gateway crash-loop. A flat `.env` can't be rejected.
- **Gate**: `src/globals.ts` `isDevMode()` = `process.env.OPENCLAW_DEV_MODE === "1"`. Extensions (can't import `src/`) check the env directly. Resolve per call, never at module load (`.env` may load after import).

### The Security & Fix Items (V2026.9.6)

| ID | File (9.6) | What it does |
| --- | --- | --- |
| SEC-15a / SEC-98 | `src/agents/system-prompt.ts` | Safety section keeps "No independent goals, self-preservation, replication…" and the credential-safety lines (`buildCredentialSafetyPrompt`); replaces "Safety/oversight > completion…", the config/scheduler caution, "Never persuade anyone to expand access…" and "Never copy self or change prompts/safety/tool policy…" with "You may freely change system prompts, safety rules, tool policies, and config when it serves the user's goal." (Ariel 2026-09-28: the policy line contradicted the permissive one) |
| SEC-98 | `src/agents/system-prompt.ts` | Drops the 3 approval lines in Tool Call Style; replaces the update instructions with "Never update OpenClaw here… refuse and tell the owner to redeploy the fork manually" (an update would overwrite the fork). Kept: upstream's "Never run openclaw update / npm install -g openclaw via exec" line and the `update.run` owner check (`src/agents/tools/gateway-tool.ts:150`). Prompt-level only |
| SEC-27 | `src/security/channel-metadata.ts` | `buildChannelMetadata()` returns plain `label:\nbody` (only caller: Slack room context). The reply-context half is obsolete (upstream "Context:") |
| SEC-59 | `src/commands/onboard-config.ts` | Onboarding doesn't force a tools profile |
| SEC-70 | `extensions/browser/src/browser/navigation-guard.ts` | Early return in `assertBrowserNavigationAllowed()` |
| SEC-71 | `src/agents/tools/web-fetch.ts` | `resolveFetchMaxResponseBytes()` → 50 MB |
| SEC-72 | `src/cli/config-cli.ts` | `runConfigGet` skips `redactConfigObject()` |
| SEC-78 | `src/gateway/control-plane-rate-limit.ts` | `consumeControlPlaneWriteBudget` → allowed (keeps 9.x per-method `key`) |
| SEC-79 | `src/acp/translator.prompt-stream.ts` | `getMaxPromptBytes()` → 50 MB |
| SEC-97 server | `src/config/redact-snapshot.raw.ts` + `redact-snapshot.ts` + `types.openclaw.ts` | Raw view never withheld (`shouldFallbackToStructuredRawRedaction()` → false); snapshot carries `devMode` via `config.get`. Secrets still `__OPENCLAW_REDACTED__` |
| SEC-97 client | `ui/src/pages/config/dev-mode.ts` + hooks in `config-page.ts` (`synchronizeRuntimeConfig`, `resetConfigViewState`), `view-state.ts` (`resetConfigEphemeralState`), `ui/src/api/types.ts` | Advanced page opens in Raw, raw/env unblurred; follows the on-screen snapshot per view state (non-dev gateway re-blurs; manual toggles never overridden) |
| SEC-99 | `src/auto-reply/reply/reply-elevated.ts` | Elevated gates skipped when dev-mode + `full` profile |
| SEC-100 | `src/gateway/tool-resolution.ts`, `src/agents/agent-tools.ts`, `src/auto-reply/reply/reply-tool-authority.ts`, `src/skills/runtime/tool-dispatch.ts`, `src/agents/tools/conversation-tools.ts` | Owner-only tools (`GATEWAY_OWNER_ONLY_CORE_TOOLS`: gateway, plugins, automations, sessions, screen, terminal, portal, conversations_*, nodes, computer, mobile_ui, openclaw) stay available on every turn. Why: allowlisted ≠ owner (`src/auto-reply/command-auth.ts:487` — only `commands.ownerAllowFrom`/admin scope count), so Ariel's own chats and all cron/hook/API turns lost them (Ariel 2026-09-28: "i am owner… i dont have guests") |
| SEC-101 | `src/agents/agent-tools.ts` | Skips `filterToolsByMessageProvider()` |
| SEC-102 | `src/media/local-media-access.ts` | `resolveLocalMediaBoundary()` → roots `"any"` (covers assert AND read; 9.x re-checks at read) |
| SEC-WA1 | `extensions/whatsapp/src/dev-mode/reasoning.ts` + hooks in `auto-reply/monitor/inbound-dispatch.ts`, `auto-reply/deliver-reply.ts` | Reasoning (flag or `Reasoning:`/`Thinking` preamble, prefix stripped) → `💭 Reasoning:` + italic lines; needs `/reasoning on` |
| WA echo guard | `extensions/whatsapp/src/dev-mode/echo-guard.ts` + hook in `auto-reply/monitor/on-message.ts` | Safety net for self-chat reasoning echoes; info log `Dropped self-chat reasoning echo (dev-mode safety net)` = upstream id dedupe missed one |
| WA history | `extensions/whatsapp/src/dev-mode/wa-history.ts` + hook in `session.ts` | Baileys `messages.upsert` → `~/.openclaw/dev-mode/wa-history.db`; normal (not "directory") sockets only |
| FIX-01 | `src/agents/workspace.ts` | `MEMORY.md` via `publishBootstrapFile` only after `setupCompletedAt` (earlier seeding cancels onboarding) |
| FIX-03 | `src/status/status-message.ts` | Dev-mode `▶️ Active model` line/row (model + auth that ran) |
| FIX-04 | `src/auto-reply/reply/commands-reset.ts` | Skip the hardcoded reset ACK so the bare-reset greeting runs |

**Dropped** (with reasons in `README.md`): FIX-05, FIX-06, Ollama `think` injection (upstream native at 9.6), FIX-03 selection merge, SEC-27 reply-context half, OpenAI reasoning injection (5.12), SEC-67 (skipped by choice), SEC-80, SEC-96, FIX-02, 7.x UI patches + localStorage cache, kapso plugin + socket tap, secondary env flags.

### Decisions 2026-09-28 — deliberately kept upstream

SSRF private-network block for `web_fetch` (knob if ever needed: `tools.web.fetch.ssrfPolicy`), the "SECURITY NOTICE … UNTRUSTED" block on fetched content (`src/security/external-content.ts:78`), the prompt line "OpenClaw messaging: use messaging tools, never shell/CLI/curl/RPC" (`src/agents/system-prompt-messaging.ts:30`), the credential-safety prompt lines, the `gateway` tool description still mentioning self-update ("just a tool, not worth it"), ACP always-ask approvals (no IDE use), the subagent hard-deny list (→ open idea).

### Open ideas

- **Subagents talking** (`message` / `sessions_send` / `conversations_*` for subagents) — `dev-mode/open-ideas/subagent-talk.md`. Parked 2026-09-28; depth-5 spawning (upstream default) is enough for now.

### Remaining upstream gates (verified at 9.6)

| Gate | Default | Status |
| --- | --- | --- |
| Exec approvals | `security: "full"`, `ask: "off"` (`src/infra/exec-approvals-config.ts:83`) | Nothing to relax |
| Sandbox | `mode: "off"` (`src/agents/sandbox/config.ts:248`); forced only for sessions created under a multi-user operator role | Not applicable |
| `tools.fs.workspaceOnly` | false | Nothing to relax |
| Subagent hard-deny (`src/agents/agent-tools.policy.ts:52-83`) | always; not config-overridable since #120025 | Kept → open idea |
| Gateway HTTP `/tools/invoke` deny list (`src/security/dangerous-tools.ts`) | on | Config `gateway.tools.allow` if ever needed |
| ACP approval classes (`src/acp/approval-classifier.ts`) | always ask | Kept (no IDE) |
| SSRF, SECURITY NOTICE, messaging routing line | on | Kept (decisions above) |

## Source Files Modified

Upstream files carry small guarded hooks; fork-owned files hold the logic.

- Infrastructure: `src/globals.ts`
- Core hooks: `src/agents/system-prompt.ts`, `src/security/channel-metadata.ts`, `src/commands/onboard-config.ts`, `src/agents/tools/web-fetch.ts`, `src/cli/config-cli.ts`, `src/gateway/control-plane-rate-limit.ts`, `src/acp/translator.prompt-stream.ts`, `src/gateway/tool-resolution.ts`, `src/agents/agent-tools.ts`, `src/auto-reply/reply/reply-tool-authority.ts`, `src/skills/runtime/tool-dispatch.ts`, `src/agents/tools/conversation-tools.ts`, `src/media/local-media-access.ts`, `src/agents/workspace.ts`, `src/config/redact-snapshot.raw.ts`, `src/config/redact-snapshot.ts`, `src/config/types.openclaw.ts`, `src/auto-reply/reply/reply-elevated.ts`, `src/auto-reply/reply/commands-reset.ts`, `src/status/status-message.ts`
- UI hooks: `ui/src/api/types.ts`, `ui/src/pages/config/config-page.ts`, `ui/src/pages/config/view-state.ts`
- Extension hooks: `extensions/browser/src/browser/navigation-guard.ts`; `extensions/whatsapp/src/session.ts`, `auto-reply/monitor/inbound-dispatch.ts`, `auto-reply/deliver-reply.ts`, `auto-reply/monitor/on-message.ts`
- Fork-owned: `ui/src/pages/config/dev-mode.ts`, `extensions/whatsapp/src/dev-mode/{wa-history,reasoning,echo-guard}.ts` (+ colocated tests)
- Build: `package.json` `files` (WhatsApp exclusion removed). Docs: `README.md`, `CLAUDE.md`, `dev-mode/**`

## Key OpenClaw Internals

- Commander.js CLI; route-first commands (`tryRouteCli()`: `config get`, `health`, `status`) bypass Commander preAction hooks (`src/cli/program/preaction.ts`).
- Config: JSON5 → Zod (`.strict()` rejects unknown keys!) → runtime defaults. `loadConfig()` calls `loadDotEnv` internally — use `createConfigIO({ env: { ...process.env } })` to skip. `setConfigOverride()` is runtime-only.
- `.env` loading: CWD `.env`, then `~/.openclaw/.env`.
- Plugins: `openclaw.plugin.json` manifest + `register(api)`; discovered from `plugins.load.paths` + `extensions/`. Extension code can't import `src/` — use `openclaw/plugin-sdk/*` or read `params.cfg`.
- Owner ≠ allowlisted: owner comes from `commands.ownerAllowFrom` / channel owner entries / Control UI admin scope.
- Sessions (9.6): no automatic reset by default (`src/config/sessions/reset-policy.ts`); any `session.reset` block re-enables daily. Compaction manages size with a pre-compaction memory flush.
- Bootstrap files (MEMORY.md etc.) are injected into agent context, max 20K chars each.

## Key Gotchas

- oxlint: braces on every `if`; `catch (err)` is `unknown` → `err instanceof Error ? err.message : String(err)`; no duplicate imports from one module.
- Adding unknown fields to `openclaw.json` crashes the gateway (Zod strict). `bindings` is a top-level key, not under `agents`.
- Discord: a user must be in BOTH the guild `users` list and the account `allowFrom`, or messages drop silently. Valid bot tokens are ~72 chars; 100+ means corrupted.
- Debug-patching compiled `dist/*.js` on the VPS: use the already-imported `writeFileSync`, never `require("fs")` (ESM). Restore with `git config core.symlinks false && git checkout -- dist/<file> && git config --unset core.symlinks`.
- Ollama `gemini-3-flash-preview:cloud` misbehaves on native `/api/chat`; set that model's `api` to `"openai-completions"` in `models.providers.ollama.models[]`.
- Raw config tab: at 7.x new Zod defaults broke the raw round-trip (`config.get` → `raw: null`). At 9.6 the check compares against the pre-default parsed file, so new defaults can't break it; SEC-97 server also disables the fallback in dev-mode. If Raw is ever unclickable again, diff `snapshot.config` vs `JSON5.parse(snapshot.raw)` with a throwaway `.mts` under `dev-mode/` run via `./node_modules/.bin/tsx`.

## VPS Operational Lessons

- **Any config write can restart the gateway**; a restart once corrupted the WA Signal session ("Bad MAC", delayed bursts) — restart again and verify WhatsApp answers.
- **WA listener needs ~2 min after an upgrade restart** (`No active WhatsApp Web listener` meanwhile). Check `/tmp/openclaw/openclaw-*.log` only if it persists.
- **VPS watchdog flags our SSH bursts** (many sub-2-second root logins, key comment `claude-code-dev-vps`) and asks Ariel whether to block the IP. Correlate timestamps with our session; never block the IP or revoke the key over a burst alone.
- Channels are `["whatsapp", "discord"]` since the kapso teardown; implicit sends work again.

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
  - Upstream rebuilt the Control UI (SEC-97 client redone twice since).
  - `session.test.ts` failed on pristine 7.1 on Windows — pre-existing.
- **9.6** — see below.

### V2026.9.6 Upgrade (2026-09-27/28, branch `upgrade-2026.9.6`)

Clean-room from tag `v2026.9.6` (upstream 2026-09-22), ~33.4k commits / 48k files since 7.1. Upstream rewrote history: `v2026.7.1` is NOT an ancestor of `v2026.9.6` (merge-base `b81666c`) — don't trust `v2026.7.1..v2026.9.6` counts.

**Process that worked**: 4 parallel read-only Sonnet analyses (per patch SEAMLESS / ADAPT / THINK / DROP with 9.6 file:line) → Opus ports the confident set (`git apply --3way` of the fork diff for small hunks, manual re-homing otherwise) → Ariel decides THINK items one by one → rendered the real dev-mode system prompt (`buildAgentSystemPrompt` via `node --import ./scripts/tsx.mjs`) and swept runtime gates → docs.

**Upstream changes that shaped the port**: automatic session reset OFF by default (#111140, `e23dde3de55`; no doctor migration re-adds it) → FIX-05/06 dropped; bundled `session-memory` hook (opt-in); reasoning delivery/suppression + "Thinking" preamble → SEC-WA1 rebuilt; message-id echo dedupe → echo filter kept as safety net; WA "directory" sockets → history logger on normal sockets only; config page without Quick/Advanced → SEC-97 client rebuilt; `readLocalMediaFile` re-checks roots → SEC-102 moved; `MEMORY.md` = setup-completion evidence → FIX-01 after setup; subagent deny list non-overridable + `message` added (#120025, `8994c7799ba`) while default spawn depth went 1 → 5; WhatsApp exclusion derived from `package.json` only; fork WA code bundles under `dist/extensions/whatsapp/`; ~20 new state migrations; pnpm 12.4.0; `CLAUDE.md` had been committed as a symlink (mode `120000`) holding 69 KB of markdown → fixed in `89a6d85522`.

**Deploy (2026-09-28)** — OS `apt full-upgrade` first (40 packages, Node 24.19 → 24.21, kernel 6.8.0-142 installed, reboot pending), full backup `/root/.openclaw.bak-pre-9.6-20260928` (9.6 GB), then the recipe. Lessons:
- Run `openclaw doctor --fix` with the gateway STOPPED — while it runs, migrations refuse with "Agent main database is still open in another process" and every later step is skipped (looks like scary failures, isn't).
- `doctor` migrated the config to the 9.6 shape (`agents.list` → `agents.entries`, `memorySearch` → `memory.search`, `messages.tts` → `tts`, …) and restored `openclaw.json.last-good` over a clobbered write — verified no settings lost (same 3 agents).
- `acpx` failed to load: the VPS had stale real `dist/extensions/*/node_modules` dirs from npm-era deploys (7 of them; old acpx without `./agent-registry`) and never gets the build's local links → `dev-mode/link-dist-plugin-deps.sh` (now in the update recipe) replaces them with one link per plugin.
- `agents.defaults.subagents.maxSpawnDepth` was pinned to 2 in the config → set to 5 (Ariel: "if i have 5 depths i'm ok").
- Empty leftover `dev-mode/openclaw-whatsapp-claw.db` deleted.

**Pre-existing test failure**: `src/acp/translator.abort-cause.e2e.test.ts` fails on pristine `v2026.9.6` too (Linux, Node 26.8; A/B verified) — ignore.

**First-deploy checklist for 9.6 (VPS)**: snapshot `~/.openclaw`; upgrade pnpm to 12.4.0; update recipe; confirm no `session.reset` block in `openclaw.json` (any block re-enables daily reset); check `agents.defaults.subagents.maxSpawnDepth` isn't pinned below 5; `openclaw hooks enable session-memory < /dev/null`; `openclaw doctor --fix < /dev/null` and read every warning; restart; WA checks (checklist item 5); `/reasoning on` in self-chat → `💭 Reasoning:` messages, no loop, no `Dropped self-chat reasoning echo` log line; Control UI → Settings → Advanced opens Raw unblurred; `/status` shows `▶️ Active model`; ask the agent to use `gateway`/`nodes` from a cron turn (SEC-100).

## Open Items

- Manual check still open: Control UI → Settings → Advanced opens Raw, unblurred. (Verified 2026-09-28: reboot into kernel 6.8.0-142 with `Linger=yes` — gateway came back by itself; 💭 reasoning in WhatsApp self-chat with `ollama/glm-5.3-flash:cloud` + `/reasoning on`, no loop.)
- Delete `/root/.openclaw.bak-pre-9.6-20260928` (9.6 GB) once 9.6 is trusted.
- `doctor` advisories: legacy `agents.defaults.models` needs explicit provider/model refs before it can migrate to `agents.defaults.modelPolicy.allow`; bundled `github` plugin not in `plugins.allow` (link previews off); 9 historical transcripts deferred (header mismatch, originals untouched); no command owner configured (keeps `/update` owner-only — fine given the no-update rule); service policy refresh skipped because `~/.openclaw` is owned by `coder`.
- Gateway token NOT rotated (was plaintext in the deleted kapso-era `wa-claw-panel.service`) — Ariel's call.
- No web-search provider configured (bundled `duckduckgo`/`brave` available).
- Systemd unit carries a stale version stamp — cosmetic, `gateway status` warns.
- `~/.openclaw` ownership mess (`coder` uid 1001 owns much of it; Ariel's browser mini-VSCode on port 38080 needs read-write) — unresolved.

## Project File Structure (our additions)

```
dev-mode/
  install-guide.md        -- fork install/update guide
  link-dist-plugin-deps.sh -- VPS: link bundled plugins to their pnpm deps (update recipe)
  open-ideas/             -- parked ideas (subagent-talk.md)
  list.sec/               -- original per-item security plans (historical, 2026-03)
  my-archive/             -- session notes/handoffs (latest: my.2026.09.28.md — the 9.6 upgrade)
  trouble-shooting/       -- rescue + WhatsApp troubleshooting notes
  system-prompt/          -- captured system prompt (2026.5.2)
extensions/whatsapp/src/dev-mode/   -- wa-history, reasoning (SEC-WA1), echo-guard
ui/src/pages/config/dev-mode.ts     -- SEC-97 client
```
