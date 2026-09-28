import { r as isKnownCoreToolId } from "./tool-catalog-CLTpLFor.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups, u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { d as toolPolicyRestrictsTools, l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { s as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-L6QuLbuq.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DkN5in9o.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { t as resolveExecConfigState } from "./exec-defaults-aBiGwrXO.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-DRmktKAO.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
//#region src/agents/harness/execution-environment.ts
/** Selection and invocation share this decision; a native working directory is not containment. */
function resolveAgentHarnessExecutionRestriction(harness, facts) {
	if (harness.executionEnvironment !== "host-only") return;
	const label = harness.label;
	if (facts.sandboxRequired) return {
		reason: "sandbox-required",
		message: label + " runs on the Gateway host, but this chat requires a sandbox. Choose another runtime; this requirement cannot be removed."
	};
	if (facts.remoteExecution) return {
		reason: "remote-execution",
		message: label + " runs on the Gateway host and cannot use this chat's remote execution environment. Choose another runtime or a local chat."
	};
	if (facts.workspaceRequired) return {
		reason: "workspace-only",
		message: label + " cannot enforce this run's required workspace boundary. Choose another runtime."
	};
	if (facts.nativeRuntimeConsent === harness.id) return;
	if (facts.workspaceOnly) return {
		reason: "workspace-only",
		message: label + " cannot enforce this chat's workspace-only file access. Choose another runtime or ask an administrator to review the file-access policy."
	};
	if (facts.sandboxed) return {
		reason: "sandbox",
		message: label + " runs on the Gateway host, outside the sandbox. Use its own permissions for this chat, or choose another runtime."
	};
	if (facts.permissionMode && facts.permissionMode !== "full") return {
		reason: "permission-mode",
		message: label + " uses its own permissions and requires Full access. Change this chat's permissions explicitly, or choose another runtime."
	};
	if (facts.toolPolicyRestricted) return {
		reason: "tool-policy",
		message: label + " uses its own tools and cannot enforce this chat's OpenClaw tool restrictions."
	};
}
/** Classifies stored or prospective session policy without selecting runtime availability. */
function resolveAgentHarnessSessionExecutionRestriction(params) {
	const { cfg, agentId, sessionKey, entry, harness } = params;
	if (harness.executionEnvironment !== "host-only") return;
	const sandbox = resolveSandboxRuntimeStatus({
		cfg,
		agentId,
		sessionKey,
		preparedSessionEntry: entry
	});
	const exec = resolveExecConfigState({
		cfg,
		agentId,
		sessionKey,
		sessionEntry: entry
	});
	const nativeRuntimeConsent = entry.permissionMode === "full" && entry.sandboxMode === "off" ? entry.nativeRuntimeConsent : void 0;
	return resolveAgentHarnessExecutionRestriction(harness, {
		sandboxed: sandbox.sandboxed || exec.host === "sandbox",
		sandboxRequired: sandbox.sandboxRequired || exec.host === "sandbox",
		workspaceOnly: resolveEffectiveToolFsWorkspaceOnly({
			cfg,
			agentId
		}),
		permissionMode: entry.permissionMode,
		nativeRuntimeConsent,
		remoteExecution: exec.host === "node",
		toolPolicyRestricted: nativeRuntimeConsent !== harness.id && harness.conversationToolPolicySupport !== "exact" && resolveAgentHarnessNativeToolPolicyRestricted({
			config: cfg,
			agentId,
			sessionKey,
			sessionId: entry.sessionId,
			preparedSessionEntry: entry,
			provider: params.provider,
			modelId: params.modelId
		}, harness)
	});
}
/** Revalidates execution policy and returns whether this run has native permission consent. */
function assertAgentHarnessExecutionEnvironment(harness, params) {
	if (harness.executionEnvironment !== "host-only") return false;
	const agentId = resolveSessionAgentId({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const entry = params.sessionKey ? resolveSessionEntry({
		agentId,
		sessionKey: params.sessionKey,
		storePath: resolveSessionStorePathCore(params.config?.session?.store, { agentId }),
		clone: false
	}, { readOnly: true }).existing : void 0;
	const nativeRuntimeConsent = entry?.sessionId === params.sessionId && entry.agentRuntimeOverride === harness.id && entry.permissionMode === "full" && entry.sandboxMode === "off" && !params.disableTools && params.toolsAllow === void 0 && !params.swarmCollector ? entry.nativeRuntimeConsent : void 0;
	const runtime = resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		classificationSessionKey: params.sandboxSessionKey,
		classificationAgentId: params.sandboxAgentId,
		...(!params.sandboxSessionKey || params.sandboxSessionKey === params.sessionKey) && (!params.sandboxAgentId || params.sandboxAgentId === agentId) ? { preparedSessionEntry: entry ?? null } : {}
	});
	const exec = resolveExecConfigState({
		cfg: params.config,
		agentId: runtime.classificationAgentId,
		sessionKey: params.sessionKey,
		execOverrides: params.execOverrides
	});
	const restriction = resolveAgentHarnessExecutionRestriction(harness, {
		sandboxed: params.sandbox?.enabled === true || runtime.sandboxed || exec.host === "sandbox",
		nativeRuntimeConsent,
		workspaceRequired: params.requireWorkspaceOnly === true,
		sandboxRequired: runtime.sandboxRequired || exec.host === "sandbox",
		workspaceOnly: params.requireWorkspaceOnly === true || resolveEffectiveToolFsWorkspaceOnly({
			cfg: params.config,
			agentId: runtime.classificationAgentId
		}),
		permissionMode: params.permissionMode,
		remoteExecution: exec.host === "node"
	});
	if (restriction) throw new AgentHarnessPreflightError(restriction.message, {
		scope: "harness",
		userMessage: restriction.message
	});
	return nativeRuntimeConsent === harness.id;
}
const PLUGIN_HARNESS_SENDER_DENY_ALL_PROMPT = "Tool and file actions are disabled for this sender by chat policy. If asked to edit files or use tools, say this sender is not allowed by policy; do not imply retrying will help.";
const PLUGIN_HARNESS_GROUP_DENY_ALL_PROMPT = "Tool and file actions are disabled for this chat by policy. If asked to edit files or use tools, say this chat is not allowed by policy.";
const PLUGIN_HARNESS_RUNTIME_DENY_ALL_PROMPT = "Tool and file actions are disabled by runtime policy. If asked to edit files or use tools, say tools are disabled by policy.";
function resolvePluginHarnessPolicyToolsAllow(params) {
	const policies = resolvePluginHarnessToolPolicies(params);
	return [
		policies.senderPolicy,
		policies.groupPolicy,
		...policies.runtimePolicies
	].some(toolPolicyRestrictsTools) ? [] : void 0;
}
/** Resolves whether a harness operation must remove its ambient native tool surface. */
function resolveAgentHarnessNativeToolPolicyRestricted(params, harness) {
	return resolvePluginHarnessToolPolicies(params, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0, harness.conversationToolPolicyNativeTools).toolPolicyRestricted;
}
function resolvePluginHarnessDenyAllToolPolicyPrompt(policies) {
	if (policyDeniesAllTools(policies.senderPolicy) || policyDeniesAllTools(policies.senderScopedGroupPolicy)) return PLUGIN_HARNESS_SENDER_DENY_ALL_PROMPT;
	if (policyDeniesAllTools(policies.groupPolicy)) return PLUGIN_HARNESS_GROUP_DENY_ALL_PROMPT;
	return policies.runtimePolicies.some(policyDeniesAllTools) ? PLUGIN_HARNESS_RUNTIME_DENY_ALL_PROMPT : void 0;
}
function resolvePluginHarnessToolPolicies(params, safeDenyToolNames, nativeToolNames) {
	const messageProvider = params.messageProvider ?? params.messageChannel;
	const sandboxSessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey ?? (params.agentId ? void 0 : sandboxSessionKey),
		classificationSessionKey: sandboxSessionKey,
		classificationAgentId: params.sandboxAgentId,
		preparedSessionEntry: params.preparedSessionEntry
	});
	const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
	const capabilityProfile = resolveConversationCapabilityProfile({
		config: params.config,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sandboxSessionKey,
		agentId: params.agentId,
		modelProvider: params.provider,
		modelId: params.modelId,
		messageProvider,
		messageChannel: params.messageChannel,
		conversationToolPolicy: params.conversationToolPolicy,
		agentAccountId: params.agentAccountId,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		memberRoleIds: params.memberRoleIds,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		sandboxToolPolicy: sandboxPolicy,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		scheduledToolPolicy: params.scheduledToolPolicy,
		runtimePluginToolGrant: params.runtimePluginToolGrant
	});
	const callerContext = resolveScheduledToolCallerContext({
		scheduledToolPolicy: params.scheduledToolPolicy,
		channel: messageProvider
	});
	const groupPolicyParams = {
		config: params.config,
		sessionKey: params.scheduledToolPolicy?.ownerSessionKey ?? params.sessionKey,
		spawnedBy: params.spawnedBy,
		messageProvider: callerContext.local ? messageProvider : callerContext.channel ?? void 0,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.agentAccountId,
		requireConfiguredAccount: params.scheduledToolPolicy?.mode === "account",
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : "always"
	};
	const { policy } = capabilityProfile;
	const runtimeRestrictions = params.toolsAllow && (readToolAllowlistIntersection(params.toolsAllow) ?? [params.toolsAllow]);
	const requestedToolPolicy = params.disableTools || runtimeRestrictions?.some((allow) => allow.length === 0) ? { deny: ["*"] } : params.toolsAllow ? { allow: params.toolsAllow } : void 0;
	const explicitPolicies = [
		policy.globalPolicy,
		policy.globalProviderPolicy,
		policy.agentPolicy,
		policy.agentProviderPolicy,
		policy.groupPolicy,
		policy.senderPolicy,
		policy.sandboxPolicy,
		policy.subagentPolicy,
		policy.inheritedToolPolicy,
		policy.runtimeToolPolicyForInheritance,
		requestedToolPolicy
	];
	const safeDenyToolNameSet = safeDenyToolNames ? new Set(safeDenyToolNames.map(normalizeToolPolicyName)) : void 0;
	const profilePolicies = [mergeAlsoAllowPolicy(policy.profilePolicy, policy.profileAlsoAllow), mergeAlsoAllowPolicy(policy.providerProfilePolicy, policy.providerProfileAlsoAllow)];
	return {
		senderPolicy: policy.senderPolicy,
		senderScopedGroupPolicy: resolveSenderScopedGroupToolPolicy(params, groupPolicyParams, policy.groupPolicy),
		groupPolicy: policy.groupPolicy,
		runtimePolicies: [
			...profilePolicies,
			policy.globalPolicy,
			policy.globalProviderPolicy,
			policy.agentPolicy,
			policy.agentProviderPolicy,
			sandboxPolicy,
			policy.subagentPolicy,
			policy.inheritedToolPolicy,
			requestedToolPolicy
		],
		safeDeniedToolNames: collectHarnessSafeDeniedToolNames(explicitPolicies, safeDenyToolNameSet),
		toolPolicyRestricted: params.swarmCollector === true || nativeToolNames?.some((toolName) => !isToolAllowedByPolicies(toolName, profilePolicies)) === true || explicitPolicies.some((explicitPolicy) => toolPolicyRestrictsHarnessNativeTools(explicitPolicy, safeDenyToolNameSet))
	};
}
function collectHarnessSafeDeniedToolNames(policies, safeDenyToolNames) {
	if (!safeDenyToolNames) return [];
	return [...new Set(policies.flatMap((policy) => expandToolGroups(policy?.deny ?? [])).map(normalizeToolPolicyName).filter((name) => isKnownCoreToolId(name) && safeDenyToolNames.has(name)))].toSorted();
}
function toolPolicyRestrictsHarnessNativeTools(policy, safeDenyToolNames) {
	if (!safeDenyToolNames) return toolPolicyRestrictsTools(policy);
	if (!policy || toolPolicyRestrictsTools({ allow: policy.allow })) return toolPolicyRestrictsTools(policy);
	return expandToolGroups(policy.deny ?? []).some((deniedName) => {
		const normalized = normalizeToolPolicyName(deniedName);
		return !isKnownCoreToolId(normalized) || !safeDenyToolNames.has(normalized);
	});
}
function resolveSenderScopedGroupToolPolicy(params, groupPolicyParams, groupPolicy) {
	if (!policyDeniesAllTools(groupPolicy) || !hasSenderIdentity(params)) return;
	return policyDeniesAllTools(resolveGroupToolPolicy({
		...groupPolicyParams,
		senderId: void 0,
		senderName: void 0,
		senderUsername: void 0,
		senderE164: void 0
	})) ? void 0 : groupPolicy;
}
function hasSenderIdentity(params) {
	return Boolean(params.senderId?.trim() || params.senderName?.trim() || params.senderUsername?.trim() || params.senderE164?.trim());
}
function policyDeniesAllTools(policy) {
	return expandToolGroups(policy?.deny ?? []).some((entry) => normalizeToolPolicyName(entry) === "*");
}
//#endregion
export { resolvePluginHarnessPolicyToolsAllow as a, resolvePluginHarnessDenyAllToolPolicyPrompt as i, resolveAgentHarnessNativeToolPolicyRestricted as n, resolvePluginHarnessToolPolicies as o, resolveAgentHarnessSessionExecutionRestriction as r, assertAgentHarnessExecutionEnvironment as t };
