import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
//#region src/config/sessions/session-accessor.sqlite-active-projection.ts
function withCurrentProjectionSnapshot(scope, read, options = {}) {
	const resolved = options.resolvedScope ?? resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const readSnapshot = (database) => readCurrentProjectionSnapshot(database, resolved, read);
	if (options.transaction && !options.transaction.db.isTransaction) throw new Error("Transcript projection lost its borrowed transaction");
	const result = options.transaction ? {
		found: true,
		value: readSnapshot(options.transaction)
	} : options.readOnly ? withOpenClawAgentDatabaseReadOnly(readSnapshot, databaseOptions, { snapshot: true }) : {
		found: true,
		value: readSnapshot(openOpenClawAgentDatabase(databaseOptions))
	};
	if (!result.found) throw new SessionTranscriptStorageUnavailableError(result.reason);
	if (result.value.kind === "value") return result.value.value;
	if (!options.readOnly && !options.transaction) startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: resolved.sessionId
	});
	throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
}
//#endregion
export { withCurrentProjectionSnapshot as t };
