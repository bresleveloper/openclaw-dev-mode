import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { h as ensureRepositoryWorkspacePendingResultSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { g as resolvePlacementTurnEnvironment } from "./placement-record-BfcBeilz.mjs";
import { C as matchesWorkspaceResultClaim, S as isCurrentWorkerWorkspacePendingResultOwner, g as publishPlacementWorkspaceResultState, i as getRequired, r as fromRow } from "./placement-row-codec-DzKFQEtn.mjs";
import { t as clearWorkerWorkspaceReconciliation } from "./placement-workspace-journal-DhEkGjMG.mjs";
//#region src/gateway/worker-environments/placement-workspace-result.ts
const query = (db) => getNodeSqliteKysely(db);
function pendingResultFromRow(row) {
	return {
		sessionId: row.session_id,
		environmentId: row.environment_id,
		ownerEpoch: row.owner_epoch,
		placementGeneration: row.placement_generation,
		claimId: row.claim_id,
		runId: row.run_id,
		gatewayInstanceId: row.gateway_instance_id,
		recoveryRequestedAtMs: row.recovery_requested_at_ms,
		workspaceAcceptedAtMs: row.workspace_accepted_at_ms,
		stagedResultRef: row.staged_result_ref,
		...row.repository_workspace_id ? { repositoryWorkspaceId: row.repository_workspace_id } : {}
	};
}
async function findPendingWorkerWorkspaceResult(placements, claim) {
	return (await placements.listPendingWorkspaceResultsAsync(claim.sessionId)).find((pending) => pending.sessionId === claim.sessionId && pending.claimId === claim.claimId && pending.runId === claim.runId);
}
function hasCurrentWorkspaceResultClaim(db, claim) {
	const placement = getRequired(db, claim.sessionId);
	const row = executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "=", claim.sessionId)).rows[0];
	return Boolean(row && matchesWorkspaceResultClaim(placement, pendingResultFromRow(row), claim));
}
function clearWorkerWorkspacePendingResult(db, sessionId) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_workspace_pending_results").where("session_id", "=", sessionId));
	publishPlacementWorkspaceResultState(db, sessionId);
}
function readWorkerWorkspaceReconciliationFacts(db, sessionIds) {
	const placements = /* @__PURE__ */ new Map();
	const pendingResults = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < sessionIds.length; offset += 250) {
		const chunk = sessionIds.slice(offset, offset + 250);
		for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "in", chunk)).rows) {
			const placement = fromRow(row);
			placements.set(placement.sessionId, placement);
		}
		for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "in", chunk)).rows) pendingResults.set(row.session_id, pendingResultFromRow(row));
	}
	return {
		placements,
		reconcilingSessionIds: new Set([...pendingResults.values()].flatMap((pending) => {
			const placement = placements.get(pending.sessionId);
			return (placement?.turnClaim?.owner === "worker" || pending.stagedResultRef !== null) && isCurrentWorkerWorkspacePendingResultOwner(placement, pending) ? [pending.sessionId] : [];
		})),
		pendingResults
	};
}
function hasWorkerWorkspacePendingResult(db, sessionId) {
	return Boolean(executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", sessionId)).rows[0]);
}
function hasAcceptedWorkerWorkspacePendingResult(db, sessionId) {
	return Boolean(executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", sessionId).where("workspace_accepted_at_ms", "is not", null)).rows[0]);
}
function insertWorkerWorkspacePendingResult(db, claim, nowMs, gatewayInstanceId) {
	const placement = getRequired(db, claim.sessionId);
	const environment = resolvePlacementTurnEnvironment(placement, claim);
	if (!environment) throw new Error(`Cannot retain stale worker workspace result for ${claim.sessionId}`);
	const { environmentId, ownerEpoch } = environment;
	if (executeSqliteQuerySync(db, query(db).insertInto("worker_workspace_pending_results").values({
		session_id: claim.sessionId,
		environment_id: environmentId,
		owner_epoch: ownerEpoch,
		placement_generation: claim.placementGeneration,
		claim_id: claim.claimId,
		run_id: claim.runId,
		gateway_instance_id: gatewayInstanceId,
		recovery_requested_at_ms: null,
		workspace_accepted_at_ms: null,
		staged_result_ref: null,
		created_at_ms: nowMs
	}).onConflict((conflict) => conflict.column("session_id").doNothing())).numAffectedRows === 1n) {
		publishPlacementWorkspaceResultState(db, placement.sessionId);
		sessionChanges.emit({
			agentId: placement.agentId,
			sessionKey: placement.sessionKey
		}, db);
		return;
	}
	const existing = executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "=", claim.sessionId)).rows[0];
	if (!existing || existing.environment_id !== environmentId || existing.owner_epoch !== ownerEpoch || existing.placement_generation !== claim.placementGeneration || existing.claim_id !== claim.claimId || existing.run_id !== claim.runId) throw new Error(`Worker workspace result is already pending for ${claim.sessionId}`);
}
function markWorkerWorkspacePendingResultAccepted(db, claim, nowMs) {
	const placement = getRequired(db, claim.sessionId);
	const environment = resolvePlacementTurnEnvironment(placement, claim);
	if (!environment && !hasCurrentWorkspaceResultClaim(db, claim)) throw new Error(`Cannot accept stale worker workspace result for ${claim.sessionId}`);
	const environmentId = environment?.environmentId ?? placement.environmentId;
	const ownerEpoch = environment?.ownerEpoch ?? placement.activeOwnerEpoch;
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_workspace_pending_results").set({ workspace_accepted_at_ms: nowMs }).where("session_id", "=", claim.sessionId).where("environment_id", "=", environmentId).where("owner_epoch", "=", ownerEpoch).where("placement_generation", "=", claim.placementGeneration).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId)).numAffectedRows !== 1n) throw new Error(`Cannot accept stale worker workspace result for ${claim.sessionId}`);
}
const assertPendingClaim = (db, claim) => {
	const placement = getRequired(db, claim.sessionId);
	const row = executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "=", claim.sessionId)).rows[0];
	if (!row || !matchesWorkspaceResultClaim(placement, pendingResultFromRow(row), claim)) throw new Error(`Cannot update stale worker workspace result for ${claim.sessionId}`);
	publishPlacementWorkspaceResultState(db, placement.sessionId);
	sessionChanges.emit({
		agentId: placement.agentId,
		sessionKey: placement.sessionKey
	}, db);
	return row;
};
function recordStagedWorkerWorkspaceResult(db, claim, stagedResultRef, repositoryWorkspaceId) {
	if (!/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(stagedResultRef)) throw new Error("Worker workspace staged result reference is invalid");
	if (repositoryWorkspaceId !== void 0 && !/^[a-f0-9-]{36}$/u.test(repositoryWorkspaceId)) throw new Error("Worker workspace result repository identity is invalid");
	if (repositoryWorkspaceId !== void 0) ensureRepositoryWorkspacePendingResultSchema(db);
	const pending = assertPendingClaim(db, claim);
	if (pending.workspace_accepted_at_ms !== null) throw new Error(`Cannot restage accepted worker workspace result for ${claim.sessionId}`);
	if (pending.staged_result_ref && (pending.staged_result_ref !== stagedResultRef || (pending.repository_workspace_id ?? void 0) !== repositoryWorkspaceId)) throw new Error(`Worker workspace result ref changed for ${claim.sessionId}`);
	if (repositoryWorkspaceId !== void 0) {
		const placement = getRequired(db, claim.sessionId);
		const repository = executeSqliteQuerySync(db, query(db).selectFrom("session_repository_workspaces").select(["agent_id", "session_key"]).where("workspace_id", "=", repositoryWorkspaceId)).rows[0];
		if (!repository || repository.agent_id !== placement.agentId || repository.session_key !== placement.sessionKey) throw new Error(`Worker workspace result repository owner changed for ${claim.sessionId}`);
	}
	if (executeSqliteQuerySync(db, query(db).updateTable("worker_workspace_pending_results").set({
		staged_result_ref: stagedResultRef,
		...repositoryWorkspaceId ? { repository_workspace_id: repositoryWorkspaceId } : {}
	}).where("session_id", "=", claim.sessionId).where("claim_id", "=", claim.claimId).where("run_id", "=", claim.runId)).numAffectedRows !== 1n) throw new Error(`Cannot stage stale worker workspace result for ${claim.sessionId}`);
}
function listPendingWorkerWorkspaceResultsInDatabase(db, sessionId) {
	let select = query(db).selectFrom("worker_workspace_pending_results").selectAll();
	if (sessionId !== void 0) select = select.where("session_id", "=", sessionId);
	return executeSqliteQuerySync(db, select.orderBy("session_id")).rows.map(pendingResultFromRow);
}
function createPlacementWorkspaceResultOps(runtime) {
	const { instanceId, now, write } = runtime;
	return {
		markWorkspaceResultPending(claim) {
			write((db) => {
				insertWorkerWorkspacePendingResult(db, claim, now(), instanceId);
			});
		},
		acceptWorkspaceResult(claim) {
			write((db) => {
				assertPendingClaim(db, claim);
				markWorkerWorkspacePendingResultAccepted(db, claim, now());
				clearWorkerWorkspaceReconciliation(db, claim.sessionId);
			});
		},
		handoffWorkspaceResultRecovery(claim) {
			write((db) => {
				if (assertPendingClaim(db, claim).gateway_instance_id !== instanceId) throw new Error(`Worker workspace result belongs to another gateway for ${claim.sessionId}`);
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_workspace_pending_results").set({ recovery_requested_at_ms: now() }).where("session_id", "=", claim.sessionId).where("gateway_instance_id", "=", instanceId)).numAffectedRows !== 1n) throw new Error(`Worker workspace result changed for ${claim.sessionId}`);
			});
		},
		abandonWorkspaceResult(pending) {
			write((db) => {
				if (executeSqliteQuerySync(db, query(db).deleteFrom("worker_workspace_pending_results").where("session_id", "=", pending.sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).numAffectedRows !== 1n) throw new Error(`Worker workspace result changed for ${pending.sessionId}`);
				publishPlacementWorkspaceResultState(db, pending.sessionId);
				sessionChanges.emit({
					all: true,
					scope: "worker-placements"
				}, db);
			});
		}
	};
}
//#endregion
export { hasCurrentWorkspaceResultClaim as a, listPendingWorkerWorkspaceResultsInDatabase as c, hasAcceptedWorkerWorkspacePendingResult as i, readWorkerWorkspaceReconciliationFacts as l, createPlacementWorkspaceResultOps as n, hasWorkerWorkspacePendingResult as o, findPendingWorkerWorkspaceResult as r, insertWorkerWorkspacePendingResult as s, clearWorkerWorkspacePendingResult as t, recordStagedWorkerWorkspaceResult as u };
