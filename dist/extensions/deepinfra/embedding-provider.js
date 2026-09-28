import { DEEPINFRA_BASE_URL, DEEPINFRA_EMBED_FALLBACK_MODELS, normalizeDeepInfraModelRef } from "./media-models.js";
import { createRemoteEmbeddingProvider, resolveRemoteEmbeddingClient } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
//#region extensions/deepinfra/embedding-provider.ts
const DEFAULT_DEEPINFRA_EMBEDDING_MODEL = DEEPINFRA_EMBED_FALLBACK_MODELS[0];
async function createDeepInfraEmbeddingProvider(options) {
	const defaultModel = options.defaultModel ?? DEFAULT_DEEPINFRA_EMBEDDING_MODEL;
	const client = await resolveRemoteEmbeddingClient({
		provider: "deepinfra",
		options: {
			...options,
			model: normalizeDeepInfraModelRef(options.model, defaultModel)
		},
		defaultBaseUrl: DEEPINFRA_BASE_URL,
		normalizeModel: (model) => normalizeDeepInfraModelRef(model, defaultModel)
	});
	return {
		provider: createRemoteEmbeddingProvider({
			id: "deepinfra",
			client,
			errorPrefix: "DeepInfra embeddings API error",
			batchQueryInputs: true
		}),
		client
	};
}
//#endregion
export { DEFAULT_DEEPINFRA_EMBEDDING_MODEL, createDeepInfraEmbeddingProvider };
