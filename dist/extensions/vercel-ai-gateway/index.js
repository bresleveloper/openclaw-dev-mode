import { VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF, applyVercelAiGatewayConfig } from "./onboard.js";
import { resolveVercelAiGatewayThinkingProfile } from "./thinking.js";
import { buildStaticVercelAiGatewayProvider, buildVercelAiGatewayProvider, resolveVercelAiGatewayModel } from "./provider-catalog.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
var vercel_ai_gateway_default = defineSingleProviderPluginEntry({
	id: "vercel-ai-gateway",
	name: "Vercel AI Gateway Provider",
	description: "Bundled Vercel AI Gateway provider plugin",
	manifest: {
		id: "vercel-ai-gateway",
		categories: ["models"],
		activation: { "onStartup": false },
		enabledByDefault: true,
		providers: ["vercel-ai-gateway"],
		modelCatalog: { "discovery": { "vercel-ai-gateway": "refreshable" } },
		modelIdNormalization: { "providers": { "vercel-ai-gateway": {
			"aliases": {
				"opus-4.6": "claude-opus-4-6",
				"sonnet-4.6": "claude-sonnet-4-6"
			},
			"prefixWhenBareAfterAliasStartsWith": [{
				"modelPrefix": "claude-",
				"prefix": "anthropic"
			}]
		} } },
		modelPricing: { "providers": { "vercel-ai-gateway": {
			"openRouter": { "passthroughProviderModel": true },
			"liteLLM": { "passthroughProviderModel": true }
		} } },
		setup: { "providers": [{
			"id": "vercel-ai-gateway",
			"envVars": ["AI_GATEWAY_API_KEY"]
		}] },
		providerAuthChoices: [{
			"provider": "vercel-ai-gateway",
			"method": "api-key",
			"choiceId": "ai-gateway-api-key",
			"appGuidedSecret": true,
			"choiceLabel": "Vercel AI Gateway API key",
			"groupId": "ai-gateway",
			"groupLabel": "Vercel AI Gateway",
			"groupHint": "API key",
			"optionKey": "aiGatewayApiKey",
			"cliFlag": "--ai-gateway-api-key",
			"cliOption": "--ai-gateway-api-key <key>",
			"cliDescription": "Vercel AI Gateway API key"
		}],
		configSchema: {
			"type": "object",
			"additionalProperties": false,
			"properties": {}
		}
	},
	provider: {
		label: "Vercel AI Gateway",
		docsPath: "/providers/vercel-ai-gateway",
		manifestAuth: {
			defaultModel: VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF,
			applyConfig: applyVercelAiGatewayConfig
		},
		catalog: {
			discoveryMode: "strict",
			buildProvider: () => buildVercelAiGatewayProvider({ discoveryMode: "strict" }),
			buildStaticProvider: buildStaticVercelAiGatewayProvider
		},
		resolveDynamicModel: ({ modelId }) => resolveVercelAiGatewayModel(modelId),
		resolveThinkingProfile: ({ modelId }) => resolveVercelAiGatewayThinkingProfile(modelId)
	}
});
//#endregion
export { vercel_ai_gateway_default as default };
