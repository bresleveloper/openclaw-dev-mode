import { a as createLazyRuntimeSurface } from "../../lazy-runtime-CJrzFzqU.mjs";
import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as buildGoogleGeminiCliBackend } from "../../cli-backend-_dS2dNnJ.mjs";
import { t as buildGoogleGeminiCliProvider } from "../../gemini-cli-provider-BDgM5D_8.mjs";
import { d as createGoogleImageGenerationProviderMetadata, f as createGoogleMediaUnderstandingProviderMetadata, m as createGoogleVideoGenerationProviderMetadata, p as createGoogleMusicGenerationProviderMetadata } from "../../generation-provider-metadata-CkICOOMz.mjs";
import { t as geminiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-DP40-F7W.mjs";
import { t as buildGoogleProvider } from "../../provider-registration-HbiUULo3.mjs";
import { t as createLazyGoogleRealtimeVoiceProvider } from "../../realtime-voice-lazy-CPl7N18b.mjs";
import { t as buildGoogleSpeechProvider } from "../../speech-provider-BJCkhEMD.mjs";
import { t as createGeminiWebSearchProvider } from "../../gemini-web-search-provider-CEBDeWhC.mjs";
//#region extensions/google/index.ts
const loadGoogleImageGenerationProvider = createLazyRuntimeSurface(() => import("./image-generation-provider.js"), (mod) => mod.buildGoogleImageGenerationProvider());
const loadGoogleMediaUnderstandingProvider = createLazyRuntimeSurface(() => import("./media-understanding-provider.js"), (mod) => mod.googleMediaUnderstandingProvider);
const loadGoogleMusicGenerationProvider = createLazyRuntimeSurface(() => import("./music-generation-provider.js"), (mod) => mod.buildGoogleMusicGenerationProvider());
const loadGoogleVideoGenerationProvider = createLazyRuntimeSurface(() => import("./video-generation-provider.js"), (mod) => mod.buildGoogleVideoGenerationProvider());
var google_default = definePluginEntry({
	id: "google",
	name: "Google Plugin",
	description: "Bundled Google plugin",
	register(api) {
		api.registerCliBackend(buildGoogleGeminiCliBackend());
		api.registerProvider(buildGoogleGeminiCliProvider());
		api.registerProvider(buildGoogleProvider());
		api.registerEmbeddingProvider(geminiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider({
			...createGoogleImageGenerationProviderMetadata(),
			generateImage: async (req) => (await loadGoogleImageGenerationProvider()).generateImage(req)
		});
		api.registerMediaUnderstandingProvider({
			...createGoogleMediaUnderstandingProviderMetadata(),
			transcribeAudio: async (...args) => (await loadGoogleMediaUnderstandingProvider()).transcribeAudio(...args),
			describeVideo: async (...args) => (await loadGoogleMediaUnderstandingProvider()).describeVideo(...args)
		});
		api.registerMusicGenerationProvider({
			...createGoogleMusicGenerationProviderMetadata(),
			generateMusic: async (req) => (await loadGoogleMusicGenerationProvider()).generateMusic(req)
		});
		api.registerRealtimeVoiceProvider(createLazyGoogleRealtimeVoiceProvider());
		api.registerSpeechProvider(buildGoogleSpeechProvider());
		api.registerVideoGenerationProvider({
			...createGoogleVideoGenerationProviderMetadata(),
			generateVideo: async (req) => (await loadGoogleVideoGenerationProvider()).generateVideo(req)
		});
		api.registerWebSearchProvider(createGeminiWebSearchProvider());
	}
});
//#endregion
export { google_default as default };
