import "./account-id-ifCOO7_9.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { i as resolveChannelTarget } from "./target-resolver-c-W9fpkt.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-JZ360Soo.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-iQxjPtMU.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-Y84oqniG.mjs";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-Dj69E8ST.mjs";
//#region src/cron/isolated-agent/delivery-target.runtime.ts
/** Runtime-loaded channel target helpers used by cron delivery resolution. */
/** Picks the channel's own default account for a delivery that names none and has no binding. */
function resolveChannelDefaultAccountIdForDelivery(params) {
	const plugin = resolveOutboundChannelPlugin({
		...params,
		allowBootstrap: true
	});
	const accountId = plugin ? resolveChannelDefaultAccountId({
		plugin,
		cfg: params.cfg
	}) : void 0;
	return accountId === "default" ? void 0 : accountId;
}
/** Resolves a cron delivery target through channel plugins with bootstrap allowed. */
async function resolveChannelTargetForDelivery(params) {
	const plugin = resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	try {
		return await resolveChannelTarget({
			cfg: params.cfg,
			channel: params.channel,
			input: params.input,
			accountId: params.accountId,
			unknownTargetMode: "normalized",
			plugin
		});
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err : new Error(String(err))
		};
	}
}
/** Resolves the outbound session route used for cron delivery threading and mirrors. */
async function resolveOutboundSessionRouteForDelivery(params) {
	const plugin = resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	return await resolveOutboundSessionRoute({
		...params,
		plugin
	});
}
/** Returns whether a channel can canonicalize outbound cron delivery sessions. */
function channelCanResolveOutboundSessionRoute(params) {
	return Boolean(resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	})?.messaging?.resolveOutboundSessionRoute);
}
//#endregion
export { channelCanResolveOutboundSessionRoute, getLoadedChannelPluginForRead, mapAllowFromEntries, resolveChannelDefaultAccountIdForDelivery, resolveChannelTargetForDelivery, resolveFirstBoundAccountId, resolveOutboundSessionRouteForDelivery };
