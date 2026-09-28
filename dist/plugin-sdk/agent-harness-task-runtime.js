import { l as normalizeOptionalString } from "../string-coerce-CIXf7egm.mjs";
import { a as getGatewayContextResolver } from "../gateway-context-binding-VqB7gkMe.mjs";
import { o as withPluginRuntimeGatewayContextResolver } from "../gateway-request-scope-BLBH-Gpf.mjs";
import { t as captureTaskExecutionOwner } from "../task-execution-owner-CARpGK5P.mjs";
import { s as listTaskRecords } from "../task-registry-query-Bd-H3o4L.mjs";
import "../runtime-internal-BF8pXknh.mjs";
import { a as finalizeTaskRunByRunId, l as recordTaskRunProgressByRunId, r as createRunningTaskRun, u as setDetachedTaskDeliveryStatusByRunId } from "../detached-task-runtime-Cl5iIO5L.mjs";
import { F as buildAnnounceIdempotencyKey } from "../subagent-completion-admission.store-C-FTAVQX.mjs";
import { t as AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION } from "../internal-event-contract-pF6FHp8g.mjs";
import { i as formatAgentInternalEventsForPrompt } from "../internal-events-CfvyIQfQ.mjs";
import { a as loadRequesterSessionEntry, i as resolveSubagentCompletionOrigin, n as isInternalAnnounceRequesterSession, r as resolveAnnounceOrigin, t as deliverSubagentAnnouncement } from "../subagent-announce-delivery-CSptNSex.mjs";
import { t as assertAgentHarnessTaskRuntimeScope } from "../agent-harness-task-runtime-scope-CtBT1UtN.mjs";
import { t as reconcileHarnessCompletionDelivery } from "../agent-harness-completion-delivery-lzPtgV9x.mjs";
//#region src/plugin-sdk/agent-harness-task-runtime.ts
/**
* Runtime SDK helpers for agent harness task persistence and completion delivery.
*/
const AGENT_HARNESS_COMPLETION_SOURCE_TOOL = "agent_harness_task";
/** Creates a task runtime whose run ids and task records are constrained to one scope. */
function createAgentHarnessTaskRuntime(params) {
	const runtime = params.runtime;
	const requesterSessionKey = assertAgentHarnessTaskRuntimeScope(params.scope).requesterSessionKey;
	const taskKind = normalizeOptionalString(params.taskKind);
	const runIdPrefix = normalizeOptionalString(params.runIdPrefix);
	const executionOwner = params.executionPid === void 0 ? void 0 : captureTaskExecutionOwner(params.executionPid);
	const assertRunId = (runId) => assertScopedRunId(runId, runIdPrefix);
	const tryCreateRunningTaskRun = (taskParams) => {
		assertRunId(taskParams.runId);
		return createRunningTaskRun({
			...taskParams,
			runtime,
			...taskKind ? { taskKind } : {},
			requesterSessionKey,
			ownerKey: requesterSessionKey,
			scopeKind: "session",
			executionOwner
		});
	};
	return {
		createRunningTaskRun(taskParams) {
			const task = tryCreateRunningTaskRun(taskParams);
			if (!task) throw new Error("Task persistence failed.");
			return task;
		},
		tryCreateRunningTaskRun,
		recordTaskRunProgressByRunId(taskParams) {
			assertRunId(taskParams.runId);
			return recordTaskRunProgressByRunId({
				...taskParams,
				runtime,
				sessionKey: requesterSessionKey
			});
		},
		finalizeTaskRunByRunId(taskParams) {
			assertRunId(taskParams.runId);
			return finalizeTaskRunByRunId({
				...taskParams,
				runtime,
				sessionKey: requesterSessionKey
			});
		},
		setDetachedTaskDeliveryStatusByRunId(taskParams) {
			assertRunId(taskParams.runId);
			return setDetachedTaskDeliveryStatusByRunId({
				...taskParams,
				runtime,
				sessionKey: requesterSessionKey
			});
		},
		listTaskRecords() {
			return listTaskRecords((task) => task.runtime === runtime && (!taskKind || task.taskKind === taskKind) && task.scopeKind === "session" && task.ownerKey === requesterSessionKey && (!runIdPrefix || task.runId?.startsWith(runIdPrefix) === true));
		}
	};
}
/** Delivers a completed harness task result back to the requester or parent session. */
async function deliverAgentHarnessTaskCompletion(params) {
	const scope = assertAgentHarnessTaskRuntimeScope(params.scope);
	const requesterSessionKey = scope.requesterSessionKey;
	const childSessionKey = params.childSessionKey.trim();
	const childSessionId = params.childSessionId.trim();
	const taskLabel = params.taskLabel?.trim() || "Agent harness task";
	const announceType = params.announceType?.trim() || "Agent harness task";
	const statusLabel = params.statusLabel?.trim() || params.status;
	const eventStatus = mapHarnessCompletionStatus(params.status);
	const readOwnedTasks = () => listTaskRecords((task) => task.runtime === "subagent" && Boolean(task.taskKind) && task.requesterSessionKey === requesterSessionKey && task.runId === childSessionKey);
	const ownedTasks = readOwnedTasks();
	const sourceTask = ownedTasks.length === 1 ? ownedTasks[0] : void 0;
	const isTaskCurrent = () => {
		const current = readOwnedTasks();
		if (!sourceTask) return ownedTasks.length === 0 && current.length === 0;
		const task = current[0];
		return current.length === 1 && task?.taskId === sourceTask.taskId && task.status === params.status && task.deliveryStatus === "pending";
	};
	const expectedRequester = params.expectedRequester;
	const isRequesterCurrent = () => {
		if (!expectedRequester) return true;
		const current = loadRequesterSessionEntry(requesterSessionKey).entry;
		return current?.sessionId === expectedRequester.sessionId && current.lifecycleRevision === expectedRequester.lifecycleRevision;
	};
	const isSourceSessionEffectsAllowed = () => isRequesterCurrent() && isTaskCurrent();
	const requesterIsSubagent = isInternalAnnounceRequesterSession(requesterSessionKey);
	let directOrigin = scope.requesterOrigin;
	if (!requesterIsSubagent) {
		const { entry } = loadRequesterSessionEntry(requesterSessionKey);
		directOrigin = resolveAnnounceOrigin(entry, scope.requesterOrigin);
	}
	const completionDirectOrigin = requesterIsSubagent || !directOrigin ? directOrigin : await resolveSubagentCompletionOrigin({
		childSessionKey,
		requesterSessionKey,
		requesterOrigin: directOrigin,
		childRunId: childSessionKey,
		spawnMode: "run",
		expectsCompletionMessage: true
	});
	const internalEvents = [{
		type: AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION,
		source: "subagent",
		childSessionKey,
		childSessionId,
		announceType,
		taskLabel,
		status: eventStatus,
		statusLabel,
		result: params.result,
		replyInstruction: params.replyInstruction?.trim() || "Use the completed harness task result to continue or wrap up the parent task. If this is a channel session, send the visible response with the message tool instead of only writing a transcript final answer."
	}];
	const prompt = formatAgentInternalEventsForPrompt(internalEvents);
	const deliver = async () => {
		if (ownedTasks.length > 1 || readOwnedTasks().length > 1) return {
			delivered: false,
			path: "none",
			recoveryBlocked: true,
			error: "completion task ownership is ambiguous"
		};
		if (!isRequesterCurrent()) return {
			delivered: false,
			path: "none",
			recoveryBlocked: true,
			error: "completion requester locator is missing or replaced"
		};
		const requester = loadRequesterSessionEntry(requesterSessionKey);
		if (requester.agentId && requester.storePath) {
			const custody = reconcileHarnessCompletionDelivery({
				agentId: requester.agentId,
				storePath: requester.storePath,
				sessionKey: requester.canonicalKey,
				sourceRunId: buildAnnounceIdempotencyKey(params.announceId),
				taskRunId: childSessionKey
			});
			if (custody === "delivered") return {
				delivered: true,
				path: "direct"
			};
			if (custody !== "unowned") return {
				delivered: false,
				path: "none",
				...custody === "pending" ? { recoveryPending: true } : { recoveryBlocked: true },
				error: custody === "pending" ? "completion is owned by requester recovery" : "completion recovery receipt or owner is unresolved"
			};
		}
		if (!isTaskCurrent()) return {
			delivered: false,
			path: "none",
			recoveryBlocked: true,
			error: "completion task is no longer owed by this requester"
		};
		return await deliverSubagentAnnouncement({
			requesterSessionKey,
			isSourceSessionEffectsAllowed,
			triggerMessage: prompt,
			steerMessage: prompt,
			internalEvents,
			requesterSessionOrigin: scope.requesterOrigin,
			completionDirectOrigin: completionDirectOrigin ?? directOrigin,
			directOrigin,
			sourceSessionKey: childSessionKey,
			sourceTool: AGENT_HARNESS_COMPLETION_SOURCE_TOOL,
			isSourceSessionAdmissionAllowed: params.isSourceSessionAdmissionAllowed,
			targetRequesterSessionKey: requesterSessionKey,
			requesterIsSubagent,
			expectsCompletionMessage: true,
			bestEffortDeliver: true,
			directIdempotencyKey: buildAnnounceIdempotencyKey(params.announceId),
			signal: params.signal
		});
	};
	const resolveGatewayContext = getGatewayContextResolver(scope);
	return resolveGatewayContext ? await withPluginRuntimeGatewayContextResolver(resolveGatewayContext, deliver) : await deliver();
}
function mapHarnessCompletionStatus(status) {
	if (status === "succeeded") return "ok";
	return "error";
}
/** Returns true when completion delivery reached a persistent direct or steered path. */
function isDurableAgentHarnessCompletionDelivery(delivery) {
	if (!delivery.delivered) return false;
	if (delivery.path === "steered") return true;
	if (delivery.path !== "direct") return false;
	const phases = Array.isArray(delivery.phases) ? delivery.phases : void 0;
	if (!phases) return true;
	return phases.some((phase) => phase.phase === "direct-primary" && phase.delivered && phase.path === "direct");
}
function assertScopedRunId(runId, runIdPrefix) {
	const normalized = runId.trim();
	if (!normalized) throw new Error("Agent harness task runtime requires runId");
	if (runIdPrefix && !normalized.startsWith(runIdPrefix)) throw new Error("Agent harness task runId is outside the configured scope");
}
//#endregion
export { createAgentHarnessTaskRuntime, deliverAgentHarnessTaskCompletion, isDurableAgentHarnessCompletionDelivery };
