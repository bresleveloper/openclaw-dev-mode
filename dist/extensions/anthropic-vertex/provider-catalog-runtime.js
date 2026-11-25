import { hasAnthropicVertexAvailableAuth } from "./region.js";
import { buildAnthropicVertexProvider } from "./provider-catalog.js";
// extensions/anthropic-vertex/provider-catalog-runtime.ts
function mergeImplicitAnthropicVertexProvider(params) {
	const { existing, implicit } = params;
	if (!existing) return implicit;
	return {
		...implicit,
		...existing,
		models: existing.models?.length ? existing.models : implicit.models
	};
}
function resolveImplicitAnthropicVertexProvider(params) {
	const env = params?.env ?? process.env;
	if (!hasAnthropicVertexAvailableAuth(env)) return null;
	return buildAnthropicVertexProvider({ env });
}
async function runAnthropicVertexCatalog(ctx) {
	const implicit = resolveImplicitAnthropicVertexProvider({ env: ctx.env });
	if (!implicit) return null;
	return { provider: implicit };
}
export { mergeImplicitAnthropicVertexProvider, resolveImplicitAnthropicVertexProvider, runAnthropicVertexCatalog };
