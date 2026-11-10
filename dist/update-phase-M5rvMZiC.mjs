import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
//#region src/commands/doctor/shared/update-phase.ts
const UPDATE_IN_PROGRESS_ENV = "OPENCLAW_UPDATE_IN_PROGRESS";
/** Managed updaters must opt in to NOCOW rewrites, which change physical store identities. */
const DOCTOR_SQLITE_NOCOW_REPAIR_ENV = "OPENCLAW_DOCTOR_SQLITE_NOCOW_REPAIR";
const UPDATE_POST_CORE_CONVERGENCE_ENV = "OPENCLAW_UPDATE_POST_CORE_CONVERGENCE";
const UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV = "OPENCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR";
const UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV = "OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE";
const UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV = "OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION";
/**
* Set by an updater that runs optional Doctor inspections with `doctor --lint`
* after readiness. Only the report mode defers checks: older parents cannot
* consume the target's selector receipt, and older candidates reject this mode.
*/
const UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV = "OPENCLAW_UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS";
const UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE = "reported-checks";
function isUpdateDoctorInspectionReportMode(env) {
	return env[UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV] === UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE;
}
/** Share the post-swap discovery context through planning and final publication. */
function resolvePostCoreConvergenceEnv(env, compatibilityHostVersion) {
	return {
		...env,
		OPENCLAW_COMPATIBILITY_HOST_VERSION: compatibilityHostVersion ?? VERSION,
		[UPDATE_POST_CORE_CONVERGENCE_ENV]: "1"
	};
}
function isExplicitOptOutEnvValue(value) {
	const normalized = value?.trim().toLowerCase() ?? "";
	return normalized !== "" && normalized !== "0" && normalized !== "false" && normalized !== "no";
}
function shouldSkipLegacyUpdateDoctorConfigWrite(env) {
	return isExplicitOptOutEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) && !isExplicitOptOutEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]);
}
/** Shipped canaries clear IN_PROGRESS for lint but retain the writable-parent marker. */
function isUpdateDoctorLintPass(env) {
	return isTruthyEnvValue(env["OPENCLAW_UPDATE_IN_PROGRESS"]) || isPostCoreConvergencePass(env) || isTruthyEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]);
}
/** Package swaps defer plugin installation to avoid racing the package manager.
* Post-core convergence wins when both markers are present. Direct IN_PROGRESS
* readers intentionally retain warning/check suppression during convergence;
* only move them here when they need to distinguish those phases. */
function isUpdatePackageSwapInProgress(env) {
	return !isPostCoreConvergencePass(env) && isTruthyEnvValue(env["OPENCLAW_UPDATE_IN_PROGRESS"]);
}
/**
* True iff configured plugin install repair should be deferred because the
* updater guarantees a later post-core convergence pass. Older shipped
* parents may set only the writable-config marker. Those parents still have a
* post-core handoff, but their in-memory install records are stale after the
* candidate doctor exits, so defer payload repair to the updated child process.
*/
function shouldDeferConfiguredPluginInstallRepair(env) {
	return isUpdatePackageSwapInProgress(env) && (isTruthyEnvValue(env["OPENCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR"]) || isTruthyEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]));
}
/**
* True iff a new doctor is running inside a shipped parent that can persist
* doctor config repairs. Config writes must stay old-parent-readable because
* that parent resumes after the candidate doctor exits. Modern parents also
* set the explicit deferral marker, so they should keep current metadata
* writes while still deferring payload repair.
*/
function isLegacyParentWritableUpdateDoctorPass(env) {
	return isUpdatePackageSwapInProgress(env) && isTruthyEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]) && !isTruthyEnvValue(env["OPENCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR"]);
}
/**
* True iff we are running the post-core convergence pass: the core package
* swap is done, the gateway has not been restarted yet, and configured plugin
* repair MUST run before we hand control back for the restart.
*/
function isPostCoreConvergencePass(env) {
	return isTruthyEnvValue(env[UPDATE_POST_CORE_CONVERGENCE_ENV]);
}
//#endregion
export { UPDATE_PARENT_RUNS_POST_ACTIVATION_INSPECTIONS_ENV as a, UPDATE_POST_CORE_CONVERGENCE_ENV as c, isUpdateDoctorInspectionReportMode as d, isUpdateDoctorLintPass as f, shouldSkipLegacyUpdateDoctorConfigWrite as g, shouldDeferConfiguredPluginInstallRepair as h, UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV as i, isLegacyParentWritableUpdateDoctorPass as l, resolvePostCoreConvergenceEnv as m, UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV as n, UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV as o, isUpdatePackageSwapInProgress as p, UPDATE_IN_PROGRESS_ENV as r, UPDATE_POST_ACTIVATION_INSPECTIONS_REPORT_MODE as s, DOCTOR_SQLITE_NOCOW_REPAIR_ENV as t, isPostCoreConvergencePass as u };
