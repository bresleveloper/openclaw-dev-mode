# V2026.6.11 Merge Planning — 2026-06-30

Last merge: V2026.5.12 (2026-05-17)
Target: V2026.6.11 (2026-06-29)
Gap: 14,183 commits, 19,894 files changed, 2.18M insertions

---

## How to use this doc

Each item below describes:

- **Upstream**: what changed in upstream V2026.5.12 → V2026.6.11
- **Ours**: what our fork patch does in this file
- **Suggestion**: proposed resolution (keep / drop / relocate / rework)
- **Decision**: _[YOUR CALL — fill in]_

Items are grouped: (1) our SEC patches, (2) our FIX patches, (3) our WA features, (4) our build patches, (5) new upstream security features to evaluate.

---

## 1. SEC Patches

### SEC-15a — System Prompt Safety Paragraph (`src/agents/system-prompt.ts`)

**Upstream**: 307-line diff. Import paths changed (`pi-embedded-helpers` → `embedded-agent-helpers`, `pi-embedded-runner/types` → `embedded-agent-runner/types`, `../shared/string-coerce` → `@openclaw/normalization-core/string-coerce`). New sections added (Telegram rich text, Discord group etiquette, media directives, skill workshop prompt, self-knowledge docs rule). Some bootstrap functions removed/inlined.

**Ours**: `isDevMode()` gate removes the "Prioritize safety and human oversight..." paragraph.

**Suggestion**: RE-APPLY. Safety paragraph still exists upstream. Import block will conflict (take upstream). Our `isDevMode()` gate goes around the same paragraph text at its new line position.

**Conflict risk**: HIGH (import block + surrounding code changes). Body of our patch is isolated.

**Decision**: yes, and remove any other "safety" mentions from that file except 1 - "You have no independent goals: do not pursue self-preservation, replication, resource acquisition, or power-seeking;"

---

### SEC-27 — Channel Metadata Plain Text (`src/security/channel-metadata.ts` + `src/auto-reply/reply/untrusted-context.ts`)

**Upstream**: channel-metadata.ts: 9-line diff — `uniqueStrings` import added from normalization-core. untrusted-context.ts: 2-line diff — JSDoc additions only.

**Ours**: Returns plain text instead of UNTRUSTED wrapper; header says "Channel context:" instead.

**Suggestion**: RE-APPLY as-is. Trivial upstream changes, no conflict expected.

**Conflict risk**: LOW

**Decision**: ok

---

### SEC-59 — Skip Tools Profile Default (`src/commands/onboard-config.ts`)

**Upstream**: 9-line diff. `ONBOARDING_DEFAULT_DM_SCOPE` and `ONBOARDING_DEFAULT_TOOLS_PROFILE` changed from `export const` to `const` (no longer exported). Minor additions.

**Ours**: `isDevMode()` early return skips tools profile default in onboarding.

**Suggestion**: RE-APPLY as-is. Our early return is at the top of the function, unaffected by export changes.

**Conflict risk**: LOW

**Decision**: ok

---

### SEC-67 — Compaction Mode Override (`src/agents/pi-settings.ts` → DELETED)

**Upstream**: `pi-settings.ts` fully DELETED. All `pi-*` files renamed to `agent-*` in commit `bb46b79d3c1` ("refactor: internalize OpenClaw agent runtime"). `resolveEffectiveCompactionMode()` now lives in `src/agents/agent-settings.ts` line 108. Identical function signature.

**Ours**: `isDevMode()` early return in `resolveEffectiveCompactionMode()` returns `"default"` instead of `"safeguard"`.

**Suggestion**: RELOCATE. Pre-merge: revert `pi-settings.ts` to upstream V2026.5.12 so git deletes it cleanly. Post-merge: add `isDevMode()` early return to `resolveEffectiveCompactionMode()` in `agent-settings.ts`. Also need `import { isDevMode } from "../globals.js"` in the new file.

**Conflict risk**: "deleted by them, modified by us" if not pre-cleaned. Clean after pre-revert.

**Decision**: skip, i have future plans for Compaction

---

### SEC-70 — Browser Navigation Guard Skip (`extensions/browser/src/browser/navigation-guard.ts`)

**Upstream**: 15-line diff. Only JSDoc comment additions. No functional changes.

**Ours**: `process.env.OPENCLAW_DEV_MODE === "1"` early return at top of `assertBrowserNavigationAllowed()`.

**Suggestion**: RE-APPLY as-is. Auto-merges cleanly.

**Conflict risk**: NONE

**Decision**: ok

---

### SEC-71 — Web Fetch Max Response Bytes (`src/agents/tools/web-fetch.ts`)

**Upstream**: 196 lines changed but our `resolveFetchMaxResponseBytes()` function is isolated.

**Ours**: `resolveFetchMaxResponseBytes()` returns 50MB instead of 2MB when `isDevMode()`.

**Suggestion**: RE-APPLY. Likely auto-merges.

**Conflict risk**: LOW

**Decision**: ok

---

### SEC-72 — Config CLI Redaction Skip (`src/cli/config-cli.ts`)

**Upstream**: 651-line diff — massive expansion with secret refs support, session management commands, config audit. Core `runConfigGet` still exists.

**Ours**: `runConfigGet` skips `redactConfigObject()` when `isDevMode()` — API keys visible in config output.

