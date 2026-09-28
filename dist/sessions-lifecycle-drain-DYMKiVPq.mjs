import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { _ as startSessionWorkAdmissionInterruption, g as runExclusiveSessionLifecycleMutation, i as closeSessionWorkAdmissions, p as isCompetingSessionWorkAdmissionActive, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { h as replyRunRegistry, n as abortReplyRunBySessionId, u as isReplyRunActiveForSessionId, x as waitForReplyRunEndBySessionId } from "./reply-run-registry.registry-DycIsDrE.mjs";
import "./reply-run-registry-Cpef_Ljt.mjs";
import { I as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, p as isEmbeddedAgentRunInProgress } from "./runs-ciDkXIOQ.mjs";
import { a as getCommandLaneSnapshot } from "./command-queue-CaY517ob.mjs";
import { i as prepareSessionWorkerPlacementMutationCheck, o as prepareSessionWorkerPlacementStop, r as prepareSessionWorkerPlacementArchiveCheck } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { o as isCurrentWorkerWorkspacePendingResultOwner } from "./placement-turn-claims-lHILSuHT.mjs";
import { h as waitForChatAbortControllerRemoval } from "./chat-abort-D7PkkSq8.mjs";
import { o as hasPendingFollowupQueueWork } from "./state-B1aZH2hx.mjs";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.mjs";
import { t as clearSessionQueues } from "./cleanup-Oz9EeewQ.mjs";
import { t as createChatAbortOps } from "./chat-abort-ops-lFr576Vk.mjs";
import { l as hasGatewaySessionAbortOwner, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-Cz3MuHdA.mjs";
import { n as beginWorkerInferenceSessionDrain } from "./inference-control-internal-Dk-ZtYoJ.mjs";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.mjs";
//#region src/gateway/server-methods/sessions-lifecycle-drain.ts
var SessionLifecycleWorkspaceRecoveryError = class extends Error {
	constructor(error) {
		super(error.message);
		this.error = error;
	}
};
function hasAuthoritativeSessionWork(params, workerDrain, terminalDrain, workIdentities) {
	const sessionId = params.sessionId;
	return isCompetingSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities) || params.sessionKeys.some((key) => replyRunRegistry.isActive(key)) || Boolean(sessionId && isReplyRunActiveForSessionId(sessionId)) || Boolean(sessionId && isEmbeddedAgentRunInProgress(sessionId)) || hasPendingFollowupQueueWork(workIdentities) || workIdentities.some((key) => getCommandLaneSnapshot(resolveEmbeddedSessionLane(key)).queuedCount > 0) || hasGatewaySessionAbortOwner({
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
	const workIdentities = Array.from(/* @__PURE__ */ new Set([...params.sessionKeys, ...params.sessionId ? [params.sessionId] : []]));
	const workerService = params.context.workerEnvironmentService;
	const workerControl = asWorkerInferenceControl(workerService);
	let workerDrain;
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
		const prepared = await runExclusiveSessionLifecycleMutation({
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
					workerDrain = beginWorkerInferenceSessionDrain(workerService, params.sessionId);
					if (!workerDrain && workerControl?.hasInferenceForSession(params.sessionId) === true) throw new Error("Worker inference drain is unavailable");
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
						const cleared = clearSessionQueues(workIdentities);
						let aborted = cleared.followupCleared > 0 || cleared.laneCleared > 0;
						for (const key of params.sessionKeys) aborted = replyRunRegistry.abort(key) || aborted;
						if (params.sessionId) {
							aborted = abortReplyRunBySessionId(params.sessionId) || aborted;
							aborted = abortEmbeddedAgentRun(params.sessionId) || aborted;
						}
						return aborted;
					}
				});
				cancellation.catch(() => {});
				return {
					workerStop,
					cancellation,
					controllerDrain
				};
			}
		});
		if ((await prepared.cancellation).unauthorized) throw new Error("Session cancellation lost ownership");
		params.authorize?.();
		if (params.sessionId) {
			const placements = params.context.workerSessionPlacementService;
			const placement = placements?.getMany([params.sessionId]).get(params.sessionId);
			const pending = placements?.listPendingWorkspaceResults?.(params.sessionId)[0];
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
		const replyWork = Promise.all([...params.sessionKeys.map((key) => replyRunRegistry.waitForIdle(key, timeoutMs)), ...params.sessionId ? [waitForReplyRunEndBySessionId(params.sessionId, timeoutMs)] : []]).then((results) => results.every(Boolean));
		const embeddedWork = params.sessionId ? waitForEmbeddedAgentRunEnd(params.sessionId, timeoutMs) : Promise.resolve(true);
		const placementService = params.context.workerSessionPlacementService;
		const placementWork = (params.sessionId ? placementService?.getMany([params.sessionId]).get(params.sessionId) : void 0)?.turnClaim ? placementService?.waitForTurnClaimRelease ? placementService.waitForTurnClaimRelease(params.sessionId, { timeoutMs }).then(() => true) : Promise.resolve(false) : Promise.resolve(true);
		const workerWork = workerDrain ? withTimeout(workerDrain.drained, timeoutMs, "worker inference lifecycle drain").then(() => true) : Promise.resolve(true);
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
				return hasAuthoritativeSessionWork(params, workerDrain, terminalDrain, workIdentities);
			}
		};
	} catch (error) {
		await reclaimed?.catch(() => {});
		release();
		throw error;
	}
}
//#endregion
export { prepareSessionLifecycleDrain as n, SessionLifecycleWorkspaceRecoveryError as t };
