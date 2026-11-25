import { afterEach, describe, expect, it, vi } from "vitest";
import type { AssistantMessage } from "../llm/types.js";
import { prepareTerminalAssistantReply } from "./assistant-terminal-reply.js";
import { buildEmbeddedRunPayloads } from "./embedded-agent-runner/run/payloads.js";
import {
  createSubscribedSessionHarness,
  emitAssistantTextDelta,
  emitAssistantTextEnd,
} from "./embedded-agent-subscribe.e2e-harness.js";
import {
  extractAssistantThinking,
  extractAssistantVisibleText,
  promoteThinkingTagsToBlocks,
} from "./embedded-agent-utils.js";
import { promoteDanglingThinkTags } from "./fork-dangling-think-tags.js";

function message(content: unknown[]): AssistantMessage {
  return { role: "assistant", content } as unknown as AssistantMessage;
}

// The message-end order: FIX-12's hook in the dispatcher (embedded-agent-subscribe.handlers.ts),
// then upstream's promotion (embedded-agent-subscribe.handlers.messages.lifecycle.ts).
function settle(text: string) {
  const msg = message([{ type: "text", text }]);
  promoteDanglingThinkTags(msg);
  promoteThinkingTagsToBlocks(msg);
  return { thinking: extractAssistantThinking(msg), visible: extractAssistantVisibleText(msg) };
}

describe("promoteDanglingThinkTags (FIX-12)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ["a closing tag with the answer after it", "check config</think>Done.", "Done."],
    ["a closing tag at the end", "check config</think>", ""],
    ["an opening tag that never closes", "<think>check config", ""],
    ["an unclosed opening tag after the answer", "Done.\n<think>check config", "Done."],
  ])("turns the reasoning around %s into a thinking block", (_name, text, visible) => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(settle(text)).toEqual({ thinking: "check config", visible });
  });

  it.each([
    ["no tag", "Done."],
    ["a complete pair, which upstream promotes", "<think>check config</think>Done."],
    ["a tag inside inline code", "Kimi ends with `</think>` here."],
    ["a text that is only a lone tag", "</think>"],
  ])("leaves %s alone", (_name, text) => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    const content = [{ type: "text", text }];
    const msg = message(content);
    promoteDanglingThinkTags(msg);
    expect(msg.content).toBe(content);
  });

  it("leaves a message that already has a thinking block alone", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    const content = [
      { type: "thinking", thinking: "native" },
      { type: "text", text: "check config</think>Done." },
    ];
    const msg = message(content);
    promoteDanglingThinkTags(msg);
    expect(msg.content).toBe(content);
  });

  it("does nothing outside dev-mode", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "");
    const content = [{ type: "text", text: "check config</think>" }];
    const msg = message(content);
    promoteDanglingThinkTags(msg);
    expect(msg.content).toBe(content);
  });
});

// What the runner sends for a finished kimi turn. It builds the final reply from the completed
// assistant that captureModelEvent clones before handleMessageEnd runs (attempt-result.ts,
// terminal-preparation.ts), so the hook has to promote ahead of that clone: promoted later,
// the clone keeps kimi's raw text and the reply leaks NO_REPLY or sends the reasoning as text.
async function finalPayloads(text: string) {
  const { emit, subscription } = createSubscribedSessionHarness({
    runId: "run",
    reasoningMode: "on",
  });
  emit({ type: "message_start", message: { role: "assistant", content: [] } });
  for (const delta of text.split(/(<\/?think>)/u)) {
    if (delta) {
      emitAssistantTextDelta({ emit, delta });
    }
  }
  emitAssistantTextEnd({ emit, content: text });
  emit({
    type: "message_end",
    message: {
      role: "assistant",
      content: [{ type: "text", text }],
      stopReason: "stop",
      provider: "ollama",
      api: "anthropic-messages",
      model: "kimi-k2.7-code:cloud",
    },
  });
  await subscription.waitForPendingEvents();
  const completed = subscription.getCurrentAttemptAssistant();
  const kept = subscription.getKeptAnswer();
  const payloads = buildEmbeddedRunPayloads({
    assistantTexts: [...subscription.assistantTexts],
    preparedTerminalReply: prepareTerminalAssistantReply(kept?.assistant ?? completed),
    keptAnswer: kept,
    answerSegments: subscription.answerSegments,
    lastAssistant: completed,
    currentAssistant: completed ?? null,
    sessionKey: "agent:main:whatsapp:direct:+10000000000",
    provider: "ollama",
    model: "kimi-k2.7-code:cloud",
    reasoningLevel: "on",
    thinkingLevel: "medium",
  });
  return payloads.map((payload) => ({
    text: payload.text,
    isReasoning: payload.isReasoning === true,
  }));
}

describe("FIX-12 through the runner's final reply", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    [
      "a silent token after the closing tag",
      "Nothing to add here.</think>NO_REPLY",
      "Nothing to add here.",
      "",
    ],
    [
      "a silent token after the closing tag on its own line",
      "Nothing to add here.\n</think>\n\nNO_REPLY",
      "Nothing to add here.",
      "",
    ],
    ["an answer after the closing tag", "Check config.</think>Done.", "Check config.", "Done."],
    ["a closing tag at the end", "Check config.</think>", "Check config.", ""],
    ["an opening tag that never closes", "<think>Check config.", "Check config.", ""],
    [
      "an unclosed opening tag after the answer",
      "Done.\n<think>Check config.",
      "Check config.",
      "Done.",
    ],
  ])(
    "sends kimi text with %s as reasoning plus the answer",
    async (_name, text, thinking, answer) => {
      vi.stubEnv("OPENCLAW_DEV_MODE", "1");
      const payloads = await finalPayloads(text);
      const replies = payloads.filter((payload) => !payload.isReasoning);
      // The two leaks of a hook that runs too late: the silent token and the reasoning as a reply.
      expect(payloads.map((payload) => payload.text).join("\n")).not.toContain("NO_REPLY");
      expect(replies.map((payload) => payload.text).join("\n")).not.toContain(thinking);
      expect(payloads).toEqual([
        { text: thinking, isReasoning: true },
        ...(answer ? [{ text: answer, isReasoning: false }] : []),
      ]);
    },
  );
});
