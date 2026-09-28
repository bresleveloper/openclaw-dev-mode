import { l as asNonNegativeFiniteNumber, s as asFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList, s as normalizeOptionalTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as buildModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { n as MODEL_CATALOG_THINKING_LEVELS, r as isModelCatalogThinkingFormat, t as MODEL_CATALOG_APIS } from "./model-catalog-types-DqmfsVmo.mjs";
//#region packages/model-catalog-core/src/model-catalog-context-windows.ts
function normalizePositiveInteger$1(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogContextWindows(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const contextWindows = value.slice(0, 16).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const id = normalizeOptionalString(entry.id) ?? "";
		const label = normalizeOptionalString(entry.label) ?? "";
		const contextWindow = normalizePositiveInteger$1(entry.contextWindow);
		if (!id || !label || contextWindow === void 0 || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			label,
			contextWindow
		}];
	});
	return contextWindows.length > 0 ? contextWindows.toSorted((left, right) => left.contextWindow - right.contextWindow || left.id.localeCompare(right.id)) : void 0;
}
function normalizeModelCatalogContextWindowDefault(value, contextWindows) {
	const contextWindowDefault = normalizeOptionalString(value);
	return contextWindowDefault && contextWindows?.some((option) => option.id === contextWindowDefault) ? contextWindowDefault : void 0;
}
function normalizeModelCatalogContextWindowSelection(value) {
	const contextWindows = normalizeModelCatalogContextWindows(value.contextWindows);
	const contextWindowDefault = normalizeModelCatalogContextWindowDefault(value.contextWindowDefault, contextWindows);
	return contextWindows && contextWindowDefault ? {
		contextWindows,
		contextWindowDefault
	} : {};
}
//#endregion
//#region packages/model-catalog-core/src/model-catalog-normalize.ts
const MODEL_CATALOG_INPUTS = /* @__PURE__ */ new Set([
	"text",
	"image",
	"document"
]);
const MODEL_CATALOG_DISCOVERY_MODES = /* @__PURE__ */ new Set([
	"static",
	"refreshable",
	"runtime"
]);
const MODEL_CATALOG_STATUSES = /* @__PURE__ */ new Set([
	"available",
	"preview",
	"deprecated",
	"disabled"
]);
const MODEL_CATALOG_API_SET = new Set(MODEL_CATALOG_APIS);
const DEFAULT_MODEL_INPUT = ["text"];
const DEFAULT_MODEL_STATUS = "available";
/** Reject object keys that can mutate prototypes when copied into records. */
function isBlockedObjectKey(key) {
	return key === "__proto__" || key === "prototype" || key === "constructor";
}
function normalizeModelCatalogThinkingLevelMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const level of MODEL_CATALOG_THINKING_LEVELS) {
		const mapped = value[level];
		if (mapped === null) {
			normalized[level] = null;
			continue;
		}
		const normalizedValue = normalizeOptionalString(mapped);
		if (normalizedValue !== void 0) normalized[level] = normalizedValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeSafeRecordKey(value) {
	const key = normalizeOptionalString(value) ?? "";
	return key && !isBlockedObjectKey(key) ? key : "";
}
function normalizeOwnedProviderSet(providers) {
	const normalized = /* @__PURE__ */ new Set();
	for (const provider of providers) {
		const providerId = normalizeProviderId(provider);
		if (providerId) normalized.add(providerId);
	}
	return normalized;
}
function normalizeStringMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeSafeRecordKey(rawKey);
		const mapValue = normalizeOptionalString(rawValue) ?? "";
		if (key && mapValue) normalized[key] = mapValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function mergeStringMaps(base, override) {
	if (!base && !override) return;
	return {
		...base,
		...override
	};
}
function normalizeModelCatalogApi(value) {
	const api = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_API_SET.has(api) ? api : void 0;
}
function normalizeModelCatalogInputs(value) {
	const inputs = normalizeTrimmedStringList(value).filter((input) => MODEL_CATALOG_INPUTS.has(input));
	return inputs.length > 0 ? inputs : void 0;
}
function normalizePositiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogTieredCost(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry) || !Array.isArray(entry.range)) continue;
		const input = asNonNegativeFiniteNumber(entry.input);
		const output = asNonNegativeFiniteNumber(entry.output);
		const cacheRead = asNonNegativeFiniteNumber(entry.cacheRead);
		const cacheWrite = asNonNegativeFiniteNumber(entry.cacheWrite);
		if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0 || entry.range.length < 1 || entry.range.length > 2) continue;
		const rangeValues = entry.range.map((rangeValue) => asNonNegativeFiniteNumber(rangeValue));
		if (rangeValues.some((rangeValue) => rangeValue === void 0)) continue;
		normalized.push({
			input,
			output,
			cacheRead,
			cacheWrite,
			range: rangeValues.length === 1 ? [rangeValues[0]] : [rangeValues[0], rangeValues[1]]
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeModelCatalogCost(value) {
	if (!isRecord(value)) return;
	const input = asNonNegativeFiniteNumber(value.input);
	const output = asNonNegativeFiniteNumber(value.output);
	const cacheRead = asNonNegativeFiniteNumber(value.cacheRead);
	const cacheWrite = asNonNegativeFiniteNumber(value.cacheWrite);
	const tieredPricing = normalizeModelCatalogTieredCost(value.tieredPricing);
	const cost = {
		...input !== void 0 ? { input } : {},
		...output !== void 0 ? { output } : {},
		...cacheRead !== void 0 ? { cacheRead } : {},
		...cacheWrite !== void 0 ? { cacheWrite } : {},
		...tieredPricing ? { tieredPricing } : {}
	};
	return Object.keys(cost).length > 0 ? cost : void 0;
}
function normalizeOpenRouterPrice(value) {
	if (!isRecord(value)) return;
	const maxPrice = {};
	for (const field of [
		"prompt",
		"completion",
		"image",
		"audio",
		"request"
	]) {
		const candidate = value[field];
		const normalized = normalizeOptionalString(candidate) ?? asFiniteNumber(candidate);
		if (normalized !== void 0) maxPrice[field] = normalized;
	}
	return Object.keys(maxPrice).length > 0 ? maxPrice : void 0;
}
function normalizeOpenRouterMetricPreference(value) {
	const numeric = asFiniteNumber(value);
	if (numeric !== void 0) return numeric;
	if (!isRecord(value)) return;
	const normalized = {};
	for (const field of [
		"p50",
		"p75",
		"p90",
		"p99"
	]) {
		const cutoff = asFiniteNumber(value[field]);
		if (cutoff !== void 0) normalized[field] = cutoff;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterSort(value) {
	const sort = normalizeOptionalString(value);
	if (sort) return sort;
	if (!isRecord(value)) return;
	const by = normalizeOptionalString(value.by);
	const partition = value.partition === null ? null : normalizeOptionalString(value.partition) ?? void 0;
	const normalized = {
		...by ? { by } : {},
		...partition !== void 0 ? { partition } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterRouting(value) {
	if (!isRecord(value)) return;
	const routing = {
		...typeof value.allow_fallbacks === "boolean" ? { allow_fallbacks: value.allow_fallbacks } : {},
		...typeof value.require_parameters === "boolean" ? { require_parameters: value.require_parameters } : {},
		...value.data_collection === "deny" || value.data_collection === "allow" ? { data_collection: value.data_collection } : {},
		...typeof value.zdr === "boolean" ? { zdr: value.zdr } : {},
		...typeof value.enforce_distillable_text === "boolean" ? { enforce_distillable_text: value.enforce_distillable_text } : {}
	};
	for (const field of [
		"order",
		"only",
		"ignore",
		"quantizations"
	]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	const sort = normalizeOpenRouterSort(value.sort);
	if (sort) routing.sort = sort;
	const maxPrice = normalizeOpenRouterPrice(value.max_price);
	if (maxPrice) routing.max_price = maxPrice;
	for (const field of ["preferred_min_throughput", "preferred_max_latency"]) {
		const normalized = normalizeOpenRouterMetricPreference(value[field]);
		if (normalized !== void 0) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeVercelGatewayRouting(value) {
	if (!isRecord(value)) return;
	const routing = {};
	for (const field of ["only", "order"]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeModelCatalogCompat(value) {
	if (!isRecord(value)) return;
	const compat = {};
	for (const field of [
		"supportsStore",
		"supportsPromptCacheKey",
		"supportsDeveloperRole",
		"supportsReasoningEffort",
		"supportsTemperature",
		"supportsInstructions",
		"supportsUsageInStreaming",
		"supportsTools",
		"supportsStrictMode",
		"supportsJsonSchemaResponseFormat",
		"requiresStringContent",
		"strictMessageKeys",
		"requiresToolResultName",
		"requiresAssistantAfterToolResult",
		"requiresThinkingAsText",
		"requiresReasoningContentOnAssistantMessages",
		"zaiToolStream",
		"sendSessionAffinityHeaders",
		"sendSessionIdHeader",
		"supportsEagerToolInputStreaming",
		"supportsLongCacheRetention",
		"supportsResponsesContinuation",
		"requiresOpenAiAnthropicToolPayload"
	]) if (typeof value[field] === "boolean") compat[field] = value[field];
	for (const field of ["toolSchemaProfile", "toolCallArgumentsEncoding"]) {
		const normalized = normalizeOptionalString(value[field]) ?? "";
		if (normalized) compat[field] = normalized;
	}
	for (const field of [
		"visibleReasoningDetailTypes",
		"supportedReasoningEfforts",
		"unsupportedToolSchemaKeywords"
	]) {
		const normalized = normalizeTrimmedStringList(value[field]);
		if (normalized.length > 0 || field === "supportedReasoningEfforts" && Array.isArray(value[field])) compat[field] = normalized;
	}
	if (isRecord(value.reasoningEffortMap)) {
		const reasoningEffortMap = Object.fromEntries(Object.entries(value.reasoningEffortMap).flatMap(([rawKey, rawMapped]) => {
			const key = rawKey.trim();
			const mapped = typeof rawMapped === "string" ? rawMapped.trim() : "";
			return key && mapped ? [[key, mapped]] : [];
		}));
		if (Object.keys(reasoningEffortMap).length > 0) compat.reasoningEffortMap = reasoningEffortMap;
	}
	const codeMode = normalizeOptionalString(value.codeMode) ?? "";
	if (codeMode === "preferred" || codeMode === "capable") compat.codeMode = codeMode;
	const maxTokensField = normalizeOptionalString(value.maxTokensField) ?? "";
	if (maxTokensField === "max_completion_tokens" || maxTokensField === "max_tokens") compat.maxTokensField = maxTokensField;
	const thinkingFormat = normalizeOptionalString(value.thinkingFormat) ?? "";
	if (isModelCatalogThinkingFormat(thinkingFormat)) compat.thinkingFormat = thinkingFormat;
	if (value.cacheControlFormat === "anthropic") compat.cacheControlFormat = "anthropic";
	const openRouterRouting = normalizeOpenRouterRouting(value.openRouterRouting);
	if (openRouterRouting) compat.openRouterRouting = openRouterRouting;
	const vercelGatewayRouting = normalizeVercelGatewayRouting(value.vercelGatewayRouting);
	if (vercelGatewayRouting) compat.vercelGatewayRouting = vercelGatewayRouting;
	return Object.keys(compat).length > 0 ? compat : void 0;
}
function normalizeModelCatalogStatus(value) {
	const status = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_STATUSES.has(status) ? status : void 0;
}
function normalizeModelCatalogImageTokenMode(value) {
	const tokenMode = normalizeOptionalString(value) ?? "";
	if (tokenMode === "tile" || tokenMode === "detail" || tokenMode === "provider") return tokenMode;
}
function normalizeModelCatalogMediaInput(value) {
	if (!isRecord(value) || !isRecord(value.image)) return;
	const maxBytes = normalizePositiveInteger(value.image.maxBytes);
	const maxPixels = normalizePositiveInteger(value.image.maxPixels);
	const maxSidePx = normalizePositiveInteger(value.image.maxSidePx);
	const preferredSidePx = normalizePositiveInteger(value.image.preferredSidePx);
	const tokenMode = normalizeModelCatalogImageTokenMode(value.image.tokenMode);
	const normalizedImage = {
		...maxBytes !== void 0 ? { maxBytes } : {},
		...maxPixels !== void 0 ? { maxPixels } : {},
		...maxSidePx !== void 0 ? { maxSidePx } : {},
		...preferredSidePx !== void 0 ? { preferredSidePx } : {},
		...tokenMode ? { tokenMode } : {}
	};
	return Object.keys(normalizedImage).length > 0 ? { image: normalizedImage } : void 0;
}
function normalizeModelCatalogModel(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id) ?? "";
	if (!id) return;
	const name = normalizeOptionalString(value.name) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const headers = normalizeStringMap(value.headers);
	const input = normalizeModelCatalogInputs(value.input);
	const reasoning = typeof value.reasoning === "boolean" ? value.reasoning : void 0;
	const contextWindow = asPositiveFiniteNumber(value.contextWindow);
	const contextWindowSelection = normalizeModelCatalogContextWindowSelection(value);
	const contextTokens = normalizePositiveInteger(value.contextTokens);
	const maxTokens = asPositiveFiniteNumber(value.maxTokens);
	const thinkingLevelMap = normalizeModelCatalogThinkingLevelMap(value.thinkingLevelMap);
	const cost = normalizeModelCatalogCost(value.cost);
	const compat = normalizeModelCatalogCompat(value.compat);
	const mediaInput = normalizeModelCatalogMediaInput(value.mediaInput);
	const status = normalizeModelCatalogStatus(value.status);
	const statusReason = normalizeOptionalString(value.statusReason) ?? "";
	const replaces = normalizeTrimmedStringList(value.replaces);
	const replacedBy = normalizeOptionalString(value.replacedBy) ?? "";
	const tags = normalizeTrimmedStringList(value.tags);
	return {
		id,
		...name ? { name } : {},
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {},
		...headers ? { headers } : {},
		...input ? { input } : {},
		...reasoning !== void 0 ? { reasoning } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...contextWindowSelection,
		...contextTokens !== void 0 ? { contextTokens } : {},
		...maxTokens !== void 0 ? { maxTokens } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {},
		...cost ? { cost } : {},
		...compat ? { compat } : {},
		...mediaInput ? { mediaInput } : {},
		...status ? { status } : {},
		...statusReason ? { statusReason } : {},
		...replaces.length > 0 ? { replaces } : {},
		...replacedBy ? { replacedBy } : {},
		...tags.length > 0 ? { tags } : {}
	};
}
function normalizeModelCatalogProvider(value) {
	if (!isRecord(value)) return;
	const models = Array.isArray(value.models) ? value.models.map((entry) => normalizeModelCatalogModel(entry)).filter((entry) => Boolean(entry)) : [];
	if (models.length === 0) return;
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const headers = normalizeStringMap(value.headers);
	const defaultModel = normalizeOptionalString(value.defaultModel) ?? "";
	const defaultUtilityModel = normalizeOptionalString(value.defaultUtilityModel) ?? "";
	return {
		...baseUrl ? { baseUrl } : {},
		...api ? { api } : {},
		...headers ? { headers } : {},
		...defaultModel ? { defaultModel } : {},
		...defaultUtilityModel ? { defaultUtilityModel } : {},
		models
	};
}
function normalizeModelCatalogProviders(value, ownedProviders) {
	if (!isRecord(value)) return;
	const providers = {};
	for (const [rawProviderId, rawProvider] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		if (!providerId || !ownedProviders.has(providerId)) continue;
		const provider = normalizeModelCatalogProvider(rawProvider);
		if (provider) providers[providerId] = provider;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeModelCatalogAliases(value, ownedProviders) {
	if (!isRecord(value)) return;
	const aliases = {};
	for (const [rawAlias, rawTarget] of Object.entries(value)) {
		const alias = normalizeProviderId(rawAlias);
		if (!alias || !isRecord(rawTarget)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(rawTarget.provider) ?? "");
		if (!provider || !ownedProviders.has(provider)) continue;
		const api = normalizeModelCatalogApi(rawTarget.api);
		const baseUrl = normalizeOptionalString(rawTarget.baseUrl) ?? "";
		aliases[alias] = {
			provider,
			...api ? { api } : {},
			...baseUrl ? { baseUrl } : {}
		};
	}
	return Object.keys(aliases).length > 0 ? aliases : void 0;
}
function normalizeModelCatalogSuppressions(value) {
	if (!Array.isArray(value)) return;
	const suppressions = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(entry.provider) ?? "");
		const model = normalizeOptionalString(entry.model) ?? "";
		if (!provider || !model) continue;
		const reason = normalizeOptionalString(entry.reason) ?? "";
		const replacedBy = isRecord(entry.retirement) ? normalizeOptionalString(entry.retirement.replacedBy) : void 0;
		const retirement = isRecord(entry.retirement) && (entry.retirement.replacedBy === void 0 || replacedBy) ? replacedBy ? { replacedBy } : {} : void 0;
		const rawWhen = isRecord(entry.when) ? entry.when : void 0;
		const baseUrlHosts = normalizeTrimmedStringList(rawWhen?.baseUrlHosts).map((host) => host.toLowerCase());
		const providerConfigApiIn = normalizeTrimmedStringList(rawWhen?.providerConfigApiIn).map((api) => api.toLowerCase());
		const when = baseUrlHosts.length > 0 || providerConfigApiIn.length > 0 ? {
			...baseUrlHosts.length > 0 ? { baseUrlHosts } : {},
			...providerConfigApiIn.length > 0 ? { providerConfigApiIn } : {}
		} : void 0;
		if (retirement && entry.when !== void 0 && (!rawWhen || !when || rawWhen.baseUrlHosts !== void 0 && baseUrlHosts.length === 0 || rawWhen.providerConfigApiIn !== void 0 && providerConfigApiIn.length === 0)) continue;
		suppressions.push({
			provider,
			model,
			...reason ? { reason } : {},
			...retirement ? { retirement } : {},
			...when ? { when } : {}
		});
	}
	return suppressions.length > 0 ? suppressions : void 0;
}
function normalizeModelCatalogDiscovery(value, ownedProviders) {
	if (!isRecord(value)) return;
	const discovery = {};
	for (const [rawProviderId, rawMode] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		const mode = normalizeOptionalString(rawMode) ?? "";
		if (providerId && ownedProviders.has(providerId) && MODEL_CATALOG_DISCOVERY_MODES.has(mode)) discovery[providerId] = mode;
	}
	return Object.keys(discovery).length > 0 ? discovery : void 0;
}
/** Normalize a raw model catalog object for the set of providers owned by a plugin/manifest. */
function normalizeModelCatalog(value, params) {
	if (!isRecord(value)) return;
	const ownedProviders = normalizeOwnedProviderSet(params.ownedProviders);
	const modelsDev = Object.fromEntries(Object.entries(normalizeStringMap(value.modelsDev) ?? {}).flatMap(([rawProviderId, sourceId]) => {
		const providerId = normalizeProviderId(rawProviderId);
		return ownedProviders.has(providerId) && !isBlockedObjectKey(providerId) ? [[providerId, sourceId]] : [];
	}));
	const providers = normalizeModelCatalogProviders(value.providers, ownedProviders);
	const aliases = normalizeModelCatalogAliases(value.aliases, ownedProviders);
	const suppressions = normalizeModelCatalogSuppressions(value.suppressions);
	const discovery = normalizeModelCatalogDiscovery(value.discovery, ownedProviders);
	const runtimeAugment = value.runtimeAugment === true;
	const catalog = {
		...Object.keys(modelsDev).length > 0 ? { modelsDev } : {},
		...providers ? { providers } : {},
		...aliases ? { aliases } : {},
		...suppressions ? { suppressions } : {},
		...discovery ? { discovery } : {},
		...runtimeAugment ? { runtimeAugment } : {}
	};
	return Object.keys(catalog).length > 0 ? catalog : void 0;
}
/** Normalize one provider catalog into sorted runtime rows. */
function normalizeModelCatalogProviderRows(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider || !Array.isArray(params.providerCatalog.models)) return [];
	const providerApi = normalizeModelCatalogApi(params.providerCatalog.api);
	const providerBaseUrl = normalizeOptionalString(params.providerCatalog.baseUrl) ?? "";
	const providerHeaders = normalizeStringMap(params.providerCatalog.headers);
	const rows = [];
	for (const rawModel of params.providerCatalog.models) {
		const model = normalizeModelCatalogModel(rawModel);
		if (!model) continue;
		const api = model.api ?? providerApi;
		const baseUrl = model.baseUrl ?? providerBaseUrl;
		const headers = mergeStringMaps(providerHeaders, model.headers);
		rows.push({
			...model,
			provider,
			ref: buildModelCatalogRef(provider, model.id),
			mergeKey: buildModelCatalogMergeKey(provider, model.id),
			name: model.name ?? model.id,
			source: params.source,
			input: model.input ?? [...DEFAULT_MODEL_INPUT],
			reasoning: model.reasoning ?? false,
			status: model.status ?? DEFAULT_MODEL_STATUS,
			...api ? { api } : {},
			...baseUrl ? { baseUrl } : {},
			...headers ? { headers } : {}
		});
	}
	return rows.toSorted((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id));
}
//#endregion
export { normalizeModelCatalogProviderRows as n, normalizeModelCatalog as t };
