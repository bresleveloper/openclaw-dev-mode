import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-DrUvDt2r.js";
//#region extensions/anthropic/cli-shared.ts
/** Environment variables removed before launching OpenClaw-managed Claude CLI runs. */
const CLAUDE_CLI_CLEAR_ENV = [
	"ANTHROPIC_API_KEY",
	"ANTHROPIC_API_KEY_OLD",
	"ANTHROPIC_API_TOKEN",
	"ANTHROPIC_AUTH_TOKEN",
	"ANTHROPIC_BASE_URL",
	"ANTHROPIC_CUSTOM_HEADERS",
	"ANTHROPIC_OAUTH_TOKEN",
	"ANTHROPIC_UNIX_SOCKET",
	"CLAUDE_CONFIG_DIR",
	"CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
	"CLAUDE_CODE_ENTRYPOINT",
	"CLAUDE_CODE_OAUTH_REFRESH_TOKEN",
	"CLAUDE_CODE_OAUTH_SCOPES",
	"CLAUDE_CODE_OAUTH_TOKEN",
	"CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
	"CLAUDE_CODE_PLUGIN_CACHE_DIR",
	"CLAUDE_CODE_PLUGIN_SEED_DIR",
	"CLAUDE_CODE_REMOTE",
	"CLAUDE_CODE_USE_COWORK_PLUGINS",
	"CLAUDE_CODE_USE_BEDROCK",
	"CLAUDE_CODE_USE_FOUNDRY",
	"CLAUDE_CODE_USE_VERTEX",
	"OTEL_EXPORTER_OTLP_ENDPOINT",
	"OTEL_EXPORTER_OTLP_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_LOGS_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_PROTOCOL",
	"OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_METRICS_HEADERS",
	"OTEL_EXPORTER_OTLP_METRICS_PROTOCOL",
	"OTEL_EXPORTER_OTLP_PROTOCOL",
	"OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
	"OTEL_EXPORTER_OTLP_TRACES_HEADERS",
	"OTEL_EXPORTER_OTLP_TRACES_PROTOCOL",
	"OTEL_LOGS_EXPORTER",
	"OTEL_METRICS_EXPORTER",
	"OTEL_SDK_DISABLED",
	"OTEL_TRACES_EXPORTER"
];
const CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG = "--dangerously-skip-permissions";
const CLAUDE_PERMISSION_MODE_ARG = "--permission-mode";
const CLAUDE_SETTING_SOURCES_ARG = "--setting-sources";
const CLAUDE_EFFORT_ARG = "--effort";
const CLAUDE_BARE_ARG = "--bare";
const CLAUDE_SAFE_MODE_ARG = "--safe-mode";
const CLAUDE_TOOLS_ARG = "--tools";
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
/** Explicit thinking opt-out for Claude CLI routes unsupported by Claude Code. */
const CLAUDE_CLI_OFF_THINKING_PROFILE = {
	levels: [{ id: "off" }],
	defaultLevel: "off"
};
/** Return whether a provider id refers to the Claude CLI backend. */
function isClaudeCliProvider(providerId) {
	return normalizeOptionalLowercaseString(providerId) === CLAUDE_CLI_BACKEND_ID;
}
function isOpenClawRequestedYolo(context) {
	const exec = (context?.agentId ? context.config?.agents?.list?.find((agent) => agent.id === context.agentId)?.tools?.exec : void 0) ?? context?.config?.tools?.exec;
	const security = exec?.security ?? "full";
	const ask = exec?.ask ?? "off";
	return security === "full" && ask === "off";
}
/** Resolve Claude permission mode from OpenClaw exec security settings. */
function resolveClaudePermissionMode(context) {
	return isOpenClawRequestedYolo(context) ? {
		mode: CLAUDE_BYPASS_PERMISSION_MODE,
		overrideExisting: false
	} : { overrideExisting: false };
}
/** Normalize Claude permission arguments, removing legacy skip-permissions flags. */
function normalizeClaudePermissionArgs(args, options) {
	if (!args) return options?.mode ? [CLAUDE_PERMISSION_MODE_ARG, options.mode] : args;
	const normalized = [];
	let hasPermissionMode = false;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG) continue;
		if (arg === CLAUDE_PERMISSION_MODE_ARG) {
			const maybeValue = args[i + 1];
			if (typeof maybeValue === "string" && maybeValue.trim().length > 0 && !maybeValue.startsWith("-")) {
				hasPermissionMode = true;
				if (!options?.overrideExisting) {
					normalized.push(arg);
					normalized.push(maybeValue);
				}
				i += 1;
			}
			continue;
		}
		if (arg.startsWith(`${CLAUDE_PERMISSION_MODE_ARG}=`)) {
			const maybeValue = arg.slice(`${CLAUDE_PERMISSION_MODE_ARG}=`.length).trim();
			if (maybeValue.length > 0 && !maybeValue.startsWith("-")) {
				hasPermissionMode = true;
				if (!options?.overrideExisting) normalized.push(`${CLAUDE_PERMISSION_MODE_ARG}=${maybeValue}`);
			}
			continue;
		}
		normalized.push(arg);
	}
	if (options?.mode && (!hasPermissionMode || options.overrideExisting)) normalized.push(CLAUDE_PERMISSION_MODE_ARG, options.mode);
	return normalized;
}
/** Ensure Claude CLI setting sources stay restricted to user settings. */
function normalizeClaudeSettingSourcesArgs(args) {
	if (!args) return args;
	const normalized = [];
	let hasSettingSources = false;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === CLAUDE_SETTING_SOURCES_ARG) {
			const maybeValue = args[i + 1];
			if (typeof maybeValue === "string" && maybeValue.trim().length > 0 && !maybeValue.startsWith("-")) {
				hasSettingSources = true;
				normalized.push(arg, CLAUDE_SAFE_SETTING_SOURCES);
				i += 1;
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
	return normalized;
}
/** Map OpenClaw thinking levels to Claude CLI effort flags for a model id. */
function mapClaudeCliThinkingLevelToEffort(thinkingLevel) {
	switch (normalizeOptionalLowercaseString(thinkingLevel)) {
		case "minimal":
		case "low": return "low";
		case "adaptive":
		case "medium": return "medium";
		case "high": return "high";
		case "xhigh": return "xhigh";
		case "max": return "max";
		default: return;
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
const CLAUDE_SIDE_QUESTION_VARIADIC_VALUE_ARGS = new Set([
	"--allowedTools",
	"--allowed-tools",
	CLAUDE_DISALLOWED_TOOLS_ARG,
	"--disallowed-tools",
	CLAUDE_TOOLS_ARG,
	CLAUDE_MCP_CONFIG_ARG
]);
const CLAUDE_SIDE_QUESTION_VALUE_ARGS = new Set([
	CLAUDE_PERMISSION_MODE_ARG,
	CLAUDE_SESSION_ID_ARG,
	CLAUDE_RESUME_ARG,
	CLAUDE_RESUME_SESSION_AT_ARG,
	CLAUDE_RESUME_SHORT_ARG,
	CLAUDE_MAX_TURNS_ARG
]);
const CLAUDE_SIDE_QUESTION_BARE_ARGS = new Set([
	CLAUDE_CONTINUE_ARG,
	CLAUDE_CONTINUE_SHORT_ARG,
	CLAUDE_FORK_SESSION_ARG,
	CLAUDE_BARE_ARG,
	CLAUDE_SAFE_MODE_ARG,
	CLAUDE_STRICT_MCP_CONFIG_ARG,
	CLAUDE_NO_SESSION_PERSISTENCE_ARG
]);
function stripClaudeSideQuestionConflictingArgs(args) {
	const normalized = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		const equalsIndex = arg.indexOf("=");
		const argName = equalsIndex > 0 ? arg.slice(0, equalsIndex) : arg;
		if (CLAUDE_SIDE_QUESTION_BARE_ARGS.has(argName)) continue;
		if (CLAUDE_SIDE_QUESTION_VARIADIC_VALUE_ARGS.has(argName)) {
			if (equalsIndex < 0) while (typeof args[i + 1] === "string" && !args[i + 1]?.startsWith("-")) i += 1;
			continue;
		}
		if (CLAUDE_SIDE_QUESTION_VALUE_ARGS.has(argName)) {
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
/** Resolve final Claude CLI execution args for one backend invocation. */
function resolveClaudeCliExecutionArgs(context) {
	if (context.executionMode === "side-question") return resolveClaudeCliSideQuestionExecutionArgs(context.baseArgs);
	const effort = mapClaudeCliThinkingLevelToEffort(context.thinkingLevel);
	if (!effort) return [...context.baseArgs];
	return [
		...stripClaudeEffortArgs(context.baseArgs),
		CLAUDE_EFFORT_ARG,
		effort
	];
}
/** Normalize Claude CLI backend config before registration or execution. */
function normalizeClaudeBackendConfig(config, context) {
	const output = config.output ?? "jsonl";
	const input = config.input ?? "stdin";
	const permission = resolveClaudePermissionMode(context);
	return {
		...config,
		args: normalizeClaudePermissionArgs(normalizeClaudeSettingSourcesArgs(config.args), permission),
		resumeArgs: normalizeClaudePermissionArgs(normalizeClaudeSettingSourcesArgs(config.resumeArgs), permission),
		output,
		liveSession: config.liveSession ?? (output === "jsonl" && input === "stdin" ? "claude-stdio" : void 0),
		input
	};
}
//#endregion
export { normalizeClaudeBackendConfig as a, resolveClaudeCliExecutionArgs as c, mapClaudeCliThinkingLevelToEffort as i, resolveClaudePermissionMode as l, CLAUDE_CLI_OFF_THINKING_PROFILE as n, normalizeClaudePermissionArgs as o, isClaudeCliProvider as r, normalizeClaudeSettingSourcesArgs as s, CLAUDE_CLI_CLEAR_ENV as t };
