import type { Command } from "commander";
/** Placeholder command shown before its lazy group is loaded. */
export type CommandGroupPlaceholder = {
    name: string;
    description: string;
    options?: readonly CommandGroupPlaceholderOption[];
};
/** Commander option metadata attached to a lazy placeholder. */
export type CommandGroupPlaceholderOption = {
    flags: string;
    description: string;
};
/** A lazily registered command group and the names it owns. */
export type CommandGroupEntry = {
    placeholders: readonly CommandGroupPlaceholder[];
    names?: readonly string[];
    register: (program: Command) => Promise<void> | void;
};
/** Return every command name owned by a lazy command group. */
export declare function getCommandGroupNames(entry: CommandGroupEntry): readonly string[];
/** Find the group that owns a command name. */
export declare function findCommandGroupEntry(entries: readonly CommandGroupEntry[], name: string): CommandGroupEntry | undefined;
/** Remove all placeholder/loaded commands owned by a group before replacing it. */
export declare function removeCommandGroupNames(program: Command, entry: CommandGroupEntry): void;
/** Eagerly register one lazy command group by command name. */
export declare function registerCommandGroupByName(program: Command, entries: readonly CommandGroupEntry[], name: string): Promise<boolean>;
/** Register one placeholder that loads and replaces its whole command group on demand. */
export declare function registerLazyCommandGroup(program: Command, entry: CommandGroupEntry, placeholder: CommandGroupPlaceholder): void;
/** Register command groups either eagerly or as lazy placeholders for startup speed. */
export declare function registerCommandGroups(program: Command, entries: readonly CommandGroupEntry[], params: {
    eager: boolean;
    primary: string | null;
    registerPrimaryOnly: boolean;
}): void;
