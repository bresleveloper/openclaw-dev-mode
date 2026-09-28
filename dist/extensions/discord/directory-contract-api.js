import { n as listDiscordDirectoryGroupsFromConfig, r as listDiscordDirectoryPeersFromConfig } from "./.setup/directory-config-BytTftz-.mjs";
//#region extensions/discord/directory-contract-api.ts
const discordDirectoryContractPlugin = {
	id: "discord",
	directory: {
		listPeers: listDiscordDirectoryPeersFromConfig,
		listGroups: listDiscordDirectoryGroupsFromConfig
	}
};
//#endregion
export { discordDirectoryContractPlugin, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig };
