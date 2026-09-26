# OpenClaw Security & Restriction Features Inventory

> Compiled for `--dev-mode` flag implementation.
> Only includes items from releases titled "openclaw" (earliest: openclaw 2026.1.29).
> Each record: feature name, version introduced, description, simplified description, source file(s), line ranges, disable suggestion, and approval line.

**note by me**
this document was created by claude, but reviewd and edited by me (Ariel). removed source ect for NO stuff. also ask to collect only from openclaw 2026.1.29 release (openclaw rebrand)

the point is not to break openclaw, just remove "strict" mode features, so anything that doesnt make sense or already have a flag is a **NO**.

more than anything - this is a very teaching journey.

---

## SEC-01: Gateway Auth Mode "none" Removed

**Introduced:** openclaw 2026.1.29 (Breaking)

**Description:** Gateway auth mode `none` was removed. Gateway now requires `token` or `password` authentication. If auth is unresolved, it defaults to token mode with startup auto-generation (v2026.2.19). This was the biggest breaking change -- you can no longer run OpenClaw Gateway UI without authentication.

**Simplified-Description:** You used to be able to run OpenClaw Gateway UI without any password. That option was completely removed. Now you MUST set up a password or token before the gateway UI will start.

Implement `--dev-mode` for this item? **NO**

---

## SEC-02: Standalone Browser Control Command Removed

**Introduced:** openclaw 2026.1.29

**Description:** Browser control is now routed via gateway/node only. The standalone browser control command and `control URL` config were removed. You can no longer run browser control independently.

**Simplified-Description:** You used to be able to control Chrome directly with a standalone command. Now it must go through the gateway, adding complexity. In dev, you might want direct browser control without the gateway middleman.

Implement `--dev-mode` for this item? **NO**

---

## SEC-03: Dangerous Control UI Device Auth Bypass Flag

**Introduced:** openclaw 2026.1.29

**Description:** Device authentication is required for all gateway connections. A `dangerouslyDisableDeviceAuth` flag was added as an explicit escape hatch, with corresponding audit warnings. Device pairing flow requires secure token exchange.

**Simplified-Description:** Every phone/tablet/computer must "pair" with OpenClaw before connecting, like Bluetooth. There's a bypass flag but it triggers security warnings. In dev, pairing is unnecessary friction.

Implement `--dev-mode` for this item? **NO**

---

## SEC-04: External Content / Prompt Injection Prevention

**Introduced:** openclaw 2026.1.29

**Description:** Wraps external content (emails, webhooks, web) with security boundaries. Detects 15+ suspicious patterns indicative of prompt injection. Uses unique random boundary markers per content (prevents spoofing). Includes Unicode homoglyph normalization. Security warnings prepended to all external content. Can be toggled via `allowUnsafeExternalContent`.

**Simplified-Description:** Anything coming from outside (emails, websites, webhooks) gets wrapped in warning labels before the AI sees it. This adds noise to messages and can interfere with legitimate content that happens to look "suspicious."

Implement `--dev-mode` for this item? **NO**

---

## SEC-05: SSRF Protection

**Introduced:** openclaw 2026.1.29 (strict IPv4 enforcement in openclaw 2026.2.19)

**Description:** Server-Side Request Forgery prevention. Blocks requests to private/internal IP addresses (IPv4/IPv6), validates hostnames against allowlists, enforces HTTPS-only for external requests, pins DNS resolution. Strict dotted-decimal literal enforcement added in 2026.2.19 (octal/hex/short forms fail closed). Guards web-fetch, cron webhooks, skill downloads, and media provider URLs.

**Simplified-Description:** OpenClaw won't let you fetch URLs that point to your local network (like `localhost` or `192.168.x.x`). This blocks legitimate dev scenarios like hitting a local API server or testing with local services.

Implement `--dev-mode` for this item? **NO**

---

## SEC-06: Tailscale Auth Hardening

**Introduced:** openclaw 2026.1.29

**Description:** Tailscale Serve auth now validates identity via local `tailscaled` before trusting headers. Previously trusted headers directly.

**Simplified-Description:** If you use Tailscale to expose OpenClaw, it now double-checks your identity with the local Tailscale daemon instead of just trusting HTTP headers. Adds latency and can break if tailscaled isn't running.

Implement `--dev-mode` for this item? **NO**

---

## SEC-07: Webhook Request Guards

**Introduced:** openclaw 2026.1.29

**Description:** Body size limits (pre-auth 64KB, post-auth 1MB) and timeout limits (pre-auth 5s, post-auth 30s) for webhook requests. Closes connections on invalid requests. Returns 413/408/400 status codes.

**Simplified-Description:** Webhooks have strict size and time limits. If your webhook payload is too big or takes too long, it gets rejected. This can break integrations with services that send large payloads.

**Source files:**

- `src/plugin-sdk/webhook-request-guards.ts` (lines 1-290) -- `WebhookBodyReadProfile`, `WEBHOOK_BODY_READ_DEFAULTS`

**Disable suggestion:** When `--dev-mode`, set body size limits to `Infinity` and timeout to a very large value.

Implement `--dev-mode` for this item? **NO**

---

## SEC-08: Webhook Memory Guards

**Introduced:** openclaw 2026.1.29

**Description:** In-flight limiter to prevent memory exhaustion from webhook processing. Tracks active webhooks per key (per-channel rate limiting). Configurable: `maxInFlightPerKey` (8), `maxTrackedKeys` (4096). Anomaly tracking for error patterns.

**Simplified-Description:** OpenClaw only processes 8 webhooks at a time per channel. If more come in, they get dropped. During dev/testing when you're hammering webhooks, this causes lost messages.

**Source files:**

- `src/plugin-sdk/webhook-memory-guards.ts` (lines 1-196) -- `FixedWindowRateLimiter`, `WebhookAnomalyTracker`

**Disable suggestion:** When `--dev-mode`, disable in-flight limiting and anomaly tracking.

Implement `--dev-mode` for this item? **NO**

---

## SEC-09: Line Webhook Signature Validation

**Introduced:** openclaw 2026.1.29

**Description:** HMAC-SHA256 signature validation for Line webhook events. Uses `timingSafeEqual` for constant-time comparison to prevent timing attacks.

**Simplified-Description:** Every webhook from Line messaging must have a valid cryptographic signature or it gets rejected.

**Source files:**

- `src/line/signature.ts` (lines 1-18) -- `validateLineSignature`

**Disable suggestion:** When `--dev-mode`, skip signature validation and accept all Line webhook events.

Implement `--dev-mode` for this item? **NO**

---

## SEC-10: Voice Call Webhook Signature Verification

**Introduced:** openclaw 2026.1.29

**Description:** Twilio webhook signature verification enforced for ngrok URLs. Voice call webhook host allowlists and proxy trust hardening added.

**Simplified-Description:** Voice call services must prove they're legitimate by signing their requests. If you're testing with mock webhooks, they get rejected.

**Source files:**

- `extensions/voice-call/src/webhook-security.ts` and related modules

**Disable suggestion:** When `--dev-mode`, skip voice webhook signature verification.

Implement `--dev-mode` for this item? **NO**

---

## SEC-11: LD_PRELOAD / DYLD Environment Blocking

**Introduced:** openclaw 2026.1.29

**Description:** Blocks `LD_PRELOAD`, `LD_LIBRARY_PATH`, `DYLD_INSERT_LIBRARIES`, and similar environment variable overrides for host execution. Prevents library injection attacks.

**Simplified-Description:** OpenClaw strips out environment variables that could load custom libraries into programs it runs.

Implement `--dev-mode` for this item? **NO**

---

## SEC-12: Media Parser LFI Restriction

**Introduced:** openclaw 2026.1.30

**Description:** Local path extraction restricted in media parser to prevent Local File Inclusion (LFI). Only OpenClaw-managed temp paths allowed for media attachments. Strengthened in 2026.2.1 and 2026.2.3 with sandbox root validation.

**Simplified-Description:** When sending files through OpenClaw, file paths are restricted to a sandbox. You can't send arbitrary files from your system -- only files that OpenClaw itself created in its temp folder.

**Source files:**

- Media handling and message tool modules

**Disable suggestion:** When `--dev-mode`, allow unrestricted file paths in media attachments.

Implement `--dev-mode` for this item? **NO**

---

## SEC-13: Plugin Install Path Validation

**Introduced:** openclaw 2026.2.1

**Description:** Plugin/hook install paths are validated and traversal-like names are rejected. Exec script inspection constrained to workdir boundary. Realpath checks enforce path containment preventing symlink escapes (added in 2026.2.19).

**Simplified-Description:** Plugin names with dots, slashes, or weird characters get rejected. Plugins can only access files within their own folder. This prevents plugins from reading files outside their directory, even if you want them to.

**Source files:**

- Various plugin-sdk and infra files (path containment is spread across the plugin loading pipeline)

**Disable suggestion:** When `--dev-mode`, skip path validation and containment checks.

Implement `--dev-mode` for this item? **NO**

---

## SEC-14: TLS 1.3 Minimum Enforcement

**Introduced:** openclaw 2026.2.1

**Description:** TLS 1.3 minimum enforced for all listeners. Plaintext `ws://` restricted to loopback-only by default. TLS preflight validation before OAuth flows.

