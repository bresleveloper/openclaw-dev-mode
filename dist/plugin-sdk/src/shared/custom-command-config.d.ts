/** Raw custom slash-command entry from config. */
export type CustomCommandInput = {
    command?: string | null;
    description?: string | null;
};
/** Validation issue for one configured custom command. */
export type CustomCommandIssue = {
    index: number;
    field: "command" | "description";
    message: string;
};
/** Command validation policy for one command family. */
export type CustomCommandConfig = {
    label: string;
    pattern: RegExp;
    patternDescription: string;
    prefix?: string;
};
/** Normalize a slash command name to the internal lowercase underscore form. */
export declare function normalizeSlashCommandName(value: string): string;
/** Normalize command descriptions without changing user-authored wording. */
export declare function normalizeCommandDescription(value: string): string;
/** Validate and normalize custom command config entries. */
export declare function resolveCustomCommands(params: {
    commands?: CustomCommandInput[] | null;
    reservedCommands?: Set<string>;
    checkReserved?: boolean;
    checkDuplicates?: boolean;
    config: CustomCommandConfig;
}): {
    commands: Array<{
        command: string;
        description: string;
    }>;
    issues: CustomCommandIssue[];
};
