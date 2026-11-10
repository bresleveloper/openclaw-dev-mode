import { n as listBuzzDirectoryPeersFromConfig, t as listBuzzDirectoryGroupsFromConfig } from "./.setup/directory-config-wXk0VyxK.mjs";
//#region extensions/buzz/directory-contract-api.ts
const buzzDirectoryContractPlugin = {
	id: "buzz",
	directory: {
		listPeers: listBuzzDirectoryPeersFromConfig,
		listGroups: listBuzzDirectoryGroupsFromConfig
	}
};
//#endregion
export { buzzDirectoryContractPlugin, listBuzzDirectoryGroupsFromConfig, listBuzzDirectoryPeersFromConfig };
