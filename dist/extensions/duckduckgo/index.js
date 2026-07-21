import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
import { t as createDuckDuckGoWebSearchProvider } from "../../ddg-search-provider-D-5eEJvp.js";
//#region extensions/duckduckgo/index.ts
var duckduckgo_default = definePluginEntry({
	id: "duckduckgo",
	name: "DuckDuckGo Plugin",
	description: "Bundled DuckDuckGo web search plugin",
	register(api) {
		api.registerWebSearchProvider(createDuckDuckGoWebSearchProvider());
	}
});
//#endregion
export { duckduckgo_default as default };
