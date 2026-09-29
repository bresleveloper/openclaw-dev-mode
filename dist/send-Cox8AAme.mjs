import { t as __commonJSMin } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { S as parseStrictInteger, s as asFiniteNumber, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { i as waitForAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-C5zAusBU.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import { d as responseWithRelease } from "./fetch-guard-EFfAF2PS.mjs";
import { n as firstDefined } from "./allow-from-Dq2DvsNl.mjs";
import "./channel-outbound-Bk5sWC85.mjs";
import { l as kindFromMime, r as extensionForMime, s as isGifMedia } from "./mime-1zBUMwu6.mjs";
import { o as getImageMetadata } from "./image-ops-CU4vxSlO.mjs";
import { r as probeVideoDimensions } from "./media-probe-Bdg20gzZ.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { _ as saveCronStore, l as resolveCronStorePath, o as loadCronStore } from "./store-CV1wrdMb.mjs";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-CV_GHeLg.mjs";
import { n as normalizeOutboundLocation, t as formatLocationText } from "./location-Ce8_SVWn.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-DtUaHKzS.mjs";
import { t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-wGhP3Hri.mjs";
import { n as chunkByParagraph, s as resolveChunkMode } from "./chunk-D0NagiTt.mjs";
import { d as createChannelPartialDeliveryError, f as isChannelPartialDeliveryError } from "./live-CJusMVR5.mjs";
import { r as makeProxyFetch } from "./proxy-fetch-0WBdYnFw.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { C as readTelegramRetryAfterMs, D as normalizeTelegramApiRoot, S as isTelegramServerError, T as shouldRetryTelegramSendError, a as assertTelegramRequestAuthority, b as isTelegramMisdirectedRequestError, c as getTelegramRequestAuthority, d as isRecoverableTelegramNetworkError, h as isTelegramBadRequestError, l as withoutTelegramRequestAuthority, o as bindTelegramRequestAuthority, p as isSafeToRetrySendError, r as resolveTelegramTransport, s as findTelegramRequestAuthorityError, u as TelegramRequestNotStartedError, v as isTelegramMessageHasNoTextError, w as rethrowTelegramSendError, x as isTelegramRateLimitError, y as isTelegramMessageNotModifiedError } from "./fetch-BZlDgFP3.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./fetch-runtime-CknSDlAV.mjs";
import "./number-runtime-CGwowceO.mjs";
import { n as createChannelApiRetryRunner } from "./retry-policy-DICHODdx.mjs";
import "./retry-runtime-BLMk_EI2.mjs";
import { r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-CO4jVbzH.mjs";
import "./routing-JKvWkBDR.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-DCbmBy_n.mjs";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { n as isVoiceMessageCompatibleAudio } from "./audio-DJnvjL4a.mjs";
import { n as normalizePollInput } from "./polls-C-v11_tu.mjs";
import "./runtime-doctor-migrations-_pMXigSc.mjs";
import { h as resolveStorePath } from "./session-store-runtime-DhcFNaWV.mjs";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-CaI6yWBc.mjs";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "./runtime-group-policy-ChbZYnSE.mjs";
import "./config-mutation-BtV-Zu32.mjs";
import "./cron-store-runtime-S6UdiYfL.mjs";
import "./reply-reference-BbSBfc8h.mjs";
import "./reply-chunking-DVKHfn6G.mjs";
import "./channel-inbound-X7KrQT_y.mjs";
import "./web-media-KK6MuXNf.mjs";
import "./runtime-group-policy-8EXk6VMF.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./media-runtime-Cwd1EZJ3.mjs";
import "./media-mime-D8SxWw0k.mjs";
import "./logging-core-PsFqpLw0.mjs";
import "./markdown-table-runtime-3O2Eq18w.mjs";
import { a as DEFAULT_EMOJIS } from "./channel-feedback-DMcRvvIi.mjs";
import { r as isSenderAllowed } from "./access-groups-Brlf3mfl.mjs";
import { o as resolveTelegramAccount } from "./accounts-ByNW1Cs3.mjs";
import { a as normalizeTelegramLookupTarget, i as normalizeTelegramChatId, s as parseTelegramTarget } from "./topic-conversation-BlxRQJEK.mjs";
import { n as parseTelegramMessageThreadId, t as normalizeTelegramReplyToMessageId } from "./outbound-params-CEIp4vNq.mjs";
import { n as getTelegramRuntime, t as getOptionalTelegramRuntime } from "./runtime-DiTlx7dk.mjs";
import { n as resolveTelegramBotUserIdFromToken } from "./token-fingerprint-Ct5hUe3A.mjs";
import { D as extractTelegramLocation, E as buildSenderName, F as resolveTelegramPrimaryMedia, I as resolveTelegramRichMessageBody, O as getTelegramTextParts, P as normalizeForwardedContext, c as buildTelegramThreadParams, l as buildTypingThreadParams, y as resolveTelegramMessageThreadSpec } from "./helpers-Cx99qZMj.mjs";
import { A as splitTelegramCaption, D as buildInlineKeyboard, F as renderTelegramHtmlText, H as telegramMessagingTargetsMatch, I as splitTelegramHtmlChunks, K as resolveTelegramScopedGroupConfig, L as telegramHtmlToPlainTextFallback, M as markdownToTelegramChunks, N as markdownToTelegramHtml, R as wrapFileReferencesInHtml, S as parseTelegramPromptContextProjection, c as splitTelegramRichMessageTextChunks, d as splitTelegramRichBlocks, f as isTelegramEmptyContentError, g as withTelegramPlainFallback, h as warnTelegramRichBlocksDegradations, i as buildTelegramRichBlocksPlan, j as telegramCaptionDeliveryMetadata, k as resolveTelegramPlainCaption, l as toTelegramRichMessageContextParams, m as splitTelegramPlainTextChunks, n as resolveTelegramTextChunkLimit, o as buildTelegramRichMarkdownPlan, p as isTelegramHtmlParseError, s as removeTelegramRichNativeQuoteParam, z as escapeTelegramHtml } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-CELLJV4K.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { a as resolveSentMessageScopeKey, c as TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE, f as resolveTelegramMessageCachePersistentScopeKey, l as isTelegramMessageCacheSourceMessage, n as TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE, o as sentMessageEntryKey, p as resolveTelegramMessageCacheScope, r as TTL_MS, s as TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES, t as TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES, u as parseTelegramResolvedMedia } from "./sent-message-cache.legacy-state-Ckozzcje.mjs";
import { Bot, Bot as Bot$1, GrammyError, HttpError, InputFile } from "grammy";
import { sequentialize } from "@grammyjs/runner";
import { apiThrottler } from "@grammyjs/transformer-throttler";
//#region extensions/telegram/src/group-access.ts
function isGroupAllowOverrideAuthorized(params) {
	if (!params.effectiveGroupAllow.hasEntries) return false;
	const senderId = params.senderId ?? "";
	if (params.requireSenderForAllowOverride && !senderId) return false;
	return isSenderAllowed({
		allow: params.effectiveGroupAllow,
		senderId,
		senderUsername: params.senderUsername ?? ""
	});
}
const evaluateTelegramGroupBaseAccess = (params) => {
	if (params.groupConfig?.enabled === false) return {
		allowed: false,
		reason: "group-disabled"
	};
	if (params.topicConfig?.enabled === false) return {
		allowed: false,
		reason: "topic-disabled"
	};
	if (!params.isGroup) {
		if (params.enforceAllowOverride && params.hasGroupAllowOverride) {
			if (!isGroupAllowOverrideAuthorized({
				effectiveGroupAllow: params.effectiveGroupAllow,
				senderId: params.senderId,
				senderUsername: params.senderUsername,
				requireSenderForAllowOverride: params.requireSenderForAllowOverride
			})) return {
				allowed: false,
				reason: "group-override-unauthorized"
			};
		}
		return { allowed: true };
	}
	if (!params.enforceAllowOverride || !params.hasGroupAllowOverride) return { allowed: true };
	if (!isGroupAllowOverrideAuthorized({
		effectiveGroupAllow: params.effectiveGroupAllow,
		senderId: params.senderId,
		senderUsername: params.senderUsername,
		requireSenderForAllowOverride: params.requireSenderForAllowOverride
	})) return {
		allowed: false,
		reason: "group-override-unauthorized"
	};
	return { allowed: true };
};
const resolveTelegramRuntimeGroupPolicy = (params) => resolveOpenProviderRuntimeGroupPolicy({
	providerConfigPresent: params.providerConfigPresent,
	groupPolicy: params.groupPolicy,
	defaultGroupPolicy: params.defaultGroupPolicy
});
const resolveTelegramEffectiveGroupPolicy = (params) => {
	const { groupPolicy: runtimeFallbackPolicy } = resolveTelegramRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.telegram !== void 0,
		groupPolicy: params.telegramCfg.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	return firstDefined(params.topicConfig?.groupPolicy, params.groupConfig?.groupPolicy, params.telegramCfg.groupPolicy, params.cfg.channels?.defaults?.groupPolicy) ?? runtimeFallbackPolicy;
};
const evaluateTelegramGroupPolicyAccess = (params) => {
	const groupPolicy = resolveTelegramEffectiveGroupPolicy(params);
	if (!params.isGroup || !params.enforcePolicy) return {
		allowed: true,
		groupPolicy
	};
	if (groupPolicy === "disabled") return {
		allowed: false,
		reason: "group-policy-disabled",
		groupPolicy
	};
	let chatExplicitlyAllowed = false;
	if (params.checkChatAllowlist) {
		const groupAllowlist = params.resolveGroupPolicy(params.chatId, params.cfg);
		if (groupAllowlist.allowlistEnabled && !groupAllowlist.allowed) return {
			allowed: false,
			reason: "group-chat-not-allowed",
			groupPolicy
		};
		if (groupAllowlist.allowlistEnabled && groupAllowlist.allowed && groupAllowlist.groupConfig) chatExplicitlyAllowed = true;
	}
	if (groupPolicy === "allowlist" && params.enforceAllowlistAuthorization) {
		const senderId = params.senderId ?? "";
		const allowlistConfigured = chatExplicitlyAllowed || params.allowEmptyAllowlistEntries || params.effectiveGroupAllow.hasEntries;
		const allowlistMatched = chatExplicitlyAllowed && !params.effectiveGroupAllow.hasEntries || isSenderAllowed({
			allow: params.effectiveGroupAllow,
			senderId,
			senderUsername: params.senderUsername ?? ""
		});
		if (params.requireSenderForAllowlistAuthorization && !senderId) return {
			allowed: false,
			reason: "group-policy-allowlist-no-sender",
			groupPolicy
		};
		if (!allowlistConfigured) return {
			allowed: false,
			reason: "group-policy-allowlist-empty",
			groupPolicy
		};
		if (!allowlistMatched) return {
			allowed: false,
			reason: "group-policy-allowlist-unauthorized",
			groupPolicy
		};
	}
	return {
		allowed: true,
		groupPolicy
	};
};
//#endregion
//#region extensions/telegram/src/chat-action-timing.ts
const TELEGRAM_CHAT_ACTION_INTERVAL_MS = 4e3;
//#endregion
//#region extensions/telegram/src/sendchataction-401-backoff.ts
const BACKOFF_POLICY = {
	initialMs: 1e3,
	maxMs: 3e5,
	factor: 2,
	jitter: .1
};
function is401Error(error) {
	if (!error) return false;
	if (typeof error === "object" && error !== null && "error_code" in error && typeof error.error_code === "number") return error.error_code === 401;
	const message = error instanceof Error ? error.message : JSON.stringify(error);
	return normalizeLowercaseStringOrEmpty(message).includes("unauthorized");
}
function isTransientSendChatActionError(error) {
	return isTelegramRateLimitError(error) || isTelegramServerError(error) || isRecoverableTelegramNetworkError(error, { context: "action" });
}
function resolveTransientCooldownMs(error, attempt) {
	const retryAfterMs = readTelegramRetryAfterMs(error);
	if (retryAfterMs !== void 0 && retryAfterMs > 0) return retryAfterMs;
	return computeBackoff(BACKOFF_POLICY, attempt);
}
/**
* Creates a GLOBAL (per-account) handler for sendChatAction that tracks 401 and
* transient errors across all message contexts. This prevents the infinite loop
* that caused Telegram to delete bots (issue #27092).
*
* When a 401 occurs, exponential backoff is applied (1s → 2s → 4s → ... → 5min).
* After maxConsecutive401 failures (default 10), all sendChatAction calls are
* suspended until reset() is called.
*/
function createTelegramSendChatActionHandler({ logger, maxConsecutive401 = 10, minIntervalMs = 0, now = () => Date.now() }) {
	let consecutive401Failures = 0;
	let consecutiveTransientFailures = 0;
	let suspended = false;
	let transientCooldownUntilMs = 0;
	let failureVersion = 0;
	let authorizationRetryTail = Promise.resolve();
	const blockedUntilByKey = /* @__PURE__ */ new Map();
	const clearTransientCooldown = () => {
		consecutiveTransientFailures = 0;
		transientCooldownUntilMs = 0;
	};
	const reset = () => {
		consecutive401Failures = 0;
		clearTransientCooldown();
		suspended = false;
		blockedUntilByKey.clear();
	};
	const assertNotCoolingDown = () => {
		const remainingMs = transientCooldownUntilMs - now();
		if (remainingMs > 0) throw new Error(`sendChatAction transient cooldown active for ${Math.ceil(remainingMs)}ms`);
	};
	const sendChatAction = async (chatId, action, threadParams, send) => {
		if (suspended) return;
		const attemptedAt = now();
		assertNotCoolingDown();
		const threadId = threadParams?.message_thread_id;
		const key = minIntervalMs > 0 ? `${String(chatId)}:${action}${threadId === void 0 ? "" : `:${threadId}`}` : void 0;
		if (key) {
			const blockedUntil = blockedUntilByKey.get(key);
			if (blockedUntil !== void 0 && attemptedAt < blockedUntil) return;
			blockedUntilByKey.set(key, Number.POSITIVE_INFINITY);
		}
		try {
			await send();
		} finally {
			if (key) blockedUntilByKey.set(key, attemptedAt + minIntervalMs);
		}
	};
	const sendWithBackoff = async (send, signal) => {
		signal.throwIfAborted();
		if (suspended) throw new Error("sendChatAction suspended");
		assertNotCoolingDown();
		let attemptFailureVersion = failureVersion;
		let releaseAuthorizationRetry;
		try {
			if (consecutive401Failures > 0) {
				const previousRetry = authorizationRetryTail;
				const retryFinished = new Promise((resolve) => {
					releaseAuthorizationRetry = resolve;
				});
				authorizationRetryTail = previousRetry.then(() => retryFinished);
				await Promise.race([previousRetry, waitForAbortSignal(signal).then(() => {
					throw new DOMException("Chat action canceled", "AbortError");
				})]);
				signal.throwIfAborted();
				if (suspended) throw new Error("sendChatAction suspended");
				assertNotCoolingDown();
			}
			let failuresBeforeBackoff = consecutive401Failures;
			while (failuresBeforeBackoff > 0) {
				const backoffMs = computeBackoff(BACKOFF_POLICY, failuresBeforeBackoff);
				logger(`sendChatAction backoff: waiting ${backoffMs}ms before retry (failure ${consecutive401Failures}/${maxConsecutive401})`);
				await sleepWithAbort(backoffMs, signal);
				if (suspended) throw new Error("sendChatAction suspended");
				assertNotCoolingDown();
				if (consecutive401Failures <= failuresBeforeBackoff) break;
				failuresBeforeBackoff = consecutive401Failures;
			}
			attemptFailureVersion = failureVersion;
			const result = await send();
			if (attemptFailureVersion !== failureVersion) return result;
			if (consecutive401Failures > 0) {
				logger(`sendChatAction recovered after ${consecutive401Failures} consecutive 401 failures`);
				consecutive401Failures = 0;
			}
			clearTransientCooldown();
			return result;
		} catch (error) {
			if (signal.aborted && error instanceof Error && error.name === "AbortError") throw error;
			if (is401Error(error)) {
				if (attemptFailureVersion === failureVersion) clearTransientCooldown();
				failureVersion++;
				consecutive401Failures++;
				if (consecutive401Failures >= maxConsecutive401) {
					suspended = true;
					logger(`CRITICAL: sendChatAction suspended after ${consecutive401Failures} consecutive 401 errors. Bot token is likely invalid. Telegram may DELETE the bot if requests continue. Replace the Telegram token in config/env, then restart the Gateway.`);
				} else logger(`sendChatAction 401 error (${consecutive401Failures}/${maxConsecutive401}). Retrying with exponential backoff.`);
			} else if (isTransientSendChatActionError(error)) {
				failureVersion++;
				consecutiveTransientFailures++;
				const cooldownMs = resolveTransientCooldownMs(error, consecutiveTransientFailures);
				const cooldownStartedAt = now();
				const coalescingUntilMs = cooldownStartedAt + minIntervalMs;
				transientCooldownUntilMs = Math.max(transientCooldownUntilMs, cooldownStartedAt + cooldownMs, coalescingUntilMs);
				const effectiveCooldownMs = Math.max(0, transientCooldownUntilMs - cooldownStartedAt);
				logger(`sendChatAction transient error (${consecutiveTransientFailures}). Cooling down ${effectiveCooldownMs}ms before retry.`);
			} else if (attemptFailureVersion === failureVersion) clearTransientCooldown();
			throw error;
		} finally {
			releaseAuthorizationRetry?.();
		}
	};
	const apiTransformer = async (prev, method, payload, signal) => {
		if (method !== "sendChatAction") return prev(method, payload, signal);
		const controller = new AbortController();
		const abort = () => controller.abort();
		if (signal?.aborted) abort();
		else signal?.addEventListener("abort", abort, { once: true });
		try {
			return await sendWithBackoff(async () => {
				const result = await prev(method, payload, signal);
				if (!result.ok) throw new GrammyError(`Call to '${method}' failed!`, result, method, payload);
				return result;
			}, controller.signal);
		} finally {
			signal?.removeEventListener("abort", abort);
			controller.abort();
		}
	};
	return {
		apiTransformer,
		sendChatAction,
		isSuspended: () => suspended,
		reset
	};
}
//#endregion
//#region extensions/telegram/src/account-throttler.ts
var GroupRequestScheduler = class {
	constructor() {
		this.lanes = /* @__PURE__ */ new Map();
		this.laneOrder = [];
		this.nextLaneIndex = 0;
		this.running = false;
		this.actionTail = Promise.resolve();
		this.nextActionAtMs = 0;
	}
	enqueueAction(run, signal) {
		const controller = new AbortController();
		const abort = () => controller.abort();
		if (signal?.aborted) abort();
		else signal?.addEventListener("abort", abort, { once: true });
		const result = this.actionTail.then(async () => {
			controller.signal.throwIfAborted();
			const waitMs = this.nextActionAtMs - Date.now();
			if (waitMs > 0) await sleepWithAbort(waitMs, controller.signal);
			try {
				return await run();
			} finally {
				this.nextActionAtMs = Date.now() + 1e3;
			}
		});
		this.actionTail = result.then(() => void 0, () => void 0);
		return Promise.race([result, waitForAbortSignal(controller.signal).then(() => {
			throw new DOMException("Chat action canceled", "AbortError");
		})]).finally(() => {
			signal?.removeEventListener("abort", abort);
			controller.abort();
		});
	}
	enqueue(laneKey, run) {
		return new Promise((resolve, reject) => {
			const request = {
				run,
				resolve,
				reject
			};
			const existing = this.lanes.get(laneKey);
			if (existing) existing.push(request);
			else {
				this.lanes.set(laneKey, [request]);
				this.laneOrder.push(laneKey);
			}
			this.start();
		});
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.drain();
	}
	async drain() {
		try {
			while (true) {
				const request = this.takeNext();
				if (!request) return;
				try {
					request.resolve(await request.run());
				} catch (err) {
					request.reject(err);
				}
			}
		} finally {
			this.running = false;
			if (this.laneOrder.length > 0) this.start();
		}
	}
	takeNext() {
		for (let remaining = this.laneOrder.length; remaining > 0; remaining -= 1) {
			this.nextLaneIndex %= this.laneOrder.length;
			const laneKey = expectDefined(this.laneOrder[this.nextLaneIndex], "non-empty Telegram throttle lane order");
			const queue = this.lanes.get(laneKey);
			if (!queue || queue.length === 0) {
				this.lanes.delete(laneKey);
				this.laneOrder.splice(this.nextLaneIndex, 1);
				if (this.laneOrder.length === 0) {
					this.nextLaneIndex = 0;
					return;
				}
				continue;
			}
			const request = queue.shift();
			this.nextLaneIndex += 1;
			return request;
		}
	}
};
const TELEGRAM_ACCOUNT_THROTTLERS_KEY = Symbol.for("openclaw.telegram.accountThrottlers");
function getAccountThrottlers() {
	const globalRecord = globalThis;
	const existing = globalRecord[TELEGRAM_ACCOUNT_THROTTLERS_KEY];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	globalRecord[TELEGRAM_ACCOUNT_THROTTLERS_KEY] = created;
	return created;
}
function readNumericId(value) {
	return parseStrictInteger(value);
}
function readPayload(payload) {
	return payload && typeof payload === "object" ? payload : void 0;
}
function resolveGroupChatKey(payload) {
	const chatId = readNumericId(payload.chat_id);
	return chatId !== void 0 && chatId < 0 ? String(chatId) : void 0;
}
function resolveForumLaneKey(payload) {
	const threadId = readNumericId(payload.message_thread_id);
	if (threadId !== void 0) return `topic:${threadId}`;
	const directTopicId = readNumericId(payload.direct_messages_topic_id);
	if (directTopicId !== void 0) return `direct-topic:${directTopicId}`;
	const messageId = readNumericId(payload.message_id);
	if (messageId !== void 0) return `message:${messageId}`;
	return "main";
}
function createTelegramAccountThrottler(createThrottler = apiThrottler) {
	const baseThrottler = createThrottler();
	const chatActions = createTelegramSendChatActionHandler({
		logger: (message) => logVerbose(`telegram: ${message}`),
		minIntervalMs: TELEGRAM_CHAT_ACTION_INTERVAL_MS
	});
	const schedulersByChat = /* @__PURE__ */ new Map();
	const transformer = (prev, method, payload, signal) => {
		const apiPayload = readPayload(payload);
		const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
		if (!apiPayload || !groupChatKey) return baseThrottler((queuedMethod, queuedPayload, queuedSignal) => chatActions.apiTransformer(prev, queuedMethod, queuedPayload, queuedSignal), method, payload, signal);
		let scheduler = schedulersByChat.get(groupChatKey);
		if (!scheduler) {
			scheduler = new GroupRequestScheduler();
			schedulersByChat.set(groupChatKey, scheduler);
		}
		if (method === "sendChatAction") return scheduler.enqueueAction(() => chatActions.apiTransformer(prev, method, payload, signal), signal);
		const laneKey = resolveForumLaneKey(apiPayload);
		return scheduler.enqueue(laneKey, () => baseThrottler(prev, method, payload, signal));
	};
	return {
		transformer,
		chatActions
	};
}
function getOrCreateAccountThrottler(token, createThrottler = apiThrottler) {
	const throttlerByToken = getAccountThrottlers();
	let throttler = throttlerByToken.get(token);
	if (!throttler) {
		throttler = createTelegramAccountThrottler(createThrottler);
		throttlerByToken.set(token, throttler);
	}
	return throttler;
}
//#endregion
//#region extensions/telegram/src/client-fetch.ts
function asTelegramClientFetch(fetchImpl) {
	return fetchImpl;
}
function asTelegramCompatFetch(fetchImpl) {
	return fetchImpl;
}
function isTelegramAbortSignalLike(value) {
	return typeof value === "object" && value !== null && "aborted" in value && typeof value.aborted === "boolean" && typeof value.addEventListener === "function" && typeof value.removeEventListener === "function";
}
function readRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (input instanceof Request) return input.url;
	return null;
}
function extractTelegramApiMethod(input) {
	const url = readRequestUrl(input);
	if (!url) return null;
	try {
		const segments = new URL(url).pathname.split("/").filter(Boolean);
		const method = segments.length > 0 ? segments.at(-1) ?? null : null;
		return normalizeOptionalLowercaseString(method) ?? null;
	} catch {
		return null;
	}
}
const TELEGRAM_TIMEOUT_FALLBACK_METHODS = /* @__PURE__ */ new Set([
	"deletemycommands",
	"deletewebhook",
	"getme",
	"sendchataction",
	"setmycommands",
	"setwebhook"
]);
function shouldRetryTimedOutTelegramControlRequest(method) {
	return method !== null && TELEGRAM_TIMEOUT_FALLBACK_METHODS.has(method);
}
function resolveTelegramClientTimeoutSeconds(params) {
	const { value, minimum } = params;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const configured = Math.max(1, Math.floor(value));
	if (typeof minimum !== "number" || !Number.isFinite(minimum)) return configured;
	return Math.max(configured, Math.max(1, Math.floor(minimum)));
}
function resolveTelegramClientTimeoutMinimumSeconds(values) {
	let minimum;
	for (const value of values) {
		if (typeof value !== "number" || !Number.isFinite(value)) continue;
		const normalized = Math.max(1, Math.ceil(value));
		minimum = minimum === void 0 ? normalized : Math.max(minimum, normalized);
	}
	return minimum;
}
function resolveTelegramOutboundClientTimeoutFloorSeconds(timeoutSeconds) {
	const timeoutMs = resolveTelegramRequestTimeoutMs("sendmessage", timeoutSeconds);
	return timeoutMs === void 0 ? void 0 : timeoutMs / 1e3;
}
function createTelegramClientFetch(params) {
	if (!params.fetchImpl && !params.shutdownSignal) return;
	const callFetch = asTelegramCompatFetch(params.fetchImpl ?? asTelegramClientFetch(globalThis.fetch));
	const isRawSourceFetch = params.transport?.sourceFetch !== void 0 && params.fetchImpl === asTelegramClientFetch(params.transport.sourceFetch);
	const wrappedFetch = async (input, init) => {
		const assertCurrent = getTelegramRequestAuthority(init);
		const method = extractTelegramApiMethod(input);
		const requestTimeoutMs = resolveTelegramRequestTimeoutMs(method, params.timeoutSeconds);
		const shutdownSignal = isTelegramAbortSignalLike(params.shutdownSignal) ? params.shutdownSignal : void 0;
		const requestSignal = isTelegramAbortSignalLike(init?.signal) ? init.signal : void 0;
		const canForceTransportFallback = (reason) => !shutdownSignal?.aborted && !requestSignal?.aborted && params.transport?.forceFallback?.(reason) === true;
		const runFetch = async (allowMisdirectedFallback = false) => {
			assertTelegramRequestAuthority(assertCurrent);
			const controller = new AbortController();
			const abortWith = (signal) => controller.abort(signal.reason);
			const onShutdown = () => {
				if (shutdownSignal) abortWith(shutdownSignal);
			};
			let requestTimeout;
			let onRequestAbort;
			let requestTimedOut = false;
			const timeoutError = requestTimeoutMs !== void 0 ? /* @__PURE__ */ new Error(`Telegram ${method} timed out after ${requestTimeoutMs}ms`) : void 0;
			if (shutdownSignal?.aborted) abortWith(shutdownSignal);
			else if (shutdownSignal) shutdownSignal.addEventListener("abort", onShutdown, { once: true });
			if (requestSignal) {
				if (requestSignal.aborted) abortWith(requestSignal);
				else {
					onRequestAbort = () => abortWith(requestSignal);
					requestSignal.addEventListener("abort", onRequestAbort);
				}
			}
			if (requestTimeoutMs && timeoutError) {
				requestTimeout = setTimeout(() => {
					requestTimedOut = true;
					controller.abort(timeoutError);
				}, requestTimeoutMs);
				requestTimeout.unref?.();
			}
			const releaseRequest = async () => {
				if (requestTimeout) clearTimeout(requestTimeout);
				shutdownSignal?.removeEventListener("abort", onShutdown);
				if (requestSignal && onRequestAbort) requestSignal.removeEventListener("abort", onRequestAbort);
			};
			try {
				const response = await callFetch(input, {
					...isRawSourceFetch ? withoutTelegramRequestAuthority(init) : init,
					signal: controller.signal
				});
				if (response.status === 421) {
					const retry = allowMisdirectedFallback && canForceTransportFallback("misdirected-request");
					await response.body?.cancel().catch(() => void 0);
					if (retry) {
						await releaseRequest();
						return runFetch();
					}
					throw new TelegramRequestNotStartedError();
				}
				return responseWithRelease(response, releaseRequest);
			} catch (err) {
				await releaseRequest();
				if (requestTimedOut && timeoutError) throw timeoutError;
				throw err;
			}
		};
		try {
			return await runFetch(true);
		} catch (err) {
			if (findTelegramRequestAuthorityError(err)) throw err;
			if (requestTimeoutMs && shouldRetryTimedOutTelegramControlRequest(method) && canForceTransportFallback("request-timeout")) return await runFetch();
			if (isTelegramMisdirectedRequestError(err) && canForceTransportFallback("misdirected-request")) return await runFetch();
			throw err;
		}
	};
	return wrappedFetch;
}
//#endregion
//#region extensions/telegram/src/retry-after.ts
const TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS = 6e4;
//#endregion
//#region extensions/telegram/src/target-writeback.ts
const writebackLogger = createSubsystemLogger("telegram/target-writeback");
const TELEGRAM_ADMIN_SCOPE = "operator.admin";
function buildResolvedTelegramTarget(params) {
	const { raw, parsed, resolvedChatId } = params;
	if (parsed.directMessagesTopicId != null) return `${resolvedChatId}:direct-topic:${parsed.directMessagesTopicId}`;
	if (parsed.messageThreadId == null) return resolvedChatId;
	return raw.includes(":topic:") ? `${resolvedChatId}:topic:${parsed.messageThreadId}` : `${resolvedChatId}:${parsed.messageThreadId}`;
}
function resolveLegacyRewrite(params) {
	const parsed = parseTelegramTarget(params.raw);
	if (normalizeTelegramChatId(parsed.chatId) || !normalizeTelegramLookupTarget(parsed.chatId)) return null;
	return {
		sourceTarget: params.raw,
		resolvedTarget: buildResolvedTelegramTarget({
			raw: params.raw,
			parsed,
			resolvedChatId: params.resolvedChatId
		})
	};
}
function rewriteTargetIfMatch(params) {
	if (typeof params.rawValue !== "string" && typeof params.rawValue !== "number") return null;
	const value = normalizeOptionalString(String(params.rawValue)) ?? "";
	if (!value) return null;
	if (!telegramMessagingTargetsMatch(value, params.sourceTarget)) return null;
	return params.resolvedTarget;
}
function replaceTelegramDefaultToTargets(params) {
	let changed = false;
	const telegram = asNullableRecord(params.cfg.channels?.telegram);
	if (!telegram) return changed;
	const maybeReplace = (holder, key) => {
		const nextTarget = rewriteTargetIfMatch({
			rawValue: holder[key],
			sourceTarget: params.sourceTarget,
			resolvedTarget: params.resolvedTarget
		});
		if (!nextTarget) return;
		holder[key] = nextTarget;
		changed = true;
	};
	maybeReplace(telegram, "defaultTo");
	const accounts = asNullableRecord(telegram.accounts);
	if (!accounts) return changed;
	for (const accountId of Object.keys(accounts)) {
		const account = asNullableRecord(accounts[accountId]);
		if (!account) continue;
		maybeReplace(account, "defaultTo");
	}
	return changed;
}
async function maybePersistResolvedTelegramTarget(params) {
	const raw = params.rawTarget.trim();
	if (!raw) return;
	const rewrite = resolveLegacyRewrite({
		raw,
		resolvedChatId: params.resolvedChatId
	});
	if (!rewrite) return;
	const { sourceTarget, resolvedTarget } = rewrite;
	const hasGatewayAdminScope = params.gatewayClientScopes?.includes(TELEGRAM_ADMIN_SCOPE) === true;
	const trustedInternalWriteback = params.gatewayClientScopes === void 0 && params.trustedInternalWriteback === true;
	if (!hasGatewayAdminScope && !trustedInternalWriteback) {
		writebackLogger.warn(`skipping Telegram target writeback for ${raw} because gateway caller is missing ${TELEGRAM_ADMIN_SCOPE}`);
		return;
	}
	try {
		const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
		const nextConfig = structuredClone(snapshot.config ?? {});
		if (replaceTelegramDefaultToTargets({
			cfg: nextConfig,
			sourceTarget,
			resolvedTarget
		})) {
			await replaceConfigFile({
				nextConfig,
				snapshot,
				writeOptions,
				afterWrite: { mode: "auto" }
			});
			if (params.verbose) writebackLogger.warn(`resolved Telegram defaultTo target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram defaultTo target ${raw}: ${String(err)}`);
	}
	try {
		const storePath = resolveCronStorePath();
		const store = await loadCronStore(storePath);
		let cronChanged = false;
		for (const job of store.jobs) {
			if (job.delivery?.channel !== "telegram") continue;
			const nextTarget = rewriteTargetIfMatch({
				rawValue: job.delivery.to,
				sourceTarget,
				resolvedTarget
			});
			if (!nextTarget) continue;
			job.delivery.to = nextTarget;
			cronChanged = true;
		}
		if (cronChanged) {
			await saveCronStore(storePath, store);
			if (params.verbose) writebackLogger.warn(`resolved Telegram cron delivery target ${raw} -> ${resolvedTarget}`);
		}
	} catch (err) {
		if (params.verbose) writebackLogger.warn(`failed to persist Telegram cron target ${raw}: ${String(err)}`);
	}
}
//#endregion
//#region extensions/telegram/src/send-context.ts
function resolveTelegramMessageIdOrThrow(result, context) {
	if (typeof result?.message_id === "number" && Number.isFinite(result.message_id)) return Math.trunc(result.message_id);
	throw new Error(`Telegram ${context} returned no message_id`);
}
function logTelegramOutboundSendOk(params) {
	const parts = [
		"telegram outbound send ok",
		`accountId=${params.accountId}`,
		`chatId=${params.chatId}`,
		`messageId=${params.messageId}`,
		`operation=${params.operation}`
	];
	if (params.deliveryKind) parts.push(`deliveryKind=${params.deliveryKind}`);
	if (typeof params.messageThreadId === "number") parts.push(`threadId=${params.messageThreadId}`);
	if (typeof params.replyToMessageId === "number") parts.push(`replyToMessageId=${params.replyToMessageId}`);
	if (params.silent === true) parts.push("silent=true");
	if (typeof params.chunkCount === "number") parts.push(`chunkCount=${params.chunkCount}`);
	sendLogger$1.info(parts.join(" "));
}
function resolveAcceptedReplyToMessageId(params) {
	if (!params) return;
	if ("reply_to_message_id" in params) return params.reply_to_message_id;
	return params.reply_parameters?.message_id;
}
function toAcceptedThreadScopedParams(params) {
	if (!params) return;
	const scoped = {};
	if (typeof params.message_thread_id === "number" && Number.isFinite(params.message_thread_id)) scoped.message_thread_id = params.message_thread_id;
	if (typeof params.reply_to_message_id === "number" && Number.isFinite(params.reply_to_message_id)) scoped.reply_to_message_id = params.reply_to_message_id;
	const replyParameters = params.reply_parameters;
	if (replyParameters && typeof replyParameters === "object") {
		const messageId = replyParameters.message_id;
		if (typeof messageId === "number" && Number.isFinite(messageId)) scoped.reply_parameters = { message_id: messageId };
	}
	return Object.keys(scoped).length > 0 ? scoped : void 0;
}
const MESSAGE_DELETE_NOOP_RE = /message to delete not found|message can't be deleted|MESSAGE_ID_INVALID|MESSAGE_DELETE_FORBIDDEN/i;
const CHAT_NOT_FOUND_RE = /400: Bad Request: chat not found/i;
const sendLogger$1 = createSubsystemLogger("telegram/send");
const diagLogger = createSubsystemLogger("telegram/diagnostic");
const telegramClientOptionsCache = /* @__PURE__ */ new Map();
const MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE = 64;
function resetTelegramClientOptionsCacheForTests() {
	for (const entry of telegramClientOptionsCache.values()) closeCachedTelegramClientOptions(entry);
	telegramClientOptionsCache.clear();
}
function createTelegramHttpLogger(cfg) {
	if (!isDiagnosticFlagEnabled("telegram.http", cfg)) return () => {};
	return (label, err) => {
		if (!(err instanceof HttpError)) return;
		const detail = redactSensitiveText(formatUncaughtError(err.error ?? err));
		diagLogger.warn(`telegram http error (${label}): ${detail}`);
	};
}
function buildTelegramClientOptionsCacheKey(account) {
	const proxyKey = account.config.proxy?.trim() ?? "";
	const autoSelectFamily = account.config.network?.autoSelectFamily;
	const autoSelectFamilyKey = typeof autoSelectFamily === "boolean" ? String(autoSelectFamily) : "default";
	const dnsResultOrderKey = account.config.network?.dnsResultOrder ?? "default";
	const apiRootKey = account.config.apiRoot?.trim() ?? "";
	return `${account.accountId}::${proxyKey}::${autoSelectFamilyKey}::${dnsResultOrderKey}::${apiRootKey}`;
}
function closeCachedTelegramClientOptions(entry) {
	entry.retired = true;
	if (entry.activeLeases > 0 || entry.closeStarted) return;
	entry.closeStarted = true;
	entry.transport.close().catch((err) => {
		diagLogger.warn(`telegram client options cache transport close failed: ${redactSensitiveText(formatUncaughtError(err))}`);
	});
}
function leaseCachedTelegramClientOptions(entry) {
	entry.activeLeases += 1;
	let released = false;
	return { release: () => {
		if (released) return;
		released = true;
		entry.activeLeases = Math.max(0, entry.activeLeases - 1);
		if (entry.retired) closeCachedTelegramClientOptions(entry);
	} };
}
function setCachedTelegramClientOptions(cacheKey, entry) {
	telegramClientOptionsCache.set(cacheKey, entry);
	if (telegramClientOptionsCache.size > MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE) {
		const oldestKey = telegramClientOptionsCache.keys().next().value;
		if (oldestKey !== void 0) {
			const evictedEntry = telegramClientOptionsCache.get(oldestKey);
			telegramClientOptionsCache.delete(oldestKey);
			if (evictedEntry) closeCachedTelegramClientOptions(evictedEntry);
		}
	}
	return {
		clientOptions: entry.clientOptions,
		lease: () => leaseCachedTelegramClientOptions(entry)
	};
}
function resolveTelegramClientOptions(account) {
	const cacheKey = buildTelegramClientOptionsCacheKey(account);
	const entry = telegramClientOptionsCache.get(cacheKey);
	if (entry) return {
		clientOptions: entry.clientOptions,
		lease: () => leaseCachedTelegramClientOptions(entry)
	};
	const proxyUrl = normalizeOptionalString(account.config.proxy);
	const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
	const apiRoot = normalizeOptionalString(account.config.apiRoot);
	const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: account.config.network });
	const fetchImpl = createTelegramClientFetch({
		fetchImpl: asTelegramClientFetch(transport.fetch),
		transport
	});
	return setCachedTelegramClientOptions(cacheKey, {
		activeLeases: 0,
		clientOptions: fetchImpl || normalizedApiRoot ? {
			...fetchImpl ? { fetch: asTelegramClientFetch(fetchImpl) } : {},
			...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
		} : void 0,
		closeStarted: false,
		retired: false,
		transport
	});
}
function resolveToken(explicit, params) {
	if (explicit?.trim()) return explicit.trim();
	if (!params.token) throw new Error(`Telegram bot token missing for account "${params.accountId}" (set channels.telegram.accounts.${params.accountId}.botToken/tokenFile or TELEGRAM_BOT_TOKEN for default).`);
	return params.token.trim();
}
async function resolveChatId(to, params) {
	const numericChatId = normalizeTelegramChatId(to);
	if (numericChatId) return numericChatId;
	const lookupTarget = normalizeTelegramLookupTarget(to);
	const getChat = params.api.getChat;
	if (!lookupTarget || typeof getChat !== "function") throw new Error("Telegram recipient must be a numeric chat ID");
	try {
		const chat = await getChat.call(params.api, lookupTarget);
		const resolved = normalizeTelegramChatId(String(chat?.id ?? ""));
		if (!resolved) throw new Error(`resolved chat id is not numeric (${String(chat?.id ?? "")})`);
		if (params.verbose) sendLogger$1.warn(`telegram recipient ${lookupTarget} resolved to numeric chat id ${resolved}`);
		return resolved;
	} catch (err) {
		const detail = formatErrorMessage(err);
		throw new Error(`Telegram recipient ${lookupTarget} could not be resolved to a numeric chat ID (${detail})`, { cause: err });
	}
}
async function resolveAndPersistChatId(params) {
	const chatId = await resolveChatId(params.lookupTarget, {
		api: params.api,
		verbose: params.verbose
	});
	await maybePersistResolvedTelegramTarget({
		cfg: params.cfg,
		rawTarget: params.persistTarget,
		resolvedChatId: chatId,
		verbose: params.verbose,
		gatewayClientScopes: params.gatewayClientScopes,
		...params.gatewayClientScopes === void 0 ? { trustedInternalWriteback: true } : {}
	});
	return chatId;
}
function normalizeMessageId(raw) {
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
	if (typeof raw === "string") {
		const value = raw.trim();
		if (!value) throw new Error("Message id is required for Telegram actions");
		const parsed = parseStrictInteger(value);
		if (parsed !== void 0) return parsed;
	}
	throw new Error("Message id is required for Telegram actions");
}
function isTelegramMessageDeleteNoopError(err) {
	return MESSAGE_DELETE_NOOP_RE.test(formatErrorMessage(err));
}
function resolveTelegramApiContext(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Telegram API context");
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = resolveToken(opts.token, account);
	let api;
	let clientOptionsLease;
	if (opts.api) api = opts.api;
	else {
		const client = resolveTelegramClientOptions(account);
		clientOptionsLease = client.lease();
		const fetch = client.clientOptions?.fetch;
		const clientOptions = fetch && opts.assertPlatformSendAuthorized ? {
			...client.clientOptions,
			fetch: bindTelegramRequestAuthority(fetch, opts.assertPlatformSendAuthorized)
		} : client.clientOptions;
		const bot = new Bot(token, clientOptions ? { client: clientOptions } : void 0);
		if (opts.signal || opts.assertPlatformSendAuthorized) bot.api.config.use((prev, method, payload, signal) => {
			opts.signal?.throwIfAborted();
			opts.assertPlatformSendAuthorized?.();
			return prev(method, payload, signal).catch((error) => {
				const rejection = error instanceof HttpError ? findTelegramRequestAuthorityError(error.error) : void 0;
				if (rejection) throw rejection.originalError;
				throw error;
			});
		});
		bot.api.config.use(getOrCreateAccountThrottler(token).transformer);
		api = bot.api;
	}
	return {
		cfg,
		account,
		ownerAgentId: resolveTelegramAccountOwnerAgentId({
			cfg,
			accountId: account.accountId
		}),
		api,
		...clientOptionsLease ? { clientOptionsLease } : {}
	};
}
async function withTelegramApiContext(opts, operation) {
	const context = resolveTelegramApiContext(opts);
	try {
		return await operation(context);
	} finally {
		context.clientOptionsLease?.release();
	}
}
function createTelegramRequestWithDiag(params) {
	const request = createChannelApiRetryRunner({
		retry: params.retry,
		verbose: params.verbose,
		...params.retryAfterMaxDelayMs !== void 0 ? { retryAfterMaxDelayMs: params.retryAfterMaxDelayMs } : {},
		...params.shouldRetry ? { shouldRetry: params.shouldRetry } : {},
		...params.strictShouldRetry ? { strictShouldRetry: true } : {}
	});
	const logHttpError = createTelegramHttpLogger(params.cfg);
	return (fn, label, options) => {
		const runRequest = () => request(fn, label);
		return (params.useApiErrorLogging === false ? runRequest() : withTelegramApiErrorLogging({
			operation: label ?? "request",
			fn: runRequest,
			...options?.shouldLog ? { shouldLog: options.shouldLog } : {}
		})).catch((err) => {
			logHttpError(label ?? "request", err);
			throw err;
		});
	};
}
function wrapTelegramChatNotFoundError(err, params) {
	const errorMsg = formatErrorMessage(err);
	if (/403.*(bot.*not.*member|bot.*blocked|bot.*kicked)/i.test(errorMsg)) return new Error([
		`Telegram send failed: bot is not a member of the chat, was blocked, or was kicked (chat_id=${params.chatId}).`,
		`Telegram API said: ${errorMsg}.`,
		"Fix: Add the bot to the channel/group, or ensure it has not been removed/blocked/kicked by the user.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
	if (!CHAT_NOT_FOUND_RE.test(errorMsg)) return err;
	return new Error([
		`Telegram send failed: chat not found (chat_id=${params.chatId}).`,
		"Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
		`Input was: ${JSON.stringify(params.input)}.`
	].join(" "));
}
function createRequestWithChatNotFound(params) {
	return async (fn, label, options) => params.requestWithDiag(fn, label, options).catch((err) => {
		throw wrapTelegramChatNotFoundError(err, {
			chatId: params.chatId,
			input: params.input
		});
	});
}
function createTelegramNonIdempotentRequestWithDiag(params) {
	const request = createTelegramRequestWithDiag({
		cfg: params.cfg,
		account: params.account,
		retry: params.retry,
		verbose: params.verbose,
		useApiErrorLogging: params.useApiErrorLogging,
		retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS,
		shouldRetry: shouldRetryTelegramSendError,
		strictShouldRetry: true
	});
	return (fn, label, options) => request(fn, label, options).catch(rethrowTelegramSendError);
}
//#endregion
//#region node_modules/.pnpm/event-target-shim@5.0.1/node_modules/event-target-shim/dist/event-target-shim.js
/**
* @author Toru Nagashima <https://github.com/mysticatea>
* @copyright 2015 Toru Nagashima. All rights reserved.
* See LICENSE file in root directory for full license.
*/
var require_event_target_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* @typedef {object} PrivateData
	* @property {EventTarget} eventTarget The event target.
	* @property {{type:string}} event The original event object.
	* @property {number} eventPhase The current event phase.
	* @property {EventTarget|null} currentTarget The current event target.
	* @property {boolean} canceled The flag to prevent default.
	* @property {boolean} stopped The flag to stop propagation.
	* @property {boolean} immediateStopped The flag to stop propagation immediately.
	* @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
	* @property {number} timeStamp The unix time.
	* @private
	*/
	/**
	* Private data for event wrappers.
	* @type {WeakMap<Event, PrivateData>}
	* @private
	*/
	const privateData = /* @__PURE__ */ new WeakMap();
	/**
	* Cache for wrapper classes.
	* @type {WeakMap<Object, Function>}
	* @private
	*/
	const wrappers = /* @__PURE__ */ new WeakMap();
	/**
	* Get private data.
	* @param {Event} event The event object to get private data.
	* @returns {PrivateData} The private data of the event.
	* @private
	*/
	function pd(event) {
		const retv = privateData.get(event);
		console.assert(retv != null, "'this' is expected an Event object, but got", event);
		return retv;
	}
	/**
	* https://dom.spec.whatwg.org/#set-the-canceled-flag
	* @param data {PrivateData} private data.
	*/
	function setCancelFlag(data) {
		if (data.passiveListener != null) {
			if (typeof console !== "undefined" && typeof console.error === "function") console.error("Unable to preventDefault inside passive event listener invocation.", data.passiveListener);
			return;
		}
		if (!data.event.cancelable) return;
		data.canceled = true;
		if (typeof data.event.preventDefault === "function") data.event.preventDefault();
	}
	/**
	* @see https://dom.spec.whatwg.org/#interface-event
	* @private
	*/
	/**
	* The event wrapper.
	* @constructor
	* @param {EventTarget} eventTarget The event target of this dispatching.
	* @param {Event|{type:string}} event The original event to wrap.
	*/
	function Event(eventTarget, event) {
		privateData.set(this, {
			eventTarget,
			event,
			eventPhase: 2,
			currentTarget: eventTarget,
			canceled: false,
			stopped: false,
			immediateStopped: false,
			passiveListener: null,
			timeStamp: event.timeStamp || Date.now()
		});
		Object.defineProperty(this, "isTrusted", {
			value: false,
			enumerable: true
		});
		const keys = Object.keys(event);
		for (let i = 0; i < keys.length; ++i) {
			const key = keys[i];
			if (!(key in this)) Object.defineProperty(this, key, defineRedirectDescriptor(key));
		}
	}
	Event.prototype = {
		/**
		* The type of this event.
		* @type {string}
		*/
		get type() {
			return pd(this).event.type;
		},
		/**
		* The target of this event.
		* @type {EventTarget}
		*/
		get target() {
			return pd(this).eventTarget;
		},
		/**
		* The target of this event.
		* @type {EventTarget}
		*/
		get currentTarget() {
			return pd(this).currentTarget;
		},
		/**
		* @returns {EventTarget[]} The composed path of this event.
		*/
		composedPath() {
			const currentTarget = pd(this).currentTarget;
			if (currentTarget == null) return [];
			return [currentTarget];
		},
		/**
		* Constant of NONE.
		* @type {number}
		*/
		get NONE() {
			return 0;
		},
		/**
		* Constant of CAPTURING_PHASE.
		* @type {number}
		*/
		get CAPTURING_PHASE() {
			return 1;
		},
		/**
		* Constant of AT_TARGET.
		* @type {number}
		*/
		get AT_TARGET() {
			return 2;
		},
		/**
		* Constant of BUBBLING_PHASE.
		* @type {number}
		*/
		get BUBBLING_PHASE() {
			return 3;
		},
		/**
		* The target of this event.
		* @type {number}
		*/
		get eventPhase() {
			return pd(this).eventPhase;
		},
		/**
		* Stop event bubbling.
		* @returns {void}
		*/
		stopPropagation() {
			const data = pd(this);
			data.stopped = true;
			if (typeof data.event.stopPropagation === "function") data.event.stopPropagation();
		},
		/**
		* Stop event bubbling.
		* @returns {void}
		*/
		stopImmediatePropagation() {
			const data = pd(this);
			data.stopped = true;
			data.immediateStopped = true;
			if (typeof data.event.stopImmediatePropagation === "function") data.event.stopImmediatePropagation();
		},
		/**
		* The flag to be bubbling.
		* @type {boolean}
		*/
		get bubbles() {
			return Boolean(pd(this).event.bubbles);
		},
		/**
		* The flag to be cancelable.
		* @type {boolean}
		*/
		get cancelable() {
			return Boolean(pd(this).event.cancelable);
		},
		/**
		* Cancel this event.
		* @returns {void}
		*/
		preventDefault() {
			setCancelFlag(pd(this));
		},
		/**
		* The flag to indicate cancellation state.
		* @type {boolean}
		*/
		get defaultPrevented() {
			return pd(this).canceled;
		},
		/**
		* The flag to be composed.
		* @type {boolean}
		*/
		get composed() {
			return Boolean(pd(this).event.composed);
		},
		/**
		* The unix time of this event.
		* @type {number}
		*/
		get timeStamp() {
			return pd(this).timeStamp;
		},
		/**
		* The target of this event.
		* @type {EventTarget}
		* @deprecated
		*/
		get srcElement() {
			return pd(this).eventTarget;
		},
		/**
		* The flag to stop event bubbling.
		* @type {boolean}
		* @deprecated
		*/
		get cancelBubble() {
			return pd(this).stopped;
		},
		set cancelBubble(value) {
			if (!value) return;
			const data = pd(this);
			data.stopped = true;
			if (typeof data.event.cancelBubble === "boolean") data.event.cancelBubble = true;
		},
		/**
		* The flag to indicate cancellation state.
		* @type {boolean}
		* @deprecated
		*/
		get returnValue() {
			return !pd(this).canceled;
		},
		set returnValue(value) {
			if (!value) setCancelFlag(pd(this));
		},
		/**
		* Initialize this event object. But do nothing under event dispatching.
		* @param {string} type The event type.
		* @param {boolean} [bubbles=false] The flag to be possible to bubble up.
		* @param {boolean} [cancelable=false] The flag to be possible to cancel.
		* @deprecated
		*/
		initEvent() {}
	};
	Object.defineProperty(Event.prototype, "constructor", {
		value: Event,
		configurable: true,
		writable: true
	});
	if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
		Object.setPrototypeOf(Event.prototype, window.Event.prototype);
		wrappers.set(window.Event.prototype, Event);
	}
	/**
	* Get the property descriptor to redirect a given property.
	* @param {string} key Property name to define property descriptor.
	* @returns {PropertyDescriptor} The property descriptor to redirect the property.
	* @private
	*/
	function defineRedirectDescriptor(key) {
		return {
			get() {
				return pd(this).event[key];
			},
			set(value) {
				pd(this).event[key] = value;
			},
			configurable: true,
			enumerable: true
		};
	}
	/**
	* Get the property descriptor to call a given method property.
	* @param {string} key Property name to define property descriptor.
	* @returns {PropertyDescriptor} The property descriptor to call the method property.
	* @private
	*/
	function defineCallDescriptor(key) {
		return {
			value() {
				const event = pd(this).event;
				return event[key].apply(event, arguments);
			},
			configurable: true,
			enumerable: true
		};
	}
	/**
	* Define new wrapper class.
	* @param {Function} BaseEvent The base wrapper class.
	* @param {Object} proto The prototype of the original event.
	* @returns {Function} The defined wrapper class.
	* @private
	*/
	function defineWrapper(BaseEvent, proto) {
		const keys = Object.keys(proto);
		if (keys.length === 0) return BaseEvent;
		/** CustomEvent */
		function CustomEvent(eventTarget, event) {
			BaseEvent.call(this, eventTarget, event);
		}
		CustomEvent.prototype = Object.create(BaseEvent.prototype, { constructor: {
			value: CustomEvent,
			configurable: true,
			writable: true
		} });
		for (let i = 0; i < keys.length; ++i) {
			const key = keys[i];
			if (!(key in BaseEvent.prototype)) {
				const isFunc = typeof Object.getOwnPropertyDescriptor(proto, key).value === "function";
				Object.defineProperty(CustomEvent.prototype, key, isFunc ? defineCallDescriptor(key) : defineRedirectDescriptor(key));
			}
		}
		return CustomEvent;
	}
	/**
	* Get the wrapper class of a given prototype.
	* @param {Object} proto The prototype of the original event to get its wrapper.
	* @returns {Function} The wrapper class.
	* @private
	*/
	function getWrapper(proto) {
		if (proto == null || proto === Object.prototype) return Event;
		let wrapper = wrappers.get(proto);
		if (wrapper == null) {
			wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
			wrappers.set(proto, wrapper);
		}
		return wrapper;
	}
	/**
	* Wrap a given event to management a dispatching.
	* @param {EventTarget} eventTarget The event target of this dispatching.
	* @param {Object} event The event to wrap.
	* @returns {Event} The wrapper instance.
	* @private
	*/
	function wrapEvent(eventTarget, event) {
		return new (getWrapper(Object.getPrototypeOf(event)))(eventTarget, event);
	}
	/**
	* Get the immediateStopped flag of a given event.
	* @param {Event} event The event to get.
	* @returns {boolean} The flag to stop propagation immediately.
	* @private
	*/
	function isStopped(event) {
		return pd(event).immediateStopped;
	}
	/**
	* Set the current event phase of a given event.
	* @param {Event} event The event to set current target.
	* @param {number} eventPhase New event phase.
	* @returns {void}
	* @private
	*/
	function setEventPhase(event, eventPhase) {
		pd(event).eventPhase = eventPhase;
	}
	/**
	* Set the current target of a given event.
	* @param {Event} event The event to set current target.
	* @param {EventTarget|null} currentTarget New current target.
	* @returns {void}
	* @private
	*/
	function setCurrentTarget(event, currentTarget) {
		pd(event).currentTarget = currentTarget;
	}
	/**
	* Set a passive listener of a given event.
	* @param {Event} event The event to set current target.
	* @param {Function|null} passiveListener New passive listener.
	* @returns {void}
	* @private
	*/
	function setPassiveListener(event, passiveListener) {
		pd(event).passiveListener = passiveListener;
	}
	/**
	* @typedef {object} ListenerNode
	* @property {Function} listener
	* @property {1|2|3} listenerType
	* @property {boolean} passive
	* @property {boolean} once
	* @property {ListenerNode|null} next
	* @private
	*/
	/**
	* @type {WeakMap<object, Map<string, ListenerNode>>}
	* @private
	*/
	const listenersMap = /* @__PURE__ */ new WeakMap();
	const CAPTURE = 1;
	const BUBBLE = 2;
	const ATTRIBUTE = 3;
	/**
	* Check whether a given value is an object or not.
	* @param {any} x The value to check.
	* @returns {boolean} `true` if the value is an object.
	*/
	function isObject(x) {
		return x !== null && typeof x === "object";
	}
	/**
	* Get listeners.
	* @param {EventTarget} eventTarget The event target to get.
	* @returns {Map<string, ListenerNode>} The listeners.
	* @private
	*/
	function getListeners(eventTarget) {
		const listeners = listenersMap.get(eventTarget);
		if (listeners == null) throw new TypeError("'this' is expected an EventTarget object, but got another value.");
		return listeners;
	}
	/**
	* Get the property descriptor for the event attribute of a given event.
	* @param {string} eventName The event name to get property descriptor.
	* @returns {PropertyDescriptor} The property descriptor.
	* @private
	*/
	function defineEventAttributeDescriptor(eventName) {
		return {
			get() {
				let node = getListeners(this).get(eventName);
				while (node != null) {
					if (node.listenerType === ATTRIBUTE) return node.listener;
					node = node.next;
				}
				return null;
			},
			set(listener) {
				if (typeof listener !== "function" && !isObject(listener)) listener = null;
				const listeners = getListeners(this);
				let prev = null;
				let node = listeners.get(eventName);
				while (node != null) {
					if (node.listenerType === ATTRIBUTE) {
						if (prev !== null) prev.next = node.next;
						else if (node.next !== null) listeners.set(eventName, node.next);
						else listeners.delete(eventName);
					} else prev = node;
					node = node.next;
				}
				if (listener !== null) {
					const newNode = {
						listener,
						listenerType: ATTRIBUTE,
						passive: false,
						once: false,
						next: null
					};
					if (prev === null) listeners.set(eventName, newNode);
					else prev.next = newNode;
				}
			},
			configurable: true,
			enumerable: true
		};
	}
	/**
	* Define an event attribute (e.g. `eventTarget.onclick`).
	* @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
	* @param {string} eventName The event name to define.
	* @returns {void}
	*/
	function defineEventAttribute(eventTargetPrototype, eventName) {
		Object.defineProperty(eventTargetPrototype, `on${eventName}`, defineEventAttributeDescriptor(eventName));
	}
	/**
	* Define a custom EventTarget with event attributes.
	* @param {string[]} eventNames Event names for event attributes.
	* @returns {EventTarget} The custom EventTarget.
	* @private
	*/
	function defineCustomEventTarget(eventNames) {
		/** CustomEventTarget */
		function CustomEventTarget() {
			EventTarget.call(this);
		}
		CustomEventTarget.prototype = Object.create(EventTarget.prototype, { constructor: {
			value: CustomEventTarget,
			configurable: true,
			writable: true
		} });
		for (let i = 0; i < eventNames.length; ++i) defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
		return CustomEventTarget;
	}
	/**
	* EventTarget.
	*
	* - This is constructor if no arguments.
	* - This is a function which returns a CustomEventTarget constructor if there are arguments.
	*
	* For example:
	*
	*     class A extends EventTarget {}
	*     class B extends EventTarget("message") {}
	*     class C extends EventTarget("message", "error") {}
	*     class D extends EventTarget(["message", "error"]) {}
	*/
	function EventTarget() {
		if (this instanceof EventTarget) {
			listenersMap.set(this, /* @__PURE__ */ new Map());
			return;
		}
		if (arguments.length === 1 && Array.isArray(arguments[0])) return defineCustomEventTarget(arguments[0]);
		if (arguments.length > 0) {
			const types = new Array(arguments.length);
			for (let i = 0; i < arguments.length; ++i) types[i] = arguments[i];
			return defineCustomEventTarget(types);
		}
		throw new TypeError("Cannot call a class as a function");
	}
	EventTarget.prototype = {
		/**
		* Add a given listener to this event target.
		* @param {string} eventName The event name to add.
		* @param {Function} listener The listener to add.
		* @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
		* @returns {void}
		*/
		addEventListener(eventName, listener, options) {
			if (listener == null) return;
			if (typeof listener !== "function" && !isObject(listener)) throw new TypeError("'listener' should be a function or an object.");
			const listeners = getListeners(this);
			const optionsIsObj = isObject(options);
			const listenerType = (optionsIsObj ? Boolean(options.capture) : Boolean(options)) ? CAPTURE : BUBBLE;
			const newNode = {
				listener,
				listenerType,
				passive: optionsIsObj && Boolean(options.passive),
				once: optionsIsObj && Boolean(options.once),
				next: null
			};
			let node = listeners.get(eventName);
			if (node === void 0) {
				listeners.set(eventName, newNode);
				return;
			}
			let prev = null;
			while (node != null) {
				if (node.listener === listener && node.listenerType === listenerType) return;
				prev = node;
				node = node.next;
			}
			prev.next = newNode;
		},
		/**
		* Remove a given listener from this event target.
		* @param {string} eventName The event name to remove.
		* @param {Function} listener The listener to remove.
		* @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
		* @returns {void}
		*/
		removeEventListener(eventName, listener, options) {
			if (listener == null) return;
			const listeners = getListeners(this);
			const listenerType = (isObject(options) ? Boolean(options.capture) : Boolean(options)) ? CAPTURE : BUBBLE;
			let prev = null;
			let node = listeners.get(eventName);
			while (node != null) {
				if (node.listener === listener && node.listenerType === listenerType) {
					if (prev !== null) prev.next = node.next;
					else if (node.next !== null) listeners.set(eventName, node.next);
					else listeners.delete(eventName);
					return;
				}
				prev = node;
				node = node.next;
			}
		},
		/**
		* Dispatch a given event.
		* @param {Event|{type:string}} event The event to dispatch.
		* @returns {boolean} `false` if canceled.
		*/
		dispatchEvent(event) {
			if (event == null || typeof event.type !== "string") throw new TypeError("\"event.type\" should be a string.");
			const listeners = getListeners(this);
			const eventName = event.type;
			let node = listeners.get(eventName);
			if (node == null) return true;
			const wrappedEvent = wrapEvent(this, event);
			let prev = null;
			while (node != null) {
				if (node.once) {
					if (prev !== null) prev.next = node.next;
					else if (node.next !== null) listeners.set(eventName, node.next);
					else listeners.delete(eventName);
				} else prev = node;
				setPassiveListener(wrappedEvent, node.passive ? node.listener : null);
				if (typeof node.listener === "function") try {
					node.listener.call(this, wrappedEvent);
				} catch (err) {
					if (typeof console !== "undefined" && typeof console.error === "function") console.error(err);
				}
				else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") node.listener.handleEvent(wrappedEvent);
				if (isStopped(wrappedEvent)) break;
				node = node.next;
			}
			setPassiveListener(wrappedEvent, null);
			setEventPhase(wrappedEvent, 0);
			setCurrentTarget(wrappedEvent, null);
			return !wrappedEvent.defaultPrevented;
		}
	};
	Object.defineProperty(EventTarget.prototype, "constructor", {
		value: EventTarget,
		configurable: true,
		writable: true
	});
	if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
	exports.defineEventAttribute = defineEventAttribute;
	exports.EventTarget = EventTarget;
	exports.default = EventTarget;
	module.exports = EventTarget;
	module.exports.EventTarget = module.exports["default"] = EventTarget;
	module.exports.defineEventAttribute = defineEventAttribute;
}));
//#endregion
//#region extensions/telegram/src/group-history-window.ts
var import_abort_controller = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var eventTargetShim = require_event_target_shim();
	/**
	* The signal class.
	* @see https://dom.spec.whatwg.org/#abortsignal
	*/
	var AbortSignal = class extends eventTargetShim.EventTarget {
		/**
		* AbortSignal cannot be constructed directly.
		*/
		constructor() {
			super();
			throw new TypeError("AbortSignal cannot be constructed directly");
		}
		/**
		* Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
		*/
		get aborted() {
			const aborted = abortedFlags.get(this);
			if (typeof aborted !== "boolean") throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
			return aborted;
		}
	};
	eventTargetShim.defineEventAttribute(AbortSignal.prototype, "abort");
	/**
	* Create an AbortSignal object.
	*/
	function createAbortSignal() {
		const signal = Object.create(AbortSignal.prototype);
		eventTargetShim.EventTarget.call(signal);
		abortedFlags.set(signal, false);
		return signal;
	}
	/**
	* Abort a given signal.
	*/
	function abortSignal(signal) {
		if (abortedFlags.get(signal) !== false) return;
		abortedFlags.set(signal, true);
		signal.dispatchEvent({ type: "abort" });
	}
	/**
	* Aborted flag for each instances.
	*/
	const abortedFlags = /* @__PURE__ */ new WeakMap();
	Object.defineProperties(AbortSignal.prototype, { aborted: { enumerable: true } });
	if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
		configurable: true,
		value: "AbortSignal"
	});
	/**
	* The AbortController.
	* @see https://dom.spec.whatwg.org/#abortcontroller
	*/
	var AbortController = class {
		/**
		* Initialize this controller.
		*/
		constructor() {
			signals.set(this, createAbortSignal());
		}
		/**
		* Returns the `AbortSignal` object associated with this object.
		*/
		get signal() {
			return getSignal(this);
		}
		/**
		* Abort and signal to any observers that the associated activity is to be aborted.
		*/
		abort() {
			abortSignal(getSignal(this));
		}
	};
	/**
	* Associated signals.
	*/
	const signals = /* @__PURE__ */ new WeakMap();
	/**
	* Get the associated signal of a given controller.
	*/
	function getSignal(controller) {
		const signal = signals.get(controller);
		if (signal == null) throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
		return signal;
	}
	Object.defineProperties(AbortController.prototype, {
		signal: { enumerable: true },
		abort: { enumerable: true }
	});
	if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
		configurable: true,
		value: "AbortController"
	});
	exports.AbortController = AbortController;
	exports.AbortSignal = AbortSignal;
	exports.default = AbortController;
	module.exports = AbortController;
	module.exports.AbortController = module.exports["default"] = AbortController;
	module.exports.AbortSignal = AbortSignal;
})))();
const TELEGRAM_SELF_SENDER_SUFFIX = " (you)";
function buildTelegramSelfSenderName(configuredName, telegramIdentity) {
	return `${configuredName?.trim() || telegramIdentity?.first_name?.trim() || telegramIdentity?.username?.trim() || "OpenClaw"}${TELEGRAM_SELF_SENDER_SUFFIX}`;
}
function isTelegramSelfSenderName(name) {
	return name?.endsWith(TELEGRAM_SELF_SENDER_SUFFIX) === true;
}
function numericMessageId(value) {
	if (!value?.trim()) return;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function isTelegramHistoryEntryAfterAmbientWatermark(entry, watermark) {
	if (!watermark) return true;
	if (entry.timestamp !== void 0 && watermark.timestampMs !== void 0) {
		if (entry.timestamp !== watermark.timestampMs) return entry.timestamp > watermark.timestampMs;
		const entryMessageId = numericMessageId(entry.messageId);
		const watermarkMessageId = numericMessageId(watermark.messageId);
		return entryMessageId !== void 0 && watermarkMessageId !== void 0 && entryMessageId > watermarkMessageId;
	}
	const entryMessageId = numericMessageId(entry.messageId);
	const watermarkMessageId = numericMessageId(watermark.messageId);
	if (entryMessageId !== void 0 && watermarkMessageId !== void 0) return entryMessageId > watermarkMessageId;
	return entry.messageId !== watermark.messageId;
}
function telegramChatWindowPayload(entry) {
	return entry?.payload && typeof entry.payload === "object" && !Array.isArray(entry.payload) ? entry.payload : void 0;
}
function telegramPromptMessages(payload) {
	return Array.isArray(payload?.["messages"]) ? payload["messages"].filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message)) : [];
}
function isTelegramChatWindowPromptContext(entry) {
	return entry.source === "telegram" && entry.type === "chat_window";
}
function telegramPromptContextHistory(promptContext) {
	return promptContext.flatMap((entry) => isTelegramChatWindowPromptContext(entry) ? telegramPromptMessages(telegramChatWindowPayload(entry)).flatMap((message) => typeof message["body"] === "string" && typeof message["sender"] === "string" ? [{
		sender: message["sender"],
		body: message["body"],
		...typeof message["message_id"] === "string" ? { messageId: message["message_id"] } : {},
		...typeof message["timestamp_ms"] === "number" ? { timestamp: message["timestamp_ms"] } : {}
	}] : []) : []);
}
function selectTelegramGroupPromptContext(params) {
	return params.promptContext.flatMap((entry) => {
		if (!isTelegramChatWindowPromptContext(entry)) return [entry];
		const payload = telegramChatWindowPayload(entry);
		const sourceMessages = telegramPromptMessages(payload);
		const recentMessages = params.historyLimit > 0 ? sourceMessages.filter((message) => isTelegramHistoryEntryAfterAmbientWatermark({
			messageId: typeof message["message_id"] === "string" ? message["message_id"] : void 0,
			timestamp: typeof message["timestamp_ms"] === "number" ? message["timestamp_ms"] : void 0
		}, params.ambientWatermark)).slice(-params.historyLimit) : [];
		const lastSelfIndex = params.includeBeforeSelf ? -1 : recentMessages.findLastIndex((message) => typeof message["sender"] === "string" && isTelegramSelfSenderName(message["sender"]));
		const selected = new Set(recentMessages.slice(lastSelfIndex + 1));
		const messages = sourceMessages.filter((message) => message["is_reply_target"] === true || selected.has(message));
		if (messages.length === 0) return [];
		if (messages.length === sourceMessages.length) return [entry];
		const { sessionTranscriptDedupeMessageIds: _projectionIds, sessionTranscriptAssistantTextDedupeKeys: _assistantTextKeys, ...selectedEntry } = entry;
		return [{
			...selectedEntry,
			payload: {
				...payload,
				messages
			}
		}];
	});
}
//#endregion
//#region extensions/telegram/src/message-cache-codec.ts
function retainedMessageId(messageId) {
	const id = parseSafeMessageId(messageId);
	return id !== void 0 && id <= 9999999999 ? String(id).padStart(10, "0") : void 0;
}
function isGroupMessage(msg) {
	return msg.chat?.type === "group" || msg.chat?.type === "supergroup";
}
function resolveReplyMessage(msg) {
	if (msg.reply_to_message) return msg.reply_to_message;
	const externalReply = msg.external_reply;
	return externalReply?.chat && externalReply.chat.id === msg.chat?.id ? externalReply : void 0;
}
function isTelegramMessageFromCurrentBot(msg, botUserId) {
	const currentBotUserId = parseStrictPositiveInteger(botUserId);
	if (currentBotUserId === void 0) return msg.from?.is_bot === true;
	return msg.from?.id === currentBotUserId || msg.sender_business_bot?.id === currentBotUserId;
}
function resolveMessageBody(msg, preserveWhitespace) {
	const text = getTelegramTextParts(msg).text;
	if (text.trim()) return preserveWhitespace ? text : text.trim();
	const location = extractTelegramLocation(msg);
	if (location) return formatLocationText(location);
	return resolveTelegramRichMessageBody(msg);
}
function resolveMessageTimestamp(msg) {
	const promptContextTimestamp = msg.openclaw_prompt_context_timestamp_ms;
	return typeof promptContextTimestamp === "number" && Number.isFinite(promptContextTimestamp) ? promptContextTimestamp : msg.date ? msg.date * 1e3 : void 0;
}
function normalizeMessageNode(msg, params) {
	const media = resolveTelegramPrimaryMedia(msg);
	const fileId = media?.fileRef.file_id;
	const forwardedFrom = normalizeForwardedContext(msg);
	const replyMessage = resolveReplyMessage(msg);
	const body = resolveMessageBody(msg, params.promptContextProjectionMarker !== void 0);
	const threadBinding = normalizeTelegramMessageThreadBinding(params.threadBinding);
	const threadId = threadBinding?.threadSpec.scope === "none" ? void 0 : parseTelegramMessageThreadId(threadBinding?.threadSpec.id ?? params.threadId);
	const timestamp = resolveMessageTimestamp(msg);
	return {
		sourceMessage: msg,
		messageId: String(msg.message_id),
		sender: buildSenderName(msg) ?? "unknown sender",
		...msg.from?.id != null ? { senderId: String(msg.from.id) } : {},
		...msg.from?.username ? { senderUsername: msg.from.username } : {},
		...timestamp !== void 0 ? { timestamp } : {},
		...body ? { body } : {},
		...media ? { mediaType: media.kind } : {},
		...fileId ? { mediaRef: `telegram:file/${fileId}` } : {},
		...replyMessage?.message_id != null ? { replyToId: String(replyMessage.message_id) } : {},
		...forwardedFrom?.from ? { forwardedFrom: forwardedFrom.from } : {},
		...forwardedFrom?.fromId ? { forwardedFromId: forwardedFrom.fromId } : {},
		...forwardedFrom?.fromUsername ? { forwardedFromUsername: forwardedFrom.fromUsername } : {},
		...forwardedFrom?.date ? { forwardedDate: forwardedFrom.date * 1e3 } : {},
		...threadId !== void 0 ? { threadId: String(threadId) } : {},
		...params.promptContextProjectionMarker ? { promptContextProjectionMarker: params.promptContextProjectionMarker } : {},
		...params.resolvedMedia ? { resolvedMedia: params.resolvedMedia } : {},
		...threadBinding ? { threadBinding } : {},
		...params.historyEligible === true ? { historyEligible: true } : {}
	};
}
function normalizeTelegramMessageThreadBinding(value) {
	if (!isRecord(value) || value.kind !== "provider-observed-v1") return;
	const threadSpec = value.threadSpec;
	if (!isRecord(threadSpec)) return;
	if (threadSpec.scope === "none" && threadSpec.id === void 0) return {
		kind: "provider-observed-v1",
		threadSpec: { scope: "none" }
	};
	const id = parseTelegramMessageThreadId(threadSpec.id);
	if (id === void 0 || threadSpec.scope !== "direct-messages" && threadSpec.scope !== "dm" && threadSpec.scope !== "forum") return;
	return {
		kind: "provider-observed-v1",
		threadSpec: {
			scope: threadSpec.scope,
			id
		}
	};
}
function createTelegramMessageThreadBinding(threadSpec) {
	return normalizeTelegramMessageThreadBinding({
		kind: "provider-observed-v1",
		threadSpec
	});
}
function hasProviderObservedTelegramThreadBinding(node, threadId) {
	const normalizedThreadId = parseTelegramMessageThreadId(threadId);
	return normalizedThreadId !== void 0 && resolveProviderObservedTelegramThreadSpec(node)?.id === normalizedThreadId;
}
function resolveProviderObservedTelegramThreadSpec(node) {
	const threadSpec = normalizeTelegramMessageThreadBinding(node?.threadBinding)?.threadSpec;
	return threadSpec?.scope === "none" ? void 0 : threadSpec;
}
function normalizeMessageNodes(msg, params) {
	const observations = [];
	const visited = /* @__PURE__ */ new Set();
	const visit = (message, options, mode) => {
		const embeddedThreadId = parseTelegramMessageThreadId(message.message_thread_id);
		const inheritedThread = parseTelegramMessageThreadId(options.threadId);
		const observedBinding = normalizeTelegramMessageThreadBinding(options.threadBinding);
		const threadId = mode === "authoritative" ? observedBinding?.threadSpec.scope === "none" ? void 0 : observedBinding?.threadSpec.id ?? inheritedThread ?? embeddedThreadId : embeddedThreadId ?? inheritedThread;
		const node = normalizeMessageNode(message, {
			...options,
			threadId,
			threadBinding: observedBinding?.threadSpec.id === threadId ? observedBinding : void 0
		});
		if (visited.has(node.messageId)) return;
		visited.add(node.messageId);
		const replyMessage = message.reply_to_message;
		if (replyMessage?.message_id != null) visit(replyMessage, {
			threadId: node.threadBinding?.threadSpec.scope === "none" ? void 0 : parseTelegramMessageThreadId(node.threadId) ?? options.threadId,
			threadBinding: node.threadBinding
		}, "partial");
		observations.push({
			node,
			mode
		});
	};
	visit(msg, params, "authoritative");
	return observations;
}
function parseSafeMessageId(value) {
	return value === void 0 ? void 0 : parseStrictPositiveInteger(value);
}
function parsePersistedCacheValue(key, value) {
	if (!isRecord(value) || value.version !== void 0 && value.version !== 1) return [];
	const separatorIndex = key.lastIndexOf(":");
	if (separatorIndex === -1 || !isTelegramMessageCacheSourceMessage(value.sourceMessage)) return [];
	const threadId = parseTelegramMessageThreadId(value.threadId);
	const botUserId = parseStrictPositiveInteger(value.botUserId);
	const promptContextProjectionMarker = value.version === 1 && isTelegramMessageFromCurrentBot(value.sourceMessage, botUserId) ? parseTelegramPromptContextProjection(value.promptContextProjection) : void 0;
	const threadBinding = value.version === 1 ? normalizeTelegramMessageThreadBinding(value.threadBinding) : void 0;
	const resolvedMedia = parseTelegramResolvedMedia(value.resolvedMedia);
	return normalizeMessageNodes(value.sourceMessage, {
		...threadId !== void 0 ? { threadId } : {},
		...promptContextProjectionMarker ? { promptContextProjectionMarker } : {},
		...threadBinding ? { threadBinding } : {},
		...resolvedMedia ? { resolvedMedia } : {},
		...value.version === 1 && value.historyEligible === true ? { historyEligible: true } : {}
	}).map(({ node, mode }) => ({
		key: `${key.slice(0, separatorIndex + 1)}${node.messageId}`,
		node,
		mode
	}));
}
function mergeTelegramSourceMessage(existing, incoming) {
	const existingReply = existing.reply_to_message;
	const incomingReply = incoming.reply_to_message;
	if (!incomingReply || existingReply && existingReply.message_id !== incomingReply.message_id) return existing;
	const reply = existingReply ? mergeTelegramSourceMessage(existingReply, incomingReply) : incomingReply;
	return reply === existingReply ? existing : {
		...existing,
		reply_to_message: reply
	};
}
function mergeCachedMessageNode(existing, incoming, mode) {
	const preferExisting = mode === "partial" || existing.sourceMessage.edit_date !== void 0 && existing.sourceMessage.edit_date > (incoming.sourceMessage.edit_date ?? incoming.sourceMessage.date);
	const mergedSourceMessage = preferExisting ? mergeTelegramSourceMessage(existing.sourceMessage, incoming.sourceMessage) : mergeTelegramSourceMessage(incoming.sourceMessage, existing.sourceMessage);
	const syntheticOutboundFrom = existing.senderId === "0" && incoming.sourceMessage.sender_chat ? existing.sourceMessage.from : void 0;
	const sourceMessage = syntheticOutboundFrom ? {
		...mergedSourceMessage,
		from: syntheticOutboundFrom
	} : mergedSourceMessage;
	const preferred = preferExisting ? existing : incoming;
	const other = preferExisting ? incoming : existing;
	const promptContextProjectionMarker = preferred.promptContextProjectionMarker ?? other.promptContextProjectionMarker;
	const threadBinding = normalizeTelegramMessageThreadBinding(preferred.threadBinding) ?? normalizeTelegramMessageThreadBinding(other.threadBinding);
	const threadId = threadBinding?.threadSpec.scope === "none" ? void 0 : parseTelegramMessageThreadId(threadBinding?.threadSpec.id ?? preferred.threadId ?? other.threadId);
	const primaryMediaId = resolveTelegramPrimaryMedia(sourceMessage)?.fileRef.file_unique_id;
	const resolvedMedia = preferred.resolvedMedia?.fileUniqueId === primaryMediaId ? preferred.resolvedMedia : other.resolvedMedia?.fileUniqueId === primaryMediaId ? other.resolvedMedia : void 0;
	return normalizeMessageNode(sourceMessage, {
		...threadId !== void 0 ? { threadId } : {},
		...promptContextProjectionMarker ? { promptContextProjectionMarker } : {},
		...threadBinding ? { threadBinding } : {},
		...resolvedMedia ? { resolvedMedia } : {},
		...existing.historyEligible || incoming.historyEligible ? { historyEligible: true } : {}
	});
}
function persistedCacheNode(node, botUserId) {
	const marker = node.promptContextProjectionMarker;
	const promptContextProjection = marker?.kind === "valid" ? marker.projection : marker ? { transcriptMessageId: marker.transcriptMessageId } : void 0;
	return {
		version: 1,
		sourceMessage: node.sourceMessage,
		...botUserId !== void 0 ? { botUserId } : {},
		...promptContextProjection ? { promptContextProjection } : {},
		...node.resolvedMedia ? { resolvedMedia: node.resolvedMedia } : {},
		...node.threadBinding ? { threadBinding: node.threadBinding } : {},
		...node.threadId ? { threadId: node.threadId } : {},
		...node.historyEligible ? { historyEligible: true } : {}
	};
}
function parseRetainedCacheNode(key, value) {
	const node = parsePersistedCacheValue(key, value).at(-1)?.node;
	if (!node || !isGroupMessage(node.sourceMessage)) return null;
	const id = retainedMessageId(node.messageId);
	return id && key.endsWith(`:${node.sourceMessage.chat.id}:${id}`) ? node : null;
}
function compareCachedMessageNodes(left, right) {
	const leftId = parseSafeMessageId(left.messageId);
	const rightId = parseSafeMessageId(right.messageId);
	if (leftId !== void 0 && rightId !== void 0) return leftId - rightId;
	return (left.messageId ?? "").localeCompare(right.messageId ?? "");
}
//#endregion
//#region extensions/telegram/src/message-cache.ts
const DEFAULT_MAX_MESSAGES = 5e3;
const PERSISTENT_BUCKET_KEY = `plugin-state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`;
const TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY = Symbol.for("openclaw.telegram.messageCacheBuckets");
function getPersistedMessageCacheBuckets() {
	const globalRecord = globalThis;
	const existing = globalRecord[TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY];
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	globalRecord[TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY] = created;
	return created;
}
const RETAINED_MESSAGE_PAGE_SIZE = 256;
const RETAINED_PROMOTION_BATCH_SIZE = 1e4;
function telegramMessageCacheKey(params) {
	const key = `${params.accountId}:${params.chatId}:${params.messageId}`;
	return params.scopeKey ? `${params.scopeKey}:${key}` : key;
}
function telegramMessageCacheKeyPrefix(params) {
	const prefix = `${params.accountId}:${params.chatId}:`;
	return params.scopeKey ? `${params.scopeKey}:${prefix}` : prefix;
}
function trimMessages(messages, maxMessages) {
	while (messages.size > maxMessages) {
		const oldest = messages.keys().next().value;
		if (oldest === void 0) break;
		messages.delete(oldest);
	}
}
function upsertCachedMessageNode(params) {
	const existing = params.messages.get(params.key);
	const node = existing ? mergeCachedMessageNode(existing, params.node, params.mode) : params.node;
	params.messages.delete(params.key);
	params.messages.set(params.key, node);
	return node;
}
function resolveDefaultPersistentStore() {
	const runtime = getOptionalTelegramRuntime();
	if (!runtime) return;
	try {
		return runtime.state.openKeyedStore({
			namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
			maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES
		});
	} catch (error) {
		logVerbose(`telegram: failed to open message cache plugin state: ${String(error)}`);
		return;
	}
}
function resolveMessageCacheBucket(params) {
	const { bucketKey } = params;
	if (!bucketKey) return {
		messages: /* @__PURE__ */ new Map(),
		hydrated: true
	};
	const persistedMessageCacheBuckets = getPersistedMessageCacheBuckets();
	const existing = persistedMessageCacheBuckets.get(bucketKey);
	if (existing) {
		existing.persistentStore = params.persistentStore ?? existing.persistentStore;
		return existing;
	}
	const bucket = {
		messages: /* @__PURE__ */ new Map(),
		hydrated: false,
		...params.persistentStore ? { persistentStore: params.persistentStore } : {}
	};
	persistedMessageCacheBuckets.set(bucketKey, bucket);
	return bucket;
}
async function hydrateMessageCacheBucket(bucket, maxMessages, scopeKey, excludeGroups = false) {
	if (bucket.hydrated) return;
	if (bucket.hydratePromise) {
		await bucket.hydratePromise;
		return;
	}
	bucket.hydratePromise = (async () => {
		let storeEntries = [];
		try {
			storeEntries = await bucket.persistentStore?.entries() ?? [];
		} catch (error) {
			logVerbose(`telegram: failed to hydrate message cache from plugin state: ${String(error)}`);
		}
		const scopedStoreEntries = scopeKey ? storeEntries.filter(({ key }) => key.startsWith(`${scopeKey}:`)) : storeEntries;
		for (const { key, value } of scopedStoreEntries) {
			if (excludeGroups && isRecord(value) && isTelegramMessageCacheSourceMessage(value.sourceMessage) && isGroupMessage(value.sourceMessage)) {
				bucket.chatRetention?.set(key.slice(0, key.lastIndexOf(":") + 1), "retained");
				continue;
			}
			for (const entry of parsePersistedCacheValue(key, value)) {
				bucket.chatRetention?.set(entry.key.slice(0, entry.key.lastIndexOf(":") + 1), "bounded");
				upsertCachedMessageNode({
					messages: bucket.messages,
					key: entry.key,
					node: entry.node,
					mode: entry.mode
				});
				trimMessages(bucket.messages, maxMessages);
			}
		}
		bucket.hydrated = true;
	})().finally(() => {
		bucket.hydratePromise = void 0;
	});
	await bucket.hydratePromise;
}
async function mergeRetainedCacheNode(params) {
	let observation = await params.store.observe(params.key);
	let sawExisting = observation.value !== void 0;
	for (;;) {
		const existing = parseRetainedCacheNode(params.key, observation.value);
		if (params.mode === "partial" && sawExisting && !existing) return null;
		sawExisting ||= existing !== null;
		const node = existing ? mergeCachedMessageNode(existing, params.node, params.mode) : params.node;
		const result = await params.store.compareAndApply(params.key, observation.comparison, {
			operation: "update",
			action: "set",
			value: persistedCacheNode(node, params.botUserId ?? observation.value?.botUserId)
		});
		if (result.status !== "conflict") return node;
		observation = result.current;
	}
}
async function persistCachedNode(params) {
	const { persistentStore } = params.bucket;
	if (!persistentStore) return;
	try {
		if (params.beforeWrite) await params.beforeWrite();
		await persistentStore.register(params.key, persistedCacheNode(params.node, params.botUserId));
	} catch (error) {
		logVerbose(`telegram: failed to persist message cache: ${String(error)}`);
		const marker = params.node.promptContextProjectionMarker;
		if (marker) {
			params.node.promptContextProjectionMarker = {
				kind: "invalid",
				transcriptMessageId: marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId
			};
			throw error;
		}
	}
}
function createTelegramMessageCache(params) {
	const runtime = params?.persistentStore ? void 0 : getOptionalTelegramRuntime();
	const hasRetainedStore = runtime != null;
	const persistentStore = params?.persistentStore ?? resolveDefaultPersistentStore();
	const maxMessages = params?.maxMessages ?? (persistentStore ? 3e3 : DEFAULT_MAX_MESSAGES);
	const scopeKey = persistentStore || hasRetainedStore ? resolveTelegramMessageCachePersistentScopeKey(params?.scope ?? "default") : void 0;
	const bucket = resolveMessageCacheBucket({
		bucketKey: params?.bucketKey ?? (persistentStore || hasRetainedStore ? `${PERSISTENT_BUCKET_KEY}:${scopeKey}` : void 0),
		...persistentStore ? { persistentStore } : {}
	});
	const { messages } = bucket;
	let retainedStore;
	const chatRetention = bucket.chatRetention ??= /* @__PURE__ */ new Map();
	const openRetainedStore = async () => {
		if (!retainedStore) {
			const store = runtime?.state.openKeyedStore({
				namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
				retention: "retained"
			});
			if (!store?.observe || !store.compareAndApply || !store.entriesInKeyRange || !store.moveEntriesFrom) throw new Error("Telegram group history requires retained plugin-state support");
			retainedStore = {
				lookup: (key) => store.lookup(key),
				observe: store.observe,
				compareAndApply: store.compareAndApply,
				entriesInKeyRange: store.entriesInKeyRange,
				moveEntriesFrom: store.moveEntriesFrom
			};
		}
		const store = retainedStore;
		if (!bucket.promoted) {
			bucket.promotePromise ??= (async () => {
				if (!persistentStore) throw new Error("Telegram group history cannot open the previous message cache");
				const entries = [];
				for (const { key, value } of await persistentStore.entries()) {
					const node = parsePersistedCacheValue(key, value).at(-1)?.node;
					const id = node && retainedMessageId(node.messageId);
					if (!node || !id || !isGroupMessage(node.sourceMessage)) continue;
					const suffix = `:${node.sourceMessage.chat.id}:${node.messageId}`;
					if (!key.endsWith(suffix)) continue;
					entries.push({
						sourceKey: key,
						targetKey: `${key.slice(0, key.lastIndexOf(":") + 1)}${id}`
					});
				}
				for (let offset = 0; offset < entries.length; offset += RETAINED_PROMOTION_BATCH_SIZE) {
					const batch = entries.slice(offset, offset + RETAINED_PROMOTION_BATCH_SIZE);
					await store.moveEntriesFrom({
						namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
						entries: batch
					});
					for (const { sourceKey } of batch) messages.delete(sourceKey);
				}
				bucket.promoted = true;
			})().finally(() => {
				bucket.promotePromise = void 0;
			});
			await bucket.promotePromise;
		}
		return store;
	};
	const usesRetainedHistory = (accountId, chatId) => {
		if (!hasRetainedStore) return false;
		const prefix = telegramMessageCacheKeyPrefix({
			scopeKey,
			accountId,
			chatId
		});
		const retention = chatRetention.get(prefix);
		return retention === "retained" || retention === void 0 && String(chatId).startsWith("-");
	};
	const get = async ({ accountId, chatId, messageId }) => {
		if (!messageId) return null;
		await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey, hasRetainedStore);
		if (usesRetainedHistory(accountId, chatId)) {
			const id = retainedMessageId(messageId);
			if (!id) return null;
			const store = await openRetainedStore();
			const key = telegramMessageCacheKey({
				scopeKey,
				accountId,
				chatId,
				messageId: id
			});
			return parseRetainedCacheNode(key, await store.lookup(key));
		}
		const key = telegramMessageCacheKey({
			scopeKey,
			accountId,
			chatId,
			messageId
		});
		const entry = messages.get(key);
		if (!entry) return null;
		messages.delete(key);
		messages.set(key, entry);
		return entry;
	};
	const readNodes = async (options) => {
		if (!Number.isSafeInteger(options.limit) || options.limit <= 0) return [];
		const normalizedThreadId = parseTelegramMessageThreadId(options.threadId);
		if (options.threadId !== void 0 && normalizedThreadId === void 0) return [];
		const thread = normalizedThreadId === void 0 ? void 0 : String(normalizedThreadId);
		const minId = options.minId ?? 1;
		const maxId = options.maxId ?? 9999999999;
		if (minId > maxId) return [];
		const matches = (node) => options.historyOnly ? node.historyEligible === true && node.threadId === thread : thread === void 0 || node.threadId === thread;
		const prefix = telegramMessageCacheKeyPrefix({
			scopeKey,
			...options
		});
		await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey, hasRetainedStore);
		if (usesRetainedHistory(options.accountId, options.chatId)) {
			const store = await openRetainedStore();
			let keyStartInclusive = `${prefix}${String(minId).padStart(10, "0")}`;
			let keyEndExclusive = maxId >= 9999999999 ? `${prefix}~` : `${prefix}${String(maxId + 1).padStart(10, "0")}`;
			const selected = [];
			let remaining = options.scanLimit ?? Number.POSITIVE_INFINITY;
			while (selected.length < options.limit && remaining > 0) {
				const pageLimit = Math.min(RETAINED_MESSAGE_PAGE_SIZE, remaining);
				const page = await store.entriesInKeyRange({
					keyStartInclusive,
					keyEndExclusive,
					limit: pageLimit,
					order: options.order
				});
				remaining -= page.length;
				for (const { key, value } of page) {
					const node = parseRetainedCacheNode(key, value);
					if (node && matches(node)) {
						selected.push(node);
						if (selected.length === options.limit) break;
					}
				}
				if (page.length < pageLimit || selected.length === options.limit) break;
				const lastKey = page.at(-1).key;
				if (options.order === "desc") keyEndExclusive = lastKey;
				else {
					const nextId = Number(lastKey.slice(prefix.length)) + 1;
					if (!Number.isSafeInteger(nextId) || nextId > maxId) break;
					keyStartInclusive = `${prefix}${String(nextId).padStart(10, "0")}`;
				}
			}
			return selected;
		}
		const selected = Array.from(messages).filter(([key, node]) => {
			const id = parseSafeMessageId(node.messageId);
			return key.startsWith(prefix) && id !== void 0 && id >= minId && id <= maxId;
		}).map(([, node]) => node).toSorted(compareCachedMessageNodes);
		return (options.order === "asc" ? selected : selected.toReversed()).slice(0, options.scanLimit).filter(matches).slice(0, options.limit);
	};
	return {
		record: async ({ accountId, botUserId, chatId, msg, promptContextProjection, providerObservedThread, threadId, historyEligible }) => {
			const retained = hasRetainedStore && isGroupMessage(msg);
			const store = retained ? await openRetainedStore() : void 0;
			if (!retained) await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey, hasRetainedStore);
			const threadBinding = createTelegramMessageThreadBinding(providerObservedThread);
			const observations = normalizeMessageNodes(msg, {
				threadId,
				historyEligible,
				...promptContextProjection && isTelegramMessageFromCurrentBot(msg, botUserId) ? { promptContextProjectionMarker: {
					kind: "valid",
					projection: promptContextProjection
				} } : {},
				...threadBinding ? { threadBinding } : {}
			});
			const currentObservation = observations.at(-1);
			let recordedEntry = currentObservation.node;
			for (const { node, mode } of observations) {
				const { messageId } = node;
				if (store) {
					const id = retainedMessageId(messageId);
					if (!id || String(node.sourceMessage.chat?.id) !== String(chatId)) throw new Error("Telegram history requires a native message ID in the owning chat");
					const cachedNode = await mergeRetainedCacheNode({
						store,
						key: telegramMessageCacheKey({
							scopeKey,
							accountId,
							chatId,
							messageId: id
						}),
						node,
						mode,
						botUserId
					});
					if (cachedNode && messageId === currentObservation.node.messageId) recordedEntry = cachedNode;
					chatRetention.set(telegramMessageCacheKeyPrefix({
						scopeKey,
						accountId,
						chatId
					}), "retained");
				} else {
					const key = telegramMessageCacheKey({
						scopeKey,
						accountId,
						chatId,
						messageId
					});
					chatRetention.set(telegramMessageCacheKeyPrefix({
						scopeKey,
						accountId,
						chatId
					}), "bounded");
					const cachedNode = upsertCachedMessageNode({
						messages,
						key,
						node,
						mode
					});
					if (messageId === currentObservation.node.messageId) recordedEntry = cachedNode;
					trimMessages(messages, maxMessages);
					await persistCachedNode({
						bucket,
						key,
						node: cachedNode,
						botUserId,
						beforeWrite: hasRetainedStore && !bucket.promoted ? openRetainedStore : void 0
					});
				}
			}
			return recordedEntry;
		},
		recordResolvedMedia: async ({ accountId, botUserId, chatId, messageId, media }) => {
			await hydrateMessageCacheBucket(bucket, maxMessages, scopeKey, hasRetainedStore);
			const resolvedMedia = parseTelegramResolvedMedia(media);
			if (!resolvedMedia) throw new Error(`Telegram message ${messageId} has invalid resolved media`);
			const withMedia = (node) => {
				if (!node) throw new Error(`Telegram message ${messageId} was not recorded before media resolution`);
				if (resolveTelegramPrimaryMedia(node.sourceMessage)?.fileRef.file_unique_id !== resolvedMedia.fileUniqueId) throw new Error(`Telegram message ${messageId} media changed during resolution`);
				return {
					...node,
					resolvedMedia
				};
			};
			if (usesRetainedHistory(accountId, chatId)) {
				const id = retainedMessageId(messageId);
				if (!id) throw new Error("Telegram history requires a native message ID");
				const store = await openRetainedStore();
				const key = telegramMessageCacheKey({
					scopeKey,
					accountId,
					chatId,
					messageId: id
				});
				let observation = await store.observe(key);
				for (;;) {
					const node = withMedia(parseRetainedCacheNode(key, observation.value));
					const result = await store.compareAndApply(key, observation.comparison, {
						operation: "update",
						action: "set",
						value: persistedCacheNode(node, botUserId ?? observation.value?.botUserId)
					});
					if (result.status !== "conflict") return;
					observation = result.current;
				}
			}
			const key = telegramMessageCacheKey({
				scopeKey,
				accountId,
				chatId,
				messageId
			});
			const node = withMedia(messages.get(key));
			messages.delete(key);
			messages.set(key, node);
			await persistCachedNode({
				bucket,
				key,
				node,
				botUserId,
				beforeWrite: hasRetainedStore && !bucket.promoted ? openRetainedStore : void 0
			});
		},
		get,
		recentBefore: async ({ accountId, chatId, messageId, threadId, limit }) => {
			const targetId = parseSafeMessageId(messageId);
			return targetId === void 0 ? [] : (await readNodes({
				accountId,
				chatId,
				threadId,
				maxId: targetId - 1,
				limit,
				order: "desc"
			})).toReversed();
		},
		around: async ({ accountId, chatId, messageId, threadId, before, after }) => {
			const targetId = parseSafeMessageId(messageId);
			if (targetId === void 0) return [];
			const target = await get({
				accountId,
				chatId,
				messageId
			});
			const thread = parseTelegramMessageThreadId(threadId);
			if (!target || threadId !== void 0 && (thread === void 0 || target.threadId !== String(thread))) return [];
			const [preceding, following] = await Promise.all([readNodes({
				accountId,
				chatId,
				threadId,
				maxId: targetId - 1,
				limit: Math.max(0, before),
				order: "desc"
			}), readNodes({
				accountId,
				chatId,
				threadId,
				minId: targetId + 1,
				limit: Math.max(0, after),
				order: "asc"
			})]);
			return [
				...preceding.toReversed(),
				target,
				...following
			];
		},
		readHistoryWindow: async ({ accountId, chatId, threadId, before, limit }) => {
			if (!Number.isSafeInteger(limit) || limit <= 0) return [];
			const beforeId = parseSafeMessageId(before);
			if (before !== void 0 && (beforeId === void 0 || !retainedMessageId(before))) throw new Error("Telegram history cursors must be native message IDs");
			return (await readNodes({
				accountId,
				chatId,
				threadId,
				maxId: beforeId === void 0 ? void 0 : beforeId - 1,
				limit,
				scanLimit: limit,
				order: "desc",
				historyOnly: true
			})).toReversed();
		},
		readHistory: async ({ accountId, chatId, threadId, before, after, limit }) => {
			if (!Number.isSafeInteger(limit) || limit <= 0 || limit === Number.MAX_SAFE_INTEGER) return {
				messages: [],
				hasMore: false
			};
			const beforeId = parseSafeMessageId(before);
			const afterId = parseSafeMessageId(after);
			if (before !== void 0 && (beforeId === void 0 || !retainedMessageId(before)) || after !== void 0 && (afterId === void 0 || !retainedMessageId(after))) throw new Error("Telegram history cursors must be native message IDs");
			const forward = after !== void 0 && before === void 0;
			const nodes = await readNodes({
				accountId,
				chatId,
				threadId,
				minId: afterId === void 0 ? void 0 : afterId + 1,
				maxId: beforeId === void 0 ? void 0 : beforeId - 1,
				limit: limit + 1,
				order: forward ? "asc" : "desc",
				historyOnly: true
			});
			const hasMore = nodes.length > limit;
			const selected = nodes.slice(0, limit);
			return {
				messages: forward ? selected : selected.toReversed(),
				hasMore
			};
		}
	};
}
function normalizeSessionBoundaryTimestamp(timestampMs) {
	if (typeof timestampMs !== "number" || !Number.isFinite(timestampMs)) return;
	return Math.floor(timestampMs / 1e3) * 1e3;
}
function isAtOrAfterSessionBoundaryTimestamp(node, boundaryTimestampMs) {
	if (boundaryTimestampMs === void 0) return true;
	return typeof node.timestamp !== "number" || !Number.isFinite(node.timestamp) ? true : node.timestamp >= boundaryTimestampMs;
}
async function buildTelegramReplyChain(params) {
	const replyMessage = resolveReplyMessage(params.msg);
	if (!replyMessage?.message_id || String(replyMessage.chat?.id) !== String(params.chatId)) return [];
	const maxDepth = params.maxDepth ?? 4;
	const visited = /* @__PURE__ */ new Set();
	const chain = [];
	let current = await params.cache.get({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: String(replyMessage.message_id)
	});
	if (!current && params.msg.reply_to_message) current = normalizeMessageNode(params.msg.reply_to_message, { threadId: parseTelegramMessageThreadId(params.msg.reply_to_message.message_thread_id) ?? parseTelegramMessageThreadId(params.msg.message_thread_id) });
	while (current?.messageId && chain.length < maxDepth && !visited.has(current.messageId)) {
		visited.add(current.messageId);
		chain.push(current);
		const embeddedReply = current.sourceMessage.reply_to_message;
		if (!current.replyToId || chain.length >= maxDepth || visited.has(current.replyToId) || embeddedReply && String(embeddedReply.chat.id) !== String(params.chatId)) break;
		current = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId: current.replyToId
		}) ?? (embeddedReply && String(embeddedReply.message_id) === current.replyToId ? normalizeMessageNode(embeddedReply, { threadId: parseTelegramMessageThreadId(embeddedReply.message_thread_id) ?? parseTelegramMessageThreadId(current.threadId) }) : null);
	}
	return chain;
}
async function buildTelegramConversationContext(params) {
	const selected = /* @__PURE__ */ new Map();
	const replyTargetIds = /* @__PURE__ */ new Set();
	const sessionBoundaryTimestamp = normalizeSessionBoundaryTimestamp(params.minTimestampMs);
	const addNode = (node, flags) => {
		if (!node.messageId || node.messageId === params.messageId) return false;
		if (!isAtOrAfterSessionBoundaryTimestamp(node, sessionBoundaryTimestamp)) return false;
		const existing = selected.get(node.messageId);
		const isReplyTarget = existing?.isReplyTarget === true || flags?.replyTarget === true;
		selected.set(node.messageId, {
			node: existing?.node ?? node,
			isReplyTarget: isReplyTarget ? true : void 0
		});
		return true;
	};
	const addReplyTargetWindow = async (messageId) => {
		replyTargetIds.add(messageId);
		for (const node of await params.cache.around({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId,
			...params.threadId !== void 0 ? { threadId: params.threadId } : {},
			before: params.replyTargetWindowSize,
			after: params.replyTargetWindowSize
		})) addNode(node, { replyTarget: node.messageId === messageId });
	};
	const currentWindow = await params.cache.recentBefore({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId: params.messageId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {},
		limit: params.recentLimit
	});
	for (const node of currentWindow) if (addNode(node) && node.replyToId) await addReplyTargetWindow(node.replyToId);
	for (const [index, node] of params.replyChainNodes.entries()) {
		const added = addNode(node, { replyTarget: index === 0 });
		if (added && index === 0 && node.messageId) await addReplyTargetWindow(node.messageId);
		if (added && node.replyToId) replyTargetIds.add(node.replyToId);
	}
	for (const messageId of replyTargetIds) {
		const node = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId
		});
		if (node) addNode(node, { replyTarget: true });
	}
	return Array.from(selected.values()).toSorted((left, right) => compareCachedMessageNodes(left.node, right.node));
}
//#endregion
//#region extensions/telegram/src/provider-thread-proof.ts
function resolveTelegramProviderObservedThreadId(params) {
	if (params.successfulSendThread?.scope === "direct-messages") return params.message.direct_messages_topic?.topic_id;
	if (typeof params.message.message_thread_id === "number") return params.message.message_thread_id;
	return params.message.chat?.type === "supergroup" && params.successfulSendThread?.scope === "forum" && params.successfulSendThread.id === 1 ? 1 : void 0;
}
function resolveTelegramProviderObservedThreadSpec(params) {
	const providerThreadId = resolveTelegramProviderObservedThreadId(params);
	const successfulSendThread = params.successfulSendThread;
	if (providerThreadId === void 0 || successfulSendThread?.id !== providerThreadId || successfulSendThread.scope === "none") return;
	return {
		scope: successfulSendThread.scope,
		id: providerThreadId
	};
}
function assertTelegramProviderThread(params) {
	const expectedThreadId = params.successfulSendThread?.id;
	if (expectedThreadId === void 0) return;
	const providerThreadId = resolveTelegramProviderObservedThreadId(params);
	if (providerThreadId !== expectedThreadId) throw new Error(`Telegram delivered message ${params.message.message_id ?? "unknown"} to topic ${providerThreadId ?? "unknown"}; expected topic ${expectedThreadId}`);
}
//#endregion
//#region extensions/telegram/src/outbound-message-context.ts
function inferTelegramChatType(chatId) {
	return String(chatId).startsWith("-") ? "supergroup" : "private";
}
function buildOutboundCacheMessage(params) {
	const chat = params.message.chat ?? {};
	const text = params.message.text ?? params.message.caption ?? params.text;
	const rawSender = params.message.from;
	const stableSender = params.message.sender_chat ? void 0 : rawSender;
	const selfSenderName = buildTelegramSelfSenderName(params.account.name, params.account.bot ?? stableSender);
	return {
		...params.message,
		message_id: params.messageId,
		...params.promptContextTimestampMs !== void 0 ? { openclaw_prompt_context_timestamp_ms: params.promptContextTimestampMs } : {},
		date: typeof params.message.date === "number" && Number.isFinite(params.message.date) ? params.message.date : Math.floor(Date.now() / 1e3),
		chat: {
			id: chat.id ?? params.chatId,
			type: chat.type ?? inferTelegramChatType(params.chatId),
			...chat.title ? { title: chat.title } : {},
			...chat.username ? { username: chat.username } : {}
		},
		from: {
			id: params.message.sender_chat ? 0 : stableSender?.id ?? params.botUserId ?? 0,
			is_bot: true,
			first_name: selfSenderName,
			...stableSender?.username ? { username: stableSender.username } : {}
		},
		...text ? { text } : {},
		...params.messageThreadId !== void 0 ? { message_thread_id: params.messageThreadId } : {}
	};
}
async function recordOutboundMessageForPromptContext(params) {
	try {
		const providerObservedThread = resolveTelegramProviderObservedThreadSpec({
			message: params.message,
			successfulSendThread: params.successfulSendThread
		});
		const messageThreadId = providerObservedThread?.id ?? params.messageThreadId;
		const cacheMessage = buildOutboundCacheMessage({
			...params,
			...messageThreadId !== void 0 ? { messageThreadId } : {}
		});
		await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store, { agentId: params.ownerAgentId?.trim() || resolveTelegramAccountOwnerAgentId({
			cfg: params.cfg,
			accountId: params.account.accountId
		}) })) }).record({
			accountId: params.account.accountId,
			chatId: params.chatId,
			msg: cacheMessage,
			historyEligible: true,
			...params.botUserId !== void 0 ? { botUserId: params.botUserId } : {},
			...params.promptContextProjection ? { promptContextProjection: params.promptContextProjection } : {},
			...providerObservedThread ? { providerObservedThread } : {},
			...messageThreadId !== void 0 ? { threadId: messageThreadId } : {}
		});
		return true;
	} catch (error) {
		const chatType = params.message.chat?.type ?? inferTelegramChatType(params.chatId);
		if (chatType === "group" || chatType === "supergroup") throw error;
		logVerbose(`telegram: failed to record outbound message context: ${String(error)}`);
		return false;
	}
}
//#endregion
//#region extensions/telegram/src/reply-parameters.ts
const sendLogger = createSubsystemLogger("telegram/send");
const QUOTE_PARAM_RE = /\bquote not found\b|\bQUOTE_TEXT_INVALID\b|\bquote text invalid\b/i;
const GrammyErrorCtor = typeof GrammyError === "function" ? GrammyError : void 0;
function resolveTelegramSendThreadSpec(params) {
	if (params.targetDirectMessagesTopicId != null) return {
		id: params.targetDirectMessagesTopicId,
		scope: "direct-messages"
	};
	const messageThreadId = params.messageThreadId != null ? params.messageThreadId : params.targetMessageThreadId;
	if (messageThreadId == null) return;
	return {
		id: messageThreadId,
		scope: params.chatType === "direct" ? "dm" : "forum"
	};
}
function buildTelegramThreadReplyParams(opts) {
	const params = { ...buildTelegramThreadParams(opts?.thread) };
	const replyToMessageId = normalizeTelegramReplyToMessageId(opts?.replyToMessageId);
	if (replyToMessageId == null) return params;
	const defaultQuoteMessageId = opts?.useReplyIdAsQuoteSource === true ? replyToMessageId : void 0;
	const replyQuoteTextRaw = normalizeTelegramReplyToMessageId(opts?.replyQuoteMessageId ?? defaultQuoteMessageId) === replyToMessageId ? opts?.replyQuoteText : void 0;
	const replyQuoteText = replyQuoteTextRaw?.trim() ? replyQuoteTextRaw : void 0;
	if (!replyQuoteText) {
		params.reply_to_message_id = replyToMessageId;
		params.allow_sending_without_reply = true;
		return params;
	}
	const replyParameters = {
		message_id: replyToMessageId,
		quote: replyQuoteText,
		allow_sending_without_reply: true
	};
	if (typeof opts?.replyQuotePosition === "number" && Number.isFinite(opts.replyQuotePosition)) replyParameters.quote_position = Math.trunc(opts.replyQuotePosition);
	if (Array.isArray(opts?.replyQuoteEntities) && opts.replyQuoteEntities.length > 0) replyParameters.quote_entities = opts.replyQuoteEntities;
	params.reply_parameters = replyParameters;
	return params;
}
function buildTelegramSendParams(opts) {
	const params = { ...buildTelegramThreadReplyParams(opts) };
	if (opts?.silent === true) params.disable_notification = true;
	return params;
}
function getTelegramNativeQuoteReplyMessageId(params) {
	const replyParameters = params?.reply_parameters;
	if (!replyParameters || typeof replyParameters !== "object") return;
	const messageId = replyParameters.message_id;
	return asFiniteNumber(messageId);
}
function isTelegramQuoteParamError(err) {
	if (GrammyErrorCtor && err instanceof GrammyErrorCtor) return QUOTE_PARAM_RE.test(err.description);
	return QUOTE_PARAM_RE.test(formatErrorMessage(err));
}
function removeTelegramNativeQuoteParam(params) {
	if (!params) return {};
	const replyMessageId = getTelegramNativeQuoteReplyMessageId(params);
	const { reply_parameters: _ignored, ...rest } = params;
	if (replyMessageId != null) {
		rest.reply_to_message_id = replyMessageId;
		rest.allow_sending_without_reply = true;
	}
	return rest;
}
async function withTelegramNativeQuoteFallback(params) {
	try {
		return {
			result: await params.request(params.requestParams, params.label),
			acceptedParams: params.requestParams
		};
	} catch (err) {
		if (getTelegramNativeQuoteReplyMessageId(params.requestParams) == null || !isTelegramQuoteParamError(err)) throw err;
		sendLogger.warn(`telegram ${params.label} native quote rejected, retrying with legacy reply_to_message_id: ${formatErrorMessage(err)}`);
		const acceptedParams = (params.removeNativeQuoteParam ?? removeTelegramNativeQuoteParam)(params.requestParams);
		return {
			result: await params.request(acceptedParams, `${params.label}-legacy-reply`),
			acceptedParams
		};
	}
}
//#endregion
//#region extensions/telegram/src/sent-message-cache.ts
const CLEANUP_INTERVAL_MS = 36e5;
const TELEGRAM_SENT_MESSAGES_STATE_KEY = Symbol.for("openclaw.telegramSentMessagesState");
function getSentMessageState() {
	const globalStore = globalThis;
	const existing = globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY];
	if (existing) return existing;
	const state = { bucketsByScope: /* @__PURE__ */ new Map() };
	globalStore[TELEGRAM_SENT_MESSAGES_STATE_KEY] = state;
	return state;
}
function createSentMessageStore() {
	return /* @__PURE__ */ new Map();
}
function openSentMessageStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES
	});
}
function cleanupExpired(store, scopeKey, entry, now) {
	for (const [id, timestamp] of entry) if (now - timestamp >= 864e5) entry.delete(id);
	if (entry.size === 0) store.delete(scopeKey);
}
function cleanupExpiredSentMessages(store, now) {
	for (const [scopeKey, entry] of store) cleanupExpired(store, scopeKey, entry, now);
}
async function readPersistedSentMessages(scopeKey) {
	const now = Date.now();
	const store = createSentMessageStore();
	try {
		for (const entry of await openSentMessageStore().entries()) {
			if (entry.value.scopeKey !== scopeKey || now - entry.value.timestamp > 864e5) continue;
			let messages = store.get(entry.value.chatId);
			if (!messages) {
				messages = /* @__PURE__ */ new Map();
				store.set(entry.value.chatId, messages);
			}
			messages.set(entry.value.messageId, entry.value.timestamp);
		}
	} catch (error) {
		logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
	}
	return store;
}
function getSentMessageBucket(scopeKey) {
	const state = getSentMessageState();
	const existing = state.bucketsByScope.get(scopeKey);
	if (existing) return existing;
	const bucket = readPersistedSentMessages(scopeKey).then((store) => ({
		store,
		nextCleanupAt: Date.now() + CLEANUP_INTERVAL_MS
	}));
	state.bucketsByScope.set(scopeKey, bucket);
	return bucket;
}
async function persistSentMessage(scopeKey, chatId, messageId, timestamp) {
	try {
		await openSentMessageStore().register(sentMessageEntryKey(scopeKey, chatId, messageId), {
			scopeKey,
			chatId,
			messageId,
			timestamp
		}, { ttlMs: TTL_MS });
	} catch (error) {
		logVerbose(`telegram: failed to persist sent-message cache: ${String(error)}`);
	}
}
async function recordSentMessage(chatId, messageId, cfg, owner) {
	const scopeKey = String(chatId);
	const idKey = String(messageId);
	const now = Date.now();
	const cacheScopeKey = resolveSentMessageScopeKey(cfg, owner);
	const bucketTask = getSentMessageBucket(cacheScopeKey);
	const persistence = persistSentMessage(cacheScopeKey, scopeKey, idKey, now);
	const bucket = await bucketTask;
	const { store } = bucket;
	let entry = store.get(scopeKey);
	if (!entry) {
		entry = /* @__PURE__ */ new Map();
		store.set(scopeKey, entry);
	}
	entry.set(idKey, now);
	if (now >= bucket.nextCleanupAt) {
		cleanupExpiredSentMessages(store, now);
		bucket.nextCleanupAt = now + CLEANUP_INTERVAL_MS;
	}
	await persistence;
}
async function wasSentByBot(chatId, messageId, cfg, owner) {
	const scopeKey = String(chatId);
	const idKey = String(messageId);
	const { store } = await getSentMessageBucket(resolveSentMessageScopeKey(cfg, owner));
	const entry = store.get(scopeKey);
	if (!entry) return false;
	cleanupExpired(store, scopeKey, entry, Date.now());
	return entry.has(idKey);
}
//#endregion
//#region extensions/telegram/src/send-outbound.ts
function buildTelegramProviderDeliveryResult(params) {
	const messageId = String(params.messageId);
	const chatId = String(params.message.chat?.id ?? params.fallbackChatId);
	const providerThreadId = resolveTelegramProviderObservedThreadId({
		message: params.message,
		successfulSendThread: params.successfulSendThread
	});
	return {
		messageId,
		chatId,
		...providerThreadId !== void 0 ? { receipt: createMessageReceiptFromOutboundResults({
			results: [{
				messageId,
				chatId
			}],
			...params.kind !== void 0 ? { kind: params.kind } : {},
			threadId: String(providerThreadId)
		}) } : {},
		...params.meta ? { meta: params.meta } : {}
	};
}
async function reportTelegramProviderDelivery(params) {
	const delivery = buildTelegramProviderDeliveryResult(params);
	params.onPrepared?.(delivery);
	await params.onDeliveryResult?.(delivery);
	try {
		assertTelegramProviderThread({
			message: params.message,
			successfulSendThread: params.successfulSendThread
		});
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: [delivery.messageId],
			...delivery.receipt ? { receipt: delivery.receipt } : {},
			visibleReplySent: true
		});
	}
	return delivery;
}
async function prepareTelegramOutbound(params) {
	const { cfg, account, api } = params.context;
	const rawTarget = String(params.to);
	const target = parseTelegramTarget(rawTarget);
	const chatId = await resolveAndPersistChatId({
		cfg,
		api,
		lookupTarget: target.chatId,
		persistTarget: rawTarget,
		verbose: params.opts.verbose,
		gatewayClientScopes: params.opts.gatewayClientScopes
	});
	const threadSpec = params.thread ? resolveTelegramSendThreadSpec({
		targetMessageThreadId: target.messageThreadId,
		targetDirectMessagesTopicId: params.thread.directMessagesTopicId ?? target.directMessagesTopicId,
		messageThreadId: params.thread.messageThreadId,
		chatType: target.chatType
	}) : void 0;
	const threadParams = buildTelegramThreadReplyParams({
		thread: threadSpec,
		replyToMessageId: params.thread?.replyToMessageId,
		replyQuoteText: params.thread?.replyQuoteText,
		useReplyIdAsQuoteSource: params.thread?.useReplyIdAsQuoteSource
	});
	const requestWithDiag = params.request.kind === "nonIdempotent" ? createTelegramNonIdempotentRequestWithDiag({
		cfg,
		account,
		retry: params.opts.retry,
		verbose: params.opts.verbose,
		useApiErrorLogging: params.request.useApiErrorLogging
	}) : createTelegramRequestWithDiag({
		cfg,
		account,
		retry: params.opts.retry,
		verbose: params.opts.verbose,
		shouldRetry: params.request.shouldRetry
	});
	const request = params.request.kind === "nonIdempotent" ? createRequestWithChatNotFound({
		requestWithDiag,
		chatId,
		input: rawTarget
	}) : requestWithDiag;
	return {
		chatId,
		...params.messageIdInput !== void 0 ? { messageId: normalizeMessageId(params.messageIdInput) } : {},
		threadSpec,
		threadParams,
		request
	};
}
async function finalizeTelegramOutbound(params) {
	const { cfg, account, ownerAgentId } = params.context;
	const messageId = resolveTelegramMessageIdOrThrow(params.result, params.resultContext);
	await recordSentMessage(params.prepared.chatId, messageId, cfg, {
		accountId: account.accountId,
		agentId: ownerAgentId
	});
	const resultIds = await reportTelegramProviderDelivery({
		message: params.result,
		messageId,
		fallbackChatId: params.prepared.chatId,
		successfulSendThread: params.prepared.threadSpec,
		onDeliveryResult: params.onDeliveryResult
	});
	const projection = params.promptContextProjectionPlan?.cursor.take(params.promptContextProjectionPlan.finalPart);
	try {
		const recorded = await recordOutboundMessageForPromptContext({
			cfg,
			ownerAgentId,
			account,
			botUserId: params.botUserId,
			chatId: params.prepared.chatId,
			message: params.result,
			messageId,
			text: params.text,
			messageThreadId: params.messageThreadId ?? params.prepared.threadSpec?.id,
			successfulSendThread: params.prepared.threadSpec,
			promptContextProjection: projection
		});
		if (projection && !recorded) params.promptContextProjectionPlan?.cursor.invalidate();
	} catch (error) {
		params.promptContextProjectionPlan?.cursor.invalidate();
		throw createChannelPartialDeliveryError(error, {
			messageIds: [resultIds.messageId],
			...resultIds.receipt ? { receipt: resultIds.receipt } : {},
			visibleReplySent: true
		});
	}
	params.beforeActivity?.(resultIds);
	recordChannelActivity({
		channel: "telegram",
		accountId: account.accountId,
		direction: "outbound"
	});
	return resultIds;
}
//#endregion
//#region extensions/telegram/src/status-reaction-variants.ts
const TELEGRAM_GENERIC_REACTION_FALLBACKS = [
	"👍",
	"👀",
	"🔥"
];
const TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST = [
	"❤",
	"👍",
	"👎",
	"🔥",
	"🥰",
	"👏",
	"😁",
	"🤔",
	"🤯",
	"😱",
	"🤬",
	"😢",
	"🎉",
	"🤩",
	"🤮",
	"💩",
	"🙏",
	"👌",
	"🕊",
	"🤡",
	"🥱",
	"🥴",
	"😍",
	"🐳",
	"❤‍🔥",
	"🌚",
	"🌭",
	"💯",
	"🤣",
	"⚡",
	"🍌",
	"🏆",
	"💔",
	"🤨",
	"😐",
	"🍓",
	"🍾",
	"💋",
	"🖕",
	"😈",
	"😴",
	"😭",
	"🤓",
	"👻",
	"👨‍💻",
	"👀",
	"🎃",
	"🙈",
	"😇",
	"😨",
	"🤝",
	"✍",
	"🤗",
	"🫡",
	"🎅",
	"🎄",
	"☃",
	"💅",
	"🤪",
	"🗿",
	"🆒",
	"💘",
	"🙉",
	"🦄",
	"😘",
	"💊",
	"🙊",
	"😎",
	"👾",
	"🤷‍♂",
	"🤷",
	"🤷‍♀",
	"😡"
];
const TELEGRAM_SUPPORTED_REACTION_EMOJIS = new Map(TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST.map((emoji) => [emoji, emoji]));
const TELEGRAM_STATUS_REACTION_VARIANTS = {
	queued: [
		"👀",
		"👍",
		"🔥"
	],
	thinking: [
		"🤔",
		"🤓",
		"👀"
	],
	tool: [
		"🔥",
		"⚡",
		"👍"
	],
	coding: [
		"👨‍💻",
		"🔥",
		"⚡"
	],
	web: [
		"⚡",
		"🔥",
		"👍"
	],
	deploy: [
		"🔥",
		"⚡",
		"👍"
	],
	build: [
		"🔥",
		"👨‍💻",
		"⚡"
	],
	concierge: [
		"👀",
		"🔥",
		"⚡"
	],
	done: [
		"👍",
		"🎉",
		"💯"
	],
	error: [
		"😱",
		"😨",
		"🤯"
	],
	stallSoft: [
		"🥱",
		"😴",
		"🤔"
	],
	stallHard: [
		"😨",
		"😱",
		"⚡"
	],
	compacting: [
		"✍",
		"🤔",
		"🤯"
	]
};
const STATUS_REACTION_EMOJI_KEYS = [
	"queued",
	"thinking",
	"tool",
	"coding",
	"web",
	"deploy",
	"build",
	"concierge",
	"done",
	"error",
	"stallSoft",
	"stallHard",
	"compacting"
];
function toUniqueNonEmpty(values) {
	return uniqueStrings(normalizeStringEntries(values));
}
function resolveTelegramStatusReactionEmojis(params) {
	const { overrides } = params;
	const queuedFallback = normalizeOptionalString(params.initialEmoji) ?? DEFAULT_EMOJIS.queued;
	return {
		queued: normalizeOptionalString(overrides?.queued) ?? queuedFallback,
		thinking: normalizeOptionalString(overrides?.thinking) ?? DEFAULT_EMOJIS.thinking,
		tool: normalizeOptionalString(overrides?.tool) ?? DEFAULT_EMOJIS.tool,
		coding: normalizeOptionalString(overrides?.coding) ?? DEFAULT_EMOJIS.coding,
		web: normalizeOptionalString(overrides?.web) ?? DEFAULT_EMOJIS.web,
		deploy: normalizeOptionalString(overrides?.deploy) ?? DEFAULT_EMOJIS.deploy,
		build: normalizeOptionalString(overrides?.build) ?? DEFAULT_EMOJIS.build,
		concierge: normalizeOptionalString(overrides?.concierge) ?? DEFAULT_EMOJIS.concierge,
		done: normalizeOptionalString(overrides?.done) ?? DEFAULT_EMOJIS.done,
		error: normalizeOptionalString(overrides?.error) ?? DEFAULT_EMOJIS.error,
		stallSoft: normalizeOptionalString(overrides?.stallSoft) ?? DEFAULT_EMOJIS.stallSoft,
		stallHard: normalizeOptionalString(overrides?.stallHard) ?? DEFAULT_EMOJIS.stallHard,
		compacting: normalizeOptionalString(overrides?.compacting) ?? DEFAULT_EMOJIS.compacting
	};
}
function buildTelegramStatusReactionVariants(emojis) {
	const variantsByRequested = /* @__PURE__ */ new Map();
	for (const key of STATUS_REACTION_EMOJI_KEYS) {
		const requested = normalizeOptionalString(emojis[key]);
		if (!requested) continue;
		const candidates = toUniqueNonEmpty([requested, ...TELEGRAM_STATUS_REACTION_VARIANTS[key] ?? []]);
		variantsByRequested.set(requested, candidates);
	}
	return variantsByRequested;
}
function resolveTelegramReactionEmoji(emoji) {
	return TELEGRAM_SUPPORTED_REACTION_EMOJIS.get(emoji.trim().replace(/[\uFE0E\uFE0F]/gu, ""));
}
function extractTelegramAllowedReactions(chat) {
	if (!chat) return;
	const availableReactions = chat.available_reactions;
	if (availableReactions === void 0) return;
	if (availableReactions == null) return null;
	if (!Array.isArray(availableReactions)) return [];
	const allowed = [];
	const identifiers = /* @__PURE__ */ new Set();
	for (const reaction of availableReactions) {
		if (reaction.type === "custom_emoji") {
			const identifier = normalizeOptionalString(reaction.custom_emoji_id);
			if (identifier && !identifiers.has(`custom:${identifier}`)) {
				identifiers.add(`custom:${identifier}`);
				allowed.push({
					type: "custom_emoji",
					custom_emoji_id: identifier
				});
			}
			continue;
		}
		if (reaction.type !== "emoji") continue;
		const emoji = resolveTelegramReactionEmoji(reaction.emoji);
		if (emoji && !identifiers.has(`emoji:${emoji}`)) {
			identifiers.add(`emoji:${emoji}`);
			allowed.push({
				type: "emoji",
				emoji
			});
		}
	}
	return allowed;
}
async function resolveTelegramAllowedReactions(params) {
	const fromMessage = extractTelegramAllowedReactions(params.chat);
	if (fromMessage !== void 0) return fromMessage;
	if (params.getChat) {
		const fromLookup = extractTelegramAllowedReactions(await params.getChat(params.chatId));
		if (fromLookup !== void 0) return fromLookup;
	}
	return null;
}
function resolveTelegramReactionVariant(params) {
	const requestedEmoji = normalizeOptionalString(params.requestedEmoji);
	if (!requestedEmoji) return;
	const variants = toUniqueNonEmpty([...params.variantsByRequestedEmoji.get(requestedEmoji) ?? [requestedEmoji], ...TELEGRAM_GENERIC_REACTION_FALLBACKS]);
	for (const candidate of variants) {
		const emoji = resolveTelegramReactionEmoji(candidate);
		if (!emoji) continue;
		if (params.allowedEmojiReactions == null || params.allowedEmojiReactions.has(emoji)) return emoji;
	}
}
//#endregion
//#region extensions/telegram/src/send-actions.ts
async function getTelegramAllowedReactions(chatId, opts) {
	return withTelegramApiContext(opts, (context) => resolveTelegramAllowedReactions({
		chat: void 0,
		chatId,
		getChat: (targetChatId) => context.api.getChat(targetChatId)
	}));
}
async function sendTypingTelegram(to, opts) {
	opts.signal?.throwIfAborted();
	opts.assertPlatformSendAuthorized?.();
	const target = parseTelegramTarget(to);
	if (target.directMessagesTopicId != null) throw new Error("Telegram typing is not supported in channel Direct Messages chats.");
	const apiAbort = opts.signal ? new import_abort_controller.AbortController() : void 0;
	const abort = () => apiAbort?.abort();
	if (opts.signal?.aborted) abort();
	else opts.signal?.addEventListener("abort", abort, { once: true });
	try {
		return await withTelegramApiContext(opts, async (context) => {
			const { cfg, account, api } = context;
			const chatId = await resolveAndPersistChatId({
				cfg,
				api,
				lookupTarget: target.chatId,
				persistTarget: to,
				verbose: opts.verbose
			});
			const requestWithDiag = createTelegramRequestWithDiag({
				cfg,
				account,
				retry: opts.retry,
				verbose: opts.verbose,
				shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "action" })
			});
			const threadParams = buildTypingThreadParams(target.messageThreadId ?? opts.messageThreadId);
			const signalArgs = apiAbort ? [apiAbort.signal] : [];
			await requestWithDiag(() => api.sendChatAction(chatId, "typing", threadParams, ...signalArgs), "typing");
			return { ok: true };
		});
	} finally {
		opts.signal?.removeEventListener("abort", abort);
	}
}
async function reactMessageTelegram(chatIdInput, messageIdInput, emoji, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const { chatId, messageId, request } = await prepareTelegramOutbound({
			to: chatIdInput,
			context,
			opts,
			messageIdInput,
			request: {
				kind: "standard",
				shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "react" })
			}
		});
		const remove = opts.remove === true;
		const trimmedEmoji = emoji.trim();
		const reactionEmoji = resolveTelegramReactionEmoji(trimmedEmoji) ?? trimmedEmoji;
		const reactions = remove || !trimmedEmoji ? [] : /^\d+$/.test(trimmedEmoji) ? [{
			type: "custom_emoji",
			custom_emoji_id: trimmedEmoji
		}] : [{
			type: "emoji",
			emoji: reactionEmoji
		}];
		if (typeof api.setMessageReaction !== "function") throw new Error("Telegram reactions are unavailable in this bot API.");
		try {
			await request(() => api.setMessageReaction(chatId, messageId, reactions), "reaction");
		} catch (err) {
			const msg = formatErrorMessage(err);
			if (/REACTION_INVALID/i.test(msg)) return {
				ok: false,
				warning: `Reaction unavailable: ${trimmedEmoji}`
			};
			throw err;
		}
		return { ok: true };
	});
}
async function deleteMessageTelegram(chatIdInput, messageIdInput, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const { chatId, messageId, request } = await prepareTelegramOutbound({
			to: chatIdInput,
			context,
			opts,
			messageIdInput,
			request: {
				kind: "standard",
				shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "delete" })
			}
		});
		try {
			await request(() => api.deleteMessage(chatId, messageId), "deleteMessage", { shouldLog: (err) => !isTelegramMessageDeleteNoopError(err) });
		} catch (err) {
			if (!isTelegramMessageDeleteNoopError(err)) throw err;
			const detail = formatErrorMessage(err);
			logVerbose(`[telegram] Delete skipped for message ${messageId} in chat ${chatId}: ${detail}`);
			return {
				ok: false,
				warning: `Message ${messageId} was not deleted: ${detail}`
			};
		}
		logVerbose(`[telegram] Deleted message ${messageId} from chat ${chatId}`);
		return { ok: true };
	});
}
async function pinMessageTelegram(chatIdInput, messageIdInput, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const { chatId, messageId, request } = await prepareTelegramOutbound({
			to: chatIdInput,
			context,
			opts,
			messageIdInput,
			request: { kind: "standard" }
		});
		await request(() => api.pinChatMessage(chatId, messageId, { disable_notification: opts.notify !== true }), "pinChatMessage");
		logVerbose(`[telegram] Pinned message ${messageId} in chat ${chatId}`);
		return {
			ok: true,
			messageId: String(messageId),
			chatId
		};
	});
}
async function unpinMessageTelegram(chatIdInput, messageIdInput, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const { chatId, messageId, request } = await prepareTelegramOutbound({
			to: chatIdInput,
			context,
			opts,
			...messageIdInput !== void 0 ? { messageIdInput } : {},
			request: { kind: "standard" }
		});
		await request(() => api.unpinChatMessage(chatId, messageId), "unpinChatMessage");
		logVerbose(`[telegram] Unpinned ${messageId != null ? `message ${messageId}` : "active message"} in chat ${chatId}`);
		return {
			ok: true,
			chatId,
			...messageId != null ? { messageId: String(messageId) } : {}
		};
	});
}
//#endregion
//#region extensions/telegram/src/send-forum-topics.ts
async function editForumTopicTelegram(chatIdInput, messageThreadIdInput, opts) {
	const nameProvided = opts.name !== void 0;
	const trimmedName = opts.name?.trim();
	if (nameProvided && !trimmedName) throw new Error("Telegram forum topic name is required");
	if (trimmedName && Array.from(trimmedName).length > 128) throw new Error("Telegram forum topic name must be 128 characters or fewer");
	const iconProvided = opts.iconCustomEmojiId !== void 0;
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	if (iconProvided && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic icon custom emoji ID is required");
	if (!trimmedName && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic update requires a name or iconCustomEmojiId");
	return withTelegramApiContext(opts, async (context) => {
		const { cfg, account, api } = context;
		const rawTarget = String(chatIdInput);
		const chatId = await resolveAndPersistChatId({
			cfg,
			api,
			lookupTarget: parseTelegramTarget(rawTarget).chatId,
			persistTarget: rawTarget,
			verbose: opts.verbose,
			gatewayClientScopes: opts.gatewayClientScopes
		});
		const messageThreadId = normalizeMessageId(messageThreadIdInput);
		const requestWithDiag = createTelegramRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		});
		const payload = {
			...trimmedName ? { name: trimmedName } : {},
			...trimmedIconCustomEmojiId ? { icon_custom_emoji_id: trimmedIconCustomEmojiId } : {}
		};
		await requestWithDiag(() => api.editForumTopic(chatId, messageThreadId, payload), "editForumTopic");
		logVerbose(`[telegram] Edited forum topic ${messageThreadId} in chat ${chatId}`);
		return {
			ok: true,
			chatId,
			messageThreadId,
			...trimmedName ? { name: trimmedName } : {},
			...trimmedIconCustomEmojiId ? { iconCustomEmojiId: trimmedIconCustomEmojiId } : {}
		};
	});
}
async function renameForumTopicTelegram(chatIdInput, messageThreadIdInput, name, opts) {
	const result = await editForumTopicTelegram(chatIdInput, messageThreadIdInput, {
		...opts,
		name
	});
	return {
		ok: true,
		chatId: result.chatId,
		messageThreadId: result.messageThreadId,
		name: result.name ?? name.trim()
	};
}
/**
* Create a forum topic in a Telegram supergroup.
* Requires the bot to have `can_manage_topics` permission.
*
* @param chatId - Supergroup chat ID
* @param name - Topic name (1-128 characters)
* @param opts - Optional configuration
*/
async function createForumTopicTelegram(chatId, name, opts) {
	const assertPlatformSendAuthorized = opts.assertPlatformSendAuthorized;
	if (!name?.trim()) throw new Error("Forum topic name is required");
	const trimmedName = name.trim();
	if (Array.from(trimmedName).length > 128) throw new Error("Forum topic name must be 128 characters or fewer");
	return withTelegramApiContext({
		...opts,
		assertPlatformSendAuthorized
	}, async (context) => {
		const { cfg, account, api } = context;
		const normalizedChatId = await resolveAndPersistChatId({
			cfg,
			api,
			lookupTarget: parseTelegramTarget(chatId).chatId,
			persistTarget: chatId,
			verbose: opts.verbose,
			gatewayClientScopes: opts.gatewayClientScopes
		});
		const requestWithDiag = createTelegramNonIdempotentRequestWithDiag({
			cfg,
			account,
			retry: opts.retry,
			verbose: opts.verbose
		});
		const extra = {};
		if (opts.iconColor != null) extra.icon_color = opts.iconColor;
		if (opts.iconCustomEmojiId?.trim()) extra.icon_custom_emoji_id = opts.iconCustomEmojiId.trim();
		const hasExtra = Object.keys(extra).length > 0;
		const result = await requestWithDiag(() => {
			assertPlatformSendAuthorized?.();
			return api.createForumTopic(normalizedChatId, trimmedName, hasExtra ? extra : void 0);
		}, "createForumTopic");
		const topicId = result.message_thread_id;
		recordChannelActivity({
			channel: "telegram",
			accountId: account.accountId,
			direction: "outbound"
		});
		return {
			topicId,
			name: result.name ?? trimmedName,
			chatId: normalizedChatId
		};
	});
}
//#endregion
//#region extensions/telegram/src/telegram-text-delivery.ts
function plainPage(text) {
	return {
		plainText: text,
		sourceText: text,
		sourceTextMode: "markdown"
	};
}
function fallbackPage(text) {
	return {
		plainText: text,
		sourceText: escapeTelegramHtml(text),
		sourceTextMode: "html"
	};
}
function planTelegramTextDeliveryPages(params) {
	const maxChars = Math.max(1, Math.floor(params.maxChars));
	if (params.richMessages && params.textMode !== "html" && params.textMode !== "plain") {
		if (params.richMessage) {
			const skipEntityDetection = params.richMessage.skip_entity_detection === true;
			const pages = splitTelegramRichBlocks(params.richMessage.blocks, { textLimit: maxChars }).map((blocks, index) => {
				const plan = buildTelegramRichBlocksPlan(blocks, { skipEntityDetection });
				const degradationReasons = index === 0 ? params.degradationReasons : void 0;
				return {
					plainText: plan.plainText,
					sourceText: plan.plainText,
					sourceTextMode: "markdown",
					richMessage: plan.richMessage,
					degradationReasons
				};
			});
			if (pages.length === 0 && params.text.trim()) return [{
				plainText: params.text,
				sourceText: params.text,
				sourceTextMode: "markdown",
				richMessage: {
					blocks: [{
						type: "paragraph",
						text: params.text
					}],
					...skipEntityDetection ? { skip_entity_detection: true } : {}
				},
				...params.degradationReasons?.length ? { degradationReasons: params.degradationReasons } : {}
			}];
			return pages;
		}
		const richPlan = buildTelegramRichMarkdownPlan(params.text, {
			tableMode: params.tableMode,
			skipEntityDetection: params.skipEntityDetection
		});
		if (richPlan.richMessage.blocks.length === 0 && params.text.trim()) return [plainPage(params.text)];
		return splitTelegramRichMessageTextChunks({
			plan: richPlan,
			textLimit: maxChars
		}).map((chunk) => ({
			plainText: chunk.plainText,
			sourceText: chunk.plainText,
			sourceTextMode: "markdown",
			richMessage: chunk.richMessage,
			degradationReasons: chunk.degradationReasons
		}));
	}
	if (params.textMode === "plain") return splitTelegramPlainTextChunks(params.text, maxChars).map((text, index) => index === 0 ? text.trimEnd() : text.trim()).filter(Boolean).map(plainPage);
	if (params.textMode === "html") {
		const plainText = telegramHtmlToPlainTextFallback(params.text);
		try {
			const normalizedHtml = params.text.replace(/<br\s*\/?>/giu, "\n");
			const chunks = splitTelegramHtmlChunks(normalizedHtml, maxChars);
			return chunks.map((htmlText) => ({
				htmlText,
				plainText: chunks.length === 1 ? plainText : telegramHtmlToPlainTextFallback(htmlText),
				sourceText: htmlText,
				sourceTextMode: "html",
				fullSourceText: normalizedHtml
			}));
		} catch (error) {
			params.warn?.(`telegram HTML chunk planning failed; sending plain text: ${String(error)}`);
			return splitTelegramPlainTextChunks(plainText, maxChars).map(plainPage);
		}
	}
	const markdownParts = params.chunkMode === "newline" ? chunkByParagraph(params.text, maxChars, { splitLongParagraphs: false }) : [params.text];
	const pages = [];
	for (const markdown of markdownParts) {
		const chunks = markdownToTelegramChunks(markdown, maxChars, { tableMode: params.tableMode });
		if (!chunks.length && markdown) {
			const htmlText = wrapFileReferencesInHtml(markdownToTelegramHtml(markdown, {
				tableMode: params.tableMode,
				wrapFileRefs: false
			}));
			pages.push({
				htmlText,
				plainText: markdown,
				sourceText: htmlText,
				sourceTextMode: "html"
			});
			continue;
		}
		pages.push(...chunks.map((chunk) => ({
			htmlText: chunk.html,
			plainText: telegramHtmlToPlainTextFallback(chunk.html),
			sourceText: chunk.html,
			sourceTextMode: "html"
		})));
	}
	return pages;
}
async function* sendTelegramTextPageParts(params) {
	const { page } = params;
	if (!page.richMessage && !page.htmlText) {
		yield {
			result: await params.sender.sendPlain(page.plainText),
			page
		};
		return;
	}
	if (page.richMessage) warnTelegramRichBlocksDegradations({
		context: params.context,
		reasons: page.degradationReasons ?? [],
		warn: params.warn
	});
	const delivery = await withTelegramPlainFallback({
		kind: page.richMessage ? "rich" : "html",
		context: params.context,
		plainText: page.plainText,
		warn: params.warn,
		...page.richMessage ? { limit: params.fallbackLimit } : {},
		sendFormatted: async () => ({ result: page.richMessage ? await params.sender.sendRich(page.richMessage) : await params.sender.sendHtml(page.htmlText) }),
		sendPlain: async (plan, label) => ({
			chunks: page.richMessage ? plan.chunks : [plan.plainText],
			label
		})
	});
	if ("result" in delivery) {
		yield {
			result: delivery.result,
			page
		};
		return;
	}
	for (const [index, text] of delivery.chunks.entries()) yield {
		result: await params.sender.sendPlain(text, page.richMessage ? {
			index,
			count: delivery.chunks.length
		} : void 0, delivery.label),
		page: fallbackPage(text)
	};
}
async function deliverTelegramTextPage(params) {
	const delivered = [];
	for await (const part of sendTelegramTextPageParts(params)) delivered.push(part);
	return delivered;
}
//#endregion
//#region extensions/telegram/src/send-edit.ts
async function editMessageReplyMarkupTelegram(chatIdInput, messageIdInput, buttons, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const { chatId, messageId, request } = await prepareTelegramOutbound({
			to: chatIdInput,
			context,
			opts,
			messageIdInput,
			request: { kind: "standard" }
		});
		const replyMarkup = buildInlineKeyboard(buttons) ?? { inline_keyboard: [] };
		try {
			await request(() => api.editMessageReplyMarkup(chatId, messageId, { reply_markup: replyMarkup }), "editMessageReplyMarkup", { shouldLog: (err) => !isTelegramMessageNotModifiedError(err) });
		} catch (err) {
			if (!isTelegramMessageNotModifiedError(err)) throw err;
		}
		logVerbose(`[telegram] Edited reply markup for message ${messageId} in chat ${chatId}`);
		return {
			ok: true,
			messageId: String(messageId),
			chatId
		};
	});
}
async function editMessageTelegram(chatIdInput, messageIdInput, text, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const { cfg, account, api } = context;
		const { chatId, messageId, request } = await prepareTelegramOutbound({
			to: chatIdInput,
			context,
			opts,
			messageIdInput,
			request: {
				kind: "standard",
				shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "edit" }) || isTelegramServerError(err)
			}
		});
		const requestWithEditShouldLog = (fn, label, shouldLog) => request(fn, label, shouldLog ? { shouldLog } : void 0);
		const textMode = opts.textMode ?? "markdown";
		const linkPreviewEnabled = opts.linkPreview ?? account.config.linkPreview ?? true;
		const useRichMessages = account.config.richMessages === true && textMode !== "html";
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "telegram",
			accountId: account.accountId,
			supportsBlockTables: useRichMessages
		});
		const htmlText = renderTelegramHtmlText(text, {
			textMode,
			tableMode
		});
		const plainText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : text;
		const shouldTouchButtons = opts.buttons !== void 0;
		const builtKeyboard = shouldTouchButtons ? buildInlineKeyboard(opts.buttons) : void 0;
		const replyMarkup = shouldTouchButtons ? builtKeyboard ?? { inline_keyboard: [] } : void 0;
		const commonTextParams = {
			...linkPreviewEnabled ? {} : { link_preview_options: { is_disabled: true } },
			...replyMarkup === void 0 ? {} : { reply_markup: replyMarkup }
		};
		const captionEditParams = {
			caption: htmlText,
			parse_mode: "HTML"
		};
		if (replyMarkup !== void 0) captionEditParams.reply_markup = replyMarkup;
		const plainCaptionParams = { caption: plainText };
		if (replyMarkup !== void 0) plainCaptionParams.reply_markup = replyMarkup;
		const performTextEdit = async () => {
			const richPlan = useRichMessages ? opts.richMessage ? buildTelegramRichBlocksPlan(opts.richMessage.blocks, { skipEntityDetection: opts.richMessage.skip_entity_detection === true }) : buildTelegramRichMarkdownPlan(text, {
				tableMode,
				skipEntityDetection: !linkPreviewEnabled
			}) : void 0;
			const page = richPlan?.richMessage.blocks.length ? {
				...richPlan,
				sourceText: richPlan.plainText,
				sourceTextMode: "markdown"
			} : planTelegramTextDeliveryPages({
				text: textMode === "html" ? htmlText : text,
				maxChars: Number.MAX_SAFE_INTEGER,
				tableMode,
				richMessages: useRichMessages,
				skipEntityDetection: !linkPreviewEnabled,
				...textMode === "html" ? { textMode: "html" } : {}
			})[0];
			if (!page) throw new Error("telegram editMessage failed: empty text");
			const edit = (fn, label = "editMessage") => requestWithEditShouldLog(fn, label, (err) => !isTelegramMessageNotModifiedError(err));
			const [accepted] = await deliverTelegramTextPage({
				page,
				context: "editMessage",
				warn: (message) => sendLogger$1.warn(message),
				fallbackLimit: Number.MAX_SAFE_INTEGER,
				sender: {
					sendPlain: (value, _fallback, label) => edit(() => Object.keys(commonTextParams).length ? api.editMessageText(chatId, messageId, value, commonTextParams) : api.editMessageText(chatId, messageId, value), label),
					sendHtml: (value) => edit(() => api.editMessageText(chatId, messageId, value, {
						parse_mode: "HTML",
						...commonTextParams
					})),
					sendRich: (richMessage) => edit(() => api.raw.editMessageText({
						chat_id: chatId,
						message_id: messageId,
						rich_message: richMessage,
						...commonTextParams
					}))
				}
			});
			return accepted.result;
		};
		const performCaptionEdit = () => withTelegramPlainFallback({
			kind: "html",
			context: "editMessageCaption",
			plainText,
			warn: (message) => sendLogger$1.warn(message),
			sendFormatted: () => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, captionEditParams), "editMessageCaption", (err) => !isTelegramMessageNotModifiedError(err)),
			sendPlain: (_plan, label) => requestWithEditShouldLog(() => api.editMessageCaption(chatId, messageId, plainCaptionParams), label, (plainErr) => !isTelegramMessageNotModifiedError(plainErr))
		});
		let editedMessage;
		try {
			const editMode = opts.editMode ?? "text";
			if (editMode === "caption") editedMessage = await performCaptionEdit();
			else try {
				editedMessage = await performTextEdit();
			} catch (err) {
				if (editMode === "auto" && isTelegramMessageHasNoTextError(err)) editedMessage = await performCaptionEdit();
				else throw err;
			}
		} catch (err) {
			if (isTelegramMessageNotModifiedError(err)) {} else throw err;
		}
		if (editedMessage && editedMessage !== true && typeof editedMessage.message_id === "number") {
			const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
			const successfulSendThread = resolveTelegramMessageThreadSpec(editedMessage);
			await recordOutboundMessageForPromptContext({
				cfg,
				account,
				chatId,
				message: editedMessage,
				messageId: editedMessage.message_id,
				successfulSendThread,
				...botUserId !== void 0 ? { botUserId } : {},
				...editedMessage.message_thread_id !== void 0 ? { messageThreadId: editedMessage.message_thread_id } : {}
			});
		}
		logVerbose(`[telegram] Edited message ${messageId} in chat ${chatId}`);
		return {
			ok: true,
			messageId: String(messageId),
			chatId
		};
	});
}
//#endregion
//#region extensions/telegram/src/send-location.ts
/** Send a standalone location pin or named venue through Telegram's native payload. */
async function sendLocationTelegram(to, input, opts) {
	return withTelegramApiContext(opts, async (context) => {
		const location = normalizeOutboundLocation(input);
		if (!location) throw new Error("Telegram location is required.");
		const hasName = Boolean(location.name);
		if (hasName !== Boolean(location.address)) throw new Error("Telegram venues require both location.name and location.address.");
		const { account, api } = context;
		const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
		const prepared = await prepareTelegramOutbound({
			to,
			context,
			opts,
			thread: {
				messageThreadId: opts.messageThreadId,
				replyToMessageId: opts.replyToMessageId,
				replyQuoteText: opts.quoteText,
				useReplyIdAsQuoteSource: true
			},
			request: { kind: "nonIdempotent" }
		});
		const replyMarkup = buildInlineKeyboard(opts.buttons);
		const commonParams = {
			...prepared.threadParams,
			...replyMarkup ? { reply_markup: replyMarkup } : {},
			...opts.silent === true ? { disable_notification: true } : {}
		};
		const label = hasName ? "venue" : "location";
		const delivery = await withTelegramNativeQuoteFallback({
			label,
			requestParams: commonParams,
			request: async (effectiveParams, retryLabel) => {
				await opts.onPlatformSendDispatch?.();
				return await prepared.request(() => {
					opts.assertPlatformSendAuthorized?.();
					return hasName ? api.sendVenue(prepared.chatId, location.latitude, location.longitude, location.name ?? "", location.address ?? "", effectiveParams) : api.sendLocation(prepared.chatId, location.latitude, location.longitude, {
						...effectiveParams,
						...location.accuracy !== void 0 ? { horizontal_accuracy: location.accuracy } : {}
					});
				}, retryLabel);
			}
		});
		const result = delivery.result;
		const acceptedParams = toAcceptedThreadScopedParams(delivery.acceptedParams);
		return finalizeTelegramOutbound({
			context,
			prepared,
			result,
			resultContext: `${label} send`,
			...botUserId !== void 0 ? { botUserId } : {},
			text: formatLocationText(location),
			...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {},
			promptContextProjectionPlan: opts.promptContextProjectionPlan,
			onDeliveryResult: opts.onDeliveryResult,
			beforeActivity: ({ messageId, chatId }) => logTelegramOutboundSendOk({
				accountId: account.accountId,
				chatId,
				messageId,
				operation: hasName ? "sendVenue" : "sendLocation",
				deliveryKind: label,
				messageThreadId: acceptedParams?.message_thread_id,
				replyToMessageId: opts.replyToMessageId,
				silent: opts.silent
			})
		});
	});
}
//#endregion
//#region extensions/telegram/src/outbound-media-batches.ts
const TELEGRAM_MEDIA_GROUP_LIMIT = 10;
async function* planTelegramMediaBatches(params) {
	let photos;
	for (const [index, mediaUrl] of params.mediaUrls.entries()) {
		let item;
		try {
			item = await params.prepare(mediaUrl, index);
		} catch (error) {
			if (photos) yield photos;
			throw error;
		}
		if (!params.canGroup(item, index)) {
			if (photos) {
				yield photos;
				photos = void 0;
			}
			yield [item];
			continue;
		}
		if (photos) photos.push(item);
		else photos = [item];
		if (photos.length === TELEGRAM_MEDIA_GROUP_LIMIT) {
			yield photos;
			photos = void 0;
		}
	}
	if (photos) yield photos;
}
//#endregion
//#region extensions/telegram/src/send-error-predicates.ts
const TELEGRAM_CAPTION_TOO_LONG_RE = /caption is too long/i;
const TELEGRAM_PHOTO_LIMIT_ERROR_RE = /\b(?:PHOTO_INVALID_DIMENSIONS|PHOTO_TOO_BIG)\b/i;
const TELEGRAM_VOICE_FORBIDDEN_MARKER = "VOICE_MESSAGES_FORBIDDEN";
function resolveTelegramErrorDescription(error) {
	return isRecord(error) && typeof error.description === "string" ? error.description : formatErrorMessage(error);
}
function isTelegramCaptionTooLongError(error) {
	return TELEGRAM_CAPTION_TOO_LONG_RE.test(resolveTelegramErrorDescription(error));
}
function isTelegramPhotoLimitError(error) {
	return TELEGRAM_PHOTO_LIMIT_ERROR_RE.test(resolveTelegramErrorDescription(error));
}
function isTelegramVoiceMessagesForbiddenError(error) {
	return resolveTelegramErrorDescription(error).includes(TELEGRAM_VOICE_FORBIDDEN_MARKER);
}
//#endregion
//#region extensions/telegram/src/voice.ts
function resolveTelegramVoiceDecision(opts) {
	if (!opts.wantsVoice) return { useVoice: false };
	if (isVoiceMessageCompatibleAudio(opts)) return { useVoice: true };
	return {
		useVoice: false,
		reason: `media is ${opts.contentType ?? "unknown"} (${opts.fileName ?? "unknown"})`
	};
}
function resolveTelegramVoiceSend(opts) {
	const decision = resolveTelegramVoiceDecision(opts);
	if (decision.reason && opts.logFallback) opts.logFallback(`Telegram voice requested but ${decision.reason}; sending as audio file instead.`);
	return { useVoice: decision.useVoice };
}
//#endregion
//#region extensions/telegram/src/outbound-media.ts
function resolveTelegramOutboundMediaFilename(params) {
	if (params.fileName) return params.fileName;
	if (params.isGif) return "animation.gif";
	const basename = params.kind === "image" || params.kind === "video" || params.kind === "audio" ? params.kind : "file";
	const defaultExtension = params.kind === "image" ? ".jpg" : params.kind === "video" ? ".mp4" : params.kind === "audio" ? ".ogg" : ".bin";
	return `${basename}${extensionForMime(params.contentType) ?? defaultExtension}`;
}
function prepareTelegramOutboundMedia(params) {
	const kind = kindFromMime(params.media.contentType ?? void 0);
	const isGif = isGifMedia({
		contentType: params.media.contentType,
		fileName: params.media.fileName
	});
	const deliveryKind = params.forceDocument === true && (kind === "image" || kind === "video") ? "document" : kind;
	if (params.asVideoNote === true && deliveryKind !== "video") throw new Error("Telegram video notes require video media.");
	const isVideoNote = deliveryKind === "video" && params.asVideoNote === true;
	const fileName = resolveTelegramOutboundMediaFilename({
		fileName: params.media.fileName,
		contentType: params.media.contentType,
		kind,
		isGif
	});
	const text = params.text;
	const trimmedText = text?.trim();
	const renderedCaption = !isVideoNote && trimmedText ? params.preparedHtml === true && params.textMode === "html" ? trimmedText : renderTelegramHtmlText(trimmedText, {
		textMode: params.textMode ?? "markdown",
		tableMode: params.tableMode
	}) : void 0;
	const { caption, followUpText } = isVideoNote ? {
		caption: void 0,
		followUpText: trimmedText ? text : void 0
	} : splitTelegramCaption(text, renderedCaption);
	const htmlCaption = caption ? renderedCaption : void 0;
	return {
		kind,
		deliveryKind,
		isGif,
		isVideoNote,
		fileName,
		file: new InputFile(params.media.buffer, fileName),
		caption,
		htmlCaption,
		plainCaption: resolveTelegramPlainCaption(caption && params.textMode === "html" ? telegramHtmlToPlainTextFallback(caption) : caption, htmlCaption),
		followUpText
	};
}
function resolveTelegramOutboundMediaSenders(params) {
	const createSender = (label) => {
		const operation = `send${label.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
		const method = params.api[operation];
		return {
			label,
			operation,
			send: (effectiveParams) => method.call(params.api, params.chatId, params.plan.file, label === "document" && params.forceDocument ? {
				...effectiveParams,
				disable_content_type_detection: true
			} : effectiveParams)
		};
	};
	const documentSender = createSender("document");
	let label = "document";
	if (params.plan.isGif && params.plan.deliveryKind !== "document") label = "animation";
	else if (params.plan.deliveryKind === "image" && !params.plan.isGif && params.sendImageAsPhoto !== false) label = "photo";
	else if (params.plan.deliveryKind === "video") label = params.plan.isVideoNote ? "video_note" : "video";
	else if (params.plan.kind === "audio") {
		const { useVoice } = resolveTelegramVoiceSend({
			wantsVoice: params.asVoice === true,
			contentType: params.media.contentType,
			fileName: params.plan.fileName,
			logFallback: logVerbose
		});
		label = useVoice ? "voice" : "audio";
	}
	return {
		sender: label === "document" ? documentSender : createSender(label),
		documentSender
	};
}
async function sendTelegramCaptionedMediaWithFallback(params) {
	const requestCaption = typeof params.requestParams.caption === "string" ? params.requestParams.caption : void 0;
	const sendCaptionless = async () => {
		const captionlessParams = { ...params.requestParams };
		delete captionlessParams.caption;
		delete captionlessParams.parse_mode;
		return {
			result: await params.send(captionlessParams, params.shouldLog),
			...requestCaption !== void 0 ? { captionRemoved: true } : {}
		};
	};
	try {
		return {
			result: await params.send(params.requestParams, (err) => !isTelegramHtmlParseError(err) && !isTelegramEmptyContentError(err) && (params.shouldLog?.(err) ?? true)),
			...requestCaption !== void 0 ? { deliveredCaption: params.plainCaption ?? requestCaption } : {}
		};
	} catch (err) {
		if (isTelegramEmptyContentError(err) && requestCaption !== void 0) return await sendCaptionless();
		if (!isTelegramHtmlParseError(err) || !params.plainCaption) throw err;
		logVerbose(`telegram ${params.operation} caption HTML rejected; retrying as plain caption: ${formatErrorMessage(err)}`);
		const plainParams = {
			...params.requestParams,
			caption: params.plainCaption
		};
		delete plainParams.parse_mode;
		try {
			return {
				result: await params.send(plainParams, (plainError) => !isTelegramEmptyContentError(plainError) && (params.shouldLog?.(plainError) ?? true)),
				deliveredCaption: params.plainCaption
			};
		} catch (plainError) {
			if (!isTelegramEmptyContentError(plainError)) throw plainError;
			return await sendCaptionless();
		}
	}
}
async function sendTelegramOutboundMediaWithPhotoFallback(params) {
	try {
		return {
			result: await params.send(params.sender),
			sender: params.sender
		};
	} catch (error) {
		if (params.sender.label !== "photo" || !isTelegramPhotoLimitError(error)) throw error;
		logVerbose(`telegram sendPhoto exceeded photo limits; retrying as document: ${formatErrorMessage(error)}`);
		return {
			result: await params.send(params.documentSender),
			sender: params.documentSender
		};
	}
}
//#endregion
//#region extensions/telegram/src/send-message-text.ts
function buildTelegramTextSendReceipt(params) {
	if (params.results.length === 0) return;
	if (params.results.length === 1) return params.results[0]?.receipt;
	const receipt = createMessageReceiptFromOutboundResults({
		results: params.results,
		kind: "text",
		...typeof params.replyToMessageId === "number" ? { replyToId: String(params.replyToMessageId) } : {}
	});
	receipt.parts = receipt.parts.map((part, index) => ({
		...part,
		index
	}));
	return receipt;
}
function createTelegramTextSender(config) {
	const { cfg, ownerAgentId, account, api, chatId, opts, replyMarkup, reportDelivery, recordDeliveredPromptContext, singleUseReplyTo, buildThreadParams, sender, textMode, tableMode, renderHtmlText, linkPreviewOptions, useRichMessages } = config;
	const shouldIncludeReply = (index, count, alreadyUsed) => !alreadyUsed && (!singleUseReplyTo || count === 1 && index === 0);
	const buildTextParams = (index, count, finalPart, alreadyUsed) => {
		const thread = buildThreadParams(shouldIncludeReply(index, count, alreadyUsed));
		return Object.keys(thread).length || finalPart && replyMarkup ? {
			...thread,
			...finalPart && replyMarkup ? { reply_markup: replyMarkup } : {}
		} : void 0;
	};
	const createTextDelivery = (context, beforeFirstAccepted) => {
		const start = sender.parts.length;
		let acceptedReplyToMessageId;
		const deliveryResults = [];
		let pendingChunk;
		let finalMeta;
		const flushChunk = async (chunk, finalPart) => {
			let keyboardError;
			if (finalPart && replyMarkup && !chunk.hasInlineKeyboard) try {
				await api.editMessageReplyMarkup(chunk.reportChatId, chunk.messageId, { reply_markup: replyMarkup });
				finalMeta = {
					telegramDeliveredText: chunk.plainText,
					telegramHasInlineKeyboard: true
				};
			} catch (error) {
				keyboardError = error;
			}
			await recordDeliveredPromptContext({
				message: chunk.result,
				messageId: chunk.messageId,
				text: chunk.plainText,
				...chunk.acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: chunk.acceptedParams.message_thread_id } : {}
			}, finalPart);
			if (keyboardError !== void 0) {
				if (keyboardError instanceof Error) throw keyboardError;
				throw new Error(formatErrorMessage(keyboardError));
			}
		};
		const flushPending = async (finalPart) => {
			const chunk = pendingChunk;
			pendingChunk = void 0;
			if (chunk) await flushChunk(chunk, finalPart);
		};
		const record = async (params) => {
			const { messageId } = params;
			acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(params.acceptedParams);
			if (sender.parts.length === start + 1) await beforeFirstAccepted?.();
			await recordSentMessage(chatId, messageId, cfg, {
				accountId: account.accountId,
				agentId: ownerAgentId
			});
			await reportDelivery(messageId, params.result?.chat?.id ?? chatId, params.result, {
				telegramDeliveredText: params.plainText,
				telegramHasInlineKeyboard: params.hasInlineKeyboard
			}, "text", (delivery) => deliveryResults.push(delivery));
			const previousChunk = pendingChunk;
			pendingChunk = {
				result: params.result,
				messageId,
				acceptedParams: params.acceptedParams,
				plainText: params.plainText,
				reportChatId: params.result?.chat?.id ?? chatId,
				hasInlineKeyboard: params.hasInlineKeyboard
			};
			if (previousChunk) await flushChunk(previousChunk, false);
		};
		const finish = async (operation) => {
			await flushPending(true);
			const parts = sender.parts.slice(start);
			const last = parts.at(-1);
			const lastMessageId = last ? String(last.messageId) : "";
			const lastChatId = String(last?.result.chat?.id ?? chatId);
			if (lastMessageId) logTelegramOutboundSendOk({
				accountId: account.accountId,
				chatId: lastChatId,
				messageId: lastMessageId,
				operation,
				deliveryKind: "text",
				messageThreadId: toAcceptedThreadScopedParams(last?.acceptedParams)?.message_thread_id,
				replyToMessageId: opts.replyToMessageId,
				silent: opts.silent,
				chunkCount: parts.length
			});
			const receipt = buildTelegramTextSendReceipt({
				results: deliveryResults,
				replyToMessageId: acceptedReplyToMessageId
			});
			return {
				messageId: lastMessageId,
				chatId: lastChatId,
				...receipt ? { receipt } : {},
				...finalMeta ? { meta: finalMeta } : {}
			};
		};
		const partialDeliveryResult = () => {
			const receipt = buildTelegramTextSendReceipt({
				results: deliveryResults,
				replyToMessageId: acceptedReplyToMessageId
			});
			return {
				messageIds: sender.parts.slice(start).map((part) => String(part.messageId)),
				...receipt ? { receipt } : {},
				visibleReplySent: true
			};
		};
		const fail = async (error) => {
			try {
				await flushPending(false);
			} catch (flushError) {
				sendLogger$1.warn(`telegram ${context} delivery bookkeeping cleanup failed: ${formatErrorMessage(flushError)}`);
			}
			return sender.fail(error, start, partialDeliveryResult());
		};
		return {
			record,
			finish,
			fail,
			partialDeliveryResult
		};
	};
	const sendChunkedText = async (rawText, context, options = {}) => {
		const delivery = createTextDelivery(context, options.beforeFirstAccepted);
		const tracking = {
			invalidate: () => opts.promptContextProjectionPlan?.cursor.invalidate(),
			onRejected: (error) => logVerbose(`telegram ${context} text chunk rejected; continuing: ${formatErrorMessage(error)}`),
			onSilentSkip: (error) => logVerbose(`telegram ${context} text chunk rendered empty; skipping: ${formatErrorMessage(error)}`),
			partialDeliveryResult: delivery.partialDeliveryResult
		};
		const alreadyUsed = options.replyToAlreadyUsed === true;
		const maxChars = Math.min(opts.textLimit ?? Number.POSITIVE_INFINITY, resolveTelegramTextChunkLimit({
			cfg,
			accountId: account.accountId,
			...textMode === "html" ? { formatting: { parseMode: "HTML" } } : {}
		}));
		const pages = planTelegramTextDeliveryPages({
			text: textMode === "html" ? renderHtmlText(rawText) : rawText,
			maxChars,
			tableMode,
			chunkMode: opts.chunkMode ?? resolveChunkMode(cfg, "telegram", account.accountId),
			richMessages: useRichMessages,
			skipEntityDetection: account.config.linkPreview === false,
			...textMode === "html" ? { textMode: "html" } : {},
			warn: (message) => sendLogger$1.warn(message)
		});
		try {
			await sender.sendText({
				pages,
				context,
				tracking,
				drainFallback: true,
				observe: delivery.record,
				preparePage: (index) => ({ requestParams: (fallback) => ({
					...buildTextParams(fallback && pages.length === 1 ? fallback.index : index, Math.max(pages.length, fallback?.count ?? pages.length), index === pages.length - 1 && (!fallback || fallback.index === fallback.count - 1), alreadyUsed),
					...linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {},
					...opts.silent === true ? { disable_notification: true } : {}
				}) })
			});
			return await delivery.finish(useRichMessages ? "sendRichMessage" : "sendMessage");
		} catch (error) {
			if (isChannelPartialDeliveryError(error) || !isTelegramEmptyContentError(error)) opts.promptContextProjectionPlan?.cursor.invalidate();
			return await delivery.fail(error);
		}
	};
	return { sendChunkedText };
}
//#endregion
//#region extensions/telegram/src/chunk-delivery.ts
const TELEGRAM_TERMINAL_BAD_REQUEST_RE = /\b(?:chat|message thread) not found\b/i;
function mergeTelegramPartialDeliveryError(error, priorDeliveryResult) {
	if (!isChannelPartialDeliveryError(error)) return createChannelPartialDeliveryError(error, priorDeliveryResult);
	const currentDeliveryResult = error.deliveryResult;
	const messageIds = [.../* @__PURE__ */ new Set([...priorDeliveryResult.messageIds ?? [], ...currentDeliveryResult.messageIds ?? []])];
	let receipt = currentDeliveryResult.receipt ?? priorDeliveryResult.receipt;
	if (priorDeliveryResult.receipt && currentDeliveryResult.receipt) {
		receipt = createMessageReceiptFromOutboundResults({ results: [{ receipt: priorDeliveryResult.receipt }, { receipt: currentDeliveryResult.receipt }] });
		const parts = /* @__PURE__ */ new Map();
		for (const part of receipt.parts) parts.set(part.platformMessageId, {
			...parts.get(part.platformMessageId),
			...part
		});
		receipt.parts = [...parts.values()];
		for (const [index, part] of receipt.parts.entries()) part.index = index;
	}
	return createChannelPartialDeliveryError(error, {
		...priorDeliveryResult,
		...currentDeliveryResult,
		...messageIds.length > 0 ? { messageIds } : {},
		...receipt ? { receipt } : {},
		visibleReplySent: true
	});
}
async function failPromptContextSequence(sequence, error) {
	try {
		await sequence.fail();
	} catch (projectionError) {
		const failure = new AggregateError([error, projectionError], "Telegram delivery and prompt context cleanup failed");
		throw isChannelPartialDeliveryError(error) ? mergeTelegramPartialDeliveryError(failure, error.deliveryResult) : failure;
	}
	throw error;
}
function isTelegramSkippableChunkSendError(error) {
	if (isSafeToRetrySendError(error)) return true;
	return isTelegramBadRequestError(error) && !TELEGRAM_TERMINAL_BAD_REQUEST_RE.test(formatErrorMessage(error));
}
//#endregion
//#region extensions/telegram/src/send-prepared.ts
function createTelegramReplyRequest(runtime) {
	const retry = createChannelApiRetryRunner({
		shouldRetry: shouldRetryTelegramSendError,
		strictShouldRetry: true,
		retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS
	});
	return (send, operation, options) => withTelegramApiErrorLogging({
		operation,
		runtime,
		shouldLog: options?.shouldLog,
		fn: () => retry(send, operation)
	}).catch(rethrowTelegramSendError);
}
function createTelegramPreparedSender(config) {
	const parts = [];
	const fail = (error, start = 0, details) => {
		if (parts.length === start) throw error;
		throw mergeTelegramPartialDeliveryError(error, {
			...details,
			messageIds: parts.slice(start).map((part) => String(part.messageId)),
			visibleReplySent: true
		});
	};
	const recordAcceptance = (part) => {
		const accepted = {
			...part,
			messageId: resolveTelegramMessageIdOrThrow(part.result, "send"),
			hasInlineKeyboard: Boolean(part.acceptedParams.reply_markup)
		};
		parts.push(accepted);
		return accepted;
	};
	const acceptMany = async (delivered, observe, options = {}) => {
		const accepted = delivered.map(recordAcceptance);
		try {
			if (options.mediaUrls && options.mediaUrls.length === accepted.length) config.onMediaAccepted?.(options.mediaUrls);
			for (const part of accepted) await observe(part);
		} catch (error) {
			fail(error, options.start ?? 0, options.partialDeliveryResult?.());
		}
	};
	const accept = (part, observe, options) => acceptMany([part], observe, options);
	const request = (label, requestParams, send, options) => withTelegramNativeQuoteFallback({
		label,
		requestParams,
		...options?.rich ? { removeNativeQuoteParam: removeTelegramRichNativeQuoteParam } : {},
		request: (effective, operation) => config.request(() => {
			config.assertPlatformSendAuthorized?.();
			return send(effective);
		}, operation, { shouldLog: (error) => (options?.shouldLog?.(error) ?? true) && !(getTelegramNativeQuoteReplyMessageId(effective) && isTelegramQuoteParamError(error)) })
	});
	const sendText = async (params) => {
		const start = parts.length;
		let firstRejectedError;
		let firstSilentSkipError;
		const reject = (error) => {
			if (isTelegramEmptyContentError(error)) {
				firstSilentSkipError ??= error;
				params.tracking.onSilentSkip?.(error);
				return;
			}
			if (!isTelegramSkippableChunkSendError(error)) fail(error, start, params.tracking.partialDeliveryResult?.());
			firstRejectedError ??= error;
			params.tracking.invalidate();
			params.tracking.onRejected(error);
		};
		let acceptedPages = 0;
		for (const [index, page] of params.pages.entries()) {
			let prepared;
			try {
				await config.beforeTextPage?.();
				prepared = params.preparePage(index, acceptedPages);
			} catch (error) {
				reject(error);
				continue;
			}
			const sendPlainOrHtml = async (text, html, fallback, label = "sendMessage") => {
				const requestParams = {
					...prepared.requestParams(fallback),
					...html ? { parse_mode: "HTML" } : {}
				};
				const send = () => request(label, requestParams, (effective) => Object.keys(effective).length ? config.api.sendMessage(config.chatId, text, effective) : config.api.sendMessage(config.chatId, text), { shouldLog: (error) => !isTelegramHtmlParseError(error) && !isTelegramEmptyContentError(error) });
				let sent;
				try {
					sent = await send();
				} catch (error) {
					if (!fallback || !params.drainFallback) throw error;
					reject(error);
					return;
				}
				return sent;
			};
			const iterator = sendTelegramTextPageParts({
				page,
				context: params.context,
				warn: config.warn,
				sender: {
					sendPlain: (text, fallback, label) => sendPlainOrHtml(text, false, fallback, label),
					sendHtml: (text) => sendPlainOrHtml(text, true),
					sendRich: async (richMessage) => {
						const rawParams = prepared.requestParams();
						const markup = rawParams.reply_markup ? { reply_markup: rawParams.reply_markup } : {};
						const sent = await request("sendRichMessage", toTelegramRichMessageContextParams(rawParams), (effective) => config.api.raw.sendRichMessage({
							chat_id: config.chatId,
							rich_message: richMessage,
							...effective,
							...markup
						}), { rich: true });
						const acceptedParams = {
							...sent.acceptedParams,
							...markup
						};
						return {
							...sent,
							acceptedParams
						};
					}
				}
			});
			try {
				while (true) {
					let next;
					try {
						next = await iterator.next();
					} catch (error) {
						reject(error);
						break;
					}
					if (next.done) {
						acceptedPages += 1;
						prepared.delivered?.();
						break;
					}
					if (next.value.result) {
						const part = {
							...next.value.result,
							plainText: next.value.page.plainText
						};
						await accept(part, params.observe, {
							partialDeliveryResult: params.tracking.partialDeliveryResult,
							start
						});
					}
				}
			} finally {
				await iterator.return(void 0);
			}
		}
		if (firstRejectedError !== void 0) fail(firstRejectedError, start, params.tracking.partialDeliveryResult?.());
		if (parts.length === start && firstSilentSkipError !== void 0) fail(firstSilentSkipError, start);
		return parts.slice(start);
	};
	const sendMedia = async (params) => {
		const send = async (sender) => {
			await config.beforeMedia?.();
			return sendTelegramCaptionedMediaWithFallback({
				operation: sender.operation,
				requestParams: params.requestParams,
				plainCaption: params.plainCaption,
				shouldLog: (error) => sender.label === "photo" ? !isTelegramPhotoLimitError(error) : sender.label !== "voice" || !isTelegramVoiceMessagesForbiddenError(error),
				send: (requestParams, shouldLog) => request(sender.operation, requestParams, sender.send, { shouldLog })
			});
		};
		const delivery = await sendTelegramOutboundMediaWithPhotoFallback({
			sender: params.sender,
			documentSender: params.documentSender ?? params.sender,
			send
		});
		return {
			...delivery.result.result,
			plainText: delivery.result.deliveredCaption ?? "",
			captionRemoved: delivery.result.captionRemoved,
			sender: delivery.sender
		};
	};
	const sendPhotoAlbum = async (params) => {
		await config.beforeMedia?.();
		const delivery = await sendTelegramCaptionedMediaWithFallback({
			operation: "sendMediaGroup",
			requestParams: params.requestParams,
			plainCaption: params.plainCaption,
			shouldLog: (error) => !isTelegramPhotoLimitError(error),
			send: (requestParams, shouldLog) => request("sendMediaGroup", requestParams, (effective) => {
				const { caption, parse_mode, ...groupParams } = effective;
				return config.api.sendMediaGroup(config.chatId, params.files.map((media, index) => ({
					type: "photo",
					media,
					...index === 0 && typeof caption === "string" ? { caption } : {},
					...index === 0 && parse_mode === "HTML" ? { parse_mode: "HTML" } : {}
				})), groupParams);
			}, { shouldLog })
		});
		const [first, ...remaining] = delivery.result.result.map((result, index) => ({
			result,
			acceptedParams: delivery.result.acceptedParams,
			plainText: index === 0 ? delivery.deliveredCaption ?? "" : ""
		}));
		if (!first) throw new Error("Telegram sendMediaGroup returned no messages");
		return {
			parts: [first, ...remaining],
			...delivery.captionRemoved ? { captionRemoved: true } : {}
		};
	};
	return {
		parts,
		accept,
		acceptMany,
		fail,
		sendText,
		sendMedia,
		sendPhotoAlbum
	};
}
//#endregion
//#region extensions/telegram/src/send-message.ts
const MAX_TELEGRAM_PHOTO_DIMENSION_SUM = 1e4;
const MAX_TELEGRAM_PHOTO_ASPECT_RATIO = 20;
async function sendMessageTelegram(to, text, opts) {
	return withTelegramApiContext(opts, async (apiContext) => {
		const { cfg, account, api, ownerAgentId } = apiContext;
		const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
		const { chatId, threadSpec, threadParams: preparedThreadParams, request: requestWithChatNotFound } = await prepareTelegramOutbound({
			to,
			context: apiContext,
			opts,
			thread: {
				messageThreadId: opts.messageThreadId,
				directMessagesTopicId: opts.directMessagesTopicId,
				replyToMessageId: opts.replyToMessageId,
				replyQuoteText: opts.quoteText,
				useReplyIdAsQuoteSource: true
			},
			request: { kind: "nonIdempotent" }
		});
		const deliveryResults = [];
		let finalMediaBatch = true;
		const reportDelivery = async (messageId, deliveredChatId, message, meta, kind, onPrepared) => {
			return await reportTelegramProviderDelivery({
				message,
				messageId,
				fallbackChatId: deliveredChatId,
				successfulSendThread: threadSpec,
				...meta ? { meta } : {},
				...kind ? { kind } : {},
				onPrepared: (delivery) => {
					deliveryResults.push({
						...delivery,
						receipt: delivery.receipt ?? createMessageReceiptFromOutboundResults({
							results: [delivery],
							kind
						})
					});
					onPrepared?.(delivery);
				},
				onDeliveryResult: opts.onDeliveryResult
			});
		};
		const recordDeliveredPromptContext = async (params, finalPart) => {
			const plan = opts.promptContextProjectionPlan;
			const projection = plan?.cursor.take(plan.finalPart && finalPart && finalMediaBatch);
			const recorded = await recordOutboundMessageForPromptContext({
				cfg,
				ownerAgentId,
				account,
				...botUserId !== void 0 ? { botUserId } : {},
				chatId,
				...threadSpec?.id !== void 0 ? { messageThreadId: threadSpec.id } : {},
				...threadSpec ? { successfulSendThread: threadSpec } : {},
				...params,
				promptContextProjection: projection
			});
			if (projection && !recorded) plan?.cursor.invalidate();
		};
		const mediaUrls = (opts.mediaUrls?.length ? opts.mediaUrls : [opts.mediaUrl ?? ""]).map((url) => url.trim()).filter(Boolean);
		const mediaMaxBytes = opts.maxBytes ?? (typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb : 100) * 1024 * 1024;
		const replyMarkup = buildInlineKeyboard(opts.buttons);
		const singleUseReplyTo = opts.replyToIdSource === "implicit" && opts.replyToMode !== void 0 && isSingleUseReplyToMode(opts.replyToMode);
		let threadParamsWithoutReply;
		const buildThreadParams = (includeReplyTo) => {
			if (includeReplyTo) return preparedThreadParams;
			threadParamsWithoutReply ??= buildTelegramThreadReplyParams({ thread: threadSpec });
			return threadParamsWithoutReply;
		};
		const textMode = opts.textMode ?? "markdown";
		const useRichMessages = account.config.richMessages === true && textMode !== "html";
		const tableMode = opts.tableMode ?? resolveMarkdownTableMode({
			cfg,
			channel: "telegram",
			accountId: account.accountId,
			supportsBlockTables: useRichMessages
		});
		const renderHtmlText = (value) => renderTelegramHtmlText(value, {
			textMode,
			tableMode
		});
		const linkPreviewOptions = account.config.linkPreview ?? true ? void 0 : { is_disabled: true };
		const sender = createTelegramPreparedSender({
			api,
			chatId,
			warn: (message) => sendLogger$1.warn(message),
			request: async (send, label, options) => {
				await opts.onPlatformSendDispatch?.();
				return requestWithChatNotFound(send, label, options);
			},
			assertPlatformSendAuthorized: () => {
				opts.signal?.throwIfAborted();
				opts.assertPlatformSendAuthorized?.();
			}
		});
		const buildMediaReceipt = () => {
			const deliveries = new Map(deliveryResults.map((delivery) => [delivery.messageId, delivery]));
			const results = sender.parts.map((part) => {
				const messageId = String(part.messageId);
				const delivery = deliveries.get(messageId) ?? buildTelegramProviderDeliveryResult({
					message: part.result,
					messageId,
					fallbackChatId: chatId,
					successfulSendThread: threadSpec,
					kind: "media"
				});
				const replyToId = resolveAcceptedReplyToMessageId(toAcceptedThreadScopedParams(part.acceptedParams))?.toString();
				return {
					...delivery,
					receipt: createMessageReceiptFromOutboundResults({
						results: [delivery],
						kind: "media",
						...replyToId ? { replyToId } : {}
					})
				};
			});
			const receipt = createMessageReceiptFromOutboundResults({
				results,
				kind: "media"
			});
			receipt.parts = receipt.parts.map((part, index) => ({
				...part,
				index
			}));
			const replyToId = receipt.parts.find((part) => part.replyToId)?.replyToId;
			if (replyToId) receipt.replyToId = replyToId;
			return receipt;
		};
		const { sendChunkedText } = createTelegramTextSender({
			cfg,
			ownerAgentId,
			account,
			api,
			chatId,
			opts,
			replyMarkup,
			reportDelivery,
			recordDeliveredPromptContext,
			singleUseReplyTo,
			buildThreadParams,
			sender,
			textMode,
			tableMode,
			renderHtmlText,
			linkPreviewOptions,
			useRichMessages
		});
		async function shouldSendTelegramImageAsPhoto(buffer) {
			try {
				const metadata = await getImageMetadata(buffer);
				const width = metadata?.width;
				const height = metadata?.height;
				if (typeof width !== "number" || typeof height !== "number") {
					sendLogger$1.warn("Photo dimensions are unavailable. Sending as document instead.");
					return false;
				}
				const shorterSide = Math.min(width, height);
				const longerSide = Math.max(width, height);
				if (!(width + height <= MAX_TELEGRAM_PHOTO_DIMENSION_SUM && shorterSide > 0 && longerSide <= shorterSide * MAX_TELEGRAM_PHOTO_ASPECT_RATIO)) {
					sendLogger$1.warn(`Photo dimensions (${width}x${height}) are not valid for Telegram photos. Sending as document instead.`);
					return false;
				}
				return true;
			} catch (err) {
				sendLogger$1.warn(`Failed to validate photo dimensions: ${formatErrorMessage(err)}. Sending as document instead.`);
				return false;
			}
		}
		const prepareMedia = async (mediaUrl, index) => {
			const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
				maxBytes: mediaMaxBytes,
				mediaAccess: opts.mediaAccess,
				mediaLocalRoots: opts.mediaLocalRoots,
				mediaReadFile: opts.mediaReadFile,
				optimizeImages: opts.forceDocument ? false : void 0
			}));
			const mediaPlan = prepareTelegramOutboundMedia({
				media,
				text: index === 0 ? text : "",
				textMode,
				tableMode,
				forceDocument: opts.forceDocument,
				asVideoNote: opts.asVideoNote
			});
			const sendImageAsPhoto = mediaPlan.deliveryKind !== "image" || mediaPlan.isGif || await shouldSendTelegramImageAsPhoto(media.buffer);
			const { sender: mediaSender, documentSender } = resolveTelegramOutboundMediaSenders({
				api,
				chatId,
				media,
				plan: mediaPlan,
				forceDocument: opts.forceDocument,
				asVoice: opts.asVoice,
				sendImageAsPhoto
			});
			return {
				index,
				media,
				mediaPlan,
				mediaSender,
				documentSender
			};
		};
		const sendMediaBatch = async (batch) => {
			const first = batch[0];
			const { media, mediaPlan, mediaSender, documentSender } = first;
			const batchReplyMarkup = first.index === 0 ? replyMarkup : void 0;
			finalMediaBatch = first.index + batch.length === mediaUrls.length;
			const { htmlCaption, plainCaption, followUpText } = mediaPlan;
			const needsSeparateText = Boolean(followUpText);
			const baseMediaParams = {
				...buildThreadParams(!singleUseReplyTo || sender.parts.length === 0),
				...!needsSeparateText && batchReplyMarkup ? { reply_markup: batchReplyMarkup } : {}
			};
			const videoDimensions = mediaPlan.deliveryKind === "video" && !mediaPlan.isVideoNote ? await probeVideoDimensions(media.buffer) : void 0;
			const mediaParams = {
				...htmlCaption ? {
					caption: htmlCaption,
					parse_mode: "HTML"
				} : {},
				...baseMediaParams,
				...opts.silent === true ? { disable_notification: true } : {},
				...videoDimensions ? {
					width: videoDimensions.width,
					height: videoDimensions.height
				} : {}
			};
			let mediaParts;
			let operation = mediaSender.operation;
			let deliveryKind = mediaSender.label;
			try {
				if (batch.length > 1) try {
					mediaParts = (await sender.sendPhotoAlbum({
						files: batch.map((item) => item.mediaPlan.file),
						requestParams: mediaParams,
						plainCaption: htmlCaption ? plainCaption : void 0
					})).parts;
					operation = "sendMediaGroup";
				} catch (error) {
					if (!isTelegramPhotoLimitError(error)) throw error;
					first.mediaPlan.followUpText = void 0;
					batch.reduce((_previous, item) => item).mediaPlan.followUpText = followUpText;
					let result = await sendMediaBatch([first]);
					for (const item of batch.slice(1)) result = await sendMediaBatch([item]);
					return result;
				}
				else {
					const delivery = await sender.sendMedia({
						sender: mediaSender,
						documentSender,
						requestParams: mediaParams,
						plainCaption: htmlCaption ? plainCaption : void 0
					});
					mediaParts = [delivery];
					operation = delivery.sender.operation;
					deliveryKind = delivery.sender.label;
				}
			} catch (error) {
				if (mediaSender.label === "voice" && isTelegramVoiceMessagesForbiddenError(error) && first.index === 0 && text.trim()) {
					logVerbose("telegram sendVoice forbidden by recipient privacy settings; falling back to text");
					const textResult = await sendChunkedText(text, "voice fallback text send", { replyToAlreadyUsed: singleUseReplyTo && sender.parts.length > 0 });
					recordChannelActivity({
						channel: "telegram",
						accountId: account.accountId,
						direction: "outbound"
					});
					return textResult;
				}
				opts.promptContextProjectionPlan?.cursor.invalidate();
				throw error;
			}
			const lastMedia = mediaParts.reduce((_previous, part) => part);
			let mediaDeliveryResult;
			const recordedMedia = /* @__PURE__ */ new Set();
			const recordMediaPromptPart = async (part, finalPart) => {
				if (recordedMedia.has(part.result)) return;
				const acceptedParams = toAcceptedThreadScopedParams(part.acceptedParams);
				await recordDeliveredPromptContext({
					message: part.result,
					messageId: part.result.message_id,
					...part.plainText ? { text: part.plainText } : {},
					...acceptedParams?.message_thread_id !== void 0 ? { messageThreadId: acceptedParams.message_thread_id } : {}
				}, finalPart);
				recordedMedia.add(part.result);
			};
			const recordMediaPromptContext = async (finalPart) => {
				for (const [index, part] of mediaParts.entries()) await recordMediaPromptPart(part, finalPart && index === mediaParts.length - 1);
			};
			await sender.acceptMany(mediaParts, async (part) => {
				const deliveredCaption = part.plainText || void 0;
				const acceptedParams = toAcceptedThreadScopedParams(part.acceptedParams);
				const resolvedChatId = String(part.result.chat?.id ?? chatId);
				const meta = {
					...deliveredCaption ? { telegramDeliveredText: deliveredCaption } : {},
					telegramHasInlineKeyboard: part.hasInlineKeyboard
				};
				telegramCaptionDeliveryMetadata.add(meta);
				await recordSentMessage(chatId, part.messageId, cfg, {
					accountId: account.accountId,
					agentId: ownerAgentId
				});
				await reportDelivery(part.messageId, resolvedChatId, part.result, meta, "media", (delivery) => {
					mediaDeliveryResult = delivery;
				});
				const lastPart = part.result === lastMedia.result;
				if (!needsSeparateText || !lastPart) await recordMediaPromptPart(part, lastPart);
				logTelegramOutboundSendOk({
					accountId: account.accountId,
					chatId: resolvedChatId,
					messageId: String(part.messageId),
					operation,
					deliveryKind,
					messageThreadId: acceptedParams?.message_thread_id,
					replyToMessageId: opts.replyToMessageId,
					silent: opts.silent
				});
			}, { partialDeliveryResult: () => ({
				receipt: buildMediaReceipt(),
				visibleReplySent: true
			}) });
			const mediaMessageId = resolveTelegramMessageIdOrThrow(lastMedia.result, "media send");
			const resolvedChatId = String(lastMedia.result.chat?.id ?? chatId);
			const acceptedMediaParams = toAcceptedThreadScopedParams(lastMedia.acceptedParams);
			recordChannelActivity({
				channel: "telegram",
				accountId: account.accountId,
				direction: "outbound"
			});
			if (needsSeparateText && followUpText) {
				let textResult;
				try {
					textResult = await sendChunkedText(followUpText, "text follow-up send", {
						replyToAlreadyUsed: singleUseReplyTo,
						beforeFirstAccepted: () => recordMediaPromptContext(false)
					});
				} catch (error) {
					if (!isChannelPartialDeliveryError(error) && isTelegramEmptyContentError(error)) {
						let hasInlineKeyboard = false;
						let keyboardError;
						if (batchReplyMarkup) try {
							await api.editMessageReplyMarkup(resolvedChatId, mediaMessageId, { reply_markup: batchReplyMarkup });
							hasInlineKeyboard = true;
						} catch (editError) {
							keyboardError = editError;
						}
						await recordMediaPromptContext(true);
						if (keyboardError !== void 0) throw createChannelPartialDeliveryError(keyboardError, {
							messageIds: [String(mediaMessageId)],
							...mediaDeliveryResult?.receipt ? { receipt: mediaDeliveryResult.receipt } : {},
							visibleReplySent: true
						});
						const finalMediaResult = mediaDeliveryResult ?? {
							messageId: String(mediaMessageId),
							chatId: resolvedChatId
						};
						if (!hasInlineKeyboard) return finalMediaResult;
						const meta = {
							...finalMediaResult.meta,
							telegramHasInlineKeyboard: true
						};
						telegramCaptionDeliveryMetadata.add(meta);
						return {
							...finalMediaResult,
							meta
						};
					}
					await recordMediaPromptContext(false);
					return sender.fail(error);
				}
				const mediaReplyToId = resolveAcceptedReplyToMessageId(acceptedMediaParams)?.toString();
				const receipt = createMessageReceiptFromOutboundResults({
					results: [mediaDeliveryResult ?? {
						messageId: String(mediaMessageId),
						chatId: resolvedChatId
					}, textResult],
					kind: "text"
				});
				if (mediaReplyToId) receipt.replyToId = mediaReplyToId;
				receipt.parts = receipt.parts.map((part, index) => ({
					...part,
					index,
					...index === 0 ? { kind: "media" } : {},
					...mediaReplyToId && (index === 0 || !textResult.receipt && !singleUseReplyTo) ? { replyToId: mediaReplyToId } : {}
				}));
				return {
					...textResult,
					chatId: resolvedChatId,
					receipt
				};
			}
			return mediaDeliveryResult?.meta?.telegramHasInlineKeyboard ? mediaDeliveryResult : {
				messageId: String(mediaMessageId),
				chatId: resolvedChatId,
				...mediaDeliveryResult?.receipt ? { receipt: mediaDeliveryResult.receipt } : {}
			};
		};
		if (mediaUrls.length > 0) {
			if (opts.asVideoNote && mediaUrls.length !== 1) throw new Error("Telegram video notes require exactly one media attachment.");
			try {
				for await (const batch of planTelegramMediaBatches({
					mediaUrls,
					prepare: prepareMedia,
					canGroup: (item) => !replyMarkup && item.mediaSender.label === "photo"
				})) {
					const result = await sendMediaBatch(batch);
					if (batch[0].index + batch.length === mediaUrls.length) {
						if (mediaUrls.length === 1) return result;
						const receipt = buildMediaReceipt();
						return {
							...deliveryResults.find((delivery) => delivery.meta?.telegramHasInlineKeyboard) ?? result,
							receipt
						};
					}
				}
			} catch (error) {
				opts.promptContextProjectionPlan?.cursor.invalidate();
				return sender.fail(error, 0, {
					receipt: buildMediaReceipt(),
					visibleReplySent: true
				});
			}
		}
		if (!text || !text.trim()) throw new Error("Message must be non-empty for Telegram sends");
		const textResult = await sendChunkedText(text, "text send");
		recordChannelActivity({
			channel: "telegram",
			accountId: account.accountId,
			direction: "outbound"
		});
		return textResult;
	});
}
//#endregion
//#region extensions/telegram/src/poll-registry.ts
const TELEGRAM_POLL_REGISTRY_NAMESPACE = "telegram.poll-registry";
const TELEGRAM_POLL_REGISTRY_MAX_ENTRIES = 1e4;
const TELEGRAM_CLOSED_POLL_RETENTION_MS = 1728e5;
function openPollRegistryStore(env) {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_POLL_REGISTRY_NAMESPACE,
		maxEntries: TELEGRAM_POLL_REGISTRY_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function openPollRegistrySyncStore(env) {
	return getTelegramRuntime().state.openSyncKeyedStore({
		namespace: TELEGRAM_POLL_REGISTRY_NAMESPACE,
		maxEntries: TELEGRAM_POLL_REGISTRY_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function telegramPollRegistryKey(accountId, pollId) {
	return `${normalizeAccountId(accountId)}:${pollId}`;
}
function normalizePollChat(raw) {
	if (!isRecord(raw) || raw.is_direct_messages === true) return null;
	const id = parseStrictInteger(raw.id);
	if (id === void 0) return null;
	if (raw.type === "private" && typeof raw.first_name === "string") return {
		id,
		type: "private",
		first_name: raw.first_name
	};
	if (raw.type === "group" && typeof raw.title === "string") return {
		id,
		type: "group",
		title: raw.title
	};
	if (raw.type === "supergroup" && typeof raw.title === "string") return {
		id,
		type: "supergroup",
		title: raw.title,
		...raw.is_forum === true ? { is_forum: true } : {}
	};
	return null;
}
function normalizePollThreadSpec(raw, chat) {
	if (!isRecord(raw)) return null;
	const id = parseStrictPositiveInteger(raw.id);
	if (raw.scope === "none") return raw.id === void 0 && chat.type !== "private" && chat.is_forum !== true ? { scope: "none" } : null;
	if (raw.scope === "dm") {
		if (chat.type !== "private" || raw.id !== void 0 && id === void 0) return null;
		return id === void 0 ? { scope: "dm" } : {
			scope: "dm",
			id
		};
	}
	return raw.scope === "forum" && chat.type === "supergroup" && id !== void 0 ? {
		scope: "forum",
		id
	} : null;
}
function normalizePollRegistryEntry(raw) {
	if (!isRecord(raw)) return null;
	const chat = normalizePollChat(raw.chat);
	const messageId = parseStrictInteger(raw.messageId);
	const threadSpec = chat ? normalizePollThreadSpec(raw.threadSpec, chat) : null;
	if (typeof raw.pollId !== "string" || !chat || !threadSpec || messageId === void 0 || typeof raw.question !== "string" || !Array.isArray(raw.options) || !raw.options.every((option) => typeof option === "string")) return null;
	return {
		pollId: raw.pollId,
		chat,
		messageId,
		threadSpec,
		question: raw.question,
		options: raw.options
	};
}
async function recordTelegramPollRegistryEntry(params) {
	const entry = createTelegramPollRegistryEntry(params);
	await openPollRegistryStore(params.env).register(telegramPollRegistryKey(params.accountId, params.pollId), entry);
	return entry;
}
function createTelegramPollRegistryEntry(params) {
	const entry = normalizePollRegistryEntry({
		pollId: params.pollId,
		chat: params.chat,
		messageId: params.messageId,
		threadSpec: params.threadSpec,
		question: params.question,
		options: [...params.options]
	});
	if (!entry) throw new Error("Invalid Telegram poll registry route");
	return entry;
}
async function findTelegramPollRegistryEntry(params) {
	return normalizePollRegistryEntry(await openPollRegistryStore(params.env).lookup(telegramPollRegistryKey(params.accountId, params.pollId)));
}
/** Retained for hosts whose ingress monitor does not support inspectAsync. */
function findTelegramPollRegistryEntrySync(params) {
	return normalizePollRegistryEntry(openPollRegistrySyncStore(params.env).lookup(telegramPollRegistryKey(params.accountId, params.pollId)));
}
async function retireTelegramPollRegistryEntry(params) {
	const store = openPollRegistryStore(params.env);
	const key = telegramPollRegistryKey(params.accountId, params.pollId);
	const entry = normalizePollRegistryEntry(await store.lookup(key));
	if (!entry) return;
	await store.register(key, entry, { ttlMs: TELEGRAM_CLOSED_POLL_RETENTION_MS });
}
//#endregion
//#region extensions/telegram/src/poll-answer-context.ts
const preparedPollAnswers = /* @__PURE__ */ new WeakMap();
const pendingPollRegistrations = /* @__PURE__ */ new Map();
function beginTelegramPollRegistration(params) {
	const key = telegramPollRegistryKey(params.accountId, params.entry.pollId);
	let completeRegistration = () => {};
	const completion = new Promise((resolve) => {
		completeRegistration = resolve;
	});
	const registration = {
		entry: params.entry,
		completion
	};
	pendingPollRegistrations.set(key, registration);
	return { complete: (entry) => {
		completeRegistration(entry);
		if (pendingPollRegistrations.get(key) === registration) pendingPollRegistrations.delete(key);
	} };
}
function resolveUnpreparedPollId(params) {
	if (!isEligibleTelegramPollAnswerUpdate(params.update) || preparedPollAnswers.has(params.update)) return;
	const pollId = params.update.poll_answer.poll_id;
	const pending = pendingPollRegistrations.get(telegramPollRegistryKey(params.accountId, pollId));
	if (pending) {
		preparedPollAnswers.set(params.update, {
			entry: pending.entry,
			registrationPending: true
		});
		return;
	}
	return pollId;
}
/** Retained for hosts whose ingress monitor does not support inspectAsync. */
function prepareTelegramPollAnswerContext(params) {
	const pollId = resolveUnpreparedPollId(params);
	if (pollId === void 0) return;
	preparedPollAnswers.set(params.update, { entry: findTelegramPollRegistryEntrySync({
		pollId,
		accountId: params.accountId
	}) });
}
async function prepareTelegramPollAnswerContextAsync(params) {
	const pollId = resolveUnpreparedPollId(params);
	if (pollId === void 0) return;
	const entry = await findTelegramPollRegistryEntry({
		pollId,
		accountId: params.accountId
	});
	preparedPollAnswers.set(params.update, { entry });
}
async function settleTelegramPollAnswerContext(params) {
	if (!preparedPollAnswers.get(params.update)?.registrationPending || !isEligibleTelegramPollAnswerUpdate(params.update)) return;
	const pollId = params.update.poll_answer.poll_id;
	const pending = pendingPollRegistrations.get(telegramPollRegistryKey(params.accountId, pollId));
	const entry = pending ? await pending.completion : await findTelegramPollRegistryEntry({
		pollId,
		accountId: params.accountId
	});
	preparedPollAnswers.set(params.update, { entry });
}
function getPreparedTelegramPollAnswer(update) {
	return preparedPollAnswers.get(update);
}
function isEligibleTelegramPollAnswerUpdate(update) {
	if (!update || typeof update !== "object") return false;
	const pollAnswer = update.poll_answer;
	return Boolean(pollAnswer?.poll_id && pollAnswer.user && !pollAnswer.user.is_bot && pollAnswer.option_ids?.length);
}
function recordPreparedTelegramPollAnswer(update, prepared) {
	preparedPollAnswers.set(update, prepared);
}
//#endregion
//#region extensions/telegram/src/send-special.ts
function resolveTelegramPollThreadSpec(threadSpec) {
	if (threadSpec.scope === "none") return { scope: "none" };
	if (threadSpec.scope === "dm") return threadSpec.id === void 0 ? { scope: "dm" } : {
		scope: "dm",
		id: threadSpec.id
	};
	return threadSpec.scope === "forum" && threadSpec.id !== void 0 ? {
		scope: "forum",
		id: threadSpec.id
	} : void 0;
}
/**
* Send a sticker to a Telegram chat by file_id.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param fileId - Telegram file_id of the sticker to send
* @param opts - Optional configuration
*/
async function sendStickerTelegram(to, fileId, opts) {
	if (!fileId?.trim()) throw new Error("Telegram sticker file_id is required");
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const prepared = await prepareTelegramOutbound({
			to,
			context,
			opts,
			thread: {
				messageThreadId: opts.messageThreadId,
				replyToMessageId: opts.replyToMessageId
			},
			request: {
				kind: "nonIdempotent",
				useApiErrorLogging: false
			}
		});
		const stickerParams = Object.keys(prepared.threadParams).length > 0 ? prepared.threadParams : void 0;
		return finalizeTelegramOutbound({
			context,
			prepared,
			result: await prepared.request(() => api.sendSticker(prepared.chatId, fileId.trim(), stickerParams), "sticker"),
			resultContext: "sticker send"
		});
	});
}
/**
* Send a poll to a Telegram chat.
* @param to - Chat ID or username (e.g., "123456789" or "@username")
* @param poll - Poll input with question, options, maxSelections, and optional durationHours
* @param opts - Optional configuration
*/
async function sendPollTelegram(to, poll, opts) {
	if (parseTelegramTarget(to).directMessagesTopicId != null) throw new Error("Telegram polls are not supported in channel Direct Messages chats.");
	return withTelegramApiContext(opts, async (context) => {
		const { api } = context;
		const prepared = await prepareTelegramOutbound({
			to,
			context,
			opts,
			thread: {
				messageThreadId: opts.messageThreadId,
				replyToMessageId: opts.replyToMessageId
			},
			request: { kind: "nonIdempotent" }
		});
		const normalizedPoll = normalizePollInput(poll, { maxOptions: 12 });
		const durationSeconds = normalizedPoll.durationSeconds;
		if (durationSeconds === void 0 && normalizedPoll.durationHours !== void 0) throw new Error("Telegram poll durationHours is not supported. Use durationSeconds (5-604800) instead.");
		if (durationSeconds !== void 0 && (durationSeconds < 5 || durationSeconds > 604800)) throw new Error("Telegram poll durationSeconds must be between 5 and 604800");
		const pollParams = {
			allows_multiple_answers: normalizedPoll.maxSelections > 1,
			is_anonymous: opts.isAnonymous ?? true,
			...durationSeconds !== void 0 ? { open_period: durationSeconds } : {},
			...Object.keys(prepared.threadParams).length > 0 ? prepared.threadParams : {},
			...opts.silent === true ? { disable_notification: true } : {}
		};
		await opts.onPlatformSendDispatch?.();
		const result = await prepared.request(() => {
			opts.assertPlatformSendAuthorized?.();
			return api.sendPoll(prepared.chatId, normalizedPoll.question, normalizedPoll.options, pollParams);
		}, "poll");
		const pollId = result.poll.id;
		const routeChat = result.chat.type === "channel" ? void 0 : result.chat;
		const routeMessage = result.message_thread_id === void 0 && prepared.threadSpec?.id !== void 0 ? {
			...result,
			message_thread_id: prepared.threadSpec.id
		} : result;
		const resolvedThreadSpec = routeChat ? resolveTelegramMessageThreadSpec(routeMessage, prepared.threadSpec?.scope === "forum" || result.chat.is_forum === true) : void 0;
		const threadSpec = resolvedThreadSpec ? resolveTelegramPollThreadSpec(resolvedThreadSpec) : void 0;
		const messageThreadId = threadSpec && "id" in threadSpec ? threadSpec.id : void 0;
		const provisionalEntry = opts.isAnonymous === false && routeChat && threadSpec ? createTelegramPollRegistryEntry({
			pollId,
			chat: routeChat,
			messageId: result.message_id,
			threadSpec,
			question: normalizedPoll.question,
			options: normalizedPoll.options
		}) : void 0;
		const registration = provisionalEntry ? beginTelegramPollRegistration({
			accountId: context.account.accountId,
			entry: provisionalEntry
		}) : void 0;
		let registeredEntry = null;
		let pollAnswerRouting;
		let warning;
		try {
			const finalized = await finalizeTelegramOutbound({
				context,
				prepared,
				result,
				resultContext: "poll send"
			});
			if (pollId && opts.isAnonymous !== false) {
				pollAnswerRouting = "unavailable";
				warning = "Poll sent anonymously, so Telegram does not identify voters and answers cannot reach the agent. Send a public poll to route votes into this conversation.";
			} else if (pollId) {
				const isGroup = result.chat.type === "group" || result.chat.type === "supergroup";
				const botUserId = resolveTelegramBotUserIdFromToken(opts.token || context.account.token);
				let canVerifyVoters = result.chat.type === "private";
				if (result.chat.type === "channel") {
					pollAnswerRouting = "unavailable";
					warning = "Poll sent, but public poll answer routing is not supported for Telegram channels. Send the poll in a direct chat or group, or ask subscribers to reply in text.";
				} else if (isGroup) {
					const { groupConfig, topicConfig } = resolveTelegramScopedGroupConfig(context.account.config, result.chat.id, messageThreadId);
					const groupPolicyConfig = groupConfig && "groupPolicy" in groupConfig ? groupConfig : void 0;
					if (groupConfig?.enabled === false || topicConfig?.enabled === false || resolveTelegramEffectiveGroupPolicy({
						cfg: opts.cfg,
						telegramCfg: context.account.config,
						groupConfig: groupPolicyConfig,
						topicConfig
					}) === "disabled") {
						pollAnswerRouting = "unavailable";
						warning = "Poll sent, but answers cannot reach the agent because inbound messages are disabled for this group or topic. Enable inbound messages for this target and send a new poll, or ask participants to reply in text.";
					} else if (botUserId == null) {
						pollAnswerRouting = "unavailable";
						warning = "Poll sent, but answers cannot reach the agent because the bot account could not be verified. Check the bot token and send a new poll, or ask the user to reply in text.";
					} else try {
						const botMember = await api.getChatMember(result.chat.id, botUserId);
						canVerifyVoters = botMember.status === "creator" || botMember.status === "administrator";
						if (!canVerifyVoters) {
							pollAnswerRouting = "unavailable";
							warning = "Poll sent, but answers cannot reach the agent because the bot is not an administrator in this group. Make the bot an administrator and send a new poll, or ask the user to reply in text.";
						}
					} catch (err) {
						pollAnswerRouting = "unavailable";
						warning = "Poll sent, but answers cannot reach the agent because group membership verification failed. Make the bot an administrator and send a new poll, or ask the user to reply in text.";
						logVerbose(`telegram: failed to verify poll voter access for poll ${pollId}: ${err instanceof Error ? err.message : String(err)}`);
					}
				}
				if (canVerifyVoters && provisionalEntry) try {
					registeredEntry = await recordTelegramPollRegistryEntry({
						accountId: context.account.accountId,
						...provisionalEntry
					});
					pollAnswerRouting = "enabled";
				} catch (err) {
					pollAnswerRouting = "unavailable";
					warning = "Poll sent, but answers cannot reach the agent because routing state could not be saved. Ask the user to reply in text.";
					logVerbose(`telegram: failed to record poll registry entry for poll ${pollId}: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
			return {
				...finalized,
				pollId,
				...pollAnswerRouting ? { pollAnswerRouting } : {},
				...warning ? { warning } : {}
			};
		} finally {
			registration?.complete(registeredEntry);
		}
	});
}
//#endregion
export { isTelegramMessageFromCurrentBot as $, getTelegramAllowedReactions as A, resolveTelegramStatusReactionEmojis as B, editMessageReplyMarkupTelegram as C, editForumTopicTelegram as D, createForumTopicTelegram as E, TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST as F, buildTelegramSendParams as G, reportTelegramProviderDelivery as H, buildTelegramStatusReactionVariants as I, recordOutboundMessageForPromptContext as J, buildTelegramThreadReplyParams as K, resolveTelegramAllowedReactions as L, reactMessageTelegram as M, sendTypingTelegram as N, renameForumTopicTelegram as O, unpinMessageTelegram as P, hasProviderObservedTelegramThreadBinding as Q, resolveTelegramReactionEmoji as R, sendLocationTelegram as S, planTelegramTextDeliveryPages as T, recordSentMessage as U, buildTelegramProviderDeliveryResult as V, wasSentByBot as W, buildTelegramReplyChain as X, buildTelegramConversationContext as Y, createTelegramMessageCache as Z, resolveTelegramOutboundMediaSenders as _, sequentialize as _t, prepareTelegramPollAnswerContext as a, selectTelegramGroupPromptContext as at, isTelegramVoiceMessagesForbiddenError as b, resolveTelegramEffectiveGroupPolicy as bt, settleTelegramPollAnswerContext as c, asTelegramClientFetch as ct, sendMessageTelegram as d, resolveTelegramClientTimeoutSeconds as dt, resolveProviderObservedTelegramThreadSpec as et, createTelegramPreparedSender as f, resolveTelegramOutboundClientTimeoutFloorSeconds as ft, prepareTelegramOutboundMedia as g, apiThrottler as gt, mergeTelegramPartialDeliveryError as h, Bot$1 as ht, isEligibleTelegramPollAnswerUpdate as i, isTelegramSelfSenderName as it, pinMessageTelegram as j, deleteMessageTelegram as k, findTelegramPollRegistryEntry as l, createTelegramClientFetch as lt, failPromptContextSequence as m, TELEGRAM_CHAT_ACTION_INTERVAL_MS as mt, sendStickerTelegram as n, isTelegramChatWindowPromptContext as nt, prepareTelegramPollAnswerContextAsync as o, telegramPromptContextHistory as ot, createTelegramReplyRequest as p, getOrCreateAccountThrottler as pt, withTelegramNativeQuoteFallback as q, getPreparedTelegramPollAnswer as r, isTelegramHistoryEntryAfterAmbientWatermark as rt, recordPreparedTelegramPollAnswer as s, resetTelegramClientOptionsCacheForTests as st, sendPollTelegram as t, buildTelegramSelfSenderName as tt, retireTelegramPollRegistryEntry as u, resolveTelegramClientTimeoutMinimumSeconds as ut, isTelegramCaptionTooLongError as v, evaluateTelegramGroupBaseAccess as vt, editMessageTelegram as w, planTelegramMediaBatches as x, resolveTelegramRuntimeGroupPolicy as xt, isTelegramPhotoLimitError as y, evaluateTelegramGroupPolicyAccess as yt, resolveTelegramReactionVariant as z };
