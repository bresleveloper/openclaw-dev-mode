import { u as getActiveCronJobCount } from "./active-jobs-CqHAjCGh.mjs";
import { n as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BecFApIY.mjs";
//#region src/gateway/server-active-work.ts
const isActiveChatRun = (entry) => !entry.controller.signal.aborted && entry.registrationCleanupRequested !== true;
const hasTerminalPersistence = (entry) => entry.controlUiVisible !== false && entry.projectSessionTerminalPersisted !== true && (entry.projectSessionTerminalPending === true || entry.projectSessionTerminalPersistence !== void 0);
function createGatewayServerActiveWorkInspectors(context) {
	const holders = (matches) => Array.from(context.chatAbortControllers).filter(([, entry]) => matches(entry)).map(([runId, entry]) => `run=${runId} session=${entry.sessionKey}`);
	return {
		getCronRuns: () => Math.max(getActiveCronJobCount(), getSuspensionVisibleCronTaskRunCount()) + (context.cron.getSuspensionBlockerCount?.() ?? 0),
		getChatRuns: () => Array.from(context.chatAbortControllers.values()).filter(isActiveChatRun).length,
		getChatRunHolders: () => holders(isActiveChatRun),
		getQueuedTurns: () => Array.from(context.chatQueuedTurns.values()).filter((entry) => !entry.controller.signal.aborted).length,
		getTerminalPersistence: () => Array.from(context.chatAbortControllers.values()).filter(hasTerminalPersistence).length,
		getTerminalPersistenceHolders: () => holders(hasTerminalPersistence),
		getTerminalSessions: () => context.terminalSessions?.size ?? 0
	};
}
//#endregion
export { createGatewayServerActiveWorkInspectors as t };
