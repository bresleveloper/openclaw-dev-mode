import { m as expressionBuilder, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { c as voiceSessionRowsQuery, i as parseStoredVoiceSessionRecord } from "./client-voice-session-store-CxbQv7Yf.mjs";
//#region src/talk/client-voice-session-lookup.worker.ts
function voiceSessionField(field) {
	const eb = expressionBuilder();
	return eb.case().when(eb.fn("json_valid", ["value_json"])).then(eb.fn("json_extract", ["value_json", sql.lit(`$.${field}`)])).end();
}
/** The partial indexes exclude closed/invalid JSON before any payload reaches the decoder. */
function lookupOpenVoiceSessions(database, input) {
	let query = voiceSessionRowsQuery(database).where(voiceSessionField("status"), "=", sql.lit("open"));
	if (input.kind === "legacy") query = query.where(voiceSessionField("agentId"), "=", input.agentId).where(voiceSessionField("sessionKey"), "=", input.sessionKey).where(voiceSessionField("origin"), "=", "client");
	else {
		query = query.where("updated_at", "<=", input.updatedBefore);
		if (input.excludeVoiceSessionId !== void 0) query = query.where(voiceSessionField("voiceSessionId"), "!=", input.excludeVoiceSessionId);
	}
	const matches = [];
	for (const row of iterateSqliteQuerySync(database.db, query)) {
		const record = parseStoredVoiceSessionRecord(row.value_json);
		if (record) {
			matches.push({
				voiceSessionId: record.voiceSessionId,
				sessionKey: record.sessionKey
			});
			if (input.kind === "legacy" && matches.length === 2) break;
		}
	}
	return matches;
}
/** Decode candidates inside the existing agent history reader. */
function readOpenVoiceSessions(options, input) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => lookupOpenVoiceSessions(database, input), options);
	return {
		kind: "voice-sessions",
		matches: result.found ? result.value : []
	};
}
//#endregion
export { readOpenVoiceSessions };
