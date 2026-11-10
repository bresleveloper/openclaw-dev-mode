import { R as sanitizeGoogleThinkingPayload, p as createPayloadPatchStreamWrapper } from "./provider-stream-shared-Ond8mlRx.mjs";
import { r as buildProviderReplayFamilyHooks } from "./provider-model-shared-B_4afNJ5.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-DynDHTtQ.mjs";
import { t as stripGoogleProviderPrefix } from "./model-id-B1FKGbAg.mjs";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-COnE2-la.mjs";
import "./thinking-api-1yQZuH50.mjs";
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
