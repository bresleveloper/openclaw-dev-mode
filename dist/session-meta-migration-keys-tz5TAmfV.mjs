import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { D as tryResolveLegacyDataOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { a as parseAcpDatabaseSessionKey, i as getAcpSessionKysely, l as selectAcpSessionRowForRead, n as buildAcpDatabaseSessionKey, t as acpSessionRowMatchesEntry } from "./session-meta-keys-BWMCJN-1.mjs";
//#region src/acp/runtime/session-meta-migration-keys.ts
function parseLegacyAcpSessionKeyCandidates(sessionKey) {
	const canonical = parseAcpDatabaseSessionKey(sessionKey);
	if (canonical) return [{
		...canonical,
		agentId: canonical.agentId ?? parseAgentSessionKey(normalizeLowercaseStringOrEmpty(canonical.storeSessionKey))?.agentId
	}, { storeSessionKey: sessionKey }];
	const normalized = normalizeLowercaseStringOrEmpty(sessionKey);
	const parsed = parseAgentSessionKey(normalized);
	if (parsed?.rest.startsWith("acp:") && !parsed.rest.startsWith("acp:binding:")) return [{
		agentId: parsed.agentId,
		storeSessionKey: normalized
	}];
	if (sessionKey.startsWith("@agent:")) {
		const remainder = sessionKey.slice(7);
		const separator = remainder.indexOf(":");
		if (separator > 0) return [{
			agentId: normalizeAgentId(remainder.slice(0, separator)),
			storeSessionKey: remainder.slice(separator + 1)
		}, { storeSessionKey: sessionKey }];
	}
	return [{
		agentId: parsed?.agentId,
		storeSessionKey: sessionKey
	}];
}
/** Doctor and startup admission share the complete set of historical owner interpretations. */
function legacyAcpSessionKeyCandidates(sessionKey, agentIds) {
	return parseLegacyAcpSessionKeyCandidates(sessionKey).flatMap((identity) => identity.agentId ? [{
		agentId: identity.agentId,
		storeSessionKey: identity.storeSessionKey,
		ownerRecorded: true
	}] : agentIds.map((agentId) => ({
		agentId,
		storeSessionKey: identity.storeSessionKey,
		ownerRecorded: false
	})));
}
/** Legacy file imports inspect every supported prior key before deciding whether metadata is superseded. */
function selectAcpMigrationRowForStoreEntry(database, sessionKey, agentId, cfg, entry) {
	const normalizedKey = sessionKey.trim();
	const parsed = parseAgentSessionKey(normalizedKey);
	const persisted = resolvePersistedSessionStoreOwnerForKey(cfg, normalizedKey);
	const owner = persisted.kind === "configured" ? persisted.agentId : persisted.kind === "none" ? tryResolveLegacyDataOwnerAgentId(cfg) : void 0;
	const keys = [
		buildAcpDatabaseSessionKey(normalizedKey, agentId),
		...!parsed ? [`@agent:${normalizeAgentId(agentId)}:${normalizedKey}`] : [],
		...parsed || owner === normalizeAgentId(agentId) ? [normalizedKey] : []
	];
	const selected = selectAcpSessionRowForRead(database, {
		keys,
		entry
	});
	if (selected) return selected;
	const normalized = normalizeLowercaseStringOrEmpty(normalizedKey);
	const free = parseAgentSessionKey(normalized);
	if (!free?.rest.startsWith("acp:") || free.rest.startsWith("acp:binding:")) return;
	return executeSqliteQuerySync(database, getAcpSessionKysely(database).selectFrom("acp_sessions").selectAll().where((eb) => eb.fn("lower", ["session_key"]), "=", normalized).orderBy("last_activity_at", "desc").orderBy("session_key", "asc")).rows.find((row) => acpSessionRowMatchesEntry(row, entry));
}
//#endregion
export { selectAcpMigrationRowForStoreEntry as n, legacyAcpSessionKeyCandidates as t };
