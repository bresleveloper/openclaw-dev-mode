import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as requestSessionEntryCurrentAdmission } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { _ as resolvePlacementTurnEnvironment, g as required, m as projectWorkerSessionTurnClaim, n as advanceCursor, o as nextGeneration, p as projectPlacementTurnClaim, s as normalizeEpoch } from "./placement-record-CBaaHws5.mjs";
import { D as publishPlacementWorkspaceResultState, L as isCurrentWorkerWorkspacePendingResultOwner, a as query, d as turnClaimValues, f as updateTransition, i as getRequired, n as find, p as canTransitionWorkerSessionPlacement, r as fromRow, u as transitionValues, w as publishPlacementTurnClaimState } from "./placement-row-codec-DhdW6tSs.mjs";
import { t as clearWorkerTurnToolState } from "./placement-session-tool-operations.kernel-DQfH5nhF.mjs";
import { a as hasCurrentWorkspaceResultClaim, c as listPendingWorkerWorkspaceResultsInDatabase, d as recordStagedWorkerWorkspaceResult, n as createPlacementWorkspaceResultOps, o as hasWorkerWorkspacePendingResult, s as insertWorkerWorkspacePendingResult } from "./placement-workspace-result--lykq2r1.mjs";
import { r as createPlacementTurnClaimOps } from "./placement-turn-claims-DLDd9nfQ.mjs";
import { i as drainWorkerSessionPlacement, n as readWorkerPlacementMovesReadOnly, t as createPlacementMoveOps } from "./placement-move-intent-r4UJEgky.mjs";
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
			const pendingQuery = getNodeSqliteKysely(db);
			const pendingOwner = {
				session_id: sessionId,
				environment_id: pending.environmentId,
				owner_epoch: pending.ownerEpoch,
				placement_generation: pending.placementGeneration,
				claim_id: pending.claimId,
				run_id: pending.runId
			};
			if (!executeSqliteQuerySync(db, pendingQuery.selectFrom("worker_workspace_pending_results").select("session_id").where((eb) => eb.and(pendingOwner))).rows[0]) throw new Error(`Session ${sessionId} workspace result changed before failure`);
			const terminalAtMs = now();
			const draining = current.state === "active" ? fromRow({
				...transitionValues(current, "draining", {}, terminalAtMs),
				...turnClaimValues(persisted)
			}) : current;
			if (draining.state !== "draining") throw new Error(`Session ${sessionId} workspace result did not reach draining`);
			if (persisted) clearWorkerTurnToolState(db, {
				sessionId,
				claimId: persisted.claimId
			});
			const reconciling = fromRow(transitionValues(draining, "reconciling", {}, terminalAtMs));
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set(transitionValues(reconciling, "failed", {
				recoveryError,
				terminalReason: recoveryError
			}, terminalAtMs)).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			if (executeSqliteQuerySync(db, pendingQuery.deleteFrom("worker_workspace_pending_results").where((eb) => eb.and(pendingOwner))).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during failure`);
			const record = getRequired(db, sessionId);
			publishPlacementWorkspaceResultState(db, sessionId, null);
			publishPlacementTurnClaimState(db, record, current.state);
			return {
				placement: record,
				closedClaim: projectPlacementTurnClaim(current)
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
				const placement = updateTransition(db, current, input.to, input.patch ?? {}, now(), (environmentId, lastActivatedAtMs) => {
					environmentActivation = {
						environmentId,
						lastActivatedAtMs
					};
				});
				if (current.state === "reconciling" && input.to === "reclaimed") {
					const move = readWorkerPlacementMovesReadOnly(db, [sessionId]).get(sessionId);
					if (move && move.source.generation + 2 === current.generation && move.source.environmentId === current.environmentId && move.source.ownerEpoch === current.activeOwnerEpoch) createPlacementMoveOps({
						...runtime,
						read: () => db,
						write: (run) => run(db)
					}).cancelPlacementMove(move);
				}
				return {
					placement,
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
				if (claim) clearWorkerTurnToolState(db, {
					sessionId,
					claimId: claim.claimId
				});
				const values = transitionValues(current, "reconciling", {}, now());
				const update = query(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", "draining").where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch);
				const guardedUpdate = claim ? update.where((eb) => eb.and(turnClaimValues(claim))) : update.where("turn_claim_owner", "is", null);
				if (executeSqliteQuerySync(db, guardedUpdate).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during reconcile`);
				return {
					placement: getRequired(db, sessionId),
					closedClaim: projectPlacementTurnClaim(current)
				};
			});
		},
		fail(input) {
			const sessionId = required(input.sessionId, "session id");
			const recoveryError = boundedWorkerError(input.recoveryError);
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration) throw new Error(`Worker session placement ${sessionId} changed before failure`);
				const alreadyFailed = current.state === "failed";
				if (!alreadyFailed && !canTransitionWorkerSessionPlacement(current.state, "failed")) throw new Error(`Cannot fail worker session placement from ${current.state}`);
				const localClaim = current.turnClaim?.owner === "local" ? current.turnClaim : null;
				const updatedAtMs = now();
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
					recovery_error: recoveryError,
					updated_at_ms: updatedAtMs,
					...alreadyFailed ? {} : {
						state: "failed",
						transition_generation: nextGeneration(current.generation),
						terminal_reason: recoveryError,
						terminal_at_ms: updatedAtMs,
						...turnClaimValues(localClaim),
						state_changed_at_ms: updatedAtMs
					}
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during failure${alreadyFailed ? " update" : ""}`);
				return {
					placement: getRequired(db, sessionId),
					...alreadyFailed ? {} : { closedClaim: projectWorkerSessionTurnClaim(current) }
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
			const simpleTurn = type === "placementTurns.claim" || type === "placementTurns.release" || type === "placementTurns.releaseIfOwned";
			admit("transaction", {
				placement: simpleTurn ? void 0 : find(db, sessionId),
				placementMove: move()
			});
			const receipt = execute({
				path: database.path,
				instanceId: input.gatewayInstanceId ?? "",
				now: () => input.nowMs ?? Date.now(),
				read: () => db,
				write: (write) => write(db)
			}, input);
			if (!(simpleTurn && receipt.placement?.state === "local")) receipt.workspaceResult = listPendingWorkerWorkspaceResultsInDatabase(db, sessionId)[0] ?? null;
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
	"placementTurns.markResultPending": operation("placementTurns.markResultPending", (runtime, input) => ({ placement: createPlacementWorkspaceResultOps(runtime).markWorkspaceResultPending(input.claim) })),
	"placementTurns.acceptResult": operation("placementTurns.acceptResult", (runtime, input) => ({ placement: createPlacementWorkspaceResultOps(runtime).acceptWorkspaceResult(input.claim) }), true),
	"placementTurns.handoffResult": operation("placementTurns.handoffResult", (runtime, input) => ({ placement: createPlacementWorkspaceResultOps(runtime).handoffWorkspaceResultRecovery(input.claim) })),
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
		return createPlacementTurnClaimOps(runtime).claimTurn(input.claim);
	}),
	"placementTurns.updateWorkspaceBaseManifest": operation("placementTurns.updateWorkspaceBaseManifest", (runtime, input) => ({ placement: createPlacementTurnClaimOps(runtime).updateWorkspaceBaseManifest(input) }), true),
	"placementTurns.recordStagedResult": operation("placementTurns.recordStagedResult", (runtime, input) => ({ placement: recordStagedWorkerWorkspaceResult(runtime.read(), input.claim, input.stagedResultRef, input.repositoryWorkspaceId) }), true),
	"placementTurns.recoverWorkspace": operation("placementTurns.recoverWorkspace", (runtime, input) => {
		const results = createPlacementWorkspaceResultOps(runtime);
		results.markWorkspaceResultPending(input.claim);
		return { placement: results.handoffWorkspaceResultRecovery(input.claim) };
	}),
	"placementTurns.handoffRuntimeRefreshResult": operation("placementTurns.handoffRuntimeRefreshResult", (runtime, input) => {
		const placement = getRequired(runtime.read(), input.claim.sessionId);
		if (placement.state !== "active" || placement.generation !== input.expectedGeneration || input.claim.owner.kind !== "worker") throw new Error("Worker runtime refresh lost its workspace result owner");
		createPlacementWorkspaceResultOps(runtime).handoffWorkspaceResultRecovery(input.claim);
		return { placement };
	}),
	"placementTurns.releaseIfOwned": operation("placementTurns.releaseIfOwned", (runtime, input) => {
		return { placement: createPlacementTurnClaimOps(runtime).releaseTurnIfOwned(input.claim) };
	}),
	"placementTurns.release": operation("placementTurns.release", (runtime, input) => ({ placement: createPlacementTurnClaimOps(runtime).releaseTurn(input.claim) }))
};
//#endregion
export { placementTurnClaimOperations };
