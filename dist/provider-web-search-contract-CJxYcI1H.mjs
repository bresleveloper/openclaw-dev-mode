import { t as enableProviderPluginInConfig } from "./provider-enable-config-BWISz_4j.mjs";
import { t as createBaseWebSearchProviderContractFields } from "./provider-web-search-contract-fields-KLAK01yF.mjs";
//#region src/plugin-sdk/provider-web-search-contract.ts
/** Build the public web-search provider hooks, including optional selection-time plugin enabling. */
function createWebSearchProviderContractFields(options) {
	const selectionPluginId = options.selectionPluginId;
	return {
		...createBaseWebSearchProviderContractFields(options),
		...selectionPluginId ? { applySelectionConfig: (config) => enableProviderPluginInConfig(config, selectionPluginId).config } : {}
	};
}
//#endregion
export { createWebSearchProviderContractFields as t };
