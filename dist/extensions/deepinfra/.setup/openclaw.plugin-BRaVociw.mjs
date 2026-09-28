//#region extensions/deepinfra/openclaw.plugin.json
var modelCatalog = {
	"modelsDev": { "deepinfra": "deepinfra" },
	"providers": { "deepinfra": {
		"baseUrl": "https://api.deepinfra.com/v1/openai",
		"api": "openai-completions",
		"models": [
			{
				"id": "deepseek-ai/DeepSeek-V4-Flash",
				"name": "DeepSeek V4 Flash",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 1048576,
				"maxTokens": 1048576,
				"cost": {
					"input": .09,
					"output": .18,
					"cacheRead": .018,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"codeMode": "capable"
				}
			},
			{
				"id": "deepseek-ai/DeepSeek-V4-Pro",
				"name": "DeepSeek V4 Pro",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 1048576,
				"maxTokens": 1048576,
				"cost": {
					"input": 1.3,
					"output": 2.6,
					"cacheRead": .1,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"codeMode": "capable"
				}
			},
			{
				"id": "zai-org/GLM-5.2",
				"name": "GLM-5.2",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 1048576,
				"maxTokens": 1048576,
				"cost": {
					"input": .4875,
					"output": 1.56,
					"cacheRead": .091000001625,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"codeMode": "capable"
				}
			},
			{
				"id": "stepfun-ai/Step-3.7-Flash",
				"name": "Step 3.7 Flash",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .2,
					"output": 1.15,
					"cacheRead": .04,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "moonshotai/Kimi-K2.7-Code",
				"name": "Kimi K2.7 Code",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .68,
					"output": 3.4,
					"cacheRead": .136,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "moonshotai/Kimi-K2.6",
				"name": "Kimi K2.6",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .75,
					"output": 3.5,
					"cacheRead": .15,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B",
				"name": "NVIDIA Nemotron 3 Ultra 550B A55B",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .5,
					"output": 2.2,
					"cacheRead": .1,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "nvidia/NVIDIA-Nemotron-3-Super-120B-A12B",
				"name": "NVIDIA Nemotron 3 Super 120B A12B",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .085,
					"output": .4,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "deepseek-ai/DeepSeek-V3.2",
				"name": "DeepSeek V3.2",
				"status": "deprecated",
				"replacedBy": "deepseek-ai/DeepSeek-V4-Pro",
				"reasoning": false,
				"input": ["text"],
				"contextWindow": 163840,
				"maxTokens": 163840,
				"cost": {
					"input": .26,
					"output": .38,
					"cacheRead": .13,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "zai-org/GLM-5.1",
				"name": "GLM-5.1",
				"status": "deprecated",
				"replacedBy": "zai-org/GLM-5.2",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 202752,
				"maxTokens": 202752,
				"cost": {
					"input": 1.05,
					"output": 3.5,
					"cacheRead": .205000005,
					"cacheWrite": 0
				},
				"compat": {
					"supportsUsageInStreaming": true,
					"codeMode": "capable"
				}
			},
			{
				"id": "stepfun-ai/Step-3.5-Flash",
				"name": "Step 3.5 Flash",
				"status": "deprecated",
				"replacedBy": "stepfun-ai/Step-3.7-Flash",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .09,
					"output": .3,
					"cacheRead": .0199999998,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			},
			{
				"id": "moonshotai/Kimi-K2.5",
				"name": "Kimi K2.5",
				"status": "deprecated",
				"replacedBy": "moonshotai/Kimi-K2.6",
				"reasoning": true,
				"input": ["text", "image"],
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .45,
					"output": 2.25,
					"cacheRead": .070000002,
					"cacheWrite": 0
				},
				"compat": { "supportsUsageInStreaming": true }
			}
		]
	} },
	"discovery": { "deepinfra": "refreshable" }
};
//#endregion
export { modelCatalog as t };
