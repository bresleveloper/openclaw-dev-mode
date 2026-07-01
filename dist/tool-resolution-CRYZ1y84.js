import "./agent-scope-CDZXADgT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as isDevMode } from "./globals-BWmHKFNH.js";
import { a as logWarn } from "./logger-p_Dm5cGu.js";
import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy, h as resolveToolProfilePolicy, i as collectExplicitAllowlist, l as replaceWithEffectiveToolAllowlist, s as hasRestrictiveAllowPolicy } from "./tool-policy-Cm3NCEHp.js";
import { o as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-BHXzkIhw.js";
import { a as resolveInheritedToolPolicyForSession, i as resolveGroupToolPolicy, o as resolveSubagentToolPolicyForSession, r as resolveEffectiveToolPolicy } from "./agent-tools.policy-CPsCsTmX.js";
import { i as getPluginToolMeta } from "./tools-DG6VDQeD.js";
import { d as replaceWithEffectiveCronCreatorToolAllowlist, t as createOpenClawTools } from "./openclaw-tools-CHWXpPwX.js";
import { n as buildDefaultToolPolicyPipelineSteps, r as buildDeclaredToolAllowlistContext, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-CWzVRDpX.js";
import { n as GATEWAY_OWNER_ONLY_CORE_TOOLS, t as DEFAULT_GATEWAY_HTTP_TOOL_DENY } from "./dangerous-tools-1CBnzkwG.js";
//#region src/gateway/tool-resolution.ts
/** Resolve the tools visible to a gateway caller after agent, channel, and surface policy. */
function resolveGatewayScopedTools(params) {
	const { agentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: params.cfg,
		sessionKey: params.sessionKey
	});
	const profilePolicy = resolveToolProfilePolicy(profile);
	const providerProfilePolicy = resolveToolProfilePolicy(providerProfile);
	const gatewayRequestedTools = params.gatewayRequestedTools ?? [];
	const messageProvider = params.messageProvider?.trim().toLowerCase();
	const sourceReplyDeliveryMode = params.sourceReplyDeliveryMode ?? (params.inboundEventKind === "room_event" && messageProvider !== "webchat" ? "message_tool_only" : void 0);
	const runtimeAlsoAllow = sourceReplyDeliveryMode === "message_tool_only" ? ["message"] : [];
	const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, [
		...profileAlsoAllow ?? [],
		...gatewayRequestedTools,
		...runtimeAlsoAllow
	]);
	const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, [
		...providerProfileAlsoAllow ?? [],
		...gatewayRequestedTools,
		...runtimeAlsoAllow
	]);
	const groupPolicy = resolveGroupToolPolicy({
		config: params.cfg,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider,
		accountId: params.accountId ?? null
	});
	const subagentStore = resolveSubagentCapabilityStore(params.sessionKey, { cfg: params.cfg });
	const subagentPolicy = isSubagentEnvelopeSession(params.sessionKey, {
		cfg: params.cfg,
		store: subagentStore
	}) ? resolveSubagentToolPolicyForSession(params.cfg, params.sessionKey, { store: subagentStore }) : void 0;
	const inheritedToolPolicy = resolveInheritedToolPolicyForSession(params.cfg, params.sessionKey, { store: subagentStore });
	const excludedToolNames = params.excludeToolNames ? Array.from(params.excludeToolNames) : [];
	const surface = params.surface ?? "http";
	const gatewayToolsCfg = params.cfg.gateway?.tools;
	const defaultGatewayDeny = surface === "http" ? DEFAULT_GATEWAY_HTTP_TOOL_DENY.filter((name) => !gatewayToolsCfg?.allow?.includes(name)) : [];
	const ownerOnlyGatewayDeny = isDevMode() ? [] : params.senderIsOwner === false || surface === "http" && params.senderIsOwner !== true ? [...GATEWAY_OWNER_ONLY_CORE_TOOLS] : [];
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId ?? resolveDefaultAgentId(params.cfg));
	const explicitDenylist = collectExplicitDenylist([
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy,
		groupPolicy,
		subagentPolicy,
		inheritedToolPolicy,
		defaultGatewayDeny.length > 0 ? { deny: defaultGatewayDeny } : void 0,
		ownerOnlyGatewayDeny.length > 0 ? { deny: ownerOnlyGatewayDeny } : void 0,
		Array.isArray(gatewayToolsCfg?.deny) ? { deny: gatewayToolsCfg.deny } : void 0
	]);
	const inheritedToolDenylist = [...explicitDenylist];
	const inheritedToolAllowlist = [];
	const cronCreatorToolAllowlist = [];
	const shouldInheritEffectiveToolAllowlist = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy,
		groupPolicy,
		subagentPolicy,
		inheritedToolPolicy,
		gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0
	].some(hasRestrictiveAllowPolicy);
	const shouldCaptureCronCreatorToolAllowlist = shouldInheritEffectiveToolAllowlist || explicitDenylist.length > 0 || excludedToolNames.length > 0;
	const policyFiltered = applyToolPolicyPipeline({
		tools: createOpenClawTools({
			agentSessionKey: params.sessionKey,
			agentChannel: params.messageProvider ?? void 0,
			agentAccountId: params.accountId,
			inboundEventKind: params.inboundEventKind,
			sourceReplyDeliveryMode,
			agentTo: params.agentTo,
			agentThreadId: params.agentThreadId,
			currentChannelId: params.currentChannelId ?? params.agentTo,
			currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
			currentMessageId: params.currentMessageId,
			currentInboundAudio: params.currentInboundAudio,
			sessionId: params.sessionId,
			onYield: params.onYield,
			requireExplicitMessageTarget: params.requireExplicitMessageTarget,
			senderIsOwner: params.senderIsOwner,
			allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
			allowMediaInvokeCommands: params.allowMediaInvokeCommands,
			disablePluginTools: params.disablePluginTools,
			wrapBeforeToolCallHook: false,
			config: params.cfg,
			workspaceDir,
			pluginToolAllowlist: collectExplicitAllowlist([
				profilePolicy,
				providerProfilePolicy,
				globalPolicy,
				globalProviderPolicy,
				agentPolicy,
				agentProviderPolicy,
				groupPolicy,
				subagentPolicy,
				inheritedToolPolicy,
				gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0
			]),
			pluginToolDenylist: explicitDenylist,
			cronCreatorToolAllowlist: shouldCaptureCronCreatorToolAllowlist ? cronCreatorToolAllowlist : void 0,
			inheritedToolAllowlist,
			inheritedToolDenylist
		}),
		toolMeta: (tool) => getPluginToolMeta(tool),
		warn: logWarn,
		steps: [
			...buildDefaultToolPolicyPipelineSteps({
				profilePolicy: profilePolicyWithAlsoAllow,
				profile,
				profileUnavailableCoreWarningAllowlist: profilePolicy?.allow,
				providerProfilePolicy: providerProfilePolicyWithAlsoAllow,
				providerProfile,
				providerProfileUnavailableCoreWarningAllowlist: providerProfilePolicy?.allow,
				globalPolicy,
				globalProviderPolicy,
				agentPolicy,
				agentProviderPolicy,
				groupPolicy,
				agentId
			}),
			{
				policy: subagentPolicy,
				label: "subagent tools.allow"
			},
			{
				policy: inheritedToolPolicy,
				label: "inherited tools"
			}
		],
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.cfg,
			workspaceDir,
			toolDenylist: explicitDenylist
		})
	});
	const gatewayDenySet = new Set([
		...defaultGatewayDeny,
		...ownerOnlyGatewayDeny,
		...Array.isArray(gatewayToolsCfg?.deny) ? gatewayToolsCfg.deny : [],
		...excludedToolNames
	]);
	const tools = policyFiltered.filter((tool) => !gatewayDenySet.has(tool.name));
	if (shouldInheritEffectiveToolAllowlist) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, tools);
	if (shouldCaptureCronCreatorToolAllowlist) replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, tools, (tool) => getPluginToolMeta(tool));
	return {
		agentId,
		tools
	};
}
//#endregion
export { resolveGatewayScopedTools as t };
