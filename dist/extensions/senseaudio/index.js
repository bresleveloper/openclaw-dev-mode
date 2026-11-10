import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { t as senseaudioMediaUnderstandingProvider } from "../../media-understanding-provider-DE7RfuUn.mjs";
//#region extensions/senseaudio/index.ts
var senseaudio_default = definePluginEntry({
	id: "senseaudio",
	name: "SenseAudio",
	description: "Bundled SenseAudio audio transcription provider",
	register(api) {
		api.registerMediaUnderstandingProvider(senseaudioMediaUnderstandingProvider);
	}
});
//#endregion
export { senseaudio_default as default };
