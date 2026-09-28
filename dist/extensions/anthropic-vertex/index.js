import { hasAnthropicVertexAvailableAuth, resolveAnthropicVertexConfigApiKey } from "./region.js";
import { normalizeAnthropicVertexResolvedModel, resolveAnthropicVertexDynamicModel } from "./provider-catalog.js";
import { runAnthropicVertexCatalog } from "./provider-catalog-runtime.js";
import "./api.js";
import { resolveThinkingProfile } from "./provider-policy-api.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/anthropic-vertex/index.ts
/**
* Anthropic Vertex provider plugin entry. It registers implicit ADC-backed
* catalog discovery, Anthropic replay policy, thinking profiles, and auth markers.
*/
const PROVIDER_ID = "anthropic-vertex";
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
/** Provider entry for Anthropic Claude models served through Google Vertex AI. */
var anthropic_vertex_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "Anthropic Vertex Provider",
	description: "Bundled Anthropic Vertex provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Anthropic Vertex",
			docsPath: "/providers/models",
			auth: [],
			catalog: {
				order: "simple",
				run: runAnthropicVertexCatalog
			},
			resolveConfigApiKey: ({ env }) => resolveAnthropicVertexConfigApiKey(env),
			resolveDynamicModel: ({ provider, modelId, modelRegistry, providerConfig }) => modelRegistry.find(provider, modelId) ?? resolveAnthropicVertexDynamicModel(modelId, providerConfig?.baseUrl),
			...buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" }),
			normalizeResolvedModel: ({ modelId, model }) => normalizeAnthropicVertexResolvedModel(modelId, model),
			resolveThinkingProfile,
			resolveSyntheticAuth: () => {
				if (!hasAnthropicVertexAvailableAuth()) return;
				return {
					apiKey: GCP_VERTEX_CREDENTIALS_MARKER,
					source: "gcp-vertex-credentials (ADC)",
					mode: "api-key"
				};
			},
			augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
				config,
				providerId: PROVIDER_ID
			})
		});
	}
});
//#endregion
export { anthropic_vertex_default as default };
