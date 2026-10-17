import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./backoff-BrzXG7iD.mjs";
import { M as parseAgentSessionKey, O as parseThreadSessionSuffix } from "./session-key-C09ow4h0.mjs";
import { c as startsWithSilentToken, l as stripLeadingSilentToken, r as SILENT_REPLY_TOKEN, u as stripSilentToken } from "./tokens-D4ghQG_g.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-BkQcgSZJ.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { o as shouldAttemptTtsPayload } from "./tts-config-CxmNZyL1.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import { o as isAudioFileName } from "./mime-CGDYrRzL.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-DPQX-jTt.mjs";
import { c as isProvenDeliveryNotSentError, u as resolveDeliveryNotSentRetryability } from "./delivery-recovery.shared-AM7vMnRv.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-OW_Z4SOC.mjs";
import { i as getDeliveryQueueEntryStatus, o as loadDeliveryQueueEntry } from "./delivery-queue-sqlite-CZH3GILC.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-DIR59G50.mjs";
import { o as OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-namespaces-DE2c296l.mjs";
import "./delivery-queue-media-staging-DXj5mTxE.mjs";
import { r as isSuppressedControlReplyText } from "./control-reply-text-w0dVwMAz.mjs";
import { c as hasScheduledNextRunAtMs } from "./jobs-scheduling-CBskypsm.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { d as pickLastNonEmptyTextFromPayloads, s as resolveCronLifecycleRevisionIdentity } from "./run-session-state-CXfMR1pf.mjs";
import { t as loadCronSessionEntryLatest } from "./session-00MZN2FA.mjs";
import { n as isLikelyInterimCronMessage, t as expectsSubagentFollowup } from "./subagent-followup-hints-BBePQpRw.mjs";
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
const deliveryLoggerRuntimeLoader = createLazyImportLoader(() => import("./logger-Bd8sAxqZ.mjs"));
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const deliverySubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./delivery-subagent-registry.runtime.js"));
const subagentFollowupRuntimeLoader = createLazyImportLoader(() => import("./subagent-followup.runtime.js"));
/** Resolves whether descendant subagent output should replace the interim cron text. */
async function resolveDescendantSubagentFollowup(params) {
	const expectedFollowup = expectsSubagentFollowup(params.initialSynthesizedText);
	const subagentRegistryRuntime = await deliverySubagentRegistryRuntimeLoader.load();
	let hasUnsettledDescendants = await subagentRegistryRuntime.hasUnsettledCronDescendants(params.sessionKey);
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
		hasUnsettledDescendants = await subagentRegistryRuntime.hasUnsettledCronDescendants(params.sessionKey);
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
async function retryTransientDirectCronDelivery(params) {
	const retryDelaysMs = isFastTestRuntimeEnv() ? [
		0,
		0,
		0
	] : [
		5e3,
		1e4,
		2e4
	];
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
//#region src/cron/isolated-agent/delivery-route-session-key.ts
/**
* Picks the session-key identity used to resolve a cron delivery's outbound route.
*
* An isolated run does not carry its bound source conversation's namespace.
* Reuse only a canonical conversation belonging to the same agent, actual
* delivery provider, and destination; otherwise jobs can adopt another peer's
* conversation or thread.
*/
function selectCronRouteCurrentSessionKey(job, agentSessionKey, deliveryProvider, deliveryTarget) {
	const bound = (job.sessionKey ?? "").trim();
	const parsedBound = parseAgentSessionKey(bound);
	const parsedRun = parseAgentSessionKey(agentSessionKey);
	if (!parsedBound || !parsedRun || parsedBound.agentId !== parsedRun.agentId) return agentSessionKey;
	const conversation = /^([^:]+):(direct|group|channel):([^:]+)(?::thread:[^:]+)?$/i.exec(parsedBound.rest);
	const targetPeerId = stripOutboundTargetKindPrefix(stripTargetProviderPrefix(deliveryTarget, deliveryProvider));
	if (conversation?.[1]?.toLowerCase() !== deliveryProvider.trim().toLowerCase() || conversation[3] !== targetPeerId) return agentSessionKey;
	return bound;
}
//#endregion
//#region src/cron/isolated-agent/delivery-dispatch-awareness.ts
const deliveryOutboundRuntimeLoader = createLazyImportLoader(() => import("./delivery-outbound.runtime.js"));
const outboundSessionRuntimeLoader = createLazyImportLoader(() => import("./outbound-session-t4G_Gjth.mjs"));
const transcriptRuntimeLoader = createLazyImportLoader(() => import("./transcript.runtime.js"));
function shouldQueueCronAwareness(params) {
	return params.job.sessionTarget === "isolated" && !params.deliveryBestEffort && params.delivery.mode === "explicit";
}
function resolveCronAwarenessMainSessionKey(params) {
	return params.cfg.session?.scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
}
function isSameSessionKey(left, right) {
	const normalizedLeft = normalizeOptionalString(left);
	const normalizedRight = normalizeOptionalString(right);
	return normalizedLeft != null && normalizedLeft === normalizedRight;
}
function resolveCronAwarenessText(params) {
	if (params.outboundPayloads.length) {
		const projectedText = resolveDirectCronTranscriptMirrorText(projectDeliveredDirectCronPayloadsForMirror(params.outboundPayloads));
		if (projectedText) return projectedText;
	}
	return pickLastNonEmptyTextFromPayloads(params.deliveryPayloads);
}
function formatTargetCronDeliveryFailureAwarenessText(params) {
	const targetParts = [`${params.channel}:${params.to}`];
	if (params.threadId) targetParts.push(`thread ${params.threadId}`);
	return [
		"A scheduled automation attempted to deliver to this channel, but delivery failed.",
		`Job: ${params.job.name || params.job.id}`,
		`Target: ${targetParts.join(" ")}`,
		"Check automation history for delivery error details.",
		params.partialDelivered ? "One or more scheduled message payloads may already have been delivered." : "No scheduled message was delivered."
	].join("\n");
}
async function queueCronAwarenessSystemEvent(params) {
	try {
		const { enqueueSystemEvent } = await deliveryOutboundRuntimeLoader.load();
		const mainSessionKey = resolveCronAwarenessMainSessionKey({
			cfg: params.cfg,
			agentId: params.agentId
		});
		if (params.queueMainSession) enqueueSystemEvent(params.text, withSystemEventOwner({
			sessionKey: mainSessionKey,
			contextKey: params.deliveryIdempotencyKey
		}, params.agentId));
		const targetSessionKey = params.targetSessionKey;
		if (targetSessionKey && (!isSameSessionKey(targetSessionKey, mainSessionKey) || !params.queueMainSession)) enqueueSystemEvent(params.targetText ?? `A scheduled automation delivered this message to this channel:\n${params.text}`, withSystemEventOwner({
			sessionKey: targetSessionKey,
			contextKey: params.deliveryIdempotencyKey
		}, params.agentId));
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.jobId}] failed to queue isolated cron awareness: ${formatErrorMessage(err)}`);
	}
}
function buildDirectCronTranscriptMirrorPayloads(payloads) {
	return payloads.map((payload) => {
		const spokenText = normalizeOptionalString(payload.spokenText);
		if (!spokenText) return payload;
		const mediaUrls = [payload.mediaUrl, ...payload.mediaUrls ?? []].filter((url) => Boolean(url) && !isAudioFileName(url));
		const { mediaUrl: _mediaUrl, mediaUrls: _mediaUrls, audioAsVoice: _audioAsVoice, spokenText: _spokenText, ...rest } = payload;
		return copyReplyPayloadMetadata(payload, {
			...rest,
			text: spokenText,
			...mediaUrls.length ? { mediaUrls } : {}
		});
	});
}
function resolveDirectCronTranscriptMirrorText(params) {
	const text = normalizeOptionalString(params.text);
	const mediaText = resolveMirroredTranscriptText({ mediaUrls: params.mediaUrls }) ?? void 0;
	if (text && mediaText) return `${text}\n${mediaText}`;
	return text ?? mediaText;
}
function projectDeliveredDirectCronPayloadsForMirror(payloads) {
	const textParts = [];
	const mediaUrls = [];
	for (const payload of payloads) {
		const text = normalizeOptionalString(payload.hookContent) ?? normalizeOptionalString(payload.text);
		if (text) textParts.push(text);
		for (const mediaUrl of payload.mediaUrls) {
			if ((payload.audioAsVoice === true || Boolean(payload.hookContent)) && isAudioFileName(mediaUrl)) continue;
			mediaUrls.push(mediaUrl);
		}
	}
	return {
		text: textParts.join("\n"),
		mediaUrls
	};
}
function canonicalizeDirectCronRouteSessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	const canonical = canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey
	});
	if (canonical !== sessionKey) return canonical;
	const thread = parseThreadSessionSuffix(sessionKey);
	if (!thread.baseSessionKey || !thread.threadId) return sessionKey;
	const canonicalBase = canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: thread.baseSessionKey
	});
	if (canonicalBase === thread.baseSessionKey || canonicalBase === "global") return sessionKey;
	return `${canonicalBase}:thread:${thread.threadId}`;
}
async function resolveCronDeliveryRouteSessionKey(params) {
	try {
		const { resolveOutboundSessionRoute } = await outboundSessionRuntimeLoader.load();
		const route = await resolveOutboundSessionRoute({
			cfg: params.cfg,
			channel: params.delivery.channel,
			agentId: params.agentId,
			accountId: params.delivery.accountId,
			target: params.delivery.to,
			currentSessionKey: selectCronRouteCurrentSessionKey(params.job, params.agentSessionKey, params.delivery.channel, params.delivery.to),
			threadId: params.delivery.threadId
		});
		const routeSessionKey = route?.sessionKey?.trim();
		if (!route || !routeSessionKey) return {
			sessionKey: params.agentSessionKey,
			route: null
		};
		const canonicalRouteSessionKey = canonicalizeDirectCronRouteSessionKey({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: routeSessionKey
		});
		const canonicalRouteBaseSessionKey = canonicalizeDirectCronRouteSessionKey({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: route.baseSessionKey
		});
		return {
			sessionKey: canonicalRouteSessionKey,
			route: canonicalRouteSessionKey === route.sessionKey && canonicalRouteBaseSessionKey === route.baseSessionKey ? route : {
				...route,
				sessionKey: canonicalRouteSessionKey,
				baseSessionKey: canonicalRouteBaseSessionKey
			}
		};
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] failed to resolve destination session for ${params.warningContext}: ${formatErrorMessage(err)}`);
		return {
			sessionKey: params.agentSessionKey,
			route: null
		};
	}
}
async function commitDirectCronOutboundRoute(params) {
	if (!params.route) return;
	try {
		const { ensureOutboundSessionEntry } = await outboundSessionRuntimeLoader.load();
		await ensureOutboundSessionEntry({
			cfg: params.cfg,
			channel: params.delivery.channel,
			accountId: params.delivery.accountId,
			route: params.route,
			sourceSessionKey: params.runSessionKey
		});
	} catch (err) {
		await logCronDeliveryWarn(`[cron] failed to persist outbound route after delivery: ${formatErrorMessage(err)}`);
	}
}
function resolveCronMessageToolAwarenessTarget(params) {
	const { target } = params.delivery;
	const text = normalizeOptionalString(target.text) ?? resolveMirroredTranscriptText({ mediaUrls: target.mediaUrls }) ?? void 0;
	if (!text) return;
	const targetChannel = normalizeOptionalString(target.provider);
	const verifiedTarget = params.delivery.verifiedTarget && params.resolvedDelivery.ok ? params.resolvedDelivery : void 0;
	const channel = targetChannel && targetChannel !== "message" ? targetChannel : verifiedTarget?.channel;
	const to = normalizeOptionalString(target.to) ?? verifiedTarget?.to;
	if (!channel || !to) return;
	const accountId = target.accountId ?? verifiedTarget?.accountId;
	const threadId = target.threadId ?? (target.threadImplicit === true ? verifiedTarget?.threadId : void 0);
	return {
		ok: true,
		channel,
		to,
		...accountId ? { accountId } : {},
		...threadId ? { threadId } : {},
		mode: "explicit",
		text
	};
}
async function queueCronMessageToolDeliveryAwareness(params) {
	const seen = /* @__PURE__ */ new Set();
	const deferredAwareness = [];
	for (const delivery of params.sourceDeliveryOutcome.visibleDeliveries) {
		const target = resolveCronMessageToolAwarenessTarget({
			delivery,
			resolvedDelivery: params.resolvedDelivery
		});
		if (!target) continue;
		const dedupeKey = [
			target.channel,
			normalizeDeliveryTarget(target.channel, target.to),
			target.accountId ?? "",
			target.threadId ?? "",
			target.text
		].join("\0");
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);
		const { sessionKey: targetSessionKey, route: targetRoute } = await resolveCronDeliveryRouteSessionKey({
			cfg: params.cfg,
			job: params.job,
			agentId: params.agentId,
			agentSessionKey: params.agentSessionKey,
			delivery: target,
			warningContext: "message-tool delivery awareness"
		});
		await commitDirectCronOutboundRoute({
			cfg: params.cfg,
			runSessionKey: params.runSessionKey,
			delivery: target,
			route: targetRoute
		});
		const deliveryIdempotencyKey = buildDirectCronDeliveryIdempotencyKey({
			jobId: params.job.id,
			runStartedAt: params.runStartedAt,
			delivery: target
		});
		const awarenessParams = {
			cfg: params.cfg,
			jobId: params.job.id,
			agentId: params.agentId,
			deliveryIdempotencyKey,
			queueMainSession: false,
			targetSessionKey,
			text: target.text
		};
		if (isSameSessionKey(targetSessionKey, params.deferredTargetSessionKey)) {
			deferredAwareness.push(() => queueCronAwarenessSystemEvent(awarenessParams));
			continue;
		}
		await queueCronAwarenessSystemEvent(awarenessParams);
	}
	if (deferredAwareness.length === 0) return;
	return async () => {
		for (const queue of deferredAwareness) await queue();
	};
}
async function appendDirectCronDeliveryTranscriptMirror(params) {
	if (!params.mirror.text && !params.mirror.mediaUrls?.length) return;
	try {
		const { appendAssistantMessageToSessionTranscript } = await transcriptRuntimeLoader.load();
		const result = await appendAssistantMessageToSessionTranscript(params.mirror);
		if (!result.ok) await logCronDeliveryWarn(`[cron:${params.job.id}] failed to mirror direct delivery into session transcript: ${result.reason}`);
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] failed to mirror direct delivery into session transcript: ${formatErrorMessage(err)}`);
	}
}
async function appendAdmittedDirectCronDeliveryTranscriptMirror(params) {
	try {
		const storePath = params.mirror.storePath;
		const initial = storePath ? loadCronSessionEntryLatest(storePath, params.mirror.sessionKey) : void 0;
		const expectedSessionId = params.mirror.expectedSessionId ?? initial?.sessionId;
		const expectedLifecycleRevision = params.mirror.expectedLifecycleRevision ?? initial?.lifecycleRevision;
		if (!storePath || !expectedSessionId) {
			await logCronDeliveryWarn(`[cron:${params.job.id}] skipped transcript mirror without an exact session identity`);
			return;
		}
		const admittedMirror = {
			...params.mirror,
			expectedSessionId,
			...expectedLifecycleRevision ? { expectedLifecycleRevision } : {}
		};
		const admission = await beginSessionWorkAdmission({
			scope: storePath,
			identities: [
				params.mirror.sessionKey,
				expectedSessionId,
				expectedLifecycleRevision ? resolveCronLifecycleRevisionIdentity(expectedLifecycleRevision) : void 0
			],
			signal: params.abortSignal,
			assertAllowed: () => {
				const latest = loadCronSessionEntryLatest(storePath, params.mirror.sessionKey);
				if (latest?.sessionId !== expectedSessionId || expectedLifecycleRevision !== void 0 && latest.lifecycleRevision !== expectedLifecycleRevision) throw new Error(`Session "${params.mirror.sessionKey}" changed before transcript mirror.`);
				const archivedError = resolveSessionWorkStartError(params.mirror.sessionKey, latest, { purpose: "accepted-result-settlement" });
				if (archivedError) throw new Error(archivedError);
			}
		});
		try {
			await admission.run(() => appendDirectCronDeliveryTranscriptMirror({
				job: params.job,
				mirror: admittedMirror
			}));
		} finally {
			admission.release();
		}
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] skipped transcript mirror: ${formatErrorMessage(err)}`);
	}
}
//#endregion
export { resolveStaleCronDeliveryError as C, resolveDescendantSubagentFollowup as S, waitForCompletedDirectCronDelivery as T, logCronDeliveryError as _, isSameSessionKey as a, maybeApplyTtsToCronPayloads as b, queueCronMessageToolDeliveryAwareness as c, resolveCronDeliveryRouteSessionKey as d, resolveDirectCronTranscriptMirrorText as f, isCompletedDirectCronDelivery as g, buildDirectCronDeliveryIdempotencyKey as h, formatTargetCronDeliveryFailureAwarenessText as i, resolveCronAwarenessMainSessionKey as l, DIRECT_CRON_DELIVERY_COMPLETION_RETENTION as m, buildDirectCronTranscriptMirrorPayloads as n, projectDeliveredDirectCronPayloadsForMirror as o, shouldQueueCronAwareness as p, commitDirectCronOutboundRoute as r, queueCronAwarenessSystemEvent as s, appendAdmittedDirectCronDeliveryTranscriptMirror as t, resolveCronAwarenessText as u, logCronDeliveryErrorDeferred as v, retryTransientDirectCronDelivery as w, normalizeSilentReplyText as x, logCronDeliveryWarn as y };
