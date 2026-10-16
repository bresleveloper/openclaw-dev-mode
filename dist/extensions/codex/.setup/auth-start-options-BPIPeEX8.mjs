import { r as normalizeCodexAppServerArgs } from "./launch-args-DbFCehO7.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { homedir } from "node:os";
//#region extensions/codex/src/app-server/auth-start-options.ts
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE = "cli_auth_credentials_store=\"ephemeral\"";
function resolveCodexAppServerHomeDir(agentDir) {
	if (!agentDir) throw new Error("Agent-scoped Codex requires an OpenClaw agent directory");
	return path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME);
}
/** Resolves the native user Codex home used by Desktop and the CLI. */
function resolveCodexAppServerUserHomeDir(env = process.env, homedir$1 = homedir) {
	const configured = normalizeOptionalString(env.CODEX_HOME);
	return path.resolve(configured ?? path.join(homedir$1(), ".codex"));
}
/** Resolves the local CODEX_HOME used when starting one app-server connection. */
function resolveCodexAppServerLocalHomeDir(startOptions, agentDir, env = process.env) {
	if (startOptions.codexHome) return startOptions.codexHome;
	const configured = startOptions.env?.CODEX_HOME;
	if (configured?.trim()) return configured;
	return startOptions.homeScope === "user" ? resolveCodexAppServerUserHomeDir(env) : resolveCodexAppServerHomeDir(agentDir);
}
/** Forces OpenClaw-owned Codex auth to remain process-local. */
function withEphemeralCodexAuthStore(params) {
	const { startOptions } = params;
	if (!params.preparedAuth && params.authProfileId === null) return startOptions;
	const args = normalizeCodexAppServerArgs(startOptions.args, CODEX_EPHEMERAL_AUTH_STORE_OVERRIDE);
	return args === startOptions.args ? startOptions : {
		...startOptions,
		args
	};
}
function withClearedEnvironmentVariables(startOptions, envVars) {
	const clearEnv = startOptions.clearEnv ?? [];
	const missingEnvVars = envVars.filter((envVar) => !clearEnv.includes(envVar));
	if (missingEnvVars.length === 0) return startOptions;
	return {
		...startOptions,
		clearEnv: [...clearEnv, ...missingEnvVars]
	};
}
//#endregion
export { withEphemeralCodexAuthStore as a, withClearedEnvironmentVariables as i, resolveCodexAppServerLocalHomeDir as n, resolveCodexAppServerUserHomeDir as r, resolveCodexAppServerHomeDir as t };
