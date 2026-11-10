import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { T as parseCronRunScopeSuffix } from "./session-key-CSDERtm3.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { c as createSessionPlacementSettlementClosedAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./config-B3oiWDlr.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { r as withSessionPlacementForcedTerminalSettlement } from "./session-placement-forced-terminal-settlement-Buc-FlZv.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { n as AcceptedWorkspacePublicationIndeterminateError } from "./workspace-reconcile-BuXOoPIv.mjs";
import { n as isCurrentActiveWorkerEnvironment, o as matchesWorkerPlacementTarget } from "./placement-target-BGdJpPtJ.mjs";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-CQVfTI04.mjs";
import { r as assertRequiredWorkerLocalExecution } from "./required-worker-profile-B0DIhkdC.mjs";
import "./session-manager-Mve5HWCW.mjs";
import { t as WORKER_ADMISSION_DEADLINE_MS } from "./worker-connection-contract-BLrCYghU.mjs";
import { o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, s as moveStagedWorkerWorkspaceResultToCleanup } from "./workspace-result-staging-CYU_4-6b.mjs";
import { n as workerInferencePlacement } from "./inference-placement-C1SOuYae.mjs";
import { f as placementTurnOwner, h as reportPlacementTransition, m as projectWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { r as findPendingWorkerWorkspaceResult } from "./placement-workspace-result--lykq2r1.mjs";
import { t as ActiveTurnClaimError } from "./placement-turn-claims-DLDd9nfQ.mjs";
import { t as WorkerNodeLostError } from "./worker-node-loss-DmwJygIh.mjs";
import { n as prepareWorkerTurnTranscriptSource } from "./worker-turn-transcript-target-D5zatewR.mjs";
import { i as stageSessionRepositoryCheckpoint, r as recoverSessionRepositoryCheckpoint } from "./session-repository-checkpoints-C4TGwsPq.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/session-workspace.ts
/** Repository roots contain result artifacts only; never use them as execution cwd. */
function sessionWorkspaceRoot(workspace) {
	if (workspace.kind === "device-folder") throw new Error("A device folder has no Gateway workspace root");
	return workspace.kind === "local" ? workspace.path : getSessionRepositoryWorkspaceStore().artifactPath(workspace.repository.workspaceId);
}
function createWorkerWorkspaceReconcileRequest(params) {
	const { workspace, remoteWorkspaceDir, baseManifestRef, journal, stagedResult } = params;
	if (workspace.kind === "device-folder") throw new Error("Device folders are authoritative on the device and cannot be reconciled");
	if (workspace.kind === "local") return {
		source: {
			kind: "local",
			path: workspace.path,
			journal,
			stagedResult,
			assertCurrent: params.assertCurrent
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
			authorize: params.assertCurrent,
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
						await stagedResult.record(prepared.checkpointRef, workspace.repository.workspaceId);
						params.assertCurrent();
						await journal.commit(payload.currentManifestRef);
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
	await params.onAccepted(accepted.manifestHash);
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-settlement.ts
const log = createSubsystemLogger("gateway/worker-placement");
async function resolvePriorWorkspaceResultConflict(resolve, placement) {
	if (placement.workspaceResultConflict) return placement.workspaceResultConflict;
	const lookup = await resolve();
	if (lookup.kind === "conflict") return lookup.conflict;
	if (lookup.kind === "unknown") log.warn(`Cloud workspace conflict state unknown sessionId=${boundedWorkerError(placement.sessionId, 128)} reason=${lookup.reason}; preserving prior conflict state`);
}
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
			load: () => params.placements.loadWorkspaceReconciliation(owner, void 0, params.assertCurrent),
			begin: (next) => {
				params.assertCurrent?.();
				return params.placements.beginWorkspaceReconciliation(owner, next, params.assertCurrent);
			},
			commit: async (manifestRef) => {
				(params.assertCommitCurrent ?? params.assertCurrent)?.();
				await params.placements.updateWorkspaceBaseManifest({
					claim: params.turnClaim,
					manifestRef
				}, params.assertCurrent, params.current);
				manifestAccepted = true;
			},
			abort: () => {
				params.assertCurrent?.();
				return params.placements.abortWorkspaceReconciliation(owner, void 0, params.assertCurrent);
			}
		},
		wasAccepted: () => manifestAccepted
	};
}
async function finalizeWorkspaceResultConflicts(params) {
	params.assertCurrent();
	const retainedPriorConflict = params.retainPriorConflict && params.conflictPaths.length === 0 ? params.priorConflict : void 0;
	const supersededConflict = params.priorConflict && !retainedPriorConflict && (params.conflictPaths.length === 0 || params.priorConflict.stagedResultRef !== params.stagedResultRef) ? params.priorConflict : void 0;
	if (params.workspace.kind === "local" && supersededConflict && supersededConflict.stagedResultRef !== params.stagedResultRef) await deleteStagedWorkerWorkspaceResult({
		root: sessionWorkspaceRoot(params.workspace),
		stagedResultRef: supersededConflict.stagedResultRef,
		assertCurrent: params.assertCurrent
	});
	let conflict;
	if (params.conflictPaths.length > 0) {
		if (!params.stagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
		conflict = projectWorkspaceResultConflict(params.conflictPaths, params.stagedResultRef);
		params.assertCurrent();
		params.placements.recordWorkspaceResultConflict(params.turnClaim, conflict);
		await params.report(conflict);
	} else if (retainedPriorConflict) {
		params.assertCurrent();
		params.placements.recordWorkspaceResultConflict(params.turnClaim, retainedPriorConflict);
	} else if (supersededConflict) {
		params.assertCurrent();
		params.placements.recordWorkspaceResultConflict(params.turnClaim, void 0);
		await params.report({ cleared: true });
	}
	return {
		conflict,
		conflictRetained: conflict !== void 0
	};
}
async function settleStagedWorkspaceResult(params) {
	params.assertCurrent();
	if (params.turnClaim.owner.kind === "worker") {
		await params.placements.closeWorkerTurnToolState(params.turnClaim);
		params.assertCurrent();
	}
	const cleanupRef = params.workspace.kind === "local" && params.stagedResultRef && !params.conflictRetained ? isWorkerWorkspaceResultCleanupRef(params.stagedResultRef) ? params.stagedResultRef : await moveStagedWorkerWorkspaceResultToCleanup({
		root: sessionWorkspaceRoot(params.workspace),
		stagedResultRef: params.stagedResultRef,
		assertCurrent: params.assertCurrent
	}) : void 0;
	params.assertCurrent();
	await params.beforeComplete();
	if (!params.complete) params.assertCurrent();
	const completed = params.complete ? await params.complete() : await params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim, params.assertCurrent);
	await params.afterComplete?.(completed);
	if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
		root: sessionWorkspaceRoot(params.workspace),
		stagedResultRef: cleanupRef
	}).catch(() => void 0);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-admission.ts
