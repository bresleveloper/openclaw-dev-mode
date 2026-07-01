/** Internal parse state for slash command action extraction. */
export type SlashCommandParseResult = {
    kind: "no-match";
} | {
    kind: "empty";
} | {
    kind: "invalid";
} | {
    kind: "parsed";
    action: string;
    args: string;
};
/** Public slash-command parse result returned to command handlers. */
export type ParsedSlashCommand = {
    ok: true;
    action: string;
    args: string;
} | {
    ok: false;
    message: string;
};
/** Parses a slash command or returns null when the prefix does not match. */
export declare function parseSlashCommandOrNull(raw: string, slash: string, opts: {
    invalidMessage: string;
    defaultAction?: string;
}): ParsedSlashCommand | null;
