import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { n as SessionTranscriptStorageUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-Daj5_oBL.mjs";
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
