import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as isCloudModelRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { m as isOllamaCloudOrigin, o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-Dkg1KktH.mjs";
import { t as supportsOllamaCloudFullThinkingEffort } from "./model-reasoning-B-JcH6mc.mjs";
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
	const next = { ...providerConfig };
	if (typeof next.baseUrl !== "string" || !next.baseUrl.trim()) next.baseUrl = OLLAMA_DEFAULT_BASE_URL;
	if (!Array.isArray(next.models)) next.models = [];
	return next;
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
