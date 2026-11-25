import{n as isPostgresSqlConnection}from"./sql-connection-nx8lLUJM.mjs";import{_ as sql}from"./kysely-sync-Dl78faM1.mjs";
//!src/infra/database-engine/text-bytes.ts
function engineTextHexSql(e,t){return isPostgresSqlConnection(e)?sql`upper(encode(convert_to(${t}, 'UTF8'), 'hex'))`:sql`hex(cast(${t} as blob))`}export{engineTextHexSql as t};