// [dev-mode] FIX-12: a think tag without its partner counts as complete (Ariel, 2026-11-25).
//
// kimi-k2.7-code via Ollama (anthropic-messages) often returns its whole reasoning as reply
// TEXT ending in a "</think>" whose opening tag never arrived, with no thinking block.
// Upstream's promoteThinkingTagsToBlocks (src/agents/embedded-agent-utils.ts) promotes text
// only when it starts with an opening think tag and also closes it, so this text stayed text:
// the outbound sanitizer dropped the reasoning, or sent it as a plain reply when nothing
// followed the tag, and no 💭 ever showed (373 such replies in Ariel's WhatsApp chat,
// 2026-11-10 to 2026-11-25).
//
// At message end, right before upstream's promotion, promoteDanglingThinkTags splits such a
// text block into a thinking block plus the rest, so core emits the reasoning under
// /reasoning on (WhatsApp shows it as 💭, SEC-WA1) and the reply keeps only the answer:
// - a closing tag with no opening tag before it: the text before it is reasoning;
// - an opening tag with no closing tag after it: the text after it is reasoning.
// Dev-mode only, so non-dev-mode output is upstream's exactly. Skipped when the message
// already has a thinking block (upstream's guard: signed blocks must replay unchanged).
// Tags inside code stay text; a complete pair is left to upstream's promotion.
//
// Regression checklist after an upstream upgrade:
// - The hook sits in src/agents/embedded-agent-subscribe.handlers.messages.lifecycle.ts right
//   after `const sourceContent = assistantMessage.content;` and right before
//   promoteThinkingTagsToBlocks(assistantMessage); `git grep -n "openclaw-dev-mode FIX-12"`
//   lists the call and its import. If upstream moved its promotion, move the hook with it.
// - THINK_TAG_RE uses the tag names of THINKING_TAG_NAME_PATTERN in embedded-agent-utils.ts.
// - If upstream's promotion starts handling a missing partner tag itself, drop FIX-12.
// - Test: src/agents/fork-dangling-think-tags.test.ts.
import { stripCompactionReplayCheckpointInPlace } from "@openclaw/ai/transports";
import { isDevMode } from "../globals.js";
import type { AssistantMessage } from "../llm/types.js";
import { findCodeRegions, isInsideCode } from "../shared/text/code-regions.js";

const THINK_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\s*>/giu;

/** Splits text whose first think tag outside code has no partner; undefined otherwise. */
export function splitDanglingThinkTag(
  text: string,
): { thinking: string; rest: string } | undefined {
  const candidates = [...text.matchAll(THINK_TAG_RE)];
  if (candidates.length === 0) {
    return undefined;
  }
  const code = findCodeRegions(text);
  const tags = candidates.filter((tag) => !isInsideCode(tag.index, code));
  const first = tags[0];
  if (!first) {
    return undefined;
  }
  const before = text.slice(0, first.index);
  const after = text.slice(first.index + first[0].length);
  if (first[1] === "/") {
    return { thinking: before.trim(), rest: after.trimStart() };
  }
  if (tags.some((tag) => tag[1] === "/")) {
    return undefined;
  }
  return { thinking: after.trim(), rest: before.trimEnd() };
}

/** Dev-mode: splits text blocks with a dangling think tag into thinking + text (see header). */
export function promoteDanglingThinkTags(message: AssistantMessage): void {
  if (!isDevMode() || !Array.isArray(message.content)) {
    return;
  }
  if (
    message.content.some((block) => block && typeof block === "object" && block.type === "thinking")
  ) {
    return;
  }
  const next: AssistantMessage["content"] = [];
  let changed = false;
  for (const block of message.content) {
    if (
      !block ||
      typeof block !== "object" ||
      block.type !== "text" ||
      typeof block.text !== "string"
    ) {
      next.push(block);
      continue;
    }
    const split = splitDanglingThinkTag(block.text);
    // A lone tag with nothing around it stays as it is, so the message never ends up empty.
    if (!split || (!split.thinking && !split.rest.trim())) {
      next.push(block);
      continue;
    }
    changed = true;
    if (split.thinking) {
      next.push({ type: "thinking", thinking: split.thinking });
    }
    if (split.rest.trim()) {
      next.push({ ...block, text: split.rest });
    }
  }
  if (!changed) {
    return;
  }
  message.content = next;
  stripCompactionReplayCheckpointInPlace(message);
}
