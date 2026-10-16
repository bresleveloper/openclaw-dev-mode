import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/xiaomi/openclaw.plugin.json
var modelCatalog = {
	"modelsDev": {
		"xiaomi": "xiaomi",
		"xiaomi-token-plan": "xiaomi-token-plan-sgp"
	},
	"providers": {
		"xiaomi": {
			"baseUrl": "https://api.xiaomimimo.com/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "mimo-v2.6-pro",
					"name": "Xiaomi MiMo V2.6 Pro",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": .435,
						"output": .87,
						"cacheRead": .0036,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "mimo-v2.6-flash",
					"name": "Xiaomi MiMo V2.6 Flash",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": .14,
						"output": .28,
						"cacheRead": .0028,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "mimo-v2.6-pro-ultraspeed",
					"name": "Xiaomi MiMo V2.6 Pro UltraSpeed",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 4.35,
						"output": 8.7,
						"cacheRead": .036,
						"cacheWrite": 0
					}
				},
				{
					"id": "mimo-v2.5",
					"name": "Xiaomi MiMo V2.5",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": .14,
						"output": .28,
						"cacheRead": .0028,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "mimo-v2.5-pro",
					"name": "Xiaomi MiMo V2.5 Pro",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": .435,
						"output": .87,
						"cacheRead": .0036,
						"cacheWrite": 0
					}
				}
			]
		},
		"xiaomi-token-plan": {
			"baseUrl": "https://token-plan-sgp.xiaomimimo.com/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "mimo-v2.6-pro",
					"name": "Xiaomi MiMo V2.6 Pro",
					"input": ["text", "image"],
					"reasoning": true,
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
					"id": "mimo-v2.6-flash",
					"name": "Xiaomi MiMo V2.6 Flash",
					"input": ["text", "image"],
					"reasoning": true,
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
					"id": "mimo-v2.5-pro",
					"name": "Xiaomi MiMo V2.5 Pro",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				},
				{
					"id": "mimo-v2.5",
					"name": "Xiaomi MiMo V2.5",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": { "codeMode": "preferred" }
				}
			]
		}
	},
	"discovery": {
		"xiaomi": "refreshable",
		"xiaomi-token-plan": "refreshable"
	}
};
//#endregion
//#region extensions/xiaomi/provider-catalog.ts
const XIAOMI_PROVIDER_ID = "xiaomi";
const XIAOMI_TOKEN_PLAN_PROVIDER_ID = "xiaomi-token-plan";
const XIAOMI_DEFAULT_MODEL_ID = "mimo-v2.6-pro";
const XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID = "mimo-v2.6-pro";
const XIAOMI_TOKEN_PLAN_BASE_URLS = {
	ams: "https://token-plan-ams.xiaomimimo.com/v1",
	cn: "https://token-plan-cn.xiaomimimo.com/v1",
	sgp: "https://token-plan-sgp.xiaomimimo.com/v1"
};
function buildXiaomiProvider() {
	return buildManifestModelProviderConfig({
		providerId: XIAOMI_PROVIDER_ID,
		catalog: modelCatalog.providers.xiaomi
	});
}
function buildXiaomiTokenPlanProvider() {
	return buildManifestModelProviderConfig({
		providerId: XIAOMI_TOKEN_PLAN_PROVIDER_ID,
		catalog: modelCatalog.providers[XIAOMI_TOKEN_PLAN_PROVIDER_ID]
	});
}
function resolveXiaomiTokenPlanBaseUrl(region) {
	return XIAOMI_TOKEN_PLAN_BASE_URLS[region];
}
//#endregion
export { buildXiaomiProvider as a, XIAOMI_TOKEN_PLAN_PROVIDER_ID as i, XIAOMI_PROVIDER_ID as n, buildXiaomiTokenPlanProvider as o, XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID as r, resolveXiaomiTokenPlanBaseUrl as s, XIAOMI_DEFAULT_MODEL_ID as t };
