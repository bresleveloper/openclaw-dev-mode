import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { InternalHookEvent } from "../../internal-hook-types.js";

const { enqueueSystemEvent, requestHeartbeat } = vi.hoisted(() => ({
  enqueueSystemEvent: vi.fn(() => true),
  requestHeartbeat: vi.fn(),
}));
vi.mock("../../../infra/system-events.js", () => ({ enqueueSystemEvent }));
vi.mock("../../../infra/heartbeat-wake.js", () => ({ requestHeartbeat }));

const { default: handler, buildGreetingEvent } = await import("./handler.js");

function hookEvent(
  type: InternalHookEvent["type"],
  action: string,
  sessionKey: string,
  context: Record<string, unknown> = {},
): InternalHookEvent {
  return { type, action, sessionKey, context, timestamp: new Date(), messages: [] };
}

describe("dev-mode-greeting hook", () => {
  beforeEach(() => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "1");
    vi.stubEnv("OPENCLAW_DEV_MODE_GREETING", "be very snide");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("is inert outside dev-mode", async () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "");
    await handler(hookEvent("command", "new", "agent:main:whatsapp:direct:+15550001111"));
    expect(enqueueSystemEvent).not.toHaveBeenCalled();
    expect(requestHeartbeat).not.toHaveBeenCalled();
  });

  it("wakes the reset session with the styled greeting prompt", async () => {
    const sessionKey = "agent:main:whatsapp:direct:+15550001111";
    await handler(hookEvent("command", "new", sessionKey));
    expect(enqueueSystemEvent).toHaveBeenCalledWith(buildGreetingEvent("new", "be very snide"), {
      sessionKey,
      contextKey: "dev-mode-greeting:new",
    });
    expect(requestHeartbeat).toHaveBeenCalledWith({
      source: "hook",
      intent: "immediate",
      reason: "dev-mode:greeting",
      agentId: "main",
      sessionKey,
    });
  });

  it("greets after compaction at most once per cooldown window per session", async () => {
    const sessionKey = "agent:main:whatsapp:direct:+15550002222";
    await handler(hookEvent("session", "compact:after", sessionKey));
    await handler(hookEvent("session", "compact:after", sessionKey));
    expect(requestHeartbeat).toHaveBeenCalledTimes(1);
    expect(enqueueSystemEvent).toHaveBeenCalledWith(
      expect.stringContaining("just compacted"),
      expect.objectContaining({ sessionKey }),
    );
  });

  it("skips compactions without a real session and unrelated events", async () => {
    await handler(
      hookEvent("session", "compact:after", "agent:main:x", { missingSessionKey: true }),
    );
    await handler(hookEvent("command", "stop", "agent:main:whatsapp:direct:+15550003333"));
    expect(requestHeartbeat).not.toHaveBeenCalled();
  });

  it("falls back to the default style when none is configured", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE_GREETING", "");
    expect(buildGreetingEvent("reset", "x")).toContain("/reset");
  });
});
