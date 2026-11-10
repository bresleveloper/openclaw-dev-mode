import { a as isConfiguredPluginPathDiagnosticCode, l as PLUGIN_AVAILABILITY_POLICY } from "./discovery-availability-CEoTdFoo.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { t as isUpdateDoctorRun } from "./doctor-health-contribution-utils-kJXoi_AZ.mjs";
import { i as renderStructuredHealthFindings } from "./doctor-health-contribution-CswduPyS.mjs";
//#region src/flows/doctor-config-validation-findings.ts
const FINAL_CONFIG_VALIDATION_CHECK_ID = "core/doctor/final-config-validation";
function configValidationIssuesToHealthFindings(issues) {
	return issues.map((issue) => ({
		checkId: FINAL_CONFIG_VALIDATION_CHECK_ID,
		severity: "error",
		message: issue.message,
		path: issue.path || "<root>",
		requirement: "valid-config",
		fixHint: issue.fixHint ?? "Run `openclaw doctor --fix` to migrate or remove retired keys. If no migration applies, correct the value or use `openclaw config unset <key>` with the rejected key path, then rerun Doctor."
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
async function runFinalConfigValidationHealth(ctx) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const { readDeferredPluginMigrationsAsync } = await import("./deferred-plugin-migrations-qYowxTGV.mjs");
	const deferredPluginMigrations = await readDeferredPluginMigrationsAsync({ env: ctx.env ?? process.env });
	const finalSnapshot = await readConfigFileSnapshot({
		skipPluginValidation: isUpdateDoctorRun(ctx.env ?? process.env),
		preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
		deferredPluginMigrations
	});
	const findings = [...finalSnapshot.exists && !finalSnapshot.valid ? configValidationIssuesToHealthFindings(finalSnapshot.issues) : [], ...(ctx.configResult.stateMigrationStepReceipts ?? []).filter((receipt) => receipt.requiredness === "required" && receipt.outcome === "deferred").map((receipt) => ({
		checkId: `core/doctor/${receipt.id}`,
		severity: "error",
		requirement: "required-migration-deferred",
		message: (receipt.refusal?.message ?? receipt.warnings.join("\n")) || `Required migration ${receipt.id} was deferred.`,
		fixHint: "Resolve the reported blocker, then rerun `openclaw doctor --fix` before restarting the Gateway."
	}))];
	if (findings.length > 0) {
		renderStructuredHealthFindings(ctx, findings);
		ctx.postInstallDoctorResult = {
			status: "error",
			failureFacts: [...ctx.postInstallDoctorResult?.failureFacts ?? [], ...findings.map((finding) => createUpdateFailureFact({
				check: finding.checkId,
				code: finding.requirement ?? "doctor-repair-blocked",
				message: `${finding.path ? `${finding.path}: ` : ""}${finding.message} ${finding.fixHint}`
			}))]
		};
	}
}
//#endregion
export { runFinalConfigValidationHealth as i, configValidationIssuesToHealthFindings as n, configValidationWarningsToHealthFindings as r, FINAL_CONFIG_VALIDATION_CHECK_ID as t };
