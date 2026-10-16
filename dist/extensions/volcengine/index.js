import { a as VOLCENGINE_PROVIDER_CATALOG, o as openclaw_plugin_default } from "./.setup/models-BWaO4fQH.mjs";
import { applyVolcengineToolSchemaCompat } from "./api.js";
import { buildVolcengineSpeechProvider } from "./speech-provider.js";
import { buildOpenAICompatibleProviderFamilyCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { ensureModelAllowlistEntry } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/volcengine/index.ts
const PROVIDER_ID = "volcengine";
const VOLCENGINE_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "volcengine-plan");
var volcengine_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Volcengine Provider",
	description: "Bundled Volcengine provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Volcengine",
		docsPath: "/concepts/model-providers#volcano-engine-doubao",
		hookAliases: ["volcengine-plan"],
		manifestAuth: {
			defaultModel: VOLCENGINE_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => ensureModelAllowlistEntry({
				cfg,
				modelRef: VOLCENGINE_DEFAULT_MODEL_REF
			})
		},
		...buildOpenAICompatibleProviderFamilyCatalog({
			discoveryMode: "strict",
			credentialProviderId: PROVIDER_ID,
			entries: VOLCENGINE_PROVIDER_CATALOG.entries,
			staticCatalog: VOLCENGINE_PROVIDER_CATALOG.staticCatalog,
			augmentModelCatalog: VOLCENGINE_PROVIDER_CATALOG.augmentModelCatalog
		}),
		normalizeResolvedModel: ({ model }) => applyVolcengineToolSchemaCompat(model)
	},
	register(api) {
		api.registerSpeechProvider(buildVolcengineSpeechProvider());
	}
});
//#endregion
export { volcengine_default as default };
