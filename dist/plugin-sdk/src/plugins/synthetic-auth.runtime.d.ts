import type { LoadPluginRegistryParams, PluginRegistrySnapshot } from "./plugin-registry.js";
type SyntheticAuthProviderRefParams = LoadPluginRegistryParams & {
    index?: PluginRegistrySnapshot;
    registryDiagnostics?: readonly unknown[];
};
/** Lists provider refs that can satisfy synthetic auth profile lookups. */
export declare function resolveRuntimeSyntheticAuthProviderRefs(params?: SyntheticAuthProviderRefParams): string[];
/** Returns synthetic-auth refs plus whether the control-plane data source was complete. */
export declare function resolveRuntimeSyntheticAuthProviderRefState(params?: SyntheticAuthProviderRefParams): {
    refs: string[];
    complete: boolean;
};
/** Lists provider refs that can expose external auth profiles to runtime consumers. */
export declare function resolveRuntimeExternalAuthProviderRefs(params?: SyntheticAuthProviderRefParams): string[];
export {};
