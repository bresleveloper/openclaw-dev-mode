import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import { r as resolveAgentConfig, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries, r as listAgentEntriesWithSource } from "./agent-roster-gkYP38su.mjs";
import { n as resolveProviderToolPolicy, r as resolveProviderToolPolicyEntry, t as normalizeToolProviderPolicyKey } from "./provider-tool-policy-CQtosRma.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { o as isToolAllowedByPolicies, s as isToolAllowedByPolicyName } from "./tool-policy-match--5jlhAPZ.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-B4OWlHAG.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import { i as listRouteBindings } from "./bindings-Cw_QSeBA.mjs";
import { r as VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-LJfAZzNH.mjs";
//#region src/routing/channel-route-targets.ts
const CHANNELS_CONFIG_META_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
function normalizeConfiguredChannelKey(raw) {
	return normalizeChatChannelId(raw) ?? normalizeLowercaseStringOrEmpty(raw);
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
	return Object.entries(channel.accounts).filter(([, value]) => !(isRecord(value) && value.enabled === false)).map(([accountId]) => normalizeAccountId(accountId)).toSorted();
}
function addTarget(byAgent, agentId, channel) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const trimmedChannel = channel.trim();
	if (!trimmedChannel) return;
	const channels = byAgent.get(normalizedAgentId) ?? /* @__PURE__ */ new Set();
	channels.add(trimmedChannel);
	byAgent.set(normalizedAgentId, channels);
}
function collectChannelRouteTargets(cfg) {
	const byAgent = /* @__PURE__ */ new Map();
	for (const binding of listRouteBindings(cfg)) addTarget(byAgent, binding.agentId, normalizeLowercaseStringOrEmpty(binding.match.channel));
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
	})).toSorted((a, b) => a.agentId.localeCompare(b.agentId));
}
//#endregion
//#region src/commands/doctor/shared/preview-message-tool-policy.ts
function resolveMessageToolAvailability(params) {
	const agentConfig = params.agentId ? resolveAgentConfig(params.cfg, params.agentId) : void 0;
	const modelRef = resolveDoctorPrimaryModelRef(params.cfg, agentConfig?.model);
	const [providerPolicy, agentProviderPolicy] = [params.globalTools?.byProvider, params.agentTools?.byProvider].map((byProvider) => resolveProviderToolPolicy({
		byProvider,
		modelProvider: modelRef.provider,
		modelId: modelRef.model
	}));
	const profilePolicy = (global, agent) => {
		const alsoAllow = Array.isArray(agent?.alsoAllow) ? agent.alsoAllow : Array.isArray(global?.alsoAllow) ? global.alsoAllow : [];
		return mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(agent?.profile ?? global?.profile), [...alsoAllow, ...params.runtimeAlsoAllow ?? []]);
	};
	return isToolAllowedByPolicies("message", [
		profilePolicy(params.globalTools, params.agentTools),
		profilePolicy(providerPolicy, agentProviderPolicy),
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
function listAgentRecords(cfg) {
	return listAgentEntriesWithSource(cfg).map(({ entry }) => entry);
}
function hasPluginLoadPaths(cfg) {
	const load = asOptionalRecord(asOptionalRecord(cfg.plugins)?.load);
	return Array.isArray(load?.paths) && load.paths.length > 0;
}
function hasSubagentAllowlistConfig(cfg) {
	if (Array.isArray(cfg.agents?.defaults?.subagents?.allowAgents)) return true;
	return listAgentRecords(cfg).some((agent) => {
		const subagents = asOptionalRecord(agent.subagents);
		return Array.isArray(subagents?.allowAgents);
	});
}
function hasSafeBins(exec) {
	const safeBins = asOptionalRecord(exec)?.safeBins;
	return Array.isArray(safeBins) && safeBins.length > 0;
}
function hasConfiguredSafeBins(cfg) {
	return hasSafeBins(cfg.tools?.exec) || listAgentRecords(cfg).some((agent) => hasSafeBins(asOptionalRecord(asOptionalRecord(agent)?.tools)?.exec));
}
function formatTargets(targets) {
	if (targets.length <= 2) return targets.join(" and ");
	return `${targets.slice(0, 2).join(", ")}, and ${targets.length - 2} more`;
}
function collectVisibleReplyToolPolicyWarnings(cfg) {
	const groupPolicy = cfg.messages?.groupChat?.visibleReplies;
	const globalPolicy = cfg.messages?.visibleReplies;
	const policies = [];
	if ((groupPolicy || globalPolicy) === "message_tool") policies.push({
		path: groupPolicy ? "messages.groupChat.visibleReplies" : "messages.visibleReplies",
		fallback: "visible"
	});
	if (globalPolicy === "message_tool" && groupPolicy) policies.push({
		path: "messages.visibleReplies",
		fallback: "direct-chat"
	});
	const targets = policies.length > 0 ? collectUnavailableSourceReplyTargets(cfg) : [];
	return targets.length === 0 ? [] : policies.map(({ path, fallback }) => `- ${path} is set to "message_tool", but the message tool is unavailable for ${formatTargets(targets)}; OpenClaw falls back to automatic ${fallback} replies, so normal replies may post to the source chat. Enable the message tool or set ${path} to "automatic".`);
}
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
	grants: ["exec", "process"]
}, {
	key: "fs",
	grants: [
		"read",
		"write",
		"edit"
	]
}];
function collectConfiguredToolSectionGrantEntries(params) {
	return PROFILE_CONFIGURED_TOOL_SECTIONS.flatMap((section) => isRecord(params.tools?.[section.key]) ? [{
		label: `${params.pathLabel}.${section.key}`,
		grants: [...section.grants]
	}] : []);
}
function readPreviewStringList(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : void 0;
}
function collectProfileConfiguredSectionWarnings(params) {
	const alsoAllow = readPreviewStringList(params.policy?.alsoAllow) ?? readPreviewStringList(params.inheritedPolicy?.alsoAllow);
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(params.profile), alsoAllow);
	if (!profilePolicy) return [];
	const uncoveredEntries = params.configuredEntries.map((entry) => ({
		...entry,
		grants: entry.grants.filter((toolName) => !isToolAllowedByPolicyName(toolName, profilePolicy))
	})).filter((entry) => entry.grants.length > 0);
	if (uncoveredEntries.length === 0) return [];
	const grants = [...new Set(uncoveredEntries.flatMap((entry) => entry.grants))];
	const advicePath = params.advicePath ?? params.profilePath;
	const providerSuffix = params.profileKind === "active" ? "" : " for that provider";
	const allow = params.policy?.allow;
	const advice = Array.isArray(allow) && allow.some((entry) => typeof entry === "string") ? `Add these grants to ${advicePath}.allow and set ${advicePath}.profile to "full" if these tools should be available${providerSuffix}.` : `Add ${advicePath}.alsoAllow: [${grants.map((value) => `"${value}"`).join(", ")}] if these tools should be available${providerSuffix}.`;
	return [`- ${params.profilePath}.profile is "${params.profile}" and ${uncoveredEntries.map((entry) => entry.label).join(" / ")} is configured, but configured sections no longer widen the ${params.profileKind} profile. ${advice}`];
}
function collectProfileConfiguredToolSectionScopeWarnings(params) {
	const tools = params.tools;
	const profile = typeof tools?.profile === "string" ? tools.profile : params.inheritedTools?.profile;
	if (typeof profile !== "string" || !profile) return [];
	const configuredEntries = [...tools !== void 0 && typeof tools?.profile !== "string" && params.inheritedTools ? collectConfiguredToolSectionGrantEntries({
		tools: params.inheritedTools,
		pathLabel: "tools"
	}) : [], ...collectConfiguredToolSectionGrantEntries({
		tools,
		pathLabel: params.pathLabel
	})];
	if (configuredEntries.length === 0) return [];
	return collectProfileConfiguredSectionWarnings({
		configuredEntries,
		policy: tools,
		inheritedPolicy: params.inheritedTools,
		profile,
		profilePath: params.pathLabel,
		profileKind: "active"
	});
}
function collectByProviderConfiguredToolSectionWarnings(params) {
	const byProvider = asOptionalRecord(params.tools?.byProvider);
	if (!byProvider || params.configuredEntries.length === 0) return [];
	const inheritedByProvider = asOptionalRecord(params.inheritedTools?.byProvider);
	return Object.entries(byProvider).flatMap(([providerKey, policyValue]) => {
		const policy = asOptionalRecord(policyValue);
		const profile = policy?.profile;
		if (typeof profile !== "string" || !profile) return [];
		const inheritedPolicy = resolveInheritedProviderPolicyForPreview(inheritedByProvider, providerKey);
		return collectProfileConfiguredSectionWarnings({
			configuredEntries: params.configuredEntries,
			policy,
			inheritedPolicy,
			profile,
			profilePath: `${params.pathLabel}.byProvider.${providerKey}`,
			profileKind: "provider"
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
	const inheritedByProvider = asOptionalRecord(params.inheritedTools?.byProvider);
	if (!inheritedByProvider || params.configuredEntries.length === 0) return [];
	const overridingByProvider = asOptionalRecord(params.overridingTools?.byProvider);
	const inheritedEntryForModel = resolveProviderToolPolicyEntry({
		byProvider: inheritedByProvider,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	return Object.entries(inheritedByProvider).flatMap(([providerKey, policyValue]) => {
		if (params.modelProvider && inheritedEntryForModel?.key !== providerKey) return [];
		const inheritedPolicy = asOptionalRecord(policyValue);
		const profile = inheritedPolicy?.profile;
		if (typeof profile !== "string" || !profile) return [];
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
		return collectProfileConfiguredSectionWarnings({
			configuredEntries: params.configuredEntries,
			policy: overridingPolicy,
			inheritedPolicy,
			profile,
			profilePath: `tools.byProvider.${providerKey}`,
			advicePath: `${params.overridingPathLabel}.byProvider.${overridingEntry?.key ?? providerKey}`,
			profileKind: "inherited provider"
		});
	});
}
function collectProfileConfiguredToolSectionWarnings(cfg) {
	const warnings = [];
	const globalTools = asOptionalRecord(cfg.tools);
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
		const agentTools = asOptionalRecord(agent.tools);
		const agentId = typeof agent.id === "string" ? agent.id : void 0;
		const agentConfig = agentId ? resolveAgentConfig(cfg, agentId) : void 0;
		const modelRef = resolveDoctorPrimaryModelRef(cfg, agentConfig?.model);
		const agentPath = `agents.${source.kind === "entries" ? `entries.${source.key}` : `list[${source.index}]`}.tools`;
		const ownAgentConfiguredEntries = collectConfiguredToolSectionGrantEntries({
			tools: agentTools,
			pathLabel: agentPath
		});
		const agentConfiguredEntries = [...globalConfiguredEntries, ...ownAgentConfiguredEntries];
		warnings.push(...collectProfileConfiguredToolSectionScopeWarnings({
			tools: agentTools,
			inheritedTools: globalTools,
			pathLabel: agentPath
		}), ...collectByProviderConfiguredToolSectionWarnings({
			tools: agentTools,
			inheritedTools: globalTools,
			pathLabel: agentPath,
			configuredEntries: agentConfiguredEntries
		}), ...collectInheritedByProviderConfiguredToolSectionWarnings({
			inheritedTools: globalTools,
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
	const [{ resolveCommandSecretRefsViaGateway }, { getConfiguredChannelsCommandSecretTargetIds }] = await Promise.all([import("./command-secret-gateway-Ch9vgnBw.mjs"), import("./command-secret-targets-BF6Ekt_4.mjs")]);
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
async function collectDoctorPreviewNotes(params) {
	if (!isRecord(params.cfg)) throw new TypeError("Doctor config preview requires an object");
	const infoNotes = [];
	const warnings = [];
	const appendScanWarnings = (hits, collect) => {
		if (hits.length > 0) warnings.push(collect({
			hits,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
	};
	const env = params.env ?? process.env;
	const hasChannelConfig = isRecord(params.cfg.channels);
	const hasPluginConfig = isRecord(params.cfg.plugins);
	warnings.push(...collectVisibleReplyToolPolicyWarnings(params.cfg));
	warnings.push(...collectChannelBoundMessageToolPolicyWarnings(params.cfg));
	warnings.push(...collectProfileConfiguredToolSectionWarnings(params.cfg));
	const channelPluginRuntime = await import("./channel-plugin-blockers-DiuofGtH.mjs");
	const channelPluginBlockerHits = channelPluginRuntime.scanConfiguredChannelPluginBlockers(params.cfg, env, params.activationSourceConfig);
	if (channelPluginBlockerHits.length > 0) warnings.push(channelPluginRuntime.collectConfiguredChannelPluginBlockerWarnings(channelPluginBlockerHits).join("\n"));
	if (hasChannelConfig) {
		const channelPreviewConfig = await resolveDoctorChannelPreviewConfig({
			cfg: params.cfg,
			env,
			allowExec: params.allowExec
		});
		warnings.push(...channelPreviewConfig.diagnostics);
		const { collectChannelDoctorPreviewWarnings } = await import("./channel-doctor-CD3cyZRn.mjs");
		const channelDoctorWarnings = await collectChannelDoctorPreviewWarnings({
			cfg: channelPreviewConfig.cfg,
			doctorFixCommand: params.doctorFixCommand,
			env
		});
		warnings.push(...channelDoctorWarnings);
		const { collectOpenPolicyAllowFromWarnings, maybeRepairOpenPolicyAllowFrom } = await import("./open-policy-allowfrom-DeuqZD-9.mjs");
		const allowFromScan = maybeRepairOpenPolicyAllowFrom(params.cfg);
		if (allowFromScan.changes.length > 0) warnings.push(collectOpenPolicyAllowFromWarnings({
			changes: allowFromScan.changes,
			doctorFixCommand: params.doctorFixCommand
		}).join("\n"));
	}
	if ((hasPluginConfig || hasChannelConfig) && (!isRecord(params.cfg.plugins) || params.cfg.plugins.enabled !== false)) {
		const { collectStalePluginConfigWarnings, isStalePluginAutoRepairBlocked, scanStalePluginConfig } = await import("./stale-plugin-config-8_sOYPIB.mjs");
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
	const { collectCodexRouteWarnings } = await import("./codex-route-warnings-Hv8e33on.mjs");
	warnings.push(...collectCodexRouteWarnings({
		cfg: params.cfg,
		env,
		blockedProviderPlan: params.blockedCodexProviderPlan
	}));
	if (hasPluginConfig) {
		const { collectContextEngineHostCompatibilityWarnings } = await import("./context-engine-host-compat-D0vrCfKC.mjs");
		warnings.push(...await collectContextEngineHostCompatibilityWarnings({
			cfg: params.cfg,
			doctorFixCommand: params.doctorFixCommand,
			env
		}));
	}
	if (hasSubagentAllowlistConfig(params.cfg)) {
		const { collectStaleSubagentAllowlistWarnings, scanStaleSubagentAllowlistReferences } = await import("./stale-subagent-allowlist-BmVQn0cw.mjs");
		appendScanWarnings(scanStaleSubagentAllowlistReferences(params.cfg), collectStaleSubagentAllowlistWarnings);
	}
	const { collectCodexNativeAssetInfoNotes } = await import("./codex-native-assets-D6_D5Vim.mjs");
	infoNotes.push(...await collectCodexNativeAssetInfoNotes({
		cfg: params.cfg,
		env
	}));
	if (hasPluginLoadPaths(params.cfg)) {
		const { collectBundledPluginLoadPathWarnings, scanBundledPluginLoadPathMigrations } = await import("./bundled-plugin-load-paths-CnN7-jHv.mjs");
		appendScanWarnings(scanBundledPluginLoadPathMigrations(params.cfg, env), collectBundledPluginLoadPathWarnings);
	}
	if (hasChannelConfig) {
		const { createChannelDoctorEmptyAllowlistPolicyHooks } = await import("./channel-doctor-CD3cyZRn.mjs");
		const { scanEmptyAllowlistPolicyWarnings } = await import("./empty-allowlist-scan-DNfLlZcV.mjs");
		const emptyAllowlistHooks = createChannelDoctorEmptyAllowlistPolicyHooks({
			cfg: params.cfg,
			env
		});
		const emptyAllowlistWarnings = (await scanEmptyAllowlistPolicyWarnings(params.cfg, {
			doctorFixCommand: params.doctorFixCommand,
			extraWarningsForAccount: emptyAllowlistHooks.extraWarningsForAccount,
			shouldSkipDefaultEmptyGroupAllowlistWarning: emptyAllowlistHooks.shouldSkipDefaultEmptyGroupAllowlistWarning
		})).filter((warning) => !channelPluginRuntime.isWarningBlockedByChannelPlugin(warning, channelPluginBlockerHits));
		if (emptyAllowlistWarnings.length > 0) {
			const { sanitizeForLog } = await import("./terminal-core/ansi.js");
			warnings.push(emptyAllowlistWarnings.map((line) => sanitizeForLog(line)).join("\n"));
		}
	}
	if (hasConfiguredSafeBins(params.cfg)) {
		const { collectExecSafeBinCoverageWarnings, collectExecSafeBinTrustedDirHintWarnings, scanExecSafeBinCoverage, scanExecSafeBinTrustedDirHints } = await import("./exec-safe-bins-DMggCI78.mjs");
		appendScanWarnings(scanExecSafeBinCoverage(params.cfg), collectExecSafeBinCoverageWarnings);
		const safeBinTrustedDirHints = scanExecSafeBinTrustedDirHints(params.cfg);
		if (safeBinTrustedDirHints.length > 0) warnings.push(collectExecSafeBinTrustedDirHintWarnings(safeBinTrustedDirHints).join("\n"));
	}
	const { collectStaleOAuthProfileShadowWarnings, scanStaleOAuthProfileShadows } = await import("./stale-oauth-profile-shadows-CQNWMzFc.mjs");
	const { hits: staleOAuthProfileShadows, warnings: staleOAuthWarnings } = await scanStaleOAuthProfileShadows({
		cfg: params.cfg,
		env
	});
	appendScanWarnings(staleOAuthProfileShadows, collectStaleOAuthProfileShadowWarnings);
	warnings.push(...staleOAuthWarnings);
	const { collectStaleConfiguredAuthOrderWarnings } = await import("./stale-auth-order-CQ9_6zrH.mjs");
	warnings.push(...collectStaleConfiguredAuthOrderWarnings({
		cfg: params.cfg,
		doctorFixCommand: params.doctorFixCommand,
		env
	}));
	const { repairMergedGatewayOwnerProfile } = await import("./user-profiles-owner-migration-DxdLV2PD.mjs");
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
