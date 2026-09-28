import { a as collectExplicitDenylist } from "./tool-policy-YDdaK0oX.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-BjUxseTY.mjs";
import { i as resolveConversationToolPolicies, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-lj6t0cRI.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-BnZ0wLNS.mjs";
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
		toolMeta: (tool) => getPluginToolMeta(tool),
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
