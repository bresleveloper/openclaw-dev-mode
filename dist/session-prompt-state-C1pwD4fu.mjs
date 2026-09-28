import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
//#region src/agents/embedded-agent-runner/session-prompt-state.ts
/** Transcript-backed prompt projection state cached by an embedded session lifecycle. */
const MAX_SESSION_PROMPT_STATES = 64;
const MAX_ACTIVE_PROJECT_KEYS = 4;
const sessionPromptStates = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionPromptStates"), () => /* @__PURE__ */ new Map());
function createToolResultPromptProjectionState() {
	return {
		replacements: /* @__PURE__ */ new Map(),
		frozen: /* @__PURE__ */ new Set(),
		ambiguousBaseKeys: /* @__PURE__ */ new Set(),
		sourceHashByKey: /* @__PURE__ */ new Map(),
		restoredCacheTtl: /* @__PURE__ */ new Map()
	};
}
function createSessionPromptState() {
	return {
		activeProjectKeys: [],
		toolResults: createToolResultPromptProjectionState(),
		sentUserTurnIds: /* @__PURE__ */ new Set()
	};
}
function cloneToolResultPromptProjectionState(state) {
	return {
		replacements: new Map(state.replacements),
		frozen: new Set(state.frozen),
		ambiguousBaseKeys: new Set(state.ambiguousBaseKeys),
		sourceHashByKey: new Map(state.sourceHashByKey),
		restoredCacheTtl: new Map(state.restoredCacheTtl),
		lastWrittenSnapshotHash: state.lastWrittenSnapshotHash
	};
}
function recordToolResultPromptProjection(state, key, message, cacheTtl = state.replacements.get(key)?.cacheTtl) {
	state.replacements.set(key, {
		cacheTtl,
		content: cacheTtl ? message.content : message.content.flatMap((block) => isRecord(block) && block.type === "text" && typeof block.text === "string" ? [{
			type: "text",
			text: block.text
		}] : [])
	});
}
/** TTL trims are re-derived; ordinary trims retain only text, never images or tool metadata. */
function serializeCacheTtlToolResultProjections(state) {
	const marks = new Map(state.restoredCacheTtl);
	for (const [key, projection] of state.replacements) if (projection.cacheTtl === "soft") marks.set(key, { mode: "soft" });
	else if (projection.cacheTtl === "hard") {
		const placeholder = projection.content.flatMap((block) => block.type === "text" ? [block.text] : []).join("\n");
		marks.set(key, {
			mode: "hard",
			placeholder
		});
	}
	return {
		prunedToolResults: [...marks].map(([key, mark]) => Object.assign({ key }, mark)),
		ambiguousToolResultBaseKeys: [...state.ambiguousBaseKeys],
		frozenToolResults: [...state.sourceHashByKey].flatMap(([key, sourceHash]) => {
			if (!state.frozen.has(key)) return [];
			const projection = state.replacements.get(key);
			return [{
				key,
				sourceHash,
				...!projection?.cacheTtl && projection ? { texts: projection.content.flatMap((block) => block.type === "text" ? [block.text] : []) } : {}
			}];
		})
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
	pruneMapToMaxSize(sessionPromptStates, MAX_SESSION_PROMPT_STATES);
	return created;
}
function hashToolResultProjectionSnapshot(snapshot) {
	return sha256Hex(JSON.stringify(snapshot));
}
function persistToolResultProjections(state, appendEntry) {
	if (state.frozen.size === 0) return;
	const snapshot = serializeCacheTtlToolResultProjections(state);
	const hash = hashToolResultProjectionSnapshot(snapshot);
	if (hash === state.lastWrittenSnapshotHash) return;
	appendEntry("openclaw.cache-ttl", snapshot);
	state.lastWrittenSnapshotHash = hash;
}
/** Records the prepared repository identity and snapshots this session's LRU active set. */
function prepareEmbeddedSessionActiveProjectKeys(sessionId, projectKey) {
	const state = getEmbeddedSessionPromptState(sessionId);
	if (projectKey) {
		const existing = state.activeProjectKeys.indexOf(projectKey);
		if (existing >= 0) state.activeProjectKeys.splice(existing, 1);
		state.activeProjectKeys.unshift(projectKey);
		state.activeProjectKeys.length = Math.min(state.activeProjectKeys.length, MAX_ACTIVE_PROJECT_KEYS);
	}
	return [...state.activeProjectKeys];
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
export { hasSessionUserTurnBeenSent as a, persistToolResultProjections as c, serializeCacheTtlToolResultProjections as d, getEmbeddedSessionPromptState as i, prepareEmbeddedSessionActiveProjectKeys as l, cloneToolResultPromptProjectionState as n, hashToolResultProjectionSnapshot as o, createToolResultPromptProjectionState as r, markSessionUserTurnsSent as s, clearEmbeddedSessionPromptStates as t, recordToolResultPromptProjection as u };
