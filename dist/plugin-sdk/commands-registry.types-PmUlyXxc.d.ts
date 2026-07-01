import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { t as CommandArgValues } from "./commands-args.types-zglMcgeO.js";

//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
type VerboseLevel = "off" | "on" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Minimal model catalog entry needed to choose thinking defaults. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  api?: string;
  reasoning?: boolean;
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};
//#endregion
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
  description: string; /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  textAliases: string[];
  acceptsArgs?: boolean;
  args?: CommandArgDefinition[];
  argsParsing?: CommandArgsParsing;
  formatArgs?: (values: CommandArgValues) => string | undefined;
  argsMenu?: CommandArgMenuSpec | "auto";
  scope: CommandScope;
  category?: CommandCategory; /** Progressive disclosure tier. Defaults to "standard" when omitted. */
  tier?: CommandTier;
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
export { CommandArgsParsing as a, CommandScope as c, ReasoningLevel as d, ThinkLevel as f, CommandArgMenuSpec as i, NativeCommandSpec as l, VerboseLevel as m, CommandArgChoiceContext as n, CommandDetection as o, ThinkingCatalogEntry as p, CommandArgDefinition as r, CommandNormalizeOptions as s, ChatCommandDefinition as t, ShouldHandleTextCommandsParams as u };