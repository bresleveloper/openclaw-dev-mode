import { a as SqliteWorkerOperations, o as SqliteWorkerStore, t as SqliteWorkerStoreOptions } from "./sqlite-worker-broker.types-DeT6GvxE.js";
import { r as DatabaseEngineInput } from "./config-D5r1YFWG.js";
//#region src/infra/database-engine/worker-store.d.ts
type EngineStoreOptions = SqliteWorkerStoreOptions & {
  existingOnly?: false;
  target?: never;
};
declare function openEngineWorkerStore<Operations extends SqliteWorkerOperations>(options: EngineStoreOptions, input: DatabaseEngineInput): Promise<SqliteWorkerStore<Operations>>;
/** The selected adapter owns the host admission envelope, not a store facade. */
declare function runEngineStoreOperation<Operations extends SqliteWorkerOperations, T>(store: SqliteWorkerStore<Operations>, input: DatabaseEngineInput, writes: boolean, operation: (scope: Pick<SqliteWorkerStore<Operations>, "execute">) => Promise<T>, assertCurrent: (() => void) | undefined, databasePath: string): Promise<T>;
//#endregion
export { runEngineStoreOperation as n, openEngineWorkerStore as t };