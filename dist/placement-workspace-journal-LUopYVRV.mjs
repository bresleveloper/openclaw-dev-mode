import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { l as serializeWorkerWorkspaceReconciliationPlan } from "./workspace-manifest-BR0NHoW3.mjs";
import "./workspace-reconcile-BuXOoPIv.mjs";
import "./placement-record-CBaaHws5.mjs";
import { E as publishPlacementWorkspaceJournalState, i as getRequired, n as find } from "./placement-row-codec-DhdW6tSs.mjs";
import "node:crypto";
//#region src/gateway/worker-environments/placement-workspace-journal.ts
const query = (db) => getNodeSqliteKysely(db);
function isCurrentJournalOwner(db, placement, owner, pendingResults) {
	if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch) return false;
	if (placement.generation === owner.placementGeneration) return true;
	if (placement.state !== "draining" || placement.generation !== owner.placementGeneration + 1) return false;
	const pending = pendingResults ? pendingResults.get(owner.sessionId) : executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").select([
		"environment_id as environmentId",
		"owner_epoch as ownerEpoch",
		"placement_generation as placementGeneration"
	]).where("session_id", "=", owner.sessionId)).rows[0];
	return pending?.environmentId === owner.environmentId && pending.ownerEpoch === owner.ownerEpoch && pending.placementGeneration === owner.placementGeneration;
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
	publishPlacementWorkspaceJournalState(db, sessionId, false);
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
						publishPlacementWorkspaceJournalState(db, owner.sessionId, false);
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
				publishPlacementWorkspaceJournalState(db, owner.sessionId, true);
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
				publishPlacementWorkspaceJournalState(db, owner.sessionId, false);
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
export { createPlacementWorkspaceJournalOps as n, isCurrentJournalOwner as r, clearWorkerWorkspaceReconciliation as t };
