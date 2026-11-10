import { n as hasOrphanedSqliteSidecars } from "./sqlite-files-N5UzY_DG.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-DJGC6v85.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-WZhAVK2X.mjs";
//#region src/config/sessions/targets-maintenance.ts
/** Preserve deleted stores across Doctor's session import and legacy-key repair. */
function selectSessionStoreMaintenanceTargets(targets, params) {
	const isRetained = createRetainedAgentDatabaseMatcher(params.env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, { env: params.env }), {
		kind: "legacy-database",
		readDatabasePaths: () => targets.map(({ sqlitePath }) => sqlitePath)
	});
	return targets.filter(({ target, sqlitePath }) => {
		const orphanedSidecars = hasOrphanedSqliteSidecars(sqlitePath);
		const admitted = [target.storePath, sqlitePath].every((pathname) => {
			const disposition = isRetained(pathname, target.agentId);
			return !disposition || disposition === "unavailable" && !orphanedSidecars;
		});
		if (!admitted) params.onExcluded?.(sqlitePath);
		return admitted;
	});
}
//#endregion
export { selectSessionStoreMaintenanceTargets as t };
