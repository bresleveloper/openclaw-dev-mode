import { a as BYTEPLUS_PROVIDER_CATALOG, o as openclaw_plugin_default } from "./.setup/models-648u0ZzV.mjs";
import { buildBytePlusVideoGenerationProvider } from "./video-generation-provider.js";
import { buildOpenAICompatibleProviderFamilyCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { ensureModelAllowlistEntry } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/byteplus/index.ts
/**
* BytePlus provider plugin entrypoint for model and video generation providers.
*/
const PROVIDER_ID = "byteplus";
const BYTEPLUS_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "byteplus-plan");
var byteplus_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "BytePlus Provider",
	description: "BytePlus provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "BytePlus",
		docsPath: "/concepts/model-providers#byteplus-international",
		manifestAuth: {
			defaultModel: BYTEPLUS_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => ensureModelAllowlistEntry({
				cfg,
				modelRef: BYTEPLUS_DEFAULT_MODEL_REF
			})
		},
		...buildOpenAICompatibleProviderFamilyCatalog({
			discoveryMode: "strict",
			credentialProviderId: PROVIDER_ID,
			entries: BYTEPLUS_PROVIDER_CATALOG.entries,
			staticCatalog: BYTEPLUS_PROVIDER_CATALOG.staticCatalog,
			augmentModelCatalog: BYTEPLUS_PROVIDER_CATALOG.augmentModelCatalog
		})
	},
	register(api) {
		api.registerVideoGenerationProvider(buildBytePlusVideoGenerationProvider());
	}
});
//#endregion
export { byteplus_default as default };
