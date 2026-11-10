import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
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
export { updateClawPackageRefStatusInDatabase as t };
