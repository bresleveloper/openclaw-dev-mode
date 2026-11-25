import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
import { buildProviderStreamFamilyHooks } from "openclaw/plugin-sdk/provider-stream-family";
import { asOptionalObjectRecord, asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/cohere/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "cohere",
	categories: ["models"],
	name: "Cohere",
	description: "OpenClaw Cohere provider plugin.",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["cohere"],
	modelCatalog: {
		"modelsDev": { "cohere": "cohere" },
		"providers": { "cohere": {
			"baseUrl": "https://api.cohere.ai/compatibility/v1",
			"api": "openai-completions",
			"defaultModel": "command-a-plus-05-2026",
			"family": "cohere",
			"models": [
				{
					"id": "command-a-plus-05-2026",
					"name": "Command A+",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 128e3,
					"maxTokens": 64e3,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": false,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["none", "high"],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"minimal": "high",
							"low": "high",
							"medium": "high",
							"high": "high",
							"xhigh": "high",
							"adaptive": "high",
							"max": "high"
						},
						"maxTokensField": "max_tokens"
					}
				},
				{
					"id": "command-a-03-2025",
					"name": "Command A",
					"status": "deprecated",
					"replacedBy": "command-a-plus-05-2026",
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 8e3,
					"cost": {
						"input": 2.5,
						"output": 10,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": false,
						"maxTokensField": "max_tokens"
					}
				},
				{
					"id": "command-a-reasoning-08-2025",
					"name": "Command A Reasoning",
					"status": "deprecated",
					"replacedBy": "command-a-plus-05-2026",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 32e3,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": false,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["none", "high"],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"minimal": "high",
							"low": "high",
							"medium": "high",
							"high": "high",
							"xhigh": "high",
							"adaptive": "high",
							"max": "high"
						},
						"maxTokensField": "max_tokens"
					}
				},
				{
					"id": "command-a-vision-07-2025",
					"name": "Command A Vision",
					"status": "deprecated",
					"replacedBy": "command-a-plus-05-2026",
					"reasoning": false,
					"input": ["text", "image"],
					"contextWindow": 128e3,
					"maxTokens": 8e3,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": false,
						"supportsTools": false,
						"maxTokensField": "max_tokens"
					}
				},
				{
					"id": "north-mini-code-1-0",
					"name": "North Mini Code 1.0",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 256e3,
					"maxTokens": 64e3,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsUsageInStreaming": false,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["none", "high"],
						"reasoningEffortMap": {
							"off": "none",
							"none": "none",
							"minimal": "high",
							"low": "high",
							"medium": "high",
							"high": "high",
							"xhigh": "high",
							"adaptive": "high",
							"max": "high"
						},
						"maxTokensField": "max_tokens"
					}
				}
			]
		} },
		"discovery": { "cohere": "refreshable" }
	},
	setup: { "providers": [{
		"id": "cohere",
		"envVars": ["COHERE_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "cohere",
		"method": "api-key",
		"choiceId": "cohere-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Cohere API key",
		"groupId": "cohere",
		"groupLabel": "Cohere",
		"groupHint": "OpenAI-compatible inference",
		"optionKey": "cohereApiKey",
		"cliFlag": "--cohere-api-key",
		"cliOption": "--cohere-api-key <key>",
		"cliDescription": "Cohere API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
// extensions/cohere/index.ts
const COHERE_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.cohere;
const COHERE_BASE_URL = COHERE_MANIFEST_CATALOG.baseUrl;
const COHERE_MODERN_MODEL_IDS = /* @__PURE__ */ new Set([
	"command-a-plus-05-2026",
	"command-a-reasoning-08-2025",
	"north-mini-code-1-0"
]);
function buildCohereCatalogModels() {
	return buildManifestModelProviderConfig({
		providerId: "cohere",
		catalog: COHERE_MANIFEST_CATALOG
	}).models;
}
const COHERE_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "cohere");
const { applyConfig } = createProviderConnectionPresetAppliers({
	primaryModelRef: COHERE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "cohere",
		api: "openai-completions",
		baseUrl: COHERE_BASE_URL,
		catalogModels: buildCohereCatalogModels,
		aliases: [{
			modelRef: COHERE_DEFAULT_MODEL_REF,
			alias: "Cohere Command A+"
		}]
	})
});
const cohereStreamHooks = buildProviderStreamFamilyHooks("cohere-compatibility");
var cohere_default = defineSingleProviderPluginEntry({
	id: "cohere",
	name: "Cohere Provider",
	description: "Cohere provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Cohere",
		docsPath: "/providers/cohere",
		manifestAuth: { applyConfig },
		catalog: {
			discoveryMode: "strict",
			liveModelDiscovery: {
				endpointUrl: {
					url: "https://api.cohere.com/v1/models?endpoint=chat&page_size=1000",
					requireBaseUrl: COHERE_BASE_URL
				},
				readRows: (body) => {
					const models = asOptionalObjectRecord(body)?.models;
					if (!Array.isArray(models)) throw new Error("Cohere model catalog response must contain models[]");
					return models.flatMap((row) => {
						const record = asOptionalRecord(row);
						const modelId = normalizeOptionalString(record?.name);
						return modelId ? [{
							...record,
							id: modelId,
							active: record?.is_deprecated !== true
						}] : [];
					});
				}
			}
		},
		wrapStreamFn: cohereStreamHooks.wrapStreamFn,
		wrapSimpleCompletionStreamFn: cohereStreamHooks.wrapStreamFn,
		isModernModelRef: ({ modelId }) => COHERE_MODERN_MODEL_IDS.has(modelId.trim().toLowerCase())
	}
});
export { cohere_default as default };
