/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Use plugin-local Telegram command config handling for new plugin code.
 */
/** Raw Telegram bot command entry from config. */
export type TelegramCustomCommandInput = {
    /** User-provided command name; leading slash is optional and removed during normalization. */
    command?: string | null;
    /** User-provided Bot API description, trimmed before validation. */
    description?: string | null;
};
/** Validation issue returned for one Telegram custom command entry. */
export type TelegramCustomCommandIssue = {
    /** Zero-based index of the command entry that failed validation. */
    index: number;
    /** Field that should be corrected in the raw command entry. */
    field: "command" | "description";
    /** Operator-facing validation message with the normalized command when available. */
    message: string;
};
/** Returns the Telegram command-name regex accepted by Bot API menu commands. */
export declare function getTelegramCommandNamePattern(): RegExp;
/** Telegram Bot API command-name pattern: a-z, 0-9, underscore, max 32 chars. */
export declare const TELEGRAM_COMMAND_NAME_PATTERN: RegExp;
/** Normalizes user-provided Telegram command names into Bot API form. */
export declare function normalizeTelegramCommandName(
/** Raw command name; leading slash is optional and dashes become underscores. */
value: string): string;
/** Normalizes Telegram command descriptions for Bot API menu registration. */
export declare function normalizeTelegramCommandDescription(
/** Raw command description, trimmed without other text rewriting. */
value: string): string;
/** Validates and normalizes configured Telegram custom commands. */
export declare function resolveTelegramCustomCommands(params: {
    /** Raw configured commands to normalize and validate in order. */
    commands?: TelegramCustomCommandInput[] | null;
    /** Native command names that custom commands must not shadow when reserved checks are enabled. */
    reservedCommands?: Set<string>;
    /** Set false to allow names that overlap native commands. */
    checkReserved?: boolean;
    /** Set false to allow duplicate normalized custom command names. */
    checkDuplicates?: boolean;
}): {
    commands: Array<{
        command: string;
        description: string;
    }>;
    issues: TelegramCustomCommandIssue[];
};
