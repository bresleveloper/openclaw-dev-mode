import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as getAgentRunLifecycleGeneration } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
//#region src/agents/media-generation-activity.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.mediaGenerationOperations"), () => ({
	operations: /* @__PURE__ */ new Map(),
	active: /* @__PURE__ */ new Map(),
	owners: /* @__PURE__ */ new Map(),
	admissions: /* @__PURE__ */ new Map(),
	drafts: /* @__PURE__ */ new Map()
}));
const RECENT_COMPLETION_MS = 12e4;
function pruneCompletedOperations() {
	const now = Date.now();
	const cutoff = now - RECENT_COMPLETION_MS;
	const generation = getAgentRunLifecycleGeneration();
	for (const [id, operation] of state.operations) if (state.owners.get(id) !== generation || operation.endedAt !== void 0 && operation.endedAt < (operation.terminalOutcome === "blocked" ? now - 6048e5 : cutoff)) {
		clearGeneratedMediaTaskActivity(id);
		state.operations.delete(id);
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
/**
* Every ending path clears activity after its completion wake. A retained card
* leaves once every run delivered its result; otherwise it keeps the failed run
* as the chat's visible outcome.
*/
function clearGeneratedMediaTaskActivity(runId) {
	state.active.delete(runId);
	const live = state.drafts.get(runId);
	const title = live?.runs.get(runId);
	if (!live || !title) return;
	state.drafts.delete(runId);
	live.runs.delete(runId);
	const operation = state.operations.get(runId);
	const delivered = operation?.status === "succeeded" && operation.terminalOutcome !== "blocked";
	live.undelivered ||= !delivered;
	if (live.runs.size === 0 && !live.undelivered) {
		live.draft.retire();
		return;
	}
	live.draft.push({
		itemId: runId,
		kind: "subagent",
		title,
		phase: "end",
		status: delivered ? "completed" : "failed"
	});
}
/**
* Keep a waiting turn's confirmed progress card while the media runs it delegated
* to are still owed. The completion wake stays the only result owner; each run
* shows as delegated work, whose terminal state the quiet card keeps.
*/
function adoptMediaGenerationProgressDraft(sessionKey, requesterAgentId, draft) {
	const runs = new Map(listMediaGenerationOperations(sessionKey, requesterAgentId).flatMap((operation) => operation.runId && state.active.has(operation.runId) && !state.drafts.has(operation.runId) ? [[operation.runId, `${operation.taskKind.charAt(0).toUpperCase()}${operation.taskKind.slice(1).replaceAll("_", " ")}`]] : []));
	if (runs.size === 0) return false;
	const live = {
		draft,
		runs,
		undelivered: false
	};
	for (const [runId, title] of runs) {
		state.drafts.set(runId, live);
		draft.push({
			itemId: runId,
			kind: "subagent",
			title,
			phase: "update",
			status: "running"
		});
	}
	return true;
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
export { findMediaGenerationOperation as a, hasNewGeneratedMediaTaskForSessionKey as c, isTerminalMediaGenerationStatus as d, listMediaGenerationOperations as f, createMediaGenerationOperation as i, hasPendingGeneratedMediaTaskForSessionKey as l, updateMediaGenerationOperation as m, buildPendingGeneratedMediaSessionKeySet as n, getActiveMediaGenerationRunCount as o, registerGeneratedMediaTaskActivity as p, clearGeneratedMediaTaskActivity as r, getGeneratedMediaTaskIdsForSessionKey as s, adoptMediaGenerationProgressDraft as t, isMediaGenerationOperationCurrent as u };
