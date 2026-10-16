import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-BXwDVcTj.mjs";
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
	if (protection && protection.revision === worktreeGcRevision(record) && typeof protection.reason === "string") record.gcProtection = protection.reason;
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
//#region src/agents/worktrees/run-lease-owner.ts
const WORKTREE_REMOVING_LEASE_KEY = "__removing__";
function parseLeaseOwnerPayload(payloadJson) {
	const parsed = safeParseJsonRecord(payloadJson ?? "");
	if (!parsed) return {};
	return {
		pid: typeof parsed.pid === "number" ? parsed.pid : void 0,
		starttime: typeof parsed.starttime === "number" ? parsed.starttime : void 0,
		...parsed.exclusive === true ? { exclusive: true } : {}
	};
}
function collectLiveRunLeases(db, k, scope, reapStale = true) {
	const rows = executeSqliteQuerySync(db, k.selectFrom("state_leases").select([
		"lease_key",
		"owner",
		"payload_json"
	]).where("scope", "=", scope)).rows;
	const { staleKeys, ...live } = inspectRunLeases(rows);
	if (reapStale && staleKeys.length > 0) executeSqliteQuerySync(db, k.deleteFrom("state_leases").where("scope", "=", scope).where("lease_key", "in", staleKeys));
	return live;
}
function inspectRunLeases(rows) {
	const livePids = [];
	const staleKeys = [];
	let removingToken;
	let liveCount = 0;
	let exclusive = false;
	for (const row of rows) {
		const payload = parseLeaseOwnerPayload(row.payload_json);
		if (isLockOwnerDefinitelyStale({ payload })) {
			staleKeys.push(row.lease_key);
			continue;
		}
		if (row.lease_key === "__removing__") {
			removingToken = row.owner;
			continue;
		}
		if (payload.pid !== void 0) livePids.push(payload.pid);
		liveCount += 1;
		exclusive ||= payload.exclusive === true;
	}
	return {
		staleKeys,
		livePids,
		liveCount,
		exclusive,
		...removingToken !== void 0 ? { removingToken } : {}
	};
}
const WORKTREE_RUN_LEASE_SCOPE_PREFIX = "worktree-run:";
function reapWorktreeRunLeasesInDatabase(db, scopes) {
	const k = getNodeSqliteKysely(db);
	for (const scope of scopes) collectLiveRunLeases(db, k, scope);
}
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalContentionError";
	}
};
function worktreeRunLeaseScope(worktreeId) {
	return `${WORKTREE_RUN_LEASE_SCOPE_PREFIX}${worktreeId}`;
}
/** Removed exact snapshots retain exclusive lifecycle custody during destructive expiry. */
function assertRegistryMutationCustody(db, k, id, token) {
	const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select(["removed_at", "snapshot_ref"]).where("id", "=", id)).rows[0];
	if (record?.removed_at == null || !record.snapshot_ref?.startsWith("refs/openclaw/snapshots/exact-")) return;
	const { removingToken } = collectLiveRunLeases(db, k, worktreeRunLeaseScope(id));
	if (removingToken !== void 0 && removingToken !== token) throw new WorktreeRemovalContentionError("busy", "Exact-state snapshot expiration owns this lifecycle");
}
//#endregion
//#region src/agents/worktrees/run-lease-store.kernel.ts
function admitWorktreeRunLeaseInDatabase(db, params) {
	const k = getNodeSqliteKysely(db);
	const scope = worktreeRunLeaseScope(params.worktreeId);
	const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select(["path", "removed_at"]).where("id", "=", params.worktreeId)).rows[0];
	const worktreePath = record?.path ?? params.worktreeId;
	if (!record || record.removed_at != null) throw new Error(`managed worktree was removed: ${worktreePath}`);
	const { removingToken, liveCount, exclusive } = collectLiveRunLeases(db, k, scope);
	if (removingToken !== void 0) throw new Error(`managed worktree was removed: ${worktreePath}`);
	if (exclusive || params.exclusive && liveCount > 0) throw new Error("The worktree is in use; wait for its current run or publication to finish.");
	executeSqliteQuerySync(db, k.insertInto("state_leases").values({
		scope,
		lease_key: params.token,
		owner: `${params.pid}:${params.startTime ?? ""}`,
		expires_at: null,
		heartbeat_at: null,
		payload_json: JSON.stringify({
			pid: params.pid,
			starttime: params.startTime ?? void 0,
			...params.exclusive ? { exclusive: true } : {}
		}),
		created_at: params.now,
		updated_at: params.now
	}));
}
function releaseWorktreeRunLeaseInDatabase(db, worktreeId, token) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", token));
}
//#endregion
export { worktreeGcRevision as _, assertRegistryMutationCustody as a, worktreeRunLeaseScope as c, getRegistryWorktreeProvisionedChunkInDatabase as d, getRegistryWorktreeProvisionedPathsInDatabase as f, rowToRecord as g, listRegistryWorktreesInDatabase as h, WorktreeRemovalContentionError as i, WORKTREE_RECORD_COLUMNS as l, listLiveRegistryWorktreeIdsInDatabase as m, releaseWorktreeRunLeaseInDatabase as n, collectLiveRunLeases as o, getRegistryWorktreeProvisionedStateInDatabase as p, WORKTREE_REMOVING_LEASE_KEY as r, reapWorktreeRunLeasesInDatabase as s, admitWorktreeRunLeaseInDatabase as t, getRegistryWorktreeInDatabase as u };
