import { n as createParallelWebSearchProvider, t as createParallelFreeWebSearchProvider } from "./.setup/parallel-free-web-search-provider-cXSsdp4Y.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/parallel/index.ts
var parallel_default = definePluginEntry({
	id: "parallel",
	name: "Parallel Plugin",
	description: "Bundled Parallel web search plugin",
	register(api) {
		api.registerWebSearchProvider(createParallelFreeWebSearchProvider());
		api.registerWebSearchProvider(createParallelWebSearchProvider());
	}
});
//#endregion
export { parallel_default as default };
