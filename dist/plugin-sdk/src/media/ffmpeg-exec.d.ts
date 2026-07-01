/** Process limits and optional stdin payload for ffmpeg/ffprobe helper calls. */
export type MediaExecOptions = {
    timeoutMs?: number;
    maxBufferBytes?: number;
    input?: Buffer | string;
};
/** Resolves ffmpeg from trusted system paths before command execution. */
export declare function resolveFfmpegBin(): string;
/** Runs ffprobe with optional stdin input, ignoring benign stdin EPIPE after successful output. */
export declare function runFfprobe(args: string[], options?: MediaExecOptions): Promise<string>;
/** Runs ffmpeg with bounded timeout and buffer settings. */
export declare function runFfmpeg(args: string[], options?: MediaExecOptions): Promise<string>;
/** Splits ffprobe CSV-ish output into normalized lowercase fields. */
export declare function parseFfprobeCsvFields(stdout: string, maxFields: number): string[];
/** Parses codec and positive sample rate from compact ffprobe stream output. */
export declare function parseFfprobeCodecAndSampleRate(stdout: string): {
    codec: string | null;
    sampleRateHz: number | null;
};
