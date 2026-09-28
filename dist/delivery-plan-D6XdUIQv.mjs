import { c as normalizeOptionalLowercaseString, d as normalizeOptionalThreadValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { u as shouldDefaultCronDeliveryToAnnounce } from "./normalize-_k1oAXPq.mjs";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-BJKXiLk4.mjs";
//#region src/cron/delivery-plan.ts
/** Resolves cron delivery and failure-notification routing from job config. */
/** Returns whether a delivery plan names a concrete channel, recipient, thread, or account. */
function hasExplicitCronDeliveryTarget(plan) {
	return Boolean(plan.channel && plan.channel !== "last" || plan.to || plan.threadId != null || plan.accountId);
}
function normalizeChannel(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	if (!trimmed) return;
	return normalizeMessageChannel(trimmed);
}
function normalizeThreadIdentity(value) {
	const normalized = normalizeOptionalThreadValue(value);
	return normalized == null ? void 0 : String(normalized);
}
function resolveAnnounceChannel(params) {
	if (params.channel && params.channel !== "last") return params.channel;
	return resolveTargetPrefixedChannel(params.to) ?? params.channel ?? "last";
}
/** Resolves primary delivery config into the runtime mode/channel/target plan. */
function resolveCronDeliveryPlan(job) {
	const delivery = job.delivery;
	const hasDelivery = delivery && typeof delivery === "object";
	const rawMode = hasDelivery ? delivery.mode : void 0;
	const normalizedMode = typeof rawMode === "string" ? normalizeLowercaseStringOrEmpty(rawMode) : rawMode;
	const mode = normalizedMode === "announce" ? "announce" : normalizedMode === "webhook" ? "webhook" : normalizedMode === "none" ? "none" : normalizedMode === "deliver" ? "announce" : void 0;
	const deliveryChannel = normalizeChannel(delivery?.channel);
	const deliveryTo = normalizeOptionalString(delivery?.to);
	const deliveryThreadId = normalizeOptionalThreadValue(delivery?.threadId);
	const to = deliveryTo;
	const deliveryAccountId = normalizeOptionalString(delivery?.accountId);
	if (hasDelivery) {
		const resolvedMode = mode ?? "announce";
		const channel = resolvedMode === "announce" ? resolveAnnounceChannel({
			channel: deliveryChannel,
			to
		}) : deliveryChannel;
		return {
			mode: resolvedMode,
			channel: resolvedMode === "webhook" ? void 0 : channel,
			to,
			threadId: resolvedMode === "webhook" ? void 0 : deliveryThreadId,
			accountId: deliveryAccountId,
			source: "delivery",
			requested: resolvedMode === "announce"
		};
	}
	const resolvedMode = job.payload && job.sessionTarget && shouldDefaultCronDeliveryToAnnounce({
		payloadKind: job.payload.kind,
		sessionTarget: job.sessionTarget
	}) ? "announce" : "none";
	return {
		mode: resolvedMode,
		channel: resolvedMode === "announce" ? "last" : void 0,
		to: void 0,
		threadId: void 0,
		source: "delivery",
		requested: resolvedMode === "announce"
	};
}
function normalizeFailureMode(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	if (trimmed === "announce" || trimmed === "webhook") return trimmed;
}
/** Resolves job-level failure notification routing layered over global defaults. */
function resolveFailureDestination(job, globalConfig, jobAlertRoute) {
	const delivery = job.delivery;
	const jobFailureDest = delivery?.failureDestination;
	let channel;
	let to;
	let accountId;
	let mode;
	if (globalConfig) {
		channel = normalizeChannel(globalConfig.channel);
		to = normalizeOptionalString(globalConfig.to);
		accountId = normalizeOptionalString(globalConfig.accountId);
		mode = normalizeFailureMode(globalConfig.mode);
	}
	for (const routeOverride of [jobFailureDest, jobAlertRoute]) {
		if (!routeOverride || typeof routeOverride !== "object") continue;
		const overrideTo = normalizeOptionalString(routeOverride.to);
		const overrideChannel = normalizeChannel(routeOverride.channel) ?? (overrideTo ? resolveTargetPrefixedChannel(overrideTo) : void 0);
		const overrideAccountId = normalizeOptionalString(routeOverride.accountId);
		const overrideMode = normalizeFailureMode(routeOverride.mode);
		const hasChannelField = Object.hasOwn(routeOverride, "channel");
		const hasToField = Object.hasOwn(routeOverride, "to");
		const hasAccountIdField = Object.hasOwn(routeOverride, "accountId");
		const hasModeField = Object.hasOwn(routeOverride, "mode");
		const hasExplicitTo = hasToField && overrideTo !== void 0;
		const globalChannel = resolveAnnounceChannel({
			channel,
			to
		});
		if (hasChannelField || overrideChannel && overrideTo) {
			channel = overrideChannel;
			if (overrideChannel && overrideChannel !== globalChannel) {
				if (!hasToField) to = void 0;
				if (!hasAccountIdField) accountId = void 0;
			}
		}
		if (hasToField) to = overrideTo;
		if (hasAccountIdField) accountId = overrideAccountId;
		const overrideImpliesAnnounce = !hasModeField && overrideChannel !== void 0;
		if (hasModeField || overrideImpliesAnnounce) {
			const effectiveOverrideMode = overrideImpliesAnnounce ? "announce" : overrideMode;
			if ((mode ?? "announce") !== (effectiveOverrideMode ?? "announce")) {
				if (!hasChannelField) channel = void 0;
				if (!hasExplicitTo) to = void 0;
				if (!hasAccountIdField) accountId = void 0;
			}
			mode = effectiveOverrideMode;
		}
	}
	const jobAlertOnlySelectsMode = jobAlertRoute?.mode !== void 0 && jobAlertRoute.channel === void 0 && jobAlertRoute.to === void 0 && jobAlertRoute.accountId === void 0;
	if (!channel && !to && !accountId && (!mode || jobAlertOnlySelectsMode)) return null;
	const resolvedMode = mode ?? "announce";
	if (resolvedMode === "webhook" && !to) return null;
	const result = {
		mode: resolvedMode,
		channel: resolvedMode === "announce" ? resolveAnnounceChannel({
			channel,
			to
		}) : void 0,
		to,
		accountId
	};
	if (delivery && isSameDeliveryTarget(delivery, result)) return null;
	return result;
}
function isSameDeliveryTarget(delivery, failurePlan) {
	const primaryMode = delivery.mode ?? "announce";
	if (primaryMode === "none") return false;
	const primaryTo = normalizeOptionalString(delivery.to);
	const primaryAccountId = normalizeOptionalString(delivery.accountId);
	const primaryThreadId = normalizeThreadIdentity(delivery.threadId);
	if (failurePlan.mode === "webhook") return primaryMode === "webhook" && primaryTo === failurePlan.to;
	const primaryChannelNormalized = resolveAnnounceChannel({
		channel: normalizeChannel(delivery.channel),
		to: primaryTo
	});
	return (failurePlan.channel ?? "last") === primaryChannelNormalized && failurePlan.to === primaryTo && failurePlan.accountId === primaryAccountId && primaryThreadId === void 0;
}
//#endregion
export { resolveCronDeliveryPlan as n, resolveFailureDestination as r, hasExplicitCronDeliveryTarget as t };
