import { i as __exportAll } from "./doctor-contract-CsTNmbMa.mjs";
import { a as setMatrixLogServiceQuiet, n as emitMatrixLog } from "./logger-CXQnpXCt.mjs";
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
	setMatrixJsSdkRootLoggerLevel(matrixSdkLogMode === "quiet" ? "silent" : "debug");
	setMatrixLogServiceQuiet(matrixSdkLogMode === "quiet");
}
function setMatrixJsSdkRootLoggerLevel(level) {
	const logger$1 = logger;
	matrixJsSdkRootLoggerSnapshot ??= {
		level: logger$1.getLevel?.(),
		methodFactory: logger$1.methodFactory
	};
	if (level === "silent") {
		logger$1.methodFactory = () => () => void 0;
		logger$1.setLevel?.("silent", false);
		logger$1.rebuild?.();
		return;
	}
	logger$1.methodFactory = matrixJsSdkRootLoggerSnapshot.methodFactory;
	const previousLevel = matrixJsSdkRootLoggerSnapshot.level;
	if (typeof previousLevel === "string" || typeof previousLevel === "number") logger$1.setLevel?.(previousLevel, false);
	logger$1.rebuild?.();
}
function createMatrixJsSdkClientLogger(prefix = "matrix") {
	const log = (method, ...messageOrObject) => {
		if (matrixSdkLogMode === "quiet") return;
		emitMatrixLog(method, prefix, messageOrObject);
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
