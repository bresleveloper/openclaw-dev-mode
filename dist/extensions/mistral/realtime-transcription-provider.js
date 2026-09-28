import { buildMistralRealtimeTranscriptionProvider as buildMistralRealtimeTranscriptionProvider$1 } from "./realtime-transcription-provider-factory.js";
import { createRealtimeTranscriptionWebSocketSession } from "openclaw/plugin-sdk/realtime-transcription-session";
//#region extensions/mistral/realtime-transcription-provider.ts
function buildMistralRealtimeTranscriptionProvider() {
	return buildMistralRealtimeTranscriptionProvider$1({ createRealtimeTranscriptionWebSocketSession });
}
//#endregion
export { buildMistralRealtimeTranscriptionProvider };
