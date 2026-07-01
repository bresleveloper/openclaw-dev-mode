/** Shared stdout/stderr buffer cap for ffmpeg and ffprobe child processes. */
export declare const MEDIA_FFMPEG_MAX_BUFFER_BYTES: number;
/** Default ffprobe timeout for lightweight metadata probes. */
export declare const MEDIA_FFPROBE_TIMEOUT_MS = 10000;
/** Default ffmpeg timeout for bounded media conversion work. */
export declare const MEDIA_FFMPEG_TIMEOUT_MS = 45000;
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
export declare const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS: number;
