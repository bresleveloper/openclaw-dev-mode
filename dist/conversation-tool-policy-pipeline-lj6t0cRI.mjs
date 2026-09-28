import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { t as isFrozenClawToolAllowPolicy } from "./tool-policy-runtime-BJyVx8dq.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-BjUxseTY.mjs";
//#region src/agents/conversation-tool-policy-pipeline.ts
function mergePolicyAllowlist(policy, alsoAllow) {
	if (isFrozenClawToolAllowPolicy(policy)) return policy;
	return mergeAlsoAllowPolicy(policy, alsoAllow ? [...alsoAllow] : void 0);
}
/**
* Resolves the shared policy layers once so local and remote fixed tool surfaces cannot
* diverge on profile `alsoAllow`, sender, sandbox, delegation, or runtime-cap semantics.
*/
function resolveConversationToolPolicies(params) {
	const policy = params.capabilityProfile.policy;
	const profileAllow = [...policy.profileAlsoAllow ?? [], ...params.additionalProfileAllow ?? []];
	const providerProfileAllow = [...policy.providerProfileAlsoAllow ?? [], ...params.additionalProfileAllow ?? []];
	return {
		profilePolicy: mergePolicyAllowlist(policy.profilePolicy, profileAllow),
		providerProfilePolicy: mergePolicyAllowlist(policy.providerProfilePolicy, providerProfileAllow),
		globalPolicy: mergePolicyAllowlist(policy.globalPolicy, params.additionalPolicyAllow),
		globalProviderPolicy: mergePolicyAllowlist(policy.globalProviderPolicy, params.additionalPolicyAllow),
		agentPolicy: mergePolicyAllowlist(policy.agentPolicy, params.additionalPolicyAllow),
		agentProviderPolicy: mergePolicyAllowlist(policy.agentProviderPolicy, params.additionalPolicyAllow),
		groupPolicy: mergePolicyAllowlist(policy.groupPolicy, params.additionalPolicyAllow),
		senderPolicy: mergePolicyAllowlist(policy.senderPolicy, params.additionalPolicyAllow),
		sandboxPolicy: mergePolicyAllowlist(policy.sandboxPolicy, params.additionalPolicyAllow),
		subagentPolicy: mergePolicyAllowlist(policy.subagentPolicy, params.additionalPolicyAllow),
		runtimeToolPolicy: policy.runtimeToolPolicyForInheritance,
		inheritedToolPolicy: mergePolicyAllowlist(policy.inheritedToolPolicy, params.additionalInheritedAllow)
	};
}
/** Builds the canonical ordered policy pipeline for a resolved conversation. */
function buildConversationToolPolicyPipelineSteps(params) {
	const profile = params.capabilityProfile.policy;
	return [
		...buildDefaultToolPolicyPipelineSteps({
			profilePolicy: params.policies.profilePolicy,
			profile: profile.profile,
			profileUnavailableCoreWarningAllowlist: profile.profilePolicy?.allow,
			providerProfilePolicy: params.policies.providerProfilePolicy,
			providerProfile: profile.providerProfile,
			providerProfileUnavailableCoreWarningAllowlist: profile.providerProfilePolicy?.allow,
			globalPolicy: params.policies.globalPolicy,
			globalProviderPolicy: params.policies.globalProviderPolicy,
			agentPolicy: params.policies.agentPolicy,
			agentProviderPolicy: params.policies.agentProviderPolicy,
			groupPolicy: params.policies.groupPolicy,
			senderPolicy: params.policies.senderPolicy,
			agentId: profile.agentId,
			unavailableCoreToolReason: params.unavailableCoreToolReason
		}),
		{
			policy: params.policies.sandboxPolicy,
			label: "sandbox tools.allow",
			unavailableCoreToolReason: params.unavailableCoreToolReason
		},
		...params.additionalStepsAfterSandbox ?? [],
		{
			policy: params.policies.subagentPolicy,
			label: "subagent tools.allow",
			unavailableCoreToolReason: params.unavailableCoreToolReason
		},
		...params.includeRuntimeToolPolicy ? [{
			policy: params.policies.runtimeToolPolicy,
			label: "runtime tools.allow",
			unavailableCoreToolReason: params.unavailableCoreToolReason
		}] : [],
		{
			policy: params.policies.inheritedToolPolicy,
			label: "inherited tools",
			unavailableCoreToolReason: params.unavailableCoreToolReason
		}
	];
}
/** Projects a fixed runtime catalog through the exact conversation policy pipeline. */
function projectConversationToolNames(params) {
	const policies = resolveConversationToolPolicies({ capabilityProfile: params.capabilityProfile });
	const tools = params.toolNames.map((name) => ({ name }));
	return applyToolPolicyPipeline({
		tools,
		toolMeta: () => void 0,
		warn: params.warn,
		steps: buildConversationToolPolicyPipelineSteps({
			capabilityProfile: params.capabilityProfile,
			policies,
			includeRuntimeToolPolicy: true
		})
	}).map((tool) => tool.name);
}
function isConversationToolAllowed(capabilityProfile, toolName) {
	return projectConversationToolNames({
		capabilityProfile,
		toolNames: [toolName],
		warn: () => void 0
	}).length === 1;
}
//#endregion
export { resolveConversationToolPolicies as i, isConversationToolAllowed as n, projectConversationToolNames as r, buildConversationToolPolicyPipelineSteps as t };
