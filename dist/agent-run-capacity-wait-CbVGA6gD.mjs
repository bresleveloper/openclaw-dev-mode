import { A as bumpAgentRunIndexVersion, c as getAgentRunContext, d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-DiXxneBV.mjs";
//#region src/infra/agent-run-capacity-wait.ts
function isAgentRunWaitingForCapacity(runId) {
	const context = getAgentRunContext(runId);
	return context !== void 0 && context.lifecycleGeneration === getAgentRunLifecycleGeneration() && (context.capacityWaits?.size ?? 0) > 0;
}
/** Records a scheduler-owned wait and releases only the exact captured run instance. */
function registerAgentRunCapacityWait(runId, lifecycleGeneration) {
	const context = getAgentRunContext(runId);
	if (!context || context.lifecycleGeneration !== lifecycleGeneration || lifecycleGeneration !== getAgentRunLifecycleGeneration()) return;
	const waits = context.capacityWaits ??= /* @__PURE__ */ new Set();
	const token = Symbol("agent-run-capacity-wait");
	const publish = () => {
		bumpAgentRunIndexVersion(context);
		if (context.sessionKey && context.projectSessionLifecycle !== false && context.projectSessionActive !== false) emitSessionLifecycleEvent({
			sessionKey: context.sessionKey,
			agentId: context.agentId,
			reason: "run-capacity",
			scope: "runtime"
		});
	};
	waits.add(token);
	if (waits.size === 1) publish();
	return () => {
		if (getAgentRunContext(runId) !== context || context.lifecycleGeneration !== getAgentRunLifecycleGeneration() || !waits.delete(token) || waits.size > 0) return;
		delete context.capacityWaits;
		publish();
	};
}
//#endregion
export { registerAgentRunCapacityWait as n, isAgentRunWaitingForCapacity as t };
