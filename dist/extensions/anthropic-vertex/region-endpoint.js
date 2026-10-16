import { resolveAnthropicVertexRegion } from "./region.js";
import { resolveProviderEndpoint } from "openclaw/plugin-sdk/provider-http";
//#region extensions/anthropic-vertex/region-endpoint.ts
/** Build the native Vertex endpoint from the service region. */
function resolveAnthropicVertexBaseUrl(env) {
	const region = resolveAnthropicVertexRegion(env);
	return region === "global" ? "https://aiplatform.googleapis.com" : region === "us" || region === "eu" ? `https://aiplatform.${region}.rep.googleapis.com` : `https://${region}-aiplatform.googleapis.com`;
}
/** Extract a Vertex region from a provider base URL when possible. */
function resolveAnthropicVertexRegionFromBaseUrl(baseUrl) {
	const endpoint = resolveProviderEndpoint(baseUrl);
	return endpoint.endpointClass === "google-vertex" ? endpoint.googleVertexRegion : void 0;
}
/** Resolve the client region from model base URL first, then env fallback. */
function resolveAnthropicVertexClientRegion(params) {
	return resolveAnthropicVertexRegionFromBaseUrl(params?.baseUrl) || resolveAnthropicVertexRegion(params?.env);
}
//#endregion
export { resolveAnthropicVertexBaseUrl, resolveAnthropicVertexClientRegion, resolveAnthropicVertexRegionFromBaseUrl };
