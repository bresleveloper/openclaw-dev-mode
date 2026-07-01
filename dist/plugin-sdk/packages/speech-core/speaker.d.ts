export type SpeakerSelectionConfig = Record<string, unknown>;
/** Populate canonical and legacy speaker voice fields together. */
export declare function withSpeakerSelectionCompat(config: SpeakerSelectionConfig | undefined): SpeakerSelectionConfig;
/** Fill legacy speaker fields only when callers have not set them explicitly. */
export declare function withSpeakerSelectionFallbackCompat(config: SpeakerSelectionConfig | undefined): SpeakerSelectionConfig;
