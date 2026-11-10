import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
//#region src/config/context-visibility.ts
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
function resolveChannelContextVisibilityMode(params) {
	if (params.configuredContextVisibility) return params.configuredContextVisibility;
	const channelConfig = params.cfg.channels?.[params.channel];
	const accountId = normalizeAccountId(params.accountId);
	return resolveChannelAccountEntry(channelConfig?.accounts, accountId, params.channel)?.contextVisibility ?? channelConfig?.contextVisibility ?? params.cfg.channels?.defaults?.contextVisibility ?? "all";
}
//#endregion
export { resolveChannelContextVisibilityMode as t };
