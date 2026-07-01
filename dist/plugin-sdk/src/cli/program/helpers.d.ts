import { type Command } from "commander";
/** Commander option collector for repeatable string flags. */
export declare function collectOption(value: string, previous?: string[]): string[];
/** Parse an optional positive integer, treating empty values as unset. */
export declare function parsePositiveIntOrUndefined(value: unknown): number | undefined;
/** Parse a positive integer without treating empty values specially. */
export declare function parseStrictPositiveIntOrUndefined(value: unknown): number | undefined;
/** Commander argument parser for required positive integer options. */
export declare function parseStrictPositiveIntOption(value: string, flag: string): number;
/** Return positional args captured by a Commander action command. */
export declare function resolveActionArgs(actionCommand?: Command): string[];
/** Reconstruct explicit option tokens from a Commander command for lazy reparsing. */
export declare function resolveCommandOptionArgs(command?: Command): string[];
