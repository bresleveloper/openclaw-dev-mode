import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-Cl-1FBey.mjs";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-DmlrrezG.mjs").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
		...target,
		expectedSessionId: target.sessionId,
		getConfig: getRuntimeConfig,
		getGatewayRuntime: getGatewayRecoveryRuntime
	}), () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
