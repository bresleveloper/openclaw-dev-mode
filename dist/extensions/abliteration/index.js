import { n as buildAbliterationProvider, r as openclaw_plugin_default, t as ABLITERATION_DEFAULT_MODEL_REF } from "./.setup/models-Dafp2suY.mjs";
import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
// extensions/abliteration/index.ts
const PROVIDER_ID = "abliteration";
const abliterationProvider = buildAbliterationProvider();
var abliteration_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Abliteration Provider",
	description: "Abliteration provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Abliteration",
		docsPath: "/providers/abliteration",
		envVars: ["ABLITERATION_API_KEY", "ABLIT_KEY"],
		manifestAuth: {
			defaultModel: ABLITERATION_DEFAULT_MODEL_REF,
			applyConfig: createProviderConnectionPresetAppliers({
				primaryModelRef: ABLITERATION_DEFAULT_MODEL_REF,
				resolveParams: () => ({
					providerId: "abliteration",
					api: "openai-completions",
					baseUrl: abliterationProvider.baseUrl,
					catalogModels: () => abliterationProvider.models,
					aliases: [{
						modelRef: ABLITERATION_DEFAULT_MODEL_REF,
						alias: "Abliterated Large Flash"
					}]
				})
			}).applyConfig,
			noteTitle: "Abliteration",
			noteMessage: "Create an API key at https://abliteration.ai."
		},
		catalog: {},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("openai"),
		isModernModelRef: () => true
	}
});
export { abliteration_default as default };
