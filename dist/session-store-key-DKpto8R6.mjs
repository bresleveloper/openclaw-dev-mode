import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as normalizeMainKey, i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
//#region src/gateway/session-store-key.ts
function readSessionRoutingFacts(cfg, targets) {
	const agents = listAgentIds(cfg);
	const identities = targets?.map((target) => resolveSessionStoreIdentity({
		...target,
		cfg
	}));
	const scoped = identities?.every(({ agentId }) => agents.includes(agentId));
	return {
		agents: scoped ? void 0 : agents,
		identities,
		storeOwner: scoped && isPerAgentSessionStoreConfig(cfg.session?.store) ? void 0 : resolveSessionStoreCompatibilityAgentId(cfg),
		compatibilityOwner: targets ? void 0 : tryResolveLegacyCompatibilityAgentId(cfg),
		systemOwner: targets ? void 0 : tryResolveAmbientOwnerAgentId(cfg),
		store: cfg.session?.store,
		mainKey: cfg.session?.mainKey,
		scope: cfg.session?.scope
	};
}
/** Canonicalize an opaque session key into the agent-scoped store namespace. */
function canonicalizeSessionKeyForAgent(agentId, key) {
	const lowered = normalizeLowercaseStringOrEmpty(key);
	if (lowered === "global" || lowered === "unknown") return lowered;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(key);
	return normalized.startsWith("agent:") ? normalized : `agent:${normalizeAgentId(agentId)}:${normalized}`;
}
function resolveLogicalSessionStoreAgentId(cfg, sessionKey) {
	const agentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	if (agentId) return agentId;
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey);
	throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `session key "${sessionKey}"`,
		hint: persistedOwner.kind === "retired" ? `Its recorded owner "${persistedOwner.agentId}" is no longer configured. Select a configured agent explicitly.` : "Use an agent-prefixed session key or select an agent explicitly."
	});
}
function resolveParsedSessionStoreKey(cfg, raw, parsed, storeAgentId) {
	const parsedAgentId = normalizeAgentId(parsed.agentId);
	const rest = normalizeLowercaseStringOrEmpty(parsed.rest);
	if (parsedAgentId !== "main" || rest !== "main" && rest !== normalizeMainKey(cfg.session?.mainKey) || listAgentIds(cfg).includes("main")) return {
		agentId: parsedAgentId,
		sessionKey: normalizeSessionKeyPreservingOpaquePeerIds(raw)
	};
	const agentId = storeAgentId ? normalizeAgentId(storeAgentId) : resolveLogicalSessionStoreAgentId(cfg, "main");
	return {
		agentId,
		sessionKey: `agent:${agentId}:${rest}`
	};
}
function canonicalizeParsedSessionStoreKey(cfg, raw, parsed, storeAgentId, preserveQualifiedAddress = false) {
	const resolved = resolveParsedSessionStoreKey(cfg, raw, parsed, storeAgentId);
	if (preserveQualifiedAddress && resolved.agentId === normalizeAgentId(parsed.agentId)) return resolved.sessionKey;
	return canonicalizeMainSessionAlias({
		cfg,
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey
	});
}
/** Resolve any incoming session key into the canonical key used in persisted session stores. */
function resolveSessionStoreKey(params) {
	const raw = normalizeOptionalString(params.sessionKey) ?? "";
	if (!raw) return raw;
	const rawLower = normalizeLowercaseStringOrEmpty(raw);
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	const parsed = parseAgentSessionKey(raw);
	if (parsed) return canonicalizeParsedSessionStoreKey(params.cfg, raw, parsed, params.storeAgentId);
	const rawMainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const storeAgentId = params.storeAgentId ? normalizeAgentId(params.storeAgentId) : void 0;
	if (rawLower === "main" || rawLower === rawMainKey) {
		if (params.cfg.session?.scope === "global") return "global";
		return resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId: storeAgentId ?? resolveLogicalSessionStoreAgentId(params.cfg, raw)
		});
	}
	return canonicalizeSessionKeyForAgent(storeAgentId ?? resolveLogicalSessionStoreAgentId(params.cfg, raw), raw);
}
function resolveRequestedSessionStoreTarget(cfg, sessionKey, explicitAgentId) {
	const requested = resolveRequestedSessionAgentId(cfg, sessionKey, explicitAgentId);
	if (!requested.ok) return requested;
	return ok({
		sessionKey: resolveSessionStoreKey({
			cfg,
			sessionKey,
			storeAgentId: requested.agentId
		}),
		agentId: requested.agentId
	});
}
/** Resolve ownership before a prepared agent's main alias collapses to global. */
function resolveSessionStoreAgentId(cfg, canonicalKey, explicitAgentId) {
	const parsed = parseAgentSessionKey(canonicalKey);
	if (explicitAgentId) {
		const sessionKey = parsed ? resolveParsedSessionStoreKey(cfg, canonicalKey, parsed, explicitAgentId).sessionKey : canonicalKey;
		return resolveSessionAgentId({
			config: cfg,
			sessionKey,
			agentId: explicitAgentId
		});
	}
	return parsed ? normalizeAgentId(parsed.agentId) : resolveLogicalSessionStoreAgentId(cfg, canonicalKey);
}
/** Preserve raw alias ownership and validate the canonical fixed-store boundary together. */
function resolveSessionStoreIdentity(params) {
	const raw = normalizeOptionalString(params.sessionKey) ?? "";
	const requestedAgentId = normalizeOptionalString(params.agentId);
	const parsed = parseAgentSessionKey(raw);
	if (params.preserveQualifiedAddress && parsed) {
		const canonicalKey = normalizeSessionKeyPreservingOpaquePeerIds(raw);
		return {
			agentId: resolveSessionAgentId({
				config: params.cfg,
				sessionKey: canonicalKey,
				agentId: requestedAgentId
			}),
			canonicalKey
		};
	}
	const sessionKey = parsed ? resolveParsedSessionStoreKey(params.cfg, raw, parsed, requestedAgentId).sessionKey : raw;
	const agentId = resolveSessionStoreAgentId(params.cfg, sessionKey, requestedAgentId);
	const canonicalKey = resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey,
		storeAgentId: agentId
	});
	resolveSessionStoreAgentId(params.cfg, canonicalKey, agentId);
	return {
		agentId,
		canonicalKey
	};
}
/** Resolve a session key for lookup inside a specific agent's store. */
function resolveStoredSessionKeyForAgentStore(params) {
	const raw = normalizeOptionalString(params.sessionKey) ?? "";
	if (!raw) return raw;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "global" || lowered === "unknown") return lowered;
	const parsed = parseAgentSessionKey(raw);
	if (parsed) return canonicalizeParsedSessionStoreKey(params.cfg, raw, parsed, params.agentId, params.preserveQualifiedAddress);
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(params.cfg, raw);
	if (persistedOwner.kind === "configured" && persistedOwner.agentId === normalizeAgentId(params.agentId) && lowered !== "main" && lowered !== normalizeMainKey(params.cfg.session?.mainKey)) return raw;
	const key = canonicalizeSessionKeyForAgent(params.agentId, raw);
	return resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: key,
		storeAgentId: params.agentId
	});
}
/** Existing stored lineage wins; only absence permits the shipped main-alias lookup. */
function selectStoredSessionLineage(params) {
	const agentId = normalizeAgentId(parseAgentSessionKey(params.sessionKey)?.agentId ?? params.agentId);
	const target = {
		cfg: params.cfg,
		agentId,
		sessionKey: params.sessionKey
	};
	const storedKey = resolveStoredSessionKeyForAgentStore({
		...target,
		preserveQualifiedAddress: true
	});
	const value = params.read(agentId, storedKey);
	if (value !== void 0 || isIncognitoSessionKey(storedKey)) return {
		agentId,
		key: storedKey,
		value
	};
	const key = resolveStoredSessionKeyForAgentStore(target);
	return {
		agentId,
		key,
		value: key === storedKey && !params.readAlias ? void 0 : (params.readAlias ?? params.read)(agentId, key)
	};
}
/** Resolve the owner agent for a stored session key, returning null for global/unknown keys. */
function resolveStoredSessionOwnerAgentId(params) {
	const canonicalKey = resolveStoredSessionKeyForAgentStore(params);
	if (canonicalKey === "global" || canonicalKey === "unknown") return null;
	return resolveSessionStoreAgentId(params.cfg, canonicalKey);
}
//#endregion
export { resolveSessionStoreIdentity as a, resolveStoredSessionOwnerAgentId as c, resolveSessionStoreAgentId as i, selectStoredSessionLineage as l, readSessionRoutingFacts as n, resolveSessionStoreKey as o, resolveRequestedSessionStoreTarget as r, resolveStoredSessionKeyForAgentStore as s, canonicalizeSessionKeyForAgent as t };
