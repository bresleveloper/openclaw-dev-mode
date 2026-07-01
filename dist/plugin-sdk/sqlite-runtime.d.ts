import { n as ensureOpenClawAgentDatabaseSchema, r as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-B-F-AnOy.js";
import { DatabaseSync } from "node:sqlite";

//#region src/infra/sqlite-transaction.d.ts
declare function runSqliteImmediateTransactionSync<T>(db: DatabaseSync, operation: () => T): T;
//#endregion
export { ensureOpenClawAgentDatabaseSchema, resolveOpenClawAgentSqlitePath, runSqliteImmediateTransactionSync };