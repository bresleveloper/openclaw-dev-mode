// packages/ai/src/providers/azure-openai-responses-client-compat.ts
function isTraditionalAzureOpenAIHost(hostname) {
	return hostname.endsWith(".openai.azure.com") || hostname.endsWith(".cognitiveservices.azure.com");
}
function isOpenAICompatibleAzureResponsesBaseUrl(baseUrl) {
	const url = URL.parse(baseUrl);
	if (!url || isTraditionalAzureOpenAIHost(url.hostname)) return false;
	const hostname = url.hostname.toLowerCase();
	if (!(hostname.endsWith(".services.ai.azure.com") || hostname.endsWith(".api.cognitive.microsoft.com"))) return false;
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	return normalizedPath === "/openai/v1" || normalizedPath.endsWith("/openai/v1");
}
export { isTraditionalAzureOpenAIHost as n, isOpenAICompatibleAzureResponsesBaseUrl as t };
