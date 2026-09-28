import { d as resolveProviderRequestHeaders } from "./provider-request-config-DOrVD029.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-policy-BWkzSuhk.mjs";
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
