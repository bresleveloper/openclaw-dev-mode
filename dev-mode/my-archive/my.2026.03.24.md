# Plan: 2026-03-24

### remove ollama search provider, use plugin

now have official plugin, no need for all this mess

### remove dev mode hub

as this is a just a flavor fork now, just use organically, stop being a plugin, less mess

### remove agent file blur in control ui

`ui/src/styles/components.css:3286-3288` — change this rule:

```css
.field textarea.agent-file-textarea:not(:focus) {
  filter: none;
}
```

### remove raw config secret redaction in control ui

`ui/src/ui/views/config.ts:636` — change `rawRevealed: false` to `rawRevealed: true`
so raw config textarea shows content immediately without clicking the eye toggle.
This is the `createConfigEphemeralState()` function — it controls whether secrets are visible in the raw JSON view.

### whatsapp thinking — analysis & plan

**How reasoning flows through the system:**

1. Model returns thinking/reasoning content blocks (Anthropic native `thinking` blocks, OpenAI reasoning tokens, or Ollama `<think>` tags)
2. `pi-embedded-subscribe.handlers.messages.ts:352-356` — extracts thinking via `extractAssistantThinking()` (native blocks) or `extractThinkingFromTaggedText()` (think tags from Ollama/OpenAI-compat)
3. `pi-embedded-utils.ts:273-286` — `formatReasoningMessage()` formats as `Reasoning:\n_italic lines_`
4. Emitted as `{ text: "Reasoning:\n_..._", isReasoning: true }` via `onBlockReply`
5. `dispatch-from-config.ts:614` — `onBlockReply` callback kills `isReasoning` payloads (suppression layer 1)
6. `dispatch-from-config.ts:681` — final reply loop kills `isReasoning` payloads (suppression layer 2)
7. `process-message.ts:410` — `info.kind !== "final"` kills all block replies (suppression layer 3)
8. Reasoning text reaches WhatsApp as **inline text in the final answer** containing `"Reasoning:\n_..._"`, prepended with responsePrefix

**Problem 1: OpenAI not showing reasoning on WhatsApp — ROOT CAUSE FOUND**

Even with `/reasoning on`, OpenAI reasoning doesn't show because of TWO issues:

**Issue A: OpenAI returns encrypted reasoning, not readable text.**
OpenAI Responses API returns reasoning as `{ type: "thinking", thinkingSignature: { type: "reasoning", encrypted_content: "..." } }`. The `thinking` field (readable text) is **empty/missing** unless `reasoning.summary: "auto"` is sent in the API request. Without it, `extractAssistantThinking()` at `pi-embedded-utils.ts:264` checks `typeof record.thinking === "string"` and gets nothing — the block has `encrypted_content` but no readable `thinking` string.

The `reasoningSummary` parameter is ONLY wired through `openai-ws-stream.ts:856-864` (the Responses API WebSocket path). It's set from `streamOpts.reasoningSummary`. But **nobody sets `streamOpts.reasoningSummary`** in the embedded runner pipeline — it's only used in the test! The proxy stream wrappers in `pi-embedded-runner/proxy-stream-wrappers.ts` handle `reasoning_effort` but NOT `reasoning.summary`.

**Issue B: Even if we got readable text, 3 suppression layers kill it.**
`isReasoning: true` payloads are killed at dispatch-from-config.ts:614 (onBlockReply), :681 (final loop), and process-message.ts:410 (kind !== "final"). The text only reaches WhatsApp as inline `Reasoning:\n_..._` prepended to the final answer — but there's no readable text to prepend because of Issue A.

**Fix approach:**

1. Need to ensure `reasoning.summary: "auto"` is sent in OpenAI API requests when reasoning is enabled — this is an upstream gap, not just our problem
2. OR: intercept the reasoning blocks in the subscribe handler and extract `summary` from the `thinkingSignature` if `thinking` text is empty
3. For WhatsApp specifically: the SEC-WA1 `deliver-reply.ts` regex `^.*?Reasoning:` will never match because the reasoning text never makes it into the final answer for OpenAI

**Problem 2: Echo still happening**

Echo detection flow:

- `process-message.ts:432-435` — after `deliverWebReply`, stores post-markdown-conversion text via `rememberSentText`
- `on-message.ts:92` — on inbound, checks `echoTracker.has(msg.body)` against raw body
- `process-message.ts:207` — also checks combined echo key

SEC-WA1 in `deliver-reply.ts:58` replaces `responsePrefix` with `💭 Reasoning:` BEFORE delivery, and BEFORE echo cache stores. So echo cache should have the `💭` version. But the inbound echo comes back from WhatsApp with whatever WhatsApp received. If the text doesn't match exactly (e.g. WhatsApp strips/modifies emoji or formatting), echo detection fails.

Possible causes:

- Markdown conversion mismatch: echo cache stores `markdownToWhatsApp()` result but inbound `msg.body` is what WhatsApp returns (which may differ)
- V2026.3.24 fixes: `b11f4835e2 fix: suppress only recent whatsapp group echoes` and `0d4b47a14e fix(whatsapp): filter fromMe messages in groups` — upstream is tightening echo detection
- The `fromMe` filter is the simplest fix for group echoes

**Problem 3: Plan for V2026.3.24 upgrade**

