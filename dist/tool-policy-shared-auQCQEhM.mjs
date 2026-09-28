import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { a as resolveCoreToolProfilePolicy, t as CORE_TOOL_GROUPS } from "./tool-catalog-CLTpLFor.mjs";
//#region src/agents/tool-policy-shared.ts
/**
* Shared runtime tool policy normalization.
*
* Keeps aliases, groups, profile expansion, and prefix matching consistent across allow/deny paths.
*/
const TOOL_NAME_ALIASES = /* @__PURE__ */ new Map([
	["bash", "exec"],
	["apply-patch", "apply_patch"],
	["cron", "automations"]
]);
const TOOL_ALLOWLIST_INTERSECTION = Symbol.for("openclaw.toolAllowlistIntersection");
/** Core tool groups exposed to allow/deny policy config. */
const TOOL_GROUPS = { ...CORE_TOOL_GROUPS };
/**
* Preserves independent allowlists until a concrete tool surface can evaluate
* them. Intersections of overlapping globs cannot be represented by one glob list.
*/
function attachToolAllowlistIntersection(toolsAllow, restrictions) {
	Object.defineProperty(toolsAllow, TOOL_ALLOWLIST_INTERSECTION, {
		configurable: true,
		enumerable: false,
		value: restrictions
	});
	return toolsAllow;
}
/** Reads independent restrictions attached by a modifying-hook merger. */
function readToolAllowlistIntersection(toolsAllow) {
	return toolsAllow[TOOL_ALLOWLIST_INTERSECTION];
}
/** Refusal for a tool that keeps its schema but sits outside the run's execution allowlist. */
const TOOL_EXECUTION_GATED_MESSAGE = "Unavailable in this run. Continue with the tools permitted by the run's instructions.";
function isToolExecutionAllowed(allowNames, toolName) {
	const target = normalizeToolPolicyName(toolName);
	return allowNames.some((name) => normalizeToolPolicyName(name) === target);
}
/** Snapshot exact names for one synchronous batch; never retain this matcher across awaits. */
function createToolExecutionMatcher(allowNames) {
	const allowed = /* @__PURE__ */ new Set();
	allowNames.forEach((name) => allowed.add(normalizeToolPolicyName(name)));
	return (toolName) => allowed.has(normalizeToolPolicyName(toolName));
}
/** Normalizes a tool name or alias to the policy id used for matching. */
function normalizeToolPolicyName(name) {
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return TOOL_NAME_ALIASES.get(normalized) ?? normalized;
}
/** Checks whether an in-progress prefix can still resolve to an allowed tool or alias. */
function couldNormalizeToolNamePrefixToAllowedTool(prefix, allowedToolNames) {
	const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
	if (!normalizedPrefix) return false;
	const allowed = /* @__PURE__ */ new Set();
	for (const toolName of allowedToolNames) {
		const foldedToolName = normalizeLowercaseStringOrEmpty(toolName);
		const normalizedToolName = TOOL_NAME_ALIASES.get(foldedToolName) ?? foldedToolName;
		if (normalizedToolName) allowed.add(normalizedToolName);
		if (foldedToolName) allowed.add(foldedToolName);
		if (normalizedToolName.startsWith(normalizedPrefix) || foldedToolName.startsWith(normalizedPrefix)) return true;
	}
	const resolvedPrefix = TOOL_NAME_ALIASES.get(normalizedPrefix) ?? normalizedPrefix;
	if (resolvedPrefix !== normalizedPrefix) {
		for (const toolName of allowed) if (toolName.startsWith(resolvedPrefix)) return true;
	}
	for (const [alias, toolName] of TOOL_NAME_ALIASES) if (alias.startsWith(normalizedPrefix) && allowed.has(toolName)) return true;
	return false;
}
/** Normalizes a configured allow/deny list while dropping blank entries. */
function normalizeToolList(list) {
	if (!list) return [];
	return list.map(normalizeToolPolicyName).filter(Boolean);
}
/** Expands named tool groups into concrete tool ids. */
function expandToolGroups(list) {
	const normalized = normalizeToolList(list);
	const expanded = [];
	for (const value of normalized) {
		const group = Object.hasOwn(TOOL_GROUPS, value) ? TOOL_GROUPS[value] : void 0;
		if (group) {
			expanded.push(...group);
			continue;
		}
		expanded.push(value);
	}
	return uniqueStrings(expanded);
}
/** Resolves a built-in tool profile policy by id. */
function resolveToolProfilePolicy(profile) {
	return resolveCoreToolProfilePolicy(profile);
}
//#endregion
export { createToolExecutionMatcher as a, normalizeToolList as c, resolveToolProfilePolicy as d, couldNormalizeToolNamePrefixToAllowedTool as i, normalizeToolPolicyName as l, TOOL_GROUPS as n, expandToolGroups as o, attachToolAllowlistIntersection as r, isToolExecutionAllowed as s, TOOL_EXECUTION_GATED_MESSAGE as t, readToolAllowlistIntersection as u };
