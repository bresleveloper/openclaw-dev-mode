/**
 * FIX-09 (openclaw-dev-mode fork): OpenClaw's own update flow is hard-disabled.
 *
 * An upstream update (git rebase, package swap or managed-service handoff) would replace this
 * fork with stock OpenClaw. The block is not gated by OPENCLAW_DEV_MODE and has no config key
 * or env override on purpose: the fork is redeployed by hand (`git pull` on the VPS, see
 * CLAUDE.md "VPS Update Recipe"). Ariel, 2026-10-11.
 *
 * Hooks, each the first statement of its function in an upstream-owned file:
 * - src/gateway/server-methods/update.ts: the `update.run` handler (Control UI update button,
 *   the agent `gateway` tool's update.run, `/update` in chat, any API client). The refusal is in
 *   the fork-owned src/gateway/server-methods/fork-update-run-refusal.ts, so the hook stays an
 *   import plus a 3-line `if` and update.ts stays within its max-lines cap (700).
 * - src/cli/update-cli/update-command.ts: `updateCommand()`, upstream's single update executor
 *   (`openclaw update`, `openclaw --update`, `openclaw update wizard`, managed handoffs).
 * - src/infra/update-startup-auto-run.ts: `runAutoUpdateCommand()` (startup auto-update and
 *   update campaigns).
 * - src/commands/doctor-update.ts: doctor's "Update OpenClaw from git before running doctor?".
 *
 * Regression checklist (every upstream upgrade):
 * - the four hooks above are still in place and still run first;
 * - `pnpm exec oxlint src/gateway/server-methods/update.ts` reports no max-lines error;
 * - no new update executor appeared: `git grep -n "startManagedServiceUpdateHandoff(\|updateCommand("`
 *   lists only update.ts, update-startup-auto-run.ts, update-command-handoff.ts (inside
 *   updateCommand), wizard.ts, doctor-update.ts and triage-failure.ts (a repair handoff, not an
 *   update);
 * - test/setup.shared.ts still calls `setForkUpdateBlockForTest(false)` at module top level;
 * - src/infra/fork-update-block.test.ts passes.
 */

export const FORK_UPDATE_BLOCKED_REASON = "fork-update-blocked";

export const FORK_UPDATE_BLOCKED_MESSAGE =
  "OpenClaw updates are disabled in this fork (openclaw-dev-mode FIX-09): an upstream update " +
  "would replace the fork with stock OpenClaw. Redeploy the fork manually instead.";

/** Thrown by CLI-side update entry points while updates are blocked. */
export class ForkUpdateBlockedError extends Error {
  constructor() {
    super(FORK_UPDATE_BLOCKED_MESSAGE);
    this.name = "ForkUpdateBlockedError";
  }
}

// Module state, not env or config: only code that imports this module can lift the block.
let updateBlocked = true;

/** True unless a test lifted the block; nothing at runtime can. */
export function isForkUpdateBlocked(): boolean {
  return updateBlocked;
}

/** Throws ForkUpdateBlockedError while updates are blocked. */
export function assertForkUpdateAllowed(): void {
  if (updateBlocked) {
    throw new ForkUpdateBlockedError();
  }
}

/**
 * Test-only switch. test/setup.shared.ts lifts the block so upstream's update-flow tests keep
 * exercising the real paths; fork-update-block.test.ts turns it back on.
 */
export function setForkUpdateBlockForTest(blocked: boolean): void {
  updateBlocked = blocked;
}
