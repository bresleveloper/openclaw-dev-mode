import { a as CLAUDE_CLI_NATIVE_AUTH_MARKER, n as CLAUDE_CLI_CLEAR_ENV, t as CLAUDE_CLI_BACKEND_ID } from "./.setup/cli-constants-CXYrFWjU.mjs";
import { t as createClaudeCliTransport } from "./.setup/cli-transport-Bha-fPop.mjs";
import { filterStringEntries, isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { materializeWindowsSpawnProgram, resolveWindowsSpawnProgram } from "openclaw/plugin-sdk/windows-spawn";
import { addAbortListener } from "node:events";
import { requiresClaudeMandatoryAdaptiveThinking } from "openclaw/plugin-sdk/claude-model-runtime";
//#region extensions/anthropic/cli-auth-seam.ts
const CLAUDE_CLI_AUTH_TIMEOUT_MS = 1e4;
const CLAUDE_CLI_AUTH_METHODS = [
	"claude.ai",
	"api_key",
	"api_key_helper",
	"oauth_token",
	"third_party",
	"none"
];
const CLI_BACKEND_PRESERVE_ENV = "OPENCLAW_LIVE_CLI_BACKEND_PRESERVE_ENV";
function readPreservedCliEnv(env) {
	const raw = env[CLI_BACKEND_PRESERVE_ENV]?.trim();
	if (!raw) return /* @__PURE__ */ new Set();
	if (raw.startsWith("[")) try {
		return new Set(filterStringEntries(JSON.parse(raw)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
	return new Set(raw.split(/[,\s]+/).filter(Boolean));
}
/** Ask Claude CLI whether its own login is usable without reading token material. */
async function probeClaudeCliAuthStatus(params) {
	const env = { ...params?.env ?? process.env };
	const preserved = readPreservedCliEnv(env);
	for (const name of CLAUDE_CLI_CLEAR_ENV) if (!preserved.has(name)) delete env[name];
	try {
		const program = resolveWindowsSpawnProgram({
			command: params?.command ?? "claude",
			env,
			packageName: "@anthropic-ai/claude-code"
		});
		const invocation = materializeWindowsSpawnProgram(program, [
			"auth",
			"status",
			"--json"
		]);
		const result = await runUtf8CommandWithTimeout([invocation.command, ...invocation.argv], {
			baseEnv: env,
			maxOutputBytes: 65536,
			maxCombinedOutputBytes: 65536,
			terminateOnOutputLimit: true,
			timeoutMs: CLAUDE_CLI_AUTH_TIMEOUT_MS,
			signal: params?.signal,
			killProcessTree: true
		});
		params?.signal?.throwIfAborted();
		if (result.termination === "timeout") return {
			status: "timeout",
			timeoutMs: CLAUDE_CLI_AUTH_TIMEOUT_MS
		};
		if (result.termination !== "exit" || result.code === null) return { status: "unreadable" };
		const parsed = JSON.parse(result.stdout);
		if (!isRecord(parsed) || typeof parsed.loggedIn !== "boolean") return { status: "unreadable" };
		if (!parsed.loggedIn) return { status: "missing" };
		if (result.code !== 0) return { status: "unreadable" };
		const authMethod = CLAUDE_CLI_AUTH_METHODS.find((method) => method === parsed.authMethod);
		const email = authMethod === "claude.ai" ? normalizeOptionalString(parsed.email) : void 0;
		return {
			status: "available",
			...authMethod ? { authMethod } : {},
			...email && email.length <= 320 && !/[\r\n]/u.test(email) ? { email } : {}
		};
	} catch (error) {
		params?.signal?.throwIfAborted();
		return { status: isRecord(error) && error.code === "ENOENT" ? "not-installed" : "unreadable" };
	}
}
//#endregion
//#region extensions/anthropic/cli-model-discovery.ts
const INITIALIZE_TIMEOUT_MS = 3e4;
const NATIVE_EFFORT_LEVELS = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
/** Discover the native menu without submitting a user message or starting a turn. */
async function discoverClaudeCliModels(params) {
	params.signal?.throwIfAborted();
	const env = Object.fromEntries(Object.entries(params.env).filter((entry) => entry[1] !== void 0));
	for (const name of CLAUDE_CLI_CLEAR_ENV) delete env[name];
	const program = resolveWindowsSpawnProgram({
		command: "claude",
		env,
		packageName: "@anthropic-ai/claude-code"
	});
	const invocation = materializeWindowsSpawnProgram(program, [
		"--print",
		"--input-format",
		"stream-json",
		"--output-format",
		"stream-json",
		"--verbose",
		"--permission-prompt-tool",
		"stdio",
		"--setting-sources",
		"user",
		"--settings",
		"{\"disableAllHooks\":true,\"enabledPlugins\":{}}",
		"--strict-mcp-config",
		"--mcp-config",
		"{\"mcpServers\":{}}",
		"--tools",
		""
	]);
	const deadline = new AbortController();
	const timeout = setTimeout(() => deadline.abort(/* @__PURE__ */ new Error("Claude CLI model discovery timed out.")), INITIALIZE_TIMEOUT_MS);
	timeout.unref();
	const signal = params.signal ? AbortSignal.any([params.signal, deadline.signal]) : deadline.signal;
	const context = {
		command: invocation.command,
		args: invocation.argv,
		cwd: env.HOME ?? process.cwd(),
		env,
		abortSignal: signal,
		assertCurrent: () => signal.throwIfAborted()
	};
	let transport;
	let abortListener;
	try {
		transport = await createClaudeCliTransport({
			context,
			args: invocation.argv,
			currentContext: () => signal.aborted ? void 0 : context,
			initialize: { hooks: {} },
			onMessage: async () => {},
			onRequest: async () => {
				throw new Error("Model discovery cannot authorize native requests.");
			},
			onError: () => {}
		});
		abortListener = addAbortListener(signal, () => transport?.close());
		const response = await transport.initialize();
		signal.throwIfAborted();
		if (!Array.isArray(response.models)) throw new Error("Claude CLI initialization did not return a model menu.");
		const models = /* @__PURE__ */ new Map();
		const defaultAliasIds = /* @__PURE__ */ new Set();
		for (const option of response.models) {
			if (!isRecord(option) || typeof option.resolvedModel !== "string" || !option.resolvedModel.trim()) continue;
			const id = option.resolvedModel.trim();
			const displayName = typeof option.displayName === "string" ? option.displayName : id;
			const existing = models.get(id);
			if (existing) {
				if (option.value !== "default" && defaultAliasIds.delete(id)) existing.name = displayName;
				continue;
			}
			if (option.value === "default") defaultAliasIds.add(id);
			const levels = NATIVE_EFFORT_LEVELS.filter((level) => Array.isArray(option.supportedEffortLevels) && option.supportedEffortLevels.includes(level));
			models.set(id, {
				id,
				name: displayName,
				reasoning: levels.length > 0,
				input: ["text", "image"],
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				},
				maxTokens: 128e3,
				thinkingLevelMap: {
					off: requiresClaudeMandatoryAdaptiveThinking({ id }) ? null : "off",
					minimal: null,
					...Object.fromEntries(NATIVE_EFFORT_LEVELS.map((level) => [level, levels.includes(level) ? level : null]))
				}
			});
		}
		return [...models.values()];
	} finally {
		clearTimeout(timeout);
		abortListener?.[Symbol.dispose]();
		transport?.close();
		await transport?.waitForExit();
	}
}
//#endregion
//#region extensions/anthropic/provider-discovery.ts
const modelCaptures = /* @__PURE__ */ new WeakMap();
const availability = /* @__PURE__ */ new WeakMap();
async function prepareClaudeCliAuth({ config, provider, env = process.env, signal }) {
	signal?.throwIfAborted();
	if (!config || normalizeLowercaseStringOrEmpty(provider) !== "claude-cli") return;
	const environments = availability.get(config) ?? /* @__PURE__ */ new WeakMap();
	availability.set(config, environments);
	const captures = environments.get(env) ?? /* @__PURE__ */ new WeakMap();
	environments.set(env, captures);
	const owner = signal ?? config;
	const now = Date.now();
	let capture = captures.get(owner);
	if (!capture || capture.expiresAt <= now) {
		capture = {
			expiresAt: now + 6e4,
			pending: probeClaudeCliAuthStatus({
				env,
				signal
			})
		};
		captures.set(owner, capture);
	}
	const result = await capture.pending;
	signal?.throwIfAborted();
	return result.status !== "missing" && result.status !== "not-installed" ? {
		apiKey: CLAUDE_CLI_NATIVE_AUTH_MARKER,
		source: "Claude CLI native auth",
		mode: "oauth",
		nativeAuth: {
			runtime: CLAUDE_CLI_BACKEND_ID,
			mode: "oauth"
		}
	} : void 0;
}
const anthropicProviderDiscovery = {
	id: CLAUDE_CLI_BACKEND_ID,
	label: "Claude CLI",
	docsPath: "/providers/models",
	auth: [],
	catalog: {
		order: "simple",
		async run(ctx) {
			if (ctx.providerIds && !ctx.providerIds.includes("claude-cli")) return null;
			if (!(await prepareClaudeCliAuth({
				config: ctx.config,
				provider: "claude-cli",
				env: ctx.env,
				signal: ctx.signal
			}))?.apiKey) return null;
			ctx.signal?.throwIfAborted();
			const environments = modelCaptures.get(ctx.config) ?? /* @__PURE__ */ new WeakMap();
			modelCaptures.set(ctx.config, environments);
			const captures = environments.get(ctx.env) ?? /* @__PURE__ */ new WeakMap();
			environments.set(ctx.env, captures);
			const owner = ctx.signal ?? ctx.config;
			const pending = captures.get(owner) ?? discoverClaudeCliModels(ctx);
			captures.set(owner, pending);
			try {
				const models = await pending;
				ctx.signal?.throwIfAborted();
				return {
					providers: { [CLAUDE_CLI_BACKEND_ID]: {
						baseUrl: "https://api.anthropic.com",
						api: "anthropic-messages",
						models
					} },
					outcomes: [{
						provider: CLAUDE_CLI_BACKEND_ID,
						status: "ready",
						listedModelIds: models.map((model) => model.id)
					}]
				};
			} catch {
				ctx.signal?.throwIfAborted();
				return {
					providers: { [CLAUDE_CLI_BACKEND_ID]: {
						baseUrl: "https://api.anthropic.com",
						api: "anthropic-messages",
						models: []
					} },
					outcomes: [{
						provider: CLAUDE_CLI_BACKEND_ID,
						status: "unavailable"
					}]
				};
			}
		}
	},
	prepareSyntheticAuth: prepareClaudeCliAuth
};
//#endregion
export { anthropicProviderDiscovery as default };
