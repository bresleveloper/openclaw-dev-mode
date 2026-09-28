import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
//#region src/config/context-visibility.ts
/** Reads the global channel default supplemental context visibility mode. */
function resolveDefaultContextVisibility(cfg) {
	return cfg.channels?.defaults?.contextVisibility;
}
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
function resolveChannelContextVisibilityMode(params) {
	if (params.configuredContextVisibility) return params.configuredContextVisibility;
	const channelConfig = params.cfg.channels?.[params.channel];
	const accountId = normalizeAccountId(params.accountId);
	return resolveChannelAccountEntry(channelConfig?.accounts, accountId, params.channel)?.contextVisibility ?? channelConfig?.contextVisibility ?? resolveDefaultContextVisibility(params.cfg) ?? "all";
}
//#endregion
export { resolveDefaultContextVisibility as n, resolveChannelContextVisibilityMode as t };
