import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { t as capLiveAssistantText } from "./live-chat-projector-DYrwpcEg.mjs";
import { a as projectChatDisplayMessage } from "./chat-display-projection.core-BSNrSH5r.mjs";
import "./chat-display-projection-ZUh2mrnJ.mjs";
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
	if (unscopedOwnerAgentId && normalizeAgentId(unscopedOwnerAgentId) === scopedAgentId) keys.push(params.sessionKey);
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
	const deliveryKeys = params.opts?.sessionKeys ?? resolveChatSessionKeys({
		context: params.context,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (deliveryKeys[0]) {
		const opts = params.opts?.sessionKeys ? params.opts : {
			...params.opts,
			sessionKeys: deliveryKeys
		};
		params.context.nodeSendToSession(deliveryKeys[0], params.event, params.payload, opts);
	}
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
	const delivery = liveText ?? (group ? {
		group,
		settle: params.state === "final" || params.state === "error" ? true : void 0
	} : void 0);
	const opts = {
		...delivery ? { liveText: delivery } : {},
		...liveText ? { dropIfSlow: true } : {},
		sessionKeys: resolveChatSessionKeys({
			context: params.context,
			sessionKey: params.sessionKey,
			agentId: payloadAgentId
		})
	};
	params.context.broadcast("chat", payload, opts);
	sendGlobalAwareNodeChatPayload({
		context: params.context,
		sessionKey: params.sessionKey,
		agentId: payloadAgentId,
		event: "chat",
		payload,
		opts
	});
}
function broadcastChatDelta(params) {
	if (!params.isCurrent()) return;
	const text = capLiveAssistantText({ text: params.text });
	const run = params.context.chatRunState.getOrCreate(params.runId);
	run.buffer = text;
	run.bufferIsCurrent = params.isCurrent;
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
export { broadcastSideResult as a, resolveGlobalAwareNodeChatDeliveryKeys as c, broadcastChatTerminal as i, sendGlobalAwareNodeChatPayload as l, broadcastChatError as n, isBtwReplyPayload as o, broadcastChatFinal as r, isSourceReplyTranscriptMirrorPayload as s, broadcastChatDelta as t };
