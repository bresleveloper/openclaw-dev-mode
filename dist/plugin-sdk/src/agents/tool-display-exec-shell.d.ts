type PreambleResult = {
    command: string;
    chdirPath?: string;
};
/** Removes matching outer single or double quotes from a display token. */
export declare function stripOuterQuotes(value: string | undefined): string | undefined;
/** Splits a command string into shell-ish words while respecting simple quotes and escapes. */
export declare function splitShellWords(input: string | undefined, maxWords?: number): string[];
/** Returns a normalized basename for a command token. */
export declare function binaryName(token: string | undefined): string | undefined;
/** Reads the value for any matching short or long option name. */
export declare function optionValue(words: string[], names: string[]): string | undefined;
/** Returns positional args after skipping options and configured option values. */
export declare function positionalArgs(words: string[], from?: number, optionsWithValue?: string[]): string[];
/** Returns the first positional arg after skipping options and configured option values. */
export declare function firstPositional(words: string[], from?: number, optionsWithValue?: string[]): string | undefined;
/** Removes leading `env` wrappers and VAR=value assignments from parsed words. */
export declare function trimLeadingEnv(words: string[]): string[];
/** Unwraps common `sh -c`/`bash -lc` command wrappers for display parsing. */
export declare function unwrapShellWrapper(command: string): string;
/** Splits a command on top-level stage separators such as `;`, `&&`, and `||`. */
export declare function splitTopLevelStages(command: string): string[];
/** Splits a command on top-level single pipes without splitting `||`. */
export declare function splitTopLevelPipes(command: string): string[];
/** Removes leading setup commands such as exports and cwd changes from display summaries. */
export declare function stripShellPreamble(command: string): PreambleResult;
export {};
