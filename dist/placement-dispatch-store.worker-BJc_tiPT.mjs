import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as matchesWorkerPlacementTarget, t as isFailedWorkerPlacementEnvironmentGone } from "./placement-target-B4CmGwso.mjs";
import { c as normalizeIdentity, o as nextGeneration, u as normalizeWorkerPlacementExecutionMode } from "./placement-record-BfcBeilz.mjs";
import { a as query, i as getRequired, t as ensureLocal } from "./placement-row-codec-DzKFQEtn.mjs";
import { o as hasWorkerWorkspacePendingResult } from "./placement-workspace-result-Dw6JZ899.mjs";
import { n as readWorkerPlacementMovesReadOnly } from "./placement-move-intent-DuwDH85-.mjs";
import { r as assertSessionWorkspaceUnreserved } from "./placement-workspace-reservation.kernel-DAyC6kqY.mjs";
import { n as findWorkerEnvironment } from "./store-row-codec-Bhj-SxXe.mjs";
//#region src/gateway/worker-environments/placement-dispatch-store.worker.ts
function startWorkerPlacementDispatchInWorker(input, database) {
	const identity = normalizeIdentity(input.placement);
	const executionMode = normalizeWorkerPlacementExecutionMode(input.placement.executionMode);
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const current = ensureLocal(db, identity, input.nowMs);
		assertSessionWorkspaceUnreserved(db, identity.sessionId);
		if (current.state !== "local" && current.state !== "reclaimed" && current.state !== "failed") throw new Error(`Cannot dispatch session ${identity.sessionId} from placement ${current.state}`);
		const expected = input.placement.expectedPlacement;
		if (expected) {
			if (!matchesWorkerPlacementTarget(current, expected) || current.executionMode !== executionMode || current.state !== "reclaimed" && current.state !== "failed" || current.turnClaim) throw new Error(`Worker placement ${identity.sessionId} changed before redispatch`);
			const journal = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("worker_workspace_reconciliations").select("session_id").where("session_id", "=", identity.sessionId)).rows[0];
			if (hasWorkerWorkspacePendingResult(db, identity.sessionId) || journal || readWorkerPlacementMovesReadOnly(db, [identity.sessionId]).has(identity.sessionId)) throw new Error(`Worker placement ${identity.sessionId} still has pending workspace recovery`);
			if (current.state === "failed") {
				const environment = current.environmentId ? findWorkerEnvironment(db, current.environmentId) : void 0;
				if (current.activeOwnerEpoch === null || !environment || !isFailedWorkerPlacementEnvironmentGone({
					environmentService: { get: () => environment },
					placement: current
				})) throw new Error(`Failed worker placement ${identity.sessionId} still requires recovery`);
			}
		}
		if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
			state: "requested",
			execution_mode: executionMode,
			environment_id: null,
			transition_generation: nextGeneration(current.generation),
			active_owner_epoch: null,
			workspace_base_manifest_ref: null,
			remote_workspace_dir: null,
			worker_bundle_hash: null,
			last_transcript_ack_cursor: null,
			last_live_event_ack_cursor: null,
			recovery_error: null,
			terminal_reason: null,
			terminal_at_ms: null,
			updated_at_ms: input.nowMs,
			state_changed_at_ms: input.nowMs
		}).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Session ${identity.sessionId} placement changed during dispatch barrier`);
		const updated = getRequired(db, identity.sessionId);
		deferSqliteWorkerCommitReceipt(db, updated);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: updated.turnClaim
		});
		return updated;
	}, { database }, { operationLabel: "workerPlacements.startDispatch" });
}
const workerPlacementOperations = { "workerPlacements.startDispatch": (input, { open }) => startWorkerPlacementDispatchInWorker(input, open()) };
//#endregion
export { workerPlacementOperations };
