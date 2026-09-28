import { s as getActiveCronJobCount } from "./active-jobs-BdNx3YyC.mjs";
import { r as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BIgTNPfC.mjs";
//#region src/gateway/server-active-work.ts
function createGatewayServerActiveWorkInspectors(context) {
	return {
		getCronRuns: () => Math.max(getActiveCronJobCount(), getSuspensionVisibleCronTaskRunCount()) + (context.cron.getSuspensionBlockerCount?.() ?? 0),
		getChatRuns: () => Array.from(context.chatAbortControllers.values()).filter((entry) => !entry.controller.signal.aborted && entry.registrationCleanupRequested !== true).length,
		getQueuedTurns: () => Array.from(context.chatQueuedTurns.values()).filter((entry) => !entry.controller.signal.aborted).length,
		getTerminalPersistence: () => Array.from(context.chatAbortControllers.values()).filter((entry) => entry.controlUiVisible !== false && entry.projectSessionTerminalPersisted !== true && (entry.projectSessionTerminalPending === true || entry.projectSessionTerminalPersistence !== void 0)).length,
		getTerminalSessions: () => context.terminalSessions?.size ?? 0
	};
}
//#endregion
export { createGatewayServerActiveWorkInspectors as t };
