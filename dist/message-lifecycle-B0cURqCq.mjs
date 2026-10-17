import { i as logMessageQueued, o as logSessionStateChange, r as logMessageProcessed } from "./diagnostic-BC19O2Si.mjs";
//#region src/logging/message-lifecycle.ts
function createDiagnosticMessageLifecycle(params) {
	const startedAtMs = params.startedAtMs ?? Date.now();
	const resolveRef = (override) => ({
		sessionId: override?.sessionId ?? params.sessionId,
		sessionKey: override?.sessionKey ?? params.sessionKey
	});
	const canTrackSessionState = (ref) => params.enabled && params.trackSessionState && Boolean(ref.sessionId || ref.sessionKey);
	return {
		markProcessing(override) {
			const ref = resolveRef(override);
			if (!canTrackSessionState(ref)) return;
			logMessageQueued({
				sessionId: ref.sessionId,
				sessionKey: ref.sessionKey,
				channel: params.channel,
				source: params.source
			});
			logSessionStateChange({
				sessionId: ref.sessionId,
				sessionKey: ref.sessionKey,
				state: "processing",
				reason: params.processingReason
			});
		},
		markIdle(reason, override) {
			const ref = resolveRef(override);
			if (!canTrackSessionState(ref)) return;
			logSessionStateChange({
				sessionId: ref.sessionId,
				sessionKey: ref.sessionKey,
				state: "idle",
				reason
			});
		},
		markProcessed(outcome, options) {
			if (!params.enabled) return;
			const ref = resolveRef(options);
			logMessageProcessed({
				channel: params.channel,
				chatId: params.chatId,
				messageId: params.messageId,
				sessionId: ref.sessionId,
				sessionKey: ref.sessionKey,
				agentId: options?.agentId ?? params.agentId,
				durationMs: options?.durationMs ?? Date.now() - startedAtMs,
				outcome,
				reason: options?.reason,
				error: options?.error
			});
		}
	};
}
//#endregion
export { createDiagnosticMessageLifecycle as t };
