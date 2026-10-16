import { a as getNodeSqliteKysely } from "./kysely-sync-K7ftY-g4.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
//#region src/claws/mcp-records.ts
const CLAW_MCP_REF_SCHEMA_VERSION = "openclaw.clawMcpServerRef.v1";
function selectMcpRefs(db) {
	return getNodeSqliteKysely(db).selectFrom("claw_mcp_server_refs").select([
		"schema_version",
		"agent_id",
		"name",
		"config_digest",
		"relationship",
		"origin",
		"independent_owner",
		"status",
		"error",
		"created_at_ms",
		"updated_at_ms"
	]);
}
function refToRow(ref) {
	return {
		agent_id: ref.agentId,
		name: ref.name,
		schema_version: ref.schemaVersion,
		config_digest: ref.configDigest,
		relationship: ref.relationship,
		origin: ref.origin,
		independent_owner: ref.independentOwner ? 1 : 0,
		status: ref.status,
		error: ref.error ?? null,
		created_at_ms: ref.createdAtMs,
		updated_at_ms: ref.updatedAtMs
	};
}
function rowToRef(row) {
	return {
		schemaVersion: CLAW_MCP_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		name: row.name,
		configDigest: row.config_digest,
		relationship: row.relationship,
		origin: row.origin,
		independentOwner: coerceRequiredSqliteNumber(row.independent_owner) === 1,
		status: row.status,
		...row.error ? { error: row.error } : {},
		createdAtMs: coerceRequiredSqliteNumber(row.created_at_ms),
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	};
}
//#endregion
export { selectMcpRefs as i, refToRow as n, rowToRef as r, CLAW_MCP_REF_SCHEMA_VERSION as t };
