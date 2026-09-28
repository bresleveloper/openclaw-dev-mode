import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { h as DEFAULT_TOOL_DENY, m as DEFAULT_TOOL_ALLOW } from "./constants-D1dHTp_E.mjs";
//#region src/agents/sandbox/tool-policy.ts
/**
* Sandbox tool policy resolver.
*
* Merges global, agent, and default allow/deny lists into normalized policy plus source diagnostics.
*/
function pickConfiguredList(field, agent, global) {
	const agentValues = agent?.[field];
	const globalValues = global?.[field];
	const key = `tools.sandbox.tools.${field}`;
	if (Array.isArray(agentValues)) return {
		values: agentValues,
		source: {
			source: "agent",
			key: `agents.entries.*.${key}`
		}
	};
	if (Array.isArray(globalValues)) return {
		values: globalValues,
		source: {
			source: "global",
			key
		}
	};
	return {
		values: void 0,
		source: {
			source: "default",
			key
		}
	};
}
function mergeAllowlist(base, extra, defaultAllow) {
	if (Array.isArray(base)) {
		if (base.length === 0) return [];
		if (!Array.isArray(extra) || extra.length === 0) return [...base];
		return uniqueStrings([...base, ...extra]);
	}
	if (Array.isArray(extra) && extra.length > 0) return uniqueStrings([...defaultAllow, ...extra]);
	return [...defaultAllow];
}
function pickAllowSource(params) {
	if (params.allowDefined && params.allow.source === "agent") return params.allow;
	if (params.alsoAllow?.source === "agent") return params.alsoAllow;
	if (params.allowDefined && params.allow.source === "global") return params.allow;
	if (params.alsoAllow?.source === "global") return params.alsoAllow;
	return params.allow;
}
function resolveExplicitSandboxReAllowPatterns(params) {
	return uniqueStrings([...params.allow ?? [], ...params.alsoAllow ?? []]);
}
function filterDefaultDenyForExplicitAllows(params) {
	if (params.explicitAllowPatterns.length === 0) return [...params.deny];
	const allowPatterns = compileGlobPatterns({
		raw: expandToolGroups(params.explicitAllowPatterns),
		normalize: normalizeToolPolicyName
	});
	if (allowPatterns.length === 0) return [...params.deny];
	return params.deny.filter((toolName) => !matchesAnyGlobPattern(normalizeToolPolicyName(toolName), allowPatterns));
}
function expandResolvedPolicy(policy) {
	let expandedDeny = expandToolGroups(policy.deny ?? []);
	let expandedAllow = expandToolGroups(policy.allow ?? []);
	const denyPatterns = compileGlobPatterns({
		raw: expandedDeny,
		normalize: normalizeToolPolicyName
	});
	if (matchesAnyGlobPattern("image", denyPatterns) && !matchesAnyGlobPattern("view_image", denyPatterns)) expandedDeny = [...expandedDeny, "view_image"];
	const expandedDenyLower = expandedDeny.map(normalizeLowercaseStringOrEmpty);
	const expandedAllowLower = expandedAllow.map(normalizeLowercaseStringOrEmpty);
	if (expandedAllow.length > 0 && !expandedDenyLower.includes("view_image") && !expandedAllowLower.includes("view_image")) expandedAllow = [...expandedAllow, "view_image"];
	return {
		allow: expandedAllow,
		deny: expandedDeny
	};
}
function classifyToolAgainstSandboxToolPolicy(name, policy) {
	if (!policy) return {
		blockedByDeny: false,
		blockedByAllow: false
	};
	const normalized = normalizeToolPolicyName(name);
	const deny = compileGlobPatterns({
		raw: expandToolGroups(policy.deny ?? []),
		normalize: normalizeToolPolicyName
	});
	const blockedByDeny = matchesAnyGlobPattern(normalized, deny);
	const allow = compileGlobPatterns({
		raw: expandToolGroups(policy.allow ?? []),
		normalize: normalizeToolPolicyName
	});
	return {
		blockedByDeny,
		blockedByAllow: !blockedByDeny && allow.length > 0 && !matchesAnyGlobPattern(normalized, allow)
	};
}
function isToolAllowed(policy, name) {
	const { blockedByDeny, blockedByAllow } = classifyToolAgainstSandboxToolPolicy(name, policy);
	return !blockedByDeny && !blockedByAllow;
}
function resolveSandboxToolPolicyForAgent(cfg, agentId, options) {
	const agentPolicy = (cfg && agentId ? resolveAgentConfig(cfg, agentId) : void 0)?.tools?.sandbox?.tools;
	const globalPolicy = cfg?.tools?.sandbox?.tools;
	const allowConfig = pickConfiguredList("allow", agentPolicy, globalPolicy);
	const alsoAllowConfig = pickConfiguredList("alsoAllow", agentPolicy, globalPolicy);
	const denyConfig = pickConfiguredList("deny", agentPolicy, globalPolicy);
	const explicitAllowPatterns = resolveExplicitSandboxReAllowPatterns({
		allow: allowConfig.values,
		alsoAllow: alsoAllowConfig.values
	});
	const containedTools = new Set(options?.containedToolNames);
	const defaultAllow = uniqueStrings([...DEFAULT_TOOL_ALLOW, ...containedTools]);
	const expanded = expandResolvedPolicy({
		allow: mergeAllowlist(allowConfig.values, alsoAllowConfig.values, defaultAllow),
		deny: Array.isArray(denyConfig.values) ? [...denyConfig.values] : filterDefaultDenyForExplicitAllows({
			deny: DEFAULT_TOOL_DENY.filter((name) => !containedTools.has(name)),
			explicitAllowPatterns
		})
	});
	return {
		allow: expanded.allow ?? [],
		deny: expanded.deny ?? [],
		sources: {
			allow: pickAllowSource({
				allow: allowConfig.source,
				allowDefined: Array.isArray(allowConfig.values),
				alsoAllow: alsoAllowConfig.source
			}),
			deny: denyConfig.source
		}
	};
}
//#endregion
export { isToolAllowed as n, resolveSandboxToolPolicyForAgent as r, classifyToolAgainstSandboxToolPolicy as t };
