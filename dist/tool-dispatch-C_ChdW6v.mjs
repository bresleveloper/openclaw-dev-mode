import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { a as collectExplicitDenylist, c as hasRestrictiveAllowPolicy, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-14GRhbFd.mjs";
import { i as resolveGatewayMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-BmPXAdVs.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-CUnSsPP_.mjs";
import { t as applyToolAvailabilityDescriptions } from "./agent-tools.deferred-followup-DWhzB7Rb.mjs";
import { n as filterRequesterYieldTools } from "./openclaw-tools.requester-yield-DAWcCgh7.mjs";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-7P77gGzs.mjs";
import { i as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-BLlbTzAZ.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-S64J0n2P.mjs";
//#region src/skills/runtime/tool-dispatch.ts
/**
* Policy-enforcement seam for skill `command-dispatch: tool` invocations.
* Keep this aligned with normal tool surfaces across sender, group, sandbox,
* and subagent policy layers.
*/
async function resolveSkillDispatchTools(params, dependencies) {
	const channel = resolveGatewayMessageChannel(params.message.surface) ?? resolveGatewayMessageChannel(params.message.provider) ?? void 0;
	const { agentId: resolvedAgentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow, gatewayConfigReadAllowed } = resolveEffectiveToolPolicy({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		modelProvider: params.provider,
		modelId: params.model
	});
	const profilePolicy = resolveCoreToolProfilePolicy(profile);
	const providerProfilePolicy = resolveCoreToolProfilePolicy(providerProfile);
	const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, profileAlsoAllow);
	const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, providerProfileAlsoAllow);
	const groupId = params.sessionEntry?.groupId ?? params.groupId;
	const requesterPolicies = await withPreparedSessionCapabilityRead(() => resolveRequesterToolPolicies({
		config: params.cfg,
		sessionKey: params.sessionKey,
		subagentSessionKey: params.sessionKey,
		agentId: resolvedAgentId,
		spawnedBy: params.sessionEntry?.spawnedBy,
		messageProvider: channel,
		groupId,
		groupChannel: params.sessionEntry?.groupChannel,
		groupSpace: params.sessionEntry?.space,
		accountId: params.message.accountId,
		senderId: params.message.senderId ?? params.senderId,
		senderName: params.message.senderName,
		senderUsername: params.message.senderUsername,
		senderE164: params.message.senderE164
	}));
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = requesterPolicies;
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		agentId: resolvedAgentId,
		sessionKey: params.sessionKey,
		preparedSessionEntry: params.sessionEntry ?? null
	});
	const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
	const ownerOnlyCoreToolPolicy = !params.senderIsOwner ? { deny: [...GATEWAY_OWNER_ONLY_CORE_TOOLS] } : void 0;
	const explicitPolicyList = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy,
		groupPolicy,
		senderPolicy,
		sandboxPolicy,
		subagentPolicy,
		inheritedToolPolicy,
		ownerOnlyCoreToolPolicy
	];
	const explicitDenylist = collectExplicitDenylist(explicitPolicyList);
	const inheritedToolAllowlist = [];
	const cronCreatorToolAllowlist = [];
	const beforeToolCallHookContext = params.skillCommand ? {
		cwd: params.workspaceDir,
		workspaceDir: params.workspaceDir,
		...params.sessionEntry?.skillsSnapshot ? { skillsSnapshot: params.sessionEntry.skillsSnapshot } : {},
		skillCommand: {
			commandName: params.skillCommand.name,
			...params.skillCommand.skillFile ? { skillFile: params.skillCommand.skillFile } : {},
			skillName: params.skillCommand.skillName,
			skillSource: params.skillCommand.skillSource ?? "unknown",
			...params.skillCommand.toolName ? { toolName: params.skillCommand.toolName } : {}
		}
	} : void 0;
	const tools = await dependencies.createOpenClawToolsAsync({
		gatewayConfigReadAllowed,
		agentSessionKey: params.sessionKey,
		agentChannel: channel,
		agentAccountId: params.message.accountId,
		agentTo: params.message.originatingTo ?? params.message.to,
		agentThreadId: params.message.messageThreadId ?? void 0,
		nativeChannelId: params.message.nativeChannelId,
		agentGroupId: groupId,
		agentGroupChannel: params.sessionEntry?.groupChannel,
		agentGroupSpace: params.sessionEntry?.space,
		agentMemberRoleIds: params.message.memberRoleIds,
		agentDir: params.agentDir,
		authProfileStoreSource: params.authProfileStoreSource,
		workspaceDir: params.workspaceDir,
		config: params.cfg,
		sessionConfigSource: "runtime",
		allowGatewaySubagentBinding: true,
		sandboxed: sandboxRuntime.sandboxed,
		requesterAgentIdOverride: params.agentId,
		requesterSenderId: params.senderId,
		senderIsOwner: params.senderIsOwner,
		sessionId: params.sessionEntry?.sessionId,
		currentChannelId: params.currentChannelId,
		...beforeToolCallHookContext ? { beforeToolCallHookContext } : {},
		modelProvider: params.provider,
		modelId: params.model,
		pluginToolAllowlist: collectExplicitAllowlist(explicitPolicyList),
		pluginToolDenylist: explicitDenylist,
		cronCreatorToolAllowlist,
		inheritedToolAllowlist,
		inheritedToolDenylist: explicitDenylist,
		inheritedToolPolicySource: requesterPolicies.inheritedToolPolicySource
	});
	const policyFiltered = applyToolPolicyPipeline({
		tools,
		toolMeta: getPluginToolMeta,
		warn: logVerbose,
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
				senderPolicy,
				agentId: resolvedAgentId
			}),
			{
				policy: sandboxPolicy,
				label: "sandbox tools.allow"
			},
			{
				policy: subagentPolicy,
				label: "subagent tools.allow"
			},
			{
				policy: inheritedToolPolicy,
				label: "inherited tools"
			},
			{
				policy: ownerOnlyCoreToolPolicy,
				label: "gateway sender owner-only tools"
			}
		],
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			toolDenylist: explicitDenylist
		})
	});
	if (explicitPolicyList.some(hasRestrictiveAllowPolicy)) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, policyFiltered);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, policyFiltered, getPluginToolMeta);
	return applyToolAvailabilityDescriptions(filterRequesterYieldTools(policyFiltered, params.sessionKey));
}
//#endregion
export { resolveSkillDispatchTools };
