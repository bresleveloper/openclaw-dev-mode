import { resolveThinkingProfile } from "./provider-policy-api.js";
import { n as openclaw_plugin_default } from "./.setup/provider-catalog-DV4UQ-rA.mjs";
import { applyMistralConnectionConfig } from "./onboard.js";
import { applyMistralModelCompat } from "./api.js";
import { mistralMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { mistralMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { buildMistralRealtimeTranscriptionProvider } from "./realtime-transcription-provider-factory.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
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
		resolveThinkingProfile,
		buildReplayPolicy: () => ({
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict9"
		})
	},
	register(api) {
		api.registerEmbeddingProvider(mistralMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(mistralMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildMistralRealtimeTranscriptionProvider);
	}
});
//#endregion
export { mistral_default as default };
