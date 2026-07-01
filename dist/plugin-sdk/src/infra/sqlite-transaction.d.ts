import type { DatabaseSync } from "node:sqlite";
export declare function runSqliteImmediateTransactionSync<T>(db: DatabaseSync, operation: () => T): T;
