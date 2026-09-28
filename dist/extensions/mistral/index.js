import { resolveThinkingProfile } from "./provider-policy-api.js";
import { n as openclaw_plugin_default } from "./.setup/provider-catalog-DV4UQ-rA.mjs";
import { applyMistralConnectionConfig } from "./onboard.js";
import { applyMistralModelCompat } from "./api.js";
import { mistralMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { mistralMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { buildMistralRealtimeTranscriptionProvider } from "./realtime-transcription-provider.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
//#region extensions/mistral/index.ts
const PROVIDER_ID = "mistral";
function buildMistralReplayPolicy() {
	return {
		sanitizeToolCallIds: true,
		toolCallIdMode: "strict9"
	};
}
var mistral_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
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
		buildReplayPolicy: () => buildMistralReplayPolicy()
	},
	register(api) {
		api.registerEmbeddingProvider(mistralMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(mistralMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildMistralRealtimeTranscriptionProvider());
	}
});
//#endregion
export { mistral_default as default };
