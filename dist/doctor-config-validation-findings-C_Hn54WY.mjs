import { d as isConfiguredPluginPathDiagnosticCode, p as PLUGIN_AVAILABILITY_POLICY } from "./discovery-D_5mAUI7.mjs";
//#region src/flows/doctor-config-validation-findings.ts
const FINAL_CONFIG_VALIDATION_CHECK_ID = "core/doctor/final-config-validation";
function configValidationIssuesToHealthFindings(issues) {
	return issues.map((issue) => ({
		checkId: FINAL_CONFIG_VALIDATION_CHECK_ID,
		severity: "error",
		message: issue.message,
		path: issue.path || "<root>"
	}));
}
function configValidationWarningsToHealthFindings(warnings) {
	return warnings.filter((warning) => isConfiguredPluginPathDiagnosticCode(warning.code) && warning.path === "plugins.load.paths").map((warning) => ({
		checkId: FINAL_CONFIG_VALIDATION_CHECK_ID,
		severity: PLUGIN_AVAILABILITY_POLICY.severity,
		target: PLUGIN_AVAILABILITY_POLICY.state,
		requirement: warning.code,
		source: warning.source,
		errorCode: warning.errorCode,
		message: warning.message,
		path: warning.path,
		fixHint: warning.fixHint ?? PLUGIN_AVAILABILITY_POLICY.repairCommand
	}));
}
//#endregion
export { configValidationIssuesToHealthFindings as n, configValidationWarningsToHealthFindings as r, FINAL_CONFIG_VALIDATION_CHECK_ID as t };
