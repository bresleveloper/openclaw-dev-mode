import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as readTranscriptStatsBatchFromDatabase } from "./session-accessor.sqlite-transcript-stats-CaGrryDT.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-stats-read.ts
/** Read transcript stats in database groups without joining the writable lifecycle. */
function readTranscriptStatsBatchReadOnlySync(scopes) {
	const results = scopes.map(() => null);
	const targetCache = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const [index, scope] of scopes.entries()) {
		const resolved = resolveSqliteTranscriptReadScope(scope, targetCache);
		const options = toDatabaseOptions(resolved);
		const pathname = resolveOpenClawAgentSqlitePath(options);
		const key = `${options.agentId}\0${pathname}`;
		const group = groups.get(key) ?? {
			options,
			items: []
		};
		group.items.push({
			index,
			sessionId: resolved.sessionId
		});
		groups.set(key, group);
	}
	for (const group of groups.values()) try {
		const read = withOpenClawAgentDatabaseReadOnly((database) => readTranscriptStatsBatchFromDatabase(database, group.items.map((item) => item.sessionId)), group.options);
		if (read.found) for (const [index, item] of group.items.entries()) results[item.index] = read.value[index];
	} catch (error) {
		if (!(error instanceof SessionMetadataUnavailableError)) throw error;
	}
	return results;
}
//#endregion
export { readTranscriptStatsBatchReadOnlySync as t };
