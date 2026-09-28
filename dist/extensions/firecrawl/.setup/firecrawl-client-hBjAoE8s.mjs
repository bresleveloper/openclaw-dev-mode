import { resolveSiteName } from "openclaw/plugin-sdk/provider-web-search";
import { parseDateStringTimestampMs, parseFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
import { ProviderHttpError, readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { DEFAULT_CACHE_TTL_MINUTES, markdownToText, normalizeCacheKey, readCache, readResponseText, resolveCacheTtlMs, resolvePositiveTimeoutSeconds, withSelfHostedWebToolsEndpoint, withStrictWebToolsEndpoint, writeCache } from "openclaw/plugin-sdk/provider-web-fetch";
import { normalizeSecretInput } from "openclaw/plugin-sdk/secret-input";
import { truncateSanitizedExternalContent, wrapExternalContent, wrapWebContent } from "openclaw/plugin-sdk/security-runtime";
import { SsrFBlockedError, isBlockedHostnameOrIp, isPrivateIpAddress, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { resolveReadOnlyEnvSecretRef } from "openclaw/plugin-sdk/secret-ref-readonly";
//#region \0rolldown/runtime.js
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
const DEFAULT_FIRECRAWL_SEARCH_TIMEOUT_SECONDS = 30;
const DEFAULT_FIRECRAWL_SCRAPE_TIMEOUT_SECONDS = 60;
const DEFAULT_FIRECRAWL_MAX_AGE_MS = 1728e5;
const FIRECRAWL_API_KEY_ENV_VAR = "FIRECRAWL_API_KEY";
function resolveFirecrawlSearchConfig(cfg) {
	const pluginWebSearch = (cfg?.plugins?.entries?.firecrawl?.config)?.webSearch;
	if (pluginWebSearch && typeof pluginWebSearch === "object" && !Array.isArray(pluginWebSearch)) return pluginWebSearch;
}
function resolveFirecrawlFetchConfig(cfg) {
	const pluginWebFetch = (cfg?.plugins?.entries?.firecrawl?.config)?.webFetch;
	if (pluginWebFetch && typeof pluginWebFetch === "object" && !Array.isArray(pluginWebFetch)) return pluginWebFetch;
}
function resolveConfiguredSecret(value, path, cfg) {
	return resolveReadOnlyEnvSecretRef({
		value,
		path,
		cfg,
		expectedEnvId: FIRECRAWL_API_KEY_ENV_VAR,
		normalizeValue: normalizeSecretInput
	});
}
function resolveFirecrawlApiKey(cfg) {
	const pluginConfig = cfg?.plugins?.entries?.firecrawl?.config;
	const search = resolveFirecrawlSearchConfig(cfg);
	const configuredCandidates = [{
		value: pluginConfig?.webFetch?.apiKey,
		path: "plugins.entries.firecrawl.config.webFetch.apiKey"
	}, {
		value: search?.apiKey,
		path: "plugins.entries.firecrawl.config.webSearch.apiKey"
	}];
	let blockedConfiguredSecret = false;
	for (const candidate of configuredCandidates) {
		const resolved = resolveConfiguredSecret(candidate.value, candidate.path, cfg);
		if (resolved.status === "available") return resolved.value;
		if (resolved.status === "blocked") blockedConfiguredSecret = true;
	}
	if (blockedConfiguredSecret) return;
	return normalizeSecretInput(process.env[FIRECRAWL_API_KEY_ENV_VAR]) || void 0;
}
function resolveFirecrawlBaseUrl(cfg) {
	const search = resolveFirecrawlSearchConfig(cfg);
	const fetch = resolveFirecrawlFetchConfig(cfg);
	return (typeof search?.baseUrl === "string" ? search.baseUrl.trim() : "") || (typeof fetch?.baseUrl === "string" ? fetch.baseUrl.trim() : "") || normalizeSecretInput(process.env.FIRECRAWL_BASE_URL) || "https://api.firecrawl.dev";
}
function resolveFirecrawlOnlyMainContent(cfg, override) {
	if (typeof override === "boolean") return override;
	const fetch = resolveFirecrawlFetchConfig(cfg);
	if (typeof fetch?.onlyMainContent === "boolean") return fetch.onlyMainContent;
	return true;
}
function resolveFirecrawlMaxAgeMs(cfg, override) {
	if (typeof override === "number" && Number.isFinite(override) && override >= 0) return Math.floor(override);
	const fetch = resolveFirecrawlFetchConfig(cfg);
	if (typeof fetch?.maxAgeMs === "number" && Number.isFinite(fetch.maxAgeMs) && fetch.maxAgeMs >= 0) return Math.floor(fetch.maxAgeMs);
	return DEFAULT_FIRECRAWL_MAX_AGE_MS;
}
function resolveFirecrawlScrapeTimeoutSeconds(cfg, override) {
	const fetch = resolveFirecrawlFetchConfig(cfg);
	return resolvePositiveTimeoutSeconds(override, resolvePositiveTimeoutSeconds(fetch?.timeoutSeconds, DEFAULT_FIRECRAWL_SCRAPE_TIMEOUT_SECONDS));
}
function resolveFirecrawlSearchTimeoutSeconds(override) {
	return resolvePositiveTimeoutSeconds(override, DEFAULT_FIRECRAWL_SEARCH_TIMEOUT_SECONDS);
}
//#endregion
//#region extensions/firecrawl/src/firecrawl-client.ts
var firecrawl_client_exports = /* @__PURE__ */ __exportAll({
	assertFirecrawlScrapeTargetAllowed: () => assertFirecrawlScrapeTargetAllowed,
	parseFirecrawlScrapePayload: () => parseFirecrawlScrapePayload,
	runFirecrawlScrape: () => runFirecrawlScrape,
	runFirecrawlSearch: () => runFirecrawlSearch,
	testing: () => testing
});
const SEARCH_CACHE = /* @__PURE__ */ new Map();
const DEFAULT_SEARCH_COUNT = 5;
const FIRECRAWL_SEARCH_MAX_RESULTS = 100;
const FIRECRAWL_SEARCH_MAX_CONTENT_CHARS = 2e4;
const DEFAULT_SCRAPE_MAX_CHARS = 5e4;
const FIRECRAWL_SCRAPE_METADATA_MAX_CHARS = 4e3;
const FIRECRAWL_RESULT_URL_MAX_CHARS = 2048;
const FIRECRAWL_SCRAPE_RESPONSE_MAX_BYTES = 67108864;
const ALLOWED_FIRECRAWL_HOSTS = /* @__PURE__ */ new Set(["api.firecrawl.dev"]);
const FIRECRAWL_PUBLISHED_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+Z-]{0,20})?$/u;
const FIRECRAWL_SELF_HOSTED_PRIVATE_ERROR = "Firecrawl custom baseUrl must target a private or internal self-hosted endpoint.";
const FIRECRAWL_HTTP_PRIVATE_ERROR = "Firecrawl HTTP baseUrl must target a private or internal self-hosted endpoint. Use https:// for public hosts.";
function assertFirecrawlScrapeTargetAllowed(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new SsrFBlockedError("Invalid URL supplied to Firecrawl scrape");
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new SsrFBlockedError(`Blocked non-HTTP(S) protocol in Firecrawl scrape URL: ${parsed.protocol}`);
	if (isBlockedHostnameOrIp(parsed.hostname)) throw new SsrFBlockedError(`Blocked hostname or private/internal IP in Firecrawl scrape URL: ${parsed.hostname}`);
}
function isOfficialFirecrawlEndpoint(url) {
	return url.protocol === "https:" && ALLOWED_FIRECRAWL_HOSTS.has(url.hostname);
}
async function firecrawlEndpointTargetsPrivateNetwork(url, lookupFn) {
	if (isBlockedHostnameOrIp(url.hostname)) return true;
	try {
		return (await resolvePinnedHostnameWithPolicy(url.hostname, {
			lookupFn,
			policy: { allowPrivateNetwork: true }
		})).addresses.every((address) => isPrivateIpAddress(address));
	} catch {
		return false;
	}
}
async function validateFirecrawlBaseUrl(baseUrl, lookupFn) {
	let url;
	try {
		url = new URL(baseUrl.trim() || "https://api.firecrawl.dev");
	} catch {
		throw new Error("Firecrawl baseUrl must be a valid http:// or https:// URL.");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Firecrawl baseUrl must use http:// or https://.");
	if (isOfficialFirecrawlEndpoint(url)) return "strict";
	if (await firecrawlEndpointTargetsPrivateNetwork(url, lookupFn)) return "selfHosted";
	if (url.protocol === "http:") throw new Error(FIRECRAWL_HTTP_PRIVATE_ERROR);
	throw new Error(`${FIRECRAWL_SELF_HOSTED_PRIVATE_ERROR} Host: ${url.hostname}`);
}
async function resolveEndpoint(baseUrl, pathname, lookupFn) {
	const url = new URL(baseUrl.trim() || "https://api.firecrawl.dev");
	const mode = await validateFirecrawlBaseUrl(url.toString(), lookupFn);
	url.username = "";
	url.password = "";
	url.search = "";
	url.hash = "";
	url.pathname = pathname;
	return {
		url: url.toString(),
		mode
	};
}
async function postFirecrawlJson(params, parse) {
	const apiKey = normalizeSecretInput(params.apiKey);
	const result = await ((params.mode ?? await validateFirecrawlBaseUrl(params.url)) === "selfHosted" ? withSelfHostedWebToolsEndpoint : withStrictWebToolsEndpoint)({
		url: params.url,
		timeoutSeconds: params.timeoutSeconds,
		...params.signal ? { signal: params.signal } : {},
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
			},
			body: JSON.stringify(params.body)
		}
	}, async ({ response }) => {
		if (!response.ok) {
			let detail = typeof response.statusText === "string" && response.statusText.trim() ? response.statusText.trim() : "request failed";
			const readJsonPayload = async () => {
				const candidate = response;
				const jsonResponse = typeof candidate.clone === "function" ? candidate.clone() : response;
				try {
					const body = await readResponseText(jsonResponse, { maxBytes: 64e3 });
					const payload = JSON.parse(body.text);
					return payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
				} catch {
					return null;
				}
			};
			const payload = await readJsonPayload();
			if (payload) detail = typeof payload.error === "string" ? payload.error : typeof payload.message === "string" ? payload.message : detail;
			else {
				const errorBody = await readResponseText(response, { maxBytes: 64e3 });
				if (errorBody.text) detail = errorBody.text;
			}
			const safeDetail = wrapWebContent(truncateSanitizedExternalContent(detail, 1e3).text, "web_fetch");
			throw new ProviderHttpError(`${params.errorLabel} API error (${response.status}): ${safeDetail}`, { status: response.status });
		}
		return await parse(response);
	});
	params.signal?.throwIfAborted();
	return result;
}
function normalizeFirecrawlResultUrl(value) {
	if (typeof value !== "string" || value.length > FIRECRAWL_RESULT_URL_MAX_CHARS) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:" || url.href.length > FIRECRAWL_RESULT_URL_MAX_CHARS) return;
		return url.href === `${value}/` ? value : url.href;
	} catch {
		return;
	}
}
function isValidFirecrawlPublishedDate(value) {
	if (!FIRECRAWL_PUBLISHED_DATE_RE.test(value)) return false;
	const calendarDate = value.slice(0, 10);
	const timestamp = parseDateStringTimestampMs(calendarDate);
	return timestamp !== void 0 && new Date(timestamp).toISOString().startsWith(calendarDate);
}
const optionalFirecrawlStringSchema = z.string().optional().catch(void 0);
const firecrawlSearchMetadataSchema = z.object({
	sourceURL: optionalFirecrawlStringSchema,
	title: optionalFirecrawlStringSchema,
	publishedTime: optionalFirecrawlStringSchema,
	publishedDate: optionalFirecrawlStringSchema
}).optional().catch(void 0);
const firecrawlSearchItemSchema = z.object({
	url: optionalFirecrawlStringSchema,
	sourceURL: optionalFirecrawlStringSchema,
	sourceUrl: optionalFirecrawlStringSchema,
	title: optionalFirecrawlStringSchema,
	description: optionalFirecrawlStringSchema,
	snippet: optionalFirecrawlStringSchema,
	summary: optionalFirecrawlStringSchema,
	markdown: optionalFirecrawlStringSchema,
	content: optionalFirecrawlStringSchema,
	text: optionalFirecrawlStringSchema,
	publishedDate: optionalFirecrawlStringSchema,
	published: optionalFirecrawlStringSchema,
	metadata: firecrawlSearchMetadataSchema
});
function resolveSearchItems(payload, count) {
	const nestedData = asOptionalRecord(payload.data);
	const rawItems = [
		payload.data,
		payload.results,
		nestedData?.results,
		nestedData?.data,
		nestedData?.web,
		asOptionalRecord(payload.web)?.results
	].find((candidate) => Array.isArray(candidate));
	if (!rawItems) return [];
	const items = [];
	let inspectedObjects = 0;
	for (const rawItem of rawItems) {
		if (inspectedObjects >= FIRECRAWL_SEARCH_MAX_RESULTS || items.length >= count) break;
		const record = asOptionalRecord(rawItem);
		if (!record) continue;
		inspectedObjects += 1;
		const entry = firecrawlSearchItemSchema.parse(record);
		const metadata = entry.metadata;
		const url = normalizeFirecrawlResultUrl(entry.url || entry.sourceURL || entry.sourceUrl || metadata?.sourceURL || "");
		if (!url) continue;
		const title = entry.title || metadata?.title || "";
		const description = entry.description || entry.snippet || entry.summary || void 0;
		const content = entry.markdown || entry.content || entry.text || void 0;
		const rawPublished = entry.publishedDate || entry.published || metadata?.publishedTime || metadata?.publishedDate || void 0;
		const published = rawPublished && isValidFirecrawlPublishedDate(rawPublished) ? rawPublished : void 0;
		items.push({
			title,
			url,
			description,
			content,
			published,
			siteName: resolveSiteName(url)?.replace(/^www\./, "")
		});
	}
	return items;
}
function buildSearchPayload(params) {
	let remainingContentChars = FIRECRAWL_SEARCH_MAX_CONTENT_CHARS;
	let truncated = false;
	const wrapBoundedContent = (value) => {
		const bounded = truncateSanitizedExternalContent(value, remainingContentChars);
		truncated ||= bounded.truncated;
		remainingContentChars -= bounded.text.length;
		return wrapWebContent(bounded.text, "web_search");
	};
	const results = params.items.map((entry) => ({
		title: entry.title ? wrapBoundedContent(entry.title) : "",
		url: entry.url,
		description: entry.description ? wrapBoundedContent(entry.description) : "",
		...entry.published ? { published: entry.published } : {},
		...entry.siteName ? { siteName: entry.siteName } : {},
		...params.scrapeResults && entry.content ? { content: wrapBoundedContent(entry.content) } : {}
	}));
	return {
		query: params.query,
		provider: params.provider,
		count: params.items.length,
		tookMs: params.tookMs,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: params.provider,
			wrapped: true
		},
		results,
		...truncated ? { truncated: true } : {}
	};
}
async function runFirecrawlSearch(params) {
	params.signal?.throwIfAborted();
	const keyless = params.access === "keyless";
	const providerId = keyless ? "firecrawl-free" : "firecrawl";
	const apiKey = keyless ? void 0 : resolveFirecrawlApiKey(params.cfg);
	if (!apiKey && !keyless) throw new Error("web_search (firecrawl) needs a Firecrawl API key. Set FIRECRAWL_API_KEY in the Gateway environment, or configure plugins.entries.firecrawl.config.webSearch.apiKey.");
	const count = typeof params.count === "number" && Number.isFinite(params.count) ? Math.max(1, Math.min(100, Math.floor(params.count))) : DEFAULT_SEARCH_COUNT;
	const timeoutSeconds = resolveFirecrawlSearchTimeoutSeconds(params.timeoutSeconds);
	const scrapeResults = params.scrapeResults === true;
	const sources = Array.isArray(params.sources) ? params.sources.filter(Boolean) : [];
	const categories = Array.isArray(params.categories) ? params.categories.filter(Boolean) : [];
	const includeDomains = Array.isArray(params.includeDomains) ? params.includeDomains.filter(Boolean) : [];
	const excludeDomains = Array.isArray(params.excludeDomains) ? params.excludeDomains.filter(Boolean) : [];
	if (includeDomains.length > 0 && excludeDomains.length > 0) throw new Error("Firecrawl search accepts includeDomains or excludeDomains, not both.");
	const tbs = normalizeOptionalString(params.tbs);
	const location = normalizeOptionalString(params.location);
	const country = normalizeOptionalString(params.country);
	const baseUrl = resolveFirecrawlBaseUrl(params.cfg);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		type: "firecrawl-search",
		provider: providerId,
		q: params.query,
		count,
		baseUrl,
		sources,
		categories,
		includeDomains,
		excludeDomains,
		tbs,
		location,
		country,
		scrapeResults
	}));
	const cacheTtlMs = resolveCacheTtlMs(params.cfg?.tools?.web?.search?.cacheTtlMinutes, DEFAULT_CACHE_TTL_MINUTES);
	const cached = readCache(SEARCH_CACHE, cacheKey, cacheTtlMs);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const body = {
		query: params.query,
		limit: count
	};
	if (sources.length > 0) body.sources = sources;
	if (categories.length > 0) body.categories = categories;
	if (includeDomains.length > 0) body.includeDomains = includeDomains;
	if (excludeDomains.length > 0) body.excludeDomains = excludeDomains;
	if (tbs) body.tbs = tbs;
	if (location) body.location = location;
	if (country) body.country = country;
	if (scrapeResults) body.scrapeOptions = { formats: ["markdown"] };
	const start = Date.now();
	const endpoint = await resolveEndpoint(baseUrl, "/v2/search");
	const payload = await postFirecrawlJson({
		url: endpoint.url,
		mode: endpoint.mode,
		timeoutSeconds,
		apiKey,
		body,
		errorLabel: "Firecrawl Search",
		...params.signal ? { signal: params.signal } : {}
	}, async (response) => {
		const payloadValue = await readProviderJsonObjectResponse(response, "Firecrawl Search API error");
		if (payloadValue.success === false) {
			const error = typeof payloadValue.error === "string" ? payloadValue.error : typeof payloadValue.message === "string" ? payloadValue.message : "unknown error";
			const safeError = wrapWebContent(truncateSanitizedExternalContent(error, 1e3).text, "web_search");
			throw new Error(`Firecrawl Search API error: ${safeError}`);
		}
		return payloadValue;
	});
	const result = buildSearchPayload({
		query: params.query,
		provider: providerId,
		items: resolveSearchItems(payload, count),
		tookMs: Date.now() - start,
		scrapeResults
	});
	writeCache(SEARCH_CACHE, cacheKey, result, cacheTtlMs);
	return result;
}
function resolveScrapeData(payload) {
	const data = payload.data;
	if (data && typeof data === "object") return data;
	return {};
}
function parseFirecrawlScrapePayload(params) {
	const data = resolveScrapeData(params.payload);
	const metadata = data.metadata && typeof data.metadata === "object" ? data.metadata : void 0;
	const rawStatus = parseFiniteNumber(metadata?.statusCode) ?? parseFiniteNumber(data.statusCode);
	const status = rawStatus === void 0 ? void 0 : Math.floor(rawStatus);
	if (status !== void 0 && (status < 200 || status >= 300)) throw new Error(`Firecrawl fetch failed (${status}): target returned an unsuccessful HTTP status.`);
	const markdown = typeof data.markdown === "string" && data.markdown || typeof data.content === "string" && data.content || "";
	if (!markdown) throw new Error("Firecrawl scrape returned no content.");
	const rawText = params.extractMode === "text" ? markdownToText(markdown) : markdown;
	const boundedText = truncateSanitizedExternalContent(rawText, params.maxChars);
	let truncated = boundedText.truncated;
	let remainingMetadataChars = FIRECRAWL_SCRAPE_METADATA_MAX_CHARS;
	const wrapBoundedMetadata = (value) => {
		const bounded = truncateSanitizedExternalContent(value, remainingMetadataChars);
		truncated ||= bounded.truncated;
		remainingMetadataChars -= bounded.text.length;
		return wrapExternalContent(bounded.text, {
			source: "web_fetch",
			includeWarning: false
		});
	};
	const wrappedText = wrapExternalContent(boundedText.text, {
		source: "web_fetch",
		includeWarning: false
	});
	const title = typeof metadata?.title === "string" && metadata.title ? wrapBoundedMetadata(metadata.title) : void 0;
	const warning = typeof params.payload.warning === "string" && params.payload.warning ? wrapBoundedMetadata(params.payload.warning) : void 0;
	return {
		url: params.url,
		finalUrl: normalizeFirecrawlResultUrl(metadata?.sourceURL) ?? normalizeFirecrawlResultUrl(data.url) ?? params.url,
		...status !== void 0 ? { status } : {},
		...title ? { title } : {},
		extractor: "firecrawl",
		extractMode: params.extractMode,
		externalContent: {
			untrusted: true,
			source: "web_fetch",
			wrapped: true
		},
		truncated,
		rawLength: rawText.length,
		length: wrappedText.length,
		text: wrappedText,
		...warning ? { warning } : {}
	};
}
async function runFirecrawlScrape(params) {
	params.signal?.throwIfAborted();
	assertFirecrawlScrapeTargetAllowed(params.url);
	const apiKey = resolveFirecrawlApiKey(params.cfg);
	if (!apiKey && params.access !== "keyless") throw new Error("firecrawl_scrape needs a Firecrawl API key. Set FIRECRAWL_API_KEY in the Gateway environment, or configure plugins.entries.firecrawl.config.webFetch.apiKey.");
	const baseUrl = resolveFirecrawlBaseUrl(params.cfg);
	const timeoutSeconds = resolveFirecrawlScrapeTimeoutSeconds(params.cfg, params.timeoutSeconds);
	const onlyMainContent = resolveFirecrawlOnlyMainContent(params.cfg, params.onlyMainContent);
	const maxAgeMs = resolveFirecrawlMaxAgeMs(params.cfg, params.maxAgeMs);
	const proxy = params.proxy ?? "auto";
	const storeInCache = params.storeInCache ?? true;
	const configuredMaxCharsCap = params.cfg?.tools?.web?.fetch?.maxCharsCap;
	const maxCharsCap = typeof configuredMaxCharsCap === "number" && Number.isFinite(configuredMaxCharsCap) && configuredMaxCharsCap > 0 ? Math.floor(configuredMaxCharsCap) : DEFAULT_SCRAPE_MAX_CHARS;
	const requestedMaxChars = typeof params.maxChars === "number" && Number.isFinite(params.maxChars) && params.maxChars > 0 ? Math.floor(params.maxChars) : DEFAULT_SCRAPE_MAX_CHARS;
	const maxChars = Math.min(requestedMaxChars, maxCharsCap);
	const endpoint = await resolveEndpoint(baseUrl, "/v2/scrape");
	return parseFirecrawlScrapePayload({
		payload: await postFirecrawlJson({
			url: endpoint.url,
			mode: endpoint.mode,
			timeoutSeconds,
			apiKey,
			errorLabel: "Firecrawl",
			...params.signal ? { signal: params.signal } : {},
			body: {
				url: params.url,
				formats: ["markdown"],
				onlyMainContent,
				timeout: timeoutSeconds * 1e3,
				maxAge: maxAgeMs,
				proxy,
				storeInCache
			}
		}, async (response) => {
			const data = await readProviderJsonObjectResponse(response, "Firecrawl fetch failed", { maxBytes: FIRECRAWL_SCRAPE_RESPONSE_MAX_BYTES });
			if (data.success === false) {
				const detail = typeof data.error === "string" ? data.error : typeof data.message === "string" ? data.message : response.statusText;
				throw new Error(`Firecrawl fetch failed (${response.status}): ${wrapWebContent(truncateSanitizedExternalContent(detail, FIRECRAWL_SCRAPE_METADATA_MAX_CHARS).text, "web_fetch")}`.trim());
			}
			return data;
		}),
		url: params.url,
		extractMode: params.extractMode,
		maxChars
	});
}
const testing = {
	assertFirecrawlScrapeTargetAllowed,
	parseFirecrawlScrapePayload,
	postFirecrawlJson,
	resolveEndpoint,
	resolveSearchItems
};
//#endregion
export { runFirecrawlScrape as n, runFirecrawlSearch as r, firecrawl_client_exports as t };
