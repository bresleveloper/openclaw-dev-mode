import { DatabaseSync, SQLInputValue, SQLOutputValue } from "node:sqlite";
interface SqlStatement {
  get(...parameters: SQLInputValue[]): Record<string, SQLOutputValue> | undefined;
  all(...parameters: SQLInputValue[]): Record<string, SQLOutputValue>[];
  iterate(...parameters: SQLInputValue[]): IterableIterator<Record<string, SQLOutputValue>>;
  run(...parameters: SQLInputValue[]): {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  };
  columns(): {
    name: string;
  }[];
  setReadBigInts(enabled: boolean): void;
}
interface SqlConnection {
  readonly isOpen: boolean;
  readonly isTransaction: boolean;
  prepare(sql: string): SqlStatement;
  exec(sql: string): void;
  close(): void;
}
type PostgresTransactionOptions = {
  withCommit?: (commit: () => void) => void;
  /** Schema migration and whole-store derived rebuilds use the maintenance budget. */
  maintenance?: boolean;
};
interface PostgresSqlConnection extends SqlConnection {
  readonly anchor: DatabaseSync;
  readonly mutationRevision: number;
  readonly advisoryLockKey: bigint;
  releaseIdleTransport(): void;
  query: (sql: string, parameters?: readonly SQLInputValue[]) => {
    rows: Record<string, SQLOutputValue>[];
    rowCount: number;
    columns: {
      name: string;
    }[];
  };
  runTransaction<T>(operation: () => T, options?: PostgresTransactionOptions, ...modes: [readOnly?: boolean, reserved?: boolean]): T;
}
type EngineConnection = DatabaseSync | PostgresSqlConnection;
export { SqlStatement as a, SqlConnection as i, PostgresSqlConnection as n, PostgresTransactionOptions as r, EngineConnection as t };