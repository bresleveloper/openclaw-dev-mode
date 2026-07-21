import { c as resolveProviderRequestHeaders } from "./provider-request-config-DNsOe2me.js";
import "./provider-http-DjXS2nxd.js";
import "./google-api-base-url-D6BJ2-C8.js";
import "./provider-policy-Cmq0B2e3.js";
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
