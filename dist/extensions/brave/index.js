import { t as createBraveWebSearchProvider } from "./.setup/brave-web-search-provider-DEK9TtrN.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/brave/index.ts
/**
* Brave Search plugin entry. It registers the Brave web-search provider and
* keeps runtime HTTP execution lazy.
*/
/** Plugin entry for Brave Search. */
var brave_default = definePluginEntry({
	id: "brave",
	name: "Brave Plugin",
	description: "Bundled Brave plugin",
	register(api) {
		api.registerWebSearchProvider(createBraveWebSearchProvider());
	}
});
//#endregion
export { brave_default as default };
