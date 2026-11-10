import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as isCloudModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { f as isHostedOllamaCloud, g as resolveOllamaOutputBudget, h as resolveOllamaCloudDefaultModel, n as OLLAMA_CLOUD_BASE_URL, o as OLLAMA_DEFAULT_BASE_URL, p as isOllamaCloudOrigin } from "./defaults-CDpC0pZy.mjs";
import { n as resolveOllamaBaseUrlForRun, o as supportsOllamaCloudFullThinkingEffort, t as readProviderBaseUrl } from "./provider-base-url-CJ296Qbv.mjs";
//#region extensions/ollama/provider-policy-api.ts
function isHostedRoute({ provider, modelId, baseUrl }) {
	return normalizeProviderId(provider) === "ollama-cloud" || isCloudModelRef(modelId) || isOllamaCloudOrigin(baseUrl);
}
function normalizeResolvedModel({ provider, model, config }) {
	const baseUrl = resolveOllamaBaseUrlForRun({
		modelBaseUrl: model.baseUrl,
		providerBaseUrl: readProviderBaseUrl(findNormalizedProviderValue(config?.models?.providers, provider))
	});
	if (model.api !== "ollama" || isHostedRoute({
		provider,
		modelId: model.id,
		baseUrl
	})) return;
	return {
		...model,
		compactionThinkingDefault: "off"
	};
}
/** Server routes prefer discovery; known cloud routes keep the ordinary surface.
* Untagged aliases retain the server default because configured rows have no remote-source metadata. */
function resolveToolSearchMode({ provider, modelId, baseUrl }) {
	return isHostedRoute({
		provider,
		modelId,
		baseUrl
	}) ? false : "tools";
}
const OLLAMA_REASONING_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "max" }
	],
	defaultLevel: "off"
};
const OLLAMA_NON_REASONING_THINKING_PROFILE = {
	levels: [{ id: "off" }],
	defaultLevel: "off"
};
/**
* Provider policy surface for Ollama: normalize provider configs used by
* core defaults/normalizers. This runs during config defaults application and
* normalization paths (not Zod validation).
*/
function normalizeConfig({ provider, providerConfig }) {
	if (!providerConfig || typeof providerConfig !== "object") return providerConfig;
	const normalizedProviderId = (provider ?? "").trim().toLowerCase();
	if (normalizedProviderId !== "ollama" && normalizedProviderId !== "ollama-cloud") return providerConfig;
	const baseUrl = typeof providerConfig.baseUrl === "string" && providerConfig.baseUrl.trim() ? providerConfig.baseUrl : normalizedProviderId === "ollama-cloud" ? OLLAMA_CLOUD_BASE_URL : OLLAMA_DEFAULT_BASE_URL;
	const remote = isHostedOllamaCloud(baseUrl) || normalizedProviderId === "ollama-cloud";
	const models = [];
	for (const model of providerConfig.models ?? []) {
		const cloudModel = resolveOllamaCloudDefaultModel(model.id);
		if (model.maxTokens !== void 0 || model.contextWindow === void 0 && !cloudModel) {
			models.push(model);
			continue;
		}
		const maxTokens = remote || isCloudModelRef(model.id) ? providerConfig.maxTokens ?? resolveOllamaOutputBudget({
			modelId: model.id,
			contextWindow: model.contextWindow,
			remote
		}) : void 0;
		models.push(maxTokens === void 0 ? model : {
			...model,
			maxTokens
		});
	}
	return {
		...providerConfig,
		baseUrl,
		models
	};
}
/**
* Runtime normalization only prepares compaction policy, not model-list fields.
* Skip full plugin activation for the unchanged configured-row projection.
*/
function projectConfiguredModelRow(ctx) {
	const provider = ctx.provider.trim().toLowerCase();
	return provider === "ollama" || provider === "ollama-cloud" ? null : void 0;
}
function resolveThinkingProfile({ modelId, provider, reasoning, api, thinkingLevelMap }) {
	const isCloudRoute = normalizeProviderId(provider) === "ollama-cloud" || isCloudModelRef(modelId);
	if (!(reasoning === true || reasoning === void 0 && isCloudRoute && supportsOllamaCloudFullThinkingEffort(modelId))) return OLLAMA_NON_REASONING_THINKING_PROFILE;
	if ((!api || api === "ollama") && thinkingLevelMap) return {
		...OLLAMA_REASONING_THINKING_PROFILE,
		levels: [
			{ id: "off" },
			...thinkingLevelMap.minimal === "minimal" ? [{ id: "minimal" }] : [],
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" },
			...thinkingLevelMap.xhigh === "xhigh" ? [{ id: "xhigh" }] : [],
			{ id: "max" }
		]
	};
	return OLLAMA_REASONING_THINKING_PROFILE;
}
//#endregion
export { resolveToolSearchMode as a, resolveThinkingProfile as i, normalizeResolvedModel as n, projectConfiguredModelRow as r, normalizeConfig as t };
