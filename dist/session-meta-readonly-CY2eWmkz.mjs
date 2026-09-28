import "./src-CZ2wJvNB.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { l as selectAcpSessionRowForStoreEntry, s as resolveReadableAcpSessionRow } from "./session-meta-keys-BA3YapJY.mjs";
//#region src/acp/runtime/session-meta-readonly.ts
function rowToAcpSessionMeta(row) {
	const identity = safeParseJsonRecord(row.identity_json ?? "");
	const runtimeOptions = safeParseJsonRecord(row.runtime_options_json ?? "");
	return {
		backend: row.backend,
		agent: row.agent,
		runtimeSessionName: row.runtime_session_name,
		...identity ? { identity } : {},
		mode: row.mode === "oneshot" ? "oneshot" : "persistent",
		...runtimeOptions ? { runtimeOptions } : {},
		...row.cwd != null ? { cwd: row.cwd } : {},
		state: row.state === "running" || row.state === "error" ? row.state : "idle",
		lastActivityAt: row.last_activity_at,
		...row.last_error != null ? { lastError: row.last_error } : {}
	};
}
function readAcpSessionMetaForEntry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = withExistingOpenClawStateDatabaseReadOnly(({ db }) => resolveReadableAcpSessionRow({
		row: selectAcpSessionRowForStoreEntry(db, sessionKey, params.agentId, params.cfg, params.entry),
		entry: params.entry
	}), {
		env: params.env,
		path: params.databasePath
	});
	if (!row) return;
	return rowToAcpSessionMeta(row);
}
//#endregion
export { rowToAcpSessionMeta as n, readAcpSessionMetaForEntry as t };
