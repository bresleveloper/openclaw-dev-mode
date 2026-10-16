import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import "./agent-harness-runtime-DZjstJNb.js";
//#region src/plugins/command-specs.d.ts
type PluginCommandSpecOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  workspaceDir?: string;
  config?: OpenClawConfig;
};
type PluginCommandSpec = {
  name: string;
  description: string;
  descriptionLocalizations?: Record<string, string>;
  acceptsArgs: boolean;
};
declare function getPluginCommandSpecs(provider?: string, options?: PluginCommandSpecOptions): PluginCommandSpec[];
/** Resolve plugin command specs for a provider's native naming surface without support gating. */
declare function listProviderPluginCommandSpecs(provider?: string): PluginCommandSpec[];
//#endregion
export { listProviderPluginCommandSpecs as n, getPluginCommandSpecs as t };