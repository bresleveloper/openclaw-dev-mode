import { isFireworksKimiModelId } from "./model-id.js";
import { c as isFireworksCatalogModelId, i as FIREWORKS_DEFAULT_MODEL_ID, l as isFireworksNativeModel, n as FIREWORKS_DEFAULT_CONTEXT_WINDOW, r as FIREWORKS_DEFAULT_MAX_TOKENS, t as FIREWORKS_BASE_URL, u as openclaw_plugin_default } from "./.setup/provider-catalog-BVZMHYyD.mjs";
import { applyFireworksConfig } from "./onboard.js";
import { resolveFireworksThinkingProfile } from "./thinking-policy.js";
import { calculateCost, streamSimple } from "openclaw/plugin-sdk/llm";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyModelCompatPatch, buildProviderReplayFamilyHooks, normalizeProviderId, resolveFamilyForwardCompatModel } from "openclaw/plugin-sdk/provider-model-shared";
import { createPayloadPatchStreamWrapper, transformProviderStreamMessages } from "openclaw/plugin-sdk/provider-stream-shared";
// extensions/fireworks/index.ts
const PROVIDER_ID = "fireworks";
function isFireworksProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "fireworks" || normalized === "fireworks-ai";
}
function isFireworksGlmModelId(modelId) {
	const normalized = modelId.trim().toLowerCase();
	const lastSegment = normalized.split("/").pop() ?? normalized;
	return /^glm[-_.]/.test(lastSegment);
}
function resolveFireworksDynamicModel(ctx) {
	const modelId = ctx.modelId.trim();
	if (!modelId || isFireworksCatalogModelId(modelId)) return;
	return resolveFamilyForwardCompatModel({
		providerId: PROVIDER_ID,
		modelId,
		ctx,
		cases: [{
			match: () => true,
			templateIds: [FIREWORKS_DEFAULT_MODEL_ID],
			patch: ({ template }) => template ? void 0 : {
				api: "openai-completions",
				baseUrl: FIREWORKS_BASE_URL,
				contextWindow: FIREWORKS_DEFAULT_CONTEXT_WINDOW,
				maxTokens: FIREWORKS_DEFAULT_MAX_TOKENS
			}
		}],
		patch: {
			provider: PROVIDER_ID,
			reasoning: !isFireworksKimiModelId(modelId),
			input: isFireworksGlmModelId(modelId) ? ["text"] : ["text", "image"]
		},
		synthesize: true
	});
}
var fireworks_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Fireworks Provider",
	description: "Bundled Fireworks AI provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Fireworks",
		aliases: ["fireworks-ai"],
		docsPath: "/providers/fireworks",
		manifestAuth: { applyConfig: applyFireworksConfig },
		catalog: {
			discoveryMode: "strict",
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		normalizeResolvedModel: ({ model }) => isFireworksNativeModel(model) ? applyModelCompatPatch(model, {
			supportsPromptCacheKey: model.compat?.supportsPromptCacheKey ?? true,
			supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? false
		}) : model,
		wrapStreamFn(ctx) {
			if (!isFireworksProviderId(ctx.provider) || (ctx.sourceApi ?? ctx.model?.api) !== "openai-completions") return;
			const isKimi = isFireworksKimiModelId(ctx.modelId);
			const isNative = isFireworksNativeModel(ctx.model, ctx.sourceApi);
			if (!isKimi && !isNative) return;
			const underlying = isKimi ? createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload }) => {
				payload.thinking = { type: "disabled" };
				delete payload.reasoning;
				delete payload.reasoning_effort;
				delete payload.reasoningEffort;
			}) : ctx.streamFn ?? streamSimple;
			if (!isNative) return underlying;
			return async (model, context, options) => {
				let cache;
				const stream = await underlying(model, context, {
					...options,
					onResponse(response, responseModel) {
						const prompt = Number(response.headers["fireworks-prompt-tokens"]?.trim() || NaN);
						const read = Number(response.headers["fireworks-cached-prompt-tokens"]?.trim() || NaN);
						cache = Number.isSafeInteger(prompt) && Number.isSafeInteger(read) && read >= 0 && read <= prompt ? {
							prompt,
							read
						} : void 0;
						return options?.onResponse?.(response, responseModel);
					}
				});
				return transformProviderStreamMessages(stream, (message) => {
					const usage = message.usage;
					if (!cache || usage.cacheTelemetry?.state !== "unavailable" || usage.input + usage.cacheRead + usage.cacheWrite !== cache.prompt) return;
					usage.input -= cache.read;
					usage.cacheRead = cache.read;
					usage.cacheTelemetry = { state: "available" };
					const billedTotal = usage.cost.total;
					calculateCost(model, usage);
					if (usage.cost.totalOrigin === "provider-billed") usage.cost.total = billedTotal;
				});
			};
		},
		resolveThinkingProfile: ({ modelId }) => resolveFireworksThinkingProfile(modelId),
		resolveDynamicModel: resolveFireworksDynamicModel,
		isModernModelRef: () => true
	}
});
export { fireworks_default as default };