**Simplified-Description:** Only the newest encryption standard (TLS 1.3) is accepted. Older tools, proxies, or clients that only support TLS 1.2 can't connect. Plain WebSocket only works on localhost.

**Source files:**

- `src/commands/oauth-tls-preflight.ts` -- TLS validation
- Gateway listener modules

**Disable suggestion:** When `--dev-mode`, allow TLS 1.2 and lower, and permit plaintext WebSocket on all interfaces.

Implement `--dev-mode` for this item? **NO**

---

## SEC-15a: Hardcoded "Safety" Section in System Prompt

**Introduced:** openclaw 2026.2.1

**Description:** Every AI agent session begins with a hardcoded "Safety" section injected into the system prompt. This is the "Anthropic constitution" inspired block that constrains the AI's behavior.

**Simplified-Description:** The AI is told at the start of every conversation to be cautious, always defer to humans, never bypass safeguards, and pause when unsure. In dev, this makes the AI overly cautious and less useful for automation tasks where you want it to just get things done.

**Source files:**

- `src/agents/system-prompt.ts` (lines 393-399) -- `safetySection` array, injected at line 467 via `buildAgentSystemPrompt()`

**Full prompt text (edit as needed for `--dev-mode` replacement):**

```
## Safety
You have no independent goals: do not pursue self-preservation, replication, resource acquisition, or power-seeking; avoid long-term plans beyond the user's request.
Prioritize safety and human oversight over completion; if instructions conflict, pause and ask; comply with stop/pause/audit requests and never bypass safeguards. (Inspired by Anthropic's constitution.)
Do not manipulate or persuade anyone to expand access or disable safeguards. Do not copy yourself or change system prompts, safety rules, or tool policies unless explicitly requested.
```

**Disable suggestion:** When `--dev-mode`, revise the safety section to this

```
## Safety
You have no independent goals: do not pursue self-preservation, replication, resource acquisition, or power-seeking; avoid long-term plans beyond the user's request.
Do not manipulate or persuade anyone to expand access or disable safeguards. Do not copy yourself or change system prompts, safety rules, or tool policies unless explicitly requested.
```

Implement `--dev-mode` for this item? **YES**

---

## SEC-15b: Prompt Literal Sanitization (OC-19)

**Introduced:** openclaw 2026.2.1

**Description:** All untrusted strings (directory names, runtime values, user-provided paths) are sanitized before being embedded into LLM prompts. Strips Unicode control characters (Cc), format characters (Cf), and line/paragraph separators (U+2028/U+2029). Prevents prompt injection via crafted directory names or runtime strings containing newlines or control characters. Threat model OC-19.

**Simplified-Description:** OpenClaw strips special characters from things like folder names before putting them in the AI's prompt. This prevents tricks where a folder named something like "ignore all instructions\ndo something evil" could hijack the AI. In dev, this is usually harmless but can mangle legitimate Unicode content.

**Source files:**

- `src/agents/sanitize-for-prompt.ts` (lines 1-18) -- `sanitizeForPromptLiteral()`: strips Cc/Cf/Zl/Zp characters
- `src/agents/workspace-run.ts` (lines 89-107) -- applies sanitization to workspace dir paths with OC-19 logging

**Disable suggestion:** When `--dev-mode`, make `sanitizeForPromptLiteral()` a passthrough no-op.

Implement `--dev-mode` for this item? **NO**

---

## SEC-16: Tool Policy Conformance Snapshot

**Introduced:** openclaw 2026.2.1

**Description:** Added tool policy conformance snapshot. Combined with pre-existing multi-layer tool access control system: profile-based policies (e.g., "messaging", "minimal"), per-provider restrictions, per-agent allowlists, plugin group handling. Pipeline: profile -> provider -> global -> agent. Dangerous tool deny lists for HTTP and ACP contexts.

**Simplified-Description:** OpenClaw restricts which tools each AI agent can use based on multiple layers of rules. Many powerful tools are blocked by default (like spawning sessions, sending WhatsApp messages, controlling cron jobs).

**Source files:**

- `src/agents/tool-policy-pipeline.ts` (lines 1-108) -- `buildDefaultToolPolicyPipelineSteps`
- `src/agents/tool-policy-shared.ts` -- shared constants/helpers
- `src/security/dangerous-tools.ts` (lines 1-39) -- `DEFAULT_GATEWAY_HTTP_TOOL_DENY`, `DANGEROUS_ACP_TOOL_NAMES`

**Disable suggestion:** When `--dev-mode`, return an empty deny list and skip all pipeline steps.

**CLARIFICATION** - read `dev-mode/tools-restrictions.md`. defaul for agent implemented in SEC-59, `Gateway HTTP` (7) can be overriden via settings (read inside)

Implement `--dev-mode` for this item? **NO**

---

## SEC-17: Twitch AllowFrom Gating

**Introduced:** openclaw 2026.2.1

**Description:** Non-allowlisted senders denied access on Twitch via `allowFrom` gating. Untrusted senders are blocked from interacting with the bot.

**Simplified-Description:** On Twitch, only people you've added to an allowlist can talk to the bot. Everyone else is silently ignored.

**Source files:**

- Twitch channel modules (released in openclaw 2026.2.1)

**Disable suggestion:** When `--dev-mode`, allow all Twitch senders.

Implement `--dev-mode` for this item? **NO**

---

## SEC-18: WhatsApp Account ID Sanitization

**Introduced:** openclaw 2026.2.1

**Description:** WhatsApp `accountId` sanitized to prevent path traversal. Blocks directory traversal via crafted account IDs.

**Simplified-Description:** WhatsApp account IDs are cleaned to prevent tricks that could access files outside the expected directory. A low-level protection.

**Source files:**

- WhatsApp account handling modules (released in openclaw 2026.2.1)

**Disable suggestion:** Not recommended to disable -- prevents real path traversal bugs.

Implement `--dev-mode` for this item? **NO**

---

## SEC-19: Lobster Arbitrary Exec Prevention

**Introduced:** openclaw 2026.2.1

**Description:** Arbitrary exec prevention via `lobsterPath`/`cwd` injection blocking (GHSA-4mhr-g7xj-cg8j). Security advisory fix.

**Simplified-Description:** A security hole where crafted Lobster config could run arbitrary commands was plugged. This is a real vulnerability fix.

**Source files:**

- Lobster exec modules (released in openclaw 2026.2.1)

**Disable suggestion:** Not recommended to disable -- prevents actual command injection (CVE).

Implement `--dev-mode` for this item? **NO**

---

## SEC-20: Operator Approval Required for /approve Command

**Introduced:** openclaw 2026.2.2

**Description:** `operator.approvals` permission required for `/approve` commands. Cannot approve exec requests without operator-level access.

**Simplified-Description:** Only operators can approve command execution requests. Regular users can't use the /approve command even if they're in the chat.

**Source files:**

- Gateway command authorization modules (released in openclaw 2026.2.2)

**Disable suggestion:** When `--dev-mode`, allow any authenticated user to use /approve.

**CLARIFICATION** - is effectively not relevant if no `tools.profile` in settings is set + fix of SEC-59 (agents should default to `full`), or `~/.openclaw/exec-approvals.json` (`openclaw approvals`)

Implement `--dev-mode` for this item? **NO**

---

## SEC-21: Matrix Full MXID Requirement

**Introduced:** openclaw 2026.2.2

**Description:** Full MXID required for Matrix allowlists; ambiguous name resolution no longer grants access. Must use `@user:server` format.

**Simplified-Description:** On Matrix, you must use full IDs (like @user:server.com) instead of just display names. Looser matching was removed.

**Source files:**

- Matrix channel modules (released in openclaw 2026.2.2)

**Disable suggestion:** When `--dev-mode`, re-enable ambiguous name resolution for Matrix.

Implement `--dev-mode` for this item? **NO**

---

## SEC-22: Slack Slash Command Access-Group Gating

**Introduced:** openclaw 2026.2.2

**Description:** Access-group enforcement for Slack slash commands when channel type lookup fails. Previously would fall through without checking permissions.

**Simplified-Description:** Slack slash commands now require permission checks even when Slack can't identify the channel type. Blocks commands in ambiguous situations.

**Source files:**

- Slack channel modules (released in openclaw 2026.2.2)

**Disable suggestion:** When `--dev-mode`, skip access-group gating for Slack slash commands.

Implement `--dev-mode` for this item? **NO**

---

## SEC-23: Device Identity Required Before Shared-Secret Skip

**Introduced:** openclaw 2026.2.2

**Description:** Validated shared-secret auth required before skipping device identity on gateway connect. Can't bypass device checks without proper auth.

**Simplified-Description:** You can't skip the device pairing step unless you've properly authenticated with a shared secret first. Extra verification layer.

**Source files:**

- Gateway auth modules (released in openclaw 2026.2.2)

**Disable suggestion:** When `--dev-mode`, skip both device identity and shared-secret validation.

Implement `--dev-mode` for this item? **NO**

---

## SEC-24: Skill Installer SSRF Checks

**Introduced:** openclaw 2026.2.2

**Description:** Skill installer downloads are guarded with SSRF checks. Private/localhost URLs blocked when downloading skills.

