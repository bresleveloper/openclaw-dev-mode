import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as selectAcpSessionRow, d as selectLegacyFreeAcpSessionRows, f as upsertAcpSessionMetaRow, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, r as getAcpSessionKysely, t as acpSessionRowMatchesEntry } from "./session-meta-keys-Bj_FyJ-3.mjs";
//#region src/acp/runtime/session-meta-write.kernel.ts
function bindAcpSessionMeta(params) {
	return {
		session_key: params.sessionKey,
		session_id: params.lifecycleRevision ?? params.sessionId ?? null,
		backend: params.meta.backend,
		agent: params.meta.agent,
		runtime_session_name: params.meta.runtimeSessionName,
		identity_json: params.meta.identity ? JSON.stringify(params.meta.identity) : null,
		mode: params.meta.mode,
		runtime_options_json: params.meta.runtimeOptions ? JSON.stringify(params.meta.runtimeOptions) : null,
		cwd: params.meta.cwd ?? null,
		state: params.meta.state,
		last_activity_at: params.meta.lastActivityAt,
		last_error: params.meta.lastError ?? null,
		updated_at: params.updatedAt
	};
}
/** Shared SQL policy for worker writes and the retained native owner. */
function applyAcpSessionMutation(db, input) {
	const initialKey = buildAcpDatabaseSessionKey(input.storageSessionKey, input.agentId);
	const finalKey = buildAcpDatabaseSessionKey(input.sessionKey, input.agentId);
	const keys = /* @__PURE__ */ new Set();
	if (input.decision.kind === "clear") {
		keys.add(initialKey);
		keys.add(finalKey);
	} else {
		if (!input.entry) throw new Error("ACP metadata publication lost its canonical entry");
		upsertAcpSessionMetaRow(db, bindAcpSessionMeta({
			sessionKey: finalKey,
			sessionId: input.entry.sessionId,
			lifecycleRevision: input.entry.lifecycleRevision,
			meta: input.decision.meta,
			updatedAt: input.entry.updatedAt
		}));
		if (initialKey !== finalKey) keys.add(initialKey);
		if (finalKey !== input.sessionKey && !resolveLegacyFreeAcpSessionKey(input.sessionKey)) {
			const row = selectAcpSessionRow(db, input.sessionKey);
			if (row && acpSessionRowMatchesEntry(row, input.entry)) keys.add(input.sessionKey);
		}
	}
	if (input.currentRowKey && (input.decision.kind === "clear" || input.currentRowKey !== finalKey) && !resolveLegacyFreeAcpSessionKey(input.currentRowKey)) keys.add(input.currentRowKey);
	for (const aliases of selectLegacyFreeAcpSessionRows(db, [input.storageSessionKey, input.sessionKey]).values()) for (const alias of aliases) if (acpSessionRowMatchesEntry(alias, input.entry)) keys.add(alias.session_key);
	for (const key of keys) executeSqliteQuerySync(db, getAcpSessionKysely(db).deleteFrom("acp_sessions").where("session_key", "=", key));
}
//#endregion
export { bindAcpSessionMeta as n, applyAcpSessionMutation as t };
