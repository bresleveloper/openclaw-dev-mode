import type { PluginManifestRecord } from "./manifest-registry.js";
type SetupDescriptorRecord = Pick<PluginManifestRecord, "providers" | "cliBackends" | "providerAuthAliases" | "setup">;
/** Lists setup provider ids and auth aliases owned by one plugin manifest. */
export declare function listSetupProviderIds(record: SetupDescriptorRecord): readonly string[];
/** Lists setup CLI backend ids from setup metadata or manifest contribution ids. */
export declare function listSetupCliBackendIds(record: SetupDescriptorRecord): readonly string[];
export {};
