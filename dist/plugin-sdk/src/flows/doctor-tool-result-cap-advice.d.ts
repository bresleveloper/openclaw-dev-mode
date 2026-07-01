export type ToolResultCapDoctorAdviceParams = {
    contextWindowTokens: number;
    modelKey: string;
    configuredCap?: number;
    deep?: boolean;
    scopeLabel?: string;
};
/** Builds human-readable doctor lines for stale or ineffective toolResultMaxChars settings. */
export declare function buildToolResultCapDoctorAdvice(params: ToolResultCapDoctorAdviceParams): string[];
