import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { a as tableExists } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import "./openclaw-state-read-openclaw-state-feature-schema-XEi5Ut_x.mjs";
import { n as createStateDomainPublication } from "./openclaw-state-read-state-domain-publication-DnqJOUHl.mjs";
//#region src/gateway/worker-environments/local-workspace-publication.ts
function isRow(value) {
	return isRecord(value) && [
		"worktree_id",
		"agent_id",
		"session_key",
		"session_id",
		"projection_path",
		"base_commit",
		"source_paths_json"
	].every((key) => typeof value[key] === "string") && [
		"lifecycle_revision",
		"baseline_json",
		"baseline_ref",
		"pending_ref",
		"pending_target",
		"journal_json",
		"paused_runtimes_json"
	].every((key) => value[key] === null || typeof value[key] === "string") && (value.journal_pack === null || value.journal_pack instanceof Uint8Array) && typeof value.created_at_ms === "number" && typeof value.revision === "number";
}
createStateDomainPublication({
	domain: "local-workspace",
	keyOf: (value) => value.worktree_id,
	isValue: isRow
});
//#endregion
//#region src/gateway/worker-environments/local-workspace-store.kernel.ts
const table = "local_workspace_projections";
const query = (db) => getNodeSqliteKysely(db);
function readLocalWorkspaceProjectionInDatabase(db, id) {
	return tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("worktree_id", "=", id)) : void 0;
}
function hasLocalWorkspaceProjectionInDatabase(db, id) {
	return tableExists(db, table) && executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).select("worktree_id").where("worktree_id", "=", id)) !== void 0;
}
const localWorkspaceReadOperations = {
	"localWorkspace.exists": (input, db) => ({
		type: "localWorkspace.exists",
		exists: hasLocalWorkspaceProjectionInDatabase(db, input.id)
	}),
	"localWorkspace.get": (input, db) => ({
		type: "localWorkspace.get",
		row: readLocalWorkspaceProjectionInDatabase(db, input.id)
	})
};
//#endregion
export { localWorkspaceReadOperations };
