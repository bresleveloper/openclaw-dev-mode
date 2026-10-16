import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region extensions/xai/xai-oauth-entry.ts
const PROVIDER_ID = "xai";
const XAI_OAUTH_METHOD_ID = "oauth";
const XAI_OAUTH_CHOICE_ID = "xai-oauth";
const XAI_DEVICE_CODE_METHOD_ID = "device-code";
const XAI_DEVICE_CODE_CHOICE_ID = "xai-device-code";
const loadXaiOAuthRuntime = createLazyRuntimeModule(() => import("./extensions/xai/xai-oauth.js"));
function createXaiOAuthAuthMethod() {
	return {
		id: XAI_OAUTH_METHOD_ID,
		label: "xAI OAuth",
		hint: "Remote-friendly browser sign-in without a localhost callback",
		kind: "oauth",
		wizard: {
			choiceId: XAI_OAUTH_CHOICE_ID,
			choiceLabel: "xAI OAuth",
			choiceHint: "Remote-friendly browser sign-in without a localhost callback",
			groupId: PROVIDER_ID,
			groupLabel: "xAI (Grok)",
			groupHint: "API key or OAuth",
			methodId: XAI_OAUTH_METHOD_ID
		},
		run: async (ctx) => (await loadXaiOAuthRuntime()).loginXaiDeviceCode(ctx)
	};
}
function createXaiDeviceCodeAuthMethod() {
	return {
		id: XAI_DEVICE_CODE_METHOD_ID,
		label: "xAI device code",
		hint: "Deprecated alias for xAI OAuth device-code login",
		kind: "device_code",
		wizard: {
			choiceId: XAI_DEVICE_CODE_CHOICE_ID,
			choiceLabel: "xAI device code",
			choiceHint: "Compatibility alias for xAI OAuth device-code sign-in",
			assistantVisibility: "manual-only",
			groupId: PROVIDER_ID,
			groupLabel: "xAI (Grok)",
			groupHint: "API key or OAuth",
			methodId: XAI_DEVICE_CODE_METHOD_ID
		},
		run: async (ctx) => (await loadXaiOAuthRuntime()).loginXaiDeviceCode(ctx)
	};
}
async function refreshXaiOAuthCredential(credential) {
	return await (await loadXaiOAuthRuntime()).refreshXaiOAuthCredential(credential);
}
//#endregion
export { createXaiOAuthAuthMethod as n, refreshXaiOAuthCredential as r, createXaiDeviceCodeAuthMethod as t };
