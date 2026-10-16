import { r as sqliteSessionEntriesEqual, t as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { a as readLifecycleTargetSnapshot, d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { t as appendSessionResetBoundary } from "./session-accessor.sqlite-reset-boundary-DJhJRD2j.mjs";
//#region src/config/sessions/session-reset.kernel.ts
/** Durable executor and retained native incognito/maintenance resets share this transaction. */
function applySessionResetInDatabase(database, input, projection) {
	const snapshot = readLifecycleTargetSnapshot(database, input.target);
	assertLifecycleTargetSnapshotUnchanged(input.prepared, snapshot, "reset");
	const current = snapshot[0];
	const progressCardReset = Boolean(input.resetBoundary && current?.entry.sessionId && !sqliteSessionEntriesEqual(current.entry, input.nextEntry) && appendSessionResetBoundary(database, {
		agentId: input.agentId,
		path: database.path,
		sessionKey: current.sessionKey,
		sessionId: current.entry.sessionId
	}, current.entry, input.resetBoundary, projection));
	return {
		current,
		written: writeSessionEntry(database, input.target.canonicalKey, input.nextEntry, { previousEntry: current?.entry ?? null }),
		progressCardReset
	};
}
//#endregion
export { applySessionResetInDatabase as t };
