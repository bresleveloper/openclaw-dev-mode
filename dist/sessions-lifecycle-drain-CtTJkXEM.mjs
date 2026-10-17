import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { _ as startSessionWorkAdmissionInterruption, g as runExclusiveSessionLifecycleMutation, i as closeSessionWorkAdmissions, p as isCompetingSessionWorkAdmissionActive, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { l as isReplyOperationForSession, x as waitForReplyOperationOwnerSettlement, y as resolveReplyOperationsForSession } from "./reply-run-registry.registry-C1J6phNB.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-DGv2EKii.mjs";
import "./reply-run-registry-Beow_31i.mjs";
import { I as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, p as isEmbeddedAgentRunInProgress } from "./runs-CzCPh-gu.mjs";
import { i as prepareSessionWorkerPlacementMutationCheck, o as prepareSessionWorkerPlacementStop, r as prepareSessionWorkerPlacementArchiveCheck } from "./session-placement-lifecycle-D5GPja58.mjs";
import { S as isCurrentWorkerWorkspacePendingResultOwner } from "./placement-row-codec-DzKFQEtn.mjs";
import "./placement-workspace-result-Dw6JZ899.mjs";
import { c as waitForChatAbortControllerRemoval } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { n as clearSessionLifecycleQueues, r as hasSessionLifecycleQueueWork } from "./cleanup-BpxFFEMQ.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-h8yXQYae.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-BfEknC6Y.mjs";
import { c as hasGatewaySessionAbortOwner, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-BC_FxZrY.mjs";
//#region src/gateway/server-methods/sessions-lifecycle-drain.ts
var SessionLifecycleWorkspaceRecoveryError = class extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
	}
};
function hasAuthoritativeSessionWork(params, workerDrain, terminalDrain, queueTarget) {
	const sessionId = params.sessionId;
	return isCompetingSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities) || resolveReplyOperationsForSession(params).length > 0 || Boolean(sessionId && isEmbeddedAgentRunInProgress(sessionId)) || hasSessionLifecycleQueueWork(queueTarget) || hasGatewaySessionAbortOwner({
		context: params.context,
		sessionKeys: params.sessionKeys,
		sessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	}) || Boolean(sessionId && params.context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId)?.turnClaim) || workerDrain?.hasWork() === true || terminalDrain?.hasWork() === true;
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
	let workerDrain;
	let workerDrained;
	let terminalDrain;
	let reclaimed;
	let releaseAdmissions = () => {};
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		try {
			terminalDrain?.release();
		} finally {
			try {
				workerDrain?.release();
			} finally {
				releaseAdmissions();
			}
		}
	};
	try {
		const prepared = await runExclusiveSessionLifecycleMutation("drain", {
			scope: params.storePath,
			identities: params.lifecycleIdentities,
			run: async () => {
				params.authorize?.();
				params.beforeCancel?.();
				const workerStop = prepareSessionWorkerPlacementStop(params);
				releaseAdmissions = closeSessionWorkAdmissions({
					scope: params.storePath,
					identities: params.lifecycleIdentities,
					reason: createAgentRunDirectAbortError()
				});
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
						workerDrain.start();
					}
					terminalDrain = params.context.terminalSessions?.beginAgentSessionDrain({
						kind: "agent",
						agentSessionKey: params.sessionKey,
						agentSessionId: params.sessionId,
						agentId: params.agentId
					});
				}
				if (workerStop.startBeforeDrain) {
					reclaimed = workerStop.stop();
					reclaimed.catch(() => {});
				}
				let controllerDrain = Promise.resolve(true);
				const replyRuns = resolveReplyOperationsForSession(params);
				let lifecycleCleanupAuthorized = false;
				const cancellation = abortChatRunsForSessionKeyWithPartials({
					context: params.context,
					ops: createChatAbortOps(params.context),
					sessionKey: params.sessionKeys[0],
					sessionKeyAliases: params.sessionKeys.slice(1),
					sessionId: params.sessionId,
					agentId: params.agentId,
					defaultAgentId: params.defaultAgentId,
					abortOrigin: "rpc",
					stopReason: params.action,
					requester: { isAdmin: true },
					includeProtectedRuns: true,
					onControllerTargets: (targets) => {
						controllerDrain = waitForChatAbortControllerRemoval({
							entries: params.context.chatAbortControllers,
							targets,
							timeoutMs
						});
					},
					onAuthorizedAfterQueuedAbort: () => {
						lifecycleCleanupAuthorized = true;
						const cleared = clearSessionLifecycleQueues({
							...queueTarget,
							assertCurrent: () => params.authorize?.()
						});
						return cleared.followupCleared > 0 || cleared.laneCleared > 0;
					},
					onCancellationStarted: () => {
						if (!lifecycleCleanupAuthorized) return;
						for (const operation of replyRuns) {
							params.authorize?.();
							if (isReplyOperationForSession(params, operation)) operation.abortByUser();
						}
						if (params.sessionId) {
							params.authorize?.();
							abortEmbeddedAgentRun(params.sessionId);
						}
					}
				});
				cancellation.catch(() => {});
				return {
					workerStop,
					cancellation,
					controllerDrain,
					replyRuns
				};
			}
		});
		if ((await prepared.cancellation).unauthorized) throw new Error("Session cancellation lost ownership");
		params.authorize?.();
		if (params.sessionId) {
			const placements = params.context.workerSessionPlacementService;
			const pending = (await placements?.listPendingWorkspaceResultsAsync?.(params.sessionId))?.[0];
			params.authorize?.();
			const placement = placements?.getMany([params.sessionId]).get(params.sessionId);
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
		const { released: admittedWork } = startSessionWorkAdmissionInterruption({
			scope: params.storePath,
			identities: params.lifecycleIdentities
		});
		const replyWork = Promise.all(prepared.replyRuns.map((operation) => waitForReplyOperationOwnerSettlement(operation, timeoutMs))).then((results) => results.every(Boolean));
		const embeddedWork = params.sessionId ? waitForEmbeddedAgentRunEnd(params.sessionId, timeoutMs) : Promise.resolve(true);
		const placementService = params.context.workerSessionPlacementService;
		const placementWork = (params.sessionId ? placementService?.getMany([params.sessionId]).get(params.sessionId) : void 0)?.turnClaim ? placementService?.waitForTurnClaimRelease ? placementService.waitForTurnClaimRelease(params.sessionId, { timeoutMs }).then(() => true) : Promise.resolve(false) : Promise.resolve(true);
		const workerWork = workerDrained ? withTimeout(workerDrained, timeoutMs, "worker inference lifecycle drain").then(() => true) : Promise.resolve(true);
		const terminalWork = terminalDrain ? withTimeout(terminalDrain.drained, timeoutMs, "agent terminal lifecycle drain").then(() => true) : Promise.resolve(true);
		if (!(await Promise.all([
			prepared.controllerDrain,
			replyWork,
			embeddedWork,
			placementWork,
			workerWork,
			terminalWork
		])).every(Boolean)) throw new Error("Session work is still active after the lifecycle drain");
		await (reclaimed ?? prepared.workerStop.stop());
		await withTimeout(admittedWork, timeoutMs, "session work admission lifecycle drain");
		const placementTarget = {
			context: params.context,
			sessionId: params.sessionId
		};
		const assertPlacementCurrent = params.action === "archive" ? prepareSessionWorkerPlacementArchiveCheck(placementTarget).assertCurrent : prepareSessionWorkerPlacementMutationCheck(placementTarget);
		return {
			handoffToMutation: () => releaseAdmissions(),
			release,
			hasAuthoritativeWork: () => {
				try {
					assertPlacementCurrent();
				} catch {
					return true;
				}
				return hasAuthoritativeSessionWork(params, workerDrain, terminalDrain, queueTarget);
			}
		};
	} catch (error) {
		await reclaimed?.catch(() => {});
		if (workerDrained) {
			const failures = /* @__PURE__ */ new Set([error]);
			const [settled] = await Promise.allSettled([workerDrained]);
			if (settled.status === "rejected") failures.add(settled.reason);
			try {
				release();
			} catch (releaseError) {
				failures.add(releaseError);
			}
			if (failures.size > 1) throw new AggregateError([...failures], "Session lifecycle and worker settlement failed", { cause: error });
			throw error;
		}
		release();
		throw error;
	}
}
//#endregion
export { prepareSessionLifecycleDrain as n, SessionLifecycleWorkspaceRecoveryError as t };
