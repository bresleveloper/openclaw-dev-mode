import { g as projectManuallyCompactedSessionEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as replaceSqliteTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { a as writeSessionEntry, g as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as assertSqliteTranscriptSnapshotUnchanged } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
//#region src/config/sessions/session-manual-compact.kernel.ts
/** The native adapter and worker share the same transcript/entry compare-and-swap. */
function applyManualCompactInTransaction(database, scope, input, projection) {
	assertSqliteTranscriptSnapshotUnchanged(database, scope.sessionId, input.rows);
	const current = readSessionEntrySelectionSnapshot(database, scope.sessionKey, true);
	assertLifecycleTargetSnapshotUnchanged(input.entries, current, "session.transcript.manual-compact");
	const previous = current[0]?.entry;
	if (!previous || previous.sessionId !== scope.sessionId) throw new Error(`SQLite session changed before compacting ${scope.sessionId}`);
	replaceSqliteTranscriptEventsInTransaction(database, scope, input.events, projection);
	const next = projectManuallyCompactedSessionEntry(previous, input.nowMs);
	writeSessionEntry(database, scope.sessionKey, next, { previousEntry: previous });
	return {
		previous: /* @__PURE__ */ new Map([[scope.sessionKey, previous]]),
		current: /* @__PURE__ */ new Map([[scope.sessionKey, next]])
	};
}
//#endregion
export { applyManualCompactInTransaction as t };
