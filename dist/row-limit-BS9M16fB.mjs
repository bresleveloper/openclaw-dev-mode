import{n as isPostgresSqlConnection}from"./sql-connection-nx8lLUJM.mjs";import{_ as sql}from"./kysely-sync-Dl78faM1.mjs";
//!src/infra/database-engine/row-limit.ts
function engineUnboundedRowLimit(e){return isPostgresSqlConnection(e)?sql`all`:sql.lit(-1)}export{engineUnboundedRowLimit as t};