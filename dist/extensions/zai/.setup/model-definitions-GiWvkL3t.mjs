import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/zai/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "zai",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["zai"],
	providerEndpoints: [{
		"endpointClass": "zai-native",
		"hosts": ["api.z.ai", "open.bigmodel.cn"]
	}],
	providerRequest: { "providers": { "zai": { "family": "zai" } } },
	setup: { "providers": [{
		"id": "zai",
		"authMethods": ["api-key"],
		"envVars": ["ZAI_API_KEY", "Z_AI_API_KEY"]
	}] },
	modelCatalog: {
		"modelsDev": { "zai": "zai" },
		"providers": { "zai": {
			"baseUrl": "https://api.z.ai/api/paas/v4",
			"api": "openai-completions",
			"defaultModel": "glm-5.2",
			"models": [
				{
					"id": "glm-5.3",
					"name": "GLM-5.3",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "glm-5.3-flash",
					"name": "GLM-5.3-Flash",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": .15,
						"output": .5,
						"cacheRead": .03,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "glm-5.2",
					"name": "GLM-5.2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"cost": {
						"input": 1.4,
						"output": 4.4,
						"cacheRead": .26,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "glm-5-turbo",
					"name": "GLM-5-Turbo",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 2e5,
					"maxTokens": 131072,
					"cost": {
						"input": 1.2,
						"output": 4,
						"cacheRead": .24,
						"cacheWrite": 0
					}
				},
				{
					"id": "glm-5v-turbo",
					"name": "GLM-5V-Turbo",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 2e5,
					"maxTokens": 131072,
					"cost": {
						"input": 1.2,
						"output": 4,
						"cacheRead": .24,
						"cacheWrite": 0
					}
				},
				{
					"id": "glm-5.1",
					"name": "GLM-5.1",
					"status": "deprecated",
					"replacedBy": "glm-5.2",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 2e5,
					"maxTokens": 131072,
					"cost": {
						"input": 1.4,
						"output": 4.4,
						"cacheRead": .26,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				}
			]
		} },
		"aliases": {
			"z.ai": { "provider": "zai" },
			"z-ai": { "provider": "zai" }
		},
		"discovery": { "zai": "refreshable" }
	},
	modelPricing: { "providers": { "zai": {
		"openRouter": { "provider": "z-ai" },
		"liteLLM": { "provider": "zai" }
	} } },
	providerAuthChoices: [
		{
			"provider": "zai",
			"method": "api-key",
			"choiceId": "zai-api-key",
			"appGuidedSecret": true,
			"choiceLabel": "Z.AI API key",
			"groupId": "zai",
			"groupLabel": "Z.AI",
			"groupHint": "GLM Coding Plan / Global / CN",
			"optionKey": "zaiApiKey",
			"cliFlag": "--zai-api-key",
			"cliOption": "--zai-api-key <key>",
			"cliDescription": "Z.AI API key"
		},
		{
			"provider": "zai",
			"method": "coding-global",
			"choiceId": "zai-coding-global",
			"appGuidedSecret": true,
			"choiceLabel": "Coding-Plan-Global",
			"choiceHint": "GLM Coding Plan Global (api.z.ai)",
			"groupId": "zai",
			"groupLabel": "Z.AI",
			"groupHint": "GLM Coding Plan / Global / CN",
			"optionKey": "zaiApiKey",
			"cliFlag": "--zai-api-key",
			"cliOption": "--zai-api-key <key>",
			"cliDescription": "Z.AI API key"
		},
		{
			"provider": "zai",
			"method": "coding-cn",
			"choiceId": "zai-coding-cn",
			"appGuidedSecret": true,
			"choiceLabel": "Coding-Plan-CN",
			"choiceHint": "GLM Coding Plan CN (open.bigmodel.cn)",
			"groupId": "zai",
			"groupLabel": "Z.AI",
			"groupHint": "GLM Coding Plan / Global / CN",
			"optionKey": "zaiApiKey",
			"cliFlag": "--zai-api-key",
			"cliOption": "--zai-api-key <key>",
			"cliDescription": "Z.AI API key"
		},
		{
			"provider": "zai",
			"method": "global",
			"choiceId": "zai-global",
			"appGuidedSecret": true,
			"choiceLabel": "Global",
			"choiceHint": "Z.AI Global (api.z.ai)",
			"groupId": "zai",
			"groupLabel": "Z.AI",
			"groupHint": "GLM Coding Plan / Global / CN",
			"optionKey": "zaiApiKey",
			"cliFlag": "--zai-api-key",
			"cliOption": "--zai-api-key <key>",
			"cliDescription": "Z.AI API key"
		},
		{
			"provider": "zai",
			"method": "cn",
			"choiceId": "zai-cn",
			"appGuidedSecret": true,
			"choiceLabel": "CN",
			"choiceHint": "Z.AI CN (open.bigmodel.cn)",
			"groupId": "zai",
			"groupLabel": "Z.AI",
			"groupHint": "GLM Coding Plan / Global / CN",
			"optionKey": "zaiApiKey",
			"cliFlag": "--zai-api-key",
			"cliOption": "--zai-api-key <key>",
			"cliDescription": "Z.AI API key"
		}
	],
	contracts: {
		"mediaUnderstandingProviders": ["zai"],
		"usageProviders": ["zai"]
	},
	mediaUnderstandingProviderMetadata: { "zai": {
		"capabilities": ["image"],
		"defaultModels": { "image": "glm-4.6v" },
		"autoPriority": { "image": 60 }
	} },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/zai/model-definitions.ts
const ZAI_CODING_GLOBAL_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
const ZAI_CODING_CN_BASE_URL = "https://open.bigmodel.cn/api/coding/paas/v4";
const ZAI_GLOBAL_BASE_URL = "https://api.z.ai/api/paas/v4";
const ZAI_CN_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const ZAI_DEFAULT_MODEL_ID = openclaw_plugin_default.modelCatalog.providers.zai.defaultModel;
const ZAI_CODING_DEFAULT_MODEL_ID = "glm-5.3";
const ZAI_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.zai;
const ZAI_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "zai",
	catalog: ZAI_MANIFEST_CATALOG
});
const ZAI_MODEL_CATALOG = new Map(ZAI_MANIFEST_PROVIDER.models.map((model) => [model.id, model]));
const ZAI_DEFAULT_COST = ZAI_MODEL_CATALOG.get("glm-5")?.cost ?? {
	input: 1,
	output: 3.2,
	cacheRead: .2,
	cacheWrite: 0
};
function resolveZaiBaseUrl(endpoint) {
	switch (endpoint) {
		case "coding-cn": return ZAI_CODING_CN_BASE_URL;
		case "global": return ZAI_GLOBAL_BASE_URL;
		case "cn": return ZAI_CN_BASE_URL;
		case "coding-global": return ZAI_CODING_GLOBAL_BASE_URL;
		default: return ZAI_GLOBAL_BASE_URL;
	}
}
function buildZaiCatalogModels() {
	return ZAI_MANIFEST_PROVIDER.models.map((model) => Object.assign({}, model, { input: [...model.input] }));
}
function buildZaiModelDefinition(params) {
	const catalog = ZAI_MODEL_CATALOG.get(params.id);
	return {
		id: params.id,
		name: params.name ?? catalog?.name ?? `GLM ${params.id}`,
		reasoning: params.reasoning ?? catalog?.reasoning ?? true,
		input: params.input ?? (catalog?.input ? [...catalog.input] : ["text"]),
		cost: params.cost ?? catalog?.cost ?? ZAI_DEFAULT_COST,
		contextWindow: params.contextWindow ?? catalog?.contextWindow ?? 202800,
		maxTokens: params.maxTokens ?? catalog?.maxTokens ?? 131100
	};
}
//#endregion
export { ZAI_DEFAULT_COST as a, buildZaiCatalogModels as c, openclaw_plugin_default as d, ZAI_CODING_GLOBAL_BASE_URL as i, buildZaiModelDefinition as l, ZAI_CODING_CN_BASE_URL as n, ZAI_DEFAULT_MODEL_ID as o, ZAI_CODING_DEFAULT_MODEL_ID as r, ZAI_GLOBAL_BASE_URL as s, ZAI_CN_BASE_URL as t, resolveZaiBaseUrl as u };
