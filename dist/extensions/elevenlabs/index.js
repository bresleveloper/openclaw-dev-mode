import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-Dm2zTkoq.mjs";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-MsqeO1zB.mjs";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-factory-05vzTnzI.mjs";
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
