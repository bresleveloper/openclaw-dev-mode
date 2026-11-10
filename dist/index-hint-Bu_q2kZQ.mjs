import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { p as sql } from "./kysely-sync-9fPQaMlh.mjs";
//#region src/infra/database-engine/index-hint.ts
function engineIndexHint(db, indexName) {
	return sql.raw(isPostgresSqlConnection(db) ? "" : `INDEXED BY ${indexName}`);
}
//#endregion
export { engineIndexHint as t };
