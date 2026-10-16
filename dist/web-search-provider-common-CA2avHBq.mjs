import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { a as createProviderErrorTextRedactor, t as ProviderHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { a as readResponseText, c as resolveTimeoutSeconds, i as readCache, l as writeCache, o as resolveCacheTtlMs, r as normalizeCacheKey } from "./web-shared-D8fUK6Vo.mjs";
//#region src/agents/tools/web-search-provider-common.ts
const loadWebGuardedFetch = createLazyPromise(() => import("./web-guarded-fetch-f3HpIFYT.mjs"));
const DEFAULT_SEARCH_COUNT = 5;
const MAX_SEARCH_COUNT = 10;
const SEARCH_CACHE = /* @__PURE__ */ new Map();
function resolveSearchTimeoutSeconds(searchConfig) {
	return resolveTimeoutSeconds(searchConfig?.timeoutSeconds, 30);
}
function resolveSearchCacheTtlMs(searchConfig) {
	return resolveCacheTtlMs(searchConfig?.cacheTtlMinutes, 15);
}
function resolveSearchCount(value, fallback) {
	return resolveIntegerOption(value, fallback, {
		min: 1,
		max: 10
	});
}
function readConfiguredSecretString(value, path) {
	return normalizeSecretInput(normalizeResolvedSecretInputString({
		value,
		path
	})) || void 0;
}
async function withTrustedWebSearchEndpoint(params, run) {
	const { withTrustedWebToolsEndpoint } = await loadWebGuardedFetch();
	return withTrustedWebToolsEndpoint(params, async ({ response }) => run(response));
}
async function withSelfHostedWebSearchEndpoint(params, run) {
	const { withSelfHostedWebToolsEndpoint } = await loadWebGuardedFetch();
	return withSelfHostedWebToolsEndpoint(params, async ({ response }) => run(response));
}
async function postTrustedWebToolsJson(params, parseResponse) {
	const headers = new Headers(params.extraHeaders);
	headers.set("Accept", "application/json");
	headers.set("Authorization", `Bearer ${params.apiKey}`);
	headers.set("Content-Type", "application/json");
	return withTrustedWebSearchEndpoint({
		url: params.url,
		timeoutSeconds: params.timeoutSeconds,
		signal: params.signal,
		init: {
			method: "POST",
			headers,
			body: JSON.stringify(params.body)
		}
	}, async (response) => {
		if (!response.ok) return await throwWebSearchApiError(response, params.errorLabel, {
			headers,
			maxBytes: params.maxErrorBytes,
			signal: params.signal
		});
		return await parseResponse(response);
	});
}
async function throwWebSearchApiError(res, providerLabel, request) {
	const detail = await readResponseText(res, { maxBytes: request?.maxBytes ?? 64e3 });
	request?.signal?.throwIfAborted();
	const message = createProviderErrorTextRedactor({
		headers: new Headers(request?.headers),
		defaultAuthHeader: "Authorization",
		defaultAuthPrefix: "Bearer "
	})(detail.text || res.statusText, { truncated: Boolean(detail.text) && detail.truncated });
	throw new ProviderHttpError(`${providerLabel} API error (${res.status}): ${message}`, { status: res.status });
}
function resolveSiteName(url) {
	if (!url) return;
	try {
		return new URL(url).hostname;
	} catch {
		return;
	}
}
const BRAVE_FRESHNESS_SHORTCUTS = /* @__PURE__ */ new Set([
	"pd",
	"pw",
	"pm",
	"py"
]);
const BRAVE_FRESHNESS_RANGE = /^(\d{4}-\d{2}-\d{2})to(\d{4}-\d{2}-\d{2})$/;
const PERPLEXITY_RECENCY_VALUES = /* @__PURE__ */ new Set([
	"day",
	"week",
	"month",
	"year"
]);
const FRESHNESS_TO_RECENCY = {
	pd: "day",
	pw: "week",
	pm: "month",
	py: "year"
};
const RECENCY_TO_FRESHNESS = {
	day: "pd",
	week: "pw",
	month: "pm",
	year: "py"
};
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PERPLEXITY_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
function isValidIsoDate(value) {
	if (!ISO_DATE_PATTERN.test(value)) return false;
	const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
	if (year === void 0 || month === void 0 || day === void 0) return false;
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function isoToPerplexityDate(iso) {
	const match = iso.match(ISO_DATE_PATTERN);
	if (!match) return;
	const [, year, month, day] = match;
	if (year === void 0 || month === void 0 || day === void 0) return;
	return `${Number.parseInt(month, 10)}/${Number.parseInt(day, 10)}/${year}`;
}
/** Accepts ISO dates plus Perplexity `M/D/YYYY` dates and returns canonical ISO dates. */
function normalizeToIsoDate(value) {
	const trimmed = value.trim();
	const match = trimmed.match(PERPLEXITY_DATE_PATTERN);
	if (!match) return isValidIsoDate(trimmed) ? trimmed : void 0;
	const [, month, day, year] = match;
	if (year === void 0 || month === void 0 || day === void 0) return;
	const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
	return isValidIsoDate(iso) ? iso : void 0;
}
/** Parses optional date range filters and returns provider-facing validation errors. */
function parseIsoDateRange(params) {
	const docs = params.docs ?? "https://docs.openclaw.ai/tools/web";
	const dateAfter = params.rawDateAfter ? normalizeToIsoDate(params.rawDateAfter) : void 0;
	if (params.rawDateAfter && !dateAfter) return {
		error: "invalid_date",
		message: params.invalidDateAfterMessage,
		docs
	};
	const dateBefore = params.rawDateBefore ? normalizeToIsoDate(params.rawDateBefore) : void 0;
	if (params.rawDateBefore && !dateBefore) return {
		error: "invalid_date",
		message: params.invalidDateBeforeMessage,
		docs
	};
	if (dateAfter && dateBefore && dateAfter > dateBefore) return {
		error: "invalid_date_range",
		message: params.invalidDateRangeMessage,
		docs
	};
	return {
		dateAfter,
		dateBefore
	};
}
/** Converts shared freshness names into provider-specific Brave or Perplexity values. */
function normalizeFreshness(value, provider) {
	if (!value) return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (BRAVE_FRESHNESS_SHORTCUTS.has(lower)) {
		const recency = FRESHNESS_TO_RECENCY[lower];
		return provider === "brave" ? lower : recency;
	}
	if (PERPLEXITY_RECENCY_VALUES.has(lower)) {
		const freshness = RECENCY_TO_FRESHNESS[lower];
		return provider === "perplexity" ? lower : freshness;
	}
	if (provider === "brave") {
		const match = trimmed.match(BRAVE_FRESHNESS_RANGE);
		if (match) {
			const [, start, end] = match;
			if (start && end && isValidIsoDate(start) && isValidIsoDate(end) && start <= end) return `${start}to${end}`;
		}
	}
}
/** Parses freshness/date filters while rejecting combinations providers cannot express safely. */
function parseWebSearchTimeFilters(params) {
	const docs = params.docs ?? "https://docs.openclaw.ai/tools/web";
	const freshness = params.rawFreshness ? normalizeFreshness(params.rawFreshness, params.freshnessProvider) : void 0;
	if (params.rawFreshness && !freshness) return {
		error: "invalid_freshness",
		message: params.invalidFreshnessMessage,
		docs
	};
	if (params.rawFreshness && (params.rawDateAfter || params.rawDateBefore)) return {
		error: "conflicting_time_filters",
		message: params.conflictingTimeFiltersMessage ?? "freshness and date_after/date_before cannot be used together. Use either freshness (day/week/month/year) or a date range (date_after/date_before), not both.",
		docs
	};
	const parsedDateRange = parseIsoDateRange(params);
	if ("error" in parsedDateRange) return parsedDateRange;
	return freshness ? {
		freshness,
		...parsedDateRange
	} : parsedDateRange;
}
/** Reads a marked search payload; omitted TTL preserves the stored-expiry SDK contract. */
function readCachedSearchPayload(cacheKey, ttlMs) {
	const cached = readCache(SEARCH_CACHE, cacheKey, ttlMs);
	return cached ? {
		...cached.value,
		cached: true
	} : void 0;
}
function buildSearchCacheKey(parts) {
	return normalizeCacheKey(parts.map((part) => part === void 0 ? "default" : String(part)).join(":"));
}
function writeCachedSearchPayload(cacheKey, payload, ttlMs) {
	writeCache(SEARCH_CACHE, cacheKey, payload, ttlMs);
}
function buildUnsupportedSearchFilterResponse(params, provider, docs = "https://docs.openclaw.ai/tools/web") {
	const unsupported = [
		"country",
		"language",
		"freshness",
		"date_after",
		"date_before"
	].find((name) => typeof params[name] === "string" && params[name].trim());
	if (!unsupported) return;
	const isDateFilter = unsupported === "date_after" || unsupported === "date_before";
	const label = isDateFilter ? "date_after/date_before filtering" : `${unsupported} filtering`;
	const supportedLabel = isDateFilter ? "date filtering" : label;
	return {
		error: unsupported.startsWith("date_") ? "unsupported_date_filter" : `unsupported_${unsupported}`,
		message: `${label} is not supported by the ${provider} provider. Only Brave and Perplexity support ${supportedLabel}.`,
		docs
	};
}
//#endregion
export { resolveSiteName as _, buildUnsupportedSearchFilterResponse as a, withTrustedWebSearchEndpoint as b, normalizeToIsoDate as c, postTrustedWebToolsJson as d, readCachedSearchPayload as f, resolveSearchTimeoutSeconds as g, resolveSearchCount as h, buildSearchCacheKey as i, parseIsoDateRange as l, resolveSearchCacheTtlMs as m, FRESHNESS_TO_RECENCY as n, isoToPerplexityDate as o, readConfiguredSecretString as p, MAX_SEARCH_COUNT as r, normalizeFreshness as s, DEFAULT_SEARCH_COUNT as t, parseWebSearchTimeFilters as u, throwWebSearchApiError as v, writeCachedSearchPayload as x, withSelfHostedWebSearchEndpoint as y };
