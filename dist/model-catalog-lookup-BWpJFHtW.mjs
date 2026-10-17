import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { r as isModelThinkingFormat } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import "./types.models-BqvzicE8.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { i as resolveProviderModelPolicySurface, r as resolveProviderModelCatalogId } from "./provider-model-routes-CRUmK7A5.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-DaPsySrY.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-CVmOODN3.mjs";
//#region src/agents/model-catalog-lookup.ts
/**
* Looks up model catalog entries and input capability support.
*/
/** Projects only thinking policy fields from broader model compatibility metadata. */
function projectModelThinkingCompat(compat) {
	const record = asOptionalRecord(compat);
	if (!record) return;
	const projected = {};
	if (typeof record.thinkingFormat === "string" && isModelThinkingFormat(record.thinkingFormat)) projected.thinkingFormat = record.thinkingFormat;
	if (record.supportedReasoningEfforts === null) projected.supportedReasoningEfforts = null;
	else if (Array.isArray(record.supportedReasoningEfforts) && record.supportedReasoningEfforts.every((effort) => typeof effort === "string")) projected.supportedReasoningEfforts = [...record.supportedReasoningEfforts];
	return Object.keys(projected).length > 0 ? projected : void 0;
}
/** Freezes thinking capability from the selected prepared catalog row. */
function prepareModelThinkingCapability(params) {
	const compat = projectModelThinkingCompat(params.entry?.compat);
	const provider = normalizeProviderId(params.entry?.provider ?? "");
	const modelId = normalizeOptionalString(params.entry?.id);
	const agentRuntime = normalizeLowercaseStringOrEmpty(params.agentRuntime);
	if (!compat || !provider || !modelId || !agentRuntime) return;
	const routeSource = params.route ?? (agentRuntime === "openclaw" ? params.entry : void 0);
	const api = normalizeOptionalString(routeSource?.api);
	const baseUrl = normalizeOptionalString(routeSource?.baseUrl);
	if (agentRuntime === "openclaw" && (!api || !baseUrl)) return;
	return {
		provider,
		modelId,
		agentRuntime,
		...api && baseUrl ? { route: {
			api,
			baseUrl
		} } : {},
		compat
	};
}
/** Resolves prepared thinking metadata only for the exact final model route and harness. */
function resolvePreparedModelThinkingCompat(params) {
	const capability = params.capability;
	if (!capability) return;
	const runtimeModelId = canonicalizeProviderModelId(capability.provider, params.model.id);
	const preparedModelId = canonicalizeProviderModelId(capability.provider, capability.modelId);
	if (normalizeProviderId(params.model.provider) !== capability.provider || runtimeModelId !== preparedModelId || normalizeLowercaseStringOrEmpty(params.agentRuntime) !== capability.agentRuntime || capability.route && !modelTransportRoutesMatch(params.model, capability.route)) return;
	const { supportedReasoningEfforts: efforts, ...compat } = capability.compat;
	if (efforts === void 0) return compat;
	const routeEfforts = projectModelThinkingCompat(params.model.compat)?.supportedReasoningEfforts;
	const enabledEfforts = efforts?.filter((effort) => effort !== "none");
	return {
		...compat,
		supportedReasoningEfforts: capability.route ? efforts?.slice() : routeEfforts?.includes("none") ? ["none", ...enabledEfforts ?? []] : enabledEfforts
	};
}
/** Projects the prepared capabilities needed by one selected run candidate. */
function prepareModelRunCapabilities([catalog, configuredCatalog], [provider, modelId, agentRuntime]) {
	const entry = findModelInCatalog(catalog ?? [], provider, modelId);
	const configuredEntry = findModelInCatalog(configuredCatalog, provider, modelId);
	return {
		modelHasVision: modelSupportsInput(entry, "image"),
		modelThinkingCapability: prepareModelThinkingCapability({
			entry: entry ?? configuredEntry,
			route: agentRuntime === "openclaw" ? configuredEntry ?? entry : void 0,
			agentRuntime
		})
	};
}
/** Returns whether a catalog entry declares support for an input modality. */
function modelSupportsInput(entry, input) {
	return entry?.input?.includes(input) ?? false;
}
/** Prefers canonical identity; the shipped SDK's case-insensitive fallback must be unique. */
function findModelInCatalog(catalog, provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider);
	const trimmedModelId = modelId.trim();
	const providerCatalog = [];
	let literal;
	catalog.some((entry) => {
		if (normalizeProviderId(entry.provider) !== normalizedProvider) return false;
		if (entry.id === trimmedModelId) {
			literal = entry;
			return true;
		}
		providerCatalog.push(entry);
		return false;
	});
	if (literal) return literal;
	const surface = resolveProviderModelPolicySurface(normalizedProvider);
	const identityOf = (id) => resolveProviderModelCatalogId({
		provider: normalizedProvider,
		modelId: splitTrailingAuthProfile(id).model,
		surface
	}) ?? id;
	const identity = identityOf(trimmedModelId);
	const exact = providerCatalog.find((entry) => identityOf(entry.id) === identity);
	if (exact) return exact;
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const matches = providerCatalog.filter((entry) => normalizeLowercaseStringOrEmpty(entry.id) === normalizedModelId);
	return matches.length === 1 ? matches[0] : void 0;
}
/** Finds a model entry, requiring uniqueness when provider is omitted. */
function findModelCatalogEntry(catalog, params) {
	const modelId = normalizeOptionalString(params.modelId) ?? "";
	if (!modelId) return;
	const provider = normalizeOptionalString(params.provider);
	if (provider) return findModelInCatalog(catalog, provider, modelId);
	const keyOf = createModelCatalogIdentityKeyResolver();
	const exact = catalog.filter((entry) => keyOf(entry) === keyOf({
		provider: entry.provider,
		id: modelId
	}));
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const matches = exact.length ? exact : catalog.filter((entry) => normalizeLowercaseStringOrEmpty(entry.id) === normalizedModelId);
	return matches.length === 1 ? matches[0] : void 0;
}
//#endregion
export { projectModelThinkingCompat as a, prepareModelRunCapabilities as i, findModelInCatalog as n, resolvePreparedModelThinkingCompat as o, modelSupportsInput as r, findModelCatalogEntry as t };
