import { n as __exportAll } from "./runtime-doctor-migrations-hxP-CXX7.mjs";
import { a as setMatrixLogServiceQuiet, n as emitMatrixLog } from "./logger-CuAzdD8Q.mjs";
import { logger } from "matrix-js-sdk/lib/logger.js";
//#region extensions/matrix/src/matrix/client/logging.ts
var logging_exports = /* @__PURE__ */ __exportAll({
	createMatrixJsSdkClientLogger: () => createMatrixJsSdkClientLogger,
	ensureMatrixSdkLoggingConfigured: () => ensureMatrixSdkLoggingConfigured,
	setMatrixSdkLogMode: () => setMatrixSdkLogMode
});
let matrixSdkLoggingConfigured = false;
let matrixSdkLogMode = "default";
let matrixJsSdkRootLoggerSnapshot = null;
function shouldSuppressMatrixHttpNotFound(module, messageOrObject) {
	if (!module.includes("MatrixHttpClient")) return false;
	return messageOrObject.some((entry) => {
		if (!entry || typeof entry !== "object") return false;
		return entry.errcode === "M_NOT_FOUND";
	});
}
function ensureMatrixSdkLoggingConfigured() {
	matrixSdkLoggingConfigured = true;
	applyMatrixSdkLogger();
}
function setMatrixSdkLogMode(mode) {
	matrixSdkLogMode = mode;
	if (!matrixSdkLoggingConfigured) return;
	applyMatrixSdkLogger();
}
function applyMatrixSdkLogger() {
	configureMatrixJsSdkRootLogger();
	setMatrixLogServiceQuiet(matrixSdkLogMode === "quiet");
}
function configureMatrixJsSdkRootLogger() {
	const logger$1 = logger;
	if (!matrixJsSdkRootLoggerSnapshot) {
		const methodFactory = logger$1.methodFactory;
		matrixJsSdkRootLoggerSnapshot = {
			level: logger$1.getLevel?.(),
			methodFactory(methodName, logLevel, loggerName) {
				const log = methodFactory.call(this, methodName, logLevel, loggerName);
				return function(...args) {
					if (matrixSdkLogMode === "quiet") return;
					const label = args[0];
					if (methodName === "info" && typeof label === "string" && label.startsWith("Storing user profile ")) return;
					if (methodName === "trace" && (label === "membership event with membership undefined (forwardLooking: true)!" || label === "membership event with membership undefined (forwardLooking: false)!")) log.call(this, "membership event with membership undefined");
					else log.apply(this, args);
				};
			}
		};
	}
	logger$1.methodFactory = matrixJsSdkRootLoggerSnapshot.methodFactory;
	const previousLevel = matrixJsSdkRootLoggerSnapshot.level;
	if (typeof previousLevel === "string" || typeof previousLevel === "number") logger$1.setLevel?.(previousLevel, false);
	logger$1.rebuild?.();
}
function createMatrixJsSdkClientLogger(prefix = "matrix") {
	const log = (method, ...messageOrObject) => {
		if (matrixSdkLogMode === "quiet") return;
		emitMatrixLog(method, prefix, messageOrObject[0] === "Cancelling verification request with params:" ? ["Cancelling verification request"] : messageOrObject);
	};
	return {
		trace: (...messageOrObject) => log("debug", ...messageOrObject),
		debug: (...messageOrObject) => log("debug", ...messageOrObject),
		info: (...messageOrObject) => log("info", ...messageOrObject),
		warn: (...messageOrObject) => log("warn", ...messageOrObject),
		error: (...messageOrObject) => {
			if (shouldSuppressMatrixHttpNotFound(prefix, messageOrObject)) return;
			log("error", ...messageOrObject);
		},
		getChild: (namespace) => {
			const nextNamespace = namespace.trim();
			return createMatrixJsSdkClientLogger(nextNamespace ? `${prefix}.${nextNamespace}` : prefix);
		}
	};
}
//#endregion
export { logging_exports as n, setMatrixSdkLogMode as r, createMatrixJsSdkClientLogger as t };
