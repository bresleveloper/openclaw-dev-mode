import { n as findNormalizedProviderValue } from "./provider-id-D1VImdKk.mjs";
import { n as applyAgentDefaultModelPrimary, r as applyOnboardAuthAgentModelsAndProviders } from "./provider-onboard-sfE-MZsX.mjs";
import "./provider-auth-JCvgbsWg.mjs";
import { t as MINIMAX_DEFAULT_MODEL_ID } from "./provider-models-DBUsZoDK.mjs";
import { i as MINIMAX_CN_API_BASE_URL, l as buildMinimaxApiModelDefinition, n as MINIMAX_API_BASE_URL } from "./model-definitions-eBtXfqlW.mjs";
//#region extensions/minimax/onboard.ts
function applyMinimaxApiProviderConfigWithBaseUrl(cfg, modelId, baseUrl) {
	const providers = { ...cfg.models?.providers };
	const existingProvider = providers.minimax ?? findNormalizedProviderValue(providers, "minimax");
	const existingModels = existingProvider?.models ?? [];
	const apiModel = buildMinimaxApiModelDefinition(modelId);
	const mergedModels = existingModels.some((model) => model.id === modelId) ? existingModels : [...existingModels, apiModel];
	const { apiKey: existingApiKey, ...existingProviderRest } = existingProvider ?? {
		baseUrl,
		models: []
	};
	const preservedApiKey = typeof existingApiKey === "string" ? existingApiKey.trim() === "" || existingApiKey.trim() === "minimax" ? void 0 : existingApiKey : existingApiKey;
	providers.minimax = {
		...existingProviderRest,
		baseUrl,
		api: "anthropic-messages",
		authHeader: true,
		...preservedApiKey ? { apiKey: preservedApiKey } : {},
		models: mergedModels
	};
	const models = { ...cfg.agents?.defaults?.models };
	const modelRef = `minimax/${modelId}`;
	models[modelRef] = {
		...models[modelRef],
		alias: "Minimax"
	};
	return applyOnboardAuthAgentModelsAndProviders(cfg, {
		agentModels: models,
		providers
	});
}
function applyMinimaxApiProviderConfig(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyMinimaxApiProviderConfigWithBaseUrl(cfg, modelId, MINIMAX_API_BASE_URL);
}
function applyMinimaxApiConfig(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyAgentDefaultModelPrimary(applyMinimaxApiProviderConfig(cfg, modelId), `minimax/${modelId}`);
}
function applyMinimaxApiProviderConfigCn(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyMinimaxApiProviderConfigWithBaseUrl(cfg, modelId, MINIMAX_CN_API_BASE_URL);
}
function applyMinimaxApiConfigCn(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyAgentDefaultModelPrimary(applyMinimaxApiProviderConfigCn(cfg, modelId), `minimax/${modelId}`);
}
//#endregion
export { applyMinimaxApiProviderConfigCn as i, applyMinimaxApiConfigCn as n, applyMinimaxApiProviderConfig as r, applyMinimaxApiConfig as t };
