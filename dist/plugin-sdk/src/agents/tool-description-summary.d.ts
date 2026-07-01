/** Build a short one-line summary from a tool description. */
export declare function summarizeToolDescriptionText(params: {
    rawDescription?: string | null;
    displaySummary?: string | null;
    maxLen?: number;
}): string;
/** Build a longer verbose description while excluding schema/action blocks. */
export declare function describeToolForVerbose(params: {
    rawDescription?: string | null;
    fallback: string;
    maxLen?: number;
}): string;
