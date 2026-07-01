import { a as createGoogleThinkingStreamWrapper } from "./provider-stream-shared-CDfVnM8B.js";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-pp09751S.js";
import { n as buildProviderToolCompatFamilyHooks } from "./provider-tools-VmwDm8UA.js";
import "./thinking-api-ChY9wdi1.js";
import { u as resolveGoogleThinkingProfile } from "./provider-policy-8nVd77O2.js";
//#region extensions/google/provider-hooks.ts
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
	...buildProviderToolCompatFamilyHooks("gemini"),
	resolveThinkingProfile: (context) => resolveGoogleThinkingProfile(context),
	wrapStreamFn: createGoogleThinkingStreamWrapper
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS as t };
