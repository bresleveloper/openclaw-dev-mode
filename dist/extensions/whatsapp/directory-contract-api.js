import { n as listWhatsAppDirectoryPeersFromConfig, t as listWhatsAppDirectoryGroupsFromConfig } from "../../directory-config-Cy3HQiWT.js";
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