**Suggestion**: RE-APPLY. Our patch point (inside `runConfigGet`) still exists. Line numbers shifted significantly but the skip logic is the same.

**Conflict risk**: MEDIUM (large surrounding changes, need to find new position)

**Decision**: make sure to skip any visible-reduction logic upstream has

---

### SEC-78 — Control Plane Rate Limit Bypass (`src/gateway/control-plane-rate-limit.ts`)

**Upstream**: 23-line diff. `normalizePart()` extracted to `normalizeControlPlaneIdentityPart()` in a new module. Minor refactoring.

**Ours**: `consumeControlPlaneWriteBudget` returns `{ allowed: true, ... }` immediately when `isDevMode()`.

**Suggestion**: RE-APPLY as-is. Our early return is at function top, unaffected.

**Conflict risk**: LOW

**Decision**: ok

---

### SEC-79 — Max Prompt Bytes Override (`src/acp/translator.ts`)

**Upstream**: 840-line diff. Massive refactoring — types extracted to sub-files (`translator.presentation.ts`, `translator.session-list.ts`, `translator.session-updates.ts`, `translator.replay.ts`). Many imports moved to `@openclaw/acp-core/*`. **Our `getMaxPromptBytes()` function pattern is gone** — upstream now uses `const MAX_PROMPT_BYTES = 2 * 1024 * 1024` directly at line 108, referenced inline at lines 675 and 695.

**Ours**: `getMaxPromptBytes()` function returns 50MB when `isDevMode()`, 2MB otherwise.

**Suggestion**: REWORK. Two options:

- (A) Change the const to a ternary: `const MAX_PROMPT_BYTES = isDevMode() ? 50 * 1024 * 1024 : 2 * 1024 * 1024;` (simplest)
- (B) Re-introduce our function and replace the 2 inline usages (cleaner but more invasive)

Option A recommended — one line, minimal diff.

**Conflict risk**: HIGH (massive file refactor). Our old function shape won't match.

**Decision**: A

---

### SEC-80 — Startup Auth Hook Token Check (`src/gateway/startup-auth.ts`) — **CANDIDATE FOR DROP**

**Upstream**: 70-line diff. `assertHooksTokenSeparateFromGatewayAuth()` (which threw an error) **REPLACED** with `warnHooksTokenReuseGatewayAuth()` (which only logs a warning). The function we patched no longer exists.

**Ours**: Early return in `assertHooksTokenSeparateFromGatewayAuth()` to skip the check.

**Suggestion**: DROP. Upstream already softened from error → warning. Our bypass is unnecessary — the warn-only function is non-blocking. One fewer patch to carry.

**Conflict risk**: "deleted by them, modified by us" if not pre-cleaned.

**Decision**: DROP

---

### SEC-WA1 — WhatsApp Thinking Messages (`extensions/whatsapp/src/auto-reply/deliver-reply.ts`)

**Upstream**: 109-line diff. Major type refactor:

- `WebInboundMsg` → `AdmittedWebInboundMessage`
- `msg.from` → `admission.conversation.id`
- `msg.chatId` → `msg.platform.chatJid`
- New `requireWhatsAppInboundAdmission(msg)` call at function top
- Import source changed: `channel-message` → `channel-outbound`

The `replyResult.text` manipulation point (where our regex runs) still exists before `normalizeWhatsAppOutboundPayload`.

**Ours**: Regex replaces `responsePrefix...Reasoning:` with `💭 Reasoning:` on `replyResult.text` before normalization.

**Suggestion**: RE-APPLY at updated position. The hook point is preserved — just shifted line numbers. Take upstream's type changes verbatim, re-insert our regex block before the `normalizeWhatsAppOutboundPayload` call.

**Conflict risk**: MEDIUM (type changes in function signature, but our patch is a small block)

**Decision**: ok

---

### SEC-97 — Raw Config & Dev-Mode UI

**Files**: `src/config/redact-snapshot.raw.ts`, `src/config/redact-snapshot.ts`, `src/config/types.openclaw.ts`, `ui/src/ui/types.ts`, `ui/src/ui/views/config.ts`, `ui/src/ui/app-render.ts`, `ui/src/ui/app.ts`, `ui/src/ui/controllers/config.ts`, `ui/src/ui/dev-mode-boot.ts`

**Upstream**:

- `redact-snapshot.raw.ts`: 8-line diff. Round-trip comparison now uses `snapshot.parsed ?? snapshot.config` instead of just `snapshot.config`.
- `redact-snapshot.ts`: 24-line diff. `uniqueStrings` import, minor logic.
- `types.openclaw.ts`: 163 lines changed. New fields (SecurityConfig, transcripts, etc).
- UI files: 2,485 lines changed across 5 files. Massive UI refactor.
- `dev-mode-boot.ts`: OUR file, not in upstream. No conflict.

**Ours**: `shouldFallbackToStructuredRawRedaction()` returns `false`; snapshot exposes `devMode` flag; UI skips Quick Settings, forces raw view, bypasses sensitive-value reveal blur. `dev-mode-boot.ts` caches flag to localStorage.

**Suggestion**: RE-APPLY. Take upstream changes, re-insert our dev-mode gates. The `snapshot.parsed ?? snapshot.config` change in redact-snapshot.raw.ts should be fine — our override returns `false` before that comparison runs anyway. UI files will need careful re-application due to massive refactor.

