import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginCommandRegistration } from "./registry-types.js";
type PluginCommandSpecOptions = {
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
    workspaceDir?: string;
    config?: OpenClawConfig;
};
export type PluginCommandEntrySpec = {
    name: string;
    description: string;
    acceptsArgs: boolean;
    nativeName?: string;
};
export declare function getPluginCommandSpecs(provider?: string, options?: PluginCommandSpecOptions): Array<{
    name: string;
    description: string;
    descriptionLocalizations?: Record<string, string>;
    acceptsArgs: boolean;
}>;
export declare function getPluginCommandEntrySpecs(provider?: string, options?: PluginCommandSpecOptions): PluginCommandEntrySpec[];
export declare function getPluginCommandEntrySpecsFromRegistrations(commands: readonly PluginCommandRegistration[], provider?: string, options?: PluginCommandSpecOptions): PluginCommandEntrySpec[];
/** Resolve plugin command specs for a provider's native naming surface without support gating. */
export declare function listProviderPluginCommandSpecs(provider?: string): Array<{
    name: string;
    description: string;
    descriptionLocalizations?: Record<string, string>;
    acceptsArgs: boolean;
}>;
export {};
