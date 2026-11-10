import { i as normalizeLogLevel } from "./levels-C8pIGBKG.mjs";
import { o as isFileLogLevelEnabled, r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import "./logging-DuTp4Ty7.mjs";
import { o as shouldLogVerbose } from "./globals-XVSoVbNQ.mjs";
//#region src/plugins/runtime/runtime-logging.ts
function writeRuntimeLog(logger, level, message, meta) {
	if (meta && Object.keys(meta).length > 0) {
		logger[level](meta, message);
		return;
	}
	logger[level](message);
}
function createRuntimeLogging() {
	return {
		shouldLogVerbose,
		getChildLogger: (bindings, opts) => {
			const overrideLevel = opts?.level ? normalizeLogLevel(opts.level) : void 0;
			const childOpts = overrideLevel ? { level: overrideLevel } : void 0;
			const emit = (level) => (message, meta) => {
				if (!overrideLevel && !isFileLogLevelEnabled(level)) return;
				writeRuntimeLog(getChildLogger(bindings, childOpts), level, message, meta);
			};
			return {
				debug: emit("debug"),
				info: emit("info"),
				warn: emit("warn"),
				error: emit("error")
			};
		}
	};
}
//#endregion
export { writeRuntimeLog as n, createRuntimeLogging as t };
