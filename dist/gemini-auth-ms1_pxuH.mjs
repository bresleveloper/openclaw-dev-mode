import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { n as parseGoogleOauthApiKey } from "./oauth-token-shared-CcyTceNQ.mjs";
//#region extensions/google/gemini-auth.ts
function parseGeminiAuth(apiKey) {
	const parsed = apiKey.startsWith("{") ? parseGoogleOauthApiKey(apiKey) : null;
	if (parsed?.token) return { headers: {
		Authorization: `Bearer ${parsed.token}`,
		"Content-Type": "application/json"
	} };
	return { headers: {
		"x-goog-api-key": apiKey,
		"Content-Type": "application/json"
	} };
}
function resolveGoogleEnvApiKey() {
	return normalizeOptionalString(process.env.GEMINI_API_KEY) ?? normalizeOptionalString(process.env.GOOGLE_API_KEY);
}
//#endregion
export { resolveGoogleEnvApiKey as n, parseGeminiAuth as t };
