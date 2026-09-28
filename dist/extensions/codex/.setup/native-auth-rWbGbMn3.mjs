import { d as readCodexPluginConfig } from "./config-parsing-CcB9iPoq.mjs";
import { n as isCodexAppServerProxyLaunch, t as buildCodexLoginStatusArgs } from "./launch-args-DbFCehO7.mjs";
import { r as resolveManagedCodexAppServerStartOptions } from "./managed-binary-BnshlFag.mjs";
import { n as resolveCodexAppServerSpawnEnv } from "./transport-stdio-h2VHOskC.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { materializeWindowsSpawnProgram, resolveWindowsSpawnProgram } from "openclaw/plugin-sdk/windows-spawn";
//#region extensions/codex/src/app-server/native-auth.ts
const OPENAI_LOGIN_MODES = {
	"Logged in using ChatGPT": "oauth",
	"Logged in using access token": "token",
	"Logged in using personal access token": "token"
};
/** Ask the selected native binary about its own store; retain no credential material. */
async function probeCodexNativeAuth(params) {
	params.signal?.throwIfAborted();
	try {
		const pluginConfig = readCodexPluginConfig(params.pluginConfig ?? params.config?.plugins?.entries?.codex?.config);
		const options = resolveCodexAppServerRuntimeOptions({
			pluginConfig,
			env: params.env
		});
		if (options.start.transport !== "stdio" || options.start.homeScope !== "user" || isCodexAppServerProxyLaunch(options.start.args)) return;
		const start = await resolveManagedCodexAppServerStartOptions(options.start, { pluginRoot: params.pluginRoot });
		if (start.transport !== "stdio") return;
		const env = resolveCodexAppServerSpawnEnv(start, params.env ?? process.env);
		const invocation = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
			command: start.command,
			env,
			packageName: "@openai/codex"
		}), buildCodexLoginStatusArgs(start.args));
		const result = await runUtf8CommandWithTimeout([invocation.command, ...invocation.argv], {
			baseEnv: env,
			timeoutMs: 3e3,
			signal: params.signal,
			killProcessTree: true
		});
		params.signal?.throwIfAborted();
		if (result.termination !== "exit" || result.code !== 0) return;
		const line = `${result.stdout}\n${result.stderr}`.split("\n").map((value) => value.trim()).find((value) => value.startsWith("Logged in using "));
		const mode = line?.startsWith("Logged in using an API key - ") ? "api-key" : line ? OPENAI_LOGIN_MODES[line] : void 0;
		return mode ? {
			apiKey: "codex-app-server",
			source: "Codex native login",
			mode,
			nativeAuth: {
				runtime: "codex",
				mode
			}
		} : void 0;
	} catch {
		params.signal?.throwIfAborted();
		return;
	}
}
//#endregion
export { probeCodexNativeAuth };
