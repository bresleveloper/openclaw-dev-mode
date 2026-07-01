import { f as MediaUnderstandingProvider, n as AudioTranscriptionResult, t as AudioTranscriptionRequest } from "../../types-D-xgL_hR.js";
//#region extensions/elevenlabs/media-understanding-provider.d.ts
declare function transcribeElevenLabsAudio(req: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>;
declare const elevenLabsMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { elevenLabsMediaUnderstandingProvider, transcribeElevenLabsAudio };