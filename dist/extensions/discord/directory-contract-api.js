import { n as listDiscordDirectoryGroupsFromConfig, r as listDiscordDirectoryPeersFromConfig } from "./.setup/directory-config-BXJuh9-J.mjs";
// extensions/discord/directory-contract-api.ts
const discordDirectoryContractPlugin = {
	id: "discord",
	directory: {
		listPeers: listDiscordDirectoryPeersFromConfig,
		listGroups: listDiscordDirectoryGroupsFromConfig
	}
};
export { discordDirectoryContractPlugin, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig };
