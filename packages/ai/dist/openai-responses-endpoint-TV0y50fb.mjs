//#region packages/ai/src/transports/openai-responses-endpoint.ts
function isOfficialOpenAIResponsesBaseUrl(baseUrl) {
	if (!baseUrl) return false;
	const url = URL.parse(baseUrl);
	return url !== null && url.origin === "https://api.openai.com" && url.username === "" && url.password === "" && url.search === "" && url.hash === "" && url.pathname.replace(/\/+$/, "") === "/v1";
}
function supportsNativeOpenAIResponsesEndpoint(params) {
	return params.provider.trim().toLowerCase() === "openai" && params.api === "openai-responses" && isOfficialOpenAIResponsesBaseUrl(params.baseUrl);
}
//#endregion
export { supportsNativeOpenAIResponsesEndpoint as n, isOfficialOpenAIResponsesBaseUrl as t };
