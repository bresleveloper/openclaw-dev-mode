import { readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/google-meet/src/google-api.ts
const REAUTH_HINT = "Re-run `openclaw googlemeet auth login` and store the refreshed oauth block.";
const GOOGLE_API_ERROR_BODY_LIMIT_BYTES = 8192;
function scopeText(scopes) {
	return scopes.map((scope) => `\`${scope}\``).join(", ");
}
async function readGoogleApiErrorDetail(response) {
	return await readResponseTextLimited(response, GOOGLE_API_ERROR_BODY_LIMIT_BYTES);
}
async function googleApiError(params) {
	const detail = await readGoogleApiErrorDetail(params.response);
	const scopeHint = params.scopes && params.scopes.length > 0 ? ` Required OAuth scope: ${scopeText(params.scopes)}. ${REAUTH_HINT}` : "";
	return /* @__PURE__ */ new Error(`${params.prefix} failed (${params.response.status}): ${detail}${scopeHint}`);
}
function appendQuery(url, query) {
	if (!query) return url;
	const parsed = new URL(url);
	for (const [key, value] of Object.entries(query)) if (value !== void 0) parsed.searchParams.set(key, String(value));
	return parsed.toString();
}
async function requestGoogleApi(params, read) {
	const { response, release } = await fetchWithSsrFGuard({
		url: appendQuery(params.url, params.query),
		init: {
			...params.init,
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
				Accept: params.accept ?? "application/json",
				...params.init?.body === void 0 ? {} : { "Content-Type": "application/json" }
			}
		},
		policy: { allowedHostnames: [params.allowedHostname] },
		auditContext: params.auditContext,
		timeoutMs: 3e4
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: params.prefix,
			scopes: params.scopes
		});
		return await read(response);
	} finally {
		await release();
	}
}
//#endregion
export { requestGoogleApi as n, readGoogleApiErrorDetail as t };
