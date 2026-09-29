import { d as resolveToolProfilePolicy } from "./tool-policy-shared-auQCQEhM.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { n as resolveEffectiveToolPolicy, r as resolveGroupToolPolicy } from "./agent-tools.policy-CIWGcFBI.mjs";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-69NyFacf.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-D5SSXPUb.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-DRmktKAO.mjs";
//#region src/agents/web-search-tool-policy.ts
/** Resolves current and sender-independent policy for the managed web_search tool. */
function resolveWebSearchToolPolicy(params) {
	if (params.webSearchEnabled === false) return {
		allowed: false,
		persistentAllowed: false
	};
	const { agentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(providerProfile), providerProfileAlsoAllow);
	const callerContext = resolveScheduledToolCallerContext({
		scheduledToolPolicy: params.scheduledToolPolicy,
		channel: params.messageProvider
	});
	const groupPolicyParams = {
		config: params.config,
		sessionKey: params.scheduledToolPolicy?.ownerSessionKey ?? params.sessionKey,
		spawnedBy: params.spawnedBy,
		messageProvider: callerContext.local ? params.messageProvider : callerContext.channel ?? void 0,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.agentAccountId,
		requireConfiguredAccount: params.scheduledToolPolicy?.mode === "account",
		senderPolicyMode: params.scheduledToolPolicy ? "never" : "always"
	};
	const senderPolicyParams = {
		config: params.config,
		agentId,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider
	};
	const requesterPolicies = resolveRequesterToolPolicies({
		...groupPolicyParams,
		agentId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : "always",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account"
	});
	const persistentGroupPolicy = requesterPolicies.delegated ? void 0 : resolveGroupToolPolicy(groupPolicyParams);
	const persistentSenderPolicy = requesterPolicies.delegated || params.scheduledToolPolicy ? void 0 : resolveSenderToolPolicy(senderPolicyParams);
	const fixedPolicies = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy
	];
	const trailingPolicies = [
		params.sandboxToolPolicy,
		requesterPolicies.subagentPolicy,
		requesterPolicies.inheritedToolPolicy
	];
	return {
		allowed: isRuntimeToolAllowed("web_search", params.runtimeToolAllowlist) && isToolAllowedByPolicies("web_search", [
			...fixedPolicies,
			requesterPolicies.groupPolicy,
			requesterPolicies.senderPolicy,
			...trailingPolicies
		]),
		persistentAllowed: isToolAllowedByPolicies("web_search", [
			...fixedPolicies,
			persistentGroupPolicy,
			persistentSenderPolicy,
			...trailingPolicies
		])
	};
}
//#endregion
export { resolveWebSearchToolPolicy as t };
