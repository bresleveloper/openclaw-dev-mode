import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DuaaJ-nB.mjs";
import { c as normalizeToolPolicyName, i as expandToolGroups } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { h as DEFAULT_TOOL_DENY, m as DEFAULT_TOOL_ALLOW } from "./constants-Cg33NnpI.mjs";
//#region src/agents/sandbox/types.ts
/** In-process provenance, bound to the original resolved allowlist; never serialized. */
const SANDBOX_DEFAULT_TOOL_ALLOW = Symbol.for("openclaw.sandbox.defaultToolAllow");
//#endregion
//#region src/agents/sandbox/tool-policy.ts
function pickConfiguredList(field, agent, global) {
	const key = `tools.sandbox.tools.${field}`;
	for (const [source, values] of [["agent", agent?.[field]], ["global", global?.[field]]]) if (Array.isArray(values)) return {
		values,
		source: {
			source,
			key: source === "agent" ? `agents.entries.*.${key}` : key
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
	if (base?.length === 0) return [];
	const resolved = base ?? defaultAllow;
	return extra?.length ? uniqueStrings([...resolved, ...extra]) : [...resolved];
}
function pickAllowSource(params) {
	for (const source of ["agent", "global"]) {
		if (params.allowDefined && params.allow.source === source) return params.allow;
		if (params.alsoAllow?.source === source) return params.alsoAllow;
	}
	return params.allow;
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
	const explicitAllowPatterns = uniqueStrings([...allowConfig.values ?? [], ...alsoAllowConfig.values ?? []]);
	const containedTools = new Set(options?.containedToolNames);
	const defaultAllow = uniqueStrings([...DEFAULT_TOOL_ALLOW, ...containedTools]);
	const expanded = expandResolvedPolicy({
		allow: mergeAllowlist(allowConfig.values, alsoAllowConfig.values, defaultAllow),
		deny: denyConfig.values !== void 0 ? [...denyConfig.values] : filterDefaultDenyForExplicitAllows({
			deny: DEFAULT_TOOL_DENY.filter((name) => !containedTools.has(name)),
			explicitAllowPatterns
		})
	});
	return {
		...expanded,
		...allowConfig.values === void 0 ? { [SANDBOX_DEFAULT_TOOL_ALLOW]: expanded.allow } : {},
		sources: {
			allow: pickAllowSource({
				allow: allowConfig.source,
				allowDefined: allowConfig.values !== void 0,
				alsoAllow: alsoAllowConfig.source
			}),
			deny: denyConfig.source
		}
	};
}
//#endregion
export { SANDBOX_DEFAULT_TOOL_ALLOW as i, isToolAllowed as n, resolveSandboxToolPolicyForAgent as r, classifyToolAgainstSandboxToolPolicy as t };
