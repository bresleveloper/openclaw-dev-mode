# The WhatsApp Reasoning Echo Saga

**Feature**: SEC-WA1 — Show AI reasoning/thinking on WhatsApp with a 💭 prefix
**Timeline**: 2026-03-23 21:21 → 2026-03-24 06:37 (9 hours, 8 commits, 3 root causes)
**Status**: Resolved

---

## Goal

OpenClaw suppresses reasoning/thinking payloads on messaging channels — they're meant for the web UI only. SEC-WA1 is a dev-mode feature that unsuppresses them on WhatsApp, replacing the bot's `responsePrefix` (e.g. `[openclaw] 🦞`) with `💭` so reasoning is visually distinct from the actual answer.

Controlled by two env vars in `~/.openclaw/.env`:

```
OPENCLAW_DEV_MODE=1
OPENCLAW_WA_THINKING_MESSAGES=1
```

## The Problem Space

Three independently-discovered issues combined to create an infinite echo loop that flooded the WhatsApp self-chat with reasoning messages.

### How WhatsApp Replies Work

```
AI Model → dispatch-from-config.ts → dispatcher → deliver callback → deliverWebReply → WhatsApp
                                   ↘ routeReply → channel plugin send → WhatsApp
```

The dispatch system has **two delivery paths**:

- **Path B (dispatcher)**: `normalizeReplyPayload` → dispatcher `enqueue` → `deliver` callback → `deliverWebReply`
- **Path A (routeReply)**: `normalizeReplyPayload` → `routeReply` → channel plugin send (bypasses `deliver` callback entirely)

Path A activates when `shouldRouteToOriginating` is true (cross-channel routing). Path B is the normal WhatsApp auto-reply flow. Both paths go through `normalizeReplyPayload` which prepends the `responsePrefix`.

### How Echo Detection Works

1. **Level 1** (`on-message.ts`): `echoTracker.has(msg.body)` — checks raw inbound text against stored sent texts
2. **Level 2** (`process-message.ts`): `echoTracker.has(combinedEchoKey)` — checks formatted inbound against stored combined body key

When OpenClaw sends a message via WhatsApp, the text is stored in the echo cache via `rememberSentText`. When the same text bounces back (self-chat echo), the cache match prevents re-processing.

### How Reasoning Text Flows

Reasoning text arrives as **inline text** in the final reply, NOT as a separate `isReasoning: true` payload:

```
Reasoning:
_The user wants X. Let me think about Y._

Here is the actual answer.
```

After `normalizeReplyPayload` prepends the configured `responsePrefix` (`[openclaw] 🦞`):

```
[openclaw] 🦞 Reasoning:
_The user wants X._

Here is the actual answer.
```

## Root Cause #1: SEC-WA1 Only Ran in Path B

**Commits**: `00cb995` → `6aa25cb` → `46faa89` → `a5ff40b` → `abd3f6e`

The initial SEC-WA1 implementation placed the `💭` transformation in the `deliver` callback of `process-message.ts`:

```ts
// process-message.ts deliver callback (Path B only)
if (process.env.OPENCLAW_WA_THINKING_MESSAGES === "1" && payload.text) {
    payload.text = payload.text.replace(/^.*?Reasoning:/, "💭 Reasoning:");
}
await deliverWebReply({ replyResult: payload, ... });
```

This worked for Path B (dispatcher → deliver callback → deliverWebReply). But during echo loops, some responses were routed through **Path A** (routeReply → channel plugin), which bypasses the `deliver` callback entirely. These messages went to WhatsApp with the raw `[openclaw] 🦞 Reasoning:` prefix — no `💭` transformation.

**Evidence**: Gateway logs at 03:31 UTC showed 16 outbound messages with **zero** `auto-reply sent` entries from `deliverWebReply`. The messages were sent through a path that never touched the `deliver` callback.

**Fix** (`64de7b8`): Move SEC-WA1 into `deliverWebReply` itself, before the reasoning suppression check. This covers ALL delivery paths since both Path A and Path B eventually call `deliverWebReply`:

```ts
// deliver-reply.ts — runs for ALL WhatsApp deliveries
if (
  process.env.OPENCLAW_DEV_MODE === "1" &&
  process.env.OPENCLAW_WA_THINKING_MESSAGES === "1" &&
  replyResult.text
) {
  replyResult.text = replyResult.text.replace(/^.*?Reasoning:/, "💭 Reasoning:");
}
```

## Root Cause #2: `shouldSuppressReasoningReply` Bypassed by Prefix

**Commits**: `a5ff40b` → `64de7b8`

`deliver-reply.ts` has a safety-net function that suppresses reasoning payloads from reaching WhatsApp:

```ts
const REASONING_PREFIX = "reasoning:";
function shouldSuppressReasoningReply(payload) {
  return text.trimStart().toLowerCase().startsWith(REASONING_PREFIX);
}
```

But `normalizeReplyPayload` (called earlier in the dispatch pipeline) prepends the `responsePrefix`, changing the text from `Reasoning:\n_..._` to `[openclaw] 🦞 Reasoning:\n_..._`. The suppression check sees `[openclaw]...` — which does NOT start with `"reasoning:"` — so the check is completely bypassed. Reasoning text passes through to WhatsApp unfiltered.

**Fix** (`64de7b8`): Strip the `responsePrefix` pattern before checking:

```ts
function shouldSuppressReasoningReply(payload) {
  if (payload.isReasoning === true) return true;
  const text = payload.text;
  if (typeof text !== "string") return false;
  // Strip any responsePrefix (e.g. "[openclaw] 🦞") before checking
  const stripped = text.trimStart().replace(/^\[.*?\]\s*\S*\s*/, "");
  return stripped.toLowerCase().startsWith(REASONING_PREFIX);
}
```

