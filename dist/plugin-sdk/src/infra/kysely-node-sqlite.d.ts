import type { DatabaseSync } from "node:sqlite";
import type { DatabaseConnection, DatabaseIntrospector, Dialect, DialectAdapter, Driver, Kysely, QueryCompiler } from "kysely";
type MaybePromise<T> = T | Promise<T>;
/** Configuration for the node:sqlite Kysely dialect. */
export type NodeSqliteKyselyDialectConfig = {
    database: DatabaseSync | (() => MaybePromise<DatabaseSync>);
    onCreateConnection?: (connection: DatabaseConnection) => MaybePromise<void>;
    transactionMode?: "deferred" | "immediate" | "exclusive";
};
/** Kysely dialect backed by a node:sqlite DatabaseSync instance. */
export declare class NodeSqliteKyselyDialect implements Dialect {
    #private;
    constructor(config: NodeSqliteKyselyDialectConfig);
    createDriver(): Driver;
    createQueryCompiler(): QueryCompiler;
    createAdapter(): DialectAdapter;
    createIntrospector(db: Kysely<unknown>): DatabaseIntrospector;
}
export {};
