import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _t as AgentActivityItemSchema } from "./sessions-KsldKmtI.mjs";
import { a as hasExecutionSettlement } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { E as readTaskBackingInstance, P as cloneTaskRecordForObserver } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { a as emitTaskRegistryObserverEvent, g as taskActivityByTaskId, w as tasks } from "./task-registry-state-Cibd1d5c.mjs";
import { n as projectAgentActivityItem, t as isCompleteAgentPreamble } from "./agent-activity-presentation-DIuWOqb_.mjs";
import { r as readCompletedFileMutationDelta, t as resolveFileMutationToolName } from "./tool-mutation-names-DHZ5dIYE.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/tasks/task-registry-activity.ts
const MAX_ACTIVITY_CHARS = 200;
const ACTIVITY_LINE_PREFIX = new RegExp(`^(?:\\s*\\S){1,201}`);
const ACTIVITY_FLUSH_MS = 1e3;
const MAX_PENDING_DIFFS = 64;
const MAX_CURRENT_TOOLS = 64;
const MAX_PREPARED_ITEMS = 64;
const liveActivitySchema = Type.Object({
	...AgentActivityItemSchema.properties,
	itemId: Type.Optional(AgentActivityItemSchema.properties.itemId)
}, { additionalProperties: true });
function activityFor(task) {
	const runId = task.runId ?? "";
	const preparedGeneration = readTaskBackingInstance(task.detail)?.generation;
	const existing = taskActivityByTaskId.get(task.taskId);
	if (existing?.runId === runId) {
		if (existing.preparedGeneration !== preparedGeneration) {
			existing.preparedItems.clear();
			existing.preparedGeneration = preparedGeneration;
		}
		return existing;
	}
	if (existing?.flushTimer) clearTimeout(existing.flushTimer);
	existing?.preparedItems.clear();
	const created = {
		runId,
		currentTools: /* @__PURE__ */ new Map(),
		preparedItems: /* @__PURE__ */ new Map(),
		preparedGeneration,
		pendingApprovalIds: /* @__PURE__ */ new Set(),
		assistantText: "",
		thinkingText: "",
		hasAssistantActivity: false,
		files: /* @__PURE__ */ new Set(),
		added: 0,
		removed: 0,
		pendingDiffByToolCallId: /* @__PURE__ */ new Map(),
		dirty: false
	};
	taskActivityByTaskId.set(task.taskId, created);
	return created;
}
function lastLineSnippet(text) {
	const prefix = text.trimEnd().split(/\r\n|\r|\n/).at(-1)?.match(ACTIVITY_LINE_PREFIX)?.[0];
	return prefix ? truncateUtf16Safe(prefix.replace(/\s+/g, " ").trim(), MAX_ACTIVITY_CHARS) : void 0;
}
function scheduleFlush(taskId, activity) {
	if (activity.flushTimer) return;
	const elapsed = activity.lastFlushedAt === void 0 ? 0 : Date.now() - activity.lastFlushedAt;
	const delay = Math.max(0, ACTIVITY_FLUSH_MS - elapsed);
	activity.flushTimer = setTimeout(() => {
		activity.flushTimer = void 0;
		flushTaskActivity(taskId);
	}, delay);
	activity.flushTimer.unref?.();
}
function markChanged(taskId, activity) {
	activity.dirty = true;
	scheduleFlush(taskId, activity);
}
/** Coalesces producer-owned activity without persisting or duplicating its execution state. */
function invalidateTaskActivity(taskId, at) {
	const task = tasks.get(taskId);
	if (!task || isTerminalTaskStatus(task.status)) return;
	const activity = activityFor(task);
	activity.lastActivityAt = Math.max(activity.lastActivityAt ?? at, at);
	markChanged(taskId, activity);
}
function readExecutionWait(value) {
	const wait = asOptionalObjectRecord(value);
	if (wait?.kind === "approval" || wait?.kind === "user_input" || wait?.kind === "agent_messages") return { kind: wait.kind };
	if (wait?.kind !== "children" || !Array.isArray(wait.dependencies)) return;
	const dependencies = wait.dependencies.slice(0, 32).flatMap((candidate) => {
		const dependency = asOptionalObjectRecord(candidate);
		const runId = normalizeOptionalString(dependency?.runId);
		const sessionKey = normalizeOptionalString(dependency?.sessionKey);
		return runId ? [{
			runId,
			...sessionKey ? { sessionKey } : {}
		}] : [];
	});
	if (!dependencies.length) return;
	return {
		kind: "children",
		dependencies,
		pendingCount: typeof wait.pendingCount === "number" && Number.isSafeInteger(wait.pendingCount) && wait.pendingCount >= dependencies.length ? wait.pendingCount : dependencies.length
	};
}
function readPreparedTaskActivityItem(event) {
	if (event.stream !== "item" || !Value.Check(liveActivitySchema, event.data)) return;
	const item = projectAgentActivityItem(event.data);
	const itemId = item.itemId ?? (item.kind === "preamble" && item.progressText?.trim() && isCompleteAgentPreamble(item) ? `preamble:${event.seq}` : void 0);
	if (!itemId) return;
	if (item.hideFromChannelProgress || item.suppressChannelProgress) return {
		itemId,
		kind: item.kind,
		phase: item.phase,
		title: "",
		hideFromChannelProgress: item.hideFromChannelProgress,
		suppressChannelProgress: true
	};
	return {
		itemId,
		kind: item.kind,
		phase: item.phase,
		status: item.status,
		title: item.title,
		progressText: item.progressText,
		toolCallId: item.toolCallId,
		name: item.name,
		meta: item.meta,
		commandBearing: item.commandBearing,
		startedAt: item.startedAt,
		endedAt: item.endedAt,
		error: item.error,
		summary: item.summary,
		approvalId: item.approvalId,
		approvalSlug: item.approvalSlug,
		hideFromChannelProgress: item.hideFromChannelProgress,
		suppressChannelProgress: item.suppressChannelProgress
	};
}
/** Folds transient text and file activity into the in-memory task overlay. */
function recordTaskActivityEvent(task, event) {
	const activity = activityFor(task);
	if (activity.executionRunId !== event.runId) {
		activity.executionRunId = event.runId;
		activity.currentTools.clear();
		activity.preparedItems.clear();
		activity.pendingApprovalIds.clear();
		activity.approvalObservationOverflow = void 0;
		activity.pendingDiffByToolCallId.clear();
		activity.executionState = void 0;
		activity.executionWait = void 0;
		activity.executionId = void 0;
		activity.executionSourceId = void 0;
	}
	if (event.stream === "item") {
		const prepared = readPreparedTaskActivityItem(event);
		if (!prepared) return;
		activity.preparedItems.delete(prepared.itemId);
		if (prepared.suppressChannelProgress) return prepared;
		activity.preparedItems.set(prepared.itemId, prepared);
		if (activity.preparedItems.size > MAX_PREPARED_ITEMS) {
			const oldest = activity.preparedItems.keys().next().value;
			if (oldest !== void 0) activity.preparedItems.delete(oldest);
		}
		return prepared;
	}
	if (event.stream === "execution") {
		const approval = asOptionalObjectRecord(event.data.approval);
		const approvalId = normalizeOptionalString(approval?.id);
		if (approvalId && (approval?.state === "pending" || approval?.state === "resolved")) {
			if (approval.state === "pending") {
				if (activity.pendingApprovalIds.size < MAX_CURRENT_TOOLS) activity.pendingApprovalIds.add(approvalId);
				else if (!activity.pendingApprovalIds.has(approvalId)) activity.approvalObservationOverflow = true;
			} else if (!activity.pendingApprovalIds.delete(approvalId)) return;
			activity.lastActivityAt = event.ts;
			markChanged(task.taskId, activity);
			return;
		}
		const sourceId = normalizeOptionalString(event.data.sourceId);
		if (event.data.invalidate === true && (!sourceId || activity.executionSourceId !== sourceId)) return;
		const state = event.data.state;
		if (state !== "running" && state !== "waiting" && state !== "unknown") return;
		const executionId = normalizeOptionalString(event.data.executionId);
		if (state === "unknown" || sourceId && activity.executionSourceId !== sourceId || executionId && activity.executionId !== executionId) {
			activity.currentTools.clear();
			activity.pendingDiffByToolCallId.clear();
		}
		if (sourceId) activity.executionSourceId = sourceId;
		if (executionId) {
			if (activity.executionId && activity.executionId !== executionId) {
				activity.pendingApprovalIds.clear();
				activity.approvalObservationOverflow = void 0;
			}
			activity.executionId = executionId;
		}
		activity.executionState = state;
		activity.executionWait = state === "waiting" ? readExecutionWait(event.data.wait) : void 0;
		activity.lastActivityAt = event.ts;
		markChanged(task.taskId, activity);
		return;
	}
	if (event.stream === "lifecycle") {
		const phase = event.data.phase;
		if (phase === "start" || phase === "end" || phase === "error") {
			activity.executionState = phase === "start" ? "running" : hasExecutionSettlement(event.data) ? "finished" : "unknown";
			activity.executionWait = void 0;
			activity.pendingApprovalIds.clear();
			activity.approvalObservationOverflow = void 0;
			activity.currentTools.clear();
			activity.pendingDiffByToolCallId.clear();
			activity.lastActivityAt = event.ts;
			markChanged(task.taskId, activity);
		}
		return;
	}
	if (event.stream === "tool" && event.data.phase === "start" || event.stream === "assistant" || event.stream === "thinking") {
		if (activity.executionState !== "waiting") {
			activity.executionState = "running";
			activity.executionWait = void 0;
		}
		activity.lastActivityAt = event.ts;
	}
	if (event.stream === "tool" && (event.data.phase === "result" || event.data.phase === "end")) activity.lastActivityAt = event.ts;
	const textStream = event.stream;
	if (textStream === "assistant" || textStream === "thinking") {
		if (textStream === "thinking" && activity.hasAssistantActivity) return;
		const key = textStream === "assistant" ? "assistantText" : "thinkingText";
		let cumulative;
		if (typeof event.data.text === "string") cumulative = event.data.text;
		else if (typeof event.data.delta === "string") cumulative = activity[key] + event.data.delta;
		else return;
		activity[key] = sliceUtf16Safe(cumulative, -4e3);
		const snippet = lastLineSnippet(cumulative);
		if (!snippet) return;
		if (textStream === "assistant") {
			activity.hasAssistantActivity = true;
			activity.thinkingText = "";
		}
		if (activity.lastActivity !== snippet) {
			activity.lastActivity = snippet;
			markChanged(task.taskId, activity);
		}
		return;
	}
	if (event.stream !== "tool") return;
	const toolName = typeof event.data.name === "string" ? event.data.name : "";
	const toolCallId = normalizeOptionalString(event.data.toolCallId);
	if (toolCallId && event.data.phase === "start" && toolName.trim()) {
		if (activity.currentTools.size < MAX_CURRENT_TOOLS || activity.currentTools.has(toolCallId)) {
			activity.currentTools.set(toolCallId, {
				name: toolName.trim(),
				startedAt: event.ts
			});
			markChanged(task.taskId, activity);
		}
	} else if (toolCallId && (event.data.phase === "result" || event.data.phase === "end")) {
		if (activity.currentTools.delete(toolCallId)) markChanged(task.taskId, activity);
	}
	const kind = resolveFileMutationToolName(toolName);
	if (!kind) return;
	if (event.data.phase === "start") {
		const args = asOptionalObjectRecord(event.data.args);
		const delta = args ? readCompletedFileMutationDelta(kind, args) : void 0;
		if (!toolCallId || !delta) return;
		if (!activity.pendingDiffByToolCallId.has(toolCallId) && activity.pendingDiffByToolCallId.size >= MAX_PENDING_DIFFS) return;
		activity.pendingDiffByToolCallId.set(toolCallId, delta);
		return;
	}
	if (event.data.phase !== "result") return;
	const delta = toolCallId ? activity.pendingDiffByToolCallId.get(toolCallId) : void 0;
	if (toolCallId) activity.pendingDiffByToolCallId.delete(toolCallId);
	if (event.data.isError === true || !delta) return;
	let changed = delta.added > 0 || delta.removed > 0;
	for (const file of delta.files) {
		const size = activity.files.size;
		activity.files.add(file);
		changed ||= activity.files.size !== size;
	}
	if (changed) {
		activity.added += delta.added;
		activity.removed += delta.removed;
		markChanged(task.taskId, activity);
	}
}
function getTaskPreparedActivity(taskId) {
	const activity = taskActivityByTaskId.get(taskId);
	const task = tasks.get(taskId);
	return activity && task && activity.runId === (task.runId ?? "") && activity.preparedGeneration === readTaskBackingInstance(task.detail)?.generation ? activity.preparedItems : void 0;
}
function getTaskActivitySnapshot(taskId) {
	const activity = taskActivityByTaskId.get(taskId);
	const currentTool = activity ? [...activity.currentTools.values()].at(-1) : void 0;
	const executionState = activity?.approvalObservationOverflow ? "unknown" : activity?.pendingApprovalIds.size ? "waiting" : activity?.executionState;
	const executionWait = activity?.pendingApprovalIds.size || activity?.approvalObservationOverflow ? { kind: "approval" } : activity?.executionWait;
	return activity ? {
		...activity.executionRunId ? { executionRunId: activity.executionRunId } : {},
		...executionState !== void 0 ? { executionState } : {},
		...executionWait ? { executionWait: { ...executionWait } } : {},
		...activity.lastActivityAt !== void 0 ? { lastActivityAt: activity.lastActivityAt } : {},
		...currentTool ? { currentTool: { ...currentTool } } : {},
		...activity.lastActivity ? { lastActivity: activity.lastActivity } : {},
		...activity.files.size > 0 ? { diffStat: {
			files: activity.files.size,
			added: activity.added,
			removed: activity.removed
		} } : {}
	} : void 0;
}
function flushTaskActivity(taskId) {
	const activity = taskActivityByTaskId.get(taskId);
	if (!activity?.dirty) return;
	if (activity.flushTimer) {
		clearTimeout(activity.flushTimer);
		activity.flushTimer = void 0;
	}
	const task = tasks.get(taskId);
	if (!task || isTerminalTaskStatus(task.status)) {
		clearTaskActivity(taskId);
		return;
	}
	activity.dirty = false;
	activity.lastFlushedAt = Date.now();
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecordForObserver(task)
	}));
}
function clearTaskActivity(taskId) {
	const activity = taskActivityByTaskId.get(taskId);
	if (activity?.flushTimer) clearTimeout(activity.flushTimer);
	activity?.preparedItems.clear();
	taskActivityByTaskId.delete(taskId);
}
//#endregion
export { invalidateTaskActivity as a, getTaskPreparedActivity as i, flushTaskActivity as n, readPreparedTaskActivityItem as o, getTaskActivitySnapshot as r, recordTaskActivityEvent as s, clearTaskActivity as t };
