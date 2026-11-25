import { n as listWhatsAppDirectoryGroupsFromConfig, r as listWhatsAppDirectoryPeersFromConfig } from "./.setup/directory-config-C1Kuc0He.mjs";
// extensions/whatsapp/directory-contract-api.ts
const whatsappDirectoryContractPlugin = {
	id: "whatsapp",
	directory: {
		listPeers: listWhatsAppDirectoryPeersFromConfig,
		listGroups: listWhatsAppDirectoryGroupsFromConfig
	}
};
export { listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, whatsappDirectoryContractPlugin };
