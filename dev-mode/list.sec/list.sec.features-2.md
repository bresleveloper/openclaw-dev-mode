# New Features & Security Changes: V2026.3.23 + V2026.3.24

Analyzed from V2026.3.22 (our current base) through V2026.3.24.

- V2026.3.23: 122 commits (released 2026-03-23, also has patch v2026.3.23-2)
- V2026.3.24: 463 commits (released 2026-03-25, two betas)

---

## Security & Lockdown Changes (may need dev-mode bypass)

### SEC-NEW-1: Canvas Routes Require Auth (v2026.3.23)

- **File**: `src/gateway/server/http-auth.ts`
- **What**: Removed `isLocalDirectRequest()` bypass from `authorizeCanvasRequest()`. Previously loopback requests skipped auth. Now all canvas requests require bearer token or password.
- **Dev-mode relevance**: LOW. Our gateway is loopback-only with auth disabled. Only matters if using Control UI without auth.

### SEC-NEW-2: Admin Scope Required for Session Reset (v2026.3.23)

- **File**: `src/gateway/server-methods/agent.ts`
- **What**: `/new` and `/reset` session commands now require `operator.admin` scope. Non-admin HTTP API callers get `INVALID_REQUEST: missing scope: admin`.
- **Dev-mode relevance**: MEDIUM. Could block session resets from non-admin clients (e.g., Control UI without device pairing).

### SEC-NEW-3: Tighten Shell-Wrapper argv Allowlist (v2026.3.23)

- **File**: `src/infra/exec-approvals-allowlist.ts`
- **What**: New `isDirectShellPositionalCarrierInvocation()` uses strict regex `^(exec )?$0 $@*$` instead of the old loose pattern. Prevents prepending arbitrary commands before `$0` carrier invocation to pass allowlist checks.
- **Dev-mode relevance**: LOW. Fixes an injection vector in exec approvals. Tighter security, but doesn't restrict normal usage.

### SEC-NEW-4: Credential Redaction in Diagnostics (v2026.3.23)

- **File**: `src/agents/cache-trace.ts`, `src/agents/payload-redaction.ts`
- **What**: New `sanitizeDiagnosticPayload()` strips fields matching `apikey`, `password`, `secret`, `token`, `authorization` etc. from cache-trace output.
- **Dev-mode relevance**: LOW. Our SEC-72 already shows unredacted config via `config get`. This only affects diagnostic trace files.

### SEC-NEW-5: Sandbox alsoAllow + Re-allows (v2026.3.24) -- MAJOR

- **Files**: `src/agents/tool-policy-sandbox.ts` (NEW), `src/agents/pi-tools.ts`, `src/config/types.tools.ts`, `src/security/audit-extra.*.ts`
- **What**: Complete rewrite of sandbox tool policy. New `tools.sandbox.tools.alsoAllow` config (global and per-agent) lets users punch holes in the sandbox default deny list. Resolution now tracks policy sources (agent/global/default). Better error messages for blocked tools.
- **Dev-mode relevance**: LOW. We don't currently interact with sandbox tool policy. But worth knowing about for future.

### SEC-NEW-6: Close Sandbox Media Root Bypass (v2026.3.24)

- **Files**: `src/infra/outbound/message-action-params.ts`, `src/infra/outbound/message-action-runner.ts`
- **What**: Previously only `media`, `path`, `filePath` params were sandbox-checked. Now `mediaUrl` and `fileUrl` aliases are also checked. Closes a sandbox escape.
- **Dev-mode relevance**: LOW. Sandbox hardening, doesn't affect normal dev usage.

### SEC-NEW-7: Outbound Media Respects fs Policy (v2026.3.24)

- **Files**: `src/media/local-roots.ts` (NEW), `src/infra/outbound/message-action-runner.ts`, `src/auto-reply/reply/reply-media-paths.ts`
- **What**: When an agent has `toolFsWorkspaceOnly` policy, media local roots no longer expand with parent directories. Agents with workspace-only fs access can't send media from arbitrary filesystem locations.
- **Dev-mode relevance**: LOW. Only affects agents with explicit workspace-only fs restrictions.

