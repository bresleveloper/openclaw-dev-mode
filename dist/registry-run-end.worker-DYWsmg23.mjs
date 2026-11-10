import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { n as isLockOwnerDefinitelyStale } from "./stale-lock-file-BdSoQ5K8.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { c as registryAuthorityChanged, i as WorktreeRemovalContentionError, n as SessionWorktreeSourceChangedError, t as SessionWorktreeLifecycleError } from "./errors-WYf-uyBk.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as readStateLeaseProcessOwnerStatus, t as parseStateLeaseProcessOwner } from "./state-lease-process-owner-CPrBcVUW.mjs";
import { n as WorktreeRecordSchema } from "./worktrees-CsBxYnMn.mjs";
import { i as worktreeRegistryPublication, r as withWorktreeRegistryWorkerReceipt } from "./registry-publication-BJype9QG.mjs";
import { c as listRegistryWorktreesInDatabase, l as rowToRecord, r as getRegistryWorktreeInDatabase, t as findLiveRegistryWorktreeByOwnerInDatabase } from "./registry-read.kernel-D89C5gDY.mjs";
import { r as assertOpenClawStateLeasesWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { Value } from "typebox/value";
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
	if (reapStale && staleKeys.length > 0) {
		const removed = executeSqliteQuerySync(db, k.deleteFrom("state_leases").where("scope", "=", scope).where("lease_key", "in", staleKeys).returning(["scope", "lease_key"])).rows;
		worktreeRegistryPublication.deleted(db, removed);
	}
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
//#region src/agents/worktrees/pending-slots.worker.ts
const PENDING_SCOPE = "core:managed-worktrees:pending-slots";
const query$1 = (db) => getNodeSqliteKysely(db);
function readSlots(db) {
	return executeSqliteQuerySync(db, query$1(db).selectFrom("state_leases").selectAll().where("scope", "=", PENDING_SCOPE)).rows.map(decodeSlot);
}
function decodeSlot(row) {
	const payload = safeParseJsonRecord(row.payload_json ?? "");
	const record = payload?.record;
	const state = payload?.state;
	if (!isPendingRecord(record) || record.id !== row.lease_key || record.id !== row.owner || record.removedAt !== void 0 || state !== "pending" && state !== "recovering") throw new Error(`Invalid pending worktree slot: ${row.lease_key}; run Doctor before creating`);
	return {
		record,
		state,
		owner: parseStateLeaseProcessOwner(row.payload_json)
	};
}
function isPendingRecord(value) {
	return Value.Check(WorktreeRecordSchema, value);
}
/** One statement observes publication as either pending or live, never neither or both. */
function readWorktreeSlotCountInDatabase(db) {
	const k = query$1(db);
	return executeSqliteQuerySync(db, k.selectFrom("worktrees").select((eb) => [
		"id",
		eb.val("live").as("kind"),
		eb.val(null).as("owner"),
		eb.val(null).as("payload_json")
	]).where("removed_at", "is", null).unionAll(k.selectFrom("state_leases").select((eb) => [
		"lease_key as id",
		eb.val("slot").as("kind"),
		"owner",
		"payload_json"
	]).where("scope", "=", PENDING_SCOPE))).rows.reduce((count, row) => count + (row.kind === "live" || decodeSlot({
		...row,
		lease_key: row.id
	}).state === "pending" ? 1 : 0), 0);
}
function readPendingWorktreesInDatabase(db) {
	return readSlots(db).map(({ record, state }) => ({
		record,
		state
	}));
}
function assertPendingWorktreeMutationLease(id, leases = []) {
	if (!leases.some((lease) => lease.scope === "core:managed-worktrees:mutation" && lease.key === id)) throw new Error("Pending worktree mutation requires its retained checkout lease");
}
function reservePendingWorktreeInDatabase(db, value, leases = []) {
	const { record } = value;
	assertPendingWorktreeMutationLease(record.id, leases);
	if (!leases.some((lease) => lease.scope === "core:managed-worktrees:create" && lease.key === "capacity")) throw new Error("Pending worktree reservation requires the allocation lease");
	if ([...readSlots(db), ...listRegistryWorktreesInDatabase(db, { liveOnly: true }).map((current) => ({
		record: current,
		state: "pending"
	}))].some(({ record: current, state }) => current.id === record.id || current.path === record.path || current.repoFingerprint === record.repoFingerprint && current.name === record.name || state !== "recovering" && record.ownerId !== void 0 && current.ownerKind === record.ownerKind && current.ownerId === record.ownerId)) throw new Error("Managed worktree name or owner already has a live or pending checkout");
	executeSqliteQuerySync(db, query$1(db).insertInto("state_leases").values({
		scope: PENDING_SCOPE,
		lease_key: record.id,
		owner: record.id,
		expires_at: null,
		heartbeat_at: null,
		payload_json: JSON.stringify({
			...value,
			state: "pending"
		}),
		created_at: record.createdAt,
		updated_at: record.createdAt
	}));
}
function recoverPendingWorktreesInDatabase(db, _input, leases = []) {
	if (!leases.some((lease) => lease.scope === "core:managed-worktrees:create" && lease.key === "capacity")) throw new Error("Pending worktree recovery requires the allocation lease");
	for (const slot of readSlots(db)) {
		if (slot.state !== "pending" || readStateLeaseProcessOwnerStatus(slot.owner) !== "dead") continue;
		executeSqliteQuerySync(db, query$1(db).updateTable("state_leases").set({
			payload_json: JSON.stringify({
				...slot,
				state: "recovering"
			}),
			updated_at: Date.now()
		}).where("scope", "=", PENDING_SCOPE).where("lease_key", "=", slot.record.id).where("owner", "=", slot.record.id));
	}
}
function releasePendingWorktreeInDatabase(db, { id }, leases = []) {
	assertPendingWorktreeMutationLease(id, leases);
	executeSqliteQuerySync(db, query$1(db).deleteFrom("state_leases").where("scope", "=", PENDING_SCOPE).where("lease_key", "=", id).where("owner", "=", id));
}
function publishPendingWorktreeInDatabase(db, id, record, leases = []) {
	const slot = readSlots(db).find((candidate) => candidate.record.id === id);
	if (!slot || slot.state !== "pending" || [
		"id",
		"path",
		"name",
		"ownerKind",
		"ownerId",
		"repoRoot",
		"repoFingerprint",
		"branch",
		"createdAt"
	].some((key) => slot.record[key] !== record[key])) throw new Error("Pending worktree identity changed before publication");
	releasePendingWorktreeInDatabase(db, { id }, leases);
}
//#endregion
//#region src/agents/worktrees/registry-run-end.worker.ts
const query = (db) => getNodeSqliteKysely(db);
function insertRegistryWorktreeInDatabase(db, { record, provisionedPaths, pendingId }, leases) {
	if (pendingId !== void 0) publishPendingWorktreeInDatabase(db, pendingId, record, leases);
	const inserted = executeSqliteQuerySync(db, query(db).insertInto("worktrees").values({
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
	}).returningAll()).rows;
	worktreeRegistryPublication.rows(db, inserted);
}
function updateRegistryWorktreeInDatabase(db, input) {
	const { id, patch } = input;
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
	assertRegistryMutationCustody(db, query(db), id, input.removalToken);
	let update = query(db).updateTable("worktrees").set(values).where("id", "=", id);
	if (input.onlyIfLive) update = update.where("removed_at", "is", null);
	if (input.onlyIfActiveAt !== void 0) update = update.where("last_active_at", "=", input.onlyIfActiveAt);
	worktreeRegistryPublication.rows(db, executeSqliteQuerySync(db, update.returningAll()).rows);
}
function assertRemovalToken(db, id, token) {
	if (executeSqliteQuerySync(db, query(db).selectFrom("state_leases").select("owner").where("scope", "=", worktreeRunLeaseScope(id)).where("lease_key", "=", "__removing__")).rows[0]?.owner !== token) throw new WorktreeRemovalContentionError("busy", "Worktree removal claim changed; checkout preserved");
}
function assertPredicate(db, predicate) {
	if (predicate.kind === "snapshot-retirement") return assertSnapshotRetirementInDatabase(db, predicate.record);
	if (predicate.kind === "removal-claim") return assertRemovalToken(db, predicate.id, predicate.token);
	if (predicate.kind === "removal-claims") {
		const ids = [...new Set(predicate.ids)];
		if (ids.length === 0) return;
		if (executeSqliteQuerySync(db, query(db).selectFrom("state_leases").select((eb) => eb.fn.countAll().as("held")).where("scope", "in", sqliteStringSet(ids.map(worktreeRunLeaseScope))).where("lease_key", "=", "__removing__").where("owner", "=", predicate.token)).rows[0]?.held !== ids.length) throw new WorktreeRemovalContentionError("busy", "Worktree removal claim changed; checkout preserved");
		return;
	}
	const observed = "record" in predicate ? predicate.record : predicate;
	const current = predicate.kind === "source-owner" ? findLiveRegistryWorktreeByOwnerInDatabase(db, "session", predicate.ownerId) : getRegistryWorktreeInDatabase(db, observed.id);
	switch (predicate.kind) {
		case "live-binding":
			if (!current || current.removedAt !== void 0 || [
				"ownerKind",
				"ownerId",
				"branch",
				"repoRoot"
			].some((key) => current[key] !== predicate.record[key])) throw new SessionWorktreeLifecycleError("Managed worktree binding authority changed.", "owner-mismatch");
			if (current.path !== predicate.record.path || current.repoFingerprint !== predicate.record.repoFingerprint) throw new SessionWorktreeSourceChangedError("Managed worktree binding source changed.");
			return;
		case "session-owner":
			if (current && (current.ownerKind !== "session" || current.ownerId !== predicate.sessionKey)) throw registryAuthorityChanged(predicate.kind);
			return;
		case "binding":
			if (!current || [
				"path",
				"repoRoot",
				"repoFingerprint",
				"branch",
				"baseRef",
				"ownerKind",
				"ownerId",
				"createdAt",
				"lastActiveAt",
				"removedAt"
			].some((key) => current[key] !== predicate.record[key])) throw registryAuthorityChanged(predicate.kind);
			return;
		case "activity":
			if (current?.lastActiveAt !== predicate.lastActiveAt) throw registryAuthorityChanged(predicate.kind);
			return;
		case "record":
			if (JSON.stringify(current) !== JSON.stringify(predicate.record)) throw registryAuthorityChanged(predicate.kind);
			return;
		case "exact-snapshot": {
			const record = predicate.record;
			if (!current || current.ownerKind !== record.ownerKind || current.ownerId !== record.ownerId || current.createdAt !== record.createdAt || current.lastActiveAt !== record.lastActiveAt || current.removedAt !== record.removedAt || current.path !== record.path || current.repoRoot !== record.repoRoot || current.repoFingerprint !== record.repoFingerprint || current.branch !== record.branch || current.snapshotRef !== record.snapshotRef) throw registryAuthorityChanged(predicate.kind);
			return;
		}
		case "exact-owner": {
			const record = predicate.record;
			if (!current || current.removedAt !== void 0 || current.ownerKind !== record.ownerKind || current.ownerId !== record.ownerId || current.createdAt !== record.createdAt || current.lastActiveAt !== record.lastActiveAt) throw registryAuthorityChanged(predicate.kind);
			if (current.path !== record.path || current.branch !== record.branch || current.repoRoot !== record.repoRoot) throw new Error("Worktree exact-state binding changed; checkout preserved");
			return;
		}
		case "projection":
			if (!current || current.ownerKind !== "session" || current.ownerId !== predicate.ownerId || current.path !== predicate.path || current.repoRoot !== predicate.repoRoot) throw registryAuthorityChanged(predicate.kind);
			return;
		case "source-owner":
			if (current?.id !== predicate.id || current.repoRoot !== predicate.repoRoot || current.path !== predicate.path) throw registryAuthorityChanged(predicate.kind);
			return;
		case "source-record": if (current?.ownerId !== predicate.ownerId || current?.repoRoot !== predicate.repoRoot || current?.repoFingerprint !== predicate.repoFingerprint) throw registryAuthorityChanged(predicate.kind);
	}
}
function assertWorktreeRegistryPredicates(db, predicates = []) {
	for (const predicate of predicates) assertPredicate(db, predicate);
}
/** Git equality cannot release provisioned bytes or a live lifecycle's recovery custody. */
function assertSnapshotRetirementInDatabase(db, observed, reapStaleLeases = false) {
	const k = getNodeSqliteKysely(db);
	const row = executeSqliteQuerySync(db, k.selectFrom("worktrees").selectAll("worktrees").select((eb) => eb.exists(eb.selectFrom("worktree_provisioned_file_chunks").select("worktree_id").whereRef("worktree_id", "=", "worktrees.id")).as("has_chunks")).where("id", "=", observed.id)).rows[0];
	if (observed.removedAt === void 0 || !row || JSON.stringify(rowToRecord(row)) !== JSON.stringify(observed)) throw registryAuthorityChanged("snapshot-retirement");
	const provisioned = safeParseJson(row.provisioned_paths_json ?? "");
	if (!Array.isArray(provisioned) || provisioned.length !== 0 || row.has_chunks) throw new Error("Worktree snapshot retains provisioned data; retain its custody");
	const leases = collectLiveRunLeases(db, k, worktreeRunLeaseScope(observed.id), reapStaleLeases);
	if (leases.liveCount !== 0 || leases.removingToken !== void 0) throw new Error("Worktree snapshot has an active or unresolved run/removal consumer");
}
function deleteRegistryWorktreeInDatabase(db, input) {
	if (input.expectedRetired) {
		if (input.expectedRetired.id !== input.id) throw new Error("Worktree snapshot retirement ID changed");
		assertSnapshotRetirementInDatabase(db, input.expectedRetired, true);
	}
	const k = getNodeSqliteKysely(db);
	assertRegistryMutationCustody(db, k, input.id, input.removalToken);
	executeSqliteQuerySync(db, k.deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", input.id));
	worktreeRegistryPublication.deleted(db, executeSqliteQuerySync(db, k.deleteFrom("worktrees").where("id", "=", input.id).returningAll()).rows);
}
function worktreeRunEndMutation(operationLabel, mutate) {
	return (input, context) => {
		const database = context.open();
		runOpenClawStateWriteTransaction(({ db }) => {
			const admit = (stage) => {
				if (input.leases) assertOpenClawStateLeasesWorkerOwnedInTransaction(db, input.leases, stage);
				else requestSqliteWorkerOperationAdmission({
					stage,
					facts: void 0
				});
			};
			admit("transaction");
			assertWorktreeRegistryPredicates(db, input.predicates);
			withWorktreeRegistryWorkerReceipt(db, () => {
				mutate(db, input.value, input.leases);
				admit("commit");
			}, input.receipt);
		}, {
			...context.stateOptions(),
			database
		}, { operationLabel });
	};
}
const recoverPendingWorktreesInWorker = worktreeRunEndMutation("worktrees.recoverPending", recoverPendingWorktreesInDatabase);
function claimWorktreeRemovalInDatabase(db, params) {
	const k = query(db);
	const scope = worktreeRunLeaseScope(params.worktreeId);
	const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select([
		"id",
		"path",
		"removed_at",
		"snapshot_ref"
	]).where("id", "=", params.worktreeId)).rows[0];
	if (!record || (params.retiredRemoval ? record.removed_at == null || record.snapshot_ref !== `refs/openclaw/snapshots/${params.worktreeId}` : params.retiredExact ? record.removed_at == null || !record.snapshot_ref?.startsWith("refs/openclaw/snapshots/exact-") : record.removed_at != null)) throw new WorktreeRemovalContentionError("finalized", `managed worktree was removed: ${record?.path ?? params.worktreeId}`);
	const { livePids, removingToken } = collectLiveRunLeases(db, k, scope);
	if (livePids.length > 0) throw new WorktreeRemovalContentionError("busy", `worktree is busy: locked by live pid ${livePids[0]}`, {
		worktreeId: params.worktreeId,
		pid: livePids[0]
	});
	if (removingToken !== void 0 && removingToken !== params.token) throw new WorktreeRemovalContentionError("busy", "worktree removal is already in progress");
	const payloadJson = JSON.stringify({
		pid: params.pid,
		starttime: params.startTime ?? void 0
	});
	const inserted = executeSqliteQuerySync(db, k.insertInto("state_leases").values({
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
	})).returningAll()).rows;
	worktreeRegistryPublication.rows(db, inserted);
}
function finalizeWorktreeRemovalInDatabase(db, input) {
	const record = getRegistryWorktreeInDatabase(db, input.worktreeId);
	if (!record || record.lastActiveAt !== input.lastActiveAt || record.removedAt !== input.removedAt) throw new WorktreeRemovalContentionError("finalized", "Worktree removal lifecycle changed");
	if (input.token) assertRemovalToken(db, input.worktreeId, input.token);
	const removed = executeSqliteQuerySync(db, query(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(input.worktreeId)).returning(["scope", "lease_key"])).rows;
	worktreeRegistryPublication.deleted(db, removed);
}
function abortWorktreeRemovalInDatabase(db, input) {
	const removed = executeSqliteQuerySync(db, query(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(input.worktreeId)).where("lease_key", "=", WORKTREE_REMOVING_LEASE_KEY).where("owner", "=", input.token).returning(["scope", "lease_key"])).rows;
	worktreeRegistryPublication.deleted(db, removed);
}
//#endregion
export { worktreeRunLeaseScope as _, finalizeWorktreeRemovalInDatabase as a, updateRegistryWorktreeInDatabase as c, readWorktreeSlotCountInDatabase as d, releasePendingWorktreeInDatabase as f, reapWorktreeRunLeasesInDatabase as g, collectLiveRunLeases as h, deleteRegistryWorktreeInDatabase as i, worktreeRunEndMutation as l, WORKTREE_REMOVING_LEASE_KEY as m, assertWorktreeRegistryPredicates as n, insertRegistryWorktreeInDatabase as o, reservePendingWorktreeInDatabase as p, claimWorktreeRemovalInDatabase as r, recoverPendingWorktreesInWorker as s, abortWorktreeRemovalInDatabase as t, readPendingWorktreesInDatabase as u };
