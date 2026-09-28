import { TAVILY_GENERIC_SEARCH_DESCRIPTION, TAVILY_GENERIC_SEARCH_SCHEMA, buildTavilyWebSearchProviderBase } from "../web-search-shared.js";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
//#region extensions/tavily/src/tavily-search-provider.ts
const loadTavilyClientModule = createLazyRuntimeModule(() => import("./tavily-client-C3TGlzye.mjs").then((n) => n.r));
function createTavilyWebSearchProvider() {
	return {
		...buildTavilyWebSearchProviderBase(),
		createTool: (ctx) => ({
			description: TAVILY_GENERIC_SEARCH_DESCRIPTION,
			parameters: TAVILY_GENERIC_SEARCH_SCHEMA,
			execute: async (args, executionContext) => {
				executionContext?.signal?.throwIfAborted();
				const { runTavilySearch } = await loadTavilyClientModule();
				return await runTavilySearch({
					cfg: ctx.config,
					query: typeof args.query === "string" ? args.query : "",
					maxResults: readPositiveIntegerParam(args, "count", {
						message: "count must be an integer from 1 to 20",
						max: 20
					}),
					...executionContext?.signal ? { signal: executionContext.signal } : {}
				});
			}
		})
	};
}
//#endregion
export { createTavilyWebSearchProvider as t };
