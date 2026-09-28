import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/google/oauth-token-shared.ts
function parseGoogleOauthApiKey(apiKey) {
	try {
		const parsed = JSON.parse(apiKey);
		return {
			token: readStringValue(parsed.token),
			projectId: readStringValue(parsed.projectId)
		};
	} catch {
		return null;
	}
}
function formatGoogleOauthApiKey(cred) {
	if (cred.type !== "oauth" || typeof cred.access !== "string" || !cred.access.trim()) return "";
	return JSON.stringify({
		token: cred.access,
		projectId: cred.projectId
	});
}
//#endregion
export { parseGoogleOauthApiKey as n, formatGoogleOauthApiKey as t };
