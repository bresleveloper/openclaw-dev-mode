import type { DatabaseSync } from "node:sqlite";
import type { CompiledQuery, Kysely, QueryResult } from "kysely";
type CompilableQuery<Row = unknown> = {
    compile(): CompiledQuery<Row>;
};
export declare function getNodeSqliteKysely<Database>(db: DatabaseSync): Kysely<Database>;
/** Execute a compiled Kysely query synchronously against node:sqlite. */
export declare function executeCompiledSqliteQuerySync<Row>(db: DatabaseSync, compiledQuery: CompiledQuery<Row>): QueryResult<Row>;
/** Compile and execute a Kysely query synchronously. */
export declare function executeSqliteQuerySync<Row>(db: DatabaseSync, query: CompilableQuery<Row>): QueryResult<Row>;
/** Execute a Kysely query synchronously and return its first row. */
export declare function executeSqliteQueryTakeFirstSync<Row>(db: DatabaseSync, query: CompilableQuery<Row>): Row | undefined;
/** Drop the cached Kysely facade for a DatabaseSync after close/test reset. */
export declare function clearNodeSqliteKyselyCacheForDatabase(db: DatabaseSync): void;
export {};
