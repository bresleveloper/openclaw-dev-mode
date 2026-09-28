import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import { normalizeOpenRouterModelPricing } from "openclaw/plugin-sdk/model-catalog-pricing";
import { asOptionalRecord, asPositiveSafeInteger, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/cerebras/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "cerebras",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["cerebras"],
	modelPricing: { "providers": { "cerebras": { "cerebras": { "provider": "cerebras" } } } },
	providerEndpoints: [{
		"endpointClass": "cerebras-native",
		"hosts": ["api.cerebras.ai"]
	}],
	providerRequest: { "providers": { "cerebras": { "family": "cerebras" } } },
	modelCatalog: {
		"modelsDev": { "cerebras": "cerebras" },
		"providers": { "cerebras": {
			"baseUrl": "https://api.cerebras.ai/v1",
			"api": "openai-completions",
			"defaultModel": "gemma-4-31b",
			"models": [
				{
					"id": "zai-glm-4.7",
					"name": "Z.ai GLM 4.7",
					"status": "deprecated",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 131072,
					"maxTokens": 40960,
					"cost": {
						"input": 2.25,
						"output": 2.75,
						"cacheRead": 2.25,
						"cacheWrite": 2.75
					}
				},
				{
					"id": "gpt-oss-120b",
					"name": "GPT OSS 120B",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 131072,
					"maxTokens": 40960,
					"cost": {
						"input": .35,
						"output": .75,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				},
				{
					"id": "gemma-4-31b",
					"name": "Gemma 4 31B",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 131072,
					"maxTokens": 40960,
					"cost": {
						"input": .99,
						"output": 1.49,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				}
			]
		} },
		"discovery": { "cerebras": "refreshable" }
	},
	setup: { "providers": [{
		"id": "cerebras",
		"envVars": ["CEREBRAS_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "cerebras",
		"method": "api-key",
		"choiceId": "cerebras-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Cerebras API key",
		"groupId": "cerebras",
		"groupLabel": "Cerebras",
		"groupHint": "Fast OpenAI-compatible inference",
		"optionKey": "cerebrasApiKey",
		"cliFlag": "--cerebras-api-key",
		"cliOption": "--cerebras-api-key <key>",
		"cliDescription": "Cerebras API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/cerebras/provider-catalog.ts
/**
* Cerebras model provider builder.
*/
function projectCerebrasModels(rows, fallback) {
	const seeds = new Map(fallback.models.map((model) => [model.id, model]));
	const models = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const record = asOptionalRecord(row);
		const id = normalizeOptionalString(record?.id);
		const limits = asOptionalRecord(record?.limits);
		const contextWindow = asPositiveSafeInteger(limits?.max_context_length);
		const maxTokens = asPositiveSafeInteger(limits?.max_completion_tokens);
		if (!record || !id || id.length > 512 || /[\s\p{Cc}]/u.test(id) || record.object !== void 0 && record.object !== "model" || record.deprecated === true || !contextWindow || !maxTokens) continue;
		const seed = seeds.get(id);
		const capabilities = asOptionalRecord(record.capabilities);
		models.set(id, {
			...seed,
			id,
			name: normalizeOptionalString(record.name) ?? id,
			reasoning: capabilities?.reasoning === true,
			input: capabilities?.vision === true ? ["text", "image"] : ["text"],
			contextWindow,
			maxTokens,
			cost: normalizeOpenRouterModelPricing(record.pricing) ?? {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			compat: {
				...seed?.compat,
				...typeof capabilities?.tools === "boolean" ? { supportsTools: capabilities.tools } : {}
			}
		});
	}
	return [...models.values()].toSorted((left, right) => left.id.localeCompare(right.id));
}
const CEREBRAS_MODEL_DISCOVERY = {
	endpointUrl: {
		url: "https://api.cerebras.ai/public/v1/models",
		requireBaseUrl: openclaw_plugin_default.modelCatalog.providers.cerebras.baseUrl
	},
	authentication: "none",
	projectRows: projectCerebrasModels
};
/** Builds the Cerebras OpenAI-compatible model provider config. */
function buildCerebrasProvider() {
	return buildManifestModelProviderConfig({
		providerId: "cerebras",
		catalog: openclaw_plugin_default.modelCatalog.providers.cerebras
	});
}
//#endregion
export { buildCerebrasProvider as n, openclaw_plugin_default as r, CEREBRAS_MODEL_DISCOVERY as t };
