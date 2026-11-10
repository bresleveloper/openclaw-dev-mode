import { a as normalizeUpdateFailureFacts } from "./update-failure-facts-3t5Fm3wV.mjs";
//#region src/cli/update-cli/update-command-post-plugin-validation.ts
const POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON = "post-plugin-doctor-execution-failed";
const POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON = "post-plugin-config-validation-execution-failed";
function applyPostPluginConfigValidation(pluginUpdate, validation) {
	if (validation.status === "valid") return pluginUpdate;
	const result = validation.failureFacts.length ? {
		...pluginUpdate,
		failureFacts: normalizeUpdateFailureFacts([...pluginUpdate.failureFacts ?? [], ...validation.failureFacts])
	} : pluginUpdate;
	if (pluginUpdate.status === "error" && (pluginUpdate.reason !== "post-plugin-doctor-execution-failed" || validation.status === "execution-failed")) return result;
	const executionFailed = validation.status === "execution-failed";
	return {
		...result,
		status: "error",
		reason: executionFailed ? POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON : "post-plugin-doctor-invalid-config",
		warnings: [...pluginUpdate.warnings ?? [], {
			reason: executionFailed ? validation.failureFacts.map((fact) => fact.message).filter(Boolean).join("; ") : "Config remained invalid after updated plugin migrations.",
			message: executionFailed ? "Config validation could not complete; refusing to restart." : "Post-update plugin migration did not produce a valid config; refusing to restart.",
			guidance: [executionFailed ? "Resolve the validation command failure, then rerun `openclaw update repair`." : "Run `openclaw doctor --fix`, then rerun `openclaw update repair`."]
		}]
	};
}
//#endregion
export { POST_PLUGIN_DOCTOR_EXECUTION_FAILED_REASON as n, applyPostPluginConfigValidation as r, POST_PLUGIN_CONFIG_VALIDATION_EXECUTION_FAILED_REASON as t };
