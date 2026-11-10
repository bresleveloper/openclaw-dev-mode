//#region src/auto-reply/reply/reply-turn-kind.ts
function resolveReplyTurnKind(opts) {
	return opts?.isHeartbeat === true ? "heartbeat" : opts?.internalEventExecution ? "queued_followup" : "visible";
}
function resolveReplyRunTrigger(turn) {
	return turn.isHeartbeat ? "heartbeat" : turn.followupRun.run.scheduledAutomation ? "cron" : turn.followupRun.run.internalEventExecution ? "event" : "user";
}
//#endregion
export { resolveReplyTurnKind as n, resolveReplyRunTrigger as t };
