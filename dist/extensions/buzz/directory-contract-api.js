import { n as listBuzzDirectoryPeersFromConfig, t as listBuzzDirectoryGroupsFromConfig } from "./.setup/directory-config-4LKbchce.mjs";
// extensions/buzz/directory-contract-api.ts
const buzzDirectoryContractPlugin = {
	id: "buzz",
	directory: {
		listPeers: listBuzzDirectoryPeersFromConfig,
		listGroups: listBuzzDirectoryGroupsFromConfig
	}
};
export { buzzDirectoryContractPlugin, listBuzzDirectoryGroupsFromConfig, listBuzzDirectoryPeersFromConfig };
