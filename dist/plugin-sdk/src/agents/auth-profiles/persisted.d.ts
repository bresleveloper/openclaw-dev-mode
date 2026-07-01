import type { OpenClawAgentDatabase } from "../../state/openclaw-agent-db.js";
import type { AuthProfileCredential, AuthProfileSecretsStore, AuthProfileStore } from "./types.js";
/** Legacy auth.json store shape before auth-profiles.json/SQLite. */
type LegacyAuthStore = Record<string, AuthProfileCredential>;
type LoadPersistedAuthProfileStoreOptions = {
    allowKeychainPrompt?: boolean;
    database?: OpenClawAgentDatabase;
};
/** Coerces a persisted auth profile store payload into the current store shape. */
export declare function coercePersistedAuthProfileStore(raw: unknown): AuthProfileStore | null;
/** Merges two auth profile stores, preserving valid runtime external profile metadata. */
export declare function mergeAuthProfileStores(base: AuthProfileStore, override: AuthProfileStore, options?: {
    preserveBaseRuntimeExternalProfiles?: boolean;
}): AuthProfileStore;
/** Builds the persisted secrets store, stripping resolved literals when refs exist. */
export declare function buildPersistedAuthProfileSecretsStore(store: AuthProfileStore, shouldPersistProfile?: (params: {
    profileId: string;
    credential: AuthProfileCredential;
}) => boolean): AuthProfileSecretsStore;
/** Applies legacy auth.json credentials into an auth profile store. */
export declare function applyLegacyAuthStore(store: AuthProfileStore, legacy: LegacyAuthStore): void;
/** Imports the legacy oauth.json file into missing default OAuth profiles. */
export declare function mergeOAuthFileIntoStore(store: AuthProfileStore): boolean;
/** Loads the persisted auth profile store and merges runtime state. */
export declare function loadPersistedAuthProfileStore(agentDir?: string, options?: LoadPersistedAuthProfileStoreOptions): AuthProfileStore | null;
/** Loads the legacy auth.json auth profile store if present. */
export declare function loadLegacyAuthProfileStore(agentDir?: string): LegacyAuthStore | null;
export {};
