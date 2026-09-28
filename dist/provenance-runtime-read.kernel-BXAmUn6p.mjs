import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
//#region src/claws/provenance-runtime-read.kernel.ts
function readClawInstallSchemaVersionRows(db) {
	if (!tableExists(db, "claw_installs")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("claw_installs").select([
		"agent_id as agentId",
		"schema_version as schemaVersion",
		"agent_config_digest as agentConfigDigest"
	])).rows;
}
//#endregion
export { readClawInstallSchemaVersionRows as t };
