import { n as isTerminalTaskFlow } from "./task-flow-registry.types-BidrdCoB.mjs";
//#region src/tasks/task-flow-maintenance-policy.ts
const TASK_FLOW_RETENTION_MS = 6048e5;
/** Repair and cancellation each consume a pass before retention can remove the flow. */
function resolveTaskFlowMaintenanceAction(flow, now, hasPendingTasks) {
	if (flow.syncMode === "task_mirrored" && isTerminalTaskFlow(flow) && flow.endedAt != null && flow.endedAt >= flow.createdAt && flow.updatedAt > flow.endedAt) return {
		kind: "repair",
		patch: { updatedAt: flow.endedAt }
	};
	if (flow.syncMode === "managed" && flow.cancelRequestedAt != null && !isTerminalTaskFlow(flow)) {
		if (hasPendingTasks()) return;
		const endedAt = Math.max(now, flow.updatedAt, flow.cancelRequestedAt);
		return {
			kind: "cancel",
			patch: {
				status: "cancelled",
				blockedTaskId: null,
				blockedSummary: null,
				waitJson: null,
				endedAt,
				updatedAt: endedAt
			}
		};
	}
	if (isTerminalTaskFlow(flow) && now - (flow.endedAt ?? flow.updatedAt ?? flow.createdAt) >= TASK_FLOW_RETENTION_MS && !hasPendingTasks()) return { kind: "prune" };
}
//#endregion
export { resolveTaskFlowMaintenanceAction as t };
