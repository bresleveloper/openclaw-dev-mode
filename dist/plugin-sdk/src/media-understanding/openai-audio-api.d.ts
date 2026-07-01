import type { MediaUnderstandingCapability } from "./types.js";
export declare const OPENAI_AUDIO_TRANSCRIPTIONS_API = "openai-audio-transcriptions";
export declare function resolveOpenAiAudioAuthModelApi(params: {
    capability: MediaUnderstandingCapability;
    providerId: string;
}): string | undefined;
