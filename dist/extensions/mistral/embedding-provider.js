import { MISTRAL_BASE_URL } from "./model-definitions.js";
import { createRemoteEmbeddingProvider, normalizeEmbeddingModelWithPrefixes, resolveRemoteEmbeddingClient } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
//#region extensions/mistral/embedding-provider.ts
const DEFAULT_MISTRAL_EMBEDDING_MODEL = "mistral-embed";
function normalizeMistralModel(model) {
	return normalizeEmbeddingModelWithPrefixes({
		model,
		defaultModel: DEFAULT_MISTRAL_EMBEDDING_MODEL,
		prefixes: ["mistral/"]
	});
}
async function createMistralEmbeddingProvider(options) {
	const client = await resolveRemoteEmbeddingClient({
		provider: "mistral",
		options,
		defaultBaseUrl: MISTRAL_BASE_URL,
		normalizeModel: normalizeMistralModel
	});
	return {
		provider: createRemoteEmbeddingProvider({
			id: "mistral",
			client,
			errorPrefix: "mistral embeddings failed"
		}),
		client
	};
}
//#endregion
export { DEFAULT_MISTRAL_EMBEDDING_MODEL, createMistralEmbeddingProvider };
