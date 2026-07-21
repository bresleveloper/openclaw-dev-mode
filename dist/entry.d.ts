import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { t as PluginLoadOptions } from "./loader-k370OCqn.js";

//#region src/cli/program/root-help.d.ts
/** Options for rendering root help without fully registering the live CLI. */
type RootHelpRenderOptions = Pick<PluginLoadOptions, "pluginSdkResolution"> & {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  includePluginDescriptors?: boolean;
};
//#endregion
//#region src/entry.d.ts
type OutputPrecomputedHelpText = () => boolean;
declare function tryHandleRootHelpFastPath(argv: string[], deps?: {
  outputPrecomputedRootHelpText?: () => boolean;
  outputRootHelp?: (options?: RootHelpRenderOptions) => void | Promise<void>;
  loadRootHelpRenderOptionsForConfigSensitivePlugins?: (env?: NodeJS.ProcessEnv) => Promise<RootHelpRenderOptions | null>;
  onError?: (error: unknown) => void;
  env?: NodeJS.ProcessEnv;
}): Promise<boolean>;
declare function tryHandlePrecomputedCommandHelpFastPath(argv: string[], deps?: {
  outputPrecomputedBrowserHelpText?: OutputPrecomputedHelpText;
  outputPrecomputedSecretsHelpText?: OutputPrecomputedHelpText;
  outputPrecomputedNodesHelpText?: OutputPrecomputedHelpText;
  outputPrecomputedSubcommandHelpText?: (commandName: string) => boolean;
  loadRootHelpRenderOptionsForConfigSensitivePlugins?: (env?: NodeJS.ProcessEnv) => Promise<RootHelpRenderOptions | null>;
  env?: NodeJS.ProcessEnv;
}): Promise<boolean>;
//#endregion
export { tryHandlePrecomputedCommandHelpFastPath, tryHandleRootHelpFastPath };