/** Required policy uses current placement facts at the existing turn-admission boundary. */
function createRequiredWorkerTurnAdmission(options) {
	return {
		async recoverInterruptedTurn(placement, turn, assertCurrent) {
			if (placement.state !== "active" || !options.isInterruptedTurn?.(placement)) return placement;
			const signal = AbortSignal.timeout(Math.min(WORKER_ADMISSION_DEADLINE_MS, turn.timeoutMs));
			await options.waitForAdmissionNode({
				placement,
				signal: turn.abortSignal ? AbortSignal.any([turn.abortSignal, signal]) : signal,
				assertCurrent
			});
			await options.reconcileActivePlacement(placement.environmentId);
			const recovered = await options.placements.getAsync(placement.sessionId);
			assertCurrent();
			if (!recovered) throw new Error("Worker restart recovery lost placement");
			return recovered;
		},
		usesWorkerInference: async (identity) => {
			const placement = (await options.placements.readProjection([identity.sessionId], { current: true })).placements.get(identity.sessionId);
			const environment = placement?.environmentId ? options.environments.get(placement.environmentId) : void 0;
			return Boolean(placement?.state === "active" && placement.executionMode === "worker-turn" && placement.agentId === identity.agentId && placement.sessionKey === identity.sessionKey && environment && isCurrentActiveWorkerEnvironment(placement, environment) && workerInferencePlacement(environment) === "worker");
		},
		assertLocalAllowed() {
			assertRequiredWorkerLocalExecution(readRuntimeConfig());
		},
		assertCurrent(live) {
			const required = readRuntimeConfig().cloudWorkers?.requiredProfile;
			if (required) {
				const environment = live?.environmentId ? options.environments.get(live.environmentId) : void 0;
				if (!live || live.state === "local" || live.executionMode !== "worker-turn" || environment && environment.profileId !== required) throw new Error("The live placement no longer satisfies the required worker profile policy.");
			}
		}
	};
}
function assertWorkerPlacementCompactionAllowed(placement) {
	if (placement && placement.state !== "local") throw new Error("Compaction cannot change the session ID while a worker placement owns this session. Keep the same session ID, or move the session back to the Gateway before retrying.");
}
/** Wait without a placement claim: a claim would fail the refresh's authority check. */
async function waitForWorkerRuntimeRefresh(params) {
	const unsubscribe = params.refresh.onProgress(params.onProgress);
	try {
		await waitForTurnOperation({
			start: () => params.refresh.settled,
			signal: AbortSignal.any([getGatewayRestartDrainSignal(), ...params.signal ? [params.signal] : []]),
			timeoutMs: params.timeoutMs
		});
	} finally {
		unsubscribe();
	}
}
async function hasWorkerResultToSettle(placements, sessionId, runId) {
	const facts = await placements.readProjection([sessionId], { current: true });
	const pending = facts.pendingResults.get(sessionId);
	return Boolean(pending && (pending.runId !== runId || !facts.placements.get(sessionId)?.turnClaim));
}
/** Wait for live reconciliation, or report a retained result that needs recovery. */
async function waitForPendingWorkerResult(params) {
	await params.placements.waitForTurnClaimRelease(params.sessionId, params.signal ? { signal: params.signal } : {});
	const facts = await params.placements.readProjection([params.sessionId], { current: true });
	params.signal?.throwIfAborted();
	if (!facts.placements.get(params.sessionId)?.turnClaim && facts.pendingResults.has(params.sessionId)) throw new Error("Workspace recovery is still pending after its turn ended. Wait for workspace recovery to finish before retrying; if it remains blocked, inspect the cloud worker recovery error.");
}
/** Join live setup without admitting work against a stale session or destination. */
async function waitForInitialWorkerPlacement(params) {
	const identity = resolvePlacementIdentity(params.turn, params.placement);
	const target = {
		...identity,
		storePath: params.turn.sessionTarget?.storePath ?? resolveSessionStorePathForScope(identity)
	};
	const memory = captureSessionActorStorageOwner(target, {
		assertCurrent: () => params.assertRunCurrent?.(),
		authorize: () => params.assertRunCurrent?.()
	});
	const original = memory ? readCapturedSessionActorEntry(memory, target.sessionKey) : await readSessionEntryReadOnlyInWorker(target, params.assertRunCurrent);
	const refuseSession = () => {
		throw createAbortError("Session changed while waiting for worker setup");
	};
	const source = original ? await prepareWorkerTurnTranscriptSource(target, {
		fields: [
			"sessionId",
			"archivedAt",
			"lifecycleRevision",
			"activeWriterRunId"
		],
		expected: {
			sessionId: identity.sessionId,
			archivedAt: void 0,
			lifecycleRevision: original.lifecycleRevision,
			activeWriterRunId: original.activeWriterRunId
		},
		refuse: refuseSession
	}) : refuseSession();
	try {
		const assertSessionCurrent = composeSessionSourceAssertion([params.assertRunCurrent, source], (assertSources) => {
			params.turn.abortSignal?.throwIfAborted();
			assertSources();
		});
		const completed = await params.wait(params.placement, params.turn.abortSignal);
		let placement = completed;
		const assertCurrent = composeSessionSourceAssertion([assertSessionCurrent], (assertSession) => {
			assertSession();
			const current = params.placements.get(identity.sessionId);
			if (!current || !matchesWorkerPlacementTarget(current, completed) || current.sessionKey !== identity.sessionKey || current.agentId !== identity.agentId || current.executionMode !== params.placement.executionMode) throw createAbortError("Worker placement changed while waiting for setup");
			placement = current;
		});
		assertCurrent();
		return {
			placement: requireActivePlacement(placement),
			assertCurrent,
			release: () => source.release()
		};
	} catch (error) {
		await source.release();
		throw error;
	}
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
	return await racePromiseWithAbortSignal(params.start, signal, abortError);
}
function resolvePlacementIdentityField(supplied, persisted, field) {
	const resolved = supplied === void 0 && persisted ? persisted : supplied?.trim();
	if (!resolved) throw new Error(`Worker turn ${field} is required`);
	if (persisted && resolved !== persisted) throw new Error(`Worker turn ${field} does not match its placement`);
	return resolved;
}
function resolvePlacementIdentity(claim, placement) {
	const sessionKey = claim.sessionKey?.trim();
	const localCronAlias = placement?.state === "local" && sessionKey && parseCronRunScopeSuffix(placement.sessionKey).baseSessionKey === sessionKey;
	return {
		sessionId: claim.sessionId,
		agentId: resolvePlacementIdentityField(claim.agentId, placement?.agentId, "agent id"),
		sessionKey: localCronAlias ? sessionKey : resolvePlacementIdentityField(claim.sessionKey, placement?.sessionKey, "session key")
	};
}
async function resolveWorkerPlacementRuntimeOverride(placements, identity) {
	const placement = (await placements.readProjection([identity.sessionId], { current: true })).placements.get(identity.sessionId);
	return placement && placement.state !== "local" && placement.executionMode === "worker-turn" && (identity.agentId === void 0 || placement.agentId === identity.agentId) && (identity.sessionKey === void 0 || placement.sessionKey === identity.sessionKey) ? "openclaw" : void 0;
}
function requireActivePlacement(placement) {
	const failureDetail = placement.state === "failed" ? `: ${placement.recoveryError}` : "";
	if (placement.state !== "active") throw new Error(`Worker turn rejected in placement ${placement.state}${failureDetail}`);
	return placement;
}
async function releaseClaimIfOwned(placements, turnClaim) {
	if (turnClaim.owner.kind === "worker" && placements.validateTurnClaim(turnClaim)) await placements.closeWorkerTurnToolState(turnClaim);
	await placements.releaseTurnIfOwned(turnClaim);
}
async function executeLocalTurn(params) {
	let identity;
	let claimSessionKey;
	const assertPreflightCurrent = params.assertCurrent ?? (() => {});
	try {
		const current = params.preparedPlacement ? params.preparedPlacement.placement : (await params.placements.readProjection([params.claim.sessionId])).placements.get(params.claim.sessionId);
		identity = resolvePlacementIdentity(params.claim, current);
		claimSessionKey = current?.sessionKey ?? identity.sessionKey;
		const assertLocalWorkspace = (entry) => {
			if (entry?.deviceFolder) throw new Error(`This session uses a folder on device ${entry.deviceFolder.deviceId}. Dispatch it to that device before sending a turn; it cannot run on the Gateway.`);
			if (entry?.repositoryWorkspaceId) throw new Error("This repository session needs a cloud worker. Choose a cloud environment and retry.");
		};
		const reader = params.sessionReader;
		const scope = {
			...identity,
			storePath: reader?.database.path ?? resolveSessionStorePathForScope(identity)
		};
		const memory = captureSessionActorStorageOwner(scope, {
			assertCurrent: assertPreflightCurrent,
			authorize: assertPreflightCurrent
		});
		if (memory) {
			assertPreflightCurrent();
			assertLocalWorkspace(readCapturedSessionActorEntry(memory, scope.sessionKey));
		} else if (reader) {
			const key = assertSessionEntryCohortScope(reader, scope);
			await reader.withRead({
				sessionKeys: [key],
				snapshotFields: []
			}, assertPreflightCurrent, (read) => assertLocalWorkspace(read.entries.find((row) => row.sessionKey === key)?.entry));
		} else assertLocalWorkspace(await readSessionEntryReadOnlyInWorker(scope, assertPreflightCurrent));
	} finally {
		params.preparedPlacement?.release();
	}
	const turnClaim = await params.placements.claimTurn({
		...identity,
		sessionKey: claimSessionKey,
		claimId: randomUUID(),
		runId: params.claim.runId,
		owner: { kind: "local" }
	}, params.assertCurrent);
	let closed = false;
	let settlement;
	const settle = () => {
		closed = true;
		return settlement ??= releaseClaimIfOwned(params.placements, turnClaim);
	};
	let authority;
	try {
		authority = await params.placements.prepareTurnClaimAuthority(turnClaim);
		params.assertCurrent?.();
		return await withSessionPlacementForcedTerminalSettlement(settle, () => {
			if (closed || !authority?.isCurrent()) throw createSessionPlacementSettlementClosedAbortError();
		}, params.runLocal);
	} finally {
		try {
			await settle();
		} finally {
			authority?.release();
		}
	}
}
async function claimWorkerTurn(params) {
	const claim = () => params.placements.claimTurn({
		...params.identity,
		claimId: randomUUID(),
		runId: params.runId,
		owner: placementTurnOwner(params.placement)
	}, () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	});
	try {
		return {
			placement: params.placement,
			turnClaim: await claim()
		};
	} catch (error) {
		if (params.placement.executionMode === "remote-exec" || !(error instanceof ActiveTurnClaimError)) throw error;
		const facts = await params.placements.readProjection([params.identity.sessionId], { current: true });
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		const activePlacement = facts.placements.get(params.identity.sessionId);
		const activeClaim = activePlacement?.turnClaim;
		if (activeClaim?.runId === params.runId) throw error;
		const resultIsReconciling = [...facts.pendingResults.values()].some((pending) => activeClaim?.owner === "worker" && pending.sessionId === params.identity.sessionId && pending.claimId === activeClaim.claimId && pending.runId === activeClaim.runId);
		const cancelledClaim = activePlacement && projectWorkerSessionTurnClaim(activePlacement);
		if (resultIsReconciling) {
			await waitForPendingWorkerResult({
				placements: params.placements,
				sessionId: params.identity.sessionId,
				...params.signal ? { signal: params.signal } : {}
			});
			return null;
		}
		if (!(cancelledClaim && params.isCancellationRequested(cancelledClaim))) throw error;
	}
	await params.placements.waitForTurnClaimRelease(params.identity.sessionId, {
		timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
		...params.signal ? { signal: params.signal } : {}
	});
	const refreshed = await params.placements.getAsync(params.identity.sessionId);
	params.signal?.throwIfAborted();
	params.assertCurrent?.();
	if (refreshed?.state !== "active" || !matchesWorkerPlacementTarget(refreshed, params.placement)) throw new Error("Cloud worker placement changed while waiting for the previous turn");
	return {
		placement: refreshed,
		turnClaim: await claim()
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
async function prepareWorkerTurnFailure(options, placement, claim, error, assertCurrent, abortSignal, persistAbandonedPartial) {
	const { placements } = options;
	const nodeLoss = error instanceof WorkerNodeLostError ? error : void 0;
	let partialWritten = false;
	try {
		if (persistAbandonedPartial && placements.validateTurnClaim(claim)) {
			await persistAbandonedPartial({
				...claim,
				missingToolResultText: nodeLoss?.message
			});
			partialWritten = true;
		}
	} catch (persistenceError) {
		logWarn(`Cloud worker partial reply could not be saved: ${boundedWorkerError(persistenceError)}`);
	}
	const pendingWorkspaceResult = await findPendingWorkerWorkspaceResult(placements, claim);
	if (pendingWorkspaceResult) {
		if (claim.owner.kind === "local") await placements.failWorkspaceResultAndReleaseTurn(pendingWorkspaceResult, error);
		else await placements.handoffWorkspaceResultRecovery(claim);
		if (!nodeLoss || !partialWritten) {
			await options.reconcileActivePlacement(placement.environmentId);
			throw error;
		}
	}
	if (nodeLoss && partialWritten) {
		try {
			if (!pendingWorkspaceResult) {
				assertCurrent();
				await options.environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch);
				await placements.closeWorkerTurnToolState(claim);
				await placements.retainInterruptedTurnWorkspace(claim, assertCurrent);
			}
			const signal = AbortSignal.any([AbortSignal.timeout(WORKER_ADMISSION_DEADLINE_MS), ...abortSignal ? [abortSignal] : []]);
			await options.waitForAdmissionNode({
				placement,
				signal,
				assertCurrent
			});
			await options.reconcileActivePlacement(placement.environmentId);
			const current = await placements.getAsync(placement.sessionId);
			assertCurrent();
			nodeLoss.canContinue = matchesWorkerPlacementTarget(current, placement) && current?.turnClaim === null;
		} catch (recoveryError) {
			nodeLoss.cause ??= recoveryError;
		}
		if (nodeLoss.canContinue || pendingWorkspaceResult) throw error;
	}
}
async function failHandedOffTurn(params) {
	const failures = [boundedWorkerError(params.error)];
	let drained;
	try {
		drained = await params.placements.startDrain({
			sessionId: params.placement.sessionId,
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch,
			expectedGeneration: params.placement.generation,
			expectedTurnClaim: params.turnClaim
		});
	} catch (error) {
		if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
		const current = await params.placements.getAsync(params.placement.sessionId);
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
	let recordingFailure;
	const recordFailure = (assertCurrent) => {
		if (recordingFailure) return recordingFailure;
		const operation = recordFailureOnce(assertCurrent);
		recordingFailure = operation;
		operation.then(() => {
			recordingFailure = void 0;
		}, (error) => {
			if (!(error instanceof AcceptedWorkspacePublicationIndeterminateError)) recordingFailure = void 0;
		});
		return operation;
	};
	const recordFailureOnce = async (assertCurrent) => {
		if (!isCurrentDrain()) return;
		try {
			const reconciling = await params.placements.startReconcile({
				sessionId: draining.sessionId,
				environmentId: draining.environmentId,
				ownerEpoch: draining.activeOwnerEpoch,
				expectedGeneration: draining.generation
			}, assertCurrent);
			const recoveryError = failures.join("; ");
			const failed = await params.placements.fail({
				sessionId: reconciling.sessionId,
				expectedGeneration: reconciling.generation,
				recoveryError
			}, assertCurrent);
			reportPlacementTransition(void 0, failed);
			return recoveryError;
		} catch (error) {
			if (error instanceof AcceptedWorkspacePublicationIndeterminateError) throw error;
			return;
		}
	};
	const terminalRecovery = params.terminal ? createDeferredCore() : void 0;
	if (params.terminal && terminalRecovery) {
		const observedAtMs = params.terminal.observedAtMs;
		params.terminal.registerRecovery(async (assertCurrent) => {
			if (Date.now() - observedAtMs < TERMINAL_WORKER_CLEANUP_GRACE_MS) return;
			const recorded = await recordFailure(assertCurrent);
			if (recorded !== void 0) terminalRecovery.resolve();
			return recorded;
		});
	}
	const waitForCleanup = (operation) => terminalRecovery ? Promise.race([operation, terminalRecovery.promise]) : operation;
	for (const [label, cleanup] of [["tunnel stop", () => params.environments.stopTunnel(draining.environmentId, draining.activeOwnerEpoch)], ["environment destroy", () => params.environments.destroy(draining.environmentId)]]) {
		if (!isCurrentDrain()) {
			await recordingFailure;
			return;
		}
		try {
			await waitForCleanup(cleanup());
		} catch (error) {
			failures.push(`${label}: ${boundedWorkerError(error)}`);
		}
	}
	await recordFailure();
}
//#endregion
export { createWorkerWorkspaceReconcileRequest as C, settleStagedWorkspaceResult as S, sessionWorkspaceRoot as T, waitForTurnOperation as _, assertWorkerPlacementCompactionAllowed as a, finalizeWorkspaceResultConflicts as b, executeLocalTurn as c, releaseClaimIfOwned as d, requireActivePlacement as f, waitForPendingWorkerResult as g, waitForInitialWorkerPlacement as h, prepareWorkerTurnFailure as i, hasWorkerResultToSettle as l, resolveWorkerPlacementRuntimeOverride as m, WorkerWorkspaceReconciliationError as n, claimWorkerTurn as o, resolvePlacementIdentity as p, failHandedOffTurn as r, createRequiredWorkerTurnAdmission as s, WorkerTurnExecutionError as t, latestDurableWorkspaceConflict as u, waitForWorkerRuntimeRefresh as v, recoverSessionWorkspaceCheckpoint as w, resolvePriorWorkspaceResultConflict as x, createWorkspaceResultJournal as y };
