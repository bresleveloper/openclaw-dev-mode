import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { r as listChannelPlugins, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-CCVkYF8m.mjs";
import "./config-B3oiWDlr.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
//#region src/infra/exec-approval-surface.ts
function labelForChannel(channel) {
	if (channel === "tui") return "terminal UI";
	if (channel === "webchat") return "Web UI";
	return getChannelPlugin(channel ?? "")?.meta.label ?? (channel ? channel[0]?.toUpperCase() + channel.slice(1) : "this platform");
}
function hasNativeExecApprovalCapability(channel) {
	const capability = resolveChannelApprovalCapability(getChannelPlugin(channel ?? ""));
	if (!capability?.native && !capability?.nativeAsync) return false;
	return Boolean(capability.getExecInitiatingSurfaceStateAsync || capability.getExecInitiatingSurfaceState || capability.getActionAvailabilityStateAsync || capability.getActionAvailabilityState);
}
function resolveExecApprovalInitiatingSurfaceStateAsync(params) {
	return resolveApprovalInitiatingSurfaceStateAsync({
		...params,
		approvalKind: "exec"
	});
}
async function resolveApprovalInitiatingSurfaceStateAsync(params) {
	const channel = normalizeMessageChannel(params.channel);
	const channelLabel = labelForChannel(channel);
	const accountId = normalizeOptionalString(params.accountId);
	if (!channel || channel === "webchat" || channel === "tui") return {
		kind: "enabled",
		channel,
		channelLabel,
		accountId
	};
	const cfg = params.cfg ?? readRuntimeConfig();
	const capability = resolveChannelApprovalCapability(getChannelPlugin(channel));
	if (params.approvalKind === "plugin" && !canChannelEnforcePluginReviewerPolicy(cfg, channel, capability)) return {
		kind: "disabled",
		channel,
		channelLabel,
		accountId
	};
	const execHook = capability?.getExecInitiatingSurfaceStateAsync ?? capability?.getExecInitiatingSurfaceState;
	const state = (params.approvalKind === "exec" ? await execHook?.({
		cfg,
		accountId: params.accountId,
		action: "approve"
	}) : void 0) ?? await (capability?.getActionAvailabilityStateAsync ?? capability?.getActionAvailabilityState)?.({
		cfg,
		accountId: params.accountId,
		action: "approve",
		approvalKind: params.approvalKind,
		...params.request ? { request: params.request } : {}
	});
	if (state) return {
		...state,
		channel,
		channelLabel,
		accountId
	};
	if (isDeliverableMessageChannel(channel)) return {
		kind: "enabled",
		channel,
		channelLabel,
		accountId
	};
	return {
		kind: "unsupported",
		channel,
		channelLabel,
		accountId
	};
}
function supportsNativeExecApprovalClient(channel) {
	const normalized = normalizeMessageChannel(channel);
	if (!normalized || normalized === "webchat" || normalized === "tui") return true;
	return hasNativeExecApprovalCapability(normalized);
}
function listNativeExecApprovalClientLabels(params) {
	const excludeChannel = normalizeMessageChannel(params?.excludeChannel);
	return listChannelPlugins().filter((plugin) => plugin.id !== excludeChannel).filter((plugin) => hasNativeExecApprovalCapability(plugin.id)).map((plugin) => normalizeOptionalString(plugin.meta.label)).filter((label) => Boolean(label)).toSorted((a, b) => a.localeCompare(b));
}
function describeNativeApprovalClientSetup(params, approvalKind) {
	const channel = normalizeMessageChannel(params.channel);
	if (!channel || channel === "webchat" || channel === "tui") return null;
	const channelLabel = normalizeOptionalString(params.channelLabel) ?? labelForChannel(channel);
	const accountId = normalizeOptionalString(params.accountId);
	const capability = resolveChannelApprovalCapability(getChannelPlugin(channel));
	const setupParams = {
		channel,
		channelLabel,
		accountId
	};
	return approvalKind === "exec" ? capability?.describeExecApprovalSetup?.(setupParams) ?? null : capability?.describePluginApprovalSetup?.(setupParams) ?? null;
}
function describeNativeExecApprovalClientSetup(params) {
	return describeNativeApprovalClientSetup(params, "exec");
}
function describeNativePluginApprovalClientSetup(params) {
	return describeNativeApprovalClientSetup(params, "plugin");
}
//#endregion
export { resolveExecApprovalInitiatingSurfaceStateAsync as a, resolveApprovalInitiatingSurfaceStateAsync as i, describeNativePluginApprovalClientSetup as n, supportsNativeExecApprovalClient as o, listNativeExecApprovalClientLabels as r, describeNativeExecApprovalClientSetup as t };
