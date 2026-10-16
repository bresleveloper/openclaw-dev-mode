import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import "./types-C-BtfS0H.js";
import { n as CommandArgs } from "./commands-args.types-zglMcgeO.js";
import { n as SkillCommandSpec } from "./types-D0Cawybo.js";
import { a as CommandNormalizeOptions, n as CommandArgChoiceContext, o as NativeCommandSpec, r as CommandArgDefinition, t as ChatCommandDefinition } from "./commands-registry.types-jZJZUR9T.js";
import "./commands-text-routing-Lq-Px3GV.js";
//#region src/auto-reply/commands-registry-list.d.ts
/** Lists built-in commands plus optional skill-provided commands. */
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
/** Resolves the next argument menu to show for commands with selectable choices. */
declare function resolveCommandArgMenu(params: Omit<CommandArgChoiceContext, "arg"> & {
  args?: CommandArgs;
  session?: {
    agentId: string;
    sessionKey: string;
  };
}): {
  arg: CommandArgDefinition;
  choices: ResolvedCommandArgChoice[];
  title?: string;
} | null;
/** Formats the prompt title shown before an argument-choice menu. */
declare function formatCommandArgMenuTitle(params: {
  command: ChatCommandDefinition;
  menu: NonNullable<ReturnType<typeof resolveCommandArgMenu>>;
}): string;
//#endregion
export { listNativeCommandSpecs as a, parseCommandArgs as c, serializeCommandArgs as d, maybeResolveTextAlias as f, formatCommandArgMenuTitle as i, resolveCommandArgChoices as l, listChatCommands as m, canResolveCommandArgMenu as n, listNativeCommandSpecsForConfig as o, normalizeCommandBody as p, findCommandByNativeName as r, mergeNativeCommandSpecs as s, buildCommandTextFromArgs as t, resolveCommandArgMenu as u };