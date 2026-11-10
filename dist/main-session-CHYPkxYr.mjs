import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as normalizeMainKey, r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { m as resolveAmbientOwnerAgentId, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-BNNxukz6.mjs";
//#region src/config/sessions/main-session.ts
const FALLBACK_DEFAULT_AGENT_ID = "main";
const SESSION_ROUTING_CHANGED_ERROR_REASON = "session-routing-changed";
/** Resolves the configured main session key, honoring global session scope. */
function resolveMainSessionKey(cfg) {
	return resolveCanonicalMainSessionKey({
		agentId: resolveAmbientOwnerAgentId(cfg, void 0, {
			surface: "main-session routing",
			hint: "Pass an explicit agent/session key instead of the unscoped main alias."
		}),
		mainKey: cfg.session?.mainKey,
		sessionScope: cfg.session?.scope
	});
}
/** Resolves the owner and canonical session target for ambient system work. */
function resolveSystemMainSessionTarget(cfg) {
	const agentId = resolveAmbientOwnerAgentId(cfg);
	return {
		agentId,
		sessionKey: resolveCanonicalMainSessionKey({
			agentId,
			mainKey: cfg.session?.mainKey,
			sessionScope: cfg.session?.scope
		})
	};
}
/** Resolves the main session owned by configured ambient system work. */
function resolveSystemMainSessionKey(cfg) {
	return resolveSystemMainSessionTarget(cfg).sessionKey;
}
/** Stable fingerprint for the config values that canonicalize chat session keys. */
function resolveSessionRoutingContract(cfg) {
	const scope = cfg?.session?.scope ?? "per-sender";
	const persistedOwner = scope === "global" ? resolvePersistedSessionStoreOwnerForKey(cfg, "global") : { kind: "none" };
	const routingOwner = persistedOwner.kind === "configured" ? persistedOwner.agentId : persistedOwner.kind === "retired" ? `retired:${persistedOwner.agentId}` : tryResolveAmbientOwnerAgentId(cfg) ?? (cfg.agents?.ownership === "explicit" ? "unowned" : listAgentIds(cfg)[0] ?? "main");
	return [
		scope,
		normalizeMainKey(cfg?.session?.mainKey),
		routingOwner
	].join("|");
}
/** Resolves the main session key for one explicit agent. */
function resolveAgentMainSessionKey(params) {
	return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.cfg?.session?.mainKey
	});
}
/** Resolves an explicit agent id to its canonical main session key. */
function resolveExplicitAgentSessionKey(params) {
	const agentId = params.agentId?.trim();
	if (!agentId) return;
	return resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId
	});
}
/** Canonicalizes main-session aliases to the current scoped session key. */
function canonicalizeMainSessionAlias(params) {
	const raw = params.sessionKey.trim();
	if (!raw) return raw;
	const mainKey = normalizeMainKey(params.cfg?.session?.mainKey);
	if (raw !== "main" && raw !== mainKey && !raw.endsWith(":main") && !(raw.endsWith(mainKey) && raw[raw.length - mainKey.length - 1] === ":")) return raw;
	const agentId = normalizeAgentId(params.agentId);
	const agentMainSessionKey = buildAgentMainSessionKey({
		agentId,
		mainKey
	});
	const agentMainAliasKey = buildAgentMainSessionKey({
		agentId,
		mainKey: "main"
	});
	const legacyMainKey = buildAgentMainSessionKey({
		agentId: FALLBACK_DEFAULT_AGENT_ID,
		mainKey
	});
	const legacyMainAliasKey = buildAgentMainSessionKey({
		agentId: FALLBACK_DEFAULT_AGENT_ID,
		mainKey: "main"
	});
	const isMainAlias = raw === "main" || raw === mainKey || raw === agentMainSessionKey || raw === agentMainAliasKey || raw === legacyMainKey || raw === legacyMainAliasKey;
	if (params.cfg?.session?.scope === "global" && isMainAlias) return "global";
	if (isMainAlias) return agentMainSessionKey;
	return raw;
}
//#endregion
export { resolveMainSessionKey as a, resolveSystemMainSessionTarget as c, resolveExplicitAgentSessionKey as i, canonicalizeMainSessionAlias as n, resolveSessionRoutingContract as o, resolveAgentMainSessionKey as r, resolveSystemMainSessionKey as s, SESSION_ROUTING_CHANGED_ERROR_REASON as t };
