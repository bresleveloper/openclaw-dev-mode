import { o as isNativeAppUiClient } from "./client-info-BgcoFakQ.mjs";
import { s as isOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/chat-server-timing.ts
function roundedChatSendTimingMs(value) {
	return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function prepareChatSendAckTiming({ client, request: { clientInfo, chatSendReceivedAtMs }, session: { sessionLoadMs }, prepareAttachmentsMs, chatSendTraceAttributes }) {
	const serverTiming = isOperatorUiClient(clientInfo) ? {
		receivedToAckMs: roundedChatSendTimingMs(performance.now() - chatSendReceivedAtMs),
		loadSessionMs: sessionLoadMs,
		...prepareAttachmentsMs !== void 0 ? { prepareAttachmentsMs } : {}
	} : void 0;
	return {
		serverTiming,
		chatSendTiming: serverTiming && typeof client?.connId === "string" && client.connId.trim() ? {
			ackedAtMs: performance.now(),
			connId: client.connId.trim(),
			receivedAtMs: chatSendReceivedAtMs
		} : void 0,
		ackReadyEvent: (ackStatus) => ({
			type: "mark",
			name: "gateway.chat_send.ack_ready",
			phase: "agent-turn",
			attributes: {
				...chatSendTraceAttributes,
				ackStatus,
				...serverTiming ? {
					serverReceivedToAckMs: serverTiming.receivedToAckMs,
					serverLoadSessionMs: serverTiming.loadSessionMs,
					...serverTiming.prepareAttachmentsMs !== void 0 ? { serverPrepareAttachmentsMs: serverTiming.prepareAttachmentsMs } : {}
				} : {}
			}
		})
	};
}
const CONTROL_UI_RECONNECT_RESUME_PARAM = "__controlUiReconnectResume";
function resolveControlUiReconnectResumeParams(params, clientInfo) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return {
		params,
		resumeRequested: false
	};
	const record = params;
	if (!(record[CONTROL_UI_RECONNECT_RESUME_PARAM] === true && (isOperatorUiClient(clientInfo) || isNativeAppUiClient(clientInfo)))) return {
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
function createOperatorChatSendServerTiming({ context, client, request: { chatSendReceivedAtMs: receivedAtMs }, session: { clientRunId: runId, sessionKey, agentId }, timing: { chatSendAckedAtMs: ackedAtMs, chatSendTiming } }) {
	const startedAtMs = performance.now();
	if (chatSendTiming) chatSendTiming.dispatchStartedAtMs = startedAtMs;
	const connId = client?.connId?.trim();
	const recipients = connId && isOperatorUiClient(client?.connect?.client) ? /* @__PURE__ */ new Set([connId]) : void 0;
	const assistantTiming = chatSendTiming ?? { firstAssistantEventSent: false };
	const emit = (phase, extra, dispatchStartedAtMs) => {
		if (!recipients) return;
		const nowMs = performance.now();
		context.broadcastToConnIds("chat.send_timing", {
			phase,
			runId,
			sessionKey,
			...agentId ? { agentId } : {},
			ackToPhaseMs: roundedChatSendTimingMs(nowMs - ackedAtMs),
			receivedToPhaseMs: roundedChatSendTimingMs(nowMs - receivedAtMs),
			...dispatchStartedAtMs !== void 0 ? { dispatchStartedToPhaseMs: roundedChatSendTimingMs(nowMs - dispatchStartedAtMs) } : {},
			...extra
		}, recipients, { dropIfSlow: true });
	};
	return {
		emit,
		dispatchStartedAtMs: startedAtMs,
		emitFirstAssistant: () => {
			if (assistantTiming.firstAssistantEventSent) return;
			assistantTiming.firstAssistantEventSent = true;
			emit("first-assistant-event", void 0, startedAtMs);
		}
	};
}
//#endregion
export { roundedChatSendTimingMs as i, prepareChatSendAckTiming as n, resolveControlUiReconnectResumeParams as r, createOperatorChatSendServerTiming as t };
