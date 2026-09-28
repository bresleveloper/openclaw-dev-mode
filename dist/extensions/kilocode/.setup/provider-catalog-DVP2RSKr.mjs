import { KILOCODE_BASE_URL, discoverKilocodeModels } from "../provider-models.js";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/kilocode/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "kilocode",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["kilocode"],
	modelPricing: { "providers": { "kilocode": {
		"openRouter": { "passthroughProviderModel": true },
		"liteLLM": { "passthroughProviderModel": true }
	} } },
	setup: { "providers": [{
		"id": "kilocode",
		"envVars": ["KILOCODE_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "kilocode",
		"method": "api-key",
		"choiceId": "kilocode-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Kilo Gateway API key",
		"choiceHint": "API key (OpenRouter-compatible)",
		"groupId": "kilocode",
		"groupLabel": "Kilo Gateway",
		"groupHint": "API key (OpenRouter-compatible)",
		"optionKey": "kilocodeApiKey",
		"cliFlag": "--kilocode-api-key",
		"cliOption": "--kilocode-api-key <key>",
		"cliDescription": "Kilo Gateway API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	},
	modelCatalog: {
		"modelsDev": { "kilocode": "kilo" },
		"providers": { "kilocode": {
			"baseUrl": "https://api.kilo.ai/api/gateway/",
			"api": "openai-completions",
			"models": [{
				"id": "kilo-auto/balanced",
				"name": "Auto Balanced",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": .325,
					"output": 1.95,
					"cacheRead": .0325,
					"cacheWrite": .40625
				},
				"contextWindow": 1e6,
				"maxTokens": 65536
			}]
		} },
		"discovery": { "kilocode": "refreshable" }
	}
};
//#endregion
//#region extensions/kilocode/provider-catalog.ts
function buildKilocodeProvider() {
	return buildManifestModelProviderConfig({
		providerId: "kilocode",
		catalog: openclaw_plugin_default.modelCatalog.providers.kilocode
	});
}
async function buildKilocodeProviderWithDiscovery(options = {}) {
	const models = await discoverKilocodeModels(options);
	return {
		baseUrl: KILOCODE_BASE_URL,
		api: "openai-completions",
		models
	};
}
//#endregion
export { buildKilocodeProviderWithDiscovery as n, openclaw_plugin_default as r, buildKilocodeProvider as t };
