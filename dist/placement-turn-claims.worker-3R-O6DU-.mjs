import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as requestSessionEntryCurrentAdmission } from "./session-entry-current-admission.worker-DStXV6pd.mjs";
import { f as placementTurnOwner, g as resolvePlacementTurnEnvironment, h as required, n as advanceCursor, o as nextGeneration, p as projectWorkerSessionTurnClaim, s as normalizeEpoch } from "./placement-record-BfcBeilz.mjs";
import { S as isCurrentWorkerWorkspacePendingResultOwner, a as query, c as canTransitionWorkerSessionPlacement, i as getRequired, n as find, o as transitionValues, s as updateTransition } from "./placement-row-codec-DzKFQEtn.mjs";
import { a as hasCurrentWorkspaceResultClaim, c as listPendingWorkerWorkspaceResultsInDatabase, n as createPlacementWorkspaceResultOps, o as hasWorkerWorkspacePendingResult, s as insertWorkerWorkspacePendingResult, u as recordStagedWorkerWorkspaceResult } from "./placement-workspace-result-Dw6JZ899.mjs";
import { n as readWorkerPlacementMovesReadOnly, r as drainWorkerSessionPlacement } from "./placement-move-intent-DuwDH85-.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { n as clearWorkerTurnToolState, t as assertNoRunningWorkerSessionToolOperations } from "./placement-session-tool-operations.kernel-DIiqMMa9.mjs";
import { n as createPlacementTurnClaimOps } from "./placement-turn-claims-DXE2X7tY.mjs";
//#region src/gateway/worker-environments/placement-pending-failure.ts
function createPlacementPendingFailureOps(runtime) {
	const { now, write } = runtime;
	return { failWorkspaceResultAndReleaseTurn(pending, error) {
		const sessionId = required(pending.sessionId, "session id");
		const recoveryError = boundedWorkerError(error);
		return write((db) => {
			const current = getRequired(db, sessionId);
			if (!isCurrentWorkerWorkspacePendingResultOwner(current, pending)) throw new Error(`Session ${sessionId} workspace result owner changed before failure`);
			const persisted = current.turnClaim;
			const releasedClaim = persisted ? {
				sessionId,
				claimId: persisted.claimId,
				runId: persisted.runId,
				placementGeneration: persisted.generation,
				owner: placementTurnOwner(current)
			} : null;
			const pendingQuery = getNodeSqliteKysely(db);
			if (!executeSqliteQuerySync(db, pendingQuery.selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).rows[0]) throw new Error(`Session ${sessionId} workspace result changed before failure`);
			const terminalAtMs = now();
			let transitioning = current;
			if (transitioning.state === "active") {
				const values = transitionValues(transitioning, "draining", {}, terminalAtMs);
				if (persisted) {
					values.turn_claim_owner = persisted.owner;
					values.turn_claim_id = persisted.claimId;
					values.turn_claim_run_id = persisted.runId;
					values.turn_claim_generation = persisted.generation;
					values.turn_claim_owner_epoch = persisted.ownerEpoch;
				}
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "active").where("transition_generation", "=", transitioning.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during drain`);
				transitioning = getRequired(db, sessionId);
			}
			if (transitioning.state !== "draining") throw new Error(`Session ${sessionId} workspace result did not reach draining`);
			if (persisted) {
				assertNoRunningWorkerSessionToolOperations(db, {
					sessionId,
					claimId: persisted.claimId
				});
				clearWorkerTurnToolState(db, {
					sessionId,
					claimId: persisted.claimId
				});
			}
			const reconcilingValues = transitionValues(transitioning, "reconciling", {}, terminalAtMs);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(reconcilingValues).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", transitioning.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during reconcile`);
			transitioning = getRequired(db, sessionId);
			const failedValues = transitionValues(transitioning, "failed", {
				recoveryError,
				terminalReason: recoveryError
			}, terminalAtMs);
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(failedValues).where("session_id", "=", sessionId).where("state", "=", "reconciling").where("transition_generation", "=", transitioning.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			if (executeSqliteQuerySync(db, pendingQuery.deleteFrom("worker_workspace_pending_results").where("session_id", "=", sessionId).where("environment_id", "=", pending.environmentId).where("owner_epoch", "=", pending.ownerEpoch).where("placement_generation", "=", pending.placementGeneration).where("claim_id", "=", pending.claimId).where("run_id", "=", pending.runId)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			return {
				placement: getRequired(db, sessionId),
				closedClaim: releasedClaim ?? void 0
			};
		});
	} };
}
//#endregion
//#region src/gateway/worker-environments/placement-transitions.worker.ts
function createPlacementTransitionOps(runtime) {
	const { now, write } = runtime;
	return {
		transition(input) {
			if (!canTransitionWorkerSessionPlacement(input.from, input.to)) throw new Error(`Illegal worker session placement transition: ${input.from} -> ${input.to}`);
			if (input.from === "draining" && input.to === "reconciling") throw new Error("Use startReconcile after fencing the drained worker environment");
			if (input.to === "failed") throw new Error("Use fail to record terminal worker placement diagnostics");
			const sessionId = required(input.sessionId, "session id");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== input.from || current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed: expected ${input.from}@${input.expectedGeneration}, found ${current.state}@${current.generation}`);
				if (current.turnClaim) throw new Error(`Cannot transition session ${sessionId} during an active turn`);
				let environmentActivation;
				return {
					placement: updateTransition(db, current, input.to, input.patch ?? {}, now(), (environmentId, lastActivatedAtMs) => {
						environmentActivation = {
							environmentId,
							lastActivatedAtMs
						};
					}),
					environmentActivation
				};
			});
		},
		startDrain(input) {
			return write((db) => ({ placement: drainWorkerSessionPlacement(db, input, now()) }));
		},
		startReconcile(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== "draining" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch) throw new Error(`Cannot reconcile stale worker placement for session ${sessionId}`);
				if (hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Cannot reconcile session ${sessionId} with a pending cloud workspace result`);
				const claim = current.turnClaim;
				if (claim?.owner === "local" && input.forceLocalClaim !== true) throw new Error(`Cannot reconcile session ${sessionId} while its local turn is active`);
				if (claim) {
					assertNoRunningWorkerSessionToolOperations(db, {
						sessionId,
						claimId: claim.claimId
					});
					clearWorkerTurnToolState(db, {
						sessionId,
						claimId: claim.claimId
					});
				}
				const values = transitionValues(current, "reconciling", {}, now());
				const update = query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch);
				const guardedUpdate = claim ? update.where("turn_claim_owner", "=", claim.owner).where("turn_claim_id", "=", claim.claimId).where("turn_claim_run_id", "=", claim.runId).where("turn_claim_generation", "=", claim.generation).where("turn_claim_owner_epoch", claim.owner === "worker" ? "=" : "is", claim.ownerEpoch) : update.where("turn_claim_owner", "is", null);
				if (executeSqliteQuerySync(db, guardedUpdate).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during reconcile`);
				return {
					placement: getRequired(db, sessionId),
					closedClaim: claim ? {
						sessionId,
						claimId: claim.claimId,
						runId: claim.runId,
						placementGeneration: claim.generation,
						owner: placementTurnOwner(current)
					} : void 0
				};
			});
		},
		fail(input) {
			const sessionId = required(input.sessionId, "session id");
			const recoveryError = boundedWorkerError(input.recoveryError);
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed before failure`);
				if (current.state === "failed") {
					if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
						recovery_error: recoveryError,
						updated_at_ms: now()
					}).where("session_id", "=", sessionId).where("state", "=", "failed").where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure update`);
					return { placement: getRequired(db, sessionId) };
				}
				if (!canTransitionWorkerSessionPlacement(current.state, "failed")) throw new Error(`Cannot fail worker session placement from ${current.state}`);
				const localClaim = current.turnClaim?.owner === "local" ? current.turnClaim : null;
				const updatedAtMs = now();
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
					state: "failed",
					transition_generation: nextGeneration(current.generation),
					recovery_error: recoveryError,
					terminal_reason: recoveryError,
					terminal_at_ms: updatedAtMs,
					turn_claim_owner: localClaim ? "local" : null,
					turn_claim_id: localClaim?.claimId ?? null,
					turn_claim_run_id: localClaim?.runId ?? null,
					turn_claim_generation: localClaim?.generation ?? null,
					turn_claim_owner_epoch: null,
					updated_at_ms: updatedAtMs,
					state_changed_at_ms: updatedAtMs
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure`);
				return {
					placement: getRequired(db, sessionId),
					closedClaim: projectWorkerSessionTurnClaim(current)
				};
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-claims.worker.ts
function operation(type, execute, guardedWorkspaceWrite = false) {
	return (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => {
			const sessionId = "claim" in input ? input.claim.sessionId : "pending" in input ? input.pending.sessionId : input.sessionId;
			const move = () => type === "placementTurns.updateWorkspaceBaseManifest" || type === "placementTurns.completeResult" ? readWorkerPlacementMovesReadOnly(db, [sessionId]).get(sessionId) ?? null : void 0;
			const source = guardedWorkspaceWrite ? input.sessionEntryCurrentSource : void 0;
			const admit = (stage, facts) => requestSessionEntryCurrentAdmission(source, {
				stage,
				facts
			}, { lookup: "logical" });
			admit("transaction", guardedWorkspaceWrite ? {
				placement: find(db, sessionId),
				placementMove: move()
			} : void 0);
			const receipt = execute({
				path: database.path,
				instanceId: input.gatewayInstanceId ?? "",
				now: () => input.nowMs ?? Date.now(),
				read: () => db,
				write: (write) => write(db)
			}, input);
			receipt.workspaceResult = listPendingWorkerWorkspaceResultsInDatabase(db, sessionId)[0] ?? null;
			receipt.placementMove = move();
			admit("commit", receipt);
			deferSqliteWorkerCommitReceipt(db, receipt);
			return receipt;
		}, { database }, { operationLabel: type });
	};
}
const placementTurnClaimOperations = {
	"placementTurns.transition": operation("placementTurns.transition", (runtime, input) => createPlacementTransitionOps(runtime).transition(input)),
	"placementTurns.startDrain": operation("placementTurns.startDrain", (runtime, input) => createPlacementTransitionOps(runtime).startDrain(input)),
	"placementTurns.startReconcile": operation("placementTurns.startReconcile", (runtime, input) => createPlacementTransitionOps(runtime).startReconcile(input)),
	"placementTurns.fail": operation("placementTurns.fail", (runtime, input) => createPlacementTransitionOps(runtime).fail(input)),
	"placementTurns.failResult": operation("placementTurns.failResult", (runtime, input) => createPlacementPendingFailureOps(runtime).failWorkspaceResultAndReleaseTurn(input.pending, input.recoveryError)),
	"placementTurns.claimReclaimResult": operation("placementTurns.claimReclaimResult", (runtime, input) => {
		const claim = createPlacementTurnClaimOps(runtime).claimReclaimWorkspaceResult(input.claim);
		return {
			claim,
			placement: getRequired(runtime.read(), claim.sessionId)
		};
	}),
	"placementTurns.claimMutationResult": operation("placementTurns.claimMutationResult", (runtime, input) => {
		const claim = createPlacementTurnClaimOps(runtime).claimWorkspaceMutationResult(input.claim);
		return {
			claim,
			placement: getRequired(runtime.read(), claim.sessionId)
		};
	}, true),
	"placementTurns.markResultPending": operation("placementTurns.markResultPending", (runtime, input) => {
		createPlacementWorkspaceResultOps(runtime).markWorkspaceResultPending(input.claim);
		return { placement: getRequired(runtime.read(), input.claim.sessionId) };
	}),
	"placementTurns.acceptResult": operation("placementTurns.acceptResult", (runtime, input) => {
		createPlacementWorkspaceResultOps(runtime).acceptWorkspaceResult(input.claim);
		return { placement: getRequired(runtime.read(), input.claim.sessionId) };
	}, true),
	"placementTurns.handoffResult": operation("placementTurns.handoffResult", (runtime, input) => {
		createPlacementWorkspaceResultOps(runtime).handoffWorkspaceResultRecovery(input.claim);
		return { placement: getRequired(runtime.read(), input.claim.sessionId) };
	}),
	"placementTurns.abandonResult": operation("placementTurns.abandonResult", (runtime, input) => {
		createPlacementWorkspaceResultOps(runtime).abandonWorkspaceResult(input.pending);
		return { placement: find(runtime.read(), input.pending.sessionId) };
	}),
	"placementTurns.drainResult": operation("placementTurns.drainResult", (runtime, input) => {
		const { claim } = input;
		const db = runtime.read();
		const current = getRequired(db, required(claim.sessionId, "session id"));
		const ownsWorkspaceResult = hasCurrentWorkspaceResultClaim(db, claim);
		const owner = resolvePlacementTurnEnvironment(current, claim) ?? (ownsWorkspaceResult && current.state === "active" && current.environmentId && current.activeOwnerEpoch !== null ? {
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch
		} : void 0);
		if (current.state !== "active" || !owner || !ownsWorkspaceResult) throw new Error(`Cannot drain stale workspace result for session ${claim.sessionId}`);
		return { placement: drainWorkerSessionPlacement(db, {
			sessionId: current.sessionId,
			environmentId: owner.environmentId,
			ownerEpoch: owner.ownerEpoch,
			expectedGeneration: current.generation,
			allowPendingWorkspaceResult: true
		}, runtime.now()) };
	}),
	"placementTurns.completeResult": operation("placementTurns.completeResult", (runtime, input) => ({ placement: createPlacementTurnClaimOps(runtime).completeWorkspaceResultAndReleaseTurn(input.claim) }), true),
	"placementTurns.cancelResult": operation("placementTurns.cancelResult", (runtime, input) => ({ placement: createPlacementTurnClaimOps(runtime).cancelWorkspaceResultAndReleaseTurn(input.claim, input.reason ? { reason: input.reason } : void 0) })),
	"placementTurns.updateAckCursors": operation("placementTurns.updateAckCursors", (runtime, input) => {
		const sessionId = required(input.claim.sessionId, "session id");
		const claimId = required(input.claim.claimId, "turn claim id");
		const runId = required(input.claim.runId, "turn claim run id");
		if (!Number.isSafeInteger(input.claim.placementGeneration) || input.claim.placementGeneration < 0) throw new Error("Worker session placement turn claim generation is invalid");
		if (input.claim.owner.kind !== "worker") throw new Error("Only a worker turn claim can acknowledge worker cursors");
		const placementGeneration = input.claim.placementGeneration;
		const environmentId = required(input.claim.owner.environmentId, "environment id");
		const ownerEpoch = normalizeEpoch(input.claim.owner.ownerEpoch, "active owner epoch");
		const db = runtime.read();
		const current = getRequired(db, sessionId);
		const persisted = current.turnClaim;
		if (!(current.state === "active" || current.state === "draining") || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || persisted?.owner !== "worker" || persisted.claimId !== claimId || persisted.runId !== runId || persisted.generation !== placementGeneration || persisted.ownerEpoch !== ownerEpoch) throw new Error(`Cannot ACK stale worker turn for session ${sessionId}`);
		const transcript = advanceCursor(current.lastTranscriptAckCursor, input.transcript, "transcript ACK cursor");
		const liveEvent = advanceCursor(current.lastLiveEventAckCursor, input.liveEvent, "live ACK cursor");
		if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
			last_transcript_ack_cursor: transcript,
			last_live_event_ack_cursor: liveEvent,
			updated_at_ms: runtime.now()
		}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch).where("turn_claim_owner", "=", "worker").where("turn_claim_id", "=", claimId).where("turn_claim_run_id", "=", runId).where("turn_claim_generation", "=", placementGeneration).where("turn_claim_owner_epoch", "=", ownerEpoch)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during ACK`);
		if (input.liveEvent !== void 0) insertWorkerWorkspacePendingResult(db, input.claim, runtime.now(), runtime.instanceId);
		return { placement: getRequired(db, sessionId) };
	}, true),
	"placementTurns.claim": operation("placementTurns.claim", (runtime, input) => {
		const claim = createPlacementTurnClaimOps(runtime).claimTurn(input.claim);
		return {
			claim,
			placement: getRequired(runtime.read(), claim.sessionId)
		};
	}),
	"placementTurns.updateWorkspaceBaseManifest": operation("placementTurns.updateWorkspaceBaseManifest", (runtime, input) => ({ placement: createPlacementTurnClaimOps(runtime).updateWorkspaceBaseManifest(input) }), true),
	"placementTurns.recordStagedResult": operation("placementTurns.recordStagedResult", (runtime, input) => {
		const db = runtime.read();
		recordStagedWorkerWorkspaceResult(db, input.claim, input.stagedResultRef, input.repositoryWorkspaceId);
		return { placement: getRequired(db, input.claim.sessionId) };
	}, true),
	"placementTurns.recoverWorkspace": operation("placementTurns.recoverWorkspace", (runtime, input) => {
		const results = createPlacementWorkspaceResultOps(runtime);
		results.markWorkspaceResultPending(input.claim);
		results.handoffWorkspaceResultRecovery(input.claim);
		return { placement: getRequired(runtime.read(), input.claim.sessionId) };
	}),
	"placementTurns.handoffRuntimeRefreshResult": operation("placementTurns.handoffRuntimeRefreshResult", (runtime, input) => {
		const placement = getRequired(runtime.read(), input.claim.sessionId);
		if (placement.state !== "active" || placement.generation !== input.expectedGeneration || input.claim.owner.kind !== "worker") throw new Error("Worker runtime refresh lost its workspace result owner");
		createPlacementWorkspaceResultOps(runtime).handoffWorkspaceResultRecovery(input.claim);
		return { placement };
	}),
	"placementTurns.releaseIfOwned": operation("placementTurns.releaseIfOwned", (runtime, input) => {
		const claims = createPlacementTurnClaimOps(runtime);
		return claims.validateTurnClaim(input.claim) ? { placement: claims.releaseTurn(input.claim) } : {};
	}),
	"placementTurns.release": operation("placementTurns.release", (runtime, input) => ({ placement: createPlacementTurnClaimOps(runtime).releaseTurn(input.claim) }))
};
//#endregion
export { placementTurnClaimOperations };
