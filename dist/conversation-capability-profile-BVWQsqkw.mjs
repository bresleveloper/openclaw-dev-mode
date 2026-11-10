import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-B4OWlHAG.mjs";
import { a as collectExplicitDenylist, c as hasRestrictiveAllowPolicy, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as SANDBOX_DEFAULT_TOOL_ALLOW, t as classifyToolAgainstSandboxToolPolicy } from "./tool-policy-CGPJHOz_.mjs";
import { C as normalizeInheritedToolDenylist } from "./subagent-capabilities-l3WVTf-e.mjs";
import { n as resolveEffectiveToolPolicy, o as resolveTrustedGroupId } from "./agent-tools.policy-t04F-r_I.mjs";
import { n as resolveWorkspaceRoot } from "./workspace-dir-CBFZWemz.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-BmPXAdVs.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { n as resolveSessionPlacementSandboxToolPolicy } from "./session-placement-computer-wc2Javdz.mjs";
import { t as readOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
//#region src/agents/tools/sessions-operator-authority.ts
function captureSessionControlAuthority(prepared) {
	const invocation = readOperatorToolGatewayAuthority();
	const caller = getGatewayToolCallerIdentity()?.operatorAuthority;
	const scope = getPluginRuntimeGatewayRequestScope();
	const retained = caller ? void 0 : scope?.client?.internal?.operatorRunAuthority;
	const authority = prepared ?? caller ?? invocation?.operatorRunAuthority ?? retained;
	if (!authority) return;
	const sources = [.../* @__PURE__ */ new Set([
		authority,
		caller,
		invocation?.operatorRunAuthority,
		retained
	])].filter((source) => source !== void 0);
	const assertCurrent = composeSessionSourceAssertion([
		...sources.map((source) => composeSessionSourceAssertion([source.assertCurrent], (assertSource) => {
			assertAdmittedRunOperatorAuthority(source);
			assertSource();
			if (source.source !== authority.source) throw new Error("Session control operator source changed.");
		})),
		captureGatewayToolCallerAssertion("sessions.patch"),
		composeSessionSourceAssertion([invocation?.assertCurrent], (assertSource) => {
			invocation?.signal.throwIfAborted();
			assertSource();
		})
	], (assertSources) => {
		assertSources();
		if (retained && scope?.hasCurrentClientAuthority?.() === false) throw new Error("Session control caller authority is no longer active.");
	});
	assertCurrent();
	return {
		authority,
		assertCurrent,
		allows: (requested) => sources.every((source) => operatorScopeSatisfied(requested, source.scopes)) && (!invocation || operatorScopeSatisfied(requested, invocation.scopes)) && (!retained || operatorScopeSatisfied(requested, scope?.client?.connect.scopes ?? []))
	};
}
/** Availability only; the target guard and underlying Gateway policy still apply. */
function hasSessionControlAuthority(prepared) {
	return captureSessionControlAuthority(prepared)?.allows("operator.write") ?? false;
}
/** Rename uses the existing creator-scoped session mutation, not general session controls. */
function hasSessionRenameAuthority(prepared) {
	return captureSessionControlAuthority(prepared)?.allows("operator.sessions.write") ?? false;
}
/** Default sandbox exposure is paired with a label-only implementation, never full management. */
function prepareSandboxSessionRename(params) {
	const policy = params.policy;
	if (params.senderIsOwner !== false || !policy?.[SANDBOX_DEFAULT_TOOL_ALLOW] || policy[SANDBOX_DEFAULT_TOOL_ALLOW] !== policy.allow || !hasSessionRenameAuthority(params.authority)) return {
		policy,
		renameOnly: false
	};
	const blocked = classifyToolAgainstSandboxToolPolicy("sessions", policy);
	if (!blocked.blockedByAllow || blocked.blockedByDeny) return {
		policy,
		renameOnly: false
	};
	return {
		policy: {
			...policy,
			allow: [...policy[SANDBOX_DEFAULT_TOOL_ALLOW], "sessions"]
		},
		renameOnly: true
	};
}
//#endregion
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
/** Prepare standalone worker reads before running the shared synchronous policy. */
function prepareConversationCapabilityProfile(params) {
	return withPreparedSessionCapabilityRead(() => resolveConversationCapabilityProfile(params));
}
function resolveConversationCapabilityProfile(params) {
	const messageProvider = params.messageProvider;
	const effective = resolveEffectiveToolPolicy(params);
	const { policy: sandboxToolPolicy, renameOnly: sandboxSessionRenameOnly } = prepareSandboxSessionRename({
		policy: resolveSessionPlacementSandboxToolPolicy(params.sandboxToolPolicy, {
			runId: params.runId,
			agentId: effective.agentId
		}),
		senderIsOwner: params.senderIsOwner
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
		...params,
		subagentSessionKey,
		agentId: effective.agentId,
		messageProvider: callerContext.local ? messageProvider : callerContext.channel,
		groupId: trustedGroup.groupId,
		groupChannel: trustedGroupChannel,
		groupSpace: trustedGroupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.agentAccountId,
		senderPolicyMode: params.scheduledToolPolicy || isOwnerInternalSession ? "never" : "always",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account",
		conversationPolicy: pickSandboxToolPolicy(params.conversationToolPolicy)
	});
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = requesterPolicies;
	const profilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(effective.profile), resolveManifestToolProfileNames(params.pluginMetadataSnapshot, effective.profile));
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(effective.providerProfile), resolveManifestToolProfileNames(params.pluginMetadataSnapshot, effective.providerProfile));
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
	const inheritedToolPolicyForSpawn = requesterPolicies.inheritedToolPolicyForSpawn ?? inheritedToolPolicy;
	const inheritancePolicies = [
		profilePolicy,
		providerProfilePolicy,
		...configuredOverridePolicies,
		inheritedToolPolicyForSpawn,
		runtimeToolPolicyForInheritance
	];
	return {
		agentId: effective.agentId,
		serviceIdentity: { accountId: params.agentAccountId },
		model: {
			provider: params.modelProvider,
			id: params.modelId
		},
		conversation: {
			sessionKey: params.runSessionKey ?? params.sessionKey,
			policySessionKey: params.sessionKey,
			runSessionKey: params.runSessionKey,
			sessionId: params.sessionId,
			messageProvider,
			messageChannel: params.messageChannel,
			groupId: trustedGroup.groupId,
			groupChannel: trustedGroupChannel,
			groupSpace: trustedGroupSpace,
			spawnedBy: params.spawnedBy
		},
		sender: { isOwner: params.senderIsOwner },
		workspace: {
			workspaceRoot: resolveWorkspaceRoot(params.workspaceDir),
			runtimeRoot: resolveWorkspaceRoot(params.cwd ?? params.workspaceDir),
			spawnWorkspaceRoot: params.spawnWorkspaceDir ? resolveWorkspaceRoot(params.spawnWorkspaceDir) : void 0
		},
		policy: {
			...effective,
			sessionKey: params.sessionKey,
			subagentSessionKey,
			trustedGroup,
			profilePolicy,
			providerProfilePolicy,
			profileAlsoAllow: mergeRuntimeToolAlsoAllowlist(effective.profileAlsoAllow),
			providerProfileAlsoAllow: mergeRuntimeToolAlsoAllowlist(effective.providerProfileAlsoAllow),
			groupPolicy,
			senderPolicy,
			sandboxPolicy: sandboxToolPolicy,
			sandboxSessionRenameOnly,
			subagentPolicy,
			inheritedToolPolicy,
			inheritedToolPolicyForSpawn,
			delegatedToolPolicy: requesterPolicies.delegatedToolPolicy,
			inheritedToolPolicySource: requesterPolicies.inheritedToolPolicySource,
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
/** Prepare before flattening: duplicate nonlocal denies survive the local exception. */
function prepareDelegatedToolDenyFloor(profile, additionalDeny = []) {
	const policy = profile.policy;
	const continuation = policy.delegatedToolPolicy;
	if (!policy.agentId || policy.inheritedToolPolicySource === "sender" || policy.runtimeToolPolicyForInheritance?.allow.length === 0 || !continuation && policy.inheritancePolicies.some(hasRestrictiveAllowPolicy)) return;
	if (!continuation && !policy.agentPolicy?.deny?.length) return;
	return {
		policyAgentId: policy.agentId,
		deny: normalizeInheritedToolDenylist([...collectExplicitDenylist([
			policy.globalPolicy,
			policy.globalProviderPolicy,
			continuation ? policy.agentPolicy : void 0,
			policy.agentProviderPolicy,
			policy.groupPolicy,
			policy.senderPolicy,
			policy.sandboxPolicy,
			policy.subagentPolicy,
			continuation ? policy.inheritedToolPolicy : policy.inheritedToolPolicyForSpawn,
			policy.runtimeToolPolicyForInheritance
		]), ...additionalDeny]),
		...continuation ? { continuation: {
			requesterSessionKey: continuation.requesterSessionKey,
			targetAgentId: continuation.targetAgentId
		} } : {}
	};
}
//#endregion
export { hasSessionControlAuthority as a, captureSessionControlAuthority as i, prepareDelegatedToolDenyFloor as n, hasSessionRenameAuthority as o, resolveConversationCapabilityProfile as r, prepareSandboxSessionRename as s, prepareConversationCapabilityProfile as t };
