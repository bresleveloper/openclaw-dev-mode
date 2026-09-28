import { r as mayMatchGlobWithPrefix } from "./glob-pattern-DFVWJ-hh.mjs";
import { c as normalizeToolList, l as normalizeToolPolicyName, o as expandToolGroups, r as attachToolAllowlistIntersection, u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
import { n as createRuntimeToolMatcher } from "./tool-policy-match-Bv2XOvEF.mjs";
import { o as expandPolicyWithPluginGroups, r as buildPluginToolGroups, s as expandShippedCoreToolPolicyNames } from "./tool-policy-YDdaK0oX.mjs";
import { n as listCoreToolFactoryDescriptors, r as resolveCoreToolFactoryFamily } from "./core-tool-factory-descriptors-CGmz8OlS.mjs";
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.ts
/**
* Plans which core, bundle MCP, and bundle LSP tools an attempt should build.
*/
const ALL_CODING_TOOL_CONSTRUCTION_PLAN = {
	includeBaseCodingTools: true,
	includeShellTools: true,
	includeChannelTools: true,
	includeOpenClawTools: true,
	includePluginTools: true
};
const NO_CODING_TOOL_CONSTRUCTION_PLAN = {
	includeBaseCodingTools: false,
	includeShellTools: false,
	includeChannelTools: false,
	includeOpenClawTools: false,
	includePluginTools: false
};
function cloneCodingToolConstructionPlan(plan) {
	return { ...plan };
}
function isBundleMcpAllowlistName(normalized) {
	return normalized === "bundle-mcp" || normalized.includes("__");
}
function hasWildcardToolAllowlist(toolsAllow) {
	return toolsAllow.some((entry) => normalizeToolPolicyName(entry) === "*");
}
/**
* Applies a runtime allowlist to a concrete tool list after expanding tool and
* plugin groups. Undefined allowlists keep all tools; an explicit empty list
* intentionally disables all runtime tools.
*/
function applyEmbeddedAttemptToolsAllow(tools, toolsAllow, options) {
	if (!toolsAllow) return tools;
	return (readToolAllowlistIntersection(toolsAllow) ?? [toolsAllow]).reduce((currentTools, restriction) => {
		if (restriction.length === 0) return [];
		if (hasWildcardToolAllowlist(restriction)) return currentTools;
		if (currentTools.length === 0) return [];
		const pluginGroups = options?.toolMeta ? buildPluginToolGroups({
			tools: currentTools,
			toolMeta: options.toolMeta
		}) : void 0;
		const policy = pluginGroups ? expandPolicyWithPluginGroups({ allow: restriction }, pluginGroups) : { allow: expandShippedCoreToolPolicyNames(restriction) };
		const matches = createRuntimeToolMatcher(policy?.allow);
		return currentTools.filter((tool) => matches(tool.name) || options?.toolAliases?.(tool).some(matches));
	}, tools);
}
/**
* Adds host-required tools to a narrowed runtime allowlist. Wildcard and
* undefined allowlists already cover every required tool.
*/
function mergeForcedEmbeddedAttemptToolsAllow(toolsAllow, params) {
	if (toolsAllow === void 0) return;
	const required = [...params.forceMessageTool ? ["message"] : [], ...params.forceToolNames ?? []];
	const merge = (allow) => {
		const normalized = new Set(allow.map(normalizeToolPolicyName));
		return [...allow, ...required.filter((name) => {
			const key = normalizeToolPolicyName(name);
			if (normalized.has("*") || normalized.has(key)) return false;
			normalized.add(key);
			return true;
		})];
	};
	const restrictions = readToolAllowlistIntersection(toolsAllow);
	const merged = merge(toolsAllow);
	return restrictions ? attachToolAllowlistIntersection(merged, restrictions.map(merge)) : merged;
}
function resolveCodingToolConstructionPlanForAllowlist(toolsAllow) {
	if (!toolsAllow) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	const restrictions = readToolAllowlistIntersection(toolsAllow);
	if (!restrictions && toolsAllow.length === 0) return cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN);
	if (!restrictions && hasWildcardToolAllowlist(toolsAllow)) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	const constructionEntries = restrictions?.flat() ?? toolsAllow;
	const expanded = expandToolGroups(expandShippedCoreToolPolicyNames(constructionEntries));
	const normalized = normalizeToolList(expanded);
	const constructionMatchers = (restrictions ?? [toolsAllow]).map((restriction) => createRuntimeToolMatcher(expandShippedCoreToolPolicyNames(restriction), false));
	const coreFamilies = new Set(listCoreToolFactoryDescriptors().filter(({ name }) => constructionMatchers.every((matches) => matches(name))).map(({ family }) => family));
	let includePluginTools = false;
	for (const name of normalized) {
		if (resolveCoreToolFactoryFamily(name)) continue;
		if (name !== "bundle-mcp") includePluginTools = true;
	}
	const includeBaseCodingTools = coreFamilies.has("base-coding");
	const includeShellTools = coreFamilies.has("shell");
	const includeOpenClawTools = coreFamilies.has("openclaw");
	return {
		includeBaseCodingTools,
		includeShellTools,
		includeChannelTools: includePluginTools,
		includeOpenClawTools,
		includePluginTools
	};
}
/**
* Decides which tool families need to be constructed for an embedded attempt.
* This keeps allowlisted plugin/channel tools available without forcing every
* local core tool factory to run for narrow plugin-only configurations.
*/
function resolveEmbeddedAttemptToolConstructionPlan(params) {
	if (params.disableTools === true || params.isRawModelRun === true || params.toolsEnabled === false) return {
		constructTools: false,
		includeCoreTools: false,
		codingToolConstructionPlan: cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN)
	};
	const toolsAllow = mergeForcedEmbeddedAttemptToolsAllow(params.toolsAllow, { forceMessageTool: params.forceMessageTool });
	const codingToolConstructionPlan = resolveCodingToolConstructionPlanForAllowlist(toolsAllow);
	const includeCoreTools = codingToolConstructionPlan.includeBaseCodingTools || codingToolConstructionPlan.includeShellTools || codingToolConstructionPlan.includeOpenClawTools;
	return {
		constructTools: includeCoreTools || codingToolConstructionPlan.includeChannelTools || codingToolConstructionPlan.includePluginTools,
		includeCoreTools,
		...toolsAllow ? { runtimeToolAllowlist: toolsAllow } : {},
		codingToolConstructionPlan
	};
}
function shouldCreateBundleRuntimeForAttempt(params, matchesAllowlist) {
	if (!params.toolsEnabled || params.disableTools === true) return false;
	if (!params.toolsAllow) return true;
	return (readToolAllowlistIntersection(params.toolsAllow) ?? [params.toolsAllow]).every((allow) => allow.length > 0 && (hasWildcardToolAllowlist(allow) || matchesAllowlist(allow.map(normalizeToolPolicyName))));
}
/**
* Decides whether the bundled MCP runtime is needed for this attempt. Bundle
* runtime creation follows explicit bundle/plugin names or globs that can reach
* a configured server namespace. Final tool policy remains authoritative.
*/
function shouldCreateBundleMcpRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (names) => {
		if (names.some((name) => isBundleMcpAllowlistName(name) || name === "group:plugins")) return true;
		const globs = names.filter((name) => name.includes("*"));
		return globs.length > 0 && (params.resolveConfiguredMcpNamespaces?.() ?? []).some((namespace) => globs.some((glob) => mayMatchGlobWithPrefix(glob, namespace.toLowerCase())));
	});
}
/**
* Discovers LSP tools for plugin grants or patterns that can match their namespace.
*/
function shouldCreateBundleLspRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (names) => names.some((name) => name === "bundle-lsp" || name === "group:plugins" || name.startsWith("lsp_") || mayMatchGlobWithPrefix(name, "lsp_")));
}
//#endregion
export { shouldCreateBundleMcpRuntimeForAttempt as a, shouldCreateBundleLspRuntimeForAttempt as i, mergeForcedEmbeddedAttemptToolsAllow as n, resolveEmbeddedAttemptToolConstructionPlan as r, applyEmbeddedAttemptToolsAllow as t };
