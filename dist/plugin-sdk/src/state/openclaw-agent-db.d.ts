import type { DatabaseSync } from "node:sqlite";
import { type SqliteWalMaintenance } from "../infra/sqlite-wal.js";
import { type OpenClawStateDatabaseOptions } from "./openclaw-state-db.js";
export { resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths.js";
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
export type OpenClawAgentDatabase = {
    agentId: string;
    db: DatabaseSync;
    path: string;
    walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving and opening one agent database. */
export type OpenClawAgentDatabaseOptions = OpenClawStateDatabaseOptions & {
    agentId: string;
};
/** Initialize agent schema/ownership metadata on an independently managed connection. */
export declare function ensureOpenClawAgentDatabaseSchema(db: DatabaseSync, options: OpenClawAgentDatabaseOptions & {
    register?: boolean;
}): void;
/** Open or return a cached per-agent database after schema and owner validation. */
export declare function openOpenClawAgentDatabase(options: OpenClawAgentDatabaseOptions): OpenClawAgentDatabase;
/** Run a synchronous immediate transaction against an agent database. */
export declare function runOpenClawAgentWriteTransaction<T>(operation: (database: OpenClawAgentDatabase) => T, options: OpenClawAgentDatabaseOptions): T;
/** Close cached agent databases so tests can remove temp dirs and reopen cleanly. */
export declare function closeOpenClawAgentDatabasesForTest(): void;
