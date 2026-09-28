//#region src/cron/execution-root-runtime.ts
const CRON_EXECUTION_ROOT_RUNTIME_ERROR = "collection review requires a runtime that enforces the Workshop root through OpenClaw tools";
var CronExecutionRootRuntimeError = class extends Error {
	constructor() {
		super(CRON_EXECUTION_ROOT_RUNTIME_ERROR);
		this.name = "CronExecutionRootRuntimeError";
	}
};
/** Shared admission predicate for turns that must enforce a host-owned execution root. */
function supportsCronExecutionRoot(runtime, rootedCliExecution) {
	return runtime === "openclaw" || rootedCliExecution;
}
function assertCronExecutionRootRuntime(executionRoot, runtime, rootedCliExecution) {
	if (executionRoot && !supportsCronExecutionRoot(runtime, rootedCliExecution)) throw new CronExecutionRootRuntimeError();
}
//#endregion
export { assertCronExecutionRootRuntime as n, supportsCronExecutionRoot as r, CronExecutionRootRuntimeError as t };
