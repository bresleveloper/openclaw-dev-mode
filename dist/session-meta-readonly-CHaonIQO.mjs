import "./src-Djeo9OvP.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { n as buildAcpDatabaseSessionKey, o as readPublishedAcpSessionRows, s as resolveReadableAcpSessionRow, u as selectAcpSessionRowForStoreEntry } from "./session-meta-keys-BWMCJN-1.mjs";
//#region src/acp/runtime/session-meta-readonly.ts
/** Each result stays bound to the entry lifecycle captured by the row reader. */
async function readAcpSessionMetaForEntries(params, options = {}) {
	if (params.entries.length === 0) return [];
	const entries = params.entries.map((item) => ({
		keys: [buildAcpDatabaseSessionKey(normalizeStoreSessionKey(item.sessionKey), item.agentId ?? parseAgentSessionKey(item.sessionKey)?.agentId)],
		entry: item.entry ? {
			lifecycleRevision: item.entry.lifecycleRevision,
			sessionId: item.entry.sessionId,
			sessionStartedAt: item.entry.sessionStartedAt
		} : void 0
	}));
	const database = {
		env: params.env,
		path: params.databasePath ?? resolveOpenClawStateSqlitePath(params.env)
	};
	const context = options.current || !getActiveOpenClawStateDatabaseReadSnapshot(database) ? captureOpenClawStateReadWorkerContext(database) : void 0;
	if (context) {
		const published = readPublishedAcpSessionRows(database.path, entries);
		if (published) {
			options.signal?.throwIfAborted();
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
			return published.map((row) => row ? rowToAcpSessionMeta(row) : null);
		}
	}
	const result = await executeExistingOpenClawStateRead(database, {
		type: "acpSessions.metadata",
		entries
	}, {
		...options,
		context
	});
	if (result === void 0) return entries.map(() => null);
	if (result.ok && result.type === "acpSessions.metadata") return result.rows.map((row) => row ? rowToAcpSessionMeta(row) : null);
	throw new Error("Unexpected ACP session metadata read result");
}
/** Read metadata for an already selected entry without loading its session row again. */
async function readAcpSessionMetaForEntryAsync(params, options = {}) {
	if (!params.sessionKey.trim()) return;
	const [metadata] = await readAcpSessionMetaForEntries({
		...params,
		entries: [params]
	}, options);
	return metadata ?? void 0;
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
		row: selectAcpSessionRowForStoreEntry(db, sessionKey, params.agentId, params.entry),
		entry: params.entry
	}), {
		env: params.env,
		path: params.databasePath
	});
	if (!row) return;
	return rowToAcpSessionMeta(row);
}
//#endregion
export { rowToAcpSessionMeta as i, readAcpSessionMetaForEntry as n, readAcpSessionMetaForEntryAsync as r, readAcpSessionMetaForEntries as t };
