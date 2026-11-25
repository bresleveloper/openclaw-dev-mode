import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { InternalHookEvent } from "../../internal-hook-types.js";

const target = { sessionId: "session-1", generation: "generation-1" };
const { captureSessionEventTargetForHost, enqueueSessionEventForHost } = vi.hoisted(() => ({
  captureSessionEventTargetForHost: vi.fn(),
  enqueueSessionEventForHost: vi.fn(),
}));
vi.mock("../../../auto-reply/reply/session-event-handoff.js", () => ({
  captureSessionEventTargetForHost,
  enqueueSessionEventForHost,
}));

const { default: handler, buildGreetingEvent } = await import("./handler.js");

function receipt(outcome: { status: string; error?: string }) {
  return {
    id: "receipt-1",
    cancel: () => true,
    accepted: Promise.resolve({ ok: true }),
    settled: Promise.resolve({ executionStarted: true, delivered: true, ...outcome }),
  };
}

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
    captureSessionEventTargetForHost.mockResolvedValue(target);
    enqueueSessionEventForHost.mockReturnValue(receipt({ status: "completed" }));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("is inert outside dev-mode", async () => {
    vi.stubEnv("OPENCLAW_DEV_MODE", "");
    await handler(hookEvent("command", "new", "agent:main:whatsapp:direct:+15550001111"));
    expect(captureSessionEventTargetForHost).not.toHaveBeenCalled();
    expect(enqueueSessionEventForHost).not.toHaveBeenCalled();
  });

  it("hands the reset session a hook event with the styled greeting prompt", async () => {
    const sessionKey = "agent:main:whatsapp:direct:+15550001111";
    await handler(hookEvent("command", "new", sessionKey));
    expect(captureSessionEventTargetForHost).toHaveBeenCalledWith("main", sessionKey);
    expect(enqueueSessionEventForHost).toHaveBeenCalledWith(
      buildGreetingEvent("new", "be very snide"),
      {
        agentId: "main",
        sessionKey,
        source: "hook",
        contextKey: "dev-mode-greeting:new",
        expectedTarget: target,
      },
    );
  });

  it("skips /new and /reset that carry text: the text's own turn is the first turn", async () => {
    const sessionKey = "agent:main:whatsapp:direct:+15550006666";
    await handler(
      hookEvent("command", "new", sessionKey, { resetTail: "what is on my calendar?" }),
    );
    await handler(hookEvent("command", "reset", sessionKey, { resetTail: "soft" }));
    expect(captureSessionEventTargetForHost).not.toHaveBeenCalled();
    expect(enqueueSessionEventForHost).not.toHaveBeenCalled();
  });

  it("still greets a bare reset whose tail is empty or blank", async () => {
    const sessionKey = "agent:main:whatsapp:direct:+15550007777";
    await handler(hookEvent("command", "new", sessionKey, { resetTail: "" }));
    await handler(hookEvent("command", "reset", sessionKey, { resetTail: "   " }));
    expect(enqueueSessionEventForHost).toHaveBeenCalledTimes(2);
    expect(enqueueSessionEventForHost).toHaveBeenNthCalledWith(
      1,
      buildGreetingEvent("new", "be very snide"),
      expect.objectContaining({ sessionKey, contextKey: "dev-mode-greeting:new" }),
    );
    expect(enqueueSessionEventForHost).toHaveBeenNthCalledWith(
      2,
      buildGreetingEvent("reset", "be very snide"),
      expect.objectContaining({ sessionKey, contextKey: "dev-mode-greeting:reset" }),
    );
  });

  it("greets after compaction at most once per cooldown window per session", async () => {
    const sessionKey = "agent:main:whatsapp:direct:+15550002222";
    await handler(hookEvent("session", "compact:after", sessionKey));
    await handler(hookEvent("session", "compact:after", sessionKey));
    expect(enqueueSessionEventForHost).toHaveBeenCalledTimes(1);
    expect(enqueueSessionEventForHost).toHaveBeenCalledWith(
      expect.stringContaining("just compacted"),
      expect.objectContaining({ sessionKey, source: "hook" }),
    );
  });

  it("skips compactions without a real session and unrelated events", async () => {
    await handler(
      hookEvent("session", "compact:after", "agent:main:x", { missingSessionKey: true }),
    );
    await handler(hookEvent("command", "stop", "agent:main:whatsapp:direct:+15550003333"));
    expect(captureSessionEventTargetForHost).not.toHaveBeenCalled();
    expect(enqueueSessionEventForHost).not.toHaveBeenCalled();
  });

  it("logs and swallows a host that refuses the target, so the reset command still finishes", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    captureSessionEventTargetForHost.mockRejectedValue(new Error("Session event target is gone"));
    await expect(
      handler(hookEvent("command", "reset", "agent:main:whatsapp:direct:+15550004444")),
    ).resolves.toBeUndefined();
    expect(enqueueSessionEventForHost).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith("[dev-mode-greeting] failed: Session event target is gone");
  });

  it("reports an event the host did not run without waiting for it", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    enqueueSessionEventForHost.mockReturnValue(
      receipt({ status: "failed", error: "Session event has no original external delivery route" }),
    );
    await handler(hookEvent("command", "new", "agent:main:whatsapp:direct:+15550005555"));
    await vi.waitFor(() =>
      expect(warn).toHaveBeenCalledWith(
        "[dev-mode-greeting] event not delivered: Session event has no original external delivery route",
      ),
    );
  });

  it("falls back to the default style when none is configured", () => {
    vi.stubEnv("OPENCLAW_DEV_MODE_GREETING", "");
    expect(buildGreetingEvent("reset", "x")).toContain("/reset");
  });
});
