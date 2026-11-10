import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { Ha as OpenClawPluginCommandDefinition } from "./config-contracts-CY87ANNp.js";
//#region src/plugins/command-specs.d.ts
type PluginCommandSpecOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
};
type PluginCommandSpec = ReturnType<typeof serializePluginCommandSpec>;
declare function getPluginCommandSpecs(provider?: string, options?: PluginCommandSpecOptions): PluginCommandSpec[];
/** Resolve plugin command specs for a provider's native naming surface without support gating. */
declare function listProviderPluginCommandSpecs(provider?: string): PluginCommandSpec[];
declare function serializePluginCommandSpec(cmd: OpenClawPluginCommandDefinition, provider?: string): {
  name: string;
  description: string;
  acceptsArgs: boolean;
  descriptionLocalizations?: {
    [x: string]: string;
  } | undefined;
};
//#endregion
export { listProviderPluginCommandSpecs as n, getPluginCommandSpecs as t };