import { s as getRuntimeConfigSnapshot } from "../../runtime-snapshot-DbgWcCyV.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { h as readToolStringParam, p as readStringArrayParam } from "../../common-XfKigJno.mjs";
import { c as resolveTimeoutSeconds, i as readCache, l as writeCache, o as resolveCacheTtlMs } from "../../web-shared-7z6bteLg.mjs";
import { c as normalizeToIsoDate } from "../../web-search-provider-common-6Yt6-I5E.mjs";
import "../../runtime-config-snapshot-Bc7N5SpK.mjs";
import "../../provider-web-search-CRDOBhl4.mjs";
import { r as resolveXaiToolApiKeyWithAuth, t as isXaiToolEnabled } from "../../tool-auth-shared-BKm-JLrq.mjs";
import { t as resolveEffectiveXSearchConfig } from "../../x-search-config-Dj2uABTe.mjs";
import { n as buildMissingXSearchApiKeyPayload, r as createXSearchToolDefinition } from "../../x-search-tool-shared-nlZ40kdg.mjs";
import { a as resolveXaiXSearchInlineCitations, i as resolveXaiXSearchEndpoint, n as buildXaiXSearchPayload, o as resolveXaiXSearchMaxTurns, r as requestXaiXSearch, s as resolveXaiXSearchModel } from "../../x-search-shared-iiIPeHwF.mjs";
//#region extensions/xai/x-search.ts
var PluginToolInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ToolInputError";
	}
};
const X_SEARCH_CACHE_KEY = Symbol.for("openclaw.xai.x-search.cache");
function getSharedXSearchCache() {
	const root = globalThis;
	const existing = root[X_SEARCH_CACHE_KEY];
	if (existing instanceof Map) return existing;
	const next = /* @__PURE__ */ new Map();
	root[X_SEARCH_CACHE_KEY] = next;
	return next;
}
const X_SEARCH_CACHE = getSharedXSearchCache();
function normalizeOptionalIsoDate(value, label) {
	if (!value) return;
	const trimmed = value.trim();
	if (!trimmed) return;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) throw new PluginToolInputError(`${label} must use YYYY-MM-DD`);
	if (!normalizeToIsoDate(trimmed)) throw new PluginToolInputError(`${label} must be a valid calendar date`);
	return trimmed;
}
function validateXSearchHandleFilters(params) {
	if (params.allowedXHandles && params.excludedXHandles) throw new PluginToolInputError("allowed_x_handles and excluded_x_handles cannot be used together");
	for (const [label, handles] of [["allowed_x_handles", params.allowedXHandles], ["excluded_x_handles", params.excludedXHandles]]) if (handles && handles.length > 20) throw new PluginToolInputError(`${label} cannot contain more than 20 handles`);
}
function buildXSearchCacheKey(params) {
	return JSON.stringify([
		"x_search",
		params.model,
		params.endpoint,
		params.query,
		params.inlineCitations,
		params.maxTurns ?? null,
		params.options.allowedXHandles ?? null,
		params.options.excludedXHandles ?? null,
		params.options.fromDate ?? null,
		params.options.toDate ?? null,
		params.options.enableImageUnderstanding ?? false,
		params.options.enableVideoUnderstanding ?? false
	]);
}
function createXSearchTool(options) {
	const xSearchConfig = resolveEffectiveXSearchConfig(options?.config);
	const runtimeConfig = options?.runtimeConfig ?? getRuntimeConfigSnapshot();
	if (!isXaiToolEnabled({
		enabled: typeof xSearchConfig?.enabled === "boolean" ? xSearchConfig.enabled : void 0,
		runtimeConfig: runtimeConfig ?? void 0,
		sourceConfig: options?.config,
		auth: options?.auth
	})) return null;
	return createXSearchToolDefinition(async (_toolCallId, args, signal) => {
		signal?.throwIfAborted();
		const apiKey = await resolveXaiToolApiKeyWithAuth({
			sourceConfig: options?.config,
			runtimeConfig: runtimeConfig ?? void 0,
			auth: options?.auth
		});
		if (!apiKey) return jsonResult(buildMissingXSearchApiKeyPayload());
		const query = readToolStringParam(args, "query", { required: true });
		const allowedXHandles = readStringArrayParam(args, "allowed_x_handles");
		const excludedXHandles = readStringArrayParam(args, "excluded_x_handles");
		validateXSearchHandleFilters({
			allowedXHandles,
			excludedXHandles
		});
		const fromDate = normalizeOptionalIsoDate(readToolStringParam(args, "from_date"), "from_date");
		const toDate = normalizeOptionalIsoDate(readToolStringParam(args, "to_date"), "to_date");
		if (fromDate && toDate && fromDate > toDate) throw new PluginToolInputError("from_date must be on or before to_date");
		const xSearchOptions = {
			query,
			allowedXHandles,
			excludedXHandles,
			fromDate,
			toDate,
			enableImageUnderstanding: args.enable_image_understanding === true,
			enableVideoUnderstanding: args.enable_video_understanding === true
		};
		const xSearchConfigRecord = xSearchConfig;
		const model = resolveXaiXSearchModel(xSearchConfigRecord);
		const endpoint = resolveXaiXSearchEndpoint(xSearchConfigRecord);
		const inlineCitations = resolveXaiXSearchInlineCitations(xSearchConfigRecord);
		const maxTurns = resolveXaiXSearchMaxTurns(xSearchConfigRecord);
		const cacheKey = buildXSearchCacheKey({
			query,
			model,
			endpoint,
			inlineCitations,
			maxTurns,
			options: {
				allowedXHandles,
				excludedXHandles,
				fromDate,
				toDate,
				enableImageUnderstanding: xSearchOptions.enableImageUnderstanding,
				enableVideoUnderstanding: xSearchOptions.enableVideoUnderstanding
			}
		});
		const cacheTtlMs = resolveCacheTtlMs(xSearchConfig?.cacheTtlMinutes, 15);
		const cached = readCache(X_SEARCH_CACHE, cacheKey, cacheTtlMs);
		if (cached) return jsonResult({
			...cached.value,
			cached: true
		});
		const startedAt = Date.now();
		const result = await requestXaiXSearch({
			apiKey,
			endpoint,
			model,
			timeoutSeconds: resolveTimeoutSeconds(xSearchConfig?.timeoutSeconds, 30),
			inlineCitations,
			maxTurns,
			options: xSearchOptions,
			...signal ? { signal } : {}
		});
		signal?.throwIfAborted();
		const payload = buildXaiXSearchPayload({
			query,
			model,
			tookMs: Date.now() - startedAt,
			content: result.content,
			citations: result.citations,
			inlineCitations: result.inlineCitations,
			truncated: result.truncated,
			options: xSearchOptions
		});
		writeCache(X_SEARCH_CACHE, cacheKey, payload, cacheTtlMs);
		return jsonResult(payload);
	});
}
//#endregion
export { createXSearchTool };
