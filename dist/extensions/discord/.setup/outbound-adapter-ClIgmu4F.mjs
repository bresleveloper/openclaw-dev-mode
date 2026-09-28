import { t as createDiscordActionGate } from "./accounts-CwJQoLjM.mjs";
import { c as createDiscordSendReceiptFromResults, i as hasDiscordMessageCreateAmbiguity, o as chunkDiscordTextWithMode, p as resolveDiscordReplyReference, s as createDiscordSendReceipt, t as canFallbackDiscordWebhookSend, u as toDiscordOutboundDeliveryResult, v as normalizeDiscordOutboundTarget } from "./retry-BEYkDy0P.mjs";
import { a as resolveDiscordComponentSpec, b as discordInboundEventDelivery, c as formatDiscordApprovalDisplayValue, n as DISCORD_PRESENTATION_CAPABILITIES, o as sendDiscordComponentMessageLazy, r as buildDiscordPresentationPayload, x as notifyDiscordInboundEventOutboundPayloadSuccess } from "./outbound-session-route-VulUE0yV.mjs";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getReplyPayloadTtsSupplement, resolvePayloadMediaUrls, sendPayloadMediaSequenceOrFallback, sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createReplyToFanout, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { attachChannelToResult, createAttachedChannelResultAdapter } from "openclaw/plugin-sdk/channel-send-result";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
//#region extensions/discord/src/media-detection.ts
const DISCORD_VIDEO_MEDIA_EXTENSIONS = /* @__PURE__ */ new Set([
	".avi",
	".m4v",
	".mkv",
	".mov",
	".mp4",
	".webm"
]);
function normalizeMediaPathForExtension(mediaUrl) {
	const trimmed = mediaUrl.trim();
	if (!trimmed) return "";
	try {
		const parsed = new URL(trimmed);
		const fileName = parsed.pathname.slice(parsed.pathname.lastIndexOf("/") + 1);
		try {
			return normalizeLowercaseStringOrEmpty(decodeURIComponent(fileName));
		} catch {
			return normalizeLowercaseStringOrEmpty(fileName);
		}
	} catch {
		const withoutHash = trimmed.split("#", 1)[0] ?? trimmed;
		const withoutQuery = withoutHash.split("?", 1)[0] ?? withoutHash;
		return normalizeLowercaseStringOrEmpty(withoutQuery);
	}
}
function isLikelyDiscordVideoMedia(mediaUrl) {
	const normalized = normalizeMediaPathForExtension(mediaUrl);
	for (const ext of DISCORD_VIDEO_MEDIA_EXTENSIONS) if (normalized.endsWith(ext)) return true;
	return false;
}
//#endregion
//#region extensions/discord/src/outbound-approval.ts
function hasApprovalChannelData(payload) {
	const channelData = payload.channelData;
	if (!channelData || typeof channelData !== "object" || Array.isArray(channelData)) return false;
	return Boolean(channelData.execApproval);
}
function neutralizeDiscordApprovalMentions(value) {
	return value.replace(/@everyone/gi, "@​everyone").replace(/@here/gi, "@​here").replace(/<@/g, "<@​").replace(/<#/g, "<#​");
}
function normalizeDiscordApprovalPayload(payload) {
	return hasApprovalChannelData(payload) && payload.text ? {
		...payload,
		text: neutralizeDiscordApprovalMentions(payload.text)
	} : payload;
}
//#endregion
//#region extensions/discord/src/outbound-send-context.ts
const loadDiscordSendRuntime = createLazyRuntimeModule(() => import("./send-CIBzvXjS.mjs").then((n) => n.t));
function resolveDiscordOutboundTarget(params) {
	if (params.threadId == null) return params.to;
	const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
	if (!threadId) return params.to;
	return `channel:${threadId}`;
}
function resolveDiscordFormattingOptions(ctx) {
	const formatting = ctx.formatting;
	return {
		textLimit: formatting?.textLimit,
		maxLinesPerMessage: formatting?.maxLinesPerMessage,
		tableMode: formatting?.tableMode,
		chunkMode: formatting?.chunkMode
	};
}
async function createDiscordPayloadSendContext(ctx) {
	const runtime = await loadDiscordSendRuntime();
	const nextReplyToId = createReplyToFanout(ctx);
	return {
		target: resolveDiscordOutboundTarget({
			to: ctx.to,
			threadId: ctx.threadId
		}),
		formatting: resolveDiscordFormattingOptions(ctx),
		resolveReply: () => resolveDiscordReplyReference({
			replyToId: nextReplyToId(),
			replyToIdSource: ctx.replyToIdSource,
			replyToMode: ctx.replyToMode
		}),
		send: resolveOutboundSendDep(ctx.deps, "discord") ?? runtime.sendMessageDiscord,
		sendVoice: resolveOutboundSendDep(ctx.deps, "discordVoice") ?? runtime.sendVoiceMessageDiscord
	};
}
//#endregion
//#region extensions/discord/src/outbound-payload.ts
const log$1 = createSubsystemLogger("discord/outbound");
function createDiscordUnknownPayloadResult(target) {
	return {
		messageId: "",
		channelId: target,
		receipt: createDiscordSendReceipt({
			platformMessageIds: [],
			channelId: target,
			kind: "unknown"
		})
	};
}
function resolveDiscordDeliveryOptions$1(ctx, sendContext, reply = sendContext.resolveReply()) {
	return {
		reply,
		accountId: ctx.accountId ?? void 0,
		silent: ctx.silent ?? void 0,
		cfg: ctx.cfg,
		onPlatformSendDispatch: ctx.onPlatformSendDispatch,
		assertPlatformSendAuthorized: ctx.assertDirectAdapterHandoff
	};
}
function resolveDiscordFormattedDeliveryOptions(ctx, sendContext, reply = sendContext.resolveReply()) {
	return {
		...resolveDiscordDeliveryOptions$1(ctx, sendContext, reply),
		...sendContext.formatting
	};
}
function resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl) {
	return {
		mediaUrl,
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile,
		...resolveDiscordFormattedDeliveryOptions(ctx, sendContext)
	};
}
async function sendDiscordOutboundPayload(params) {
	const ctx = params.ctx;
	const payload = normalizeDiscordApprovalPayload({
		...ctx.payload,
		text: ctx.payload.text ?? ""
	});
	const mediaUrls = resolvePayloadMediaUrls(payload);
	const sendContext = await createDiscordPayloadSendContext(ctx);
	const payloadContext = {
		...ctx,
		payload
	};
	const deliveredResults = [];
	let createdThreadId;
	payloadContext.onDeliveryResult = async (result) => {
		await ctx.onDeliveryResult?.(result);
		const threadId = result.receipt?.threadId;
		if (threadId && payloadContext.threadId == null) {
			payloadContext.threadId = threadId;
			sendContext.target = `channel:${threadId}`;
			createdThreadId = threadId;
		}
		if (createdThreadId && result.target?.kind === "channel" && result.receipt) deliveredResults.push({
			messageId: result.messageId,
			channelId: result.target.id,
			receipt: result.receipt
		});
	};
	const completeResult = (result) => createdThreadId ? {
		...result,
		receipt: createDiscordSendReceiptFromResults({
			results: deliveredResults,
			threadId: createdThreadId
		})
	} : result;
	const completeDelivery = (result) => attachChannelToResult("discord", toDiscordOutboundDeliveryResult(completeResult(result)));
	const onDeliveryResult = async (result) => await payloadContext.onDeliveryResult?.(attachChannelToResult("discord", toDiscordOutboundDeliveryResult(result)));
	if (payload.audioAsVoice && mediaUrls.length > 0) {
		const voiceReply = sendContext.resolveReply();
		let voiceFailure;
		let lastResult = createDiscordUnknownPayloadResult(sendContext.target);
		try {
			const voiceUrl = expectDefined(mediaUrls.at(0), "non-empty Discord voice media URLs");
			lastResult = await sendContext.sendVoice(sendContext.target, voiceUrl, {
				...resolveDiscordDeliveryOptions$1(ctx, sendContext, voiceReply),
				mediaAccess: ctx.mediaAccess,
				mediaLocalRoots: ctx.mediaLocalRoots,
				mediaReadFile: ctx.mediaReadFile
			});
		} catch (err) {
			if (hasDiscordMessageCreateAmbiguity(err)) throw err;
			const supplement = getReplyPayloadTtsSupplement(payload);
			const visibleFallbackText = payload.text?.trim() ? payload.text : void 0;
			const hiddenFallbackText = supplement?.visibleTextAlreadyDelivered ? void 0 : supplement?.spokenText;
			const fallbackText = visibleFallbackText ?? hiddenFallbackText;
			if (!fallbackText && !supplement?.visibleTextAlreadyDelivered) throw err;
			log$1.warn("discord voice send failed; continuing without voice", { error: err });
			if (fallbackText) await sendContext.send(sendContext.target, fallbackText, {
				verbose: false,
				...resolveDiscordFormattedDeliveryOptions(ctx, sendContext, voiceReply),
				onDeliveryResult
			});
			voiceFailure = { error: err };
		}
		if (!voiceFailure) {
			await payloadContext.onDeliveryResult?.(attachChannelToResult("discord", toDiscordOutboundDeliveryResult(lastResult)));
			if (payload.text?.trim()) lastResult = await sendContext.send(sendContext.target, payload.text, {
				verbose: false,
				...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
				onDeliveryResult
			});
		}
		for (const mediaUrl of mediaUrls.slice(1)) try {
			lastResult = await sendContext.send(sendContext.target, "", {
				verbose: false,
				...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
				onDeliveryResult
			});
		} catch (err) {
			if (!voiceFailure) throw err;
			log$1.warn("discord remaining media send failed after voice failure", { error: err });
		}
		if (voiceFailure) throw voiceFailure.error;
		return completeDelivery(lastResult);
	}
	const discordData = payload.channelData?.discord && typeof payload.channelData.discord === "object" && !Array.isArray(payload.channelData.discord) ? payload.channelData.discord : {};
	const filename = normalizeOptionalString(discordData.filename);
	const componentSpec = await resolveDiscordComponentSpec(payload);
	if (!componentSpec) {
		const nativeComponents = Array.isArray(discordData.components) ? discordData.components : void 0;
		const embeds = Array.isArray(discordData.embeds) ? discordData.embeds : void 0;
		if (nativeComponents || embeds?.length || filename) return completeDelivery(await sendPayloadMediaSequenceOrFallback({
			text: payload.text ?? "",
			mediaUrls,
			fallbackResult: createDiscordUnknownPayloadResult(sendContext.target),
			sendNoMedia: async () => await sendContext.send(sendContext.target, payload.text ?? "", {
				verbose: false,
				components: nativeComponents,
				embeds,
				filename,
				...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
				onDeliveryResult
			}),
			send: async ({ text, mediaUrl, isFirst }) => await sendContext.send(sendContext.target, text, {
				verbose: false,
				...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
				components: isFirst ? nativeComponents : void 0,
				embeds: isFirst ? embeds : void 0,
				filename: isFirst ? filename : void 0,
				onDeliveryResult
			})
		}));
		return completeResult(await sendTextMediaPayload({
			channel: "discord",
			ctx: payloadContext,
			adapter: params.fallbackAdapter
		}));
	}
	return completeDelivery(await sendPayloadMediaSequenceOrFallback({
		text: payload.text ?? "",
		mediaUrls,
		fallbackResult: createDiscordUnknownPayloadResult(sendContext.target),
		sendNoMedia: async () => {
			return await sendDiscordComponentMessageLazy(sendContext.target, componentSpec, {
				...resolveDiscordFormattedDeliveryOptions(ctx, sendContext),
				filename,
				onDeliveryResult
			});
		},
		send: async ({ text, mediaUrl, isFirst }) => {
			if (isFirst) return await sendDiscordComponentMessageLazy(sendContext.target, componentSpec, {
				...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
				filename,
				onDeliveryResult
			});
			return await sendContext.send(sendContext.target, text, {
				verbose: false,
				...resolveDiscordMediaDeliveryOptions(ctx, sendContext, mediaUrl),
				onDeliveryResult
			});
		}
	}));
}
//#endregion
//#region extensions/discord/src/outbound-adapter.ts
const DISCORD_TEXT_CHUNK_LIMIT = 2e3;
const DISCORD_PRECHUNK_MAX_LINES = Number.MAX_SAFE_INTEGER;
const log = createSubsystemLogger("discord/outbound");
const loadDiscordThreadBindings = createLazyRuntimeModule(() => import("./thread-bindings-CEh2dhqP.mjs").then((n) => n.t));
const loadDiscordComponentSendRuntime = createLazyRuntimeModule(() => import("./send.components-ChY21qr-.mjs").then((n) => n.i));
function resolveDiscordDeliveryOptions(params) {
	return {
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertPlatformSendAuthorized: params.assertDirectAdapterHandoff,
		onDeliveryResult: params.onDeliveryResult ? async (result) => params.onDeliveryResult?.(attachChannelToResult("discord", toDiscordOutboundDeliveryResult(result))) : void 0
	};
}
async function maybeSendDiscordWebhookText(params) {
	const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
	if (!threadId) return null;
	const { getThreadBindingManager } = await loadDiscordThreadBindings();
	const binding = getThreadBindingManager(params.accountId ?? void 0)?.getByThreadId(threadId);
	if (!binding?.webhookId || !binding?.webhookToken) return null;
	const username = normalizeOptionalString(params.identity?.name) || normalizeOptionalString(binding.label) || binding.agentId || "";
	const { sendWebhookMessageDiscord } = await loadDiscordSendRuntime();
	return await sendWebhookMessageDiscord(params.text, {
		webhookId: binding.webhookId,
		webhookToken: binding.webhookToken,
		accountId: binding.accountId,
		threadId: binding.threadId,
		cfg: params.cfg,
		replyTo: resolveDiscordReplyReference(params),
		username: truncateUtf16Safe(username, 80) || void 0,
		avatarUrl: normalizeOptionalString(params.identity?.avatarUrl),
		tableMode: params.formatting?.tableMode,
		chunking: {
			maxChars: params.formatting?.textLimit,
			maxLines: params.formatting?.maxLinesPerMessage
		},
		...resolveDiscordDeliveryOptions(params)
	});
}
async function resolveDiscordOutboundMessageSend(params) {
	const send = resolveOutboundSendDep(params.deps, "discord") ?? (await loadDiscordSendRuntime()).sendMessageDiscord;
	const reply = resolveDiscordReplyReference({
		replyToId: params.replyToId,
		replyToIdSource: params.replyToIdSource,
		replyToMode: params.replyToMode
	});
	return {
		send,
		target: resolveDiscordOutboundTarget({
			to: params.to,
			threadId: params.threadId
		}),
		options: {
			verbose: false,
			reply,
			accountId: params.accountId ?? void 0,
			silent: params.silent ?? void 0,
			cfg: params.cfg,
			...resolveDiscordFormattingOptions({ formatting: params.formatting }),
			...resolveDiscordDeliveryOptions(params)
		}
	};
}
const discordOutbound = {
	deliveryMode: "direct",
	chunker: (text, limit, ctx) => chunkDiscordTextWithMode(text, {
		maxChars: limit,
		maxLines: ctx?.formatting?.maxLinesPerMessage ?? DISCORD_PRECHUNK_MAX_LINES
	}),
	textChunkLimit: DISCORD_TEXT_CHUNK_LIMIT,
	pollMaxOptions: 10,
	normalizePayload: ({ payload }) => normalizeDiscordApprovalPayload(payload),
	presentationCapabilities: DISCORD_PRESENTATION_CAPABILITIES,
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		poll: true,
		payload: true,
		silent: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	renderPresentation: async ({ payload, presentation }) => {
		return await buildDiscordPresentationPayload({
			payload,
			presentation
		});
	},
	resolveTarget: ({ to, allowFrom }) => normalizeDiscordOutboundTarget(to, allowFrom),
	sendPayload: async (ctx) => await sendDiscordOutboundPayload({
		ctx,
		fallbackAdapter: discordOutbound
	}),
	...createAttachedChannelResultAdapter({
		channel: "discord",
		sendText: async (ctx) => {
			if (!ctx.silent) try {
				const webhookResult = await maybeSendDiscordWebhookText(ctx);
				if (webhookResult) return toDiscordOutboundDeliveryResult(webhookResult);
			} catch (error) {
				if (!canFallbackDiscordWebhookSend(error)) throw error;
				log.warn("discord webhook persona send failed; falling back to bot send", { error });
			}
			const { send, target, options } = await resolveDiscordOutboundMessageSend(ctx);
			return toDiscordOutboundDeliveryResult(await send(target, ctx.text, options));
		},
		sendMedia: async (ctx) => {
			const { send, target, options } = await resolveDiscordOutboundMessageSend(ctx);
			if (ctx.audioAsVoice && ctx.mediaUrl) {
				const sendVoice = resolveOutboundSendDep(ctx.deps, "discordVoice") ?? (await loadDiscordSendRuntime()).sendVoiceMessageDiscord;
				return toDiscordOutboundDeliveryResult(await sendVoice(target, ctx.mediaUrl, {
					cfg: ctx.cfg,
					reply: options.reply,
					accountId: ctx.accountId ?? void 0,
					silent: ctx.silent ?? void 0,
					mediaAccess: ctx.mediaAccess,
					mediaLocalRoots: ctx.mediaLocalRoots,
					mediaReadFile: ctx.mediaReadFile,
					onPlatformSendDispatch: ctx.onPlatformSendDispatch,
					assertPlatformSendAuthorized: ctx.assertDirectAdapterHandoff
				}));
			}
			const mediaOptions = {
				...options,
				mediaUrl: ctx.mediaUrl,
				mediaAccess: ctx.mediaAccess,
				mediaLocalRoots: ctx.mediaLocalRoots,
				mediaReadFile: ctx.mediaReadFile
			};
			if (ctx.text.trim() && ctx.mediaUrl && isLikelyDiscordVideoMedia(ctx.mediaUrl)) {
				const captionResult = await send(target, ctx.text, options);
				const mediaResult = await send(captionResult.receipt?.threadId ? `channel:${captionResult.receipt.threadId}` : target, "", {
					...mediaOptions,
					reply: options.reply?.scope === "all" ? options.reply : void 0
				});
				const threadId = captionResult.receipt?.threadId;
				return toDiscordOutboundDeliveryResult({
					...threadId ? captionResult : mediaResult,
					receipt: createDiscordSendReceiptFromResults({
						results: [captionResult, mediaResult],
						threadId
					})
				});
			}
			return toDiscordOutboundDeliveryResult(await send(target, ctx.text, mediaOptions));
		},
		sendPoll: async ({ cfg, to, poll, content, accountId, threadId, silent, sessionKey, inboundEventKind, onPlatformSendDispatch, assertDirectAdapterHandoff }) => {
			if (!createDiscordActionGate({
				cfg,
				accountId
			})("polls")) throw new Error("Discord polls are disabled.");
			const outboundTo = resolveDiscordOutboundTarget({
				to,
				threadId
			});
			const result = await (await loadDiscordSendRuntime()).sendPollDiscord(outboundTo, poll, {
				accountId: accountId ?? void 0,
				content,
				threadId: threadId ?? void 0,
				silent: silent ?? void 0,
				cfg,
				onPlatformSendDispatch,
				assertPlatformSendAuthorized: assertDirectAdapterHandoff
			});
			discordInboundEventDelivery.notify({
				sessionKey,
				inboundEventKind,
				to: outboundTo,
				accountId
			});
			return result;
		}
	}),
	adoptTargetFromDelivery: ({ result }) => {
		const threadId = normalizeOptionalStringifiedId(result.receipt?.threadId);
		return threadId ? { threadId } : null;
	},
	afterDeliverPayload: async ({ cfg, target, payload, results }) => {
		notifyDiscordInboundEventOutboundPayloadSuccess({
			payload,
			to: resolveDiscordOutboundTarget({
				to: target.to,
				threadId: target.threadId
			}),
			accountId: target.accountId
		});
		const questionId = questionGatewayRuntime.readAskUserQuestionId(payload);
		const result = results.find((candidate) => candidate.channel === "discord" && candidate.messageId);
		const componentSpec = questionId ? await resolveDiscordComponentSpec(payload) : void 0;
		if (questionId && result && componentSpec) {
			const to = resolveDiscordOutboundTarget({
				to: target.to,
				threadId: target.threadId
			});
			const channelId = result.target?.kind === "channel" ? result.target.id : to;
			questionGatewayRuntime.registerChannelDelivery({
				questionId,
				deliveryId: `discord:${target.accountId ?? "default"}:${channelId}:${result.messageId}`,
				finalize: async (statusLine) => {
					const { editDiscordComponentMessage } = await loadDiscordComponentSendRuntime();
					await editDiscordComponentMessage(to, result.messageId, {
						...componentSpec,
						blocks: [...(componentSpec.blocks ?? []).filter((block) => block.type !== "actions"), {
							type: "text",
							text: `-# ${formatDiscordApprovalDisplayValue(statusLine)}`
						}],
						modal: void 0
					}, {
						cfg,
						accountId: target.accountId ?? void 0
					});
				}
			});
		}
		const threadId = normalizeOptionalStringifiedId(target.threadId);
		if (!threadId) return;
		const { getThreadBindingManager } = await loadDiscordThreadBindings();
		const manager = getThreadBindingManager(target.accountId ?? void 0);
		if (!manager?.getByThreadId(threadId)) return;
		manager.touchThread({ threadId });
	}
};
//#endregion
export { discordOutbound as n, DISCORD_TEXT_CHUNK_LIMIT as t };
