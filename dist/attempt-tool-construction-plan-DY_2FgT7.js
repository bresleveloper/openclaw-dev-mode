import { f as expandToolGroups, m as normalizeToolName, o as expandPolicyWithPluginGroups, p as normalizeToolList, r as buildPluginToolGroups } from "./tool-policy-Cm3NCEHp.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-DdVL7l8F.js";
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.ts
/**
* Plans which core, bundle MCP, and bundle LSP tools an attempt should build.
*/
const BASE_CODING_TOOL_FACTORY_NAMES = new Set([
	"edit",
	"read",
	"write"
]);
const SHELL_CODING_TOOL_FACTORY_NAMES = new Set([
	"apply_patch",
	"exec",
	"process"
]);
const OPENCLAW_TOOL_FACTORY_NAMES = new Set([
	"agents_list",
	"canvas",
	"cron",
	"gateway",
	"get_goal",
	"heartbeat_respond",
	"heartbeat_response",
	"image",
	"image_generate",
	"message",
	"music_generate",
	"nodes",
	"pdf",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_send",
	"sessions_spawn",
	"sessions_yield",
	"skill_workshop",
	"create_goal",
	"subagents",
	"tts",
	"update_goal",
	"update_plan",
	"video_generate",
	"web_fetch",
	"web_search"
]);
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
function isPluginGroupAllowlistName(normalized) {
	return normalized === "group:plugins";
}
function hasWildcardToolAllowlist(toolsAllow) {
	return toolsAllow.some((entry) => normalizeToolName(entry) === "*");
}
function isKnownLocalCodingToolName(normalized) {
	return BASE_CODING_TOOL_FACTORY_NAMES.has(normalized) || SHELL_CODING_TOOL_FACTORY_NAMES.has(normalized) || OPENCLAW_TOOL_FACTORY_NAMES.has(normalized);
}
/**
* Applies a runtime allowlist to a concrete tool list after expanding tool and
* plugin groups. Undefined allowlists keep all tools; an explicit empty list
* intentionally disables all runtime tools.
*/
function applyEmbeddedAttemptToolsAllow(tools, toolsAllow, options) {
	if (!toolsAllow) return tools;
	if (toolsAllow.length === 0) return [];
	if (hasWildcardToolAllowlist(toolsAllow)) return tools;
	const pluginGroups = options?.toolMeta ? buildPluginToolGroups({
		tools,
		toolMeta: options.toolMeta
	}) : void 0;
	const policy = pluginGroups ? expandPolicyWithPluginGroups({ allow: toolsAllow }, pluginGroups) : { allow: toolsAllow };
	return tools.filter((tool) => isToolAllowedByPolicyName(tool.name, policy));
}
/**
* Adds the message tool to a narrowed allowlist when the caller must support
* forced source-reply delivery. Wildcard and undefined allowlists already cover
* message, while an empty allowlist becomes message-only.
*/
function mergeForcedEmbeddedAttemptToolsAllow(toolsAllow, params) {
	if (!params.forceMessageTool || toolsAllow === void 0 || hasWildcardToolAllowlist(toolsAllow)) return toolsAllow;
	if (toolsAllow.length === 0) return ["message"];
	return new Set(toolsAllow.map((entry) => normalizeToolName(entry))).has("message") ? toolsAllow : [...toolsAllow, "message"];
}
function resolveCodingToolConstructionPlanForAllowlist(toolsAllow) {
	if (!toolsAllow) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	if (toolsAllow.length === 0) return cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN);
	if (hasWildcardToolAllowlist(toolsAllow)) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	const normalized = normalizeToolList(expandToolGroups(toolsAllow));
	const includeBaseCodingTools = normalized.some((name) => BASE_CODING_TOOL_FACTORY_NAMES.has(name));
	const includeShellTools = normalized.some((name) => SHELL_CODING_TOOL_FACTORY_NAMES.has(name));
	const includeOpenClawTools = normalized.some((name) => OPENCLAW_TOOL_FACTORY_NAMES.has(name));
	const includePluginTools = normalized.some((name) => name === "group:plugins" || !isBundleMcpAllowlistName(name) && !isKnownLocalCodingToolName(name));
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
	if (params.disableTools === true || params.isRawModelRun === true) return {
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
	if (params.toolsAllow.length === 0) return false;
	if (hasWildcardToolAllowlist(params.toolsAllow)) return true;
	return params.toolsAllow.some((toolName) => matchesAllowlist(normalizeToolName(toolName)));
}
/**
* Decides whether the bundled MCP runtime is needed for this attempt. Bundle
* runtime creation follows explicit bundle/plugin allowlist names rather than
* generic local tool names.
*/
function shouldCreateBundleMcpRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (normalized) => {
		return isBundleMcpAllowlistName(normalized) || isPluginGroupAllowlistName(normalized);
	});
}
/**
* Decides whether the bundled LSP runtime is needed for this attempt. LSP tools
* are enabled by default/wildcard and by allowlist entries with the `lsp_`
* prefix.
*/
function shouldCreateBundleLspRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (normalized) => {
		return normalized.startsWith("lsp_");
	});
}
//#endregion
export { shouldCreateBundleMcpRuntimeForAttempt as a, shouldCreateBundleLspRuntimeForAttempt as i, mergeForcedEmbeddedAttemptToolsAllow as n, resolveEmbeddedAttemptToolConstructionPlan as r, applyEmbeddedAttemptToolsAllow as t };
