import { t as executeParallelSearchRequest } from "./parallel-search-normalize-DCF3dT4s.mjs";
import { createRequire } from "node:module";
import { mergeScopedSearchConfig, readConfiguredSecretString, readProviderEnvValue, resolveProviderWebSearchPluginConfig, withTrustedWebSearchEndpoint } from "openclaw/plugin-sdk/provider-web-search";
import { readPluginPackageVersion } from "openclaw/plugin-sdk/extension-shared";
import { ProviderHttpError, readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/parallel/src/parallel-web-search-provider.runtime.ts
const PARALLEL_BASE_URL = "https://api.parallel.ai";
const PARALLEL_SEARCH_PATHNAME = "/v1/search";
const PARALLEL_ERROR_BODY_LIMIT_BYTES = 8192;
const PARALLEL_SEARCH_RESPONSE_LIMIT_BYTES = 16777216;
const require = createRequire(import.meta.url);
const USER_AGENT = `openclaw-parallel/${readPluginPackageVersion({ require })} (${process.platform})`;
function resolveParallelApiKey(parallel) {
	return readConfiguredSecretString(parallel?.apiKey, "plugins.entries.parallel.config.webSearch.apiKey") ?? readProviderEnvValue(["PARALLEL_API_KEY"]);
}
function invalidBaseUrlPayload(value) {
	return {
		error: "invalid_base_url",
		message: `plugins.entries.parallel.config.webSearch.baseUrl must be a valid http(s) URL. Got: ${value}`,
		docs: "https://docs.openclaw.ai/tools/parallel-search"
	};
}
function resolveParallelSearchEndpoint(parallel) {
	const configured = normalizeOptionalString(parallel?.baseUrl);
	if (!configured) return { endpoint: `${PARALLEL_BASE_URL}${PARALLEL_SEARCH_PATHNAME}` };
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(configured) && !/^https?:\/\//i.test(configured)) return invalidBaseUrlPayload(configured);
	const candidate = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;
	let parsed;
	try {
		parsed = new URL(candidate);
	} catch {
		return invalidBaseUrlPayload(configured);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return invalidBaseUrlPayload(configured);
	const pathname = parsed.pathname.replace(/\/+$/, "");
	parsed.pathname = pathname.endsWith(PARALLEL_SEARCH_PATHNAME) ? pathname : `${pathname}${PARALLEL_SEARCH_PATHNAME}`;
	parsed.hash = "";
	return { endpoint: parsed.toString() };
}
async function executeParallelWebSearchProviderTool(ctx, args, signal) {
	const searchConfig = mergeScopedSearchConfig(ctx.searchConfig, "parallel", resolveProviderWebSearchPluginConfig(ctx.config, "parallel"));
	const parallelConfig = asOptionalRecord(searchConfig?.parallel);
	const apiKey = resolveParallelApiKey(parallelConfig);
	if (!apiKey) return {
		error: "missing_parallel_api_key",
		message: "web_search (parallel) needs a Parallel API key. Set PARALLEL_API_KEY in the Gateway environment, or configure plugins.entries.parallel.config.webSearch.apiKey.",
		docs: "https://docs.openclaw.ai/tools/parallel-search"
	};
	const endpointResult = resolveParallelSearchEndpoint(parallelConfig);
	if ("error" in endpointResult) return endpointResult;
	const endpoint = endpointResult.endpoint;
	return executeParallelSearchRequest({
		provider: "parallel",
		endpoint,
		args,
		searchConfig,
		signal,
		search: async (request, timeoutSeconds) => {
			const body = {
				search_queries: [...request.searchQueries],
				advanced_settings: { max_results: request.count }
			};
			if (request.objective) body.objective = request.objective;
			if (request.sessionId) body.session_id = request.sessionId;
			if (request.clientModel) body.client_model = request.clientModel;
			return withTrustedWebSearchEndpoint({
				url: endpoint,
				timeoutSeconds,
				signal,
				init: {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"x-api-key": apiKey,
						"User-Agent": USER_AGENT
					},
					body: JSON.stringify(body)
				}
			}, async (res) => {
				if (!res.ok) {
					const detail = await readResponseTextLimited(res, PARALLEL_ERROR_BODY_LIMIT_BYTES).catch(() => "");
					signal?.throwIfAborted();
					throw new ProviderHttpError(`Parallel API error (${res.status}): ${redactToolPayloadText(redactSensitiveText(detail || res.statusText, { mode: "tools" }))}`, { status: res.status });
				}
				return await readProviderJsonResponse(res, "Parallel API", { maxBytes: PARALLEL_SEARCH_RESPONSE_LIMIT_BYTES });
			});
		}
	});
}
//#endregion
export { executeParallelWebSearchProviderTool };
