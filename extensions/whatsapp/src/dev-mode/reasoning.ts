// [dev-mode] SEC-WA1: WhatsApp shows reasoning as a "💭 Reasoning:" message instead of
// dropping it. Covers flagged reasoning payloads and the text forms core formats as
// "Reasoning:" or "Thinking" preambles (formatReasoningMessage), with or without the
// channel response prefix that core prepends before the channel sees the payload.
//
// Stock 2026.9.x blocks reasoning on WhatsApp at three points; the fork passes each:
// 1. Core drops `isReasoning` payloads unless replyOptions.reasoningPayloadsEnabled is set
//    (Discord/Telegram set it for /reasoning on). -> monitor/inbound-dispatch.ts opts in.
// 2. monitor/inbound-dispatch.ts `resolveWhatsAppDeliverablePayload` drops `isReasoning`.
//    -> its preparePayload converts first; the converted payload has no flag.
// 3. deliver-reply.ts `isReasoningReplyPayload` drops the flag and text starting with
//    "Reasoning:"/"Thinking". -> converted text starts with "💭"; deliver-reply also
//    converts for routed replies that never pass through inbound dispatch.
// Core emits reasoning only when the session /reasoning level is "on" (or
// reasoningDefault "on") and thinking is not "off" (embedded-agent-runner/run/payloads.ts).
//
// Regression checklist if 💭 messages stop appearing after an upstream upgrade:
// - `/reasoning on` in the chat; check `/status` shows reasoning on.
// - grep upstream for `reasoningPayloadsEnabled` (renamed/removed?) and for the
//   three suppression points above (moved to a new file/function?).
// - `formatReasoningMessage` (src/agents/embedded-agent-utils.ts) preamble changed from
//   "Thinking" -> update REASONING_PREAMBLE_RE (7.1 broke exactly this way: it matched
//   only "Reasoning:" while core had switched to "Thinking").
// - upstream's REASONING_PREFIX_RE (src/plugin-sdk/reply-payload.ts) starts matching "💭".
// Self-chat echo loops of these messages: see ./echo-guard.ts.
const REASONING_PREAMBLE_RE = /^(?:>[ \t]?)*(?:reasoning:|thinking\.{0,3})[ \t]*(?:\r?\n|$)/iu;

function italicizeLines(body: string): string {
  return body
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || (trimmed.startsWith("_") && trimmed.endsWith("_"))) {
        return trimmed;
      }
      return `_${trimmed}_`;
    })
    .join("\n");
}

/** Returns the payload rewritten as a visible 💭 message, or undefined when it is not reasoning. */
export function formatDevModeReasoningPayload<T extends { text?: string; isReasoning?: boolean }>(
  payload: T,
  responsePrefix?: string,
): T | undefined {
  if (process.env.OPENCLAW_DEV_MODE !== "1" || typeof payload.text !== "string") {
    return undefined;
  }
  let text = payload.text.trim();
  if (responsePrefix && text.startsWith(responsePrefix)) {
    text = text.slice(responsePrefix.length).trimStart();
  }
  const preamble = REASONING_PREAMBLE_RE.exec(text);
  if (payload.isReasoning !== true && !preamble) {
    return undefined;
  }
  const body = (preamble ? text.slice(preamble[0].length) : text).trim();
  if (!body) {
    return undefined;
  }
  // Clearing the flag lets every WhatsApp delivery path treat it as ordinary text; the
  // "💭" lead keeps upstream's text-based reasoning detector from matching it again.
  return { ...payload, isReasoning: undefined, text: `💭 Reasoning:\n${italicizeLines(body)}` };
}
