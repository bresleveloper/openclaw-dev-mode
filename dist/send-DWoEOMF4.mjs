import { t as __commonJSMin } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, S as parseStrictInteger, s as asFiniteNumber, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as asOptionalRecord, c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { l as readConfigFileSnapshotForWrite } from "./io.runtime-Ds5uC0Bf.mjs";
import { l as kindFromMime, r as extensionForMime, s as isGifMedia } from "./mime-C3j3dfQb.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { t as captureEffectAuthority } from "./effect-authority-Cik3sxlk.mjs";
import { u as responseWithRelease } from "./fetch-guard-DRapCKeS.mjs";
import "./channel-outbound-BbIm36V0.mjs";
import { n as firstDefined, r as isSenderIdAllowed } from "./allow-from-Fqs2UkzW.mjs";
import { n as normalizeOutboundLocation, t as formatLocationText } from "./location-CxESZbHi.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-CLjC4hNl.mjs";
import { i as runFfprobe } from "./ffmpeg-exec-BXxkKwWn.mjs";
import { s as getImageMetadata } from "./image-ops-DM5GUpDi.mjs";
import { r as probeVideoDimensions } from "./media-probe--mrhBqNu.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-doctor-migrations-BuGkvNDu.mjs";
import { n as listMessageReceiptPlatformIds, t as createMessageReceiptFromOutboundResults } from "./receipt-C1maBxgO.mjs";
import { t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-Dv3ATZ34.mjs";
import { n as chunkByParagraph, s as resolveChunkMode } from "./chunk-qrwWkfC7.mjs";
import { d as createChannelPartialDeliveryError, f as isChannelPartialDeliveryError } from "./live-BuMDR3AO.mjs";
import { n as makeProxyFetch } from "./proxy-fetch-jG_wX5MX.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { D as normalizeTelegramApiRoot, S as isTelegramServerError, T as extractTelegramApiMethod, a as bindTelegramRequestAuthority, b as isTelegramMisdirectedRequestError, c as withoutTelegramRequestAuthority, d as isRecoverableTelegramNetworkError, h as isTelegramBadRequestError, i as assertTelegramRequestAuthority, l as TelegramRequestNotStartedError, n as resolveTelegramTransport, o as findTelegramRequestAuthorityError, p as isSafeToRetrySendError, s as getTelegramRequestAuthority, v as isTelegramMessageHasNoTextError, w as rethrowTelegramSendError, y as isTelegramMessageNotModifiedError } from "./fetch-ZC4IpYLZ.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { r as createChannelApiRetryRunner } from "./retry-runtime-CUY_Gz8_.mjs";
import { r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-D840jY2y.mjs";
import "./routing-Dl7FngGa.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import { n as recordChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { t as isVoiceMessageCompatibleAudio } from "./audio-B2mysANN.mjs";
import { n as normalizePollInput } from "./polls-C-v11_tu.mjs";
import { n as withTempWorkspace } from "./fs-safe-compat-Cbx7s6au.mjs";
import "./session-store-paths-BdzlbB7M.mjs";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-Dm1sl1ov.mjs";
import "./config-mutation-Cj-vvWms.mjs";
import { a as loadCronStore, l as resolveCronStorePathAsync, p as saveCronStore } from "./store-HF7PvtRl.mjs";
import "./cron-store-runtime-Cuh7wm5I.mjs";
import "./reply-reference-DIbR84kt.mjs";
import "./reply-chunking-CEuIv6kT.mjs";
import "./channel-inbound-C0d69q8b.mjs";
import "./web-media-CgTCNYnE.mjs";
import "./concurrency-runtime-Eh-iOyQU.mjs";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "./runtime-group-policy-DDYKOiKE.mjs";
import "./runtime-group-policy-Hf4UYzit.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import "./media-runtime-CmxLZuo1.mjs";
import "./media-mime-CvBp3WXh.mjs";
import "./temp-path-D_RJiwsA.mjs";
import "./logging-core-CsXmxYo2.mjs";
import "./allow-from-0x-NWkHs.mjs";
import { a as DEFAULT_EMOJIS } from "./channel-feedback-B1FKLQG7.mjs";
import { i as resolveTelegramAccount } from "./accounts-CHcpIFN8.mjs";
import { A as markdownToTelegramHtml, D as splitTelegramCaption, E as resolveTelegramPlainCaption, F as escapeTelegramHtml, G as resolveTelegramTableMode, J as runAuthorizedTelegramRequest, K as getOrCreateAccountThrottler, M as renderTelegramHtmlText, N as splitTelegramHtmlChunks, O as telegramCaptionDeliveryMetadata, P as telegramHtmlToPlainTextFallback, R as telegramMessagingTargetsMatch, U as resolveTelegramScopedGroupConfig, W as resolveTelegramRichMessages, a as buildTelegramRichMarkdownPlan, c as toTelegramRichMessageContextParams, d as isTelegramEmptyContentError, f as isTelegramHtmlParseError, h as withTelegramPlainFallback, i as buildTelegramRichBlocksPlan, k as markdownToTelegramChunks, m as warnTelegramRichBlocksDegradations, n as resolveTelegramTextChunkLimit, o as removeTelegramRichNativeQuoteParam, p as splitTelegramPlainTextChunks, s as splitTelegramRichMessageTextChunks, u as splitTelegramRichBlocks, w as buildInlineKeyboard, y as parseTelegramPromptContextProjection, z as resolveTelegramAccountOwnerAgentId } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { r as resolveTelegramBotUserIdFromToken } from "./token-fingerprint-JUmcbHLp.mjs";
import { n as getTelegramRuntime, t as getOptionalTelegramRuntime } from "./runtime-DafGL1dY.mjs";
import { i as hasRejectedTelegramTopic, l as parseTelegramTarget, o as normalizeTelegramChatId, r as TELEGRAM_INVALID_TOPIC_ID_MESSAGE, s as normalizeTelegramLookupTarget } from "./topic-conversation-S0gZB4iY.mjs";
import { D as getTelegramTextParts, F as resolveTelegramPrimaryMedia, I as resolveTelegramRichMessageBody, N as normalizeForwardedContext, P as resolveTelegramNonTextBody, T as buildSenderName, c as buildTelegramThreadParams, l as buildTypingThreadParams, v as resolveTelegramMessageForumFlagHint, y as resolveTelegramMessageThreadSpec } from "./helpers-amKpwD-6.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { createHash } from "node:crypto";
import { Bot, GrammyError, HttpError, InputFile } from "grammy";
//#region extensions/telegram/src/group-access.ts
const evaluateTelegramGroupBaseAccess = (params) => {
	if (params.groupConfig?.enabled === false) return {
		allowed: false,
		reason: "group-disabled"
	};
	if (params.topicConfig?.enabled === false) return {
		allowed: false,
		reason: "topic-disabled"
	};
	if (params.enforceAllowOverride && params.hasGroupAllowOverride && (!params.effectiveGroupAllow.hasEntries || params.requireSenderForAllowOverride && !params.senderId || !isSenderIdAllowed(params.effectiveGroupAllow, params.senderId ?? "", true))) return {
		allowed: false,
		reason: "group-override-unauthorized"
	};
	return { allowed: true };
};
const resolveTelegramRuntimeGroupPolicy = resolveOpenProviderRuntimeGroupPolicy;
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
	if (!params.isGroup) return {
		allowed: true,
		groupPolicy
	};
	if (groupPolicy === "disabled") return {
		allowed: false,
		reason: "group-policy-disabled",
		groupPolicy
	};
	const groupAllowlist = params.resolveGroupPolicy(params.chatId, params.cfg);
	if (groupAllowlist.allowlistEnabled && !groupAllowlist.allowed) return {
		allowed: false,
		reason: "group-chat-not-allowed",
		groupPolicy
	};
	const chatExplicitlyAllowed = groupAllowlist.allowlistEnabled && Boolean(groupAllowlist.groupConfig);
	if (groupPolicy === "allowlist" && params.enforceAllowlistAuthorization) {
		const senderId = params.senderId ?? "";
		const allowlistConfigured = chatExplicitlyAllowed || params.allowEmptyAllowlistEntries || params.effectiveGroupAllow.hasEntries;
		const allowlistMatched = chatExplicitlyAllowed && !params.effectiveGroupAllow.hasEntries || isSenderIdAllowed(params.effectiveGroupAllow, senderId, true);
		if (!senderId) return {
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
//#region extensions/telegram/src/client-fetch.ts
function asTelegramClientFetch(fetchImpl) {
	return fetchImpl;
}
function isTelegramAbortSignalLike(value) {
	return typeof value === "object" && value !== null && "aborted" in value && typeof value.aborted === "boolean" && typeof value.addEventListener === "function" && typeof value.removeEventListener === "function";
}
const TELEGRAM_TIMEOUT_FALLBACK_METHODS = /* @__PURE__ */ new Set([
	"deletemycommands",
	"deletewebhook",
	"getme",
	"sendchataction",
	"setmycommands",
	"setwebhook"
]);
function createTelegramClientFetch(params) {
	const callFetch = params.fetchImpl;
	const isRawSourceFetch = params.transport?.sourceFetch !== void 0 && params.fetchImpl === asTelegramClientFetch(params.transport.sourceFetch);
	return async (input, init) => {
		const effect = captureEffectAuthority();
		const assertCurrent = getTelegramRequestAuthority(init);
		const method = extractTelegramApiMethod(input);
		const requestTimeoutMs = resolveTelegramRequestTimeoutMs(method, params.timeoutSeconds);
		const shutdownSignal = isTelegramAbortSignalLike(params.shutdownSignal) ? params.shutdownSignal : void 0;
		const requestSignal = isTelegramAbortSignalLike(init?.signal) ? init.signal : void 0;
		const canForceTransportFallback = (reason) => !shutdownSignal?.aborted && !requestSignal?.aborted && params.transport?.forceFallback?.(reason) === true;
		const runFetch = async (allowMisdirectedFallback = false) => {
			assertTelegramRequestAuthority(assertCurrent);
			const controller = new AbortController();
			let requestTimeout;
			const timeoutError = requestTimeoutMs !== void 0 ? Object.assign(/* @__PURE__ */ new Error(`Telegram ${method} timed out after ${requestTimeoutMs}ms`), { code: "ETIMEDOUT" }) : void 0;
			const abortListeners = [shutdownSignal, requestSignal].flatMap((signal) => {
				if (!signal) return [];
				const abort = () => controller.abort(signal.reason);
				if (signal.aborted) abort();
				else signal.addEventListener("abort", abort, { once: true });
				return [{
					signal,
					abort
				}];
			});
			if (requestTimeoutMs && timeoutError) {
				requestTimeout = setTimeout(() => {
					controller.abort(timeoutError);
				}, requestTimeoutMs);
				requestTimeout.unref?.();
			}
			const releaseRequest = async () => {
				if (requestTimeout) clearTimeout(requestTimeout);
				for (const { signal, abort } of abortListeners) signal.removeEventListener("abort", abort);
			};
			try {
				const request = () => {
					assertTelegramRequestAuthority(assertCurrent);
					controller.signal.throwIfAborted();
					return callFetch(input, {
						...isRawSourceFetch ? withoutTelegramRequestAuthority(init) : init,
						signal: controller.signal
					});
				};
				const response = await (isRawSourceFetch ? effect.initiate(request) : request());
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
				if (timeoutError && controller.signal.reason === timeoutError && !findTelegramRequestAuthorityError(err)) throw timeoutError;
				throw err;
			}
		};
		try {
			return await runFetch(true);
		} catch (err) {
			if (findTelegramRequestAuthorityError(err)) throw err;
			if (requestTimeoutMs && method !== null && TELEGRAM_TIMEOUT_FALLBACK_METHODS.has(method) && canForceTransportFallback("request-timeout") || isTelegramMisdirectedRequestError(err) && canForceTransportFallback("misdirected-request")) return await runFetch();
			throw err;
		}
	};
}
//#endregion
//#region extensions/telegram/src/reply-parameters.ts
const sendLogger$1 = createSubsystemLogger("telegram/send");
const QUOTE_PARAM_RE = /\bquote not found\b|\bQUOTE_TEXT_INVALID\b|\bquote text invalid\b/i;
function resolveTelegramSendThreadSpec(params) {
	if (params.targetDirectMessagesTopicId != null) return {
		id: params.targetDirectMessagesTopicId,
		scope: "direct-messages"
	};
	const messageThreadId = params.messageThreadId ?? params.targetMessageThreadId;
	if (messageThreadId == null) return;
	const topicId = parseStrictPositiveInteger(messageThreadId);
	if (topicId === void 0) throw new Error(TELEGRAM_INVALID_TOPIC_ID_MESSAGE);
	return {
		id: topicId,
		scope: params.chatType === "direct" ? "dm" : "forum"
	};
}
function buildTelegramThreadReplyParams(opts) {
	const params = { ...buildTelegramThreadParams(opts?.thread) };
	const replyToMessageId = parseStrictInteger(opts?.replyToMessageId);
	if (replyToMessageId == null) return params;
	const defaultQuoteMessageId = opts?.useReplyIdAsQuoteSource === true ? replyToMessageId : void 0;
	const replyQuoteTextRaw = parseStrictInteger(opts?.replyQuoteMessageId ?? defaultQuoteMessageId) === replyToMessageId ? opts?.replyQuoteText : void 0;
	const replyQuoteText = replyQuoteTextRaw?.trim() ? replyQuoteTextRaw : void 0;
	if (!replyQuoteText && !opts?.nativeReply) {
		params.reply_to_message_id = replyToMessageId;
		params.allow_sending_without_reply = true;
		return params;
	}
	const replyParameters = {
		message_id: replyToMessageId,
		...opts?.nativeReply ? { allow_sending_without_reply: true } : {},
		...replyQuoteText ? { quote: replyQuoteText } : {},
		allow_sending_without_reply: true
	};
	if (replyQuoteText) {
		if (typeof opts?.replyQuotePosition === "number" && Number.isFinite(opts.replyQuotePosition)) replyParameters.quote_position = Math.trunc(opts.replyQuotePosition);
		if (Array.isArray(opts?.replyQuoteEntities) && opts.replyQuoteEntities.length > 0) replyParameters.quote_entities = opts.replyQuoteEntities;
	}
	return {
		...params,
		reply_parameters: replyParameters
	};
}
function buildTelegramSendParams(opts) {
	return {
		...buildTelegramThreadReplyParams(opts),
		...opts?.silent === true ? { disable_notification: true } : {}
	};
}
function getTelegramNativeQuoteReplyMessageId(params) {
	const replyParameters = params?.reply_parameters;
	if (!replyParameters || typeof replyParameters !== "object") return;
	const messageId = replyParameters.message_id;
	return asFiniteNumber(messageId);
}
function isTelegramQuoteParamError(err) {
	return QUOTE_PARAM_RE.test(err instanceof GrammyError ? err.description : formatErrorMessage(err));
}
function removeTelegramNativeQuoteParam(params) {
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
		sendLogger$1.warn(`telegram ${params.label} native quote rejected, retrying with legacy reply_to_message_id: ${formatErrorMessage(err)}`);
		const acceptedParams = (params.removeNativeQuoteParam ?? removeTelegramNativeQuoteParam)(params.requestParams);
		return {
			result: await params.request(acceptedParams, `${params.label}-legacy-reply`),
			acceptedParams
		};
	}
}
//#endregion
//#region extensions/telegram/src/target-writeback.ts
const writebackLogger = createSubsystemLogger("telegram/target-writeback");
const TELEGRAM_ADMIN_SCOPE = "operator.admin";
function rewriteTargetIfMatch(params) {
	if (typeof params.rawValue !== "string" && typeof params.rawValue !== "number") return null;
	const value = String(params.rawValue).trim();
	if (!value || !telegramMessagingTargetsMatch(value, params.sourceTarget)) return null;
	return params.resolvedTarget;
}
function replaceTelegramDefaultToTargets(params) {
	let changed = false;
	const telegram = asNullableRecord(params.cfg.channels?.telegram);
	if (!telegram) return changed;
	const maybeReplace = (holder) => {
		const nextTarget = rewriteTargetIfMatch({
			rawValue: holder.defaultTo,
			sourceTarget: params.sourceTarget,
			resolvedTarget: params.resolvedTarget
		});
		if (!nextTarget) return;
		holder.defaultTo = nextTarget;
		changed = true;
	};
	maybeReplace(telegram);
	for (const value of Object.values(asNullableRecord(telegram.accounts) ?? {})) {
		const account = asNullableRecord(value);
		if (account) maybeReplace(account);
	}
	return changed;
}
async function maybePersistResolvedTelegramTarget(params) {
	const raw = params.rawTarget.trim();
	if (!raw) return;
	const resolvedChatId = params.resolvedChatId;
	const parsed = parseTelegramTarget(raw);
	if (normalizeTelegramChatId(parsed.chatId) || !normalizeTelegramLookupTarget(parsed.chatId)) return;
	const sourceTarget = raw;
	const resolvedTarget = parsed.directMessagesTopicId != null ? `${resolvedChatId}:direct-topic:${parsed.directMessagesTopicId}` : parsed.messageThreadId == null ? resolvedChatId : raw.includes(":topic:") ? `${resolvedChatId}:topic:${parsed.messageThreadId}` : `${resolvedChatId}:${parsed.messageThreadId}`;
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
		const storePath = await resolveCronStorePathAsync();
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
		`operation=${params.operation}`,
		params.deliveryKind && `deliveryKind=${params.deliveryKind}`,
		typeof params.messageThreadId === "number" && `threadId=${params.messageThreadId}`,
		typeof params.replyToMessageId === "number" && `replyToMessageId=${params.replyToMessageId}`,
		params.silent === true && "silent=true",
		typeof params.chunkCount === "number" && `chunkCount=${params.chunkCount}`
	];
	sendLogger.info(parts.filter(Boolean).join(" "));
}
function resolveAcceptedReplyToMessageId(params) {
	return params && "reply_to_message_id" in params ? params.reply_to_message_id : params?.reply_parameters?.message_id;
}
function toAcceptedThreadScopedParams(params) {
	if (!params) return;
	const scoped = {};
	for (const key of ["message_thread_id", "reply_to_message_id"]) {
		const value = params[key];
		if (typeof value === "number" && Number.isFinite(value)) scoped[key] = value;
	}
	const messageId = getTelegramNativeQuoteReplyMessageId(params);
	if (messageId !== void 0) scoped.reply_parameters = { message_id: messageId };
	return Object.keys(scoped).length > 0 ? scoped : void 0;
}
const MESSAGE_DELETE_NOOP_RE = /message to delete not found|message can't be deleted|MESSAGE_ID_INVALID|MESSAGE_DELETE_FORBIDDEN/i;
const CHAT_NOT_FOUND_RE = /400: Bad Request: chat not found/i;
const sendLogger = createSubsystemLogger("telegram/send");
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
function closeCachedTelegramClientOptions(entry) {
	entry.transport.close().catch((err) => {
		diagLogger.warn(`telegram client options cache transport close failed: ${redactSensitiveText(formatUncaughtError(err))}`);
	});
}
function resolveTelegramClientOptions(account) {
	const proxyKey = account.config.proxy?.trim() ?? "";
	const autoSelectFamily = account.config.network?.autoSelectFamily;
	const autoSelectFamilyKey = typeof autoSelectFamily === "boolean" ? String(autoSelectFamily) : "default";
	const dnsResultOrderKey = account.config.network?.dnsResultOrder ?? "default";
	const apiRootKey = account.config.apiRoot?.trim() ?? "";
	const cacheKey = `${account.accountId}::${proxyKey}::${autoSelectFamilyKey}::${dnsResultOrderKey}::${apiRootKey}`;
	const cached = telegramClientOptionsCache.get(cacheKey);
	if (cached) return cached;
	const normalizedApiRoot = apiRootKey ? normalizeTelegramApiRoot(apiRootKey) : void 0;
	const proxyFetch = proxyKey ? makeProxyFetch(proxyKey) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: account.config.network });
	const entry = {
		clientOptions: {
			fetch: asTelegramClientFetch(createTelegramClientFetch({
				fetchImpl: asTelegramClientFetch(transport.fetch),
				transport
			})),
			...normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}
		},
		transport
	};
	telegramClientOptionsCache.set(cacheKey, entry);
	if (telegramClientOptionsCache.size > MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE) for (const [oldestKey, evictedEntry] of telegramClientOptionsCache) {
		telegramClientOptionsCache.delete(oldestKey);
		closeCachedTelegramClientOptions(evictedEntry);
		break;
	}
	return entry;
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
	if (!lookupTarget || typeof getChat !== "function") throw new Error(hasRejectedTelegramTopic(to) ? TELEGRAM_INVALID_TOPIC_ID_MESSAGE : "Telegram recipient must be a numeric chat ID");
	try {
		const chat = await getChat.call(params.api, lookupTarget);
		const resolved = normalizeTelegramChatId(String(chat?.id ?? ""));
		if (!resolved) throw new Error(`resolved chat id is not numeric (${String(chat?.id ?? "")})`);
		if (params.verbose) sendLogger.warn(`telegram recipient ${lookupTarget} resolved to numeric chat id ${resolved}`);
		return resolved;
	} catch (err) {
		const detail = formatErrorMessage(err);
		throw new Error(`Telegram recipient ${lookupTarget} could not be resolved to a numeric chat ID (${detail})`, { cause: err });
	}
}
async function resolveAndPersistChatId(context, params) {
	const chatId = await resolveChatId(params.lookupTarget, {
		api: context.api,
		verbose: params.verbose
	});
	await maybePersistResolvedTelegramTarget({
		cfg: context.cfg,
		rawTarget: params.persistTarget,
		resolvedChatId: chatId,
		verbose: params.verbose,
		gatewayClientScopes: params.gatewayClientScopes,
		...params.gatewayClientScopes === void 0 ? { trustedInternalWriteback: true } : {}
	});
	return chatId;
}
function normalizeMessageId(raw) {
	const parsed = typeof raw === "string" ? parseStrictInteger(raw) : raw;
	if (typeof parsed === "number" && Number.isFinite(parsed)) return Math.trunc(parsed);
	throw new Error("Message id is required for Telegram actions");
}
function isTelegramMessageDeleteNoopError(err) {
	return MESSAGE_DELETE_NOOP_RE.test(formatErrorMessage(err));
}
async function withTelegramApiContext(opts, operation) {
	const cfg = requireRuntimeConfig(opts.cfg, "Telegram API context");
	const account = resolveTelegramAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = resolveToken(opts.token, account);
	let ownerAgentId;
	try {
		ownerAgentId = resolveTelegramAccountOwnerAgentId({
			cfg,
			accountId: account.accountId
		});
	} catch (error) {
		throw new PlatformMessageNotDispatchedError(formatErrorMessage(error), {
			cause: error,
			retryable: false
		});
	}
	let api;
	if (opts.api) api = opts.api;
	else {
		const client = resolveTelegramClientOptions(account);
		const fetch = client.clientOptions.fetch;
		const clientOptions = opts.assertPlatformSendAuthorized ? {
			...client.clientOptions,
			fetch: bindTelegramRequestAuthority(fetch, opts.assertPlatformSendAuthorized)
		} : client.clientOptions;
		const bot = new Bot(token, { client: clientOptions });
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
	const context = {
		cfg,
		account,
		ownerAgentId,
		api
	};
	const assertCurrent = opts.assertPlatformSendAuthorized ? () => {
		opts.signal?.throwIfAborted();
		opts.assertPlatformSendAuthorized?.();
	} : void 0;
	return await runAuthorizedTelegramRequest(assertCurrent, () => operation(context));
}
function createTelegramRequestWithDiag(params) {
	const request = createChannelApiRetryRunner({
		retry: params.retry,
		verbose: params.verbose,
		...params.shouldRetry ? { shouldRetry: params.shouldRetry } : {},
		...params.strictShouldRetry ? { strictShouldRetry: true } : {}
	});
	const logHttpError = createTelegramHttpLogger(params.cfg);
	return (fn, label, options) => {
		const runRequest = () => request(fn, label);
		return (params.useApiErrorLogging === false ? runRequest() : withTelegramApiErrorLogging({
			operation: label,
			fn: runRequest,
			...options?.shouldLog ? { shouldLog: options.shouldLog } : {}
		})).catch((err) => {
			logHttpError(label, err);
			throw err;
		});
	};
}
function wrapTelegramChatNotFoundError(err, params) {
	const errorMsg = formatErrorMessage(err);
	if (/403.*(bot.*not.*member|bot.*blocked|bot.*kicked)/i.test(errorMsg)) return new Error([
		`Telegram send failed: bot is not a member of the chat, was blocked, or was kicked (chat_id=${params.chatId}).`,
		`Telegram API said: ${errorMsg}.`,
		"Fix: Add the bot to the channel/group, or check that it has not been removed/blocked/kicked by the user.",
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
		throw wrapTelegramChatNotFoundError(err, params);
	});
}
function createTelegramNonIdempotentRequestWithDiag(params) {
	const request = createTelegramRequestWithDiag({
		...params,
		shouldRetry: isSafeToRetrySendError,
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
//#region node_modules/.pnpm/abort-controller@3.0.0/node_modules/abort-controller/dist/abort-controller.js
/**
* @author Toru Nagashima <https://github.com/mysticatea>
* See LICENSE file in root directory for full license.
*/
var require_abort_controller = /* @__PURE__ */ __commonJSMin(((exports, module) => {
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
}));
//#endregion
//#region extensions/telegram/src/group-history-window.ts
var import_abort_controller = require_abort_controller();
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
	const { timestamp } = entry;
	const { timestampMs } = watermark;
	const hasTimestamps = timestamp !== void 0 && timestampMs !== void 0;
	if (hasTimestamps && timestamp !== timestampMs) return timestamp > timestampMs;
	const entryMessageId = numericMessageId(entry.messageId);
	const watermarkMessageId = numericMessageId(watermark.messageId);
	if (entryMessageId !== void 0 && watermarkMessageId !== void 0) return entryMessageId > watermarkMessageId;
	return !hasTimestamps && entry.messageId !== watermark.messageId;
}
function telegramPromptMessages(payload) {
	return Array.isArray(payload?.["messages"]) ? payload["messages"].filter(isRecord) : [];
}
function isTelegramChatWindowPromptContext(entry) {
	return entry.source === "telegram" && entry.type === "chat_window";
}
function telegramPromptContextHistory(promptContext) {
	return promptContext.flatMap((entry) => isTelegramChatWindowPromptContext(entry) ? telegramPromptMessages(asOptionalRecord(entry.payload)).flatMap((message) => typeof message["body"] === "string" && typeof message["sender"] === "string" ? [{
		sender: message["sender"],
		body: message["body"],
		...typeof message["message_id"] === "string" ? { messageId: message["message_id"] } : {},
		...typeof message["timestamp_ms"] === "number" ? { timestamp: message["timestamp_ms"] } : {}
	}] : []) : []);
}
function selectTelegramGroupPromptContext(params) {
	return params.promptContext.flatMap((entry) => {
		if (!isTelegramChatWindowPromptContext(entry)) return [entry];
		const payload = asOptionalRecord(entry.payload);
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
//#region extensions/telegram/src/message-cache-persistence.ts
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES = 3e3;
const TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE = "telegram.message-cache";
const TELEGRAM_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"audio",
	"document",
	"image",
	"sticker",
	"video"
]);
function isTelegramMediaKind(value) {
	return typeof value === "string" && TELEGRAM_MEDIA_KINDS.has(value);
}
function parseStickerMetadata(value) {
	if (!isRecord(value)) return;
	const metadata = {};
	for (const key of [
		"emoji",
		"setName",
		"fileId",
		"fileUniqueId",
		"cachedDescription"
	]) {
		const field = value[key];
		if (typeof field === "string") metadata[key] = field;
	}
	return metadata;
}
function parseTelegramResolvedMedia(value) {
	if (!isRecord(value) || typeof value.id !== "string" || !value.id || value.id.includes("/") || value.id.includes("\\") || value.id.includes("\0") || typeof value.fileUniqueId !== "string" || !value.fileUniqueId || typeof value.size !== "number" || !Number.isFinite(value.size) || value.size < 0 || typeof value.savedAt !== "number" || !Number.isFinite(value.savedAt) || !isTelegramMediaKind(value.kind)) return;
	const stickerMetadata = parseStickerMetadata(value.stickerMetadata);
	return {
		id: value.id,
		fileUniqueId: value.fileUniqueId,
		size: value.size,
		savedAt: value.savedAt,
		kind: value.kind,
		...typeof value.contentType === "string" ? { contentType: value.contentType } : {},
		...stickerMetadata ? { stickerMetadata } : {}
	};
}
function resolveTelegramMessageCacheScope(storePath) {
	return `${storePath}.telegram-messages.json`;
}
function resolveTelegramMessageCachePersistentScopeKey(scope) {
	return createHash("sha256").update(scope).digest("hex").slice(0, 24);
}
function isTelegramMessageCacheSourceMessage(value) {
	return isRecord(value) && typeof value.message_id === "number" && Number.isFinite(value.message_id) && typeof value.date === "number" && Number.isFinite(value.date);
}
//#endregion
//#region extensions/telegram/src/message-cache-codec.ts
function retainedMessageId(messageId) {
	const id = parseStrictPositiveInteger(messageId);
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
function resolveMessageTimestamp(msg) {
	return asFiniteNumber(msg.openclaw_prompt_context_timestamp_ms) ?? (msg.date ? msg.date * 1e3 : void 0);
}
function normalizeMessageNode(msg, params) {
	const media = resolveTelegramPrimaryMedia(msg);
	const fileId = media?.fileRef.file_id;
	const forwardedFrom = normalizeForwardedContext(msg);
	const replyMessage = resolveReplyMessage(msg);
	const preserveWhitespace = params.promptContextProjectionMarker !== void 0;
	const text = getTelegramTextParts(msg).text;
	let body;
	if (text.trim()) body = preserveWhitespace ? text : text.trim();
	else {
		const nonText = resolveTelegramNonTextBody(msg);
		body = nonText ? nonText.text : resolveTelegramRichMessageBody(msg);
	}
	const threadBinding = normalizeTelegramMessageThreadBinding(params.threadBinding);
	const threadId = threadBinding?.threadSpec.scope === "none" ? void 0 : parseStrictNonNegativeInteger(threadBinding?.threadSpec.id ?? params.threadId);
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
	const id = parseStrictNonNegativeInteger(threadSpec.id);
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
	const normalizedThreadId = parseStrictNonNegativeInteger(threadId);
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
		const embeddedThreadId = parseStrictNonNegativeInteger(message.message_thread_id);
		const inheritedThread = parseStrictNonNegativeInteger(options.threadId);
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
			threadId: node.threadBinding?.threadSpec.scope === "none" ? void 0 : parseStrictNonNegativeInteger(node.threadId) ?? options.threadId,
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
function parsePersistedCacheValue(key, value) {
	if (!isRecord(value) || value.version !== 1) return [];
	const separatorIndex = key.lastIndexOf(":");
	if (separatorIndex === -1 || !isTelegramMessageCacheSourceMessage(value.sourceMessage)) return [];
	const threadId = parseStrictNonNegativeInteger(value.threadId);
	const botUserId = parseStrictPositiveInteger(value.botUserId);
	const promptContextProjectionMarker = isTelegramMessageFromCurrentBot(value.sourceMessage, botUserId) ? parseTelegramPromptContextProjection(value.promptContextProjection) : void 0;
	const threadBinding = normalizeTelegramMessageThreadBinding(value.threadBinding);
	const resolvedMedia = parseTelegramResolvedMedia(value.resolvedMedia);
	return normalizeMessageNodes(value.sourceMessage, {
		threadId,
		promptContextProjectionMarker,
		threadBinding,
		resolvedMedia,
		historyEligible: value.historyEligible === true
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
	const preferred = preferExisting ? existing : incoming;
	const other = preferExisting ? incoming : existing;
	const mergedSourceMessage = mergeTelegramSourceMessage(preferred.sourceMessage, other.sourceMessage);
	const syntheticOutboundFrom = existing.senderId === "0" && incoming.sourceMessage.sender_chat ? existing.sourceMessage.from : void 0;
	const sourceMessage = syntheticOutboundFrom ? {
		...mergedSourceMessage,
		from: syntheticOutboundFrom
	} : mergedSourceMessage;
	const promptContextProjectionMarker = preferred.promptContextProjectionMarker ?? other.promptContextProjectionMarker;
	const threadBinding = normalizeTelegramMessageThreadBinding(preferred.threadBinding) ?? normalizeTelegramMessageThreadBinding(other.threadBinding);
	const threadId = threadBinding?.threadSpec.scope === "none" ? void 0 : parseStrictNonNegativeInteger(threadBinding?.threadSpec.id ?? preferred.threadId ?? other.threadId);
	const primaryMediaId = resolveTelegramPrimaryMedia(sourceMessage)?.fileRef.file_unique_id;
	return normalizeMessageNode(sourceMessage, {
		threadId,
		promptContextProjectionMarker,
		threadBinding,
		resolvedMedia: [preferred.resolvedMedia, other.resolvedMedia].find((media) => media?.fileUniqueId === primaryMediaId),
		historyEligible: existing.historyEligible || incoming.historyEligible
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
	const leftId = parseStrictPositiveInteger(left.messageId);
	const rightId = parseStrictPositiveInteger(right.messageId);
	if (leftId !== void 0 && rightId !== void 0) return leftId - rightId;
	return (left.messageId ?? "").localeCompare(right.messageId ?? "");
}
//#endregion
//#region extensions/telegram/src/message-cache.ts
const DEFAULT_MAX_MESSAGES = 5e3;
const PERSISTENT_BUCKET_KEY = `plugin-state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`;
const TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY = Symbol.for("openclaw.telegram.messageCacheBuckets");
const RETAINED_MESSAGE_PAGE_SIZE = 256;
const RETAINED_PROMOTION_BATCH_SIZE = 1e4;
function parseHistoryCursor(cursor) {
	const id = parseStrictPositiveInteger(cursor);
	if (cursor !== void 0 && (id === void 0 || !retainedMessageId(cursor))) throw new Error("Telegram history cursors must be native message IDs");
	return id;
}
function telegramMessageCacheKeyPrefix(params) {
	const prefix = `${params.accountId}:${params.chatId}:`;
	return params.scopeKey ? `${params.scopeKey}:${prefix}` : prefix;
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
		hydratePromise: Promise.resolve()
	};
	const persistedMessageCacheBuckets = resolveGlobalMap(TELEGRAM_MESSAGE_CACHE_BUCKETS_KEY);
	const existing = persistedMessageCacheBuckets.get(bucketKey);
	if (existing) {
		existing.persistentStore = params.persistentStore ?? existing.persistentStore;
		return existing;
	}
	const bucket = {
		messages: /* @__PURE__ */ new Map(),
		...params.persistentStore ? { persistentStore: params.persistentStore } : {}
	};
	persistedMessageCacheBuckets.set(bucketKey, bucket);
	return bucket;
}
function hydrateMessageCacheBucket(bucket, maxMessages, scopeKey, excludeGroups = false) {
	bucket.hydratePromise ??= (async () => {
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
				pruneMapToMaxSize(bucket.messages, maxMessages);
			}
		}
	})().catch((error) => {
		bucket.hydratePromise = void 0;
		throw error;
	});
	return bucket.hydratePromise;
}
async function updateRetainedCacheNode(params) {
	let observation = await params.store.observe(params.key);
	let sawExisting = observation.value !== void 0;
	for (;;) {
		const existing = parseRetainedCacheNode(params.key, observation.value);
		const node = params.update(existing, sawExisting);
		if (!node) return null;
		sawExisting ||= existing !== null;
		const result = await params.store.compareAndApply(params.key, observation.comparison, {
			operation: "update",
			action: "set",
			value: persistedCacheNode(node, params.botUserId ?? observation.value?.botUserId)
		});
		if (result.status !== "conflict") return node;
		observation = result.current;
	}
}
function createTelegramMessageCache(params) {
	const runtime = getOptionalTelegramRuntime();
	const hasRetainedStore = runtime != null;
	const persistentStore = resolveDefaultPersistentStore();
	const maxMessages = params?.maxMessages ?? (persistentStore ? 3e3 : DEFAULT_MAX_MESSAGES);
	const scopeKey = persistentStore || hasRetainedStore ? resolveTelegramMessageCachePersistentScopeKey(params?.scope ?? "default") : void 0;
	const bucket = resolveMessageCacheBucket({
		bucketKey: persistentStore || hasRetainedStore ? `${PERSISTENT_BUCKET_KEY}:${scopeKey}` : void 0,
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
	const persistCachedNode = async (options) => {
		const store = bucket.persistentStore;
		if (!store) return;
		try {
			if (hasRetainedStore && !bucket.promoted) await openRetainedStore();
			await store.register(options.key, persistedCacheNode(options.node, options.botUserId));
		} catch (error) {
			logVerbose(`telegram: failed to persist message cache: ${String(error)}`);
			const marker = options.node.promptContextProjectionMarker;
			if (marker) {
				options.node.promptContextProjectionMarker = {
					kind: "invalid",
					transcriptMessageId: marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId
				};
				throw error;
			}
		}
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
			const key = `${telegramMessageCacheKeyPrefix({
				scopeKey,
				accountId,
				chatId
			})}${id}`;
			return parseRetainedCacheNode(key, await store.lookup(key));
		}
		const key = `${telegramMessageCacheKeyPrefix({
			scopeKey,
			accountId,
			chatId
		})}${messageId}`;
		const entry = messages.get(key);
		if (!entry) return null;
		messages.delete(key);
		messages.set(key, entry);
		return entry;
	};
	const readNodes = async (options) => {
		if (!Number.isSafeInteger(options.limit) || options.limit <= 0) return [];
		const normalizedThreadId = parseStrictNonNegativeInteger(options.threadId);
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
			const id = parseStrictPositiveInteger(node.messageId);
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
			const keyPrefix = telegramMessageCacheKeyPrefix({
				scopeKey,
				accountId,
				chatId
			});
			let recordedEntry = currentObservation.node;
			for (const { node, mode } of observations) {
				const { messageId } = node;
				const id = store ? retainedMessageId(messageId) ?? "" : messageId;
				if (store && (!id || String(node.sourceMessage.chat?.id) !== String(chatId))) throw new Error("Telegram history requires a native message ID in the owning chat");
				const key = `${keyPrefix}${id}`;
				let cachedNode;
				if (store) {
					cachedNode = await updateRetainedCacheNode({
						store,
						key,
						botUserId,
						update: (existing, sawExisting) => {
							if (mode === "partial" && sawExisting && !existing) return null;
							return existing ? mergeCachedMessageNode(existing, node, mode) : node;
						}
					});
					chatRetention.set(keyPrefix, "retained");
				} else {
					chatRetention.set(keyPrefix, "bounded");
					cachedNode = upsertCachedMessageNode({
						messages,
						key,
						node,
						mode
					});
					pruneMapToMaxSize(messages, maxMessages);
					await persistCachedNode({
						key,
						node: cachedNode,
						botUserId
					});
				}
				if (cachedNode && messageId === currentObservation.node.messageId) recordedEntry = cachedNode;
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
				await updateRetainedCacheNode({
					store: await openRetainedStore(),
					key: `${telegramMessageCacheKeyPrefix({
						scopeKey,
						accountId,
						chatId
					})}${id}`,
					botUserId,
					update: withMedia
				});
				return;
			}
			const key = `${telegramMessageCacheKeyPrefix({
				scopeKey,
				accountId,
				chatId
			})}${messageId}`;
			const node = withMedia(messages.get(key));
			messages.delete(key);
			messages.set(key, node);
			await persistCachedNode({
				key,
				node,
				botUserId
			});
		},
		get,
		recentBefore: async ({ accountId, chatId, messageId, threadId, limit }) => {
			const targetId = parseStrictPositiveInteger(messageId);
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
			const targetId = parseStrictPositiveInteger(messageId);
			if (targetId === void 0) return [];
			const target = await get({
				accountId,
				chatId,
				messageId
			});
			const thread = parseStrictNonNegativeInteger(threadId);
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
			const beforeId = parseHistoryCursor(before);
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
			const beforeId = parseHistoryCursor(before);
			const afterId = parseHistoryCursor(after);
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
async function buildTelegramReplyChain(params) {
	const replyMessage = resolveReplyMessage(params.msg);
	if (!replyMessage?.message_id || String(replyMessage.chat?.id) !== String(params.chatId)) return [];
	const get = (messageId) => params.cache.get({
		accountId: params.accountId,
		chatId: params.chatId,
		messageId
	});
	const maxDepth = params.maxDepth ?? 4;
	const visited = /* @__PURE__ */ new Set();
	const chain = [];
	let current = await get(String(replyMessage.message_id));
	if (!current && params.msg.reply_to_message) current = normalizeMessageNode(params.msg.reply_to_message, { threadId: parseStrictNonNegativeInteger(params.msg.reply_to_message.message_thread_id) ?? parseStrictNonNegativeInteger(params.msg.message_thread_id) });
	while (current?.messageId && chain.length < maxDepth && !visited.has(current.messageId)) {
		visited.add(current.messageId);
		chain.push(current);
		const embeddedReply = current.sourceMessage.reply_to_message;
		if (!current.replyToId || chain.length >= maxDepth || visited.has(current.replyToId) || embeddedReply && String(embeddedReply.chat.id) !== String(params.chatId)) break;
		current = await get(current.replyToId) ?? (embeddedReply && String(embeddedReply.message_id) === current.replyToId ? normalizeMessageNode(embeddedReply, { threadId: parseStrictNonNegativeInteger(embeddedReply.message_thread_id) ?? parseStrictNonNegativeInteger(current.threadId) }) : null);
	}
	return chain;
}
async function buildTelegramConversationContext(params) {
	const selected = /* @__PURE__ */ new Map();
	const replyTargetIds = /* @__PURE__ */ new Set();
	const sessionBoundaryTimestamp = normalizeSessionBoundaryTimestamp(params.minTimestampMs);
	const addNode = (node, replyTarget = false) => {
		if (!node.messageId || node.messageId === params.messageId) return false;
		if (sessionBoundaryTimestamp !== void 0 && typeof node.timestamp === "number" && Number.isFinite(node.timestamp) && !(node.timestamp >= sessionBoundaryTimestamp)) return false;
		const existing = selected.get(node.messageId);
		selected.set(node.messageId, {
			node: existing?.node ?? node,
			isReplyTarget: existing?.isReplyTarget === true || replyTarget ? true : void 0
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
		})) addNode(node, node.messageId === messageId);
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
		const added = addNode(node, index === 0);
		if (added && index === 0 && node.messageId) await addReplyTargetWindow(node.messageId);
		if (added && node.replyToId) replyTargetIds.add(node.replyToId);
	}
	for (const messageId of replyTargetIds) {
		const node = await params.cache.get({
			accountId: params.accountId,
			chatId: params.chatId,
			messageId
		});
		if (node) addNode(node, true);
	}
	return Array.from(selected.values()).toSorted((left, right) => compareCachedMessageNodes(left.node, right.node));
}
//#endregion
//#region extensions/telegram/src/provider-thread-proof.ts
function isTelegramNonForumReplyChain(message) {
	const chatType = message.chat?.type;
	return (chatType === "group" || chatType === "supergroup") && resolveTelegramMessageForumFlagHint({
		chatType,
		isForum: message.chat?.is_forum,
		isTopicMessage: message.is_topic_message
	}) !== true;
}
function resolveTelegramProviderObservedThreadId(params) {
	if (params.successfulSendThread?.scope === "direct-messages") return params.message.direct_messages_topic?.topic_id;
	if (typeof params.message.message_thread_id === "number") {
		if (params.successfulSendThread?.id === void 0 && isTelegramNonForumReplyChain(params.message)) return;
		return params.message.message_thread_id;
	}
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
async function recordOutboundMessageForPromptContext(params) {
	try {
		const providerObservedThread = resolveTelegramProviderObservedThreadSpec({
			message: params.message,
			successfulSendThread: params.successfulSendThread
		});
		const messageThreadId = providerObservedThread?.id ?? params.messageThreadId;
		const chat = params.message.chat ?? {};
		const text = params.message.text ?? params.message.caption ?? params.text;
		const rawSender = params.message.from;
		const stableSender = params.message.sender_chat ? void 0 : rawSender;
		const selfSenderName = buildTelegramSelfSenderName(params.account.name, params.account.bot ?? stableSender);
		const cacheMessage = {
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
			...messageThreadId !== void 0 ? { message_thread_id: messageThreadId } : {}
		};
		await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.ownerAgentId?.trim() || resolveTelegramAccountOwnerAgentId({
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
//#region extensions/telegram/src/sent-message-cache.ts
const TTL_MS = 864e5;
const TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE = "telegram.sent-messages";
const TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES = 1e4;
const CLEANUP_INTERVAL_MS = 36e5;
const TELEGRAM_SENT_MESSAGES_STATE_KEY = Symbol.for("openclaw.telegramSentMessagesState");
function openSentMessageStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES
	});
}
function cleanupExpired(store, scopeKey, entry, now) {
	for (const [id, timestamp] of entry) if (now - timestamp >= TTL_MS) entry.delete(id);
	if (entry.size === 0) store.delete(scopeKey);
}
async function readPersistedSentMessages(scopeKey) {
	const now = Date.now();
	const store = /* @__PURE__ */ new Map();
	try {
		for (const entry of await openSentMessageStore().entries()) {
			if (entry.value.scopeKey !== scopeKey || now - entry.value.timestamp > TTL_MS) continue;
			const messages = store.get(entry.value.chatId) ?? /* @__PURE__ */ new Map();
			store.set(entry.value.chatId, messages);
			messages.set(entry.value.messageId, entry.value.timestamp);
		}
	} catch (error) {
		logVerbose(`telegram: failed to read sent-message cache: ${String(error)}`);
	}
	return store;
}
function resolveSentMessageScopeKey(cfg, owner) {
	const agentId = owner?.agentId?.trim() || (cfg ? resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId: owner?.accountId
	}) : "main");
	const storePath = resolveSessionStorePathCore(cfg?.session?.store, { agentId });
	return createHash("sha256").update(storePath, "utf8").digest("hex").slice(0, 24);
}
function getSentMessageBucket(scopeKey) {
	const state = resolveGlobalSingleton(TELEGRAM_SENT_MESSAGES_STATE_KEY, () => ({ bucketsByScope: /* @__PURE__ */ new Map() }));
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
		await openSentMessageStore().register(createHash("sha256").update(`${scopeKey}\0${chatId}\0${messageId}`, "utf8").digest("hex").slice(0, 32), {
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
	const entry = store.get(scopeKey) ?? /* @__PURE__ */ new Map();
	store.set(scopeKey, entry);
	entry.set(idKey, now);
	if (now >= bucket.nextCleanupAt) {
		for (const [entryScopeKey, messages] of store) cleanupExpired(store, entryScopeKey, messages, now);
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
function withTelegramMessageAction(to, messageIdInput, opts, operation, shouldRetry, writebackAuthority = "caller") {
	return withTelegramApiContext(opts, async (context) => {
		const { cfg } = context;
		const rawTarget = String(to);
		const chatId = await resolveAndPersistChatId(context, {
			lookupTarget: parseTelegramTarget(rawTarget).chatId,
			persistTarget: rawTarget,
			verbose: opts.verbose,
			gatewayClientScopes: writebackAuthority === "internal" ? void 0 : opts.gatewayClientScopes
		});
		const request = createTelegramRequestWithDiag({
			cfg,
			retry: opts.retry,
			verbose: opts.verbose,
			shouldRetry
		});
		return operation({
			...context,
			chatId,
			...messageIdInput !== void 0 ? { messageId: normalizeMessageId(messageIdInput) } : {},
			request
		});
	});
}
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
	const { cfg } = params.context;
	const rawTarget = String(params.to);
	const target = parseTelegramTarget(rawTarget);
	const threadSpec = params.thread ? resolveTelegramSendThreadSpec({
		targetMessageThreadId: target.messageThreadId,
		targetDirectMessagesTopicId: params.thread.directMessagesTopicId ?? target.directMessagesTopicId,
		messageThreadId: params.thread.messageThreadId,
		chatType: target.chatType
	}) : void 0;
	const chatId = await resolveAndPersistChatId(params.context, {
		lookupTarget: target.chatId,
		persistTarget: rawTarget,
		verbose: params.opts.verbose,
		gatewayClientScopes: params.opts.gatewayClientScopes
	});
	const threadParams = buildTelegramThreadReplyParams({
		thread: threadSpec,
		replyToMessageId: params.thread?.replyToMessageId,
		replyQuoteText: params.thread?.replyQuoteText,
		useReplyIdAsQuoteSource: params.thread?.useReplyIdAsQuoteSource
	});
	const requestWithDiag = createTelegramNonIdempotentRequestWithDiag({
		cfg,
		retry: params.opts.retry,
		verbose: params.opts.verbose,
		useApiErrorLogging: params.useApiErrorLogging
	});
	return {
		chatId,
		threadSpec,
		threadParams,
		request: params.wrapChatNotFound === false ? requestWithDiag : createRequestWithChatNotFound({
			requestWithDiag,
			chatId,
			input: rawTarget
		})
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
const STATUS_REACTION_EMOJI_KEYS = Object.keys(TELEGRAM_STATUS_REACTION_VARIANTS);
function resolveTelegramStatusReactionEmojis(params) {
	const { overrides } = params;
	const queuedFallback = normalizeOptionalString(params.initialEmoji) ?? DEFAULT_EMOJIS.queued;
	const emojis = {
		...DEFAULT_EMOJIS,
		queued: queuedFallback
	};
	for (const key of STATUS_REACTION_EMOJI_KEYS) emojis[key] = normalizeOptionalString(overrides?.[key]) ?? emojis[key];
	return emojis;
}
function buildTelegramStatusReactionVariants(emojis) {
	const variantsByRequested = /* @__PURE__ */ new Map();
	for (const key of STATUS_REACTION_EMOJI_KEYS) {
		const requested = normalizeOptionalString(emojis[key]);
		if (!requested) continue;
		const candidates = normalizeUniqueStringEntries([requested, ...TELEGRAM_STATUS_REACTION_VARIANTS[key]]);
		variantsByRequested.set(requested, candidates);
	}
	return variantsByRequested;
}
function resolveTelegramReactionEmoji(emoji) {
	return TELEGRAM_SUPPORTED_REACTION_EMOJIS.get(emoji.trim().replace(/[\uFE0E\uFE0F]/gu, ""));
}
function extractTelegramAllowedReactions(chat) {
	const availableReactions = chat?.available_reactions;
	if (availableReactions == null) return availableReactions;
	if (!Array.isArray(availableReactions)) return [];
	const allowed = /* @__PURE__ */ new Map();
	for (const reaction of availableReactions) {
		if (reaction.type === "custom_emoji") {
			const identifier = normalizeOptionalString(reaction.custom_emoji_id);
			if (identifier) allowed.set(`custom:${identifier}`, {
				type: "custom_emoji",
				custom_emoji_id: identifier
			});
			continue;
		}
		if (reaction.type !== "emoji") continue;
		const emoji = resolveTelegramReactionEmoji(reaction.emoji);
		if (emoji) allowed.set(`emoji:${emoji}`, {
			type: "emoji",
			emoji
		});
	}
	return [...allowed.values()];
}
async function resolveTelegramAllowedReactions(params) {
	const fromMessage = extractTelegramAllowedReactions(params.chat);
	if (fromMessage !== void 0) return fromMessage;
	return params.getChat ? extractTelegramAllowedReactions(await params.getChat(params.chatId)) ?? null : null;
}
function resolveTelegramReactionVariant(params) {
	const requestedEmoji = normalizeOptionalString(params.requestedEmoji);
	if (!requestedEmoji) return;
	const configuredVariants = params.variantsByRequestedEmoji.get(requestedEmoji) ?? [requestedEmoji];
	const variants = normalizeUniqueStringEntries([...configuredVariants, ...TELEGRAM_GENERIC_REACTION_FALLBACKS]);
	for (const candidate of variants) {
		const emoji = resolveTelegramReactionEmoji(candidate);
		if (emoji && (params.allowedEmojiReactions == null || params.allowedEmojiReactions.has(emoji))) return emoji;
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
	const targetThread = resolveTelegramSendThreadSpec({
		messageThreadId: target.messageThreadId,
		chatType: target.chatType
	});
	const optionThread = resolveTelegramSendThreadSpec({
		messageThreadId: opts.messageThreadId,
		chatType: target.chatType
	});
	const threadSpec = targetThread ?? optionThread;
	const apiAbort = opts.signal ? new import_abort_controller.AbortController() : void 0;
	const abort = () => apiAbort?.abort();
	if (opts.signal?.aborted) abort();
	else opts.signal?.addEventListener("abort", abort, { once: true });
	try {
		return await withTelegramMessageAction(to, void 0, opts, async ({ api, chatId, request }) => {
			const threadParams = buildTypingThreadParams(threadSpec?.id);
			const signalArgs = apiAbort ? [apiAbort.signal] : [];
			await request(() => api.sendChatAction(chatId, "typing", threadParams, ...signalArgs), "typing");
			return { ok: true };
		}, (err) => isRecoverableTelegramNetworkError(err, { context: "action" }), "internal");
	} finally {
		opts.signal?.removeEventListener("abort", abort);
	}
}
async function reactMessageTelegram(chatIdInput, messageIdInput, emoji, opts) {
	return withTelegramMessageAction(chatIdInput, messageIdInput, opts, async ({ api, chatId, messageId, request }) => {
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
	}, (err) => isRecoverableTelegramNetworkError(err, { context: "react" }));
}
async function deleteMessageTelegram(chatIdInput, messageIdInput, opts) {
	return withTelegramMessageAction(chatIdInput, messageIdInput, opts, async ({ api, chatId, messageId, request }) => {
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
	}, (err) => isRecoverableTelegramNetworkError(err, { context: "delete" }));
}
async function pinMessageTelegram(chatIdInput, messageIdInput, opts) {
	return withTelegramMessageAction(chatIdInput, messageIdInput, opts, async ({ api, chatId, messageId, request }) => {
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
	return withTelegramMessageAction(chatIdInput, messageIdInput, opts, async ({ api, chatId, messageId, request }) => {
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
//#region extensions/telegram/src/topic-name-cache.ts
const TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES = 2048;
const STORE_NAMESPACE_PREFIX = "telegram.topic-name-cache";
const TOPIC_NAME_CACHE_STATE_KEY = Symbol.for("openclaw.telegramTopicNameCacheState");
const DEFAULT_TOPIC_NAME_CACHE_SCOPE = "default";
function cacheKey(chatId, threadId) {
	return `${chatId}:${threadId}`;
}
function resolveTopicNameCacheNamespace(scope) {
	const hash = createHash("sha256").update(scope).digest("hex").slice(0, 16);
	return `${STORE_NAMESPACE_PREFIX}.${hash}`;
}
function evictOldest(store) {
	if (store.size <= TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES) return;
	let oldestKey;
	let oldestTime = Infinity;
	for (const [key, entry] of store) if (entry.updatedAt < oldestTime) {
		oldestTime = entry.updatedAt;
		oldestKey = key;
	}
	if (oldestKey) store.delete(oldestKey);
	return oldestKey;
}
function isTopicEntry(value) {
	if (!value || typeof value !== "object") return false;
	const entry = value;
	return typeof entry.name === "string" && entry.name.length > 0 && typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt);
}
function getTopicStoreState(scope) {
	const state = resolveGlobalSingleton(TOPIC_NAME_CACHE_STATE_KEY, () => ({ stores: /* @__PURE__ */ new Map() }));
	const stateKey = scope ?? DEFAULT_TOPIC_NAME_CACHE_SCOPE;
	const existing = state.stores.get(stateKey);
	if (existing) return existing;
	const namespace = resolveTopicNameCacheNamespace(stateKey);
	const next = {
		lastUpdatedAt: 0,
		store: /* @__PURE__ */ new Map(),
		persistentStore: getTelegramRuntime().state.openKeyedStore({
			namespace,
			maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES
		})
	};
	state.stores.set(stateKey, next);
	return next;
}
function hydrateTopicStoreState(state) {
	state.hydratePromise ??= (async () => {
		const entries = await state.persistentStore.entries();
		for (const { key, value } of entries) if (isTopicEntry(value)) state.store.set(key, value);
		state.lastUpdatedAt = Math.max(0, ...Array.from(state.store.values(), (entry) => entry.updatedAt));
	})().catch((error) => {
		state.hydratePromise = void 0;
		throw error;
	});
	return state.hydratePromise;
}
function nextUpdatedAt(scope) {
	const state = getTopicStoreState(scope);
	const now = Date.now();
	state.lastUpdatedAt = now > state.lastUpdatedAt ? now : state.lastUpdatedAt + 1;
	return state.lastUpdatedAt;
}
async function updateTopicName(chatId, threadId, patch, scope) {
	const state = getTopicStoreState(scope);
	await hydrateTopicStoreState(state);
	const key = cacheKey(chatId, threadId);
	const existing = state.store.get(key);
	const iconColor = patch.iconColor ?? existing?.iconColor;
	const iconCustomEmojiId = patch.iconCustomEmojiId ?? existing?.iconCustomEmojiId;
	const closed = patch.closed ?? existing?.closed;
	const creatorUserId = patch.creatorUserId ?? existing?.creatorUserId;
	const merged = {
		name: patch.name ?? existing?.name ?? "",
		updatedAt: nextUpdatedAt(scope),
		...iconColor !== void 0 ? { iconColor } : {},
		...iconCustomEmojiId !== void 0 ? { iconCustomEmojiId } : {},
		...closed !== void 0 ? { closed } : {},
		...creatorUserId !== void 0 ? { creatorUserId } : {}
	};
	if (!merged.name) return;
	state.store.set(key, merged);
	await state.persistentStore.register(key, merged);
	const evictedKey = evictOldest(state.store);
	if (evictedKey) await state.persistentStore.delete(evictedKey);
}
async function getTopicName(chatId, threadId, scope) {
	const state = getTopicStoreState(scope);
	await hydrateTopicStoreState(state);
	const key = cacheKey(chatId, threadId);
	const entry = state.store.get(key);
	if (entry) {
		entry.updatedAt = nextUpdatedAt(scope);
		await state.persistentStore.register(key, entry);
	}
	return entry?.name;
}
async function recordTopicCreation(chatId, threadId, creation, scope) {
	const state = getTopicStoreState(scope);
	await hydrateTopicStoreState(state);
	await updateTopicName(chatId, threadId, state.store.has(cacheKey(chatId, threadId)) ? { creatorUserId: creation.creatorUserId } : {
		...creation,
		closed: false
	}, scope);
}
async function getTopicCreatorUserId(chatId, threadId, scope) {
	const state = getTopicStoreState(scope);
	await hydrateTopicStoreState(state);
	return state.store.get(cacheKey(chatId, threadId))?.creatorUserId;
}
//#endregion
//#region extensions/telegram/src/send-forum-topics.ts
async function editForumTopicTelegram(chatIdInput, messageThreadIdInput, opts) {
	const trimmedName = opts.name?.trim();
	if (opts.name !== void 0 && !trimmedName) throw new Error("Telegram forum topic name is required");
	if (trimmedName && Array.from(trimmedName).length > 128) throw new Error("Telegram forum topic name must be 128 characters or fewer");
	const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
	if (opts.iconCustomEmojiId !== void 0 && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic icon custom emoji ID is required");
	if (!trimmedName && !trimmedIconCustomEmojiId) throw new Error("Telegram forum topic update requires a name or iconCustomEmojiId");
	return withTelegramMessageAction(chatIdInput, messageThreadIdInput, opts, async ({ api, chatId, messageId: messageThreadId, request }) => {
		const payload = {
			...trimmedName ? { name: trimmedName } : {},
			...trimmedIconCustomEmojiId ? { icon_custom_emoji_id: trimmedIconCustomEmojiId } : {}
		};
		await request(() => api.editForumTopic(chatId, messageThreadId, payload), "editForumTopic");
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
/** Requires the bot's can_manage_topics permission. */
async function createForumTopicTelegram(chatId, name, opts) {
	const assertPlatformSendAuthorized = opts.assertPlatformSendAuthorized;
	if (!name?.trim()) throw new Error("Forum topic name is required");
	const trimmedName = name.trim();
	if (Array.from(trimmedName).length > 128) throw new Error("Forum topic name must be 128 characters or fewer");
	return withTelegramApiContext({
		...opts,
		assertPlatformSendAuthorized
	}, async (context) => {
		const { cfg, account, api, ownerAgentId } = context;
		const { chatId: normalizedChatId, request: requestWithDiag } = await prepareTelegramOutbound({
			to: chatId,
			context,
			opts,
			wrapChatNotFound: false
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
		await recordTopicCreation(normalizedChatId, topicId, {
			name: result.name ?? trimmedName,
			creatorUserId: resolveTelegramBotUserIdFromToken(opts.token || account.token),
			iconColor: result.icon_color ?? opts.iconColor,
			iconCustomEmojiId: result.icon_custom_emoji_id ?? opts.iconCustomEmojiId
		}, resolveSessionStorePathCore(cfg.session?.store, { agentId: ownerAgentId })).catch((err) => {
			logVerbose(`telegram: topic metadata persistence failed after creation: ${String(err)}`);
		});
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
function htmlPage(htmlText, plainText = telegramHtmlToPlainTextFallback(htmlText)) {
	return {
		htmlText,
		plainText,
		sourceText: htmlText,
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
				const page = plainPage(plan.plainText);
				page.richMessage = plan.richMessage;
				page.degradationReasons = index === 0 ? params.degradationReasons : void 0;
				return page;
			});
			if (pages.length === 0 && params.text.trim()) return [{
				...plainPage(params.text),
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
		}).map((chunk) => {
			const page = plainPage(chunk.plainText);
			page.richMessage = chunk.richMessage;
			page.degradationReasons = chunk.degradationReasons;
			return page;
		});
	}
	if (params.textMode === "plain") return splitTelegramPlainTextChunks(params.text, maxChars).map((text, index) => index === 0 ? text.trimEnd() : text.trim()).filter(Boolean).map(plainPage);
	if (params.textMode === "html") {
		const plainText = telegramHtmlToPlainTextFallback(params.text);
		try {
			const normalizedHtml = params.text.replace(/<br\s*\/?>/giu, "\n");
			const chunks = splitTelegramHtmlChunks(normalizedHtml, maxChars);
			return chunks.map((htmlText) => Object.assign(htmlPage(htmlText, chunks.length === 1 ? plainText : void 0), { fullSourceText: normalizedHtml }));
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
			pages.push(htmlPage(markdownToTelegramHtml(markdown, { tableMode: params.tableMode }), markdown));
			continue;
		}
		pages.push(...chunks.map((chunk) => htmlPage(chunk.html)));
	}
	return pages;
}
async function* sendTelegramTextPageParts(params) {
	const { page } = params;
	const html = params.html ?? Boolean(page.htmlText);
	if (!page.richMessage && !html) {
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
		sendFormatted: async () => ({ result: page.richMessage ? await params.sender.sendRich(page.richMessage) : await params.sender.sendHtml(page.htmlText ?? page.sourceText) }),
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
		page: {
			plainText: text,
			sourceText: escapeTelegramHtml(text),
			sourceTextMode: "html"
		}
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
	return withTelegramMessageAction(chatIdInput, messageIdInput, opts, async ({ api, chatId, messageId, request }) => {
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
	return withTelegramMessageAction(chatIdInput, messageIdInput, opts, async ({ cfg, account, api, chatId, messageId, request }) => {
		const edit = (fn, label = "editMessage") => request(fn, label, { shouldLog: (err) => !isTelegramMessageNotModifiedError(err) });
		const textMode = opts.textMode ?? "markdown";
		const linkPreviewEnabled = opts.linkPreview ?? account.config.linkPreview ?? true;
		const richMessagesParams = {
			cfg,
			accountId: account.accountId,
			accountConfig: account.config,
			htmlTextMode: textMode === "html"
		};
		const useRichMessages = resolveTelegramRichMessages(richMessagesParams);
		const tableMode = resolveTelegramTableMode(richMessagesParams);
		const htmlText = renderTelegramHtmlText(text, {
			textMode,
			tableMode
		});
		const replyMarkup = opts.buttons === void 0 ? void 0 : buildInlineKeyboard(opts.buttons) ?? { inline_keyboard: [] };
		const replyMarkupParams = replyMarkup === void 0 ? {} : { reply_markup: replyMarkup };
		const commonTextParams = {
			...linkPreviewEnabled ? {} : { link_preview_options: { is_disabled: true } },
			...replyMarkupParams
		};
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
			const [accepted] = await deliverTelegramTextPage({
				page,
				context: "editMessage",
				warn: (message) => sendLogger.warn(message),
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
		const editCaption = (caption, html, label = "editMessageCaption") => edit(() => api.editMessageCaption(chatId, messageId, {
			caption,
			...html ? { parse_mode: "HTML" } : {},
			...replyMarkupParams
		}), label);
		const performCaptionEdit = () => {
			const caption = renderTelegramHtmlText(text, {
				textMode,
				tableMode,
				downgradeRichPromptTags: true
			});
			return withTelegramPlainFallback({
				kind: "html",
				context: "editMessageCaption",
				plainText: telegramHtmlToPlainTextFallback(caption),
				warn: (message) => sendLogger.warn(message),
				sendFormatted: () => editCaption(caption, true),
				sendPlain: (plan, label) => editCaption(plan.plainText, false, label)
			});
		};
		let editedMessage;
		try {
			const editMode = opts.editMode ?? "text";
			editedMessage = editMode === "caption" ? await performCaptionEdit() : await performTextEdit().catch((err) => {
				if (editMode === "auto" && isTelegramMessageHasNoTextError(err)) return performCaptionEdit();
				throw err;
			});
		} catch (err) {
			if (!isTelegramMessageNotModifiedError(err)) throw err;
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
	}, (err) => isRecoverableTelegramNetworkError(err, { context: "edit" }) || isTelegramServerError(err));
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
			}
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
		const acceptedParams = toAcceptedThreadScopedParams(delivery.acceptedParams);
		return finalizeTelegramOutbound({
			context,
			prepared,
			result: delivery.result,
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
//#region extensions/telegram/src/voice.ts
function resolveTelegramVoiceSend(opts) {
	const useVoice = opts.wantsVoice && isVoiceMessageCompatibleAudio(opts);
	if (opts.wantsVoice && !useVoice) opts.logFallback?.(`Telegram voice requested but media is ${opts.contentType ?? "unknown"} (${opts.fileName ?? "unknown"}); sending as audio file instead.`);
	return { useVoice };
}
//#endregion
//#region extensions/telegram/src/outbound-media.ts
const MEDIA_SEND_METHODS = {
	animation: "sendAnimation",
	photo: "sendPhoto",
	video: "sendVideo",
	video_note: "sendVideoNote",
	voice: "sendVoice",
	audio: "sendAudio",
	document: "sendDocument"
};
const DEFAULT_MEDIA_EXTENSIONS = {
	image: ".jpg",
	video: ".mp4",
	audio: ".ogg",
	file: ".bin"
};
async function probeAudioDurationMs(buffer) {
	try {
		return await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "telegram-audio-"
		}, async (workspace) => {
			const file = await workspace.write("audio", buffer);
			const duration = Number(await runFfprobe([
				"-v",
				"error",
				"-protocol_whitelist",
				"file",
				"-format_whitelist",
				"ogg,mp3,mov",
				"-show_entries",
				"format=duration",
				"-of",
				"default=nw=1:nk=1",
				file
			]));
			return Number.isFinite(duration) && duration > 0 ? duration * 1e3 : void 0;
		});
	} catch {
		return;
	}
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
	const basename = kind === "image" || kind === "video" || kind === "audio" ? kind : "file";
	const fileName = params.media.fileName || (isGif ? "animation.gif" : `${basename}${extensionForMime(params.media.contentType) ?? DEFAULT_MEDIA_EXTENSIONS[basename]}`);
	const text = params.text;
	const trimmedText = text?.trim();
	const renderedCaption = !isVideoNote && trimmedText ? params.preparedHtml === true && params.textMode === "html" ? trimmedText : renderTelegramHtmlText(trimmedText, {
		textMode: params.textMode ?? "markdown",
		tableMode: params.tableMode,
		downgradeRichPromptTags: true
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
		htmlCaption,
		plainCaption: resolveTelegramPlainCaption(caption && params.textMode === "html" ? telegramHtmlToPlainTextFallback(caption) : caption, htmlCaption),
		followUpText
	};
}
function resolveTelegramOutboundMediaSenders(params) {
	let audioDurationMsPromise;
	const createSender = (label) => {
		const operation = MEDIA_SEND_METHODS[label];
		const method = params.api[operation];
		return {
			label,
			operation,
			send: async (effectiveParams) => {
				const durationMs = label === "voice" || label === "audio" ? await (audioDurationMsPromise ??= probeAudioDurationMs(params.media.buffer)) : void 0;
				return await method.call(params.api, params.chatId, params.plan.file, {
					...effectiveParams,
					...durationMs ? { duration: Math.max(1, Math.round(durationMs / 1e3)) } : {},
					...label === "document" && params.forceDocument ? { disable_content_type_detection: true } : {}
				});
			}
		};
	};
	const documentSender = createSender("document");
	let label = "document";
	if (params.plan.isGif && params.plan.deliveryKind !== "document") label = "animation";
	else if (params.plan.deliveryKind === "image" && params.sendImageAsPhoto !== false) label = "photo";
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
	let requestParams = params.requestParams;
	let usingPlainCaption = false;
	let deliveredCaption = requestCaption !== void 0 ? params.plainCaption ?? requestCaption : void 0;
	for (;;) try {
		return {
			result: await params.send(requestParams, (err) => (usingPlainCaption || !isTelegramHtmlParseError(err)) && !isTelegramEmptyContentError(err) && (params.shouldLog?.(err) ?? true)),
			...deliveredCaption !== void 0 ? { deliveredCaption } : {}
		};
	} catch (err) {
		if (isTelegramEmptyContentError(err) && (usingPlainCaption || requestCaption !== void 0)) {
			const captionlessParams = { ...params.requestParams };
			delete captionlessParams.caption;
			delete captionlessParams.parse_mode;
			return {
				result: await params.send(captionlessParams, params.shouldLog),
				...requestCaption !== void 0 ? { captionRemoved: true } : {}
			};
		}
		if (usingPlainCaption || !isTelegramHtmlParseError(err) || !params.plainCaption) throw err;
		logVerbose(`telegram ${params.operation} caption HTML rejected; retrying as plain caption: ${formatErrorMessage(err)}`);
		requestParams = {
			...params.requestParams,
			caption: params.plainCaption
		};
		delete requestParams.parse_mode;
		deliveredCaption = params.plainCaption;
		usingPlainCaption = true;
	}
}
//#endregion
//#region extensions/telegram/src/send-error-predicates.ts
function resolveTelegramErrorDescription(error) {
	return isRecord(error) && typeof error.description === "string" ? error.description : formatErrorMessage(error);
}
function isTelegramCaptionTooLongError(error) {
	return /caption is too long/i.test(resolveTelegramErrorDescription(error));
}
function isTelegramPhotoLimitError(error) {
	return /\b(?:PHOTO_INVALID_DIMENSIONS|PHOTO_TOO_BIG)\b/i.test(resolveTelegramErrorDescription(error));
}
function isTelegramVoiceMessagesForbiddenError(error) {
	return resolveTelegramErrorDescription(error).includes("VOICE_MESSAGES_FORBIDDEN");
}
//#endregion
//#region extensions/telegram/src/send-message-text.ts
function createTelegramTextSender(config) {
	const { cfg, ownerAgentId, account, api, chatId, opts, replyMarkup, reportDelivery, recordDeliveredPromptContext, singleUseReplyTo, buildThreadParams, sender, textMode, tableMode, useRichMessages } = config;
	const linkPreviewOptions = account.config.linkPreview === false ? { is_disabled: true } : void 0;
	return async (rawText, context, options = {}) => {
		const start = sender.parts.length;
		let acceptedReplyToMessageId;
		const deliveryResults = [];
		const buildReceipt = () => {
			if (deliveryResults.length < 2) return deliveryResults[0]?.receipt;
			const receipt = createMessageReceiptFromOutboundResults({
				results: deliveryResults,
				kind: "text",
				...typeof acceptedReplyToMessageId === "number" ? { replyToId: String(acceptedReplyToMessageId) } : {}
			});
			receipt.parts = receipt.parts.map((part, index) => ({
				...part,
				index
			}));
			return receipt;
		};
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
			if (keyboardError !== void 0) throw keyboardError instanceof Error ? keyboardError : new Error(formatErrorMessage(keyboardError));
		};
		const flushPending = async (finalPart) => {
			const chunk = pendingChunk;
			pendingChunk = void 0;
			if (chunk) await flushChunk(chunk, finalPart);
		};
		const record = async (params) => {
			const { messageId } = params;
			acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(params.acceptedParams);
			if (sender.parts.length === start + 1) await options.beforeFirstAccepted?.();
			await recordSentMessage(chatId, messageId, cfg, {
				accountId: account.accountId,
				agentId: ownerAgentId
			});
			await reportDelivery({
				messageId,
				fallbackChatId: params.result?.chat?.id ?? chatId,
				message: params.result,
				meta: {
					telegramDeliveredText: params.plainText,
					telegramHasInlineKeyboard: params.hasInlineKeyboard
				},
				kind: "text",
				onPrepared: (delivery) => deliveryResults.push(delivery)
			});
			const previousChunk = pendingChunk;
			pendingChunk = {
				...params,
				reportChatId: params.result?.chat?.id ?? chatId
			};
			if (previousChunk) await flushChunk(previousChunk, false);
		};
		const partialDeliveryResult = () => {
			const receipt = buildReceipt();
			return receipt ? { receipt } : {};
		};
		const tracking = {
			invalidate: () => opts.promptContextProjectionPlan?.cursor.invalidate(),
			onRejected: (error) => logVerbose(`telegram ${context} text chunk rejected; continuing: ${formatErrorMessage(error)}`),
			onSilentSkip: (error) => logVerbose(`telegram ${context} text chunk rendered empty; skipping: ${formatErrorMessage(error)}`),
			partialDeliveryResult
		};
		const alreadyUsed = options.replyToAlreadyUsed === true;
		const maxChars = Math.min(opts.textLimit ?? Number.POSITIVE_INFINITY, resolveTelegramTextChunkLimit({
			cfg,
			accountId: account.accountId,
			...textMode === "html" ? { formatting: { parseMode: "HTML" } } : {}
		}));
		const pages = planTelegramTextDeliveryPages({
			text: textMode === "html" ? renderTelegramHtmlText(rawText, {
				textMode,
				tableMode
			}) : rawText,
			maxChars,
			tableMode,
			chunkMode: opts.chunkMode ?? resolveChunkMode(cfg, "telegram", account.accountId),
			richMessages: useRichMessages,
			skipEntityDetection: account.config.linkPreview === false,
			...textMode === "html" ? { textMode: "html" } : {},
			warn: (message) => sendLogger.warn(message)
		});
		try {
			await sender.sendText({
				pages,
				context,
				tracking,
				drainFallback: true,
				observe: record,
				preparePage: (index) => ({ requestParams: (fallback) => {
					const count = Math.max(pages.length, fallback?.count ?? pages.length);
					const includeReply = !alreadyUsed && (!singleUseReplyTo || count === 1);
					const finalPart = index === pages.length - 1 && (!fallback || fallback.index === fallback.count - 1);
					return {
						...buildThreadParams(includeReply),
						...finalPart && replyMarkup ? { reply_markup: replyMarkup } : {},
						...linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {},
						...opts.silent === true ? { disable_notification: true } : {}
					};
				} })
			});
			await flushPending(true);
			const parts = sender.parts.slice(start);
			const last = parts.at(-1);
			const lastMessageId = last ? String(last.messageId) : "";
			const lastChatId = String(last?.result.chat?.id ?? chatId);
			if (lastMessageId) logTelegramOutboundSendOk({
				accountId: account.accountId,
				chatId: lastChatId,
				messageId: lastMessageId,
				operation: useRichMessages ? "sendRichMessage" : "sendMessage",
				deliveryKind: "text",
				messageThreadId: toAcceptedThreadScopedParams(last?.acceptedParams)?.message_thread_id,
				replyToMessageId: opts.replyToMessageId,
				silent: opts.silent,
				chunkCount: parts.length
			});
			const receipt = buildReceipt();
			return {
				messageId: lastMessageId,
				chatId: lastChatId,
				...receipt ? { receipt } : {},
				...finalMeta ? { meta: finalMeta } : {}
			};
		} catch (error) {
			if (isChannelPartialDeliveryError(error) || !isTelegramEmptyContentError(error)) opts.promptContextProjectionPlan?.cursor.invalidate();
			try {
				await flushPending(false);
			} catch (flushError) {
				sendLogger.warn(`telegram ${context} delivery bookkeeping cleanup failed: ${formatErrorMessage(flushError)}`);
			}
			return sender.fail(error, start, partialDeliveryResult());
		}
	};
}
//#endregion
//#region extensions/telegram/src/chunk-delivery.ts
const TELEGRAM_TERMINAL_BAD_REQUEST_RE = /\b(?:chat|message thread) not found\b/i;
function mergeTelegramPartialDeliveryError(error, priorDeliveryResult) {
	const currentDeliveryResult = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
	const messageIds = [...new Set([priorDeliveryResult, currentDeliveryResult].flatMap((result) => (result?.messageIds ?? []).concat(result?.receipt ? listMessageReceiptPlatformIds(result.receipt) : [])))];
	let receipt = currentDeliveryResult?.receipt ?? priorDeliveryResult.receipt;
	if (priorDeliveryResult.receipt && currentDeliveryResult?.receipt) {
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
		...(currentDeliveryResult ? messageIds.length > 0 : receipt) ? { messageIds } : {},
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
		shouldRetry: isSafeToRetrySendError,
		strictShouldRetry: true
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
			return runAuthorizedTelegramRequest(config.assertPlatformSendAuthorized, () => send(effective));
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
				await config.beforeSend?.();
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
				try {
					return await request(label, requestParams, (effective) => Object.keys(effective).length ? config.api.sendMessage(config.chatId, text, effective) : config.api.sendMessage(config.chatId, text), { shouldLog: (error) => !isTelegramHtmlParseError(error) && !isTelegramEmptyContentError(error) });
				} catch (error) {
					if (!fallback || !params.drainFallback) throw error;
					reject(error);
					return;
				}
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
						return {
							...sent,
							acceptedParams: {
								...sent.acceptedParams,
								...markup
							}
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
		return parts[start]?.messageId;
	};
	const sendCaptioned = async (params, sender) => {
		await config.beforeSend?.();
		return sendTelegramCaptionedMediaWithFallback({
			operation: sender.operation,
			requestParams: params.requestParams,
			plainCaption: params.plainCaption,
			shouldLog: (error) => sender.label === "photo" ? !isTelegramPhotoLimitError(error) : sender.label !== "voice" || !isTelegramVoiceMessagesForbiddenError(error),
			send: (requestParams, shouldLog) => request(sender.operation, requestParams, sender.send, { shouldLog })
		});
	};
	const sendMedia = async (params) => {
		let sender = params.sender;
		let delivery;
		try {
			delivery = await sendCaptioned(params, sender);
		} catch (error) {
			if (sender.label !== "photo" || !isTelegramPhotoLimitError(error)) throw error;
			logVerbose(`telegram sendPhoto exceeded photo limits; retrying as document: ${formatErrorMessage(error)}`);
			sender = params.documentSender ?? sender;
			delivery = await sendCaptioned(params, sender);
		}
		return {
			...delivery.result,
			plainText: delivery.deliveredCaption ?? "",
			captionRemoved: delivery.captionRemoved,
			sender
		};
	};
	const sendPhotoAlbum = async (params) => {
		const delivery = await sendCaptioned(params, {
			operation: "sendMediaGroup",
			label: "photo",
			send: (effective) => {
				const { caption, parse_mode, ...groupParams } = effective;
				return config.api.sendMediaGroup(config.chatId, params.files.map((media, index) => ({
					type: "photo",
					media,
					...index === 0 && typeof caption === "string" ? { caption } : {},
					...index === 0 && parse_mode === "HTML" ? { parse_mode: "HTML" } : {}
				})), groupParams);
			}
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
		const recordActivity = () => recordChannelActivity({
			channel: "telegram",
			accountId: account.accountId,
			direction: "outbound"
		});
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
			}
		});
		const deliveryResults = [];
		let finalMediaBatch = true;
		const reportDelivery = (params) => reportTelegramProviderDelivery({
			...params,
			successfulSendThread: threadSpec,
			onPrepared: (delivery) => {
				deliveryResults.push({
					...delivery,
					receipt: delivery.receipt ?? createMessageReceiptFromOutboundResults({
						results: [delivery],
						kind: params.kind
					})
				});
				params.onPrepared?.(delivery);
			},
			onDeliveryResult: opts.onDeliveryResult
		});
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
		const richMessagesParams = {
			cfg,
			accountId: account.accountId,
			accountConfig: account.config,
			htmlTextMode: textMode === "html"
		};
		const useRichMessages = resolveTelegramRichMessages(richMessagesParams);
		const tableMode = opts.tableMode ?? resolveTelegramTableMode(richMessagesParams);
		const sender = createTelegramPreparedSender({
			api,
			chatId,
			warn: (message) => sendLogger.warn(message),
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
		const sendChunkedText = createTelegramTextSender({
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
			useRichMessages
		});
		async function shouldSendTelegramImageAsPhoto(buffer) {
			try {
				const metadata = await getImageMetadata(buffer);
				const width = metadata?.width;
				const height = metadata?.height;
				if (typeof width !== "number" || typeof height !== "number") {
					sendLogger.warn("Photo dimensions are unavailable. Sending as document instead.");
					return false;
				}
				const shorterSide = Math.min(width, height);
				const longerSide = Math.max(width, height);
				const isValidPhoto = width + height <= MAX_TELEGRAM_PHOTO_DIMENSION_SUM && shorterSide > 0 && longerSide <= shorterSide * MAX_TELEGRAM_PHOTO_ASPECT_RATIO;
				if (!isValidPhoto) sendLogger.warn(`Photo dimensions (${width}x${height}) are not valid for Telegram photos. Sending as document instead.`);
				return isValidPhoto;
			} catch (err) {
				sendLogger.warn(`Failed to validate photo dimensions: ${formatErrorMessage(err)}. Sending as document instead.`);
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
			const baseMediaParams = {
				...buildThreadParams(!singleUseReplyTo || sender.parts.length === 0),
				...!followUpText && batchReplyMarkup ? { reply_markup: batchReplyMarkup } : {}
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
					recordActivity();
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
				await reportDelivery({
					messageId: part.messageId,
					fallbackChatId: resolvedChatId,
					message: part.result,
					meta,
					kind: "media",
					onPrepared: (delivery) => {
						mediaDeliveryResult = delivery;
					}
				});
				const lastPart = part.result === lastMedia.result;
				if (!followUpText || !lastPart) await recordMediaPromptPart(part, lastPart);
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
			}, { partialDeliveryResult: () => ({ receipt: buildMediaReceipt() }) });
			const mediaMessageId = resolveTelegramMessageIdOrThrow(lastMedia.result, "media send");
			const resolvedChatId = String(lastMedia.result.chat?.id ?? chatId);
			const acceptedMediaParams = toAcceptedThreadScopedParams(lastMedia.acceptedParams);
			recordActivity();
			if (followUpText) {
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
				return sender.fail(error, 0, { receipt: buildMediaReceipt() });
			}
		}
		if (!text || !text.trim()) throw new Error("Message must be non-empty for Telegram sends");
		const textResult = await sendChunkedText(text, "text send");
		recordActivity();
		return textResult;
	});
}
//#endregion
//#region extensions/telegram/src/poll-registry.ts
const TELEGRAM_POLL_REGISTRY_NAMESPACE = "telegram.poll-registry";
const TELEGRAM_POLL_REGISTRY_MAX_ENTRIES = 1e4;
const TELEGRAM_CLOSED_POLL_RETENTION_MS = 1728e5;
function pollRegistryStoreOptions(env) {
	return {
		namespace: TELEGRAM_POLL_REGISTRY_NAMESPACE,
		maxEntries: TELEGRAM_POLL_REGISTRY_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	};
}
function openPollRegistryStore(env) {
	return getTelegramRuntime().state.openKeyedStoreV2(pollRegistryStoreOptions(env));
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
		...params,
		options: [...params.options]
	});
	if (!entry) throw new Error("Invalid Telegram poll registry route");
	return entry;
}
async function findTelegramPollRegistryEntry(params) {
	return normalizePollRegistryEntry(await openPollRegistryStore(params.env).lookup(telegramPollRegistryKey(params.accountId, params.pollId)));
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
	const { promise: completion, resolve: completeRegistration } = createDeferredCore();
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
			useApiErrorLogging: false
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
			}
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
		let warning;
		try {
			const finalized = await finalizeTelegramOutbound({
				context,
				prepared,
				result,
				resultContext: "poll send"
			});
			if (pollId && opts.isAnonymous !== false) warning = "Poll sent anonymously, so Telegram does not identify voters and answers cannot reach the agent. Send a public poll to route votes into this conversation.";
			else if (pollId) {
				const isGroup = result.chat.type === "group" || result.chat.type === "supergroup";
				const botUserId = resolveTelegramBotUserIdFromToken(opts.token || context.account.token);
				let canVerifyVoters = result.chat.type === "private";
				if (result.chat.type === "channel") warning = "Poll sent, but public poll answer routing is not supported for Telegram channels. Send the poll in a direct chat or group, or ask subscribers to reply in text.";
				else if (isGroup) {
					const { groupConfig, topicConfig } = resolveTelegramScopedGroupConfig(context.account.config, result.chat.id, messageThreadId);
					const groupPolicyConfig = groupConfig && "groupPolicy" in groupConfig ? groupConfig : void 0;
					if (groupConfig?.enabled === false || topicConfig?.enabled === false || resolveTelegramEffectiveGroupPolicy({
						cfg: opts.cfg,
						telegramCfg: context.account.config,
						groupConfig: groupPolicyConfig,
						topicConfig
					}) === "disabled") warning = "Poll sent, but answers cannot reach the agent because inbound messages are disabled for this group or topic. Enable inbound messages for this target and send a new poll, or ask participants to reply in text.";
					else if (botUserId == null) warning = "Poll sent, but answers cannot reach the agent because the bot account could not be verified. Check the bot token and send a new poll, or ask the user to reply in text.";
					else try {
						const botMember = await api.getChatMember(result.chat.id, botUserId);
						canVerifyVoters = botMember.status === "creator" || botMember.status === "administrator";
						if (!canVerifyVoters) warning = "Poll sent, but answers cannot reach the agent because the bot is not an administrator in this group. Make the bot an administrator and send a new poll, or ask the user to reply in text.";
					} catch (err) {
						warning = "Poll sent, but answers cannot reach the agent because group membership verification failed. Make the bot an administrator and send a new poll, or ask the user to reply in text.";
						logVerbose(`telegram: failed to verify poll voter access for poll ${pollId}: ${err instanceof Error ? err.message : String(err)}`);
					}
				}
				if (canVerifyVoters && provisionalEntry) try {
					registeredEntry = await recordTelegramPollRegistryEntry({
						accountId: context.account.accountId,
						...provisionalEntry
					});
				} catch (err) {
					warning = "Poll sent, but answers cannot reach the agent because routing state could not be saved. Ask the user to reply in text.";
					logVerbose(`telegram: failed to record poll registry entry for poll ${pollId}: ${err instanceof Error ? err.message : String(err)}`);
				}
			}
			return {
				...finalized,
				pollId,
				...warning ? { pollAnswerRouting: "unavailable" } : registeredEntry ? { pollAnswerRouting: "enabled" } : {},
				...warning ? { warning } : {}
			};
		} finally {
			registration?.complete(registeredEntry);
		}
	});
}
//#endregion
export { hasProviderObservedTelegramThreadBinding as $, getTopicName as A, buildTelegramStatusReactionVariants as B, editMessageTelegram as C, editForumTopicTelegram as D, createForumTopicTelegram as E, pinMessageTelegram as F, buildTelegramProviderDeliveryResult as G, resolveTelegramReactionEmoji as H, reactMessageTelegram as I, wasSentByBot as J, reportTelegramProviderDelivery as K, sendTypingTelegram as L, updateTopicName as M, deleteMessageTelegram as N, renameForumTopicTelegram as O, getTelegramAllowedReactions as P, createTelegramMessageCache as Q, unpinMessageTelegram as R, editMessageReplyMarkupTelegram as S, planTelegramTextDeliveryPages as T, resolveTelegramReactionVariant as U, resolveTelegramAllowedReactions as V, resolveTelegramStatusReactionEmojis as W, buildTelegramConversationContext as X, recordOutboundMessageForPromptContext as Y, buildTelegramReplyChain as Z, isTelegramVoiceMessagesForbiddenError as _, evaluateTelegramGroupPolicyAccess as _t, prepareTelegramPollAnswerContextAsync as a, isTelegramHistoryEntryAfterAmbientWatermark as at, planTelegramMediaBatches as b, findTelegramPollRegistryEntry as c, telegramPromptContextHistory as ct, createTelegramPreparedSender as d, buildTelegramSendParams as dt, isTelegramMessageFromCurrentBot as et, createTelegramReplyRequest as f, buildTelegramThreadReplyParams as ft, isTelegramPhotoLimitError as g, evaluateTelegramGroupBaseAccess as gt, isTelegramCaptionTooLongError as h, createTelegramClientFetch as ht, isEligibleTelegramPollAnswerUpdate as i, isTelegramChatWindowPromptContext as it, recordTopicCreation as j, getTopicCreatorUserId as k, retireTelegramPollRegistryEntry as l, require_abort_controller as lt, mergeTelegramPartialDeliveryError as m, asTelegramClientFetch as mt, sendStickerTelegram as n, resolveTelegramMessageCacheScope as nt, recordPreparedTelegramPollAnswer as o, isTelegramSelfSenderName as ot, failPromptContextSequence as p, withTelegramNativeQuoteFallback as pt, recordSentMessage as q, getPreparedTelegramPollAnswer as r, buildTelegramSelfSenderName as rt, settleTelegramPollAnswerContext as s, selectTelegramGroupPromptContext as st, sendPollTelegram as t, resolveProviderObservedTelegramThreadSpec as tt, sendMessageTelegram as u, resetTelegramClientOptionsCacheForTests as ut, prepareTelegramOutboundMedia as v, resolveTelegramEffectiveGroupPolicy as vt, deliverTelegramTextPage as w, sendLocationTelegram as x, resolveTelegramOutboundMediaSenders as y, resolveTelegramRuntimeGroupPolicy as yt, TELEGRAM_SUPPORTED_REACTION_EMOJI_LIST as z };
