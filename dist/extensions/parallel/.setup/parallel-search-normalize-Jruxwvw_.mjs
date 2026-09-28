import "./parallel-free-web-search-provider-cXSsdp4Y.mjs";
import { DEFAULT_SEARCH_COUNT, buildSearchCacheKey, readCachedSearchPayload, readPositiveIntegerParam, readStringArrayParam, readStringParam, resolveSearchCacheTtlMs, resolveSearchTimeoutSeconds, resolveSiteName, wrapWebContent, writeCachedSearchPayload } from "openclaw/plugin-sdk/provider-web-search";
import { normalizeBoundedOptionalString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
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
	const objective = normalizeParallelObjective(readStringParam(args, "objective"));
	const cliQuery = normalizeParallelObjective(readStringParam(args, "query"));
	let searchQueries = normalizeParallelSearchQueries(readStringArrayParam(args, "search_queries"));
	if (searchQueries.length === 0 && cliQuery) searchQueries = normalizeParallelSearchQueries([cliQuery]);
	if (searchQueries.length === 0) return { error: invalidSearchQueriesPayload() };
	return {
		objective,
		searchQueries,
		count: resolveParallelSearchCount(args, configuredCount),
		sessionId: normalizeBoundedOptionalString(readStringParam(args, "session_id"), sessionIdMaxLength),
		clientModel: normalizeParallelClientModel(readStringParam(args, "client_model"))
	};
}
async function executeParallelSearchRequest(params) {
	const request = normalizeParallelSearchRequest(params.args, params.searchConfig?.maxResults, params.provider === "parallel" ? PARALLEL_SESSION_ID_MAX_LENGTH : 100);
	if ("error" in request) return request.error;
	const cacheKey = buildParallelCacheKey({
		endpoint: params.endpoint,
		...request
	});
	const cacheTtlMs = resolveSearchCacheTtlMs(params.searchConfig);
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const start = Date.now();
	const response = await params.search(request, resolveSearchTimeoutSeconds(params.searchConfig));
	params.signal?.throwIfAborted();
	const payload = buildParallelSearchPayload({
		provider: params.provider,
		objective: request.objective,
		searchQueries: request.searchQueries,
		count: request.count,
		response,
		start
	});
	const cachePayload = request.sessionId ? payload : stripParallelGeneratedSessionId(payload);
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
function normalizeParallelObjective(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return trimmed.length <= PARALLEL_MAX_OBJECTIVE_CHARS ? trimmed : truncateUtf16Safe(trimmed, PARALLEL_MAX_OBJECTIVE_CHARS);
}
function normalizeParallelClientModel(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return trimmed.length <= PARALLEL_CLIENT_MODEL_MAX_LENGTH ? trimmed : truncateUtf16Safe(trimmed, PARALLEL_CLIENT_MODEL_MAX_LENGTH);
}
function normalizeParallelSearchQueries(value) {
	const candidates = Array.isArray(value) ? value : [];
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const entry of candidates) {
		if (typeof entry !== "string") continue;
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const capped = trimmed.length <= PARALLEL_MAX_SEARCH_QUERY_CHARS ? trimmed : truncateUtf16Safe(trimmed, PARALLEL_MAX_SEARCH_QUERY_CHARS);
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
function normalizeParallelResults(payload) {
	if (!payload || typeof payload !== "object") return [];
	const results = payload.results;
	if (!Array.isArray(results)) return [];
	return results.filter((entry) => Boolean(entry && typeof entry === "object" && !Array.isArray(entry)));
}
/** Maps a Parallel v1 response into wrapped `web_search` result entries. */
function mapParallelResults(response, count) {
	return normalizeParallelResults(response).slice(0, count).map((entry) => {
		const title = typeof entry.title === "string" ? entry.title : "";
		const url = typeof entry.url === "string" ? entry.url : "";
		const published = typeof entry.publish_date === "string" && entry.publish_date ? entry.publish_date : void 0;
		const excerpts = Array.isArray(entry.excerpts) ? entry.excerpts.filter((e) => typeof e === "string").map((e) => wrapWebContent(e, "web_search")) : [];
		const description = excerpts.join("\n\n");
		return Object.assign({
			title: title ? wrapWebContent(title, "web_search") : "",
			url,
			description,
			siteName: resolveSiteName(url) || void 0
		}, published ? { published } : {}, excerpts.length > 0 ? { excerpts } : {});
	});
}
function buildParallelSearchPayload(params) {
	const results = mapParallelResults(params.response, params.count);
	const payload = {
		...params.objective ? { objective: params.objective } : {},
		searchQueries: params.searchQueries,
		provider: params.provider,
		count: results.length,
		tookMs: Date.now() - params.start,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: params.provider,
			wrapped: true
		},
		results
	};
	if (typeof params.response.search_id === "string") payload.searchId = params.response.search_id;
	if (typeof params.response.session_id === "string") payload.sessionId = params.response.session_id;
	if (Array.isArray(params.response.warnings) && params.response.warnings.length > 0) payload.warnings = params.response.warnings;
	if (Array.isArray(params.response.usage) && params.response.usage.length > 0) payload.usage = params.response.usage;
	return payload;
}
/**
* Drops a Parallel-generated `sessionId` before caching. Identical queries from
* unrelated tasks would otherwise share that id; caller-supplied session ids are
* part of the cache key, so a cache hit only ever returns the matching id.
*/
function stripParallelGeneratedSessionId(payload) {
	if (!("sessionId" in payload)) return payload;
	const { sessionId: _omitted, ...rest } = payload;
	return rest;
}
function buildParallelCacheKey(params) {
	return buildSearchCacheKey([
		"parallel",
		params.endpoint,
		params.objective,
		params.searchQueries.join("\0"),
		params.count,
		params.sessionId,
		params.clientModel
	]);
}
//#endregion
export { executeParallelSearchRequest as t };
