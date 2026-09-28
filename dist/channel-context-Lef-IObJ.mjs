import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as getActivePluginChannelRegistry } from "./runtime-B2zZQffc.mjs";
//#region src/auto-reply/reply/channel-context.ts
/** Resolves channel and account context for command handlers. */
/** Resolves the command surface channel from inbound context and command state. */
function resolveCommandSurfaceChannel(params) {
	const channel = params.ctx.OriginatingChannel ?? params.command.channel ?? params.ctx.Surface ?? params.ctx.Provider;
	return normalizeOptionalLowercaseString(channel) ?? "";
}
/** Resolves command account id, falling back to plugin default account config. */
function resolveChannelAccountId(params) {
	const accountId = normalizeOptionalString(params.ctx.AccountId) ?? "";
	if (accountId) return accountId;
	const channel = resolveCommandSurfaceChannel(params);
	const plugin = getActivePluginChannelRegistry()?.channels.find((entry) => entry.plugin.id === channel)?.plugin;
	return normalizeOptionalString(plugin?.config.defaultAccountId?.(params.cfg)) || "default";
}
//#endregion
export { resolveCommandSurfaceChannel as n, resolveChannelAccountId as t };
