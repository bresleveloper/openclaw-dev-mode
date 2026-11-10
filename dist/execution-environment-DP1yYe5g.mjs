import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { i as isKnownCoreToolId } from "./tool-catalog-DGlfxTaj.mjs";
import { c as normalizeToolPolicyName, i as expandToolGroups, l as readToolAllowlistIntersection } from "./tool-policy-shared-PsZCKeeN.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import { d as toolPolicyRestrictsTools, l as mergeAlsoAllowPolicy } from "./tool-policy-14GRhbFd.mjs";
import { t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as resolveSandboxRuntimeStatus, s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
import { n as resolveExecConfigState } from "./exec-defaults-DrIV-0KT.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { n as isHostScopedAgentToolActive } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
//#region src/agents/harness/execution-environment.ts
/** Selection and invocation share this decision; a native working directory is not containment. */
function resolveAgentHarnessExecutionRestriction(harness, facts) {
	if (harness.executionEnvironment !== "host-only") return;
	const label = harness.label;
	const consented = facts.nativeRuntimeConsent === harness.id;
	const restriction = [
		[
			facts.sandboxRequired,
			"sandbox-required",
			" runs on the Gateway host, but this chat requires a sandbox. Choose another runtime; this requirement cannot be removed."
		],
		[
			facts.remoteExecution,
			"remote-execution",
			" runs on the Gateway host and cannot use this chat's remote execution environment. Choose another runtime or a local chat."
		],
		[
			facts.workspaceRequired,
			"workspace-only",
			" cannot enforce this run's required workspace boundary. Choose another runtime."
		],
		[
			!consented && facts.workspaceOnly,
			"workspace-only",
			" cannot enforce this chat's workspace-only file access. Choose another runtime or ask an administrator to review the file-access policy."
		],
		[
			!consented && facts.sandboxed,
			"sandbox",
			" runs on the Gateway host, outside the sandbox. Use its own permissions for this chat, or choose another runtime."
		],
		[
			!consented && Boolean(facts.permissionMode && facts.permissionMode !== "full"),
			"permission-mode",
			" uses its own permissions and requires Full access. Change this chat's permissions explicitly, or choose another runtime."
		],
		[
			!consented && facts.toolPolicyRestricted,
			"tool-policy",
			" uses its own tools and cannot enforce this chat's OpenClaw tool restrictions."
		]
	].find(([applies]) => applies);
	return restriction ? {
		reason: restriction[1],
		message: label + restriction[2]
	} : void 0;
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
			preparedSessionCapabilityEntry: params.preparedSessionCapabilityEntry,
			provider: params.provider,
			modelId: params.modelId
		}, harness)
	});
}
/** Revalidates execution policy and returns whether this run has native permission consent. */
async function assertAgentHarnessExecutionEnvironment(harness, params) {
	if (harness.executionEnvironment !== "host-only") return false;
	const agentId = resolveSessionAgentId({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const source = params.sessionKey ? captureSessionActorStorageOwner({
		agentId,
		sessionKey: params.sessionKey,
		storePath: params.config?.session?.store ? resolveSessionStorePathCore(params.config.session.store, { agentId }) : void 0
	}, {
		assertCurrent() {},
		authorize() {}
	}) : void 0;
	const entry = source ? readCapturedSessionActorEntry(source, params.sessionKey) : params.sessionKey ? await readSessionEntryReadOnlyInWorker({
		agentId,
		sessionKey: params.sessionKey,
		storePath: resolveSessionStorePathCore(params.config?.session?.store, { agentId })
	}) : void 0;
	const runtimeParams = {
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		classificationSessionKey: params.sandboxSessionKey,
		classificationAgentId: params.sandboxAgentId
	};
	if ((!params.sandboxSessionKey || params.sandboxSessionKey === params.sessionKey) && (!params.sandboxAgentId || params.sandboxAgentId === agentId)) return assertPreparedAgentHarnessExecutionEnvironment(harness, params, entry, source !== void 0, resolveSandboxRuntimeStatus({
		...runtimeParams,
		preparedSessionEntry: entry ?? null
	}));
	return withSandboxRuntimeStatusInWorker(runtimeParams, {
		env: process.env,
		cwd: process.cwd(),
		assertCurrent() {}
	}, async (runtime) => assertPreparedAgentHarnessExecutionEnvironment(harness, params, entry, source !== void 0, runtime));
}
function assertPreparedAgentHarnessExecutionEnvironment(harness, params, entry, nativeSource, runtime) {
	const nativeRuntimeConsent = entry?.sessionId === params.sessionId && entry.agentRuntimeOverride === harness.id && entry.permissionMode === "full" && entry.sandboxMode === "off" && !params.disableTools && params.toolsAllow === void 0 && !params.swarmCollector ? entry.nativeRuntimeConsent : void 0;
	const exec = resolveExecConfigState({
		cfg: params.config,
		agentId: runtime.classificationAgentId,
		sessionKey: params.sessionKey,
		execOverrides: params.execOverrides,
		sessionEntry: nativeSource ? entry : void 0
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
		permissionMode: nativeSource && params.permissionMode === "full" && entry?.sessionId === params.sessionId ? entry.permissionMode ?? params.permissionMode : params.permissionMode,
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
async function preparePluginHarnessPolicyToolsAllow(params) {
	const policies = await preparePluginHarnessToolPolicies(params);
	return [
		policies.senderPolicy,
		policies.groupPolicy,
		...policies.runtimePolicies
	].some(toolPolicyRestrictsTools) ? [] : void 0;
}
async function prepareAgentHarnessNativeToolPolicyRestricted(params, harness) {
	return (await preparePluginHarnessToolPolicies(params, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0, harness.conversationToolPolicyNativeTools)).toolPolicyRestricted;
}
async function preparePluginHarnessToolPolicies(params, safeDenyToolNames, nativeToolNames) {
	const consume = (sandbox) => withPreparedSessionCapabilityRead(() => resolvePluginHarnessToolPolicies(params, safeDenyToolNames, nativeToolNames, sandbox));
	if (params.preparedSessionEntry !== void 0) return consume(resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey ?? (params.agentId ? void 0 : params.sandboxSessionKey),
		classificationSessionKey: params.sandboxSessionKey ?? params.sessionKey,
		classificationAgentId: params.sandboxAgentId,
		preparedSessionEntry: params.preparedSessionEntry
	}));
	return withSandboxRuntimeStatusInWorker({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey ?? (params.agentId ? void 0 : params.sandboxSessionKey),
		classificationSessionKey: params.sandboxSessionKey ?? params.sessionKey,
		classificationAgentId: params.sandboxAgentId
	}, {
		env: process.env,
		cwd: process.cwd(),
		assertCurrent() {}
	}, consume);
}
/** Resolves whether a harness operation must remove its ambient native tool surface. */
function resolveAgentHarnessNativeToolPolicyRestricted(params, harness) {
	return resolvePluginHarnessToolPolicies(params, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0, harness.conversationToolPolicyNativeTools).toolPolicyRestricted;
}
function resolvePluginHarnessDenyAllToolPolicyPrompt(policies) {
	return [
		[[policies.senderPolicy, policies.senderScopedGroupPolicy], PLUGIN_HARNESS_SENDER_DENY_ALL_PROMPT],
		[[policies.groupPolicy], PLUGIN_HARNESS_GROUP_DENY_ALL_PROMPT],
		[policies.runtimePolicies, PLUGIN_HARNESS_RUNTIME_DENY_ALL_PROMPT]
	].find(([candidates]) => candidates.some(policyDeniesAllTools))?.[1];
}
function resolvePluginHarnessToolPolicies(params, safeDenyToolNames, nativeToolNames, preparedSandbox) {
	const messageProvider = params.messageProvider ?? params.messageChannel;
	const sandboxSessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const sandboxRuntime = preparedSandbox ?? resolveSandboxRuntimeStatus({
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
		preparedSessionEntry: params.preparedSessionCapabilityEntry,
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
	const systemAgentOnlyAllowlist = isHostScopedAgentToolActive("openclaw") && isSystemAgentOnlyAllowlist(params.toolsAllow);
	const senderScopedGroupPolicy = resolveSenderScopedGroupToolPolicy(params, groupPolicyParams, policy.groupPolicy);
	return {
		toolPolicyScope: params.disableTools || !systemAgentOnlyAllowlist && toolPolicyRestrictsTools(requestedToolPolicy) || params.scheduledToolPolicy?.mode === "account" && (explicitPolicies.some(toolPolicyRestrictsTools) || profilePolicies.some(toolPolicyRestrictsTools)) || params.runtimePluginToolGrant !== void 0 || Boolean(policy.delegatedToolPolicy) || params.swarmCollector === true || toolPolicyRestrictsTools(policy.senderPolicy) || toolPolicyRestrictsTools(senderScopedGroupPolicy) ? "turn" : "conversation",
		senderPolicy: policy.senderPolicy,
		senderScopedGroupPolicy,
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
		requiresLiveToolAuthority: Boolean(policy.delegatedToolPolicy),
		toolPolicyRestricted: Boolean(policy.delegatedToolPolicy) || params.swarmCollector === true || nativeToolNames?.some((toolName) => !isToolAllowedByPolicies(toolName, profilePolicies)) === true || explicitPolicies.some((explicitPolicy) => toolPolicyRestrictsHarnessNativeTools(explicitPolicy, safeDenyToolNameSet))
	};
}
function isSystemAgentOnlyAllowlist(toolsAllow) {
	return toolsAllow?.length === 1 && normalizeToolPolicyName(toolsAllow[0] ?? "") === "openclaw";
}
function collectHarnessSafeDeniedToolNames(policies, safeDenyToolNames) {
	if (!safeDenyToolNames) return [];
	return [...new Set(policies.flatMap((policy) => expandToolGroups(policy?.deny ?? [])).map(normalizeToolPolicyName).filter((name) => isKnownCoreToolId(name) && safeDenyToolNames.has(name)))].toSorted();
}
function toolPolicyRestrictsHarnessNativeTools(policy, safeDenyToolNames) {
	if (!safeDenyToolNames || !policy || toolPolicyRestrictsTools({ allow: policy.allow })) return toolPolicyRestrictsTools(policy);
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
export { preparePluginHarnessToolPolicies as a, resolvePluginHarnessToolPolicies as c, preparePluginHarnessPolicyToolsAllow as i, isSystemAgentOnlyAllowlist as n, resolveAgentHarnessSessionExecutionRestriction as o, prepareAgentHarnessNativeToolPolicyRestricted as r, resolvePluginHarnessDenyAllToolPolicyPrompt as s, assertAgentHarnessExecutionEnvironment as t };
