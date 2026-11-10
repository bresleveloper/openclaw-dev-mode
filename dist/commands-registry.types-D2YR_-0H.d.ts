import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { r as ThinkingCatalogEntry } from "./thinking.shared-COcvrWJf.js";
//#region src/auto-reply/commands-args.types.d.ts
type CommandArgValues = Record<string, string | number | boolean | bigint>;
type CommandArgs = {
  raw?: string;
  values?: CommandArgValues;
};
//#endregion
//#region src/auto-reply/commands-registry.types.d.ts
/**
 * Controls progressive disclosure of commands in the UI.
 * - "essential": Always visible (~10 core commands)
 * - "standard": Shown on expand / "Show more" (~15 commands)
 * - "power": Only surfaced via search or explicit filter (~15 commands)
 */
type CommandTier = "essential" | "standard" | "power";
type CommandCategory = "session" | "options" | "status" | "management" | "media" | "tools" | "docks";
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
type CommandArgDefinition = {
  name: string;
  description: string;
  type: "string" | "number" | "boolean";
  required?: boolean;
  choices?: CommandArgChoice[] | ((context: CommandArgChoiceContext) => CommandArgChoice[]);
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
  scope: "text" | "native" | "both";
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
type CommandNormalizeOptions = {
  botUsername?: string;
  /** Keeps complete directive/task arguments, including whitespace and later lines. */
  preserveArguments?: boolean;
  /** Strip an explicit command target only while channel bot identity is unavailable. */
  targetedCommandMode?: "pre-identity";
};
type ShouldHandleTextCommandsParams = {
  cfg: OpenClawConfig;
  surface: string;
  commandSource?: "text" | "native";
};
//#endregion
export { CommandNormalizeOptions as a, CommandArgValues as c, CommandArgsParsing as i, CommandArgs as l, CommandArgChoiceContext as n, NativeCommandSpec as o, CommandArgDefinition as r, ShouldHandleTextCommandsParams as s, ChatCommandDefinition as t };