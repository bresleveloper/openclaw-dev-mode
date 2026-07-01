/** Provider hook for session keys that maintenance/pruning should preserve. */
export type SessionMaintenancePreserveKeysProvider = () => Iterable<string> | undefined;
/** Registers a provider for session maintenance preserve keys. */
export declare function registerSessionMaintenancePreserveKeysProvider(provider: SessionMaintenancePreserveKeysProvider): () => void;
/** Collects normalized session keys that maintenance/pruning must preserve. */
export declare function collectSessionMaintenancePreserveKeys(baseKeys?: Iterable<string | undefined>): Set<string> | undefined;
