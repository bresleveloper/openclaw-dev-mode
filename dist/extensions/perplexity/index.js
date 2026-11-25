import { buildPerplexityDecisionProvider } from "./decision-provider.js";
import { t as createPerplexityWebSearchProvider } from "./.setup/perplexity-web-search-provider-Dg_FWVaV.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/perplexity/index.ts
var perplexity_default = definePluginEntry({
	id: "perplexity",
	name: "Perplexity Plugin",
	description: "Bundled Perplexity plugin",
	register(api) {
		api.registerWebSearchProvider(createPerplexityWebSearchProvider());
		api.registerDecisionProvider(buildPerplexityDecisionProvider());
	}
});
export { perplexity_default as default };
