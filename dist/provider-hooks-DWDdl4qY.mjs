import { I as sanitizeGoogleThinkingPayload, d as createPayloadPatchStreamWrapper } from "./provider-stream-shared-BtT7wZpQ.mjs";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-DUNuGxOQ.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-BDV45rRZ.mjs";
import { r as stripGoogleProviderPrefix } from "./model-id-CAmKILzd.mjs";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-BWkzSuhk.mjs";
import "./thinking-api-DXAHpcmB.mjs";
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
