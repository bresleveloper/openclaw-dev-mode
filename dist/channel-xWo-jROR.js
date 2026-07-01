import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-5IgE9UKY.js";
import { n as resolveChannelGroupRequireMention, r as resolveChannelGroupToolsPolicy } from "./group-policy-BM2LYNY0.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { t as clearAccountEntryFields } from "./config-helpers-CgcJ3mtr.js";
import "./error-runtime-Ck1CsJM-.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { i as resolveTelegramStartupProbeTimeoutMs } from "./request-timeouts-CB0H7cNv.js";
import { n as collectTelegramUnmentionedGroupIds, t as auditTelegramGroupMembership } from "./audit-CZKRDu5n.js";
import { i as createChatChannelPlugin, n as buildThreadAwareOutboundSessionRoute, t as buildChannelOutboundSessionRoute } from "./core-D6I8wZcD.js";
import "./channel-core-DIHEayQQ.js";
import { t as resolveTelegramToken } from "./token-TAKIHmfc.js";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-Bfh0_sXw.js";
import "./channel-policy-VIimbh8Q.js";
import { t as createChannelDirectoryAdapter } from "./directory-runtime-0snnWeh8.js";
import { n as createApproverRestrictedNativeApprovalCapability } from "./approval-delivery-helpers-Ddw9uAMj.js";
import "./approval-delivery-runtime-BC8bGkG0.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-DLWtIqHq.js";
import { n as createChannelApproverDmTargetResolver, r as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-BQP5fMRA.js";
import "./approval-native-runtime-KhBiC_33.js";
import { a as resolveConfiguredFromCredentialStatuses, r as projectCredentialSnapshotFields } from "./account-snapshot-fields-Cncg_bX1.js";
import { w as createChannelMessageAdapterFromOutbound } from "./channel-outbound-BNKGCEf1.js";
import "./cli-runtime-Comrp7kq.js";
import { c as createNestedAllowlistOverrideResolver, n as buildDmGroupAccountAllowlistAdapter } from "./allowlist-config-edit-CeTa5wPZ.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { _ as resolveEnabledConfiguredAccountId, d as createDefaultChannelRuntimeState, m as asString, o as buildTokenChannelStatusSummary, p as appendMatchMetadata, u as createComputedAccountStatusAdapter } from "./status-helpers-DjJ0OuL_.js";
import "./channel-status-CxP0h-5H.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-BhZI8NmU.js";
import { t as mergeTelegramAccountConfig } from "./account-config-BKRZ3sTn.js";
import { a as resolveDefaultTelegramAccountId, o as resolveTelegramAccount, r as listTelegramAccountIds } from "./accounts-BXLnoZbF.js";
import { a as parseTelegramTarget, n as normalizeTelegramChatId, r as normalizeTelegramLookupTarget } from "./targets-CDtCx0Zi.js";
import { a as telegramConfigAdapter, c as telegramSecurityAdapter, i as formatDuplicateTelegramTokenReason, n as createTelegramPluginBase, o as telegramSetupWizard, r as findTelegramTokenOwnerAccountId, s as telegramSetupAdapter, u as lookupTelegramChatId } from "./channel.setup-B3k_rcxb.js";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-MMbEJ5UK.js";
import { c as resolveTelegramExecApprovalTarget, f as shouldSuppressLocalTelegramExecApprovalPrompt, i as isTelegramExecApprovalClientEnabled, n as isTelegramExecApprovalApprover, o as isTelegramExecApprovalTargetRecipient, r as isTelegramExecApprovalAuthorizedSender, t as getTelegramExecApprovalApprovers, u as shouldHandleTelegramExecApprovalRequest } from "./exec-approvals-C9ecs_tT.js";
import { st as parseTelegramThreadId, y as buildTelegramGroupPeerId } from "./sent-message-cache-DCZ3wBB-.js";
import { n as getTelegramRuntime } from "./runtime-B_f_VNpK.js";
import { i as writeCachedTelegramBotInfo, n as deleteCachedTelegramBotInfo, r as readCachedTelegramBotInfo, t as detectTelegramLegacyStateMigrations } from "./state-migrations-B0a-0nMw.js";
import { a as buildTelegramExecApprovalPendingPayload, i as releaseStoppedTelegramPollingLease, r as monitorTelegramProvider, s as telegramMessageActions$1, t as probeTelegram } from "./probe-CCxWCxi6.js";
import { n as listTelegramDirectoryPeersFromConfig, t as listTelegramDirectoryGroupsFromConfig } from "./directory-config-BqnXWwU9.js";
import { t as loadTelegramSendModule } from "./send-runtime-DkWqcYIW.js";
import { n as createTelegramOutboundAdapter } from "./outbound-adapter-DC7UaLYo.js";
import { t as resolveTelegramReactionLevel } from "./reaction-level-D7Uy0JBe.js";
import { t as parseTelegramTopicConversation } from "./topic-conversation-B6kdtLDb.js";
import { n as resolveTelegramSessionTarget, t as resolveTelegramSessionConversation } from "./session-conversation-BZQxsRev.js";
import { c as setTelegramThreadBindingMaxAgeBySessionKey, r as createTelegramThreadBindingManager, s as setTelegramThreadBindingIdleTimeoutBySessionKey } from "./thread-bindings-bwx0yIT3.js";
//#region extensions/telegram/src/action-threading.ts
function resolveTelegramAutoThreadId(params) {
	const context = params.toolContext;
	if (!context?.currentThreadTs || !context.currentChannelId) return;
	const parsedTo = parseTelegramTarget(params.to);
	if (parsedTo.messageThreadId != null) return;
	const parsedChannel = parseTelegramTarget(context.currentChannelId);
	if (normalizeLowercaseStringOrEmpty(parsedTo.chatId) !== normalizeLowercaseStringOrEmpty(parsedChannel.chatId)) return;
	return context.currentThreadTs;
}
//#endregion
//#region extensions/telegram/src/approval-native.ts
function resolveTurnSourceTelegramOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const rawTurnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
	const parsedTurnSourceTarget = rawTurnSourceTo ? parseTelegramTarget(rawTurnSourceTo) : null;
	const turnSourceTo = normalizeTelegramChatId(parsedTurnSourceTarget?.chatId ?? rawTurnSourceTo);
	if (turnSourceChannel !== "telegram" || !turnSourceTo) return null;
	return {
		to: turnSourceTo,
		threadId: parseTelegramThreadId(request.request.turnSourceThreadId ?? parsedTurnSourceTarget?.messageThreadId ?? void 0)
	};
}
function resolveSessionTelegramOriginTarget(sessionTarget) {
	return {
		to: normalizeTelegramChatId(sessionTarget.to) ?? sessionTarget.to,
		threadId: parseTelegramThreadId(sessionTarget.threadId)
	};
}
const telegramNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "telegram",
	channelLabel: "Telegram",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.telegram.accounts.${accountId}` : "channels.telegram";
		return `Approve it from the Web UI or terminal UI for now. Telegram supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
	},
	listAccountIds: listTelegramAccountIds,
	hasApprovers: ({ cfg, accountId }) => getTelegramExecApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => isTelegramExecApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => isTelegramExecApprovalApprover({
		cfg,
		accountId,
		senderId
	}),
	isNativeDeliveryEnabled: ({ cfg, accountId }) => isTelegramExecApprovalClientEnabled({
		cfg,
		accountId
	}),
	resolveNativeDeliveryMode: ({ cfg, accountId }) => resolveTelegramExecApprovalTarget({
		cfg,
		accountId
	}),
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveOriginTarget: createChannelNativeOriginTargetResolver({
		channel: "telegram",
		shouldHandleRequest: ({ cfg, accountId, request }) => shouldHandleTelegramExecApprovalRequest({
			cfg,
			accountId,
			request
		}),
		resolveTurnSourceTarget: resolveTurnSourceTelegramOriginTarget,
		resolveSessionTarget: resolveSessionTelegramOriginTarget
	}),
	resolveApproverDmTargets: createChannelApproverDmTargetResolver({
		shouldHandleRequest: ({ cfg, accountId, request }) => shouldHandleTelegramExecApprovalRequest({
			cfg,
			accountId,
			request
		}),
		resolveApprovers: getTelegramExecApprovalApprovers,
		mapApprover: (approver) => ({ to: approver })
	}),
	notifyOriginWhenDmOnly: true,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		eventKinds: ["exec", "plugin"],
		isConfigured: ({ cfg, accountId }) => isTelegramExecApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, request }) => shouldHandleTelegramExecApprovalRequest({
			cfg,
			accountId,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-DWMaIlGH.js")).telegramApprovalNativeRuntime
	})
});
const resolveTelegramApproveCommandBehavior = (params) => {
	const { cfg, accountId, senderId, approvalKind } = params;
	if (approvalKind !== "exec") return;
	if (isTelegramExecApprovalClientEnabled({
		cfg,
		accountId
	})) return;
	if (isTelegramExecApprovalTargetRecipient({
		cfg,
		accountId,
		senderId
	})) return;
	if (isTelegramExecApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}) && !isTelegramExecApprovalApprover({
		cfg,
		accountId,
		senderId
	})) return;
	return {
		kind: "reply",
		text: "❌ Telegram exec approvals are not enabled for this bot account."
	};
};
const telegramApprovalCapability = {
	...telegramNativeApprovalCapability,
	resolveApproveCommandBehavior: resolveTelegramApproveCommandBehavior
};
//#endregion
//#region extensions/telegram/src/group-policy.ts
function parseTelegramGroupId(value) {
	const raw = value?.trim() ?? "";
	if (!raw) return {
		chatId: void 0,
		topicId: void 0
	};
	const parts = raw.split(":").filter(Boolean);
	if (parts.length >= 3 && parts[1] === "topic" && /^-?\d+$/.test(parts[0]) && /^\d+$/.test(parts[2])) return {
		chatId: parts[0],
		topicId: parts[2]
	};
	if (parts.length >= 2 && /^-?\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) return {
		chatId: parts[0],
		topicId: parts[1]
	};
	return {
		chatId: raw,
		topicId: void 0
	};
}
function resolveTelegramRequireMention(params) {
	const { cfg, chatId, topicId, accountId } = params;
	if (!chatId) return;
	const scopedGroups = (accountId ? cfg.channels?.telegram?.accounts?.[accountId]?.groups : void 0) ?? cfg.channels?.telegram?.groups;
	const groupConfig = scopedGroups?.[chatId];
	const groupDefault = scopedGroups?.["*"];
	const topicConfig = topicId && groupConfig?.topics ? {
		...groupConfig.topics["*"],
		...groupConfig.topics[topicId]
	} : void 0;
	const defaultTopicConfig = topicId && groupDefault?.topics ? {
		...groupDefault.topics["*"],
		...groupDefault.topics[topicId]
	} : void 0;
	if (typeof topicConfig?.requireMention === "boolean") return topicConfig.requireMention;
	if (typeof defaultTopicConfig?.requireMention === "boolean") return defaultTopicConfig.requireMention;
	if (typeof groupConfig?.requireMention === "boolean") return groupConfig.requireMention;
	if (typeof groupDefault?.requireMention === "boolean") return groupDefault.requireMention;
}
function resolveTelegramGroupRequireMention(params) {
	const { chatId, topicId } = parseTelegramGroupId(params.groupId);
	const requireMention = resolveTelegramRequireMention({
		cfg: params.cfg,
		chatId,
		topicId,
		accountId: params.accountId
	});
	if (typeof requireMention === "boolean") return requireMention;
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "telegram",
		groupId: chatId ?? params.groupId,
		accountId: params.accountId
	});
}
function resolveTelegramGroupToolPolicy(params) {
	const { chatId } = parseTelegramGroupId(params.groupId);
	return resolveChannelGroupToolsPolicy({
		cfg: params.cfg,
		channel: "telegram",
		groupId: chatId ?? params.groupId,
		accountId: params.accountId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
//#region extensions/telegram/src/normalize.ts
const TELEGRAM_PREFIX_RE = /^(telegram|tg):/i;
function normalizeTelegramTargetBody(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const prefixStripped = trimmed.replace(TELEGRAM_PREFIX_RE, "").trim();
	if (!prefixStripped) return;
	const parsed = parseTelegramTarget(trimmed);
	const normalizedChatId = normalizeTelegramLookupTarget(parsed.chatId);
	if (!normalizedChatId) return;
	const keepLegacyGroupPrefix = /^group:/i.test(prefixStripped);
	const hasTopicSuffix = /:topic:\d+$/i.test(prefixStripped);
	const chatSegment = keepLegacyGroupPrefix ? `group:${normalizedChatId}` : normalizedChatId;
	if (parsed.messageThreadId == null) return chatSegment;
	return `${chatSegment}${hasTopicSuffix ? `:topic:${parsed.messageThreadId}` : `:${parsed.messageThreadId}`}`;
}
function normalizeTelegramMessagingTarget(raw) {
	const normalizedBody = normalizeTelegramTargetBody(raw);
	if (!normalizedBody) return;
	return normalizeLowercaseStringOrEmpty(`telegram:${normalizedBody}`);
}
function looksLikeTelegramTargetId(raw) {
	return normalizeTelegramTargetBody(raw) !== void 0;
}
//#endregion
//#region extensions/telegram/src/startup-probe-limiter.ts
const TELEGRAM_STARTUP_PROBE_CONCURRENCY = 2;
let activeStartupProbes = 0;
const pendingStartupProbeWaiters = [];
function buildStartupProbeAbortError() {
	return /* @__PURE__ */ new Error("telegram startup probe wait aborted");
}
function detachAbortHandler(waiter) {
	if (!waiter.abortSignal || !waiter.onAbort) return;
	waiter.abortSignal.removeEventListener("abort", waiter.onAbort);
}
function removePendingWaiter(waiter) {
	const index = pendingStartupProbeWaiters.indexOf(waiter);
	if (index >= 0) pendingStartupProbeWaiters.splice(index, 1);
}
function releaseStartupProbeSlot() {
	activeStartupProbes = Math.max(0, activeStartupProbes - 1);
	drainStartupProbeWaiters();
}
function drainStartupProbeWaiters() {
	while (activeStartupProbes < TELEGRAM_STARTUP_PROBE_CONCURRENCY && pendingStartupProbeWaiters.length > 0) {
		const waiter = pendingStartupProbeWaiters.shift();
		if (!waiter) return;
		detachAbortHandler(waiter);
		if (waiter.abortSignal?.aborted) {
			waiter.reject(buildStartupProbeAbortError());
			continue;
		}
		activeStartupProbes += 1;
		waiter.resolve(releaseStartupProbeSlot);
	}
}
async function acquireStartupProbeSlot(abortSignal) {
	if (abortSignal?.aborted) throw buildStartupProbeAbortError();
	if (activeStartupProbes < TELEGRAM_STARTUP_PROBE_CONCURRENCY) {
		activeStartupProbes += 1;
		return releaseStartupProbeSlot;
	}
	return await new Promise((resolve, reject) => {
		const waiter = {
			resolve,
			reject,
			...abortSignal ? { abortSignal } : {}
		};
		waiter.onAbort = () => {
			removePendingWaiter(waiter);
			reject(buildStartupProbeAbortError());
		};
		abortSignal?.addEventListener("abort", waiter.onAbort, { once: true });
		pendingStartupProbeWaiters.push(waiter);
	});
}
async function withTelegramStartupProbeSlot(abortSignal, run) {
	const release = await acquireStartupProbeSlot(abortSignal);
	try {
		if (abortSignal?.aborted) throw buildStartupProbeAbortError();
		return await run();
	} finally {
		release();
	}
}
//#endregion
//#region extensions/telegram/src/status-issues.ts
const TELEGRAM_POLLING_CONNECT_GRACE_MS = 12e4;
const TELEGRAM_POLLING_STALE_TRANSPORT_MS = 30 * 6e4;
const TELEGRAM_WEBHOOK_CONNECT_GRACE_MS = 12e4;
function readTelegramAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		configured: value.configured,
		running: value.running,
		connected: value.connected,
		mode: value.mode,
		lastStartAt: value.lastStartAt,
		lastTransportActivityAt: value.lastTransportActivityAt,
		lastError: value.lastError,
		allowUnmentionedGroups: value.allowUnmentionedGroups,
		audit: value.audit
	};
}
function asFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function appendTelegramRuntimeError(message, lastError) {
	const error = asString(lastError);
	return error ? `${message}: ${error}` : message;
}
function isTelegramPollingBacklogStallError(lastError) {
	const error = asString(lastError);
	return Boolean(error?.includes("isolated polling spool backlog stalled") || error?.includes("isolated polling spool handler timed out"));
}
function collectTelegramPollingRuntimeIssues(params) {
	const { account, accountId, issues, now } = params;
	if (account.running !== true || asString(account.mode) !== "polling") return;
	const lastStartAt = asFiniteNumber(account.lastStartAt);
	const lastTransportActivityAt = asFiniteNumber(account.lastTransportActivityAt);
	const fix = `Run: ${formatCliCommand("openclaw channels status --probe")} (or restart the gateway). Check the bot token, proxy/network settings, and logs if it persists.`;
	if (account.connected === false) {
		if (!(lastStartAt != null && now - lastStartAt < TELEGRAM_POLLING_CONNECT_GRACE_MS)) {
			const message = isTelegramPollingBacklogStallError(account.lastError) ? "Telegram isolated polling spool backlog is stalled while Bot API polling is still succeeding" : "Telegram polling is running but has not completed a successful getUpdates call since startup";
			issues.push({
				channel: "telegram",
				accountId,
				kind: "runtime",
				message: appendTelegramRuntimeError(message, account.lastError),
				fix
			});
		}
		return;
	}
	if (account.connected === true && lastTransportActivityAt != null) {
		if (lastStartAt != null && lastTransportActivityAt < lastStartAt) {
			if (Math.max(0, now - lastStartAt) <= TELEGRAM_POLLING_STALE_TRANSPORT_MS) return;
		}
		const ageMs = now - lastTransportActivityAt;
		if (ageMs > TELEGRAM_POLLING_STALE_TRANSPORT_MS) issues.push({
			channel: "telegram",
			accountId,
			kind: "runtime",
			message: appendTelegramRuntimeError(`Telegram polling transport is stale (last successful getUpdates ${Math.max(0, Math.floor(ageMs / 6e4))}m ago)`, account.lastError),
			fix
		});
	}
}
function collectTelegramWebhookRuntimeIssues(params) {
	const { account, accountId, issues, now } = params;
	if (account.running !== true || asString(account.mode) !== "webhook") return;
	if (account.connected !== false) return;
	const lastStartAt = asFiniteNumber(account.lastStartAt);
	if (lastStartAt != null && now - lastStartAt < TELEGRAM_WEBHOOK_CONNECT_GRACE_MS) return;
	issues.push({
		channel: "telegram",
		accountId,
		kind: "runtime",
		message: appendTelegramRuntimeError("Telegram webhook listener is running but setWebhook has not completed since startup", account.lastError),
		fix: `Run: ${formatCliCommand("openclaw channels status --probe")} (or restart the gateway). Check the webhook URL, secret, TLS/proxy reachability, and Telegram setWebhook logs if it persists.`
	});
}
function readTelegramGroupMembershipAuditSummary(value) {
	if (!isRecord(value)) return {};
	const unresolvedGroups = typeof value.unresolvedGroups === "number" && Number.isFinite(value.unresolvedGroups) ? value.unresolvedGroups : void 0;
	const hasWildcardUnmentionedGroups = typeof value.hasWildcardUnmentionedGroups === "boolean" ? value.hasWildcardUnmentionedGroups : void 0;
	const groupsRaw = value.groups;
	return {
		unresolvedGroups,
		hasWildcardUnmentionedGroups,
		groups: Array.isArray(groupsRaw) ? groupsRaw.map((entry) => {
			if (!isRecord(entry)) return null;
			const chatId = asString(entry.chatId);
			if (!chatId) return null;
			return {
				chatId,
				ok: typeof entry.ok === "boolean" ? entry.ok : void 0,
				status: asString(entry.status) ?? null,
				error: asString(entry.error) ?? null,
				matchKey: asString(entry.matchKey) ?? void 0,
				matchSource: asString(entry.matchSource) ?? void 0
			};
		}).filter(Boolean) : void 0
	};
}
function collectTelegramStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readTelegramAccountStatus(entry);
		if (!account) continue;
		const accountId = resolveEnabledConfiguredAccountId(account);
		if (!accountId) continue;
		const now = Date.now();
		collectTelegramPollingRuntimeIssues({
			account,
			accountId,
			issues,
			now
		});
		collectTelegramWebhookRuntimeIssues({
			account,
			accountId,
			issues,
			now
		});
		if (account.allowUnmentionedGroups === true) issues.push({
			channel: "telegram",
			accountId,
			kind: "config",
			message: "Config allows unmentioned group messages (requireMention=false). Telegram Bot API privacy mode will block most group messages unless disabled.",
			fix: "In BotFather run /setprivacy → Disable for this bot (then restart the gateway)."
		});
		const audit = readTelegramGroupMembershipAuditSummary(account.audit);
		if (audit.hasWildcardUnmentionedGroups === true) issues.push({
			channel: "telegram",
			accountId,
			kind: "config",
			message: "Telegram groups config uses \"*\" with requireMention=false; membership probing is not possible without explicit group IDs.",
			fix: "Add explicit numeric group ids under channels.telegram.groups (or per-account groups) to enable probing."
		});
		if (audit.unresolvedGroups && audit.unresolvedGroups > 0) issues.push({
			channel: "telegram",
			accountId,
			kind: "config",
			message: `Some configured Telegram groups are not numeric IDs (unresolvedGroups=${audit.unresolvedGroups}). Membership probe can only check numeric group IDs.`,
			fix: "Use numeric chat IDs (e.g. -100...) as keys in channels.telegram.groups for requireMention=false groups."
		});
		for (const group of audit.groups ?? []) {
			if (group.ok === true) continue;
			const status = group.status ? ` status=${group.status}` : "";
			const err = group.error ? `: ${group.error}` : "";
			const baseMessage = `Group ${group.chatId} not reachable by bot.${status}${err}`;
			issues.push({
				channel: "telegram",
				accountId,
				kind: "runtime",
				message: appendMatchMetadata(baseMessage, {
					matchKey: group.matchKey,
					matchSource: group.matchSource
				}),
				fix: "Invite the bot to the group, then DM the bot once (/start) and restart the gateway."
			});
		}
	}
	return issues;
}
//#endregion
//#region extensions/telegram/src/threading-tool-context.ts
function resolveTelegramToolContextThreadId(context) {
	if (context.MessageThreadId != null) return String(context.MessageThreadId);
	const currentChannelId = normalizeOptionalString(context.To);
	if (!currentChannelId) return;
	const parsedTarget = parseTelegramTarget(currentChannelId);
	return parsedTarget.messageThreadId != null ? String(parsedTarget.messageThreadId) : void 0;
}
function buildTelegramThreadingToolContext(params) {
	params.cfg;
	params.accountId;
	return {
		currentChannelId: normalizeOptionalString(params.context.To),
		currentThreadTs: resolveTelegramToolContextThreadId(params.context),
		hasRepliedRef: params.hasRepliedRef
	};
}
//#endregion
//#region extensions/telegram/src/channel.ts
let telegramUpdateOffsetRuntimePromise;
async function loadTelegramUpdateOffsetRuntime() {
	telegramUpdateOffsetRuntimePromise ??= import("./extensions/telegram/update-offset-runtime-api.js");
	return await telegramUpdateOffsetRuntimePromise;
}
function resolveTelegramProbe() {
	return getOptionalTelegramRuntime()?.channel?.telegram?.probeTelegram ?? probeTelegram;
}
async function readStartupBotInfoCache(params) {
	try {
		return (await readCachedTelegramBotInfo({
			accountId: params.accountId,
			botToken: params.token
		}))?.botInfo;
	} catch (err) {
		if (getTelegramRuntime().logging.shouldLogVerbose()) params.log?.debug?.(`[${params.accountId}] bot info cache read failed: ${String(err)}`);
		return;
	}
}
async function writeStartupBotInfoCache(params) {
	try {
		await writeCachedTelegramBotInfo({
			accountId: params.accountId,
			botToken: params.token,
			botInfo: params.botInfo
		});
	} catch (err) {
		if (getTelegramRuntime().logging.shouldLogVerbose()) params.log?.debug?.(`[${params.accountId}] bot info cache write failed: ${String(err)}`);
	}
}
async function deleteStartupBotInfoCache(accountId) {
	await deleteCachedTelegramBotInfo({ accountId }).catch(() => void 0);
}
function resolveTelegramAuditCollector() {
	return getOptionalTelegramRuntime()?.channel?.telegram?.collectTelegramUnmentionedGroupIds ?? collectTelegramUnmentionedGroupIds;
}
function resolveTelegramAuditMembership() {
	return getOptionalTelegramRuntime()?.channel?.telegram?.auditTelegramGroupMembership ?? auditTelegramGroupMembership;
}
function resolveTelegramMonitor() {
	return getOptionalTelegramRuntime()?.channel?.telegram?.monitorTelegramProvider ?? monitorTelegramProvider;
}
function formatTelegramUnauthorizedTokenError(account) {
	const source = account.tokenSource === "none" ? "no configured token" : `${account.tokenSource} token`;
	const credentialPath = account.accountId === "default" ? "channels.telegram.botToken, channels.telegram.tokenFile, or TELEGRAM_BOT_TOKEN" : `channels.telegram.accounts.${account.accountId}.botToken/tokenFile`;
	return `Telegram bot token unauthorized for account "${account.accountId}" (getMe returned 401 from Telegram; source: ${source}). Update ${credentialPath} with the current BotFather token.`;
}
function getOptionalTelegramRuntime() {
	try {
		return getTelegramRuntime();
	} catch {
		return null;
	}
}
async function resolveTelegramSend(deps) {
	return resolveOutboundSendDep(deps, "telegram") ?? getOptionalTelegramRuntime()?.channel?.telegram?.sendMessageTelegram ?? (await loadTelegramSendModule()).sendMessageTelegram;
}
function resolveTelegramTokenHelper() {
	return getOptionalTelegramRuntime()?.channel?.telegram?.resolveTelegramToken ?? resolveTelegramToken;
}
const telegramChannelOutbound = createTelegramOutboundAdapter({
	resolveSend: resolveTelegramSend,
	loadSendModule: loadTelegramSendModule,
	shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload }) => shouldSuppressLocalTelegramExecApprovalPrompt({
		cfg,
		accountId,
		payload
	}),
	beforeDeliverPayload: async ({ cfg, target, hint }) => {
		if (hint?.kind !== "approval-pending" || hint.approvalKind !== "exec") return;
		const threadId = typeof target.threadId === "number" ? target.threadId : typeof target.threadId === "string" ? parseTelegramThreadId(target.threadId) : void 0;
		const { sendTypingTelegram } = await loadTelegramSendModule();
		await sendTypingTelegram(target.to, {
			cfg,
			accountId: target.accountId ?? void 0,
			...threadId !== void 0 ? { messageThreadId: threadId } : {}
		}).catch(() => {});
	},
	shouldTreatDeliveredTextAsVisible: shouldTreatTelegramDeliveredTextAsVisible,
	targetsMatchForReplySuppression: targetsMatchTelegramReplySuppression,
	preferFinalAssistantVisibleText: true
});
const telegramMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "telegram",
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true
		},
		finalizer: { capabilities: {
			finalEdit: true,
			normalFallback: true,
			previewReceipt: true,
			retainOnAmbiguousFailure: true
		} }
	},
	receive: {
		defaultAckPolicy: "after_agent_dispatch",
		supportedAckPolicies: ["after_receive_record", "after_agent_dispatch"]
	},
	outbound: telegramChannelOutbound
});
const telegramMessageActions = {
	resolveExecutionMode: (ctx) => getOptionalTelegramRuntime()?.channel?.telegram?.messageActions?.resolveExecutionMode?.(ctx) ?? telegramMessageActions$1.resolveExecutionMode?.(ctx) ?? "gateway",
	describeMessageTool: (ctx) => getOptionalTelegramRuntime()?.channel?.telegram?.messageActions?.describeMessageTool?.(ctx) ?? telegramMessageActions$1.describeMessageTool?.(ctx) ?? null,
	resolveCliActionRequest: (ctx) => getOptionalTelegramRuntime()?.channel?.telegram?.messageActions?.resolveCliActionRequest?.(ctx) ?? telegramMessageActions$1.resolveCliActionRequest?.(ctx) ?? {
		action: ctx.action,
		args: ctx.args
	},
	extractToolSend: (ctx) => getOptionalTelegramRuntime()?.channel?.telegram?.messageActions?.extractToolSend?.(ctx) ?? telegramMessageActions$1.extractToolSend?.(ctx) ?? null,
	isToolDeliveryAction: (ctx) => getOptionalTelegramRuntime()?.channel?.telegram?.messageActions?.isToolDeliveryAction?.(ctx) ?? telegramMessageActions$1.isToolDeliveryAction?.(ctx) ?? false,
	handleAction: async (ctx) => {
		const runtimeHandleAction = getOptionalTelegramRuntime()?.channel?.telegram?.messageActions?.handleAction;
		if (runtimeHandleAction) return await runtimeHandleAction(ctx);
		if (!telegramMessageActions$1.handleAction) throw new Error("Telegram message actions not available");
		return await telegramMessageActions$1.handleAction(ctx);
	}
};
function normalizeTelegramAcpConversationId(conversationId) {
	const parsed = parseTelegramTopicConversation({ conversationId });
	if (!parsed || !parsed.chatId.startsWith("-")) return null;
	return {
		conversationId: parsed.canonicalConversationId,
		parentConversationId: parsed.chatId
	};
}
function matchTelegramAcpConversation(params) {
	const binding = normalizeTelegramAcpConversationId(params.bindingConversationId);
	if (!binding) return null;
	const incoming = parseTelegramTopicConversation({
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	if (!incoming || !incoming.chatId.startsWith("-")) return null;
	if (binding.conversationId !== incoming.canonicalConversationId) return null;
	return {
		conversationId: incoming.canonicalConversationId,
		parentConversationId: incoming.chatId,
		matchPriority: 2
	};
}
function shouldTreatTelegramDeliveredTextAsVisible(params) {
	params.text;
	return params.kind !== "final";
}
function targetsMatchTelegramReplySuppression(params) {
	const origin = parseTelegramTarget(params.originTarget);
	const target = parseTelegramTarget(params.targetKey);
	const originThreadId = origin.messageThreadId != null && normalizeOptionalString(String(origin.messageThreadId)) ? normalizeOptionalString(String(origin.messageThreadId)) : void 0;
	const targetThreadId = normalizeOptionalString(params.targetThreadId) || (target.messageThreadId != null && normalizeOptionalString(String(target.messageThreadId)) ? normalizeOptionalString(String(target.messageThreadId)) : void 0);
	if (normalizeOptionalLowercaseString(origin.chatId) !== normalizeOptionalLowercaseString(target.chatId)) return false;
	if (originThreadId && targetThreadId) return originThreadId === targetThreadId;
	return originThreadId == null && targetThreadId == null;
}
function resolveTelegramCommandConversation(params) {
	const chatId = [
		params.originatingTo,
		params.commandTo,
		params.fallbackTo
	].map((candidate) => {
		const trimmed = normalizeOptionalString(candidate) ?? "";
		return trimmed ? normalizeOptionalString(parseTelegramTarget(trimmed).chatId) ?? "" : "";
	}).find((candidate) => candidate.length > 0);
	if (!chatId) return null;
	if (params.threadId) return {
		conversationId: `${chatId}:topic:${params.threadId}`,
		parentConversationId: chatId
	};
	if (chatId.startsWith("-")) return null;
	return {
		conversationId: chatId,
		parentConversationId: chatId
	};
}
function resolveTelegramInboundConversation(params) {
	const rawTarget = normalizeOptionalString(params.to) ?? normalizeOptionalString(params.conversationId) ?? "";
	if (!rawTarget) return null;
	const parsedTarget = parseTelegramTarget(rawTarget);
	const chatId = normalizeOptionalString(parsedTarget.chatId) ?? "";
	if (!chatId) return null;
	const threadId = parsedTarget.messageThreadId != null ? String(parsedTarget.messageThreadId) : params.threadId != null ? normalizeOptionalString(String(params.threadId)) : void 0;
	if (threadId) {
		const parsedTopic = parseTelegramTopicConversation({
			conversationId: threadId,
			parentConversationId: chatId
		});
		if (!parsedTopic) return null;
		return {
			conversationId: parsedTopic.canonicalConversationId,
			parentConversationId: parsedTopic.chatId
		};
	}
	return {
		conversationId: chatId,
		parentConversationId: chatId
	};
}
function resolveTelegramDeliveryTarget(params) {
	const parsedTopic = parseTelegramTopicConversation({
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	if (parsedTopic) return {
		to: parsedTopic.chatId,
		threadId: parsedTopic.topicId
	};
	const parsedTarget = parseTelegramTarget(params.parentConversationId?.trim() || params.conversationId);
	if (!parsedTarget.chatId.trim()) return null;
	return {
		to: parsedTarget.chatId,
		...parsedTarget.messageThreadId != null ? { threadId: String(parsedTarget.messageThreadId) } : {}
	};
}
function resolveTelegramRouteTarget(raw) {
	const target = parseTelegramTarget(raw);
	return {
		to: target.chatId,
		threadId: target.messageThreadId,
		chatType: target.chatType === "unknown" ? void 0 : target.chatType
	};
}
function shouldStripTelegramThreadFromAnnounceOrigin(params) {
	const requesterChannel = normalizeOptionalLowercaseString(params.requester.channel);
	if (requesterChannel && requesterChannel !== "telegram") return true;
	const requesterTo = params.requester.to?.trim();
	if (!requesterTo) return false;
	if (!requesterChannel && !requesterTo.startsWith("telegram:")) return true;
	const requesterTarget = resolveTelegramRouteTarget(requesterTo);
	if (requesterTarget.chatType !== "group") return true;
	const entryTo = params.entry.to?.trim();
	if (!entryTo) return false;
	return resolveTelegramRouteTarget(entryTo).to !== requesterTarget.to;
}
function resolveTelegramOutboundSessionRoute(params) {
	const parsed = parseTelegramTarget(params.target);
	const chatId = parsed.chatId.trim();
	if (!chatId) return null;
	const resolvedThreadId = parsed.messageThreadId ?? parseTelegramThreadId(params.threadId);
	const isGroup = parsed.chatType === "group" || parsed.chatType === "unknown" && params.resolvedTarget?.kind && params.resolvedTarget.kind !== "user";
	const peerId = isGroup && resolvedThreadId ? buildTelegramGroupPeerId(chatId, resolvedThreadId) : chatId;
	const peer = {
		kind: isGroup ? "group" : "direct",
		id: peerId
	};
	const baseRoute = buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "telegram",
		accountId: params.accountId,
		peer,
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `telegram:group:${peerId}` : resolvedThreadId ? `telegram:${chatId}:topic:${resolvedThreadId}` : `telegram:${chatId}`,
		to: `telegram:${chatId}`,
		...isGroup && resolvedThreadId !== void 0 ? { threadId: resolvedThreadId } : {}
	});
	if (isGroup) return baseRoute;
	const route = buildThreadAwareOutboundSessionRoute({
		route: baseRoute,
		threadId: resolvedThreadId !== void 0 ? buildTelegramCanonicalTopicThreadId({
			chatId,
			topicId: resolvedThreadId
		}) : void 0,
		currentSessionKey: params.currentSessionKey,
		precedence: ["threadId", "currentSession"],
		canRecoverCurrentThread: ({ route: routeLocal }) => routeLocal.chatType !== "direct" || (params.cfg.session?.dmScope ?? "main") !== "main"
	});
	const routeThreadId = resolveTelegramNativeTopicThreadId(route.threadId, resolvedThreadId);
	return {
		...route,
		...routeThreadId !== void 0 ? { threadId: routeThreadId } : {},
		from: routeThreadId !== void 0 ? `telegram:${chatId}:topic:${routeThreadId}` : `telegram:${chatId}`
	};
}
function buildTelegramCanonicalTopicThreadId(params) {
	return `${params.chatId}:${params.topicId}`;
}
function resolveTelegramNativeTopicThreadId(threadId, nativeTopicId) {
	if (nativeTopicId !== void 0) return nativeTopicId;
	if (threadId === void 0) return;
	const parsedThreadId = parseTelegramThreadId(threadId);
	if (parsedThreadId !== void 0) return parsedThreadId;
	if (typeof threadId === "string") {
		const canonicalMatch = /:(\d+)$/.exec(threadId.trim());
		if (canonicalMatch?.[1]) return Number(canonicalMatch[1]);
	}
	return threadId;
}
async function resolveTelegramTargets(params) {
	if (params.kind !== "user") return params.inputs.map((input) => ({
		input,
		resolved: false,
		note: "Telegram runtime target resolution only supports usernames for direct-message lookups."
	}));
	const account = resolveTelegramAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const token = account.token.trim();
	if (!token) return params.inputs.map((input) => ({
		input,
		resolved: false,
		note: "Telegram bot token is required to resolve @username targets."
	}));
	return await Promise.all(params.inputs.map(async (input) => {
		const trimmed = input.trim();
		if (!trimmed) return {
			input,
			resolved: false,
			note: "Telegram target is required."
		};
		const normalized = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
		try {
			const id = await lookupTelegramChatId({
				token,
				chatId: normalized,
				network: account.config.network
			});
			if (!id) return {
				input,
				resolved: false,
				note: "Telegram username could not be resolved by the configured bot."
			};
			return {
				input,
				resolved: true,
				id,
				name: normalized
			};
		} catch (error) {
			return {
				input,
				resolved: false,
				note: formatErrorMessage(error)
			};
		}
	}));
}
const resolveTelegramAllowlistGroupOverrides = createNestedAllowlistOverrideResolver({
	resolveRecord: (account) => account.config.groups,
	outerLabel: (groupId) => groupId,
	resolveOuterEntries: (groupCfg) => groupCfg?.allowFrom,
	resolveChildren: (groupCfg) => groupCfg?.topics,
	innerLabel: (groupId, topicId) => `${groupId} topic ${topicId}`,
	resolveInnerEntries: (topicCfg) => topicCfg?.allowFrom
});
const telegramPlugin = createChatChannelPlugin({
	base: {
		...createTelegramPluginBase({
			setupWizard: telegramSetupWizard,
			setup: telegramSetupAdapter
		}),
		allowlist: buildDmGroupAccountAllowlistAdapter({
			channelId: "telegram",
			resolveAccount: resolveTelegramAccount,
			normalize: ({ cfg, accountId, values }) => telegramConfigAdapter.formatAllowFrom({
				cfg,
				accountId,
				allowFrom: values
			}),
			resolveDmAllowFrom: (account) => account.config.allowFrom,
			resolveGroupAllowFrom: (account) => account.config.groupAllowFrom,
			resolveDmPolicy: (account) => account.config.dmPolicy,
			resolveGroupPolicy: (account) => account.config.groupPolicy,
			resolveGroupOverrides: resolveTelegramAllowlistGroupOverrides
		}),
		bindings: {
			selfParentConversationByDefault: true,
			compileConfiguredBinding: ({ conversationId }) => normalizeTelegramAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => matchTelegramAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId,
				parentConversationId
			}),
			resolveCommandConversation: ({ threadId, originatingTo, commandTo, fallbackTo }) => resolveTelegramCommandConversation({
				threadId,
				originatingTo,
				commandTo,
				fallbackTo
			})
		},
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			defaultTopLevelPlacement: "current",
			resolveConversationRef: ({ accountId: _accountId, conversationId, parentConversationId, threadId }) => resolveTelegramInboundConversation({
				to: parentConversationId ?? conversationId,
				conversationId,
				threadId: threadId ?? void 0
			}),
			buildBoundReplyPayload: ({ operation, conversation }) => {
				if (operation !== "acp-spawn") return null;
				return conversation.conversationId.includes(":topic:") ? { delivery: { pin: {
					enabled: true,
					notify: false
				} } } : null;
			},
			shouldStripThreadFromAnnounceOrigin: shouldStripTelegramThreadFromAnnounceOrigin,
			createManager: ({ cfg, accountId }) => createTelegramThreadBindingManager({
				cfg,
				accountId: accountId ?? void 0,
				persist: false,
				enableSweeper: false
			}),
			setIdleTimeoutBySessionKey: ({ targetSessionKey, accountId, idleTimeoutMs }) => setTelegramThreadBindingIdleTimeoutBySessionKey({
				targetSessionKey,
				accountId: accountId ?? void 0,
				idleTimeoutMs
			}),
			setMaxAgeBySessionKey: ({ targetSessionKey, accountId, maxAgeMs }) => setTelegramThreadBindingMaxAgeBySessionKey({
				targetSessionKey,
				accountId: accountId ?? void 0,
				maxAgeMs
			})
		},
		groups: {
			resolveRequireMention: resolveTelegramGroupRequireMention,
			resolveToolPolicy: resolveTelegramGroupToolPolicy
		},
		agentPrompt: {
			messageToolCapabilities: ({ cfg, accountId }) => {
				const capabilities = resolveTelegramInlineButtonsScope({
					cfg,
					accountId: accountId ?? void 0
				}) === "off" ? [] : ["inlineButtons"];
				if (mergeTelegramAccountConfig(cfg, accountId ?? resolveDefaultTelegramAccountId(cfg)).richMessages === true) capabilities.push("richText");
				return capabilities;
			},
			reactionGuidance: ({ cfg, accountId }) => {
				const level = resolveTelegramReactionLevel({
					cfg,
					accountId: accountId ?? void 0
				}).agentReactionGuidance;
				return level ? {
					level,
					channelLabel: "Telegram"
				} : void 0;
			}
		},
		messaging: {
			defaultMarkdownTableMode: "block",
			targetPrefixes: ["telegram", "tg"],
			normalizeTarget: normalizeTelegramMessagingTarget,
			resolveInboundConversation: ({ to, conversationId, threadId }) => resolveTelegramInboundConversation({
				to,
				conversationId,
				threadId
			}),
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => resolveTelegramDeliveryTarget({
				conversationId,
				parentConversationId
			}),
			resolveSessionConversation: ({ kind, rawId }) => resolveTelegramSessionConversation({
				kind,
				rawId
			}),
			resolveSessionTarget: ({ kind, id }) => resolveTelegramSessionTarget({
				kind,
				id
			}),
			inferTargetChatType: ({ to }) => resolveTelegramRouteTarget(to).chatType,
			preserveHeartbeatThreadIdForGroupRoute: true,
			formatTargetDisplay: ({ target, display, kind }) => {
				const formatted = display?.trim();
				if (formatted) return formatted;
				const trimmedTarget = target.trim();
				if (!trimmedTarget) return trimmedTarget;
				const withoutProvider = trimmedTarget.replace(/^(telegram|tg):/i, "");
				if (kind === "user" || /^user:/i.test(withoutProvider)) return `@${withoutProvider.replace(/^user:/i, "")}`;
				if (/^channel:/i.test(withoutProvider)) return `#${withoutProvider.replace(/^channel:/i, "")}`;
				return withoutProvider;
			},
			resolveOutboundSessionRoute: (params) => resolveTelegramOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeTelegramTargetId,
				hint: "<chatId>"
			}
		},
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind }) => await resolveTelegramTargets({
			cfg,
			accountId,
			inputs,
			kind
		}) },
		lifecycle: {
			detectLegacyStateMigrations: (params) => detectTelegramLegacyStateMigrations(params),
			onAccountConfigChanged: async ({ prevCfg, nextCfg, accountId }) => {
				if (resolveTelegramAccount({
					cfg: prevCfg,
					accountId
				}).token.trim() !== resolveTelegramAccount({
					cfg: nextCfg,
					accountId
				}).token.trim()) {
					const { deleteTelegramUpdateOffset } = await loadTelegramUpdateOffsetRuntime();
					await Promise.all([deleteTelegramUpdateOffset({ accountId }), deleteStartupBotInfoCache(accountId)]);
				}
			},
			onAccountRemoved: async ({ accountId }) => {
				const { deleteTelegramUpdateOffset } = await loadTelegramUpdateOffsetRuntime();
				await Promise.all([deleteTelegramUpdateOffset({ accountId }), deleteStartupBotInfoCache(accountId)]);
			}
		},
		heartbeat: { sendTyping: async ({ cfg, to, accountId, threadId }) => {
			const { sendTypingTelegram } = await loadTelegramSendModule();
			await sendTypingTelegram(to, {
				cfg,
				...accountId ? { accountId } : {},
				messageThreadId: parseTelegramThreadId(threadId)
			});
		} },
		approvalCapability: {
			...telegramApprovalCapability,
			render: { exec: { buildPendingPayload: ({ request, nowMs }) => buildTelegramExecApprovalPendingPayload({
				request,
				nowMs
			}) } }
		},
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => listTelegramDirectoryPeersFromConfig(params),
			listGroups: async (params) => listTelegramDirectoryGroupsFromConfig(params)
		}),
		actions: telegramMessageActions,
		message: telegramMessageAdapter,
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: collectTelegramStatusIssues,
			buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot),
			probeAccount: async ({ account, timeoutMs }) => resolveTelegramProbe()(account.token, timeoutMs, {
				accountId: account.accountId,
				proxyUrl: account.config.proxy,
				network: account.config.network,
				apiRoot: account.config.apiRoot,
				includeWebhookInfo: Boolean(account.config.webhookUrl)
			}),
			formatCapabilitiesProbe: ({ probe }) => {
				const lines = [];
				if (probe?.bot?.username) {
					const botId = probe.bot.id ? ` (${probe.bot.id})` : "";
					lines.push({ text: `Bot: @${probe.bot.username}${botId}` });
				}
				const flags = [];
				if (typeof probe?.bot?.canJoinGroups === "boolean") flags.push(`joinGroups=${probe.bot.canJoinGroups}`);
				if (typeof probe?.bot?.canReadAllGroupMessages === "boolean") flags.push(`readAllGroupMessages=${probe.bot.canReadAllGroupMessages}`);
				if (typeof probe?.bot?.supportsInlineQueries === "boolean") flags.push(`inlineQueries=${probe.bot.supportsInlineQueries}`);
				if (flags.length > 0) lines.push({ text: `Flags: ${flags.join(" ")}` });
				if (probe?.webhook?.url !== void 0) lines.push({ text: `Webhook: ${probe.webhook.url || "none"}` });
				return lines;
			},
			auditAccount: async ({ account, timeoutMs, probe, cfg }) => {
				const groups = cfg.channels?.telegram?.accounts?.[account.accountId]?.groups ?? cfg.channels?.telegram?.groups;
				const { groupIds, unresolvedGroups, hasWildcardUnmentionedGroups } = resolveTelegramAuditCollector()(groups);
				if (!groupIds.length && unresolvedGroups === 0 && !hasWildcardUnmentionedGroups) return;
				const botId = probe?.ok && probe.bot?.id != null ? probe.bot.id : null;
				if (!botId) return {
					ok: unresolvedGroups === 0 && !hasWildcardUnmentionedGroups,
					checkedGroups: 0,
					unresolvedGroups,
					hasWildcardUnmentionedGroups,
					groups: [],
					elapsedMs: 0
				};
				return {
					...await resolveTelegramAuditMembership()({
						token: account.token,
						botId,
						groupIds,
						proxyUrl: account.config.proxy,
						network: account.config.network,
						apiRoot: account.config.apiRoot,
						timeoutMs
					}),
					unresolvedGroups,
					hasWildcardUnmentionedGroups
				};
			},
			resolveAccountSnapshot: ({ account, cfg, runtime, audit }) => {
				const configuredFromStatus = resolveConfiguredFromCredentialStatuses(account);
				const ownerAccountId = findTelegramTokenOwnerAccountId({
					cfg,
					accountId: account.accountId
				});
				const duplicateTokenReason = ownerAccountId ? formatDuplicateTelegramTokenReason({
					accountId: account.accountId,
					ownerAccountId
				}) : null;
				const configured = (configuredFromStatus ?? Boolean(account.token?.trim())) && !ownerAccountId;
				const groups = cfg.channels?.telegram?.accounts?.[account.accountId]?.groups ?? cfg.channels?.telegram?.groups;
				const allowUnmentionedGroups = groups?.["*"]?.requireMention === false || Object.entries(groups ?? {}).some(([key, value]) => key !== "*" && value?.requireMention === false);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: {
						...projectCredentialSnapshotFields(account),
						lastError: runtime?.lastError ?? duplicateTokenReason,
						mode: runtime?.mode ?? (account.config.webhookUrl ? "webhook" : "polling"),
						audit,
						allowUnmentionedGroups
					}
				};
			}
		}),
		gateway: {
			startAccount: async (ctx) => {
				const account = ctx.account;
				const ownerAccountId = findTelegramTokenOwnerAccountId({
					cfg: ctx.cfg,
					accountId: account.accountId
				});
				if (ownerAccountId) {
					const reason = formatDuplicateTelegramTokenReason({
						accountId: account.accountId,
						ownerAccountId
					});
					ctx.log?.error?.(`[${account.accountId}] ${reason}`);
					throw new Error(reason);
				}
				const token = (account.token ?? "").trim();
				let telegramBotLabel = "";
				let unauthorizedTokenReason = null;
				let botInfo;
				try {
					const probe = await withTelegramStartupProbeSlot(ctx.abortSignal, () => resolveTelegramProbe()(token, resolveTelegramStartupProbeTimeoutMs(account.config.timeoutSeconds), {
						accountId: account.accountId,
						proxyUrl: account.config.proxy,
						network: account.config.network,
						apiRoot: account.config.apiRoot,
						includeWebhookInfo: false
					}));
					const username = probe.ok ? probe.bot?.username?.trim() : null;
					if (username) telegramBotLabel = ` (@${username})`;
					botInfo = probe.ok ? probe.botInfo : void 0;
					if (probe.ok && probe.botInfo) await writeStartupBotInfoCache({
						accountId: account.accountId,
						token,
						botInfo: probe.botInfo,
						log: ctx.log
					});
					if (!probe.ok && probe.status === 401) {
						await deleteStartupBotInfoCache(account.accountId);
						unauthorizedTokenReason = formatTelegramUnauthorizedTokenError(account);
					} else if (!probe.ok) {
						botInfo = await readStartupBotInfoCache({
							accountId: account.accountId,
							token,
							log: ctx.log
						});
						if (botInfo) telegramBotLabel = ` (@${botInfo.username})`;
					}
				} catch (err) {
					if (ctx.abortSignal.aborted) return;
					if (getTelegramRuntime().logging.shouldLogVerbose()) ctx.log?.debug?.(`[${account.accountId}] bot probe failed: ${String(err)}`);
					botInfo = await readStartupBotInfoCache({
						accountId: account.accountId,
						token,
						log: ctx.log
					});
					if (botInfo) telegramBotLabel = ` (@${botInfo.username})`;
				}
				if (unauthorizedTokenReason) {
					ctx.log?.error?.(`[${account.accountId}] ${unauthorizedTokenReason}`);
					throw new Error(unauthorizedTokenReason);
				}
				ctx.log?.info(`[${account.accountId}] starting provider${telegramBotLabel}`);
				const setStatus = createAccountStatusSink({
					accountId: account.accountId,
					setStatus: ctx.setStatus
				});
				return resolveTelegramMonitor()({
					token,
					accountId: account.accountId,
					config: ctx.cfg,
					runtime: ctx.runtime,
					channelRuntime: ctx.channelRuntime,
					abortSignal: ctx.abortSignal,
					useWebhook: Boolean(account.config.webhookUrl),
					webhookUrl: account.config.webhookUrl,
					webhookSecret: account.config.webhookSecret,
					webhookPath: account.config.webhookPath,
					webhookHost: account.config.webhookHost,
					webhookPort: account.config.webhookPort,
					webhookCertPath: account.config.webhookCertPath,
					botInfo,
					setStatus
				});
			},
			stopAccount: async ({ account, accountId, log }) => {
				const token = (account.token ?? "").trim();
				if (!token) return;
				if (await releaseStoppedTelegramPollingLease({
					token,
					accountId
				})) log?.info?.(`[${accountId}] released stopped Telegram polling lease`);
			},
			logoutAccount: async ({ accountId, cfg }) => {
				const envToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
				const nextCfg = { ...cfg };
				const nextTelegram = cfg.channels?.telegram ? { ...cfg.channels.telegram } : void 0;
				let cleared = false;
				let changed = false;
				if (nextTelegram) {
					if (accountId === "default" && nextTelegram.botToken) {
						delete nextTelegram.botToken;
						cleared = true;
						changed = true;
					}
					const accountCleanup = clearAccountEntryFields({
						accounts: nextTelegram.accounts,
						accountId,
						fields: ["botToken"]
					});
					if (accountCleanup.changed) {
						changed = true;
						if (accountCleanup.cleared) cleared = true;
						if (accountCleanup.nextAccounts) nextTelegram.accounts = accountCleanup.nextAccounts;
						else delete nextTelegram.accounts;
					}
				}
				if (changed) if (nextTelegram && Object.keys(nextTelegram).length > 0) nextCfg.channels = {
					...nextCfg.channels,
					telegram: nextTelegram
				};
				else {
					const nextChannels = { ...nextCfg.channels };
					delete nextChannels.telegram;
					if (Object.keys(nextChannels).length > 0) nextCfg.channels = nextChannels;
					else delete nextCfg.channels;
				}
				const loggedOut = resolveTelegramAccount({
					cfg: changed ? nextCfg : cfg,
					accountId
				}).tokenSource === "none";
				if (changed) await getTelegramRuntime().config.replaceConfigFile({
					nextConfig: nextCfg,
					afterWrite: { mode: "auto" }
				});
				if (cleared || loggedOut) await deleteStartupBotInfoCache(accountId);
				return {
					cleared,
					envToken: Boolean(envToken),
					loggedOut
				};
			}
		}
	},
	pairing: { text: {
		idLabel: "telegramUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^(telegram|tg):/i),
		notify: async ({ cfg, id, message, accountId }) => {
			const { token } = resolveTelegramTokenHelper()(cfg, { accountId });
			if (!token) throw new Error("telegram token not configured");
			await (await resolveTelegramSend())(id, message, {
				cfg,
				token,
				accountId
			});
		}
	} },
	security: telegramSecurityAdapter,
	threading: {
		topLevelReplyToMode: "telegram",
		buildToolContext: (params) => buildTelegramThreadingToolContext(params),
		resolveAutoThreadId: ({ to, toolContext }) => resolveTelegramAutoThreadId({
			to,
			toolContext
		}),
		resolveCurrentChannelId: ({ to, threadId }) => {
			if (threadId == null) return to;
			return to.includes(":topic:") ? to : `${to}:topic:${threadId}`;
		}
	},
	outbound: telegramChannelOutbound
});
//#endregion
export { resolveTelegramGroupRequireMention as a, normalizeTelegramMessagingTarget as i, collectTelegramStatusIssues as n, resolveTelegramGroupToolPolicy as o, looksLikeTelegramTargetId as r, resolveTelegramAutoThreadId as s, telegramPlugin as t };
