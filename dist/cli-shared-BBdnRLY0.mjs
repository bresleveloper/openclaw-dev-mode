import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { d as resolveExecModePolicy } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { s as requiresClaudeMandatoryAdaptiveThinking } from "./anthropic-Cy4mTngV.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import "./exec-approvals-runtime-DbIWGUdS.mjs";
import { t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-0f4y8Jm6.mjs";
//#region extensions/anthropic/cli-shared.ts
const CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG = "--dangerously-skip-permissions";
const CLAUDE_PERMISSION_MODE_ARG = "--permission-mode";
const CLAUDE_SETTING_SOURCES_ARG = "--setting-sources";
const CLAUDE_EXCLUDE_DYNAMIC_SYSTEM_PROMPT_SECTIONS_ARG = "--exclude-dynamic-system-prompt-sections";
const CLAUDE_EXCLUDE_DYNAMIC_SYSTEM_PROMPT_SECTIONS_MINIMUM_VERSION = "2.1.98";
const CLAUDE_SETTINGS_ARG = "--settings";
const CLAUDE_EFFORT_ARG = "--effort";
const CLAUDE_BARE_ARG = "--bare";
const CLAUDE_SAFE_MODE_ARG = "--safe-mode";
const CLAUDE_DISABLE_SLASH_COMMANDS_ARG = "--disable-slash-commands";
const CLAUDE_CHROME_ARG = "--chrome";
const CLAUDE_NO_CHROME_ARG = "--no-chrome";
const CLAUDE_TOOLS_ARG = "--tools";
const CLAUDE_ALLOWED_TOOLS_ARG = "--allowedTools";
const CLAUDE_DISALLOWED_TOOLS_ARG = "--disallowedTools";
const CLAUDE_MCP_CONFIG_ARG = "--mcp-config";
const CLAUDE_STRICT_MCP_CONFIG_ARG = "--strict-mcp-config";
const CLAUDE_NO_SESSION_PERSISTENCE_ARG = "--no-session-persistence";
const CLAUDE_MAX_TURNS_ARG = "--max-turns";
const CLAUDE_SESSION_ID_ARG = "--session-id";
const CLAUDE_RESUME_ARG = "--resume";
const CLAUDE_RESUME_SESSION_AT_ARG = "--resume-session-at";
const CLAUDE_RESUME_SHORT_ARG = "-r";
const CLAUDE_CONTINUE_ARG = "--continue";
const CLAUDE_CONTINUE_SHORT_ARG = "-c";
const CLAUDE_FORK_SESSION_ARG = "--fork-session";
const CLAUDE_SAFE_SETTING_SOURCES = "user";
const CLAUDE_BYPASS_PERMISSION_MODE = "bypassPermissions";
const CLAUDE_DEFAULT_PERMISSION_MODE = "default";
const CLAUDE_NO_TOOLS_VALUE = "";
const CLAUDE_DENY_MCP_TOOLS_VALUE = "mcp__*";
const OPENCLAW_MCP_TOOL_PREFIX = "mcp__openclaw__";
const CLAUDE_RESTRICTED_SETTINGS = "{\"disableAllHooks\":true,\"enabledPlugins\":{},\"autoMemoryEnabled\":false,\"claudeMdExcludes\":[\"**/CLAUDE.md\",\"**/CLAUDE.local.md\",\"**/.claude/rules/**\"]}";
/** Return whether a provider id refers to the Claude CLI backend. */
function isClaudeCliProvider(providerId) {
	return normalizeOptionalLowercaseString(providerId) === CLAUDE_CLI_BACKEND_ID;
}
/** Map OpenClaw's effective context budget to Claude Code's native compactor. */
function resolveClaudeCliAutoCompactEnv(contextTokenBudget) {
	if (typeof contextTokenBudget !== "number" || !Number.isFinite(contextTokenBudget)) return;
	const normalizedBudget = Math.floor(contextTokenBudget);
	if (normalizedBudget <= 0) return;
	return { CLAUDE_CODE_AUTO_COMPACT_WINDOW: String(normalizedBudget) };
}
/**
* Map OpenClaw's fixed thinking levels to Claude Code's per-process budget.
*
* Claude Code 2.x reads MAX_THINKING_TOKENS for print-mode runs and a positive
* integer requests that fixed token budget. Mandatory-adaptive models ignore
* that projection, so they retain adaptive thinking and use --effort instead.
* These fixed budgets match OpenClaw's canonical provider defaults in
* packages/ai/src/providers/simple-options.ts.
*/
function resolveClaudeCliThinkingEnv(thinkingLevel, modelId) {
	if (requiresClaudeMandatoryAdaptiveThinking({ id: modelId })) return;
	switch (thinkingLevel) {
		case "off": return { MAX_THINKING_TOKENS: "0" };
		case "minimal": return {
			CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING: "1",
			MAX_THINKING_TOKENS: "1024"
		};
		case "low": return {
			CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING: "1",
			MAX_THINKING_TOKENS: "2048"
		};
		case "medium": return {
			CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING: "1",
			MAX_THINKING_TOKENS: "8192"
		};
		case "high":
		case "xhigh": return {
			CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING: "1",
			MAX_THINKING_TOKENS: "16384"
		};
		case "max": return {
			CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING: "1",
			MAX_THINKING_TOKENS: "32768"
		};
		case "adaptive":
		case void 0: return;
		default: return thinkingLevel;
	}
}
/** Parse only stable versions; prereleases do not establish native feature support. */
function parseClaudeCodeVersion(versionOutput) {
	return versionOutput?.match(/(?:^|\s)(\d+\.\d+\.\d+)(?=$|\s)/u)?.[1];
}
/** Return whether the probed Claude Code build supports the cache-control flag. */
function supportsClaudeDynamicSystemPromptSections(versionOutput) {
	const parsed = parseClaudeCodeVersion(versionOutput);
	if (!parsed) return false;
	const version = parsed.split(".").map(Number);
	const minimum = CLAUDE_EXCLUDE_DYNAMIC_SYSTEM_PROMPT_SECTIONS_MINIMUM_VERSION.split(".").map(Number);
	for (const [index, component] of version.entries()) {
		const minimumComponent = minimum[index];
		if (component === void 0 || minimumComponent === void 0) return false;
		if (component !== minimumComponent) return component > minimumComponent;
	}
	return true;
}
function isOpenClawRequestedYolo(context) {
	const exec = (context?.agentId ? resolveAgentConfig(context.config ?? {}, context.agentId)?.tools?.exec : void 0) ?? context?.config?.tools?.exec;
	return resolveExecModePolicy({
		mode: exec?.mode,
		security: exec?.security ?? "full",
		ask: exec?.ask ?? "off"
	}).mode === "full";
}
/** Keep filesystem settings user-scoped and normalize native permission flags together. */
function normalizeClaudeBackendArgs(args, permissionMode) {
	if (!args) return permissionMode ? [CLAUDE_PERMISSION_MODE_ARG, permissionMode] : args;
	const normalized = [];
	let hasPermissionMode = false;
	let hasSettingSources = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index] ?? "";
		if (arg === CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG) continue;
		if (arg === CLAUDE_PERMISSION_MODE_ARG || arg === CLAUDE_SETTING_SOURCES_ARG) {
			const maybeValue = args[index + 1];
			if (typeof maybeValue === "string" && maybeValue.trim().length > 0 && !maybeValue.startsWith("-")) {
				if (arg === CLAUDE_PERMISSION_MODE_ARG) {
					hasPermissionMode = true;
					normalized.push(arg, maybeValue);
				} else {
					hasSettingSources = true;
					normalized.push(arg, CLAUDE_SAFE_SETTING_SOURCES);
				}
				index += 1;
			}
			continue;
		}
		if (arg.startsWith(`${CLAUDE_PERMISSION_MODE_ARG}=`)) {
			const maybeValue = arg.slice(`${CLAUDE_PERMISSION_MODE_ARG}=`.length).trim();
			if (maybeValue.length > 0 && !maybeValue.startsWith("-")) {
				hasPermissionMode = true;
				normalized.push(`${CLAUDE_PERMISSION_MODE_ARG}=${maybeValue}`);
			}
			continue;
		}
		if (arg.startsWith(`${CLAUDE_SETTING_SOURCES_ARG}=`)) {
			hasSettingSources = true;
			normalized.push(`${CLAUDE_SETTING_SOURCES_ARG}=${CLAUDE_SAFE_SETTING_SOURCES}`);
			continue;
		}
		normalized.push(arg);
	}
	if (!hasSettingSources) normalized.push(CLAUDE_SETTING_SOURCES_ARG, CLAUDE_SAFE_SETTING_SOURCES);
	if (permissionMode && !hasPermissionMode) normalized.push(CLAUDE_PERMISSION_MODE_ARG, permissionMode);
	return normalized;
}
/** Resolve whether a run preserves, removes, or sets a Claude CLI effort override. */
function resolveClaudeCliEffortArgAction(thinkingLevel, modelId) {
	switch (normalizeOptionalLowercaseString(thinkingLevel)) {
		case "off": return requiresClaudeMandatoryAdaptiveThinking({ id: modelId }) ? {
			mode: "set",
			effort: "low"
		} : { mode: "preserve" };
		case "minimal":
		case "low": return {
			mode: "set",
			effort: "low"
		};
		case "adaptive": return { mode: "omit" };
		case "medium": return {
			mode: "set",
			effort: "medium"
		};
		case "high": return {
			mode: "set",
			effort: "high"
		};
		case "xhigh": return {
			mode: "set",
			effort: "xhigh"
		};
		case "max": return {
			mode: "set",
			effort: "max"
		};
		default: return { mode: "preserve" };
	}
}
function stripClaudeEffortArgs(args) {
	const normalized = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (arg === CLAUDE_EFFORT_ARG) {
			const maybeValue = args[i + 1];
			if (typeof maybeValue === "string" && maybeValue.trim().length > 0 && !maybeValue.startsWith("-")) i += 1;
			continue;
		}
		if (arg.startsWith(`${CLAUDE_EFFORT_ARG}=`)) continue;
		normalized.push(arg);
	}
	return normalized;
}
const CLAUDE_SIDE_QUESTION_VARIADIC_VALUE_ARGS = /* @__PURE__ */ new Set([
	CLAUDE_ALLOWED_TOOLS_ARG,
	"--allowed-tools",
	CLAUDE_DISALLOWED_TOOLS_ARG,
	"--disallowed-tools",
	CLAUDE_TOOLS_ARG,
	CLAUDE_MCP_CONFIG_ARG
]);
const CLAUDE_RESTRICTED_VARIADIC_VALUE_ARGS = /* @__PURE__ */ new Set([
	.../* @__PURE__ */ new Set([
		CLAUDE_TOOLS_ARG,
		CLAUDE_ALLOWED_TOOLS_ARG,
		"--allowed-tools",
		CLAUDE_DISALLOWED_TOOLS_ARG,
		"--disallowed-tools"
	]),
	"--add-dir",
	"--file"
]);
const CLAUDE_RESTRICTED_VALUE_ARGS = /* @__PURE__ */ new Set([
	CLAUDE_PERMISSION_MODE_ARG,
	CLAUDE_SETTING_SOURCES_ARG,
	CLAUDE_SETTINGS_ARG,
	"--agent",
	"--agents",
	"--managed-settings",
	"--plugin-dir",
	"--plugin-dir-no-mcp",
	"--plugin-url",
	"--system-prompt",
	"--system-prompt-file",
	"--append-system-prompt",
	"--append-system-prompt-file"
]);
const CLAUDE_RESTRICTED_BARE_ARGS = /* @__PURE__ */ new Set([
	CLAUDE_BARE_ARG,
	CLAUDE_SAFE_MODE_ARG,
	CLAUDE_DISABLE_SLASH_COMMANDS_ARG,
	CLAUDE_CHROME_ARG,
	CLAUDE_NO_CHROME_ARG,
	CLAUDE_STRICT_MCP_CONFIG_ARG,
	CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG,
	"--allow-dangerously-skip-permissions",
	"--ide"
]);
const CLAUDE_SIDE_QUESTION_VALUE_ARGS = /* @__PURE__ */ new Set([
	CLAUDE_PERMISSION_MODE_ARG,
	CLAUDE_SESSION_ID_ARG,
	CLAUDE_RESUME_ARG,
	CLAUDE_RESUME_SESSION_AT_ARG,
	CLAUDE_RESUME_SHORT_ARG,
	CLAUDE_MAX_TURNS_ARG
]);
const CLAUDE_SIDE_QUESTION_BARE_ARGS = /* @__PURE__ */ new Set([
	CLAUDE_CONTINUE_ARG,
	CLAUDE_CONTINUE_SHORT_ARG,
	CLAUDE_FORK_SESSION_ARG,
	CLAUDE_BARE_ARG,
	CLAUDE_SAFE_MODE_ARG,
	CLAUDE_STRICT_MCP_CONFIG_ARG,
	CLAUDE_NO_SESSION_PERSISTENCE_ARG
]);
function stripClaudeArgs(args, policy) {
	const normalized = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		const equalsIndex = arg.indexOf("=");
		const argName = equalsIndex > 0 ? arg.slice(0, equalsIndex) : arg;
		if (policy.bare?.has(argName)) continue;
		if (policy.variadicValue?.has(argName)) {
			if (equalsIndex < 0) while (typeof args[i + 1] === "string" && !args[i + 1]?.startsWith("-")) i += 1;
			continue;
		}
		if (policy.value?.has(argName)) {
			if (equalsIndex < 0) {
				const maybeValue = args[i + 1];
				if (typeof maybeValue === "string" && !maybeValue.startsWith("-")) i += 1;
			}
			continue;
		}
		normalized.push(arg);
	}
	return normalized;
}
function stripClaudeSideQuestionConflictingArgs(args) {
	return stripClaudeArgs(args, {
		bare: CLAUDE_SIDE_QUESTION_BARE_ARGS,
		variadicValue: CLAUDE_SIDE_QUESTION_VARIADIC_VALUE_ARGS,
		value: CLAUDE_SIDE_QUESTION_VALUE_ARGS
	});
}
function resolveClaudeCliSideQuestionExecutionArgs(baseArgs) {
	return [
		...stripClaudeSideQuestionConflictingArgs(stripClaudeEffortArgs(baseArgs)),
		CLAUDE_SAFE_MODE_ARG,
		CLAUDE_TOOLS_ARG,
		CLAUDE_NO_TOOLS_VALUE,
		CLAUDE_DISALLOWED_TOOLS_ARG,
		CLAUDE_DENY_MCP_TOOLS_VALUE,
		CLAUDE_STRICT_MCP_CONFIG_ARG,
		CLAUDE_NO_SESSION_PERSISTENCE_ARG,
		CLAUDE_MAX_TURNS_ARG,
		"1",
		CLAUDE_PERMISSION_MODE_ARG,
		CLAUDE_DEFAULT_PERMISSION_MODE
	];
}
function resolveClaudeCliRestrictedExecutionArgs(baseArgs, availability) {
	const preservedDenials = [];
	for (let i = 0; i < baseArgs.length; i += 1) {
		const arg = baseArgs[i] ?? "";
		if (arg === CLAUDE_DISALLOWED_TOOLS_ARG || arg === "--disallowed-tools") while (typeof baseArgs[i + 1] === "string" && !baseArgs[i + 1]?.startsWith("-")) {
			i += 1;
			preservedDenials.push(...(baseArgs[i] ?? "").split(","));
		}
		else if (arg.startsWith(`${CLAUDE_DISALLOWED_TOOLS_ARG}=`) || arg.startsWith("--disallowed-tools=")) preservedDenials.push(...arg.slice(arg.indexOf("=") + 1).split(","));
	}
	const normalized = stripClaudeArgs(baseArgs, {
		bare: CLAUDE_RESTRICTED_BARE_ARGS,
		variadicValue: CLAUDE_RESTRICTED_VARIADIC_VALUE_ARGS,
		value: CLAUDE_RESTRICTED_VALUE_ARGS
	});
	normalized.push(CLAUDE_SETTING_SOURCES_ARG, "", CLAUDE_SETTINGS_ARG, CLAUDE_RESTRICTED_SETTINGS, CLAUDE_DISABLE_SLASH_COMMANDS_ARG, CLAUDE_NO_CHROME_ARG, CLAUDE_STRICT_MCP_CONFIG_ARG, CLAUDE_TOOLS_ARG, availability.native.join(","));
	if (availability.openClaw.length > 0) normalized.push(CLAUDE_ALLOWED_TOOLS_ARG, availability.openClaw.map((toolName) => `${OPENCLAW_MCP_TOOL_PREFIX}${toolName}`).join(","));
	const denials = [.../* @__PURE__ */ new Set([...preservedDenials.map((entry) => entry.trim()).filter(Boolean), ...availability.openClaw.length === 0 ? [CLAUDE_DENY_MCP_TOOLS_VALUE] : []])].toSorted();
	if (denials.length > 0) normalized.push(CLAUDE_DISALLOWED_TOOLS_ARG, denials.join(","));
	return normalized;
}
/** Resolve final Claude CLI execution args for one backend invocation. */
function resolveClaudeCliExecutionArgs(context, options = {}) {
	const executionArgs = (() => {
		if (context.executionMode === "side-question") return resolveClaudeCliSideQuestionExecutionArgs(context.baseArgs);
		const action = resolveClaudeCliEffortArgAction(context.thinkingLevel, context.modelId);
		switch (action.mode) {
			case "preserve": return [...context.baseArgs];
			case "omit": return stripClaudeEffortArgs(context.baseArgs);
			case "set": return [
				...stripClaudeEffortArgs(context.baseArgs),
				CLAUDE_EFFORT_ARG,
				action.effort
			];
			default: return action;
		}
	})();
	const resolvedArgs = context.toolAvailability ? resolveClaudeCliRestrictedExecutionArgs(executionArgs, context.toolAvailability) : executionArgs;
	return options.excludeDynamicSystemPromptSections && context.executionMode !== "side-question" ? [...resolvedArgs, CLAUDE_EXCLUDE_DYNAMIC_SYSTEM_PROMPT_SECTIONS_ARG] : resolvedArgs;
}
/** Normalize Claude CLI backend config before registration or execution. */
function normalizeClaudeBackendConfig(config, context) {
	const output = config.output ?? "jsonl";
	const input = config.input ?? "stdin";
	const permissionMode = isOpenClawRequestedYolo(context) ? CLAUDE_BYPASS_PERMISSION_MODE : void 0;
	return {
		...config,
		args: normalizeClaudeBackendArgs(config.args, permissionMode),
		resumeArgs: normalizeClaudeBackendArgs(config.resumeArgs, permissionMode),
		output,
		liveSession: config.liveSession ?? (output === "jsonl" && input === "stdin" ? "claude-stdio" : void 0),
		input
	};
}
//#endregion
export { resolveClaudeCliExecutionArgs as a, resolveClaudeCliAutoCompactEnv as i, normalizeClaudeBackendConfig as n, resolveClaudeCliThinkingEnv as o, parseClaudeCodeVersion as r, supportsClaudeDynamicSystemPromptSections as s, isClaudeCliProvider as t };
