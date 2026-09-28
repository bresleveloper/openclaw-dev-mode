import { i as readRecordValue, n as copyRecordEntries, r as isRecordWithoutThrowing, t as copyArrayEntries } from "./safe-record-CjQoFebO.mjs";
//#region src/plugins/provider-catalog-result.ts
const PROVIDER_CATALOG_OUTCOME_STATUSES = /* @__PURE__ */ new Set([
	"ready",
	"auth-rejected",
	"unavailable"
]);
const MODEL_PROVIDER_CONFIG_KEYS = [
	"baseUrl",
	"apiKey",
	"auth",
	"api",
	"maxTokens",
	"timeoutSeconds",
	"region",
	"injectNumCtxForOpenAICompat",
	"params",
	"agentRuntime",
	"localService",
	"headers",
	"authHeader",
	"request"
];
const MODEL_DEFINITION_CONFIG_KEYS = [
	"api",
	"baseUrl",
	"reasoning",
	"input",
	"cost",
	"contextWindow",
	"contextTokens",
	"maxTokens",
	"thinkingLevelMap",
	"params",
	"agentRuntime",
	"headers",
	"compat",
	"mediaInput",
	"metadataSource"
];
/** Copies provider config data out of a provider catalog result. */
function copyProviderCatalogResultProjection(result) {
	const provider = copyProviderCatalogProviderConfig(readRecordValue(result, "provider"));
	if (provider) return {
		kind: "provider",
		provider
	};
	const providers = copyRecordEntries(readRecordValue(result, "providers")).flatMap(([providerId, providerConfig]) => {
		const copied = copyProviderCatalogProviderConfig(providerConfig);
		return copied ? [[providerId, copied]] : [];
	});
	return providers.length > 0 ? {
		kind: "providers",
		providers
	} : { kind: "empty" };
}
/** Copies valid, secret-free provider outcomes out of a catalog hook result. */
function copyProviderCatalogOutcomes(result) {
	return copyArrayEntries(readRecordValue(result, "outcomes")).flatMap((entry) => {
		if (!isRecordWithoutThrowing(entry)) return [];
		const provider = readRecordValue(entry, "provider");
		const profileId = readRecordValue(entry, "profileId");
		const rejectionScope = readRecordValue(entry, "rejectionScope");
		const status = readRecordValue(entry, "status");
		if (typeof provider !== "string" || provider.trim().length === 0 || profileId !== void 0 && (typeof profileId !== "string" || profileId.trim().length === 0) || rejectionScope !== void 0 && rejectionScope !== "catalog" || typeof status !== "string" || !PROVIDER_CATALOG_OUTCOME_STATUSES.has(status)) return [];
		return [{
			provider: provider.trim(),
			...typeof profileId === "string" ? { profileId: profileId.trim() } : {},
			...rejectionScope === "catalog" ? { rejectionScope } : {},
			status
		}];
	});
}
/** Copies provider catalog result entries, using providerId for single-provider results. */
function copyProviderCatalogResultEntries(params) {
	const projection = copyProviderCatalogResultProjection(params.result);
	if (projection.kind === "provider") return [[params.providerId, projection.provider]];
	return projection.kind === "providers" ? projection.providers : [];
}
/** Copies model definitions from provider catalog provider config. */
function copyProviderCatalogModels(providerConfig) {
	const models = [];
	for (const entry of copyArrayEntries(readRecordValue(providerConfig, "models"))) {
		const copied = copyProviderCatalogModel(entry);
		if (copied) models.push(copied);
	}
	return models;
}
function copyProviderCatalogModel(model) {
	if (!isRecordWithoutThrowing(model)) return;
	const id = readRecordValue(model, "id");
	const name = readRecordValue(model, "name");
	if (typeof id !== "string") return;
	const copied = {
		id,
		name: typeof name === "string" ? name : id
	};
	for (const key of MODEL_DEFINITION_CONFIG_KEYS) {
		const value = readRecordValue(model, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
/** Copies the supported provider config fields from a provider catalog result. */
function copyProviderCatalogProviderConfig(providerConfig) {
	if (!isRecordWithoutThrowing(providerConfig)) return;
	const baseUrl = readRecordValue(providerConfig, "baseUrl");
	if (typeof baseUrl !== "string") return;
	const copied = {
		baseUrl,
		models: copyProviderCatalogModels(providerConfig)
	};
	for (const key of MODEL_PROVIDER_CONFIG_KEYS) {
		if (key === "baseUrl") continue;
		const value = readRecordValue(providerConfig, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
//#endregion
export { copyProviderCatalogResultEntries as n, copyProviderCatalogResultProjection as r, copyProviderCatalogOutcomes as t };
