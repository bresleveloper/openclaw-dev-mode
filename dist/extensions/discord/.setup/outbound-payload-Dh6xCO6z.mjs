import { t as createDiscordActionGate } from "./accounts-DtjvhJUj.mjs";
import { S as chunkDiscordTextWithMode, _ as canFallbackDiscordWebhookSend, b as hasDiscordMessageCreateAmbiguity, c as normalizeDiscordMessagingTarget, g as resolveDiscordReplyReference, i as toDiscordOutboundDeliveryResult, l as normalizeDiscordOutboundTarget, n as createDiscordSendReceiptFromResults, t as createDiscordSendReceipt } from "./send.receipt-CZ7ks6g7.mjs";
import { t as parseDiscordTarget } from "./target-parsing-BiuhcK9Q.mjs";
import { C as notifyDiscordInboundEventOutboundPayloadSuccess, S as discordInboundEventDelivery, a as resolveDiscordComponentSpec, c as formatDiscordApprovalDisplayValue, n as DISCORD_PRESENTATION_CAPABILITIES, o as sendDiscordComponentMessageLazy, r as buildDiscordPresentationPayload, v as resolveDiscordCurrentConversationIdentity } from "./outbound-session-route-G_fK5RAh.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getReplyPayloadTtsSupplement, resolvePayloadMediaUrls, sendPayloadMediaSequenceOrFallback, sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createReplyToFanout, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { attachChannelToResult, createAttachedChannelResultAdapter } from "openclaw/plugin-sdk/channel-send-result";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
// extensions/discord/src/channel.conversation.ts
function resolveDiscordAttachedOutboundTarget(params) {
	if (params.threadId == null) return params.to;
	const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
	return threadId ? `channel:${threadId}` : params.to;
}
function resolveDiscordConversationIdFromTargets(targets) {
	for (const raw of targets) {
		if (!raw) continue;
		try {
			const target = parseDiscordTarget(raw, { defaultKind: "channel" });
			if (target?.normalized) return target.normalized;
		} catch {}
	}
}
function parseDiscordParentChannelFromSessionKey(raw) {
	const match = normalizeLowercaseStringOrEmpty(raw).match(/(?:^|:)channel:([^:]+)$/);
	return match?.[1] ? `channel:${match[1]}` : void 0;
}
function resolveDiscordCommandConversation(params) {
	const threadConversation = resolveDiscordThreadConversationRef(params);
	if (threadConversation) return threadConversation;
	const conversationId = resolveDiscordCurrentConversationIdentity({
		from: params.from,
		chatType: params.chatType,
		originatingTo: params.originatingTo,
		commandTo: params.commandTo,
		fallbackTo: params.fallbackTo
	});
	return conversationId ? { conversationId } : null;
}
function resolveDiscordThreadConversationRef(params) {
	const threadId = normalizeOptionalStringifiedId(params.threadId);
	if (!threadId) return null;
	const targets = [
		params.originatingTo ?? params.to,
		params.commandTo,
		params.fallbackTo ?? params.conversationId
	];
	const parentConversationId = normalizeDiscordMessagingTarget(normalizeOptionalStringifiedId(params.threadParentId) ?? "") || parseDiscordParentChannelFromSessionKey(params.parentSessionKey) || resolveDiscordConversationIdFromTargets(targets);
	return {
		conversationId: threadId,
		...parentConversationId && parentConversationId !== threadId ? { parentConversationId } : {}
	};
}
function resolveDiscordInboundConversation(params) {
	const threadConversation = resolveDiscordThreadConversationRef({
		to: params.to,
		conversationId: params.conversationId,
		threadId: params.threadId,
		threadParentId: params.threadParentId
	});
	if (threadConversation) return threadConversation;
	const conversationId = resolveDiscordCurrentConversationIdentity({
		from: params.from,
		chatType: params.isGroup ? "group" : "direct",
		originatingTo: params.to,
		fallbackTo: params.conversationId
	});
	return conversationId ? { conversationId } : null;
}
// extensions/discord/src/outbound-payload.ts
const loadDiscordSendRuntime = createLazyRuntimeModule(() => import("./send-DKzwsZkm.mjs").then((n) => n.t));
function resolveDiscordDeliveryOptions(ctx) {
	return {
		onPlatformSendDispatch: ctx.onPlatformSendDispatch,
		assertPlatformSendAuthorized: ctx.assertDirectAdapterHandoff,
		onDeliveryResult: ctx.onDeliveryResult ? async (result) => ctx.onDeliveryResult?.(attachChannelToResult("discord", toDiscordOutboundDeliveryResult(result))) : void 0
	};
}
async function createDiscordOutboundSendContext(ctx) {
	const nextReplyToId = createReplyToFanout(ctx);
	const resolveReply = () => resolveDiscordReplyReference({
		replyToId: nextReplyToId(),
		replyToIdSource: ctx.replyToIdSource,
		replyToMode: ctx.replyToMode
	});
	const delivery = resolveDiscordDeliveryOptions(ctx);
	const common = {
		accountId: ctx.accountId ?? void 0,
		silent: ctx.silent ?? void 0,
		cfg: ctx.cfg,
		signal: ctx.signal,
		onPlatformSendDispatch: delivery.onPlatformSendDispatch,
		assertPlatformSendAuthorized: delivery.assertPlatformSendAuthorized
	};
	const media = {
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile
	};
	const options = (reply = resolveReply()) => ({
		...common,
		verbose: false,
		reply,
		textLimit: ctx.formatting?.textLimit,
		maxLinesPerMessage: ctx.formatting?.maxLinesPerMessage,
		tableMode: ctx.formatting?.tableMode,
		chunkMode: ctx.formatting?.chunkMode,
		onDeliveryResult: delivery.onDeliveryResult
	});
	return {
		target: resolveDiscordAttachedOutboundTarget(ctx),
		resolveReply,
		options,
		mediaOptions: (mediaUrl, reply = resolveReply()) => ({
			...options(reply),
			mediaUrl,
			...media
		}),
		voiceOptions: (reply = resolveReply()) => ({
			...common,
			reply,
			...media
		}),
		onDeliveryResult: delivery.onDeliveryResult,
		send: resolveOutboundSendDep(ctx.deps, "discord") ?? (await loadDiscordSendRuntime()).sendMessageDiscord,
		sendVoice: async (...args) => await (resolveOutboundSendDep(ctx.deps, "discordVoice") ?? (await loadDiscordSendRuntime()).sendVoiceMessageDiscord)(...args)
	};
}
function normalizeDiscordApprovalPayload(payload) {
	if (!asOptionalRecord(payload.channelData)?.execApproval || !payload.text) return payload;
	return {
		...payload,
		text: payload.text.replace(/@everyone/gi, "@​everyone").replace(/@here/gi, "@​here").replace(/<@/g, "<@​").replace(/<#/g, "<#​")
	};
}
const payloadLog = createSubsystemLogger("discord/outbound");
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
const DISCORD_TEXT_CHUNK_LIMIT = 2e3;
const DISCORD_PRECHUNK_MAX_LINES = Number.MAX_SAFE_INTEGER;
const DISCORD_VIDEO_MEDIA_EXTENSIONS = [
	".avi",
	".m4v",
	".mkv",
	".mov",
	".mp4",
	".webm"
];
const log = createSubsystemLogger("discord/outbound");
const loadDiscordThreadBindings = createLazyRuntimeModule(() => import("./thread-bindings-DTHVdmvF.mjs").then((n) => n.i));
const loadDiscordComponentSendRuntime = createLazyRuntimeModule(() => import("./send.components-CIZALYDP.mjs").then((n) => n.i));
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
	renderPresentation: buildDiscordPresentationPayload,
	resolveTarget: ({ to, allowFrom }) => normalizeDiscordOutboundTarget(to, allowFrom),
	sendPayload: async (ctx) => {
		const payload = normalizeDiscordApprovalPayload({
			...ctx.payload,
			text: ctx.payload.text ?? ""
		});
		const mediaUrls = resolvePayloadMediaUrls(payload);
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
		const sendContext = await createDiscordOutboundSendContext(payloadContext);
		const completeResult = (result) => createdThreadId ? {
			...result,
			receipt: createDiscordSendReceiptFromResults({
				results: deliveredResults,
				threadId: createdThreadId
			})
		} : result;
		const completeDelivery = (result) => attachChannelToResult("discord", toDiscordOutboundDeliveryResult(completeResult(result)));
		if (payload.audioAsVoice && mediaUrls.length > 0) {
			const voiceReply = sendContext.resolveReply();
			let voiceFailure;
			let lastResult = createDiscordUnknownPayloadResult(sendContext.target);
			try {
				const voiceUrl = expectDefined(mediaUrls.at(0), "non-empty Discord voice media URLs");
				lastResult = await sendContext.sendVoice(sendContext.target, voiceUrl, sendContext.voiceOptions(voiceReply));
			} catch (err) {
				if (hasDiscordMessageCreateAmbiguity(err)) throw err;
				const supplement = getReplyPayloadTtsSupplement(payload);
				const visibleFallbackText = payload.text?.trim() ? payload.text : void 0;
				const hiddenFallbackText = supplement?.visibleTextAlreadyDelivered ? void 0 : supplement?.spokenText;
				const fallbackText = visibleFallbackText ?? hiddenFallbackText;
				if (!fallbackText && !supplement?.visibleTextAlreadyDelivered) throw err;
				payloadLog.warn("discord voice send failed; continuing without voice", { error: err });
				if (fallbackText) await sendContext.send(sendContext.target, fallbackText, sendContext.options(voiceReply));
				voiceFailure = { error: err };
			}
			if (!voiceFailure) {
				await sendContext.onDeliveryResult?.(lastResult);
				if (payload.text?.trim()) lastResult = await sendContext.send(sendContext.target, payload.text, sendContext.options());
			}
			for (const mediaUrl of mediaUrls.slice(1)) try {
				lastResult = await sendContext.send(sendContext.target, "", sendContext.mediaOptions(mediaUrl));
			} catch (err) {
				if (!voiceFailure) throw err;
				payloadLog.warn("discord remaining media send failed after voice failure", { error: err });
			}
			if (voiceFailure) throw voiceFailure.error;
			return completeDelivery(lastResult);
		}
		const discordData = asOptionalRecord(payload.channelData?.discord) ?? {};
		const literalText = discordData.literalText === true;
		const literalOptions = literalText ? {
			suppressEmbeds: true,
			allowedMentions: { parse: [] }
		} : {};
		const filename = normalizeOptionalString(discordData.filename);
		const componentSpec = await resolveDiscordComponentSpec(payload);
		const nativeComponents = !componentSpec && Array.isArray(discordData.components) ? discordData.components : void 0;
		const embeds = !componentSpec && Array.isArray(discordData.embeds) ? discordData.embeds : void 0;
		if (!literalText && !componentSpec && !nativeComponents && !embeds?.length && !filename) return completeResult(await sendTextMediaPayload({
			channel: "discord",
			ctx: payloadContext,
			adapter: discordOutbound
		}));
		return completeDelivery(await sendPayloadMediaSequenceOrFallback({
			text: payload.text ?? "",
			mediaUrls,
			fallbackResult: createDiscordUnknownPayloadResult(sendContext.target),
			sendNoMedia: async () => componentSpec ? await sendDiscordComponentMessageLazy(sendContext.target, componentSpec, {
				...sendContext.options(),
				filename
			}) : await sendContext.send(sendContext.target, payload.text ?? "", {
				components: nativeComponents,
				embeds,
				filename,
				...sendContext.options(),
				...literalOptions
			}),
			send: async ({ text, mediaUrl, isFirst }) => {
				if (componentSpec && isFirst) return await sendDiscordComponentMessageLazy(sendContext.target, componentSpec, {
					...sendContext.mediaOptions(mediaUrl),
					filename
				});
				return await sendContext.send(sendContext.target, text, {
					...sendContext.mediaOptions(mediaUrl),
					...literalOptions,
					...!componentSpec ? {
						components: isFirst ? nativeComponents : void 0,
						embeds: isFirst ? embeds : void 0,
						filename: isFirst ? filename : void 0
					} : {}
				});
			}
		}));
	},
	...createAttachedChannelResultAdapter({
		channel: "discord",
		sendText: async (ctx) => {
			if (!ctx.silent && !resolveDiscordReplyReference(ctx)) try {
				const threadId = normalizeOptionalStringifiedId(ctx.threadId) ?? "";
				if (threadId) {
					const { getThreadBindingManager } = await loadDiscordThreadBindings();
					const binding = getThreadBindingManager(ctx.accountId ?? void 0)?.getByThreadId(threadId);
					if (binding?.webhookId && binding.webhookToken) {
						const username = normalizeOptionalString(ctx.identity?.name) || normalizeOptionalString(binding.label) || binding.agentId || "";
						const { sendWebhookMessageDiscord } = await loadDiscordSendRuntime();
						const webhookResult = await sendWebhookMessageDiscord(ctx.text, {
							webhookId: binding.webhookId,
							webhookToken: binding.webhookToken,
							accountId: binding.accountId,
							threadId: binding.threadId,
							cfg: ctx.cfg,
							signal: ctx.signal,
							username: truncateUtf16Safe(username, 80) || void 0,
							avatarUrl: normalizeOptionalString(ctx.identity?.avatarUrl),
							tableMode: ctx.formatting?.tableMode,
							chunking: {
								maxChars: ctx.formatting?.textLimit,
								maxLines: ctx.formatting?.maxLinesPerMessage
							},
							...resolveDiscordDeliveryOptions(ctx)
						});
						if (webhookResult) return toDiscordOutboundDeliveryResult(webhookResult);
					}
				}
			} catch (error) {
				if (!canFallbackDiscordWebhookSend(error)) throw error;
				log.warn("discord webhook persona send failed; falling back to bot send", { error });
			}
			const prepared = await createDiscordOutboundSendContext(ctx);
			return toDiscordOutboundDeliveryResult(await prepared.send(prepared.target, ctx.text, prepared.options()));
		},
		sendMedia: async (ctx) => {
			const prepared = await createDiscordOutboundSendContext(ctx);
			const { send, target } = prepared;
			const reply = prepared.resolveReply();
			if (ctx.audioAsVoice && ctx.mediaUrl) return toDiscordOutboundDeliveryResult(await prepared.sendVoice(target, ctx.mediaUrl, prepared.voiceOptions(reply)));
			const options = prepared.options(reply);
			const mediaOptions = prepared.mediaOptions(ctx.mediaUrl, reply);
			const trimmed = ctx.text.trim() && ctx.mediaUrl?.trim();
			if (trimmed) {
				let path;
				try {
					const { pathname } = new URL(trimmed);
					path = pathname.slice(pathname.lastIndexOf("/") + 1);
					try {
						path = decodeURIComponent(path);
					} catch {}
				} catch {
					path = trimmed.split(/[?#]/, 1)[0] ?? trimmed;
				}
				const normalized = normalizeLowercaseStringOrEmpty(path);
				if (DISCORD_VIDEO_MEDIA_EXTENSIONS.some((ext) => normalized.endsWith(ext))) {
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
			}
			return toDiscordOutboundDeliveryResult(await send(target, ctx.text, mediaOptions));
		},
		sendPoll: async ({ cfg, to, poll, content, accountId, threadId, silent, signal, sessionKey, inboundEventKind, onPlatformSendDispatch, assertDirectAdapterHandoff }) => {
			if (!createDiscordActionGate({
				cfg,
				accountId
			})("polls")) throw new Error("Discord polls are disabled.");
			const outboundTo = resolveDiscordAttachedOutboundTarget({
				to,
				threadId
			});
			const result = await (await loadDiscordSendRuntime()).sendPollDiscord(outboundTo, poll, {
				accountId: accountId ?? void 0,
				content,
				threadId: threadId ?? void 0,
				silent: silent ?? void 0,
				cfg,
				signal,
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
			to: resolveDiscordAttachedOutboundTarget({
				to: target.to,
				threadId: target.threadId
			}),
			accountId: target.accountId
		});
		const questionId = questionGatewayRuntime.readAskUserQuestionId(payload);
		const result = results.find((candidate) => candidate.channel === "discord" && candidate.messageId);
		const componentSpec = questionId ? await resolveDiscordComponentSpec(payload) : void 0;
		if (questionId && result && componentSpec) {
			const to = resolveDiscordAttachedOutboundTarget({
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
		await manager.touchThread({ threadId });
	}
};
export { resolveDiscordInboundConversation as a, resolveDiscordCommandConversation as i, discordOutbound as n, resolveDiscordAttachedOutboundTarget as r, DISCORD_TEXT_CHUNK_LIMIT as t };
