import { buildFishAudioSpeechProvider } from "./speech-provider.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/fish-audio-speech/index.ts
var fish_audio_speech_default = definePluginEntry({
	id: "fish-audio-speech",
	name: "Fish Audio Speech",
	description: "Hosted Fish Audio S2.1 text-to-speech provider",
	register(api) {
		api.registerSpeechProvider(buildFishAudioSpeechProvider());
	}
});
//#endregion
export { fish_audio_speech_default as default };
