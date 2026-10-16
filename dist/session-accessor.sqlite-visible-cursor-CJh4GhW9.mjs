//#region src/config/sessions/session-accessor.sqlite-visible-cursor.ts
const VISIBLE_MESSAGE_CURSOR_VERSION = 1;
const DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES = 1e3;
const DEFAULT_VISIBLE_MESSAGE_MAX_BYTES = 1e6;
const MAX_VISIBLE_MESSAGE_MAX_MESSAGES = 1e4;
const MAX_VISIBLE_MESSAGE_MAX_BYTES = 67108864;
function normalizeVisibleMessageLimit(value, fallback, maximum, name) {
	const resolved = value ?? fallback;
	if (!Number.isInteger(resolved) || resolved < 1 || resolved > maximum) throw new RangeError(`${name} must be an integer between 1 and ${String(maximum)}`);
	return resolved;
}
function encodeVisibleMessageCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function createVisibleMessageCursor(params) {
	return {
		...params,
		lastEventSeq: -1,
		lastMessagePosition: -1,
		version: VISIBLE_MESSAGE_CURSOR_VERSION
	};
}
function parseVisibleMessageCursor(value) {
	if (value.length > 4096) return;
	try {
		const bytes = Buffer.from(value, "base64url");
		if (bytes.toString("base64url") !== value) return;
		const parsed = JSON.parse(bytes.toString("utf8"));
		if (parsed.version !== VISIBLE_MESSAGE_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || typeof parsed.lastEventSeq !== "number" || !Number.isSafeInteger(parsed.lastEventSeq) || parsed.lastEventSeq < -1 || typeof parsed.lastMessagePosition !== "number" || !Number.isSafeInteger(parsed.lastMessagePosition) || parsed.lastMessagePosition < -1 || parsed.lastEventSeq === -1 !== (parsed.lastMessagePosition === -1)) return;
		const cursor = {
			agentId: parsed.agentId,
			generation: parsed.generation,
			sessionId: parsed.sessionId,
			lastEventSeq: parsed.lastEventSeq,
			lastMessagePosition: parsed.lastMessagePosition,
			version: parsed.version
		};
		return encodeVisibleMessageCursor(cursor) === value ? cursor : void 0;
	} catch {
		return;
	}
}
//#endregion
export { createVisibleMessageCursor as a, parseVisibleMessageCursor as c, MAX_VISIBLE_MESSAGE_MAX_MESSAGES as i, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES as n, encodeVisibleMessageCursor as o, MAX_VISIBLE_MESSAGE_MAX_BYTES as r, normalizeVisibleMessageLimit as s, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES as t };
