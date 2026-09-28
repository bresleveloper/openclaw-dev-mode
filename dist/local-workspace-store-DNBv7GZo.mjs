import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
//#region src/gateway/worker-environments/local-workspace-store.ts
const table = "local_workspace_projections";
const query = (db) => getNodeSqliteKysely(db);
/** Local executions share the reconciliation engine, never a remote placement identity. */
function localWorkspaceStore(env = process.env) {
	const read = () => openOpenClawStateDatabase({ env }).db;
	const getFrom = (db, id) => tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).selectAll().where("worktree_id", "=", id)) : void 0;
	const get = (id) => getFrom(read(), id);
	return {
		get,
		revision(id) {
			const db = read();
			return tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).select("revision").where("worktree_id", "=", id))?.revision : void 0;
		},
		create(row, assertCurrent) {
			return runOpenClawStateWriteTransaction(({ db }) => {
				db.exec(extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table));
				assertCurrent();
				if (getFrom(db, row.worktree_id)) throw new Error("Local workspace binding already exists");
				return executeSqliteQueryTakeFirstSync(db, query(db).insertInto(table).values({
					...row,
					revision: 0
				}).returningAll());
			}, { env });
		},
		update(row, patch, assertCurrent) {
			return runOpenClawStateWriteTransaction(({ db }) => {
				assertCurrent();
				if (!Number.isSafeInteger(row.revision + 1)) throw new Error("Local workspace revision exhausted");
				const next = executeSqliteQueryTakeFirstSync(db, query(db).updateTable(table).set({
					...patch,
					revision: row.revision + 1
				}).where("worktree_id", "=", row.worktree_id).where("revision", "=", row.revision).returningAll());
				if (!next) throw new Error("Local workspace binding changed");
				return next;
			}, { env });
		},
		delete(row, assertCurrent) {
			runOpenClawStateWriteTransaction(({ db }) => {
				assertCurrent();
				if (row.pending_ref || row.journal_json) throw new Error("Local workspace has unsettled edits");
				if (!executeSqliteQueryTakeFirstSync(db, query(db).deleteFrom(table).where("worktree_id", "=", row.worktree_id).where("revision", "=", row.revision).returning("worktree_id"))) throw new Error("Local workspace binding changed");
			}, { env });
		}
	};
}
//#endregion
export { localWorkspaceStore as t };
