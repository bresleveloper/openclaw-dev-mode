import { s as createGoogleThinkingStreamWrapper } from "./provider-stream-shared-Dfb8yWNf.js";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-CcfAdtmN.js";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-CLA-JkCS.js";
import "./thinking-api-BHZCYO2z.js";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-Cmq0B2e3.js";
//#region extensions/google/provider-hooks.ts
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
	...buildProviderToolCompatFamilyHooks("gemini"),
	resolveThinkingProfile: (context) => resolveGoogleThinkingProfile(context),
	wrapStreamFn: createGoogleThinkingStreamWrapper
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS as t };
