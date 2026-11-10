import { t as GOOGLE_GEMINI_CLI_PROVIDER_ID } from "./gemini-cli-auth-home-CLUeR0gG.mjs";
import { t as formatGoogleOauthApiKey } from "./oauth-token-shared-x4Fku5bG.mjs";
import { t as createGoogleGeminiCliProvider } from "./provider-contract-api-C20GRskC.mjs";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-DZTeU4OL.mjs";
import { a as resolveGoogleGeminiForwardCompatModel, i as isModernGoogleModel } from "./provider-models-D-n-Hu1B.mjs";
//#region extensions/google/gemini-cli-provider.ts
function buildGoogleGeminiCliProvider() {
	return {
		...createGoogleGeminiCliProvider(),
		resolveDynamicModel: (ctx) => resolveGoogleGeminiForwardCompatModel({
			providerId: GOOGLE_GEMINI_CLI_PROVIDER_ID,
			ctx
		}),
		...GOOGLE_GEMINI_PROVIDER_HOOKS,
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId),
		formatApiKey: formatGoogleOauthApiKey
	};
}
//#endregion
export { buildGoogleGeminiCliProvider as t };
