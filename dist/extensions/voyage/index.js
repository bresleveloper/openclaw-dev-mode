import { voyageMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/voyage/index.ts
var voyage_default = definePluginEntry({
	id: "voyage",
	name: "Voyage Embeddings",
	description: "Voyage memory embedding provider plugin",
	register(api) {
		api.registerEmbeddingProvider(voyageMemoryEmbeddingProviderAdapter);
	}
});
export { voyage_default as default };
