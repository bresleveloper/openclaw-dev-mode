import { hasAnthropicVertexAvailableAuth, resolveAnthropicVertexConfigApiKey } from "./region.js";
//#region extensions/anthropic-vertex/provider-discovery.ts
const PROVIDER_ID = "anthropic-vertex";
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
/** Anthropic Vertex provider discovery descriptor. */
const anthropicVertexProviderDiscovery = {
	id: PROVIDER_ID,
	label: "Anthropic Vertex",
	docsPath: "/providers/models",
	auth: [],
	catalog: {
		order: "simple",
		run: async (ctx) => {
			const { runAnthropicVertexCatalog } = await import("./provider-catalog-runtime.js");
			return await runAnthropicVertexCatalog(ctx);
		}
	},
	resolveConfigApiKey: ({ env }) => resolveAnthropicVertexConfigApiKey(env),
	resolveSyntheticAuth: () => {
		if (!hasAnthropicVertexAvailableAuth()) return;
		return {
			apiKey: GCP_VERTEX_CREDENTIALS_MARKER,
			source: "gcp-vertex-credentials (ADC)",
			mode: "api-key"
		};
	}
};
//#endregion
export { anthropicVertexProviderDiscovery, anthropicVertexProviderDiscovery as default };
