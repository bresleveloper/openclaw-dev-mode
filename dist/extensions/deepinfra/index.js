import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-DMCTN2sM.mjs";
import { deepinfraEmbeddingProviderAdapter } from "./embedding-adapter.js";
import { buildDeepInfraImageGenerationProvider } from "./image-generation-provider.js";
import { deepinfraMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { DEEPINFRA_DEFAULT_MODEL_REF, buildStaticDeepInfraProvider } from "./provider-static-catalog.js";
import { applyDeepInfraConfig } from "./onboard.js";
import { buildDeepInfraApiKeyCatalog } from "./provider-catalog.js";
import { buildDeepInfraSpeechProvider } from "./speech-provider.js";
import { listDeepInfraImageGenCatalog, listDeepInfraVideoGenCatalog } from "./surface-model-catalogs.js";
import { buildDeepInfraVideoGenerationProvider } from "./video-generation-provider.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyModelCompatPatch, buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { createOpenRouterWrapper, isProxyReasoningUnsupported } from "openclaw/plugin-sdk/provider-stream";
import { applyAnthropicEphemeralCacheControlMarkers, applyCompletionsAnthropicCacheControl, createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
// extensions/deepinfra/index.ts
const PROVIDER_ID = "deepinfra";
var deepinfra_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "DeepInfra Provider",
	description: "Bundled DeepInfra provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "DeepInfra",
		docsPath: "/providers/deepinfra",
		manifestAuth: {
			noteTitle: "DeepInfra",
			noteMessage: ["DeepInfra provides an OpenAI-compatible API for open source and frontier models.", "Get your API key at: https://deepinfra.com/dash/api_keys"].join("\n"),
			defaultModel: DEEPINFRA_DEFAULT_MODEL_REF,
			applyConfig: applyDeepInfraConfig
		},
		catalog: {
			order: "simple",
			run: buildDeepInfraApiKeyCatalog,
			staticRun: async () => ({ provider: buildStaticDeepInfraProvider() })
		},
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		normalizeResolvedModel: ({ model }) => model.api === "openai-completions" && model.baseUrl?.trim().replace(/\/+$/u, "") === openclaw_plugin_default.modelCatalog.providers.deepinfra.baseUrl ? applyModelCompatPatch(model, {
			supportsPromptCacheKey: model.compat?.supportsPromptCacheKey ?? true,
			supportsLongCacheRetention: model.compat?.supportsLongCacheRetention ?? false
		}) : model,
		wrapStreamFn: (ctx) => {
			const thinkingLevel = isProxyReasoningUnsupported(ctx.modelId) ? void 0 : ctx.thinkingLevel;
			const baseStreamFn = createOpenRouterWrapper(ctx.streamFn, thinkingLevel);
			const extraParams = ctx.extraParams;
			return (model, context, options) => {
				if (thinkingLevel === "off" && model.api === "openai-completions" && model.id.toLowerCase() === "nvidia/nvidia-nemotron-3.5-super-vl") return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
					payload.reasoning = { enabled: false };
				})(model, context, options);
				if (!model.id.toLowerCase().startsWith("anthropic/")) return baseStreamFn(model, context, options);
				const isCompletions = model.api === "openai-completions";
				const configured = options?.cacheRetention ?? extraParams?.cacheRetention;
				const cacheRetention = configured === "none" || configured === "long" ? configured : "short";
				return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
					if (isCompletions) applyCompletionsAnthropicCacheControl(payload, cacheRetention === "none" ? null : { type: "ephemeral" });
					else applyAnthropicEphemeralCacheControlMarkers(payload);
				})(model, context, isCompletions ? {
					...options,
					cacheRetention
				} : options);
			};
		},
		isModernModelRef: () => true,
		isCacheTtlEligible: (ctx) => ctx.modelId.toLowerCase().startsWith("anthropic/")
	},
	register(api) {
		api.registerImageGenerationProvider(buildDeepInfraImageGenerationProvider());
		api.registerModelCatalogProvider({
			provider: PROVIDER_ID,
			kinds: ["image_generation"],
			liveCatalog: listDeepInfraImageGenCatalog
		});
		api.registerMediaUnderstandingProvider(deepinfraMediaUnderstandingProvider);
		api.registerEmbeddingProvider(deepinfraEmbeddingProviderAdapter);
		api.registerSpeechProvider(buildDeepInfraSpeechProvider());
		api.registerVideoGenerationProvider(buildDeepInfraVideoGenerationProvider());
		api.registerModelCatalogProvider({
			provider: PROVIDER_ID,
			kinds: ["video_generation"],
			liveCatalog: listDeepInfraVideoGenCatalog
		});
	}
});
export { deepinfra_default as default };
