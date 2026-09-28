import { hasAnthropicVertexAvailableAuth } from "./region.js";
import { buildAnthropicVertexProvider } from "./provider-catalog.js";
//#region extensions/anthropic-vertex/provider-catalog-runtime.ts
/** Merge an implicit Anthropic Vertex provider with explicit user config. */
function mergeImplicitAnthropicVertexProvider(params) {
	const { existing, implicit } = params;
	if (!existing) return implicit;
	return {
		...implicit,
		...existing,
		models: Array.isArray(existing.models) && existing.models.length > 0 ? existing.models : implicit.models
	};
}
/** Resolve an implicit Anthropic Vertex provider when ADC credentials are available. */
function resolveImplicitAnthropicVertexProvider(params) {
	const env = params?.env ?? process.env;
	if (!hasAnthropicVertexAvailableAuth(env)) return null;
	return buildAnthropicVertexProvider({ env });
}
/** Build the shared catalog result used by discovery and the full plugin entry. */
async function runAnthropicVertexCatalog(ctx) {
	const implicit = resolveImplicitAnthropicVertexProvider({ env: ctx.env });
	if (!implicit) return null;
	return { provider: implicit };
}
//#endregion
export { mergeImplicitAnthropicVertexProvider, resolveImplicitAnthropicVertexProvider, runAnthropicVertexCatalog };
