type VoiceWakeConfig = {
    triggers: string[];
    updatedAtMs: number;
};
/** Return the built-in voice wake trigger list. */
export declare function defaultVoiceWakeTriggers(): string[];
/** Load persisted voice wake triggers, falling back to defaults. */
export declare function loadVoiceWakeConfig(baseDir?: string): Promise<VoiceWakeConfig>;
/** Persist the configured voice wake trigger list. */
export declare function setVoiceWakeTriggers(triggers: string[], baseDir?: string): Promise<VoiceWakeConfig>;
export {};
