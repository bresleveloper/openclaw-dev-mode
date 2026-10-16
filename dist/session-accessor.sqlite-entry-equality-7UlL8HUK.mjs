import { l as SqliteSessionMutationConflictError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-equality.ts
function sqliteSessionEntriesEqual(left, right) {
	if (!left || !right) return left === right;
	const { participants: _leftParticipants, participantCount: _leftParticipantCount, sessionDiffBaseline: leftBaseline, skillsSnapshot: leftSkills, systemPromptReport: leftReport, ...leftEntry } = left;
	const { participants: _rightParticipants, participantCount: _rightParticipantCount, sessionDiffBaseline: rightBaseline, skillsSnapshot: rightSkills, systemPromptReport: rightReport, ...rightEntry } = right;
	return JSON.stringify(leftEntry) === JSON.stringify(rightEntry) && JSON.stringify(leftBaseline) === JSON.stringify(rightBaseline) && JSON.stringify(leftSkills) === JSON.stringify(rightSkills) && JSON.stringify(leftReport) === JSON.stringify(rightReport);
}
function sqliteLifecycleTargetSnapshotsEqual(left, right) {
	return left.length === right.length && left.every((row, index) => row.sessionKey === right[index]?.sessionKey && sqliteSessionEntriesEqual(row.entry, right[index]?.entry));
}
function assertLifecycleTargetSnapshotUnchanged(expected, current, operationLabel) {
	if (!sqliteLifecycleTargetSnapshotsEqual(expected, current)) throw new SqliteSessionMutationConflictError(operationLabel);
}
//#endregion
export { sqliteLifecycleTargetSnapshotsEqual as n, sqliteSessionEntriesEqual as r, assertLifecycleTargetSnapshotUnchanged as t };
