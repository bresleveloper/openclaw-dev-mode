//#region extensions/discord/src/command-deploy-store.ts
const DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE = "command-deploy-hashes";
const DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES = 1e4;
function openDiscordCommandDeployHashStore(openKeyedStore) {
	return openKeyedStore({
		namespace: DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE,
		maxEntries: DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES,
		overflowPolicy: "evict-oldest"
	});
}
//#endregion
export { DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE as n, openDiscordCommandDeployHashStore as r, DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES as t };
