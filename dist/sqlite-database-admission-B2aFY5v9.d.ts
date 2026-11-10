import { n as PostgresSqlConnection } from "./sql-connection-B21fTbHP.js";
import { DatabaseSync } from "node:sqlite";
//#region src/infra/sqlite-worker-identity.d.ts
type DatabaseFileIdentity = Readonly<{
  key: string;
  birthtime?: string;
}>;
type DatabasePathIdentity = DatabaseFileIdentity & Readonly<{
  canonicalPath: string;
}>;
//#endregion
//#region src/infra/sqlite-database-admission-record.d.ts
type AdmissionFact = {
  value: unknown;
  revision: number;
  schemaDependent: boolean;
  publication: string;
  current: SharedArrayBuffer;
};
type ScopedWriteRevision = {
  identity: string;
  state: Int32Array<SharedArrayBuffer>;
};
type Admission = {
  identity: string;
  physicalIdentity: DatabaseFileIdentity;
  location: string;
  descriptor: number;
  descriptorOwner: number;
  generationId: string;
  generation: SharedArrayBuffer;
  /** Last complete host snapshot; relays preserve this value without advancing it. */
  hostRevision?: number;
  writeScopes: Map<string, ScopedWriteRevision>;
  writeScopeRevision: number;
  references: Map<number, SharedArrayBuffer>;
  facts: Map<string, AdmissionFact>;
};
type SqliteDatabaseAdmissionKey<T> = {
  name: string;
  read(this: void, value: unknown): T | undefined;
  schemaDependent?: boolean;
  writer?: "host";
};
//#endregion
//#region src/infra/sqlite-database-admission.d.ts
declare const { retireSqliteDatabaseWriteScopes, withSqliteDatabaseWriteScope, withoutSqliteDatabaseWriteScope, readSqliteDatabaseScopedWriteToken, readSqliteDatabaseScopedWriteTokenForPath, readSqliteDatabaseScopedWriteTokensForPath, readSqliteDatabasePendingScopedWriteToken, readSqliteDatabaseWriteTokenForPath, readSqliteDatabasePendingWriteToken }: {
  begin(database: DatabaseSync, unscoped: boolean): void;
  finish(database: DatabaseSync, record: Admission | undefined): void;
  retireSqliteDatabaseWriteScopes: (database: DatabaseSync, scope: readonly (string | {
    sessionId: string;
  })[]) => void;
  withSqliteDatabaseWriteScope: <T>(database: DatabaseSync, scope: readonly (string | {
    sessionId: string;
  })[], run: () => T) => T;
  withoutSqliteDatabaseWriteScope: <T>(database: DatabaseSync, run: () => T) => T;
  readSqliteDatabaseScopedWriteToken: (database: DatabaseSync, scope: string | readonly (string | {
    sessionId: string;
  })[]) => string | undefined;
  readSqliteDatabaseScopedWriteTokenForPath: (location: string, scope: string | readonly (string | {
    sessionId: string;
  })[]) => string | undefined;
  readSqliteDatabaseScopedWriteTokensForPath: (location: string, scopes: readonly (string | readonly (string | {
    sessionId: string;
  })[])[]) => string[] | undefined;
  readSqliteDatabasePendingScopedWriteToken: (database: DatabaseSync, scope: string | readonly (string | {
    sessionId: string;
  })[]) => string | undefined;
  readSqliteDatabaseWriteTokenForPath: (location: string) => string | undefined;
  readSqliteDatabasePendingWriteToken: (database: DatabaseSync) => string | undefined;
};
declare const { getSqliteDatabaseAdmission, getOrLoadSqliteDatabaseAdmissionForPath }: {
  getSqliteDatabaseAdmission: <T>(database: DatabaseSync | PostgresSqlConnection, key: SqliteDatabaseAdmissionKey<T>, options?: {
    existingOnly?: boolean;
  }) => T | undefined;
  getOrLoadSqliteDatabaseAdmissionForPath: <T>(location: string, key: SqliteDatabaseAdmissionKey<T>, load: () => T | undefined) => T | undefined;
};
//#endregion
export { DatabasePathIdentity as n, DatabaseFileIdentity as t };