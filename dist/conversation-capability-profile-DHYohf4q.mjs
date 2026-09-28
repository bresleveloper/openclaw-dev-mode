import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-auQCQEhM.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-Dp4rlIlG.mjs";
import { a as collectExplicitDenylist, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as resolveEffectiveToolPolicy, o as resolveTrustedGroupId, s as sessionKeyNamesGroupConversation } from "./agent-tools.policy-L6QuLbuq.mjs";
import { n as resolveWorkspaceRoot } from "./workspace-dir-D87-cXVl.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-DsXmfT22.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-DRmktKAO.mjs";
import { n as resolveSessionPlacementSandboxToolPolicy } from "./session-placement-computer-Cmj5f90u.mjs";
//#region src/agents/conversation-capability-profile.ts
/**
* Resolves the conversation-scoped runtime facts that tool and harness policy
* hot paths share. Keep this internal: it prepares existing config/state, not a
* new public access-profile config surface.
*/
function resolveManifestToolProfileNames(snapshot, profile) {
	if (!profile) return [];
	return uniqueStrings((snapshot?.plugins ?? []).flatMap((plugin) => (plugin.contracts?.tools ?? []).filter((toolName) => plugin.toolMetadata?.[toolName]?.profiles?.some((candidate) => candidate === profile))));
}
function resolveConversationCapabilityProfile(params) {
	const messageProvider = params.messageProvider;
	const effective = resolveEffectiveToolPolicy({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const sandboxToolPolicy = resolveSessionPlacementSandboxToolPolicy(params.sandboxToolPolicy, {
		runId: params.runId,
		agentId: effective.agentId
	});
	const trustedGroup = resolveTrustedGroupId({
		sessionKey: params.sessionKey,
		spawnedBy: params.spawnedBy,
		groupId: params.groupId
	});
	const trustedGroupChannel = trustedGroup.dropped ? null : params.groupChannel;
	const trustedGroupSpace = trustedGroup.dropped ? null : params.groupSpace;
	const isOwnerInternalSession = params.senderIsOwner === true && normalizeMessageChannel(messageProvider ?? params.messageChannel) === "webchat";
	const subagentSessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const callerContext = resolveScheduledToolCallerContext({
		scheduledToolPolicy: params.scheduledToolPolicy,
		channel: messageProvider ?? void 0
	});
	const requesterPolicies = resolveRequesterToolPolicies({
		config: params.config,
		sessionKey: params.sessionKey,
		subagentSessionKey,
		preparedSessionEntry: params.preparedSessionEntry,
		agentId: effective.agentId,
		spawnedBy: params.spawnedBy,
		messageProvider: callerContext.local ? messageProvider : callerContext.channel,
		groupId: trustedGroup.groupId,
		groupChannel: trustedGroupChannel,
		groupSpace: trustedGroupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.agentAccountId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		senderPolicyMode: params.scheduledToolPolicy || isOwnerInternalSession ? "never" : "always",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account",
		conversationPolicy: pickSandboxToolPolicy(params.conversationToolPolicy)
	});
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = requesterPolicies;
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.profile), resolveManifestToolProfileNames(params.pluginMetadataSnapshot, effective.profile));
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.providerProfile), resolveManifestToolProfileNames(params.pluginMetadataSnapshot, effective.providerProfile));
	const configuredOverridePolicies = [
		effective.globalPolicy,
		effective.globalProviderPolicy,
		effective.agentPolicy,
		effective.agentProviderPolicy,
		groupPolicy,
		senderPolicy,
		sandboxToolPolicy,
		subagentPolicy
	];
	const runtimeToolPolicy = params.runtimeToolAllowlist ? { allow: params.runtimeToolAllowlist } : void 0;
	const runtimeToolPolicyForInheritance = params.inheritRuntimeToolAllowlist === true ? runtimeToolPolicy : void 0;
	const runtimeToolAlsoAllowlist = uniqueStrings((params.runtimePluginToolGrant?.toolNames ?? []).map((entry) => entry.trim()).filter(Boolean));
	const mergeRuntimeToolAlsoAllowlist = (configured) => {
		const merged = uniqueStrings([...configured ?? [], ...runtimeToolAlsoAllowlist]);
		return merged.length > 0 ? merged : void 0;
	};
	const explicitOverridePolicies = [...configuredOverridePolicies, runtimeToolPolicy];
	const explicitToolAllowlistPolicies = [
		profilePolicy,
		providerProfilePolicy,
		...configuredOverridePolicies,
		inheritedToolPolicy,
		runtimeToolPolicy
	];
	const inheritancePolicies = [
		profilePolicy,
		providerProfilePolicy,
		...configuredOverridePolicies,
		inheritedToolPolicy,
		runtimeToolPolicyForInheritance
	];
	return {
		agentId: effective.agentId,
		serviceIdentity: {
			agentId: effective.agentId,
			agentDir: params.agentDir,
			accountId: params.agentAccountId,
			runId: params.runId,
			sessionId: params.sessionId
		},
		model: {
			provider: params.modelProvider,
			id: params.modelId,
			api: params.modelApi,
			contextWindowTokens: params.modelContextWindowTokens,
			hasVision: params.modelHasVision
		},
		conversation: {
			scope: resolveConversationScope({
				chatType: params.chatType,
				sessionKey: params.sessionKey,
				runSessionKey: params.runSessionKey,
				trustedGroup,
				groupChannel: trustedGroupChannel,
				groupSpace: trustedGroupSpace
			}),
			chatType: normalizeChatType(params.chatType),
			sessionKey: params.runSessionKey ?? params.sessionKey,
			policySessionKey: params.sessionKey,
			runSessionKey: params.runSessionKey,
			sessionId: params.sessionId,
			messageProvider,
			messageChannel: params.messageChannel,
			messageTo: params.messageTo,
			messageThreadId: params.messageThreadId,
			currentChannelId: params.currentChannelId,
			currentMessagingTarget: params.currentMessagingTarget,
			currentThreadTs: params.currentThreadTs,
			currentMessageId: params.currentMessageId,
			groupId: trustedGroup.groupId,
			groupChannel: trustedGroupChannel,
			groupSpace: trustedGroupSpace,
			memberRoleIds: params.memberRoleIds,
			spawnedBy: params.spawnedBy
		},
		sender: {
			id: params.senderId,
			name: params.senderName,
			username: params.senderUsername,
			e164: params.senderE164,
			isOwner: params.senderIsOwner
		},
		workspace: {
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			spawnWorkspaceDir: params.spawnWorkspaceDir,
			workspaceRoot: resolveWorkspaceRoot(params.workspaceDir),
			runtimeRoot: resolveWorkspaceRoot(params.cwd ?? params.workspaceDir),
			spawnWorkspaceRoot: params.spawnWorkspaceDir ? resolveWorkspaceRoot(params.spawnWorkspaceDir) : void 0,
			instructionRoot: params.agentDir ?? params.workspaceDir,
			isCanonicalWorkspace: params.isCanonicalWorkspace
		},
		instructions: {
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			promptMode: params.promptMode,
			isCanonicalWorkspace: params.isCanonicalWorkspace
		},
		skills: { snapshot: params.skillsSnapshot },
		policy: {
			agentId: effective.agentId,
			sessionKey: params.sessionKey,
			subagentSessionKey,
			trustedGroup,
			profile: effective.profile,
			providerProfile: effective.providerProfile,
			gatewayConfigReadAllowed: effective.gatewayConfigReadAllowed,
			profilePolicy,
			providerProfilePolicy,
			profileAlsoAllow: mergeRuntimeToolAlsoAllowlist(effective.profileAlsoAllow),
			providerProfileAlsoAllow: mergeRuntimeToolAlsoAllowlist(effective.providerProfileAlsoAllow),
			globalPolicy: effective.globalPolicy,
			globalProviderPolicy: effective.globalProviderPolicy,
			agentPolicy: effective.agentPolicy,
			agentProviderPolicy: effective.agentProviderPolicy,
			groupPolicy,
			senderPolicy,
			sandboxPolicy: sandboxToolPolicy,
			subagentPolicy,
			inheritedToolPolicy,
			delegated: requesterPolicies.delegated,
			requesterPolicySource: requesterPolicies.requesterPolicySource,
			runtimeToolPolicyForInheritance,
			inheritancePolicies,
			explicitToolAllowlist: collectExplicitAllowlist(explicitToolAllowlistPolicies),
			explicitToolOverrideAllowlist: collectExplicitAllowlist(explicitOverridePolicies),
			explicitToolDenylist: collectExplicitDenylist(explicitToolAllowlistPolicies),
			runtimePluginToolGrant: params.runtimePluginToolGrant
		}
	};
}
function resolveConversationScope(params) {
	const chatType = normalizeChatType(params.chatType);
	if (chatType === "direct") return "direct";
	if (chatType === "group" || chatType === "channel") return "shared";
	if (sessionKeyNamesGroupConversation(params.runSessionKey) || sessionKeyNamesGroupConversation(params.sessionKey)) return "shared";
	if (params.trustedGroup.dropped) return "unknown";
	return params.trustedGroup.groupId?.trim() || params.groupChannel?.trim() || params.groupSpace?.trim() ? "shared" : "unknown";
}
//#endregion
export { resolveConversationCapabilityProfile as t };
