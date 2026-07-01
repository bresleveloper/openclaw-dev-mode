import type { AuthProfileStore } from "./types.js";
/** Reads a cloned runtime auth profile store snapshot for an agent dir. */
export declare function getRuntimeAuthProfileStoreSnapshot(agentDir?: string): AuthProfileStore | undefined;
/** Returns true when a runtime snapshot exists for an agent dir. */
export declare function hasRuntimeAuthProfileStoreSnapshot(agentDir?: string): boolean;
/** Returns true when requested or main runtime snapshots contain profiles. */
export declare function hasAnyRuntimeAuthProfileStoreSource(agentDir?: string): boolean;
/** Replaces all runtime auth profile snapshots with cloned entries. */
export declare function replaceRuntimeAuthProfileStoreSnapshots(entries: Array<{
    agentDir?: string;
    store: AuthProfileStore;
}>): void;
/** Clears all runtime auth profile snapshots. */
export declare function clearRuntimeAuthProfileStoreSnapshots(): void;
/** Stores a cloned runtime auth profile snapshot for an agent dir. */
export declare function setRuntimeAuthProfileStoreSnapshot(store: AuthProfileStore, agentDir?: string): void;
