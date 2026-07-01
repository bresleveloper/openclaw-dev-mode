type FacadeModule = {
    CLAUDE_CLI_BACKEND_ID: string;
    isClaudeCliProvider: (providerId: string) => boolean;
};
/** Anthropic plugin backend id for Claude CLI provider detection. */
export declare const CLAUDE_CLI_BACKEND_ID: FacadeModule["CLAUDE_CLI_BACKEND_ID"];
/** Returns whether a provider id belongs to the Claude CLI backend family. */
export declare const isClaudeCliProvider: FacadeModule["isClaudeCliProvider"];
export {};
