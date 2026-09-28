import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as tableHasColumn, r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-DDEYOm3C.mjs";
import { i as rowToRecord, r as listRegistryWorktreesInDatabase, t as WORKTREE_RECORD_COLUMNS } from "./registry-read.kernel-DeJz6-H_.mjs";
//#region src/agents/worktrees/run-lease-owner.ts
const WORKTREE_REMOVING_LEASE_KEY = "__removing__";
function parseLeaseOwnerPayload(payloadJson) {
	if (!payloadJson) return {};
	try {
		const parsed = JSON.parse(payloadJson);
		if (!isRecord(parsed)) return {};
		return {
			pid: typeof parsed.pid === "number" ? parsed.pid : void 0,
			starttime: typeof parsed.starttime === "number" ? parsed.starttime : void 0,
			...parsed.exclusive === true ? { exclusive: true } : {}
		};
	} catch {
		return {};
	}
}
function collectLiveRunLeases(db, k, scope, checks) {
	const rows = executeSqliteQuerySync(db, k.selectFrom("state_leases").select([
		"lease_key",
		"owner",
		"payload_json"
	]).where("scope", "=", scope)).rows;
	const livePids = [];
	const staleKeys = [];
	let removingToken;
	let liveCount = 0;
	let exclusive = false;
	for (const row of rows) {
		const payload = parseLeaseOwnerPayload(row.payload_json);
		const stale = isLockOwnerDefinitelyStale({
			payload,
			isPidDefinitelyDead: checks.isPidDefinitelyDead,
			getProcessStartTime: checks.getProcessStartTime
		});
		if (row.lease_key === "__removing__") {
			if (stale) staleKeys.push(row.lease_key);
			else removingToken = row.owner;
			continue;
		}
		if (stale) {
			staleKeys.push(row.lease_key);
			continue;
		}
		if (payload.pid !== void 0) livePids.push(payload.pid);
		liveCount += 1;
		exclusive ||= payload.exclusive === true;
	}
	if (staleKeys.length > 0) executeSqliteQuerySync(db, k.deleteFrom("state_leases").where("scope", "=", scope).where("lease_key", "in", staleKeys));
	return {
		livePids,
		liveCount,
		exclusive,
		...removingToken !== void 0 ? { removingToken } : {}
	};
}
const WORKTREE_RUN_LEASE_SCOPE_PREFIX = "worktree-run:";
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
	const { removingToken } = collectLiveRunLeases(db, k, worktreeRunLeaseScope(id), {});
	if (removingToken !== void 0 && removingToken !== token) throw new WorktreeRemovalContentionError("busy", "Exact-state snapshot expiration owns this lifecycle");
}
//#endregion
//#region src/agents/worktrees/registry.ts
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function kyselyProvisionedFor(db) {
	return getNodeSqliteKysely(db);
}
function kyselyLeaseFor(db) {
	return getNodeSqliteKysely(db);
}
function recordToRow(record, provisionedPaths) {
	return {
		id: record.id,
		repo_fingerprint: record.repoFingerprint,
		repo_root: record.repoRoot,
		path: record.path,
		branch: record.branch,
		base_ref: record.baseRef,
		owner_kind: record.ownerKind,
		owner_id: record.ownerId ?? null,
		snapshot_ref: record.snapshotRef ?? null,
		created_at: record.createdAt,
		last_active_at: record.lastActiveAt,
		removed_at: record.removedAt ?? null,
		provisioned_paths_json: provisionedPaths === void 0 ? null : JSON.stringify(provisionedPaths),
		run_end_cleanup_json: record.runEndCleanup === void 0 ? null : JSON.stringify(record.runEndCleanup)
	};
}
function parseProvisionedData(raw) {
	if (raw === null) return;
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return;
		return parsed.every((entry) => typeof entry === "string" || typeof entry === "object" && entry !== null && typeof entry.path === "string" && (entry.mode === null || Number.isInteger(entry.mode) && entry.mode >= 0 && entry.mode <= 4095) && Number.isInteger(entry.chunks) && entry.chunks >= 0) ? parsed : void 0;
	} catch {
		return;
	}
}
function listRegistryWorktrees(env) {
	return listRegistryWorktreesInDatabase(dbFor(env));
}
function listRegistryWorktreesForMigration(env, behavior = {}) {
	return readRegistry(env, behavior, (db) => {
		const query = kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("created_at", "desc").orderBy("id", "asc");
		return executeSqliteQuerySync(db, query).rows.map(rowToRecord);
	}) ?? [];
}
function listLegacyRegistryWorktreesForMigration(env, behavior = {}) {
	return readRegistry(env, behavior, (db) => {
		let query = kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("id", "asc");
		if (tableHasColumn(db, "worktrees", "provisioned_paths_json")) query = query.where("provisioned_paths_json", "is", null);
		return executeSqliteQuerySync(db, query).rows.map(rowToRecord);
	}) ?? [];
}
function readRegistry(env, behavior, read) {
	const operation = ({ db }) => tableExists(db, "worktrees") ? read(db) : void 0;
	return behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(operation, { env }) : withExistingOpenClawStateDatabaseReadOnly(operation, { env });
}
function getRegistryWorktree(env, id) {
	const db = dbFor(env);
	const query = kyselyFor(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("id", "=", id);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function getRegistryWorktreeProvisionedPaths(env, id) {
	const db = dbFor(env);
	const query = kyselyFor(db).selectFrom("worktrees").select("provisioned_paths_json").where("id", "=", id);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return parseProvisionedData(row?.provisioned_paths_json ?? null)?.map((entry) => typeof entry === "string" ? entry : entry.path);
}
function discardLegacyRegistryWorktrees(env, worktreeIds) {
	if (worktreeIds.length === 0) return 0;
	const db = dbFor(env);
	return runOpenClawStateWriteTransaction(() => Number(executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("provisioned_paths_json", "is", null).where("id", "in", [...worktreeIds])).numAffectedRows ?? 0n), { env });
}
function rewriteRegistryWorktreePathsForMigration(env, rewrites) {
	if (rewrites.length === 0) return 0;
	const db = dbFor(env);
	return runOpenClawStateWriteTransaction(() => rewrites.reduce((count, rewrite) => count + Number(executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktrees").set({ path: rewrite.toPath }).where("id", "=", rewrite.id).where("path", "=", rewrite.fromPath)).numAffectedRows ?? 0n), 0), { env });
}
function getRegistryWorktreeProvisionedState(env, id) {
	const db = dbFor(env);
	const query = kyselyFor(db).selectFrom("worktrees").select("provisioned_paths_json").where("id", "=", id);
	const row = executeSqliteQuerySync(db, query).rows[0];
	const data = row ? parseProvisionedData(row.provisioned_paths_json) : void 0;
	return data?.every((entry) => typeof entry !== "string") ? data : void 0;
}
function clearRegistryWorktreeProvisionedChunks(env, worktreeId) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, kyselyProvisionedFor(db).deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", worktreeId));
	}, { env });
}
function insertRegistryWorktreeProvisionedChunk(env, params) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, kyselyProvisionedFor(db).insertInto("worktree_provisioned_file_chunks").values({
			worktree_id: params.worktreeId,
			path: params.path,
			chunk_index: params.chunkIndex,
			data: params.data
		}));
	}, { env });
}
function getRegistryWorktreeProvisionedChunk(env, params) {
	const db = dbFor(env);
	const query = kyselyProvisionedFor(db).selectFrom("worktree_provisioned_file_chunks").select("data").where("worktree_id", "=", params.worktreeId).where("path", "=", params.path).where("chunk_index", "=", params.chunkIndex);
	return executeSqliteQuerySync(db, query).rows[0]?.data;
}
function findLiveRegistryWorktreeByPath(env, worktreePath) {
	const db = dbFor(env);
	const query = kyselyFor(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("path", "=", worktreePath).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByOwner(env, ownerKind, ownerId) {
	const db = dbFor(env);
	const query = kyselyFor(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("owner_kind", "=", ownerKind).where("owner_id", "=", ownerId).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1);
	const row = executeSqliteQuerySync(db, query).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function insertRegistryWorktree(env, record, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, kyselyFor(db).insertInto("worktrees").values(recordToRow(record, options.provisionedPaths)));
	}, { env });
}
function updateRegistryWorktree(env, id, patch, options = {}) {
	const values = {};
	if (patch.lastActiveAt !== void 0) values.last_active_at = patch.lastActiveAt;
	if ("removedAt" in patch) values.removed_at = patch.removedAt ?? null;
	if ("snapshotRef" in patch) values.snapshot_ref = patch.snapshotRef ?? null;
	if ("runEndCleanup" in patch) values.run_end_cleanup_json = patch.runEndCleanup === void 0 ? null : JSON.stringify(patch.runEndCleanup);
	if (patch.repositoryIdentity) {
		values.repo_root = patch.repositoryIdentity.repoRoot;
		values.repo_fingerprint = patch.repositoryIdentity.repoFingerprint;
	}
	if (patch.provisionedState !== void 0) values.provisioned_paths_json = JSON.stringify(patch.provisionedState);
	else if (patch.provisionedPaths !== void 0) values.provisioned_paths_json = JSON.stringify(patch.provisionedPaths);
	runOpenClawStateWriteTransaction(({ db }) => {
		options.assertCurrent?.();
		assertRegistryMutationCustody(db, kyselyLeaseFor(db), id, options.removalToken);
		let update = kyselyFor(db).updateTable("worktrees").set(values).where("id", "=", id);
		if (options.onlyIfLive) update = update.where("removed_at", "is", null);
		if (options.onlyIfActiveAt !== void 0) update = update.where("last_active_at", "=", options.onlyIfActiveAt);
		executeSqliteQuerySync(db, update);
	}, { env });
}
function deleteRegistryWorktree(env, id, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		options.assertCurrent?.();
		assertRegistryMutationCustody(db, kyselyLeaseFor(db), id, options.removalToken);
		executeSqliteQuerySync(db, kyselyProvisionedFor(db).deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", id));
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("id", "=", id));
	}, { env });
}
function retireMissingRegistryWorktree(env, observed, removedAt) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktrees").set({ removed_at: removedAt }).where("id", "=", observed.id).where("removed_at", "is", null).where((eb) => eb.or([eb("snapshot_ref", "is", null), eb("snapshot_ref", "not like", "refs/openclaw/snapshots/exact-%")])).where("path", "=", observed.path).where("last_active_at", "=", observed.lastActiveAt).where("repo_root", "=", observed.repoRoot).where("repo_fingerprint", "=", observed.repoFingerprint).returning(WORKTREE_RECORD_COLUMNS)).rows[0] ?? executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").select(WORKTREE_RECORD_COLUMNS).where("id", "=", observed.id)).rows[0];
		return current ? rowToRecord(current) : void 0;
	}, { env });
}
function admitWorktreeRunLeaseRow(env, params) {
	runOpenClawStateWriteTransaction((database) => {
		const db = database.db;
		const k = kyselyLeaseFor(db);
		const scope = worktreeRunLeaseScope(params.worktreeId);
		const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select(["path", "removed_at"]).where("id", "=", params.worktreeId)).rows[0];
		const worktreePath = record?.path ?? params.worktreeId;
		if (!record || record.removed_at != null) throw new Error(`managed worktree was removed: ${worktreePath}`);
		const { removingToken, liveCount, exclusive } = collectLiveRunLeases(db, k, scope, params.checks ?? {});
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
	}, { env });
}
function claimWorktreeRemovalRow(env, params) {
	runOpenClawStateWriteTransaction((database) => {
		params.assertCurrent?.();
		const db = database.db;
		const k = kyselyLeaseFor(db);
		const scope = worktreeRunLeaseScope(params.worktreeId);
		const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select([
			"id",
			"path",
			"removed_at",
			"snapshot_ref"
		]).where("id", "=", params.worktreeId)).rows[0];
		if (!record || (params.retiredExact ? record.removed_at == null || !record.snapshot_ref?.startsWith("refs/openclaw/snapshots/exact-") : record.removed_at != null)) throw new WorktreeRemovalContentionError("finalized", `managed worktree was removed: ${record?.path ?? params.worktreeId}`);
		const { livePids, removingToken } = collectLiveRunLeases(db, k, scope, params.checks ?? {});
		if (livePids.length > 0) throw new WorktreeRemovalContentionError("busy", `worktree is busy: locked by live pid ${livePids[0]}`);
		if (removingToken !== void 0 && removingToken !== params.token) throw new WorktreeRemovalContentionError("busy", "worktree removal is already in progress");
		const payloadJson = JSON.stringify({
			pid: params.pid,
			starttime: params.startTime ?? void 0
		});
		executeSqliteQuerySync(db, k.insertInto("state_leases").values({
			scope,
			lease_key: WORKTREE_REMOVING_LEASE_KEY,
			owner: params.token,
			expires_at: null,
			heartbeat_at: null,
			payload_json: payloadJson,
			created_at: params.now,
			updated_at: params.now
		}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doUpdateSet({
			owner: params.token,
			payload_json: payloadJson,
			updated_at: params.now
		})));
	}, { env });
}
/** Synchronous lock primitive: a lost removal claim must never be reacquired implicitly. */
function assertWorktreeRemovalClaim(env, worktreeId, token) {
	const db = dbFor(env);
	if (executeSqliteQuerySync(db, kyselyLeaseFor(db).selectFrom("state_leases").select("owner").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", "__removing__")).rows[0]?.owner !== token) throw new WorktreeRemovalContentionError("busy", "Worktree removal claim changed; checkout preserved");
}
function releaseWorktreeRunLeaseRow(env, worktreeId, token) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyLeaseFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", token));
	}, { env });
}
function finalizeWorktreeRemovalRows(env, worktreeId) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyLeaseFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)));
	}, { env });
}
function abortWorktreeRemovalRow(env, worktreeId, token) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyLeaseFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", WORKTREE_REMOVING_LEASE_KEY).where("owner", "=", token));
	}, { env });
}
function hasLiveWorktreeRunLeaseRow(env, worktreeId, checks) {
	return runOpenClawStateWriteTransaction((database) => {
		const db = database.db;
		const { livePids } = collectLiveRunLeases(db, kyselyLeaseFor(db), worktreeRunLeaseScope(worktreeId), checks ?? {});
		return livePids.length > 0;
	}, { env });
}
//#endregion
export { rewriteRegistryWorktreePathsForMigration as C, retireMissingRegistryWorktree as S, WorktreeRemovalContentionError as T, insertRegistryWorktreeProvisionedChunk as _, clearRegistryWorktreeProvisionedChunks as a, listRegistryWorktreesForMigration as b, finalizeWorktreeRemovalRows as c, getRegistryWorktree as d, getRegistryWorktreeProvisionedChunk as f, insertRegistryWorktree as g, hasLiveWorktreeRunLeaseRow as h, claimWorktreeRemovalRow as i, findLiveRegistryWorktreeByOwner as l, getRegistryWorktreeProvisionedState as m, admitWorktreeRunLeaseRow as n, deleteRegistryWorktree as o, getRegistryWorktreeProvisionedPaths as p, assertWorktreeRemovalClaim as r, discardLegacyRegistryWorktrees as s, abortWorktreeRemovalRow as t, findLiveRegistryWorktreeByPath as u, listLegacyRegistryWorktreesForMigration as v, updateRegistryWorktree as w, releaseWorktreeRunLeaseRow as x, listRegistryWorktrees as y };
