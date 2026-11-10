import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { f as upsertAcpSessionMetaRow, n as buildAcpDatabaseSessionKey, r as deleteAcpSessionMetaRows } from "./session-meta-keys-BWMCJN-1.mjs";
import { i as rowToAcpSessionMeta } from "./session-meta-readonly-CHaonIQO.mjs";
//#region src/acp/runtime/session-meta-write.kernel.ts
function bindAcpSessionIdentity(identity) {
	return {
		identity_json: identity ? JSON.stringify(identity) : null,
		resume_agent_session_id: typeof identity?.agentSessionId === "string" ? identity.agentSessionId.trim() : null,
		resume_acpx_session_id: typeof identity?.acpxSessionId === "string" ? identity.acpxSessionId.trim() : null
	};
}
function bindAcpSessionMeta(params) {
	return {
		session_key: params.sessionKey,
		session_id: params.lifecycleRevision ?? params.sessionId ?? null,
		backend: params.meta.backend,
		agent: params.meta.agent,
		runtime_session_name: params.meta.runtimeSessionName,
		...bindAcpSessionIdentity(params.meta.identity),
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
	let written;
	if (input.decision.kind === "clear") {
		keys.add(initialKey);
		keys.add(finalKey);
	} else {
		if (!input.entry) throw new Error("ACP metadata publication lost its canonical entry");
		written = expectDefined(upsertAcpSessionMetaRow(db, bindAcpSessionMeta({
			sessionKey: finalKey,
			sessionId: input.entry.sessionId,
			lifecycleRevision: input.entry.lifecycleRevision,
			meta: input.decision.meta,
			updatedAt: input.entry.updatedAt
		})), "committed ACP metadata");
		if (initialKey !== finalKey) keys.add(initialKey);
	}
	if (input.currentRowKey && (input.decision.kind === "clear" || input.currentRowKey !== finalKey)) keys.add(input.currentRowKey);
	deleteAcpSessionMetaRows(db, [...keys]);
	return {
		kind: "acp",
		sessionId: input.entry?.sessionId,
		lifecycleRevision: input.entry?.lifecycleRevision ?? null,
		sessionStartedAt: input.entry?.sessionStartedAt,
		acp: written ? rowToAcpSessionMeta(written) : null
	};
}
//#endregion
export { bindAcpSessionIdentity as n, bindAcpSessionMeta as r, applyAcpSessionMutation as t };
