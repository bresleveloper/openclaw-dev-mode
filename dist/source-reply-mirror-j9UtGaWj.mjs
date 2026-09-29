import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-Dkx3Z36w.mjs";
import { s as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { a as resolveChannelPluginRegistration, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { r as resolveChannelThreadAddressing } from "./thread-addressing-BePl-7CH.mjs";
import "./sessions-DE4llkPV.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DgtCkbrJ.mjs";
import { n as normalizeOutboundLocation } from "./location-Ce8_SVWn.mjs";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { s as projectPluginMessageDeliveryFact } from "./embedded-agent-message-delivery-BkG-vmHL.mjs";
import { n as cancelRestartRecoveryTerminalDelivery, r as completeRestartRecoveryTerminalDelivery, t as beginRestartRecoveryTerminalDelivery } from "./restart-recovery-receipt-BVd0-uYN.mjs";
//#region src/infra/outbound/source-reply-mirror.ts
function buildTerminalSourceReplyNoSendResult(outcome) {
	return {
		outcome,
		result: {
			status: outcome,
			delivered: false,
			message: outcome === "already_delivered" ? "The completed reply was already delivered. Do not retry it." : "The completed reply may already have been delivered. Do not retry it."
		}
	};
}
function readStringArray(value) {
	return normalizeOptionalTrimmedStringList(value);
}
function readFirstString(params, keys) {
	return readTrimmedStringAlias(params, keys);
}
function resolveSourceReplyTarget(params) {
	return readFirstString(params, [
		"target",
		"to",
		"channelId",
		"chatId"
	]);
}
function resolveSourceReplyThreadId(params) {
	return readFirstString(params.actionParams, ["threadId", "messageThreadId"]);
}
function resolveDeliveryReceipt(params) {
	const payload = asOptionalRecord(params.deliveredPayload);
	const result = asOptionalRecord(payload?.result);
	return asOptionalRecord(result?.receipt) ?? asOptionalRecord(payload?.receipt);
}
function resolveDeliveredThreadPlacement(params, currentThreadId) {
	const receipt = resolveDeliveryReceipt(params);
	if (!receipt) return;
	const deliveredThreadId = normalizeOptionalString(receipt.threadId);
	if (deliveredThreadId) return deliveredThreadId === currentThreadId ? "match" : "mismatch";
	const deliveredReplyToId = normalizeOptionalString(receipt.replyToId);
	if (deliveredReplyToId) {
		const currentMessageId = normalizeMessageIdValue(params.toolContext?.currentMessageId);
		return deliveredReplyToId === currentThreadId || deliveredReplyToId === currentMessageId ? "match" : "mismatch";
	}
	return currentThreadId ? "mismatch" : "match";
}
function resolveSourceReplyThreadPlacement(params, threadAddressing) {
	const currentThreadId = normalizeOptionalString(params.toolContext?.currentThreadTs);
	const deliveredPlacement = resolveDeliveredThreadPlacement(params, currentThreadId);
	if (deliveredPlacement) return deliveredPlacement;
	if (params.actionParams.topLevel === true) return currentThreadId ? "mismatch" : "match";
	if (threadAddressing === "message" && params.replyToIsExplicit === true && !currentThreadId && normalizeOptionalString(params.actionParams.replyTo)) return "mismatch";
	for (const key of ["threadId", "messageThreadId"]) {
		if (!Object.hasOwn(params.actionParams, key)) continue;
		const explicitThreadId = normalizeOptionalString(params.actionParams[key]);
		if (!explicitThreadId) return currentThreadId ? "mismatch" : "match";
		return explicitThreadId === currentThreadId ? "match" : "mismatch";
	}
	return currentThreadId ? "unknown" : "match";
}
function resolveThreadedSourceTarget(params, requestedTarget) {
	const threadId = resolveSourceReplyThreadId(params);
	if (!threadId) return requestedTarget;
	return normalizeOptionalString(getChannelPlugin(params.channel)?.threading?.resolveCurrentChannelId?.({
		to: requestedTarget,
		threadId
	})) ?? requestedTarget;
}
function resolveCurrentSourceTurnId(toolContext) {
	return normalizeOptionalString(toolContext?.currentSourceTurnId);
}
function resolveTerminalSourceReplyDeliveryReceipt(params) {
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (params.sourceReplyFinal !== true) return;
	if (!toolCallId) throw new Error("terminal source reply requires tool-call correlation");
	if (!params.sessionId || !isCurrentSourceConversation(params)) return;
	const sourceTurnId = resolveCurrentSourceTurnId(params.toolContext);
	if (!sourceTurnId) return;
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sourceTurnId,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		toolCallId
	};
}
/** Arms the fail-closed state before a terminal source reply can reach a provider. */
async function beginTerminalSourceReplyDelivery(params) {
	const receipt = resolveTerminalSourceReplyDeliveryReceipt(params);
	if (!receipt) return;
	const result = await beginRestartRecoveryTerminalDelivery(receipt);
	if (result === "not-applicable") return;
	if (result === "already-delivered") return buildTerminalSourceReplyNoSendResult("already_delivered");
	if (result === "delivery-ambiguous" || result === "stale") return buildTerminalSourceReplyNoSendResult("delivery_ambiguous");
	return receipt;
}
/** Cancels a pre-send intent only when dispatch proved that no send occurred. */
async function cancelTerminalSourceReplyDelivery(receipt) {
	if (receipt) await cancelRestartRecoveryTerminalDelivery(receipt);
}
/** Reconciles the provider result while an unresolved intent remains fail closed. */
async function reconcileTerminalSourceReplyDelivery(params) {
	if (!params.receipt) return "not-applicable";
	const deliveryFact = projectPluginMessageDeliveryFact(params.deliveredPayload);
	if (deliveryFact && deliveryFact.status !== "settled") {
		if (params.preservePendingOnExplicitFailure) return "pending";
		await cancelRestartRecoveryTerminalDelivery(params.receipt);
		return "not-delivered";
	}
	if (!isExactCurrentSourceConversation({
		...params.mirror,
		deliveredPayload: params.deliveredPayload
	})) return "not-source";
	await completeRestartRecoveryTerminalDelivery(params.receipt);
	return "delivered";
}
function resolveTranscriptMirrorIdempotencyKey(params) {
	if (params.sourceReplyFinal !== true || !params.idempotencyKey || !params.sourceTurnId) return params.idempotencyKey;
	return `${params.idempotencyKey}:terminal-receipt:${params.sourceTurnId}`;
}
function hasCurrentSourceContext(params) {
	if (!params.sessionKey?.trim()) return false;
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const accountId = normalizeOptionalString(params.accountId);
	if (accountId) {
		const currentAccountId = normalizeOptionalString(params.currentAccountId);
		if (!currentAccountId || normalizeAccountId(accountId) !== normalizeAccountId(currentAccountId)) return false;
	}
	const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
	if (!currentChannel || currentChannel !== normalizeOptionalLowercaseString(params.channel)) return false;
	return true;
}
function matchesCurrentSourceTarget(params, threadPlacement) {
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const currentTargets = [normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target));
	if (currentTargets.length === 0) return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (!requestedTarget) return false;
	if (threadPlacement === "mismatch") return false;
	const threadedTarget = resolveThreadedSourceTarget(params, requestedTarget);
	const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget;
	if (threadPlacement === "match" && (matchesToolContextTarget?.({
		target: requestedTarget,
		toolContext
	}) || threadedTarget !== requestedTarget && matchesToolContextTarget?.({
		target: threadedTarget,
		toolContext
	}))) return true;
	return currentTargets.some((currentTarget) => requestedTarget === currentTarget || threadedTarget === currentTarget);
}
function isCurrentSourceConversation(params) {
	if (params.action !== "send" && params.action !== "poll") return false;
	if (!hasCurrentSourceContext(params)) return false;
	return matchesCurrentSourceTarget(params, resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel)));
}
function isExactCurrentSourceConversation(params) {
	return resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel)) === "match" && isCurrentSourceConversation(params);
}
function resolveOwnerCurrentConversationMatch(params, allowAsync) {
	const toolContext = params.toolContext;
	if (!toolContext) return;
	const channel = params.channel;
	const registration = resolveChannelPluginRegistration(channel);
	if (registration?.origin !== "bundled") return;
	const aliasSpec = registration.plugin.actions?.messageActionTargetAliases?.[params.action];
	if (!aliasSpec) return;
	const matchParams = {
		args: params.actionParams,
		accountId: normalizeAccountId(params.accountId ?? params.currentAccountId),
		toolContext
	};
	const matchAsync = aliasSpec.matchesCurrentConversationAsync;
	if (allowAsync && matchAsync) {
		const authority = registration.captureReadAuthority?.();
		const isRegistrationCurrent = () => {
			const current = registration.captureReadAuthority && !authority?.() ? void 0 : resolveChannelPluginRegistration(channel, { loadedOnly: true });
			return current?.plugin === registration.plugin && current.origin === "bundled";
		};
		if (!isRegistrationCurrent()) return false;
		return async () => await matchAsync(matchParams) && isRegistrationCurrent();
	}
	return aliasSpec.matchesCurrentConversation?.(matchParams) === true;
}
function resolveDeliveredThreadPlacementSourceReply(params, allowAsync) {
	if (!hasCurrentSourceContext(params)) return false;
	const receipt = resolveDeliveryReceipt(params);
	if (normalizeOptionalString(receipt?.threadId) || normalizeOptionalString(receipt?.replyToId)) {
		const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
		return threadPlacement === "match" && matchesCurrentSourceTarget(params, threadPlacement);
	}
	return resolveOwnerCurrentConversationMatch(params, allowAsync) ?? false;
}
function resolveDeliveredCurrentSourceReply(params, allowAsync) {
	const deliveryFact = projectPluginMessageDeliveryFact(params.deliveredPayload);
	if (deliveryFact && deliveryFact.status !== "settled") return false;
	switch (params.action.trim().toLowerCase()) {
		case "reply": return isDeliveredCurrentSourceReplyAction(params);
		case "thread-reply": return resolveDeliveredThreadPlacementSourceReply(params, allowAsync);
		default: return (params.action === "send" || params.action === "poll") && isExactCurrentSourceConversation(params);
	}
}
/** Synchronous classification for send-only consumers and legacy owner callbacks. */
function isDeliveredCurrentSourceReply(params) {
	return resolveDeliveredCurrentSourceReply(params, false) === true;
}
/** Confirms delivered source replies, awaiting bundled thread-alias proof when needed. */
async function isDeliveredCurrentSourceReplyAsync(params) {
	const match = resolveDeliveredCurrentSourceReply(params, true);
	return typeof match === "function" ? await match() : match;
}
function normalizeMessageIdValue(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeOptionalString(value);
}
/**
* Confirms a successful reply-type action addressed the message that triggered the
* current run. Reply actions resolve their conversation from the replied-to message,
* so target matching cannot apply; replying to the run's own inbound message is the
* one implicit route that provably lands in the current source conversation.
*/
function isDeliveredCurrentSourceReplyAction(params) {
	const toolContext = params.toolContext;
	if (!toolContext || !hasCurrentSourceContext(params)) return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (requestedTarget) {
		const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget;
		if (!matchesToolContextTarget?.({
			target: requestedTarget,
			toolContext
		})) {
			if (![normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target)).some((target) => target === requestedTarget)) return false;
		}
	}
	const repliedToMessageId = normalizeMessageIdValue(params.actionParams.messageId ?? params.actionParams.replyTo);
	const currentMessageId = normalizeMessageIdValue(toolContext.currentMessageId);
	return Boolean(repliedToMessageId && currentMessageId && repliedToMessageId === currentMessageId);
}
/** Mirrors successful outbound source replies into the owning session transcript. */
async function mirrorDeliveredSourceReplyToTranscript(params) {
	const deliveryFact = projectPluginMessageDeliveryFact(params.deliveredPayload);
	if (deliveryFact && (deliveryFact.status !== "settled" || deliveryFact.partialDelivery)) return false;
	const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
	if (!isCurrentSourceConversation(params)) return false;
	if (params.sourceReplyFinal === true && threadPlacement !== "match") return false;
	const plan = createOutboundPayloadPlan([{
		text: readFirstString(params.actionParams, [
			"message",
			"content",
			"text",
			"caption"
		]) ?? "",
		mediaUrl: readFirstString(params.actionParams, [
			"mediaUrl",
			"media",
			"path",
			"filePath",
			"fileUrl"
		]),
		mediaUrls: readStringArray(params.actionParams.mediaUrls),
		presentation: params.actionParams.presentation,
		interactive: params.actionParams.interactive,
		channelData: params.actionParams.channelData,
		location: normalizeOutboundLocation(params.actionParams.location)
	}]);
	const mirror = projectOutboundPayloadPlanForMirror(plan);
	if (!mirror.text && mirror.mediaUrls.length === 0) return false;
	const sourceTurnId = resolveCurrentSourceTurnId(params.toolContext);
	const writerFence = getOwnedSessionTranscriptWriterFence({ sessionKey: params.sessionKey });
	if ((await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.sessionId ? { expectedSessionId: params.sessionId } : {},
		...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
		...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
		text: mirror.text,
		mediaUrls: mirror.mediaUrls.length ? mirror.mediaUrls : void 0,
		idempotencyKey: resolveTranscriptMirrorIdempotencyKey({
			idempotencyKey: params.idempotencyKey,
			sourceReplyFinal: params.sourceReplyFinal,
			sourceTurnId
		}),
		...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
			kind: "message-tool-source-reply",
			final: params.sourceReplyFinal,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {},
			...sourceTurnId ? { sourceTurnId } : {}
		} } : {},
		config: params.cfg
	})).ok) return true;
	return false;
}
//#endregion
export { mirrorDeliveredSourceReplyToTranscript as a, isDeliveredCurrentSourceReplyAsync as i, cancelTerminalSourceReplyDelivery as n, reconcileTerminalSourceReplyDelivery as o, isDeliveredCurrentSourceReply as r, beginTerminalSourceReplyDelivery as t };
