import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as buildXaiWebSearchProviderBase } from "./web-search-provider-shared-Dx3y6IjJ.mjs";
//#region extensions/xai/web-search.ts
const loadXaiWebSearchProviderRuntime = createLazyRuntimeModule(() => import("./web-search-provider.runtime-CPROvp2S.mjs"));
const GenericXaiSearchSchema = {
	type: "object",
	properties: {
		query: {
			type: "string",
			description: "Search query string."
		},
		count: {
			type: "number",
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		}
	},
	additionalProperties: false
};
function createXaiWebSearchProvider() {
	return {
		...buildXaiWebSearchProviderBase(),
		runSetup: async (ctx) => (await loadXaiWebSearchProviderRuntime()).runXaiSearchProviderSetup(ctx),
		createTool: (ctx) => ({
			description: "Search the web using xAI Grok. Returns AI-synthesized answers with citations from real-time web search.",
			parameters: GenericXaiSearchSchema,
			execute: async (args, executionContext) => {
				executionContext?.signal?.throwIfAborted();
				const { executeXaiWebSearchProviderTool } = await loadXaiWebSearchProviderRuntime();
				return await executeXaiWebSearchProviderTool(ctx, args, executionContext);
			}
		})
	};
}
//#endregion
export { createXaiWebSearchProvider as t };
