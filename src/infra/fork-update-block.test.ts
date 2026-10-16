// FIX-09 (openclaw-dev-mode fork): every OpenClaw update entry point refuses while blocked.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { updateCommand } from "../cli/update-cli/update-command.js";
import { maybeOfferUpdateBeforeDoctor } from "../commands/doctor-update.js";
import type { GatewayRequestHandlerOptions } from "../gateway/server-methods/shared-types.js";
import { updateHandlers } from "../gateway/server-methods/update.js";
import {
  assertForkUpdateAllowed,
  FORK_UPDATE_BLOCKED_MESSAGE,
  FORK_UPDATE_BLOCKED_REASON,
  ForkUpdateBlockedError,
  isForkUpdateBlocked,
  setForkUpdateBlockForTest,
} from "./fork-update-block.js";
import { runAutoUpdateCommand } from "./update-startup-auto-run.js";

// The update modules pull a large graph; the first transform on a cold worker can take a minute.
describe("FIX-09 fork update block", { timeout: 300_000 }, () => {
  beforeEach(() => {
    setForkUpdateBlockForTest(true);
  });

  afterEach(() => {
    // test/setup.shared.ts lifts the block for upstream's update-flow tests; keep it that way.
    setForkUpdateBlockForTest(false);
  });

  it("stays on until the test switch lifts it", () => {
    expect(isForkUpdateBlocked()).toBe(true);
    expect(() => assertForkUpdateAllowed()).toThrow(ForkUpdateBlockedError);
    expect(() => assertForkUpdateAllowed()).toThrow(FORK_UPDATE_BLOCKED_MESSAGE);
    setForkUpdateBlockForTest(false);
    expect(() => assertForkUpdateAllowed()).not.toThrow();
  });

  it("refuses the update.run gateway method before anything else", async () => {
    const handler = updateHandlers["update.run"];
    if (!handler) {
      throw new Error("update.run handler is missing");
    }
    const respond = vi.fn();
    await handler({ params: {}, respond } as unknown as GatewayRequestHandlerOptions);
    expect(respond).toHaveBeenCalledTimes(1);
    expect(respond).toHaveBeenCalledWith(
      false,
      undefined,
      expect.objectContaining({ code: "INVALID_REQUEST", message: FORK_UPDATE_BLOCKED_MESSAGE }),
    );
  });

  it("refuses the CLI update executor", async () => {
    await expect(updateCommand({})).rejects.toBeInstanceOf(ForkUpdateBlockedError);
  });

  it("skips startup auto-updates and update campaigns", async () => {
    const log = { info: vi.fn() };
    const result = await runAutoUpdateCommand(
      {
        runId: "fix-09",
        channel: "stable",
        mode: "git",
        timeoutMs: 1_000,
        restartDrainTimeoutMs: undefined,
      },
      log,
    );
    expect(result).toMatchObject({
      status: "failed",
      message: FORK_UPDATE_BLOCKED_MESSAGE,
      result: { status: "skipped", reason: FORK_UPDATE_BLOCKED_REASON },
    });
  });

  it("never offers an update before doctor, even interactively in a git checkout", async () => {
    const confirm = vi.fn(async () => true);
    const ttyDescriptor = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");
    Object.defineProperty(process.stdin, "isTTY", { configurable: true, value: true });
    try {
      await expect(
        maybeOfferUpdateBeforeDoctor({
          options: {},
          root: process.cwd(),
          confirm,
          outro: vi.fn(),
        }),
      ).resolves.toEqual({ updated: false });
    } finally {
      if (ttyDescriptor) {
        Object.defineProperty(process.stdin, "isTTY", ttyDescriptor);
      } else {
        delete (process.stdin as { isTTY?: boolean }).isTTY;
      }
    }
    expect(confirm).not.toHaveBeenCalled();
  });
});
