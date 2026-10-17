import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { r as listChannelPlugins, t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-Z9_SzFi0.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
//#region src/infra/exec-approval-surface.ts
function labelForChannel(channel) {
	if (channel === "tui") return "terminal UI";
	if (channel === "webchat") return "Web UI";
	return getChannelPlugin(channel ?? "")?.meta.label ?? (channel ? channel[0]?.toUpperCase() + channel.slice(1) : "this platform");
}
function hasNativeExecApprovalCapability(channel) {
	const capability = resolveChannelApprovalCapability(getChannelPlugin(channel ?? ""));
	if (!capability?.native) return false;
	return Boolean(capability.getExecInitiatingSurfaceState || capability.getActionAvailabilityState);
}
/** Resolves whether exec approvals can be handled on the initiating surface. */
function resolveExecApprovalInitiatingSurfaceState(params) {
	return resolveApprovalInitiatingSurfaceState({
		...params,
		approvalKind: "exec"
	});
}
/** Resolves whether approvals of a given kind can be handled on the initiating surface. */
function resolveApprovalInitiatingSurfaceState(params) {
	const channel = normalizeMessageChannel(params.channel);
	const channelLabel = labelForChannel(channel);
	const accountId = normalizeOptionalString(params.accountId);
	if (!channel || channel === "webchat" || channel === "tui") return {
		kind: "enabled",
		channel,
		channelLabel,
		accountId
	};
	const cfg = params.cfg ?? getRuntimeConfig();
	const capability = resolveChannelApprovalCapability(getChannelPlugin(channel));
	if (params.approvalKind === "plugin" && !canChannelEnforcePluginReviewerPolicy(cfg, channel, capability)) return {
		kind: "disabled",
		channel,
		channelLabel,
		accountId
	};
	const state = (params.approvalKind === "exec" ? capability?.getExecInitiatingSurfaceState?.({
		cfg,
		accountId: params.accountId,
		action: "approve"
	}) : void 0) ?? capability?.getActionAvailabilityState?.({
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
/** Returns whether a channel can present native exec approval UI. */
function supportsNativeExecApprovalClient(channel) {
	const normalized = normalizeMessageChannel(channel);
	if (!normalized || normalized === "webchat" || normalized === "tui") return true;
	return hasNativeExecApprovalCapability(normalized);
}
/** Lists native exec approval client labels for reply guidance. */
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
/** Returns channel-specific setup guidance for native exec approvals, when available. */
function describeNativeExecApprovalClientSetup(params) {
	return describeNativeApprovalClientSetup(params, "exec");
}
/** Returns channel-specific setup guidance for native plugin approvals, when available. */
function describeNativePluginApprovalClientSetup(params) {
	return describeNativeApprovalClientSetup(params, "plugin");
}
//#endregion
export { resolveExecApprovalInitiatingSurfaceState as a, resolveApprovalInitiatingSurfaceState as i, describeNativePluginApprovalClientSetup as n, supportsNativeExecApprovalClient as o, listNativeExecApprovalClientLabels as r, describeNativeExecApprovalClientSetup as t };
