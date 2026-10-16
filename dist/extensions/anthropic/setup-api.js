import { i as CLAUDE_CLI_MODEL_ALIASES, n as CLAUDE_CLI_CLEAR_ENV, o as CLAUDE_CLI_SESSION_ID_FIELDS, r as CLAUDE_CLI_DEFAULT_MODEL_REF, s as OPENCLAW_MCP_TOOL_PREFIX, t as CLAUDE_CLI_BACKEND_ID } from "./.setup/cli-constants-DdiQJ1Sq.mjs";
import { n as parseClaudeCliJsonlEvent, r as parseClaudeCliJsonlLifecycleEvent } from "./.setup/cli-output-iGeO18JR.mjs";
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createHmac, randomBytes } from "node:crypto";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { requiresClaudeMandatoryAdaptiveThinking, resolveClaudeHaiku55ModelIdentity } from "openclaw/plugin-sdk/claude-model-runtime";
import { resolveExecModePolicy } from "openclaw/plugin-sdk/exec-approvals-runtime";
//#region extensions/anthropic/cli-shared.ts
const CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG = "--dangerously-skip-permissions";
const CLAUDE_PERMISSION_MODE_ARG = "--permission-mode";
const CLAUDE_SETTING_SOURCES_ARG = "--setting-sources";
const CLAUDE_EXCLUDE_DYNAMIC_SYSTEM_PROMPT_SECTIONS_ARG = "--exclude-dynamic-system-prompt-sections";
const CLAUDE_SETTINGS_ARG = "--settings";
const CLAUDE_EFFORT_ARG = "--effort";
const CLAUDE_BARE_ARG = "--bare";
const CLAUDE_SAFE_MODE_ARG = "--safe-mode";
const CLAUDE_DISABLE_SLASH_COMMANDS_ARG = "--disable-slash-commands";
const CLAUDE_NO_CHROME_ARG = "--no-chrome";
const CLAUDE_TOOLS_ARG = "--tools";
const CLAUDE_ALLOWED_TOOLS_ARG = "--allowedTools";
const CLAUDE_DISALLOWED_TOOLS_ARG = "--disallowedTools";
const CLAUDE_STRICT_MCP_CONFIG_ARG = "--strict-mcp-config";
const CLAUDE_NO_SESSION_PERSISTENCE_ARG = "--no-session-persistence";
const CLAUDE_MAX_TURNS_ARG = "--max-turns";
const CLAUDE_SAFE_SETTING_SOURCES = "user";
const CLAUDE_DENY_MCP_TOOLS_VALUE = "mcp__*";
const CLAUDE_RESTRICTED_SETTINGS = "{\"disableAllHooks\":true,\"enabledPlugins\":{},\"autoMemoryEnabled\":false,\"claudeMdExcludes\":[\"**/CLAUDE.md\",\"**/CLAUDE.local.md\",\"**/.claude/rules/**\"]}";
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
	if (requiresClaudeMandatoryAdaptiveThinking({ id: modelId }) || thinkingLevel !== "off" && resolveClaudeHaiku55ModelIdentity({ id: modelId })) return;
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
function applyClaudeCliEffortArgs(args, thinkingLevel, modelId) {
	const level = normalizeOptionalLowercaseString(thinkingLevel);
	switch (level) {
		case "off": return requiresClaudeMandatoryAdaptiveThinking({ id: modelId }) ? [
			...stripClaudeEffortArgs(args),
			CLAUDE_EFFORT_ARG,
			"low"
		] : [...args];
		case "minimal":
		case "low": return [
			...stripClaudeEffortArgs(args),
			CLAUDE_EFFORT_ARG,
			"low"
		];
		case "adaptive": return stripClaudeEffortArgs(args);
		case "medium":
		case "high":
		case "xhigh":
		case "max": return [
			...stripClaudeEffortArgs(args),
			CLAUDE_EFFORT_ARG,
			level
		];
		default: return [...args];
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
	"--mcp-config"
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
	"--chrome",
	CLAUDE_NO_CHROME_ARG,
	CLAUDE_STRICT_MCP_CONFIG_ARG,
	CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG,
	"--allow-dangerously-skip-permissions",
	"--ide"
]);
const CLAUDE_SIDE_QUESTION_VALUE_ARGS = /* @__PURE__ */ new Set([
	CLAUDE_PERMISSION_MODE_ARG,
	"--session-id",
	"--resume",
	"--resume-session-at",
	"-r",
	CLAUDE_MAX_TURNS_ARG
]);
const CLAUDE_SIDE_QUESTION_BARE_ARGS = /* @__PURE__ */ new Set([
	"--continue",
	"-c",
	"--fork-session",
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
function resolveClaudeCliSideQuestionExecutionArgs(baseArgs) {
	return [
		...stripClaudeArgs(stripClaudeEffortArgs(baseArgs), {
			bare: CLAUDE_SIDE_QUESTION_BARE_ARGS,
			variadicValue: CLAUDE_SIDE_QUESTION_VARIADIC_VALUE_ARGS,
			value: CLAUDE_SIDE_QUESTION_VALUE_ARGS
		}),
		CLAUDE_SAFE_MODE_ARG,
		CLAUDE_TOOLS_ARG,
		"",
		CLAUDE_DISALLOWED_TOOLS_ARG,
		CLAUDE_DENY_MCP_TOOLS_VALUE,
		CLAUDE_STRICT_MCP_CONFIG_ARG,
		CLAUDE_NO_SESSION_PERSISTENCE_ARG,
		CLAUDE_MAX_TURNS_ARG,
		"1",
		CLAUDE_PERMISSION_MODE_ARG,
		"default"
	];
}
function readClaudeToolDenials(args) {
	const denials = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (arg === CLAUDE_DISALLOWED_TOOLS_ARG || arg === "--disallowed-tools") while (typeof args[i + 1] === "string" && !args[i + 1]?.startsWith("-")) {
			i += 1;
			denials.push(...(args[i] ?? "").split(","));
		}
		else if (arg.startsWith(`${CLAUDE_DISALLOWED_TOOLS_ARG}=`) || arg.startsWith("--disallowed-tools=")) denials.push(...arg.slice(arg.indexOf("=") + 1).split(","));
	}
	return denials;
}
function resolveClaudeCliRestrictedExecutionArgs(baseArgs, availability) {
	const preservedDenials = readClaudeToolDenials(baseArgs);
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
function resolveClaudeCliExecutionArgs(context, options = {}) {
	const baseArgs = context.hostOwnedTools?.includes("exec") ? [
		...stripClaudeArgs(context.baseArgs, { variadicValue: /* @__PURE__ */ new Set([CLAUDE_DISALLOWED_TOOLS_ARG, "--disallowed-tools"]) }),
		CLAUDE_DISALLOWED_TOOLS_ARG,
		[.../* @__PURE__ */ new Set([...readClaudeToolDenials(context.baseArgs), "Bash"])].join(",")
	] : context.baseArgs;
	const executionArgs = context.executionMode === "side-question" ? resolveClaudeCliSideQuestionExecutionArgs(baseArgs) : applyClaudeCliEffortArgs(baseArgs, context.thinkingLevel, context.modelId);
	const resolvedArgs = context.toolAvailability ? resolveClaudeCliRestrictedExecutionArgs(executionArgs, context.toolAvailability) : executionArgs;
	return options.excludeDynamicSystemPromptSections && context.executionMode !== "side-question" ? [...resolvedArgs, CLAUDE_EXCLUDE_DYNAMIC_SYSTEM_PROMPT_SECTIONS_ARG] : resolvedArgs;
}
function normalizeClaudeBackendConfig(config, context) {
	const output = config.output ?? "jsonl";
	const input = config.input ?? "stdin";
	const permissionMode = isOpenClawRequestedYolo(context) ? "bypassPermissions" : void 0;
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
//#region extensions/anthropic/cli-tool-naming.ts
const CLAUDE_CLI_TOOL_NAMING_HEADING = "## OpenClaw tool names in Claude Code";
const CLAUDE_CLI_TOOL_NAMING_SECTION = [CLAUDE_CLI_TOOL_NAMING_HEADING, `OpenClaw MCP: \`${OPENCLAW_MCP_TOOL_PREFIX}<name>\`. Deferred: ToolSearch \`select:${OPENCLAW_MCP_TOOL_PREFIX}<name>\` first.`].join("\n");
const CLAUDE_CLI_MESSAGE_TOOL_GUIDANCE = `Tool-only replies: \`${OPENCLAW_MCP_TOOL_PREFIX}message(action=send)\`. Native \`SendMessage\`/\`PushNotification\` cannot deliver OpenClaw replies.`;
function appendClaudeCliToolNamingGuidance(systemPrompt, toolNames = []) {
	if (toolNames.length === 0 || !systemPrompt.trim() || systemPrompt.includes(CLAUDE_CLI_TOOL_NAMING_HEADING)) return systemPrompt;
	const messageGuidance = toolNames.includes("message") ? `\n${CLAUDE_CLI_MESSAGE_TOOL_GUIDANCE}` : "";
	return `${systemPrompt}\n\n${CLAUDE_CLI_TOOL_NAMING_SECTION}${messageGuidance}\n`;
}
//#endregion
//#region extensions/anthropic/cli-backend.ts
const CLAUDE_CLI_CREDENTIAL_FINGERPRINT_KEY = randomBytes(32);
const CLAUDE_CLI_DEFAULT_ARGS = [
	"-p",
	"--output-format",
	"stream-json",
	"--include-partial-messages",
	"--verbose",
	"--setting-sources",
	"user",
	"--allowedTools",
	"mcp__openclaw__*",
	"--disallowedTools",
	"ScheduleWakeup,CronCreate,Bash(run_in_background:true),Monitor"
];
const CLAUDE_NATIVE_TOOL_CAPABILITIES = {
	read: "read",
	grep: "read",
	write: "write",
	edit: "edit",
	bash: "exec",
	webfetch: "web_fetch",
	websearch: "web_search"
};
function projectClaudeNativeToolAuthority(nativeTools) {
	const selected = new Set(nativeTools.map((name) => name.trim().toLowerCase()));
	return [...new Set(Object.entries(CLAUDE_NATIVE_TOOL_CAPABILITIES).filter(([name]) => selected.has(name)).map(([, capability]) => capability))];
}
function createClaudeCliAuthInput(params) {
	const trimmed = params.value.trim();
	if (!trimmed) return;
	const source = Buffer.from(trimmed, "utf8");
	let destroyed = false;
	return {
		env: { [params.envName]: "3" },
		clearEnv: [...CLAUDE_CLI_CLEAR_ENV],
		secretInput: {
			fd: 3,
			fingerprint: createHmac("sha256", CLAUDE_CLI_CREDENTIAL_FINGERPRINT_KEY).update(source).digest("hex"),
			createData: () => {
				if (destroyed) throw new Error("Claude CLI credential input is no longer available");
				return Buffer.from(source);
			}
		},
		cleanup: async () => {
			destroyed = true;
			source.fill(0);
		}
	};
}
function resolveClaudeCliAuthInput(credential) {
	if (credential?.type === "oauth" && "access" in credential) {
		const expires = "expires" in credential ? credential.expires : void 0;
		if (typeof expires !== "number" || !Number.isFinite(expires) || expires <= Date.now()) throw new Error("Selected Claude CLI OAuth credential is expired or invalid. Re-authenticate the selected profile and retry. OpenClaw did not start the run.");
		if (typeof credential.access !== "string") return;
		return createClaudeCliAuthInput({
			envName: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
			value: credential.access
		});
	}
	if (credential?.type === "token" && "token" in credential && typeof credential.token === "string") return createClaudeCliAuthInput({
		envName: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
		value: credential.token
	});
	if (credential?.type === "api_key" && "key" in credential && typeof credential.key === "string") return createClaudeCliAuthInput({
		envName: "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
		value: credential.key
	});
}
function buildAnthropicCliBackend(options = {}) {
	return {
		id: CLAUDE_CLI_BACKEND_ID,
		modelProvider: "anthropic",
		liveTest: {
			defaultModelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			defaultImageProbe: true,
			defaultMcpProbe: true,
			docker: {
				npmPackage: "@anthropic-ai/claude-code",
				binaryName: "claude"
			}
		},
		runtimeArtifact: {
			kind: "bundled-package-tree",
			packageName: "@anthropic-ai/claude-code",
			entrypoint: "command",
			nativeExecutableNames: ["claude", "claude.exe"]
		},
		bundleMcp: true,
		bundleMcpMode: "claude-config-file",
		nativeToolMode: "selectable",
		hostOwnedTools: ["exec", "process"],
		toolAvailabilityEnforcement: "execution-args",
		isolatesInstructionsWithExactTools: true,
		transformSystemPrompt: ({ systemPrompt, openClawMcpToolNames }) => appendClaudeCliToolNamingGuidance(systemPrompt, openClawMcpToolNames),
		projectNativeToolAuthority: projectClaudeNativeToolAuthority,
		sideQuestionToolMode: "disabled",
		ownsNativeCompaction: true,
		manualCompaction: {
			buildPrompt: (customInstructions) => {
				const instructions = customInstructions?.trim();
				return instructions ? `/compact ${instructions}` : "/compact";
			},
			input: "arg",
			validateOutput: (rawOutput) => {
				for (const line of rawOutput.split("\n")) try {
					const event = JSON.parse(line);
					if (event.compact_result === "success" || event.type === "system" && event.subtype === "compact_boundary") return { ok: true };
				} catch {}
				return {
					ok: false,
					reason: "Claude CLI did not confirm that native compaction ran."
				};
			}
		},
		subscriptionAuthDispatch: true,
		config: {
			command: "claude",
			args: [...CLAUDE_CLI_DEFAULT_ARGS],
			resumeArgs: [
				...CLAUDE_CLI_DEFAULT_ARGS,
				"--resume",
				"{sessionId}"
			],
			forkArg: "--fork-session",
			resumeAtArg: "--resume-session-at",
			output: "jsonl",
			liveSession: "claude-stdio",
			input: "stdin",
			modelArg: "--model",
			modelAliases: CLAUDE_CLI_MODEL_ALIASES,
			imageArg: "@",
			imagePathScope: "workspace",
			sessionArgs: ["--session-id", "{sessionId}"],
			sessionMode: "always",
			reseedFromRawTranscriptWhenUncompacted: true,
			freshSessionRecovery: "invalidated-only",
			sessionIdFields: [...CLAUDE_CLI_SESSION_ID_FIELDS],
			systemPromptFileArg: "--append-system-prompt-file",
			systemPromptMode: "append",
			systemPromptWhen: "always",
			clearEnv: [...CLAUDE_CLI_CLEAR_ENV],
			serialize: true
		},
		normalizeConfig: normalizeClaudeBackendConfig,
		resolveModelId: ({ modelId, contextWindow }) => contextWindow === "1m" ? `${modelId}[1m]` : modelId,
		authEpochMode: "profile-only",
		autoSelectAuthProfile: false,
		prepareExecution: (context) => {
			const prepare = () => {
				const credentialContext = context;
				const authInput = resolveClaudeCliAuthInput(credentialContext.authCredential);
				const isolatedCompletion = credentialContext.isolatedCompletionPrompt !== void 0;
				const cliExecution = !isolatedCompletion && context.executionMode === "agent" ? { async *execute(executionContext) {
					const { executeClaudeCli } = await import("./.setup/cli.runtime-5Pq7Tvht.mjs");
					executionContext.assertCurrent?.();
					yield* executeClaudeCli(executionContext, authInput?.secretInput);
				} } : void 0;
				return {
					env: {
						CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS: "1",
						...resolveClaudeCliAutoCompactEnv(context.contextTokenBudget),
						...context.contextWindow === "200k" ? { CLAUDE_CODE_DISABLE_1M_CONTEXT: "1" } : {},
						...resolveClaudeCliThinkingEnv(context.thinkingLevel, context.modelId),
						...authInput?.env
					},
					...isolatedCompletion ? { isolatedCompletionEnforced: true } : {},
					...authInput?.clearEnv ? { clearEnv: authInput.clearEnv } : {},
					...authInput?.secretInput ? { secretInput: authInput.secretInput } : {},
					...authInput?.cleanup ? { cleanup: authInput.cleanup } : {},
					...cliExecution
				};
			};
			const supportProbe = options.ensureDynamicSystemPromptSectionsSupport?.();
			return supportProbe ? supportProbe.then(prepare) : prepare();
		},
		parseJsonlEvent: parseClaudeCliJsonlEvent,
		parseJsonlLifecycleEvent: parseClaudeCliJsonlLifecycleEvent,
		resolveExecutionArgs: (context) => resolveClaudeCliExecutionArgs(context, { excludeDynamicSystemPromptSections: options.supportsDynamicSystemPromptSections?.() })
	};
}
//#endregion
//#region extensions/anthropic/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "anthropic",
	name: "Anthropic Setup",
	description: "Lightweight Anthropic setup hooks",
	register(api) {
		api.registerCliBackend(buildAnthropicCliBackend());
	}
});
//#endregion
export { setup_api_default as default };
