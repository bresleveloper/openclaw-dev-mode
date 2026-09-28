import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-CEJGTMGy.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-projection.ts
function withCurrentProjectionSnapshot(scope, read, options = {}) {
	const resolved = options.resolvedScope ?? resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const readSnapshot = (database) => readCurrentProjectionSnapshot(database, resolved, read);
	const result = options.readOnly ? withOpenClawAgentDatabaseReadOnly(readSnapshot, databaseOptions) : {
		found: true,
		value: readSnapshot(openOpenClawAgentDatabase(databaseOptions))
	};
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	if (result.value.kind === "value") return result.value.value;
	if (!options.readOnly) startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: resolved.sessionId
	});
	throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
}
//#endregion
export { withCurrentProjectionSnapshot as t };
