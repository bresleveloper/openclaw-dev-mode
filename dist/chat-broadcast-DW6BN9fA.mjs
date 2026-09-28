import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { c as getAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { s as capLiveAssistantText } from "./server-chat-state-DfVYc1CX.mjs";
import { i as projectChatDisplayMessage } from "./chat-display-projection.core-DpiCCyQ3.mjs";
import "./chat-display-projection-ON0OJ8aM.mjs";
//#region src/gateway/chat-input-sanitize.ts
const DISALLOWED_CHAT_CONTROL_RANGE = `${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}`;
const DISALLOWED_CHAT_CONTROL_RE = new RegExp(`[${DISALLOWED_CHAT_CONTROL_RANGE}]`, "g");
/** Drop disallowed control characters while preserving tab, line breaks, and Unicode. */
function stripDisallowedChatControlChars(message) {
	return message.replace(DISALLOWED_CHAT_CONTROL_RE, "");
}
/** Normalize chat text and reject null bytes before routing to channels. */
function sanitizeChatSendMessageInput(message) {
	const normalized = message.normalize("NFC");
	if (normalized.includes("\0")) return {
		ok: false,
		error: "message must not contain null bytes"
	};
	return {
		ok: true,
		message: stripDisallowedChatControlChars(normalized)
	};
}
//#endregion
//#region src/gateway/server-methods/chat-broadcast.ts
function nextChatSeq(context, runId) {
	const next = (context.agentRunSeq.get(runId) ?? 0) + 1;
	context.agentRunSeq.set(runId, next);
	return next;
}
function resolveGlobalAwareNodeChatDeliveryKeys(params) {
	if (parseAgentSessionKey(params.sessionKey)) return [params.sessionKey];
	const unscopedOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(params.cfg, params.sessionKey);
	const selectedAgentId = params.agentId ?? unscopedOwnerAgentId;
	if (!selectedAgentId) return [params.sessionKey];
	const scopedAgentId = normalizeAgentId(selectedAgentId);
	const keys = [`agent:${scopedAgentId}:${params.sessionKey}`];
	if (unscopedOwnerAgentId && normalizeAgentId(unscopedOwnerAgentId) === normalizeAgentId(scopedAgentId)) keys.push(params.sessionKey);
	return keys;
}
function resolveChatSessionKeys(params) {
	return resolveGlobalAwareNodeChatDeliveryKeys({
		cfg: params.context.getRuntimeConfig?.() ?? {},
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
}
function sendGlobalAwareNodeChatPayload(params) {
	const deliveryKeys = resolveChatSessionKeys({
		context: params.context,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	for (const deliveryKey of deliveryKeys) params.context.nodeSendToSession(deliveryKey, params.event, params.payload);
}
function broadcastChatFrame(params, liveText) {
	const visibility = getAgentRunContext(params.runId);
	if (visibility?.isControlUiVisible === false && visibility.projectSessionMessages === false) return;
	const seq = nextChatSeq(params.context, params.runId);
	const payloadAgentId = parseAgentSessionKey(params.sessionKey) ? void 0 : params.agentId;
	const frame = params.state === "delta" ? {
		state: params.state,
		deltaText: params.text,
		replace: true,
		message: projectChatDisplayMessage({
			role: "assistant",
			content: [{
				type: "text",
				text: params.text
			}]
		})
	} : params.state !== "error" ? {
		state: params.state,
		message: projectChatDisplayMessage(params.message),
		...params.stopReason ? { stopReason: params.stopReason } : {}
	} : {
		state: params.state,
		errorMessage: params.errorMessage,
		...params.stopReason ? { stopReason: params.stopReason } : {},
		...params.errorKind ? { errorKind: params.errorKind } : {}
	};
	const payload = {
		runId: params.runId,
		sessionKey: params.sessionKey,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq,
		...frame
	};
	const group = params.context.chatRunState?.runs.get(params.runId)?.liveTextGroup?.signal;
	params.context.broadcast("chat", payload, {
		...liveText ? {
			liveText,
			dropIfSlow: true
		} : group ? { liveText: { group } } : {},
		sessionKeys: resolveChatSessionKeys({
			context: params.context,
			sessionKey: params.sessionKey,
			agentId: payloadAgentId
		})
	});
	sendGlobalAwareNodeChatPayload({
		context: params.context,
		sessionKey: params.sessionKey,
		agentId: payloadAgentId,
		event: "chat",
		payload
	});
}
function broadcastChatDelta(params) {
	if (!params.isCurrent()) return;
	const text = capLiveAssistantText({ text: params.text });
	const run = params.context.chatRunState.getOrCreate(params.runId);
	run.buffer = text;
	run.bufferIsCurrent = params.isCurrent;
	run.bufferUpdatedAt = Date.now();
	run.liveTextGroup ??= new AbortController();
	broadcastChatFrame({
		...params,
		state: "delta",
		text
	}, {
		group: run.liveTextGroup.signal,
		isCurrent: params.isCurrent,
		coalesce: {
			key: JSON.stringify([
				"chat",
				params.sessionKey,
				params.agentId
			]),
			merge: (_previous, next) => next
		}
	});
}
function broadcastChatTerminal(params) {
	broadcastChatFrame(params);
	params.context.agentRunSeq.delete(params.runId);
}
function broadcastChatFinal(params) {
	broadcastChatTerminal({
		...params,
		state: "final"
	});
}
function isBtwReplyPayload(payload) {
	return typeof payload?.btw?.question === "string" && payload.btw.question.trim().length > 0 && typeof payload.text === "string" && payload.text.trim().length > 0;
}
function broadcastSideResult(params) {
	const seq = nextChatSeq(params.context, params.payload.runId);
	const payloadAgentId = parseAgentSessionKey(params.payload.sessionKey) ? void 0 : params.payload.agentId;
	const payload = {
		...params.payload,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq
	};
	params.context.broadcast("chat.side_result", payload, { sessionKeys: resolveChatSessionKeys({
		context: params.context,
		sessionKey: params.payload.sessionKey,
		agentId: payloadAgentId
	}) });
	sendGlobalAwareNodeChatPayload({
		context: params.context,
		sessionKey: params.payload.sessionKey,
		agentId: payloadAgentId,
		event: "chat.side_result",
		payload
	});
}
function broadcastChatError(params) {
	broadcastChatTerminal({
		...params,
		state: "error"
	});
}
function isSourceReplyTranscriptMirrorPayload(payload) {
	return Boolean(payload && getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror);
}
//#endregion
export { broadcastSideResult as a, resolveGlobalAwareNodeChatDeliveryKeys as c, broadcastChatTerminal as i, sendGlobalAwareNodeChatPayload as l, broadcastChatError as n, isBtwReplyPayload as o, broadcastChatFinal as r, isSourceReplyTranscriptMirrorPayload as s, broadcastChatDelta as t, sanitizeChatSendMessageInput as u };
