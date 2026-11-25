import { c as SqliteWorkerOperations, l as SqliteWorkerStore, t as SqliteWorkerStoreOptions } from "../sqlite-worker-broker.types-nFn1HEVb.js";
import { r as DatabaseEngineInput, t as DatabaseEngineFamily } from "../types-C6Nim0qi.js";
import { t as resolveDatabaseEngineInput } from "../config-CNKL2K9m.js";
/** Each store consumes its boot-selected family without resolving configuration again. */
export declare function getDatabaseEngineInput(family: DatabaseEngineFamily): DatabaseEngineInput;
type EngineStoreOptions = SqliteWorkerStoreOptions & {
  existingOnly?: false;
  target?: never;
};
export declare function openEngineWorkerStore<Operations extends SqliteWorkerOperations>(options: EngineStoreOptions, input: DatabaseEngineInput): Promise<SqliteWorkerStore<Operations>>;
/** The selected adapter owns the host admission envelope, not a store facade. */
export declare function runEngineStoreOperation<Operations extends SqliteWorkerOperations, T>(store: SqliteWorkerStore<Operations>, input: DatabaseEngineInput, writes: boolean, operation: (scope: Pick<SqliteWorkerStore<Operations>, "execute">) => Promise<T>, assertCurrent: (() => void) | undefined, databasePath: string): Promise<T>;
export { type DatabaseEngineInput, resolveDatabaseEngineInput };