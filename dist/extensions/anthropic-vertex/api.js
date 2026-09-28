import { hasAnthropicVertexAvailableAuth, hasAnthropicVertexCredentials, resolveAnthropicVertexConfigApiKey, resolveAnthropicVertexProjectId, resolveAnthropicVertexRegion } from "./region.js";
import { resolveAnthropicVertexClientRegion, resolveAnthropicVertexRegionFromBaseUrl } from "./region-endpoint.js";
import { ANTHROPIC_VERTEX_DEFAULT_MODEL_ID, buildAnthropicVertexProvider } from "./provider-catalog.js";
import { mergeImplicitAnthropicVertexProvider, resolveImplicitAnthropicVertexProvider } from "./provider-catalog-runtime.js";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/anthropic-vertex/api.ts
const loadStreamRuntimeModule = createLazyRuntimeModule(() => import("./stream-runtime.js"));
/** Create a lazy Anthropic Vertex stream function for a known project/region/base URL. */
function createAnthropicVertexStreamFn(projectId, region, baseURL, deps) {
	const streamFnPromise = loadStreamRuntimeModule().then((runtime) => runtime.createAnthropicVertexStreamFn(projectId, region, baseURL, deps));
	return async (model, context, options) => {
		return (await streamFnPromise)(model, context, options);
	};
}
/** Create a lazy Anthropic Vertex stream function using model base URL and env hints. */
function createAnthropicVertexStreamFnForModel(model, env = process.env, deps) {
	const streamFnPromise = loadStreamRuntimeModule().then((runtime) => runtime.createAnthropicVertexStreamFnForModel(model, env, deps));
	return async (...args) => {
		return (await streamFnPromise)(...args);
	};
}
//#endregion
export { ANTHROPIC_VERTEX_DEFAULT_MODEL_ID, buildAnthropicVertexProvider, createAnthropicVertexStreamFn, createAnthropicVertexStreamFnForModel, hasAnthropicVertexAvailableAuth, hasAnthropicVertexCredentials, mergeImplicitAnthropicVertexProvider, resolveAnthropicVertexClientRegion, resolveAnthropicVertexConfigApiKey, resolveAnthropicVertexProjectId, resolveAnthropicVertexRegion, resolveAnthropicVertexRegionFromBaseUrl, resolveImplicitAnthropicVertexProvider };
