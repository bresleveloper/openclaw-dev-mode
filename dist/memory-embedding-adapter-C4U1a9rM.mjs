import { r as sanitizeEmbeddingCacheHeaders } from "./embedding-provider-adapter-utils-OHEH6tTj.mjs";
import "./memory-core-host-engine-embeddings-CRt6gGvK.mjs";
import { t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "./defaults-Dkg1KktH.mjs";
import { t as createOllamaEmbeddingProvider } from "./embedding-provider-o2knN7HL.mjs";
import { createHash } from "node:crypto";
//#region extensions/ollama/src/memory-embedding-adapter.ts
const OLLAMA_EMBEDDING_CACHE_EXCLUDED_HEADERS = [
	"authorization",
	"content-type",
	"x-api-key"
];
function hashEmbeddingCacheHeaders(headers) {
	return headers.length > 0 ? createHash("sha256").update(JSON.stringify(headers)).digest("hex") : void 0;
}
const ollamaMemoryEmbeddingProviderAdapter = {
	id: "ollama",
	defaultModel: DEFAULT_OLLAMA_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "ollama",
	create: async (options) => {
		const providerId = options.provider?.trim() || "ollama";
		const { provider, client } = await createOllamaEmbeddingProvider({
			...options,
			provider: providerId,
			fallback: "none"
		});
		const headersHash = hashEmbeddingCacheHeaders(sanitizeEmbeddingCacheHeaders(client.headers, OLLAMA_EMBEDDING_CACHE_EXCLUDED_HEADERS));
		return {
			provider,
			runtime: {
				id: "ollama",
				inlineBatchTimeoutMs: 6e5,
				cacheKeyData: {
					provider: providerId,
					...providerId === "ollama" && client.baseUrl === "http://127.0.0.1:11434" && headersHash === void 0 ? {} : { baseUrl: client.baseUrl },
					model: client.model,
					outputDimensionality: client.outputDimensionality,
					...headersHash ? { headersHash } : {}
				}
			}
		};
	}
};
//#endregion
export { ollamaMemoryEmbeddingProviderAdapter };
