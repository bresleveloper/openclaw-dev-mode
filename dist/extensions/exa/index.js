import { t as createExaWebSearchProvider } from "./.setup/exa-web-search-provider-DxaUoEgY.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/exa/index.ts
var exa_default = definePluginEntry({
	id: "exa",
	name: "Exa Plugin",
	description: "Bundled Exa web search plugin",
	register(api) {
		api.registerWebSearchProvider(createExaWebSearchProvider());
	}
});
export { exa_default as default };
