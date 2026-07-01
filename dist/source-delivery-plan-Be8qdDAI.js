import { h as stringifyRouteThreadId } from "./channel-route-BhPKCG_0.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CLwm6Pqw.js";
//#region src/infra/outbound/source-delivery-plan.ts
function isMessageToolOwnedDelivery(owner) {
	return owner === "message_tool" || owner === "message_tool_then_direct_fallback";
}
function normalizeDeliveryTarget(channel, to) {
	const toTrimmed = to.trim();
	return normalizeTargetForProvider(channel, toTrimmed) ?? toTrimmed;
}
const caseSensitivePrefixedTargetProviders = new Set([
	"googlechat",
	"mattermost",
	"matrix"
]);
const lowercaseNormalizedPrefixedTargetProviders = new Set(["discord", "slack"]);
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
		if (caseSensitivePrefixedTargetProviders.has(channel)) return targetId === deliveryId;
		if (lowercaseNormalizedPrefixedTargetProviders.has(channel)) return targetId?.toLowerCase() === deliveryId?.toLowerCase();
	}
	return normalizeDeliveryTarget(channel, targetToTrimmed) === normalizeDeliveryTarget(channel, deliveryToTrimmed);
}
function normalizeDeliveryThreadId(threadId) {
	return stringifyRouteThreadId(threadId)?.trim() || void 0;
}
function extractTopicThreadId(targetTo) {
	return targetTo.match(/:topic:(\d+)$/i)?.[1];
}
/** Compares a message-tool target with the required source delivery target. */
function sourceDeliveryTargetsMatch(target, delivery) {
	if (!delivery.channel || !delivery.to || !target.to) return false;
	const channel = delivery.channel.trim().toLowerCase();
	const provider = target.provider?.trim().toLowerCase();
	if (provider && provider !== "message" && provider !== channel) return false;
	if (delivery.accountId && target.accountId && target.accountId !== delivery.accountId) return false;
	if (!deliveryTargetsMatch(channel, target.to.replace(/:topic:\d+$/, ""), delivery.to)) return false;
	const deliveryThreadId = normalizeDeliveryThreadId(delivery.threadId);
	const targetThreadId = normalizeDeliveryThreadId(target.threadId) ?? extractTopicThreadId(target.to);
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
