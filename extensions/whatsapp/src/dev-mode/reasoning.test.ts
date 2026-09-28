import { afterEach, describe, expect, it, vi } from "vitest";
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
});
