import { i as openclaw_plugin_default, n as CHUTES_MODEL_CATALOG, t as CHUTES_BASE_URL } from "./.setup/models-mjZNwTpp.mjs";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { applyAgentDefaultModelPrimary, createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/chutes/onboard.ts
const CHUTES_DEFAULT_MODEL_ID = openclaw_plugin_default.modelCatalog.providers.chutes.defaultModel;
const CHUTES_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "chutes");
const chutesPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: CHUTES_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: "chutes",
		api: "openai-completions",
		baseUrl: CHUTES_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? structuredClone(CHUTES_MODEL_CATALOG) : [],
		aliases: [
			...CHUTES_MODEL_CATALOG.map((model) => `chutes/${model.id}`),
			{
				modelRef: "chutes-vision",
				alias: "chutes/moonshotai/Kimi-K2.6-TEE"
			},
			{
				modelRef: "chutes-pro",
				alias: "chutes/deepseek-ai/DeepSeek-V3.2-TEE"
			}
		]
	})
});
function applyChutesProviderConfig(cfg) {
	return chutesPresetAppliers.applyProviderConfig(cfg);
}
function applyChutesConfig(cfg) {
	const next = applyChutesProviderConfig(cfg);
	return {
		...next,
		agents: {
			...next.agents,
			defaults: {
				...next.agents?.defaults,
				model: {
					primary: CHUTES_DEFAULT_MODEL_REF,
					fallbacks: ["chutes/deepseek-ai/DeepSeek-V3.2-TEE", "chutes/moonshotai/Kimi-K2.6-TEE"]
				},
				imageModel: {
					primary: "chutes/moonshotai/Kimi-K2.6-TEE",
					fallbacks: ["chutes/Qwen/Qwen3.6-27B-TEE"]
				}
			}
		}
	};
}
function applyChutesApiKeyConfig(cfg) {
	return applyAgentDefaultModelPrimary(applyChutesProviderConfig(cfg), CHUTES_DEFAULT_MODEL_REF);
}
//#endregion
export { CHUTES_DEFAULT_MODEL_ID, CHUTES_DEFAULT_MODEL_REF, applyChutesApiKeyConfig, applyChutesConfig, applyChutesProviderConfig };
