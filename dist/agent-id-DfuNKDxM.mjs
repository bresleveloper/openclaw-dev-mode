import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
//#region src/cron/agent-id.ts
const CRON_AGENT_SELECTION_REQUIRED_MESSAGE = "Agent-less cron job has no resolvable owner. Pass --agent <id> when creating or editing the job, or set agents.defaults.systemAgent.agentId.";
/** Resolves cron ownership: explicit non-blank id, scoped session key, then configured default. */
function tryResolveCronJobEffectiveAgentId(job, configuredDefaultAgentId) {
	const agentId = job.agentId?.trim() || parseAgentSessionKey(job.sessionKey)?.agentId || configuredDefaultAgentId?.trim();
	return agentId ? normalizeAgentId(agentId) : void 0;
}
/** Requires an owner before cron execution or an owner-scoped mutation. */
function resolveCronJobEffectiveAgentId(job, configuredDefaultAgentId) {
	const agentId = tryResolveCronJobEffectiveAgentId(job, configuredDefaultAgentId);
	if (!agentId) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	return agentId;
}
//#endregion
export { resolveCronJobEffectiveAgentId as n, tryResolveCronJobEffectiveAgentId as r, CRON_AGENT_SELECTION_REQUIRED_MESSAGE as t };
