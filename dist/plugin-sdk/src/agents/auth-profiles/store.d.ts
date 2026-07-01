import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { OpenClawAgentDatabase } from "../../state/openclaw-agent-db.js";
import type { ExternalCliAuthDiscovery } from "./external-cli-discovery.js";
import type { AuthProfileStore } from "./types.js";
type LoadAuthProfileStoreOptions = {
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    database?: OpenClawAgentDatabase;
    externalCli?: ExternalCliAuthDiscovery;
    readOnly?: boolean;
    syncExternalCli?: boolean;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
};
type SaveAuthProfileStoreOptions = {
    filterExternalAuthProfiles?: boolean;
    preserveOrderProfileIds?: Iterable<string>;
    preserveStateProfileIds?: Iterable<string>;
    pruneOrderProfileIds?: Iterable<string>;
    syncExternalCli?: boolean;
};
/** Apply an auth store update inside the SQLite write lock. */
export declare function updateAuthProfileStoreWithLock(params: {
    agentDir?: string;
    saveOptions?: SaveAuthProfileStoreOptions;
    updater: (store: AuthProfileStore) => boolean;
}): Promise<AuthProfileStore | null>;
/** Load the main auth profile store with runtime external profiles overlaid. */
export declare function loadAuthProfileStore(): AuthProfileStore;
/** Loads the effective runtime store for an agent, including inherited main profiles. */
export declare function loadAuthProfileStoreForRuntime(agentDir?: string, options?: LoadAuthProfileStoreOptions): AuthProfileStore;
/** Load auth profiles for secret resolution without keychain prompts or writes. */
export declare function loadAuthProfileStoreForSecretsRuntime(agentDir?: string, options?: Pick<LoadAuthProfileStoreOptions, "config" | "externalCli" | "externalCliProviderIds" | "externalCliProfileIds">): AuthProfileStore;
/** Load auth profiles with runtime external profiles removed from the result. */
export declare function loadAuthProfileStoreWithoutExternalProfiles(agentDir?: string, loadOptions?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt">): AuthProfileStore;
/** Ensure an auth store is available, including runtime/external profile overlays. */
export declare function ensureAuthProfileStore(agentDir?: string, options?: {
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    externalCli?: ExternalCliAuthDiscovery;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
    readOnly?: boolean;
    syncExternalCli?: boolean;
}): AuthProfileStore;
/** Ensure an auth store is available without external profile overlays. */
export declare function ensureAuthProfileStoreWithoutExternalProfiles(agentDir?: string, options?: {
    allowKeychainPrompt?: boolean;
    readOnly?: boolean;
    syncExternalCli?: boolean;
}): AuthProfileStore;
/** Find a persisted credential in the scoped store, falling back to the main store. */
export declare function findPersistedAuthProfileCredential(params: {
    agentDir?: string;
    profileId: string;
}): AuthProfileStore["profiles"][string] | undefined;
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
export declare function resolvePersistedAuthProfileOwnerAgentDir(params: {
    agentDir?: string;
    profileId: string;
}): string | undefined;
/** Load the store shape used when applying local-only auth updates. */
export declare function ensureAuthProfileStoreForLocalUpdate(agentDir?: string): AuthProfileStore;
export { hasAnyAuthProfileStoreSource, hasLocalAuthProfileStoreSource } from "./source-check.js";
/** Return the current runtime auth-profile snapshot for an agent dir. */
export declare function getRuntimeAuthProfileStoreSnapshot(agentDir?: string): AuthProfileStore | undefined;
/** Replace runtime auth-profile snapshots, used by tests and prepared runtimes. */
export declare function replaceRuntimeAuthProfileStoreSnapshots(entries: Array<{
    agentDir?: string;
    store: AuthProfileStore;
}>): void;
/** Clear all runtime auth-profile snapshots. */
export declare function clearRuntimeAuthProfileStoreSnapshots(): void;
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
export declare function saveAuthProfileStore(store: AuthProfileStore, agentDir?: string, options?: SaveAuthProfileStoreOptions, database?: OpenClawAgentDatabase): void;
