import { n as parseClaudeCliJsonlEvent, r as parseClaudeCliJsonlLifecycleEvent } from "./cli-output-EjggqnXd.mjs";
import { a as CLAUDE_CLI_DEFAULT_MODEL_REF, d as CLAUDE_CLI_SESSION_ID_FIELDS, o as CLAUDE_CLI_MODEL_ALIASES, r as CLAUDE_CLI_CLEAR_ENV, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-0f4y8Jm6.mjs";
import { a as resolveClaudeCliExecutionArgs, i as resolveClaudeCliAutoCompactEnv, n as normalizeClaudeBackendConfig, o as resolveClaudeCliThinkingEnv } from "./cli-shared-BBdnRLY0.mjs";
import { createHmac, randomBytes } from "node:crypto";
//#region extensions/anthropic/cli-backend.ts
/**
* Claude CLI backend descriptor. It configures Claude Code process arguments,
* MCP bundling, session handling, and credential transport.
*/
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
/** Build the Claude CLI backend plugin descriptor. */
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
		toolAvailabilityEnforcement: "execution-args",
		isolatesInstructionsWithExactTools: true,
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
					const { executeClaudeCli } = await import("./extensions/anthropic/cli.runtime.js");
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
export { buildAnthropicCliBackend as t };
