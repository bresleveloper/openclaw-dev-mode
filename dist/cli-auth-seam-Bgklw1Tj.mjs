import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-CR3vyrK9.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { r as CLAUDE_CLI_CLEAR_ENV } from "./cli-constants-0f4y8Jm6.mjs";
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
