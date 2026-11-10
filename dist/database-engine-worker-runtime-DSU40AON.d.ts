import { i as SqlStatement, n as PostgresSqlConnection, r as SqlConnection, t as EngineConnection } from "./sql-connection-B21fTbHP.js";
import { n as DatabaseEngineId, r as DatabaseEngineInput } from "./config-D5r1YFWG.js";
import { DatabaseSync, SQLInputValue } from "node:sqlite";
import { Kysely } from "kysely";
//#region src/infra/database-engine/contract.d.ts
type DatabaseErrorKind = "constraint" | "busy" | "connection-lost" | "outcome-unknown" | "other";
type PostgresSchemaFragment = {
  id: string;
  tables: readonly string[];
  sql: string;
  dependencies: readonly string[];
  activation: "first-use" | "version-additive";
};
type PostgresSchemaDefinition = {
  postgres: string;
  postgresFragments?: readonly PostgresSchemaFragment[];
};
type StoreSchema = {
  id: string;
  version: number;
  sqlite: string;
  postgres?: string;
  /** Consecutive destinations carry generated DDL for both sides of the migration. */
  postgresMigrations?: readonly {
    version: number;
    sql: string;
    fromSchema: PostgresSchemaDefinition;
    schema: PostgresSchemaDefinition;
  }[];
  postgresFragments?: readonly PostgresSchemaFragment[];
};
type AdmittedStore = {
  anchor: DatabaseSync;
  schema: StoreSchema;
  input: DatabaseEngineInput;
  openSqlite: () => void;
  storeId?: string;
  namespace?: string;
};
type TransactionRecipes<Connection extends SqlConnection> = {
  write<T>(connection: Connection, operation: () => T): T;
  read<T>(connection: Connection, operation: () => T): T;
};
interface DatabaseEngineAdapter<Connection extends SqlConnection = SqlConnection> {
  id: DatabaseEngineId;
  openConnection(store: AdmittedStore): Connection;
  kysely(connection: Connection): Kysely<unknown>;
  transactions: TransactionRecipes<Connection>;
  capabilities: {
    fullText: "fts5" | "tsvector" | null;
    vector: "sqlite-vec" | "pgvector" | null;
  };
  schema: {
    bootstrap(store: AdmittedStore, connection: Connection): void;
    migrate(store: AdmittedStore, from: number, connection: Connection): void;
  };
  classifyError(error: unknown): DatabaseErrorKind;
}
//#endregion
//#region src/infra/database-engine/open.d.ts
/** Reuses the physical SQLite admission exchange across worker handles and idle reopen. */
declare function openEngineStore(ref: {
  anchor: DatabaseSync;
  schema: StoreSchema;
  input?: DatabaseEngineInput;
  openSqlite: () => void;
  prepareAnchor: () => void;
  inspectSqlite: () => {
    hasExistingData: boolean;
    hasEngineAnchor: boolean;
  };
  existingOnly?: boolean;
  admitPostgres?: (db: PostgresSqlConnection, fresh: boolean) => void;
  closeOnFailure?: (db: PostgresSqlConnection, error: unknown) => never;
}): EngineConnection;
//#endregion
//#region src/infra/database-engine/admission-scope.d.ts
/** Main-thread SQL is limited to the synchronous boot admission or migration callback. */
declare function withEngineStoreAdmission<T>(operation: () => T): T;
//#endregion
//#region src/infra/kysely-sync-cache-state.d.ts
declare const { kyselyByDatabase, queryErrorHandlerByDatabase }: {
  kyselyByDatabase: WeakMap<DatabaseSync, unknown>;
  queryErrorHandlerByDatabase: WeakMap<DatabaseSync, (error: unknown) => void>;
};
//#endregion
//#region src/infra/kysely-sync.d.ts
declare function getNodeSqliteKysely<Database>(db: DatabaseSync | PostgresSqlConnection): Kysely<Database>;
declare function getNodeSqliteKysely<Database>(db: EngineConnection): Kysely<Database>;
//#endregion
//#region src/infra/postgres-sync/connection.d.ts
declare class PostgresSyncConnection implements PostgresSqlConnection {
  readonly schema: string;
  readonly anchor: DatabaseSync;
  isOpen: boolean;
  isTransaction: boolean;
  readonly advisoryLockKey: bigint;
  private readonly port;
  private readonly control;
  private readonly worker;
  private failure;
  private requestId;
  private outcomeUnknown;
  private readonly mainThread;
  constructor(url: string, schema: string, anchor: DatabaseSync, storeId: string, options?: {
    lockTimeoutMs?: number;
    statementTimeoutMs?: number;
  });
  runTransaction<T>(operation: () => T, options?: {
    withCommit?: (commit: () => void) => void;
  }, ...modes: [readOnly?: boolean, reserved?: boolean]): T;
  private loseConnection;
  private assertOpen;
  private request;
  query(sql: string, parameters?: readonly SQLInputValue[], readBigInts?: boolean): {
    rows: {
      [k: string]: import("node:sqlite").SQLOutputValue;
    }[];
    rowCount: number;
    columns: {
      name: string;
    }[];
  };
  private execute;
  exec(sql: string): void;
  prepare(sql: string): SqlStatement;
  close(): void;
}
//#endregion
//#region src/infra/database-engine/adapters.d.ts
/** Worker envelopes need a transaction only on PostgreSQL; native SQLite statements stay identical. */
declare function runEngineWorkerWrite<T>(input: DatabaseEngineInput, operation: () => T, transaction: (operation: () => T) => T): T;
declare function runEngineStoreReadSnapshot<T>(db: Parameters<typeof getNodeSqliteKysely>[0] | PostgresSyncConnection, operation: () => T): T;
//#endregion
export { DatabaseEngineAdapter as a, openEngineStore as i, runEngineWorkerWrite as n, StoreSchema as o, withEngineStoreAdmission as r, runEngineStoreReadSnapshot as t };