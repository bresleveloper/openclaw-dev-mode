//#region src/agents/bootstrap-mode.ts
/** Resolve the bootstrap mode for one agent run. */
function resolveBootstrapMode(params) {
	if (!params.bootstrapPending) return "none";
	if (params.runKind === "heartbeat" || params.runKind === "cron") return "none";
	if (!params.isPrimaryRun || !params.isInteractiveUserFacing) return "none";
	if (!params.hasBootstrapFileAccess) return "limited";
	return params.isCanonicalWorkspace ? "full" : "limited";
}
//#endregion
export { resolveBootstrapMode as t };
