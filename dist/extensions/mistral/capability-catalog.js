import { buildMistralRealtimeTranscriptionProvider } from "./realtime-transcription-provider-factory.js";
//#region extensions/mistral/capability-catalog.ts
var capability_catalog_default = ((context) => ({ realtimeTranscriptionProviders: [buildMistralRealtimeTranscriptionProvider(context)] }));
//#endregion
export { capability_catalog_default as default };
