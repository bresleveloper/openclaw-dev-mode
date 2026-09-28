import { r as isKnownCoreToolId } from "./tool-catalog-CLTpLFor.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import { i as filterToolsByPolicy } from "./tool-policy-match-Bv2XOvEF.mjs";
import { n as analyzeAllowlistByToolType, o as expandPolicyWithPluginGroups, r as buildPluginToolGroups } from "./tool-policy-YDdaK0oX.mjs";
import { t as isFrozenClawToolAllowPolicy } from "./tool-policy-runtime-BJyVx8dq.mjs";
import { n as auditToolPolicyFilter } from "./tool-policy-audit-DOHow9m6.mjs";
//#region src/agents/tool-policy-pipeline.ts
/**
* Applies layered tool policy in runtime resolution order. Policy diagnostics
* stay tied to the layer that introduced them, while plugin groups are
* expanded only after unknown core/plugin entries are classified.
*/
const MAX_TOOL_POLICY_WARNING_CACHE = 256;
const seenToolPolicyWarnings = /* @__PURE__ */ new Set();
function rememberToolPolicyWarning(warning) {
	if (seenToolPolicyWarnings.has(warning)) return false;
	if (seenToolPolicyWarnings.size >= MAX_TOOL_POLICY_WARNING_CACHE) {
		const oldest = seenToolPolicyWarnings.values().next().value;
		if (oldest) seenToolPolicyWarnings.delete(oldest);
	}
	seenToolPolicyWarnings.add(warning);
	return true;
}
/** Builds the default profile, provider, agent, group, and sender policy layers. */
function buildDefaultToolPolicyPipelineSteps(params) {
	const agentId = params.agentId?.trim();
	const profile = params.profile?.trim();
	const providerProfile = params.providerProfile?.trim();
	const unavailableCoreToolReason = params.unavailableCoreToolReason?.trim();
	return [
		{
			policy: params.profilePolicy,
			label: profile ? `tools.profile (${profile})` : "tools.profile",
			stripPluginOnlyAllowlist: true,
			suppressUnavailableCoreToolWarningAllowlist: params.profileUnavailableCoreWarningAllowlist,
			unavailableCoreToolReason
		},
		{
			policy: params.providerProfilePolicy,
			label: providerProfile ? `tools.byProvider.profile (${providerProfile})` : "tools.byProvider.profile",
			stripPluginOnlyAllowlist: true,
			suppressUnavailableCoreToolWarningAllowlist: params.providerProfileUnavailableCoreWarningAllowlist,
			unavailableCoreToolReason
		},
		{
			policy: params.globalPolicy,
			label: "tools.allow",
			stripPluginOnlyAllowlist: true,
			unavailableCoreToolReason
		},
		{
			policy: params.globalProviderPolicy,
			label: "tools.byProvider.allow",
			stripPluginOnlyAllowlist: true,
			unavailableCoreToolReason
		},
		{
			policy: params.agentPolicy,
			label: agentId ? `agents.${agentId}.tools.allow` : "agent tools.allow",
			stripPluginOnlyAllowlist: true,
			unavailableCoreToolReason
		},
		{
			policy: params.agentProviderPolicy,
			label: agentId ? `agents.${agentId}.tools.byProvider.allow` : "agent tools.byProvider.allow",
			stripPluginOnlyAllowlist: true,
			unavailableCoreToolReason
		},
		{
			policy: params.groupPolicy,
			label: "group tools.allow",
			stripPluginOnlyAllowlist: true,
			unavailableCoreToolReason
		},
		{
			policy: params.senderPolicy,
			label: "tools.toolsBySender",
			stripPluginOnlyAllowlist: true,
			unavailableCoreToolReason
		}
	];
}
/** Applies configured policy layers to a tool list and emits deduped warnings/audit events. */
function applyToolPolicyPipeline(params) {
	const coreToolNames = new Set(params.tools.filter((tool) => !params.toolMeta(tool)).map((tool) => normalizeToolPolicyName(tool.name)).filter(Boolean));
	const pluginGroups = buildPluginToolGroups({
		tools: params.tools,
		toolMeta: params.toolMeta
	});
	let filtered = params.tools;
	for (const step of params.steps) {
		if (!step.policy) continue;
		const policy = step.policy;
		const frozenAllow = isFrozenClawToolAllowPolicy(policy);
		if (step.stripPluginOnlyAllowlist) {
			const resolved = analyzeAllowlistByToolType(policy, pluginGroups, coreToolNames, params.declaredToolAllowlist);
			if (resolved.unknownAllowlist.length > 0) {
				const unavailableCoreWarningAllowlist = new Set((step.suppressUnavailableCoreToolWarningAllowlist ?? []).map((entry) => normalizeToolPolicyName(entry)));
				const gatedCoreEntries = resolved.unknownAllowlist.filter((entry) => isKnownCoreToolId(entry));
				const warnableGatedCoreEntries = step.suppressUnavailableCoreToolWarning ? [] : gatedCoreEntries.filter((entry) => !unavailableCoreWarningAllowlist.has(entry));
				const otherEntries = resolved.unknownAllowlist.filter((entry) => !isKnownCoreToolId(entry) && !unavailableCoreWarningAllowlist.has(entry));
				const warningEntries = [...warnableGatedCoreEntries, ...otherEntries];
				if (warningEntries.length > 0) {
					const entries = warningEntries.join(", ");
					const suffix = describeUnknownAllowlistSuffix({
						hasGatedCoreEntries: warnableGatedCoreEntries.length > 0,
						hasOtherEntries: otherEntries.length > 0,
						unavailableCoreToolReason: step.unavailableCoreToolReason
					});
					const warning = `tools: ${step.label} allowlist contains unknown entries (${entries}). ${suffix}`;
					if (rememberToolPolicyWarning(warning)) params.warn(warning);
				}
			}
		}
		const expanded = frozenAllow ? {
			allow: policy.allow,
			deny: expandPolicyWithPluginGroups({ deny: policy.deny }, pluginGroups)?.deny
		} : expandPolicyWithPluginGroups(policy, pluginGroups);
		if (!expanded) continue;
		const before = filtered;
		filtered = filterToolsByPolicy(before, expanded);
		params.onFilter?.({
			step,
			policy: expanded,
			before,
			after: filtered
		});
		auditToolPolicyFilter({
			stepLabel: step.label,
			policy: expanded,
			before,
			after: filtered
		});
	}
	return filtered;
}
function describeUnknownAllowlistSuffix(params) {
	const unavailableCoreToolReason = params.unavailableCoreToolReason?.trim();
	const unavailableCoreDetail = unavailableCoreToolReason ? `These entries are shipped core tools but unavailable here: ${unavailableCoreToolReason}.` : "These entries are shipped core tools but unavailable in the current runtime/provider/model/config.";
	const mixedUnavailableCoreDetail = unavailableCoreToolReason ? `Some entries are shipped core tools but unavailable here: ${unavailableCoreToolReason}; other entries won't match any tool unless the plugin is enabled.` : "Some entries are shipped core tools but unavailable in the current runtime/provider/model/config; other entries won't match any tool unless the plugin is enabled.";
	return params.hasGatedCoreEntries && params.hasOtherEntries ? mixedUnavailableCoreDetail : params.hasGatedCoreEntries ? unavailableCoreDetail : "These entries won't match any tool unless the plugin is enabled.";
}
//#endregion
export { buildDefaultToolPolicyPipelineSteps as n, applyToolPolicyPipeline as t };
