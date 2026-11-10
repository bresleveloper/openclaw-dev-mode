import { c as resolveGpt5SystemPromptContribution, s as resolveGpt5PromptOverlayMode } from "../../gpt5-prompt-overlay-BpqITzVL.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-Dm1sl1ov.mjs";
import "../../provider-model-metadata-DkObn07R.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-DynDHTtQ.mjs";
import { t as buildOpenAIDecisionProvider } from "../../decision-provider-C9gEENXm.mjs";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-BeMHvlfP.mjs";
import { t as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-p_XcU5hQ.mjs";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-DGe55-H0.mjs";
import { t as buildOpenAIProvider } from "../../openai-provider-BFCABeuE.mjs";
import { t as OPENAI_QUICKSILVER_OFFER_PATH } from "../../realtime-quicksilver-session-B6USqVXk.mjs";
import { n as releaseOpenAIQuicksilverBrowserSessionBroker, t as acquireOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-owner-BdkpR8pS.mjs";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-BG_POtbM.mjs";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-factory-TeZ9pFmg.mjs";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-C13fucS3.mjs";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
		const provider = buildOpenAIProvider();
		api.registerProvider({
			...provider,
			...openAIToolCompatHooks,
			resolveSystemPromptContribution: (ctx) => {
				const pluginConfig = resolvePluginConfigObject(ctx.config, "openai") ?? (ctx.config ? void 0 : api.pluginConfig);
				return resolveGpt5SystemPromptContribution({
					config: ctx.config,
					legacyPluginConfig: { personality: resolveGpt5PromptOverlayMode(void 0, pluginConfig) },
					modelId: ctx.modelId,
					trigger: ctx.trigger
				});
			}
		});
		api.registerEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
		api.registerDecisionProvider(buildOpenAIDecisionProvider(() => api.runtime.config.current({ clone: true })));
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider(api.runtime.modelAuth));
		api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider);
		api.registerRealtimeVoiceProvider((context) => {
			const quicksilverSession = api.registrationMode === "full" ? acquireOpenAIQuicksilverBrowserSessionBroker({
				getConfig: () => api.runtime.config.current(),
				logger: api.logger
			}, context) : void 0;
			if (quicksilverSession) {
				api.registerHttpRoute({
					path: OPENAI_QUICKSILVER_OFFER_PATH,
					auth: "plugin",
					match: "exact",
					handler: quicksilverSession.handler
				});
				api.lifecycle.registerRuntimeLifecycle({
					id: "openai-quicksilver-realtime-browser-session",
					description: "Close OpenAI browser sidebands when the plugin stops",
					cleanup: (ctx) => {
						if (ctx.reason !== "disable") return;
						return releaseOpenAIQuicksilverBrowserSessionBroker(quicksilverSession);
					}
				});
			}
			return buildOpenAIRealtimeVoiceProvider(context, {
				quicksilverBrowserSessionBroker: quicksilverSession?.broker,
				logger: api.logger
			});
		});
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
	}
});
//#endregion
export { openai_default as default };
