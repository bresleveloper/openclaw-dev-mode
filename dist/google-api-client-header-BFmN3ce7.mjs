import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import "./provider-http-BuV15s4V.mjs";
import "./google-api-base-url-BSKc6KBi.mjs";
import "./provider-policy-COnE2-la.mjs";
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
