import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-DExUm5Oa.mjs";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-CWCO12Ml.mjs";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-factory-fInLGPYR.mjs";
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
