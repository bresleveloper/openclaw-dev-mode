import { DEEPINFRA_BASE_URL } from "./media-models.js";
import { DEFAULT_DEEPINFRA_EMBEDDING_MODEL, createDeepInfraEmbeddingProvider } from "./embedding-provider.js";
import { embeddingProviderOwnsDestination, sanitizeEmbeddingCacheHeaders } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
//#region extensions/deepinfra/embedding-adapter.ts
const EXCLUDED_EMBEDDING_HEADERS = [
	"authorization",
	"content-type",
	"x-api-key",
	"api-key"
];
function buildDeepInfraEmbeddingAdapter(options) {
	const defaultModel = options?.embedModels?.[0]?.id ?? DEFAULT_DEEPINFRA_EMBEDDING_MODEL;
	return {
		id: "deepinfra",
		defaultModel,
		transport: "remote",
		authProviderId: "deepinfra",
		create: async (createOptions) => {
			const { provider, client } = await createDeepInfraEmbeddingProvider({
				...createOptions,
				provider: "deepinfra",
				defaultModel
			});
			const headers = sanitizeEmbeddingCacheHeaders(client.headers, EXCLUDED_EMBEDDING_HEADERS);
			const usesDefaultIdentity = headers.length === 0 && embeddingProviderOwnsDestination({
				baseUrl: client.baseUrl,
				providerBaseUrl: DEEPINFRA_BASE_URL
			});
			return {
				provider,
				runtime: {
					id: "deepinfra",
					cacheKeyData: {
						provider: "deepinfra",
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
}
const deepinfraEmbeddingProviderAdapter = buildDeepInfraEmbeddingAdapter();
//#endregion
export { buildDeepInfraEmbeddingAdapter, deepinfraEmbeddingProviderAdapter };
