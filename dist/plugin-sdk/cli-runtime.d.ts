import { a as readVersionFromPackageJsonForModuleUrl, c as resolveRuntimeServiceVersion, i as readVersionFromBuildInfoForModuleUrl, l as resolveUsableRuntimeVersion, n as RuntimeVersionEnv, o as resolveBinaryVersion, r as VERSION, s as resolveCompatibilityHostVersion, t as RUNTIME_SERVICE_VERSION_FALLBACK, u as resolveVersionFromModuleUrl } from "./version-C1kCd9e0.js";
import { a as parseDurationMs, i as DurationMsParseOptions, o as formatHelpExamples, r as theme, s as runCommandWithRuntime } from "./theme-Cf_5jBQs.js";
import { t as formatCliCommand } from "./command-format-CUz7-yqH.js";
import { Command } from "commander";

//#region src/cli/command-options.d.ts
declare function inheritOptionFromParent<T = unknown>(command: Command | undefined, name: string): T | undefined;
//#endregion
//#region src/cli/program/register-command-groups.d.ts
/** Placeholder command shown before its lazy group is loaded. */
type CommandGroupPlaceholder = {
  name: string;
  description: string;
  options?: readonly CommandGroupPlaceholderOption[];
};
/** Commander option metadata attached to a lazy placeholder. */
type CommandGroupPlaceholderOption = {
  flags: string;
  description: string;
};
/** A lazily registered command group and the names it owns. */
type CommandGroupEntry = {
  placeholders: readonly CommandGroupPlaceholder[];
  names?: readonly string[];
  register: (program: Command) => Promise<void> | void;
};
/** Register command groups either eagerly or as lazy placeholders for startup speed. */
declare function registerCommandGroups(program: Command, entries: readonly CommandGroupEntry[], params: {
  eager: boolean;
  primary: string | null;
  registerPrimaryOnly: boolean;
}): void;
//#endregion
//#region src/cli/argv-invocation.d.ts
type CliArgvInvocation = {
  argv: string[];
  commandPath: string[];
  primary: string | null;
  hasHelpOrVersion: boolean;
  isRootHelpInvocation: boolean;
};
/** Resolves command path and help/version mode from a raw process argv array. */
declare function resolveCliArgvInvocation(argv: string[]): CliArgvInvocation;
//#endregion
//#region src/cli/command-registration-policy.d.ts
declare function shouldEagerRegisterSubcommands(env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/cli/wait.d.ts
declare function waitForever(): Promise<void>;
//#endregion
//#region packages/terminal-core/src/note.d.ts
declare function note(message: unknown, title?: string): void;
//#endregion
//#region packages/terminal-core/src/prompt-style.d.ts
/** Style a prompt title when rich terminal output is active. */
declare const stylePromptTitle: (title?: string) => string | undefined;
//#endregion
export { type CliArgvInvocation, type CommandGroupEntry, type CommandGroupPlaceholder, DurationMsParseOptions, RUNTIME_SERVICE_VERSION_FALLBACK, RuntimeVersionEnv, VERSION, formatCliCommand, formatHelpExamples, inheritOptionFromParent, note, parseDurationMs, readVersionFromBuildInfoForModuleUrl, readVersionFromPackageJsonForModuleUrl, registerCommandGroups, resolveBinaryVersion, resolveCliArgvInvocation, resolveCompatibilityHostVersion, resolveRuntimeServiceVersion, resolveUsableRuntimeVersion, resolveVersionFromModuleUrl, runCommandWithRuntime, shouldEagerRegisterSubcommands, stylePromptTitle, theme, waitForever };