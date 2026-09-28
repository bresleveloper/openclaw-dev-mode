import { ProviderHttpError } from "openclaw/plugin-sdk/provider-http";
import { DEFAULT_CACHE_TTL_MINUTES, DEFAULT_SEARCH_COUNT, normalizeCacheKey, readCache, readResponseText, resolveCacheTtlMs, resolveSearchCount, resolveSiteName, resolveTimeoutSeconds, withSelfHostedWebSearchEndpoint, withTrustedWebSearchEndpoint, wrapWebContent, writeCache } from "openclaw/plugin-sdk/provider-web-search";
import { assertHttpUrlTargetsPrivateNetwork, isBlockedHostnameOrIp, isPrivateIpAddress, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { normalizeSecretInput } from "openclaw/plugin-sdk/secret-input";
import { resolveReadOnlyEnvSecretRef } from "openclaw/plugin-sdk/secret-ref-readonly";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/searxng/src/config.ts
const SEARXNG_BASE_URL_ENV_VAR = "SEARXNG_BASE_URL";
const SEARXNG_BASE_URL_PATH = "plugins.entries.searxng.config.webSearch.baseUrl";
function normalizeBaseUrl(value) {
	return normalizeSecretInput(value)?.replace(/\/+$/u, "") || void 0;
}
function resolveSearxngWebSearchConfig(config) {
	const webSearch = (config?.plugins?.entries?.searxng?.config)?.webSearch;
	if (webSearch && typeof webSearch === "object" && !Array.isArray(webSearch)) return webSearch;
}
function resolveSearxngBaseUrl(config) {
	const webSearch = resolveSearxngWebSearchConfig(config);
	const resolved = resolveReadOnlyEnvSecretRef({
		value: webSearch?.baseUrl,
		path: SEARXNG_BASE_URL_PATH,
		cfg: config,
		expectedEnvId: SEARXNG_BASE_URL_ENV_VAR,
		normalizeValue: normalizeBaseUrl
	});
	if (resolved.status === "available") return resolved.value;
	if (resolved.status === "blocked") return;
	return normalizeBaseUrl(process.env[SEARXNG_BASE_URL_ENV_VAR]);
}
function resolveSearxngCategories(config) {
	return normalizeOptionalString(resolveSearxngWebSearchConfig(config)?.categories);
}
function resolveSearxngLanguage(config) {
	return normalizeOptionalString(resolveSearxngWebSearchConfig(config)?.language);
}
//#endregion
//#region extensions/searxng/src/searxng-client.ts
const DEFAULT_TIMEOUT_SECONDS = 20;
const MAX_RESPONSE_BYTES = 1e6;
const SEARXNG_SEARCH_CACHE = /* @__PURE__ */ new Map();
function normalizeSearxngResult(value) {
	if (!value || typeof value !== "object") return null;
	const candidate = value;
	if (typeof candidate.url !== "string" || typeof candidate.title !== "string") return null;
	return {
		url: candidate.url,
		title: candidate.title,
		content: typeof candidate.content === "string" ? candidate.content : void 0,
		img_src: typeof candidate.img_src === "string" ? candidate.img_src : void 0
	};
}
function buildSearxngSearchUrl(params) {
	const url = new URL(params.baseUrl);
	const basePathname = url.pathname.replace(/\/+$/u, "");
	url.pathname = basePathname.endsWith("/search") ? basePathname : `${basePathname}/search`;
	url.search = "";
	url.searchParams.set("q", params.query);
	url.searchParams.set("format", "json");
	if (params.categories) url.searchParams.set("categories", params.categories);
	if (params.language) url.searchParams.set("language", params.language);
	return url.toString();
}
function shouldRetryEmptyCategorySearchWithGeneral(categories) {
	if (!categories) return false;
	const normalized = categories.split(",").map((category) => category.trim().toLowerCase()).filter((category) => category.length > 0);
	return normalized.length > 0 && !normalized.includes("general");
}
async function searxngEndpointTargetsPrivateNetwork(url, lookupFn) {
	if (isBlockedHostnameOrIp(url.hostname)) return true;
	try {
		return (await resolvePinnedHostnameWithPolicy(url.hostname, {
			lookupFn,
			policy: {
				allowPrivateNetwork: true,
				allowRfc2544BenchmarkRange: true
			}
		})).addresses.every((address) => isPrivateIpAddress(address));
	} catch {
		return false;
	}
}
async function validateSearxngBaseUrl(baseUrl, lookupFn) {
	let parsed;
	try {
		parsed = new URL(baseUrl);
	} catch {
		throw new Error("SearXNG base URL must be a valid http:// or https:// URL.");
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("SearXNG base URL must use http:// or https://.");
	if (parsed.protocol === "http:") {
		await assertHttpUrlTargetsPrivateNetwork(parsed.toString(), {
			dangerouslyAllowPrivateNetwork: true,
			lookupFn,
			errorMessage: "SearXNG HTTP base URL must target a trusted private or loopback host. Use https:// for public hosts."
		});
		return "selfHosted";
	}
	return await searxngEndpointTargetsPrivateNetwork(parsed, lookupFn) ? "selfHosted" : "strict";
}
function parseSearxngResponseText(text, count) {
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch {
		throw new Error("SearXNG returned invalid JSON.");
	}
	if (!parsed || typeof parsed !== "object") return [];
	const response = parsed;
	const rawResults = Array.isArray(response.results) ? response.results : [];
	const results = [];
	for (const rawResult of rawResults) {
		const result = normalizeSearxngResult(rawResult);
		if (result) results.push(result);
		if (results.length >= count) break;
	}
	return results;
}
async function fetchSearxngResults(params) {
	const url = buildSearxngSearchUrl({
		baseUrl: params.baseUrl,
		query: params.query,
		categories: params.categories,
		language: params.language
	});
	return await (params.endpointMode === "selfHosted" ? withSelfHostedWebSearchEndpoint : withTrustedWebSearchEndpoint)({
		url,
		timeoutSeconds: params.timeoutSeconds,
		signal: params.signal,
		init: {
			method: "GET",
			headers: { Accept: "application/json" }
		}
	}, async (response) => {
		if (!response.ok) {
			const detail = (await readResponseText(response, { maxBytes: 64e3 })).text;
			throw new ProviderHttpError(`SearXNG search error (${response.status}): ${detail || response.statusText}`, { status: response.status });
		}
		const body = await readResponseText(response, { maxBytes: MAX_RESPONSE_BYTES });
		if (body.truncated) throw new Error(`SearXNG response incomplete after ${body.bytesRead} bytes.`);
		return parseSearxngResponseText(body.text, params.count);
	});
}
async function runSearxngSearch(params) {
	params.signal?.throwIfAborted();
	const count = resolveSearchCount(params.count, DEFAULT_SEARCH_COUNT);
	const categories = params.categories ?? resolveSearxngCategories(params.config);
	const language = params.language ?? resolveSearxngLanguage(params.config);
	const baseUrl = params.baseUrl ?? resolveSearxngBaseUrl(params.config);
	const timeoutSeconds = resolveTimeoutSeconds(params.timeoutSeconds, DEFAULT_TIMEOUT_SECONDS);
	const cacheTtlMs = resolveCacheTtlMs(params.cacheTtlMinutes ?? params.config?.tools?.web?.search?.cacheTtlMinutes, DEFAULT_CACHE_TTL_MINUTES);
	if (!baseUrl) throw new Error("SearXNG base URL is not configured. Set SEARXNG_BASE_URL or configure plugins.entries.searxng.config.webSearch.baseUrl.");
	const endpointMode = await validateSearxngBaseUrl(baseUrl);
	params.signal?.throwIfAborted();
	const cacheKey = normalizeCacheKey(JSON.stringify({
		provider: "searxng",
		query: params.query,
		count,
		categories: categories ?? "",
		language: language ?? "",
		baseUrl
	}));
	const cached = readCache(SEARXNG_SEARCH_CACHE, cacheKey, cacheTtlMs);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const startedAt = Date.now();
	let results = await fetchSearxngResults({
		baseUrl,
		query: params.query,
		categories,
		language,
		timeoutSeconds,
		count,
		endpointMode,
		signal: params.signal
	});
	params.signal?.throwIfAborted();
	if (results.length === 0 && shouldRetryEmptyCategorySearchWithGeneral(categories)) {
		results = await fetchSearxngResults({
			baseUrl,
			query: params.query,
			categories: "general",
			language,
			timeoutSeconds,
			count,
			endpointMode,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
	}
	const payload = {
		query: params.query,
		provider: "searxng",
		count: results.length,
		tookMs: Date.now() - startedAt,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: "searxng",
			wrapped: true
		},
		results: results.map((result) => ({
			title: wrapWebContent(result.title, "web_search"),
			url: result.url,
			snippet: result.content ? wrapWebContent(result.content, "web_search") : "",
			siteName: resolveSiteName(result.url) || void 0,
			img_src: result.img_src || void 0
		}))
	};
	writeCache(SEARXNG_SEARCH_CACHE, cacheKey, payload, cacheTtlMs);
	return payload;
}
const testing = { SEARXNG_SEARCH_CACHE };
//#endregion
export { runSearxngSearch, testing };
