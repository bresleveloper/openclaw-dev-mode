import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-BwP7BByc.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import { r as CLAUDE_CLI_CLEAR_ENV } from "./cli-constants-Cgfnh_uF.mjs";
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
export { probeClaudeCliAuthStatus as t };