### SEC-NEW-8: Plugin Hook Terminal Decisions Enforced (v2026.3.24) -- IMPORTANT

- **Files**: `src/plugins/hooks.ts`, `src/plugins/hooks.security.test.ts` (NEW)
- **What**: `before_tool_call` hooks returning `block: true` and `message_sending` hooks returning `cancel: true` are now "sticky" -- lower-priority plugins can no longer override them to false. Chain breaks after terminal decision.
- **Dev-mode relevance**: MEDIUM. If a security plugin blocks a tool call, no other plugin can undo it. Could affect plugin-heavy setups.

### SEC-NEW-9: Fail Closed on Errored Provider Allowlists (v2026.3.24)

- **File**: `src/auto-reply/command-auth.ts`
- **What**: When `resolveAllowFrom()` throws or returns invalid data, system now fails closed (denies) instead of silently dropping the errored provider and potentially granting access.
- **Dev-mode relevance**: LOW. Better fail-closed behavior. Shouldn't affect normal operation.

### SEC-NEW-10: Channel-Auth Prototype Pollution Guard (v2026.3.24)

- **File**: `src/cli/channel-auth.ts`
- **What**: Rejects plugin IDs that are `__proto__`, `constructor`, or `prototype`. Uses `hasOwnProperty.call()`. Sanitizes plugin IDs in error messages against control-char injection.
- **Dev-mode relevance**: NONE. Defense-in-depth against malicious plugin IDs.

### SEC-NEW-11: Exec/Policy Resolution Separation (v2026.3.24) -- IMPORTANT

- **Files**: `src/infra/exec-command-resolution.ts`, `src/infra/exec-approvals-allowlist.ts`, `src/agents/bash-tools.exec-host-gateway.ts`
- **What**: `CommandResolution` now separates executable resolution (what runs) from policy resolution (what allowlist checks). New `policyResolution` field. Prevents wrapper commands (`env`, `nice`, `time`) from carrying untrusted executables past allowlist checks.
- **Dev-mode relevance**: LOW. Fixes a trust confusion bug in exec approvals. Tighter but doesn't restrict valid usage.

### SEC-NEW-12: Operator Admin for Allowlist Mutations (v2026.3.24)

- **File**: gateway internal commands
- **What**: Internal `/allowlist` mutation commands now require `operator.admin` scope.
- **Dev-mode relevance**: MEDIUM. Same pattern as SEC-NEW-2. Could block allowlist changes from non-admin contexts.

### SEC-NEW-13: Reasoning Guard Fix (v2026.3.24)

- **File**: agents reasoning system
- **What**: Prevents model default reasoning from overriding agent's explicit `"off"` setting. Prevents redundant Reasoning output alongside internal thinking.
- **Dev-mode relevance**: LOW-MEDIUM. Could affect Ollama thinking behavior if `reasoningDefault: "on"` conflicts with model defaults.

---

## Upcoming (UNMERGED -- on feature branches, not yet in v2026.3.24)

### SEC-FUTURE-1: Skill Security Enforcement -- MAJOR

- **New files**: `src/security/skill-security-context.ts`, `src/security/skill-scanner.ts`
- **Modified**: `src/security/dangerous-tools.ts`, `src/agents/pi-tools.before-tool-call.ts`, `src/agents/skills/workspace.ts`, `src/agents/system-prompt.ts`
- **What**: Complete capability-based security model for community skills:
  - SKILL.md frontmatter declares `capabilities: [shell, filesystem, network, browser, sessions, messaging, scheduling]`
  - Static scanner detects prompt injection, suspicious constructs, capability mismatches
  - Runtime enforcement via `checkToolAgainstSkillPolicy()` in before-tool-call hook blocks undeclared tools
  - `COMMUNITY_SKILL_ALWAYS_DENY`: `gateway`, `nodes` always blocked with community skills
  - `DANGEROUS_COMMUNITY_SKILL_TOOLS`: exec, process, write, edit, apply_patch, web_fetch, web_search, browser, sessions_spawn, sessions_send, subagents, message, cron -- require matching capability
  - Skills with "critical" scan findings excluded entirely
  - System prompt gets trust context warning for incomplete capabilities
