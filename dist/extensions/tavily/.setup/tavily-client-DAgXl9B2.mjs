import { externalContentStamp, normalizeCacheKey, postTrustedWebToolsJson, readCache, readCachedSearchPayload, resolvePositiveTimeoutSeconds, resolveSearchCacheTtlMs, writeCache, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { parseDateStringTimestampMs, resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { resolveProviderWebSearchPluginConfig } from "openclaw/plugin-sdk/provider-web-search-config-contract";
import { normalizeSecretInput } from "openclaw/plugin-sdk/secret-input";
import { assertPluginCapabilitySecretAvailable } from "openclaw/plugin-sdk/secret-input-runtime";
import { resolveReadOnlyEnvSecretRef } from "openclaw/plugin-sdk/secret-ref-readonly";
import { truncateSanitizedExternalContent, wrapExternalContent, wrapWebContent } from "openclaw/plugin-sdk/security-runtime";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
// extensions/tavily/src/tavily-client.ts
var tavily_client_exports = /* @__PURE__ */ __exportAll({
	runTavilyExtract: () => runTavilyExtract,
	runTavilySearch: () => runTavilySearch
});
const DEFAULT_TAVILY_BASE_URL = "https://api.tavily.com";
const DEFAULT_TAVILY_SEARCH_TIMEOUT_SECONDS = 30;
const DEFAULT_TAVILY_EXTRACT_TIMEOUT_SECONDS = 60;
const TAVILY_API_KEY_ENV_VAR = "TAVILY_API_KEY";
const TAVILY_API_KEY_CONFIG_PATH = "plugins.entries.tavily.config.webSearch.apiKey";
function requireTavilyApiKey(cfg, tool) {
	assertPluginCapabilitySecretAvailable(TAVILY_API_KEY_CONFIG_PATH);
	const search = resolveProviderWebSearchPluginConfig(cfg, "tavily");
	const resolved = resolveReadOnlyEnvSecretRef({
		value: search?.apiKey,
		path: TAVILY_API_KEY_CONFIG_PATH,
		cfg,
		expectedEnvId: TAVILY_API_KEY_ENV_VAR,
		normalizeValue: normalizeSecretInput
	});
	const apiKey = resolved.status === "available" ? resolved.value : resolved.status === "blocked" ? void 0 : normalizeSecretInput(process.env.TAVILY_API_KEY);
	if (!apiKey) throw new Error(`${tool} needs a Tavily API key. Set TAVILY_API_KEY in the Gateway environment, or configure plugins.entries.tavily.config.webSearch.apiKey.`);
	return apiKey;
}
function resolveTavilyBaseUrl(cfg) {
	const search = resolveProviderWebSearchPluginConfig(cfg, "tavily");
	return (normalizeOptionalString(search?.baseUrl) ?? "") || normalizeSecretInput(process.env.TAVILY_BASE_URL) || DEFAULT_TAVILY_BASE_URL;
}
const EXTRACT_CACHE = /* @__PURE__ */ new Map();
const DEFAULT_SEARCH_COUNT = 5;
const TAVILY_SEARCH_MAX_CONTENT_CHARS = 2e4;
const TAVILY_EXTRACT_RESPONSE_MAX_BYTES = 67108864;
const TAVILY_EXTRACT_MAX_CONTENT_CHARS = 2e4;
const TAVILY_EXTRACT_MAX_ERROR_CHARS = 4e3;
const TAVILY_EXTRACT_MAX_RESULTS = 20;
const TAVILY_RESULT_URL_MAX_CHARS = 2048;
const TAVILY_PUBLISHED_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+Z-]{0,20})?$/u;
function normalizeTavilyResultUrl(value) {
	if (typeof value !== "string" || value.length > TAVILY_RESULT_URL_MAX_CHARS) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:" || url.href.length > TAVILY_RESULT_URL_MAX_CHARS) return;
		return url.href === `${value}/` ? value : url.href;
	} catch {
		return;
	}
}
function normalizeTavilyPublishedDate(value) {
	if (typeof value !== "string" || value.length > 31) return;
	if (TAVILY_PUBLISHED_DATE_RE.test(value)) {
		const calendarDate = value.slice(0, 10);
		const timestamp = parseDateStringTimestampMs(calendarDate);
		return timestamp !== void 0 && new Date(timestamp).toISOString().startsWith(calendarDate) ? value : void 0;
	}
	const date = new Date(value);
	return Number.isFinite(date.getTime()) && date.toUTCString() === value ? date.toISOString() : void 0;
}
function resolveEndpoint(baseUrl, pathname) {
	const url = new URL(baseUrl);
	url.pathname = url.pathname.replace(/\/$/, "") + pathname;
	return url.toString();
}
async function postTavilyJson(params) {
	return postTrustedWebToolsJson({
		url: resolveEndpoint(params.baseUrl, params.pathname),
		timeoutSeconds: params.timeoutSeconds,
		apiKey: params.apiKey,
		body: params.body,
		errorLabel: params.errorLabel,
		extraHeaders: { "X-Client-Source": "openclaw" },
		...params.signal ? { signal: params.signal } : {}
	}, async (response) => readProviderJsonResponse(response, params.errorLabel, { maxBytes: params.responseMaxBytes }));
}
async function runTavilySearch(params) {
	params.signal?.throwIfAborted();
	const apiKey = requireTavilyApiKey(params.cfg, "web_search (tavily)");
	const count = resolveIntegerOption(params.maxResults, DEFAULT_SEARCH_COUNT, {
		min: 1,
		max: 20
	});
	const timeoutSeconds = resolvePositiveTimeoutSeconds(params.timeoutSeconds, DEFAULT_TAVILY_SEARCH_TIMEOUT_SECONDS);
	const baseUrl = resolveTavilyBaseUrl(params.cfg);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "tavily-search",
		credential: sha256Hex(apiKey),
		q: params.query,
		count,
		baseUrl,
		searchDepth: params.searchDepth,
		topic: params.topic,
		includeAnswer: params.includeAnswer,
		timeRange: params.timeRange,
		includeDomains: params.includeDomains,
		excludeDomains: params.excludeDomains
	}));
	const cacheTtlMs = resolveSearchCacheTtlMs(params.cfg?.tools?.web?.search);
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const body = {
		query: params.query,
		max_results: count,
		...params.searchDepth ? { search_depth: params.searchDepth } : {},
		...params.topic ? { topic: params.topic } : {},
		...params.includeAnswer ? { include_answer: true } : {},
		...params.timeRange ? { time_range: params.timeRange } : {},
		...params.includeDomains?.length ? { include_domains: params.includeDomains } : {},
		...params.excludeDomains?.length ? { exclude_domains: params.excludeDomains } : {}
	};
	const start = Date.now();
	const payload = await postTavilyJson({
		baseUrl,
		pathname: "/search",
		timeoutSeconds,
		apiKey,
		body,
		errorLabel: "Tavily Search",
		...params.signal ? { signal: params.signal } : {}
	});
	params.signal?.throwIfAborted();
	const rawResults = Array.isArray(payload.results) ? payload.results : [];
	let remainingSearchContentChars = TAVILY_SEARCH_MAX_CONTENT_CHARS;
	let searchTruncated = rawResults.length > count;
	const wrapBoundedSearchContent = (value) => {
		const bounded = truncateSanitizedExternalContent(value, remainingSearchContentChars);
		searchTruncated ||= bounded.truncated;
		remainingSearchContentChars -= bounded.text.length;
		return wrapWebContent(bounded.text, "web_search");
	};
	const results = rawResults.slice(0, count).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const url = normalizeTavilyResultUrl(entry.url);
		if (!url) return [];
		const published = normalizeTavilyPublishedDate(entry.published_date);
		return [{
			title: typeof entry.title === "string" ? wrapBoundedSearchContent(entry.title) : "",
			url,
			snippet: typeof entry.content === "string" ? wrapBoundedSearchContent(entry.content) : "",
			score: typeof entry.score === "number" ? entry.score : void 0,
			...published ? { published } : {}
		}];
	});
	const result = {
		query: params.query,
		provider: "tavily",
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: externalContentStamp("tavily"),
		results
	};
	if (typeof payload.answer === "string" && payload.answer) result.answer = wrapBoundedSearchContent(payload.answer);
	if (searchTruncated) result.truncated = true;
	writeCachedSearchPayload(cacheKey, result, cacheTtlMs);
	return result;
}
async function runTavilyExtract(params) {
	params.signal?.throwIfAborted();
	const apiKey = requireTavilyApiKey(params.cfg, "tavily_extract");
	const baseUrl = resolveTavilyBaseUrl(params.cfg);
	const timeoutSeconds = resolvePositiveTimeoutSeconds(params.timeoutSeconds, DEFAULT_TAVILY_EXTRACT_TIMEOUT_SECONDS);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "tavily-extract",
		credential: sha256Hex(apiKey),
		urls: params.urls,
		baseUrl,
		query: params.query,
		extractDepth: params.extractDepth,
		chunksPerSource: params.chunksPerSource,
		includeImages: params.includeImages
	}));
	const cached = readCache(EXTRACT_CACHE, cacheKey);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const body = {
		urls: params.urls,
		...params.query ? { query: params.query } : {},
		...params.extractDepth ? { extract_depth: params.extractDepth } : {},
		...params.chunksPerSource ? { chunks_per_source: params.chunksPerSource } : {},
		...params.includeImages ? { include_images: true } : {}
	};
	const start = Date.now();
	const payload = await postTavilyJson({
		baseUrl,
		pathname: "/extract",
		timeoutSeconds,
		apiKey,
		body,
		errorLabel: "Tavily Extract",
		responseMaxBytes: TAVILY_EXTRACT_RESPONSE_MAX_BYTES,
		...params.signal ? { signal: params.signal } : {}
	});
	params.signal?.throwIfAborted();
	const rawResults = Array.isArray(payload.results) ? payload.results : [];
	let remainingContentChars = TAVILY_EXTRACT_MAX_CONTENT_CHARS;
	let remainingErrorChars = TAVILY_EXTRACT_MAX_ERROR_CHARS;
	let remainingImages = TAVILY_EXTRACT_MAX_RESULTS;
	let truncated = rawResults.length > TAVILY_EXTRACT_MAX_RESULTS;
	const wrapBoundedContent = (value, budget) => {
		const bounded = truncateSanitizedExternalContent(value, budget === "content" ? remainingContentChars : remainingErrorChars);
		truncated ||= bounded.truncated;
		if (budget === "content") remainingContentChars -= bounded.text.length;
		else remainingErrorChars -= bounded.text.length;
		return wrapExternalContent(bounded.text, {
			source: "web_fetch",
			includeWarning: false
		});
	};
	const results = rawResults.slice(0, TAVILY_EXTRACT_MAX_RESULTS).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const url = normalizeTavilyResultUrl(entry.url);
		if (!url) return [];
		const rawImages = Array.isArray(entry.images) ? entry.images : void 0;
		const images = rawImages?.slice(0, remainingImages).flatMap((image) => {
			const imageUrl = normalizeTavilyResultUrl(image);
			return imageUrl ? [wrapExternalContent(imageUrl, {
				source: "web_fetch",
				includeWarning: false
			})] : [];
		});
		if (rawImages && images) {
			truncated ||= rawImages.length > remainingImages;
			remainingImages -= images.length;
		}
		return [{
			url,
			rawContent: typeof entry.raw_content === "string" ? wrapBoundedContent(entry.raw_content, "content") : "",
			...typeof entry.content === "string" ? { content: wrapBoundedContent(entry.content, "content") } : {},
			...images ? { images } : {}
		}];
	});
	const rawFailedResults = Array.isArray(payload.failed_results) ? payload.failed_results : [];
	truncated ||= rawFailedResults.length > TAVILY_EXTRACT_MAX_RESULTS;
	const failedResults = rawFailedResults.slice(0, TAVILY_EXTRACT_MAX_RESULTS).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const url = normalizeTavilyResultUrl(entry.url);
		return url && typeof entry.error === "string" ? [{
			url,
			error: wrapBoundedContent(entry.error, "error")
		}] : [];
	});
	const result = {
		provider: "tavily",
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: {
			untrusted: true,
			source: "web_fetch",
			provider: "tavily",
			wrapped: true
		},
		results,
		...failedResults.length > 0 ? { failedResults } : {},
		...truncated ? { truncated: true } : {}
	};
	writeCache(EXTRACT_CACHE, cacheKey, result, resolveSearchCacheTtlMs());
	return result;
}
export { runTavilySearch as n, tavily_client_exports as r, runTavilyExtract as t };
