import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as isCloudModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { m as isOllamaCloudOrigin, o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-Dkg1KktH.mjs";
import { n as supportsOllamaCloudFullThinkingEffort } from "./model-reasoning-BxIAfSxy.mjs";
import { n as resolveOllamaBaseUrlForRun, t as readProviderBaseUrl } from "./provider-base-url-Crmh7W8f.mjs";
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
	if ((provider ?? "").trim().toLowerCase() !== "ollama") return providerConfig;
	return {
		...providerConfig,
		baseUrl: typeof providerConfig.baseUrl === "string" && providerConfig.baseUrl.trim() ? providerConfig.baseUrl : OLLAMA_DEFAULT_BASE_URL,
		models: Array.isArray(providerConfig.models) ? providerConfig.models : []
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
function resolveThinkingProfile({ modelId, provider, reasoning }) {
	const isCloudRoute = normalizeProviderId(provider) === "ollama-cloud" || isCloudModelRef(modelId);
	return reasoning === true || reasoning === void 0 && isCloudRoute && supportsOllamaCloudFullThinkingEffort(modelId) ? OLLAMA_REASONING_THINKING_PROFILE : OLLAMA_NON_REASONING_THINKING_PROFILE;
}
//#endregion
export { resolveToolSearchMode as a, resolveThinkingProfile as i, normalizeResolvedModel as n, projectConfiguredModelRow as r, normalizeConfig as t };
