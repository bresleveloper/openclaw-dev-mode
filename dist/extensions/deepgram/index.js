import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { t as deepgramMediaUnderstandingProvider } from "../../media-understanding-provider-CSL7nSPA.mjs";
import { t as buildDeepgramRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-factory-D4w-Q06-.mjs";
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
