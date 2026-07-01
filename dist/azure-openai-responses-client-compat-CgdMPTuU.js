//#region src/llm/providers/azure-deployment-map.ts
/** Parses AZURE_OPENAI_DEPLOYMENT_MAP-style model=deployment entries. */
function parseAzureDeploymentNameMap(value) {
	const map = /* @__PURE__ */ new Map();
	if (!value) return map;
	for (const entry of value.split(",")) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const separator = trimmed.indexOf("=");
		if (separator <= 0) continue;
		const modelId = trimmed.slice(0, separator).trim();
		const deploymentName = trimmed.slice(separator + 1).trim();
		if (!modelId || !deploymentName) continue;
		map.set(modelId, deploymentName);
	}
	return map;
}
/** Resolves the Azure deployment name for a model id, falling back to the model id. */
function resolveAzureDeploymentNameFromMap(params) {
	return parseAzureDeploymentNameMap(params.deploymentMap).get(params.modelId) || params.modelId;
}
//#endregion
//#region src/shared/azure-openai-responses-client-compat.ts
function isTraditionalAzureOpenAIHost(hostname) {
	return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) {
	let url;
	try {
		url = new URL(baseUrl);
	} catch {
		return false;
	}
	if (isTraditionalAzureOpenAIHost(url.hostname)) return false;
	const hostname = url.hostname.toLowerCase();
	if (!(hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".api.cognitive.microsoft.com"))) return false;
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	return normalizedPath === "/openai/v1" || normalizedPath.endsWith("/openai/v1");
}
//#endregion
export { resolveAzureDeploymentNameFromMap as n, isOpenAICompatibleAzureResponsesBaseUrl as t };
