import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as readTrimmedStringAlias } from "./string-readers-V5CfgPTP.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as resolveChannelPluginRegistration, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { u as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-C02sC3zd.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { n as normalizeOutboundLocation } from "./location-CxESZbHi.mjs";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { n as isMessageToolSendActionName } from "./message-action-names-cweW7syH.mjs";
import "./embedded-agent-messaging-BHfhPlTk.mjs";
import { n as resolveChannelThreadAddressing } from "./thread-addressing-BRMhsBnD.mjs";
import { s as projectPluginMessageDeliveryFact } from "./embedded-agent-message-delivery-DeQ0PPQm.mjs";
import { t as resolveReactionMessageId } from "./reaction-message-id-DT0v2AYr.mjs";
import { n as cancelRestartRecoveryTerminalDelivery, r as completeRestartRecoveryTerminalDelivery, t as beginRestartRecoveryTerminalDelivery } from "./restart-recovery-receipt-yGbLdybC.mjs";
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
function resolveSourceReplyTarget(params) {
	return readTrimmedStringAlias(params, [
		"target",
		"to",
		"channelId",
		"chatId"
	]);
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
/** Arms the fail-closed state before a terminal source reply can reach a provider. */
async function beginTerminalSourceReplyDelivery(params) {
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (params.sourceReplyFinal !== true) return;
	if (!toolCallId) throw new Error("terminal source reply requires tool-call correlation");
	if (!params.sessionId || !isCurrentSourceConversation(params)) return;
	const sourceTurnId = normalizeOptionalString(params.toolContext?.currentSourceTurnId);
	if (!sourceTurnId) return;
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	const receipt = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sourceTurnId,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		toolCallId
	};
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
	const deliveredMirror = {
		...params.mirror,
		deliveredPayload: params.deliveredPayload
	};
	if (!matchesDeliveredSourceTargets(deliveredMirror, deliveryFact) || !isCurrentSourceConversation(deliveredMirror, true)) return "not-source";
	await completeRestartRecoveryTerminalDelivery(params.receipt);
	return "delivered";
}
function hasCurrentSourceContext(params) {
	const toolContext = params.toolContext;
	if (!params.sessionKey?.trim() || !toolContext) return false;
	const accountId = normalizeOptionalString(params.accountId);
	if (accountId) {
		const currentAccountId = normalizeOptionalString(params.currentAccountId);
		if (!currentAccountId || normalizeAccountId(accountId) !== normalizeAccountId(currentAccountId)) return false;
	}
	const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
	return Boolean(currentChannel && currentChannel === normalizeOptionalLowercaseString(params.channel));
}
function matchesCurrentSourceTarget(params, threadPlacement, targetMode = "send") {
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const currentTargets = [normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target));
	if (currentTargets.length === 0 && targetMode === "send") return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (!requestedTarget) return false;
	if (threadPlacement === "mismatch") return false;
	const threadId = targetMode === "send" ? readTrimmedStringAlias(params.actionParams, ["threadId", "messageThreadId"]) : void 0;
	const threadedTarget = threadId ? normalizeOptionalString(getChannelPlugin(params.channel)?.threading?.resolveCurrentChannelId?.({
		to: requestedTarget,
		threadId
	})) ?? requestedTarget : requestedTarget;
	const plugin = getChannelPlugin(params.channel);
	const matchesToolContextTarget = plugin?.threading?.matchesToolContextTarget;
	if (threadPlacement === "match" && (matchesToolContextTarget?.({
		target: requestedTarget,
		toolContext
	}) || threadedTarget !== requestedTarget && matchesToolContextTarget?.({
		target: threadedTarget,
		toolContext
	}))) return true;
	const normalize = (target) => normalizeTargetForProvider(params.channel, target, plugin) ?? (targetMode === "reply" ? target : void 0);
	const normalizedTargets = new Set((targetMode === "reply" ? [requestedTarget] : [requestedTarget, threadedTarget]).map(normalize).filter((target) => target !== void 0 && (targetMode === "reply" || Boolean(target))));
	return currentTargets.some((target) => {
		const normalized = normalize(target);
		return normalized !== void 0 && normalizedTargets.has(normalized);
	});
}
function matchesDeliveredSourceTargets(params, delivery) {
	const receipt = resolveDeliveryReceipt(params);
	const deliveredThreadId = normalizeOptionalString(receipt?.threadId);
	const currentThreadId = normalizeOptionalString(params.toolContext?.currentThreadTs);
	if (Array.isArray(receipt?.parts) && receipt.parts.some((part) => {
		const threadId = normalizeOptionalString(asOptionalRecord(part)?.threadId);
		return threadId !== void 0 && threadId !== (deliveredThreadId ?? currentThreadId);
	})) return false;
	return (delivery?.deliveredTargets ?? []).every((target) => matchesCurrentSourceTarget({
		...params,
		actionParams: {
			target,
			...deliveredThreadId ? { threadId: deliveredThreadId } : {}
		}
	}, "match"));
}
function isCurrentSourceConversation(params, requireExactThread = false) {
	if (params.action !== "send" && params.action !== "poll" || !hasCurrentSourceContext(params)) return false;
	const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
	return (!requireExactThread || threadPlacement === "match") && matchesCurrentSourceTarget(params, threadPlacement);
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
	if (deliveryFact && deliveryFact.status !== "settled" || !matchesDeliveredSourceTargets(params, deliveryFact)) return false;
	switch (params.action.trim().toLowerCase()) {
		case "react": return params.sourceReplyFinal === true && params.actionParams.remove !== true && Boolean(normalizeOptionalString(params.actionParams.emoji)) && isDeliveredCurrentSourceReplyAction(params);
		case "reply": return isDeliveredCurrentSourceReplyAction(params);
		case "thread-reply": return resolveDeliveredThreadPlacementSourceReply(params, allowAsync);
		default: return (isMessageToolSendActionName(params.action) || params.action === "poll") && isCurrentSourceConversation({
			...params,
			action: "send"
		}, true);
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
* Confirms a reply or explicitly terminal reaction addressed the message that triggered
* the current run. Reply actions resolve their conversation from the replied-to message,
* so target matching cannot apply; replying to the run's own inbound message is the
* one implicit route that provably lands in the current source conversation.
*/
function isDeliveredCurrentSourceReplyAction(params) {
	const toolContext = params.toolContext;
	if (!toolContext || !hasCurrentSourceContext(params)) return false;
	if (resolveSourceReplyTarget(params.actionParams) && !matchesCurrentSourceTarget(params, "match", "reply")) return false;
	const repliedToMessageId = normalizeMessageIdValue(params.action === "react" ? resolveReactionMessageId({
		args: params.actionParams,
		toolContext
	}) : params.actionParams.messageId ?? params.actionParams.replyTo);
	const currentMessageId = normalizeMessageIdValue(toolContext.currentMessageId);
	return Boolean(repliedToMessageId && currentMessageId && repliedToMessageId === currentMessageId);
}
/** Mirrors successful outbound source replies into the owning session transcript. */
async function mirrorDeliveredSourceReplyToTranscript(params) {
	const deliveryFact = projectPluginMessageDeliveryFact(params.deliveredPayload);
	if (deliveryFact && (deliveryFact.status !== "settled" || deliveryFact.partialDelivery) || !matchesDeliveredSourceTargets(params, deliveryFact) || !isCurrentSourceConversation(params, params.sourceReplyFinal === true)) return false;
	const plan = createOutboundPayloadPlan([{
		text: readTrimmedStringAlias(params.actionParams, [
			"message",
			"content",
			"text",
			"caption"
		]) ?? "",
		mediaUrl: readTrimmedStringAlias(params.actionParams, [
			"mediaUrl",
			"media",
			"path",
			"filePath",
			"fileUrl"
		]),
		mediaUrls: normalizeOptionalTrimmedStringList(params.actionParams.mediaUrls),
		presentation: params.actionParams.presentation,
		interactive: params.actionParams.interactive,
		channelData: params.actionParams.channelData,
		location: normalizeOutboundLocation(params.actionParams.location)
	}]);
	const mirror = projectOutboundPayloadPlanForMirror(plan);
	if (!mirror.text && mirror.mediaUrls.length === 0) return false;
	const sourceTurnId = normalizeOptionalString(params.toolContext?.currentSourceTurnId);
	const writerFence = getOwnedSessionTranscriptWriterFence({ sessionKey: params.sessionKey });
	return (await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.sessionId ? { expectedSessionId: params.sessionId } : {},
		...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
		...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
		text: mirror.text,
		mediaUrls: mirror.mediaUrls.length ? mirror.mediaUrls : void 0,
		idempotencyKey: params.sourceReplyFinal === true && params.idempotencyKey && sourceTurnId ? `${params.idempotencyKey}:terminal-receipt:${sourceTurnId}` : params.idempotencyKey,
		...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
			kind: "message-tool-source-reply",
			final: params.sourceReplyFinal,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {},
			...sourceTurnId ? { sourceTurnId } : {}
		} } : {},
		config: params.cfg
	})).ok;
}
//#endregion
export { mirrorDeliveredSourceReplyToTranscript as a, isDeliveredCurrentSourceReplyAsync as i, cancelTerminalSourceReplyDelivery as n, reconcileTerminalSourceReplyDelivery as o, isDeliveredCurrentSourceReply as r, beginTerminalSourceReplyDelivery as t };
