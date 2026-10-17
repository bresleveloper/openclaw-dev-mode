import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-BO1puJQ0.mjs";
import { a as collectExplicitDenylist, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { a as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-DWr-fdGt.mjs";
import { i as SANDBOX_DEFAULT_TOOL_ALLOW, t as classifyToolAgainstSandboxToolPolicy } from "./tool-policy-eD9SQrK2.mjs";
import { n as resolveEffectiveToolPolicy, o as resolveTrustedGroupId } from "./agent-tools.policy-XJMKA8K7.mjs";
import { n as resolveWorkspaceRoot } from "./workspace-dir-CevXWOdg.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-DIo-5B5v.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-CR7_5ABm.mjs";
import { n as resolveSessionPlacementSandboxToolPolicy } from "./session-placement-computer-Bem5hZb0.mjs";
import { t as readOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
//#region src/agents/tools/sessions-operator-authority.ts
function captureSessionControlAuthority(prepared) {
	const invocation = readOperatorToolGatewayAuthority();
	const caller = getGatewayToolCallerIdentity()?.operatorAuthority;
	const scope = getPluginRuntimeGatewayRequestScope();
	const retained = scope?.client?.internal?.operatorRunAuthority;
	const authority = prepared ?? caller ?? invocation?.operatorRunAuthority ?? retained;
	if (!authority) return;
	const sources = [.../* @__PURE__ */ new Set([
		authority,
		caller,
		invocation?.operatorRunAuthority,
		retained
	])].filter((source) => source !== void 0);
	const assertCallerCurrent = captureGatewayToolCallerAssertion();
	const assertCurrent = () => {
		for (const source of sources) {
			assertAdmittedRunOperatorAuthority(source);
			source.assertCurrent();
			if (source.source !== authority.source) throw new Error("Session control operator source changed.");
		}
		assertCallerCurrent?.("sessions.patch");
		invocation?.signal.throwIfAborted();
		invocation?.assertCurrent?.();
		if (retained && scope?.hasCurrentClientAuthority?.() === false) throw new Error("Session control caller authority is no longer active.");
	};
	assertCurrent();
	return {
		authority,
		assertCurrent,
		allows: (requested) => sources.every((source) => operatorScopeSatisfied(requested, source.scopes)) && (!invocation || operatorScopeSatisfied(requested, invocation.scopes)) && (!retained || operatorScopeSatisfied(requested, scope?.client?.connect.scopes ?? []))
	};
}
/** Resolve the original host-issued source without upgrading an insufficient scope. */
function readSessionControlAuthority(prepared) {
	return captureSessionControlAuthority(prepared)?.authority;
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
	const inheritancePolicies = [
		profilePolicy,
		providerProfilePolicy,
		...configuredOverridePolicies,
		inheritedToolPolicy,
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
//#endregion
export { prepareSandboxSessionRename as a, hasSessionRenameAuthority as i, captureSessionControlAuthority as n, readSessionControlAuthority as o, hasSessionControlAuthority as r, resolveConversationCapabilityProfile as t };
