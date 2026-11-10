import { c as normalizeOptionalLowercaseString, d as normalizeOptionalThreadValue, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-D9KEia-0.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { t as resolveCronDeliveryMode } from "./delivery-defaults-BZP2TvGw.mjs";
//#region src/cron/delivery-plan.ts
/** Resolves cron delivery and failure-notification routing from job config. */
function resolveAnnounceChannel(params) {
	if (params.channel && params.channel !== "last") return params.channel;
	return resolveTargetPrefixedChannel(params.to) ?? params.channel ?? "last";
}
/** Resolves primary delivery config into the runtime mode/channel/target plan. */
function resolveCronDeliveryPlan(job) {
	const delivery = job.delivery;
	const resolvedMode = resolveCronDeliveryMode(job);
	const deliveryChannel = normalizeMessageChannel(delivery?.channel);
	const to = normalizeOptionalString(delivery?.to);
	const deliveryThreadId = normalizeOptionalThreadValue(delivery?.threadId);
	const deliveryAccountId = normalizeOptionalString(delivery?.accountId);
	if (delivery) {
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
		channel = normalizeMessageChannel(globalConfig.channel);
		to = normalizeOptionalString(globalConfig.to);
		accountId = normalizeOptionalString(globalConfig.accountId);
		mode = normalizeFailureMode(globalConfig.mode);
	}
	for (const routeOverride of [jobFailureDest, jobAlertRoute]) {
		if (!routeOverride || typeof routeOverride !== "object") continue;
		const overrideTo = normalizeOptionalString(routeOverride.to);
		const overrideChannel = normalizeMessageChannel(routeOverride.channel) ?? (overrideTo ? resolveTargetPrefixedChannel(overrideTo) : void 0);
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
	const primaryMode = delivery.mode;
	if (!hasCanonicalCronDeliveryMode(delivery) || primaryMode === "none") return false;
	const primaryTo = normalizeOptionalString(delivery.to);
	const primaryAccountId = normalizeOptionalString(delivery.accountId);
	const primaryThreadId = normalizeOptionalStringifiedId(delivery.threadId);
	if (failurePlan.mode === "webhook") return primaryMode === "webhook" && primaryTo === failurePlan.to;
	const primaryChannelNormalized = resolveAnnounceChannel({
		channel: normalizeMessageChannel(delivery.channel),
		to: primaryTo
	});
	return (failurePlan.channel ?? "last") === primaryChannelNormalized && failurePlan.to === primaryTo && failurePlan.accountId === primaryAccountId && primaryThreadId === void 0;
}
//#endregion
export { resolveFailureDestination as n, resolveCronDeliveryPlan as t };
