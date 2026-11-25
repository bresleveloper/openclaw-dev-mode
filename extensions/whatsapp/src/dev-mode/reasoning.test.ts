import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeWhatsAppPayloadTextPreservingIndentation } from "../outbound-media-contract.js";
import { formatDevModeReasoningPayload } from "./reasoning.js";

describe("formatDevModeReasoningPayload", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("leaves payloads alone outside dev-mode", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "");
    expect(formatDevModeReasoningPayload({ text: "plan", isReasoning: true })).toBeUndefined();
  });

  it.each([
    ["flagged raw thinking", { text: "check config\nthen reply", isReasoning: true }],
    ["Thinking preamble", { text: "Thinking\n\n_check config_\n_then reply_" }],
    ["Reasoning preamble", { text: "Reasoning:\n_check config_\n_then reply_" }],
    ["prefixed preamble", { text: "[openclaw] Thinking...\n_check config_\n_then reply_" }],
  ])("renders %s as a 💭 message", (_name, payload) => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(formatDevModeReasoningPayload(payload, "[openclaw]")).toEqual({
      ...payload,
      isReasoning: undefined,
      text: "💭 Reasoning:\n_check config_\n_then reply_",
    });
  });

  it("ignores ordinary replies, including ones that mention thinking", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(
      formatDevModeReasoningPayload({ text: "I was thinking... about lunch" }),
    ).toBeUndefined();
    expect(formatDevModeReasoningPayload({ text: "Done." }, "[openclaw]")).toBeUndefined();
  });

  // What the phone gets: the 💭 text after WhatsApp's outbound sanitizer.
  const delivered = (text: string) =>
    normalizeWhatsAppPayloadTextPreservingIndentation(
      formatDevModeReasoningPayload({ text, isReasoning: true })?.text,
    );

  it.each([
    ["an opening <think> without a closing one", "<think>check config\nthen reply"],
    ["an unclosed <think> after other reasoning", "check config\n<think>then reply"],
    ["a closed <think> pair", "<think>check config</think>\nthen reply"],
    ["other tag spellings", "<THINKING>check config\n<thought>then reply"],
  ])("keeps the reasoning text with %s", (_name, text) => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(delivered(text)).toBe("💭 Reasoning:\n_check config_\n_then reply_");
  });

  it("sends no 💭 message for a bare <think>", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(formatDevModeReasoningPayload({ text: "<think>", isReasoning: true })).toBeUndefined();
  });

  it("keeps a literal tag inside inline code", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(delivered("kimi starts with `<think>` here")).toBe(
      "💭 Reasoning:\n_kimi starts with `<think>` here_",
    );
  });
});
