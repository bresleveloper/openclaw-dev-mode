import { h as runLiveProviderCatalog } from "../../provider-catalog-live-runtime-BILEsjga.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CKUq_-Jy.mjs";
import { i as openclaw_plugin_default } from "../../models-BPmI_moD.mjs";
import { r as applyHuggingfaceConnectionConfig, t as HUGGINGFACE_DEFAULT_MODEL_REF } from "../../onboard-DefDmGKu.mjs";
import { t as buildHuggingfaceProvider } from "../../provider-catalog-BrNB0f_V.mjs";
//#region extensions/huggingface/index.ts
const PROVIDER_ID = "huggingface";
var huggingface_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Hugging Face Provider",
	description: "Bundled Hugging Face provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Hugging Face",
		docsPath: "/providers/huggingface",
		envVars: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
		manifestAuth: {
			defaultModel: HUGGINGFACE_DEFAULT_MODEL_REF,
			applyConfig: applyHuggingfaceConnectionConfig
		},
		catalog: {
			run: async (ctx) => {
				if ((ctx.config?.plugins?.entries?.[PROVIDER_ID]?.config)?.discovery?.enabled === false) return null;
				const { apiKey, discoveryApiKey, profileId } = ctx.resolveProviderApiKey(PROVIDER_ID);
				if (!apiKey) return null;
				const run = async () => ({ provider: {
					...await buildHuggingfaceProvider(discoveryApiKey, { discoveryMode: "strict" }),
					apiKey
				} });
				return discoveryApiKey ? await runLiveProviderCatalog({
					providerId: PROVIDER_ID,
					profileId,
					run
				}) : await run();
			},
			staticRun: async () => ({ provider: await buildHuggingfaceProvider() })
		}
	}
});
//#endregion
export { huggingface_default as default };
