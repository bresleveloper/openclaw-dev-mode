import { n as listWhatsAppDirectoryPeersFromConfig, t as listWhatsAppDirectoryGroupsFromConfig } from "../../directory-config-BUYy_TDi.js";

//#region extensions/whatsapp/directory-contract-api.d.ts
declare const whatsappDirectoryContractPlugin: {
  id: string;
  directory: {
    listPeers: typeof listWhatsAppDirectoryPeersFromConfig;
    listGroups: typeof listWhatsAppDirectoryGroupsFromConfig;
  };
};
//#endregion
export { listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, whatsappDirectoryContractPlugin };