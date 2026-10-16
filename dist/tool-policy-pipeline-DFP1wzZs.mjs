import { i as isKnownCoreToolId } from "./tool-catalog-DyHnjiiS.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import { i as filterToolsByPolicy } from "./tool-policy-match-Dn8gpf-E.mjs";
import { n as analyzeAllowlistByToolType, o as expandPolicyWithPluginGroups, r as buildPluginToolGroups } from "./tool-policy-BKvvmcQR.mjs";
import { t as isFrozenClawToolAllowPolicy } from "./tool-policy-runtime--SOb7O-O.mjs";
import { n as auditToolPolicyFilter } from "./tool-policy-audit-Cf8RI7hr.mjs";
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
	const steps = [
		{
			policy: params.profilePolicy,
			source: params.sources?.profile,
			label: profile ? `tools.profile (${profile})` : "tools.profile",
			suppressUnavailableCoreToolWarningAllowlist: params.profileUnavailableCoreWarningAllowlist
		},
		{
			policy: params.providerProfilePolicy,
			source: params.sources?.providerProfile,
			label: providerProfile ? `tools.byProvider.profile (${providerProfile})` : "tools.byProvider.profile",
			suppressUnavailableCoreToolWarningAllowlist: params.providerProfileUnavailableCoreWarningAllowlist
		},
		{
			policy: params.globalPolicy,
			source: params.sources?.global,
			label: "tools.allow"
		},
		{
			policy: params.globalProviderPolicy,
			source: params.sources?.globalProvider,
			label: "tools.byProvider.allow"
		},
		{
			policy: params.agentPolicy,
			source: params.sources?.agent,
			label: agentId ? `agents.${agentId}.tools.allow` : "agent tools.allow"
		},
		{
			policy: params.agentProviderPolicy,
			source: params.sources?.agentProvider,
			label: agentId ? `agents.${agentId}.tools.byProvider.allow` : "agent tools.byProvider.allow"
		},
		{
			policy: params.groupPolicy,
			source: { kind: "session" },
			label: "group tools.allow"
		},
		{
			policy: params.senderPolicy,
			source: { kind: "session" },
			label: "tools.toolsBySender"
		}
	];
	for (const step of steps) {
		step.stripPluginOnlyAllowlist = true;
		step.unavailableCoreToolReason = unavailableCoreToolReason;
	}
	return steps;
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
