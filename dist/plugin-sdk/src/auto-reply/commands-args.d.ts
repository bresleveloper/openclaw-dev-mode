import type { CommandArgValues } from "./commands-registry.types.js";
type CommandArgsFormatter = (values: CommandArgValues) => string | undefined;
/** Command-specific serializers used when rebuilding slash-command text from parsed args. */
export declare const COMMAND_ARG_FORMATTERS: Record<string, CommandArgsFormatter>;
export {};
