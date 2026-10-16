import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
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
	return {
		showOk: perAccount?.showOk ?? perChannel?.showOk ?? channelDefaults?.showOk ?? DEFAULT_VISIBILITY.showOk,
		showAlerts: perAccount?.showAlerts ?? perChannel?.showAlerts ?? channelDefaults?.showAlerts ?? DEFAULT_VISIBILITY.showAlerts,
		useIndicator: perAccount?.useIndicator ?? perChannel?.useIndicator ?? channelDefaults?.useIndicator ?? DEFAULT_VISIBILITY.useIndicator
	};
}
//#endregion
export { resolveHeartbeatVisibility as t };
