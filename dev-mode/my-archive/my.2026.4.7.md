# Upstream Analysis: 2026-04-07

**Base**: V2026.3.24 (our current)
**Upstream**: V2026.4.5 (latest tag, ~6300 commits ahead)
**Releases since ours**: v2026.3.28, v2026.3.31, v2026.4.1, v2026.4.2, v2026.4.5

---

## 1. New Security & Restriction Changes

### 1A. New Restrictions (potential dev-mode bypass candidates)

#### Trust Boundary Hardening

- **Background exec events** (`48a3511233`): Background `notifyOnExit` summaries now marked `untrusted: false` — prevents lower-trust runtime output from re-entering later turns as trusted `System:` text.
- **Hook wake events** (`5b6e552b51`): Direct and mapped wake-hook payloads now queued as `untrusted`. External webhook content no longer enters session as trusted input.
- Files: `src/agents/acp-spawn-parent-stream.ts`, `src/agents/bash-tools.exec-runtime.ts`, `src/gateway/server/hooks.ts`
- **Dev-mode relevance**: LOW — we don't bypass trust validation at the event level, but if we add new event sources in dev-mode, they'll be untrusted by default.

#### Gateway HTTP Tool Deny List Expanded

- File: `src/security/dangerous-tools.ts`
- **New tools blocked via HTTP API**: `exec`, `spawn`, `shell` (moved from ACP-only), `fs_write`, `fs_delete`, `fs_move`, `apply_patch` (file mutation), `nodes` (node command relay)
- **Breaking**: `DANGEROUS_ACP_TOOL_NAMES` and `DANGEROUS_ACP_TOOLS` exports **removed entirely**. ACP tool approval handling reworked.
- **Dev-mode relevance**: NONE — verified 2026-04-07. None of our 14 `isDevMode()` call sites reference `dangerous-tools.ts` or its exports. Only consumed by `tools-invoke-http.ts`, `acp/client.ts`, and `security/audit.ts` — all untouched by us. Will auto-merge cleanly.

#### Build Tool Env Var Sanitization Expanded (`7306cf3707`)

- New blocked env vars: `CARGO_BUILD_RUSTC_WRAPPER`, `RUSTC_WRAPPER`, `MAKEFLAGS`, `MFLAGS`, `HGRCPATH`
- File: `src/infra/host-env-security-policy.json`
- **Dev-mode relevance**: LOW — orthogonal to our patches.

#### Inbound Mention Policy Centralization (`625fd5b3e3`)

- New centralized `src/channels/mention-gating.ts` with comprehensive test coverage
- Bot control commands require explicit mention even when `allowBots=mentions`
- All channel extensions routed through unified policy
- **Dev-mode relevance**: LOW — unless SEC-27 (untrusted wrapper) interacts with mention gating.

#### Provider Proxy URL Validation

- New validation on configured proxy URLs
- May add checks we'd want to skip in dev-mode for local/non-standard proxies.

### 1B. New Config Knobs We Could Use (Instead of Patching)

#### Sandbox `alsoAllow` (`edb5123f26`)

```yaml
agents.list[].tools.sandbox.tools.alsoAllow: ["message", "tts"]
```

Re-enables specific tools blocked by sandbox. Could replace some tool-profile patching.

#### Agent `systemPromptOverride`

```yaml
agents.defaults.systemPromptOverride: "..."
```

Full system prompt replacement. **Could potentially replace SEC-15a** (removing safety paragraph) without code patches — just set a custom prompt in config.

#### Agent `contextInjection`

```yaml
agents.defaults.contextInjection: "continuation-skip"
```

Skip bootstrap injection on continuation turns.

### 1C. Relaxations or Easings

**None found.** All upstream changes either tighten security, refactor existing security, or add new config knobs. The fork is swimming against the tide.

---

## 2. Tasks / TaskFlow Feature

### Simple Explanation

**TaskFlow** is a new durable workflow orchestration layer. Before this, OpenClaw had cron jobs and one-off background tasks (subagent spawns, ACP runs). TaskFlow adds multi-step flows with persistent state that survive gateway restarts, revision tracking to prevent conflicts, and clear lifecycle management.

