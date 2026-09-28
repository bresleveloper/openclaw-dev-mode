//#region src/logging/diagnostic-session-state.ts
/** Shared in-memory diagnostic session state map. */
const diagnosticSessionStates = /* @__PURE__ */ new Map();
const SESSION_STATE_TTL_MS = 18e5;
const SESSION_STATE_PRUNE_INTERVAL_MS = 6e4;
const SESSION_STATE_MAX_ENTRIES = 2e3;
let lastSessionPruneAt = 0;
/** Prunes stale idle session states and caps the process-local state map. */
function pruneDiagnosticSessionStates(now = Date.now(), force = false) {
	const shouldPruneForSize = diagnosticSessionStates.size > SESSION_STATE_MAX_ENTRIES;
	if (!force && !shouldPruneForSize && now - lastSessionPruneAt < SESSION_STATE_PRUNE_INTERVAL_MS) return;
	lastSessionPruneAt = now;
	let trackOldest = diagnosticSessionStates.size === 2001;
	let oldest;
	for (const entry of diagnosticSessionStates.entries()) {
		const [key, state] = entry;
		const ageMs = now - state.lastActivity;
		if (state.state === "idle" && state.queueDepth <= 0 && ageMs > SESSION_STATE_TTL_MS) {
			diagnosticSessionStates.delete(key);
			trackOldest = false;
		} else if (trackOldest && (!oldest || state.lastActivity < oldest[1].lastActivity)) oldest = entry;
	}
	if (diagnosticSessionStates.size <= SESSION_STATE_MAX_ENTRIES) return;
	if (oldest) {
		diagnosticSessionStates.delete(oldest[0]);
		return;
	}
	const ordered = Array.from(diagnosticSessionStates.entries()).toSorted((a, b) => a[1].lastActivity - b[1].lastActivity);
	for (const [key] of ordered) {
		diagnosticSessionStates.delete(key);
		if (diagnosticSessionStates.size <= SESSION_STATE_MAX_ENTRIES) break;
	}
}
function resolveSessionKey({ sessionKey, sessionId }) {
	return sessionKey ?? sessionId ?? "unknown";
}
function findStateEntryBySessionId(sessionId) {
	for (const entry of diagnosticSessionStates.entries()) {
		const [, state] = entry;
		if (state.sessionId === sessionId) return entry;
	}
}
function sessionStatePriority(state) {
	return {
		idle: 0,
		waiting: 1,
		processing: 2
	}[state];
}
function mergeSessionState(target, source) {
	const sourceIsNewer = source.lastActivity > target.lastActivity;
	const sourceIsSameAgeAndMoreActive = source.lastActivity === target.lastActivity && sessionStatePriority(source.state) > sessionStatePriority(target.state);
	target.sessionId ??= source.sessionId;
	target.sessionKey ??= source.sessionKey;
	if (source.sessionFile && (sourceIsNewer || !target.sessionFile)) target.sessionFile = source.sessionFile;
	if (sourceIsNewer || sourceIsSameAgeAndMoreActive) target.state = source.state;
	target.generation = Math.max(target.generation ?? 0, source.generation ?? 0);
	target.lastActivity = Math.max(target.lastActivity, source.lastActivity);
	target.queueDepth += source.queueDepth;
	target.activeQueuedTurn ||= source.activeQueuedTurn;
	target.lastStuckWarnAgeMs = target.lastStuckWarnAgeMs === void 0 || source.lastStuckWarnAgeMs === void 0 ? void 0 : Math.max(target.lastStuckWarnAgeMs, source.lastStuckWarnAgeMs);
	target.lastLongRunningWarnAgeMs = target.lastLongRunningWarnAgeMs === void 0 || source.lastLongRunningWarnAgeMs === void 0 ? void 0 : Math.max(target.lastLongRunningWarnAgeMs, source.lastLongRunningWarnAgeMs);
	if (source.toolCallHistory?.length) target.toolCallHistory = [...target.toolCallHistory ?? [], ...source.toolCallHistory];
	if (source.toolLoopWarningBuckets?.size) {
		const buckets = target.toolLoopWarningBuckets ??= /* @__PURE__ */ new Map();
		for (const [bucket, count] of source.toolLoopWarningBuckets) buckets.set(bucket, Math.max(buckets.get(bucket) ?? 0, count));
	}
	if (source.commandPollCounts?.size) {
		const counts = target.commandPollCounts ??= /* @__PURE__ */ new Map();
		for (const [command, value] of source.commandPollCounts) {
			const existing = counts.get(command);
			if (!existing || value.lastPollAt > existing.lastPollAt) counts.set(command, value);
		}
	}
}
/** Gets or creates diagnostic state, merging aliases that share a session id. */
function getDiagnosticSessionState(ref) {
	pruneDiagnosticSessionStates();
	const key = resolveSessionKey(ref);
	const direct = diagnosticSessionStates.get(key);
	const sessionIdEntry = ref.sessionId && direct?.sessionId !== ref.sessionId ? findStateEntryBySessionId(ref.sessionId) : void 0;
	const existing = direct ?? sessionIdEntry?.[1];
	if (existing) {
		if (direct && sessionIdEntry && sessionIdEntry[1] !== direct) {
			mergeSessionState(direct, sessionIdEntry[1]);
			diagnosticSessionStates.delete(sessionIdEntry[0]);
		} else if (!direct && ref.sessionKey && sessionIdEntry) {
			diagnosticSessionStates.delete(sessionIdEntry[0]);
			diagnosticSessionStates.set(key, existing);
		}
		if (ref.sessionId) existing.sessionId = ref.sessionId;
		if (ref.sessionKey) existing.sessionKey = ref.sessionKey;
		if (ref.sessionFile) existing.sessionFile = ref.sessionFile;
		return existing;
	}
	const created = {
		sessionId: ref.sessionId,
		sessionKey: ref.sessionKey,
		sessionFile: ref.sessionFile,
		lastActivity: Date.now(),
		generation: 0,
		state: "idle",
		queueDepth: 0
	};
	diagnosticSessionStates.set(key, created);
	pruneDiagnosticSessionStates();
	return created;
}
/** Looks up diagnostic state without creating a new entry. */
function peekDiagnosticSessionState(ref) {
	const key = resolveSessionKey(ref);
	return diagnosticSessionStates.get(key) ?? (ref.sessionId ? findStateEntryBySessionId(ref.sessionId)?.[1] : void 0);
}
/** Retires collector observations without resetting independent tool-loop or poll policy. */
function retireDiagnosticSessionObservations() {
	for (const state of diagnosticSessionStates.values()) {
		state.generation = (state.generation ?? 0) + 2;
		state.state = "idle";
		state.queueDepth = 0;
		state.activeQueuedTurn = false;
		state.lastActivity = Date.now();
		state.lastStuckWarnAgeMs = void 0;
		state.lastLongRunningWarnAgeMs = void 0;
	}
}
/** Clears all process-local diagnostic session state for tests. */
function resetDiagnosticSessionStateForTest() {
	diagnosticSessionStates.clear();
	lastSessionPruneAt = 0;
}
/** Checks whether a generation/state snapshot still matches current diagnostic state. */
function isDiagnosticSessionStateCurrent(params) {
	if (params.generation === void 0) return true;
	const state = peekDiagnosticSessionState(params);
	if (!state) return false;
	return (state.generation ?? 0) === params.generation && (params.state === void 0 || state.state === params.state);
}
//#endregion
export { pruneDiagnosticSessionStates as a, peekDiagnosticSessionState as i, getDiagnosticSessionState as n, resetDiagnosticSessionStateForTest as o, isDiagnosticSessionStateCurrent as r, retireDiagnosticSessionObservations as s, diagnosticSessionStates as t };
