const DEFAULT_CRON_TRIGGER_MIN_INTERVAL_MS = 3e4;
/** Resolves cron concurrency config, flooring finite values and clamping to at least one. */
function resolveCronMaxConcurrentRuns() {
	return 8;
}
/** Resolves the minimum cadence for trigger-bearing cron jobs. */
function resolveCronTriggerMinIntervalMs() {
	return DEFAULT_CRON_TRIGGER_MIN_INTERVAL_MS;
}
//#endregion
export { resolveCronTriggerMinIntervalMs as n, resolveCronMaxConcurrentRuns as t };
