import { S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as logVerbose, t as danger } from "./globals-BXbZ1A_g.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-eJIIEpha.mjs";
import { p as fireAndForgetHook } from "./hooks-ADSXph0M.mjs";
import { f as normalizeMessagePresentation } from "./payload-DfZ7JVGs.mjs";
import "./channel-outbound-DBuu65Vg.mjs";
import { r as probeVideoDimensions } from "./media-probe-DFKlsDXP.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-Be_FOFUF.mjs";
import { a as projectOutboundPayloadPlanForDelivery, n as createStructuredOutboundPayloadPlan, t as createOutboundPayloadPlan } from "./payloads-RF8yW6z7.mjs";
import { d as toPluginMessageSentEvent, l as toPluginMessageContext, o as toInternalMessageSentContext, t as buildCanonicalSentMessageHookContext } from "./message-hook-mappers-CNGQCw5J.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-DZm_0i8_.mjs";
import { t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-DkANOAh-.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-CcXmGbgu.mjs";
import { d as isChannelPartialDeliveryError } from "./live-TWzvpgza.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./reply-reference-DPCA-tWR.mjs";
import "./channel-inbound-3pp2RVN7.mjs";
import "./web-media-CrOXx0IK.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import "./media-runtime-BeXWK4uL.mjs";
import "./plugin-runtime-C3Ot0aFc.mjs";
import "./hook-runtime-K_la2_vO.mjs";
import { u as resolveTelegramTargetChatType } from "./topic-conversation-C-lzScEI.mjs";
import { C as buildInlineKeyboard, d as isTelegramEmptyContentError, r as TELEGRAM_RICH_TEXT_LIMIT } from "./text-chunk-limit-BgiLU1vv.mjs";
import "./helpers-DLD_tZ6z.mjs";
import { a as resolveTelegramInlineButtons } from "./button-types-DwzDJv5i.mjs";
import { n as canonicalizeTelegramPresentationPayload, o as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-vX-64igY.mjs";
import { G as buildTelegramProviderDeliveryResult, I as reactMessageTelegram, K as reportTelegramProviderDelivery, T as planTelegramTextDeliveryPages, _ as isTelegramPhotoLimitError, b as resolveTelegramOutboundMediaSenders, f as createTelegramPreparedSender, g as isTelegramCaptionTooLongError, lt as buildTelegramSendParams, p as createTelegramReplyRequest, q as recordSentMessage, v as isTelegramVoiceMessagesForbiddenError, x as planTelegramMediaBatches, y as prepareTelegramOutboundMedia } from "./send-Dhm4bf4Y.mjs";
//#region extensions/telegram/src/bot/delivery.hooks.ts
function emitTelegramMessageSentHooks(params) {
	const hookRunner = getGlobalHookRunner();
	const enabled = hookRunner?.hasHooks("message_sent") ?? false;
	if (!enabled && !params.sessionKeyForInternalHooks) return;
	const canonical = buildCanonicalSentMessageHookContext({
		to: params.chatId,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: "telegram",
		accountId: params.accountId,
		conversationId: params.chatId,
		messageId: typeof params.messageId === "number" ? String(params.messageId) : void 0,
		isGroup: params.isGroup,
		groupId: params.groupId
	});
	if (enabled) fireAndForgetHook(Promise.resolve(hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical))), "telegram: message_sent plugin hook failed");
	if (params.sessionKeyForInternalHooks) fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), "telegram: message:sent internal hook failed");
}
//#endregion
//#region extensions/telegram/src/bot/native-quote.ts
const TELEGRAM_NATIVE_QUOTE_MAX_LENGTH = 1024;
function sliceTelegramEntitiesForQuote(entities, quoteLength) {
	if (!entities?.length || quoteLength <= 0) return;
	const sliced = [];
	for (const entity of entities) {
		const offset = Number.isFinite(entity.offset) ? Math.trunc(entity.offset) : 0;
		const length = Number.isFinite(entity.length) ? Math.trunc(entity.length) : 0;
		const start = Math.max(0, offset);
		const end = Math.min(quoteLength, offset + length);
		if (end <= start) continue;
		sliced.push({
			...entity,
			offset: start,
			length: end - start
		});
	}
	return sliced.length > 0 ? sliced : void 0;
}
function buildTelegramNativeQuoteCandidate(params) {
	const source = params.text;
	if (!source?.trim()) return;
	const maxLength = params.maxLength ?? TELEGRAM_NATIVE_QUOTE_MAX_LENGTH;
	const text = truncateUtf16Safe(source, maxLength);
	if (!text.trim()) return;
	const candidate = {
		text,
		position: 0
	};
	const entities = sliceTelegramEntitiesForQuote(params.entities, text.length);
	if (entities) candidate.entities = entities;
	return candidate;
}
function addTelegramNativeQuoteCandidate(target, messageId, candidate) {
	if (messageId == null || !candidate) return;
	const key = String(messageId).trim();
	if (!key || target[key]) return;
	target[key] = candidate;
}
function resolveReplyQuoteForSend(params) {
	if (params.replyToId != null) {
		const mapped = params.replyQuoteByMessageId?.[String(params.replyToId)];
		if (mapped?.text) {
			const quote = {
				messageId: params.replyToId,
				text: mapped.text
			};
			if (typeof mapped.position === "number") quote.position = mapped.position;
			if (mapped.entities) quote.entities = mapped.entities;
			return quote;
		}
	}
	const quote = {};
	if (params.replyQuoteMessageId != null) quote.messageId = params.replyQuoteMessageId;
	if (params.replyQuoteText != null) quote.text = params.replyQuoteText;
	if (params.replyQuotePosition != null) quote.position = params.replyQuotePosition;
	if (params.replyQuoteEntities != null) quote.entities = params.replyQuoteEntities;
	return quote;
}
//#endregion
//#region extensions/telegram/src/bot/delivery.replies.ts
function resolveReplyToForSend(params) {
	return params.replyToId && (params.replyToMode === "all" || !params.progress.hasReplied) ? params.replyToId : void 0;
}
function markReplyApplied(progress, replyToId) {
	if (replyToId && !progress.hasReplied) progress.hasReplied = true;
}
function filterEmptyTelegramTextChunks(chunks) {
	return chunks.filter((chunk) => chunk.richMessage?.blocks.length || chunk.htmlText?.trim() || chunk.plainText.trim());
}
async function deliverTextReply(params) {
	const chunks = filterEmptyTelegramTextChunks(params.chunkText(params.text));
	const suppressReply = chunks.length > 1 && isSingleUseReplyToMode(params.replyToMode);
	return (await params.sender.sendText({
		pages: chunks,
		context: params.richMessages ? "sendRichMessage" : "sendMessage",
		tracking: {
			invalidate: () => params.progress.promptContext?.invalidate(),
			onRejected: (error) => params.runtime.error?.(danger(`telegram reply chunk rejected; continuing: ${formatErrorMessage(error)}`)),
			onSilentSkip: (error) => params.runtime.log?.(`telegram reply chunk rendered empty; skipping: ${formatErrorMessage(error)}`)
		},
		preparePage: (_index, acceptedPages) => {
			const first = acceptedPages === 0;
			const replyToMessageId = suppressReply ? void 0 : resolveReplyToForSend(params);
			const includeQuote = params.quoteOnlyOnFirstChunk !== true || first;
			const base = buildTelegramSendParams({
				replyToMessageId,
				replyQuoteMessageId: includeQuote ? params.replyQuoteMessageId : void 0,
				replyQuoteText: replyToMessageId && includeQuote ? params.replyQuoteText : void 0,
				replyQuotePosition: includeQuote ? params.replyQuotePosition : void 0,
				replyQuoteEntities: includeQuote ? params.replyQuoteEntities : void 0,
				thread: params.thread,
				silent: params.silent
			});
			return {
				requestParams: (fallback) => {
					const requestParams = { ...base };
					if (fallback?.index) {
						delete requestParams.reply_parameters;
						delete requestParams.reply_to_message_id;
					}
					return {
						...requestParams,
						...params.linkPreview === false ? { link_preview_options: { is_disabled: true } } : {},
						...first && params.replyMarkup && (!fallback || fallback.index === fallback.count - 1) ? { reply_markup: params.replyMarkup } : {}
					};
				},
				delivered: () => {
					markReplyApplied(params.progress, suppressReply && first ? params.replyToId : replyToMessageId);
					params.progress.deliveredCount += 1;
				}
			};
		},
		observe: async ({ result, messageId, plainText }) => {
			if (params.thread?.id !== void 0) await reportTelegramProviderDelivery({
				message: result,
				messageId,
				fallbackChatId: params.chatId,
				successfulSendThread: params.thread
			});
			params.runtime.log?.(`telegram text delivery ok chat=${params.chatId} message=${messageId}`);
			await params.recordMessageId(messageId);
			await params.progress.promptContext?.accept({
				messageId,
				text: plainText
			});
		}
	}))[0]?.messageId;
}
function resolveVoiceFallbackText(reply) {
	if (reply.text?.trim()) return reply.text;
	if (reply.spokenText?.trim()) return reply.spokenText;
}
async function deliverMediaReply(params) {
	let firstDeliveredMessageId;
	let visibleFallbackText;
	let firstDeliveredCaption;
	const mediaUrls = [];
	const observeMedia = async ({ result: message, messageId, plainText }, captionRemoved) => {
		if (params.thread?.id !== void 0) await reportTelegramProviderDelivery({
			message,
			messageId,
			fallbackChatId: params.chatId,
			successfulSendThread: params.thread,
			kind: "media"
		});
		firstDeliveredMessageId ??= messageId;
		firstDeliveredCaption ??= plainText || void 0;
		if (captionRemoved) visibleFallbackText = "";
		await params.recordMessageId(messageId);
		await params.progress.promptContext?.accept({
			messageId,
			message,
			...plainText ? { text: plainText } : {}
		});
		params.progress.deliveredCount += 1;
	};
	const deliverAcceptedMedia = async (options) => {
		const delivery = await params.sender.sendMedia(options);
		await params.sender.accept(delivery, (part) => observeMedia(part, delivery.captionRemoved), { mediaUrls: [options.mediaUrl] });
		mediaUrls.push(options.mediaUrl);
	};
	const createVoiceFallbackProgress = () => ({
		hasReplied: false,
		deliveredCount: 0,
		...params.progress.promptContext ? { promptContext: params.progress.promptContext } : {}
	});
	const prepareMedia = async (mediaUrl, index) => {
		const isFirstMedia = index === 0;
		const media = await params.mediaLoader(mediaUrl, buildOutboundMediaLoadOptions({
			mediaLocalRoots: params.mediaLocalRoots,
			maxBytes: params.mediaMaxBytes
		}));
		const mediaPlan = prepareTelegramOutboundMedia({
			media,
			text: isFirstMedia ? params.reply.text ?? void 0 : void 0,
			textMode: params.textMode,
			tableMode: params.tableMode,
			preparedHtml: true
		});
		const { sender: mediaSender, documentSender } = resolveTelegramOutboundMediaSenders({
			api: params.bot.api,
			chatId: params.chatId,
			media,
			plan: mediaPlan,
			asVoice: params.reply.audioAsVoice
		});
		return {
			index,
			mediaUrl,
			media,
			mediaPlan,
			mediaSender,
			documentSender
		};
	};
	const deliverMediaBatch = async (batch) => {
		const { index, mediaUrl, media, mediaPlan, mediaSender, documentSender } = batch[0];
		const isFirstMedia = index === 0;
		const { htmlCaption, plainCaption, followUpText } = mediaPlan;
		const replyToMessageId = resolveReplyToForSend(params);
		const shouldAttachButtonsToMedia = isFirstMedia && params.replyMarkup && !followUpText;
		const videoDimensions = mediaPlan.kind === "video" ? await probeVideoDimensions(media.buffer) : void 0;
		const mediaParams = {
			caption: htmlCaption,
			...htmlCaption ? { parse_mode: "HTML" } : {},
			...shouldAttachButtonsToMedia ? { reply_markup: params.replyMarkup } : {},
			...videoDimensions ? {
				width: videoDimensions.width,
				height: videoDimensions.height
			} : {},
			...buildTelegramSendParams({
				replyToMessageId,
				replyQuoteMessageId: params.replyQuoteMessageId,
				replyQuoteText: params.replyQuoteText,
				replyQuotePosition: params.replyQuotePosition,
				replyQuoteEntities: params.replyQuoteEntities,
				thread: params.thread,
				silent: params.silent
			})
		};
		if (batch.length > 1) {
			let album;
			try {
				album = await params.sender.sendPhotoAlbum({
					files: batch.map((item) => item.mediaPlan.file),
					requestParams: mediaParams,
					plainCaption
				});
			} catch (error) {
				if (!isTelegramPhotoLimitError(error)) throw error;
				mediaPlan.followUpText = void 0;
				batch.reduce((_previous, item) => item).mediaPlan.followUpText = followUpText;
				for (const item of batch) await deliverMediaBatch([item]);
				return;
			}
			await params.sender.acceptMany(album.parts, (part) => observeMedia(part, album.captionRemoved), {
				mediaUrls: batch.map((item) => item.mediaUrl),
				partialDeliveryResult: () => ({
					receipt: createMessageReceiptFromOutboundResults({
						results: album.parts.map((part) => buildTelegramProviderDeliveryResult({
							message: part.result,
							messageId: part.result.message_id,
							fallbackChatId: params.chatId,
							...params.thread ? { successfulSendThread: params.thread } : {},
							kind: "media"
						})),
						kind: "media"
					}),
					visibleReplySent: true
				})
			});
			mediaUrls.push(...batch.map((item) => item.mediaUrl));
		} else if (mediaSender.label === "voice") {
			const sendVoiceMedia = async (requestParams) => {
				const hasCaption = typeof requestParams.caption === "string";
				await deliverAcceptedMedia({
					sender: mediaSender,
					mediaUrl,
					requestParams,
					plainCaption: hasCaption ? plainCaption : void 0
				});
			};
			const sendVoiceFallbackText = async (text, options = {}) => await deliverTextReply({
				...params,
				text,
				replyToId: options.replyToId,
				replyQuoteMessageId: options.includeQuote ? params.replyQuoteMessageId : void 0,
				replyQuotePosition: options.includeQuote ? params.replyQuotePosition : void 0,
				replyQuoteEntities: options.includeQuote ? params.replyQuoteEntities : void 0,
				replyQuoteText: options.includeQuote ? params.replyQuoteText : void 0,
				replyToMode: options.replyToMode ?? params.replyToMode,
				progress: createVoiceFallbackProgress(),
				quoteOnlyOnFirstChunk: true
			});
			await params.onVoiceRecording?.();
			try {
				await sendVoiceMedia(mediaParams);
			} catch (voiceErr) {
				if (isChannelPartialDeliveryError(voiceErr)) throw voiceErr;
				if (isTelegramVoiceMessagesForbiddenError(voiceErr)) {
					const fallbackText = resolveVoiceFallbackText(params.reply);
					if (!fallbackText) throw voiceErr;
					logVerbose("telegram sendVoice forbidden (recipient has voice messages blocked in privacy settings); falling back to text");
					const voiceFallbackReplyTo = resolveReplyToForSend(params);
					const fallbackMessageId = await sendVoiceFallbackText(fallbackText, {
						replyToId: voiceFallbackReplyTo,
						includeQuote: true
					});
					if (fallbackMessageId === void 0) throw voiceErr;
					firstDeliveredMessageId ??= fallbackMessageId;
					visibleFallbackText = fallbackText;
					markReplyApplied(params.progress, voiceFallbackReplyTo);
					params.progress.deliveredCount += 1;
					return;
				}
				if (isTelegramCaptionTooLongError(voiceErr)) {
					logVerbose("telegram sendVoice caption too long; resending voice without caption + text separately");
					const noCaptionParams = { ...mediaParams };
					delete noCaptionParams.caption;
					delete noCaptionParams.parse_mode;
					await sendVoiceMedia(noCaptionParams);
					const fallbackText = resolveVoiceFallbackText(params.reply);
					if (fallbackText) try {
						if (await sendVoiceFallbackText(fallbackText, { replyToMode: "first" }) !== void 0) visibleFallbackText = fallbackText;
					} catch (fallbackError) {
						if (isChannelPartialDeliveryError(fallbackError) || !isTelegramEmptyContentError(fallbackError)) throw fallbackError;
						visibleFallbackText = "";
					}
					markReplyApplied(params.progress, replyToMessageId);
					return;
				}
				throw voiceErr;
			}
		} else await deliverAcceptedMedia({
			sender: mediaSender,
			documentSender,
			mediaUrl,
			requestParams: mediaParams,
			plainCaption
		});
		markReplyApplied(params.progress, replyToMessageId);
		if (followUpText) try {
			if (await deliverTextReply({
				...params,
				text: followUpText,
				replyQuoteMessageId: void 0,
				replyQuotePosition: void 0,
				replyQuoteEntities: void 0,
				replyQuoteText: void 0
			}) === void 0) visibleFallbackText = firstDeliveredCaption ?? "";
			else visibleFallbackText = void 0;
		} catch (error) {
			if (isChannelPartialDeliveryError(error) || !isTelegramEmptyContentError(error)) throw error;
			visibleFallbackText = firstDeliveredCaption ?? "";
			if (params.replyMarkup && firstDeliveredMessageId !== void 0) await params.bot.api.editMessageReplyMarkup(params.chatId, firstDeliveredMessageId, { reply_markup: params.replyMarkup });
		}
	};
	for await (const batch of planTelegramMediaBatches({
		mediaUrls: params.mediaList,
		prepare: prepareMedia,
		canGroup: (item) => item.mediaSender.label === "photo" && !params.replyMarkup
	})) await deliverMediaBatch(batch);
	return {
		firstDeliveredMessageId,
		visibleFallbackText,
		mediaUrls
	};
}
async function maybePinFirstDeliveredMessage(params) {
	if (!(params.pin === true || typeof params.pin === "object" && params.pin.enabled) || typeof params.firstDeliveredMessageId !== "number") return;
	const notify = typeof params.pin === "object" && params.pin.notify === true;
	try {
		await params.bot.api.pinChatMessage(params.chatId, params.firstDeliveredMessageId, { disable_notification: !notify });
	} catch (err) {
		if (typeof params.pin === "object" && params.pin.required === true) throw err;
		logVerbose(`telegram pinChatMessage failed chat=${params.chatId} message=${params.firstDeliveredMessageId}: ${formatErrorMessage(err)}`);
	}
}
async function deliverReplies(params) {
	return deliverReplyPlan(params, (replies) => createOutboundPayloadPlan(replies, {
		cfg: params.cfg,
		sessionKey: params.policySessionKey ?? params.sessionKeyForInternalHooks,
		surface: "telegram"
	}));
}
async function deliverStructuredReplies(params) {
	return deliverReplyPlan(params, createStructuredOutboundPayloadPlan);
}
async function deliverReplyPlan(params, createPlan) {
	const progress = {
		hasReplied: false,
		deliveredCount: 0,
		...params.promptContextSequence ? { promptContext: params.promptContextSequence } : {}
	};
	const recordMessageId = (messageId) => recordSentMessage(params.chatId, messageId, params.cfg, {
		accountId: params.accountId,
		agentId: params.ownerAgentId
	});
	const mediaLoader = params.mediaLoader ?? loadWebMedia;
	const transcriptMirror = params.transcriptMirror;
	const deliveredContents = [];
	const hookRunner = getGlobalHookRunner();
	const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
	const chunkText = (text) => planTelegramTextDeliveryPages({
		text,
		maxChars: params.richMessages === true ? Math.min(params.textLimit, TELEGRAM_RICH_TEXT_LIMIT) : Math.min(params.textLimit, 4e3),
		chunkMode: params.chunkMode ?? "length",
		tableMode: params.tableMode,
		richMessages: params.richMessages,
		skipEntityDetection: params.linkPreview === false,
		...params.textMode ? { textMode: params.textMode } : {}
	});
	const candidateReplies = [];
	for (const reply of params.replies) {
		if (!reply || typeof reply !== "object") {
			params.runtime.error?.(danger("reply missing text/media"));
			continue;
		}
		candidateReplies.push(reply);
	}
	const normalizedReplies = projectOutboundPayloadPlanForDelivery(createPlan(candidateReplies));
	const sender = createTelegramPreparedSender({
		api: params.bot.api,
		chatId: params.chatId,
		request: createTelegramReplyRequest(params.runtime),
		warn: (message) => params.runtime.log?.(message),
		beforeTextPage: params.onPlatformSendDispatch,
		beforeMedia: params.onPlatformSendDispatch,
		assertPlatformSendAuthorized: params.assertPlatformSendAuthorized,
		onMediaAccepted: params.onMediaAccepted
	});
	const buildDeliveryReceipt = () => {
		const receipt = createMessageReceiptFromOutboundResults({ results: sender.parts.map((part) => buildTelegramProviderDeliveryResult({
			message: part.result,
			messageId: part.messageId,
			fallbackChatId: params.chatId,
			...params.thread ? { successfulSendThread: params.thread } : {}
		})) });
		for (const [index, part] of receipt.parts.entries()) part.index = index;
		return receipt;
	};
	for (const originalReply of normalizedReplies) {
		let reply = canonicalizeTelegramPresentationPayload(originalReply, {
			allowWebAppButtons: resolveTelegramTargetChatType(params.chatId) === "direct",
			richTables: params.richMessages === true && params.textMode !== "html"
		});
		const mediaList = reply?.mediaUrls?.length ? reply.mediaUrls : reply?.mediaUrl ? [reply.mediaUrl] : [];
		const hasMedia = mediaList.length > 0;
		const presentation = normalizeMessagePresentation(reply?.presentation);
		const interactive = reply?.interactive;
		const resolvedReplyText = resolveTelegramInteractiveTextFallback({
			text: reply?.text,
			interactive,
			presentation
		}) ?? reply?.text ?? "";
		if (reply && resolvedReplyText !== (reply.text ?? "")) reply = {
			...reply,
			text: resolvedReplyText
		};
		const telegramData = reply.channelData?.telegram;
		const reactionEmoji = typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
		const replyToMode = params.replyToMode === "off" && (reply.replyToTag === true || reply.replyToCurrent === true) ? "all" : params.replyToMode;
		const replyToId = replyToMode === "off" ? void 0 : parseStrictInteger(reply.replyToId);
		const targetId = parseStrictPositiveInteger(telegramData?.reaction?.replyToId ?? replyToId);
		if (reactionEmoji && typeof targetId !== "number") {
			params.runtime.error?.(danger("Telegram reaction requires a reply target"));
			continue;
		}
		if (!resolvedReplyText && !hasMedia && !reactionEmoji) {
			if (reply?.audioAsVoice) {
				logVerbose("telegram reply has audioAsVoice without media/text; skipping");
				continue;
			}
			params.runtime.error?.(danger("reply missing text/media"));
			continue;
		}
		const rawContent = resolvedReplyText;
		const spokenHookContent = !rawContent && reply.audioAsVoice === true && reply.spokenText?.trim() ? reply.spokenText : void 0;
		const hookContent = spokenHookContent ?? rawContent;
		const replyQuote = resolveReplyQuoteForSend({
			replyToId,
			replyQuoteByMessageId: params.replyQuoteByMessageId,
			replyQuoteMessageId: params.replyQuoteMessageId,
			replyQuoteText: params.replyQuoteText,
			replyQuotePosition: params.replyQuotePosition,
			replyQuoteEntities: params.replyQuoteEntities
		});
		if (hasMessageSendingHooks) {
			const hookResult = await hookRunner?.runMessageSending({
				to: params.chatId,
				content: hookContent,
				replyToId,
				threadId: params.thread?.id,
				metadata: {
					channel: "telegram",
					mediaUrls: mediaList,
					threadId: params.thread?.id
				}
			}, {
				channelId: "telegram",
				accountId: params.accountId,
				conversationId: params.chatId
			});
			if (hookResult?.cancel) continue;
			if (typeof hookResult?.content === "string" && hookResult.content !== hookContent) {
				progress.promptContext?.detach();
				reply = spokenHookContent ? {
					...reply,
					spokenText: hookResult.content
				} : {
					...reply,
					text: hookResult.content
				};
			}
		}
		let contentForSentHook = reply.text || (reply.audioAsVoice === true ? resolveVoiceFallbackText(reply) : "") || "";
		const sentHookContext = {
			sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
			chatId: params.chatId,
			accountId: params.accountId,
			isGroup: params.mirrorIsGroup,
			groupId: params.mirrorGroupId
		};
		try {
			const deliveredCountBeforeReply = progress.deliveredCount;
			const replyMarkup = buildInlineKeyboard(resolveTelegramInlineButtons({
				buttons: telegramData?.buttons,
				presentation,
				interactive
			}));
			let firstDeliveredMessageId;
			let deliveredMediaUrls = [];
			if (reactionEmoji && typeof targetId === "number") {
				await params.onPlatformSendDispatch?.();
				params.assertPlatformSendAuthorized?.();
				const reactionResult = await reactMessageTelegram(params.chatId, targetId, reactionEmoji, {
					cfg: params.cfg ?? { channels: { telegram: { botToken: params.token } } },
					token: params.token,
					accountId: params.accountId,
					api: params.bot.api,
					verbose: false
				});
				if (reactionResult.ok) progress.deliveredCount += 1;
				else {
					params.runtime.error?.(danger(reactionResult.warning));
					continue;
				}
			}
			const textReply = {
				sender,
				chatId: params.chatId,
				runtime: params.runtime,
				thread: params.thread,
				chunkText,
				text: reply.text || "",
				replyMarkup,
				replyQuoteMessageId: replyQuote.messageId,
				replyQuoteText: replyQuote.text,
				replyQuotePosition: replyQuote.position,
				replyQuoteEntities: replyQuote.entities,
				richMessages: params.richMessages,
				linkPreview: params.linkPreview,
				silent: params.silent,
				replyToId,
				replyToMode,
				progress,
				recordMessageId
			};
			if (mediaList.length === 0 && resolvedReplyText) firstDeliveredMessageId = await deliverTextReply(textReply);
			else if (mediaList.length > 0) {
				const mediaDelivery = await deliverMediaReply({
					...textReply,
					reply,
					mediaList,
					bot: params.bot,
					tableMode: params.tableMode,
					mediaLocalRoots: params.mediaLocalRoots,
					mediaMaxBytes: params.mediaMaxBytes,
					mediaLoader,
					onVoiceRecording: params.onVoiceRecording,
					...params.textMode ? { textMode: params.textMode } : {}
				});
				firstDeliveredMessageId = mediaDelivery.firstDeliveredMessageId;
				deliveredMediaUrls = mediaDelivery.mediaUrls;
				if (mediaDelivery.visibleFallbackText !== void 0) contentForSentHook = mediaDelivery.visibleFallbackText;
			}
			await maybePinFirstDeliveredMessage({
				pin: reply.delivery?.pin,
				bot: params.bot,
				chatId: params.chatId,
				firstDeliveredMessageId
			});
			if (progress.deliveredCount > deliveredCountBeforeReply && transcriptMirror) deliveredContents.push({
				text: contentForSentHook,
				mediaUrls: deliveredMediaUrls
			});
			emitTelegramMessageSentHooks({
				...sentHookContext,
				content: contentForSentHook,
				success: progress.deliveredCount > deliveredCountBeforeReply,
				messageId: firstDeliveredMessageId
			});
		} catch (error) {
			emitTelegramMessageSentHooks({
				...sentHookContext,
				content: contentForSentHook,
				success: false,
				error: formatErrorMessage(error)
			});
			sender.fail(error, 0, sender.parts.length ? {
				receipt: buildDeliveryReceipt(),
				visibleReplySent: true
			} : void 0);
		}
	}
	if (progress.deliveredCount > 0 && transcriptMirror) {
		const text = deliveredContents.map((content) => content.text).filter(Boolean).join("\n\n");
		const mediaUrls = deliveredContents.flatMap((content) => content.mediaUrls);
		if (text || mediaUrls.length > 0) try {
			await transcriptMirror({
				text: text || void 0,
				mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
			});
		} catch (mirrorErr) {
			logVerbose(`telegram transcriptMirror failed: ${formatErrorMessage(mirrorErr)}`);
		}
	}
	return {
		delivered: progress.deliveredCount > 0,
		...sender.parts.length ? { receipt: buildDeliveryReceipt() } : {}
	};
}
//#endregion
export { emitTelegramMessageSentHooks as a, buildTelegramNativeQuoteCandidate as i, deliverStructuredReplies as n, addTelegramNativeQuoteCandidate as r, deliverReplies as t };
