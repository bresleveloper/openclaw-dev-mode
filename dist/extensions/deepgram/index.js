import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { t as deepgramMediaUnderstandingProvider } from "../../media-understanding-provider-CbD5YQQW.mjs";
import { t as buildDeepgramRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-CavQJn3T.mjs";
//#region extensions/deepgram/index.ts
var deepgram_default = definePluginEntry({
	id: "deepgram",
	name: "Deepgram Media Understanding",
	description: "Bundled Deepgram audio transcription provider",
	register(api) {
		api.registerMediaUnderstandingProvider(deepgramMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildDeepgramRealtimeTranscriptionProvider);
	}
});
//#endregion
export { deepgram_default as default };
