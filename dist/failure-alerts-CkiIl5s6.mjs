import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-BJKXiLk4.mjs";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-MlB9PuXu.mjs";
import { a as normalizeTargetForProvider } from "./target-normalization-DqKkj4kz.mjs";
import { A as cronNotificationJob, j as cronFailureDetailLines } from "./jobs-scheduling-BuJ7Yxlw.mjs";
import { n as resolveCronDeliveryPlan, r as resolveFailureDestination } from "./delivery-plan-D6XdUIQv.mjs";
import { randomUUID } from "node:crypto";
//#region src/cron/service/failure-alerts.ts
/** Resolves and emits cron failure-alert notifications. */
const DEFAULT_FAILURE_ALERT_AFTER = 2;
const DEFAULT_FAILURE_ALERT_COOLDOWN_MS = 36e5;
/** Returns the last failure-notification delivery trace persisted on a cron job. */
function failureNotificationDeliveryFromJobState(job) {
	const status = job.state.lastFailureNotificationDeliveryStatus;
	if (!status || status === "not-requested") return;
	return {
		delivered: job.state.lastFailureNotificationDelivered,
		status,
		error: job.state.lastFailureNotificationDeliveryError
	};
}
function normalizeCronMessageChannel(input) {
	const channel = normalizeOptionalLowercaseString(input);
	return channel ? channel : void 0;
}
function resolveFailureAlertChannel(channel, to) {
	const normalized = normalizeCronMessageChannel(channel);
	if (normalized && normalized !== "last") return normalizeAnyChannelId(normalized) ?? normalized;
	return normalizeCronMessageChannel(resolveTargetPrefixedChannel(to)) ?? normalized;
}
function normalizeFailureAlertRecipient(channel, to) {
	try {
		return normalizeTargetForProvider(channel, to) ?? to;
	} catch {
		return to;
	}
}
function clampPositiveInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const floored = Math.floor(value);
	return floored >= 1 ? floored : fallback;
}
function clampNonNegativeInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const floored = Math.floor(value);
	return floored >= 0 ? floored : fallback;
}
/** Resolves effective failure-alert policy from job config, delivery defaults, and global cron config. */
function resolveFailureAlert(state, job) {
	const prepared = state.preparedFailureAlert;
	if (prepared) {
		if (prepared.jobId !== job.id) throw new Error("cron: prepared failure-alert policy does not match the job");
		return prepared.value;
	}
	const globalConfig = state.deps.cronConfig?.failureAlert;
	const jobConfig = job.failureAlert === false ? void 0 : job.failureAlert;
	if (job.failureAlert === false) return null;
	if (!jobConfig && globalConfig?.enabled === false) return null;
	const hasJobRoute = Boolean(jobConfig && (jobConfig.channel !== void 0 || jobConfig.to !== void 0 || jobConfig.accountId !== void 0 || jobConfig.mode !== void 0));
	const alternateRoute = resolveFailureDestination(job, globalConfig, hasJobRoute ? jobConfig : void 0);
	const primaryRoute = resolveCronDeliveryPlan(job);
	const primaryAnnounceRoute = primaryRoute.mode === "announce" && primaryRoute.requested ? primaryRoute : void 0;
	const explicitlyConfigured = jobConfig !== void 0 || globalConfig !== void 0;
	if (!alternateRoute && !primaryAnnounceRoute && !explicitlyConfigured) return null;
	const configuredMode = jobConfig?.mode ?? (jobConfig?.channel ? "announce" : void 0) ?? globalConfig?.mode;
	const route = alternateRoute ?? (configuredMode === "webhook" && explicitlyConfigured ? {
		mode: "webhook",
		to: normalizeOptionalString(jobConfig?.to ?? globalConfig?.to),
		accountId: normalizeOptionalString(jobConfig?.accountId ?? globalConfig?.accountId)
	} : primaryAnnounceRoute);
	const mode = (route?.mode ?? configuredMode) === "webhook" ? "webhook" : "announce";
	const primaryChannel = primaryAnnounceRoute ? resolveFailureAlertChannel(primaryAnnounceRoute.channel, primaryAnnounceRoute.to) ?? "last" : void 0;
	const hasAnnounceRouteSelector = jobConfig?.channel !== void 0 || jobConfig?.to !== void 0 || job.delivery?.failureDestination?.channel !== void 0 || job.delivery?.failureDestination?.to !== void 0 || globalConfig?.channel !== void 0 || globalConfig?.to !== void 0;
	const channel = mode === "announce" && !hasAnnounceRouteSelector && primaryChannel ? primaryChannel : resolveFailureAlertChannel(route?.channel, route?.to) ?? "last";
	const routeUsesPrimaryChannel = mode === "announce" && primaryAnnounceRoute !== void 0 && channel === primaryChannel;
	const to = normalizeOptionalString(route?.to) ?? (routeUsesPrimaryChannel ? primaryAnnounceRoute?.to : void 0);
	const primaryRecipientMatches = primaryAnnounceRoute !== void 0 && mode === "announce" && channel === primaryChannel && (to === primaryAnnounceRoute.to || to !== void 0 && primaryAnnounceRoute.to !== void 0 && normalizeFailureAlertRecipient(channel, to) === normalizeFailureAlertRecipient(channel, primaryAnnounceRoute.to));
	const accountId = normalizeOptionalString(route?.accountId) ?? (primaryRecipientMatches ? primaryAnnounceRoute?.accountId : void 0);
	const primaryRouteMatches = primaryRecipientMatches && accountId === primaryAnnounceRoute?.accountId && (alternateRoute === null || !job.delivery?.failureDestination || primaryAnnounceRoute?.threadId == null || jobConfig?.to !== void 0);
	return {
		after: clampPositiveInt(jobConfig?.after ?? globalConfig?.after, DEFAULT_FAILURE_ALERT_AFTER),
		cooldownMs: clampNonNegativeInt(jobConfig?.cooldownMs ?? globalConfig?.cooldownMs, DEFAULT_FAILURE_ALERT_COOLDOWN_MS),
		channel,
		to,
		mode,
		accountId,
		threadId: primaryRouteMatches ? primaryAnnounceRoute.threadId : void 0,
		includeSkipped: jobConfig?.includeSkipped ?? globalConfig?.includeSkipped ?? false,
		alternateRoute: alternateRoute !== null && !primaryRouteMatches
	};
}
function buildFailureAlertPayload(params) {
	const safeJobName = params.job.name || params.job.id;
	const errorReason = params.status === "error" ? params.errorReason : void 0;
	const statusVerb = params.status === "skipped" ? "skipped" : "failed";
	const detailLabel = params.status === "skipped" ? "Skip reason" : "Last error";
	const detailLines = params.route.mode === "webhook" ? [...errorReason ? [`Cause: ${errorReason}`] : [], `${detailLabel}: ${truncateUtf16Safe(params.error?.trim() || "unknown reason", 200)}`] : cronFailureDetailLines(errorReason, params.failureNotificationDetail);
	const text = [`Automation "${safeJobName}" ${statusVerb} ${params.consecutiveErrors} times`, ...detailLines].join("\n");
	const oauthRefreshFailure = params.error ? classifyOAuthRefreshFailure(params.error) : null;
	const providerLoginRecovery = params.status === "error" && (errorReason === "auth" || errorReason === "auth_permanent") ? buildProviderLoginRecovery({
		provider: normalizeOptionalString(oauthRefreshFailure?.provider),
		oauthReason: oauthRefreshFailure?.reason
	}) : void 0;
	return {
		text: providerLoginRecovery ? `${text}\n${providerLoginRecovery.hint}` : text,
		...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {}
	};
}
function startFailureNotification(job) {
	job.state.lastFailureNotificationId = randomUUID();
	job.state.lastFailureNotificationDelivered = void 0;
	job.state.lastFailureNotificationDeliveryStatus = "unknown";
	job.state.lastFailureNotificationDeliveryError = void 0;
}
function requestFailureNotification(state, job, alertConfig, incident) {
	if (job.state.failureAlertIncident?.signature === incident.signature) return false;
	const now = state.deps.nowMs();
	const lastAlert = job.state.lastFailureAlertAtMs;
	if (typeof lastAlert === "number" && lastAlert <= now && now - lastAlert < Math.max(0, alertConfig.cooldownMs)) return false;
	startFailureNotification(job);
	job.state.lastFailureAlertAtMs = now;
	job.state.failureAlertIncident = {
		...incident,
		scope: job.state.failureAlertIncident?.scope === "run" ? "run" : incident.scope
	};
	return true;
}
function failureRecoveryScope(detail) {
	return detail?.kind === "script-failure" && detail.source === "trigger" ? "trigger" : "run";
}
function recordUnresolvedFailure(job, detail) {
	const scope = failureRecoveryScope(detail);
	const incident = job.state.failureAlertIncident ??= { scope };
	if (scope === "run") incident.scope = "run";
}
function failureIncident(params) {
	const cause = params.errorReason ?? params.failureNotificationDetail ?? params.error?.trim();
	const scope = failureRecoveryScope(params.failureNotificationDetail);
	return {
		signature: sha256Hex(JSON.stringify([
			params.status,
			scope,
			cause,
			params.route.mode,
			params.route.channel,
			params.route.to,
			params.route.accountId,
			params.route.threadId
		])),
		scope
	};
}
/** Emits one alert per incident when threshold, best-effort, and cooldown policy allow it. */
function maybeEmitFailureAlert(state, params) {
	recordUnresolvedFailure(params.job, params.failureNotificationDetail);
	const alertConfig = params.alertConfig;
	if (!alertConfig || params.consecutiveCount < alertConfig.after) return;
	if (params.job.delivery?.bestEffort === true && !params.job.failureAlert) return;
	if (!requestFailureNotification(state, params.job, alertConfig, failureIncident({
		...params,
		route: alertConfig
	}))) return;
	const job = cronNotificationJob(params.job);
	params.deferredNotifications.push({
		kind: "failure-alert",
		job,
		payload: buildFailureAlertPayload({
			job,
			error: params.error,
			errorReason: params.errorReason,
			failureNotificationDetail: params.failureNotificationDetail,
			consecutiveErrors: params.consecutiveCount,
			route: alertConfig,
			status: params.status
		}),
		runAtMs: params.runAtMs,
		route: alertConfig
	});
}
/** Resolves incidents after execution succeeds, notifying only when a failure was reported. */
function maybeEmitFailureRecovery(params) {
	const incident = params.job.state.failureAlertIncident;
	if (!incident || params.triggerOnly && incident.scope !== "trigger") return;
	delete params.job.state.failureAlertIncident;
	params.job.state.lastFailureAlertAtMs = void 0;
	const route = params.alertConfig;
	if (params.replay || !incident.signature || !route || params.job.delivery?.bestEffort === true && !params.job.failureAlert) return;
	startFailureNotification(params.job);
	const job = cronNotificationJob(params.job);
	const payload = { text: [`Automation "${job.name || job.id}" recovered`, params.triggerOnly ? "The trigger check completed successfully; no run was needed." : "The latest run completed successfully."].join("\n") };
	params.deferredNotifications.push({
		kind: "failure-alert",
		job,
		payload,
		runAtMs: params.runAtMs,
		route
	});
}
/** Finalizes execution or required-delivery alerts after scheduling policy settles. */
function finalizeCronFailureNotifications(state, params) {
	if (params.result.status === "ok" && params.completionStatus === "succeeded") {
		maybeEmitFailureRecovery({
			job: params.job,
			alertConfig: params.alertConfig,
			runAtMs: params.result.startedAt,
			replay: params.replay,
			deferredNotifications: params.deferredNotifications
		});
		return;
	}
	recordUnresolvedFailure(params.job, params.result.failureNotificationDetail);
	if (params.replay) return;
	if (params.result.status === "error" && !params.autoDisableNotificationOwnsFailure) maybeEmitFailureAlert(state, {
		job: params.job,
		alertConfig: params.alertConfig,
		status: "error",
		error: params.result.error,
		errorReason: params.job.state.lastErrorReason,
		failureNotificationDetail: params.result.failureNotificationDetail,
		runAtMs: params.result.startedAt,
		consecutiveCount: params.job.state.consecutiveErrors ?? 0,
		deferredNotifications: params.deferredNotifications
	});
	else if (params.result.status === "ok" && params.completionStatus === "failed" && params.job.state.lastDeliveryStatus === "not-delivered" && params.alertConfig?.alternateRoute) {
		if (!requestFailureNotification(state, params.job, params.alertConfig, failureIncident({
			status: "delivery",
			error: params.job.state.lastDeliveryError,
			errorReason: params.job.state.lastErrorReason,
			route: params.alertConfig
		}))) return;
		const job = cronNotificationJob(params.job);
		const route = params.alertConfig;
		const detailLines = route.mode === "webhook" ? [`Last error: ${truncateUtf16Safe(params.job.state.lastDeliveryError?.trim() || "unknown reason", 200)}`] : cronFailureDetailLines(params.job.state.lastErrorReason);
		const payload = { text: [`Automation "${job.name || job.id}" delivery failed`, ...detailLines].join("\n") };
		params.deferredNotifications.push({
			kind: "failure-alert",
			job,
			payload,
			runAtMs: params.result.startedAt,
			route
		});
	}
}
//#endregion
export { resolveFailureAlert as a, maybeEmitFailureRecovery as i, finalizeCronFailureNotifications as n, maybeEmitFailureAlert as r, failureNotificationDeliveryFromJobState as t };
