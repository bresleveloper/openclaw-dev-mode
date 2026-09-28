import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { C as tryResolveLegacyDataOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
//#region src/acp/runtime/session-meta-keys.ts
function getAcpSessionKysely(db) {
	return getNodeSqliteKysely(db);
}
function selectAcpSessionRow(db, sessionKey) {
	return executeSqliteQueryTakeFirstSync(db, getAcpSessionKysely(db).selectFrom("acp_sessions").selectAll().where("session_key", "=", sessionKey));
}
const ACP_DATABASE_KEY_PREFIX = "@acp:v1:";
const ACP_LEGACY_AGENT_SCOPED_DB_KEY_PREFIX = "@agent:";
function buildAcpDatabaseSessionKey(storeSessionKey, agentId) {
	const normalizedKey = storeSessionKey.trim();
	const identity = [agentId ? normalizeAgentId(agentId) : null, normalizedKey];
	return `${ACP_DATABASE_KEY_PREFIX}${Buffer.from(JSON.stringify(identity), "utf8").toString("base64url")}`;
}
function parseAcpDatabaseSessionKey(sessionKey) {
	if (sessionKey.startsWith(ACP_DATABASE_KEY_PREFIX)) {
		try {
			const decoded = JSON.parse(Buffer.from(sessionKey.slice(8), "base64url").toString("utf8"));
			if (Array.isArray(decoded) && decoded.length === 2 && (decoded[0] === null || typeof decoded[0] === "string") && typeof decoded[1] === "string") return {
				...decoded[0] ? { agentId: normalizeAgentId(decoded[0]) } : {},
				storeSessionKey: decoded[1]
			};
		} catch {}
		return { storeSessionKey: sessionKey };
	}
	if (!sessionKey.startsWith(ACP_LEGACY_AGENT_SCOPED_DB_KEY_PREFIX)) return { storeSessionKey: sessionKey };
	const remainder = sessionKey.slice(7);
	const separator = remainder.indexOf(":");
	return separator > 0 ? {
		agentId: normalizeAgentId(remainder.slice(0, separator)),
		storeSessionKey: remainder.slice(separator + 1)
	} : { storeSessionKey: sessionKey };
}
function parseAcpDatabaseSessionKeyCandidates(sessionKey) {
	const parsed = parseAcpDatabaseSessionKey(sessionKey);
	if (parsed.storeSessionKey === sessionKey && parsed.agentId === void 0) return [parsed];
	return [parsed, { storeSessionKey: sessionKey }];
}
function resolveAcpLegacyUnscopedOwner(cfg, storeSessionKey) {
	if (!cfg) return;
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, storeSessionKey);
	return persistedOwner.kind === "configured" ? persistedOwner.agentId : persistedOwner.kind === "none" ? tryResolveLegacyDataOwnerAgentId(cfg) : void 0;
}
function legacyAcpDatabaseSessionKeys(storeSessionKey, agentId, cfg) {
	const normalizedKey = storeSessionKey.trim();
	const keys = [];
	if (agentId && !parseAgentSessionKey(normalizedKey)) keys.push(`${ACP_LEGACY_AGENT_SCOPED_DB_KEY_PREFIX}${normalizeAgentId(agentId)}:${normalizedKey}`);
	if (parseAgentSessionKey(normalizedKey) || !agentId || resolveAcpLegacyUnscopedOwner(cfg, normalizedKey) === normalizeAgentId(agentId)) keys.push(normalizedKey);
	return [...new Set(keys)];
}
function acpSessionRowMatchesEntry(row, entry) {
	return row.session_id == null || row.session_id === entry?.lifecycleRevision || row.session_id === entry?.sessionId && (entry?.sessionStartedAt === void 0 || row.updated_at >= entry.sessionStartedAt);
}
/** Only raw free-runtime ACP aliases have the historical case-fold lookup contract. */
function resolveLegacyFreeAcpSessionKey(sessionKey) {
	const normalized = normalizeLowercaseStringOrEmpty(sessionKey);
	const parsed = parseAgentSessionKey(normalized);
	return parsed?.rest.startsWith("acp:") && !parsed.rest.startsWith("acp:binding:") ? normalized : void 0;
}
function selectLegacyFreeAcpSessionRows(database, sessionKeys) {
	const keys = [...new Set(sessionKeys.flatMap((key) => {
		const normalized = resolveLegacyFreeAcpSessionKey(key);
		return normalized ? [normalized] : [];
	}))];
	const rowsByKey = /* @__PURE__ */ new Map();
	for (let index = 0; index < keys.length; index += 500) {
		const rows = executeSqliteQuerySync(database, getAcpSessionKysely(database).selectFrom("acp_sessions").selectAll().where((eb) => eb.fn("lower", ["session_key"]), "in", keys.slice(index, index + 500)).orderBy("last_activity_at", "desc").orderBy("session_key", "asc")).rows;
		for (const row of rows) {
			const key = normalizeLowercaseStringOrEmpty(row.session_key);
			const matches = rowsByKey.get(key) ?? [];
			matches.push(row);
			rowsByKey.set(key, matches);
		}
	}
	return rowsByKey;
}
function selectAcpSessionRowForStoreEntry(db, storeSessionKey, agentId, cfg, entry) {
	const databaseKey = buildAcpDatabaseSessionKey(storeSessionKey, agentId);
	for (const key of [databaseKey, ...legacyAcpDatabaseSessionKeys(storeSessionKey, agentId, cfg)]) {
		const row = selectAcpSessionRow(db, key);
		if (row && (!entry || acpSessionRowMatchesEntry(row, entry))) return row;
	}
	const legacyKey = resolveLegacyFreeAcpSessionKey(storeSessionKey);
	return legacyKey ? selectLegacyFreeAcpSessionRows(db, [legacyKey]).get(legacyKey)?.find((row) => acpSessionRowMatchesEntry(row, entry)) : void 0;
}
function resolveReadableAcpSessionRow(params) {
	const { row, entry } = params;
	return row && acpSessionRowMatchesEntry(row, entry) ? row : void 0;
}
function upsertAcpSessionMetaRow(db, row) {
	executeSqliteQuerySync(db, getAcpSessionKysely(db).insertInto("acp_sessions").values(row).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		session_id: (eb) => eb.ref("excluded.session_id"),
		backend: (eb) => eb.ref("excluded.backend"),
		agent: (eb) => eb.ref("excluded.agent"),
		runtime_session_name: (eb) => eb.ref("excluded.runtime_session_name"),
		identity_json: (eb) => eb.ref("excluded.identity_json"),
		mode: (eb) => eb.ref("excluded.mode"),
		runtime_options_json: (eb) => eb.ref("excluded.runtime_options_json"),
		cwd: (eb) => eb.ref("excluded.cwd"),
		state: (eb) => eb.ref("excluded.state"),
		last_activity_at: (eb) => eb.ref("excluded.last_activity_at"),
		last_error: (eb) => eb.ref("excluded.last_error"),
		updated_at: (eb) => eb.ref("excluded.updated_at")
	})));
}
//#endregion
export { parseAcpDatabaseSessionKeyCandidates as a, selectAcpSessionRow as c, upsertAcpSessionMetaRow as d, legacyAcpDatabaseSessionKeys as i, selectAcpSessionRowForStoreEntry as l, buildAcpDatabaseSessionKey as n, resolveLegacyFreeAcpSessionKey as o, getAcpSessionKysely as r, resolveReadableAcpSessionRow as s, acpSessionRowMatchesEntry as t, selectLegacyFreeAcpSessionRows as u };
