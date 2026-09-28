import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { c as stripLeadingSilentToken, l as stripSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { r as shouldAttemptTtsPayload } from "./tts-config-DK27R_zM.mjs";
import { c as isProvenDeliveryNotSentError, u as resolveDeliveryNotSentRetryability } from "./delivery-recovery.shared-f5deCrTJ.mjs";
import { a as getDeliveryQueueEntryStatus, s as loadDeliveryQueueEntry } from "./delivery-queue-sqlite-BghoE75G.mjs";
import { a as normalizeTargetForProvider } from "./target-normalization-DqKkj4kz.mjs";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-namespaces-CO-cZrdV.mjs";
import "./delivery-queue-media-staging-CNnanQB_.mjs";
import { n as isSuppressedControlReplyText } from "./control-reply-text-CDvIm13S.mjs";
import { s as hasScheduledNextRunAtMs } from "./jobs-scheduling-BuJ7Yxlw.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { n as isLikelyInterimCronMessage, t as expectsSubagentFollowup } from "./subagent-followup-hints-BWIIEDjt.mjs";
//#region src/cron/isolated-agent/delivery-dispatch-policy.ts
const DIRECT_CRON_DELIVERY_COMPLETION_RETENTION = {
	idPrefix: "cron-direct-delivery:v1:",
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
function normalizeDeliveryTarget(channel, to) {
	const toTrimmed = to.trim();
	return normalizeTargetForProvider(channel, toTrimmed) ?? toTrimmed;
}
function normalizeSilentReplyText(text) {
	if (!text) return {
		text,
		strippedTrailingSilentToken: false
	};
	if (isSuppressedControlReplyText(text)) return {
		text: void 0,
		strippedTrailingSilentToken: false
	};
	let next = text;
	const hasLeadingSilentToken = startsWithSilentToken(next, SILENT_REPLY_TOKEN);
	if (hasLeadingSilentToken) next = stripLeadingSilentToken(next, SILENT_REPLY_TOKEN);
	let strippedTrailingSilentToken = false;
	if (hasLeadingSilentToken || next.toLowerCase().includes("NO_REPLY".toLowerCase())) {
		const trimmedBefore = next.trim();
		const stripped = stripSilentToken(next, SILENT_REPLY_TOKEN);
		strippedTrailingSilentToken = stripped !== trimmedBefore;
		next = stripped;
	}
	if (!next.trim() || isSuppressedControlReplyText(next)) return {
		text: void 0,
		strippedTrailingSilentToken
	};
	return {
		text: next,
		strippedTrailingSilentToken
	};
}
/** Returns whether cron delivery should tolerate per-payload send failures. */
function resolveCronDeliveryBestEffort(job) {
	return job.delivery?.bestEffort === true;
}
/** Successful delivery-target resolution consumed by announce/direct delivery dispatch. */
const PERMANENT_DIRECT_CRON_DELIVERY_ERROR_PATTERNS = [
	/unsupported channel/i,
	/unknown channel/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/recipient is not a valid/i,
	/outbound not configured for channel/i
];
const STALE_CRON_DELIVERY_MAX_START_DELAY_MS = 108e5;
const deliveryLoggerRuntimeLoader = createLazyImportLoader(() => import("./delivery-logger.runtime.js"));
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const deliverySubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./delivery-subagent-registry.runtime.js"));
const subagentFollowupRuntimeLoader = createLazyImportLoader(() => import("./subagent-followup.runtime.js"));
/** Resolves whether descendant subagent output should replace the interim cron text. */
async function resolveDescendantSubagentFollowup(params) {
	const expectedFollowup = expectsSubagentFollowup(params.initialSynthesizedText);
	const subagentRegistryRuntime = await deliverySubagentRegistryRuntimeLoader.load();
	let hasUnsettledDescendants = subagentRegistryRuntime.hasDescendantRunAwaitingSettle(params.sessionKey);
	const shouldCheckCompletedDescendants = !params.abortSignal?.aborted && !hasUnsettledDescendants && (params.spawnOnlyHandoff || isLikelyInterimCronMessage(params.initialSynthesizedText));
	const followupRuntime = shouldCheckCompletedDescendants || hasUnsettledDescendants || expectedFollowup ? await subagentFollowupRuntimeLoader.load() : void 0;
	const completedDescendantReply = shouldCheckCompletedDescendants ? await followupRuntime?.readDescendantSubagentFallbackReply({
		sessionKey: params.sessionKey,
		runStartedAt: params.runStartedAt
	}) : void 0;
	const hadDescendants = hasUnsettledDescendants || Boolean(completedDescendantReply);
	if ((!params.deliveryBestEffort || params.spawnOnlyHandoff) && (hasUnsettledDescendants || expectedFollowup)) {
		let finalReply = await followupRuntime?.waitForDescendantSubagentSummary({
			sessionKey: params.sessionKey,
			initialReply: params.initialSynthesizedText,
			timeoutMs: params.timeoutMs,
			observedActiveDescendants: hasUnsettledDescendants || expectedFollowup,
			abortSignal: params.abortSignal
		});
		hasUnsettledDescendants = subagentRegistryRuntime.hasDescendantRunAwaitingSettle(params.sessionKey);
		if (!params.abortSignal?.aborted && !finalReply && !hasUnsettledDescendants) finalReply = await followupRuntime?.readDescendantSubagentFallbackReply({
			sessionKey: params.sessionKey,
			runStartedAt: params.runStartedAt
		});
		return {
			finalReply: finalReply && !hasUnsettledDescendants ? finalReply : void 0,
			hasUnsettledDescendants,
			hadDescendants
		};
	}
	return {
		finalReply: completedDescendantReply,
		hasUnsettledDescendants,
		hadDescendants
	};
}
async function logCronDeliveryWarn(message) {
	const { logWarn } = await deliveryLoggerRuntimeLoader.load();
	logWarn(message);
}
async function logCronDeliveryError(message) {
	const { logError } = await deliveryLoggerRuntimeLoader.load();
	logError(message);
}
function logCronDeliveryErrorDeferred(message) {
	deliveryLoggerRuntimeLoader.load().then(({ logError }) => {
		logError(message);
	});
}
function resolveStaleCronDeliveryError(params) {
	const scheduledAt = params.job.state?.nextRunAtMs;
	const scheduledAtMs = hasScheduledNextRunAtMs(scheduledAt) ? scheduledAt : params.runStartedAt;
	const startDelayMs = params.runStartedAt - scheduledAtMs;
	if (startDelayMs > STALE_CRON_DELIVERY_MAX_START_DELAY_MS) {
		const nowMs = Date.now();
		return `skipping stale delivery scheduled at ${new Date(scheduledAtMs).toISOString()}, started ${Math.round(startDelayMs / 6e4)}m late, current age ${Math.round((nowMs - scheduledAtMs) / 6e4)}m`;
	}
}
async function maybeApplyTtsToCronPayloads(params) {
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.delivery.channel,
		accountId: params.delivery.accountId
	})) return params.payloads;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	return await Promise.all(params.payloads.map((payload) => maybeApplyTtsToPayload({
		payload,
		cfg: params.cfg,
		channel: params.delivery.channel,
		kind: "final",
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		accountId: params.delivery.accountId
	})));
}
function buildDirectCronDeliveryIdempotencyKey(params) {
	const executionId = createCronExecutionId(params.jobId, params.runStartedAt);
	const threadId = params.delivery.threadId == null || params.delivery.threadId === "" ? "" : stringifyRouteThreadId(params.delivery.threadId) ?? "";
	const accountId = params.delivery.accountId?.trim() ?? "";
	const normalizedTo = normalizeDeliveryTarget(params.delivery.channel, params.delivery.to);
	const routeIdentity = [
		params.delivery.channel,
		accountId,
		normalizedTo,
		threadId
	].map(encodeURIComponent).join(":");
	return `${DIRECT_CRON_DELIVERY_COMPLETION_RETENTION.idPrefix}${executionId}:${routeIdentity}`;
}
/** Receipts own recipient delivery; projections never stand in for custody. */
function isCompletedDirectCronDelivery(id) {
	return getDeliveryQueueEntryStatus(OUTBOUND_DELIVERY_QUEUE_NAME, id) === "completed";
}
/** Wait only for an active recipient owner, never for crashed ambiguous sends. */
async function waitForCompletedDirectCronDelivery(params) {
	for (let attempt = 0; attempt < 120; attempt += 1) {
		const status = getDeliveryQueueEntryStatus(OUTBOUND_DELIVERY_QUEUE_NAME, params.id);
		if (status === "completed") return true;
		const owner = status === "pending" ? loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, params.id) : null;
		if (!owner && status === "pending") return isCompletedDirectCronDelivery(params.id);
		if (!owner || (owner.recoveryState === "send_attempt_started" ? typeof owner.platformSendStartedAt !== "number" || owner.platformSendStartedAt <= Date.now() - 3e4 : owner.recoveryState !== "producer_claimed" || typeof owner.availableAt !== "number" || owner.availableAt <= Date.now())) return false;
		if (attempt < 119) await sleepWithAbort(250, params.signal);
	}
	return false;
}
function summarizeDirectCronDeliveryError(error) {
	if (error instanceof Error) return error.message || "error";
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error) || String(error);
	} catch {
		return String(error);
	}
}
function isTransientDirectCronDeliveryError(error) {
	const typedRetryability = resolveDeliveryNotSentRetryability(error);
	if (typedRetryability !== void 0) return typedRetryability;
	const message = summarizeDirectCronDeliveryError(error);
	if (!message) return false;
	if (PERMANENT_DIRECT_CRON_DELIVERY_ERROR_PATTERNS.some((re) => re.test(message))) return false;
	return isProvenDeliveryNotSentError(error);
}
function resolveDirectCronRetryDelaysMs() {
	return isFastTestRuntimeEnv() ? [
		0,
		0,
		0
	] : [
		5e3,
		1e4,
		2e4
	];
}
async function retryTransientDirectCronDelivery(params) {
	const retryDelaysMs = resolveDirectCronRetryDelaysMs();
	const assertActive = () => {
		if (params.signal?.aborted) throw new Error("cron delivery aborted");
		if (params.deadlineAtMs !== void 0 && Date.now() >= params.deadlineAtMs) {
			const error = /* @__PURE__ */ new Error("cron delivery deadline exceeded");
			error.name = "TimeoutError";
			throw error;
		}
	};
	assertActive();
	const runWithAbortCheck = async () => {
		assertActive();
		return await params.run();
	};
	return await retryAsync(runWithAbortCheck, {
		attempts: retryDelaysMs.length + 1,
		minDelayMs: 0,
		maxDelayMs: Math.max(...retryDelaysMs),
		delayMs: ({ attempt }) => retryDelaysMs[attempt - 1] ?? 0,
		shouldRetry: (err) => params.signal?.aborted !== true && (params.deadlineAtMs === void 0 || Date.now() < params.deadlineAtMs) && isTransientDirectCronDeliveryError(err) && (params.shouldRetryError?.(err) ?? true),
		onRetry: async ({ attempt, maxAttempts, delayMs, err }) => {
			await logCronDeliveryWarn(`[cron:${params.jobId}] transient ${params.label ?? "direct announce"} delivery failure, retrying ${attempt + 1}/${maxAttempts} in ${Math.round(delayMs / 1e3)}s: ${summarizeDirectCronDeliveryError(err)}`);
			if (delayMs === 0) await sleepWithAbort(0, params.signal);
		},
		sleep: async (delayMs) => {
			const remainingMs = params.deadlineAtMs === void 0 ? delayMs : Math.max(0, params.deadlineAtMs - Date.now());
			await sleepWithAbort(Math.min(delayMs, remainingMs), params.signal);
			assertActive();
		}
	});
}
//#endregion
export { logCronDeliveryErrorDeferred as a, normalizeDeliveryTarget as c, resolveDescendantSubagentFollowup as d, resolveStaleCronDeliveryError as f, logCronDeliveryError as i, normalizeSilentReplyText as l, waitForCompletedDirectCronDelivery as m, buildDirectCronDeliveryIdempotencyKey as n, logCronDeliveryWarn as o, retryTransientDirectCronDelivery as p, isCompletedDirectCronDelivery as r, maybeApplyTtsToCronPayloads as s, DIRECT_CRON_DELIVERY_COMPLETION_RETENTION as t, resolveCronDeliveryBestEffort as u };
