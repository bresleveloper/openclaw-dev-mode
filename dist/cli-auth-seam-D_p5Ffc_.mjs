import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-xKp8ggmt.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import { i as CLAUDE_CLI_CLEAR_ENV } from "./cli-constants-D6douw4O.mjs";
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
export { probeClaudeCliAuthStatus as t };
