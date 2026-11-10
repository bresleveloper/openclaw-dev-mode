import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as withPluginRuntimeGatewayContextResolver, f as bindGatewayContextResolver, g as getGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { d as getAgentEventLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { i as resolveSessionWorkStartBlock, r as isRestartRecoveryTombstone } from "./session-work-start-Sz_vqYld.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as SessionWorkStartChangedError, r as SessionRestartRecoveryTombstoneError, t as SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE } from "./work-start-error-BI-UhSB2.mjs";
import { v as hasMainSessionRecoveryClaim, x as isMainRestartRecoveryCandidate } from "./store-maintenance-BqMt1Twc.mjs";
import { n as beginSessionWorkAdmission, p as getSessionWorkAdmissionOwnerRelease } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { _ as loadSessionEntryForAdmission } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { D as lifecycleAdmissionByOperation, E as isReplyRunSuccessorAdmissionBlocked, F as registerReplyOperationSuccessorBarrier, H as retainReplyOperationUntilComplete, V as resolveVisibleActiveWaitMs, W as runAfterReplyOperationClear, f as expireVisibleStaleOperation, h as getAttachedBackend, it as ReplyRunSuccessorAdmissionBlockedError, k as mergeReplyRunAdmissionSource, nt as ReplyRunAlreadyActiveError, rt as ReplyRunFollowupAdmissionBlockedError, v as hasCommittedReplyOperationOutcome, x as isReplyOperationAbortedForRestart } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { C as waitForReplyRunFollowupAdmission, T as createReplyOperation, g as replyRunRegistry, w as waitForReplyRunSuccessorAdmission } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { t as DEFAULT_RECOVERY_DELAY_MS } from "./main-session-restart-recovery-shared-Bt471B3R.mjs";
import { n as COMMAND_ADMISSION_OWNER, t as REPLY_WORK_ADMISSION_OWNER } from "./reply-turn-admission-owner-Ux12PTb_.mjs";
import { t as MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER } from "./main-session-recovery-admission-Chw1atkI.mjs";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CIfq4_tj.mjs";
import { a as releaseMainSessionRecoveryOwner, t as claimMainSessionRecoveryOwner } from "./main-session-recovery-store-mxhMsBp9.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-CAtNkN-G.mjs";
import { t as captureAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
import { n as formatStageTimings, t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { addAbortListener } from "node:events";
//#region src/auto-reply/reply/reply-turn-database-admission.ts
/** Bind the original database borrow to the operation and join lifecycle handoffs on release. */
function bindReplyOperationDatabaseAdmission(readerOperation, params, lease, databaseClaim) {
	let handoff;
	let releasing;
	let sessionActor;
	const assertReaderOperation = () => {
		readerOperation.abortSignal.throwIfAborted();
		if (releasing) params.workSignal?.throwIfAborted();
		if (releasing || readerOperation.key !== params.sessionKey) throw new SessionWorkStartChangedError("Session reader operation is no longer current. Retry the turn.");
	};
	const assertTransitionActive = () => {
		assertReaderOperation();
		if (readerOperation.result) throw new SessionWorkStartChangedError("Reply transition is no longer active");
	};
	const releaseSessionActor = async () => {
		const pending = sessionActor;
		const installed = operationAdmission.sessionActor;
		sessionActor = void 0;
		operationAdmission.sessionActor = void 0;
		if (installed) {
			await installed.release();
			return;
		}
		await (await pending?.catch(() => void 0))?.release();
	};
	const operationAdmission = {
		lease,
		databaseIdentity: databaseClaim?.identity,
		databaseClaim,
		reader: databaseClaim && "kind" in databaseClaim ? databaseClaim.reader : void 0,
		sessionTarget: databaseClaim && "kind" in databaseClaim ? databaseClaim.target : void 0,
		resolveReader() {
			operationAdmission.reader?.assertCurrent();
			return operationAdmission.reader;
		},
		resolveSessionTarget() {
			assertReaderOperation();
			operationAdmission.databaseClaim?.assertCurrent();
			return operationAdmission.sessionTarget;
		},
		acquireSessionActor() {
			assertReaderOperation();
			if (handoff) throw new SessionWorkStartChangedError("Session actor admission is changing");
			const claim = operationAdmission.databaseClaim;
			if (!claim || !("kind" in claim)) throw new Error("Reply operation has no session actor admission");
			sessionActor ??= claim.acquireSessionActor({
				assertCurrent: () => claim.assertCurrent(),
				assertReadable() {
					assertReaderOperation();
					claim.assertCurrent();
				}
			}).then(async (actor) => {
				try {
					assertReaderOperation();
					if (claim !== operationAdmission.databaseClaim) throw new SessionWorkStartChangedError("Session actor admission changed");
					operationAdmission.sessionActor = actor;
					return actor;
				} catch (error) {
					await actor?.release();
					throw error;
				}
			});
			return sessionActor;
		},
		async afterTransition(transition) {
			assertTransitionActive();
			const current = operationAdmission.databaseClaim;
			const prepare = current && "kind" in current ? current.afterTransition?.bind(current) : void 0;
			if (!current || !prepare) return;
			handoff = (async () => {
				const next = await prepare(transition, assertTransitionActive);
				if (releasing) {
					await next.release();
					assertReaderOperation();
				}
				operationAdmission.databaseClaim = next;
				operationAdmission.reader = next.reader;
				operationAdmission.sessionTarget = next.target;
				try {
					await releaseSessionActor();
				} finally {
					await current.release();
				}
				assertTransitionActive();
			})();
			try {
				await handoff;
			} finally {
				handoff = void 0;
			}
		}
	};
	lifecycleAdmissionByOperation.set(readerOperation, operationAdmission);
	return {
		operationAdmission,
		releaseWorkerDatabaseClaim: databaseClaim && "kind" in databaseClaim ? () => {
			if (!releasing) {
				const actorSettlement = sessionActor ? releaseSessionActor() : void 0;
				const settlement = actorSettlement ? void 0 : operationAdmission.databaseClaim?.release();
				releasing = (async () => {
					await Promise.allSettled([
						handoff,
						settlement,
						actorSettlement
					]);
					if (settlement) await settlement;
					else try {
						await actorSettlement;
					} finally {
						await operationAdmission.databaseClaim?.release();
					}
				})();
			}
			return releasing;
		} : void 0
	};
}
//#endregion
//#region src/auto-reply/reply/reply-turn-recovery-wait.ts
async function waitForRestartRecoveryProgress(params) {
	const changed = createDeferredCore();
	const unsubscribe = sessionChanges.subscribe((change) => {
		if ("all" in change || change.sessionKey === params.sessionKey && (!params.agentId || !change.agentId || change.agentId === params.agentId)) changed.resolve();
	});
	try {
		await raceWithTimeout(params.ownerRelease ? Promise.race([changed.promise, params.ownerRelease]) : changed.promise, DEFAULT_RECOVERY_DELAY_MS, () => void 0, {
			ref: false,
			signal: params.signal
		});
	} finally {
		unsubscribe();
	}
}
//#endregion
//#region src/auto-reply/reply/reply-turn-rotation.ts
/** Retains invocation-local lineage evidence; the admission owner decides whether work may start. */
function createReplyTurnRotationEvidence(params) {
	const waitedRotations = /* @__PURE__ */ new Map();
	const isCurrent = (source) => !isReplyOperationAbortedForRestart(source.operation) && (source.fromBarrier || lifecycleAdmissionByOperation.get(source.operation)?.databaseIdentity === source.databaseIdentity && source.operation.key === params.sessionKey && (source.operation === replyRunRegistry.get(params.sessionKey) || source.operation.result !== null));
	const mergeWaitedRotation = (source) => {
		const previous = waitedRotations.get(source.databaseIdentity);
		return mergeReplyRunAdmissionSource(source, previous && isCurrent(previous) ? {
			...previous,
			sessionIds: new Set(previous.sessionIds)
		} : void 0);
	};
	const recordSources = (sources, fromBarrier) => {
		for (const source of sources) waitedRotations.set(source.databaseIdentity, mergeWaitedRotation({
			...source,
			sessionIds: new Set(source.sessionIds),
			fromBarrier
		}));
	};
	const recordCompletedOperation = (operation, databaseIdentity) => {
		if (lifecycleAdmissionByOperation.get(operation)?.databaseIdentity !== databaseIdentity) return;
		waitedRotations.set(databaseIdentity, mergeWaitedRotation({
			operation,
			sessionId: operation.sessionId,
			sessionIds: operation.captureOwnedSessionIds(),
			databaseIdentity,
			fromBarrier: false
		}));
	};
	return {
		recordBarrierSources(sources = []) {
			recordSources(sources, true);
		},
		observeAdmission() {
			const initialOperation = replyRunRegistry.get(params.sessionKey);
			const recordCompletions = () => {
				if (initialOperation?.result) recordCompletedOperation(initialOperation, lifecycleAdmissionByOperation.get(initialOperation)?.databaseIdentity);
			};
			return {
				recordCompletions,
				changed: () => initialOperation !== replyRunRegistry.get(params.sessionKey),
				dispose: recordCompletions
			};
		},
		recordCompletedOperation,
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
var ReplyOperationChangedDuringAdmissionError = class extends Error {};
const log = createSubsystemLogger("auto-reply/reply-turn-admission");
async function releaseReplyRecoveryOwner(lease) {
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
		const error = new QueuedFollowupLifecycleInvalidatedError(params.message, { cause: params.error });
		if (params.restartRecoveryTombstone === true) Object.assign(error, { code: SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE });
		throw error;
	}
	if (params.restartRecoveryTombstone === true) throw new SessionRestartRecoveryTombstoneError(params.message);
	if (params.kind === "visible" && params.transientSessionChange === true) throw new SessionWorkStartChangedError(params.message);
	throw params.error ?? new Error(params.message);
}
/** Waits for or claims the per-session reply run slot. */
async function admitReplyTurn(params) {
	const workspaceReadiness = captureAgentWorkspaceReadiness(params.sessionKey);
	const workSignal = getAsyncWorkSignal();
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
	let discardedDatabaseClaimRelease;
	let owned = false;
	let admitting = true;
	function rejectSessionChange(message = `Session "${params.sessionKey}" changed while starting work. Retry.`) {
		rejectLifecycleInvalidatedWork({
			kind: params.kind,
			message,
			transientSessionChange: true
		});
	}
	const assertDatabaseOwnerCurrent = (nextClaim) => {
		if (admittedDatabaseClaim && (!admittedDatabaseClaim.isCurrent() || nextClaim && nextClaim.incarnation !== admittedDatabaseClaim.incarnation)) {
			const release = nextClaim?.release();
			if (release) {
				discardedDatabaseClaimRelease = release;
				release.catch(() => {});
			}
			rejectSessionChange(`Session store for "${params.sessionKey}" changed while starting work. Retry.`);
		}
	};
	const assertRecoveryOwnerCurrent = (recoveryRuntime, action) => {
		assertDatabaseOwnerCurrent();
		if (lifecycleGeneration !== getAgentEventLifecycleGeneration() || resolveGatewayContext?.()?.recoveryRuntime !== recoveryRuntime) rejectSessionChange(`Session "${params.sessionKey}" changed while ${action} recovery. Retry.`);
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
			if (params.upstreamAbortSignal?.aborted) return {
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
					reason: params.upstreamAbortSignal?.aborted ? "aborted" : "active-run"
				};
				rotations.recordBarrierSources(successorAdmission.sources);
				continue;
			}
			const rotationObservation = params.storePath ? rotations.observeAdmission() : void 0;
			try {
				const storePath = params.storePath;
				let operation;
				let admittedSessionEntry;
				let recoveryOwnerLease;
				let interruptedBeforeOperation = false;
				let recoveryClaimStarted = false;
				const admission = storePath ? await beginSessionWorkAdmission({
					agentId: params.agentId,
					owner: REPLY_WORK_ADMISSION_OWNER,
					scope: storePath,
					isSettling: () => operation !== void 0 && (operation.result !== null || hasCommittedReplyOperationOutcome(operation)),
					getAbortReason: () => operation?.abortSignal.reason,
					resolveGatewayContext,
					identities: [params.sessionKey],
					storeWriterIdentities: parseAgentSessionKey(params.sessionKey) && normalizeStoreSessionKey(params.sessionKey) === params.sessionKey ? [params.sessionKey] : void 0,
					signal: params.upstreamAbortSignal,
					onInterrupt: (reason) => {
						interruptedBeforeOperation = true;
						if (isAgentRunRestartAbortReason(reason)) operation?.abortForRestart();
						else operation?.abortByUser();
						params.onLifecycleInterrupt?.();
					},
					assertAllowed: async (signal) => {
						assertDatabaseOwnerCurrent();
						const assertCurrent = () => {
							params.assertRequestCurrent?.();
							workspaceReadiness?.assertCurrent();
							assertDatabaseOwnerCurrent();
							if (!admitting || interruptedBeforeOperation || lifecycleGeneration !== getAgentEventLifecycleGeneration()) throw new SessionWorkStartChangedError("Session changed while waiting for state admission.");
						};
						const current = await loadSessionEntryForAdmission({
							agentId: params.agentId,
							storePath,
							sessionKey: params.sessionKey,
							readConsistency: "latest"
						}, {
							signal,
							assertCurrent,
							onRegistryChange: params.onDatabaseRegistration
						});
						try {
							if (!admitting || interruptedBeforeOperation || params.upstreamAbortSignal?.aborted) throw new SessionWorkStartChangedError("Session changed during state admission.");
							params.assertRequestCurrent?.();
						} catch (error) {
							await current.databaseClaim.release();
							throw error;
						}
						assertDatabaseOwnerCurrent(current.databaseClaim);
						const previousDatabaseClaim = admittedDatabaseClaim;
						admittedDatabaseClaim = current.databaseClaim;
						await previousDatabaseClaim?.release();
						signal.throwIfAborted();
						assertCurrent();
						const currentEntry = current.entry;
						admittedSessionEntry = currentEntry;
						if (expectedSessionId && !currentEntry) rejectSessionChange(`Session "${params.sessionKey}" was deleted while starting work. Retry.`);
						rotationObservation?.recordCompletions();
						const activeOperationRotatedExpectedSession = rotations.hasExpectedSessionRotation({
							expectedSessionId,
							sessionId: currentEntry?.sessionId,
							databaseIdentity: admittedDatabaseClaim?.identity
						});
						if (expectedSessionId && currentEntry?.sessionId !== expectedSessionId && !activeOperationRotatedExpectedSession) rejectSessionChange();
						if (activeOperationRotatedExpectedSession) expectedSessionId = currentEntry?.sessionId;
						const archivedSessionError = resolveSessionWorkStartBlock(params.sessionKey || sessionId, currentEntry, {
							allowPendingWorkspace: workspaceReadiness ? true : void 0,
							providerReviewAcknowledgment: params.providerReviewAcknowledgment,
							allowRestartTombstoneReplacement: params.resetTriggered && params.allowRestartTombstoneReset === true || params.allowRestartTombstoneParentFork === true
						});
						if (archivedSessionError) {
							const tombstone = currentEntry?.mainRestartRecovery?.tombstone;
							if (params.kind === "visible" && tombstone) log.warn(`${archivedSessionError.message} Recovery reason: ${tombstone.reason}`);
							rejectLifecycleInvalidatedWork({
								kind: params.kind,
								message: archivedSessionError.message,
								error: archivedSessionError,
								restartRecoveryTombstone: isRestartRecoveryTombstone(currentEntry)
							});
						}
						sessionId = currentEntry?.sessionId ?? sessionId;
						params.captureRunSelection?.();
					}
				}) : void 0;
				try {
					if (isReplyRunSuccessorAdmissionBlocked(params.sessionKey)) throw new ReplyRunSuccessorAdmissionBlockedError(params.sessionKey);
					const commandOwnerRelease = params.kind === "queued_followup" && storePath && !replyRunRegistry.get(params.sessionKey) ? getSessionWorkAdmissionOwnerRelease({
						scope: storePath,
						identities: [params.sessionKey, sessionId],
						owner: COMMAND_ADMISSION_OWNER,
						phase: "acquired"
					}) : void 0;
					if (commandOwnerRelease) {
						admission?.release();
						await racePromiseWithAbortSignal(commandOwnerRelease, params.upstreamAbortSignal);
						continue;
					}
					const mayWaitForRecoveryOwner = storePath && !params.resetTriggered && params.allowRestartTombstoneParentFork !== true;
					const recoveryOwnerRelease = mayWaitForRecoveryOwner ? getSessionWorkAdmissionOwnerRelease({
						scope: storePath,
						identities: [params.sessionKey, sessionId],
						owner: MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER
					}) : void 0;
					const shouldClaimRecoveryOwner = mayWaitForRecoveryOwner && admittedSessionEntry && (hasMainSessionRecoveryClaim(admittedSessionEntry) && admittedSessionEntry.abortedLastRun === true || params.kind !== "heartbeat" && admittedSessionEntry.restartRecoveryRuns !== void 0 && (admittedSessionEntry.mainRestartRecovery !== void 0 || !replyRunRegistry.get(params.sessionKey)) || admittedSessionEntry.mainRestartRecovery?.tombstone !== void 0) && isMainRestartRecoveryCandidate(admittedSessionEntry, params.sessionKey);
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
						const { retryRestartAbortedMainSessionRecovery } = await import("./main-session-restart-recovery-BBdP2m5e.mjs");
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
						recoveryClaimStarted = true;
						const ownerClaim = await claimMainSessionRecoveryOwner({
							lifecycleGeneration: getAgentEventLifecycleGeneration(),
							sessionId,
							target: {
								agentId: params.agentId,
								sessionKey: params.sessionKey,
								storePath
							}
						});
						if (ownerClaim.kind === "invalidated") rejectSessionChange();
						recoveryOwnerLease = ownerClaim.kind === "claimed" ? ownerClaim.lease : void 0;
						admittedSessionEntry = ownerClaim.entry;
					}
					if (interruptedBeforeOperation || params.upstreamAbortSignal?.aborted) rejectSessionChange();
					assertDatabaseOwnerCurrent();
					if (rotationObservation?.changed()) {
						if (recoveryClaimStarted) rejectSessionChange();
						throw new ReplyOperationChangedDuringAdmissionError();
					}
					if (!storePath) params.captureRunSelection?.();
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
				const { operationAdmission, releaseWorkerDatabaseClaim } = bindReplyOperationDatabaseAdmission(operation, {
					sessionKey: params.sessionKey,
					workSignal
				}, admission, admittedDatabaseClaim);
				if (releaseWorkerDatabaseClaim) {
					const admittedOperation = operation;
					let releasingForRestart = false;
					const releaseForRestart = (signal) => {
						if (releasingForRestart || !isAgentRunRestartAbortReason(signal.reason)) return;
						releasingForRestart = true;
						const runId = getAttachedBackend(admittedOperation)?.runId ?? "unbound";
						releaseWorkerDatabaseClaim().then(() => log.info(`lease released: reason=restart-abort runId=${runId} kind=reply-admission`, { sessionId }), (error) => log.warn(`failed to release restart-aborted reply database owner: ${formatErrorMessage(error)}`));
					};
					const restartReleases = [.../* @__PURE__ */ new Set([operation.abortSignal, workSignal])].flatMap((signal) => signal ? [addAbortListener(signal, () => releaseForRestart(signal))] : []);
					runAfterReplyOperationClear(operation, () => {
						for (const listener of restartReleases) listener[Symbol.dispose]();
					});
					registerReplyOperationSuccessorBarrier({
						operation,
						sessionId,
						sessionKeys: [params.sessionKey],
						start: releaseWorkerDatabaseClaim,
						deferUntilClear: true
					});
				}
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
						Promise.all([releaseRecoveryOwner(), releaseWorkerDatabaseClaim?.()]).then(([pendingTarget]) => {
							admission.release();
							scheduleMainSessionRecoveryPendingTarget(pendingTarget);
						}, (error) => {
							log.warn(`failed to release reply database owner: ${formatErrorMessage(error)}`);
						});
					});
				}
				if (admittedDatabaseClaim && !("kind" in admittedDatabaseClaim)) runAfterReplyOperationClear(operation, admittedDatabaseClaim.release);
				if (releaseForeground) {
					foregroundTransferred = true;
					runAfterReplyOperationClear(operation, releaseForeground);
				}
				owned = true;
				return {
					status: "owned",
					operation,
					databaseClaim: admittedDatabaseClaim,
					...admittedSessionEntry ? { sessionEntry: admittedSessionEntry } : {}
				};
			} catch (error) {
				if (params.upstreamAbortSignal?.aborted) return {
					status: "skipped",
					reason: "aborted"
				};
				if (error instanceof QueuedFollowupLifecycleInvalidatedError) return {
					status: "skipped",
					reason: "lifecycle-invalidated",
					error: error.cause
				};
				if (error instanceof ReplyOperationChangedDuringAdmissionError) continue;
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
						reason: params.upstreamAbortSignal?.aborted ? "aborted" : "active-run"
					};
					rotations.recordBarrierSources(followupAdmission.sources);
					continue;
				}
				if (!(error instanceof ReplyRunAlreadyActiveError)) throw error;
				const activeOperation = replyRunRegistry.get(params.sessionKey);
				if (params.kind === "visible" && activeOperation?.turnKind === "heartbeat") activeOperation.supersede();
				if (params.kind === "visible" && expireVisibleStaleOperation(activeOperation)) continue;
				if (params.kind === "heartbeat" || params.waitForActive === false) return {
					status: "skipped",
					reason: "active-run",
					activeOperation
				};
				const activeWaitTimeoutMs = params.kind === "visible" ? resolveVisibleActiveWaitMs(activeOperation) : waitTimeoutMs;
				const activeDatabaseIdentity = activeOperation ? lifecycleAdmissionByOperation.get(activeOperation)?.databaseIdentity : void 0;
				if (!await replyRunRegistry.waitForIdle(params.sessionKey, activeWaitTimeoutMs, { signal: params.upstreamAbortSignal })) {
					if (params.kind === "visible" && !params.upstreamAbortSignal?.aborted) {
						const latestActiveOperation = replyRunRegistry.get(params.sessionKey);
						expireVisibleStaleOperation(latestActiveOperation ?? activeOperation);
						continue;
					}
					return {
						status: "skipped",
						reason: params.upstreamAbortSignal?.aborted ? "aborted" : "active-run",
						activeOperation
					};
				}
				if (activeOperation) rotations.recordCompletedOperation(activeOperation, activeDatabaseIdentity);
			} finally {
				rotationObservation?.dispose();
			}
		}
	} finally {
		admitting = false;
		if (!foregroundTransferred) releaseForeground?.();
		if (!owned) try {
			await admittedDatabaseClaim?.release();
		} finally {
			await discardedDatabaseClaimRelease;
		}
	}
}
//#endregion
//#region src/auto-reply/reply/reply-timing-tracker.ts
function isReplyProfilerEnabled(params) {
	const cfg = params?.config;
	const env = params?.env ?? process.env;
	return isDiagnosticFlagEnabled("profiler", cfg, env) || isDiagnosticFlagEnabled("reply.profiler", cfg, env);
}
/** Keeps slow replies diagnosable; profiling lowers the warning thresholds. */
function createReplyTimingTracker(params) {
	const timing = createStageTimingTracker();
	let didLog = false;
	const totalWarnMs = params.enabled ? 1e3 : 1e4;
	const stageWarnMs = params.enabled ? 500 : 5e3;
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
			let message;
			let details;
			if (params.formatMessage) {
				const detailParams = logParams;
				details = Object.fromEntries((params.detailKeys?.(logParams) ?? []).map((key) => [key, detailParams[key]]));
				message = params.formatMessage(logParams, summary, formattedSpans);
			} else {
				const defaults = logParams;
				const suffix = [
					`totalMs=${summary.totalMs}`,
					`stages=${formattedSpans}`,
					defaults.outcome ? `outcome=${defaults.outcome}` : void 0,
					defaults.reason ? `reason=${defaults.reason}` : void 0,
					defaults.error ? `error="${defaults.error}"` : void 0
				].filter(Boolean).join(" ");
				message = `${defaults.message} ${suffix}`;
				details = {
					...defaults.details,
					outcome: defaults.outcome,
					reason: defaults.reason,
					error: defaults.error
				};
			}
			params.log.warn(message, {
				...details,
				...summary
			});
		}
	};
}
//#endregion
export { runWithReplyOperationLifecycleAdmission as i, isReplyProfilerEnabled as n, admitReplyTurn as r, createReplyTimingTracker as t };
