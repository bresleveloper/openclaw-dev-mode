import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import "./types-BnfxNjkF.js";
import { n as CommandArgs } from "./commands-args.types-zglMcgeO.js";
import { n as SkillCommandSpec } from "./types-CHfKS7Qr.js";
import { r as ThinkingCatalogEntry } from "./thinking.shared-B8iFVM3s.js";
import { l as NativeCommandSpec, o as CommandDetection, r as CommandArgDefinition, s as CommandNormalizeOptions, t as ChatCommandDefinition, u as ShouldHandleTextCommandsParams } from "./commands-registry.types-D7aWP8HU.js";
//#region src/auto-reply/commands-registry-list.d.ts
/** Lists built-in commands plus optional skill-provided commands. */
declare function listChatCommands(params?: {
  skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
/** Applies config feature flags to command keys that can be operator-disabled. */
declare function isCommandEnabled(cfg: OpenClawConfig, commandKey: string): boolean;
/** Lists commands visible for a specific config, preserving dynamic skill commands. */
declare function listChatCommandsForConfig(cfg: OpenClawConfig, params?: {
  skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
//#endregion
//#region src/auto-reply/commands-registry-normalize.d.ts
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
/** Returns cached exact and regex detectors for the current command registry instance. */
declare function getCommandDetection(_cfg?: OpenClawConfig): CommandDetection;
/** Resolves a raw text command to the matching normalized alias when known. */
declare function maybeResolveTextAlias(raw: string, cfg?: OpenClawConfig): string | null;
/** Resolves a raw text command into its command definition and raw argument tail. */
declare function resolveTextCommand(raw: string, cfg?: OpenClawConfig): {
  command: ChatCommandDefinition;
  args?: string;
} | null;
//#endregion
//#region src/auto-reply/commands-text-routing.d.ts
/** Returns whether a surface can receive provider-native slash commands. */
declare function isNativeCommandSurface(surface?: string): boolean;
/** Decides whether text slash commands remain active for the current surface/config pair. */
declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
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
/** Formats a command and optional raw argument string as slash-command text. */
declare function buildCommandText(commandName: string, args?: string): string;
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
declare function resolveCommandArgChoices(params: {
  command: ChatCommandDefinition;
  arg: CommandArgDefinition;
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  agentRuntime?: string;
  catalog?: ThinkingCatalogEntry[];
}): ResolvedCommandArgChoice[];
/** Argument-only check for whether a command can still offer an argument menu. */
declare function canResolveCommandArgMenu<T extends {
  command: ChatCommandDefinition;
  args?: CommandArgs;
}>(params: T): params is T & {
  command: ChatCommandDefinition & Required<Pick<ChatCommandDefinition, "args" | "argsMenu">>;
};
/** Resolves the next argument menu to show for commands with selectable choices. */
declare function resolveCommandArgMenu(params: {
  command: ChatCommandDefinition;
  args?: CommandArgs;
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  agentRuntime?: string;
  catalog?: ThinkingCatalogEntry[];
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
/** Returns true for normalized slash-command text. */
declare function isCommandMessage(raw: string): boolean;
//#endregion
export { listChatCommandsForConfig as C, listChatCommands as S, getCommandDetection as _, findCommandByNativeName as a, resolveTextCommand as b, listNativeCommandSpecs as c, parseCommandArgs as d, resolveCommandArgChoices as f, shouldHandleTextCommands as g, isNativeCommandSurface as h, canResolveCommandArgMenu as i, listNativeCommandSpecsForConfig as l, serializeCommandArgs as m, buildCommandText as n, formatCommandArgMenuTitle as o, resolveCommandArgMenu as p, buildCommandTextFromArgs as r, isCommandMessage as s, ResolvedCommandArgChoice as t, mergeNativeCommandSpecs as u, maybeResolveTextAlias as v, isCommandEnabled as x, normalizeCommandBody as y };