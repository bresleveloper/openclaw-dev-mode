import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import "./sqlite-runtime-COh9hQA9.mjs";
import "./state-paths-FoyMccMm.mjs";
//#region extensions/memory-core/src/memory-agent-database.ts
function captureMemoryAgentDatabaseOptions(agentId) {
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: resolveStateDir()
	};
	return {
		agentId,
		env,
		path: resolveOpenClawAgentSqlitePath({
			agentId,
			env
		})
	};
}
function captureMemoryAgentReadTarget(options) {
	return {
		agentId: options.agentId,
		databasePath: resolveOpenClawAgentSqlitePath(options),
		stateDir: resolveStateDir(options.env)
	};
}
//#endregion
export { captureMemoryAgentReadTarget as n, captureMemoryAgentDatabaseOptions as t };
