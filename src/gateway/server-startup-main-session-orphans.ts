import type { OpenClawConfig } from "../config/types.openclaw.js";
import { createLazyRuntimeModule } from "../shared/lazy-runtime.js";
import { measureStartup, type GatewayStartupTrace } from "./server-startup-trace.js";

// Startup only needs orphan marking; keep resume and delivery runtime out of the pre-channel path.
const loadMainSessionRestartRecoveryMarkingModule = createLazyRuntimeModule(
  () => import("../agents/main-session-recovery/main-session-restart-recovery-marking.js"),
);

/** Mark predecessors before channels admit work; a tripped crash-loop breaker quarantines them. */
export async function markGatewayStartupMainSessionOrphans(
  params: {
    cfg: OpenClawConfig;
    isRestartRecoverySuppressed?: () => boolean;
    scheduler: { signal: AbortSignal };
    startupTrace?: GatewayStartupTrace;
    log: { warn: (message: string) => void };
  },
  startupCheckedStorePaths: Set<string>,
): Promise<void> {
  await measureStartup(params.startupTrace, "sidecars.main-session-recovery", async () => {
    try {
      if (params.scheduler.signal.aborted || params.isRestartRecoverySuppressed?.()) {
        return;
      }
      const { markStartupOrphanedMainSessionsForRecovery } = await measureStartup(
        params.startupTrace,
        "sidecars.main-session-recovery-load",
        loadMainSessionRestartRecoveryMarkingModule,
      );
      if (params.scheduler.signal.aborted || params.isRestartRecoverySuppressed?.()) {
        return;
      }
      await measureStartup(params.startupTrace, "sidecars.main-session-recovery-scan", () =>
        markStartupOrphanedMainSessionsForRecovery({ cfg: params.cfg, startupCheckedStorePaths }),
      );
    } catch (err) {
      params.log.warn(
        `main-session startup orphan marking failed before channel startup: ${String(err)}`,
      );
    }
  });
}
