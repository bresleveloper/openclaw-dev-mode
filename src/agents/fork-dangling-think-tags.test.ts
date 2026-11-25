import { afterEach, describe, expect, it, vi } from "vitest";
import type { AssistantMessage } from "../llm/types.js";
import {
  extractAssistantThinking,
  extractAssistantVisibleText,
  promoteThinkingTagsToBlocks,
} from "./embedded-agent-utils.js";
import { promoteDanglingThinkTags } from "./fork-dangling-think-tags.js";

function message(content: unknown[]): AssistantMessage {
  return { role: "assistant", content } as unknown as AssistantMessage;
}

// The message-end order in embedded-agent-subscribe.handlers.messages.lifecycle.ts.
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
