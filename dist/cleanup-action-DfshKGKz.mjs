//#region src/config/sessions/cleanup-action.ts
function resolveSessionCleanupAction(params) {
	for (const [keys, action] of [
		[params.dmScopeRetiredKeys, "retire-dm-scope"],
		[params.missingKeys, "prune-missing"],
		[params.modelRunPrunedKeys, "prune-model-run"],
		[params.archivedKeys, "archive-dashboard"],
		[params.capArchivedKeys, "archive-cap"],
		[params.ageArchivedKeys, "archive-age"],
		[params.staleKeys, "prune-stale"],
		[params.cappedKeys, "cap-overflow"]
	]) if (keys?.has(params.key)) return action;
	return "keep";
}
//#endregion
export { resolveSessionCleanupAction as t };
