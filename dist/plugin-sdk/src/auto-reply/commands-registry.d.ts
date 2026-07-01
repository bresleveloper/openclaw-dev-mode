import type { OpenClawConfig } from "../config/types.js";
import type { SkillCommandSpec } from "../skills/types.js";
import type { ChatCommandDefinition, CommandArgDefinition, CommandArgs, NativeCommandSpec } from "./commands-registry.types.js";
import type { ThinkingCatalogEntry } from "./thinking.shared.js";
export { isCommandEnabled, listChatCommands, listChatCommandsForConfig, } from "./commands-registry-list.js";
export { getCommandDetection, maybeResolveTextAlias, normalizeCommandBody, resolveTextCommand, } from "./commands-registry-normalize.js";
export { isNativeCommandSurface, shouldHandleTextCommands } from "./commands-text-routing.js";
export type { ChatCommandDefinition, CommandArgChoiceContext, CommandArgDefinition, CommandArgMenuSpec, CommandArgValues, CommandArgs, CommandDetection, CommandNormalizeOptions, CommandScope, NativeCommandSpec, ShouldHandleTextCommandsParams, } from "./commands-registry.types.js";
type NativeCommandProviderLookupOptions = {
    includeBundledChannelFallback?: boolean;
};
/** Lists native command specs registered for a provider, including skill commands. */
export declare function listNativeCommandSpecs(params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
}): NativeCommandSpec[];
/** Lists native command specs that are enabled for the provided config. */
export declare function listNativeCommandSpecsForConfig(cfg: OpenClawConfig, params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
}): NativeCommandSpec[];
/** Finds a command definition by provider-native command name or native alias. */
export declare function findCommandByNativeName(name: string, provider?: string, options?: NativeCommandProviderLookupOptions): ChatCommandDefinition | undefined;
/** Formats a command and optional raw argument string as slash-command text. */
export declare function buildCommandText(commandName: string, args?: string): string;
/** Parses raw command arguments according to the command definition. */
export declare function parseCommandArgs(command: ChatCommandDefinition, raw?: string): CommandArgs | undefined;
/** Serializes parsed command arguments back into a raw argument string. */
export declare function serializeCommandArgs(command: ChatCommandDefinition, args?: CommandArgs): string | undefined;
/** Builds slash-command text from a command definition and parsed args. */
export declare function buildCommandTextFromArgs(command: ChatCommandDefinition, args?: CommandArgs): string;
export type ResolvedCommandArgChoice = {
    value: string;
    label: string;
};
/** Resolves static or context-aware choices for one command argument. */
export declare function resolveCommandArgChoices(params: {
    command: ChatCommandDefinition;
    arg: CommandArgDefinition;
    cfg?: OpenClawConfig;
    provider?: string;
    model?: string;
    catalog?: ThinkingCatalogEntry[];
}): ResolvedCommandArgChoice[];
/** Resolves the next argument menu to show for commands with selectable choices. */
export declare function resolveCommandArgMenu(params: {
    command: ChatCommandDefinition;
    args?: CommandArgs;
    cfg?: OpenClawConfig;
    provider?: string;
    model?: string;
    catalog?: ThinkingCatalogEntry[];
}): {
    arg: CommandArgDefinition;
    choices: ResolvedCommandArgChoice[];
    title?: string;
} | null;
/** Formats the prompt title shown before an argument-choice menu. */
export declare function formatCommandArgMenuTitle(params: {
    command: ChatCommandDefinition;
    menu: NonNullable<ReturnType<typeof resolveCommandArgMenu>>;
}): string;
/** Returns true for normalized slash-command text. */
export declare function isCommandMessage(raw: string): boolean;
