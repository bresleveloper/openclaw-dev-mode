import "./parallel-free-web-search-provider-ComsnjrF.mjs";
import { DEFAULT_SEARCH_COUNT, buildSearchCacheKey, readCachedSearchPayload, readPositiveIntegerParam, readStringArrayParam, readStringParam, resolveSearchCacheTtlMs, resolveSearchTimeoutSeconds, resolveSiteName, wrapWebContent, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { asOptionalObjectRecord, filterStringEntries, isRecord, normalizeBoundedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/parallel/src/parallel-search-normalize.ts
const PARALLEL_MAX_SEARCH_COUNT = 40;
const PARALLEL_MAX_SEARCH_QUERY_CHARS = 200;
const PARALLEL_MAX_OBJECTIVE_CHARS = 5e3;
const PARALLEL_MAX_SEARCH_QUERIES = 5;
const PARALLEL_SESSION_ID_MAX_LENGTH = 1e3;
const PARALLEL_CLIENT_MODEL_MAX_LENGTH = 100;
function normalizeParallelSearchRequest(args, configuredCount, sessionIdMaxLength) {
	const objective = truncateUtf16Safe(readStringParam(args, "objective") ?? "", PARALLEL_MAX_OBJECTIVE_CHARS) || void 0;
	const cliQuery = truncateUtf16Safe(readStringParam(args, "query") ?? "", PARALLEL_MAX_OBJECTIVE_CHARS) || void 0;
	let searchQueries = normalizeParallelSearchQueries(readStringArrayParam(args, "search_queries"));
	if (searchQueries.length === 0 && cliQuery) searchQueries = normalizeParallelSearchQueries([cliQuery]);
	if (searchQueries.length === 0) return { error: invalidSearchQueriesPayload() };
	return {
		objective,
		searchQueries,
		count: resolveParallelSearchCount(args, configuredCount),
		sessionId: normalizeBoundedOptionalString(readStringParam(args, "session_id"), sessionIdMaxLength),
		clientModel: truncateUtf16Safe(readStringParam(args, "client_model") ?? "", PARALLEL_CLIENT_MODEL_MAX_LENGTH) || void 0
	};
}
async function executeParallelSearchRequest(params) {
	const request = normalizeParallelSearchRequest(params.args, params.searchConfig?.maxResults, params.provider === "parallel" ? PARALLEL_SESSION_ID_MAX_LENGTH : 100);
	if ("error" in request) return request.error;
	const cacheKey = buildSearchCacheKey(["parallel", JSON.stringify({
		endpoint: params.endpoint,
		...request
	})]);
	const cacheTtlMs = resolveSearchCacheTtlMs(params.searchConfig);
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const start = Date.now();
	const response = await params.search(request, resolveSearchTimeoutSeconds(params.searchConfig));
	params.signal?.throwIfAborted();
	const results = mapParallelResults(response, request.count);
	const payload = {
		...request.objective ? { objective: request.objective } : {},
		searchQueries: request.searchQueries,
		provider: params.provider,
		count: results.length,
		tookMs: Date.now() - start,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: params.provider,
			wrapped: true
		},
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
function resolveParallelSearchCount(args, configuredCount) {
	const value = readPositiveIntegerParam(args, "count", {
		max: PARALLEL_MAX_SEARCH_COUNT,
		message: `count must be an integer from 1 to ${PARALLEL_MAX_SEARCH_COUNT}.`
	}) ?? (typeof configuredCount === "number" ? configuredCount : DEFAULT_SEARCH_COUNT);
	return resolveIntegerOption(value, DEFAULT_SEARCH_COUNT, {
		min: 1,
		max: PARALLEL_MAX_SEARCH_COUNT
	});
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
function invalidSearchQueriesPayload() {
	return {
		error: "invalid_search_queries",
		message: "search_queries must be a non-empty array of keyword strings (max 5, max 200 chars each). See https://docs.parallel.ai/search/best-practices.",
		docs: "https://docs.openclaw.ai/tools/parallel-search"
	};
}
/** Maps a Parallel v1 response into wrapped `web_search` result entries. */
function mapParallelResults(response, count) {
	const rawResults = asOptionalObjectRecord(response)?.results;
	return (Array.isArray(rawResults) ? rawResults.filter(isRecord) : []).slice(0, count).map((entry) => {
		const title = typeof entry.title === "string" ? entry.title : "";
		const url = typeof entry.url === "string" ? entry.url : "";
		const published = typeof entry.publish_date === "string" && entry.publish_date ? entry.publish_date : void 0;
		const excerpts = filterStringEntries(entry.excerpts).map((e) => wrapWebContent(e, "web_search"));
		const description = excerpts.join("\n\n");
		return Object.assign({
			title: title ? wrapWebContent(title, "web_search") : "",
			url,
			description,
			siteName: resolveSiteName(url) || void 0
		}, published ? { published } : {}, excerpts.length > 0 ? { excerpts } : {});
	});
}
//#endregion
export { executeParallelSearchRequest as t };
