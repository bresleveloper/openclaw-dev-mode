import { buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/particle/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "particle",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["particle"],
	providerEndpoints: [{
		"endpointClass": "particle-native",
		"hosts": ["api.particle.ai"]
	}],
	setup: { "providers": [{
		"id": "particle",
		"envVars": ["PARTICLE_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "particle",
		"method": "api-key",
		"choiceId": "particle-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Particle API key",
		"groupId": "particle",
		"groupLabel": "Particle",
		"groupHint": "API key",
		"optionKey": "particleApiKey",
		"cliFlag": "--particle-api-key",
		"cliOption": "--particle-api-key <key>",
		"cliDescription": "Particle API key"
	}],
	modelCatalog: {
		"discovery": { "particle": "refreshable" },
		"providers": { "particle": {
			"baseUrl": "https://api.particle.ai/v1",
			"api": "openai-completions",
			"defaultModel": "particle-ai/particle-1",
			"models": [{
				"id": "particle-ai/particle-1",
				"name": "Particle-1",
				"reasoning": true,
				"thinkingLevelMap": {
					"xhigh": "high",
					"max": "max"
				},
				"input": ["text", "image"],
				"contextWindow": 1048576,
				"maxTokens": 131072,
				"cost": {
					"input": .25,
					"output": 1,
					"cacheRead": .03,
					"cacheWrite": 0
				},
				"compat": {
					"supportsDeveloperRole": true,
					"supportsReasoningEffort": true,
					"supportsUsageInStreaming": true,
					"supportsStrictMode": false,
					"supportsPromptCacheKey": true,
					"supportsLongCacheRetention": false,
					"maxTokensField": "max_tokens",
					"reasoningEffortMap": {
						"off": "none",
						"none": "none",
						"minimal": "low",
						"low": "low",
						"medium": "high",
						"high": "high",
						"xhigh": "high",
						"max": "max"
					},
					"supportedReasoningEfforts": [
						"none",
						"low",
						"high",
						"max"
					],
					"thinkingFormat": "openai",
					"defaultThinkingLevel": "high"
				}
			}]
		} }
	},
	modelIdNormalization: { "providers": { "particle": { "aliases": { "particle-1": "particle-ai/particle-1" } } } },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/particle/onboard.ts
const defaultModelRef = readManifestProviderDefaultModelRef(openclaw_plugin_default, "particle");
const { applyConfig: applyParticleConfig } = createProviderConnectionPresetAppliers({
	primaryModelRef: defaultModelRef,
	resolveParams: () => {
		const provider = buildManifestModelProviderConfig({
			providerId: "particle",
			catalog: openclaw_plugin_default.modelCatalog.providers.particle
		});
		return {
			providerId: "particle",
			api: "openai-completions",
			baseUrl: provider.baseUrl,
			catalogModels: () => provider.models,
			aliases: [{
				modelRef: defaultModelRef,
				alias: "Particle-1"
			}]
		};
	}
});
//#endregion
export { openclaw_plugin_default as n, applyParticleConfig as t };
