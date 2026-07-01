/** Signals that an interactive prompt lost stdin before a complete answer arrived. */
export declare class PromptInputClosedError extends Error {
    constructor();
}
/** Prompts for yes/no input, honoring global `--yes` before opening stdin. */
export declare function promptYesNo(question: string, defaultYes?: boolean): Promise<boolean>;
