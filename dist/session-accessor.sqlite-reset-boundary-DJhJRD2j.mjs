import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { f as selectSessionTranscriptLeafControlledPath } from "./transcript-tree-CaYJo8Xs.mjs";
import { t as clearSessionProgressCardForReset } from "./progress-card-store-CRs-FKxG.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-qdejgRzS.mjs";
import { r as resolveResetBoundaryHeaderCwd } from "./transcript-header-CyuYZIZn.mjs";
import { t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { c as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DXW9UGub.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/transcript-replay.ts
/** Tail kept so DM continuity survives silent session rotations. */
const DEFAULT_REPLAY_MAX_MESSAGES = 6;
function isValidReplayTimestamp(value) {
	if (typeof value === "number") return Number.isFinite(value);
	return typeof value === "string" && value.trim().length > 0;
}
function replayableTranscriptRole(record) {
	if (!record || record.type !== "message" || typeof record.id !== "string" || record.id.trim().length === 0 || !isValidReplayTimestamp(record.timestamp) || !(record.parentId === null || record.parentId === void 0 || typeof record.parentId === "string")) return;
	const role = record.message?.role;
	return role === "user" || role === "assistant" ? role : void 0;
}
function selectRecentUserAssistantReplayRecords(records, maxMessages = DEFAULT_REPLAY_MAX_MESSAGES) {
	const max = Math.max(0, maxMessages);
	if (max === 0) return [];
	const kept = [];
	for (const record of records) {
		const role = replayableTranscriptRole(record);
		if (role) kept.push({
			role,
			record
		});
	}
	let startIdx = Math.max(0, kept.length - max);
	while (startIdx < kept.length && kept[startIdx]?.role === "assistant") startIdx += 1;
	const tail = [];
	for (const entry of kept.slice(startIdx)) {
		const lastIdx = tail.length - 1;
		if (lastIdx >= 0 && tail[lastIdx]?.role === entry.role) {
			tail[lastIdx] = entry;
			continue;
		}
		tail.push(entry);
	}
	return tail.map((entry) => entry.record);
}
//#endregion
//#region src/config/sessions/session-reset-boundary-event.ts
function recordId(record) {
	return readNonBlankString(asOptionalRecord(record)?.id);
}
function uniqueBoundaryId(records) {
	const ids = new Set(records.flatMap((record) => recordId(record) ? [recordId(record)] : []));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
function createSessionResetBoundaryId() {
	return randomUUID();
}
function projectLatestBoundaryWindow(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => {
		const type = asOptionalRecord(entry)?.type;
		return type === "compaction" || type === "reset";
	});
	if (boundaryIndex < 0) return [...entries];
	const boundary = entries[boundaryIndex];
	const firstKeptIndex = typeof boundary.firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && recordId(entry) === boundary.firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter((entry) => {
		const role = entry?.message?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex + 1)];
}
function buildSessionResetBoundaryEvent(params) {
	const entries = params.events.filter((event) => isRecord(event) && event.type !== "session");
	const activeEntries = selectSessionTranscriptLeafControlledPath(entries) ?? entries;
	const firstKeptEntryId = recordId((params.context === "preserve-tail" ? selectRecentUserAssistantReplayRecords(projectLatestBoundaryWindow(activeEntries)) : [])[0]);
	const boundaryId = params.boundaryId?.trim() || uniqueBoundaryId(params.events);
	if (params.events.some((event) => recordId(event) === boundaryId)) throw new Error(`Reset boundary ID already exists: ${boundaryId}`);
	return {
		type: "reset",
		id: boundaryId,
		parentId: recordId(activeEntries.at(-1)) ?? null,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		reason: params.reason,
		...firstKeptEntryId ? { firstKeptEntryId } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reset-boundary.ts
/** Transcript reset and prior-task retirement share the owning guarded transaction. */
function appendSessionResetBoundary(database, scope, previousEntry, boundary, projection) {
	ensureTranscriptHeader(database, scope, resolveResetBoundaryHeaderCwd(previousEntry, boundary.cwd), projection);
	const event = buildSessionResetBoundaryEvent({
		events: loadTranscriptEventsFromDatabase(database, scope.sessionId, { projection: "reset-boundary" }),
		...boundary
	});
	if (appendTranscriptEventInTransaction(database, scope, event, projection) === false) throw new Error("Failed to append reset boundary for " + scope.sessionKey);
	if (boundary.context === "clear" && clearSessionProgressCardForReset(database.db, scope.sessionKey)) {
		const { agentId, sessionKey } = scope;
		deferOpenClawAgentPostCommitPublication(database, () => {
			emitSessionLifecycleEvent({
				agentId,
				sessionKey,
				reason: "progress-card-reset"
			});
		});
		return true;
	}
	return false;
}
//#endregion
export { createSessionResetBoundaryId as n, appendSessionResetBoundary as t };