The **heartbeat task batching** feature is the user-facing highlight: your `HEARTBEAT.md` can now declare a `tasks:` block where each task has a name, interval, and prompt. The heartbeat intelligently batches only "due" tasks into a single agent turn. So you can define email check every 30m, calendar scan every 1h, and notification check every 15m — they all run efficiently when their time comes.

### Deep Dive

#### Architecture Components

1. **Task Registry** (`src/tasks/task-registry.ts`)
   - SQLite-backed ledger tracking individual background tasks
   - Lifecycle: `queued → running → terminal` (succeeded/failed/timed_out/cancelled/lost)
   - Storage: `$OPENCLAW_STATE_DIR/tasks/runs.sqlite`
   - Auto-pruned after 7 days in terminal state

2. **TaskFlow Registry** (`src/tasks/task-flow-registry.ts`)
   - Manages multi-step flow lifecycle independently from individual tasks
   - Each flow: `flowId`, `status`, `currentStep`, `syncMode`, `stateJson`, `waitJson`, `revision`
   - Revision checking prevents concurrent mutation conflicts

3. **Two Sync Modes**:
   - **Managed**: TaskFlow owns the entire lifecycle — creates tasks as steps, advances automatically on success
   - **Mirrored**: TaskFlow observes externally-created tasks without controlling them — useful for wrapping existing cron jobs into one cohesive flow

4. **Heartbeat Task Batching** (`src/auto-reply/heartbeat.ts` + `src/infra/heartbeat-runner.ts`)
   - `parseHeartbeatTasks()` parses YAML-like task definitions from HEARTBEAT.md
   - `isTaskDue()` checks elapsed time since last run
   - Session store tracks `heartbeatTaskState` with timestamps
   - `resolveHeartbeatRunPrompt()` batches only due tasks into one agent turn
   - Updates last-run times after execution

5. **Plugin Bridges**:
   - Lobster integration (`extensions/lobster/src/lobster-taskflow.ts`) — managed mode with approval-wait states
   - Webhooks bridge (`ebad21c94d`) — external HTTP endpoints drive TaskFlows via per-route shared-secret endpoints

#### HEARTBEAT.md Example

```yaml
# Regular checklist items
- [ ] Check email
- [ ] Review calendar

# Periodic task definitions
tasks:
  - name: email-check
    interval: 30m
    prompt: "Check for urgent unread emails"

  - name: calendar-scan
    interval: 1h
    prompt: "Review upcoming events"
```

#### CLI Commands

```bash
openclaw tasks list                       # All tasks
openclaw tasks list --runtime cron        # Filter by runtime
openclaw tasks show <lookup>              # Details by ID/session
openclaw tasks cancel <lookup>            # Kill task + child session
openclaw tasks notify <lookup> <policy>   # done_only|state_changes|silent
openclaw tasks audit                      # Find operational issues
openclaw tasks maintenance                # Preview/apply cleanup

openclaw tasks flow list                  # All flows
openclaw tasks flow show <id>             # Flow details
openclaw tasks flow cancel <id>           # Cancel flow + children
```

#### Notification Delivery

- **Direct**: Completion goes to channel (WA, Discord, Slack) if `requesterOrigin` set
- **Session-queued**: If direct fails, queued for next heartbeat
- **Push-driven**: Task completion auto-wakes heartbeat for fast surfacing
- **Policies**: `done_only` (default), `state_changes` (every transition), `silent`

#### Reconciliation

Automatic sweeper every 60s:

1. Checks if active tasks still have runtime backing
2. Stamps `cleanupAfter` on terminal tasks (endedAt + 7 days)
3. Prunes expired records

#### Dev-Mode Implications

- **Ownership isolation**: Flows are keyed by `ownerKey` — dev-mode sharing a gateway won't leak cross-session
- **State directory**: Uses `$OPENCLAW_STATE_DIR/tasks/runs.sqlite` — dev-mode could use separate state dir
- **No dev-mode-specific restrictions**: TaskFlow doesn't have dev-mode bypasses needed — it's additive functionality, not a security gate

---

## 3. Other Notable Upstream Features

### Memory-Wiki System (30+ commits)

Full LLM-powered wiki stack:

