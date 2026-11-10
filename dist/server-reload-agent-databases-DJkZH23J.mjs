import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as captureDeletedAgentDatabaseFences } from "./agent-database-readers-DSwi8tar.mjs";
//#region src/gateway/server-reload-agent-databases.ts
/** A roster that admits an agent again may adopt databases its deletion left behind. */
async function reviveAgentDatabasesAfterConfigCommit(agentIds, warn) {
	const deletedAgents = new Set(captureDeletedAgentDatabaseFences().map(([, agentId]) => agentId));
	const returningAgents = agentIds.filter((agentId) => deletedAgents.has(agentId));
	if (!returningAgents.length) return;
	try {
		const { reviveAgentDatabases } = await import("./openclaw-agent-db-readers-0ZLrwIOs.mjs");
		await reviveAgentDatabases(returningAgents);
	} catch (error) {
		warn(`agent config committed; worker reader revival will reconcile at next task: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { reviveAgentDatabasesAfterConfigCommit as t };
