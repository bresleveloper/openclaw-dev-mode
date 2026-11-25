import { Et as markdownToSlackMrkdwnChunks, N as isSlackInvalidBlocksResponse, P as isSlackNativeResponseUrlRejection, j as hasSlackNativeDataBlock, wt as SLACK_TEXT_LIMIT } from "./probe-BHqvMbno.mjs";
import { n as resolveSlackReplyThreadTs } from "./thread-ts-47Au2-Yn.mjs";
import { a as resolveSlackReplyBlockResolution, n as iterateSlackReplyDeliveryMessages, t as hasSlackReplyStructuredContent } from "./reply-blocks-CFy-O-2B.mjs";
import { g as chunkSlackTextAtHardLimit, h as buildSlackNativeDataDeliveryPlan, i as updateMessageSlack, t as sendMessageSlack } from "./send-kGJWQtLk.mjs";
import { a as createSlackResponseUrlBudget, i as SlackResponseAlreadyReportedError } from "./monitor-MmW89Bu-.mjs";
import { t as registerSlackQuestionDelivery } from "./question-delivery-BGwm5Zmr.mjs";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createReplyReferencePlanner } from "openclaw/plugin-sdk/reply-reference";
import { deliverTextOrMediaReply, getReplyPayloadTtsSupplement, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { chunkMarkdownTextWithMode } from "openclaw/plugin-sdk/reply-chunking";
import { resolveOutboundMediaAccessForConfig } from "openclaw/plugin-sdk/outbound-media";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { createAcceptedChannelDeliveryResult, createChannelPartialDeliveryError, getGroupThreadDeliverySession } from "openclaw/plugin-sdk/channel-inbound";
import { buildCanonicalSentMessageHookContext, createInternalHookEvent, fireAndForgetHook, toInternalMessageSentContext, toPluginMessageContext, toPluginMessageSentEvent, triggerInternalHook } from "openclaw/plugin-sdk/hook-runtime";
// extensions/slack/src/message-sent-hook.ts
function emitSlackMessageSentHooks(params) {
	const hookRunner = getGlobalHookRunner();
	const enabled = hookRunner?.hasHooks("message_sent") ?? false;
	if (!enabled && !params.sessionKeyForInternalHooks) return;
	const canonical = buildCanonicalSentMessageHookContext({
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
	if (enabled) fireAndForgetHook(Promise.resolve(hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical))), "slack: message_sent plugin hook failed");
	if (params.sessionKeyForInternalHooks) fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), "slack: message:sent internal hook failed");
}
// extensions/slack/src/monitor/replies.ts
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
		if (pending?.blocks?.length) {
			const text = `${pending.text}\n\n${message.text}`;
			const blocks = [...pending.blocks, ...message.blocks];
			if (text.length <= 4e4 && blocks.length <= 50) {
				pending = {
					text,
					blocks,
					mrkdwn: false
				};
				continue;
			}
			flush();
		}
		pending = {
			...message,
			blocks: [...message.blocks]
		};
	}
	flush();
	return compacted;
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
	const mediaAccess = resolveOutboundMediaAccessForConfig(params.cfg);
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
		const textRaw = reply.hasText ? reply.trimmedText : void 0;
		const { authoredTextPlacement, segments } = prepared.resolveDelivery();
		const questionId = questionGatewayRuntime.readAskUserQuestionId(payload);
		if (!textRaw && !reply.hasMedia && segments.length === 0) continue;
		const acceptedResults = [];
		const sendReply = async (input) => {
			const { text, ...options } = input;
			return await sendMessageSlack(params.target, text, {
				...options,
				cfg: params.cfg,
				token: params.token,
				accountId: params.accountId,
				...mediaLocalRoots ? { mediaLocalRoots } : {},
				mediaAccess,
				onDeliveryResult: (result) => {
					acceptedResults.push(result);
					if (questionId) registerSlackQuestionDelivery({
						questionId,
						accountId: params.accountId,
						result,
						text,
						update: async (message) => {
							await updateMessageSlack({
								...message,
								cfg: params.cfg,
								accountId: params.accountId,
								token: params.token,
								eventScope: params.eventScope
							});
						}
					});
				},
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
			throw createChannelPartialDeliveryError(error, createAcceptedChannelDeliveryResult({ results: acceptedResults }));
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
function createSlackReplyDeliveryPlan(params) {
	const replyReference = createReplyReferencePlanner({
		replyToMode: params.isThreadReply ? "all" : params.replyToMode,
		existingId: params.incomingThreadTs,
		startId: params.messageTs,
		hasReplied: params.hasRepliedRef.value
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
		const textRaw = reply.hasText ? reply.trimmedText : void 0;
		const materializeAuthoredText = hasSlackReplyStructuredContent(payload);
		const { authoredTextPlacement, segments } = resolveSlackReplyBlockResolution(payload, {
			materializeAuthoredText,
			tableMode: params.tableMode
		});
		if (segments.length > 0) {
			const messages = [];
			const hookParts = [];
			for (const message of iterateSlackReplyDeliveryMessages({
				authoredTextPlacement,
				segments,
				text: textRaw
			})) {
				hookParts.push(message.text);
				if (!message.blocks) {
					messages.push(...chunkSlackTextAtHardLimit(message.text).map((text) => ({ message: {
						text,
						mrkdwn: false
					} })));
					continue;
				}
				const blockPlan = createBlockMessagePlan({
					blocks: message.blocks,
					baseText: message.nativeDataFallbackBaseText ?? ""
				});
				messages.push(hasSlackNativeDataBlock(message.blocks) || blockPlan.skipOriginalBlocks ? blockPlan : { message: blockPlan.message });
			}
			hookParts.push(...reply.mediaUrls);
			const trailingText = reply.mediaUrls.filter(Boolean).join("\n");
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
	const emitDelivery = (delivery, success, error) => {
		if (!params.messageSentHookTarget) return;
		emitSlackMessageSentHooks({
			sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
			to: params.messageSentHookTarget,
			accountId: params.accountId,
			content: delivery.hookContent,
			success,
			...success ? {} : { error: formatErrorMessage(error) },
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
			emitDelivery(delivery, false, failure);
			params.onReplySettled?.({
				replyIndex: delivery.replyIndex,
				visibleReplySent: false,
				error: failure
			});
		}
		throw failure;
	};
	const initialRemaining = responseBudget.remaining();
	const initialMinimumCalls = minimumRemainingCalls[0] ?? 0;
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
			emitDelivery(delivery, false, deliveryError);
			params.onReplySettled?.({
				replyIndex: delivery.replyIndex,
				visibleReplySent,
				error: deliveryError
			});
			throw deliveryError;
		}
		emitDelivery(delivery, true);
		params.onReplySettled?.({
			replyIndex: delivery.replyIndex,
			visibleReplySent: true
		});
	}
}
export { emitSlackMessageSentHooks as a, sanitizeSlackMonitorReplyPayload as i, deliverReplies as n, deliverSlackSlashReplies as r, createSlackReplyDeliveryPlan as t };
