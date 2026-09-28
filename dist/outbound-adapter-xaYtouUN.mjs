import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./channel-outbound-r_EvcKqq.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { s as sanitizeAssistantVisibleText } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import "./reply-payload-RBmrGrXG.mjs";
import "./number-runtime-CGwowceO.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-DO7ZNLRi.mjs";
import { i as createAttachedChannelResultAdapter, t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.mjs";
import { n as questionGatewayRuntime } from "./question-gateway-runtime-oU-LZ_Wg.mjs";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.mjs";
import { t as sanitizeForPlainText } from "./sanitize-text-q5V8Zg_l.mjs";
import "./text-chunking-zFGQSbFt.mjs";
import { a as resolveDefaultTelegramAccountId } from "./accounts-ByNW1Cs3.mjs";
import { o as normalizeTelegramOutboundTarget, s as parseTelegramTarget } from "./topic-conversation-BlxRQJEK.mjs";
import { i as parseTelegramThreadId, r as parseTelegramReplyToMessageId } from "./outbound-params-CEIp4vNq.mjs";
import { O as TELEGRAM_MAX_CAPTION_LENGTH, T as resolveTelegramPromptContextSource, b as createTelegramPromptContextProjectionCursor, j as telegramCaptionDeliveryMetadata, n as resolveTelegramTextChunkLimit, t as TELEGRAM_TEXT_CHUNK_LIMIT } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { a as resolveTelegramInlineButtons } from "./button-types-B1wFSdoZ.mjs";
import { n as resolveTelegramInteractiveTextFallback, r as resolveTelegramPresentationCapabilities, t as canonicalizeTelegramPresentationPayload } from "./interactive-fallback-JkJu-q0X.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-7FpL6hA6.mjs";
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
async function resolveTelegramSendContext(params) {
	return {
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
async function resolveTelegramOutboundSendContext(params) {
	const outboundTo = normalizeTelegramOutboundTarget(params.to);
	const { send, baseOpts } = await resolveTelegramSendContext(params);
	return {
		outboundTo,
		send,
		baseOpts
	};
}
function telegramRichTablesEnabled(params) {
	if (params.htmlTextMode) return false;
	return mergeTelegramAccountConfig(params.cfg, params.accountId ?? resolveDefaultTelegramAccountId(params.cfg)).richMessages === true;
}
function normalizeTelegramMetadataOnlyPayload(payload) {
	const telegramData = payload.channelData?.telegram;
	if (resolveTelegramInteractiveTextFallback({
		text: payload.text,
		interactive: payload.interactive,
		presentation: payload.presentation
	})?.trim() || resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0 || payload.location || payload.audioAsVoice === true || payload.videoAsNote === true || payload.presentation || payload.interactive) return payload;
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
		richTables: telegramRichTablesEnabled({
			cfg: params.baseOpts.cfg,
			accountId: params.baseOpts.accountId,
			htmlTextMode: params.baseOpts.textMode === "html"
		})
	});
	const telegramData = payload.channelData?.telegram;
	const quoteText = typeof telegramData?.quoteText === "string" ? telegramData.quoteText : void 0;
	const reactionEmoji = typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
	const text = resolveTelegramInteractiveTextFallback({
		text: payload.text,
		interactive: payload.interactive,
		presentation: payload.presentation
	}) ?? "";
	const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: payload.presentation,
		interactive: payload.interactive
	});
	const replyToMessageId = parseStrictPositiveInteger(telegramData?.reaction?.replyToId ?? params.baseOpts.replyToMessageId);
	const promptContextSource = resolveTelegramPromptContextSource(params.payload);
	const projectionCursor = promptContextSource ? createTelegramPromptContextProjectionCursor(promptContextSource) : void 0;
	const projectionOptions = (finalPart) => projectionCursor ? { promptContextProjectionPlan: {
		cursor: projectionCursor,
		finalPart
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
			...projectionOptions(true),
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
		...projectionOptions(true),
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
		preserveMarkdownDetails: ({ cfg, accountId }) => mergeTelegramAccountConfig(cfg, accountId ?? resolveDefaultTelegramAccountId(cfg)).richMessages === true,
		sanitizeText: ({ text, cfg, accountId }) => cfg && mergeTelegramAccountConfig(cfg, accountId ?? resolveDefaultTelegramAccountId(cfg)).richMessages === true ? sanitizeAssistantVisibleText(text) : sanitizeForPlainText(sanitizeAssistantVisibleText(text), { style: "markdown" }),
		shouldSuppressLocalPayloadPrompt: options.shouldSuppressLocalPayloadPrompt,
		beforeDeliverPayload: options.beforeDeliverPayload,
		shouldTreatDeliveredTextAsVisible: options.shouldTreatDeliveredTextAsVisible,
		targetsMatchForReplySuppression: options.targetsMatchForReplySuppression,
		preferFinalAssistantVisibleText: options.preferFinalAssistantVisibleText,
		normalizePayload: ({ payload }) => normalizeTelegramMetadataOnlyPayload(payload),
		normalizePayloadBatch: ({ payloads }) => normalizeTelegramFallbackPayloadBatch(payloads),
		presentationCapabilities: resolveTelegramPresentationCapabilities({ richMessages: false }),
		resolvePresentationCapabilities: ({ cfg, accountId, formatting }) => resolveTelegramPresentationCapabilities({ richMessages: telegramRichTablesEnabled({
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
			richTables: telegramRichTablesEnabled({
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
		resolveEffectiveTextChunkLimit: ({ cfg, accountId, formatting }) => resolveTelegramTextChunkLimit({
			cfg,
			accountId,
			formatting
		}),
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
				return toTelegramOutboundResult(await send(outboundTo, params.text, { ...baseOpts }));
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
