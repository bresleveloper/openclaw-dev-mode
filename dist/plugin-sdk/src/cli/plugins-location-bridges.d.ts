import type { ExternalizedBundledPluginBridge } from "../plugins/externalized-bundled-plugins.js";
export type PersistedBundledPluginRecoveryLocation = {
    pluginId: string;
    loadPaths: readonly string[];
};
/** List install bridges inferred from the persisted plugin index before current discovery runs. */
export declare function listPersistedBundledPluginLocationBridges(options: {
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Promise<readonly ExternalizedBundledPluginBridge[]>;
/** List exact previous bundled paths that an explicit plugin reinstall may recover. */
export declare function listPersistedBundledPluginRecoveryLocations(options: {
    env?: NodeJS.ProcessEnv;
}): Promise<readonly PersistedBundledPluginRecoveryLocation[]>;
