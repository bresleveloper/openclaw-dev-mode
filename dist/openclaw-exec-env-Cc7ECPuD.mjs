//#region src/infra/openclaw-exec-env.ts
/** Process env key that marks child commands as launched by the OpenClaw CLI. */
const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
/** Child-shell routing hint; it does not authenticate or authorize a Gateway caller. */
const SUBAGENT_EXEC_ENV_VAR = "OPENCLAW_SUBAGENT_EXEC";
/** Stable marker value used for OpenClaw-launched subprocess detection. */
const CLI_ENV_VALUE = "1";
/** Returns a cloned env object with the OpenClaw CLI marker set. */
function markOpenClawExecEnv(env) {
	return {
		...env,
		[OPENCLAW_CLI_ENV_VAR]: CLI_ENV_VALUE
	};
}
/** Mutates an existing process env object so current-process children inherit the marker. */
function ensureOpenClawExecMarkerOnProcess(env = process.env) {
	env[OPENCLAW_CLI_ENV_VAR] = CLI_ENV_VALUE;
	return env;
}
//#endregion
export { markOpenClawExecEnv as i, SUBAGENT_EXEC_ENV_VAR as n, ensureOpenClawExecMarkerOnProcess as r, OPENCLAW_CLI_ENV_VAR as t };
