/** Parsed set/unset action or a user-facing parse error. */
export type SetUnsetParseResult = {
    kind: "set";
    path: string;
    value: unknown;
} | {
    kind: "unset";
    path: string;
} | {
    kind: "error";
    message: string;
};
/** Parses `set path=value` or `unset path` command arguments. */
export declare function parseSetUnsetCommand(params: {
    slash: string;
    action: "set" | "unset";
    args: string;
}): SetUnsetParseResult;
/** Dispatches parsed set/unset action into caller-provided callbacks. */
export declare function parseSetUnsetCommandAction<T>(params: {
    slash: string;
    action: string;
    args: string;
    onSet: (path: string, value: unknown) => T;
    onUnset: (path: string) => T;
    onError: (message: string) => T;
}): T | null;
/** Parses a slash command whose actions include set/unset plus custom actions. */
export declare function parseSlashCommandWithSetUnset<T>(params: {
    raw: string;
    slash: string;
    invalidMessage: string;
    usageMessage: string;
    onKnownAction: (action: string, args: string) => T | undefined;
    onSet: (path: string, value: unknown) => T;
    onUnset: (path: string) => T;
    onError: (message: string) => T;
}): T | null;
