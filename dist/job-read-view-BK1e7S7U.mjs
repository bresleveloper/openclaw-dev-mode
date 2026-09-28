import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import { t as toPublicCronJob } from "./public-job-C0Jx9vVK.mjs";
//#region src/cron/job-read-view.ts
function cronJobReadView(job) {
	return {
		...toPublicCronJob(job),
		configRevision: resolveCronJobConfigRevision(job),
		nextRunAtMs: job.state.nextRunAtMs,
		lastRunAtMs: job.state.lastRunAtMs,
		lastRunStatus: job.state.lastRunStatus ?? job.state.lastStatus,
		lastRunError: job.state.lastError,
		lastDelivered: job.state.lastDelivered,
		lastDeliveryStatus: job.state.lastDeliveryStatus,
		lastDeliveryError: job.state.lastDeliveryError,
		deliverySuppressionReason: job.state.deliverySuppressionReason,
		lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered,
		lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus,
		lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError
	};
}
function cronJobDefinitionFromReadView(view) {
	const { effectiveAgentId: _effectiveAgentId, configRevision: _configRevision, nextRunAtMs: _nextRunAtMs, lastRunAtMs: _lastRunAtMs, lastRunStatus: _lastRunStatus, lastRunError: _lastRunError, lastDelivered: _lastDelivered, lastDeliveryStatus: _lastDeliveryStatus, lastDeliveryError: _lastDeliveryError, deliverySuppressionReason: _deliverySuppressionReason, lastFailureNotificationDelivered: _lastFailureNotificationDelivered, lastFailureNotificationDeliveryStatus: _lastFailureNotificationDeliveryStatus, lastFailureNotificationDeliveryError: _lastFailureNotificationDeliveryError, ...definition } = view;
	return definition;
}
//#endregion
export { cronJobReadView as n, cronJobDefinitionFromReadView as t };
