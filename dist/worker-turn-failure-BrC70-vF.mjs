import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { T as resolveSessionStorePathForScope, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { c as createSessionPlacementSettlementClosedAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { r as withSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-C1lJojrj.mjs";
import { m as projectWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { t as ActiveTurnClaimError } from "./placement-turn-claims-lHILSuHT.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.mjs";
import "./session-manager-ezhBV3sx.mjs";
import { o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, s as moveStagedWorkerWorkspaceResultToCleanup } from "./workspace-result-staging-Cy039j72.mjs";
import { i as stageSessionRepositoryCheckpoint, r as recoverSessionRepositoryCheckpoint } from "./session-repository-checkpoints-CYPVSe_l.mjs";
import { t as matchesWorkerPlacementTarget } from "./placement-reclaim-contract-BNCBrypU.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/session-workspace.ts
/** Repository roots contain result artifacts only; never use them as execution cwd. */
function sessionWorkspaceRoot(workspace) {
	return workspace.kind === "local" ? workspace.path : getSessionRepositoryWorkspaceStore().artifactPath(workspace.repository.workspaceId);
}
function createWorkerWorkspaceReconcileRequest(params) {
	const { workspace, remoteWorkspaceDir, baseManifestRef, journal, stagedResult } = params;
	if (workspace.kind === "local") return {
		source: {
			kind: "local",
			path: workspace.path,
			journal,
			stagedResult
		},
		remoteWorkspaceDir,
		baseManifestRef
	};
	if (!workspace.repository.baseManifestHash || !workspace.repository.manifestHash) throw new Error("Repository workspace has no accepted source manifest");
	return {
		remoteWorkspaceDir,
		baseManifestRef: workspace.repository.baseManifestHash,
		source: {
			kind: "repository",
			referenceManifestRef: workspace.repository.manifestHash,
			prepareCheckpoint: async (payload) => {
				const prepared = await stageSessionRepositoryCheckpoint({
					...payload,
					workspaceId: workspace.repository.workspaceId,
					expectedRevision: workspace.repository.revision,
					checkpointRef: stagedResult.ref,
					assertCurrent: params.assertCurrent
				});
				return {
					verify: prepared.verify,
					discard: prepared.discard,
					publish: async () => {
						const accepted = await prepared.publish();
						params.assertCurrent();
						stagedResult.record(prepared.checkpointRef);
						journal.commit(payload.currentManifestRef);
						return accepted;
					}
				};
			}
		}
	};
}
async function recoverSessionWorkspaceCheckpoint(params) {
	const accepted = await recoverSessionRepositoryCheckpoint({
		workspaceId: params.workspace.repository.workspaceId,
		checkpointRef: params.checkpointRef,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent();
	if (!accepted.manifestHash) throw new Error("Repository checkpoint has no accepted manifest");
	params.onAccepted(accepted.manifestHash);
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-settlement.ts
function createWorkspaceResultJournal(params) {
	const owner = {
		sessionId: params.placement.sessionId,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch,
		placementGeneration: params.placement.generation
	};
	let manifestAccepted = false;
	return {
		adapter: {
			load: () => params.placements.loadWorkspaceReconciliation(owner),
			begin: (next) => params.placements.beginWorkspaceReconciliation(owner, next),
			commit: (manifestRef) => {
				params.placements.updateWorkspaceBaseManifest({
					claim: params.turnClaim,
					manifestRef
				});
				manifestAccepted = true;
			},
			abort: () => params.placements.abortWorkspaceReconciliation(owner)
		},
		wasAccepted: () => manifestAccepted
	};
}
async function finalizeWorkspaceResultConflicts(params) {
	const retainedPriorConflict = params.retainPriorConflict && params.conflictPaths.length === 0 ? params.priorConflict : void 0;
	const supersededConflict = params.priorConflict && !retainedPriorConflict && (params.conflictPaths.length === 0 || params.priorConflict.stagedResultRef !== params.stagedResultRef) ? params.priorConflict : void 0;
	if (params.workspace.kind === "local" && supersededConflict && supersededConflict.stagedResultRef !== params.stagedResultRef) await deleteStagedWorkerWorkspaceResult({
		root: sessionWorkspaceRoot(params.workspace),
		stagedResultRef: supersededConflict.stagedResultRef
	});
	let conflict;
	if (params.conflictPaths.length > 0) {
		if (!params.stagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
		conflict = projectWorkspaceResultConflict(params.conflictPaths, params.stagedResultRef);
		params.placements.recordWorkspaceResultConflict(params.turnClaim, conflict);
		await params.report(conflict);
	} else if (retainedPriorConflict) params.placements.recordWorkspaceResultConflict(params.turnClaim, retainedPriorConflict);
	else if (supersededConflict) {
		params.placements.recordWorkspaceResultConflict(params.turnClaim, void 0);
		await params.report({ cleared: true });
	}
	return {
		conflict,
		conflictRetained: conflict !== void 0
	};
}
async function settleStagedWorkspaceResult(params) {
	if (params.turnClaim.owner.kind === "worker") await params.placements.closeWorkerTurnToolState(params.turnClaim);
	const cleanupRef = params.workspace.kind === "local" && params.stagedResultRef && !params.conflictRetained ? isWorkerWorkspaceResultCleanupRef(params.stagedResultRef) ? params.stagedResultRef : await moveStagedWorkerWorkspaceResultToCleanup({
		root: sessionWorkspaceRoot(params.workspace),
		stagedResultRef: params.stagedResultRef
	}) : void 0;
	await params.beforeComplete();
	const completed = params.complete ? params.complete() : params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
	params.validateCompleted?.(completed);
	await params.afterComplete?.(completed);
	if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
		root: sessionWorkspaceRoot(params.workspace),
		stagedResultRef: cleanupRef
	}).catch(() => void 0);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-admission.ts
/** Wait for live reconciliation, or report a retained result that needs recovery. */
async function waitForPendingWorkerResult(params) {
	await params.placements.waitForTurnClaimRelease(params.sessionId, params.signal ? { signal: params.signal } : {});
	if (!params.placements.get(params.sessionId)?.turnClaim && params.placements.listPendingWorkspaceResults(params.sessionId).some((pending) => pending.sessionId === params.sessionId)) throw new Error("Workspace recovery is still pending after its turn ended. Wait for workspace recovery to finish before retrying; if it remains blocked, inspect the cloud worker recovery error.");
}
/** Join live setup without admitting work against a stale session or destination. */
async function waitForInitialWorkerPlacement(params) {
	const identity = resolvePlacementIdentity(params.turn, params.placement);
	const target = {
		...identity,
		storePath: params.turn.sessionTarget?.storePath ?? resolveSessionStorePathForScope(identity)
	};
	const original = loadSessionEntryReadOnly(target);
	const assertSessionCurrent = () => {
		params.turn.abortSignal?.throwIfAborted();
		params.assertRunCurrent?.();
		const current = loadSessionEntryReadOnly(target);
		if (!original || !current || current.sessionId !== identity.sessionId || current.archivedAt !== void 0 || current.lifecycleRevision !== original.lifecycleRevision || current.activeWriterRunId !== original.activeWriterRunId) throw createAbortError("Session changed while waiting for worker setup");
	};
	assertSessionCurrent();
	const completed = await params.wait(params.placement, params.turn.abortSignal);
	assertSessionCurrent();
	const assertCurrent = () => {
		assertSessionCurrent();
		const current = params.placements.get(identity.sessionId);
		if (!current || !matchesWorkerPlacementTarget(current, completed) || current.sessionKey !== identity.sessionKey || current.agentId !== identity.agentId || current.executionMode !== params.placement.executionMode) throw createAbortError("Worker placement changed while waiting for setup");
	};
	assertCurrent();
	return {
		placement: requireActivePlacement(params.placements.get(identity.sessionId)),
		assertCurrent
	};
}
function required(value, field) {
	const normalized = value?.trim();
	if (!normalized) throw new Error(`Worker turn ${field} is required`);
	return normalized;
}
function latestDurableWorkspaceConflict(entries) {
	for (const entry of entries.toReversed()) {
		if (entry.type !== "custom_message") continue;
		if (entry.customType === "cloud-workspace-conflict-cleared") return;
		if (entry.customType !== "cloud-workspace-conflict") continue;
		const details = entry.details;
		if (!Array.isArray(details?.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length) || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return;
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	}
}
async function waitForTurnOperation(params) {
	const timeout = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeout]) : timeout;
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error("Cloud worker operation aborted", { cause: signal.reason });
	if (signal.aborted) throw abortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		params.operation.then(resolve, reject).finally(() => {
			signal.removeEventListener("abort", onAbort);
		});
	});
}
function resolvePlacementIdentityField(supplied, persisted, field) {
	const resolved = supplied === void 0 && persisted ? persisted : required(supplied, field);
	if (persisted && resolved !== persisted) throw new Error(`Worker turn ${field} does not match its placement`);
	return resolved;
}
function resolvePlacementIdentity(claim, placement) {
	return {
		sessionId: claim.sessionId,
		agentId: resolvePlacementIdentityField(claim.agentId, placement?.agentId, "agent id"),
		sessionKey: resolvePlacementIdentityField(claim.sessionKey, placement?.sessionKey, "session key")
	};
}
function requireActivePlacement(placement) {
	const failureDetail = placement.state === "failed" ? `: ${placement.recoveryError}` : "";
	if (placement.state !== "active" || !placement.remoteWorkspaceDir || !placement.workerBundleHash) throw new Error(`Worker turn rejected in placement ${placement.state}${failureDetail}`);
	return placement;
}
async function releaseClaimIfOwned(placements, turnClaim) {
	if (placements.validateTurnClaim(turnClaim)) {
		if (turnClaim.owner.kind === "worker") await placements.closeWorkerTurnToolState(turnClaim);
		placements.releaseTurn(turnClaim);
	}
}
async function executeLocalTurn(params) {
	const current = params.placements.get(params.claim.sessionId);
	const identity = resolvePlacementIdentity(params.claim, current);
	if (loadSessionEntryReadOnly({
		...identity,
		storePath: resolveSessionStorePathForScope(identity)
	})?.repositoryWorkspaceId) throw new Error("This repository session needs a cloud worker. Choose a cloud environment and retry.");
	const turnClaim = params.placements.claimTurn({
		...identity,
		claimId: randomUUID(),
		runId: params.claim.runId,
		owner: { kind: "local" }
	});
	let closed = false;
	const settle = () => {
		closed = true;
		return releaseClaimIfOwned(params.placements, turnClaim);
	};
	try {
		return await withSessionPlacementForcedTerminalSettlement(settle, () => {
			if (closed || !params.placements.validateTurnClaim(turnClaim)) throw createSessionPlacementSettlementClosedAbortError();
		}, params.runLocal);
	} finally {
		await settle();
	}
}
async function claimWorkerTurn(params) {
	const claim = () => params.placements.claimTurn({
		...params.identity,
		claimId: randomUUID(),
		runId: params.runId,
		owner: {
			kind: "worker",
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}
	});
	try {
		return {
			placement: params.placement,
			turnClaim: claim()
		};
	} catch (error) {
		if (!(error instanceof ActiveTurnClaimError)) throw error;
		const activePlacement = params.placements.get(params.identity.sessionId);
		const activeClaim = activePlacement?.turnClaim;
		if (activeClaim?.runId === params.runId) throw error;
		const resultIsReconciling = params.placements.listPendingWorkspaceResults(params.identity.sessionId).some((pending) => activeClaim?.owner === "worker" && pending.sessionId === params.identity.sessionId && pending.claimId === activeClaim.claimId && pending.runId === activeClaim.runId);
		const cancelledClaim = activePlacement && projectWorkerSessionTurnClaim(activePlacement);
		if (resultIsReconciling) {
			await waitForPendingWorkerResult({
				placements: params.placements,
				sessionId: params.identity.sessionId,
				...params.signal ? { signal: params.signal } : {}
			});
			return null;
		}
		if (!(cancelledClaim && params.isCancellationRequested(cancelledClaim))) {
			const refreshed = params.placements.get(params.identity.sessionId);
			if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch || refreshed.generation !== params.placement.generation || refreshed.turnClaim) throw error;
			return {
				placement: refreshed,
				turnClaim: claim()
			};
		}
	}
	await params.placements.waitForTurnClaimRelease(params.identity.sessionId, {
		timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
		...params.signal ? { signal: params.signal } : {}
	});
	const refreshed = params.placements.get(params.identity.sessionId);
	if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch || refreshed.generation !== params.placement.generation) throw new Error("Cloud worker placement changed while waiting for the previous turn");
	return {
		placement: refreshed,
		turnClaim: claim()
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-failure.ts
var WorkerTurnExecutionError = class extends Error {};
var WorkerWorkspaceReconciliationError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "WorkerWorkspaceReconciliationError";
	}
};
const TERMINAL_WORKER_CLEANUP_GRACE_MS = 3e4;
async function failHandedOffTurn(params) {
	const failures = [boundedWorkerError(params.error)];
	let drained;
	try {
		drained = params.placements.startDrain({
			sessionId: params.placement.sessionId,
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch,
			expectedGeneration: params.placement.generation
		});
	} catch {
		const current = params.placements.get(params.placement.sessionId);
		if (current?.state === "draining" && current.generation === params.placement.generation + 1 && current.environmentId === params.placement.environmentId && current.activeOwnerEpoch === params.placement.activeOwnerEpoch && params.placements.validateTurnClaim(params.turnClaim)) await releaseClaimIfOwned(params.placements, params.turnClaim);
		return;
	}
	if (drained.state !== "draining") return;
	const draining = drained;
	await releaseClaimIfOwned(params.placements, params.turnClaim);
	const isCurrentDrain = () => {
		const current = params.placements.get(draining.sessionId);
		return current?.state === "draining" && current.generation === draining.generation && current.environmentId === draining.environmentId && current.activeOwnerEpoch === draining.activeOwnerEpoch && current.turnClaim === null;
	};
	const recordFailure = () => {
		if (!isCurrentDrain()) return;
		try {
			const reconciling = params.placements.startReconcile({
				sessionId: draining.sessionId,
				environmentId: draining.environmentId,
				ownerEpoch: draining.activeOwnerEpoch,
				expectedGeneration: draining.generation
			});
			const recoveryError = failures.join("; ");
			params.placements.fail({
				sessionId: reconciling.sessionId,
				expectedGeneration: reconciling.generation,
				recoveryError
			});
			return recoveryError;
		} catch {
			return;
		}
	};
	const terminalRecovery = params.terminal ? createDeferredCore() : void 0;
	if (params.terminal && terminalRecovery) {
		const observedAtMs = params.terminal.observedAtMs;
		params.terminal.registerRecovery(() => {
			if (Date.now() - observedAtMs < TERMINAL_WORKER_CLEANUP_GRACE_MS) return;
			const recorded = recordFailure();
			if (recorded !== void 0) terminalRecovery.resolve();
			return recorded;
		});
	}
	const waitForCleanup = (operation) => terminalRecovery ? Promise.race([operation, terminalRecovery.promise]) : operation;
	if (!isCurrentDrain()) return;
	try {
		await waitForCleanup(params.environments.stopTunnel(params.placement.environmentId, params.placement.activeOwnerEpoch));
	} catch (error) {
		failures.push(`tunnel stop: ${boundedWorkerError(error)}`);
	}
	if (!isCurrentDrain()) return;
	try {
		await waitForCleanup(params.environments.destroy(params.placement.environmentId));
	} catch (error) {
		failures.push(`environment destroy: ${boundedWorkerError(error)}`);
	}
	recordFailure();
}
//#endregion
export { recoverSessionWorkspaceCheckpoint as _, executeLocalTurn as a, requireActivePlacement as c, waitForPendingWorkerResult as d, waitForTurnOperation as f, createWorkerWorkspaceReconcileRequest as g, settleStagedWorkspaceResult as h, claimWorkerTurn as i, resolvePlacementIdentity as l, finalizeWorkspaceResultConflicts as m, WorkerWorkspaceReconciliationError as n, latestDurableWorkspaceConflict as o, createWorkspaceResultJournal as p, failHandedOffTurn as r, releaseClaimIfOwned as s, WorkerTurnExecutionError as t, waitForInitialWorkerPlacement as u, sessionWorkspaceRoot as v };
