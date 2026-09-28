//#region packages/ai/src/providers/azure-deployment-map.ts
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
let cachedDeploymentLookup;
function getDeploymentLookup(source) {
	const cached = cachedDeploymentLookup;
	if (cached && cached.source === source) return cached;
	const exact = parseAzureDeploymentNameMap(source);
	const folded = /* @__PURE__ */ new Map();
	for (const [modelId, deploymentName] of exact) folded.set(modelId.toLowerCase(), deploymentName);
	cachedDeploymentLookup = {
		source,
		exact,
		folded
	};
	return cachedDeploymentLookup;
}
/**
* Resolves the Azure deployment name for a model id, falling back to the model id.
*
* An exact-case match always wins, so configs that intentionally distinguish keys by
* case keep their exact mappings; a case-insensitive match is only used as a fallback
* (e.g. `GPT-4o` against a `gpt-4o=...` map) to avoid 404s from casing differences.
*/
function resolveAzureDeploymentNameFromMap(params) {
	const { exact, folded } = getDeploymentLookup(params.deploymentMap);
	return exact.get(params.modelId) ?? folded.get(params.modelId.toLowerCase()) ?? params.modelId;
}
//#endregion
//#region packages/ai/src/providers/azure-openai-responses-client-compat.ts
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
export { resolveAzureDeploymentNameFromMap as i, isTraditionalAzureOpenAIHost as n, parseAzureDeploymentNameMap as r, isOpenAICompatibleAzureResponsesBaseUrl as t };
