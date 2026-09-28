import { format } from "node:util";
//#region src/plugin-sdk/runtime-logger.internal.ts
function createLoggerBackedRuntime(params) {
	return {
		log: (...args) => params.logger.info(format(...args)),
		error: (...args) => params.logger.error(format(...args)),
		writeStdout: (value) => params.logger.info(value),
		writeJson: (value, space = 2) => params.logger.info(JSON.stringify(value, void 0, space > 0 ? space : void 0)),
		exit: (code) => {
			throw params.exitError?.(code) ?? /* @__PURE__ */ new Error(`exit ${code}`);
		}
	};
}
function resolveRuntimeEnv(params) {
	return params.runtime ?? createLoggerBackedRuntime(params);
}
//#endregion
export { resolveRuntimeEnv as n, createLoggerBackedRuntime as t };
