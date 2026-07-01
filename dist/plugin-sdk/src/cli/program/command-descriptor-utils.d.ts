import type { Command } from "commander";
import type { NamedCommandDescriptor } from "./command-group-descriptors.js";
/** Minimal descriptor shape used before a command is fully registered. */
export type CommandDescriptorLike = Pick<NamedCommandDescriptor, "name" | "description">;
/** Descriptor catalog plus derived name lists used by lazy command registration. */
export type CommandDescriptorCatalog<TDescriptor extends NamedCommandDescriptor> = {
    descriptors: readonly TDescriptor[];
    getDescriptors: () => readonly TDescriptor[];
    getNames: () => string[];
    getCommandsWithSubcommands: () => string[];
    getParentDefaultHelpCommands: () => string[];
};
/** Normalize and validate a command descriptor name for safe Commander registration. */
export declare function normalizeCommandDescriptorName(name: string): string | null;
/** Strip unsafe terminal content from descriptor descriptions. */
export declare function sanitizeCommandDescriptorDescription(description: string): string;
/** Return descriptor names in registration order. */
export declare function getCommandDescriptorNames(descriptors: readonly CommandDescriptorLike[]): string[];
/** Return descriptor names that should remain parent commands with subcommands. */
export declare function getCommandsWithSubcommands(descriptors: readonly NamedCommandDescriptor[]): string[];
/** Return descriptors whose parent command should show help by default. */
export declare function getParentDefaultHelpCommands(descriptors: readonly NamedCommandDescriptor[]): string[];
/** Merge descriptor groups while keeping the first descriptor for each command name. */
export declare function collectUniqueCommandDescriptors<TDescriptor extends CommandDescriptorLike>(descriptorGroups: readonly (readonly TDescriptor[])[]): TDescriptor[];
/** Create a descriptor catalog with stable derived lists. */
export declare function defineCommandDescriptorCatalog<TDescriptor extends NamedCommandDescriptor>(descriptors: readonly TDescriptor[]): CommandDescriptorCatalog<TDescriptor>;
/** Add safe placeholder commands to Commander without duplicating existing command names. */
export declare function addCommandDescriptorsToProgram(program: Command, descriptors: readonly CommandDescriptorLike[], existingCommands?: Set<string>): Set<string>;
