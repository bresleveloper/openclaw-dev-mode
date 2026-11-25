import { i as openclaw_plugin_default, t as QIANFAN_BASE_URL } from "./.setup/provider-catalog-DUJ3TrjP.mjs";
import { QIANFAN_DEFAULT_MODEL_REF, applyQianfanConfig } from "./onboard.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
// extensions/qianfan/index.ts
const PROVIDER_ID = "qianfan";
var qianfan_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Qianfan Provider",
	description: "Bundled Qianfan provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Qianfan",
		docsPath: "/providers/qianfan",
		manifestAuth: {
			defaultModel: QIANFAN_DEFAULT_MODEL_REF,
			applyConfig: applyQianfanConfig
		},
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		}
	},
	register(api) {
		api.registerEmbeddingProvider({
			id: PROVIDER_ID,
			transport: "remote",
			authProviderId: PROVIDER_ID,
			normalizeModel: ({ model }) => model.trim().replace(/^(?:qianfan|openai-compatible)\//u, ""),
			async create(options) {
				const { getMemoryEmbeddingProvider, resolveRemoteEmbeddingBearerClient } = await import("openclaw/plugin-sdk/memory-core-host-engine-embeddings");
				const adapter = getMemoryEmbeddingProvider("openai-compatible", options.config);
				if (!adapter) throw new Error("The OpenAI-compatible embedding provider is unavailable.");
				const client = await resolveRemoteEmbeddingBearerClient({
					provider: PROVIDER_ID,
					options,
					defaultBaseUrl: QIANFAN_BASE_URL
				});
				const result = await adapter.create({
					...options,
					remote: {
						baseUrl: client.baseUrl,
						headers: client.headers
					}
				});
				if (result.provider) {
					result.provider.id = PROVIDER_ID;
					if ([
						"embedding-v1",
						"bge-large-zh",
						"bge-large-en"
					].includes(result.provider.model.toLowerCase())) result.provider.maxInputsPerRequest = 16;
				}
				if (result.runtime) result.runtime.id = PROVIDER_ID;
				return result;
			}
		});
	}
});
export { qianfan_default as default };
