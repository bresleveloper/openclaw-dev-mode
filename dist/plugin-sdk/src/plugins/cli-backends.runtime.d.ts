import type { CliBackendPlugin } from "./cli-backend.types.js";
/** Runtime CLI backend registration with owning plugin id. */
export type PluginCliBackendEntry = CliBackendPlugin & {
    pluginId: string;
};
/** Resolves CLI backends from the active runtime plugin registry. */
export declare function resolveRuntimeCliBackends(): PluginCliBackendEntry[];
