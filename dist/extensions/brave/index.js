import { t as createBraveWebSearchProvider } from "./.setup/brave-web-search-provider-9AzXZDBI.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/brave/index.ts
/**
* Brave Search plugin entry. It registers the Brave web-search provider and
* keeps runtime HTTP execution lazy.
*/
var brave_default = definePluginEntry({
	id: "brave",
	name: "Brave Plugin",
	description: "Bundled Brave plugin",
	register(api) {
		api.registerWebSearchProvider(createBraveWebSearchProvider());
	}
});
export { brave_default as default };
