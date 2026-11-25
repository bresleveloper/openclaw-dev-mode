import { buildMistralRealtimeTranscriptionProvider } from "./realtime-transcription-provider-factory.js";
// extensions/mistral/capability-catalog.ts
var capability_catalog_default = ((context) => ({ realtimeTranscriptionProviders: [buildMistralRealtimeTranscriptionProvider(context)] }));
export { capability_catalog_default as default };
