import { _ as resolvePrimaryStringValue, g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.mjs";
import { a as readAgentRosterProperty, c as tryResolveRawLegacyDefaultAgentId, i as listAgentIds, l as tryResolveSoleAgentId, r as listAgentEntriesWithSource, s as tryResolveLegacyDataOwner, t as hasAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import "./workspace-default-BKv26wgx.mjs";
import path from "node:path";
//#region src/config/model-policy-ref.ts
const MODEL_POLICY_COMPAT_SELECTORS = /* @__PURE__ */ new Set(["openrouter:auto", "openrouter:free"]);
function hasValidSegments(segments, minimumLength) {
	return segments.length >= minimumLength && segments.every((segment) => segment.length > 0 && !segment.includes("*") && !/\s/u.test(segment) && !containsAsciiControlCharacter(segment));
}
/** Parse and canonicalize a segment-boundary model-policy prefix wildcard. */
function parseModelPolicyWildcardRef(raw) {
	const segments = raw.trim().split("/").map((segment) => segment.trim());
	if (segments.at(-1) !== "*" || !hasValidSegments(segments.slice(0, -1), 1)) return null;
	const provider = normalizeProviderId(segments[0] ?? "");
	if (!provider) return null;
	return {
		key: [provider, ...segments.slice(1)].join("/"),
		provider
	};
}
/** Role-only model prefixes do not widen the segment grammar used by agent/UI policies. */
function parseOperatorModelPolicyWildcardRef(raw) {
	const wildcard = parseModelPolicyWildcardRef(raw);
	if (wildcard) return wildcard;
	const trimmed = raw.trim();
	const literal = trimmed.slice(0, -1);
	if (!trimmed.endsWith("*") || !literal.includes("/") || /\s$/u.test(literal)) return null;
	const prefix = parseModelPolicyWildcardRef(`${literal}/*`);
	return prefix ? {
		...prefix,
		key: `${prefix.key.slice(0, -2)}*`
	} : null;
}
/** True for a syntactically valid exact provider/model policy reference. */
function isValidExactModelPolicyRef(raw) {
	const parsed = parseModelCatalogRef(raw);
	return Boolean(parsed && hasValidSegments([parsed.provider, ...parsed.modelId.split("/")], 2));
}
/** Share policy grammar and owner-scoped aliases between validation and migration. */
function createModelPolicyRefValidator(...modelMaps) {
	const aliases = new Set(modelMaps.flatMap((models) => Object.values(models ?? {}).map((entry) => normalizeLowercaseStringOrEmpty(entry?.alias))).filter(Boolean));
	return (raw) => {
		const trimmed = raw.trim();
		return Boolean(aliases.has(normalizeLowercaseStringOrEmpty(trimmed)) || MODEL_POLICY_COMPAT_SELECTORS.has(normalizeLowercaseStringOrEmpty(trimmed)) || isValidExactModelPolicyRef(trimmed) || parseModelPolicyWildcardRef(trimmed));
	};
}
//#endregion
//#region src/config/model-policy-allowlist-migration.ts
function hasModelPolicyAllowlistMigrationMarker(value) {
	return isRecord(value) && isRecord(value.meta) && isRecord(value.meta.migrations) && value.meta.migrations.modelPolicyAllowlist === true;
}
/** A per-agent policy replaces inherited defaults only when it owns `allow`. */
function hasExplicitModelPolicyAllow(value) {
	return isRecord(value) && Object.hasOwn(value, "allow");
}
function computeModelPolicyAllowlist(params) {
	if (hasModelPolicyAllowlistMigrationMarker(params.root)) return null;
	return collectLegacyDefaultModelAllowRefs(params.defaults);
}
function collectLegacyDefaultModelAllowRefs(defaults) {
	if (!isRecord(defaults)) return null;
	if (isRecord(defaults.modelPolicy)) return null;
	if (!isRecord(defaults.models)) return null;
	const refs = Object.keys(defaults.models).filter((key) => key.trim().length > 0);
	return refs.length > 0 ? refs : null;
}
/** Materialize a whole legacy restriction, or retain its shipped dynamic-map semantics. */
function materializeModelPolicyAllowlist(cfg, previousConfig = cfg) {
	const previousAgents = isRecord(previousConfig) ? previousConfig.agents : void 0;
	const allow = isRecord(cfg.agents?.defaults?.modelPolicy) ? null : computeModelPolicyAllowlist({
		root: previousConfig,
		defaults: isRecord(previousAgents) ? previousAgents.defaults : void 0
	});
	if (allow && !allow.every(createModelPolicyRefValidator(cfg.agents?.defaults?.models))) {
		const migrations = { ...cfg.meta?.migrations };
		delete migrations.modelPolicyAllowlist;
		return {
			kind: "deferred",
			config: hasModelPolicyAllowlistMigrationMarker(cfg) ? {
				...cfg,
				meta: {
					...cfg.meta,
					migrations
				}
			} : cfg
		};
	}
	return {
		kind: "complete",
		config: {
			...cfg,
			...allow ? { agents: {
				...cfg.agents,
				defaults: {
					...cfg.agents?.defaults,
					modelPolicy: { allow }
				}
			} } : {},
			meta: {
				...cfg.meta,
				migrations: {
					...cfg.meta?.migrations,
					modelPolicyAllowlist: true
				}
			}
		}
	};
}
/** Keep model-policy intent self-contained when only an included file can be written. */
function projectIncludeModelPolicyWrite(params) {
	const previous = params.previousConfig;
	if (hasModelPolicyAllowlistMigrationMarker(previous)) return params.config;
	let config = params.config;
	const defaults = config.agents?.defaults;
	if (isRecord(config.agents) && (defaults === void 0 || isRecord(defaults)) && defaults?.modelPolicy === void 0 && isRecord(previous.agents?.defaults?.modelPolicy)) config = {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...defaults,
				modelPolicy: {}
			}
		}
	};
	const markerPath = [
		"meta",
		"migrations",
		"modelPolicyAllowlist"
	];
	if (params.explicitSetPaths?.some((segments) => segments.length <= markerPath.length && segments.every((part, i) => part === markerPath[i])) || !hasModelPolicyAllowlistMigrationMarker(config) || !isRecord(config.agents?.defaults?.modelPolicy)) return config;
	const { modelPolicyAllowlist: _marker, ...migrations } = config.meta?.migrations ?? {};
	const { migrations: _migrations, ...meta } = config.meta ?? {};
	const retainedMeta = Object.keys(migrations).length > 0 || previous.meta?.migrations ? {
		...meta,
		migrations
	} : meta;
	const { meta: _meta, ...rest } = config;
	return Object.keys(retainedMeta).length > 0 || previous.meta ? {
		...rest,
		meta: retainedMeta
	} : rest;
}
//#endregion
//#region src/agents/agent-dir-registry.ts
/** Process-local reverse registry from prepared agent directories to agent ids. */
const agentIdsByDir = /* @__PURE__ */ new Map();
function normalizeAgentDirRegistryPath(agentDir, env = process.env) {
	return resolveIdentityPathViaExistingAncestorSync(resolveUserPath(agentDir, env));
}
/** Register a resolved agent directory for later reverse lookup. */
function registerResolvedAgentDir(params) {
	const key = normalizeAgentDirRegistryPath(params.agentDir, params.env);
	const agentIds = agentIdsByDir.get(key) ?? /* @__PURE__ */ new Set();
	const agentId = normalizeAgentId(params.agentId);
	if (agentIds.has(agentId)) return false;
	agentIds.add(agentId);
	agentIdsByDir.set(key, agentIds);
	return true;
}
/** Remove a reverse lookup only while it still belongs to the expected agent. */
function unregisterResolvedAgentDir(params) {
	const key = normalizeAgentDirRegistryPath(params.agentDir, params.env);
	const agentIds = agentIdsByDir.get(key);
	if (!agentIds?.delete(normalizeAgentId(params.agentId))) return false;
	if (agentIds.size === 0) agentIdsByDir.delete(key);
	return true;
}
/** Resolve the agent id previously registered for an agent directory. */
function resolveRegisteredAgentIdForDir(agentDir, env) {
	const agentIds = agentIdsByDir.get(normalizeAgentDirRegistryPath(agentDir, env));
	return agentIds?.size === 1 ? agentIds.values().next().value : void 0;
}
/** Whether a path overlaps a directory currently owned by another agent. */
function isPathOwnedByAnotherRegisteredAgent(params) {
	const pathname = normalizeAgentDirRegistryPath(params.pathname, params.env);
	const agentId = normalizeAgentId(params.agentId);
	for (const [registeredDir, ownerIds] of agentIdsByDir) if ([...ownerIds].some((ownerId) => ownerId !== agentId) && (registeredDir === pathname || isPathInside(registeredDir, pathname) || isPathInside(pathname, registeredDir))) return true;
	return false;
}
//#endregion
//#region src/agents/agent-scope-config.ts
/** Resolves configured agent ids, directories, workspaces, and merged agent defaults. */
var AgentSelectionRequiredError = class extends Error {
	constructor(agentIds, context) {
		const surface = context?.surface ?? "this operation";
		const hint = context?.hint ?? "Select an agent explicitly; CLI callers can pass --agent <id>, channels can add a binding, and ambient services can set their agentId target.";
		super(`Multiple agents are configured, but ${surface} has no explicit owner. ${hint}`);
		this.code = "AGENT_SELECTION_REQUIRED";
		this.name = "AgentSelectionRequiredError";
		this.agentIds = agentIds;
		this.surface = surface;
		this.hint = hint;
	}
};
/** ACP primaries select the harness; explicit fallback lists still configure native calls. */
function resolveAgentModelConfigForRuntime(agent, runtime = "native") {
	const model = agent?.model;
	if (runtime === "acp" || agent?.runtime?.type !== "acp") return model;
	return model && typeof model === "object" && Array.isArray(model.fallbacks) ? { fallbacks: model.fallbacks } : void 0;
}
/** Native overrides exclude ACP harness primaries without changing authored configuration. */
function resolveAgentNativeModelPrimary(cfg, agentId) {
	return resolvePrimaryStringValue(resolveAgentModelConfigForRuntime(resolveAgentConfig(cfg, agentId)));
}
/** Native requests inherit the raw default, including its configured auth-profile suffix. */
function resolveNativeModelPrimary(cfg, agentId) {
	return resolveAgentNativeModelPrimary(cfg, agentId) ?? resolvePrimaryStringValue(cfg.agents?.defaults?.model);
}
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
	return s.replaceAll("\0", "");
}
let activeAgentRosterFactsBatch;
const immutableAgentRosterFacts = /* @__PURE__ */ new WeakMap();
/**
* Runs a read-only callback with batch-scoped roster memoization.
*
* Runtime discovery calls the owner helpers for every configured model. Keep
* their derived facts on this exact config. Mutable callers discard the batch
* before returning; immutable captures retain facts for their own lifetime.
*/
function withAgentRosterFactsBatch(config, callback) {
	const parent = activeAgentRosterFactsBatch;
	activeAgentRosterFactsBatch = parent?.config === config ? parent : {
		config,
		facts: readAgentRosterFacts(config) ?? {}
	};
	try {
		return callback();
	} finally {
		activeAgentRosterFactsBatch = parent;
	}
}
function readAgentRosterFacts(cfg) {
	if (activeAgentRosterFactsBatch?.config === cfg) return activeAgentRosterFactsBatch.facts;
	if (!isDeeplyFrozenPlainData(cfg)) return;
	let cached = immutableAgentRosterFacts.get(cfg);
	if (!cached) {
		cached = {};
		immutableAgentRosterFacts.set(cfg, cached);
	}
	return cached;
}
/** Converts either supported roster representation into the canonical keyed shape. */
function toAgentEntriesRecord(entries) {
	return Object.fromEntries(entries.map((entry) => {
		const { id, ...config } = entry;
		return [id, config];
	}));
}
/** Returns a configured agent id or throws the canonical CLI selection error. */
function resolveConfiguredAgentId(cfg, agentId) {
	if (!listAgentIds(cfg).includes(agentId)) throw new Error(`Unknown agent id "${agentId}". Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	return agentId;
}
function resolveSoleAgentId(cfg, context) {
	const sole = tryResolveSoleAgentId(cfg);
	if (sole) return sole;
	const agentIds = listAgentIds(cfg);
	if (agentIds.length === 0) throw new Error("No agents configured. Run `openclaw onboard` or `openclaw agents add` first.");
	throw new AgentSelectionRequiredError(agentIds, context);
}
/** Preserves legacy data locators independently of the configured runtime owner. */
function tryResolveLegacyDataOwnerAgentId(cfg) {
	const facts = readAgentRosterFacts(cfg);
	if (facts?.legacyDataOwnerAgentId) return facts.legacyDataOwnerAgentId.value;
	const value = tryResolveLegacyDataOwner(cfg);
	if (facts) facts.legacyDataOwnerAgentId = { value };
	return value;
}
/** Resolves the recorded default after migration, or a sole/raw legacy owner. */
function tryResolveLegacyCompatibilityAgentId(cfg) {
	const facts = readAgentRosterFacts(cfg);
	if (facts?.compatibilityAgentId) return facts.compatibilityAgentId.value;
	let value;
	if (cfg.agents?.ownership === "explicit") {
		const recorded = normalizeOptionalString(cfg.agents.defaults?.systemAgent?.agentId);
		const agentId = recorded ? normalizeAgentId(recorded) : void 0;
		value = agentId && listAgentIds(cfg).includes(agentId) ? agentId : void 0;
	} else value = tryResolveLegacyDataOwnerAgentId(cfg);
	if (facts) facts.compatibilityAgentId = { value };
	return value;
}
/** Resolves the owner for ambient system work and explicit requests. */
function tryResolveAmbientOwnerAgentId(cfg, requestedAgentId) {
	const explicitAgentId = normalizeOptionalString(requestedAgentId) ?? normalizeOptionalString(cfg.agents?.defaults?.systemAgent?.agentId);
	return explicitAgentId ? normalizeAgentId(explicitAgentId) : tryResolveLegacyCompatibilityAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
/** Ambient owner for surfaces that must fail loudly rather than act on the wrong agent. */
function resolveAmbientOwnerAgentId(cfg, requestedAgentId, context) {
	return tryResolveAmbientOwnerAgentId(cfg, requestedAgentId) ?? resolveSoleAgentId(cfg, context);
}
/** Returns an operation owner while preserving legacy defaults outside explicit fleets. */
function tryResolveAgentOperationAgentId(cfg, requestedAgentId) {
	if (requestedAgentId !== void 0) return tryResolveAmbientOwnerAgentId(cfg, requestedAgentId);
	return tryResolveLegacyCompatibilityAgentId(cfg) ?? tryResolveSoleAgentId(cfg);
}
/** Resolves a CLI operation owner, requiring selection when no owner is configured. */
function resolveAgentOperationAgentId(cfg, requestedAgentId, context) {
	return tryResolveAgentOperationAgentId(cfg, requestedAgentId) ?? resolveSoleAgentId(cfg, context);
}
/**
* @deprecated Ambient system work uses resolveAmbientOwnerAgentId so the configured
* system agent is honored; explicit-selection surfaces use resolveSoleAgentId. This
* accepts raw shipped markers only for input compatibility.
*/
function resolveDefaultAgentId(cfg, context) {
	return tryResolveRawLegacyDefaultAgentId(cfg) ?? resolveSoleAgentId(cfg, context);
}
function resolveAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const facts = readAgentRosterFacts(cfg);
	if (facts) {
		const found = (facts.entryByNormalizedId ??= buildAgentEntryIndex(cfg)).get(id);
		return found ? found.clone ? { ...found.entry } : found.entry : void 0;
	}
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && isRecord(roster.value)) {
		const entries = roster.value;
		for (const key in entries) {
			if (!Object.hasOwn(entries, key)) continue;
			const entry = entries[key];
			if (isRecord(entry) && normalizeAgentId(key) === id) return {
				...entry,
				id: key
			};
		}
		return;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => entry !== null && typeof entry === "object" && normalizeAgentId(entry.id) === id);
}
/**
* First-match index over the projected roster for batch point lookups.
*
* Keyed entries must stay clone-on-read (callers may mutate the returned
* entry); list entries keep the original object, matching the direct
* traversal semantics of `resolveAgentEntry` outside a batch.
*/
function buildAgentEntryIndex(cfg) {
	const index = /* @__PURE__ */ new Map();
	for (const { entry, source } of listAgentEntriesWithSource(cfg)) {
		const normalizedId = normalizeAgentId(entry?.id);
		if (!index.has(normalizedId)) index.set(normalizedId, {
			clone: source.kind === "entries",
			entry
		});
	}
	return index;
}
/** Resolves the authored entry object for in-place canonical config mutations. */
function resolveMutableAgentEntry(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const roster = readAgentRosterProperty(cfg);
	if (roster?.kind === "entries" && roster.value && typeof roster.value === "object") {
		const entries = roster.value;
		const key = Object.keys(entries).find((candidate) => normalizeAgentId(candidate) === id);
		return key ? entries[key] : void 0;
	}
	if (roster?.kind === "list" && Array.isArray(roster.value)) return roster.value.find((entry) => normalizeAgentId(entry?.id) === id);
}
/** Resolves merged config for one agent id. */
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const entry = resolveAgentEntry(cfg, id) ?? (!hasAgentRosterProperty(cfg) && id === "main" ? { id } : void 0);
	if (!entry) return;
	const agentDefaults = cfg.agents?.defaults;
	return {
		name: readStringValue(entry.name),
		workspace: readStringValue(entry.workspace),
		agentDir: readStringValue(entry.agentDir),
		model: typeof entry.model === "string" || entry.model && typeof entry.model === "object" ? entry.model : void 0,
		...entry.models ? { models: entry.models } : {},
		...entry.params ? { params: entry.params } : {},
		...entry.runtime ? { runtime: entry.runtime } : {},
		...hasExplicitModelPolicyAllow(entry.modelPolicy) ? { modelPolicy: entry.modelPolicy } : {},
		utilityModel: readStringValue(entry.utilityModel),
		decisionModel: readStringValue(entry.decisionModel),
		thinkingDefault: entry.thinkingDefault,
		verboseDefault: entry.verboseDefault ?? agentDefaults?.verboseDefault,
		toolProgressDetail: entry.toolProgressDetail ?? agentDefaults?.toolProgressDetail,
		reasoningDefault: entry.reasoningDefault,
		fastModeDefault: entry.fastModeDefault ?? agentDefaults?.fastModeDefault,
		contextInjection: entry.contextInjection,
		bootstrapMaxChars: entry.bootstrapMaxChars,
		bootstrapTotalMaxChars: entry.bootstrapTotalMaxChars,
		experimental: typeof entry.experimental === "object" && entry.experimental ? {
			...agentDefaults?.experimental,
			...entry.experimental
		} : agentDefaults?.experimental,
		skills: Array.isArray(entry.skills) ? entry.skills : void 0,
		memory: entry.memory,
		humanDelay: entry.humanDelay,
		typingMode: entry.typingMode ?? agentDefaults?.typingMode,
		tts: entry.tts,
		contextLimits: typeof entry.contextLimits === "object" && entry.contextLimits ? {
			...agentDefaults?.contextLimits,
			...entry.contextLimits
		} : agentDefaults?.contextLimits,
		heartbeat: entry.heartbeat,
		identity: entry.identity,
		groupChat: entry.groupChat,
		subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : void 0,
		embeddedAgent: typeof entry.embeddedAgent === "object" && entry.embeddedAgent ? entry.embeddedAgent : void 0,
		sandbox: entry.sandbox,
		tools: entry.tools
	};
}
function resolveAgentContextLimits(cfg, agentId) {
	const defaults = cfg?.agents?.defaults?.contextLimits;
	if (!cfg || !agentId) return defaults;
	return resolveAgentConfig(cfg, agentId)?.contextLimits ?? defaults;
}
function resolveAgentWorkspaceDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
	if (configured) return stripNullBytes(resolveUserPath(configured, env));
	const inheritedWorkspaceAgentId = tryResolveLegacyDataOwnerAgentId(cfg);
	const fallback = cfg.agents?.defaults?.workspace?.trim();
	if (inheritedWorkspaceAgentId && id === inheritedWorkspaceAgentId) {
		if (fallback) return stripNullBytes(resolveUserPath(fallback, env));
		return stripNullBytes(resolveDefaultAgentWorkspaceDir(env));
	}
	if (fallback) return stripNullBytes(path.join(resolveUserPath(fallback, env), id));
	const stateDir = resolveStateDir(env);
	return stripNullBytes(path.join(stateDir, `workspace-${id}`));
}
/** Resolves the configured task directory without changing the agent workspace. */
function resolveAgentRunCwd(cfg, agentId) {
	const cwd = normalizeOptionalString(resolveAgentEntry(cfg, agentId)?.cwd) ?? normalizeOptionalString(cfg.agents?.defaults?.cwd);
	return cwd ? stripNullBytes(resolveUserPath(cwd)) : void 0;
}
/**
* Resolves whether an agent's workspace is runtime-managed and implicit.
*
* A workspace is runtime-managed-implicit only when all of the following hold:
* - the agent runs the ACP runtime (non-embedded),
* - the agent entry does not configure an explicit `workspace`,
* - the provisioned directory is the config-resolved implicit workspace, and
* - this invocation has a distinct authoritative cwd: the invocation cwd when
*   known (session ACP meta or the configured binding that owns the session
*   key), otherwise the agent-global runtime `acp.cwd` default. A cwd equal to
*   the resolved workspace is not distinct.
*
* Such agents must not get a scaffolded default workspace with bootstrap
* files and `git init` (#92015). Every other shape — explicit workspaces,
* ACP agents that fall back to their workspace as cwd, and embedded agents —
* keeps standard provisioning.
*/
function resolveAgentWorkspaceProvisioning(cfg, agentId, invocation) {
	const id = normalizeAgentId(agentId);
	const entry = resolveAgentConfig(cfg, id);
	if (entry?.runtime?.type !== "acp") return "standard";
	if (entry.workspace?.trim()) return "standard";
	const implicitDir = resolveAgentWorkspaceDir(cfg, id);
	const workspaceDir = invocation?.workspaceDir?.trim() ? resolveUserPath(invocation.workspaceDir) : implicitDir;
	if (workspaceDir !== implicitDir) return "standard";
	const cwd = normalizeOptionalString(invocation?.cwd)?.trim() ?? entry.runtime.acp?.cwd?.trim();
	if (!cwd) return "standard";
	if (path.resolve(resolveUserPath(cwd)) === path.resolve(workspaceDir)) return "standard";
	return "runtime-managed-implicit";
}
/**
* Cheap candidate check for turn-level provisioning resolution: true only for
* ACP agents without an explicit workspace, so heavier invocation-cwd lookups
* (configured binding resolution) stay off embedded/default agent turns.
*/
function isImplicitAcpWorkspaceCandidate(cfg, agentId) {
	const entry = resolveAgentConfig(cfg, normalizeAgentId(agentId));
	return entry?.runtime?.type === "acp" && !entry.workspace?.trim();
}
function tryResolveConfiguredAgentWorkspaceDir(cfg, env = process.env) {
	const inheritedWorkspaceAgentId = tryResolveLegacyDataOwnerAgentId(cfg);
	if (inheritedWorkspaceAgentId) return resolveAgentWorkspaceDir(cfg, inheritedWorkspaceAgentId, env);
	const configured = cfg.agents?.defaults?.workspace?.trim();
	return configured ? stripNullBytes(resolveUserPath(configured, env)) : void 0;
}
function resolveEffectiveAgentDir(cfg, agentId, deps) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.agentDir?.trim();
	const env = deps?.env ?? process.env;
	return configured ? resolveUserPath(configured, env, deps?.homedir) : path.join(resolveStateDir(env, deps?.homedir), "agents", id, "agent");
}
function resolveAgentDir(cfg, agentId, env = process.env) {
	const agentDir = resolveEffectiveAgentDir(cfg, agentId, { env });
	registerResolvedAgentDir({
		agentId,
		agentDir,
		env
	});
	return agentDir;
}
function resolveDefaultAgentDir(cfg, env = process.env) {
	return resolveAgentDir(cfg, resolveAmbientOwnerAgentId(cfg), env);
}
//#endregion
export { registerResolvedAgentDir as A, parseOperatorModelPolicyWildcardRef as B, tryResolveAmbientOwnerAgentId as C, withAgentRosterFactsBatch as D, tryResolveLegacyDataOwnerAgentId as E, hasModelPolicyAllowlistMigrationMarker as F, materializeModelPolicyAllowlist as I, projectIncludeModelPolicyWrite as L, unregisterResolvedAgentDir as M, computeModelPolicyAllowlist as N, isPathOwnedByAnotherRegisteredAgent as O, hasExplicitModelPolicyAllow as P, createModelPolicyRefValidator as R, tryResolveAgentOperationAgentId as S, tryResolveLegacyCompatibilityAgentId as T, resolveEffectiveAgentDir as _, resolveAgentDir as a, resolveSoleAgentId as b, resolveAgentNativeModelPrimary as c, resolveAgentWorkspaceDir as d, resolveAgentWorkspaceProvisioning as f, resolveDefaultAgentId as g, resolveDefaultAgentDir as h, resolveAgentContextLimits as i, resolveRegisteredAgentIdForDir as j, normalizeAgentDirRegistryPath as k, resolveAgentOperationAgentId as l, resolveConfiguredAgentId as m, isImplicitAcpWorkspaceCandidate as n, resolveAgentEntry as o, resolveAmbientOwnerAgentId as p, resolveAgentConfig as r, resolveAgentModelConfigForRuntime as s, AgentSelectionRequiredError as t, resolveAgentRunCwd as u, resolveMutableAgentEntry as v, tryResolveConfiguredAgentWorkspaceDir as w, toAgentEntriesRecord as x, resolveNativeModelPrimary as y, parseModelPolicyWildcardRef as z };
