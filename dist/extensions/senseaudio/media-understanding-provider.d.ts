import { f as MediaUnderstandingProvider, n as AudioTranscriptionResult, t as AudioTranscriptionRequest } from "../../types-Cc9pD8mj.js";
//#region extensions/senseaudio/media-understanding-provider.d.ts
declare function transcribeSenseAudioAudio(params: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>;
declare const senseaudioMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { senseaudioMediaUnderstandingProvider, transcribeSenseAudioAudio };