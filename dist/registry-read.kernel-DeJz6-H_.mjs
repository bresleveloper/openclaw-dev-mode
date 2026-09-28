import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/agents/worktrees/registry-read.kernel.ts
const WORKTREE_RECORD_COLUMNS = [
	"id",
	"repo_fingerprint",
	"repo_root",
	"path",
	"branch",
	"base_ref",
	"owner_kind",
	"owner_id",
	"snapshot_ref",
	"created_at",
	"last_active_at",
	"removed_at",
	"run_end_cleanup_json"
];
function parseRunEndCleanup(raw) {
	if (raw == null) return;
	try {
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed) || typeof parsed.at !== "number" || !Number.isInteger(parsed.at) || parsed.at < 0) return;
		const at = parsed.at;
		switch (parsed.outcome) {
			case "failed": return typeof parsed.reason === "string" && parsed.reason.length > 0 && parsed.reason.length <= 500 ? {
				outcome: parsed.outcome,
				at,
				reason: parsed.reason
			} : void 0;
			case "removed-lossless":
			case "retained-busy":
			case "retained-dirty":
			case "retained-unpushed":
			case "retained-provisioned-drift": return parsed.reason === void 0 ? {
				outcome: parsed.outcome,
				at
			} : void 0;
			default: return;
		}
	} catch {
		return;
	}
}
function rowToRecord(row) {
	const runEndCleanup = parseRunEndCleanup(row.run_end_cleanup_json);
	return {
		id: row.id,
		name: row.path.split(/[\\/]/).at(-1) ?? row.id,
		repoFingerprint: row.repo_fingerprint,
		repoRoot: row.repo_root,
		path: row.path,
		branch: row.branch,
		baseRef: row.base_ref,
		ownerKind: row.owner_kind,
		...row.owner_id ? { ownerId: row.owner_id } : {},
		...row.snapshot_ref ? { snapshotRef: row.snapshot_ref } : {},
		createdAt: row.created_at,
		lastActiveAt: row.last_active_at,
		...row.removed_at == null ? {} : { removedAt: row.removed_at },
		...runEndCleanup ? { runEndCleanup } : {}
	};
}
function listRegistryWorktreesInDatabase(db) {
	const query = getNodeSqliteKysely(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).orderBy("created_at", "desc").orderBy("id", "asc");
	return executeSqliteQuerySync(db, query).rows.map(rowToRecord);
}
function listLiveRegistryWorktreeIdsInDatabase(db) {
	const query = getNodeSqliteKysely(db).selectFrom("worktrees").select("id").where("removed_at", "is", null);
	return executeSqliteQuerySync(db, query).rows.map((row) => row.id);
}
//#endregion
export { rowToRecord as i, listLiveRegistryWorktreeIdsInDatabase as n, listRegistryWorktreesInDatabase as r, WORKTREE_RECORD_COLUMNS as t };
