import { decodeHtmlEntities } from "openclaw/plugin-sdk/html-entity-runtime";
import { ProviderHttpError, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { DEFAULT_CACHE_TTL_MINUTES, DEFAULT_SEARCH_COUNT, normalizeCacheKey, readCache, readResponseText, resolveCacheTtlMs, resolveSearchCount, resolveSiteName, resolveTimeoutSeconds, withTrustedWebSearchEndpoint, wrapWebContent, writeCache } from "openclaw/plugin-sdk/provider-web-search";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/duckduckgo/src/config.ts
const DEFAULT_DDG_SAFE_SEARCH = "moderate";
function resolveDdgWebSearchConfig(config) {
	const webSearch = (config?.plugins?.entries?.duckduckgo?.config)?.webSearch;
	if (webSearch && typeof webSearch === "object" && !Array.isArray(webSearch)) return webSearch;
}
function resolveDdgRegion(config) {
	return normalizeOptionalString(resolveDdgWebSearchConfig(config)?.region);
}
function resolveDdgSafeSearch(config) {
	const safeSearch = resolveDdgWebSearchConfig(config)?.safeSearch;
	const normalized = normalizeLowercaseStringOrEmpty(safeSearch);
	if (normalized === "strict" || normalized === "off") return normalized;
	return DEFAULT_DDG_SAFE_SEARCH;
}
//#endregion
//#region extensions/duckduckgo/src/ddg-client.ts
const DDG_HTML_ENDPOINT = "https://html.duckduckgo.com/html";
const DEFAULT_TIMEOUT_SECONDS = 20;
const DDG_HTML_ENTITY_RE = /&(?:lt|gt|quot|apos|#39|#x27|#x2F|nbsp|ndash|mdash|hellip|amp|#\d+|#x[0-9a-f]+);/gi;
const DDG_ENTITY_TEXT = {
	"\xA0": " ",
	"–": "-",
	"—": "--",
	"…": "..."
};
const DDG_SAFE_SEARCH_PARAM = {
	strict: "1",
	moderate: "-1",
	off: "-2"
};
const DDG_SEARCH_CACHE = /* @__PURE__ */ new Map();
function decodeHtmlEntities$1(text) {
	return text.replace(DDG_HTML_ENTITY_RE, (entity) => {
		const decoded = decodeHtmlEntities(entity.startsWith("&#") ? entity : entity.toLowerCase());
		return DDG_ENTITY_TEXT[decoded] ?? decoded;
	});
}
function stripHtml(html) {
	return html.replace(/<\/?b\b[^>]*>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function decodeDuckDuckGoUrl(rawUrl) {
	try {
		const normalized = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;
		const uddg = new URL(normalized).searchParams.get("uddg");
		if (uddg) return uddg;
	} catch {}
	return rawUrl;
}
function readHrefAttribute(tagAttributes) {
	return /\bhref="([^"]*)"/i.exec(tagAttributes)?.[1] ?? "";
}
function isBotChallenge(html) {
	if (/class="[^"]*\bresult__a\b[^"]*"/i.test(html)) return false;
	return /g-recaptcha|are you a human|id="challenge-form"|name="challenge"/i.test(html);
}
async function readDuckDuckGoHtmlResponse(response) {
	return await readProviderTextResponse(response, "DuckDuckGo search");
}
function parseDuckDuckGoHtml(html, count) {
	const results = [];
	const resultRegex = /<a\b(?=[^>]*\bclass="[^"]*\bresult__a\b[^"]*")([^>]*)>([\s\S]*?)<\/a>/gi;
	const nextResultRegex = /<a\b(?=[^>]*\bclass="[^"]*\bresult__a\b[^"]*")[^>]*>/i;
	const snippetRegex = /<a\b(?=[^>]*\bclass="[^"]*\bresult__snippet\b[^"]*")[^>]*>([\s\S]*?)<\/a>/i;
	for (const match of html.matchAll(resultRegex)) {
		const rawAttributes = match[1] ?? "";
		const rawTitle = match[2] ?? "";
		const rawUrl = readHrefAttribute(rawAttributes);
		const matchEnd = (match.index ?? 0) + match[0].length;
		const trailingHtml = html.slice(matchEnd);
		const nextResultIndex = trailingHtml.search(nextResultRegex);
		const scopedTrailingHtml = nextResultIndex >= 0 ? trailingHtml.slice(0, nextResultIndex) : trailingHtml;
		const rawSnippet = snippetRegex.exec(scopedTrailingHtml)?.[1] ?? "";
		const title = decodeHtmlEntities$1(stripHtml(rawTitle));
		const url = decodeDuckDuckGoUrl(decodeHtmlEntities$1(rawUrl));
		const snippet = decodeHtmlEntities$1(stripHtml(rawSnippet));
		if (title && url) {
			results.push({
				title,
				url,
				snippet
			});
			if (results.length >= count) break;
		}
	}
	return results;
}
async function runDuckDuckGoSearch(params) {
	const count = resolveSearchCount(params.count, DEFAULT_SEARCH_COUNT);
	const region = params.region ?? resolveDdgRegion(params.config);
	const safeSearch = params.safeSearch === "strict" || params.safeSearch === "moderate" || params.safeSearch === "off" ? params.safeSearch : resolveDdgSafeSearch(params.config);
	const timeoutSeconds = resolveTimeoutSeconds(params.timeoutSeconds, DEFAULT_TIMEOUT_SECONDS);
	const cacheTtlMs = resolveCacheTtlMs(params.cacheTtlMinutes ?? params.config?.tools?.web?.search?.cacheTtlMinutes, DEFAULT_CACHE_TTL_MINUTES);
	const cacheKey = normalizeCacheKey(JSON.stringify({
		provider: "duckduckgo",
		query: params.query,
		count,
		region: region ?? "",
		safeSearch
	}));
	const cached = readCache(DDG_SEARCH_CACHE, cacheKey, cacheTtlMs);
	if (cached) return {
		...cached.value,
		cached: true
	};
	const url = new URL(DDG_HTML_ENDPOINT);
	url.searchParams.set("q", params.query);
	if (region) url.searchParams.set("kl", region);
	url.searchParams.set("kp", DDG_SAFE_SEARCH_PARAM[safeSearch]);
	const startedAt = Date.now();
	const results = await withTrustedWebSearchEndpoint({
		url: url.toString(),
		timeoutSeconds,
		signal: params.signal,
		init: {
			method: "GET",
			headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" }
		}
	}, async (response) => {
		if (!response.ok) {
			const detail = (await readResponseText(response, { maxBytes: 64e3 })).text;
			throw new ProviderHttpError(`DuckDuckGo search error (${response.status}): ${detail || response.statusText}`, { status: response.status });
		}
		const html = await readDuckDuckGoHtmlResponse(response);
		if (isBotChallenge(html)) throw new Error("DuckDuckGo returned a bot-detection challenge.");
		return parseDuckDuckGoHtml(html, count);
	});
	params.signal?.throwIfAborted();
	const payload = {
		query: params.query,
		provider: "duckduckgo",
		count: results.length,
		tookMs: Date.now() - startedAt,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: "duckduckgo",
			wrapped: true
		},
		results: results.map((result) => ({
			title: wrapWebContent(result.title, "web_search"),
			url: result.url,
			snippet: result.snippet ? wrapWebContent(result.snippet, "web_search") : "",
			siteName: resolveSiteName(result.url) || void 0
		}))
	};
	writeCache(DDG_SEARCH_CACHE, cacheKey, payload, cacheTtlMs);
	return payload;
}
//#endregion
export { runDuckDuckGoSearch };
