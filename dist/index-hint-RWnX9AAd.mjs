import{n as isPostgresSqlConnection}from"./sql-connection-nx8lLUJM.mjs";import{_ as sql}from"./kysely-sync-Dl78faM1.mjs";
//!src/infra/database-engine/index-hint.ts
function engineIndexHint(e,t){return sql.raw(isPostgresSqlConnection(e)?``:`INDEXED BY ${t}`)}export{engineIndexHint as t};