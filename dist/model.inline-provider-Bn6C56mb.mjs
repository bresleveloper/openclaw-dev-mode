import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./defaults-Jag53zwP.mjs";
import { s as resolveMergedModelProviderModels } from "./model-provider-config-C5LPYz3z.mjs";
import { t as isStringOption } from "./string-readers-V5CfgPTP.mjs";
import { t as MODEL_APIS } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-UF9QYDzr.mjs";
import { n as attachModelProviderRequestRouteFacts, p as sanitizeConfiguredModelProviderRequest, r as attachModelProviderRequestTransport, u as resolveProviderRequestConfig } from "./provider-request-config-By9R9pyt.mjs";
import { l as isSecretRefHeaderValueMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { n as normalizeGoogleApiBaseUrl } from "./google-api-base-url-DVjll0O0.mjs";
import { t as attachModelProviderLocalService } from "./provider-local-service-ucCbK8nV.mjs";
//#region src/agents/embedded-agent-runner/model.inline-provider.ts
/**
* Converts inline provider model config into runtime model definitions.
*/
/** Returns a supported transport API id from raw config values. */
function normalizeResolvedTransportApi(api) {
	return isStringOption(api, MODEL_APIS) ? api : void 0;
}
/** Sanitizes configured provider/model headers before they enter runtime model metadata. */
function sanitizeModelHeaders(headers) {
	if (!headers || typeof headers !== "object" || Array.isArray(headers)) return;
	const next = {};
	for (const [headerName, headerValue] of Object.entries(headers)) {
		if (typeof headerValue !== "string") continue;
		if (isSecretRefHeaderValueMarker(headerValue)) continue;
		next[headerName] = headerValue;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
function isLegacyFoundryVisionModelCandidate(params) {
	if (normalizeOptionalLowercaseString(params.provider) !== "microsoft-foundry") return false;
	return [params.modelId, params.modelName].filter((value) => typeof value === "string").map((value) => normalizeOptionalLowercaseString(value)).filter((value) => Boolean(value)).some((candidate) => candidate.startsWith("gpt-") || candidate.startsWith("o1") || candidate.startsWith("o3") || candidate.startsWith("o4") || candidate === "computer-use-preview");
}
/** Resolves model input modalities with Foundry legacy vision-model compatibility. */
function resolveProviderModelInput(params) {
	const resolvedInput = Array.isArray(params.input) ? params.input : params.fallbackInput;
	const normalizedInput = Array.isArray(resolvedInput) ? resolvedInput.filter((item) => item === "text" || item === "image") : [];
	if (normalizedInput.length > 0 && !normalizedInput.includes("image") && isLegacyFoundryVisionModelCandidate(params)) return ["text", "image"];
	return normalizedInput.length > 0 ? normalizedInput : ["text"];
}
function buildInlineProviderModels(providers, options = {}) {
	return Object.entries(providers).flatMap(([providerId, entry]) => {
		const trimmed = providerId.trim();
		if (!trimmed) return [];
		const providerHeaders = sanitizeModelHeaders(entry?.headers);
		const providerRequest = sanitizeConfiguredModelProviderRequest(entry?.request);
		const models = resolveMergedModelProviderModels({
			models: entry?.models,
			normalizeModelId: (modelId) => modelId.trim()
		});
		return Array.from(models.values()).map((model) => {
			const api = normalizeResolvedTransportApi(model.api ?? entry?.api);
			const configuredBaseUrl = model.baseUrl ?? entry?.baseUrl;
			const baseUrl = api === "google-generative-ai" ? normalizeGoogleApiBaseUrl(configuredBaseUrl) : configuredBaseUrl;
			const modelHeaders = sanitizeModelHeaders(model.headers);
			const requestConfig = resolveProviderRequestConfig({
				provider: trimmed,
				api: api ?? model.api,
				baseUrl,
				...options.providerMetadataOwners ? { providerMetadataOwners: options.providerMetadataOwners } : {},
				providerHeaders,
				modelHeaders,
				authHeader: entry?.authHeader,
				request: providerRequest,
				capability: "llm",
				transport: "stream"
			});
			const maxTokens = model.maxTokens ?? entry?.maxTokens;
			return attachModelProviderRequestRouteFacts(attachModelProviderLocalService(attachModelProviderRequestTransport({
				...model,
				...maxTokens !== void 0 ? { maxTokens } : {},
				input: resolveProviderModelInput({
					provider: trimmed,
					modelId: model.id,
					modelName: model.name,
					input: model.input
				}),
				provider: trimmed,
				baseUrl: requestConfig.baseUrl ?? baseUrl,
				api: requestConfig.api ?? model.api,
				headers: requestConfig.headers
			}, providerRequest), entry?.localService), options.providerMetadataOwners);
		});
	});
}
/** Completes captured inline definitions with the same contract used by static catalogs. */
function completeInlineProviderModel(model, providerConfig) {
	return {
		...model,
		name: model.name || model.id,
		api: model.api ?? providerConfig.api ?? "openai-responses",
		baseUrl: model.baseUrl ?? "",
		reasoning: model.reasoning ?? false,
		input: resolveProviderModelInput({
			provider: model.provider,
			modelId: model.id,
			modelName: model.name,
			input: model.input
		}),
		cost: model.cost ?? normalizeResolvedPricing({}),
		contextWindow: model.contextWindow ?? Math.max(model.contextTokens ?? 0, 2e5),
		...model.contextWindow === void 0 ? { contextWindowSource: "synthetic" } : {},
		contextTokens: model.contextTokens,
		maxTokens: model.maxTokens ?? 2e5,
		...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {}
	};
}
//#endregion
export { sanitizeModelHeaders as a, resolveProviderModelInput as i, completeInlineProviderModel as n, normalizeResolvedTransportApi as r, buildInlineProviderModels as t };
