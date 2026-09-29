import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-BQRtcdBp.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-DaDnKUnq.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { f as getCachedLiveProviderModelRows, v as readLiveModelCatalogStringField } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import "./provider-catalog-shared-D7_lTYyN.mjs";
import { lookup } from "node:dns/promises";
//#region extensions/nvidia/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "nvidia",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["nvidia"],
	providerEndpoints: [{
		"endpointClass": "nvidia-native",
		"hosts": ["integrate.api.nvidia.com"],
		"baseUrls": ["https://integrate.api.nvidia.com/v1"]
	}],
	modelIdNormalization: { "providers": { "nvidia": { "prefixWhenBare": "nvidia" } } },
	modelCatalog: {
		"modelsDev": { "nvidia": "nvidia" },
		"providers": { "nvidia": {
			"baseUrl": "https://integrate.api.nvidia.com/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "nvidia/nemotron-3-ultra-550b-a55b",
					"name": "Nemotron 3 Ultra 550B",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true }
				},
				{
					"id": "nvidia/nemotron-3.5-lightning-30b-a3b",
					"name": "Nemotron 3.5 Lightning 30B",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 16384,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true }
				},
				{
					"id": "nvidia/nemotron-3-super-120b-a12b",
					"name": "Nemotron 3 Super 120B",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 1e6,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true }
				},
				{
					"id": "z-ai/glm-5.2",
					"name": "GLM 5.2",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 202752,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"requiresStringContent": true,
						"codeMode": "capable"
					}
				},
				{
					"id": "moonshotai/kimi-k2.6",
					"name": "Kimi K2.6",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 65536,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true }
				},
				{
					"id": "minimaxai/minimax-m3",
					"name": "Minimax M3",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 196608,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true }
				},
				{
					"id": "deepseek-ai/deepseek-v4-pro",
					"name": "DeepSeek V4 Pro",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 16384,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"requiresStringContent": true,
						"codeMode": "capable"
					}
				},
				{
					"id": "qwen/qwen3.5-397b-a17b",
					"name": "Qwen3.5 397B A17B",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 32768,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true },
					"status": "deprecated",
					"statusReason": "NVIDIA retired this model and no longer lists it in its model catalog."
				},
				{
					"id": "moonshotai/kimi-k2.5",
					"name": "Kimi K2.5",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 262144,
					"maxTokens": 32768,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true },
					"status": "deprecated",
					"statusReason": "Still available by exact reference; use moonshotai/kimi-k2.6 for new NVIDIA setups.",
					"replacedBy": "moonshotai/kimi-k2.6"
				},
				{
					"id": "z-ai/glm-5.1",
					"name": "GLM 5.1",
					"input": ["text"],
					"contextWindow": 202752,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"requiresStringContent": true,
						"codeMode": "capable"
					},
					"status": "deprecated",
					"statusReason": "Still available by exact reference; use z-ai/glm-5.2 for new NVIDIA setups.",
					"replacedBy": "z-ai/glm-5.2"
				},
				{
					"id": "z-ai/glm5",
					"name": "GLM-5",
					"input": ["text"],
					"contextWindow": 202752,
					"maxTokens": 8192,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true },
					"status": "deprecated",
					"statusReason": "Still available by exact reference; use z-ai/glm-5.2 for new NVIDIA setups.",
					"replacedBy": "z-ai/glm-5.2"
				},
				{
					"id": "minimaxai/minimax-m2.7",
					"name": "Minimax M2.7",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 204800,
					"maxTokens": 16384,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "requiresStringContent": true },
					"status": "deprecated",
					"statusReason": "Still available by exact reference; use minimaxai/minimax-m3 for new NVIDIA setups.",
					"replacedBy": "minimaxai/minimax-m3"
				}
			]
		} },
		"discovery": { "nvidia": "refreshable" }
	},
	setup: { "providers": [{
		"id": "nvidia",
		"envVars": ["NVIDIA_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "nvidia",
		"method": "api-key",
		"choiceId": "nvidia-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "NVIDIA API key",
		"groupId": "nvidia",
		"groupLabel": "NVIDIA",
		"groupHint": "Direct API key",
		"optionKey": "nvidiaApiKey",
		"cliFlag": "--nvidia-api-key",
		"cliOption": "--nvidia-api-key <key>",
		"cliDescription": "NVIDIA API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/nvidia/provider-catalog.ts
const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
const NVIDIA_MODELS_URL = "https://integrate.api.nvidia.com/v1/models";
const NVIDIA_FEATURED_MODELS_URL = "https://assets.ngc.nvidia.com/products/api-catalog/featured-models.json";
const FEATURED_MODEL_CACHE_TTL_MS = 864e5;
const FEATURED_MODEL_FETCH_TIMEOUT_MS = 1e4;
const FEATURED_MODEL_MAX_ROWS = 32;
const FEATURED_MODEL_MAX_ID_LENGTH = 200;
const FEATURED_MODEL_MAX_NAME_LENGTH = 200;
const FEATURED_MODEL_MAX_CONTEXT_WINDOW = 1e7;
const FEATURED_MODEL_MAX_OUTPUT_TOKENS = 1e6;
const FEATURED_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const NVIDIA_ULTRA_DEFAULT_PARAMS = { chat_template_kwargs: {
	enable_thinking: false,
	force_nonempty_content: true
} };
const DEPRECATED_NVIDIA_MODEL_IDS = new Set(openclaw_plugin_default.modelCatalog.providers.nvidia.models.filter((model) => "status" in model && model.status === "deprecated").map((model) => model.id));
const lookupNvidiaFeaturedModelHostname = (async (hostname, options) => {
	if (typeof options === "object" && options !== null) return await lookup(hostname, {
		...options,
		family: 4
	});
	return await lookup(hostname, { family: 4 });
});
function buildNvidiaProvider() {
	const provider = {
		...buildManifestModelProviderConfig({
			providerId: "nvidia",
			catalog: openclaw_plugin_default.modelCatalog.providers.nvidia
		}),
		apiKey: "NVIDIA_API_KEY"
	};
	return {
		...provider,
		models: applyNvidiaModelDefaults(provider.models ?? [])
	};
}
function buildSelectableNvidiaProvider() {
	const provider = buildNvidiaProvider();
	return {
		...provider,
		models: filterSelectableNvidiaModels(provider.models ?? [])
	};
}
async function buildLiveNvidiaProvider() {
	const provider = buildNvidiaProvider();
	return {
		...provider,
		models: await loadNvidiaLiveModels(provider.models)
	};
}
async function loadNvidiaLiveModels(bundledModels) {
	const [inventory, featured] = await Promise.allSettled([getCachedLiveProviderModelRows({
		providerId: "nvidia",
		endpoint: NVIDIA_MODELS_URL,
		requireHttps: true,
		readRows: (payload) => {
			if (!isRecord(payload) || !Array.isArray(payload.data)) throw new Error("NVIDIA model inventory must contain data[]");
			if (payload.data.some((row) => !readLiveModelCatalogStringField(row, "id"))) throw new Error("NVIDIA model inventory contains a row without an id");
			return payload.data;
		}
	}), loadNvidiaFeaturedModels()]);
	if (inventory.status === "rejected") throw inventory.reason;
	if (inventory.value.length === 0) return [];
	if (featured.status === "rejected") throw featured.reason;
	const available = new Set(inventory.value.map((row) => readLiveModelCatalogStringField(row, "id")));
	const known = new Map(bundledModels.map((model) => [model.id, model]));
	const ranked = new Map(featured.value.map((model) => {
		const bundled = known.get(model.id);
		return [model.id, bundled ? {
			...bundled,
			name: model.name,
			contextWindow: model.contextWindow,
			maxTokens: model.maxTokens
		} : model];
	}));
	for (const [id, model] of known) if (!ranked.has(id)) ranked.set(id, model);
	return [...ranked.values()].filter((model) => available.has(model.id));
}
async function loadNvidiaFeaturedModels() {
	const models = parseNvidiaFeaturedModels(await getCachedLiveProviderModelRows({
		providerId: "nvidia",
		endpoint: NVIDIA_FEATURED_MODELS_URL,
		timeoutMs: FEATURED_MODEL_FETCH_TIMEOUT_MS,
		ttlMs: FEATURED_MODEL_CACHE_TTL_MS,
		requireHttps: true,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(NVIDIA_FEATURED_MODELS_URL),
		lookupFn: lookupNvidiaFeaturedModelHostname,
		auditContext: "nvidia-featured-model-catalog",
		shouldCacheRows: (modelRows) => parseNvidiaFeaturedModels(modelRows) !== null,
		readRows: (payload) => {
			if (!isRecord(payload) || !Array.isArray(payload["featured-models"])) throw new Error("NVIDIA featured catalog must contain featured-models[]");
			return payload["featured-models"];
		}
	}));
	if (!models) throw new Error("NVIDIA featured catalog contains no usable model metadata");
	return models;
}
function parseNvidiaFeaturedModels(rows) {
	const models = rows.slice(0, FEATURED_MODEL_MAX_ROWS).map(parseNvidiaFeaturedModel).filter((model) => model !== null);
	return rows.length === 0 || models.length > 0 ? models : null;
}
function applyNvidiaModelDefaults(models) {
	return models.map((model) => model.id === "nvidia/nemotron-3-ultra-550b-a55b" ? {
		...model,
		params: {
			...model.params,
			chat_template_kwargs: {
				...NVIDIA_ULTRA_DEFAULT_PARAMS.chat_template_kwargs,
				...isRecord(model.params?.chat_template_kwargs) ? model.params.chat_template_kwargs : {}
			}
		}
	} : model);
}
function filterSelectableNvidiaModels(models) {
	return models.filter((model) => !DEPRECATED_NVIDIA_MODEL_IDS.has(model.id));
}
function parseNvidiaFeaturedModel(row) {
	if (!row || typeof row !== "object") return null;
	const entry = row;
	if (typeof entry.model !== "string" || typeof entry["model-name"] !== "string" || !isBoundedPositiveInteger(entry.context, FEATURED_MODEL_MAX_CONTEXT_WINDOW) || !isBoundedPositiveInteger(entry["max-output"], FEATURED_MODEL_MAX_OUTPUT_TOKENS)) return null;
	const id = normalizeNvidiaFeaturedModelId(entry.model);
	const name = normalizeFeaturedModelName(entry["model-name"]);
	if (!id || !name) return null;
	return {
		id,
		name,
		reasoning: false,
		input: ["text"],
		contextWindow: entry.context,
		maxTokens: entry["max-output"],
		cost: { ...FEATURED_MODEL_COST },
		compat: { requiresStringContent: true }
	};
}
function normalizeNvidiaFeaturedModelId(model) {
	const trimmed = model.trim();
	if (!trimmed || trimmed.length > FEATURED_MODEL_MAX_ID_LENGTH || hasWhitespaceOrControlCharacter(trimmed)) return "";
	return trimmed.includes("/") ? trimmed : `nvidia/${trimmed}`;
}
function normalizeFeaturedModelName(name) {
	const trimmed = name.trim();
	if (!trimmed || trimmed.length > FEATURED_MODEL_MAX_NAME_LENGTH || hasControlCharacter(trimmed)) return "";
	return trimmed;
}
function isBoundedPositiveInteger(value, max) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max;
}
function hasWhitespaceOrControlCharacter(value) {
	for (const char of value) if (isAsciiWhitespaceOrControlCharacter(char)) return true;
	return false;
}
function hasControlCharacter(value) {
	for (const char of value) if (isControlCharacter(char)) return true;
	return false;
}
function isControlCharacter(char) {
	const code = char.charCodeAt(0);
	return code <= 31 || code === 127;
}
function isAsciiWhitespaceOrControlCharacter(char) {
	const code = char.charCodeAt(0);
	return code <= 32 || code === 127;
}
//#endregion
export { openclaw_plugin_default as a, buildSelectableNvidiaProvider as i, buildLiveNvidiaProvider as n, buildNvidiaProvider as r, NVIDIA_DEFAULT_MODEL_ID as t };
