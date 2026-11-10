import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as resolveTargetPrefixedChannel } from "./channel-target-prefix-D9KEia-0.mjs";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DHFPcfdZ.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-H1_-S915.mjs";
import "./timeout-BBs3o51w.mjs";
import { a as hasCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-DpeT8C8O.mjs";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { E as cronNotificationJob, O as cronFailureDetailLines, l as isJobEnabled } from "./jobs-scheduling-sefIqbJ3.mjs";
import { n as resolveFailureDestination, t as resolveCronDeliveryPlan } from "./delivery-plan-BCh_72BD.mjs";
import { randomUUID } from "node:crypto";
//#region src/cron/service/failure-repair-brief.ts
const REPAIR_PAYLOAD_MAX_CHARS = 4e3;
const REPAIR_ERROR_MAX_CHARS = 1e3;
function buildCronFailureRepairBrief(params) {
	const { job } = params;
	const payload = job.payload;
	const payloadText = payload.kind === "agentTurn" ? payload.message : payload.kind === "systemEvent" ? payload.text : payload.kind === "script" ? payload.script : "";
	const error = [params.errorReason ? `cause: ${params.errorReason}` : "", params.error?.trim()].filter(Boolean).join("\n");
	return [
		`Automation repair request from the scheduler, not a user message. Do not relay it; follow the steps below.`,
		params.terminal ? `A one-time automation (id ${job.id}), created in this conversation, failed and will not run again (now disabled). No failure alert was sent.` : `An automation (id ${job.id}), created in this conversation, failed ${params.consecutiveErrors} consecutive runs. No failure alert was sent.`,
		`Schedule: ${JSON.stringify(job.schedule)}. Payload kind: ${payload.kind}.`,
		wrapUntrustedPromptDataBlock({
			label: "Automation name",
			text: job.name,
			maxChars: 200
		}),
		wrapUntrustedPromptDataBlock({
			label: "Current payload",
			text: payloadText,
			maxChars: REPAIR_PAYLOAD_MAX_CHARS,
			truncationMarker: " [truncated]"
		}),
		wrapUntrustedPromptDataBlock({
			label: "Last error",
			text: error || "No error text recorded.",
			maxChars: REPAIR_ERROR_MAX_CHARS,
			truncationMarker: " [truncated]"
		}),
		"",
		"Diagnose the failure, then do exactly one:",
		...params.terminal ? [
			`1. If its work is still needed, do that work now or add a new automation; the failed one stays disabled, so do not update it. To resume this conversation later, use automations add with an at schedule, payload {kind:"agentTurn",message:"instructions for your next turn"}, and sessionTarget ${JSON.stringify(`session:${job.owner?.sessionKey?.trim()}`)}.`,
			`2. If the work is no longer needed, reply exactly ${SILENT_REPLY_TOKEN}.`,
			"3. Otherwise, ask the user for what you need to continue."
		] : [
			`1. Transient (provider outage, network, rate limit, or temporary upstream error): change nothing and reply exactly ${SILENT_REPLY_TOKEN}.`,
			"2. Fixable in the workspace (for example the helper script or instructions file the payload follows): change it, then reply with one line saying what you changed. Do not claim the automation is fixed; a later run must verify it.",
			"3. Otherwise: ask the user for exactly what you need to fix it.",
			"If the automation keeps failing, the user gets the normal failure alert."
		]
	].join("\n");
}
//#endregion
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
function resolveFailureAlertChannel(channel, to) {
	const normalized = normalizeOptionalLowercaseString(channel);
	if (normalized && normalized !== "last") return normalizeAnyChannelId(normalized) ?? normalized;
	return normalizeOptionalLowercaseString(resolveTargetPrefixedChannel(to)) ?? normalized;
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
function hasFailureRepairOwner(job) {
	return Boolean(job.owner?.sessionKey?.trim() && job.payload && job.payload.kind !== "command" && job.schedule && job.schedule.kind !== "on-exit" && job.schedule.kind !== "stream");
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
	const primaryRoute = hasCanonicalCronDeliveryMode(job.delivery) ? resolveCronDeliveryPlan(job) : void 0;
	const primaryAnnounceRoute = primaryRoute?.mode === "announce" && primaryRoute.requested ? primaryRoute : void 0;
	const explicitlyConfigured = jobConfig !== void 0 || globalConfig !== void 0;
	const hasOneShotRepairRoute = job.schedule?.kind === "at" && hasFailureRepairOwner(job);
	if (!alternateRoute && !primaryAnnounceRoute && !explicitlyConfigured && !hasOneShotRepairRoute) return null;
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
	const detailLines = params.route.mode === "webhook" ? [...errorReason ? [`Cause: ${errorReason}`] : [], `${detailLabel}: ${truncateUtf16Safe(params.error?.trim() || "unknown reason", 200)}`] : params.localProviderUnavailable ? [
		"Cause: the local model provider is unreachable.",
		"Start the provider or check its configured endpoint in automation history.",
		isJobEnabled(params.job) && params.job.state.nextRunAtMs !== void 0 ? "OpenClaw will check again on a later scheduled run." : "After restoring the provider, use Run Now or reschedule this automation."
	] : cronFailureDetailLines(errorReason, params.failureNotificationDetail);
	const text = [
		`Automation "${safeJobName}" ${statusVerb} ${params.consecutiveErrors} times`,
		...params.repairRequested ? ["An automatic repair was requested in its owner conversation; it is still failing."] : [],
		...detailLines
	].join("\n");
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
function startFailureAlertCycle(job, incident, now) {
	startFailureNotification(job);
	job.state.lastFailureAlertAtMs = now;
	const current = job.state.failureAlertIncident;
	job.state.failureAlertIncident = {
		...incident,
		scope: current?.scope === "run" ? "run" : incident.scope,
		...current?.repair ? { repair: {
			...current.repair,
			alerted: true
		} } : {}
	};
}
function requestFailureNotification(state, job, alertConfig, incident) {
	if (job.state.failureAlertIncident?.signature === incident.signature) return false;
	const now = state.deps.nowMs();
	const lastAlert = job.state.lastFailureAlertAtMs;
	if (typeof lastAlert === "number" && lastAlert <= now && now - lastAlert < Math.max(0, alertConfig.cooldownMs)) return false;
	startFailureAlertCycle(job, incident, now);
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
/**
* Emits one alert per incident when threshold, best-effort, and cooldown policy allow it.
* An owned job's first chat alert, or terminal one-shot failure, becomes a repair request.
* A later failure alerts, naming the request, and the streak is never repaired twice.
*/
function maybeEmitFailureAlert(state, params) {
	const localProviderUnavailable = params.status === "skipped" && params.job.state.lastDiagnostics?.entries.some((entry) => entry.source === "model-preflight");
	if (params.status === "skipped" && !params.alertConfig?.includeSkipped && !localProviderUnavailable) return "suppressed";
	recordUnresolvedFailure(params.job, params.failureNotificationDetail);
	const terminalOneShot = params.terminalOneShot === true;
	const alertConfig = params.alertConfig;
	if (!alertConfig) return "unavailable";
	if (!terminalOneShot && params.consecutiveCount < alertConfig.after) return "suppressed";
	if (params.job.delivery?.bestEffort === true && !params.job.failureAlert) return "unavailable";
	const incident = failureIncident({
		...params,
		route: alertConfig
	});
	const now = state.deps.nowMs();
	const repair = params.job.state.failureAlertIncident?.repair;
	if (repair?.deadlineAtMs !== void 0 && (repair.settledAtMs !== void 0 && repair.settledAtMs < repair.deadlineAtMs ? params.runAtMs <= repair.settledAtMs : now < repair.deadlineAtMs)) return "suppressed";
	if (repair && !repair.alerted) startFailureAlertCycle(params.job, incident, now);
	else if (!requestFailureNotification(state, params.job, alertConfig, incident)) return "suppressed";
	const job = cronNotificationJob(params.job);
	const alert = {
		kind: "failure-alert",
		job,
		payload: buildFailureAlertPayload({
			job: params.job,
			error: params.error,
			errorReason: params.errorReason,
			failureNotificationDetail: params.failureNotificationDetail,
			consecutiveErrors: params.consecutiveCount,
			route: alertConfig,
			status: params.status,
			repairRequested: repair !== void 0,
			localProviderUnavailable
		}),
		runAtMs: params.runAtMs,
		route: alertConfig
	};
	if (!repair && (terminalOneShot || alertConfig.mode === "announce") && params.status === "error" && hasFailureRepairOwner(params.job) && (terminalOneShot || isJobEnabled(params.job))) {
		const opened = params.job.state.failureAlertIncident ?? incident;
		params.job.state.failureAlertIncident = {
			...opened,
			repair: {
				atMs: now,
				deadlineAtMs: now + (state.deps.failureRepairTimeoutMs ?? 1728e5)
			}
		};
		params.job.state.lastFailureNotificationDeliveryStatus = terminalOneShot ? "unknown" : "not-requested";
		params.deferredNotifications.push({
			kind: "failure-repair",
			job,
			...terminalOneShot ? { fallback: alert } : {},
			text: buildCronFailureRepairBrief({
				job: params.job,
				consecutiveErrors: params.consecutiveCount,
				error: params.error,
				errorReason: params.errorReason,
				terminal: terminalOneShot
			})
		});
		return "queued";
	}
	params.deferredNotifications.push(alert);
	return "queued";
}
/**
* Resolves the incident after execution succeeds. Recovery is visible in run history and
* job state only: a working automation just works, so no notification is sent. Clearing
* the incident and cooldown lets the next failure alert again.
*/
function resolveFailureIncident(job, opts) {
	const incident = job.state.failureAlertIncident;
	if (!incident || opts?.triggerOnly && incident.scope !== "trigger") return;
	delete job.state.failureAlertIncident;
	job.state.lastFailureAlertAtMs = void 0;
}
/** Finalizes execution or required-delivery alerts after scheduling policy settles. */
function finalizeCronFailureNotifications(state, params) {
	if (params.result.status === "ok" && params.completionStatus === "succeeded") {
		resolveFailureIncident(params.job);
		return;
	}
	if (params.result.errorClassification?.kind === "aborted" && (params.job.schedule.kind === "at" || params.job.schedule.kind === "on-exit")) return;
	recordUnresolvedFailure(params.job, params.result.failureNotificationDetail);
	if (params.replay) return;
	if ((params.result.status === "error" || params.result.status === "skipped") && !params.autoDisableNotificationOwnsFailure && !params.pendingTransientRetry) return maybeEmitFailureAlert(state, {
		job: params.job,
		alertConfig: params.alertConfig,
		status: params.result.status,
		error: params.result.error,
		errorReason: params.job.state.lastErrorReason,
		failureNotificationDetail: params.result.failureNotificationDetail,
		runAtMs: params.result.startedAt,
		consecutiveCount: (params.result.status === "skipped" ? params.job.state.consecutiveSkipped : params.job.state.consecutiveErrors) ?? 0,
		terminalOneShot: params.terminalOneShot,
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
export { resolveFailureIncident as i, finalizeCronFailureNotifications as n, resolveFailureAlert as r, failureNotificationDeliveryFromJobState as t };
