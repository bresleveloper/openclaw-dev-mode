import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption, j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match--5jlhAPZ.mjs";
import { c as hasRestrictiveAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import { t as isSubagentSpawnDepthAllowed } from "./agent-limits-CB2bq0ey.mjs";
import { F as isSessionCapabilityLookup, M as asSessionCapabilityLookup, P as createSubagentSessionStore, R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as getSubagentDepthFromEntryLookup } from "./subagent-depth-policy-eTFubFiU.mjs";
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
//#region src/agents/subagents/spawn/subagent-target-policy.ts
/**
* Subagent spawn target policy. Requesters can self-spawn by default, or opt
* into a configured allowlist that is still intersected with known agents.
*/
function normalizeAllowAgents(allowAgents) {
	if (!Array.isArray(allowAgents)) return;
	return new Set(allowAgents.map((value) => value.trim()).filter(Boolean).map((value) => value === "*" ? value : normalizeAgentId(value)));
}
/** Resolve the normalized agent IDs a requester may target with sessions_spawn. */
function resolveSubagentAllowedTargetIds(params) {
	const requesterAgentId = normalizeAgentId(params.requesterAgentId);
	const policy = normalizeAllowAgents(params.allowAgents);
	if (!policy) return {
		allowAny: false,
		allowedIds: [requesterAgentId]
	};
	const configuredIds = new Set((params.configuredAgentIds ?? []).map(normalizeAgentId));
	if (policy.has("*")) {
		configuredIds.add(requesterAgentId);
		return {
			allowAny: true,
			allowedIds: [...configuredIds].toSorted()
		};
	}
	return {
		allowAny: false,
		allowedIds: [...policy].filter((id) => configuredIds.has(id)).toSorted((a, b) => a.localeCompare(b))
	};
}
/** Validate one requested target against subagent spawn policy. */
function resolveSubagentTargetPolicy(params) {
	const requesterAgentId = normalizeAgentId(params.requesterAgentId);
	const targetAgentId = normalizeAgentId(params.targetAgentId);
	if (!params.requestedAgentId?.trim() && targetAgentId === requesterAgentId) return { ok: true };
	const allowed = resolveSubagentAllowedTargetIds({
		requesterAgentId,
		allowAgents: params.allowAgents,
		configuredAgentIds: params.configuredAgentIds
	});
	if (allowed.allowedIds.includes(targetAgentId)) return { ok: true };
	const allowedText = allowed.allowedIds.length > 0 ? allowed.allowedIds.join(", ") : "none";
	const policy = normalizeAllowAgents(params.allowAgents);
	return {
		ok: false,
		allowedText,
		error: allowed.allowAny || policy?.has(targetAgentId) ? `agentId "${targetAgentId}" is not in the configured agent registry (allowed: ${allowedText})` : `agentId is not allowed for sessions_spawn (allowed: ${allowedText})`
	};
}
//#endregion
//#region src/agents/delegated-tool-policy.ts
function hasCurrentDelegationGrant(config, requesterSessionKey, targetAgentId) {
	const requesterAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
	if (!requesterAgentId || requesterAgentId === targetAgentId) return false;
	const requester = resolveAgentConfig(config, requesterAgentId)?.subagents;
	if (!requester?.delegateToolsTo?.includes(targetAgentId)) return false;
	return resolveSubagentTargetPolicy({
		requesterAgentId,
		targetAgentId,
		requestedAgentId: targetAgentId,
		allowAgents: requester.allowAgents ?? config.agents?.defaults?.subagents?.allowAgents,
		configuredAgentIds: listAgentIds(config)
	}).ok;
}
/** The creation owner composes this with its existing synchronous pre-commit assertion. */
function captureDelegatedToolPolicyAssertion(config, policy, readConfig = createRuntimeConfigReader(config)) {
	if (!policy) return;
	return () => {
		if (!hasCurrentDelegationGrant(readConfig(), policy.requesterSessionKey, policy.targetAgentId)) throw new Error("Delegated tool target authorization changed.");
	};
}
/** Only trusted native spawn callers receive the separately prepared deny floor. */
function selectDelegatedToolPolicy(params) {
	const continuation = params.floor?.continuation;
	const requesterSessionKey = continuation?.requesterSessionKey ?? params.requesterSessionKey;
	if (params.inheritedToolPolicySource === "sender" || continuation && (params.requesterAgentId !== continuation.targetAgentId || params.targetAgentId !== continuation.targetAgentId) || !hasCurrentDelegationGrant(params.config, requesterSessionKey, params.targetAgentId)) return;
	if (!params.floor || !continuation && hasRestrictiveAllowPolicy({ allow: [...params.inheritedToolAllowlist ?? []] })) throw new Error("Delegated tool target requires a host-prepared deny-only policy. Restrictive profiles, allowlists, and this transport’s unavailable delegation projection cannot be widened; use a deny-only native requester or remove delegateToolsTo for ordinary capped helpers.");
	if (params.floor.policyAgentId !== params.requesterAgentId) throw new Error("Delegated tool policy owner differs from the executing requester; borrowed restrictions cannot be waived.");
	return {
		requesterSessionKey,
		targetAgentId: params.targetAgentId,
		deny: [...params.floor.deny],
		requesterDeny: normalizeInheritedToolDenylist(params.requesterToolDenylist)
	};
}
/** Select and bind one native handoff before either spawn adapter awaits preparation. */
function prepareNativeDelegatedToolPolicy(params) {
	const context = params.context;
	const policy = selectDelegatedToolPolicy({
		...params,
		floor: context?.delegatedToolDenyFloor,
		requesterToolDenylist: context?.requesterToolDenylist ?? context?.inheritedToolDenylist,
		inheritedToolAllowlist: context?.inheritedToolAllowlist,
		inheritedToolPolicySource: context?.inheritedToolPolicySource
	});
	return {
		policy,
		assertCurrent: captureDelegatedToolPolicyAssertion(params.config, policy, context?.readDelegationConfig)
	};
}
/** Malformed/legacy facts never manufacture an exception to the ordinary snapshot. */
function readDelegatedToolPolicy(value) {
	if (!isRecord(value) || typeof value.requesterSessionKey !== "string" || !parseAgentSessionKey(value.requesterSessionKey) || typeof value.targetAgentId !== "string" || !Array.isArray(value.deny) || value.deny.some((entry) => typeof entry !== "string") || !Array.isArray(value.requesterDeny) || value.requesterDeny.some((entry) => typeof entry !== "string") || Object.keys(value).some((key) => ![
		"requesterSessionKey",
		"targetAgentId",
		"deny",
		"requesterDeny"
	].includes(key))) return;
	return {
		requesterSessionKey: value.requesterSessionKey,
		targetAgentId: value.targetAgentId,
		deny: normalizeInheritedToolDenylist(value.deny),
		requesterDeny: normalizeInheritedToolDenylist(value.requesterDeny)
	};
}
/** Lineage is verified by the envelope owner; current config still owns the exception. */
function resolveDelegatedExecutionToolPolicy(params) {
	const floor = params.delegatedToolPolicy;
	const child = parseAgentSessionKey(params.sessionKey);
	if (!params.config || !floor || params.inheritedToolPolicySource === "sender" || !child || !(child.rest.startsWith("subagent:") || child.rest.startsWith("dashboard:")) || child.agentId !== floor.targetAgentId || !hasCurrentDelegationGrant(params.config, floor.requesterSessionKey, floor.targetAgentId)) return;
	return {
		...params.inheritedToolAllow.length ? { allow: [...params.inheritedToolAllow] } : {},
		deny: [...floor.deny]
	};
}
//#endregion
//#region src/agents/subagents/spawn/subagent-depth.ts
function buildKeyCandidates(rawKey, cfg, explicitAgentId) {
	if (!cfg || rawKey === "unknown" || parseAgentSessionKey(rawKey)) return [rawKey];
	return [rawKey, `agent:${resolveSessionAgentId({
		sessionKey: rawKey,
		config: cfg,
		agentId: explicitAgentId
	})}:${rawKey}`];
}
function resolveEntryForSessionKey(params) {
	const candidates = buildKeyCandidates(params.sessionKey, params.cfg, params.agentId);
	if (params.store) {
		for (const key of candidates) {
			const entry = params.store.get(key);
			if (entry) return entry;
		}
		const entry = params.store.getById(params.sessionKey);
		if (entry || !params.cfg || params.store.authoritative) return entry;
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
function getSubagentDepthFromSessionStoreInWorker(...args) {
	return withPreparedSessionCapabilityRead(() => getSubagentDepthFromSessionStore(...args));
}
//#endregion
//#region src/agents/subagents/spawn/subagent-capabilities.ts
function normalizeSubagentRole(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	return trimmed === "main" || trimmed === "orchestrator" || trimmed === "leaf" ? trimmed : void 0;
}
function normalizeSubagentControlScope(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	return trimmed === "children" || trimmed === "none" ? trimmed : void 0;
}
function shouldInspectStoredSubagentEnvelope(sessionKey) {
	return isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
function isDashboardSessionKey(sessionKey) {
	return parseAgentSessionKey(sessionKey)?.rest.startsWith("dashboard:") === true;
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
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: parsed.agentId });
	const store = createSubagentSessionStore(storePath, parsed.agentId);
	return store.get(params.sessionKey) ?? store.getById(params.sessionKey);
}
function resolveSubagentCapabilityStore(sessionKey, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	if (!normalizedSessionKey || opts?.store) return opts?.store;
	if (!opts?.cfg || !shouldInspectStoredSubagentEnvelope(normalizedSessionKey) && !isDashboardSessionKey(normalizedSessionKey)) return;
	const parsed = parseAgentSessionKey(normalizedSessionKey);
	if (!parsed?.agentId) return;
	const storePath = resolveSessionStorePathCore(opts.cfg.session?.store, { agentId: parsed.agentId });
	return createSubagentSessionStore(storePath, parsed.agentId, opts.preparedSessionEntry?.sessionKey === normalizedSessionKey ? opts.preparedSessionEntry : void 0);
}
function resolveSubagentCapabilities(params) {
	const depth = resolveNonNegativeIntegerOption(params.depth, 0);
	const maxSpawnDepth = resolveIntegerOption(params.maxSpawnDepth, 5, { min: 1 });
	const role = depth <= 0 ? "main" : isSubagentSpawnDepthAllowed(depth, maxSpawnDepth) ? "orchestrator" : "leaf";
	const controlScope = role === "leaf" ? "none" : "children";
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
	const parentStore = isSameAgentSessionStore(normalizedSessionKey, spawnedBy) || isSessionCapabilityLookup(params.store) && params.store.authoritative ? params.store : void 0;
	return isStoredSubagentEnvelopeSession({
		sessionKey: spawnedBy,
		cfg: params.cfg,
		store: parentStore
	}, visited);
}
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
function resolvePersistedSubagentToolPolicyEnvelope(sessionKey, opts, visited = /* @__PURE__ */ new Set()) {
	const stored = resolveStoredSubagentToolPolicy(sessionKey, opts);
	if (!stored) return;
	const { sessionKey: normalizedSessionKey, store, entry } = stored;
	if (visited.has(normalizedSessionKey) || visited.size >= 32) return;
	visited.add(normalizedSessionKey);
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
	let delegatedToolPolicy = readDelegatedToolPolicy(entry.delegatedToolPolicy);
	if (delegatedToolPolicy) {
		const targetAgentId = delegatedToolPolicy.targetAgentId;
		const direct = spawnedBy === delegatedToolPolicy.requesterSessionKey;
		const parent = !direct && isSameAgentSessionStore(normalizedSessionKey, spawnedBy) ? resolvePersistedSubagentToolPolicyEnvelope(spawnedBy, {
			...opts,
			store
		}, visited) : void 0;
		if (parseAgentSessionKey(normalizedSessionKey)?.agentId !== targetAgentId || !direct && (parent?.delegatedToolPolicy?.requesterSessionKey !== delegatedToolPolicy.requesterSessionKey || parent?.delegatedToolPolicy?.targetAgentId !== targetAgentId)) delegatedToolPolicy = void 0;
	}
	return {
		sessionKey: normalizedSessionKey,
		spawnedBy,
		...completionOwnerSessionKey ? { completionOwnerSessionKey } : {},
		inheritedToolAllow: normalizeInheritedToolAllowlist(entry.inheritedToolAllow),
		inheritedToolDeny: normalizeInheritedToolDenylist(entry.inheritedToolDeny),
		delegatedToolPolicy,
		...entry.inheritedToolPolicySource === "sender" ? { inheritedToolPolicySource: "sender" } : {}
	};
}
function resolveStoredSubagentCapabilities(sessionKey, opts) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	const maxSpawnDepth = opts?.cfg?.agents?.defaults?.subagents?.maxSpawnDepth ?? 5;
	if (!normalizedSessionKey) return resolveSubagentCapabilities({
		depth: 0,
		maxSpawnDepth
	});
	let depthStore = opts?.store;
	if (shouldInspectStoredSubagentEnvelope(normalizedSessionKey)) {
		depthStore = resolveSubagentCapabilityStore(normalizedSessionKey, opts);
		const entry = resolveSessionCapabilityEntry({
			sessionKey: normalizedSessionKey,
			cfg: opts?.cfg,
			store: depthStore
		});
		if (opts?.cfg && !isSessionCapabilityLookup(depthStore) && typeof entry?.spawnDepth !== "number") depthStore = void 0;
	}
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
	if (!normalizedSessionKey || !shouldInspectStoredSubagentEnvelope(normalizedSessionKey) && !(opts?.store && isDashboardSessionKey(normalizedSessionKey))) return;
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
function resolveStoredSubagentInheritedToolDenylist(sessionKey, opts) {
	return normalizeInheritedToolDenylist(resolveStoredSubagentToolPolicy(sessionKey, opts)?.entry?.inheritedToolDeny);
}
function resolveStoredSubagentInheritedToolAllowlist(sessionKey, opts) {
	return normalizeInheritedToolAllowlist(resolveStoredSubagentToolPolicy(sessionKey, opts)?.entry?.inheritedToolAllow);
}
//#endregion
export { normalizeInheritedToolDenylist as C, normalizeInheritedToolAllowlist as S, findAcpUnsupportedInheritedToolDeny as _, resolveStoredSubagentInheritedToolDenylist as a, inheritedToolAllowPatch as b, getSubagentDepthFromSessionStore as c, prepareNativeDelegatedToolPolicy as d, resolveDelegatedExecutionToolPolicy as f, findAcpUnsupportedInheritedToolAllow as g, resolveSubagentTargetPolicy as h, resolveStoredSubagentInheritedToolAllowlist as i, getSubagentDepthFromSessionStoreInWorker as l, resolveSubagentAllowedTargetIds as m, resolvePersistedSubagentToolPolicyEnvelope as n, resolveSubagentCapabilities as o, selectDelegatedToolPolicy as p, resolveStoredSubagentCapabilities as r, resolveSubagentCapabilityStore as s, isSubagentEnvelopeSession as t, captureDelegatedToolPolicyAssertion as u, formatAcpInheritedToolAllowError as v, inheritedToolDenyPatch as x, formatAcpInheritedToolDenyError as y };
