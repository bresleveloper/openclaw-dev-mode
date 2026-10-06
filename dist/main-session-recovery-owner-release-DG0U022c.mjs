import { r as getRuntimeConfig } from "./io.runtime-CwE7Ks5y.mjs";
import "./io-D61ne4z2.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-BmvAB1L8.mjs").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
		...target,
		expectedSessionId: target.sessionId,
		getConfig: getRuntimeConfig,
		getGatewayRuntime: getGatewayRecoveryRuntime
	}), () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
