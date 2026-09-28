import { n as runTavilySearch, t as runTavilyExtract } from "./.setup/tavily-client-C3TGlzye.mjs";
import { t as createTavilyWebSearchProvider } from "./.setup/tavily-search-provider-DC_XNplb.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { jsonResult, readPositiveIntegerParam, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/provider-web-search";
import { Type } from "typebox";
import { optionalStringEnum } from "openclaw/plugin-sdk/channel-actions";
//#region extensions/tavily/src/tavily-tool-config.ts
function resolveTavilyToolConfig(api, ctx) {
	return ctx?.getRuntimeConfig?.() ?? ctx?.runtimeConfig ?? ctx?.config ?? api.config;
}
//#endregion
//#region extensions/tavily/src/tavily-extract-tool.ts
const TavilyExtractToolSchema = Type.Object({
	urls: Type.Array(Type.String(), {
		description: "One or more URLs to extract content from (max 20).",
		minItems: 1,
		maxItems: 20
	}),
	query: Type.Optional(Type.String({ description: "Rerank extracted chunks by relevance to this query." })),
	extract_depth: optionalStringEnum(["basic", "advanced"], { description: "\"basic\" (default) or \"advanced\" (for JS-heavy pages)." }),
	chunks_per_source: Type.Optional(Type.Integer({
		description: "Chunks per URL (1-5, requires query).",
		minimum: 1,
		maximum: 5
	})),
	include_images: Type.Optional(Type.Boolean({ description: "Include image URLs in extraction results." }))
}, { additionalProperties: false });
function createTavilyExtractTool(api, ctx) {
	return {
		name: "tavily_extract",
		label: "Tavily Extract",
		resultContentSource: "network",
		description: "Extract clean content from one or more URLs using Tavily. Handles JS-rendered pages. Supports query-focused chunking.",
		parameters: TavilyExtractToolSchema,
		execute: async (_toolCallId, rawParams, signal) => {
			signal?.throwIfAborted();
			const urls = readStringArrayParam(rawParams, "urls") ?? [];
			if (urls.length === 0) throw new Error("tavily_extract requires at least one URL.");
			const query = readStringParam(rawParams, "query") || void 0;
			const extractDepth = readStringParam(rawParams, "extract_depth") || void 0;
			const chunksPerSource = readPositiveIntegerParam(rawParams, "chunks_per_source", {
				max: 5,
				message: "chunks_per_source must be an integer from 1 to 5."
			});
			if (chunksPerSource !== void 0 && !query) throw new Error("tavily_extract requires query when chunks_per_source is set.");
			const includeImages = rawParams.include_images === true;
			return jsonResult(await runTavilyExtract({
				cfg: resolveTavilyToolConfig(api, ctx),
				urls,
				query,
				extractDepth,
				chunksPerSource,
				includeImages,
				...signal ? { signal } : {}
			}));
		}
	};
}
//#endregion
//#region extensions/tavily/src/tavily-search-tool.ts
const TavilySearchToolSchema = Type.Object({
	query: Type.String({ description: "Search query string." }),
	search_depth: optionalStringEnum(["basic", "advanced"], { description: "Search depth: \"basic\" (default, faster) or \"advanced\" (more thorough)." }),
	topic: optionalStringEnum([
		"general",
		"news",
		"finance"
	], { description: "Search topic: \"general\" (default), \"news\", or \"finance\"." }),
	max_results: Type.Optional(Type.Integer({
		description: "Number of results to return (1-20).",
		minimum: 1,
		maximum: 20
	})),
	include_answer: Type.Optional(Type.Boolean({ description: "Include an AI-generated answer summary (default: false)." })),
	time_range: optionalStringEnum([
		"day",
		"week",
		"month",
		"year"
	], { description: "Filter results by recency: 'day', 'week', 'month', or 'year'." }),
	include_domains: Type.Optional(Type.Array(Type.String(), { description: "Only include results from these domains." })),
	exclude_domains: Type.Optional(Type.Array(Type.String(), { description: "Exclude results from these domains." }))
}, { additionalProperties: false });
function createTavilySearchTool(api, ctx) {
	return {
		name: "tavily_search",
		label: "Tavily Search",
		resultContentSource: "network",
		description: "Search the web using Tavily Search API. Supports search depth, topic filtering, domain filters, time ranges, and AI answer summaries.",
		parameters: TavilySearchToolSchema,
		execute: async (_toolCallId, rawParams, signal) => {
			signal?.throwIfAborted();
			const query = readStringParam(rawParams, "query", { required: true });
			const searchDepth = readStringParam(rawParams, "search_depth") || void 0;
			const topic = readStringParam(rawParams, "topic") || void 0;
			const maxResults = readPositiveIntegerParam(rawParams, "max_results", {
				max: 20,
				message: "max_results must be an integer from 1 to 20."
			});
			const includeAnswer = rawParams.include_answer === true;
			const timeRange = readStringParam(rawParams, "time_range") || void 0;
			const includeDomains = readStringArrayParam(rawParams, "include_domains");
			const excludeDomains = readStringArrayParam(rawParams, "exclude_domains");
			return jsonResult(await runTavilySearch({
				cfg: resolveTavilyToolConfig(api, ctx),
				query,
				searchDepth,
				topic,
				maxResults,
				includeAnswer,
				timeRange,
				includeDomains,
				excludeDomains,
				...signal ? { signal } : {}
			}));
		}
	};
}
//#endregion
//#region extensions/tavily/index.ts
var tavily_default = definePluginEntry({
	id: "tavily",
	name: "Tavily Plugin",
	description: "Bundled Tavily search and extract plugin",
	register(api) {
		api.registerWebSearchProvider(createTavilyWebSearchProvider());
		api.registerTool((ctx) => createTavilySearchTool(api, ctx), { name: "tavily_search" });
		api.registerTool((ctx) => createTavilyExtractTool(api, ctx), { name: "tavily_extract" });
	}
});
//#endregion
export { tavily_default as default };
