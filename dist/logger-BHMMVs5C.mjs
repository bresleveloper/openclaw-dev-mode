import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { i as getLogger } from "./logger--ALOusOG.mjs";
import { u as writeRootConsoleLine } from "./console-DwqfhE-H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
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
function logWithSubsystem(params) {
	const parsed = params.runtime === defaultRuntime ? splitSubsystem(params.message) : null;
	if (parsed) {
		expectDefined(createSubsystemLogger(parsed.subsystem)[params.subsystemMethod], "subsystem logger method")(parsed.rest);
		return;
	}
	const formatted = params.runtimeFormatter(params.message);
	if (params.runtime !== defaultRuntime || !writeRootConsoleLine(params.runtimeMethod, formatted)) params.runtime[params.runtimeMethod](formatted);
	getLogger()[params.loggerMethod](params.message);
}
const info = theme.info;
const warn = theme.warn;
const danger = theme.error;
function logInfo(message, runtime = defaultRuntime) {
	logWithSubsystem({
		message,
		runtime,
		runtimeMethod: "log",
		runtimeFormatter: info,
		loggerMethod: "info",
		subsystemMethod: "info"
	});
}
function logWarn(message, runtime = defaultRuntime) {
	logWithSubsystem({
		message,
		runtime,
		runtimeMethod: "log",
		runtimeFormatter: warn,
		loggerMethod: "warn",
		subsystemMethod: "warn"
	});
}
function logError(message, runtime = defaultRuntime) {
	logWithSubsystem({
		message,
		runtime,
		runtimeMethod: "error",
		runtimeFormatter: danger,
		loggerMethod: "error",
		subsystemMethod: "error"
	});
}
function logDebug(message) {
	getLogger().debug(message);
	if (isVerbose()) console.log(theme.muted(message));
}
//#endregion
export { logWarn as i, logError as n, logInfo as r, logDebug as t };
