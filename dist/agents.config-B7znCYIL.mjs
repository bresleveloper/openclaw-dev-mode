import { _ as resolvePrimaryStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, S as toAgentEntriesRecord, a as resolveAgentDir, f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as pinLegacyInheritedAuthOwnerForRosterTransition } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { i as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-B-RTE8eg.mjs";
import { a as loadAgentIdentityFromWorkspaceAsync } from "./identity-file-BFsBDRA6.mjs";
import { r as pinSurvivorWorkspaceForRosterCollapse } from "./agent-workspace-roster-transition-Db3DDtpa.mjs";
import { i as listRouteBindings } from "./bindings-Cw_QSeBA.mjs";
import pMap from "p-map";
//#region src/commands/agents.config.ts
/** Find a configured agent entry by normalized id. */
function findAgentEntryIndex(list, agentId) {
	const id = normalizeAgentId(agentId);
	return list.findIndex((entry) => normalizeAgentId(entry.id) === id);
}
/** Build config-derived summaries for text/JSON agent listing. */
async function buildAgentSummaries(cfg) {
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const configuredAgents = listAgentEntries(cfg);
	const orderedIds = configuredAgents.length > 0 ? configuredAgents.map((agent) => normalizeAgentId(agent.id)) : defaultAgentId ? [defaultAgentId] : [];
	const bindingCounts = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) {
		const agentId = normalizeAgentId(binding.agentId);
		bindingCounts.set(agentId, (bindingCounts.get(agentId) ?? 0) + 1);
	}
	const ordered = uniqueStrings(orderedIds);
	return pMap(ordered, async (id) => {
		const workspace = resolveAgentWorkspaceDir(cfg, id);
		const identity = await loadAgentIdentityFromWorkspaceAsync(workspace);
		const agentConfig = resolveAgentConfig(cfg, id);
		const configName = normalizeOptionalString(agentConfig?.identity?.name);
		const configEmoji = normalizeOptionalString(agentConfig?.identity?.emoji);
		const configAvatarUrl = await resolveAgentAvatarUrlFromSource(cfg, id, agentConfig?.identity?.avatar);
		const identityAvatarUrl = configAvatarUrl ?? await resolveAgentAvatarUrlFromSource(cfg, id, identity?.avatar);
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
	}, { concurrency: 4 });
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
	const { ownership: _ownership, ...agentsConfig } = cfg.agents ?? {};
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
		const nextEntry = { ...entry };
		if (entry.subagents?.allowAgents) nextEntry.subagents = {
			...entry.subagents,
			allowAgents: pruneAllowAgents(entry.subagents.allowAgents)
		};
		if (entry.tools?.agentToAgent?.send) nextEntry.tools = {
			...entry.tools,
			agentToAgent: {
				...entry.tools.agentToAgent,
				send: pruneAllowAgents(entry.tools.agentToAgent.send)
			}
		};
		nextAgentsList.push(nextEntry);
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
	const { ownership: _ownership, ...agentsConfig } = cfg.agents ?? {};
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
