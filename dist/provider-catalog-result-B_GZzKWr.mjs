import { i as readRecordValue, n as copyRecordEntries, r as isRecordWithoutThrowing, t as copyArrayEntries } from "./safe-record-Bsq0ewSj.mjs";
//#region src/plugins/provider-catalog-result.ts
const PROVIDER_CATALOG_OUTCOME_STATUSES = /* @__PURE__ */ new Set([
	"ready",
	"auth-rejected",
	"unavailable"
]);
const MODEL_PROVIDER_CONFIG_KEYS = [
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
function copyModelServiceTiers(value) {
	return copyArrayEntries(value).flatMap((entry) => {
		const modelId = readRecordValue(entry, "modelId");
		const runtimeId = readRecordValue(entry, "runtimeId");
		const api = readRecordValue(entry, "api");
		const baseUrl = readRecordValue(entry, "baseUrl");
		const tiers = readRecordValue(entry, "serviceTiers");
		if (typeof modelId !== "string" || !modelId.trim() || typeof runtimeId !== "string" || !runtimeId.trim() || typeof api !== "string" || !api.trim() || typeof baseUrl !== "string" || !baseUrl.trim() || !Array.isArray(tiers)) return [];
		const serviceTiers = copyArrayEntries(tiers);
		if (!serviceTiers.every((tier) => typeof tier === "string" && Boolean(tier.trim()))) return [];
		return [{
			modelId: modelId.trim(),
			runtimeId: runtimeId.trim(),
			api: api.trim(),
			baseUrl: baseUrl.trim(),
			serviceTiers: [...new Set(serviceTiers.map((tier) => tier.trim()))]
		}];
	});
}
/** Copies valid, secret-free provider outcomes out of a catalog hook result. */
function copyProviderCatalogOutcomes(result) {
	return copyArrayEntries(readRecordValue(result, "outcomes")).flatMap((entry) => {
		if (!isRecordWithoutThrowing(entry)) return [];
		const provider = readRecordValue(entry, "provider");
		const profileId = readRecordValue(entry, "profileId");
		const rejectionScope = readRecordValue(entry, "rejectionScope");
		const status = readRecordValue(entry, "status");
		const rawModelOrder = readRecordValue(entry, "modelOrder");
		if (typeof provider !== "string" || provider.trim().length === 0 || profileId !== void 0 && (typeof profileId !== "string" || profileId.trim().length === 0) || rejectionScope !== void 0 && rejectionScope !== "catalog" || typeof status !== "string" || !PROVIDER_CATALOG_OUTCOME_STATUSES.has(status)) return [];
		const modelOrder = status === "ready" && rawModelOrder !== void 0 ? [...new Set(copyArrayEntries(rawModelOrder).flatMap((value) => typeof value === "string" && value.trim() ? [value.trim()] : []))] : [];
		return [{
			provider: provider.trim(),
			...typeof profileId === "string" ? { profileId: profileId.trim() } : {},
			...rejectionScope === "catalog" ? { rejectionScope } : {},
			status,
			...status === "ready" && readRecordValue(entry, "modelServiceTiers") !== void 0 ? { modelServiceTiers: copyModelServiceTiers(readRecordValue(entry, "modelServiceTiers")) } : {},
			...modelOrder.length > 0 ? { modelOrder } : {}
		}];
	});
}
/** Copies provider catalog result entries, using providerId for single-provider results. */
function copyProviderCatalogResultEntries(params) {
	const projection = copyProviderCatalogResultProjection(params.result);
	if (projection.kind === "provider") return [[params.providerId, projection.provider]];
	return projection.kind === "providers" ? projection.providers : [];
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
		models: copyArrayEntries(readRecordValue(providerConfig, "models")).flatMap((entry) => {
			const model = copyProviderCatalogModel(entry);
			return model ? [model] : [];
		})
	};
	for (const key of MODEL_PROVIDER_CONFIG_KEYS) {
		const value = readRecordValue(providerConfig, key);
		if (value !== void 0) copied[key] = value;
	}
	return copied;
}
//#endregion
export { copyProviderCatalogResultEntries as n, copyProviderCatalogResultProjection as r, copyProviderCatalogOutcomes as t };
