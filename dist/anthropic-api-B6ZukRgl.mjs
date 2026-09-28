import "./bootstrap-Dvw1-bo8.mjs";
//#region src/agents/embedded-agent-helpers/google.ts
/** Detects Google-owned embedded runtime APIs. */
function isGoogleModelApi(api) {
	return api === "google-gemini-cli" || api === "google-generative-ai";
}
//#endregion
//#region src/agents/embedded-agent-helpers/anthropic-api.ts
function isAnthropicApi(modelApi) {
	return modelApi === "anthropic-messages" || modelApi === "bedrock-converse-stream";
}
//#endregion
export { isGoogleModelApi as n, isAnthropicApi as t };
