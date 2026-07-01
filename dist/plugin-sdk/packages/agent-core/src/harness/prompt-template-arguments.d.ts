import type { PromptTemplate } from "./types.js";
/** Parse an argument string using simple shell-style single and double quotes. */
export declare function parseCommandArgs(argsString: string): string[];
/**
 * Substitute prompt template placeholders (`$1`, `$@`, `$ARGUMENTS`, `${@:N}`, `${@:N:L}`) with command arguments.
 *
 * Unsafe integer placeholders resolve to empty text instead of throwing, so malformed templates cannot abort prompt
 * loading or invocation.
 */
export declare function substituteArgs(content: string, args: string[]): string;
/** Format a prompt template invocation using command-style argument substitution. */
export declare function formatPromptTemplateInvocation(template: PromptTemplate, args?: string[]): string;
