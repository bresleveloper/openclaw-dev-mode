import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { S as runExclusiveSessionLifecycleMutation, T as startSessionWorkAdmissionInterruption, o as closeSessionWorkAdmissions, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { l as isReplyOperationForSession, x as waitForReplyOperationOwnerSettlement, y as resolveReplyOperationsForSession } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { r as captureEmbeddedRunDrainTarget } from "./runs-Czr-I6_B.mjs";
import { c as prepareSessionWorkerPlacementStop, i as prepareSessionWorkerPlacementArchiveCheckAsync, l as readSessionWorkerPlacementAsync, o as prepareSessionWorkerPlacementMutationCheckAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { d as waitForChatAbortControllerRemoval } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { n as clearSessionLifecycleQueues, r as hasSessionLifecycleQueueWork } from "./cleanup-CjvcBZOl.mjs";
import { L as isCurrentWorkerWorkspacePendingResultOwner } from "./placement-row-codec-DhdW6tSs.mjs";
import "./placement-workspace-result--lykq2r1.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-Bk4Jd75M.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-cs9Qjbw9.mjs";
import { d as hasGatewaySessionAbortOwner, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-BJzZinuj.mjs";
//#region src/gateway/server-methods/sessions-lifecycle-drain.ts
var SessionLifecycleWorkspaceRecoveryError = class extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
	}
};
function hasAuthoritativeSessionWork(params, workerDrain, terminalDrains, queueTarget, embeddedRun) {
	const sessionId = params.sessionId;
	return isCompetingSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities, params.admissionAgent) || resolveReplyOperationsForSession(params).length > 0 || embeddedRun?.isActive() === true || hasSessionLifecycleQueueWork(queueTarget) || hasGatewaySessionAbortOwner(params) || Boolean(sessionId && params.context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId)?.turnClaim) || workerDrain?.hasWork() === true || terminalDrains.some((drain) => drain.hasWork());
}
/** Drain outside mutation locks; retain the closure until the final mutation owns ingress. */
async function prepareSessionLifecycleDrain(params) {
	const timeoutMs = SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS;
	const queueTarget = {
		keys: params.sessionKeys,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	};
	const workerService = params.context.workerEnvironmentService;
	let embeddedRun = params.embeddedRun ?? void 0;
	let workerDrain;
	let workerDrained;
	const terminalDrains = [];
	let reclaimed;
	let admittedWork;
	let replyRuns = [];
	let controllerTargets = [];
	let releaseAdmissions = () => {};
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		try {
			for (const drain of terminalDrains) drain.release();
		} finally {
			try {
				workerDrain?.release();
			} finally {
				releaseAdmissions();
				if (params.embeddedRun === void 0) embeddedRun?.release();
			}
		}
	};
	try {
		const prepared = await runExclusiveSessionLifecycleMutation("drain", {
			scope: params.storePath,
			identities: params.lifecycleIdentities,
			run: async () => {
				params.authorize?.();
				if (params.beforeCancel) {
					await params.beforeCancel();
					params.authorize?.();
				}
				const workerStop = await prepareSessionWorkerPlacementStop(params);
				params.authorize?.();
				params.onPrepared?.();
				releaseAdmissions = closeSessionWorkAdmissions({
					scope: params.storePath,
					identities: params.lifecycleIdentities,
					agent: params.admissionAgent,
					reason: createAgentRunDirectAbortError(),
					assertCurrent: params.authorize
				});
				params.authorize?.();
				if (params.sessionId) {
					const reservation = getWorkerInferenceSessionControl(workerService)?.reserveSessionDrain(params.sessionId);
					try {
						workerDrain = reservation?.accept();
					} catch (error) {
						try {
							reservation?.release();
						} catch (releaseError) {
							if (releaseError !== error) throw new AggregateError([error, releaseError], "Worker drain reservation failed", { cause: releaseError });
						}
						throw error;
					}
					if (workerDrain) {
						workerDrained = workerDrain.drained;
						workerDrained.catch(() => {});
						workerDrain.start(params.authorize);
					}
					params.authorize?.();
					if (params.context.terminalSessions) for (const sessionKey of /* @__PURE__ */ new Set([params.sessionKey, ...params.sessionKeys])) {
						const drain = params.context.terminalSessions.beginAgentSessionDrain({
							kind: "agent",
							agentSessionKey: sessionKey,
							agentSessionId: params.sessionId,
							agentId: params.agentId
						}, params.authorize);
						terminalDrains.push(drain);
						drain.drained.catch(() => {});
					}
				}
				if (workerStop.startBeforeDrain) {
					reclaimed = workerStop.stop();
					reclaimed.catch(() => {});
				}
				replyRuns = resolveReplyOperationsForSession(params);
				if (params.embeddedRun === void 0 && params.sessionId) embeddedRun = captureEmbeddedRunDrainTarget(params.sessionId, params);
				const cancellation = abortChatRunsForSessionKeyWithPartials({
					context: params.context,
					ops: createChatAbortOps(params.context),
					sessionKey: params.sessionKeys[0],
					sessionKeyAliases: params.sessionKeys.slice(1),
					sessionId: params.sessionId,
					session: params.session,
					agentId: params.agentId,
					defaultAgentId: params.defaultAgentId,
					abortOrigin: "rpc",
					stopReason: params.action,
					requester: { isAdmin: true },
					stopEmbeddedRun: params.embeddedRun === void 0 ? true : void 0,
					includeProtectedRuns: true,
					assertCurrent: params.authorize,
					onControllerTargets: (targets) => {
						controllerTargets = targets;
					},
					onAuthorizedBeforeEmbeddedAbort: () => {
						const cleared = clearSessionLifecycleQueues({
							...queueTarget,
							assertCurrent: () => params.authorize?.()
						});
						return cleared.followupCleared > 0 || cleared.laneCleared > 0;
					},
					onCancellationStarted: () => {
						if (params.embeddedRun !== void 0 || params.sessionKey === "global") {
							params.authorize?.();
							embeddedRun?.abort();
						}
						for (const operation of replyRuns) {
							params.authorize?.();
							if (isReplyOperationForSession(params, operation)) operation.abortByUser();
						}
					}
				});
				cancellation.catch(() => {});
				return {
					workerStop,
					cancellation
				};
			}
		});
		if ((await prepared.cancellation).unauthorized) throw new Error("Session cancellation lost ownership");
		await reclaimed;
		params.authorize?.();
		const placementService = params.context.workerSessionPlacementService;
		let placement;
		if (params.sessionId) {
			const projection = await placementService?.readProjection?.([params.sessionId], { current: true });
			const preparedPlacement = projection ? void 0 : await placementService?.prepareRuntimeRefresh?.(params.sessionId);
			let pending;
			try {
				pending = projection ? projection.pendingResults.get(params.sessionId) : preparedPlacement ? preparedPlacement.pendingResult : (await placementService?.listPendingWorkspaceResultsAsync?.(params.sessionId))?.[0];
				placement = projection ? projection.placements.get(params.sessionId) : preparedPlacement ? preparedPlacement.placement : await readSessionWorkerPlacementAsync(params);
				params.authorize?.();
				preparedPlacement?.assertCurrent();
			} finally {
				preparedPlacement?.release();
			}
			if (pending && pending.workspaceAcceptedAtMs === null && isCurrentWorkerWorkspacePendingResultOwner(placement, pending) && params.context.workerPlacementRunnerAvailabilityReader?.read(placement)?.status === "offline") {
				const details = {
					code: GatewayErrorDetailCodes.SESSION_WORKSPACE_RECOVERY_REQUIRED,
					cause: "device_offline",
					recoveryAction: "continue_on_gateway",
					sessionId: params.sessionId,
					source: {
						generation: placement.generation,
						environmentId: placement.environmentId,
						ownerEpoch: placement.activeOwnerEpoch
					}
				};
				throw new SessionLifecycleWorkspaceRecoveryError(errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.sessionKey} has an unrecovered workspace result on an offline device. Reconnect the device to preserve its workspace, or use Continue on Gateway and accept that unsynced files may be lost.`, {
					details,
					retryable: false
				}));
			}
		}
		params.authorize?.();
		admittedWork = startSessionWorkAdmissionInterruption({
			scope: params.storePath,
			identities: params.lifecycleIdentities,
			agent: params.admissionAgent,
			assertCurrent: params.authorize
		}).released;
		admittedWork.catch(() => {});
		const replyWork = Promise.all(replyRuns.map((operation) => waitForReplyOperationOwnerSettlement(operation, timeoutMs))).then((results) => results.every(Boolean));
		const embeddedWork = embeddedRun?.waitForEnd(timeoutMs) ?? Promise.resolve(true);
		const placementWork = placement?.turnClaim ? placementService?.waitForTurnClaimRelease ? placementService.waitForTurnClaimRelease(params.sessionId, { timeoutMs }).then(() => true) : Promise.resolve(false) : Promise.resolve(true);
		const waitForDrain = (work, label) => work ? withTimeout(work, timeoutMs, label).then(() => true) : Promise.resolve(true);
		const workerWork = waitForDrain(workerDrained, "worker inference lifecycle drain");
		const terminalWork = Promise.all(terminalDrains.map((drain) => waitForDrain(drain.drained, "agent terminal lifecycle drain"))).then((results) => results.every(Boolean));
		if (!(await Promise.all([
			waitForChatAbortControllerRemoval({
				entries: params.context.chatAbortControllers,
				targets: controllerTargets,
				timeoutMs
			}),
			replyWork,
			embeddedWork,
			placementWork,
			workerWork,
			terminalWork
		])).every(Boolean)) throw new Error("Session work is still active after the lifecycle drain");
		await (reclaimed ?? prepared.workerStop.stop());
		await waitForDrain(admittedWork, "session work admission lifecycle drain");
		const placementTarget = {
			context: params.context,
			sessionId: params.sessionId
		};
		const assertPlacementCurrent = params.action === "archive" ? (await prepareSessionWorkerPlacementArchiveCheckAsync(placementTarget)).assertCurrent : await prepareSessionWorkerPlacementMutationCheckAsync(placementTarget);
		return {
			handoffToMutation: () => releaseAdmissions(),
			release,
			hasAuthoritativeWork: () => {
				try {
					assertPlacementCurrent();
				} catch {
					return true;
				}
				return hasAuthoritativeSessionWork(params, workerDrain, terminalDrains, queueTarget, embeddedRun);
			}
		};
	} catch (error) {
		const settled = await Promise.allSettled([reclaimed, workerDrained]);
		const failures = /* @__PURE__ */ new Set([error, ...settled.flatMap((result) => result.status === "rejected" ? [result.reason] : [])]);
		try {
			release();
		} catch (releaseError) {
			failures.add(releaseError);
		}
		if (failures.size > 1) throw new AggregateError([...failures], "Session lifecycle and settlement failed", { cause: error });
		throw error;
	}
}
//#endregion
export { prepareSessionLifecycleDrain as n, SessionLifecycleWorkspaceRecoveryError as t };
