import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
//#region src/config/io.invalid-config.ts
/**
* Shared invalid-config formatting, logging, and error helpers for config reads and mutations.
* All terminal-facing text is sanitized here so callers can reuse the same failure surface.
*/
/** Formats validation issues as terminal-safe bullet lines for config load failures. */
function formatInvalidConfigDetails(issues) {
	return formatConfigIssueLines(issues, "-", { normalizeRoot: true }).join("\n");
}
/** Creates a tagged error without logging; throwInvalidConfig owns diagnostic emission. */
function createInvalidConfigError(configPath, details, options = {}) {
	return Object.assign(/* @__PURE__ */ new Error(`Invalid config at ${configPath}:\n${details}`), {
		name: "InvalidConfigError",
		code: "INVALID_CONFIG",
		details,
		recovery: options.recovery ?? "doctor",
		diagnosticEmitted: false
	});
}
function isInvalidConfigError(err) {
	return extractErrorCode(err) === "INVALID_CONFIG";
}
function isDoctorRecoverableInvalidConfigError(err) {
	return isInvalidConfigError(err) && err.recovery !== "manual";
}
/** Logs and throws the standard invalid-config error for a validation result. */
function throwInvalidConfig(params) {
	const details = formatInvalidConfigDetails(params.issues);
	const error = createInvalidConfigError(params.configPath, details);
	if (!params.loggedConfigPaths.peek(error.message)) params.logger.error(error.message);
	params.loggedConfigPaths.check(error.message);
	error.diagnosticEmitted = true;
	throw error;
}
//#endregion
export { throwInvalidConfig as a, isInvalidConfigError as i, formatInvalidConfigDetails as n, isDoctorRecoverableInvalidConfigError as r, createInvalidConfigError as t };
