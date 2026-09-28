import { t as GOOGLE_GEMINI_CLI_PROVIDER_ID } from "./gemini-cli-auth-home-CXgkYWW_.mjs";
import { t as formatGoogleOauthApiKey } from "./oauth-token-shared-DxS8mSo7.mjs";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-DWDdl4qY.mjs";
import { i as resolveGoogleGeminiForwardCompatModel, r as isModernGoogleModel } from "./provider-models-DPCgjgS5.mjs";
//#region extensions/google/gemini-cli-provider.ts
const PROVIDER_ID = GOOGLE_GEMINI_CLI_PROVIDER_ID;
const PROVIDER_LABEL = "Gemini CLI runtime";
function buildGoogleGeminiCliProvider() {
	return {
		id: PROVIDER_ID,
		label: PROVIDER_LABEL,
		docsPath: "/providers/models",
		aliases: ["gemini-cli"],
		envVars: [],
		auth: [],
		resolveDynamicModel: (ctx) => resolveGoogleGeminiForwardCompatModel({
			providerId: PROVIDER_ID,
			ctx
		}),
		...GOOGLE_GEMINI_PROVIDER_HOOKS,
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId),
		formatApiKey: (cred) => formatGoogleOauthApiKey(cred)
	};
}
function registerGoogleGeminiCliProvider(api) {
	api.registerProvider(buildGoogleGeminiCliProvider());
}
//#endregion
export { registerGoogleGeminiCliProvider as n, buildGoogleGeminiCliProvider as t };
