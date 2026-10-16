import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { a as tableHasColumn, i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly, f as withExistingOpenClawStateDatabaseReadOnly, l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as assertRegistryMutationCustody, c as worktreeRunLeaseScope, g as rowToRecord, h as listRegistryWorktreesInDatabase, i as WorktreeRemovalContentionError, l as WORKTREE_RECORD_COLUMNS, n as releaseWorktreeRunLeaseInDatabase, o as collectLiveRunLeases, p as getRegistryWorktreeProvisionedStateInDatabase, r as WORKTREE_REMOVING_LEASE_KEY, u as getRegistryWorktreeInDatabase } from "./run-lease-store.kernel-CMstqu0z.mjs";
import "./registry-read-CqOwdsWM.mjs";
//#region src/agents/worktrees/registry.ts
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
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
		gc_protection_json: null,
		provisioned_paths_json: provisionedPaths === void 0 ? null : JSON.stringify(provisionedPaths),
		run_end_cleanup_json: record.runEndCleanup === void 0 ? null : JSON.stringify(record.runEndCleanup)
	};
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
	return getRegistryWorktreeInDatabase(dbFor(env), id);
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
function clearRegistryWorktreeProvisionedChunks(env, worktreeId) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", worktreeId));
	}, { env });
}
function insertRegistryWorktreeProvisionedChunk(env, params) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, kyselyFor(db).insertInto("worktree_provisioned_file_chunks").values({
			worktree_id: params.worktreeId,
			path: params.path,
			chunk_index: params.chunkIndex,
			data: params.data
		}));
	}, { env });
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
		assertRegistryMutationCustody(db, kyselyFor(db), id, options.removalToken);
		let update = kyselyFor(db).updateTable("worktrees").set(values).where("id", "=", id);
		if (options.onlyIfLive) update = update.where("removed_at", "is", null);
		if (options.onlyIfActiveAt !== void 0) update = update.where("last_active_at", "=", options.onlyIfActiveAt);
		executeSqliteQuerySync(db, update);
	}, { env });
}
/** Retired snapshots cannot discard provisioned data or another lifecycle's custody. */
function assertSnapshotRetirementInDatabase(db, observed) {
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("id", "=", observed.id)).rows[0];
	if (observed.removedAt === void 0 || !row || JSON.stringify(rowToRecord(row)) !== JSON.stringify(observed)) throw new Error("Worktree snapshot retirement identity changed");
	const provisioned = getRegistryWorktreeProvisionedStateInDatabase(db, observed.id);
	const chunk = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktree_provisioned_file_chunks").select("worktree_id").where("worktree_id", "=", observed.id).limit(1)).rows[0];
	if (provisioned === void 0 || provisioned.length !== 0 || chunk) throw new Error("Worktree snapshot retains provisioned data; retain its custody");
	const leases = collectLiveRunLeases(db, kyselyFor(db), worktreeRunLeaseScope(observed.id));
	if (leases.liveCount !== 0 || leases.removingToken !== void 0) throw new Error("Worktree snapshot has an active or unresolved run/removal consumer");
}
function assertRegistrySnapshotRetirement(env, observed) {
	runOpenClawStateWriteTransaction(({ db }) => assertSnapshotRetirementInDatabase(db, observed), { env });
}
function deleteRegistryWorktree(env, id, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		options.assertCurrent?.();
		if (options.expectedRetired) {
			if (options.expectedRetired.id !== id) throw new Error("Worktree snapshot retirement ID changed");
			assertSnapshotRetirementInDatabase(db, options.expectedRetired);
		}
		assertRegistryMutationCustody(db, kyselyFor(db), id, options.removalToken);
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", id));
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("id", "=", id));
	}, { env });
}
function claimWorktreeRemovalRow(env, params) {
	runOpenClawStateWriteTransaction((database) => {
		params.assertCurrent?.();
		const db = database.db;
		const k = kyselyFor(db);
		const scope = worktreeRunLeaseScope(params.worktreeId);
		const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select([
			"id",
			"path",
			"removed_at",
			"snapshot_ref"
		]).where("id", "=", params.worktreeId)).rows[0];
		if (!record || (params.retiredRemoval ? record.removed_at == null || record.snapshot_ref !== `refs/openclaw/snapshots/${params.worktreeId}` : params.retiredExact ? record.removed_at == null || !record.snapshot_ref?.startsWith("refs/openclaw/snapshots/exact-") : record.removed_at != null)) throw new WorktreeRemovalContentionError("finalized", `managed worktree was removed: ${record?.path ?? params.worktreeId}`);
		const { livePids, removingToken } = collectLiveRunLeases(db, k, scope);
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
	if (executeSqliteQuerySync(db, kyselyFor(db).selectFrom("state_leases").select("owner").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", "__removing__")).rows[0]?.owner !== token) throw new WorktreeRemovalContentionError("busy", "Worktree removal claim changed; checkout preserved");
}
function releaseWorktreeRunLeaseRow(env, worktreeId, token) {
	runOpenClawStateWriteTransaction(({ db }) => releaseWorktreeRunLeaseInDatabase(db, worktreeId, token), { env }, { operationLabel: "worktrees.releaseRunLease" });
}
function finalizeWorktreeRemovalRows(env, worktreeId) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)));
	}, { env });
}
function abortWorktreeRemovalRow(env, worktreeId, token) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", WORKTREE_REMOVING_LEASE_KEY).where("owner", "=", token));
	}, { env });
}
function hasLiveWorktreeRunLeaseRow(env, worktreeId) {
	return withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => collectLiveRunLeases(db, kyselyFor(db), worktreeRunLeaseScope(worktreeId), false).livePids.length > 0, { env }) ?? false;
}
//#endregion
export { listRegistryWorktreesForMigration as _, clearRegistryWorktreeProvisionedChunks as a, updateRegistryWorktree as b, finalizeWorktreeRemovalRows as c, getRegistryWorktree as d, hasLiveWorktreeRunLeaseRow as f, listRegistryWorktrees as g, listLegacyRegistryWorktreesForMigration as h, claimWorktreeRemovalRow as i, findLiveRegistryWorktreeByOwner as l, insertRegistryWorktreeProvisionedChunk as m, assertRegistrySnapshotRetirement as n, deleteRegistryWorktree as o, insertRegistryWorktree as p, assertWorktreeRemovalClaim as r, discardLegacyRegistryWorktrees as s, abortWorktreeRemovalRow as t, findLiveRegistryWorktreeByPath as u, releaseWorktreeRunLeaseRow as v, rewriteRegistryWorktreePathsForMigration as y };
