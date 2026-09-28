import { createRemoteEmbeddingProvider, normalizeEmbeddingModelWithPrefixes, resolveRemoteEmbeddingClient } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
//#region extensions/voyage/embedding-provider.ts
const DEFAULT_VOYAGE_EMBEDDING_MODEL = "voyage-4-large";
const DEFAULT_VOYAGE_BASE_URL = "https://api.voyageai.com/v1";
const VOYAGE_MAX_INPUT_TOKENS = {
	"voyage-3": 32e3,
	"voyage-3-lite": 16e3,
	"voyage-code-3": 32e3
};
function normalizeVoyageModel(model) {
	return normalizeEmbeddingModelWithPrefixes({
		model,
		defaultModel: DEFAULT_VOYAGE_EMBEDDING_MODEL,
		prefixes: ["voyage/"]
	});
}
async function createVoyageEmbeddingProvider(options) {
	const client = await resolveRemoteEmbeddingClient({
		provider: "voyage",
		options,
		defaultBaseUrl: DEFAULT_VOYAGE_BASE_URL,
		normalizeModel: normalizeVoyageModel
	});
	const provider = createRemoteEmbeddingProvider({
		id: "voyage",
		client,
		errorPrefix: "voyage embeddings failed",
		buildRequestFields: (kind) => ({ input_type: kind })
	});
	provider.maxInputTokens = VOYAGE_MAX_INPUT_TOKENS[client.model];
	return {
		provider,
		client
	};
}
//#endregion
export { DEFAULT_VOYAGE_EMBEDDING_MODEL, createVoyageEmbeddingProvider };
