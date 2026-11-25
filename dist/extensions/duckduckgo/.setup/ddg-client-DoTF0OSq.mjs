import { createRequire } from "node:module";
import { readPluginPackageVersion } from "openclaw/plugin-sdk/extension-shared";
import { decodeHtmlEntities } from "openclaw/plugin-sdk/html-entity-runtime";
import { ProviderHttpError, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { DEFAULT_SEARCH_COUNT, externalContentStamp, readCachedSearchPayload, readResponseText, resolveSearchCacheTtlMs, resolveSearchCount, resolveSiteName, resolveTimeoutSeconds, withTrustedWebSearchEndpoint, wrapWebContent, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { resolveProviderWebSearchPluginConfig } from "openclaw/plugin-sdk/provider-web-search-config-contract";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/duckduckgo/src/ddg-client.ts
const require = createRequire(import.meta.url);
const DDG_USER_AGENT = `openclaw-duckduckgo/${readPluginPackageVersion({ require })} (+https://docs.openclaw.ai)`;
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
function decodeHtmlEntities$1(text) {
	return text.replace(DDG_HTML_ENTITY_RE, (entity) => {
		const decoded = decodeHtmlEntities(entity.startsWith("&#") ? entity : entity.toLowerCase());
		return DDG_ENTITY_TEXT[decoded] ?? decoded;
	});
}
function stripHtml(html) {
	return html.replace(/<\/?b\b[^>]*>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
async function runDuckDuckGoSearch(params) {
	const count = resolveSearchCount(params.count, DEFAULT_SEARCH_COUNT);
	const region = params.region ?? normalizeOptionalString(resolveProviderWebSearchPluginConfig(params.config, "duckduckgo")?.region);
	let safeSearch = params.safeSearch;
	if (safeSearch == null) {
		const normalized = normalizeLowercaseStringOrEmpty(resolveProviderWebSearchPluginConfig(params.config, "duckduckgo")?.safeSearch);
		safeSearch = normalized === "strict" || normalized === "off" ? normalized : "moderate";
	}
	const timeoutSeconds = resolveTimeoutSeconds(params.timeoutSeconds, DEFAULT_TIMEOUT_SECONDS);
	const cacheTtlMs = resolveSearchCacheTtlMs(params.config?.tools?.web?.search);
	const cacheKey = JSON.stringify({
		provider: "duckduckgo",
		query: params.query,
		count,
		region: region ?? "",
		safeSearch
	});
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
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
			headers: { "User-Agent": DDG_USER_AGENT }
		}
	}, async (response) => {
		if (!response.ok) {
			const detail = (await readResponseText(response, { maxBytes: 64e3 })).text;
			throw new ProviderHttpError(`DuckDuckGo search error (${response.status}): ${detail || response.statusText}`, { status: response.status });
		}
		const html = await readProviderTextResponse(response, "DuckDuckGo search");
		if (!/class="[^"]*\bresult__a\b[^"]*"/i.test(html) && /g-recaptcha|are you a human|id="challenge-form"|name="challenge"/i.test(html)) throw new Error("DuckDuckGo returned a bot-detection challenge.");
		const parsedResults = [];
		const resultRegex = /<a\b(?=[^>]*\bclass="[^"]*\bresult__a\b[^"]*")([^>]*)>([\s\S]*?)<\/a>/gi;
		const nextResultRegex = /<a\b(?=[^>]*\bclass="[^"]*\bresult__a\b[^"]*")[^>]*>/i;
		const snippetRegex = /<a\b(?=[^>]*\bclass="[^"]*\bresult__snippet\b[^"]*")[^>]*>([\s\S]*?)<\/a>/i;
		for (const match of html.matchAll(resultRegex)) {
			const rawAttributes = match[1] ?? "";
			const rawTitle = match[2] ?? "";
			const rawUrl = /\bhref="([^"]*)"/i.exec(rawAttributes)?.[1] ?? "";
			const matchEnd = (match.index ?? 0) + match[0].length;
			const trailingHtml = html.slice(matchEnd);
			const nextResultIndex = trailingHtml.search(nextResultRegex);
			const scopedTrailingHtml = nextResultIndex >= 0 ? trailingHtml.slice(0, nextResultIndex) : trailingHtml;
			const rawSnippet = snippetRegex.exec(scopedTrailingHtml)?.[1] ?? "";
			const title = decodeHtmlEntities$1(stripHtml(rawTitle));
			let resultUrl = decodeHtmlEntities$1(rawUrl);
			try {
				const normalized = resultUrl.startsWith("//") ? `https:${resultUrl}` : resultUrl;
				const uddg = new URL(normalized).searchParams.get("uddg");
				if (uddg) resultUrl = uddg;
			} catch {}
			const snippet = decodeHtmlEntities$1(stripHtml(rawSnippet));
			if (title && resultUrl) {
				parsedResults.push({
					title,
					url: resultUrl,
					snippet
				});
				if (parsedResults.length >= count) break;
			}
		}
		return parsedResults;
	});
	params.signal?.throwIfAborted();
	const payload = {
		query: params.query,
		provider: "duckduckgo",
		count: results.length,
		tookMs: Date.now() - startedAt,
		externalContent: externalContentStamp("duckduckgo"),
		results: results.map((result) => ({
			title: wrapWebContent(result.title, "web_search"),
			url: result.url,
			snippet: result.snippet ? wrapWebContent(result.snippet, "web_search") : "",
			siteName: resolveSiteName(result.url) || void 0
		}))
	};
	writeCachedSearchPayload(cacheKey, payload, cacheTtlMs);
	return payload;
}
export { runDuckDuckGoSearch };
