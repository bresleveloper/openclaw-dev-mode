//#region packages/agent-core/src/internal-hooks.ts
const beforeToolBatchByAgent = /* @__PURE__ */ new WeakMap();
const toolTurnCompletionByAgent = /* @__PURE__ */ new WeakMap();
const toolBatchLifecycleByResult = /* @__PURE__ */ new WeakMap();
const syncSteeringGetterByCallback = /* @__PURE__ */ new WeakMap();
const steeringQueueObserverByCallback = /* @__PURE__ */ new WeakMap();
const toolExecutionPreparerByTool = /* @__PURE__ */ new WeakMap();
const toolResultAcknowledgementByValue = /* @__PURE__ */ new WeakMap();
const toolResultProvenanceByValue = /* @__PURE__ */ new WeakMap();
const toolResultContentSourceByValue = /* @__PURE__ */ new WeakMap();
/** Install OpenClaw-owned loop control without adding a plugin-facing Agent option. */
function setInternalBeforeToolBatch(agent, hook) {
	if (hook) beforeToolBatchByAgent.set(agent, hook);
	else beforeToolBatchByAgent.delete(agent);
}
function getInternalBeforeToolBatch(agent) {
	return beforeToolBatchByAgent.get(agent);
}
function setInternalToolTurnCompletion(agent, hook) {
	if (hook) toolTurnCompletionByAgent.set(agent, hook);
	else toolTurnCompletionByAgent.delete(agent);
}
function getInternalToolTurnCompletion(agent) {
	return toolTurnCompletionByAgent.get(agent);
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
/**
* Mark one result or thrown error as carrying content from a nested call whose
* tool declares a result content source. Dispatchers such as Tool Search and
* Code Mode use this because their own static declaration cannot describe each
* call; finalization combines it with the executed tool's declaration.
*/
function attachInternalToolResultContentSource(value, source) {
	toolResultContentSourceByValue.set(value, source);
	return value;
}
function getInternalToolResultContentSource(value) {
	return toolResultContentSourceByValue.get(value);
}
/** Carry private commit ownership through result transforms and message construction. */
function copyInternalToolResultState(source, target) {
	const acknowledge = toolResultAcknowledgementByValue.get(source);
	if (acknowledge) toolResultAcknowledgementByValue.set(target, acknowledge);
	const provenance = toolResultProvenanceByValue.get(source);
	if (provenance) toolResultProvenanceByValue.set(target, provenance);
	const contentSource = toolResultContentSourceByValue.get(source);
	if (contentSource) toolResultContentSourceByValue.set(target, contentSource);
	return target;
}
/**
* Feedback must not change no-progress hashes: call only after raw outcome
* recording, or for rejected calls whose validation result admission captured.
*/
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
export { getInternalToolTurnCompletion as _, attachInternalToolExecutionPreparer as a, takeInternalToolBatchLifecycle as b, attachInternalToolResultProvenance as c, getInternalBeforeToolBatch as d, getInternalSteeringQueueObserver as f, getInternalToolResultProvenance as g, getInternalToolResultContentSource as h, attachInternalToolBatchLifecycle as i, copyInternalToolExecutionPreparer as l, getInternalToolExecutionPreparer as m, appendToolLoopWarning as n, attachInternalToolResultAcknowledgement as o, getInternalSyncSteeringGetter as p, attachInternalSyncSteeringGetter as r, attachInternalToolResultContentSource as s, acknowledgeInternalToolResult as t, copyInternalToolResultState as u, setInternalBeforeToolBatch as v, setInternalToolTurnCompletion as y };
