import { a as collectExplicitDenylist } from "./tool-policy-14GRhbFd.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-CUnSsPP_.mjs";
import { i as resolveConversationToolPolicies, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-S64J0n2P.mjs";
//#region src/agents/embedded-agent-runner/effective-tool-policy.ts
function applyFinalEffectiveToolPolicy(params) {
	if (params.bundledTools.length === 0) return params.bundledTools;
	const capabilityProfile = params.conversationCapabilityProfile;
	const { trustedGroup } = capabilityProfile.policy;
	if (trustedGroup.dropped) params.warn("effective tool policy: dropping caller-provided groupId that does not match session-derived group context");
	const policies = resolveConversationToolPolicies({ capabilityProfile });
	const pipelineSteps = buildConversationToolPolicyPipelineSteps({
		capabilityProfile,
		policies,
		includeRuntimeToolPolicy: false
	}).map((step) => Object.assign({}, step, { suppressUnavailableCoreToolWarning: true }));
	return applyToolPolicyPipeline({
		tools: params.bundledTools,
		toolMeta: getPluginToolMeta,
		warn: params.warn,
		steps: pipelineSteps,
		onFilter: params.onFilter,
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.metadataSnapshot,
			toolDenylist: collectExplicitDenylist(pipelineSteps.map((step) => step.policy))
		})
	});
}
//#endregion
export { applyFinalEffectiveToolPolicy as t };
