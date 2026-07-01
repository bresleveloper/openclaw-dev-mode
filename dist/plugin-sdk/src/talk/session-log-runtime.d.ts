import type { RealtimeVoiceBridgeEvent, RealtimeVoiceRole } from "./provider-types.js";
/** Ring-buffer entry for transcript text used by Talk health and echo suppression. */
export type RealtimeVoiceTranscriptEntry = {
    at: string;
    role: RealtimeVoiceRole;
    text: string;
};
/** Compact health snapshot exposed to diagnostics without dumping full transcript history. */
export type RealtimeVoiceTranscriptHealth = {
    realtimeTranscriptLines: number;
    lastRealtimeTranscriptAt?: string;
    lastRealtimeTranscriptRole?: RealtimeVoiceRole;
    lastRealtimeTranscriptText?: string;
    recentRealtimeTranscript: RealtimeVoiceTranscriptEntry[];
};
/** Bridge event plus capture time, kept separate from provider event payload shape. */
export type RealtimeVoiceBridgeEventLogEntry = RealtimeVoiceBridgeEvent & {
    at: string;
};
/** Compact health snapshot of recent realtime bridge events. */
export type RealtimeVoiceBridgeEventHealth = {
    lastRealtimeEventAt?: string;
    lastRealtimeEventType?: string;
    lastRealtimeEventDetail?: string;
    recentRealtimeEvents: RealtimeVoiceBridgeEventLogEntry[];
};
/** Appends a transcript entry and trims old rows in-place to bound Talk diagnostics memory. */
export declare function recordRealtimeVoiceTranscript(transcript: RealtimeVoiceTranscriptEntry[], role: RealtimeVoiceRole, text: string, maxEntries?: number): RealtimeVoiceTranscriptEntry;
/** Summarizes transcript history for health endpoints and UI diagnostics. */
export declare function getRealtimeVoiceTranscriptHealth(transcript: RealtimeVoiceTranscriptEntry[]): RealtimeVoiceTranscriptHealth;
/** Records low-volume bridge events while dropping raw audio chunks from diagnostics. */
export declare function recordRealtimeVoiceBridgeEvent(events: RealtimeVoiceBridgeEventLogEntry[], event: RealtimeVoiceBridgeEvent, maxEntries?: number): void;
/** Summarizes recent bridge events without exposing the full rolling event buffer. */
export declare function getRealtimeVoiceBridgeEventHealth(events: RealtimeVoiceBridgeEventLogEntry[]): RealtimeVoiceBridgeEventHealth;
/** Detects user transcript text that likely came from assistant speaker echo, not speech. */
export declare function isLikelyRealtimeVoiceAssistantEchoTranscript(params: {
    transcript: RealtimeVoiceTranscriptEntry[];
    text: string;
    lookbackMs: number;
    nowMs?: number;
}): boolean;
/** Extends input suppression through the estimated playback tail for assistant audio. */
export declare function extendRealtimeVoiceOutputEchoSuppression(params: {
    audio: Buffer;
    bytesPerMs: number;
    tailMs: number;
    nowMs: number;
    lastOutputPlayableUntilMs: number;
    suppressInputUntilMs: number;
}): {
    lastOutputPlayableUntilMs: number;
    suppressInputUntilMs: number;
    durationMs: number;
};
