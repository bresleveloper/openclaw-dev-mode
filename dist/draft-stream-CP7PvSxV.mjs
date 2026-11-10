import { S as parseStrictInteger } from "./number-coercion-CkhMiRw8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { M as takeMessageIdAfterStop, j as createFinalizableDraftStreamControlsForState } from "./channel-outbound-BbIm36V0.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-CLjC4hNl.mjs";
import "./error-runtime-ikopZs5O.mjs";
import { f as isRetryableTelegramApiError, g as isTelegramClientRejection, l as TelegramRequestNotStartedError, p as isSafeToRetrySendError, x as isTelegramRateLimitError, y as isTelegramMessageNotModifiedError } from "./fetch-ZC4IpYLZ.mjs";
import "./reply-reference-DIbR84kt.mjs";
import { F as escapeTelegramHtml, J as runAuthorizedTelegramRequest, P as telegramHtmlToPlainTextFallback, Y as runReplaceableTelegramRequest, m as warnTelegramRichBlocksDegradations, o as removeTelegramRichNativeQuoteParam, r as TELEGRAM_RICH_TEXT_LIMIT, t as TELEGRAM_TEXT_CHUNK_LIMIT } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { c as buildTelegramThreadParams } from "./helpers-amKpwD-6.mjs";
import "./outbound-adapter-B3MANZEs.mjs";
import { T as planTelegramTextDeliveryPages, ft as buildTelegramThreadReplyParams, pt as withTelegramNativeQuoteFallback, w as deliverTelegramTextPage } from "./send-DWoEOMF4.mjs";
//#region extensions/telegram/src/draft-stream-message.ts
function toDraftSnapshot(page) {
	return {
		text: page.plainText,
		sourceText: page.sourceText,
		sourceTextMode: page.sourceTextMode
	};
}
async function deliverDraftPage(params) {
	const { page } = params;
	if (page.richMessage) warnTelegramRichBlocksDegradations({
		context: params.context,
		reasons: page.degradationReasons ?? [],
		warn: (message) => params.warn?.(message)
	});
	const send = async () => {
		const [delivery] = await deliverTelegramTextPage({
			page: {
				...page,
				degradationReasons: void 0
			},
			html: page.sourceTextMode === "html",
			context: params.context,
			warn: (message) => params.warn?.(message),
			fallbackLimit: Number.MAX_SAFE_INTEGER,
			sender: {
				sendPlain: (text) => params.send({ text }),
				sendHtml: (text) => params.send({
					text,
					parseMode: "HTML"
				}),
				sendRich: (richMessage) => params.send({
					text: page.plainText,
					richMessage
				})
			}
		});
		return {
			message: delivery.result,
			snapshot: toDraftSnapshot(delivery.page)
		};
	};
	return await (params.request ? params.request(send) : send());
}
async function editTelegramDraftMessage(params) {
	return (await deliverDraftPage({
		page: params.page,
		context: "stream preview edit",
		warn: params.warn,
		request: params.request,
		send: ({ text, parseMode, richMessage }) => {
			if (richMessage) return params.api.raw.editMessageText({
				chat_id: params.chatId,
				message_id: params.messageId,
				rich_message: richMessage
			});
			const other = parseMode ? {
				parse_mode: parseMode,
				...params.linkPreviewParams
			} : params.linkPreviewParams;
			return Object.keys(other).length > 0 ? params.api.editMessageText(params.chatId, params.messageId, text, other) : params.api.editMessageText(params.chatId, params.messageId, text);
		}
	})).snapshot;
}
async function sendTelegramDraftMessage(params) {
	const { chatId, linkPreviewParams, page, assertCurrentSend } = params;
	const sendPlannedMessage = (sendMessageParams) => deliverDraftPage({
		page,
		context: "stream preview",
		warn: params.warn,
		send: ({ text, parseMode, richMessage }) => {
			assertCurrentSend();
			return richMessage ? params.api.raw.sendRichMessage({
				chat_id: chatId,
				rich_message: richMessage,
				...sendMessageParams
			}) : params.api.sendMessage(chatId, text, {
				...parseMode ? { parse_mode: parseMode } : {},
				...sendMessageParams,
				...linkPreviewParams
			});
		}
	});
	return (await withTelegramNativeQuoteFallback({
		label: "stream-preview",
		requestParams: params.sendMessageParams,
		...params.page.richMessage ? { removeNativeQuoteParam: removeTelegramRichNativeQuoteParam } : {},
		request: sendPlannedMessage
	})).result;
}
//#endregion
//#region extensions/telegram/src/draft-stream.ts
const DEFAULT_THROTTLE_MS = 1e3;
const MAX_CONSECUTIVE_PREVIEW_FAILURES = 3;
const MIN_PREVIEW_DWELL_MS = 4e3;
function createTelegramDraftStream(params) {
	const richMessages = params.richMessages === true;
	const transportLimit = richMessages ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	const maxChars = Math.min(params.maxChars ?? transportLimit, transportLimit);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const minInitialChars = params.minInitialChars;
	const chatId = params.chatId;
	const threadParams = buildTelegramThreadParams(params.thread);
	const replyToMessageId = parseStrictInteger(params.replyToMessageId);
	const initialSendMessageParams = {
		...threadParams,
		...buildTelegramThreadReplyParams({
			replyToMessageId,
			replyQuoteMessageId: replyToMessageId,
			replyQuoteText: params.replyQuote?.text,
			replyQuotePosition: params.replyQuote?.position,
			replyQuoteEntities: params.replyQuote?.entities,
			nativeReply: true
		})
	};
	const consumesReplyTarget = replyToMessageId != null && params.replyToMode !== void 0 && isSingleUseReplyToMode(params.replyToMode);
	let replyTargetState = { kind: "available" };
	const reserveReplyTargetForSend = () => {
		if (!consumesReplyTarget) return initialSendMessageParams;
		if (replyTargetState.kind !== "available") return threadParams ?? {};
		replyTargetState = { kind: "pending" };
		return initialSendMessageParams;
	};
	const settlePendingReplyTarget = (messageId) => {
		if (replyTargetState.kind === "pending") replyTargetState = messageId === void 0 ? { kind: "available" } : {
			kind: "retained",
			messageId
		};
	};
	const streamState = {
		stopped: false,
		final: false
	};
	let messageSendAttempted = false;
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
	let requestedUpdates = 0;
	let finalPagePlan;
	let supersededPreviews = [];
	const previewRequest = (assertCurrent, run) => runAuthorizedTelegramRequest(assertCurrent, () => streamState.final ? run() : runReplaceableTelegramRequest(run));
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
	const sendMessageTransportPreview = async (page, disableLinkPreview) => {
		const linkPreviewParams = disableLinkPreview ? { link_preview_options: { is_disabled: true } } : {};
		if (pendingPlatformSendDispatch) {
			await pendingPlatformSendDispatch();
			pendingPlatformSendDispatch = void 0;
		}
		const assertPlatformSendAuthorized = pendingPlatformSendAuthorization;
		assertPlatformSendAuthorized?.();
		const targetMessageId = streamMessageId;
		if (typeof targetMessageId === "number") {
			streamMessageSnapshot = await editTelegramDraftMessage({
				api: params.api,
				chatId,
				messageId: targetMessageId,
				page,
				linkPreviewParams,
				warn: params.warn,
				request: (send) => previewRequest(assertPlatformSendAuthorized, send)
			});
			return true;
		}
		messageSendAttempted = true;
		const sendMessageParams = reserveReplyTargetForSend();
		let sent;
		try {
			sent = await previewRequest(assertPlatformSendAuthorized, () => sendTelegramDraftMessage({
				api: params.api,
				chatId,
				page,
				sendMessageParams,
				linkPreviewParams,
				warn: params.warn,
				assertCurrentSend: () => {
					if (streamState.stopped) throw new TelegramRequestNotStartedError("Telegram preview stopped");
					assertPlatformSendAuthorized?.();
				}
			}));
		} catch (err) {
			if (isSafeToRetrySendError(err) || isTelegramClientRejection(err)) {
				messageSendAttempted = false;
				settlePendingReplyTarget();
			}
			throw err;
		}
		const sentMessageId = sent.message?.message_id;
		const normalizedMessageId = typeof sentMessageId === "number" && Number.isFinite(sentMessageId) ? Math.trunc(sentMessageId) : void 0;
		if (normalizedMessageId === void 0) {
			streamState.stopped = true;
			params.warn?.("telegram stream preview stopped (missing message id from sendMessage)");
			return false;
		}
		settlePendingReplyTarget(normalizedMessageId);
		const adoptSentMessage = () => {
			streamMessageId = normalizedMessageId;
			streamMessageSnapshot = sent.snapshot;
			streamProviderMessage = sent.message;
			streamVisibleSinceMs = Date.now();
		};
		try {
			if (params.validateProviderMessage) await params.validateProviderMessage(sent.message);
		} catch (error) {
			terminalDeliveryError ??= error instanceof Error ? error : new Error(formatErrorMessage(error));
			streamState.stopped = true;
			adoptSentMessage();
			return false;
		}
		adoptSentMessage();
		retireSupersededPreviews();
		return true;
	};
	const sendOrEditPlannedPage = async (page, complete = false, disableLinkPreview = params.linkPreview === false) => {
		const renderedPreviewKey = JSON.stringify([
			page.sourceTextMode,
			page.sourceText,
			page.richMessage?.skip_entity_detection === true,
			disableLinkPreview
		]);
		if (renderedPreviewKey === lastSentPreviewKey) return true;
		if (typeof streamMessageId !== "number" && minInitialChars != null && !streamState.final && !complete && page.plainText.length < minInitialChars) return false;
		const previousSentPreviewKey = lastSentPreviewKey;
		lastSentPreviewKey = renderedPreviewKey;
		const updateAtSend = requestedUpdates;
		const settleAuthorization = () => {
			if (requestedUpdates === updateAtSend) pendingPlatformSendAuthorization = void 0;
		};
		try {
			const sent = await sendMessageTransportPreview(page, disableLinkPreview);
			if (sent) settleAuthorization();
			if (sent) consecutivePreviewFailures = 0;
			return sent;
		} catch (err) {
			const isEdit = typeof streamMessageId === "number";
			if (isEdit && isTelegramMessageNotModifiedError(err)) {
				settleAuthorization();
				consecutivePreviewFailures = 0;
				streamMessageSnapshot = toDraftSnapshot(page);
				return true;
			}
			lastSentPreviewKey = previousSentPreviewKey;
			if (!streamState.final && isTelegramRateLimitError(err)) return false;
			const retryable = isTelegramRateLimitError(err) || (isEdit ? isRetryableTelegramApiError(err) : isSafeToRetrySendError(err));
			consecutivePreviewFailures += 1;
			if (retryable && consecutivePreviewFailures <= MAX_CONSECUTIVE_PREVIEW_FAILURES) {
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
		const disableLinkPreview = fullPreview.linkPreview === false || params.linkPreview === false;
		if (!streamState.final) {
			finalPagePlan = void 0;
			const sent = await sendOrEditPlannedPage(firstPage, fullPreview.complete, disableLinkPreview);
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
				resetStreamToNewMessage("page");
			}
			if (!await sendOrEditPlannedPage(page, false, disableLinkPreview)) return false;
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
	const requestDraftUpdate = (update, preview, onPlatformSendDispatch, assertPlatformSendAuthorized) => {
		if (streamState.stopped || streamState.final) return;
		if (typeof update === "string") {
			lastRequestedPreview = preview;
			lastRequestedText = update;
			pendingPlatformSendDispatch = onPlatformSendDispatch;
		}
		pendingPlatformSendAuthorization = assertPlatformSendAuthorized;
		requestedUpdates += 1;
		updateDraft(update);
	};
	const stop = async () => {
		streamState.final = true;
		loop.resetThrottleWindow();
		await loop.waitForInFlight();
		throwTerminalDeliveryError();
		if (streamState.stopped) return;
		await flush();
		if (streamState.stopped) return;
		const finalText = lastRequestedText.trimEnd();
		if (finalText && finalText !== lastDeliveredText.trimEnd()) for (let attempt = 0; attempt < 2; attempt += 1) {
			const sent = await sendOrEditStreamMessage(finalText);
			throwTerminalDeliveryError();
			if (sent) {
				loop.resetPending();
				break;
			}
			if (!finalPagePlan || streamState.stopped) break;
		}
		streamState.final = true;
		observeCurrentProviderMessage();
		await Promise.all(pendingProviderObservations);
		pendingPlatformSendDispatch = void 0;
		pendingPlatformSendAuthorization = void 0;
	};
	/** Prepared final content not yet accepted after retained pagination pages. */
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
	const resetStreamToNewMessage = (mode) => {
		const continueFinalPagination = mode === "page";
		if (mode === "retain") observeCurrentProviderMessage();
		streamState.stopped = false;
		streamState.final = continueFinalPagination;
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
			pendingPlatformSendAuthorization = void 0;
			requestedUpdates += 1;
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
	const retireSupersededPreviews = () => {
		const previews = supersededPreviews;
		supersededPreviews = [];
		for (const { messageId, visibleSinceMs } of previews) scheduleDetachedDelete(messageId, visibleSinceMs, REPOSITION_DELETE_DELAY_MS);
	};
	const retireWhenReplaced = (messageId, visibleSinceMs) => {
		supersededPreviews.push({
			messageId,
			visibleSinceMs
		});
		if (typeof streamMessageId === "number") retireSupersededPreviews();
	};
	const clear = async () => {
		retireSupersededPreviews();
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
		retireSupersededPreviews();
		if (typeof messageId === "number" && Number.isFinite(messageId)) scheduleDetachedDelete(messageId, visibleSince);
		await Promise.all(pendingProviderObservations);
	};
	const REPOSITION_DELETE_DELAY_MS = 1500;
	/** Rewind and delete the superseded preview only after its replacement lands. */
	const rotateToNewMessageDeferringDelete = () => {
		const supersededMessageId = streamMessageId;
		const supersededVisibleSince = streamVisibleSinceMs;
		resetStreamToNewMessage("replace");
		if (typeof supersededMessageId === "number" && Number.isFinite(supersededMessageId)) retireWhenReplaced(supersededMessageId, supersededVisibleSince);
	};
	params.log?.(`telegram stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update: (text, options) => requestDraftUpdate(text, void 0, options?.onPlatformSendDispatch, options?.assertPlatformSendAuthorized),
		updateLazy: (resolveText) => requestDraftUpdate({ resolveText }),
		updatePreview: (preview, assertPlatformSendAuthorized) => {
			const text = preview.text.trimEnd();
			if (!text) return;
			requestDraftUpdate(text, {
				...preview,
				text
			}, void 0, assertPlatformSendAuthorized);
		},
		flush,
		waitForInFlight,
		messageId: () => streamMessageId,
		lastDeliveredText: () => lastDeliveredText,
		/** A failed preview stops editing for good; it can no longer carry live progress. */
		isStopped: () => streamState.stopped,
		currentMessageSnapshot: () => {
			const ownsReplyTarget = !consumesReplyTarget || replyTargetState.kind === "retained" && replyTargetState.messageId === streamMessageId;
			return streamMessageSnapshot && ownsReplyTarget && replyToMessageId !== void 0 ? {
				...streamMessageSnapshot,
				replyToMessageId
			} : streamMessageSnapshot;
		},
		clear,
		stop,
		/** Stop without a final flush or delete. */
		discard: async () => {
			await stopForClear();
			observeCurrentProviderMessage();
			await Promise.all(pendingProviderObservations);
		},
		remainingFinalContent,
		/** True while a pending or visible draft owns a first/batched reply target. */
		hasConsumedReplyTarget: () => replyTargetState.kind !== "available",
		/** Reset internal state so the next update creates a new message instead of editing. */
		forceNewMessage: () => resetStreamToNewMessage("retain"),
		rotateToNewMessageDeferringDelete,
		/** True when a preview sendMessage was attempted but the response was lost. */
		sendMayHaveLanded: () => messageSendAttempted && typeof streamMessageId !== "number"
	};
}
//#endregion
export { createTelegramDraftStream as t };
