import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { i as getLogger } from "./logger-Mnn26Jj7.mjs";
import { l as writeRootConsoleLine } from "./console-BnFs8ZzT.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
//#region src/logger.ts
const subsystemPrefixRe = /^([a-z][a-z0-9-]{1,20}):\s+(.*)$/i;
function splitSubsystem(message) {
	const match = message.match(subsystemPrefixRe);
	if (!match) return null;
	const subsystem = match.at(1);
	const rest = match.at(2);
	if (subsystem === void 0 || rest === void 0) return null;
	return {
		subsystem,
		rest
	};
}
function logWithSubsystem(level, message, runtime) {
	const parsed = runtime === defaultRuntime ? splitSubsystem(message) : null;
	if (parsed) {
		createSubsystemLogger(parsed.subsystem)[level](parsed.rest);
		return;
	}
	const runtimeMethod = level === "error" ? "error" : "log";
	const formatted = theme[level](message);
	if (runtime !== defaultRuntime || !writeRootConsoleLine(runtimeMethod, formatted)) runtime[runtimeMethod](formatted);
	getLogger()[level](message);
}
function logInfo(message, runtime = defaultRuntime) {
	logWithSubsystem("info", message, runtime);
}
function logWarn(message, runtime = defaultRuntime) {
	logWithSubsystem("warn", message, runtime);
}
function logError(message, runtime = defaultRuntime) {
	logWithSubsystem("error", message, runtime);
}
function logDebug(message) {
	getLogger().debug(message);
	if (isVerbose()) console.log(theme.muted(message));
}
//#endregion
export { logWarn as i, logError as n, logInfo as r, logDebug as t };