- Wiki vault plugin with search, apply, lint tools
- Obsidian-compatible sync adapter
- Dashboard report generation, backlinks
- Memory journal bridge
- Sleep phases and REM preview for memory consolidation

### Media Generation (Video/Music/Image)

- **Video**: Runway, XAI, Alibaba providers. Mode-aware generation with async task tracking
- **Music**: Google + MiniMax providers with async task status
- **Comfy workflows**: 783-line workflow runtime for image/music/video via ComfyUI
- **Media intent preservation**: Auto-remaps geometry/duration across provider fallback (1354 insertions)

### Provider Ecosystem

- **Arcee AI**: New bundled provider (Trinity models, 128-256K context, OpenRouter support)
- **Gemma 4**: Google Gemma 4 model support
- **Ollama vision**: Auto-detect vision capabilities from `/api/show`
- **Bedrock embeddings**: AWS Bedrock embedding provider for memory search

### Gateway & Sessions

- **Compaction checkpoints** (`f4fcaa09a3`): 2172 insertions across 34 files — major session lifecycle improvement

### QA Lab

- Complete UI redesign (Slack-like chat, sidebar, dark mode)
- Interactive suite runner, Docker launcher
- 10+ repo-backed test scenarios

---

## 4. Pi Agent Framework (`@mariozechner/pi-*`)

### What Is Pi?

Pi is a modular agent framework by Mario Zechner, consisting of:

- **`@mariozechner/pi-agent-core`** (v0.61.1): Core agent runtime — types like `AgentMessage`, `AgentTool`, `AgentEvent`, `StreamFn`
- **`@mariozechner/pi-ai`** (v0.61.1): AI model abstraction — `complete()`, `streamSimple()`, `getModel()`, supports 30+ LLM providers through unified interface
- **`@mariozechner/pi-coding-agent`** (v0.61.1): Specialized coding agent — `createAgentSession()`, `SessionManager`
- **`@mariozechner/pi-tui`** (v0.61.1): Terminal UI components

### When Was It Introduced?

- **First commit**: Dec 18, 2025 (`5c705ab675`) — v0.21.0
- **Architectural shift**: Dec 17, 2025 (`fece42ce0a`, "feat: embed pi agent runtime") — moved from RPC stdin to embedded runtime
- **Current version**: v0.61.1 (Feb 22, 2026)

### How OpenClaw Uses Pi

OpenClaw wraps pi through a specialized adapter layer: **`pi-embedded-runner`** (50+ files in `src/agents/pi-embedded-runner/`).

**Core flow**:

1. `runEmbeddedPiAgent()` initiates execution with OpenClaw config
2. Creates `AgentSession` via pi-coding-agent
3. Builds payloads with messages and tools
4. Streams responses using `streamSimple()` from pi-ai
5. Subscribes to agent events, processes tool results
6. Handles compaction, tool splitting, history pruning

**Key architectural decisions**:

- OpenClaw is NOT directly coupled to pi types — only imports what's needed
- `pi-embedded-runner` completely encapsulates pi internals
- Dual streaming model: pi provides basic streaming, OpenClaw adds block-chunking, reasoning streaming, directive parsing
- Tool adaptation layer converts OpenClaw tools to pi format
- Error classification wraps pi events with OpenClaw's `FailoverError` system

### Where Pi Shows Up In Our Patches

- **`src/agents/pi-embedded-runner/extensions.ts`** (SEC-67): We override `resolveCompactionMode()` — this function controls pi session compaction behavior
- **`src/agents/ollama-stream.ts`** (Ollama thinking): This file was the Ollama-to-pi bridge — now **deleted upstream**, moved to `extensions/ollama/src/stream.ts`
- **Pi types in system-prompt.ts** (SEC-15a): The system prompt is assembled by pi-embedded-runner before passing to pi-ai's streaming

### Insights

- Pi is effectively **the brain** of OpenClaw — all LLM interactions flow through it
- OpenClaw's role is orchestration, tools, channels, config, and security layers around pi
- The `pi-embedded-runner` name reflects that pi runs in-process (not as external service)
- Frequent upstream pi version bumps (0.21→0.61 in 2 months) suggest active development and tight coupling
- The provider stream shared utilities (`plugin-sdk/provider-stream-shared`) are where thinking/reasoning wrappers live — this is the layer between pi-ai and individual providers

