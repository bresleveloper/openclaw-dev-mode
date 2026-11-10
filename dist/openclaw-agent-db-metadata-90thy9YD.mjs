import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { _ as schemaAdmission, i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as tableExists, t as classifySqliteTableReadError } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
//#region src/state/openclaw-agent-db-metadata.ts
const agentSchemaMetadataKey = {
	name: "agent.schema-metadata",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("agentId" in value) || value.agentId !== null && typeof value.agentId !== "string" || !("role" in value) || value.role !== null && typeof value.role !== "string" || !("schemaVersion" in value) || value.schemaVersion !== null && typeof value.schemaVersion !== "number") return;
		return {
			agentId: value.agentId,
			role: value.role,
			schemaVersion: value.schemaVersion
		};
	}
};
function schemaMetadataKey(admissionId) {
	return {
		name: `agent.schema-metadata:${admissionId}`,
		read: agentSchemaMetadataKey.read
	};
}
/** The metadata writer publishes its committed format facts without a readback. */
function publishAgentSchemaMetadata(db, metadata) {
	publishSqliteDatabaseAdmission(db, agentSchemaMetadataKey, metadata);
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) publishSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId), metadata);
}
function readExistingAgentSchemaMeta(db, options) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	const historical = !options?.includeAppVersion && schema && getSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId));
	if (historical) return historical;
	const admitted = !options?.includeAppVersion && (!schema || getSqliteDatabaseAdmission(db, schemaAdmission)?.admissionId === schema.admissionId) ? getSqliteDatabaseAdmission(db, agentSchemaMetadataKey) : void 0;
	if (admitted) {
		if (schema) publishSqliteDatabaseAdmission(db, schemaMetadataKey(schema.admissionId), admitted);
		return admitted;
	}
	if (!tableExists(db, "schema_meta")) return null;
	let row;
	try {
		row = db.prepare(options?.includeAppVersion ? "SELECT role, schema_version, agent_id, app_version FROM schema_meta WHERE meta_key = 'primary'" : "SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'").get();
	} catch (error) {
		throw classifySqliteTableReadError(db, "schema_meta", [
			"meta_key",
			"role",
			"schema_version",
			"agent_id"
		], error);
	}
	if (!row) return null;
	const metadata = {
		agentId: normalizeNullableString(row.agent_id),
		role: typeof row.role === "string" ? row.role : null,
		schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null
	};
	if (schema && getAdmittedSqliteSchemaFacts(db) === schema && getSqliteDatabaseAdmission(db, schemaAdmission)?.admissionId === schema.admissionId) publishAgentSchemaMetadata(db, metadata);
	return options?.includeAppVersion ? {
		...metadata,
		appVersion: typeof row.app_version === "string" ? row.app_version : null
	} : metadata;
}
//#endregion
export { publishAgentSchemaMetadata as n, readExistingAgentSchemaMeta as r, agentSchemaMetadataKey as t };
