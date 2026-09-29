import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as createOllamaWebSearchProvider } from "./web-search-contract-api-B5lxc4TB.mjs";
import { n as OLLAMA_WEB_SEARCH_TOOL_PARAMETERS, t as OLLAMA_WEB_SEARCH_TOOL_DESCRIPTION } from "./web-search-contract-DrYBQMoZ.mjs";
//#region extensions/ollama/src/web-search-provider-registration.ts
const loadOllamaWebSearchProvider = createLazyRuntimeModule(() => import("./web-search-provider.runtime-CKVmyBKs.mjs"));
function createLazyOllamaWebSearchProvider() {
	let providerPromise;
	const loadProvider = () => providerPromise ??= loadOllamaWebSearchProvider().then((runtime) => runtime.createOllamaWebSearchProvider());
	return {
		...createOllamaWebSearchProvider(),
		runSetup: async (ctx) => {
			const provider = await loadProvider();
			return provider.runSetup ? await provider.runSetup(ctx) : ctx.config;
		},
		createTool: (ctx) => {
			let toolPromise;
			const loadTool = () => toolPromise ??= loadProvider().then((provider) => provider.createTool(ctx));
			return {
				description: OLLAMA_WEB_SEARCH_TOOL_DESCRIPTION,
				parameters: OLLAMA_WEB_SEARCH_TOOL_PARAMETERS,
				execute: async (args, executionContext) => {
					const tool = await loadTool();
					if (!tool) throw new Error("Ollama web search runtime did not create a tool");
					return await tool.execute(args, executionContext);
				}
			};
		}
	};
}
//#endregion
export { createLazyOllamaWebSearchProvider as t };
