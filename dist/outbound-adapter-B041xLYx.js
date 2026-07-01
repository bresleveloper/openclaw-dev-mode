import { p as resolvePayloadMediaUrls, y as sendPayloadMediaSequenceOrFallback } from "./reply-payload-CBQ2d2jT.js";
import { f as renderMessagePresentationFallbackText, l as normalizeMessagePresentation } from "./payload-BCsfdv86.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-ulm_3glE.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import "./reply-chunking-DDVYtWXI.js";
import "./channel-outbound-BNKGCEf1.js";
import { i as createAttachedChannelResultAdapter, t as attachChannelToResult } from "./channel-send-result-Dn_C6AJS.js";
import { a as parseTelegramTarget, i as normalizeTelegramOutboundTarget } from "./targets-CDtCx0Zi.js";
import { ot as parseTelegramReplyToMessageId, st as parseTelegramThreadId } from "./sent-message-cache-lP89voPo.js";
import { t as resolveTelegramInlineButtons } from "./button-types-BGJo6wbt.js";
import { u as splitTelegramHtmlChunks } from "./format-CHihbmMp.js";
import { t as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-Be7HQI62.js";
import { t as loadTelegramSendModule } from "./send-runtime-DRx5JlWc.js";
//#region extensions/telegram/src/outbound-adapter.ts
const TELEGRAM_TEXT_CHUNK_LIMIT = 4e3;
async function resolveDefaultTelegramSend(deps) {
	return resolveOutboundSendDep(deps, "telegram") ?? (await loadTelegramSendModule()).sendMessageTelegram;
}
function chunkTelegramOutboundText(text, limit, ctx) {
	return ctx?.formatting?.parseMode === "HTML" ? splitTelegramHtmlChunks(text, limit) : chunkMarkdownTextWithMode(text, limit, ctx?.formatting?.chunkMode ?? "length");
}
async function resolveTelegramSendContext(params) {
	return {
		send: await params.resolveSend(params.deps),
		baseOpts: {
			verbose: false,
			cfg: params.cfg,
			messageThreadId: parseTelegramThreadId(params.threadId),
			replyToMessageId: parseTelegramReplyToMessageId(params.replyToId),
			accountId: params.accountId ?? void 0,
			silent: params.silent,
			gatewayClientScopes: params.gatewayClientScopes,
			...params.formatting?.parseMode === "HTML" ? { textMode: "html" } : {},
			tableMode: params.formatting?.tableMode
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
async function sendTelegramPayloadMessages(params) {
	const telegramData = params.payload.channelData?.telegram;
	const quoteText = typeof telegramData?.quoteText === "string" ? telegramData.quoteText : void 0;
	const reactionEmoji = typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
	const presentation = normalizeMessagePresentation(params.payload.presentation);
	const text = resolveTelegramInteractiveTextFallback({
		text: params.payload.text,
		interactive: params.payload.interactive,
		presentation
	}) ?? "";
	const mediaUrls = resolvePayloadMediaUrls(params.payload);
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation,
		interactive: params.payload.interactive
	});
	const replyToMessageId = params.baseOpts.replyToMessageId;
	const payloadOpts = {
		...params.baseOpts,
		quoteText,
		...params.payload.audioAsVoice === true ? { asVoice: true } : {}
	};
	if (reactionEmoji) {
		if (typeof replyToMessageId !== "number") throw new Error("Telegram reaction requires a reply target");
		const reactionResult = await params.react(params.to, replyToMessageId, reactionEmoji, {
			cfg: params.baseOpts.cfg,
			accountId: params.baseOpts.accountId,
			gatewayClientScopes: params.baseOpts.gatewayClientScopes,
			verbose: false
		});
		if (!reactionResult.ok) throw new Error(reactionResult.warning);
	}
	if (reactionEmoji && !text && mediaUrls.length === 0 && !buttons?.length) return {
		messageId: String(replyToMessageId),
		chatId: params.to
	};
	return await sendPayloadMediaSequenceOrFallback({
		text,
		mediaUrls,
		fallbackResult: {
			messageId: "unknown",
			chatId: params.to
		},
		sendNoMedia: async () => await params.send(params.to, text, {
			...payloadOpts,
			buttons
		}),
		send: async ({ text: textLocal, mediaUrl, isFirst }) => await params.send(params.to, textLocal, {
			...payloadOpts,
			mediaUrl,
			...isFirst ? { buttons } : {}
		})
	});
}
function createTelegramOutboundAdapter(options = {}) {
	const resolveSend = options.resolveSend ?? resolveDefaultTelegramSend;
	const loadSendModule = options.loadSendModule ?? loadTelegramSendModule;
	return {
		deliveryMode: "direct",
		chunker: chunkTelegramOutboundText,
		chunkerMode: "markdown",
		extractMarkdownImages: true,
		textChunkLimit: TELEGRAM_TEXT_CHUNK_LIMIT,
		shouldSuppressLocalPayloadPrompt: options.shouldSuppressLocalPayloadPrompt,
		beforeDeliverPayload: options.beforeDeliverPayload,
		shouldTreatDeliveredTextAsVisible: options.shouldTreatDeliveredTextAsVisible,
		targetsMatchForReplySuppression: options.targetsMatchForReplySuppression,
		preferFinalAssistantVisibleText: options.preferFinalAssistantVisibleText,
		presentationCapabilities: {
			supported: true,
			buttons: true,
			selects: true,
			context: true,
			divider: false,
			limits: {
				actions: {
					maxActions: 100,
					maxActionsPerRow: 3,
					maxLabelLength: 64,
					supportsStyles: false
				},
				selects: {
					maxOptions: 100,
					maxLabelLength: 64
				},
				text: { markdownDialect: "markdown" }
			}
		},
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
		renderPresentation: ({ payload, presentation }) => {
			const telegramData = payload.channelData?.telegram;
			const buttons = telegramData && "buttons" in telegramData || payload.interactive ? void 0 : resolveTelegramInlineButtons({ presentation });
			return {
				...payload,
				text: renderMessagePresentationFallbackText({
					text: payload.text,
					presentation
				}),
				channelData: {
					...payload.channelData,
					telegram: {
						...telegramData,
						...buttons ? { buttons } : {}
					}
				}
			};
		},
		pinDeliveredMessage: async ({ cfg, target, messageId, pin, gatewayClientScopes }) => {
			const { pinMessageTelegram } = await loadSendModule();
			await pinMessageTelegram(parseTelegramTarget(normalizeTelegramOutboundTarget(target.to)).chatId, messageId, {
				cfg,
				accountId: target.accountId ?? void 0,
				notify: pin.notify,
				verbose: false,
				gatewayClientScopes
			});
		},
		resolveEffectiveTextChunkLimit: ({ fallbackLimit }) => typeof fallbackLimit === "number" ? Math.min(fallbackLimit, 4096) : 4096,
		pollMaxOptions: 10,
		supportsPollDurationSeconds: true,
		supportsAnonymousPolls: true,
		...createAttachedChannelResultAdapter({
			channel: "telegram",
			sendText: async (params) => {
				const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
					...params,
					resolveSend
				});
				return await send(outboundTo, params.text, { ...baseOpts });
			},
			sendMedia: async (params) => {
				const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
					...params,
					resolveSend
				});
				return await send(outboundTo, params.text, {
					...baseOpts,
					mediaUrl: params.mediaUrl,
					mediaLocalRoots: params.mediaLocalRoots,
					mediaReadFile: params.mediaReadFile,
					forceDocument: params.forceDocument ?? false
				});
			}
		}),
		sendPayload: async (params) => {
			const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
				...params,
				resolveSend
			});
			const { reactMessageTelegram } = await loadSendModule();
			return attachChannelToResult("telegram", await sendTelegramPayloadMessages({
				send,
				react: reactMessageTelegram,
				to: outboundTo,
				payload: params.payload,
				baseOpts: {
					...baseOpts,
					mediaLocalRoots: params.mediaLocalRoots,
					mediaReadFile: params.mediaReadFile,
					forceDocument: params.forceDocument ?? false
				}
			}));
		},
		sendPoll: async ({ cfg, to, poll, accountId, threadId, silent, isAnonymous, gatewayClientScopes }) => {
			const outboundTo = normalizeTelegramOutboundTarget(to);
			const { sendPollTelegram } = await loadSendModule();
			return await sendPollTelegram(outboundTo, poll, {
				cfg,
				accountId: accountId ?? void 0,
				messageThreadId: parseTelegramThreadId(threadId),
				silent: silent ?? void 0,
				isAnonymous: isAnonymous ?? void 0,
				gatewayClientScopes
			});
		}
	};
}
const telegramOutbound = createTelegramOutboundAdapter();
//#endregion
export { telegramOutbound as i, createTelegramOutboundAdapter as n, sendTelegramPayloadMessages as r, TELEGRAM_TEXT_CHUNK_LIMIT as t };
