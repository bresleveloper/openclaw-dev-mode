import { I as retireSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as encodeAgentDatabaseReaderRequest, t as applyAgentDatabaseReaderRequest } from "./agent-database-readers-DSwi8tar.mjs";
import { t as closeWorkerTaskPoolResources } from "./worker-task-pool-registry-D6q0YAmu.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-db-readers.ts
async function applyAcrossProcess(request) {
	await applyAgentDatabaseReaderRequest(request);
	await closeWorkerTaskPoolResources(encodeAgentDatabaseReaderRequest(request));
}
/** Deletion closes the databases everywhere and refuses reopening them until the agent returns. */
async function closeDeletedAgentDatabases(agentId, databasePaths, authority) {
	await authority.assertCurrentAsync();
	const candidates = [...new Set(databasePaths.map((pathname) => path.resolve(pathname)))].map((pathname) => ({ path: pathname }));
	if (candidates.length > 0) {
		await applyAcrossProcess({
			kind: "close",
			candidates,
			deleted: true,
			agentId
		});
		for (const candidate of candidates) {
			authority.assertCurrentFinal();
			retireSqliteDatabaseAdmissionForPath(candidate.path);
		}
	}
	await authority.assertCurrentAsync();
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
