import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-BaxMDLZF.mjs";
//#region src/agents/media-generation-activity.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.mediaGenerationOperations"), () => ({
	operations: /* @__PURE__ */ new Map(),
	active: /* @__PURE__ */ new Map(),
	owners: /* @__PURE__ */ new Map(),
	admissions: /* @__PURE__ */ new Map()
}));
const RECENT_COMPLETION_MS = 12e4;
function pruneCompletedOperations() {
	const now = Date.now();
	const cutoff = now - RECENT_COMPLETION_MS;
	const generation = getAgentRunLifecycleGeneration();
	for (const [id, operation] of state.operations) if (state.owners.get(id) !== generation || operation.endedAt !== void 0 && operation.endedAt < (operation.terminalOutcome === "blocked" ? now - 6048e5 : cutoff)) {
		state.operations.delete(id);
		state.active.delete(id);
		state.owners.delete(id);
	}
}
function registerGeneratedMediaTaskActivity(runId, sessionKey, requesterAgentId) {
	if (!runId || !sessionKey) return;
	const generation = getAgentRunLifecycleGeneration();
	const owner = state.owners.get(runId);
	if (owner && owner !== generation) return;
	state.owners.set(runId, generation);
	const agentId = requesterAgentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	const admissionKey = `${generation}\0${agentId ?? ""}\0${sessionKey}`;
	if (!state.active.has(runId)) {
		state.admissions.delete(admissionKey);
		state.admissions.set(admissionKey, runId);
		pruneMapToMaxSize(state.admissions, 2048);
	}
	state.active.set(runId, {
		sessionKey,
		agentId,
		generation
	});
}
function clearGeneratedMediaTaskActivity(runId) {
	state.active.delete(runId);
}
function createMediaGenerationOperation(operation) {
	pruneCompletedOperations();
	if (!operation.runId || state.operations.has(operation.runId)) throw new Error("Media operation identity already admitted");
	state.operations.set(operation.runId, operation);
	registerGeneratedMediaTaskActivity(operation.runId, operation.requesterSessionKey, operation.requesterAgentId);
	return operation;
}
function updateMediaGenerationOperation(runId, update) {
	const operation = state.operations.get(runId);
	if (!operation || !isMediaGenerationOperationCurrent(runId) || operation.endedAt !== void 0) return;
	Object.assign(operation, update);
}
function findMediaGenerationOperation(runId) {
	return isMediaGenerationOperationCurrent(runId) ? state.operations.get(runId) : void 0;
}
function listMediaGenerationOperations(sessionKey, requesterAgentId) {
	pruneCompletedOperations();
	const agentId = requesterAgentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	if (!agentId) return [];
	return [...state.operations.values()].filter((operation) => operation.requesterSessionKey === sessionKey && (operation.requesterAgentId ?? parseAgentSessionKey(operation.requesterSessionKey)?.agentId) === agentId && Boolean(operation.runId && isMediaGenerationOperationCurrent(operation.runId)));
}
function isTerminalMediaGenerationStatus(status) {
	return status === "succeeded" || status === "failed";
}
function getGeneratedMediaTaskIdsForSessionKey(sessionKey, requesterAgentId) {
	if (!sessionKey) return /* @__PURE__ */ new Set();
	const agentId = requesterAgentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	if (!agentId) return /* @__PURE__ */ new Set();
	const latest = state.admissions.get(`${getAgentRunLifecycleGeneration()}\0${agentId}\0${sessionKey}`);
	return /* @__PURE__ */ new Set([...listMediaGenerationOperations(sessionKey, agentId).map((operation) => operation.taskId), ...latest ? ["run:" + latest] : []]);
}
function hasNewGeneratedMediaTaskForSessionKey(sessionKey, before, requesterAgentId) {
	return [...getGeneratedMediaTaskIdsForSessionKey(sessionKey, requesterAgentId)].some((id) => !before.has(id));
}
function hasPendingGeneratedMediaTaskForSessionKey(sessionKey, requesterAgentId) {
	const agentId = requesterAgentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	if (!agentId) return false;
	return [...state.active.values()].some((activity) => activity.sessionKey === sessionKey && activity.agentId === agentId && activity.generation === getAgentRunLifecycleGeneration());
}
function buildPendingGeneratedMediaSessionKeySet() {
	return new Set([...state.active.values()].filter((activity) => activity.generation === getAgentRunLifecycleGeneration()).map((activity) => activity.sessionKey));
}
function getActiveMediaGenerationRunCount() {
	pruneCompletedOperations();
	return [...state.active.values()].filter((activity) => activity.generation === getAgentRunLifecycleGeneration()).length;
}
function isMediaGenerationOperationCurrent(runId) {
	return state.owners.get(runId) === getAgentRunLifecycleGeneration();
}
//#endregion
export { getActiveMediaGenerationRunCount as a, hasPendingGeneratedMediaTaskForSessionKey as c, listMediaGenerationOperations as d, registerGeneratedMediaTaskActivity as f, findMediaGenerationOperation as i, isMediaGenerationOperationCurrent as l, clearGeneratedMediaTaskActivity as n, getGeneratedMediaTaskIdsForSessionKey as o, updateMediaGenerationOperation as p, createMediaGenerationOperation as r, hasNewGeneratedMediaTaskForSessionKey as s, buildPendingGeneratedMediaSessionKeySet as t, isTerminalMediaGenerationStatus as u };