This works in concert with SEC-WA1: when `OPENCLAW_WA_THINKING_MESSAGES=1`, SEC-WA1 transforms the prefix to `💭 Reasoning:` first, which no longer matches the `[prefix]` strip pattern, so it passes through (reasoning shown). When `OPENCLAW_WA_THINKING_MESSAGES=0`, no transformation happens, the prefix is stripped, and `Reasoning:` is detected and suppressed (reasoning hidden).

## Root Cause #3: Echo Cache Stored Pre-Conversion Text

**Commit**: `875b4de`

Even after fixing the delivery paths and suppression, echoes persisted. The echo detection was storing raw `payload.text` (Markdown) but comparing against `msg.body` (WhatsApp-formatted text after `markdownToWhatsApp` conversion).

Example — what was stored vs what echoed back:

| Stored (raw Markdown) | Echo (WhatsApp format) | Match? |
| --------------------- | ---------------------- | ------ |
| `**Smaug's cousin**`  | `*Smaug's cousin*`     | No     |
| `[link](url)`         | `url`                  | No     |

The `markdownToWhatsApp` function converts Markdown bold `**text**` to WhatsApp bold `*text*`, among other transformations. The echo cache stored the pre-conversion text, so the post-conversion echo never matched.

**Fix** (`875b4de`): Apply the same `markdownToWhatsApp` + `convertMarkdownTables` conversion before storing in the echo cache:

```ts
// process-message.ts — store what WhatsApp actually receives
const echoText = payload.text
    ? markdownToWhatsApp(convertMarkdownTables(payload.text, tableMode))
    : undefined;
params.rememberSentText(echoText, { ... });
```

## The Infinite Loop Mechanism

All three root causes combined to produce this loop:

```
1. User sends message
2. Bot generates response with inline reasoning text
3. normalizeReplyPayload prepends "[openclaw] 🦞" prefix
4. SEC-WA1 (in wrong location) may or may not transform to "💭"
5. shouldSuppressReasoningReply fails to detect reasoning (prefix blocks it)
6. Message sent to WhatsApp: "[openclaw] 🦞 Reasoning:\n_thinking_\n\nAnswer"
7. Message also sent as answer chunk: "[openclaw] 🦞 Answer text with **bold**"
8. Echo arrives: "[openclaw] 🦞 Answer text with *bold*"
                                                    ^^^^^^
                                        (markdownToWhatsApp converted **→*)
9. Echo cache has "**bold**", echo has "*bold*" → NO MATCH
10. Bot processes echo as new message
11. Bot generates new response with reasoning → GOTO 3
```

Each cycle took 3-5 seconds, generating ~16 messages per minute. The AI model even recognized the loop, generating responses like _"This is clearly an echo loop — my reasoning keeps being sent back"_ and _"Still echoing. Just keep saying NO_REPLY."_ — but its `NO_REPLY` tokens were overridden by the inline reasoning text that kept leaking through.

## Commit Timeline

| Time (UTC+2) | Commit    | What                                                                        |
| ------------ | --------- | --------------------------------------------------------------------------- |
| 21:21        | `00cb995` | Initial SEC-WA1: naive prefix swap in `deliver-reply.ts`                    |
| 21:25        | `6aa25cb` | Use regex to strip any prefix before `Reasoning:`                           |
| 21:38        | `46faa89` | Try to bypass reasoning suppression in `dispatch-from-config.ts`            |
| 22:05        | `a5ff40b` | Remove failed approach, move regex to `convertedText` in `deliver-reply.ts` |
| 22:29        | `abd3f6e` | Move swap to `process-message.ts` deliver callback, before echo cache       |
| 23:16        | `b739a61` | Revert unrelated ackReaction changes                                        |
| 06:17        | `64de7b8` | **Fix #1+#2**: Move SEC-WA1 into `deliverWebReply`, fix suppression check   |
| 06:37        | `875b4de` | **Fix #3**: Echo cache stores post-`markdownToWhatsApp` text                |

## Final Architecture

```
                    normalizeReplyPayload
                    (prepends responsePrefix)
                            │
                    ┌───────┴───────┐
                    │               │
              Path B (dispatcher)  Path A (routeReply)
                    │               │
              deliver callback      │
                    │               │
                    └───────┬───────┘
                            │
                     deliverWebReply ◄── SEC-WA1 runs HERE (covers both paths)
                            │
                    ┌───────┴───────┐
                    │               │
          shouldSuppressReasoning   │
          (strips prefix, checks)   │
                    │               │
              markdownToWhatsApp    │
                    │               │
              msg.reply(chunk)      │
                            │
                     rememberSentText ◄── stores POST-conversion text
```

## Net Changes (from pre-SEC-WA1 to final)

**`deliver-reply.ts`** — 2 additions:

1. SEC-WA1 transformation in `deliverWebReply` (before suppression check)
2. `shouldSuppressReasoningReply` strips `responsePrefix` before checking

**`process-message.ts`** — 2 additions:

1. Import `markdownToWhatsApp` + `convertMarkdownTables`
2. `rememberSentText` stores post-conversion text instead of raw `payload.text`

## Known Limitations

**Multi-chunk echo**: Long messages are chunked by `deliverWebReply`. Each chunk echoes separately, but `rememberSentText` stores the full (unchunked) converted text. Individual chunk echoes won't match the full stored text. This is a rare edge case — most reasoning-only responses are single-chunk.

**routeReply path**: Path A sends through `routeReply` → channel plugin. If `deliverWebReply` is not called in this path, SEC-WA1 won't run. Current evidence suggests Path A does eventually call `deliverWebReply` for WhatsApp, but this hasn't been fully confirmed for all routing scenarios.
