import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { M as tryResolveSoleAgentId, O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, o as classifySessionKeyShape } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
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
function admitRequestedAgent(agentId) {
	const refusal = readAgentDatabaseAdmissionRefusal(agentId);
	return refusal ? {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `${refusal.reason}\n${refusal.repairHint}`, { details: refusal })
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
	if (classifySessionKeyShape(key) === "malformed_agent") return err(errorShape(ErrorCodes.INVALID_REQUEST, `malformed session key "${key}"`));
	const agent = explicitAgentId === void 0 ? null : normalizeAgentIdStrict(explicitAgentId);
	return agent && !agent.ok ? err(errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)) : ok(agent?.value);
}
function resolveRequestedSessionAgentId(cfg, key, explicitAgentId) {
	const input = resolveRequestedSessionAgentInput(key, explicitAgentId);
	if (!input.ok) return input;
	const parsed = parseAgentSessionKey(key?.trim());
	const configuredAgentIds = listAgentIds(cfg);
	const normalizedRequestedAgentId = input.value;
	if (normalizedRequestedAgentId && !configuredAgentIds.includes(normalizedRequestedAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)
	};
	let ownerKey = key;
	if (parsed?.agentId) {
		const keyAgentId = normalizeAgentId(parsed.agentId);
		const keyIsGlobalMainAlias = cfg.session?.scope === "global" && (parsed.rest === "main" || parsed.rest === normalizeMainKey(cfg.session?.mainKey));
		if (keyIsGlobalMainAlias && !configuredAgentIds.includes(keyAgentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${parsed.agentId}"`)
		};
		if (normalizedRequestedAgentId && keyAgentId !== normalizedRequestedAgentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `agent "${explicitAgentId}" does not match session key agent "${keyAgentId}"`)
		};
		if (!keyIsGlobalMainAlias || !normalizedRequestedAgentId) return admitRequestedAgent(keyAgentId);
		ownerKey = "global";
	}
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, ownerKey);
	if (persistedStoreOwner.kind === "retired") return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `session key belongs to retired agent "${persistedStoreOwner.agentId}"`)
	};
	if (normalizedRequestedAgentId) {
		if (persistedStoreOwner.kind === "configured" && persistedStoreOwner.agentId !== normalizedRequestedAgentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `agent "${explicitAgentId}" does not match session key agent "${persistedStoreOwner.agentId}"`)
		};
		return admitRequestedAgent(normalizedRequestedAgentId);
	}
	const inferredAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	if (inferredAgentId) return admitRequestedAgent(inferredAgentId);
	const selectionError = new AgentSelectionRequiredError(configuredAgentIds, {
		surface: `session key "${key}"`,
		hint: "Pass agentId or use an agent-prefixed session key."
	});
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, selectionError.message)
	};
}
//#endregion
export { tryResolveSessionCompatibilityOwnerAgentId as a, resolveSessionEventAgentScope as i, resolveRequestedSessionAgentId as n, resolveSessionSubscriptionKey as o, resolveRequestedSessionAgentInput as r, resolveSessionSubscriptionKeys as s, resolvePrivateSessionEventBroadcastScope as t };
