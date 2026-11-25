import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-DHgrttkQ.mjs";
import { applyMistralConnectionConfig } from "./onboard.js";
import { applyMistralModelCompat } from "./api.js";
import { mistralMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { mistralMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { buildMistralRealtimeTranscriptionProvider } from "./realtime-transcription-provider-factory.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
var mistral_default = defineSingleProviderPluginEntry({
	id: "mistral",
	name: "Mistral Provider",
	description: "Official Mistral provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Mistral",
		docsPath: "/providers/models",
		manifestAuth: { applyConfig: applyMistralConnectionConfig },
		catalog: {
			discoveryMode: "strict",
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true
		},
		matchesContextOverflowError: ({ errorMessage }) => /\bmistral\b.*(?:input.*too long|token limit.*exceeded)/i.test(errorMessage),
		normalizeResolvedModel: ({ model }) => applyMistralModelCompat(model),
		...buildProviderReplayFamilyHooks({ family: "mistral" })
	},
	register(api) {
		api.registerEmbeddingProvider(mistralMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(mistralMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildMistralRealtimeTranscriptionProvider);
	}
});
export { mistral_default as default };
