//#region src/infra/cron-run-exec-source.ts
const MAX_TRACKED_CRON_RUN_SOURCES = 512;
const activeCronRunExecSources = /* @__PURE__ */ new Map();
/** Records the cron source for one active isolated run; returns its cleanup. */
function registerCronRunExecSource(runId, source) {
	const key = runId.trim();
	if (!key) return () => {};
	if (activeCronRunExecSources.size >= MAX_TRACKED_CRON_RUN_SOURCES && !activeCronRunExecSources.has(key)) {
		const oldest = activeCronRunExecSources.keys().next().value;
		if (oldest !== void 0) activeCronRunExecSources.delete(oldest);
	}
	activeCronRunExecSources.set(key, source);
	return () => {
		if (activeCronRunExecSources.get(key) === source) activeCronRunExecSources.delete(key);
	};
}
/** Reads the recorded cron source for an active run; absence means non-cron. */
function lookupCronRunExecSource(runId) {
	if (!runId) return;
	return activeCronRunExecSources.get(runId.trim());
}
//#endregion
export { registerCronRunExecSource as n, lookupCronRunExecSource as t };
