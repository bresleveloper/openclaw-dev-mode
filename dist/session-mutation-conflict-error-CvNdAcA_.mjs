import { c as readErrorCauses, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
//#region src/config/sessions/session-mutation-conflict-error.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.operationLabel = operationLabel;
		this.name = "SqliteSessionMutationConflictError";
	}
};
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
function isSqliteTranscriptMutationConflict(error) {
	return collectErrorGraphCandidates(error, readErrorCauses).some((candidate) => candidate instanceof SqliteTranscriptMutationConflictError);
}
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
export { isSqliteTranscriptMutationConflict as i, SqliteSessionMutationConflictError as n, SqliteTranscriptMutationConflictError as r, SessionEntryLifecycleUpsertConflictError as t };
