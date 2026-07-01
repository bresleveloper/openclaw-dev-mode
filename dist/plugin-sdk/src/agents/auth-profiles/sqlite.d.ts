import { type OpenClawAgentDatabase } from "../../state/openclaw-agent-db.js";
/** Resolves the SQLite database path that stores auth profiles for an agent dir. */
export declare function resolveAuthProfileDatabasePath(agentDir?: string): string;
/** Resolves the SQLite database and sidecar paths used by auth profiles. */
export declare function resolveAuthProfileDatabaseFilePaths(agentDir?: string): string[];
/** Reads the raw persisted secrets-store payload without coercing the schema. */
export declare function readPersistedAuthProfileStoreRaw(agentDir?: string, database?: OpenClawAgentDatabase): unknown;
/** Reads the raw persisted runtime-state payload without coercing the schema. */
export declare function readPersistedAuthProfileStateRaw(agentDir?: string, database?: OpenClawAgentDatabase): unknown;
/** Writes the raw persisted secrets-store payload inside the auth database. */
export declare function writePersistedAuthProfileStoreRaw(payload: unknown, agentDir?: string, database?: OpenClawAgentDatabase): void;
/** Deletes the persisted secrets-store row while leaving runtime state intact. */
export declare function deletePersistedAuthProfileStoreRaw(agentDir?: string, database?: OpenClawAgentDatabase): void;
/** Writes or deletes the persisted runtime-state payload. */
export declare function writePersistedAuthProfileStateRaw(payload: unknown, agentDir?: string, database?: OpenClawAgentDatabase): void;
/** Runs an auth-profile database write transaction for store/state updates. */
export declare function runAuthProfileWriteTransaction<T>(agentDir: string | undefined, operation: (database: OpenClawAgentDatabase) => T): T;
