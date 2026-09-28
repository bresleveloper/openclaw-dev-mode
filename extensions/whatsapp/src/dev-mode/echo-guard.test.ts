import { afterEach, describe, expect, it, vi } from "vitest";
import type { AdmittedWebInboundMessage } from "../inbound/types.js";
import { isDevModeSelfChatReasoningEcho } from "./echo-guard.js";

const SELF = "15550001111@s.whatsapp.net";

function inbound(body: string): AdmittedWebInboundMessage {
  return { platform: { recipientJid: SELF }, payload: { body } } as AdmittedWebInboundMessage;
}

describe("isDevModeSelfChatReasoningEcho", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(["💭 Reasoning:\n_plan_", "[openclaw] Reasoning:\n_plan_", "[openclaw] 💭 Reasoning:"])(
    "drops self-chat echo %j in dev-mode",
    (body) => {
      vi.stubEnv("OPENCLAW_DEV_MODE", "1");
      expect(isDevModeSelfChatReasoningEcho(inbound(body), SELF)).toBe(true);
    },
  );

  it("keeps ordinary self-chat messages and other conversations", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    expect(isDevModeSelfChatReasoningEcho(inbound("what's the plan?"), SELF)).toBe(false);
    expect(isDevModeSelfChatReasoningEcho(inbound("💭 Reasoning:"), "other@s.whatsapp.net")).toBe(
      false,
    );
  });

  it("is inert outside dev-mode", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "");
    expect(isDevModeSelfChatReasoningEcho(inbound("💭 Reasoning:"), SELF)).toBe(false);
  });
});
