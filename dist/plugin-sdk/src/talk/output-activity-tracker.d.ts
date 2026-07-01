/**
 * Realtime voice output activity counters and playback-state tracking.
 *
 * Providers use this to decide whether assistant output is active,
 * interruptible, or overdue relative to the audio duration already emitted.
 */
export type RealtimeVoiceOutputActivityTrackerOptions = {
    /** Injectable clock for deterministic tests and playback watchdog math. */
    now?: () => number;
};
/** One output activity increment from source audio and/or sink audio. */
export type RealtimeVoiceOutputActivityDelta = {
    audioMs?: number;
    sourceAudioBytes?: number;
    sinkAudioBytes?: number;
};
/** Current output counters and playback timestamps. */
export type RealtimeVoiceOutputActivitySnapshot = {
    audioMs: number;
    chunks: number;
    sourceAudioBytes: number;
    sinkAudioBytes: number;
    playbackStarted: boolean;
    streamEnding: boolean;
    lastAudioAt?: number;
    playbackStartedAt?: number;
};
/** Mutable tracker for one realtime voice output stream. */
export type RealtimeVoiceOutputActivityTracker = {
    markStreamOpened(): void;
    markStreamEnding(): void;
    markPlaybackStarted(): void;
    markAudio(delta: RealtimeVoiceOutputActivityDelta): void;
    reset(): void;
    /** Whether output exists or the downstream sink reports active playback. */
    isActive(sinkActive?: boolean): boolean;
    /** Whether caller speech should be treated as interrupting current output. */
    isInterruptible(sinkActive?: boolean): boolean;
    elapsedPlaybackMs(): number;
    /** Delay before watchdog should assume playback has exceeded expected audio duration. */
    playbackWatchdogDelayMs(options: {
        marginMs: number;
        minMs?: number;
    }): number | undefined;
    snapshot(): RealtimeVoiceOutputActivitySnapshot;
};
/** Create a fresh output activity tracker for a realtime voice session. */
export declare function createRealtimeVoiceOutputActivityTracker(options?: RealtimeVoiceOutputActivityTrackerOptions): RealtimeVoiceOutputActivityTracker;
