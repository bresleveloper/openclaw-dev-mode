import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-Bt6aG_wj.mjs";
import { r as listRegisteredAgentHarnesses } from "./registry-1lXXOteg.mjs";
import { r as getTaskActivitySnapshot } from "./task-registry-activity-qvAA4Okp.mjs";
import { c as sanitizeTaskStatusText, i as formatTaskStatusTitle, l as truncateTaskStatusText, s as sanitizeTaskPromptText } from "./task-status-D1-umRs5.mjs";
import { t as isHarnessOwnedSubagentTask } from "./harness-owned-subagent-task-D9k0l4Sr.mjs";
import { t as getTaskExecutionObservation } from "./task-execution-observation-Dq08a4Iy.mjs";
import { E as createSessionListEntryFilter, I as authorizeSessionSharingTarget, K as resolveSessionSharingTarget, V as isGatewayAdmin, j as authorizeIncognitoSessionTarget, q as resolveSessionSharingTargets } from "./session-sharing-C_5FkkwM.mjs";
//#region src/gateway/task-session-access.ts
function resolveTaskRequesterSessionTarget(task) {
	const sessionKey = normalizeOptionalString(task.requesterSessionKey);
	if (!sessionKey) return;
	const agentId = normalizeOptionalString(task.requesterAgentId) ?? parseAgentSessionKey(sessionKey)?.agentId ?? parseAgentSessionKey(task.ownerKey)?.agentId;
	return {
		sessionKey,
		...agentId ? { agentId } : {}
	};
}
function canAccessTaskRequesterSession(params) {
	const target = resolveTaskRequesterSessionTarget(params.task);
	if (!target || isGatewayAdmin(params.client)) return true;
	return canAccessResolvedTaskSession(params, target, resolveSessionSharingTarget({
		cfg: params.cfg,
		...target
	}));
}
function canAccessResolvedTaskSession(params, target, sharingTarget) {
	if (!target || isGatewayAdmin(params.client)) return true;
	if (authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: target.sessionKey,
		target: sharingTarget
	})) return false;
	if (!hasOperatorBoundary(params.client, params.cfg)) return true;
	if (!sharingTarget) return false;
	if (params.access === "write") return !authorizeSessionSharingTarget({
		cfg: params.cfg,
		client: params.client,
		target: sharingTarget
	});
	return createSessionListEntryFilter({
		cfg: params.cfg,
		client: params.client
	})?.(sharingTarget.storeKey, sharingTarget.entry) ?? true;
}
/** Prepare only this slice's entries; the registry drops this filter before yielding. */
function prepareTaskSessionReadFilter(params, tasks) {
	if (isGatewayAdmin(params.client)) return (task) => canAccessTaskRequesterSession({
		...params,
		task
	});
	const requests = tasks.map((task) => ({
		task,
		target: resolveTaskRequesterSessionTarget(task),
		sharingTarget: null
	}));
	const lookups = requests.flatMap((request) => request.target ? [{
		request,
		target: request.target
	}] : []);
	for (const [index, sharingTarget] of resolveSessionSharingTargets({
		cfg: params.cfg,
		targets: lookups.map((lookup) => lookup.target)
	}).entries()) expectDefined(lookups[index], "prepared task session lookup").request.sharingTarget = sharingTarget;
	const prepared = new Map(requests.map((request) => [request.task, request]));
	return (task) => {
		const request = expectDefined(prepared.get(task), "task belongs to the synchronous access slice");
		return canAccessResolvedTaskSession(params, request.target, request.sharingTarget);
	};
}
//#endregion
//#region src/tasks/task-history.ts
/** History routing must not change which runtime owns a task's lifecycle. */
function resolveTaskHistoryHarness(task) {
	if (!isHarnessOwnedSubagentTask(task)) return;
	const owners = listRegisteredAgentHarnesses().filter(({ harness }) => harness.taskHistory?.taskKinds.includes(task.taskKind ?? ""));
	return owners.length === 1 ? owners[0]?.harness : void 0;
}
function taskTranscriptSessionKey(task) {
	return task.runtime === "subagent" ? task.childSessionKey?.trim() || void 0 : task.childSessionKey?.trim() || task.requesterSessionKey.trim() || void 0;
}
function hasTaskTranscript(task) {
	return Boolean(taskTranscriptSessionKey(task) || resolveTaskHistoryHarness(task));
}
//#endregion
//#region src/gateway/server-methods/task-summary.ts
const TASK_RESULT_MAX_CHARS = 4e3;
const TASK_STATUS_TO_LEDGER_STATUS = {
	queued: "queued",
	running: "running",
	succeeded: "completed",
	failed: "failed",
	timed_out: "timed_out",
	cancelled: "cancelled",
	lost: "failed"
};
function taskUpdatedAt(task) {
	return task.lastEventAt ?? task.endedAt ?? task.startedAt ?? task.createdAt;
}
function sanitizeOptionalTaskText(value, opts) {
	return sanitizeTaskStatusText(value, {
		errorContext: opts?.errorContext,
		maxChars: 120
	}) || void 0;
}
function mapTaskSummary(task, opts) {
	const activity = getTaskActivitySnapshot(task.taskId);
	const execution = getTaskExecutionObservation(task);
	const lastActivity = sanitizeOptionalTaskText(activity?.lastActivity);
	const progressResult = sanitizeTaskStatusText(task.progressSummary);
	const terminalResult = sanitizeTaskStatusText(task.terminalSummary, { errorContext: true });
	const progressSummary = truncateTaskStatusText(progressResult, 120) || void 0;
	const terminalSummary = truncateTaskStatusText(terminalResult, 120) || void 0;
	const error = sanitizeOptionalTaskText(task.error, { errorContext: true });
	const lastToolName = sanitizeOptionalTaskText(task.lastToolName);
	const prompt = opts?.includePrompt ? sanitizeTaskPromptText(task.task) || void 0 : void 0;
	const result = opts?.includePrompt ? (task.runtime === "subagent" || task.runtime === "acp" ? progressResult : terminalResult || progressResult) || void 0 : void 0;
	const toolUseCount = typeof task.toolUseCount === "number" && Number.isInteger(task.toolUseCount) ? Math.max(0, task.toolUseCount) : void 0;
	return {
		id: task.taskId,
		taskId: task.taskId,
		kind: task.taskKind ?? task.runtime,
		runtime: task.runtime,
		status: TASK_STATUS_TO_LEDGER_STATUS[task.status],
		execution,
		title: formatTaskStatusTitle(task),
		...task.agentId ? { agentId: task.agentId } : {},
		sessionKey: task.requesterSessionKey,
		...task.childSessionKey ? { childSessionKey: task.childSessionKey } : {},
		hasTranscript: hasTaskTranscript(task),
		ownerKey: task.ownerKey,
		...task.runId ? { runId: task.runId } : {},
		...task.parentFlowId ? { flowId: task.parentFlowId } : {},
		...task.parentTaskId ? { parentTaskId: task.parentTaskId } : {},
		...task.sourceId ? { sourceId: task.sourceId } : {},
		createdAt: task.createdAt,
		updatedAt: taskUpdatedAt(task),
		...task.startedAt !== void 0 ? { startedAt: task.startedAt } : {},
		...task.endedAt !== void 0 ? { endedAt: task.endedAt } : {},
		...toolUseCount !== void 0 ? { toolUseCount } : {},
		...lastToolName ? { lastToolName } : {},
		...lastActivity ? { lastActivity } : {},
		...activity?.diffStat ? { diffStat: activity.diffStat } : {},
		...progressSummary ? { progressSummary } : {},
		...terminalSummary ? { terminalSummary } : {},
		...error ? { error } : {},
		deliveryStatus: task.deliveryStatus,
		...task.terminalOutcome ? { terminalOutcome: task.terminalOutcome } : {},
		...result ? { result: truncateTaskStatusText(result, TASK_RESULT_MAX_CHARS) } : {},
		...prompt ? { prompt } : {}
	};
}
//#endregion
export { prepareTaskSessionReadFilter as a, canAccessTaskRequesterSession as i, resolveTaskHistoryHarness as n, resolveTaskRequesterSessionTarget as o, taskTranscriptSessionKey as r, mapTaskSummary as t };
