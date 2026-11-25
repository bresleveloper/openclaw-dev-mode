import { normalizeBoundedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_SEARCH_COUNT, buildSearchCacheKey, externalContentStamp, nativeWebSearchCodecs, readCachedSearchPayload, readPositiveIntegerParam, readStringArrayParam, readStringParam, resolveSearchCacheTtlMs, resolveSearchTimeoutSeconds, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
// extensions/parallel/src/parallel-search-normalize.ts
const PARALLEL_MAX_SEARCH_COUNT = 40;
const PARALLEL_MAX_SEARCH_QUERY_CHARS = 200;
const PARALLEL_MAX_OBJECTIVE_CHARS = 5e3;
const PARALLEL_MAX_SEARCH_QUERIES = 5;
const PARALLEL_SESSION_ID_MAX_LENGTH = 1e3;
const PARALLEL_CLIENT_MODEL_MAX_LENGTH = 100;
async function executeParallelSearchRequest(params) {
	const { args } = params;
	const configuredCount = params.searchConfig?.maxResults;
	const objective = truncateUtf16Safe(readStringParam(args, "objective") ?? "", PARALLEL_MAX_OBJECTIVE_CHARS) || void 0;
	const cliQuery = truncateUtf16Safe(readStringParam(args, "query") ?? "", PARALLEL_MAX_OBJECTIVE_CHARS) || void 0;
	let searchQueries = normalizeParallelSearchQueries(readStringArrayParam(args, "search_queries"));
	if (searchQueries.length === 0 && cliQuery) searchQueries = normalizeParallelSearchQueries([cliQuery]);
	if (searchQueries.length === 0) return {
		error: "invalid_search_queries",
		message: "search_queries must be a non-empty array of keyword strings (max 5, max 200 chars each). See https://docs.parallel.ai/search/best-practices.",
		docs: "https://docs.openclaw.ai/tools/parallel-search"
	};
	const value = readPositiveIntegerParam(args, "count", {
		max: PARALLEL_MAX_SEARCH_COUNT,
		message: `count must be an integer from 1 to ${PARALLEL_MAX_SEARCH_COUNT}.`
	}) ?? (typeof configuredCount === "number" ? configuredCount : DEFAULT_SEARCH_COUNT);
	const request = {
		objective,
		searchQueries,
		count: resolveIntegerOption(value, DEFAULT_SEARCH_COUNT, {
			min: 1,
			max: PARALLEL_MAX_SEARCH_COUNT
		}),
		sessionId: normalizeBoundedOptionalString(readStringParam(args, "session_id"), params.provider === "parallel" ? PARALLEL_SESSION_ID_MAX_LENGTH : 100),
		clientModel: truncateUtf16Safe(readStringParam(args, "client_model") ?? "", PARALLEL_CLIENT_MODEL_MAX_LENGTH) || void 0
	};
	const cacheKey = buildSearchCacheKey([
		params.provider,
		params.apiKey ? sha256Hex(params.apiKey) : void 0,
		JSON.stringify({
			endpoint: params.endpoint,
			...request
		})
	]);
	const cacheTtlMs = resolveSearchCacheTtlMs(params.searchConfig);
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const start = Date.now();
	const response = await params.search(request, resolveSearchTimeoutSeconds(params.searchConfig));
	const count = request.count;
	const results = nativeWebSearchCodecs["parallel.search"].results(response, count);
	const payload = {
		...request.objective ? { objective: request.objective } : {},
		searchQueries: request.searchQueries,
		provider: params.provider,
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: externalContentStamp(params.provider),
		results
	};
	if (typeof response.search_id === "string") payload.searchId = response.search_id;
	if (typeof response.session_id === "string") payload.sessionId = response.session_id;
	if (Array.isArray(response.warnings) && response.warnings.length > 0) payload.warnings = response.warnings;
	if (Array.isArray(response.usage) && response.usage.length > 0) payload.usage = response.usage;
	const cachePayload = !request.sessionId && "sessionId" in payload ? { ...payload } : payload;
	if (!request.sessionId) delete cachePayload.sessionId;
	writeCachedSearchPayload(cacheKey, cachePayload, cacheTtlMs);
	return payload;
}
function normalizeParallelSearchQueries(candidates = []) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const entry of candidates) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const capped = truncateUtf16Safe(trimmed, PARALLEL_MAX_SEARCH_QUERY_CHARS);
		if (seen.has(capped)) continue;
		seen.add(capped);
		out.push(capped);
		if (out.length === PARALLEL_MAX_SEARCH_QUERIES) break;
	}
	return out;
}
export { executeParallelSearchRequest as t };
