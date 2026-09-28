import { resolveImplicitMantleProvider, resolveMantleBearerToken, resolveMantleRuntimeBearerToken, resolveMantleSonnet5Cost } from "./discovery.js";
import { createMantleAnthropicStreamFn } from "./mantle-anthropic.runtime.js";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { modelCostsEqual, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/amazon-bedrock-mantle/register.sync.runtime.ts
const MANTLE_OPUS_5_COST = {
	input: 5,
	output: 25,
	cacheRead: .5,
	cacheWrite: 6.25
};
function normalizeMantleResolvedModel(params) {
	const ref = {
		id: params.modelId,
		params: params.model.params
	};
	const cost = resolveClaudeOpus5ModelIdentity(ref) ? MANTLE_OPUS_5_COST : resolveClaudeSonnet5ModelIdentity(ref) ? resolveMantleSonnet5Cost() : void 0;
	if (!cost) return;
	if (modelCostsEqual(params.model.cost, cost)) return;
	return {
		...params.model,
		cost
	};
}
/** Register the Amazon Bedrock Mantle provider with OpenClaw. */
function registerBedrockMantlePlugin(api) {
	const providerId = "amazon-bedrock-mantle";
	const startupPluginConfig = api.pluginConfig ?? {};
	function resolveCurrentPluginConfig(config) {
		return resolvePluginConfigObject(config, providerId) ?? (config ? void 0 : startupPluginConfig);
	}
	api.registerProvider({
		id: providerId,
		label: "Amazon Bedrock Mantle (OpenAI-compatible)",
		docsPath: "/providers/bedrock-mantle",
		auth: [],
		catalog: {
			order: "simple",
			run: (ctx) => runLiveProviderCatalog({
				providerId,
				run: async () => {
					const currentPluginConfig = resolveCurrentPluginConfig(ctx.config);
					const implicit = await resolveImplicitMantleProvider({
						discoveryMode: "strict",
						env: ctx.env,
						pluginConfig: currentPluginConfig
					});
					return implicit ? { provider: implicit } : null;
				}
			})
		},
		resolveConfigApiKey: ({ env }) => resolveMantleBearerToken(env) ? "env:AWS_BEARER_TOKEN_BEDROCK" : void 0,
		prepareRuntimeAuth: async ({ apiKey, env }) => await resolveMantleRuntimeBearerToken({
			apiKey,
			env
		}),
		normalizeResolvedModel: ({ modelId, model }) => normalizeMantleResolvedModel({
			modelId,
			model
		}),
		supportsSystemPromptCacheBoundary: true,
		createStreamFn: ({ model }) => model.api === "anthropic-messages" ? createMantleAnthropicStreamFn() : void 0,
		matchesContextOverflowError: ({ errorMessage }) => /context_length_exceeded|max.*tokens.*exceeded/i.test(errorMessage),
		classifyFailoverReason: ({ errorMessage }) => {
			if (/rate_limit|too many requests|429/i.test(errorMessage)) return "rate_limit";
			if (/overloaded|503|service.*unavailable/i.test(errorMessage)) return "overloaded";
		}
	});
}
//#endregion
export { registerBedrockMantlePlugin };
