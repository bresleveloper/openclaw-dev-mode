import { C as VideoDescriptionResult, S as VideoDescriptionRequest, f as MediaUnderstandingProvider, n as AudioTranscriptionResult, t as AudioTranscriptionRequest } from "../../types-D-xgL_hR.js";
//#region extensions/google/media-understanding-provider.d.ts
declare function transcribeGeminiAudio(params: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>;
declare function describeGeminiVideo(params: VideoDescriptionRequest): Promise<VideoDescriptionResult>;
declare const googleMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };