import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
//#region src/acp/event-ledger.types.ts
const DEFAULT_MAX_SESSIONS = 200;
const DEFAULT_MAX_EVENTS_PER_SESSION = 5e3;
const DEFAULT_MAX_SERIALIZED_BYTES = 16777216;
function normalizeAcpLedgerOptions(options = {}) {
	return {
		maxSessions: resolveIntegerOption(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 }),
		maxEventsPerSession: resolveIntegerOption(options.maxEventsPerSession, DEFAULT_MAX_EVENTS_PER_SESSION, { min: 1 }),
		maxSerializedBytes: resolveIntegerOption(options.maxSerializedBytes, DEFAULT_MAX_SERIALIZED_BYTES, { min: 1024 }),
		now: options.now ?? Date.now
	};
}
function createAcpPromptUpdates(prompt) {
	return prompt.map((content) => ({
		sessionUpdate: "user_message_chunk",
		content: structuredClone(content)
	}));
}
function normalizeAcpLedgerEvent(raw) {
	if (!isRecord(raw) || !isRecord(raw.update)) return;
	const seq = raw.seq;
	const at = raw.at;
	const sessionId = raw.sessionId;
	const sessionKey = raw.sessionKey;
	const runId = raw.runId;
	const sessionUpdate = raw.update.sessionUpdate;
	if (typeof seq !== "number" || !Number.isInteger(seq) || seq < 0 || typeof at !== "number" || !Number.isFinite(at) || typeof sessionId !== "string" || typeof sessionKey !== "string" || typeof sessionUpdate !== "string") return;
	return {
		seq,
		at,
		sessionId,
		sessionKey,
		...typeof runId === "string" && runId ? { runId } : {},
		update: structuredClone(raw.update)
	};
}
//#endregion
export { normalizeAcpLedgerEvent as n, normalizeAcpLedgerOptions as r, createAcpPromptUpdates as t };
