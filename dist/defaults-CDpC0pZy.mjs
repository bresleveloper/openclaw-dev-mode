import { r as isCloudModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
//#region extensions/ollama/src/defaults.ts
const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const OLLAMA_DEFAULT_API_KEY = "ollama-local";
const OLLAMA_DOCKER_HOST_BASE_URL = "http://host.docker.internal:11434";
const OLLAMA_CLOUD_BASE_URL = "https://ollama.com";
/** Recognizes the hosted origin even when a transport path is appended. */
function isOllamaCloudOrigin(baseUrl) {
	return baseUrl !== void 0 && URL.parse(baseUrl)?.origin === "https://ollama.com";
}
function isHostedOllamaCloud(baseUrl) {
	const host = baseUrl ? URL.parse(baseUrl)?.hostname.toLowerCase() : void 0;
	return host !== void 0 && (host === "ollama.com" || host.endsWith(".ollama.com"));
}
const OLLAMA_CLOUD_PROVIDER_ID = "ollama-cloud";
const OLLAMA_GLM52_CLOUD_MODEL_ID = "glm-5.2";
/**
* Order is a contract: cloud onboarding merges this list ahead of live discovery and takes
* the first name as `defaultModel` (`setup.runtime.ts`). Reordering this array changes what
* every new setup selects, so keep the intended default at index 0.
*/
const OLLAMA_CLOUD_DEFAULT_MODELS = [
	{
		id: "minimax-m2.7",
		contextWindow: 196608,
		maxTokens: 131072,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: "minimax-m3",
		contextWindow: 524288,
		maxTokens: 131072,
		capabilities: [
			"completion",
			"thinking",
			"tools",
			"vision"
		]
	},
	{
		id: "kimi-k3",
		contextWindow: 1048576,
		maxTokens: 1048576,
		capabilities: [
			"completion",
			"thinking",
			"tools",
			"vision"
		]
	},
	{
		id: OLLAMA_GLM52_CLOUD_MODEL_ID,
		contextWindow: 1e6,
		maxTokens: 131072,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	}
];
/** Cloud models are referenced bare, `:cloud`-suffixed, and `-cloud`-suffixed. */
function normalizeOllamaCloudModelId(modelId) {
	return modelId.trim().toLowerCase().replace(/(?::cloud|-cloud)$/, "");
}
function resolveOllamaCloudDefaultModel(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return OLLAMA_CLOUD_DEFAULT_MODELS.find((model) => model.id === normalized);
}
/**
* Hosted Ollama output budget. Local models return undefined and take the shared
* context-sized default, which keeps prompt room inside the local num_ctx.
*/
function resolveOllamaOutputBudget(params) {
	return params.remote || isCloudModelRef(params.modelId) ? resolveOllamaCloudDefaultModel(params.modelId)?.maxTokens ?? params.contextWindow ?? 128e3 : void 0;
}
const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128e3;
const OLLAMA_LOCAL_CONTEXT_TOKENS = 32768;
const OLLAMA_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OLLAMA_DEFAULT_MODEL = "gemma4";
const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
function resolveOllamaSetupDefaultBaseUrl(env = process.env) {
	return [
		"1",
		"true",
		"yes",
		"on"
	].includes(env.OPENCLAW_DOCKER_SETUP?.trim().toLowerCase() ?? "") ? OLLAMA_DOCKER_HOST_BASE_URL : OLLAMA_DEFAULT_BASE_URL;
}
//#endregion
export { resolveOllamaSetupDefaultBaseUrl as _, OLLAMA_DEFAULT_API_KEY as a, OLLAMA_DEFAULT_COST as c, OLLAMA_LOCAL_CONTEXT_TOKENS as d, isHostedOllamaCloud as f, resolveOllamaOutputBudget as g, resolveOllamaCloudDefaultModel as h, OLLAMA_CLOUD_PROVIDER_ID as i, OLLAMA_DEFAULT_MODEL as l, normalizeOllamaCloudModelId as m, OLLAMA_CLOUD_BASE_URL as n, OLLAMA_DEFAULT_BASE_URL as o, isOllamaCloudOrigin as p, OLLAMA_CLOUD_DEFAULT_MODELS as r, OLLAMA_DEFAULT_CONTEXT_WINDOW as s, DEFAULT_OLLAMA_EMBEDDING_MODEL as t, OLLAMA_GLM52_CLOUD_MODEL_ID as u };
