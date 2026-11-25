import { n as runFirecrawlScrape, r as runFirecrawlSearch } from "./.setup/firecrawl-client-yyMZRLXM.mjs";
import { t as createFirecrawlWebFetchProvider } from "./.setup/firecrawl-fetch-provider-BRXLbxYM.mjs";
import { n as createFirecrawlWebSearchProvider, t as createFirecrawlFreeWebSearchProvider } from "./.setup/firecrawl-search-provider-B2xWch6a.mjs";
import { optionalNonNegativeIntegerSchema, optionalPositiveIntegerSchema, optionalStringEnum } from "openclaw/plugin-sdk/channel-actions";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { jsonResult, readNonNegativeIntegerParam, readPositiveIntegerParam, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/provider-web-search";
import { Type } from "typebox";
// extensions/firecrawl/index.ts
const FirecrawlScrapeToolSchema = Type.Object({
	url: Type.String({ description: "HTTP or HTTPS URL to scrape via Firecrawl." }),
	extractMode: optionalStringEnum(["markdown", "text"], { description: "Extraction mode (\"markdown\" or \"text\"). Default: markdown." }),
	maxChars: Type.Optional(Type.Integer({
		description: "Maximum characters to return.",
		minimum: 100
	})),
	onlyMainContent: Type.Optional(Type.Boolean({ description: "Keep only main content when Firecrawl supports it." })),
	maxAgeMs: optionalNonNegativeIntegerSchema({ description: "Maximum Firecrawl cache age in milliseconds." }),
	proxy: optionalStringEnum([
		"auto",
		"basic",
		"stealth"
	], { description: "Firecrawl proxy mode (\"auto\", \"basic\", or \"stealth\")." }),
	storeInCache: Type.Optional(Type.Boolean({ description: "Whether Firecrawl should store the scrape in its cache." })),
	timeoutSeconds: optionalPositiveIntegerSchema({ description: "Timeout in seconds for the Firecrawl scrape request." })
}, { additionalProperties: false });
const FirecrawlSearchToolSchema = Type.Object({
	query: Type.String({ description: "Search query string." }),
	count: optionalPositiveIntegerSchema({
		description: "Number of results to return (1-100).",
		maximum: 100
	}),
	sources: Type.Optional(Type.Array(Type.String(), { description: "Optional sources list, for example [\"web\"], [\"news\"], or [\"images\"]." })),
	categories: Type.Optional(Type.Array(Type.String(), { description: "Optional Firecrawl categories, for example [\"github\"] or [\"research\"]." })),
	includeDomains: Type.Optional(Type.Array(Type.String(), { description: "Restrict results to these hostnames (no protocol or path). Cannot be combined with excludeDomains." })),
	excludeDomains: Type.Optional(Type.Array(Type.String(), { description: "Exclude these hostnames from results (no protocol or path). Cannot be combined with includeDomains." })),
	tbs: Type.Optional(Type.String({ description: "Time-based filter, for example \"qdr:d\" (day), \"qdr:w\" (week), \"qdr:m\", \"qdr:y\", or \"sbd:1\" to sort by date." })),
	location: Type.Optional(Type.String({ description: "Geo-target location, for example \"Germany\" or \"San Francisco,California,United States\"." })),
	country: Type.Optional(Type.String({ description: "ISO country code for geo-targeting, for example \"US\", \"DE\", or \"JP\"." })),
	scrapeResults: Type.Optional(Type.Boolean({ description: "Include scraped result content when Firecrawl returns it." })),
	timeoutSeconds: optionalPositiveIntegerSchema({ description: "Timeout in seconds for the Firecrawl Search request." })
}, { additionalProperties: false });
var firecrawl_default = definePluginEntry({
	id: "firecrawl",
	name: "Firecrawl Plugin",
	description: "Bundled Firecrawl search and scrape plugin",
	register(api) {
		api.registerWebFetchProvider(createFirecrawlWebFetchProvider());
		api.registerWebSearchProvider(createFirecrawlWebSearchProvider());
		api.registerWebSearchProvider(createFirecrawlFreeWebSearchProvider());
		api.registerTool({
			name: "firecrawl_search",
			label: "Firecrawl Search",
			resultContentSource: "network",
			description: "Search the web using Firecrawl v2/search. Supports includeDomains/excludeDomains filtering and tbs time filters (day/week/month/year). Can optionally include scraped content from result pages.",
			parameters: FirecrawlSearchToolSchema,
			execute: async (_toolCallId, rawParams, signal) => {
				signal?.throwIfAborted();
				return jsonResult(await runFirecrawlSearch({
					query: readStringParam(rawParams, "query", { required: true }),
					count: readPositiveIntegerParam(rawParams, "count", {
						max: 100,
						message: "count must be an integer from 1 to 100"
					}),
					timeoutSeconds: readPositiveIntegerParam(rawParams, "timeoutSeconds"),
					sources: readStringArrayParam(rawParams, "sources"),
					categories: readStringArrayParam(rawParams, "categories"),
					includeDomains: readStringArrayParam(rawParams, "includeDomains"),
					excludeDomains: readStringArrayParam(rawParams, "excludeDomains"),
					tbs: readStringParam(rawParams, "tbs"),
					location: readStringParam(rawParams, "location"),
					country: readStringParam(rawParams, "country"),
					scrapeResults: rawParams.scrapeResults === true,
					cfg: api.config,
					...signal ? { signal } : {}
				}));
			}
		});
		api.registerTool({
			name: "firecrawl_scrape",
			label: "Firecrawl Scrape",
			resultContentSource: "network",
			description: "Scrape a page using Firecrawl v2/scrape. Useful for JS-heavy or bot-protected pages where a plain URL fetch is weak.",
			parameters: FirecrawlScrapeToolSchema,
			execute: async (_toolCallId, rawParams, signal) => {
				signal?.throwIfAborted();
				const url = readStringParam(rawParams, "url", { required: true });
				const extractMode = readStringParam(rawParams, "extractMode") === "text" ? "text" : "markdown";
				const maxChars = readPositiveIntegerParam(rawParams, "maxChars");
				const maxAgeMs = readNonNegativeIntegerParam(rawParams, "maxAgeMs");
				const timeoutSeconds = readPositiveIntegerParam(rawParams, "timeoutSeconds");
				const proxyRaw = readStringParam(rawParams, "proxy");
				const proxy = proxyRaw === "basic" || proxyRaw === "stealth" || proxyRaw === "auto" ? proxyRaw : void 0;
				const onlyMainContent = typeof rawParams.onlyMainContent === "boolean" ? rawParams.onlyMainContent : void 0;
				const storeInCache = typeof rawParams.storeInCache === "boolean" ? rawParams.storeInCache : void 0;
				return jsonResult(await runFirecrawlScrape({
					cfg: api.config,
					url,
					extractMode,
					maxChars,
					onlyMainContent,
					maxAgeMs,
					proxy,
					storeInCache,
					timeoutSeconds,
					...signal ? { signal } : {}
				}));
			}
		});
	}
});
export { firecrawl_default as default };
