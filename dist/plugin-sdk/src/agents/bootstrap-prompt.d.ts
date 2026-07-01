/** Builds prompt lines for a full BOOTSTRAP.md workflow handoff. */
export declare function buildFullBootstrapPromptLines(params: {
    readLine: string;
    firstReplyLine: string;
}): string[];
/** Builds prompt lines for a constrained BOOTSTRAP.md workflow handoff. */
export declare function buildLimitedBootstrapPromptLines(params: {
    introLine: string;
    nextStepLine: string;
}): string[];