---

## 5. Upgrade & Migration Plan

### Overview

~6300 commits. Major code movements. Two files **deleted** (`navigation-guard.ts`, `ollama-stream.ts`). Multiple files heavily refactored. But many SEC items in low-change files.

### Conflict Risk Matrix

| Item              | File                                           |    Upstream Commits    | Risk         | Notes                                                                                                                                                                                                                                      |
| ----------------- | ---------------------------------------------- | :--------------------: | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SEC-15a           | `src/agents/system-prompt.ts`                  |           26           | **HIGH**     | Massive refactor — cache boundaries, dynamic context, new imports                                                                                                                                                                          |
| SEC-70            | `src/browser/navigation-guard.ts`              |      4 (deleted)       | **CRITICAL** | File DELETED. Moved to `extensions/browser/src/browser/navigation-guard.ts`. Our `assertBrowserNavigationAllowed()` bypass must move                                                                                                       |
| Ollama thinking   | `src/agents/ollama-stream.ts`                  |      5 (deleted)       | **CRITICAL** | File DELETED. Moved to `extensions/ollama/src/stream.ts`. Our thinking patches must be re-applied there                                                                                                                                    |
| Ollama web search | `extensions/ollama/`                           |           20           | **HIGH**     | Upstream now has official `web-search-provider.ts` at different path. Our `ollama-web-search-provider.ts` will conflict. Registry files (`bundled-web-search-ids.ts`, etc.) also DELETED upstream (replaced by manifest-derived contracts) |
| SEC-71            | `src/agents/tools/web-fetch.ts`                |           6            | **MEDIUM**   | Firecrawl code removed, new `resolveWebProviderConfig()` abstraction. Our fetch-limit patch needs re-targeting                                                                                                                             |
| SEC-80            | `src/gateway/startup-auth.ts`                  |           2            | **MEDIUM**   | Secret ref resolution refactored into `auth-config-utils.js`. Function renamed `hasConfiguredGatewayAuthSecretInput()`                                                                                                                     |
| preaction         | `src/cli/program/preaction.ts`                 |           4            | **MEDIUM**   | Major refactor — new startup context, presentation, bootstrap functions                                                                                                                                                                    |
| server.impl       | `src/gateway/server.impl.ts`                   |           44           | **MEDIUM**   | Heavy churn but our hub auto-start is a simple addition at startup                                                                                                                                                                         |
| WhatsApp          | `extensions/whatsapp/`                         | 154 files, +6691/-2612 | **MEDIUM**   | Lots of changes but SEC-WA1/echo-fix/wa-history are in different files                                                                                                                                                                     |
| SEC-27            | `channel-metadata.ts` + `untrusted-context.ts` |           0            | **NONE**     | Untouched upstream                                                                                                                                                                                                                         |
| SEC-59            | `onboard-config.ts`                            |           0            | **NONE**     | Untouched upstream                                                                                                                                                                                                                         |
| SEC-67            | `pi-embedded-runner/extensions.ts`             |           4            | **LOW**      | Minor changes, our compaction override should still apply                                                                                                                                                                                  |
| SEC-72            | `config-cli.ts`                                |           4            | **LOW**      | Changes likely cosmetic                                                                                                                                                                                                                    |
| SEC-78            | `control-plane-rate-limit.ts`                  |           0            | **NONE**     | Untouched upstream                                                                                                                                                                                                                         |
| SEC-79            | `acp/translator.ts`                            |           8            | **LOW**      | Some changes but our `getMaxPromptBytes()` override is isolated                                                                                                                                                                            |
| FIX-01            | `workspace.ts`                                 |           1            | **NONE**     | Trivial change                                                                                                                                                                                                                             |
| globals           | `src/globals.ts`                               |           1            | **NONE**     | Only added type annotation — our `isDevMode()` is an addition                                                                                                                                                                              |

### Recommended Merge Order

**Phase 1: Resolve Critical Deletions**