**Conflict risk**: HIGH on UI files, LOW on config files

**Decision**: ok

---

### SEC-98 — System Prompt Approval Restrictions (`src/agents/system-prompt.ts`)

**Upstream**: Same 307-line diff as SEC-15a (same file). New sections added but the approval/config-caution text we remove is in a different section.

**Ours**: Removes approval restriction lines + config/update caution lines; appends permissive safety line.

**Suggestion**: RE-APPLY at updated positions. Same file as SEC-15a — handle both together during merge.

**Conflict risk**: HIGH (same file as SEC-15a)

**Decision**: ok

---

### SEC-99 — Elevated Permissions Bypass (`src/auto-reply/reply/reply-elevated.ts`)

**Upstream**: 16-line diff. New `shouldUseFromAsSenderFallback()` guard added around the `senderFrom` token branch. Our patched function `resolveElevatedPermissions` still exists with same signature.

**Ours**: `resolveElevatedPermissions()` returns allowed immediately when dev-mode + Full profile — skips all 4 gates.

**Suggestion**: RE-APPLY as-is. Our early return fires at function top, before any of the new logic.

**Conflict risk**: LOW

**Decision**: ok

---

## 2. FIX Patches

### FIX-01 — MEMORY.md Bootstrap (`src/agents/workspace.ts`)

**Upstream**: 673-line diff. Massive additions (workspace attestation system, new helpers). But upstream still does NOT seed MEMORY.md natively. Import changes: `openBoundaryFile` → `openRootFile`, new imports added.

**Ours**: `writeFileIfMissing(memoryPath, memoryTemplate)` after heartbeat template.

**Suggestion**: RE-APPLY. FIX-01 body likely auto-merges. Import block will conflict — take upstream's imports, keep our `isDevMode` import.

**Conflict risk**: MEDIUM (import block conflict, body auto-merges)

**Decision**: ok

---

### FIX-02 — Ollama Duplicate Thinking Accumulation (`extensions/ollama/src/stream.ts`)

**Upstream**: Our duplicate accumulation lines were already removed in the V2026.5.2 merge. This FIX is done — nothing to carry.

**Suggestion**: ALREADY DONE. No action.

**Decision**: N/A — already resolved. remove mentions from readme and claude md

---

### FIX-03 — Status Message Model Selection (`src/status/status-message.ts`)

**Upstream**: 343-line diff. Two relevant upstream changes:

1. Upstream now has `contextConfig` that merges `args.config.agents.defaults` with `args.agent` — BUT `selectionConfig` (passed to `resolveConfiguredModelRef`) still uses only `args.agent ?? {}`. **The FIX-03 bug is still present upstream.**
2. Upstream added a native `Runtime:` line and `overrideLabel` on the Model line.

**Ours**: Two-part patch:

- (A) `selectionConfig` merges `args.config.agents.defaults` with per-agent override
- (B) Adds `⚙️ Runtime:` line below `🧠 Model:`

**Suggestion**: RE-APPLY part (A) — the selectionConfig merge fix. Part (B) may be redundant if upstream's native `Runtime:` line covers the same info. Compare during merge and decide.

**Conflict risk**: MEDIUM-HIGH (259-line diff, restructured code)

**Decision**: ok, but also make sure that A is actually still buggy, and check if B is needed, audit before fix

---

### FIX-04 — Reset Command ACK Gate (`src/auto-reply/reply/commands-reset.ts`)

**Upstream**: 34-line diff. `updateSessionStoreEntry` renamed to `updateSessionEntry` with new import path (`../../config/sessions/session-accessor.js`). Case-insensitive regex (`/i` flag added). New `onSessionPrepared` hook in ACP reset. Hardcoded `"✅ New session started."` ACK is still present.

**Ours**: `!isDevMode()` gate around the hardcoded ACK — dev-mode falls through to null, restoring the pre-`a68ca1ae0b` greeting flow.

**Suggestion**: RE-APPLY at updated position. The ACK is still there, just the surrounding code changed shape.

**Conflict risk**: LOW-MEDIUM

**Decision**: ok

---

## 3. WhatsApp Dev-Mode Features

### Echo Filter (`extensions/whatsapp/src/auto-reply/monitor/on-message.ts`)

**Upstream**: 305-line diff. Heavy refactor:

- New inbound type system: `WebInboundMsg` → `AdmittedWebInboundMessage` / `WebInboundMessageInput`
- New imports: `requireAdmittedWhatsAppInboundMessage`, `normalizeWebInboundMessage`, `withDeprecatedWebInboundMessageFlatAliases`
- New `StatusReactionController`
- `processForRoute` function signature changed

**Ours**: In dev-mode self-chat (`from === to`), skips inbound messages matching reasoning echo patterns (`[prefix] Reasoning:`, `💭 Reasoning:`, bare `Reasoning:`).

**Suggestion**: RE-APPLY with field mapping update. Self-chat detection needs new field access:

- Old: `msg.from === msg.to`
- New: likely `admission.conversation.id === msg.platform.recipientJid` (or similar — verify during merge)

**Conflict risk**: HIGH (heavy refactor, type system change)

**Decision**: ok, just double audit before implementing

---

### WA History Logger Activation (`extensions/whatsapp/src/session.ts`)

