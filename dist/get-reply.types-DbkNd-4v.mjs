import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as getGatewayContextResolver, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope, o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-C5zAusBU.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { t as SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE } from "./work-start-error-unYqNOPf.mjs";
import { l as getSessionWorkAdmissionOwnerRelease, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { c as loadSessionEntryForAdmission } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { A as registerReplyOperationSuccessorBarrier, G as REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS, J as ReplyRunSuccessorAdmissionBlockedError, K as ReplyRunAlreadyActiveError, L as retainReplyOperationUntilComplete, S as lifecycleAdmissionByOperation, T as mergeReplyRunAdmissionSource, W as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, b as isReplyRunRecoveryBlocked, c as expireStaleReplyOperation, h as isReplyOperationAbortedForRestart, q as ReplyRunFollowupAdmissionBlockedError, x as isReplyRunSuccessorAdmissionBlocked, y as isReplyRunEvidenceStale, z as runAfterReplyOperationClear } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import { a as getDiagnosticSessionActivitySnapshot, y as resolveRunStaleThresholdMs } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { C as waitForReplyRunSuccessorAdmission, S as waitForReplyRunFollowupAdmission, h as replyRunRegistry, w as createReplyOperation } from "./reply-run-registry.registry-QRh9NCRy.mjs";
import "./reply-run-registry-D1FEEbJ6.mjs";
import { c as isRestartRecoveryTombstone, d as resolveSessionWorkStartError, n as SessionRestartRecoveryTombstoneError, r as SessionWorkStartChangedError } from "./lifecycle-WWQJH57y.mjs";
import { t as DEFAULT_RECOVERY_DELAY_MS } from "./main-session-restart-recovery-shared-DApJGSxq.mjs";
import { i as isMainRestartRecoveryCandidate } from "./main-session-recovery-state-BUCSyc7s.mjs";
import { t as MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER } from "./main-session-recovery-admission-CdL1_5_5.mjs";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-DD8HRxPY.mjs";
import { a as releaseMainSessionRecoveryOwner, t as claimMainSessionRecoveryOwner } from "./main-session-recovery-store-Dx86N0TM.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-KBr1fVd6.mjs";
import { n as formatStageTimings, t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
//#region src/auto-reply/reply/reply-turn-recovery-wait.ts
async function waitForRestartRecoveryProgress(params) {
	const changed = createDeferredCore();
	const unsubscribe = sessionChanges.subscribe((change) => {
		if ("all" in change || change.sessionKey === params.sessionKey && (!params.agentId || !change.agentId || change.agentId === params.agentId)) changed.resolve();
	});
	const timer = setTimeout(() => changed.resolve(), DEFAULT_RECOVERY_DELAY_MS);
	timer.unref?.();
	try {
		await racePromiseWithAbortSignal(params.ownerRelease ? Promise.race([changed.promise, params.ownerRelease]) : changed.promise, params.signal);
	} finally {
		unsubscribe();
		clearTimeout(timer);
	}
}
//#endregion
//#region src/auto-reply/reply/reply-turn-rotation.ts
/** Retains invocation-local lineage evidence; the admission owner decides whether work may start. */
function createReplyTurnRotationEvidence(params) {
	const waitedRotations = /* @__PURE__ */ new Map();
	const isCurrent = (source) => !isReplyOperationAbortedForRestart(source.operation) && (source.fromBarrier || source.operation.key === params.sessionKey && (source.operation === replyRunRegistry.get(params.sessionKey) || source.operation.result !== null));
	const mergeWaitedRotation = (source) => {
		const previous = waitedRotations.get(source.databaseIdentity);
		return mergeReplyRunAdmissionSource(source, previous && isCurrent(previous) ? {
			...previous,
			sessionIds: new Set(previous.sessionIds)
		} : void 0);
	};
	return {
		recordBarrierSources(sources = []) {
			for (const source of sources) waitedRotations.set(source.databaseIdentity, mergeWaitedRotation({
				...source,
				sessionIds: new Set(source.sessionIds),
				fromBarrier: true
			}));
		},
		recordCompletedOperation(operation, databaseIdentity) {
			waitedRotations.set(databaseIdentity, mergeWaitedRotation({
				operation,
				sessionId: operation.sessionId,
				sessionIds: operation.captureOwnedSessionIds(),
				databaseIdentity,
				fromBarrier: false
			}));
		},
		takeStorelessRotation() {
			const source = waitedRotations.get(void 0);
			waitedRotations.delete(void 0);
			return source && isCurrent(source) ? source : void 0;
		},
		hasExpectedSessionRotation(target) {
			const registeredOperation = replyRunRegistry.get(params.sessionKey);
			const rotationSources = [...waitedRotations.values()];
			for (const candidate of /* @__PURE__ */ new Set([
				...params.expectedActiveOperations ?? [],
				params.activeAtAdmission,
				registeredOperation
			])) if (candidate) {
				let source = mergeWaitedRotation({
					operation: candidate,
					sessionId: candidate.sessionId,
					sessionIds: candidate.captureOwnedSessionIds(),
					databaseIdentity: lifecycleAdmissionByOperation.get(candidate)?.databaseIdentity,
					fromBarrier: false
				});
				if (!isCurrent(source)) continue;
				for (const previous of rotationSources) if (isCurrent(previous)) source = mergeReplyRunAdmissionSource(source, {
					...previous,
					sessionIds: new Set(previous.sessionIds)
				});
				rotationSources.push(source);
			}
			return rotationSources.some((source) => target.expectedSessionId && target.databaseIdentity !== void 0 && source.databaseIdentity === target.databaseIdentity && target.sessionId === source.sessionId && isCurrent(source) && source.sessionIds.has(target.expectedSessionId));
		}
	};
}
//#endregion
//#region src/auto-reply/reply/reply-turn-admission.ts
var QueuedFollowupLifecycleInvalidatedError = class extends Error {};
const log = createSubsystemLogger("auto-reply/reply-turn-admission");
async function releaseReplyRecoveryOwner(lease) {
	if (!lease) return;
	try {
		return await releaseMainSessionRecoveryOwner(lease);
	} catch (error) {
		log.warn(`failed to release main-session recovery reply owner: ${formatErrorMessage(error)}`);
		return;
	}
}
/** Runs owner work with its admission marked as the initiating lifecycle context. */
async function runWithReplyOperationLifecycleAdmission(operation, run) {
	const admission = lifecycleAdmissionByOperation.get(operation)?.lease;
	if (admission) return await admission.run(run);
	const resolver = getGatewayContextResolver(operation);
	return await withPluginRuntimeGatewayContextResolver(resolver, run);
}
function rejectLifecycleInvalidatedWork(params) {
	if (params.kind === "queued_followup") {
		const error = new QueuedFollowupLifecycleInvalidatedError(params.message);
		if (params.restartRecoveryTombstone === true) Object.assign(error, { code: SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE });
		throw error;
	}
	if (params.restartRecoveryTombstone === true) throw new SessionRestartRecoveryTombstoneError(params.message);
	if (params.kind === "visible" && params.transientSessionChange === true) throw new SessionWorkStartChangedError(params.message);
	throw new Error(params.message);
}
function isAbortSignalAborted(signal) {
	return signal?.aborted === true;
}
function expireVisibleStaleOperation(operation) {
	if (!operation) return false;
	const idleMs = Date.now() - operation.lastActivityAtMs;
	if (operation.result) return idleMs >= 6e4 && expireStaleReplyOperation(operation, "terminal_unreleased");
	return isReplyRunEvidenceStale(operation) && expireStaleReplyOperation(operation, "no_activity");
}
function resolveVisibleActiveWaitMs(operation) {
	if (!operation || isReplyRunRecoveryBlocked(operation)) return REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS;
	const ageMs = Date.now() - operation.lastActivityAtMs;
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: operation.sessionId,
		sessionKey: operation.key
	});
	const remainingMs = operation.result ? REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS - ageMs : resolveRunStaleThresholdMs(activity, ageMs) - ageMs;
	return Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, Math.max(1, remainingMs));
}
/** Waits for or claims the per-session reply run slot. */
async function admitReplyTurn(params) {
	const activeAtAdmission = replyRunRegistry.get(params.sessionKey);
	const releaseForeground = params.kind === "visible" ? await beginForegroundSessionMaintenance(params.sessionKey) : void 0;
	let foregroundTransferred = false;
	let sessionId = activeAtAdmission?.result ? activeAtAdmission.sessionId : params.sessionId;
	const resolveGatewayContext = params.adoptOperation ? getGatewayContextResolver(params.adoptOperation) : Object.hasOwn(params, "resolveGatewayContext") ? params.resolveGatewayContext : getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	let expectedSessionId = params.expectedSessionId;
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	let recoveryDispatchOutcome;
	const rotations = createReplyTurnRotationEvidence({
		sessionKey: params.sessionKey,
		expectedActiveOperations: params.expectedActiveOperations,
		activeAtAdmission
	});
	const waitTimeoutMs = params.waitTimeoutMs ?? (params.kind === "queued_followup" ? 15e3 : void 0);
	let admittedDatabaseClaim;
	let owned = false;
	const assertDatabaseOwnerCurrent = (nextClaim) => {
		if (admittedDatabaseClaim && (!admittedDatabaseClaim.isCurrent() || nextClaim && nextClaim.incarnation !== admittedDatabaseClaim.incarnation)) {
			nextClaim?.release();
			rejectLifecycleInvalidatedWork({
				kind: params.kind,
				message: `Session store for "${params.sessionKey}" changed while starting work. Retry.`,
				transientSessionChange: true
			});
		}
	};
	const assertRecoveryOwnerCurrent = (recoveryRuntime, action) => {
		assertDatabaseOwnerCurrent();
		if (lifecycleGeneration !== getAgentEventLifecycleGeneration() || resolveGatewayContext?.()?.recoveryRuntime !== recoveryRuntime) rejectLifecycleInvalidatedWork({
			kind: params.kind,
			message: `Session "${params.sessionKey}" changed while ${action} recovery. Retry.`,
			transientSessionChange: true
		});
	};
	const waitForRecovery = async (ownerRelease) => {
		const recoveryRuntime = resolveGatewayContext?.()?.recoveryRuntime;
		await waitForRestartRecoveryProgress({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			ownerRelease,
			signal: params.upstreamAbortSignal
		});
		assertRecoveryOwnerCurrent(recoveryRuntime, "waiting for");
	};
	try {
		while (true) {
			if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
				status: "skipped",
				reason: "aborted"
			};
			const storelessRotation = !params.storePath ? rotations.takeStorelessRotation() : void 0;
			if (storelessRotation) {
				if (expectedSessionId && !storelessRotation.sessionIds.has(expectedSessionId)) return {
					status: "skipped",
					reason: "lifecycle-invalidated"
				};
				sessionId = storelessRotation.sessionId;
				expectedSessionId = expectedSessionId ? storelessRotation.sessionId : void 0;
			}
			if (isReplyRunSuccessorAdmissionBlocked(params.sessionKey)) {
				if (params.kind === "heartbeat") return {
					status: "skipped",
					reason: "active-run"
				};
				const successorAdmission = await waitForReplyRunSuccessorAdmission(params.sessionKey, params.kind === "visible" ? null : waitTimeoutMs, { signal: params.upstreamAbortSignal });
				if (!successorAdmission.settled) return {
					status: "skipped",
					reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run"
				};
				rotations.recordBarrierSources(successorAdmission.sources);
				continue;
			}
			try {
				const storePath = params.storePath;
				let operation;
				let admittedSessionEntry;
				let recoveryOwnerLease;
				let interruptedBeforeOperation = false;
				const admission = storePath ? await beginSessionWorkAdmission({
					scope: storePath,
					resolveGatewayContext,
					identities: [params.sessionKey],
					signal: params.upstreamAbortSignal,
					onInterrupt: () => {
						interruptedBeforeOperation = true;
						operation?.abortForRestart();
						params.onLifecycleInterrupt?.();
					},
					assertAllowed: () => {
						assertDatabaseOwnerCurrent();
						const current = loadSessionEntryForAdmission({
							agentId: params.agentId,
							storePath,
							sessionKey: params.sessionKey,
							readConsistency: "latest"
						});
						assertDatabaseOwnerCurrent(current.databaseClaim);
						admittedDatabaseClaim?.release();
						admittedDatabaseClaim = current.databaseClaim;
						const currentEntry = current.entry;
						admittedSessionEntry = currentEntry;
						if (expectedSessionId && !currentEntry) rejectLifecycleInvalidatedWork({
							kind: params.kind,
							message: `Session "${params.sessionKey}" was deleted while starting work. Retry.`,
							transientSessionChange: true
						});
						const activeOperationRotatedExpectedSession = rotations.hasExpectedSessionRotation({
							expectedSessionId,
							sessionId: currentEntry?.sessionId,
							databaseIdentity: admittedDatabaseClaim?.identity
						});
						if (expectedSessionId && currentEntry?.sessionId !== expectedSessionId && !activeOperationRotatedExpectedSession) rejectLifecycleInvalidatedWork({
							kind: params.kind,
							message: `Session "${params.sessionKey}" changed while starting work. Retry.`,
							transientSessionChange: true
						});
						if (activeOperationRotatedExpectedSession) expectedSessionId = currentEntry?.sessionId;
						const archivedSessionError = resolveSessionWorkStartError(params.sessionKey || sessionId, currentEntry, {
							providerReviewAcknowledgment: params.providerReviewAcknowledgment,
							allowRestartTombstoneReplacement: params.resetTriggered && params.allowRestartTombstoneReset === true || params.allowRestartTombstoneParentFork === true
						});
						if (archivedSessionError) {
							const tombstone = currentEntry?.mainRestartRecovery?.tombstone;
							if (params.kind === "visible" && tombstone) log.warn(`${archivedSessionError} Recovery reason: ${tombstone.reason}`);
							rejectLifecycleInvalidatedWork({
								kind: params.kind,
								message: archivedSessionError,
								restartRecoveryTombstone: isRestartRecoveryTombstone(currentEntry)
							});
						}
						sessionId = currentEntry?.sessionId ?? sessionId;
					}
				}) : void 0;
				try {
					if (isReplyRunSuccessorAdmissionBlocked(params.sessionKey)) throw new ReplyRunSuccessorAdmissionBlockedError(params.sessionKey);
					const mayWaitForRecoveryOwner = storePath && !params.resetTriggered && params.allowRestartTombstoneParentFork !== true;
					const recoveryOwnerRelease = mayWaitForRecoveryOwner ? getSessionWorkAdmissionOwnerRelease({
						scope: storePath,
						identities: [params.sessionKey, sessionId],
						owner: MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER
					}) : void 0;
					const shouldClaimRecoveryOwner = mayWaitForRecoveryOwner && admittedSessionEntry && (admittedSessionEntry.status === "running" && (admittedSessionEntry.abortedLastRun === true || params.kind !== "heartbeat" && admittedSessionEntry.restartRecoveryRuns !== void 0) || admittedSessionEntry.mainRestartRecovery?.tombstone !== void 0) && isMainRestartRecoveryCandidate(admittedSessionEntry, params.sessionKey);
					const gatewayContext = resolveGatewayContext?.();
					const recoveryRuntime = gatewayContext?.recoveryRuntime;
					if (recoveryOwnerRelease && (params.kind !== "visible" || admittedSessionEntry?.abortedLastRun === true)) {
						admission?.release();
						if (params.kind === "heartbeat") return {
							status: "skipped",
							reason: "active-run"
						};
						await (params.kind === "visible" ? waitForRecovery(recoveryOwnerRelease) : racePromiseWithAbortSignal(recoveryOwnerRelease, params.upstreamAbortSignal));
						continue;
					}
					if (shouldClaimRecoveryOwner && recoveryOwnerRelease === void 0 && admittedSessionEntry?.abortedLastRun === true && !admittedSessionEntry.mainRestartRecovery?.tombstone && params.kind !== "heartbeat" && gatewayContext && recoveryRuntime) {
						admission?.release();
						if (recoveryDispatchOutcome) {
							if (params.kind === "queued_followup") return {
								status: "skipped",
								reason: "active-run"
							};
							if (recoveryDispatchOutcome === "failed") throw new Error(`Restart recovery failed: ${params.sessionKey}. See Gateway logs.`);
							await waitForRecovery();
							recoveryDispatchOutcome = void 0;
							continue;
						}
						const { retryRestartAbortedMainSessionRecovery } = await import("./main-session-restart-recovery-x2BD6vuX.mjs");
						assertRecoveryOwnerCurrent(recoveryRuntime, "starting");
						params.upstreamAbortSignal?.throwIfAborted();
						const recovery = await retryRestartAbortedMainSessionRecovery({
							agentId: params.agentId,
							cfg: gatewayContext.getRuntimeConfig(),
							expectedSessionId: sessionId,
							expectedRecoveryRunId: admittedSessionEntry.restartRecoveryDeliveryRunId,
							expectedRecoverySourceRunId: admittedSessionEntry.restartRecoveryDeliverySourceRunId,
							gatewayRuntime: recoveryRuntime,
							sessionKey: params.sessionKey,
							storePath
						});
						assertRecoveryOwnerCurrent(recoveryRuntime, "starting");
						recoveryDispatchOutcome = recovery.failed > 0 ? "failed" : "deferred";
						continue;
					}
					if (shouldClaimRecoveryOwner && recoveryOwnerRelease === void 0) {
						const ownerClaim = await claimMainSessionRecoveryOwner({
							lifecycleGeneration: getAgentEventLifecycleGeneration(),
							sessionId,
							target: {
								agentId: params.agentId,
								sessionKey: params.sessionKey,
								storePath
							}
						});
						if (ownerClaim.kind === "invalidated") rejectLifecycleInvalidatedWork({
							kind: params.kind,
							message: `Session "${params.sessionKey}" changed while starting work. Retry.`,
							transientSessionChange: true
						});
						recoveryOwnerLease = ownerClaim.kind === "claimed" ? ownerClaim.lease : void 0;
					}
					if (interruptedBeforeOperation || isAbortSignalAborted(params.upstreamAbortSignal)) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: `Session "${params.sessionKey}" changed while starting work. Retry.`,
						transientSessionChange: true
					});
					assertDatabaseOwnerCurrent();
					if (params.adoptOperation) {
						params.adoptOperation.updateSessionKey(params.sessionKey, params.agentId);
						operation = params.adoptOperation;
					} else {
						operation = createReplyOperation({
							sessionKey: params.sessionKey,
							sessionId,
							agentId: params.agentId,
							turnKind: params.kind,
							resetTriggered: params.resetTriggered,
							routeThreadId: params.routeThreadId,
							originatingLeafEntryId: params.originatingLeafEntryId,
							upstreamAbortSignal: params.upstreamAbortSignal,
							respectFollowupAdmissionBarrier: params.kind === "queued_followup" || params.kind === "heartbeat"
						});
						bindGatewayContextResolver(operation, resolveGatewayContext);
					}
				} catch (error) {
					const pendingRecovery = recoveryOwnerLease ? await releaseReplyRecoveryOwner(recoveryOwnerLease) : void 0;
					if (error instanceof ReplyRunAlreadyActiveError && admission && params.retainLifecycleAdmissionOnActive) {
						admission.released.then(() => {
							scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
						});
						return {
							status: "skipped",
							reason: "active-run",
							activeOperation: replyRunRegistry.get(params.sessionKey),
							...admittedSessionEntry ? { sessionEntry: admittedSessionEntry } : {},
							lifecycleAdmission: admission
						};
					}
					admission?.release();
					scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
					throw error;
				}
				const operationAdmission = {
					lease: admission,
					databaseIdentity: admittedDatabaseClaim?.identity
				};
				lifecycleAdmissionByOperation.set(operation, operationAdmission);
				if (admission) {
					retainReplyOperationUntilComplete(operation);
					let recoveryOwnerRelease;
					const releaseRecoveryOwner = () => recoveryOwnerRelease ??= releaseReplyRecoveryOwner(recoveryOwnerLease);
					if (recoveryOwnerLease) registerReplyOperationSuccessorBarrier({
						operation,
						sessionId: recoveryOwnerLease.sessionId,
						sessionKeys: [params.sessionKey, recoveryOwnerLease.sessionKey],
						start: releaseRecoveryOwner
					});
					runAfterReplyOperationClear(operation, () => {
						operationAdmission.lease = void 0;
						releaseRecoveryOwner().then((pendingTarget) => {
							admission.release();
							scheduleMainSessionRecoveryPendingTarget(pendingTarget);
						});
					});
				}
				const databaseClaim = admittedDatabaseClaim;
				if (databaseClaim) runAfterReplyOperationClear(operation, databaseClaim.release);
				if (releaseForeground) {
					foregroundTransferred = true;
					runAfterReplyOperationClear(operation, releaseForeground);
				}
				owned = true;
				return {
					status: "owned",
					operation,
					databaseClaim,
					...admittedSessionEntry ? { sessionEntry: admittedSessionEntry } : {}
				};
			} catch (error) {
				if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
					status: "skipped",
					reason: "aborted"
				};
				if (error instanceof QueuedFollowupLifecycleInvalidatedError) return {
					status: "skipped",
					reason: "lifecycle-invalidated"
				};
				if (error instanceof ReplyRunSuccessorAdmissionBlockedError) {
					if (params.kind === "heartbeat") return {
						status: "skipped",
						reason: "active-run"
					};
					continue;
				}
				if (error instanceof ReplyRunFollowupAdmissionBlockedError) {
					if (params.kind === "heartbeat") return {
						status: "skipped",
						reason: "active-run"
					};
					const followupAdmission = await waitForReplyRunFollowupAdmission(params.sessionKey, waitTimeoutMs ?? 15e3, { signal: params.upstreamAbortSignal });
					if (!followupAdmission.settled) return {
						status: "skipped",
						reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run"
					};
					rotations.recordBarrierSources(followupAdmission.sources);
					continue;
				}
				if (!(error instanceof ReplyRunAlreadyActiveError)) throw error;
				const activeOperation = replyRunRegistry.get(params.sessionKey);
				if (params.kind === "visible" && activeOperation?.turnKind === "heartbeat") activeOperation.supersede();
				if (params.kind === "visible" && expireVisibleStaleOperation(activeOperation)) continue;
				if (params.kind === "heartbeat") return {
					status: "skipped",
					reason: "active-run",
					activeOperation
				};
				if (params.waitForActive === false) return {
					status: "skipped",
					reason: "active-run",
					activeOperation
				};
				const activeWaitTimeoutMs = params.kind === "visible" ? resolveVisibleActiveWaitMs(activeOperation) : waitTimeoutMs;
				const activeDatabaseIdentity = activeOperation ? lifecycleAdmissionByOperation.get(activeOperation)?.databaseIdentity : void 0;
				if (!await replyRunRegistry.waitForIdle(params.sessionKey, activeWaitTimeoutMs, { signal: params.upstreamAbortSignal })) {
					if (params.kind === "visible" && !isAbortSignalAborted(params.upstreamAbortSignal)) {
						expireVisibleStaleOperation(replyRunRegistry.get(params.sessionKey) ?? activeOperation);
						continue;
					}
					return {
						status: "skipped",
						reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
						activeOperation
					};
				}
				if (activeOperation) rotations.recordCompletedOperation(activeOperation, activeDatabaseIdentity);
			}
		}
	} finally {
		if (!foregroundTransferred) releaseForeground?.();
		if (!owned) admittedDatabaseClaim?.release();
	}
}
/** Resolves the default turn kind from reply options. */
function resolveReplyTurnKind(opts) {
	return opts?.isHeartbeat === true ? "heartbeat" : "visible";
}
//#endregion
//#region src/auto-reply/reply/reply-timing-tracker.ts
/** Checks config/env diagnostic flags for reply profiling. */
function isReplyProfilerEnabled(params) {
	const cfg = params?.config;
	const env = params?.env ?? process.env;
	return isDiagnosticFlagEnabled("profiler", cfg, env) || isDiagnosticFlagEnabled("reply.profiler", cfg, env);
}
/** Keeps slow replies diagnosable; profiling lowers the warning thresholds. */
function createReplyTimingTracker(params) {
	const profilerEnabled = params.enabled ?? isReplyProfilerEnabled({
		config: params.config,
		env: params.env
	});
	const timing = createStageTimingTracker();
	let didLog = false;
	const totalWarnMs = params.totalWarnMs ?? (profilerEnabled ? 1e3 : 1e4);
	const stageWarnMs = params.stageWarnMs ?? (profilerEnabled ? 500 : 5e3);
	return {
		measure: timing.measure,
		measureSync: timing.measureSync,
		logIfSlow(logParams, options) {
			if (didLog && !options?.repeat) return;
			const { totalMs, stages: spans } = timing.snapshot();
			const summary = {
				totalMs,
				spans
			};
			if (summary.totalMs < totalWarnMs && !summary.spans.some((span) => span.durationMs >= stageWarnMs)) return;
			if (!options?.repeat) didLog = true;
			const formattedSpans = formatStageTimings(summary.spans);
			if (params.formatMessage) {
				const detailParams = logParams;
				const details = Object.fromEntries((params.detailKeys?.(logParams) ?? []).map((key) => [key, detailParams[key]]));
				params.log.warn(params.formatMessage(logParams, summary, formattedSpans), {
					...details,
					totalMs: summary.totalMs,
					spans: summary.spans
				});
				return;
			}
			const defaults = logParams;
			const suffix = [
				`totalMs=${summary.totalMs}`,
				`stages=${formattedSpans}`,
				defaults.outcome ? `outcome=${defaults.outcome}` : void 0,
				defaults.reason ? `reason=${defaults.reason}` : void 0,
				defaults.error ? `error="${defaults.error}"` : void 0
			].filter(Boolean).join(" ");
			params.log.warn(`${defaults.message} ${suffix}`, {
				...defaults.details,
				outcome: defaults.outcome,
				reason: defaults.reason,
				error: defaults.error,
				totalMs: summary.totalMs,
				spans: summary.spans
			});
		}
	};
}
//#endregion
//#region src/auto-reply/reply/session-entry-handle.ts
var ReplySessionGenerationInvalidatedError = class extends Error {};
function createReplySessionEntryHandle(params) {
	const { generationFence, sessionKey, sessionStore } = params;
	const entries = sessionStore ?? {};
	let ownedSessionId = generationFence?.sessionId;
	let ownedLifecycleRevision = params.sessionEntry && params.sessionEntry.sessionId === ownedSessionId ? params.sessionEntry.lifecycleRevision : void 0;
	const matchesGeneration = (entry) => entry !== void 0 && (!generationFence || entry.sessionId === ownedSessionId && entry.lifecycleRevision === ownedLifecycleRevision);
	let currentEntry = matchesGeneration(params.sessionEntry) ? params.sessionEntry : void 0;
	if (sessionKey && currentEntry) {
		const storedEntry = entries[sessionKey];
		if (!generationFence || !sessionStore || storedEntry && (storedEntry === generationFence.expectedStoreEntry && !matchesGeneration(storedEntry) || matchesGeneration(storedEntry) && currentEntry.updatedAt >= storedEntry.updatedAt)) entries[sessionKey] = currentEntry;
	}
	const current = () => {
		const storedEntry = sessionKey ? entries[sessionKey] : void 0;
		if (generationFence && matchesGeneration(storedEntry) && (!currentEntry || storedEntry.updatedAt >= currentEntry.updatedAt)) currentEntry = storedEntry;
		return currentEntry;
	};
	const replaceCurrent = (entry, adopt = false) => {
		if (!generationFence) {
			currentEntry = entry;
			if (sessionKey) entries[sessionKey] = entry;
			return;
		}
		const storedEntry = sessionKey ? entries[sessionKey] : void 0;
		const storedMatchesOwned = matchesGeneration(storedEntry);
		let nextEntry = entry;
		if (adopt) {
			const storedMatchesAdopted = Boolean(storedEntry && storedEntry.sessionId === entry.sessionId && storedEntry.lifecycleRevision === entry.lifecycleRevision);
			if (sessionStore && sessionKey && !storedEntry && generationFence.expectedStoreEntry || storedEntry && !storedMatchesOwned && !storedMatchesAdopted) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation was replaced during admission");
			if (storedMatchesAdopted && storedEntry && storedEntry.updatedAt >= entry.updatedAt) nextEntry = storedEntry;
			ownedSessionId = nextEntry.sessionId;
			ownedLifecycleRevision = nextEntry.lifecycleRevision;
		} else if (!matchesGeneration(nextEntry)) return;
		if (adopt || !currentEntry || nextEntry.updatedAt >= currentEntry.updatedAt) currentEntry = nextEntry;
		if (sessionKey && (adopt ? !storedEntry || storedMatchesOwned || nextEntry !== storedEntry : !storedEntry && !generationFence.expectedStoreEntry || storedMatchesOwned && storedEntry && nextEntry.updatedAt >= storedEntry.updatedAt)) entries[sessionKey] = nextEntry;
	};
	const handle = {
		adoptCurrent: (entry) => replaceCurrent(entry, true),
		clearCurrent: () => {
			currentEntry = void 0;
			if (sessionKey && (!generationFence || matchesGeneration(entries[sessionKey]))) delete entries[sessionKey];
		},
		get: (key) => entries[key],
		getCurrent: current,
		patchCurrent: (patch) => {
			if (currentEntry) replaceCurrent({
				...currentEntry,
				...patch
			});
			return currentEntry;
		},
		replaceCurrent,
		set: (key, entry) => {
			if (key === sessionKey) replaceCurrent(entry);
			else entries[key] = entry;
		},
		toCompatSessionStore: () => {
			if (!generationFence || !sessionKey) return entries;
			const view = {
				...entries,
				...currentEntry ? { [sessionKey]: currentEntry } : {}
			};
			return new Proxy(view, {
				get: (target, key) => key === sessionKey ? current() : Reflect.get(target, key),
				set(target, key, entry) {
					if (key !== sessionKey) return Reflect.set(target, key, entry);
					if (!entry) handle.clearCurrent();
					else replaceCurrent(entry, !matchesGeneration(entry));
					return true;
				},
				deleteProperty(target, key) {
					if (key !== sessionKey) return Reflect.deleteProperty(target, key);
					handle.clearCurrent();
					return true;
				}
			});
		}
	};
	return handle;
}
//#endregion
//#region src/auto-reply/reply/get-reply.types.ts
/** Pin the host-issued source before public options cross asynchronous preparation. */
function prepareInternalGetReplyOptions(opts) {
	if (!opts) return;
	const { operatorAuthority, ...options } = opts;
	if (operatorAuthority !== void 0) {
		assertAdmittedRunOperatorAuthority(operatorAuthority);
		operatorAuthority.assertCurrent();
	}
	return {
		...options,
		operatorAuthority
	};
}
function withExtractedFileImages(opts, extractedFileImages) {
	if (!extractedFileImages || extractedFileImages.length === 0) return opts;
	return {
		...opts,
		extractedFileImages: [...opts?.extractedFileImages ?? [], ...extractedFileImages]
	};
}
function shouldBridgeCliPreambleEvents(opts) {
	return opts?.commentaryProgressEnabled === true || opts?.progressPreambleEnabled === true;
}
//#endregion
export { createReplySessionEntryHandle as a, admitReplyTurn as c, ReplySessionGenerationInvalidatedError as i, resolveReplyTurnKind as l, shouldBridgeCliPreambleEvents as n, createReplyTimingTracker as o, withExtractedFileImages as r, isReplyProfilerEnabled as s, prepareInternalGetReplyOptions as t, runWithReplyOperationLifecycleAdmission as u };
