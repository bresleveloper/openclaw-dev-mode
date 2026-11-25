import { t as createSearxngWebSearchProvider } from "./.setup/searxng-search-provider-Bfo_8qjd.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/searxng/index.ts
var searxng_default = definePluginEntry({
	id: "searxng",
	name: "SearXNG Plugin",
	description: "Bundled SearXNG web search plugin",
	register(api) {
		api.registerWebSearchProvider(createSearxngWebSearchProvider());
	}
});
export { searxng_default as default };
