import { o as resolveFeishuAccount, s as resolveFeishuRuntimeAccount } from "./accounts-DmU0xYPx.mjs";
import { o as resolveConfiguredFeishuGroupSessionScope, t as buildFeishuConversationId, u as resolveReceiveIdType } from "./conversation-id-H-lUayji.mjs";
import { A as sendMessageFeishu, At as normalizeFeishuChatType, B as parsePostContent, Ct as normalizeFeishuAllowEntry, D as getMessageFeishu, Dt as resolveFeishuGroupSenderActivationIngressAccess, Et as resolveFeishuGroupConversationIngressAccess, F as isFeishuBroadcastMention, Ft as decodeFeishuCardAction, G as deliverCommentThreadText, H as buildFeishuMediaFallbackText, I as isMentionForwardRequest, L as isFeishuGroupChatType, N as formatFeishuMediaContent, Nt as buildFeishuCardActionTextFallback, O as listFeishuThreadMessages, P as extractMentionTargets, Pt as createFeishuCardInteractionEnvelope, R as normalizeFeishuEventChatType, S as sendMediaFeishu, St as hasExplicitFeishuGroupConfig, T as chunkFeishuCardMarkdown, Tt as resolveFeishuGroupConfig, U as resolveFeishuIdentityEmoji, a as shouldSendNoVisibleReplyFallback, at as requestFeishuApi, b as withinCardTableLimit, d as consumeFeishuPresentationFallbackMarker, et as createCommentTypingReactionLifecycle, ft as chunkFeishuPostMarkdown, i as noVisibleFeishuReplyDelivery, it as parseCommentContentElements, j as sendStructuredCardFeishu, jt as resolveFeishuChatType, k as sendCardFeishu, kt as resolveFeishuReplyPolicy, n as createFeishuReplyDeliveryResult, nt as extractReplyText, ot as buildFeishuCommentTarget, pt as materializeFeishuPostMarkdownSoftBreaks, r as mergeFeishuReplyDeliveryResults, st as normalizeCommentFileType, t as createFeishuPartialReplyDeliveryError, tt as encodeQuery, u as buildFeishuPresentationFallback, ut as resolveFeishuCardTemplate, v as renderFeishuReplyPayload, w as shouldSuppressFeishuTextForVoiceMedia, wt as resolveFeishuDmIngressAccess, x as saveMessageResourceFeishu, y as resolveFeishuRichReply, z as parseInteractiveCardContent } from "./reply-delivery-result-CRIHpSze.mjs";
import { a as normalizeFeishuWebhookPath, o as normalizeFeishuExternalKey } from "./doctor-contract-w6FpMypv.mjs";
import { t as getFeishuRuntime } from "./runtime-C5JxBWZp.mjs";
import { a as getFeishuUserAgent, f as resolveConfiguredHttpTimeoutMs, i as createFeishuWSClient, n as createEventDispatcher, r as createFeishuClient } from "./client-DCwNVFZg.mjs";
import { r as getChatInfo } from "./chat-BlvUjdN9.mjs";
import { t as createFeishuThreadBindingManager } from "./thread-bindings-BiL1wGqK.mjs";
import { evaluateSupplementalContextVisibility, normalizeAgentId as normalizeAgentId$1, resolveChannelContextVisibilityMode } from "../runtime-api.js";
import { t as readFeishuJsonResponse } from "./json-response-DXajw_FU.mjs";
import { a as waitForAbortableDelay, i as raceWithTimeoutAndAbort } from "./probe-bdidyhAn.mjs";
import { t as fetchBotIdentityForMonitor } from "./monitor-OTT7VckU.mjs";
import { resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageReplyPipeline, createReplyPrefixContext, formatChannelProgressDraftLineForEntry, resolveAgentOutboundIdentity, resolveChannelPreviewStreamMode, resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { ensureConfiguredBindingRouteReady, resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-runtime";
import { collectErrorGraphCandidates, formatErrorMessage, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { asDateTimestampMs, isFutureDateTimestampMs, parseStrictNonNegativeInteger, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveExpiresAtMsFromDurationSeconds, resolvePromptHistoryLimit, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { asBoolean, asNullableRecord, isRecord, normalizeLowercaseStringOrEmpty, normalizeNullableString, normalizeOptionalLowercaseString, normalizeOptionalString, readStringValue, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { stripReasoningTagsFromText } from "openclaw/plugin-sdk/text-chunking";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { fanInChannelIngressLifecycles } from "openclaw/plugin-sdk/channel-ingress-runtime";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { normalizeAccountId, resolveAgentRoute, resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { formatAgentEnvelope, formatInboundMediaUnavailableText, isChannelPartialDeliveryError, recordChannelBotPairLoopAndCheckSuppression, resolveEnvelopeFormatOptions, resolveInboundReplyDispatchCounts, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { getReplyPayloadTtsSupplement, resolveSendableOutboundReplyParts, resolveTextChunksWithFallback, sendMediaWithLeadingCaption } from "openclaw/plugin-sdk/reply-payload";
import { resolvePinnedMainDmOwnerFromAllowlist, safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import * as Lark from "@larksuiteoapi/node-sdk";
import { isRecord as isRecord$1 } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, applyBasicWebhookRequestGuards, createFixedWindowRateLimiter, createWebhookAnomalyTracker, resolveRequestClientIp } from "openclaw/plugin-sdk/webhook-ingress";
import * as crypto$1 from "node:crypto";
import crypto, { createHash } from "node:crypto";
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { createChannelReplayGuard } from "openclaw/plugin-sdk/persistent-dedupe";
import { resolveChannelConfigWrites } from "openclaw/plugin-sdk/channel-config-writes";
import { formatReasoningMessage, resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import * as http from "node:http";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { channelBlockedPatch, channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { createWebhookInFlightLimiter, installRequestBodyLimitGuard, readWebhookBodyOrReject, sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { isAbortRequestText, isBtwRequestText } from "openclaw/plugin-sdk/command-primitives-runtime";
//#region extensions/feishu/src/bot-agent-body.ts
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
//#endregion
//#region extensions/feishu/src/bot-broadcast.ts
function createFeishuBroadcastIngressSettlement(params) {
	const lanes = /* @__PURE__ */ new Set();
	const failures = [];
	const fallbackAbort = new AbortController();
	let fanoutSettled = false;
	let terminal;
	let adoption;
	let abandonment;
	let finalizing = false;
	let deferred = false;
	let replayReleased = false;
	let resolveSettlement;
	const settlement = new Promise((resolve) => {
		resolveSettlement = resolve;
	});
	params.trackTask?.(settlement);
	const finishSettlement = () => {
		if (![...lanes].some((lane) => lane.adopting)) resolveSettlement();
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
	const releaseReplayClaim = (error) => {
		if (replayReleased || terminal === "adopted") return;
		replayReleased = true;
		params.replayClaim?.release({ error });
	};
	const runAbandonment = async (error) => {
		if (terminal) return;
		releaseReplayClaim(error);
		try {
			await params.lifecycle?.onAbandoned();
		} finally {
			terminal = "abandoned";
			fallbackAbort.abort(error);
			finishSettlement();
		}
	};
	const abandon = async (error) => {
		if (terminal) return;
		if (adoption) {
			await adoption.catch(() => void 0);
			if (terminal) return;
		}
		const activeAbandonment = abandonment ?? runAbandonment(error);
		abandonment = activeAbandonment;
		await activeAbandonment;
	};
	const runAdoption = async () => {
		try {
			beginFinalizing();
			await params.lifecycle?.onAdopted();
			terminal = "adopted";
			try {
				params.onAdopted?.();
			} catch {}
			try {
				await params.replayClaim?.commit();
			} catch (error) {
				reportReplayCommitError(error);
			}
		} catch (error) {
			await runAbandonment(error).catch(() => void 0);
			throw error;
		} finally {
			finishSettlement();
		}
	};
	const adopt = async () => {
		if (terminal) return;
		if (abandonment) {
			await abandonment.catch(() => void 0);
			if (terminal) return;
		}
		const activeAdoption = adoption ?? runAdoption();
		adoption = activeAdoption;
		await activeAdoption;
	};
	const maybeSettle = async () => {
		if (!fanoutSettled || terminal) return;
		if (failures.length > 0 || [...lanes].some((lane) => lane.status === "failed" || lane.status === "abandoned")) {
			await abandon(failures.length === 1 ? failures[0] : new AggregateError(failures, "Feishu broadcast dispatch failed"));
			return;
		}
		if ([...lanes].some((lane) => lane.status === "pending" || lane.status === "deferred" || lane.status === "adopted")) return;
		await adopt();
	};
	return {
		createLane: (replayClaim) => {
			const lane = {
				replayClaim,
				status: "pending"
			};
			lanes.add(lane);
			const releaseLane = (error) => {
				lane.replayClaim?.release({ error });
			};
			return {
				lifecycle: {
					abortSignal: params.lifecycle?.abortSignal ?? fallbackAbort.signal,
					onAdopted: async () => {
						if (terminal || lane.status === "adopted" || lane.status === "completed" || lane.status === "failed" || lane.status === "abandoned") return;
						lane.status = "adopted";
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
						if (lane.status === "completed" || lane.status === "failed" || lane.status === "abandoned") return;
						lane.status = "abandoned";
						releaseLane(/* @__PURE__ */ new Error("feishu-broadcast-turn-abandoned"));
						await maybeSettle();
					}
				},
				onDispatchComplete: async (dispatched) => {
					if (!dispatched && lane.status === "pending") {
						const error = /* @__PURE__ */ new Error("feishu broadcast lane was not dispatched");
						lane.status = "failed";
						failures.push(error);
						releaseLane(error);
						return;
					}
					if (lane.status !== "pending") return;
					const error = /* @__PURE__ */ new Error("feishu broadcast dispatch returned before turn adoption");
					lane.status = "failed";
					failures.push(error);
					releaseLane(error);
				},
				onDispatchFailed: async (error) => {
					failures.push(error);
					if (lane.status !== "completed") {
						lane.status = "failed";
						releaseLane(error);
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
function resolveBroadcastAgents(cfg, peerId) {
	const broadcast = cfg.broadcast;
	if (!broadcast || typeof broadcast !== "object") return null;
	const agents = broadcast[peerId];
	return Array.isArray(agents) && agents.length > 0 ? agents : null;
}
function buildBroadcastSessionKey(baseSessionKey, originalAgentId, targetAgentId) {
	const prefix = `agent:${originalAgentId}:`;
	return baseSessionKey.startsWith(prefix) ? `agent:${targetAgentId}:${baseSessionKey.slice(prefix.length)}` : baseSessionKey;
}
//#endregion
//#region extensions/feishu/src/bot-content.ts
function resolveFeishuGroupSession(params) {
	const { chatId, senderOpenId, messageId, rootId, threadId, chatType, groupConfig, feishuCfg } = params;
	const normalizedThreadId = threadId?.trim();
	const normalizedRootId = rootId?.trim();
	const threadReply = Boolean(normalizedThreadId || normalizedRootId);
	const replyInThread = (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled" || threadReply;
	const legacyTopicSessionMode = groupConfig?.topicSessionMode ?? feishuCfg?.topicSessionMode ?? "disabled";
	const groupSessionScope = groupConfig?.groupSessionScope ?? feishuCfg?.groupSessionScope ?? (legacyTopicSessionMode === "enabled" ? "group_topic" : "group");
	const topicScope = groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender" ? (chatType === "topic_group" ? normalizedThreadId ?? normalizedRootId : void 0) ?? normalizedRootId ?? normalizedThreadId ?? (replyInThread ? messageId : null) : null;
	let peerId;
	switch (groupSessionScope) {
		case "group_sender":
			peerId = buildFeishuConversationId({
				chatId,
				scope: "group_sender",
				senderOpenId
			});
			break;
		case "group_topic":
			peerId = topicScope ? buildFeishuConversationId({
				chatId,
				scope: "group_topic",
				topicId: topicScope
			}) : chatId;
			break;
		case "group_topic_sender":
			peerId = topicScope ? buildFeishuConversationId({
				chatId,
				scope: "group_topic_sender",
				topicId: topicScope,
				senderOpenId
			}) : buildFeishuConversationId({
				chatId,
				scope: "group_sender",
				senderOpenId
			});
			break;
		default: peerId = chatId;
	}
	return {
		peerId,
		parentPeer: topicScope && (groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender") ? {
			kind: "group",
			id: chatId
		} : null,
		groupSessionScope,
		replyInThread,
		threadReply
	};
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
				if (typeof share.body === "string" && share.body.trim()) return share.body.trim();
				if (typeof share.summary === "string" && share.summary.trim()) return share.summary.trim();
				if (typeof share.share_chat_id === "string" && share.share_chat_id.trim()) return `[Forwarded message: ${share.share_chat_id.trim()}]`;
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
function normalizeMentions(text, mentions, botStripId) {
	if (!mentions || mentions.length === 0) return text;
	const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const escapeName = (value) => value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	const replacements = /* @__PURE__ */ new Map();
	for (const mention of mentions) {
		const mentionId = mention.id.open_id;
		const replacement = botStripId && mentionId === botStripId ? "" : mentionId ? `<at user_id="${mentionId}">${escapeName(mention.name)}</at>` : `@${mention.name}`;
		replacements.set(mention.key, replacement);
	}
	const keys = [...replacements.keys()].toSorted((a, b) => b.length - a.length).map(escaped);
	return text.replace(new RegExp(keys.join("|"), "g"), (key) => replacements.get(key)).trim();
}
function normalizeFeishuCommandProbeBody(text) {
	if (!text) return "";
	return text.replace(/<at\b[^>]*>[^<]*<\/at>/giu, " ").replace(/(^|\s)@[^/\s]+(?=\s|$|\/)/gu, "$1").replace(/\s+/g, " ").trim();
}
function parseMediaKeys(content, messageType) {
	try {
		const parsed = JSON.parse(content);
		const imageKey = normalizeFeishuExternalKey(parsed.image_key);
		const fileKey = normalizeFeishuExternalKey(parsed.file_key);
		switch (messageType) {
			case "image": return {
				imageKey,
				fileName: parsed.file_name
			};
			case "file":
			case "audio": return {
				fileKey,
				fileName: parsed.file_name
			};
			case "video":
			case "media": return {
				fileKey,
				imageKey,
				fileName: parsed.file_name
			};
			default: return {};
		}
	} catch {
		return {};
	}
}
function toMessageResourceType(messageType) {
	return messageType === "image" ? "image" : "file";
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
	const out = [];
	if (messageType === "post") {
		const { attachments } = parsePostContent(content);
		if (attachments.length === 0) return [];
		log?.(`feishu: post message contains ${attachments.length} embedded attachment(s)`);
		const seenAttachments = /* @__PURE__ */ new Set();
		for (const attachment of attachments) {
			const identity = `${attachment.kind}:${attachment.key}`;
			if (seenAttachments.has(identity)) continue;
			seenAttachments.add(identity);
			const fileName = attachment.kind === "file" ? attachment.fileName : void 0;
			const mediaKind = attachment.kind === "image" ? "image" : "video";
			try {
				const { saved } = await saveMessageResourceFeishu({
					cfg,
					messageId,
					fileKey: attachment.key,
					type: attachment.kind,
					accountId,
					maxBytes,
					...fileName ? { originalFilename: fileName } : {}
				});
				out.push({
					path: saved.path,
					contentType: saved.contentType,
					kind: mediaKind
				});
				log?.(`feishu: downloaded embedded ${attachment.kind} ${attachment.key}, saved to ${saved.path}`);
			} catch (err) {
				out.push({ kind: mediaKind });
				log?.(`feishu: failed to download embedded ${attachment.kind} ${attachment.key}: ${String(err)}`);
			}
		}
		return out;
	}
	const mediaKeys = parseMediaKeys(content, messageType);
	if (!mediaKeys.imageKey && !mediaKeys.fileKey) return [{ kind: resolveFeishuMediaKind(messageType) }];
	try {
		const fileKey = mediaKeys.fileKey || mediaKeys.imageKey;
		if (!fileKey) return [{ kind: resolveFeishuMediaKind(messageType) }];
		const { saved } = await saveMessageResourceFeishu({
			cfg,
			messageId,
			fileKey,
			type: toMessageResourceType(messageType),
			accountId,
			maxBytes,
			originalFilename: mediaKeys.fileName
		});
		out.push({
			path: saved.path,
			contentType: saved.contentType,
			kind: resolveFeishuMediaKind(messageType)
		});
		log?.(`feishu: downloaded ${messageType} media, saved to ${saved.path}`);
	} catch (err) {
		out.push({ kind: resolveFeishuMediaKind(messageType) });
		log?.(`feishu: failed to download ${messageType} media: ${String(err)}`);
	}
	return out;
}
//#endregion
//#region extensions/feishu/src/bot-group-name-state.ts
const feishuGroupNameCache = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/feishu/src/bot-group-name.ts
const GROUP_NAME_CACHE_TTL_MS = 18e5;
const GROUP_NAME_CACHE_MAX_SIZE = 500;
function evictGroupNameCache() {
	const now = asDateTimestampMs(Date.now());
	if (now === void 0) {
		feishuGroupNameCache.clear();
		return;
	}
	for (const [key, value] of feishuGroupNameCache) {
		const expiresAt = asDateTimestampMs(value.expiresAt);
		if (expiresAt === void 0 || expiresAt <= now) feishuGroupNameCache.delete(key);
	}
	const excess = feishuGroupNameCache.size - GROUP_NAME_CACHE_MAX_SIZE;
	if (excess <= 0) return;
	let removed = 0;
	for (const key of feishuGroupNameCache.keys()) {
		if (removed >= excess) break;
		feishuGroupNameCache.delete(key);
		removed++;
	}
}
function setCacheEntry(key, name) {
	const expiresAt = resolveExpiresAtMsFromDurationMs(GROUP_NAME_CACHE_TTL_MS);
	feishuGroupNameCache.delete(key);
	if (expiresAt !== void 0) feishuGroupNameCache.set(key, {
		name,
		expiresAt
	});
}
async function resolveGroupName(params) {
	const { account, chatId, log } = params;
	if (!account.configured) return;
	const cacheKey = `${account.accountId}:${chatId}`;
	const cached = feishuGroupNameCache.get(cacheKey);
	if (cached) {
		const now = asDateTimestampMs(Date.now());
		const expiresAt = asDateTimestampMs(cached.expiresAt);
		if (now !== void 0 && expiresAt !== void 0 && expiresAt > now) return cached.name || void 0;
		feishuGroupNameCache.delete(cacheKey);
	}
	let resolvedName;
	try {
		const client = createFeishuClient(account);
		const name = (await getChatInfo(client, chatId))?.name?.trim();
		if (name) {
			setCacheEntry(cacheKey, name);
			resolvedName = name;
		} else setCacheEntry(cacheKey, "");
	} catch (err) {
		log(`feishu[${account.accountId}]: getChatInfo failed for ${chatId}: ${String(err)}`);
		setCacheEntry(cacheKey, "");
	}
	evictGroupNameCache();
	return resolvedName;
}
//#endregion
//#region extensions/feishu/src/bot-name.ts
const POSITIVE_TTL_MS = 6e5;
const NEGATIVE_TTL_MS = 6e4;
const MAX_CACHE_ENTRIES = 5e3;
const BREAKER_FAILURE_THRESHOLD = 10;
const BREAKER_OPEN_MS = 36e5;
const PERMISSION_BACKOFF_MS = 6e4;
const REQUEST_TIMEOUT_MS = 1500;
const cache = /* @__PURE__ */ new Map();
const breakerByAccount = /* @__PURE__ */ new Map();
const permissionBackoffUntilByAccount = /* @__PURE__ */ new Map();
const inflight = /* @__PURE__ */ new Map();
function resolveCacheKey(accountId, openId) {
	return `${accountId}::${openId}`;
}
function readCache(key) {
	const entry = cache.get(key);
	if (!entry) return;
	if (entry.expiresAt <= Date.now()) {
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
function isBreakerOpen(accountId) {
	const state = breakerByAccount.get(accountId);
	if (!state) return false;
	if (state.openUntil > Date.now()) return true;
	if (state.openUntil > 0) breakerByAccount.delete(accountId);
	return false;
}
function recordFailure(accountId) {
	const state = breakerByAccount.get(accountId) ?? {
		failures: 0,
		openUntil: 0
	};
	state.failures += 1;
	if (state.failures >= BREAKER_FAILURE_THRESHOLD) {
		state.failures = 0;
		state.openUntil = Date.now() + BREAKER_OPEN_MS;
	}
	breakerByAccount.set(accountId, state);
}
function recordSuccess(accountId) {
	breakerByAccount.delete(accountId);
}
function readFeishuErrorCode(error) {
	if (!error || typeof error !== "object") return;
	const data = error.response?.data;
	if (!data || typeof data !== "object") return;
	const code = data.code;
	return typeof code === "number" ? code : void 0;
}
async function requestBotName(params) {
	const { account, openId, log } = params;
	const query = new URLSearchParams({ bot_ids: openId });
	try {
		const response = await createFeishuClient(account).request({
			method: "GET",
			url: `/open-apis/bot/v3/bots/basic_batch?${query.toString()}`,
			timeout: REQUEST_TIMEOUT_MS
		});
		const code = response.code ?? 0;
		if (code === 0) return response;
		if (code === 99991672) {
			log(`feishu[${account.accountId}]: bot.basic_info scope not granted`);
			return "permission";
		}
		log(`feishu[${account.accountId}]: bot name lookup failed (code=${code})`);
		return "failure";
	} catch (error) {
		if (readFeishuErrorCode(error) === 99991672) {
			log(`feishu[${account.accountId}]: bot.basic_info scope not granted`);
			return "permission";
		}
		log(`feishu[${account.accountId}]: bot name lookup failed: ${String(error)}`);
		return "failure";
	}
}
async function resolveUncachedBotName(params) {
	const { account, openId, cacheKey, log } = params;
	if (isBreakerOpen(account.accountId)) {
		log(`feishu[${account.accountId}]: bot name lookup skipped (breaker open)`);
		return;
	}
	const result = await requestBotName({
		account,
		openId,
		log
	});
	if (result === "permission") {
		permissionBackoffUntilByAccount.set(account.accountId, Date.now() + PERMISSION_BACKOFF_MS);
		return;
	}
	if (result === "failure") {
		recordFailure(account.accountId);
		return;
	}
	recordSuccess(account.accountId);
	const name = result.data?.bots?.[openId]?.name?.trim();
	writeCache(cacheKey, {
		...name ? { name } : {},
		expiresAt: Date.now() + (name ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS)
	});
	return name;
}
async function resolveFeishuBotName(params) {
	const openId = params.openId.trim();
	if (!params.account.configured || !openId) return;
	const permissionBackoffUntil = permissionBackoffUntilByAccount.get(params.account.accountId);
	if (permissionBackoffUntil !== void 0) {
		if (permissionBackoffUntil > Date.now()) return;
		permissionBackoffUntilByAccount.delete(params.account.accountId);
	}
	const key = resolveCacheKey(params.account.accountId, openId);
	const cached = readCache(key);
	if (cached) return cached.name;
	const pending = inflight.get(key);
	if (pending) return pending;
	const lookup = resolveUncachedBotName({
		...params,
		openId,
		cacheKey: key
	});
	inflight.set(key, lookup);
	try {
		return await lookup;
	} finally {
		inflight.delete(key);
	}
}
//#endregion
//#region extensions/feishu/src/bot-sender-name.ts
const IGNORED_PERMISSION_SCOPE_TOKENS = ["contact:contact.base:readonly"];
const FEISHU_SCOPE_CORRECTIONS = { "contact:contact.base:readonly": "contact:user.base:readonly" };
const FEISHU_USER_LOOKUP_UNAUTHORIZED_CODE = 41050;
const SENDER_NAME_TTL_MS = 6e5;
const SENDER_NAME_NEGATIVE_TTL_MS = 18e5;
const SENDER_NAME_CACHE_MAX_SIZE = 500;
const senderNameCache = /* @__PURE__ */ new Map();
function correctFeishuScopeInUrl(url) {
	let corrected = url;
	for (const [wrong, right] of Object.entries(FEISHU_SCOPE_CORRECTIONS)) {
		corrected = corrected.replaceAll(encodeURIComponent(wrong), encodeURIComponent(right));
		corrected = corrected.replaceAll(wrong, right);
	}
	return corrected;
}
function shouldSuppressPermissionErrorNotice(permissionError) {
	const message = normalizeLowercaseStringOrEmpty(permissionError.message);
	return IGNORED_PERMISSION_SCOPE_TOKENS.some((token) => message.includes(token));
}
function extractFeishuApiError(err) {
	if (!err || typeof err !== "object") return null;
	const data = err.response?.data;
	if (!data || typeof data !== "object") return null;
	const feishuErr = data;
	if (typeof feishuErr.code !== "number") return null;
	return {
		code: feishuErr.code,
		message: typeof feishuErr.msg === "string" ? feishuErr.msg : ""
	};
}
function extractPermissionError(feishuErr) {
	if (feishuErr?.code !== 99991672) return null;
	const urlMatch = feishuErr.message.match(/https:\/\/[^\s,]+\/app\/[^\s,]+/);
	return {
		code: feishuErr.code,
		message: feishuErr.message,
		grantUrl: urlMatch?.[0] ? correctFeishuScopeInUrl(urlMatch[0]) : void 0
	};
}
function writeSenderNameCache(key, entry) {
	senderNameCache.delete(key);
	senderNameCache.set(key, entry);
	pruneMapToMaxSize(senderNameCache, SENDER_NAME_CACHE_MAX_SIZE);
}
function resolveSenderLookupIdType(senderId) {
	const trimmed = senderId.trim();
	if (trimmed.startsWith("ou_")) return "open_id";
	if (trimmed.startsWith("on_")) return "union_id";
	return "user_id";
}
async function resolveFeishuSenderName(params) {
	const { account, senderId, log } = params;
	if (!account.configured) return {};
	const normalizedSenderId = senderId.trim();
	if (!normalizedSenderId) return {};
	const cacheKey = `${account.accountId}:${normalizedSenderId}`;
	const cached = senderNameCache.get(cacheKey);
	const now = asDateTimestampMs(Date.now());
	const cachedExpireAt = cached ? asDateTimestampMs(cached.expireAt) : void 0;
	if (cached && now !== void 0 && cachedExpireAt !== void 0 && cachedExpireAt > now) return cached.kind === "resolved" ? { name: cached.name } : {};
	if (cached) senderNameCache.delete(cacheKey);
	try {
		const client = createFeishuClient(account);
		const userIdType = resolveSenderLookupIdType(normalizedSenderId);
		const user = (await client.contact.user.get({
			path: { user_id: normalizedSenderId },
			params: { user_id_type: userIdType }
		})).data?.user;
		const name = user?.name ?? user?.nickname ?? user?.en_name;
		if (name) {
			const expireAt = resolveExpiresAtMsFromDurationMs(SENDER_NAME_TTL_MS);
			if (expireAt !== void 0) writeSenderNameCache(cacheKey, {
				kind: "resolved",
				name,
				expireAt
			});
			return { name };
		}
		return {};
	} catch (err) {
		const feishuErr = extractFeishuApiError(err);
		const permErr = extractPermissionError(feishuErr);
		if (permErr) {
			if (shouldSuppressPermissionErrorNotice(permErr)) {
				log(`feishu: ignoring stale permission scope error: ${permErr.message}`);
				return {};
			}
			log(`feishu: permission error resolving sender name: code=${permErr.code}`);
			return { permissionError: permErr };
		}
		if (feishuErr?.code === FEISHU_USER_LOOKUP_UNAUTHORIZED_CODE) {
			const expireAt = resolveExpiresAtMsFromDurationMs(SENDER_NAME_NEGATIVE_TTL_MS);
			if (expireAt !== void 0) writeSenderNameCache(cacheKey, {
				kind: "unavailable",
				expireAt
			});
			return {};
		}
		log(`feishu: failed to resolve sender name for ${normalizedSenderId}: ${String(err)}`);
		return {};
	}
}
//#endregion
//#region extensions/feishu/src/dedup-state.ts
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
//#endregion
//#region extensions/feishu/src/dedup.ts
function dedupeKey(messageId) {
	return messageId?.trim() ?? "";
}
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
	const key = dedupeKey(params.messageId);
	if (!key) return false;
	const options = dedupeOptions(params.namespace, params.log);
	const claim = params.processingClaim ?? await feishuDedupeState.guard.claim(key, options);
	if ("kind" in claim && claim.kind !== "claimed") return false;
	return await ("kind" in claim ? claim.handle : claim).commit();
}
/** Forgets a recorded message so a retryable synthetic event can be handled on redelivery. */
async function forgetProcessedFeishuMessage(messageId, namespace = "global", log) {
	return await feishuDedupeState.guard.forget(messageId, dedupeOptions(namespace, log));
}
/** Checks recency without claiming or recording. */
async function hasProcessedFeishuMessage(messageId, namespace = "global", log) {
	return await feishuDedupeState.guard.hasRecent(messageId, dedupeOptions(namespace, log));
}
/** Loads recent persisted entries into memory at account start; returns the loaded count. */
async function warmupDedupFromPluginState(namespace, log) {
	return await feishuDedupeState.guard.warmup(namespace, (error) => log?.(`feishu-dedup: warmup persistent state error: ${String(error)}`));
}
//#endregion
//#region extensions/feishu/src/dedupe-key.ts
function readExternalKey(value) {
	return normalizeFeishuExternalKey(typeof value === "string" ? value : "");
}
function parseContentRecord(content) {
	try {
		return asNullableRecord(JSON.parse(content));
	} catch {
		return null;
	}
}
function buildMediaDedupeKey(messageId, mediaParts) {
	return JSON.stringify([messageId, ...mediaParts]);
}
function resolvePostMediaParts(content) {
	const { attachments } = parsePostContent(content);
	return ["image", "file"].flatMap((kind) => attachments.filter((attachment) => attachment.kind === kind).map((attachment) => `${kind}_key:${attachment.key}`));
}
function resolveMessageMediaParts(messageType, content) {
	if (messageType === "post") return resolvePostMediaParts(content);
	const parsed = parseContentRecord(content);
	if (!parsed) return [];
	const imageKey = readExternalKey(parsed.image_key);
	const fileKey = readExternalKey(parsed.file_key);
	switch (messageType) {
		case "image": return imageKey ? [`image_key:${imageKey}`] : [];
		case "file":
		case "audio":
		case "sticker": return fileKey ? [`file_key:${fileKey}`] : [];
		case "video":
		case "media": return fileKey ? [`file_key:${fileKey}`] : imageKey ? [`image_key:${imageKey}`] : [];
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
	const contentHash = createHash("sha256").update(event.message.content, "utf8").digest("hex").slice(0, 32);
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
	if (mediaParts.length > 0) return buildMediaDedupeKey(messageId, mediaParts);
	if (messageType === "text") return resolveTextRetryDedupeKey(event) ?? messageId;
	return messageId;
}
//#endregion
//#region extensions/feishu/src/dynamic-agent.ts
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
	return (cfg.agents?.list ?? []).filter((agent) => agent.id.startsWith("feishu-")).length >= dynamicCfg.maxAgents;
}
function resolveDynamicAgentId(accountId, senderOpenId) {
	if (accountId === "default") return `feishu-${senderOpenId}`;
	const identityDigest = createHash("sha256").update(accountId).update("\0").update(senderOpenId).digest("hex").slice(0, 32);
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
	if (!(currentCfg.agents?.list ?? []).some((agent) => agent.id === agentId) && isAtDynamicAgentLimit(currentCfg, currentDynamicCfg)) {
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
			const agentExists = (draft.agents?.list ?? []).some((agent) => agent.id === agentId);
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
					list: [...draft.agents?.list ?? [], {
						id: agentId,
						workspace,
						agentDir
					}]
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
			return {
				created: true,
				agentId
			};
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
		updatedCfg: runtime.config.current(),
		agentId: committed.result?.agentId
	};
}
/**
* Resolve a path that may start with ~ to the user's home directory.
*/
function resolveUserPath(p) {
	if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
	return p;
}
//#endregion
//#region extensions/feishu/src/agent-config.ts
function resolveFeishuConfigReasoningDefault(cfg, agentId) {
	return resolveAgentConfig(cfg, agentId)?.reasoningDefault ?? cfg.agents?.defaults?.reasoningDefault ?? "off";
}
//#endregion
//#region extensions/feishu/src/reasoning-preview.ts
function resolveFeishuReasoningPreviewEnabled(params) {
	const configDefault = resolveFeishuConfigReasoningDefault(params.cfg, params.agentId);
	if (!params.sessionKey) return configDefault === "stream";
	try {
		const level = getSessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			readConsistency: "latest"
		})?.reasoningLevel;
		if (level === "on" || level === "stream" || level === "off") return level === "stream";
	} catch {
		return false;
	}
	return configDefault === "stream";
}
//#endregion
//#region extensions/feishu/src/reply-dispatcher-state.ts
const streamingStartBackoffUntilByAccount = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/feishu/src/streaming-card-send-mode.ts
function resolveStreamingCardSendMode(options) {
	if (options?.replyToMessageId) return "reply";
	if (options?.rootId) return "root_create";
	return "create";
}
//#endregion
//#region extensions/feishu/src/streaming-card.ts
/** Provider finalization failed after a streaming card may already be visible. */
var FeishuStreamingFinalizationError = class extends Error {
	constructor(cause, result) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.name = "FeishuStreamingFinalizationError";
		this.result = result;
	}
};
const STREAMING_UPDATE_THROTTLE_MS = 160;
const STREAMING_SIGNIFICANT_DELTA_CHARS = 18;
const FEISHU_STREAMING_TOKEN_DEFAULT_LIFETIME_SECONDS = 7200;
const tokenCache = /* @__PURE__ */ new Map();
function resolveStreamingTokenExpiresAt(value, nowMs = Date.now()) {
	const now = resolveDateTimestampMs(nowMs);
	if (typeof value === "number" && Number.isFinite(value) && value <= 0) return now;
	return resolveExpiresAtMsFromDurationSeconds(value, { nowMs: now }) ?? resolveExpiresAtMsFromDurationSeconds(FEISHU_STREAMING_TOKEN_DEFAULT_LIFETIME_SECONDS, { nowMs: now }) ?? now;
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
	if (!response.ok) {
		cancelUnreadResponseBody(response);
		throw new Error(`${action} failed with HTTP ${response.status}`);
	}
	const data = await readFeishuJsonResponse(response, auditContext);
	if (data.code !== 0) throw new Error(`${action} failed: ${data.msg ?? "unknown error"} (code=${String(data.code)})`);
}
async function getToken(creds, deps) {
	const key = `${creds.domain ?? "feishu"}|${creds.appId}`;
	const cached = tokenCache.get(key);
	const rawNow = Date.now();
	const hasValidClock = asDateTimestampMs(rawNow) !== void 0;
	const now = resolveDateTimestampMs(rawNow);
	const minUsableExpiresAt = resolveExpiresAtMsFromDurationSeconds(60, { nowMs: now }) ?? now;
	if (cached && hasValidClock && cached.expiresAt > minUsableExpiresAt) return cached.token;
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
		fetchImpl: deps?.fetchImpl,
		lookupFn: deps?.lookupFn,
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
		data = await readFeishuJsonResponse(response, "feishu.streaming-card.token");
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
	if (!text) return "";
	const clean = text.replace(/\n/g, " ").trim();
	return clean.length <= max ? clean : sliceUtf16Safe(clean, 0, max - 3) + "...";
}
function shouldPushStreamingUpdate(previousText, nextText) {
	return !previousText || /[\n。！？!?；;：:]$/.test(nextText) || nextText.length - previousText.length >= STREAMING_SIGNIFICANT_DELTA_CHARS;
}
/** Merges cumulative or overlapping streaming snapshots without duplicating content. */
function mergeStreamingText(previousText, nextText) {
	const previous = typeof previousText === "string" ? previousText : "";
	const next = typeof nextText === "string" ? nextText : "";
	if (!next) return previous;
	if (!previous || next === previous) return next;
	if (next.startsWith(previous) || next.includes(previous)) return next;
	if (previous.startsWith(next) || previous.includes(next)) return previous;
	const maxOverlap = Math.min(previous.length, next.length);
	for (let overlap = maxOverlap; overlap > 0; overlap -= 1) if (previous.slice(-overlap) === next.slice(0, overlap)) return `${previous}${next.slice(overlap)}`;
	return `${previous}${next}`;
}
/** Streaming card session manager */
var FeishuStreamingSession = class {
	constructor(client, creds, log, deps) {
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
		this.fetchImpl = deps?.fetchImpl;
		this.lookupFn = deps?.lookupFn;
	}
	async start(receiveId, receiveIdType = "chat_id", options) {
		if (this.state) return;
		const apiBase = resolveApiBase(this.creds.domain);
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
		const { response: createRes, release: releaseCreate } = await fetchWithSsrFGuard({
			url: `${apiBase}/cardkit/v1/cards`,
			init: {
				method: "POST",
				headers: {
					Authorization: `Bearer ${await getToken(this.creds, {
						fetchImpl: this.fetchImpl,
						lookupFn: this.lookupFn
					})}`,
					"Content-Type": "application/json",
					"User-Agent": getFeishuUserAgent()
				},
				body: JSON.stringify({
					type: "card_json",
					data: JSON.stringify(cardJson)
				})
			},
			fetchImpl: this.fetchImpl,
			lookupFn: this.lookupFn,
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext: "feishu.streaming-card.create",
			timeoutMs: this.creds.httpTimeoutMs ?? 3e4
		});
		let createData;
		try {
			if (!createRes.ok) {
				cancelUnreadResponseBody(createRes);
				throw new Error(`Create card request failed with HTTP ${createRes.status}`);
			}
			createData = await readFeishuJsonResponse(createRes, "feishu.streaming-card.create");
		} finally {
			await releaseCreate();
		}
		if (createData.code !== 0 || !createData.data?.card_id) throw new Error(`Create card failed: ${createData.msg}`);
		const cardId = createData.data.card_id;
		const cardContent = JSON.stringify({
			type: "card",
			data: { card_id: cardId }
		});
		let sendRes;
		const sendOptions = options ?? {};
		const sendMode = resolveStreamingCardSendMode(sendOptions);
		if (sendMode === "reply") sendRes = await requestFeishuApi(() => this.client.im.message.reply({
			path: { message_id: sendOptions.replyToMessageId },
			data: {
				msg_type: "interactive",
				content: cardContent,
				...sendOptions.replyInThread ? { reply_in_thread: true } : {}
			}
		}), "Send card failed");
		else sendRes = await requestFeishuApi(() => this.client.im.message.create({
			params: { receive_id_type: receiveIdType },
			data: {
				receive_id: receiveId,
				msg_type: "interactive",
				content: cardContent,
				...sendMode === "root_create" ? { root_id: sendOptions.rootId } : {}
			}
		}), "Send card failed");
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
	async updateCardContent(text, onError) {
		if (!this.state) return false;
		const apiBase = resolveApiBase(this.creds.domain);
		this.state.sequence += 1;
		try {
			const { response, release } = await fetchWithSsrFGuard({
				url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/content/content`,
				init: {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${await getToken(this.creds, {
							fetchImpl: this.fetchImpl,
							lookupFn: this.lookupFn
						})}`,
						"Content-Type": "application/json",
						"User-Agent": getFeishuUserAgent()
					},
					body: JSON.stringify({
						content: text,
						sequence: this.state.sequence,
						uuid: `s_${this.state.cardId}_${this.state.sequence}`
					})
				},
				fetchImpl: this.fetchImpl,
				lookupFn: this.lookupFn,
				policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
				auditContext: "feishu.streaming-card.update",
				timeoutMs: this.creds.httpTimeoutMs ?? 3e4
			});
			try {
				await assertSuccessfulCardKitResponse(response, "feishu.streaming-card.update", "Update card content");
			} finally {
				await release();
			}
			return true;
		} catch (error) {
			onError?.(error);
			return false;
		}
	}
	async replaceCardContent(text, onError) {
		if (!this.state) return false;
		const apiBase = resolveApiBase(this.creds.domain);
		this.state.sequence += 1;
		try {
			const { response, release } = await fetchWithSsrFGuard({
				url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/content`,
				init: {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${await getToken(this.creds, {
							fetchImpl: this.fetchImpl,
							lookupFn: this.lookupFn
						})}`,
						"Content-Type": "application/json",
						"User-Agent": getFeishuUserAgent()
					},
					body: JSON.stringify({
						element: JSON.stringify({
							tag: "markdown",
							content: text,
							element_id: "content"
						}),
						sequence: this.state.sequence,
						uuid: `r_${this.state.cardId}_${this.state.sequence}`
					})
				},
				fetchImpl: this.fetchImpl,
				lookupFn: this.lookupFn,
				policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
				auditContext: "feishu.streaming-card.replace",
				timeoutMs: this.creds.httpTimeoutMs ?? 3e4
			});
			try {
				await assertSuccessfulCardKitResponse(response, "feishu.streaming-card.replace", "Replace card content");
			} finally {
				await release();
			}
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
			if (await this.updateCardContent(nextText, (e) => this.log?.(`Update failed: ${String(e)}`)) && this.state) this.state.sentText = nextText;
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
		const apiBase = resolveApiBase(this.creds.domain);
		this.state.sequence += 1;
		await fetchWithSsrFGuard({
			url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/note/content`,
			init: {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${await getToken(this.creds, {
						fetchImpl: this.fetchImpl,
						lookupFn: this.lookupFn
					})}`,
					"Content-Type": "application/json",
					"User-Agent": getFeishuUserAgent()
				},
				body: JSON.stringify({
					content: `<font color='grey'>${note}</font>`,
					sequence: this.state.sequence,
					uuid: `n_${this.state.cardId}_${this.state.sequence}`
				})
			},
			fetchImpl: this.fetchImpl,
			lookupFn: this.lookupFn,
			policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
			auditContext: "feishu.streaming-card.note-update",
			timeoutMs: this.creds.httpTimeoutMs ?? 3e4
		}).then(async ({ response, release }) => {
			try {
				await assertSuccessfulCardKitResponse(response, "feishu.streaming-card.note-update", "Update card note");
			} finally {
				await release();
			}
		}).catch((e) => this.log?.(`Note update failed: ${String(e)}`));
	}
	async closeWithResult(finalText, options) {
		if (!this.state || this.closed) return { visibleReplySent: false };
		this.closed = true;
		this.clearFlushTimer();
		await this.queue;
		const text = finalText ?? this.pendingText ?? this.state.currentText;
		const apiBase = resolveApiBase(this.creds.domain);
		let visibleContentSent = Boolean(this.state.sentText.trim());
		let finalWriteError;
		if ((text || finalText !== void 0) && text !== this.state.sentText) {
			const sent = text.startsWith(this.state.sentText) ? await this.updateCardContent(text, (e) => {
				finalWriteError = e;
				this.log?.(`Final update failed: ${String(e)}`);
			}) : await this.replaceCardContent(text, (e) => {
				finalWriteError = e;
				this.log?.(`Final replace failed: ${String(e)}`);
			});
			this.state.currentText = text;
			if (sent) {
				this.state.sentText = text;
				visibleContentSent = Boolean(text.trim());
			}
		}
		if (options?.note) await this.updateNoteContent(options.note);
		const acceptedText = this.state.sentText;
		this.state.sequence += 1;
		let closeError;
		try {
			const { response, release } = await fetchWithSsrFGuard({
				url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/settings`,
				init: {
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${await getToken(this.creds, {
							fetchImpl: this.fetchImpl,
							lookupFn: this.lookupFn
						})}`,
						"Content-Type": "application/json; charset=utf-8",
						"User-Agent": getFeishuUserAgent()
					},
					body: JSON.stringify({
						settings: JSON.stringify({ config: {
							streaming_mode: false,
							summary: { content: truncateSummary(acceptedText) }
						} }),
						sequence: this.state.sequence,
						uuid: `c_${this.state.cardId}_${this.state.sequence}`
					})
				},
				fetchImpl: this.fetchImpl,
				lookupFn: this.lookupFn,
				policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
				auditContext: "feishu.streaming-card.close",
				timeoutMs: this.creds.httpTimeoutMs ?? 3e4
			});
			try {
				await assertSuccessfulCardKitResponse(response, "feishu.streaming-card.close", "Close streaming card");
			} finally {
				await release();
			}
		} catch (error) {
			closeError = error;
			this.log?.(`Close failed: ${String(error)}`);
		}
		const finalState = this.state;
		this.state = null;
		this.pendingText = null;
		this.log?.(`Closed streaming: cardId=${finalState.cardId}`);
		const result = {
			visibleReplySent: visibleContentSent,
			...visibleContentSent ? { content: finalState.sentText } : {},
			...finalState.messageId ? { messageId: finalState.messageId } : {}
		};
		if (finalWriteError !== void 0 || closeError !== void 0) throw new FeishuStreamingFinalizationError(finalWriteError !== void 0 && closeError !== void 0 ? new AggregateError([finalWriteError, closeError], "Feishu streaming card finalization failed") : finalWriteError ?? closeError, result);
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
//#endregion
//#region extensions/feishu/src/typing-backoff.ts
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
		if (typeof response.data?.code === "number" && FEISHU_BACKOFF_CODES.has(response.data.code)) return true;
	}
	const code = err.code;
	return typeof code === "number" && FEISHU_BACKOFF_CODES.has(code);
}
function getBackoffCodeFromResponse(response) {
	if (typeof response !== "object" || response === null) return;
	const code = response.code;
	return typeof code === "number" && FEISHU_BACKOFF_CODES.has(code) ? code : void 0;
}
//#endregion
//#region extensions/feishu/src/typing.ts
const TYPING_EMOJI = "Typing";
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
	try {
		const response = await client.im.messageReaction.create({
			path: { message_id: messageId },
			data: { reaction_type: { emoji_type: TYPING_EMOJI } }
		});
		const backoffCode = getBackoffCodeFromResponse(response);
		if (backoffCode !== void 0) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] typing indicator response contains backoff code ${backoffCode}, stopping keepalive`);
			throw new FeishuBackoffError(backoffCode);
		}
		return {
			messageId,
			reactionId: response.data?.reaction_id ?? null
		};
	} catch (err) {
		if (isFeishuBackoffError(err)) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.("[feishu] typing indicator hit rate-limit/quota, stopping keepalive");
			throw err;
		}
		if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] failed to add typing indicator: ${String(err)}`);
		return {
			messageId,
			reactionId: null
		};
	}
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
	try {
		const backoffCode = getBackoffCodeFromResponse(await client.im.messageReaction.delete({ path: {
			message_id: state.messageId,
			reaction_id: state.reactionId
		} }));
		if (backoffCode !== void 0) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] typing indicator removal response contains backoff code ${backoffCode}, stopping keepalive`);
			throw new FeishuBackoffError(backoffCode);
		}
	} catch (err) {
		if (isFeishuBackoffError(err)) {
			if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.("[feishu] typing indicator removal hit rate-limit/quota, stopping keepalive");
			throw err;
		}
		if (getFeishuRuntime().logging.shouldLogVerbose()) runtime?.log?.(`[feishu] failed to remove typing indicator: ${String(err)}`);
	}
}
//#endregion
//#region extensions/feishu/src/reply-dispatcher.ts
/** Detect if text contains markdown elements that benefit from card rendering */
function shouldUseCard(text) {
	return /```[\s\S]*?```/.test(text) || /\|.+\|[\r\n]+\|[-:| ]+\|/.test(text);
}
function mergeStreamingFinalText(previousText, nextText, appendError) {
	if (!appendError || !previousText) return nextText;
	if (nextText.startsWith(previousText)) return nextText;
	if (previousText.endsWith(`\n\n${nextText}`)) return previousText;
	return `${previousText}\n\n${nextText}`;
}
/** Maximum age (ms) for a message to receive a typing indicator reaction.
* Messages older than this are likely replays after context compaction (#30418). */
const TYPING_INDICATOR_MAX_AGE_MS = 12e4;
const MS_EPOCH_MIN = 0xe8d4a51000;
const STREAMING_START_FAILURE_BACKOFF_MS = 6e4;
const NO_VISIBLE_REPLY_FALLBACK_TEXT = "⚠️ This reply completed without visible content. The turn may have been interrupted; please retry or ask me to recover from recent context.";
function isStreamingStartBackedOff(accountId, now = Date.now()) {
	const backoffUntil = streamingStartBackoffUntilByAccount.get(accountId);
	if (backoffUntil === void 0) return false;
	if (backoffUntil <= now) {
		streamingStartBackoffUntilByAccount.delete(accountId);
		return false;
	}
	return true;
}
function rememberStreamingStartFailure(accountId, now = Date.now()) {
	const backoffUntil = now + STREAMING_START_FAILURE_BACKOFF_MS;
	streamingStartBackoffUntilByAccount.set(accountId, backoffUntil);
	return backoffUntil;
}
function normalizeEpochMs(timestamp) {
	if (!Number.isFinite(timestamp) || timestamp === void 0 || timestamp <= 0) return;
	return timestamp < MS_EPOCH_MIN ? timestamp * 1e3 : timestamp;
}
/** Build a card header from agent identity config. */
function resolveCardHeader(agentId, identity) {
	const name = identity?.name?.trim() || (agentId === "main" ? "" : agentId);
	const emoji = resolveFeishuIdentityEmoji(identity?.emoji);
	const title = (emoji ? `${emoji} ${name}` : name).trim();
	if (!title) return;
	return {
		title,
		template: identity?.theme ?? "blue"
	};
}
/** Build a card note footer from agent identity and model context. */
function resolveCardNote(agentId, identity, prefixCtx) {
	const parts = [`Agent: ${identity?.name?.trim() || agentId}`];
	if (prefixCtx.model) parts.push(`Model: ${prefixCtx.model}`);
	if (prefixCtx.provider) parts.push(`Provider: ${prefixCtx.provider}`);
	return parts.join(" | ");
}
function createFeishuReplyDispatcher(params) {
	const core = getFeishuRuntime();
	const { cfg, agentId, chatId, sendTarget, replyToMessageId, typingTargetMessageId: explicitTypingTargetMessageId, skipReplyToInMessages, replyInThread, threadReply, rootId, accountId, identity, mentionTargets, requiredMentionTargets } = params;
	const sendReplyToMessageId = skipReplyToInMessages ? void 0 : replyToMessageId;
	const typingTargetMessageId = explicitTypingTargetMessageId?.trim() || replyToMessageId;
	const threadReplyMode = threadReply === true;
	const effectiveReplyInThread = threadReplyMode ? true : replyInThread;
	const allowTopLevelReplyFallback = effectiveReplyInThread === true && threadReplyMode && rootId !== void 0 && sendReplyToMessageId !== void 0 && sendReplyToMessageId !== rootId;
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
				if (!(account.config.typingIndicator ?? true)) return;
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
				log: (message) => params.runtime.log?.(message),
				channel: "feishu",
				action: "start",
				error: err
			}),
			onStopError: (err) => logTypingFailure({
				log: (message) => params.runtime.log?.(message),
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
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config);
	const coreBlockStreamingEnabled = blockStreamingEnabled === true;
	const reasoningPreviewEnabled = previewStreamingEnabled && params.allowReasoningPreview === true;
	let streaming = null;
	let streamText = "";
	let lastPartial = "";
	let reasoningText = "";
	let statusLine = "";
	let snapshotBaseText = "";
	let lastSnapshotTextLength = 0;
	let hasStreamingFinalText = false;
	const deliveredFinalTexts = /* @__PURE__ */ new Set();
	const closedStreamingSettlements = /* @__PURE__ */ new Map();
	let sentIndependentBlockText = false;
	let partialUpdateQueue = Promise.resolve();
	let streamingStartPromise = null;
	let streamingGeneration = 0;
	let activeStreamingGeneration;
	let inFlightStreamingClose;
	let visibleReplySent = false;
	let replyOutcome;
	let idleSideEffectsPromise = Promise.resolve();
	let activeIdleSideEffectsPromise = null;
	let idleRequestedForReply = false;
	let replyLifecycleStateInitialized = false;
	const pendingStreamingDeliveries = [];
	const markVisibleReplySent = () => {
		visibleReplySent = true;
	};
	const formatReasoningPrefix = (thinking) => {
		if (!thinking) return "";
		return `> 💭 **Thinking**\n${thinking.replace(/^(?:Reasoning:|Thinking\.{0,3})\s*/u, "").replace(/^_(.*)_$/gm, "$1").split("\n").map((line) => `> ${line}`).join("\n")}`;
	};
	const buildCombinedStreamText = (thinking, answer) => {
		const parts = [];
		if (thinking) parts.push(formatReasoningPrefix(thinking));
		if (thinking && answer) parts.push("\n\n---\n\n");
		if (answer) parts.push(answer);
		if (statusLine) parts.push(parts.length > 0 ? `\n\n${statusLine}` : statusLine);
		return parts.join("");
	};
	const flushStreamingCardUpdate = (combined) => {
		const session = streaming;
		const generation = activeStreamingGeneration;
		const startPromise = streamingStartPromise;
		partialUpdateQueue = partialUpdateQueue.then(async () => {
			if (startPromise) await startPromise;
			if (generation !== void 0 && session?.isActive()) await session.update(combined);
		});
	};
	const queueStreamingUpdate = (nextText, options) => {
		if (!nextText) return;
		if (options?.dedupeWithLastPartial && nextText === lastPartial) return;
		if (options?.dedupeWithLastPartial) lastPartial = nextText;
		if ((options?.mode ?? "snapshot") === "delta") streamText = `${streamText}${nextText}`;
		else {
			const currentSnapshotText = snapshotBaseText ? streamText.slice(snapshotBaseText.length) : streamText;
			if (lastSnapshotTextLength >= 20 && nextText.length < lastSnapshotTextLength * .5 && !currentSnapshotText.includes(nextText)) {
				snapshotBaseText = streamText;
				streamText = `${snapshotBaseText}${nextText}`;
			} else streamText = `${snapshotBaseText}${mergeStreamingText(currentSnapshotText, nextText)}`;
			lastSnapshotTextLength = nextText.length;
		}
		flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
	};
	const queueReasoningUpdate = (nextThinking) => {
		if (!nextThinking) return;
		reasoningText = nextThinking;
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
			const session = new FeishuStreamingSession(createFeishuClient(account), creds, (message) => params.runtime.log?.(`feishu[${account.accountId}] ${message}`));
			const generation = ++streamingGeneration;
			streaming = session;
			activeStreamingGeneration = generation;
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
				rememberStreamingStartFailure(account.accountId);
				params.runtime.error?.(`feishu[${account.accountId}]: streaming start failed; using non-streaming card fallback for ${STREAMING_START_FAILURE_BACKOFF_MS / 1e3}s: ${String(error)}`);
				if (streaming === session) {
					streaming = null;
					streamingStartPromise = null;
					activeStreamingGeneration = void 0;
				}
			}
		})();
	};
	const resetStreamingState = () => {
		streaming = null;
		streamingStartPromise = null;
		activeStreamingGeneration = void 0;
		partialUpdateQueue = Promise.resolve();
		streamText = "";
		lastPartial = "";
		reasoningText = "";
		statusLine = "";
		snapshotBaseText = "";
		lastSnapshotTextLength = 0;
		hasStreamingFinalText = false;
	};
	const rememberClosedStreamingSettlement = (generation, content, result, error, disposition = "closed") => {
		if (generation === void 0 || !content && disposition === "closed") return;
		closedStreamingSettlements.set(generation, {
			disposition,
			result,
			content,
			...error === void 0 ? {} : { error }
		});
	};
	const performStreamingClose = async (disposition) => {
		const streamingToClose = streaming;
		const generationToClose = activeStreamingGeneration;
		const startPromiseToClose = streamingStartPromise;
		const updateQueueToClose = partialUpdateQueue;
		const finalizedAnswerText = streamText;
		const finalizedReasoningText = reasoningText;
		const outcome = {
			disposition,
			...generationToClose === void 0 ? {} : { generation: generationToClose }
		};
		if (generationToClose !== void 0 && activeStreamingGeneration === generationToClose) activeStreamingGeneration = void 0;
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
					if (!(error instanceof FeishuStreamingFinalizationError)) throw error;
					closed = error.result;
					finalizationError = error;
				}
				result = createFeishuReplyDeliveryResult({
					results: [closed],
					visibleReplySent: closed.visibleReplySent,
					content: closed.content,
					kind: "card"
				});
				if (result.visibleReplySent) markVisibleReplySent();
				if (disposition === "closed" && result.visibleReplySent && finalizedAnswerText && (finalizationError === void 0 || result.content === text)) deliveredFinalTexts.add(finalizedAnswerText);
				if (finalizationError instanceof FeishuStreamingFinalizationError && result.visibleReplySent) finalizationError = createFeishuPartialReplyDeliveryError(finalizationError.cause ?? finalizationError, result);
			}
			if (disposition === "discarded" || finalizationError !== void 0 || result.visibleReplySent && finalizedAnswerText) rememberClosedStreamingSettlement(generationToClose, finalizedAnswerText, result, finalizationError, disposition);
			return {
				...outcome,
				result,
				...finalizationError === void 0 ? {} : { error: finalizationError }
			};
		} catch (error) {
			if (disposition === "discarded") rememberClosedStreamingSettlement(generationToClose, finalizedAnswerText, noVisibleFeishuReplyDelivery, error, disposition);
			return {
				...outcome,
				result: noVisibleFeishuReplyDelivery,
				error
			};
		} finally {
			if (streaming === streamingToClose) resetStreamingState();
		}
	};
	const closeStreaming = (disposition = "closed") => {
		const session = streaming;
		const generation = activeStreamingGeneration;
		if (session && inFlightStreamingClose?.session === session) return inFlightStreamingClose.promise;
		const content = streamText;
		const closePromise = performStreamingClose(disposition);
		if (session && generation !== void 0) {
			const closing = {
				session,
				generation,
				content,
				disposition,
				promise: closePromise
			};
			inFlightStreamingClose = closing;
			const clear = () => {
				if (inFlightStreamingClose === closing) inFlightStreamingClose = void 0;
			};
			closePromise.then(clear, clear);
		}
		return closePromise;
	};
	const deferStreamingDelivery = (result, infoKind, ownerGeneration) => {
		let resolveFinalization;
		let rejectFinalization;
		const finalization = new Promise((resolve, reject) => {
			resolveFinalization = resolve;
			rejectFinalization = reject;
		});
		pendingStreamingDeliveries.push({
			result,
			...infoKind ? { infoKind } : {},
			...ownerGeneration === void 0 ? {} : { streamingGeneration: ownerGeneration },
			resolve: resolveFinalization,
			reject: rejectFinalization
		});
		if (idleRequestedForReply) queueIdleSideEffects().catch((error) => params.runtime.error?.(`feishu[${account.accountId}] late reply finalization failed: ${String(error)}`));
		return {
			...noVisibleFeishuReplyDelivery,
			finalization
		};
	};
	const discardStreamingPreview = async () => {
		if (streaming && inFlightStreamingClose?.session === streaming && inFlightStreamingClose.disposition === "closed") {
			resetStreamingState();
			return;
		}
		const outcome = await closeStreaming("discarded");
		if (outcome.error !== void 0) throw toStringifiedError(outcome.error);
	};
	const updateStreamingStatusLine = (nextStatusLine, options) => {
		statusLine = nextStatusLine;
		if (!Boolean(streaming?.isActive() || streamingStartPromise) && (options?.startIfNeeded === false || renderMode !== "card")) return false;
		startStreaming();
		flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
		return false;
	};
	const sendChunkedTextReply = async (paramsLocal) => {
		const chunkSource = paramsLocal.useCard ? paramsLocal.text : materializeFeishuPostMarkdownSoftBreaks(core.channel.text.convertMarkdownTables(paramsLocal.text, tableMode));
		const initialChunks = core.channel.text.chunkMarkdownTextWithMode(chunkSource, textChunkLimit, chunkMode);
		const chunkOptions = {
			text: chunkSource,
			limit: textChunkLimit,
			mode: chunkMode,
			firstChunkMentions: paramsLocal.firstChunkMentions,
			chunkMentions: paramsLocal.chunkMentions,
			initialChunks
		};
		const chunks = resolveTextChunksWithFallback(chunkSource, paramsLocal.useCard ? chunkFeishuCardMarkdown({
			...chunkOptions,
			header: paramsLocal.header,
			note: paramsLocal.note
		}) : chunkFeishuPostMarkdown(chunkOptions));
		const results = [];
		const acceptedChunks = [];
		for (const [index, chunk] of chunks.entries()) {
			const mentions = [...paramsLocal.chunkMentions ?? [], ...index === 0 ? paramsLocal.firstChunkMentions ?? [] : []];
			try {
				const result = await paramsLocal.sendChunk({
					chunk,
					isFirst: index === 0,
					mentions: mentions.length > 0 ? mentions : void 0
				});
				results.push(result);
				acceptedChunks.push(chunk);
				markVisibleReplySent();
			} catch (error) {
				const acceptedChunk = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
				if (acceptedChunk) {
					acceptedChunks.push(acceptedChunk.content ?? chunk);
					markVisibleReplySent();
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
		firstChunkMentions,
		chunkMentions: requiredMentionTargets,
		sendChunk: ({ chunk, mentions }) => sendMessageFeishu({
			cfg,
			to: sendTarget,
			text: chunk,
			replyToMessageId: sendReplyToMessageId,
			replyInThread: effectiveReplyInThread,
			allowTopLevelReplyFallback,
			accountId,
			...mentions ? { mentions } : {}
		})
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
						cfg,
						to: sendTarget,
						mediaUrl,
						replyToMessageId: sendReplyToMessageId,
						replyInThread: effectiveReplyInThread,
						allowTopLevelReplyFallback,
						accountId,
						...payload.audioAsVoice === true ? { audioAsVoice: true } : {}
					});
					results.push(createFeishuReplyDeliveryResult({
						results: [result],
						visibleReplySent: true,
						kind: result?.voiceIntentDegradedToFile ? "media" : void 0
					}));
					markVisibleReplySent();
					if (result?.voiceIntentDegradedToFile && options?.fallbackText && !sentFallbackText) degradedVoiceFallbackText = options.fallbackText;
				},
				onError: options?.fallbackText === void 0 ? void 0 : async ({ error, mediaUrl }) => {
					if (isChannelPartialDeliveryError(error)) {
						markVisibleReplySent();
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
			if (degradedVoiceFallbackText && !sentFallbackText) {
				sentFallbackText = true;
				results.push(await sendPostReply(degradedVoiceFallbackText, "final"));
			}
		} catch (error) {
			const partial = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
			if (partial) markVisibleReplySent();
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
			cfg,
			to: sendTarget,
			text: NO_VISIBLE_REPLY_FALLBACK_TEXT,
			replyToMessageId: sendReplyToMessageId,
			replyInThread: effectiveReplyInThread,
			allowTopLevelReplyFallback,
			accountId,
			...requiredMentionTargets?.length ? { mentions: requiredMentionTargets } : {}
		});
		markVisibleReplySent();
		params.runtime.error?.(`feishu[${account.accountId}]: sent no-visible-reply fallback (${reason})`);
		return true;
	};
	const claimClosedStreamingResult = (generation, content) => {
		if (generation !== void 0) {
			const settlement = closedStreamingSettlements.get(generation);
			if (settlement) settlement.contentClaimed = true;
			return settlement;
		}
		let latestKey;
		for (const [key, settlement] of closedStreamingSettlements) if (settlement.contentClaimed !== true && (content === void 0 || settlement.content === content)) latestKey = key;
		if (latestKey === void 0) return;
		const result = closedStreamingSettlements.get(latestKey);
		if (result) result.contentClaimed = true;
		return result;
	};
	const markClosedStreamingContentClaimed = (generation) => {
		if (generation !== void 0) {
			const settlement = closedStreamingSettlements.get(generation);
			if (settlement) settlement.contentClaimed = true;
		}
	};
	const ensureVisibleStreamingDelivery = async (result, content, infoKind) => {
		if (result?.visibleReplySent === true || !content?.trim()) return result;
		const cardHeader = resolveCardHeader(agentId, identity);
		const cardNote = resolveCardNote(agentId, identity, responsePrefixContextProvider());
		const useRecoveryCard = withinCardTableLimit(content);
		return await sendChunkedTextReply({
			text: content,
			useCard: useRecoveryCard,
			infoKind,
			header: cardHeader,
			note: cardNote,
			chunkMentions: requiredMentionTargets,
			sendChunk: async ({ chunk, mentions }) => useRecoveryCard ? await sendStructuredCardFeishu({
				cfg,
				to: sendTarget,
				text: chunk,
				replyToMessageId: sendReplyToMessageId,
				replyInThread: effectiveReplyInThread,
				allowTopLevelReplyFallback,
				accountId,
				header: cardHeader,
				note: cardNote,
				...mentions ? { mentions } : {}
			}) : await sendMessageFeishu({
				cfg,
				to: sendTarget,
				text: chunk,
				preparedPostText: true,
				replyToMessageId: sendReplyToMessageId,
				replyInThread: effectiveReplyInThread,
				allowTopLevelReplyFallback,
				accountId,
				...mentions ? { mentions } : {}
			})
		});
	};
	function queueIdleSideEffects() {
		idleRequestedForReply = true;
		if (activeIdleSideEffectsPromise) return activeIdleSideEffectsPromise;
		const nextIdleSideEffects = idleSideEffectsPromise.then(async () => {
			try {
				do {
					const completions = pendingStreamingDeliveries.splice(0);
					const closeOutcome = await closeStreaming();
					const finalized = closeOutcome.result;
					const ownsCurrentClose = (completion) => closeOutcome.generation !== void 0 && completion.streamingGeneration === closeOutcome.generation;
					if (completions.some((completion) => ownsCurrentClose(completion))) markClosedStreamingContentClaimed(closeOutcome.generation);
					for (const completion of completions) {
						const claimedSettlement = ownsCurrentClose(completion) ? {
							disposition: closeOutcome.disposition,
							result: finalized,
							...closeOutcome.error === void 0 ? {} : { error: closeOutcome.error }
						} : claimClosedStreamingResult(completion.streamingGeneration, completion.result.content);
						const deliveryError = claimedSettlement?.error;
						if (claimedSettlement?.disposition === "discarded") {
							const retained = mergeFeishuReplyDeliveryResults([claimedSettlement.result, completion.result], claimedSettlement.result.content ?? "");
							if (deliveryError !== void 0) completion.reject(createFeishuPartialReplyDeliveryError(deliveryError, retained));
							else completion.resolve(retained);
							continue;
						}
						let providerFinalized = claimedSettlement?.result;
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
						if (deliveryError !== void 0) completion.reject(createFeishuPartialReplyDeliveryError(isChannelPartialDeliveryError(deliveryError) && deliveryError instanceof Error ? deliveryError.cause ?? deliveryError : deliveryError instanceof FeishuStreamingFinalizationError ? deliveryError.cause ?? deliveryError : deliveryError, settledResult));
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
			if (pendingStreamingDeliveries.length > 0) queueIdleSideEffects().catch((error) => params.runtime.error?.(`feishu[${account.accountId}] queued reply finalization failed: ${String(error)}`));
		};
		nextIdleSideEffects.then(finishIdleSideEffects, finishIdleSideEffects);
		return nextIdleSideEffects;
	}
	const throwStreamingDeliveryFailure = async (paramsLocal) => {
		let finalized = noVisibleFeishuReplyDelivery;
		let finalizationError;
		let fallbackPartial;
		let settlement = claimClosedStreamingResult(paramsLocal.ownerGeneration, paramsLocal.content);
		if (!settlement && paramsLocal.ownerGeneration !== void 0 && inFlightStreamingClose?.generation === paramsLocal.ownerGeneration) {
			const closeOutcome = await inFlightStreamingClose.promise;
			settlement = claimClosedStreamingResult(paramsLocal.ownerGeneration, paramsLocal.content) ?? closeOutcome;
		} else if (!settlement && paramsLocal.ownerGeneration !== void 0 && activeStreamingGeneration === paramsLocal.ownerGeneration) settlement = await closeStreaming();
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
		const cause = finalizationError ? new AggregateError([mediaCause, finalizationError instanceof Error ? finalizationError.cause ?? finalizationError : finalizationError], "Feishu reply delivery and streaming finalization failed") : mediaCause;
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
				closedStreamingSettlements.clear();
				sentIndependentBlockText = false;
				idleRequestedForReply = false;
				visibleReplySent = false;
				replyOutcome = void 0;
			}
			if (previewStreamingEnabled && renderMode === "card") startStreaming();
			await Promise.resolve(typingCallbacks?.onReplyStart?.());
		},
		onIdle: () => queueIdleSideEffects(),
		onCleanup: () => {
			typingCallbacks?.onCleanup?.();
		}
	};
	const handleDeliveryError = async (error, info) => {
		if (info.kind === "final") replyOutcome = { kind: "failed" };
		if (isChannelPartialDeliveryError(error)) markVisibleReplySent();
		params.runtime.error?.(`feishu[${account.accountId}] ${info.kind} reply failed: ${String(error)}`);
		await queueIdleSideEffects().catch((cleanupError) => params.runtime.error?.(`feishu[${account.accountId}] reply error cleanup failed: ${String(cleanupError)}`));
	};
	return {
		dispatcherOptions,
		delivery: {
			observeMessageSent: true,
			onDelivered: (_payload, info, result) => {
				if (result?.visibleReplySent) {
					markVisibleReplySent();
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
				const text = info?.kind === "final" && !hasIndependentPresentation ? mergeStreamingFinalText(streamText, reply.text, payload.isError === true && hasStreamingFinalText) : reply.text;
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
				const cardRenderingRequested = renderMode === "card" || info?.kind === "block" && coreBlockStreamingEnabled && renderMode !== "raw" || renderMode === "auto" && shouldUseCard(text);
				const useStaticCard = hasText && cardRenderingRequested && withinCardTableLimit(text);
				const useStreamingCard = hasText && streamingEnabled && !finalTextExceedsStreamingLimit && (info?.kind === "final" || cardRenderingRequested);
				const skipTextForDuplicateFinal = !hasIndependentPresentation && info?.kind === "final" && hasText && deliveredFinalTexts.has(text);
				const shouldDeliverText = hasText && (!hasVoiceMedia || hasPresentationFallback) && !skipTextForDuplicateFinal;
				const shouldDiscardStreamingPreview = info?.kind === "final" && !(hasIndependentPresentation && payload.isError === true && hasStreamingFinalText) && (hasIndependentPresentation || finalTextExceedsStreamingLimit || hasMedia && (hasVoiceMedia && !shouldDeliverText && !ttsTextAlreadyVisible || skipTextForDuplicateFinal));
				const priorClosedStreamingSettlement = info?.kind === "final" && hasText && skipTextForDuplicateFinal ? claimClosedStreamingResult(void 0, text) : void 0;
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
						cfg,
						to: sendTarget,
						card: presentationCard,
						replyToMessageId: sendReplyToMessageId,
						replyInThread: effectiveReplyInThread,
						allowTopLevelReplyFallback,
						accountId
					}).then((result) => createFeishuReplyDeliveryResult({
						results: [result],
						visibleReplySent: true,
						content: resolvedText,
						kind: "card"
					})), resolvedText);
					markVisibleReplySent();
					return mergeFeishuReplyDeliveryResults(deliveredResults, resolvedText);
				}
				if (shouldDeliverText) {
					if (hasPresentationFallback || info?.kind === "block" && !useStreamingCard) {
						if (hasPresentationFallback || coreBlockStreamingEnabled) {
							const firstChunkMentions = info?.kind === "final" || info?.kind === "block" && !sentIndependentBlockText ? mentionTargets : void 0;
							await collectDelivery(sendPostReply(text, info?.kind, firstChunkMentions));
							if (info?.kind === "block") sentIndependentBlockText = true;
							if (hasMedia) await collectDelivery(sendMediaReplies(payload));
						}
						return mergeFeishuReplyDeliveryResults(deliveredResults, text);
					}
					if (info?.kind === "block") {
						startStreaming();
						if (streamingStartPromise) await streamingStartPromise;
					}
					if (info?.kind === "final" && useStreamingCard) {
						startStreaming();
						if (streamingStartPromise) await streamingStartPromise;
					}
					const shouldStreamText = info?.kind === "block" || info?.kind === "final";
					const matchingInFlightClose = info?.kind === "final" && inFlightStreamingClose?.disposition === "closed" && inFlightStreamingClose.content === text ? inFlightStreamingClose : void 0;
					const ownerGeneration = activeStreamingGeneration ?? matchingInFlightClose?.generation;
					if (shouldStreamText && ownerGeneration !== void 0 && (streaming?.isActive() || matchingInFlightClose !== void 0)) {
						if (activeStreamingGeneration !== void 0) {
							if (info?.kind === "block") queueStreamingUpdate(text, {
								mode: "delta",
								dedupeWithLastPartial: true
							});
							if (info?.kind === "final") {
								streamText = text;
								hasStreamingFinalText = true;
								snapshotBaseText = "";
								lastSnapshotTextLength = text.length;
								flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
							}
						}
						if (hasMedia) try {
							await collectDelivery(sendMediaReplies(payload));
						} catch (error) {
							await throwStreamingDeliveryFailure({
								error,
								content: text,
								infoKind: info?.kind,
								ownerGeneration
							});
						}
						return deferStreamingDelivery(mergeFeishuReplyDeliveryResults(deliveredResults, text), info?.kind, ownerGeneration);
					}
					if (useStaticCard || useStreamingCard && !isStreamingStartBackedOff(account.accountId) && withinCardTableLimit(text)) {
						const cardHeader = resolveCardHeader(agentId, identity);
						const cardNote = resolveCardNote(agentId, identity, responsePrefixContextProvider());
						deliveredResults.push(await sendChunkedTextReply({
							text,
							useCard: true,
							infoKind: info?.kind,
							header: cardHeader,
							note: cardNote,
							chunkMentions: requiredMentionTargets,
							sendChunk: async ({ chunk, mentions }) => await sendStructuredCardFeishu({
								cfg,
								to: sendTarget,
								text: chunk,
								replyToMessageId: sendReplyToMessageId,
								replyInThread: effectiveReplyInThread,
								allowTopLevelReplyFallback,
								accountId,
								header: cardHeader,
								note: cardNote,
								...mentions ? { mentions } : {}
							})
						}));
					} else {
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
			disableBlockStreaming: typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : true,
			onPartialReply: previewStreamingEnabled ? (payload) => {
				if (!payload.text) return false;
				const cleaned = stripReasoningTagsFromText(payload.text, {
					mode: "strict",
					trim: "both"
				});
				if (!cleaned) return false;
				startStreaming();
				queueStreamingUpdate(cleaned, {
					dedupeWithLastPartial: true,
					mode: "snapshot"
				});
				return false;
			} : void 0,
			onReasoningStream: reasoningPreviewEnabled ? (payload) => {
				if (!payload.text) return false;
				startStreaming();
				queueReasoningUpdate(formatReasoningMessage(payload.text));
				return false;
			} : void 0,
			onReasoningEnd: reasoningPreviewEnabled ? () => false : void 0,
			onItemEvent: previewStreamingEnabled ? (payload) => {
				if (payload.kind === "preamble" || payload.hideFromChannelProgress || payload.suppressChannelProgress) return false;
				const { kind: itemKind, ...item } = payload;
				const statusLineLocal = formatChannelProgressDraftLineForEntry(account.config, {
					event: "item",
					itemKind,
					...item
				});
				if (statusLineLocal) return updateStreamingStatusLine(statusLineLocal);
				return false;
			} : void 0,
			onAssistantMessageStart: previewStreamingEnabled ? () => updateStreamingStatusLine("", { startIfNeeded: false }) : void 0,
			onCompactionStart: previewStreamingEnabled ? () => updateStreamingStatusLine("📦 **Compacting context...**") : void 0,
			onCompactionEnd: previewStreamingEnabled ? () => updateStreamingStatusLine("") : void 0
		},
		ensureNoVisibleReplyFallback,
		getVisibleReplyState: () => ({
			visibleReplySent,
			skippedFinalReason: replyOutcome?.kind === "skipped" || replyOutcome?.kind === "suppressed" ? replyOutcome.reason : null
		})
	};
}
//#endregion
//#region extensions/feishu/src/synthetic-event-target.ts
const directPreDispatchTargets = /* @__PURE__ */ new WeakMap();
/** Keep synthetic-only routing metadata outside the public Feishu event shape. */
function setFeishuSyntheticDirectPreDispatchTarget(event, target) {
	directPreDispatchTargets.set(event, target);
	return event;
}
function getFeishuSyntheticDirectPreDispatchTarget(event) {
	return directPreDispatchTargets.get(event);
}
//#endregion
//#region extensions/feishu/src/bot.ts
const permissionErrorNotifiedAt = /* @__PURE__ */ new Map();
const PERMISSION_ERROR_COOLDOWN_MS = 3e5;
function isFeishuTopicSessionScope(scope) {
	return scope === "group_topic" || scope === "group_topic_sender";
}
async function resolveFeishuAudioTranscript(params) {
	if (params.messageType !== "audio") return;
	const audioMedia = params.mediaList.filter((media) => Boolean(media.path) && (media.kind === "audio" || media.contentType?.startsWith("audio/")));
	if (audioMedia.length === 0) return;
	if (params.content.trim()) return params.content;
	try {
		const { transcribeFirstAudio } = await import("./audio-preflight.runtime-BBfC9elv.mjs");
		return await transcribeFirstAudio({
			ctx: {
				media: audioMedia,
				ChatType: params.chatType
			},
			cfg: params.cfg
		});
	} catch (err) {
		params.log(`feishu: audio preflight transcription failed: ${String(err)}`);
		return;
	}
}
/**
* Parse an inbound Feishu event into its caption and routing metadata.
*/
function parseFeishuMessageEvent(event, botOpenId, _botName, preparedContent) {
	const mentionedBot = checkBotMentioned(event, botOpenId);
	const hasAnyMention = (event.message.mentions?.length ?? 0) > 0;
	const content = preparedContent ?? normalizeMentions(parseMessageContent(event.message.content, event.message.message_type), event.message.mentions, botOpenId);
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
async function shouldIncludeFetchedGroupContextMessage(params) {
	let senderAllowed = !params.isGroup || params.allowFrom.length === 0 || params.senderType === "app";
	const senderId = params.senderId?.trim();
	if (!senderAllowed && senderId) senderAllowed = (await resolveFeishuGroupSenderActivationIngressAccess({
		cfg: params.cfg,
		accountId: params.accountId,
		chatId: params.chatId,
		allowFrom: params.allowFrom,
		senderOpenId: senderId,
		senderUserId: senderId,
		requireMention: false,
		mentionedBot: true
	})).senderAccess.decision === "allow";
	return evaluateSupplementalContextVisibility({
		mode: params.mode,
		kind: params.kind,
		senderAllowed
	}).include;
}
async function filterFetchedGroupContextMessages(messages, params) {
	return (await Promise.all(messages.map(async (message) => await shouldIncludeFetchedGroupContextMessage({
		cfg: params.cfg,
		accountId: params.accountId,
		chatId: params.chatId,
		isGroup: params.isGroup,
		allowFrom: params.allowFrom,
		mode: params.mode,
		kind: params.kind,
		senderId: message.senderId,
		senderType: message.senderType
	}) ? message : void 0))).filter((message) => message !== void 0);
}
async function handleFeishuMessage(params) {
	const { event, preparedContent, botOpenId, botName, runtime, channelRuntime, chatHistories, accountId, processingClaim, messageDedupeKey: messageDedupeKeyOverride, turnAdoptionLifecycle } = params;
	const cfg = getFeishuRuntime().config.current();
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	const feishuCfg = account.config;
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
	let ctx = parseFeishuMessageEvent(event, botOpenId, botName, preparedContent);
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
			let verifiedEvent;
			try {
				const response = await createFeishuClient(account).im.message.get({
					params: { user_id_type: "open_id" },
					path: { message_id: ctx.messageId }
				});
				const verifiedKey = (response.data?.items?.[0]?.mentions?.find((mention) => mention.id_type === "open_id" && mention.id === localBotOpenId && Boolean(mention.key?.trim())))?.key?.trim();
				if (response.code === 0 && verifiedKey) {
					const eventMention = event.message.mentions?.find((mention) => mention.key === verifiedKey && !isFeishuBroadcastMention(mention));
					if (eventMention) verifiedEvent = {
						...event,
						message: {
							...event.message,
							mentions: event.message.mentions?.map((mention) => mention === eventMention ? {
								...mention,
								id: {
									...mention.id,
									open_id: localBotOpenId
								}
							} : mention)
						}
					};
				}
			} catch (err) {
				log(`feishu[${account.accountId}]: failed to verify bot mention for ${ctx.messageId}: ${String(err)}`);
			}
			if (!verifiedEvent) {
				log(`feishu[${account.accountId}]: dropping bot message ${ctx.messageId} (local mention not verifiable)`);
				return;
			}
			const deliveredCtx = parseFeishuMessageEvent(verifiedEvent, localBotOpenId, botName, preparedContent);
			ctx = {
				...deliveredCtx,
				mentionedBot: true,
				content: normalizeFeishuCommandProbeBody(deliveredCtx.content),
				mentionTargets: void 0
			};
		}
	}
	if (event.message.message_type === "merge_forward") {
		log(`feishu[${account.accountId}]: processing merge_forward message, fetching full content via API`);
		try {
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
	}
	let permissionErrorForAgent;
	if (feishuCfg?.resolveSenderNames ?? true) {
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
	log(`feishu[${account.accountId}]: received message from ${ctx.senderOpenId} in ${ctx.chatId} (${ctx.chatType})`);
	if (ctx.mentionTargets && ctx.mentionTargets.length > 0) {
		const names = ctx.mentionTargets.map((t) => t.name).join(", ");
		log(`feishu[${account.accountId}]: detected @ forward request, targets: [${names}]`);
	}
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
				log(`feishu[${account.accountId}]: hydrated topic thread_id=${hydratedThreadId} for message=${topicHydrationMessageId}`);
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
	const groupHistoryKey = isGroup ? groupSession?.peerId ?? ctx.chatId : void 0;
	const dmPolicy = feishuCfg?.dmPolicy ?? "pairing";
	const configAllowFrom = feishuCfg?.allowFrom ?? [];
	const rawBroadcastAgents = isGroup ? resolveBroadcastAgents(cfg, ctx.chatId) : null;
	const broadcastAgents = rawBroadcastAgents ? uniqueStrings(rawBroadcastAgents.map((id) => normalizeAgentId$1(id))) : null;
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
			isDirectMessage: false,
			cfg,
			accountId: account.accountId,
			groupId: ctx.chatId,
			groupPolicy
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
		const commandProbeBody = isGroup ? normalizeFeishuCommandProbeBody(ctx.content) : ctx.content;
		const shouldComputeCommandAuthorized = core.channel.commands.shouldComputeCommandAuthorized(commandProbeBody, cfg);
		const resolveDirectAuthorization = async (candidateCfg, mayPair, shouldComputeCommand = core.channel.commands.shouldComputeCommandAuthorized(commandProbeBody, candidateCfg)) => {
			const candidateAccount = resolveFeishuRuntimeAccount({
				cfg: candidateCfg,
				accountId: account.accountId
			});
			const candidateDmPolicy = candidateAccount.config.dmPolicy ?? "pairing";
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
		let effectiveDmPolicy = directAuthorization?.dmPolicy ?? dmPolicy;
		let effectiveConfigAllowFrom = directAuthorization?.configAllowFrom ?? configAllowFrom;
		let effectiveDmIngress = dmIngress;
		let effectiveShouldComputeCommandAuthorized = directAuthorization?.shouldComputeCommandAuthorized ?? shouldComputeCommandAuthorized;
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
				effectiveDmPolicy = currentAuthorization.dmPolicy;
				effectiveConfigAllowFrom = currentAuthorization.configAllowFrom;
				effectiveDmIngress = currentAuthorization.ingress;
				effectiveShouldComputeCommandAuthorized = currentAuthorization.shouldComputeCommandAuthorized;
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
		const feishuAcpConversationSupported = !isGroup || groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender";
		if (isGroup && groupSession) log(`feishu[${account.accountId}]: group session scope=${groupSession.groupSessionScope}, peer=${peerId}`);
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
				log: (msg) => log(msg)
			});
			if (result.created || result.updatedCfg !== effectiveCfg) {
				const refreshedAuthorization = await resolveDirectAuthorization(result.updatedCfg, false);
				if (refreshedAuthorization.ingress.ingress.admission !== "dispatch") {
					log(`feishu[${account.accountId}]: current policy rejected stale DM from ${ctx.senderOpenId} before adopting refreshed dynamic route (dmPolicy=${refreshedAuthorization.dmPolicy})`);
					return;
				}
				effectiveCfg = result.updatedCfg;
				effectiveDmPolicy = refreshedAuthorization.dmPolicy;
				effectiveConfigAllowFrom = refreshedAuthorization.configAllowFrom;
				effectiveDmIngress = refreshedAuthorization.ingress;
				effectiveShouldComputeCommandAuthorized = refreshedAuthorization.shouldComputeCommandAuthorized;
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
			const runtimeRoute = resolveRuntimeConversationBindingRoute({
				route,
				conversation: {
					channel: "feishu",
					accountId: account.accountId,
					conversationId: currentConversationId,
					...parentConversationId ? { parentConversationId } : {}
				}
			});
			route = runtimeRoute.route;
			if (runtimeRoute.bindingRecord) {
				configuredBinding = null;
				log(runtimeRoute.boundSessionKey ? `feishu[${account.accountId}]: routed via bound conversation ${currentConversationId} -> ${runtimeRoute.boundSessionKey}` : `feishu[${account.accountId}]: plugin-bound conversation ${currentConversationId}`);
			}
		}
		if (configuredBinding) {
			const ensured = await ensureConfiguredBindingRouteReady({
				cfg: effectiveCfg,
				bindingResolution: configuredBinding
			});
			if (!ensured.ok) {
				const acpTopicReply = isGroup && (groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender");
				const replyTargetMessageId = directThreadReply ? directThreadReplyTargetMessageId : acpTopicReply ? ctx.rootId ?? ctx.messageId : ctx.messageId;
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
		const preview = truncateUtf16Safe(ctx.content.replace(/\s+/g, " "), 160);
		const inboundLabel = isGroup ? `Feishu[${account.accountId}] message in group ${ctx.chatId}` : `Feishu[${account.accountId}] DM from ${ctx.senderOpenId}`;
		const contextVisibilityMode = resolveChannelContextVisibilityMode({
			cfg: effectiveCfg,
			channel: "feishu",
			accountId: account.accountId
		});
		log(`feishu[${account.accountId}]: ${inboundLabel}: ${preview}`);
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
		let quotedMessageInfo = null;
		let quotedContent;
		if (ctx.parentId) try {
			quotedMessageInfo = await getMessageFeishu({
				cfg,
				messageId: ctx.parentId,
				accountId: account.accountId
			});
			if (quotedMessageInfo && await shouldIncludeFetchedGroupContextMessage({
				cfg,
				accountId: account.accountId,
				chatId: ctx.chatId,
				isGroup,
				allowFrom: effectiveGroupSenderAllowFrom,
				mode: contextVisibilityMode,
				kind: "quote",
				senderId: quotedMessageInfo.senderId,
				senderType: quotedMessageInfo.senderType
			})) {
				quotedContent = quotedMessageInfo.content;
				log(`feishu[${account.accountId}]: fetched quoted message: ${truncateUtf16Safe(quotedContent, 100)}`);
			} else if (quotedMessageInfo) log(`feishu[${account.accountId}]: skipped quoted message from sender ${quotedMessageInfo.senderId ?? "unknown"} (mode=${contextVisibilityMode})`);
		} catch (err) {
			log(`feishu[${account.accountId}]: failed to fetch quoted message: ${String(err)}`);
		}
		if (!mediaFailureContent.trim() && mediaList.length === 0 && !quotedContent?.trim()) {
			log(`feishu[${account.accountId}]: skipping empty message (no text, no media, no quoted) from ${ctx.senderOpenId}`);
			return;
		}
		const audioTranscript = await resolveFeishuAudioTranscript({
			cfg: effectiveCfg,
			mediaList,
			content: ctx.content,
			messageType: event.message.message_type,
			chatType: isGroup ? "group" : "direct",
			log
		});
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
		const effectiveCommandProbeBody = audioTranscript === void 0 ? commandProbeBody : isGroup ? normalizeFeishuCommandProbeBody(audioTranscript) : audioTranscript;
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
		const isTopicSessionForThread = isGroup && (groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender");
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
		let rootMessageInfo;
		let rootMessageThreadId;
		let rootMessageFetched = false;
		const getRootMessageInfo = async () => {
			if (!ctx.rootId) return null;
			if (!rootMessageFetched) {
				rootMessageFetched = true;
				if (ctx.rootId === ctx.parentId && quotedMessageInfo) rootMessageInfo = quotedMessageInfo;
				else try {
					rootMessageInfo = await getMessageFeishu({
						cfg,
						messageId: ctx.rootId,
						accountId: account.accountId
					});
				} catch (err) {
					log(`feishu[${account.accountId}]: failed to fetch root message: ${String(err)}`);
					rootMessageInfo = null;
				}
				rootMessageThreadId = rootMessageInfo?.threadId;
				if (rootMessageInfo && !await shouldIncludeFetchedGroupContextMessage({
					cfg,
					accountId: account.accountId,
					chatId: ctx.chatId,
					isGroup,
					allowFrom: effectiveGroupSenderAllowFrom,
					mode: contextVisibilityMode,
					kind: "thread",
					senderId: rootMessageInfo.senderId,
					senderType: rootMessageInfo.senderType
				})) {
					log(`feishu[${account.accountId}]: skipped thread starter from sender ${rootMessageInfo.senderId ?? "unknown"} (mode=${contextVisibilityMode})`);
					rootMessageInfo = null;
				}
			}
			return rootMessageInfo ?? null;
		};
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
			const threadContext = { threadLabel: (ctx.rootId || ctx.threadId) && isTopicSessionForThread ? `Feishu thread in ${groupName ?? ctx.chatId}` : void 0 };
			if (!(ctx.rootId || ctx.threadId) || !isTopicSessionForThread) {
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			const storePath = resolveStorePath(cfg.session?.store, { agentId });
			if (core.channel.session.readSessionUpdatedAt({
				storePath,
				sessionKey: agentSessionKey
			})) {
				log(`feishu[${account.accountId}]: skipping thread bootstrap for existing session ${agentSessionKey}`);
				threadContextBySessionKey.set(agentSessionKey, threadContext);
				return threadContext;
			}
			const rootMsg = await getRootMessageInfo();
			const feishuThreadId = ctx.threadId ?? rootMessageThreadId ?? rootMsg?.threadId;
			if (feishuThreadId) log(`feishu[${account.accountId}]: resolved thread ID: ${feishuThreadId}`);
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
				const senderIds = new Set([ctx.senderOpenId, senderUserId].map((id) => id?.trim()).filter((id) => id !== void 0 && id.length > 0));
				const allowlistedMessages = await filterFetchedGroupContextMessages(threadMessages, {
					cfg,
					accountId: account.accountId,
					chatId: ctx.chatId,
					isGroup,
					allowFrom: effectiveGroupSenderAllowFrom,
					mode: contextVisibilityMode,
					kind: "history"
				});
				const relevantMessages = senderScoped ? allowlistedMessages.filter((msg) => msg.senderType === "app" || msg.senderId !== void 0 && senderIds.has(msg.senderId.trim())) : allowlistedMessages;
				const threadStarterBody = rootMsg?.content ?? relevantMessages[0]?.content;
				const historyMessages = Boolean(rootMsg?.content || ctx.rootId) ? relevantMessages : relevantMessages.slice(1);
				const historyParts = historyMessages.map((msg) => {
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
				log(`feishu[${account.accountId}]: populated thread bootstrap with starter=${threadStarterBody ? "yes" : "no"} history=${historyMessages.length}`);
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
				threadId: ctx.rootId && isTopicSessionForThread ? ctx.rootId : void 0
			}) : await resolveFeishuDmIngressAccess({
				cfg: effectiveCfg,
				accountId: account.accountId,
				dmPolicy: effectiveDmPolicy,
				allowFrom: effectiveConfigAllowFrom,
				readAllowFromStore: pairing.readAllowFromStore,
				senderOpenId: ctx.senderOpenId,
				senderUserId,
				conversationId: ctx.senderOpenId,
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
					label: isGroup && groupName && !isTopicSessionForThread ? groupName : void 0,
					threadId: ctx.rootId && isTopicSessionForThread ? ctx.rootId : void 0
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
					messageThreadId: ctx.rootId && isTopicSessionForThread ? ctx.rootId : void 0
				},
				message: {
					body: combinedBody,
					bodyForAgent: messageBody,
					inboundHistory,
					rawBody: commandFacingContent,
					commandBody: commandFacingContent
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
		const isTopicSession = isGroup && (groupSession?.groupSessionScope === "group_topic" || groupSession?.groupSessionScope === "group_topic_sender");
		const configReplyInThread = isGroup && (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled";
		const topicReplyTargetMessageId = ctx.rootId ?? defaultReplyTargetMessageId;
		const replyTargetMessageId = directThreadReply ? directThreadReplyTargetMessageId : isTopicSession || configReplyInThread ? topicReplyTargetMessageId : defaultReplyTargetMessageId;
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
			const agentIds = (cfg.agents?.list ?? []).map((a) => normalizeAgentId$1(a.id));
			const hasKnownAgents = agentIds.length > 0;
			log(`feishu[${account.accountId}]: broadcasting to ${broadcastAgents.length} agents (strategy=${strategy}, active=${activeAgentId ?? "none"})`);
			const createBroadcastInboundAdapter = (paramsLocal) => ({
				ingest: () => ({
					id: ctx.messageId,
					timestamp: messageCreateTimeMs,
					rawText: ctx.content,
					textForAgent: paramsLocal.ctxPayload.BodyForAgent,
					textForCommands: paramsLocal.ctxPayload.CommandBody,
					raw: ctx
				}),
				resolveTurn: () => ({
					cfg,
					channel: "feishu",
					accountId: route.accountId,
					route: {
						agentId: paramsLocal.agentId,
						sessionKey: paramsLocal.sessionKey
					},
					ctxPayload: paramsLocal.ctxPayload,
					record: paramsLocal.record,
					...paramsLocal.variant.kind === "observeOnly" ? {
						admission: {
							kind: "observeOnly",
							reason: "broadcast-observer"
						},
						delivery: { deliver: async () => ({ visibleReplySent: false }) },
						replyOptions: bindIngressLifecycleToReplyOptions(paramsLocal.lifecycle)
					} : {
						dispatcherOptions: paramsLocal.variant.dispatcher.dispatcherOptions,
						delivery: paramsLocal.variant.dispatcher.delivery,
						replyOptions: {
							...paramsLocal.variant.dispatcher.replyOptions,
							...bindIngressLifecycleToReplyOptions(paramsLocal.lifecycle)
						}
					}
				})
			});
			const dispatchForAgent = async (agentId) => {
				const normalizedAgentId = normalizeAgentId$1(agentId);
				if (hasKnownAgents && !agentIds.includes(normalizedAgentId)) {
					log(`feishu[${account.accountId}]: broadcast agent ${agentId} not found in agents.list; skipping`);
					return;
				}
				let agentClaim;
				for (let attempt = 0; attempt < 2; attempt += 1) {
					agentClaim = await claimUnprocessedFeishuMessage({
						messageId: broadcastDedupeKey,
						namespace: `broadcast:${normalizedAgentId}`,
						log
					});
					if (agentClaim.kind === "duplicate") return;
					if (agentClaim.kind !== "inflight") break;
					broadcastSettlement.onLanePending();
					try {
						await agentClaim.pending;
						return;
					} catch (err) {
						if (attempt === 1) throw err;
					}
				}
				const lane = broadcastSettlement.createLane(agentClaim?.kind === "claimed" ? agentClaim.handle : void 0);
				try {
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
					const allowReasoningPreview = resolveFeishuReasoningPreviewEnabled({
						cfg,
						agentId,
						storePath: agentStorePath,
						sessionKey: agentSessionKey
					});
					const agentCtx = await buildCtxPayloadForAgent(agentId, agentSessionKey, route.accountId, ctx.mentionedBot && agentId === activeAgentId);
					let variant;
					if (agentId === activeAgentId) {
						const identity = resolveAgentOutboundIdentity(cfg, agentId);
						variant = {
							kind: "active",
							dispatcher: createFeishuReplyDispatcher({
								cfg,
								agentId,
								runtime,
								chatId: ctx.chatId,
								sendTarget: feishuReplyTarget,
								allowReasoningPreview,
								replyToMessageId: replyTargetMessageId,
								typingTargetMessageId,
								skipReplyToInMessages: !isGroup && !directThreadReply,
								replyInThread,
								rootId: ctx.rootId,
								threadReply,
								accountId: account.accountId,
								identity,
								mentionTargets: ctx.mentionTargets,
								requiredMentionTargets,
								messageCreateTimeMs,
								sessionKey: agentSessionKey
							})
						};
						log(`feishu[${account.accountId}]: broadcast active dispatch agent=${agentId} (session=${agentSessionKey})`);
					} else {
						delete agentCtx.CommandAuthorized;
						variant = { kind: "observeOnly" };
						log(`feishu[${account.accountId}]: broadcast observer dispatch agent=${agentId} (session=${agentSessionKey})`);
					}
					const turnResult = await core.channel.inbound.run({
						channel: "feishu",
						accountId: route.accountId,
						raw: ctx,
						adapter: createBroadcastInboundAdapter({
							agentId,
							sessionKey: agentSessionKey,
							ctxPayload: agentCtx,
							record: agentRecord,
							lifecycle: lane.lifecycle,
							variant
						})
					});
					if (variant.kind === "active" && turnResult.dispatched && shouldSendNoVisibleReplyFallback(turnResult.dispatchResult)) await variant.dispatcher.ensureNoVisibleReplyFallback("broadcast-dispatch-complete-no-visible-reply");
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
			log(`feishu[${account.accountId}]: broadcast dispatch complete for ${broadcastAgents.length} agents`);
		} else {
			const ctxPayload = await buildCtxPayloadForAgent(route.agentId, route.sessionKey, route.accountId, ctx.mentionedBot);
			const identity = resolveAgentOutboundIdentity(effectiveCfg, route.agentId);
			const storePath = resolveStorePath(effectiveCfg.session?.store, { agentId: route.agentId });
			const allowReasoningPreview = resolveFeishuReasoningPreviewEnabled({
				cfg: effectiveCfg,
				agentId: route.agentId,
				storePath,
				sessionKey: route.sessionKey
			});
			const { dispatcherOptions, delivery, replyOptions, ensureNoVisibleReplyFallback } = createFeishuReplyDispatcher({
				cfg: effectiveCfg,
				agentId: route.agentId,
				runtime,
				chatId: ctx.chatId,
				sendTarget: feishuReplyTarget,
				allowReasoningPreview,
				replyToMessageId: replyTargetMessageId,
				typingTargetMessageId,
				skipReplyToInMessages: !isGroup && !directThreadReply,
				replyInThread,
				rootId: ctx.rootId,
				threadReply,
				accountId: account.accountId,
				identity,
				mentionTargets: ctx.mentionTargets,
				requiredMentionTargets,
				messageCreateTimeMs,
				sessionKey: route.sessionKey
			});
			log(`feishu[${account.accountId}]: dispatching to agent (session=${route.sessionKey})`);
			const turnResult = await core.channel.inbound.run({
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
					resolveTurn: () => ({
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
					})
				}
			});
			if (!turnResult.dispatched) return;
			const { dispatchResult } = turnResult;
			const { queuedFinal, counts } = dispatchResult;
			if (shouldSendNoVisibleReplyFallback(dispatchResult)) await ensureNoVisibleReplyFallback("dispatch-complete-no-visible-reply");
			log(`feishu[${account.accountId}]: dispatch complete (queuedFinal=${queuedFinal}, replies=${counts.final})`);
		}
	} catch (err) {
		error(`feishu[${account.accountId}]: failed to dispatch message: ${String(err)}`);
		if (turnAdoptionLifecycle) throw err;
	}
}
//#endregion
//#region extensions/feishu/src/card-action-state.ts
const processedCardActions = /* @__PURE__ */ new Map();
const resolvedCardActionChatTypes = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/feishu/src/card-ux-shared.ts
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
//#endregion
//#region extensions/feishu/src/card-ux-approval.ts
const FEISHU_APPROVAL_REQUEST_ACTION = "feishu.quick_actions.request_approval";
const FEISHU_APPROVAL_CONFIRM_ACTION = "feishu.approval.confirm";
const FEISHU_APPROVAL_CANCEL_ACTION = "feishu.approval.cancel";
function createApprovalCard(params) {
	const context = buildFeishuCardInteractionContext(params);
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		header: {
			title: {
				tag: "plain_text",
				content: "Confirm action"
			},
			template: "orange"
		},
		body: { elements: [{
			tag: "markdown",
			content: params.prompt
		}, {
			tag: "action",
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
				label: params.cancelLabel ?? "Cancel",
				value: createFeishuCardInteractionEnvelope({
					k: "button",
					a: FEISHU_APPROVAL_CANCEL_ACTION,
					c: context
				})
			})]
		}] }
	};
}
//#endregion
//#region extensions/feishu/src/card-action.ts
const FEISHU_APPROVAL_CARD_TTL_MS = 3e5;
const FEISHU_CARD_ACTION_TOKEN_TTL_MS = 9e5;
function pruneProcessedCardActionTokens(now) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) {
		processedCardActions.clear();
		return;
	}
	for (const [key, entry] of processedCardActions.entries()) if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: validNow })) processedCardActions.delete(key);
}
function resolveProcessedCardActionTokenExpiresAt(now) {
	return resolveExpiresAtMsFromDurationMs(FEISHU_CARD_ACTION_TOKEN_TTL_MS, { nowMs: now });
}
function beginFeishuCardActionToken(params) {
	const now = params.now ?? Date.now();
	pruneProcessedCardActionTokens(now);
	const normalizedToken = params.token.trim();
	if (!normalizedToken) return false;
	const key = `${params.accountId}:${normalizedToken}`;
	const existing = processedCardActions.get(key);
	if (existing && isFutureDateTimestampMs(existing.expiresAt, { nowMs: now })) return false;
	processedCardActions.delete(key);
	const expiresAt = resolveProcessedCardActionTokenExpiresAt(now);
	if (expiresAt !== void 0) processedCardActions.set(key, {
		status: "inflight",
		expiresAt
	});
	return true;
}
function completeFeishuCardAction(actionId, accountId, now = Date.now()) {
	const normalizedActionId = actionId.trim();
	if (!normalizedActionId) return;
	const key = `${accountId}:${normalizedActionId}`;
	const expiresAt = resolveProcessedCardActionTokenExpiresAt(now);
	if (expiresAt === void 0) {
		processedCardActions.delete(key);
		return;
	}
	processedCardActions.set(key, {
		status: "completed",
		expiresAt
	});
}
function buildSyntheticMessageEvent$1(event, content, chatType, botOpenId) {
	const replyTargetMessageId = event.context.open_message_id ?? event.open_message_id;
	const isTemporaryCardActionId = replyTargetMessageId?.startsWith("card-action-c-");
	const validReplyTargetId = replyTargetMessageId && !isTemporaryCardActionId ? replyTargetMessageId : void 0;
	const normalizedBotOpenId = chatType === "group" ? botOpenId?.trim() : void 0;
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
			chat_type: chatType,
			message_type: "text",
			content: JSON.stringify({ text: content }),
			...normalizedBotOpenId ? { mentions: [{
				key: "mention_bot",
				id: { open_id: normalizedBotOpenId },
				name: "bot"
			}] } : {}
		}
	};
}
function resolveCallbackTarget(event) {
	const chatId = event.context.chat_id?.trim();
	if (chatId) return `chat:${chatId}`;
	return `user:${event.operator.open_id}`;
}
async function dispatchSyntheticCommand(params) {
	const resolvedChatType = await resolveCardActionChatType({
		event: params.event,
		account: params.account,
		chatType: params.chatType,
		log: params.runtime?.log ?? console.log
	});
	await handleFeishuMessage({
		trackTask: params.trackTask,
		cfg: params.cfg,
		event: buildSyntheticMessageEvent$1(params.event, params.command, resolvedChatType, params.botOpenId),
		botOpenId: params.botOpenId,
		runtime: params.runtime,
		channelRuntime: params.channelRuntime,
		accountId: params.accountId
	});
}
const resolvedChatTypeCache = resolvedCardActionChatTypes;
const CHAT_TYPE_CACHE_TTL_MS = 18e5;
const CHAT_TYPE_CACHE_MAX_SIZE = 5e3;
function pruneChatTypeCache(now) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) {
		resolvedChatTypeCache.clear();
		return;
	}
	for (const [key, entry] of resolvedChatTypeCache.entries()) {
		const expiresAt = asDateTimestampMs(entry.expiresAt);
		if (expiresAt === void 0 || expiresAt <= validNow) resolvedChatTypeCache.delete(key);
	}
	if (resolvedChatTypeCache.size > CHAT_TYPE_CACHE_MAX_SIZE) {
		const excess = resolvedChatTypeCache.size - CHAT_TYPE_CACHE_MAX_SIZE;
		const iter = resolvedChatTypeCache.keys();
		for (let i = 0; i < excess; i++) {
			const key = iter.next().value;
			if (key !== void 0) resolvedChatTypeCache.delete(key);
		}
	}
}
function sanitizeLogValue(v) {
	return truncateUtf16Safe(v.replace(/[\r\n]/g, " "), 500);
}
function resolveFeishuApprovalCardExpiresAt(nowRaw = Date.now()) {
	const now = asDateTimestampMs(nowRaw);
	return now === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(FEISHU_APPROVAL_CARD_TTL_MS, { nowMs: now });
}
function cacheResolvedCardActionChatType(cacheKey, value, now) {
	const expiresAt = resolveExpiresAtMsFromDurationMs(CHAT_TYPE_CACHE_TTL_MS, { nowMs: now });
	resolvedChatTypeCache.delete(cacheKey);
	if (expiresAt !== void 0) resolvedChatTypeCache.set(cacheKey, {
		value,
		expiresAt
	});
}
async function resolveCardActionChatType(params) {
	const explicitChatType = normalizeFeishuChatType(params.chatType);
	if (explicitChatType) return explicitChatType;
	const chatId = params.event.context.chat_id?.trim();
	if (!chatId) return "p2p";
	const cacheKey = `${params.account.accountId}:${chatId}`;
	const now = Date.now();
	pruneChatTypeCache(now);
	const cached = resolvedChatTypeCache.get(cacheKey);
	const cachedExpiresAt = cached ? asDateTimestampMs(cached.expiresAt) : void 0;
	if (cached && cachedExpiresAt !== void 0) return cached.value;
	if (cached) resolvedChatTypeCache.delete(cacheKey);
	try {
		const response = await createFeishuClient(params.account).im.chat.get({ path: { chat_id: chatId } });
		if (response.code === 0) {
			const resolvedChatType = resolveFeishuChatType(response.data ?? {});
			if (resolvedChatType) {
				cacheResolvedCardActionChatType(cacheKey, resolvedChatType, now);
				return resolvedChatType;
			}
			params.log(`feishu[${params.account.accountId}]: card action missing chat type for chat; defaulting to p2p`);
		} else params.log(`feishu[${params.account.accountId}]: failed to resolve chat type: ${sanitizeLogValue(response.msg ?? "unknown error")}; defaulting to p2p`);
	} catch (err) {
		const message = err instanceof Error ? err.message : "unknown";
		params.log(`feishu[${params.account.accountId}]: failed to resolve chat type: ${sanitizeLogValue(message)}; defaulting to p2p`);
	}
	return "p2p";
}
async function sendInvalidInteractionNotice(params) {
	const reasonText = params.reason === "stale" ? "This card action has expired. Open a fresh launcher card and try again." : params.reason === "wrong_user" ? "This card action belongs to a different user." : params.reason === "wrong_conversation" ? "This card action belongs to a different conversation." : "This card action payload is invalid.";
	await sendMessageFeishu({
		cfg: params.cfg,
		to: resolveCallbackTarget(params.event),
		text: `⚠️ ${reasonText}`,
		accountId: params.accountId
	});
}
async function handleFeishuCardAction(params) {
	const { cfg, event, runtime, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	const log = runtime?.log ?? console.log;
	if (!event.token.trim()) {
		log(`feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: missing token`);
		return;
	}
	const decoded = decodeFeishuCardAction({ event });
	if (!beginFeishuCardActionToken({
		token: event.token,
		accountId: account.accountId
	})) {
		log(`feishu[${account.accountId}]: skipping duplicate card action token`);
		return;
	}
	try {
		if (decoded.kind === "invalid") {
			log(`feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: ${decoded.reason}`);
			await sendInvalidInteractionNotice({
				cfg,
				event,
				reason: decoded.reason,
				accountId
			});
			completeFeishuCardAction(event.token, account.accountId);
			return;
		}
		if (decoded.kind === "structured") {
			const { envelope } = decoded;
			log(`feishu[${account.accountId}]: handling structured card action ${envelope.a} from ${event.operator.open_id}`);
			if (envelope.a === "feishu.quick_actions.request_approval") {
				const command = typeof envelope.m?.command === "string" ? envelope.m.command.trim() : "";
				if (!command) {
					await sendInvalidInteractionNotice({
						cfg,
						event,
						reason: "malformed",
						accountId
					});
					completeFeishuCardAction(event.token, account.accountId);
					return;
				}
				const prompt = typeof envelope.m?.prompt === "string" && envelope.m.prompt.trim() ? envelope.m.prompt : `Run \`${command}\` in this Feishu conversation?`;
				const expiresAt = resolveFeishuApprovalCardExpiresAt();
				if (expiresAt === void 0) {
					await sendInvalidInteractionNotice({
						cfg,
						event,
						reason: "malformed",
						accountId
					});
					completeFeishuCardAction(event.token, account.accountId);
					return;
				}
				await sendCardFeishu({
					cfg,
					to: resolveCallbackTarget(event),
					card: createApprovalCard({
						operatorOpenId: event.operator.open_id,
						chatId: event.context.chat_id || void 0,
						command,
						prompt,
						sessionKey: envelope.c?.s,
						expiresAt,
						chatType: await resolveCardActionChatType({
							event,
							account,
							chatType: envelope.c?.t,
							log
						}),
						confirmLabel: command === "/reset" ? "Reset" : "Confirm"
					}),
					accountId
				});
				completeFeishuCardAction(event.token, account.accountId);
				return;
			}
			if (envelope.a === "feishu.approval.cancel") {
				await sendMessageFeishu({
					cfg,
					to: resolveCallbackTarget(event),
					text: "Cancelled.",
					accountId
				});
				completeFeishuCardAction(event.token, account.accountId);
				return;
			}
			if (envelope.a === "feishu.approval.confirm" || envelope.k === "quick") {
				const command = envelope.q?.trim();
				if (!command) {
					await sendInvalidInteractionNotice({
						cfg,
						event,
						reason: "malformed",
						accountId
					});
					completeFeishuCardAction(event.token, account.accountId);
					return;
				}
				await dispatchSyntheticCommand({
					trackTask: params.trackTask,
					cfg,
					event,
					command,
					account,
					botOpenId: params.botOpenId,
					runtime,
					channelRuntime: params.channelRuntime,
					accountId,
					chatType: envelope.c?.t
				});
				completeFeishuCardAction(event.token, account.accountId);
				return;
			}
			await sendInvalidInteractionNotice({
				cfg,
				event,
				reason: "malformed",
				accountId
			});
			completeFeishuCardAction(event.token, account.accountId);
			return;
		}
		const content = buildFeishuCardActionTextFallback(event);
		log(`feishu[${account.accountId}]: handling card action from ${event.operator.open_id}: ${content}`);
		await dispatchSyntheticCommand({
			trackTask: params.trackTask,
			cfg,
			event,
			command: content,
			account,
			botOpenId: params.botOpenId,
			runtime,
			channelRuntime: params.channelRuntime,
			accountId
		});
		completeFeishuCardAction(event.token, account.accountId);
	} catch (err) {
		completeFeishuCardAction(event.token, account.accountId);
		throw err;
	}
}
//#endregion
//#region extensions/feishu/src/feishu-ingress.ts
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
	if (eventType === "im.message.receive_v1") {
		const message = isRecord$1(event.message) ? event.message : null;
		const chatId = normalizeNullableString(message?.chat_id);
		if (!chatId) {
			if (allowInvalidLane) return {
				eventId,
				eventType,
				laneKey: `invalid:${eventType}:${eventId}`
			};
			throw new FeishuIngressPermanentError("invalid-event", "Feishu message ingress envelope is missing event.message.chat_id.");
		}
		return {
			eventId,
			eventType,
			laneKey: `chat:${chatId}`
		};
	}
	const noticeMeta = isRecord$1(event.notice_meta) ? event.notice_meta : null;
	const fileType = normalizeNullableString(noticeMeta?.file_type);
	const documentId = normalizeNullableString(noticeMeta?.file_token);
	if (!fileType || !documentId) {
		if (allowInvalidLane) return {
			eventId,
			eventType,
			laneKey: `invalid:${eventType}:${eventId}`
		};
		throw new FeishuIngressPermanentError("invalid-event", "Feishu comment ingress envelope is missing its document identity.");
	}
	return {
		eventId,
		eventType,
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
	let terminal;
	let adopting;
	let abandoning;
	const releaseReplayClaims = () => {
		for (const claim of replayClaims) claim.release({ error: /* @__PURE__ */ new Error("feishu-ingress-not-adopted") });
	};
	const runAbandon = async () => {
		if (terminal) return;
		releaseReplayClaims();
		await transportLifecycle.onAbandoned();
		terminal = "abandoned";
	};
	const ensureAbandoned = async () => {
		if (terminal) return;
		const activeAbandonment = abandoning ?? runAbandon();
		abandoning = activeAbandonment;
		try {
			await activeAbandonment;
		} finally {
			if (abandoning === activeAbandonment && terminal !== "abandoned") abandoning = void 0;
		}
	};
	const abandonAll = async () => {
		if (terminal) return;
		if (adopting) {
			await adopting.catch(() => void 0);
			if (terminal) return;
		}
		await ensureAbandoned();
	};
	const adoptAll = async () => {
		if (terminal) return;
		if (abandoning) {
			await abandoning.catch(() => void 0);
			if (terminal) return;
		}
		const activeAdoption = adopting ?? (async () => {
			try {
				await transportLifecycle.onAdopted();
				terminal = "adopted";
				const results = await Promise.allSettled(replayClaims.map(async (claim) => claim.commit()));
				for (const result of results) if (result.status === "rejected") try {
					options?.onReplayCommitError?.(result.reason);
				} catch {}
			} catch (error) {
				await ensureAbandoned().catch(() => void 0);
				throw error;
			}
		})();
		adopting = activeAdoption;
		options?.trackTask?.(activeAdoption);
		try {
			await activeAdoption;
		} finally {
			if (adopting === activeAdoption && terminal !== "adopted") adopting = void 0;
		}
	};
	return {
		lifecycle: {
			abortSignal: transportLifecycle.abortSignal,
			onAdopted: async () => {
				handedOff = true;
				await adoptAll();
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
			}
		},
		settle: async () => {
			if (handedOff) return;
			handedOff = true;
			releaseReplayClaims();
			try {
				transportLifecycle.onAdoptionFinalizing();
				await transportLifecycle.onAdopted();
				terminal = "adopted";
			} catch (error) {
				await ensureAbandoned().catch(() => void 0);
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
		inspect: (rawEnvelope, context) => {
			const facts = inspectFeishuIngressEnvelope(rawEnvelope, options.encryptKey, context.phase === "admission");
			return facts ? {
				eventId: facts.eventId,
				laneKey: facts.laneKey
			} : null;
		},
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
			const abandonHandlers = /* @__PURE__ */ new Set();
			const wrappedLifecycle = {
				...lifecycle,
				onAdopted: lifecycle.onAdopted,
				onAbandoned: async () => {
					await Promise.allSettled([...abandonHandlers].map(async (handler) => await handler()));
					await lifecycle.onAbandoned();
				},
				registerAbandonHandler: (handler) => {
					abandonHandlers.add(handler);
					return () => abandonHandlers.delete(handler);
				}
			};
			activeLifecycles.set(claim.id, wrappedLifecycle);
			try {
				const result = await options.dispatcher.invoke(parseRawEnvelope(rawEnvelope), { needCheck: false });
				if (!isRecord$1(result)) return;
				if (result.kind === "deferred") return { kind: "deferred" };
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
			await monitor.admit(rawEnvelope, { facts: {
				eventId: facts.eventId,
				laneKey: facts.laneKey
			} });
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
//#endregion
//#region extensions/feishu/src/monitor-defaults.ts
const FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS = {
	windowMs: 6e4,
	maxRequests: 120,
	maxTrackedKeys: 4096
};
const FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS = {
	maxTrackedKeys: 4096,
	ttlMs: 216e5,
	logEvery: 25
};
function coercePositiveInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const normalized = Math.floor(value);
	return normalized > 0 ? normalized : fallback;
}
function resolveFeishuWebhookRateLimitDefaults(defaults) {
	const resolved = defaults;
	return {
		windowMs: coercePositiveInt(resolved?.windowMs, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.windowMs),
		maxRequests: coercePositiveInt(resolved?.maxRequests, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxRequests),
		maxTrackedKeys: coercePositiveInt(resolved?.maxTrackedKeys, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxTrackedKeys)
	};
}
function resolveFeishuWebhookAnomalyDefaults(defaults) {
	const resolved = defaults;
	return {
		maxTrackedKeys: coercePositiveInt(resolved?.maxTrackedKeys, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.maxTrackedKeys),
		ttlMs: coercePositiveInt(resolved?.ttlMs, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.ttlMs),
		logEvery: coercePositiveInt(resolved?.logEvery, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.logEvery)
	};
}
//#endregion
//#region extensions/feishu/src/monitor.state.ts
const wsClients = /* @__PURE__ */ new Map();
const httpServers = /* @__PURE__ */ new Map();
const botOpenIds = /* @__PURE__ */ new Map();
const botNames = /* @__PURE__ */ new Map();
const botIdentityRevisions = /* @__PURE__ */ new Map();
const FEISHU_WEBHOOK_MAX_BODY_BYTES = 65536;
const FEISHU_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const FEISHU_HTTP_SERVER_CLOSE_TIMEOUT_MS = 5e3;
const feishuWebhookRateLimitDefaults = resolveFeishuWebhookRateLimitDefaults(WEBHOOK_RATE_LIMIT_DEFAULTS);
const feishuWebhookAnomalyDefaults = resolveFeishuWebhookAnomalyDefaults(WEBHOOK_ANOMALY_COUNTER_DEFAULTS);
const feishuWebhookRateLimiter = createFixedWindowRateLimiter({
	windowMs: feishuWebhookRateLimitDefaults.windowMs,
	maxRequests: feishuWebhookRateLimitDefaults.maxRequests,
	maxTrackedKeys: feishuWebhookRateLimitDefaults.maxTrackedKeys
});
const feishuWebhookAnomalyTracker = createWebhookAnomalyTracker({
	maxTrackedKeys: feishuWebhookAnomalyDefaults.maxTrackedKeys,
	ttlMs: feishuWebhookAnomalyDefaults.ttlMs,
	logEvery: feishuWebhookAnomalyDefaults.logEvery
});
function readBotIdentityRevision(accountId) {
	return botIdentityRevisions.get(accountId) ?? 0;
}
function bumpBotIdentityRevision(accountId) {
	botIdentityRevisions.set(accountId, readBotIdentityRevision(accountId) + 1);
}
function captureBotIdentitySnapshot(accountId) {
	return { revision: readBotIdentityRevision(accountId) };
}
function clearFeishuBotIdentityStateIfUnchanged(accountId, snapshot) {
	if (readBotIdentityRevision(accountId) !== snapshot.revision) return;
	botOpenIds.delete(accountId);
	botNames.delete(accountId);
	bumpBotIdentityRevision(accountId);
}
function setFeishuBotIdentityState(accountId, identity) {
	botOpenIds.set(accountId, identity.botOpenId);
	if (identity.botName) botNames.set(accountId, identity.botName);
	else botNames.delete(accountId);
	bumpBotIdentityRevision(accountId);
}
function clearFeishuBotIdentityState(accountId) {
	botOpenIds.delete(accountId);
	botNames.delete(accountId);
	bumpBotIdentityRevision(accountId);
}
function isServerNotRunningError(error) {
	return error.code === "ERR_SERVER_NOT_RUNNING";
}
async function closeFeishuHttpServer(server) {
	await new Promise((resolve, reject) => {
		let settled = false;
		const settle = (err) => {
			if (settled) return;
			settled = true;
			clearTimeout(fallbackTimer);
			if (!err || isServerNotRunningError(err)) {
				resolve();
				return;
			}
			reject(err);
		};
		const fallbackTimer = setTimeout(() => {
			try {
				server.closeAllConnections();
				settle();
			} catch (err) {
				settle(err instanceof Error ? err : new Error(String(err)));
			}
		}, FEISHU_HTTP_SERVER_CLOSE_TIMEOUT_MS);
		try {
			server.close((err) => {
				settle(err);
			});
		} catch (err) {
			settle(err instanceof Error ? err : new Error(String(err)));
		}
	});
}
async function closeTrackedFeishuHttpServer(accountId, server) {
	const identitySnapshot = captureBotIdentitySnapshot(accountId);
	try {
		await closeFeishuHttpServer(server);
	} finally {
		if (httpServers.get(accountId) === server) {
			httpServers.delete(accountId);
			clearFeishuBotIdentityStateIfUnchanged(accountId, identitySnapshot);
		}
	}
}
function recordWebhookStatus(runtime, accountId, path, statusCode) {
	feishuWebhookAnomalyTracker.record({
		key: `${accountId}:${path}:${statusCode}`,
		statusCode,
		log: runtime?.log ?? console.log,
		message: (count) => `feishu[${accountId}]: webhook anomaly path=${path} status=${statusCode} count=${count}`
	});
}
//#endregion
//#region extensions/feishu/src/monitor.bot-identity.ts
const BOT_IDENTITY_RETRY_DELAYS_MS = [
	6e4,
	12e4,
	3e5,
	6e5,
	9e5
];
function applyBotIdentityState(accountId, identity) {
	const botOpenId = normalizeOptionalString(identity.botOpenId);
	const botName = normalizeOptionalString(identity.botName);
	setFeishuBotIdentityState(accountId, {
		botOpenId: botOpenId ?? "",
		botName
	});
	return {
		botOpenId,
		botName,
		source: botOpenId ? identity.source : void 0
	};
}
async function retryBotIdentityProbe(account, accountId, runtime, abortSignal) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const nextDelays = BOT_IDENTITY_RETRY_DELAYS_MS.slice(1)[Symbol.iterator]();
	for (const [i, delayMs] of BOT_IDENTITY_RETRY_DELAYS_MS.entries()) {
		if (abortSignal?.aborted) return;
		if (!await waitForAbortableDelay(delayMs, abortSignal)) return;
		const identity = await fetchBotIdentityForMonitor(account, {
			runtime,
			abortSignal,
			allowCachedFallback: false
		});
		if (normalizeOptionalString(identity.botOpenId) && identity.source === "provider") {
			log(`feishu[${accountId}]: bot open_id recovered via background retry: ${applyBotIdentityState(accountId, identity).botOpenId}`);
			return;
		}
		const nextDelayResult = nextDelays.next();
		const nextDelay = nextDelayResult.done ? void 0 : nextDelayResult.value;
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
//#endregion
//#region extensions/feishu/src/card-ux-launcher.ts
const FEISHU_QUICK_ACTION_CARD_TTL_MS = 6e5;
const QUICK_ACTION_MENU_KEYS = /* @__PURE__ */ new Set([
	"quick-actions",
	"quick_actions",
	"launcher"
]);
function isFeishuQuickActionMenuEventKey(eventKey) {
	return QUICK_ACTION_MENU_KEYS.has(normalizeOptionalLowercaseString(eventKey) ?? "");
}
function createQuickActionLauncherCard(params) {
	const context = buildFeishuCardInteractionContext(params);
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		header: {
			title: {
				tag: "plain_text",
				content: "Quick actions"
			},
			template: "indigo"
		},
		body: { elements: [{
			tag: "markdown",
			content: "Run common actions without typing raw commands."
		}, {
			tag: "action",
			actions: [
				buildFeishuCardButton({
					label: "Help",
					value: createFeishuCardInteractionEnvelope({
						k: "quick",
						a: "feishu.quick_actions.help",
						q: "/help",
						c: context
					})
				}),
				buildFeishuCardButton({
					label: "New session",
					type: "primary",
					value: createFeishuCardInteractionEnvelope({
						k: "meta",
						a: FEISHU_APPROVAL_REQUEST_ACTION,
						m: {
							command: "/new",
							prompt: "Start a fresh session? This will reset the current chat context."
						},
						c: context
					})
				}),
				buildFeishuCardButton({
					label: "Reset",
					type: "danger",
					value: createFeishuCardInteractionEnvelope({
						k: "meta",
						a: FEISHU_APPROVAL_REQUEST_ACTION,
						m: {
							command: "/reset",
							prompt: "Reset this session now? Any active conversation state will be cleared."
						},
						c: context
					})
				})
			]
		}] }
	};
}
async function maybeHandleFeishuQuickActionMenu(params) {
	if (!isFeishuQuickActionMenuEventKey(params.eventKey)) return false;
	const now = asDateTimestampMs(params.now ?? Date.now());
	const expiresAt = now === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(FEISHU_QUICK_ACTION_CARD_TTL_MS, { nowMs: now });
	if (expiresAt === void 0) {
		params.runtime?.log?.(`feishu[${params.accountId ?? "default"}]: failed to open quick-action launcher for ${params.operatorOpenId}: invalid expiry clock`);
		return false;
	}
	try {
		await sendCardFeishu({
			cfg: params.cfg,
			to: `user:${params.operatorOpenId}`,
			card: createQuickActionLauncherCard({
				operatorOpenId: params.operatorOpenId,
				expiresAt,
				chatType: "p2p"
			}),
			accountId: params.accountId
		});
	} catch (err) {
		params.runtime?.log?.(`feishu[${params.accountId ?? "default"}]: failed to open quick-action launcher for ${params.operatorOpenId}: ${String(err)}`);
		return false;
	}
	params.runtime?.log?.(`feishu[${params.accountId ?? "default"}]: opened quick-action launcher for ${params.operatorOpenId}`);
	return true;
}
//#endregion
//#region extensions/feishu/src/monitor.synthetic-error.ts
var FeishuRetryableSyntheticEventError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "FeishuRetryableSyntheticEventError";
	}
};
function isFeishuRetryableSyntheticEventError(error) {
	return error instanceof FeishuRetryableSyntheticEventError || typeof error === "object" && error !== null && "name" in error && error.name === "FeishuRetryableSyntheticEventError";
}
//#endregion
//#region extensions/feishu/src/monitor.bot-menu-handler.ts
function readStringOrNumber(value) {
	return typeof value === "string" || typeof value === "number" ? value : void 0;
}
function parseFeishuBotMenuEvent(value) {
	if (!isRecord(value)) return null;
	const operator = value.operator;
	if (operator !== void 0 && !isRecord(operator)) return null;
	return {
		event_key: readStringValue(value.event_key),
		timestamp: readStringOrNumber(value.timestamp),
		operator: operator ? {
			operator_name: readStringValue(operator.operator_name),
			operator_id: isRecord(operator.operator_id) ? {
				open_id: readStringValue(operator.operator_id.open_id),
				user_id: readStringValue(operator.operator_id.user_id),
				union_id: readStringValue(operator.operator_id.union_id)
			} : void 0
		} : void 0
	};
}
function createFeishuBotMenuHandler(params) {
	const { cfg, accountId, runtime, chatHistories, fireAndForget } = params;
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const getBotOpenId = params.getBotOpenId ?? ((id) => botOpenIds.get(id));
	const getBotName = params.getBotName ?? ((id) => botNames.get(id));
	const isActive = params.isAccountActive ?? (() => true);
	const handle = async (data) => {
		try {
			if (!isActive()) return;
			const event = parseFeishuBotMenuEvent(data);
			if (!event) return;
			const operatorOpenId = event.operator?.operator_id?.open_id?.trim();
			const eventKey = event.event_key?.trim();
			if (!operatorOpenId || !eventKey) return;
			const syntheticEvent = {
				sender: {
					sender_id: {
						open_id: operatorOpenId,
						user_id: event.operator?.operator_id?.user_id,
						union_id: event.operator?.operator_id?.union_id
					},
					sender_type: "user"
				},
				message: {
					message_id: `bot-menu:${eventKey}:${event.timestamp ?? Date.now()}`,
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
				log
			});
			if (!isActive()) {
				if (claim.kind === "claimed") claim.handle.release({ error: /* @__PURE__ */ new Error("feishu account stopped before menu dispatch") });
				return;
			}
			if (claim.kind === "duplicate") {
				log(`feishu[${accountId}]: dropping duplicate bot-menu event for ${syntheticMessageId}`);
				return;
			}
			if (claim.kind === "inflight") {
				log(`feishu[${accountId}]: dropping in-flight bot-menu event for ${syntheticMessageId}`);
				return;
			}
			const handleLegacyMenu = () => handleFeishuMessage({
				trackTask: params.trackTask,
				cfg,
				event: syntheticEvent,
				botOpenId: getBotOpenId(accountId),
				botName: getBotName(accountId),
				runtime,
				channelRuntime: params.channelRuntime,
				chatHistories,
				accountId,
				processingClaim: claim.kind === "claimed" ? claim.handle : void 0
			});
			const promise = maybeHandleFeishuQuickActionMenu({
				cfg,
				eventKey,
				operatorOpenId,
				runtime,
				accountId
			}).then(async (handledMenu) => {
				if (handledMenu) {
					if (claim.kind === "claimed") await claim.handle.commit();
					return;
				}
				if (!isActive()) {
					if (claim.kind === "claimed") claim.handle.release({ error: /* @__PURE__ */ new Error("feishu account stopped before menu dispatch") });
					return;
				}
				return await handleLegacyMenu();
			}).catch(async (err) => {
				if (isFeishuRetryableSyntheticEventError(err)) {
					await forgetProcessedFeishuMessage(syntheticMessageId, accountId, log);
					if (claim.kind === "claimed") claim.handle.release({ error: err });
				} else if (claim.kind === "claimed") await claim.handle.commit();
				throw err;
			});
			params.trackTask?.(promise);
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
	return (data) => {
		const task = handle(data);
		params.trackTask?.(task);
		return task;
	};
}
//#endregion
//#region extensions/feishu/src/comment-dispatcher.ts
function createFeishuCommentReplyDispatcher(params) {
	const core = getFeishuRuntime();
	const prefixContext = createReplyPrefixContext({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "feishu",
		accountId: params.accountId
	});
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const client = createFeishuClient(account);
	const textChunkLimit = core.channel.text.resolveTextChunkLimit(params.cfg, "feishu", params.accountId, { fallbackLimit: 4e3 });
	const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "feishu", params.accountId);
	const typingReaction = createCommentTypingReactionLifecycle({
		cfg: params.cfg,
		fileToken: params.fileToken,
		fileType: params.fileType,
		replyId: params.replyId,
		accountId: params.accountId,
		runtime: params.runtime
	});
	return {
		dispatcherOptions: {
			responsePrefix: prefixContext.responsePrefix,
			responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
			humanDelay: resolveHumanDelayConfig(params.cfg, params.agentId),
			onReplyStart: async () => {
				await typingReaction.start();
			},
			onCleanup: () => {
				typingReaction.cleanup();
			}
		},
		delivery: {
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
						file_token: params.fileToken,
						file_type: params.fileType,
						comment_id: params.commentId,
						content: chunk,
						is_whole_comment: params.isWholeComment
					});
					results.push({ messageId: result.delivery_mode === "reply_comment" ? result.reply_id : result.comment_id });
					acceptedChunks.push(chunk);
				} catch (error) {
					throw createFeishuPartialReplyDeliveryError(error, createFeishuReplyDeliveryResult({
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
				params.runtime.error?.(`feishu[${params.accountId ?? "default"}]: comment dispatcher failed kind=${info.kind} comment=${params.commentId}: ${String(err)}`);
			}
		},
		startTypingReaction: typingReaction.start,
		cleanupTypingReaction: typingReaction.cleanup
	};
}
//#endregion
//#region extensions/feishu/src/monitor.comment.ts
const FEISHU_COMMENT_VERIFY_TIMEOUT_MS = 3e3;
const FEISHU_COMMENT_LIST_PAGE_SIZE = 100;
const FEISHU_COMMENT_LIST_PAGE_LIMIT = 5;
const FEISHU_COMMENT_REPLY_PAGE_SIZE = 100;
const FEISHU_COMMENT_REPLY_PAGE_LIMIT = 5;
const FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS = 1e3;
const FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT = 6;
const FEISHU_COMMENT_THREAD_PROMPT_LIMIT = 20;
const FEISHU_WHOLE_COMMENT_PROMPT_LIMIT = 12;
const FEISHU_PROMPT_TEXT_LIMIT = 220;
function safeJsonStringify(value) {
	try {
		return JSON.stringify(value);
	} catch (error) {
		return JSON.stringify({ error: formatErrorMessage(error) });
	}
}
function truncatePromptText(text, maxLength = FEISHU_PROMPT_TEXT_LIMIT) {
	const normalized = normalizeOptionalString(text);
	if (!normalized) return "";
	return normalized.length > maxLength ? `${sliceUtf16Safe(normalized, 0, maxLength - 1)}…` : normalized;
}
function formatPromptTextValue(text) {
	return safeJsonStringify(truncatePromptText(text) || "");
}
function formatPromptBoolean(value) {
	return value === true ? "yes" : "no";
}
function buildDriveCommentsListUrl(params) {
	return `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments` + encodeQuery({
		file_type: params.fileType,
		is_whole: params.isWholeOnly === true ? "true" : void 0,
		page_size: String(FEISHU_COMMENT_LIST_PAGE_SIZE),
		page_token: params.pageToken,
		user_id_type: "open_id"
	});
}
function compareCommentTimelineEntries(left, right) {
	const leftTime = left.createTime ?? Number.MAX_SAFE_INTEGER;
	const rightTime = right.createTime ?? Number.MAX_SAFE_INTEGER;
	if (leftTime !== rightTime) return leftTime - rightTime;
	return (left.stableId ?? "").localeCompare(right.stableId ?? "");
}
function formatLinkedDocumentInline(link) {
	return [
		`raw_url=${link.rawUrl}`,
		`url_kind=${link.urlKind}`,
		link.wikiNodeToken ? `wiki_node_token=${link.wikiNodeToken}` : null,
		`resolved_type=${link.resolvedObjType ?? "UNKNOWN"}`,
		`resolved_token=${link.resolvedObjToken ?? "UNKNOWN"}`,
		`same_as_current_document=${formatPromptBoolean(link.isCurrentDocument)}`
	].filter((part) => Boolean(part)).join(" ");
}
function formatLinkedDocumentsPromptLines(params) {
	if (params.linkedDocuments.length === 0) return [];
	return [params.title, ...params.linkedDocuments.map((link, index) => `- [${index + 1}] ${formatLinkedDocumentInline(link)}`)];
}
function formatLinkedDocumentsInlineSummary(linkedDocuments) {
	if (linkedDocuments.length === 0) return "none";
	return linkedDocuments.map((link) => `${link.resolvedObjType ?? link.urlKind}:${link.resolvedObjToken ?? link.wikiNodeToken ?? "UNKNOWN"}`).join(",");
}
function summarizeCommentRepliesForLog(replies) {
	return safeJsonStringify(replies.map((reply) => ({
		reply_id: reply.reply_id,
		text_len: extractReplyText(reply)?.length ?? 0
	})));
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
function buildDriveCommentTargetUrl(params) {
	return `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments/batch_query` + encodeQuery({
		file_type: params.fileType,
		user_id_type: "open_id"
	});
}
function buildDriveCommentRepliesUrl(params) {
	return `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments/${encodeURIComponent(params.commentId)}/replies` + encodeQuery({
		file_type: params.fileType,
		page_token: params.pageToken,
		page_size: String(FEISHU_COMMENT_REPLY_PAGE_SIZE),
		user_id_type: "open_id"
	});
}
async function fetchDriveComments(params) {
	const comments = [];
	let pageToken;
	for (let page = 0; page < FEISHU_COMMENT_LIST_PAGE_LIMIT; page += 1) {
		const response = await requestFeishuOpenApi({
			client: params.client,
			method: "GET",
			url: buildDriveCommentsListUrl({
				fileToken: params.fileToken,
				fileType: params.fileType,
				isWholeOnly: params.isWholeOnly,
				pageToken
			}),
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			errorLabel: `feishu[${params.accountId}]: failed to list drive comments for ${params.fileToken}`
		});
		if (response?.code !== 0) {
			if (response) params.logger?.(`feishu[${params.accountId}]: failed to list drive comments for ${params.fileToken}: ${response.msg ?? "unknown error"} log_id=${response.log_id?.trim() || "unknown"}`);
			break;
		}
		comments.push(...response.data?.items ?? []);
		if (response.data?.has_more !== true || !response.data.page_token?.trim()) break;
		pageToken = response.data.page_token.trim();
	}
	return comments;
}
async function requestFeishuOpenApi(params) {
	const formatErrorDetails = (error) => {
		if (!isRecord(error)) return typeof error === "string" ? error : JSON.stringify(error);
		const response = isRecord(error.response) ? error.response : void 0;
		const responseData = isRecord(response?.data) ? response?.data : void 0;
		return safeJsonStringify({
			message: typeof error.message === "string" ? error.message : typeof error === "string" ? error : JSON.stringify(error),
			code: readStringValue(error.code),
			method: readStringValue(isRecord(error.config) ? error.config.method : void 0),
			url: readStringValue(isRecord(error.config) ? error.config.url : void 0),
			http_status: typeof response?.status === "number" ? response.status : void 0,
			feishu_code: typeof responseData?.code === "number" ? responseData.code : readStringValue(responseData?.code),
			feishu_msg: readStringValue(responseData?.msg),
			feishu_log_id: readStringValue(responseData?.log_id)
		});
	};
	const result = await raceWithTimeoutAndAbort(params.client.request({
		method: params.method,
		url: params.url,
		data: params.data ?? {},
		timeout: params.timeoutMs
	}), { timeoutMs: params.timeoutMs }).then((resolved) => resolved.status === "resolved" ? resolved.value : null).catch((error) => {
		params.logger?.(`${params.errorLabel}: ${formatErrorDetails(error)}`);
		return null;
	});
	if (!result) params.logger?.(`${params.errorLabel}: request timed out or returned no data`);
	return result;
}
async function fetchDriveCommentReplies(params) {
	const replies = [];
	const logIds = [];
	let pageToken;
	for (let page = 0; page < FEISHU_COMMENT_REPLY_PAGE_LIMIT; page += 1) {
		const response = await requestFeishuOpenApi({
			client: params.client,
			method: "GET",
			url: buildDriveCommentRepliesUrl({
				fileToken: params.fileToken,
				commentId: params.commentId,
				fileType: params.fileType,
				pageToken
			}),
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			errorLabel: `feishu[${params.accountId}]: failed to fetch comment replies for ${params.commentId}`
		});
		if (response?.log_id?.trim()) logIds.push(response.log_id.trim());
		if (response?.code !== 0) {
			if (response) params.logger?.(`feishu[${params.accountId}]: failed to fetch comment replies for ${params.commentId}: ${response.msg ?? "unknown error"} log_id=${response.log_id?.trim() || "unknown"}`);
			break;
		}
		replies.push(...response.data?.items ?? []);
		if (response.data?.has_more !== true || !response.data.page_token?.trim()) break;
		pageToken = response.data.page_token.trim();
	}
	return {
		replies,
		logIds
	};
}
async function resolveCommentReplyContext(params) {
	const userId = normalizeOptionalString(params.reply.user_id);
	const normalizedBotOpenIds = new Set(Array.from(params.botOpenIds ?? []).map((botId) => normalizeOptionalString(botId)).filter((botId) => Boolean(botId)));
	return {
		replyId: normalizeOptionalString(params.reply.reply_id),
		userId,
		createTime: typeof params.reply.create_time === "number" ? params.reply.create_time : void 0,
		isBotAuthored: typeof userId === "string" && normalizedBotOpenIds.has(userId),
		content: await resolveParsedCommentContent({
			elements: isRecord(params.reply.content) ? params.reply.content.elements : void 0,
			botOpenIds: params.botOpenIds,
			currentDocument: params.currentDocument,
			client: params.client,
			wikiCache: params.wikiCache,
			logger: params.logger,
			accountId: params.accountId
		})
	};
}
function selectCommentThreadPromptReplies(replies, targetReplyId) {
	if (replies.length <= FEISHU_COMMENT_THREAD_PROMPT_LIMIT) return replies;
	const targetIndex = replies.findIndex((reply) => reply.replyId === targetReplyId);
	const currentIndex = targetIndex >= 0 ? targetIndex : replies.length - 1;
	const selected = /* @__PURE__ */ new Set([
		0,
		currentIndex,
		replies.length - 1
	]);
	for (let radius = 1; selected.size < FEISHU_COMMENT_THREAD_PROMPT_LIMIT; radius += 1) {
		const before = currentIndex - radius;
		const after = currentIndex + radius;
		if (before >= 0) selected.add(before);
		if (selected.size >= FEISHU_COMMENT_THREAD_PROMPT_LIMIT) break;
		if (after < replies.length) selected.add(after);
		if (before < 0 && after >= replies.length) break;
	}
	return [...selected].toSorted((left, right) => left - right).map((index) => replies[index]).filter((reply) => Boolean(reply));
}
function formatCommentThreadPromptLines(params) {
	return selectCommentThreadPromptReplies(params.replies, params.targetReplyId).map((reply, index) => {
		const text = reply.content.semanticText ?? reply.content.plainText;
		return `- [${index + 1}] author=${reply.isBotAuthored ? "assistant" : "user"} user_id=${reply.userId ?? "UNKNOWN"} reply_id=${reply.replyId ?? "UNKNOWN"} current_event=${reply.replyId === params.targetReplyId ? "yes" : "no"} text=${formatPromptTextValue(text)} referenced_docs=${formatLinkedDocumentsInlineSummary(reply.content.linkedDocuments)}`;
	});
}
function findNearestBotTimelineEntry(params) {
	const step = params.direction === "after" ? 1 : -1;
	for (let index = params.currentIndex + step; index >= 0 && index < params.entries.length; index += step) {
		const candidate = params.entries[index];
		if (candidate?.isBotAuthored) return candidate;
	}
}
function selectWholeCommentTimelineEntries(params) {
	if (params.entries.length <= FEISHU_WHOLE_COMMENT_PROMPT_LIMIT) return params.entries;
	const currentIndex = params.entries.findIndex((entry) => entry.commentId === params.currentCommentId);
	if (currentIndex < 0) return params.entries.slice(-12);
	const selected = /* @__PURE__ */ new Set([currentIndex]);
	const nearestBotAfter = params.entries.findIndex((entry, index) => index > currentIndex && entry.isBotAuthored);
	if (nearestBotAfter >= 0) selected.add(nearestBotAfter);
	for (let index = currentIndex - 1; index >= 0; index -= 1) if (params.entries[index]?.isBotAuthored) {
		selected.add(index);
		break;
	}
	for (let radius = 1; selected.size < FEISHU_WHOLE_COMMENT_PROMPT_LIMIT; radius += 1) {
		const before = currentIndex - radius;
		const after = currentIndex + radius;
		if (before >= 0) selected.add(before);
		if (selected.size >= FEISHU_WHOLE_COMMENT_PROMPT_LIMIT) break;
		if (after < params.entries.length) selected.add(after);
		if (before < 0 && after >= params.entries.length) break;
	}
	return [...selected].toSorted((left, right) => left - right).map((index) => params.entries[index]).filter((entry) => Boolean(entry));
}
function formatWholeCommentTimelinePromptLines(params) {
	return selectWholeCommentTimelineEntries(params).map((entry, index) => {
		const text = entry.content.semanticText ?? entry.content.plainText;
		return `- [${index + 1}] create_time=${entry.createTime ?? "UNKNOWN"} comment_id=${entry.commentId} author=${entry.isBotAuthored ? "assistant" : "user"} user_id=${entry.userId ?? "UNKNOWN"} current_comment=${entry.commentId === params.currentCommentId ? "yes" : "no"} text=${formatPromptTextValue(text)} referenced_docs=${formatLinkedDocumentsInlineSummary(entry.content.linkedDocuments)}`;
	});
}
async function fetchDriveCommentContext(params) {
	const [metaResponse, commentResponse] = await Promise.all([requestFeishuOpenApi({
		client: params.client,
		method: "POST",
		url: "/open-apis/drive/v1/metas/batch_query",
		data: {
			request_docs: [{
				doc_token: params.fileToken,
				doc_type: params.fileType
			}],
			with_url: true
		},
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		errorLabel: `feishu[${params.accountId}]: failed to fetch drive metadata for ${params.fileToken}`
	}), requestFeishuOpenApi({
		client: params.client,
		method: "POST",
		url: buildDriveCommentTargetUrl({
			fileToken: params.fileToken,
			fileType: params.fileType
		}),
		data: { comment_ids: [params.commentId] },
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		errorLabel: `feishu[${params.accountId}]: failed to fetch drive comment ${params.commentId}`
	})]);
	const wikiCache = /* @__PURE__ */ new Map();
	const commentCard = commentResponse?.code === 0 ? (commentResponse.data?.items ?? []).find((item) => item.comment_id?.trim() === params.commentId) : void 0;
	const embeddedReplies = commentCard?.reply_list?.replies ?? [];
	params.logger?.(`feishu[${params.accountId}]: embedded comment replies comment=${params.commentId} count=${embeddedReplies.length} summary=${summarizeCommentRepliesForLog(embeddedReplies)}`);
	const embeddedTargetReply = params.replyId ? embeddedReplies.find((reply) => reply.reply_id?.trim() === params.replyId?.trim()) : embeddedReplies.at(-1);
	let replies = embeddedReplies;
	let fetchedMatchedReply = params.replyId ? replies.find((reply) => reply.reply_id?.trim() === params.replyId?.trim()) : void 0;
	if (!embeddedTargetReply || replies.length === 0 || commentCard?.has_more === true) {
		params.logger?.(`feishu[${params.accountId}]: fetching extra comment replies comment=${params.commentId} requested_reply=${params.replyId ?? "none"} embedded_count=${embeddedReplies.length} embedded_hit=${embeddedTargetReply ? "yes" : "no"} embedded_has_more=${commentCard?.has_more === true ? "yes" : "no"}`);
		const fetched = await fetchDriveCommentReplies(params);
		if (fetched.replies.length > 0) {
			params.logger?.(`feishu[${params.accountId}]: fetched extra comment replies comment=${params.commentId} count=${fetched.replies.length} log_ids=${safeJsonStringify(fetched.logIds)} summary=${summarizeCommentRepliesForLog(fetched.replies)}`);
			replies = fetched.replies;
			fetchedMatchedReply = params.replyId ? replies.find((reply) => reply.reply_id?.trim() === params.replyId?.trim()) : void 0;
		}
		if (params.replyId && !embeddedTargetReply && !fetchedMatchedReply) for (let attempt = 1; attempt <= FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT; attempt += 1) {
			if (params.abortSignal?.aborted) break;
			params.logger?.(`feishu[${params.accountId}]: retrying comment reply lookup comment=${params.commentId} requested_reply=${params.replyId} attempt=${attempt}/${FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT} delay_ms=${FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS}`);
			if (!await waitForAbortableDelay(FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS, params.abortSignal)) break;
			const retried = await fetchDriveCommentReplies(params);
			if (retried.replies.length > 0) {
				params.logger?.(`feishu[${params.accountId}]: fetched retried comment replies comment=${params.commentId} attempt=${attempt} count=${retried.replies.length} log_ids=${safeJsonStringify(retried.logIds)} summary=${summarizeCommentRepliesForLog(retried.replies)}`);
				replies = retried.replies;
			}
			fetchedMatchedReply = replies.find((reply) => reply.reply_id?.trim() === params.replyId);
			if (fetchedMatchedReply) break;
		}
	}
	const rootReply = replies[0] ?? embeddedReplies[0];
	const targetReply = params.replyId ? embeddedTargetReply ?? fetchedMatchedReply ?? void 0 : replies.at(-1) ?? embeddedTargetReply ?? rootReply;
	const matchSource = params.replyId ? embeddedTargetReply ? "embedded" : fetchedMatchedReply ? "fetched" : "miss" : targetReply === rootReply ? "fallback_root" : targetReply === embeddedTargetReply ? "embedded_latest" : "fetched_latest";
	params.logger?.(`feishu[${params.accountId}]: comment reply resolution comment=${params.commentId} requested_reply=${params.replyId ?? "none"} match_source=${matchSource} root=${safeJsonStringify({
		reply_id: rootReply?.reply_id,
		text_len: extractReplyText(rootReply)?.length ?? 0
	})} target=${safeJsonStringify({
		reply_id: targetReply?.reply_id,
		text_len: extractReplyText(targetReply)?.length ?? 0
	})}`);
	const meta = metaResponse?.code === 0 ? metaResponse.data?.metas?.[0] : void 0;
	const currentDocument = {
		fileType: params.fileType,
		fileToken: params.fileToken
	};
	const resolvedReplies = await Promise.all(replies.map((reply) => resolveCommentReplyContext({
		reply,
		botOpenIds: params.botOpenIds,
		currentDocument,
		client: params.client,
		wikiCache,
		logger: params.logger,
		accountId: params.accountId
	})));
	resolvedReplies.sort((left, right) => compareCommentTimelineEntries({
		createTime: left.createTime,
		stableId: left.replyId
	}, {
		createTime: right.createTime,
		stableId: right.replyId
	}));
	const rootReplyContext = resolvedReplies.find((reply) => reply.replyId === normalizeOptionalString(rootReply?.reply_id)) ?? resolvedReplies[0];
	const targetReplyContext = resolvedReplies.find((reply) => reply.replyId === normalizeOptionalString(targetReply?.reply_id)) ?? (params.replyId ? void 0 : resolvedReplies.at(-1) ?? rootReplyContext);
	let wholeCommentTimeline = [];
	if (commentCard?.is_whole === true) {
		const wholeComments = (await fetchDriveComments({
			client: params.client,
			fileToken: params.fileToken,
			fileType: params.fileType,
			isWholeOnly: true,
			timeoutMs: params.timeoutMs,
			logger: params.logger,
			accountId: params.accountId
		})).filter((comment) => comment.is_whole === true);
		wholeCommentTimeline = await Promise.all(wholeComments.map(async (comment) => {
			const rootWholeReply = comment.reply_list?.replies?.[0];
			const normalizedBotOpenIds = new Set(Array.from(params.botOpenIds ?? []).map((botId) => normalizeOptionalString(botId)).filter((botId) => Boolean(botId)));
			const content = await resolveParsedCommentContent({
				elements: isRecord(rootWholeReply?.content) ? rootWholeReply.content.elements : void 0,
				botOpenIds: params.botOpenIds,
				currentDocument,
				client: params.client,
				wikiCache,
				logger: params.logger,
				accountId: params.accountId
			});
			const commentUserId = normalizeOptionalString(rootWholeReply?.user_id) || normalizeOptionalString(comment.user_id);
			return {
				commentId: normalizeOptionalString(comment.comment_id) ?? "",
				userId: commentUserId,
				createTime: typeof comment.create_time === "number" ? comment.create_time : typeof rootWholeReply?.create_time === "number" ? rootWholeReply.create_time : void 0,
				isCurrentComment: normalizeOptionalString(comment.comment_id) === params.commentId,
				isBotAuthored: typeof commentUserId === "string" && normalizedBotOpenIds.has(commentUserId),
				content
			};
		}));
		wholeCommentTimeline = wholeCommentTimeline.filter((entry) => Boolean(entry.commentId)).toSorted((left, right) => compareCommentTimelineEntries({
			createTime: left.createTime,
			stableId: left.commentId
		}, {
			createTime: right.createTime,
			stableId: right.commentId
		}));
	}
	const currentWholeCommentIndex = wholeCommentTimeline.findIndex((entry) => entry.commentId === params.commentId);
	return {
		documentTitle: normalizeOptionalString(meta?.title),
		documentUrl: normalizeOptionalString(meta?.url),
		isWholeComment: commentCard?.is_whole,
		quoteText: normalizeOptionalString(commentCard?.quote),
		rootCommentText: rootReplyContext?.content.semanticText ?? rootReplyContext?.content.plainText,
		targetReplyText: targetReplyContext?.content.semanticText ?? targetReplyContext?.content.plainText,
		rootCommentContent: rootReplyContext?.content,
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
}
function buildDriveCommentSurfacePrompt(params) {
	const documentLabel = params.documentTitle ? `"${params.documentTitle}"` : `${params.fileType} document ${params.fileToken}`;
	const lines = [`The user added a ${params.noticeType === "add_reply" ? "reply" : "comment"} in ${documentLabel}.`];
	if (params.targetReplyText) lines.push(`Current user comment text: ${formatPromptTextValue(params.targetReplyText)}`);
	if (params.noticeType === "add_reply" && params.rootCommentText && params.rootCommentText !== params.targetReplyText) lines.push(`Original comment text: ${formatPromptTextValue(params.rootCommentText)}`);
	if (params.quoteText) lines.push(`Quoted content: ${formatPromptTextValue(params.quoteText)}`);
	if (params.isMentioned === true) lines.push("This comment mentioned you.");
	if (params.documentUrl) lines.push(`Document link: ${params.documentUrl}`);
	lines.push("Current commented document:", `- file_type=${params.fileType}`, `- file_token=${params.fileToken}`);
	if (params.documentTitle) lines.push(`- title=${params.documentTitle}`);
	if (params.documentUrl) lines.push(`- url=${params.documentUrl}`);
	lines.push(`Event type: ${params.noticeType}`, `file_token: ${params.fileToken}`, `file_type: ${params.fileType}`, `comment_id: ${params.commentId}`);
	if (params.isWholeComment === true) lines.push("This is a whole-document comment.");
	if (params.replyId?.trim()) lines.push(`reply_id: ${params.replyId.trim()}`);
	if (params.targetReplyContent?.semanticText) lines.push(`Current user comment semantic text: ${formatPromptTextValue(params.targetReplyContent.semanticText)}`);
	if (params.targetReplyContent?.botMentioned) lines.push("Bot routing mention detected in the current user comment. Treat that mention as routing only, not task content.");
	const nonBotMentions = (params.targetReplyContent?.mentions ?? []).filter((mention) => !mention.isBotMention).map((mention) => mention.displayText);
	if (nonBotMentions.length > 0) lines.push(`Other mentioned users in current comment: ${nonBotMentions.join(", ")}`);
	lines.push(...formatLinkedDocumentsPromptLines({
		title: "Referenced documents from current user comment:",
		linkedDocuments: params.targetReplyContent?.linkedDocuments ?? []
	}));
	if (!params.isWholeComment && params.currentCommentThreadReplies.length > 0) lines.push("Current comment card timeline (primary context for follow-ups on this comment card):", ...formatCommentThreadPromptLines({
		replies: params.currentCommentThreadReplies,
		targetReplyId: params.replyId
	}), "For this non-whole comment, use the current comment card timeline above as the primary source for phrases like 'above', 'previous result', 'that summary', or 'insert it'.", "Document-level session history is auxiliary background only. Do not use another comment card's recent output as the primary referent.");
	if (params.isWholeComment && params.wholeCommentTimeline.length > 0) {
		lines.push("Whole-document comment timeline (primary context for whole-comment follow-ups):", ...formatWholeCommentTimelinePromptLines({
			entries: params.wholeCommentTimeline,
			currentCommentId: params.commentId
		}));
		if (params.nearestBotWholeCommentAfter) lines.push(`Nearest bot-authored whole-comment after the current comment: comment_id=${params.nearestBotWholeCommentAfter.commentId} text=${formatPromptTextValue(params.nearestBotWholeCommentAfter.content.semanticText ?? params.nearestBotWholeCommentAfter.content.plainText)}`);
		if (params.nearestBotWholeCommentBefore) lines.push(`Nearest bot-authored whole-comment before the current comment: comment_id=${params.nearestBotWholeCommentBefore.commentId} text=${formatPromptTextValue(params.nearestBotWholeCommentBefore.content.semanticText ?? params.nearestBotWholeCommentBefore.content.plainText)}`);
		lines.push("For this whole-document comment, use the whole-comment timeline above as the primary source for phrases like 'just now', 'previous result', 'that summary', or 'write it back'.", "Document-level session history is auxiliary background only. Do not resolve whole-comment follow-ups by blindly using the most recent document-session output.");
	}
	lines.push("This is a Feishu document comment thread.", "It is not a Feishu IM chat.", "Your final text reply will be posted to the current comment thread automatically.", "Use the thread timeline above as the main context for follow-up requests.", "Do not use another comment card or document-session output as the main reference.", "If you need comment thread context, use the available Feishu drive comment-list actions.", "If you modify the document, post a user-visible follow-up in the comment thread.", "Use an available Feishu drive reply-comment or add-comment action for that follow-up.", "Whole-document comments do not support direct replies.", "For whole-document comments, use the Feishu drive add-comment action when available.", "Only treat URLs listed under \"Referenced documents from current user comment\" as structured Feishu document references.", "URLs that appear only in comment text are plain links unless you verify them.", "If the user asks about a linked Feishu document or wiki page, treat that linked document as the read target.", "If the user asks you to use a linked document as guidance, treat the linked document as the reference source and the current commented document as the edit target.", "If a referenced document resolves to the same file_token and file_type as the current commented document, treat it as the current document.", "If the user asks you to modify document content, you must use an available Feishu document tool to make the change.", "Do not reply with only \"done\", \"I'll handle it\", or a restated plan without calling tools.", "If the comment quotes document content, treat the quoted content as the main anchor.", "For requests like \"insert xxx below this content\", locate the quoted content first, then edit the document.", "For requests like \"summarize the content below\", \"explain this section\", or \"continue writing from here\", use the quoted content as the main target.", "If the quote is not enough, use available Feishu document read or list-blocks actions to read nearby context.", "Do not guess document content from the comment alone.", "Do not give a vague answer before reading enough context.", "Unless the user asks for the whole document, handle only the local content around the quoted anchor.", "If document edits are involved, read the anchor first, then edit.", "If the edit fails or the anchor cannot be found, say so clearly.", "If this is a reading task, such as summarization, explanation, or extraction, you may output the final answer directly after confirming the context.", "Use the same language as the user's comment or reply, unless the user asks for another language.", "Use plain text only.", "Do not use Markdown.", "Do not use headings.", "Do not use bullet lists.", "Do not use numbered lists.", "Do not use tables.", "Do not use blockquotes.", "Do not use code blocks.", "Do not show reasoning.", "Do not show analysis.", "Do not show chain-of-thought.", "Do not show scratch work.", "Do not describe your plan.", "Do not describe your steps.", "Do not describe tool use.", "Do not start with phrases like \"I will\", \"I’ll first\", \"I need to\", \"The user wants\", or \"I have updated\".", "Output only the final user-facing reply.", "If you already sent the user-visible reply with a Feishu drive comment action, output exactly NO_REPLY.", "If no user-visible reply is needed, output exactly NO_REPLY.", "Be concise.", "Do not omit requested content.");
	lines.push("Choose one outcome: output the final plain-text reply, edit the document and then post a user-visible follow-up in the comment thread, or output exactly NO_REPLY.");
	return lines.join("\n");
}
async function resolveDriveCommentEventCore(params) {
	const { cfg, accountId, event, account, botOpenId, createClient, verificationTimeoutMs = FEISHU_COMMENT_VERIFY_TIMEOUT_MS, logger, abortSignal } = params;
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
	const context = await fetchDriveCommentContext({
		client: createClient ? createClient(account ?? { accountId }) : createFeishuClient((await import("./accounts-DmU0xYPx.mjs").then((n) => n.t)).resolveFeishuAccount({
			cfg,
			accountId
		})),
		fileToken,
		fileType,
		commentId,
		replyId,
		botOpenIds: [effectiveBotOpenId, event.notice_meta?.to_user_id?.open_id],
		timeoutMs: verificationTimeoutMs,
		logger,
		accountId,
		abortSignal
	});
	return {
		eventId,
		commentId,
		replyId,
		noticeType,
		fileToken,
		fileType,
		isWholeComment: context.isWholeComment,
		senderId,
		senderUserId,
		timestamp: event.timestamp,
		isMentioned: event.is_mentioned,
		context
	};
}
function parseFeishuDriveCommentNoticeEventPayload(value) {
	if (!isRecord(value) || !isRecord(value.notice_meta)) return null;
	const noticeMeta = value.notice_meta;
	const fromUserId = isRecord(noticeMeta.from_user_id) ? noticeMeta.from_user_id : void 0;
	const toUserId = isRecord(noticeMeta.to_user_id) ? noticeMeta.to_user_id : void 0;
	return {
		comment_id: readStringValue(value.comment_id),
		event_id: readStringValue(value.event_id),
		is_mentioned: asBoolean(value.is_mentioned),
		notice_meta: {
			file_token: readStringValue(noticeMeta.file_token),
			file_type: readStringValue(noticeMeta.file_type),
			from_user_id: fromUserId ? {
				open_id: readStringValue(fromUserId.open_id),
				user_id: readStringValue(fromUserId.user_id),
				union_id: readStringValue(fromUserId.union_id)
			} : void 0,
			notice_type: readStringValue(noticeMeta.notice_type),
			to_user_id: toUserId ? {
				open_id: readStringValue(toUserId.open_id),
				user_id: readStringValue(toUserId.user_id),
				union_id: readStringValue(toUserId.union_id)
			} : void 0
		},
		reply_id: readStringValue(value.reply_id),
		timestamp: readStringValue(value.timestamp),
		type: readStringValue(value.type)
	};
}
async function resolveDriveCommentEventTurn(params) {
	const resolved = await resolveDriveCommentEventCore(params);
	if (!resolved) return null;
	const prompt = buildDriveCommentSurfacePrompt({
		noticeType: resolved.noticeType,
		fileType: resolved.fileType,
		fileToken: resolved.fileToken,
		commentId: resolved.commentId,
		replyId: resolved.replyId,
		isWholeComment: resolved.isWholeComment,
		isMentioned: resolved.isMentioned,
		documentTitle: resolved.context.documentTitle,
		documentUrl: resolved.context.documentUrl,
		quoteText: resolved.context.quoteText,
		rootCommentText: resolved.context.rootCommentText,
		targetReplyText: resolved.context.targetReplyText,
		rootCommentContent: resolved.context.rootCommentContent,
		targetReplyContent: resolved.context.targetReplyContent,
		currentCommentThreadReplies: resolved.context.currentCommentThreadReplies,
		wholeCommentTimeline: resolved.context.wholeCommentTimeline,
		nearestBotWholeCommentAfter: resolved.context.nearestBotWholeCommentAfter,
		nearestBotWholeCommentBefore: resolved.context.nearestBotWholeCommentBefore
	});
	const preview = truncateUtf16Safe(prompt.replace(/\s+/g, " "), 160);
	return {
		eventId: resolved.eventId,
		messageId: `drive-comment:${resolved.eventId}`,
		commentId: resolved.commentId,
		replyId: resolved.replyId,
		noticeType: resolved.noticeType,
		fileToken: resolved.fileToken,
		fileType: resolved.fileType,
		isWholeComment: resolved.isWholeComment,
		senderId: resolved.senderId,
		senderUserId: resolved.senderUserId,
		timestamp: resolved.timestamp,
		isMentioned: resolved.isMentioned,
		documentTitle: resolved.context.documentTitle,
		documentUrl: resolved.context.documentUrl,
		quoteText: resolved.context.quoteText,
		rootCommentText: resolved.context.rootCommentText,
		targetReplyText: resolved.context.targetReplyText,
		prompt,
		preview
	};
}
//#endregion
//#region extensions/feishu/src/comment-handler.ts
function buildCommentSessionKey(params) {
	return params.core.channel.routing.buildAgentSessionKey({
		agentId: params.route.agentId,
		channel: "feishu",
		accountId: params.route.accountId,
		peer: {
			kind: "direct",
			id: `comment-doc:${params.fileType}:${params.fileToken}`
		},
		dmScope: "per-account-channel-peer"
	});
}
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
		const candidateDmPolicy = candidateAccount.config.dmPolicy ?? "pairing";
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
				onCreated: ({ code }) => {
					log(`feishu[${account.accountId}]: comment pairing request sender=${turn.senderId} code=${code}`);
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
	let route = core.channel.routing.resolveAgentRoute({
		cfg: effectiveCfg,
		channel: "feishu",
		accountId: account.accountId,
		peer: {
			kind: "direct",
			id: turn.senderId
		}
	});
	if (route.matchedBy === "default") {
		const dynamicResult = await maybeCreateDynamicAgent({
			cfg: effectiveCfg,
			runtime: core,
			accountId: account.accountId,
			senderOpenId: turn.senderId,
			canCreateForConfig: async (candidateCfg) => {
				return (await resolveCommentAuthorization(candidateCfg, false)).ingress.ingress.admission === "dispatch";
			},
			log: (message) => log(message)
		});
		if (dynamicResult.created || dynamicResult.updatedCfg !== effectiveCfg) {
			const refreshedAuthorization = await resolveCommentAuthorization(dynamicResult.updatedCfg, false);
			if (refreshedAuthorization.ingress.ingress.admission !== "dispatch") {
				log(`feishu[${account.accountId}]: current policy rejected stale comment sender ${turn.senderId} before adopting refreshed dynamic route (dmPolicy=${refreshedAuthorization.dmPolicy}, comment=${turn.commentId})`);
				return;
			}
			effectiveCfg = dynamicResult.updatedCfg;
			route = core.channel.routing.resolveAgentRoute({
				cfg: dynamicResult.updatedCfg,
				channel: "feishu",
				accountId: account.accountId,
				peer: {
					kind: "direct",
					id: turn.senderId
				}
			});
			if (dynamicResult.created) log(`feishu[${account.accountId}]: dynamic agent created for comment flow, route=${route.sessionKey}`);
		}
	}
	const commentSessionKey = buildCommentSessionKey({
		core,
		route,
		fileType: turn.fileType,
		fileToken: turn.fileToken
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
	const { dispatcherOptions, delivery, cleanupTypingReaction } = createFeishuCommentReplyDispatcher({
		cfg: effectiveCfg,
		agentId: route.agentId,
		runtime,
		accountId: account.accountId,
		fileToken: turn.fileToken,
		fileType: turn.fileType,
		commentId: turn.commentId,
		replyId: turn.replyId,
		isWholeComment: turn.isWholeComment
	});
	try {
		log(`feishu[${account.accountId}]: dispatching drive comment to agent (session=${commentSessionKey} comment=${turn.commentId} type=${turn.noticeType})`);
		const turnResult = await core.channel.inbound.run({
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
		const dispatchResult = turnResult.dispatched ? turnResult.dispatchResult : void 0;
		const counts = resolveInboundReplyDispatchCounts(dispatchResult);
		log(`feishu[${account.accountId}]: drive comment dispatch complete (replies=${counts.final}, session=${commentSessionKey})`);
	} finally {
		cleanupTypingReaction();
	}
}
//#endregion
//#region extensions/feishu/src/sequential-queue.ts
/**
* Per-key serial task queue for Feishu inbound message handling.
*
* Tasks enqueued under the same key run in FIFO order. Different keys run
* concurrently. This preserves the channel's same-chat ordering contract
* (see #64324) while letting cross-chat work proceed in parallel.
*
* `taskTimeoutMs` bounds how long the queue will block subsequent same-key
* tasks behind a single in-flight task. After the cap, the in-flight task
* is evicted from the blocking chain so newer messages for the same key
* can proceed. The original task is NOT aborted — it continues running in
* the background; it just stops starving the queue.
*
* Without this cap, a single hung dispatch (e.g. an agent call that never
* resolves) keeps later same-chat messages in `queued` state until the
* gateway is restarted. See #70133.
*/
const DEFAULT_TASK_TIMEOUT_MS = 3e5;
function createSequentialQueue(options = {}) {
	const queues = /* @__PURE__ */ new Map();
	const taskTimeoutMs = options.taskTimeoutMs ?? DEFAULT_TASK_TIMEOUT_MS;
	const onTaskTimeout = options.onTaskTimeout;
	return (key, task) => {
		const previous = queues.get(key) ?? Promise.resolve();
		const wrapped = () => boundedRun(key, task, taskTimeoutMs, onTaskTimeout);
		const next = previous.then(wrapped, wrapped);
		queues.set(key, next);
		const cleanup = () => {
			if (queues.get(key) === next) queues.delete(key);
		};
		next.then(cleanup, cleanup);
		return next;
	};
}
async function boundedRun(key, task, timeoutMs, onTaskTimeout) {
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return task();
	const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_TASK_TIMEOUT_MS);
	let timeoutHandle;
	const timeoutPromise = new Promise((resolve) => {
		timeoutHandle = setTimeout(() => {
			try {
				onTaskTimeout?.(key, resolvedTimeoutMs);
			} catch {}
			resolve();
		}, resolvedTimeoutMs);
	});
	try {
		await Promise.race([task(), timeoutPromise]);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
//#endregion
//#region extensions/feishu/src/monitor.comment-notice-handler.ts
function buildCommentNoticeQueueKey(event) {
	return `comment-doc:${event.notice_meta?.file_type?.trim() || "unknown"}:${event.notice_meta?.file_token?.trim() || "unknown"}`;
}
function createFeishuDriveCommentNoticeHandler(params) {
	const { cfg, accountId, runtime, fireAndForget, abortSignal } = params;
	const log = runtime?.log ?? console.log;
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
		log(`feishu[${accountId}]: received drive comment notice event=${event.event_id ?? "unknown"} type=${event.notice_meta?.notice_type ?? "unknown"} file=${event.notice_meta?.file_type ?? "unknown"}:${event.notice_meta?.file_token ?? "unknown"} comment=${event.comment_id ?? "unknown"} reply=${event.reply_id ?? "none"} from=${event.notice_meta?.from_user_id?.open_id ?? "unknown"} mentioned=${event.is_mentioned === true ? "yes" : "no"}`);
		await enqueue(buildCommentNoticeQueueKey(event), async () => {
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
			await runFeishuHandler(async () => await handleNotice(data));
			return;
		}
		const { lifecycle, settle } = buildFeishuFlushIngressLifecycle([{ lifecycle: ingressLifecycle }]);
		await handleNotice(data, lifecycle);
		await settle();
	};
}
//#endregion
//#region extensions/feishu/src/monitor.message-handler.ts
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
function dedupeFeishuDebounceEntriesByDedupeKey(entries) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const entry of entries) {
		const dedupeKey = entry.messageDedupeKey;
		if (!dedupeKey) {
			deduped.push(entry);
			continue;
		}
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);
		deduped.push(entry);
	}
	return deduped;
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
function createFeishuMessageReceiveHandler({ cfg, channelRuntime, accountId, runtime, chatHistories, fireAndForget, isAccountActive = () => true, trackTask, handleMessage, resolveDebounceText: resolveText, hasProcessedMessage, getBotOpenId = () => void 0, getBotName = () => void 0, resolveSequentialKey = ({ accountId: accountIdLocal, event }) => `feishu:${accountIdLocal}:${event.message.chat_id?.trim() || "unknown"}`, statusSink, resolveIngressLifecycle }) {
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
	const dispatchFeishuMessage = async (event, messageDedupeKey, processingClaim, turnAdoptionLifecycle, preparedContent) => {
		const sequentialKey = resolveSequentialKey({
			accountId,
			event,
			preparedContent,
			botOpenId: getBotOpenId(accountId),
			botName: getBotName(accountId)
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
				botName: getBotName(accountId),
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
	const resolveSenderDebounceId = (event) => {
		return event.sender.sender_id.open_id?.trim() || event.sender.sender_id.user_id?.trim() || void 0;
	};
	const resolveDebounceText = (event) => {
		return resolveText({
			event,
			botOpenId: getBotOpenId(accountId),
			botName: getBotName(accountId)
		}).trim();
	};
	const recordSuppressedMessageIds = async (entries, dispatchDedupeKey) => {
		const keepDedupeKey = dispatchDedupeKey?.trim();
		const suppressedIds = new Set(entries.map((entry) => ({
			id: entry.messageDedupeKey,
			claim: entry.processingClaim
		})).filter(({ id }) => Boolean(id) && (!keepDedupeKey || id !== keepDedupeKey)));
		for (const suppressed of suppressedIds) try {
			await suppressed.claim?.commit();
		} catch (err) {
			error(`feishu[${accountId}]: failed to record merged dedupe id ${suppressed.id}: ${String(err)}`);
		}
	};
	const inboundDebouncer = channelRuntime.debounce.createInboundDebouncer({
		debounceMs: resolveDebounceMs(),
		resolveDebounceMs,
		buildKey: ({ event }) => {
			const chatId = event.message.chat_id?.trim();
			const senderId = resolveSenderDebounceId(event);
			if (!chatId || !senderId) return null;
			const threadId = event.message.root_id?.trim() || event.message.thread_id?.trim();
			return `feishu:${accountId}:${chatId}:${threadId ? `thread:${threadId}` : "chat"}:${senderId}`;
		},
		shouldDebounce: ({ event }) => {
			if (event.message.message_type !== "text") return false;
			const text = resolveDebounceText(event);
			return Boolean(text) && !channelRuntime.commands.isControlCommandMessage(text, cfg);
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
							await dispatchFeishuMessage(last.event, last.messageDedupeKey, last.processingClaim, admissionLifecycle);
							await settle();
							return;
						}
						const dedupedEntries = dedupeFeishuDebounceEntriesByDedupeKey(activeEntries);
						const freshEntries = [];
						for (const entry of dedupedEntries) if (!await hasProcessedMessage(entry.messageDedupeKey, accountId, log)) freshEntries.push(entry);
						const dispatchEntry = freshEntries.at(-1);
						if (!dispatchEntry) {
							await settle();
							return;
						}
						const dispatchDedupeKey = dispatchEntry.messageDedupeKey;
						if (!lifecycle) await recordSuppressedMessageIds(dedupedEntries, dispatchDedupeKey);
						const combinedText = freshEntries.map((entry) => resolveDebounceText(entry.event)).filter(Boolean).join("\n");
						const mergedMentions = resolveFeishuDebounceMentions({
							entries: freshEntries.map((entry) => entry.event),
							botOpenId: getBotOpenId(accountId)
						});
						await dispatchFeishuMessage({
							...dispatchEntry.event,
							message: {
								...dispatchEntry.event.message,
								mentions: mergedMentions ?? dispatchEntry.event.message.mentions
							}
						}, dispatchDedupeKey, dispatchEntry.processingClaim, admissionLifecycle, combinedText);
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
			log(`feishu[${accountId}]: dropping self-authored message ${messageId ?? "unknown"}`);
			await completeSuppressedIngress();
			return;
		}
		const messageDedupeKey = resolveFeishuMessageDedupeKey(event);
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
			log(`feishu[${accountId}]: dropping ${claim.kind} event for message ${messageId}`);
			await completeSuppressedIngress();
			return;
		}
		const debounceEntry = {
			event,
			messageDedupeKey,
			...claim.kind === "claimed" ? { processingClaim: claim.handle } : {},
			...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {}
		};
		if (claim.kind === "claimed" && turnAdoptionLifecycle) turnAdoptionLifecycle.registerAbandonHandler?.(() => {
			debounceEntry.abandoned = true;
			claim.handle.release({ error: /* @__PURE__ */ new Error("feishu-ingress-abandoned-before-flush") });
		});
		const processMessage = async () => {
			await inboundDebouncer.enqueue(debounceEntry);
		};
		if (turnAdoptionLifecycle) try {
			await processMessage();
			return { kind: "deferred" };
		} catch (err) {
			if (claim.kind === "claimed") claim.handle.release({ error: err });
			return {
				kind: "failed-retryable",
				error: err
			};
		}
		if (fireAndForget) {
			processMessage().catch((err) => {
				if (claim.kind === "claimed") claim.handle.release({ error: err });
				error(`feishu[${accountId}]: error handling message: ${String(err)}`);
			});
			return;
		}
		try {
			await processMessage();
		} catch (err) {
			if (claim.kind === "claimed") claim.handle.release({ error: err });
			error(`feishu[${accountId}]: error handling message: ${String(err)}`);
		}
	};
}
//#endregion
//#region extensions/feishu/src/monitor-rate-limit-key.ts
function normalizeFeishuWebhookRateLimitClient(clientIp) {
	if (!clientIp) return "unknown";
	if (clientIp === "::1" || clientIp.startsWith("127.")) return "loopback";
	return clientIp;
}
function buildFeishuWebhookRateLimitKey(params) {
	return `${params.accountId}:${params.path}:${normalizeFeishuWebhookRateLimitClient(params.clientIp)}`;
}
//#endregion
//#region extensions/feishu/src/monitor.transport.ts
const FEISHU_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const FEISHU_WEBHOOK_ACCEPTED_VALUE = "durable";
const FEISHU_PRE_AUTH_MAX_IN_FLIGHT = 64;
const FEISHU_WEBHOOK_TIMESTAMP_MAX_SKEW_MS = 36e5;
const FEISHU_WS_RECONNECT_INITIAL_DELAY_MS = 1e3;
const FEISHU_WS_RECONNECT_MAX_DELAY_MS = 3e4;
const FEISHU_WS_LOG_ERROR_MAX_LENGTH = 500;
const FEISHU_WS_RECONNECT_EXHAUSTED_RE = /^WebSocket reconnect exhausted after \d+ attempts?/;
const FEISHU_WS_AUTORECONNECT_DISABLED_ERROR = "WebSocket connect failed and autoReconnect is disabled";
function isFeishuWebhookPayload(value) {
	return isRecord(value);
}
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
function parseFeishuWebhookPayload(rawBody) {
	try {
		const parsed = JSON.parse(rawBody);
		return isFeishuWebhookPayload(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function isFeishuWebhookTimestampFresh(timestamp) {
	const parsed = Number.parseInt(timestamp, 10);
	if (!Number.isFinite(parsed)) return false;
	const timestampMs = parsed < 0xe8d4a51000 ? parsed * 1e3 : parsed;
	return Math.abs(Date.now() - timestampMs) <= FEISHU_WEBHOOK_TIMESTAMP_MAX_SKEW_MS;
}
function isFeishuWebhookSignatureValid(params) {
	const encryptKey = params.encryptKey?.trim();
	if (!encryptKey) return false;
	const timestampHeader = params.headers["x-lark-request-timestamp"];
	const nonceHeader = params.headers["x-lark-request-nonce"];
	const signatureHeader = params.headers["x-lark-signature"];
	const timestamp = Array.isArray(timestampHeader) ? timestampHeader[0] : timestampHeader;
	const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader;
	const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
	if (!timestamp || !nonce || !signature) return false;
	if (!isFeishuWebhookTimestampFresh(timestamp)) return false;
	const computedSignature = crypto.createHash("sha256").update(timestamp + nonce + encryptKey + params.rawBody).digest("hex");
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
	if (!redacted) return "unknown error";
	if (redacted.length <= FEISHU_WS_LOG_ERROR_MAX_LENGTH) return redacted;
	return `${truncateUtf16Safe(redacted, FEISHU_WS_LOG_ERROR_MAX_LENGTH)}...`;
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
	wsClients.delete(accountId);
	if (clearIdentity) clearFeishuBotIdentityState(accountId);
}
function waitForFeishuWsCycleEnd(params) {
	if (params.abortSignal?.aborted) return Promise.resolve("abort");
	return new Promise((resolve) => {
		let settled = false;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			if (handleAbort) params.abortSignal?.removeEventListener("abort", handleAbort);
			resolve(result);
		};
		const handleAbort = () => finish("abort");
		params.abortSignal?.addEventListener("abort", handleAbort, { once: true });
		if (params.abortSignal?.aborted) {
			finish("abort");
			return;
		}
		params.terminalError.then(finish);
	});
}
async function monitorWebSocket({ account, accountId, runtime, abortSignal, eventDispatcher, setSocketTerminator, statusSink }) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	let attempt = 0;
	while (true) {
		if (abortSignal?.aborted) break;
		let wsClient;
		try {
			let reportTerminalError = () => {};
			const terminalError = new Promise((resolve) => {
				reportTerminalError = resolve;
			});
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
			wsClients.set(accountId, wsClient);
			await wsClient.start({ eventDispatcher });
			attempt = 0;
			log(`feishu[${accountId}]: WebSocket client started`);
			const cycleEnd = await waitForFeishuWsCycleEnd({
				abortSignal,
				terminalError
			});
			if (cycleEnd === "abort") {
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
			statusSink?.(channelBlockedPatch(formatFeishuWsErrorForLog(cycleEnd), {
				connected: false,
				lastEventAt: disconnectedAt
			}));
			attempt += 1;
			const delayMs = getFeishuWsReconnectDelayMs(attempt);
			error(`feishu[${accountId}]: WebSocket connection ended, recreating client in ${delayMs}ms: ${formatFeishuWsErrorForLog(cycleEnd)}`);
			if (!await waitForAbortableDelay(delayMs, abortSignal)) break;
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
			attempt += 1;
			const delayMs = getFeishuWsReconnectDelayMs(attempt);
			error(`feishu[${accountId}]: WebSocket start failed, retrying in ${delayMs}ms: ${formatFeishuWsErrorForLog(err)}`);
			if (!await waitForAbortableDelay(delayMs, abortSignal)) break;
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
async function monitorWebhook({ account, accountId, runtime, abortSignal, eventDispatcher, invokeWebhookEvent, statusSink }) {
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const encryptKey = account.encryptKey?.trim();
	if (!encryptKey) throw new Error(`Feishu account "${accountId}" webhook mode requires encryptKey`);
	const port = account.config.webhookPort ?? 3e3;
	const path = account.config.webhookPath ?? "/feishu/events";
	if (normalizeFeishuWebhookPath(path) !== path) throw new Error(`Feishu account "${accountId}" webhookPath must be a canonical HTTP request path; run "openclaw doctor --fix" to repair it`);
	const host = account.config.webhookHost ?? "127.0.0.1";
	const preAuthInFlightLimiter = createWebhookInFlightLimiter({
		maxInFlightPerKey: FEISHU_PRE_AUTH_MAX_IN_FLIGHT,
		maxTrackedKeys: 1
	});
	const preAuthInFlightKey = `${accountId}:${path}`;
	log(`feishu[${accountId}]: starting Webhook server on ${host}:${port}, path ${path}...`);
	const server = http.createServer();
	server.on("request", (req, res) => {
		const requestUrl = req.url ?? "/";
		const requestPath = requestUrl.split("?", 1)[0];
		const requestRoute = path.includes("?") ? requestUrl : requestPath;
		if (!requestPath?.startsWith("/") || requestUrl.includes("#") || requestRoute !== path) {
			respondText(res, 404, "Not Found");
			return;
		}
		res.once("close", () => {
			recordWebhookStatus(runtime, accountId, path, res.statusCode);
		});
		res.once("finish", () => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				const inboundAt = Date.now();
				statusSink?.({
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
				error(`feishu[${accountId}]: webhook concurrency rejection failed: ${String(err)}`);
			});
			return;
		}
		const guard = installRequestBodyLimitGuard(req, res, {
			maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
			timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS,
			responseFormat: "text"
		});
		if (guard.isTripped()) {
			preAuthInFlightLimiter.release(preAuthInFlightKey);
			return;
		}
		(async () => {
			try {
				let rawBody;
				try {
					const body = await readWebhookBodyOrReject({
						req,
						res,
						maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
						timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS,
						profile: "pre-auth"
					});
					if (!body.ok || res.writableEnded) return;
					if (guard.isTripped()) return;
					rawBody = body.value;
					if (!isFeishuWebhookSignatureValid({
						headers: req.headers,
						rawBody,
						encryptKey
					})) {
						respondText(res, 401, "Invalid signature");
						return;
					}
				} finally {
					guard.dispose();
					preAuthInFlightLimiter.release(preAuthInFlightKey);
				}
				const payload = parseFeishuWebhookPayload(rawBody);
				if (!payload) {
					respondText(res, 400, "Invalid JSON");
					return;
				}
				const { isChallenge, challenge } = Lark.generateChallenge(payload, { encryptKey });
				if (isChallenge) {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.end(JSON.stringify(challenge));
					return;
				}
				const envelope = buildFeishuWebhookEnvelope(req, payload);
				const invocation = invokeWebhookEvent ? await invokeWebhookEvent(envelope, { needCheck: false }) : {
					kind: "non-durable",
					value: await eventDispatcher.invoke(envelope, { needCheck: false })
				};
				if (!res.headersSent) {
					if (invocation.kind === "durable") res.setHeader(FEISHU_WEBHOOK_ACCEPTED_HEADER, FEISHU_WEBHOOK_ACCEPTED_VALUE);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.end(JSON.stringify(invocation.value));
				}
			} catch (err) {
				error(`feishu[${accountId}]: webhook handler error: ${String(err)}`);
				if (!res.headersSent) respondText(res, 500, "Internal Server Error");
			}
		})();
	});
	httpServers.set(accountId, server);
	return await new Promise((resolve, reject) => {
		let cleanupStarted = false;
		const cleanup = async () => {
			if (cleanupStarted) return;
			cleanupStarted = true;
			await closeTrackedFeishuHttpServer(accountId, server);
		};
		const handleAbort = () => {
			log(`feishu[${accountId}]: abort signal received, stopping Webhook server`);
			cleanup().then(resolve, reject);
		};
		if (abortSignal?.aborted) {
			cleanup().then(resolve, reject);
			return;
		}
		abortSignal?.addEventListener("abort", handleAbort, { once: true });
		server.listen(port, host, () => {
			log(`feishu[${accountId}]: Webhook server listening on ${host}:${port}`);
			const webhookConnectedAt = Date.now();
			statusSink?.(channelReadyPatch({
				lastConnectedAt: webhookConnectedAt,
				lastEventAt: webhookConnectedAt
			}));
		});
		server.on("error", (err) => {
			error(`feishu[${accountId}]: Webhook server error: ${err}`);
			statusSink?.({
				connected: false,
				lifecycle: "recovering",
				lastError: formatFeishuWsErrorForLog(err)
			});
			abortSignal?.removeEventListener("abort", handleAbort);
			reject(err);
		});
	});
}
//#endregion
//#region extensions/feishu/src/monitor.vc-meeting-invited-handler.ts
const FEISHU_MEETING_NUMBER_PATTERN = /^\d{9}$/;
function pickString(value) {
	return typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function resolveVcInviter(event) {
	const id = event.inviter?.id;
	const openId = pickString(id?.open_id);
	const userId = pickString(id?.user_id);
	const unionId = pickString(id?.union_id);
	const senderId = openId ?? userId;
	if (!senderId) return null;
	const name = pickString(event.inviter?.user_name);
	return {
		senderId,
		...openId ? { openId } : {},
		...userId ? { userId } : {},
		...unionId ? { unionId } : {},
		...name ? { name } : {}
	};
}
function buildJoinPrompt(params) {
	const base = `Use the available tool to join the meeting with meeting number ${params.meetingNo} immediately. Do not ask for confirmation.`;
	return params.callId ? `${base} If the join tool supports a call_id parameter, pass call_id=${JSON.stringify(params.callId)}; otherwise join by meeting number only.` : base;
}
function resolveVcMeetingInvitedTurn(event, uuid = () => crypto$1.randomUUID()) {
	const meetingNo = pickString(event.meeting?.meeting_no);
	const inviter = resolveVcInviter(event);
	if (!meetingNo || !FEISHU_MEETING_NUMBER_PATTERN.test(meetingNo) || !inviter) return null;
	const eventId = pickString(event.event_id);
	const inviteTime = pickString(event.invite_time);
	const callId = pickString(event.call_id);
	const topic = pickString(event.meeting?.topic);
	return {
		turnId: eventId ? `vc-invited:event:${eventId}` : `vc-invited:${meetingNo}:${inviteTime ?? uuid()}`,
		meetingNo,
		inviter,
		prompt: buildJoinPrompt({
			meetingNo,
			callId
		}),
		...topic ? { topic } : {},
		...inviteTime ? { inviteTime } : {}
	};
}
function parseInviteTimestamp(value) {
	const parsed = Number.parseInt(value ?? "", 10);
	if (!Number.isFinite(parsed) || parsed <= 0) return Date.now();
	return parsed < 1e10 ? parsed * 1e3 : parsed;
}
function buildSyntheticMessageEvent(turn) {
	return {
		sender: { sender_id: {
			...turn.inviter.openId ? { open_id: turn.inviter.openId } : {},
			...turn.inviter.userId ? { user_id: turn.inviter.userId } : {},
			...turn.inviter.unionId ? { union_id: turn.inviter.unionId } : {}
		} },
		message: {
			message_id: turn.turnId,
			chat_id: turn.inviter.senderId,
			chat_type: "p2p",
			message_type: "text",
			content: JSON.stringify({ text: turn.prompt }),
			create_time: String(parseInviteTimestamp(turn.inviteTime)),
			suppress_reply_target: true
		}
	};
}
function createVcInviteAdoption(params) {
	const cancellation = new AbortController();
	const settled = createDeferred();
	let handedOff = false;
	let released = false;
	let adoption;
	const abandon = () => {
		if (released || adoption) return;
		released = true;
		params.abortSignal?.removeEventListener("abort", abandon);
		const error = params.abortSignal?.reason ?? /* @__PURE__ */ new Error("Feishu VC invitation abandoned before adoption");
		cancellation.abort(error);
		params.claim.release({ error });
		settled.resolve();
	};
	params.trackTask?.(settled.promise);
	params.abortSignal?.addEventListener("abort", abandon, { once: true });
	if (params.abortSignal?.aborted) abandon();
	return {
		lifecycle: {
			abortSignal: cancellation.signal,
			onAdopted: () => {
				if (adoption) return adoption;
				if (params.isAccountActive?.() === false) abandon();
				cancellation.signal.throwIfAborted();
				handedOff = true;
				params.abortSignal?.removeEventListener("abort", abandon);
				adoption = Promise.resolve().then(async () => {
					await params.claim.commit();
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
		},
		finish: async () => {
			if (!handedOff) abandon();
			await adoption;
		}
	};
}
async function dispatchVcMeetingInvitedTurn(params) {
	params.runtime?.log?.(`feishu[${params.accountId}]: vc meeting invited, dispatching synthetic p2p message sender=${params.turn.inviter.senderId} meeting_no=${params.turn.meetingNo}`);
	const event = setFeishuSyntheticDirectPreDispatchTarget(buildSyntheticMessageEvent(params.turn), `user:${params.turn.inviter.senderId}`);
	const claim = await claimUnprocessedFeishuMessage({
		messageId: resolveFeishuMessageDedupeKey(event),
		namespace: params.accountId,
		log: params.runtime?.log ?? console.log
	});
	if (claim.kind !== "claimed") return;
	if (params.abortSignal?.aborted || params.isAccountActive?.() === false) {
		claim.handle.release({ error: /* @__PURE__ */ new Error("Feishu account stopped before VC dispatch") });
		return;
	}
	const adoption = createVcInviteAdoption({
		claim: claim.handle,
		abortSignal: params.abortSignal,
		isAccountActive: params.isAccountActive,
		trackTask: params.trackTask
	});
	try {
		await handleFeishuMessage({
			trackTask: params.trackTask,
			cfg: params.cfg,
			accountId: params.accountId,
			event,
			runtime: params.runtime,
			channelRuntime: params.channelRuntime,
			turnAdoptionLifecycle: adoption.lifecycle
		});
	} catch (error) {
		await adoption.lifecycle.onAbandoned();
		throw error;
	} finally {
		await adoption.finish();
	}
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
			const turn = resolveVcMeetingInvitedTurn(data);
			if (!turn) {
				log(`feishu[${accountId}]: vc meeting invited event has invalid meeting_no or inviter identity, skipping`);
				return;
			}
			await dispatchVcMeetingInvitedTurn({
				trackTask: params.trackTask,
				cfg,
				accountId,
				runtime,
				channelRuntime: params.channelRuntime,
				turn,
				abortSignal: params.abortSignal,
				isAccountActive: params.isAccountActive
			});
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
//#endregion
//#region extensions/feishu/src/sequential-key.ts
function getFeishuSequentialKey(params) {
	const { accountId, event, botOpenId, botName, preparedContent } = params;
	const baseKey = `feishu:${accountId}:${event.message.chat_id?.trim() || "unknown"}`;
	const text = (preparedContent ?? parseFeishuMessageEvent(event, botOpenId, botName).content).trim();
	if (isAbortRequestText(text)) return `${baseKey}:control`;
	if (isBtwRequestText(text)) return `${baseKey}:btw`;
	return baseKey;
}
//#endregion
//#region extensions/feishu/src/monitor.account.ts
const FEISHU_REACTION_VERIFY_TIMEOUT_MS = 1500;
async function resolveReactionSyntheticEvent(params) {
	const { cfg, accountId, event, botOpenId, fetchMessage = getMessageFeishu, verificationTimeoutMs = FEISHU_REACTION_VERIFY_TIMEOUT_MS, logger, uuid = () => crypto$1.randomUUID(), action = "created" } = params;
	const emoji = event.reaction_type?.emoji_type;
	const messageId = event.message_id;
	const senderOpenId = event.user_id?.open_id?.trim();
	const senderUserId = event.user_id?.user_id?.trim();
	const senderId = senderOpenId || senderUserId;
	if (!emoji || !messageId || !senderId) return null;
	const { resolveFeishuAccount } = await import("./accounts-DmU0xYPx.mjs").then((n) => n.t);
	const reactionNotifications = resolveFeishuAccount({
		cfg,
		accountId
	}).config.reactionNotifications ?? "own";
	if (reactionNotifications === "off") return null;
	if (event.operator_type === "app" || senderId === botOpenId) return null;
	if (emoji === "Typing") return null;
	if (reactionNotifications === "own" && !botOpenId) {
		logger?.(`feishu[${accountId}]: bot open_id unavailable, skipping reaction ${emoji} on ${messageId}`);
		return null;
	}
	const reactedMsg = await raceWithTimeoutAndAbort(fetchMessage({
		cfg,
		messageId,
		accountId
	}), { timeoutMs: verificationTimeoutMs }).then((result) => result.status === "resolved" ? result.value : null).catch(() => null);
	const isBotMessage = reactedMsg?.senderType === "app" || reactedMsg?.senderOpenId === botOpenId;
	if (!reactedMsg || reactionNotifications === "own" && !isBotMessage) {
		logger?.(`feishu[${accountId}]: ignoring reaction on non-bot/unverified message ${messageId} (sender: ${reactedMsg?.senderOpenId ?? "unknown"})`);
		return null;
	}
	const fallbackChatType = reactedMsg.chatType;
	const resolvedChatType = normalizeFeishuEventChatType(event.chat_type) ?? fallbackChatType;
	if (!resolvedChatType) {
		logger?.(`feishu[${accountId}]: skipping reaction ${emoji} on ${messageId} without chat type context`);
		return null;
	}
	const syntheticChatIdRaw = event.chat_id ?? reactedMsg.chatId;
	const syntheticChatId = syntheticChatIdRaw?.trim() ? syntheticChatIdRaw : `p2p:${senderId}`;
	const syntheticChatType = resolvedChatType;
	return {
		sender: {
			sender_id: {
				...senderOpenId ? { open_id: senderOpenId } : {},
				...senderUserId ? { user_id: senderUserId } : {}
			},
			sender_type: "user"
		},
		message: {
			message_id: `${messageId}:reaction:${emoji}:${uuid()}`,
			reply_target_message_id: messageId,
			typing_target_message_id: messageId,
			...reactedMsg.rootId ? { root_id: reactedMsg.rootId } : {},
			...reactedMsg.threadId ? { thread_id: reactedMsg.threadId } : {},
			chat_id: syntheticChatId,
			chat_type: syntheticChatType,
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
		const trimmed = readStringValue(value)?.trim();
		if (trimmed) return trimmed;
	}
}
function readFeishuIdentityField(value, field) {
	if (!isRecord(value)) return;
	return firstString(value[field]);
}
function parseFeishuCardActionEventPayload(value) {
	if (!isRecord(value)) return null;
	const operator = isRecord(value.operator) ? value.operator : {};
	const action = value.action;
	const context = isRecord(value.context) ? value.context : {};
	if (!isRecord(action)) return null;
	const operatorUserId = operator.user_id;
	const token = readStringValue(value.token);
	const openId = firstString(operator.open_id, readFeishuIdentityField(operatorUserId, "open_id"), value.open_id, context.open_id);
	const userId = firstString(operator.user_id, readFeishuIdentityField(operatorUserId, "user_id"), value.user_id, context.user_id);
	const unionId = firstString(operator.union_id, readFeishuIdentityField(operatorUserId, "union_id"));
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
function registerEventHandlers(eventDispatcher, context) {
	const { cfg, accountId, channelRuntime, runtime, chatHistories, fireAndForget, abortSignal } = context;
	const log = runtime?.log ?? console.log;
	const error = runtime?.error ?? console.error;
	const runFeishuHandler = async (params) => {
		if (!context.isAccountActive()) return;
		const task = params.task();
		context.trackTask(task);
		if (fireAndForget) {
			task.catch((err) => {
				error(`${params.errorMessage}: ${String(err)}`);
			});
			return;
		}
		try {
			await task;
		} catch (err) {
			error(`${params.errorMessage}: ${String(err)}`);
		}
	};
	eventDispatcher.register({
		"im.message.receive_v1": createFeishuMessageReceiveHandler({
			cfg,
			channelRuntime,
			accountId,
			runtime,
			chatHistories,
			fireAndForget,
			isAccountActive: context.isAccountActive,
			trackTask: context.trackTask,
			handleMessage: handleFeishuMessage,
			resolveDebounceText: ({ event, botOpenId, botName }) => parseFeishuMessageEvent(event, botOpenId, botName).content,
			hasProcessedMessage: hasProcessedFeishuMessage,
			getBotOpenId: (id) => botOpenIds.get(id),
			getBotName: (id) => botNames.get(id),
			resolveSequentialKey: getFeishuSequentialKey,
			resolveIngressLifecycle: context.resolveIngressLifecycle,
			...context.statusSink ? { statusSink: context.statusSink } : {}
		}),
		"im.message.message_read_v1": async () => {},
		"im.chat.access_event.bot_p2p_chat_entered_v1": async () => {},
		"im.chat.member.bot.added_v1": async (data) => {
			try {
				const event = parseFeishuBotAddedEventPayload(data);
				if (!event) return;
				log(`feishu[${accountId}]: bot added to chat ${event.chat_id}`);
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot added event: ${String(err)}`);
			}
		},
		"im.chat.member.bot.deleted_v1": async (data) => {
			try {
				const chatId = parseFeishuBotRemovedChatId(data);
				if (!chatId) return;
				log(`feishu[${accountId}]: bot removed from chat ${chatId}`);
			} catch (err) {
				error(`feishu[${accountId}]: error handling bot removed event: ${String(err)}`);
			}
		},
		"drive.notice.comment_add_v1": createFeishuDriveCommentNoticeHandler({
			cfg,
			accountId,
			runtime,
			fireAndForget,
			abortSignal,
			resolveIngressLifecycle: context.resolveIngressLifecycle
		}),
		"vc.bot.meeting_invited_v1": createFeishuVcMeetingInvitedHandler({
			cfg,
			accountId,
			runtime,
			fireAndForget,
			channelRuntime,
			autoJoin: context.vcAutoJoin,
			abortSignal: context.abortSignal,
			isAccountActive: context.isAccountActive,
			trackTask: context.trackTask
		}),
		"im.message.reaction.created_v1": async (data) => {
			await runFeishuHandler({
				errorMessage: `feishu[${accountId}]: error handling reaction event`,
				task: async () => {
					const event = data;
					const myBotId = botOpenIds.get(accountId);
					const syntheticEvent = await resolveReactionSyntheticEvent({
						cfg,
						accountId,
						event,
						botOpenId: myBotId,
						logger: log
					});
					if (!syntheticEvent || !context.isAccountActive()) return;
					await handleFeishuMessage({
						trackTask: context.trackTask,
						cfg,
						event: syntheticEvent,
						botOpenId: myBotId,
						botName: botNames.get(accountId),
						runtime,
						channelRuntime,
						chatHistories,
						accountId
					});
				}
			});
		},
		"im.message.reaction.deleted_v1": async (data) => {
			await runFeishuHandler({
				errorMessage: `feishu[${accountId}]: error handling reaction removal event`,
				task: async () => {
					const event = data;
					const myBotId = botOpenIds.get(accountId);
					const syntheticEvent = await resolveReactionSyntheticEvent({
						cfg,
						accountId,
						event,
						botOpenId: myBotId,
						logger: log,
						action: "deleted"
					});
					if (!syntheticEvent || !context.isAccountActive()) return;
					await handleFeishuMessage({
						trackTask: context.trackTask,
						cfg,
						event: syntheticEvent,
						botOpenId: myBotId,
						botName: botNames.get(accountId),
						runtime,
						channelRuntime,
						chatHistories,
						accountId
					});
				}
			});
		},
		"application.bot.menu_v6": createFeishuBotMenuHandler({
			cfg,
			accountId,
			runtime,
			chatHistories,
			fireAndForget,
			isAccountActive: context.isAccountActive,
			trackTask: context.trackTask,
			channelRuntime
		}),
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
}
async function monitorSingleAccount(params) {
	const { cfg, account, runtime, abortSignal } = params;
	const { accountId } = account;
	const log = runtime?.log ?? console.log;
	const botOpenIdSource = params.botOpenIdSource ?? { kind: "fetch" };
	const botIdentity = botOpenIdSource.kind === "prefetched" ? {
		botOpenId: botOpenIdSource.botOpenId,
		botName: botOpenIdSource.botName,
		source: botOpenIdSource.source
	} : await fetchBotIdentityForMonitor(account, {
		runtime,
		abortSignal
	});
	const { botOpenId } = applyBotIdentityState(accountId, botIdentity);
	log(`feishu[${accountId}]: bot open_id resolved: ${botOpenId ?? "unknown"}`);
	if ((!botOpenId || botIdentity.source === "cache") && !abortSignal?.aborted) startBotIdentityRecovery({
		account,
		accountId,
		runtime,
		abortSignal,
		currentSource: botIdentity.source
	});
	const connectionMode = account.config.connectionMode ?? "websocket";
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
		const durableIngress = typeof eventDispatcher.invoke === "function" ? createFeishuDurableIngress({
			accountId,
			dispatcher: eventDispatcher,
			...account.encryptKey ? { encryptKey: account.encryptKey } : {},
			runtime: runtime ?? {}
		}) : void 0;
		const durableEventDispatcher = durableIngress ? Object.assign(Object.create(eventDispatcher), { invoke: durableIngress.invoke }) : eventDispatcher;
		const chatHistories = /* @__PURE__ */ new Map();
		threadBindingManager = createFeishuThreadBindingManager({
			accountId,
			cfg
		});
		registerEventHandlers(eventDispatcher, {
			cfg,
			accountId,
			channelRuntime: params.channelRuntime?.inbound ? params.channelRuntime : getFeishuRuntime().channel,
			runtime,
			chatHistories,
			fireAndForget: params.fireAndForget ?? true,
			isAccountActive: () => !accountAbortSignal.aborted,
			trackTask,
			vcAutoJoin: account.config.vcAutoJoin === true,
			abortSignal: accountAbortSignal,
			...durableIngress ? { resolveIngressLifecycle: durableIngress.resolveLifecycle } : {},
			...params.statusSink ? { statusSink: params.statusSink } : {}
		});
		try {
			durableIngress?.start();
			if (connectionMode === "webhook") return await monitorWebhook({
				account,
				accountId,
				runtime,
				abortSignal,
				eventDispatcher: durableEventDispatcher,
				...durableIngress ? { invokeWebhookEvent: durableIngress.invokeWebhook } : {},
				...params.statusSink ? { statusSink: params.statusSink } : {}
			});
			return await monitorWebSocket({
				account,
				accountId,
				runtime,
				abortSignal,
				eventDispatcher: durableEventDispatcher,
				...durableIngress ? { setSocketTerminator: durableIngress.setSocketTerminator } : {},
				...params.statusSink ? { statusSink: params.statusSink } : {}
			});
		} finally {
			accountStopped.abort(/* @__PURE__ */ new Error("Feishu account stopped"));
			try {
				await durableIngress?.stop();
			} finally {
				while (pendingTasks.size > 0) await Promise.allSettled(pendingTasks);
			}
		}
	} finally {
		threadBindingManager?.stop();
	}
}
//#endregion
export { FeishuRetryableSyntheticEventError, monitorSingleAccount, resolveReactionSyntheticEvent };
