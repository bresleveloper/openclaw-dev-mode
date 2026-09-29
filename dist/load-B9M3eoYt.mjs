import { t as createChannelRegistryLoader } from "./registry-loader-mWCALKZm.mjs";
//#region src/channels/plugins/outbound/load.ts
const loadOutboundAdapterFromRegistry = createChannelRegistryLoader((entry) => entry.plugin.outbound);
async function loadChannelOutboundAdapter(id) {
	return loadOutboundAdapterFromRegistry(id);
}
//#endregion
export { loadChannelOutboundAdapter as t };