**Upstream**: 187-line diff. Proxy handling refactored (`HttpsProxyAgent` removed → `createHttp1EnvHttpProxyAgent`, `createHttp1ProxyAgent`, `createNodeProxyAgent`). New `rejectUnsafeWebCredsPath()` security check. `DisconnectReason` import removed (hardcoded to 401). QR terminal: `renderQrTerminal(qr)` → `renderQrTerminal(qr, { small: true })`.

**Ours**: `OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES` env var check + `import("./dev-mode/wa-history.js")` activation.

**Suggestion**: RE-APPLY at updated position. Our activation block is inserted in the socket setup area. Take upstream's refactored structure, re-insert our block. Note `rejectUnsafeWebCredsPath()` — unlikely to affect us but verify VPS creds dir is clean.

**Conflict risk**: MEDIUM

**Decision**: ok. in our dev-mode always full wa traffic save to the wa db. read server's path to db and app to show wa db history (should be like 30 last messages), that app and port should basically be up and running by default, and should be part of testing on deploy, and you should save all that data, db path and schema, app code, port, definitions, ect, to /dev-mode/wa-history/

---

### WA History Logger File (`extensions/whatsapp/src/dev-mode/wa-history.ts`)

**Upstream**: No changes — this is our custom file. Not in upstream.

**Suggestion**: KEEP as-is. No conflict.

**Conflict risk**: NONE

**Decision**: KEEP as-is

---

## 4. Ollama Thinking Injection

### Ollama `think: true` Injection (`extensions/ollama/src/stream.ts`)

**Upstream**: 335-line diff, 12 commits touching this file. Key changes:

- New `shouldForwardNativeOllamaThink(model, think)` function gating `think` param
- `shouldEmitThinking` / `suppressedThinking` logic to suppress thinking for certain turn types
- `eebdbabae97 fix: omit Ollama think for non-reasoning models`
- `c4bce00727e fix(ollama): strip inline kimi cloud reasoning leak`
- Cooperative yield scheduler added
- Imports reorganized from old paths to `openclaw/plugin-sdk/*`

**Ours**: Injects `body.think = true` in request body when `isDevMode()`.

**Suggestion**: RE-APPLY but needs integration with new `shouldForwardNativeOllamaThink` guard. Our injection should run after/inside that function, or we set `think = true` before it's checked, ensuring it passes through. Review the new guard logic during merge.

**Conflict risk**: MEDIUM-HIGH (significant restructuring around our injection point)

**Decision**: ok, audit correct way and implement

---

## 5. Build Patches

### WhatsApp Build Exclusion — KEEP-OURS (`scripts/lib/bundled-plugin-build-entries.mjs` + `package.json`)

**Upstream**: Still has both exclusions in V2026.6.11:

- `bundled-plugin-build-entries.mjs`: `EXCLUDED_CORE_BUNDLED_PLUGIN_DIRS = new Set(["qqbot", "whatsapp"])`
- `package.json` `files`: `"!dist/extensions/whatsapp/**"`

**Ours**: Removed `whatsapp` from both exclusion lists so patched WA builds into `dist/`.

**Suggestion**: KEEP-OURS on both. This is a recurring merge hazard — upstream will re-add on every merge. Tag for manual review.

**Conflict risk**: LOW (simple keep-ours)

**Decision**: ok, and add to post-deploy tests, as every deploy must end with you using the ssh cli to send me wa message

---

### Windows Symlink Fallback (`scripts/stage-bundled-plugin-runtime.mjs`)

**Upstream**: This script was deleted upstream in V2026.5.2. Our Windows fallback is dead code.

**Suggestion**: DROP. Script is gone upstream.

**Decision**: DROP

---

### tsdown Build Ignore (`scripts/tsdown-build.mjs`)

**Upstream**: May have changed but our patch (ignore `dev-mode/` unresolved imports) was already noted as dead code in CLAUDE.md since `wa-history.ts` moved into the extension.

**Suggestion**: DROP. Dead code, harmless but unnecessary.

**Decision**: DROP, and remove from claude.md and other mentions

---

## 6. Infrastructure

### `src/globals.ts` — `isDevMode()` Function

**Upstream**: 3-line diff. Import path change only (`./terminal/theme.js` → `../packages/terminal-core/src/theme.js`).

**Ours**: `isDevMode()` function that checks `process.env.OPENCLAW_DEV_MODE === "1"`.

**Suggestion**: RE-APPLY as-is. Auto-merges.

**Conflict risk**: NONE

**Decision**: ok

---

### `ui/src/ui/dev-mode-boot.ts` — Our Custom File

**Upstream**: Does not exist upstream.

**Suggestion**: KEEP as-is. No conflict.

**Conflict risk**: NONE

**Decision**: ok

---

### `README.md` — Fork Landing Page

**Upstream**: Will have upstream's README changes.

**Suggestion**: KEEP-OURS. Always restore our fork's README on every merge.

**Conflict risk**: LOW (simple keep-ours)

**Decision**: KEEP-OURS

---

## 7. New Upstream Security Features — Evaluate for Dev-Mode Bypass

These are NEW features in V2026.6.11 that didn't exist at V2026.5.12. None are currently bypassed. Evaluate whether dev-mode should disable any.

### NEW-A: Inbound System Tag Sanitization (`src/security/system-tags.ts`)

