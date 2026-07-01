import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import "./config-A41fTHlt.js";
import "./message-channel-constants-Z0pS5ykd.js";
import { i as listChannelPlugins, t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import { n as resolveChannelApprovalCapability } from "./plugins-DnKj2WmH.js";
import { i as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
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
	const state = (params.approvalKind === "exec" ? capability?.getExecInitiatingSurfaceState?.({
		cfg,
		accountId: params.accountId,
		action: "approve"
	}) : void 0) ?? capability?.getActionAvailabilityState?.({
		cfg,
		accountId: params.accountId,
		action: "approve",
		approvalKind: params.approvalKind
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
/** Returns channel-specific setup guidance for native exec approvals, when available. */
function describeNativeExecApprovalClientSetup(params) {
	const channel = normalizeMessageChannel(params.channel);
	if (!channel || channel === "webchat" || channel === "tui") return null;
	const channelLabel = normalizeOptionalString(params.channelLabel) ?? labelForChannel(channel);
	const accountId = normalizeOptionalString(params.accountId);
	return resolveChannelApprovalCapability(getChannelPlugin(channel))?.describeExecApprovalSetup?.({
		channel,
		channelLabel,
		accountId
	}) ?? null;
}
//#endregion
export { supportsNativeExecApprovalClient as a, resolveExecApprovalInitiatingSurfaceState as i, listNativeExecApprovalClientLabels as n, resolveApprovalInitiatingSurfaceState as r, describeNativeExecApprovalClientSetup as t };
