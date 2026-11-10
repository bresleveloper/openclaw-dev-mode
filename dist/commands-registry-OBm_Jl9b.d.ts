import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { a as CommandNormalizeOptions, l as CommandArgs, n as CommandArgChoiceContext, o as NativeCommandSpec, r as CommandArgDefinition, s as ShouldHandleTextCommandsParams, t as ChatCommandDefinition } from "./commands-registry.types-D2YR_-0H.js";
import { n as SkillCommandSpec } from "./types-CeA70ktN.js";
//#region src/auto-reply/commands-text-routing.d.ts
declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
//#endregion
//#region src/auto-reply/commands-registry-list.d.ts
declare function listChatCommands(params?: {
  skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
//#endregion
//#region src/auto-reply/commands-registry-normalize.d.ts
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
/** Resolves a raw text command to the matching normalized alias when known. */
declare function maybeResolveTextAlias(raw: string, _cfg?: OpenClawConfig): string | null;
//#endregion
//#region src/auto-reply/commands-registry.d.ts
type NativeCommandProviderLookupOptions = {
  includeBundledChannelFallback?: boolean;
};
/** Lists native command specs registered for a provider, including skill commands. */
declare function listNativeCommandSpecs(params?: {
  skillCommands?: SkillCommandSpec[];
  provider?: string;
} & NativeCommandProviderLookupOptions): NativeCommandSpec[];
/** Lists native command specs that are enabled for the provided config. */
declare function listNativeCommandSpecsForConfig(cfg: OpenClawConfig, params?: {
  skillCommands?: SkillCommandSpec[];
  provider?: string;
} & NativeCommandProviderLookupOptions): NativeCommandSpec[];
declare function mergeNativeCommandSpecs(params: {
  primary: readonly NativeCommandSpec[];
  secondary: readonly NativeCommandSpec[];
  onCollision?: (normalizedName: string) => void;
}): NativeCommandSpec[];
/** Finds a command definition by provider-native command name or native alias. */
declare function findCommandByNativeName(name: string, provider?: string, options?: NativeCommandProviderLookupOptions): ChatCommandDefinition | undefined;
/** Parses raw command arguments according to the command definition. */
declare function parseCommandArgs(command: ChatCommandDefinition, raw?: string): CommandArgs | undefined;
/** Serializes parsed command arguments back into a raw argument string. */
declare function serializeCommandArgs(command: ChatCommandDefinition, args?: CommandArgs): string | undefined;
/** Builds slash-command text from a command definition and parsed args. */
declare function buildCommandTextFromArgs(command: ChatCommandDefinition, args?: CommandArgs): string;
type ResolvedCommandArgChoice = {
  value: string;
  label: string;
};
/** Resolves static or context-aware choices for one command argument. */
declare function resolveCommandArgChoices(params: CommandArgChoiceContext): ResolvedCommandArgChoice[];
/** Argument-only check for whether a command can still offer an argument menu. */
declare function canResolveCommandArgMenu<T extends {
  command: ChatCommandDefinition;
  args?: CommandArgs;
}>(params: T): params is T & {
  command: ChatCommandDefinition & Required<Pick<ChatCommandDefinition, "args" | "argsMenu">>;
};
type CommandArgMenuParams = Omit<CommandArgChoiceContext, "arg"> & {
  args?: CommandArgs;
  session?: {
    agentId: string;
    sessionKey: string;
  };
};
type ResolvedCommandArgMenu = {
  arg: CommandArgDefinition;
  choices: ResolvedCommandArgChoice[];
  title?: string;
};
/** @deprecated Use resolveCommandArgMenuAsync. Supported through 2026-12-31. */
declare function resolveCommandArgMenu(params: CommandArgMenuParams): ResolvedCommandArgMenu | null;
/** Resolves menu choices and session-owned status through the asynchronous read owner. */
declare function resolveCommandArgMenuAsync(params: CommandArgMenuParams): Promise<ResolvedCommandArgMenu | null>;
/** Formats the prompt title shown before an argument-choice menu. */
declare function formatCommandArgMenuTitle(params: {
  command: ChatCommandDefinition;
  menu: ResolvedCommandArgMenu;
}): string;
//#endregion
export { listNativeCommandSpecs as a, parseCommandArgs as c, resolveCommandArgMenuAsync as d, serializeCommandArgs as f, shouldHandleTextCommands as g, listChatCommands as h, formatCommandArgMenuTitle as i, resolveCommandArgChoices as l, normalizeCommandBody as m, canResolveCommandArgMenu as n, listNativeCommandSpecsForConfig as o, maybeResolveTextAlias as p, findCommandByNativeName as r, mergeNativeCommandSpecs as s, buildCommandTextFromArgs as t, resolveCommandArgMenu as u };