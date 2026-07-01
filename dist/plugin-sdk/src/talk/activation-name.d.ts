export declare const REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS = 2;
/** Transcript edge where an activation name was heard. */
export type RealtimeVoiceActivationNameEdge = "leading" | "trailing";
/** Whether the heard name matched exactly or through the guarded fuzzy path. */
export type RealtimeVoiceActivationNameMatchKind = "exact" | "fuzzy";
/** Activation-name match result plus transcript text with the name removed. */
export type RealtimeVoiceActivationNameTranscriptResult = {
    allowed: true;
    text: string;
    activationName: string;
    heardName: string;
    match: RealtimeVoiceActivationNameMatchKind;
    edge: RealtimeVoiceActivationNameEdge;
} | {
    allowed: false;
    text: string;
};
/** Count alphanumeric words in a configured activation name. */
export declare function realtimeVoiceActivationNameWordCount(value: string): number;
/** Normalize configured activation names while preserving word boundaries. */
export declare function normalizeRealtimeVoiceActivationName(value: string): string | undefined;
/** Extract the supported leading activation-name prefix from a longer phrase. */
export declare function normalizeRealtimeVoiceActivationNamePrefix(value: string, maxWords?: number): string | undefined;
/** Validate the configured activation name length bound. */
export declare function isSupportedRealtimeVoiceActivationName(value: string, maxWords?: number): boolean;
/** Normalize and reject unsupported activation names in one reusable step. */
export declare function normalizeSupportedRealtimeVoiceActivationName(value: string | undefined, maxWords?: number): string | undefined;
/** Prefer longer names first so nested names match the most specific option. */
export declare function sortRealtimeVoiceActivationNames(names: string[]): string[];
/** Match and strip a configured activation name from either transcript edge. */
export declare function matchRealtimeVoiceActivationName(text: string, activationNames: string[], maxWords?: number): Extract<RealtimeVoiceActivationNameTranscriptResult, {
    allowed: true;
}> | undefined;
