import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { A as validateAgentRunDelegatedAuthority, c as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-BaxMDLZF.mjs";
import { h as registerAgentEventLifecycleRotationHandler, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
//#region src/agents/embedded-agent-runner/run-state.ts
const embeddedRunState = resolveGlobalSingleton(Symbol.for("openclaw.embeddedRunState"), () => ({
	activeRuns: /* @__PURE__ */ new Map(),
	activeRunsByRunId: /* @__PURE__ */ new Map(),
	activeRunRegistrations: /* @__PURE__ */ new WeakMap(),
	completionClaims: /* @__PURE__ */ new Map(),
	activeRunLifecycleGenerations: /* @__PURE__ */ new WeakMap(),
	retainedAbortabilityRunIds: /* @__PURE__ */ new Set(),
	snapshots: /* @__PURE__ */ new Map(),
	sessionIdsByKey: /* @__PURE__ */ new Map(),
	sessionIdsByFile: /* @__PURE__ */ new Map(),
	abandonedRunsBySessionId: /* @__PURE__ */ new Map(),
	abandonedRunSessionIdsByKey: /* @__PURE__ */ new Map(),
	abandonedRunSessionIdsByFile: /* @__PURE__ */ new Map(),
	forcedTerminalSettlements: /* @__PURE__ */ new WeakMap(),
	waiters: /* @__PURE__ */ new Map()
}));
const ACTIVE_EMBEDDED_RUNS = embeddedRunState.activeRuns;
const ACTIVE_EMBEDDED_RUNS_BY_RUN_ID = embeddedRunState.activeRunsByRunId;
const ACTIVE_EMBEDDED_RUN_REGISTRATIONS = embeddedRunState.activeRunRegistrations;
const EMBEDDED_RUN_COMPLETION_CLAIMS = embeddedRunState.completionClaims;
/** Identity-only dispatch must resolve the same participant owner as in-process tools. */
function captureActiveEmbeddedRunPersonalToolParticipants(identity, options) {
	const instance = identity.operationalRunInstance;
	const handle = ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(instance.runId);
	if (!handle) return;
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const toolAuthority = registration?.toolAuthority;
	if (options?.allowMissingRegistry && !toolAuthority?.personalToolParticipants) return;
	const delegatedAuthority = registration?.delegatedAuthority;
	const ownsRegistration = () => registration !== void 0 && registration.operationalRunInstance?.instanceId === instance.instanceId && registration.operationalRunInstance.runId === instance.runId && registration.sessionKey === identity.sessionKey && registration.agentId === identity.agentId && handle.runId === instance.runId && ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(instance.runId) === handle && ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration && registration.delegatedAuthority === delegatedAuthority && registration.toolAuthority === toolAuthority;
	const assertCurrent = () => {
		toolAuthority?.assertActive();
		if (!ownsRegistration() || !toolAuthority || !delegatedAuthority || getActiveAgentRunDelegatedAuthority(instance) !== delegatedAuthority || !validateAgentRunDelegatedAuthority(identity.delegatedAuthority, delegatedAuthority) || handle.isAborted?.() || handle.isStopped?.() || !ownsRegistration()) throw new Error("Personal-tool turn authority is no longer active; ask again in a new turn.");
	};
	assertCurrent();
	return {
		participants: toolAuthority?.personalToolParticipants,
		assertCurrent
	};
}
/** Only an accepted question's exact admitted owner may suppress stale-work recovery. */
function registerActiveEmbeddedRunHumanInputWait(authority, isPending) {
	const handle = ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(authority.operationalRunInstance.runId);
	const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	if (!handle || !registration || ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) !== handle || !validateAgentRunDelegatedAuthority(authority) || registration.delegatedAuthority !== getActiveAgentRunDelegatedAuthority(authority.operationalRunInstance)) return;
	const waits = registration.humanInputWaits ??= /* @__PURE__ */ new Set();
	waits.add(isPending);
	return (resolved) => {
		if (waits.delete(isPending) && resolved && ACTIVE_EMBEDDED_RUNS.get(registration.sessionId) === handle && validateAgentRunDelegatedAuthority(authority) && !handle.isAborted?.()) registration.onHumanInputResolved?.();
	};
}
/** Tool-side waits know only their run id; the live registration supplies its authority. */
function registerActiveEmbeddedRunHumanInputWaitForRun(runId, isPending) {
	const handle = ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(runId);
	const authority = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle)?.delegatedAuthority;
	return authority ? registerActiveEmbeddedRunHumanInputWait(authority, isPending) : void 0;
}
/** Re-read at the recovery action, including after queued/lazy recovery dispatch. */
function resolveActiveEmbeddedRunRecoveryBlocker(sessionId, expectedHandle) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	if (expectedHandle && handle !== expectedHandle) return "stale_session_state";
	const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const authority = registration?.delegatedAuthority;
	if (!handle || !authority) return;
	for (const isPending of registration.humanInputWaits ?? []) {
		const pending = isPending() && !handle.isAborted?.();
		if (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle || !registration.humanInputWaits?.has(isPending)) return "stale_session_state";
		if (pending && validateAgentRunDelegatedAuthority(authority)) return "human_input_wait";
	}
	let ownsLiveness = false;
	try {
		ownsLiveness = handle.ownsLiveness?.() === true && !handle.isAborted?.() && !handle.isStopped?.();
	} catch {}
	if (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle || ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) !== registration) return "stale_session_state";
	return ownsLiveness && ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(authority.operationalRunInstance.runId) === handle && getActiveAgentRunDelegatedAuthority(authority.operationalRunInstance) === authority ? "runtime_owned_wait" : void 0;
}
const ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS = embeddedRunState.activeRunLifecycleGenerations;
const RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS = embeddedRunState.retainedAbortabilityRunIds;
const ACTIVE_EMBEDDED_RUN_SNAPSHOTS = embeddedRunState.snapshots;
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY = embeddedRunState.sessionIdsByKey;
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE = embeddedRunState.sessionIdsByFile;
const ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID = embeddedRunState.abandonedRunsBySessionId;
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY = embeddedRunState.abandonedRunSessionIdsByKey;
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE = embeddedRunState.abandonedRunSessionIdsByFile;
const EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS = embeddedRunState.forcedTerminalSettlements;
const EMBEDDED_RUN_WAITERS = embeddedRunState.waiters;
function evictPriorLifecycleEmbeddedRuns() {
	const staleHandles = /* @__PURE__ */ new Set();
	for (const [sessionId, handle] of ACTIVE_EMBEDDED_RUNS) {
		const lifecycleGeneration = ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.get(handle);
		if (lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration)) continue;
		handle.closeDiagnostics?.();
		ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle)?.humanInputWaits?.clear();
		staleHandles.add(handle);
		if (ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle) ACTIVE_EMBEDDED_RUNS.delete(sessionId);
		ACTIVE_EMBEDDED_RUN_SNAPSHOTS.delete(sessionId);
	}
	for (const [runId, handle] of ACTIVE_EMBEDDED_RUNS_BY_RUN_ID) {
		const lifecycleGeneration = ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.get(handle);
		if (lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration)) continue;
		handle.closeDiagnostics?.();
		staleHandles.add(handle);
		if (ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(runId) === handle) {
			ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.delete(runId);
			RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS.delete(runId);
		}
	}
	for (const [sessionId, claim] of EMBEDDED_RUN_COMPLETION_CLAIMS) if (!isAgentEventLifecycleGenerationCurrent(claim.lifecycleGeneration)) {
		claim.settleRegistration(void 0);
		EMBEDDED_RUN_COMPLETION_CLAIMS.delete(sessionId);
	}
	for (const index of [ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE]) for (const [key, sessionId] of index) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) index.delete(key);
	for (const [sessionId, waiters] of EMBEDDED_RUN_WAITERS) {
		if (ACTIVE_EMBEDDED_RUNS.has(sessionId)) continue;
		EMBEDDED_RUN_WAITERS.delete(sessionId);
		for (const waiter of waiters) {
			if (waiter.timer) clearTimeout(waiter.timer);
			waiter.resolve(true);
		}
	}
	const abortErrors = [];
	for (const handle of staleHandles) try {
		handle.abort("restart");
	} catch (error) {
		abortErrors.push(error);
	}
	if (abortErrors.length > 0) throw new AggregateError(abortErrors, "Failed to abort stale embedded agent runs");
}
registerAgentEventLifecycleRotationHandler("embedded-agent-runs", evictPriorLifecycleEmbeddedRuns);
function setActiveEmbeddedRunLifecycleGeneration(handle, lifecycleGeneration) {
	const existingLifecycleGeneration = ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.get(handle);
	if (existingLifecycleGeneration !== void 0) return existingLifecycleGeneration;
	ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.set(handle, lifecycleGeneration);
	return lifecycleGeneration;
}
//#endregion
export { resolveActiveEmbeddedRunRecoveryBlocker as _, ACTIVE_EMBEDDED_RUNS_BY_RUN_ID as a, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY as c, EMBEDDED_RUN_FORCED_TERMINAL_SETTLEMENTS as d, EMBEDDED_RUN_WAITERS as f, registerActiveEmbeddedRunHumanInputWaitForRun as g, registerActiveEmbeddedRunHumanInputWait as h, ACTIVE_EMBEDDED_RUNS as i, ACTIVE_EMBEDDED_RUN_SNAPSHOTS as l, captureActiveEmbeddedRunPersonalToolParticipants as m, ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE as n, ACTIVE_EMBEDDED_RUN_REGISTRATIONS as o, RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS as p, ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY as r, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE as s, ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID as t, EMBEDDED_RUN_COMPLETION_CLAIMS as u, setActiveEmbeddedRunLifecycleGeneration as v };
