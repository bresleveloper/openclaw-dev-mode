import { n as createRemoteEmbeddingProvider, r as resolveRemoteEmbeddingClient } from "../../memory-core-host-engine-embeddings-B_fgzgsI.mjs";
import { r as OPENAI_DEFAULT_EMBEDDING_MODEL } from "../../default-models-DOFL1mMC.mjs";
//#region extensions/openai/embedding-provider.ts
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const OPENAI_MAX_INPUT_TOKENS = {
	"text-embedding-3-small": 8192,
	"text-embedding-3-large": 8192,
	"text-embedding-ada-002": 8191
};
function normalizeOpenAiModel(model) {
	const trimmed = model.trim();
	if (!trimmed) return OPENAI_DEFAULT_EMBEDDING_MODEL;
	return trimmed.startsWith("openai/") ? trimmed.slice(7) : trimmed;
}
/** Whether the embedding base URL points to the native OpenAI API endpoint. */
function isNativeOpenAiBaseUrl(baseUrl) {
	try {
		return new URL(baseUrl).hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com";
	} catch {
		return false;
	}
}
async function createOpenAiEmbeddingProvider(options) {
	const client = await resolveOpenAiEmbeddingClient(options);
	return {
		provider: createRemoteEmbeddingProvider({
			id: "openai",
			client,
			errorPrefix: "openai embeddings failed",
			maxInputTokens: OPENAI_MAX_INPUT_TOKENS[normalizeOpenAiModel(client.model)],
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
async function resolveOpenAiEmbeddingClient(options) {
	const originalModel = options.model;
	const client = await resolveRemoteEmbeddingClient({
		provider: options.provider ?? "openai",
		options,
		defaultBaseUrl: DEFAULT_OPENAI_BASE_URL,
		normalizeModel: normalizeOpenAiModel
	});
	if (!isNativeOpenAiBaseUrl(client.baseUrl) && originalModel.startsWith("openai/")) client.model = `openai/${normalizeOpenAiModel(originalModel)}`;
	return {
		...client,
		inputType: options.inputType,
		queryInputType: options.queryInputType,
		documentInputType: options.documentInputType,
		outputDimensionality: options.dimensions
	};
}
//#endregion
export { createOpenAiEmbeddingProvider };
