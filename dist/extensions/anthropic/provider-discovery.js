import { a as CLAUDE_CLI_NATIVE_AUTH_MARKER, n as CLAUDE_CLI_CLEAR_ENV, t as CLAUDE_CLI_BACKEND_ID } from "./.setup/cli-constants-ej8FmFRy.mjs";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { materializeWindowsSpawnProgram, resolveWindowsSpawnProgram } from "openclaw/plugin-sdk/windows-spawn";
//#region extensions/anthropic/cli-auth-seam.ts
const CLAUDE_CLI_AUTH_METHODS = [
	"claude.ai",
	"api_key",
	"api_key_helper",
	"oauth_token",
	"third_party",
	"none"
];
/** Ask Claude CLI whether its own login is usable without reading token material. */
async function probeClaudeCliAuthStatus(params) {
	const env = { ...params?.env ?? process.env };
	for (const name of CLAUDE_CLI_CLEAR_ENV) delete env[name];
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
			timeoutMs: 3e3,
			signal: params?.signal,
			killProcessTree: true
		});
		params?.signal?.throwIfAborted();
		if (result.termination !== "exit" || result.code === null) return { status: "unreadable" };
		if (result.code !== 0) return { status: "missing" };
		const parsed = JSON.parse(result.stdout);
		if (!isRecord(parsed) || parsed.loggedIn !== true) return { status: "missing" };
		const authMethod = CLAUDE_CLI_AUTH_METHODS.find((method) => method === parsed.authMethod);
		const email = authMethod === "claude.ai" ? normalizeOptionalString(parsed.email) : void 0;
		return {
			status: "available",
			...authMethod ? { authMethod } : {},
			...email && email.length <= 320 && !/[\r\n]/u.test(email) ? { email } : {}
		};
	} catch {
		params?.signal?.throwIfAborted();
		return { status: "unreadable" };
	}
}
//#endregion
//#region extensions/anthropic/provider-discovery.ts
const availability = /* @__PURE__ */ new WeakMap();
const anthropicProviderDiscovery = {
	id: CLAUDE_CLI_BACKEND_ID,
	label: "Claude CLI",
	docsPath: "/providers/models",
	auth: [],
	async prepareSyntheticAuth({ config, provider, env = process.env, signal }) {
		signal?.throwIfAborted();
		if (!config || normalizeLowercaseStringOrEmpty(provider) !== "claude-cli") return;
		const environments = availability.get(config) ?? /* @__PURE__ */ new WeakMap();
		availability.set(config, environments);
		const captures = environments.get(env) ?? /* @__PURE__ */ new WeakMap();
		environments.set(env, captures);
		const owner = signal ?? config;
		const pending = captures.get(owner) ?? probeClaudeCliAuthStatus({
			env,
			signal
		});
		captures.set(owner, pending);
		const result = await pending;
		signal?.throwIfAborted();
		return result.status === "available" ? {
			apiKey: CLAUDE_CLI_NATIVE_AUTH_MARKER,
			source: "Claude CLI native auth",
			mode: "oauth"
		} : void 0;
	}
};
//#endregion
export { anthropicProviderDiscovery as default };
