import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
//#region src/infra/heartbeat-visibility.ts
const DEFAULT_VISIBILITY = {
	showOk: false,
	showAlerts: true,
	useIndicator: true
};
/** Resolves heartbeat visibility for a channel, applying account > channel > defaults precedence. */
function resolveHeartbeatVisibility(params) {
	const { cfg, channel, accountId } = params;
	const channelDefaults = cfg.channels?.defaults?.heartbeatVisibility;
	const channelCfg = channel === "webchat" ? void 0 : cfg.channels?.[channel];
	const perChannel = channelCfg?.heartbeatVisibility;
	const perAccount = (channel !== "webchat" && accountId ? resolveChannelAccountEntry(channelCfg?.accounts, accountId, channel, (id) => id) : void 0)?.heartbeatVisibility;
	const resolve = (key) => perAccount?.[key] ?? perChannel?.[key] ?? channelDefaults?.[key] ?? DEFAULT_VISIBILITY[key];
	return {
		showOk: resolve("showOk"),
		showAlerts: resolve("showAlerts"),
		useIndicator: resolve("useIndicator")
	};
}
//#endregion
export { resolveHeartbeatVisibility as t };
