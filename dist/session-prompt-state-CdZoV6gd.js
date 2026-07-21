import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
//#region src/agents/embedded-agent-runner/session-prompt-state.ts
/** Process-local prompt projection state owned by an embedded session lifecycle. */
const MAX_SESSION_PROMPT_STATES = 64;
const sessionPromptStates = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionPromptStates"), () => /* @__PURE__ */ new Map());
function createSessionPromptState() {
	return {
		toolResults: {
			replacements: /* @__PURE__ */ new Map(),
			frozen: /* @__PURE__ */ new Set(),
			ambiguousBaseKeys: /* @__PURE__ */ new Set(),
			sourceTextByKey: /* @__PURE__ */ new Map()
		},
		sentUserTurnIds: /* @__PURE__ */ new Set()
	};
}
function cloneToolResultPromptProjectionState(state) {
	return {
		replacements: new Map(state.replacements),
		frozen: new Set(state.frozen),
		ambiguousBaseKeys: new Set(state.ambiguousBaseKeys),
		sourceTextByKey: new Map(state.sourceTextByKey)
	};
}
function getEmbeddedSessionPromptState(sessionId) {
	const existing = sessionPromptStates.get(sessionId);
	if (existing) {
		sessionPromptStates.delete(sessionId);
		sessionPromptStates.set(sessionId, existing);
		return existing;
	}
	const created = createSessionPromptState();
	sessionPromptStates.set(sessionId, created);
	while (sessionPromptStates.size > MAX_SESSION_PROMPT_STATES) {
		const oldest = sessionPromptStates.keys().next().value;
		if (typeof oldest !== "string") break;
		sessionPromptStates.delete(oldest);
	}
	return created;
}
function clearEmbeddedSessionPromptStates(sessionIds) {
	for (const sessionId of sessionIds) {
		const normalized = sessionId?.trim();
		if (normalized) sessionPromptStates.delete(normalized);
	}
}
function markSessionUserTurnsSent(state, messages) {
	for (const message of messages) {
		if (message.role !== "user") continue;
		const idempotencyKey = message.idempotencyKey;
		if (typeof idempotencyKey === "string" && idempotencyKey.length > 0) state.sentUserTurnIds.add(idempotencyKey);
	}
}
function hasSessionUserTurnBeenSent(state, message) {
	if (!message || message.role !== "user") return;
	const idempotencyKey = message.idempotencyKey;
	return typeof idempotencyKey === "string" && idempotencyKey.length > 0 ? state.sentUserTurnIds.has(idempotencyKey) : void 0;
}
//#endregion
export { markSessionUserTurnsSent as a, hasSessionUserTurnBeenSent as i, cloneToolResultPromptProjectionState as n, getEmbeddedSessionPromptState as r, clearEmbeddedSessionPromptStates as t };
