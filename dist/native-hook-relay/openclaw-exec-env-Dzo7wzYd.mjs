//#region src/infra/openclaw-exec-env.ts
const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
/** Child-shell routing hint; it does not authenticate or authorize a Gateway caller. */
const SUBAGENT_EXEC_ENV_VAR = "OPENCLAW_SUBAGENT_EXEC";
const CLI_ENV_VALUE = "1";
function markOpenClawExecEnv(env) {
	return {
		...env,
		[OPENCLAW_CLI_ENV_VAR]: CLI_ENV_VALUE
	};
}
//#endregion
export { markOpenClawExecEnv as n, SUBAGENT_EXEC_ENV_VAR as t };
