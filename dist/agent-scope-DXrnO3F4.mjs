import { _ as resolvePrimaryStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { o as resolveCanonicalWorkspacePath } from "./workspace-state-identity-hZ7UINpz.mjs";
import { M as parseAgentSessionKey, o as classifySessionKeyShape, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { D as tryResolveLegacyDataOwnerAgentId, O as withAgentRosterFactsBatch, _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir, r as resolveAgentConfig, s as resolveAgentModelConfigForRuntime, t as AgentSelectionRequiredError, y as resolveMutableAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, t as hasAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-CeM8o97s.mjs";
import { i as resolveSessionAuthProfileOverrideSource, r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { n as hasSessionAutoModelFallbackProvenance } from "./model-override-provenance-ByJqxWxk.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import "./agent-filter-B-HgchuV.mjs";
//#region src/agents/agent-scope.ts
const AUTO_FALLBACK_PRIMARY_PROBE_INTERVAL_MS = 3e5;
const AUTO_FALLBACK_PRIMARY_PROBE_MAX_KEYS = 4096;
const autoFallbackPrimaryProbeState = /* @__PURE__ */ new Map();
function autoFallbackPrimaryProbeStateKey(params) {
	return [normalizeOptionalString(params.sessionKey) ?? "", `${params.primaryProvider}/${params.primaryModel}`].join("\0");
}
function pruneAutoFallbackPrimaryProbeState(params) {
	const maxKeys = Math.max(1, Math.trunc(params.maxKeys ?? AUTO_FALLBACK_PRIMARY_PROBE_MAX_KEYS));
	const staleBefore = params.now - params.minIntervalMs;
	for (const [key, lastProbeAt] of params.state) if (!Number.isFinite(lastProbeAt) || lastProbeAt < staleBefore) params.state.delete(key);
	pruneMapToMaxSize(params.state, maxKeys || 0);
}
/** Detects old auto-fallback session entries that lack primary-origin metadata. */
function hasLegacyAutoFallbackWithoutOrigin(entry) {
	return entry?.modelOverrideSource === "auto" && (!normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) || !normalizeOptionalString(entry.modelOverrideFallbackOriginModel));
}
function resolveAutoFallbackPrimaryProbe(params) {
	const entry = params.entry;
	if (!entry) return;
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return;
	const originProvider = normalizeOptionalString(entry.modelOverrideFallbackOriginProvider);
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	const overrideProvider = normalizeOptionalString(entry.providerOverride);
	const overrideModel = normalizeOptionalString(entry.modelOverride);
	const primaryProvider = normalizeOptionalString(params.primaryProvider);
	const primaryModel = normalizeOptionalString(params.primaryModel);
	if (!originProvider || !originModel || !overrideProvider || !overrideModel) return;
	if (!primaryProvider || !primaryModel) return;
	if (originProvider !== primaryProvider || originModel !== primaryModel) return;
	if (overrideProvider === originProvider && overrideModel === originModel) return;
	const now = params.now ?? Date.now();
	const minIntervalMs = params.minIntervalMs ?? AUTO_FALLBACK_PRIMARY_PROBE_INTERVAL_MS;
	const state = params.probeState ?? autoFallbackPrimaryProbeState;
	pruneAutoFallbackPrimaryProbeState({
		state,
		now,
		minIntervalMs,
		maxKeys: params.maxTrackedProbeKeys
	});
	const key = autoFallbackPrimaryProbeStateKey({
		sessionKey: params.sessionKey,
		primaryProvider: originProvider,
		primaryModel: originModel
	});
	const lastProbeAt = state.get(key);
	if (typeof lastProbeAt === "number" && Number.isFinite(lastProbeAt) && now - lastProbeAt < minIntervalMs) return;
	const fallbackAuthProfileId = normalizeOptionalString(entry.authProfileOverride);
	const fallbackAuthProfileIdSource = resolveCollapsedSessionAuthPinSource(entry);
	return {
		provider: originProvider,
		model: originModel,
		fallbackProvider: overrideProvider,
		fallbackModel: overrideModel,
		...fallbackAuthProfileId ? {
			fallbackAuthProfileId,
			...fallbackAuthProfileIdSource ? { fallbackAuthProfileIdSource } : {}
		} : {}
	};
}
function markAutoFallbackPrimaryProbe(params) {
	const now = params.now ?? Date.now();
	const minIntervalMs = params.minIntervalMs ?? AUTO_FALLBACK_PRIMARY_PROBE_INTERVAL_MS;
	const state = params.probeState ?? autoFallbackPrimaryProbeState;
	const key = autoFallbackPrimaryProbeStateKey({
		sessionKey: params.sessionKey,
		primaryProvider: params.probe.provider,
		primaryModel: params.probe.model
	});
	state.set(key, now);
	pruneAutoFallbackPrimaryProbeState({
		state,
		now,
		minIntervalMs,
		maxKeys: params.maxTrackedProbeKeys
	});
}
function entryMatchesAutoFallbackPrimaryProbe(entry, probe) {
	if (!entry) return false;
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
	return normalizeOptionalString(entry.providerOverride) === probe.fallbackProvider && normalizeOptionalString(entry.modelOverride) === probe.fallbackModel && normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) === probe.provider && normalizeOptionalString(entry.modelOverrideFallbackOriginModel) === probe.model;
}
function clearAutoFallbackPrimaryProbeSelection(entry, now = Date.now()) {
	delete entry.providerOverride;
	delete entry.modelOverride;
	delete entry.modelOverrideSource;
	delete entry.modelOverrideRouteResolution;
	delete entry.modelOverrideFallbackOriginProvider;
	delete entry.modelOverrideFallbackOriginModel;
	if (resolveSessionAuthProfileOverrideSource(entry) === "auto") {
		delete entry.authProfileOverride;
		delete entry.authProfileOverrideSource;
		delete entry.authProfileOverrideCompactionCount;
	}
	delete entry.fallbackNotice;
	entry.updatedAt = now;
}
const SESSION_AGENT_SELECTION_CONTEXT = {
	surface: "session agent resolution",
	hint: "Pass an agentId, an agent-scoped session key, or a prepared fallbackAgentId."
};
function resolveSelectedSessionAgentId(params) {
	if (classifySessionKeyShape(params.sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing default-agent resolution.");
	const explicit = params.agentId === void 0 ? null : normalizeAgentIdStrict(params.agentId);
	if (explicit && !explicit.ok) throw new Error("Invalid explicit agent id; refusing default-agent resolution.");
	const explicitAgentId = explicit?.value;
	const fallbackAgentIdRaw = normalizeLowercaseStringOrEmpty(params.fallbackAgentId);
	const fallbackAgentId = fallbackAgentIdRaw ? normalizeAgentId(fallbackAgentIdRaw) : null;
	const sessionKey = params.sessionKey?.trim();
	const parsed = parseAgentSessionKey(sessionKey);
	const sessionKeyAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : null;
	const cfg = params.config ?? {};
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey);
	if (sessionKeyAgentId && explicitAgentId && explicitAgentId !== sessionKeyAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: "session agent resolution",
		hint: `The agent-scoped session key belongs to "${sessionKeyAgentId}", not "${explicitAgentId}".`
	});
	const requestedUnscopedAgentId = explicitAgentId ?? fallbackAgentId;
	if (!sessionKeyAgentId && persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: "session agent resolution",
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	if (!sessionKeyAgentId && persistedStoreOwner.kind === "configured" && requestedUnscopedAgentId && requestedUnscopedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: "session agent resolution",
		hint: `The shared fixed-store row belongs to "${persistedStoreOwner.agentId}", not "${requestedUnscopedAgentId}".`
	});
	return sessionKeyAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? requestedUnscopedAgentId ?? void 0;
}
/** Strict session selection uses explicit context and legacy data ownership. */
function resolveSessionAgentIdsStrict(params) {
	const selectedAgentId = resolveSelectedSessionAgentId(params);
	const cfg = params.config ?? {};
	const compatibilityAgentId = tryResolveLegacyDataOwnerAgentId(cfg);
	const sessionAgentId = selectedAgentId ?? compatibilityAgentId ?? resolveDefaultAgentId(cfg, SESSION_AGENT_SELECTION_CONTEXT);
	return {
		defaultAgentId: compatibilityAgentId ?? sessionAgentId,
		sessionAgentId
	};
}
const resolveSessionAgentIds = resolveSessionAgentIdsStrict;
function resolveSessionAgentIdStrict(params) {
	const selectedAgentId = resolveSelectedSessionAgentId(params);
	const cfg = params.config ?? {};
	return selectedAgentId ?? tryResolveLegacyDataOwnerAgentId(cfg) ?? resolveDefaultAgentId(cfg, SESSION_AGENT_SELECTION_CONTEXT);
}
const resolveSessionAgentId = resolveSessionAgentIdStrict;
function resolveAgentExecutionContract(cfg, agentId) {
	const defaultContract = cfg?.agents?.defaults?.embeddedAgent?.executionContract;
	if (!cfg || !agentId) return defaultContract;
	return resolveAgentConfig(cfg, agentId)?.embeddedAgent?.executionContract ?? defaultContract;
}
function resolveAgentExplicitModelPrimary(cfg, agentId) {
	const raw = resolveAgentConfig(cfg, agentId)?.model;
	return resolvePrimaryStringValue(raw);
}
function resolveAgentEffectiveModelPrimary(cfg, agentId) {
	return resolveAgentExplicitModelPrimary(cfg, agentId) ?? resolvePrimaryStringValue(cfg.agents?.defaults?.model);
}
function updateAgentModelPrimary(existing, primary) {
	if (existing && typeof existing === "object" && !Array.isArray(existing)) return {
		...existing,
		primary
	};
	return primary;
}
function setAgentEffectiveModelPrimary(cfg, agentId, primary, options = {}) {
	const id = normalizeAgentId(agentId);
	const target = options.target ?? (options.forceAgent ? "agent" : void 0);
	if (target !== "defaults" && (target === "agent" || resolveAgentExplicitModelPrimary(cfg, id))) {
		const entry = resolveMutableAgentEntry(cfg, id);
		if (entry) {
			entry.model = updateAgentModelPrimary(entry.model, primary);
			return "agent";
		}
		if (target === "agent") {
			if (!hasAgentRosterProperty(cfg) && listAgentIds(cfg).includes(id)) {
				cfg.agents ??= {};
				cfg.agents.entries = { [id]: { model: updateAgentModelPrimary(void 0, primary) } };
				return "agent";
			}
			throw new Error(`Could not resolve configured agent "${id}".`);
		}
	}
	cfg.agents ??= {};
	cfg.agents.defaults ??= {};
	cfg.agents.defaults.model = updateAgentModelPrimary(cfg.agents.defaults.model, primary);
	return "defaults";
}
function resolveAgentModelFallbacksOverride(cfg, agentId) {
	return resolveSelectedModelFallbacksOverride(resolveAgentModelConfigForRuntime(resolveAgentConfig(cfg, agentId)));
}
function resolveSelectedModelFallbacksOverride(raw) {
	if (!raw) return;
	if (typeof raw === "string") return resolvePrimaryStringValue(raw) ? [] : void 0;
	if (!Object.hasOwn(raw, "fallbacks")) return Object.hasOwn(raw, "primary") && resolvePrimaryStringValue(raw) ? [] : void 0;
	return Array.isArray(raw.fallbacks) ? raw.fallbacks : void 0;
}
function resolveFirstModelFallbacksOverride(candidates) {
	for (const candidate of candidates) {
		const fallbackOverride = resolveSelectedModelFallbacksOverride(candidate);
		if (fallbackOverride !== void 0) return fallbackOverride;
	}
}
function resolveSubagentModelConfigSelectionResult(params) {
	const agentConfig = params.agentConfigOverride ?? (params.agentId ? resolveAgentConfig(params.cfg, params.agentId) : void 0);
	const agentModel = resolveAgentModelConfigForRuntime(agentConfig);
	const candidates = [
		[agentConfig?.subagents?.model, "subagent"],
		[params.cfg.agents?.defaults?.subagents?.model, "default-subagent"],
		[agentModel, "agent"]
	];
	for (const [raw, source] of candidates) if (raw && resolvePrimaryStringValue(raw)) return {
		raw,
		source
	};
}
function resolveSubagentModelFallbacksOverride(cfg, agentId) {
	const subagentFallbacks = resolveSelectedModelFallbacksOverride(resolveAgentConfig(cfg, agentId)?.subagents?.model);
	if (subagentFallbacks !== void 0) return subagentFallbacks;
	const selection = resolveSubagentModelConfigSelectionResult({
		cfg,
		agentId
	});
	if (selection?.source === "agent" || selection?.source === "default-subagent") return resolveSelectedModelFallbacksOverride(selection.raw);
}
function resolveSubagentSpawnModelFallbacksOverride(cfg, agentId) {
	const agentConfig = resolveAgentConfig(cfg, agentId);
	return resolveFirstModelFallbacksOverride([
		agentConfig?.subagents?.model,
		cfg.agents?.defaults?.subagents?.model,
		resolveAgentModelConfigForRuntime(agentConfig)
	]);
}
function resolveRunModelFallbacksOverride(params) {
	if (!params.cfg) return;
	const explicitAgentId = normalizeOptionalString(params.agentId);
	const agentId = explicitAgentId ? normalizeAgentId(explicitAgentId) : listAgentIds(params.cfg).length > 0 ? resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: params.sessionKey ?? void 0
	}).sessionAgentId : void 0;
	return agentId ? resolveAgentModelFallbacksOverride(params.cfg, agentId) : void 0;
}
function modelFallbackAvailabilityFromModels(models, source) {
	return models.length > 0 ? {
		kind: "active",
		models,
		source
	} : {
		kind: "none_configured",
		source
	};
}
/**
* Projects availability onto the candidate-resolver override contract. Inherited
* availability must project to `undefined`: the resolver then owns the ladder — it
* re-derives the same configured fallbacks and appends the configured primary as the
* final candidate (see model-fallback-candidates.ts). Collapsing inherited state into
* an explicit list silently drops that last hop.
*/
function modelFallbackOverrideFromAvailability(availability) {
	switch (availability.kind) {
		case "active": return availability.source === "inherited" ? void 0 : availability.models;
		case "none_configured": return availability.source === "inherited" ? void 0 : [];
		default: return [];
	}
}
/**
* Resolves fallback availability once for the run scope. A pinned model override disables the
* configured ladder; splitting that fact from its models would report fallbacks that cannot run.
*/
function resolveModelFallbackAvailability(params) {
	if (params.modelSelectionLocked) return { kind: "disabled_by_model_selection_lock" };
	if (params.modelFallbacksOverride !== void 0) return modelFallbackAvailabilityFromModels(params.modelFallbacksOverride, "explicit");
	const canUseConfiguredFallbacks = params.modelOverrideSource === "auto" || params.modelOverrideSource === void 0 && params.hasAutoFallbackProvenance === true;
	if (params.hasSessionModelOverride && !canUseConfiguredFallbacks) return { kind: "disabled_by_model_override" };
	const hiddenSubagent = isSubagentSessionKey(params.sessionKey);
	const fallbacksOverride = (params.hasSessionModelOverride ? hiddenSubagent || params.subagentSpawnLineage === true : !hiddenSubagent && params.subagentSpawnLineage === true && params.modelOverrideSource !== "user") ? resolveSubagentSpawnModelFallbacksOverride(params.cfg, params.agentId) : resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
	const source = fallbacksOverride !== void 0 || params.hasSessionModelOverride ? "explicit" : "inherited";
	return modelFallbackAvailabilityFromModels(fallbacksOverride ?? resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model), source);
}
function resolveEffectiveModelFallbacks(params) {
	return modelFallbackOverrideFromAvailability(resolveModelFallbackAvailability(params));
}
function resolveAgentIdByWorkspacePath(cfg, workspacePath) {
	const normalizedWorkspacePath = resolveCanonicalWorkspacePath(workspacePath.replaceAll("\0", ""));
	return withAgentRosterFactsBatch(cfg, () => {
		let matchedAgentId;
		let matchedWorkspaceLength = -1;
		for (const id of listAgentIds(cfg)) {
			const workspaceDir = resolveCanonicalWorkspacePath(resolveAgentWorkspaceDir(cfg, id));
			if (!isPathInside(workspaceDir, normalizedWorkspacePath)) continue;
			if (workspaceDir.length > matchedWorkspaceLength) {
				matchedAgentId = id;
				matchedWorkspaceLength = workspaceDir.length;
			}
		}
		return matchedAgentId;
	});
}
//#endregion
export { setAgentEffectiveModelPrimary as S, resolveSessionAgentIds as _, modelFallbackOverrideFromAvailability as a, resolveSubagentModelFallbacksOverride as b, resolveAgentExplicitModelPrimary as c, resolveAutoFallbackPrimaryProbe as d, resolveEffectiveModelFallbacks as f, resolveSessionAgentIdStrict as g, resolveSessionAgentId as h, markAutoFallbackPrimaryProbe as i, resolveAgentIdByWorkspacePath as l, resolveRunModelFallbacksOverride as m, entryMatchesAutoFallbackPrimaryProbe as n, resolveAgentEffectiveModelPrimary as o, resolveModelFallbackAvailability as p, hasLegacyAutoFallbackWithoutOrigin as r, resolveAgentExecutionContract as s, clearAutoFallbackPrimaryProbeSelection as t, resolveAgentModelFallbacksOverride as u, resolveSessionAgentIdsStrict as v, resolveSubagentSpawnModelFallbacksOverride as x, resolveSubagentModelConfigSelectionResult as y };
