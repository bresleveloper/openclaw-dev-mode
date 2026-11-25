import { t as getMatrixRuntime } from "./runtime-Ck8TjD7L.mjs";
import { format } from "node:util";
import { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
// extensions/matrix/src/matrix/sdk/logger.ts
function noop() {}
let forceConsoleLogging = false;
let serviceQuiet = false;
function setMatrixConsoleLogging(enabled) {
	forceConsoleLogging = enabled;
}
function setMatrixLogServiceQuiet(quiet) {
	serviceQuiet = quiet;
}
function resolveRuntimeLogger(module) {
	if (forceConsoleLogging) return null;
	try {
		return getMatrixRuntime().logging.getChildLogger({ module: `matrix:${module}` });
	} catch {
		return null;
	}
}
function formatMessage(module, messageOrObject) {
	if (messageOrObject.length === 0) return `[${module}]`;
	return `[${module}] ${format(...messageOrObject)}`;
}
function emitMatrixLog(level, module, messageOrObject) {
	const runtimeLogger = resolveRuntimeLogger(module);
	const message = formatMessage(module, messageOrObject);
	if (runtimeLogger) {
		if (level === "debug") runtimeLogger.debug?.(message);
		else runtimeLogger[level](message);
	} else console[level](redactSensitiveText(message));
}
function emitServiceLog(level, module, ...messageOrObject) {
	if (serviceQuiet) return;
	emitMatrixLog(level, module, messageOrObject);
}
const LogService = {
	debug: emitServiceLog.bind(null, "debug"),
	info: emitServiceLog.bind(null, "info"),
	warn: emitServiceLog.bind(null, "warn")
};
export { setMatrixLogServiceQuiet as a, setMatrixConsoleLogging as i, emitMatrixLog as n, noop as r, LogService as t };
