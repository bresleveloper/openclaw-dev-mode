import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as requiresClaudeMandatoryAdaptiveThinking } from "./anthropic-B3HirzdP.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-BwP7BByc.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./claude-model-runtime-DVcp3OW0.mjs";
import { r as CLAUDE_CLI_CLEAR_ENV } from "./cli-constants-Cgfnh_uF.mjs";
import { t as createClaudeCliTransport } from "./cli-transport-De0_jwTN.mjs";
import { addAbortListener } from "node:events";
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
export { discoverClaudeCliModels as t };
