import { t as collectProviderApiKeysForExecution } from "./api-key-rotation-Dw4l5GMT.mjs";
import "./provider-auth-runtime-CMRSW7VK.mjs";
import { a as isOfficialGoogleAiStudioBaseUrl } from "./google-api-base-url-BSKc6KBi.mjs";
import "./provider-policy-COnE2-la.mjs";
import { t as parseGeminiAuth } from "./gemini-auth-CUKsnejN.mjs";
//#region extensions/google/transport-api-keys.ts
function hasGoogleAuthHeader(headers) {
	return Object.keys(headers ?? {}).some((name) => {
		const normalized = name.trim().toLowerCase();
		return normalized === "authorization" || normalized === "x-goog-api-key";
	});
}
function collectGoogleTransportApiKeys(model, options, apiKey) {
	return isOfficialGoogleAiStudioBaseUrl(model.baseUrl) && !(apiKey?.trimStart().startsWith("{") && parseGeminiAuth(apiKey).headers.Authorization) && !hasGoogleAuthHeader(model.headers) && !hasGoogleAuthHeader(options?.headers) ? collectProviderApiKeysForExecution({
		provider: model.provider,
		primaryApiKey: apiKey
	}) : [];
}
//#endregion
export { collectGoogleTransportApiKeys as t };
