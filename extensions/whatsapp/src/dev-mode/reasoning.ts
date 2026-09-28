// [dev-mode] SEC-WA1: WhatsApp shows reasoning as a "💭 Reasoning:" message instead of
// dropping it. Covers flagged reasoning payloads and the text forms core formats as
// "Reasoning:" or "Thinking" preambles (formatReasoningMessage), with or without the
// channel response prefix that core prepends before the channel sees the payload.
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
