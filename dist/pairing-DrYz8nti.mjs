import { r as listChannelPlugins, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
//#region src/channels/plugins/pairing.ts
function listPairingChannels() {
	return listChannelPlugins().filter((plugin) => plugin.pairing).map((plugin) => plugin.id);
}
function getPairingAdapter(channelId) {
	return getChannelPlugin(channelId)?.pairing ?? null;
}
async function notifyPairingApproved(params) {
	const adapter = params.pairingAdapter ?? getPairingAdapter(params.channelId);
	if (!adapter) throw new Error(`Channel ${params.channelId} does not support pairing`);
	if (!adapter.notifyApproval) return;
	await adapter.notifyApproval({
		cfg: params.cfg,
		id: params.id,
		...params.accountId ? { accountId: params.accountId } : {},
		...params.meta ? { meta: params.meta } : {},
		runtime: params.runtime
	});
}
//#endregion
export { listPairingChannels as n, notifyPairingApproved as r, getPairingAdapter as t };
