import { normalizeChutesModelPricing } from "../pricing-api.js";
import { buildLiveModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { asPositiveSafeInteger, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/chutes/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "chutes",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["chutes"],
	modelPricing: { "providers": { "chutes": { "chutes": { "provider": "chutes" } } } },
	providerEndpoints: [{
		"endpointClass": "chutes-native",
		"hosts": ["llm.chutes.ai"]
	}],
	providerRequest: { "providers": { "chutes": { "family": "chutes" } } },
	setup: { "providers": [{
		"id": "chutes",
		"envVars": ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"]
	}] },
	providerAuthChoices: [{
		"provider": "chutes",
		"method": "oauth",
		"choiceId": "chutes",
		"appGuidedAuth": "oauth",
		"credentialOnly": true,
		"choiceLabel": "Chutes (OAuth)",
		"choiceHint": "Browser sign-in",
		"groupId": "chutes",
		"groupLabel": "Chutes",
		"groupHint": "OAuth + API key"
	}, {
		"provider": "chutes",
		"method": "api-key",
		"choiceId": "chutes-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Chutes API key",
		"choiceHint": "Open-source models including Llama, DeepSeek, and more",
		"groupId": "chutes",
		"groupLabel": "Chutes",
		"groupHint": "OAuth + API key",
		"optionKey": "chutesApiKey",
		"cliFlag": "--chutes-api-key",
		"cliOption": "--chutes-api-key <key>",
		"cliDescription": "Chutes API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	modelCatalog: {
		"modelsDev": { "chutes": "chutes" },
		"providers": { "chutes": {
			"baseUrl": "https://llm.chutes.ai/v1",
			"api": "openai-completions",
			"defaultModel": "zai-org/GLM-5.2-TEE",
			"models": [
				{
					"id": "deepseek-ai/DeepSeek-V3.2-TEE",
					"name": "deepseek-ai/DeepSeek-V3.2-TEE",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 131072,
					"maxTokens": 65536,
					"cost": {
						"input": 1,
						"output": 1,
						"cacheRead": .09999999999999998,
						"cacheWrite": 0
					}
				},
				{
					"id": "moonshotai/Kimi-K2.6-TEE",
					"name": "moonshotai/Kimi-K2.6-TEE",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 65535,
					"cost": {
						"input": .58,
						"output": 3.4,
						"cacheRead": .05799999999999998,
						"cacheWrite": 0
					}
				},
				{
					"id": "moonshotai/Kimi-K2.5-TEE",
					"name": "moonshotai/Kimi-K2.5-TEE",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 65535,
					"cost": {
						"input": .44,
						"output": 2,
						"cacheRead": .22,
						"cacheWrite": 0
					},
					"status": "deprecated",
					"replacedBy": "moonshotai/Kimi-K2.6-TEE"
				},
				{
					"id": "zai-org/GLM-5.2-TEE",
					"name": "zai-org/GLM-5.2-TEE",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 65535,
					"cost": {
						"input": 1.25,
						"output": 3.95,
						"cacheRead": .12499999999999997,
						"cacheWrite": 0
					}
				},
				{
					"id": "MiniMaxAI/MiniMax-M2.5-TEE",
					"name": "MiniMaxAI/MiniMax-M2.5-TEE",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 196608,
					"maxTokens": 65536,
					"cost": {
						"input": .15,
						"output": 1.2,
						"cacheRead": .075,
						"cacheWrite": 0
					}
				},
				{
					"id": "Qwen/Qwen3.6-27B-TEE",
					"name": "Qwen/Qwen3.6-27B-TEE",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 65536,
					"cost": {
						"input": .3,
						"output": 2,
						"cacheRead": .029999999999999992,
						"cacheWrite": 0
					}
				},
				{
					"id": "Qwen/Qwen3.5-397B-A17B-TEE",
					"name": "Qwen/Qwen3.5-397B-A17B-TEE",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 262144,
					"maxTokens": 65536,
					"cost": {
						"input": .45,
						"output": 3,
						"cacheRead": .04499999999999999,
						"cacheWrite": 0
					},
					"status": "deprecated",
					"replacedBy": "Qwen/Qwen3.6-27B-TEE"
				}
			]
		} },
		"discovery": { "chutes": "refreshable" }
	}
};
//#endregion
//#region extensions/chutes/models.ts
/**
* Chutes model catalog, static model definitions, and dynamic model discovery.
*/
const CHUTES_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.chutes;
/** Base URL for Chutes OpenAI-compatible inference. */
const CHUTES_BASE_URL = CHUTES_MANIFEST_CATALOG.baseUrl;
const CHUTES_DEFAULT_CONTEXT_WINDOW = 128e3;
const CHUTES_DEFAULT_MAX_TOKENS = 4096;
function decorateChutesModelDefinition(model) {
	return {
		...model,
		compat: {
			...model.compat,
			supportsUsageInStreaming: false
		}
	};
}
/** Bundled fallback Chutes model catalog, normalized from the plugin manifest. */
const CHUTES_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "chutes",
	catalog: CHUTES_MANIFEST_CATALOG
}).models.map(decorateChutesModelDefinition);
const CACHE_TTL = 3e5;
function projectChutesModels(rows) {
	const seen = /* @__PURE__ */ new Set();
	const models = [];
	for (const row of rows) {
		if (!row || typeof row !== "object" || Array.isArray(row)) continue;
		const entry = row;
		const id = normalizeOptionalString(entry.id) ?? "";
		if (!id || seen.has(id)) continue;
		seen.add(id);
		const lowerId = normalizeLowercaseStringOrEmpty(id);
		models.push({
			id,
			name: id,
			reasoning: entry.supported_features?.includes("reasoning") || lowerId.includes("r1") || lowerId.includes("thinking") || lowerId.includes("reason") || lowerId.includes("tee"),
			input: (entry.input_modalities || ["text"]).filter((item) => item === "text" || item === "image"),
			cost: normalizeChutesModelPricing(entry.pricing) ?? {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: asPositiveSafeInteger(entry.context_length) ?? asPositiveSafeInteger(entry.max_model_len) ?? CHUTES_DEFAULT_CONTEXT_WINDOW,
			maxTokens: asPositiveSafeInteger(entry.max_output_length) ?? CHUTES_DEFAULT_MAX_TOKENS,
			compat: { supportsUsageInStreaming: false }
		});
	}
	return models;
}
async function discoverChutesModels(accessToken, options = {}) {
	return (await buildLiveModelProviderConfig({
		...options,
		providerId: "chutes",
		endpoint: `${CHUTES_BASE_URL}/models`,
		providerConfig: {
			baseUrl: CHUTES_BASE_URL,
			api: "openai-completions"
		},
		models: structuredClone(CHUTES_MODEL_CATALOG),
		discoveryApiKey: normalizeOptionalString(accessToken),
		timeoutMs: 1e4,
		ttlMs: CACHE_TTL,
		buildRequestHeaders: ({ discoveryApiKey }) => ({
			Accept: "application/json",
			...discoveryApiKey ? { Authorization: `Bearer ${discoveryApiKey}` } : {}
		}),
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(CHUTES_BASE_URL),
		auditContext: "chutes-model-discovery",
		fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params)),
		fallbackToAnonymousOnUnauthorized: true,
		projectRows: projectChutesModels
	})).models;
}
//#endregion
export { openclaw_plugin_default as i, CHUTES_MODEL_CATALOG as n, discoverChutesModels as r, CHUTES_BASE_URL as t };
