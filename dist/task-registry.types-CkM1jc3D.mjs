//#region src/tasks/task-registry.types.ts
/** Runtime families that own task run lifecycles. */
const TASK_RUNTIMES = [
	"subagent",
	"acp",
	"cron",
	"cli"
];
const TASK_STATUSES = [
	"queued",
	"running",
	"succeeded",
	"failed",
	"timed_out",
	"cancelled",
	"lost"
];
const TASK_STATUS_FILTERS = [...TASK_STATUSES, "blocked"];
/** Returns whether a task status is terminal for delivery and retention policy. */
function isTerminalTaskStatus(status) {
	return status === "succeeded" || status === "failed" || status === "timed_out" || status === "cancelled" || status === "lost";
}
function matchesTaskStatusFilter(task, filter) {
	return task.status === filter || filter === "blocked" && task.status === "succeeded" && task.terminalOutcome === "blocked";
}
const TASK_RUNTIME_SET = new Set(TASK_RUNTIMES);
const TASK_STATUS_SET = new Set(TASK_STATUSES);
const TASK_DELIVERY_STATUSES = /* @__PURE__ */ new Set([
	"pending",
	"delivered",
	"session_queued",
	"failed",
	"dismissed",
	"parent_missing",
	"not_applicable"
]);
const TASK_NOTIFY_POLICIES = /* @__PURE__ */ new Set([
	"done_only",
	"state_changes",
	"silent"
]);
const TASK_TERMINAL_OUTCOMES = /* @__PURE__ */ new Set(["succeeded", "blocked"]);
const TASK_SCOPE_KINDS = /* @__PURE__ */ new Set(["session", "system"]);
function parsePersistedTaskValue(value, values, label) {
	if (typeof value === "string" && values.has(value)) return value;
	throw new Error(`Invalid persisted task ${label}: ${JSON.stringify(value)}`);
}
function parseTaskRuntime(value) {
	return parsePersistedTaskValue(value, TASK_RUNTIME_SET, "runtime");
}
function parseTaskStatus(value) {
	return parsePersistedTaskValue(value, TASK_STATUS_SET, "status");
}
function parseTaskDeliveryStatus(value) {
	return parsePersistedTaskValue(value, TASK_DELIVERY_STATUSES, "delivery status");
}
function parseTaskNotifyPolicy(value) {
	return parsePersistedTaskValue(value, TASK_NOTIFY_POLICIES, "notify policy");
}
function parseTaskScopeKind(value) {
	return parsePersistedTaskValue(value, TASK_SCOPE_KINDS, "scope kind");
}
function parseOptionalTaskTerminalOutcome(value) {
	if (value == null || value === "") return;
	return parsePersistedTaskValue(value, TASK_TERMINAL_OUTCOMES, "terminal outcome");
}
//#endregion
export { parseOptionalTaskTerminalOutcome as a, parseTaskRuntime as c, matchesTaskStatusFilter as i, parseTaskScopeKind as l, TASK_STATUS_FILTERS as n, parseTaskDeliveryStatus as o, isTerminalTaskStatus as r, parseTaskNotifyPolicy as s, TASK_RUNTIMES as t, parseTaskStatus as u };
