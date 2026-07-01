type SystemRunCommandValidation = {
    ok: true;
    shellPayload: string | null;
    commandText: string;
    previewText: string | null;
} | {
    ok: false;
    message: string;
    details?: Record<string, unknown>;
};
type ResolvedSystemRunCommand = {
    ok: true;
    argv: string[];
    commandText: string;
    shellPayload: string | null;
    previewText: string | null;
} | {
    ok: false;
    message: string;
    details?: Record<string, unknown>;
};
/** Format argv with minimal shell-style quoting for display and consistency checks. */
export declare function formatExecCommand(argv: string[]): string;
/** Extract the inline shell payload carried by a shell wrapper argv. */
export declare function extractShellCommandFromArgv(argv: string[]): string | null;
export declare function validateSystemRunCommandConsistency(params: {
    argv: string[];
    rawCommand?: string | null;
    allowLegacyShellText?: boolean;
}): SystemRunCommandValidation;
/** Resolve request command fields while accepting the legacy shell-preview text. */
export declare function resolveSystemRunCommandRequest(params: {
    command?: unknown;
    rawCommand?: unknown;
}): ResolvedSystemRunCommand;
export {};
