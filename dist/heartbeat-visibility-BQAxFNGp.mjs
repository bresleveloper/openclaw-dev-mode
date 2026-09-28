import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
//#region src/infra/heartbeat-visibility.ts
const DEFAULT_VISIBILITY = {
	showOk: false,
	showAlerts: true,
	useIndicator: true
};
/** Resolves heartbeat visibility for a channel, applying account > channel > defaults precedence. */
function resolveHeartbeatVisibility(params) {
	const { cfg, channel, accountId } = params;
	if (channel === "webchat") {
		const channelDefaults = cfg.channels?.defaults?.heartbeatVisibility;
		return {
			showOk: channelDefaults?.showOk ?? DEFAULT_VISIBILITY.showOk,
			showAlerts: channelDefaults?.showAlerts ?? DEFAULT_VISIBILITY.showAlerts,
			useIndicator: channelDefaults?.useIndicator ?? DEFAULT_VISIBILITY.useIndicator
		};
	}
	const channelDefaults = cfg.channels?.defaults?.heartbeatVisibility;
	const channelCfg = cfg.channels?.[channel];
	const perChannel = channelCfg?.heartbeatVisibility;
	const perAccount = (accountId ? resolveChannelAccountEntry(channelCfg?.accounts, accountId, channel, (id) => id) : void 0)?.heartbeatVisibility;
	return {
		showOk: perAccount?.showOk ?? perChannel?.showOk ?? channelDefaults?.showOk ?? DEFAULT_VISIBILITY.showOk,
		showAlerts: perAccount?.showAlerts ?? perChannel?.showAlerts ?? channelDefaults?.showAlerts ?? DEFAULT_VISIBILITY.showAlerts,
		useIndicator: perAccount?.useIndicator ?? perChannel?.useIndicator ?? channelDefaults?.useIndicator ?? DEFAULT_VISIBILITY.useIndicator
	};
}
//#endregion
export { resolveHeartbeatVisibility as t };
