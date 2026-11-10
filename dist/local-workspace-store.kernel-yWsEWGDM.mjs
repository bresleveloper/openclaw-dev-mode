import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { t as localWorkspacePublication } from "./local-workspace-publication-vsEiBxXq.mjs";
//#region src/gateway/worker-environments/local-workspace-store.kernel.ts
const table = "local_workspace_projections";
const query = (db) => getNodeSqliteKysely(db);
function hasLocalWorkspaceProjectionInDatabase(db, id) {
	return tableExists(db, table) && executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).select("worktree_id").where("worktree_id", "=", id)) !== void 0;
}
function mutateLocalWorkspaceProjection(db, id, mutation) {
	const current = tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).select("revision").$if(mutation.kind === "delete", (builder) => builder.select((eb) => eb.or([eb(eb.fn.coalesce(eb.fn("octet_length", ["pending_ref"]), eb.val(0)), ">", 0), eb(eb.fn.coalesce(eb.fn("octet_length", ["journal_json"]), eb.val(0)), ">", 0)]).as("unsettled"))).where("worktree_id", "=", id)) : void 0;
	if (mutation.kind === "create") {
		if (current || mutation.row.worktree_id !== id) throw new Error("Local workspace binding already exists");
		if (!tableExists(db, table)) db.exec(getOpenClawStateFeatureSchemaSql(table));
		const created = executeSqliteQueryTakeFirstSync(db, query(db).insertInto(table).values({
			...mutation.row,
			revision: 0
		}).returningAll());
		if (created) localWorkspacePublication.stagePostimages(db, [created]);
		return created;
	}
	if (!current || current.revision !== mutation.revision) throw new Error("Local workspace binding changed");
	if (mutation.kind === "delete") {
		if (current.unsettled) throw new Error("Local workspace has unsettled edits");
		executeSqliteQueryTakeFirstSync(db, query(db).deleteFrom(table).where("worktree_id", "=", id).returning("worktree_id"));
		localWorkspacePublication.stageDeletions(db, [id]);
		return;
	}
	const updated = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
		...mutation.patch,
		worktree_id: id,
		revision: current.revision + 1
	}).where("worktree_id", "=", id).returningAll());
	if (updated) localWorkspacePublication.stagePostimages(db, [updated]);
	return updated;
}
//#endregion
export { mutateLocalWorkspaceProjection as n, hasLocalWorkspaceProjectionInDatabase as t };
