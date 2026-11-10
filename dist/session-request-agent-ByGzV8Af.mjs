import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { a as normalizeMainKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, o as classifySessionKeyShape } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, s as createAgentDatabaseAdmissionErrorShape } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
//#region src/gateway/session-subscription-keys.ts
function resolveSessionSubscriptionKey(sessionKey, agentId) {
	return normalizeLowercaseStringOrEmpty(sessionKey) === "global" ? `agent:${normalizeAgentId(agentId)}:global` : sessionKey;
}
function resolveSessionSubscriptionKeys(sessionKey, agentId, defaultAgentId) {
	const canonicalKey = resolveSessionSubscriptionKey(sessionKey, agentId);
	return defaultAgentId && normalizeLowercaseStringOrEmpty(sessionKey) === "global" && normalizeAgentId(agentId) === normalizeAgentId(defaultAgentId) ? [canonicalKey, "global"] : [canonicalKey];
}
//#endregion
//#region src/gateway/session-request-agent.ts
/** The shipped chat-send global alias selects main outside configured global scope. */
function resolveChatSendSessionKey(cfg, sessionKey, agentId) {
	return cfg.session?.scope !== "global" && sessionKey.trim().toLowerCase() === "global" ? resolveAgentMainSessionKey({
		cfg,
		agentId
	}) : sessionKey;
}
function admitRequestedAgent(agentId) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId);
	return refusal ? {
		ok: false,
		error: createAgentDatabaseAdmissionErrorShape(refusal)
	} : {
		ok: true,
		agentId
	};
}
/** Resolves public event identity separately from private session routing ownership. */
function resolveSessionEventAgentScope(cfg, key, explicitAgentId, publishQualifiedAgent = false) {
	const parsed = parseAgentSessionKey(key.trim());
	const keyAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : void 0;
	const explicit = explicitAgentId === void 0 ? null : normalizeAgentIdStrict(explicitAgentId);
	if (explicit !== null && !explicit.ok) return null;
	if (explicit?.value && keyAgentId && explicit.value !== keyAgentId) return null;
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	const compatibilityOwnerAgentId = keyAgentId ? void 0 : tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	return [
		explicit?.value ?? (publishQualifiedAgent && keyAgentId && listAgentIds(cfg).includes(keyAgentId) ? keyAgentId : void 0),
		explicit?.value ?? keyAgentId ?? compatibilityOwnerAgentId ?? (persistedOwner.kind === "retired" ? persistedOwner.agentId : void 0),
		compatibilityOwnerAgentId
	];
}
/** Binds a retired unqualified owner to its private sharing scope. */
function resolvePrivateSessionEventBroadcastScope(key, [eventAgentId, routingAgentId, compatibilityOwnerAgentId]) {
	return key && !parseAgentSessionKey(key) && !eventAgentId && routingAgentId && !compatibilityOwnerAgentId ? {
		agentId: routingAgentId,
		sessionKeys: resolveSessionSubscriptionKeys(key, routingAgentId)
	} : void 0;
}
/** Resolves only stable implicit ownership for unscoped session rows and active runs. */
function tryResolveSessionCompatibilityOwnerAgentId(cfg, key) {
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	if (persistedStoreOwner.kind === "configured") return persistedStoreOwner.agentId;
	return persistedStoreOwner.kind === "retired" ? void 0 : tryResolveLegacyCompatibilityAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
function resolveRequestedSessionAgentInput(key, explicitAgentId) {
	if (classifySessionKeyShape(key) === "malformed_agent") return invalidSessionRequest(`malformed session key "${key}"`);
	const agent = explicitAgentId === void 0 ? null : normalizeAgentIdStrict(explicitAgentId);
	return agent && !agent.ok ? invalidSessionRequest(`Unknown agent id "${explicitAgentId}"`) : ok(agent?.value);
}
function resolveRequestedSessionAgentId(cfg, key, explicitAgentId) {
	const input = resolveRequestedSessionAgentInput(key, explicitAgentId);
	if (!input.ok) return input;
	const parsed = parseAgentSessionKey(key?.trim());
	const configuredAgentIds = listAgentIds(cfg);
	const normalizedRequestedAgentId = input.value;
	if (normalizedRequestedAgentId && !configuredAgentIds.includes(normalizedRequestedAgentId)) return invalidSessionRequest(`Unknown agent id "${explicitAgentId}"`);
	let ownerKey = key;
	if (parsed?.agentId) {
		const keyAgentId = normalizeAgentId(parsed.agentId);
		const keyIsGlobalMainAlias = cfg.session?.scope === "global" && (parsed.rest === "main" || parsed.rest === normalizeMainKey(cfg.session?.mainKey));
		if (keyIsGlobalMainAlias && !configuredAgentIds.includes(keyAgentId)) return invalidSessionRequest(`Unknown agent id "${parsed.agentId}"`);
		if (normalizedRequestedAgentId && keyAgentId !== normalizedRequestedAgentId) return invalidSessionRequest(`agent "${explicitAgentId}" does not match session key agent "${keyAgentId}"`);
		if (!keyIsGlobalMainAlias || !normalizedRequestedAgentId) return admitRequestedAgent(keyAgentId);
		ownerKey = "global";
	}
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, ownerKey);
	if (persistedStoreOwner.kind === "retired") return invalidSessionRequest(`session key belongs to retired agent "${persistedStoreOwner.agentId}"`);
	if (normalizedRequestedAgentId) {
		if (persistedStoreOwner.kind === "configured" && persistedStoreOwner.agentId !== normalizedRequestedAgentId) return invalidSessionRequest(`agent "${explicitAgentId}" does not match session key agent "${persistedStoreOwner.agentId}"`);
		return admitRequestedAgent(normalizedRequestedAgentId);
	}
	const inferredAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	if (inferredAgentId) return admitRequestedAgent(inferredAgentId);
	const selectionError = new AgentSelectionRequiredError(configuredAgentIds, {
		surface: `session key "${key}"`,
		hint: "Pass agentId or use an agent-prefixed session key."
	});
	return invalidSessionRequest(selectionError.message);
}
/** Fresh children inherit a qualified parent only in explicit-ownership fleets. */
function resolveSessionCreateAgentId(cfg, input) {
	const parentAgentId = cfg.agents?.ownership === "explicit" && input.key === void 0 && input.agentId === void 0 ? parseAgentSessionKey(input.parentSessionKey?.trim())?.agentId : void 0;
	const agentId = input.agentId ?? parseAgentSessionKey(input.key)?.agentId ?? parentAgentId;
	return resolveRequestedSessionAgentId(cfg, input.key ?? (agentId === void 0 ? "main" : void 0), agentId);
}
//#endregion
export { resolveSessionCreateAgentId as a, resolveSessionSubscriptionKey as c, resolveRequestedSessionAgentInput as i, resolveSessionSubscriptionKeys as l, resolvePrivateSessionEventBroadcastScope as n, resolveSessionEventAgentScope as o, resolveRequestedSessionAgentId as r, tryResolveSessionCompatibilityOwnerAgentId as s, resolveChatSendSessionKey as t };
