import type { MediaUnderstandingCapability } from "./types.js";
/** Default max response characters for bounded text outputs. */
export declare const DEFAULT_MAX_CHARS = 500;
/** Default max response characters by capability. */
export declare const DEFAULT_MAX_CHARS_BY_CAPABILITY: Record<MediaUnderstandingCapability, number | undefined>;
/** Default input byte limits by capability. */
export declare const DEFAULT_MAX_BYTES: Record<MediaUnderstandingCapability, number>;
/** Default request timeout by capability. */
export declare const DEFAULT_TIMEOUT_SECONDS: Record<MediaUnderstandingCapability, number>;
/** Default prompts by capability. */
export declare const DEFAULT_PROMPT: Record<MediaUnderstandingCapability, string>;
/** Upper bound for base64-expanded video payloads. */
export declare const DEFAULT_VIDEO_MAX_BASE64_BYTES: number;
/** CLI output buffer used by provider child processes. */
export declare const CLI_OUTPUT_MAX_BUFFER: number;
/** Default parallel media-understanding request count. */
export declare const DEFAULT_MEDIA_CONCURRENCY = 2;
/** Minimum bytes for audio files before transcription is attempted. */
export declare const MIN_AUDIO_FILE_BYTES = 1024;
