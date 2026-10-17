import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { E as parseRawSessionConversationRef, M as parseAgentSessionKey, O as parseThreadSessionSuffix } from "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { r as listAgentEntriesWithSource, t as hasAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { r as resolveProviderToolPolicyEntry } from "./provider-tool-policy-CQtosRma.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Dn8gpf-E.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-BO1puJQ0.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as resolveSessionConversation } from "./session-conversation-BIYNj_jF.mjs";
import { i as resolveClawToolPolicyConsent, n as markFrozenClawToolAllowPolicy } from "./tool-policy-runtime--SOb7O-O.mjs";
import { r as resolveChannelGroupToolsPolicy } from "./group-policy-BJ7vM7Bm.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-eD9SQrK2.mjs";
import { a as resolveStoredSubagentInheritedToolDenylist, i as resolveStoredSubagentInheritedToolAllowlist, r as resolveStoredSubagentCapabilities, s as resolveSubagentCapabilityStore } from "./subagent-capabilities-wl-IV_LE.mjs";
//#region src/agents/agent-tools.policy.ts
/**
* Resolves sandbox tool policies for agents, providers, sub-agents, and group
* sessions. Keeps runtime tool filtering tied to canonical config, session
* provenance, and inherited sub-agent capabilities.
*/
/**
* Tools always denied for sub-agents regardless of depth.
* These are system-level or interactive tools that sub-agents should never use.
*/
const SUBAGENT_TOOL_DENY_ALWAYS = [
	"gateway",
	"agents_list",
	"openclaw",
	"session_status",
	"progress_card",
	AUTOMATIONS_TOOL_NAME,
	"message",
	"sessions_send",
	"conversations_list",
	"conversations_send",
	"conversations_turn"
];
/** Tools that only make sense for orchestrator sub-agents that can spawn children. */
const SUBAGENT_TOOL_DENY_LEAF = [
	"subagents",
	"sessions_list",
	"sessions_history",
	"sessions_search",
	"sessions_spawn"
];
function resolveSubagentDenyListForRole(role) {
	if (role === "leaf") return [...SUBAGENT_TOOL_DENY_ALWAYS, ...SUBAGENT_TOOL_DENY_LEAF];
	return [...SUBAGENT_TOOL_DENY_ALWAYS];
}
/** Resolve sub-agent tool policy from stored session capabilities. */
function resolveSubagentToolPolicyForSession(cfg, sessionKey, opts) {
	const configured = cfg?.tools?.subagents?.tools;
	const store = resolveSubagentCapabilityStore(sessionKey, {
		cfg,
		store: opts?.store
	});
	const capabilities = resolveStoredSubagentCapabilities(sessionKey, {
		cfg,
		store
	});
	const allow = Array.isArray(configured?.allow) ? configured.allow : void 0;
	const alsoAllow = Array.isArray(configured?.alsoAllow) ? configured.alsoAllow : void 0;
	const deny = [...resolveSubagentDenyListForRole(capabilities.role), ...Array.isArray(configured?.deny) ? configured.deny : []];
	return {
		allow: allow && alsoAllow ? uniqueStrings([...allow, ...alsoAllow]) : allow,
		deny
	};
}
/** Resolve the tool policy inherited from a parent sub-agent session. */
function resolveInheritedToolPolicyForSession(cfg, sessionKey, opts) {
	const inheritedToolAllow = resolveStoredSubagentInheritedToolAllowlist(sessionKey, {
		cfg,
		store: opts?.store
	});
	const inheritedToolDeny = resolveStoredSubagentInheritedToolDenylist(sessionKey, {
		cfg,
		store: opts?.store
	});
	if (inheritedToolAllow.length === 0 && inheritedToolDeny.length === 0) return;
	return {
		...inheritedToolAllow.length > 0 ? { allow: inheritedToolAllow } : {},
		...inheritedToolDeny.length > 0 ? { deny: inheritedToolDeny } : {}
	};
}
/** Resolve the shared profile, scope, extra, and sandbox policy layers. */
function resolveConfiguredToolPolicies(params) {
	const profile = params.agentTools?.profile ?? params.cfg.tools?.profile;
	const profileAlsoAllow = resolveExplicitProfileAlsoAllow(params.agentTools) ?? resolveExplicitProfileAlsoAllow(params.cfg.tools);
	const policies = [
		mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profile), profileAlsoAllow),
		pickSandboxToolPolicy(params.cfg.tools ?? void 0),
		pickSandboxToolPolicy(params.agentTools),
		...params.extraPolicies ?? []
	].filter((policy) => Boolean(policy));
	if (params.sandboxMode === "all") policies.push(resolveSandboxToolPolicyForAgent(params.cfg, params.agentId ?? void 0));
	return policies;
}
function buildScopedGroupIdCandidates(groupId) {
	const raw = groupId?.trim();
	if (!raw) return [];
	const topicSenderMatch = raw.match(/^(.+):topic:([^:]+):sender:([^:]+)$/i);
	if (topicSenderMatch) {
		const [, chatId, topicId] = topicSenderMatch;
		return normalizeUniqueSingleOrTrimmedStringList([
			raw,
			`${chatId}:topic:${topicId}`,
			chatId
		]);
	}
	const topicMatch = raw.match(/^(.+):topic:([^:]+)$/i);
	if (topicMatch) {
		const [, chatId, topicId] = topicMatch;
		return normalizeUniqueSingleOrTrimmedStringList([`${chatId}:topic:${topicId}`, chatId]);
	}
	const senderMatch = raw.match(/^(.+):sender:([^:]+)$/i);
	if (senderMatch) {
		const [, chatId] = senderMatch;
		return normalizeUniqueSingleOrTrimmedStringList([raw, chatId]);
	}
	return [raw];
}
function resolveGroupContextFromSessionKey(sessionKey) {
	const raw = (sessionKey ?? "").trim();
	if (!raw) return {};
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(raw);
	const conversationKey = threadId ? baseSessionKey : raw;
	const conversation = parseRawSessionConversationRef(conversationKey);
	if (conversation) {
		const resolvedConversation = resolveSessionConversation({
			channel: conversation.channel,
			kind: conversation.kind,
			rawId: conversation.rawId
		});
		return {
			channel: conversation.channel,
			groupIds: normalizeUniqueSingleOrTrimmedStringList([
				...buildScopedGroupIdCandidates(conversation.rawId),
				resolvedConversation?.id,
				resolvedConversation?.baseConversationId,
				...resolvedConversation?.parentConversationCandidates ?? []
			])
		};
	}
	const parts = (conversationKey ?? raw).split(":").filter(Boolean);
	let body = parts[0] === "agent" ? parts.slice(2) : parts;
	if (body[0] === "subagent") body = body.slice(1);
	if (body.length < 3) return {};
	const [channel, kind, ...rest] = body;
	if (kind !== "group" && kind !== "channel") return {};
	const groupId = rest.join(":").trim();
	if (!groupId) return {};
	return {
		channel: normalizeLowercaseStringOrEmpty(channel),
		groupIds: buildScopedGroupIdCandidates(groupId)
	};
}
function resolveTrustedGroupIdFromContexts(params) {
	const callerGroupId = (params.groupId ?? "").trim();
	if (!callerGroupId) return {
		groupId: params.groupId,
		dropped: false
	};
	if (normalizeUniqueSingleOrTrimmedStringList([...params.sessionContext.groupIds ?? [], ...params.spawnedContext.groupIds ?? []]).includes(callerGroupId)) return {
		groupId: params.groupId,
		dropped: false
	};
	return {
		groupId: null,
		dropped: true
	};
}
/** Validate caller-supplied group ids against server-derived session context. */
function resolveTrustedGroupId(params) {
	return resolveTrustedGroupIdFromContexts({
		groupId: params.groupId,
		sessionContext: resolveGroupContextFromSessionKey(params.sessionKey),
		spawnedContext: resolveGroupContextFromSessionKey(params.spawnedBy)
	});
}
function resolveExplicitProfileAlsoAllow(tools) {
	return Array.isArray(tools?.alsoAllow) ? tools.alsoAllow : void 0;
}
function profileAllowsGatewayConfigReads(profile, alsoAllow) {
	const policy = resolveCoreToolProfilePolicy(profile);
	if (!policy?.allow || policy.allow.includes("*")) return true;
	const allow = normalizeUniqueSingleOrTrimmedStringList(alsoAllow);
	return allow.length > 0 && createToolPolicyMatcher({ allow })("gateway");
}
/** Detect removed implicit grants for migration warnings only (#47487). */
function detectImplicitProfileGrants(params) {
	return [{
		section: "exec",
		grants: ["exec", "process"]
	}, {
		section: "fs",
		grants: [
			"read",
			"write",
			"edit"
		]
	}].filter(({ section }) => params.agentTools?.[section] != null || params.includeGlobalSections && params.globalTools?.[section] != null).map(({ section, grants }) => ({
		section: `tools.${section}`,
		grants
	}));
}
/** Resolve the layered global, provider, agent, and profile tool policies. */
function resolveEffectiveToolPolicy(params) {
	const explicitAgentId = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	const agentEntries = params.config ? listAgentEntriesWithSource(params.config) : [];
	const agentId = params.config && (!hasAgentRosterProperty(params.config) || agentEntries.length > 0) ? resolveSessionAgentIds({
		config: params.config,
		agentId: explicitAgentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : explicitAgentId ?? parseAgentSessionKey(params.sessionKey)?.agentId;
	const agentConfig = params.config && agentId ? resolveAgentConfig(params.config, agentId) : void 0;
	const implicitDefaultTools = params.config ? (params.config.agents?.defaults)?.tools : void 0;
	const agentTools = agentConfig?.tools ?? (params.config && !hasAgentRosterProperty(params.config) ? implicitDefaultTools : void 0);
	const globalTools = params.config?.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileSource = agentTools?.profile ? "agent" : globalTools?.profile ? "global" : void 0;
	const providerEntry = resolveProviderToolPolicyEntry({
		byProvider: globalTools?.byProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const agentProviderEntry = resolveProviderToolPolicyEntry({
		byProvider: agentTools?.byProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const providerPolicy = providerEntry?.policy;
	const agentProviderPolicy = agentProviderEntry?.policy;
	const agentSource = agentEntries.find(({ entry }) => normalizeAgentId(entry.id) === agentId)?.source;
	const agentToolsPath = agentSource ? formatConcreteConfigPath([
		"agents",
		agentSource.kind,
		agentSource.kind === "entries" ? agentSource.key : agentSource.index,
		"tools"
	]) : params.config && !hasAgentRosterProperty(params.config) && !agentConfig?.tools && implicitDefaultTools ? "agents.defaults.tools" : `agents.entries.${agentId}.tools`;
	const providerPath = providerEntry ? `tools.byProvider[${JSON.stringify(providerEntry.key)}]` : void 0;
	const agentProviderPath = agentProviderEntry ? `${agentToolsPath}.byProvider[${JSON.stringify(agentProviderEntry.key)}]` : void 0;
	const providerProfilePath = agentProviderPolicy?.profile ? agentProviderPath : providerPath;
	const profileAlsoAllowPath = !agentTools?.allow && (agentTools?.alsoAllow || !globalTools?.alsoAllow?.length) ? `${agentToolsPath}.alsoAllow` : void 0;
	const sources = {
		profile: {
			kind: "profile",
			path: profileSource === "agent" ? `${agentToolsPath}.profile` : "tools.profile",
			profile,
			alsoAllowPath: profileAlsoAllowPath
		},
		providerProfile: {
			kind: "profile",
			path: providerProfilePath ? `${providerProfilePath}.profile` : void 0,
			profile: agentProviderPolicy?.profile ?? providerPolicy?.profile
		},
		global: {
			kind: "config",
			path: "tools"
		},
		globalProvider: {
			kind: "config",
			path: providerPath
		},
		agent: {
			kind: "config",
			path: agentToolsPath
		},
		agentProvider: {
			kind: "config",
			path: agentProviderPath
		}
	};
	const profiles = [
		...globalTools?.profile ? [{
			profile: globalTools.profile,
			source: "tools.profile",
			active: !agentTools?.profile
		}] : [],
		...agentTools?.profile ? [{
			profile: agentTools.profile,
			source: `${agentToolsPath}.profile`,
			active: true
		}] : [],
		...providerPolicy?.profile && providerPath ? [{
			profile: providerPolicy.profile,
			source: `${providerPath}.profile`,
			active: !agentProviderPolicy?.profile
		}] : [],
		...agentProviderPolicy?.profile && agentProviderPath ? [{
			profile: agentProviderPolicy.profile,
			source: `${agentProviderPath}.profile`,
			active: true
		}] : []
	];
	const explicitProfileAlsoAllow = resolveExplicitProfileAlsoAllow(agentTools) ?? resolveExplicitProfileAlsoAllow(globalTools);
	const agentPolicy = pickSandboxToolPolicy(agentTools);
	if (resolveClawToolPolicyConsent({
		agentTools,
		agentId,
		profile,
		ownsProfile: profileSource === "agent",
		hasAgentAllowlist: (agentPolicy?.allow?.length ?? 0) > 0
	}).frozen) markFrozenClawToolAllowPolicy(agentPolicy);
	const effectivePolicy = {
		agentId,
		sources,
		profiles,
		globalPolicy: pickSandboxToolPolicy(globalTools),
		globalProviderPolicy: pickSandboxToolPolicy(providerPolicy),
		agentPolicy,
		agentProviderPolicy: pickSandboxToolPolicy(agentProviderPolicy),
		profile,
		providerProfile: agentProviderPolicy?.profile ?? providerPolicy?.profile,
		profileAlsoAllow: explicitProfileAlsoAllow ? uniqueStrings(explicitProfileAlsoAllow) : void 0,
		providerProfileAlsoAllow: Array.isArray(agentProviderPolicy?.alsoAllow) ? agentProviderPolicy?.alsoAllow : Array.isArray(providerPolicy?.alsoAllow) ? providerPolicy?.alsoAllow : void 0
	};
	const gatewayConfigReadAllowed = profileAllowsGatewayConfigReads(profile, effectivePolicy.profileAlsoAllow) && profileAllowsGatewayConfigReads(effectivePolicy.providerProfile, effectivePolicy.providerProfileAlsoAllow);
	if (profile) {
		const implicitGrants = detectImplicitProfileGrants({
			globalTools,
			agentTools,
			includeGlobalSections: profileSource === "global"
		});
		if (implicitGrants.length > 0) {
			const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(profile), explicitProfileAlsoAllow);
			const matchesProfile = createToolPolicyMatcher(profilePolicy);
			const restrictionMatchers = [
				effectivePolicy.globalPolicy,
				effectivePolicy.globalProviderPolicy,
				effectivePolicy.agentPolicy,
				effectivePolicy.agentProviderPolicy,
				mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(effectivePolicy.providerProfile), effectivePolicy.providerProfileAlsoAllow)
			].map((policy) => createToolPolicyMatcher(policy));
			const uncoveredEntries = implicitGrants.map((entry) => ({
				section: entry.section,
				grants: entry.grants.filter((toolName) => !matchesProfile(toolName) && restrictionMatchers.every((matches) => matches(toolName)))
			})).filter((entry) => entry.grants.length > 0);
			const uncovered = uncoveredEntries.flatMap((entry) => entry.grants);
			if (uncovered.length > 0) logWarn(`tools policy: profile "${profile}"${agentId ? ` (agent "${agentId}")` : ""} has configured tool sections (${uncoveredEntries.map((entry) => entry.section).join(" / ")}) that no longer implicitly widen the profile. Add alsoAllow: [${uncovered.map((toolName) => `"${toolName}"`).join(", ")}] explicitly if these tools should be available. See #47487.`);
		}
	}
	return {
		...effectivePolicy,
		gatewayConfigReadAllowed
	};
}
function unavailableScheduledAccount(accountId) {
	return {
		kind: "account-unavailable",
		accountId,
		message: `Scheduled account "${accountId}" is unavailable. Re-add it to the channel configuration, or recreate this automation from the intended account.`
	};
}
/** Resolve policy without conflating unavailable scheduled authority with intentional denial. */
function resolveGroupToolPolicyOutcome(params) {
	if (!params.config) return { kind: "resolved" };
	const sessionContext = resolveGroupContextFromSessionKey(params.sessionKey);
	const spawnedContext = resolveGroupContextFromSessionKey(params.spawnedBy);
	const trustedGroup = resolveTrustedGroupIdFromContexts({
		groupId: params.groupId,
		sessionContext,
		spawnedContext
	});
	const groupIds = normalizeUniqueSingleOrTrimmedStringList([
		...sessionContext.groupIds ?? [],
		...spawnedContext.groupIds ?? [],
		...buildScopedGroupIdCandidates(trustedGroup.groupId)
	]);
	const channelRaw = sessionContext.channel ?? spawnedContext.channel ?? params.messageProvider;
	const channel = normalizeMessageChannel(channelRaw);
	const accountId = normalizeAccountId(params.accountId);
	if (!channel) return params.requireConfiguredAccount && accountId !== "default" ? unavailableScheduledAccount(accountId) : { kind: "resolved" };
	let plugin;
	try {
		plugin = getLoadedChannelPlugin(channel);
	} catch {
		plugin = void 0;
	}
	if (params.requireConfiguredAccount && accountId !== "default") {
		let configured;
		try {
			configured = plugin?.config.listAccountIds(params.config).some((candidate) => normalizeAccountId(candidate) === accountId) === true;
		} catch {
			configured = false;
		}
		if (!configured) return unavailableScheduledAccount(accountId);
	}
	if (groupIds.length === 0) return { kind: "resolved" };
	for (const groupId of groupIds) {
		const toolsConfig = plugin?.groups?.resolveToolPolicy?.({
			cfg: params.config,
			groupId,
			groupChannel: trustedGroup.dropped ? null : params.groupChannel,
			groupSpace: trustedGroup.dropped ? null : params.groupSpace,
			accountId,
			senderPolicyMode: params.senderPolicyMode,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		});
		const policy = pickSandboxToolPolicy(toolsConfig);
		if (policy) return {
			kind: "resolved",
			policy
		};
	}
	const configTools = resolveChannelGroupToolsPolicy({
		cfg: params.config,
		channel,
		messageProvider: channel,
		groupId: groupIds[0],
		groupIdCandidates: groupIds.slice(1),
		accountId,
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	return {
		kind: "resolved",
		policy: pickSandboxToolPolicy(configTools)
	};
}
/** Tool-building callers must stop before exposing a surface with unavailable authority. */
function resolveGroupToolPolicy(params) {
	const outcome = resolveGroupToolPolicyOutcome(params);
	if (outcome.kind === "account-unavailable") throw new Error(outcome.message);
	return outcome.policy;
}
//#endregion
export { resolveSubagentToolPolicyForSession as a, resolveInheritedToolPolicyForSession as i, resolveEffectiveToolPolicy as n, resolveTrustedGroupId as o, resolveGroupToolPolicy as r, resolveConfiguredToolPolicies as t };
