import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveCatalogOwnedModelCompat, n as modelTransportRoutesMatch } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { t as mergeModelCost } from "./model-cost-BNQWuFdo.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
//#region src/agents/models-config.merge.ts
/**
* Merges generated model-provider config with explicit user config and
* preserved secret fields. Setup and doctor flows use this boundary to update
* model catalogs without discarding existing credentials.
*/
function normalizeProviderMapKeys(providers) {
	const normalized = {};
	const canonicalKeys = /* @__PURE__ */ new Set();
	for (const [key, value] of Object.entries(providers ?? {})) {
		const providerKey = normalizeProviderId(key);
		if (!providerKey) continue;
		if (key === providerKey) {
			canonicalKeys.add(providerKey);
			delete normalized[providerKey];
			normalized[providerKey] = value;
			continue;
		}
		if (!canonicalKeys.has(providerKey)) normalized[providerKey] = value;
	}
	return normalized;
}
function buildSourceModelFields(sourceProviders) {
	return new Map(Object.entries(normalizeProviderMapKeys(sourceProviders)).flatMap(([providerId, provider]) => (provider.models ?? []).map((model) => [JSON.stringify([providerId, model.id.trim()]), {
		inputOmitted: !Object.hasOwn(model, "input"),
		cost: model.cost
	}])));
}
function getProviderModelId(model) {
	if (!model || typeof model !== "object") return "";
	const id = model.id;
	return normalizeOptionalString(id) ?? "";
}
function mergeProviderModels(implicit, explicit, options) {
	const implicitModels = Array.isArray(implicit.models) ? implicit.models : [];
	const explicitModels = Array.isArray(explicit.models) ? explicit.models : [];
	const implicitHeaders = isRecord(implicit.headers) ? implicit.headers : void 0;
	const explicitHeaders = isRecord(explicit.headers) ? explicit.headers : void 0;
	const mergeProviderFields = () => ({
		...implicit,
		...explicit,
		...implicitHeaders || explicitHeaders ? { headers: {
			...implicitHeaders,
			...explicitHeaders
		} } : {}
	});
	if (implicitModels.length === 0) return mergeProviderFields();
	const getModelId = (model) => options?.modelIdMatching === "exact" ? model.id : getProviderModelId(model);
	const implicitById = new Map(implicitModels.map((model) => [getModelId(model), model]).filter(([id]) => Boolean(id)));
	const seen = /* @__PURE__ */ new Set();
	const mergedModels = explicitModels.map((explicitModel) => {
		const id = getModelId(explicitModel);
		if (!id) return explicitModel;
		seen.add(id);
		const implicitModel = implicitById.get(id);
		if (!implicitModel) return explicitModel;
		const sourceFields = options?.sourceModelFields?.get(JSON.stringify([normalizeProviderId(options.providerId), id]));
		const cost = mergeModelCost(implicitModel.cost, sourceFields ? sourceFields.cost : explicitModel.cost);
		const input = sourceFields?.inputOmitted && implicitModel.input !== void 0 ? implicitModel.input : "input" in explicitModel ? explicitModel.input : implicitModel.input;
		const contextWindow = asPositiveFiniteNumber(explicitModel.contextWindow) ?? asPositiveFiniteNumber(implicitModel.contextWindow);
		const contextTokens = asPositiveFiniteNumber(explicitModel.contextTokens) ?? asPositiveFiniteNumber(implicitModel.contextTokens);
		const explicitMaxTokens = asPositiveFiniteNumber(explicitModel.maxTokens);
		const maxTokens = explicitMaxTokens ?? asPositiveFiniteNumber(implicitModel.maxTokens);
		const maxTokensSource = explicitMaxTokens === void 0 ? implicitModel.maxTokensSource : explicitModel.maxTokensSource;
		const catalogRoute = {
			api: implicitModel.api ?? implicit.api,
			baseUrl: implicitModel.baseUrl ?? implicit.baseUrl
		};
		const configuredRoute = {
			api: explicitModel.api ?? explicit.api ?? catalogRoute.api,
			baseUrl: explicitModel.baseUrl ?? explicit.baseUrl ?? catalogRoute.baseUrl
		};
		const compat = resolveCatalogOwnedModelCompat({
			catalogRoute,
			catalogCompat: implicitModel.compat,
			configuredRoute,
			configuredCompat: explicitModel.compat
		});
		const contextSelection = explicitModel.contextWindows ? explicitModel : modelTransportRoutesMatch(catalogRoute, configuredRoute) ? implicitModel : void 0;
		const { api: _api, baseUrl: _baseUrl, headers: _headers, maxTokensSource: _maxTokensSource, ...implicitMetadata } = implicitModel;
		return Object.assign({}, implicitMetadata, explicitModel, {
			input,
			cost,
			reasoning: `reasoning` in explicitModel ? explicitModel.reasoning : implicitModel.reasoning
		}, contextWindow === void 0 ? {} : { contextWindow }, contextTokens === void 0 ? {} : { contextTokens }, maxTokens === void 0 ? {} : { maxTokens }, maxTokensSource === void 0 ? {} : { maxTokensSource }, { compat }, {
			contextWindows: contextSelection?.contextWindows,
			contextWindowDefault: contextSelection?.contextWindowDefault
		});
	});
	for (const implicitModel of implicitModels) {
		const id = getModelId(implicitModel);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		mergedModels.push(implicitModel);
	}
	return {
		...mergeProviderFields(),
		models: mergedModels
	};
}
/** Merges implicit and explicit provider config maps by provider id. */
function mergeProviders(params) {
	const out = normalizeProviderMapKeys(params.implicit);
	for (const [providerKey, explicit] of Object.entries(normalizeProviderMapKeys(params.explicit))) {
		const implicit = out[providerKey];
		out[providerKey] = implicit ? mergeProviderModels(implicit, explicit, {
			providerId: providerKey,
			sourceModelFields: params.sourceModelFields
		}) : explicit;
	}
	return out;
}
function resolveProviderApi(entry) {
	return normalizeOptionalString(entry?.api);
}
function resolveModelApiSurface(entry) {
	if (!Array.isArray(entry?.models)) return;
	const apis = entry.models.flatMap((model) => {
		if (!model || typeof model !== "object") return [];
		const api = model.api;
		const normalized = normalizeOptionalString(api);
		return normalized ? [normalized] : [];
	}).toSorted();
	return apis.length > 0 ? JSON.stringify(apis) : void 0;
}
function resolveProviderApiSurface(entry) {
	return resolveProviderApi(entry) ?? resolveModelApiSurface(entry);
}
function shouldPreserveExistingApiKey(params) {
	const { providerKey, existing, nextEntry, secretRefManagedProviders } = params;
	const nextApiKey = typeof nextEntry.apiKey === "string" ? nextEntry.apiKey : "";
	if (nextApiKey && isNonSecretApiKeyMarker(nextApiKey)) return false;
	return !secretRefManagedProviders.has(providerKey) && typeof existing.apiKey === "string" && existing.apiKey.length > 0 && !isNonSecretApiKeyMarker(existing.apiKey, { includeEnvVarName: false });
}
function shouldPreserveExistingBaseUrl(params) {
	const { existing, nextEntry } = params;
	if (typeof existing.baseUrl !== "string" || existing.baseUrl.length === 0) return false;
	const existingApi = resolveProviderApiSurface(existing);
	const nextApi = resolveProviderApiSurface(nextEntry);
	return !existingApi || !nextApi || existingApi === nextApi;
}
function isWritableProviderConfig(entry) {
	if (!Array.isArray(entry.models) || entry.models.length === 0) return true;
	return Boolean(entry.baseUrl?.trim() && (entry.apiKey === void 0 || entry.apiKey));
}
/** Merges generated provider config with existing secrets safe to preserve. */
function mergeWithExistingProviderSecrets(params) {
	const { nextProviders, existingProviders, secretRefManagedProviders } = params;
	const normalizedExistingProviders = normalizeProviderMapKeys(existingProviders);
	const normalizedNextProviders = normalizeProviderMapKeys(nextProviders);
	const mergedProviders = {};
	for (const [key, entry] of Object.entries(normalizedExistingProviders)) {
		if (!isWritableProviderConfig(entry)) continue;
		mergedProviders[key] = entry;
	}
	for (const [key, newEntry] of Object.entries(normalizedNextProviders)) {
		const existing = normalizedExistingProviders[key];
		if (!existing) {
			mergedProviders[key] = newEntry;
			continue;
		}
		const preserved = {};
		if (shouldPreserveExistingApiKey({
			providerKey: key,
			existing,
			nextEntry: newEntry,
			secretRefManagedProviders
		})) preserved.apiKey = existing.apiKey;
		if (shouldPreserveExistingBaseUrl({
			existing,
			nextEntry: newEntry
		})) preserved.baseUrl = existing.baseUrl;
		mergedProviders[key] = {
			...newEntry,
			...preserved
		};
	}
	return mergedProviders;
}
//#endregion
export { mergeWithExistingProviderSecrets as a, mergeProviders as i, isWritableProviderConfig as n, normalizeProviderMapKeys as o, mergeProviderModels as r, buildSourceModelFields as t };
