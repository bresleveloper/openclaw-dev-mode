//#region extensions/openai/openclaw.plugin.json
var modelCatalog = {
	"modelsDev": { "openai": "openai" },
	"providers": { "openai": {
		"baseUrl": "https://api.openai.com/v1",
		"api": "openai-responses",
		"defaultUtilityModel": "gpt-5.6-luna",
		"models": [
			{
				"id": "gpt-daybreak-blue-latest",
				"name": "Daybreak Blue",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"thinkingLevelMap": {
					"off": null,
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false
				}
			},
			{
				"id": "gpt-daybreak-red-latest",
				"name": "Daybreak Red",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"thinkingLevelMap": {
					"off": "none",
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false
				}
			},
			{
				"id": "gpt-6-astra",
				"name": "GPT-6 Astra",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 10,
					"output": 50,
					"cacheRead": 1,
					"cacheWrite": 12.5,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": 10,
						"output": 50,
						"cacheRead": 1,
						"cacheWrite": 12.5
					}, {
						"range": [272001],
						"input": 20,
						"output": 75,
						"cacheRead": 2,
						"cacheWrite": 25
					}]
				},
				"thinkingLevelMap": {
					"off": null,
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-6.1-sol",
				"name": "GPT-6.1 Sol",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 2,
					"output": 10,
					"cacheRead": .1,
					"cacheWrite": 2.5,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": 2,
						"output": 10,
						"cacheRead": .1,
						"cacheWrite": 2.5
					}, {
						"range": [272001],
						"input": 4,
						"output": 15,
						"cacheRead": .2,
						"cacheWrite": 5
					}]
				},
				"thinkingLevelMap": {
					"off": null,
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-6-sol",
				"name": "GPT-6 Sol",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 2,
					"output": 10,
					"cacheRead": .2,
					"cacheWrite": 2.5,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": 2,
						"output": 10,
						"cacheRead": .2,
						"cacheWrite": 2.5
					}, {
						"range": [272001],
						"input": 4,
						"output": 15,
						"cacheRead": .4,
						"cacheWrite": 5
					}]
				},
				"thinkingLevelMap": {
					"off": "none",
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-6-luna",
				"name": "GPT-6 Luna",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": .1,
					"output": .5,
					"cacheRead": .01,
					"cacheWrite": .125,
					"tieredPricing": [{
						"range": [0, 272001],
						"input": .1,
						"output": .5,
						"cacheRead": .01,
						"cacheWrite": .125
					}, {
						"range": [272001],
						"input": .2,
						"output": .75,
						"cacheRead": .02,
						"cacheWrite": .25
					}]
				},
				"thinkingLevelMap": {
					"off": "none",
					"minimal": "low",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.6-sol",
				"name": "GPT-5.6 Sol",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 30,
					"cacheRead": .5,
					"cacheWrite": 6.25
				},
				"thinkingLevelMap": {
					"off": "none",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.6-terra",
				"name": "GPT-5.6 Terra",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 2.5,
					"output": 15,
					"cacheRead": .25,
					"cacheWrite": 3.125
				},
				"thinkingLevelMap": {
					"off": "none",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.6-luna",
				"name": "GPT-5.6 Luna",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 1,
					"output": 6,
					"cacheRead": .1,
					"cacheWrite": 1.25
				},
				"thinkingLevelMap": {
					"off": "none",
					"xhigh": "xhigh",
					"max": "max"
				},
				"compat": {
					"supportsReasoningEffort": true,
					"supportedReasoningEfforts": [
						"none",
						"low",
						"medium",
						"high",
						"xhigh",
						"max"
					],
					"supportsTemperature": false,
					"codeMode": "preferred"
				}
			},
			{
				"id": "gpt-5.5",
				"name": "GPT-5.5",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-sol",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 6e3,
					"preferredSidePx": 2048,
					"tokenMode": "detail"
				} },
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 5,
					"output": 30,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gpt-5.5-pro",
				"name": "gpt-5.5-pro",
				"status": "deprecated",
				"replacedBy": "gpt-5.6-sol",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 6e3,
					"preferredSidePx": 2048,
					"tokenMode": "detail"
				} },
				"contextWindow": 105e4,
				"contextTokens": 272e3,
				"maxTokens": 128e3,
				"cost": {
					"input": 30,
					"output": 180,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gpt-5.4",
				"name": "GPT-5.4",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"maxTokens": 128e3,
				"cost": {
					"input": 2.5,
					"output": 15,
					"cacheRead": .25,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4-pro",
				"name": "GPT-5.4 Pro",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 105e4,
				"maxTokens": 128e3,
				"cost": {
					"input": 30,
					"output": 180,
					"cacheRead": 0,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4-mini",
				"name": "GPT-5.4 Mini",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"maxTokens": 128e3,
				"cost": {
					"input": .75,
					"output": 4.5,
					"cacheRead": .075,
					"cacheWrite": 0
				}
			},
			{
				"id": "gpt-5.4-nano",
				"name": "GPT-5.4 Nano",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 4e5,
				"maxTokens": 128e3,
				"cost": {
					"input": .2,
					"output": 1.25,
					"cacheRead": .02,
					"cacheWrite": 0
				}
			}
		]
	} },
	"aliases": { "azure-openai-responses": {
		"provider": "openai",
		"api": "azure-openai-responses"
	} },
	"discovery": { "openai": "runtime" },
	"suppressions": [
		{
			"provider": "openai",
			"model": "gpt-5.4",
			"reason": "GPT-5.4 has retired from the ChatGPT-account Codex route.",
			"retirement": { "replacedBy": "gpt-5.6-terra" },
			"when": { "baseUrlHosts": ["chatgpt.com"] }
		},
		{
			"provider": "openai",
			"model": "gpt-5.4-mini",
			"reason": "GPT-5.4 Mini has retired from the ChatGPT-account Codex route.",
			"retirement": { "replacedBy": "gpt-5.6-luna" },
			"when": { "baseUrlHosts": ["chatgpt.com"] }
		},
		{
			"provider": "openai",
			"model": "gpt-5.3-codex-spark",
			"reason": "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; OpenAI API-key auth cannot use this model.",
			"when": { "baseUrlHosts": ["api.openai.com"] }
		},
		{
			"provider": "azure-openai-responses",
			"model": "gpt-5.3-codex-spark",
			"reason": "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; Azure/OpenAI API-key auth cannot use this model."
		}
	]
};
//#endregion
export { modelCatalog as t };
