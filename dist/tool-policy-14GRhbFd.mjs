import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { o as sanitizeServerName } from "./agent-bundle-mcp-names-CFVETBL6.mjs";
import { c as normalizeToolPolicyName, i as expandToolGroups, l as readToolAllowlistIntersection, s as normalizeToolList, t as attachToolAllowlistIntersection } from "./tool-policy-shared-PsZCKeeN.mjs";
import { t as IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW } from "./sandbox-tool-policy-B4OWlHAG.mjs";
//#region src/agents/tool-policy.ts
/** Synthetic allowlist entry that means "use default plugin tools". */
const DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY = "__openclaw_default_plugin_tools__";
const SHIPPED_PLUGIN_POLICY_FAMILY_CORE_TOOLS = /* @__PURE__ */ new Map([["canvas", ["show_widget"]]]);
const SHIPPED_CORE_POLICY_RENAMES = /* @__PURE__ */ new Map([["update_plan", "progress_card"]]);
/** Expands shipped policy names into their current tool families. */
function expandShippedCoreToolPolicyNames(list) {
	if (!list) return;
	const expandNames = (entries) => uniqueStrings(entries.flatMap((entry) => {
		const normalized = normalizeToolPolicyName(entry);
		return [SHIPPED_CORE_POLICY_RENAMES.get(normalized) ?? normalized, ...SHIPPED_PLUGIN_POLICY_FAMILY_CORE_TOOLS.get(normalized) ?? []];
	}));
	const expanded = expandNames(list);
	const restrictions = readToolAllowlistIntersection(list);
	return restrictions ? attachToolAllowlistIntersection(expanded, restrictions.map(expandNames)) : expanded;
}
/** Returns true when an allow policy is narrower than all/default plugin tools. */
function hasRestrictiveAllowPolicy(policy) {
	if (!Array.isArray(policy?.allow)) return false;
	const restrictions = readToolAllowlistIntersection(policy.allow);
	if (restrictions) return restrictions.some((allow) => allow.length === 0 || hasRestrictiveAllowPolicy({ allow }));
	const normalizedAllow = policy.allow.map((entry) => normalizeToolPolicyName(entry));
	if (normalizedAllow.includes("*")) return false;
	return normalizedAllow.some((entry) => Boolean(entry) && entry !== "__openclaw_default_plugin_tools__");
}
/** Returns whether a policy removes at least one tool from the default surface. */
function toolPolicyRestrictsTools(policy) {
	if (!policy) return false;
	if (expandToolGroups(policy.deny).length > 0) return true;
	const restrictions = policy.allow && readToolAllowlistIntersection(policy.allow);
	return restrictions ? restrictions.some((allow) => allow.length === 0 || toolPolicyRestrictsTools({ allow })) : Array.isArray(policy.allow) && policy.allow.length > 0 && !expandToolGroups(policy.allow).includes("*");
}
/** Replaces an allowlist with the normalized names of an effective tool array. */
function replaceWithEffectiveToolAllowlist(target, tools) {
	target.length = 0;
	for (const name of uniqueStrings(normalizeToolList(tools.map((tool) => tool.name)))) target.push(name);
}
function collectExplicitAllowlist(policies) {
	const entries = [];
	for (const policy of policies) {
		if (!policy?.allow) continue;
		for (const value of readToolAllowlistIntersection(policy.allow)?.flat() ?? policy.allow) {
			if (typeof value !== "string") continue;
			const trimmed = value.trim();
			if (trimmed === "*" && policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) continue;
			if (trimmed) entries.push(trimmed);
		}
		if (policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) entries.push(DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY);
	}
	return uniqueStrings(entries);
}
function collectExplicitDenylist(policies) {
	return policies.flatMap((policy) => normalizeTrimmedStringList(policy?.deny));
}
function buildPluginToolGroups(params) {
	const all = [];
	const byPlugin = /* @__PURE__ */ new Map();
	for (const tool of params.tools) {
		const meta = params.toolMeta(tool);
		if (!meta) continue;
		const name = normalizeToolPolicyName(tool.name);
		all.push(name);
		const pluginId = normalizeOptionalLowercaseString(meta.pluginId);
		if (!pluginId) continue;
		const list = byPlugin.get(pluginId) ?? [];
		list.push(name);
		byPlugin.set(pluginId, list);
	}
	return {
		all,
		byPlugin
	};
}
/** Expands group:plugins and plugin-id entries into concrete plugin tool names. */
function expandPluginGroups(list, groups) {
	const renamed = expandShippedCoreToolPolicyNames(list);
	if (!renamed || renamed.length === 0) return renamed;
	const expanded = [];
	for (const entry of renamed) {
		const tools = entry === "group:plugins" ? groups.all : groups.byPlugin.get(entry);
		expanded.push(...tools?.length ? tools : [entry]);
	}
	return uniqueStrings(expanded);
}
/** Expands plugin groups in a policy while preserving undefined policies. */
function expandPolicyWithPluginGroups(policy, groups) {
	if (!policy) return;
	const allow = expandPluginGroups(policy.allow, groups);
	const restrictions = policy.allow && readToolAllowlistIntersection(policy.allow);
	return {
		allow: allow && restrictions ? attachToolAllowlistIntersection(allow, restrictions.map((restriction) => expandPluginGroups(restriction, groups) ?? [])) : allow,
		deny: expandPluginGroups(policy.deny, groups)
	};
}
function buildDeclaredMcpToolPrefixes(serverNames) {
	const prefixes = /* @__PURE__ */ new Set();
	const usedNames = /* @__PURE__ */ new Set();
	for (const serverName of serverNames ?? []) {
		const safeName = sanitizeServerName(serverName, usedNames);
		const prefix = normalizeToolPolicyName(safeName + "__");
		if (prefix) prefixes.add(prefix);
	}
	return prefixes;
}
function isDeclaredMcpAllowlistEntry(entry, prefixes) {
	if (prefixes.size === 0) return false;
	if (entry === "bundle-mcp") return true;
	for (const prefix of prefixes) if (entry.length > prefix.length && entry.startsWith(prefix)) return true;
	return false;
}
/** Finds allowlist entries that match neither core nor declared plugin tools. */
function analyzeAllowlistByToolType(policy, groups, coreTools, declaredTools) {
	if (!policy?.allow || policy.allow.length === 0) return { unknownAllowlist: [] };
	const normalized = expandShippedCoreToolPolicyNames(policy.allow)?.filter(Boolean) ?? [];
	if (normalized.length === 0) return { unknownAllowlist: [] };
	const pluginIds = new Set(groups.byPlugin.keys());
	for (const value of declaredTools?.pluginIds ?? []) {
		const pluginId = normalizeOptionalLowercaseString(value);
		if (pluginId) pluginIds.add(pluginId);
	}
	const pluginTools = new Set(groups.all);
	for (const value of declaredTools?.pluginToolNames ?? []) {
		const toolName = normalizeToolPolicyName(value);
		if (toolName) pluginTools.add(toolName);
	}
	const mcpToolPrefixes = buildDeclaredMcpToolPrefixes(declaredTools?.mcpServerNames);
	const unknownAllowlist = [];
	for (const entry of normalized) {
		if (entry === "*") continue;
		const isPluginEntry = entry === "group:plugins" || pluginIds.has(entry) || pluginTools.has(entry) || isDeclaredMcpAllowlistEntry(entry, mcpToolPrefixes);
		if (!expandToolGroups([entry]).some((tool) => coreTools.has(tool)) && !isPluginEntry) unknownAllowlist.push(entry);
	}
	return { unknownAllowlist: uniqueStrings(unknownAllowlist) };
}
function mergeAlsoAllowPolicy(policy, alsoAllow) {
	if (!policy?.allow || !Array.isArray(alsoAllow) || alsoAllow.length === 0) return policy;
	return {
		...policy,
		allow: uniqueStrings([...policy.allow, ...alsoAllow])
	};
}
//#endregion
export { collectExplicitDenylist as a, hasRestrictiveAllowPolicy as c, toolPolicyRestrictsTools as d, collectExplicitAllowlist as i, mergeAlsoAllowPolicy as l, analyzeAllowlistByToolType as n, expandPolicyWithPluginGroups as o, buildPluginToolGroups as r, expandShippedCoreToolPolicyNames as s, DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY as t, replaceWithEffectiveToolAllowlist as u };
