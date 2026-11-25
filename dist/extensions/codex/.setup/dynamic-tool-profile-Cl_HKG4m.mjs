// extensions/codex/src/app-server/dynamic-tool-profile.ts
/** Replacement policy for tools owned by Codex app-server. */
const CODEX_NATIVE_TOOLS = /* @__PURE__ */ new Map([
	["read", "workspace"],
	["write", "workspace"],
	["edit", "workspace"],
	["apply_patch", "workspace"],
	["exec", "shell"],
	["process", "shell"],
	["update_plan", "always"],
	["tool_call", "always"],
	["dispatch_action", "always"],
	["tool_describe", "always"],
	["tool_search", "always"]
]);
const DYNAMIC_TOOL_NAME_ALIASES = {
	bash: "exec",
	"apply-patch": "apply_patch"
};
function normalizeCodexDynamicToolName(name) {
	const normalized = name.trim().toLowerCase();
	return DYNAMIC_TOOL_NAME_ALIASES[normalized] ?? normalized;
}
/** True only for the host-scoped OpenClaw run's exact tool contract. */
function isSystemAgentOnlyCodexDynamicToolAllowlist(toolsAllow) {
	return toolsAllow?.length === 1 && normalizeCodexDynamicToolName(toolsAllow[0] ?? "") === "openclaw";
}
/** True when a private source reply may use the message delivery tool only. */
function isMessageOnlyCodexSourceReply(params) {
	return params.sourceReplyDeliveryMode === "message_tool_only" && params.toolsAllow?.length === 1 && normalizeCodexDynamicToolName(params.toolsAllow[0] ?? "") === "message";
}
function isForcedPrivateQaCodexRuntime(env = process.env) {
	return env.OPENCLAW_BUILD_PRIVATE_QA === "1" && env.OPENCLAW_QA_FORCE_RUNTIME?.trim().toLowerCase() === "codex";
}
function resolveCodexDynamicToolsLoading(config, env = process.env) {
	return isForcedPrivateQaCodexRuntime(env) ? "direct" : config.codexDynamicToolsLoading ?? "searchable";
}
/** Returns true for models whose tool-search path is unsupported or inefficient. */
function shouldDisableCodexToolSearchForModel(modelId) {
	return modelId?.trim().toLowerCase().split("/").at(-1) === "gpt-5.4-nano";
}
/** Resolves dynamic-tool loading for the app-server connection that will execute the turn. */
function resolveCodexDynamicToolsLoadingForRuntime(config, modelId, options = {}) {
	const loading = resolveCodexDynamicToolsLoading(config);
	return loading === "searchable" && (options.nativeToolSurfaceEnabled === false || shouldDisableCodexToolSearchForModel(modelId) || options.connectionClass === "remote") ? "direct" : loading;
}
/** Filters OpenClaw tools that Codex owns natively or config explicitly excludes. */
function filterCodexDynamicTools(tools, config, options = {}) {
	const { disabledNativeSurface } = options;
	const excludes = /* @__PURE__ */ new Set();
	const privateQa = isForcedPrivateQaCodexRuntime();
	for (const [name, replacement] of CODEX_NATIVE_TOOLS) {
		if (privateQa) {
			if (name === "apply_patch") excludes.add(name);
			continue;
		}
		if (replacement === "workspace" && disabledNativeSurface || replacement === "shell" && disabledNativeSurface?.preserveShell) continue;
		excludes.add(name);
	}
	for (const name of config.codexDynamicToolsExclude ?? []) {
		const trimmed = normalizeCodexDynamicToolName(name);
		if (trimmed) excludes.add(trimmed);
	}
	return excludes.size === 0 ? tools : tools.filter((tool) => !excludes.has(normalizeCodexDynamicToolName(tool.name)));
}
export { normalizeCodexDynamicToolName as a, shouldDisableCodexToolSearchForModel as c, isSystemAgentOnlyCodexDynamicToolAllowlist as i, isForcedPrivateQaCodexRuntime as n, resolveCodexDynamicToolsLoading as o, isMessageOnlyCodexSourceReply as r, resolveCodexDynamicToolsLoadingForRuntime as s, filterCodexDynamicTools as t };
