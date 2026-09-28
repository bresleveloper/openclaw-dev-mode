import "./defaults-Dkg1KktH.mjs";
//#region extensions/ollama/src/provider-base-url.ts
function resolveOllamaBaseUrlForRun(params) {
	return params.providerBaseUrl?.trim() || params.modelBaseUrl?.trim() || "http://127.0.0.1:11434";
}
function readProviderBaseUrl(provider) {
	if (!provider) return;
	if (Object.hasOwn(provider, "baseUrl") && typeof provider.baseUrl === "string" && provider.baseUrl.trim()) return provider.baseUrl.trim();
	const alternate = provider;
	if (Object.hasOwn(alternate, "baseURL") && typeof alternate.baseURL === "string" && alternate.baseURL.trim()) return alternate.baseURL.trim();
}
//#endregion
export { resolveOllamaBaseUrlForRun as n, readProviderBaseUrl as t };
