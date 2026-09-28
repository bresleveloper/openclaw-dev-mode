import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-DJ-gOzGm.mjs";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-1X8kf7GG.mjs";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-factory-aYQ3rRal.mjs";
//#region extensions/elevenlabs/index.ts
var elevenlabs_default = definePluginEntry({
	id: "elevenlabs",
	name: "ElevenLabs Speech",
	description: "Bundled ElevenLabs speech provider",
	register(api) {
		api.registerSpeechProvider(buildElevenLabsSpeechProvider);
		api.registerMediaUnderstandingProvider(elevenLabsMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildElevenLabsRealtimeTranscriptionProvider);
	}
});
//#endregion
export { elevenlabs_default as default };
