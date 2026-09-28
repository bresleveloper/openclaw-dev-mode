import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { k as hasRepositoryWorkspacePendingResultSchema, w as ensureRepositoryWorkspacePendingResultSchema } from "./openclaw-state-db-BFK9cMiV.mjs";
import { _ as resolvePlacementTurnEnvironment, c as normalizeEpoch, g as required, i as isCurrentPlacementTurnClaim, l as normalizeIdentity, n as advanceCursor, p as placementTurnOwner } from "./placement-record-CB6gcJKw.mjs";
import { a as query$2, i as getRequired, n as find, r as fromRow, t as ensureLocal } from "./placement-row-codec-qMLLgrft.mjs";
import { l as serializeWorkerWorkspaceReconciliationPlan, s as parseWorkerWorkspaceReconciliationPlan } from "./workspace-manifest-453LPGpv.mjs";
import "./workspace-reconcile-BoiN2pej.mjs";
import { n as clearWorkerTurnToolState, r as createPlacementSessionToolOperationOps, t as assertNoRunningWorkerSessionToolOperations } from "./placement-session-tool-operations-Cxr8WLRd.mjs";
import { c as removeTurnClaimReleaseWaiter, d as signalWorkerTurnClaimClosed, f as waitersFor, u as signalTurnClaimRelease } from "./placement-turn-claim-events-D2oaSWT4.mjs";
import { n as assertSessionWorkspaceUnreserved } from "./placement-workspace-reservation-bdeiq4od.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/placement-workspace-journal.ts
const query$1 = (db) => getNodeSqliteKysely(db);
function isCurrentJournalOwner(db, placement, owner) {
	if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch) return false;
	if (placement.generation === owner.placementGeneration) return true;
	if (placement.state !== "draining" || placement.generation !== owner.placementGeneration + 1) return false;
	return executeSqliteQuerySync(db, query$1(db).selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", owner.sessionId).where("environment_id", "=", owner.environmentId).where("owner_epoch", "=", owner.ownerEpoch).where("placement_generation", "=", owner.placementGeneration)).rows[0] !== void 0;
}
function assertJournalOwner(db, owner, options = {}) {
	const placement = getRequired(db, owner.sessionId);
	const isCurrentOwner = isCurrentJournalOwner(db, placement, owner);
	const isAllowedFailedOwner = options.allowFailedOwner === true && placement.state === "failed" && placement.generation > owner.placementGeneration && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch;
	if (!isCurrentOwner && !isAllowedFailedOwner) throw new Error(`Cannot reconcile stale worker workspace for session ${owner.sessionId}`);
	return placement;
}
function clearWorkerWorkspaceReconciliation(db, sessionId, currentManifestRef) {
	const existing = executeSqliteQuerySync(db, query$1(db).selectFrom("worker_workspace_reconciliations").select("current_manifest_ref").where("session_id", "=", sessionId)).rows[0];
	if (existing && currentManifestRef && existing.current_manifest_ref !== currentManifestRef) throw new Error(`Worker workspace journal result changed for session ${sessionId}`);
	executeSqliteQuerySync(db, query$1(db).deleteFrom("worker_workspace_reconciliations").where("session_id", "=", sessionId));
}
function createPlacementWorkspaceJournalOps(runtime) {
	const { now, read, write } = runtime;
	return {
		getWorkspaceReconciliationPlacement(owner) {
			const db = read();
			const placement = find(db, owner.sessionId);
			return isCurrentJournalOwner(db, placement, owner) ? placement : void 0;
		},
		listWorkspaceReconciliationOwners() {
			const db = read();
			return executeSqliteQuerySync(db, query$1(db).selectFrom("worker_workspace_reconciliations").select([
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
		},
		pruneOrphanedWorkspaceReconciliations(options) {
			return write((db) => {
				const rows = executeSqliteQuerySync(db, query$1(db).selectFrom("worker_workspace_reconciliations").select([
					"session_id",
					"environment_id",
					"owner_epoch",
					"placement_generation"
				]).orderBy("session_id")).rows;
				const pruned = [];
				for (const row of rows) {
					const owner = {
						sessionId: row.session_id,
						environmentId: row.environment_id,
						ownerEpoch: row.owner_epoch,
						placementGeneration: row.placement_generation
					};
					const placement = find(db, owner.sessionId);
					const stillOwned = isCurrentJournalOwner(db, placement, owner);
					const retainedFailedOwner = placement?.state === "failed" && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch && placement.generation > owner.placementGeneration && options.retainFailedOwner(placement.recoveryError);
					if (stillOwned || retainedFailedOwner) continue;
					if (executeSqliteQuerySync(db, query$1(db).deleteFrom("worker_workspace_reconciliations").where("session_id", "=", owner.sessionId).where("environment_id", "=", owner.environmentId).where("owner_epoch", "=", owner.ownerEpoch).where("placement_generation", "=", owner.placementGeneration)).numAffectedRows === 1n) pruned.push(owner);
				}
				return pruned;
			});
		},
		loadWorkspaceReconciliation(owner, options = {}) {
			const db = read();
			const placement = assertJournalOwner(db, owner, options);
			const row = executeSqliteQuerySync(db, query$1(db).selectFrom("worker_workspace_reconciliations").selectAll().where("session_id", "=", owner.sessionId)).rows[0];
			if (!row) return;
			const plan = parseWorkerWorkspaceReconciliationPlan(row.plan_json);
			if (row.environment_id !== owner.environmentId || row.owner_epoch !== owner.ownerEpoch || row.placement_generation !== owner.placementGeneration || placement.workspaceBaseManifestRef !== row.base_manifest_ref && placement.workspaceBaseManifestRef !== plan.appliedManifestRef) throw new Error(`Worker workspace journal owner is stale for session ${owner.sessionId}`);
			if (plan.baseManifestRef !== row.base_manifest_ref || plan.currentManifestRef !== row.current_manifest_ref) throw new Error(`Worker workspace journal metadata is inconsistent for ${owner.sessionId}`);
			if (row.base_pack.byteLength > 268435456 || createHash("sha256").update(row.base_pack).digest("hex") !== plan.basePackSha256) throw new Error(`Worker workspace journal snapshot is invalid for ${owner.sessionId}`);
			return {
				...plan,
				basePack: row.base_pack
			};
		},
		beginWorkspaceReconciliation(owner, journal) {
			if (journal.appliedManifestRef) throw new Error("Worker workspace reconciliation cannot begin as already applied");
			write((db) => {
				if (assertJournalOwner(db, owner).workspaceBaseManifestRef !== journal.baseManifestRef) throw new Error(`Worker workspace base changed for session ${owner.sessionId}`);
				if (executeSqliteQuerySync(db, query$1(db).insertInto("worker_workspace_reconciliations").values({
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
			});
		},
		abortWorkspaceReconciliation(owner, options = {}) {
			write((db) => {
				if (!options.force) {
					assertJournalOwner(db, owner);
					clearWorkerWorkspaceReconciliation(db, owner.sessionId);
					return;
				}
				if (executeSqliteQuerySync(db, query$1(db).deleteFrom("worker_workspace_reconciliations").where("session_id", "=", owner.sessionId).where("environment_id", "=", owner.environmentId).where("owner_epoch", "=", owner.ownerEpoch).where("placement_generation", "=", owner.placementGeneration)).numAffectedRows !== 1n) throw new Error(`Worker workspace journal changed for ${owner.sessionId}`);
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-result.ts
const query = (db) => getNodeSqliteKysely(db);
function matchesWorkspaceResultGeneration(placement, generation) {
	return (placement.state === "active" || placement.state === "draining") && (placement.generation === generation || placement.state === "draining" && placement.generation === generation + 1);
}
function isCurrentWorkerWorkspacePendingResultOwner(placement, pending) {
	if (placement?.state !== "active" && placement?.state !== "draining" || placement.sessionId !== pending.sessionId || placement.environmentId !== pending.environmentId || placement.activeOwnerEpoch !== pending.ownerEpoch) return false;
	if (placement.turnClaim) return isCurrentPlacementTurnClaim(placement, {
		sessionId: pending.sessionId,
		claimId: pending.claimId,
		runId: pending.runId,
		placementGeneration: pending.placementGeneration,
		owner: placementTurnOwner(placement)
	});
	return matchesWorkspaceResultGeneration(placement, pending.placementGeneration);
}
function matchesWorkspaceResultClaim(placement, row, claim) {
	const recoveryOwner = placement.state === "active" || placement.state === "draining" ? placementTurnOwner(placement) : void 0;
	return row.session_id === claim.sessionId && row.environment_id === placement.environmentId && row.owner_epoch === placement.activeOwnerEpoch && row.placement_generation === claim.placementGeneration && row.claim_id === claim.claimId && row.run_id === claim.runId && (isCurrentPlacementTurnClaim(placement, claim) || matchesWorkspaceResultGeneration(placement, claim.placementGeneration) && placement.turnClaim === null && recoveryOwner?.kind === "local" && claim.owner.kind === "local" && claim.owner.environmentId === recoveryOwner.environmentId && claim.owner.ownerEpoch === recoveryOwner.ownerEpoch);
}
function hasCurrentWorkspaceResultClaim(db, claim) {
	const placement = getRequired(db, claim.sessionId);
	const row = executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "=", claim.sessionId)).rows[0];
	return Boolean(row && matchesWorkspaceResultClaim(placement, row, claim));
}
function clearWorkerWorkspacePendingResult(db, sessionId) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_workspace_pending_results").where("session_id", "=", sessionId));
}
function readWorkerWorkspaceReconciliationFacts(db, sessionIds) {
	const placements = /* @__PURE__ */ new Map();
	const pendingResults = [];
	for (let offset = 0; offset < sessionIds.length; offset += 250) {
		const chunk = sessionIds.slice(offset, offset + 250);
		for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_session_placements").selectAll().where("session_id", "in", chunk)).rows) {
			const placement = fromRow(row);
			placements.set(placement.sessionId, placement);
		}
		for (const row of executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "in", chunk)).rows) pendingResults.push(row);
	}
	return {
		placements,
		reconcilingSessionIds: new Set(pendingResults.flatMap((row) => {
			const placement = placements.get(row.session_id);
			const pending = {
				sessionId: row.session_id,
				environmentId: row.environment_id,
				ownerEpoch: row.owner_epoch,
				placementGeneration: row.placement_generation,
				claimId: row.claim_id,
				runId: row.run_id,
				gatewayInstanceId: row.gateway_instance_id,
				recoveryRequestedAtMs: row.recovery_requested_at_ms,
				workspaceAcceptedAtMs: row.workspace_accepted_at_ms,
				stagedResultRef: row.staged_result_ref
			};
			return (placement?.turnClaim?.owner === "worker" || row.staged_result_ref !== null) && isCurrentWorkerWorkspacePendingResultOwner(placement, pending) ? [row.session_id] : [];
		}))
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
function createPlacementWorkspaceResultOps(runtime) {
	const { instanceId, now, read, write } = runtime;
	const assertPendingClaim = (db, claim) => {
		const placement = getRequired(db, claim.sessionId);
		const row = executeSqliteQuerySync(db, query(db).selectFrom("worker_workspace_pending_results").selectAll().where("session_id", "=", claim.sessionId)).rows[0];
		if (!row || !matchesWorkspaceResultClaim(placement, row, claim)) throw new Error(`Cannot update stale worker workspace result for ${claim.sessionId}`);
		sessionChanges.emit({
			agentId: placement.agentId,
			sessionKey: placement.sessionKey
		}, db);
		return row;
	};
	return {
		workspaceResultInstanceId() {
			return instanceId;
		},
		validateWorkspaceResultClaim(claim) {
			return hasCurrentWorkspaceResultClaim(read(), claim);
		},
		listPendingWorkspaceResults(sessionId) {
			const db = read();
			let pendingResults = query(db).selectFrom("worker_workspace_pending_results").select([
				"session_id",
				"environment_id",
				"owner_epoch",
				"placement_generation",
				"claim_id",
				"run_id",
				"gateway_instance_id",
				"recovery_requested_at_ms",
				"workspace_accepted_at_ms",
				"staged_result_ref"
			]);
			if (sessionId !== void 0) pendingResults = pendingResults.where("session_id", "=", sessionId);
			return executeSqliteQuerySync(db, pendingResults.$if(hasRepositoryWorkspacePendingResultSchema(db), (builder) => builder.select("repository_workspace_id")).orderBy("session_id")).rows.map((row) => {
				const result = {
					sessionId: row.session_id,
					environmentId: row.environment_id,
					ownerEpoch: row.owner_epoch,
					placementGeneration: row.placement_generation,
					claimId: row.claim_id,
					runId: row.run_id,
					gatewayInstanceId: row.gateway_instance_id,
					recoveryRequestedAtMs: row.recovery_requested_at_ms,
					workspaceAcceptedAtMs: row.workspace_accepted_at_ms,
					stagedResultRef: row.staged_result_ref
				};
				if (row.repository_workspace_id) result.repositoryWorkspaceId = row.repository_workspace_id;
				return result;
			});
		},
		markWorkspaceResultPending(claim) {
			write((db) => {
				insertWorkerWorkspacePendingResult(db, claim, now(), instanceId);
			});
		},
		recordStagedWorkspaceResult(claim, stagedResultRef, repositoryWorkspaceId) {
			if (!/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(stagedResultRef)) throw new Error("Worker workspace staged result reference is invalid");
			if (repositoryWorkspaceId !== void 0 && !/^[a-f0-9-]{36}$/u.test(repositoryWorkspaceId)) throw new Error("Worker workspace result repository identity is invalid");
			write((db) => {
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
			});
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-claims.ts
const workspaceJournalQuery = (db) => getNodeSqliteKysely(db);
var ActiveTurnClaimError = class extends Error {
	constructor(sessionId) {
		super(`Session ${sessionId} already has an active turn claim`);
		this.name = "ActiveTurnClaimError";
	}
};
function createPlacementTurnClaimOps(runtime) {
	const { instanceId, path, now, read, write } = runtime;
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
		if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
			turn_claim_owner: owner.kind,
			turn_claim_id: claimId,
			turn_claim_run_id: runId,
			turn_claim_generation: current.generation,
			turn_claim_owner_epoch: owner.kind === "worker" ? owner.ownerEpoch : null,
			updated_at_ms: updatedAtMs
		}).where("session_id", "=", current.sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Session ${identity.sessionId} placement changed during turn admission`);
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
		...createPlacementSessionToolOperationOps(runtime),
		releaseTurn(claim) {
			const sessionId = required(claim.sessionId, "session id");
			const claimId = required(claim.claimId, "turn claim id");
			const runId = required(claim.runId, "turn claim run id");
			const released = write((db) => {
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
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
					turn_claim_owner: null,
					turn_claim_id: null,
					turn_claim_run_id: null,
					turn_claim_generation: null,
					turn_claim_owner_epoch: null,
					updated_at_ms: now()
				}).where("session_id", "=", sessionId).where("turn_claim_id", "=", claimId).where("turn_claim_run_id", "=", runId).where("turn_claim_generation", "=", claim.placementGeneration)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} turn claim changed during release`);
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				}, db);
				return getRequired(db, sessionId);
			});
			signalWorkerTurnClaimClosed(path, claim);
			return released;
		},
		completeWorkspaceResultAndReleaseTurn(claim) {
			const sessionId = required(claim.sessionId, "session id");
			const claimId = required(claim.claimId, "turn claim id");
			const runId = required(claim.runId, "turn claim run id");
			const released = write((db) => {
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
				const values = {
					turn_claim_owner: null,
					turn_claim_id: null,
					turn_claim_run_id: null,
					turn_claim_generation: null,
					turn_claim_owner_epoch: null,
					updated_at_ms: now()
				};
				clearWorkerWorkspacePendingResult(db, sessionId);
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set(values).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_id", current.turnClaim ? "=" : "is", current.turnClaim && claimId).where("turn_claim_run_id", current.turnClaim ? "=" : "is", current.turnClaim && runId)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during release`);
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				}, db);
				return getRequired(db, sessionId);
			});
			signalWorkerTurnClaimClosed(path, claim);
			return released;
		},
		cancelWorkspaceResultAndReleaseTurn(claim, options) {
			const sessionId = required(claim.sessionId, "session id");
			const claimId = required(claim.claimId, "turn claim id");
			const runId = required(claim.runId, "turn claim run id");
			const nodeDisconnect = options?.reason === "node-disconnect";
			if (!nodeDisconnect && (claimId !== runId || !claimId.startsWith("reclaim-"))) throw new Error(`Session ${sessionId} workspace result is not owned by reclaim`);
			const released = write((db) => {
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
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
					turn_claim_owner: null,
					turn_claim_id: null,
					turn_claim_run_id: null,
					turn_claim_generation: null,
					turn_claim_owner_epoch: null,
					updated_at_ms: now()
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("turn_claim_id", "=", claimId).where("turn_claim_run_id", "=", runId)).numAffectedRows !== 1n) throw new Error(`Session ${sessionId} workspace result changed during cancellation`);
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				}, db);
				return getRequired(db, sessionId);
			});
			signalWorkerTurnClaimClosed(path, claim);
			return released;
		},
		clearLocalTurnClaimsAfterRestart() {
			const clearedSessionIds = write((db) => {
				const sessionIds = executeSqliteQuerySync(db, query$2(db).selectFrom("worker_session_placements").select("session_id").where("turn_claim_owner", "=", "local")).rows.map((row) => row.session_id);
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
					turn_claim_owner: null,
					turn_claim_id: null,
					turn_claim_run_id: null,
					turn_claim_generation: null,
					turn_claim_owner_epoch: null,
					updated_at_ms: now()
				}).where("turn_claim_owner", "=", "local")).numAffectedRows !== BigInt(sessionIds.length)) throw new Error("Local turn claims changed during restart recovery");
				return sessionIds;
			});
			for (const sessionId of clearedSessionIds) signalTurnClaimRelease(path, sessionId);
			return clearedSessionIds.length;
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
		updateAckCursors(input) {
			const sessionId = required(input.claim.sessionId, "session id");
			const claimId = required(input.claim.claimId, "turn claim id");
			const runId = required(input.claim.runId, "turn claim run id");
			if (!Number.isSafeInteger(input.claim.placementGeneration) || input.claim.placementGeneration < 0) throw new Error("Worker session placement turn claim generation is invalid");
			if (input.claim.owner.kind !== "worker") throw new Error("Only a worker turn claim can acknowledge worker cursors");
			const placementGeneration = input.claim.placementGeneration;
			const environmentId = required(input.claim.owner.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.claim.owner.ownerEpoch, "active owner epoch");
			return write((db) => {
				const current = getRequired(db, sessionId);
				const persisted = current.turnClaim;
				if (!(current.state === "active" || current.state === "draining") || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || persisted?.owner !== "worker" || persisted.claimId !== claimId || persisted.runId !== runId || persisted.generation !== placementGeneration || persisted.ownerEpoch !== ownerEpoch) throw new Error(`Cannot ACK stale worker turn for session ${sessionId}`);
				const transcript = advanceCursor(current.lastTranscriptAckCursor, input.transcript, "transcript ACK cursor");
				const liveEvent = advanceCursor(current.lastLiveEventAckCursor, input.liveEvent, "live ACK cursor");
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
					last_transcript_ack_cursor: transcript,
					last_live_event_ack_cursor: liveEvent,
					updated_at_ms: now()
				}).where("session_id", "=", sessionId).where("state", "=", current.state).where("transition_generation", "=", current.generation).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch).where("turn_claim_owner", "=", "worker").where("turn_claim_id", "=", claimId).where("turn_claim_run_id", "=", runId).where("turn_claim_generation", "=", placementGeneration).where("turn_claim_owner_epoch", "=", ownerEpoch)).numAffectedRows !== 1n) throw new Error(`Worker session placement ${sessionId} changed during ACK`);
				if (input.liveEvent !== void 0) insertWorkerWorkspacePendingResult(db, input.claim, now(), instanceId);
				sessionChanges.emit({
					agentId: current.agentId,
					sessionKey: current.sessionKey
				}, db);
				return getRequired(db, sessionId);
			});
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
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
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
		},
		acceptIdleWorkspaceReconciliation(input) {
			const sessionId = required(input.sessionId, "session id");
			const environmentId = required(input.environmentId, "environment id");
			const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
			const manifestRef = required(input.manifestRef, "workspace base manifest ref");
			if (!/^sha256:[a-f0-9]{64}$/u.test(manifestRef)) throw new Error("Worker workspace base manifest reference is invalid");
			return write((db) => {
				const current = getRequired(db, sessionId);
				if (current.state !== "active" || current.generation !== input.expectedGeneration || current.environmentId !== environmentId || current.activeOwnerEpoch !== ownerEpoch || current.turnClaim !== null) throw new Error(`Cannot accept stale idle worker workspace for session ${sessionId}`);
				if (executeSqliteQuerySync(db, query$2(db).updateTable("worker_session_placements").set({
					workspace_base_manifest_ref: manifestRef,
					updated_at_ms: now()
				}).where("session_id", "=", sessionId).where("state", "=", "active").where("transition_generation", "=", input.expectedGeneration).where("environment_id", "=", environmentId).where("active_owner_epoch", "=", ownerEpoch).where("turn_claim_owner", "is", null)).numAffectedRows !== 1n) throw new Error(`Worker session workspace ${sessionId} changed during reconciliation`);
				clearWorkerWorkspaceReconciliation(db, sessionId);
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
export { hasWorkerWorkspacePendingResult as a, clearWorkerWorkspaceReconciliation as c, hasCurrentWorkspaceResultClaim as i, createPlacementWorkspaceJournalOps as l, createPlacementTurnClaimOps as n, isCurrentWorkerWorkspacePendingResultOwner as o, createPlacementWorkspaceResultOps as r, readWorkerWorkspaceReconciliationFacts as s, ActiveTurnClaimError as t };
