import { ProviderHttpError } from "openclaw/plugin-sdk/provider-http";
import { DEFAULT_CACHE_TTL_MINUTES, DEFAULT_SEARCH_COUNT, externalContentStamp, nativeWebSearchCodecs, readCachedSearchPayload, readResponseText, resolveCacheTtlMs, resolveSearchCount, resolveTimeoutSeconds, withSelfHostedWebSearchEndpoint, withTrustedWebSearchEndpoint, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { resolveProviderWebSearchPluginConfig } from "openclaw/plugin-sdk/provider-web-search-config-contract";
import { normalizeSecretInput } from "openclaw/plugin-sdk/secret-input";
import { resolveReadOnlyEnvSecretRef } from "openclaw/plugin-sdk/secret-ref-readonly";
import { assertHttpUrlTargetsPrivateNetwork, isBlockedHostnameOrIp, isPrivateIpAddress, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { asOptionalObjectRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/searxng/src/searxng-client.ts
const SEARXNG_BASE_URL_ENV_VAR = "SEARXNG_BASE_URL";
const SEARXNG_BASE_URL_PATH = "plugins.entries.searxng.config.webSearch.baseUrl";
const DEFAULT_TIMEOUT_SECONDS = 20;
const MAX_RESPONSE_BYTES = 1e6;
function readUnresponsiveEngines(parsed) {
	const raw = asOptionalObjectRecord(parsed)?.unresponsive_engines;
	const engines = [];
	for (const entry of Array.isArray(raw) ? raw : []) {
		const [engine, reason] = Array.isArray(entry) ? entry : [entry];
		if (typeof engine !== "string" || engine.length === 0) continue;
		engines.push(typeof reason === "string" && reason.length > 0 ? `${engine} (${reason})` : engine);
	}
	return engines;
}
function normalizeBaseUrl(value) {
	return normalizeSecretInput(value)?.replace(/\/+$/u, "") || void 0;
}
function resolveSearxngBaseUrl(config) {
	const webSearch = resolveProviderWebSearchPluginConfig(config, "searxng");
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
async function searxngEndpointTargetsPrivateNetwork(url) {
	if (isBlockedHostnameOrIp(url.hostname)) return true;
	try {
		return (await resolvePinnedHostnameWithPolicy(url.hostname, { policy: {
			allowPrivateNetwork: true,
			allowRfc2544BenchmarkRange: true
		} })).addresses.every((address) => isPrivateIpAddress(address));
	} catch {
		return false;
	}
}
async function validateSearxngBaseUrl(baseUrl) {
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
			errorMessage: "SearXNG HTTP base URL must target a trusted private or loopback host. Use https:// for public hosts."
		});
		return "selfHosted";
	}
	return await searxngEndpointTargetsPrivateNetwork(parsed) ? "selfHosted" : "strict";
}
async function runSearxngSearch(params) {
	params.signal?.throwIfAborted();
	const count = resolveSearchCount(params.count ?? params.config?.tools?.web?.search?.maxResults, DEFAULT_SEARCH_COUNT);
	const categories = params.categories ?? normalizeOptionalString(resolveProviderWebSearchPluginConfig(params.config, "searxng")?.categories);
	const language = params.language ?? normalizeOptionalString(resolveProviderWebSearchPluginConfig(params.config, "searxng")?.language);
	const baseUrl = resolveSearxngBaseUrl(params.config);
	const timeoutSeconds = resolveTimeoutSeconds(params.config?.tools?.web?.search?.timeoutSeconds, DEFAULT_TIMEOUT_SECONDS);
	const cacheTtlMs = resolveCacheTtlMs(params.config?.tools?.web?.search?.cacheTtlMinutes, DEFAULT_CACHE_TTL_MINUTES);
	if (!baseUrl) throw new Error("SearXNG base URL is not configured. Set SEARXNG_BASE_URL or configure plugins.entries.searxng.config.webSearch.baseUrl.");
	const endpointMode = await validateSearxngBaseUrl(baseUrl);
	params.signal?.throwIfAborted();
	const cacheKey = JSON.stringify({
		provider: "searxng",
		query: params.query,
		count,
		categories: categories ?? "",
		language: language ?? "",
		baseUrl
	});
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const startedAt = Date.now();
	const query = params.query;
	const signal = params.signal;
	const fetchSearxngResults = async (searchCategories) => {
		let url = new URL(baseUrl);
		const basePathname = url.pathname.replace(/\/+$/u, "");
		url.pathname = basePathname.endsWith("/search") ? basePathname : `${basePathname}/search`;
		url.search = "";
		url = new URL(nativeWebSearchCodecs["searxng.search"].request(url.href, query, count).url);
		if (searchCategories) url.searchParams.set("categories", searchCategories);
		if (language) url.searchParams.set("language", language);
		return await (endpointMode === "selfHosted" ? withSelfHostedWebSearchEndpoint : withTrustedWebSearchEndpoint)({
			url: url.toString(),
			timeoutSeconds,
			signal,
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
			const text = body.text;
			let parsed;
			try {
				parsed = JSON.parse(text);
			} catch {
				throw new Error("SearXNG returned invalid JSON.");
			}
			return {
				results: nativeWebSearchCodecs["searxng.search"].results(parsed, count),
				unresponsiveEngines: readUnresponsiveEngines(parsed)
			};
		});
	};
	let page = await fetchSearxngResults(categories);
	params.signal?.throwIfAborted();
	if (page.results.length === 0 && categories) {
		const normalized = categories.split(",").map((category) => category.trim().toLowerCase()).filter((category) => category.length > 0);
		if (normalized.length > 0 && !normalized.includes("general")) {
			page = await fetchSearxngResults("general");
			params.signal?.throwIfAborted();
		}
	}
	const { results, unresponsiveEngines } = page;
	if (results.length === 0 && unresponsiveEngines.length > 0) throw new Error(`SearXNG returned no results and reported unresponsive engines: ${unresponsiveEngines.join(", ")}.`);
	const payload = {
		query: params.query,
		provider: "searxng",
		count: results.length,
		tookMs: Date.now() - startedAt,
		externalContent: externalContentStamp("searxng"),
		results
	};
	writeCachedSearchPayload(cacheKey, payload, cacheTtlMs);
	return payload;
}
export { runSearxngSearch };
