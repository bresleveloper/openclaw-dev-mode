import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import "./types-BnfxNjkF.js";
import { t as CommandArgValues } from "./commands-args.types-zglMcgeO.js";
import { r as ThinkingCatalogEntry } from "./thinking.shared-B8iFVM3s.js";
//#region src/auto-reply/commands-registry.types.d.ts
/** Where a command may be invoked. */
type CommandScope = "text" | "native" | "both";
/**
 * Controls progressive disclosure of commands in the UI.
 * - "essential": Always visible (~10 core commands)
 * - "standard": Shown on expand / "Show more" (~15 commands)
 * - "power": Only surfaced via search or explicit filter (~15 commands)
 */
type CommandTier = "essential" | "standard" | "power";
type CommandCategory = "session" | "options" | "status" | "management" | "media" | "tools" | "docks";
/** Primitive command argument kinds supported by native command surfaces. */
type CommandArgType = "string" | "number" | "boolean";
/** Context passed to dynamic command argument choice providers. */
type CommandArgChoiceContext = {
  cfg?: OpenClawConfig;
  provider?: string;
  model?: string;
  agentRuntime?: string;
  catalog?: ThinkingCatalogEntry[];
  command: ChatCommandDefinition;
  arg: CommandArgDefinition;
};
type CommandArgChoice = string | {
  value: string;
  label: string;
};
type CommandArgChoicesProvider = (context: CommandArgChoiceContext) => CommandArgChoice[];
/** One positional argument accepted by a chat command. */
type CommandArgDefinition = {
  name: string;
  description: string;
  type: CommandArgType;
  required?: boolean;
  choices?: CommandArgChoice[] | CommandArgChoicesProvider;
  preferAutocomplete?: boolean;
  captureRemaining?: boolean;
};
/** Menu metadata for commands that should prompt for a missing argument. */
type CommandArgMenuSpec = {
  arg: string;
  title?: string;
};
type CommandArgsParsing = "none" | "positional";
/** Canonical registry entry for one chat command across text and native surfaces. */
type ChatCommandDefinition = {
  key: string;
  nativeName?: string;
  nativeAliases?: string[];
  nativeProviders?: string[];
  description: string;
  /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  textAliases: string[];
  acceptsArgs?: boolean;
  args?: CommandArgDefinition[];
  argsParsing?: CommandArgsParsing;
  formatArgs?: (values: CommandArgValues) => string | undefined;
  argsMenu?: CommandArgMenuSpec | "auto";
  scope: CommandScope;
  category?: CommandCategory;
  /** Progressive disclosure tier. Defaults to "standard" when omitted. */
  tier?: CommandTier;
  /** Handler is safe to resolve while another run owns the session execution slot. */
  activeRunSafe?: true;
  /** Browser command forms that do not need the selected chat model; authorization still applies. */
  modelIndependent?: "always" | "no-args" | "directive" | ((args: string) => boolean);
};
/** Provider-facing native command registration shape. */
type NativeCommandSpec = {
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
  args?: CommandArgDefinition[];
  isAlias?: boolean;
};
/** Extra context used when normalizing slash command text. */
type CommandNormalizeOptions = {
  botUsername?: string;
  /** Keeps complete directive/task arguments, including whitespace and later lines. */
  preserveArguments?: boolean;
  /** Strip an explicit command target only while channel bot identity is unavailable. */
  targetedCommandMode?: "pre-identity";
};
/** Cached exact/regex command detector built from current registry aliases. */
type CommandDetection = {
  exact: Set<string>;
  regex: RegExp;
};
/** Inputs for deciding whether text slash commands should run on a surface. */
type ShouldHandleTextCommandsParams = {
  cfg: OpenClawConfig;
  surface: string;
  commandSource?: "text" | "native";
};
//#endregion
export { CommandArgsParsing as a, CommandScope as c, CommandArgMenuSpec as i, NativeCommandSpec as l, CommandArgChoiceContext as n, CommandDetection as o, CommandArgDefinition as r, CommandNormalizeOptions as s, ChatCommandDefinition as t, ShouldHandleTextCommandsParams as u };