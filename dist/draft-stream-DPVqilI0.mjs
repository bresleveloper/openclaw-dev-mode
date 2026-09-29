import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./channel-outbound-Bk5sWC85.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-DtUaHKzS.mjs";
import { C as readTelegramRetryAfterMs, d as isRecoverableTelegramNetworkError, g as isTelegramClientRejection, p as isSafeToRetrySendError, u as TelegramRequestNotStartedError, x as isTelegramRateLimitError, y as isTelegramMessageNotModifiedError } from "./fetch-BZlDgFP3.mjs";
import "./reply-reference-BbSBfc8h.mjs";
import { a as takeMessageIdAfterStop, i as createFinalizableDraftStreamControlsForState } from "./draft-stream-controls-D6z2jkZk.mjs";
import { t as normalizeTelegramReplyToMessageId } from "./outbound-params-CEIp4vNq.mjs";
import { c as buildTelegramThreadParams } from "./helpers-Cx99qZMj.mjs";
import { L as telegramHtmlToPlainTextFallback, g as withTelegramPlainFallback, h as warnTelegramRichBlocksDegradations, r as TELEGRAM_RICH_TEXT_LIMIT, s as removeTelegramRichNativeQuoteParam, t as TELEGRAM_TEXT_CHUNK_LIMIT, z as escapeTelegramHtml } from "./text-chunk-limit-Bdq_2BA_.mjs";
import "./outbound-adapter-CXsEQaRB.mjs";
import { K as buildTelegramThreadReplyParams, T as planTelegramTextDeliveryPages, q as withTelegramNativeQuoteFallback } from "./send-Cox8AAme.mjs";
//#region extensions/telegram/src/draft-stream-message.ts
function toDraftSnapshot(page) {
	return {
		text: page.plainText,
		sourceText: page.sourceText,
		sourceTextMode: page.sourceTextMode
	};
}
function fallbackSnapshot(plainText) {
	return {
		text: plainText,
		sourceText: escapeTelegramHtml(plainText),
		sourceTextMode: "html"
	};
}
async function sendTelegramDraftMessage(params) {
	const { chatId, linkPreviewParams } = params;
	const sendPlannedMessage = async (page, sendMessageParams, assertCurrentSend) => {
		const request = (send) => {
			assertCurrentSend();
			return send();
		};
		if (page.richMessage) {
			const richMessage = page.richMessage;
			warnTelegramRichBlocksDegradations({
				context: "stream preview",
				reasons: page.degradationReasons ?? [],
				warn: (message) => params.warn?.(message)
			});
			return await withTelegramPlainFallback({
				kind: "rich",
				context: "stream preview",
				plainText: page.plainText,
				warn: (message) => params.warn?.(message),
				sendFormatted: async () => ({
					message: await request(() => params.api.raw.sendRichMessage({
						chat_id: chatId,
						rich_message: richMessage,
						...sendMessageParams
					})),
					snapshot: toDraftSnapshot(page)
				}),
				sendPlain: async (plan) => ({
					message: await request(() => params.api.sendMessage(chatId, plan.plainText, {
						...sendMessageParams,
						...linkPreviewParams
					})),
					snapshot: fallbackSnapshot(plan.plainText)
				})
			});
		}
		if (page.sourceTextMode !== "html") return {
			message: await request(() => params.api.sendMessage(chatId, page.plainText, {
				...sendMessageParams,
				...linkPreviewParams
			})),
			snapshot: toDraftSnapshot(page)
		};
		return await withTelegramPlainFallback({
			kind: "html",
			context: "stream preview",
			plainText: page.plainText,
			warn: (message) => params.warn?.(message),
			sendFormatted: async () => ({
				message: await request(() => params.api.sendMessage(chatId, page.htmlText ?? page.sourceText, {
					parse_mode: "HTML",
					...sendMessageParams,
					...linkPreviewParams
				})),
				snapshot: toDraftSnapshot(page)
			}),
			sendPlain: async (plan) => ({
				message: await request(() => params.api.sendMessage(chatId, plan.plainText, {
					...sendMessageParams,
					...linkPreviewParams
				})),
				snapshot: fallbackSnapshot(plan.plainText)
			})
		});
	};
	return (await withTelegramNativeQuoteFallback({
		label: "stream-preview",
		requestParams: params.sendMessageParams,
		...params.page.richMessage ? { removeNativeQuoteParam: removeTelegramRichNativeQuoteParam } : {},
		request: (effectiveParams) => sendPlannedMessage(params.page, effectiveParams, params.assertCurrentSend)
	})).result;
}
//#endregion
//#region extensions/telegram/src/draft-stream.ts
const DEFAULT_THROTTLE_MS = 1e3;
const MAX_CONSECUTIVE_PREVIEW_FAILURES = 3;
const MAX_PREVIEW_FLOOD_SUSPEND_MS = 6e4;
const MIN_PREVIEW_DWELL_MS = 4e3;
function createTelegramDraftStream(params) {
	const richMessages = params.richMessages === true;
	const transportLimit = richMessages ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	const maxChars = Math.min(params.maxChars ?? transportLimit, transportLimit);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const minInitialChars = params.minInitialChars;
	const chatId = params.chatId;
	const linkPreviewParams = params.linkPreview === false ? { link_preview_options: { is_disabled: true } } : {};
	const threadParams = buildTelegramThreadParams(params.thread);
	const replyToMessageId = normalizeTelegramReplyToMessageId(params.replyToMessageId);
	const quoteParams = params.replyQuote ? buildTelegramThreadReplyParams({
		replyToMessageId,
		replyQuoteMessageId: replyToMessageId,
		replyQuoteText: params.replyQuote.text,
		replyQuotePosition: params.replyQuote.position,
		replyQuoteEntities: params.replyQuote.entities
	}).reply_parameters : void 0;
	const initialSendMessageParams = replyToMessageId != null ? {
		...threadParams,
		reply_parameters: {
			message_id: replyToMessageId,
			allow_sending_without_reply: true,
			...quoteParams
		}
	} : threadParams ?? {};
	const consumesReplyTarget = replyToMessageId != null && params.replyToMode !== void 0 && isSingleUseReplyToMode(params.replyToMode);
	let replyTargetState = { kind: "available" };
	const reserveReplyTargetForSend = (sendGeneration) => {
		if (!consumesReplyTarget) return initialSendMessageParams;
		if (replyTargetState.kind !== "available") return threadParams ?? {};
		replyTargetState = {
			kind: "pending",
			generation: sendGeneration
		};
		return initialSendMessageParams;
	};
	const releasePendingReplyTarget = (sendGeneration) => {
		if (replyTargetState.kind === "pending" && replyTargetState.generation === sendGeneration) replyTargetState = { kind: "available" };
	};
	const retainReplyTarget = (sendGeneration, messageId) => {
		if (replyTargetState.kind === "pending" && replyTargetState.generation === sendGeneration) replyTargetState = {
			kind: "retained",
			generation: sendGeneration,
			messageId
		};
	};
	const streamState = {
		stopped: false,
		final: false
	};
	let messageSendAttempted = false;
	let suspendedUntilMs = 0;
	let consecutivePreviewFailures = 0;
	let streamMessageId;
	let streamMessageSnapshot;
	let streamProviderMessage;
	let terminalDeliveryError;
	const pendingProviderObservations = /* @__PURE__ */ new Set();
	let streamVisibleSinceMs;
	let lastSentPreviewKey = "";
	let lastDeliveredText = "";
	let lastRequestedText = "";
	let lastRequestedPreview;
	let pendingPlatformSendDispatch;
	let pendingPlatformSendAuthorization;
	let generation = 0;
	let finalPagePlan;
	const repositionedSendGenerations = /* @__PURE__ */ new Set();
	const editMessageTextWithPreview = async (messageId, text, other) => {
		const merged = other ? {
			...other,
			...linkPreviewParams
		} : linkPreviewParams;
		return Object.keys(merged).length > 0 ? await params.api.editMessageText(chatId, messageId, text, merged) : await params.api.editMessageText(chatId, messageId, text);
	};
	const scheduleProviderMessageObservation = (message) => {
		if (!message) return;
		const observation = (async () => {
			try {
				await params.onProviderMessage?.(message);
			} catch (err) {
				try {
					params.warn?.(`telegram stream preview observation failed: ${formatErrorMessage(err)}`);
				} catch {}
			}
		})();
		pendingProviderObservations.add(observation);
		observation.then(() => {
			pendingProviderObservations.delete(observation);
		});
	};
	const observeCurrentProviderMessage = () => {
		const message = streamProviderMessage;
		streamProviderMessage = void 0;
		scheduleProviderMessageObservation(message);
	};
	const drainProviderMessageObservations = async () => {
		await Promise.all(pendingProviderObservations);
	};
	const sendMessageTransportPreview = async (page, sendGeneration) => {
		if (pendingPlatformSendDispatch) {
			await pendingPlatformSendDispatch();
			pendingPlatformSendDispatch = void 0;
		}
		const assertPlatformSendAuthorized = pendingPlatformSendAuthorization;
		assertPlatformSendAuthorized?.();
		pendingPlatformSendAuthorization = void 0;
		const targetMessageId = streamMessageId;
		if (typeof targetMessageId === "number") {
			streamVisibleSinceMs ??= Date.now();
			let acceptedSnapshot = toDraftSnapshot(page);
			if (page.richMessage) {
				const richMessage = page.richMessage;
				warnTelegramRichBlocksDegradations({
					context: "stream preview edit",
					reasons: page.degradationReasons ?? [],
					warn: (message) => params.warn?.(message)
				});
				acceptedSnapshot = await withTelegramPlainFallback({
					kind: "rich",
					context: "stream preview edit",
					plainText: page.plainText,
					warn: (message) => params.warn?.(message),
					sendFormatted: async () => {
						await params.api.raw.editMessageText({
							chat_id: chatId,
							message_id: targetMessageId,
							rich_message: richMessage
						});
						return toDraftSnapshot(page);
					},
					sendPlain: async (plan) => {
						await editMessageTextWithPreview(targetMessageId, plan.plainText);
						return fallbackSnapshot(plan.plainText);
					}
				});
			} else if (page.sourceTextMode === "html") acceptedSnapshot = await withTelegramPlainFallback({
				kind: "html",
				context: "stream preview edit",
				plainText: page.plainText,
				warn: (message) => params.warn?.(message),
				sendFormatted: async () => {
					await editMessageTextWithPreview(targetMessageId, page.htmlText ?? page.sourceText, { parse_mode: "HTML" });
					return toDraftSnapshot(page);
				},
				sendPlain: async (plan) => {
					await editMessageTextWithPreview(targetMessageId, plan.plainText);
					return fallbackSnapshot(plan.plainText);
				}
			});
			else await editMessageTextWithPreview(targetMessageId, page.sourceText);
			if (sendGeneration === generation && streamMessageId === targetMessageId) streamMessageSnapshot = acceptedSnapshot;
			return true;
		}
		messageSendAttempted = true;
		const sendMessageParams = reserveReplyTargetForSend(sendGeneration);
		let sent;
		try {
			sent = await sendTelegramDraftMessage({
				api: params.api,
				chatId,
				page,
				sendMessageParams,
				linkPreviewParams,
				warn: params.warn,
				assertCurrentSend: () => {
					if (sendGeneration !== generation || streamState.stopped) throw new TelegramRequestNotStartedError("Telegram preview generation retired");
					assertPlatformSendAuthorized?.();
				}
			});
		} catch (err) {
			const definitelyRejected = isSafeToRetrySendError(err) || isTelegramClientRejection(err);
			if (sendGeneration === generation && definitelyRejected) messageSendAttempted = false;
			if (definitelyRejected) releasePendingReplyTarget(sendGeneration);
			throw err;
		}
		const sentMessageId = sent.message?.message_id;
		const normalizedMessageId = typeof sentMessageId === "number" && Number.isFinite(sentMessageId) ? Math.trunc(sentMessageId) : void 0;
		if (normalizedMessageId === void 0) {
			if (sendGeneration === generation) {
				streamState.stopped = true;
				params.warn?.("telegram stream preview stopped (missing message id from sendMessage)");
				return false;
			}
			return true;
		}
		retainReplyTarget(sendGeneration, normalizedMessageId);
		try {
			if (params.validateProviderMessage) await params.validateProviderMessage(sent.message);
		} catch (error) {
			terminalDeliveryError ??= error instanceof Error ? error : new Error(formatErrorMessage(error));
			streamState.stopped = true;
			if (sendGeneration === generation) {
				streamMessageId = normalizedMessageId;
				streamMessageSnapshot = sent.snapshot;
				streamProviderMessage = sent.message;
				streamVisibleSinceMs = Date.now();
			} else if (repositionedSendGenerations.delete(sendGeneration)) scheduleDetachedDelete(normalizedMessageId, Date.now(), REPOSITION_DELETE_DELAY_MS);
			return false;
		}
		if (sendGeneration !== generation) {
			const visibleSinceMs = Date.now();
			if (repositionedSendGenerations.delete(sendGeneration)) {
				scheduleDetachedDelete(normalizedMessageId, visibleSinceMs, REPOSITION_DELETE_DELAY_MS);
				return true;
			}
			params.onRetainedPage?.({
				messageId: normalizedMessageId,
				textSnapshot: sent.snapshot.text,
				visibleSinceMs
			});
			scheduleProviderMessageObservation(sent.message);
			return true;
		}
		const visibleSinceMs = Date.now();
		streamMessageId = normalizedMessageId;
		streamMessageSnapshot = sent.snapshot;
		streamProviderMessage = sent.message;
		streamVisibleSinceMs = visibleSinceMs;
		return true;
	};
	const sendOrEditPlannedPage = async (page, complete = false) => {
		const renderedPreviewKey = JSON.stringify([
			page.sourceTextMode,
			page.sourceText,
			page.richMessage?.skip_entity_detection === true
		]);
		if (renderedPreviewKey === lastSentPreviewKey) return true;
		const sendGeneration = generation;
		if (typeof streamMessageId !== "number" && minInitialChars != null && !streamState.final && !complete) {
			if (page.plainText.length < minInitialChars) return false;
		}
		const previousSentPreviewKey = lastSentPreviewKey;
		lastSentPreviewKey = renderedPreviewKey;
		try {
			const sent = await sendMessageTransportPreview(page, sendGeneration);
			if (sendGeneration !== generation) return true;
			if (sent) {
				consecutivePreviewFailures = 0;
				suspendedUntilMs = 0;
			}
			return sent;
		} catch (err) {
			if (sendGeneration !== generation) return true;
			const isEdit = typeof streamMessageId === "number";
			if (isEdit && isTelegramMessageNotModifiedError(err)) {
				consecutivePreviewFailures = 0;
				streamMessageSnapshot = toDraftSnapshot(page);
				return true;
			}
			lastSentPreviewKey = previousSentPreviewKey;
			const retryable = isTelegramRateLimitError(err) || (isEdit ? isRecoverableTelegramNetworkError(err) : isSafeToRetrySendError(err));
			consecutivePreviewFailures += 1;
			if (retryable && consecutivePreviewFailures <= MAX_CONSECUTIVE_PREVIEW_FAILURES) {
				const retryAfterMs = readTelegramRetryAfterMs(err);
				if (retryAfterMs !== void 0) suspendedUntilMs = Date.now() + Math.min(retryAfterMs, MAX_PREVIEW_FLOOD_SUSPEND_MS);
				params.warn?.(`telegram stream preview ${isEdit ? "edit" : "send"} failed (retrying): ${formatErrorMessage(err)}`);
				return false;
			}
			streamState.stopped = true;
			params.warn?.(`telegram stream preview failed: ${formatErrorMessage(err)}`);
			return false;
		}
	};
	const retainCurrentPage = () => {
		if (typeof streamMessageId !== "number" || !streamMessageSnapshot?.text) return;
		params.onRetainedPage?.({
			messageId: streamMessageId,
			textSnapshot: streamMessageSnapshot.text,
			visibleSinceMs: streamVisibleSinceMs
		});
		observeCurrentProviderMessage();
	};
	const resolveExactRemainingPage = (plan) => {
		if (plan.nextPageIndex <= 0 || plan.nextPageIndex >= plan.pages.length) return;
		const fullSourceText = plan.pages[0]?.fullSourceText;
		if (fullSourceText === void 0) return;
		const acceptedSourceText = plan.pages.slice(0, plan.nextPageIndex).map((page) => page.sourceText).join("");
		if (!fullSourceText?.startsWith(acceptedSourceText)) return;
		const sourceText = fullSourceText.slice(acceptedSourceText.length);
		const plainText = telegramHtmlToPlainTextFallback(sourceText);
		return plainText.length <= maxChars ? {
			plainText,
			sourceText,
			sourceTextMode: "html",
			fullSourceText,
			htmlText: sourceText
		} : void 0;
	};
	const sendOrEditStreamMessage = async (update) => {
		const isLazy = typeof update !== "string";
		const text = isLazy ? update.resolveText() : update;
		if (text === void 0) return true;
		if (isLazy) {
			lastRequestedPreview = void 0;
			lastRequestedText = text;
		}
		if (streamState.stopped && !streamState.final) return false;
		if (!streamState.final && Date.now() < suspendedUntilMs) return false;
		const trimmed = text.trimEnd();
		if (!trimmed) return false;
		const fullPreview = lastRequestedPreview?.text === trimmed ? lastRequestedPreview : params.renderText?.(trimmed) ?? { text: trimmed };
		const pages = streamState.final && finalPagePlan ? finalPagePlan.pages : planTelegramTextDeliveryPages({
			text: fullPreview.markdownSource?.text ?? fullPreview.text,
			maxChars,
			richMessages,
			richMessage: fullPreview.richMessage,
			tableMode: fullPreview.markdownSource?.tableMode,
			...richMessages || fullPreview.markdownSource ? {} : { textMode: fullPreview.parseMode === "HTML" ? "html" : "plain" }
		});
		const firstPage = pages[0];
		if (!firstPage) return false;
		if (!streamState.final) {
			finalPagePlan = void 0;
			const updateGeneration = generation;
			const sent = await sendOrEditPlannedPage(firstPage, fullPreview.complete);
			if (updateGeneration !== generation) return true;
			if (sent) lastDeliveredText = pages.length === 1 ? trimmed : firstPage.plainText.trimEnd();
			return sent;
		}
		const activePlan = finalPagePlan ??= {
			pages,
			nextPageIndex: 0
		};
		for (let index = activePlan.nextPageIndex; index < pages.length; index += 1) {
			const exactRemainingPage = resolveExactRemainingPage(activePlan);
			const page = exactRemainingPage ?? pages[index];
			if (index > 0 && typeof streamMessageId === "number") {
				retainCurrentPage();
				resetStreamToNewMessage(true);
			}
			if (!await sendOrEditPlannedPage(page)) return false;
			if (finalPagePlan !== activePlan) return true;
			activePlan.nextPageIndex = exactRemainingPage ? pages.length : index + 1;
			if (exactRemainingPage) break;
		}
		finalPagePlan = void 0;
		lastDeliveredText = trimmed;
		return true;
	};
	const { loop, update: updateDraft, stopForClear } = createFinalizableDraftStreamControlsForState({
		throttleMs,
		state: streamState,
		sendOrEditStreamMessage
	});
	const throwTerminalDeliveryError = () => {
		if (terminalDeliveryError !== void 0) throw terminalDeliveryError;
	};
	const waitForInFlight = async () => {
		await loop.waitForInFlight();
		throwTerminalDeliveryError();
	};
	const flush = async () => {
		await waitForInFlight();
		if (!streamState.stopped) await loop.flush();
		throwTerminalDeliveryError();
	};
	const requestDraftUpdate = (text, preview, onPlatformSendDispatch, assertPlatformSendAuthorized) => {
		if (streamState.stopped || streamState.final) return;
		lastRequestedPreview = preview;
		lastRequestedText = text;
		pendingPlatformSendDispatch = onPlatformSendDispatch;
		pendingPlatformSendAuthorization = assertPlatformSendAuthorized;
		updateDraft(text);
	};
	const requestLazyDraftUpdate = (resolveText) => {
		if (streamState.stopped || streamState.final) return;
		updateDraft({ resolveText });
	};
	const updatePreview = (preview) => {
		const text = preview.text.trimEnd();
		if (!text) return;
		requestDraftUpdate(text, {
			...preview,
			text
		});
	};
	const stop = async () => {
		const stopGeneration = generation;
		const waitForRetryAfter = async () => {
			const delayMs = Math.max(0, suspendedUntilMs - Date.now());
			if (delayMs > 0) await new Promise((resolve) => {
				setTimeout(resolve, delayMs);
			});
		};
		streamState.final = true;
		loop.resetThrottleWindow();
		await loop.waitForInFlight();
		throwTerminalDeliveryError();
		if (generation !== stopGeneration || streamState.stopped) return;
		await waitForRetryAfter();
		if (generation !== stopGeneration || streamState.stopped) return;
		await flush();
		if (generation !== stopGeneration || streamState.stopped) return;
		const finalText = lastRequestedText.trimEnd();
		if (finalText && finalText !== lastDeliveredText.trimEnd()) for (let attempt = 0; attempt < 2; attempt += 1) {
			await waitForRetryAfter();
			if (generation !== stopGeneration || streamState.stopped) return;
			const sent = await sendOrEditStreamMessage(finalText);
			throwTerminalDeliveryError();
			if (generation !== stopGeneration) return;
			if (sent) {
				loop.resetPending();
				break;
			}
			if (!finalPagePlan || streamState.stopped) break;
		}
		streamState.final = true;
		observeCurrentProviderMessage();
		await drainProviderMessageObservations();
		pendingPlatformSendDispatch = void 0;
		pendingPlatformSendAuthorization = void 0;
	};
	const remainingFinalContent = () => {
		const plan = finalPagePlan;
		if (!plan || plan.nextPageIndex <= 0 || plan.nextPageIndex >= plan.pages.length) return;
		const pages = plan.pages.slice(plan.nextPageIndex);
		const exactRemainingPage = resolveExactRemainingPage(plan);
		const sourceText = exactRemainingPage?.sourceText || pages.map((page) => page.sourceTextMode === "html" ? page.sourceText : escapeTelegramHtml(page.plainText)).join("");
		return {
			text: exactRemainingPage?.plainText ?? pages.map((page) => page.plainText).join(""),
			sourceText,
			sourceTextMode: "html"
		};
	};
	const resetStreamToNewMessage = (continueFinalPagination = false, retainCurrentProviderMessage = false) => {
		if (retainCurrentProviderMessage) observeCurrentProviderMessage();
		streamState.stopped = false;
		streamState.final = continueFinalPagination;
		if (!continueFinalPagination) generation += 1;
		messageSendAttempted = false;
		streamMessageId = void 0;
		streamMessageSnapshot = void 0;
		streamProviderMessage = void 0;
		streamVisibleSinceMs = void 0;
		lastSentPreviewKey = "";
		if (!continueFinalPagination) {
			finalPagePlan = void 0;
			lastRequestedText = "";
			lastDeliveredText = "";
			loop.resetPending();
			lastRequestedPreview = void 0;
		}
		loop.resetThrottleWindow();
	};
	const scheduleDetachedDelete = (messageId, visibleSince, minDelayMs = 0) => {
		const runDelete = async () => {
			try {
				if (!await params.api.deleteMessage(chatId, messageId)) {
					params.warn?.(`telegram stream preview cleanup was not confirmed (chat=${chatId}, message=${messageId})`);
					return;
				}
				if (replyTargetState.kind === "retained" && replyTargetState.messageId === messageId) replyTargetState = { kind: "available" };
				params.log?.(`telegram stream preview deleted (chat=${chatId}, message=${messageId})`);
			} catch (err) {
				params.warn?.(`telegram stream preview cleanup failed: ${formatErrorMessage(err)}`);
			}
		};
		const elapsedMs = typeof visibleSince === "number" ? Date.now() - visibleSince : MIN_PREVIEW_DWELL_MS;
		const remainingDwellMs = Math.max(0, MIN_PREVIEW_DWELL_MS - elapsedMs);
		const delayMs = Math.max(remainingDwellMs, minDelayMs);
		if (delayMs <= 0) runDelete();
		else setTimeout(() => {
			runDelete();
		}, delayMs);
	};
	const clear = async () => {
		const visibleSince = streamVisibleSinceMs;
		const messageId = await takeMessageIdAfterStop({
			stopForClear,
			readMessageId: () => streamMessageId,
			clearMessageId: () => {
				streamMessageId = void 0;
				streamMessageSnapshot = void 0;
				streamProviderMessage = void 0;
			}
		});
		if (typeof messageId === "number" && Number.isFinite(messageId)) scheduleDetachedDelete(messageId, visibleSince);
		await drainProviderMessageObservations();
	};
	const REPOSITION_DELETE_DELAY_MS = 1500;
	const rotateToNewMessageDeferringDelete = () => {
		const supersededMessageId = streamMessageId;
		const supersededVisibleSince = streamVisibleSinceMs;
		if (messageSendAttempted && streamMessageId === void 0) repositionedSendGenerations.add(generation);
		resetStreamToNewMessage();
		if (typeof supersededMessageId === "number" && Number.isFinite(supersededMessageId)) scheduleDetachedDelete(supersededMessageId, supersededVisibleSince, REPOSITION_DELETE_DELAY_MS);
	};
	params.log?.(`telegram stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update: (text, options) => requestDraftUpdate(text, void 0, options?.onPlatformSendDispatch, options?.assertPlatformSendAuthorized),
		updateLazy: requestLazyDraftUpdate,
		updatePreview,
		flush,
		waitForInFlight,
		messageId: () => streamMessageId,
		lastDeliveredText: () => lastDeliveredText,
		currentMessageSnapshot: () => {
			const ownsReplyTarget = !consumesReplyTarget || replyTargetState.kind === "retained" && replyTargetState.messageId === streamMessageId;
			return streamMessageSnapshot && ownsReplyTarget && replyToMessageId !== void 0 ? {
				...streamMessageSnapshot,
				replyToMessageId
			} : streamMessageSnapshot;
		},
		clear,
		stop,
		discard: async () => {
			await stopForClear();
			observeCurrentProviderMessage();
			await drainProviderMessageObservations();
		},
		remainingFinalContent,
		hasConsumedReplyTarget: () => replyTargetState.kind !== "available",
		forceNewMessage: () => resetStreamToNewMessage(false, true),
		rotateToNewMessageDeferringDelete,
		sendMayHaveLanded: () => messageSendAttempted && typeof streamMessageId !== "number"
	};
}
//#endregion
export { createTelegramDraftStream as t };