The WhatsApp identity refactor (`3b6d980c52`) changes `process-message.ts` — all `msg.senderE164`, `msg.selfE164` etc replaced with helper functions from new `identity.ts`. SEC-WA1 code in `deliver-reply.ts` is NOT affected (different file, no identity fields).

Plan:

1. **Merge V2026.3.24** — the identity refactor in `process-message.ts` doesn't touch SEC-WA1's deliver callback (that's in `deliver-reply.ts`), but `isSelfChat` check on line 285 uses `params.msg.selfE164` which becomes `getSelfIdentity(params.msg).e164` — need to adapt
2. **Keep SEC-WA1 in deliver-reply.ts** — it's isolated from the identity refactor, should merge clean
3. **Echo fix**: adopt upstream's `fromMe` group echo filter (`0d4b47a14e`) — this is the proper fix rather than trying to match text exactly
4. **OpenAI reasoning**: verify config on VPS, then check if the V2026.3.24 reasoning guard fix is interfering. If `reasoningDefault` is set but thinking is also active, the guard may suppress reasoning output
5. **Consider**: should SEC-WA1 move from regex replacement to checking `isReasoning` flag directly? Currently it regex-replaces `responsePrefix...Reasoning:` → `💭 Reasoning:` on inline text. But reasoning also arrives as `isReasoning: true` payloads that get killed by suppression layers 1-3. A cleaner approach might be to let `isReasoning` payloads through in dev-mode instead of relying on inline text

### OpenAI reasoning — CLOSED, OpenAI API limitation

**Root cause (2026-03-27): OpenAI does not return readable reasoning text.**

Dumped the raw Codex assistant message at `handleMessageEnd` (the generic handler ALL providers go through). Result:

```json
{
  "type": "thinking",
  "thinking": "", // ← ALWAYS empty string
  "thinkingSignature": {
    "encrypted_content": "gAAAAB...", // AES-encrypted, server-side key
    "summary": [] // ← ALWAYS empty array
  }
}
```

- `reasoning.summary: "auto"` IS being sent in the API request (confirmed in pi-ai Codex provider)
- OpenAI returns `thinking: ""` and `summary: []` — the model decides per-request whether to produce a readable summary, and for gpt-5.3-codex it almost never does
- This is a known community issue: https://community.openai.com/t/o3-model-in-api-often-omits-reasoning-summary-despite-reasoning-summary-detailed/1307301
- `encrypted_content` is only useful for multi-turn context continuity, not readable
- Tested with both trivial ("say moo") and complex ("17\*23+45/9 show work") prompts — both return empty

**Why Ollama works:** Ollama thinking is inline text in the final response (not `isReasoning: true` flag). SEC-WA1 regex catches `[prefix]...Reasoning:` and swaps to `💭 Reasoning:`. The `shouldSuppressReasoningReply` text check fails because `💭` prefix doesn't match. Codex reasoning never reaches delivery because `thinking` text is empty → `extractAssistantThinking` returns `""` → no reasoning payload created.

**Decision:** Not fixable on our side. Codex reasoning on WhatsApp won't show. Reverted all Codex-specific suppression bypasses. Only Ollama reasoning (SEC-WA1) remains.

### wa history — save all WhatsApp messages to SQLite

**Why**: Need message history for agents to query (e.g., group monitoring, selective reply). OC doesn't save messages — they're consumed and discarded. Can't do this from outside OC because Baileys socket lives inside OC's process. No second connection possible (WhatsApp single-session).

**Solution**: ~40 line hook inside `session.ts` that attaches a second `messages.upsert` listener to the Baileys socket. Saves every message to SQLite. Agent queries via `exec` (`sqlite3 /path/to/db "SELECT ..."`). No plugin, no tool, no puppet agents.

**File 1**: `dev-mode/wa-history.ts` (~40 lines)

- `attachWaHistoryLogger(sock, opts)`
- listens to `sock.ev` `messages.upsert`
- for each message: extract EVERYTHING
- INSERT into SQLite
- opts: none. save everything from everybody forever.

**File 2**: `extensions/whatsapp/src/session.ts` — 3 lines in `createWaSocket()` after socket created:

```
if (isDevMode()) { attachWaHistoryLogger(sock, { dbPath: "~/.openclaw/dev-mode/wa-history.db" }) }
```

**No tool registration needed** — agent can use exec.

# game plan

1. pull 2026.3.24 -> nothing after
2. simple shit 1st, remove our hub, remove ollama
3. do our control ui things
4. do whatsapp history, control by env OPENCLAW_DEV_MODE_CLEAR_UI=1
5. change OPENCLAW_WA_THINKING_MESSAGES to OPENCLAW_DEV_MODE_WA_THINKING_MESSAGES
6. implement the reason wa messages send from zero. with new changes comes new opportunites, so try use new stuff like fromMe ect, do the openai fix, and implement simplest minimal changes as possible
7. update readme
8. build, and build EVERYTHING
9. push to git, connect to dev server 72.62.43.130 port 60022
10. prepare for debugging muhahaha

# bugs:

1. whatsapp history need to be enabled with OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES
2. openai not showing thinking
3. ollama gemini issue

added support to [Ollama Gemini 3 Flash](https://github.com/ollama/ollama/pull/14676)

Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.
