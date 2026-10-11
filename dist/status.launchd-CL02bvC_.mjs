import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as findForeignLaunchdJobs } from "./launchd-foreign-jobs-ByDevaFx.mjs";
import { t as readGatewayForcedRestartSummary } from "./restart-storm-BJt5v13o.mjs";
//#region src/cli/daemon-cli/status.launchd.ts
/** Live launchd job diagnostics shared by shallow and deep Gateway status. */
async function gatherLaunchdJobDiagnostics(env, deep) {
	const diagnostics = {};
	const stale = deep ? await import("./launchd-Cf_wmaBh.mjs").then(({ findStaleOpenClawUpdateLaunchdJobs }) => findStaleOpenClawUpdateLaunchdJobs(env)).catch(() => []) : [];
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
