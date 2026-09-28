import { A as countSlackTextUtf8Bytes, C as buildSlackBlocksFallbackText, E as SLACK_EDIT_TEXT_MAX_BYTES, H as SLACK_SESSION_LINK_ACTION_ID, M as truncateSlackTextByUtf8Bytes, Pt as resolveSlackReplyToMode, Y as normalizeSlackOutboundText, c as qualifySlackRoutePeerId, j as truncateSlackText, k as SLACK_TEXT_LIMIT, ot as escapeSlackMrkdwn, v as hasSlackNativeDataBlock } from "./session-status-Cf7AvWOt.mjs";
import { n as formatSlackTarget } from "./target-parsing-DEsPjngB.mjs";
import { A as resolveSlackUserAllowed, E as normalizeSlackAllowOwnerEntry, T as normalizeAllowListLower, o as formatSlackError } from "./probe-DiYIMPJo.mjs";
import { a as prepareSlackReply, l as resolveSlackReplyRenderPlan } from "./reply-blocks-Bm8kf6mK.mjs";
import { n as resolveSlackReplyThreadTs } from "./thread-ts-CukseRVL.mjs";
import { n as resolveSlackStreamingMode, t as resolveSlackNativeStreaming } from "./streaming-compat-B-e0mqM0.mjs";
import { D as resolveSlackMessageText$1, E as resolveSlackBlocksText, O as buildSlackEditTextPayload, S as formatSlackFileReferenceList, T as isSlackUnfurlAttachment, a as editSlackRenderedMessage, d as reactSlackMessage, i as editSlackMessage, m as removeSlackReaction, n as deleteSlackMessage, v as logVerbose$1, w as hasSlackTableBlock, x as formatSlackFileReference } from "./actions-DKCtBgCI.mjs";
import { c as hasSlackThreadFailureNotice, d as recordSlackThreadFailureNotice, f as recordSlackThreadParticipation, l as hasSlackThreadParticipation, m as buildSlackNativeDataDeliveryPlan, o as clearSlackThreadFailureNotice, r as sendMessageSlack, u as hasSlackThreadParticipationWithPersistence } from "./send-Cp6omkOg.mjs";
import { A as resolveChannelContextVisibilityMode, D as readSlackAssistantThreadContext, E as buildSlackAssistantThreadMetadata, F as stripSlackMentionsForCommandDetection, M as resolveStorePath, N as updateLastRoute, O as getSessionEntry, T as resolveSlackChatType, _ as SlackStreamNotDeliveredError, b as startSlackStream, d as resolveSlackRoutingContext, f as registerSlackSessionRun, g as resolveSlackEffectiveAllowFrom, h as resolveSlackCommandIngress, j as resolveChannelResetConfig, k as readSessionUpdatedAt, l as authorizeSlackDirectMessage, m as authorizeSlackBotRoomMessage, o as resolveSlackRoomContextHints, p as resolveSlackThreadTargets, r as trackSlackDraftMessage, u as resolveConversationLabel, v as appendSlackStream, w as normalizeSlackChannelType, x as stopSlackStream, y as markSlackStreamFallbackDelivered } from "./provider-C-jPaGt2.mjs";
import { n as resolveSlackChannelConfig } from "./policy-BApW53pI.mjs";
import { a as resolveSlackThreadTs, i as readSlackReplyBlocks, n as deliverReplies, o as sanitizeSlackMonitorReplyPayload, s as emitSlackMessageSentHooks, t as createSlackReplyDeliveryPlan } from "./replies-BBAJxUOQ.mjs";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import { buildChannelProgressDraftLine, createChannelMessageReplyPipeline, createChannelProgressDraftCompositor, createChannelProgressWorkCounter, createDraftStreamLoop, createFinalizableDraftLifecycle, createLivePreviewLifecycle, createMessageReceiptFromOutboundResults, formatChannelProgressDraftDiffStat, formatChannelProgressDraftText, formatPlanChecklistLines, resolveAgentOutboundIdentity, resolveChannelMessageSourceReplyDeliveryMode, resolveChannelProgressDraftConfig, resolveChannelProgressDraftMaxLineChars, resolveChannelStreamingBlockEnabled, resolveChannelStreamingPreviewToolProgress, resolveChannelStreamingSuppressDefaultToolProgressMessages } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { danger, logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { buildTtsSupplementMediaPayload, getReplyPayloadTtsSupplement, isReplyPayloadNonTerminalToolErrorWarning, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { asDateTimestampMs, asFiniteNumberInRange, parseStrictFiniteNumber, resolveExpiresAtMsFromDurationMs, resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { hash } from "node:crypto";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { ensureConfiguredBindingRouteReady } from "openclaw/plugin-sdk/conversation-runtime";
import { resolveChannelImplicitMentions } from "openclaw/plugin-sdk/channel-ingress-runtime";
import fs from "node:fs/promises";
import { runTasksWithConcurrency } from "openclaw/plugin-sdk/concurrency-runtime";
import { formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { filterSupplementalContextItems, resolvePinnedMainDmOwnerFromAllowlist, shouldIncludeSupplementalContext } from "openclaw/plugin-sdk/security-runtime";
import { mimeTypeFromFilePath } from "openclaw/plugin-sdk/media-mime";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { enqueueRoutedSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { buildChannelInboundEventContext, buildMentionRegexes, classifyChannelInboundEvent, dispatchChannelInboundTurn, formatInboundEnvelope, formatInboundMediaUnavailableText, hasVisibleInboundReplyDispatch, implicitMentionKindWhen, isGroupThreadRouteExclusive, matchesMentionWithExplicit, readAgentRunTerminalOutcome, resolveEnvelopeFormatOptions, resolveGroupThreadConfig, resolveGroupThreadMentionFacts, resolveInboundMentionDecision, resolveInboundReplyDispatchCounts, resolveUnmentionedGroupInboundPolicy, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { resolveGatewayPublicOrigin } from "openclaw/plugin-sdk/config-contracts";
import { buildControlUiSessionPath } from "openclaw/plugin-sdk/session-discussion";
import { createStatusReactionController, logAckFailure, logTypingFailure, resolveAckReaction, shouldAckReaction } from "openclaw/plugin-sdk/channel-feedback";
import { hasControlCommand } from "openclaw/plugin-sdk/command-detection";
import { isAbortRequestText } from "openclaw/plugin-sdk/command-primitives-runtime";
import { shouldHandleTextCommands } from "openclaw/plugin-sdk/command-surface";
import { DEFAULT_GROUP_HISTORY_LIMIT, buildHistoryContextFromEntries, buildInboundHistoryFromEntries } from "openclaw/plugin-sdk/reply-history";
import { createChannelPreflightAudio, formatAudioTranscriptForAgent } from "openclaw/plugin-sdk/media-understanding-runtime";
//#region extensions/slack/src/monitor/message-handler/timestamp.ts
const SLACK_TIMESTAMP_RE = /^\d+(?:\.\d+)?$/;
const MAX_SAFE_SLACK_TIMESTAMP_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function resolveSlackTimestampMs(ts) {
	const trimmed = ts?.trim();
	if (!trimmed || !SLACK_TIMESTAMP_RE.test(trimmed)) return;
	const seconds = asFiniteNumberInRange(parseStrictFiniteNumber(trimmed), {
		min: 0,
		max: MAX_SAFE_SLACK_TIMESTAMP_SECONDS
	});
	return seconds === void 0 ? void 0 : Math.round(seconds * 1e3);
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-helpers.ts
function resolveSlackMessageTimestampMs(message) {
	return resolveSlackTimestampMs(message.event_ts ?? message.ts);
}
function resolveSlackBotLoopProtection(prepared) {
	const senderBotId = prepared.message.bot_id;
	if (!senderBotId) return;
	const receiverBotId = prepared.ctx.botId || prepared.ctx.botUserId;
	if (!receiverBotId || senderBotId === prepared.ctx.botId || prepared.message.user === prepared.ctx.botUserId) return;
	return {
		scopeId: prepared.route.accountId,
		conversationId: prepared.message.channel,
		senderId: senderBotId,
		receiverId: receiverBotId,
		config: mergePairLoopGuardConfig(prepared.account.config.botLoopProtection, prepared.channelConfig?.botLoopProtection),
		defaultsConfig: prepared.ctx.cfg.channels?.defaults?.botLoopProtection,
		defaultEnabled: true,
		nowMs: resolveSlackMessageTimestampMs(prepared.message)
	};
}
function isSlackStreamingEnabled(params) {
	if (params.mode === "partial") return params.nativeStreaming;
	if (params.mode === "progress") return params.nativeStreaming && params.nativeProgressTaskCards === true;
	return false;
}
function resolveSlackDisableBlockStreaming(params) {
	if (params.useStreaming || params.shouldUseDraftStream) return true;
	return typeof params.blockStreamingEnabled === "boolean" ? !params.blockStreamingEnabled : void 0;
}
function resolveExplicitSlackProgressTitle(entry) {
	const label = resolveChannelProgressDraftConfig(entry).label;
	if (typeof label !== "string") return;
	const trimmed = label.trim();
	return trimmed && trimmed.toLowerCase() !== "auto" ? trimmed : void 0;
}
function resolveSlackProgressStyle(entry) {
	const progress = entry?.streaming?.progress;
	return progress?.style ?? (progress?.toolProgress === false ? "compact" : "card");
}
function resolveSlackNativeProgressTaskCards(entry) {
	if (resolveSlackProgressStyle(entry) === "compact") return false;
	const streaming = entry?.streaming;
	if (!streaming || typeof streaming !== "object" || Array.isArray(streaming)) return true;
	const progressConfig = streaming.progress;
	if (!progressConfig || typeof progressConfig !== "object" || Array.isArray(progressConfig)) return true;
	return progressConfig.nativeTaskCards !== false;
}
function resolveSlackStreamingThreadHint(params) {
	return resolveSlackThreadTs({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: false,
		isThreadReply: params.isThreadReply
	});
}
const SLACK_STREAM_RECIPIENT_TEAM_CACHE_MAX = 2e3;
const slackStreamRecipientTeamCaches = /* @__PURE__ */ new WeakMap();
function getSlackStreamRecipientTeamCache(client) {
	const existing = slackStreamRecipientTeamCaches.get(client);
	if (existing) return existing;
	const cache = /* @__PURE__ */ new Map();
	slackStreamRecipientTeamCaches.set(client, cache);
	return cache;
}
function buildSlackEventDeliveryKey(params, preparedReply = prepareSlackReply(params.payload)) {
	const reply = resolveSendableOutboundReplyParts(params.payload, { text: params.textOverride });
	const renderPlan = preparedReply.resolvePreview(params.textOverride);
	const plannedBlocks = renderPlan.mode === "single" ? renderPlan.blocks : renderPlan.blockPart?.blocks;
	const slackBlocks = readSlackReplyBlocks(params.payload) ?? plannedBlocks;
	const renderedText = renderPlan.mode === "single" ? renderPlan.text : renderPlan.fallbackText;
	if (!reply.hasContent && !slackBlocks?.length && !renderedText.trim()) return null;
	return JSON.stringify({
		kind: params.kind,
		threadTs: params.threadTs ?? "",
		replyToId: params.payload.replyToId ?? null,
		text: renderedText || reply.trimmedText,
		mediaUrls: reply.mediaUrls,
		blocks: slackBlocks ?? null
	});
}
function readSlackStreamRecipientTeamCache(params) {
	if (!params.fallbackTeamId || !params.userId) return;
	const cacheKey = `${params.fallbackTeamId}:${params.userId}`;
	const cache = getSlackStreamRecipientTeamCache(params.client);
	const cached = cache.get(cacheKey);
	if (!cached) return;
	cache.delete(cacheKey);
	cache.set(cacheKey, cached);
	return cached;
}
function rememberSlackStreamRecipientTeam(params) {
	if (!params.fallbackTeamId || !params.userId) return;
	const cacheKey = `${params.fallbackTeamId}:${params.userId}`;
	const cache = getSlackStreamRecipientTeamCache(params.client);
	if (cache.has(cacheKey)) cache.delete(cacheKey);
	cache.set(cacheKey, params.teamId);
	if (cache.size > SLACK_STREAM_RECIPIENT_TEAM_CACHE_MAX) {
		const oldest = cache.keys().next().value;
		if (oldest) cache.delete(oldest);
	}
}
function createSlackEventDeliveryTracker() {
	const deliveredKeys = /* @__PURE__ */ new Set();
	return {
		hasDelivered(key) {
			return key ? deliveredKeys.has(key) : false;
		},
		markDelivered(key) {
			if (key) deliveredKeys.add(key);
		}
	};
}
function shouldUseStreaming(params) {
	if (!params.streamingEnabled) return false;
	if (!params.threadTs) {
		logVerbose("slack-stream: streaming disabled — no reply thread target available");
		return false;
	}
	return true;
}
async function resolveSlackStreamRecipientTeamId(params) {
	const cachedTeamId = readSlackStreamRecipientTeamCache(params);
	if (cachedTeamId) return cachedTeamId;
	if (params.userId) try {
		const info = await params.client.users.info({
			token: params.token,
			user: params.userId
		});
		const teamId = info.user?.team_id ?? info.user?.profile?.team;
		if (teamId) {
			rememberSlackStreamRecipientTeam({
				...params,
				teamId
			});
			return teamId;
		}
	} catch (err) {
		logVerbose(`slack-stream: users.info team lookup failed (${formatErrorMessage(err)})`);
	}
	return params.fallbackTeamId;
}
//#endregion
//#region extensions/slack/src/draft-stream.ts
const DEFAULT_THROTTLE_MS = 1e3;
function createSlackDraftStream(params) {
	const maxChars = Math.min(params.maxChars ?? 8e3, SLACK_TEXT_LIMIT);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const send = params.send ?? sendMessageSlack;
	const edit = params.edit ?? editSlackMessage;
	const remove = params.remove ?? deleteSlackMessage;
	let streamMessage;
	let streamGeneration = 0;
	let cleanupGeneration = -1;
	let untrackConversationBoundary;
	let lastVisibleUpdate;
	let lastSentKey = "";
	let preserveHumanReplies = false;
	const streamState = {
		stopped: false,
		final: false
	};
	const normalizeUpdate = (update) => typeof update === "string" ? { text: update } : update;
	const sendOrEditStreamMessage = async (pending) => {
		if (streamState.stopped) return;
		const update = normalizeUpdate(pending);
		const trimmed = update.text.trimEnd();
		if (!trimmed) return;
		if (!streamMessage && update.allowNewMessage === false) return;
		if (trimmed.length > maxChars) {
			streamState.stopped = true;
			params.warn?.(`slack stream preview stopped (text length ${trimmed.length} > ${maxChars})`);
			return;
		}
		const blocks = update.blocks;
		const sentKey = `${trimmed}\n${blocks ? JSON.stringify(blocks) : ""}`;
		if (sentKey === lastSentKey) return;
		lastSentKey = sentKey;
		const generation = streamGeneration;
		try {
			if (streamMessage) {
				const message = streamMessage;
				await edit(streamMessage.channelId, streamMessage.messageId, trimmed, {
					cfg: params.cfg,
					token: params.token,
					accountId: params.accountId,
					...params.eventScope ? { client: params.eventScope.client } : {},
					...blocks ? { blocks } : {}
				});
				if (streamMessage === message) lastVisibleUpdate = {
					text: trimmed,
					...blocks ? { blocks } : {}
				};
				return;
			}
			const threadTs = params.resolveThreadTs?.();
			const pendingBoundary = params.conversationChannelId ? trackSlackDraftMessage({
				accountId: params.accountId,
				teamId: params.eventScope?.teamId,
				channelId: params.conversationChannelId,
				threadTs,
				onInterveningMessage: () => forceNewMessage("human")
			}) : void 0;
			untrackConversationBoundary = pendingBoundary?.stop;
			const sent = await send(params.target, trimmed, {
				cfg: params.cfg,
				token: params.token,
				accountId: params.accountId,
				threadTs,
				identity: params.identity,
				eventScope: params.eventScope,
				...params.metadata ? { metadata: params.metadata } : {},
				...blocks ? { blocks } : {}
			});
			const sentMessage = {
				channelId: sent.channelId,
				messageId: sent.messageId,
				generation
			};
			if (generation !== streamGeneration) {
				if (sent.channelId && sent.messageId) lifecycle.retire(sentMessage, { defer: true });
				return;
			}
			if (!sent.channelId || !sent.messageId) {
				stopTrackingConversationBoundary();
				streamState.stopped = true;
				params.warn?.("slack stream preview stopped (missing identifiers from sendMessage)");
				return;
			}
			streamMessage = sentMessage;
			lastVisibleUpdate = {
				text: trimmed,
				...blocks ? { blocks } : {}
			};
			if (pendingBoundary && params.conversationChannelId === streamMessage.channelId) pendingBoundary.setMessageTs(streamMessage.messageId);
			else {
				stopTrackingConversationBoundary();
				untrackConversationBoundary = trackSlackDraftMessage({
					accountId: params.accountId,
					teamId: params.eventScope?.teamId,
					channelId: streamMessage.channelId,
					threadTs,
					messageTs: streamMessage.messageId,
					onInterveningMessage: () => forceNewMessage("human")
				}).stop;
			}
		} catch (err) {
			if (generation === streamGeneration) {
				stopTrackingConversationBoundary();
				streamState.stopped = true;
			}
			params.warn?.(`slack stream preview failed: ${formatSlackError(err)}`);
		}
	};
	const lifecycle = createFinalizableDraftLifecycle({
		throttleMs,
		coalesceInFlight: true,
		state: streamState,
		sendOrEditStreamMessage,
		emptyValue: "",
		isEmpty: (value) => !normalizeUpdate(value).text.trim(),
		readMessageId: () => streamMessage,
		clearMessageId: () => {
			streamMessage = void 0;
			lastVisibleUpdate = void 0;
			lastSentKey = "";
		},
		isValidMessageId: (value) => typeof value === "object" && value !== null,
		deleteMessage: async (message) => {
			if (message.generation > cleanupGeneration) return false;
			if (!message.retained && !(preserveHumanReplies && message.detachedByHuman)) await remove(message.channelId, message.messageId, {
				token: params.token,
				accountId: params.accountId,
				...params.eventScope ? { client: params.eventScope.client } : {}
			});
			return true;
		},
		warn: params.warn,
		warnPrefix: "slack stream preview cleanup failed"
	});
	const { loop, update, discardPending, seal } = lifecycle;
	const stopTrackingConversationBoundary = () => {
		untrackConversationBoundary?.();
		untrackConversationBoundary = void 0;
	};
	const dropDetachedMessages = () => {
		const generation = streamGeneration;
		return lifecycle.cleanupPending(() => {
			preserveHumanReplies = false;
			cleanupGeneration = generation;
		});
	};
	const discardPendingAndStopTracking = async () => {
		const generation = streamGeneration;
		await discardPending();
		if (generation === streamGeneration) stopTrackingConversationBoundary();
	};
	const clear = async (options) => {
		const generation = streamGeneration;
		let clearingMessage = streamMessage;
		await lifecycle.clearWithStop(async () => {
			if (generation === streamGeneration) {
				await discardPendingAndStopTracking();
				if (generation === streamGeneration) {
					clearingMessage = streamMessage;
					streamMessage = void 0;
					lastVisibleUpdate = void 0;
					lastSentKey = "";
				}
			}
			cleanupGeneration = generation;
			preserveHumanReplies = options?.preserveHumanReplies === true;
		}, {
			readMessageId: () => clearingMessage,
			clearMessageId: () => {
				clearingMessage = void 0;
			}
		});
	};
	const forceNewMessage = (reason = "turn") => {
		stopTrackingConversationBoundary();
		if (reason === "turn") {
			streamState.stopped = false;
			streamGeneration += 1;
		}
		streamState.final = false;
		if (streamMessage && !streamMessage.retained) {
			streamMessage.detachedByHuman = reason === "human";
			lifecycle.retire(streamMessage, { defer: true });
		}
		streamMessage = void 0;
		lastVisibleUpdate = void 0;
		lastSentKey = "";
		loop.resetPending();
	};
	const finalizeMessage = async (messageId, editFinal) => {
		const currentMessage = streamMessage;
		const previousUpdate = lastVisibleUpdate;
		if (!currentMessage || currentMessage.messageId !== messageId || !previousUpdate) return false;
		const { channelId } = currentMessage;
		await editFinal();
		if (streamMessage?.channelId === channelId && streamMessage.messageId === messageId) {
			currentMessage.retained = true;
			stopTrackingConversationBoundary();
			return true;
		}
		try {
			await edit(channelId, messageId, previousUpdate.text, {
				cfg: params.cfg,
				token: params.token,
				accountId: params.accountId,
				...params.eventScope ? { client: params.eventScope.client } : {},
				...previousUpdate.blocks ? { blocks: previousUpdate.blocks } : {}
			});
		} catch (err) {
			params.warn?.(`slack stream preview restore failed: ${formatSlackError(err)}`);
		}
		return false;
	};
	params.log?.(`slack stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update,
		flush: loop.flush,
		clear,
		discardPending: discardPendingAndStopTracking,
		seal,
		forceNewMessage,
		dropDetachedMessages,
		finalizeMessage,
		messageId: () => streamMessage?.messageId,
		channelId: () => streamMessage?.channelId
	};
}
//#endregion
//#region extensions/slack/src/stream-mode.ts
function resolveSlackStreamingConfig(params) {
	return {
		mode: resolveSlackStreamingMode(params),
		nativeStreaming: resolveSlackNativeStreaming(params)
	};
}
function applyAppendOnlyStreamUpdate(params) {
	const incoming = params.incoming.trimEnd();
	if (!incoming) return {
		rendered: params.rendered,
		source: params.source,
		changed: false
	};
	if (!params.rendered) return {
		rendered: incoming,
		source: incoming,
		changed: true
	};
	if (incoming === params.source) return {
		rendered: params.rendered,
		source: params.source,
		changed: false
	};
	if (incoming.startsWith(params.rendered)) return {
		rendered: incoming,
		source: incoming,
		changed: incoming !== params.rendered
	};
	if (incoming.startsWith(params.source)) {
		const delta = incoming.slice(params.source.length);
		return {
			rendered: `${params.rendered}${delta}`,
			source: incoming,
			changed: delta.length > 0
		};
	}
	if (params.source.startsWith(incoming)) return {
		rendered: params.rendered,
		source: params.source,
		changed: false
	};
	const separator = params.separator ?? (params.rendered.endsWith("\n") ? "" : "\n");
	return {
		rendered: `${params.rendered}${separator}${incoming}`,
		source: incoming,
		changed: true
	};
}
//#endregion
//#region extensions/slack/src/progress-blocks.ts
const SLACK_PROGRESS_FIELD_MAX = 1800;
const DEFAULT_SLACK_PROGRESS_DETAIL_MAX_CHARS = 120;
const DEFAULT_SLACK_PROGRESS_TASK_DETAIL_MAX_CHARS = 48;
const SLACK_PROGRESS_CHUNK_TEXT_MAX = 256;
const SLACK_PROGRESS_TASK_TITLE_MAX = 120;
const SLACK_PROGRESS_PLAN_FALLBACK_TITLE = "Thinking";
const SLACK_PROGRESS_LINE_DELTA_RE = /(?:^|\s)\+(\d+)\s+[−-](\d+)(?=\s|$)/u;
const SLACK_ATTENTION_TASK_PREFIX = "openclaw-attention-";
function buildSessionSources(url) {
	return [{
		type: "url_source",
		url,
		text: "Open in OpenClaw"
	}];
}
function field(text) {
	return {
		type: "mrkdwn",
		text: truncateSlackText(text, SLACK_PROGRESS_FIELD_MAX)
	};
}
function progressTextSection(value, style) {
	if (value.format === "plain") return {
		type: "section",
		text: {
			type: "plain_text",
			text: truncateSlackText(value.text, SLACK_PROGRESS_FIELD_MAX),
			emoji: false
		}
	};
	const rendered = renderProgressCardText(value.text, style);
	const marker = style === "italic" ? "_" : "";
	return {
		type: "section",
		text: field(`${marker}${rendered}${marker}`)
	};
}
function buildSlackProgressTextBlocks(blocks) {
	return blocks.map((block) => progressTextSection({
		text: block.text,
		format: block.format === "plain" ? "plain" : void 0
	}));
}
function resolveMaxLineChars(value, fallback) {
	return value && value > 0 ? Math.floor(value) : fallback;
}
function compactDetail(value, maxChars) {
	const normalized = value.replace(/\s+/g, " ").trim();
	const chars = Array.from(normalized);
	if (chars.length <= maxChars) return normalized;
	if (maxChars <= 1) return "…";
	const keepStart = Math.max(1, Math.ceil((maxChars - 1) * .45));
	const keepEnd = Math.max(1, maxChars - keepStart - 1);
	return `${chars.slice(0, keepStart).join("").trimEnd()}…${chars.slice(-keepEnd).join("").trimStart()}`;
}
function compactTitle(value) {
	return truncateSlackText(value.replace(/\s+/g, " ").trim(), SLACK_PROGRESS_TASK_TITLE_MAX);
}
function compactChunkText(value) {
	return truncateSlackText(value.replace(/\s+/g, " ").trim(), SLACK_PROGRESS_CHUNK_TEXT_MAX);
}
function renderProgressCardText(text, enclosingStyle) {
	return normalizeSlackOutboundText(text, {
		mentions: "escape",
		enclosingStyle
	});
}
function lineDetailParts(line) {
	return [line.detail, line.status && line.status !== "completed" && !line.detail?.includes(line.status) ? line.status : void 0].map((part) => part?.trim()).filter((part) => Boolean(part));
}
function activityLineDetail(line, maxChars) {
	const detail = lineDetailParts(line).join(" · ");
	if (detail) return escapeSlackMrkdwn(compactDetail(detail, maxChars));
	const text = line.text.replace(/^(?:🧠|💬)\s+/u, "").trim();
	return line.kind === "item" && !line.toolName && text && text !== line.label ? renderProgressCardText(compactDetail(text, maxChars)) : "—";
}
function lineTaskTitle(line) {
	const label = line.label.replace(/\s+/g, " ").trim() || line.toolName || line.kind || "Update";
	const fallback = line.text.replace(/\s+/g, " ").trim();
	if (fallback && fallback !== label) return compactTitle(lineDetailParts(line).length > 0 || line.status ? label : fallback);
	return compactTitle(label);
}
function lineTaskDetails(line, maxLineChars) {
	const detail = line.detail?.replace(SLACK_PROGRESS_LINE_DELTA_RE, "").replace(/\s+·\s*$/u, "").trim();
	return detail && detail !== line.status?.trim() ? compactDetail(detail, maxLineChars) : void 0;
}
function lineTaskOutput(line) {
	const match = line.detail ? SLACK_PROGRESS_LINE_DELTA_RE.exec(line.detail) : null;
	if (match) return `+${match[1]} −${match[2]}`;
	const status = line.status?.replace(/\s+/g, " ").trim();
	return status && lineTaskStatus(line) === "error" ? status : void 0;
}
function lineTaskStatus(line) {
	const normalized = line.status?.replace(/\s+/g, " ").trim().toLowerCase();
	if (!normalized) return "in_progress";
	if (normalized === "complete" || normalized === "completed" || normalized === "done" || normalized === "ok" || normalized === "success" || normalized === "succeeded" || normalized === "successful" || normalized === "exit 0") return "complete";
	if (normalized === "error" || normalized === "failed" || normalized === "failure" || normalized.startsWith("exit ")) return "error";
	return "in_progress";
}
function stableTaskIdPart(value, slugValue = value) {
	const slug = slugValue.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
	const suffix = hash("sha256", value, "hex").slice(0, 8);
	return `${(slug || "task").slice(0, 48)}_${suffix}`;
}
function resolveLineTaskIdentity(line, contentIdOccurrences) {
	if (line.id?.trim()) return stableTaskIdPart(line.id);
	const id = stableTaskIdPart([
		line.kind,
		line.toolName,
		line.label,
		line.text
	].join("\0"), line.toolName ?? line.kind ?? line.label);
	const occurrence = (contentIdOccurrences.get(id) ?? 0) + 1;
	contentIdOccurrences.set(id, occurrence);
	return `${id}_${occurrence}`;
}
function buildNativeTasks(params) {
	const tasks = (params.plan ?? []).map((entry, index) => ({
		id: `plan_step_${index + 1}`,
		title: compactTitle(entry.step),
		status: entry.status === "completed" ? "complete" : entry.status
	}));
	const maxLineChars = resolveMaxLineChars(params.maxLineChars, DEFAULT_SLACK_PROGRESS_TASK_DETAIL_MAX_CHARS);
	const contentIdOccurrences = /* @__PURE__ */ new Map();
	for (const line of params.lines) {
		const task = {
			id: resolveLineTaskIdentity(line, contentIdOccurrences),
			title: lineTaskTitle(line),
			status: lineTaskStatus(line)
		};
		const details = lineTaskDetails(line, maxLineChars);
		const output = lineTaskOutput(line);
		if (details) task.details = details;
		if (output) task.output = output;
		tasks.push(task);
	}
	return tasks;
}
function formatProgressAttentionTitle(line, finalStatus) {
	if (line.kind === "approval") return line.status === "requested" && finalStatus === void 0 ? compactTitle(`Approval required: ${line.detail || line.label}`) : void 0;
	if (lineTaskStatus(line) !== "error") return;
	const title = [...new Set([
		line.label,
		line.detail,
		line.status
	].filter(Boolean))].join(" — ");
	return compactTitle(finalStatus === "complete" ? `Recovered: ${title}` : title);
}
function formatTaskDiffOutput(diffStat) {
	return diffStat && (diffStat.added > 0 || diffStat.removed > 0) ? `+${diffStat.added} −${diffStat.removed}` : void 0;
}
function buildSlackProgressStreamChunks(params) {
	const approvals = params.lines.filter((line) => line.kind === "approval");
	const tasks = buildNativeTasks({
		lines: params.summaryRow ? [] : params.lines.filter((line) => line.kind !== "approval"),
		plan: params.plan,
		maxLineChars: params.maxLineChars
	});
	const contentIdOccurrences = /* @__PURE__ */ new Map();
	const attention = [];
	for (const line of approvals) {
		const title = formatProgressAttentionTitle(line, params.finalInProgressStatus);
		if (title !== void 0) attention.push({
			id: `${SLACK_ATTENTION_TASK_PREFIX}${resolveLineTaskIdentity(line, contentIdOccurrences)}`,
			title,
			status: "pending"
		});
	}
	const headline = params.title?.trim() || params.label?.trim();
	const newest = tasks.at(-1);
	const title = compactChunkText(headline || (newest?.details ? `${newest.title} — ${newest.details}` : newest?.title) || (params.summaryRow ? "Working" : attention.at(-1)?.title) || SLACK_PROGRESS_PLAN_FALLBACK_TITLE);
	const diffOutput = formatTaskDiffOutput(params.diffStat);
	if (tasks.length === 0 && (params.summaryRow || params.sessionUrl || diffOutput)) tasks.push({
		id: "openclaw_summary",
		title: params.summaryRow ? compactTitle(title) : "Completed",
		status: params.finalInProgressStatus ?? (params.summaryRow ? "in_progress" : "complete")
	});
	tasks.push(...attention);
	if (params.finalInProgressStatus === "error" && !tasks.some((task) => task.status === "in_progress" || task.status === "error")) tasks.push({
		id: "openclaw_attention",
		title: "Failed",
		status: "error"
	});
	if (!headline && tasks.length === 0) return;
	const finalTaskIndex = tasks.length - 1;
	const taskChunks = tasks.map((task, index) => {
		const recovered = params.finalInProgressStatus === "complete" && task.status === "error";
		const chunk = {
			type: "task_update",
			id: task.id,
			title: recovered ? compactTitle(`Recovered: ${task.title}`) : task.title,
			status: recovered ? "complete" : task.status === "in_progress" ? params.finalInProgressStatus ?? task.status : task.status
		};
		if (task.details) chunk.details = task.details;
		if (task.output) chunk.output = task.output;
		if (index === finalTaskIndex && diffOutput) chunk.output = [task.output, diffOutput].filter(Boolean).join(" · ");
		if (index === finalTaskIndex && params.sessionUrl) chunk.sources = buildSessionSources(params.sessionUrl);
		return chunk;
	});
	return [{
		type: "plan_update",
		title
	}, ...taskChunks];
}
function joinRecentProgressRows(rows) {
	const rendered = [];
	let length = 0;
	for (const row of rows.toReversed()) {
		const nextLength = length + row.length + (rendered.length > 0 ? 1 : 0);
		if (nextLength > SLACK_PROGRESS_FIELD_MAX) break;
		rendered.push(row);
		length = nextLength;
	}
	return rendered.toReversed().join("\n");
}
function buildActivityText(lines, maxLineChars) {
	return joinRecentProgressRows(lines.slice(-50).map((line) => {
		return `${`${line.icon ?? "•"} *${renderProgressCardText(line.label, "bold")}*`} — ${activityLineDetail(line, maxLineChars)}`;
	}));
}
function buildSlackProgressCardBlocks(params) {
	const maxLineChars = resolveMaxLineChars(params.maxLineChars, DEFAULT_SLACK_PROGRESS_DETAIL_MAX_CHARS);
	const planLines = formatPlanChecklistLines(params.plan ?? [], {
		maxLines: 50,
		maxLineChars
	});
	const narration = (typeof params.narration === "string" ? [{ text: params.narration }] : params.narration ?? []).map(({ text, format }) => ({
		text: text.replace(/\s+/g, " ").trim(),
		format
	})).filter((part) => part.text);
	const diffStat = formatChannelProgressDraftDiffStat(params.diffStat);
	const workingFooter = [
		...params.toolCalls && params.toolCalls > 0 ? [`🛠️ ${params.toolCalls} tools`] : [],
		...diffStat ? [diffStat] : [],
		...params.elapsedSeconds && params.elapsedSeconds > 0 ? [`⏱ ${params.elapsedSeconds}s`] : []
	].join(" · ");
	const footer = params.state === "working" ? workingFooter : diffStat;
	const icon = params.state === "working" ? "🔄" : params.state === "success" ? "✅" : "❌";
	const finalStatus = params.state === "working" ? void 0 : params.state === "success" ? "complete" : "error";
	const attention = params.lines.flatMap((line) => {
		const title = formatProgressAttentionTitle(line, finalStatus);
		return title === void 0 ? [] : [escapeSlackMrkdwn(title)];
	});
	const sections = [
		planLines.map((line) => renderProgressCardText(line)).join("\n"),
		buildActivityText(params.lines.filter((line) => line.kind !== "approval" && lineTaskStatus(line) !== "error"), maxLineChars),
		joinRecentProgressRows(attention)
	];
	const title = params.title.trim() || "Working";
	const blocks = [
		params.titleFormat === "plain" ? progressTextSection({
			text: `${icon} ${title}`,
			format: "plain"
		}) : {
			type: "section",
			text: field(`${icon} *${renderProgressCardText(title, "bold")}*`)
		},
		...narration.map((part) => progressTextSection(part, "italic")),
		...sections.filter(Boolean).map((text) => ({
			type: "section",
			text: field(text)
		}))
	];
	if (footer) blocks.push({
		type: "context",
		elements: [field(footer)]
	});
	if (params.state !== "working" && params.sessionUrl) blocks.push({
		type: "actions",
		elements: [{
			type: "button",
			action_id: SLACK_SESSION_LINK_ACTION_ID,
			text: {
				type: "plain_text",
				text: "Open in OpenClaw"
			},
			url: params.sessionUrl
		}]
	});
	return blocks.slice(0, 50);
}
const EMPTY_SLACK_NATIVE_STREAM_SNAPSHOT = { tasks: /* @__PURE__ */ new Map() };
const SLACK_TASK_FIELD_SEPARATOR = " · ";
function resolveTaskFieldDelta(previous, incoming) {
	if (!incoming) return {
		field: previous,
		delta: void 0
	};
	if (previous?.rendered.includes(incoming)) return {
		field: {
			rendered: previous.rendered,
			source: incoming
		},
		delta: void 0
	};
	const next = applyAppendOnlyStreamUpdate({
		incoming,
		rendered: previous?.rendered ?? "",
		source: previous?.source ?? "",
		separator: SLACK_TASK_FIELD_SEPARATOR
	});
	const delta = next.changed ? next.rendered.slice(previous?.rendered.length ?? 0) : void 0;
	return {
		field: {
			rendered: next.rendered,
			source: next.source
		},
		delta
	};
}
/**
* Turns a full task snapshot into the delta Slack must receive. Native streams
* key rows by persistent id with no removal chunk: unchanged rows are omitted,
* changed rows carry only their unsent field text, and rows that dropped out
* (plan shrinks, tool-line <-> plan source switches) get a final complete
* update or they linger in_progress forever.
*/
function reconcileSlackNativeTaskChunks(params) {
	const nextTasks = /* @__PURE__ */ new Map();
	let planTitle = params.previous.planTitle;
	const emitted = [];
	for (const chunk of params.chunks ?? []) {
		if (chunk.type === "plan_update") {
			if (chunk.title !== planTitle) {
				planTitle = chunk.title;
				emitted.push(chunk);
			}
			continue;
		}
		if (chunk.type !== "task_update") {
			emitted.push(chunk);
			continue;
		}
		const previousRow = params.previous.tasks.get(chunk.id);
		const details = resolveTaskFieldDelta(previousRow?.details, chunk.details);
		const output = resolveTaskFieldDelta(previousRow?.output, chunk.output);
		const sourcesChanged = Boolean(chunk.sources) && !previousRow?.sourcesSent;
		const row = {
			title: chunk.title,
			status: chunk.status
		};
		if (details.field) row.details = details.field;
		if (output.field) row.output = output.field;
		if (sourcesChanged || previousRow?.sourcesSent) row.sourcesSent = true;
		nextTasks.set(chunk.id, row);
		if (!(!previousRow || previousRow.title !== chunk.title || previousRow.status !== chunk.status || Boolean(details.delta) || Boolean(output.delta) || sourcesChanged)) continue;
		const update = {
			type: "task_update",
			id: chunk.id,
			title: chunk.title,
			status: chunk.status
		};
		if (details.delta) update.details = details.delta;
		if (output.delta) update.output = output.delta;
		if (sourcesChanged) update.sources = chunk.sources;
		emitted.push(update);
	}
	for (const [id, row] of params.previous.tasks) {
		if (nextTasks.has(id)) continue;
		const recovered = row.status === "error" && params.finalStatus === "complete";
		if (row.status === "complete" || row.status === "error" && !recovered) {
			nextTasks.set(id, row);
			continue;
		}
		const title = recovered ? compactTitle(`Recovered: ${row.title}`) : row.title;
		nextTasks.set(id, {
			...row,
			title,
			status: "complete"
		});
		emitted.push({
			type: "task_update",
			id,
			title,
			status: "complete"
		});
	}
	return {
		chunks: emitted.length > 0 ? emitted : void 0,
		snapshot: {
			...planTitle ? { planTitle } : {},
			tasks: nextTasks
		}
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-progress-render.ts
function resolveStructuredProgressLines(lines) {
	return lines.map((line) => {
		if (typeof line !== "string") return line;
		const reasoning = line.startsWith("🧠 ");
		const text = line.replace(/^(?:🧠|💬)\s+/u, "").replace(/^_(.*)_$/su, "$1").trim();
		return {
			...reasoning ? { id: "reasoning" } : {},
			kind: "item",
			text,
			label: reasoning ? "Reasoning" : "Update",
			prefix: false
		};
	});
}
function resolveNativeProgressLines(snapshot) {
	const lines = resolveStructuredProgressLines(snapshot.lines).filter((line) => line.id !== "reasoning" && line.id?.startsWith("commentary:") !== true);
	if (snapshot.plan?.length || !snapshot.planExplanation) return lines;
	const explanationLine = buildChannelProgressDraftLine({
		event: "plan",
		phase: "update",
		explanation: snapshot.planExplanation
	});
	return explanationLine ? [...lines, explanationLine] : lines;
}
function resolveNativeProgressNarration(snapshot) {
	const paragraphs = resolveStructuredProgressLines(snapshot.lines).filter((line) => line.id === "reasoning" || line.id?.startsWith("commentary:") === true).map((line) => line.text.trim()).filter((text, index, values) => Boolean(text) && values.indexOf(text) === index);
	return paragraphs.length > 0 ? paragraphs.join("\n\n") : void 0;
}
function combineProgressHeadlineAndExplanation(headline, explanation) {
	return headline && explanation && headline !== explanation ? `${headline} — ${explanation}` : headline ?? explanation;
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/preview-finalize.ts
function buildExpectedSlackEditText(params) {
	const trimmedText = params.text.trim();
	if (trimmedText) return normalizeSlackOutboundText(trimmedText);
	if (params.blocks?.length) return normalizeSlackOutboundText(buildSlackBlocksFallbackText(params.blocks));
	return " ";
}
function buildAcceptedSlackEditTexts(params) {
	const expected = buildExpectedSlackEditText(params);
	const texts = /* @__PURE__ */ new Set([
		expected,
		normalizeSlackOutboundText(truncateSlackTextByUtf8Bytes(expected, SLACK_EDIT_TEXT_MAX_BYTES)),
		normalizeSlackOutboundText(buildSlackEditTextPayload(params.text, params.blocks))
	]);
	if (params.blocks?.length && hasSlackNativeDataBlock(params.blocks)) {
		const fallbackPlan = buildSlackNativeDataDeliveryPlan({
			baseText: params.text,
			blocks: params.blocks
		});
		for (const message of fallbackPlan.fallbackMessages) texts.add(normalizeSlackOutboundText(message.text));
	}
	return texts;
}
function blocksMatch(expected, actual) {
	if (!expected?.length) return !actual?.length;
	if (!actual?.length) {
		if (!hasSlackNativeDataBlock(expected)) return false;
		return buildSlackNativeDataDeliveryPlan({ blocks: expected }).fallbackMessages.every((message) => !message.blocks?.length);
	}
	if (JSON.stringify(expected) === JSON.stringify(actual)) return true;
	if (!hasSlackNativeDataBlock(expected)) return false;
	try {
		const fallbackPlan = buildSlackNativeDataDeliveryPlan({ blocks: expected });
		const fallbackBlocks = fallbackPlan.fallbackMessages.flatMap((message) => message.blocks ?? []);
		if (JSON.stringify(fallbackBlocks) === JSON.stringify(actual)) return true;
		const fallbackText = fallbackPlan.fallbackMessages.map((message) => message.text).filter(Boolean).join("\n\n");
		const actualText = buildSlackBlocksFallbackText(actual);
		return normalizeSlackOutboundText(actualText) === normalizeSlackOutboundText(fallbackText);
	} catch {
		return false;
	}
}
async function readSlackMessageAfterEditError(params) {
	if (params.threadTs) return ((await params.client.conversations.replies({
		token: params.token,
		channel: params.channelId,
		ts: params.threadTs,
		latest: params.messageId,
		oldest: params.messageId,
		inclusive: true,
		limit: 1
	})).messages ?? []).find((message) => message?.ts === params.messageId) ?? null;
	const message = (await params.client.conversations.history({
		token: params.token,
		channel: params.channelId,
		latest: params.messageId,
		oldest: params.messageId,
		inclusive: true,
		limit: 1
	})).messages?.[0];
	if (!message?.ts || message.ts !== params.messageId) return null;
	return message;
}
async function didSlackPreviewEditApplyAfterError(params) {
	const readback = await readSlackMessageAfterEditError(params);
	if (!readback) return false;
	const expectedText = buildExpectedSlackEditText({
		text: params.text,
		blocks: params.blocks
	});
	const acceptedTexts = buildAcceptedSlackEditTexts({
		text: params.text,
		blocks: params.blocks
	});
	const actualText = normalizeSlackOutboundText((readback.text ?? "").trim());
	if (params.blocks?.length) return acceptedTexts.has(actualText) && blocksMatch(params.blocks, readback.blocks);
	return actualText === expectedText;
}
async function finalizeSlackPreviewEdit(params) {
	try {
		await editSlackRenderedMessage(params.channelId, params.messageId, params.text, {
			token: params.token,
			accountId: params.accountId,
			client: params.client,
			...params.blocks?.length ? { blocks: params.blocks } : {}
		});
	} catch (err) {
		try {
			if (await didSlackPreviewEditApplyAfterError({
				client: params.client,
				token: params.token,
				channelId: params.channelId,
				messageId: params.messageId,
				text: params.text,
				blocks: params.blocks,
				threadTs: params.threadTs
			})) {
				logVerbose(`slack: preview final edit response failed but readback matched message ${params.channelId}/${params.messageId}; suppressing duplicate fallback send`);
				return;
			}
		} catch (readbackErr) {
			logVerbose(`slack: preview final edit readback failed (${String(readbackErr)})`);
		}
		throw err;
	}
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-progress-card.ts
function createSlackDraftProgressCardRuntime(params) {
	const { account, cfg, ctx, prepared, slackClient } = params.setup;
	let latestFallbackText = "";
	let finalStatus;
	const resolveSessionUrl = () => {
		if (cfg.gateway?.controlUi?.enabled === false) return;
		const publicOrigin = resolveGatewayPublicOrigin(cfg);
		if (!publicOrigin) return;
		const url = new URL(publicOrigin);
		const path = buildControlUiSessionPath({
			namespace: "chat",
			sessionKey: prepared.route.sessionKey,
			fallbackAgentId: prepared.route.agentId,
			basePath: cfg.gateway?.controlUi?.basePath
		});
		if (!path) return;
		url.pathname = path;
		return url.toString();
	};
	const resolveText = (snapshot) => latestFallbackText || formatChannelProgressDraftText({
		entry: account.config,
		lines: [...snapshot.lines],
		seed: params.progressSeed,
		formatLine: formatSlackProgressDraftLine,
		narration: snapshot.statusHeadline,
		narrationFormat: snapshot.statusHeadlineFormat,
		plan: snapshot.plan,
		diffStat: snapshot.diffStat
	});
	const resolvePresentation = (snapshot, state) => {
		const title = params.explicitTitle ?? snapshot.statusHeadline ?? "Working";
		const titleFormat = params.explicitTitle ? void 0 : snapshot.statusHeadlineFormat;
		const narration = params.explicitTitle ? snapshot.statusHeadlineFormat === "plain" || snapshot.planExplanationFormat === "plain" ? [...snapshot.statusHeadline && (snapshot.statusHeadline !== snapshot.planExplanation || snapshot.statusHeadlineFormat !== snapshot.planExplanationFormat) ? [{
			text: snapshot.statusHeadline,
			format: snapshot.statusHeadlineFormat
		}] : [], ...snapshot.planExplanation ? [{
			text: snapshot.planExplanation,
			format: snapshot.planExplanationFormat
		}] : []] : combineProgressHeadlineAndExplanation(snapshot.statusHeadline, snapshot.planExplanation) : snapshot.planExplanation && (snapshot.planExplanation !== title || snapshot.planExplanationFormat !== titleFormat) ? [{
			text: snapshot.planExplanation,
			format: snapshot.planExplanationFormat
		}] : void 0;
		const workCounter = state === "working" ? params.progressWorkCounter : void 0;
		const sessionUrl = state === "working" ? void 0 : resolveSessionUrl();
		return buildSlackProgressCardBlocks({
			state,
			title,
			titleFormat,
			narration,
			plan: snapshot.plan,
			lines: resolveStructuredProgressLines(snapshot.lines),
			maxLineChars: params.maxLineChars,
			diffStat: snapshot.diffStat,
			toolCalls: workCounter?.toolCalls,
			elapsedSeconds: workCounter?.elapsedSeconds,
			sessionUrl
		});
	};
	const finalize = async (status, snapshot = params.getSnapshot(), fallbackText = resolveText(snapshot)) => {
		if (!params.draftStream || !params.enabled) return false;
		await params.draftStream.dropDetachedMessages();
		const terminalStatus = finalStatus === "error" || status === "error" ? "error" : "success";
		if (finalStatus === terminalStatus) return true;
		await params.draftStream.flush();
		const channelId = params.draftStream.channelId();
		const messageId = params.draftStream.messageId();
		if (!channelId || !messageId) return false;
		await params.draftStream.seal();
		try {
			const finalized = await params.draftStream.finalizeMessage(messageId, async () => {
				await finalizeSlackPreviewEdit({
					client: slackClient,
					token: ctx.botToken,
					accountId: account.accountId,
					channelId,
					messageId,
					text: fallbackText,
					blocks: resolvePresentation(snapshot, terminalStatus),
					threadTs: params.getThreadTs()
				});
			});
			if (finalized) finalStatus = terminalStatus;
			return finalized;
		} catch (err) {
			logVerbose(`slack: progress card final edit failed (${formatSlackError(err)})`);
			return false;
		}
	};
	return {
		resolveSessionUrl,
		resolveText,
		resolvePresentation,
		finalize,
		get hasTerminalized() {
			return finalStatus !== void 0;
		},
		setFallbackText(text) {
			latestFallbackText = text;
		},
		reset() {
			latestFallbackText = "";
			finalStatus = void 0;
		}
	};
}
function formatSlackProgressDraftLine(line) {
	if (/^(?:🧠|💬)\s/u.test(line)) return line;
	const italicCommentary = /^_(.*)_$/su.exec(line);
	if (!italicCommentary) return escapeSlackMrkdwn(line);
	return `_${normalizeSlackOutboundText(italicCommentary[1], {
		mentions: "escape",
		enclosingStyle: "italic"
	})}_`;
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-progress-native.ts
function createSlackNativeProgressTransport(params) {
	const { ctx, message, replyPlan, slackClient, slackIdentity, slackStreamFallbackTeamId } = params.setup;
	const { delivery } = params;
	const markDelivered = (threadTs) => {
		if (!delivery.streamSession?.delivered) return false;
		delivery.observedReplyDelivery = true;
		if (threadTs) {
			delivery.usedReplyThreadTs ??= threadTs;
			delivery.rememberDeliveredThreadTs("block", threadTs);
		}
		return true;
	};
	const waitForStart = async () => {
		if (delivery.streamSession || !delivery.nativeProgressStreamStartPromise) return true;
		try {
			await delivery.nativeProgressStreamStartPromise;
		} catch {
			delivery.streamFailed = true;
			return false;
		}
		return !delivery.streamFailed;
	};
	const start = async (update) => {
		const streamThreadTs = replyPlan.nextThreadTs();
		if (!streamThreadTs) {
			logVerbose("slack-stream: no reply thread target for native progress stream start, falling back");
			delivery.streamFailed = true;
			return false;
		}
		delivery.nativeProgressStreamThreadTs = streamThreadTs;
		const startPromise = (async () => {
			const session = await startSlackStream({
				client: slackClient,
				clientOptions: params.setup.slackClientOptions,
				channel: message.channel,
				threadTs: streamThreadTs,
				...update.text ? { text: update.text } : {},
				...update.chunks?.length ? { chunks: update.chunks } : {},
				taskDisplayMode: "plan",
				...slackIdentity ? { identity: slackIdentity } : {},
				teamId: await resolveSlackStreamRecipientTeamId({
					client: slackClient,
					token: ctx.botToken,
					userId: message.user,
					fallbackTeamId: slackStreamFallbackTeamId
				}),
				userId: message.user
			});
			delivery.streamSession = session;
			return session;
		})();
		delivery.nativeProgressStreamStartPromise = startPromise;
		try {
			if (!await startPromise) return false;
			const delivered = markDelivered(streamThreadTs);
			return update.chunks?.length ? delivered : true;
		} finally {
			if (delivery.nativeProgressStreamStartPromise === startPromise) delivery.nativeProgressStreamStartPromise = null;
		}
	};
	const append = async (update) => {
		const session = delivery.streamSession;
		if (!session) return false;
		await appendSlackStream({
			session,
			...update.text ? { text: update.text } : {},
			...update.chunks?.length ? { chunks: update.chunks } : {}
		});
		const delivered = markDelivered(delivery.nativeProgressStreamThreadTs);
		return update.chunks?.length ? delivered : true;
	};
	return {
		append,
		start,
		waitForStart
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-progress.ts
function createSlackProgressRuntime(runtimeParams) {
	const { setup, delivery } = runtimeParams;
	const { account, cfg, ctx, hasSlackCustomIdentity, message, prepared, replyPlan, runtime, slackClient, slackIdentity, slackMessageMetadata, slackStreaming, shouldUseDraftStream, useStreaming, previewStreamingEnabled } = setup;
	const draftStream = shouldUseDraftStream ? createSlackDraftStream({
		target: prepared.replyTarget,
		cfg,
		token: ctx.botToken,
		accountId: account.accountId,
		conversationChannelId: message.channel,
		eventScope: prepared.eventScope,
		...!hasSlackCustomIdentity && slackIdentity ? { identity: slackIdentity } : {},
		...slackMessageMetadata ? { metadata: slackMessageMetadata } : {},
		maxChars: Math.min(ctx.textLimit, SLACK_TEXT_LIMIT),
		resolveThreadTs: () => {
			const ts = replyPlan.peekThreadTs();
			if (ts) delivery.usedReplyThreadTs ??= ts;
			return ts;
		},
		log: logVerbose,
		warn: logVerbose
	}) : void 0;
	const isProgressMode = slackStreaming.mode === "progress";
	const useNativeProgressStreaming = useStreaming && slackStreaming.mode === "progress";
	const progressDraftActive = Boolean(draftStream) || useNativeProgressStreaming;
	const previewToolProgressEnabled = progressDraftActive && resolveChannelStreamingPreviewToolProgress(account.config, slackStreaming.mode !== "progress", slackStreaming.mode);
	let shouldYieldDraftProgress = () => false;
	const suppressDefaultToolProgressMessages = resolveChannelStreamingSuppressDefaultToolProgressMessages(account.config, {
		draftStreamActive: Boolean(draftStream) || useNativeProgressStreaming,
		mode: slackStreaming.mode,
		previewToolProgressEnabled,
		previewStreamingEnabled
	});
	let nativeStreamSnapshot = EMPTY_SLACK_NATIVE_STREAM_SNAPSHOT;
	let appendRenderedText = "";
	let appendSourceText = "";
	let nativeProgressCompletionSent = false;
	let nativeProgressTerminalStatus = "complete";
	let nativeNarrationRenderedText = "";
	let nativeNarrationSourceText = "";
	let nativeStreamOrder = Promise.resolve();
	const withNativeStreamOrder = (task) => {
		const run = nativeStreamOrder.then(task, task);
		nativeStreamOrder = run.catch(() => void 0);
		return run;
	};
	const progressWorkCounter = createChannelProgressWorkCounter();
	const progressSeed = `${account.accountId}:${message.channel}`;
	const slackProgressStyle = resolveSlackProgressStyle(account.config);
	const preambleOnlyProgress = isProgressMode && slackProgressStyle === "compact" && !previewToolProgressEnabled;
	const useDraftProgressCard = Boolean(draftStream) && isProgressMode && slackProgressStyle === "card";
	const explicitProgressTitle = resolveExplicitSlackProgressTitle(account.config);
	const progressDraftMaxLineChars = resolveChannelProgressDraftMaxLineChars(account.config);
	const progressCard = createSlackDraftProgressCardRuntime({
		setup: {
			account,
			cfg,
			ctx,
			prepared,
			slackClient
		},
		draftStream,
		enabled: useDraftProgressCard,
		progressWorkCounter: previewToolProgressEnabled ? progressWorkCounter : void 0,
		progressSeed,
		explicitTitle: explicitProgressTitle,
		maxLineChars: progressDraftMaxLineChars,
		getSnapshot: () => progressDraft.getSnapshot(),
		getThreadTs: () => delivery.usedReplyThreadTs
	});
	const nativeTransport = createSlackNativeProgressTransport({
		setup,
		delivery
	});
	const dropDetachedProgressCards = async () => {
		if (!useDraftProgressCard) return;
		await draftStream?.dropDetachedMessages();
	};
	const appendNativeProgressCompletion = async (isError) => {
		const session = delivery.streamSession;
		if (isError) nativeProgressTerminalStatus = "error";
		if (!session || nativeProgressCompletionSent) return;
		const chunks = buildNativeProgressCompletionChunks(isError ? "error" : "complete");
		const narrationUpdate = resolveNarrationUpdate(resolveNativeProgressNarration(progressDraft.getSnapshot()));
		if (!chunks?.length && !narrationUpdate.delta) return;
		try {
			await appendSlackStream({
				session,
				chunks
			});
			if (narrationUpdate.next.changed) {
				nativeNarrationRenderedText = narrationUpdate.next.rendered;
				nativeNarrationSourceText = narrationUpdate.next.source;
			}
			nativeProgressCompletionSent = true;
			delivery.observedReplyDelivery ||= session.delivered;
		} catch (err) {
			delivery.streamFailed = true;
			runtime.error?.(danger(`slack-stream: native progress completion failed: ${formatSlackError(err)}`));
		}
	};
	const resolveNativeProgressTitle = (snapshot) => combineProgressHeadlineAndExplanation(explicitProgressTitle ?? snapshot.statusHeadline, snapshot.planExplanation);
	const normalizeProgressText = (text) => text?.replace(/\s+/gu, " ").trim() ?? "";
	const isRenderedAsProgressTitle = (text) => {
		const candidate = normalizeProgressText(text);
		if (!candidate) return false;
		const snapshot = progressDraft.getSnapshot();
		const title = normalizeProgressText(combineProgressHeadlineAndExplanation(explicitProgressTitle ?? (snapshot.statusHeadlineFormat === "plain" ? void 0 : snapshot.statusHeadline), snapshot.planExplanationFormat === "plain" ? void 0 : snapshot.planExplanation));
		return title.length > 0 && title.includes(candidate);
	};
	const resolveNarrationUpdate = (incoming) => {
		const next = applyAppendOnlyStreamUpdate({
			incoming: incoming ?? "",
			rendered: nativeNarrationRenderedText,
			source: nativeNarrationSourceText
		});
		return {
			next,
			delta: next.changed ? next.rendered.slice(nativeNarrationRenderedText.length) : ""
		};
	};
	const updateNativeProgressStreamNow = async () => {
		const snapshot = progressDraft.getSnapshot();
		const narrationUpdate = resolveNarrationUpdate(resolveNativeProgressNarration(snapshot));
		if (!useNativeProgressStreaming || delivery.streamFailed || nativeUpdatesStopped) return false;
		if (!await nativeTransport.waitForStart()) return false;
		const reconciled = reconcileSlackNativeTaskChunks({
			previous: nativeStreamSnapshot,
			chunks: buildSlackProgressStreamChunks({
				title: resolveNativeProgressTitle(snapshot),
				lines: resolveNativeProgressLines(snapshot),
				plan: snapshot.plan,
				maxLineChars: progressDraftMaxLineChars,
				summaryRow: !previewToolProgressEnabled
			})
		});
		const chunks = reconciled.chunks;
		if (!chunks?.length && !narrationUpdate.delta) return false;
		try {
			const hadSession = Boolean(delivery.streamSession);
			const streamUpdate = {
				...narrationUpdate.delta ? { text: narrationUpdate.delta } : {},
				...chunks?.length ? { chunks } : {}
			};
			if (!(hadSession ? await nativeTransport.append(streamUpdate) : await nativeTransport.start(streamUpdate))) return false;
			if (!hadSession) replyPlan.markSent();
			if (narrationUpdate.next.changed) {
				nativeNarrationRenderedText = narrationUpdate.next.rendered;
				nativeNarrationSourceText = narrationUpdate.next.source;
			}
			if (chunks?.length) nativeStreamSnapshot = reconciled.snapshot;
			return true;
		} catch (err) {
			runtime.error?.(danger(`slack-stream: native progress stream failed: ${formatSlackError(err)}, falling back`));
			delivery.streamFailed = true;
			return false;
		}
	};
	let nativeUpdatesStopped = false;
	const nativeUpdates = createDraftStreamLoop({
		throttleMs: 1e3,
		coalesceInFlight: true,
		emptyValue: false,
		isEmpty: (pending) => !pending,
		isStopped: () => nativeUpdatesStopped,
		sendOrEditStreamMessage: () => withNativeStreamOrder(updateNativeProgressStreamNow),
		onBackgroundFlushError: (err) => runtime.error?.(danger(`slack-stream: progress update failed: ${formatSlackError(err)}`))
	});
	const cancelNativeUpdates = async () => {
		nativeUpdatesStopped = true;
		nativeUpdates.stop();
		await nativeUpdates.waitForInFlight();
	};
	const appendNativeNarration = (payload, kind) => withNativeStreamOrder(() => appendNativeNarrationNow(payload, kind));
	const appendNativeNarrationNow = async (payload, kind) => {
		if (isRenderedAsProgressTitle(payload.text)) return { visibleReplySent: false };
		const narrationUpdate = resolveNarrationUpdate(payload.text?.trimEnd());
		if (!narrationUpdate.delta) return { visibleReplySent: false };
		const result = await delivery.deliverWithStreaming({
			payload,
			kind,
			streamText: narrationUpdate.delta,
			appendSeparator: false,
			taskDisplayMode: "plan"
		});
		if (result.visibleReplySent && !delivery.streamFailed) {
			nativeNarrationRenderedText = narrationUpdate.next.rendered;
			nativeNarrationSourceText = narrationUpdate.next.source;
		}
		return result;
	};
	const resetProgressTurnState = () => {
		progressWorkCounter.reset();
		nativeNarrationRenderedText = "";
		nativeNarrationSourceText = "";
	};
	const progressDraft = createChannelProgressDraftCompositor({
		preparedItems: true,
		entry: account.config,
		mode: slackStreaming.mode,
		active: progressDraftActive,
		seed: progressSeed,
		formatLine: formatSlackProgressDraftLine,
		reasoningLinePrefix: "🧠 ",
		reasoningGate: !preambleOnlyProgress,
		updateOnLineChange: useNativeProgressStreaming || useDraftProgressCard || preambleOnlyProgress,
		update: async (previewText, options) => {
			if (useNativeProgressStreaming) {
				const priorSnapshot = nativeStreamSnapshot;
				const priorNarration = nativeNarrationRenderedText;
				nativeUpdates.update(true);
				if (options?.flush) await nativeUpdates.flush();
				else await nativeUpdates.waitForInFlight();
				return priorSnapshot !== nativeStreamSnapshot || priorNarration !== nativeNarrationRenderedText;
			}
			if (!draftStream) return false;
			const snapshot = options.snapshot;
			const latestLine = snapshot.lines.at(-1);
			if (preambleOnlyProgress && typeof latestLine === "object" && latestLine.complete === false) return false;
			progressCard.setFallbackText(previewText);
			draftStream.update(preambleOnlyProgress ? {
				text: previewText,
				allowNewMessage: typeof latestLine !== "object" || latestLine.complete !== false,
				...snapshot.preparedBlocks ? { blocks: buildSlackProgressTextBlocks(snapshot.preparedBlocks) } : {}
			} : useDraftProgressCard ? {
				text: previewText,
				blocks: progressCard.resolvePresentation(snapshot, "working")
			} : snapshot.preparedBlocks ? {
				text: previewText,
				blocks: buildSlackProgressTextBlocks(snapshot.preparedBlocks)
			} : previewText);
			if (options?.flush) await draftStream.flush();
			return Boolean(draftStream.messageId() && draftStream.channelId());
		},
		deleteCurrent: async () => {
			if (useNativeProgressStreaming) {
				nativeUpdates.update(true);
				await nativeUpdates.flush();
			} else {
				await draftStream?.clear();
				draftStream?.forceNewMessage();
			}
		}
	});
	const previewLifecycle = createLivePreviewLifecycle({
		draft: draftStream && !useDraftProgressCard ? {
			flush: draftStream.flush,
			discardPending: draftStream.discardPending,
			seal: draftStream.seal,
			id: () => {
				const channelId = draftStream.channelId();
				const messageId = draftStream.messageId();
				return channelId && messageId ? {
					channelId,
					messageId
				} : void 0;
			},
			clear: async () => {
				await draftStream.clear({ preserveHumanReplies: !isProgressMode && previewLifecycle.finalDelivered });
			}
		} : void 0,
		cleanupUndelivered: true,
		onFinalStarted: () => progressDraft.markFinalReplyStarted(),
		onFinalDelivered: () => progressDraft.markFinalReplyDelivered(),
		onCleanupFailure: (error) => logVerbose(`slack: progress preview cleanup failed (${formatSlackError(error)})`)
	});
	const commentaryProgressEnabled = progressDraft.commentaryProgressEnabled;
	const deliverNativeFinal = async (payload, kind) => {
		await cancelNativeUpdates();
		return await withNativeStreamOrder(() => deliverNativeFinalNow(payload, kind));
	};
	const deliverNativeFinalNow = async (payload, kind) => {
		const streamReady = await nativeTransport.waitForStart();
		const finalThreadTs = delivery.streamSession?.threadTs ?? delivery.nativeProgressStreamThreadTs;
		if (payload.isError !== true && streamReady && Boolean(delivery.streamSession) && delivery.isStreamingEligible(payload, { maxTextBytes: 4e3 })) {
			await appendNativeProgressCompletion(false);
			return await delivery.deliverWithStreaming({
				payload,
				kind
			});
		}
		const result = await delivery.deliverNormally({
			payload,
			kind,
			forcedThreadTs: finalThreadTs
		});
		await appendNativeProgressCompletion(payload.isError === true);
		return result;
	};
	const buildNativeProgressCompletionChunks = (finalInProgressStatus) => {
		const snapshot = progressDraft.getSnapshot();
		const lines = resolveNativeProgressLines(snapshot);
		const sessionUrl = progressCard.resolveSessionUrl();
		const narrationUpdate = resolveNarrationUpdate(resolveNativeProgressNarration(snapshot));
		const hasRetirableNativeTasks = [...nativeStreamSnapshot.tasks.values()].some((task) => task.status !== "complete" && task.status !== "error");
		if (lines.length === 0 && !snapshot.plan?.length && !hasRetirableNativeTasks && !snapshot.diffStat && !narrationUpdate.delta && !sessionUrl) return;
		const completion = reconcileSlackNativeTaskChunks({
			previous: nativeStreamSnapshot,
			finalStatus: finalInProgressStatus,
			chunks: buildSlackProgressStreamChunks({
				title: resolveNativeProgressTitle(snapshot) ?? (lines.length === 0 && !snapshot.plan?.length ? "Working" : void 0),
				lines,
				plan: snapshot.plan,
				maxLineChars: progressDraftMaxLineChars,
				summaryRow: !previewToolProgressEnabled,
				finalInProgressStatus,
				diffStat: snapshot.diffStat,
				sessionUrl
			})
		}).chunks;
		return narrationUpdate.delta ? [{
			type: "markdown_text",
			text: narrationUpdate.delta
		}, ...completion ?? []] : completion;
	};
	const finishNativeProgressTurn = async (completionChunks) => {
		if (delivery.nativeProgressStreamStartPromise) await delivery.nativeProgressStreamStartPromise.catch(() => null);
		if (completionChunks?.length) nativeProgressCompletionSent = true;
		await delivery.finishStream(completionChunks);
		delivery.streamSession = null;
		delivery.nativeProgressStreamStartPromise = null;
		delivery.nativeProgressStreamThreadTs = void 0;
		delivery.streamFailed = false;
	};
	const pushPlanProgress = async (steps, explanation, explanationFormat) => {
		if (isProgressMode && slackProgressStyle === "compact") return false;
		return await progressDraft.pushPlanProgress(steps, {
			explanation,
			explanationFormat
		});
	};
	const updateDraftFromPartial = (text) => {
		const trimmed = text && sanitizeAssistantVisibleText(text).trimEnd();
		if (!trimmed) return false;
		if (slackStreaming.mode === "block") {
			progressDraft.resetActivity({ suppressed: true });
			const next = applyAppendOnlyStreamUpdate({
				incoming: trimmed,
				rendered: appendRenderedText,
				source: appendSourceText
			});
			appendRenderedText = next.rendered;
			appendSourceText = next.source;
			if (!next.changed) return false;
			draftStream?.update(next.rendered);
			return false;
		}
		if (isProgressMode) return false;
		progressDraft.resetActivity({ suppressed: true });
		draftStream?.update(trimmed);
		return false;
	};
	const pushReasoningProgress = async (payload) => {
		if (!payload?.text) return false;
		if (!isProgressMode) {
			const normalized = progressDraft.mergeReasoningProgress(payload.text, { snapshot: payload.isReasoningSnapshot === true }).replace(/^_(.*)_$/su, "$1").trim();
			if (!normalized) return false;
			const visible = await progressDraft.pushToolProgress({
				id: "reasoning",
				kind: "item",
				text: normalized,
				label: "Reasoning"
			});
			progressDraft.mergeReasoningProgress(normalized, { snapshot: true });
			return visible;
		}
		return await progressDraft.pushReasoningProgress(payload.text, { snapshot: payload.isReasoningSnapshot === true });
	};
	const resetDraftDeliveryState = () => {
		appendRenderedText = "";
		appendSourceText = "";
	};
	const beginNewProgressTurn = async (options) => {
		if (useNativeProgressStreaming) {
			if (!nativeUpdatesStopped && options?.force !== true) return false;
			await cancelNativeUpdates();
		}
		const priorSnapshot = progressDraft.getSnapshot();
		const priorFallbackText = progressCard.resolveText(priorSnapshot);
		const completionChunks = useNativeProgressStreaming && !nativeProgressCompletionSent ? buildNativeProgressCompletionChunks(nativeProgressTerminalStatus) : void 0;
		if (!progressDraft.beginNewTurn(options)) return false;
		if (useNativeProgressStreaming) await finishNativeProgressTurn(completionChunks);
		else {
			await progressCard.finalize("success", priorSnapshot, priorFallbackText);
			await previewLifecycle.cleanup();
			draftStream?.forceNewMessage();
			await dropDetachedProgressCards();
		}
		resetProgressTurnState();
		nativeStreamSnapshot = EMPTY_SLACK_NATIVE_STREAM_SNAPSHOT;
		nativeProgressCompletionSent = false;
		nativeProgressTerminalStatus = "complete";
		nativeUpdatesStopped = false;
		nativeUpdates.resetThrottleWindow();
		progressCard.reset();
		previewLifecycle.reset();
		delivery.resetDeliveryTracker();
		return true;
	};
	const onDraftBoundary = !shouldUseDraftStream && !useNativeProgressStreaming ? void 0 : async () => {
		if (isProgressMode) {
			await beginNewProgressTurn();
			progressDraft.beginAssistantMessage();
			return;
		}
		resetDraftDeliveryState();
		progressDraft.beginAssistantMessage();
	};
	const onQueuedFollowupAdmitted = !shouldUseDraftStream && !useNativeProgressStreaming ? void 0 : async () => {
		await draftStream?.flush();
		if (isProgressMode) await beginNewProgressTurn({ force: true });
		else {
			await previewLifecycle.cleanup();
			previewLifecycle.reset();
			draftStream?.forceNewMessage();
		}
		delivery.resetDeliveryTracker();
		resetDraftDeliveryState();
		progressDraft.reset();
	};
	const onQueuedFollowupSettled = !draftStream && !useNativeProgressStreaming ? void 0 : async () => {
		if (useNativeProgressStreaming) {
			progressDraft.markFinalReplyStarted();
			await cancelNativeUpdates();
			await finishNativeProgressTurn(nativeProgressCompletionSent ? void 0 : buildNativeProgressCompletionChunks(nativeProgressTerminalStatus));
			return;
		}
		if (!useDraftProgressCard) {
			progressDraft.markFinalReplyStarted();
			await previewLifecycle.cleanup();
			return;
		}
		if (!progressCard.hasTerminalized) await draftStream?.clear();
		await dropDetachedProgressCards();
	};
	return {
		draftStream,
		previewLifecycle,
		isProgressMode,
		useDraftProgressCard,
		useNativeProgressStreaming,
		progressDraftActive,
		previewToolProgressEnabled,
		preambleOnlyProgress,
		suppressDefaultToolProgressMessages,
		progressDraft,
		progressWorkCounter,
		commentaryProgressEnabled,
		async cancel() {
			progressDraft.cancel();
			await cancelNativeUpdates();
		},
		get nativeProgressCompletionSent() {
			return nativeProgressCompletionSent;
		},
		set nativeProgressCompletionSent(value) {
			nativeProgressCompletionSent = value;
		},
		get nativeProgressTerminalStatus() {
			return nativeProgressTerminalStatus;
		},
		appendNativeNarration,
		buildNativeProgressCompletionChunks,
		deliverNativeFinal,
		dropDetachedProgressCards,
		finalizeDraftProgressCard: progressCard.finalize,
		onDraftBoundary,
		onQueuedFollowupAdmitted,
		onQueuedFollowupSettled,
		pushPlanProgress,
		pushReasoningProgress,
		updateDraftFromPartial,
		setShouldYieldDraftProgress: (value) => {
			shouldYieldDraftProgress = value;
		},
		shouldYieldDraftProgress: () => shouldYieldDraftProgress()
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-setup.ts
async function createSlackDispatchSetup(prepared) {
	const { ctx, account, message, route } = prepared;
	const slackClient = prepared.eventScope?.client ?? ctx.app.client;
	const slackClientOptions = {
		...ctx.app.webClientOptions,
		...prepared.eventScope ? { teamId: prepared.eventScope.teamId } : {}
	};
	const slackStreamFallbackTeamId = prepared.eventScope?.teamId ?? ctx.teamId;
	const cfg = ctx.cfg;
	const runtime = ctx.runtime;
	const outboundIdentity = resolveAgentOutboundIdentity(cfg, route.agentId);
	const slackIdentity = outboundIdentity ? {
		username: outboundIdentity.name,
		iconUrl: outboundIdentity.avatarUrl,
		iconEmoji: outboundIdentity.emoji
	} : prepared.relayIdentity;
	if (prepared.isDirectMessage) {
		const sessionCfg = cfg.session;
		const storePath = resolveStorePath(sessionCfg?.store, { agentId: route.agentId });
		const pinnedMainDmOwner = resolvePinnedMainDmOwnerFromAllowlist({
			dmScope: cfg.session?.dmScope,
			allowFrom: ctx.allowFrom,
			normalizeEntry: normalizeSlackAllowOwnerEntry
		});
		const senderRecipient = normalizeOptionalLowercaseString(message.user);
		const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
			route,
			sessionKey: prepared.ctxPayload.SessionKey ?? route.sessionKey
		});
		if (inboundLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner && senderRecipient && normalizeOptionalLowercaseString(pinnedMainDmOwner) !== senderRecipient) logVerbose(`slack: skip main-session last route for ${senderRecipient} (pinned owner ${pinnedMainDmOwner})`);
		else await updateLastRoute({
			storePath,
			sessionKey: inboundLastRouteSessionKey,
			deliveryContext: {
				channel: "slack",
				to: prepared.ctxPayload.OriginatingTo ?? prepared.ctxPayload.To ?? `user:${message.user}`,
				accountId: route.accountId,
				threadId: prepared.ctxPayload.MessageThreadId ?? prepared.ctxPayload.TransportThreadId
			},
			ctx: prepared.ctxPayload
		});
	}
	const threadTargets = resolveSlackThreadTargets({
		message,
		replyToMode: prepared.replyToMode
	});
	const forcedReplyThreadTs = prepared.forcedReplyThreadTs;
	const slackMessageMetadata = prepared.slackMessageMetadata;
	const statusThreadTs = forcedReplyThreadTs ?? threadTargets.statusThreadTs;
	const isThreadReply = threadTargets.isThreadReply;
	const replyDeliveryMode = forcedReplyThreadTs ? "off" : prepared.replyToMode;
	const sourceReplyDeliveryMode = resolveChannelMessageSourceReplyDeliveryMode({
		cfg,
		ctx: prepared.ctxPayload
	});
	const sourceRepliesAreToolOnly = sourceReplyDeliveryMode === "message_tool_only";
	const suppressRoomEventTyping = prepared.ctxPayload.InboundEventKind === "room_event";
	const messageSentHookTarget = prepared.ctxPayload.OriginatingTo ?? prepared.ctxPayload.To ?? prepared.replyTarget;
	const messageSentHookContext = {
		sessionKeyForInternalHooks: prepared.ctxPayload.SessionKey ?? route.sessionKey,
		isGroup: prepared.isRoomish,
		groupId: prepared.isRoomish ? message.channel : void 0
	};
	const messageSentDeliveryHookContext = {
		...messageSentHookContext,
		messageSentHookTarget
	};
	const reactionMessageTs = prepared.ackReactionMessageTs;
	const messageTs = message.ts ?? message.event_ts;
	const incomingThreadTs = message.thread_ts;
	let didSetStatus = false;
	let statusWasSet = false;
	let didAddTypingReaction = false;
	const statusReactionsEnabled = prepared.ctxPayload.InboundEventKind !== "room_event" && Boolean(prepared.ackReactionPromise) && Boolean(reactionMessageTs) && cfg.messages?.statusReactions?.enabled === true;
	const statusReactions = createStatusReactionController({
		enabled: statusReactionsEnabled,
		adapter: {
			setReaction: async (emoji) => {
				await reactSlackMessage(message.channel, reactionMessageTs ?? "", emoji, {
					token: ctx.botToken,
					client: slackClient
				});
			},
			removeReaction: async (emoji) => {
				await removeSlackReaction(message.channel, reactionMessageTs ?? "", emoji, {
					token: ctx.botToken,
					client: slackClient
				});
			}
		},
		initialEmoji: prepared.ackReactionValue || "eyes",
		presentation: "acknowledgement",
		onError: (err) => {
			logAckFailure({
				log: logVerbose,
				channel: "slack",
				target: `${message.channel}/${message.ts}`,
				error: err
			});
		}
	});
	if (statusReactionsEnabled) statusReactions.setQueued();
	const hasRepliedRef = { value: false };
	const replyPlan = createSlackReplyDeliveryPlan({
		replyToMode: replyDeliveryMode,
		incomingThreadTs: forcedReplyThreadTs ?? incomingThreadTs,
		messageTs,
		hasRepliedRef,
		isThreadReply: Boolean(forcedReplyThreadTs) || isThreadReply
	});
	const typingTarget = statusThreadTs ? `${message.channel}/${statusThreadTs}` : message.channel;
	const typingReaction = ctx.typingReaction;
	const threadStatusGate = { hasVisibleOutput: () => false };
	const { onModelSelected, ...replyPipeline } = createChannelMessageReplyPipeline({
		cfg,
		agentId: route.agentId,
		channel: "slack",
		accountId: route.accountId,
		transformReplyPayload: sanitizeSlackMonitorReplyPayload,
		typing: {
			start: async () => {
				if (!didSetStatus && !threadStatusGate.hasVisibleOutput()) {
					didSetStatus = true;
					statusWasSet = await ctx.setSlackSessionStatus({
						channelId: message.channel,
						threadTs: statusThreadTs,
						status: "processing",
						title: prepared.sessionDisplayName ?? prepared.ctxPayload.ThreadLabel,
						eventScope: prepared.eventScope
					});
				}
				if (typingReaction && message.ts) {
					didAddTypingReaction = true;
					await reactSlackMessage(message.channel, message.ts, typingReaction, {
						token: ctx.botToken,
						client: slackClient
					}).catch((err) => {
						logVerbose(`slack send: typing reaction failed: ${formatSlackError(err)}`);
					});
				}
			},
			stop: async () => {
				if (didSetStatus) {
					didSetStatus = false;
					const reportFailure = statusWasSet;
					statusWasSet = false;
					const restored = await ctx.setSlackSessionStatus({
						channelId: message.channel,
						threadTs: statusThreadTs,
						status: "active",
						eventScope: prepared.eventScope
					});
					if (reportFailure && !restored) try {
						runtime.error?.("Slack session status could not return to active after processing. Enable verbose logging to inspect the Slack API failure.");
					} catch {}
				}
				if (didAddTypingReaction && typingReaction && message.ts) {
					didAddTypingReaction = false;
					await removeSlackReaction(message.channel, message.ts, typingReaction, {
						token: ctx.botToken,
						client: slackClient
					}).catch((err) => {
						logVerbose(`slack send: typing reaction removal failed: ${formatSlackError(err)}`);
					});
				}
			},
			onStartError: (err) => {
				logTypingFailure({
					log: (messageValue) => runtime.error?.(danger(messageValue)),
					channel: "slack",
					action: "start",
					target: typingTarget,
					error: err
				});
			},
			onStopError: (err) => {
				logTypingFailure({
					log: (messageLocal) => runtime.error?.(danger(messageLocal)),
					channel: "slack",
					action: "stop",
					target: typingTarget,
					error: err
				});
			}
		}
	});
	const slackStreaming = resolveSlackStreamingConfig({ streaming: account.config.streaming });
	const streamThreadHint = forcedReplyThreadTs ?? resolveSlackStreamingThreadHint({
		replyToMode: replyDeliveryMode,
		incomingThreadTs,
		messageTs,
		isThreadReply
	});
	const hookRunner = getGlobalHookRunner();
	const modifyingHooksRegistered = (hookRunner?.hasHooks("reply_payload_sending") ?? false) || (hookRunner?.hasHooks("message_sending") ?? false);
	const allowPreHookProviderStreaming = !prepared.ctxPayload.GroupThread && !modifyingHooksRegistered;
	const previewStreamingEnabled = allowPreHookProviderStreaming && !sourceRepliesAreToolOnly && slackStreaming.mode !== "off";
	const hasSlackCustomIdentity = Boolean(slackIdentity?.username || slackIdentity?.iconUrl || slackIdentity?.iconEmoji);
	const useStreaming = shouldUseStreaming({
		streamingEnabled: !prepared.ctxPayload.GroupThread && !sourceRepliesAreToolOnly && (allowPreHookProviderStreaming || slackStreaming.mode !== "progress") && isSlackStreamingEnabled({
			mode: slackStreaming.mode,
			nativeStreaming: slackStreaming.nativeStreaming,
			nativeProgressTaskCards: resolveSlackNativeProgressTaskCards(account.config)
		}),
		threadTs: streamThreadHint
	});
	const shouldUseDraftStream = previewStreamingEnabled && !useStreaming;
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config);
	return {
		prepared,
		ctx,
		account,
		message,
		route,
		slackClient,
		slackClientOptions,
		slackStreamFallbackTeamId,
		cfg,
		runtime,
		slackIdentity,
		forcedReplyThreadTs,
		slackMessageMetadata,
		statusThreadTs,
		isThreadReply,
		replyDeliveryMode,
		sourceReplyDeliveryMode,
		sourceRepliesAreToolOnly,
		suppressRoomEventTyping,
		messageSentHookTarget,
		messageSentHookContext,
		messageSentDeliveryHookContext,
		incomingThreadTs,
		messageTs,
		statusReactionsEnabled,
		statusReactions,
		hasRepliedRef,
		threadStatusGate,
		replyPlan,
		onModelSelected,
		replyPipeline,
		slackStreaming,
		streamThreadHint,
		previewStreamingEnabled,
		hasSlackCustomIdentity,
		shouldUseDraftStream,
		disableBlockStreaming: sourceRepliesAreToolOnly ? true : resolveSlackDisableBlockStreaming({
			useStreaming,
			shouldUseDraftStream,
			blockStreamingEnabled
		}),
		useStreaming
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch-streaming.ts
function createSlackStreamingDeliveryRuntime(setup) {
	const { account, ctx, forcedReplyThreadTs, isThreadReply, message, messageSentDeliveryHookContext, messageSentHookContext, messageSentHookTarget, prepared, replyDeliveryMode, replyPlan, runtime, slackClient, slackClientOptions, slackIdentity, slackMessageMetadata, slackStreamFallbackTeamId } = setup;
	const state = {
		streamSession: null,
		nativeProgressStreamStartPromise: null,
		nativeProgressStreamThreadTs: void 0,
		streamFailed: false,
		usedReplyThreadTs: void 0,
		usedBlockReplyThreadTs: void 0,
		observedReplyDelivery: false
	};
	const emitStreamedDelivery = (content, result) => {
		emitSlackMessageSentHooks({
			...messageSentHookContext,
			to: messageSentHookTarget,
			accountId: account.accountId,
			content,
			...result
		});
	};
	let deliveryTracker = createSlackEventDeliveryTracker();
	const markPreviewPayloadDelivered = (params) => {
		const preparedReply = prepareSlackReply(params.payload);
		deliveryTracker.markDelivered(buildSlackEventDeliveryKey(params, preparedReply));
		const nextThreadTs = replyPlan.peekThreadTs();
		if (nextThreadTs !== params.threadTs) deliveryTracker.markDelivered(buildSlackEventDeliveryKey({
			...params,
			threadTs: nextThreadTs
		}, preparedReply));
	};
	const resolveDeliveryThreadTs = (params) => {
		const plannedThreadTs = params.forcedThreadTs ? void 0 : replyPlan.nextThreadTs();
		return params.forcedThreadTs ?? plannedThreadTs ?? (params.kind === "block" ? state.usedBlockReplyThreadTs : void 0);
	};
	const rememberDeliveredThreadTs = (kind, deliveredThreadTs) => {
		if (!deliveredThreadTs) return;
		state.usedReplyThreadTs ??= deliveredThreadTs;
		if (kind === "block") state.usedBlockReplyThreadTs = deliveredThreadTs;
	};
	const deliverPendingStreamFallback = async (session, err) => {
		if (session.stoppedBySlack) return;
		let fallbackError = err;
		if (!session.stopped) try {
			const stopResult = await stopSlackStream({
				session,
				...slackMessageMetadata ? { metadata: slackMessageMetadata } : {}
			});
			if (session.stoppedBySlack) return;
			state.observedReplyDelivery = true;
			state.usedReplyThreadTs ??= session.threadTs;
			return {
				visibleReplySent: session.delivered,
				...stopResult.messageId ? { messageIds: [stopResult.messageId] } : {},
				threadId: session.threadTs
			};
		} catch (stopErr) {
			if (stopErr instanceof SlackStreamNotDeliveredError) fallbackError = stopErr;
			else throw stopErr;
		}
		const fallbackText = fallbackError.pendingText.trim();
		if (!fallbackText) return;
		const sent = await deliverReplies({
			cfg: ctx.cfg,
			replies: [prepareSlackReply({ text: fallbackText })],
			target: prepared.replyTarget,
			token: ctx.botToken,
			accountId: account.accountId,
			runtime,
			textLimit: ctx.textLimit,
			mediaMaxBytes: ctx.mediaMaxBytes,
			replyThreadTs: session.threadTs,
			replyToMode: replyDeliveryMode,
			...slackIdentity ? { identity: slackIdentity } : {},
			...slackMessageMetadata ? { metadata: slackMessageMetadata } : {},
			...messageSentDeliveryHookContext,
			deferMessageSentHooks: true,
			eventScope: prepared.eventScope
		});
		if (!sent?.receipt.platformMessageIds.length) return;
		markSlackStreamFallbackDelivered(session);
		if (!session.stopped) try {
			await stopSlackStream({
				session,
				...slackMessageMetadata ? { metadata: slackMessageMetadata } : {}
			});
		} catch (finalizeErr) {
			runtime.error?.(danger(`slack-stream: failed to finalize native stream after fallback delivery: ${formatSlackError(finalizeErr)}`));
		}
		state.observedReplyDelivery = true;
		state.usedReplyThreadTs ??= session.threadTs;
		logVerbose(`slack-stream: streamed delivery failed (${fallbackError.slackCode}); delivered ${fallbackText.length} chars via deliverReplies fallback`);
		return {
			visibleReplySent: true,
			messageIds: sent.receipt.platformMessageIds,
			receipt: sent.receipt,
			threadId: sent.threadTs ?? session.threadTs
		};
	};
	const finishStream = async (chunks) => {
		const session = state.streamSession;
		if (session && !session.stopped) try {
			try {
				await stopSlackStream({
					session,
					...chunks?.length ? { chunks } : {},
					...slackMessageMetadata ? { metadata: slackMessageMetadata } : {}
				});
				state.observedReplyDelivery ||= session.delivered;
			} catch (error) {
				if (!(error instanceof SlackStreamNotDeliveredError)) throw error;
				await deliverPendingStreamFallback(session, error);
			}
		} catch (error) {
			state.streamFailed = true;
			runtime.error?.(danger(`slack-stream: failed to stop stream: ${formatSlackError(error)}`));
		}
	};
	const deliverNormally = async (params) => {
		if (state.streamSession?.stoppedBySlack) return { visibleReplySent: false };
		const replyThreadTs = resolveDeliveryThreadTs(params);
		const deliveryReplyThreadTs = replyDeliveryMode === "off" && !forcedReplyThreadTs && !isThreadReply ? void 0 : replyThreadTs;
		const preparedReply = prepareSlackReply(params.payload);
		const deliveryKey = buildSlackEventDeliveryKey({
			kind: params.kind,
			payload: params.payload,
			threadTs: deliveryReplyThreadTs
		}, preparedReply);
		if (deliveryTracker.hasDelivered(deliveryKey)) {
			logVerbose("slack: suppressed duplicate normal delivery within the same turn");
			return { visibleReplySent: false };
		}
		const sent = await deliverReplies({
			cfg: ctx.cfg,
			replies: [preparedReply],
			target: prepared.replyTarget,
			token: ctx.botToken,
			accountId: account.accountId,
			runtime,
			textLimit: ctx.textLimit,
			mediaMaxBytes: ctx.mediaMaxBytes,
			replyThreadTs: deliveryReplyThreadTs,
			replyToMode: replyDeliveryMode,
			...slackIdentity ? { identity: slackIdentity } : {},
			...slackMessageMetadata ? { metadata: slackMessageMetadata } : {},
			...messageSentDeliveryHookContext,
			eventScope: prepared.eventScope
		});
		if (!sent?.receipt.platformMessageIds.length) return { visibleReplySent: false };
		state.observedReplyDelivery = true;
		const deliveredThreadTs = resolveSlackReplyThreadTs({
			replyToMode: replyDeliveryMode,
			replyToId: params.payload.replyToId,
			threadId: deliveryReplyThreadTs,
			replyToCurrent: params.payload.replyToCurrent
		});
		rememberDeliveredThreadTs(params.kind, deliveredThreadTs);
		replyPlan.markSent();
		deliveryTracker.markDelivered(deliveryKey);
		return {
			visibleReplySent: true,
			messageIds: sent.receipt.platformMessageIds,
			receipt: sent.receipt,
			threadId: sent.threadTs ?? deliveredThreadTs
		};
	};
	const isStreamingEligible = (payload, options) => {
		const reply = resolveSendableOutboundReplyParts(payload);
		const renderPlan = resolveSlackReplyRenderPlan(payload);
		const plannedBlocks = renderPlan.mode === "single" ? renderPlan.blocks : renderPlan.blockPart?.blocks;
		return !state.streamFailed && !reply.hasMedia && renderPlan.mode !== "split" && !renderPlan.textIsSlackPlainText && !plannedBlocks?.length && !readSlackReplyBlocks(payload)?.length && reply.hasText && (!options?.maxTextBytes || countSlackTextUtf8Bytes(reply.trimmedText) <= options.maxTextBytes);
	};
	const deliverWithStreaming = async (params) => {
		if (state.streamSession?.stoppedBySlack) return { visibleReplySent: false };
		if (!isStreamingEligible(params.payload)) return await deliverNormally({
			payload: params.payload,
			kind: params.kind,
			forcedThreadTs: state.streamSession?.threadTs ?? state.nativeProgressStreamThreadTs
		});
		if (!state.streamSession && state.nativeProgressStreamStartPromise) await state.nativeProgressStreamStartPromise;
		if (state.streamSession?.stoppedBySlack) return { visibleReplySent: false };
		let session = state.streamSession;
		const threadTs = session?.threadTs ?? replyPlan.nextThreadTs();
		if (state.streamFailed || !threadTs) {
			state.streamFailed = true;
			return await deliverNormally({
				payload: params.payload,
				kind: params.kind,
				forcedThreadTs: threadTs ?? state.nativeProgressStreamThreadTs
			});
		}
		const hookContent = resolveSendableOutboundReplyParts(params.payload).trimmedText;
		const text = params.streamText ?? hookContent;
		const deliveryKey = buildSlackEventDeliveryKey({
			...params,
			threadTs,
			textOverride: text
		});
		if (deliveryTracker.hasDelivered(deliveryKey)) {
			logVerbose("slack-stream: suppressed duplicate reply payload");
			return { visibleReplySent: false };
		}
		let messageId;
		let fallbackDelivery;
		try {
			if (session) await appendSlackStream({
				session,
				text: `${params.appendSeparator === false ? "" : "\n"}${text}`,
				chunks: []
			});
			else {
				session = await startSlackStream({
					client: slackClient,
					clientOptions: slackClientOptions,
					channel: message.channel,
					threadTs,
					text,
					chunks: [],
					...params.taskDisplayMode ? { taskDisplayMode: params.taskDisplayMode } : {},
					...slackIdentity ? { identity: slackIdentity } : {},
					teamId: await resolveSlackStreamRecipientTeamId({
						client: slackClient,
						token: ctx.botToken,
						userId: message.user,
						fallbackTeamId: slackStreamFallbackTeamId
					}),
					userId: message.user
				});
				state.streamSession = session;
			}
			messageId = session.streamer.ts;
		} catch (error) {
			state.streamFailed = true;
			if (!(error instanceof SlackStreamNotDeliveredError)) {
				emitStreamedDelivery(hookContent, {
					success: false,
					error: formatErrorMessage(error)
				});
				throw error;
			}
			if (!session) return await deliverNormally({
				payload: params.payload,
				kind: params.kind,
				forcedThreadTs: threadTs
			});
			try {
				const fallback = await deliverPendingStreamFallback(session, error);
				if (!fallback && !session.stoppedBySlack) throw error;
				fallbackDelivery = fallback;
				messageId = fallback?.receipt ? void 0 : fallback?.messageIds?.[0];
			} catch (fallbackError) {
				emitStreamedDelivery(hookContent, {
					success: false,
					error: formatErrorMessage(fallbackError)
				});
				throw fallbackError;
			}
		}
		if (session.stoppedBySlack && session.pendingText) {
			emitStreamedDelivery(hookContent, {
				success: false,
				error: "Stopped by Slack user"
			});
			return { visibleReplySent: false };
		}
		if (!fallbackDelivery?.visibleReplySent && (!session.delivered || session.pendingText)) return { visibleReplySent: false };
		state.observedReplyDelivery = true;
		rememberDeliveredThreadTs(params.kind, threadTs);
		replyPlan.markSent();
		deliveryTracker.markDelivered(deliveryKey);
		emitStreamedDelivery(hookContent, {
			success: true,
			...messageId ? { messageId } : {}
		});
		return fallbackDelivery ?? {
			visibleReplySent: true,
			...messageId ? { messageIds: [messageId] } : {},
			threadId: threadTs
		};
	};
	return Object.assign(state, {
		deliverNormally,
		deliverWithStreaming,
		finishStream,
		isStreamingEligible,
		markPreviewPayloadDelivered,
		rememberDeliveredThreadTs,
		resetDeliveryTracker: () => {
			deliveryTracker = createSlackEventDeliveryTracker();
		}
	});
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/dispatch.ts
function formatSlackGroupThreadReply(text, participant) {
	return `**${participant.name.replace(/[\\`*_{}[\]()<>#!|]/g, "\\$&").replace(/\s+/g, " ")}**\n${text}`;
}
async function dispatchPreparedSlackMessage(prepared) {
	const setup = await createSlackDispatchSetup(prepared);
	const beginSessionRun = () => registerSlackSessionRun(prepared.ctx, {
		channelId: prepared.message.channel,
		threadTs: setup.streamThreadHint,
		eventScope: prepared.eventScope
	}, {
		...prepared.route,
		sessionKey: prepared.ctxPayload.SessionKey ?? prepared.route.sessionKey
	});
	const upstreamLifecycle = prepared.turnAdoptionLifecycle;
	let releaseDeferred;
	const turnAdoptionLifecycle = upstreamLifecycle && {
		...upstreamLifecycle,
		onDeferred: () => {
			const accepted = upstreamLifecycle.onDeferred?.();
			if (accepted !== false) releaseDeferred ??= beginSessionRun();
			return accepted;
		},
		onSettled: () => {
			releaseDeferred?.();
			upstreamLifecycle.onSettled?.();
		}
	};
	const release = beginSessionRun();
	await dispatchSlackMessageWithSetup(setup, beginSessionRun, turnAdoptionLifecycle).finally(release);
}
async function dispatchSlackMessageWithSetup(setup, beginSessionRun, turnAdoptionLifecycle) {
	const { prepared } = setup;
	const { account, cfg, ctx, disableBlockStreaming, hasSlackCustomIdentity, hasRepliedRef, message, messageSentHookContext, messageSentHookTarget, onModelSelected, previewStreamingEnabled, replyPipeline, replyPlan, route, runtime, slackClient, slackStreaming, sourceReplyDeliveryMode, statusReactions, statusReactionsEnabled, statusThreadTs, suppressRoomEventTyping, useStreaming } = setup;
	let dispatchError;
	const delivery = createSlackStreamingDeliveryRuntime(setup);
	const progress = createSlackProgressRuntime({
		setup,
		delivery
	});
	const { draftStream, previewLifecycle } = progress;
	setup.threadStatusGate.hasVisibleOutput = () => delivery.observedReplyDelivery || previewLifecycle.previewFinalized || Boolean(draftStream?.messageId());
	const failureNoticeThreadTs = message.thread_ts;
	const failureNoticeTeamId = prepared.eventScope?.teamId;
	let sawTerminalFailurePayload = false;
	let pendingFailureNotice;
	const filterPassiveThreadFailure = (payload) => {
		if (payload.isError !== true || prepared.ctxPayload.ChatType !== "channel" || isReplyPayloadNonTerminalToolErrorWarning(payload)) return payload;
		sawTerminalFailurePayload = true;
		if (delivery.observedReplyDelivery || previewLifecycle.previewFinalized) return payload;
		const explicitlyAddressed = prepared.ctxPayload.ExplicitlyMentionedBot === true || prepared.ctxPayload.MentionSource === "explicit_bot" || prepared.ctxPayload.MentionSource === "subteam" || prepared.ctxPayload.MentionSource === "mention_pattern" || prepared.ctxPayload.MentionSource === "command_bypass" || prepared.ctxPayload.CommandTurn?.kind !== void 0 && prepared.ctxPayload.CommandTurn.kind !== "normal" && prepared.ctxPayload.CommandTurn.authorized;
		const noticeThreadTs = failureNoticeThreadTs ?? (explicitlyAddressed ? statusThreadTs : void 0);
		const notice = {
			accountId: account.accountId,
			channelId: message.channel,
			...noticeThreadTs ? { threadTs: noticeThreadTs } : {},
			failureText: payload.text ?? "",
			...failureNoticeTeamId ? { teamId: failureNoticeTeamId } : {}
		};
		if (failureNoticeThreadTs && !explicitlyAddressed && prepared.ctxPayload.MentionSource !== "implicit_thread" && !hasSlackThreadParticipation(notice.accountId, notice.channelId, failureNoticeThreadTs, failureNoticeTeamId)) {
			logVerbose("slack: suppressed passive failure before thread participation");
			return null;
		}
		if (!explicitlyAddressed && hasSlackThreadFailureNotice(notice)) {
			logVerbose("slack: suppressed repeated passive channel or thread failure");
			return null;
		}
		pendingFailureNotice = notice;
		return payload;
	};
	const deliverSlackPayload = async (incomingPayload, info) => {
		let payload = incomingPayload;
		if (info.participant && (payload.text || payload.mediaUrl || payload.mediaUrls?.length)) payload = {
			...payload,
			text: formatSlackGroupThreadReply(payload.text ?? "", info.participant)
		};
		if (info.kind === "final" && slackStreaming.mode === "progress" && progress.isProgressMode) {
			const supplement = getReplyPayloadTtsSupplement(payload);
			const finalPayload = !progress.useDraftProgressCard && !progress.useNativeProgressStreaming && supplement && !supplement.visibleTextAlreadyDelivered && !payload.text?.trim() ? {
				...payload,
				text: supplement.spokenText
			} : payload;
			return (await previewLifecycle.deliver({
				kind: info.kind,
				payload: finalPayload,
				isError: payload.isError === true,
				deliverNormally: (reply) => progress.useNativeProgressStreaming ? progress.deliverNativeFinal(reply, info.kind) : delivery.deliverNormally({
					payload: reply,
					kind: info.kind,
					forcedThreadTs: delivery.usedReplyThreadTs
				}),
				onNormalDelivered: progress.useDraftProgressCard ? async () => {
					if (!await progress.finalizeDraftProgressCard(payload.isError === true ? "error" : "success")) await draftStream?.clear();
				} : void 0
			})).deliveryResult ?? { visibleReplySent: false };
		}
		if (progress.useNativeProgressStreaming) {
			if (info.kind !== "final" && payload.isError !== true) {
				if (!delivery.isStreamingEligible(payload)) return await delivery.deliverNormally({
					payload,
					kind: info.kind,
					forcedThreadTs: delivery.streamSession?.threadTs ?? delivery.nativeProgressStreamThreadTs
				});
				return await progress.appendNativeNarration(payload, info.kind);
			}
			return await delivery.deliverNormally({
				payload,
				kind: info.kind,
				forcedThreadTs: delivery.streamSession?.threadTs ?? delivery.nativeProgressStreamThreadTs
			});
		}
		if (useStreaming) return (await previewLifecycle.deliver({
			kind: info.kind,
			payload,
			isError: payload.isError === true,
			deliverNormally: (reply) => delivery.deliverWithStreaming({
				payload: reply,
				kind: info.kind
			})
		})).deliveryResult ?? { visibleReplySent: false };
		const reply = resolveSendableOutboundReplyParts(payload);
		const ttsSupplement = getReplyPayloadTtsSupplement(payload);
		const replySourceText = payload.text ?? ttsSupplement?.spokenText;
		const replyRenderPlan = resolveSlackReplyRenderPlan(payload, replySourceText);
		const slackBlocks = replyRenderPlan.mode === "single" ? replyRenderPlan.blocks : replyRenderPlan.blockPart?.blocks;
		const requiresSeparateFallbackDelivery = replyRenderPlan.mode === "split" || replyRenderPlan.textIsSlackPlainText === true;
		const trimmedFinalText = replyRenderPlan.mode === "single" ? replyRenderPlan.text.trim() : replyRenderPlan.fallbackText.trim();
		const previewFinalText = replyRenderPlan.mode === "single" && replyRenderPlan.textIsSlackMrkdwn ? trimmedFinalText : normalizeSlackOutboundText((replySourceText ?? "").trim(), { tableMode: resolveMarkdownTableMode({
			cfg,
			channel: "slack",
			accountId: account.accountId
		}) });
		const previewFinalTextFitsEdit = countSlackTextUtf8Bytes(previewFinalText) <= SLACK_EDIT_TEXT_MAX_BYTES;
		const shouldRestoreTtsSupplementTextForPreviewFallback = Boolean(ttsSupplement) && ttsSupplement?.visibleTextAlreadyDelivered !== true && Boolean(draftStream) && !previewLifecycle.previewFinalized && !previewLifecycle.finalDelivered && previewStreamingEnabled && !payload.text?.trim();
		let ttsPreviewFinalization;
		return (await previewLifecycle.deliver({
			kind: info.kind,
			payload,
			isError: payload.isError === true,
			adapter: {
				buildFinalEdit: () => {
					if (hasSlackCustomIdentity || !previewStreamingEnabled || reply.hasMedia && !ttsSupplement || payload.isError || requiresSeparateFallbackDelivery || !previewFinalTextFitsEdit || trimmedFinalText.length === 0 && !slackBlocks?.length) return;
					return {
						text: previewFinalText,
						blocks: slackBlocks,
						threadTs: delivery.usedReplyThreadTs ?? statusThreadTs
					};
				},
				editFinal: async (preview, edit) => {
					if (ttsSupplement) ttsPreviewFinalization = { threadTs: edit.threadTs };
					if (!await draftStream?.finalizeMessage(preview.messageId, async () => {
						await finalizeSlackPreviewEdit({
							client: slackClient,
							token: ctx.botToken,
							accountId: account.accountId,
							channelId: preview.channelId,
							messageId: preview.messageId,
							text: edit.text,
							...edit.blocks?.length ? { blocks: edit.blocks } : {},
							threadTs: edit.threadTs
						});
					})) throw new Error("Slack preview moved below a newer conversation message");
				},
				createPreviewReceipt: (preview, edit) => createMessageReceiptFromOutboundResults({
					results: [{
						channel: "slack",
						channelId: preview.channelId,
						messageId: preview.messageId
					}],
					threadId: edit.threadTs,
					kind: "text"
				}),
				onPreviewFinalized: (preview) => {
					const finalThreadTs = delivery.usedReplyThreadTs ?? statusThreadTs;
					delivery.observedReplyDelivery = true;
					replyPlan.markSent();
					if (!ttsSupplement) {
						delivery.markPreviewPayloadDelivered({
							kind: info.kind,
							payload,
							threadTs: finalThreadTs
						});
						emitSlackMessageSentHooks({
							...messageSentHookContext,
							to: messageSentHookTarget,
							accountId: account.accountId,
							content: trimmedFinalText,
							success: true,
							messageId: preview.messageId
						});
					}
				},
				buildSupplementalPayload: () => ttsSupplement ? buildTtsSupplementMediaPayload(payload) : void 0,
				deliverSupplemental: async (supplementalPayload) => {
					const previewThreadTs = delivery.usedReplyThreadTs ?? statusThreadTs;
					const supplementalResult = await delivery.deliverNormally({
						payload: supplementalPayload,
						kind: info.kind,
						forcedThreadTs: previewThreadTs
					});
					if (supplementalResult.visibleReplySent) delivery.markPreviewPayloadDelivered({
						kind: info.kind,
						payload,
						threadTs: supplementalResult.threadId
					});
					return supplementalResult;
				},
				logPreviewEditFailure: (err) => {
					logVerbose(`slack: preview final edit failed; falling back to standard send (${formatSlackError(err)})`);
				}
			},
			deliverNormally: async (normalPayload) => {
				return await delivery.deliverNormally({
					payload: normalPayload === payload && (shouldRestoreTtsSupplementTextForPreviewFallback || ttsPreviewFinalization && !payload.text?.trim()) ? {
						...normalPayload,
						text: ttsSupplement?.spokenText
					} : normalPayload,
					kind: info.kind,
					...ttsPreviewFinalization?.threadTs ? { forcedThreadTs: ttsPreviewFinalization.threadTs } : {}
				});
			}
		})).deliveryResult ?? { visibleReplySent: false };
	};
	let agentRunFailed = false;
	let settledDispatchResult;
	try {
		const turnResult = await dispatchChannelInboundTurn({
			cfg,
			channel: "slack",
			accountId: route.accountId,
			route: {
				agentId: route.agentId,
				sessionKey: route.sessionKey
			},
			ctxPayload: prepared.ctxPayload,
			dispatchReplyFromConfig: ctx.dispatchReplyFromConfig,
			dispatcherOptions: {
				...replyPipeline,
				transformReplyPayload: (payload) => {
					const transformed = replyPipeline.transformReplyPayload ? replyPipeline.transformReplyPayload(payload) : payload;
					return transformed ? filterPassiveThreadFailure(transformed) : null;
				},
				humanDelay: resolveHumanDelayConfig(cfg, route.agentId)
			},
			delivery: {
				deliver: deliverSlackPayload,
				onError: (err, info) => {
					dispatchError ??= err;
					runtime.error?.(danger(`slack ${info.kind} reply failed: ${formatSlackError(err)}`));
					replyPipeline.typingCallbacks?.onIdle?.();
				}
			},
			record: prepared.turn.record,
			botLoopProtection: resolveSlackBotLoopProtection(prepared),
			replyOptions: {
				groupThreadReplyFormatter: formatSlackGroupThreadReply,
				queuedDeliveryCorrelations: [{ begin: beginSessionRun }],
				...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
				skillFilter: prepared.channelConfig?.skills,
				sourceReplyDeliveryMode,
				suppressTyping: suppressRoomEventTyping ? true : void 0,
				hasRepliedRef,
				disableBlockStreaming,
				onModelSelected,
				suppressDefaultToolProgressMessages: progress.suppressDefaultToolProgressMessages ? true : void 0,
				commentaryProgressEnabled: progress.commentaryProgressEnabled ? true : void 0,
				progressPreambleEnabled: progress.progressDraftActive && slackStreaming.mode === "progress" ? true : void 0,
				commentaryPayloadsEnabled: progress.commentaryProgressEnabled ? true : void 0,
				shouldDeliverCommentaryPayloads: progress.commentaryProgressEnabled ? progress.shouldYieldDraftProgress : void 0,
				onVerboseProgressVisibility: progress.commentaryProgressEnabled ? (isActive) => {
					progress.setShouldYieldDraftProgress(isActive);
				} : void 0,
				allowProgressCallbacksWhenSourceDeliverySuppressed: sourceReplyDeliveryMode === "message_tool_only" && statusReactionsEnabled ? true : void 0,
				allowToolLifecycleWhenProgressHidden: statusReactionsEnabled ? true : void 0,
				onPartialReply: useStreaming ? void 0 : !previewStreamingEnabled ? void 0 : async (payload) => {
					return progress.updateDraftFromPartial(payload.text);
				},
				onAssistantMessageStart: progress.onDraftBoundary ? async () => {
					await progress.onDraftBoundary?.();
					return false;
				} : void 0,
				onReasoningEnd: async () => {
					await progress.onDraftBoundary?.();
					return false;
				},
				onQueuedFollowupAdmitted: progress.onQueuedFollowupAdmitted,
				onQueuedFollowupSettled: progress.onQueuedFollowupSettled,
				onReasoningStream: async (payload) => {
					const visible = await progress.pushReasoningProgress(payload);
					if (statusReactionsEnabled) await statusReactions.setThinking();
					return visible;
				},
				onToolStart: async (payload) => {
					if (statusReactionsEnabled) await statusReactions.setTool(payload.name);
					return await progress.progressDraft.pushToolEvent(payload);
				},
				onItemEvent: async (payload) => {
					if (payload.hideFromChannelProgress || payload.suppressChannelProgress) return progress.preambleOnlyProgress ? false : progress.progressDraft.pushItemEvent(payload);
					if (payload.kind === "preamble" && progress.shouldYieldDraftProgress()) return false;
					progress.progressWorkCounter.noteItem(payload);
					return progress.preambleOnlyProgress && payload.kind !== "preamble" ? await progress.progressDraft.noteActivity() : await progress.progressDraft.pushItemEvent(payload);
				},
				onPlanUpdate: async (payload) => {
					if (payload.phase !== "update") return false;
					return await progress.pushPlanProgress(payload.steps, payload.explanation, payload.explanationFormat);
				},
				onApprovalEvent: (payload) => progress.progressDraft.pushApprovalEvent(payload)
			}
		});
		if (turnResult.dispatched) {
			const result = turnResult.dispatchResult;
			settledDispatchResult = result;
			const agentRunOutcome = readAgentRunTerminalOutcome(result);
			agentRunFailed = agentRunOutcome === "failed";
			if (agentRunOutcome === "completed" && !sawTerminalFailurePayload && prepared.ctxPayload.ChatType === "channel") clearSlackThreadFailureNotice({
				accountId: account.accountId,
				channelId: message.channel,
				...failureNoticeThreadTs ? { threadTs: failureNoticeThreadTs } : {},
				...failureNoticeTeamId ? { teamId: failureNoticeTeamId } : {}
			});
		}
	} catch (err) {
		dispatchError ??= err;
	} finally {
		await progress.cancel();
		if (!progress.useDraftProgressCard) await draftStream?.discardPending();
	}
	const completionChunks = progress.useNativeProgressStreaming && !progress.nativeProgressCompletionSent ? progress.buildNativeProgressCompletionChunks(dispatchError || agentRunFailed ? "error" : progress.nativeProgressTerminalStatus) : void 0;
	if (completionChunks?.length) progress.nativeProgressCompletionSent = true;
	await delivery.finishStream(completionChunks);
	const anyReplyDelivered = hasVisibleInboundReplyDispatch(settledDispatchResult, { observedReplyDelivery: delivery.observedReplyDelivery || previewLifecycle.finalDelivered });
	if (anyReplyDelivered && !previewLifecycle.finalStarted && !dispatchError && !agentRunFailed) {
		if (hasVisibleInboundReplyDispatch(settledDispatchResult)) await previewLifecycle.observeDelivery({ visibleReplySent: true });
	}
	await previewLifecycle.cleanup({ failed: Boolean(dispatchError || agentRunFailed) });
	if (pendingFailureNotice && anyReplyDelivered) recordSlackThreadFailureNotice(pendingFailureNotice);
	if (dispatchError || agentRunFailed) await progress.finalizeDraftProgressCard("error");
	await progress.dropDetachedProgressCards();
	if (statusReactionsEnabled) {
		if (dispatchError || agentRunFailed) {
			await statusReactions.setError();
			statusReactions.restoreInitial();
		} else if (anyReplyDelivered) {
			await statusReactions.setDone();
			statusReactions.restoreInitial();
		} else await statusReactions.restoreInitial();
	}
	const participationThreadTs = delivery.usedReplyThreadTs ?? statusThreadTs;
	if (anyReplyDelivered && participationThreadTs) recordSlackThreadParticipation(account.accountId, message.channel, participationThreadTs, {
		agentId: route.agentId,
		teamId: prepared.eventScope?.teamId
	});
	if (dispatchError) throw toErrorObject(dispatchError, "Slack dispatch failed");
	if (!anyReplyDelivered && !previewLifecycle.previewFinalized && !(agentRunFailed && progress.useDraftProgressCard)) {
		if (progress.useDraftProgressCard) await draftStream?.clear();
		return;
	}
	if (shouldLogVerbose()) {
		const finalCount = resolveInboundReplyDispatchCounts(settledDispatchResult).final;
		logVerbose(`slack: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${prepared.replyTarget}`);
	}
}
//#endregion
//#region extensions/slack/src/agent-context.ts
function normalizeEntity(value) {
	const entity = asOptionalRecord(value);
	const type = normalizeOptionalString(entity?.type);
	if (!entity || !type) return;
	const teamId = normalizeOptionalString(entity.team_id);
	if (type === "slack#/types/channel_id" || type === "slack#/types/canvas_id" || type === "slack#/types/list_id") {
		const entityValue = normalizeOptionalString(entity.value);
		return entityValue ? {
			type,
			value: entityValue,
			...teamId ? { team_id: teamId } : {}
		} : void 0;
	}
	if (type !== "slack#/types/message_context") return;
	const message = asOptionalRecord(entity.value);
	const channelId = normalizeOptionalString(message?.channel_id);
	const messageTs = normalizeOptionalString(message?.message_ts);
	return channelId && messageTs ? {
		type,
		value: {
			channel_id: channelId,
			message_ts: messageTs
		},
		...teamId ? { team_id: teamId } : {}
	} : void 0;
}
function isSlackAppContext(value) {
	return Boolean(asOptionalRecord(value));
}
function normalizeSlackAppContextEntities(value) {
	const context = asOptionalRecord(value);
	if (!Array.isArray(context?.entities)) return [];
	return context.entities.flatMap((entity) => {
		const normalized = normalizeEntity(entity);
		return normalized ? [normalized] : [];
	});
}
//#endregion
//#region extensions/slack/src/monitor/thread.ts
const THREAD_STARTER_CACHE = /* @__PURE__ */ new Map();
const THREAD_STARTER_CACHE_TTL_MS = 216e5;
const THREAD_STARTER_CACHE_MAX = 2e3;
function evictThreadStarterCache() {
	const now = asDateTimestampMs(Date.now());
	if (now === void 0) {
		THREAD_STARTER_CACHE.clear();
		return;
	}
	for (const [cacheKey, entry] of THREAD_STARTER_CACHE.entries()) if (asDateTimestampMs(entry.expiresAt) === void 0 || entry.expiresAt <= now) THREAD_STARTER_CACHE.delete(cacheKey);
	pruneMapToMaxSize(THREAD_STARTER_CACHE, THREAD_STARTER_CACHE_MAX);
}
function formatSlackFilePlaceholder(files) {
	return `[attached: ${formatSlackFileReferenceList(files)}]`;
}
function pushUniqueText(parts, value, options = {}) {
	const text = options.preserveWhitespace ? typeof value === "string" && value.trim().length > 0 ? value : void 0 : normalizeOptionalString(value);
	if (text && !parts.includes(text)) parts.push(text);
}
function resolveSlackBlocksFallbackText(blocks) {
	return resolveSlackBlocksText(blocks)?.text;
}
function resolveSlackAttachmentFallbackText(attachments) {
	if (!Array.isArray(attachments) || attachments.length === 0) return;
	const parts = [];
	for (const attachment of attachments) {
		const excludeTableBlocks = isSlackUnfurlAttachment(attachment);
		const fallbackBlocks = (blocks) => excludeTableBlocks ? blocks?.filter((block) => !hasSlackTableBlock([block])) : blocks;
		pushUniqueText(parts, attachment.pretext);
		pushUniqueText(parts, attachment.title);
		pushUniqueText(parts, attachment.text);
		if (!(hasSlackTableBlock(attachment.blocks) && normalizeOptionalString(attachment.fallback) === "[no preview available]")) pushUniqueText(parts, attachment.fallback);
		for (const field of attachment.fields ?? []) {
			pushUniqueText(parts, field.title);
			pushUniqueText(parts, field.value);
		}
		pushUniqueText(parts, resolveSlackBlocksFallbackText(fallbackBlocks(attachment.blocks)), { preserveWhitespace: true });
		pushUniqueText(parts, resolveSlackBlocksFallbackText(fallbackBlocks(attachment.message_blocks)), { preserveWhitespace: true });
	}
	return parts.length > 0 ? parts.join("\n") : void 0;
}
function resolveSlackMessageText(message) {
	const messageText = normalizeOptionalString(message.text) ?? resolveSlackAttachmentFallbackText(message.attachments) ?? (message.attachments?.some((attachment) => attachment.is_share === true && (normalizeOptionalString(attachment.image_url) || attachment.files?.length)) ? "[Slack media attachment]" : void 0);
	return resolveSlackMessageText$1({
		...message,
		text: messageText
	}, { preserveMessageTextWhitespace: true });
}
async function resolveSlackThreadStarter(params) {
	evictThreadStarterCache();
	const cacheKey = JSON.stringify([
		params.workspaceScope.accountId,
		params.workspaceScope.teamId,
		params.channelId,
		params.threadTs
	]);
	const cached = THREAD_STARTER_CACHE.get(cacheKey);
	if (cached && !params.refresh) {
		const now = asDateTimestampMs(Date.now());
		if (now !== void 0 && cached.expiresAt > now) return cached.value;
		THREAD_STARTER_CACHE.delete(cacheKey);
	}
	if (params.refresh) THREAD_STARTER_CACHE.delete(cacheKey);
	try {
		const message = (await params.client.conversations.replies({
			channel: params.channelId,
			ts: params.threadTs,
			limit: 1,
			inclusive: true
		}))?.messages?.[0];
		const text = message ? resolveSlackMessageText(message) : void 0;
		const files = message?.files?.length ? message.files : void 0;
		if (!message || !text && !files) return null;
		const starter = {
			text: text || formatSlackFilePlaceholder(files),
			userId: message.user,
			botId: message.bot_id,
			ts: message.ts,
			files
		};
		const expiresAt = resolveExpiresAtMsFromDurationMs(THREAD_STARTER_CACHE_TTL_MS);
		if (expiresAt !== void 0) {
			if (THREAD_STARTER_CACHE.has(cacheKey)) THREAD_STARTER_CACHE.delete(cacheKey);
			THREAD_STARTER_CACHE.set(cacheKey, {
				value: starter,
				expiresAt
			});
			evictThreadStarterCache();
		}
		return starter;
	} catch (err) {
		logVerbose$1(`slack thread starter fetch failed channel=${params.channelId} ts=${params.threadTs}: ${formatErrorMessage(err)}`);
		return null;
	}
}
const SLACK_THREAD_HISTORY_MAX_PAGES = 3;
/**
* Fetches the most recent messages in a Slack thread (excluding the current message).
* Used to populate thread context when a new thread session starts.
*
* Uses cursor pagination and keeps only the latest N retained messages when the full
* thread fits in the bounded fetch window.
*/
async function resolveSlackThreadHistory(params) {
	const maxMessages = params.limit ?? 20;
	if (!Number.isFinite(maxMessages) || maxMessages <= 0) return [];
	const fetchLimit = 200;
	const retained = [];
	let cursor;
	let pagesFetched = 0;
	try {
		do {
			pagesFetched += 1;
			params.assertCurrent?.();
			const response = await params.client.conversations.replies({
				channel: params.channelId,
				ts: params.threadTs,
				limit: fetchLimit,
				inclusive: false,
				...params.currentMessageTs ? { latest: params.currentMessageTs } : {},
				...params.oldest ? { oldest: params.oldest } : {},
				...cursor ? { cursor } : {}
			});
			params.assertCurrent?.();
			for (const msg of response.messages ?? []) {
				const timestamp = resolveSlackTimestampMs(msg.ts);
				const text = resolveSlackMessageText(msg);
				if (!text && !msg.files?.length) continue;
				if (!msg.ts || msg.ts === params.currentMessageTs || params.currentMessageTs && timestamp !== void 0 && Number(msg.ts) >= Number(params.currentMessageTs) || params.oldest && (timestamp === void 0 || Number(msg.ts) <= Number(params.oldest)) || params.excludedMessageIds?.has(msg.ts)) continue;
				if (retained.some(([entry]) => entry.ts === msg.ts)) continue;
				retained.push([msg, text]);
			}
			if (retained.length > maxMessages) retained.splice(0, retained.length - maxMessages);
			const next = response.response_metadata?.next_cursor;
			cursor = typeof next === "string" && next.trim().length > 0 ? next.trim() : void 0;
			if (response.has_more && !cursor) {
				params.onOmission?.("Slack returned an incomplete thread page without a cursor");
				return [];
			}
		} while (cursor && pagesFetched < SLACK_THREAD_HISTORY_MAX_PAGES);
		if (cursor) {
			logVerbose$1(`slack thread history capped channel=${params.channelId} ts=${params.threadTs} pages=${SLACK_THREAD_HISTORY_MAX_PAGES}`);
			params.onOmission?.("Slack thread exceeds the three-page automatic history budget");
			return [];
		}
		return retained.map(([message, text]) => ({
			text: text ?? formatSlackFilePlaceholder(message.files),
			userId: message.user,
			botId: message.bot_id,
			ts: message.ts,
			files: message.files,
			attachments: message.attachments
		}));
	} catch (err) {
		params.assertCurrent?.();
		params.onOmission?.(formatErrorMessage(err));
		logVerbose$1(`slack thread history fetch failed channel=${params.channelId} ts=${params.threadTs}: ${formatErrorMessage(err)}`);
		return [];
	}
}
/** Slack channel history is newest first, unlike chronological thread replies. */
async function resolveSlackChannelHistory(params) {
	if (!Number.isFinite(params.limit) || params.limit <= 0) return [];
	const messages = [];
	const seen = /* @__PURE__ */ new Set();
	let cursor;
	let scanned = 0;
	const maxPages = Math.ceil(params.limit / 200);
	for (let page = 0; page < maxPages; page += 1) {
		params.assertCurrent?.();
		const response = await params.client.conversations.history({
			channel: params.channelId,
			latest: params.currentMessageTs,
			...params.oldest ? { oldest: params.oldest } : {},
			inclusive: false,
			limit: Math.min(200, params.limit - scanned),
			...cursor ? { cursor } : {}
		});
		params.assertCurrent?.();
		for (const message of response.messages ?? []) {
			scanned += 1;
			if (!message.ts || Number(message.ts) >= Number(params.currentMessageTs) || params.oldest && Number(message.ts) <= Number(params.oldest) || params.excludedMessageIds.has(message.ts) || seen.has(message.ts)) continue;
			seen.add(message.ts);
			const text = resolveSlackMessageText(message);
			if (!text && !message.files?.length) continue;
			messages.push({
				text: text ?? formatSlackFilePlaceholder(message.files),
				userId: message.user,
				botId: message.bot_id,
				ts: message.ts,
				files: message.files,
				attachments: message.attachments
			});
		}
		cursor = response.response_metadata?.next_cursor?.trim() || void 0;
		if (!cursor || scanned >= params.limit) break;
	}
	return messages.slice(0, params.limit).toReversed();
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/preflight-audio.ts
function isSlackAudioFile(file) {
	if (file.subtype === "slack_audio") return true;
	if ((file.mimetype?.split(";")[0]?.trim().toLowerCase())?.startsWith("audio/")) return true;
	return Boolean(mimeTypeFromFilePath(file.name)?.startsWith("audio/"));
}
const slackPreflightAudio = createChannelPreflightAudio({
	channel: "slack",
	isAudio: isSlackAudioFile
});
function findSlackPreflightAudioFile(message, options = {}) {
	if (!options.allowCaptioned && message.text?.trim()) return;
	return message.files?.slice(0, 8).find(isSlackAudioFile);
}
function formatSlackAudioTranscriptForAgent(params) {
	return [formatAudioTranscriptForAgent(params.transcript), params.rawBody].filter(Boolean).join("\n");
}
async function resolveSlackPreflightAudioTranscript(params) {
	const mediaIndex = params.media.findIndex((entry) => entry.contentType?.toLowerCase().startsWith("audio/"));
	if (mediaIndex < 0) return null;
	const transcript = await slackPreflightAudio.resolve({ request: {
		ctx: {
			media: [...params.media],
			Provider: "slack",
			Surface: "slack",
			OriginatingChannel: "slack",
			OriginatingTo: params.originatingTo,
			AccountId: params.accountId,
			MessageThreadId: params.messageThreadId,
			ChatType: "channel",
			SessionKey: params.sessionKey
		},
		cfg: params.cfg
	} });
	return transcript ? {
		transcript,
		mediaIndex
	} : null;
}
async function sendSlackPreflightAudioTranscriptEcho(params) {
	await slackPreflightAudio.send(params);
}
async function discardSlackPreflightMedia(media) {
	await Promise.allSettled((media ?? []).map((entry) => fs.rm(entry.path, { force: true })));
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare-content.ts
const SLACK_MENTION_RESOLUTION_CONCURRENCY = 4;
const SLACK_MENTION_RESOLUTION_MAX_LOOKUPS_PER_MESSAGE = 20;
const SLACK_USER_MENTION_RE$1 = /<@([A-Z0-9]+)(?:\|[^>]+)?>/gi;
const MAX_SLACK_UNAVAILABLE_FILE_TEXT_CHARS = 2e3;
const loadSlackMediaModule$1 = createLazyRuntimeModule(() => import("./actions-DKCtBgCI.mjs").then((n) => n._));
function formatSlackUnavailableMedia(params) {
	let fileReferences = params.files?.map((file) => `${formatSlackFileReference(file)} unavailable (${file.reason})`).join(", ");
	if (fileReferences && fileReferences.length > MAX_SLACK_UNAVAILABLE_FILE_TEXT_CHARS) fileReferences = `${truncateUtf16Safe(fileReferences, MAX_SLACK_UNAVAILABLE_FILE_TEXT_CHARS)}; … (file references truncated)`;
	const fileBlock = fileReferences ? `[Slack file: ${fileReferences}]` : void 0;
	const body = [params.body, fileBlock].filter(Boolean).join("\n");
	if (params.unavailableMediaCount === 0) return body;
	const notice = `[slack ${params.unavailableMediaCount > 1 ? `${params.unavailableMediaCount} attachments` : "attachment"} unavailable]`;
	return params.prependUnavailable ? [
		notice,
		fileBlock,
		params.body
	].filter(Boolean).join("\n") : formatInboundMediaUnavailableText({
		body,
		notice
	});
}
function collectUniqueSlackMentionIds$1(texts) {
	const seen = /* @__PURE__ */ new Set();
	const mentionIds = [];
	for (const text of texts) {
		if (!text) continue;
		SLACK_USER_MENTION_RE$1.lastIndex = 0;
		for (const match of text.matchAll(SLACK_USER_MENTION_RE$1)) {
			const userId = match[1];
			if (!userId || seen.has(userId)) continue;
			seen.add(userId);
			mentionIds.push(userId);
		}
	}
	return mentionIds;
}
function renderSlackUserMentions(text, renderedMentions) {
	if (!text || renderedMentions.size === 0) return text;
	SLACK_USER_MENTION_RE$1.lastIndex = 0;
	return text.replace(SLACK_USER_MENTION_RE$1, (full, userId) => {
		return renderedMentions.get(userId) ?? full;
	});
}
function filterInheritedParentFiles(params) {
	const { files, isThreadReply, threadStarter } = params;
	if (!isThreadReply || !files?.length) return files;
	if (!threadStarter?.files?.length) return files;
	const starterFileIds = new Set(threadStarter.files.map((file) => file.id));
	const filtered = files.filter((file) => !file.id || !starterFileIds.has(file.id));
	if (filtered.length < files.length) logVerbose(`slack: filtered ${files.length - filtered.length} inherited parent file(s) from thread reply`);
	return filtered.length > 0 ? filtered : void 0;
}
async function resolveSlackMessageContent(params) {
	const ownFiles = filterInheritedParentFiles({
		files: params.message.files,
		isThreadReply: params.isThreadReply,
		threadStarter: params.threadStarter
	});
	const attachmentContent = ownFiles?.length || params.message.attachments?.length ? await loadSlackMediaModule$1().then(({ resolveSlackAttachmentContent }) => resolveSlackAttachmentContent({
		files: ownFiles,
		attachments: params.message.attachments,
		client: params.client,
		token: params.botToken,
		maxBytes: params.mediaMaxBytes,
		readIdleTimeoutMs: params.mediaReadIdleTimeoutMs,
		totalTimeoutMs: params.mediaTotalTimeoutMs,
		abortSignal: params.abortSignal,
		assertCurrent: params.assertCurrent,
		preloadedMedia: params.preloadedMedia
	})) : null;
	const effectiveDirectMedia = attachmentContent?.media.length ? attachmentContent.media : null;
	const mediaPlaceholder = effectiveDirectMedia?.map((item) => item.placeholder).join(" ");
	let botAttachmentText;
	if (params.isBotMessage && !attachmentContent?.text) {
		const botAttachmentTextParts = [];
		for (const attachment of params.message.attachments ?? []) {
			const text = normalizeOptionalString(attachment.text) ?? normalizeOptionalString(attachment.fallback);
			if (text) botAttachmentTextParts.push(text);
		}
		botAttachmentText = botAttachmentTextParts.length > 0 ? botAttachmentTextParts.join("\n") : void 0;
	}
	const textParts = [
		resolveSlackMessageText$1(params.message),
		attachmentContent?.text,
		botAttachmentText
	];
	const renderedMentions = /* @__PURE__ */ new Map();
	const resolveUserName = params.resolveUserName;
	if (resolveUserName) {
		const mentionIds = collectUniqueSlackMentionIds$1(textParts);
		const lookupIds = mentionIds.slice(0, SLACK_MENTION_RESOLUTION_MAX_LOOKUPS_PER_MESSAGE);
		const skippedLookups = mentionIds.length - lookupIds.length;
		if (skippedLookups > 0) logVerbose(`slack: skipping ${skippedLookups} mention lookup(s) beyond per-message cap (${SLACK_MENTION_RESOLUTION_MAX_LOOKUPS_PER_MESSAGE})`);
		const { results } = await runTasksWithConcurrency({
			tasks: lookupIds.map((userId) => async () => {
				const user = await resolveUserName(userId);
				const renderedName = normalizeOptionalString(user?.name);
				return {
					userId,
					rendered: renderedName ? `<@${userId}> (${renderedName})` : null
				};
			}),
			limit: SLACK_MENTION_RESOLUTION_CONCURRENCY
		});
		for (const result of results) {
			if (!result) continue;
			renderedMentions.set(result.userId, result.rendered);
		}
	}
	const renderedMessageText = renderSlackUserMentions(textParts[0], renderedMentions);
	const renderedAttachmentText = renderSlackUserMentions(textParts[1], renderedMentions);
	const renderedBotAttachmentText = renderSlackUserMentions(textParts[2], renderedMentions);
	const commandSourceText = renderSlackUserMentions(normalizeOptionalString(params.message.text), renderedMentions) ?? "";
	const rawBody = formatSlackUnavailableMedia({
		body: [
			renderedMessageText,
			renderedAttachmentText,
			renderedBotAttachmentText,
			mediaPlaceholder
		].filter(Boolean).join("\n") || "",
		files: attachmentContent?.files,
		unavailableMediaCount: attachmentContent?.unavailableMediaCount ?? 0
	});
	const mentionStripPatterns = [...renderedMentions.values()].flatMap((rendered) => rendered ? [rendered] : []);
	return rawBody ? {
		rawBody,
		effectiveDirectMedia,
		commandSourceText,
		mentionStripPatterns
	} : null;
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare-dm-history.ts
function resolveSlackDmHistoryLimit(params) {
	const override = params.userId && params.account.config.dms?.[params.userId]?.historyLimit !== void 0 ? params.account.config.dms[params.userId]?.historyLimit : void 0;
	return resolvePromptHistoryLimit(override ?? params.defaultLimit, 0);
}
async function resolveSlackDmHistoryContext(params) {
	const maxMessages = Math.max(0, Math.floor(params.limit));
	if (maxMessages <= 0) return {
		body: void 0,
		inboundHistory: void 0
	};
	try {
		const messages = ((await (params.eventScope?.client ?? params.ctx.app.client).conversations.history({
			token: params.ctx.botToken,
			channel: params.channelId,
			...params.currentMessageTs ? {
				latest: params.currentMessageTs,
				inclusive: true
			} : {},
			limit: maxMessages + 1
		})).messages ?? []).filter((message) => {
			if (params.currentMessageTs && message.ts === params.currentMessageTs) return false;
			return Boolean(normalizeOptionalString(message.text));
		}).slice(0, maxMessages).toReversed();
		if (messages.length === 0) return {
			body: void 0,
			inboundHistory: void 0
		};
		const userNames = /* @__PURE__ */ new Map();
		const resolveUserLabel = async (userId) => {
			const cached = userNames.get(userId);
			if (cached) return cached;
			const label = normalizeOptionalString((await params.ctx.resolveUserName(userId, params.eventScope)).name) ?? userId;
			userNames.set(userId, label);
			return label;
		};
		const entries = [];
		const formatted = [];
		for (const message of messages) {
			const body = normalizeOptionalString(message.text);
			if (!body) continue;
			const isCurrentBot = params.ctx.botUserId && message.user === params.ctx.botUserId || params.ctx.botId && message.bot_id === params.ctx.botId;
			const role = isCurrentBot || message.bot_id ? "assistant" : "user";
			const sender = `${isCurrentBot ? "Assistant" : message.user ? await resolveUserLabel(message.user) : normalizeOptionalString(message.username) ?? (message.bot_id ? "Bot" : "Unknown")} (${role})`;
			const timestamp = resolveSlackTimestampMs(message.ts);
			entries.push({
				sender,
				body,
				timestamp
			});
			formatted.push(formatInboundEnvelope({
				channel: "Slack",
				from: sender,
				timestamp,
				body: `${body}\n[slack message id: ${message.ts ?? "unknown"} channel: ${params.channelId}]`,
				chatType: "direct",
				envelope: params.envelopeOptions
			}));
		}
		return {
			body: formatted.length > 0 ? formatted.join("\n\n") : void 0,
			inboundHistory: entries.length > 0 ? entries : void 0
		};
	} catch (err) {
		logVerbose(`slack: failed to fetch DM history for channel ${params.channelId}: ${formatErrorMessage(err)}`);
		return {
			body: void 0,
			inboundHistory: void 0
		};
	}
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare-thread-context-root.ts
function isSlackThreadAuthorCurrentBot(params) {
	const { identity, author } = params;
	if (identity.botUserId && author.userId && author.userId === identity.botUserId) return true;
	if (identity.botId && author.botId && author.botId === identity.botId) return true;
	return false;
}
function resolveSlackThreadHistoryFilterPolicy(params) {
	if (params.retainCurrentBotHistory) return { currentBot: "all" };
	if (!params.includeBotStarterAsRootContext || !params.starterTs) return { currentBot: "omit" };
	return {
		currentBot: "root-only",
		rootTs: params.starterTs
	};
}
function applySlackThreadHistoryFilterPolicy(params) {
	const kept = [];
	let omittedCurrentBot = 0;
	for (const entry of params.history) {
		if (!isSlackThreadAuthorCurrentBot({
			identity: params.identity,
			author: entry
		})) {
			kept.push(entry);
			continue;
		}
		if (params.policy.currentBot === "all" || params.policy.currentBot === "root-only" && entry.ts === params.policy.rootTs) kept.push(entry);
		else omittedCurrentBot += 1;
	}
	return {
		kept,
		omittedCurrentBot
	};
}
function shouldIncludeBotThreadStarterContext(params) {
	if (!params.hasStarterText) return false;
	return params.starterIsCurrentBot && params.isNewThreadSession;
}
function ensureSlackThreadHistoryHasBotRoot(params) {
	if (!params.includeBotStarterAsRootContext || !params.threadStarter?.text) return params.history;
	if (params.history.some((entry) => entry.ts === params.threadStarter?.ts)) return params.history;
	return [params.threadStarter, ...params.history];
}
function formatSlackBotStarterThreadLabel(params) {
	const base = `Slack thread ${params.roomLabel}`;
	if (!params.starterText) return base;
	const snippet = formatSlackThreadLabelSnippet(params.starterText).trim();
	if (!snippet) return base;
	return `${base} (assistant root): ${snippet}`;
}
function formatSlackThreadLabelSnippet(text) {
	return truncateUtf16Safe(text.replace(/\s+/g, " "), 80);
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare-room-history.ts
const SLACK_HISTORY_MEDIA_MAX_ATTACHMENTS = 4;
const SLACK_HISTORY_MEDIA_MAX_BYTES = 10485760;
const SLACK_HISTORY_MEDIA_IDLE_TIMEOUT_MS = 1e3;
const SLACK_HISTORY_MEDIA_TOTAL_TIMEOUT_MS = 3e3;
async function resolveSlackRoomHistory(params) {
	if (params.ctx.historyLimit <= 0 || !params.message.ts) return [];
	const warnOmission = (reason) => {
		params.ctx.logger.warn({
			accountId: params.ctx.accountId,
			teamId: params.eventScope?.teamId ?? params.ctx.teamId,
			channelId: params.message.channel,
			threadTs: params.threadTs,
			reason
		}, "Slack automatic history omitted");
	};
	try {
		params.assertCurrent();
		const request = {
			channelId: params.message.channel,
			client: params.eventScope?.client ?? params.ctx.app.client,
			currentMessageTs: params.message.ts,
			oldest: params.oldest,
			excludedMessageIds: params.excludedMessageIds,
			limit: Math.max(DEFAULT_GROUP_HISTORY_LIMIT, params.ctx.historyLimit),
			assertCurrent: params.assertCurrent
		};
		const messages = params.threadTs ? await resolveSlackThreadHistory({
			...request,
			threadTs: params.threadTs,
			onOmission: warnOmission
		}) : await resolveSlackChannelHistory(request);
		params.assertCurrent();
		const permitted = [];
		for (const message of messages) {
			if (isSlackThreadAuthorCurrentBot({
				identity: params.ctx,
				author: message
			})) continue;
			const user = message.userId ? await params.ctx.resolveUserName(message.userId, params.eventScope) : void 0;
			params.assertCurrent();
			const senderAllowed = resolveSlackUserAllowed({
				allowList: params.allowFromLower,
				teamId: params.eventScope?.teamId ?? params.ctx.teamId,
				userId: message.userId ?? message.botId,
				userName: user?.name,
				allowNameMatching: params.ctx.allowNameMatching
			});
			if (!shouldIncludeSupplementalContext({
				mode: params.contextVisibilityMode,
				kind: "history",
				senderAllowed
			})) continue;
			permitted.push({
				message,
				sender: user?.name ?? message.userId ?? `Bot (${message.botId ?? "unknown"})`
			});
		}
		const entries = [];
		let mediaRemaining = SLACK_HISTORY_MEDIA_MAX_ATTACHMENTS;
		for (const { message, sender } of permitted.slice(-params.ctx.historyLimit)) {
			const { media, attempted } = mediaRemaining > 0 && (message.files?.length || message.attachments?.length) ? await resolveSlackHistoryMedia({
				ctx: params.ctx,
				eventScope: params.eventScope,
				maxAttachments: mediaRemaining,
				assertCurrent: params.assertCurrent,
				abortSignal: params.abortSignal,
				message: {
					type: "message",
					channel: params.message.channel,
					ts: message.ts,
					user: message.userId,
					bot_id: message.botId,
					text: message.text,
					files: message.files,
					attachments: message.attachments
				}
			}) : {
				media: [],
				attempted: 0
			};
			params.assertCurrent();
			mediaRemaining -= attempted;
			entries.push({
				sender,
				body: message.text,
				timestamp: resolveSlackTimestampMs(message.ts),
				messageId: message.ts,
				...media.length > 0 ? { media } : {}
			});
		}
		return entries;
	} catch (error) {
		warnOmission(formatErrorMessage(error));
		return [];
	}
}
function isSlackImageFileCandidate(file) {
	if ((file.mimetype?.split(";")[0]?.trim().toLowerCase())?.startsWith("image/")) return true;
	return Boolean(mimeTypeFromFilePath(file.name)?.startsWith("image/"));
}
function sliceSlackImageFileCandidates(files, limit) {
	if (limit <= 0 || !files?.length) return [];
	return files.filter(isSlackImageFileCandidate).slice(0, limit);
}
function sliceSlackHistoryAttachmentCandidates(attachments, limit) {
	if (limit <= 0 || !attachments?.length) return [];
	const out = [];
	let remaining = limit;
	for (const attachment of attachments) {
		if (attachment.is_share !== true) continue;
		const hasImageUrl = Boolean(normalizeOptionalString(attachment.image_url));
		const files = sliceSlackImageFileCandidates(attachment.files, remaining - (hasImageUrl ? 1 : 0));
		if (!hasImageUrl && files.length === 0) continue;
		out.push({
			...attachment,
			files
		});
		remaining -= (hasImageUrl ? 1 : 0) + files.length;
		if (remaining <= 0) break;
	}
	return out;
}
function buildSlackHistoryMediaCandidateMessage(message, maxAttachments) {
	const files = sliceSlackImageFileCandidates(message.files, maxAttachments);
	const attachments = sliceSlackHistoryAttachmentCandidates(message.attachments, Math.max(0, maxAttachments - files.length));
	if (files.length === 0 && attachments.length === 0) return null;
	return {
		message: {
			...message,
			files,
			attachments
		},
		attempted: files.length + attachments.reduce((count, attachment) => count + (normalizeOptionalString(attachment.image_url) ? 1 : 0) + (attachment.files?.length ?? 0), 0)
	};
}
async function resolveSlackHistoryMedia(params) {
	const candidate = buildSlackHistoryMediaCandidateMessage(params.message, params.maxAttachments);
	if (!candidate) return {
		media: [],
		attempted: 0
	};
	const content = await resolveSlackMessageContent({
		message: candidate.message,
		isThreadReply: false,
		threadStarter: null,
		isBotMessage: Boolean(params.message.bot_id),
		client: params.eventScope?.client ?? params.ctx.app.client,
		botToken: params.ctx.botToken,
		mediaMaxBytes: Math.min(params.ctx.mediaMaxBytes, SLACK_HISTORY_MEDIA_MAX_BYTES),
		mediaReadIdleTimeoutMs: SLACK_HISTORY_MEDIA_IDLE_TIMEOUT_MS,
		mediaTotalTimeoutMs: SLACK_HISTORY_MEDIA_TOTAL_TIMEOUT_MS,
		assertCurrent: params.assertCurrent,
		abortSignal: params.abortSignal
	});
	return {
		media: await toInboundMediaFactsWithMetadata(content?.effectiveDirectMedia, {
			kind: "image",
			messageId: params.message.ts
		}),
		attempted: candidate.attempted
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare-thread-context.ts
const loadSlackMediaModule = createLazyRuntimeModule(() => import("./actions-DKCtBgCI.mjs").then((n) => n._));
const SLACK_THREAD_CONTEXT_USER_LOOKUP_CONCURRENCY = 4;
function resolveSlackThreadSessionFreshness(params) {
	return params.ctx.channelRuntime?.session?.resolveEntryResetFreshness?.({
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		sessionCfg: params.ctx.cfg.session,
		resetType: "thread",
		resetOverride: resolveChannelResetConfig({
			sessionCfg: params.ctx.cfg.session,
			channel: "slack"
		})
	});
}
async function resolveSlackThreadUserMap(params) {
	const uniqueUserIds = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of params.messages) {
		if (!item.userId || seen.has(item.userId)) continue;
		seen.add(item.userId);
		uniqueUserIds.push(item.userId);
	}
	const userMap = /* @__PURE__ */ new Map();
	if (uniqueUserIds.length === 0) return userMap;
	const { results } = await runTasksWithConcurrency({
		tasks: uniqueUserIds.map((id) => async () => {
			const user = await params.ctx.resolveUserName(id, params.eventScope);
			return user ? {
				id,
				user
			} : null;
		}),
		limit: SLACK_THREAD_CONTEXT_USER_LOOKUP_CONCURRENCY
	});
	for (const result of results) if (result) userMap.set(result.id, result.user);
	return userMap;
}
async function resolveSlackThreadContextData(params) {
	const botIdentity = {
		botUserId: params.ctx.botUserId,
		botId: params.ctx.botId
	};
	const isCurrentBotAuthor = (author) => isSlackThreadAuthorCurrentBot({
		identity: botIdentity,
		author
	});
	let threadStarterBody;
	let threadHistoryBody;
	let threadLabel;
	let threadStarterMedia = null;
	const threadSessionFreshness = params.isThreadReply && params.threadTs ? resolveSlackThreadSessionFreshness({
		ctx: params.ctx,
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}) : void 0;
	const threadSessionPreviousTimestamp = params.isThreadReply && params.threadTs && !threadSessionFreshness ? readSessionUpdatedAt({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}) : void 0;
	const isMissingThreadSession = threadSessionFreshness ? threadSessionFreshness.state === "missing" : threadSessionPreviousTimestamp === void 0;
	const isOutboundOnlyThreadSession = threadSessionFreshness !== void 0 && threadSessionFreshness.state !== "missing" && threadSessionFreshness.entry.lastInteractionAt === void 0 && threadSessionFreshness.entry.updatedAt !== 0;
	const shouldSeedInitialThreadContext = Boolean(params.isThreadReply && params.threadTs && (threadSessionFreshness ? threadSessionFreshness.state !== "fresh" || isOutboundOnlyThreadSession : threadSessionPreviousTimestamp === void 0));
	const shouldLoadInitialThreadHistory = shouldSeedInitialThreadContext || params.forceInitialHistory === true;
	if (!params.isThreadReply || !params.threadTs) return {
		threadStarterBody,
		threadHistoryBody,
		shouldSeedInitialThreadContext,
		threadLabel,
		threadStarterMedia
	};
	const starter = params.threadStarter;
	const starterSenderName = params.allowNameMatching && params.allowFromLower.length > 0 && starter?.userId ? (await params.ctx.resolveUserName(starter.userId, params.eventScope))?.name : void 0;
	params.assertHistoryCurrent?.();
	const starterIsCurrentBot = Boolean(starter && isCurrentBotAuthor({
		userId: starter.userId,
		botId: starter.botId
	}));
	const starterAllowed = !starter || !starterIsCurrentBot && resolveSlackUserAllowed({
		allowList: params.allowFromLower,
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		allowNameMatching: params.allowNameMatching,
		userId: starter.userId ?? starter.botId,
		userName: starterSenderName
	});
	const includeStarterContext = !starter || !starterIsCurrentBot && shouldIncludeSupplementalContext({
		mode: params.contextVisibilityMode,
		kind: "thread",
		senderAllowed: starterAllowed
	});
	if (starter?.text && includeStarterContext) {
		threadStarterBody = starter.text;
		const snippet = formatSlackThreadLabelSnippet(starter.text);
		threadLabel = `Slack thread ${params.roomLabel}${snippet ? `: ${snippet}` : ""}`;
		if (shouldSeedInitialThreadContext && !params.effectiveDirectMedia && starter.files && starter.files.length > 0) {
			const { resolveSlackAttachmentContent } = await loadSlackMediaModule();
			params.assertHistoryCurrent?.();
			const attachmentContent = await resolveSlackAttachmentContent({
				files: starter.files,
				client: params.eventScope?.client ?? params.ctx.app.client,
				token: params.ctx.botToken,
				maxBytes: params.ctx.mediaMaxBytes,
				assertCurrent: params.assertHistoryCurrent,
				abortSignal: params.abortSignal
			});
			params.assertHistoryCurrent?.();
			threadStarterMedia = attachmentContent?.media.length ? attachmentContent.media : null;
			if (attachmentContent) threadStarterBody = formatSlackUnavailableMedia({
				body: threadStarterBody,
				files: attachmentContent.files,
				unavailableMediaCount: attachmentContent.unavailableMediaCount,
				prependUnavailable: true
			});
			if (threadStarterMedia) {
				const starterPlaceholders = threadStarterMedia.map((item) => item.placeholder).join(", ");
				logVerbose(`slack: hydrated thread starter file ${starterPlaceholders} from root message`);
			}
		}
	} else threadLabel = `Slack thread ${params.roomLabel}`;
	const includeBotStarterAsRootContext = shouldIncludeBotThreadStarterContext({
		starterIsCurrentBot,
		isNewThreadSession: shouldSeedInitialThreadContext,
		hasStarterText: Boolean(starter?.text)
	});
	if (starter?.text && starterIsCurrentBot && !includeBotStarterAsRootContext) logVerbose("slack: omitted current-bot thread starter from context");
	else if (starter?.text && !includeStarterContext && !starterIsCurrentBot) logVerbose(`slack: omitted thread starter from context (mode=${params.contextVisibilityMode}, sender_allowed=${starterAllowed ? "yes" : "no"})`);
	else if (includeBotStarterAsRootContext) {
		threadLabel = formatSlackBotStarterThreadLabel({
			roomLabel: params.roomLabel,
			starterText: starter?.text
		});
		logVerbose("slack: retained current-bot thread starter as assistant root context");
	}
	const threadInitialHistoryLimit = Math.min(params.account.config?.thread?.initialHistoryLimit ?? 20, params.historyLimit ?? Number.POSITIVE_INFINITY);
	if (threadInitialHistoryLimit > 0 && shouldLoadInitialThreadHistory) {
		const currentBotRootTs = starter?.ts ?? params.threadTs;
		let historyOmitted = false;
		const threadHistory = await resolveSlackThreadHistory({
			channelId: params.message.channel,
			threadTs: params.threadTs,
			client: params.eventScope?.client ?? params.ctx.app.client,
			currentMessageTs: params.message.ts,
			limit: threadInitialHistoryLimit,
			excludedMessageIds: params.excludedMessageIds,
			assertCurrent: params.assertHistoryCurrent,
			onOmission: (reason) => {
				historyOmitted = true;
				params.ctx.logger.warn({
					channelId: params.message.channel,
					threadTs: params.threadTs,
					teamId: params.eventScope?.teamId ?? params.ctx.teamId,
					accountId: params.account.accountId,
					reason
				}, "Slack automatic thread history omitted");
			}
		});
		if (historyOmitted) return {
			threadStarterBody,
			threadHistoryBody,
			shouldSeedInitialThreadContext,
			threadLabel,
			threadStarterMedia
		};
		const enrichedStarter = starter && threadStarterBody && threadStarterBody !== starter.text ? {
			...starter,
			text: threadStarterBody,
			ts: currentBotRootTs
		} : null;
		const threadHistoryWithBotRoot = ensureSlackThreadHistoryHasBotRoot({
			history: enrichedStarter && !threadHistory.some((entry) => entry.ts === currentBotRootTs) ? [enrichedStarter, ...threadHistory.length >= threadInitialHistoryLimit ? threadHistory.slice(1) : threadHistory] : threadHistory,
			includeBotStarterAsRootContext,
			threadStarter: starter ? {
				...starter,
				ts: currentBotRootTs
			} : null
		});
		if (threadHistoryWithBotRoot.length > 0) {
			const { kept: threadHistoryWithoutCurrentBot, omittedCurrentBot: omittedCurrentBotHistoryCount } = applySlackThreadHistoryFilterPolicy({
				history: threadHistoryWithBotRoot,
				policy: resolveSlackThreadHistoryFilterPolicy({
					includeBotStarterAsRootContext,
					starterTs: currentBotRootTs,
					retainCurrentBotHistory: params.isGroupDm && (isMissingThreadSession || isOutboundOnlyThreadSession)
				}),
				identity: botIdentity
			});
			const userMapForFilter = params.contextVisibilityMode !== "all" && params.allowNameMatching && params.allowFromLower.length > 0 ? await resolveSlackThreadUserMap({
				ctx: params.ctx,
				messages: threadHistoryWithoutCurrentBot,
				eventScope: params.eventScope
			}) : /* @__PURE__ */ new Map();
			params.assertHistoryCurrent?.();
			const { items: filteredThreadHistory, omitted: omittedHistoryCount } = params.contextVisibilityMode === "all" ? {
				items: threadHistoryWithoutCurrentBot,
				omitted: 0
			} : filterSupplementalContextItems({
				items: threadHistoryWithoutCurrentBot,
				mode: params.contextVisibilityMode,
				kind: "thread",
				isSenderAllowed: (historyMsg) => {
					if (isCurrentBotAuthor({
						userId: historyMsg.userId,
						botId: historyMsg.botId
					})) return true;
					const msgUser = historyMsg.userId ? userMapForFilter.get(historyMsg.userId) : null;
					return resolveSlackUserAllowed({
						allowList: params.allowFromLower,
						teamId: params.eventScope?.teamId ?? params.ctx.teamId,
						allowNameMatching: params.allowNameMatching,
						userId: historyMsg.userId ?? historyMsg.botId,
						userName: msgUser?.name
					});
				}
			});
			const userMap = await resolveSlackThreadUserMap({
				ctx: params.ctx,
				messages: filteredThreadHistory,
				eventScope: params.eventScope
			});
			params.assertHistoryCurrent?.();
			if (omittedHistoryCount > 0 || omittedCurrentBotHistoryCount > 0) logVerbose(`slack: omitted ${omittedHistoryCount + omittedCurrentBotHistoryCount} thread message(s) from context (mode=${params.contextVisibilityMode})`);
			const historyParts = [];
			for (const historyMsg of filteredThreadHistory) {
				const msgUser = historyMsg.userId ? userMap.get(historyMsg.userId) : null;
				const isCurrentBot = isCurrentBotAuthor({
					userId: historyMsg.userId,
					botId: historyMsg.botId
				});
				const role = isCurrentBot || historyMsg.botId ? "assistant" : "user";
				const msgSenderName = isCurrentBot ? "Bot (this assistant)" : msgUser?.name ?? (historyMsg.botId ? `Bot (${historyMsg.botId})` : "Unknown");
				const msgWithId = `${historyMsg.ts === currentBotRootTs && threadStarterBody ? threadStarterBody : historyMsg.text}\n[slack message id: ${historyMsg.ts ?? "unknown"} channel: ${params.message.channel}]`;
				historyParts.push(formatInboundEnvelope({
					channel: "Slack",
					from: `${msgSenderName} (${role})`,
					timestamp: resolveSlackTimestampMs(historyMsg.ts),
					body: msgWithId,
					chatType: "channel",
					envelope: params.envelopeOptions
				}));
			}
			if (historyParts.length > 0) {
				threadHistoryBody = historyParts.join("\n\n");
				logVerbose(`slack: populated thread history with ${filteredThreadHistory.length} messages for new session`);
			}
		}
	}
	return {
		threadStarterBody,
		threadHistoryBody,
		shouldSeedInitialThreadContext,
		threadLabel,
		threadStarterMedia
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/subteam-mentions.ts
const SUBTEAM_MENTION_RE = /<!subteam\^([A-Z0-9]+)(?:\|[^>]*)?>/gi;
const SUBTEAM_MEMBER_CACHE_TTL_MS = 3e5;
const subteamMemberCache = /* @__PURE__ */ new WeakMap();
function normalizeSlackId(value) {
	return typeof value === "string" && value.trim() ? value.trim().toUpperCase() : void 0;
}
function extractSlackSubteamMentionIds(text) {
	if (!text) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const match of text.matchAll(SUBTEAM_MENTION_RE)) {
		const id = normalizeSlackId(match[1]);
		if (id) ids.add(id);
	}
	return [...ids];
}
async function readSlackSubteamUsers(params) {
	let bySubteam = subteamMemberCache.get(params.client);
	if (!bySubteam) {
		bySubteam = /* @__PURE__ */ new Map();
		subteamMemberCache.set(params.client, bySubteam);
	}
	const cacheKey = `${normalizeSlackId(params.teamId) ?? ""}:${params.subteamId}`;
	const cached = bySubteam.get(cacheKey);
	const now = asDateTimestampMs(params.now);
	if (cached) {
		if (now !== void 0 && asDateTimestampMs(cached.expiresAt) !== void 0 && cached.expiresAt > now) return cached.users;
		bySubteam.delete(cacheKey);
	}
	try {
		const response = await params.client.usergroups.users.list({
			usergroup: params.subteamId,
			...params.teamId ? { team_id: params.teamId } : {}
		});
		if (!response.ok) {
			params.log?.(`slack: failed to resolve user-group mention ${params.subteamId}: ${response.error ?? "unknown_error"}`);
			return /* @__PURE__ */ new Set();
		}
		const users = new Set((response.users ?? []).map((userId) => normalizeSlackId(userId)).filter(Boolean));
		const expiresAt = resolveExpiresAtMsFromDurationMs(SUBTEAM_MEMBER_CACHE_TTL_MS, { nowMs: params.now });
		if (expiresAt !== void 0) bySubteam.set(cacheKey, {
			expiresAt,
			users
		});
		return users;
	} catch (err) {
		params.log?.(`slack: failed to resolve user-group mention ${params.subteamId}: ${formatErrorMessage(err)}`);
		return /* @__PURE__ */ new Set();
	}
}
async function isSlackSubteamMentionForBot(params) {
	const botUserId = normalizeSlackId(params.botUserId);
	if (!botUserId) return false;
	const subteamIds = extractSlackSubteamMentionIds(params.text);
	if (subteamIds.length === 0) return false;
	const now = params.now ?? Date.now();
	for (const subteamId of subteamIds) if ((await readSlackSubteamUsers({
		client: params.client,
		subteamId,
		teamId: normalizeOptionalString(params.teamId),
		now,
		log: params.log
	})).has(botUserId)) return true;
	return false;
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare.ts
const mentionRegexCache = /* @__PURE__ */ new WeakMap();
const SLACK_ANY_MENTION_RE = /<@[^>]+>|<!subteam\^[^>]+>/;
const SLACK_USER_MENTION_RE = /<@([^>|]+)(?:\|[^>]+)?>/g;
const SLACK_SUBTEAM_MENTION_RE = /<!subteam\^([^>|]+)(?:\|[^>]+)?>/g;
const SLACK_SUBTEAM_MENTION_MARKER = "<!subteam^";
const SLACK_CHANNEL_ACCESS_DOCS_URL = "https://docs.openclaw.ai/channels/slack#access-control-and-routing";
function resolveSlackGroupSessionSubject(params) {
	const channelName = normalizeOptionalString(params.channelName);
	const workspaceName = normalizeOptionalString(params.workspaceName);
	if (channelName && workspaceName) return `${workspaceName} #${channelName}`;
	return `Slack Channel (Workspace ID: ${params.workspaceId}, Channel ID: ${params.channelId})`;
}
function recordString(record, key) {
	return normalizeOptionalString(record?.[key]);
}
function recordNullableString(record, key) {
	const value = record?.[key];
	return value === null ? null : normalizeOptionalString(value);
}
function mergeSlackAssistantThreadContext(primary, fallback) {
	if (!primary) return fallback;
	if (!fallback) return primary;
	return {
		assistantChannelId: primary.assistantChannelId || fallback.assistantChannelId,
		threadTs: primary.threadTs || fallback.threadTs,
		userId: primary.userId ?? fallback.userId,
		channelId: primary.channelId ?? fallback.channelId,
		teamId: primary.teamId ?? fallback.teamId,
		enterpriseId: primary.enterpriseId !== void 0 ? primary.enterpriseId : fallback.enterpriseId
	};
}
function hasSlackAssistantThreadMetadata(context) {
	return Boolean(context?.channelId || context?.teamId || context?.enterpriseId !== void 0);
}
function resolveSlackMessageAssistantThreadContext(message) {
	const thread = asOptionalRecord(message.assistant_thread);
	if (!thread) return;
	const context = asOptionalRecord(thread.context);
	const assistantChannelId = recordString(thread, "channel_id") ?? message.channel;
	const threadTs = recordString(thread, "thread_ts") ?? message.thread_ts ?? message.ts;
	if (!assistantChannelId || !threadTs) return;
	return {
		assistantChannelId,
		threadTs,
		userId: recordString(thread, "user_id") ?? message.user,
		channelId: recordString(context, "channel_id"),
		teamId: recordString(context, "team_id"),
		enterpriseId: recordNullableString(context, "enterprise_id")
	};
}
async function restoreSlackAssistantThreadContextFromMetadata(params) {
	const threadTs = params.message.thread_ts;
	const parentUserId = params.message.parent_user_id?.trim();
	if (!params.message.channel || !threadTs || !parentUserId || parentUserId !== params.ctx.botUserId && parentUserId !== params.ctx.botId) return;
	try {
		return await readSlackAssistantThreadContext({
			client: params.eventScope?.client ?? params.ctx.app.client,
			channelId: params.message.channel,
			threadTs,
			userId: params.message.user
		});
	} catch (err) {
		logVerbose(`slack assistant context restore failed channel=${params.message.channel} ts=${threadTs}: ${formatErrorMessage(err)}`);
	}
}
function resolveCachedMentionRegexes(ctx, agentId, options) {
	const key = [
		normalizeOptionalString(agentId) ?? "__default__",
		normalizeOptionalString(options?.provider),
		normalizeOptionalString(options?.conversationId ?? void 0),
		options?.providerPolicy ? JSON.stringify(options.providerPolicy) : ""
	].join("");
	let byAgent = mentionRegexCache.get(ctx);
	if (!byAgent) {
		byAgent = /* @__PURE__ */ new Map();
		mentionRegexCache.set(ctx, byAgent);
	}
	const cached = byAgent.get(key);
	if (cached) return cached;
	const built = buildMentionRegexes(ctx.cfg, agentId, options);
	byAgent.set(key, built);
	return built;
}
function collectUniqueSlackMentionIds(text, regex) {
	const ids = [];
	regex.lastIndex = 0;
	for (const match of text.matchAll(regex)) {
		const id = normalizeSlackId(match[1]);
		if (id && !ids.includes(id)) ids.push(id);
	}
	return ids;
}
function collectSlackMentionMetadata(text) {
	return {
		mentionedUserIds: collectUniqueSlackMentionIds(text, SLACK_USER_MENTION_RE),
		mentionedSubteamIds: collectUniqueSlackMentionIds(text, SLACK_SUBTEAM_MENTION_RE),
		hasAnyMention: SLACK_ANY_MENTION_RE.test(text),
		hasSubteamMention: text.includes(SLACK_SUBTEAM_MENTION_MARKER)
	};
}
async function resolveSlackExplicitMentionState(params) {
	const normalizedBotUserId = normalizeSlackId(params.ctx.botUserId);
	const explicitlyMentionedBotUser = Boolean(normalizedBotUserId && params.mentionedUserIds.includes(normalizedBotUserId));
	const explicitlyMentionedBotSubteam = Boolean(params.ctx.botUserId && params.hasSubteamMention) && await isSlackSubteamMentionForBot({
		client: params.eventScope?.client ?? params.ctx.app.client,
		text: params.messageText,
		botUserId: params.ctx.botUserId,
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		log: logVerbose
	});
	return {
		explicitlyMentionedBotUser,
		explicitlyMentionedBotSubteam,
		explicitlyMentioned: explicitlyMentionedBotUser || explicitlyMentionedBotSubteam || params.source === "app_mention"
	};
}
function resolveSlackMentionSource(params) {
	if (params.explicitBotMention) return "explicit_bot";
	if (params.explicitSubteamMention) return "subteam";
	if (params.shouldBypassMention) return "command_bypass";
	if (params.wasMentioned) return "mention_pattern";
	if (params.matchedImplicitMentionKinds.length > 0) return "implicit_thread";
	return "none";
}
async function resolveSlackConversationContext(params) {
	const { ctx, account, message } = params;
	const cfg = ctx.cfg;
	let channelInfo = {};
	let resolvedChannelType = normalizeSlackChannelType(message.channel_type, message.channel);
	if (resolvedChannelType !== "im" && (!message.channel_type || message.channel_type !== "im")) {
		channelInfo = await ctx.resolveChannelName(message.channel, params.eventScope);
		resolvedChannelType = normalizeSlackChannelType(message.channel_type ?? channelInfo.type ?? ctx.recallSlackChannelType(message.channel, params.eventScope), message.channel);
	}
	const channelName = channelInfo?.name;
	const isDirectMessage = resolvedChannelType === "im";
	const isGroupDm = resolvedChannelType === "mpim";
	const isRoom = resolvedChannelType === "channel" || resolvedChannelType === "group";
	const isRoomish = isRoom || isGroupDm;
	const channelConfig = isRoom ? resolveSlackChannelConfig({
		teamId: params.eventScope?.teamId ?? ctx.teamId,
		allowUnscoped: ctx.installationIdentity?.kind !== "enterprise",
		channelId: message.channel,
		channelName,
		channels: ctx.channelsConfig,
		channelKeys: ctx.channelsConfigKeys,
		defaultRequireMention: ctx.defaultRequireMention,
		allowNameMatching: ctx.allowNameMatching
	}) : null;
	const allowBotsSetting = channelConfig?.allowBots ?? account.config?.allowBots ?? cfg.channels?.slack?.allowBots ?? false;
	return {
		channelInfo,
		channelName,
		resolvedChannelType,
		isDirectMessage,
		isGroupDm,
		isRoom,
		isRoomish,
		channelConfig,
		allowBotsMode: allowBotsSetting === "mentions" ? "mentions" : allowBotsSetting ? "all" : "off",
		isBotMessage: Boolean(message.bot_id)
	};
}
async function authorizeSlackInboundMessage(params) {
	const { ctx, account, message, conversation, drop } = params;
	const { isDirectMessage, channelName, resolvedChannelType, isBotMessage, allowBotsMode } = conversation;
	if (isBotMessage) {
		if (message.user && ctx.botUserId && message.user === ctx.botUserId) return null;
		if (allowBotsMode === "off") return drop("bot-disabled");
	}
	if (isDirectMessage && !message.user) return drop("missing-user");
	const senderId = message.user ?? (isBotMessage ? message.bot_id : void 0);
	if (!senderId) return drop("missing-sender");
	if (!ctx.isChannelAllowed({
		teamId: params.eventScope?.teamId ?? ctx.teamId,
		channelId: message.channel,
		channelName,
		channelType: resolvedChannelType
	})) {
		if (conversation.isRoom && ctx.groupPolicy === "allowlist" && params.explicitBotMention && !isBotMessage && message.user) {
			let subject = "This OpenClaw bot";
			if (ctx.botUserId) try {
				const botIdentity = await ctx.resolveUserName(ctx.botUserId, params.eventScope);
				const botName = normalizeOptionalString(botIdentity?.name);
				if (botName) subject = escapeSlackMrkdwn(botName);
			} catch (error) {
				logVerbose(`slack allowlist denial bot-name lookup failed: ${formatSlackError(error)}`);
			}
			try {
				await (params.eventScope?.client ?? ctx.app.client).chat.postEphemeral({
					token: ctx.botToken,
					channel: message.channel,
					user: message.user,
					text: `${subject} can’t reply here because this channel isn’t in its OpenClaw channel allowlist. Ask the OpenClaw owner to allow this channel. <${SLACK_CHANNEL_ACCESS_DOCS_URL}|Learn how to configure Slack channel access.>`
				});
				params.onVisibleDrop?.();
			} catch (error) {
				ctx.runtime.error?.(`slack allowlist denial notice failed for channel ${message.channel}: ${formatSlackError(error)}`);
			}
		}
		return drop("channel-not-allowed");
	}
	const allowFromLower = await resolveSlackEffectiveAllowFrom(ctx, {
		includePairingStore: isDirectMessage,
		eventScope: params.eventScope
	});
	if (isDirectMessage) {
		const directUserId = message.user;
		if (!directUserId) return drop("missing-user");
		let dropReason = "dm-unauthorized";
		if (!await authorizeSlackDirectMessage({
			ctx,
			accountId: account.accountId,
			senderId: directUserId,
			eventScope: params.eventScope,
			allowFromLower,
			resolveSenderName: (userId) => ctx.resolveUserName(userId, params.eventScope),
			sendPairingReply: async (text) => {
				await sendMessageSlack(message.channel, text, {
					cfg: ctx.cfg,
					token: ctx.botToken,
					client: params.eventScope?.client ?? ctx.app.client,
					accountId: account.accountId,
					eventScope: params.eventScope
				});
			},
			onDisabled: () => {
				dropReason = "dm-disabled";
			},
			onUnauthorized: ({ allowMatchMeta }) => {
				logVerbose(`Blocked unauthorized slack sender ${message.user} (dmPolicy=${ctx.dmPolicy}, ${allowMatchMeta})`);
			},
			log: logVerbose
		})) return drop(dropReason);
	}
	return {
		senderId,
		allowFromLower
	};
}
async function prepareSlackMessage(params) {
	const { ctx, account, message, opts } = params;
	const drop = (reason, parentUserId) => {
		ctx.logger.info({
			provider: "slack",
			accountId: account.accountId,
			teamId: opts.eventScope?.teamId ?? ctx.teamId,
			channelId: message.channel,
			messageTs: message.ts,
			source: opts.source,
			reason,
			...parentUserId ? { parentUserId } : {}
		}, "Slack inbound event rejected during preparation");
		return null;
	};
	const slackClient = opts.eventScope?.client ?? ctx.app.client;
	const threadStarterWorkspaceScope = {
		accountId: account.accountId,
		teamId: opts.eventScope?.teamId ?? ctx.teamId
	};
	const cfg = ctx.cfg;
	const conversation = await resolveSlackConversationContext({
		ctx,
		account,
		message,
		eventScope: opts.eventScope
	});
	const { channelInfo, channelName, isDirectMessage, isGroupDm, isRoom, isRoomish, channelConfig, allowBotsMode, isBotMessage } = conversation;
	const messageText = message.text ?? "";
	const mentionMetadata = collectSlackMentionMetadata(messageText);
	const normalizedBotUserId = normalizeSlackId(ctx.botUserId);
	const authorization = await authorizeSlackInboundMessage({
		ctx,
		account,
		message,
		conversation,
		explicitBotMention: opts.source === "app_mention" || Boolean(normalizedBotUserId && mentionMetadata.mentionedUserIds.includes(normalizedBotUserId)),
		eventScope: opts.eventScope,
		onVisibleDrop: opts.onVisibleDrop,
		drop
	});
	if (!authorization) return null;
	const { senderId, allowFromLower } = authorization;
	let resolvedSenderName = normalizeOptionalString(message.username);
	const resolveSenderName = async () => {
		if (resolvedSenderName) return resolvedSenderName;
		if (message.user) {
			const sender = await ctx.resolveUserName(message.user, opts.eventScope);
			const normalized = normalizeOptionalString(sender?.name);
			if (normalized) {
				resolvedSenderName = normalized;
				return resolvedSenderName;
			}
		}
		resolvedSenderName = message.user ?? message.bot_id ?? "unknown";
		return resolvedSenderName;
	};
	const { mentionedUserIds, mentionedSubteamIds, hasAnyMention } = mentionMetadata;
	const messageAssistantThreadContext = resolveSlackMessageAssistantThreadContext(message);
	const assistantContextLookupChannelId = messageAssistantThreadContext?.assistantChannelId ?? message.channel;
	const assistantContextLookupThreadTs = messageAssistantThreadContext?.threadTs ?? message.thread_ts ?? message.ts;
	const cachedAssistantThreadContext = isDirectMessage ? ctx.getSlackAssistantThreadContext(assistantContextLookupChannelId, assistantContextLookupThreadTs, opts.eventScope) : void 0;
	const restoredAssistantThreadContextPromise = isDirectMessage && !cachedAssistantThreadContext && !hasSlackAssistantThreadMetadata(messageAssistantThreadContext) ? restoreSlackAssistantThreadContextFromMetadata({
		ctx,
		message,
		eventScope: opts.eventScope
	}) : Promise.resolve(void 0);
	const { explicitlyMentionedBotUser, explicitlyMentionedBotSubteam, explicitlyMentioned } = await resolveSlackExplicitMentionState({
		ctx,
		messageText,
		mentionedUserIds,
		hasSubteamMention: mentionMetadata.hasSubteamMention,
		source: opts.source,
		eventScope: opts.eventScope
	});
	const channelRequireMention = channelConfig?.requireMention ?? ctx.defaultRequireMention ?? true;
	const channelChatType = isDirectMessage ? "direct" : isGroupDm ? "group" : "channel";
	const restoredAssistantThreadContext = await restoredAssistantThreadContextPromise;
	const assistantThreadContext = mergeSlackAssistantThreadContext(messageAssistantThreadContext, cachedAssistantThreadContext ?? restoredAssistantThreadContext);
	const assistantThreadContextToCache = messageAssistantThreadContext || restoredAssistantThreadContext ? assistantThreadContext : void 0;
	if (assistantThreadContextToCache) ctx.saveSlackAssistantThreadContext(assistantThreadContextToCache, opts.eventScope);
	const hasAgentViewMessageSignal = isDirectMessage && !opts.eventScope && !assistantThreadContext && isSlackAppContext(message.app_context);
	if (hasAgentViewMessageSignal) await ctx.recordSlackAgentView();
	const managedViewThreadTs = message.thread_ts;
	const isManagedViewRoot = isDirectMessage && !opts.eventScope && !assistantThreadContext && !message.parent_user_id && Boolean(managedViewThreadTs && message.ts && managedViewThreadTs === message.ts);
	if (isManagedViewRoot && managedViewThreadTs) await ctx.recordSlackManagedViewThread(message.channel, managedViewThreadTs);
	const hasManagedViewThread = isDirectMessage && !opts.eventScope && !assistantThreadContext && Boolean(managedViewThreadTs && await ctx.isSlackManagedViewThread(message.channel, managedViewThreadTs));
	const isAgentViewMessage = isDirectMessage && !opts.eventScope && !assistantThreadContext && (hasAgentViewMessageSignal || isManagedViewRoot || hasManagedViewThread || await ctx.isSlackAgentView());
	const agentViewThreadTs = isAgentViewMessage ? message.thread_ts ?? message.ts : void 0;
	const channelReplyToMode = channelConfig?.replyToMode ?? resolveSlackReplyToMode(account, channelChatType);
	const willImplicitlyThreadReply = isRoom && !channelRequireMention && channelReplyToMode !== "off";
	const seedTopLevelRoomThreadBySource = opts.source === "app_mention" || opts.wasMentioned === true || explicitlyMentioned || willImplicitlyThreadReply;
	const resolveMessageRouting = (seedTopLevelRoomThread) => resolveSlackRoutingContext({
		ctx,
		account,
		message,
		isDirectMessage,
		isGroupDm,
		isRoom,
		isRoomish,
		channelConfig,
		seedTopLevelRoomThread,
		assistantThreadTs: assistantThreadContext?.threadTs,
		agentViewThreadTs,
		eventScope: opts.eventScope
	});
	let routing = resolveMessageRouting(seedTopLevelRoomThreadBySource);
	const groupThreadPeerId = isDirectMessage ? qualifySlackRoutePeerId({
		id: message.user ?? "unknown",
		kind: "user",
		eventScope: opts.eventScope
	}) : message.channel;
	const groupThreadConfigured = !isGroupThreadRouteExclusive({
		sessionKey: routing.sessionKey,
		acpBinding: Boolean(routing.configuredBinding)
	}) && resolveGroupThreadConfig({
		cfg,
		channel: "slack",
		peerId: groupThreadPeerId
	})?.qualified === true;
	let groupThread;
	let mentionCheckTranscript;
	const resolveWasMentioned = (mentionRegexes) => Boolean(groupThread?.mentionedAgentIds.length) || (opts.wasMentioned ?? (!isDirectMessage && matchesMentionWithExplicit({
		text: messageText,
		mentionRegexes,
		explicit: {
			hasAnyMention,
			isExplicitlyMentioned: explicitlyMentioned,
			canResolveExplicit: Boolean(ctx.botUserId)
		},
		transcript: mentionCheckTranscript
	})));
	const buildPolicyMentionRegexes = (agentId) => resolveCachedMentionRegexes(ctx, agentId, {
		provider: "slack",
		conversationId: formatSlackTarget({
			teamId: opts.eventScope?.teamId,
			kind: "channel",
			id: message.channel
		}),
		providerPolicy: account.config.mentionPatterns
	});
	let mentionRegexes = buildPolicyMentionRegexes(routing.route.agentId);
	let wasMentioned = resolveWasMentioned(mentionRegexes);
	const hasBoundSession = Boolean(routing.runtimeBoundSessionKey || routing.configuredBindingSessionKey);
	let { route, runtimeBinding, replyToMode, threadContext, threadTs, isThreadReply, threadKeys, sessionKey } = routing;
	const { configuredBinding, configuredBindingSessionKey } = routing;
	const isAssistantThreadMessage = Boolean(isDirectMessage && messageAssistantThreadContext);
	const forcedAssistantReplyThreadTs = Boolean(assistantThreadContext?.threadTs && (isThreadReply || isAssistantThreadMessage || replyToMode !== "off")) ? assistantThreadContext?.threadTs : void 0;
	const forcedReplyThreadTs = agentViewThreadTs ?? forcedAssistantReplyThreadTs;
	if (runtimeBinding && shouldLogVerbose()) logVerbose(`slack: routed via bound conversation ${runtimeBinding.conversation.conversationId} -> ${runtimeBinding.targetSessionKey}`);
	if (configuredBinding) {
		const ensured = await ensureConfiguredBindingRouteReady({
			cfg,
			bindingResolution: configuredBinding
		});
		if (ensured.ok) {
			if (shouldLogVerbose()) logVerbose(`slack: using configured ACP binding for ${configuredBinding.record.conversation.conversationId} -> ${configuredBindingSessionKey}`);
		} else {
			if (shouldLogVerbose()) logVerbose(`slack: configured ACP binding unavailable for ${configuredBinding.record.conversation.conversationId}: ${ensured.error}`);
			return drop("configured-binding-unavailable");
		}
	}
	const senderNameForAuthPromise = ctx.allowNameMatching ? resolveSenderName().then((name) => ({
		ok: true,
		name
	}), (error) => ({
		ok: false,
		error
	})) : Promise.resolve({
		ok: true,
		name: void 0
	});
	let implicitMentionKinds = [];
	if (!isDirectMessage && message.thread_ts && !wasMentioned) {
		const replyToBotKinds = implicitMentionKindWhen("reply_to_bot", Boolean(ctx.botUserId && message.parent_user_id === ctx.botUserId));
		implicitMentionKinds = replyToBotKinds.length > 0 ? replyToBotKinds : implicitMentionKindWhen("bot_thread_participant", await hasSlackThreadParticipationWithPersistence({
			accountId: account.accountId,
			channelId: message.channel,
			threadTs: message.thread_ts,
			teamId: opts.eventScope?.teamId
		}));
	}
	let threadStarterPromise;
	const getThreadStarter = () => {
		threadStarterPromise ??= isThreadReply && threadTs ? resolveSlackThreadStarter({
			channelId: message.channel,
			threadTs,
			client: slackClient,
			workspaceScope: threadStarterWorkspaceScope,
			refresh: isRoomish && ctx.historyLimit > 0
		}) : Promise.resolve(null);
		return threadStarterPromise;
	};
	const resolveMessageContent = (contentMessage, preloadedMedia) => getThreadStarter().then((threadStarter) => resolveSlackMessageContent({
		message: contentMessage,
		isThreadReply,
		threadStarter,
		isBotMessage,
		botToken: ctx.botToken,
		client: slackClient,
		mediaMaxBytes: ctx.mediaMaxBytes,
		resolveUserName: (userId) => ctx.resolveUserName(userId, opts.eventScope),
		preloadedMedia
	}));
	let preloadedDirectMedia;
	let messageContentPromise;
	const getMessageContent = () => {
		messageContentPromise ??= resolveMessageContent(message, preloadedDirectMedia);
		return messageContentPromise;
	};
	const senderNameForAuthResult = await senderNameForAuthPromise;
	if (!senderNameForAuthResult.ok) throw senderNameForAuthResult.error;
	const senderNameForAuth = senderNameForAuthResult.name;
	const allowTextCommands = shouldHandleTextCommands({
		cfg,
		surface: "slack"
	});
	const shouldRequireMention = isRoom ? channelConfig?.requireMention ?? ctx.defaultRequireMention : false;
	const implicitMentions = resolveChannelImplicitMentions({
		cfg,
		channel: "slack",
		accountId: account.accountId
	});
	if (message["_ambiguousThreadReply"]) return drop("ambiguous-thread", message.parent_user_id);
	let canDetectMention = groupThreadConfigured || Boolean(ctx.botUserId) || mentionRegexes.length > 0;
	const textForCommandDetection = stripSlackMentionsForCommandDetection(message.text ?? "");
	const hasControlCommandInMessage = hasControlCommand(textForCommandDetection, cfg);
	const hasAbortRequest = isAbortRequestText(textForCommandDetection);
	const channelUsersAllowlistConfigured = isRoom && Array.isArray(channelConfig?.users) && channelConfig.users.length > 0;
	const resolveMessageIngress = async (contextBinding, threadId) => await resolveSlackCommandIngress({
		ctx,
		teamId: opts.eventScope?.teamId ?? ctx.teamId,
		senderId,
		senderName: senderNameForAuth,
		channelType: conversation.resolvedChannelType ?? "channel",
		channelId: message.channel,
		threadId,
		ownerAllowFromLower: allowFromLower,
		channelUsers: isRoom ? channelConfig?.users : void 0,
		allowTextCommands,
		hasControlCommand: hasControlCommandInMessage,
		mentionFacts: {
			canDetectMention,
			wasMentioned,
			hasAnyMention,
			implicitMentionKinds
		},
		activation: {
			requireMention: shouldRequireMention,
			allowTextCommands,
			implicitMentions
		},
		contextBinding
	});
	let messageIngress = await resolveMessageIngress();
	const senderGate = messageIngress.senderAccess.gate;
	if (isRoomish && senderGate?.allowed === false) return drop("unauthorized-sender");
	if (isRoom && isBotMessage && allowBotsMode !== "off" && !await authorizeSlackBotRoomMessage({
		ctx,
		channelId: message.channel,
		senderId,
		senderName: senderNameForAuth,
		channelUsers: channelConfig?.users,
		allowFromLower,
		eventScope: opts.eventScope
	})) return drop("unauthorized-bot");
	const threadContextAllowFromLower = isRoom ? channelUsersAllowlistConfigured ? normalizeAllowListLower(channelConfig?.users) : [] : isDirectMessage ? allowFromLower : [];
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg: ctx.cfg,
		channel: "slack",
		accountId: account.accountId
	});
	const preflightChannelTarget = formatSlackTarget({
		teamId: opts.eventScope?.teamId,
		kind: "channel",
		id: message.channel,
		explicitKind: true
	});
	const replyRouteTarget = formatSlackTarget({
		teamId: opts.eventScope?.teamId,
		kind: isDirectMessage ? "user" : "channel",
		id: isDirectMessage ? senderId : message.channel,
		explicitKind: true
	});
	const commandAuthorized = messageIngress.commandAccess.authorized;
	if (isRoomish && messageIngress.commandAccess.shouldBlockControlCommand) return drop("control-command-unauthorized");
	const canSeedMentionedRoomThread = !seedTopLevelRoomThreadBySource && isRoom && !routing.isThreadReply && !hasBoundSession;
	let seededMentionRouting;
	const getSeededMentionRouting = () => {
		seededMentionRouting ??= resolveMessageRouting(true);
		return seededMentionRouting;
	};
	let preflightAudioTranscript;
	let preflightAudioMedia;
	const preflightAudioFile = findSlackPreflightAudioFile(message, { allowCaptioned: groupThreadConfigured });
	if (!isBotMessage && cfg.tools?.media?.audio?.enabled !== false && (groupThreadConfigured || isRoom && shouldRequireMention && messageIngress.activationAccess.shouldSkip && mentionRegexes.length > 0) && Boolean(preflightAudioFile) && preflightAudioFile) {
		const preflightRouting = canSeedMentionedRoomThread ? getSeededMentionRouting() : routing;
		const preflightMedia = (await resolveMessageContent({
			...message,
			files: [preflightAudioFile],
			attachments: void 0,
			blocks: void 0
		}))?.effectiveDirectMedia;
		const downloadedAudioMedia = preflightMedia?.[0];
		if (downloadedAudioMedia) preloadedDirectMedia = /* @__PURE__ */ new Map([[preflightAudioFile, downloadedAudioMedia]]);
		const preflightResult = preflightMedia ? await resolveSlackPreflightAudioTranscript({
			media: preflightMedia,
			cfg,
			accountId: account.accountId,
			originatingTo: preflightChannelTarget,
			sessionKey: preflightRouting.sessionKey,
			messageThreadId: preflightRouting.threadContext.messageThreadId
		}) : null;
		if (preflightResult) {
			mentionCheckTranscript = preflightResult.transcript;
			preflightAudioTranscript = preflightResult.transcript;
			preflightAudioMedia = preflightMedia?.[preflightResult.mediaIndex];
		}
		if (!preflightAudioTranscript) {
			await discardSlackPreflightMedia(preflightMedia);
			preloadedDirectMedia = void 0;
		}
	}
	groupThread = resolveGroupThreadMentionFacts({
		cfg,
		channel: "slack",
		peerId: groupThreadPeerId,
		text: [messageText, mentionCheckTranscript].filter(Boolean).join("\n"),
		sessionKey: routing.sessionKey,
		acpBinding: Boolean(routing.configuredBinding)
	});
	wasMentioned = resolveWasMentioned(mentionRegexes);
	if (canSeedMentionedRoomThread && wasMentioned) {
		routing = getSeededMentionRouting();
		if (isGroupThreadRouteExclusive({
			sessionKey: routing.sessionKey,
			acpBinding: Boolean(routing.configuredBinding)
		})) groupThread = void 0;
		mentionRegexes = buildPolicyMentionRegexes(routing.route.agentId);
		wasMentioned = resolveWasMentioned(mentionRegexes);
		({route, runtimeBinding, replyToMode, threadContext, threadTs, isThreadReply, threadKeys, sessionKey} = routing);
		canDetectMention = Boolean(groupThread) || Boolean(ctx.botUserId) || mentionRegexes.length > 0;
	}
	if (preflightAudioTranscript && !wasMentioned) {
		await discardSlackPreflightMedia(preloadedDirectMedia ? [...preloadedDirectMedia.values()] : void 0);
		preloadedDirectMedia = void 0;
		preflightAudioTranscript = void 0;
		preflightAudioMedia = void 0;
	}
	const directThreadRoutedToDmSession = !assistantThreadContext && !agentViewThreadTs && isDirectMessage && isThreadReply && threadTs && runtimeBinding?.conversation.conversationId !== threadTs;
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention,
			wasMentioned,
			hasAnyMention,
			implicitMentionKinds
		},
		policy: {
			isGroup: isRoom,
			requireMention: shouldRequireMention,
			allowTextCommands,
			hasControlCommand: hasControlCommandInMessage,
			commandAuthorized,
			implicitMentions
		}
	});
	const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
	const shouldBypassMention = mentionDecision.shouldBypassMention;
	const matchedImplicitMentionKinds = mentionDecision.matchedImplicitMentionKinds;
	const mentionSource = resolveSlackMentionSource({
		explicitBotMention: explicitlyMentionedBotUser || opts.source === "app_mention",
		explicitSubteamMention: explicitlyMentionedBotSubteam,
		matchedImplicitMentionKinds,
		shouldBypassMention,
		wasMentioned
	});
	if (isBotMessage && allowBotsMode === "mentions") {
		if (!(isDirectMessage || effectiveWasMentioned || shouldBypassMention)) return drop("bot-missing-mention");
	}
	if (isRoom && shouldRequireMention && !canDetectMention && !effectiveWasMentioned) return drop("mention-detection-unavailable");
	const ignoreOtherMentions = channelConfig?.ignoreOtherMentions ?? false;
	if (isRoom && ignoreOtherMentions && Boolean(ctx.botUserId) && hasAnyMention && !wasMentioned) return drop("other-mention");
	if (isRoom && shouldRequireMention && mentionDecision.shouldSkip) return drop("missing-mention");
	const chatType = resolveSlackChatType(conversation.resolvedChannelType);
	const inboundEventKind = classifyChannelInboundEvent({
		conversation: { kind: chatType },
		unmentionedGroupPolicy: resolveUnmentionedGroupInboundPolicy({
			cfg,
			agentId: route.agentId
		}),
		wasMentioned: effectiveWasMentioned,
		hasControlCommand: hasControlCommandInMessage,
		hasAbortRequest
	});
	const threadStarter = await getThreadStarter();
	const resolvedMessageContent = await getMessageContent();
	if (!resolvedMessageContent) return drop("empty-content");
	const { rawBody, effectiveDirectMedia, commandSourceText, mentionStripPatterns } = resolvedMessageContent;
	const bodyForAgent = preflightAudioTranscript ? formatSlackAudioTranscriptForAgent({
		transcript: preflightAudioTranscript,
		rawBody
	}) : rawBody;
	const ackReaction = resolveAckReaction(cfg, route.agentId, {
		channel: "slack",
		accountId: account.accountId
	});
	const ackReactionValue = ackReaction ?? "";
	const sourceRepliesAreToolOnly = resolveChannelMessageSourceReplyDeliveryMode({
		cfg,
		ctx: {
			ChatType: chatType,
			InboundEventKind: inboundEventKind
		}
	}) === "message_tool_only";
	const statusReactionsExplicitlyEnabled = cfg.messages?.statusReactions?.enabled === true;
	const isRoomEvent = inboundEventKind === "room_event";
	const shouldAckReaction$1 = () => Boolean(ackReaction && shouldAckReaction({
		scope: cfg.messages?.ackReactionScope,
		inboundEventKind,
		isDirect: isDirectMessage,
		isGroup: isRoomish,
		isMentionableGroup: isRoom,
		canDetectMention,
		effectiveWasMentioned,
		shouldBypassMention
	}));
	const ackReactionMessageTs = message.ts;
	const shouldSendAckReaction = shouldAckReaction$1() && (!sourceRepliesAreToolOnly || effectiveWasMentioned || shouldBypassMention || isRoomEvent);
	const statusReactionsWillHandle = Boolean(ackReactionMessageTs) && !isRoomEvent && statusReactionsExplicitlyEnabled && shouldSendAckReaction;
	const ackReactionPromise = !statusReactionsWillHandle && shouldSendAckReaction && ackReactionMessageTs && ackReactionValue ? reactSlackMessage(message.channel, ackReactionMessageTs, ackReactionValue, {
		token: ctx.botToken,
		client: slackClient
	}).then(() => true, (err) => {
		logVerbose(`slack react failed for channel ${message.channel}: ${formatSlackError(err)}`);
		return false;
	}) : statusReactionsWillHandle ? Promise.resolve(true) : null;
	const roomLabel = channelName ? `#${channelName}` : `#${message.channel}`;
	const workspaceId = opts.eventScope?.teamId || ctx.teamId;
	const workspaceName = ctx.installationIdentity?.kind === "workspace" && ctx.installationIdentity.teamId === workspaceId ? ctx.installationIdentity.teamName : void 0;
	const groupSessionSubject = isRoomish ? resolveSlackGroupSessionSubject({
		channelId: message.channel,
		channelName,
		workspaceId,
		workspaceName
	}) : void 0;
	const senderName = await resolveSenderName();
	const conversationAvatar = isDirectMessage && message.user ? ctx.resolveUserAvatar(message.user, opts.eventScope) : void 0;
	const preview = truncateUtf16Safe(bodyForAgent.replace(/\s+/g, " "), 160);
	const inboundLabel = isDirectMessage ? `Slack DM from ${senderName}` : `Slack message in ${roomLabel} from ${senderName}`;
	const slackFrom = isDirectMessage ? `slack:${message.user}` : isRoom ? `slack:channel:${message.channel}` : `slack:group:${message.channel}`;
	enqueueRoutedSystemEvent(inboundLabel, {
		...route,
		sessionKey
	}, { contextKey: `slack:message:${message.channel}:${message.ts ?? "unknown"}` });
	const envelopeFrom = resolveConversationLabel({
		ChatType: chatType,
		SenderName: senderName,
		GroupSubject: isRoomish ? roomLabel : void 0,
		From: slackFrom
	}) ?? (isDirectMessage ? senderName : roomLabel);
	const threadInfo = isThreadReply && threadTs ? ` thread_ts: ${threadTs}${message.parent_user_id ? ` parent_user_id: ${message.parent_user_id}` : ""}` : "";
	const textWithId = `${bodyForAgent}\n[slack message id: ${message.ts} channel: ${message.channel}${threadInfo}]`;
	const storePath = resolveStorePath(ctx.cfg.session?.store, { agentId: route.agentId });
	const envelopeOptions = resolveEnvelopeFormatOptions(ctx.cfg);
	const effectiveMessageThreadId = assistantThreadContext?.threadTs ?? agentViewThreadTs ?? threadContext.messageThreadId;
	const boundMessageThreadId = directThreadRoutedToDmSession ? void 0 : effectiveMessageThreadId;
	messageIngress = await resolveMessageIngress({
		agentId: route.agentId,
		sessionKey,
		nativeChannelId: message.channel,
		messageId: threadContext.messageTs,
		inboundEventKind
	}, boundMessageThreadId);
	if (messageIngress.ingress.admission !== "dispatch") return drop("final-route-denied");
	const sessionEntry = getSessionEntry({
		storePath,
		sessionKey
	});
	const previousTimestamp = sessionEntry?.updatedAt;
	const excludedMessageIds = new Set(opts.sourceMessageIds);
	if (message.ts) excludedMessageIds.add(message.ts);
	const isHistorySessionCurrent = () => {
		const current = getSessionEntry({
			storePath,
			sessionKey
		});
		return current?.sessionId === sessionEntry?.sessionId && current?.lifecycleRevision === sessionEntry?.lifecycleRevision && current?.sessionStartedAt === sessionEntry?.sessionStartedAt && current?.updatedAt === 0 === (sessionEntry?.updatedAt === 0);
	};
	const assertHistoryCurrent = () => {
		opts.abortSignal?.throwIfAborted();
		if (opts.isRuntimePolicyCurrent?.() === false || !isHistorySessionCurrent()) throw new Error("Slack history policy or session changed during recovery");
	};
	const dmHistoryLimit = isDirectMessage ? resolveSlackDmHistoryLimit({
		account,
		userId: message.user,
		defaultLimit: ctx.dmHistoryLimit
	}) : 0;
	let combinedBody = formatInboundEnvelope({
		channel: "Slack",
		from: envelopeFrom,
		timestamp: resolveSlackTimestampMs(message.ts),
		body: textWithId,
		chatType,
		sender: {
			name: senderName,
			id: senderId
		},
		previousTimestamp,
		envelope: envelopeOptions
	});
	const dmHistoryContext = isDirectMessage && !assistantThreadContext && !agentViewThreadTs && !isThreadReply && dmHistoryLimit > 0 && !previousTimestamp ? await resolveSlackDmHistoryContext({
		ctx,
		channelId: message.channel,
		currentMessageTs: message.ts,
		limit: dmHistoryLimit,
		envelopeOptions,
		eventScope: opts.eventScope
	}) : {
		body: void 0,
		inboundHistory: void 0
	};
	if (dmHistoryContext.body) combinedBody = `${dmHistoryContext.body}\n\n${combinedBody}`;
	const { channelMetadata, groupSystemPrompt } = resolveSlackRoomContextHints({
		isRoomish,
		channelInfo,
		channelConfig
	});
	const threadContextData = await resolveSlackThreadContextData({
		ctx,
		agentId: route.agentId,
		account,
		message,
		isGroupDm,
		isThreadReply,
		threadTs,
		threadStarter,
		roomLabel,
		storePath,
		sessionKey,
		forceInitialHistory: Boolean(directThreadRoutedToDmSession),
		allowFromLower: threadContextAllowFromLower,
		allowNameMatching: ctx.allowNameMatching,
		contextVisibilityMode,
		envelopeOptions,
		effectiveDirectMedia,
		eventScope: opts.eventScope,
		historyLimit: isRoomish ? ctx.historyLimit : void 0,
		excludedMessageIds,
		assertHistoryCurrent,
		abortSignal: opts.abortSignal
	});
	const { threadLabel, threadStarterMedia } = threadContextData;
	let { threadStarterBody, threadHistoryBody, shouldSeedInitialThreadContext } = threadContextData;
	const threadScopedHistory = isThreadReply && ctx.threadHistoryScope === "thread";
	let roomHistory = [];
	if (isRoomish && ctx.historyLimit > 0 && (!threadScopedHistory || !shouldSeedInitialThreadContext)) {
		if (sessionEntry?.updatedAt !== 0) roomHistory = await resolveSlackRoomHistory({
			ctx,
			message,
			threadTs: threadScopedHistory ? threadTs : void 0,
			oldest: sessionEntry?.sessionStartedAt ? (sessionEntry.sessionStartedAt / 1e3).toFixed(6) : void 0,
			excludedMessageIds,
			allowFromLower: threadContextAllowFromLower,
			contextVisibilityMode,
			eventScope: opts.eventScope,
			assertCurrent: assertHistoryCurrent,
			abortSignal: opts.abortSignal
		});
	}
	const effectiveMedia = effectiveDirectMedia ?? threadStarterMedia;
	let inboundMedia = await toInboundMediaFactsWithMetadata(effectiveMedia, { transcribed: (entry) => effectiveMedia === effectiveDirectMedia && entry === preflightAudioMedia });
	opts.abortSignal?.throwIfAborted();
	if (opts.isRuntimePolicyCurrent?.() === false) return drop("final-route-denied");
	if (isRoomish && ctx.historyLimit > 0 && !isHistorySessionCurrent()) {
		roomHistory = [];
		threadHistoryBody = void 0;
		threadStarterBody = void 0;
		shouldSeedInitialThreadContext = false;
		if (effectiveMedia === threadStarterMedia) inboundMedia = [];
		ctx.logger.warn({
			channelId: message.channel,
			sessionKey
		}, "Slack automatic history omitted after session changed");
	}
	combinedBody = buildHistoryContextFromEntries({
		entries: roomHistory,
		currentMessage: combinedBody,
		historyKind: "recent",
		excludeLast: false,
		formatEntry: (entry) => formatInboundEnvelope({
			channel: "Slack",
			from: roomLabel,
			timestamp: entry.timestamp,
			body: `${entry.body} [id:${entry.messageId} channel:${message.channel}]`,
			chatType: "channel",
			senderLabel: entry.sender,
			envelope: envelopeOptions
		})
	});
	const inboundHistory = isRoomish && ctx.historyLimit > 0 ? buildInboundHistoryFromEntries({
		entries: roomHistory,
		limit: ctx.historyLimit
	}) : dmHistoryContext.inboundHistory;
	const commandBody = textForCommandDetection.trim();
	const supplementalThreadHistoryBody = directThreadRoutedToDmSession && !threadHistoryBody ? threadStarterBody : threadHistoryBody;
	const agentContextEntities = isAgentViewMessage ? normalizeSlackAppContextEntities(message.app_context) : [];
	const ctxPayload = (ctx.buildContext ?? buildChannelInboundEventContext)({
		channelIngress: messageIngress,
		channel: "slack",
		accountId: route.accountId,
		messageId: threadContext.messageTs,
		timestamp: resolveSlackTimestampMs(message.ts),
		from: slackFrom,
		sender: {
			id: senderId,
			name: senderName,
			displayLabel: senderName,
			isBot: isBotMessage || void 0
		},
		conversation: {
			kind: chatType,
			id: message.channel,
			routePeer: {
				kind: chatType,
				id: qualifySlackRoutePeerId({
					id: isDirectMessage ? message.user ?? "unknown" : message.channel,
					kind: isDirectMessage ? "user" : "channel",
					eventScope: opts.eventScope
				})
			},
			label: envelopeFrom,
			spaceId: opts.eventScope?.teamId || ctx.teamId || void 0,
			threadId: boundMessageThreadId,
			nativeChannelId: message.channel,
			avatar: conversationAvatar
		},
		route: {
			...route,
			routeSessionKey: route.sessionKey,
			dispatchSessionKey: sessionKey,
			parentSessionKey: threadKeys.parentSessionKey
		},
		reply: {
			to: replyRouteTarget,
			replyToId: threadContext.replyToId,
			messageThreadId: boundMessageThreadId,
			nativeChannelId: message.channel
		},
		message: {
			inboundEventKind,
			body: combinedBody,
			bodyForAgent,
			rawBody,
			commandBody,
			inboundHistory
		},
		sessionTranscript: {
			historyLimit: isRoomish ? ctx.historyLimit : dmHistoryLimit,
			historyKind: isRoomish ? "recent" : "pending"
		},
		access: {
			mentions: {
				canDetectMention: isRoomish,
				wasMentioned: effectiveWasMentioned,
				hasAnyMention: explicitlyMentioned || mentionedSubteamIds.length > 0,
				implicitMentionKinds: matchedImplicitMentionKinds,
				requireMention: shouldRequireMention,
				effectiveWasMentioned
			},
			commands: { authorized: commandAuthorized }
		},
		media: inboundMedia,
		supplemental: {
			thread: {
				starterBody: !directThreadRoutedToDmSession && shouldSeedInitialThreadContext ? threadStarterBody : void 0,
				historyBody: supplementalThreadHistoryBody,
				label: directThreadRoutedToDmSession ? void 0 : threadLabel
			},
			groupSystemPrompt
		},
		channelContext: { chat: {
			commandSourceText,
			mentionStripPatterns
		} },
		extra: {
			GroupThread: groupThread,
			GroupSubject: groupSessionSubject,
			ChannelPromptContext: channelMetadata ? [channelMetadata] : void 0,
			ChannelStructuredContext: agentContextEntities.length > 0 ? [{
				label: "Slack active context",
				source: "slack",
				type: "active_view",
				payload: { entities: agentContextEntities }
			}] : void 0,
			TransportThreadId: directThreadRoutedToDmSession ? threadContext.messageThreadId : void 0,
			ReplyThreading: isThreadReply ? { implicitCurrentMessage: "deny" } : void 0,
			SlackAssistantThread: assistantThreadContext ? true : void 0,
			SlackAgentThread: agentViewThreadTs ? true : void 0,
			SlackAssistantThreadContextChannelId: assistantThreadContext?.channelId,
			SlackAssistantThreadContextTeamId: assistantThreadContext?.teamId,
			SlackAssistantThreadContextEnterpriseId: assistantThreadContext?.enterpriseId ?? void 0,
			Transcript: preflightAudioTranscript,
			IsFirstThreadTurn: isThreadReply && threadTs && !directThreadRoutedToDmSession && shouldSeedInitialThreadContext ? true : void 0,
			...isRoomish ? {
				WasMentioned: effectiveWasMentioned,
				ExplicitlyMentionedBot: explicitlyMentioned,
				MentionedUserIds: mentionedUserIds.length > 0 ? [...mentionedUserIds] : void 0,
				MentionedSubteamIds: mentionedSubteamIds.length > 0 ? [...mentionedSubteamIds] : void 0,
				ImplicitMentionKinds: matchedImplicitMentionKinds.length > 0 ? [...matchedImplicitMentionKinds] : void 0,
				MentionSource: mentionSource
			} : {}
		}
	});
	ctxPayload.ReplyToMode = replyToMode;
	const pinnedMainDmOwner = isDirectMessage ? resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: cfg.session?.dmScope,
		allowFrom: allowFromLower,
		normalizeEntry: normalizeSlackAllowOwnerEntry
	}) : null;
	const replyTarget = `channel:${message.channel}`;
	if (preflightAudioTranscript) await sendSlackPreflightAudioTranscriptEcho({
		transcript: preflightAudioTranscript,
		cfg,
		accountId: account.accountId,
		originatingTo: preflightChannelTarget,
		messageThreadId: threadContext.messageThreadId
	});
	if (shouldLogVerbose()) logVerbose(`slack inbound: account=${route.accountId} agent=${route.agentId} channel=${message.channel} message_ts=${message.ts ?? "unknown"} thread_ts=${effectiveMessageThreadId ?? "none"} from=${slackFrom} chat=${chatType} chars=${rawBody.length}`);
	const updateLastRouteSessionKey = resolveInboundLastRouteSessionKey({
		route,
		sessionKey
	});
	return {
		ctx,
		account,
		message,
		...opts.relayIdentity ? { relayIdentity: opts.relayIdentity } : {},
		eventScope: opts.eventScope,
		route,
		channelConfig,
		replyTarget,
		ctxPayload,
		sessionDisplayName: sessionEntry?.displayName,
		turn: {
			storePath,
			record: {
				updateLastRoute: isDirectMessage || opts.eventScope ? {
					sessionKey: updateLastRouteSessionKey,
					channel: "slack",
					to: replyRouteTarget,
					accountId: route.accountId,
					threadId: effectiveMessageThreadId,
					mainDmOwnerPin: isDirectMessage && updateLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner && message.user ? {
						ownerRecipient: pinnedMainDmOwner,
						senderRecipient: normalizeLowercaseStringOrEmpty(message.user),
						onSkip: ({ ownerRecipient, senderRecipient }) => {
							logVerbose(`slack: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
						}
					} : void 0
				} : void 0,
				onRecordError: (err) => {
					ctx.logger.warn({
						error: formatErrorMessage(err),
						storePath,
						sessionKey
					}, "failed updating session meta");
				}
			}
		},
		replyToMode,
		...forcedReplyThreadTs ? { forcedReplyThreadTs } : {},
		...assistantThreadContext ? { slackMessageMetadata: buildSlackAssistantThreadMetadata(assistantThreadContext) } : {},
		requireMention: shouldRequireMention,
		isDirectMessage,
		isRoomish,
		preview,
		ackReactionMessageTs,
		ackReactionValue,
		ackReactionPromise
	};
}
//#endregion
export { dispatchPreparedSlackMessage, prepareSlackMessage };
