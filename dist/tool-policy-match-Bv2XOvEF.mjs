import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups, u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
//#region src/agents/tool-policy-match.ts
/**
* Runtime matcher for sandbox tool policies. Deny patterns always win, then
* an empty allow list means "allow everything not denied".
*/
/** Exclude a server before discovery only when every tool in its namespace is denied. */
function createMcpServerToolDenyMatcher(toolDenylist) {
	const denials = toolDenylist?.map(normalizeToolPolicyName) ?? [];
	const denyAll = denials.includes("bundle-mcp") || denials.includes("group:plugins");
	const namespaces = compileGlobPatterns({
		raw: denials.filter((pattern) => pattern.endsWith("*")),
		normalize: normalizeToolPolicyName
	});
	return (safeServerName) => denyAll || matchesAnyGlobPattern(normalizeToolPolicyName(safeServerName + "__"), namespaces);
}
/** Snapshot one synchronous filtering operation; execution checks must prepare current policy. */
function createToolPolicyMatcher(policy, writeAllowsApplyPatch = true) {
	if (!policy) return () => true;
	const restrictions = policy.allow && readToolAllowlistIntersection(policy.allow);
	if (restrictions) {
		const matchers = restrictions.map((allow) => allow.length > 0 ? createToolPolicyMatcher({
			...policy,
			allow
		}, writeAllowsApplyPatch) : () => false);
		return (name) => matchers.every((matches) => matches(name));
	}
	const deny = compileGlobPatterns({
		raw: expandToolGroups(policy.deny ?? []),
		normalize: normalizeToolPolicyName
	});
	const allow = compileGlobPatterns({
		raw: expandToolGroups(policy.allow ?? []),
		normalize: normalizeToolPolicyName
	});
	return (name) => {
		const normalized = normalizeToolPolicyName(name);
		if (matchesAnyGlobPattern(normalized, deny)) return false;
		if (allow.length === 0) return true;
		if (matchesAnyGlobPattern(normalized, allow)) return true;
		if (writeAllowsApplyPatch && normalized === "apply_patch" && matchesAnyGlobPattern("write", allow)) return true;
		return false;
	};
}
/** Return whether one tool name is allowed by a single sandbox policy. */
function isToolAllowedByPolicyName(name, policy) {
	if (!policy) return true;
	return createToolPolicyMatcher(policy)(name);
}
/** Runtime caps deny empty lists and preserve every independently merged restriction. */
function createRuntimeToolMatcher(toolsAllow, writeAllowsApplyPatch = true) {
	const matchers = (toolsAllow === void 0 ? [] : readToolAllowlistIntersection(toolsAllow) ?? [toolsAllow]).map((allow) => allow.length > 0 ? createToolPolicyMatcher({ allow }, writeAllowsApplyPatch) : () => false);
	return (name) => matchers.every((matches) => matches(name));
}
function isRuntimeToolAllowed(name, toolsAllow) {
	return toolsAllow === void 0 || (readToolAllowlistIntersection(toolsAllow) ?? [toolsAllow]).every((allow) => allow.length > 0 && isToolAllowedByPolicyName(name, { allow }));
}
/** Filter runtime tools by policy without rebuilding its patterns for each tool. */
function filterToolsByPolicy(tools, policy) {
	if (!policy) return tools;
	if (tools.length === 0) return [];
	const matches = createToolPolicyMatcher(policy);
	return tools.filter((tool) => matches(tool.name));
}
/** Return whether one tool name is allowed by every active sandbox policy. */
function isToolAllowedByPolicies(name, policies) {
	return policies.every((policy) => isToolAllowedByPolicyName(name, policy));
}
//#endregion
export { isRuntimeToolAllowed as a, filterToolsByPolicy as i, createRuntimeToolMatcher as n, isToolAllowedByPolicies as o, createToolPolicyMatcher as r, isToolAllowedByPolicyName as s, createMcpServerToolDenyMatcher as t };
