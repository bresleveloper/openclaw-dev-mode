import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.js";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/agent-events.ts
const AGENT_EVENT_STATE_KEY = Symbol.for("openclaw.agentEvents.state");
const AGENT_EVENT_EXECUTION_CONTEXT_KEY = Symbol.for("openclaw.agentEvents.executionContext");
function getAgentEventState() {
	return resolveGlobalSingleton(AGENT_EVENT_STATE_KEY, () => ({
		seqByRun: /* @__PURE__ */ new Map(),
		listeners: /* @__PURE__ */ new Set(),
		runContextById: /* @__PURE__ */ new Map(),
		lifecycleGeneration: randomUUID()
	}));
}
function getAgentEventExecutionContext() {
	return resolveGlobalSingleton(AGENT_EVENT_EXECUTION_CONTEXT_KEY, () => new AsyncLocalStorage());
}
/** Runs one execution with immutable ownership inherited by every emitted stream event. */
function withAgentRunLifecycleGeneration(lifecycleGeneration, run) {
	return getAgentEventExecutionContext().run({ lifecycleGeneration }, run);
}
function getAgentEventLifecycleGeneration() {
	return getAgentEventState().lifecycleGeneration;
}
/** Rejects work that no longer belongs to the active gateway lifecycle. */
function assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration) {
	if (lifecycleGeneration === getAgentEventState().lifecycleGeneration) return;
	const error = /* @__PURE__ */ new Error("Agent run belongs to a stale gateway lifecycle");
	error.name = "AbortError";
	throw error;
}
/** Captures immutable lifecycle ownership for one admitted execution. */
function captureAgentRunLifecycleGeneration(runId) {
	return getAgentEventExecutionContext().getStore()?.lifecycleGeneration ?? getAgentEventState().runContextById.get(runId)?.lifecycleGeneration ?? getAgentEventState().lifecycleGeneration;
}
/** Starts a new ownership generation before an in-process gateway restart. */
function rotateAgentEventLifecycleGeneration() {
	const state = getAgentEventState();
	state.lifecycleGeneration = randomUUID();
	return state.lifecycleGeneration;
}
/** Registers or merges per-run context used by later agent event emissions. */
function registerAgentRunContext(runId, context) {
	if (!runId) return;
	const state = getAgentEventState();
	const existing = state.runContextById.get(runId);
	if (!existing) {
		state.runContextById.set(runId, {
			...context,
			lifecycleGeneration: context.lifecycleGeneration ?? state.lifecycleGeneration,
			registeredAt: context.registeredAt ?? Date.now()
		});
		return;
	}
	if (context.lifecycleGeneration && existing.lifecycleGeneration && context.lifecycleGeneration !== existing.lifecycleGeneration) return;
	if (context.sessionKey && existing.sessionKey !== context.sessionKey) existing.sessionKey = context.sessionKey;
	if (context.sessionId && existing.sessionId !== context.sessionId) existing.sessionId = context.sessionId;
	if (context.verboseLevel && existing.verboseLevel !== context.verboseLevel) existing.verboseLevel = context.verboseLevel;
	if (context.isControlUiVisible !== void 0) existing.isControlUiVisible = context.isControlUiVisible;
	if (context.isHeartbeat !== void 0 && existing.isHeartbeat !== context.isHeartbeat) existing.isHeartbeat = context.isHeartbeat;
	if (context.registeredAt !== void 0) existing.registeredAt = context.registeredAt;
	if (context.lastActiveAt !== void 0) existing.lastActiveAt = context.lastActiveAt;
}
function getAgentRunContextOwners(state = getAgentEventState()) {
	state.runContextOwnersById ??= /* @__PURE__ */ new Map();
	return state.runContextOwnersById;
}
/** Claims a run id for a newly admitted execution, replacing stale ownership. */
function claimAgentRunContext(runId, context, options = {}) {
	if (!runId) return;
	const state = getAgentEventState();
	const lifecycleGeneration = context.lifecycleGeneration ?? state.lifecycleGeneration;
	const existing = state.runContextById.get(runId);
	const ownersById = getAgentRunContextOwners(state);
	const existingOwners = ownersById.get(runId);
	let ownerToken;
	if (options.trackOwner) {
		ownerToken = randomUUID();
		if (existingOwners?.lifecycleGeneration === lifecycleGeneration) {
			existingOwners.ownerTokens.add(ownerToken);
			if (options.ownsContext) existingOwners.preserveAfterRelease = false;
		} else ownersById.set(runId, {
			lifecycleGeneration,
			ownerTokens: new Set([ownerToken]),
			preserveAfterRelease: options.ownsContext !== true && existing?.lifecycleGeneration === lifecycleGeneration,
			clearRequested: false
		});
	} else if (existingOwners?.lifecycleGeneration !== lifecycleGeneration) ownersById.delete(runId);
	if (existing?.lifecycleGeneration === lifecycleGeneration) {
		registerAgentRunContext(runId, {
			...context,
			lifecycleGeneration
		});
		return ownerToken;
	}
	state.runContextById.set(runId, {
		...context,
		lifecycleGeneration,
		registeredAt: context.registeredAt ?? Date.now()
	});
	state.seqByRun.delete(runId);
	return ownerToken;
}
/** Returns the currently registered context for a run, if it has not been cleared or swept. */
function getAgentRunContext(runId) {
	return getAgentEventState().runContextById.get(runId);
}
/** Lists active runs bound to one current session identity. */
function listAgentRunsForSession(params) {
	const currentLifecycleGeneration = getAgentEventState().lifecycleGeneration;
	const runs = [];
	for (const [runId, context] of getAgentEventState().runContextById) if ((context.sessionId ? context.sessionId === params.sessionId : context.sessionKey === params.sessionKey) && context.lifecycleGeneration === currentLifecycleGeneration) runs.push({
		runId,
		lifecycleGeneration: context.lifecycleGeneration
	});
	return runs.toSorted((a, b) => a.runId === b.runId ? a.lifecycleGeneration.localeCompare(b.lifecycleGeneration) : a.runId.localeCompare(b.runId));
}
/** Clears context and sequence state for a run that has ended or been discarded. */
function clearAgentRunContext(runId, lifecycleGeneration) {
	const state = getAgentEventState();
	const existing = state.runContextById.get(runId);
	if (lifecycleGeneration && existing && existing.lifecycleGeneration !== lifecycleGeneration) return;
	const owners = getAgentRunContextOwners(state).get(runId);
	if (owners?.ownerTokens.size) {
		if (!lifecycleGeneration || owners.lifecycleGeneration === lifecycleGeneration) owners.clearRequested = true;
		return;
	}
	state.runContextById.delete(runId);
	state.seqByRun.delete(runId);
}
/** Releases one tracked owner and clears its context after the final owner exits. */
function releaseAgentRunContext(runId, ownerToken) {
	if (!runId || !ownerToken) return;
	const ownersById = getAgentRunContextOwners(getAgentEventState());
	const owners = ownersById.get(runId);
	if (!owners?.ownerTokens.delete(ownerToken)) return;
	if (owners.ownerTokens.size > 0) return;
	ownersById.delete(runId);
	if (owners.clearRequested || !owners.preserveAfterRelease) clearAgentRunContext(runId, owners.lifecycleGeneration);
}
/**
* Sweep stale run contexts that exceeded the given TTL.
* Guards against orphaned entries when lifecycle "end"/"error" events are missed.
*/
function sweepStaleRunContexts(maxAgeMs = 1800 * 1e3) {
	const state = getAgentEventState();
	const now = Date.now();
	let swept = 0;
	for (const [runId, ctx] of state.runContextById.entries()) {
		const lastSeen = ctx.lastActiveAt ?? ctx.registeredAt;
		if ((lastSeen ? now - lastSeen : Infinity) > maxAgeMs) {
			state.runContextById.delete(runId);
			state.seqByRun.delete(runId);
			getAgentRunContextOwners(state).delete(runId);
			swept++;
		}
	}
	return swept;
}
/** Emits an agent event after assigning per-run sequence, timestamp, and context metadata. */
function emitAgentEvent(event) {
	const state = getAgentEventState();
	const context = state.runContextById.get(event.runId);
	const executionLifecycleGeneration = event.lifecycleGeneration ?? getAgentEventExecutionContext().getStore()?.lifecycleGeneration;
	const ownedLifecycleGeneration = executionLifecycleGeneration ?? context?.lifecycleGeneration;
	if (executionLifecycleGeneration && context?.lifecycleGeneration && executionLifecycleGeneration !== context.lifecycleGeneration) return;
	if (ownedLifecycleGeneration && ownedLifecycleGeneration !== state.lifecycleGeneration) return;
	const nextSeq = (state.seqByRun.get(event.runId) ?? 0) + 1;
	state.seqByRun.set(event.runId, nextSeq);
	if (context) context.lastActiveAt = Date.now();
	const isControlUiVisible = context?.isControlUiVisible ?? true;
	const eventSessionKey = typeof event.sessionKey === "string" && event.sessionKey.trim() ? event.sessionKey : void 0;
	const sessionKey = isControlUiVisible || event.stream === "lifecycle" ? eventSessionKey ?? context?.sessionKey : void 0;
	const sessionId = event.stream === "lifecycle" ? event.sessionId ?? context?.sessionId : event.sessionId;
	const lifecycleGeneration = event.stream === "lifecycle" ? ownedLifecycleGeneration ?? state.lifecycleGeneration : ownedLifecycleGeneration;
	const enriched = {
		...event,
		sessionKey,
		...sessionId ? { sessionId } : {},
		seq: nextSeq,
		ts: Date.now()
	};
	if (lifecycleGeneration) Object.defineProperty(enriched, "lifecycleGeneration", {
		value: lifecycleGeneration,
		enumerable: false
	});
	notifyListeners(state.listeners, enriched);
}
/** Emits an item activity event on the shared agent event bus. */
function emitAgentItemEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "item",
		data: params.data,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
}
/** Emits an approval event on the shared agent event bus. */
function emitAgentApprovalEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "approval",
		data: params.data,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
}
/** Emits command output for a running or completed item/tool call. */
function emitAgentCommandOutputEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "command_output",
		data: params.data,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
}
/** Emits a patch summary for a completed file-editing item/tool call. */
function emitAgentPatchSummaryEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "patch",
		data: params.data,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
}
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
function onAgentEvent(listener) {
	return registerListener(getAgentEventState().listeners, listener);
}
/** Clears all agent event state, including listeners; test-only helper. */
function resetAgentEventsForTest() {
	const state = getAgentEventState();
	state.seqByRun.clear();
	state.listeners.clear();
	state.runContextById.clear();
	getAgentRunContextOwners(state).clear();
}
//#endregion
export { rotateAgentEventLifecycleGeneration as _, emitAgentApprovalEvent as a, emitAgentItemEvent as c, getAgentRunContext as d, listAgentRunsForSession as f, resetAgentEventsForTest as g, releaseAgentRunContext as h, clearAgentRunContext as i, emitAgentPatchSummaryEvent as l, registerAgentRunContext as m, captureAgentRunLifecycleGeneration as n, emitAgentCommandOutputEvent as o, onAgentEvent as p, claimAgentRunContext as r, emitAgentEvent as s, assertAgentRunLifecycleGenerationCurrent as t, getAgentEventLifecycleGeneration as u, sweepStaleRunContexts as v, withAgentRunLifecycleGeneration as y };
