import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-DWfSLpLu.js";
import { n as buildProviderToolCompatFamilyHooks } from "../../provider-tools-VmwDm8UA.js";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-B8ck4mF8.js";
import { t as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-MwdAsro-.js";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-C5NngEff.js";
import { i as buildOpenAIProvider } from "../../openai-provider-CxRoutJW.js";
import { a as resolveOpenAISystemPromptContribution, i as resolveOpenAIPromptOverlayMode } from "../../prompt-overlay-64HUbMO8.js";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-Bn2dT3qF.js";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-n0iEs7pc.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-AJLgkHAZ.js";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-DvueyaIn.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
		const buildProviderWithPromptContribution = (provider) => ({
			...provider,
			...openAIToolCompatHooks,
			resolveSystemPromptContribution: (ctx) => {
				const pluginConfig = resolvePluginConfigObject(ctx.config, "openai") ?? (ctx.config ? void 0 : api.pluginConfig);
				return resolveOpenAISystemPromptContribution({
					config: ctx.config,
					legacyPluginConfig: pluginConfig,
					mode: resolveOpenAIPromptOverlayMode(pluginConfig),
					modelProviderId: provider.id,
					modelId: ctx.modelId,
					trigger: ctx.trigger
				});
			}
		});
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
		api.registerMemoryEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
		api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider());
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
		api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
	}
});
//#endregion
export { openai_default as default };
