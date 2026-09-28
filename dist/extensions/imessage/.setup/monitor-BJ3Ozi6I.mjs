import { c as parseIMessageTarget, o as normalizeIMessageHandle, r as isAllowedIMessageReplyContextSender, s as parseIMessageAllowTarget, t as formatIMessageChatTarget } from "./targets-Cc9vthzI.mjs";
import { d as resolveIMessageChatDbLookupPath, f as resolveIMessageHomeDir, l as resolveIMessageRemoteHost, o as resolveIMessageAccount } from "./accounts-CUxZrTcY.mjs";
import { r as imessageRpcSupportsMethod } from "./message-tool-api-pvlcOJPG.mjs";
import { b as resolveIMessageDirectChatService, d as isKnownFromMeIMessageMessageId, f as rememberIMessageReplyCache, o as createIMessageRpcClient, r as sanitizeOutboundText } from "./sanitize-outbound-sJPF2DVM.mjs";
import { d as probeIMessage, f as probeIMessagePrivateApi, i as resolveIMessageInboundConversationId, n as resolveIMessageGroupSystemPrompt } from "./group-policy-Cjztkquv.mjs";
import { t as getIMessageRuntime } from "./runtime-Cza4CY5T.mjs";
import { d as resolveIMessageEchoMediaKey, l as capFailureRetriesMap, t as IMESSAGE_CATCHUP_CURSOR_NAMESPACE, u as resolveIMessageCatchupCursorKey } from "./state-contract-DvahEY4X.mjs";
import { n as resolveIMessageAttachmentRoots, r as resolveIMessageRemoteAttachmentRoots } from "./media-contract-DKJK7rh3.mjs";
import { i as registerIMessageApprovalReactionTarget, n as handleIMessageApprovalReaction, o as listPendingIMessageApprovalReactionPollTargets, r as maybeResolveIMessageApprovalReaction, s as buildIMessageApprovalConversationKeyForInbound } from "./approval-reactions-D6RFg6lU.mjs";
import { c as maybeResolveIMessageApprovalPollVote, i as resolveIMessageStartupRowidWatermark, l as iMessageApprovalControlBindings, n as hasPersistedIMessageEcho, r as stripLeadingEchoTextCorruptionMarkers, t as sendMessageIMessage } from "./send-odAfTQ2J.mjs";
import { n as normalizeIMessageGuid, t as resolveIMessageReactionContext } from "./reaction-context-Br-vAJFp.mjs";
import { n as maybeResolveIMessageQuestionReaction, t as hasIMessageQuestionReactionTarget } from "./question-reactions-lm8OxWbb.mjs";
import { asSafeIntegerInRange, hasNonEmptyString, isRecord, normalizeOptionalString, normalizeStringEntries, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelMessageReplyPipeline, resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-outbound";
import { resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-runtime";
import { resolveAgentRoute, resolveInboundLastRouteSessionKey } from "openclaw/plugin-sdk/routing";
import path from "node:path";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import fs from "node:fs/promises";
import { isInboundPathAllowed, kindFromMime } from "openclaw/plugin-sdk/media-runtime";
import { createNonExitingRuntime, danger, logVerbose, shouldLogVerbose, warn } from "openclaw/plugin-sdk/runtime-env";
import { asDateTimestampMs, asPositiveFiniteNumber, parseDateStringTimestampMs, resolveIntegerOption, resolvePromptHistoryLimit, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { createHash } from "node:crypto";
import { createRuntimeConfigReader, getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { collectErrorGraphCandidates, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { buildChannelGroupsScopeTree, resolveChannelGroupPolicy, resolveChannelGroups, resolveChannelGroupsConfigPath, resolveScopeRequireMention } from "openclaw/plugin-sdk/channel-policy";
import { convertMarkdownTables as convertMarkdownTables$1, findCodeRegions, isInsideCode, sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
import { buildChannelInboundEventContext, buildMentionRegexes, createAcceptedChannelDeliveryResult, createChannelInboundDebouncer, createChannelPartialDeliveryError, filterChannelInboundQuoteContext, formatInboundEnvelope, formatInboundFromLabel, formatInboundMediaUnavailableText, formatMediaPlaceholderText, isChannelPartialDeliveryError, logInboundDrop, matchesMentionPatterns, resolveEnvelopeFormatOptions, resolveInboundDebounceMs, resolveInboundMentionDecision, resolveInboundSupplementalSenderAllowed, runChannelInboundEvent, shouldDebounceTextInbound, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { resolveAgentConfig, resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "openclaw/plugin-sdk/approval-handler-runtime";
import { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
import { defineStableChannelIngressIdentity, fanInChannelIngressLifecycles } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { ensureConfiguredBindingRouteReady, readChannelAllowFromStore, resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute, upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { redactIdentifier } from "openclaw/plugin-sdk/logging-core";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { FsSafeError, openLocalFileSafely, resolvePinnedMainDmOwnerFromAllowlist } from "openclaw/plugin-sdk/security-runtime";
import { getSessionEntry, readSessionUpdatedAt, resolveSendPolicy, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { waitForTransportReady } from "openclaw/plugin-sdk/transport-ready-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveMarkdownTableMode as resolveMarkdownTableMode$1 } from "openclaw/plugin-sdk/markdown-table-runtime";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { deliverTextOrMediaReply, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { chunkMarkdownTextWithMode as chunkTextWithMode, resolveChunkMode } from "openclaw/plugin-sdk/reply-chunking";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
import { hasControlCommand } from "openclaw/plugin-sdk/command-auth-native";
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { isRecord as isRecord$1 } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { readFileHandleBounded } from "openclaw/plugin-sdk/file-access-runtime";
import { saveMediaBuffer } from "openclaw/plugin-sdk/media-store";
import { loadWebMedia } from "openclaw/plugin-sdk/web-media";
import { enqueueRoutedSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
//#region extensions/imessage/src/approval-reaction-poller.ts
const RECENT_CHAT_LIMIT = 50;
const PER_CHAT_HISTORY_LIMIT$1 = 30;
function normalizeChatId(value) {
	return asPositiveFiniteNumber(value) ?? null;
}
function listTargetChatIds(targets) {
	const chatIds = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const chatId = normalizeChatId(target.conversation.chatId);
		if (chatId !== null) chatIds.add(chatId);
	}
	return [...chatIds];
}
function hasUnscopedTarget(targets) {
	return targets.some((target) => normalizeChatId(target.conversation.chatId) === null);
}
function uniqueChatIds(chatIds) {
	return [...new Set(chatIds)];
}
function enumerateMessageGuidCandidates(value) {
	const trimmed = value.trim();
	if (!trimmed) return [];
	return [trimmed, normalizeIMessageGuid(trimmed)].filter((candidate, index, candidates) => candidate.length > 0 && candidates.indexOf(candidate) === index);
}
function buildPendingTargetsByMessageId(targets) {
	const pendingByMessageId = /* @__PURE__ */ new Map();
	for (const target of targets) for (const candidate of enumerateMessageGuidCandidates(target.messageId)) pendingByMessageId.set(candidate, target);
	return pendingByMessageId;
}
async function listRecentChatIds(client) {
	return ((await client.request("chats.list", { limit: RECENT_CHAT_LIMIT }, { timeoutMs: 1e4 })).chats ?? []).map((chat) => normalizeChatId(chat.id)).filter((chatId) => chatId !== null);
}
async function fetchRecentHistory(params) {
	return ((await params.client.request("messages.history", {
		chat_id: params.chatId,
		limit: PER_CHAT_HISTORY_LIMIT$1
	}, { timeoutMs: 1e4 })).messages ?? []).filter((message) => Boolean(message && typeof message === "object"));
}
function buildReactionPayload(params) {
	const emoji = params.reaction.emoji?.trim();
	const sender = params.reaction.sender?.trim();
	const targetGuid = params.targetMessage.guid?.trim();
	if (!emoji || !sender || !targetGuid) return null;
	const reactionId = normalizeChatId(params.reaction.id);
	return {
		...reactionId !== null ? { id: reactionId } : {},
		guid: `reaction:${targetGuid}:${sender}:${emoji}:${params.reaction.created_at ?? ""}`,
		chat_id: params.targetMessage.chat_id,
		chat_guid: params.targetMessage.chat_guid,
		chat_identifier: params.targetMessage.chat_identifier,
		chat_name: params.targetMessage.chat_name,
		participants: params.targetMessage.participants,
		is_group: params.targetMessage.is_group,
		sender,
		destination_caller_id: params.targetMessage.destination_caller_id,
		is_from_me: params.reaction.is_from_me,
		text: `${params.reaction.type ?? "reaction"} "${params.targetMessage.text ?? ""}"`,
		created_at: params.reaction.created_at,
		is_reaction: true,
		is_tapback: true,
		associated_message_guid: targetGuid,
		associated_message_type: 2e3,
		reaction_type: params.reaction.type ?? void 0,
		reaction_emoji: emoji,
		is_reaction_add: true,
		reacted_to_guid: targetGuid
	};
}
function buildConversationKeyFromMessage(message) {
	return {
		...message.chat_guid?.trim() ? { chatGuid: message.chat_guid.trim() } : {},
		...message.chat_identifier?.trim() ? { chatIdentifier: message.chat_identifier.trim() } : {},
		...normalizeChatId(message.chat_id) !== null ? { chatId: message.chat_id } : {}
	};
}
async function bindObservedConversation(params) {
	const nowMs = asDateTimestampMs(Date.now());
	const expiresAtMs = asDateTimestampMs(params.target.expiresAtMs);
	if (nowMs === void 0 || expiresAtMs === void 0 || expiresAtMs <= nowMs) return;
	const ttlMs = expiresAtMs - nowMs;
	const conversation = buildConversationKeyFromMessage(params.message);
	const messageIds = /* @__PURE__ */ new Set([...enumerateMessageGuidCandidates(params.target.messageId), ...enumerateMessageGuidCandidates(params.message.guid ?? "")]);
	await Promise.all([...messageIds].map((messageId) => registerIMessageApprovalReactionTarget({
		accountId: params.target.accountId,
		conversation,
		messageId,
		approvalId: params.target.approvalId,
		approvalKind: params.target.approvalKind,
		allowedDecisions: params.target.allowedDecisions,
		ttlMs
	})));
}
async function pollPendingIMessageApprovalReactions(params) {
	const targets = await listPendingIMessageApprovalReactionPollTargets({ accountId: params.accountId });
	if (targets.length === 0) return;
	const pendingByMessageId = buildPendingTargetsByMessageId(targets);
	const explicitChatIds = listTargetChatIds(targets);
	const chatIds = params.allowRecentChatDiscovery === true && targets.length > 0 && hasUnscopedTarget(targets) ? uniqueChatIds([...explicitChatIds, ...await listRecentChatIds(params.client)]) : explicitChatIds;
	if (chatIds.length === 0) return;
	for (const chatId of chatIds) {
		let messages;
		try {
			messages = await fetchRecentHistory({
				client: params.client,
				chatId
			});
		} catch (err) {
			params.logVerboseMessage?.(`imessage: approval reaction poll skipped chat_id=${chatId}: ${String(err)}`);
			continue;
		}
		for (const message of messages) {
			const targetGuid = message.guid?.trim();
			if (!targetGuid) continue;
			const target = pendingByMessageId.get(targetGuid) ?? pendingByMessageId.get(normalizeIMessageGuid(targetGuid));
			if (!target) continue;
			await bindObservedConversation({
				target,
				message
			});
			for (const reaction of message.reactions ?? []) {
				const reactionPayload = buildReactionPayload({
					targetMessage: message,
					reaction
				});
				if (!reactionPayload) continue;
				if ((await handleIMessageApprovalReaction({
					cfg: params.cfg,
					accountId: params.accountId,
					message: reactionPayload,
					bodyText: reactionPayload.text ?? "",
					gatewayRuntime: params.gatewayRuntime,
					logVerboseMessage: params.logVerboseMessage
				})).stopPolling) return;
			}
		}
	}
}
//#endregion
//#region extensions/imessage/src/chat.ts
function buildChatTargetParams(to, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "iMessage chat action");
	const account = opts.account ?? resolveIMessageAccount({
		cfg,
		accountId: opts.accountId
	});
	const target = parseIMessageTarget(opts.chatId ? formatIMessageChatTarget(opts.chatId) : to);
	const params = {};
	if (target.kind === "chat_id") params.chat_id = target.chatId;
	else if (target.kind === "chat_guid") params.chat_guid = target.chatGuid;
	else if (target.kind === "chat_identifier") params.chat_identifier = target.chatIdentifier;
	else params.to = target.to;
	return {
		params,
		service: opts.service ?? (target.kind === "handle" ? target.service : void 0) ?? account.config.service,
		region: opts.region?.trim() || account.config.region?.trim() || "US",
		account
	};
}
async function runChatAction(method, params, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "iMessage chat action");
	const account = opts.account ?? resolveIMessageAccount({
		cfg,
		accountId: opts.accountId
	});
	const cliPath = opts.cliPath?.trim() || account.config.cliPath?.trim() || "imsg";
	const dbPath = opts.dbPath?.trim() || account.config.dbPath?.trim();
	const remoteHost = await resolveIMessageRemoteHost({
		cliPath,
		remoteHost: opts.remoteHost ?? account.config.remoteHost
	});
	const client = opts.client ?? await createIMessageRpcClient({
		cliPath,
		dbPath,
		remoteHost
	});
	const shouldClose = !opts.client;
	try {
		return await client.request(method, params, { timeoutMs: opts.timeoutMs });
	} finally {
		if (shouldClose) await client.stop();
	}
}
async function sendIMessageTyping(to, isTyping, opts) {
	const { params, service } = buildChatTargetParams(to, opts);
	params.typing = isTyping;
	if (service) params.service = service;
	await runChatAction("typing", params, opts);
}
async function markIMessageChatRead(to, opts) {
	const { params } = buildChatTargetParams(to, opts);
	await runChatAction("read", params, opts);
}
//#endregion
//#region extensions/imessage/src/monitor/abort-handler.ts
function attachIMessageMonitorAbortHandler(params) {
	const abort = params.abortSignal;
	if (!abort) return () => {};
	const onAbort = () => {
		const subscriptionId = params.getSubscriptionId();
		if (subscriptionId) params.client.request("watch.unsubscribe", { subscription: subscriptionId }).catch(() => {});
		params.client.stop().catch(() => {});
	};
	abort.addEventListener("abort", onAbort, { once: true });
	return () => abort.removeEventListener("abort", onAbort);
}
//#endregion
//#region extensions/imessage/src/monitor/catchup.ts
const DEFAULT_MAX_AGE_MINUTES = 120;
const MAX_MAX_AGE_MINUTES = 720;
const DEFAULT_PER_RUN_LIMIT = 50;
const MAX_PER_RUN_LIMIT = 500;
const DEFAULT_FIRST_RUN_LOOKBACK_MINUTES = 30;
const DEFAULT_MAX_FAILURE_RETRIES = 10;
const MAX_MAX_FAILURE_RETRIES = 1e3;
const cursorWriteQueue = new KeyedAsyncQueue();
function openCatchupCursorStore() {
	return getIMessageRuntime().state.openKeyedStore({
		namespace: IMESSAGE_CATCHUP_CURSOR_NAMESPACE,
		maxEntries: 256
	});
}
function enqueueCursorWrite(accountId, fn) {
	const key = resolveIMessageCatchupCursorKey(accountId);
	return cursorWriteQueue.enqueue(key, fn);
}
function sanitizeFailureRetriesInput(raw) {
	if (!raw || typeof raw !== "object") return {};
	const out = {};
	for (const [guid, count] of Object.entries(raw)) {
		if (!guid || typeof guid !== "string") continue;
		if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) continue;
		out[guid] = Math.floor(count);
	}
	return out;
}
function normalizeIMessageCatchupCursor(value) {
	if (!value || typeof value !== "object") return null;
	const raw = value;
	if (typeof raw.lastSeenMs !== "number" || !Number.isFinite(raw.lastSeenMs)) return null;
	if (typeof raw.lastSeenRowid !== "number" || !Number.isFinite(raw.lastSeenRowid)) return null;
	const failureRetries = sanitizeFailureRetriesInput(raw.failureRetries);
	const hasRetries = Object.keys(failureRetries).length > 0;
	return {
		lastSeenMs: raw.lastSeenMs,
		lastSeenRowid: raw.lastSeenRowid,
		updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : 0,
		...hasRetries ? { failureRetries } : {}
	};
}
async function loadIMessageCatchupCursor(accountId) {
	return normalizeIMessageCatchupCursor(await openCatchupCursorStore().lookup(resolveIMessageCatchupCursorKey(accountId)));
}
function buildIMessageCatchupCursor(next, updatedAt) {
	const sanitized = sanitizeFailureRetriesInput(next.failureRetries);
	const hasRetries = Object.keys(sanitized).length > 0;
	return {
		lastSeenMs: next.lastSeenMs,
		lastSeenRowid: next.lastSeenRowid,
		updatedAt,
		...hasRetries ? { failureRetries: sanitized } : {}
	};
}
function decideCatchupCursorSave(existingValue, cursor, allowCursorRewindForRetries) {
	const existing = normalizeIMessageCatchupCursor(existingValue);
	if (existing && cursor.lastSeenRowid < existing.lastSeenRowid) {
		if (!allowCursorRewindForRetries) return {
			operation: "update",
			action: "keep"
		};
		return {
			operation: "update",
			action: "set",
			value: buildIMessageCatchupCursor({
				lastSeenMs: cursor.lastSeenMs,
				lastSeenRowid: cursor.lastSeenRowid,
				failureRetries: {
					...existing.failureRetries,
					...cursor.failureRetries
				}
			}, cursor.updatedAt)
		};
	}
	return {
		operation: "update",
		action: "set",
		value: cursor
	};
}
async function saveIMessageCatchupCursor(accountId, next, options = {}) {
	const cursor = buildIMessageCatchupCursor(next, Date.now());
	const allowCursorRewindForRetries = options.allowCursorRewindForRetries === true;
	const store = openCatchupCursorStore();
	if (!store.observe || !store.compareAndApply) throw new Error("iMessage catchup cursor persistence requires plugin-state comparison support.");
	const key = resolveIMessageCatchupCursorKey(accountId);
	let observation = await store.observe(key);
	for (;;) {
		const intent = decideCatchupCursorSave(observation.value, cursor, allowCursorRewindForRetries);
		const result = await store.compareAndApply(key, observation.comparison, intent);
		if (result.status !== "conflict") return;
		observation = result.current;
	}
}
function clampInt(value, min, max, fallback) {
	return resolveIntegerOption(value, fallback, {
		min,
		max
	});
}
function resolveCatchupConfig(raw) {
	return {
		enabled: Boolean(raw?.enabled),
		maxAgeMinutes: clampInt(raw?.maxAgeMinutes, 1, MAX_MAX_AGE_MINUTES, DEFAULT_MAX_AGE_MINUTES),
		perRunLimit: clampInt(raw?.perRunLimit, 1, MAX_PER_RUN_LIMIT, DEFAULT_PER_RUN_LIMIT),
		firstRunLookbackMinutes: clampInt(raw?.firstRunLookbackMinutes, 1, MAX_MAX_AGE_MINUTES, DEFAULT_FIRST_RUN_LOOKBACK_MINUTES),
		maxFailureRetries: clampInt(raw?.maxFailureRetries, 1, MAX_MAX_FAILURE_RETRIES, DEFAULT_MAX_FAILURE_RETRIES)
	};
}
function decideLiveCatchupCursorAdvance(existingValue, next, maxFailureRetries) {
	const cursor = normalizeIMessageCatchupCursor(existingValue);
	if (cursor && next.lastSeenRowid <= cursor.lastSeenRowid) return {
		operation: "update",
		action: "keep"
	};
	if (Object.values(cursor?.failureRetries ?? {}).some((count) => count < maxFailureRetries)) return {
		operation: "update",
		action: "keep"
	};
	return {
		operation: "update",
		action: "set",
		value: buildIMessageCatchupCursor({
			lastSeenMs: Math.max(cursor?.lastSeenMs ?? next.lastSeenMs, next.lastSeenMs),
			lastSeenRowid: next.lastSeenRowid,
			failureRetries: cursor?.failureRetries
		}, next.updatedAt)
	};
}
async function advanceIMessageCatchupCursor(accountId, next, config) {
	if (!Number.isFinite(next.lastSeenMs) || !Number.isFinite(next.lastSeenRowid)) return false;
	return await enqueueCursorWrite(accountId, async () => {
		const cursor = buildIMessageCatchupCursor(next, Date.now());
		const maxFailureRetries = config.maxFailureRetries;
		const store = openCatchupCursorStore();
		if (!store.observe || !store.compareAndApply) throw new Error("iMessage catchup cursor persistence requires plugin-state comparison support.");
		const key = resolveIMessageCatchupCursorKey(accountId);
		let observation = await store.observe(key);
		for (;;) {
			const intent = decideLiveCatchupCursorAdvance(observation.value, cursor, maxFailureRetries);
			const result = await store.compareAndApply(key, observation.comparison, intent);
			if (result.status !== "conflict") return result.status === "applied";
			observation = result.current;
		}
	});
}
/**
* One catchup pass. Loads the cursor, fetches `messages.history`, replays
* each row through `dispatch`, advances the cursor on success / give-up,
* persists the cursor, returns a summary.
*
* The fetch and dispatch functions are injected so this loop is unit-testable
* without standing up an `imsg` daemon. The wiring in `monitor-provider.ts`
* passes the live `client.request("messages.history", ...)` adapter as
* `fetch` and the `evaluateIMessageInbound` + `runChannelInboundEvent`
* pipeline as `dispatch`.
*/
async function performIMessageCatchup(params) {
	const now = params.now ?? Date.now();
	const cfg = params.config;
	const cursor = await loadIMessageCatchupCursor(params.accountId);
	const lookbackMs = cursor === null ? cfg.firstRunLookbackMinutes * 6e4 : cfg.maxAgeMinutes * 6e4;
	const ageBoundMs = now - cfg.maxAgeMinutes * 6e4;
	const windowStartMs = Math.max(cursor?.lastSeenMs ?? now - lookbackMs, ageBoundMs);
	const windowEndMs = now;
	const sinceRowid = cursor?.lastSeenRowid ?? 0;
	const summary = {
		querySucceeded: false,
		fullyCaughtUp: false,
		fetchedCount: 0,
		replayed: 0,
		skippedFromMe: 0,
		skippedPreCursor: 0,
		skippedGivenUp: 0,
		failed: 0,
		givenUp: 0,
		cursorBefore: cursor ? {
			lastSeenMs: cursor.lastSeenMs,
			lastSeenRowid: cursor.lastSeenRowid
		} : null,
		cursorAfter: {
			lastSeenMs: cursor?.lastSeenMs ?? windowStartMs,
			lastSeenRowid: cursor?.lastSeenRowid ?? 0
		},
		windowStartMs,
		windowEndMs
	};
	let fetchResult;
	try {
		fetchResult = await params.fetch({
			sinceMs: windowStartMs,
			sinceRowid,
			limit: cfg.perRunLimit
		});
	} catch (err) {
		params.warn?.(`imessage catchup: fetch failed: ${String(err)}`);
		return summary;
	}
	if (!fetchResult.resolved) {
		params.warn?.(`imessage catchup: fetch returned unresolved result`);
		return summary;
	}
	summary.querySucceeded = true;
	summary.fullyCaughtUp = fetchResult.fullyCaughtUp !== false;
	summary.fetchedCount = fetchResult.rows.length;
	const rows = fetchResult.rows.toSorted((a, b) => a.rowid - b.rowid);
	const failureRetries = { ...cursor?.failureRetries };
	const cursorBeforeMs = cursor?.lastSeenMs ?? windowStartMs;
	const cursorBeforeRowid = cursor?.lastSeenRowid ?? 0;
	let highWatermarkMs = cursorBeforeMs;
	let highWatermarkRowid = cursorBeforeRowid;
	let earliestHeldFailureRow = null;
	for (const row of rows) {
		if (row.rowid <= sinceRowid) {
			summary.skippedPreCursor += 1;
			continue;
		}
		if (row.date < ageBoundMs) {
			summary.skippedPreCursor += 1;
			highWatermarkMs = Math.max(highWatermarkMs, row.date);
			highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
			continue;
		}
		if (row.isFromMe) {
			try {
				await params.observeSkippedFromMe?.(row);
			} catch (err) {
				params.warn?.(`imessage catchup: from-me observer failed for guid=${row.guid}: ${String(err)}`);
			}
			summary.skippedFromMe += 1;
			highWatermarkMs = Math.max(highWatermarkMs, row.date);
			highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
			continue;
		}
		const priorCount = failureRetries[row.guid] ?? 0;
		if (priorCount >= cfg.maxFailureRetries) {
			summary.skippedGivenUp += 1;
			highWatermarkMs = Math.max(highWatermarkMs, row.date);
			highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
			continue;
		}
		let dispatched;
		try {
			dispatched = await params.dispatch(row);
		} catch (err) {
			params.warn?.(`imessage catchup: dispatch threw for guid=${row.guid}: ${String(err)}`);
			dispatched = { ok: false };
		}
		if (dispatched.ok) {
			summary.replayed += 1;
			delete failureRetries[row.guid];
			highWatermarkMs = Math.max(highWatermarkMs, row.date);
			highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
			continue;
		}
		const nextCount = priorCount + 1;
		failureRetries[row.guid] = nextCount;
		summary.failed += 1;
		if (nextCount >= cfg.maxFailureRetries) {
			summary.givenUp += 1;
			params.warn?.(`imessage catchup: giving up on guid=${row.guid} after ${nextCount} failures; advancing cursor past it`);
			highWatermarkMs = Math.max(highWatermarkMs, row.date);
			highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
			continue;
		}
		if (earliestHeldFailureRow === null || row.rowid < earliestHeldFailureRow.rowid) earliestHeldFailureRow = row;
	}
	if (earliestHeldFailureRow === null) {
		if (typeof fetchResult.highWatermarkMs === "number") highWatermarkMs = Math.max(highWatermarkMs, fetchResult.highWatermarkMs);
		if (typeof fetchResult.highWatermarkRowid === "number") highWatermarkRowid = Math.max(highWatermarkRowid, fetchResult.highWatermarkRowid);
	}
	let lastSeenMs;
	let lastSeenRowid;
	if (earliestHeldFailureRow !== null) {
		lastSeenMs = Math.max(cursorBeforeMs, earliestHeldFailureRow.date - 1);
		lastSeenRowid = Math.max(cursorBeforeRowid, earliestHeldFailureRow.rowid - 1);
	} else {
		lastSeenMs = highWatermarkMs;
		lastSeenRowid = highWatermarkRowid;
	}
	const capped = capFailureRetriesMap(failureRetries);
	summary.cursorAfter = {
		lastSeenMs,
		lastSeenRowid
	};
	await saveIMessageCatchupCursor(params.accountId, {
		lastSeenMs,
		lastSeenRowid,
		failureRetries: capped
	}, { allowCursorRewindForRetries: earliestHeldFailureRow !== null });
	if (summary.replayed > 0 || summary.failed > 0 || summary.givenUp > 0) params.log?.(`imessage catchup: replayed=${summary.replayed} skippedFromMe=${summary.skippedFromMe} skippedGivenUp=${summary.skippedGivenUp} failed=${summary.failed} givenUp=${summary.givenUp} fetchedCount=${summary.fetchedCount}`);
	return summary;
}
//#endregion
//#region extensions/imessage/src/monitor/strip-imsg-length-prefixed-text.ts
const utf8Decoder = new TextDecoder();
function readVarint(buf, start) {
	let offset = start;
	let value = 0;
	let shift = 0;
	while (offset < buf.length && shift <= 28) {
		const byte = buf[offset];
		if (byte === void 0) return null;
		offset += 1;
		value |= (byte & 127) << shift;
		if ((byte & 128) === 0) return {
			nextOffset: offset,
			value
		};
		shift += 7;
	}
	return null;
}
function tryStripImessageLengthPrefixedUtf8Buffer(buf) {
	const key = readVarint(buf, 0);
	if (!key || key.nextOffset >= buf.length) return null;
	if (key.value !== 10) return null;
	const length = readVarint(buf, key.nextOffset);
	if (!length || length.value === 0) return null;
	if (length.nextOffset + length.value !== buf.length) return null;
	return buf.subarray(length.nextOffset, buf.length);
}
function stripImessageLengthPrefixedUtf8Text(text) {
	if (!text) return text;
	const stripped = tryStripImessageLengthPrefixedUtf8Buffer(Buffer.from(text, "utf8"));
	if (!stripped) return text;
	const inner = utf8Decoder.decode(stripped);
	return inner.length > 0 ? inner : text;
}
//#endregion
//#region extensions/imessage/src/monitor/parse-notification.ts
function isOptionalString(value) {
	return value === void 0 || value === null || typeof value === "string";
}
function isOptionalNumber(value) {
	return value === void 0 || value === null || typeof value === "number";
}
function isOptionalBoolean(value) {
	return value === void 0 || value === null || typeof value === "boolean";
}
function isOptionalStringArray(value) {
	return value === void 0 || value === null || Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isOptionalAttachments(value) {
	if (value === void 0 || value === null) return true;
	if (!Array.isArray(value)) return false;
	return value.every((attachment) => {
		if (!isRecord(attachment)) return false;
		return isOptionalString(attachment.original_path) && isOptionalString(attachment.mime_type) && isOptionalBoolean(attachment.missing) && isOptionalString(attachment.transfer_name) && isOptionalString(attachment.uti);
	});
}
function parseIMessageNotification(raw) {
	if (!isRecord(raw)) return null;
	const maybeMessage = raw.message;
	if (!isRecord(maybeMessage)) return null;
	const message = maybeMessage;
	if (!isOptionalNumber(message.id) || !isOptionalString(message.guid) || !isOptionalNumber(message.chat_id) || !isOptionalString(message.sender) || !isOptionalString(message.sender_name) || !isOptionalString(message.destination_caller_id) || !isOptionalBoolean(message.is_from_me) || !isOptionalString(message.text) || !isOptionalString(message.thread_originator_guid) || !isOptionalString(message.reply_to_guid) || !isOptionalString(message.reply_to_text) || !isOptionalString(message.reply_to_sender) || !isOptionalString(message.created_at) || !isOptionalBoolean(message.is_reaction) || !isOptionalBoolean(message.is_tapback) || !isOptionalString(message.associated_message_guid) || !isOptionalNumber(message.associated_message_type) || !isOptionalString(message.reaction_type) || !isOptionalString(message.reaction_emoji) || !isOptionalBoolean(message.is_reaction_add) || !isOptionalString(message.reacted_to_guid) || !isOptionalAttachments(message.attachments) || !isOptionalString(message.chat_identifier) || !isOptionalString(message.chat_guid) || !isOptionalString(message.chat_name) || !isOptionalStringArray(message.participants) || !isOptionalBoolean(message.is_group)) return null;
	return {
		...message,
		text: typeof message.text === "string" ? stripImessageLengthPrefixedUtf8Text(message.text) : message.text,
		reply_to_text: typeof message.reply_to_text === "string" ? stripImessageLengthPrefixedUtf8Text(message.reply_to_text) : message.reply_to_text
	};
}
//#endregion
//#region extensions/imessage/src/monitor/catchup-bridge.ts
const PER_CHAT_HISTORY_LIMIT = 500;
const CATCHUP_CHATS_LIST_LIMIT = 200;
const CATCHUP_RPC_TIMEOUT_MS = 3e4;
/**
* Wire `performIMessageCatchup` against the live `imsg` JSON-RPC client.
*
* Catchup recovers messages that landed in `chat.db` while the gateway was
* offline (crash, restart, mac sleep) by:
*   1. listing recently-active chats via `chats.list`,
*   2. fetching per-chat history since the cursor via `messages.history`,
*   3. sorting cross-chat by `rowid`, capping at `perRunLimit`,
*   4. admitting each row through the same durable GUID queue used by live
*      notifications, so replay, coalescing, echo, and receipt behavior match.
*
* Runs at most once per `monitorIMessageProvider` invocation, between
* `watch.subscribe` and the live dispatch loop. Anything that arrives during
* catchup itself flows through live admission; queue tombstones reject overlap.
*/
async function runIMessageCatchup(params) {
	const { client, accountId, config, includeAttachments, dispatchPayload, runtime } = params;
	const log = (msg) => runtime?.log?.(msg);
	const warnLog = (msg) => runtime?.log?.(warn(msg));
	const payloadByGuid = /* @__PURE__ */ new Map();
	const fetchFn = async ({ sinceMs, sinceRowid, limit }) => {
		const sinceISO = timestampMsToIsoString(sinceMs);
		if (!sinceISO) {
			warnLog(`imessage catchup: invalid since timestamp ${sinceMs}`);
			return {
				resolved: false,
				rows: []
			};
		}
		let chatsResult;
		try {
			chatsResult = await client.request("chats.list", { limit: CATCHUP_CHATS_LIST_LIMIT }, { timeoutMs: CATCHUP_RPC_TIMEOUT_MS });
		} catch (err) {
			warnLog(`imessage catchup: chats.list failed: ${String(err)}`);
			return {
				resolved: false,
				rows: []
			};
		}
		const chats = chatsResult?.chats ?? [];
		const collected = [];
		let historyFetchFailed = false;
		let rawWatermarkRowid = -Infinity;
		let rawWatermarkMs = -Infinity;
		for (const chat of chats) {
			const chatId = typeof chat.id === "number" && Number.isFinite(chat.id) ? chat.id : null;
			if (chatId === null) continue;
			const lastMs = typeof chat.last_message_at === "string" ? Date.parse(chat.last_message_at) : NaN;
			if (Number.isFinite(lastMs) && lastMs < sinceMs) continue;
			let historyResult;
			try {
				historyResult = await client.request("messages.history", {
					chat_id: chatId,
					limit: PER_CHAT_HISTORY_LIMIT,
					start: sinceISO,
					attachments: includeAttachments
				}, { timeoutMs: CATCHUP_RPC_TIMEOUT_MS });
			} catch (err) {
				historyFetchFailed = true;
				warnLog(`imessage catchup: messages.history failed for chat_id=${chatId}: ${String(err)}`);
				continue;
			}
			const messages = Array.isArray(historyResult?.messages) ? historyResult.messages : [];
			for (const raw of messages) {
				const rawRecord = raw && typeof raw === "object" ? raw : null;
				const rawRowid = rawRecord && typeof rawRecord.id === "number" && Number.isFinite(rawRecord.id) ? rawRecord.id : null;
				const rawCreatedAt = rawRecord && typeof rawRecord.created_at === "string" ? rawRecord.created_at : null;
				const rawDateMs = rawCreatedAt ? Date.parse(rawCreatedAt) : NaN;
				if (rawRowid !== null) rawWatermarkRowid = Math.max(rawWatermarkRowid, rawRowid);
				if (Number.isFinite(rawDateMs)) rawWatermarkMs = Math.max(rawWatermarkMs, rawDateMs);
				const payload = parseIMessageNotification({ message: raw });
				if (!payload) continue;
				const guid = payload.guid?.trim();
				const rowid = typeof payload.id === "number" ? payload.id : null;
				const dateMs = typeof payload.created_at === "string" ? Date.parse(payload.created_at) : NaN;
				if (!guid || rowid === null || !Number.isFinite(rowid) || !Number.isFinite(dateMs)) continue;
				if (rowid <= sinceRowid) continue;
				collected.push({
					guid,
					rowid,
					date: dateMs,
					isFromMe: payload.is_from_me === true
				});
				payloadByGuid.set(guid, {
					message: payload,
					rawEnvelope: { message: raw }
				});
			}
		}
		const sorted = collected.toSorted((a, b) => a.rowid - b.rowid);
		const capped = sorted.slice(0, limit);
		const isCapTruncated = capped.length < sorted.length;
		if (isCapTruncated) {
			warnLog(`imessage catchup: fetched ${sorted.length} rows across chats, capped to perRunLimit=${limit} (oldest first); next startup picks up the rest`);
			const keep = new Set(capped.map((row) => row.guid));
			for (const guid of payloadByGuid.keys()) if (!keep.has(guid)) payloadByGuid.delete(guid);
		}
		let effectiveWatermarkRowid = rawWatermarkRowid;
		let effectiveWatermarkMs = rawWatermarkMs;
		if (isCapTruncated && capped.length > 0) {
			const last = capped.at(-1);
			if (last) {
				effectiveWatermarkRowid = Math.min(effectiveWatermarkRowid, last.rowid);
				effectiveWatermarkMs = Math.min(effectiveWatermarkMs, last.date);
			}
		} else if (isCapTruncated && capped.length === 0) {
			effectiveWatermarkRowid = NaN;
			effectiveWatermarkMs = NaN;
		}
		return {
			resolved: true,
			rows: capped,
			fullyCaughtUp: !historyFetchFailed && !isCapTruncated,
			...Number.isFinite(effectiveWatermarkRowid) ? { highWatermarkRowid: effectiveWatermarkRowid } : {},
			...Number.isFinite(effectiveWatermarkMs) ? { highWatermarkMs: effectiveWatermarkMs } : {}
		};
	};
	const dispatchFn = async (row) => {
		const entry = payloadByGuid.get(row.guid);
		if (!entry) {
			warnLog(`imessage catchup: missing payload for guid=${row.guid}, skipping`);
			return { ok: false };
		}
		try {
			await dispatchPayload(entry.message, entry.rawEnvelope);
			return { ok: true };
		} catch (err) {
			warnLog(`imessage catchup: dispatch threw for guid=${row.guid}: ${String(err)}`);
			return { ok: false };
		}
	};
	return await performIMessageCatchup({
		accountId,
		config,
		fetch: fetchFn,
		dispatch: dispatchFn,
		observeSkippedFromMe: async (row) => {
			const entry = payloadByGuid.get(row.guid);
			if (!entry) {
				warnLog(`imessage catchup: missing skipped from-me payload for guid=${row.guid}`);
				return;
			}
			await params.observeSkippedFromMePayload?.(entry.message);
		},
		log,
		warn: warnLog,
		...params.now ? { now: params.now() } : {}
	});
}
//#endregion
//#region extensions/imessage/src/monitor/coalesce.ts
/**
* Bounds on the merged output when multiple inbound iMessage payloads are
* folded into one agent turn. Caps each merge so a sender who
* rapid-fires DMs inside the debounce window cannot amplify the downstream
* prompt past a safe ceiling. Every source GUID still surfaces via
* `coalescedMessageGuids` so a future replay path can recognize duplicates.
*/
const MAX_COALESCED_TEXT_CHARS = 4e3;
const MAX_COALESCED_ATTACHMENTS = 20;
/**
* Combine consecutive same-sender iMessage payloads into a single payload for
* downstream dispatch. Used for the general inbound debounce
* (`messages.inbound`, off by default) when configured.
*
* The first payload anchors the merged shape (preserving its GUID for reply
* threading). Text is concatenated with deduplication, attachments are merged
* (capped), and the latest `created_at` wins so downstream sees the most
* recent activity timestamp.
*/
function combineIMessagePayloads(payloads) {
	if (payloads.length === 0) throw new Error("combineIMessagePayloads: cannot combine empty payloads");
	const first = expectDefined(payloads[0], "first iMessage payload to coalesce");
	if (payloads.length === 1) return first;
	const seenTexts = /* @__PURE__ */ new Set();
	const textParts = [];
	const allAttachments = [];
	const seenGuids = /* @__PURE__ */ new Set();
	const coalescedMessageGuids = [];
	let textLength = 0;
	let latestCreatedAt;
	let maxRowid = -Infinity;
	let maxDateMs = -Infinity;
	let reply;
	let payloadIndex = 0;
	for (const payload of payloads) {
		const keepContent = payloadIndex < 9 || payloadIndex === payloads.length - 1;
		payloadIndex += 1;
		const createdAt = payload.created_at;
		if (typeof createdAt === "string" && createdAt.length > 0 && (latestCreatedAt === void 0 || createdAt > latestCreatedAt)) latestCreatedAt = createdAt;
		if (typeof payload.id === "number" && Number.isFinite(payload.id)) maxRowid = Math.max(maxRowid, payload.id);
		const dateMs = typeof createdAt === "string" ? Date.parse(createdAt) : NaN;
		if (Number.isFinite(dateMs)) maxDateMs = Math.max(maxDateMs, dateMs);
		const guid = payload.guid?.trim();
		if (guid && !seenGuids.has(guid)) {
			seenGuids.add(guid);
			coalescedMessageGuids.push(guid);
		}
		if (!reply && (payload.thread_originator_guid != null || payload.reply_to_guid != null)) reply = payload;
		if (!keepContent) continue;
		const text = textLength <= MAX_COALESCED_TEXT_CHARS ? (payload.text ?? "").trim() : "";
		if (text) {
			const normalized = seenTexts.size > 0 ? text.toLowerCase() : void 0;
			if (normalized === void 0 || !seenTexts.has(normalized)) {
				const separatorLength = textParts.length > 0 ? 1 : 0;
				const part = text.slice(0, 4001 - textLength - separatorLength);
				textParts.push(part);
				textLength += separatorLength + part.length;
				if (textLength <= MAX_COALESCED_TEXT_CHARS) seenTexts.add(normalized ?? text.toLowerCase());
			}
		}
		if (allAttachments.length < MAX_COALESCED_ATTACHMENTS) for (const attachment of payload.attachments ?? []) {
			allAttachments.push(attachment);
			if (allAttachments.length === MAX_COALESCED_ATTACHMENTS) break;
		}
	}
	let combinedText = textParts.join(" ");
	if (textLength > MAX_COALESCED_TEXT_CHARS) combinedText = `${sliceUtf16Safe(combinedText, 0, MAX_COALESCED_TEXT_CHARS)}…[truncated]`;
	reply ??= first;
	return {
		...first,
		text: combinedText,
		attachments: allAttachments.length > 0 ? allAttachments : null,
		created_at: latestCreatedAt ?? first.created_at,
		thread_originator_guid: reply.thread_originator_guid ?? null,
		reply_to_guid: reply.reply_to_guid ?? null,
		reply_to_text: reply.reply_to_text ?? null,
		reply_to_sender: reply.reply_to_sender ?? null,
		coalescedMessageGuids: coalescedMessageGuids.length > 0 ? coalescedMessageGuids : void 0,
		coalescedCatchupCursor: Number.isFinite(maxRowid) && Number.isFinite(maxDateMs) ? {
			lastSeenMs: maxDateMs,
			lastSeenRowid: maxRowid
		} : void 0
	};
}
//#endregion
//#region extensions/imessage/src/monitor/conversation-repair.ts
const DEFAULT_CHATS_LIMIT = 20;
const DEFAULT_PER_CHAT_HISTORY_LIMIT = 50;
const DEFAULT_RPC_TIMEOUT_MS = 5e3;
function hasPositiveChatId(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function isExplicitEmptyString(value) {
	return typeof value === "string" && value.trim() === "";
}
function hasUsableConversationAnchor(projection) {
	return hasPositiveChatId(projection.chat_id) || hasNonEmptyString(projection.chat_guid) || hasNonEmptyString(projection.chat_identifier);
}
function isIMessageAnchorless(message) {
	if (hasPositiveChatId(message.chat_id) || hasNonEmptyString(message.chat_guid) || hasNonEmptyString(message.chat_identifier)) return false;
	return message.chat_id === null || typeof message.chat_id === "number" && (!Number.isFinite(message.chat_id) || message.chat_id <= 0) || isExplicitEmptyString(message.chat_guid) || isExplicitEmptyString(message.chat_identifier);
}
function extractAuthoritativeRecoveryProjection(entry) {
	if (typeof entry.is_group !== "boolean" || typeof entry.is_from_me !== "boolean") return null;
	if (!hasNonEmptyString(entry.sender)) return null;
	const projection = {
		sender: entry.sender.trim(),
		is_from_me: entry.is_from_me,
		is_group: entry.is_group
	};
	if (hasNonEmptyString(entry.destination_caller_id)) projection.destination_caller_id = entry.destination_caller_id.trim();
	if (hasPositiveChatId(entry.chat_id)) projection.chat_id = entry.chat_id;
	if (hasNonEmptyString(entry.chat_guid)) projection.chat_guid = entry.chat_guid;
	if (hasNonEmptyString(entry.chat_identifier)) projection.chat_identifier = entry.chat_identifier;
	if (typeof entry.chat_name === "string") projection.chat_name = entry.chat_name;
	if (Array.isArray(entry.participants) && entry.participants.every((participant) => typeof participant === "string")) projection.participants = entry.participants;
	return hasUsableConversationAnchor(projection) ? projection : null;
}
function projectionConflictKey(projection) {
	return JSON.stringify({
		chat_id: projection.chat_id ?? null,
		chat_guid: projection.chat_guid ?? null,
		chat_identifier: projection.chat_identifier ?? null,
		is_group: projection.is_group,
		sender: projection.sender,
		destination_caller_id: projection.destination_caller_id ?? null,
		is_from_me: projection.is_from_me
	});
}
function applyAuthoritativeRecoveryProjection(message, projection) {
	return {
		...message,
		...projection.chat_id !== void 0 ? { chat_id: projection.chat_id } : {},
		...projection.chat_guid !== void 0 ? { chat_guid: projection.chat_guid } : {},
		...projection.chat_identifier !== void 0 ? { chat_identifier: projection.chat_identifier } : {},
		...projection.chat_name !== void 0 ? { chat_name: projection.chat_name } : {},
		...projection.participants !== void 0 ? { participants: projection.participants } : {},
		is_group: projection.is_group,
		sender: projection.sender,
		destination_caller_id: projection.destination_caller_id ?? null,
		is_from_me: projection.is_from_me
	};
}
async function repairIMessageConversationAnchor(params) {
	const { client, message, runtime } = params;
	if (!isIMessageAnchorless(message)) return message;
	const guid = message.guid?.trim();
	if (!guid) {
		runtime?.error?.("imessage: dropping anchorless message without GUID");
		return null;
	}
	let chatsResult;
	try {
		chatsResult = await client.request("chats.list", { limit: params.chatsLimit ?? DEFAULT_CHATS_LIMIT }, { timeoutMs: params.rpcTimeoutMs ?? DEFAULT_RPC_TIMEOUT_MS });
	} catch (err) {
		runtime?.error?.(`imessage: anchorless message recovery failed listing chats: ${String(err)}`);
		return null;
	}
	const matchedProjections = [];
	const chats = chatsResult?.chats ?? [];
	for (const chat of chats) {
		const chatId = hasPositiveChatId(chat.id) ? chat.id : null;
		if (chatId === null) continue;
		let historyResult;
		try {
			historyResult = await client.request("messages.history", {
				attachments: false,
				chat_id: chatId,
				limit: params.perChatHistoryLimit ?? DEFAULT_PER_CHAT_HISTORY_LIMIT
			}, { timeoutMs: params.rpcTimeoutMs ?? DEFAULT_RPC_TIMEOUT_MS });
		} catch {
			continue;
		}
		const messages = Array.isArray(historyResult?.messages) ? historyResult.messages : [];
		for (const raw of messages) {
			if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
			const entry = raw;
			if (entry.guid !== guid) continue;
			const projection = extractAuthoritativeRecoveryProjection(entry);
			if (!projection) {
				runtime?.error?.(`imessage: dropping anchorless message GUID=${guid}; exact-GUID history row is incomplete`);
				return null;
			}
			matchedProjections.push(projection);
		}
	}
	const [projection] = matchedProjections;
	if (!projection) {
		runtime?.error?.(`imessage: dropping anchorless message GUID=${guid}; no recent chat matched`);
		return null;
	}
	if (new Set(matchedProjections.map(projectionConflictKey)).size > 1) {
		runtime?.error?.(`imessage: dropping anchorless message GUID=${guid}; conflicting exact-GUID history projections`);
		return null;
	}
	if (projection.is_from_me) {
		runtime?.error?.(`imessage: dropping anchorless message GUID=${guid}; recovered authoritative row is from-me`);
		return null;
	}
	const repaired = applyAuthoritativeRecoveryProjection(message, projection);
	if (isIMessageAnchorless(repaired)) {
		runtime?.error?.(`imessage: dropping anchorless message GUID=${guid} after recovery found no usable conversation anchor`);
		return null;
	}
	runtime?.log?.(`imessage: recovered anchorless message GUID=${guid} chat_id=${repaired.chat_id ?? "unknown"} is_group=${repaired.is_group === true}`);
	return repaired;
}
//#endregion
//#region extensions/imessage/src/monitor/deliver.ts
async function deliverIMessageReply(params) {
	const { payload, target, runtime, maxBytes, textLimit, accountId, sentMessageCache } = params;
	const scope = `${accountId ?? ""}:${target}`;
	const { cfg } = params;
	const tableMode = resolveMarkdownTableMode$1({
		cfg,
		channel: "imessage",
		accountId
	});
	const chunkMode = resolveChunkMode(cfg, "imessage", accountId);
	const rawText = sanitizeOutboundText(payload.text ?? "");
	const reply = resolveSendableOutboundReplyParts(payload, { text: convertMarkdownTables$1(rawText, tableMode) });
	const accepted = [];
	const sendAccepted = async (text, mediaUrl) => {
		const sent = await sendMessageIMessage(target, text, {
			config: cfg,
			...mediaUrl ? {
				mediaUrl,
				...payload.audioAsVoice ? { audioAsVoice: true } : {}
			} : {},
			maxBytes,
			accountId,
			replyToId: payload.replyToId
		});
		accepted.push(sent);
		const echoText = sent.echoText ?? (sent.sentText || void 0);
		sentMessageCache?.remember(scope, {
			...echoText ? { text: echoText } : {},
			...sent.echoMedia ? { media: sent.echoMedia } : {},
			messageId: sent.messageId
		});
	};
	let delivered;
	try {
		delivered = await deliverTextOrMediaReply({
			payload,
			text: reply.text,
			chunkText: (value) => chunkTextWithMode(value, textLimit, chunkMode),
			sendText: sendAccepted,
			sendMedia: ({ mediaUrl, caption }) => sendAccepted(caption ?? "", mediaUrl)
		});
	} catch (error) {
		const partial = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
		if (accepted.length === 0 && partial?.visibleReplySent !== true) throw error;
		throw createChannelPartialDeliveryError(error, createAcceptedChannelDeliveryResult({
			results: accepted.map((result) => ({ receipt: result.receipt })),
			deliveryResults: partial ? [partial] : [],
			kind: reply.mediaUrls.length > 0 ? "media" : "text",
			content: [...accepted.map((result) => result.sentText), partial?.content].filter(Boolean).join("\n")
		}));
	}
	if (delivered === "empty") return {
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
	const deliveryResult = createAcceptedChannelDeliveryResult({
		results: accepted.map((result) => ({ receipt: result.receipt })),
		kind: delivered,
		content: accepted.map((result) => result.sentText).filter(Boolean).join("\n")
	});
	runtime.log?.(`imessage: delivered reply to ${target}`);
	return deliveryResult;
}
function createIMessageEchoCachingSend(params) {
	return async (target, text, opts) => {
		const sanitizedText = sanitizeOutboundText(text);
		const sent = await sendMessageIMessage(target, sanitizedText, opts);
		const scope = `${params.accountId ?? opts.accountId ?? ""}:${target}`;
		const echoText = sent.echoText ?? (sent.sentText || void 0);
		params.sentMessageCache?.remember(scope, {
			...echoText ? { text: echoText } : {},
			...sent.echoMedia ? { media: sent.echoMedia } : {},
			messageId: sent.messageId
		});
		return sent;
	};
}
//#endregion
//#region extensions/imessage/src/monitor/dm-history.ts
const DM_HISTORY_RPC_TIMEOUT_MS = 1e4;
function resolveIMessageDmHistoryLimit(params) {
	const senderCandidates = [
		normalizeOptionalString(params.senderNormalized),
		normalizeOptionalString(params.sender),
		params.sender ? normalizeIMessageHandle(params.sender) : void 0
	].filter((candidate) => Boolean(candidate));
	for (const candidate of senderCandidates) {
		const override = params.config.dms?.[candidate]?.historyLimit;
		if (override !== void 0) return Math.max(0, override);
	}
	return Math.max(0, params.config.dmHistoryLimit ?? 0);
}
function historyRowSortValue(message) {
	if (typeof message.id === "number" && Number.isFinite(message.id)) return message.id;
	const createdAtMs = typeof message.created_at === "string" ? Date.parse(message.created_at) : NaN;
	return Number.isFinite(createdAtMs) ? createdAtMs : 0;
}
function isBeforeCurrentMessage(params) {
	const { message, currentMessage } = params;
	if (typeof message.id === "number" && typeof currentMessage.id === "number" && Number.isFinite(message.id) && Number.isFinite(currentMessage.id)) return message.id < currentMessage.id;
	const guid = normalizeOptionalString(message.guid);
	const currentGuid = normalizeOptionalString(currentMessage.guid);
	if (guid && currentGuid) return guid !== currentGuid;
	return true;
}
function historyEntryFromMessage(message, fallbackSender) {
	const body = normalizeOptionalString(message.text);
	if (!body) return null;
	const timestamp = parseDateStringTimestampMs(message.created_at);
	return {
		sender: message.is_from_me === true ? "Me" : normalizeIMessageHandle(normalizeOptionalString(message.sender) ?? fallbackSender) || fallbackSender,
		body,
		...timestamp !== void 0 ? { timestamp } : {}
	};
}
async function resolveIMessageDmHistoryContext(params) {
	const maxMessages = Math.max(0, Math.floor(params.limit));
	const chatId = typeof params.message.chat_id === "number" && Number.isFinite(params.message.chat_id) ? params.message.chat_id : void 0;
	if (maxMessages <= 0 || chatId === void 0) return {};
	let result;
	try {
		result = await params.client.request("messages.history", {
			chat_id: chatId,
			limit: maxMessages + 1,
			attachments: false
		}, { timeoutMs: DM_HISTORY_RPC_TIMEOUT_MS });
	} catch (err) {
		params.logVerbose?.(`imessage: DM history fetch failed for chat_id=${chatId}: ${String(err)}`);
		return {};
	}
	const history = (Array.isArray(result?.messages) ? result.messages : []).map((row) => parseIMessageNotification({ message: row })).filter((message) => Boolean(message)).filter((message) => message.is_group !== true).filter((message) => isBeforeCurrentMessage({
		message,
		currentMessage: params.message
	})).toSorted((a, b) => historyRowSortValue(a) - historyRowSortValue(b)).map((message) => historyEntryFromMessage(message, params.senderNormalized)).filter((entry) => Boolean(entry)).slice(-maxMessages);
	if (history.length === 0) return {};
	return {
		inboundHistory: history,
		body: history.map((entry) => formatInboundEnvelope({
			channel: "iMessage",
			from: entry.sender,
			timestamp: entry.timestamp,
			body: entry.body,
			chatType: "direct",
			senderLabel: entry.sender,
			envelope: params.envelopeOptions
		})).join("\n\n")
	};
}
//#endregion
//#region extensions/imessage/src/monitor/drop-diagnostic-cache.ts
const THROTTLED_DROP_DIAGNOSTIC_CACHE_MAX_SIZE = 512;
function createIMessageThrottledDropDiagnosticCache() {
	return createDedupeCache({
		maxSize: THROTTLED_DROP_DIAGNOSTIC_CACHE_MAX_SIZE,
		ttlMs: 0
	});
}
//#endregion
//#region extensions/imessage/src/monitor/echo-cache.ts
const SENT_MESSAGE_TEXT_TTL_MS = 4e3;
const SENT_MESSAGE_ID_TTL_MS = 6e4;
function normalizeEchoTextKey(text) {
	if (!text) return null;
	const normalized = stripLeadingEchoTextCorruptionMarkers(text.replace(/\r\n?/g, "\n").trim()).trim();
	return normalized ? normalized : null;
}
function normalizeEchoMessageIdKey(messageId) {
	if (!messageId) return null;
	const normalized = messageId.trim();
	if (!normalized || normalized === "ok" || normalized === "unknown") return null;
	return normalized;
}
var DefaultSentMessageCache = class {
	constructor() {
		this.textCache = /* @__PURE__ */ new Map();
		this.textBackedByIdCache = /* @__PURE__ */ new Map();
		this.mediaCache = /* @__PURE__ */ new Map();
		this.mediaBackedByIdCache = /* @__PURE__ */ new Map();
		this.messageIdCache = /* @__PURE__ */ new Map();
	}
	remember(scope, lookup) {
		const textKey = normalizeEchoTextKey(lookup.text);
		if (textKey) this.textCache.set(`${scope}:${textKey}`, Date.now());
		const mediaKey = resolveIMessageEchoMediaKey(lookup.media);
		if (mediaKey) this.mediaCache.set(`${scope}:${mediaKey}`, Date.now());
		const messageIdKey = normalizeEchoMessageIdKey(lookup.messageId);
		if (messageIdKey) {
			this.messageIdCache.set(`${scope}:${messageIdKey}`, Date.now());
			if (textKey) this.textBackedByIdCache.set(`${scope}:${textKey}`, Date.now());
			if (mediaKey) this.mediaBackedByIdCache.set(`${scope}:${mediaKey}`, Date.now());
		}
		this.cleanup();
	}
	async has(scope, lookup, options = false) {
		this.cleanup();
		const resolvedOptions = typeof options === "boolean" ? { skipIdShortCircuit: options } : options;
		if (await hasPersistedIMessageEcho({
			scope,
			text: lookup.text,
			media: lookup.media,
			messageId: lookup.messageId,
			skipIdShortCircuit: resolvedOptions.skipIdShortCircuit,
			includePendingText: resolvedOptions.includePendingText
		})) return true;
		const textKey = normalizeEchoTextKey(lookup.text);
		const mediaKey = resolveIMessageEchoMediaKey(lookup.media);
		const messageIdKey = normalizeEchoMessageIdKey(lookup.messageId);
		let canUseMediaFallback = !messageIdKey;
		if (messageIdKey) {
			const idTimestamp = this.messageIdCache.get(`${scope}:${messageIdKey}`);
			if (idTimestamp && Date.now() - idTimestamp <= SENT_MESSAGE_ID_TTL_MS) return true;
			const textTimestamp = textKey ? this.textCache.get(`${scope}:${textKey}`) : void 0;
			const textBackedByIdTimestamp = textKey ? this.textBackedByIdCache.get(`${scope}:${textKey}`) : void 0;
			const hasTextOnlyMatch = typeof textTimestamp === "number" && (!textBackedByIdTimestamp || textTimestamp > textBackedByIdTimestamp);
			const mediaTimestamp = mediaKey ? this.mediaCache.get(`${scope}:${mediaKey}`) : void 0;
			const mediaBackedByIdTimestamp = mediaKey ? this.mediaBackedByIdCache.get(`${scope}:${mediaKey}`) : void 0;
			const hasMediaOnlyMatch = typeof mediaTimestamp === "number" && (!mediaBackedByIdTimestamp || mediaTimestamp > mediaBackedByIdTimestamp);
			canUseMediaFallback = hasMediaOnlyMatch;
			if (!resolvedOptions.skipIdShortCircuit && !hasTextOnlyMatch && !hasMediaOnlyMatch) return false;
		}
		if (textKey) {
			const textTimestamp = this.textCache.get(`${scope}:${textKey}`);
			if (textTimestamp && Date.now() - textTimestamp <= SENT_MESSAGE_TEXT_TTL_MS) return true;
		}
		if (mediaKey && canUseMediaFallback) {
			const mediaTimestamp = this.mediaCache.get(`${scope}:${mediaKey}`);
			if (mediaTimestamp && Date.now() - mediaTimestamp <= SENT_MESSAGE_TEXT_TTL_MS) return true;
		}
		return false;
	}
	cleanup() {
		const now = Date.now();
		for (const [key, timestamp] of this.textCache.entries()) if (now - timestamp > SENT_MESSAGE_TEXT_TTL_MS) this.textCache.delete(key);
		for (const [key, timestamp] of this.textBackedByIdCache.entries()) if (now - timestamp > SENT_MESSAGE_TEXT_TTL_MS) this.textBackedByIdCache.delete(key);
		for (const [key, timestamp] of this.mediaCache.entries()) if (now - timestamp > SENT_MESSAGE_TEXT_TTL_MS) this.mediaCache.delete(key);
		for (const [key, timestamp] of this.mediaBackedByIdCache.entries()) if (now - timestamp > SENT_MESSAGE_TEXT_TTL_MS) this.mediaBackedByIdCache.delete(key);
		for (const [key, timestamp] of this.messageIdCache.entries()) if (now - timestamp > SENT_MESSAGE_ID_TTL_MS) this.messageIdCache.delete(key);
	}
};
function createSentMessageCache() {
	return new DefaultSentMessageCache();
}
//#endregion
//#region extensions/imessage/src/monitor/group-allowlist-warnings.ts
const PER_CHAT_WARNING_CACHE_MAX_SIZE = 512;
const startupWarned = /* @__PURE__ */ new Set();
const perChatWarned = createDedupeCache({
	maxSize: PER_CHAT_WARNING_CACHE_MAX_SIZE,
	ttlMs: 0
});
/**
* Fires once per `accountId` at monitor startup when `groupPolicy === "allowlist"`
* and the effective group sender allowlist is empty. The sender gate runs
* before the group registry, so `channels.imessage.groups` entries cannot admit
* traffic without a sender allowlist. A non-empty `groupAllowFrom` makes the
* configuration potentially valid and suppresses this drop-all warning.
*/
function warnGroupAllowlistMisconfigOnce(params) {
	if (params.groupPolicy !== "allowlist") return false;
	if (params.hasGroupAllowFrom) return false;
	const key = `imessage:${params.accountId}`;
	if (startupWarned.has(key)) return false;
	startupWarned.add(key);
	params.log(`imessage: groupPolicy="allowlist" for account "${params.accountId}" but no group sender allowlist is configured (channels.imessage.groupAllowFrom, or its allowFrom fallback). Every inbound group message will be dropped. Set channels.imessage.groupAllowFrom (sender handles, chat targets like chat_id:<id>, or "*") to admit group senders, and optionally add channels.imessage.groups entries to scope which chats are allowed.`);
	return true;
}
/**
* Fires once per `accountId:chat_id` when the runtime allowlist gate drops a
* group message because that chat_id is not in `channels.imessage.groups`.
* Retains up to 512 recently active account/chat pairs; evicted chats may warn again.
*/
function warnGroupAllowlistDropPerChatOnce(params) {
	const chat = params.chatId == null ? "" : String(params.chatId).trim();
	if (!chat) return false;
	const key = `imessage:${params.accountId}:${chat}`;
	if (perChatWarned.check(key)) return false;
	params.log(`imessage: dropping group message from chat_id=${chat} (account "${params.accountId}") — not in channels.imessage.groups allowlist. Add channels.imessage.groups["${chat}"] or channels.imessage.groups["*"] to allow it.`);
	return true;
}
//#endregion
//#region extensions/imessage/src/monitor/inbound-dedupe.ts
const IMESSAGE_STALE_INBOUND_THRESHOLD_MS = 9e5;
const IMESSAGE_RECOVERY_MAX_AGE_MS = 72e5;
/**
* Age fence: true when the message's own send date is materially older than
* now, i.e. stale backlog rather than a live message. Fails open (returns
* false) when the send date is missing or unparseable so an undateable message
* is never suppressed on a timestamp we cannot read.
*/
function isStaleIMessageBacklog(message, nowMs, thresholdMs = IMESSAGE_STALE_INBOUND_THRESHOLD_MS) {
	const createdAt = message.created_at?.trim();
	if (!createdAt) return false;
	const sentMs = Date.parse(createdAt);
	if (!Number.isFinite(sentMs)) return false;
	return nowMs - sentMs > thresholdMs;
}
//#endregion
//#region extensions/imessage/src/conversation-route.ts
function resolveIMessageConversationRoute(params) {
	const route = resolveAgentRoute({
		cfg: params.cfg,
		channel: "imessage",
		accountId: params.accountId,
		peer: {
			kind: params.isGroup ? "group" : "direct",
			id: params.peerId
		}
	});
	const conversationId = resolveIMessageInboundConversationId({
		isGroup: params.isGroup,
		sender: params.sender,
		chatId: params.chatId
	});
	if (!conversationId) return {
		route,
		bindingResolution: null
	};
	const conversation = {
		channel: "imessage",
		accountId: params.accountId,
		conversationId
	};
	const configuredRoute = resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation
	});
	const runtimeRoute = resolveRuntimeConversationBindingRoute({
		route: configuredRoute.route,
		conversation
	});
	if (runtimeRoute.bindingRecord && !runtimeRoute.boundSessionKey) logVerbose(`imessage: plugin-bound conversation ${conversationId}`);
	else if (runtimeRoute.boundSessionKey) logVerbose(`imessage: routed via bound conversation ${conversationId} -> ${runtimeRoute.boundSessionKey}`);
	return {
		route: runtimeRoute.route,
		bindingResolution: runtimeRoute.bindingRecord ? null : configuredRoute.bindingResolution
	};
}
//#endregion
//#region extensions/imessage/src/monitor/reflection-guard.ts
const REFLECTION_PATTERNS = [
	{
		re: /(?:#\+){2,}#?/,
		label: "internal-separator"
	},
	{
		re: /\bassistant\s+to\s*=\s*\w+/i,
		label: "assistant-role-marker"
	},
	{
		re: /<\s*\/?\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/i,
		label: "thinking-tag"
	},
	{
		re: /<\s*\/?\s*relevant[-_]memories\b[^<>]*>/i,
		label: "relevant-memories-tag"
	},
	{
		re: /<\s*\/?\s*final\b[^<>]*>/i,
		label: "final-tag"
	},
	{
		re: /\bACP error\s*\(\s*ACP_[A-Z0-9_]+\s*\):/i,
		label: "acp-error"
	},
	{
		re: /\bMissing API key for\b.+\bon the gateway\b/i,
		label: "gateway-missing-api-key"
	}
];
function hasMatchOutsideCode(text, re) {
	const codeRegions = findCodeRegions(text);
	const globalRe = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
	for (const match of text.matchAll(globalRe)) {
		const start = match.index ?? -1;
		if (start >= 0 && !isInsideCode(start, codeRegions)) return true;
	}
	return false;
}
/**
* Check whether an inbound message appears to be a reflection of
* assistant-originated content. Returns matched pattern labels for telemetry.
*/
function detectReflectedContent(text) {
	if (!text) return {
		isReflection: false,
		matchedLabels: []
	};
	const matchedLabels = [];
	for (const { re, label } of REFLECTION_PATTERNS) if (hasMatchOutsideCode(text, re)) matchedLabels.push(label);
	return {
		isReflection: matchedLabels.length > 0,
		matchedLabels
	};
}
//#endregion
//#region extensions/imessage/src/monitor/inbound-processing.ts
const normalizeNonEmpty = (value) => value.trim() || null;
const imessageConversationIdentityKinds = /* @__PURE__ */ new Set([
	"plugin:imessage-chat-id",
	"plugin:imessage-chat-guid",
	"plugin:imessage-chat-identifier"
]);
const matchIMessageIngressEntry = ({ entry, context }) => {
	if (imessageConversationIdentityKinds.has(entry.kind) && context !== "group") return false;
};
function isIMessageConversationAllowTarget(entry) {
	const parsed = parseIMessageAllowTarget(entry);
	return parsed.kind === "chat_id" || parsed.kind === "chat_guid" || parsed.kind === "chat_identifier";
}
function mergeIMessageGroupAllowFromWithLegacyChatTargets(params) {
	if (params.groupAllowFrom.length > 0 || !params.allowLegacyConversationTargets) return params.groupAllowFrom;
	const legacyChatTargets = params.allowFrom.filter((entry) => isIMessageConversationAllowTarget(entry));
	if (legacyChatTargets.length === 0) return params.groupAllowFrom;
	return uniqueStrings([...params.groupAllowFrom, ...legacyChatTargets]);
}
const imessageIngressIdentity = defineStableChannelIngressIdentity({
	key: "imessage-sender",
	normalizeEntry: normalizeIMessageHandleEntry,
	normalizeSubject: normalizeIMessageHandle,
	sensitivity: "pii",
	matchEntry: matchIMessageIngressEntry,
	aliases: [
		[
			"imessage-chat-id",
			"plugin:imessage-chat-id",
			normalizeIMessageChatIdEntry
		],
		[
			"imessage-chat-guid",
			"plugin:imessage-chat-guid",
			normalizeIMessageChatGuidEntry
		],
		[
			"imessage-chat-identifier",
			"plugin:imessage-chat-identifier",
			normalizeIMessageChatIdentifierEntry
		]
	].map(([key, kind, normalizeEntry]) => ({
		key,
		kind,
		normalizeEntry,
		normalizeSubject: normalizeNonEmpty,
		sensitivity: "pii"
	})),
	resolveEntryId: ({ entryIndex }) => `imessage-entry-${entryIndex + 1}`
});
function normalizeIMessageHandleEntry(entry) {
	const parsed = parseIMessageAllowTarget(entry.trim());
	return parsed.kind === "handle" ? normalizeIMessageHandle(parsed.handle) : null;
}
function normalizeIMessageChatIdEntry(entry) {
	const parsed = parseIMessageAllowTarget(entry.trim());
	return parsed.kind === "chat_id" ? String(parsed.chatId) : null;
}
function normalizeIMessageChatGuidEntry(entry) {
	const parsed = parseIMessageAllowTarget(entry.trim());
	return parsed.kind === "chat_guid" ? parsed.chatGuid.trim() || null : null;
}
function normalizeIMessageChatIdentifierEntry(entry) {
	const parsed = parseIMessageAllowTarget(entry.trim());
	return parsed.kind === "chat_identifier" ? parsed.chatIdentifier.trim() || null : null;
}
function normalizeDmPolicy(policy) {
	return policy === "open" || policy === "allowlist" || policy === "disabled" ? policy : "pairing";
}
function normalizeGroupPolicy(policy) {
	return policy === "open" || policy === "disabled" ? policy : "allowlist";
}
function normalizeReplyField(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed ? trimmed : void 0;
	}
	if (typeof value === "number") return String(value);
}
function describeReplyContext(message) {
	const body = normalizeReplyField(message.reply_to_text);
	if (!body) return null;
	return {
		body,
		id: normalizeReplyField(message.thread_originator_guid) ?? normalizeReplyField(message.reply_to_guid),
		sender: normalizeReplyField(message.reply_to_sender)
	};
}
function resolveInboundEchoMessageIds(message) {
	const values = [message.id != null ? String(message.id) : void 0, normalizeReplyField(message.guid)];
	return uniqueStrings(values.filter((value) => Boolean(value)));
}
function rememberIMessageSkippedFromMeForSelfChatDedupe(params) {
	if (params.message.is_from_me !== true) return;
	const sender = params.message.sender?.trim();
	if (!sender) return;
	const chatId = params.message.chat_id ?? void 0;
	const isGroup = Boolean(params.message.is_group);
	const chatIdentifierNormalized = normalizeIMessageHandle(params.message.chat_identifier ?? "") || void 0;
	const destinationCallerIdNormalized = normalizeIMessageHandle(params.message.destination_caller_id ?? "") || void 0;
	const senderNormalized = normalizeIMessageHandle(sender);
	const createdAt = params.message.created_at ? Date.parse(params.message.created_at) : void 0;
	const lookup = {
		accountId: params.accountId,
		isGroup,
		chatId,
		sender,
		text: params.bodyText.trim(),
		createdAt
	};
	const isSelfChat = !isGroup && chatIdentifierNormalized != null && senderNormalized === chatIdentifierNormalized && destinationCallerIdNormalized != null && destinationCallerIdNormalized === senderNormalized;
	const isAmbiguousSelfThread = !isGroup && chatIdentifierNormalized != null && senderNormalized === chatIdentifierNormalized && destinationCallerIdNormalized == null;
	if (isSelfChat) params.selfChatCache?.remember({
		...lookup,
		allowCreatedAtSkew: true
	});
	else if (isAmbiguousSelfThread) params.selfChatCache?.remember(lookup);
}
async function hasIMessageEchoMatch(params) {
	const scopes = typeof params.scope === "string" ? [params.scope] : params.scope;
	for (const scope of scopes) {
		if (!scope) continue;
		for (const messageId of params.messageIds) if (await params.echoCache.has(scope, { messageId })) return true;
		const fallbackMessageId = params.messageIds[0];
		if (!params.text && !params.media && !fallbackMessageId) continue;
		if (await params.echoCache.has(scope, {
			text: params.text,
			media: params.media,
			messageId: fallbackMessageId
		}, {
			skipIdShortCircuit: params.skipIdShortCircuit,
			includePendingText: params.includePendingText
		})) return true;
	}
	return false;
}
async function isKnownFromMeIMessageReactionTarget(params) {
	const { accountId, chatId, chatGuid, chatIdentifier } = params;
	const ctx = {
		accountId,
		chatId,
		chatGuid,
		chatIdentifier
	};
	const isKnownFromMe = params.isKnownFromMeMessageId ?? isKnownFromMeIMessageMessageId;
	for (const messageId of params.messageIds) if (await isKnownFromMe(messageId, ctx)) return true;
	return false;
}
async function resolveIMessageInboundDecision(params) {
	const sender = (params.message.sender ?? "").trim();
	if (!sender) return {
		kind: "drop",
		reason: "missing sender"
	};
	const senderNormalized = normalizeIMessageHandle(sender);
	const chatId = params.message.chat_id ?? void 0;
	const chatGuid = params.message.chat_guid ?? void 0;
	const chatIdentifier = params.message.chat_identifier ?? void 0;
	const destinationCallerId = params.message.destination_caller_id ?? void 0;
	const createdAt = params.message.created_at ? Date.parse(params.message.created_at) : void 0;
	const messageText = params.messageText.trim();
	const bodyText = params.bodyText.trim();
	const mediaFacts = params.mediaFacts ?? [];
	const reactionContext = resolveIMessageReactionContext(params.message, bodyText || messageText);
	const groupIdCandidate = chatId !== void 0 ? String(chatId) : void 0;
	const groupAllowFromWithLegacyChatTargets = mergeIMessageGroupAllowFromWithLegacyChatTargets({
		groupAllowFrom: params.groupAllowFrom,
		allowFrom: params.allowFrom,
		allowLegacyConversationTargets: params.allowLegacyConversationAllowFromForGroup
	});
	const groupListPolicy = groupIdCandidate ? resolveChannelGroupPolicy({
		cfg: params.cfg,
		channel: "imessage",
		accountId: params.accountId,
		groupId: groupIdCandidate,
		hasGroupAllowFrom: groupAllowFromWithLegacyChatTargets.length > 0
	}) : {
		allowlistEnabled: false,
		allowed: true,
		groupConfig: void 0,
		defaultConfig: void 0
	};
	const treatAsGroupByConfig = Boolean(groupIdCandidate && groupListPolicy.allowlistEnabled && groupListPolicy.groupConfig);
	const isGroup = Boolean(params.message.is_group) || treatAsGroupByConfig;
	const selfChatLookup = {
		accountId: params.accountId,
		isGroup,
		chatId,
		sender,
		text: bodyText,
		createdAt
	};
	const chatIdentifierNormalized = normalizeIMessageHandle(chatIdentifier ?? "") || void 0;
	const destinationCallerIdNormalized = normalizeIMessageHandle(destinationCallerId ?? "") || void 0;
	const isSelfChat = !isGroup && chatIdentifierNormalized != null && senderNormalized === chatIdentifierNormalized && destinationCallerIdNormalized != null && destinationCallerIdNormalized === senderNormalized;
	const isAmbiguousSelfThread = !isGroup && chatIdentifierNormalized != null && senderNormalized === chatIdentifierNormalized && destinationCallerIdNormalized == null;
	let skipSelfChatHasCheck = false;
	const inboundMessageIds = resolveInboundEchoMessageIds(params.message);
	const inboundMessageId = inboundMessageIds[0];
	const hasInboundGuid = Boolean(normalizeReplyField(params.message.guid));
	if (params.message.is_from_me) {
		if (isAmbiguousSelfThread) params.selfChatCache?.remember(selfChatLookup);
		if (isSelfChat) {
			params.selfChatCache?.remember({
				...selfChatLookup,
				allowCreatedAtSkew: true
			});
			const echoScope = buildIMessageEchoScope({
				accountId: params.accountId,
				isGroup,
				chatId,
				chatGuid,
				chatIdentifier,
				sender
			});
			if (params.echoCache && (bodyText || inboundMessageId || mediaFacts.length > 0) && await hasIMessageEchoMatch({
				echoCache: params.echoCache,
				scope: echoScope,
				text: bodyText || void 0,
				media: mediaFacts[0],
				messageIds: inboundMessageIds,
				skipIdShortCircuit: !hasInboundGuid,
				includePendingText: true
			})) return {
				kind: "drop",
				reason: "agent echo in self-chat"
			};
			skipSelfChatHasCheck = true;
		} else return {
			kind: "drop",
			reason: "from me"
		};
	}
	if (isGroup && !chatId) return {
		kind: "drop",
		reason: "group without chat_id"
	};
	const groupId = isGroup ? groupIdCandidate : void 0;
	const hasControlCommandInMessage = hasControlCommand(messageText, params.cfg);
	const groupAllowFromForAccess = isGroup ? groupAllowFromWithLegacyChatTargets : params.groupAllowFrom;
	const { route, bindingResolution } = resolveIMessageConversationRoute({
		cfg: params.cfg,
		accountId: params.accountId,
		isGroup,
		peerId: isGroup ? String(chatId ?? "unknown") : senderNormalized,
		sender,
		chatId
	});
	const ingressResolver = getIMessageRuntime().channel.inbound.ingress.createResolver({
		channelId: "imessage",
		accountId: params.accountId,
		identity: imessageIngressIdentity,
		cfg: params.cfg,
		readStoreAllowFrom: async () => params.storeAllowFrom
	});
	const resolveChannelIngress = (contextBinding) => ingressResolver.message({
		subject: {
			stableId: sender,
			aliases: {
				...chatId != null ? { "imessage-chat-id": String(chatId) } : {},
				...chatGuid ? { "imessage-chat-guid": chatGuid } : {},
				...chatIdentifier ? { "imessage-chat-identifier": chatIdentifier } : {}
			}
		},
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: chatId != null ? String(chatId) : sender
		},
		contextBinding,
		dmPolicy: normalizeDmPolicy(params.dmPolicy),
		groupPolicy: normalizeGroupPolicy(params.groupPolicy),
		policy: { groupAllowFromFallbackToAllowFrom: false },
		allowFrom: params.allowFrom,
		groupAllowFrom: groupAllowFromForAccess,
		command: {
			allowTextCommands: isGroup,
			hasControlCommand: hasControlCommandInMessage,
			directGroupAllowFrom: "effective"
		}
	});
	const { commandAccess, senderAccess } = await resolveChannelIngress();
	const effectiveGroupAllowFrom = senderAccess.effectiveGroupAllowFrom;
	if (senderAccess.decision !== "allow") {
		if (isGroup) {
			if (senderAccess.reasonCode === "group_policy_disabled") {
				params.logVerbose?.("Blocked iMessage group message (groupPolicy: disabled)");
				return {
					kind: "drop",
					reason: "groupPolicy disabled"
				};
			}
			if (senderAccess.reasonCode === "group_policy_empty_allowlist") {
				params.logVerbose?.("Blocked iMessage group message (groupPolicy: allowlist, no groupAllowFrom)");
				return {
					kind: "drop",
					reason: "groupPolicy allowlist (empty groupAllowFrom)"
				};
			}
			if (senderAccess.reasonCode === "group_policy_not_allowlisted") {
				params.logVerbose?.(`Blocked iMessage sender ${sender} (not in groupAllowFrom)`);
				return {
					kind: "drop",
					reason: "not in groupAllowFrom"
				};
			}
			params.logVerbose?.(`Blocked iMessage group message (${senderAccess.reasonCode})`);
			return {
				kind: "drop",
				reason: senderAccess.reasonCode
			};
		}
		if (senderAccess.reasonCode === "dm_policy_disabled") return {
			kind: "drop",
			reason: "dmPolicy disabled"
		};
		if (senderAccess.decision === "pairing") return {
			kind: "pairing",
			senderId: senderNormalized
		};
		params.logVerbose?.(`Blocked iMessage sender ${sender} (dmPolicy=${params.dmPolicy})`);
		return {
			kind: "drop",
			reason: "dmPolicy blocked"
		};
	}
	if (isGroup && groupListPolicy.allowlistEnabled && !groupListPolicy.allowed) {
		params.logVerbose?.(`imessage: skipping group message (${groupId ?? "unknown"}) not in allowlist`);
		return {
			kind: "drop",
			reason: "group id not in allowlist"
		};
	}
	if (reactionContext) {
		const notificationMode = params.reactionNotifications ?? "own";
		if (notificationMode === "off") return {
			kind: "drop",
			reason: "reaction notifications disabled"
		};
		const targetGuid = reactionContext.targetGuid;
		const targetGuids = reactionContext.targetGuids ?? (targetGuid ? [targetGuid] : []);
		const targetIsOwn = Boolean(targetGuid && (params.echoCache && await hasIMessageEchoMatch({
			echoCache: params.echoCache,
			scope: buildIMessageEchoScope({
				accountId: params.accountId,
				isGroup,
				chatId,
				chatGuid,
				chatIdentifier,
				sender
			}),
			messageIds: targetGuids
		}) || await isKnownFromMeIMessageReactionTarget({
			messageIds: targetGuids,
			accountId: params.accountId,
			chatId,
			chatGuid,
			chatIdentifier,
			isKnownFromMeMessageId: params.isKnownFromMeMessageId
		})));
		if (notificationMode === "own" && !targetIsOwn) return {
			kind: "drop",
			reason: "reaction target not sent by agent"
		};
		const target = targetGuid ? `msg ${targetGuid}` : reactionContext.targetText ? `message "${truncateUtf16Safe(reactionContext.targetText, 80)}"` : "a message";
		return {
			kind: "reaction",
			isGroup,
			chatId,
			chatGuid,
			chatIdentifier,
			sender,
			senderNormalized,
			route,
			reaction: reactionContext,
			text: `iMessage reaction ${reactionContext.action}: ${reactionContext.emoji} by ${senderNormalized} on ${target}`,
			contextKey: [
				"imessage",
				"reaction",
				reactionContext.action,
				chatId ?? chatGuid ?? chatIdentifier ?? senderNormalized,
				targetGuid ?? reactionContext.targetText ?? "unknown",
				senderNormalized,
				reactionContext.emoji
			].join(":")
		};
	}
	const mentionRegexes = buildMentionRegexes(params.cfg, route.agentId);
	if (!bodyText && mediaFacts.length === 0) return {
		kind: "drop",
		reason: "empty body"
	};
	if (skipSelfChatHasCheck ? false : params.selfChatCache?.has({
		...selfChatLookup,
		text: bodyText
	})) {
		const preview = sanitizeTerminalText(truncateUtf16Safe(bodyText, 50));
		params.logVerbose?.(`imessage: dropping self-chat reflected duplicate: "${preview}"`);
		return {
			kind: "drop",
			reason: "self-chat echo"
		};
	}
	if (params.echoCache && (messageText || inboundMessageId || mediaFacts.length > 0)) {
		const echoScope = buildIMessageEchoScope({
			accountId: params.accountId,
			isGroup,
			chatId,
			chatGuid,
			chatIdentifier,
			sender
		});
		if (await hasIMessageEchoMatch({
			echoCache: params.echoCache,
			scope: echoScope,
			text: bodyText || void 0,
			media: mediaFacts[0],
			messageIds: inboundMessageIds,
			includePendingText: isSelfChat
		})) {
			params.logVerbose?.(describeIMessageEchoDropLog({
				messageText: bodyText,
				messageId: inboundMessageId
			}));
			return {
				kind: "drop",
				reason: "echo"
			};
		}
	}
	const reflection = detectReflectedContent(messageText);
	if (reflection.isReflection) {
		params.logVerbose?.(`imessage: dropping reflected assistant content (markers: ${reflection.matchedLabels.join(", ")})`);
		return {
			kind: "drop",
			reason: "reflected assistant content"
		};
	}
	const replyContext = describeReplyContext(params.message);
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg: params.cfg,
		channel: "imessage",
		accountId: params.accountId
	});
	const replyContextAllowFrom = Array.from(/* @__PURE__ */ new Set([...groupAllowFromForAccess, ...effectiveGroupAllowFrom]));
	const replySenderAllowed = resolveInboundSupplementalSenderAllowed({
		isGroup,
		groupPolicy: replyContextAllowFrom.length === 0 ? "open" : "allowlist",
		allowFrom: replyContextAllowFrom,
		isSenderAllowed: (allowFrom) => replyContext?.sender ? isAllowedIMessageReplyContextSender({
			allowFrom: [...allowFrom],
			sender: replyContext.sender,
			chatId,
			chatGuid,
			chatIdentifier
		}) : false
	});
	const visibleReply = filterChannelInboundQuoteContext(contextVisibilityMode, replyContext ? {
		id: replyContext.id,
		body: replyContext.body,
		sender: replyContext.sender,
		senderAllowed: replySenderAllowed
	} : void 0);
	const filteredReplyContext = visibleReply ? {
		id: visibleReply.id,
		body: visibleReply.body ?? "",
		sender: visibleReply.sender
	} : null;
	if (replyContext && !filteredReplyContext && isGroup) params.logVerbose?.(`imessage: drop reply context (mode=${contextVisibilityMode}, sender_allowed=${replySenderAllowed ? "yes" : "no"})`);
	const historyKey = isGroup ? String(chatId ?? chatGuid ?? chatIdentifier ?? "unknown") : void 0;
	const mentioned = isGroup ? matchesMentionPatterns(messageText, mentionRegexes) : true;
	const requireMention = resolveScopeRequireMention({
		tree: buildChannelGroupsScopeTree(params.cfg, "imessage", params.accountId),
		path: groupId ? [groupId] : [],
		requireMentionOverride: params.opts?.requireMention,
		overrideOrder: "before-config"
	});
	const canDetectMention = mentionRegexes.length > 0;
	const commandAuthorized = commandAccess.authorized;
	if (commandAccess.shouldBlockControlCommand) {
		if (params.logVerbose) logInboundDrop({
			log: params.logVerbose,
			channel: "imessage",
			reason: "control command (unauthorized)",
			target: sender
		});
		return {
			kind: "drop",
			reason: "control command (unauthorized)"
		};
	}
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention,
			wasMentioned: mentioned,
			hasAnyMention: false,
			implicitMentionKinds: []
		},
		policy: {
			isGroup,
			requireMention,
			allowTextCommands: true,
			hasControlCommand: hasControlCommandInMessage,
			commandAuthorized
		}
	});
	const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
	if (isGroup && requireMention && canDetectMention && mentionDecision.shouldSkip) {
		params.logVerbose?.(`imessage: skipping group message (no mention)`);
		createChannelHistoryWindow({ historyMap: params.groupHistories }).record({
			historyKey: historyKey ?? "",
			limit: params.historyLimit,
			entry: historyKey ? {
				sender: senderNormalized,
				body: [bodyText, formatMediaPlaceholderText(mediaFacts)].filter(Boolean).join("\n"),
				timestamp: createdAt,
				messageId: params.message.id ? String(params.message.id) : void 0
			} : null
		});
		return {
			kind: "drop",
			reason: "no mention"
		};
	}
	return {
		kind: "dispatch",
		resolveChannelIngress,
		isGroup,
		chatId,
		chatGuid,
		chatIdentifier,
		groupId,
		historyKey,
		sender,
		senderNormalized,
		route,
		bindingResolution,
		bodyText,
		createdAt,
		replyContext: filteredReplyContext,
		effectiveWasMentioned,
		groupRequireMention: requireMention,
		commandAuthorized,
		hasControlCommand: hasControlCommandInMessage,
		groupSystemPrompt: isGroup ? resolveIMessageGroupSystemPrompt({
			groupConfig: groupListPolicy.groupConfig,
			defaultConfig: groupListPolicy.defaultConfig
		}) : void 0
	};
}
async function buildIMessageInboundContext(params) {
	const envelopeOptions = params.envelopeOptions ?? resolveEnvelopeFormatOptions(params.cfg);
	const { decision } = params;
	const chatId = decision.chatId;
	const chatTarget = decision.isGroup && chatId != null ? formatIMessageChatTarget(chatId) : void 0;
	const messageGuid = normalizeReplyField(params.message.guid);
	const messageSid = (messageGuid ? await rememberIMessageReplyCache({
		accountId: decision.route.accountId,
		messageId: messageGuid,
		chatGuid: decision.chatGuid,
		chatIdentifier: decision.chatIdentifier,
		chatId: decision.chatId,
		timestamp: Date.now(),
		isFromMe: false
	}) : null)?.shortId || void 0;
	const replySuffix = decision.replyContext ? `\n\n[Replying to ${decision.replyContext.sender ?? "unknown sender"}${decision.replyContext.id ? ` id:${decision.replyContext.id}` : ""}]\n${decision.replyContext.body}\n[/Replying]` : "";
	const senderDisplayName = normalizeNonEmpty(params.message.sender_name ?? "");
	const directConversationName = senderDisplayName ?? normalizeNonEmpty(params.message.chat_name ?? "") ?? decision.senderNormalized;
	const conversationName = decision.isGroup ? normalizeNonEmpty(params.message.chat_name ?? "") ?? void 0 : directConversationName;
	const fromLabel = formatInboundFromLabel({
		isGroup: decision.isGroup,
		groupLabel: params.message.chat_name ?? void 0,
		groupId: chatId !== void 0 ? String(chatId) : "unknown",
		groupFallback: "Group",
		directLabel: directConversationName,
		directId: decision.sender
	});
	let combinedBody = formatInboundEnvelope({
		channel: "iMessage",
		from: fromLabel,
		timestamp: decision.createdAt,
		body: `${decision.agentBodyText ?? decision.bodyText}${replySuffix}`,
		chatType: decision.isGroup ? "group" : "direct",
		sender: {
			name: senderDisplayName ?? decision.senderNormalized,
			id: decision.sender
		},
		previousTimestamp: params.previousTimestamp,
		envelope: envelopeOptions
	});
	if (!decision.isGroup && params.dmHistory?.body) combinedBody = `${params.dmHistory.body}\n\n${combinedBody}`;
	if (decision.isGroup && decision.historyKey) combinedBody = createChannelHistoryWindow({ historyMap: params.groupHistories }).buildPendingContext({
		historyKey: decision.historyKey,
		limit: params.historyLimit,
		currentMessage: combinedBody,
		formatEntry: (entry) => formatInboundEnvelope({
			channel: "iMessage",
			from: fromLabel,
			timestamp: entry.timestamp,
			body: `${entry.body}${entry.messageId ? ` [id:${entry.messageId}]` : ""}`,
			chatType: "group",
			senderLabel: entry.sender,
			envelope: envelopeOptions
		})
	});
	const directService = resolveIMessageDirectChatService(params.accountService, decision.chatGuid) ?? "auto";
	const imessageTo = decision.isGroup ? chatTarget || `imessage:${decision.sender}` : `${directService}:${decision.sender}`;
	const imessageFrom = decision.isGroup ? `imessage:group:${chatId ?? "unknown"}` : imessageTo;
	const replyTarget = decision.isGroup ? imessageTo : chatId != null ? `chat_id:${chatId}` : decision.chatGuid ? `chat_guid:${decision.chatGuid}` : imessageTo;
	const inboundHistory = !decision.isGroup && params.dmHistory?.inboundHistory ? params.dmHistory.inboundHistory : decision.isGroup && decision.historyKey && params.historyLimit > 0 ? createChannelHistoryWindow({ historyMap: params.groupHistories }).buildInboundHistory({
		historyKey: decision.historyKey,
		limit: params.historyLimit
	}) : void 0;
	const media = await toInboundMediaFactsWithMetadata(params.media?.facts?.map((entry) => ({
		...entry,
		url: entry.url ?? entry.path
	})));
	const channelIngress = await decision.resolveChannelIngress({
		agentId: decision.route.agentId,
		sessionKey: decision.route.sessionKey,
		messageId: messageSid,
		inboundEventKind: "user_request"
	});
	return {
		ctxPayload: await (params.buildContext ?? buildChannelInboundEventContext)({
			channelIngress,
			channel: "imessage",
			supplemental: {
				quote: decision.replyContext ? {
					id: decision.replyContext.id,
					body: decision.replyContext.body,
					sender: decision.replyContext.sender
				} : void 0,
				groupSystemPrompt: decision.isGroup ? decision.groupSystemPrompt : void 0
			},
			media,
			messageId: messageSid,
			messageIdFull: messageGuid,
			timestamp: decision.createdAt,
			from: imessageFrom,
			sender: {
				id: decision.sender,
				name: senderDisplayName ?? decision.senderNormalized,
				isSelf: params.message.is_from_me === true
			},
			conversation: {
				kind: decision.isGroup ? "group" : "direct",
				id: chatId != null ? String(chatId) : decision.sender,
				...decision.isGroup && chatId == null ? {} : { routePeer: {
					kind: decision.isGroup ? "group" : "direct",
					id: decision.isGroup ? String(chatId) : decision.senderNormalized
				} },
				label: conversationName
			},
			route: {
				...decision.route,
				routeSessionKey: decision.route.sessionKey
			},
			reply: { to: replyTarget },
			message: {
				body: combinedBody,
				bodyForAgent: decision.agentBodyText ?? decision.bodyText,
				inboundHistory,
				rawBody: decision.bodyText,
				commandBody: decision.bodyText
			},
			sessionTranscript: { historyLimit: decision.isGroup ? params.historyLimit : 0 },
			access: {
				mentions: {
					canDetectMention: decision.isGroup,
					wasMentioned: decision.effectiveWasMentioned
				},
				commands: { authorized: decision.commandAuthorized }
			},
			extra: {
				GroupSubject: decision.isGroup ? params.message.chat_name ?? void 0 : void 0,
				GroupRequireMention: decision.isGroup ? decision.groupRequireMention : void 0,
				GroupMembers: decision.isGroup ? (params.message.participants ?? []).filter(Boolean).join(", ") : void 0,
				MediaRemoteHost: params.remoteHost,
				CommandSource: decision.commandAuthorized && decision.hasControlCommand ? "text" : void 0
			}
		}),
		fromLabel,
		chatTarget,
		imessageTo,
		inboundHistory
	};
}
function buildIMessageEchoScope(params) {
	const scopes = [];
	if (params.isGroup) {
		const chatIdScope = formatIMessageChatTarget(params.chatId);
		if (chatIdScope) scopes.push(`${params.accountId}:${chatIdScope}`);
	} else scopes.push(`${params.accountId}:imessage:${params.sender}`);
	if (params.chatGuid) scopes.push(`${params.accountId}:chat_guid:${params.chatGuid}`);
	if (params.chatIdentifier) scopes.push(`${params.accountId}:chat_identifier:${params.chatIdentifier}`);
	return scopes;
}
function describeIMessageEchoDropLog(params) {
	const preview = truncateUtf16Safe(params.messageText, 50);
	return `imessage: skipping echo message${params.messageId ? ` id=${params.messageId}` : ""}: "${preview}"`;
}
//#endregion
//#region extensions/imessage/src/monitor/ingress.ts
const IMESSAGE_INGRESS_PAYLOAD_VERSION = 1;
const IMESSAGE_INGRESS_DRAIN_INTERVAL_MS = 1e3;
const IMessageIngressPayloadError = createChannelIngressError("IMessageIngressPayloadError");
function rawMessageRecord(raw) {
	if (!isRecord$1(raw)) return null;
	return isRecord$1(raw.message) ? raw.message : null;
}
function rawRowid(raw) {
	return asSafeIntegerInRange(rawMessageRecord(raw)?.id, { min: 0 }) ?? null;
}
/** Read only stable transport metadata; payload normalization waits for dispatch. */
function inspectIMessageIngress(raw) {
	const message = rawMessageRecord(raw);
	const guid = typeof message?.guid === "string" ? message.guid.trim() : "";
	if (!guid) throw new IMessageIngressPayloadError("iMessage ingress row is missing its stable GUID.");
	const rowid = rawRowid(raw);
	if (rowid === null) throw new IMessageIngressPayloadError("iMessage ingress row is missing its ROWID.");
	const chatId = message?.chat_id;
	if (typeof chatId !== "number" || !Number.isSafeInteger(chatId)) throw new IMessageIngressPayloadError("iMessage ingress row is missing its chat id.");
	const createdAt = message?.created_at;
	return {
		eventId: guid,
		laneKey: `chat:${chatId}`,
		rowid,
		...typeof createdAt === "string" ? { createdAt } : {}
	};
}
function decodeIMessageIngressPayload(payload, eventId) {
	if (typeof payload.receivedAt !== "number" || !Number.isFinite(payload.receivedAt)) throw new IMessageIngressPayloadError(`iMessage ingress payload ${eventId} is invalid.`);
	return {
		version: payload.version,
		body: {
			receivedAt: payload.receivedAt,
			raw: payload.raw,
			...payload.catchup ? { catchup: true } : {}
		}
	};
}
function deserializeIMessageIngress(body, eventId) {
	const message = parseIMessageNotification(body.raw);
	if (!message) throw new IMessageIngressPayloadError(`iMessage ingress payload ${eventId} is invalid.`);
	return {
		raw: body.raw,
		receivedAt: body.receivedAt,
		message,
		...body.catchup ? { catchup: true } : {}
	};
}
function isIMessageAuthenticationFailure(error) {
	return collectErrorGraphCandidates(error, (current) => [
		current.cause,
		current.error,
		current.original
	]).some((candidate) => {
		const message = formatErrorMessage(candidate).toLowerCase();
		return message.includes("full disk access") && message.includes("chat.db") || message.includes("authorization denied") && message.includes("messages");
	});
}
function resolveIMessageIngressNonRetryableFailure(error) {
	if (error instanceof IMessageIngressPayloadError) return {
		reason: "invalid-event",
		message: error.message
	};
	if (isIMessageAuthenticationFailure(error)) return {
		reason: "authentication-failed",
		message: formatErrorMessage(error)
	};
	return null;
}
function createIMessageDurableIngress(options) {
	const queue = options.queue ?? getIMessageRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const now = options.now ?? Date.now;
	const dispatchAdmissionQueue = new KeyedAsyncQueue();
	const priorityDispatchQueue = new KeyedAsyncQueue();
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: (event, context) => {
			try {
				return inspectIMessageIngress(event.raw);
			} catch (error) {
				if (context.phase === "claim") throw new IMessageIngressPayloadError(`iMessage ingress payload ${context.claimedId} is invalid.`, { cause: error });
				throw error;
			}
		},
		payload: {
			version: IMESSAGE_INGRESS_PAYLOAD_VERSION,
			serialize: (event, { receivedAt }) => ({
				receivedAt,
				raw: event.raw,
				...event.catchup ? { catchup: true } : {}
			}),
			deserialize: (body, { claim }) => deserializeIMessageIngress(body, claim.id),
			encode: ({ body }) => ({
				version: IMESSAGE_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload, { claim }) => decodeIMessageIngressPayload(payload, claim.id),
			createClaimError: (_kind, claim) => new IMessageIngressPayloadError(`iMessage ingress payload ${claim.id} is invalid.`)
		},
		deliver: async (event, lifecycle, record) => {
			if (!event.message || event.receivedAt === void 0) throw new IMessageIngressPayloadError(`iMessage ingress payload ${record.id} is invalid.`);
			const message = event.message;
			const receivedAt = event.receivedAt;
			if (lifecycle.abortSignal.aborted) throw lifecycle.abortSignal.reason;
			const priorityResult = await priorityDispatchQueue.enqueue(record.laneKey ?? record.id, async () => await options.dispatchPriority?.(message, lifecycle, receivedAt, event.catchup ? { catchup: true } : {}));
			if (priorityResult) return priorityResult;
			return await dispatchAdmissionQueue.enqueue(record.laneKey ?? record.id, async () => {
				return await options.dispatch(message, lifecycle, receivedAt, event.catchup ? { catchup: true } : {});
			});
		},
		pollIntervalMs: IMESSAGE_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			completedTtlMs: 144e5,
			completedMaxEntries: 1e4,
			failedMaxEntries: 1e3
		},
		appendRetryDelaysMs: [0],
		onDurableAdmission: async (event) => {
			await options.onDurableEnqueue?.(inspectIMessageIngress(event.raw));
		},
		onAdmissionFailure: async (event, error) => {
			await options.onDurableEnqueueFailure?.(rawRowid(event.raw), error);
		},
		drain: {
			deriveLaneKey: (record) => `${record.laneKey ?? "event"}:${record.id}`,
			resolveNonRetryableFailure: resolveIMessageIngressNonRetryableFailure,
			onLog: (message) => options.runtime.log?.(`imessage ${message}`)
		},
		now,
		onError: (error) => options.runtime.error?.(`imessage: ingress drain failed: ${formatErrorMessage(error)}`)
	});
	let stopTask;
	return {
		receive: async (raw, receiveOpts) => {
			await monitor.admit({
				raw,
				...receiveOpts?.catchup ? { catchup: true } : {}
			});
		},
		start: monitor.start,
		stop: () => {
			stopTask ??= (async () => {
				await monitor.waitForIdle();
				await monitor.stop();
			})();
			return stopTask;
		},
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/imessage/src/monitor/loop-rate-limiter.ts
/**
* Per-conversation rate limiter that detects rapid-fire identical echo
* patterns and suppresses them before they amplify into queue overflow.
*/
const DEFAULT_WINDOW_MS = 6e4;
const DEFAULT_MAX_HITS = 5;
const CLEANUP_INTERVAL_MS = 12e4;
function createLoopRateLimiter(opts) {
	const windowMs = opts?.windowMs ?? DEFAULT_WINDOW_MS;
	const maxHits = opts?.maxHits ?? DEFAULT_MAX_HITS;
	const conversations = /* @__PURE__ */ new Map();
	let lastCleanup = Date.now();
	function cleanup() {
		const now = Date.now();
		if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
		lastCleanup = now;
		for (const [key, win] of conversations.entries()) {
			const recent = win.timestamps.filter((ts) => now - ts <= windowMs);
			if (recent.length === 0) conversations.delete(key);
			else win.timestamps = recent;
		}
	}
	return {
		record(conversationKey) {
			cleanup();
			let win = conversations.get(conversationKey);
			if (!win) {
				win = { timestamps: [] };
				conversations.set(conversationKey, win);
			}
			win.timestamps.push(Date.now());
		},
		isRateLimited(conversationKey) {
			cleanup();
			const win = conversations.get(conversationKey);
			if (!win) return false;
			const now = Date.now();
			const recent = win.timestamps.filter((ts) => now - ts <= windowMs);
			win.timestamps = recent;
			return recent.length >= maxHits;
		}
	};
}
//#endregion
//#region extensions/imessage/src/monitor/media-staging.ts
function createTypeOnlyIMessageAttachment(attachment) {
	const contentType = attachment.mime_type?.trim() || void 0;
	return {
		contentType,
		kind: kindFromMime(contentType) ?? "unknown"
	};
}
function isHeicAttachment(attachmentPath, mimeType) {
	const normalizedMime = mimeType?.toLowerCase();
	if (normalizedMime === "image/heic" || normalizedMime === "image/heif") return true;
	const ext = path.extname(attachmentPath).toLowerCase();
	return ext === ".heic" || ext === ".heif";
}
function jpegFilenameForAttachment(attachmentPath) {
	return `${path.parse(attachmentPath).name || "imessage-attachment"}.jpg`;
}
function hasWildcardSegment(root) {
	return root.replaceAll("\\", "/").split("/").includes("*");
}
async function canonicalizeAllowedRoots(roots) {
	const canonicalRoots = [];
	for (const root of roots) {
		canonicalRoots.push(root);
		if (hasWildcardSegment(root)) continue;
		const canonicalRoot = await fs.realpath(root).catch(() => void 0);
		if (canonicalRoot && canonicalRoot !== root) canonicalRoots.push(canonicalRoot);
	}
	return canonicalRoots;
}
async function assertAllowedCanonicalAttachmentPath(params) {
	if (!params.allowedRoots) return;
	const canonicalRoots = await canonicalizeAllowedRoots(params.allowedRoots);
	if (!isInboundPathAllowed({
		filePath: params.canonicalPath,
		roots: canonicalRoots
	})) throw new Error("attachment path resolves outside allowed roots");
}
async function readAttachmentBuffer(params) {
	const opened = await (params.deps.openLocalFileSafely ?? openLocalFileSafely)({ filePath: params.attachmentPath });
	try {
		if (opened.stat.size > params.maxBytes) throw new Error(`attachment exceeds ${Math.round(params.maxBytes / 1048576)}MB limit`);
		await assertAllowedCanonicalAttachmentPath({
			canonicalPath: opened.realPath,
			allowedRoots: params.allowedRoots
		});
		const buffer = await readFileHandleBounded(opened.handle, params.maxBytes).catch((error) => {
			if (error instanceof FsSafeError && error.code === "too-large") throw new Error(`attachment exceeds ${Math.round(params.maxBytes / 1048576)}MB limit`);
			throw error;
		});
		if (isHeicAttachment(params.attachmentPath, params.mimeType)) try {
			const convert = params.deps.convertHeicToJpeg;
			return {
				buffer: (await withTempWorkspace({
					rootDir: resolvePreferredOpenClawTmpDir(),
					prefix: "openclaw-imessage-heic-"
				}, async (workspace) => {
					const pinnedPath = await workspace.write("attachment.heic", buffer);
					return convert ? { buffer: await convert(pinnedPath, params.maxBytes) } : await loadWebMedia(pinnedPath, {
						maxBytes: params.maxBytes,
						localRoots: [workspace.dir]
					});
				})).buffer,
				contentType: "image/jpeg",
				originalFilename: jpegFilenameForAttachment(params.attachmentPath)
			};
		} catch (err) {
			params.deps.logVerbose?.(`imessage: HEIC attachment conversion failed; staging original instead: ${String(err)}`);
		}
		return {
			buffer,
			contentType: params.mimeType ?? void 0,
			originalFilename: path.basename(params.attachmentPath)
		};
	} finally {
		await opened.handle.close().catch(() => void 0);
	}
}
async function stageIMessageAttachments(attachments, params) {
	const deps = params.deps ?? {};
	const save = deps.saveMediaBuffer ?? saveMediaBuffer;
	const staged = [];
	let unavailableCount = 0;
	for (const attachment of attachments) {
		const attachmentPath = attachment.original_path?.trim();
		if (!attachmentPath || attachment.missing) {
			unavailableCount += 1;
			staged.push(createTypeOnlyIMessageAttachment(attachment));
			continue;
		}
		try {
			const media = await readAttachmentBuffer({
				attachmentPath,
				mimeType: attachment.mime_type,
				maxBytes: params.maxBytes,
				allowedRoots: params.allowedRoots,
				deps
			});
			const saved = await save(media.buffer, media.contentType, "inbound", params.maxBytes, media.originalFilename);
			const contentType = saved.contentType ?? media.contentType;
			staged.push({
				path: saved.path,
				contentType,
				kind: kindFromMime(contentType) ?? "unknown"
			});
		} catch (err) {
			unavailableCount += 1;
			staged.push(createTypeOnlyIMessageAttachment(attachment));
			deps.logVerbose?.(`imessage: failed to stage inbound attachment: ${String(err)}`);
		}
	}
	return {
		attachments: staged,
		unavailableCount
	};
}
//#endregion
//#region extensions/imessage/src/monitor/poll-comment.ts
const DEFAULT_COMMENT_WINDOW_MS = 15e3;
function normalizeGuid(guid) {
	return guid?.trim() ?? "";
}
function normalizeSender(sender) {
	return sender?.trim().toLowerCase() ?? "";
}
function createPollCommentFolder(options) {
	const windowMs = options?.windowMs ?? DEFAULT_COMMENT_WINDOW_MS;
	const seenPolls = /* @__PURE__ */ new Map();
	function prune(referenceMs) {
		for (const [key, seen] of seenPolls) if (referenceMs - seen.atMs > windowMs) seenPolls.delete(key);
	}
	return {
		rememberPoll(guid, atMs, sender) {
			const key = normalizeGuid(guid);
			if (!key || !Number.isFinite(atMs)) return;
			prune(atMs);
			seenPolls.set(key, {
				atMs,
				sender: normalizeSender(sender)
			});
		},
		isPollComment(replyToGuid, atMs, sender) {
			const key = normalizeGuid(replyToGuid);
			if (!key || !Number.isFinite(atMs)) return false;
			const seen = seenPolls.get(key);
			if (!seen || atMs < seen.atMs || atMs - seen.atMs > windowMs) return false;
			const replySender = normalizeSender(sender);
			return seen.sender.length > 0 && replySender.length > 0 && seen.sender === replySender;
		}
	};
}
//#endregion
//#region extensions/imessage/src/monitor/poll-render.ts
function renderIMessagePollBody(poll, sender, renderOptions) {
	const options = poll.options ?? [];
	if (poll.kind === "vote" || poll.vote && options.length === 0) {
		if (poll.votes) {
			const snapshotParticipant = poll.votes.find((vote) => vote.participant?.trim())?.participant?.trim() || sender?.trim() || "someone";
			const selectionsByParticipant = /* @__PURE__ */ new Map();
			for (const vote of poll.votes) {
				if (vote.event_type === "removed") continue;
				const who = vote.participant?.trim() || snapshotParticipant;
				const what = vote.option_text?.trim() || vote.option_id || "an option";
				const selections = selectionsByParticipant.get(who) ?? [];
				if (!selections.includes(what)) selections.push(what);
				selectionsByParticipant.set(who, selections);
			}
			if (selectionsByParticipant.size === 0) return `\u{1F4CA} Poll selections: ${snapshotParticipant} currently selected no options`;
			return `\u{1F4CA} Poll selections: ${Array.from(selectionsByParticipant, ([who, selections]) => {
				return `${who} currently selected ${selections.map((selection) => `"${selection}"`).join(", ")}`;
			}).join("; ")}`;
		}
		const vote = poll.vote;
		if (!vote) return "📊 Poll vote received";
		const who = vote.participant?.trim() || sender?.trim() || "someone";
		const what = vote.option_text?.trim() || vote.option_id || "an option";
		return `\u{1F4CA} Poll vote: ${who} ${vote.event_type === "removed" ? "removed their vote for" : "voted for"} "${what}"`;
	}
	if (options.length === 0) return null;
	const tally = /* @__PURE__ */ new Map();
	for (const vote of poll.votes ?? []) {
		if (vote.event_type === "removed" || !vote.option_id) continue;
		tally.set(vote.option_id, (tally.get(vote.option_id) ?? 0) + 1);
	}
	const optionList = options.map((option, index) => {
		const count = tally.get(option.id) ?? 0;
		const id = renderOptions?.preferOptionId ? ` (id: ${option.id})` : "";
		return `${index + 1}) ${option.text}${id}${count > 0 ? ` [${count}]` : ""}`;
	}).join("  ");
	const question = poll.question?.trim();
	const selector = renderOptions?.preferOptionId ? "pollOptionId = the stable option id shown above" : "pollOptionIndex = the option number";
	return `\u{1F4CA} Poll${question ? `: ${question}` : ""} — options: ${optionList}. Cast your vote on this poll with the poll-vote action (${selector}); do not answer in a text reply.`;
}
//#endregion
//#region extensions/imessage/src/monitor/reaction-system-event.ts
function enqueueIMessageReactionSystemEvent(params) {
	const { decision, runtime } = params;
	const queued = enqueueRoutedSystemEvent(decision.text, decision.route, { contextKey: decision.contextKey });
	runtime.log?.(`imessage: reaction system event ${queued ? "queued" : "deduped"} session=${decision.route.sessionKey} target=${decision.reaction.targetGuid ?? "unknown"} action=${decision.reaction.action} emoji=${decision.reaction.emoji}`);
	params.logVerbose?.(`imessage: reaction event enqueued: ${decision.text}`);
	return queued;
}
//#endregion
//#region extensions/imessage/src/monitor/recovery-cursor.ts
const RECOVERY_CURSOR_STORE_OPTIONS = {
	namespace: "imessage.recovery-cursor",
	maxEntries: 64
};
const LEGACY_CATCHUP_CURSOR_NAMESPACE = "imessage.catchup-cursors";
const LEGACY_CATCHUP_CURSOR_MAX_ENTRIES = 256;
function openRecoveryCursorStore() {
	return getIMessageRuntime().state.openKeyedStore(RECOVERY_CURSOR_STORE_OPTIONS);
}
function normalizeLocalDbPath(dbPath) {
	let resolved = dbPath.trim();
	if (resolved.startsWith("~")) {
		const home = resolveIMessageHomeDir();
		if (home) resolved = path.join(home, resolved.slice(1).replace(/^\/+/, ""));
	}
	return path.resolve(resolved);
}
/**
* Stable identity for the watched Messages database. A changed identity means a
* different chat.db (different `dbPath`, custom `cliPath`, or a remote host),
* whose rowids share no ordering with the previous one, so the cursor must not
* carry across. Local paths are canonicalized so the implicit default and an
* explicit path to the same chat.db resolve to one identity.
*/
function resolveIMessageRecoveryCursorDbIdentity(params) {
	const remoteHost = params.remoteHost?.trim();
	if (remoteHost) return `remote:${remoteHost}:${params.dbPath?.trim() || "default"}`;
	const dbPath = params.dbPath?.trim();
	if (dbPath) return `local:${normalizeLocalDbPath(dbPath)}`;
	const cliPath = params.cliPath?.trim();
	if (!cliPath || cliPath === "imsg" || path.basename(cliPath) === "imsg") {
		const home = resolveIMessageHomeDir();
		return home ? `local:${normalizeLocalDbPath(path.join(home, "Library", "Messages", "chat.db"))}` : "local:default";
	}
	return `local:cli:${cliPath}`;
}
function recoveryCursorStoreKey(accountId, dbIdentity) {
	return `${accountId}\u0000${dbIdentity}`;
}
function decideRecoveryCursorUpdate(current, update) {
	if (update.kind === "rewind") {
		if (current?.lastRowid !== update.expectedRowid) return;
	} else if (current && current.lastRowid >= update.rowid) return;
	return { lastRowid: update.rowid };
}
async function applyRecoveryCursorUpdate(key, update) {
	const state = getIMessageRuntime().state;
	const store = state.openKeyedStore(RECOVERY_CURSOR_STORE_OPTIONS);
	if (!store.observe || !store.compareAndApply) {
		const legacy = state.openSyncKeyedStore(RECOVERY_CURSOR_STORE_OPTIONS);
		if (!legacy.update) throw new Error("iMessage recovery cursor persistence requires atomic update support.");
		let result;
		legacy.update(key, (current) => {
			const next = decideRecoveryCursorUpdate(current, update);
			result = next ?? current;
			return next;
		});
		return result;
	}
	const observe = store.observe.bind(store);
	const compareAndApply = store.compareAndApply.bind(store);
	let observation = await observe(key);
	for (;;) {
		const next = decideRecoveryCursorUpdate(observation.value, update);
		if (!next) return observation.value;
		const result = await compareAndApply(key, observation.comparison, {
			operation: "update",
			action: "set",
			value: next
		});
		if (result.status !== "conflict") return next;
		observation = result.current;
	}
}
async function readRecoveryCursor(accountId, dbIdentity) {
	try {
		const store = openRecoveryCursorStore();
		const key = recoveryCursorStoreKey(accountId, dbIdentity);
		const value = await store.lookup(key);
		if (value) return Number.isFinite(value.lastRowid) ? value.lastRowid : null;
		const legacy = await store.consume(accountId);
		if (legacy && Number.isFinite(legacy.lastRowid)) {
			await store.registerIfAbsent(key, { lastRowid: legacy.lastRowid });
			const adopted = await store.lookup(key);
			return adopted && Number.isFinite(adopted.lastRowid) ? adopted.lastRowid : null;
		}
		return null;
	} catch {
		return null;
	}
}
async function migrateLegacyCatchupCursor(accountId, dbIdentity) {
	try {
		const legacy = getIMessageRuntime().state.openKeyedStore({
			namespace: LEGACY_CATCHUP_CURSOR_NAMESPACE,
			maxEntries: LEGACY_CATCHUP_CURSOR_MAX_ENTRIES
		});
		const key = createHash("sha256").update(accountId, "utf8").digest("hex").slice(0, 32);
		const value = await legacy.consume(key);
		const rowid = typeof value?.lastSeenRowid === "number" && Number.isFinite(value.lastSeenRowid) ? value.lastSeenRowid : null;
		if (rowid !== null) await advanceIMessageRecoveryCursor(accountId, dbIdentity, rowid);
		return rowid;
	} catch {
		return null;
	}
}
async function reconcileRecoveryCursorToWatermark(accountId, dbIdentity, cursorRowid, watermarkRowid) {
	if (cursorRowid === null || watermarkRowid === null || cursorRowid <= watermarkRowid) return cursorRowid;
	try {
		return (await applyRecoveryCursorUpdate(recoveryCursorStoreKey(accountId, dbIdentity), {
			kind: "rewind",
			rowid: watermarkRowid,
			expectedRowid: cursorRowid
		}))?.lastRowid ?? watermarkRowid;
	} catch {
		return watermarkRowid;
	}
}
/**
* Last durably admitted rowid for this account on `dbIdentity`, or null when
* none is recorded yet (including when the only stored cursor belongs to a
* different database).
*/
async function loadIMessageRecoveryCursor(accountId, dbIdentity, options = {}) {
	const watermarkRowid = typeof options.watermarkRowid === "number" && Number.isFinite(options.watermarkRowid) ? options.watermarkRowid : null;
	const current = await readRecoveryCursor(accountId, dbIdentity);
	if (current !== null) return await reconcileRecoveryCursorToWatermark(accountId, dbIdentity, current, watermarkRowid);
	if (options.migrateLegacyCatchup === false) return null;
	return await reconcileRecoveryCursorToWatermark(accountId, dbIdentity, await migrateLegacyCatchupCursor(accountId, dbIdentity), watermarkRowid);
}
/** Advance the cursor forward to `rowid` (monotonic per database; never rewinds). */
async function advanceIMessageRecoveryCursor(accountId, dbIdentity, rowid) {
	if (!Number.isFinite(rowid)) return;
	try {
		await applyRecoveryCursorUpdate(recoveryCursorStoreKey(accountId, dbIdentity), {
			kind: "advance",
			rowid
		});
	} catch {}
}
//#endregion
//#region extensions/imessage/src/monitor/runtime.ts
function resolveRuntime(opts) {
	return opts.runtime ?? createNonExitingRuntime();
}
//#endregion
//#region extensions/imessage/src/monitor/self-chat-cache.ts
const SELF_CHAT_TTL_MS = 1e4;
const SELF_CHAT_CREATED_AT_TOLERANCE_MS = 1e3;
const MAX_SELF_CHAT_CACHE_ENTRIES = 512;
const CLEANUP_MIN_INTERVAL_MS = 1e3;
function normalizeText(text) {
	if (!text) return null;
	const normalized = text.replace(/\r\n?/g, "\n").trim();
	return normalized ? normalized : null;
}
function isUsableTimestamp(createdAt) {
	return typeof createdAt === "number" && Number.isFinite(createdAt);
}
function digestText(text) {
	return createHash("sha256").update(text).digest("hex");
}
function buildScope(parts) {
	if (!parts.isGroup) return `${parts.accountId}:imessage:${parts.sender}`;
	const chatTarget = formatIMessageChatTarget(parts.chatId) || "chat_id:unknown";
	return `${parts.accountId}:${chatTarget}:imessage:${parts.sender}`;
}
var DefaultSelfChatCache = class {
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
		this.insertionOrder = [];
		this.insertionOrderOffset = 0;
		this.entryCount = 0;
		this.lastCleanupAt = 0;
		this.nextEntryId = 1;
	}
	buildBucketKey(lookup) {
		const text = normalizeText(lookup.text);
		if (!text) return null;
		return `${buildScope(lookup)}:${digestText(text)}`;
	}
	remember(lookup) {
		const key = this.buildBucketKey(lookup);
		if (!key || !isUsableTimestamp(lookup.createdAt)) return;
		const entries = this.cache.get(key) ?? /* @__PURE__ */ new Map();
		const entry = {
			id: this.nextEntryId,
			createdAt: lookup.createdAt,
			createdAtSkewToleranceMs: lookup.allowCreatedAtSkew ? SELF_CHAT_CREATED_AT_TOLERANCE_MS : 0,
			rememberedAt: Date.now()
		};
		this.nextEntryId += 1;
		entries.set(entry.id, entry);
		this.cache.set(key, entries);
		this.insertionOrder.push({
			key,
			id: entry.id
		});
		this.entryCount += 1;
		this.maybeCleanup();
	}
	has(lookup) {
		this.maybeCleanup();
		const key = this.buildBucketKey(lookup);
		if (!key || !isUsableTimestamp(lookup.createdAt)) return false;
		const entries = this.cache.get(key);
		if (!entries) return false;
		const now = Date.now();
		const createdAt = lookup.createdAt;
		return [...entries.values()].some((entry) => {
			const createdAtDelta = Math.abs(entry.createdAt - createdAt);
			return now - entry.rememberedAt <= SELF_CHAT_TTL_MS && (createdAtDelta === 0 || createdAtDelta < entry.createdAtSkewToleranceMs);
		});
	}
	maybeCleanup() {
		const now = Date.now();
		if (now - this.lastCleanupAt < CLEANUP_MIN_INTERVAL_MS) return;
		this.lastCleanupAt = now;
		for (const [key, entries] of this.cache.entries()) {
			for (const [id, entry] of entries.entries()) if (now - entry.rememberedAt > SELF_CHAT_TTL_MS) {
				entries.delete(id);
				this.entryCount -= 1;
			}
			if (entries.size === 0) this.cache.delete(key);
		}
		while (this.entryCount > MAX_SELF_CHAT_CACHE_ENTRIES && this.insertionOrderOffset < this.insertionOrder.length) {
			const oldest = expectDefined(this.insertionOrder[this.insertionOrderOffset], "oldest iMessage self-chat cache entry");
			this.insertionOrderOffset += 1;
			const entries = this.cache.get(oldest.key);
			if (!entries) continue;
			if (!entries.delete(oldest.id)) continue;
			this.entryCount -= 1;
			if (entries.size === 0) this.cache.delete(oldest.key);
		}
		this.compactInsertionOrder();
	}
	compactInsertionOrder() {
		if (this.insertionOrderOffset <= 1024 && this.insertionOrder.length <= this.entryCount + 1024) return;
		this.insertionOrder = this.insertionOrder.slice(this.insertionOrderOffset).filter((entry) => this.cache.get(entry.key)?.has(entry.id));
		this.insertionOrderOffset = 0;
	}
};
function createSelfChatCache() {
	return new DefaultSelfChatCache();
}
//#endregion
//#region extensions/imessage/src/monitor/watch-error-log.ts
const MAX_WATCH_ERROR_MESSAGE_CHARS = 200;
function sanitizeIMessageWatchErrorPayload(payload) {
	if (!isRecord(payload)) return {};
	const safe = {};
	if (typeof payload.code === "number" && Number.isFinite(payload.code)) safe.code = payload.code;
	if (typeof payload.message === "string") {
		const sanitizedMessage = sanitizeTerminalText(payload.message);
		if (sanitizedMessage) safe.message = sanitizedMessage.length > MAX_WATCH_ERROR_MESSAGE_CHARS ? `${truncateUtf16Safe(sanitizedMessage, 199)}…` : sanitizedMessage;
	}
	return safe;
}
//#endregion
//#region extensions/imessage/src/monitor/monitor-provider.ts
const WATCH_SUBSCRIBE_MAX_ATTEMPTS = 3;
const WATCH_SUBSCRIBE_RETRY_DELAY_MS = 1e3;
const CHANNEL_APPROVAL_GATEWAY_RUNTIME_CONTEXT_CAPABILITY = "approval.gateway";
const APPROVAL_REACTION_POLL_INTERVAL_MS = 2e3;
const APPROVAL_REACTION_DISCOVERY_INTERVAL_MS = 6e4;
const IMESSAGE_TYPING_KEEPALIVE_INTERVAL_MS = 8e3;
const IMESSAGE_TYPING_KEEPALIVE_MAX_DURATION_MS = 6e5;
function resolveConfiguredIMessageTypingMode(cfg, agentId) {
	return resolveAgentConfig(cfg, agentId)?.typingMode ?? cfg.agents?.defaults?.typingMode;
}
function isIMessagePluginPayloadAttachment(attachment) {
	const attachmentPath = attachment.original_path?.trim().toLowerCase() ?? "";
	const transferName = attachment.transfer_name?.trim().toLowerCase() ?? "";
	const uti = attachment.uti?.trim().toLowerCase() ?? "";
	return attachmentPath.endsWith(".pluginpayloadattachment") || transferName.endsWith(".pluginpayloadattachment") || uti === "com.apple.messages.pluginpayloadattachment";
}
function resolveIMessageInboundMediaInput(params) {
	const mediaCandidates = params.attachments.filter((entry) => !isIMessagePluginPayloadAttachment(entry));
	const mediaFacts = mediaCandidates.map((attachment) => {
		const contentType = attachment.mime_type?.trim() || void 0;
		return {
			contentType,
			kind: kindFromMime(contentType) ?? "unknown"
		};
	});
	const rawMediaAttachments = mediaCandidates.map((attachment, index) => {
		const fact = mediaFacts[index] ?? { kind: "unknown" };
		const attachmentPath = attachment.original_path?.trim();
		if (!attachmentPath || attachment.missing) return fact;
		if (!isInboundPathAllowed({
			filePath: attachmentPath,
			roots: params.effectiveAttachmentRoots
		})) {
			params.logVerbose?.(`imessage: dropping inbound attachment outside allowed roots: ${attachmentPath}`);
			return fact;
		}
		return {
			...fact,
			path: attachmentPath
		};
	});
	return {
		bodyText: params.messageText,
		mediaFacts,
		mediaCandidates,
		rawMediaAttachments
	};
}
function formatIMessageInboundMediaBody(params) {
	return formatInboundMediaUnavailableText({
		body: params.messageText,
		notice: `[imessage ${params.unavailableCount > 1 ? `${params.unavailableCount} attachments` : "attachment"} unavailable]`
	});
}
function resolveIMessageWatchSourceDbPath(params) {
	return resolveIMessageChatDbLookupPath(params);
}
const warnIfImsgUpgradeNeeded = (() => {
	let fired = false;
	return { fireOnce: (rpcMethods, runtime) => {
		if (fired) return;
		fired = true;
		const detail = rpcMethods.length === 0 ? "imsg build pre-dates the rpc_methods capability list" : `imsg rpc_methods=[${rpcMethods.join(", ")}] does not include typing/read`;
		runtime.log?.(warn(`imessage: typing indicators / read receipts gated off (${detail}). Upgrade imsg (current bridge needs typing+read in rpc_methods).`));
	} };
})();
function isRetriableWatchSubscribeStartupError(error) {
	return /imsg rpc timeout \(watch\.subscribe\)|imsg rpc (closed|exited|not running)/i.test(String(error));
}
const IMESSAGE_DIAGNOSTIC_DROP_REASONS = /* @__PURE__ */ new Set([
	"agent echo in self-chat",
	"echo",
	"from me",
	"no mention",
	"reflected assistant content",
	"self-chat echo"
]);
const IMESSAGE_THROTTLED_DIAGNOSTIC_DROP_REASONS = /* @__PURE__ */ new Set(["from me", "no mention"]);
function describeIMessageInboundDropDiagnostic(params) {
	if (!IMESSAGE_DIAGNOSTIC_DROP_REASONS.has(params.reason)) return null;
	const messageId = typeof params.message.id === "number" || typeof params.message.id === "string" ? String(params.message.id) : "unknown";
	const mentionHint = params.reason === "no mention" ? ` Mention the agent (default patterns come from its identity name/emoji), or set ${params.groupsConfigPath}["${params.message.chat_id}"].requireMention=false. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.` : "";
	return `imessage: dropped inbound message account=${params.accountId} reason=${JSON.stringify(params.reason)} chat_id=${params.message.chat_id ?? "unknown"} group=${params.message.is_group === true} message_id=${messageId} guid=${params.message.guid ? "present" : "missing"} created_at=${params.message.created_at ?? "unknown"}${mentionHint}`;
}
function describeIMessageWatchSubscribeStartupFailure(params) {
	const retry = params.retryDelayMs !== void 0 ? ` retry_in_ms=${params.retryDelayMs}` : "";
	return `imessage: watch.subscribe startup failed attempt=${params.attempt}/${params.maxAttempts} account=${params.accountId} cliPath=${params.cliPath} dbPath=${params.dbPath ? "configured" : "default"} remoteHost=${params.remoteHost ? "configured" : "none"} timeoutMs=${params.probeTimeoutMs} since_rowid=${params.watchSinceRowid ?? "none"} attachments=${params.includeAttachments} include_reactions=true${retry}: ${String(params.error)}`;
}
async function waitForWatchSubscribeRetryDelay(params) {
	if (params.ms <= 0) return;
	await new Promise((resolve) => {
		const timer = setTimeout(() => {
			params.abortSignal?.removeEventListener("abort", onAbort);
			resolve();
		}, params.ms);
		const onAbort = () => {
			clearTimeout(timer);
			params.abortSignal?.removeEventListener("abort", onAbort);
			resolve();
		};
		params.abortSignal?.addEventListener("abort", onAbort, { once: true });
	});
}
async function monitorIMessageProvider(opts = {}) {
	const runtime = resolveRuntime(opts);
	const cfg = opts.config ?? getRuntimeConfig();
	const readConfig = createRuntimeConfigReader(cfg);
	const accountInfo = resolveIMessageAccount({
		cfg,
		accountId: opts.accountId
	});
	const groupsConfigPath = resolveChannelGroupsConfigPath({
		cfg,
		channel: "imessage",
		accountId: accountInfo.accountId,
		groups: resolveChannelGroups(cfg, "imessage", accountInfo.accountId)
	});
	const approvalGatewayRuntime = opts.channelRuntime?.runtimeContexts.get({
		channelId: "imessage",
		accountId: accountInfo.accountId,
		capability: CHANNEL_APPROVAL_GATEWAY_RUNTIME_CONTEXT_CAPABILITY
	});
	const imessageCfg = accountInfo.config;
	const historyLimit = resolvePromptHistoryLimit(imessageCfg.historyLimit ?? cfg.messages?.groupChat?.historyLimit);
	const groupHistories = /* @__PURE__ */ new Map();
	const sentMessageCache = createSentMessageCache();
	const selfChatCache = createSelfChatCache();
	const loopRateLimiter = createLoopRateLimiter();
	const textLimit = resolveTextChunkLimit(cfg, "imessage", accountInfo.accountId);
	const allowFrom = normalizeStringEntries(opts.allowFrom ?? imessageCfg.allowFrom);
	const configuredGroupAllowFrom = opts.groupAllowFrom ?? imessageCfg.groupAllowFrom;
	const groupAllowFrom = normalizeStringEntries(configuredGroupAllowFrom ?? (imessageCfg.allowFrom && imessageCfg.allowFrom.length > 0 ? imessageCfg.allowFrom : []));
	const allowLegacyConversationAllowFromForGroup = configuredGroupAllowFrom == null;
	const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
	const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.imessage !== void 0,
		groupPolicy: imessageCfg.groupPolicy,
		defaultGroupPolicy
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "imessage",
		accountId: accountInfo.accountId,
		log: (message) => runtime.log?.(warn(message))
	});
	warnGroupAllowlistMisconfigOnce({
		groupPolicy,
		hasGroupAllowFrom: mergeIMessageGroupAllowFromWithLegacyChatTargets({
			groupAllowFrom,
			allowFrom,
			allowLegacyConversationTargets: allowLegacyConversationAllowFromForGroup
		}).length > 0,
		accountId: accountInfo.accountId,
		log: (message) => runtime.log?.(warn(message))
	});
	const dmPolicy = imessageCfg.dmPolicy ?? "pairing";
	const catchupCfg = resolveCatchupConfig(imessageCfg.catchup);
	const includeAttachments = opts.includeAttachments ?? imessageCfg.includeAttachments ?? false;
	const mediaMaxBytes = (opts.mediaMaxMb ?? imessageCfg.mediaMaxMb ?? 16) * 1024 * 1024;
	const cliPath = opts.cliPath ?? imessageCfg.cliPath ?? "imsg";
	const dbPath = opts.dbPath ?? imessageCfg.dbPath;
	const probeTimeoutMs = imessageCfg.probeTimeoutMs ?? 1e4;
	const attachmentRoots = resolveIMessageAttachmentRoots({
		cfg,
		accountId: accountInfo.accountId
	});
	const remoteAttachmentRoots = resolveIMessageRemoteAttachmentRoots({
		cfg,
		accountId: accountInfo.accountId
	});
	const remoteHost = await resolveIMessageRemoteHost({
		cliPath,
		remoteHost: imessageCfg.remoteHost
	});
	let staleBacklogSuppressed = 0;
	const loggedThrottledDropDiagnostics = createIMessageThrottledDropDiagnosticCache();
	const watchSourceDbPath = resolveIMessageWatchSourceDbPath({
		cliPath,
		dbPath,
		remoteHost
	});
	const recoveryBoundaryRowid = watchSourceDbPath ? await resolveIMessageStartupRowidWatermark(watchSourceDbPath) : null;
	const recoveryCursorDbIdentity = resolveIMessageRecoveryCursorDbIdentity({
		cliPath,
		dbPath,
		remoteHost
	});
	const recoveryCursorRowid = await loadIMessageRecoveryCursor(accountInfo.accountId, recoveryCursorDbIdentity, {
		migrateLegacyCatchup: !catchupCfg.enabled,
		watermarkRowid: recoveryBoundaryRowid
	});
	const reconciledWatchSinceRowid = catchupCfg.enabled ? null : recoveryCursorRowid !== null ? recoveryBoundaryRowid !== null ? Math.max(recoveryCursorRowid, recoveryBoundaryRowid - 500) : recoveryCursorRowid : recoveryBoundaryRowid;
	const watchSinceRowid = reconciledWatchSinceRowid === 0 ? -1 : reconciledWatchSinceRowid;
	let latestAdvancedRecoveryCursorRowid = recoveryCursorRowid ?? -1;
	const durableRecoveryCursorRowids = /* @__PURE__ */ new Set();
	const failedRecoveryCursorRowids = /* @__PURE__ */ new Set();
	function minSetValue(values) {
		let min = null;
		for (const value of values) min = min === null ? value : Math.min(min, value);
		return min;
	}
	async function advanceRecoveryCursorAfterDurableEnqueue(rowid) {
		if (catchupCfg.enabled) return;
		failedRecoveryCursorRowids.delete(rowid);
		durableRecoveryCursorRowids.add(rowid);
		const maxDurableRowid = Math.max(...durableRecoveryCursorRowids);
		const holdFloor = minSetValue(failedRecoveryCursorRowids);
		const nextCursorRowid = holdFloor !== null && maxDurableRowid >= holdFloor ? holdFloor - 1 : maxDurableRowid;
		if (nextCursorRowid >= 0 && nextCursorRowid > latestAdvancedRecoveryCursorRowid) {
			await advanceIMessageRecoveryCursor(accountInfo.accountId, recoveryCursorDbIdentity, nextCursorRowid);
			latestAdvancedRecoveryCursorRowid = nextCursorRowid;
			for (const durableRowid of durableRecoveryCursorRowids) if (durableRowid <= nextCursorRowid) durableRecoveryCursorRowids.delete(durableRowid);
		}
	}
	function holdRecoveryCursorBeforeFailedEnqueue(rowid) {
		if (catchupCfg.enabled || rowid === null || rowid <= latestAdvancedRecoveryCursorRowid) return;
		failedRecoveryCursorRowids.add(rowid);
	}
	const { debouncer: inboundDebouncer } = createChannelInboundDebouncer({
		cfg,
		channel: "imessage",
		resolveDebounceMs: () => resolveInboundDebounceMs({
			cfg: readConfig(),
			channel: "imessage"
		}),
		buildKey: (entry) => {
			const msg = entry.message;
			const sender = msg.sender?.trim();
			if (!sender) return null;
			const conversationId = msg.chat_id != null ? `chat:${msg.chat_id}` : msg.chat_guid ?? msg.chat_identifier ?? "unknown";
			return `imessage:${accountInfo.accountId}:${conversationId}:${sender}`;
		},
		shouldDebounce: (entry) => {
			const msg = entry.message;
			if (resolveIMessageReactionContext(msg, (msg.text ?? "").trim())) return false;
			if (msg.is_from_me === true) return false;
			return shouldDebounceTextInbound({
				text: msg.text,
				cfg,
				hasMedia: Boolean(msg.attachments?.some((attachment) => !isIMessagePluginPayloadAttachment(attachment)))
			});
		},
		onFlush: (entries, createFlush) => {
			const { lifecycle, settle, abandon } = fanInChannelIngressLifecycles(entries.flatMap((entry) => entry.ingressLifecycle ? [entry.ingressLifecycle] : []));
			return createFlush({
				lifecycle,
				dispatch: async (admissionLifecycle) => {
					if (entries.length === 0) return;
					try {
						if (admissionLifecycle.abortSignal.aborted) {
							await abandon();
							return;
						}
						if (entries.length === 1) {
							await handleMessageNow(expectDefined(entries[0], "single iMessage dispatch entry").message, admissionLifecycle);
							await settle();
							return;
						}
						const combined = combineIMessagePayloads(entries.map((entry) => entry.message));
						if (shouldLogVerbose()) {
							const text = combined.text ?? "";
							const preview = sliceUtf16Safe(text, 0, 50);
							const ellipsis = text.length > 50 ? "..." : "";
							logVerbose(`[imessage] merged ${entries.length} debounced messages: "${preview}${ellipsis}"`);
						}
						await handleMessageNow(combined, admissionLifecycle);
						await settle();
					} catch (err) {
						await abandon();
						runtime.error?.(`imessage: inbound dispatch failed: ${String(err)}`);
					}
				}
			});
		},
		onError: (err) => {
			runtime.error?.(`imessage debounce flush failed: ${String(err)}`);
		}
	});
	let client;
	let detachAbortHandler = () => {};
	let liveCatchupCursorAdvanceEnabled = false;
	let startupCatchupInProgress = false;
	const pendingLiveCatchupCursorAdvances = [];
	const getActiveClient = () => {
		if (!client) throw new Error("imessage monitor client not initialized");
		return client;
	};
	async function repairMessageConversationAnchor(message) {
		return await repairIMessageConversationAnchor({
			client: getActiveClient(),
			message,
			runtime
		});
	}
	function resolveLiveCatchupCursor(message) {
		const coalescedCursor = message.coalescedCatchupCursor;
		const rowid = typeof coalescedCursor?.lastSeenRowid === "number" && Number.isFinite(coalescedCursor.lastSeenRowid) ? coalescedCursor.lastSeenRowid : typeof message.id === "number" && Number.isFinite(message.id) ? message.id : null;
		const dateMs = typeof coalescedCursor?.lastSeenMs === "number" && Number.isFinite(coalescedCursor.lastSeenMs) ? coalescedCursor.lastSeenMs : typeof message.created_at === "string" ? Date.parse(message.created_at) : NaN;
		if (rowid === null || !Number.isFinite(dateMs)) return null;
		return {
			lastSeenMs: dateMs,
			lastSeenRowid: rowid
		};
	}
	async function maybeAdvanceLiveCatchupCursor(message) {
		if (!catchupCfg.enabled) return;
		const cursor = resolveLiveCatchupCursor(message);
		if (!cursor) return;
		if (!liveCatchupCursorAdvanceEnabled) {
			if (startupCatchupInProgress) pendingLiveCatchupCursorAdvances.push(cursor);
			return;
		}
		try {
			await advanceIMessageCatchupCursor(accountInfo.accountId, cursor, catchupCfg);
		} catch (err) {
			runtime.error?.(`imessage catchup: failed to advance live cursor: ${String(err)}`);
		}
	}
	async function flushPendingLiveCatchupCursorAdvances() {
		for (const cursor of pendingLiveCatchupCursorAdvances.splice(0)) try {
			await advanceIMessageCatchupCursor(accountInfo.accountId, cursor, catchupCfg);
		} catch (err) {
			runtime.error?.(`imessage catchup: failed to advance pending live cursor: ${String(err)}`);
		}
	}
	const pollCommentFolder = createPollCommentFolder();
	function resolveIMessageInboundBodyText(message) {
		const messageText = ((message.poll ? renderIMessagePollBody(message.poll, message.sender, { preferOptionId: Boolean(remoteHost) }) : null) ?? message.text ?? "").trim();
		const attachments = includeAttachments ? message.attachments ?? [] : [];
		const effectiveAttachmentRoots = remoteHost ? remoteAttachmentRoots : attachmentRoots;
		return {
			messageText,
			...resolveIMessageInboundMediaInput({
				messageText,
				attachments,
				effectiveAttachmentRoots,
				logVerbose
			}),
			effectiveAttachmentRoots
		};
	}
	async function handleMessageNow(rawMessage, ingressLifecycle) {
		const message = await repairMessageConversationAnchor(rawMessage);
		if (!message) return;
		const pollFoldAtMs = message.created_at ? Date.parse(message.created_at) : NaN;
		if (message.poll) pollCommentFolder.rememberPoll(message.guid, pollFoldAtMs, message.sender);
		else if (message.reply_to_guid != null && pollCommentFolder.isPollComment(message.reply_to_guid, pollFoldAtMs, message.sender)) {
			logVerbose("imessage: folding poll comment (inline reply sent with a poll) into the poll; not delivering standalone");
			return;
		}
		const { messageText, bodyText, mediaFacts, mediaCandidates, rawMediaAttachments, effectiveAttachmentRoots } = resolveIMessageInboundBodyText(message);
		const storeAllowFrom = await readChannelAllowFromStore("imessage", process.env, accountInfo.accountId).catch(() => []);
		const isQuestionReaction = hasIMessageQuestionReactionTarget({
			accountId: accountInfo.accountId,
			message,
			bodyText
		});
		const decision = await resolveIMessageInboundDecision({
			cfg,
			accountId: accountInfo.accountId,
			message,
			opts,
			messageText,
			bodyText,
			mediaFacts,
			allowFrom,
			groupAllowFrom,
			allowLegacyConversationAllowFromForGroup,
			groupPolicy,
			dmPolicy,
			storeAllowFrom,
			historyLimit,
			groupHistories,
			echoCache: sentMessageCache,
			selfChatCache,
			reactionNotifications: isQuestionReaction ? "all" : imessageCfg.reactionNotifications,
			logVerbose
		});
		const chatId = message.chat_id ?? void 0;
		const senderForKey = (message.sender ?? "").trim();
		const conversationKey = chatId != null ? `group:${chatId}` : `dm:${senderForKey}`;
		const rateLimitKey = `${accountInfo.accountId}:${conversationKey}`;
		if (decision.kind === "drop") {
			if (decision.reason === "echo" || decision.reason === "reflected assistant content") loopRateLimiter.record(rateLimitKey);
			const diagnostic = describeIMessageInboundDropDiagnostic({
				accountId: accountInfo.accountId,
				groupsConfigPath,
				reason: decision.reason,
				message
			});
			if (diagnostic) {
				const throttleKey = `${rateLimitKey}:${decision.reason}`;
				if (!IMESSAGE_THROTTLED_DIAGNOSTIC_DROP_REASONS.has(decision.reason) || !loggedThrottledDropDiagnostics.check(throttleKey)) runtime.log?.(warn(diagnostic));
			}
			if (decision.reason === "group id not in allowlist") warnGroupAllowlistDropPerChatOnce({
				accountId: accountInfo.accountId,
				chatId: message.chat_id ?? void 0,
				log: (msg) => runtime.log?.(warn(msg))
			});
			return;
		}
		if (decision.kind === "dispatch" && loopRateLimiter.isRateLimited(rateLimitKey)) {
			if (!loggedThrottledDropDiagnostics.check(`${rateLimitKey}:rate-limited`)) {
				const diagnosticConversationKey = `${chatId != null ? "group" : "dm"}:${redactIdentifier(conversationKey)}`;
				runtime.log?.(warn(`[imessage:${accountInfo.accountId}] Suppressing inbound from ${diagnosticConversationKey}: echo loop detected (rate limiter tripped)`));
			}
			return;
		}
		if (decision.kind === "pairing") {
			const sender = (message.sender ?? "").trim();
			if (!sender) return;
			await createChannelPairingChallengeIssuer({
				channel: "imessage",
				accountId: accountInfo.accountId,
				upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
					channel: "imessage",
					id,
					accountId: accountInfo.accountId,
					meta
				})
			})({
				senderId: decision.senderId,
				senderIdLine: `Your iMessage sender id: ${decision.senderId}`,
				meta: {
					sender: decision.senderId,
					chatId: chatId ? String(chatId) : void 0
				},
				onCreated: () => {
					logVerbose(`imessage pairing request sender=${decision.senderId}`);
				},
				sendPairingReply: async (text) => {
					await sendMessageIMessage(sender, text, {
						config: cfg,
						client: getActiveClient(),
						maxBytes: mediaMaxBytes,
						accountId: accountInfo.accountId,
						...chatId ? { chatId } : {}
					});
				},
				onReplyError: (err) => {
					runtime.error?.(`imessage pairing reply failed for ${decision.senderId}: ${String(err)}`);
				}
			});
			return;
		}
		if (decision.kind === "reaction") {
			if (await maybeResolveIMessageQuestionReaction({
				cfg,
				accountId: accountInfo.accountId,
				message,
				bodyText,
				senderId: decision.senderNormalized,
				logDebug: logVerbose
			})) return;
			enqueueIMessageReactionSystemEvent({
				decision,
				runtime,
				logVerbose
			});
			return;
		}
		if (decision.bindingResolution) {
			const readiness = await ensureConfiguredBindingRouteReady({
				cfg,
				bindingResolution: decision.bindingResolution
			});
			if (!readiness.ok) {
				runtime.error?.(`imessage: dropped inbound message; configured ACP binding unavailable for ${decision.bindingResolution.record.conversation.conversationId}: ${readiness.error}`);
				return;
			}
		}
		const storePath = resolveStorePath(cfg.session?.store, { agentId: decision.route.agentId });
		const privateApiStatus = await probeIMessagePrivateApi(cliPath, probeTimeoutMs);
		const supportsTyping = imessageRpcSupportsMethod(privateApiStatus, "typing");
		const supportsRead = imessageRpcSupportsMethod(privateApiStatus, "read");
		if (privateApiStatus.available) {
			if (!supportsTyping || !supportsRead) warnIfImsgUpgradeNeeded.fireOnce(privateApiStatus.rpcMethods, runtime);
		}
		const configuredTypingMode = resolveConfiguredIMessageTypingMode(cfg, decision.route.agentId);
		const sendPolicy = resolveSendPolicy({
			cfg,
			entry: getSessionEntry({
				storePath,
				sessionKey: decision.route.sessionKey
			}),
			sessionKey: decision.route.sessionKey,
			channel: "imessage",
			chatType: decision.isGroup ? "group" : "direct"
		});
		const shouldUseDirectToolTypingOptions = !decision.isGroup && sendPolicy !== "deny" && (configuredTypingMode === void 0 || configuredTypingMode === "instant");
		const shouldStartDirectTyping = supportsTyping && shouldUseDirectToolTypingOptions;
		const earlyDirectTypingService = resolveIMessageDirectChatService(imessageCfg.service, decision.chatGuid) ?? "auto";
		const earlyDirectTypingTarget = shouldStartDirectTyping ? `${earlyDirectTypingService}:${decision.sender}` : void 0;
		let stopEarlyDirectTyping;
		if (earlyDirectTypingTarget) {
			const earlyDirectTypingStarted = sendIMessageTyping(earlyDirectTypingTarget, true, {
				cfg,
				accountId: accountInfo.accountId,
				cliPath,
				dbPath,
				remoteHost
			}).then(() => true, (err) => {
				logTypingFailure({
					log: (msg) => logVerbose(msg),
					channel: "imessage",
					action: "start",
					target: earlyDirectTypingTarget,
					error: err
				});
				return false;
			});
			let earlyTypingStopQueued = false;
			stopEarlyDirectTyping = () => {
				if (earlyTypingStopQueued) return;
				earlyTypingStopQueued = true;
				earlyDirectTypingStarted.then(async (started) => {
					if (!started) return;
					await sendIMessageTyping(earlyDirectTypingTarget, false, {
						cfg,
						accountId: accountInfo.accountId,
						cliPath,
						dbPath,
						remoteHost
					});
				}).catch((err) => {
					logTypingFailure({
						log: (msg) => logVerbose(msg),
						channel: "imessage",
						action: "stop",
						target: earlyDirectTypingTarget,
						error: err
					});
				});
			};
		}
		const staged = remoteHost ? {
			attachments: rawMediaAttachments,
			unavailableCount: rawMediaAttachments.filter((attachment) => !attachment.path).length
		} : await stageIMessageAttachments(mediaCandidates, {
			maxBytes: mediaMaxBytes,
			allowedRoots: effectiveAttachmentRoots,
			deps: { logVerbose }
		});
		const mediaAttachments = staged.attachments;
		const unavailableCount = staged.unavailableCount;
		const contextDecision = unavailableCount > 0 ? {
			...decision,
			agentBodyText: formatIMessageInboundMediaBody({
				messageText,
				unavailableCount
			})
		} : decision;
		const previousTimestamp = readSessionUpdatedAt({
			storePath,
			sessionKey: decision.route.sessionKey
		});
		const dmHistoryLimit = !decision.isGroup ? resolveIMessageDmHistoryLimit({
			config: imessageCfg,
			sender: decision.sender,
			senderNormalized: decision.senderNormalized
		}) : 0;
		const dmHistory = !decision.isGroup && dmHistoryLimit > 0 && !previousTimestamp ? await resolveIMessageDmHistoryContext({
			client: getActiveClient(),
			message,
			senderNormalized: decision.senderNormalized,
			limit: dmHistoryLimit,
			envelopeOptions: resolveEnvelopeFormatOptions(cfg),
			logVerbose
		}) : void 0;
		const pluginChannelRuntime = opts.channelRuntime;
		const { ctxPayload, chatTarget, imessageTo } = await buildIMessageInboundContext({
			cfg,
			accountService: imessageCfg.service,
			decision: contextDecision,
			message,
			previousTimestamp,
			remoteHost,
			historyLimit,
			groupHistories,
			dmHistory,
			buildContext: pluginChannelRuntime?.inbound.buildContext,
			media: { facts: mediaAttachments }
		});
		const updateTarget = chatTarget || imessageTo;
		const pinnedMainDmOwner = resolvePinnedMainDmOwnerFromAllowlist({
			dmScope: cfg.session?.dmScope,
			allowFrom,
			normalizeEntry: normalizeIMessageHandle
		});
		if (shouldLogVerbose()) {
			const preview = truncateUtf16Safe(ctxPayload.Body ?? "", 200).replace(/\n/g, "\\n");
			logVerbose(`imessage inbound: chatId=${chatId ?? "unknown"} from=${ctxPayload.From} len=${(ctxPayload.Body ?? "").length} preview="${preview}"`);
		}
		const sendReadReceipts = imessageCfg.sendReadReceipts !== false;
		const typingTarget = ctxPayload.To;
		const readTarget = !decision.isGroup && decision.chatGuid ? `chat_guid:${decision.chatGuid}` : typingTarget;
		if (supportsRead && sendReadReceipts && readTarget) markIMessageChatRead(readTarget, {
			cfg,
			accountId: accountInfo.accountId,
			cliPath,
			dbPath,
			remoteHost
		}).catch((err) => {
			runtime.error?.(`imessage: mark read failed: ${String(err)}`);
		});
		const { onModelSelected, ...replyPipeline } = createChannelMessageReplyPipeline({
			cfg,
			agentId: decision.route.agentId,
			channel: "imessage",
			accountId: decision.route.accountId,
			typing: supportsTyping && typingTarget ? {
				start: async () => {
					await sendIMessageTyping(typingTarget, true, {
						cfg,
						accountId: accountInfo.accountId,
						client: getActiveClient(),
						cliPath,
						dbPath,
						remoteHost
					});
				},
				stop: async () => {
					await sendIMessageTyping(typingTarget, false, {
						cfg,
						accountId: accountInfo.accountId,
						client: getActiveClient(),
						cliPath,
						dbPath,
						remoteHost
					});
				},
				keepaliveIntervalMs: IMESSAGE_TYPING_KEEPALIVE_INTERVAL_MS,
				maxDurationMs: IMESSAGE_TYPING_KEEPALIVE_MAX_DURATION_MS,
				onStartError: (err) => {
					logTypingFailure({
						log: (msg) => logVerbose(msg),
						channel: "imessage",
						action: "start",
						target: typingTarget,
						error: err
					});
				},
				onStopError: (err) => {
					logTypingFailure({
						log: (msg) => logVerbose(msg),
						channel: "imessage",
						action: "stop",
						target: typingTarget,
						error: err
					});
				}
			} : void 0
		});
		const dispatcherOptions = {
			...replyPipeline,
			humanDelay: resolveHumanDelayConfig(cfg, decision.route.agentId)
		};
		const delivery = {
			durable: ctxPayload.To ? {
				to: ctxPayload.To,
				deps: { imessage: createIMessageEchoCachingSend({
					accountId: accountInfo.accountId,
					sentMessageCache
				}) }
			} : false,
			observeMessageSent: true,
			deliver: async (payload) => {
				const target = ctxPayload.To;
				if (!target) {
					runtime.error?.(danger("imessage: missing delivery target"));
					return {
						visibleReplySent: false,
						suppression: { reason: "no_visible_result" }
					};
				}
				return await deliverIMessageReply({
					cfg,
					payload,
					target,
					accountId: accountInfo.accountId,
					runtime,
					maxBytes: mediaMaxBytes,
					textLimit,
					sentMessageCache
				});
			},
			onError: (err, info) => {
				runtime.error?.(danger(`imessage ${info.kind} reply failed: ${String(err)}`));
			}
		};
		let directTypingController;
		const directToolTypingOptions = shouldUseDirectToolTypingOptions ? {
			suppressDefaultToolProgressMessages: true,
			allowToolLifecycleWhenProgressHidden: true,
			allowProgressCallbacksWhenSourceDeliverySuppressed: true,
			onTypingController: (typing) => {
				directTypingController = typing;
			},
			onToolResult: async () => {
				await directTypingController?.startTypingLoop();
				return false;
			},
			...supportsTyping ? { onToolStart: async () => {
				await directTypingController?.startTypingLoop();
				return false;
			} } : {}
		} : {};
		const configuredBlockStreaming = resolveChannelStreamingBlockEnabled(accountInfo.config);
		const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
			route: decision.route,
			sessionKey: decision.route.sessionKey
		});
		await runChannelInboundEvent({
			channel: "imessage",
			accountId: decision.route.accountId,
			raw: decision,
			adapter: {
				ingest: () => ({
					id: ctxPayload.MessageSid ?? `${ctxPayload.From}:${Date.now()}`,
					timestamp: typeof ctxPayload.Timestamp === "number" ? ctxPayload.Timestamp : void 0,
					rawText: ctxPayload.RawBody ?? "",
					textForAgent: ctxPayload.BodyForAgent,
					textForCommands: ctxPayload.CommandBody,
					raw: decision
				}),
				resolveTurn: () => ({
					cfg,
					channel: "imessage",
					accountId: decision.route.accountId,
					route: {
						agentId: decision.route.agentId,
						sessionKey: decision.route.sessionKey
					},
					ctxPayload,
					dispatchReplyFromConfig: pluginChannelRuntime?.reply?.dispatchReplyFromConfig,
					record: {
						updateLastRoute: !decision.isGroup && updateTarget ? {
							sessionKey: inboundLastRouteSessionKey,
							channel: "imessage",
							to: updateTarget,
							accountId: decision.route.accountId,
							mainDmOwnerPin: inboundLastRouteSessionKey === decision.route.mainSessionKey && pinnedMainDmOwner && decision.senderNormalized ? {
								ownerRecipient: pinnedMainDmOwner,
								senderRecipient: decision.senderNormalized,
								onSkip: ({ ownerRecipient, senderRecipient }) => {
									logVerbose(`imessage: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
								}
							} : void 0
						} : void 0,
						onRecordError: (err) => {
							logVerbose(`imessage: failed updating session meta: ${String(err)}`);
						}
					},
					history: {
						isGroup: decision.isGroup,
						historyKey: decision.historyKey,
						historyMap: groupHistories,
						limit: historyLimit
					},
					delivery,
					dispatcherOptions: {
						...dispatcherOptions,
						onSettled: () => stopEarlyDirectTyping?.()
					},
					replyOptions: {
						...ingressLifecycle ? bindIngressLifecycleToReplyOptions(ingressLifecycle) : {},
						disableBlockStreaming: typeof configuredBlockStreaming === "boolean" ? !configuredBlockStreaming : void 0,
						onModelSelected,
						...directToolTypingOptions
					}
				}),
				onFinalize: () => stopEarlyDirectTyping?.()
			}
		});
	}
	const suppressStaleIngress = (message, receivedAt, provenance) => {
		const isRecoveryReplay = recoveryCursorRowid !== null && recoveryBoundaryRowid !== null && typeof message.id === "number" && message.id <= recoveryBoundaryRowid;
		const staleThresholdMs = isRecoveryReplay ? IMESSAGE_RECOVERY_MAX_AGE_MS : IMESSAGE_STALE_INBOUND_THRESHOLD_MS;
		if (provenance?.catchup || !isStaleIMessageBacklog(message, receivedAt, staleThresholdMs)) return false;
		staleBacklogSuppressed += 1;
		runtime.log?.(warn(`imessage: suppressed stale inbound backlog account=${accountInfo.accountId} sent=${message.created_at ?? "unknown"} recovery=${isRecoveryReplay} (${staleBacklogSuppressed} suppressed since start)`));
		return true;
	};
	const maybeHandleApprovalControl = async (message) => {
		if (await maybeResolveIMessageApprovalPollVote({
			cfg,
			accountId: accountInfo.accountId,
			message,
			gatewayRuntime: approvalGatewayRuntime
		})) return true;
		return await maybeResolveIMessageApprovalReaction({
			cfg,
			accountId: accountInfo.accountId,
			message,
			bodyText: resolveIMessageInboundBodyText(message).bodyText,
			gatewayRuntime: approvalGatewayRuntime,
			logVerboseMessage: logVerbose
		});
	};
	const resolveApprovalControlConversation = (message) => {
		const sender = normalizeIMessageHandle((message.sender ?? "").trim());
		const destination = normalizeIMessageHandle((message.destination_caller_id ?? "").trim());
		const actorHandle = (message.is_from_me !== true && Boolean(sender) && sender === destination ? "" : sender) || (message.is_from_me === true ? destination : "");
		return actorHandle ? buildIMessageApprovalConversationKeyForInbound({
			chatGuid: message.chat_guid,
			chatIdentifier: message.chat_identifier,
			chatId: message.chat_id,
			isGroup: message.is_group,
			actorHandle
		}) : null;
	};
	const ingress = createIMessageDurableIngress({
		accountId: accountInfo.accountId,
		runtime,
		dispatchPriority: async (message, lifecycle, receivedAt, provenance) => {
			const bodyText = (message.text ?? "").trim();
			const isApprovalCommand = /^\/approve(?:@[^\s]+)?(?:\s|$)/i.test(bodyText);
			if (!(isApprovalCommand || message.poll?.kind === "vote" || Boolean(resolveIMessageReactionContext(message, bodyText)))) return;
			if (suppressStaleIngress(message, receivedAt, provenance)) return { kind: "completed" };
			const repairedMessage = await repairMessageConversationAnchor(message);
			if (!repairedMessage) return { kind: "completed" };
			if (isApprovalCommand) {
				await handleMessageNow(repairedMessage);
				return { kind: "completed" };
			}
			const conversation = resolveApprovalControlConversation(repairedMessage);
			while (true) {
				if (await maybeHandleApprovalControl(repairedMessage)) return { kind: "completed" };
				if (!conversation) return;
				if (!await iMessageApprovalControlBindings.wait({
					accountId: accountInfo.accountId,
					conversation,
					abortSignal: lifecycle.abortSignal
				})) return await maybeHandleApprovalControl(repairedMessage) ? { kind: "completed" } : void 0;
			}
		},
		dispatch: async (message, ingressLifecycle, receivedAt, provenance) => {
			if (suppressStaleIngress(message, receivedAt, provenance)) return { kind: "completed" };
			const repairedMessage = await repairMessageConversationAnchor(message);
			if (!repairedMessage) return { kind: "completed" };
			if (await maybeHandleApprovalControl(repairedMessage)) return { kind: "completed" };
			await inboundDebouncer.enqueue({
				message: repairedMessage,
				ingressLifecycle
			});
			return { kind: "deferred" };
		},
		onDurableEnqueue: async (facts) => {
			await advanceRecoveryCursorAfterDurableEnqueue(facts.rowid);
			await maybeAdvanceLiveCatchupCursor({
				id: facts.rowid,
				created_at: facts.createdAt
			});
		},
		onDurableEnqueueFailure: (rowid) => {
			holdRecoveryCursorBeforeFailedEnqueue(rowid);
		}
	});
	await waitForTransportReady({
		label: "imsg rpc",
		timeoutMs: 3e4,
		logAfterMs: 1e4,
		logIntervalMs: 1e4,
		pollIntervalMs: 500,
		abortSignal: opts.abortSignal,
		runtime,
		check: async () => {
			const probe = await probeIMessage(probeTimeoutMs, {
				cliPath,
				dbPath,
				remoteHost,
				runtime
			});
			if (probe.ok) return { ok: true };
			if (probe.fatal) throw new Error(probe.error ?? "imsg rpc unavailable");
			return {
				ok: false,
				error: probe.error ?? "unreachable"
			};
		}
	});
	if (opts.abortSignal?.aborted) return;
	const abort = opts.abortSignal;
	const createWatchClient = async () => await createIMessageRpcClient({
		cliPath,
		dbPath,
		remoteHost,
		runtime,
		onNotification: (msg) => {
			if (msg.method === "message") ingress.receive(msg.params).catch((err) => {
				runtime.error?.(`imessage: durable admission failed: ${String(err)}`);
			});
			else if (msg.method === "error") runtime.error?.(`imessage: watch error ${JSON.stringify(sanitizeIMessageWatchErrorPayload(msg.params))}`);
		}
	});
	const requireWatchClient = (watchClient) => {
		if (!watchClient) throw new Error("imessage monitor client not initialized");
		return watchClient;
	};
	for (let attempt = 1; attempt <= WATCH_SUBSCRIBE_MAX_ATTEMPTS; attempt++) {
		if (abort?.aborted) return;
		let attemptClient;
		let attemptDetachAbortHandler = () => {};
		let keepAttemptClient = false;
		try {
			attemptClient = requireWatchClient(await createWatchClient());
			let attemptSubscriptionId = null;
			attemptDetachAbortHandler = attachIMessageMonitorAbortHandler({
				abortSignal: abort,
				client: attemptClient,
				getSubscriptionId: () => attemptSubscriptionId
			});
			attemptSubscriptionId = (await attemptClient.request("watch.subscribe", {
				attachments: includeAttachments,
				include_reactions: true,
				...watchSinceRowid !== null ? { since_rowid: watchSinceRowid } : {}
			}, { timeoutMs: probeTimeoutMs }))?.subscription ?? null;
			opts.statusSink?.(channelReadyPatch());
			client = attemptClient;
			detachAbortHandler = attemptDetachAbortHandler;
			keepAttemptClient = true;
			break;
		} catch (err) {
			if (abort?.aborted) return;
			const retriable = isRetriableWatchSubscribeStartupError(err);
			if (!(attempt < WATCH_SUBSCRIBE_MAX_ATTEMPTS && retriable)) {
				opts.statusSink?.({
					connected: false,
					lifecycle: retriable ? "recovering" : "blocked",
					terminalDisconnect: retriable ? void 0 : true,
					lastError: String(err)
				});
				runtime.error?.(danger(`imessage: monitor failed: ${describeIMessageWatchSubscribeStartupFailure({
					accountId: accountInfo.accountId,
					attempt,
					maxAttempts: WATCH_SUBSCRIBE_MAX_ATTEMPTS,
					cliPath,
					dbPath,
					remoteHost,
					includeAttachments,
					probeTimeoutMs,
					watchSinceRowid,
					error: err
				})}`));
				throw err;
			}
			opts.statusSink?.({
				connected: false,
				lifecycle: "recovering",
				lastError: String(err)
			});
			runtime.log?.(warn(describeIMessageWatchSubscribeStartupFailure({
				accountId: accountInfo.accountId,
				attempt,
				maxAttempts: WATCH_SUBSCRIBE_MAX_ATTEMPTS,
				cliPath,
				dbPath,
				remoteHost,
				includeAttachments,
				probeTimeoutMs,
				watchSinceRowid,
				error: err,
				retryDelayMs: WATCH_SUBSCRIBE_RETRY_DELAY_MS
			})));
			attemptDetachAbortHandler();
			attemptDetachAbortHandler = () => {};
			await attemptClient?.stop();
			attemptClient = void 0;
			await waitForWatchSubscribeRetryDelay({
				ms: WATCH_SUBSCRIBE_RETRY_DELAY_MS,
				abortSignal: abort
			});
			if (abort?.aborted) return;
		} finally {
			if (!keepAttemptClient) {
				attemptDetachAbortHandler();
				await attemptClient?.stop();
			}
		}
	}
	const activeClient = client;
	if (!activeClient) return;
	ingress.start();
	const approvalContextLease = opts.channelRuntime ? registerChannelRuntimeContext({
		channelRuntime: opts.channelRuntime,
		channelId: "imessage",
		accountId: accountInfo.accountId,
		capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
		context: { accountId: accountInfo.accountId },
		abortSignal: abort
	}) : void 0;
	let approvalReactionPollInFlight = false;
	const pollApprovalReactions = async (allowRecentChatDiscovery = false) => {
		if (approvalReactionPollInFlight) return;
		approvalReactionPollInFlight = true;
		try {
			await pollPendingIMessageApprovalReactions({
				client: activeClient,
				cfg,
				accountId: accountInfo.accountId,
				allowRecentChatDiscovery,
				gatewayRuntime: approvalGatewayRuntime,
				logVerboseMessage: logVerbose
			});
		} catch (err) {
			logVerbose(`imessage: approval reaction poll failed: ${String(err)}`);
		} finally {
			approvalReactionPollInFlight = false;
		}
	};
	const approvalReactionPollTimer = setInterval(() => {
		pollApprovalReactions();
	}, APPROVAL_REACTION_POLL_INTERVAL_MS);
	const approvalReactionDiscoveryTimer = setInterval(() => {
		pollApprovalReactions(true);
	}, APPROVAL_REACTION_DISCOVERY_INTERVAL_MS);
	pollApprovalReactions(true);
	if (catchupCfg.enabled && !abort?.aborted) {
		startupCatchupInProgress = true;
		try {
			const catchupSummary = await runIMessageCatchup({
				client: activeClient,
				accountId: accountInfo.accountId,
				config: catchupCfg,
				includeAttachments,
				dispatchPayload: async (_message, rawEnvelope) => {
					await ingress.receive(rawEnvelope, { catchup: true });
				},
				observeSkippedFromMePayload: (message) => {
					const { bodyText } = resolveIMessageInboundBodyText(message);
					rememberIMessageSkippedFromMeForSelfChatDedupe({
						accountId: accountInfo.accountId,
						message,
						bodyText,
						selfChatCache
					});
				},
				runtime
			});
			liveCatchupCursorAdvanceEnabled = catchupSummary.querySucceeded && catchupSummary.fullyCaughtUp;
			if (liveCatchupCursorAdvanceEnabled) await flushPendingLiveCatchupCursorAdvances();
			else pendingLiveCatchupCursorAdvances.length = 0;
		} catch (err) {
			pendingLiveCatchupCursorAdvances.length = 0;
			runtime.error?.(`imessage catchup: pass failed: ${String(err)}`);
		} finally {
			startupCatchupInProgress = false;
		}
	}
	try {
		await activeClient.waitForClose();
	} catch (err) {
		if (abort?.aborted) return;
		runtime.error?.(danger(`imessage: monitor failed: ${String(err)}`));
		throw err;
	} finally {
		clearInterval(approvalReactionPollTimer);
		clearInterval(approvalReactionDiscoveryTimer);
		approvalContextLease?.dispose();
		detachAbortHandler();
		await activeClient.stop();
		await ingress.stop();
	}
}
//#endregion
export { monitorIMessageProvider as t };
