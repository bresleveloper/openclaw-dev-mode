import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { c as normalizeIdentity, g as resolvePlacementTurnEnvironment, h as required, i as isCurrentPlacementTurnClaim, s as normalizeEpoch } from "./placement-record-BfcBeilz.mjs";
import { a as query, i as getRequired, m as publishPlacementTurnClaimState, n as find, p as publishPlacementTurnClaimCleared, r as fromRow, t as ensureLocal } from "./placement-row-codec-DzKFQEtn.mjs";
import { l as serializeWorkerWorkspaceReconciliationPlan, s as parseWorkerWorkspaceReconciliationPlan } from "./workspace-manifest-q-txD9ZU.mjs";
import "./workspace-reconcile-DEtkg-5s.mjs";
import { a as hasCurrentWorkspaceResultClaim, i as hasAcceptedWorkerWorkspacePendingResult, o as hasWorkerWorkspacePendingResult, s as insertWorkerWorkspacePendingResult, t as clearWorkerWorkspacePendingResult } from "./placement-workspace-result-Dw6JZ899.mjs";
import { c as deferTurnClaimRelease, g as removeTurnClaimReleaseWaiter, l as deferWorkerTurnClaimClosed, v as waitersFor } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { n as clearWorkerTurnToolState, t as assertNoRunningWorkerSessionToolOperations } from "./placement-session-tool-operations.kernel-DIiqMMa9.mjs";
import { r as assertSessionWorkspaceUnreserved } from "./placement-workspace-reservation.kernel-DAyC6kqY.mjs";
//#region src/gateway/worker-environments/placement-turn-claims.ts
const workspaceJournalQuery = (db) => getNodeSqliteKysely(db);
var ActiveTurnClaimError = class extends Error {
	constructor(sessionId) {
		super(`Session ${sessionId} already has an active turn claim`);
		this.name = "ActiveTurnClaimError";
	}
};
function releaseTurnQuery(db, nowMs) {
	return query(db).updateTable("worker_session_placements").set({
		turn_claim_owner: null,
		turn_claim_id: null,
		turn_claim_run_id: null,
		turn_claim_generation: null,
		turn_claim_owner_epoch: null,
		updated_at_ms: nowMs
	});
}
function createPlacementTurnClaimOps(runtime) {
	const { instanceId, path, now, read, write } = runtime;
	const publishTurnRelease = (db, current, claim, statement, error) => {
		const row = executeSqliteQuerySync(db, statement.returningAll()).rows[0];
		if (!row) throw new Error(error);
		sessionChanges.emit({
			agentId: current.agentId,
			sessionKey: current.sessionKey
		}, db);
		const updated = fromRow(row);
		publishPlacementTurnClaimState(db, updated);
		deferWorkerTurnClaimClosed(db, path, claim);
		return updated;
	};
	const claimTurnInDatabase = (db, input, updatedAtMs, options = {}) => {
		const identity = normalizeIdentity(input);
		assertSessionWorkspaceUnreserved(db, identity.sessionId);
		const claimId = required(input.claimId, "turn claim id");
		const runId = required(input.runId, "turn claim run id");
		const owner = input.owner.kind === "local" ? {
			kind: "local",
			...input.owner.environmentId === void 0 ? {} : {
				environmentId: required(input.owner.environmentId, "turn owner environment id"),
				ownerEpoch: normalizeEpoch(input.owner.ownerEpoch ?? 0, "turn owner epoch")
			}
		} : {
			kind: "worker",
			environmentId: required(input.owner.environmentId, "turn owner environment id"),
			ownerEpoch: normalizeEpoch(input.owner.ownerEpoch, "turn owner epoch")
		};
		const current = ensureLocal(db, identity, updatedAtMs);
		if (current.turnClaim) throw new ActiveTurnClaimError(identity.sessionId);
		if (owner.kind === "local") {
			const localPlacement = current.state === "local" && owner.environmentId === void 0;
			const remotePlacement = current.executionMode === "remote-exec" && (current.state === "active" || options.allowDraining && current.state === "draining") && owner.environmentId === current.environmentId && owner.ownerEpoch === current.activeOwnerEpoch;
			if (!localPlacement && !remotePlacement) throw new Error(`Local turn rejected for session ${identity.sessionId} in placement ${current.state}`);
		} else if (current.executionMode !== "worker-turn" || current.state !== "active" && !(options.allowDraining && current.state === "draining") || current.environmentId !== owner.environmentId || current.activeOwnerEpoch !== owner.ownerEpoch) throw new Error(`Worker turn rejected for session ${identity.sessionId}: stale owner`);
		if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
			turn_claim_owner: owner.kind,
			turn_claim_id: claimId,
			turn_claim_run_id: runId,
			turn_claim_generation: current.generation,
			turn_claim_owner_epoch: owner.kind === "worker" ? owner.ownerEpoch : null,
			updated_at_ms: updatedAtMs
		}).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${identity.sessionId} placement changed during turn admission`);
		publishPlacementTurnClaimState(db, getRequired(db, identity.sessionId));
		sessionChanges.emit({
			agentId: current.agentId,
			sessionKey: current.sessionKey
		}, db);
		return {
			sessionId: current.sessionId,
			claimId,
			runId,
			placementGeneration: current.generation,
			owner
		};
	};
	const claimWorkspaceResult = (input, purpose) => write((db) => {
		if (purpose === "mutation" && getRequired(db, input.sessionId).state !== "active") throw new Error(`Session ${input.sessionId} workspace mutation requires an active placement`);
		const updatedAtMs = now();
		const claim = claimTurnInDatabase(db, input, updatedAtMs, { allowDraining: purpose === "reclaim" });
		insertWorkerWorkspacePendingResult(db, claim, updatedAtMs, instanceId);
		return claim;
	});
	return {
		claimTurn(input) {
			return write((db) => claimTurnInDatabase(db, input, now()));
		},
		claimReclaimWorkspaceResult(input) {
			if (input.claimId !== input.runId || !input.claimId.startsWith("reclaim-")) throw new Error(`Session ${input.sessionId} workspace result is not owned by reclaim`);
			return claimWorkspaceResult(input, "reclaim");
		},
		claimWorkspaceMutationResult(input) {
			return claimWorkspaceResult({
				...input,
				runId: input.claimId
			}, "mutation");
		},
		releaseTurn(claim) {
			const sessionId = required(claim.sessionId, "session id");
			const claimId = required(claim.claimId, "turn claim id");
			const runId = required(claim.runId, "turn claim run id");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Session ${sessionId} has a pending cloud workspace result`);
				if (!isCurrentPlacementTurnClaim(current, claim)) throw new Error(`Session ${sessionId} turn claim changed before release`);
				assertNoRunningWorkerSessionToolOperations(db, {
					sessionId,
					claimId
				});
				clearWorkerTurnToolState(db, {
					sessionId,
					claimId
				});
				return publishTurnRelease(db, current, claim, releaseTurnQuery(db, now()).where("session_id", "=", sessionId).where("turn_claim_id", "=", claimId).where("turn_claim_run_id", "=", runId).where("turn_claim_generation", "=", claim.placementGeneration), `Session ${sessionId} turn claim changed during release`);
			});
		},
		completeWorkspaceResultAndReleaseTurn(claim) {
			const sessionId = required(claim.sessionId, "session id");
			const claimId = required(claim.claimId, "turn claim id");
			const runId = required(claim.runId, "turn claim run id");
			return write((db) => {
				if (!hasWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Session ${sessionId} has no pending cloud workspace result`);
				if (!hasAcceptedWorkerWorkspacePendingResult(db, sessionId)) throw new Error(`Session ${sessionId} cloud workspace result was not accepted`);
				const current = getRequired(db, sessionId);
				if (!resolvePlacementTurnEnvironment(current, claim) && !hasCurrentWorkspaceResultClaim(db, claim)) throw new Error(`Session ${sessionId} workspace result owner changed before release`);
				assertNoRunningWorkerSessionToolOperations(db, {
					sessionId,
					claimId
				});
				clearWorkerTurnToolState(db, {
					sessionId,
					claimId
				});
				const statement = releaseTurnQuery(db, now());
				clearWorkerWorkspacePendingResult(db, sessionId);
				return publishTurnRelease(db, current, claim, statement.where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_id", current.turnClaim ? "=" : "is", current.turnClaim && claimId).where("turn_claim_run_id", current.turnClaim ? "=" : "is", current.turnClaim && runId), `Session ${sessionId} workspace result changed during release`);
			});
		},
		cancelWorkspaceResultAndReleaseTurn(claim, options) {
			const sessionId = required(claim.sessionId, "session id");
			const claimId = required(claim.claimId, "turn claim id");
			const runId = required(claim.runId, "turn claim run id");
			const nodeDisconnect = options?.reason === "node-disconnect";
			if (!nodeDisconnect && (claimId !== runId || !claimId.startsWith("reclaim-"))) throw new Error(`Session ${sessionId} workspace result is not owned by reclaim`);
			return write((db) => {
				const current = getRequired(db, sessionId);
				const environment = resolvePlacementTurnEnvironment(current, claim);
				const pending = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "=", sessionId)).rows[0];
				if (!environment || !pending || pending.environment_id !== environment.environmentId || pending.owner_epoch !== environment.ownerEpoch || pending.placement_generation !== claim.placementGeneration || pending.claim_id !== claimId || pending.run_id !== runId || pending.workspace_accepted_at_ms !== null || nodeDisconnect && (current.state !== "active" || current.executionMode !== "remote-exec" || claim.owner.kind !== "local" || pending.gateway_instance_id !== instanceId || pending.recovery_requested_at_ms !== null || pending.staged_result_ref !== null || executeSqliteQuerySync(db, workspaceJournalQuery(db).selectFrom("worker_workspace_reconciliations").select("session_id").where("session_id", "=", sessionId)).rows.length > 0)) throw new Error(`Session ${sessionId} workspace result owner changed before cancellation`);
				assertNoRunningWorkerSessionToolOperations(db, {
					sessionId,
					claimId
				});
				clearWorkerTurnToolState(db, {
					sessionId,
					claimId
				});
				clearWorkerWorkspacePendingResult(db, sessionId);
				return publishTurnRelease(db, current, claim, releaseTurnQuery(db, now()).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_id", "=", claimId).where("turn_claim_run_id", "=", runId), `Session ${sessionId} workspace result changed during cancellation`);
			});
		},
		clearLocalTurnClaimsAfterRestart() {
			return write((db) => {
				const sessionIds = executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").select("session_id").where("turn_claim_owner", "=", "local")).rows.map((row) => row.session_id);
				if (executeSqliteQuerySync(db, releaseTurnQuery(db, now()).where("turn_claim_owner", "=", "local")).numAffectedRows !== BigInt(sessionIds.length)) throw new Error("Local turn claims changed during restart recovery");
				for (const sessionId of sessionIds) {
					publishPlacementTurnClaimCleared(db, sessionId);
					deferTurnClaimRelease(db, path, sessionId);
				}
				return sessionIds.length;
			});
		},
		async waitForTurnClaimRelease(sessionIdInput, waitOptions) {
			const sessionId = required(sessionIdInput, "session id");
			if (waitOptions.timeoutMs !== void 0 && (!Number.isSafeInteger(waitOptions.timeoutMs) || waitOptions.timeoutMs < 0)) throw new Error("Worker session turn claim wait timeout must be a non-negative integer");
			if (!find(read(), sessionId)?.turnClaim) return;
			if (waitOptions.signal?.aborted) throw new Error(`Turn claim wait aborted for session ${sessionId}`);
			await new Promise((resolve, reject) => {
				let settled = false;
				const waiters = waitersFor(path, sessionId);
				const finish = (error) => {
					if (settled) return;
					settled = true;
					if (timer) clearTimeout(timer);
					waitOptions.signal?.removeEventListener("abort", onAbort);
					removeTurnClaimReleaseWaiter(path, sessionId, onRelease);
					if (error) reject(error);
					else resolve();
				};
				const onRelease = (error) => finish(error);
				const onAbort = () => finish(/* @__PURE__ */ new Error(`Turn claim wait aborted for session ${sessionId}`));
				const timer = waitOptions.timeoutMs === void 0 ? void 0 : setTimeout(() => finish(/* @__PURE__ */ new Error(`Timed out waiting for session ${sessionId} turn claim release`)), waitOptions.timeoutMs);
				waiters.add(onRelease);
				waitOptions.signal?.addEventListener("abort", onAbort, { once: true });
				if (!find(read(), sessionId)?.turnClaim) finish();
				else if (waitOptions.signal?.aborted) onAbort();
			});
		},
		validateTurnClaim(claim) {
			const current = find(read(), required(claim.sessionId, "session id"));
			return current ? isCurrentPlacementTurnClaim(current, claim) : false;
		},
		updateWorkspaceBaseManifest(input) {
			const sessionId = required(input.claim.sessionId, "session id");
			const claimId = required(input.claim.claimId, "turn claim id");
			const runId = required(input.claim.runId, "turn claim run id");
			const manifestRef = required(input.manifestRef, "workspace base manifest ref");
			if (!/^sha256:[a-f0-9]{64}$/u.test(manifestRef)) throw new Error("Worker workspace base manifest reference is invalid");
			const placementGeneration = input.claim.placementGeneration;
			return write((db) => {
				const current = getRequired(db, sessionId);
				const environment = resolvePlacementTurnEnvironment(current, input.claim);
				if (!environment && !hasCurrentWorkspaceResultClaim(db, input.claim)) throw new Error(`Cannot advance stale worker workspace for session ${sessionId}`);
				const environmentId = environment?.environmentId ?? current.environmentId;
				const ownerEpoch = environment?.ownerEpoch ?? current.activeOwnerEpoch;
				const reconciliation = executeSqliteQuerySync(db, workspaceJournalQuery(db).selectFrom("worker_workspace_reconciliations").selectAll().where("session_id", "=", sessionId)).rows[0];
				const reconciliationPlan = reconciliation ? parseWorkerWorkspaceReconciliationPlan(reconciliation.plan_json) : void 0;
				if (reconciliation && reconciliation.base_manifest_ref !== current.workspaceBaseManifestRef && reconciliationPlan?.appliedManifestRef !== current.workspaceBaseManifestRef) throw new Error(`Worker workspace journal owner is stale for session ${sessionId}`);
				if (executeSqliteQuerySync(db, query(db).updateTable("worker_session_placements").set({
					workspace_base_manifest_ref: manifestRef,
					updated_at_ms: now()
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch).where("turn_claim_owner", current.turnClaim ? "=" : "is", current.turnClaim?.owner ?? null).where("turn_claim_id", current.turnClaim ? "=" : "is", current.turnClaim ? claimId : null).where("turn_claim_run_id", current.turnClaim ? "=" : "is", current.turnClaim ? runId : null).where("turn_claim_generation", current.turnClaim ? "=" : "is", current.turnClaim ? placementGeneration : null).where("turn_claim_owner_epoch", current.turnClaim?.owner === "worker" ? "=" : "is", current.turnClaim?.ownerEpoch ?? null)).numAffectedRows !== 1n) throw new Error(`Worker session workspace ${sessionId} changed during reconciliation`);
				if (reconciliation) {
					const markedPlan = serializeWorkerWorkspaceReconciliationPlan({
						...reconciliationPlan,
						appliedManifestRef: manifestRef,
						basePack: reconciliation.base_pack
					});
					if (executeSqliteQuerySync(db, workspaceJournalQuery(db).updateTable("worker_workspace_reconciliations").set({ plan_json: markedPlan }).where("session_id", "=", sessionId).where("base_manifest_ref", "=", reconciliation.base_manifest_ref)).numAffectedRows !== 1n) throw new Error(`Worker workspace journal changed for session ${sessionId}`);
				}
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				}, db);
				return getRequired(db, sessionId);
			});
		}
	};
}
//#endregion
export { createPlacementTurnClaimOps as n, ActiveTurnClaimError as t };
