import { a as SqlStatement, n as PostgresSqlConnection, r as PostgresTransactionOptions, t as EngineConnection } from "./sql-connection-CSeUqY2a.js";
import { r as DatabaseEngineInput } from "./types-C6Nim0qi.js";
import { a as StoreSchema, i as SearchStore, o as StoreSearchCapabilities, r as SearchSchema, t as AdmittedStore } from "./contract-Bt-nPs2h.js";
import { t as getNodeSqliteKysely } from "./kysely-sync-Dr57gDTk.js";
import "./config-CNKL2K9m.js";
import { DatabaseSync, SQLInputValue } from "node:sqlite";
import { Expression, RawBuilder, SqlBool } from "kysely";
import "kysely/helpers/sqlite";
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
  /** Existing-state short leases may retain an idle PG transport in this worker. */
  reusePostgresConnection?: boolean;
  /** Inspection admits the declared source schema without running its migration. */
  existingVersion?: boolean;
  /** Bind owner-local state inside the new anchor transaction before connecting. */
  onFreshAnchor?: (anchor: DatabaseSync) => void;
  admitPostgres?: (db: PostgresSqlConnection, fresh: boolean) => void;
  beforeMigrate?: AdmittedStore["beforeMigrate"];
  /** Family custody for schema writes; shared state defaults to its physical owner. */
  assertMigrationCurrent?: () => void;
  closeOnFailure?: (db: PostgresSqlConnection, error: unknown) => never;
}): EngineConnection;
/** Temporarily admit synchronous boot and migration SQL on the Gateway main thread. */
declare function withEngineStoreAdmission<T>(operation: () => T): T;
type HistoricalOrdering = "sqlite" | "schema-nullability";
/** Restore a predecessor's index policy; generated table DDL owns column nullability. */
declare function withLegacyPostgresIndexOrdering(sql: string, policy?: HistoricalOrdering, schemaSql?: string): string;
/** The schema owner runs this under its existing versioned admission transaction. */
declare function postgresIndexOrderingMigration(sql: string, policy?: HistoricalOrdering): string;
declare class PostgresSyncConnection implements PostgresSqlConnection {
  readonly schema: string;
  readonly anchor: DatabaseSync;
  readonly storeId: string;
  isOpen: boolean;
  isTransaction: boolean;
  mutationRevision: number;
  readonly advisoryLockKey: bigint;
  private bridge?;
  private idleCheckout?;
  private lastResponseAt;
  private readonly bridgeParameters;
  private failure;
  private outcomeUnknown;
  private readOnlyTransaction;
  private pendingWrite;
  private readonly mainThread;
  private readonly reuseKey?;
  private readonly admissionReadOnly;
  private maintenance;
  constructor(url: string, schema: string, anchor: DatabaseSync, storeId: string, options?: {
    lockTimeoutMs?: number;
    statementTimeoutMs?: number;
    reuse?: boolean;
    readOnly?: boolean;
  });
  private connect;
  runTransaction<T>(operation: () => T, options?: PostgresTransactionOptions, ...modes: [readOnly?: boolean, reserved?: boolean]): T;
  readRecoveryGeneration(lock?: boolean): string;
  private loseConnection;
  private finishWrite;
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
  /** Release only the idle backend; the logical reader keeps its admitted facts and anchor. */
  releaseIdleTransport(): void;
  close(): void;
}
/** @experimental Admit an owner's extension, or bind its already admitted indexes. */
declare function admitStoreSearch(store: SearchStore, schema: SearchSchema, options?: {
  extension: string;
}): StoreSearchCapabilities;
/** Worker envelopes need a transaction only on PostgreSQL; native SQLite statements stay identical. */
declare function runEngineWorkerWrite<T>(input: DatabaseEngineInput, operation: () => T, transaction: (operation: () => T) => T): T;
declare function runEngineStoreReadSnapshot<T>(db: Parameters<typeof getNodeSqliteKysely>[0] | PostgresSyncConnection, operation: () => T): T;
declare function jsonPathValue<T = string | null>(db: DatabaseSync | PostgresSqlConnection, value: Expression<unknown>, path: Expression<string>, kind?: "text" | "number" | "json"): RawBuilder<T>;
export { postgresIndexOrderingMigration as a, openEngineStore as c, admitStoreSearch as i, runEngineStoreReadSnapshot as n, withLegacyPostgresIndexOrdering as o, runEngineWorkerWrite as r, withEngineStoreAdmission as s, jsonPathValue as t };