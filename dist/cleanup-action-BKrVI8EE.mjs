//#region src/config/sessions/cleanup-action.ts
/** Resolves the action label for one session key from cleanup key sets. */
function resolveSessionCleanupAction(params) {
	if (params.dmScopeRetiredKeys.has(params.key)) return "retire-dm-scope";
	if (params.missingKeys.has(params.key)) return "prune-missing";
	if (params.modelRunPrunedKeys.has(params.key)) return "prune-model-run";
	if (params.archivedKeys?.has(params.key) || params.capArchivedKeys?.has(params.key)) return params.archivedKeys?.has(params.key) ? "archive-dashboard" : "archive-cap";
	if (params.ageArchivedKeys?.has(params.key)) return "archive-age";
	if (params.staleKeys.has(params.key)) return "prune-stale";
	if (params.cappedKeys.has(params.key)) return "cap-overflow";
	return "keep";
}
//#endregion
export { resolveSessionCleanupAction as t };