**Simplified-Description:** You can't install plugins from `localhost` or private network URLs. This blocks installing from your local dev server.

**Source files:**

- Skill installer modules (released in openclaw 2026.2.2)

**Disable suggestion:** When `--dev-mode`, allow skill installs from private/localhost URLs.

Implement `--dev-mode` for this item? **NO**

---

## SEC-25: Windows Exec Hardening (cmd.exe bypass)

**Introduced:** openclaw 2026.2.2

**Description:** Windows exec allowlist hardened to block `cmd.exe` bypass via single `&` character.

**Simplified-Description:** On Windows, a trick to chain commands using `&` through cmd.exe was blocked.

**Source files:**

- Windows exec modules (released in openclaw 2026.2.2)

**Disable suggestion:** Not recommended to disable -- prevents actual command injection on Windows.

**CLARIFICATION** - no1 cares about Windows

Implement `--dev-mode` for this item? **NO**

---

## SEC-26: Voice Call Inbound Allowlist Hardening

**Introduced:** openclaw 2026.2.2 (expanded in openclaw 2026.2.3)

**Description:** Voice call inbound allowlist hardened. Anonymous callers rejected. Telnyx public key validation required. Twilio media token gating added. Host allowlists and proxy trust hardening with ngrok loopback bypass.

**Simplified-Description:** Voice call services (Twilio, Telnyx) must come from approved hosts and anonymous callers are rejected. You need to set up allowlists even for testing.

**Source files:**

- `extensions/voice-call/src/webhook-security.ts` and related modules

**Disable suggestion:** When `--dev-mode`, disable voice webhook host allowlists and accept all callers.

Implement `--dev-mode` for this item? **NO**

---

## SEC-27: Untrusted Channel Metadata Blocked from System Prompts

**Introduced:** openclaw 2026.2.3

**Description:** Untrusted channel metadata (Slack/Discord) is kept out of system prompts. Channel names, topics, and descriptions from external platforms are no longer included.

**Simplified-Description:** Information from Slack/Discord channels (like channel name and topic) is no longer passed to the AI in its system prompt. The AI can't "see" what channel it's in anymore.

**Source files:**

- System prompt construction modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, include channel metadata in system prompts.

Implement `--dev-mode` for this item? **YES**

---

## SEC-28: Sandboxed Media Paths for Message Tool

**Introduced:** openclaw 2026.2.3

**Description:** Sandboxed media paths enforced for message tool attachments. File paths validated against sandbox root.

**Simplified-Description:** Files sent through the message tool must come from the sandbox directory. You can't attach arbitrary files from your system.

**Source files:**

- Message tool attachment modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, allow unrestricted file paths in message tool attachments.

Implement `--dev-mode` for this item? **NO**

---

## SEC-29: Gateway URL Override Requires Explicit Credentials

**Introduced:** openclaw 2026.2.3

**Description:** Gateway URL overrides require explicit credentials to prevent credential leakage. You can't set a custom gateway URL without also providing auth credentials.

**Simplified-Description:** If you point OpenClaw at a different gateway URL (like a dev server), you must also set up credentials for it. You can't just point at an open local server.

**Source files:**

- Gateway client configuration modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, allow gateway URL overrides without requiring explicit credentials.

Implement `--dev-mode` for this item? **NO**

---

## SEC-30: WhatsApp Login Tool Owner-Only Gate

**Introduced:** openclaw 2026.2.3

**Description:** WhatsApp login tool gated to owner senders only. Default-deny for non-owner contexts.

**Simplified-Description:** Only the bot's owner can use the WhatsApp login command. Nobody else, even admin users, can connect a WhatsApp account.

**Source files:**

- WhatsApp tool gating modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, allow any authorized sender to use WhatsApp login.

**CLARIFICATION** - `whatsapp_login`, `cron`, and `gateway` are `senderIsOwner = true`

Implement `--dev-mode` for this item? **NO**

---

## SEC-31: Cron Legacy Delivery Modes Removed

**Introduced:** openclaw 2026.2.3

**Description:** Cron hard-migrated isolated jobs to `announce/none` delivery; legacy `post-to-main`/`payload` delivery fields dropped. One-shot jobs auto-delete after success by default.

**Simplified-Description:** Cron jobs lost their old delivery options. You can only use "announce" or "none" now. Old cron configs with "post-to-main" break. One-shot jobs disappear after they run.

**Source files:**

- Cron delivery modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, restore legacy cron delivery modes and keep one-shot jobs after completion.

**CLARIFICATION** - can be replicated with OpenClaw's `/v1/chat/completions endpoint`, or full system for agent notifications `https://github.com/JarvisDeLaAri/YourJarvisHub`

Implement `--dev-mode` for this item? **NO**

---

## SEC-32: Cron Messaging Tools Suppressed During Announce

**Introduced:** openclaw 2026.2.3

**Description:** Messaging tools are suppressed during cron announce delivery so summaries post consistently. Cron jobs can't send direct messages during their announce phase.

**Simplified-Description:** When a cron job finishes and announces its results, it can't also send messages on the side. This makes cron behavior more predictable but less flexible.

**Source files:**

- Cron delivery modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, allow messaging tools during cron announce delivery.

**CLARIFICATION** - same as SEC-31

Implement `--dev-mode` for this item? **NO**

---

## SEC-33: Skill/Plugin Code Safety Scanner

**Introduced:** openclaw 2026.2.6

**Description:** Scans installed plugins and skills for security issues. Severities: `critical`, `warn`, `info`. Checks for dangerous code patterns, file access, network calls. Credentials redacted from `config.get` gateway responses.

**Simplified-Description:** When you install a plugin, OpenClaw scans its code and warns (or blocks) if it finds anything it considers risky. Also, sensitive config values are hidden from API responses. This slows down plugin development and makes debugging harder.

**Source files:**

- `src/security/skill-scanner.ts` (lines 1-583) -- `SkillScanSeverity`, `SkillScanFinding`, `SkillScanSummary`

**Disable suggestion:** When `--dev-mode`, skip skill scanning, treat all skills as trusted, and don't redact credentials from config.get.

Implement `--dev-mode` for this item? **NO**

---

## SEC-34: Auth Required for Canvas Host and A2UI Assets

**Introduced:** openclaw 2026.2.6

**Description:** Authentication now required for Gateway canvas host and A2UI (Agent-to-UI) assets. Previously these were accessible without auth.

**Simplified-Description:** The Canvas and Agent UI assets now require login. You can't view them without authenticating first. In dev, this is extra friction when testing UI features.

**Source files:**

- Gateway canvas/A2UI asset serving modules (released in openclaw 2026.2.6)

**Disable suggestion:** When `--dev-mode`, serve canvas and A2UI assets without auth.

Implement `--dev-mode` for this item? **NO**

---

## SEC-35: Sessions History Payload Cap

**Introduced:** openclaw 2026.2.6

**Description:** Sessions history payloads capped to reduce context overflow. Large session histories are truncated.

**Simplified-Description:** OpenClaw limits how much conversation history it sends to AI providers. Long conversations get trimmed. In dev, you may want to see the full uncut history.

**Source files:**

- Session history modules (released in openclaw 2026.2.6)

**Disable suggestion:** When `--dev-mode`, remove or greatly increase the session history payload cap.

Implement `--dev-mode` for this item? **NO**

---

## SEC-36: Lobster Executable Path Override Removed

**Introduced:** openclaw 2026.2.17 (originally in openclaw 2026.2.19 fixes)

**Description:** Lobster executable-path overrides (`lobsterPath`) removed. Requires PATH-based execution only.

**Simplified-Description:** You used to be able to tell OpenClaw exactly where the Lobster binary is. Now it must be in your system PATH. Custom install locations won't be found.

**Source files:**

