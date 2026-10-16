import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-CYthJ0r4.mjs";
//#region src/cron/tools-allow.ts
/** Returns whether a cron job can construct or execute OpenClaw agent tools. */
function cronJobUsesToolRuntime(job) {
	return job.payload.kind === "agentTurn" || job.payload.kind === "script" || Boolean(job.trigger?.script.trim());
}
/** Stamps an explicit unrestricted cap without changing jobs that already carry one. */
function applyDefaultCronToolsAllow(job) {
	if (cronJobUsesToolRuntime(job) && job.payload.toolsAllow === void 0) job.payload.toolsAllow = ["*"];
}
/**
* Older builds froze an automatic snapshot of the creator's tools, which could miss
* tools the creator had. Such an agent turn runs like a `*` job, with its owner
* conversation's tools. Condition triggers keep their list (scripts reach MCP only
* through named servers), as do jobs without a valid owner policy or whose Codex app
* authority is bound to the captured list.
*/
function resolveCronRunToolsAllow(job) {
	return job.payload.kind === "agentTurn" && job.payload.toolsAllowIsDefault === true && !job.trigger?.script.trim() && !job.runtimeAuthority && !job.runtimeAuthorityRecoveryRequired && resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		scheduledToolPolicy: job.scheduledToolPolicy,
		owner: job.owner
	}) ? ["*"] : job.payload.toolsAllow;
}
//#endregion
export { cronJobUsesToolRuntime as n, resolveCronRunToolsAllow as r, applyDefaultCronToolsAllow as t };
