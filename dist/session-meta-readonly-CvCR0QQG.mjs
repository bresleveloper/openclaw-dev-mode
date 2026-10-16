import "./src-CdRlGRnW.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly, f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { i as legacyAcpDatabaseSessionKeys, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, s as resolveReadableAcpSessionRow, u as selectAcpSessionRowForStoreEntry } from "./session-meta-keys-Bj_FyJ-3.mjs";
//#region src/acp/runtime/session-meta-readonly.ts
/** Each result stays bound to the entry lifecycle captured by the row reader. */
async function readAcpSessionMetaForEntries(params, options = {}) {
	if (params.entries.length === 0) return [];
	const entries = params.entries.map((item) => ({
		sessionKey: item.sessionKey,
		agentId: item.agentId,
		entry: item.entry ? {
			lifecycleRevision: item.entry.lifecycleRevision,
			sessionId: item.entry.sessionId,
			sessionStartedAt: item.entry.sessionStartedAt
		} : void 0
	}));
	const result = await executeExistingOpenClawStateRead({
		env: params.env,
		path: params.databasePath
	}, {
		type: "acpSessions.metadata",
		entries: entries.map(({ sessionKey, agentId, entry }) => ({
			keys: [buildAcpDatabaseSessionKey(sessionKey, agentId), ...legacyAcpDatabaseSessionKeys(sessionKey, agentId, params.cfg)],
			legacyKey: resolveLegacyFreeAcpSessionKey(sessionKey),
			entry
		}))
	}, options);
	if (result === void 0) return entries.map(() => null);
	if (result.ok && result.type === "acpSessions.metadata") return result.rows.map((row, index) => {
		const readable = resolveReadableAcpSessionRow({
			row: row ?? void 0,
			entry: entries[index]?.entry
		});
		return readable ? rowToAcpSessionMeta(readable) : null;
	});
	throw new Error("Unexpected ACP session metadata read result");
}
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
function readAcpSessionMetaForEntry(params, options = {}) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = (options.current ? withExistingOpenClawStateDatabaseCurrentReadOnly : withExistingOpenClawStateDatabaseReadOnly)(({ db }) => resolveReadableAcpSessionRow({
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
export { readAcpSessionMetaForEntry as n, rowToAcpSessionMeta as r, readAcpSessionMetaForEntries as t };
