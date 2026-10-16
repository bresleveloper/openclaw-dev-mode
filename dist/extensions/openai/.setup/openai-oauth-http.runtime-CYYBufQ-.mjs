import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/openai/openai-oauth-http.runtime.ts
async function withOpenAIOAuthResponse(request, consume) {
	const { response, release } = await fetchWithSsrFGuard(request);
	try {
		return await consume(response);
	} finally {
		await release();
	}
}
function createOpenAIAuthorizationCodeForm(params) {
	return new URLSearchParams({
		grant_type: "authorization_code",
		client_id: params.clientId,
		code: params.code,
		code_verifier: params.verifier,
		redirect_uri: params.redirectUri,
		...params.resource ? { resource: params.resource } : {}
	});
}
//#endregion
export { withOpenAIOAuthResponse as n, createOpenAIAuthorizationCodeForm as t };
