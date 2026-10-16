import { MISTRAL_BASE_URL } from "./model-definitions.js";
import { DEFAULT_MISTRAL_EMBEDDING_MODEL, createMistralEmbeddingProvider } from "./embedding-provider.js";
import { embeddingProviderOwnsDestination, isMissingEmbeddingApiKeyError, sanitizeEmbeddingCacheHeaders } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
//#region extensions/mistral/memory-embedding-adapter.ts
const EXCLUDED_EMBEDDING_HEADERS = [
	"authorization",
	"content-type",
	"x-api-key",
	"api-key"
];
const mistralMemoryEmbeddingProviderAdapter = {
	id: "mistral",
	defaultModel: DEFAULT_MISTRAL_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "mistral",
	autoSelectPriority: 50,
	allowExplicitWhenConfiguredAuto: true,
	shouldContinueAutoSelection: isMissingEmbeddingApiKeyError,
	create: async (options) => {
		const { provider, client } = await createMistralEmbeddingProvider({
			...options,
			provider: "mistral",
			fallback: "none"
		});
		const headers = sanitizeEmbeddingCacheHeaders(client.headers, EXCLUDED_EMBEDDING_HEADERS);
		const usesDefaultIdentity = headers.length === 0 && embeddingProviderOwnsDestination({
			baseUrl: client.baseUrl,
			providerBaseUrl: MISTRAL_BASE_URL
		});
		return {
			provider,
			runtime: {
				id: "mistral",
				cacheKeyData: {
					provider: "mistral",
					model: client.model,
					...usesDefaultIdentity ? {} : {
						baseUrl: client.baseUrl,
						headers
					}
				}
			}
		};
	}
};
//#endregion
export { mistralMemoryEmbeddingProviderAdapter };
