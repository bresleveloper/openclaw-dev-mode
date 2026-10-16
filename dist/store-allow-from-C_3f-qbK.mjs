//#region src/channels/message-access/store-allow-from.ts
/**
* Read pairing-store allowlist entries when a direct-message policy permits
* store fallback.
*/
async function readChannelIngressStoreAllowFromForDmPolicy(params) {
	if (params.shouldRead === false || params.dmPolicy === "allowlist" || params.dmPolicy === "open") return [];
	return await (params.readStore ?? (async (provider, accountId) => {
		const { readChannelAllowFromStore } = await import("./pairing-store-CmBzrzvK.mjs");
		return await readChannelAllowFromStore(provider, process.env, accountId);
	}))(params.provider, params.accountId).catch(() => []);
}
async function readChannelIngressStoreAllowFrom(params) {
	if (params.conversation.kind !== "direct" || params.policy.dmPolicy === "allowlist" || params.policy.dmPolicy === "open") return [];
	return [...(params.readStoreAllowFrom ? await params.readStoreAllowFrom({
		channelId: params.channelId,
		accountId: params.accountId,
		dmPolicy: params.policy.dmPolicy
	}).catch(() => []) : params.useDefaultPairingStore ? await readChannelIngressStoreAllowFromForDmPolicy({
		provider: params.channelId,
		accountId: params.accountId,
		dmPolicy: params.policy.dmPolicy
	}) : []) ?? []];
}
//#endregion
export { readChannelIngressStoreAllowFromForDmPolicy as n, readChannelIngressStoreAllowFrom as t };
