import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./transcript-payload-Yc_w8Yx5.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/transcript-header.ts
/** Creates a session transcript header entry with current version metadata. */
function createSessionTranscriptHeader(params = {}) {
	return {
		type: "session",
		version: params.version ?? 4,
		id: params.sessionId ?? randomUUID(),
		timestamp: params.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
		cwd: params.cwd ?? process.cwd(),
		...params.parentSession ? { parentSession: params.parentSession } : {}
	};
}
/** Retained header fallback for the session's creation boundary. */
function readSessionTranscriptHeaderStartedAt(value, sessionId) {
	const header = asOptionalRecord(value);
	if (header?.type !== "session" || typeof header.id === "string" && header.id.trim() && header.id !== sessionId) return;
	const timestamp = header.timestamp;
	const parsed = typeof timestamp === "number" ? timestamp : typeof timestamp === "string" && timestamp.trim() ? Date.parse(timestamp) : void 0;
	const timestampMs = asDateTimestampMs(parsed);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : void 0;
}
/** The prior transcript owns its workspace; caller context covers an unset row. */
function resolveResetBoundaryHeaderCwd(priorEntry, fallbackCwd) {
	return priorEntry.spawnedCwd ?? priorEntry.spawnedWorkspaceDir ?? fallbackCwd;
}
//#endregion
export { readSessionTranscriptHeaderStartedAt as n, resolveResetBoundaryHeaderCwd as r, createSessionTranscriptHeader as t };