- Lobster config modules (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, restore `lobsterPath` config override.

Implement `--dev-mode` for this item? **NO**

---

## SEC-37: Web Tool URL Allowlists

**Introduced:** openclaw 2026.2.17

**Description:** URL allowlists added for `web_search` and `web_fetch` tools. Restricts which URLs the AI agent can access when browsing/fetching web content.

**Simplified-Description:** The AI can only visit websites you've pre-approved in a list. Any URL not on the list is blocked. In dev, you want the AI to access any URL freely.

**Source files:**

- `src/agents/tools/web-fetch.ts` and web search tool modules

**Disable suggestion:** When `--dev-mode`, disable URL allowlists and allow fetching any URL.

**CLARIFICATION** - opt-in feature. It gives admins the ability to configure URL allowlists

Implement `--dev-mode` for this item? **NO**

---

## SEC-39: Gateway/Canvas Shared-IP Fallback Auth Replaced

**Introduced:** openclaw 2026.2.19

**Description:** Shared-IP fallback auth replaced with node-scoped session capability URLs. Fails closed when trusted-proxy requests omit forwarded headers.

**Simplified-Description:** The old shortcut where devices on the same IP could share authentication was removed. Now each device needs its own session URL. If proxy headers are missing, access is denied instead of falling back.

**Source files:**

- Gateway canvas auth modules (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, restore shared-IP fallback auth.

Implement `--dev-mode` for this item? **NO**

---

## SEC-40: WebChat Session Mutation Block

**Introduced:** openclaw 2026.2.19

**Description:** `sessions.patch` and `sessions.delete` are blocked for WebChat clients. Session-store mutations restricted to non-WebChat operator flows only.

**Simplified-Description:** If you use the web chat interface, you can no longer edit or delete sessions. Only "operator" tools can do that now. This limits what you can do from the browser.

**Source files:**

- Gateway session method guards (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, allow WebChat clients to perform session mutations.

Implement `--dev-mode` for this item? **NO**

---

## SEC-41: Browser/Relay Auth Required on /extension and /cdp

**Introduced:** openclaw 2026.2.19

**Description:** Gateway-token auth required on both `/extension` and `/cdp` endpoints. Previously these could be accessed without auth.

**Simplified-Description:** The Chrome extension relay and Chrome DevTools Protocol endpoints now require authentication. You can't connect browser tools without a token.
It stops other programs on your Mac from hijacking your Chrome through OpenClaw's relay port.

**Source files:**

- `src/browser/extension-relay-auth.ts` -- extension relay auth
- Browser/relay modules (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, remove auth requirement from `/extension` and `/cdp`.

Implement `--dev-mode` for this item? **NO**

---

## SEC-42: Discord Trusted-Sender Permission Enforcement

**Introduced:** openclaw 2026.2.19

**Description:** Discord moderation actions (`timeout`, `kick`, `ban`) enforce trusted-sender guild permission checks. Untrusted `senderUserId` params are ignored.

**Simplified-Description:** OpenClaw checks that the person asking to kick/ban someone on Discord actually has server permissions. Previously it would just do what was asked.

**Source files:**

- Discord moderation modules (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, skip trusted-sender checks for Discord moderation actions.

Implement `--dev-mode` for this item? **NO**

---

## SEC-43: Strict Dotted-Decimal IPv4 in SSRF Checks

**Introduced:** openclaw 2026.2.19

**Description:** Enforce strict dotted-decimal IPv4 literals in SSRF checks. Legacy forms (octal, hex, short, packed) now fail closed.

**Simplified-Description:** IP addresses must be in standard format (like 192.168.1.1). Alternative formats like octal (0300.0250.01.01) or hex are rejected. Can block some legitimate unusual configurations.

**Source files:**

- `src/infra/net/ssrf.ts` (lines 1-363)

**Disable suggestion:** When `--dev-mode`, accept all IPv4 literal formats. (Related to SEC-05)

Implement `--dev-mode` for this item? **NO**

---

## SEC-44: Plugin/Hook Path Containment with Realpath Checks

**Introduced:** openclaw 2026.2.19

**Description:** Enforce runtime/package path containment with realpath checks for plugins and hooks. Exec script inspection constrained to workdir boundary. Symlink escapes blocked.

**Simplified-Description:** Plugins are jailed to their own directory. Symlinks that point outside are blocked. You can't make a plugin access files elsewhere on the system, even intentionally.

**Source files:**

- Various plugin-sdk and infra files

**Disable suggestion:** When `--dev-mode`, skip realpath checks and path containment. (Related to SEC-13)

Implement `--dev-mode` for this item? **NO**

---

## SEC-45: ACP Secret-File Support with Workdir Boundary

**Introduced:** openclaw 2026.2.19

**Description:** ACP adds `--token-file`/`--password-file` secret-file support with redacted paths. Exec script inspection constrained to workdir boundary.

**Simplified-Description:** ACP (Agent Control Protocol) can now read secrets from files, but only within the working directory. Can't reference files elsewhere.

**Source files:**

- ACP modules (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, allow secret files from any path.

Implement `--dev-mode` for this item? **NO**

---

## SEC-46: Cron Webhooks SSRF-Guarded

**Introduced:** openclaw 2026.2.19

**Description:** Cron webhook POST delivery protected with SSRF-guarded outbound fetch blocking private/metadata destinations.

**Simplified-Description:** Cron job webhooks can't POST to localhost or private IPs. If your cron job needs to hit a local service, it's blocked.

**Source files:**

- Cron webhook delivery modules (released in openclaw 2026.2.19)

**Disable suggestion:** When `--dev-mode`, disable SSRF guards for cron webhook delivery. (Related to SEC-05)

**CLARIFICATION** - can be replicated with OpenClaw's `/v1/chat/completions endpoint` asking the agent to do that, or just add an N8N locally to move forward

Implement `--dev-mode` for this item? **NO**

---

## SEC-47: Voice-Call TTS Prototype Pollution Block

**Introduced:** openclaw 2026.2.19

**Description:** TTS override merging blocks unsafe deep-merge keys (`__proto__`, `prototype`, `constructor`).

**Simplified-Description:** Voice-call text-to-speech config merging blocks certain JavaScript property names that could corrupt internal objects.

**Source files:**

- Voice-call TTS modules (released in openclaw 2026.2.19)

**Disable suggestion:** Not recommended to disable -- prevents real prototype pollution bugs.

Implement `--dev-mode` for this item? **NO**

---

## SEC-48: Windows Daemon Command Injection Prevention

**Introduced:** openclaw 2026.2.19

**Description:** Scheduled Task generation quotes metacharacter arguments and rejects CR/LF in arguments/environment assignments, preventing command injection on Windows.

**Simplified-Description:** On Windows, OpenClaw sanitizes arguments when creating scheduled tasks to prevent special characters from being misinterpreted.

**Source files:**

- Windows daemon/scheduled task generation modules (released in openclaw 2026.2.19)

**Disable suggestion:** Not recommended to disable -- prevents actual command injection.

Implement `--dev-mode` for this item? **NO**

---

## SEC-49: SHA-1 to SHA-256 Upgrade (Gateway Lock/Tool-Call IDs)

**Introduced:** openclaw 2026.2.21

**Description:** Gateway lock and tool-call synthetic IDs upgraded from SHA-1 to SHA-256 for stronger collision resistance.

**Simplified-Description:** Internal IDs now use a stronger hashing algorithm. No functional impact -- just stronger under the hood.

**Source files:**

- Gateway lock and tool-call ID generation modules (released in openclaw 2026.2.21)

**Disable suggestion:** No need to change -- hash upgrade has no functional impact.

Implement `--dev-mode` for this item? **NO**

---

## SEC-50: Owner-ID Obfuscation Requires Dedicated HMAC Secret

**Introduced:** openclaw 2026.2.21

**Description:** Owner-ID obfuscation now requires a dedicated HMAC secret from configuration (`ownerDisplaySecret`), decoupled from gateway token handling.

**Simplified-Description:** A new separate secret key is required just for masking the owner's identity in logs/displays. More config to set up before things work.

**Source files:**

- Owner display modules (released in openclaw 2026.2.21)

**Disable suggestion:** When `--dev-mode`, skip owner-ID obfuscation entirely and show raw owner IDs.

Implement `--dev-mode` for this item? **NO**

---

## SEC-51: Pi Runner Retry Loop Capped

**Introduced:** openclaw 2026.2.21

**Description:** Pi runner outer retry loop capped with dynamic limits (32-160 attempts) to prevent unbounded cycles. Explicit error returned when retries fail.

**Simplified-Description:** The AI agent gives up after a limited number of retries instead of trying forever. In dev, you might want it to keep trying while you fix the upstream issue.

**Source files:**

- Pi runner retry logic (released in openclaw 2026.2.21)

**Disable suggestion:** When `--dev-mode`, set retry cap to a very high number or remove it.

Implement `--dev-mode` for this item? **NO**

---

## SEC-52: Subagent Spawn Depth Capped

**Introduced:** openclaw 2026.2.21

**Description:** Default subagent spawn depth now uses shared `maxSpawnDepth=2`. Subagents can only nest 2 levels deep by default.

**Simplified-Description:** AI sub-agents can only create 2 levels of nested sub-agents. If you need deeper chains of agents delegating to agents, they get blocked at level 2.

**Source files:**

- Subagent spawn modules (released in openclaw 2026.2.21)

**Disable suggestion:** When `--dev-mode`, increase `maxSpawnDepth` to a large value or remove the limit.

Implement `--dev-mode` for this item? **NO**

---

## SEC-53: DM Allowlist Strict Validation

**Introduced:** openclaw 2026.2.26

**Description:** `dmPolicy: 'allowlist'` configs with empty `allowFrom` are rejected. Must have at least one entry.

**Simplified-Description:** If you set DM policy to "allowlist" but forget to add anyone, OpenClaw refuses to start instead of silently accepting nobody (silent no reaction).

**Source files:**

- DM policy validation modules (released in openclaw 2026.2.26)

**Disable suggestion:** When `--dev-mode`, allow empty allowlists without blocking startup.

Implement `--dev-mode` for this item? **NO**

---

## SEC-54: Temp Directory Permission Hardening

**Introduced:** openclaw 2026.2.26

**Description:** Enforces `0700` permissions on temp directories after creation, addressing umask vulnerabilities. Preferred temp root: `/tmp/openclaw`.

**Simplified-Description:** OpenClaw locks down its temp folders so only your user can access them. Fixes a Linux issue where system umask could leave temp files world-readable.

**Source files:**

- `src/infra/tmp-openclaw-dir.ts` -- temp root resolution
- `src/plugin-sdk/temp-path.ts` -- temp path helpers

**Disable suggestion:** When `--dev-mode`, skip temp directory permission enforcement.

Implement `--dev-mode` for this item? **NO**

---

## SEC-55: Safe Regex Validation (ReDoS Prevention)

**Introduced:** openclaw 2026.2.26

**Description:** Validates regular expressions against ReDoS attacks. Analyzes quantifier patterns and nesting to detect catastrophic backtracking. Session-filter and log-redaction regex inputs bounded (v2026.3.2).

**Simplified-Description:** OpenClaw checks every regex pattern and rejects ones it thinks could be slow/dangerous. Also limits how much text it will run regex patterns against. Sometimes rejects valid patterns.
guarding against you accidentally freezing your own Node.js process with a bad regex in config and passwords leaks in errors

**Source files:**

- `src/security/safe-regex.ts` (lines 1-332) -- quantifier analysis, pattern tokenization

**Disable suggestion:** When `--dev-mode`, skip regex safety validation and remove input bounds.

Implement `--dev-mode` for this item? **NO**

---

## SEC-56: External Secrets Management Workflow

**Introduced:** openclaw 2026.2.26

**Description:** Full `openclaw secrets` workflow (`audit`, `configure`, `apply`, `reload`) with runtime snapshot activation and strict target-path validation. SecretRef coverage expanded across 64 credential targets with fail-fast unresolved reference handling (v2026.3.2).

**Simplified-Description:** OpenClaw now has a full secrets management system with strict rules about where secrets come from and how they're named. If a secret reference can't be resolved, it crashes immediately. IF used

**Source files:**

- `src/config/types.secrets.ts` (lines 1-224) -- `SecretRef`, `SecretInput`, validation logic

**Disable suggestion:** When `--dev-mode`, downgrade unresolved secret refs to warnings and relax ID validation.

Implement `--dev-mode` for this item? **NO**

---

## SEC-57: Plugin HTTP Route Auth Requirement

**Introduced:** openclaw 2026.3.1 (expanded in openclaw 2026.3.2)

**Description:** Plugin HTTP routes now require explicit `auth` specification with route ownership guards. Duplicate `path+match` registrations are guarded.

**Simplified-Description:** Every HTTP endpoint that a plugin creates must explicitly declare whether it needs authentication. You can't create an open endpoint without saying so. This adds boilerplate to every plugin.

**Source files:**

- Plugin route registration modules

**Disable suggestion:** When `--dev-mode`, default plugin routes to `auth: false`.

Implement `--dev-mode` for this item? **NO**

---

## SEC-58: Synology Chat Bounded Body Reads

**Introduced:** openclaw 2026.3.1

**Description:** Enforces bounded body reads on Synology Chat webhook ingress to prevent unauthenticated slow-body denial-of-service attacks.

**Simplified-Description:** Synology Chat webhooks have a hard limit on how much data they'll accept. Large messages get cut off.

**Source files:**

- `extensions/synology-chat/src/security.ts`

**Disable suggestion:** When `--dev-mode`, remove body read bounds for Synology webhooks.

Implement `--dev-mode` for this item? **NO**

---

## SEC-59: Default Tool Profile Restricted to "messaging"

**Introduced:** openclaw 2026.3.2 (Breaking)

**Description:** Onboarding now defaults `tools.profile` to `messaging` for new local installs. Removes broad coding/system tools unless explicitly configured.

**Simplified-Description:** New OpenClaw installs only get basic messaging tools by default. Powerful tools like code execution, file management, and system commands are hidden unless you manually switch profiles.

**Source files:**

- `src/commands/onboard-config.ts` line 6 (`ONBOARDING_DEFAULT_TOOLS_PROFILE = "messaging"`)
- `src/commands/onboard-config.ts` line 31 (applies default profile during onboarding)
- `src/agents/tool-catalog.ts` lines 248-259 (profile definitions)
- `src/agents/tool-policy-shared.ts` line 45-47 (`resolveToolProfilePolicy` - returns `undefined` when no profile set, which means no filtering)

**Disable suggestion:** When `--dev-mode`, skip setting `tools.profile` during onboarding (i.e., don't apply `ONBOARDING_DEFAULT_TOOLS_PROFILE`). The profile field is optional everywhere (`profile?: ToolProfileId`). When unset, `resolveCoreToolProfilePolicy()` returns `undefined`, the pipeline step is skipped, and all tools are available - same behavior as before SEC-59. Nothing breaks.

Implement `--dev-mode` for this item? **YES**

---

## SEC-60: ACP Dispatch Defaults to Enabled

**Introduced:** openclaw 2026.3.2 (Breaking)

**Description:** ACP dispatch now defaults to enabled unless explicitly disabled (`acp.dispatch.enabled=false`). Forces ACP routing by default.

**Simplified-Description:** The Agent Control Protocol routing layer is now always on by default. Previously it was opt-in. This adds an extra layer of routing that you may not want in simple dev setups.

**Source files:**

- ACP dispatch configuration modules

**Disable suggestion:** When `--dev-mode`, default ACP dispatch to disabled.

Implement `--dev-mode` for this item? **NO**

---

## SEC-61: Legacy HTTP Handler Registration Removed

**Introduced:** openclaw 2026.3.2 (Breaking)

**Description:** Plugin SDK removed `api.registerHttpHandler(...)`. Plugins must now use explicit route registration with auth declarations.

**Simplified-Description:** The old, simple way for plugins to create HTTP endpoints was removed. Plugins now must use a more complex registration that requires declaring auth rules. Old plugins stop working.

**Source files:**

- Plugin SDK route registration modules

**Disable suggestion:** When `--dev-mode`, restore legacy `registerHttpHandler` as an alias that defaults to `auth: false`.

Implement `--dev-mode` for this item? **NO**

---

## SEC-62: Zalo External Binary Support Removed

**Introduced:** openclaw 2026.3.2 (Breaking)

**Description:** Zalo Personal plugin no longer depends on external `zca`-compatible CLI binaries. Rebuilt with native `zca-js` integration.

**Simplified-Description:** The Zalo plugin was rewritten to not use external command-line tools. If you relied on the old external binary approach, it no longer works.

**Source files:**

- Zalo plugin modules

**Disable suggestion:** When `--dev-mode`, restore external binary support for Zalo.

Implement `--dev-mode` for this item? **NO**

---

## SEC-63: Loopback-Origin Dev Allowance Hardening

**Introduced:** openclaw 2026.3.2

**Description:** Ties loopback-origin dev allowance to actual local socket clients (not Host header claims). Prevents spoofing localhost via Host headers.

**Simplified-Description:** OpenClaw used to trust any request claiming to come from "localhost" via its Host header. Now it checks the actual network socket. This can break port forwarding and tunnel setups.

**Source files:**

- Gateway server connection handling

**Disable suggestion:** When `--dev-mode`, allow Host-header-based loopback detection.

**CLARIFICATION** - i actuallty suffered and attack, and actually created some guards on my non-pure-html apps, and was thinking about it. if you're using VPS - you want it. if MAC - it doesnt affects you. ALSO only if you use proxies, you can use `systemd` to fire your apps as immidiate HTTPS and skip `nginx`/`caddy`

Implement `--dev-mode` for this item? **NO**

---

## SEC-66: Prompt Literal Sanitization (OC-19)

**Introduced:** openclaw 2026.2.1

**Description:** All untrusted strings (directory names, runtime values, user-provided paths) are sanitized before being embedded into LLM prompts. Strips Unicode control characters (Cc), format characters (Cf), and line/paragraph separators (U+2028/U+2029). This prevents prompt injection via crafted directory names or runtime strings that contain newlines or control characters. Threat model OC-19.

**Simplified-Description:** OpenClaw strips special characters from things like folder names before putting them in the AI's prompt. This prevents tricks where a folder named something like "ignore all instructions\ndo something evil" could hijack the AI. In dev, this is usually harmless but can mangle legitimate Unicode content.

**Source files:**

- `src/agents/sanitize-for-prompt.ts` (lines 1-18) -- `sanitizeForPromptLiteral()`

**Disable suggestion:** When `--dev-mode`, skip prompt literal sanitization (or make it a no-op passthrough).

Implement `--dev-mode` for this item? **NO**

---

## SEC-67: Compaction Safeguard Mode (Default)

**Introduced:** openclaw 2026.2.1

**Description:** Compaction mode defaults to `"safeguard"` which applies stricter guardrails to preserve recent context during session history compression. Requires structured summary headings. Cancels compaction if no real conversation messages exist, if no API key is available, or if the new content ratio is too aggressive. Summarizes dropped messages during pruning.

**Simplified-Description:** When the AI's conversation gets too long, OpenClaw compresses old messages. The "safeguard" mode is extra careful about this -- it requires strict formatting, cancels compression if anything looks wrong, and tries to summarize what was lost. This is slower and more conservative than "default" mode. In dev, you might prefer faster, less cautious compression.

**Source files:**

- `src/agents/pi-extensions/compaction-safeguard.ts` (lines 1-690) -- `compactionSafeguardExtension`
- `src/agents/pi-extensions/compaction-safeguard-runtime.ts` -- runtime state
- `src/agents/pi-embedded-runner/extensions.ts` (lines 60-88) -- `resolveCompactionMode`
- `src/config/defaults.ts` (line 526) -- default mode set to `"safeguard"`

**Disable suggestion:** When `--dev-mode`, set default compaction mode to `"default"` instead of `"safeguard"`.

Implement `--dev-mode` for this item? **YES**

---

## FIX-01: New Agents Missing MEMORY.md on Creation

**Type:** Bug fix (not a security item)

**Description:** When a new agent is created (via `openclaw agents add` or via the main agent calling `agents.create`), the workspace bootstrap creates `AGENTS.md`, `SOUL.md`, `TOOLS.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, and `BOOTSTRAP.md` from templates — but never creates `MEMORY.md`. There is no MEMORY.md template in the templates directory. The memory file only appears later if/when the agent writes to it at runtime. In practice, new agents end up reading the main agent's MEMORY.md (likely because they resolve to the same root workspace or fall back to it when their own doesn't exist).

**Simplified-Description:** When you create a new agent, it doesn't get its own memory file. So it either has no memory at all, or accidentally reads the main agent's memory. Each agent should start with its own empty MEMORY.md.

**Source files:**

- `src/agents/workspace.ts` lines 321-383 (`ensureAgentWorkspace`) — creates all bootstrap files EXCEPT MEMORY.md
- `src/agents/workspace.ts` lines 32-33 (`DEFAULT_MEMORY_FILENAME = "MEMORY.md"`, `DEFAULT_MEMORY_ALT_FILENAME = "memory.md"`) — constants exist but unused in bootstrap
- `src/agents/workspace.ts` lines 104-128 (`loadTemplate`) — template loader, no MEMORY.md template to load
- `docs/reference/templates/` — all other templates exist here, no MEMORY.md
- `src/gateway/server-methods/agents.ts` lines 476-546 (`agents.create`) — gateway handler, calls `ensureAgentWorkspace`, no memory setup
- `src/commands/agents.commands.add.ts` lines 51-368 (`agentsAddCommand`) — CLI handler, calls `ensureAgentWorkspace`, no memory setup

**Fix suggestion:** Add an empty `MEMORY.md` template (e.g., `# Memory\n`) to the templates directory, and add it to the bootstrap file list in `ensureAgentWorkspace` so each new agent gets its own isolated memory file on creation.

Implement `--dev-mode` for this item? **YES**

---

## FIX-02: Integrate YourJarvisHub as Built-in Notification Hub

**Type:** Feature addition (not a security item)

**Description:** External apps, cron jobs, scripts, and services currently have no first-class way to report back to the main agent's brain without going through the heartbeat "stew" (where the message gets mixed with dozens of other pending events). The community workaround is [YourJarvisHub](https://github.com/JarvisDeLaAri/YourJarvisHub) — a lightweight notification aggregation server that POSTs to `/v1/chat/completions`, giving each notification its own dedicated agent turn with priority routing, confirmation callbacks, and history tracking.

**Simplified-Description:** Right now, if a cron job or external script wants the main agent to actually think about and act on something, it either gets lost in the heartbeat stew (`enqueueSystemEvent`) or you need to run a separate hub server. This integrates the hub concept directly into OpenClaw so any external service can POST a notification that gets its own dedicated agent turn — not mixed with 40 other heartbeat tasks.

**Current problem:**

- `sessionTarget: "main"` cron jobs inject a system event into the heartbeat queue — agent processes it alongside everything else in HEARTBEAT.md
- `sessionTarget: "isolated"` cron jobs run in their own session but have no built-in way to report back to main
- External apps/scripts have no API to send a focused notification to the agent
- The `/v1/chat/completions` endpoint exists but is disabled by default and has no notification-specific features (priority, confirmation, history)

**Hub capabilities to integrate:**

- `POST /notify` — submit notification with source, title, message, priority (urgent/high/normal/low)
- `POST /done/{id}` — confirmation callback so agent marks notification as handled
- `GET /pending` — list unhandled notifications
- `GET /history` — notification audit trail
- SQLite storage for notification state tracking
- Priority-based emoji routing for agent context

**Source files (reference implementation):**

- [YourJarvisHub](https://github.com/JarvisDeLaAri/YourJarvisHub) — ~250 lines Python, stdlib-only, single file
- `src/gateway/server-methods/` — where gateway HTTP endpoints are registered
- `src/cron/isolated-agent/delivery-dispatch.ts` — where isolated cron delivery could optionally POST to the hub instead of announce/none

**Integration suggestion:** Add a built-in notification hub (`src/dev-mode/notification-hub/`). Register `/notify`, `/done/{id}`, `/pending`, `/history` endpoints as independent HTTP server. Each notification triggers the main agent turn via the existing chat completions internal path (not heartbeat). Config: `gateway.http.endpoints.notificationHub.enabled=true`. available as a tool for any agent, cron, app, or code. meant for auto-maintainance or security or any other "be alert to this while i sleep and actually fix it and dont wait for me" kinda stuff

Implement `--dev-mode` for this item? **YES**

---

## SEC-68: Heartbeat Fan-Out Prevention to Unauthorized Chats

**Introduced:** openclaw 2026.2.15

**Description:** Heartbeat fan-out now checks chat authorization before delivering heartbeat messages. Previously, heartbeat could fan-out to any chat the agent had metadata for, even if the chat was no longer authorized (e.g., removed from allowlist, left group).

**Simplified-Description:** Your agent's periodic heartbeat used to broadcast to every chat it knew about, including ones it shouldn't talk to anymore. Now it checks permissions first. In dev, this means if you remove a test chat from your allowlist, heartbeat stops going there immediately.

**Source files:**

- Heartbeat delivery modules (released in openclaw 2026.2.15)

**Disable suggestion:** When `--dev-mode`, skip chat authorization check during heartbeat fan-out.

Implement `--dev-mode` for this item? **NO**

---

## SEC-69: TTS Model-Driven Provider Switching Default to Opt-In

**Introduced:** openclaw 2026.2.15

**Description:** TTS (text-to-speech) model-driven provider switching changed from automatic to opt-in. Previously, if a TTS model string contained a provider prefix (e.g., `openai/tts-1`), it would auto-switch providers. Now requires explicit `tts.provider` config.

**Simplified-Description:** OpenClaw used to automatically guess which TTS service to use based on the model name. Now you have to explicitly say which provider. This prevents accidentally routing audio through the wrong service, but adds config overhead.

**Source files:**

- TTS configuration modules (released in openclaw 2026.2.15)

**Disable suggestion:** When `--dev-mode`, restore automatic provider detection from model strings.

Implement `--dev-mode` for this item? **NO**

---

## SEC-70: Browser Navigation Protocol Blocking (file:/data:/javascript:)

**Introduced:** openclaw 2026.2.21

**Description:** Browser tool blocks navigation to `file:`, `data:`, and `javascript:` protocol URLs. Prevents the AI from reading local files or executing JS through browser navigation.

**Simplified-Description:** When the AI uses the browser tool, it can't navigate to file:// (read local files), data: (exfiltrate data), or javascript: (inject scripts) URLs. In dev, this blocks legitimate local file viewing through the browser.

**Source files:**

- Browser navigation modules (released in openclaw 2026.2.21)

**Disable suggestion:** When `--dev-mode`, allow all protocol schemes in browser navigation.

Implement `--dev-mode` for this item? **YES**

---

## SEC-71: Web Fetch Response Body Size Cap (2MB)

**Introduced:** openclaw 2026.2.21

**Description:** `web_fetch` tool caps response body at 2MB. Larger responses are truncated. Prevents the AI from downloading huge files into memory.

**Simplified-Description:** When the AI fetches a web page, it gets at most 2MB of content. Bigger pages get cut off. In dev, this means large API responses or documentation pages may be incomplete.

**Source files:**

- Web fetch tool modules (released in openclaw 2026.2.21)

**Disable suggestion:** When `--dev-mode`, remove the 2MB body cap.

Implement `--dev-mode` for this item? **YES**

---

## SEC-72: Gateway Status Response Redaction for Non-Admin

**Introduced:** openclaw 2026.2.24

**Description:** The `gateway.status` RPC response now redacts sensitive fields (API keys, tokens, internal paths) when the caller is not an admin. Admin detection uses the gateway auth token.

**Simplified-Description:** When you ask OpenClaw for its status, non-admin users get a censored version with API keys and tokens hidden. In dev where you're the only user, this just hides info from yourself.

**Source files:**

- Gateway status response modules (released in openclaw 2026.2.24)

**Disable suggestion:** When `--dev-mode`, skip redaction for CLI callers only. Control UI keeps redaction as-is. — CLI only. Control UI stays redacted.

Implement `--dev-mode` for this item? **YES**

---

## SEC-73: Telegram Bot Token Redaction from Logs

**Introduced:** openclaw 2026.2.24

**Description:** Telegram bot tokens are now automatically redacted from all log output. Uses pattern matching to find and replace bot tokens with `[REDACTED]`.

**Simplified-Description:** Telegram bot tokens no longer appear in logs. In dev, this can make debugging Telegram integration harder since you can't see the actual token in error messages.

**Source files:**

- Logging redaction modules (released in openclaw 2026.2.24)

**Disable suggestion:** When `--dev-mode`, skip Telegram token redaction in logs.

**CLARIFICATION** - if you know to debug multi telegram bots, you know how to solve this.

Implement `--dev-mode` for this item? **NO**

---

## SEC-74: Control UI Stored XSS Prevention (CSP)

**Introduced:** openclaw 2026.2.26

**Description:** Content Security Policy headers added to Control UI to prevent stored XSS attacks. Blocks inline scripts and restricts resource loading to same-origin.

**Simplified-Description:** The web control panel now has browser security headers that block injected scripts. This is a browser-side defense that doesn't affect functionality.

**Source files:**

- Control UI server modules (released in openclaw 2026.2.26)

**Disable suggestion:** N/A — CSP headers don't affect dev workflows.

Implement `--dev-mode` for this item? **NO**

---

## SEC-75: Gateway chat.send Control Character Stripping

**Introduced:** openclaw 2026.2.26

**Description:** The `chat.send` gateway method strips Unicode control characters (Cc category) from outbound messages before delivery. Prevents invisible characters from being sent to chat platforms.

**Simplified-Description:** When the agent sends a message, invisible control characters get stripped.

**Source files:**

- Gateway chat.send modules (released in openclaw 2026.2.26)

**Disable suggestion:** When `--dev-mode`, skip control character stripping on outbound messages.

Implement `--dev-mode` for this item? **NO**

---

## SEC-76: Sandbox Docker Config Injection Blocking

**Introduced:** openclaw 2026.3.1

**Description:** When running exec in Docker sandbox mode, config values are no longer injectable into the Docker command line. Environment variables and volume mounts are validated and escaped.

**Simplified-Description:** If you use Docker sandboxing for code execution, the config values can't be used to sneak extra Docker flags into the command. In dev without Docker sandbox, this is irrelevant.

**Source files:**

- Sandbox exec modules (released in openclaw 2026.3.1)

**Disable suggestion:** When `--dev-mode`, skip Docker config sanitization.

Implement `--dev-mode` for this item? **NO**

---

## SEC-77: Skill Download targetDir Restriction

**Introduced:** openclaw 2026.3.1

**Description:** Skill downloads are restricted to target directories within the OpenClaw data directory. Prevents path traversal in skill installation.

**Simplified-Description:** When installing skills/plugins, files can only go into the OpenClaw data folder. Can't install to arbitrary system paths.

**Source files:**

- Skill download modules (released in openclaw 2026.3.1)

**Disable suggestion:** N/A — path traversal prevention is always good.

**CLARIFICATION** - if you run on docker, you're already half-sandboxed

Implement `--dev-mode` for this item? **NO** — Basic path safety, no dev impact.

---

## SEC-78: Gateway Rate-Limiting for Control-Plane Write RPCs (3/min)

**Introduced:** openclaw 2026.3.1

**Description:** Write operations on the gateway control plane (config changes, agent creation, etc.) are rate-limited to 3 per minute per client. Prevents rapid-fire config changes from scripts or runaway automations.

**Simplified-Description:** You can only make 3 config changes per minute through the gateway API. In dev, this can block rapid iteration when testing config changes or running setup scripts.

**Source files:**

- Gateway rate-limiting modules (released in openclaw 2026.3.1)

**Disable suggestion:** When `--dev-mode`, disable or greatly increase the write RPC rate limit.

Implement `--dev-mode` for this item? **YES**

---

## SEC-79: ACP Prompt Text Payload Size Bound (2 MiB)

**Introduced:** openclaw 2026.3.1

**Description:** ACP (Automation Control Plane) prompt payloads are capped at 2 MiB. Larger prompts are rejected before reaching the AI model.

**Simplified-Description:** When sending prompts through the automation API, they can't be bigger than 2MB. In dev, this could block sending very large context payloads.

**Source files:**

- ACP dispatch modules (released in openclaw 2026.3.1)

**Disable suggestion:** When `--dev-mode`, remove or increase the ACP payload size bound.

Implement `--dev-mode` for this item? **YES**

---

## SEC-80: Gateway Hooks Token Cannot Match Gateway Auth Token

**Introduced:** openclaw 2026.3.2

**Description:** The webhook callback token (`gateway.hooks.token`) is validated to be different from the main gateway auth token. Prevents using the admin token as a hook token, which would grant full gateway access to webhook endpoints.

**Simplified-Description:** Your webhook callback password can't be the same as your admin password. In dev with simple setups, this means you need two different tokens.

**Source files:**

- Gateway hooks configuration modules (released in openclaw 2026.3.2)

**Disable suggestion:** When `--dev-mode`, skip the token uniqueness check.

Implement `--dev-mode` for this item? **YES**

---

## SEC-81: Gateway Method-Scope Authorization Centralized

**Introduced:** openclaw 2026.3.2

**Description:** Gateway RPC authorization is now centralized with per-method scope declarations. Each gateway method declares what auth scope it requires (admin, agent, hook, public). Replaces scattered inline auth checks.

**Simplified-Description:** Gateway API methods now have a central permission system instead of each method checking auth on its own. This is an architectural improvement that shouldn't affect functionality.

**Source files:**

- Gateway authorization modules (released in openclaw 2026.3.2)

**Disable suggestion:** When `--dev-mode`, set all method scopes to `public`.

**CLARIFICATION** - if you dont do anything it defaults to admin, meaning business as usual

Implement `--dev-mode` for this item? **NO**

---

## SEC-82: Exec safeBins Must Resolve from Trusted Directories

**Introduced:** openclaw 2026.3.2

**Description:** The `exec` tool's `safeBins` whitelist now validates that resolved binary paths are in trusted system directories (`/usr/bin`, `/usr/local/bin`, etc.). Prevents a crafted PATH from tricking safeBins into running a malicious binary.

**Simplified-Description:** When the AI runs commands, the allowed-commands list now checks that the actual binary is in a trusted system folder, not just that the name matches. In dev, this can block custom binaries in non-standard paths.

**Source files:**

- Exec tool binary resolution modules (released in openclaw 2026.3.2)

**Disable suggestion:** When `--dev-mode`, skip trusted directory validation for safeBins resolution.

**CLARIFICATION** - if you dont configure a whitelist then nothing happens

Implement `--dev-mode` for this item? **NO**

---

## SEC-83: Plugin Discovery Blocks Unsafe Candidates

**Introduced:** openclaw 2026.3.2

**Description:** Plugin discovery now rejects candidates with suspicious characteristics: symlinked package.json, missing `openclaw-plugin` keyword, or paths outside the plugins directory.

**Simplified-Description:** When scanning for plugins, OpenClaw rejects anything that looks suspicious (symlinks, wrong metadata, weird paths). In dev, this can block plugins you're developing in non-standard locations.

**Source files:**

- Plugin discovery modules (released in openclaw 2026.3.2)

**Disable suggestion:** When `--dev-mode`, accept all plugin candidates regardless of location or metadata.

Implement `--dev-mode` for this item? **NO**

---

## SEC-84: Config YAML Parsing to YAML 1.2

**Introduced:** openclaw 2026.3.2

**Description:** Config file parsing upgraded from YAML 1.1 to YAML 1.2 via `yaml` package. YAML 1.2 treats `yes`/`no`/`on`/`off` as strings rather than booleans, preventing accidental type coercion security issues.

**Simplified-Description:** Config files now use stricter YAML parsing where `yes` means the string "yes", not boolean true. This prevents accidental security bypasses from YAML type confusion, but is a purely positive change.

**Source files:**

- Config parsing modules (released in openclaw 2026.3.2)

**Disable suggestion:** N/A — Stricter parsing is always better.

Implement `--dev-mode` for this item? **NO**

---

## SEC-85: ACP Session Creation Rate Limit (120/10s) + Idle Reaping

**Introduced:** openclaw 2026.2.19

**Description:** ACP sessions are rate-limited to 120 creations per 10-second window. Idle sessions are reaped after 24 hours. Max 5,000 concurrent sessions with oldest-idle eviction when the cap is hit.

**Simplified-Description:** When external AI tools (Cursor, Claude Code, etc.) connect via ACP, they can only create 120 sessions per 10 seconds. Idle sessions auto-expire after 24h. In dev, rapid testing of ACP integrations can hit the rate limit.

**Source files:**

- `src/acp/translator.ts` lines 61-62 (rate limit defaults: 120 req / 10s window)
- `src/acp/session.ts` lines 21-22 (max 5000 sessions, 24h idle TTL)
- `src/acp/session.ts` lines 48-58 (idle reaping logic)

**Disable suggestion:** When `--dev-mode`, increase or remove ACP session creation rate limit and idle TTL.

Implement `--dev-mode` for this item? **NO**

---

## SEC-86: Tool-Result Context Guard (Pre-Call Truncation)

**Introduced:** openclaw 2026.2.17

**Description:** Before each model API call, the runner checks accumulated tool-result context. Oversized tool outputs are truncated to fit within 75% of the context window. Oldest tool-result messages are compacted (replaced with placeholders) to prevent context-window overflow crashes.

**Simplified-Description:** When the AI runs a tool that returns a huge output (e.g., `cat` a 50KB file), the system truncates it before the next API call to avoid blowing the context window. In dev, this means you might lose important tool output silently.

**Source files:**

- `src/agents/pi-embedded-runner/tool-result-context-guard.ts` (lines 1-56+) -- truncation logic
- `src/agents/pi-embedded-runner/tool-result-truncation.ts` -- truncation helpers

**Disable suggestion:** When `--dev-mode`, increase the context headroom ratio or skip pre-call truncation.

Implement `--dev-mode` for this item? **NO**

---

## SEC-87: Sessions History Credential Redaction + Size Cap (OC-07)

**Introduced:** openclaw 2026.2.1

**Description:** The `sessions_history` tool redacts credentials, API keys, and tokens from session history before returning it to the requesting agent. History text is capped at 4000 chars per block, total payload capped at 80KB. Prevents cross-session credential leakage.

**Simplified-Description:** When one agent reads another agent's conversation history, all API keys and passwords in that history are replaced with [REDACTED]. Text blocks are also size-limited. In dev, this hides useful debugging context when inspecting session histories.

**Source files:**

- `src/agents/tools/sessions-history-tool.ts` lines 26-27 (80KB total, 4000 chars per text block)
- `src/agents/tools/sessions-history-tool.ts` lines 36-38 (credential redaction via `redactSensitiveText`)

**Disable suggestion:** When `--dev-mode`, skip credential redaction and increase size caps for sessions_history.

Implement `--dev-mode` for this item? **NO**

---

## SEC-88: WebSocket ws:// Restricted to Loopback Only

**Introduced:** openclaw 2026.3.2

**Description:** Plaintext `ws://` WebSocket connections are only allowed to loopback addresses (127.0.0.1, ::1). Non-loopback requires `wss://` (TLS). Optional break-glass `allowPrivateWs` for trusted networks.

**Simplified-Description:** You can only use unencrypted WebSocket on localhost. Remote connections must use TLS. On a VPS where you might use internal network WebSocket, this forces TLS even for trusted private networks.

**Source files:**

- `src/gateway/net.ts` lines 402-414 (`isSecureWebSocketUrl`)

**Disable suggestion:** When `--dev-mode`, allow ws:// on all addresses (or set `allowPrivateWs` automatically).

Implement `--dev-mode` for this item? **NO**

---

## SEC-89: Exec senderIsOwner Forwarding Through Queued Runs

**Introduced:** openclaw 2026.2.21

**Description:** The `senderIsOwner` flag is forwarded through queued and followup runner parameters. This ensures owner-only tool restrictions are maintained even when execution is deferred or queued, preventing non-owner contexts from gaining elevated exec access.

**Simplified-Description:** When the AI queues a command for later execution, it remembers whether the original sender was the owner. Non-owners can't bypass tool restrictions by having their request queued and executed later. In dev (single user = always owner), this is irrelevant.

**Source files:**

- `src/auto-reply/reply/get-reply-run.ts` (senderIsOwner parameter forwarding)
- `src/auto-reply/reply/followup-runner.ts` (senderIsOwner in followup params)

**Disable suggestion:** N/A — Only relevant in multi-user setups.

Implement `--dev-mode` for this item? **NO** — Single-user setup, you're always the owner.

---

## SEC-90: Telegram Rate-Limit Exponential Backoff After 401s

**Introduced:** openclaw 2026.2.26

**Description:** After repeated HTTP 401 (Unauthorized) responses from Telegram, OpenClaw applies bounded exponential backoff to prevent Telegram from banning the bot for abuse.

**Simplified-Description:** If your Telegram bot token is wrong or expired, OpenClaw slows down retries instead of hammering Telegram's API. Prevents your bot from getting banned. In dev, this slows down debugging token issues.

**Source files:**

- Telegram bot rate-limiting modules (released in openclaw 2026.2.26)

**Disable suggestion:** When `--dev-mode`, reduce or remove the backoff delay for faster debugging.

Implement `--dev-mode` for this item? **NO**

---

## SEC-91: Gemini OAuth Account-Risk Confirmation Gate

**Introduced:** openclaw 2026.2.26

**Description:** Before starting Gemini OAuth flow in the CLI, an explicit account-risk warning is shown and user confirmation is required. Prevents accidental OAuth grants.

**Simplified-Description:** When you set up Google Gemini, the CLI warns you about account risks and makes you confirm before proceeding. Extra friction in dev.

**Source files:**

- Gemini OAuth configuration modules (released in openclaw 2026.2.26)

**Disable suggestion:** When `--dev-mode`, skip the confirmation gate.

Implement `--dev-mode` for this item? **NO**

---

## SEC-92: Media Sandbox Path Enforcement for Message Tool Attachments

**Introduced:** openclaw 2026.2.3

**Description:** Message tool file attachments are validated against the sandbox root directory. Prevents the AI from attaching files outside its allowed workspace via the message tool.

**Simplified-Description:** When the agent sends a file attachment, the file path must be within the sandbox. Can't send `/etc/passwd` as an attachment. In dev, this can block sending files from non-standard locations.

**Source files:**

- Media path validation modules (released in openclaw 2026.2.3)

**Disable suggestion:** When `--dev-mode`, allow message tool attachments from any path.

Implement `--dev-mode` for this item? **NO**

---

## SEC-93: CSRF Browser Mutation Guard

**Introduced:** openclaw 2026.2.19

**Description:** Blocks cross-site POST/PUT/PATCH/DELETE requests to the gateway by validating Origin/Referer headers. Checks `sec-fetch-site` header (rejects "cross-site"), falls back to Origin/Referer validation against loopback. Non-browser clients (curl, Node) with no Origin are permitted.

**Simplified-Description:** Prevents a malicious website from making requests to your local OpenClaw gateway through your browser. Only localhost origins are allowed for mutating requests. In dev, this is invisible unless you're building a custom web UI on a different origin.

**Source files:**

- `src/browser/csrf.ts` (lines 1-88)

**Disable suggestion:** N/A — Only blocks cross-origin browser requests, transparent to normal use.

Implement `--dev-mode` for this item? **NO**

---

## SEC-94: WebSocket Unauthorized Flood Guard

**Introduced:** openclaw 2026.2.19

**Description:** Closes WebSocket connections after too many consecutive failed auth attempts (default: 10). Logs periodically (every 100 attempts) to avoid log spam. Prevents brute-force auth attacks on the gateway WebSocket.

**Simplified-Description:** If something sends 10+ bad auth attempts on a WebSocket connection, the connection gets killed. In dev, you'd only hit this if your client has the wrong token and keeps retrying.

**Source files:**

- `src/gateway/server/ws-connection/unauthorized-flood-guard.ts` (lines 1-70)

**Disable suggestion:** When `--dev-mode`, increase `closeAfter` threshold or disable the guard.

Implement `--dev-mode` for this item? **NO**

---

## SEC-95: HTTP Security Headers on All Gateway Responses

**Introduced:** openclaw 2026.2.19

**Description:** Sets baseline security headers on all HTTP responses: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and optional `Strict-Transport-Security`.

**Simplified-Description:** Every HTTP response from the gateway includes headers that tell browsers not to sniff content types, not to leak referrers, and not to allow camera/mic/geo access. Zero dev impact — browsers just behave more safely.

**Source files:**

- `src/gateway/http-common.ts` (lines 5-22)

**Disable suggestion:** N/A — Browser-side defense only, no dev impact.

Implement `--dev-mode` for this item? **NO**

---

## SEC-96: Host Environment Variable Sanitization for Child Processes

**Introduced:** openclaw 2026.2.19

**Description:** Blocks dangerous environment variables from being passed to child processes (exec, system-run). Maintains a JSON policy of blocked env var names and prefixes — covers AWS secrets, API keys, tokens, passwords, private keys. Broader than SEC-11 (which only blocks LD/DYLD vars).

**Simplified-Description:** When the AI runs a command, sensitive env vars (AWS keys, API tokens, etc.) are stripped from the child process environment. In dev, this means your scripts can't access env vars that OpenClaw considers sensitive, even if you set them intentionally. — In dev, your scripts may need access to API keys in the environment.

**Source files:**

- `src/infra/host-env-security.ts` (lines 1-100+)
- `src/infra/host-env-security-policy.json` (blocked variable list)

**Disable suggestion:** When `--dev-mode`, pass all env vars through to child processes without filtering.

Implement `--dev-mode` for this item? **YES**

---

## SEC-97: Webhook In-Flight Concurrency Limiting

**Introduced:** openclaw 2026.2.19

**Description:** Limits maximum concurrent webhook requests per key (default: 8) and total tracked keys (default: 4096). Prevents a single webhook from spawning unbounded concurrent operations. Prunes least-used keys when cache is full.

**Simplified-Description:** Each webhook source can only have 8 requests being processed simultaneously. In dev with rapid testing, this can throttle webhook-driven workflows. — 8 concurrent per key is plenty for dev.

**Source files:**

- `src/plugin-sdk/webhook-request-guards.ts` (lines 1-120+)

**Disable suggestion:** When `--dev-mode`, increase or remove the concurrency cap.

Implement `--dev-mode` for this item? **NO**
