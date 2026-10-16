import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { y as resolveOutboundSendDep } from "./channel-outbound-DBuu65Vg.mjs";
import { s as sanitizeAssistantVisibleText } from "./assistant-visible-text-Bv6mP5pg.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BtASEhL4.mjs";
import "./reply-payload-DEDOYf-L.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { i as createAttachedChannelResultAdapter, t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.mjs";
import { n as questionGatewayRuntime } from "./question-gateway-runtime-BgZAXKlS.mjs";
import { t as sanitizeForPlainText } from "./sanitize-text-DsEmcKIF.mjs";
import "./text-chunking-BiSt_d1B.mjs";
import { c as normalizeTelegramOutboundTarget, l as parseTelegramTarget } from "./topic-conversation-C-lzScEI.mjs";
import { D as telegramCaptionDeliveryMetadata, U as resolveTelegramRichMessages, g as createTelegramPromptContextProjectionCursor, n as resolveTelegramTextChunkLimit, t as TELEGRAM_TEXT_CHUNK_LIMIT, w as TELEGRAM_MAX_CAPTION_LENGTH, x as resolveTelegramPromptContextSource } from "./text-chunk-limit-BgiLU1vv.mjs";
import { G as parseTelegramReplyToMessageId, K as parseTelegramThreadId } from "./helpers-DLD_tZ6z.mjs";
import { a as resolveTelegramInlineButtons } from "./button-types-DwzDJv5i.mjs";
import { n as canonicalizeTelegramPresentationPayload, o as resolveTelegramInteractiveTextFallback, s as resolveTelegramPresentationCapabilities } from "./interactive-fallback-vX-64igY.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-CECbxi5D.mjs";
//#region extensions/telegram/src/question-finalization.ts
function registerTelegramQuestionDelivery(params) {
	const questionId = questionGatewayRuntime.readAskUserQuestionId(params.payload);
	const text = params.text.trim();
	if (!questionId || !text) return;
	const { accountId, chatId, messageId, textLimit, clearButtons, annotate } = params;
	const deliveryId = `telegram:${accountId ?? "default"}:${chatId}:${messageId}`;
	questionGatewayRuntime.registerChannelDelivery({
		questionId,
		deliveryId,
		finalize: async (statusLine) => {
			await clearButtons();
			const limit = Math.max(0, Math.floor(textLimit));
			const suffix = truncateUtf16Safe(statusLine.trim(), Math.min(512, limit));
			const separator = suffix && limit - suffix.length >= 2 ? "\n\n" : "";
			const prefix = truncateUtf16Safe(text, limit - separator.length - suffix.length);
			await annotate(`${prefix}${separator}${suffix}`);
		}
	});
}
//#endregion
//#region extensions/telegram/src/outbound-adapter.ts
const TELEGRAM_POLL_OPTION_LIMIT = 12;
function toTelegramOutboundResult(result) {
	const { chatId, ...delivery } = result;
	return chatId === void 0 ? delivery : {
		...delivery,
		target: {
			kind: "chat",
			id: chatId
		}
	};
}
async function resolveDefaultTelegramSend(deps) {
	return resolveOutboundSendDep(deps, "telegram") ?? (await loadTelegramSendModule()).sendMessageTelegram;
}
async function resolveTelegramOutboundSendContext(params) {
	return {
		outboundTo: normalizeTelegramOutboundTarget(params.to),
		send: await params.resolveSend(params.deps),
		baseOpts: {
			verbose: false,
			cfg: params.cfg,
			messageThreadId: parseTelegramThreadId(params.threadId),
			replyToMessageId: parseTelegramReplyToMessageId(params.replyToId),
			...params.replyToIdSource !== void 0 ? { replyToIdSource: params.replyToIdSource } : {},
			...params.replyToMode !== void 0 ? { replyToMode: params.replyToMode } : {},
			accountId: params.accountId ?? void 0,
			silent: params.silent,
			signal: params.signal,
			gatewayClientScopes: params.gatewayClientScopes,
			onDeliveryResult: params.onDeliveryResult ? async (result) => {
				await params.onDeliveryResult?.(attachChannelToResult("telegram", toTelegramOutboundResult(result)));
			} : void 0,
			onPlatformSendDispatch: params.onPlatformSendDispatch,
			assertPlatformSendAuthorized: params.assertDirectAdapterHandoff,
			...params.formatting?.parseMode === "HTML" ? { textMode: "html" } : {},
			tableMode: params.formatting?.tableMode,
			textLimit: params.formatting?.textLimit,
			chunkMode: params.formatting?.chunkMode
		}
	};
}
function normalizeTelegramMetadataOnlyPayload(payload) {
	const telegramData = payload.channelData?.telegram;
	if (resolveTelegramInteractiveTextFallback(payload)?.trim() || resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0 || payload.location || payload.audioAsVoice === true || payload.videoAsNote === true || payload.presentation || payload.interactive) return payload;
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: payload.presentation,
		interactive: payload.interactive
	});
	const hasQuoteText = typeof telegramData?.quoteText === "string" && Boolean(telegramData.quoteText.trim());
	if (typeof telegramData?.reaction?.emoji === "string" && Boolean(telegramData.reaction.emoji.trim()) && !buttons?.length && !hasQuoteText) return payload;
	const fallbackText = payload.fallbackText?.text.trim();
	if (!buttons?.length && !hasQuoteText) return null;
	return fallbackText ? {
		...payload,
		text: fallbackText
	} : null;
}
function mergeTelegramFallbackPayloads(source, adopter) {
	const sourceTelegram = source.channelData?.telegram;
	const adopterTelegram = adopter.channelData?.telegram;
	const buttons = [...sourceTelegram?.buttons ?? [], ...adopterTelegram?.buttons ?? []];
	const quoteText = sourceTelegram?.quoteText?.trim() ? sourceTelegram.quoteText : adopterTelegram?.quoteText;
	const telegram = sourceTelegram || adopterTelegram ? {
		...adopterTelegram,
		...sourceTelegram,
		...buttons.length > 0 ? { buttons } : {},
		...quoteText ? { quoteText } : {}
	} : void 0;
	return {
		...adopter,
		...source,
		fallbackText: adopter.fallbackText,
		channelData: {
			...adopter.channelData,
			...source.channelData,
			...telegram ? { telegram } : {}
		}
	};
}
function normalizeTelegramFallbackPayloadBatch(entries) {
	const normalized = entries.map((entry) => entry.payload);
	const positions = new Map(entries.map((entry, position) => [entry.index, position]));
	for (const [position, entry] of entries.entries()) {
		const fallback = entry.payload.fallbackText;
		if (fallback?.replacesPayloadIndex === void 0 || entry.payload.text?.trim() !== fallback.text.trim() || entry.payload.interactive || entry.payload.presentation || resolveSendableOutboundReplyParts(entry.payload).mediaUrls.length > 0 || entry.payload.location || entry.payload.audioAsVoice === true || entry.payload.videoAsNote === true) continue;
		const channelData = entry.payload.channelData;
		const channelDataKeys = channelData ? Object.keys(channelData) : [];
		const telegramData = channelData?.telegram;
		if (channelDataKeys.length !== 1 || channelDataKeys[0] !== "telegram" || !telegramData?.buttons?.length || telegramData.quoteText?.trim() || telegramData.reaction) continue;
		const sourcePosition = positions.get(fallback.replacesPayloadIndex);
		if (sourcePosition === void 0) continue;
		const source = normalized[sourcePosition];
		if (!source || source.text?.trim() !== fallback.text.trim()) continue;
		normalized[sourcePosition] = mergeTelegramFallbackPayloads(source, entry.payload);
		normalized[position] = null;
	}
	return normalized;
}
async function sendTelegramPayloadMessages(params) {
	const payload = canonicalizeTelegramPresentationPayload(params.payload, {
		allowWebAppButtons: parseTelegramTarget(params.to).chatType === "direct",
		richTables: resolveTelegramRichMessages({
			cfg: params.baseOpts.cfg,
			accountId: params.baseOpts.accountId,
			htmlTextMode: params.baseOpts.textMode === "html"
		})
	});
	const telegramData = payload.channelData?.telegram;
	const quoteText = typeof telegramData?.quoteText === "string" ? telegramData.quoteText : void 0;
	const reactionEmoji = typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
	const text = resolveTelegramInteractiveTextFallback(payload) ?? "";
	const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: payload.presentation,
		interactive: payload.interactive
	});
	const replyToMessageId = parseStrictPositiveInteger(telegramData?.reaction?.replyToId ?? params.baseOpts.replyToMessageId);
	const promptContextSource = resolveTelegramPromptContextSource(params.payload);
	const projectionCursor = promptContextSource ? createTelegramPromptContextProjectionCursor(promptContextSource) : void 0;
	const projectionOptions = projectionCursor ? { promptContextProjectionPlan: {
		cursor: projectionCursor,
		finalPart: true
	} } : {};
	const payloadOpts = {
		...params.baseOpts,
		quoteText,
		...payload.audioAsVoice === true ? { asVoice: true } : {},
		...payload.videoAsNote === true ? { asVideoNote: true } : {}
	};
	if (payload.location) {
		if (mediaUrls.length > 0 || reactionEmoji || payload.audioAsVoice === true || payload.videoAsNote === true) throw new Error("Telegram location sends cannot be combined with media or reactions.");
		if (text.trim()) await params.send(params.to, text, {
			...params.baseOpts,
			replyToMessageId: void 0,
			replyToIdSource: void 0,
			replyToMode: void 0
		});
		return await params.sendLocation(params.to, payload.location, {
			...params.baseOpts,
			...projectionOptions,
			buttons,
			quoteText
		});
	}
	if (payload.videoAsNote === true && mediaUrls.length !== 1) throw new Error("Telegram video notes require exactly one media attachment.");
	if (reactionEmoji) {
		if (typeof replyToMessageId !== "number") throw new Error("Telegram reaction requires a reply target");
		await params.baseOpts.onPlatformSendDispatch?.();
		params.baseOpts.signal?.throwIfAborted();
		params.baseOpts.assertPlatformSendAuthorized?.();
		const reactionResult = await params.react(params.to, replyToMessageId, reactionEmoji, {
			cfg: params.baseOpts.cfg,
			accountId: params.baseOpts.accountId,
			gatewayClientScopes: params.baseOpts.gatewayClientScopes,
			signal: params.baseOpts.signal,
			assertPlatformSendAuthorized: params.baseOpts.assertPlatformSendAuthorized,
			verbose: false
		});
		if (!reactionResult.ok) throw new Error(reactionResult.warning);
	}
	if (reactionEmoji && !text && mediaUrls.length === 0 && !buttons?.length) return {
		messageId: String(replyToMessageId),
		chatId: params.to
	};
	return await params.send(params.to, text, {
		...payloadOpts,
		...projectionOptions,
		...mediaUrls.length === 1 ? { mediaUrl: mediaUrls[0] } : mediaUrls.length > 1 ? { mediaUrls } : {},
		buttons
	});
}
function createTelegramOutboundAdapter(options = {}) {
	const resolveSend = options.resolveSend ?? resolveDefaultTelegramSend;
	const loadSendModule = options.loadSendModule ?? loadTelegramSendModule;
	return {
		deliveryMode: "direct",
		sendPayloadGroupsMedia: true,
		chunker: null,
		extractMarkdownImages: true,
		textChunkLimit: TELEGRAM_TEXT_CHUNK_LIMIT,
		preserveMarkdownDetails: ({ cfg, accountId }) => resolveTelegramRichMessages({
			cfg,
			accountId
		}),
		sanitizeText: ({ text, cfg, accountId }) => cfg && resolveTelegramRichMessages({
			cfg,
			accountId
		}) ? sanitizeAssistantVisibleText(text) : sanitizeForPlainText(sanitizeAssistantVisibleText(text), { style: "markdown" }),
		shouldSuppressLocalPayloadPrompt: options.shouldSuppressLocalPayloadPrompt,
		beforeDeliverPayload: options.beforeDeliverPayload,
		shouldTreatDeliveredTextAsVisible: options.shouldTreatDeliveredTextAsVisible,
		targetsMatchForReplySuppression: options.targetsMatchForReplySuppression,
		preferFinalAssistantVisibleText: options.preferFinalAssistantVisibleText,
		normalizePayload: ({ payload }) => normalizeTelegramMetadataOnlyPayload(payload),
		normalizePayloadBatch: ({ payloads }) => normalizeTelegramFallbackPayloadBatch(payloads),
		presentationCapabilities: resolveTelegramPresentationCapabilities({ richMessages: false }),
		resolvePresentationCapabilities: ({ cfg, accountId, formatting }) => resolveTelegramPresentationCapabilities({ richMessages: resolveTelegramRichMessages({
			cfg,
			accountId,
			htmlTextMode: formatting?.parseMode === "HTML"
		}) }),
		deliveryCapabilities: {
			pin: true,
			durableFinal: {
				text: true,
				media: true,
				payload: true,
				silent: true,
				replyTo: true,
				thread: true,
				nativeQuote: false,
				messageSendingHooks: true,
				batch: true
			}
		},
		renderPresentation: ({ payload, presentation, ctx }) => canonicalizeTelegramPresentationPayload({
			...payload,
			presentation
		}, {
			allowWebAppButtons: parseTelegramTarget(ctx.to ?? "").chatType === "direct",
			richTables: resolveTelegramRichMessages({
				cfg: ctx.cfg,
				accountId: ctx.accountId,
				htmlTextMode: ctx.formatting?.parseMode === "HTML"
			})
		}),
		afterDeliverPayload: ({ cfg, target, payload, results }) => {
			const telegramResults = results.filter((candidate) => candidate.channel === "telegram" && candidate.messageId);
			const result = telegramResults.find((candidate) => candidate.meta?.telegramHasInlineKeyboard === true) ?? telegramResults.at(-1);
			const text = (typeof result?.meta?.telegramDeliveredText === "string" ? result.meta.telegramDeliveredText : payload.text)?.trim();
			if (!result || !text) return;
			const chatId = result.target?.kind === "chat" ? result.target.id : normalizeTelegramOutboundTarget(target.to);
			const messageId = result.messageId;
			const accountId = target.accountId ?? void 0;
			const deliveredPart = result.receipt?.parts.find((part) => part.platformMessageId === messageId);
			const isCaptionDelivery = deliveredPart?.kind === "media" || deliveredPart?.kind !== "text" && result.meta !== void 0 && telegramCaptionDeliveryMetadata.has(result.meta);
			registerTelegramQuestionDelivery({
				accountId,
				chatId,
				messageId,
				payload,
				text,
				textLimit: isCaptionDelivery ? TELEGRAM_MAX_CAPTION_LENGTH : TELEGRAM_TEXT_CHUNK_LIMIT,
				clearButtons: async () => {
					const { editMessageReplyMarkupTelegram } = await loadSendModule();
					await editMessageReplyMarkupTelegram(chatId, messageId, [], {
						cfg,
						accountId,
						verbose: false
					});
				},
				annotate: async (finalText) => {
					const { editMessageTelegram } = await loadSendModule();
					await editMessageTelegram(chatId, messageId, finalText, {
						cfg,
						accountId,
						verbose: false,
						...isCaptionDelivery ? { editMode: "caption" } : {}
					});
				}
			});
		},
		pinDeliveredMessage: async ({ cfg, target, messageId, pin, gatewayClientScopes, assertDirectAdapterHandoff }) => {
			const { pinMessageTelegram } = await loadSendModule();
			const outboundTo = normalizeTelegramOutboundTarget(target.to);
			await pinMessageTelegram(parseTelegramTarget(outboundTo).chatId, messageId, {
				cfg,
				accountId: target.accountId ?? void 0,
				notify: pin.notify,
				verbose: false,
				gatewayClientScopes,
				assertPlatformSendAuthorized: assertDirectAdapterHandoff
			});
		},
		resolveEffectiveTextChunkLimit: resolveTelegramTextChunkLimit,
		pollMaxOptions: TELEGRAM_POLL_OPTION_LIMIT,
		supportsPollDurationSeconds: true,
		supportsAnonymousPolls: true,
		...createAttachedChannelResultAdapter({
			channel: "telegram",
			sendText: async (params) => {
				const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
					...params,
					resolveSend
				});
				return toTelegramOutboundResult(await send(outboundTo, params.text, baseOpts));
			},
			sendMedia: async (params) => {
				const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
					...params,
					resolveSend
				});
				return toTelegramOutboundResult(await send(outboundTo, params.text, {
					...baseOpts,
					mediaUrl: params.mediaUrl,
					...params.mediaAccess !== void 0 ? { mediaAccess: params.mediaAccess } : {},
					mediaLocalRoots: params.mediaLocalRoots,
					mediaReadFile: params.mediaReadFile,
					forceDocument: params.forceDocument ?? false
				}));
			}
		}),
		sendPayload: async (params) => {
			const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
				...params,
				resolveSend
			});
			const { reactMessageTelegram, sendLocationTelegram } = await loadSendModule();
			const result = await sendTelegramPayloadMessages({
				send,
				sendLocation: sendLocationTelegram,
				react: reactMessageTelegram,
				to: outboundTo,
				payload: params.payload,
				baseOpts: {
					...baseOpts,
					...params.mediaAccess !== void 0 ? { mediaAccess: params.mediaAccess } : {},
					mediaLocalRoots: params.mediaLocalRoots,
					mediaReadFile: params.mediaReadFile,
					forceDocument: params.forceDocument ?? false
				}
			});
			return attachChannelToResult("telegram", toTelegramOutboundResult(result));
		},
		sendPoll: async ({ cfg, to, poll, accountId, threadId, silent, isAnonymous, gatewayClientScopes, onPlatformSendDispatch, assertDirectAdapterHandoff }) => {
			const outboundTo = normalizeTelegramOutboundTarget(to);
			const { sendPollTelegram } = await loadSendModule();
			return await sendPollTelegram(outboundTo, poll, {
				cfg,
				accountId: accountId ?? void 0,
				messageThreadId: parseTelegramThreadId(threadId),
				silent: silent ?? void 0,
				isAnonymous: isAnonymous ?? void 0,
				gatewayClientScopes,
				onPlatformSendDispatch,
				assertPlatformSendAuthorized: assertDirectAdapterHandoff
			});
		}
	};
}
const telegramOutbound = createTelegramOutboundAdapter();
//#endregion
export { registerTelegramQuestionDelivery as i, sendTelegramPayloadMessages as n, telegramOutbound as r, createTelegramOutboundAdapter as t };
