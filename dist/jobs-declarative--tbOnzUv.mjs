import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/cron/service/jobs-declarative.ts
const CRON_DECLARATIVE_LABEL_MAX_LENGTH = 200;
function normalizeDeclarativeLabel(value, field, nullable = false) {
	const normalized = normalizeOptionalString(value);
	if (!(nullable && value == null) && value !== void 0 && !normalized) throw new Error(`cron ${field} must not be blank`);
	if (normalized && normalized.length > CRON_DECLARATIVE_LABEL_MAX_LENGTH) throw new Error(`cron ${field} must be at most ${CRON_DECLARATIVE_LABEL_MAX_LENGTH} characters`);
	return normalized;
}
function declarativeFields(job, includeEnabled) {
	return {
		schedule: job.schedule,
		pacing: job.pacing,
		trigger: job.trigger,
		payload: job.payload,
		scheduledToolPolicy: job.scheduledToolPolicy,
		toolsAllowProvenance: job.toolsAllowProvenance,
		toolsAllowExecTarget: job.toolsAllowExecTarget,
		runtimeAuthority: job.runtimeAuthority,
		operatorSource: job.operatorSource,
		runtimeAuthorityRecoveryRequired: job.runtimeAuthorityRecoveryRequired,
		delivery: job.delivery,
		displayName: job.displayName,
		...includeEnabled ? {
			enabled: job.enabled,
			autoDisabled: job.state.autoDisabled,
			streamRestartExhausted: job.state.streamRestartExhausted
		} : {}
	};
}
//#endregion
export { normalizeDeclarativeLabel as n, declarativeFields as t };
