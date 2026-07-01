import { n as SqliteWalMaintenance } from "./sqlite-wal-DK28wyLN.js";
import { DatabaseSync } from "node:sqlite";

//#region src/state/openclaw-state-db.d.ts
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
};
//#endregion
//#region src/state/openclaw-agent-db.paths.d.ts
/**
 * Path helpers for per-agent SQLite state.
 *
 * Agent databases live beside the shared state database root so each agent can
 * own private runtime tables while the shared registry can still discover them.
 */
/** Inputs for resolving one agent SQLite path or directory. */
type OpenClawAgentSqlitePathOptions = {
  agentId: string;
  env?: NodeJS.ProcessEnv;
  path?: string;
};
/** Resolve the SQLite file for one normalized agent id. */
declare function resolveOpenClawAgentSqlitePath(options: OpenClawAgentSqlitePathOptions): string;
//#endregion
//#region src/state/openclaw-agent-db.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving and opening one agent database. */
type OpenClawAgentDatabaseOptions = OpenClawStateDatabaseOptions & {
  agentId: string;
};
/** Initialize agent schema/ownership metadata on an independently managed connection. */
declare function ensureOpenClawAgentDatabaseSchema(db: DatabaseSync, options: OpenClawAgentDatabaseOptions & {
  register?: boolean;
}): void;
//#endregion
export { ensureOpenClawAgentDatabaseSchema as n, resolveOpenClawAgentSqlitePath as r, OpenClawAgentDatabase as t };