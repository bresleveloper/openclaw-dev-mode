import { a as summarizeTaskRecords } from "./task-registry.summary-BJx95J9k.mjs";
//#region src/tasks/task-domain-views.ts
/** Maps internal task summary counts to the plugin task-domain view contract. */
function mapTaskRunAggregateSummary(summary) {
	return {
		total: summary.total,
		active: summary.active,
		terminal: summary.terminal,
		failures: summary.failures,
		byStatus: { ...summary.byStatus },
		byRuntime: { ...summary.byRuntime }
	};
}
function mapTaskRunView(task) {
	return {
		id: task.taskId,
		runtime: task.runtime,
		...task.sourceId ? { sourceId: task.sourceId } : {},
		sessionKey: task.requesterSessionKey,
		ownerKey: task.ownerKey,
		scope: task.scopeKind,
		...task.childSessionKey ? { childSessionKey: task.childSessionKey } : {},
		...task.parentFlowId ? { flowId: task.parentFlowId } : {},
		...task.parentTaskId ? { parentTaskId: task.parentTaskId } : {},
		...task.agentId ? { agentId: task.agentId } : {},
		...task.runId ? { runId: task.runId } : {},
		...task.label ? { label: task.label } : {},
		title: task.task,
		status: task.status,
		deliveryStatus: task.deliveryStatus,
		notifyPolicy: task.notifyPolicy,
		createdAt: task.createdAt,
		...task.startedAt !== void 0 ? { startedAt: task.startedAt } : {},
		...task.endedAt !== void 0 ? { endedAt: task.endedAt } : {},
		...task.lastEventAt !== void 0 ? { lastEventAt: task.lastEventAt } : {},
		...task.cleanupAfter !== void 0 ? { cleanupAfter: task.cleanupAfter } : {},
		...task.error ? { error: task.error } : {},
		...task.progressSummary ? { progressSummary: task.progressSummary } : {},
		...task.terminalSummary ? { terminalSummary: task.terminalSummary } : {},
		...task.terminalOutcome ? { terminalOutcome: task.terminalOutcome } : {}
	};
}
function mapTaskRunDetail(task) {
	return mapTaskRunView(task);
}
function mapTaskFlowView(flow) {
	return {
		id: flow.flowId,
		ownerKey: flow.ownerKey,
		...flow.requesterOrigin ? { requesterOrigin: { ...flow.requesterOrigin } } : {},
		status: flow.status,
		notifyPolicy: flow.notifyPolicy,
		goal: flow.goal,
		...flow.currentStep ? { currentStep: flow.currentStep } : {},
		...flow.cancelRequestedAt !== void 0 ? { cancelRequestedAt: flow.cancelRequestedAt } : {},
		createdAt: flow.createdAt,
		updatedAt: flow.updatedAt,
		...flow.endedAt !== void 0 ? { endedAt: flow.endedAt } : {}
	};
}
function mapTaskFlowDetail(params) {
	const summary = params.summary ?? summarizeTaskRecords(params.tasks);
	return {
		...mapTaskFlowView(params.flow),
		...params.flow.stateJson !== void 0 ? { state: params.flow.stateJson } : {},
		...params.flow.waitJson !== void 0 ? { wait: params.flow.waitJson } : {},
		...params.flow.blockedTaskId || params.flow.blockedSummary ? { blocked: {
			...params.flow.blockedTaskId ? { taskId: params.flow.blockedTaskId } : {},
			...params.flow.blockedSummary ? { summary: params.flow.blockedSummary } : {}
		} } : {},
		tasks: params.tasks.map((task) => mapTaskRunView(task)),
		taskSummary: mapTaskRunAggregateSummary(summary)
	};
}
//#endregion
export { mapTaskRunView as a, mapTaskRunDetail as i, mapTaskFlowView as n, mapTaskRunAggregateSummary as r, mapTaskFlowDetail as t };
