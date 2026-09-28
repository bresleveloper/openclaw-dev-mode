import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import path from "node:path";
//#region src/claws/monitor-cleanup-binding.ts
/** Claw files remain local; the serving monitor owner must use that same state and config. */
function resolveClawMonitorCleanupBinding(cronStorePath) {
	return {
		configPath: path.resolve(resolveConfigPath()),
		statePath: path.resolve(resolveOpenClawStateSqlitePath()),
		cronStorePath: path.resolve(cronStorePath)
	};
}
//#endregion
export { resolveClawMonitorCleanupBinding as t };