1. **Ollama stream** — Our 3 thinking patches (`think: true`, accumulate thinking, build content blocks) must move to `extensions/ollama/src/stream.ts`. Upstream already has `think?: boolean` in the request type and `thinking?/reasoning?` in the response type but does NOT convert them to thinking content blocks in `buildAssistantMessage()`. Our patch is still needed, just in a new location.
2. **Navigation guard** — Our `assertBrowserNavigationAllowed()` early return (SEC-70) must move to `extensions/browser/src/browser/navigation-guard.ts`. The function is now a class-based `BrowserNavigationPolicy` — need to review new API.
3. **Web search registry** — The files `bundled-web-search-ids.ts`, `bundled-web-search-provider-ids.ts`, `bundled-web-search-registry.ts` are all **deleted upstream**. Replaced by manifest-derived contracts. Our Ollama web search provider additions to these files are OBSOLETE. Upstream already has `extensions/ollama/src/web-search-provider.ts` — our custom `ollama-web-search-provider.ts` can be removed entirely.

**Phase 2: Re-apply High-Conflict Patches** 4. **SEC-15a** (system-prompt.ts) — 26 upstream commits. Will need careful manual merge. The safety paragraph removal may need to target a different location due to cache boundary restructuring. 5. **SEC-71** (web-fetch.ts) — Re-target our `resolveFetchMaxResponseBytes()` override to work with new `resolveWebProviderConfig()` abstraction.

**Phase 3: Handle Medium-Conflict Patches** 6. **SEC-80** (startup-auth.ts) — Update early return to match new function names 7. **preaction.ts** — Re-apply plugin loading hook to new startup context functions 8. **server.impl.ts** — Re-apply hub auto-start to refactored server setup

**Phase 4: Verify Low/No-Risk Patches** 9. SEC-27, SEC-59, SEC-67, SEC-72, SEC-78, SEC-79, FIX-01 — Should merge cleanly or with trivial conflicts 10. WhatsApp patches (SEC-WA1, echo filter, wa-history) — Different files from main WA refactor

### Items We Can Drop

- **Ollama web search provider files** (`ollama-web-search-provider.ts`, bundled ID files) — upstream has official implementation now. **Remove our custom provider, use upstream's.**
- **Windows symlink build fix** (`scripts/stage-bundled-plugin-runtime.mjs`) — check if upstream fixed this

### New SEC Item Candidates

| Potential ID | What                                 | Why                                                              |
| ------------ | ------------------------------------ | ---------------------------------------------------------------- |
| SEC-TRUST1   | Allow trusted background exec events | Background outputs now untrusted — may want to trust in dev-mode |

~~SEC-DT1 (gateway HTTP deny list)~~: Verified not needed — we don't touch `dangerous-tools.ts` or its consumers.

### Config-Only Alternatives (No Code Patches)

Before patching, check if these config knobs can replace SEC items:

- `agents.defaults.systemPromptOverride` — could replace SEC-15a (safety paragraph)
- `sandbox.tools.alsoAllow` — could replace some tool restrictions
- `agents.defaults.contextInjection: "continuation-skip"` — could reduce bootstrap noise

### Pre-Merge Checklist

- [ ] `git diff --stat v2026.3.24..upstream/main -- extensions/whatsapp/` — verify WA changes don't touch our patched files
- [ ] Test `systemPromptOverride` config to see if it fully replaces SEC-15a
- [ ] Verify `extensions/ollama/src/stream.ts` thinking handling — may already support our use case via `createMoonshotThinkingWrapper`
- [ ] Check if `extensions/browser/src/browser/navigation-guard.ts` has an equivalent to `assertBrowserNavigationAllowed()` we can bypass
- [ ] Confirm upstream Ollama web search provider accepts `OLLAMA_SEARCH_API_KEY` env var

---

## 6. Estimated Merge Effort

**Last merge** (V2026.3.24): 585 commits, 6 conflicts, ~2 hours
**This merge**: ~6300 commits, estimated 8-12 conflicts (2 critical file deletions + 6-8 content conflicts)

The two deleted files (ollama-stream, navigation-guard) and three deleted registry files make this harder than a normal rebase. Our Ollama web search provider can be dropped (upstream has it), which simplifies things. The remaining work is relocating patches to new file paths and adapting to refactored APIs.
