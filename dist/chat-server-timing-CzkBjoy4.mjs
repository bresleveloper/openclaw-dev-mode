import { s as isOperatorUiClient } from "./message-channel-DDcHHhpX.mjs";
//#region src/gateway/server-methods/chat-server-timing.ts
function roundedChatSendTimingMs(value) {
	return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function chatSendAckServerTimingAttributes(timing) {
	if (!timing) return {};
	return {
		serverReceivedToAckMs: timing.receivedToAckMs,
		serverLoadSessionMs: timing.loadSessionMs,
		...timing.prepareAttachmentsMs !== void 0 ? { serverPrepareAttachmentsMs: timing.prepareAttachmentsMs } : {}
	};
}
function shouldIncludeChatSendAckServerTiming(client) {
	return isOperatorUiClient(client);
}
const CONTROL_UI_RECONNECT_RESUME_PARAM = "__controlUiReconnectResume";
function resolveControlUiReconnectResumeParams(params, clientInfo) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return {
		params,
		resumeRequested: false
	};
	const record = params;
	if (!(record[CONTROL_UI_RECONNECT_RESUME_PARAM] === true && isOperatorUiClient(clientInfo))) return {
		params,
		resumeRequested: false
	};
	const validatedParams = { ...record };
	delete validatedParams[CONTROL_UI_RECONNECT_RESUME_PARAM];
	return {
		params: validatedParams,
		resumeRequested: true
	};
}
function emitOperatorChatSendServerTiming(params) {
	const connId = typeof params.client?.connId === "string" && params.client.connId.trim() ? params.client.connId.trim() : void 0;
	if (!connId || !isOperatorUiClient(params.client?.connect?.client)) return;
	const nowMs = performance.now();
	params.context.broadcastToConnIds("chat.send_timing", {
		phase: params.phase,
		runId: params.runId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		ackToPhaseMs: roundedChatSendTimingMs(nowMs - params.ackedAtMs),
		receivedToPhaseMs: roundedChatSendTimingMs(nowMs - params.receivedAtMs),
		...params.dispatchStartedAtMs !== void 0 ? { dispatchStartedToPhaseMs: roundedChatSendTimingMs(nowMs - params.dispatchStartedAtMs) } : {},
		...params.extra
	}, /* @__PURE__ */ new Set([connId]), { dropIfSlow: true });
}
//#endregion
export { shouldIncludeChatSendAckServerTiming as a, roundedChatSendTimingMs as i, emitOperatorChatSendServerTiming as n, resolveControlUiReconnectResumeParams as r, chatSendAckServerTimingAttributes as t };