- **Dev-mode relevance**: HIGH. When this lands, will need `isDevMode()` bypass in `checkToolAgainstSkillPolicy()`.

### SEC-FUTURE-2: Cron Default Deny on HTTP Invoke

- **File**: `src/security/dangerous-tools.ts`
- **What**: Re-adds `"cron"` to `DEFAULT_GATEWAY_HTTP_TOOL_DENY` (was accidentally removed in skill security commit).

### SEC-FUTURE-3: Harden Untrusted External Content Boundaries

- **File**: `src/security/external-content.ts`
- **What**: External content boundary markers now include random 16-hex-char ID to prevent marker spoofing.

### SEC-FUTURE-4: sessions_history Payload Hard Cap

- **File**: `src/agents/tools/sessions-history-tool.ts`
- **What**: New `enforceSessionsHistoryHardCap()` limits output to 80KB. UTF-16-safe truncation.

### SEC-FUTURE-5: New Audit Checks (mDNS, Real-IP Fallback)

- **File**: `src/security/audit.ts`
- **What**: New checks:
  - `gateway.real_ip_fallback_enabled` -- warns when `gateway.allowRealIpFallback=true` (IP spoofing risk)
  - `discovery.mdns_full_mode` -- warns when mDNS full mode leaks host metadata

---

## New Features (non-security)

### V2026.3.23

| Feature                          | Details                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Qwen DashScope pay-as-you-go** | Standard API Key auth for China (`dashscope.aliyuncs.com`) and Global (`dashscope-intl.aliyuncs.com`) endpoints alongside existing Coding Plan subscriptions |
| **CSP inline script hashes**     | SHA-256 hashes for inline `<script>` tags in Content-Security-Policy `script-src` header                                                                     |
| **Control UI clarity**           | Consolidated button primitives, refined Knot theme, WCAG 2.1 AA contrast improvements                                                                        |
| **Bundled plugin runtime fix**   | WhatsApp `light-runtime-api.js` and Matrix `runtime-api.js` now ship correctly                                                                               |
| **Skill slug validation**        | Tightened to ASCII-only (no unicode in skill slugs)                                                                                                          |

### V2026.3.24

| Feature                           | Details                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **`/tools` command**              | Shows actually-available tools at runtime after full policy pipeline. New Control UI tools/skills panel                              |
| **MS Teams SDK migration**        | Full migration to `@microsoft/teams.apps` SDK. Streaming, welcome cards, AI labeling, edit/delete, feedback with reflective learning |
| **`--container` CLI flag**        | Target running Docker/Podman containers via `--container` or `OPENCLAW_CONTAINER` env                                                |
| **Discord auto-thread naming**    | `autoThreadName: 'generated'` uses LLM for 3-6 word thread titles                                                                    |
| **OpenAI compat endpoints**       | `/v1/models` and `/v1/embeddings` added to gateway OpenAI-compatible API                                                             |
| **MiniMax image generation**      | `image-01` registered as image gen provider. Legacy models trimmed to M2.7 only                                                      |
| **Control UI skills revamp**      | One-click skill install, status-filter tabs, markdown preview, agent workspace file preview                                          |
| **Skills install from ClawHub**   | `openclaw skills search\|install\|update` flows, ClawHub preferred over npm                                                          |
| **Slack interactive replies**     | Block Kit buttons and selects render properly in DM delivery                                                                         |
| **Plugin `before_dispatch` hook** | New hook point for plugins to intercept before message dispatch                                                                      |
| **Node 22.14+ support**           | Lowered Node floor, runtime stabilized for 22.14                                                                                     |
| **Sandbox `alsoAllow`**           | New config for punching holes in sandbox deny list without replacing entire allowlist                                                |
| **Agent per-agent reasoning**     | Per-agent thinking/reasoning/fast defaults with auto-revert for disallowed overrides                                                 |

