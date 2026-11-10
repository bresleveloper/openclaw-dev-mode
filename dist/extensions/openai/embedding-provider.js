import { i as normalizeEmbeddingModelWithPrefixes, n as createRemoteEmbeddingProvider, r as resolveRemoteEmbeddingClient } from "../../memory-core-host-engine-embeddings-BIgAa5Te.mjs";
import { r as OPENAI_DEFAULT_EMBEDDING_MODEL } from "../../default-models-CU9j2AqC.mjs";
//#region extensions/openai/embedding-provider.ts
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const OPENAI_MAX_INPUT_TOKENS = {
	"text-embedding-3-small": 8192,
	"text-embedding-3-large": 8192,
	"text-embedding-ada-002": 8191
};
function normalizeOpenAiModel(model) {
	return normalizeEmbeddingModelWithPrefixes({
		model,
		defaultModel: OPENAI_DEFAULT_EMBEDDING_MODEL,
		prefixes: ["openai/"]
	});
}
async function createOpenAiEmbeddingProvider(options) {
	const originalModel = options.model;
	const resolvedClient = await resolveRemoteEmbeddingClient({
		provider: options.provider ?? "openai",
		capability: "embedding",
		options,
		defaultBaseUrl: DEFAULT_OPENAI_BASE_URL,
		normalizeModel: normalizeOpenAiModel
	});
	const isNativeOpenAi = URL.parse(resolvedClient.baseUrl)?.hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com";
	if (!isNativeOpenAi && originalModel.startsWith("openai/")) resolvedClient.model = `openai/${normalizeOpenAiModel(originalModel)}`;
	const client = {
		...resolvedClient,
		inputType: options.inputType,
		queryInputType: options.queryInputType,
		documentInputType: options.documentInputType,
		outputDimensionality: options.dimensions
	};
	return {
		provider: createRemoteEmbeddingProvider({
			id: "openai",
			client,
			errorPrefix: "openai embeddings failed",
			maxInputTokens: OPENAI_MAX_INPUT_TOKENS[normalizeOpenAiModel(client.model)],
			maxInputsPerRequest: isNativeOpenAi ? 2048 : void 0,
			buildRequestFields: (kind) => {
				const value = (kind === "query" ? client.queryInputType : client.documentInputType) ?? client.inputType;
				const inputType = typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
				return {
					...typeof client.outputDimensionality === "number" ? { dimensions: client.outputDimensionality } : {},
					...inputType ? { input_type: inputType } : {}
				};
			}
		}),
		client
	};
}
//#endregion
export { createOpenAiEmbeddingProvider };
