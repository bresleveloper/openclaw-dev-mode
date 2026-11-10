import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-7AOYu6JQ.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-BBdP2m5e.mjs").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
		...target,
		expectedSessionId: target.sessionId,
		getConfig: readRuntimeConfig,
		getGatewayRuntime: getGatewayRecoveryRuntime
	}), () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
