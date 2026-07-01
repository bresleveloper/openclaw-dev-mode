/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
export declare function transcodeAudioBufferToOpus(params: {
    audioBuffer: Buffer;
    inputExtension?: string;
    inputFileName?: string;
    tempPrefix?: string;
    outputFileName?: string;
    timeoutMs?: number;
    sampleRateHz?: number;
    bitrate?: string;
    channels?: number;
}): Promise<Buffer>;
/** Outcome for lightweight container transcodes that may be unsupported or intentionally skipped. */
export type AudioContainerTranscodeOutcome = {
    ok: true;
    buffer: Buffer;
} | {
    ok: false;
    reason: "platform-unsupported" | "invalid-extension" | "noop-same-container" | "no-recipe" | "transcoder-failed";
    detail?: string;
};
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
export declare function transcodeAudioBuffer(params: {
    audioBuffer: Buffer;
    sourceExtension: string;
    targetExtension: string;
    timeoutMs?: number;
}): Promise<AudioContainerTranscodeOutcome>;
