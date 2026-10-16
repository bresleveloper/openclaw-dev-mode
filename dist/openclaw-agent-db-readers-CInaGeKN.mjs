import { i as encodeAgentDatabaseReaderRequest, t as applyAgentDatabaseReaderRequest } from "./agent-database-readers-DAuOtcuZ.mjs";
import { t as closeWorkerTaskPoolResources } from "./worker-task-pool-registry-DkolpTBF.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-db-readers.ts
async function applyAcrossProcess(request) {
	await applyAgentDatabaseReaderRequest(request);
	await closeWorkerTaskPoolResources(encodeAgentDatabaseReaderRequest(request));
}
function resolveUnique(pathnames) {
	return [...new Set(pathnames.map((pathname) => path.resolve(pathname)))];
}
/** Deletion closes the databases everywhere and refuses reopening them until the agent returns. */
async function closeDeletedAgentDatabases(agentId, databasePaths) {
	const candidates = resolveUnique(databasePaths).map((pathname) => ({ path: pathname }));
	if (candidates.length > 0) await applyAcrossProcess({
		kind: "close",
		candidates,
		deleted: true,
		agentId
	});
}
/** Re-admission revives only the physical paths captured for these deleted owners. */
async function reviveAgentDatabases(agentIds) {
	const unique = [...new Set(agentIds)];
	if (unique.length > 0) await applyAcrossProcess({
		kind: "revive",
		agentIds: unique
	});
}
//#endregion
export { closeDeletedAgentDatabases, reviveAgentDatabases };
