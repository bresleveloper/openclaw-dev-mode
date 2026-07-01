/** Reason a transcript should be ignored before creating a consult request. */
export type SkippableRealtimeVoiceConsultTranscriptReason = "empty" | "incomplete-transcript" | "trailing-fragment" | "non-actionable-closing";
/** Classify transcript text that is empty, incomplete, fragmented, or non-actionable. */
export declare function classifySkippableRealtimeVoiceConsultTranscript(text: string): SkippableRealtimeVoiceConsultTranscriptReason | undefined;
