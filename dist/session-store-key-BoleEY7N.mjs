import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, O as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-DN7PUqhR.mjs";
//#region src/gateway/session-store-key.ts
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
	if (persistedOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `session key "${sessionKey}"`,
		hint: `Its recorded owner "${persistedOwner.agentId}" is no longer configured. Select a configured agent explicitly.`
	});
	throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `session key "${sessionKey}"`,
		hint: "Use an agent-prefixed session key or select an agent explicitly."
	});
}
function resolveParsedSessionStoreKey(cfg, raw, parsed, options) {
	const parsedAgentId = normalizeAgentId(parsed.agentId);
	const rest = normalizeLowercaseStringOrEmpty(parsed.rest);
	if (parsedAgentId !== "main" || rest !== "main" && rest !== normalizeMainKey(cfg.session?.mainKey) || listAgentIds(cfg).includes("main")) return {
		agentId: parsedAgentId,
		sessionKey: normalizeSessionKeyPreservingOpaquePeerIds(raw)
	};
	const agentId = options?.storeAgentId ? normalizeAgentId(options.storeAgentId) : resolveLogicalSessionStoreAgentId(cfg, "main");
	return {
		agentId,
		sessionKey: `agent:${agentId}:${rest}`
	};
}
function canonicalizeParsedSessionStoreKey(cfg, raw, parsed, storeAgentId) {
	const resolved = resolveParsedSessionStoreKey(cfg, raw, parsed, { storeAgentId });
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
/** Resolve ownership before a prepared agent's main alias collapses to global. */
function resolveSessionStoreAgentId(cfg, canonicalKey, explicitAgentId) {
	if (explicitAgentId) {
		const parsed = parseAgentSessionKey(canonicalKey);
		const sessionKey = parsed ? resolveParsedSessionStoreKey(cfg, canonicalKey, parsed, { storeAgentId: explicitAgentId }).sessionKey : canonicalKey;
		return resolveSessionAgentId({
			config: cfg,
			sessionKey,
			agentId: explicitAgentId
		});
	}
	const parsed = parseAgentSessionKey(canonicalKey);
	return parsed ? normalizeAgentId(parsed.agentId) : resolveLogicalSessionStoreAgentId(cfg, canonicalKey);
}
/** Preserve raw alias ownership and validate the canonical fixed-store boundary together. */
function resolveSessionStoreIdentity(params) {
	const raw = normalizeOptionalString(params.sessionKey) ?? "";
	const requestedAgentId = normalizeOptionalString(params.agentId);
	const parsed = parseAgentSessionKey(raw);
	const sessionKey = parsed ? resolveParsedSessionStoreKey(params.cfg, raw, parsed, { storeAgentId: requestedAgentId }).sessionKey : raw;
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
	if (parsed) return canonicalizeParsedSessionStoreKey(params.cfg, raw, parsed, params.agentId);
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(params.cfg, raw);
	if (persistedOwner.kind === "configured" && persistedOwner.agentId === normalizeAgentId(params.agentId) && lowered !== "main" && lowered !== normalizeMainKey(params.cfg.session?.mainKey)) return raw;
	const key = canonicalizeSessionKeyForAgent(params.agentId, raw);
	return resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: key,
		storeAgentId: params.agentId
	});
}
/** Resolve the owner agent for a stored session key, returning null for global/unknown keys. */
function resolveStoredSessionOwnerAgentId(params) {
	const canonicalKey = resolveStoredSessionKeyForAgentStore(params);
	if (canonicalKey === "global" || canonicalKey === "unknown") return null;
	return resolveSessionStoreAgentId(params.cfg, canonicalKey);
}
//#endregion
export { resolveStoredSessionKeyForAgentStore as a, resolveSessionStoreKey as i, resolveSessionStoreAgentId as n, resolveStoredSessionOwnerAgentId as o, resolveSessionStoreIdentity as r, canonicalizeSessionKeyForAgent as t };
