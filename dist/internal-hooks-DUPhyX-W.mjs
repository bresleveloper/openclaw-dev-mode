//#region packages/agent-core/src/internal-hooks.ts
const beforeToolBatchByAgent = /* @__PURE__ */ new WeakMap();
const toolBatchLifecycleByResult = /* @__PURE__ */ new WeakMap();
const syncSteeringGetterByCallback = /* @__PURE__ */ new WeakMap();
const steeringQueueObserverByCallback = /* @__PURE__ */ new WeakMap();
const toolExecutionPreparerByTool = /* @__PURE__ */ new WeakMap();
const toolResultAcknowledgementByValue = /* @__PURE__ */ new WeakMap();
const toolResultProvenanceByValue = /* @__PURE__ */ new WeakMap();
/** Install OpenClaw-owned loop control without adding a plugin-facing Agent option. */
function setInternalBeforeToolBatch(agent, hook) {
	if (hook) beforeToolBatchByAgent.set(agent, hook);
	else beforeToolBatchByAgent.delete(agent);
}
function getInternalBeforeToolBatch(agent) {
	return beforeToolBatchByAgent.get(agent);
}
/** Attach scheduler lifecycle ownership without widening the public admission result. */
function attachInternalToolBatchLifecycle(result, lifecycle) {
	toolBatchLifecycleByResult.set(result, lifecycle);
	return result;
}
function takeInternalToolBatchLifecycle(result) {
	const lifecycle = toolBatchLifecycleByResult.get(result);
	toolBatchLifecycleByResult.delete(result);
	return lifecycle;
}
/** Attach Agent-owned synchronous draining to the exact public async callback identity. */
function attachInternalSyncSteeringGetter(callback, syncGetter, observer) {
	syncSteeringGetterByCallback.set(callback, syncGetter);
	if (observer) steeringQueueObserverByCallback.set(callback, observer);
	return callback;
}
function getInternalSteeringQueueObserver(callback) {
	return callback ? steeringQueueObserverByCallback.get(callback) : void 0;
}
function getInternalSyncSteeringGetter(callback) {
	return syncSteeringGetterByCallback.get(callback);
}
/** Attach OpenClaw-owned two-phase execution without changing the public AgentTool shape. */
function attachInternalToolExecutionPreparer(tool, preparer) {
	toolExecutionPreparerByTool.set(tool, preparer);
	return tool;
}
function getInternalToolExecutionPreparer(tool) {
	return toolExecutionPreparerByTool.get(tool);
}
/** Preserve private execution ownership when an adapter replaces a tool object. */
function copyInternalToolExecutionPreparer(source, target) {
	const preparer = toolExecutionPreparerByTool.get(source);
	if (preparer) toolExecutionPreparerByTool.set(target, preparer);
	return target;
}
/** Keep a destructive tool-side commit behind the result persistence boundary. */
function attachInternalToolResultAcknowledgement(value, acknowledge) {
	toolResultAcknowledgementByValue.set(value, acknowledge);
	return value;
}
function attachInternalToolResultProvenance(value, provenance) {
	if (provenance) toolResultProvenanceByValue.set(value, provenance);
	else toolResultProvenanceByValue.delete(value);
	return value;
}
function getInternalToolResultProvenance(value) {
	return toolResultProvenanceByValue.get(value);
}
/** Carry private commit ownership through result transforms and message construction. */
function copyInternalToolResultState(source, target) {
	const acknowledge = toolResultAcknowledgementByValue.get(source);
	if (acknowledge) toolResultAcknowledgementByValue.set(target, acknowledge);
	const provenance = toolResultProvenanceByValue.get(source);
	if (provenance) toolResultProvenanceByValue.set(target, provenance);
	return target;
}
/** Call only after raw outcome recording: feedback must not change no-progress hashes. */
function appendToolLoopWarning(result, warning) {
	return copyInternalToolResultState(result, {
		...result,
		content: [...result.content ?? [], {
			type: "text",
			text: `[System note: Tool-loop warning after ${warning.count} repeated calls. Change your approach or stop if you are not making progress.]`
		}]
	});
}
/** Commit one tool result after its owning message has attached. */
function acknowledgeInternalToolResult(value) {
	const acknowledge = toolResultAcknowledgementByValue.get(value);
	if (!acknowledge) return;
	toolResultAcknowledgementByValue.delete(value);
	acknowledge();
}
//#endregion
export { attachInternalToolExecutionPreparer as a, copyInternalToolExecutionPreparer as c, getInternalSteeringQueueObserver as d, getInternalSyncSteeringGetter as f, takeInternalToolBatchLifecycle as g, setInternalBeforeToolBatch as h, attachInternalToolBatchLifecycle as i, copyInternalToolResultState as l, getInternalToolResultProvenance as m, appendToolLoopWarning as n, attachInternalToolResultAcknowledgement as o, getInternalToolExecutionPreparer as p, attachInternalSyncSteeringGetter as r, attachInternalToolResultProvenance as s, acknowledgeInternalToolResult as t, getInternalBeforeToolBatch as u };
