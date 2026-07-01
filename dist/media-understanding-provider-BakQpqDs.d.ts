import { f as MediaUnderstandingProvider, n as AudioTranscriptionResult, t as AudioTranscriptionRequest } from "./types-D-xgL_hR.js";
//#region extensions/openai/media-understanding-provider.d.ts
declare function transcribeOpenAiAudio(params: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>;
declare const openaiMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { transcribeOpenAiAudio as n, openaiMediaUnderstandingProvider as t };