**What it does**: Neutralizes user-controlled strings that spoof system markers. Replaces `[System Message]` → `(System Message)`, `System:` → `System (untrusted):` in inbound text. Applied in inbound context, gateway hooks, and channel events.

**Annoying?**: Could be if you're injecting system-style context through WA or other channels (e.g., messages containing `[System]` or `System:` get rewritten).

**Suggestion**: PROBABLY SKIP bypass for now. Only annoying if you specifically need those patterns in channel messages.

**Decision**: SKIP

---

### NEW-B: Plugin Install Policy (`src/security/install-policy.ts`)

**What it does**: ~950-line framework for operator-gated plugin/skill installs. Runs external policy commands, fails closed. Checks source authority (`openclaw`, `official`, `third-party`, `unknown`, `user`). 10s timeout, 1MB max output.

**Annoying?**: No — we don't install plugins dynamically. Only fires on `openclaw plugins install`.

**Suggestion**: SKIP. Not relevant for dev-mode.

**Decision**: SKIP

---

### NEW-C: Dangerous Config Flag Auditing (`src/security/dangerous-config-flags-current.ts`)

**What it does**: Collects and logs "dangerous" config flags at startup audit. Checks: `allowInsecureAuth`, `dangerouslyAllowHostHeaderOriginFallback`, `dangerouslyDisableDeviceAuth`, `allowUnsafeExternalContent`, `applyPatch.workspaceOnly=false`, audit suppressions count.

**Annoying?**: Audit logging only — doesn't block anything. Just noise in logs.

**Suggestion**: SKIP. Non-blocking, and we don't use any of the flagged settings.

**Decision**: SKIP

---

### NEW-D: Gateway Owner-Only Core Tools (`src/security/dangerous-tools.ts`)

**What it does**: `GATEWAY_OWNER_ONLY_CORE_TOOLS = ["cron", "gateway", "nodes"]` — these tools require sender owner identity on gateway-scoped surfaces. Non-owner callers can't use them even with `gateway.tools.allow`.

**Annoying?**: Only if you have automated/non-owner callers that need cron, gateway, or nodes tools via the HTTP API. If Ariel is always the owner, this is transparent.

**Suggestion**: SKIP for now. If non-owner access is needed later, add bypass.

**Decision**: dont like it. implement new SEC, if `gateway.tools.allow` and is dev mode, then we allow.

---

### NEW-E: Tool Policy Audit Logging (`src/agents/tool-policy-audit.ts`)

**What it does**: Emits bounded audit log events when allow/deny policy layers remove tools from the available set.

**Annoying?**: No — just debug logging. Actually useful for troubleshooting.

**Suggestion**: SKIP. Useful, not annoying.

**Decision**: SKIP

---

### NEW-F: Per-Channel Message-Provider Tool Filtering (`src/agents/agent-tools.message-provider-policy.ts`)

**What it does**: Hardcoded tool allow/deny per message provider:

- `discord-voice` / `voice`: deny `tts`
- `node`: restrict to ONLY `["canvas", "image", "pdf", "tts", "web_fetch", "web_search"]`

**Annoying?**: The `node` channel restriction is aggressive — it limits to 6 tools. If you interact through the `node` message provider (direct API), this blocks most tools.

**Suggestion**: EVALUATE. If the VPS gateway uses `node` as a message provider for any workflow, this is very limiting. If WhatsApp is the primary channel, probably fine.

**Decision**: i do use the discord. if dev_mode() skip the discord restriction, name it a new SEC, and mention in readme that we skip only discord and note node.

---

### NEW-G: Session Create Rate Limit (`src/acp/translator.ts`)

**What it does**: `SESSION_CREATE_RATE_LIMIT_DEFAULT_MAX_REQUESTS = 120` per 10 seconds.

**Annoying?**: 120 sessions per 10 seconds is generous. Only annoying during stress testing.

**Suggestion**: SKIP. 120/10s is more than enough.

**Decision**: SKIP

---

### NEW-H: Unsafe WebSocket Creds Path Check (`extensions/whatsapp/src/session.ts`)

**What it does**: `rejectUnsafeWebCredsPath()` — new check at WA session startup asserting the credentials file is a regular file (not a symlink or other special file).

**Annoying?**: Only if VPS creds path (`~/.openclaw/credentials/whatsapp/default/`) has symlinks or unusual filesystem state.

**Suggestion**: SKIP — verify VPS creds dir is clean regular files after merge.

**Decision**: SKIP

---

## Summary Table

