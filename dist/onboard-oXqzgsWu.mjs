import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as applyAgentDefaultModelPrimary, r as applyOnboardAuthAgentModelsAndProviders } from "./provider-onboard-Be0xLg2V.mjs";
import "./provider-model-shared-DUNuGxOQ.mjs";
import { t as MINIMAX_DEFAULT_MODEL_ID } from "./provider-models-B4yCGD5m.mjs";
import { i as MINIMAX_CN_API_BASE_URL, l as buildMinimaxApiModelDefinition, n as MINIMAX_API_BASE_URL } from "./model-definitions-DwMhL281.mjs";
//#region extensions/minimax/onboard.ts
function applyMinimaxApiProviderConfigWithBaseUrl(cfg, params) {
	const providers = { ...cfg.models?.providers };
	const normalizedProviderId = normalizeProviderId(params.providerId);
	const existingProvider = providers[params.providerId] ?? Object.entries(providers).find(([providerId]) => normalizeProviderId(providerId) === normalizedProviderId)?.[1];
	const existingModels = existingProvider?.models ?? [];
	const apiModel = buildMinimaxApiModelDefinition(params.modelId);
	const mergedModels = existingModels.some((model) => model.id === params.modelId) ? existingModels : [...existingModels, apiModel];
	const { apiKey: existingApiKey, ...existingProviderRest } = existingProvider ?? {
		baseUrl: params.baseUrl,
		models: []
	};
	const preservedApiKey = typeof existingApiKey === "string" ? existingApiKey.trim() === "" || existingApiKey.trim() === "minimax" ? void 0 : existingApiKey : existingApiKey;
	providers[params.providerId] = {
		...existingProviderRest,
		baseUrl: params.baseUrl,
		api: "anthropic-messages",
		authHeader: true,
		...preservedApiKey ? { apiKey: preservedApiKey } : {},
		models: mergedModels.length > 0 ? mergedModels : [apiModel]
	};
	const models = { ...cfg.agents?.defaults?.models };
	const modelRef = `${params.providerId}/${params.modelId}`;
	models[modelRef] = {
		...models[modelRef],
		alias: "Minimax"
	};
	return applyOnboardAuthAgentModelsAndProviders(cfg, {
		agentModels: models,
		providers
	});
}
function applyMinimaxApiConfigWithBaseUrl(cfg, params) {
	const next = applyMinimaxApiProviderConfigWithBaseUrl(cfg, params);
	return applyAgentDefaultModelPrimary(next, `${params.providerId}/${params.modelId}`);
}
function applyMinimaxApiProviderConfig(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyMinimaxApiProviderConfigWithBaseUrl(cfg, {
		providerId: "minimax",
		modelId,
		baseUrl: MINIMAX_API_BASE_URL
	});
}
function applyMinimaxApiConfig(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyMinimaxApiConfigWithBaseUrl(cfg, {
		providerId: "minimax",
		modelId,
		baseUrl: MINIMAX_API_BASE_URL
	});
}
function applyMinimaxApiProviderConfigCn(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyMinimaxApiProviderConfigWithBaseUrl(cfg, {
		providerId: "minimax",
		modelId,
		baseUrl: MINIMAX_CN_API_BASE_URL
	});
}
function applyMinimaxApiConfigCn(cfg, modelId = MINIMAX_DEFAULT_MODEL_ID) {
	return applyMinimaxApiConfigWithBaseUrl(cfg, {
		providerId: "minimax",
		modelId,
		baseUrl: MINIMAX_CN_API_BASE_URL
	});
}
//#endregion
export { applyMinimaxApiProviderConfigCn as i, applyMinimaxApiConfigCn as n, applyMinimaxApiProviderConfig as r, applyMinimaxApiConfig as t };
