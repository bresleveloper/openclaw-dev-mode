import { S as parseStrictInteger, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as normalizeMessagePresentation } from "./payload-qyD1vby_.mjs";
import { i as logVerbose, t as danger } from "./globals-XVSoVbNQ.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { p as fireAndForgetHook } from "./hooks-CU2qx9-T.mjs";
import "./channel-outbound-BbIm36V0.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-CLjC4hNl.mjs";
import { r as probeVideoDimensions } from "./media-probe--mrhBqNu.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { a as projectOutboundPayloadPlanForDelivery, n as createStructuredOutboundPayloadPlan, t as createOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C1maBxgO.mjs";
import { d as toPluginMessageSentEvent, l as toPluginMessageContext, o as toInternalMessageSentContext, t as buildCanonicalSentMessageHookContext } from "./message-hook-mappers-CqRCIn9-.mjs";
import { t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-Dv3ATZ34.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-DNLQqCT3.mjs";
import { f as isChannelPartialDeliveryError } from "./live-BuMDR3AO.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./reply-reference-DIbR84kt.mjs";
import "./channel-inbound-C0d69q8b.mjs";
import "./web-media-CgTCNYnE.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import "./media-runtime-CmxLZuo1.mjs";
import "./plugin-runtime-BaFUwWWh.mjs";
import "./hook-runtime-B4enTx7F.mjs";
import { d as isTelegramEmptyContentError, r as TELEGRAM_RICH_TEXT_LIMIT, w as buildInlineKeyboard } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { u as resolveTelegramTargetChatType } from "./topic-conversation-S0gZB4iY.mjs";
import "./helpers-amKpwD-6.mjs";
import { o as resolveTelegramInlineButtons } from "./button-types-DtegLouf.mjs";
import { n as canonicalizeTelegramPresentationPayload, o as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-CnFs49uF.mjs";
import { G as buildTelegramProviderDeliveryResult, I as reactMessageTelegram, K as reportTelegramProviderDelivery, T as planTelegramTextDeliveryPages, _ as isTelegramVoiceMessagesForbiddenError, b as planTelegramMediaBatches, d as createTelegramPreparedSender, dt as buildTelegramSendParams, f as createTelegramReplyRequest, g as isTelegramPhotoLimitError, h as isTelegramCaptionTooLongError, q as recordSentMessage, v as prepareTelegramOutboundMedia, y as resolveTelegramOutboundMediaSenders } from "./send-DWoEOMF4.mjs";
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
	const entities = sliceTelegramEntitiesForQuote(params.entities, text.length);
	return {
		text,
		position: 0,
		...entities ? { entities } : {}
	};
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
		if (mapped?.text) return {
			messageId: params.replyToId,
			text: mapped.text,
			...typeof mapped.position === "number" ? { position: mapped.position } : {},
			...mapped.entities ? { entities: mapped.entities } : {}
		};
	}
	return {
		...params.replyQuoteMessageId != null ? { messageId: params.replyQuoteMessageId } : {},
		...params.replyQuoteText != null ? { text: params.replyQuoteText } : {},
		...params.replyQuotePosition != null ? { position: params.replyQuotePosition } : {},
		...params.replyQuoteEntities != null ? { entities: params.replyQuoteEntities } : {}
	};
}
//#endregion
//#region extensions/telegram/src/bot/delivery.replies.ts
function resolveReplyToForSend(params, progress) {
	return params.replyToId && (params.replyToMode === "all" || !progress.hasReplied) ? params.replyToId : void 0;
}
function markReplyApplied(progress, replyToId) {
	if (replyToId && !progress.hasReplied) progress.hasReplied = true;
}
function resolveVoiceFallbackText(reply) {
	return [reply.text, reply.spokenText].find((text) => text?.trim());
}
function createReplyDeliverer(config, sender, progress) {
	const reportAcceptedPart = (part, kind) => reportTelegramProviderDelivery({
		message: part.result,
		messageId: part.messageId,
		fallbackChatId: config.chatId,
		successfulSendThread: config.thread ?? void 0,
		...kind ? { kind } : {}
	});
	const recordMessageId = (messageId) => recordSentMessage(config.chatId, messageId, config.cfg, {
		accountId: config.accountId,
		agentId: config.ownerAgentId
	});
	const mediaLoader = config.mediaLoader ?? loadWebMedia;
	async function deliverTextReply(params) {
		const replyProgress = params.progress ?? progress;
		const chunks = planTelegramTextDeliveryPages({
			text: params.text,
			maxChars: config.richMessages === true ? Math.min(config.textLimit, TELEGRAM_RICH_TEXT_LIMIT) : Math.min(config.textLimit, 4e3),
			chunkMode: config.chunkMode ?? "length",
			tableMode: config.tableMode,
			richMessages: config.richMessages,
			skipEntityDetection: config.linkPreview === false,
			...config.textMode ? { textMode: config.textMode } : {}
		}).filter((chunk) => chunk.richMessage?.blocks.length || chunk.htmlText?.trim() || chunk.plainText.trim());
		const suppressReply = chunks.length > 1 && isSingleUseReplyToMode(params.replyToMode);
		return sender.sendText({
			pages: chunks,
			context: config.richMessages ? "sendRichMessage" : "sendMessage",
			tracking: {
				invalidate: () => replyProgress.promptContext?.invalidate(),
				onRejected: (error) => config.runtime.error?.(danger(`telegram reply chunk rejected; continuing: ${formatErrorMessage(error)}`)),
				onSilentSkip: (error) => config.runtime.log?.(`telegram reply chunk rendered empty; skipping: ${formatErrorMessage(error)}`)
			},
			preparePage: (_index, acceptedPages) => {
				const first = acceptedPages === 0;
				const replyToMessageId = suppressReply ? void 0 : resolveReplyToForSend(params, replyProgress);
				const quote = params.quoteOnlyOnFirstChunk === true && !first ? void 0 : params.quote;
				const base = buildTelegramSendParams({
					replyToMessageId,
					replyQuoteMessageId: quote?.messageId,
					replyQuoteText: replyToMessageId ? quote?.text : void 0,
					replyQuotePosition: quote?.position,
					replyQuoteEntities: quote?.entities,
					thread: config.thread,
					silent: config.silent
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
							...config.linkPreview === false ? { link_preview_options: { is_disabled: true } } : {},
							...first && params.replyMarkup && (!fallback || fallback.index === fallback.count - 1) ? { reply_markup: params.replyMarkup } : {}
						};
					},
					delivered: () => {
						markReplyApplied(replyProgress, suppressReply && first ? params.replyToId : replyToMessageId);
					}
				};
			},
			observe: async (part) => {
				const { messageId, plainText } = part;
				if (config.thread?.id !== void 0) await reportAcceptedPart(part);
				config.runtime.log?.(`telegram text delivery ok chat=${config.chatId} message=${messageId}`);
				await recordMessageId(messageId);
				await replyProgress.promptContext?.accept({
					messageId,
					text: plainText
				});
			}
		});
	}
	async function deliverMediaReply(params) {
		let firstDeliveredMessageId;
		let visibleFallbackText;
		let firstDeliveredCaption;
		const mediaUrls = [];
		const observeMedia = async (part, captionRemoved) => {
			const { result: message, messageId, plainText } = part;
			if (config.thread?.id !== void 0) await reportAcceptedPart(part, "media");
			firstDeliveredMessageId ??= messageId;
			firstDeliveredCaption ??= plainText || void 0;
			if (captionRemoved) visibleFallbackText = "";
			await recordMessageId(messageId);
			await progress.promptContext?.accept({
				messageId,
				message,
				...plainText ? { text: plainText } : {}
			});
		};
		const deliverAcceptedMedia = async (options) => {
			const delivery = await sender.sendMedia(options);
			await sender.accept(delivery, (part) => observeMedia(part, delivery.captionRemoved), { mediaUrls: [options.mediaUrl] });
			mediaUrls.push(options.mediaUrl);
		};
		const prepareMedia = async (mediaUrl, index) => {
			const isFirstMedia = index === 0;
			const media = await mediaLoader(mediaUrl, buildOutboundMediaLoadOptions({
				mediaLocalRoots: config.mediaLocalRoots,
				maxBytes: config.mediaMaxBytes
			}));
			const mediaPlan = prepareTelegramOutboundMedia({
				media,
				text: isFirstMedia ? params.reply.text ?? void 0 : void 0,
				textMode: config.textMode,
				tableMode: config.tableMode,
				preparedHtml: true
			});
			const { sender: mediaSender, documentSender } = resolveTelegramOutboundMediaSenders({
				api: config.bot.api,
				chatId: config.chatId,
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
			const replyToMessageId = resolveReplyToForSend(params, progress);
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
					replyQuoteMessageId: params.quote?.messageId,
					replyQuoteText: params.quote?.text,
					replyQuotePosition: params.quote?.position,
					replyQuoteEntities: params.quote?.entities,
					thread: config.thread,
					silent: config.silent
				})
			};
			if (batch.length > 1) {
				let album;
				try {
					album = await sender.sendPhotoAlbum({
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
				await sender.acceptMany(album.parts, (part) => observeMedia(part, album.captionRemoved), {
					mediaUrls: batch.map((item) => item.mediaUrl),
					partialDeliveryResult: () => ({ receipt: createMessageReceiptFromOutboundResults({
						results: album.parts.map((part) => buildTelegramProviderDeliveryResult({
							message: part.result,
							messageId: part.result.message_id,
							fallbackChatId: config.chatId,
							...config.thread ? { successfulSendThread: config.thread } : {},
							kind: "media"
						})),
						kind: "media"
					}) })
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
				await config.onVoiceRecording?.();
				try {
					await sendVoiceMedia(mediaParams);
				} catch (voiceErr) {
					if (isChannelPartialDeliveryError(voiceErr)) throw voiceErr;
					const voiceForbidden = isTelegramVoiceMessagesForbiddenError(voiceErr);
					let fallbackText;
					let fallbackReplyToId;
					if (voiceForbidden) {
						fallbackText = resolveVoiceFallbackText(params.reply);
						if (!fallbackText) throw voiceErr;
						logVerbose("telegram sendVoice forbidden (recipient has voice messages blocked in privacy settings); falling back to text");
						fallbackReplyToId = resolveReplyToForSend(params, progress);
					} else if (isTelegramCaptionTooLongError(voiceErr)) {
						logVerbose("telegram sendVoice caption too long; resending voice without caption + text separately");
						const noCaptionParams = { ...mediaParams };
						delete noCaptionParams.caption;
						delete noCaptionParams.parse_mode;
						await sendVoiceMedia(noCaptionParams);
						fallbackText = resolveVoiceFallbackText(params.reply);
					} else throw voiceErr;
					if (fallbackText) try {
						const fallbackMessageId = await deliverTextReply({
							...params,
							text: fallbackText,
							replyToId: fallbackReplyToId,
							quote: voiceForbidden ? params.quote : void 0,
							replyToMode: voiceForbidden ? params.replyToMode : "first",
							progress: {
								...progress,
								hasReplied: false
							},
							quoteOnlyOnFirstChunk: true
						});
						if (voiceForbidden) {
							if (fallbackMessageId === void 0) throw voiceErr;
							firstDeliveredMessageId ??= fallbackMessageId;
						}
						if (fallbackMessageId !== void 0) visibleFallbackText = fallbackText;
					} catch (fallbackError) {
						if (voiceForbidden || isChannelPartialDeliveryError(fallbackError) || !isTelegramEmptyContentError(fallbackError)) throw fallbackError;
						visibleFallbackText = "";
					}
					markReplyApplied(progress, voiceForbidden ? fallbackReplyToId : replyToMessageId);
					return;
				}
			} else await deliverAcceptedMedia({
				sender: mediaSender,
				documentSender,
				mediaUrl,
				requestParams: mediaParams,
				plainCaption
			});
			markReplyApplied(progress, replyToMessageId);
			if (followUpText) try {
				if (await deliverTextReply({
					...params,
					text: followUpText,
					quote: void 0
				}) === void 0) visibleFallbackText = firstDeliveredCaption ?? "";
				else visibleFallbackText = void 0;
			} catch (error) {
				if (isChannelPartialDeliveryError(error) || !isTelegramEmptyContentError(error)) throw error;
				visibleFallbackText = firstDeliveredCaption ?? "";
				if (params.replyMarkup && firstDeliveredMessageId !== void 0) await config.bot.api.editMessageReplyMarkup(config.chatId, firstDeliveredMessageId, { reply_markup: params.replyMarkup });
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
	return {
		deliverTextReply,
		deliverMediaReply
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
		...params.promptContextSequence ? { promptContext: params.promptContextSequence } : {}
	};
	const transcriptMirror = params.transcriptMirror;
	const deliveredContents = [];
	const hookRunner = getGlobalHookRunner();
	const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
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
		beforeSend: params.onPlatformSendDispatch,
		assertPlatformSendAuthorized: params.assertPlatformSendAuthorized,
		onMediaAccepted: params.onMediaAccepted
	});
	const { deliverTextReply, deliverMediaReply } = createReplyDeliverer(params, sender, progress);
	let deliveredReactions = 0;
	const deliveredCount = () => sender.parts.length + deliveredReactions;
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
		const mediaList = reply.mediaUrls?.length ? reply.mediaUrls : reply.mediaUrl ? [reply.mediaUrl] : [];
		const hasMedia = mediaList.length > 0;
		const presentation = normalizeMessagePresentation(reply.presentation);
		const interactive = reply.interactive;
		const resolvedReplyText = resolveTelegramInteractiveTextFallback({
			text: reply.text,
			interactive,
			presentation
		}) ?? reply.text ?? "";
		if (resolvedReplyText !== (reply.text ?? "")) reply = {
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
			if (reply.audioAsVoice) {
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
			const deliveredCountBeforeReply = deliveredCount();
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
				if (reactionResult.ok) deliveredReactions += 1;
				else {
					params.runtime.error?.(danger(reactionResult.warning));
					continue;
				}
			}
			const textReply = {
				text: reply.text || "",
				replyMarkup,
				quote: replyQuote,
				replyToId,
				replyToMode
			};
			if (mediaList.length === 0 && resolvedReplyText) firstDeliveredMessageId = await deliverTextReply(textReply);
			else if (mediaList.length > 0) {
				const mediaDelivery = await deliverMediaReply({
					...textReply,
					reply,
					mediaList
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
			if (deliveredCount() > deliveredCountBeforeReply && transcriptMirror) deliveredContents.push({
				text: contentForSentHook,
				mediaUrls: deliveredMediaUrls
			});
			emitTelegramMessageSentHooks({
				...sentHookContext,
				content: contentForSentHook,
				success: deliveredCount() > deliveredCountBeforeReply,
				messageId: firstDeliveredMessageId
			});
		} catch (error) {
			emitTelegramMessageSentHooks({
				...sentHookContext,
				content: contentForSentHook,
				success: false,
				error: formatErrorMessage(error)
			});
			sender.fail(error, 0, sender.parts.length ? { receipt: buildDeliveryReceipt() } : void 0);
		}
	}
	if (deliveredCount() > 0 && transcriptMirror) {
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
		delivered: deliveredCount() > 0,
		...sender.parts.length ? { receipt: buildDeliveryReceipt() } : {}
	};
}
//#endregion
export { emitTelegramMessageSentHooks as a, buildTelegramNativeQuoteCandidate as i, deliverStructuredReplies as n, addTelegramNativeQuoteCandidate as r, deliverReplies as t };