### WhatsApp Changes (both versions, 54 files)

| Change                        | Details                                                                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity refactor**         | New `extensions/whatsapp/src/identity.ts` with typed `WhatsAppIdentity`, `WhatsAppSelfIdentity`, `WhatsAppReplyContext`. All direct field access replaced with helper functions |
| **Reply-to-bot detection**    | Unwraps `FutureProofMessage` (`botInvokeMessage`), reads `selfLid` from `creds.json`, compares for reply-to-bot implicit mention                                                |
| **Group echo suppression**    | Improved: `fromMe` filter, timing-based suppression for recent messages                                                                                                         |
| **Login flow**                | Avoids eager login tool runtime access                                                                                                                                          |
| **Active listener singleton** | Fixed split bundle chunks sharing listener map                                                                                                                                  |

---

## Merge Conflict Risk Assessment (if upgrading from V2026.3.22)

| File                                         | Risk     | Reason                                                                                                                                    |
| -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src/globals.ts`                             | MODERATE | Structural refactor (verbose/yes state moved to `src/global-state.ts`). `isDevMode()` itself untouched but surrounding code changed       |
| `src/gateway/server.impl.ts`                 | HIGH     | 1,176 lines of diff. Plugin loading renamed, startup refactored, large blocks restructured. Dev-mode hub auto-start code likely displaced |
| `src/cli/program/preaction.ts`               | MODERATE | New plugin install config policy import, new `shouldAllowInvalidConfigForAction()`. Dev-mode plugin path registration nearby              |
| `src/cli/run-main.ts`                        | LOW-MOD  | Container target support added in startup flow before profile parsing                                                                     |
| `extensions/whatsapp/.../process-message.ts` | HIGH     | Identity refactor changes same function as SEC-WA1. Field accesses replaced with helper functions                                         |
| `src/agents/system-prompt.ts`                | LOW      | ClawHub URL change + conditional heartbeat. SEC-15a is in different section                                                               |

### Files with NO upstream changes (safe):

- `src/browser/navigation-guard.ts` (SEC-70)
- `src/agents/tools/web-fetch.ts` (SEC-71)
- `src/cli/config-cli.ts` (SEC-72)
- `src/gateway/control-plane-rate-limit.ts` (SEC-78)
- `src/acp/translator.ts` (SEC-79)
- `src/gateway/startup-auth.ts` (SEC-80)
- `src/agents/workspace.ts` (FIX-01)
- `src/commands/onboard-config.ts` (SEC-59)
- `src/agents/pi-embedded-runner/extensions.ts` (SEC-67)
- `src/security/channel-metadata.ts` (SEC-27)
- `src/auto-reply/reply/untrusted-context.ts` (SEC-27)
- `src/security/dangerous-tools.ts` (no changes in released tags)
- `src/infra/host-env-security.ts` (SEC-96 dropped, no changes)
- All Ollama files (thinking + web search)

---

## TODO: Remove Ollama Web Search Provider

Our fork added a custom Ollama web search provider (4 files). Upstream now has its own Ollama web search support (landed in V2026.3.22 or earlier per bundled registry). Our custom implementation should be removed on next upgrade and replaced with whatever upstream ships.

**Files to revert to upstream:**

- `extensions/ollama/index.ts` -- remove our web search provider registration
- `extensions/ollama/src/ollama-web-search-provider.ts` -- DELETE (our custom file)
- `src/bundled-web-search-registry.ts` -- revert to upstream (remove our Ollama entry)
- `src/plugins/bundled-web-search-ids.ts` -- revert to upstream
- `src/plugins/bundled-web-search-provider-ids.ts` -- revert to upstream

**Why**: Our provider was a stopgap. Upstream likely handles Ollama web search through the standard plugin/provider system now. Keeping ours risks conflicts and divergence.
