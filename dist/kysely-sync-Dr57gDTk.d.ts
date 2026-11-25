import { n as PostgresSqlConnection, t as EngineConnection } from "./sql-connection-CSeUqY2a.js";
import { DatabaseSync, SQLInputValue } from "node:sqlite";
import { Kysely, RawBuilder } from "kysely";
declare const { kyselyByDatabase, queryErrorHandlerByDatabase }: {
  kyselyByDatabase: WeakMap<DatabaseSync, unknown>;
  queryErrorHandlerByDatabase: WeakMap<DatabaseSync, (error: unknown) => void>;
};
declare function getNodeSqliteKysely<Database>(db: DatabaseSync | PostgresSqlConnection): Kysely<Database>;
declare function getNodeSqliteKysely<Database>(db: EngineConnection): Kysely<Database>;
export { getNodeSqliteKysely as t };