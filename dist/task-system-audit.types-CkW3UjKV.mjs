import { n as TASK_AUDIT_SEVERITIES, t as TASK_AUDIT_CODES } from "./task-registry.audit.shared-2IJPSTDV.mjs";
//#region src/tasks/task-flow-registry.audit.types.ts
/** Canonical task-flow audit finding vocabulary. */
const TASK_FLOW_AUDIT_CODES = [
	"restore_failed",
	"stale_running",
	"stale_waiting",
	"stale_blocked",
	"cancel_stuck",
	"missing_linked_tasks",
	"blocked_task_missing",
	"inconsistent_timestamps"
];
//#endregion
//#region src/tasks/task-system-audit.types.ts
/** De-duplicated vocabulary accepted by the combined tasks audit command. */
const TASK_SYSTEM_AUDIT_CODES = [...TASK_AUDIT_CODES, ...TASK_FLOW_AUDIT_CODES.filter((flowCode) => !TASK_AUDIT_CODES.some((taskCode) => taskCode === flowCode))];
const TASK_SYSTEM_AUDIT_SEVERITIES = TASK_AUDIT_SEVERITIES;
//#endregion
export { TASK_SYSTEM_AUDIT_SEVERITIES as n, TASK_SYSTEM_AUDIT_CODES as t };
