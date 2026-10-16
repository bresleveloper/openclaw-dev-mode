import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as findForeignLaunchdJobs } from "./launchd-foreign-jobs-58G_K7aw.mjs";
import { t as readGatewayForcedRestartSummary } from "./restart-storm-Busg7Mfu.mjs";
//#region src/cli/daemon-cli/status.launchd.ts
/** Live launchd job diagnostics shared by shallow and deep Gateway status. */
async function gatherLaunchdJobDiagnostics(env, deep) {
	const diagnostics = {};
	const stale = deep ? await import("./launchd-Y5VpGr38.mjs").then(({ findStaleOpenClawUpdateLaunchdJobs }) => findStaleOpenClawUpdateLaunchdJobs(env)).catch(() => []) : [];
	if (stale.length) diagnostics.staleUpdateLaunchdJobs = stale;
	try {
		const jobs = await findForeignLaunchdJobs(env);
		if (jobs.length) {
			diagnostics.foreignLaunchdJobs = jobs;
			diagnostics.forcedRestartSummary = readGatewayForcedRestartSummary(env);
		}
	} catch (error) {
		diagnostics.foreignLaunchdInspectionError = formatErrorMessage(error);
	}
	return diagnostics;
}
//#endregion
export { gatherLaunchdJobDiagnostics };
