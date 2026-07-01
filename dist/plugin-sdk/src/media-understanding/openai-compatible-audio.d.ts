import type { AudioTranscriptionRequest, AudioTranscriptionResult } from "./types.js";
type OpenAiCompatibleAudioParams = AudioTranscriptionRequest & {
    defaultBaseUrl: string;
    defaultModel: string;
    provider?: string;
};
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
export declare function transcribeOpenAiCompatibleAudio(params: OpenAiCompatibleAudioParams): Promise<AudioTranscriptionResult>;
export {};
