import "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/xai/openclaw.plugin.json
var modelCatalog = {
	"providers": { "xai": {
		"baseUrl": "https://api.x.ai/v1",
		"api": "openai-responses",
		"models": [
			{
				"id": "grok-4.7",
				"name": "Grok 4.7",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"contextWindow": 5e5,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.6",
				"name": "Grok 4.6",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .5,
					"cacheWrite": 0
				},
				"contextWindow": 5e5,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.5",
				"name": "Grok 4.5",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 2,
					"output": 6,
					"cacheRead": .3,
					"cacheWrite": 0
				},
				"contextWindow": 5e5,
				"maxTokens": 64e3
			},
			{
				"id": "grok-build-0.1",
				"name": "Grok Build 0.1",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 1,
					"output": 2,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 256e3,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.3",
				"name": "Grok 4.3",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 1.25,
					"output": 2.5,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 1e6,
				"maxTokens": 64e3
			},
			{
				"id": "grok-4.20-0309-reasoning",
				"name": "Grok 4.20 0309 (Reasoning)",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 1.25,
					"output": 2.5,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 1e6,
				"maxTokens": 3e4
			},
			{
				"id": "grok-4.20-0309-non-reasoning",
				"name": "Grok 4.20 0309 (Non-Reasoning)",
				"reasoning": false,
				"input": ["text", "image"],
				"cost": {
					"input": 1.25,
					"output": 2.5,
					"cacheRead": .2,
					"cacheWrite": 0
				},
				"contextWindow": 1e6,
				"maxTokens": 3e4
			}
		]
	} },
	"discovery": { "xai": "refreshable" },
	"suppressions": [
		{
			"provider": "xai",
			"model": "auto",
			"reason": "The xAI auto selector has retired; use a concrete model.",
			"retirement": { "replacedBy": "grok-4.7" },
			"when": { "baseUrlHosts": ["cli-chat-proxy.grok.com", "api.x.ai"] }
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-0309",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-latest",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-beta-latest",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-experimental-beta-0304",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-experimental-beta-latest",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		},
		{
			"provider": "xai",
			"model": "grok-4.20-multi-agent-beta-0309",
			"reason": "OpenClaw does not currently support xAI multi-agent models; choose another xAI model. See https://docs.openclaw.ai/providers/xai."
		}
	]
};
//#endregion
//#region extensions/xai/model-definitions.ts
const XAI_BASE_URL = modelCatalog.providers.xai.baseUrl;
const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
const XAI_IMAGE_MODELS = ["grok-imagine-image", "grok-imagine-image-quality"];
function isXaiModelInput(value) {
	return value === "text" || value === "image" || value === "video" || value === "audio";
}
function toXaiModelDefinition(model) {
	return {
		...model,
		input: model.input.filter(isXaiModelInput)
	};
}
modelCatalog.providers.xai.models.map(toXaiModelDefinition);
//#endregion
export { XAI_DEFAULT_IMAGE_MODEL as n, XAI_IMAGE_MODELS as r, XAI_BASE_URL as t };
