import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-CcfAdtmN.js";
import { a as readConfiguredProviderCatalogEntries } from "../../provider-catalog-shared-BmGxYIrF.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-4eXgvzVs.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CLA-JkCS.js";
import { n as NOVITA_DEFAULT_MODEL_REF } from "../../models-BxCzI7HS.js";
import { t as buildNovitaProvider } from "../../provider-catalog-CuTEU5XL.js";
//#region extensions/novita/index.ts
const PROVIDER_ID = "novita";
var novita_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "NovitaAI Provider",
	description: "Bundled NovitaAI provider plugin",
	provider: {
		label: "NovitaAI",
		docsPath: "/providers/novita",
		aliases: ["novita-ai", "novitaai"],
		envVars: ["NOVITA_API_KEY"],
		auth: [{
			methodId: "api-key",
			label: "NovitaAI API key",
			hint: "OpenAI-compatible NovitaAI endpoint",
			optionKey: "novitaApiKey",
			flagName: "--novita-api-key",
			envVar: "NOVITA_API_KEY",
			promptMessage: "Enter NovitaAI API key",
			defaultModel: NOVITA_DEFAULT_MODEL_REF,
			noteTitle: "NovitaAI",
			noteMessage: "Manage API keys at https://novita.ai/settings/key-management"
		}],
		catalog: {
			buildProvider: buildNovitaProvider,
			buildStaticProvider: buildNovitaProvider,
			allowExplicitBaseUrl: true
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("openai")
	}
});
//#endregion
export { novita_default as default };
