import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-x2BD6vuX.mjs").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
		...target,
		expectedSessionId: target.sessionId,
		getConfig: getRuntimeConfig,
		getGatewayRuntime: getGatewayRecoveryRuntime
	}), () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
