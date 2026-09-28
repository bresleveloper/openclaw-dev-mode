import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { b as redactProviderResponseErrorText, m as readProviderJsonResponse, t as ProviderHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { o as wrapWebContent } from "./external-content-CLufk6dK.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { a as truncateWebFetchText } from "./web-fetch-utils-DnxqFjuE.mjs";
import { a as readResponseText } from "./web-shared-7z6bteLg.mjs";
import { _ as resolveSiteName, h as resolveSearchCount } from "./web-search-provider-common-6Yt6-I5E.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./provider-auth-runtime-BveQzsWa.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import { i as resolveProviderWebSearchPluginConfig } from "./web-search-provider-config-CW8dwkHd.mjs";
import { t as resolveWebSearchProviderCredential } from "./provider-web-search-CRDOBhl4.mjs";
import { n as OLLAMA_CLOUD_BASE_URL, o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-Dkg1KktH.mjs";
import { t as readProviderBaseUrl } from "./provider-base-url-Crmh7W8f.mjs";
import { n as buildOllamaBaseUrlSsrFPolicy, u as fetchOllamaModels, y as resolveOllamaApiBase } from "./provider-models-DGKSrDJa.mjs";
import { n as OLLAMA_WEB_SEARCH_TOOL_PARAMETERS, t as OLLAMA_WEB_SEARCH_TOOL_DESCRIPTION } from "./web-search-contract-DrYBQMoZ.mjs";
//#region extensions/ollama/src/web-search-provider.runtime.ts
const OLLAMA_HOSTED_WEB_SEARCH_PATH = "/api/web_search";
const OLLAMA_LOCAL_WEB_SEARCH_PROXY_PATH = "/api/experimental/web_search";
const DEFAULT_OLLAMA_WEB_SEARCH_COUNT = 5;
const DEFAULT_OLLAMA_WEB_SEARCH_TIMEOUT_MS = 15e3;
const OLLAMA_WEB_SEARCH_SNIPPET_MAX_CHARS = 300;
const OLLAMA_CLOUD_WEB_SEARCH_AUTH_ERROR = "Hosted Ollama Web Search requires an API key. Set OLLAMA_API_KEY or configure models.providers.ollama.apiKey.";
async function readOllamaWebSearchResponse(response) {
	return await readProviderJsonResponse(response, "Ollama web search");
}
function isOllamaCloudBaseUrl(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		return parsed.protocol === "https:" && parsed.hostname === "ollama.com";
	} catch {
		return false;
	}
}
function normalizeOllamaWebSearchApiKey(value) {
	const apiKey = normalizeOptionalSecretInput(value);
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
}
function resolveEnvOllamaWebSearchApiKey() {
	return normalizeOllamaWebSearchApiKey(resolveEnvApiKey("ollama")?.apiKey);
}
function createOllamaWebSearchCredentialError(ref) {
	return /* @__PURE__ */ new Error(ref.source === "env" ? `models.providers.ollama.apiKey env SecretRef ${ref.id} is not available for Ollama web search.` : "models.providers.ollama.apiKey SecretRef cannot be resolved by Ollama web search. Use an env SecretRef for this path.");
}
function resolveConfiguredOllamaWebSearchApiKey(config) {
	const credentialValue = config?.models?.providers?.ollama?.apiKey;
	const credentialRef = coerceSecretRef(credentialValue);
	const resolvedValue = normalizeOllamaWebSearchApiKey(resolveWebSearchProviderCredential({
		credentialValue,
		path: "models.providers.ollama.apiKey",
		envVars: []
	}));
	if (credentialRef && !resolvedValue) throw createOllamaWebSearchCredentialError(credentialRef);
	return resolvedValue;
}
function resolveOllamaWebSearchBaseUrl(config) {
	const pluginBaseUrl = normalizeOptionalString(resolveProviderWebSearchPluginConfig(config, "ollama")?.baseUrl);
	if (pluginBaseUrl) return resolveOllamaApiBase(pluginBaseUrl);
	const configuredBaseUrl = readProviderBaseUrl(config?.models?.providers?.ollama);
	if (configuredBaseUrl) return resolveOllamaApiBase(configuredBaseUrl);
	return OLLAMA_DEFAULT_BASE_URL;
}
function normalizeOllamaWebSearchResult(result) {
	const url = normalizeOptionalString(result.url) ?? "";
	if (!url) return null;
	return {
		title: normalizeOptionalString(result.title) ?? "",
		url,
		content: normalizeOptionalString(result.content) ?? ""
	};
}
function buildOllamaWebSearchAttempts(params) {
	if (isOllamaCloudBaseUrl(params.baseUrl)) return [{
		baseUrl: params.baseUrl,
		path: OLLAMA_HOSTED_WEB_SEARCH_PATH,
		apiKey: params.configuredApiKey ?? params.envApiKey
	}];
	const attempts = [{
		baseUrl: params.baseUrl,
		path: OLLAMA_LOCAL_WEB_SEARCH_PROXY_PATH,
		apiKey: params.configuredApiKey
	}, {
		baseUrl: params.baseUrl,
		path: OLLAMA_HOSTED_WEB_SEARCH_PATH,
		apiKey: params.configuredApiKey
	}];
	if (params.envApiKey) attempts.push({
		baseUrl: OLLAMA_CLOUD_BASE_URL,
		path: OLLAMA_HOSTED_WEB_SEARCH_PATH,
		apiKey: params.envApiKey
	});
	return attempts;
}
async function runOllamaWebSearch(params) {
	const query = params.query.trim();
	if (!query) throw new Error("query parameter is required");
	const baseUrl = resolveOllamaWebSearchBaseUrl(params.config);
	const configuredApiKey = resolveConfiguredOllamaWebSearchApiKey(params.config);
	const envApiKey = resolveEnvOllamaWebSearchApiKey();
	const count = resolveSearchCount(params.count, DEFAULT_OLLAMA_WEB_SEARCH_COUNT);
	const startedAt = Date.now();
	const body = JSON.stringify({
		query,
		max_results: count
	});
	const attempts = buildOllamaWebSearchAttempts({
		baseUrl,
		configuredApiKey,
		envApiKey
	});
	let payload;
	let lastError;
	for (const attempt of attempts) {
		params.signal?.throwIfAborted();
		const headers = { "Content-Type": "application/json" };
		if (attempt.apiKey) headers.Authorization = `Bearer ${attempt.apiKey}`;
		const { response, release } = await fetchWithSsrFGuard({
			url: `${attempt.baseUrl}${attempt.path}`,
			init: {
				method: "POST",
				headers,
				body
			},
			timeoutMs: DEFAULT_OLLAMA_WEB_SEARCH_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {},
			policy: buildOllamaBaseUrlSsrFPolicy(attempt.baseUrl),
			auditContext: "ollama-web-search.search"
		});
		try {
			if (response.status === 401) throw new ProviderHttpError(isOllamaCloudBaseUrl(attempt.baseUrl) ? OLLAMA_CLOUD_WEB_SEARCH_AUTH_ERROR : "Ollama web search authentication failed. Run `ollama signin`.", { status: response.status });
			if (response.status === 403) throw new ProviderHttpError("Ollama web search is unavailable. Ensure cloud-backed web search is enabled on the Ollama host.", { status: response.status });
			if (!response.ok) {
				const detail = await readResponseText(response, { maxBytes: 64e3 });
				const detailText = redactProviderResponseErrorText(detail.text, headers, { sourceTruncated: detail.truncated });
				const message = `Ollama web search failed (${response.status}): ${detailText}`.trim();
				const error = new ProviderHttpError(message, { status: response.status });
				if (response.status === 404) {
					lastError = error;
					continue;
				}
				throw error;
			}
			payload = await readOllamaWebSearchResponse(response);
			params.signal?.throwIfAborted();
			break;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			throw lastError;
		} finally {
			if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
			await release();
		}
	}
	if (!payload) throw lastError ?? /* @__PURE__ */ new Error("Ollama web search failed");
	const results = Array.isArray(payload.results) ? payload.results.map(normalizeOllamaWebSearchResult).filter((result) => result !== null).slice(0, count) : [];
	return {
		query,
		provider: "ollama",
		count: results.length,
		tookMs: Date.now() - startedAt,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: "ollama",
			wrapped: true
		},
		results: results.map((result) => {
			const snippet = truncateWebFetchText(result.content, OLLAMA_WEB_SEARCH_SNIPPET_MAX_CHARS).text;
			return {
				title: result.title ? wrapWebContent(result.title, "web_search") : "",
				url: result.url,
				snippet: snippet ? wrapWebContent(snippet, "web_search") : "",
				siteName: resolveSiteName(result.url) || void 0
			};
		})
	};
}
async function warnOllamaWebSearchPrereqs(params) {
	const baseUrl = resolveOllamaWebSearchBaseUrl(params.config);
	if (isOllamaCloudBaseUrl(baseUrl)) {
		if (!resolveConfiguredOllamaWebSearchApiKey(params.config) && !resolveEnvOllamaWebSearchApiKey()) await params.prompter.note(OLLAMA_CLOUD_WEB_SEARCH_AUTH_ERROR, "Ollama Web Search");
		return params.config;
	}
	const { reachable } = await fetchOllamaModels(baseUrl);
	if (!reachable) {
		await params.prompter.note(`Ollama Web Search requires Ollama to be running.\nExpected host: ${baseUrl}\nStart Ollama before using this provider.`, "Ollama Web Search");
		return params.config;
	}
	const { checkOllamaCloudAuth } = await import("./setup.runtime.js");
	const auth = await checkOllamaCloudAuth(baseUrl);
	if (!auth.signedIn) await params.prompter.note(`Ollama Web Search requires \`ollama signin\`.\n${auth.signinUrl ?? "Run `ollama signin`."}`, "Ollama Web Search");
	return params.config;
}
function createOllamaWebSearchProvider() {
	return {
		runSetup: async (ctx) => await warnOllamaWebSearchPrereqs(ctx),
		createTool: (ctx) => ({
			description: OLLAMA_WEB_SEARCH_TOOL_DESCRIPTION,
			parameters: OLLAMA_WEB_SEARCH_TOOL_PARAMETERS,
			execute: async (args, context) => {
				context?.signal?.throwIfAborted();
				return await runOllamaWebSearch({
					config: ctx.config,
					query: readToolStringParam(args, "query", { required: true }),
					count: readPositiveIntegerParam(args, "count", {
						max: 10,
						message: "count must be an integer from 1 to 10."
					}),
					signal: context?.signal
				});
			}
		})
	};
}
//#endregion
export { createOllamaWebSearchProvider };
