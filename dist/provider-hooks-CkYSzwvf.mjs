import { L as sanitizeGoogleThinkingPayload, f as createPayloadPatchStreamWrapper } from "./provider-stream-shared-CU7Z6wj0.mjs";
import { r as buildProviderReplayFamilyHooks } from "./provider-model-shared-CgZ78XZA.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-DajrfQK1.mjs";
import { t as stripGoogleProviderPrefix } from "./model-id-CPDOOOMu.mjs";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-4Ba5tPL0.mjs";
import "./thinking-api-3abQCRVR.mjs";
//#region extensions/google/provider-hooks.ts
function classifyGoogleFailoverCode(code) {
	switch (code?.trim().toUpperCase()) {
		case "UNAVAILABLE": return "overloaded";
		case "DEADLINE_EXCEEDED": return "timeout";
		case "INTERNAL": return "server_error";
		default: return;
	}
}
function wrapGoogleThinkingStream(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, model }) => {
		if (model.api !== "google-generative-ai" && model.api !== "google-vertex") return;
		sanitizeGoogleThinkingPayload({
			payload,
			modelId: stripGoogleProviderPrefix(model.id).replace(/^models\//u, ""),
			thinkingLevel: ctx.thinkingLevel
		});
	});
}
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
	...buildProviderToolCompatFamilyHooks("gemini"),
	resolveThinkingProfile: resolveGoogleThinkingProfile,
	wrapStreamFn: wrapGoogleThinkingStream,
	classifyFailoverReason: ({ code }) => classifyGoogleFailoverCode(code)
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS as t };
