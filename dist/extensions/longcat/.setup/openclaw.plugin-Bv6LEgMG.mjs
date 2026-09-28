//#region extensions/longcat/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "longcat",
	categories: ["models"],
	name: "LongCat",
	description: "OpenClaw LongCat provider plugin.",
	doctorContract: { "configRepair": true },
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["longcat"],
	providerRequest: { "providers": { "longcat": { "family": "longcat" } } },
	modelCatalog: {
		"modelsDev": { "longcat": "longcat" },
		"providers": { "longcat": {
			"baseUrl": "https://api.longcat.chat/openai",
			"api": "openai-completions",
			"models": [{
				"id": "LongCat-2.0",
				"name": "LongCat 2.0",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 1048576,
				"maxTokens": 131072,
				"cost": {
					"input": .75,
					"output": 2.95,
					"cacheRead": .015,
					"cacheWrite": 0
				},
				"compat": {
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsReasoningEffort": false,
					"supportsUsageInStreaming": false,
					"supportsStrictMode": false,
					"maxTokensField": "max_tokens",
					"requiresReasoningContentOnAssistantMessages": true,
					"thinkingFormat": "deepseek"
				}
			}]
		} },
		"discovery": { "longcat": "refreshable" }
	},
	setup: { "providers": [{
		"id": "longcat",
		"envVars": ["LONGCAT_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "longcat",
		"method": "api-key",
		"choiceId": "longcat-api-key",
		"choiceLabel": "LongCat API key",
		"groupId": "longcat",
		"groupLabel": "LongCat",
		"groupHint": "API key",
		"optionKey": "longcatApiKey",
		"cliFlag": "--longcat-api-key",
		"cliOption": "--longcat-api-key <key>",
		"cliDescription": "LongCat API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
export { openclaw_plugin_default as t };
