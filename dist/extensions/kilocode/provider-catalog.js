import { d as discoverKilocodeModels, f as openclaw_plugin_default, t as KILOCODE_BASE_URL } from "./.setup/provider-models-0P0ezPsI.mjs";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/kilocode/provider-catalog.ts
function buildKilocodeProvider() {
	return buildManifestModelProviderConfig({
		providerId: "kilocode",
		catalog: openclaw_plugin_default.modelCatalog.providers.kilocode
	});
}
async function buildKilocodeProviderWithDiscovery(options = {}) {
	return {
		baseUrl: KILOCODE_BASE_URL,
		api: "openai-completions",
		models: await discoverKilocodeModels(options)
	};
}
//#endregion
export { buildKilocodeProvider, buildKilocodeProviderWithDiscovery };
