import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
//#region src/auto-reply/reply/session-hooks.ts
function resolveExplicitSessionEndReason(matchedResetTriggerLower) {
	return matchedResetTriggerLower === "/reset" ? "reset" : "new";
}
function resolveStaleSessionEndReason(params) {
	return params.entry ? params.freshness?.staleReason : void 0;
}
function buildSessionHookContext(params) {
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	};
}
/** Builds the payload for plugin session-start hooks. */
function buildSessionStartHookPayload(params) {
	return {
		event: {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			resumedFrom: params.resumedFrom
		},
		context: buildSessionHookContext({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		})
	};
}
/** Builds the payload for plugin session-end hooks. */
function buildSessionEndHookPayload(params) {
	return {
		event: {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			messageCount: params.messageCount ?? 0,
			durationMs: params.durationMs,
			reason: params.reason,
			sessionFile: params.sessionFile,
			transcriptArchived: params.transcriptArchived,
			nextSessionId: params.nextSessionId,
			nextSessionKey: params.nextSessionKey
		},
		context: buildSessionHookContext({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		})
	};
}
//#endregion
//#region src/gateway/active-sessions-shutdown-tracker.ts
const trackedSessions = resolveGlobalMap(Symbol.for("openclaw.activeSessionsForShutdown"), "close-and-restart");
function noteActiveSessionForShutdown(entry) {
	if (!entry.sessionId) return;
	trackedSessions.set(entry.sessionId, entry);
}
function forgetActiveSessionForShutdown(sessionId) {
	if (!sessionId) return;
	trackedSessions.delete(sessionId);
}
function listActiveSessionsForShutdown() {
	return Array.from(trackedSessions.values());
}
//#endregion
export { buildSessionStartHookPayload as a, buildSessionEndHookPayload as i, listActiveSessionsForShutdown as n, resolveExplicitSessionEndReason as o, noteActiveSessionForShutdown as r, resolveStaleSessionEndReason as s, forgetActiveSessionForShutdown as t };
