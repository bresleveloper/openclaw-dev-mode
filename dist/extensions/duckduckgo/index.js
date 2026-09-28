import { t as createDuckDuckGoWebSearchProvider } from "./.setup/ddg-search-provider-Cv0XhcJ_.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/duckduckgo/index.ts
var duckduckgo_default = definePluginEntry({
	id: "duckduckgo",
	name: "DuckDuckGo Plugin",
	description: "Official DuckDuckGo web search plugin",
	register(api) {
		api.registerWebSearchProvider(createDuckDuckGoWebSearchProvider());
	}
});
//#endregion
export { duckduckgo_default as default };
