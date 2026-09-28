import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { a as normalizeTargetForProvider } from "./target-normalization-DqKkj4kz.mjs";
//#region src/infra/outbound/source-delivery-plan.ts
function isMessageToolOwnedDelivery(owner) {
	return owner === "message_tool" || owner === "message_tool_then_direct_fallback";
}
function normalizeDeliveryTarget(channel, to) {
	const toTrimmed = to.trim();
	return normalizeTargetForProvider(channel, toTrimmed) ?? toTrimmed;
}
function deliveryTargetsMatch(channel, targetTo, deliveryTo) {
	const targetToTrimmed = targetTo.trim();
	const deliveryToTrimmed = deliveryTo.trim();
	if (targetToTrimmed === deliveryToTrimmed) return true;
	const targetPrefixed = targetToTrimmed.match(/^([a-z][a-z0-9_-]*):(.*)$/i);
	const deliveryPrefixed = deliveryToTrimmed.match(/^([a-z][a-z0-9_-]*):(.*)$/i);
	const targetKind = targetPrefixed?.[1]?.toLowerCase();
	const deliveryKind = deliveryPrefixed?.[1]?.toLowerCase();
	if (targetKind && targetKind === deliveryKind && [
		"channel",
		"conversation",
		"group",
		"user"
	].includes(targetKind)) {
		const targetId = targetPrefixed?.[2]?.trim();
		const deliveryId = deliveryPrefixed?.[2]?.trim();
		const comparison = getChannelPlugin(channel)?.messaging?.targetIdComparison;
		if (comparison === "case-sensitive") return targetId === deliveryId;
		if (comparison === "lowercase") return targetId?.toLowerCase() === deliveryId?.toLowerCase();
	}
	return normalizeDeliveryTarget(channel, targetToTrimmed) === normalizeDeliveryTarget(channel, deliveryToTrimmed);
}
function normalizeDeliveryThreadId(threadId) {
	return stringifyRouteThreadId(threadId)?.trim() || void 0;
}
const TOPIC_THREAD_SUFFIX = /:topic:(\d+)$/i;
/** Compares a message-tool target with the required source delivery target. */
function sourceDeliveryTargetsMatch(target, delivery) {
	if (!delivery.channel || !delivery.to || !target.to) return false;
	const channel = delivery.channel.trim().toLowerCase();
	const provider = target.provider?.trim().toLowerCase();
	if (provider && provider !== "message" && provider !== channel) return false;
	if (delivery.accountId && target.accountId && target.accountId !== delivery.accountId) return false;
	const targetTo = target.to.trim();
	const deliveryTo = delivery.to.trim();
	const targetTopic = TOPIC_THREAD_SUFFIX.exec(targetTo);
	const deliveryTopic = TOPIC_THREAD_SUFFIX.exec(deliveryTo);
	if (!deliveryTargetsMatch(channel, targetTopic ? targetTo.slice(0, targetTopic.index) : targetTo, deliveryTopic ? deliveryTo.slice(0, deliveryTopic.index) : deliveryTo)) return false;
	const deliveryThreadId = normalizeDeliveryThreadId(delivery.threadId) ?? deliveryTopic?.[1];
	const targetThreadId = normalizeDeliveryThreadId(target.threadId) ?? targetTopic?.[1];
	if (!deliveryThreadId && !targetThreadId) return true;
	if (deliveryThreadId && !targetThreadId) return target.threadImplicit === true && target.threadSuppressed !== true;
	return deliveryThreadId === targetThreadId;
}
/** Builds a source delivery plan from ownership and fallback inputs. */
function createSourceDeliveryPlan(params) {
	const messageToolOwnsDelivery = isMessageToolOwnedDelivery(params.owner);
	const sourceReplyDeliveryMode = messageToolOwnsDelivery ? "message_tool_only" : void 0;
	const directDelivery = params.directFallback ?? (params.owner === "direct_fallback" || params.owner === "message_tool_then_direct_fallback");
	return {
		owner: params.owner,
		reason: params.reason,
		target: params.target ?? {},
		normalFinal: sourceReplyDeliveryMode === "message_tool_only" || params.owner === "none" ? "private" : "visible",
		sourceReplyDeliveryMode,
		messageTool: {
			enabled: params.messageToolEnabled ?? messageToolOwnsDelivery,
			force: params.messageToolForced ?? messageToolOwnsDelivery,
			requireExplicitTarget: params.requireExplicitMessageTarget ?? false,
			requireExplicitTargetEvidence: params.requireExplicitMessageTargetEvidence ?? false,
			defaultTarget: Boolean(params.target?.channel || params.target?.to)
		},
		fallback: {
			directDelivery,
			skipWhenMessageToolSentToTarget: params.skipFallbackWhenMessageToolSentToTarget ?? params.owner === "message_tool_then_direct_fallback",
			bestEffort: params.fallbackBestEffort ?? false
		},
		progress: { allowCallbacksWhenSourceDeliverySuppressed: params.allowProgressCallbacksWhenSourceDeliverySuppressed ?? false }
	};
}
function resolveImplicitMessageToolDeliveryTarget(plan) {
	if (!plan.target.channel || !plan.target.to) return;
	const threadId = stringifyRouteThreadId(plan.target.threadId);
	return {
		tool: "message",
		provider: plan.target.channel,
		...plan.target.accountId ? { accountId: plan.target.accountId } : {},
		...plan.target.to ? { to: plan.target.to } : {},
		...threadId ? { threadId } : {}
	};
}
/** Evaluates whether observed message-tool sends satisfy the source delivery plan. */
function resolveSourceDeliveryOutcome(plan, params) {
	const didSendViaMessageTool = params.didSendViaMessageTool === true;
	const explicitTargets = params.messageToolSentTargets ?? [];
	const sentTargets = explicitTargets.length > 0 ? explicitTargets : didSendViaMessageTool && !plan.messageTool.requireExplicitTargetEvidence ? [resolveImplicitMessageToolDeliveryTarget(plan)].filter((target) => Boolean(target)) : [];
	const visibleDeliveries = sentTargets.map((target) => ({
		via: "message_tool",
		target,
		verifiedTarget: sourceDeliveryTargetsMatch(target, plan.target)
	}));
	const hasVerifiedMessageToolDelivery = visibleDeliveries.some((delivery) => didSendViaMessageTool && delivery.verifiedTarget);
	return {
		visibleDeliveries,
		verifiedMessageToolDelivery: hasVerifiedMessageToolDelivery,
		satisfiesSourceDelivery: plan.fallback.skipWhenMessageToolSentToTarget && hasVerifiedMessageToolDelivery,
		unverifiedMessageToolDelivery: didSendViaMessageTool && sentTargets.length > 0 && !hasVerifiedMessageToolDelivery
	};
}
//#endregion
export { resolveSourceDeliveryOutcome as n, sourceDeliveryTargetsMatch as r, createSourceDeliveryPlan as t };
