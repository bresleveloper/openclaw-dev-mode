import { n as listWhatsAppDirectoryPeersFromConfig, t as listWhatsAppDirectoryGroupsFromConfig } from "../../directory-config-D1Dyfh84.js";
//#region extensions/whatsapp/directory-contract-api.ts
const whatsappDirectoryContractPlugin = {
	id: "whatsapp",
	directory: {
		listPeers: listWhatsAppDirectoryPeersFromConfig,
		listGroups: listWhatsAppDirectoryGroupsFromConfig
	}
};
//#endregion
export { listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, whatsappDirectoryContractPlugin };
