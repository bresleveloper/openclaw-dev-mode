import { DatabaseSync, SQLInputValue, SQLOutputValue } from "node:sqlite";
//#region src/infra/sql-connection.d.ts
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
interface PostgresSqlConnection extends SqlConnection {
  readonly anchor: DatabaseSync;
  readonly advisoryLockKey: bigint;
  query: (sql: string, parameters?: readonly SQLInputValue[]) => {
    rows: Record<string, SQLOutputValue>[];
    rowCount: number;
    columns: {
      name: string;
    }[];
  };
  runTransaction<T>(operation: () => T, options?: {
    withCommit?: (commit: () => void) => void;
  }, ...modes: [readOnly?: boolean, reserved?: boolean]): T;
}
type EngineConnection = DatabaseSync | PostgresSqlConnection;
//#endregion
export { SqlStatement as i, PostgresSqlConnection as n, SqlConnection as r, EngineConnection as t };