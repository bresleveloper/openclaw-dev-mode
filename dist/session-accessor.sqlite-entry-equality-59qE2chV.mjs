import { n as SqliteSessionMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-equality.ts
function sqliteSessionEntriesEqual(left, right) {
	if (!left || !right) return left === right;
	const keys = /* @__PURE__ */ new Set([...Object.keys(left), ...Object.keys(right)]);
	for (const key of keys) {
		if (key === "participants" || key === "participantCount") continue;
		if (JSON.stringify(Reflect.get(left, key)) !== JSON.stringify(Reflect.get(right, key))) return false;
	}
	return true;
}
function sqliteLifecycleTargetSnapshotsEqual(left, right) {
	return left.length === right.length && left.every((row, index) => row.sessionKey === right[index]?.sessionKey && sqliteSessionEntriesEqual(row.entry, right[index]?.entry));
}
function assertLifecycleTargetSnapshotUnchanged(expected, current, operationLabel) {
	if (!sqliteLifecycleTargetSnapshotsEqual(expected, current)) throw new SqliteSessionMutationConflictError(operationLabel);
}
//#endregion
export { sqliteLifecycleTargetSnapshotsEqual as n, sqliteSessionEntriesEqual as r, assertLifecycleTargetSnapshotUnchanged as t };
