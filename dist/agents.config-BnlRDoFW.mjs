import { _ as resolvePrimaryStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, S as tryResolveLegacyCompatibilityAgentId, a as resolveAgentDir, l as resolveAgentWorkspaceDir, r as resolveAgentConfig, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { n as pinLegacyInheritedAuthOwnerForRosterTransition } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.mjs";
import { r as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-DbxXI2gj.mjs";
import { i as loadAgentIdentityFromWorkspace } from "./identity-file-By55_88F.mjs";
import { t as pinSurvivorWorkspaceForRosterCollapse } from "./agent-workspace-roster-transition-BwpAREwf.mjs";
//#region src/commands/agents.config.ts
/** Find a configured agent entry by normalized id. */
function findAgentEntryIndex(list, agentId) {
	const id = normalizeAgentId(agentId);
	return list.findIndex((entry) => normalizeAgentId(entry.id) === id);
}
/** Build config-derived summaries for text/JSON agent listing. */
function buildAgentSummaries(cfg) {
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const configuredAgents = listAgentEntries(cfg);
	const orderedIds = configuredAgents.length > 0 ? configuredAgents.map((agent) => normalizeAgentId(agent.id)) : defaultAgentId ? [defaultAgentId] : [];
	const bindingCounts = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) {
		const agentId = normalizeAgentId(binding.agentId);
		bindingCounts.set(agentId, (bindingCounts.get(agentId) ?? 0) + 1);
	}
	return uniqueStrings(orderedIds).map((id) => {
		const workspace = resolveAgentWorkspaceDir(cfg, id);
		const identity = loadAgentIdentityFromWorkspace(workspace);
		const agentConfig = resolveAgentConfig(cfg, id);
		const configName = normalizeOptionalString(agentConfig?.identity?.name);
		const configEmoji = normalizeOptionalString(agentConfig?.identity?.emoji);
		const configAvatarUrl = resolveAgentAvatarUrlFromSource(cfg, id, agentConfig?.identity?.avatar);
		const identityAvatarUrl = configAvatarUrl ?? resolveAgentAvatarUrlFromSource(cfg, id, identity?.avatar);
		const identitySource = configName || configEmoji || configAvatarUrl ? "config" : identity ? "identity" : void 0;
		const summary = {
			id,
			name: normalizeOptionalString(agentConfig?.name),
			identityName: configName ?? identity?.name,
			identityEmoji: configEmoji ?? identity?.emoji,
			identitySource,
			workspace,
			agentDir: resolveAgentDir(cfg, id),
			model: resolvePrimaryStringValue(agentConfig?.model) ?? resolvePrimaryStringValue(cfg.agents?.defaults?.model),
			bindings: bindingCounts.get(id) ?? 0,
			isDefault: defaultAgentId !== void 0 && id === normalizeAgentId(defaultAgentId)
		};
		if (identityAvatarUrl) summary.identityAvatarUrl = identityAvatarUrl;
		const admissionRefusal = readAgentDatabaseAdmissionRefusal(id);
		if (admissionRefusal) {
			summary.status = "degraded";
			summary.admissionRefusal = admissionRefusal;
		}
		return summary;
	});
}
function applyAgentConfig(cfg, params) {
	const agentId = normalizeAgentId(params.agentId);
	const name = params.name?.trim();
	const list = listAgentEntries(cfg);
	const index = findAgentEntryIndex(list, agentId);
	const base = (index >= 0 ? list[index] : void 0) ?? { id: agentId };
	const mergedIdentity = params.identity ? {
		...base.identity,
		...params.identity
	} : void 0;
	const nextEntry = {
		...base,
		...name ? { name } : {},
		...params.workspace ? { workspace: params.workspace } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...mergedIdentity ? { identity: mergedIdentity } : {}
	};
	if (params.model === null) delete nextEntry.model;
	else if (params.model !== void 0) nextEntry.model = params.model;
	const nextList = [...list];
	if (index >= 0) nextList[index] = nextEntry;
	else nextList.push(nextEntry);
	const { list: _legacyList, ownership: _ownership, ...agentsConfig } = cfg.agents ?? {};
	const nextConfig = {
		...cfg,
		agents: {
			...agentsConfig,
			...nextList.length > 1 ? { ownership: "explicit" } : {},
			entries: toAgentEntriesRecord(nextList)
		}
	};
	if (list.length !== 1 || nextList.length <= 1) return nextConfig;
	const priorSystemAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const transitionedConfig = priorSystemAgentId && !normalizeOptionalString(nextConfig.agents?.defaults?.systemAgent?.agentId) ? {
		...nextConfig,
		agents: {
			...nextConfig.agents,
			defaults: {
				...nextConfig.agents?.defaults,
				systemAgent: { agentId: priorSystemAgentId }
			}
		}
	} : nextConfig;
	return pinLegacyInheritedAuthOwnerForRosterTransition(cfg, transitionedConfig);
}
/** Remove an agent and any config references that route or allow traffic to it. */
function pruneAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	const clearedOwnerRefs = [];
	const targetsDeletedAgent = (candidate) => {
		const normalized = normalizeAgentIdStrict(candidate);
		return normalized.ok && normalized.value === id;
	};
	const clearOwnerRef = (value, path) => {
		const owner = normalizeOptionalString(value?.agentId);
		if (!value || !owner || normalizeAgentId(owner) !== id) return value;
		clearedOwnerRefs.push(path);
		const { agentId: _agentId, ...rest } = value;
		return Object.keys(rest).length > 0 ? rest : void 0;
	};
	const agents = listAgentEntries(cfg);
	const pruneAllowAgents = (allowAgents) => allowAgents?.filter((entry) => {
		const trimmed = entry.trim();
		return !trimmed || !targetsDeletedAgent(trimmed);
	});
	const nextAgentsList = [];
	for (const entry of agents) {
		if (normalizeAgentId(entry.id) === id) continue;
		nextAgentsList.push(entry.subagents?.allowAgents ? {
			...entry,
			subagents: {
				...entry.subagents,
				allowAgents: pruneAllowAgents(entry.subagents.allowAgents)
			}
		} : entry);
	}
	const nextAgents = nextAgentsList.length > 0 ? toAgentEntriesRecord(nextAgentsList) : void 0;
	const bindings = cfg.bindings ?? [];
	const filteredBindings = bindings.filter((binding) => normalizeAgentId(binding.agentId) !== id);
	const allow = cfg.tools?.agentToAgent?.allow ?? [];
	const filteredAllow = allow.filter((entry) => entry !== id);
	const prunedDefaults = cfg.agents?.defaults?.subagents?.allowAgents ? {
		...cfg.agents.defaults,
		subagents: {
			...cfg.agents.defaults.subagents,
			allowAgents: pruneAllowAgents(cfg.agents.defaults.subagents.allowAgents)
		}
	} : cfg.agents?.defaults;
	const deletedAgentOwnedHeartbeat = normalizeOptionalString(prunedDefaults?.heartbeat?.agentId) !== void 0 && normalizeAgentId(prunedDefaults?.heartbeat?.agentId) === id;
	const nextHeartbeat = deletedAgentOwnedHeartbeat && nextAgentsList.length > 1 ? void 0 : clearOwnerRef(prunedDefaults?.heartbeat, "agents.defaults.heartbeat.agentId");
	if (deletedAgentOwnedHeartbeat && nextAgentsList.length > 1) clearedOwnerRefs.push("agents.defaults.heartbeat");
	const nextDefaults = prunedDefaults ? {
		...prunedDefaults,
		heartbeat: nextHeartbeat,
		systemAgent: clearOwnerRef(prunedDefaults.systemAgent, "agents.defaults.systemAgent.agentId")
	} : void 0;
	const nextTalk = clearOwnerRef(cfg.talk, "talk.agentId");
	const nextBroadcast = cfg.broadcast ? Object.fromEntries(Object.entries(cfg.broadcast).map(([peerId, value]) => [peerId, Array.isArray(value) ? value.filter((entry) => !targetsDeletedAgent(entry)) : value && typeof value === "object" ? {
		...value,
		agents: value.agents.filter((entry) => !targetsDeletedAgent(entry))
	} : value])) : void 0;
	const nextHooks = cfg.hooks ? {
		...cfg.hooks,
		allowedAgentIds: cfg.hooks.allowedAgentIds?.filter((entry) => !targetsDeletedAgent(entry)),
		mappings: cfg.hooks.mappings?.filter((mapping) => !mapping.agentId || !targetsDeletedAgent(mapping.agentId))
	} : void 0;
	const { list: _legacyList, ownership: _ownership, ...agentsConfig } = cfg.agents ?? {};
	const nextAgentsConfig = cfg.agents ? {
		...agentsConfig,
		...nextAgentsList.length > 1 ? { ownership: "explicit" } : {},
		defaults: nextDefaults,
		entries: nextAgents
	} : nextAgents ? {
		...nextAgentsList.length > 1 ? { ownership: "explicit" } : {},
		entries: nextAgents
	} : void 0;
	const nextTools = cfg.tools?.agentToAgent ? {
		...cfg.tools,
		agentToAgent: {
			...cfg.tools.agentToAgent,
			allow: filteredAllow.length > 0 ? filteredAllow : void 0
		}
	} : cfg.tools;
	const preliminaryConfig = {
		...cfg,
		agents: nextAgentsConfig,
		bindings: filteredBindings.length > 0 ? filteredBindings : void 0,
		broadcast: nextBroadcast,
		hooks: nextHooks,
		talk: nextTalk,
		tools: nextTools
	};
	const workspacePinnedConfig = pinSurvivorWorkspaceForRosterCollapse(cfg, preliminaryConfig).config;
	return {
		config: agents.length > 1 && nextAgentsList.length === 1 ? pinLegacyInheritedAuthOwnerForRosterTransition(cfg, workspacePinnedConfig) : workspacePinnedConfig,
		removedBindings: bindings.length - filteredBindings.length,
		removedAllow: allow.length - filteredAllow.length,
		clearedOwnerRefs
	};
}
//#endregion
export { pruneAgentConfig as i, buildAgentSummaries as n, findAgentEntryIndex as r, applyAgentConfig as t };
