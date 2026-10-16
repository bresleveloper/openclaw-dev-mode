//#region src/infra/install-mode-options.ts
/** Keep a deliberate work deadline separate from bounded metadata/probe defaults. */
function resolveInstallWorkTimeoutMs(workTimeoutMs, defaultTimeoutMs) {
	return workTimeoutMs === null ? void 0 : workTimeoutMs ?? defaultTimeoutMs;
}
function resolveInstallModeOptions(params, defaultLogger) {
	return {
		logger: params.logger ?? defaultLogger,
		mode: params.mode ?? "install",
		dryRun: params.dryRun ?? false
	};
}
function resolveTimedInstallModeOptions(params, defaultLogger, defaultTimeoutMs = 12e4) {
	return {
		...resolveInstallModeOptions(params, defaultLogger),
		timeoutMs: params.timeoutMs ?? defaultTimeoutMs,
		workTimeoutMs: params.workTimeoutMs !== void 0 ? params.workTimeoutMs : params.mode === "update" ? params.timeoutMs ?? null : void 0
	};
}
//#endregion
export { resolveInstallWorkTimeoutMs as n, resolveTimedInstallModeOptions as r, resolveInstallModeOptions as t };
