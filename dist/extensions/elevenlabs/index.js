import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-BIjaPV6M.js";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-WMFXXnqU.js";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-BdsBmyZp.js";
//#region extensions/elevenlabs/index.ts
var elevenlabs_default = definePluginEntry({
	id: "elevenlabs",
	name: "ElevenLabs Speech",
	description: "Bundled ElevenLabs speech provider",
	register(api) {
		api.registerSpeechProvider(buildElevenLabsSpeechProvider());
		api.registerMediaUnderstandingProvider(elevenLabsMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildElevenLabsRealtimeTranscriptionProvider());
	}
});
//#endregion
export { elevenlabs_default as default };
