import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/featherless/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "featherless",
	categories: ["models"],
	name: "Featherless AI",
	description: "OpenClaw Featherless AI provider plugin.",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["featherless"],
	providerRequest: { "providers": { "featherless": { "family": "featherless" } } },
	setup: { "providers": [{
		"id": "featherless",
		"envVars": ["FEATHERLESS_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "featherless",
		"method": "api-key",
		"choiceId": "featherless-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Featherless AI API key",
		"choiceHint": "OpenAI-compatible access to open models",
		"groupId": "featherless",
		"groupLabel": "Featherless AI",
		"groupHint": "OpenAI-compatible access to open models",
		"optionKey": "featherlessApiKey",
		"cliFlag": "--featherless-api-key",
		"cliOption": "--featherless-api-key <key>",
		"cliDescription": "Featherless AI API key"
	}],
	modelCatalog: {
		"providers": { "featherless": {
			"baseUrl": "https://api.featherless.ai/v1",
			"api": "openai-completions",
			"models": [{
				"id": "Qwen/Qwen3-32B",
				"name": "Qwen3 32B",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 32768,
				"maxTokens": 4096,
				"cost": {
					"input": .102,
					"output": .493,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"compat": {
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsReasoningEffort": false,
					"supportsUsageInStreaming": false,
					"maxTokensField": "max_tokens",
					"thinkingFormat": "qwen-chat-template",
					"supportsStrictMode": false
				}
			}]
		} },
		"discovery": { "featherless": "refreshable" }
	},
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/featherless/models.ts
const FEATHERLESS_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "featherless",
	catalog: openclaw_plugin_default.modelCatalog.providers.featherless
});
const FEATHERLESS_BASE_URL = FEATHERLESS_MANIFEST_PROVIDER.baseUrl;
const FEATHERLESS_DEFAULT_MODEL_ID = "Qwen/Qwen3-32B";
const FEATHERLESS_DEFAULT_MODEL_REF = `featherless/${FEATHERLESS_DEFAULT_MODEL_ID}`;
const FEATHERLESS_DYNAMIC_CONTEXT_WINDOW = 4096;
const FEATHERLESS_DYNAMIC_MAX_TOKENS = 1024;
function requireFeatherlessManifestModel(id) {
	const model = FEATHERLESS_MANIFEST_PROVIDER.models.find((entry) => entry.id === id);
	if (!model) throw new Error(`Missing Featherless modelCatalog row ${id}`);
	return model;
}
const FEATHERLESS_DEFAULT_MODEL = requireFeatherlessManifestModel(FEATHERLESS_DEFAULT_MODEL_ID);
const FEATHERLESS_DEFAULT_CONTEXT_WINDOW = FEATHERLESS_DEFAULT_MODEL.contextWindow;
const FEATHERLESS_DEFAULT_MAX_TOKENS = FEATHERLESS_DEFAULT_MODEL.maxTokens;
const FEATHERLESS_DYNAMIC_COMPAT = {
	...FEATHERLESS_DEFAULT_MODEL.compat,
	thinkingFormat: "openai"
};
function isFeatherlessCatalogModelId(modelId) {
	return FEATHERLESS_MANIFEST_PROVIDER.models.some((model) => model.id === modelId);
}
function buildFeatherlessCatalogModels() {
	return FEATHERLESS_MANIFEST_PROVIDER.models.map((model) => structuredClone(model));
}
//#endregion
export { FEATHERLESS_DEFAULT_MODEL_REF as a, FEATHERLESS_DYNAMIC_MAX_TOKENS as c, openclaw_plugin_default as d, FEATHERLESS_DEFAULT_MODEL_ID as i, buildFeatherlessCatalogModels as l, FEATHERLESS_DEFAULT_CONTEXT_WINDOW as n, FEATHERLESS_DYNAMIC_COMPAT as o, FEATHERLESS_DEFAULT_MAX_TOKENS as r, FEATHERLESS_DYNAMIC_CONTEXT_WINDOW as s, FEATHERLESS_BASE_URL as t, isFeatherlessCatalogModelId as u };
