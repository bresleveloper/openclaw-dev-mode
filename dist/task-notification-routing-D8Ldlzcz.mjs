import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CThMOjN8.mjs";
import { p as requestSessionEventWake } from "./heartbeat-wake-bWS25cgK.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { d as getTaskFlowById } from "./task-flow-runtime-internal-DFSz6gyF.mjs";
import { p as getTasksByRunId } from "./task-registry.process-state-Cb_kvrmQ.mjs";
import { _ as taskDeliveryStates } from "./task-registry-state-Cibd1d5c.mjs";
import { i as resolveTaskSessionAgentId } from "./task-registry-read-BpKCOEEj.mjs";
import { a as formatTaskStatusTitleText, c as sanitizeTaskStatusText, r as formatTaskStatusDetail } from "./task-status-D1-umRs5.mjs";
import { i as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-Byvky-I7.mjs";
import { t as channelSupportsThreadDelivery } from "./thread-addressing-BePl-7CH.mjs";
//#region src/tasks/task-executor-policy.ts
function resolveTaskDisplayTitle(task) {
	return formatTaskStatusTitleText(task.label?.trim() || (task.runtime === "acp" ? "ACP background task" : task.runtime === "subagent" ? "Subagent task" : task.task.trim() || "Background task"));
}
function resolveTaskRunLabel(task) {
	return task.runId ? ` (run ${task.runId.slice(0, 8)})` : "";
}
function formatTaskTerminalMessage(task, options = {}) {
	const title = resolveTaskDisplayTitle(task);
	const runLabel = resolveTaskRunLabel(task);
	if (task.status === "succeeded") {
		const isBlocked = task.terminalOutcome === "blocked";
		const summary = sanitizeTaskStatusText(task.terminalSummary, {
			errorContext: isBlocked,
			maxChars: isBlocked ? 120 : void 0
		});
		if (isBlocked) return summary ? `Background task blocked: ${title}${runLabel}. ${summary}` : `Background task blocked: ${title}${runLabel}.`;
		if (options.surface === "parent_session") {
			const reviewNext = "Next: parent will review/verify before calling it done.";
			return summary ? `Background task ready for review: ${title}${runLabel}. ${summary} ${reviewNext}` : `Background task ready for review: ${title}${runLabel}. ${reviewNext}`;
		}
		return summary ? `Background task done: ${title}${runLabel}. ${summary}` : `Background task done: ${title}${runLabel}.`;
	}
	if (task.status === "timed_out") return `Background task timed out: ${title}${runLabel}.`;
	if (task.status === "cancelled") {
		if (task.runtime === "subagent") return `Background task cancellation requested: ${title}${runLabel}.`;
		return `Background task cancelled: ${title}${runLabel}.`;
	}
	const detail = formatTaskStatusDetail(task);
	if (task.status === "lost") return `Background task lost: ${title}${runLabel}. ${detail || "Backing session disappeared."}`;
	return detail ? `Background task failed: ${title}${runLabel}. ${detail}` : `Background task failed: ${title}${runLabel}.`;
}
function shouldUseParentReviewTaskTerminalMessage(task) {
	return task.runtime === "acp" && task.status === "succeeded" && task.terminalOutcome !== "blocked" && Boolean(task.childSessionKey?.trim());
}
function formatTaskBlockedFollowupMessage(task) {
	if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return null;
	return `Task needs follow-up: ${resolveTaskDisplayTitle(task)}${resolveTaskRunLabel(task)}. ${sanitizeTaskStatusText(task.terminalSummary, {
		errorContext: true,
		maxChars: 120
	}) || "Task is blocked and needs follow-up."}`;
}
function formatTaskStateChangeMessage(task, event) {
	const title = resolveTaskDisplayTitle(task);
	if (event.kind === "running") return `Background task started: ${title}.`;
	if (event.kind === "progress") {
		const summary = sanitizeTaskStatusText(event.summary);
		return summary ? `Background task update: ${title}. ${summary}` : null;
	}
	return null;
}
//#endregion
//#region src/auto-reply/reply/completion-delivery-policy.ts
function resolveCompletionChatType(params) {
	const explicit = normalizeChatType(params.requesterEntry?.chatType ?? sessionDeliveryOrigin(params.requesterEntry)?.chatType);
	if (explicit) return explicit;
	for (const key of [params.targetRequesterSessionKey, params.requesterSessionKey]) {
		const derived = deriveSessionChatTypeFromKey(key);
		if (derived !== "unknown") return derived;
	}
	return inferCompletionChatTypeFromTarget(params.directOrigin?.to ?? params.requesterSessionOrigin?.to);
}
function completionRequiresMessageToolDelivery(params) {
	return resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: { ChatType: resolveCompletionChatType(params) },
		messageToolAvailable: params.messageToolAvailable
	}) === "message_tool_only";
}
/** Resolve transport authority for a durable, fixed-route agent completion. */
function resolveDurableCompletionDeliveryMode(sourceReplyDeliveryMode) {
	return sourceReplyDeliveryMode === "message_tool_only" ? "host_owned" : "automatic";
}
function shouldRouteCompletionThroughRequesterSession(sessionKey) {
	const chatType = deriveSessionChatTypeFromKey(sessionKey);
	return chatType === "group" || chatType === "channel";
}
function inferCompletionChatTypeFromTarget(to) {
	const normalized = to?.trim().toLowerCase();
	if (!normalized) return "unknown";
	if (normalized.startsWith("group:")) return "group";
	if (normalized.startsWith("channel:") || normalized.startsWith("thread:")) return "channel";
	if (normalized.startsWith("dm:") || normalized.startsWith("direct:") || normalized.startsWith("user:")) return "direct";
	return "unknown";
}
//#endregion
//#region src/tasks/task-notification-routing.ts
function getPeerTasksForDelivery(task) {
	if (!task.runId?.trim()) return [];
	return getTasksByRunId(task.runId).filter((candidate) => candidate.runtime === task.runtime && candidate.scopeKind === task.scopeKind && (normalizeOptionalString(candidate.ownerKey) ?? "") === (normalizeOptionalString(task.ownerKey) ?? "") && (normalizeOptionalString(candidate.childSessionKey) ?? "") === (normalizeOptionalString(task.childSessionKey) ?? ""));
}
function resolveTaskDeliveryOwner(task, readFlow = getTaskFlowById) {
	if (task.scopeKind !== "session") return {};
	const flowId = task.parentFlowId?.trim();
	const candidate = flowId ? readFlow(flowId) : void 0;
	const flow = candidate && normalizeOptionalString(candidate.ownerKey) === normalizeOptionalString(task.ownerKey) ? candidate : void 0;
	return {
		sessionKey: task.ownerKey.trim(),
		agentId: resolveTaskSessionAgentId(task.ownerKey, task.requesterAgentId),
		requesterOrigin: normalizeDeliveryContext(flow?.requesterOrigin ?? taskDeliveryStates.get(task.taskId)?.requesterOrigin),
		...flow ? { flowId: flow.flowId } : {}
	};
}
function canDeliverTaskToRequesterOrigin(owner) {
	if (shouldRouteCompletionThroughRequesterSession(owner.sessionKey)) return false;
	return canDeliverToRequesterOrigin(owner.requesterOrigin);
}
function canDeliverToRequesterOrigin(origin) {
	const channel = origin?.channel?.trim();
	const to = origin?.to?.trim();
	return Boolean(channel && to && isDeliverableMessageChannel(channel));
}
function canDeliverParentReviewTaskToThreadOrigin(task, owner) {
	if (!shouldUseParentReviewTaskTerminalMessage(task)) return false;
	const origin = owner.requesterOrigin;
	const threadId = String(origin?.threadId ?? "").trim();
	return Boolean(threadId && channelSupportsThreadDelivery(origin?.channel) && canDeliverToRequesterOrigin(origin));
}
function queueTaskSystemEvent(task, text, owner, source = "background-task") {
	const ownerKey = owner.sessionKey?.trim();
	if (!ownerKey) return false;
	const options = {
		sessionKey: ownerKey,
		contextKey: `task:${task.taskId}${source === "background-task-blocked" ? ":blocked-followup" : ""}`,
		deliveryContext: owner.requesterOrigin
	};
	enqueueSystemEvent(text, owner.agentId ? withSystemEventOwner(options, owner.agentId) : options);
	requestSessionEventWake({
		source,
		intent: "immediate",
		reason: source,
		sessionKey: ownerKey,
		agentId: owner.agentId
	});
	return true;
}
function queueBlockedTaskFollowup(task, owner) {
	const followupText = formatTaskBlockedFollowupMessage(task);
	if (!followupText) return false;
	return queueTaskSystemEvent(task, followupText, owner, "background-task-blocked");
}
function resolveTaskStateChangeIdempotencyKey(params) {
	if (params.owner.flowId) return `flow-event:${params.owner.flowId}:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
	return `task-event:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
}
function resolveTaskTerminalIdempotencyKey(task, owner) {
	const prefix = owner.flowId ? `flow-terminal:${owner.flowId}` : "task-terminal";
	const outcome = task.status === "succeeded" ? task.terminalOutcome ?? "default" : "default";
	return `${prefix}:${task.taskId}:${task.status}:${outcome}`;
}
//#endregion
export { queueBlockedTaskFollowup as a, resolveTaskStateChangeIdempotencyKey as c, resolveDurableCompletionDeliveryMode as d, formatTaskBlockedFollowupMessage as f, shouldUseParentReviewTaskTerminalMessage as h, getPeerTasksForDelivery as i, resolveTaskTerminalIdempotencyKey as l, formatTaskTerminalMessage as m, canDeliverTaskToRequesterOrigin as n, queueTaskSystemEvent as o, formatTaskStateChangeMessage as p, canDeliverToRequesterOrigin as r, resolveTaskDeliveryOwner as s, canDeliverParentReviewTaskToThreadOrigin as t, completionRequiresMessageToolDelivery as u };
