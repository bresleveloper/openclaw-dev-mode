import { n as mapBatchEmbeddingsByIndex, r as sanitizeEmbeddingCacheHeaders, t as isMissingEmbeddingApiKeyError } from "./embedding-provider-adapter-utils-OHEH6tTj.mjs";
import { r as OPENAI_DEFAULT_EMBEDDING_MODEL } from "./default-models-DOFL1mMC.mjs";
//#region extensions/openai/memory-embedding-adapter.ts
function resolveEmbeddingCacheExcludedHeaders(providerId, baseUrl) {
	const excludedHeaders = [
		"authorization",
		"x-api-key",
		"api-key"
	];
	if (providerId !== "openai") return excludedHeaders;
	try {
		if (new URL(baseUrl).hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com") excludedHeaders.push("version", "user-agent");
	} catch {}
	return excludedHeaders;
}
const openAiMemoryEmbeddingProviderAdapter = {
	id: "openai",
	defaultModel: OPENAI_DEFAULT_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "openai",
	autoSelectPriority: 20,
	allowExplicitWhenConfiguredAuto: true,
	shouldContinueAutoSelection: isMissingEmbeddingApiKeyError,
	create: async (options) => {
		const resolvedProvider = options.provider ?? "openai";
		const { createOpenAiEmbeddingProvider } = await import("./extensions/openai/embedding-provider.js");
		const { provider, client } = await createOpenAiEmbeddingProvider({
			...options,
			provider: resolvedProvider,
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "openai",
				sourceWideBatchEmbed: true,
				cacheKeyData: {
					provider: resolvedProvider,
					baseUrl: client.baseUrl,
					model: client.model,
					outputDimensionality: client.outputDimensionality,
					documentInputType: client.documentInputType ?? client.inputType,
					headers: sanitizeEmbeddingCacheHeaders(client.headers, resolveEmbeddingCacheExcludedHeaders(resolvedProvider, client.baseUrl))
				},
				batchEmbed: async (batch) => {
					const inputType = client.documentInputType ?? client.inputType;
					const { OPENAI_BATCH_ENDPOINT, runOpenAiEmbeddingBatches } = await import("./extensions/openai/embedding-batch.js");
					const byCustomId = await runOpenAiEmbeddingBatches({
						openAi: client,
						agentId: batch.agentId,
						requests: batch.chunks.map((chunk, index) => ({
							custom_id: String(index),
							method: "POST",
							url: OPENAI_BATCH_ENDPOINT,
							body: {
								model: client.model,
								input: chunk.text,
								...typeof client.outputDimensionality === "number" ? { dimensions: client.outputDimensionality } : {},
								...inputType ? { input_type: inputType } : {}
							}
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
export { openAiMemoryEmbeddingProviderAdapter as t };
