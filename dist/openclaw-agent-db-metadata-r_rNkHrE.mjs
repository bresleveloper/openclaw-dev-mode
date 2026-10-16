import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { i as tableExists, t as classifySqliteTableReadError } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
//#region src/state/openclaw-agent-db-metadata.ts
/** Read ownership metadata without loading runtime schema or migration owners. */
function readExistingAgentSchemaMeta(db) {
	if (!tableExists(db, "schema_meta")) return null;
	let row;
	try {
		row = db.prepare("SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	} catch (error) {
		throw classifySqliteTableReadError(db, "schema_meta", [
			"meta_key",
			"role",
			"schema_version",
			"agent_id"
		], error);
	}
	if (!row) return null;
	return {
		agentId: normalizeNullableString(row.agent_id),
		role: typeof row.role === "string" ? row.role : null,
		schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null
	};
}
//#endregion
export { readExistingAgentSchemaMeta as t };
