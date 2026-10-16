import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
//#region src/config/io.invalid-config.ts
/**
* Shared invalid-config formatting, logging, and error helpers for config reads and mutations.
* All terminal-facing text is sanitized here so callers can reuse the same failure surface.
*/
/** Read failures do not establish that authored configuration needs repair. */
function isConfigReadFailure(snapshot) {
	return Boolean(snapshot.readError || snapshot.issues.some((issue) => issue.errorCode === "CONFIG_READ_FAILED"));
}
function configFailureHeading(snapshot) {
	return isConfigReadFailure(snapshot) ? "OpenClaw config could not be read" : "OpenClaw config is invalid";
}
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
/** An unavailable read cannot establish invalid authored settings or authorize Doctor repair. */
function createConfigReadError(snapshot, details = formatInvalidConfigDetails(snapshot.issues)) {
	const issue = snapshot.issues.find((candidate) => candidate.errorCode === "CONFIG_READ_FAILED");
	return Object.assign(new Error(`Config could not be read at ${snapshot.path}:\n${details}`, { cause: issue?.cause }), { code: "CONFIG_READ_FAILED" });
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
export { isConfigReadFailure as a, throwInvalidConfig as c, formatInvalidConfigDetails as i, createConfigReadError as n, isDoctorRecoverableInvalidConfigError as o, createInvalidConfigError as r, isInvalidConfigError as s, configFailureHeading as t };
