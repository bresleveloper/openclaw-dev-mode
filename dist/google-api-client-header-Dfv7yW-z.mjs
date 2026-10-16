import { d as resolveProviderRequestHeaders } from "./provider-request-config-By9R9pyt.mjs";
import "./provider-http-CuRGJD0L.mjs";
import "./provider-policy-4Ba5tPL0.mjs";
//#region extensions/google/google-api-client-header.ts
function resolveGoogleApiClientHeaders(params) {
	return resolveProviderRequestHeaders({
		provider: "google",
		api: params?.api ?? "google-generative-ai",
		baseUrl: params?.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta",
		capability: params?.capability ?? "other",
		transport: params?.transport ?? "http"
	}) ?? {};
}
//#endregion
export { resolveGoogleApiClientHeaders as t };
