import { c as normalizeFeishuExternalKey, g as resolveFeishuRuntimeAccount, h as resolveFeishuAccount, s as normalizeFeishuWebhookPath } from "./doctor-contract-ItAh0keT.mjs";
import { c as resolveFeishuLegacyWebhookListener, l as gateway_config_runtime_exports, s as describeFeishuWebhookPathConflict } from "./channel-Bp5AqILl.mjs";
import { o as resolveConfiguredFeishuGroupSessionScope, t as buildFeishuConversationId, u as resolveReceiveIdType } from "./conversation-id-N6q3vKm-.mjs";
import { A as sendMessageFeishu, At as resolveFeishuGroupConversationIngressAccess, B as parseInteractiveCardContent, D as getMessageFeishu, Dt as normalizeFeishuAllowEntry, Et as hasExplicitFeishuGroupConfig, F as isFeishuBroadcastMention, G as resolveCardHeader, H as resolveFeishuSenderName, I as isMentionForwardRequest, It as resolveFeishuChatType, J as deliverCommentThreadText, K as resolveCardNote, L as normalizeMentions, M as sendFeishuMessage, N as formatFeishuMediaContent, Nt as resolveFeishuReplyPolicy, O as listFeishuThreadMessages, Ot as resolveFeishuDmIngressAccess, P as extractMentionTargets, Pt as shouldIncludeFetchedGroupContextMessage, R as isFeishuGroupChatType, Rt as createFeishuCardInteractionEnvelope, S as sendMediaFeishu, T as chunkFeishuCardMarkdown, V as parsePostContent, W as buildFeishuMediaFallbackText, a as shouldSendNoVisibleReplyFallback, at as formatFeishuApiError, b as withinCardTableLimit, ct as normalizeCommentFileType, d as consumeFeishuPresentationFallbackMarker, dt as resolveFeishuCardTemplate, gt as shouldUseFeishuCard, i as noVisibleFeishuReplyDelivery, it as extractFeishuApiErrorMeta, j as sendStructuredCardFeishu, jt as resolveFeishuGroupSenderActivationIngressAccess, k as sendCardFeishu, kt as resolveFeishuGroupConfig, mt as materializeFeishuPostMarkdownSoftBreaks, n as createFeishuReplyDeliveryResult, nt as createCommentTypingReactionLifecycle, ot as parseCommentContentElements, pt as chunkFeishuPostMarkdown, r as mergeFeishuReplyDeliveryResults, rt as encodeQuery, st as buildFeishuCommentTarget, t as createFeishuPartialReplyDeliveryError, u as buildFeishuPresentationFallback, v as renderFeishuReplyPayload, w as shouldSuppressFeishuTextForVoiceMedia, x as saveMessageResourceFeishu, y as resolveFeishuRichReply, z as normalizeFeishuEventChatType, zt as decodeFeishuCardAction } from "./reply-delivery-result-DTuuSfED.mjs";
import { t as getFeishuRuntime } from "./runtime-6V3uDMw5.mjs";
import { a as getFeishuUserAgent, f as resolveConfiguredHttpTimeoutMs, i as createFeishuWSClient, n as createEventDispatcher, r as createFeishuClient } from "./client-BAiJnY41.mjs";
import { n as waitForAbortableDelay, t as raceWithTimeoutAndAbort } from "./async-WkOXCAZ1.mjs";
import { t as createFeishuThreadBindingManager } from "./thread-bindings-6eyktxK_.mjs";
import { r as getChatInfo } from "./chat-Cu_YNdXv.mjs";
import { normalizeAgentId as normalizeAgentId$1, resolveChannelContextVisibilityMode } from "../runtime-api.js";
import { t as fetchBotIdentityForMonitor } from "./monitor-DGGr008Y.mjs";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageReplyPipeline, createReplyPrefixContext, formatChannelProgressDraftLineForEntry, resolveAgentOutboundIdentity, resolveChannelPreviewStreamMode, resolveChannelStreamingBlockEnabled, waitUntilAbort } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { collectErrorGraphCandidates, formatErrorMessage, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { asDateTimestampMs, isFutureDateTimestampMs, parseStrictNonNegativeInteger, resolveExpiresAtMsFromDurationMs, resolveExpiresAtMsFromDurationSeconds, resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { asBoolean, asNullableRecord, isRecord, normalizeNullableString, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeTrimmedStringList, readStringValue, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { stripReasoningTagsFromText } from "openclaw/plugin-sdk/text-chunking";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { fanInChannelIngressLifecycles } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { normalizeAccountId, resolveAgentRoute, resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import { getSessionEntryAsync, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { formatAgentEnvelope, formatInboundMediaUnavailableText, isChannelPartialDeliveryError, recordChannelBotPairLoopAndCheckSuppression, resolveEnvelopeFormatOptions, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { getReplyPayloadTtsSupplement, resolveSendableOutboundReplyParts, resolveTextChunksWithFallback, sendMediaWithLeadingCaption } from "openclaw/plugin-sdk/reply-payload";
import { resolvePinnedMainDmOwnerFromAllowlist, safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import * as Lark from "@larksuiteoapi/node-sdk";
import { isRecord as isRecord$1 } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { truncateWithMarker } from "openclaw/plugin-sdk/string-normalization-runtime";
import { racePromiseWithAbortSignal, raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { createStaleWhileRevalidateCache, pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { safeParseJson, sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import crypto, * as crypto$1 from "node:crypto";
import { agentControlText } from "openclaw/plugin-sdk/agent-control-runtime";
import { ensureConfiguredBindingRouteReady, resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRouteAsync } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { resolveOutboundMediaAccessForConfig } from "openclaw/plugin-sdk/outbound-media";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { createChannelReplayGuard } from "openclaw/plugin-sdk/persistent-dedupe";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { resolveChannelConfigWrites } from "openclaw/plugin-sdk/channel-config-writes";
import { formatReasoningMessage, resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { createDeferred as createDeferred$1 } from "openclaw/plugin-sdk/concurrency-runtime";
import { WEBHOOK_RATE_LIMIT_DEFAULTS, applyBasicWebhookRequestGuards, createFixedWindowRateLimiter, createWebhookAnomalyTracker, getWebhookLegacyListener, resolveRequestClientIp } from "openclaw/plugin-sdk/webhook-ingress";
import { enqueueKeyedTask } from "openclaw/plugin-sdk/keyed-async-queue";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { channelBlockedPatch, channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { sendJson } from "openclaw/plugin-sdk/http-response-runtime";
import { createWebhookInFlightLimiter, readWebhookBodyOrReject, sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { canonicalizeWebhookRouteKey, registerPluginHttpRoute, registerWebhookTarget, resolveSingleWebhookTarget } from "openclaw/plugin-sdk/webhook-targets";
import { isAbortRequestText, isBtwRequestText } from "openclaw/plugin-sdk/command-primitives-runtime";
// src/channels/mention-gating.ts
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
	};
}
// extensions/feishu/src/bot-agent-body.ts
const MAX_MENTION_CONTEXT_NAME_LENGTH = 80;
function formatMentionNameForAgentContext(name) {
	const normalized = Array.from(name, (char) => {
		return char.charCodeAt(0) < 32 || char === "[" || char === "]" ? " " : char;
	}).join("").replace(/\s+/g, " ").trim();
	const bounded = normalized.length > MAX_MENTION_CONTEXT_NAME_LENGTH ? `${truncateUtf16Safe(normalized, 77)}...` : normalized;
	return JSON.stringify(bounded || "unknown");
}
function buildFeishuAgentBody(params) {
	const { ctx, quotedContent, permissionErrorForAgent, botOpenId } = params;
	let messageBody = ctx.content;
	if (quotedContent) messageBody = `[Replying to: "${quotedContent}"]\n\n${ctx.content}`;
	messageBody = `${ctx.senderName ?? ctx.senderOpenId}: ${messageBody}`;
	if (ctx.hasAnyMention) {
		const botIdHint = botOpenId?.trim();
		messageBody += "\n\n[System: The content may include mention tags in the form <at user_id=\"...\">name</at>. Treat these as real mentions of Feishu entities (users or bots).]";
		if (botIdHint) messageBody += `\n[System: If user_id is "${botIdHint}", that mention refers to you.]`;
	}
	if (ctx.mentionTargets && ctx.mentionTargets.length > 0) {
		const targetNames = ctx.mentionTargets.map((target) => formatMentionNameForAgentContext(target.name)).join(", ");
		messageBody += `\n\n[System: Feishu users mentioned in the incoming message, for context only: ${targetNames}. Do not notify or mention these users solely because they are listed here.]`;
	}
	messageBody = `[message_id: ${ctx.messageId}]\n${messageBody}`;
	if (permissionErrorForAgent) {
		const grantUrl = permissionErrorForAgent.grantUrl ?? "";
		messageBody += `\n\n[System: The bot encountered a Feishu API permission error. Please inform the user about this issue and provide the permission grant URL for the admin to authorize. Permission grant URL: ${grantUrl}]`;
	}
	return messageBody;
}
// extensions/feishu/src/dedup-state.ts
const DEDUPE_NAMESPACE_PREFIX = "feishu.dedup";
const DEDUP_TTL_MS = 864e5;
const MEMORY_MAX_SIZE = 1e3;
const STORE_MAX_ENTRIES = 1e4;
function createFeishuDedupeGuard() {
	return createChannelReplayGuard({
		dedupe: {
			pluginId: "feishu",
			namespacePrefix: DEDUPE_NAMESPACE_PREFIX,
			ttlMs: DEDUP_TTL_MS,
			memoryMaxSize: MEMORY_MAX_SIZE,
			stateMaxEntries: STORE_MAX_ENTRIES
		},
		buildReplayKey: (messageId) => messageId
	});
}
const feishuDedupeState = {
	guard: createFeishuDedupeGuard(),
	reset() {
		this.guard = createFeishuDedupeGuard();
	}
};
// extensions/feishu/src/dedup.ts
function dedupeOptions(namespace, log) {
	return {
		...namespace ? { namespace } : {},
		...log ? { onDiskError: (error) => log(`feishu-dedup: persistent state error: ${String(error)}`) } : {}
	};
}
/**
* Claims a dedupe key for exclusive handling. Duplicate (already committed)
* and in-flight keys are reported; blank keys fail open as invalid so an
* unidentifiable event is never suppressed.
*/
async function claimUnprocessedFeishuMessage(params) {
	return await feishuDedupeState.guard.claim(params.messageId, dedupeOptions(params.namespace, params.log));
}
/**
* Claims (unless the caller already holds the claim) and commits a message.
* False means another handler owns it, it was already handled, or the key is
* blank; handlers must skip dispatch then.
*/
async function finalizeFeishuMessageProcessing(params) {
	const key = params.messageId?.trim();
	if (!key) return false;
	const options = dedupeOptions(params.namespace, params.log);
	const claim = params.processingClaim ?? await feishuDedupeState.guard.claim(key, options);
	if ("kind" in claim && claim.kind !== "claimed") return false;
	return await ("kind" in claim ? claim.handle : claim).commit();
}
/** Checks recency without claiming or recording. */
async function hasProcessedFeishuMessage(messageId, namespace = "global", log) {
	return await feishuDedupeState.guard.hasRecent(messageId, dedupeOptions(namespace, log));
}
/** Loads recent persisted entries into memory at account start; returns the loaded count. */
async function warmupDedupFromPluginState(namespace, log) {
	return await feishuDedupeState.guard.warmup(namespace, (error) => log?.(`feishu-dedup: warmup persistent state error: ${String(error)}`));
}
// extensions/feishu/src/bot-broadcast.ts
function createFeishuBroadcastIngressSettlement(params) {
	const lanes = /* @__PURE__ */ new Set();
	const failures = [];
	const fallbackAbort = new AbortController();
	let fanoutSettled = false;
	let terminal;
	let dropReason;
	let terminalSettled = false;
	let finalizing = false;
	let deferred = false;
	const settlement = createDeferred();
	params.trackTask?.(settlement.promise);
	const finishSettlement = () => {
		if (terminalSettled && ![...lanes].some((lane) => lane.adopting)) settlement.resolve();
	};
	const beginFinalizing = () => {
		if (finalizing) return;
		finalizing = true;
		params.lifecycle?.onAdoptionFinalizing();
	};
	const defer = () => {
		if (deferred) return;
		deferred = true;
		params.lifecycle?.onDeferred();
	};
	const reportReplayCommitError = (error) => {
		try {
			params.onReplayCommitError?.(error);
		} catch {}
	};
	const notifyAdopted = () => {
		try {
			params.onAdopted?.();
		} catch {}
	};
	const abandon = async (error) => {
		if (terminal) return;
		terminal = {
			kind: "abandoned",
			error
		};
		params.replayClaim?.release({ error });
		for (const lane of lanes) if (lane.status === "dropped") lane.replayClaim?.release({ error });
		try {
			await params.lifecycle?.onAbandoned();
		} finally {
			fallbackAbort.abort(error);
			terminalSettled = true;
			finishSettlement();
		}
	};
	const drop = async (reason) => {
		if (terminal) return;
		terminal = { kind: "dropped" };
		try {
			beginFinalizing();
			if (params.lifecycle?.onDropped) {
				await params.lifecycle.onDropped(reason);
				for (const lane of lanes) {
					if (lane.status !== "dropped") continue;
					try {
						await lane.replayClaim?.commit();
					} catch (error) {
						reportReplayCommitError(error);
					}
				}
				try {
					await params.replayClaim?.commit();
				} catch (error) {
					reportReplayCommitError(error);
				}
			} else {
				const error = /* @__PURE__ */ new Error(`feishu-broadcast-${reason}`);
				params.replayClaim?.release({ error });
				for (const lane of lanes) if (lane.status === "dropped") lane.replayClaim?.release({ error });
				await params.lifecycle?.onAbandoned();
			}
			if ([...lanes].some((lane) => lane.status === "completed")) notifyAdopted();
		} catch (error) {
			terminal = void 0;
			await abandon(error).catch(() => void 0);
			throw error;
		} finally {
			fallbackAbort.abort(reason);
			terminalSettled = true;
			finishSettlement();
		}
	};
	const adopt = async () => {
		if (terminal) return;
		terminal = { kind: "adopted" };
		try {
			beginFinalizing();
			await params.lifecycle?.onAdopted();
			notifyAdopted();
			try {
				await params.replayClaim?.commit();
			} catch (error) {
				reportReplayCommitError(error);
			}
		} catch (error) {
			terminal = void 0;
			await abandon(error).catch(() => void 0);
			throw error;
		} finally {
			terminalSettled = true;
			finishSettlement();
		}
	};
	const maybeSettle = async () => {
		if (!fanoutSettled || terminal) return;
		if (failures.length > 0 || [...lanes].some((lane) => lane.status === "failed")) {
			await abandon(failures.length === 1 ? failures[0] : new AggregateError(failures, "Feishu broadcast dispatch failed"));
			return;
		}
		if ([...lanes].some((lane) => lane.status !== "completed" && lane.status !== "dropped")) return;
		if (dropReason !== void 0) {
			await drop(dropReason);
			return;
		}
		await adopt();
	};
	return {
		createLane: (replayClaim) => {
			const lane = {
				replayClaim,
				status: "pending"
			};
			lanes.add(lane);
			return {
				lifecycle: {
					abortSignal: params.lifecycle?.abortSignal ?? fallbackAbort.signal,
					onAdopted: async () => {
						if (terminal || lane.adopting || lane.status === "completed" || lane.status === "dropped" || lane.status === "failed") return;
						lane.adopting = true;
						try {
							beginFinalizing();
							try {
								await lane.replayClaim?.commit();
							} catch (error) {
								reportReplayCommitError(error);
							}
							lane.status = "completed";
							await maybeSettle();
						} finally {
							lane.adopting = false;
							if (terminal) finishSettlement();
						}
					},
					onDeferred: () => {
						if (lane.status !== "pending") return;
						lane.status = "deferred";
						defer();
					},
					onDeferredHeartbeat: () => params.lifecycle?.onDeferredHeartbeat?.(),
					deferredHeartbeatIntervalMs: params.lifecycle?.deferredHeartbeatIntervalMs,
					onAdoptionFinalizing: beginFinalizing,
					onAbandoned: async () => {
						if (lane.adopting || lane.status === "completed" || lane.status === "dropped" || lane.status === "failed") return;
						lane.status = "failed";
						lane.replayClaim?.release({ error: /* @__PURE__ */ new Error("feishu-broadcast-turn-abandoned") });
						await maybeSettle();
					},
					onDropped: params.lifecycle?.onDropped ? async (reason) => {
						if (lane.adopting || lane.status === "completed" || lane.status === "dropped" || lane.status === "failed") return;
						lane.status = "dropped";
						dropReason ??= reason;
						await maybeSettle();
						if (terminal?.kind === "abandoned") {
							lane.replayClaim?.release({ error: terminal.error });
							throw terminal.error;
						}
					} : void 0
				},
				onDispatchComplete: async (dispatched) => {
					if (lane.adopting || lane.status !== "pending") return;
					const error = /* @__PURE__ */ new Error(dispatched ? "feishu broadcast dispatch returned before turn adoption" : "feishu broadcast lane was not dispatched");
					lane.status = "failed";
					failures.push(error);
					lane.replayClaim?.release({ error });
				},
				onDispatchFailed: async (error) => {
					failures.push(error);
					if (!lane.adopting && lane.status !== "completed" && lane.status !== "dropped") {
						lane.status = "failed";
						lane.replayClaim?.release({ error });
					}
					await maybeSettle();
				}
			};
		},
		onLanePending: defer,
		onDispatchComplete: async () => {
			fanoutSettled = true;
			await maybeSettle();
		},
		onDispatchFailed: async (error) => {
			failures.push(error);
			fanoutSettled = true;
			await maybeSettle();
		}
	};
}
async function claimFeishuBroadcastAgentMessage(params) {
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const claim = await claimUnprocessedFeishuMessage({
			messageId: params.messageId,
			namespace: `broadcast:${params.agentId}`,
			log: params.log
		});
		if (claim.kind === "duplicate") return;
		if (claim.kind !== "inflight") return claim;
		params.onPending();
		try {
			await claim.pending;
			return;
		} catch (err) {
			if (attempt === 1) throw err;
		}
	}
}
function resolveBroadcastAgents(cfg, peerId) {
	const agents = cfg.broadcast?.[peerId];
	return Array.isArray(agents) && agents.length > 0 ? agents : null;
}
function buildBroadcastSessionKey(baseSessionKey, originalAgentId, targetAgentId) {
	const prefix = `agent:${originalAgentId}:`;
	return baseSessionKey.startsWith(prefix) ? `agent:${targetAgentId}:${baseSessionKey.slice(prefix.length)}` : baseSessionKey;
}
// extensions/feishu/src/bot-content.ts
function resolveFeishuGroupSession(params) {
	const { chatId, senderOpenId, messageId, rootId, threadId, chatType, groupConfig, feishuCfg } = params;
	const normalizedThreadId = threadId?.trim();
	const normalizedRootId = rootId?.trim();
	const threadReply = Boolean(normalizedThreadId || normalizedRootId);
	const replyInThread = (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled" || threadReply;
	const groupSessionScope = resolveConfiguredFeishuGroupSessionScope({
		groupConfig,
		feishuCfg
	});
	const topicScope = groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender" ? (chatType === "topic_group" ? normalizedThreadId ?? normalizedRootId : void 0) ?? normalizedRootId ?? normalizedThreadId ?? (replyInThread ? messageId : null) : null;
	return {
		peerId: groupSessionScope === "group_sender" || groupSessionScope === "group_topic_sender" || topicScope ? buildFeishuConversationId({
			chatId,
			scope: groupSessionScope,
			senderOpenId,
			topicId: topicScope ?? void 0
		}) : chatId,
		parentPeer: topicScope ? {
			kind: "group",
			id: chatId
		} : null,
		groupSessionScope,
		replyInThread,
		threadReply
	};
}
function parseFeishuMessageEvent(event, botOpenId, preparedContent) {
	const mentionedBot = checkBotMentioned(event, botOpenId);
	const hasAnyMention = (event.message.mentions?.length ?? 0) > 0;
	const content = preparedContent ?? normalizeMentions(parseMessageContent(event.message.content, event.message.message_type), event.message.mentions);
	const senderOpenId = event.sender.sender_id.open_id?.trim();
	const senderUserId = event.sender.sender_id.user_id?.trim();
	const senderFallbackId = senderOpenId || senderUserId || "";
	const ctx = {
		chatId: event.message.chat_id,
		messageId: event.message.message_id,
		replyTargetMessageId: event.message.reply_target_message_id?.trim() || void 0,
		typingTargetMessageId: event.message.typing_target_message_id?.trim() || void 0,
		suppressReplyTarget: event.message.suppress_reply_target === true,
		senderId: senderUserId || senderOpenId || "",
		senderOpenId: senderFallbackId,
		senderType: event.sender.sender_type === "bot" ? "bot" : "user",
		chatType: event.message.chat_type,
		mentionedBot,
		hasAnyMention,
		rootId: event.message.root_id || void 0,
		parentId: event.message.parent_id || void 0,
		threadId: event.message.thread_id || void 0,
		content,
		contentType: event.message.message_type
	};
	const mentionForwardBotOpenId = botOpenId?.trim();
	if (mentionForwardBotOpenId && isMentionForwardRequest(event, mentionForwardBotOpenId)) {
		const mentionTargets = extractMentionTargets(event, mentionForwardBotOpenId);
		if (mentionTargets.length > 0) ctx.mentionTargets = mentionTargets;
	}
	return ctx;
}
function parseMessageContent(content, messageType) {
	if (messageType === "post") return parsePostContent(content, {
		renderMediaPlaceholders: false,
		emptyTextFallback: ""
	}).textContent;
	try {
		const parsed = JSON.parse(content);
		if (messageType === "text") return parsed.text || "";
		if (FEISHU_MEDIA_MESSAGE_TYPES.has(messageType)) return formatFeishuMediaContent(parsed, messageType);
		if (messageType === "share_chat") {
			if (parsed && typeof parsed === "object") {
				const share = parsed;
				const text = normalizeOptionalString(share.body) ?? normalizeOptionalString(share.summary);
				if (text) return text;
				const sharedChatId = normalizeOptionalString(share.share_chat_id);
				if (sharedChatId) return `[Forwarded message: ${sharedChatId}]`;
			}
			return "[Forwarded message]";
		}
		if (messageType === "merge_forward") return "[Merged and Forwarded Message - loading...]";
		if (messageType === "interactive") return parseInteractiveCardContent(parsed);
		return content;
	} catch {
		return FEISHU_MEDIA_MESSAGE_TYPES.has(messageType) ? "" : content;
	}
}
const FEISHU_MEDIA_MESSAGE_TYPES = /* @__PURE__ */ new Set([
	"image",
	"file",
	"audio",
	"video",
	"media",
	"sticker"
]);
function checkBotMentioned(event, botOpenId) {
	if (!botOpenId) return false;
	const mentions = event.message.mentions ?? [];
	if (mentions.length > 0) return mentions.some((mention) => !isFeishuBroadcastMention(mention) && mention.id.open_id === botOpenId);
	if (event.message.message_type === "post") return parsePostContent(event.message.content).mentionedOpenIds.some((id) => id.trim().toLowerCase() !== "all" && id === botOpenId);
	return false;
}
function normalizeFeishuCommandProbeBody(text) {
	const body = text.replace(/<at\b[^>]*>[^<]*<\/at>/giu, " ").trim();
	return body.startsWith("/") && /[\r\n]/.test(body) ? body : body.replace(/\s+/g, " ");
}
function parseMediaResource(content, messageType) {
	try {
		const parsed = JSON.parse(content);
		const imageKey = normalizeFeishuExternalKey(parsed.image_key);
		const fileKey = normalizeFeishuExternalKey(parsed.file_key);
		return {
			key: messageType === "image" ? imageKey : messageType === "video" || messageType === "media" ? fileKey || imageKey : fileKey,
			fileName: parsed.file_name
		};
	} catch {
		return {};
	}
}
function resolveFeishuMediaKind(messageType) {
	switch (messageType) {
		case "image": return "image";
		case "file": return "document";
		case "audio": return "audio";
		case "video":
		case "media": return "video";
		default: return "document";
	}
}
async function resolveFeishuMediaList(params) {
	const { cfg, messageId, messageType, content, maxBytes, log, accountId } = params;
	if (![
		"image",
		"file",
		"audio",
		"video",
		"media",
		"post"
	].includes(messageType)) return [];
	const resources = [];
	if (messageType === "post") {
		const { attachments } = parsePostContent(content);
		if (attachments.length === 0) return [];
		log?.(`feishu: post message contains ${attachments.length} embedded attachment(s)`);
		const seenAttachments = /* @__PURE__ */ new Set();
		for (const attachment of attachments) {
			const identity = `${attachment.kind}:${attachment.key}`;
			if (seenAttachments.has(identity)) continue;
			seenAttachments.add(identity);
			resources.push({
				key: attachment.key,
				type: attachment.kind,
				fileName: attachment.kind === "file" ? attachment.fileName : void 0,
				kind: attachment.kind === "image" ? "image" : attachment.origin === "top-level" ? "document" : "video",
				label: `embedded ${attachment.kind} ${attachment.key}`
			});
		}
	} else {
		const resource = parseMediaResource(content, messageType);
		if (!resource.key) return [{ kind: resolveFeishuMediaKind(messageType) }];
		resources.push({
			key: resource.key,
			type: messageType === "image" ? "image" : "file",
			fileName: resource.fileName,
			kind: resolveFeishuMediaKind(messageType),
			label: `${messageType} media`
		});
	}
	const out = [];
	for (const resource of resources) try {
		const saved = await saveMessageResourceFeishu({
			cfg,
			messageId,
			fileKey: resource.key,
			type: resource.type,
			accountId,
			maxBytes,
			originalFilename: resource.fileName
		});
		out.push({
			path: saved.path,
			contentType: saved.contentType,
			kind: resource.kind
		});
		log?.(`feishu: downloaded ${resource.label}, saved to ${saved.path}`);
	} catch (err) {
		out.push({ kind: resource.kind });
		log?.(`feishu: failed to download ${resource.label}: ${String(err)}`);
	}
	return out;
}
// extensions/feishu/src/bot-group-name-state.ts
const feishuGroupNameCache = createStaleWhileRevalidateCache({
	maxEntries: 500,
	maxPending: Infinity,
	ttlMs: 18e5
});
// extensions/feishu/src/bot-group-name.ts
async function resolveGroupName(params) {
	const { account, chatId, log } = params;
	if (!account.configured) return;
	const { value } = await feishuGroupNameCache.read(`${account.accountId}:${chatId}`, async () => {
		try {
			return (await getChatInfo(createFeishuClient(account), chatId)).name?.trim() || void 0;
		} catch (err) {
			log(`feishu[${account.accountId}]: getChatInfo failed for ${chatId}: ${String(err)}`);
			return;
		}
	}, { allowStale: false });
	return value;
}
// extensions/feishu/src/bot-name.ts
const POSITIVE_TTL_MS = 6e5;
const NEGATIVE_TTL_MS = 6e4;
const MAX_CACHE_ENTRIES = 5e3;
const LOOKUP_BACKOFF_MS = 6e4;
const REQUEST_TIMEOUT_MS = 1500;
const cache = /* @__PURE__ */ new Map();
const backoffUntilByAccount = /* @__PURE__ */ new Map();
const inflight = /* @__PURE__ */ new Map();
function readCache(key) {
	const entry = cache.get(key);
	if (!entry) return;
	if (entry.expiresAt <= performance.now()) {
		cache.delete(key);
		return;
	}
	cache.delete(key);
	cache.set(key, entry);
	return entry;
}
function writeCache(key, entry) {
	cache.delete(key);
	cache.set(key, entry);
	pruneMapToMaxSize(cache, MAX_CACHE_ENTRIES);
}
async function resolveFeishuBotName(params) {
	const openId = params.openId.trim();
	if (!params.account.configured || !openId) return;
	const backoffUntil = backoffUntilByAccount.get(params.account.accountId);
	if (backoffUntil !== void 0) {
		if (backoffUntil > performance.now()) return;
		backoffUntilByAccount.delete(params.account.accountId);
	}
	const key = `${params.account.accountId}::${openId}`;
	const cached = readCache(key);
	if (cached) return cached.name;
	const pending = inflight.get(key);
	if (pending) return pending;
	const { account, log } = params;
	const lookup = (async () => {
		const query = new URLSearchParams({ bot_ids: openId });
		let result = null;
		try {
			const response = await createFeishuClient(account).request({
				method: "GET",
				url: `/open-apis/bot/v3/bots/basic_batch?${query.toString()}`,
				timeout: REQUEST_TIMEOUT_MS
			});
			const code = response.code ?? 0;
			if (code === 0) result = response;
			else if (code === 99991672) log(`feishu[${account.accountId}]: bot.basic_info scope not granted`);
			else log(`feishu[${account.accountId}]: bot name lookup failed (code=${code})`);
		} catch (error) {
			if (extractFeishuApiErrorMeta(error).feishuCode === 99991672) log(`feishu[${account.accountId}]: bot.basic_info scope not granted`);
			else log(`feishu[${account.accountId}]: bot name lookup failed: ${String(error)}`);
		}
		if (!result) {
			backoffUntilByAccount.set(account.accountId, performance.now() + LOOKUP_BACKOFF_MS);
			return;
		}
		const name = result.data?.bots?.[openId]?.name?.trim();
		writeCache(key, {
			...name ? { name } : {},
			expiresAt: performance.now() + (name ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS)
		});
		return name;
	})();
	inflight.set(key, lookup);
	try {
		return await lookup;
	} finally {
		inflight.delete(key);
	}
}
// extensions/feishu/src/bot-thread-mentions.ts
async function prepareFeishuThreadRoot(params) {
	let { cfg, account } = params;
	const { ctx, botOpenId, log } = params;
	const localBotOpenId = botOpenId?.trim();
	let rootMessagePromise;
	const getRootMessageInfo = () => {
		if (!ctx.rootId) return Promise.resolve(null);
		rootMessagePromise ??= getMessageFeishu({
			cfg,
			messageId: ctx.rootId,
			accountId: account.accountId
		}).catch((err) => {
			log(`feishu[${account.accountId}]: failed to fetch root message: ${String(err)}`);
			return null;
		});
		return rootMessagePromise;
	};
	let isBotOwnedThread = false;
	const configuredBotThreadMention = resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: ctx.chatId
	})?.requireMentionInBotThreads ?? account.config.requireMentionInBotThreads;
	if (isFeishuGroupChatType(ctx.chatType) && configuredBotThreadMention !== void 0 && ctx.rootId && (ctx.threadId?.trim() || ctx.chatType === "topic_group")) {
		const rootMessage = await getRootMessageInfo();
		const currentCfg = getFeishuRuntime().config.current();
		const currentAccount = resolveFeishuRuntimeAccount({
			cfg: currentCfg,
			accountId: account.accountId
		});
		if (!currentAccount.enabled || currentAccount.appId !== account.appId || currentAccount.domain !== account.domain || ctx.senderType === "bot" && currentAccount.config.allowBots !== true) {
			log(`feishu[${account.accountId}]: account changed while resolving thread ownership`);
			return null;
		}
		cfg = currentCfg;
		account = currentAccount;
		isBotOwnedThread = Boolean(rootMessage?.messageId === ctx.rootId && rootMessage.chatId === ctx.chatId && rootMessage.senderType === "app" && (account.appId && rootMessage.senderId === account.appId || localBotOpenId && rootMessage.senderOpenId === localBotOpenId));
	}
	return {
		cfg,
		account,
		isBotOwnedThread,
		getRootMessageInfo
	};
}
// extensions/feishu/src/dedupe-key.ts
function resolvePostMediaParts(content) {
	const { attachments } = parsePostContent(content, { includeTopLevelFiles: false });
	return ["image", "file"].flatMap((kind) => attachments.filter((attachment) => attachment.kind === kind).map((attachment) => `${kind}_key:${attachment.key}`));
}
function resolveMessageMediaParts(messageType, content) {
	if (messageType === "post") return resolvePostMediaParts(content);
	const parsed = asNullableRecord(safeParseJson(content));
	if (!parsed) return [];
	const imageKey = normalizeFeishuExternalKey(parsed.image_key);
	const fileKey = normalizeFeishuExternalKey(parsed.file_key);
	switch (messageType) {
		case "image": return imageKey ? [`image_key:${imageKey}`] : [];
		case "file":
		case "audio":
		case "sticker": return fileKey ? [`file_key:${fileKey}`] : [];
		default: return fileKey ? [`file_key:${fileKey}`] : imageKey ? [`image_key:${imageKey}`] : [];
	}
}
function resolveSenderIdentity(event) {
	const senderId = event.sender?.sender_id;
	return senderId?.open_id?.trim() || senderId?.union_id?.trim() || senderId?.user_id?.trim() || void 0;
}
function resolveTextRetryDedupeKey(event) {
	const createTime = event.message.create_time?.trim();
	const chatId = event.message.chat_id?.trim();
	const senderId = resolveSenderIdentity(event);
	if (!createTime || parseStrictNonNegativeInteger(createTime) === void 0 || !chatId || !senderId) return;
	const contentHash = sha256Hex(event.message.content).slice(0, 32);
	return JSON.stringify([
		"text-retry",
		senderId,
		chatId,
		createTime,
		contentHash
	]);
}
function resolveFeishuMessageDedupeKey(event) {
	const messageId = event.message.message_id?.trim();
	if (!messageId) return;
	const messageType = event.message.message_type.trim();
	const mediaParts = resolveMessageMediaParts(messageType, event.message.content);
	if (mediaParts.length > 0) return JSON.stringify([messageId, ...mediaParts]);
	if (messageType === "text") return resolveTextRetryDedupeKey(event) ?? messageId;
	if (messageType === "post") {
		const retryKey = resolveTextRetryDedupeKey(event);
		if (!retryKey) return messageId;
		const topicId = event.message.root_id?.trim() || event.message.thread_id?.trim();
		return topicId ? JSON.stringify([retryKey, topicId]) : retryKey;
	}
	return messageId;
}
// extensions/feishu/src/dynamic-agent.ts
var DynamicAgentMutationSkipped = class extends Error {
	constructor(cfg) {
		super("dynamic agent mutation skipped");
		this.cfg = cfg;
	}
};
function hasDefaultDirectRoute(cfg, accountId, senderOpenId) {
	return resolveAgentRoute({
		cfg,
		channel: "feishu",
		accountId,
		peer: {
			kind: "direct",
			id: senderOpenId
		}
	}).matchedBy === "default";
}
function resolveDynamicAgentConfig(cfg, accountId) {
	return resolveFeishuAccount({
		cfg,
		accountId
	}).config.dynamicAgentCreation;
}
function isAtDynamicAgentLimit(cfg, dynamicCfg) {
	if (dynamicCfg.maxAgents === void 0) return false;
	return Object.keys(cfg.agents?.entries ?? {}).filter((id) => id.startsWith("feishu-")).length >= dynamicCfg.maxAgents;
}
function resolveDynamicAgentId(accountId, senderOpenId) {
	if (accountId === "default") return `feishu-${senderOpenId}`;
	const identityDigest = sha256Hex(`${accountId}\0${senderOpenId}`).slice(0, 32);
	return `feishu-${accountId.slice(0, 12)}-${identityDigest}`;
}
/**
* Refresh an existing DM binding or create its dynamic agent when current
* account policy permits config writes.
*/
async function maybeCreateDynamicAgent(params) {
	const { cfg, runtime, senderOpenId, canCreateForConfig, log } = params;
	const accountId = normalizeAccountId(params.accountId);
	if (!hasDefaultDirectRoute(cfg, accountId, senderOpenId)) return {
		created: false,
		updatedCfg: cfg
	};
	const currentCfg = runtime.config.current();
	if (!hasDefaultDirectRoute(currentCfg, accountId, senderOpenId)) return {
		created: false,
		updatedCfg: currentCfg
	};
	const currentDynamicCfg = resolveDynamicAgentConfig(currentCfg, accountId);
	if (!currentDynamicCfg?.enabled) return {
		created: false,
		updatedCfg: currentCfg
	};
	if (!resolveChannelConfigWrites({
		cfg: currentCfg,
		channelId: "feishu",
		accountId
	})) {
		log(`feishu: config writes disabled, not creating agent for ${senderOpenId}`);
		return {
			created: false,
			updatedCfg: currentCfg
		};
	}
	const agentId = resolveDynamicAgentId(accountId, senderOpenId);
	if (!Object.hasOwn(currentCfg.agents?.entries ?? {}, agentId) && isAtDynamicAgentLimit(currentCfg, currentDynamicCfg)) {
		log(`feishu: maxAgents limit (${currentDynamicCfg.maxAgents}) reached, not creating agent for ${senderOpenId}`);
		return {
			created: false,
			updatedCfg: currentCfg
		};
	}
	if (!await canCreateForConfig(currentCfg)) return {
		created: false,
		updatedCfg: currentCfg
	};
	let skippedCfg;
	const committed = await runtime.config.mutateConfigFile({
		base: "runtime",
		afterWrite: { mode: "auto" },
		mutate: async (draft) => {
			if (!hasDefaultDirectRoute(draft, accountId, senderOpenId)) throw new DynamicAgentMutationSkipped(draft);
			const dynamicCfg = resolveDynamicAgentConfig(draft, accountId);
			if (!dynamicCfg?.enabled || !resolveChannelConfigWrites({
				cfg: draft,
				channelId: "feishu",
				accountId
			})) throw new DynamicAgentMutationSkipped(draft);
			const agentExists = Object.hasOwn(draft.agents?.entries ?? {}, agentId);
			if (!agentExists && isAtDynamicAgentLimit(draft, dynamicCfg)) {
				log(`feishu: maxAgents limit (${dynamicCfg.maxAgents}) reached, not creating agent for ${senderOpenId}`);
				throw new DynamicAgentMutationSkipped(draft);
			}
			if (!await canCreateForConfig(draft)) throw new DynamicAgentMutationSkipped(draft);
			if (!agentExists) {
				const workspaceTemplate = dynamicCfg.workspaceTemplate ?? "~/.openclaw/workspace-{agentId}";
				const agentDirTemplate = dynamicCfg.agentDirTemplate ?? "~/.openclaw/agents/{agentId}/agent";
				const workspace = resolveUserPath(workspaceTemplate.replace("{userId}", senderOpenId).replace("{agentId}", agentId));
				const agentDir = resolveUserPath(agentDirTemplate.replace("{userId}", senderOpenId).replace("{agentId}", agentId));
				log(`feishu: creating dynamic agent "${agentId}" for user ${senderOpenId}`);
				log(`  workspace: ${workspace}`);
				log(`  agentDir: ${agentDir}`);
				await fs.promises.mkdir(workspace, { recursive: true });
				await fs.promises.mkdir(agentDir, { recursive: true });
				draft.agents = {
					...draft.agents,
					entries: {
						...draft.agents?.entries,
						[agentId]: {
							workspace,
							agentDir
						}
					}
				};
			} else log(`feishu: agent "${agentId}" exists, adding missing binding for ${senderOpenId}`);
			draft.bindings = [...draft.bindings ?? [], {
				agentId,
				match: {
					channel: "feishu",
					accountId,
					peer: {
						kind: "direct",
						id: senderOpenId
					}
				}
			}];
			return { created: true };
		}
	}).catch((error) => {
		if (error instanceof DynamicAgentMutationSkipped) {
			skippedCfg = error.cfg;
			return null;
		}
		throw error;
	});
	if (!committed) return {
		created: false,
		updatedCfg: skippedCfg ?? currentCfg
	};
	return {
		created: committed.result?.created ?? false,
		updatedCfg: runtime.config.current()
	};
}
function resolveUserPath(p) {
	if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
	return p;
}
// extensions/feishu/src/reasoning-preview.ts
async function resolveFeishuReasoningPreviewEnabled(params) {
	const configDefault = resolveAgentConfig(params.cfg, params.agentId)?.reasoningDefault ?? params.cfg.agents?.defaults?.reasoningDefault ?? "off";
	try {
		const level = (await getSessionEntryAsync({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			readConsistency: "latest"
		}))?.reasoningLevel;
		if (level === "on" || level === "stream" || level === "off") return level === "stream";
	} catch {
		return false;
	}
	return configDefault === "stream";
}
// extensions/feishu/src/reply-dispatcher-state.ts
const streamingStartBackoffUntilByAccount = /* @__PURE__ */ new Map();
// extensions/feishu/src/streaming-card.ts
const STREAMING_UPDATE_THROTTLE_MS = 160;
const STREAMING_SIGNIFICANT_DELTA_CHARS = 18;
const FEISHU_STREAMING_TOKEN_DEFAULT_LIFETIME_SECONDS = 7200;
const STREAMING_CLOSED_ERROR = /\(code=(200850|300309)\)$/;
const tokenCache = /* @__PURE__ */ new Map();
function resolveStreamingTokenExpiresAt(value, nowMs = Date.now()) {
	if (typeof value === "number" && Number.isFinite(value) && value <= 0) return nowMs;
	return resolveExpiresAtMsFromDurationSeconds(value, { nowMs }) ?? nowMs + FEISHU_STREAMING_TOKEN_DEFAULT_LIFETIME_SECONDS * 1e3;
}
function resolveApiBase(domain) {
	if (domain === "lark") return "https://open.larksuite.com/open-apis";
	if (domain && domain !== "feishu" && domain.startsWith("http")) return `${domain.replace(/\/+$/, "")}/open-apis`;
	return "https://open.feishu.cn/open-apis";
}
function resolveAllowedHostnames(domain) {
	if (domain === "lark") return ["open.larksuite.com"];
	if (domain && domain !== "feishu" && domain.startsWith("http")) try {
		return [new URL(domain).hostname];
	} catch {
		return [];
	}
	return ["open.feishu.cn"];
}
function cancelUnreadResponseBody(response) {
	if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
}
async function assertSuccessfulCardKitResponse(response, auditContext, action) {
	if (!response.ok && response.status !== 400) {
		cancelUnreadResponseBody(response);
		throw new Error(`${action} failed with HTTP ${response.status}`);
	}
	const data = await readProviderJsonResponse(response, auditContext);
	if (data.code !== 0) throw new Error(`${action} failed: ${data.msg ?? "unknown error"} (code=${String(data.code)})`);
}
async function getToken(creds) {
	const key = `${creds.domain ?? "feishu"}|${creds.appId}`;
	const cached = tokenCache.get(key);
	const now = Date.now();
	if (cached && cached.expiresAt > now + 6e4) return cached.token;
	const { response, release } = await fetchWithSsrFGuard({
		url: `${resolveApiBase(creds.domain)}/auth/v3/tenant_access_token/internal`,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": getFeishuUserAgent()
			},
			body: JSON.stringify({
				app_id: creds.appId,
				app_secret: creds.appSecret
			})
		},
		policy: { allowedHostnames: resolveAllowedHostnames(creds.domain) },
		auditContext: "feishu.streaming-card.token",
		timeoutMs: creds.httpTimeoutMs ?? 3e4
	});
	let data;
	try {
		if (!response.ok) {
			cancelUnreadResponseBody(response);
			throw new Error(`Token request failed with HTTP ${response.status}`);
		}
		data = await readProviderJsonResponse(response, "feishu.streaming-card.token");
	} finally {
		await release();
	}
	if (data.code !== 0 || !data.tenant_access_token) throw new Error(`Token error: ${data.msg}`);
	tokenCache.set(key, {
		token: data.tenant_access_token,
		expiresAt: resolveStreamingTokenExpiresAt(data.expire, now)
	});
	return data.tenant_access_token;
}
function truncateSummary(text, max = 50) {
	const clean = text.replace(/\n/g, " ").trim();
	return clean.length <= max ? clean : sliceUtf16Safe(clean, 0, max - 3) + "...";
}
function shouldPushStreamingUpdate(previousText, nextText) {
	return !previousText || /[\n。！？!?；;：:]$/.test(nextText) || nextText.length - previousText.length >= STREAMING_SIGNIFICANT_DELTA_CHARS;
}
var FeishuStreamingSession = class {
	constructor(client, creds, log) {
		this.state = null;
		this.queue = Promise.resolve();
		this.closed = false;
		this.lastUpdateTime = 0;
		this.pendingText = null;
		this.flushTimer = null;
		this.updateThrottleMs = STREAMING_UPDATE_THROTTLE_MS;
		this.client = client;
		this.creds = creds;
		this.log = log;
	}
	async requestCardKit(path, operation, method, body, readResponse, token) {
		const auditContext = `feishu.streaming-card.${operation}`;
		const { response, release } = await fetchWithSsrFGuard({
			url: `${resolveApiBase(this.creds.domain)}/cardkit/v1/cards${path}`,
			init: {
				method,
				headers: {
					Authorization: `Bearer ${token ?? await getToken(this.creds)}`,
					"Content-Type": method === "PATCH" ? "application/json; charset=utf-8" : "application/json",
					"User-Agent": getFeishuUserAgent()
				},
				body: JSON.stringify(body())
			},
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext,
			timeoutMs: this.creds.httpTimeoutMs ?? 3e4
		});
		try {
			return await readResponse(response, auditContext);
		} finally {
			await release();
		}
	}
	async start(receiveId, receiveIdType = "chat_id", options) {
		if (this.state) return;
		const elements = [{
			tag: "markdown",
			content: "",
			element_id: "content"
		}];
		if (options?.note) {
			elements.push({ tag: "hr" });
			elements.push({
				tag: "markdown",
				content: `<font color='grey'>${options.note}</font>`,
				element_id: "note"
			});
		}
		const cardJson = {
			schema: "2.0",
			config: {
				streaming_mode: true,
				summary: { content: "[Generating...]" },
				streaming_config: {
					print_frequency_ms: { default: 50 },
					print_step: { default: 1 }
				}
			},
			body: { elements }
		};
		if (options?.header) cardJson.header = {
			title: {
				tag: "plain_text",
				content: options.header.title
			},
			template: resolveFeishuCardTemplate(options.header.template) ?? "blue"
		};
		const createData = await this.requestCardKit("", "create", "POST", () => ({
			type: "card_json",
			data: JSON.stringify(cardJson)
		}), async (response, auditContext) => {
			if (!response.ok) {
				cancelUnreadResponseBody(response);
				throw new Error(`Create card request failed with HTTP ${response.status}`);
			}
			return await readProviderJsonResponse(response, auditContext);
		});
		if (createData.code !== 0 || !createData.data?.card_id) throw new Error(`Create card failed: ${createData.msg}`);
		const cardId = createData.data.card_id;
		const cardContent = JSON.stringify({
			type: "card",
			data: { card_id: cardId }
		});
		const sendRes = await sendFeishuMessage({
			client: this.client,
			receiveId,
			receiveIdType
		}, {
			...options,
			content: cardContent,
			msgType: "interactive"
		}, "Send card failed");
		if (sendRes.code !== 0) throw new Error(`Send card failed: ${sendRes.msg}`);
		const messageId = sendRes.data?.message_id?.trim();
		this.state = {
			cardId,
			...messageId ? { messageId } : {},
			sequence: 1,
			currentText: "",
			sentText: "",
			hasNote: Boolean(options?.note)
		};
		this.log?.(`Started streaming: cardId=${cardId}${messageId ? `, messageId=${messageId}` : ""}`);
	}
	async putElement(element, operation, action, body, token) {
		const state = this.state;
		const put = () => {
			state.sequence += 1;
			return this.requestCardKit(`/${state.cardId}/elements/${element}`, operation, "PUT", () => body(state.sequence), (response, auditContext) => assertSuccessfulCardKitResponse(response, auditContext, action), token);
		};
		try {
			await put();
		} catch (error) {
			if (!STREAMING_CLOSED_ERROR.test(String(error))) throw error;
			for (const streaming_mode of [false, true]) await this.updateSettings({ streaming_mode }, "reopen", "Reopen streaming card");
			await put();
		}
	}
	async updateSettings(config, operation, action) {
		const state = this.state;
		state.sequence += 1;
		await this.requestCardKit(`/${state.cardId}/settings`, operation, "PATCH", () => ({
			settings: JSON.stringify({ config }),
			sequence: state.sequence,
			uuid: `c_${state.cardId}_${state.sequence}`
		}), (response, auditContext) => assertSuccessfulCardKitResponse(response, auditContext, action));
	}
	async writeCardContent(text, replace, onError) {
		if (!this.state) return false;
		try {
			await this.putElement(replace ? "content" : "content/content", replace ? "replace" : "update", replace ? "Replace card content" : "Update card content", (sequence) => ({
				...replace ? { element: JSON.stringify({
					tag: "markdown",
					content: text,
					element_id: "content"
				}) } : { content: text },
				sequence,
				uuid: `${replace ? "r" : "s"}_${this.state.cardId}_${sequence}`
			}));
			return true;
		} catch (error) {
			onError?.(error);
			return false;
		}
	}
	clearFlushTimer() {
		if (this.flushTimer) {
			clearTimeout(this.flushTimer);
			this.flushTimer = null;
		}
	}
	schedulePendingFlush() {
		if (this.flushTimer || !this.pendingText || this.closed) return;
		const delayMs = Math.max(0, this.updateThrottleMs - (Date.now() - this.lastUpdateTime));
		this.flushTimer = setTimeout(() => {
			this.flushTimer = null;
			if (!this.pendingText || this.closed) return;
			this.lastUpdateTime = Date.now();
			this.flushPendingUpdate().catch((error) => this.log?.(`Scheduled flush update failed: ${String(error)}`));
		}, delayMs);
	}
	async flushPendingUpdate() {
		this.queue = this.queue.then(async () => {
			if (!this.state || this.closed) return;
			const nextText = this.pendingText;
			if (!nextText) return;
			this.pendingText = null;
			if (nextText === this.state.sentText) return;
			if (await this.writeCardContent(nextText, false, (e) => this.log?.(`Update failed: ${String(e)}`)) && this.state) this.state.sentText = nextText;
		});
		await this.queue;
	}
	async update(text) {
		if (!this.state || this.closed || !text) return;
		this.state.currentText = text;
		this.pendingText = text;
		this.clearFlushTimer();
		const shouldForceUpdate = shouldPushStreamingUpdate(this.state.sentText, text);
		const now = Date.now();
		if (!shouldForceUpdate && now - this.lastUpdateTime < this.updateThrottleMs) {
			this.schedulePendingFlush();
			return;
		}
		this.lastUpdateTime = now;
		await this.flushPendingUpdate();
	}
	async updateNoteContent(note) {
		if (!this.state || !this.state.hasNote) return;
		const token = await getToken(this.creds);
		await this.putElement("note/content", "note-update", "Update card note", (sequence) => ({
			content: `<font color='grey'>${note}</font>`,
			sequence,
			uuid: `n_${this.state.cardId}_${sequence}`
		}), token).catch((e) => this.log?.(`Note update failed: ${String(e)}`));
	}
	async closeWithResult(finalText, options) {
		if (!this.state || this.closed) return { visibleReplySent: false };
		this.closed = true;
		this.clearFlushTimer();
		await this.queue;
		const text = finalText ?? this.pendingText ?? this.state.currentText;
		let visibleContentSent = Boolean(this.state.sentText.trim());
		let finalWriteError;
		if ((text || finalText !== void 0) && text !== this.state.sentText) {
			const replace = !text.startsWith(this.state.sentText);
			const sent = await this.writeCardContent(text, replace, (e) => {
				finalWriteError = e;
				this.log?.(`Final ${replace ? "replace" : "update"} failed: ${String(e)}`);
			});
			this.state.currentText = text;
			if (sent) {
				this.state.sentText = text;
				visibleContentSent = Boolean(text.trim());
			}
		}
		if (options?.note) await this.updateNoteContent(options.note);
		const acceptedText = this.state.sentText;
		let closeError;
		try {
			await this.updateSettings({
				streaming_mode: false,
				summary: { content: truncateSummary(acceptedText) }
			}, "close", "Close streaming card");
		} catch (error) {
			closeError = error;
			this.log?.(`Close failed: ${String(error)}`);
		}
		const finalState = this.state;
		this.state = null;
		this.pendingText = null;
		this.log?.(`Closed streaming: cardId=${finalState.cardId}`);
		const result = {
			...createFeishuReplyDeliveryResult({
				results: [finalState],
				visibleReplySent: visibleContentSent,
				...visibleContentSent ? { content: finalState.sentText } : {},
				kind: "card"
			}),
			...finalWriteError === void 0 ? {} : { finalTextAccepted: false }
		};
		if (finalWriteError !== void 0 || closeError !== void 0) {
			const cause = finalWriteError !== void 0 && closeError !== void 0 ? new AggregateError([finalWriteError, closeError], "Feishu streaming card finalization failed") : finalWriteError ?? closeError;
			throw createFeishuPartialReplyDeliveryError(cause, result);
		}
		return result;
	}
	async discard() {
		if (!this.state || this.closed) return { visibleReplySent: false };
		const { cardId, messageId } = this.state;
		if (!messageId) return this.closeWithResult("");
		this.closed = true;
		this.clearFlushTimer();
		await this.queue;
		try {
			const response = await this.client.im.message.delete({ path: { message_id: messageId } });
			if (response.code !== void 0 && response.code !== 0) throw new Error(`Delete streaming card message failed: ${response.msg ?? response.code}`);
			this.state = null;
			this.pendingText = null;
			this.log?.(`Discarded streaming card: cardId=${cardId}`);
			return { visibleReplySent: false };
		} catch (error) {
			this.log?.(`Discard failed: ${String(error)}`);
			this.closed = false;
			return this.closeWithResult("");
		}
	}
	isActive() {
		return this.state !== null && !this.closed;
	}
};
// extensions/feishu/src/streaming-update.ts
/** Admit captured snapshots in order while the session owns provider writes. */
function queueFeishuStreamingUpdate(params) {
	const { queue, session, startPromise, text, accountId, runtime } = params;
	return queue.then(async () => {
		if (startPromise) await startPromise;
		if (session?.isActive()) session.update(text).catch((error) => runtime.error(`feishu[${accountId}] streaming update failed: ${String(error)}`));
	});
}
// extensions/feishu/src/typing-backoff.ts
/** Feishu API codes that should trip the typing circuit breaker. */
const FEISHU_BACKOFF_CODES = /* @__PURE__ */ new Set([
	99991400,
	99991403,
	429
]);
var FeishuBackoffError = class extends Error {
	constructor(code) {
		super(`Feishu API backoff: code ${code}`);
		this.name = "FeishuBackoffError";
		this.code = code;
	}
};
function isFeishuBackoffError(err) {
	if (typeof err !== "object" || err === null) return false;
	const response = err.response;
	if (response) {
		if (response.status === 429) return true;
		if (getBackoffCodeFromResponse(response.data) !== void 0) return true;
	}
	return getBackoffCodeFromResponse(err) !== void 0;
}
function getBackoffCodeFromResponse(response) {
	if (typeof response !== "object" || response === null) return;
	const code = response.code;
	return typeof code === "number" && FEISHU_BACKOFF_CODES.has(code) ? code : void 0;
}
// extensions/feishu/src/typing.ts
const TYPING_EMOJI = "Typing";
async function requestTypingReaction(request, operation, readResponse, runtime) {
	const indicator = `typing indicator${operation === "remove" ? " removal" : ""}`;
	try {
		const response = await request();
		const backoffCode = getBackoffCodeFromResponse(response);
		if (backoffCode !== void 0) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log(`[feishu] ${indicator} response contains backoff code ${backoffCode}, stopping keepalive`);
			throw new FeishuBackoffError(backoffCode);
		}
		return readResponse(response);
	} catch (err) {
		if (isFeishuBackoffError(err)) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log(`[feishu] ${indicator} hit rate-limit/quota, stopping keepalive`);
			throw err;
		}
		if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log(`[feishu] failed to ${operation} typing indicator: ${String(err)}`);
		return;
	}
}
/**
* Add a typing indicator (reaction) to a message.
*
* Rate-limit and quota errors are re-thrown so the circuit breaker in
* `createTypingCallbacks` (typing-start-guard) can trip and stop the
* keepalive loop. See #28062.
*
* Also checks for backoff codes in non-throwing SDK responses (#28157).
*/
async function addTypingIndicator(params) {
	const { cfg, messageId, accountId, runtime } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) return {
		messageId,
		reactionId: null
	};
	const client = createFeishuClient(account);
	return {
		messageId,
		reactionId: await requestTypingReaction(() => client.im.messageReaction.create({
			path: { message_id: messageId },
			data: { reaction_type: { emoji_type: TYPING_EMOJI } }
		}), "add", (response) => response.data?.reaction_id ?? null, runtime) ?? null
	};
}
/**
* Remove a typing indicator (reaction) from a message.
*
* Rate-limit and quota errors are re-thrown for the same reason as above.
*/
async function removeTypingIndicator(params) {
	const { cfg, state, accountId, runtime } = params;
	if (!state.reactionId) return;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) return;
	const client = createFeishuClient(account);
	await requestTypingReaction(() => client.im.messageReaction.delete({ path: {
		message_id: state.messageId,
		reaction_id: state.reactionId
	} }), "remove", () => void 0, runtime);
}
// extensions/feishu/src/reply-dispatcher.ts
function mergeStreamingFinalText(previousText, nextText, appendError) {
	if (!appendError || !previousText || nextText.startsWith(previousText)) return nextText;
	if (previousText.endsWith(`\n\n${nextText}`)) return previousText;
	return `${previousText}\n\n${nextText}`;
}
/** Maximum age (ms) for a message to receive a typing indicator reaction.
* Messages older than this are likely replays after context compaction (#30418). */
const TYPING_INDICATOR_MAX_AGE_MS = 12e4;
const MS_EPOCH_MIN = 0xe8d4a51000;
const STREAMING_START_FAILURE_BACKOFF_MS = 6e4;
const NO_VISIBLE_REPLY_FALLBACK_TEXT = "⚠️ This reply completed without visible content. The turn may have been interrupted; please retry or ask me to recover from recent context.";
function isStreamingStartBackedOff(accountId) {
	const backoffUntil = streamingStartBackoffUntilByAccount.get(accountId);
	if (backoffUntil === void 0) return false;
	if (backoffUntil <= performance.now()) {
		streamingStartBackoffUntilByAccount.delete(accountId);
		return false;
	}
	return true;
}
function normalizeEpochMs(timestamp) {
	if (!Number.isFinite(timestamp) || timestamp === void 0 || timestamp <= 0) return;
	return timestamp < MS_EPOCH_MIN ? timestamp * 1e3 : timestamp;
}
function createFeishuReplyDispatcher(params) {
	const core = getFeishuRuntime();
	const { cfg, agentId, chatId, sendTarget, replyToMessageId, typingTargetMessageId: explicitTypingTargetMessageId, skipReplyToInMessages, replyInThread, threadReply, rootId, accountId, identity, mentionTargets, requiredMentionTargets } = params;
	const sendReplyToMessageId = skipReplyToInMessages ? void 0 : replyToMessageId;
	const typingTargetMessageId = explicitTypingTargetMessageId?.trim() || replyToMessageId;
	const threadReplyMode = threadReply === true;
	const effectiveReplyInThread = threadReplyMode ? true : replyInThread;
	const replyTarget = {
		cfg,
		to: sendTarget,
		replyToMessageId: sendReplyToMessageId,
		replyInThread: effectiveReplyInThread,
		allowTopLevelReplyFallback: threadReplyMode && rootId !== void 0 && sendReplyToMessageId !== void 0 && sendReplyToMessageId !== rootId,
		accountId
	};
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	let typingState = null;
	const { typingCallbacks, responsePrefix, responsePrefixContextProvider, onModelSelected } = createChannelMessageReplyPipeline({
		cfg,
		agentId,
		channel: "feishu",
		accountId,
		typing: {
			start: async () => {
				if (!account.config.typingIndicator) return;
				if (!typingTargetMessageId) return;
				const messageCreateTimeMs = normalizeEpochMs(params.messageCreateTimeMs);
				if (messageCreateTimeMs !== void 0 && Date.now() - messageCreateTimeMs > TYPING_INDICATOR_MAX_AGE_MS) return;
				if (typingState?.reactionId) return;
				typingState = await addTypingIndicator({
					cfg,
					messageId: typingTargetMessageId,
					accountId,
					runtime: params.runtime
				});
			},
			stop: async () => {
				if (!typingState) return;
				await removeTypingIndicator({
					cfg,
					state: typingState,
					accountId,
					runtime: params.runtime
				});
				typingState = null;
			},
			onStartError: (err) => logTypingFailure({
				log: (message) => params.runtime.log(message),
				channel: "feishu",
				action: "start",
				error: err
			}),
			onStopError: (err) => logTypingFailure({
				log: (message) => params.runtime.log(message),
				channel: "feishu",
				action: "stop",
				error: err
			})
		}
	});
	const textChunkLimit = core.channel.text.resolveTextChunkLimit(cfg, "feishu", accountId, { fallbackLimit: 4e3 });
	const chunkMode = core.channel.text.resolveChunkMode(cfg, "feishu", accountId);
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	});
	const renderMode = account.config?.renderMode ?? "auto";
	const streamingEnabled = !requiredMentionTargets?.length && resolveChannelPreviewStreamMode(account.config, "partial") !== "off" && renderMode !== "raw";
	const hookRunner = getGlobalHookRunner();
	const modifyingHooksRegistered = (hookRunner?.hasHooks("reply_payload_sending") ?? false) || (hookRunner?.hasHooks("message_sending") ?? false);
	const previewStreamingEnabled = streamingEnabled && !modifyingHooksRegistered;
	const coreBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config) === true;
	const reasoningPreviewEnabled = previewStreamingEnabled && params.allowReasoningPreview === true;
	let streaming = null;
	let streamText = "";
	let lastPartial = "";
	let previewText = "";
	let previewBlockOffset = 0;
	let reasoningText = "";
	let statusLine = "";
	let modelWaitLine = "";
	let snapshotBaseText = "";
	let hasStreamingFinalText = false;
	const deliveredFinalTexts = /* @__PURE__ */ new Set();
	let lastStreamingSettlement;
	let sentIndependentBlockText = false;
	let partialUpdateQueue = Promise.resolve();
	let streamingStartPromise = null;
	let inFlightStreamingClose;
	let closingStreamingText;
	let visibleReplySent = false;
	let replyOutcome;
	let idleSideEffectsPromise = Promise.resolve();
	let activeIdleSideEffectsPromise = null;
	let idleRequestedForReply = false;
	let replyLifecycleStateInitialized = false;
	const pendingStreamingDeliveries = [];
	const formatReasoningPrefix = (thinking) => {
		if (!thinking) return "";
		return `> 💭 **Thinking**\n${thinking.replace(/^(?:Reasoning:|Thinking\.{0,3})\s*/u, "").replace(/^_(.*)_$/gm, "$1").split("\n").map((line) => `> ${line}`).join("\n")}`;
	};
	const buildCombinedStreamText = (thinking, answer) => {
		return [[thinking ? formatReasoningPrefix(thinking) : "", answer].filter(Boolean).join("\n\n---\n\n"), modelWaitLine || statusLine].filter(Boolean).join("\n\n");
	};
	const flushStreamingCardUpdate = (combined) => {
		partialUpdateQueue = queueFeishuStreamingUpdate({
			queue: partialUpdateQueue,
			session: streaming,
			startPromise: streamingStartPromise,
			text: combined,
			accountId: account.accountId,
			runtime: params.runtime
		});
	};
	const queueStreamingUpdate = (nextText, mode) => {
		if (!nextText) return;
		if (mode === "snapshot" && nextText === lastPartial) return;
		if (mode === "delta") {
			let offset = previewBlockOffset;
			if (!previewText.startsWith(nextText, offset)) while (/\s/u.test(previewText.charAt(offset))) offset++;
			if (previewText.startsWith(nextText, offset)) {
				previewBlockOffset = offset + nextText.length;
				return;
			}
			streamText = `${streamText}${nextText}`;
		} else {
			previewText = nextText;
			streamText = `${snapshotBaseText}${nextText}`;
		}
		lastPartial = nextText;
		flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
	};
	const startStreaming = () => {
		if (!streamingEnabled || streamingStartPromise || streaming || isStreamingStartBackedOff(account.accountId)) return;
		streamingStartPromise = (async () => {
			const creds = account.appId && account.appSecret ? {
				appId: account.appId,
				appSecret: account.appSecret,
				domain: account.domain,
				httpTimeoutMs: resolveConfiguredHttpTimeoutMs(account)
			} : null;
			if (!creds) return;
			const session = new FeishuStreamingSession(createFeishuClient(account), creds, (message) => params.runtime.log(`feishu[${account.accountId}] ${message}`));
			streaming = session;
			try {
				const cardHeader = resolveCardHeader(agentId, identity);
				const cardNote = resolveCardNote(agentId, identity, responsePrefixContextProvider());
				const streamingTarget = sendTarget.replace(/^(feishu|lark):/i, "").replace(/^(chat|user|group|dm|open_id):/i, "").trim();
				await session.start(streamingTarget, resolveReceiveIdType(sendTarget), {
					replyToMessageId: sendReplyToMessageId,
					replyInThread: effectiveReplyInThread,
					rootId,
					header: cardHeader,
					note: cardNote
				});
				streamingStartBackoffUntilByAccount.delete(account.accountId);
			} catch (error) {
				streamingStartBackoffUntilByAccount.set(account.accountId, performance.now() + STREAMING_START_FAILURE_BACKOFF_MS);
				params.runtime.error(`feishu[${account.accountId}]: streaming start failed; using non-streaming card fallback for ${STREAMING_START_FAILURE_BACKOFF_MS / 1e3}s: ${String(error)}`);
				if (streaming === session) {
					streaming = null;
					streamingStartPromise = null;
				}
			}
		})();
	};
	const resetStreamingState = () => {
		streaming = null;
		streamingStartPromise = null;
		partialUpdateQueue = Promise.resolve();
		streamText = "";
		lastPartial = "";
		reasoningText = "";
		statusLine = "";
		modelWaitLine = "";
		snapshotBaseText = "";
		hasStreamingFinalText = false;
	};
	const performStreamingClose = async (disposition) => {
		const streamingToClose = streaming;
		if (!streamingToClose) return lastStreamingSettlement ?? {
			disposition,
			result: noVisibleFeishuReplyDelivery
		};
		const startPromiseToClose = streamingStartPromise;
		const updateQueueToClose = partialUpdateQueue;
		const finalizedAnswerText = streamText;
		const finalizedReasoningText = reasoningText;
		const outcome = {
			disposition,
			content: finalizedAnswerText
		};
		resetStreamingState();
		try {
			if (startPromiseToClose) await startPromiseToClose;
			await updateQueueToClose;
			let result = noVisibleFeishuReplyDelivery;
			let finalizationError;
			if (streamingToClose?.isActive()) {
				statusLine = "";
				const text = buildCombinedStreamText(finalizedReasoningText, finalizedAnswerText);
				let closed;
				try {
					if (disposition === "discarded") closed = await streamingToClose.discard();
					else {
						const finalNote = resolveCardNote(agentId, identity, responsePrefixContextProvider());
						closed = await streamingToClose.closeWithResult(text, { note: finalNote });
					}
				} catch (error) {
					if (!isChannelPartialDeliveryError(error)) throw error;
					closed = error.deliveryResult;
					finalizationError = error;
				}
				result = closed;
				if (result.visibleReplySent) visibleReplySent = true;
				if (disposition === "closed" && result.visibleReplySent && finalizedAnswerText && (finalizationError === void 0 || result.content === text)) deliveredFinalTexts.add(finalizedAnswerText);
			}
			return {
				...outcome,
				result,
				...finalizationError === void 0 ? {} : { error: finalizationError }
			};
		} catch (error) {
			return {
				...outcome,
				result: noVisibleFeishuReplyDelivery,
				error
			};
		}
	};
	const closeStreaming = (disposition = "closed") => {
		if (inFlightStreamingClose) return inFlightStreamingClose;
		closingStreamingText = streamText;
		inFlightStreamingClose = performStreamingClose(disposition).then((outcome) => {
			lastStreamingSettlement = outcome;
			inFlightStreamingClose = void 0;
			closingStreamingText = void 0;
			return outcome;
		});
		return inFlightStreamingClose;
	};
	const deferStreamingDelivery = (result, infoKind) => {
		const { promise: finalization, resolve, reject } = createDeferred();
		pendingStreamingDeliveries.push({
			result,
			...infoKind ? { infoKind } : {},
			resolve,
			reject
		});
		if (idleRequestedForReply) queueIdleSideEffects().catch((error) => params.runtime.error(`feishu[${account.accountId}] late reply finalization failed: ${String(error)}`));
		return {
			...noVisibleFeishuReplyDelivery,
			finalization
		};
	};
	const discardStreamingPreview = async () => {
		if (inFlightStreamingClose && !streaming) return;
		const outcome = await closeStreaming("discarded");
		if (outcome.error !== void 0) throw toStringifiedError(outcome.error);
	};
	const updateStreamingStatusLine = (nextStatusLine, startIfNeeded = true) => {
		statusLine = nextStatusLine;
		if (!Boolean(streaming?.isActive() || streamingStartPromise) && (!startIfNeeded || renderMode !== "card")) return false;
		startStreaming();
		flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
		return false;
	};
	const sendChunkedTextReply = async (paramsLocal) => {
		const header = paramsLocal.useCard ? resolveCardHeader(agentId, identity) : void 0;
		const note = paramsLocal.useCard ? resolveCardNote(agentId, identity, responsePrefixContextProvider()) : void 0;
		const chunkSource = paramsLocal.useCard ? paramsLocal.text : materializeFeishuPostMarkdownSoftBreaks(core.channel.text.convertMarkdownTables(paramsLocal.text, tableMode));
		const initialChunks = core.channel.text.chunkMarkdownTextWithMode(chunkSource, textChunkLimit, chunkMode);
		const chunkOptions = {
			text: chunkSource,
			limit: textChunkLimit,
			mode: chunkMode,
			firstChunkMentions: paramsLocal.firstChunkMentions,
			chunkMentions: requiredMentionTargets,
			initialChunks
		};
		const chunks = resolveTextChunksWithFallback(chunkSource, paramsLocal.useCard ? chunkFeishuCardMarkdown({
			...chunkOptions,
			header,
			note
		}) : chunkFeishuPostMarkdown(chunkOptions));
		const results = [];
		const acceptedChunks = [];
		for (const [index, chunk] of chunks.entries()) {
			const mentions = [...requiredMentionTargets ?? [], ...index === 0 ? paramsLocal.firstChunkMentions ?? [] : []];
			try {
				const sendParams = {
					...replyTarget,
					text: chunk,
					...mentions.length > 0 ? { mentions } : {}
				};
				const result = paramsLocal.useCard ? await sendStructuredCardFeishu({
					...sendParams,
					header,
					note
				}) : await sendMessageFeishu({
					...sendParams,
					...paramsLocal.preparedPostText ? { preparedPostText: true } : {}
				});
				results.push(result);
				acceptedChunks.push(chunk);
				visibleReplySent = true;
			} catch (error) {
				const acceptedChunk = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
				if (acceptedChunk) {
					acceptedChunks.push(acceptedChunk.content ?? chunk);
					visibleReplySent = true;
				}
				throw createFeishuPartialReplyDeliveryError(error, {
					...acceptedChunk,
					...createFeishuReplyDeliveryResult({
						results,
						visibleReplySent: results.length > 0 || acceptedChunk !== void 0,
						content: acceptedChunks.join(""),
						kind: paramsLocal.useCard ? "card" : "text"
					})
				});
			}
		}
		if (paramsLocal.infoKind === "final") deliveredFinalTexts.add(paramsLocal.text);
		return createFeishuReplyDeliveryResult({
			results,
			visibleReplySent: results.length > 0,
			content: paramsLocal.text,
			kind: paramsLocal.useCard ? "card" : "text"
		});
	};
	const sendPostReply = (text, infoKind, firstChunkMentions) => sendChunkedTextReply({
		text,
		useCard: false,
		infoKind,
		firstChunkMentions
	});
	const sendMediaReplies = async (payload, options) => {
		const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
		let sentFallbackText = false;
		let degradedVoiceFallbackText;
		const results = [];
		try {
			await sendMediaWithLeadingCaption({
				mediaUrls,
				caption: "",
				send: async ({ mediaUrl }) => {
					const result = await sendMediaFeishu({
						...replyTarget,
						mediaUrl,
						mediaAccess: resolveOutboundMediaAccessForConfig(cfg),
						...payload.audioAsVoice === true ? { audioAsVoice: true } : {}
					});
					results.push(createFeishuReplyDeliveryResult({
						results: [result],
						visibleReplySent: true,
						kind: result?.voiceIntentDegradedToFile ? "media" : void 0
					}));
					visibleReplySent = true;
					if (result?.voiceIntentDegradedToFile && options?.fallbackText && !sentFallbackText) degradedVoiceFallbackText = options.fallbackText;
				},
				onError: options?.fallbackText === void 0 ? void 0 : async ({ error, mediaUrl }) => {
					if (isChannelPartialDeliveryError(error)) {
						visibleReplySent = true;
						throw toStringifiedError(error);
					}
					const fallbackText = await buildFeishuMediaFallbackText({
						text: sentFallbackText ? void 0 : options.fallbackText,
						mediaUrl
					});
					sentFallbackText = true;
					results.push(await sendPostReply(fallbackText, "final"));
				}
			});
			if (degradedVoiceFallbackText && !sentFallbackText) results.push(await sendPostReply(degradedVoiceFallbackText, "final"));
		} catch (error) {
			const partial = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
			if (partial) visibleReplySent = true;
			throw createFeishuPartialReplyDeliveryError(error, mergeFeishuReplyDeliveryResults([...results, ...partial ? [partial] : []]));
		}
		return mergeFeishuReplyDeliveryResults(results);
	};
	const ensureNoVisibleReplyFallback = async (reason) => {
		await idleSideEffectsPromise;
		if (visibleReplySent) return false;
		if (replyOutcome?.kind === "suppressed" || replyOutcome?.kind === "skipped" && replyOutcome.reason === "silent") {
			params.runtime.log?.(`feishu[${account.accountId}]: no-visible-reply fallback skipped for ${replyOutcome.reason} (${reason})`);
			return false;
		}
		await sendMessageFeishu({
			...replyTarget,
			text: NO_VISIBLE_REPLY_FALLBACK_TEXT,
			...requiredMentionTargets?.length ? { mentions: requiredMentionTargets } : {}
		});
		visibleReplySent = true;
		params.runtime.error?.(`feishu[${account.accountId}]: sent no-visible-reply fallback (${reason})`);
		return true;
	};
	const streamingRecoveries = /* @__PURE__ */ new WeakMap();
	const ensureVisibleStreamingDelivery = async (result, content, infoKind) => {
		if (result?.visibleReplySent === true && result.finalTextAccepted !== false || !content?.trim()) return result;
		let recoveries = result && streamingRecoveries.get(result);
		const pending = recoveries?.get(content);
		if (pending) return pending;
		const recovery = sendChunkedTextReply({
			text: content,
			useCard: withinCardTableLimit(content),
			infoKind,
			preparedPostText: true
		}).then((delivered) => {
			lastStreamingSettlement = {
				disposition: "closed",
				result: delivered,
				content
			};
			return delivered;
		});
		if (result) {
			if (!recoveries) {
				recoveries = /* @__PURE__ */ new Map();
				streamingRecoveries.set(result, recoveries);
			}
			recoveries.set(content, recovery);
		}
		return recovery;
	};
	function queueIdleSideEffects() {
		idleRequestedForReply = true;
		if (activeIdleSideEffectsPromise) return activeIdleSideEffectsPromise;
		const nextIdleSideEffects = idleSideEffectsPromise.then(async () => {
			try {
				do {
					const completions = pendingStreamingDeliveries.splice(0);
					const closeOutcome = streaming || inFlightStreamingClose ? await closeStreaming() : completions.length > 0 && lastStreamingSettlement ? lastStreamingSettlement : {
						disposition: "closed",
						result: noVisibleFeishuReplyDelivery
					};
					for (const completion of completions) {
						const deliveryError = closeOutcome.error;
						if (closeOutcome.disposition === "discarded") {
							const retained = mergeFeishuReplyDeliveryResults([closeOutcome.result, completion.result], closeOutcome.result.content ?? "");
							if (deliveryError !== void 0) completion.reject(createFeishuPartialReplyDeliveryError(deliveryError, retained));
							else completion.resolve(retained);
							continue;
						}
						let providerFinalized = closeOutcome.result;
						try {
							providerFinalized = await ensureVisibleStreamingDelivery(providerFinalized, completion.result.content, completion.infoKind);
						} catch (fallbackError) {
							const fallbackPartial = isChannelPartialDeliveryError(fallbackError) ? fallbackError.deliveryResult : void 0;
							const fallbackCause = fallbackPartial && fallbackError instanceof Error ? fallbackError.cause ?? fallbackError : fallbackError;
							completion.reject(createFeishuPartialReplyDeliveryError(deliveryError === void 0 ? fallbackCause : new AggregateError([deliveryError, fallbackCause], "Feishu streaming finalization and static fallback failed"), mergeFeishuReplyDeliveryResults([
								...providerFinalized ? [providerFinalized] : [],
								...fallbackPartial ? [fallbackPartial] : [],
								completion.result
							], fallbackPartial?.content ?? providerFinalized?.content ?? completion.result.content)));
							continue;
						}
						const settledResult = mergeFeishuReplyDeliveryResults([...providerFinalized ? [providerFinalized] : [], completion.result], deliveryError === void 0 ? completion.result.content ?? providerFinalized?.content : providerFinalized?.content ?? completion.result.content);
						if (deliveryError !== void 0) completion.reject(createFeishuPartialReplyDeliveryError(isChannelPartialDeliveryError(deliveryError) && deliveryError instanceof Error ? deliveryError.cause ?? deliveryError : deliveryError, settledResult));
						else completion.resolve(settledResult);
					}
					if (closeOutcome.error !== void 0) throw toStringifiedError(closeOutcome.error);
				} while (pendingStreamingDeliveries.length > 0);
			} finally {
				typingCallbacks?.onIdle?.();
			}
		});
		activeIdleSideEffectsPromise = nextIdleSideEffects;
		idleSideEffectsPromise = nextIdleSideEffects.catch(() => {});
		const finishIdleSideEffects = () => {
			if (activeIdleSideEffectsPromise === nextIdleSideEffects) activeIdleSideEffectsPromise = null;
			if (pendingStreamingDeliveries.length > 0) queueIdleSideEffects().catch((error) => params.runtime.error(`feishu[${account.accountId}] queued reply finalization failed: ${String(error)}`));
		};
		nextIdleSideEffects.then(finishIdleSideEffects, finishIdleSideEffects);
		return nextIdleSideEffects;
	}
	const throwStreamingDeliveryFailure = async (paramsLocal) => {
		let finalized = noVisibleFeishuReplyDelivery;
		let finalizationError;
		let fallbackPartial;
		const settlement = await closeStreaming();
		finalized = settlement?.result ?? finalized;
		finalizationError = settlement?.error;
		const discarded = settlement?.disposition === "discarded";
		try {
			if (!discarded) finalized = await ensureVisibleStreamingDelivery(finalized, paramsLocal.content, paramsLocal.infoKind) ?? finalized;
		} catch (fallbackError) {
			fallbackPartial = isChannelPartialDeliveryError(fallbackError) ? fallbackError.deliveryResult : void 0;
			const fallbackCause = fallbackPartial && fallbackError instanceof Error ? fallbackError.cause ?? fallbackError : fallbackError;
			finalizationError = finalizationError ? new AggregateError([finalizationError, fallbackCause], "Feishu streaming finalization and static fallback failed") : fallbackCause;
		}
		const mediaPartial = isChannelPartialDeliveryError(paramsLocal.error) ? paramsLocal.error.deliveryResult : void 0;
		const accepted = mergeFeishuReplyDeliveryResults([
			finalized,
			...fallbackPartial ? [fallbackPartial] : [],
			...mediaPartial ? [mediaPartial] : []
		], discarded ? finalized.content ?? "" : fallbackPartial?.visibleReplySent === true ? fallbackPartial.content : finalized.visibleReplySent === true ? finalized.content : paramsLocal.content);
		const mediaCause = mediaPartial && paramsLocal.error instanceof Error ? paramsLocal.error.cause ?? paramsLocal.error : paramsLocal.error;
		const cause = finalizationError ? new AggregateError([mediaCause, finalizationError instanceof Error && (isChannelPartialDeliveryError(finalizationError) || settlement.error === void 0) ? finalizationError.cause ?? finalizationError : finalizationError], "Feishu reply delivery and streaming finalization failed") : mediaCause;
		throw createFeishuPartialReplyDeliveryError(cause, accepted);
	};
	const dispatcherOptions = {
		responsePrefix,
		responsePrefixContextProvider,
		humanDelay: resolveHumanDelayConfig(cfg, agentId),
		silentReplyContext: {
			cfg,
			sessionKey: params.sessionKey,
			surface: "feishu",
			conversationType: chatId.startsWith("oc_") ? "group" : "direct"
		},
		onSkip: (_payload, info) => {
			if (replyOutcome?.kind !== "failed" && (info.kind === "final" || info.kind === "block" && info.reason === "silent")) replyOutcome = {
				kind: "skipped",
				reason: info.reason,
				assistantMessageIndex: info.assistantMessageIndex
			};
		},
		beforeDeliver: (payload, info) => {
			if (!(replyOutcome?.kind === "skipped" && replyOutcome.reason === "silent" && info.kind !== "final" && replyOutcome.assistantMessageIndex !== void 0 && info.assistantMessageIndex !== void 0 && info.assistantMessageIndex < replyOutcome.assistantMessageIndex) && replyOutcome?.kind !== "failed") replyOutcome = void 0;
			return payload;
		},
		onReplyStart: async () => {
			if (!replyLifecycleStateInitialized) {
				replyLifecycleStateInitialized = true;
				deliveredFinalTexts.clear();
				lastStreamingSettlement = void 0;
				sentIndependentBlockText = false;
				idleRequestedForReply = false;
				visibleReplySent = false;
				replyOutcome = void 0;
			}
			if (previewStreamingEnabled && renderMode === "card") startStreaming();
			await typingCallbacks?.onReplyStart?.();
		},
		onIdle: queueIdleSideEffects,
		onCleanup: () => {
			typingCallbacks?.onCleanup?.();
		}
	};
	const handleDeliveryError = async (error, info) => {
		if (info.kind === "final") replyOutcome = { kind: "failed" };
		if (isChannelPartialDeliveryError(error)) visibleReplySent = true;
		params.runtime.error(`feishu[${account.accountId}] ${info.kind} reply failed: ${String(error)}`);
		await queueIdleSideEffects().catch((cleanupError) => params.runtime.error(`feishu[${account.accountId}] reply error cleanup failed: ${String(cleanupError)}`));
	};
	return {
		dispatcherOptions,
		delivery: {
			observeMessageSent: true,
			onDelivered: (_payload, info, result) => {
				if (result?.visibleReplySent) {
					visibleReplySent = true;
					if (info.kind === "final") replyOutcome = void 0;
					return;
				}
				const reason = result?.suppression?.reason;
				if (info.kind === "final" && replyOutcome?.kind !== "failed" && (reason === "cancelled_by_reply_payload_sending_hook" || reason === "empty_after_reply_payload_sending_hook" || reason === "cancelled_by_message_sending_hook" || reason === "empty_after_message_sending_hook" || reason === "channel_transform")) replyOutcome = {
					kind: "suppressed",
					reason
				};
			},
			deliver: async (inputPayload, info) => {
				const prepared = await renderFeishuReplyPayload(inputPayload, {
					to: sendTarget,
					identity,
					mentions: requiredMentionTargets
				});
				const rendered = consumeFeishuPresentationFallbackMarker(prepared.payload);
				const payload = rendered.payload;
				const presentationCard = prepared.card;
				const hasPresentationFallback = rendered.presentationFallback?.hasVisibleContent === true;
				const hasIndependentPresentation = presentationCard !== void 0 || hasPresentationFallback;
				const resolvedText = payload.text;
				const payloadText = payload.isReasoning && resolvedText ? formatReasoningMessage(resolvedText) : resolvedText;
				const reply = resolveSendableOutboundReplyParts({
					...payload,
					text: payloadText
				});
				const text = info?.kind === "final" && !hasIndependentPresentation ? mergeStreamingFinalText(streamText, payload.isError ? reply.text : `${snapshotBaseText}${reply.text}`, payload.isError === true && hasStreamingFinalText) : reply.text;
				const hasText = reply.hasText;
				const hasMedia = reply.hasMedia;
				const ttsSupplement = getReplyPayloadTtsSupplement(payload);
				const ttsTextAlreadyVisible = ttsSupplement?.visibleTextAlreadyDelivered === true;
				const hasVoiceMedia = hasMedia && reply.mediaUrls.some((mediaUrl) => shouldSuppressFeishuTextForVoiceMedia({
					mediaUrl,
					...payload.audioAsVoice === true ? { audioAsVoice: true } : {},
					ttsSupplement
				}));
				const finalTextExceedsStreamingLimit = info?.kind === "final" && hasText && text.length > textChunkLimit;
				const cardRenderingRequested = renderMode === "card" || info?.kind === "block" && coreBlockStreamingEnabled && renderMode !== "raw" || renderMode === "auto" && shouldUseFeishuCard(text);
				const useStaticCard = hasText && cardRenderingRequested && withinCardTableLimit(text);
				const useStreamingCard = hasText && streamingEnabled && !finalTextExceedsStreamingLimit && (info?.kind === "final" || cardRenderingRequested);
				const skipTextForDuplicateFinal = !hasIndependentPresentation && info?.kind === "final" && hasText && deliveredFinalTexts.has(text);
				const shouldDeliverText = hasText && (!hasVoiceMedia || hasPresentationFallback) && !skipTextForDuplicateFinal;
				const shouldDiscardStreamingPreview = info?.kind === "final" && !(hasIndependentPresentation && payload.isError === true && hasStreamingFinalText) && (hasIndependentPresentation || finalTextExceedsStreamingLimit || hasMedia && (hasVoiceMedia && !shouldDeliverText && !ttsTextAlreadyVisible || skipTextForDuplicateFinal));
				const priorClosedStreamingSettlement = info?.kind === "final" && hasText && skipTextForDuplicateFinal && lastStreamingSettlement?.content === text ? lastStreamingSettlement : void 0;
				if (!shouldDeliverText && !hasMedia && !presentationCard) {
					if (priorClosedStreamingSettlement?.error !== void 0) throw toStringifiedError(priorClosedStreamingSettlement.error);
					return priorClosedStreamingSettlement?.result ?? noVisibleFeishuReplyDelivery;
				}
				const deliveredResults = priorClosedStreamingSettlement ? [priorClosedStreamingSettlement.result] : [];
				const collectDelivery = async (pending, acceptedContent) => {
					try {
						deliveredResults.push(await pending);
					} catch (error) {
						const partial = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
						const accumulated = mergeFeishuReplyDeliveryResults([...deliveredResults, ...partial ? [{
							...partial,
							content: partial.content ?? acceptedContent
						}] : []]);
						throw createFeishuPartialReplyDeliveryError(partial && error instanceof Error ? error.cause ?? error : error, {
							...accumulated,
							content: accumulated.content ?? ""
						});
					}
				};
				if (shouldDiscardStreamingPreview) await discardStreamingPreview();
				if (presentationCard) {
					if (hasMedia) await collectDelivery(sendMediaReplies(payload));
					await collectDelivery(sendCardFeishu({
						...replyTarget,
						card: presentationCard
					}).then((result) => createFeishuReplyDeliveryResult({
						results: [result],
						visibleReplySent: true,
						content: resolvedText,
						kind: "card"
					})), resolvedText);
					visibleReplySent = true;
					return mergeFeishuReplyDeliveryResults(deliveredResults, resolvedText);
				}
				if (shouldDeliverText) {
					if (hasPresentationFallback || info?.kind === "block" && !useStreamingCard) {
						if (hasPresentationFallback || coreBlockStreamingEnabled || hasMedia) {
							const firstChunkMentions = info?.kind === "final" || info?.kind === "block" && !sentIndependentBlockText ? mentionTargets : void 0;
							await collectDelivery(sendPostReply(text, info?.kind, firstChunkMentions));
							if (info?.kind === "block") sentIndependentBlockText = true;
							if (hasMedia) await collectDelivery(sendMediaReplies(payload));
						}
						return mergeFeishuReplyDeliveryResults(deliveredResults, text);
					}
					const matchingClosingStream = inFlightStreamingClose !== void 0 && closingStreamingText === text;
					if (!matchingClosingStream && (info?.kind === "block" || info?.kind === "final" && useStreamingCard)) {
						startStreaming();
						if (streamingStartPromise) await streamingStartPromise;
					}
					if ((info?.kind === "block" || info?.kind === "final") && (streaming?.isActive() || matchingClosingStream)) {
						if (!matchingClosingStream) {
							if (info?.kind === "block") queueStreamingUpdate(text, "delta");
							if (info?.kind === "final") {
								streamText = text;
								hasStreamingFinalText = true;
								flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
							}
						}
						if (hasMedia) try {
							await collectDelivery(sendMediaReplies(payload));
						} catch (error) {
							await throwStreamingDeliveryFailure({
								error,
								content: text,
								infoKind: info?.kind
							});
						}
						return deferStreamingDelivery(mergeFeishuReplyDeliveryResults(deliveredResults, text), info?.kind);
					}
					if (useStaticCard || useStreamingCard && !isStreamingStartBackedOff(account.accountId) && withinCardTableLimit(text)) deliveredResults.push(await sendChunkedTextReply({
						text,
						useCard: true,
						infoKind: info?.kind
					}));
					else {
						const firstChunkMentions = info?.kind === "final" && mentionTargets?.length ? mentionTargets : void 0;
						deliveredResults.push(await sendPostReply(text, info?.kind, firstChunkMentions));
					}
				}
				if (hasMedia) await collectDelivery(sendMediaReplies(payload, !shouldDeliverText && !ttsTextAlreadyVisible && hasVoiceMedia && hasText ? { fallbackText: text } : void 0));
				const deliveredContent = hasVoiceMedia ? deliveredResults.at(-1)?.content ?? text : text;
				const result = mergeFeishuReplyDeliveryResults(deliveredResults, deliveredContent);
				if (priorClosedStreamingSettlement?.error !== void 0) throw createFeishuPartialReplyDeliveryError(isChannelPartialDeliveryError(priorClosedStreamingSettlement.error) && priorClosedStreamingSettlement.error instanceof Error ? priorClosedStreamingSettlement.error.cause ?? priorClosedStreamingSettlement.error : priorClosedStreamingSettlement.error, result);
				return result;
			},
			onError: handleDeliveryError
		},
		replyOptions: {
			onModelSelected,
			disableBlockStreaming: !coreBlockStreamingEnabled,
			preserveProgressCallbackStartOrder: previewStreamingEnabled ? true : void 0,
			onPartialReply: previewStreamingEnabled ? (payload) => {
				if (!payload.text) return false;
				const cleaned = stripReasoningTagsFromText(payload.text, {
					mode: "strict",
					trim: "both"
				});
				if (!cleaned) return false;
				startStreaming();
				queueStreamingUpdate(cleaned, "snapshot");
				return false;
			} : void 0,
			onReasoningStream: reasoningPreviewEnabled ? (payload) => {
				if (!payload.text) return false;
				startStreaming();
				const nextThinking = formatReasoningMessage(payload.text);
				if (nextThinking) {
					reasoningText = nextThinking;
					flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
				}
				return false;
			} : void 0,
			onReasoningEnd: reasoningPreviewEnabled ? () => false : void 0,
			onItemEvent: previewStreamingEnabled ? (payload) => {
				if (payload.kind === "preamble" || payload.hideFromChannelProgress || payload.suppressChannelProgress) return false;
				if (payload.kind === "model-wait") {
					if (payload.phase === "end" && !modelWaitLine) return false;
					modelWaitLine = payload.phase === "end" ? "" : payload.progressText ?? "";
					if (!modelWaitLine && !buildCombinedStreamText(reasoningText, streamText)) return discardStreamingPreview().then(() => false);
					return updateStreamingStatusLine(statusLine, payload.phase !== "end");
				}
				const { kind: itemKind, ...item } = payload;
				const statusLineLocal = formatChannelProgressDraftLineForEntry(account.config, {
					event: "item",
					itemKind,
					...item
				});
				if (statusLineLocal) return updateStreamingStatusLine(statusLineLocal);
				return false;
			} : void 0,
			onAssistantMessageStart: previewStreamingEnabled ? () => {
				snapshotBaseText = streamText ? `${streamText}\n\n` : "";
				lastPartial = "";
				previewText = "";
				previewBlockOffset = 0;
				modelWaitLine = "";
				return updateStreamingStatusLine("", false);
			} : void 0,
			onCompactionStart: previewStreamingEnabled ? () => updateStreamingStatusLine("📦 **Compacting context...**") : void 0,
			onCompactionEnd: previewStreamingEnabled ? () => updateStreamingStatusLine("") : void 0
		},
		ensureNoVisibleReplyFallback
	};
}
// extensions/feishu/src/synthetic-event-target.ts
const directPreDispatchTargets = /* @__PURE__ */ new WeakMap();
/** Keep synthetic-only routing metadata outside the public Feishu event shape. */
function setFeishuSyntheticDirectPreDispatchTarget(event, target) {
	directPreDispatchTargets.set(event, target);
	return event;
}
function getFeishuSyntheticDirectPreDispatchTarget(event) {
	return directPreDispatchTargets.get(event);
}
// extensions/feishu/src/bot.ts
const permissionErrorNotifiedAt = /* @__PURE__ */ new Map();
const PERMISSION_ERROR_COOLDOWN_MS = 3e5;
function isFeishuTopicSessionScope(scope) {
	return scope === "group_topic" || scope === "group_topic_sender";
}
async function handleFeishuMessage(params) {
	const { event, preparedContent, botOpenId, runtime, channelRuntime, chatHistories, accountId, processingClaim, messageDedupeKey: messageDedupeKeyOverride, turnAdoptionLifecycle } = params;
	let cfg = getFeishuRuntime().config.current();
	let account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	let feishuCfg = account.config;
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const messageId = event.message.message_id;
	const messageDedupeKey = messageDedupeKeyOverride ?? resolveFeishuMessageDedupeKey(event);
	if (!turnAdoptionLifecycle && !await finalizeFeishuMessageProcessing({
		messageId: messageDedupeKey,
		namespace: account.accountId,
		log,
		processingClaim
	})) {
		log(`feishu: skipping duplicate message ${messageId}`);
		return;
	}
	let ctx = parseFeishuMessageEvent(event, botOpenId, preparedContent);
	const isGroup = isFeishuGroupChatType(ctx.chatType);
	const isDirect = !isGroup;
	const directPreDispatchTarget = isDirect ? getFeishuSyntheticDirectPreDispatchTarget(event) : void 0;
	const senderUserId = normalizeOptionalString(event.sender.sender_id.user_id);
	const localBotOpenId = botOpenId?.trim();
	if (ctx.senderType === "bot") {
		if (!localBotOpenId) {
			log(`feishu[${account.accountId}]: dropping bot message ${ctx.messageId} (local bot identity unavailable)`);
			return;
		}
		if (ctx.senderOpenId === localBotOpenId) {
			log(`feishu[${account.accountId}]: dropping self-authored bot message ${ctx.messageId}`);
			return;
		}
		if (feishuCfg?.allowBots !== true) {
			log(`feishu[${account.accountId}]: dropping bot message ${ctx.messageId} (allowBots=false)`);
			return;
		}
		if (isGroup && !ctx.mentionedBot) {
			let verifiedBotMention;
			try {
				const response = await createFeishuClient(account).im.message.get({
					params: { user_id_type: "open_id" },
					path: { message_id: ctx.messageId }
				});
				const verifiedKey = (response.data?.items?.[0]?.mentions?.find((mention) => mention.id_type === "open_id" && mention.id === localBotOpenId && Boolean(mention.key?.trim())))?.key?.trim();
				if (response.code === 0 && verifiedKey) {
					const eventMention = event.message.mentions?.find((mention) => mention.key === verifiedKey && !isFeishuBroadcastMention(mention));
					if (eventMention) verifiedBotMention = {
						...eventMention,
						id: {
							...eventMention.id,
							open_id: localBotOpenId
						}
					};
				}
			} catch (err) {
				log(`feishu[${account.accountId}]: failed to verify bot mention for ${ctx.messageId}: ${String(err)}`);
			}
			if (!verifiedBotMention) {
				log(`feishu[${account.accountId}]: dropping bot message ${ctx.messageId} (local mention not verifiable)`);
				return;
			}
			ctx = {
				...ctx,
				mentionedBot: true,
				content: `${normalizeMentions(verifiedBotMention.key, [verifiedBotMention])} ${normalizeFeishuCommandProbeBody(ctx.content)}`.trim(),
				mentionTargets: void 0
			};
		}
	}
	if (event.message.message_type === "merge_forward") try {
		const messageInfo = await getMessageFeishu({
			cfg,
			messageId: event.message.message_id,
			accountId: account.accountId
		});
		if (messageInfo) ctx = {
			...ctx,
			content: messageInfo.content
		};
		else {
			log(`feishu[${account.accountId}]: merge_forward message retrieval returned no result`);
			ctx = {
				...ctx,
				content: "[Merged and Forwarded Message - could not fetch]"
			};
		}
	} catch (err) {
		log(`feishu[${account.accountId}]: merge_forward fetch failed: ${String(err)}`);
		ctx = {
			...ctx,
			content: "[Merged and Forwarded Message - fetch error]"
		};
	}
	let permissionErrorForAgent;
	if (feishuCfg.resolveSenderNames) {
		if (ctx.senderType === "bot") {
			const senderName = await resolveFeishuBotName({
				account,
				openId: ctx.senderOpenId,
				log
			});
			if (senderName) ctx = {
				...ctx,
				senderName
			};
		} else {
			const senderResult = await resolveFeishuSenderName({
				account,
				senderId: ctx.senderOpenId,
				log
			});
			if (senderResult.name) ctx = {
				...ctx,
				senderName: senderResult.name
			};
			if (senderResult.permissionError) {
				const appKey = account.appId ?? "default";
				const now = Date.now();
				if (now - (permissionErrorNotifiedAt.get(appKey) ?? 0) > PERMISSION_ERROR_COOLDOWN_MS) {
					permissionErrorNotifiedAt.set(appKey, now);
					permissionErrorForAgent = senderResult.permissionError;
				}
			}
		}
	}
	const threadRoot = await prepareFeishuThreadRoot({
		cfg,
		account,
		ctx,
		botOpenId,
		log
	});
	if (!threadRoot) return;
	({cfg, account} = threadRoot);
	feishuCfg = account.config;
	const { isBotOwnedThread, getRootMessageInfo } = threadRoot;
	const historyLimit = resolvePromptHistoryLimit(feishuCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit);
	const groupConfig = isGroup ? resolveFeishuGroupConfig({
		cfg: feishuCfg,
		groupId: ctx.chatId
	}) : void 0;
	const groupSessionScope = isGroup ? resolveConfiguredFeishuGroupSessionScope({
		groupConfig,
		feishuCfg
	}) : null;
	let effectiveThreadId = ctx.threadId;
	if (isGroup && ctx.chatType === "topic_group" && !effectiveThreadId && isFeishuTopicSessionScope(groupSessionScope ?? "group")) {
		const topicHydrationMessageId = ctx.replyTargetMessageId ?? ctx.messageId;
		try {
			const hydratedThreadId = (await getMessageFeishu({
				cfg,
				accountId: account.accountId,
				messageId: topicHydrationMessageId
			}))?.threadId?.trim();
			if (hydratedThreadId) {
				ctx = {
					...ctx,
					threadId: hydratedThreadId
				};
				effectiveThreadId = hydratedThreadId;
			}
		} catch (err) {
			log(`feishu[${account.accountId}]: failed to hydrate topic thread_id for message=${topicHydrationMessageId}: ${String(err)}`);
		}
	}
	const effectiveGroupSenderAllowFrom = isGroup ? (groupConfig?.allowFrom?.length ?? 0) > 0 ? groupConfig?.allowFrom ?? [] : feishuCfg?.groupSenderAllowFrom ?? [] : [];
	const groupSession = isGroup ? resolveFeishuGroupSession({
		chatId: ctx.chatId,
		senderOpenId: ctx.senderOpenId,
		messageId: ctx.messageId,
		rootId: ctx.rootId,
		threadId: effectiveThreadId,
		chatType: ctx.chatType,
		groupConfig,
		feishuCfg
	}) : null;
	const isTopicSession = isGroup && isFeishuTopicSessionScope(groupSession?.groupSessionScope ?? "group");
	const groupHistoryKey = isGroup ? groupSession?.peerId ?? ctx.chatId : void 0;
	const dmPolicy = feishuCfg.dmPolicy;
	const configAllowFrom = feishuCfg?.allowFrom ?? [];
	const rawBroadcastAgents = isGroup ? resolveBroadcastAgents(cfg, ctx.chatId) : null;
	const broadcastAgents = rawBroadcastAgents ? uniqueStrings(rawBroadcastAgents.map(normalizeAgentId$1)) : null;
	const messageCreateTimeMs = parseStrictNonNegativeInteger(event.message.create_time) ?? Date.now();
	let requireMention = false;
	if (isGroup) {
		if (groupConfig?.enabled === false) {
			log(`feishu[${account.accountId}]: group ${ctx.chatId} is disabled`);
			return;
		}
		const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
		const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
			providerConfigPresent: cfg.channels?.feishu !== void 0,
			groupPolicy: feishuCfg?.groupPolicy,
			defaultGroupPolicy
		});
		warnMissingProviderGroupPolicyFallbackOnce({
			providerMissingFallbackApplied,
			providerKey: "feishu",
			accountId: account.accountId,
			log
		});
		const groupAllowFrom = feishuCfg?.groupAllowFrom ?? [];
		const groupExplicitlyConfigured = hasExplicitFeishuGroupConfig({
			cfg: feishuCfg,
			groupId: ctx.chatId
		});
		if ((await resolveFeishuGroupConversationIngressAccess({
			cfg,
			accountId: account.accountId,
			chatId: ctx.chatId,
			groupPolicy,
			groupAllowFrom,
			groupExplicitlyConfigured
		})).ingress.admission !== "dispatch") {
			log(`feishu[${account.accountId}]: group ${ctx.chatId} not in groupAllowFrom (groupPolicy=${groupPolicy})`);
			return;
		}
		({requireMention} = resolveFeishuReplyPolicy({
			cfg,
			accountId: account.accountId,
			groupId: ctx.chatId,
			groupPolicy
		}));
		({requireMention} = resolveBotThreadMentionPolicy({
			isBotOwnedThread,
			requireMentionInBotThreads: groupConfig?.requireMentionInBotThreads ?? feishuCfg.requireMentionInBotThreads,
			requireMention
		}));
		const groupSenderActivationIngress = await resolveFeishuGroupSenderActivationIngressAccess({
			cfg,
			accountId: account.accountId,
			chatId: ctx.chatId,
			allowFrom: effectiveGroupSenderAllowFrom,
			senderOpenId: ctx.senderOpenId,
			senderUserId,
			requireMention,
			mentionedBot: ctx.mentionedBot
		});
		if (groupSenderActivationIngress.senderAccess.decision !== "allow") {
			log(`feishu: sender ${ctx.senderOpenId} not in group ${ctx.chatId} sender allowlist`);
			return;
		}
		if (groupSenderActivationIngress.ingress.admission !== "dispatch") {
			log(`feishu[${account.accountId}]: message in group ${ctx.chatId} did not mention bot`);
			if (!broadcastAgents && chatHistories && groupHistoryKey) createChannelHistoryWindow({ historyMap: chatHistories }).record({
				historyKey: groupHistoryKey,
				limit: historyLimit,
				entry: {
					sender: ctx.senderOpenId,
					body: `${ctx.senderName ?? ctx.senderOpenId}: ${ctx.content}`,
					timestamp: messageCreateTimeMs,
					messageId: ctx.messageId
				}
			});
			return;
		}
		if (ctx.senderType === "bot") {
			if (!localBotOpenId || !ctx.senderOpenId) {
				log(`feishu[${account.accountId}]: dropping bot message ${ctx.messageId} (loop identity unavailable)`);
				return;
			}
			if (recordChannelBotPairLoopAndCheckSuppression({
				scopeId: account.accountId,
				conversationId: ctx.chatId,
				senderId: ctx.senderOpenId,
				receiverId: localBotOpenId,
				defaultsConfig: cfg.channels?.defaults?.botLoopProtection,
				defaultEnabled: true
			}).suppressed) {
				log(`feishu[${account.accountId}]: bot-pair loop suppressed for ${ctx.senderOpenId} in ${ctx.chatId}`);
				return;
			}
		}
	}
	try {
		const core = { channel: channelRuntime?.inbound ? channelRuntime : getFeishuRuntime().channel };
		const pairing = createChannelPairingController({
			core,
			channel: "feishu",
			accountId: account.accountId
		});
		const commandProbeBody = normalizeFeishuCommandProbeBody(ctx.content);
		const shouldComputeCommandAuthorized = core.channel.commands.shouldComputeCommandAuthorized(commandProbeBody, cfg);
		const resolveDirectAuthorization = async (candidateCfg, mayPair, shouldComputeCommand = core.channel.commands.shouldComputeCommandAuthorized(commandProbeBody, candidateCfg)) => {
			const candidateAccount = resolveFeishuRuntimeAccount({
				cfg: candidateCfg,
				accountId: account.accountId
			});
			const candidateDmPolicy = candidateAccount.config.dmPolicy;
			const candidateConfigAllowFrom = candidateAccount.config.allowFrom ?? [];
			return {
				cfg: candidateCfg,
				dmPolicy: candidateDmPolicy,
				configAllowFrom: candidateConfigAllowFrom,
				ingress: await resolveFeishuDmIngressAccess({
					cfg: candidateCfg,
					accountId: candidateAccount.accountId,
					dmPolicy: candidateDmPolicy,
					allowFrom: candidateConfigAllowFrom,
					readAllowFromStore: pairing.readAllowFromStore,
					senderOpenId: ctx.senderOpenId,
					senderUserId,
					conversationId: ctx.senderOpenId,
					mayPair,
					...shouldComputeCommand ? { command: { hasControlCommand: true } } : {}
				}),
				shouldComputeCommandAuthorized: shouldComputeCommand
			};
		};
		const rejectDirectAuthorization = async (authorization) => {
			if (authorization.ingress.ingress.admission === "pairing-required") await pairing.issueChallenge({
				senderId: ctx.senderOpenId,
				senderIdLine: `Your Feishu user id: ${ctx.senderOpenId}`,
				meta: { name: ctx.senderName },
				onCreated: () => {
					log(`feishu[${account.accountId}]: pairing request sender=${ctx.senderOpenId}`);
				},
				sendPairingReply: async (text) => {
					await sendMessageFeishu({
						cfg: authorization.cfg,
						to: directPreDispatchTarget ?? `chat:${ctx.chatId}`,
						text,
						accountId: account.accountId
					});
				},
				onReplyError: (err) => {
					log(`feishu[${account.accountId}]: pairing reply failed for ${ctx.senderOpenId}: ${String(err)}`);
				}
			});
			else log(`feishu[${account.accountId}]: blocked unauthorized sender ${ctx.senderOpenId} (dmPolicy=${authorization.dmPolicy})`);
		};
		const directAuthorization = isDirect ? await resolveDirectAuthorization(cfg, true, shouldComputeCommandAuthorized) : null;
		const dmIngress = directAuthorization?.ingress ?? null;
		if (isDirect && dmIngress?.ingress.admission !== "dispatch") {
			if (directAuthorization) await rejectDirectAuthorization(directAuthorization);
			return;
		}
		let effectiveAuthorization = directAuthorization;
		let effectiveCfg = cfg;
		if (isDirect) {
			const currentCfg = getFeishuRuntime().config.current();
			if (currentCfg !== effectiveCfg) {
				const currentAuthorization = await resolveDirectAuthorization(currentCfg, true);
				if (currentAuthorization.ingress.ingress.admission !== "dispatch") {
					await rejectDirectAuthorization(currentAuthorization);
					return;
				}
				effectiveCfg = currentCfg;
				effectiveAuthorization = currentAuthorization;
			}
		}
		const feishuFrom = `feishu:${ctx.senderOpenId}`;
		const feishuTo = isGroup ? `chat:${ctx.chatId}` : `user:${ctx.senderOpenId}`;
		const feishuReplyTarget = ctx.chatId.startsWith("oc_") ? `chat:${ctx.chatId}` : feishuTo;
		const peerId = isGroup ? groupSession?.peerId ?? ctx.chatId : ctx.senderOpenId;
		const parentPeer = isGroup ? groupSession?.parentPeer ?? null : null;
		const directThreadReply = !isGroup && Boolean(ctx.threadId?.trim());
		const defaultReplyTargetMessageId = ctx.replyTargetMessageId ?? (ctx.suppressReplyTarget ? void 0 : ctx.messageId);
		const directThreadRootId = directThreadReply ? ctx.rootId?.trim() || void 0 : void 0;
		const directThreadReplyTargetMessageId = directThreadReply ? directThreadRootId ?? defaultReplyTargetMessageId : void 0;
		const replyInThread = isGroup ? groupSession?.replyInThread ?? false : directThreadReply;
		const feishuAcpConversationSupported = !isGroup || isTopicSession;
		let route = core.channel.routing.resolveAgentRoute({
			cfg: effectiveCfg,
			channel: "feishu",
			accountId: account.accountId,
			peer: {
				kind: isGroup ? "group" : "direct",
				id: peerId
			},
			parentPeer
		});
		if (!isGroup && route.matchedBy === "default") {
			const runtimeLocal = getFeishuRuntime();
			const result = await maybeCreateDynamicAgent({
				cfg: effectiveCfg,
				runtime: runtimeLocal,
				accountId: account.accountId,
				senderOpenId: ctx.senderOpenId,
				canCreateForConfig: async (candidateCfg) => {
					return (await resolveDirectAuthorization(candidateCfg, false)).ingress.ingress.admission === "dispatch";
				},
				log
			});
			if (result.created || result.updatedCfg !== effectiveCfg) {
				const refreshedAuthorization = await resolveDirectAuthorization(result.updatedCfg, false);
				if (refreshedAuthorization.ingress.ingress.admission !== "dispatch") {
					log(`feishu[${account.accountId}]: current policy rejected stale DM from ${ctx.senderOpenId} before adopting refreshed dynamic route (dmPolicy=${refreshedAuthorization.dmPolicy})`);
					return;
				}
				effectiveCfg = result.updatedCfg;
				effectiveAuthorization = refreshedAuthorization;
				route = core.channel.routing.resolveAgentRoute({
					cfg: result.updatedCfg,
					channel: "feishu",
					accountId: account.accountId,
					peer: {
						kind: "direct",
						id: ctx.senderOpenId
					}
				});
				if (result.created) log(`feishu[${account.accountId}]: dynamic agent created, new route: ${route.sessionKey}`);
			}
		}
		const effectiveDmPolicy = effectiveAuthorization?.dmPolicy ?? dmPolicy;
		const effectiveConfigAllowFrom = effectiveAuthorization?.configAllowFrom ?? configAllowFrom;
		const effectiveDmIngress = effectiveAuthorization?.ingress ?? dmIngress;
		const effectiveShouldComputeCommandAuthorized = effectiveAuthorization?.shouldComputeCommandAuthorized ?? shouldComputeCommandAuthorized;
		const commandAllowFrom = isGroup ? groupConfig?.allowFrom ?? effectiveConfigAllowFrom : effectiveDmIngress?.senderAccess.effectiveAllowFrom ?? effectiveConfigAllowFrom;
		const currentConversationId = peerId;
		const parentConversationId = isGroup ? parentPeer?.id ?? ctx.chatId : void 0;
		let configuredBinding = null;
		if (feishuAcpConversationSupported) {
			const configuredRoute = resolveConfiguredBindingRoute({
				cfg: effectiveCfg,
				route,
				conversation: {
					channel: "feishu",
					accountId: account.accountId,
					conversationId: currentConversationId,
					parentConversationId
				}
			});
			configuredBinding = configuredRoute.bindingResolution;
			route = configuredRoute.route;
			const runtimeRoute = await resolveRuntimeConversationBindingRouteAsync({
				route,
				conversation: {
					channel: "feishu",
					accountId: account.accountId,
					conversationId: currentConversationId,
					...parentConversationId ? { parentConversationId } : {}
				}
			});
			route = runtimeRoute.route;
			if (runtimeRoute.bindingRecord) configuredBinding = null;
		}
		if (configuredBinding) {
			const ensured = await ensureConfiguredBindingRouteReady({
				cfg: effectiveCfg,
				bindingResolution: configuredBinding
			});
			if (!ensured.ok) {
				const replyTargetMessageId = directThreadReply ? directThreadReplyTargetMessageId : isTopicSession ? ctx.rootId ?? ctx.messageId : ctx.messageId;
				await sendMessageFeishu({
					cfg: effectiveCfg,
					to: directPreDispatchTarget ?? `chat:${ctx.chatId}`,
					text: `⚠️ Failed to initialize the configured ACP session for this Feishu conversation: ${ensured.error}`,
					replyToMessageId: replyTargetMessageId,
					replyInThread,
					accountId: account.accountId
				}).catch((err) => {
					log(`feishu[${account.accountId}]: failed to send ACP init error reply: ${String(err)}`);
				});
				return;
			}
		}
		const contextVisibilityMode = resolveChannelContextVisibilityMode({
			cfg: effectiveCfg,
			channel: "feishu",
			accountId: account.accountId
		});
		const fetchedContextPolicy = {
			cfg,
			accountId: account.accountId,
			chatId: ctx.chatId,
			isGroup,
			allowFrom: effectiveGroupSenderAllowFrom,
			mode: contextVisibilityMode
		};
		const mediaMaxBytes = (feishuCfg?.mediaMaxMb ?? 30) * 1024 * 1024;
		const mediaList = await resolveFeishuMediaList({
			cfg,
			messageId: ctx.messageId,
			messageType: event.message.message_type,
			content: event.message.content,
			maxBytes: mediaMaxBytes,
			log,
			accountId: account.accountId
		});
		const unavailableMediaCount = mediaList.filter((media) => !media.path).length;
		const mediaFailureContent = unavailableMediaCount > 0 ? formatInboundMediaUnavailableText({
			body: ctx.content,
			notice: `[feishu ${unavailableMediaCount > 1 ? `${unavailableMediaCount} attachments` : "attachment"} unavailable]`
		}) : ctx.content;
		let quotedContent;
		if (ctx.parentId) try {
			const quotedMessageInfo = ctx.parentId === ctx.rootId ? await getRootMessageInfo() : await getMessageFeishu({
				cfg,
				messageId: ctx.parentId,
				accountId: account.accountId
			});
			if (quotedMessageInfo && await shouldIncludeFetchedGroupContextMessage({
				...fetchedContextPolicy,
				kind: "quote",
				senderId: quotedMessageInfo.senderId,
				senderType: quotedMessageInfo.senderType
			})) quotedContent = quotedMessageInfo.content;
			else if (quotedMessageInfo) log(`feishu[${account.accountId}]: skipped quoted message from sender ${quotedMessageInfo.senderId ?? "unknown"} (mode=${contextVisibilityMode})`);
		} catch (err) {
			log(`feishu[${account.accountId}]: failed to fetch quoted message: ${String(err)}`);
		}
		if (!mediaFailureContent.trim() && mediaList.length === 0 && !quotedContent?.trim()) {
			log(`feishu[${account.accountId}]: skipping empty message (no text, no media, no quoted) from ${ctx.senderOpenId}`);
			return;
		}
		let audioTranscript;
		if (event.message.message_type === "audio") {
			const audioMedia = mediaList.filter((media) => Boolean(media.path) && (media.kind === "audio" || media.contentType?.startsWith("audio/")));
			if (audioMedia.length > 0) {
				if (ctx.content.trim()) audioTranscript = ctx.content;
				else try {
					const { transcribeFirstAudio } = await import("openclaw/plugin-sdk/media-runtime");
					audioTranscript = await transcribeFirstAudio({
						ctx: {
							media: audioMedia,
							ChatType: isGroup ? "group" : "direct"
						},
						cfg: effectiveCfg
					});
				} catch (err) {
					log(`feishu: audio preflight transcription failed: ${String(err)}`);
				}
			}
		}
		const transcribedAudioIndex = audioTranscript === void 0 ? -1 : mediaList.findIndex((media) => media.kind === "audio" || media.contentType?.startsWith("audio/"));
		const inboundMedia = await toInboundMediaFactsWithMetadata(mediaList, { transcribed: (_media, index) => index === transcribedAudioIndex });
		const requiredMentionTargets = isGroup && ctx.senderType === "bot" && ctx.senderOpenId ? [{
			openId: ctx.senderOpenId,
			name: ctx.senderName ?? ctx.senderOpenId,
			key: ""
		}] : void 0;
		const agentFacingContent = audioTranscript ?? mediaFailureContent;
		const commandFacingContent = audioTranscript ?? ctx.content;
		const agentFacingCtx = agentFacingContent === ctx.content ? ctx : {
			...ctx,
			content: agentFacingContent
		};
		const effectiveCommandProbeBody = audioTranscript === void 0 ? commandProbeBody : normalizeFeishuCommandProbeBody(audioTranscript);
		const commandAuthorized = (audioTranscript === void 0 ? effectiveShouldComputeCommandAuthorized : core.channel.commands.shouldComputeCommandAuthorized(effectiveCommandProbeBody, effectiveCfg)) ? isDirect && audioTranscript === void 0 && effectiveDmIngress ? effectiveDmIngress.commandAccess.authorized : isGroup ? (await resolveFeishuGroupSenderActivationIngressAccess({
			cfg: effectiveCfg,
			accountId: account.accountId,
			chatId: ctx.chatId,
			allowFrom: commandAllowFrom,
			senderOpenId: ctx.senderOpenId,
			senderUserId,
			requireMention: false,
			mentionedBot: true,
			command: { hasControlCommand: true }
		})).commandAccess.authorized : (await resolveFeishuDmIngressAccess({
			cfg: effectiveCfg,
			accountId: account.accountId,
			dmPolicy: effectiveDmPolicy,
			allowFrom: effectiveConfigAllowFrom,
			readAllowFromStore: pairing.readAllowFromStore,
			senderOpenId: ctx.senderOpenId,
			senderUserId,
			conversationId: ctx.senderOpenId,
			mayPair: false,
			command: { hasControlCommand: true }
		})).commandAccess.authorized : void 0;
		const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
		const messageBody = buildFeishuAgentBody({
			ctx: agentFacingCtx,
			quotedContent,
			permissionErrorForAgent,
			botOpenId
		});
		const envelopeFrom = isGroup ? `${ctx.chatId}:${ctx.senderOpenId}` : ctx.senderOpenId;
		if (permissionErrorForAgent) log(`feishu[${account.accountId}]: appending permission error notice to message body`);
		let combinedBody = formatAgentEnvelope({
			channel: "Feishu",
			from: envelopeFrom,
			timestamp: messageCreateTimeMs,
			envelope: envelopeOptions,
			body: messageBody
		});
		const historyKey = groupHistoryKey;
		if (isGroup && historyKey && chatHistories) combinedBody = createChannelHistoryWindow({ historyMap: chatHistories }).buildPendingContext({
			historyKey,
			limit: historyLimit,
			currentMessage: combinedBody,
			formatEntry: (entry) => formatAgentEnvelope({
				channel: "Feishu",
				from: `${ctx.chatId}:${entry.sender}`,
				timestamp: entry.timestamp,
				body: entry.body,
				envelope: envelopeOptions
			})
		});
		const inboundHistory = isGroup && historyKey && historyLimit > 0 && chatHistories ? createChannelHistoryWindow({ historyMap: chatHistories }).buildInboundHistory({
			historyKey,
			limit: historyLimit
		}) : void 0;
		const threadContextBySessionKey = /* @__PURE__ */ new Map();
		let groupNamePromise;
		const resolveGroupNameForLabel = () => {
			if (!isGroup) return Promise.resolve(void 0);
			groupNamePromise ??= resolveGroupName({
				account,
				chatId: ctx.chatId,
				log
			});
			return groupNamePromise;
		};
		const resolveThreadContextForAgent = async (agentId, agentSessionKey, groupName) => {
			const cached = threadContextBySessionKey.get(agentSessionKey);
			if (cached) return cached;
			const threadContext = { threadLabel: (ctx.rootId || ctx.threadId) && isTopicSession ? `Feishu thread in ${groupName ?? ctx.chatId}` : void 0 };
			if (!(ctx.rootId || ctx.threadId) || !isTopicSession) {
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			const storePath = resolveStorePath(cfg.session?.store, { agentId });
			if (await core.channel.session.readSessionUpdatedAtAsync({
				storePath,
				sessionKey: agentSessionKey
			})) {
				log(`feishu[${account.accountId}]: skipping thread bootstrap for existing session ${agentSessionKey}`);
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			let rootMsg = await getRootMessageInfo();
			const feishuThreadId = ctx.threadId ?? rootMsg?.threadId;
			if (rootMsg && !await shouldIncludeFetchedGroupContextMessage({
				...fetchedContextPolicy,
				kind: "thread",
				senderId: rootMsg.senderId,
				senderType: rootMsg.senderType
			})) {
				log(`feishu[${account.accountId}]: skipped thread starter from sender ${rootMsg.senderId ?? "unknown"} (mode=${contextVisibilityMode})`);
				rootMsg = null;
			}
			if (!feishuThreadId) {
				log(`feishu[${account.accountId}]: no threadId found for root message ${ctx.rootId ?? "none"}, skipping thread history`);
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			try {
				const threadMessages = await listFeishuThreadMessages({
					cfg,
					threadId: feishuThreadId,
					currentMessageId: ctx.messageId,
					rootMessageId: ctx.rootId,
					limit: 20,
					accountId: account.accountId
				});
				const senderScoped = groupSession?.groupSessionScope === "group_topic_sender";
				const senderIds = new Set([ctx.senderOpenId, senderUserId].filter((id) => Boolean(id)));
				const allowlistedMessages = (await Promise.all(threadMessages.map(async (message) => await shouldIncludeFetchedGroupContextMessage({
					...fetchedContextPolicy,
					kind: "history",
					senderId: message.senderId,
					senderType: message.senderType
				}) ? message : void 0))).filter((message) => message !== void 0);
				const relevantMessages = senderScoped ? allowlistedMessages.filter((msg) => msg.senderType === "app" || msg.senderId !== void 0 && senderIds.has(msg.senderId.trim())) : allowlistedMessages;
				const threadStarterBody = rootMsg?.content ?? relevantMessages[0]?.content;
				const historyParts = (Boolean(rootMsg?.content || ctx.rootId) ? relevantMessages : relevantMessages.slice(1)).map((msg) => {
					const role = msg.senderType === "app" ? "assistant" : "user";
					return formatAgentEnvelope({
						channel: "Feishu",
						from: `${msg.senderId ?? "Unknown"} (${role})`,
						timestamp: msg.createTime,
						body: msg.content,
						envelope: envelopeOptions
					});
				});
				threadContext.threadStarterBody = threadStarterBody;
				threadContext.threadHistoryBody = historyParts.length > 0 ? historyParts.join("\n\n") : void 0;
			} catch (err) {
				log(`feishu[${account.accountId}]: failed to fetch thread history: ${String(err)}`);
			}
			threadContextBySessionKey.set(agentSessionKey, threadContext);
			return threadContext;
		};
		const buildCtxPayloadForAgent = async (agentId, agentSessionKey, agentAccountId, wasMentioned) => {
			const groupName = await resolveGroupNameForLabel();
			const threadContext = await resolveThreadContextForAgent(agentId, agentSessionKey, groupName);
			const contextBinding = {
				agentId,
				sessionKey: agentSessionKey,
				nativeChannelId: ctx.chatId,
				messageId: ctx.messageId,
				inboundEventKind: "user_request"
			};
			const boundChannelIngress = isGroup ? await resolveFeishuGroupSenderActivationIngressAccess({
				cfg: effectiveCfg,
				accountId: account.accountId,
				chatId: ctx.chatId,
				allowFrom: effectiveGroupSenderAllowFrom,
				senderOpenId: ctx.senderOpenId,
				senderUserId,
				requireMention,
				mentionedBot: ctx.mentionedBot,
				contextBinding,
				threadId: ctx.rootId && isTopicSession ? ctx.rootId : void 0
			}) : await resolveFeishuDmIngressAccess({
				cfg: effectiveCfg,
				accountId: account.accountId,
				dmPolicy: effectiveDmPolicy,
				allowFrom: effectiveConfigAllowFrom,
				readAllowFromStore: pairing.readAllowFromStore,
				senderOpenId: ctx.senderOpenId,
				senderUserId,
				conversationId: ctx.chatId,
				mayPair: false,
				contextBinding
			});
			return core.channel.inbound.buildContext({
				channelIngress: boundChannelIngress,
				channel: "feishu",
				supplemental: {
					quote: quotedContent ? {
						id: ctx.parentId,
						body: quotedContent
					} : void 0,
					thread: {
						starterBody: threadContext.threadStarterBody,
						historyBody: threadContext.threadHistoryBody,
						label: threadContext.threadLabel
					},
					groupSystemPrompt: isGroup ? normalizeOptionalString(groupConfig?.systemPrompt) : void 0
				},
				media: inboundMedia,
				messageId: ctx.messageId,
				timestamp: messageCreateTimeMs,
				from: feishuFrom,
				sender: {
					id: ctx.senderOpenId,
					name: ctx.senderName ?? ctx.senderOpenId,
					isBot: ctx.senderType === "bot"
				},
				conversation: {
					kind: isGroup ? "group" : "direct",
					id: ctx.chatId,
					routePeer: {
						kind: isGroup ? "group" : "direct",
						id: peerId
					},
					nativeChannelId: ctx.chatId,
					parentId: parentPeer?.id,
					label: isGroup && groupName && !isTopicSession ? groupName : void 0,
					threadId: ctx.rootId && isTopicSession ? ctx.rootId : void 0
				},
				route: {
					...route,
					agentId,
					accountId: agentAccountId,
					routeSessionKey: agentSessionKey
				},
				reply: {
					to: feishuTo,
					replyToId: ctx.parentId,
					messageThreadId: ctx.rootId && isTopicSession ? ctx.rootId : void 0
				},
				command: {
					kind: core.channel.commands.isControlCommandMessage(effectiveCommandProbeBody, effectiveCfg) ? "text-slash" : "normal",
					body: effectiveCommandProbeBody,
					authorized: commandAuthorized === true
				},
				message: {
					body: combinedBody,
					bodyForAgent: messageBody,
					inboundHistory,
					rawBody: commandFacingContent,
					commandBody: effectiveCommandProbeBody
				},
				sessionTranscript: { historyLimit: isGroup ? historyLimit : 0 },
				access: {
					mentions: {
						canDetectMention: isGroup,
						wasMentioned,
						requireMention
					},
					commands: { authorized: commandAuthorized === true }
				},
				extra: {
					RootMessageId: ctx.rootId,
					Transcript: audioTranscript,
					GroupSubject: isGroup ? groupName || ctx.chatId : void 0
				}
			});
		};
		const configReplyInThread = isGroup && (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled";
		const topicReplyTargetMessageId = ctx.rootId ?? defaultReplyTargetMessageId;
		const replyTargetMessageId = directThreadReply ? directThreadReplyTargetMessageId : isTopicSession || configReplyInThread ? topicReplyTargetMessageId : defaultReplyTargetMessageId;
		if (isGroup && commandAuthorized === false && core.channel.commands.isControlCommandMessage(effectiveCommandProbeBody, effectiveCfg)) {
			await sendMessageFeishu({
				cfg: effectiveCfg,
				to: feishuReplyTarget,
				text: "You are not authorized to use this command. Ask an admin to add your user ID to the Feishu allowFrom list (or this group's allowFrom).",
				replyToMessageId: replyTargetMessageId,
				replyInThread,
				mentions: requiredMentionTargets,
				accountId: account.accountId
			});
			return;
		}
		const typingTargetMessageId = ctx.typingTargetMessageId ?? (ctx.suppressReplyTarget ? void 0 : ctx.messageId);
		const threadReply = isGroup ? groupSession?.threadReply ?? false : directThreadReply;
		const lastRouteThreadId = isGroup && (isTopicSession || configReplyInThread || threadReply) ? replyTargetMessageId : void 0;
		const pinnedMainDmOwner = !isGroup ? resolvePinnedMainDmOwnerFromAllowlist({
			dmScope: effectiveCfg.session?.dmScope,
			allowFrom: effectiveConfigAllowFrom,
			normalizeEntry: normalizeFeishuAllowEntry
		}) : null;
		const pinnedMainDmSenderRecipient = pinnedMainDmOwner ? [ctx.senderOpenId, senderUserId].map((id) => id ? normalizeFeishuAllowEntry(id) : "").find((recipient) => recipient === pinnedMainDmOwner) : void 0;
		const buildFeishuInboundLastRouteUpdate = (paramsLocal) => {
			const inboundLastRouteSessionKey = paramsLocal.sessionKey === route.sessionKey ? resolveInboundLastRouteSessionKey({
				route,
				sessionKey: paramsLocal.sessionKey
			}) : paramsLocal.sessionKey;
			return {
				sessionKey: inboundLastRouteSessionKey,
				channel: "feishu",
				to: feishuTo,
				accountId: paramsLocal.accountId,
				...lastRouteThreadId ? { threadId: lastRouteThreadId } : {},
				mainDmOwnerPin: !isGroup && inboundLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner ? {
					ownerRecipient: pinnedMainDmOwner,
					senderRecipient: pinnedMainDmSenderRecipient ?? feishuTo,
					onSkip: (skipParams) => {
						log(`feishu[${account.accountId}]: skip main-session last route for ${skipParams.senderRecipient} (pinned owner ${skipParams.ownerRecipient})`);
					}
				} : void 0
			};
		};
		const createAgentReplyDispatcher = (agentParams) => createFeishuReplyDispatcher({
			...agentParams,
			runtime,
			chatId: ctx.chatId,
			sendTarget: feishuReplyTarget,
			replyToMessageId: replyTargetMessageId,
			typingTargetMessageId,
			skipReplyToInMessages: !isGroup && !directThreadReply,
			replyInThread,
			rootId: ctx.rootId,
			threadReply,
			accountId: account.accountId,
			mentionTargets: ctx.mentionTargets,
			requiredMentionTargets,
			messageCreateTimeMs
		});
		const runAgentTurn = (ctxPayload, resolveTurn) => core.channel.inbound.run({
			channel: "feishu",
			accountId: route.accountId,
			raw: ctx,
			adapter: {
				ingest: () => ({
					id: ctx.messageId,
					timestamp: messageCreateTimeMs,
					rawText: ctx.content,
					textForAgent: ctxPayload.BodyForAgent,
					textForCommands: ctxPayload.CommandBody,
					raw: ctx
				}),
				resolveTurn
			}
		});
		if (broadcastAgents) {
			const broadcastDedupeKey = messageDedupeKey ?? ctx.messageId;
			const broadcastClaim = await claimUnprocessedFeishuMessage({
				messageId: broadcastDedupeKey,
				namespace: "broadcast",
				log
			});
			if (broadcastClaim.kind === "duplicate" || broadcastClaim.kind === "inflight") {
				log(`feishu[${account.accountId}]: broadcast already claimed by another account for message ${ctx.messageId}; skipping`);
				return;
			}
			const broadcastSettlement = createFeishuBroadcastIngressSettlement({
				trackTask: params.trackTask,
				lifecycle: turnAdoptionLifecycle,
				replayClaim: broadcastClaim.kind === "claimed" ? broadcastClaim.handle : void 0,
				onReplayCommitError: (err) => error(`feishu[${account.accountId}]: failed to commit broadcast replay guard: ${String(err)}`),
				onAdopted: () => {
					if (isGroup && historyKey && chatHistories) createChannelHistoryWindow({ historyMap: chatHistories }).clear({
						historyKey,
						limit: historyLimit
					});
				}
			});
			const abandonBroadcast = async (err) => {
				try {
					await broadcastSettlement.onDispatchFailed(err);
				} catch (abandonError) {
					error(`feishu[${account.accountId}]: failed to abandon broadcast ingress: ${String(abandonError)}`);
				}
			};
			const strategy = cfg.broadcast?.strategy === "sequential" ? "sequential" : "parallel";
			const activeAgentId = ctx.mentionedBot || !requireMention ? normalizeAgentId$1(route.agentId) : null;
			const agentIds = Object.keys(cfg.agents?.entries ?? {}).map(normalizeAgentId$1);
			const hasKnownAgents = agentIds.length > 0;
			const dispatchForAgent = async (agentId) => {
				if (hasKnownAgents && !agentIds.includes(agentId)) {
					log(`feishu[${account.accountId}]: broadcast agent ${agentId} not found in agents.entries; skipping`);
					return;
				}
				const agentClaim = await claimFeishuBroadcastAgentMessage({
					messageId: broadcastDedupeKey,
					agentId,
					log,
					onPending: broadcastSettlement.onLanePending
				});
				if (!agentClaim) return;
				const lane = broadcastSettlement.createLane(agentClaim.kind === "claimed" ? agentClaim.handle : void 0);
				try {
					if (agentId !== activeAgentId && core.channel.commands.isControlCommandMessage(effectiveCommandProbeBody, effectiveCfg)) {
						await lane.lifecycle.onAdopted();
						return;
					}
					const agentSessionKey = buildBroadcastSessionKey(route.sessionKey, route.agentId, agentId);
					const agentStorePath = resolveStorePath(cfg.session?.store, { agentId });
					const agentRecord = {
						updateLastRoute: buildFeishuInboundLastRouteUpdate({
							sessionKey: agentSessionKey,
							accountId: route.accountId
						}),
						onRecordError: (err) => {
							log(`feishu[${account.accountId}]: failed to record broadcast inbound session ${agentSessionKey}: ${String(err)}`);
						}
					};
					const allowReasoningPreview = await resolveFeishuReasoningPreviewEnabled({
						cfg,
						agentId,
						storePath: agentStorePath,
						sessionKey: agentSessionKey
					});
					const agentCtx = await buildCtxPayloadForAgent(agentId, agentSessionKey, route.accountId, ctx.mentionedBot && agentId === activeAgentId);
					const dispatcher = agentId === activeAgentId ? createAgentReplyDispatcher({
						cfg,
						agentId,
						allowReasoningPreview,
						identity: resolveAgentOutboundIdentity(cfg, agentId),
						sessionKey: agentSessionKey
					}) : void 0;
					if (!dispatcher) {
						agentCtx.CommandAuthorized = false;
						delete agentCtx.CommandTurn;
						delete agentCtx.CommandSource;
					}
					const turnResult = await runAgentTurn(agentCtx, () => ({
						cfg,
						channel: "feishu",
						accountId: route.accountId,
						route: {
							agentId,
							sessionKey: agentSessionKey
						},
						ctxPayload: agentCtx,
						record: agentRecord,
						...!dispatcher ? {
							admission: {
								kind: "observeOnly",
								reason: "broadcast-observer"
							},
							delivery: { deliver: async () => ({ visibleReplySent: false }) },
							replyOptions: bindIngressLifecycleToReplyOptions(lane.lifecycle)
						} : {
							dispatcherOptions: dispatcher.dispatcherOptions,
							delivery: dispatcher.delivery,
							replyOptions: {
								...dispatcher.replyOptions,
								...bindIngressLifecycleToReplyOptions(lane.lifecycle)
							}
						}
					}));
					if (dispatcher && turnResult.dispatched && shouldSendNoVisibleReplyFallback(turnResult.dispatchResult)) await dispatcher.ensureNoVisibleReplyFallback("broadcast-dispatch-complete-no-visible-reply");
					await lane.onDispatchComplete(turnResult.dispatched);
				} catch (err) {
					await lane.onDispatchFailed(err);
					throw err;
				}
			};
			const results = [];
			if (strategy === "sequential") for (const agentId of broadcastAgents) try {
				await dispatchForAgent(agentId);
				results.push({
					status: "fulfilled",
					value: void 0
				});
			} catch (reason) {
				results.push({
					status: "rejected",
					reason
				});
			}
			else results.push(...await Promise.allSettled(broadcastAgents.map(dispatchForAgent)));
			const failures = [];
			for (const [i, result] of results.entries()) if (result.status === "rejected") {
				const agentId = broadcastAgents.at(i);
				if (agentId === void 0) continue;
				log(`feishu[${account.accountId}]: broadcast dispatch failed for agent=${agentId}: ${String(result.reason)}`);
				failures.push(result.reason);
			}
			if (failures.length > 0) {
				const failure = failures.length === 1 ? failures[0] : new AggregateError(failures, "Feishu broadcast dispatch failed");
				await abandonBroadcast(failure);
				throw failure;
			}
			try {
				await broadcastSettlement.onDispatchComplete();
			} catch (err) {
				await abandonBroadcast(err);
				throw err;
			}
		} else {
			const ctxPayload = await buildCtxPayloadForAgent(route.agentId, route.sessionKey, route.accountId, ctx.mentionedBot);
			const identity = resolveAgentOutboundIdentity(effectiveCfg, route.agentId);
			const storePath = resolveStorePath(effectiveCfg.session?.store, { agentId: route.agentId });
			const allowReasoningPreview = await resolveFeishuReasoningPreviewEnabled({
				cfg: effectiveCfg,
				agentId: route.agentId,
				storePath,
				sessionKey: route.sessionKey
			});
			const { dispatcherOptions, delivery, replyOptions, ensureNoVisibleReplyFallback } = createAgentReplyDispatcher({
				cfg: effectiveCfg,
				agentId: route.agentId,
				allowReasoningPreview,
				identity,
				sessionKey: route.sessionKey
			});
			const turnResult = await runAgentTurn(ctxPayload, () => ({
				cfg: effectiveCfg,
				channel: "feishu",
				accountId: route.accountId,
				route: {
					agentId: route.agentId,
					sessionKey: route.sessionKey
				},
				ctxPayload,
				record: {
					updateLastRoute: buildFeishuInboundLastRouteUpdate({
						sessionKey: route.sessionKey,
						accountId: route.accountId
					}),
					onRecordError: (err) => {
						log(`feishu[${account.accountId}]: failed to record inbound session ${route.sessionKey}: ${String(err)}`);
					}
				},
				history: {
					isGroup,
					historyKey,
					historyMap: chatHistories,
					limit: historyLimit
				},
				dispatcherOptions,
				delivery,
				replyOptions: {
					...replyOptions,
					...turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(turnAdoptionLifecycle) : {}
				}
			}));
			if (!turnResult.dispatched) return;
			const { dispatchResult } = turnResult;
			if (shouldSendNoVisibleReplyFallback(dispatchResult)) await ensureNoVisibleReplyFallback("dispatch-complete-no-visible-reply");
		}
	} catch (err) {
		if (turnAdoptionLifecycle) throw err;
		error(`feishu[${account.accountId}]: failed to dispatch message: ${String(err)}`);
	}
}
// extensions/feishu/src/card-action-state.ts
const TOKEN_TTL_MS = 9e5;
const cardActionReplayGuard = createChannelReplayGuard({
	dedupe: {
		pluginId: "feishu",
		namespacePrefix: "feishu.card-actions",
		ttlMs: TOKEN_TTL_MS,
		memoryMaxSize: 1e3,
		stateMaxEntries: 1e4
	},
	buildReplayKey: (token) => resolveExpiresAtMsFromDurationMs(TOKEN_TTL_MS) === void 0 ? void 0 : token
});
const resolvedCardActionChatTypes = /* @__PURE__ */ new Map();
// extensions/feishu/src/card-ux-shared.ts
function buildFeishuActionCard(params) {
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		header: {
			title: {
				tag: "plain_text",
				content: params.title
			},
			template: params.template
		},
		body: { elements: [{
			tag: "markdown",
			content: params.content
		}, {
			tag: "column_set",
			flex_mode: "none",
			horizontal_spacing: "default",
			columns: params.actions.map((button) => ({
				tag: "column",
				width: "auto",
				vertical_align: "center",
				elements: [button]
			}))
		}] }
	};
}
function buildFeishuCardButton(params) {
	return {
		tag: "button",
		text: {
			tag: "plain_text",
			content: params.label
		},
		type: params.type ?? "default",
		value: params.value
	};
}
function buildFeishuCardInteractionContext(params) {
	return {
		u: params.operatorOpenId,
		...params.chatId ? { h: params.chatId } : {},
		...params.sessionKey ? { s: params.sessionKey } : {},
		e: params.expiresAt,
		...params.chatType ? { t: params.chatType } : {}
	};
}
// extensions/feishu/src/card-ux-approval.ts
const FEISHU_APPROVAL_REQUEST_ACTION = "feishu.quick_actions.request_approval";
const FEISHU_APPROVAL_CONFIRM_ACTION = "feishu.approval.confirm";
const FEISHU_APPROVAL_CANCEL_ACTION = "feishu.approval.cancel";
function createApprovalCard(params) {
	const context = buildFeishuCardInteractionContext(params);
	return buildFeishuActionCard({
		title: "Confirm action",
		template: "orange",
		content: params.prompt,
		actions: [buildFeishuCardButton({
			label: params.confirmLabel ?? "Confirm",
			type: "primary",
			value: createFeishuCardInteractionEnvelope({
				k: "quick",
				a: FEISHU_APPROVAL_CONFIRM_ACTION,
				q: params.command,
				c: context
			})
		}), buildFeishuCardButton({
			label: "Cancel",
			value: createFeishuCardInteractionEnvelope({
				k: "button",
				a: FEISHU_APPROVAL_CANCEL_ACTION,
				c: context
			})
		})]
	});
}
// extensions/feishu/src/card-action.ts
const FEISHU_APPROVAL_CARD_TTL_MS = 3e5;
function pruneExpiredCardEntries(cache, now) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) {
		cache.clear();
		return;
	}
	for (const [key, entry] of cache) if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: validNow })) cache.delete(key);
}
const CHAT_TYPE_CACHE_TTL_MS = 18e5;
const CHAT_TYPE_CACHE_MAX_SIZE = 5e3;
async function handleFeishuCardAction(params) {
	const { cfg, event, runtime, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	const log = runtime?.log ?? console.log;
	const chatId = event.context.chat_id?.trim();
	const callbackTarget = chatId ? `chat:${chatId}` : `user:${event.operator.open_id}`;
	let commandDispatched = false;
	const sendNotice = (text) => sendMessageFeishu({
		cfg,
		to: callbackTarget,
		text,
		accountId
	});
	async function resolveCardActionChatType(chatType) {
		if (chatType) return chatType;
		if (!chatId) return "p2p";
		const cacheKey = `${account.accountId}:${chatId}`;
		const now = Date.now();
		pruneExpiredCardEntries(resolvedCardActionChatTypes, now);
		pruneMapToMaxSize(resolvedCardActionChatTypes, CHAT_TYPE_CACHE_MAX_SIZE);
		const cached = resolvedCardActionChatTypes.get(cacheKey);
		if (cached) return cached.value;
		try {
			const response = await createFeishuClient(account).im.chat.get({ path: { chat_id: chatId } });
			if (response.code === 0) {
				const resolvedChatType = resolveFeishuChatType(response.data ?? {});
				if (resolvedChatType) {
					const expiresAt = resolveExpiresAtMsFromDurationMs(CHAT_TYPE_CACHE_TTL_MS, { nowMs: now });
					if (expiresAt !== void 0) resolvedCardActionChatTypes.set(cacheKey, {
						value: resolvedChatType,
						expiresAt
					});
					return resolvedChatType;
				}
			}
		} catch {}
		log(`feishu[${account.accountId}]: card action chat type unavailable; action refused`);
		await sendNotice("⚠️ Could not verify this chat's conversation type, so this action was not run. Try clicking again later.");
	}
	async function dispatchSyntheticCommand(command, chatType) {
		const { trackTask, botOpenId, channelRuntime } = params;
		const resolvedChatType = await resolveCardActionChatType(chatType);
		if (!resolvedChatType) return;
		function buildSyntheticMessageEvent(knownChatType) {
			const replyTargetMessageId = event.context.open_message_id ?? event.open_message_id;
			const isTemporaryCardActionId = replyTargetMessageId?.startsWith("card-action-c-");
			const validReplyTargetId = replyTargetMessageId && !isTemporaryCardActionId ? replyTargetMessageId : void 0;
			const normalizedBotOpenId = knownChatType === "group" ? botOpenId?.trim() : void 0;
			return {
				sender: { sender_id: {
					open_id: event.operator.open_id,
					user_id: event.operator.user_id,
					union_id: event.operator.union_id
				} },
				message: {
					message_id: `card-action-${event.token}`,
					...validReplyTargetId ? { reply_target_message_id: validReplyTargetId } : {},
					...validReplyTargetId ? { typing_target_message_id: validReplyTargetId } : {},
					...!validReplyTargetId ? { suppress_reply_target: true } : {},
					chat_id: event.context.chat_id || event.operator.open_id,
					chat_type: knownChatType,
					message_type: "text",
					content: JSON.stringify({ text: command }),
					...normalizedBotOpenId ? { mentions: [{
						key: "mention_bot",
						id: { open_id: normalizedBotOpenId },
						name: "bot"
					}] } : {}
				}
			};
		}
		commandDispatched = true;
		await handleFeishuMessage({
			trackTask,
			cfg,
			event: buildSyntheticMessageEvent(resolvedChatType),
			botOpenId,
			runtime,
			channelRuntime,
			accountId
		});
	}
	const sendInvalidInteractionNotice = async (reason) => {
		await sendNotice(`⚠️ ${reason === "stale" ? "This card action has expired. Open a fresh launcher card and try again." : reason === "wrong_user" ? "This card action belongs to a different user." : reason === "wrong_conversation" ? "This card action belongs to a different conversation." : "This card action payload is invalid."}`);
	};
	const normalizedToken = event.token.trim();
	if (!normalizedToken) {
		log(`feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: missing token`);
		return;
	}
	const decoded = decodeFeishuCardAction(event);
	const claim = await cardActionReplayGuard.claim(normalizedToken, {
		namespace: account.accountId,
		onDiskError: (error) => log(`feishu-card-action: persistent state error: ${String(error)}`)
	});
	if (claim.kind === "duplicate" || claim.kind === "inflight") {
		log(`feishu[${account.accountId}]: skipping duplicate card action token`);
		return;
	}
	try {
		if (decoded.kind === "invalid") {
			log(`feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: ${decoded.reason}`);
			await sendInvalidInteractionNotice(decoded.reason);
			return;
		}
		if (decoded.kind === "structured") {
			const { envelope } = decoded;
			log(`feishu[${account.accountId}]: handling structured card action ${envelope.a} from ${event.operator.open_id}`);
			if (envelope.a === "feishu.quick_actions.request_approval") {
				const command = typeof envelope.m?.command === "string" ? envelope.m.command.trim() : "";
				if (!command) {
					await sendInvalidInteractionNotice("malformed");
					return;
				}
				const prompt = typeof envelope.m?.prompt === "string" && envelope.m.prompt.trim() ? envelope.m.prompt : `Run \`${command}\` in this Feishu conversation?`;
				const expiresAt = resolveExpiresAtMsFromDurationMs(FEISHU_APPROVAL_CARD_TTL_MS);
				if (expiresAt === void 0) {
					await sendInvalidInteractionNotice("malformed");
					return;
				}
				const chatType = await resolveCardActionChatType(envelope.c?.t);
				if (!chatType) return;
				await sendCardFeishu({
					cfg,
					to: callbackTarget,
					card: createApprovalCard({
						operatorOpenId: event.operator.open_id,
						chatId: event.context.chat_id || void 0,
						command,
						prompt,
						sessionKey: envelope.c?.s,
						expiresAt,
						chatType,
						confirmLabel: command === "/reset" ? "Reset" : "Confirm"
					}),
					accountId
				});
				return;
			}
			if (envelope.a === "feishu.approval.cancel") {
				await sendNotice("Cancelled.");
				return;
			}
			if (envelope.a === "feishu.approval.confirm" || envelope.k === "quick") {
				const command = envelope.q?.trim();
				if (!command) {
					await sendInvalidInteractionNotice("malformed");
					return;
				}
				await dispatchSyntheticCommand(agentControlText(command) ?? command, envelope.c?.t);
				return;
			}
			await sendInvalidInteractionNotice("malformed");
			return;
		}
		await dispatchSyntheticCommand(decoded.text);
	} catch (error) {
		if (claim.kind === "claimed" && !commandDispatched) claim.handle.release({ error });
		throw error;
	} finally {
		if (claim.kind === "claimed") await claim.handle.commit();
	}
}
// extensions/feishu/src/feishu-ingress.ts
const FEISHU_INGRESS_PAYLOAD_VERSION = 1;
const FEISHU_INGRESS_POLL_INTERVAL_MS = 500;
const FEISHU_DURABLE_EVENT_TYPES = /* @__PURE__ */ new Set(["drive.notice.comment_add_v1", "im.message.receive_v1"]);
const FeishuIngressPermanentError = createChannelIngressError("FeishuIngressPermanentError", { withReason: true });
function parseRawEnvelope(rawEnvelope) {
	let parsed;
	try {
		parsed = JSON.parse(rawEnvelope);
	} catch (error) {
		throw new FeishuIngressPermanentError("invalid-event", "Feishu ingress envelope contains invalid JSON.", { cause: error });
	}
	if (!isRecord$1(parsed)) throw new FeishuIngressPermanentError("invalid-event", "Feishu ingress envelope must be a JSON object.");
	return parsed;
}
function decryptEnvelope(envelope, encryptKey) {
	const encrypted = normalizeNullableString(envelope.encrypt);
	if (!encrypted) return envelope;
	const key = encryptKey?.trim();
	if (!key) throw new FeishuIngressPermanentError("authentication-failed", "Feishu encrypted ingress envelope has no configured encrypt key.");
	try {
		return parseRawEnvelope(new Lark.AESCipher(key).decrypt(encrypted));
	} catch (error) {
		if (error instanceof FeishuIngressPermanentError) throw error;
		throw new FeishuIngressPermanentError("authentication-failed", "Feishu ingress envelope decryption failed.", { cause: error });
	}
}
function inspectFeishuIngressEnvelope(rawEnvelope, encryptKey, allowInvalidLane = false) {
	const envelope = decryptEnvelope(parseRawEnvelope(rawEnvelope), encryptKey);
	const nestedHeader = isRecord$1(envelope.header) ? envelope.header : null;
	const nestedEvent = isRecord$1(envelope.event) ? envelope.event : null;
	const eventType = normalizeNullableString(nestedHeader?.event_type) ?? normalizeNullableString(envelope.event_type);
	if (!eventType || !FEISHU_DURABLE_EVENT_TYPES.has(eventType)) return null;
	const eventId = normalizeNullableString(nestedHeader?.event_id) ?? normalizeNullableString(envelope.event_id);
	if (!eventId) throw new FeishuIngressPermanentError("invalid-event", `Feishu ${eventType} envelope is missing header.event_id.`);
	const event = nestedEvent ?? envelope;
	const missingLane = (message) => {
		if (allowInvalidLane) return {
			eventId,
			laneKey: `invalid:${eventType}:${eventId}`
		};
		throw new FeishuIngressPermanentError("invalid-event", message);
	};
	if (eventType === "im.message.receive_v1") {
		const message = isRecord$1(event.message) ? event.message : null;
		const chatId = normalizeNullableString(message?.chat_id);
		if (!chatId) return missingLane("Feishu message ingress envelope is missing event.message.chat_id.");
		return {
			eventId,
			laneKey: `chat:${chatId}`
		};
	}
	const noticeMeta = isRecord$1(event.notice_meta) ? event.notice_meta : null;
	const fileType = normalizeNullableString(noticeMeta?.file_type);
	const documentId = normalizeNullableString(noticeMeta?.file_token);
	if (!fileType || !documentId) return missingLane("Feishu comment ingress envelope is missing its document identity.");
	return {
		eventId,
		laneKey: `comment-doc:${fileType}:${documentId}`
	};
}
function resolveFeishuIngressNonRetryableFailure(error) {
	if (error instanceof FeishuIngressPermanentError) return {
		reason: error.reason,
		message: error.message
	};
	for (const candidate of collectErrorGraphCandidates(error, (current) => [current.cause, current.response])) {
		const status = isRecord$1(candidate) ? candidate.status : void 0;
		if (status === 401 || status === 403) return {
			reason: "authentication-failed",
			message: formatErrorMessage(error)
		};
	}
	return null;
}
/** Fan one merged Feishu turn's adoption across every transport and logical claim. */
function buildFeishuFlushIngressLifecycle(sources, options) {
	const durableSources = sources.filter((source) => source.lifecycle !== void 0);
	const lifecycles = durableSources.map((source) => source.lifecycle);
	const replayClaims = durableSources.map((source) => source.replayClaim).filter((claim) => claim !== void 0);
	const transportLifecycle = fanInChannelIngressLifecycles(lifecycles).lifecycle;
	if (!transportLifecycle) return {
		lifecycle: void 0,
		settle: async () => {}
	};
	let handedOff = false;
	let settled = false;
	const releaseReplayClaims = () => {
		for (const claim of replayClaims) claim.release({ error: /* @__PURE__ */ new Error("feishu-ingress-not-adopted") });
	};
	const abandonAll = async () => {
		if (settled) return;
		settled = true;
		releaseReplayClaims();
		await transportLifecycle.onAbandoned();
	};
	const commitReplayClaims = async () => {
		const results = await Promise.allSettled(replayClaims.map((claim) => claim.commit()));
		for (const result of results) if (result.status === "rejected") options?.onReplayCommitError?.(result.reason);
	};
	const dropAll = async (reason) => {
		if (settled) return;
		settled = true;
		try {
			await transportLifecycle.onDropped?.(reason);
		} catch (error) {
			releaseReplayClaims();
			throw error;
		}
		await commitReplayClaims();
	};
	const adoptAll = async () => {
		if (settled) return;
		settled = true;
		try {
			await transportLifecycle.onAdopted();
		} catch (error) {
			releaseReplayClaims();
			await Promise.resolve(transportLifecycle.onAbandoned()).catch(() => void 0);
			throw error;
		}
		await commitReplayClaims();
	};
	return {
		lifecycle: {
			abortSignal: transportLifecycle.abortSignal,
			onAdopted: async () => {
				handedOff = true;
				const adoption = adoptAll();
				options?.trackTask?.(adoption);
				await adoption;
			},
			onDeferred: () => {
				handedOff = true;
				transportLifecycle.onDeferred();
			},
			onDeferredHeartbeat: () => transportLifecycle.onDeferredHeartbeat?.(),
			deferredHeartbeatIntervalMs: transportLifecycle.deferredHeartbeatIntervalMs,
			onAdoptionFinalizing: () => {
				transportLifecycle.onAdoptionFinalizing();
			},
			onAbandoned: async () => {
				handedOff = true;
				await abandonAll();
			},
			onDropped: transportLifecycle.onDropped ? async (reason) => {
				handedOff = true;
				await dropAll(reason);
			} : void 0
		},
		settle: async () => {
			if (handedOff) return;
			handedOff = true;
			settled = true;
			releaseReplayClaims();
			try {
				transportLifecycle.onAdoptionFinalizing();
				await transportLifecycle.onAdopted();
			} catch (error) {
				await Promise.resolve(transportLifecycle.onAbandoned()).catch(() => void 0);
				throw error;
			}
		}
	};
}
function createFeishuDurableIngress(options) {
	let socketTerminator;
	const activeLifecycles = /* @__PURE__ */ new Map();
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getFeishuRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (rawEnvelope, context) => inspectFeishuIngressEnvelope(rawEnvelope, options.encryptKey, context.phase === "admission"),
		payload: {
			version: FEISHU_INGRESS_PAYLOAD_VERSION,
			serialize: (rawEnvelope, { receivedAt }) => ({
				receivedAt,
				rawEnvelope
			}),
			deserialize: (body) => body.rawEnvelope,
			encode: ({ body }) => ({
				version: FEISHU_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: {
					receivedAt: payload.receivedAt,
					rawEnvelope: payload.rawEnvelope
				}
			}),
			createClaimError: (kind, claim) => new FeishuIngressPermanentError("invalid-event", kind === "invalid-version" ? `Feishu ingress row ${claim.id} has an unsupported version.` : `Feishu ingress row ${claim.id} has invalid delivery identity.`)
		},
		deliver: async (rawEnvelope, lifecycle, claim) => {
			const handoff = createDeferred$1();
			const wrappedLifecycle = {
				...lifecycle,
				onDeferred: () => {
					lifecycle.onDeferred();
					handoff.resolve();
				},
				onAdopted: async () => {
					try {
						await lifecycle.onAdopted();
					} finally {
						handoff.resolve();
					}
				},
				onAbandoned: async () => {
					try {
						await Promise.resolve().then(() => wrappedLifecycle.onBeforeAbandon?.()).catch(() => void 0);
						await lifecycle.onAbandoned();
					} finally {
						handoff.resolve();
					}
				},
				onDropped: async (reason) => {
					try {
						await lifecycle.onDropped?.(reason);
					} finally {
						handoff.resolve();
					}
				}
			};
			activeLifecycles.set(claim.id, wrappedLifecycle);
			try {
				const result = await options.dispatcher.invoke(parseRawEnvelope(rawEnvelope), { needCheck: false });
				if (!isRecord$1(result)) return;
				if (result.kind === "deferred") {
					try {
						await racePromiseWithAbortSignal(handoff.promise, lifecycle.abortSignal);
					} catch (error) {
						await wrappedLifecycle.onAbandoned();
						throw error;
					}
					return { kind: "deferred" };
				}
				if (result.kind === "completed") return { kind: "completed" };
				if (result.kind === "failed-retryable") return {
					kind: "failed-retryable",
					error: result.error
				};
				return;
			} finally {
				if (activeLifecycles.get(claim.id) === wrappedLifecycle) activeLifecycles.delete(claim.id);
			}
		},
		deferredClaims: "wait-on-stop",
		pollIntervalMs: options.pollIntervalMs ?? FEISHU_INGRESS_POLL_INTERVAL_MS,
		retention: "standard",
		drain: {
			deferredLaneOccupancy: "release",
			adoptionStallTimeoutMs: options.adoptionStallTimeoutMs ?? DEFAULT_INGRESS_ADOPTION_STALL_MS,
			resolveNonRetryableFailure: resolveFeishuIngressNonRetryableFailure,
			onLog: (message) => options.runtime.error?.(`feishu ingress: ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("Feishu ingress is stopped."),
		onError: (error) => options.runtime.error?.(`feishu ingress drain failed: ${formatErrorMessage(error)}`)
	});
	const invokeWebhook = async (data, params) => {
		let rawEnvelope;
		try {
			const serialized = JSON.stringify(data);
			if (serialized === void 0) throw new TypeError("Feishu ingress envelope has no JSON representation.");
			rawEnvelope = serialized;
		} catch (error) {
			throw new FeishuIngressPermanentError("invalid-event", "Feishu ingress envelope is not serializable.", { cause: error });
		}
		const facts = inspectFeishuIngressEnvelope(rawEnvelope, options.encryptKey, true);
		if (!facts) return {
			kind: "non-durable",
			value: await options.dispatcher.invoke(data, params)
		};
		try {
			await monitor.admit(rawEnvelope, { facts });
		} catch (error) {
			socketTerminator?.();
			throw error;
		}
		return {
			kind: "durable",
			value: void 0
		};
	};
	const invoke = async (data, params) => (await invokeWebhook(data, params)).value;
	return {
		invoke,
		invokeWebhook,
		resolveLifecycle: (data) => {
			const eventId = isRecord$1(data) ? normalizeNullableString(data.event_id) : null;
			return eventId ? activeLifecycles.get(eventId) : void 0;
		},
		setSocketTerminator: (terminate) => {
			socketTerminator = terminate;
		},
		start: monitor.start,
		stop: async () => {
			await monitor.stop();
			activeLifecycles.clear();
			socketTerminator = void 0;
		},
		waitForIdle: monitor.waitForIdle
	};
}
// extensions/feishu/src/monitor.state.ts
const botOpenIds = /* @__PURE__ */ new Map();
const FEISHU_WEBHOOK_MAX_BODY_BYTES = 65536;
const FEISHU_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const feishuWebhookRateLimiter = createFixedWindowRateLimiter(WEBHOOK_RATE_LIMIT_DEFAULTS);
const feishuWebhookAnomalyTracker = createWebhookAnomalyTracker();
function setFeishuBotIdentityState(accountId, botOpenId) {
	botOpenIds.set(accountId, botOpenId);
}
function clearFeishuBotIdentityState(accountId) {
	botOpenIds.delete(accountId);
}
function recordWebhookStatus(runtime, accountId, path, statusCode) {
	const label = accountId === void 0 ? "feishu" : `feishu[${accountId}]`;
	feishuWebhookAnomalyTracker.record({
		key: `${label}:${path}:${statusCode}`,
		statusCode,
		log: runtime?.log ?? console.log,
		message: (count) => `${label}: webhook anomaly path=${path} status=${statusCode} count=${count}`
	});
}
// extensions/feishu/src/monitor.bot-identity.ts
const BOT_IDENTITY_RETRY_DELAYS_MS = [
	6e4,
	12e4,
	3e5,
	6e5,
	9e5
];
function applyBotIdentityState(accountId, identity) {
	const botOpenId = identity.botOpenId;
	setFeishuBotIdentityState(accountId, botOpenId ?? "");
	return botOpenId;
}
async function retryBotIdentityProbe(account, accountId, runtime, abortSignal) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	for (const [i, delayMs] of BOT_IDENTITY_RETRY_DELAYS_MS.entries()) {
		if (abortSignal?.aborted) return;
		if (!await waitForAbortableDelay(delayMs, abortSignal)) return;
		const identity = await fetchBotIdentityForMonitor(account, {
			runtime,
			abortSignal,
			allowCachedFallback: false
		});
		if (identity.botOpenId && identity.source === "provider") {
			log(`feishu[${accountId}]: bot open_id recovered via background retry: ${applyBotIdentityState(accountId, identity)}`);
			return;
		}
		const nextDelay = BOT_IDENTITY_RETRY_DELAYS_MS[i + 1];
		error(`feishu[${accountId}]: bot identity background retry ${i + 1}/${BOT_IDENTITY_RETRY_DELAYS_MS.length} failed` + (nextDelay ? `; next attempt in ${nextDelay / 1e3}s` : ""));
	}
	error(`feishu[${accountId}]: bot identity background retry exhausted; requireMention group messages may be skipped until restart`);
}
function startBotIdentityRecovery(params) {
	const { account, accountId, runtime, abortSignal, currentSource } = params;
	const log = runtime?.log ?? console.log;
	log(`feishu[${accountId}]: bot open_id ${currentSource === "cache" ? "loaded from cache" : "unknown"}; starting background provider refresh (delays: ${BOT_IDENTITY_RETRY_DELAYS_MS.map((delay) => `${delay / 1e3}s`).join(", ")})`);
	if (currentSource !== "cache") log(`feishu[${accountId}]: requireMention group messages stay gated until bot identity recovery succeeds`);
	retryBotIdentityProbe(account, accountId, runtime, abortSignal).catch((err) => {
		(runtime?.error ?? console.error)(`feishu[${accountId}]: bot identity background retry failed unexpectedly: ${String(err)}`);
	});
}
// extensions/feishu/src/monitor.comment.ts
const FEISHU_COMMENT_VERIFY_TIMEOUT_MS = 3e3;
const FEISHU_COMMENT_PAGE_SIZE = 100;
const FEISHU_COMMENT_PAGE_LIMIT = 5;
const FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS = 1e3;
const FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT = 6;
const FEISHU_COMMENT_THREAD_PROMPT_LIMIT = 20;
const FEISHU_WHOLE_COMMENT_PROMPT_LIMIT = 12;
const FEISHU_PROMPT_TEXT_LIMIT = 220;
function truncatePromptText(text) {
	const normalized = normalizeOptionalString(text);
	if (!normalized) return "";
	return normalized.length > FEISHU_PROMPT_TEXT_LIMIT ? `${sliceUtf16Safe(normalized, 0, 219)}…` : normalized;
}
function formatPromptTextValue(text) {
	return JSON.stringify(truncatePromptText(text));
}
function compareCommentTimelineEntries(left, right, stableId) {
	const leftTime = left.createTime ?? Number.MAX_SAFE_INTEGER;
	const rightTime = right.createTime ?? Number.MAX_SAFE_INTEGER;
	if (leftTime !== rightTime) return leftTime - rightTime;
	return (stableId(left) ?? "").localeCompare(stableId(right) ?? "");
}
function formatLinkedDocumentsInlineSummary(linkedDocuments) {
	if (linkedDocuments.length === 0) return "none";
	return linkedDocuments.map((link) => `${link.resolvedObjType ?? link.urlKind}:${link.resolvedObjToken ?? link.wikiNodeToken ?? "UNKNOWN"}`).join(",");
}
async function resolveParsedCommentContent(params) {
	const parsed = parseCommentContentElements({
		elements: params.elements,
		botOpenIds: params.botOpenIds,
		currentDocument: params.currentDocument
	});
	if (!parsed.linkedDocuments.some((link) => link.urlKind === "wiki" && link.wikiNodeToken)) return parsed;
	const resolvedLinkedDocuments = await Promise.all(parsed.linkedDocuments.map(async (link) => {
		if (link.urlKind !== "wiki" || !link.wikiNodeToken) return link;
		let pending = params.wikiCache.get(link.wikiNodeToken);
		if (!pending) {
			pending = params.client.wiki.space.getNode({ params: { token: link.wikiNodeToken } }).then((response) => {
				if (response.code !== 0) {
					params.logger?.(`feishu[${params.accountId}]: wiki link resolution failed token=${link.wikiNodeToken} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"}`);
					return null;
				}
				const objType = normalizeCommentFileType(response.data?.node?.obj_type);
				const objToken = normalizeOptionalString(response.data?.node?.obj_token);
				if (!objType || !objToken) return null;
				return {
					resolvedObjType: objType,
					resolvedObjToken: objToken
				};
			}).catch((error) => {
				params.logger?.(`feishu[${params.accountId}]: wiki link resolution threw token=${link.wikiNodeToken} error=${formatErrorMessage(error)}`);
				return null;
			});
			params.wikiCache.set(link.wikiNodeToken, pending);
		}
		const resolved = await pending;
		if (!resolved) return link;
		return {
			...link,
			resolvedObjType: resolved.resolvedObjType,
			resolvedObjToken: resolved.resolvedObjToken,
			isCurrentDocument: resolved.resolvedObjType === params.currentDocument.fileType && resolved.resolvedObjToken === params.currentDocument.fileToken
		};
	}));
	return {
		...parsed,
		linkedDocuments: resolvedLinkedDocuments
	};
}
async function fetchDriveCommentPages(params) {
	const errorLabel = params.kind === "whole-comments" ? `feishu[${params.accountId}]: failed to list drive comments for ${params.fileToken}` : `feishu[${params.accountId}]: failed to fetch comment replies for ${params.commentId}`;
	const items = [];
	let pageToken;
	for (let page = 0; page < FEISHU_COMMENT_PAGE_LIMIT; page += 1) {
		const commentsUrl = `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments`;
		const url = params.kind === "whole-comments" ? commentsUrl : `${commentsUrl}/${encodeURIComponent(params.commentId)}/replies`;
		const query = {
			file_type: params.fileType,
			...params.kind === "whole-comments" ? { is_whole: "true" } : {},
			page_size: String(FEISHU_COMMENT_PAGE_SIZE),
			page_token: pageToken,
			user_id_type: "open_id"
		};
		const response = await requestFeishuOpenApi({
			...params,
			method: "GET",
			url: url + encodeQuery(query),
			errorLabel
		});
		if (response?.code !== 0) {
			if (response) params.logger?.(`${errorLabel}: ${response.msg ?? "unknown error"} log_id=${response.log_id?.trim() || "unknown"}`);
			break;
		}
		items.push(...response.data?.items ?? []);
		if (response.data?.has_more !== true || !response.data.page_token?.trim()) break;
		pageToken = response.data.page_token.trim();
	}
	return items;
}
async function requestFeishuOpenApi(params) {
	const result = await raceWithTimeoutAndAbort(params.client.request({
		method: params.method,
		url: params.url,
		data: params.data ?? {},
		timeout: params.timeoutMs
	}), { timeoutMs: params.timeoutMs }).then((resolved) => resolved.status === "resolved" ? resolved.value : null).catch((error) => {
		params.logger?.(`${params.errorLabel}: ${formatFeishuApiError(error)}`);
		return null;
	});
	if (!result) params.logger?.(`${params.errorLabel}: request timed out or returned no data`);
	return result;
}
function selectNearbyEntries(entries, currentIndex, selected, limit) {
	for (let radius = 1; selected.size < limit; radius += 1) {
		const before = currentIndex - radius;
		const after = currentIndex + radius;
		if (before >= 0) selected.add(before);
		if (selected.size >= limit) break;
		if (after < entries.length) selected.add(after);
		if (before < 0 && after >= entries.length) break;
	}
	return [...selected].toSorted((left, right) => left - right).map((index) => entries[index]).filter((entry) => Boolean(entry));
}
function findNearestBotTimelineEntry(params) {
	const step = params.direction === "after" ? 1 : -1;
	for (let index = params.currentIndex + step; index >= 0 && index < params.entries.length; index += step) {
		const candidate = params.entries[index];
		if (candidate?.isBotAuthored) return candidate;
	}
}
async function resolveDriveCommentEventTurn(params) {
	const { cfg, accountId, event, botOpenId, logger, abortSignal } = params;
	const eventId = event.event_id?.trim();
	const commentId = event.comment_id?.trim();
	const replyId = event.reply_id?.trim();
	const noticeType = event.notice_meta?.notice_type?.trim();
	const fileToken = event.notice_meta?.file_token?.trim();
	const fileType = normalizeCommentFileType(event.notice_meta?.file_type);
	const senderId = event.notice_meta?.from_user_id?.open_id?.trim();
	const senderUserId = normalizeOptionalString(event.notice_meta?.from_user_id?.user_id);
	if (!eventId || !commentId || !noticeType || !fileToken || !fileType || !senderId) {
		logger?.(`feishu[${accountId}]: drive comment notice missing required fields event=${eventId ?? "unknown"} comment=${commentId ?? "unknown"}`);
		return null;
	}
	if (noticeType !== "add_comment" && noticeType !== "add_reply") {
		logger?.(`feishu[${accountId}]: unsupported drive comment notice type ${noticeType}`);
		return null;
	}
	const configuredBotOpenId = botOpenId?.trim();
	const eventRecipientBotOpenId = event.notice_meta?.to_user_id?.open_id?.trim();
	const effectiveBotOpenId = configuredBotOpenId || (event.is_mentioned === true ? eventRecipientBotOpenId : void 0);
	if (!effectiveBotOpenId) {
		logger?.(`feishu[${accountId}]: skipping drive comment notice because bot open_id is unavailable event=${eventId}`);
		return null;
	}
	if (senderId === effectiveBotOpenId) {
		logger?.(`feishu[${accountId}]: ignoring self-authored drive comment notice event=${eventId} sender=${senderId}`);
		return null;
	}
	const client = createFeishuClient((await import("./doctor-contract-ItAh0keT.mjs").then((n) => n.l)).resolveFeishuAccount({
		cfg,
		accountId
	}));
	const botOpenIds = [effectiveBotOpenId, event.notice_meta?.to_user_id?.open_id];
	const pageRequest = {
		client,
		fileToken,
		fileType,
		timeoutMs: FEISHU_COMMENT_VERIFY_TIMEOUT_MS,
		logger,
		accountId
	};
	const fetchDriveCommentContext = async () => {
		const [metaResponse, commentResponse] = await Promise.all([requestFeishuOpenApi({
			client,
			method: "POST",
			url: "/open-apis/drive/v1/metas/batch_query",
			data: {
				request_docs: [{
					doc_token: fileToken,
					doc_type: fileType
				}],
				with_url: true
			},
			timeoutMs: pageRequest.timeoutMs,
			logger,
			errorLabel: `feishu[${accountId}]: failed to fetch drive metadata for ${fileToken}`
		}), requestFeishuOpenApi({
			client,
			method: "POST",
			url: `/open-apis/drive/v1/files/${encodeURIComponent(fileToken)}/comments/batch_query` + encodeQuery({
				file_type: fileType,
				user_id_type: "open_id"
			}),
			data: { comment_ids: [commentId] },
			timeoutMs: pageRequest.timeoutMs,
			logger,
			errorLabel: `feishu[${accountId}]: failed to fetch drive comment ${commentId}`
		})]);
		const wikiCache = /* @__PURE__ */ new Map();
		const commentCard = commentResponse?.code === 0 ? (commentResponse.data?.items ?? []).find((item) => item.comment_id?.trim() === commentId) : void 0;
		const embeddedReplies = commentCard?.reply_list?.replies ?? [];
		const embeddedTargetReply = replyId ? embeddedReplies.find((reply) => reply.reply_id?.trim() === replyId) : embeddedReplies.at(-1);
		let replies = embeddedReplies;
		let fetchedMatchedReply = replyId ? embeddedTargetReply : void 0;
		if (!embeddedTargetReply || commentCard?.has_more === true) {
			const fetched = await fetchDriveCommentPages({
				...pageRequest,
				commentId,
				kind: "replies"
			});
			if (fetched.length > 0) {
				replies = fetched;
				fetchedMatchedReply = replyId ? replies.find((reply) => reply.reply_id?.trim() === replyId) : void 0;
			}
			if (replyId && !embeddedTargetReply && !fetchedMatchedReply) for (let attempt = 1; attempt <= FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT; attempt += 1) {
				if (abortSignal?.aborted) break;
				logger?.(`feishu[${accountId}]: retrying comment reply lookup comment=${commentId} requested_reply=${replyId} attempt=${attempt}/${FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT} delay_ms=${FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS}`);
				if (!await waitForAbortableDelay(FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS, abortSignal)) break;
				const retried = await fetchDriveCommentPages({
					...pageRequest,
					commentId,
					kind: "replies"
				});
				if (retried.length > 0) replies = retried;
				fetchedMatchedReply = replies.find((reply) => reply.reply_id?.trim() === replyId);
				if (fetchedMatchedReply) break;
			}
		}
		const rootReply = replies[0] ?? embeddedReplies[0];
		const targetReply = replyId ? embeddedTargetReply ?? fetchedMatchedReply : replies.at(-1) ?? embeddedTargetReply ?? rootReply;
		const meta = metaResponse?.code === 0 ? metaResponse.data?.metas?.[0] : void 0;
		const contentContext = {
			botOpenIds,
			currentDocument: {
				fileType,
				fileToken
			},
			client,
			wikiCache,
			logger,
			accountId
		};
		const normalizedBotOpenIds = new Set(normalizeTrimmedStringList(botOpenIds));
		const resolvedReplies = await Promise.all(replies.map(async (reply) => {
			const userId = normalizeOptionalString(reply.user_id);
			return {
				replyId: normalizeOptionalString(reply.reply_id),
				userId,
				createTime: typeof reply.create_time === "number" ? reply.create_time : void 0,
				isBotAuthored: userId !== void 0 && normalizedBotOpenIds.has(userId),
				content: await resolveParsedCommentContent({
					...contentContext,
					elements: isRecord(reply.content) ? reply.content.elements : void 0
				})
			};
		}));
		resolvedReplies.sort((left, right) => compareCommentTimelineEntries(left, right, (reply) => reply.replyId));
		const rootReplyContext = resolvedReplies.find((reply) => reply.replyId === normalizeOptionalString(rootReply?.reply_id)) ?? resolvedReplies[0];
		const targetReplyContext = resolvedReplies.find((reply) => reply.replyId === normalizeOptionalString(targetReply?.reply_id)) ?? (replyId ? void 0 : resolvedReplies.at(-1) ?? rootReplyContext);
		let wholeCommentTimeline = [];
		if (commentCard?.is_whole === true) {
			const wholeComments = (await fetchDriveCommentPages({
				...pageRequest,
				kind: "whole-comments"
			})).filter((comment) => comment.is_whole === true);
			wholeCommentTimeline = await Promise.all(wholeComments.map(async (comment) => {
				const rootWholeReply = comment.reply_list?.replies?.[0];
				const content = await resolveParsedCommentContent({
					...contentContext,
					elements: isRecord(rootWholeReply?.content) ? rootWholeReply.content.elements : void 0
				});
				const commentUserId = normalizeOptionalString(rootWholeReply?.user_id) || normalizeOptionalString(comment.user_id);
				return {
					commentId: normalizeOptionalString(comment.comment_id) ?? "",
					userId: commentUserId,
					createTime: typeof comment.create_time === "number" ? comment.create_time : typeof rootWholeReply?.create_time === "number" ? rootWholeReply.create_time : void 0,
					isBotAuthored: commentUserId !== void 0 && normalizedBotOpenIds.has(commentUserId),
					content
				};
			}));
			wholeCommentTimeline = wholeCommentTimeline.filter((entry) => Boolean(entry.commentId)).toSorted((left, right) => compareCommentTimelineEntries(left, right, (entry) => entry.commentId));
		}
		const currentWholeCommentIndex = wholeCommentTimeline.findIndex((entry) => entry.commentId === commentId);
		return {
			documentTitle: normalizeOptionalString(meta?.title),
			documentUrl: normalizeOptionalString(meta?.url),
			isWholeComment: commentCard?.is_whole,
			quoteText: normalizeOptionalString(commentCard?.quote),
			rootCommentText: rootReplyContext?.content.semanticText ?? rootReplyContext?.content.plainText,
			targetReplyText: targetReplyContext?.content.semanticText ?? targetReplyContext?.content.plainText,
			targetReplyContent: targetReplyContext?.content,
			currentCommentThreadReplies: resolvedReplies,
			wholeCommentTimeline,
			nearestBotWholeCommentAfter: currentWholeCommentIndex >= 0 ? findNearestBotTimelineEntry({
				entries: wholeCommentTimeline,
				currentIndex: currentWholeCommentIndex,
				direction: "after"
			}) : void 0,
			nearestBotWholeCommentBefore: currentWholeCommentIndex >= 0 ? findNearestBotTimelineEntry({
				entries: wholeCommentTimeline,
				currentIndex: currentWholeCommentIndex,
				direction: "before"
			}) : void 0
		};
	};
	const context = await fetchDriveCommentContext();
	const documentLabel = context.documentTitle ? `"${context.documentTitle}"` : `${fileType} document ${fileToken}`;
	const lines = [`The user added a ${noticeType === "add_reply" ? "reply" : "comment"} in ${documentLabel}.`];
	if (context.targetReplyText) lines.push(`Current user comment text: ${formatPromptTextValue(context.targetReplyText)}`);
	if (noticeType === "add_reply" && context.rootCommentText && context.rootCommentText !== context.targetReplyText) lines.push(`Original comment text: ${formatPromptTextValue(context.rootCommentText)}`);
	if (context.quoteText) lines.push(`Quoted content: ${formatPromptTextValue(context.quoteText)}`);
	if (event.is_mentioned === true) lines.push("This comment mentioned you.");
	if (context.documentUrl) lines.push(`Document link: ${context.documentUrl}`);
	lines.push("Current commented document:", `- file_type=${fileType}`, `- file_token=${fileToken}`);
	if (context.documentTitle) lines.push(`- title=${context.documentTitle}`);
	if (context.documentUrl) lines.push(`- url=${context.documentUrl}`);
	lines.push(`Event type: ${noticeType}`, `file_token: ${fileToken}`, `file_type: ${fileType}`, `comment_id: ${commentId}`);
	if (context.isWholeComment === true) lines.push("This is a whole-document comment.");
	if (replyId) lines.push(`reply_id: ${replyId}`);
	if (context.targetReplyContent?.semanticText) lines.push(`Current user comment semantic text: ${formatPromptTextValue(context.targetReplyContent.semanticText)}`);
	if (context.targetReplyContent?.botMentioned) lines.push("Bot routing mention detected in the current user comment. Treat that mention as routing only, not task content.");
	const nonBotMentions = (context.targetReplyContent?.mentions ?? []).filter((mention) => !mention.isBotMention).map((mention) => mention.displayText);
	if (nonBotMentions.length > 0) lines.push(`Other mentioned users in current comment: ${nonBotMentions.join(", ")}`);
	const linkedDocuments = context.targetReplyContent?.linkedDocuments ?? [];
	if (linkedDocuments.length > 0) lines.push("Referenced documents from current user comment:", ...linkedDocuments.map((link, index) => {
		const parts = [
			`raw_url=${link.rawUrl}`,
			`url_kind=${link.urlKind}`,
			link.wikiNodeToken ? `wiki_node_token=${link.wikiNodeToken}` : null,
			`resolved_type=${link.resolvedObjType ?? "UNKNOWN"}`,
			`resolved_token=${link.resolvedObjToken ?? "UNKNOWN"}`,
			`same_as_current_document=${link.isCurrentDocument === true ? "yes" : "no"}`
		].filter((part) => Boolean(part));
		return `- [${index + 1}] ${parts.join(" ")}`;
	}));
	if (!context.isWholeComment && context.currentCommentThreadReplies.length > 0) {
		const replies = context.currentCommentThreadReplies;
		let promptReplies = replies;
		if (replies.length > FEISHU_COMMENT_THREAD_PROMPT_LIMIT) {
			const targetIndex = replies.findIndex((reply) => reply.replyId === replyId);
			const currentIndex = targetIndex >= 0 ? targetIndex : replies.length - 1;
			promptReplies = selectNearbyEntries(replies, currentIndex, /* @__PURE__ */ new Set([
				0,
				currentIndex,
				replies.length - 1
			]), FEISHU_COMMENT_THREAD_PROMPT_LIMIT);
		}
		lines.push("Current comment card timeline (primary context for follow-ups on this comment card):", ...promptReplies.map((reply, index) => {
			const text = reply.content.semanticText ?? reply.content.plainText;
			return `- [${index + 1}] author=${reply.isBotAuthored ? "assistant" : "user"} user_id=${reply.userId ?? "UNKNOWN"} reply_id=${reply.replyId ?? "UNKNOWN"} current_event=${reply.replyId === replyId ? "yes" : "no"} text=${formatPromptTextValue(text)} referenced_docs=${formatLinkedDocumentsInlineSummary(reply.content.linkedDocuments)}`;
		}), "For this non-whole comment, use the current comment card timeline above as the primary source for phrases like 'above', 'previous result', 'that summary', or 'insert it'.", "Document-level session history is auxiliary background only. Do not use another comment card's recent output as the primary referent.");
	}
	if (context.isWholeComment && context.wholeCommentTimeline.length > 0) {
		const entries = context.wholeCommentTimeline;
		let promptEntries = entries;
		if (entries.length > FEISHU_WHOLE_COMMENT_PROMPT_LIMIT) {
			const currentIndex = entries.findIndex((entry) => entry.commentId === commentId);
			if (currentIndex < 0) promptEntries = entries.slice(-12);
			else {
				const selected = /* @__PURE__ */ new Set([currentIndex]);
				const nearestBotAfter = entries.findIndex((entry, index) => index > currentIndex && entry.isBotAuthored);
				if (nearestBotAfter >= 0) selected.add(nearestBotAfter);
				for (let index = currentIndex - 1; index >= 0; index -= 1) if (entries[index]?.isBotAuthored) {
					selected.add(index);
					break;
				}
				promptEntries = selectNearbyEntries(entries, currentIndex, selected, FEISHU_WHOLE_COMMENT_PROMPT_LIMIT);
			}
		}
		lines.push("Whole-document comment timeline (primary context for whole-comment follow-ups):", ...promptEntries.map((entry, index) => {
			const text = entry.content.semanticText ?? entry.content.plainText;
			return `- [${index + 1}] create_time=${entry.createTime ?? "UNKNOWN"} comment_id=${entry.commentId} author=${entry.isBotAuthored ? "assistant" : "user"} user_id=${entry.userId ?? "UNKNOWN"} current_comment=${entry.commentId === commentId ? "yes" : "no"} text=${formatPromptTextValue(text)} referenced_docs=${formatLinkedDocumentsInlineSummary(entry.content.linkedDocuments)}`;
		}));
		for (const [direction, entry] of [["after", context.nearestBotWholeCommentAfter], ["before", context.nearestBotWholeCommentBefore]]) if (entry) lines.push(`Nearest bot-authored whole-comment ${direction} the current comment: comment_id=${entry.commentId} text=${formatPromptTextValue(entry.content.semanticText ?? entry.content.plainText)}`);
		lines.push("For this whole-document comment, use the whole-comment timeline above as the primary source for phrases like 'just now', 'previous result', 'that summary', or 'write it back'.", "Document-level session history is auxiliary background only. Do not resolve whole-comment follow-ups by blindly using the most recent document-session output.");
	}
	lines.push("This is a Feishu document comment thread.", "It is not a Feishu IM chat.", "Your final text reply will be posted to the current comment thread automatically.", "Use the thread timeline above as the main context for follow-up requests.", "Do not use another comment card or document-session output as the main reference.", "If you need comment thread context, use the available Feishu drive comment-list actions.", "If you modify the document, post a user-visible follow-up in the comment thread.", "Use an available Feishu drive reply-comment or add-comment action for that follow-up.", "Whole-document comments do not support direct replies.", "For whole-document comments, use the Feishu drive add-comment action when available.", "Only treat URLs listed under \"Referenced documents from current user comment\" as structured Feishu document references.", "URLs that appear only in comment text are plain links unless you verify them.", "If the user asks about a linked Feishu document or wiki page, treat that linked document as the read target.", "If the user asks you to use a linked document as guidance, treat the linked document as the reference source and the current commented document as the edit target.", "If a referenced document resolves to the same file_token and file_type as the current commented document, treat it as the current document.", "If the user asks you to modify document content, you must use an available Feishu document tool to make the change.", "Do not reply with only \"done\", \"I'll handle it\", or a restated plan without calling tools.", "If the comment quotes document content, treat the quoted content as the main anchor.", "For requests like \"insert xxx below this content\", locate the quoted content first, then edit the document.", "For requests like \"summarize the content below\", \"explain this section\", or \"continue writing from here\", use the quoted content as the main target.", "If the quote is not enough, use available Feishu document read or list-blocks actions to read nearby context.", "Do not guess document content from the comment alone.", "Do not give a vague answer before reading enough context.", "Unless the user asks for the whole document, handle only the local content around the quoted anchor.", "If document edits are involved, read the anchor first, then edit.", "If the edit fails or the anchor cannot be found, say so clearly.", "If this is a reading task, such as summarization, explanation, or extraction, you may output the final answer directly after confirming the context.", "Use the same language as the user's comment or reply, unless the user asks for another language.", "Use plain text only.", "Do not use Markdown.", "Do not use headings.", "Do not use bullet lists.", "Do not use numbered lists.", "Do not use tables.", "Do not use blockquotes.", "Do not use code blocks.", "Do not show reasoning.", "Do not show analysis.", "Do not show chain-of-thought.", "Do not show scratch work.", "Do not describe your plan.", "Do not describe your steps.", "Do not describe tool use.", "Do not start with phrases like \"I will\", \"I’ll first\", \"I need to\", \"The user wants\", or \"I have updated\".", "Output only the final user-facing reply.", "If you already sent the user-visible reply with a Feishu drive comment action, output exactly NO_REPLY.", "If no user-visible reply is needed, output exactly NO_REPLY.", "Be concise.", "Do not omit requested content.");
	lines.push("Choose one outcome: output the final plain-text reply, edit the document and then post a user-visible follow-up in the comment thread, or output exactly NO_REPLY.");
	const prompt = lines.join("\n");
	return {
		eventId,
		messageId: `drive-comment:${eventId}`,
		commentId,
		replyId,
		fileToken,
		fileType,
		isWholeComment: context.isWholeComment,
		senderId,
		senderUserId,
		timestamp: event.timestamp,
		isMentioned: event.is_mentioned,
		documentTitle: context.documentTitle,
		documentUrl: context.documentUrl,
		quoteText: context.quoteText,
		rootCommentText: context.rootCommentText,
		targetReplyText: context.targetReplyText,
		prompt,
		preview: truncateUtf16Safe(prompt.replace(/\s+/g, " "), 160)
	};
}
function parseFeishuDriveCommentNoticeEventPayload(value) {
	if (!isRecord(value) || !isRecord(value.notice_meta)) return null;
	const noticeMeta = value.notice_meta;
	const readUserId = (userIdValue) => isRecord(userIdValue) ? {
		open_id: readStringValue(userIdValue.open_id),
		user_id: readStringValue(userIdValue.user_id),
		union_id: readStringValue(userIdValue.union_id)
	} : void 0;
	return {
		comment_id: readStringValue(value.comment_id),
		event_id: readStringValue(value.event_id),
		is_mentioned: asBoolean(value.is_mentioned),
		notice_meta: {
			file_token: readStringValue(noticeMeta.file_token),
			file_type: readStringValue(noticeMeta.file_type),
			from_user_id: readUserId(noticeMeta.from_user_id),
			notice_type: readStringValue(noticeMeta.notice_type),
			to_user_id: readUserId(noticeMeta.to_user_id)
		},
		reply_id: readStringValue(value.reply_id),
		timestamp: readStringValue(value.timestamp),
		type: readStringValue(value.type)
	};
}
// extensions/feishu/src/comment-handler.ts
function parseTimestampMs(value) {
	return parseStrictNonNegativeInteger(value) ?? Date.now();
}
async function handleFeishuCommentEvent(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const core = getFeishuRuntime();
	const log = params.runtime?.log ?? console.log;
	const error = params.runtime?.error ?? console.error;
	const runtime = params.runtime ?? {
		log,
		error
	};
	const turn = await resolveDriveCommentEventTurn({
		cfg: params.cfg,
		accountId: account.accountId,
		event: params.event,
		botOpenId: params.botOpenId,
		logger: log,
		abortSignal: params.abortSignal
	});
	if (!turn) {
		log(`feishu[${account.accountId}]: drive comment notice skipped event=${params.event.event_id ?? "unknown"} comment=${params.event.comment_id ?? "unknown"}`);
		return;
	}
	const commentTarget = buildFeishuCommentTarget({
		fileType: turn.fileType,
		fileToken: turn.fileToken,
		commentId: turn.commentId
	});
	const pairing = createChannelPairingController({
		core,
		channel: "feishu",
		accountId: account.accountId
	});
	const resolveCommentAuthorization = async (candidateCfg, mayPair, contextBinding) => {
		const candidateAccount = resolveFeishuRuntimeAccount({
			cfg: candidateCfg,
			accountId: account.accountId
		});
		const candidateDmPolicy = candidateAccount.config.dmPolicy;
		return {
			account: candidateAccount,
			cfg: candidateCfg,
			dmPolicy: candidateDmPolicy,
			ingress: await resolveFeishuDmIngressAccess({
				cfg: candidateCfg,
				accountId: candidateAccount.accountId,
				dmPolicy: candidateDmPolicy,
				allowFrom: candidateAccount.config.allowFrom ?? [],
				readAllowFromStore: pairing.readAllowFromStore,
				senderOpenId: turn.senderId,
				senderUserId: turn.senderUserId,
				conversationId: turn.senderId,
				mayPair,
				...contextBinding ? { contextBinding } : {}
			})
		};
	};
	const rejectCommentAuthorization = async (authorization) => {
		if (authorization.ingress.ingress.admission === "pairing-required") {
			const client = createFeishuClient(authorization.account);
			await pairing.issueChallenge({
				senderId: turn.senderId,
				senderIdLine: `Your Feishu user id: ${turn.senderId}`,
				meta: { name: turn.senderId },
				onCreated: () => {
					log(`feishu[${account.accountId}]: comment pairing request sender=${turn.senderId}`);
				},
				sendPairingReply: async (text) => {
					await deliverCommentThreadText(client, {
						file_token: turn.fileToken,
						file_type: turn.fileType,
						comment_id: turn.commentId,
						content: text,
						is_whole_comment: turn.isWholeComment
					});
				},
				onReplyError: (err) => {
					log(`feishu[${account.accountId}]: comment pairing reply failed for ${turn.senderId}: ${String(err)}`);
				}
			});
		} else log(`feishu[${account.accountId}]: blocked unauthorized comment sender ${turn.senderId} (dmPolicy=${authorization.dmPolicy}, comment=${turn.commentId})`);
	};
	const commentAuthorization = await resolveCommentAuthorization(params.cfg, true);
	if (commentAuthorization.ingress.ingress.admission !== "dispatch") {
		await rejectCommentAuthorization(commentAuthorization);
		return;
	}
	let effectiveCfg = params.cfg;
	const currentCfg = core.config.current();
	if (currentCfg !== effectiveCfg) {
		const currentAuthorization = await resolveCommentAuthorization(currentCfg, true);
		if (currentAuthorization.ingress.ingress.admission !== "dispatch") {
			await rejectCommentAuthorization(currentAuthorization);
			return;
		}
		effectiveCfg = currentCfg;
	}
	const resolveRoute = (cfg) => core.channel.routing.resolveAgentRoute({
		cfg,
		channel: "feishu",
		accountId: account.accountId,
		peer: {
			kind: "direct",
			id: turn.senderId
		}
	});
	let route = resolveRoute(effectiveCfg);
	if (route.matchedBy === "default") {
		const dynamicResult = await maybeCreateDynamicAgent({
			cfg: effectiveCfg,
			runtime: core,
			accountId: account.accountId,
			senderOpenId: turn.senderId,
			canCreateForConfig: async (candidateCfg) => {
				return (await resolveCommentAuthorization(candidateCfg, false)).ingress.ingress.admission === "dispatch";
			},
			log
		});
		if (dynamicResult.created || dynamicResult.updatedCfg !== effectiveCfg) {
			const refreshedAuthorization = await resolveCommentAuthorization(dynamicResult.updatedCfg, false);
			if (refreshedAuthorization.ingress.ingress.admission !== "dispatch") {
				log(`feishu[${account.accountId}]: current policy rejected stale comment sender ${turn.senderId} before adopting refreshed dynamic route (dmPolicy=${refreshedAuthorization.dmPolicy}, comment=${turn.commentId})`);
				return;
			}
			effectiveCfg = dynamicResult.updatedCfg;
			route = resolveRoute(dynamicResult.updatedCfg);
			if (dynamicResult.created) log(`feishu[${account.accountId}]: dynamic agent created for comment flow, route=${route.sessionKey}`);
		}
	}
	const commentSessionKey = core.channel.routing.buildAgentSessionKey({
		agentId: route.agentId,
		channel: "feishu",
		accountId: route.accountId,
		peer: {
			kind: "direct",
			id: `comment-doc:${turn.fileType}:${turn.fileToken}`
		},
		dmScope: "per-account-channel-peer"
	});
	const bodyForAgent = `[message_id: ${turn.messageId}]\n${turn.prompt}`;
	const rawBody = turn.targetReplyText ?? turn.rootCommentText ?? turn.prompt;
	const conversationLabel = turn.documentTitle ? `Feishu comment · ${turn.documentTitle}` : "Feishu comment";
	const boundAuthorization = await resolveCommentAuthorization(effectiveCfg, false, {
		agentId: route.agentId,
		sessionKey: commentSessionKey,
		messageId: turn.messageId,
		inboundEventKind: "user_request"
	});
	const ctxPayload = core.channel.inbound.buildContext({
		channelIngress: boundAuthorization.ingress,
		channel: "feishu",
		accountId: route.accountId,
		surface: "feishu-comment",
		messageId: turn.messageId,
		timestamp: parseTimestampMs(turn.timestamp),
		from: `feishu:${turn.senderId}`,
		sender: {
			id: turn.senderId,
			name: turn.senderId
		},
		conversation: {
			kind: "direct",
			id: commentTarget,
			label: conversationLabel
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: commentSessionKey,
			dispatchSessionKey: commentSessionKey
		},
		reply: {
			to: commentTarget,
			originatingTo: commentTarget,
			messageThreadId: turn.replyId
		},
		message: {
			body: bodyForAgent,
			bodyForAgent,
			rawBody,
			commandBody: rawBody
		},
		access: {
			commands: { authorized: false },
			mentions: {
				canDetectMention: true,
				wasMentioned: turn.isMentioned ?? false
			}
		}
	});
	const prefixContext = createReplyPrefixContext({
		cfg: effectiveCfg,
		agentId: route.agentId,
		channel: "feishu",
		accountId: account.accountId
	});
	const client = createFeishuClient(resolveFeishuRuntimeAccount({
		cfg: effectiveCfg,
		accountId: account.accountId
	}));
	const textChunkLimit = core.channel.text.resolveTextChunkLimit(effectiveCfg, "feishu", account.accountId, { fallbackLimit: 4e3 });
	const chunkMode = core.channel.text.resolveChunkMode(effectiveCfg, "feishu", account.accountId);
	const typingReaction = createCommentTypingReactionLifecycle({
		cfg: effectiveCfg,
		accountId: account.accountId,
		runtime,
		fileToken: turn.fileToken,
		fileType: turn.fileType,
		replyId: turn.replyId
	});
	const dispatcherOptions = {
		responsePrefix: prefixContext.responsePrefix,
		responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
		humanDelay: resolveHumanDelayConfig(effectiveCfg, route.agentId),
		onReplyStart: typingReaction.start,
		onCleanup: () => {
			typingReaction.cleanup();
		}
	};
	const delivery = {
		observeMessageSent: true,
		deliver: async (payload, info) => {
			if (info.kind !== "final") return noVisibleFeishuReplyDelivery;
			const reply = resolveSendableOutboundReplyParts(payload);
			const { presentation } = resolveFeishuRichReply(payload);
			let { commentText: text } = buildFeishuPresentationFallback({
				text: reply.text,
				presentation
			});
			for (const mediaUrl of reply.mediaUrls) text = await buildFeishuMediaFallbackText({
				text,
				mediaUrl,
				mediaLinkStyle: "plain"
			});
			if (!text.trim()) return noVisibleFeishuReplyDelivery;
			const chunks = core.channel.text.chunkTextWithMode(text, textChunkLimit, chunkMode);
			const results = [];
			const acceptedChunks = [];
			for (const chunk of chunks) try {
				const result = await deliverCommentThreadText(client, {
					file_token: turn.fileToken,
					file_type: turn.fileType,
					comment_id: turn.commentId,
					content: chunk,
					is_whole_comment: turn.isWholeComment
				});
				results.push({ messageId: result.delivery_mode === "reply_comment" ? result.reply_id : result.comment_id });
				acceptedChunks.push(chunk);
			} catch (deliveryError) {
				throw createFeishuPartialReplyDeliveryError(deliveryError, createFeishuReplyDeliveryResult({
					results,
					visibleReplySent: results.length > 0,
					content: acceptedChunks.join(""),
					kind: "text"
				}));
			}
			return createFeishuReplyDeliveryResult({
				results,
				visibleReplySent: results.length > 0,
				content: text,
				kind: "text"
			});
		},
		onError: (err, info) => {
			runtime.error(`feishu[${account.accountId}]: comment dispatcher failed kind=${info.kind} comment=${turn.commentId}: ${String(err)}`);
		}
	};
	try {
		await core.channel.inbound.run({
			channel: "feishu",
			accountId: route.accountId,
			raw: turn,
			adapter: {
				ingest: () => ({
					id: turn.messageId,
					timestamp: parseTimestampMs(turn.timestamp),
					rawText: ctxPayload.RawBody ?? "",
					textForAgent: ctxPayload.BodyForAgent,
					textForCommands: ctxPayload.CommandBody,
					raw: turn
				}),
				resolveTurn: () => ({
					cfg: effectiveCfg,
					channel: "feishu",
					accountId: route.accountId,
					route: {
						agentId: route.agentId,
						sessionKey: commentSessionKey
					},
					ctxPayload,
					record: { onRecordError: (err) => {
						error(`feishu[${account.accountId}]: failed to record comment inbound session ${commentSessionKey}: ${String(err)}`);
					} },
					dispatcherOptions,
					delivery,
					...params.turnAdoptionLifecycle ? { replyOptions: bindIngressLifecycleToReplyOptions(params.turnAdoptionLifecycle) } : {}
				})
			}
		});
	} finally {
		typingReaction.cleanup();
	}
}
// extensions/feishu/src/sequential-queue.ts
const DEFAULT_TASK_TIMEOUT_MS = 3e5;
function createSequentialQueue(options = {}) {
	const queues = /* @__PURE__ */ new Map();
	const onTaskTimeout = options.onTaskTimeout;
	return (key, task) => enqueueKeyedTask({
		tails: queues,
		key,
		task: () => raceWithTimeout(task, DEFAULT_TASK_TIMEOUT_MS, () => {
			onTaskTimeout?.(key, DEFAULT_TASK_TIMEOUT_MS);
		})
	});
}
// extensions/feishu/src/monitor.comment-notice-handler.ts
function createFeishuDriveCommentNoticeHandler(params) {
	const { cfg, accountId, runtime, fireAndForget, abortSignal } = params;
	const error = runtime?.error ?? console.error;
	const enqueue = createSequentialQueue();
	const getBotOpenId = params.getBotOpenId ?? ((id) => botOpenIds.get(id));
	const runFeishuHandler = async (task) => {
		const promise = task().catch((err) => {
			error(`feishu[${accountId}]: error handling drive comment notice: ${String(err)}`);
		});
		if (!fireAndForget) await promise;
	};
	const handleNotice = async (data, turnAdoptionLifecycle) => {
		const event = parseFeishuDriveCommentNoticeEventPayload(data);
		if (!event) {
			if (turnAdoptionLifecycle) throw new FeishuIngressPermanentError("invalid-event", "Feishu durable comment event payload is malformed.");
			error(`feishu[${accountId}]: ignoring malformed drive comment notice payload`);
			return;
		}
		const fileType = event.notice_meta?.file_type?.trim() || "unknown";
		const fileToken = event.notice_meta?.file_token?.trim() || "unknown";
		await enqueue(`comment-doc:${fileType}:${fileToken}`, async () => {
			if (turnAdoptionLifecycle?.abortSignal.aborted) {
				await turnAdoptionLifecycle.onAbandoned();
				return;
			}
			await handleFeishuCommentEvent({
				cfg,
				accountId,
				event,
				botOpenId: getBotOpenId(accountId),
				runtime,
				abortSignal,
				turnAdoptionLifecycle
			});
		});
	};
	return async (data) => {
		const ingressLifecycle = params.resolveIngressLifecycle?.(data);
		if (!ingressLifecycle) {
			await runFeishuHandler(() => handleNotice(data));
			return;
		}
		const { lifecycle, settle } = buildFeishuFlushIngressLifecycle([{ lifecycle: ingressLifecycle }]);
		await handleNotice(data, lifecycle);
		await settle();
	};
}
// extensions/feishu/src/monitor.message-handler.ts
function parseFeishuMessageEventPayload(value) {
	if (!isRecord(value)) return null;
	const sender = value.sender;
	const message = value.message;
	if (!isRecord(sender) || !isRecord(message)) return null;
	const senderId = sender.sender_id;
	if (!isRecord(senderId)) return null;
	const messageId = readStringValue(message.message_id);
	const chatId = readStringValue(message.chat_id);
	const chatType = normalizeFeishuEventChatType(message.chat_type);
	const messageType = readStringValue(message.message_type);
	if (!messageId || !chatId || !chatType || !messageType || typeof message.content !== "string") return null;
	return value;
}
function mergeFeishuDebounceMentions(entries) {
	const merged = /* @__PURE__ */ new Map();
	for (const entry of entries) for (const mention of entry.message.mentions ?? []) {
		const stableId = mention.id.open_id?.trim() || mention.id.user_id?.trim() || mention.id.union_id?.trim();
		const mentionName = mention.name?.trim();
		const mentionKey = mention.key?.trim();
		const fallback = mentionName && mentionKey ? `${mentionName}|${mentionKey}` : mentionName || mentionKey;
		const key = stableId || fallback;
		if (!key || merged.has(key)) continue;
		merged.set(key, mention);
	}
	return merged.size > 0 ? Array.from(merged.values()) : void 0;
}
function resolveFeishuDebounceMentions(params) {
	const { entries, botOpenId } = params;
	if (entries.length === 0) return;
	for (const entry of entries.toReversed()) if (isMentionForwardRequest(entry, botOpenId)) return mergeFeishuDebounceMentions([entry]);
	const merged = mergeFeishuDebounceMentions(entries);
	if (!merged) return;
	const normalizedBotOpenId = botOpenId?.trim();
	if (!normalizedBotOpenId) return;
	const botMentions = merged.filter((mention) => mention.id.open_id?.trim() === normalizedBotOpenId);
	return botMentions.length > 0 ? botMentions : void 0;
}
function createFeishuMessageReceiveHandler({ cfg, channelRuntime, accountId, runtime, chatHistories, fireAndForget, isAccountActive = () => true, trackTask, handleMessage, resolveDebounceText: resolveText, hasProcessedMessage, getBotOpenId = () => void 0, resolveSequentialKey = ({ accountId: accountIdLocal, event }) => `feishu:${accountIdLocal}:${event.message.chat_id?.trim() || "unknown"}`, statusSink, resolveIngressLifecycle }) {
	const readConfig = createRuntimeConfigReader(cfg);
	const resolveDebounceMs = () => channelRuntime.debounce.resolveInboundDebounceMs({
		cfg: readConfig(),
		channel: "feishu"
	});
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const enqueue = createSequentialQueue({ onTaskTimeout: (key, timeoutMs) => {
		log(`feishu[${accountId}]: per-chat task exceeded ${timeoutMs}ms cap (key=${key}); evicting from queue so later same-key messages can proceed (#70133)`);
	} });
	const dispatchFeishuMessage = async ({ event, messageDedupeKey, processingClaim }, turnAdoptionLifecycle, preparedContent) => {
		const sequentialKey = resolveSequentialKey({
			accountId,
			event,
			preparedContent,
			botOpenId: getBotOpenId(accountId),
			isControlCommandMessage: (text) => channelRuntime.commands.isControlCommandMessage(text, readConfig())
		});
		const task = async () => {
			if (turnAdoptionLifecycle?.abortSignal.aborted) {
				await turnAdoptionLifecycle.onAbandoned();
				return;
			}
			const handling = handleMessage({
				trackTask,
				cfg,
				event,
				preparedContent,
				botOpenId: getBotOpenId(accountId),
				runtime,
				channelRuntime,
				chatHistories,
				accountId,
				processingClaim,
				messageDedupeKey,
				turnAdoptionLifecycle
			});
			trackTask?.(handling);
			await handling;
		};
		await enqueue(sequentialKey, task);
	};
	const resolveDebounceText = (event) => {
		return resolveText({
			event,
			botOpenId: getBotOpenId(accountId)
		}).trim();
	};
	const recordSuppressedMessageIds = async (entries, dispatchDedupeKey) => {
		const keepDedupeKey = dispatchDedupeKey?.trim();
		for (const { messageDedupeKey, processingClaim } of entries) {
			if (!messageDedupeKey || messageDedupeKey === keepDedupeKey) continue;
			try {
				await processingClaim?.commit();
			} catch (err) {
				error(`feishu[${accountId}]: failed to record merged dedupe id ${messageDedupeKey}: ${String(err)}`);
			}
		}
	};
	const inboundDebouncer = channelRuntime.debounce.createInboundDebouncer({
		debounceMs: resolveDebounceMs(),
		resolveDebounceMs,
		buildKey: ({ event }) => {
			if (event.message.message_type === "text" && channelRuntime.commands.isControlCommandMessage(normalizeFeishuCommandProbeBody(resolveDebounceText(event)), readConfig())) return null;
			const chatId = event.message.chat_id?.trim();
			const senderId = event.sender.sender_id.open_id?.trim() || event.sender.sender_id.user_id?.trim();
			if (!chatId || !senderId) return null;
			const threadId = event.message.root_id?.trim() || event.message.thread_id?.trim();
			return `feishu:${accountId}:${chatId}:${threadId ? `thread:${threadId}` : "chat"}:${senderId}`;
		},
		shouldDebounce: ({ event }) => {
			if (event.message.message_type !== "text") return false;
			const text = resolveDebounceText(event);
			return Boolean(text);
		},
		onFlush: (entries, createFlush) => {
			const activeEntries = entries.filter((entry) => !entry.abandoned);
			const last = activeEntries.at(-1);
			const { lifecycle, settle } = buildFeishuFlushIngressLifecycle(activeEntries.map((entry) => ({
				lifecycle: entry.turnAdoptionLifecycle,
				replayClaim: entry.processingClaim
			})), {
				trackTask,
				onReplayCommitError: (err) => error(`feishu[${accountId}]: failed to commit logical replay guard: ${String(err)}`)
			});
			return createFlush({
				lifecycle,
				dispatch: async (admissionLifecycle) => {
					if (!last) return;
					if (admissionLifecycle.abortSignal.aborted) {
						await admissionLifecycle.onAbandoned();
						return;
					}
					try {
						if (activeEntries.length === 1) {
							await dispatchFeishuMessage(last, admissionLifecycle);
							await settle();
							return;
						}
						const dispatchEntry = last;
						const dispatchDedupeKey = dispatchEntry.messageDedupeKey;
						if (!lifecycle) await recordSuppressedMessageIds(activeEntries, dispatchDedupeKey);
						const combinedText = activeEntries.map((entry) => resolveDebounceText(entry.event)).filter(Boolean).join("\n");
						const mergedMentions = resolveFeishuDebounceMentions({
							entries: activeEntries.map((entry) => entry.event),
							botOpenId: getBotOpenId(accountId)
						});
						await dispatchFeishuMessage({
							...dispatchEntry,
							event: {
								...dispatchEntry.event,
								message: {
									...dispatchEntry.event.message,
									mentions: mergedMentions ?? dispatchEntry.event.message.mentions
								}
							}
						}, admissionLifecycle, combinedText);
						await settle();
					} catch (err) {
						await admissionLifecycle.onAbandoned();
						throw err;
					}
				}
			});
		},
		onError: (err, entries) => {
			for (const entry of entries) {
				entry.processingClaim?.release({ error: err });
				try {
					Promise.resolve(entry.turnAdoptionLifecycle?.onAbandoned()).catch((abandonError) => {
						error(`feishu[${accountId}]: failed to abandon durable ingress after debounce error: ${String(abandonError)}`);
					});
				} catch (abandonError) {
					error(`feishu[${accountId}]: failed to abandon durable ingress after debounce error: ${String(abandonError)}`);
				}
			}
			error(`feishu[${accountId}]: inbound debounce flush failed: ${String(err)}`);
		}
	});
	return async (data) => {
		const turnAdoptionLifecycle = resolveIngressLifecycle?.(data);
		if (!isAccountActive() || turnAdoptionLifecycle?.abortSignal.aborted) {
			await turnAdoptionLifecycle?.onAbandoned();
			return;
		}
		const completeSuppressedIngress = async () => {
			if (!turnAdoptionLifecycle) return;
			turnAdoptionLifecycle.onAdoptionFinalizing();
			await turnAdoptionLifecycle.onAdopted();
		};
		statusSink?.({ lastEventAt: Date.now() });
		const event = parseFeishuMessageEventPayload(data);
		if (!event) {
			if (turnAdoptionLifecycle) throw new FeishuIngressPermanentError("invalid-event", "Feishu durable message event payload is malformed.");
			error(`feishu[${accountId}]: ignoring malformed message event payload`);
			return;
		}
		const messageId = event.message?.message_id?.trim();
		const botOpenId = getBotOpenId(accountId)?.trim();
		const senderOpenId = event.sender.sender_id.open_id?.trim();
		if (botOpenId && senderOpenId === botOpenId) {
			await completeSuppressedIngress();
			return;
		}
		const messageDedupeKey = resolveFeishuMessageDedupeKey(event);
		if (event.message.message_type.trim() === "post" && messageDedupeKey !== messageId && await hasProcessedMessage(messageId, accountId, log) && parsePostContent(event.message.content, { includeTopLevelFiles: false }).attachments.length === 0) {
			await completeSuppressedIngress();
			return;
		}
		const claim = await claimUnprocessedFeishuMessage({
			messageId: messageDedupeKey,
			namespace: accountId,
			log
		});
		if (!isAccountActive() || turnAdoptionLifecycle?.abortSignal.aborted) {
			const stoppedError = /* @__PURE__ */ new Error("feishu account stopped before message admission");
			if (claim.kind === "claimed") claim.handle.release({ error: stoppedError });
			await turnAdoptionLifecycle?.onAbandoned();
			return {
				kind: "failed-retryable",
				error: stoppedError
			};
		}
		if (claim.kind === "duplicate" || claim.kind === "inflight") {
			await completeSuppressedIngress();
			return;
		}
		const debounceEntry = {
			event,
			messageDedupeKey,
			...claim.kind === "claimed" ? { processingClaim: claim.handle } : {},
			...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {}
		};
		if (claim.kind === "claimed" && turnAdoptionLifecycle) turnAdoptionLifecycle.onBeforeAbandon = () => {
			debounceEntry.abandoned = true;
			claim.handle.release({ error: /* @__PURE__ */ new Error("feishu-ingress-abandoned-before-flush") });
		};
		if (turnAdoptionLifecycle) try {
			await inboundDebouncer.enqueue(debounceEntry);
			return { kind: "deferred" };
		} catch (err) {
			if (claim.kind === "claimed") claim.handle.release({ error: err });
			return {
				kind: "failed-retryable",
				error: err
			};
		}
		const processing = inboundDebouncer.enqueue(debounceEntry).catch((err) => {
			if (claim.kind === "claimed") claim.handle.release({ error: err });
			error(`feishu[${accountId}]: error handling message: ${String(err)}`);
		});
		if (!fireAndForget) await processing;
	};
}
// extensions/feishu/src/monitor-rate-limit-key.ts
function normalizeFeishuWebhookRateLimitClient(clientIp) {
	if (!clientIp) return "unknown";
	if (clientIp === "::1" || clientIp.startsWith("127.")) return "loopback";
	return clientIp;
}
function buildFeishuWebhookRateLimitKey(params) {
	return `${params.accountId === void 0 ? params.path : `${params.accountId}:${params.path}`}:${normalizeFeishuWebhookRateLimitClient(params.clientIp)}`;
}
// extensions/feishu/src/monitor.transport.ts
const FEISHU_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const FEISHU_WEBHOOK_ACCEPTED_VALUE = "durable";
const FEISHU_PRE_AUTH_MAX_IN_FLIGHT = 64;
const FEISHU_WEBHOOK_CLOSE_TIMEOUT_MS = 5e3;
const FEISHU_WEBHOOK_TIMESTAMP_MAX_SKEW_MS = 36e5;
const FEISHU_WS_RECONNECT_INITIAL_DELAY_MS = 1e3;
const FEISHU_WS_RECONNECT_MAX_DELAY_MS = 3e4;
const FEISHU_WS_LOG_ERROR_MAX_LENGTH = 500;
const FEISHU_WS_RECONNECT_EXHAUSTED_RE = /^WebSocket reconnect exhausted after \d+ attempts?/;
const FEISHU_WS_AUTORECONNECT_DISABLED_ERROR = "WebSocket connect failed and autoReconnect is disabled";
const BLOCKED_FEISHU_WEBHOOK_PAYLOAD_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor",
	"headers"
]);
function buildFeishuWebhookEnvelope(req, payload) {
	const envelope = Object.create({ headers: req.headers });
	for (const [key, value] of Object.entries(payload)) if (!BLOCKED_FEISHU_WEBHOOK_PAYLOAD_KEYS.has(key)) envelope[key] = value;
	return envelope;
}
function isFeishuWebhookTimestampFresh(timestamp) {
	const parsed = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(parsed)) return false;
	const timestampMs = parsed < 0xe8d4a51000 ? parsed * 1e3 : parsed;
	return Math.abs(Date.now() - timestampMs) <= FEISHU_WEBHOOK_TIMESTAMP_MAX_SKEW_MS;
}
function isFeishuWebhookSignatureValid(params) {
	const timestampHeader = params.headers["x-lark-request-timestamp"];
	const nonceHeader = params.headers["x-lark-request-nonce"];
	const signatureHeader = params.headers["x-lark-signature"];
	const timestamp = Array.isArray(timestampHeader) ? timestampHeader[0] : timestampHeader;
	const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader;
	const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
	if (!timestamp || !nonce || !signature) return false;
	if (!isFeishuWebhookTimestampFresh(timestamp)) return false;
	const computedSignature = crypto.createHash("sha256").update(timestamp + nonce + params.encryptKey + params.rawBody).digest("hex");
	return safeEqualSecret(computedSignature, signature);
}
function respondText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.end(body);
}
function getFeishuWsReconnectDelayMs(attempt) {
	return Math.min(FEISHU_WS_RECONNECT_INITIAL_DELAY_MS * 2 ** Math.max(0, attempt - 1), FEISHU_WS_RECONNECT_MAX_DELAY_MS);
}
function formatFeishuWsErrorForLog(err) {
	const raw = err instanceof Error ? err.message || err.name : String(err);
	const redacted = Array.from(raw, (char) => {
		const code = char.charCodeAt(0);
		return code <= 31 || code === 127 ? " " : char;
	}).join("").replace(/:\/\/[^:@/\s]+:[^@/\s]+@/g, "://[redacted]@").replace(/\b(authorization\s*[:=]\s*Bearer\s+)[^\s,;]+/gi, "$1[redacted]").replace(/\b(Bearer\s+)[A-Za-z0-9._~+/-]+=*/g, "$1[redacted]").replace(/\b((?:app[_-]?secret|tenant[_-]?access[_-]?token|access[_-]?token|refresh[_-]?token|token|secret|password)\s*[:=]\s*)[^\s&;,]+/gi, "$1[redacted]").replace(/\s+/g, " ").trim();
	return truncateWithMarker(redacted || "unknown error", FEISHU_WS_LOG_ERROR_MAX_LENGTH, {
		marker: "...",
		reserve: 0,
		trimEnd: false
	});
}
function isFeishuWsTerminalError(err) {
	const message = err.message.trim();
	return FEISHU_WS_RECONNECT_EXHAUSTED_RE.test(message) || message.startsWith(FEISHU_WS_AUTORECONNECT_DISABLED_ERROR);
}
function cleanupFeishuWsClient(params) {
	const { accountId, wsClient, error, clearIdentity } = params;
	if (wsClient) try {
		wsClient.close();
	} catch (err) {
		error(`feishu[${accountId}]: error closing WebSocket client: ${formatFeishuWsErrorForLog(err)}`);
	}
	if (clearIdentity) clearFeishuBotIdentityState(accountId);
}
async function monitorWebSocket({ account, accountId, runtime, abortSignal, eventDispatcher, setSocketTerminator, statusSink }) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	let attempt = 0;
	const retry = (label, cause) => {
		const delayMs = getFeishuWsReconnectDelayMs(++attempt);
		error(`feishu[${accountId}]: ${label} in ${delayMs}ms: ${formatFeishuWsErrorForLog(cause)}`);
		return waitForAbortableDelay(delayMs, abortSignal);
	};
	while (true) {
		if (abortSignal?.aborted) break;
		let wsClient;
		try {
			const { promise: terminalError, resolve: reportTerminalError } = createDeferred();
			const handleWsError = (err) => {
				if (isFeishuWsTerminalError(err)) {
					reportTerminalError(err);
					return;
				}
				error(`feishu[${accountId}]: WebSocket SDK reported recoverable error: ${formatFeishuWsErrorForLog(err)}`);
			};
			const publishWsConnected = () => {
				const connectedAt = Date.now();
				statusSink?.(channelReadyPatch({
					lastConnectedAt: connectedAt,
					lastEventAt: connectedAt
				}));
			};
			const publishWsReconnecting = () => {
				statusSink?.({
					connected: false,
					lifecycle: "recovering",
					lastEventAt: Date.now()
				});
			};
			log(`feishu[${accountId}]: starting WebSocket connection...`);
			wsClient = await createFeishuWSClient(account, {
				onError: handleWsError,
				onReady: publishWsConnected,
				onReconnected: publishWsConnected,
				onReconnecting: publishWsReconnecting
			});
			setSocketTerminator?.(() => wsClient?.close({ force: true }));
			if (abortSignal?.aborted) {
				cleanupFeishuWsClient({
					accountId,
					wsClient,
					error,
					clearIdentity: true
				});
				break;
			}
			await wsClient.start({ eventDispatcher });
			attempt = 0;
			log(`feishu[${accountId}]: WebSocket client started`);
			const cycleEnd = await raceWithTimeoutAndAbort(terminalError, { abortSignal });
			if (cycleEnd.status !== "resolved") {
				log(`feishu[${accountId}]: abort signal received, stopping`);
				cleanupFeishuWsClient({
					accountId,
					wsClient,
					error,
					clearIdentity: true
				});
				setSocketTerminator?.(void 0);
				return;
			}
			cleanupFeishuWsClient({
				accountId,
				wsClient,
				error,
				clearIdentity: false
			});
			setSocketTerminator?.(void 0);
			if (abortSignal?.aborted) break;
			const disconnectedAt = Date.now();
			statusSink?.(channelBlockedPatch(formatFeishuWsErrorForLog(cycleEnd.value), {
				connected: false,
				lastEventAt: disconnectedAt
			}));
			if (!await retry("WebSocket connection ended, recreating client", cycleEnd.value)) break;
		} catch (err) {
			cleanupFeishuWsClient({
				accountId,
				wsClient,
				error,
				clearIdentity: false
			});
			setSocketTerminator?.(void 0);
			if (abortSignal?.aborted) break;
			const failedAt = Date.now();
			const terminal = err instanceof Error && isFeishuWsTerminalError(err);
			statusSink?.({
				connected: false,
				lifecycle: terminal ? "blocked" : "recovering",
				...terminal ? { terminalDisconnect: true } : {},
				lastEventAt: failedAt,
				lastError: formatFeishuWsErrorForLog(err)
			});
			if (!await retry("WebSocket start failed, retrying", err)) break;
		}
	}
	cleanupFeishuWsClient({
		accountId,
		wsClient: void 0,
		error,
		clearIdentity: true
	});
	setSocketTerminator?.(void 0);
}
const webhookTargetsStore = createPluginRuntimeStore({
	key: "feishu:webhook-targets",
	errorMessage: "Feishu webhook routes are not registered"
});
async function handleFeishuWebhook(req, res, webhookTargets) {
	const legacyListener = getWebhookLegacyListener(req);
	const requestUrl = req.url ?? "/";
	const requestPath = requestUrl.split("?", 1)[0];
	const targets = (webhookTargets.get(canonicalizeWebhookRouteKey(requestPath ?? "/")) ?? []).filter((target) => (!legacyListener || target.legacyListener?.port === legacyListener.port && target.legacyListener.host === legacyListener.host) && (target.rawPath.includes("?") ? requestUrl : requestPath) === target.rawPath);
	const firstTarget = targets[0];
	if (!requestPath?.startsWith("/") || requestUrl.includes("#") || !firstTarget) {
		respondText(res, 404, "Not Found");
		return;
	}
	const { rawPath: path, runtime, preAuthInFlightLimiter } = firstTarget;
	const accountId = targets.length === 1 ? firstTarget.accountId : void 0;
	const preAuthInFlightKey = legacyListener ? JSON.stringify([legacyListener.host, legacyListener.port]) : "gateway";
	let selectedTarget = null;
	const reportError = (message, err) => {
		const error = (selectedTarget ? selectedTarget.runtime : runtime)?.error ?? console.error;
		const ownerAccountId = selectedTarget?.accountId ?? accountId;
		error(`${ownerAccountId === void 0 ? "feishu" : `feishu[${ownerAccountId}]`}: ${message}: ${String(err)}`);
	};
	res.once("close", () => {
		recordWebhookStatus(selectedTarget ? selectedTarget.runtime : runtime, selectedTarget?.accountId ?? accountId, selectedTarget?.rawPath ?? path, res.statusCode);
	});
	res.once("finish", () => {
		if (res.statusCode >= 200 && res.statusCode < 300) {
			const inboundAt = Date.now();
			selectedTarget?.statusSink?.({
				lastEventAt: inboundAt,
				lastTransportActivityAt: inboundAt
			});
		}
	});
	const rateLimitKey = buildFeishuWebhookRateLimitKey({
		accountId,
		path,
		clientIp: resolveRequestClientIp(req)
	});
	if (!applyBasicWebhookRequestGuards({
		req,
		res,
		allowMethods: ["POST"],
		rateLimiter: feishuWebhookRateLimiter,
		rateLimitKey,
		nowMs: Date.now(),
		requireJsonContentType: true
	})) return;
	if (!preAuthInFlightLimiter.tryAcquire(preAuthInFlightKey)) {
		sendHttpRequestRejection(req, res, 429, "Rate limit exceeded", "text/plain; charset=utf-8").catch((err) => {
			reportError("webhook concurrency rejection failed", err);
		});
		return;
	}
	try {
		let rawBody;
		try {
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			const body = await readWebhookBodyOrReject({
				req,
				res,
				maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
				timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS,
				profile: "pre-auth"
			});
			if (!body.ok || res.writableEnded) return;
			rawBody = body.value;
			const matchesSignature = (target) => isFeishuWebhookSignatureValid({
				headers: req.headers,
				rawBody,
				encryptKey: target.encryptKey
			});
			const match = resolveSingleWebhookTarget(targets, (target) => !target.abortSignal?.aborted && matchesSignature(target));
			if (match.kind === "none" && targets.some((target) => target.abortSignal?.aborted && matchesSignature(target))) {
				res.setHeader("Retry-After", "1");
				respondText(res, 503, "plugin route is restarting; retry");
				return;
			}
			if (match.kind !== "single") {
				respondText(res, 401, match.kind === "ambiguous" ? "ambiguous webhook target" : "Invalid signature");
				return;
			}
			selectedTarget = match.target;
			const pendingResponses = selectedTarget.pendingResponses;
			pendingResponses.set(res, new Promise((resolve) => {
				const complete = () => {
					res.off("finish", complete);
					res.off("close", complete);
					pendingResponses.delete(res);
					resolve();
				};
				res.once("finish", complete);
				res.once("close", complete);
			}));
		} finally {
			preAuthInFlightLimiter.release(preAuthInFlightKey);
		}
		const { encryptKey, eventDispatcher, invokeWebhookEvent } = selectedTarget;
		const payload = safeParseJson(rawBody);
		if (!isRecord(payload)) {
			respondText(res, 400, "Invalid JSON");
			return;
		}
		const { isChallenge, challenge } = Lark.generateChallenge(payload, { encryptKey });
		if (isChallenge) {
			sendJson(res, 200, challenge);
			return;
		}
		const envelope = buildFeishuWebhookEnvelope(req, payload);
		const invocation = invokeWebhookEvent ? await invokeWebhookEvent(envelope, { needCheck: false }) : {
			kind: "non-durable",
			value: await eventDispatcher.invoke(envelope, { needCheck: false })
		};
		if (!res.headersSent) {
			if (invocation.kind === "durable") res.setHeader(FEISHU_WEBHOOK_ACCEPTED_HEADER, FEISHU_WEBHOOK_ACCEPTED_VALUE);
			sendJson(res, 200, invocation.value);
		}
	} catch (err) {
		reportError("webhook handler error", err);
		if (!res.headersSent) respondText(res, 500, "Internal Server Error");
	}
}
async function monitorWebhook(params) {
	const { account, accountId, runtime, statusSink } = params;
	const stopped = new AbortController();
	const abortSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, stopped.signal]) : stopped.signal;
	const legacyListener = resolveFeishuLegacyWebhookListener(account.config);
	const encryptKey = account.encryptKey?.trim();
	if (!encryptKey) throw new Error(`Feishu account "${accountId}" webhook mode requires encryptKey`);
	const rawPath = account.config.webhookPath;
	if (normalizeFeishuWebhookPath(rawPath) !== rawPath) throw new Error(`Feishu account "${accountId}" webhookPath must be a normalized HTTP request path; run "openclaw doctor --fix" to repair it`);
	const pathConflict = describeFeishuWebhookPathConflict(rawPath);
	if (pathConflict && !legacyListener) throw new Error(`Feishu account "${accountId}" ${pathConflict}`);
	let webhookTargets = webhookTargetsStore.tryGetRuntime();
	if (!webhookTargets) {
		webhookTargets = /* @__PURE__ */ new Map();
		webhookTargetsStore.setRuntime(webhookTargets);
	}
	const path = canonicalizeWebhookRouteKey(rawPath);
	const preAuthInFlightLimiter = webhookTargets.get(path)?.[0]?.preAuthInFlightLimiter ?? createWebhookInFlightLimiter({ maxInFlightPerKey: FEISHU_PRE_AUTH_MAX_IN_FLIGHT });
	const registration = registerWebhookTarget(webhookTargets, {
		...params,
		abortSignal,
		path,
		rawPath,
		legacyListener,
		encryptKey,
		preAuthInFlightLimiter,
		pendingResponses: /* @__PURE__ */ new Map()
	});
	let unregisterRoute;
	const cleanup = async () => {
		stopped.abort();
		const pendingResponses = registration.target.pendingResponses;
		if (pendingResponses.size > 0) {
			if ((await raceWithTimeoutAndAbort(Promise.all(pendingResponses.values()), { timeoutMs: FEISHU_WEBHOOK_CLOSE_TIMEOUT_MS })).status === "timeout") for (const response of pendingResponses.keys()) response.destroy();
		}
		if (![...webhookTargets.values()].some((targets) => targets.some((target) => target !== registration.target && target.accountId === accountId && !target.abortSignal?.aborted))) clearFeishuBotIdentityState(accountId);
		registration.unregister();
		unregisterRoute?.();
	};
	if (abortSignal.aborted) {
		await cleanup();
		return;
	}
	try {
		unregisterRoute = registerPluginHttpRoute({
			path,
			auth: "plugin",
			pluginId: "feishu",
			source: "webhook",
			accountId,
			handler: (req, res) => handleFeishuWebhook(req, res, webhookTargets),
			reuseExistingSameOwner: true,
			throwOnFailure: true,
			legacyListener,
			log: runtime?.log
		});
		if (abortSignal.aborted) return;
		const connectedAt = Date.now();
		statusSink?.(channelReadyPatch({
			lastConnectedAt: connectedAt,
			lastEventAt: connectedAt
		}));
		runtime?.log(pathConflict ? `feishu[${accountId}]: ${pathConflict} The legacy listener keeps the old path working; move the path and callback before removing the legacyWebhook pin.` : `feishu[${accountId}]: webhook registered on Gateway port ${params.gatewayPort ?? 18789} at ${rawPath}; point the Feishu callback URL or reverse-proxy upstream to this Gateway route. ${legacyListener ? `The legacy listener on ${legacyListener.host}:${legacyListener.port} forwards here; remove the legacyWebhook pin after verifying delivery through the Gateway, or use legacyWebhook:false to override an inherited endpoint.` : "No legacy listener is configured."}`);
		await waitUntilAbort(abortSignal);
	} finally {
		await cleanup();
	}
}
// extensions/feishu/src/monitor.vc-meeting-invited-handler.ts
const FEISHU_MEETING_NUMBER_PATTERN = /^\d{9}$/;
function parseInviteTimestamp(value) {
	const parsed = Number.parseInt(value ?? "", 10);
	if (!Number.isFinite(parsed) || parsed <= 0) return Date.now();
	return parsed < 1e10 ? parsed * 1e3 : parsed;
}
function createFeishuVcMeetingInvitedHandler(params) {
	const { cfg, accountId, runtime, fireAndForget, autoJoin } = params;
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const handle = async (data) => {
		if (params.abortSignal?.aborted || params.isAccountActive?.() === false) return;
		if (!autoJoin) {
			log(`feishu[${accountId}]: ignoring vc meeting invite (vcAutoJoin=false)`);
			return;
		}
		try {
			const invite = data;
			const meetingNo = normalizeOptionalString(invite.meeting?.meeting_no);
			const id = invite.inviter?.id;
			const openId = normalizeOptionalString(id?.open_id);
			const userId = normalizeOptionalString(id?.user_id);
			const unionId = normalizeOptionalString(id?.union_id);
			const senderId = openId ?? userId;
			if (!meetingNo || !FEISHU_MEETING_NUMBER_PATTERN.test(meetingNo) || !senderId) {
				log(`feishu[${accountId}]: vc meeting invited event has invalid meeting_no or inviter identity, skipping`);
				return;
			}
			const eventId = normalizeOptionalString(invite.event_id);
			const inviteTime = normalizeOptionalString(invite.invite_time);
			const callId = normalizeOptionalString(invite.call_id);
			const turnId = eventId ? `vc-invited:event:${eventId}` : `vc-invited:${meetingNo}:${inviteTime ?? crypto$1.randomUUID()}`;
			const basePrompt = `Use the available tool to join the meeting with meeting number ${meetingNo} immediately. Do not ask for confirmation.`;
			const prompt = callId ? `${basePrompt} If the join tool supports a call_id parameter, pass call_id=${JSON.stringify(callId)}; otherwise join by meeting number only.` : basePrompt;
			const event = setFeishuSyntheticDirectPreDispatchTarget({
				sender: { sender_id: {
					...openId ? { open_id: openId } : {},
					...userId ? { user_id: userId } : {},
					...unionId ? { union_id: unionId } : {}
				} },
				message: {
					message_id: turnId,
					chat_id: senderId,
					chat_type: "p2p",
					message_type: "text",
					content: JSON.stringify({ text: prompt }),
					create_time: String(parseInviteTimestamp(inviteTime)),
					suppress_reply_target: true
				}
			}, `user:${senderId}`);
			const claim = await claimUnprocessedFeishuMessage({
				messageId: resolveFeishuMessageDedupeKey(event),
				namespace: accountId,
				log
			});
			if (claim.kind !== "claimed") return;
			if (params.abortSignal?.aborted || params.isAccountActive?.() === false) {
				claim.handle.release({ error: /* @__PURE__ */ new Error("Feishu account stopped before VC dispatch") });
				return;
			}
			const processingClaim = claim.handle;
			const { abortSignal, isAccountActive, trackTask } = params;
			const cancellation = new AbortController();
			const settled = createDeferred();
			let handedOff = false;
			let released = false;
			let adoption;
			const abandon = () => {
				if (released || adoption) return;
				released = true;
				abortSignal?.removeEventListener("abort", abandon);
				const abandonReason = abortSignal?.reason ?? /* @__PURE__ */ new Error("Feishu VC invitation abandoned before adoption");
				cancellation.abort(abandonReason);
				processingClaim.release({ error: abandonReason });
				settled.resolve();
			};
			trackTask?.(settled.promise);
			abortSignal?.addEventListener("abort", abandon, { once: true });
			if (abortSignal?.aborted) abandon();
			const lifecycle = {
				abortSignal: cancellation.signal,
				onAdopted: () => {
					if (adoption) return adoption;
					if (isAccountActive?.() === false) abandon();
					cancellation.signal.throwIfAborted();
					handedOff = true;
					abortSignal?.removeEventListener("abort", abandon);
					adoption = Promise.resolve().then(async () => {
						await processingClaim.commit();
					}).finally(() => settled.resolve());
					return adoption;
				},
				onDeferred: () => {
					handedOff = true;
				},
				onAdoptionFinalizing: () => {
					handedOff = true;
				},
				onAbandoned: abandon
			};
			try {
				await handleFeishuMessage({
					trackTask: params.trackTask,
					cfg,
					accountId,
					event,
					runtime,
					channelRuntime: params.channelRuntime,
					turnAdoptionLifecycle: lifecycle
				});
			} catch (dispatchError) {
				await lifecycle.onAbandoned();
				throw dispatchError;
			} finally {
				if (!handedOff) abandon();
				await adoption;
			}
		} catch (err) {
			error(`feishu[${accountId}]: error handling vc meeting invited event: ${String(err)}`);
		}
	};
	return (data) => {
		const task = handle(data);
		params.trackTask?.(task);
		return fireAndForget ? Promise.resolve() : task;
	};
}
// extensions/feishu/src/sequential-key.ts
function getFeishuSequentialKey(params) {
	const { accountId, event, botOpenId, preparedContent, isControlCommandMessage } = params;
	const baseKey = `feishu:${accountId}:${event.message.chat_id?.trim() || "unknown"}`;
	const text = normalizeFeishuCommandProbeBody(preparedContent ?? parseFeishuMessageEvent(event, botOpenId).content);
	if (isAbortRequestText(text)) return `${baseKey}:control`;
	if (isBtwRequestText(text)) return `${baseKey}:btw`;
	return isControlCommandMessage(text) ? `${baseKey}:commands` : baseKey;
}
// extensions/feishu/src/monitor.account.ts
const FEISHU_QUICK_ACTION_CARD_TTL_MS = 6e5;
const QUICK_ACTION_MENU_KEYS = /* @__PURE__ */ new Set([
	"quick-actions",
	"quick_actions",
	"launcher"
]);
const FEISHU_REACTION_VERIFY_TIMEOUT_MS = 1500;
async function resolveReactionSyntheticEvent(params) {
	const { cfg, accountId, event, botOpenId, logger, action = "created" } = params;
	const emoji = event.reaction_type?.emoji_type;
	const messageId = event.message_id;
	const senderOpenId = event.user_id?.open_id?.trim();
	const senderUserId = event.user_id?.user_id?.trim();
	const senderId = senderOpenId || senderUserId;
	if (!emoji || !messageId || !senderId) return null;
	const { resolveFeishuAccount } = await import("./doctor-contract-ItAh0keT.mjs").then((n) => n.l);
	const account = resolveFeishuAccount({
		cfg,
		accountId
	});
	const reactionNotifications = account.config.reactionNotifications;
	if (reactionNotifications === "off" || event.operator_type === "app" || senderId === botOpenId || emoji === "Typing") return null;
	if (reactionNotifications === "own" && !botOpenId) {
		logger?.(`feishu[${accountId}]: bot open_id unavailable, skipping reaction ${emoji} on ${messageId}`);
		return null;
	}
	const reactedMsg = await raceWithTimeoutAndAbort(getMessageFeishu({
		cfg,
		messageId,
		accountId
	}), { timeoutMs: FEISHU_REACTION_VERIFY_TIMEOUT_MS }).then((result) => result.status === "resolved" ? result.value : null).catch(() => null);
	const isBotMessage = reactedMsg?.senderType === "app" || reactedMsg?.senderOpenId === botOpenId;
	if (!reactedMsg || reactionNotifications === "own" && !isBotMessage) {
		logger?.(`feishu[${accountId}]: ignoring reaction on non-bot/unverified message ${messageId} (sender: ${reactedMsg?.senderOpenId ?? "unknown"})`);
		return null;
	}
	const syntheticChatIdRaw = event.chat_id?.trim() || reactedMsg.chatId?.trim();
	let resolvedChatType = normalizeFeishuEventChatType(event.chat_type) ?? reactedMsg.chatType;
	if (!resolvedChatType && syntheticChatIdRaw) {
		const chatInfo = await raceWithTimeoutAndAbort(getChatInfo(createFeishuClient(account), syntheticChatIdRaw), { timeoutMs: FEISHU_REACTION_VERIFY_TIMEOUT_MS }).catch(() => null);
		resolvedChatType = chatInfo?.status === "resolved" ? resolveFeishuChatType(chatInfo.value) : void 0;
	}
	if (!resolvedChatType) {
		logger?.(`feishu[${accountId}]: skipping reaction ${emoji} on ${messageId} without chat type context`);
		return null;
	}
	return {
		sender: {
			sender_id: {
				...senderOpenId ? { open_id: senderOpenId } : {},
				...senderUserId ? { user_id: senderUserId } : {}
			},
			sender_type: "user"
		},
		message: {
			message_id: `${messageId}:reaction:${emoji}:${crypto$1.randomUUID()}`,
			reply_target_message_id: messageId,
			typing_target_message_id: messageId,
			...reactedMsg.rootId ? { root_id: reactedMsg.rootId } : {},
			...reactedMsg.threadId ? { thread_id: reactedMsg.threadId } : {},
			chat_id: syntheticChatIdRaw || `p2p:${senderId}`,
			chat_type: resolvedChatType,
			message_type: "text",
			content: JSON.stringify({ text: action === "deleted" ? `[removed reaction ${emoji} from message ${messageId}]` : `[reacted with ${emoji} to message ${messageId}]` })
		}
	};
}
function parseFeishuBotAddedEventPayload(value) {
	if (!isRecord(value) || !readStringValue(value.chat_id) || !isRecord(value.operator_id)) return null;
	return value;
}
function parseFeishuBotRemovedChatId(value) {
	if (!isRecord(value)) return null;
	return readStringValue(value.chat_id) ?? null;
}
function firstString(...values) {
	for (const value of values) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed) return trimmed;
	}
}
function parseFeishuCardActionEventPayload(value) {
	if (!isRecord(value)) return null;
	const operator = isRecord(value.operator) ? value.operator : {};
	const action = value.action;
	const context = isRecord(value.context) ? value.context : {};
	if (!isRecord(action)) return null;
	const operatorUserId = isRecord(operator.user_id) ? operator.user_id : void 0;
	const token = readStringValue(value.token);
	const openId = firstString(operator.open_id, operatorUserId?.open_id, value.open_id, context.open_id);
	const userId = firstString(operator.user_id, operatorUserId?.user_id, value.user_id, context.user_id);
	const unionId = firstString(operator.union_id, operatorUserId?.union_id);
	const tag = readStringValue(action.tag);
	const actionValue = action.value;
	const openMessageId = firstString(context.open_message_id, value.open_message_id);
	const contextOpenId = firstString(context.open_id, openId);
	const contextUserId = firstString(context.user_id, userId);
	const chatId = firstString(context.chat_id, context.open_chat_id);
	if (!token || !openId || !tag || !isRecord(actionValue)) return null;
	return {
		operator: {
			open_id: openId,
			...userId ? { user_id: userId } : {},
			...unionId ? { union_id: unionId } : {}
		},
		token,
		action: {
			value: actionValue,
			tag
		},
		...openMessageId ? { open_message_id: openMessageId } : {},
		context: {
			...openMessageId ? { open_message_id: openMessageId } : {},
			...contextOpenId ? { open_id: contextOpenId } : {},
			...contextUserId ? { user_id: contextUserId } : {},
			...chatId ? { chat_id: chatId } : {}
		}
	};
}
async function monitorSingleAccount(params) {
	const { cfg, account, runtime, abortSignal } = params;
	const { accountId } = account;
	const log = runtime?.log ?? console.log;
	const botOpenIdSource = params.botOpenIdSource ?? { kind: "fetch" };
	const botIdentity = botOpenIdSource.kind === "prefetched" ? {
		botOpenId: botOpenIdSource.botOpenId,
		source: botOpenIdSource.source
	} : await fetchBotIdentityForMonitor(account, {
		runtime,
		abortSignal
	});
	const botOpenId = applyBotIdentityState(accountId, botIdentity);
	log(`feishu[${accountId}]: bot open_id resolved: ${botOpenId ?? "unknown"}`);
	if ((!botOpenId || botIdentity.source === "cache") && !abortSignal?.aborted) startBotIdentityRecovery({
		account,
		accountId,
		runtime,
		abortSignal,
		currentSource: botIdentity.source
	});
	const connectionMode = account.config.connectionMode;
	if (connectionMode === "webhook" && !account.verificationToken?.trim()) throw new Error(`Feishu account "${accountId}" webhook mode requires verificationToken`);
	if (connectionMode === "webhook" && !account.encryptKey?.trim()) throw new Error(`Feishu account "${accountId}" webhook mode requires encryptKey`);
	const warmupCount = await warmupDedupFromPluginState(accountId, log);
	if (abortSignal?.aborted) return;
	if (warmupCount > 0) log(`feishu[${accountId}]: dedup warmup loaded ${warmupCount} entries from plugin state`);
	let threadBindingManager;
	const accountStopped = new AbortController();
	const accountAbortSignal = abortSignal ? AbortSignal.any([abortSignal, accountStopped.signal]) : accountStopped.signal;
	const pendingTasks = /* @__PURE__ */ new Set();
	const trackTask = (task) => {
		pendingTasks.add(task);
		task.then(() => pendingTasks.delete(task), () => pendingTasks.delete(task));
	};
	try {
		const eventDispatcher = createEventDispatcher(account);
		const durableIngress = createFeishuDurableIngress({
			accountId,
			dispatcher: eventDispatcher,
			...account.encryptKey ? { encryptKey: account.encryptKey } : {},
			runtime: runtime ?? {}
		});
		const durableEventDispatcher = Object.assign(Object.create(eventDispatcher), { invoke: durableIngress.invoke });
		const chatHistories = /* @__PURE__ */ new Map();
		threadBindingManager = createFeishuThreadBindingManager({
			accountId,
			cfg
		});
		const channelRuntime = params.channelRuntime?.inbound ? params.channelRuntime : getFeishuRuntime().channel;
		const context = {
			cfg,
			accountId,
			channelRuntime,
			runtime,
			chatHistories,
			fireAndForget: params.fireAndForget ?? true,
			isAccountActive: () => !accountAbortSignal.aborted,
			trackTask,
			vcAutoJoin: account.config.vcAutoJoin === true,
			abortSignal: accountAbortSignal,
			resolveIngressLifecycle: durableIngress.resolveLifecycle,
			...params.statusSink ? { statusSink: params.statusSink } : {}
		};
		const fireAndForget = context.fireAndForget;
		const eventLog = runtime?.log ?? console.log;
		const error = runtime?.error ?? console.error;
		const runFeishuHandler = async (operation) => {
			if (!context.isAccountActive()) return;
			const task = operation.task();
			context.trackTask(task);
			const handled = task.catch((err) => {
				error(`${operation.errorMessage}: ${String(err)}`);
			});
			if (!fireAndForget) await handled;
		};
		const handleReaction = (data, action) => runFeishuHandler({
			errorMessage: `feishu[${accountId}]: error handling reaction ${action === "deleted" ? "removal event" : "event"}`,
			task: async () => {
				const myBotId = botOpenIds.get(accountId);
				const syntheticEvent = await resolveReactionSyntheticEvent({
					cfg,
					accountId,
					event: data,
					botOpenId: myBotId,
					logger: eventLog,
					action
				});
				if (!syntheticEvent || !context.isAccountActive()) return;
				await handleFeishuMessage({
					trackTask: context.trackTask,
					cfg,
					event: syntheticEvent,
					botOpenId: myBotId,
					runtime,
					channelRuntime,
					chatHistories,
					accountId
				});
			}
		});
		const handleBotMembership = async (data, action) => {
			try {
				const chatId = action === "added" ? parseFeishuBotAddedEventPayload(data)?.chat_id : parseFeishuBotRemovedChatId(data);
				if (chatId) eventLog(`feishu[${accountId}]: bot ${action === "added" ? "added to" : "removed from"} chat ${chatId}`);
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot ${action} event: ${String(err)}`);
			}
		};
		const handleBotMenu = async (data) => {
			try {
				if (!context.isAccountActive()) return;
				if (!isRecord(data) || !isRecord(data.operator) || !isRecord(data.operator.operator_id)) return;
				const operatorId = data.operator.operator_id;
				const operatorOpenId = readStringValue(operatorId.open_id)?.trim();
				const eventKey = readStringValue(data.event_key)?.trim();
				if (!operatorOpenId || !eventKey) return;
				const syntheticEvent = {
					sender: {
						sender_id: {
							open_id: operatorOpenId,
							user_id: readStringValue(operatorId.user_id),
							union_id: readStringValue(operatorId.union_id)
						},
						sender_type: "user"
					},
					message: {
						message_id: `bot-menu:${eventKey}:${typeof data.timestamp === "string" || typeof data.timestamp === "number" ? data.timestamp : Date.now()}`,
						suppress_reply_target: true,
						chat_id: `p2p:${operatorOpenId}`,
						chat_type: "p2p",
						message_type: "text",
						content: JSON.stringify({ text: `/menu ${eventKey}` })
					}
				};
				const syntheticMessageId = syntheticEvent.message.message_id;
				const claim = await claimUnprocessedFeishuMessage({
					messageId: syntheticMessageId,
					namespace: accountId,
					log: eventLog
				});
				if (!context.isAccountActive()) {
					if (claim.kind === "claimed") claim.handle.release({ error: /* @__PURE__ */ new Error("feishu account stopped before menu dispatch") });
					return;
				}
				if (claim.kind === "duplicate") return;
				if (claim.kind === "inflight") return;
				const handleLegacyMenu = () => handleFeishuMessage({
					trackTask: context.trackTask,
					cfg,
					event: syntheticEvent,
					botOpenId: botOpenIds.get(accountId),
					runtime,
					channelRuntime,
					chatHistories,
					accountId,
					processingClaim: claim.kind === "claimed" ? claim.handle : void 0
				});
				const promise = (async () => {
					let handledMenu = false;
					if (QUICK_ACTION_MENU_KEYS.has(normalizeOptionalLowercaseString(eventKey) ?? "")) {
						const expiresAt = Date.now() + FEISHU_QUICK_ACTION_CARD_TTL_MS;
						try {
							const launcherContext = buildFeishuCardInteractionContext({
								operatorOpenId,
								expiresAt,
								chatType: "p2p"
							});
							await sendCardFeishu({
								cfg,
								to: `user:${operatorOpenId}`,
								card: buildFeishuActionCard({
									title: "Quick actions",
									template: "indigo",
									content: "Run common actions without typing raw commands.",
									actions: [buildFeishuCardButton({
										label: "Help",
										value: createFeishuCardInteractionEnvelope({
											k: "quick",
											a: "feishu.quick_actions.help",
											q: "/help",
											c: launcherContext
										})
									}), ...[{
										label: "New session",
										type: "primary",
										command: "/new",
										prompt: "Start a fresh session? This will reset the current chat context."
									}, {
										label: "Reset",
										type: "danger",
										command: "/reset",
										prompt: "Reset this session now? Any active conversation state will be cleared."
									}].map(({ label, type, command, prompt }) => buildFeishuCardButton({
										label,
										type,
										value: createFeishuCardInteractionEnvelope({
											k: "meta",
											a: FEISHU_APPROVAL_REQUEST_ACTION,
											m: {
												command,
												prompt
											},
											c: launcherContext
										})
									}))]
								}),
								accountId
							});
							handledMenu = true;
						} catch (err) {
							runtime?.log(`feishu[${accountId ?? "default"}]: failed to open quick-action launcher for ${operatorOpenId}: ${String(err)}`);
						}
					}
					if (handledMenu) {
						runtime?.log(`feishu[${accountId ?? "default"}]: opened quick-action launcher for ${operatorOpenId}`);
						if (claim.kind === "claimed") await claim.handle.commit();
						return;
					}
					if (!context.isAccountActive()) {
						if (claim.kind === "claimed") claim.handle.release({ error: /* @__PURE__ */ new Error("feishu account stopped before menu dispatch") });
						return;
					}
					return handleLegacyMenu();
				})().catch(async (err) => {
					if (claim.kind === "claimed") await claim.handle.commit();
					throw err;
				});
				context.trackTask(promise);
				if (fireAndForget) {
					promise.catch((err) => {
						error(`feishu[${accountId}]: error handling bot menu event: ${String(err)}`);
					});
					return;
				}
				await promise;
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot menu event: ${String(err)}`);
			}
		};
		eventDispatcher.register({
			"im.message.receive_v1": createFeishuMessageReceiveHandler({
				...context,
				handleMessage: handleFeishuMessage,
				resolveDebounceText: ({ event, botOpenId: messageBotOpenId }) => parseFeishuMessageEvent(event, messageBotOpenId).content,
				hasProcessedMessage: hasProcessedFeishuMessage,
				getBotOpenId: (id) => botOpenIds.get(id),
				resolveSequentialKey: getFeishuSequentialKey
			}),
			"im.message.message_read_v1": async () => {},
			"im.chat.access_event.bot_p2p_chat_entered_v1": async () => {},
			"im.chat.member.bot.added_v1": (data) => handleBotMembership(data, "added"),
			"im.chat.member.bot.deleted_v1": (data) => handleBotMembership(data, "removed"),
			"drive.notice.comment_add_v1": createFeishuDriveCommentNoticeHandler(context),
			"vc.bot.meeting_invited_v1": createFeishuVcMeetingInvitedHandler({
				...context,
				autoJoin: context.vcAutoJoin
			}),
			"im.message.reaction.created_v1": (data) => handleReaction(data, "created"),
			"im.message.reaction.deleted_v1": (data) => handleReaction(data, "deleted"),
			"application.bot.menu_v6": (data) => {
				const task = handleBotMenu(data);
				context.trackTask(task);
				return task;
			},
			"card.action.trigger": async (data) => {
				await runFeishuHandler({
					errorMessage: `feishu[${accountId}]: error handling card action`,
					task: async () => {
						const event = parseFeishuCardActionEventPayload(data);
						if (!event) {
							error(`feishu[${accountId}]: ignoring malformed card action payload`);
							return;
						}
						await handleFeishuCardAction({
							cfg,
							event,
							botOpenId: botOpenIds.get(accountId),
							runtime,
							channelRuntime,
							accountId,
							trackTask: context.trackTask
						});
					}
				});
			}
		});
		try {
			durableIngress.start();
			if (connectionMode === "webhook") return await monitorWebhook({
				gatewayPort: (0, gateway_config_runtime_exports.resolveGatewayPort)(cfg),
				account,
				accountId,
				runtime,
				abortSignal,
				eventDispatcher: durableEventDispatcher,
				invokeWebhookEvent: durableIngress.invokeWebhook,
				...params.statusSink ? { statusSink: params.statusSink } : {}
			});
			return await monitorWebSocket({
				account,
				accountId,
				runtime,
				abortSignal,
				eventDispatcher: durableEventDispatcher,
				setSocketTerminator: durableIngress.setSocketTerminator,
				...params.statusSink ? { statusSink: params.statusSink } : {}
			});
		} finally {
			accountStopped.abort(/* @__PURE__ */ new Error("Feishu account stopped"));
			try {
				await durableIngress.stop();
			} finally {
				while (pendingTasks.size > 0) await Promise.allSettled(pendingTasks);
			}
		}
	} finally {
		threadBindingManager?.stop();
	}
}
export { monitorSingleAccount, resolveReactionSyntheticEvent };
