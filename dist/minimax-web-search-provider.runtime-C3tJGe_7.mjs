import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { m as readProviderJsonResponse, o as createProviderHttpError, u as formatProviderHttpErrorMessage } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as readProviderEnvValue } from "./provider-credential-values-DSE2VVU-.mjs";
import { o as wrapWebContent } from "./external-content-CLufk6dK.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { _ as resolveSiteName, b as withTrustedWebSearchEndpoint, f as readCachedSearchPayload, g as resolveSearchTimeoutSeconds, h as resolveSearchCount, i as buildSearchCacheKey, m as resolveSearchCacheTtlMs, p as readConfiguredSecretString, x as writeCachedSearchPayload } from "./web-search-provider-common-6Yt6-I5E.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { i as resolveProviderWebSearchPluginConfig, r as mergeScopedSearchConfig } from "./web-search-provider-config-CW8dwkHd.mjs";
import "./provider-web-search-CRDOBhl4.mjs";
//#region extensions/minimax/src/minimax-web-search-provider.runtime.ts
const MINIMAX_SEARCH_ENDPOINT_GLOBAL = "https://api.minimax.io/v1/coding_plan/search";
const MINIMAX_SEARCH_ENDPOINT_CN = "https://api.minimaxi.com/v1/coding_plan/search";
const MINIMAX_TOKEN_PLAN_ENV_VARS = [
	"MINIMAX_CODE_PLAN_KEY",
	"MINIMAX_CODING_API_KEY",
	"MINIMAX_OAUTH_TOKEN"
];
function resolveMiniMaxApiKey(searchConfig) {
	return readConfiguredSecretString(searchConfig?.apiKey, "plugins.entries.minimax.config.webSearch.apiKey") ?? readProviderEnvValue([...MINIMAX_TOKEN_PLAN_ENV_VARS, "MINIMAX_API_KEY"]);
}
function isMiniMaxCnHost(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return false;
	try {
		return new URL(trimmed).hostname.endsWith("minimaxi.com");
	} catch {
		return trimmed.includes("minimaxi.com");
	}
}
function resolveMiniMaxRegion(searchConfig, config) {
	const minimax = typeof searchConfig?.minimax === "object" && searchConfig.minimax !== null && !Array.isArray(searchConfig.minimax) ? searchConfig.minimax : void 0;
	const configuredRegion = typeof minimax?.region === "string" ? normalizeOptionalString(minimax.region) : void 0;
	if (configuredRegion) return configuredRegion === "cn" ? "cn" : "global";
	if (isMiniMaxCnHost(process.env.MINIMAX_API_HOST)) return "cn";
	const providers = (config?.models)?.providers;
	const minimaxProvider = providers?.minimax;
	const portalProvider = providers?.["minimax-portal"];
	const baseUrl = typeof minimaxProvider?.baseUrl === "string" ? minimaxProvider.baseUrl : "";
	const portalBaseUrl = typeof portalProvider?.baseUrl === "string" ? portalProvider.baseUrl : "";
	if (isMiniMaxCnHost(baseUrl) || isMiniMaxCnHost(portalBaseUrl)) return "cn";
	return "global";
}
function resolveMiniMaxEndpoint(searchConfig, config) {
	return resolveMiniMaxRegion(searchConfig, config) === "cn" ? MINIMAX_SEARCH_ENDPOINT_CN : MINIMAX_SEARCH_ENDPOINT_GLOBAL;
}
async function runMiniMaxSearch(params) {
	return withTrustedWebSearchEndpoint({
		url: params.endpoint,
		timeoutSeconds: params.timeoutSeconds,
		signal: params.signal,
		init: {
			method: "POST",
			headers: {
				Authorization: `Bearer ${params.apiKey}`,
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({ q: params.query })
		}
	}, async (res) => {
		if (!res.ok) throw await createProviderHttpError(res, "MiniMax Search API error");
		const data = await readProviderJsonResponse(res, "MiniMax Search API error");
		if (data.base_resp?.status_code && data.base_resp.status_code !== 0) throw new Error(formatProviderHttpErrorMessage({
			label: "MiniMax Search API error",
			status: data.base_resp.status_code,
			detail: data.base_resp.status_msg || "unknown error"
		}));
		return {
			results: (Array.isArray(data.organic) ? data.organic : []).slice(0, params.count).map((entry) => {
				const title = entry.title ?? "";
				const url = entry.link ?? "";
				const snippet = entry.snippet ?? "";
				return {
					title: title ? wrapWebContent(title, "web_search") : "",
					url,
					description: snippet ? wrapWebContent(snippet, "web_search") : "",
					published: entry.date || void 0,
					siteName: resolveSiteName(url) || void 0
				};
			}),
			relatedSearches: Array.isArray(data.related_searches) ? data.related_searches.map((r) => r.query).filter((q) => typeof q === "string" && q.length > 0).map((q) => wrapWebContent(q, "web_search")) : void 0
		};
	});
}
function missingMiniMaxKeyPayload() {
	return {
		error: "missing_minimax_api_key",
		message: `web_search (minimax) needs a MiniMax Token Plan key or OAuth token. Run \`${formatCliCommand("openclaw configure --section web")}\` to store it, or set MINIMAX_CODE_PLAN_KEY, MINIMAX_CODING_API_KEY, MINIMAX_OAUTH_TOKEN, or MINIMAX_API_KEY in the Gateway environment.`,
		docs: "https://docs.openclaw.ai/tools/web"
	};
}
async function executeMiniMaxWebSearchProviderTool(ctx, args, signal) {
	const searchConfig = mergeScopedSearchConfig(ctx.searchConfig, "minimax", resolveProviderWebSearchPluginConfig(ctx.config, "minimax"), { mirrorApiKeyToTopLevel: true });
	const config = ctx.config;
	const apiKey = resolveMiniMaxApiKey(searchConfig);
	if (!apiKey) return missingMiniMaxKeyPayload();
	const params = args;
	const query = readToolStringParam(params, "query", { required: true });
	const count = readPositiveIntegerParam(params, "count", {
		max: 10,
		message: `count must be an integer from 1 to 10.`
	}) ?? searchConfig?.maxResults ?? void 0;
	const resolvedCount = resolveSearchCount(count, 5);
	const endpoint = resolveMiniMaxEndpoint(searchConfig, config);
	const cacheKey = buildSearchCacheKey([
		"minimax",
		endpoint,
		query,
		resolvedCount
	]);
	const cacheTtlMs = resolveSearchCacheTtlMs(searchConfig);
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const start = Date.now();
	const { results, relatedSearches } = await runMiniMaxSearch({
		query,
		count: resolvedCount,
		apiKey,
		endpoint,
		timeoutSeconds: resolveSearchTimeoutSeconds(searchConfig),
		signal
	});
	signal?.throwIfAborted();
	const payload = {
		query,
		provider: "minimax",
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: "minimax",
			wrapped: true
		},
		results
	};
	if (relatedSearches && relatedSearches.length > 0) payload.relatedSearches = relatedSearches;
	writeCachedSearchPayload(cacheKey, payload, cacheTtlMs);
	return payload;
}
//#endregion
export { executeMiniMaxWebSearchProviderTool };
