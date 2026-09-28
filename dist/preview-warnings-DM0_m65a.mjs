import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { D as listAgentEntriesWithSource, E as listAgentEntries, r as resolveAgentConfig, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { i as resolveProviderToolPolicyEntry, n as normalizeToolProviderPolicyKey, r as resolveProviderToolPolicy } from "./provider-tool-policy-Yi_RXS5Z.mjs";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-auQCQEhM.mjs";
import { o as isToolAllowedByPolicies, s as isToolAllowedByPolicyName } from "./tool-policy-match-Bv2XOvEF.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-Dp4rlIlG.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { r as VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE } from "./configured-runtime-plugin-installs-DW1vCQmx.mjs";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.mjs";
import { o as resolveAgentRoute } from "./resolve-route-zfKT6ZcU.mjs";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-CrvH3Equ.mjs";
//#region src/routing/channel-route-targets.ts
const CHANNELS_CONFIG_META_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
function normalizeConfiguredChannelKey(raw) {
	return normalizeChatChannelId(raw) ?? normalizeLowercaseStringOrEmpty(raw);
}
function normalizeRouteBindingChannelKey(raw) {
	return normalizeLowercaseStringOrEmpty(raw);
}
function listConfiguredChannelIds(cfg) {
	if (!isRecord(cfg.channels)) return [];
	return Object.entries(cfg.channels).filter(([id, value]) => {
		if (CHANNELS_CONFIG_META_KEYS.has(id)) return false;
		return !(isRecord(value) && value.enabled === false);
	}).map(([id]) => normalizeConfiguredChannelKey(id)).filter(Boolean).toSorted();
}
function listConfiguredChannelAccountIds(cfg, channelId) {
	if (!isRecord(cfg.channels)) return [];
	const channel = Object.entries(cfg.channels).find(([id]) => normalizeConfiguredChannelKey(id) === channelId)?.[1];
	if (!isRecord(channel) || !isRecord(channel.accounts)) return [];
	return Object.entries(channel.accounts).filter(([, value]) => !(isRecord(value) && value.enabled === false)).map(([accountId]) => normalizeAccountId(accountId)).filter(Boolean).toSorted();
}
function addTarget(byAgent, agentId, channel) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const trimmedChannel = channel.trim();
	if (!normalizedAgentId || !trimmedChannel) return;
	const channels = byAgent.get(normalizedAgentId) ?? /* @__PURE__ */ new Set();
	channels.add(trimmedChannel);
	byAgent.set(normalizedAgentId, channels);
}
function collectChannelRouteTargets(cfg) {
	const byAgent = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) addTarget(byAgent, binding.agentId, normalizeRouteBindingChannelKey(binding.match.channel));
	for (const channel of listConfiguredChannelIds(cfg)) {
		const accountIds = listConfiguredChannelAccountIds(cfg, channel);
		const sampledAccountIds = accountIds.length > 0 ? accountIds : [DEFAULT_ACCOUNT_ID];
		for (const accountId of sampledAccountIds) try {
			addTarget(byAgent, resolveAgentRoute({
				cfg,
				channel,
				accountId
			}).agentId, channel);
		} catch (error) {
			if (!(error instanceof AgentSelectionRequiredError)) throw error;
		}
	}
	return Array.from(byAgent.entries()).map(([agentId, channels]) => ({
		agentId,
		channels: Array.from(channels).toSorted()
	})).filter((target) => target.channels.length > 0).toSorted((a, b) => a.agentId.localeCompare(b.agentId));
}
//#endregion
//#region src/commands/doctor/shared/preview-message-tool-policy.ts
function resolveMessageToolAvailability(params) {
	const agentConfig = params.agentId ? resolveAgentConfig(params.cfg, params.agentId) : void 0;
	const modelRef = resolveDoctorPrimaryModelRef(params.cfg, agentConfig?.model);
	const providerPolicy = resolveProviderToolPolicy({
		byProvider: params.globalTools?.byProvider,
		modelProvider: modelRef.provider,
		modelId: modelRef.model
	});
	const agentProviderPolicy = resolveProviderToolPolicy({
		byProvider: params.agentTools?.byProvider,
		modelProvider: modelRef.provider,
		modelId: modelRef.model
	});
	const profile = params.agentTools?.profile ?? params.globalTools?.profile;
	const configuredAlsoAllow = Array.isArray(params.agentTools?.alsoAllow) ? params.agentTools.alsoAllow : Array.isArray(params.globalTools?.alsoAllow) ? params.globalTools.alsoAllow : [];
	const providerAlsoAllow = Array.isArray(agentProviderPolicy?.alsoAllow) ? agentProviderPolicy.alsoAllow : Array.isArray(providerPolicy?.alsoAllow) ? providerPolicy.alsoAllow : [];
	const profileAlsoAllow = [...configuredAlsoAllow, ...params.runtimeAlsoAllow ?? []];
	const providerProfileAlsoAllow = [...providerAlsoAllow, ...params.runtimeAlsoAllow ?? []];
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(agentProviderPolicy?.profile ?? providerPolicy?.profile), providerProfileAlsoAllow);
	return isToolAllowedByPolicies("message", [
		profilePolicy,
		providerProfilePolicy,
		pickSandboxToolPolicy(providerPolicy),
		pickSandboxToolPolicy(agentProviderPolicy),
		pickSandboxToolPolicy(params.globalTools),
		pickSandboxToolPolicy(params.agentTools)
	]);
}
const SOURCE_REPLY_RUNTIME_MESSAGE_ALLOW = ["message"];
function collectUnavailableSourceReplyTargets(cfg) {
	const agents = listAgentEntries(cfg).filter(isRecord);
	if (agents.length === 0) return resolveMessageToolAvailability({
		cfg,
		globalTools: cfg.tools,
		runtimeAlsoAllow: SOURCE_REPLY_RUNTIME_MESSAGE_ALLOW
	}) ? [] : ["default tool policy"];
	return agents.flatMap((agent) => {
		const agentId = typeof agent.id === "string" ? agent.id : "unknown";
		return resolveMessageToolAvailability({
			cfg,
			agentId,
			globalTools: cfg.tools,
			agentTools: agent.tools,
			runtimeAlsoAllow: SOURCE_REPLY_RUNTIME_MESSAGE_ALLOW
		}) ? [] : [`agent "${agentId}"`];
	});
}
//#endregion
//#region src/commands/doctor/shared/preview-warnings.ts
const channelDoctorModuleLoader = createLazyImportLoader(() => import("./channel-doctor-CzecTWt-.mjs"));
function listAgentRecords(cfg) {
	return listAgentEntriesWithSource(cfg).map(({ entry }) => entry);
}
function hasPluginLoadPaths(cfg) {
	const plugins = cfg.plugins;
	if (!isRecord(plugins)) return false;
	const load = plugins.load;
	return isRecord(load) && Array.isArray(load.paths) && load.paths.length > 0;
}
function hasSubagentAllowlistConfig(cfg) {
	if (Array.isArray(cfg.agents?.defaults?.subagents?.allowAgents)) return true;
	return listAgentRecords(cfg).some((agent) => {
		const subagents = isRecord(agent.subagents) ? agent.subagents : void 0;
		return Array.isArray(subagents?.allowAgents);
	});
}
function hasToolsBySenderKey(value) {
	if (Array.isArray(value)) return value.some(hasToolsBySenderKey);
	if (!isRecord(value)) return false;
	if (isRecord(value.toolsBySender)) return true;
	return Object.entries(value).some(([key, nested]) => key !== "toolsBySender" && hasToolsBySenderKey(nested));
}
function hasConfiguredSafeBins(cfg) {
	const globalExec = cfg.tools?.exec;
	if (isRecord(globalExec) && Array.isArray(globalExec.safeBins) && globalExec.safeBins.length > 0) return true;
	return listAgentRecords(cfg).some((agent) => {
		const agentExec = isRecord(agent) && isRecord(agent.tools) ? agent.tools.exec : void 0;
		return isRecord(agentExec) && Array.isArray(agentExec.safeBins) && agentExec.safeBins.length > 0;
	});
}
function resolveGroupVisibleReplyPolicy(cfg) {
	const groupVisibleReplies = cfg.messages?.groupChat?.visibleReplies;
	if (groupVisibleReplies) return {
		path: "messages.groupChat.visibleReplies",
		value: groupVisibleReplies
	};
	const globalVisibleReplies = cfg.messages?.visibleReplies;
	if (globalVisibleReplies) return {
		path: "messages.visibleReplies",
		value: globalVisibleReplies
	};
	return {
		path: "messages.groupChat.visibleReplies",
		value: "automatic"
	};
}
function formatTargets(targets) {
	if (targets.length <= 2) return targets.join(" and ");
	return `${targets.slice(0, 2).join(", ")}, and ${targets.length - 2} more`;
}
/** Warn when visible-reply policy selects message_tool but message is unavailable. */
function collectVisibleReplyToolPolicyWarnings(cfg) {
	const groupPolicy = resolveGroupVisibleReplyPolicy(cfg);
	const warnings = [];
	if (groupPolicy.value === "message_tool") {
		const targets = collectUnavailableSourceReplyTargets(cfg);
		if (targets.length === 0) return warnings;
		warnings.push(`- ${groupPolicy.path} is set to "message_tool", but the message tool is unavailable for ${formatTargets(targets)}; OpenClaw falls back to automatic visible replies, so normal replies may post to the source chat. Enable the message tool or set ${groupPolicy.path} to "automatic".`);
	}
	if (cfg.messages?.visibleReplies === "message_tool" && groupPolicy.path !== "messages.visibleReplies") {
		const targets = collectUnavailableSourceReplyTargets(cfg);
		if (targets.length === 0) return warnings;
		warnings.push(`- messages.visibleReplies is set to "message_tool", but the message tool is unavailable for ${formatTargets(targets)}; OpenClaw falls back to automatic direct-chat replies, so normal replies may post to the source chat. Enable the message tool or set messages.visibleReplies to "automatic".`);
	}
	return warnings;
}
/** Warn when routed channel agents lack the message tool required for channel actions. */
function collectChannelBoundMessageToolPolicyWarnings(cfg) {
	return collectChannelRouteTargets(cfg).flatMap((target) => {
		const agentTools = resolveAgentConfig(cfg, target.agentId)?.tools;
		const runtimeMayAllowMessage = cfg.messages?.groupChat?.visibleReplies === "message_tool" || cfg.messages?.visibleReplies === "message_tool";
		if (resolveMessageToolAvailability({
			cfg,
			agentId: target.agentId,
			globalTools: cfg.tools,
			agentTools,
			runtimeAlsoAllow: runtimeMayAllowMessage ? SOURCE_REPLY_RUNTIME_MESSAGE_ALLOW : void 0
		})) return [];
		return [`- Agent "${target.agentId}" is routed from channel ${formatTargets(target.channels.map((channel) => `"${channel}"`))}, but the message tool is unavailable for that agent; explicit channel actions such as sendAttachment, upload-file, thread-reply, or reply can fail. Add "message" to the agent tool allowlist, add "group:messaging", or switch the agent to a profile that includes messaging tools.`];
	});
}
const PROFILE_CONFIGURED_TOOL_SECTIONS = [{
	key: "exec",
	label: "tools.exec",
	grants: ["exec", "process"]
}, {
	key: "fs",
	label: "tools.fs",
	grants: [
		"read",
		"write",
		"edit"
	]
}];
function collectConfiguredToolSectionGrantEntries(params) {
	const entries = [];
	for (const section of PROFILE_CONFIGURED_TOOL_SECTIONS) if (isRecord(params.tools?.[section.key])) entries.push({
		label: `${params.pathLabel}.${section.key}`,
		grants: [...section.grants]
	});
	return entries;
}
function formatQuotedList(values) {
	return values.map((value) => `"${value}"`).join(", ");
}
function hasNonEmptyStringList(value) {
	return Array.isArray(value) && value.some((entry) => typeof entry === "string");
}
function readPreviewStringList(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : void 0;
}
function collectProfileConfiguredSectionWarnings(params) {
	if (!params.profilePolicy) return [];
	const uncoveredEntries = params.configuredEntries.map((entry) => ({
		...entry,
		grants: entry.grants.filter((toolName) => !isToolAllowedByPolicyName(toolName, params.profilePolicy))
	})).filter((entry) => entry.grants.length > 0);
	if (uncoveredEntries.length === 0) return [];
	const grants = [...new Set(uncoveredEntries.flatMap((entry) => entry.grants))];
	const advicePath = params.advicePath ?? params.profilePath;
	const providerSuffix = params.profileKind === "active" ? "" : " for that provider";
	const advice = params.hasAllow ? `Add these grants to ${advicePath}.allow and set ${advicePath}.profile to "full" if these tools should be available${providerSuffix}.` : `Add ${advicePath}.alsoAllow: [${formatQuotedList(grants)}] if these tools should be available${providerSuffix}.`;
	return [`- ${params.profilePath}.profile is "${params.profile}" and ${uncoveredEntries.map((entry) => entry.label).join(" / ")} is configured, but configured sections no longer widen the ${params.profileKind} profile. ${advice}`];
}
function collectProfileConfiguredToolSectionScopeWarnings(params) {
	const tools = params.tools;
	const profile = (typeof tools?.profile === "string" ? tools.profile : void 0) ?? params.inheritedProfile;
	if (!profile) return [];
	const configuredEntries = [...params.includeInheritedSections && params.inheritedTools && params.inheritedPathLabel ? collectConfiguredToolSectionGrantEntries({
		tools: params.inheritedTools,
		pathLabel: params.inheritedPathLabel
	}) : [], ...collectConfiguredToolSectionGrantEntries({
		tools,
		pathLabel: params.pathLabel
	})];
	if (configuredEntries.length === 0) return [];
	const alsoAllow = Array.isArray(tools?.alsoAllow) ? tools.alsoAllow.filter((entry) => typeof entry === "string") : params.inheritedAlsoAllow;
	return collectProfileConfiguredSectionWarnings({
		configuredEntries,
		profilePolicy: mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), alsoAllow),
		profile,
		profilePath: params.pathLabel,
		profileKind: "active",
		hasAllow: hasNonEmptyStringList(tools?.allow)
	});
}
function collectByProviderConfiguredToolSectionWarnings(params) {
	const byProvider = isRecord(params.tools?.byProvider) ? params.tools.byProvider : void 0;
	if (!byProvider || params.configuredEntries.length === 0) return [];
	const inheritedByProvider = isRecord(params.inheritedTools?.byProvider) ? params.inheritedTools.byProvider : void 0;
	return Object.entries(byProvider).flatMap(([providerKey, policyValue]) => {
		const policy = isRecord(policyValue) ? policyValue : void 0;
		if (!policy) return [];
		const profile = typeof policy.profile === "string" ? policy.profile : void 0;
		if (!profile) return [];
		const inheritedPolicy = resolveInheritedProviderPolicyForPreview(inheritedByProvider, providerKey);
		const alsoAllow = readPreviewStringList(policy.alsoAllow) ?? readPreviewStringList(inheritedPolicy?.alsoAllow);
		const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), alsoAllow);
		return collectProfileConfiguredSectionWarnings({
			configuredEntries: params.configuredEntries,
			profilePolicy,
			profile,
			profilePath: `${params.pathLabel}.byProvider.${providerKey}`,
			profileKind: "provider",
			hasAllow: hasNonEmptyStringList(policy.allow)
		});
	});
}
function resolveInheritedProviderPolicyForPreview(inheritedByProvider, providerKey) {
	if (!inheritedByProvider) return;
	const normalized = normalizeToolProviderPolicyKey(providerKey);
	const slashIndex = normalized.indexOf("/");
	const modelProvider = slashIndex > 0 ? normalized.slice(0, slashIndex) : normalized;
	const modelId = slashIndex > 0 ? normalized.slice(slashIndex + 1) : void 0;
	const policy = resolveProviderToolPolicy({
		byProvider: inheritedByProvider,
		modelProvider,
		modelId
	});
	return policy && isRecord(policy) ? policy : void 0;
}
function collectInheritedByProviderConfiguredToolSectionWarnings(params) {
	const inheritedByProvider = isRecord(params.inheritedTools?.byProvider) ? params.inheritedTools.byProvider : void 0;
	if (!inheritedByProvider || params.configuredEntries.length === 0) return [];
	const overridingByProvider = isRecord(params.overridingTools?.byProvider) ? params.overridingTools.byProvider : void 0;
	const inheritedEntryForModel = resolveProviderToolPolicyEntry({
		byProvider: inheritedByProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	return Object.entries(inheritedByProvider).flatMap(([providerKey, policyValue]) => {
		if (params.modelProvider && inheritedEntryForModel?.key !== providerKey) return [];
		const inheritedPolicy = isRecord(policyValue) ? policyValue : void 0;
		if (!inheritedPolicy) return [];
		const profile = typeof inheritedPolicy.profile === "string" ? inheritedPolicy.profile : void 0;
		if (!profile) return [];
		const overridingEntry = resolveProviderToolPolicyEntry({
			byProvider: overridingByProvider,
			modelProvider: params.modelProvider,
			modelId: params.modelId
		}) ?? (isRecord(overridingByProvider?.[providerKey]) ? {
			key: providerKey,
			policy: overridingByProvider[providerKey]
		} : void 0);
		const overridingPolicy = overridingEntry?.policy;
		if (typeof overridingPolicy?.profile === "string") return [];
		const alsoAllow = readPreviewStringList(overridingPolicy?.alsoAllow) ?? readPreviewStringList(inheritedPolicy.alsoAllow);
		const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), alsoAllow);
		return collectProfileConfiguredSectionWarnings({
			configuredEntries: params.configuredEntries,
			profilePolicy,
			profile,
			profilePath: `${params.inheritedPathLabel}.byProvider.${providerKey}`,
			advicePath: `${params.overridingPathLabel}.byProvider.${overridingEntry?.key ?? providerKey}`,
			profileKind: "inherited provider",
			hasAllow: hasNonEmptyStringList(overridingPolicy?.allow)
		});
	});
}
/** Warn when configured tool sections no longer widen restrictive tool profiles. */
function collectProfileConfiguredToolSectionWarnings(cfg) {
	const warnings = [];
	const globalTools = isRecord(cfg.tools) ? cfg.tools : void 0;
	const globalAlsoAllow = Array.isArray(globalTools?.alsoAllow) ? globalTools.alsoAllow.filter((entry) => typeof entry === "string") : void 0;
	const globalProfile = typeof globalTools?.profile === "string" ? globalTools.profile : void 0;
	const globalConfiguredEntries = collectConfiguredToolSectionGrantEntries({
		tools: globalTools,
		pathLabel: "tools"
	});
	warnings.push(...collectProfileConfiguredToolSectionScopeWarnings({
		tools: globalTools,
		pathLabel: "tools"
	}), ...collectByProviderConfiguredToolSectionWarnings({
		tools: globalTools,
		pathLabel: "tools",
		configuredEntries: globalConfiguredEntries
	}));
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		const agentTools = isRecord(agent.tools) ? agent.tools : void 0;
		const agentId = typeof agent.id === "string" ? agent.id : void 0;
		const agentConfig = agentId ? resolveAgentConfig(cfg, agentId) : void 0;
		const modelRef = resolveDoctorPrimaryModelRef(cfg, agentConfig?.model);
		const agentPath = `agents.${source.kind === "entries" ? `entries.${source.key}` : `list[${source.index}]`}.tools`;
		const includeInheritedSections = agentTools !== void 0 && typeof agentTools.profile !== "string";
		const ownAgentConfiguredEntries = collectConfiguredToolSectionGrantEntries({
			tools: agentTools,
			pathLabel: agentPath
		});
		const agentConfiguredEntries = [...globalConfiguredEntries, ...ownAgentConfiguredEntries];
		warnings.push(...collectProfileConfiguredToolSectionScopeWarnings({
			tools: agentTools,
			inheritedTools: globalTools,
			pathLabel: agentPath,
			inheritedPathLabel: "tools",
			includeInheritedSections,
			inheritedProfile: globalProfile,
			inheritedAlsoAllow: globalAlsoAllow
		}), ...collectByProviderConfiguredToolSectionWarnings({
			tools: agentTools,
			inheritedTools: globalTools,
			pathLabel: agentPath,
			configuredEntries: agentConfiguredEntries
		}), ...collectInheritedByProviderConfiguredToolSectionWarnings({
			inheritedTools: globalTools,
			inheritedPathLabel: "tools",
			overridingTools: agentTools,
			overridingPathLabel: agentPath,
			configuredEntries: ownAgentConfiguredEntries,
			modelProvider: modelRef.provider,
			modelId: modelRef.model
		}));
	}
	return warnings;
}
async function resolveDoctorChannelPreviewConfig(params) {
	const [{ resolveCommandSecretRefsViaGateway }, { getConfiguredChannelsCommandSecretTargetIds }] = await Promise.all([import("./command-secret-gateway-CH-eA9Y1.mjs"), import("./command-secret-targets-BEIu23Sz.mjs")]);
	const targetIds = getConfiguredChannelsCommandSecretTargetIds(params.cfg, params.env);
	if (targetIds.size === 0) return {
		cfg: params.cfg,
		diagnostics: []
	};
	const resolved = await resolveCommandSecretRefsViaGateway({
		config: params.cfg,
		commandName: "doctor preview",
		targetIds,
		mode: "read_only_status",
		allowLocalExecSecretRefs: params.allowExec === true,
		scrubUnresolvedSecretRefs: false
	});
	return {
		cfg: resolved.resolvedConfig,
		diagnostics: resolved.diagnostics
	};
}
/** Collect info and warning notes for doctor preview mode. */
async function collectDoctorPreviewNotes(params) {
	const infoNotes = [];
	const warnings = [];
	const env = params.env ?? process.env;
	const hasChannelConfig = isRecord(params.cfg.channels);
	const hasPluginConfig = isRecord(params.cfg.plugins);
	warnings.push(...collectVisibleReplyToolPolicyWarnings(params.cfg));
	warnings.push(...collectChannelBoundMessageToolPolicyWarnings(params.cfg));
	warnings.push(...collectProfileConfiguredToolSectionWarnings(params.cfg));
	const channelPluginRuntime = await import("./channel-plugin-blockers-CsjMa5Kr.mjs");
	const channelPluginBlockerHits = channelPluginRuntime.scanConfiguredChannelPluginBlockers(params.cfg, env, params.activationSourceConfig);
	if (channelPluginBlockerHits.length > 0) warnings.push(channelPluginRuntime.collectConfiguredChannelPluginBlockerWarnings(channelPluginBlockerHits).join("\n"));
	if (hasChannelConfig) {
		const channelPreviewConfig = await resolveDoctorChannelPreviewConfig({
			cfg: params.cfg,
			env,
			allowExec: params.allowExec
		});
		warnings.push(...channelPreviewConfig.diagnostics);
		const { collectChannelDoctorPreviewWarnings } = await channelDoctorModuleLoader.load();
		const channelDoctorWarnings = await collectChannelDoctorPreviewWarnings({
			cfg: channelPreviewConfig.cfg,
			doctorFixCommand: params.doctorFixCommand,
			env
		});
		if (channelDoctorWarnings.length > 0) warnings.push(...channelDoctorWarnings);
		const { collectOpenPolicyAllowFromWarnings, maybeRepairOpenPolicyAllowFrom } = await import("./open-policy-allowfrom-CCBuRN9l.mjs");
		const allowFromScan = maybeRepairOpenPolicyAllowFrom(params.cfg);
		if (allowFromScan.changes.length > 0) warnings.push(collectOpenPolicyAllowFromWarnings({
			changes: allowFromScan.changes,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
	}
	if ((hasPluginConfig || hasChannelConfig) && params.cfg.plugins?.enabled !== false) {
		const { collectStalePluginConfigWarnings, isStalePluginAutoRepairBlocked, scanStalePluginConfig } = await import("./stale-plugin-config-C6Wo4EEa.mjs");
		const stalePluginHits = scanStalePluginConfig(params.cfg, env);
		if (stalePluginHits.length > 0) {
			const stalePluginWarnings = collectStalePluginConfigWarnings({
				hits: stalePluginHits,
				doctorFixCommand: params.doctorFixCommand,
				autoRepairBlocked: isStalePluginAutoRepairBlocked(params.cfg, env),
				surfacePreservePluginIds: VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE
			});
			if (stalePluginWarnings.length > 0) warnings.push(stalePluginWarnings.join("\n"));
		}
	}
	const { collectCodexRouteWarnings } = await import("./codex-route-warnings-CuuYZWwZ.mjs");
	warnings.push(...collectCodexRouteWarnings({
		cfg: params.cfg,
		env,
		blockedProviderPlan: params.blockedCodexProviderPlan
	}));
	if (hasPluginConfig) {
		const { collectContextEngineHostCompatibilityWarnings } = await import("./context-engine-host-compat-LkkiKEtE.mjs");
		warnings.push(...await collectContextEngineHostCompatibilityWarnings({
			cfg: params.cfg,
			doctorFixCommand: params.doctorFixCommand,
			env
		}));
	}
	if (hasSubagentAllowlistConfig(params.cfg)) {
		const { collectStaleSubagentAllowlistWarnings, scanStaleSubagentAllowlistReferences } = await import("./stale-subagent-allowlist-CJgbF-ze.mjs");
		const staleSubagentAllowlistHits = scanStaleSubagentAllowlistReferences(params.cfg);
		if (staleSubagentAllowlistHits.length > 0) warnings.push(collectStaleSubagentAllowlistWarnings({
			hits: staleSubagentAllowlistHits,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
	}
	const { collectCodexNativeAssetInfoNotes } = await import("./codex-native-assets-mkCkErQf.mjs");
	infoNotes.push(...await collectCodexNativeAssetInfoNotes({
		cfg: params.cfg,
		env
	}));
	if (hasPluginLoadPaths(params.cfg)) {
		const { collectBundledPluginLoadPathWarnings, scanBundledPluginLoadPathMigrations } = await import("./bundled-plugin-load-paths-BfbOGrmR.mjs");
		const bundledPluginLoadPathHits = scanBundledPluginLoadPathMigrations(params.cfg, env);
		if (bundledPluginLoadPathHits.length > 0) warnings.push(collectBundledPluginLoadPathWarnings({
			hits: bundledPluginLoadPathHits,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
	}
	if (hasChannelConfig) {
		const { createChannelDoctorEmptyAllowlistPolicyHooks } = await channelDoctorModuleLoader.load();
		const { scanEmptyAllowlistPolicyWarnings } = await import("./empty-allowlist-scan-C4l_r15H.mjs");
		const emptyAllowlistHooks = createChannelDoctorEmptyAllowlistPolicyHooks({
			cfg: params.cfg,
			env
		});
		const emptyAllowlistWarnings = scanEmptyAllowlistPolicyWarnings(params.cfg, {
			doctorFixCommand: params.doctorFixCommand,
			extraWarningsForAccount: emptyAllowlistHooks.extraWarningsForAccount,
			shouldSkipDefaultEmptyGroupAllowlistWarning: emptyAllowlistHooks.shouldSkipDefaultEmptyGroupAllowlistWarning
		}).filter((warning) => !channelPluginRuntime.isWarningBlockedByChannelPlugin(warning, channelPluginBlockerHits));
		if (emptyAllowlistWarnings.length > 0) {
			const { sanitizeForLog } = await import("./terminal-core/ansi.js");
			warnings.push(emptyAllowlistWarnings.map((line) => sanitizeForLog(line)).join("\n"));
		}
	}
	if (hasToolsBySenderKey(params.cfg)) {
		const { collectLegacyToolsBySenderWarnings, scanLegacyToolsBySenderKeys } = await import("./legacy-tools-by-sender-NaThfTnG.mjs");
		const toolsBySenderHits = scanLegacyToolsBySenderKeys(params.cfg);
		if (toolsBySenderHits.length > 0) warnings.push(collectLegacyToolsBySenderWarnings({
			hits: toolsBySenderHits,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
	}
	if (hasConfiguredSafeBins(params.cfg)) {
		const { collectExecSafeBinCoverageWarnings, collectExecSafeBinTrustedDirHintWarnings, scanExecSafeBinCoverage, scanExecSafeBinTrustedDirHints } = await import("./exec-safe-bins-Dd1z_SmH.mjs");
		const safeBinCoverage = scanExecSafeBinCoverage(params.cfg);
		if (safeBinCoverage.length > 0) warnings.push(collectExecSafeBinCoverageWarnings({
			hits: safeBinCoverage,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
		const safeBinTrustedDirHints = scanExecSafeBinTrustedDirHints(params.cfg);
		if (safeBinTrustedDirHints.length > 0) warnings.push(collectExecSafeBinTrustedDirHintWarnings(safeBinTrustedDirHints).join("\n"));
	}
	const { collectStaleOAuthProfileShadowWarnings, scanStaleOAuthProfileShadows } = await import("./stale-oauth-profile-shadows-DDQn60VF.mjs");
	const staleOAuthProfileShadows = await scanStaleOAuthProfileShadows({
		cfg: params.cfg,
		env
	});
	if (staleOAuthProfileShadows.length > 0) warnings.push(collectStaleOAuthProfileShadowWarnings({
		hits: staleOAuthProfileShadows,
		doctorFixCommand: params.doctorFixCommand
	}).join("\n"));
	const { collectStaleConfiguredAuthOrderWarnings } = await import("./stale-auth-order-fHc7Ifsh.mjs");
	warnings.push(...collectStaleConfiguredAuthOrderWarnings({
		cfg: params.cfg,
		doctorFixCommand: params.doctorFixCommand,
		env
	}));
	const { repairMergedGatewayOwnerProfile } = await import("./user-profiles-owner-migration-DnwdGOr2.mjs");
	warnings.push(...repairMergedGatewayOwnerProfile({
		env,
		shouldRepair: false
	}).warnings);
	return {
		infoNotes,
		warningNotes: warnings
	};
}
//#endregion
export { resolveDoctorChannelPreviewConfig as n, collectDoctorPreviewNotes as t };
