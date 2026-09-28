import { C as buildSlackBlocksFallbackText, J as markdownToSlackMrkdwnChunks, b as isSlackInvalidBlocksResponse, g as buildSlackNativeDataAccessibilityText, k as SLACK_TEXT_LIMIT, v as hasSlackNativeDataBlock, x as isSlackNativeResponseUrlRejection } from "./session-status-Cf7AvWOt.mjs";
import { n as iterateSlackReplyDeliveryMessages, o as resolveSlackReplyBlockResolution, s as resolveSlackReplyBlocks, t as hasSlackReplyStructuredContent } from "./reply-blocks-Bm8kf6mK.mjs";
import { n as resolveSlackReplyThreadTs } from "./thread-ts-CukseRVL.mjs";
import { h as chunkSlackTextAtHardLimit, m as buildSlackNativeDataDeliveryPlan, r as sendMessageSlack } from "./send-Cp6omkOg.mjs";
import { c as createSlackResponseUrlBudget, s as SlackResponseAlreadyReportedError } from "./provider-C-jPaGt2.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createReplyReferencePlanner } from "openclaw/plugin-sdk/reply-reference";
import { deliverTextOrMediaReply, getReplyPayloadTtsSupplement, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { SILENT_REPLY_TOKEN, chunkMarkdownTextWithMode, isSilentReplyText } from "openclaw/plugin-sdk/reply-chunking";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { createChannelPartialDeliveryError, getGroupThreadDeliverySession } from "openclaw/plugin-sdk/channel-inbound";
import { buildCanonicalSentMessageHookContext, createInternalHookEvent, fireAndForgetHook, toInternalMessageSentContext, toPluginMessageContext, toPluginMessageSentEvent, triggerInternalHook } from "openclaw/plugin-sdk/hook-runtime";
//#region extensions/slack/src/message-sent-hook.ts
/**
* Slack-side emission of the `message_sent` plugin hook.
*
* Mirrors the Telegram pattern in `extensions/telegram/src/bot/delivery.replies.ts`
* (`buildTelegramSentHookContext`, `emitMessageSentHooks`, `emitTelegramMessageSentHooks`).
*
* Without this, plugins observing `message_sent` see Telegram outbound but not
* Slack outbound — even though `docs/plugins/hooks.md` documents the hook as
* firing for all successful outbound deliveries.
*/
function buildSlackSentHookContext(params) {
	return buildCanonicalSentMessageHookContext({
		to: params.to,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: "slack",
		accountId: params.accountId ?? void 0,
		conversationId: params.to,
		sessionKey: params.sessionKeyForInternalHooks,
		messageId: params.messageId,
		isGroup: params.isGroup,
		groupId: params.groupId
	});
}
function emitInternalSlackMessageSentHook(params) {
	if (!params.sessionKeyForInternalHooks) return;
	const canonical = buildSlackSentHookContext(params);
	fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), "slack: message:sent internal hook failed");
}
function emitMessageSentHooks(params) {
	if (!params.enabled && !params.sessionKeyForInternalHooks) return;
	const canonical = buildSlackSentHookContext(params);
	if (params.enabled) fireAndForgetHook(Promise.resolve(params.hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical))), "slack: message_sent plugin hook failed");
	emitInternalSlackMessageSentHook(params);
}
/**
* Fire both the plugin `message_sent` hook and (if a session key is supplied)
* the internal `message:sent` hook for a successful or failed Slack outbound
* delivery.
*
* Safe to call after every `chat.postMessage` — the function self-gates on
* `hookRunner.hasHooks("message_sent")` so plugins not observing the hook
* incur no cost.
*/
function emitSlackMessageSentHooks(params) {
	const hookRunner = getGlobalHookRunner();
	emitMessageSentHooks({
		...params,
		hookRunner,
		enabled: hookRunner?.hasHooks("message_sent") ?? false
	});
}
//#endregion
//#region extensions/slack/src/monitor/replies.ts
function compactSlackResponseUrlFallback(messages) {
	if (messages.length <= 1) return [...messages];
	if (messages.every((message) => !message.blocks?.length)) return chunkSlackTextAtHardLimit(messages.map((message) => message.text).join("")).map((text) => ({
		text,
		mrkdwn: false
	}));
	const compacted = [];
	let pending;
	const flush = () => {
		if (pending) {
			compacted.push(pending);
			pending = void 0;
		}
	};
	for (const message of messages) {
		if (!message.blocks?.length) {
			flush();
			compacted.push(message);
			continue;
		}
		if (!pending?.blocks?.length) {
			pending = {
				...message,
				blocks: [...message.blocks]
			};
			continue;
		}
		const text = `${pending.text}\n\n${message.text}`;
		const blocks = [...pending.blocks, ...message.blocks];
		if (text.length > 4e4 || blocks.length > 50) {
			flush();
			pending = {
				...message,
				blocks: [...message.blocks]
			};
			continue;
		}
		pending = {
			text,
			blocks,
			mrkdwn: false
		};
	}
	flush();
	return compacted;
}
function readSlackReplyBlocks(payload) {
	return resolveSlackReplyBlocks(payload);
}
function sanitizeSlackMonitorReplyPayload(payload) {
	if (payload.isReasoning === true || typeof payload.text !== "string") return payload.isReasoning === true ? null : payload;
	const text = sanitizeAssistantVisibleText(payload.text);
	if (text === payload.text) return payload;
	return text || resolveSendableOutboundReplyParts(payload).hasMedia || hasSlackReplyStructuredContent(payload) ? {
		...payload,
		text: text || void 0
	} : null;
}
function resolveSlackMediaHookSpokenText(payload) {
	return (getReplyPayloadTtsSupplement(payload)?.spokenText ?? payload.spokenText)?.trim() || void 0;
}
async function deliverReplies(params) {
	const deliverySession = getGroupThreadDeliverySession();
	const sessionKeyForInternalHooks = deliverySession?.sessionKey ?? params.sessionKeyForInternalHooks;
	const mediaLocalRoots = deliverySession ? getAgentScopedMediaLocalRoots(params.cfg, deliverySession.agentId) : void 0;
	let latestResult;
	for (const prepared of params.replies) {
		const { payload } = prepared;
		if (payload.isReasoning === true) continue;
		const threadTs = resolveSlackReplyThreadTs({
			replyToMode: params.replyToMode,
			replyToId: payload.replyToId,
			threadId: params.replyThreadTs,
			replyToCurrent: payload.replyToCurrent
		});
		const reply = resolveSendableOutboundReplyParts(payload);
		const textRaw = reply.hasText && !isSilentReplyText(reply.trimmedText, SILENT_REPLY_TOKEN) ? reply.trimmedText : void 0;
		const { authoredTextPlacement, segments } = prepared.resolveDelivery();
		if (!textRaw && !reply.hasMedia && segments.length === 0) continue;
		const acceptedResults = [];
		const sendReply = async (input) => {
			return await sendMessageSlack(params.target, input.text, {
				cfg: params.cfg,
				token: params.token,
				threadTs: input.threadTs,
				accountId: params.accountId,
				onDeliveryResult: (result) => {
					acceptedResults.push(result);
				},
				...input.mediaUrl ? { mediaUrl: input.mediaUrl } : {},
				...mediaLocalRoots ? { mediaLocalRoots } : {},
				...input.blocks ? { blocks: input.blocks } : {},
				...input.authoredTextPlacement ? { authoredTextPlacement: input.authoredTextPlacement } : {},
				...Object.hasOwn(input, "nativeDataFallbackBaseText") ? { nativeDataFallbackBaseText: input.nativeDataFallbackBaseText } : {},
				...input.textIsSlackMrkdwn ? { textIsSlackMrkdwn: true } : {},
				...input.textIsSlackPlainText ? { textIsSlackPlainText: true } : {},
				...params.eventScope ? {
					eventScope: params.eventScope,
					textLimit: params.textLimit,
					...params.mediaMaxBytes !== void 0 ? { mediaMaxBytes: params.mediaMaxBytes } : {}
				} : {},
				...params.identity ? { identity: params.identity } : {},
				...params.metadata ? { metadata: params.metadata } : {}
			});
		};
		const emitDelivery = (content, result) => {
			if (params.deferMessageSentHooks) return;
			emitSlackMessageSentHooks({
				sessionKeyForInternalHooks,
				to: params.messageSentHookTarget ?? params.target,
				accountId: params.accountId,
				content,
				...result,
				isGroup: params.isGroup,
				groupId: params.groupId
			});
		};
		const spokenText = resolveSlackMediaHookSpokenText(payload);
		const hookParts = [];
		let outsideText = authoredTextPlacement === "outside-blocks" ? textRaw ?? "" : "";
		let lastResult;
		let delivered = false;
		try {
			if (reply.hasMedia) {
				const mediaCaption = outsideText;
				if (mediaCaption) {
					hookParts.push(mediaCaption);
					outsideText = "";
				} else if (!textRaw && spokenText) hookParts.push(spokenText);
				const mediaDelivery = await deliverTextOrMediaReply({
					payload,
					text: mediaCaption,
					sendText: async (text) => {
						lastResult = await sendReply({
							text,
							threadTs
						});
					},
					sendMedia: async ({ mediaUrl, caption }) => {
						lastResult = await sendReply({
							text: caption ?? "",
							mediaUrl,
							threadTs
						});
					}
				});
				delivered ||= mediaDelivery !== "empty";
			}
			for (const message of iterateSlackReplyDeliveryMessages({
				authoredTextPlacement,
				segments,
				text: outsideText
			})) {
				hookParts.push(message.text);
				if (message.textIsSlackPlainText) {
					for (const chunk of chunkSlackTextAtHardLimit(message.text)) {
						lastResult = await sendReply({
							text: chunk,
							threadTs,
							textIsSlackPlainText: true
						});
						delivered = true;
					}
					continue;
				}
				lastResult = await sendReply({
					...message.blocks ? {
						...message,
						text: message.nativeDataFallbackBaseText ?? ""
					} : { text: message.text },
					threadTs
				});
				delivered = true;
			}
		} catch (error) {
			emitDelivery(hookParts.join("\n\n") || textRaw || spokenText || "", {
				success: false,
				error: formatErrorMessage(error)
			});
			if (acceptedResults.length === 0) throw error;
			const receipt = createMessageReceiptFromOutboundResults({ results: acceptedResults });
			throw createChannelPartialDeliveryError(error, {
				messageIds: receipt.platformMessageIds,
				receipt,
				visibleReplySent: true
			});
		}
		if (delivered) {
			emitDelivery(hookParts.join("\n\n") || textRaw || spokenText || "", {
				success: true,
				messageId: reply.hasMedia ? void 0 : lastResult?.messageId
			});
			latestResult = lastResult;
			params.runtime.log?.(`delivered reply to ${params.target}`);
		}
	}
	return latestResult;
}
/**
* Compute effective threadTs for a Slack reply based on replyToMode.
* - "off": stay in thread if already in one, otherwise main channel
* - "first": first reply goes to thread, subsequent replies to main channel
* - "all": all replies go to thread
*/
function resolveSlackThreadTs(params) {
	return createSlackReplyReferencePlanner({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: params.hasReplied,
		isThreadReply: params.isThreadReply
	}).use();
}
function createSlackReplyReferencePlanner(params) {
	const effectiveMode = params.isThreadReply ?? Boolean(params.incomingThreadTs && params.incomingThreadTs !== params.messageTs) ? "all" : params.replyToMode;
	return createReplyReferencePlanner({
		replyToMode: effectiveMode,
		existingId: params.incomingThreadTs,
		startId: params.messageTs,
		hasReplied: params.hasReplied
	});
}
function createSlackReplyDeliveryPlan(params) {
	const replyReference = createSlackReplyReferencePlanner({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: params.hasRepliedRef.value,
		isThreadReply: params.isThreadReply
	});
	return {
		peekThreadTs: () => replyReference.peek(),
		nextThreadTs: () => replyReference.use(),
		markSent: () => {
			replyReference.markSent();
			params.hasRepliedRef.value = replyReference.hasReplied();
		}
	};
}
async function deliverSlackSlashReplies(params) {
	const deliveries = [];
	const responseBudget = params.responseBudget ?? createSlackResponseUrlBudget(params.respond);
	const chunkLimit = Math.max(1, Math.min(params.textLimit, SLACK_TEXT_LIMIT));
	const createBlockMessagePlan = (input) => {
		const plan = buildSlackNativeDataDeliveryPlan({
			blocks: input.blocks,
			baseText: input.baseText
		});
		const nativeFallback = responseBudget.remaining() === void 0 ? plan.fallbackMessages : compactSlackResponseUrlFallback(plan.fallbackMessages);
		return {
			message: {
				text: plan.accessibilityText,
				blocks: input.blocks,
				mrkdwn: false
			},
			nativeFallback,
			...plan.skipOriginalBlocks ? { skipOriginalBlocks: true } : {}
		};
	};
	for (const [replyIndex, payload] of params.replies.entries()) {
		if (payload.isReasoning === true) continue;
		const reply = resolveSendableOutboundReplyParts(payload);
		const textRaw = reply.hasText && !isSilentReplyText(reply.trimmedText, SILENT_REPLY_TOKEN) ? reply.trimmedText : void 0;
		const materializeAuthoredText = hasSlackReplyStructuredContent(payload);
		const { authoredTextPlacement, segments } = resolveSlackReplyBlockResolution(payload, { materializeAuthoredText });
		let outsideText = authoredTextPlacement === "outside-blocks" ? textRaw ?? "" : "";
		const messages = [];
		const hookParts = [];
		for (const segment of segments) {
			if (segment.kind === "text") {
				const text = [outsideText, segment.text].filter(Boolean).join("\n\n");
				outsideText = "";
				if (text) {
					hookParts.push(text);
					messages.push(...chunkSlackTextAtHardLimit(text).map((chunk) => ({ message: {
						text: chunk,
						mrkdwn: false
					} })));
				}
				continue;
			}
			const baseText = outsideText;
			outsideText = "";
			const accessibilityText = buildSlackNativeDataAccessibilityText(baseText, segment.blocks) || buildSlackBlocksFallbackText(segment.blocks);
			hookParts.push(accessibilityText);
			const blockPlan = createBlockMessagePlan({
				blocks: segment.blocks,
				baseText
			});
			messages.push(hasSlackNativeDataBlock(segment.blocks) || blockPlan.skipOriginalBlocks ? blockPlan : { message: blockPlan.message });
		}
		if (outsideText) hookParts.push(outsideText);
		if (reply.mediaUrls.length > 0) hookParts.push(...reply.mediaUrls);
		if (segments.length > 0) {
			const trailingText = [outsideText, ...reply.mediaUrls].filter(Boolean).join("\n");
			if (trailingText) messages.push(...chunkSlackTextAtHardLimit(trailingText).map((text) => ({ message: {
				text,
				mrkdwn: false
			} })));
			if (messages.length > 0) deliveries.push({
				replyIndex,
				hookContent: hookParts.filter(Boolean).join("\n\n"),
				messages
			});
			continue;
		}
		const combined = [textRaw ?? "", ...reply.mediaUrls].filter(Boolean).join("\n");
		if (!combined) continue;
		const chunkMode = params.chunkMode ?? "length";
		const chunks = (chunkMode === "newline" ? chunkMarkdownTextWithMode(combined, chunkLimit, chunkMode) : [combined]).flatMap((markdown) => markdownToSlackMrkdwnChunks(markdown, chunkLimit, { tableMode: params.tableMode }));
		deliveries.push({
			replyIndex,
			hookContent: textRaw ?? resolveSlackMediaHookSpokenText(payload) ?? combined,
			messages: (chunks.length > 0 ? chunks : [combined]).map((text) => ({ message: { text } }))
		});
	}
	const plannedReplyIndexes = new Set(deliveries.map((delivery) => delivery.replyIndex));
	for (const replyIndex of params.replies.keys()) if (!plannedReplyIndexes.has(replyIndex)) params.onReplySettled?.({
		replyIndex,
		visibleReplySent: false
	});
	if (deliveries.length === 0) return;
	const responseType = params.ephemeral ? "ephemeral" : "in_channel";
	const respond = async (message) => await responseBudget.respond({
		text: message.text,
		response_type: responseType,
		...message.blocks ? { blocks: message.blocks } : {},
		...message.mrkdwn === false ? { mrkdwn: false } : {}
	});
	const emitDeliveryFailure = (delivery, error) => {
		if (!params.messageSentHookTarget) return;
		emitSlackMessageSentHooks({
			sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
			to: params.messageSentHookTarget,
			accountId: params.accountId,
			content: delivery.hookContent,
			success: false,
			error: formatErrorMessage(error),
			isGroup: params.isGroup,
			groupId: params.groupId
		});
	};
	const minimumCalls = deliveries.flatMap((delivery) => delivery.messages).map((planned) => planned.nativeFallback?.length ?? 1);
	const minimumRemainingCalls = Array.from({ length: minimumCalls.length + 1 }, () => 0);
	for (let index = minimumCalls.length - 1; index >= 0; index -= 1) minimumRemainingCalls[index] = (minimumRemainingCalls[index + 1] ?? 0) + (minimumCalls[index] ?? 0);
	const failOversizedDelivery = async () => {
		const message = "Slack response exceeds the remaining response_url delivery budget.";
		let failure = /* @__PURE__ */ new Error(message);
		if (responseBudget.remaining() !== 0) try {
			await responseBudget.respond({
				text: "This Slack response is too large to deliver within the remaining response window.",
				response_type: "ephemeral"
			});
			failure = new SlackResponseAlreadyReportedError(message);
		} catch (error) {
			failure = error;
		}
		for (const delivery of deliveries) {
			emitDeliveryFailure(delivery, failure);
			params.onReplySettled?.({
				replyIndex: delivery.replyIndex,
				visibleReplySent: false,
				error: failure
			});
		}
		throw failure;
	};
	const initialRemaining = responseBudget.remaining();
	const initialMinimumCalls = minimumCalls.reduce((total, calls) => total + calls, 0);
	if (initialRemaining !== void 0 && initialMinimumCalls > initialRemaining) await failOversizedDelivery();
	const deliverNativeFallback = async (messages, onVisible) => {
		for (const message of messages) {
			const response = await respond(message);
			if (await isSlackInvalidBlocksResponse(response)) throw new Error("Slack rejected the native-data fallback blocks with invalid_blocks.");
			onVisible();
		}
	};
	let plannedIndex = 0;
	for (const delivery of deliveries) {
		let visibleReplySent = false;
		const markVisible = () => {
			visibleReplySent = true;
		};
		try {
			for (const planned of delivery.messages) {
				const minimumAfter = minimumRemainingCalls[plannedIndex + 1] ?? 0;
				plannedIndex += 1;
				const fallback = planned.nativeFallback;
				if (!fallback) {
					await respond(planned.message);
					markVisible();
					continue;
				}
				const remaining = responseBudget.remaining();
				if (!(!planned.skipOriginalBlocks && (remaining === void 0 || 1 + fallback.length + minimumAfter <= remaining))) {
					await deliverNativeFallback(fallback, markVisible);
					continue;
				}
				let rejectedNativeBlocks = false;
				try {
					const response = await respond(planned.message);
					rejectedNativeBlocks = await isSlackInvalidBlocksResponse(response);
					if (!rejectedNativeBlocks) markVisible();
				} catch (error) {
					if (!isSlackNativeResponseUrlRejection(error)) throw error;
					rejectedNativeBlocks = true;
				}
				if (rejectedNativeBlocks) await deliverNativeFallback(fallback, markVisible);
			}
		} catch (error) {
			const deliveryError = visibleReplySent ? createChannelPartialDeliveryError(error, {
				content: delivery.hookContent,
				visibleReplySent: true
			}) : error;
			emitDeliveryFailure(delivery, deliveryError);
			params.onReplySettled?.({
				replyIndex: delivery.replyIndex,
				visibleReplySent,
				error: deliveryError
			});
			throw deliveryError;
		}
		if (params.messageSentHookTarget) emitSlackMessageSentHooks({
			sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
			to: params.messageSentHookTarget,
			accountId: params.accountId,
			content: delivery.hookContent,
			success: true,
			isGroup: params.isGroup,
			groupId: params.groupId
		});
		params.onReplySettled?.({
			replyIndex: delivery.replyIndex,
			visibleReplySent: true
		});
	}
}
//#endregion
export { resolveSlackThreadTs as a, readSlackReplyBlocks as i, deliverReplies as n, sanitizeSlackMonitorReplyPayload as o, deliverSlackSlashReplies as r, emitSlackMessageSentHooks as s, createSlackReplyDeliveryPlan as t };
