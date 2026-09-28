//#region src/cron/tools-allow.ts
/** Returns whether a cron job can construct or execute OpenClaw agent tools. */
function cronJobUsesToolRuntime(job) {
	return job.payload.kind === "agentTurn" || job.payload.kind === "script" || Boolean(job.trigger?.script.trim());
}
/** Stamps an explicit unrestricted cap without changing jobs that already carry one. */
function applyDefaultCronToolsAllow(job) {
	if (cronJobUsesToolRuntime(job) && job.payload.toolsAllow === void 0) job.payload.toolsAllow = ["*"];
}
//#endregion
export { cronJobUsesToolRuntime as n, applyDefaultCronToolsAllow as t };
