import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import "./placement-record-BfcBeilz.mjs";
import { i as getRequired, n as find } from "./placement-row-codec-DzKFQEtn.mjs";
import { l as serializeWorkerWorkspaceReconciliationPlan } from "./workspace-manifest-q-txD9ZU.mjs";
import "./workspace-reconcile-DEtkg-5s.mjs";
import "node:crypto";
//#region src/gateway/worker-environments/placement-workspace-journal.ts
const query = (db) => getNodeSqliteKysely(db);
function isCurrentJournalOwner(db, placement, owner) {
	if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch) return false;
	if (placement.generation === owner.placementGeneration) return true;
	if (placement.state !== "draining" || placement.generation !== owner.placementGeneration + 1) return false;
	return executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", owner.sessionId).where("environment_id", "=", owner.environmentId).where("owner_epoch", "=", owner.ownerEpoch).where("placement_generation", "=", owner.placementGeneration)).rows[0] !== void 0;
}
function assertJournalOwner(db, owner, options = {}) {
	const placement = getRequired(db, owner.sessionId);
	const isCurrentOwner = isCurrentJournalOwner(db, placement, owner);
	const isAllowedFailedOwner = options.allowFailedOwner === true && placement.state === "failed" && placement.generation > owner.placementGeneration && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch;
	if (!isCurrentOwner && !isAllowedFailedOwner) throw new Error(`Cannot reconcile stale worker workspace for session ${owner.sessionId}`);
	return placement;
}
function clearWorkerWorkspaceReconciliation(db, sessionId, currentManifestRef) {
	const existing = executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_reconciliations").select("current_manifest_ref").where("session_id", "=", sessionId)).rows[0];
	if (existing && currentManifestRef && existing.current_manifest_ref !== currentManifestRef) throw new Error(`Worker workspace journal result changed for session ${sessionId}`);
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_workspace_reconciliations").where("session_id", "=", sessionId));
}
function listWorkspaceReconciliationOwners(db) {
	return executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_reconciliations").select([
		"session_id",
		"environment_id",
		"owner_epoch",
		"placement_generation"
	]).orderBy("session_id")).rows.map((row) => ({
		sessionId: row.session_id,
		environmentId: row.environment_id,
		ownerEpoch: row.owner_epoch,
		placementGeneration: row.placement_generation
	}));
}
function createPlacementWorkspaceJournalOps(runtime) {
	const { now, write } = runtime;
	return {
		pruneOrphanedWorkspaceReconciliations() {
			return write((db) => {
				const pruned = [];
				const changes = [];
				for (const owner of listWorkspaceReconciliationOwners(db)) {
					const placement = find(db, owner.sessionId);
					const stillOwned = isCurrentJournalOwner(db, placement, owner);
					const retainedFailedOwner = placement?.state === "failed" && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch && placement.generation > owner.placementGeneration && placement.recoveryError.startsWith("Worker result abandoned by forced operator teardown");
					if (stillOwned || retainedFailedOwner) continue;
					if (executeSqliteQuerySync(db, query(db).deleteFrom("worker_workspace_reconciliations").where("session_id", "=", owner.sessionId).where("environment_id", "=", owner.environmentId).where("owner_epoch", "=", owner.ownerEpoch).where("placement_generation", "=", owner.placementGeneration)).numAffectedRows === 1n) {
						pruned.push(owner);
						if (placement) {
							const change = {
								agentId: placement.agentId,
								sessionKey: placement.sessionKey
							};
							changes.push(change);
							sessionChanges.emit(change, db);
						}
					}
				}
				return {
					owners: pruned,
					changes
				};
			});
		},
		beginWorkspaceReconciliation(owner, journal) {
			if (journal.appliedManifestRef) throw new Error("Worker workspace reconciliation cannot begin as already applied");
			return write((db) => {
				const placement = assertJournalOwner(db, owner);
				if (placement.workspaceBaseManifestRef !== journal.baseManifestRef) throw new Error(`Worker workspace base changed for session ${owner.sessionId}`);
				if (executeSqliteQuerySync(db, query(db).insertInto("worker_workspace_reconciliations").values({
					session_id: owner.sessionId,
					environment_id: owner.environmentId,
					owner_epoch: owner.ownerEpoch,
					placement_generation: owner.placementGeneration,
					base_manifest_ref: journal.baseManifestRef,
					current_manifest_ref: journal.currentManifestRef,
					plan_json: serializeWorkerWorkspaceReconciliationPlan(journal),
					base_pack: journal.basePack,
					created_at_ms: now()
				}).onConflict((conflict) => conflict.column("session_id").doNothing())).numAffectedRows !== 1n) throw new Error(`Worker workspace reconciliation is already pending for ${owner.sessionId}`);
				const change = {
					agentId: placement.agentId,
					sessionKey: placement.sessionKey
				};
				sessionChanges.emit(change, db);
				return {
					owners: [owner],
					changes: [change]
				};
			});
		},
		abortWorkspaceReconciliation(owner, options = {}) {
			return write((db) => {
				if (!options.force) {
					const placement = assertJournalOwner(db, owner);
					clearWorkerWorkspaceReconciliation(db, owner.sessionId);
					const change = {
						agentId: placement.agentId,
						sessionKey: placement.sessionKey
					};
					sessionChanges.emit(change, db);
					return {
						owners: [owner],
						changes: [change]
					};
				}
				if (executeSqliteQuerySync(db, query(db).deleteFrom("worker_workspace_reconciliations").where("session_id", "=", owner.sessionId).where("environment_id", "=", owner.environmentId).where("owner_epoch", "=", owner.ownerEpoch).where("placement_generation", "=", owner.placementGeneration)).numAffectedRows !== 1n) throw new Error(`Worker workspace journal changed for ${owner.sessionId}`);
				const change = {
					all: true,
					scope: "worker-placements"
				};
				sessionChanges.emit(change, db);
				return {
					owners: [owner],
					changes: [change]
				};
			});
		}
	};
}
//#endregion
export { createPlacementWorkspaceJournalOps as n, clearWorkerWorkspaceReconciliation as t };
