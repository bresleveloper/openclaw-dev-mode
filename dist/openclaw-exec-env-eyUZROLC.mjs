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
function ensureOpenClawExecMarkerOnProcess(env = process.env) {
	env[OPENCLAW_CLI_ENV_VAR] = CLI_ENV_VALUE;
	return env;
}
function buildExecRoutingEnv(context) {
	const { senderId, chatId, subagent } = context ?? {};
	if (!senderId && !chatId && !subagent) return;
	return {
		...senderId || chatId ? { OPENCLAW_CHANNEL_CONTEXT: JSON.stringify({
			...senderId ? { sender: { id: senderId } } : {},
			...chatId ? { chat: { id: chatId } } : {}
		}) } : {},
		...subagent ? { [SUBAGENT_EXEC_ENV_VAR]: "1" } : {}
	};
}
//#endregion
export { markOpenClawExecEnv as a, ensureOpenClawExecMarkerOnProcess as i, SUBAGENT_EXEC_ENV_VAR as n, buildExecRoutingEnv as r, OPENCLAW_CLI_ENV_VAR as t };