| ID              | File(s)                                   | Action                    | Risk      |
| --------------- | ----------------------------------------- | ------------------------- | --------- |
| SEC-15a         | system-prompt.ts                          | RE-APPLY                  | HIGH      |
| SEC-27          | channel-metadata.ts, untrusted-context.ts | RE-APPLY                  | LOW       |
| SEC-59          | onboard-config.ts                         | RE-APPLY                  | LOW       |
| SEC-67          | ~~pi-settings.ts~~ → agent-settings.ts    | RELOCATE                  | MEDIUM    |
| SEC-70          | navigation-guard.ts                       | RE-APPLY                  | NONE      |
| SEC-71          | web-fetch.ts                              | RE-APPLY                  | LOW       |
| SEC-72          | config-cli.ts                             | RE-APPLY                  | MEDIUM    |
| SEC-78          | control-plane-rate-limit.ts               | RE-APPLY                  | LOW       |
| SEC-79          | translator.ts                             | REWORK (const→ternary)    | HIGH      |
| SEC-80          | startup-auth.ts                           | **DROP**                  | —         |
| SEC-WA1         | deliver-reply.ts                          | RE-APPLY                  | MEDIUM    |
| SEC-97          | redact-snapshot + UI files                | RE-APPLY                  | HIGH (UI) |
| SEC-98          | system-prompt.ts                          | RE-APPLY                  | HIGH      |
| SEC-99          | reply-elevated.ts                         | RE-APPLY                  | LOW       |
| FIX-01          | workspace.ts                              | RE-APPLY                  | MEDIUM    |
| FIX-02          | ollama/stream.ts                          | DONE                      | —         |
| FIX-03          | status-message.ts                         | RE-APPLY (part A, eval B) | MED-HIGH  |
| FIX-04          | commands-reset.ts                         | RE-APPLY                  | LOW-MED   |
| Echo filter     | on-message.ts                             | RE-APPLY + field update   | HIGH      |
| WA history act. | session.ts                                | RE-APPLY                  | MEDIUM    |
| WA history file | wa-history.ts                             | KEEP (our file)           | NONE      |
| Ollama think    | ollama/stream.ts                          | RE-APPLY + new guard      | MED-HIGH  |
| WA build excl.  | build-entries.mjs + package.json          | KEEP-OURS                 | LOW       |
| Win symlink     | stage-bundled-plugin-runtime.mjs          | **DROP** (script deleted) | —         |
| tsdown ignore   | tsdown-build.mjs                          | **DROP** (dead code)      | —         |
| globals.ts      | globals.ts                                | RE-APPLY                  | NONE      |
| dev-mode-boot   | dev-mode-boot.ts                          | KEEP (our file)           | NONE      |
| README.md       | README.md                                 | KEEP-OURS                 | LOW       |
| NEW-A           | system-tags.ts                            | SKIP?                     | —         |
| NEW-B           | install-policy.ts                         | SKIP                      | —         |
| NEW-C           | dangerous-config-flags.ts                 | SKIP                      | —         |
| NEW-D           | dangerous-tools.ts (owner-only)           | SKIP?                     | —         |
| NEW-E           | tool-policy-audit.ts                      | SKIP                      | —         |
| NEW-F           | message-provider-policy.ts                | EVALUATE                  | —         |
| NEW-G           | translator.ts (session rate)              | SKIP                      | —         |
| NEW-H           | session.ts (creds path)                   | SKIP                      | —         |

**Decision**: dont use NEW code word, SEC or FIX or WA only

# NEW FEATURES REQUESTS

i want you to add 3 new things:

1. the current openclaw forces once a day a session reset. i dont like it, i want my agent to pile up his session forever. make a fix that if not set the setting about it (should be `session.reset`) and is dev_mode, then it skip session reset. also test and update me that no `session.reset` exists in my settings. label it as new FIX

2. there is a special code when auto-compact is done to create a new memory file. this does not happens when `/new` or `/compact` is called. add a 1-line solution that when new or compact is manually called it call the source code for new memory file. label it as new FIX

3. there is a file type and location limitation for sending files, only certain files types are allowed, and only from certain folders. i want that if identity is owner AND devmode AND agent is main, then skip this and allow any file type from any location to be sent to the user via (any channel if not complicated, only WA is must) as well as the user can send any file and demand it is saved in any localtion (any channel if not complicated, only WA is must). label it as new SEC

dont forget to update claude md and readme md with all new SECs and FIXes , here and above

---

## Implementation Plans

### FIX-05 — Session Daily Reset Bypass

**Goal**: When dev-mode is active AND `session.reset` is NOT explicitly configured, skip the daily session rollover so the agent piles up its session indefinitely.

**Verified**: VPS `~/.openclaw/openclaw.json` has `"session": { "dmScope": "per-channel-peer" }` — no `reset` key. The daily reset at hour 4 is a hardcoded default.

**File**: `src/auto-reply/reply/session.ts` (upstream line ~514)

**Current code**:

```ts
const skipImplicitExpiry = hasProviderOwnedSession(entry) && resetPolicy.configured !== true;
```

**Change**: Add `isDevMode()` as an alternative condition:

```ts
const skipImplicitExpiry =
  resetPolicy.configured !== true && (hasProviderOwnedSession(entry) || isDevMode());
```

**Import**: Add `isDevMode` to the existing imports from `../../globals.js`.

**How it works**: `resolveSessionResetPolicy()` returns `{ configured: false }` when no `session.reset` is in config. The existing `skipImplicitExpiry` path already skips freshness evaluation for provider-owned sessions with no explicit config. We add dev-mode as another reason to skip. If Ariel later sets `session.reset` explicitly, the bypass stops — he gets intentional control.

**Scope**: 1-line change + 1 import addition. Zero risk — uses the same skip path that provider-owned sessions already use.

---

### FIX-06 — Memory Flush on /compact and /new

**Goal**: Trigger the memory file creation (same as auto-compact does) when `/compact` or `/new` is manually called.

**Reality check**: The memory flush (`runMemoryFlushIfNeeded` in `agent-runner-memory.ts`) runs an embedded LLM agent with `trigger: "memory"` to summarize the session transcript into a dated `memory/YYYY-MM-DD.md` file. It requires `FollowupRun` and `ReplyOperation` runtime objects that are NOT available in command handlers. This is NOT a 1-line fix — it's a ~20-line integration.

