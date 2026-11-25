import { resolveImplicitMantleProvider, resolveMantleBearerToken, resolveMantleRuntimeBearerToken, resolveMantleSonnet5Cost } from "./discovery.js";
import { createMantleAnthropicStreamFn } from "./mantle-anthropic.runtime.js";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { modelCostsEqual, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
// extensions/amazon-bedrock-mantle/index.ts
/**
* Amazon Bedrock Mantle plugin entry. Registers the OpenAI-compatible Mantle
* provider plus Anthropic stream compatibility hooks.
*/
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
var amazon_bedrock_mantle_default = definePluginEntry({
	id: "amazon-bedrock-mantle",
	name: "Amazon Bedrock Mantle Provider",
	description: "Bundled Amazon Bedrock Mantle (OpenAI-compatible) provider plugin",
	register(api) {
		const providerId = "amazon-bedrock-mantle";
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
						const implicit = await resolveImplicitMantleProvider({
							discoveryMode: "strict",
							env: ctx.env,
							pluginConfig: resolvePluginConfigObject(ctx.config, providerId)
						});
						return implicit ? { provider: implicit } : null;
					}
				})
			},
			resolveConfigApiKey: ({ env }) => resolveMantleBearerToken(env) ? "env:AWS_BEARER_TOKEN_BEDROCK" : void 0,
			prepareRuntimeAuthV2: resolveMantleRuntimeBearerToken,
			normalizeResolvedModel: normalizeMantleResolvedModel,
			supportsSystemPromptCacheBoundary: true,
			createStreamFn: ({ model }) => model.api === "anthropic-messages" ? createMantleAnthropicStreamFn() : void 0,
			matchesContextOverflowError: ({ errorMessage }) => /context_length_exceeded|max.*tokens.*exceeded/i.test(errorMessage),
			classifyFailoverReason: ({ errorMessage }) => {
				if (/rate_limit|too many requests|429/i.test(errorMessage)) return "rate_limit";
				if (/overloaded|503|service.*unavailable/i.test(errorMessage)) return "overloaded";
			}
		});
	}
});
export { amazon_bedrock_mantle_default as default };
