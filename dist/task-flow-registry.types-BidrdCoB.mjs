//#region src/tasks/task-flow-registry.types.ts
/** Lifecycle statuses for multi-step task flows. */
const TASK_FLOW_STATUSES = [
	"queued",
	"running",
	"waiting",
	"blocked",
	"succeeded",
	"failed",
	"cancelled",
	"lost"
];
const TASK_FLOW_SYNC_MODES = /* @__PURE__ */ new Set(["task_mirrored", "managed"]);
const TASK_FLOW_STATUS_SET = new Set(TASK_FLOW_STATUSES);
function parsePersistedFlowValue(value, values, label) {
	if (typeof value === "string" && values.has(value)) return value;
	throw new Error(`Invalid persisted task flow ${label}: ${JSON.stringify(value)}`);
}
function parseOptionalTaskFlowSyncMode(value) {
	if (value == null || value === "") return;
	return parsePersistedFlowValue(value, TASK_FLOW_SYNC_MODES, "sync mode");
}
function parseTaskFlowStatus(value) {
	return parsePersistedFlowValue(value, TASK_FLOW_STATUS_SET, "status");
}
function isTerminalTaskFlow(flow) {
	return flow.status === "succeeded" || flow.status === "blocked" && flow.endedAt != null || flow.status === "failed" || flow.status === "cancelled" || flow.status === "lost";
}
//#endregion
export { parseTaskFlowStatus as i, isTerminalTaskFlow as n, parseOptionalTaskFlowSyncMode as r, TASK_FLOW_STATUSES as t };
