import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-CaI6yWBc.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-BDV45rRZ.mjs";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-uWH6wuEl.mjs";
import { t as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-CXO0EvwX.mjs";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-BPExAKfB.mjs";
import { t as buildOpenAIProvider } from "../../openai-provider-GIr7Cuuv.mjs";
import { n as resolveOpenAISystemPromptContribution, t as resolveOpenAIPromptOverlayMode } from "../../prompt-overlay-CYqP-X87.mjs";
import { t as OPENAI_QUICKSILVER_OFFER_PATH } from "../../realtime-quicksilver-session-CyB914kA.mjs";
import { n as releaseOpenAIQuicksilverBrowserSessionBroker, t as acquireOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-owner-BOO0H3xk.mjs";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-C58OYx1b.mjs";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-factory-E_MZmbzi.mjs";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-DY5JF9Ii.mjs";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-Ee_pt6_n.mjs";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const { ensureAuthProfileStore, listProfilesForProvider, isProviderApiKeyConfigured } = api.runtime.modelAuth;
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
		api.registerEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider({
			ensureAuthProfileStore,
			listProfilesForProvider,
			isProviderApiKeyConfigured
		}));
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
		api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider({ isProviderApiKeyConfigured }));
	}
});
//#endregion
export { openai_default as default };
