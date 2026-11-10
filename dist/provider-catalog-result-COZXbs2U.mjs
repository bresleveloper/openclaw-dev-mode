import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/shared/safe-record.ts
/**
* Plugin values may use Proxy traps that throw during `Array.isArray`; keep this guard
* exception-safe so untrusted-plugin inspection cannot escape into the host.
*/
function isRecordWithoutThrowing(value) {
	try {
		return Boolean(value && typeof value === "object" && !Array.isArray(value));
	} catch {
		return false;
	}
}
/** Read one property from a record-like value without letting traps escape. */
function readRecordValue(value, key) {
	if (!isRecordWithoutThrowing(value)) return;
	try {
		return value[key];
	} catch {
		return;
	}
}
/** Copy array entries defensively from values that may throw on length/index access. */
function copyArrayEntries(value) {
	let arrayValue;
	let length;
	try {
		if (!Array.isArray(value)) return [];
		arrayValue = value;
		length = arrayValue.length;
	} catch {
		return [];
	}
	const entries = [];
	for (let index = 0; index < length; index += 1) try {
		entries.push(arrayValue[index]);
	} catch {
		continue;
	}
	return entries;
}
/** Copy record entries whose values are also record-shaped. */
function copyRecordEntries(value) {
	if (!isRecordWithoutThrowing(value)) return [];
	let keys;
	try {
		keys = Object.keys(value);
	} catch {
		return [];
	}
	const entries = [];
	for (const key of keys) {
		const entry = readRecordValue(value, key);
		if (isRecordWithoutThrowing(entry)) entries.push([key, entry]);
	}
	return entries;
}
//#endregion
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
		const modelId = normalizeOptionalString(readRecordValue(entry, "modelId"));
		const runtimeId = normalizeOptionalString(readRecordValue(entry, "runtimeId"));
		const api = normalizeOptionalString(readRecordValue(entry, "api"));
		const baseUrl = normalizeOptionalString(readRecordValue(entry, "baseUrl"));
		const tiers = readRecordValue(entry, "serviceTiers");
		if (!modelId || !runtimeId || !api || !baseUrl || !Array.isArray(tiers)) return [];
		const serviceTiers = copyArrayEntries(tiers);
		if (!serviceTiers.every((tier) => typeof tier === "string" && Boolean(tier.trim()))) return [];
		return [{
			modelId,
			runtimeId,
			api,
			baseUrl,
			serviceTiers: [...new Set(serviceTiers.map((tier) => tier.trim()))]
		}];
	});
}
function copyModelIds(value) {
	return [...new Set(copyArrayEntries(value).flatMap((id) => typeof id === "string" && id.trim() ? [id.trim()] : []))];
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
		const rawListedModelIds = readRecordValue(entry, "listedModelIds");
		const modelIdCatalog = readRecordValue(entry, "modelIdCatalog");
		const catalogBaseUrl = readRecordValue(modelIdCatalog, "baseUrl");
		const catalogModelIds = readRecordValue(modelIdCatalog, "modelIds");
		const catalogAliases = readRecordValue(modelIdCatalog, "aliases");
		if (typeof provider !== "string" || provider.trim().length === 0 || profileId !== void 0 && (typeof profileId !== "string" || profileId.trim().length === 0) || rejectionScope !== void 0 && rejectionScope !== "catalog" || typeof status !== "string" || !PROVIDER_CATALOG_OUTCOME_STATUSES.has(status)) return [];
		const ready = status === "ready";
		const modelOrder = ready && rawModelOrder !== void 0 ? copyModelIds(rawModelOrder) : [];
		return [{
			provider: provider.trim(),
			...typeof profileId === "string" ? { profileId: profileId.trim() } : {},
			...rejectionScope === "catalog" ? { rejectionScope } : {},
			status,
			...status === "ready" && readRecordValue(entry, "modelServiceTiers") !== void 0 ? { modelServiceTiers: copyModelServiceTiers(readRecordValue(entry, "modelServiceTiers")) } : {},
			...modelOrder.length > 0 ? { modelOrder } : {},
			...ready && Array.isArray(rawListedModelIds) ? { listedModelIds: copyModelIds(rawListedModelIds) } : {},
			...ready && typeof catalogBaseUrl === "string" && Array.isArray(catalogModelIds) ? { modelIdCatalog: {
				baseUrl: catalogBaseUrl,
				modelIds: copyModelIds(catalogModelIds),
				...Array.isArray(catalogAliases) ? { aliases: copyModelIds(catalogAliases) } : {}
			} } : {}
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
export { isRecordWithoutThrowing as a, copyArrayEntries as i, copyProviderCatalogResultEntries as n, readRecordValue as o, copyProviderCatalogResultProjection as r, copyProviderCatalogOutcomes as t };
