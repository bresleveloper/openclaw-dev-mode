import { a as hasNonTextEmbeddingParts } from "./markdown-chunks-DYWd0D11.mjs";
import { n as mapBatchEmbeddingsByIndex, r as sanitizeEmbeddingCacheHeaders, t as isMissingEmbeddingApiKeyError } from "./embedding-provider-adapter-utils-OHEH6tTj.mjs";
import "./memory-core-host-engine-embeddings-B_fgzgsI.mjs";
import { i as isGeminiEmbedding2Model, n as buildGeminiEmbeddingRequest, r as createGeminiEmbeddingProvider, t as DEFAULT_GEMINI_EMBEDDING_MODEL } from "./embedding-provider-CBsmD6SG.mjs";
import { t as runGeminiEmbeddingBatches } from "./embedding-batch-T-6nArrE.mjs";
//#region extensions/google/memory-embedding-adapter.ts
const geminiMemoryEmbeddingProviderAdapter = {
	id: "gemini",
	defaultModel: DEFAULT_GEMINI_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "google",
	autoSelectPriority: 30,
	allowExplicitWhenConfiguredAuto: true,
	supportsMultimodalEmbeddings: ({ model }) => isGeminiEmbedding2Model(model),
	shouldContinueAutoSelection: isMissingEmbeddingApiKeyError,
	create: async (options) => {
		const { provider, client } = await createGeminiEmbeddingProvider({
			...options,
			provider: "gemini",
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "gemini",
				cacheKeyData: {
					provider: "gemini",
					baseUrl: client.baseUrl,
					model: client.model,
					outputDimensionality: client.outputDimensionality,
					headers: sanitizeEmbeddingCacheHeaders(client.headers, [
						"authorization",
						"x-goog-api-key",
						"x-goog-api-client"
					])
				},
				batchEmbed: async (batch) => {
					if (batch.chunks.some((chunk) => hasNonTextEmbeddingParts(chunk.embeddingInput))) return null;
					const byCustomId = await runGeminiEmbeddingBatches({
						gemini: client,
						agentId: batch.agentId,
						requests: batch.chunks.map((chunk, index) => ({
							custom_id: String(index),
							request: buildGeminiEmbeddingRequest({
								input: chunk.embeddingInput ?? { text: chunk.text },
								model: client.model,
								role: "document",
								taskType: "RETRIEVAL_DOCUMENT",
								modelPath: client.modelPath,
								outputDimensionality: client.outputDimensionality
							})
						})),
						wait: batch.wait,
						concurrency: batch.concurrency,
						pollIntervalMs: batch.pollIntervalMs,
						timeoutMs: batch.timeoutMs,
						debug: batch.debug
					});
					return mapBatchEmbeddingsByIndex(byCustomId, batch.chunks.length);
				}
			}
		};
	}
};
//#endregion
export { geminiMemoryEmbeddingProviderAdapter as t };
