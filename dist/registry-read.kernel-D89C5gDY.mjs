import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
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
	"run_end_cleanup_json",
	"gc_protection_json"
];
function parseRunEndCleanup(raw) {
	const parsed = safeParseJsonRecord(raw ?? "");
	if (!parsed || typeof parsed.at !== "number" || !Number.isInteger(parsed.at) || parsed.at < 0) return;
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
}
function rowToRecord(row) {
	const runEndCleanup = parseRunEndCleanup(row.run_end_cleanup_json);
	const record = {
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
	const protection = safeParseJsonRecord(row.gc_protection_json ?? "");
	if (protection && protection.revision === worktreeGcRevision(record) && typeof protection.reason === "string") {
		record.gcProtection = protection.reason;
		const retry = protection.retry;
		if (isRecord(retry) && typeof retry.stage === "string" && typeof retry.elapsedMs === "number" && Number.isSafeInteger(retry.elapsedMs) && retry.elapsedMs >= 0 && typeof retry.attempts === "number" && Number.isSafeInteger(retry.attempts) && retry.attempts > 0 && typeof retry.retryAt === "number" && Number.isSafeInteger(retry.retryAt) && retry.retryAt >= 0) record.gcRetry = {
			stage: retry.stage,
			elapsedMs: retry.elapsedMs,
			attempts: retry.attempts,
			retryAt: retry.retryAt
		};
	}
	return record;
}
/** Registry mutations invalidate a retained decision without rewriting its derived column. */
function worktreeGcRevision(record) {
	return JSON.stringify([
		record.path,
		record.repoRoot,
		record.repoFingerprint,
		record.branch,
		record.baseRef,
		record.createdAt,
		record.ownerKind,
		record.ownerId,
		record.lastActiveAt,
		record.removedAt,
		record.snapshotRef,
		record.runEndCleanup
	]);
}
function getRegistryWorktreeInDatabase(db, id) {
	const query = getNodeSqliteKysely(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("id", "=", id);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByOwnerInDatabase(db, ownerKind, ownerId) {
	const query = getNodeSqliteKysely(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("owner_kind", "=", ownerKind).where("owner_id", "=", ownerId).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByPathInDatabase(db, worktreePath) {
	const row = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("path", "=", worktreePath).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function listRegistryWorktreesInDatabase(db, options = {}) {
	let query = getNodeSqliteKysely(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).orderBy("created_at", "desc").orderBy("id", "asc");
	if (options.liveOnly) query = query.where("removed_at", "is", null);
	return executeSqliteQuerySync(db, query).rows.map(rowToRecord);
}
function listLiveRegistryWorktreeIdsInDatabase(db) {
	const query = getNodeSqliteKysely(db).selectFrom("worktrees").select("id").where("removed_at", "is", null);
	return executeSqliteQuerySync(db, query).rows.map((row) => row.id);
}
function isProvisionedFileState(entry) {
	return isRecord(entry) && typeof entry.path === "string" && (entry.mode === null || typeof entry.mode === "number" && Number.isInteger(entry.mode) && entry.mode >= 0 && entry.mode <= 4095) && typeof entry.chunks === "number" && Number.isInteger(entry.chunks) && entry.chunks >= 0;
}
function parseProvisionedData(raw) {
	const parsed = safeParseJson(raw ?? "");
	if (!Array.isArray(parsed)) return;
	return parsed.every((entry) => typeof entry === "string" || isProvisionedFileState(entry)) ? parsed : void 0;
}
function readProvisionedData(db, id) {
	const query = getNodeSqliteKysely(db).selectFrom("worktrees").select("provisioned_paths_json").where("id", "=", id);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return parseProvisionedData(row?.provisioned_paths_json ?? null);
}
function getRegistryWorktreeProvisionedPathsInDatabase(db, id) {
	return readProvisionedData(db, id)?.map((entry) => typeof entry === "string" ? entry : entry.path);
}
function getRegistryWorktreeProvisionedStateInDatabase(db, id) {
	const data = readProvisionedData(db, id);
	return data?.every((entry) => typeof entry !== "string") ? data : void 0;
}
function getRegistryWorktreeProvisionedChunkInDatabase(db, params) {
	const query = getNodeSqliteKysely(db).selectFrom("worktree_provisioned_file_chunks").select("data").where("worktree_id", "=", params.worktreeId).where("path", "=", params.path).where("chunk_index", "=", params.chunkIndex);
	return executeSqliteQuerySync(db, query).rows[0]?.data;
}
//#endregion
export { getRegistryWorktreeProvisionedPathsInDatabase as a, listRegistryWorktreesInDatabase as c, getRegistryWorktreeProvisionedChunkInDatabase as i, rowToRecord as l, findLiveRegistryWorktreeByPathInDatabase as n, getRegistryWorktreeProvisionedStateInDatabase as o, getRegistryWorktreeInDatabase as r, listLiveRegistryWorktreeIdsInDatabase as s, findLiveRegistryWorktreeByOwnerInDatabase as t, worktreeGcRevision as u };
