import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as isFastTestRuntimeEnv } from "./env-DbG527wb.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import { d as stringifyRouteThreadId } from "./channel-route-2bD3dZs2.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { c as stripLeadingSilentToken, l as stripSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-DHFPcfdZ.mjs";
import { S as isSuppressedControlReplyText } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { o as shouldAttemptTtsPayload } from "./tts-config-C3g0K7Hg.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { d as resolveDeliveryNotSentRetryability, l as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-BD9P01Ce.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { a as inspectDeliveryQueueReceipt } from "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { n as prepareTtsPreferences } from "./tts-preferences-Bp6AU2gl.mjs";
import { n as hasExplicitCronDeliveryTarget } from "./delivery-target-validation-DmeSlZGT.mjs";
import { c as hasScheduledNextRunAtMs } from "./jobs-scheduling-sefIqbJ3.mjs";
import { n as isLikelyInterimCronMessage, t as expectsSubagentFollowup } from "./subagent-followup-hints-BBePQpRw.mjs";
//#region src/cron/isolated-agent/delivery-dispatch-policy.ts
const DIRECT_CRON_DELIVERY_COMPLETION_RETENTION = {
	idPrefix: "cron-direct-delivery:v1:",
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
/** Carry the implicit source's generation through outbound custody and recovery. */
function resolveDirectCronDeliveryGeneration(params) {
	return (params.job.sessionTarget === "isolated" || params.job.sessionTarget === "current") && params.sourceSessionKey && params.sourceSessionGeneration && !hasExplicitCronDeliveryTarget(params.deliveryPlan) ? {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(params.cfgWithAgentDefaults.session?.store, { agentId: params.agentId }),
		sessionKey: params.sourceSessionKey,
		sessionId: params.sourceSessionGeneration.sessionId,
		lifecycleRevision: params.sourceSessionGeneration.lifecycleRevision ?? null
	} : void 0;
}
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
const deliveryLoggerRuntimeLoader = createLazyImportLoader(() => import("./logger-DP5TOTWg.mjs"));
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const deliverySubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./delivery-subagent-registry.runtime.js"));
const subagentFollowupRuntimeLoader = createLazyImportLoader(() => import("./subagent-followup.runtime.js"));
/** Resolves whether descendant subagent output should replace the interim cron text. */
async function resolveDescendantSubagentFollowup(params) {
	if (params.spawnOnlyHandoff) {
		const child = await (await subagentFollowupRuntimeLoader.load()).waitForDescendantSubagentResult(params);
		return {
			finalReply: child?.reply,
			hasUnsettledDescendants: child === void 0,
			hadDescendants: true
		};
	}
	const expectedFollowup = expectsSubagentFollowup(params.initialSynthesizedText);
	const subagentRegistryRuntime = await deliverySubagentRegistryRuntimeLoader.load();
	let hasUnsettledDescendants = await subagentRegistryRuntime.hasUnsettledCronDescendants(params.sessionKey);
	const shouldCheckCompletedDescendants = !params.abortSignal?.aborted && !hasUnsettledDescendants && isLikelyInterimCronMessage(params.initialSynthesizedText);
	const followupRuntime = shouldCheckCompletedDescendants || hasUnsettledDescendants || expectedFollowup ? await subagentFollowupRuntimeLoader.load() : void 0;
	const completedDescendantReply = shouldCheckCompletedDescendants ? await followupRuntime?.readDescendantSubagentFallbackReply({
		sessionKey: params.sessionKey,
		runStartedAt: params.runStartedAt
	}) : void 0;
	const hadDescendants = hasUnsettledDescendants || Boolean(completedDescendantReply);
	if (!params.deliveryBestEffort && (hasUnsettledDescendants || expectedFollowup)) {
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
	const preparedTtsPreferences = await prepareTtsPreferences();
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		preparedTtsPreferences,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.delivery.channel,
		accountId: params.delivery.accountId
	})) return params.payloads;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	return await Promise.all(params.payloads.map((payload) => maybeApplyTtsToPayload({
		payload,
		preparedTtsPreferences,
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
async function isCompletedDirectCronDelivery(id, queueName) {
	const context = captureDeliveryQueueStateContext();
	return (await inspectDeliveryQueueReceipt(queueName, id, false, context)).status === "completed";
}
/** Wait only for an active recipient owner, never for crashed ambiguous sends. */
async function waitForCompletedDirectCronDelivery(params) {
	const context = captureDeliveryQueueStateContext();
	for (let attempt = 0; attempt < 120; attempt += 1) {
		params.signal?.throwIfAborted();
		const { status, pendingEntry: owner } = await inspectDeliveryQueueReceipt(params.queueName, params.id, true, context);
		params.signal?.throwIfAborted();
		if (status === "completed") return true;
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
//#region src/cron/isolated-agent/delivery-payload-normalization.ts
function shouldAttachDirectCronFallbackText(payload) {
	return Boolean(payload.channelData) && !hasReplyPayloadContent(payload, {
		trimText: true,
		hasChannelData: false
	});
}
function normalizeDirectPayload(payload) {
	const normalized = payload.text ? normalizeSilentReplyText(payload.text) : void 0;
	return normalized ? copyReplyPayloadMetadata(payload, {
		...payload,
		text: normalized.strippedTrailingSilentToken ? void 0 : normalized.text
	}) : payload;
}
function normalizeDirectCronDeliveryPayloads(params) {
	const fallback = normalizeSilentReplyText(normalizeOptionalString(params.outputText) ?? normalizeOptionalString(params.summary) ?? normalizeOptionalString(params.synthesizedText));
	const fallbackText = fallback.strippedTrailingSilentToken ? void 0 : fallback.text;
	const candidates = params.deliveryPayloads.map(normalizeDirectPayload).filter((payload) => hasReplyPayloadContent(payload, { trimText: true }));
	if (candidates.length === 0 && fallbackText) candidates.push({ text: fallbackText });
	const fallbackIndex = fallbackText ? candidates.findLastIndex((payload) => normalizeOptionalString(payload.text) === fallbackText) : -1;
	let fallbackSourceIndex = fallbackIndex >= 0 ? fallbackIndex : void 0;
	if (fallbackText && fallbackSourceIndex === void 0 && candidates.some(shouldAttachDirectCronFallbackText)) {
		candidates.unshift({ text: fallbackText });
		fallbackSourceIndex = 0;
	}
	const prepared = candidates.map((payload) => shouldAttachDirectCronFallbackText(payload) && fallbackText && fallbackSourceIndex !== void 0 ? copyReplyPayloadMetadata(payload, Object.assign({}, payload, { fallbackText: {
		text: fallbackText,
		replacesPayloadIndex: fallbackSourceIndex
	} })) : payload);
	const accepted = [];
	let channelSuppressed = false;
	for (const [index, candidate] of prepared.entries()) {
		const transformed = params.channelTransform ? params.channelTransform.apply(candidate) : candidate;
		if (transformed === null) channelSuppressed = true;
		else accepted.push({
			payload: transformed,
			sourceIndex: index
		});
	}
	if (accepted.length === 0) {
		const silent = [
			params.outputText,
			params.summary,
			params.synthesizedText,
			...params.deliveryPayloads.map((payload) => payload.text)
		].some((text) => typeof text === "string" && text.trim().length > 0);
		return {
			kind: "suppress",
			reason: channelSuppressed ? "channel_transform" : silent ? "silent" : "empty"
		};
	}
	const acceptedFallbackIndex = accepted.findIndex(({ sourceIndex }) => sourceIndex === fallbackSourceIndex);
	return {
		kind: "deliver",
		payload: accepted.map(({ payload }) => {
			const fallbackMeta = payload.fallbackText;
			if (!fallbackMeta || fallbackMeta.replacesPayloadIndex !== fallbackSourceIndex) return payload;
			return copyReplyPayloadMetadata(payload, Object.assign({}, payload, { fallbackText: acceptedFallbackIndex < 0 ? void 0 : {
				...fallbackMeta,
				replacesPayloadIndex: acceptedFallbackIndex
			} }));
		})
	};
}
/**
* Appends the Control UI run-inspection link to the last visible payload.
* Callers invoke this only after silent-reply suppression so a link cannot turn
* a silent or empty run into a visible announcement; the payload is replaced
* rather than mutated because payload objects can be aliased by the caller.
*/
function appendCronRunInspectionLink(payloads, inspectionUrl) {
	const index = payloads.findLastIndex((payload) => payload.text?.trim());
	if (!inspectionUrl || index < 0) return payloads;
	const payload = payloads[index];
	const linked = copyReplyPayloadMetadata(payload, {
		...payload,
		text: `${payload.text}\nInspect: ${inspectionUrl}`
	});
	return payloads.map((entry, at) => at === index ? linked : entry);
}
//#endregion
export { isCompletedDirectCronDelivery as a, normalizeSilentReplyText as c, resolveStaleCronDeliveryError as d, retryTransientDirectCronDelivery as f, buildDirectCronDeliveryIdempotencyKey as i, resolveDescendantSubagentFollowup as l, normalizeDirectCronDeliveryPayloads as n, logCronDeliveryWarn as o, waitForCompletedDirectCronDelivery as p, DIRECT_CRON_DELIVERY_COMPLETION_RETENTION as r, maybeApplyTtsToCronPayloads as s, appendCronRunInspectionLink as t, resolveDirectCronDeliveryGeneration as u };
