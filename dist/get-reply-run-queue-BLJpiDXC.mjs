//#region src/auto-reply/reply/get-reply-run-queue.ts
const REPLY_RUN_STILL_SHUTTING_DOWN_TEXT = "⚠️ Previous run is still shutting down. Please try again in a moment.";
/** Waits for admitted active work and returns guidance if it still has not settled. */
async function waitForPreparedReplyQueue(params) {
	if (params.queueMode === "interrupt") await params.interruptActiveRun();
	else await params.waitForActiveRunEnd(params.activeSessionId);
	await params.refreshPreparedState();
	return params.resolveBusyState().isActive ? { text: REPLY_RUN_STILL_SHUTTING_DOWN_TEXT } : void 0;
}
//#endregion
export { waitForPreparedReplyQueue as n, REPLY_RUN_STILL_SHUTTING_DOWN_TEXT as t };
