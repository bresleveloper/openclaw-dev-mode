import { VERCEL_AI_GATEWAY_BASE_URL, vercelAiGatewayFetchGuard } from "./models.js";
import { resolveVercelAiGatewayThinkingProfile } from "./thinking.js";
import { buildStaticVercelAiGatewayProvider, buildVercelAiGatewayProvider, resolveVercelAiGatewayModel } from "./provider-catalog.js";
import { resolveRecommendedStarterModel, runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
// extensions/vercel-ai-gateway/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "vercel-ai-gateway",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["vercel-ai-gateway"],
	providerEndpoints: [{
		"endpointClass": "vercel-ai-gateway",
		"hosts": ["ai-gateway.vercel.sh"]
	}],
	modelCatalog: {
		"modelsDev": { "vercel-ai-gateway": "vercel" },
		"providers": { "vercel-ai-gateway": {
			"baseUrl": "https://ai-gateway.vercel.sh",
			"api": "anthropic-messages",
			"models": []
		} },
		"discovery": { "vercel-ai-gateway": "refreshable" }
	},
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
		"modelsDev": {
			"provider": "vercel",
			"passthroughProviderModel": true
		},
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
};
// extensions/vercel-ai-gateway/index.ts
const PROVIDER_ID = "vercel-ai-gateway";
var vercel_ai_gateway_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Vercel AI Gateway Provider",
	description: "Bundled Vercel AI Gateway provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Vercel AI Gateway",
		docsPath: "/providers/vercel-ai-gateway",
		manifestAuth: { resolveDefaultModel: async ({ apiKey, config, signal }) => await resolveRecommendedStarterModel({
			providerId: PROVIDER_ID,
			config,
			endpoint: `${VERCEL_AI_GATEWAY_BASE_URL}/v1/models`,
			apiKey,
			auditContext: "vercel-ai-gateway-onboarding-model-discovery",
			fetchGuard: vercelAiGatewayFetchGuard,
			...signal ? { signal } : {}
		}) },
		catalog: {
			run: async (ctx) => {
				const { apiKey, discoveryApiKey, profileId } = ctx.resolveProviderApiKey(PROVIDER_ID);
				if (!apiKey) return null;
				const run = async () => ({ provider: {
					...await buildVercelAiGatewayProvider({
						discoveryMode: "strict",
						discoveryApiKey
					}),
					apiKey
				} });
				return await runLiveProviderCatalog({
					providerId: PROVIDER_ID,
					profileId,
					run
				});
			},
			staticRun: async () => ({ provider: buildStaticVercelAiGatewayProvider() })
		},
		resolveDynamicModel: ({ modelId }) => resolveVercelAiGatewayModel(modelId),
		resolveThinkingProfile: ({ modelId }) => resolveVercelAiGatewayThinkingProfile(modelId),
		classifyFailoverReason: ({ status, errorMessage }) => {
			if (status !== 403) return;
			if (/\bVercel Token Pass credits are used up\b/i.test(errorMessage)) return "billing";
			if (/\bscoped to Vercel Token Pass and can only be used with Token Pass models\b/i.test(errorMessage)) return "model_not_found";
		}
	}
});
export { vercel_ai_gateway_default as default };
