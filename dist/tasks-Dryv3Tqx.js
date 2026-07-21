import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as parseAgentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { f as listTaskRecords, s as getTaskById } from "./task-registry-Bv5-Vohd.js";
import "./runtime-internal-OiU0x_qm.js";
import { t as cancelDetachedTaskRunById } from "./detached-task-runtime-BRur6lzE.js";
import { dr as validateTasksGetParams, fr as validateTasksListParams, t as formatValidationErrors, ur as validateTasksCancelParams } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { n as taskUpdatedAt, t as mapTaskSummary } from "./task-summary-CnT4L5A1.js";
//#region src/gateway/server-methods/tasks.ts
const DEFAULT_TASKS_LIST_LIMIT = 100;
const MAX_TASKS_LIST_LIMIT = 500;
const LEDGER_STATUS_TO_TASK_STATUSES = {
	queued: ["queued"],
	running: ["running"],
	completed: ["succeeded"],
	failed: ["failed", "lost"],
	timed_out: ["timed_out"],
	cancelled: ["cancelled"]
};
function normalizeTaskStatusFilter(status) {
	if (!status) return null;
	return new Set((Array.isArray(status) ? status : [status]).flatMap((value) => LEDGER_STATUS_TO_TASK_STATUSES[value] ?? []));
}
function taskMatchesSession(task, sessionKey) {
	const normalized = normalizeOptionalString(sessionKey);
	if (!normalized) return true;
	return [
		task.requesterSessionKey,
		task.childSessionKey,
		task.ownerKey
	].some((candidate) => normalizeOptionalString(candidate) === normalized);
}
function taskMatchesAgent(task, agentId) {
	const normalized = normalizeOptionalString(agentId);
	if (!normalized) return true;
	const explicitAgentId = normalizeOptionalString(task.agentId);
	if (explicitAgentId) return explicitAgentId === normalized;
	return [
		task.requesterSessionKey,
		task.childSessionKey,
		task.ownerKey
	].some((candidate) => parseAgentSessionKey(candidate)?.agentId === normalized);
}
function parseCursor(cursor) {
	if (!cursor) return 0;
	if (!/^\d+$/.test(cursor.trim())) return null;
	const parsed = Number(cursor);
	return Number.isSafeInteger(parsed) ? parsed : null;
}
const tasksHandlers = {
	"tasks.list": ({ params, respond }) => {
		if (!validateTasksListParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid tasks.list params: ${formatValidationErrors(validateTasksListParams.errors)}`));
			return;
		}
		const cursor = parseCursor(params.cursor);
		if (cursor === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid tasks.list cursor"));
			return;
		}
		const statusFilter = normalizeTaskStatusFilter(params.status);
		const limit = Math.min(params.limit ?? DEFAULT_TASKS_LIST_LIMIT, MAX_TASKS_LIST_LIMIT);
		const filtered = listTaskRecords().filter((task) => {
			if (statusFilter && !statusFilter.has(task.status)) return false;
			return taskMatchesAgent(task, params.agentId) && taskMatchesSession(task, params.sessionKey);
		}).toSorted((left, right) => {
			const updatedDiff = taskUpdatedAt(right) - taskUpdatedAt(left);
			if (updatedDiff !== 0) return updatedDiff;
			return left.taskId < right.taskId ? -1 : left.taskId > right.taskId ? 1 : 0;
		});
		const page = filtered.slice(cursor, cursor + limit);
		const nextOffset = cursor + page.length;
		respond(true, {
			tasks: page.map((task) => mapTaskSummary(task)),
			...nextOffset < filtered.length ? { nextCursor: String(nextOffset) } : {}
		});
	},
	"tasks.get": ({ params, respond }) => {
		if (!validateTasksGetParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid tasks.get params: ${formatValidationErrors(validateTasksGetParams.errors)}`));
			return;
		}
		const taskId = params.taskId;
		const task = getTaskById(taskId);
		if (!task) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `task not found: ${taskId}`));
			return;
		}
		respond(true, { task: mapTaskSummary(task) });
	},
	"tasks.cancel": async ({ params, respond, context }) => {
		if (!validateTasksCancelParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid tasks.cancel params: ${formatValidationErrors(validateTasksCancelParams.errors)}`));
			return;
		}
		const taskId = params.taskId;
		const reason = normalizeOptionalString(params.reason);
		const result = await cancelDetachedTaskRunById({
			cfg: context.getRuntimeConfig(),
			taskId,
			...reason ? { reason } : {}
		});
		respond(true, {
			found: result.found,
			cancelled: result.cancelled,
			...result.reason ? { reason: result.reason } : {},
			...result.task ? { task: mapTaskSummary(result.task) } : {}
		});
	}
};
const testApi = { mapTaskSummary };
//#endregion
export { testApi as __test, testApi, tasksHandlers };
