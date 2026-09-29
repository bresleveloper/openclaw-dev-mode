import { M as resolveNonNegativeIntegerOption, j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Bv2XOvEF.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { S as isSubagentSpawnDepthAllowed } from "./validation-core-DwJVlxTe.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { a as loadExactSessionEntryReadOnly, o as loadSessionEntryByIdReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import "./sessions-DE4llkPV.mjs";
import { t as getSubagentDepthFromEntryLookup } from "./subagent-depth-policy-DzGhB4EH.mjs";
//#region src/agents/inherited-tool-deny.ts
/**
* Normalizes inherited tool allow/deny lists and ACP compatibility errors.
*/
const ACP_UNSUPPORTED_INHERITED_TOOL_DENY = [
	"apply_patch",
	"edit",
	"exec",
	"fs_delete",
	"fs_move",
	"fs_write",
	"process",
	"read",
	"shell",
	"spawn",
	"write"
];
const ACP_REQUIRED_INHERITED_TOOL_ALLOW = [
	"apply_patch",
	"edit",
	"exec",
	"process",
	"read",
	"write"
];
function normalizeInheritedToolDenylist(value) {
	if (!Array.isArray(value)) return [];
	return uniqueStrings(value.flatMap((entry) => {
		const normalized = typeof entry === "string" ? normalizeToolPolicyName(entry) : "";
		return normalized ? [normalized] : [];
	}));
}
function inheritedToolDenyPatch(value) {
	const inheritedToolDeny = normalizeInheritedToolDenylist(value);
	return inheritedToolDeny.length > 0 ? { inheritedToolDeny } : {};
}
function normalizeInheritedToolAllowlist(value) {
	return normalizeInheritedToolDenylist(value);
}
function inheritedToolAllowPatch(value) {
	const inheritedToolAllow = normalizeInheritedToolAllowlist(value);
	return inheritedToolAllow.length > 0 ? { inheritedToolAllow } : {};
}
function findAcpUnsupportedInheritedToolDeny(value) {
	const inheritedToolDeny = normalizeInheritedToolDenylist(value);
	if (inheritedToolDeny.length === 0) return;
	const matches = createToolPolicyMatcher({ deny: inheritedToolDeny });
	return ACP_UNSUPPORTED_INHERITED_TOOL_DENY.find((toolName) => !matches(toolName));
}
function findAcpUnsupportedInheritedToolAllow(value) {
	const inheritedToolAllow = normalizeInheritedToolAllowlist(value);
	if (inheritedToolAllow.length === 0) return;
	const matches = createToolPolicyMatcher({ allow: inheritedToolAllow });
	return ACP_REQUIRED_INHERITED_TOOL_ALLOW.find((toolName) => !matches(toolName));
}
function formatAcpInheritedToolDenyError(toolName) {
	return `runtime="acp" is unavailable because the requester denies ${toolName}. Use runtime="subagent".`;
}
function formatAcpInheritedToolAllowError(toolName) {
	return `runtime="acp" is unavailable because the requester does not allow ${toolName}. Use runtime="subagent".`;
}
//#endregion
//#region src/agents/subagents/spawn/subagent-session-store.ts
function isSessionCapabilityLookup(store) {
	return typeof store?.get === "function" && typeof store.getById === "function";
}
function asSessionCapabilityLookup(store) {
	if (isSessionCapabilityLookup(store)) return store;
	return {
		get: (key) => store[key],
		getById: (id) => {
			const normalizedId = normalizeOptionalString(id);
			return normalizedId ? Object.values(store).find((entry) => normalizeOptionalString(entry?.sessionId) === normalizedId) : void 0;
		}
	};
}
/** Lazily read metadata through the session owner, never a whole-store listing. */
function createSubagentSessionStore(storePath, agentId, prepared) {
	const entries = /* @__PURE__ */ new Map();
	const ids = /* @__PURE__ */ new Map();
	if (prepared && !isInternalSessionEffectsKey(prepared.sessionKey)) entries.set(prepared.sessionKey, prepared.entry);
	return {
		scope: {
			storePath,
			agentId
		},
		get: (sessionKey) => {
			if (!entries.has(sessionKey)) {
				let entry;
				try {
					if (!isInternalSessionEffectsKey(sessionKey)) entry = loadExactSessionEntryReadOnly({
						storePath,
						agentId,
						sessionKey,
						projection: "list"
					})?.entry;
				} catch {}
				entries.set(sessionKey, entry);
			}
			return entries.get(sessionKey);
		},
		getById: (sessionId) => {
			const id = normalizeOptionalString(sessionId);
			if (!id) return;
			if (!ids.has(id)) {
				let entry;
				try {
					const selected = loadSessionEntryByIdReadOnly({
						storePath,
						agentId,
						sessionId: id,
						projection: "list"
					});
					entry = selected?.entry;
					if (selected && !entries.has(selected.sessionKey)) entries.set(selected.sessionKey, selected.entry);
				} catch {}
				ids.set(id, entry);
			}
			return ids.get(id);
		}
	};
}
//#endregion
//#region src/agents/subagents/spawn/subagent-depth.ts
/**
* Subagent spawn-depth lookup helpers.
*
* Reads persisted session store state to recover spawn depth and parent lineage across restarts.
*/
function buildKeyCandidates(rawKey, cfg, explicitAgentId) {
	if (!cfg) return [rawKey];
	if (rawKey === "unknown") return [rawKey];
	if (parseAgentSessionKey(rawKey)) return [rawKey];
	const prefixed = `agent:${resolveSessionAgentId({
		sessionKey: rawKey,
		config: cfg,
		agentId: explicitAgentId
	})}:${rawKey}`;
	return prefixed === rawKey ? [rawKey] : [rawKey, prefixed];
}
function resolveEntryForSessionKey(params) {
	const candidates = buildKeyCandidates(params.sessionKey, params.cfg, params.agentId);
	if (params.store) {
		for (const key of candidates) {
			const entry = params.store.get(key);
			if (entry) return entry;
		}
		const entry = params.store.getById(params.sessionKey);
		if (entry || !params.cfg) return entry;
	}
	if (!params.cfg) return;
	const candidateAgentIds = new Set(candidates.flatMap((key) => {
		const agentId = parseAgentSessionKey(key)?.agentId;
		return agentId ? [agentId] : [];
	}));
	for (const agentId of candidateAgentIds) {
		const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
		const cacheKey = `${storePath}\0${normalizeAgentId(agentId)}`;
		let store = params.cache.get(cacheKey);
		if (!store) {
			store = createSubagentSessionStore(storePath, agentId);
			params.cache.set(cacheKey, store);
		}
		const entry = candidates.map((key) => store.get(key)).find((candidate) => candidate !== void 0) ?? store.getById(params.sessionKey);
		if (entry) return entry;
	}
}
function getSubagentDepthFromSessionStore(sessionKey, opts) {
	const cache = /* @__PURE__ */ new Map();
	const store = opts?.store ? asSessionCapabilityLookup(opts.store) : void 0;
	if (store?.scope) cache.set(`${store.scope.storePath}\0${normalizeAgentId(store.scope.agentId)}`, store);
	return getSubagentDepthFromEntryLookup(sessionKey, (key) => resolveEntryForSessionKey({
		sessionKey: key,
		cfg: opts?.cfg,
		store,
		cache,
		agentId: opts?.agentId
	}));
}
//#endregion
//#region src/agents/subagents/spawn/subagent-capabilities.ts
/**
* Subagent capability resolution.
* Combines session-key shape, stored envelopes, spawn depth, and inherited tool
* policy to decide role, control scope, and subagent permissions.
*/
const SUBAGENT_SESSION_ROLES = [
	"main",
	"orchestrator",
	"leaf"
];
const SUBAGENT_CONTROL_SCOPES = ["children", "none"];
function normalizeSubagentRole(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	return SUBAGENT_SESSION_ROLES.find((entry) => entry === trimmed);
}
function normalizeSubagentControlScope(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	return SUBAGENT_CONTROL_SCOPES.find((entry) => entry === trimmed);
}
function shouldInspectStoredSubagentEnvelope(sessionKey) {
	return isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
function isDashboardSessionKey(sessionKey) {
	return parseAgentSessionKey(sessionKey)?.rest.startsWith("dashboard:") === true;
}
function canInspectStoredSubagentEnvelope(sessionKey, store) {
	return shouldInspectStoredSubagentEnvelope(sessionKey) || Boolean(store) && isDashboardSessionKey(sessionKey);
}
function isSameAgentSessionStore(leftSessionKey, rightSessionKey) {
	const leftAgentId = normalizeOptionalLowercaseString(parseAgentSessionKey(leftSessionKey)?.agentId);
	const rightAgentId = normalizeOptionalLowercaseString(parseAgentSessionKey(rightSessionKey)?.agentId);
	return Boolean(leftAgentId) && leftAgentId === rightAgentId;
}
function resolveSessionCapabilityEntry(params) {
	if (params.store) {
		const store = asSessionCapabilityLookup(params.store);
		return store.get(params.sessionKey) ?? store.getById(params.sessionKey);
	}
	if (!params.cfg) return;
	const parsed = parseAgentSessionKey(params.sessionKey);
	if (!parsed?.agentId) return;
	const store = createSubagentSessionStore(resolveSessionStorePathCore(params.cfg.session?.store, { agentId: parsed.agentId }), parsed.agentId);
	return store.get(params.sessionKey) ?? store.getById(params.sessionKey);
}
/** Resolve the session-store subset used for subagent capability lookup. */
function resolveSubagentCapabilityStore(sessionKey, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	if (!normalizedSessionKey) return opts?.store;
	if (opts?.store) return opts.store;
	if (!opts?.cfg || !shouldInspectStoredSubagentEnvelope(normalizedSessionKey) && !isDashboardSessionKey(normalizedSessionKey)) return;
	const parsed = parseAgentSessionKey(normalizedSessionKey);
	if (!parsed?.agentId) return;
	return createSubagentSessionStore(resolveSessionStorePathCore(opts.cfg.session?.store, { agentId: parsed.agentId }), parsed.agentId, opts.preparedSessionEntry?.sessionKey === normalizedSessionKey ? opts.preparedSessionEntry : void 0);
}
/** Resolve depth-derived role/scope booleans for a subagent position. */
function resolveSubagentRoleForDepth(params) {
	const depth = resolveNonNegativeIntegerOption(params.depth, 0);
	const maxSpawnDepth = resolveIntegerOption(params.maxSpawnDepth, 5, { min: 1 });
	if (depth <= 0) return "main";
	return isSubagentSpawnDepthAllowed(depth, maxSpawnDepth) ? "orchestrator" : "leaf";
}
function resolveSubagentControlScopeForRole(role) {
	return role === "leaf" ? "none" : "children";
}
/** Resolve depth-derived role, scope, and spawn/control booleans. */
function resolveSubagentCapabilities(params) {
	const depth = resolveNonNegativeIntegerOption(params.depth, 0);
	const role = resolveSubagentRoleForDepth(params);
	const controlScope = resolveSubagentControlScopeForRole(role);
	return {
		depth,
		role,
		controlScope,
		canSpawn: role === "main" || role === "orchestrator",
		canControlChildren: controlScope === "children"
	};
}
function isStoredSubagentEnvelopeSession(params, visited = /* @__PURE__ */ new Set()) {
	const normalizedSessionKey = normalizeOptionalString(params.sessionKey);
	if (!normalizedSessionKey || visited.has(normalizedSessionKey)) return false;
	visited.add(normalizedSessionKey);
	if (isSubagentSessionKey(normalizedSessionKey)) return true;
	const dashboardSession = isDashboardSessionKey(normalizedSessionKey);
	if (!isAcpSessionKey(normalizedSessionKey) && !dashboardSession) return false;
	const entry = params.entry ?? resolveSessionCapabilityEntry({
		sessionKey: normalizedSessionKey,
		cfg: params.cfg,
		store: params.store
	});
	if (dashboardSession) return typeof entry?.spawnDepth === "number" && Number.isInteger(entry.spawnDepth) && entry.spawnDepth >= 1 && Boolean(normalizeOptionalString(entry.spawnedBy));
	if (normalizeSubagentRole(entry?.subagentRole) || normalizeSubagentControlScope(entry?.subagentControlScope)) return true;
	const spawnedBy = normalizeOptionalString(entry?.spawnedBy);
	if (!spawnedBy) return false;
	const parentStore = isSameAgentSessionStore(normalizedSessionKey, spawnedBy) ? params.store : void 0;
	return isStoredSubagentEnvelopeSession({
		sessionKey: spawnedBy,
		cfg: params.cfg,
		store: parentStore
	}, visited);
}
/** Return true when a session key or persisted ACP envelope represents a subagent. */
function isSubagentEnvelopeSession(sessionKey, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	if (!normalizedSessionKey) return false;
	if (isSubagentSessionKey(normalizedSessionKey)) return true;
	if (!isAcpSessionKey(normalizedSessionKey) && !isDashboardSessionKey(normalizedSessionKey)) return false;
	if (isDashboardSessionKey(normalizedSessionKey) && !opts?.entry && !opts?.store) return false;
	const store = resolveSubagentCapabilityStore(normalizedSessionKey, opts);
	return isStoredSubagentEnvelopeSession({
		sessionKey: normalizedSessionKey,
		cfg: opts?.cfg,
		store,
		entry: opts?.entry
	});
}
/**
* Resolve a persisted child envelope that is strong enough to carry authority.
* Session-key shape alone is useful for fail-closed subagent restrictions, but
* never sufficient to bypass requester-scoped policy re-resolution.
*/
function resolvePersistedSubagentToolPolicyEnvelope(sessionKey, opts) {
	const stored = resolveStoredSubagentToolPolicy(sessionKey, opts);
	if (!stored) return;
	const { sessionKey: normalizedSessionKey, store, entry } = stored;
	const spawnedBy = normalizeOptionalString(entry?.spawnedBy);
	const hasSpawnDepth = typeof entry?.spawnDepth === "number" && Number.isInteger(entry.spawnDepth) && entry.spawnDepth >= 1;
	const role = normalizeSubagentRole(entry?.subagentRole);
	const controlScope = normalizeSubagentControlScope(entry?.subagentControlScope);
	if (!entry || !spawnedBy || entry.inheritedToolPolicyVersion !== 1 || !isSubagentEnvelopeSession(normalizedSessionKey, {
		...opts,
		store,
		entry
	}) || !hasSpawnDepth && role === void 0 && controlScope === void 0) return;
	const completionOwnerSessionKey = normalizeOptionalString(entry.completionOwnerSessionKey);
	return {
		sessionKey: normalizedSessionKey,
		spawnedBy,
		...completionOwnerSessionKey ? { completionOwnerSessionKey } : {},
		inheritedToolAllow: normalizeInheritedToolAllowlist(entry.inheritedToolAllow),
		inheritedToolDeny: normalizeInheritedToolDenylist(entry.inheritedToolDeny)
	};
}
/**
* Resolve the effective subagent role/scope, combining stored envelope metadata
* with depth-derived fallback behavior.
*/
function resolveStoredSubagentCapabilities(sessionKey, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	const maxSpawnDepth = opts?.cfg?.agents?.defaults?.subagents?.maxSpawnDepth ?? 5;
	if (!normalizedSessionKey) return resolveSubagentCapabilities({
		depth: 0,
		maxSpawnDepth
	});
	if (!shouldInspectStoredSubagentEnvelope(normalizedSessionKey)) return resolveSubagentCapabilities({
		depth: getSubagentDepthFromSessionStore(normalizedSessionKey, {
			cfg: opts?.cfg,
			store: opts?.store,
			agentId: opts?.agentId
		}),
		maxSpawnDepth
	});
	const store = resolveSubagentCapabilityStore(normalizedSessionKey, opts);
	const entry = normalizedSessionKey ? resolveSessionCapabilityEntry({
		sessionKey: normalizedSessionKey,
		cfg: opts?.cfg,
		store
	}) : void 0;
	const depthStore = opts?.cfg && !isSessionCapabilityLookup(store) && typeof entry?.spawnDepth !== "number" ? void 0 : store;
	return resolveSubagentCapabilities({
		depth: getSubagentDepthFromSessionStore(normalizedSessionKey, {
			cfg: opts?.cfg,
			store: depthStore,
			agentId: opts?.agentId
		}),
		maxSpawnDepth
	});
}
function resolveStoredSubagentToolPolicy(sessionKey, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	if (!normalizedSessionKey || !canInspectStoredSubagentEnvelope(normalizedSessionKey, opts?.store)) return;
	const store = resolveSubagentCapabilityStore(normalizedSessionKey, opts);
	return {
		sessionKey: normalizedSessionKey,
		store,
		entry: resolveSessionCapabilityEntry({
			sessionKey: normalizedSessionKey,
			cfg: opts?.cfg,
			store
		})
	};
}
/** Resolve inherited tool deny rules stored on a subagent envelope. */
function resolveStoredSubagentInheritedToolDenylist(sessionKey, opts) {
	return normalizeInheritedToolDenylist(resolveStoredSubagentToolPolicy(sessionKey, opts)?.entry?.inheritedToolDeny);
}
/** Resolve inherited tool allow rules stored on a subagent envelope. */
function resolveStoredSubagentInheritedToolAllowlist(sessionKey, opts) {
	return normalizeInheritedToolAllowlist(resolveStoredSubagentToolPolicy(sessionKey, opts)?.entry?.inheritedToolAllow);
}
//#endregion
export { resolveStoredSubagentInheritedToolDenylist as a, getSubagentDepthFromSessionStore as c, formatAcpInheritedToolAllowError as d, formatAcpInheritedToolDenyError as f, normalizeInheritedToolDenylist as g, normalizeInheritedToolAllowlist as h, resolveStoredSubagentInheritedToolAllowlist as i, findAcpUnsupportedInheritedToolAllow as l, inheritedToolDenyPatch as m, resolvePersistedSubagentToolPolicyEnvelope as n, resolveSubagentCapabilities as o, inheritedToolAllowPatch as p, resolveStoredSubagentCapabilities as r, resolveSubagentCapabilityStore as s, isSubagentEnvelopeSession as t, findAcpUnsupportedInheritedToolDeny as u };
