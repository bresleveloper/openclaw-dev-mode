import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { g as createModelCatalogPresetAppliers, n as applyAgentDefaultModelPrimary, r as applyOnboardAuthAgentModelsAndProviders, y as withAgentModelAliases } from "./provider-onboard-Be0xLg2V.mjs";
import { a as XAI_DEFAULT_MODEL_ID, c as buildXaiCatalogModels, t as XAI_BASE_URL, u as isLegacyXaiBuiltinModel } from "./model-definitions-DA8Fbxqz.mjs";
//#region extensions/xai/onboard.ts
const XAI_DEFAULT_MODEL_REF = `xai/${XAI_DEFAULT_MODEL_ID}`;
const xaiPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: XAI_DEFAULT_MODEL_REF,
	resolveParams: (cfg) => ({
		providerId: "xai",
		api: "openai-responses",
		baseUrl: XAI_BASE_URL,
		catalogModels: cfg.models?.mode === "replace" ? buildXaiCatalogModels() : [],
		aliases: [{
			modelRef: XAI_DEFAULT_MODEL_REF,
			alias: "Grok"
		}]
	})
});
function pruneRetiredXaiBuiltinModels(cfg) {
	const provider = cfg.models?.providers?.xai;
	if (!provider || !Array.isArray(provider.models)) return cfg;
	const models = provider.models.filter((model) => !isLegacyXaiBuiltinModel(model));
	if (models.length === provider.models.length) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: {
				...cfg.models?.providers,
				xai: {
					...provider,
					models
				}
			}
		}
	};
}
function applyXaiProviderConfig(cfg) {
	return xaiPresetAppliers.applyProviderConfig(pruneRetiredXaiBuiltinModels(cfg));
}
function applyXaiConfig(cfg) {
	return xaiPresetAppliers.applyConfig(pruneRetiredXaiBuiltinModels(cfg));
}
function applyXaiOAuthConfig(cfg, provider) {
	const next = applyOnboardAuthAgentModelsAndProviders(cfg, {
		agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, [{
			modelRef: XAI_DEFAULT_MODEL_REF,
			alias: "Grok"
		}]),
		providers: { xai: {
			...provider,
			apiKey: void 0,
			authHeader: void 0,
			headers: void 0,
			request: {
				auth: void 0,
				headers: void 0
			}
		} }
	});
	return resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ? next : applyAgentDefaultModelPrimary(next, XAI_DEFAULT_MODEL_REF);
}
//#endregion
export { applyXaiProviderConfig as i, applyXaiConfig as n, applyXaiOAuthConfig as r, XAI_DEFAULT_MODEL_REF as t };