**How auto-compact does it**: `runPreflightCompactionIfNeeded()` (in `agent-runner-memory.ts`) compacts → calls `runMemoryFlushIfNeeded()` → which checks `compactionCount > memoryFlushCompactionCount` → runs embedded agent → writes memory file.

**What `/compact` currently does**: Calls `compactEmbeddedAgentSession()` with `trigger: "manual"` → calls `incrementCompactionCount()`. The count IS bumped, so the next inbound message's `runMemoryFlushIfNeeded` WILL detect the mismatch and flush. But it's delayed by 1 message — not immediate.

**What `/new` currently does**: Resets the session. No compaction, no count increment, no flush. Old transcript is lost.

**Proposed approach — Option A (deferred, minimal)**:

- For `/compact`: Already works! Count is incremented. Flush triggers on next message. No code change needed.
- For `/new`: In `commands-reset.ts`, before session reset, increment `compactionCount` (without incrementing `memoryFlushCompactionCount`). The new session's first message will trigger the flush. BUT — the new session won't have the old transcript to summarize. **This doesn't achieve the goal for /new.**

**Proposed approach — Option B (recommended, ~20 lines)**:

- Extract the core memory flush trigger into a standalone helper `triggerMemoryFlushForSession()` in a new or existing module.
- Call it from `commands-compact.ts` after `incrementCompactionCount()` (immediate flush).
- Call it from `commands-reset.ts` before session reset (flushes old session's memory).
- Gate both calls with `isDevMode()` so stock behavior is unchanged.
- The helper constructs minimal `FollowupRun`-like params from `HandleCommandsParams` and calls `compactEmbeddedAgentSession()` with `trigger: "memory"`.

**File changes**:

- `src/auto-reply/reply/commands-compact.ts` — add flush call after `incrementCompactionCount()`
- `src/auto-reply/reply/commands-reset.ts` — add flush call before session reset
- Possibly a shared helper file for the flush trigger construction

**Risk**: MEDIUM. Threading params correctly is tricky. Dev-mode gated so no risk to stock behavior.

---

### SEC-100 — Gateway Owner-Only Core Tools Bypass

**Goal**: When dev-mode is active, allow all tools regardless of owner identity on gateway-scoped surfaces. Currently `GATEWAY_OWNER_ONLY_CORE_TOOLS = ["cron", "gateway", "nodes"]` are blocked for non-owner callers.

**File**: `src/gateway/tool-resolution.ts` (upstream lines 127-130)

**Current code**:

```ts
const ownerOnlyGatewayDeny =
  params.senderIsOwner === false || (surface === "http" && params.senderIsOwner !== true)
    ? [...GATEWAY_OWNER_ONLY_CORE_TOOLS]
    : [];
```

**Change**:

```ts
const ownerOnlyGatewayDeny = isDevMode()
  ? []
  : params.senderIsOwner === false || (surface === "http" && params.senderIsOwner !== true)
    ? [...GATEWAY_OWNER_ONLY_CORE_TOOLS]
    : [];
```

**Import**: Add `import { isDevMode } from "../globals.js";`

**Scope**: 1-line change + 1 import. Zero risk — dev-mode gated.

---

### SEC-101 — Discord/Message-Provider Tool Filtering Bypass

**Goal**: When dev-mode is active, skip the `filterToolsByMessageProvider()` call that restricts tools based on message provider (Discord voice denies `tts`; `node` restricts to 6 tools).

**File**: `src/agents/agent-tools.ts` (upstream line ~1112, call to `filterToolsByMessageProvider`)

**Current code** (approximate):

```ts
const filteredTools = filterToolsByMessageProvider(tools, messageProvider);
```

**Change**: Skip the filter in dev-mode:

```ts
const filteredTools = isDevMode() ? tools : filterToolsByMessageProvider(tools, messageProvider);
```

**Import**: `isDevMode` likely already imported in this file. If not, add `import { isDevMode } from "../globals.js";`.

**Scope**: 1-line change. Zero risk — dev-mode gated. Note: bypasses ALL message-provider filtering (discord, discord-voice, node). CLAUDE.md and README should note this covers discord specifically (Ariel's request) but also skips node restrictions.

---

### SEC-102 — File Type/Location Restrictions Bypass

**Goal**: When identity is owner AND dev-mode AND agent is main, allow any file type from any location to be sent/received via WA (and other channels if easy).

**Research findings** (from upstream/main audit):

1. **WhatsApp has NO file-type (MIME) restrictions** — it sends/receives whatever Baileys provides. MIME restrictions exist only on the HTTP Gateway API (`input-files.ts`) and media-understanding text extraction (`apply.ts`, soft + auto-expanding).

2. **Location restrictions for file tools** (`read`/`write`/`edit`/`apply_patch`): Controlled by `workspaceOnly` flag. **Default is `false`** — no restriction. Only `apply_patch` defaults to `workspaceOnly=true`. Config: `tools.fs.workspaceOnly` and `tools.exec.applyPatch.workspaceOnly`.

3. **Location restrictions for media tools** (image/PDF/music/video): Two enforcement paths:
   - **Sandbox mode** (`sandbox-media-paths.ts`): Only when `workspaceOnly=true` in sandbox config.
   - **Host mode** (`local-media-access.ts`): `assertLocalMediaAllowed()` checks against a fixed list of allowed roots (`~/.openclaw/tmp/`, `~/.openclaw/media/`, `~/.openclaw/state/media/`, workspace dir, etc). This is the main restriction.

**What actually restricts Ariel**: `assertLocalMediaAllowed()` in `src/media/local-media-access.ts` (lines 57-140). When media tools try to read from a path outside the default roots, it throws. For sending arbitrary files from VPS filesystem to WA, this blocks paths like `/tmp/some-report.pdf` or `/home/user/data.csv`.

**Bypass approach**:

- **File**: `src/media/local-media-access.ts`
- **Function**: `assertLocalMediaAllowed()` (line ~57)
- **Change**: Add early return when `isDevMode()`:

```ts
export function assertLocalMediaAllowed(params: { ... }): void {
  if (isDevMode()) { return; }
  // ... existing checks
}
```

- **Import**: Add `import { isDevMode } from "../globals.js";`
- **Note**: This function doesn't receive owner/agent identity. Adding identity threading would require changes in 6+ call sites. Since dev-mode already implies a trusted environment, gating on `isDevMode()` alone is sufficient (owner+main agent filtering would be defense-in-depth for a dev-only feature).

**For inbound files** (user sending files via WA to be saved anywhere): The `read`/`write`/`edit` tools already allow any location when `workspaceOnly=false` (the default). No additional bypass needed.

**Scope**: 1-line change + 1 import in `local-media-access.ts`. Optionally also bypass `assertSandboxPath()` in `sandbox-paths.ts` for completeness (same pattern, same 1-line change), though sandbox mode is unlikely active on Ariel's VPS.

---

## Updated Summary Table

| ID              | File(s)                                   | Action                                            | Risk      |
| --------------- | ----------------------------------------- | ------------------------------------------------- | --------- |
| SEC-15a         | system-prompt.ts                          | RE-APPLY                                          | HIGH      |
| SEC-27          | channel-metadata.ts, untrusted-context.ts | RE-APPLY                                          | LOW       |
| SEC-59          | onboard-config.ts                         | RE-APPLY                                          | LOW       |
| SEC-67          | ~~pi-settings.ts~~ → agent-settings.ts    | **SKIP** (future Ariel plans)                     | —         |
| SEC-70          | navigation-guard.ts                       | RE-APPLY                                          | NONE      |
| SEC-71          | web-fetch.ts                              | RE-APPLY                                          | LOW       |
| SEC-72          | config-cli.ts                             | RE-APPLY + skip new upstream visibility-reduction | MEDIUM    |
| SEC-78          | control-plane-rate-limit.ts               | RE-APPLY                                          | LOW       |
| SEC-79          | translator.ts                             | REWORK (const→ternary)                            | HIGH      |
| SEC-80          | startup-auth.ts                           | **DROP** (upstream softened to warning)           | —         |
| SEC-WA1         | deliver-reply.ts                          | RE-APPLY                                          | MEDIUM    |
| SEC-97          | redact-snapshot + UI files                | RE-APPLY                                          | HIGH (UI) |
| SEC-98          | system-prompt.ts                          | RE-APPLY                                          | HIGH      |
| SEC-99          | reply-elevated.ts                         | RE-APPLY                                          | LOW       |
| SEC-100         | tool-resolution.ts                        | **NEW** — owner-only tools bypass                 | LOW       |
| SEC-101         | agent-tools.ts                            | **NEW** — message-provider tool filter bypass     | LOW       |
| SEC-102         | local-media-access.ts                     | **NEW** — file location restriction bypass        | LOW       |
| FIX-01          | workspace.ts                              | RE-APPLY                                          | MEDIUM    |
| ~~FIX-02~~      | ~~ollama/stream.ts~~                      | **DONE** — remove from docs                       | —         |
| FIX-03          | status-message.ts                         | RE-APPLY (part A, eval B)                         | MED-HIGH  |
| FIX-04          | commands-reset.ts                         | RE-APPLY                                          | LOW-MED   |
| FIX-05          | session.ts                                | **NEW** — session daily reset bypass              | LOW       |
| FIX-06          | commands-reset.ts, commands-compact.ts    | **NEW** — memory flush on /new and /compact       | MEDIUM    |
| Echo filter     | on-message.ts                             | RE-APPLY + field update                           | HIGH      |
| WA history act. | session.ts                                | RE-APPLY                                          | MEDIUM    |
| WA history file | openclaw-whatsapp-claw.ts                 | KEEP (our file)                                   | NONE      |
| Ollama think    | ollama/stream.ts                          | RE-APPLY + new guard                              | MED-HIGH  |
| WA build excl.  | build-entries.mjs + package.json          | KEEP-OURS                                         | LOW       |
| Win symlink     | stage-bundled-plugin-runtime.mjs          | **DROP** (script deleted)                         | —         |
| tsdown ignore   | tsdown-build.mjs                          | **DROP** (dead code)                              | —         |
| globals.ts      | globals.ts                                | RE-APPLY                                          | NONE      |
| dev-mode-boot   | dev-mode-boot.ts                          | KEEP (our file)                                   | NONE      |
| README.md       | README.md                                 | KEEP-OURS                                         | LOW       |
