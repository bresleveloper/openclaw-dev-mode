import { a as createLazyRuntimeSurface } from "../../lazy-runtime-BPNHa36e.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { t as buildGoogleGeminiCliBackend } from "../../cli-backend-_dS2dNnJ.mjs";
import { n as registerGoogleGeminiCliProvider } from "../../gemini-cli-provider-Djd1frq5.mjs";
import { d as createGoogleImageGenerationProviderMetadata, f as createGoogleMediaUnderstandingProviderMetadata, m as createGoogleVideoGenerationProviderMetadata, p as createGoogleMusicGenerationProviderMetadata } from "../../generation-provider-metadata-BY3cTHtL.mjs";
import { t as geminiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-CHqC9ijY.mjs";
import { n as registerGoogleProvider } from "../../provider-registration-B64XnoKu.mjs";
import { t as createLazyGoogleRealtimeVoiceProvider } from "../../realtime-voice-lazy-sfaVU0eX.mjs";
import { t as buildGoogleSpeechProvider } from "../../speech-provider-Bpg8udHZ.mjs";
import { t as createGeminiWebSearchProvider } from "../../gemini-web-search-provider-8hAvYTDW.mjs";
//#region extensions/google/index.ts
const loadGoogleImageGenerationProvider = createLazyRuntimeSurface(() => import("./image-generation-provider.js"), (mod) => mod.buildGoogleImageGenerationProvider());
const loadGoogleMediaUnderstandingProvider = createLazyRuntimeSurface(() => import("./media-understanding-provider.js"), (mod) => mod.googleMediaUnderstandingProvider);
const loadGoogleMusicGenerationProvider = createLazyRuntimeSurface(() => import("./music-generation-provider.js"), (mod) => mod.buildGoogleMusicGenerationProvider());
const loadGoogleVideoGenerationProvider = createLazyRuntimeSurface(() => import("./video-generation-provider.js"), (mod) => mod.buildGoogleVideoGenerationProvider());
async function loadGoogleRequiredMediaUnderstandingProvider() {
	const provider = await loadGoogleMediaUnderstandingProvider();
	if (!provider.transcribeAudio || !provider.describeVideo) throw new Error("google media understanding provider missing required handlers");
	return provider;
}
function createLazyGoogleImageGenerationProvider() {
	return {
		...createGoogleImageGenerationProviderMetadata(),
		generateImage: async (req) => (await loadGoogleImageGenerationProvider()).generateImage(req)
	};
}
function createLazyGoogleMediaUnderstandingProvider() {
	return {
		...createGoogleMediaUnderstandingProviderMetadata(),
		transcribeAudio: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).transcribeAudio(...args),
		describeVideo: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeVideo(...args)
	};
}
function createLazyGoogleMusicGenerationProvider() {
	return {
		...createGoogleMusicGenerationProviderMetadata(),
		generateMusic: async (...args) => await (await loadGoogleMusicGenerationProvider()).generateMusic(...args)
	};
}
function createLazyGoogleVideoGenerationProvider() {
	return {
		...createGoogleVideoGenerationProviderMetadata(),
		generateVideo: async (...args) => await (await loadGoogleVideoGenerationProvider()).generateVideo(...args)
	};
}
var google_default = definePluginEntry({
	id: "google",
	name: "Google Plugin",
	description: "Bundled Google plugin",
	register(api) {
		api.registerCliBackend(buildGoogleGeminiCliBackend());
		registerGoogleGeminiCliProvider(api);
		registerGoogleProvider(api);
		api.registerEmbeddingProvider(geminiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(createLazyGoogleImageGenerationProvider());
		api.registerMediaUnderstandingProvider(createLazyGoogleMediaUnderstandingProvider());
		api.registerMusicGenerationProvider(createLazyGoogleMusicGenerationProvider());
		api.registerRealtimeVoiceProvider(createLazyGoogleRealtimeVoiceProvider());
		api.registerSpeechProvider(buildGoogleSpeechProvider());
		api.registerVideoGenerationProvider(createLazyGoogleVideoGenerationProvider());
		api.registerWebSearchProvider(createGeminiWebSearchProvider());
	}
});
//#endregion
export { google_default as default };
