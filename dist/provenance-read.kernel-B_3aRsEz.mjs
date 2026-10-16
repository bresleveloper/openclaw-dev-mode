import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { i as decodeClawAgentOwnership, n as parseClawInstallRecordSchemaVersion } from "./provenance-schema-version-CA1gqk1A.mjs";
//#region src/claws/package-extension-provenance.ts
const CLAW_PACKAGE_REF_SCHEMA_VERSION = "openclaw.clawPackageRef.v1";
function toPackageRefExtensionSqlParams(extension) {
	return {
		extension_id: extension?.id ?? null,
		extension_format: extension?.format ?? null,
		extension_detected_format: extension?.detectedFormat ?? null,
		extension_mapped_json: extension ? JSON.stringify(extension.mapped) : null,
		extension_unavailable_json: extension ? JSON.stringify(extension.unavailable) : null,
		extension_adapter_identity: extension?.adapterIdentity ?? null
	};
}
function parsePackageRefExtension(row) {
	const values = [
		row.extension_id,
		row.extension_format,
		row.extension_detected_format,
		row.extension_mapped_json,
		row.extension_unavailable_json,
		row.extension_adapter_identity
	];
	if (values.every((value) => value === null)) return;
	if (values.some((value) => value === null)) throw new Error(`Claw package reference ${row.package_kind}:${row.package_ref} has incomplete extension provenance.`);
	const formats = /* @__PURE__ */ new Set([
		"openclaw",
		"claude",
		"codex",
		"cursor"
	]);
	if (!formats.has(row.extension_format) || !formats.has(row.extension_detected_format)) throw new Error(`Claw package reference ${row.package_kind}:${row.package_ref} has unsupported extension format provenance.`);
	const mapped = JSON.parse(row.extension_mapped_json);
	const unavailable = JSON.parse(row.extension_unavailable_json);
	if (!Array.isArray(mapped) || !mapped.every((value) => typeof value === "string") || !Array.isArray(unavailable) || !unavailable.every((value) => typeof value === "string")) throw new Error(`Claw package reference ${row.package_kind}:${row.package_ref} has invalid extension inventory provenance.`);
	return {
		id: row.extension_id,
		format: row.extension_format,
		detectedFormat: row.extension_detected_format,
		mapped,
		unavailable,
		adapterIdentity: row.extension_adapter_identity
	};
}
function rowToPackageRef(row) {
	const extension = parsePackageRefExtension(row);
	return {
		schemaVersion: CLAW_PACKAGE_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		clawName: row.claw_name,
		kind: row.package_kind,
		source: row.package_source,
		ref: row.package_ref,
		version: row.package_version,
		integrity: row.package_integrity,
		status: row.package_status,
		relationship: row.relationship,
		origin: row.origin,
		independentOwner: coerceRequiredSqliteNumber(row.independent_owner) === 1,
		...extension ? { extension } : {},
		installedAtMs: coerceRequiredSqliteNumber(row.installed_at_ms),
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	};
}
//#endregion
//#region src/claws/package-status.kernel.ts
function updateClawPackageRefStatusInDatabase(db, ref, status, nowMs) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_package_refs").set({
		package_status: status,
		updated_at_ms: nowMs
	}).where("agent_id", "=", ref.agentId).where("package_kind", "=", ref.kind).where("package_source", "=", ref.source).where("package_ref", "=", ref.ref).where("package_version", "=", ref.version).where("package_integrity", "=", ref.integrity));
	return {
		...ref,
		status,
		updatedAtMs: nowMs
	};
}
//#endregion
//#region src/claws/provenance-bootstrap.ts
function clawBootstrapProvenanceFromRow(row) {
	return row.bootstrap_source_path && row.bootstrap_content_digest ? { bootstrap: {
		sourcePath: row.bootstrap_source_path,
		contentDigest: row.bootstrap_content_digest
	} } : {};
}
//#endregion
//#region src/claws/provenance-read.kernel.ts
function rowToRecord(row) {
	const ownership = decodeClawAgentOwnership(row.agent_owned_paths_json, row.schema_version);
	const manifestSchemaVersion = coerceRequiredSqliteNumber(row.manifest_schema_version);
	if (manifestSchemaVersion !== 1) throw new Error(`Unsupported Claw manifest schema ${manifestSchemaVersion}.`);
	return {
		schemaVersion: parseClawInstallRecordSchemaVersion(row.schema_version),
		claw: {
			kind: row.source_kind,
			name: row.claw_name,
			version: row.claw_version,
			packageRoot: row.package_root,
			manifestPath: row.manifest_path,
			integrityKind: row.integrity_kind,
			integrity: row.integrity,
			byteLength: coerceRequiredSqliteNumber(row.source_byte_length)
		},
		manifestSchemaVersion,
		planIntegrity: row.plan_integrity,
		agentId: row.agent_id,
		workspace: row.workspace,
		agentConfigDigest: row.agent_config_digest,
		agentOrigin: ownership.origin,
		agentOwnedPaths: ownership.paths,
		...clawBootstrapProvenanceFromRow(row),
		status: row.status,
		addedAtMs: coerceRequiredSqliteNumber(row.added_at_ms),
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	};
}
function selectClawInstallRow(db, agentId) {
	return db.prepare(`SELECT agent_id, schema_version, source_kind, claw_name, claw_version,
              package_root, manifest_path, integrity_kind, integrity, source_byte_length,
              manifest_schema_version, plan_integrity, workspace, agent_config_digest,
              agent_owned_paths_json, bootstrap_source_path, bootstrap_content_digest,
              status, added_at_ms, updated_at_ms
         FROM claw_installs
        WHERE agent_id = ?`).get(agentId);
}
function readClawInstallRecordFromDatabase(db, agentId) {
	const row = selectClawInstallRow(db, agentId);
	return row ? rowToRecord(row) : void 0;
}
function readClawInstallRecordsInDatabase(db) {
	return db.prepare(`SELECT schema_version, source_kind, claw_name, claw_version, package_root,
              manifest_path, integrity_kind, integrity, source_byte_length,
              manifest_schema_version, plan_integrity, agent_id, workspace,
              agent_config_digest, agent_owned_paths_json, bootstrap_source_path, bootstrap_content_digest,
              status, added_at_ms,
              updated_at_ms
         FROM claw_installs
        ORDER BY agent_id`).all().map(rowToRecord);
}
function readClawPackageRefsInDatabase(db, options = {}) {
	const conditions = [];
	const params = {};
	for (const [column, value] of [
		["agent_id", options.agentId],
		["package_kind", options.kind],
		["package_source", options.source],
		["package_ref", options.ref],
		["package_version", options.version],
		["package_integrity", options.integrity],
		["package_status", options.status]
	]) if (value !== void 0) {
		conditions.push(`${column} = @${column}`);
		params[column] = value;
	}
	const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
	return db.prepare(`SELECT schema_version, agent_id, claw_name, package_kind, package_source,
              package_ref, package_version, package_integrity, package_status, relationship, origin,
              independent_owner, extension_id, extension_format, extension_detected_format,
              extension_mapped_json, extension_unavailable_json, extension_adapter_identity,
              installed_at_ms,
              updated_at_ms
         FROM claw_package_refs${where}
        ORDER BY agent_id, package_kind, package_ref`).all(params).map(rowToPackageRef);
}
function readClawOrphanWorkspaceInDatabase(db, agentId) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("claw_workspace_files").select(["workspace", "updated_at_ms"]).where("agent_id", "=", agentId).orderBy("target_path").limit(1));
	return row ? {
		workspace: row.workspace,
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	} : void 0;
}
//#endregion
export { updateClawPackageRefStatusInDatabase as a, toPackageRefExtensionSqlParams as c, readClawPackageRefsInDatabase as i, readClawInstallRecordsInDatabase as n, CLAW_PACKAGE_REF_SCHEMA_VERSION as o, readClawOrphanWorkspaceInDatabase as r, rowToPackageRef as s, readClawInstallRecordFromDatabase as t };
