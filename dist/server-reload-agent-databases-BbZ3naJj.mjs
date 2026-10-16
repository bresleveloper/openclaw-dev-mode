import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as hasDeletedAgentDatabases } from "./agent-database-readers-DAuOtcuZ.mjs";
//#region src/gateway/server-reload-agent-databases.ts
/** A roster that admits an agent again may adopt databases its deletion left behind. */
async function reviveAgentDatabasesAfterConfigCommit(agentIds, warn) {
	if (!hasDeletedAgentDatabases()) return;
	try {
		const { reviveAgentDatabases } = await import("./openclaw-agent-db-readers-CInaGeKN.mjs");
		await reviveAgentDatabases(agentIds);
	} catch (error) {
		warn(`agent config committed; worker reader revival will reconcile at next task: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { reviveAgentDatabasesAfterConfigCommit as t };
