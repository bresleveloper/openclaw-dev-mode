import { n as buildKilocodeProviderWithDiscovery, r as openclaw_plugin_default, t as buildKilocodeProvider } from "./.setup/provider-catalog-DVP2RSKr.mjs";
import { KILOCODE_DEFAULT_MODEL_REF } from "./provider-models.js";
import { applyKilocodeConfig } from "./onboard.js";
import { wrapKilocodeProviderStream } from "./stream.js";
import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/kilocode/index.ts
const PROVIDER_ID = "kilocode";
var kilocode_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Kilo Gateway Provider",
	description: "Bundled Kilo Gateway provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Kilo Gateway",
		docsPath: "/providers/kilocode",
		manifestAuth: {
			defaultModel: KILOCODE_DEFAULT_MODEL_REF,
			applyConfig: applyKilocodeConfig
		},
		catalog: {
			discoveryMode: "strict",
			buildProvider: () => buildKilocodeProviderWithDiscovery({ discoveryMode: "strict" }),
			buildStaticProvider: buildKilocodeProvider
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		wrapStreamFn: wrapKilocodeProviderStream,
		isCacheTtlEligible: (ctx) => ctx.modelId.startsWith("anthropic/")
	}
});
//#endregion
export { kilocode_default as default };
