import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy, h as resolveToolProfilePolicy } from "./tool-policy-Cm3NCEHp.js";
import { o as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-BHXzkIhw.js";
import { a as resolveInheritedToolPolicyForSession, i as resolveGroupToolPolicy, o as resolveSubagentToolPolicyForSession, r as resolveEffectiveToolPolicy, s as resolveTrustedGroupId } from "./agent-tools.policy-CPsCsTmX.js";
import { i as getPluginToolMeta } from "./tools-DG6VDQeD.js";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-BYTwoeTz.js";
import { n as buildDefaultToolPolicyPipelineSteps, r as buildDeclaredToolAllowlistContext, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-CWzVRDpX.js";
//#region src/agents/embedded-agent-runner/effective-tool-policy.ts
function applyFinalEffectiveToolPolicy(params) {
	if (params.bundledTools.length === 0) return params.bundledTools;
	const trustedGroup = resolveTrustedGroupId(params);
	if (trustedGroup.dropped) params.warn("effective tool policy: dropping caller-provided groupId that does not match session-derived group context");
	const { agentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const groupPolicy = resolveGroupToolPolicy({
		config: params.config,
		sessionKey: params.sessionKey,
		spawnedBy: params.spawnedBy,
		messageProvider: params.messageProvider,
		groupId: trustedGroup.groupId,
		groupChannel: trustedGroup.dropped ? null : params.groupChannel,
		groupSpace: trustedGroup.dropped ? null : params.groupSpace,
		accountId: params.agentAccountId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	const senderPolicy = resolveSenderToolPolicy({
		config: params.config,
		agentId,
		messageProvider: params.messageProvider,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	const profilePolicy = resolveToolProfilePolicy(profile);
	const providerProfilePolicy = resolveToolProfilePolicy(providerProfile);
	const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, profileAlsoAllow);
	const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, providerProfileAlsoAllow);
	const subagentStore = resolveSubagentCapabilityStore(params.sessionKey, { cfg: params.config });
	const subagentPolicy = params.sessionKey && isSubagentEnvelopeSession(params.sessionKey, {
		cfg: params.config,
		store: subagentStore
	}) ? resolveSubagentToolPolicyForSession(params.config, params.sessionKey, { store: subagentStore }) : void 0;
	const inheritedToolPolicy = resolveInheritedToolPolicyForSession(params.config, params.sessionKey, { store: subagentStore });
	const pipelineSteps = [
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
			agentId
		}),
		{
			policy: params.sandboxToolPolicy,
			label: "sandbox tools.allow"
		},
		{
			policy: subagentPolicy,
			label: "subagent tools.allow"
		},
		{
			policy: inheritedToolPolicy,
			label: "inherited tools"
		}
	].map((step) => Object.assign({}, step, { suppressUnavailableCoreToolWarning: true }));
	return applyToolPolicyPipeline({
		tools: params.bundledTools,
		toolMeta: (tool) => getPluginToolMeta(tool),
		warn: params.warn,
		steps: pipelineSteps,
		auditLogLevel: params.toolPolicyAuditLogLevel,
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.config,
			toolDenylist: collectExplicitDenylist(pipelineSteps.map((step) => step.policy))
		})
	});
}
//#endregion
export { applyFinalEffectiveToolPolicy as t };
