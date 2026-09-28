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
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: "minimax-m3",
		contextWindow: 524288,
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
		capabilities: [
			"completion",
			"thinking",
			"tools",
			"vision"
		]
	},
	{
		id: "glm-5.1",
		contextWindow: 202752,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: OLLAMA_GLM52_CLOUD_MODEL_ID,
		contextWindow: 1e6,
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
const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128e3;
const OLLAMA_LOCAL_CONTEXT_TOKENS = 32768;
const OLLAMA_DEFAULT_MAX_TOKENS = 8192;
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
export { OLLAMA_DEFAULT_API_KEY as a, OLLAMA_DEFAULT_COST as c, OLLAMA_GLM52_CLOUD_MODEL_ID as d, OLLAMA_LOCAL_CONTEXT_TOKENS as f, resolveOllamaSetupDefaultBaseUrl as g, normalizeOllamaCloudModelId as h, OLLAMA_CLOUD_PROVIDER_ID as i, OLLAMA_DEFAULT_MAX_TOKENS as l, isOllamaCloudOrigin as m, OLLAMA_CLOUD_BASE_URL as n, OLLAMA_DEFAULT_BASE_URL as o, isHostedOllamaCloud as p, OLLAMA_CLOUD_DEFAULT_MODELS as r, OLLAMA_DEFAULT_CONTEXT_WINDOW as s, DEFAULT_OLLAMA_EMBEDDING_MODEL as t, OLLAMA_DEFAULT_MODEL as u };
