import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { i as readResponseWithLimit } from "./http-response-body-umfRGZ-E.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BoUn0ffV.mjs";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { _ as createChannelMessageAdapterFromOutbound, y as resolveOutboundSendDep } from "./channel-outbound-DBuu65Vg.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { a as buildChannelGroupsScopeTree, d as scopeKey, l as resolveScopeRequireMention, n as resolveChannelGroupRequireMention, u as resolveScopeToolsPolicy } from "./group-policy-BJ7vM7Bm.mjs";
import { o as resolveAgentRoute } from "./resolve-route-Bzb6opva.mjs";
import { E as resolveChannelStreamingPreviewToolProgress, S as resolveChannelStreamingBlockEnabled } from "./streaming-CHnBADiw.mjs";
import { n as makeProxyFetch } from "./proxy-fetch-Dq9J8411.mjs";
import "./fetch-runtime-DT4gd-qk.mjs";
import "./response-limit-runtime-CpfmMF5T.mjs";
import { E as normalizeTelegramApiRoot, T as hasTelegramBotEndpointApiRoot, n as resolveTelegramTransport, t as resolveTelegramFetch } from "./fetch-87l6dlPX.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { i as resolveTelegramStartupProbeTimeoutMs, r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-DI3t2Xdv.mjs";
import { n as collectTelegramUnmentionedGroupIds, t as auditTelegramGroupMembership } from "./audit-pym9s9p7.mjs";
import "./routing-CEr1aXk1.mjs";
import { a as mergeTelegramAccountConfig, r as resolveDefaultTelegramAccountId, s as resolveTelegramLegacyWebhookListener, t as hasTelegramAccountConfig } from "./account-selection-DV4XVSJR.mjs";
import { t as resolveTelegramToken } from "./token-BRhOkLLB.mjs";
import { n as clearAccountFieldsFromConfigSection } from "./config-helpers-Ch_BBBFF.mjs";
import { s as createScopedDmSecurityResolver } from "./channel-config-helpers-BApaQcwN.mjs";
import { a as projectCredentialSnapshotFields } from "./account-snapshot-fields-e1ulxwox.mjs";
import { _ as appendMatchMetadata, b as resolveEnabledConfiguredAccountId, d as createDefaultChannelRuntimeState, o as buildTokenChannelStatusSummary, p as readAccountStatusSnapshot, u as createComputedAccountStatusAdapter } from "./status-helpers-DBzays5X.mjs";
import { c as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-DE7-D4c0.mjs";
import { n as createPairingPrefixStripper } from "./pairing-adapters-Btd3dlBp.mjs";
import { i as createChatChannelPlugin, n as buildThreadAwareOutboundSessionRoute, t as buildChannelOutboundSessionRoute } from "./core-xGEFuUaI.mjs";
import { t as collectChannelAccountScopes } from "./runtime-doctor-migrations-4UZBewWQ.mjs";
import { n as createChannelNativeOriginTargetResolver, t as createChannelApproverDmTargetResolver } from "./approval-native-helpers-thg_F7Ol.mjs";
import { n as createApproverRestrictedNativeApprovalCapability } from "./approval-delivery-helpers-DvYZ5NqF.mjs";
import "./approval-delivery-runtime-CcAeKRhO.mjs";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-Cq3lU0sm.mjs";
import "./approval-native-runtime-u5kQUm6i.mjs";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-Dd-t-Y6W.mjs";
import { t as createPermitPool } from "./permit-pool-D1LtDFRv.mjs";
import "./concurrency-runtime-BTIJsexF.mjs";
import "./conversation-runtime-De-TwUwt.mjs";
import "./gateway-config-runtime-CFClkPZC.mjs";
import { t as channelBlockedPatch } from "./channel-status-patches-ub8Zho4j.mjs";
import "./gateway-runtime-DMDKFL1_.mjs";
import "./cli-runtime-DIoqxVK3.mjs";
import { c as createNestedAllowlistOverrideResolver, n as buildDmGroupAccountAllowlistAdapter } from "./allowlist-config-edit-CqfeygKe.mjs";
import "./extension-shared-GoQu59iC.mjs";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.mjs";
import "./channel-core-D1wGFMvx.mjs";
import "./channel-pairing-BCgNCFWp.mjs";
import { T as createConditionalWarningCollector, w as createAllowlistProviderRouteAllowlistWarningCollector } from "./channel-policy-CVynnhoG.mjs";
import { t as createChannelDirectoryAdapter } from "./directory-adapters-CwR372GJ.mjs";
import "./directory-runtime-DbvDSPEi.mjs";
import "./channel-status-DHJUFmc4.mjs";
import { a as resolveTelegramAccount, i as resolveDefaultTelegramAccountId$1, r as listTelegramAccountIds } from "./accounts-Dt8wbZ2I.mjs";
import { r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "./allow-from-Byf7JKVc.mjs";
import { n as formatDuplicateTelegramTokenReason, r as inspectTelegramAccount, t as findTelegramTokenOwnerAccountId } from "./account-inspect-DoeQ6S2Q.mjs";
import { l as parseTelegramTarget, n as parseTelegramTopicConversation, o as normalizeTelegramChatId, t as buildTelegramConversationId } from "./topic-conversation-C-lzScEI.mjs";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-DxC5jFLQ.mjs";
import { c as telegramMessageToolHints, i as buildTelegramExecApprovalPendingPayload, n as monitorTelegramProvider, o as normalizeTelegramBotInfo, r as releaseStoppedTelegramPollingLease, s as telegramMessageActions, t as probeTelegram } from "./probe-PpZV66P2.mjs";
import { t as resolveTelegramReactionLevel } from "./reaction-level-C4DgvPOZ.mjs";
import { F as looksLikeTelegramTargetId, H as resolveTelegramScopedGroupConfig, I as normalizeTelegramMessagingTarget, L as telegramMessagingTargetsMatch, U as resolveTelegramRichMessages } from "./text-chunk-limit-BgiLU1vv.mjs";
import { c as resolveTelegramExecApprovalTarget, d as shouldSuppressLocalTelegramExecApprovalPrompt, i as isTelegramExecApprovalClientEnabled, l as shouldHandleTelegramExecApprovalRequest, n as isTelegramExecApprovalApprover, o as isTelegramExecApprovalTargetRecipient, r as isTelegramExecApprovalAuthorizedSender, t as getTelegramExecApprovalApprovers } from "./exec-approvals-TtO1u3Q-.mjs";
import { C as resolveTelegramPreviewStreamMode, K as parseTelegramThreadId, s as buildTelegramRoutingTarget } from "./helpers-DLD_tZ6z.mjs";
import { n as getTelegramRuntime, t as getOptionalTelegramRuntime } from "./runtime-Cw8emHLA.mjs";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.mjs";
import { t as fingerprintTelegramBotToken } from "./token-fingerprint-B7BuFilz.mjs";
import { a as resolveTelegramConfigAccessorAccount, i as telegramSetupContract, n as createTelegramSetupPluginBase, o as telegramConfigAdapter, r as telegramSetupWizard } from "./channel.setup-D46YCNvG.mjs";
import { n as resolveTelegramConversationBaseSessionKey, s as resolveTelegramSecurityDmRoute, t as inspectTelegramConversationRoute } from "./conversation-route-EwisSepA.mjs";
import { n as listTelegramDirectoryPeersFromConfig, t as listTelegramDirectoryGroupsFromConfig } from "./directory-config-BdZhpY_c.mjs";
import { t as createTelegramOutboundAdapter } from "./outbound-adapter-cuzdEMR2.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-CECbxi5D.mjs";
import { t as collectTelegramSecurityAuditFindings } from "./security-audit-Co-kGgqX.mjs";
import { n as resolveTelegramSessionTarget, t as resolveTelegramSessionConversation } from "./session-conversation-NDWYoBYl.mjs";
import { a as buildTelegramModelsListChannelData, i as buildTelegramModelsAddProviderChannelData, n as buildTelegramCommandsListChannelData, o as buildTelegramModelsProviderChannelData, r as buildTelegramModelBrowseChannelData } from "./command-ui-BWxzbSOj.mjs";
import { r as resolveTelegramWebhookPathConflict } from "./webhook-route-DWBIkdIz.mjs";
import { n as legacyConfigRules, r as normalizeCompatibilityConfig } from "./doctor-contract-DErtxKOA.mjs";
import { a as setTelegramThreadBindingMaxAgeBySessionKey, i as setTelegramThreadBindingIdleTimeoutBySessionKeyAsync, o as setTelegramThreadBindingMaxAgeBySessionKeyAsync, r as setTelegramThreadBindingIdleTimeoutBySessionKey, t as createTelegramThreadBindingManager } from "./thread-bindings-UwGMIsGs.mjs";
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
//#region extensions/telegram/src/agent-prompt.ts
const telegramAgentPrompt = {
	messageToolHints: telegramMessageToolHints,
	messageToolCapabilities: ({ cfg, accountId }) => {
		return resolveTelegramInlineButtonsScope({
			cfg,
			accountId: accountId ?? void 0
		}) === "off" ? [] : ["inlineButtons"];
	},
	inboundFormattingHints: ({ cfg, accountId }) => {
		if (resolveTelegramRichMessages({
			cfg,
			accountId
		})) return {
			text_markup: "markdown_telegram_rich",
			rules: [
				"Telegram rich ON (Bot API 10.3 blocks; OpenClaw maps markdown + these HTML islands to typed blocks).",
				"Supported: headings, tables (markdown, or `<table>` HTML for caption/colspan/rowspan/align), block/pull quotes (`<aside>` + `<cite>`), `<details><summary>` (+`open`), dividers `<hr/>`, sup/sub/mark/spoilers, `<ul>`/`<ol>` + `<input type=\"checkbox\" checked/>` tasks, code, anchors `<a name=\"x\"></a>` + `<a href=\"#x\">label</a>`, custom emoji `<tg-emoji emoji-id=\"...\">`, maps `<tg-map lat=\"\" long=\"\" zoom=\"\"/>`, collages/slideshows `<tg-collage>`/`<tg-slideshow>`, block media e.g. `<img src=\"https://...\"/>` (+`<figure>`/`<figcaption>`).",
				"Math: `<tg-math>` inline, `<tg-math-block>` block; never `$...$`/`\\(...\\)`.",
				"Not MarkdownV2/parse_mode.",
				"Collapse=`<details>` (not expandable blockquote); structured bullets=`<ul><li>` (not literal bullets).",
				"Media https URLs only, block-level only, captions/credits when useful; buttons plain text; normal files via attachments."
			]
		};
		return {
			text_markup: "markdown",
			rules: ["Telegram rich OFF. Standard Telegram formatting only; no rich tables/details/block media/formulas.", "Owner can enable `richMessages` for this Telegram account."]
		};
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
};
//#endregion
//#region extensions/telegram/src/api-fetch.ts
const TELEGRAM_BOT_API_MAX_RESPONSE_BYTES = 4194304;
function resolveTelegramChatLookupFetch(params) {
	const proxyUrl = params?.proxyUrl?.trim();
	const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
	return resolveTelegramFetch(proxyFetch, { network: params?.network });
}
async function lookupTelegramChatId(params) {
	const proxyUrl = params.proxyUrl?.trim();
	const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
	const transport = resolveTelegramTransport(proxyFetch, { network: params.network });
	try {
		return await fetchTelegramChatId({
			token: params.token,
			chatId: params.chatId,
			signal: params.signal,
			apiRoot: params.apiRoot,
			timeoutSeconds: params.timeoutSeconds,
			fetchImpl: transport.fetch
		});
	} finally {
		await transport.close();
	}
}
async function fetchTelegramChatId(params) {
	const url = `${normalizeTelegramApiRoot(params.apiRoot)}/bot${params.token}/getChat?chat_id=${encodeURIComponent(params.chatId)}`;
	const fetchImpl = params.fetchImpl ?? fetch;
	const requestAbortController = new AbortController();
	const requestSignal = params.signal ? AbortSignal.any([params.signal, requestAbortController.signal]) : requestAbortController.signal;
	const timeout = buildTimeoutAbortSignal({
		signal: requestSignal,
		timeoutMs: resolveTelegramRequestTimeoutMs("getchat", params.timeoutSeconds),
		operation: "telegram-getchat-lookup",
		url
	});
	try {
		const res = await fetchImpl(url, timeout.signal ? { signal: timeout.signal } : void 0);
		if (!res.ok) {
			requestAbortController.abort(/* @__PURE__ */ new Error(`Telegram getChat failed with HTTP ${res.status}`));
			res.body?.cancel().catch(() => void 0);
			return null;
		}
		const data = JSON.parse((await readResponseWithLimit(res, TELEGRAM_BOT_API_MAX_RESPONSE_BYTES)).toString("utf8"));
		const id = data?.ok ? data?.result?.id : void 0;
		if (typeof id === "number" || typeof id === "string") return String(id);
		return null;
	} catch {
		return null;
	} finally {
		timeout.cleanup();
	}
}
//#endregion
//#region extensions/telegram/src/approval-native.ts
function resolveTurnSourceTelegramOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const rawTurnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
	const parsedTurnSourceTarget = rawTurnSourceTo ? parseTelegramTarget(rawTurnSourceTo) : null;
	const turnSourceTo = normalizeTelegramChatId(parsedTurnSourceTarget?.chatId ?? rawTurnSourceTo);
	if (turnSourceChannel !== "telegram" || !turnSourceTo) return null;
	const rawThreadId = request.request.turnSourceThreadId ?? parsedTurnSourceTarget?.messageThreadId ?? void 0;
	const directMessagesTopicId = parsedTurnSourceTarget?.directMessagesTopicId;
	return {
		to: directMessagesTopicId == null ? turnSourceTo : `${turnSourceTo}:direct-topic:${directMessagesTopicId}`,
		threadId: directMessagesTopicId == null ? parseTelegramThreadId(rawThreadId) : void 0
	};
}
function resolveSessionTelegramOriginTarget(sessionTarget) {
	return {
		to: normalizeTelegramChatId(sessionTarget.to) ?? sessionTarget.to,
		threadId: parseTelegramThreadId(sessionTarget.threadId)
	};
}
const resolveTelegramOriginTarget = createChannelNativeOriginTargetResolver({
	channel: "telegram",
	shouldHandleRequest: shouldHandleTelegramExecApprovalRequest,
	resolveTurnSourceTarget: resolveTurnSourceTelegramOriginTarget,
	resolveSessionTarget: resolveSessionTelegramOriginTarget
});
const resolveTelegramApproverDmTargets = createChannelApproverDmTargetResolver({
	shouldHandleRequest: shouldHandleTelegramExecApprovalRequest,
	resolveApprovers: getTelegramExecApprovalApprovers,
	mapApprover: (approver) => ({ to: approver })
});
function describeTelegramApprovalSetup({ accountId }, approvalKind) {
	const prefix = accountId && accountId !== "default" ? `channels.telegram.accounts.${accountId}` : "channels.telegram";
	return `Approve it from the ${approvalKind === "plugin" ? "Web UI or terminal UI" : "Web UI"} for now. Telegram supports native ${approvalKind} approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
}
const telegramNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "telegram",
	channelLabel: "Telegram",
	describeExecApprovalSetup: (params) => describeTelegramApprovalSetup(params, "exec"),
	describePluginApprovalSetup: (params) => describeTelegramApprovalSetup(params, "plugin"),
	listAccountIds: listTelegramAccountIds,
	hasApprovers: ({ cfg, accountId }) => getTelegramExecApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: isTelegramExecApprovalAuthorizedSender,
	isPluginAuthorizedSender: isTelegramExecApprovalApprover,
	isNativeDeliveryEnabled: isTelegramExecApprovalClientEnabled,
	resolveNativeDeliveryMode: resolveTelegramExecApprovalTarget,
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveOriginTarget: resolveTelegramOriginTarget,
	resolveApproverDmTargets: resolveTelegramApproverDmTargets,
	notifyOriginWhenDmOnly: true,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: isTelegramExecApprovalClientEnabled,
		shouldHandle: shouldHandleTelegramExecApprovalRequest,
		load: async () => (await import("./approval-handler.runtime.js")).telegramApprovalNativeRuntime
	})
});
const resolveTelegramApproveCommandBehavior = (params) => {
	if (params.approvalKind !== "exec" || isTelegramExecApprovalClientEnabled(params) || isTelegramExecApprovalTargetRecipient(params) || isTelegramExecApprovalAuthorizedSender(params) && !isTelegramExecApprovalApprover(params)) return;
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
//#region extensions/telegram/src/bot-info-cache.ts
const TELEGRAM_BOT_INFO_CACHE_NAMESPACE = "telegram.bot-info-cache";
const TELEGRAM_BOT_INFO_CACHE_MAX_ENTRIES = 128;
const TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS = 864e5;
function fingerprintFromToken(botToken) {
	const trimmed = botToken?.trim();
	if (!trimmed) return null;
	return fingerprintTelegramBotToken(trimmed);
}
function openBotInfoCacheStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_BOT_INFO_CACHE_MAX_ENTRIES,
		defaultTtlMs: TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS
	});
}
function parseCachedTelegramBotInfo(value) {
	if (!value || typeof value !== "object") return null;
	const state = value;
	if (typeof state.tokenFingerprint !== "string" || typeof state.fetchedAt !== "string" || Number.isNaN(Date.parse(state.fetchedAt))) return null;
	const botInfo = normalizeTelegramBotInfo(state.botInfo);
	if (!botInfo) return null;
	return {
		tokenFingerprint: state.tokenFingerprint,
		fetchedAt: state.fetchedAt,
		botInfo
	};
}
async function readCachedTelegramBotInfo(params) {
	const tokenFingerprint = fingerprintFromToken(params.botToken);
	if (!tokenFingerprint) return null;
	const parsed = parseCachedTelegramBotInfo(await openBotInfoCacheStore().lookup(normalizeTelegramStateAccountId(params.accountId)));
	if (!parsed || parsed.tokenFingerprint !== tokenFingerprint) return null;
	const fetchedAtMs = Date.parse(parsed.fetchedAt);
	if ((params.now?.getTime() ?? Date.now()) - fetchedAtMs > TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS) return null;
	return {
		botInfo: parsed.botInfo,
		fetchedAt: parsed.fetchedAt
	};
}
async function writeCachedTelegramBotInfo(params) {
	const tokenFingerprint = fingerprintFromToken(params.botToken);
	if (!tokenFingerprint) return;
	const botInfo = normalizeTelegramBotInfo(params.botInfo);
	if (!botInfo) return;
	await openBotInfoCacheStore().register(normalizeTelegramStateAccountId(params.accountId), {
		tokenFingerprint,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		botInfo
	});
}
async function deleteCachedTelegramBotInfo(params) {
	await openBotInfoCacheStore().delete(normalizeTelegramStateAccountId(params.accountId));
}
//#endregion
//#region extensions/telegram/src/conversation-route-owner.ts
function resolveInspectionThread(params) {
	const target = parseTelegramTarget(params.target?.trim() || params.peerId);
	const chatId = target.chatId.trim();
	if (!chatId) return null;
	if (target.directMessagesTopicId != null) return {
		chatId,
		threadSpec: {
			id: target.directMessagesTopicId,
			scope: "direct-messages"
		}
	};
	if (target.messageThreadId != null) return {
		chatId,
		threadSpec: {
			id: target.messageThreadId,
			scope: "forum"
		}
	};
	const threadId = parseStrictNonNegativeInteger(params.threadId);
	return {
		chatId,
		threadSpec: threadId == null ? { scope: "none" } : {
			id: threadId,
			scope: params.kind === "direct" ? "dm" : "forum"
		}
	};
}
function inspectTelegramConversationRouteOwner(params) {
	const parsed = resolveInspectionThread(params.conversation);
	if (!parsed) return null;
	const accountId = normalizeAccountId(params.accountId);
	const accountConfig = mergeTelegramAccountConfig(params.cfg, accountId);
	if (params.cfg.channels?.telegram?.enabled === false || accountConfig.enabled === false || !hasTelegramAccountConfig(params.cfg, accountId)) return null;
	const { topicConfig } = resolveTelegramScopedGroupConfig(accountConfig, parsed.chatId, parsed.threadSpec.id);
	const result = inspectTelegramConversationRoute({
		cfg: params.cfg,
		accountId,
		chatId: parsed.chatId,
		isGroup: params.conversation.kind !== "direct",
		threadSpec: parsed.threadSpec,
		senderId: params.conversation.kind === "direct" ? params.conversation.peerId : void 0,
		topicAgentId: topicConfig?.agentId
	});
	if (!result.bindingOwnerAvailable && resolveThreadBindingSpawnPolicy({
		cfg: params.cfg,
		channel: "telegram",
		accountId,
		kind: "subagent"
	}).enabled) return { kind: "unavailable" };
	if (result.bindingMode.kind !== "plugin-owned-runtime") return {
		kind: "agent",
		agentId: result.route.agentId
	};
	return result.bindingMode.pluginId ? {
		kind: "plugin",
		pluginId: result.bindingMode.pluginId,
		fallbackAgentId: result.route.agentId
	} : null;
}
//#endregion
//#region extensions/telegram/src/group-policy.ts
function parseTelegramGroupId(value) {
	const raw = value?.trim() ?? "";
	if (!raw) return {
		chatId: void 0,
		topicId: void 0
	};
	const [chatId, second, third] = raw.split(":").filter(Boolean);
	const topicId = second === "topic" ? third : second;
	if (chatId !== void 0 && /^-?\d+$/.test(chatId) && topicId !== void 0 && /^\d+$/.test(topicId)) return {
		chatId,
		topicId
	};
	return {
		chatId: raw,
		topicId: void 0
	};
}
const groupScopeKey = (groupKey) => scopeKey(["group", groupKey]);
const topicScopeKey = (groupKey, topicKey) => scopeKey(["group", groupKey], ["topic", topicKey]);
function resolveTelegramRequireMention(params) {
	const { cfg, chatId, topicId, accountId } = params;
	if (!chatId) return;
	const groups = (accountId ? cfg.channels?.telegram?.accounts?.[accountId]?.groups : void 0) ?? cfg.channels?.telegram?.groups;
	const scopes = {};
	const path = [];
	const add = (key, entry) => {
		if (entry) {
			scopes[key] = { requireMention: entry.requireMention };
			path.push(key);
		}
	};
	const groupConfig = groups?.[chatId];
	const groupDefault = groups?.["*"];
	add(groupScopeKey("*"), groupDefault);
	add(groupScopeKey(chatId), groupConfig);
	if (topicId) {
		add(topicScopeKey("*", "*"), groupDefault?.topics?.["*"]);
		add(topicScopeKey("*", topicId), groupDefault?.topics?.[topicId]);
		add(topicScopeKey(chatId, "*"), groupConfig?.topics?.["*"]);
		add(topicScopeKey(chatId, topicId), groupConfig?.topics?.[topicId]);
	}
	return path.some((key) => typeof scopes[key]?.requireMention === "boolean") ? resolveScopeRequireMention({
		tree: { scopes },
		path
	}) : void 0;
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
	const groupId = chatId ?? params.groupId?.trim();
	return resolveScopeToolsPolicy({
		tree: buildChannelGroupsScopeTree(params.cfg, "telegram", params.accountId),
		path: groupId ? [groupId] : [],
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		messageProvider: "telegram"
	});
}
//#endregion
//#region extensions/telegram/src/security.ts
const resolveTelegramDmPolicy = createScopedDmSecurityResolver({
	channelKey: "telegram",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => raw.replace(/^(telegram|tg):/i, "")
});
const collectTelegramSecurityWarnings = createAllowlistProviderRouteAllowlistWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.telegram !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Boolean(account.config.groups) && Object.keys(account.config.groups ?? {}).length > 0,
	restrictSenders: {
		surface: "Telegram groups",
		openScope: "any member in allowed groups",
		groupPolicyPath: "channels.telegram.groupPolicy",
		groupAllowFromPath: "channels.telegram.groupAllowFrom"
	},
	noRouteAllowlist: {
		surface: "Telegram groups",
		routeAllowlistPath: "channels.telegram.groups",
		routeScope: "group",
		groupPolicyPath: "channels.telegram.groupPolicy",
		groupAllowFromPath: "channels.telegram.groupAllowFrom"
	}
});
const telegramSecurityAdapter = {
	resolveDmPolicy: resolveTelegramDmPolicy,
	dmRouting: { resolveDmRoute: (ctx) => resolveTelegramSecurityDmRoute(resolveDefaultTelegramAccountId(ctx.cfg), ctx) },
	collectWarnings: createConditionalWarningCollector.findings({
		collectWarnings: collectTelegramSecurityWarnings,
		checkId: "channels.telegram.groups.open",
		severity: "warn",
		title: "Telegram security warning"
	}),
	collectAuditFindings: collectTelegramSecurityAuditFindings
};
//#endregion
//#region extensions/telegram/src/doctor.ts
function sanitizeForLog(value) {
	return value.replace(/\p{Cc}+/gu, " ").trim();
}
function hasAllowFromEntries(values) {
	return Array.isArray(values) && values.some((entry) => normalizeOptionalString(String(entry)));
}
function collectTelegramAllowFromLists(prefix, account) {
	const refs = [{
		pathLabel: `${prefix}.allowFrom`,
		holder: account,
		key: "allowFrom"
	}, {
		pathLabel: `${prefix}.groupAllowFrom`,
		holder: account,
		key: "groupAllowFrom"
	}];
	const groups = asNullableRecord(account.groups);
	if (!groups) return refs;
	for (const groupId of Object.keys(groups)) {
		const group = asNullableRecord(groups[groupId]);
		if (!group) continue;
		refs.push({
			pathLabel: `${prefix}.groups.${groupId}.allowFrom`,
			holder: group,
			key: "allowFrom"
		});
		const topics = asNullableRecord(group.topics);
		if (!topics) continue;
		for (const topicId of Object.keys(topics)) {
			const topic = asNullableRecord(topics[topicId]);
			if (!topic) continue;
			refs.push({
				pathLabel: `${prefix}.groups.${groupId}.topics.${topicId}.allowFrom`,
				holder: topic,
				key: "allowFrom"
			});
		}
	}
	return refs;
}
function describeConfigValueType(value) {
	if (Array.isArray(value)) return "array";
	if (value === null) return "null";
	return typeof value;
}
function collectTelegramMalformedGroupsWarnings(params) {
	const scope = collectChannelAccountScopes({
		cfg: params.cfg,
		channelId: "telegram"
	}).find(({ account }) => Object.hasOwn(account, "groups") && !asNullableRecord(account.groups));
	if (!scope) return [];
	return [`- ${sanitizeForLog(`${scope.prefix}.groups`)} has invalid Telegram groups shape (${describeConfigValueType(scope.account.groups)}); expected an object map keyed by Telegram group/chat id, not an array, string, or null.`, `- Example shape: channels.telegram.groups."-1001234567890".topics."99" = { agentId: "support" }. Use topics for forum-topic routing, then rerun ${params.doctorFixCommand} for any remaining Telegram config cleanup.`];
}
function scanTelegramInvalidAllowFromEntries(cfg) {
	const hits = [];
	const scanList = (pathLabel, list) => {
		if (!Array.isArray(list)) return;
		for (const entry of list) {
			const normalized = normalizeTelegramAllowFromEntry(entry);
			if (!normalized || normalized === "*" || isNumericTelegramSenderUserId(normalized)) continue;
			hits.push({
				path: pathLabel,
				entry: normalizeOptionalString(String(entry)) ?? ""
			});
		}
	};
	for (const scope of collectChannelAccountScopes({
		cfg,
		channelId: "telegram"
	})) for (const ref of collectTelegramAllowFromLists(scope.prefix, scope.account)) scanList(ref.pathLabel, ref.holder[ref.key]);
	return hits;
}
function collectTelegramInvalidAllowFromWarnings(params) {
	if (params.hits.length === 0) return [];
	const sampleEntry = sanitizeForLog(params.hits[0]?.entry ?? "@");
	return [`- Telegram allowFrom contains ${params.hits.length} invalid sender entries (e.g. ${sampleEntry}); Telegram authorization requires positive numeric sender user IDs.`, `- Run "${params.doctorFixCommand}" to auto-resolve @username entries to numeric IDs (requires a Telegram bot token). Move negative chat IDs under channels.telegram.groups instead of allowFrom.`];
}
function scanTelegramBotEndpointApiRoots(cfg) {
	const hits = [];
	for (const scope of collectChannelAccountScopes({
		cfg,
		channelId: "telegram"
	})) {
		const value = scope.account.apiRoot;
		if (typeof value !== "string" || !hasTelegramBotEndpointApiRoot(value)) continue;
		const url = new URL(value.trim());
		const segments = url.pathname.split("/").filter(Boolean);
		segments.pop();
		url.pathname = segments.length > 0 ? `/${segments.join("/")}` : "/";
		url.search = "";
		url.hash = "";
		hits.push({
			path: `${scope.prefix}.apiRoot`,
			pathSegments: [...scope.pathSegments, "apiRoot"],
			normalized: url.toString().replace(/\/+$/u, "")
		});
	}
	return hits;
}
function collectTelegramApiRootWarnings(params) {
	if (params.hits.length === 0) return [];
	return [`- ${sanitizeForLog(params.hits[0]?.path ?? "channels.telegram.apiRoot")} points at a full Telegram bot endpoint; apiRoot must be the Bot API root only. Telegram refuses this value until it is repaired.`, `- Run "${params.doctorFixCommand}" to remove the trailing /bot<TOKEN> path from Telegram apiRoot.`];
}
function formatTelegramAccountConfigPath(cfg, accountId) {
	const telegram = asNullableRecord(cfg.channels?.telegram);
	const accounts = asNullableRecord(telegram?.accounts);
	if (!accounts || Object.keys(accounts).length === 0) return "channels.telegram";
	return accountId === "default" ? "channels.telegram" : `channels.telegram.accounts.${accountId}`;
}
function collectTelegramSelectedQuoteToolProgressWarnings(cfg) {
	if (!asNullableRecord(cfg.channels?.telegram)) return [];
	for (const accountId of listTelegramAccountIds(cfg)) {
		const account = mergeTelegramAccountConfig(cfg, accountId);
		const replyToMode = account.replyToMode ?? "off";
		if (replyToMode === "off") continue;
		const streamMode = resolveTelegramPreviewStreamMode(account);
		if (streamMode === "off") continue;
		if (resolveChannelStreamingBlockEnabled(account, {
			previewAvailable: true,
			blockStreamingDefault: cfg.agents?.defaults?.blockStreamingDefault
		}) || !resolveChannelStreamingPreviewToolProgress(account, streamMode !== "progress", streamMode)) continue;
		const path = formatTelegramAccountConfigPath(cfg, accountId);
		const toolProgressSection = streamMode === "progress" ? "progress" : "preview";
		return [`- ${sanitizeForLog(path)} has replyToMode: "${sanitizeForLog(replyToMode)}" while Telegram preview tool-progress is enabled. Telegram selected quote replies must send the final answer through the native quote-reply path, so those turns skip the short "Working" tool-progress preview. Current-message replies without selected quote text still keep preview streaming.`, `- Set replyToMode: "off" when tool-progress preview matters more than native quote replies, or set streaming.${toolProgressSection}.toolProgress: false to keep quote replies and silence this warning.`];
	}
	return [];
}
function maybeRepairTelegramApiRoots(cfg) {
	const hits = scanTelegramBotEndpointApiRoots(cfg);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const apply = (path, normalized) => {
		let target = next;
		for (const segment of path.slice(0, -1)) {
			target = asNullableRecord(target?.[segment]);
			if (!target) return;
		}
		target[path[path.length - 1] ?? "apiRoot"] = normalized;
	};
	for (const hit of hits) apply(hit.pathSegments, hit.normalized);
	return {
		config: next,
		changes: hits.map((hit) => `- ${sanitizeForLog(hit.path)}: removed trailing /bot<TOKEN> from Telegram apiRoot.`)
	};
}
function collectTelegramMissingEnvTokenWarnings(params) {
	if (resolveDefaultTelegramAccountId$1(params.cfg) !== "default") return [];
	const account = inspectTelegramAccount({
		cfg: params.cfg,
		accountId: "default",
		envToken: params.env?.TELEGRAM_BOT_TOKEN ?? ""
	});
	if (!account.enabled || account.tokenStatus !== "missing" || account.tokenSource !== "none") return [];
	return ["- channels.telegram: default account has no available bot token, and TELEGRAM_BOT_TOKEN is absent in this doctor environment. After migration, verify TELEGRAM_BOT_TOKEN is present in the state-dir .env or configure channels.telegram.botToken / channels.telegram.accounts.default.botToken as a SecretRef."];
}
async function repairTelegramConfig(params) {
	const apiRootRepair = maybeRepairTelegramApiRoots(params.cfg);
	const allowFromRepair = await maybeRepairTelegramAllowFromUsernames(apiRootRepair.config);
	return {
		config: allowFromRepair.config,
		changes: [...apiRootRepair.changes, ...allowFromRepair.changes]
	};
}
async function maybeRepairTelegramAllowFromUsernames(cfg) {
	const hits = scanTelegramInvalidAllowFromEntries(cfg);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	if (hits.filter((hit) => {
		const normalized = normalizeTelegramAllowFromEntry(hit.entry);
		return normalized.length > 0 && !/\s/.test(normalized) && !normalized.startsWith("-");
	}).length === 0) return {
		config: cfg,
		changes: hits.slice(0, 5).map((hit) => `- ${sanitizeForLog(hit.path)}: invalid sender entry ${sanitizeForLog(hit.entry)}; allowFrom requires positive numeric Telegram user IDs. Move group chat IDs under channels.telegram.groups.`)
	};
	const { getChannelsCommandSecretTargetIds, resolveCommandSecretRefsViaGateway } = await import("./plugin-sdk/runtime.js");
	const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
		config: cfg,
		commandName: "doctor --fix",
		targetIds: getChannelsCommandSecretTargetIds(),
		mode: "read_only_status"
	});
	const tokenResolutionWarnings = [];
	const resolverAccountIds = [];
	let sawConfiguredUnavailableToken = false;
	for (const accountId of listTelegramAccountIds(resolvedConfig)) {
		let inspected;
		try {
			inspected = inspectTelegramAccount({
				cfg: resolvedConfig,
				accountId
			});
		} catch (error) {
			tokenResolutionWarnings.push(`- Telegram account ${accountId}: failed to inspect bot token (${formatErrorMessage(error)}).`);
			continue;
		}
		if (inspected.tokenStatus === "configured_unavailable") {
			sawConfiguredUnavailableToken = true;
			tokenResolutionWarnings.push(`- Telegram account ${accountId}: failed to inspect bot token (configured but unavailable in this command path).`);
		}
		if (inspected.tokenSource === "none" ? "" : normalizeOptionalString(inspected.token) ?? "") resolverAccountIds.push(accountId);
	}
	if (resolverAccountIds.length === 0) return {
		config: cfg,
		changes: [...tokenResolutionWarnings, sawConfiguredUnavailableToken ? "- Telegram allowFrom contains @username entries, but configured Telegram bot credentials are unavailable in this command path; cannot auto-resolve." : "- Telegram allowFrom contains @username entries, but no Telegram bot token is available in this command path; cannot auto-resolve."]
	};
	const resolveUserId = async (normalized) => {
		if (/\s/.test(normalized)) return null;
		const username = normalized.startsWith("@") ? normalized : `@${normalized}`;
		for (const accountId of resolverAccountIds) try {
			const account = resolveTelegramAccount({
				cfg: resolvedConfig,
				accountId
			});
			const token = account.token.trim();
			if (!token) continue;
			const id = await lookupTelegramChatId({
				token,
				chatId: username,
				network: account.config.network,
				signal: void 0
			});
			if (id) return id;
		} catch {}
		return null;
	};
	const next = structuredClone(cfg);
	const changes = [];
	const repairList = async (pathLabel, holder, key) => {
		const raw = holder[key];
		if (!Array.isArray(raw)) return;
		const out = [];
		const replaced = [];
		for (const entry of raw) {
			const normalized = normalizeTelegramAllowFromEntry(entry);
			if (!normalized) continue;
			if (normalized === "*" || isNumericTelegramSenderUserId(normalized)) {
				out.push(normalized);
				continue;
			}
			const resolved = await resolveUserId(normalized);
			if (resolved) {
				out.push(resolved);
				replaced.push({
					from: normalizeOptionalString(String(entry)) ?? "",
					to: resolved
				});
			} else out.push(normalizeOptionalString(String(entry)) ?? "");
		}
		const deduped = [];
		const seen = /* @__PURE__ */ new Set();
		for (const entry of out) {
			const keyValue = normalizeOptionalString(String(entry)) ?? "";
			if (!keyValue || seen.has(keyValue)) continue;
			seen.add(keyValue);
			deduped.push(entry);
		}
		holder[key] = deduped;
		for (const replacement of replaced.slice(0, 5)) changes.push(`- ${sanitizeForLog(pathLabel)}: resolved ${sanitizeForLog(replacement.from)} -> ${sanitizeForLog(replacement.to)}`);
		if (replaced.length > 5) changes.push(`- ${sanitizeForLog(pathLabel)}: resolved ${replaced.length - 5} more @username entries`);
	};
	for (const scope of collectChannelAccountScopes({
		cfg: next,
		channelId: "telegram"
	})) for (const ref of collectTelegramAllowFromLists(scope.prefix, scope.account)) await repairList(ref.pathLabel, ref.holder, ref.key);
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
function hasConfiguredGroups(account, parent) {
	const groups = asNullableRecord(account.groups) ?? asNullableRecord(parent?.groups);
	return Boolean(groups) && Object.keys(groups ?? {}).length > 0;
}
function collectTelegramGroupPolicyWarnings(params) {
	if (!hasConfiguredGroups(params.account, params.parent)) {
		const effectiveDmPolicy = params.dmPolicy ?? "pairing";
		const dmSetupLine = effectiveDmPolicy === "pairing" ? "DMs use pairing mode, so new senders must start a chat and be approved before regular messages are accepted." : effectiveDmPolicy === "allowlist" ? `DMs use allowlist mode, so only sender IDs in ${params.prefix}.allowFrom are accepted.` : effectiveDmPolicy === "open" ? "DMs are open." : "DMs are disabled.";
		return [`- ${params.prefix}: Telegram is in first-time setup mode. ${dmSetupLine} Group messages stay blocked until you add allowed chats under ${params.prefix}.groups (and optional sender IDs under ${params.prefix}.groupAllowFrom), or set ${params.prefix}.groupPolicy to "open" if you want broad group access.`];
	}
	const rawGroupAllowFrom = params.account.groupAllowFrom ?? params.parent?.groupAllowFrom;
	if (hasAllowFromEntries((hasAllowFromEntries(rawGroupAllowFrom) ? rawGroupAllowFrom : void 0) ?? params.effectiveAllowFrom)) return [];
	return [`- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom (and allowFrom) is empty — all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom or ${params.prefix}.allowFrom, or set ${params.prefix}.groupPolicy to "open".`];
}
function collectTelegramEmptyAllowlistExtraWarnings(params) {
	const account = params.account;
	const parent = params.parent;
	return params.channelName === "telegram" && (account.groupPolicy ?? parent?.groupPolicy ?? void 0) === "allowlist" ? collectTelegramGroupPolicyWarnings({
		account,
		dmPolicy: params.dmPolicy,
		effectiveAllowFrom: params.effectiveAllowFrom,
		parent,
		prefix: params.prefix
	}) : [];
}
const telegramDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: ({ cfg, doctorFixCommand, env }) => [
		...collectTelegramMissingEnvTokenWarnings({
			cfg,
			env
		}),
		...collectTelegramMalformedGroupsWarnings({
			cfg,
			doctorFixCommand
		}),
		...collectTelegramInvalidAllowFromWarnings({
			hits: scanTelegramInvalidAllowFromEntries(cfg),
			doctorFixCommand
		}),
		...collectTelegramApiRootWarnings({
			hits: scanTelegramBotEndpointApiRoots(cfg),
			doctorFixCommand
		}),
		...collectTelegramSelectedQuoteToolProgressWarnings(cfg)
	],
	runConfigSequence: ({ cfg, env }) => {
		const infoNotes = [];
		const warningNotes = [];
		const accountIds = cfg.channels?.telegram?.enabled === false ? [] : listTelegramAccountIds(cfg);
		for (const accountId of accountIds) {
			const config = mergeTelegramAccountConfig(cfg, accountId);
			if (config.enabled === false || !config.webhookUrl) continue;
			const legacyListener = resolveTelegramLegacyWebhookListener(config.legacyWebhook);
			const path = config.webhookPath ?? "/telegram-webhook";
			const pathConflict = resolveTelegramWebhookPathConflict(path);
			if (pathConflict) {
				warningNotes.push(`Telegram account "${accountId}" resolves webhookPath to ${path}, which ${pathConflict.message}. Set webhookPath to /telegram-webhook and update webhookUrl or its reverse-proxy mapping. ${legacyListener && pathConflict.kind !== "health" ? "The legacy listener remains available; verify delivery on the new route before setting legacyWebhook: false." : "This account cannot start until its webhook path is changed."}`);
				continue;
			}
			const destination = `Gateway port ${resolveGatewayPort(cfg, env)}${path}`;
			infoNotes.push(legacyListener ? `Telegram account "${accountId}": legacy listener ${legacyListener.host}:${legacyListener.port} forwards to ${destination}. Move the reverse proxy for ${config.webhookUrl} to that Gateway route, verify delivery, then set legacyWebhook: false to disable legacy forwarding for this account.` : `Telegram account "${accountId}": no legacy listener is configured. The advertised webhook URL must reach ${destination}.`);
		}
		return {
			changeNotes: [],
			infoNotes,
			warningNotes
		};
	},
	repairConfig: repairTelegramConfig,
	collectEmptyAllowlistExtraWarnings: collectTelegramEmptyAllowlistExtraWarnings,
	shouldSkipDefaultEmptyGroupAllowlistWarning: (params) => params.channelName === "telegram"
};
//#endregion
//#region extensions/telegram/src/shared.ts
function createTelegramPluginBase(params) {
	return {
		...createTelegramSetupPluginBase(params),
		commands: {
			nativeCommandsAutoEnabled: true,
			nativeSkillsAutoEnabled: true,
			buildCommandsListChannelData: buildTelegramCommandsListChannelData,
			buildModelsMenuChannelData: buildTelegramModelsProviderChannelData,
			buildModelsProviderChannelData: buildTelegramModelsProviderChannelData,
			buildModelsAddProviderChannelData: buildTelegramModelsAddProviderChannelData,
			buildModelsListChannelData: buildTelegramModelsListChannelData,
			buildModelBrowseChannelData: buildTelegramModelBrowseChannelData
		},
		doctor: telegramDoctor,
		security: telegramSecurityAdapter
	};
}
//#endregion
//#region extensions/telegram/src/startup-probe-limiter.ts
const startupProbePermits = createPermitPool(2);
function buildStartupProbeAbortError() {
	return /* @__PURE__ */ new Error("telegram startup probe wait aborted");
}
async function withTelegramStartupProbeSlot(abortSignal, run) {
	const release = await startupProbePermits.acquire({ signal: abortSignal });
	if (!release) throw buildStartupProbeAbortError();
	try {
		if (abortSignal?.aborted) throw buildStartupProbeAbortError();
		return await run();
	} finally {
		release();
	}
}
//#endregion
//#region extensions/telegram/src/status-issues.ts
const TELEGRAM_CONNECT_GRACE_MS = 12e4;
const TELEGRAM_POLLING_STALE_TRANSPORT_MS = 18e5;
const TELEGRAM_ACCOUNT_STATUS_FIELDS = [
	"mode",
	"lastStartAt",
	"lastTransportActivityAt",
	"lastError",
	"allowUnmentionedGroups",
	"audit"
];
function appendTelegramRuntimeError(message, lastError) {
	const error = normalizeOptionalString(lastError);
	return error ? `${message}: ${error}` : message;
}
function isTelegramPollingBacklogStallError(lastError) {
	const error = normalizeOptionalString(lastError);
	return Boolean(error?.includes("isolated polling spool backlog stalled") || error?.includes("isolated polling spool handler timed out"));
}
function collectTelegramRuntimeIssues(params) {
	const { account, accountId, issues, now } = params;
	const mode = normalizeOptionalString(account.mode);
	if (account.running !== true || mode !== "polling" && mode !== "webhook") return;
	const lastStartAt = asFiniteNumber(account.lastStartAt) ?? null;
	const fix = mode === "polling" ? `Run: ${formatCliCommand("openclaw channels status --probe")} (or restart the gateway). Check the bot token, proxy/network settings, and logs if it persists.` : `Run: ${formatCliCommand("openclaw channels status --probe")} (or restart the gateway). Check the webhook URL, secret, TLS/proxy reachability, and Telegram setWebhook logs if it persists.`;
	if (account.connected === false) {
		if (!(lastStartAt != null && now - lastStartAt < TELEGRAM_CONNECT_GRACE_MS)) {
			const message = mode === "webhook" ? "Telegram webhook listener is running but setWebhook has not completed since startup" : isTelegramPollingBacklogStallError(account.lastError) ? "Telegram isolated polling spool backlog is stalled while Bot API polling is still succeeding" : "Telegram polling is running but has not completed a successful getUpdates call since startup";
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
	const lastTransportActivityAt = asFiniteNumber(account.lastTransportActivityAt) ?? null;
	if (mode === "polling" && account.connected === true && lastTransportActivityAt != null) {
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
function readTelegramGroupMembershipAuditSummary(value) {
	if (!isRecord(value)) return {};
	const unresolvedGroups = asFiniteNumber(value.unresolvedGroups);
	const hasWildcardUnmentionedGroups = typeof value.hasWildcardUnmentionedGroups === "boolean" ? value.hasWildcardUnmentionedGroups : void 0;
	const groupsRaw = value.groups;
	return {
		unresolvedGroups,
		hasWildcardUnmentionedGroups,
		groups: Array.isArray(groupsRaw) ? groupsRaw.map((entry) => {
			if (!isRecord(entry)) return null;
			const chatId = normalizeOptionalString(entry.chatId);
			if (!chatId) return null;
			return {
				chatId,
				ok: typeof entry.ok === "boolean" ? entry.ok : void 0,
				status: normalizeOptionalString(entry.status) ?? null,
				error: normalizeOptionalString(entry.error) ?? null,
				matchKey: normalizeOptionalString(entry.matchKey),
				matchSource: normalizeOptionalString(entry.matchSource)
			};
		}).filter((entry) => entry !== null) : void 0
	};
}
function collectTelegramStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readAccountStatusSnapshot(entry, TELEGRAM_ACCOUNT_STATUS_FIELDS);
		if (!account) continue;
		const accountId = resolveEnabledConfiguredAccountId(account);
		if (!accountId) continue;
		collectTelegramRuntimeIssues({
			account,
			accountId,
			issues,
			now: Date.now()
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
//#region extensions/telegram/src/thread-bindings-channel.ts
const telegramThreadBindingLifecycle = {
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
	}),
	setIdleTimeoutBySessionKeyAsync: ({ targetSessionKey, accountId, idleTimeoutMs }) => setTelegramThreadBindingIdleTimeoutBySessionKeyAsync({
		targetSessionKey,
		accountId: accountId ?? void 0,
		idleTimeoutMs
	}),
	setMaxAgeBySessionKeyAsync: ({ targetSessionKey, accountId, maxAgeMs }) => setTelegramThreadBindingMaxAgeBySessionKeyAsync({
		targetSessionKey,
		accountId: accountId ?? void 0,
		maxAgeMs
	})
};
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
	return {
		currentChannelId: normalizeOptionalString(params.context.To),
		currentThreadTs: resolveTelegramToolContextThreadId(params.context),
		hasRepliedRef: params.hasRepliedRef
	};
}
//#endregion
//#region extensions/telegram/src/channel.ts
const loadTelegramUpdateOffsetRuntime = createLazyRuntimeModule(() => import("./extensions/telegram/update-offset-runtime-api.js"));
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
async function clearTelegramAccountRuntimeCache(accountId) {
	const { deleteTelegramUpdateOffset } = await loadTelegramUpdateOffsetRuntime();
	await Promise.all([deleteTelegramUpdateOffset({ accountId }), deleteStartupBotInfoCache(accountId)]);
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
function formatTelegramUnauthorizedTokenError(account, status) {
	const source = account.tokenSource === "none" ? "no configured token" : `${account.tokenSource} token`;
	const credentialPath = account.accountId === "default" ? "channels.telegram.botToken, channels.telegram.tokenFile, or TELEGRAM_BOT_TOKEN" : `channels.telegram.accounts.${account.accountId}.botToken/tokenFile`;
	return `Telegram bot token unauthorized for account "${account.accountId}" (getMe returned ${status} from Telegram; source: ${source}). Update ${credentialPath} with the current BotFather token.`;
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
	shouldSuppressLocalPayloadPrompt: shouldSuppressLocalTelegramExecApprovalPrompt,
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
	shouldTreatDeliveredTextAsVisible: ({ kind }) => kind !== "final",
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
function targetsMatchTelegramReplySuppression(params) {
	const origin = parseTelegramTarget(params.originTarget);
	const target = parseTelegramTarget(params.targetKey);
	const originConversation = buildTelegramConversationId({
		chatId: origin.chatId,
		thread: resolveTelegramTargetThread(origin) ?? { scope: "none" }
	});
	const targetConversation = buildTelegramConversationId({
		chatId: target.chatId,
		thread: resolveTelegramTargetThread(target, normalizeOptionalString(params.targetThreadId)) ?? { scope: "none" }
	});
	return normalizeOptionalLowercaseString(originConversation) === normalizeOptionalLowercaseString(targetConversation);
}
function resolveTelegramTargetThread(target, fallbackThreadId) {
	if (target.directMessagesTopicId != null) return {
		id: target.directMessagesTopicId,
		scope: "direct-messages"
	};
	const forumThreadId = target.messageThreadId ?? fallbackThreadId;
	if (forumThreadId == null) return;
	const id = Number(forumThreadId);
	return Number.isFinite(id) ? {
		id,
		scope: "forum"
	} : void 0;
}
function resolveTelegramCommandConversation(params) {
	for (const candidate of [
		params.originatingTo,
		params.commandTo,
		params.fallbackTo
	]) {
		if (!candidate) continue;
		const parsedTarget = parseTelegramTarget(candidate);
		const chatId = normalizeTelegramChatId(parsedTarget.chatId);
		if (!chatId) continue;
		const thread = resolveTelegramTargetThread(parsedTarget, params.threadId);
		const conversationId = buildTelegramConversationId({
			chatId,
			thread: thread ?? { scope: "none" }
		});
		if (conversationId !== chatId || !chatId.startsWith("-")) return {
			conversationId,
			parentConversationId: chatId
		};
	}
	return null;
}
function resolveTelegramInboundConversation(params) {
	const parsedConversation = params.conversationId && parseTelegramTopicConversation({
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	if (parsedConversation) return {
		conversationId: parsedConversation.canonicalConversationId,
		parentConversationId: parsedConversation.chatId
	};
	const rawTarget = params.to || params.parentConversationId || params.conversationId || "";
	if (!rawTarget) return null;
	const parsedTarget = parseTelegramTarget(rawTarget);
	const chatId = normalizeOptionalString(parsedTarget.chatId) ?? "";
	if (!chatId) return null;
	return {
		conversationId: buildTelegramConversationId({
			chatId,
			thread: resolveTelegramTargetThread(parsedTarget, params.threadId) ?? { scope: "none" }
		}),
		parentConversationId: chatId
	};
}
function resolveTelegramDeliveryTarget(params) {
	const parsedTopic = parseTelegramTopicConversation({
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	if (parsedTopic) return {
		to: parsedTopic.canonicalConversationId,
		threadId: parsedTopic.thread.id == null ? void 0 : String(parsedTopic.thread.id)
	};
	const parsedTarget = parseTelegramTarget(params.conversationId.trim() || params.parentConversationId?.trim() || "");
	if (!parsedTarget.chatId.trim()) return null;
	return {
		to: parsedTarget.chatId,
		...parsedTarget.messageThreadId != null ? { threadId: String(parsedTarget.messageThreadId) } : {}
	};
}
function shouldStripTelegramThreadFromAnnounceOrigin(params) {
	const requesterChannel = normalizeOptionalLowercaseString(params.requester.channel);
	if (requesterChannel && requesterChannel !== "telegram") return true;
	const requesterTo = params.requester.to?.trim();
	if (!requesterTo) return false;
	if (!requesterChannel && !requesterTo.startsWith("telegram:")) return true;
	const requesterTarget = parseTelegramTarget(requesterTo);
	if (requesterTarget.chatType !== "group") return true;
	const entryTo = params.entry.to?.trim();
	if (!entryTo) return false;
	return parseTelegramTarget(entryTo).chatId !== requesterTarget.chatId;
}
function resolveTelegramOutboundSessionRoute(params) {
	const parsed = parseTelegramTarget(params.target);
	const chatId = parsed.chatId.trim();
	if (!chatId) return null;
	const thread = resolveTelegramTargetThread(parsed, parseTelegramThreadId(params.threadId));
	const resolvedThreadId = thread ? Number(thread.id) : void 0;
	const conversationId = buildTelegramConversationId({
		chatId,
		thread: thread ?? { scope: "none" }
	});
	const resolvedKind = params.resolvedTarget?.kind;
	const isGroup = parsed.chatType === "group" || parsed.chatType === "unknown" && resolvedKind !== void 0 && resolvedKind !== "user";
	const recipientSessionExact = /^-?\d+$/.test(chatId);
	const peerId = isGroup && resolvedThreadId ? conversationId : chatId;
	const peer = {
		kind: isGroup ? "group" : "direct",
		id: peerId
	};
	const accountId = params.accountId ?? resolveDefaultTelegramAccountId$1(params.cfg);
	const baseRoute = buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "telegram",
		accountId,
		recipientSessionExact,
		peer,
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `telegram:group:${peerId}` : resolvedThreadId ? `telegram:${conversationId}` : `telegram:${chatId}`,
		to: `telegram:${conversationId}`,
		...isGroup && resolvedThreadId !== void 0 ? { threadId: resolvedThreadId } : {}
	});
	if (isGroup) return baseRoute;
	const inboundBaseSessionKey = resolveTelegramConversationBaseSessionKey({
		cfg: params.cfg,
		route: {
			agentId: params.agentId,
			accountId,
			matchedBy: "default",
			sessionKey: baseRoute.sessionKey
		},
		chatId,
		isGroup: false,
		senderId: chatId
	});
	const directBaseRoute = {
		...baseRoute,
		sessionKey: inboundBaseSessionKey,
		baseSessionKey: inboundBaseSessionKey
	};
	const canonicalThreadId = resolvedThreadId !== void 0 ? buildTelegramCanonicalTopicThreadId({
		chatId,
		topicId: resolvedThreadId,
		scope: thread?.scope ?? "forum"
	}) : void 0;
	const route = buildThreadAwareOutboundSessionRoute({
		route: directBaseRoute,
		threadId: canonicalThreadId,
		currentSessionKey: params.currentSessionKey,
		precedence: ["threadId", "currentSession"],
		canRecoverCurrentThread: ({ route: routeLocal }) => routeLocal.chatType !== "direct" || (params.cfg.session?.dmScope ?? "main") !== "main"
	});
	const routeThreadId = resolveTelegramNativeTopicThreadId(route.threadId, resolvedThreadId);
	return {
		...route,
		...routeThreadId !== void 0 ? { threadId: routeThreadId } : {},
		from: routeThreadId !== void 0 ? buildTelegramRoutingTarget(chatId, {
			id: Number(routeThreadId),
			scope: thread?.scope ?? "forum"
		}) : `telegram:${chatId}`
	};
}
function buildTelegramCanonicalTopicThreadId(params) {
	return params.scope === "direct-messages" ? buildTelegramConversationId({
		chatId: params.chatId,
		thread: {
			id: params.topicId,
			scope: params.scope
		}
	}) : `${params.chatId}:${params.topicId}`;
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
				proxyUrl: account.config.proxy,
				apiRoot: account.config.apiRoot,
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
			setupContract: telegramSetupContract
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
			resolveCommandConversation: resolveTelegramCommandConversation
		},
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			bindingStore: "adapter",
			defaultTopLevelPlacement: "current",
			resolveConversationRef: ({ accountId: _accountId, conversationId, parentConversationId, threadId }) => resolveTelegramInboundConversation({
				to: conversationId,
				conversationId,
				parentConversationId,
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
			...telegramThreadBindingLifecycle
		},
		groups: {
			resolveRequireMention: resolveTelegramGroupRequireMention,
			resolveToolPolicy: resolveTelegramGroupToolPolicy
		},
		agentPrompt: telegramAgentPrompt,
		messaging: {
			defaultMarkdownTableMode: "block",
			targetPrefixes: ["telegram", "tg"],
			resolveConversationRouteOwner: inspectTelegramConversationRouteOwner,
			numericTopicShorthand: true,
			normalizeTarget: normalizeTelegramMessagingTarget,
			resolveInboundConversation: ({ to, conversationId, threadId }) => resolveTelegramInboundConversation({
				to,
				conversationId,
				threadId
			}),
			resolveDeliveryTarget: resolveTelegramDeliveryTarget,
			resolveSessionConversation: resolveTelegramSessionConversation,
			resolveSessionTarget: resolveTelegramSessionTarget,
			inferTargetChatType: ({ to }) => {
				const { chatType } = parseTelegramTarget(to);
				return chatType === "unknown" ? void 0 : chatType;
			},
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
			resolveOutboundSessionRoute: resolveTelegramOutboundSessionRoute,
			targetResolver: {
				looksLikeId: looksLikeTelegramTargetId,
				hint: "<chatId>",
				reservedLiterals: [
					"current",
					"self",
					"this",
					"me"
				]
			}
		},
		resolver: { resolveTargets: resolveTelegramTargets },
		lifecycle: {
			onAccountConfigChanged: async ({ prevCfg, nextCfg, accountId }) => {
				if (resolveTelegramAccount({
					cfg: prevCfg,
					accountId
				}).token.trim() !== resolveTelegramAccount({
					cfg: nextCfg,
					accountId
				}).token.trim()) await deleteStartupBotInfoCache(accountId);
			},
			onAccountRemoved: async ({ accountId }) => {
				await clearTelegramAccountRuntimeCache(accountId);
			}
		},
		heartbeat: {
			sendTypingGuarded: async ({ cfg, to, accountId, threadId, signal, assertPlatformSendAuthorized }) => {
				const { sendTypingTelegram } = await loadTelegramSendModule();
				await sendTypingTelegram(to, {
					cfg,
					...accountId ? { accountId } : {},
					messageThreadId: parseTelegramThreadId(threadId),
					signal,
					assertPlatformSendAuthorized
				});
			},
			sendTyping: async ({ cfg, to, accountId, threadId }) => {
				const { sendTypingTelegram } = await loadTelegramSendModule();
				await sendTypingTelegram(to, {
					cfg,
					...accountId ? { accountId } : {},
					messageThreadId: parseTelegramThreadId(threadId)
				});
			}
		},
		approvalCapability: {
			...telegramApprovalCapability,
			render: { exec: { buildPendingPayload: buildTelegramExecApprovalPendingPayload } }
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
				const inspected = inspectTelegramAccount({
					cfg,
					accountId: account.accountId
				});
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured: inspected.configured,
					extra: {
						...projectCredentialSnapshotFields(account),
						lastError: runtime?.lastError ?? inspected.stateReason ?? null,
						mode: runtime?.mode ?? inspected.mode,
						audit,
						allowUnmentionedGroups: inspected.allowUnmentionedGroups
					}
				};
			}
		}),
		gateway: {
			startAccount: async (ctx) => {
				const account = ctx.account;
				const ownerAgentId = resolveAgentRoute({
					cfg: ctx.cfg,
					channel: "telegram",
					accountId: account.accountId
				}).agentId;
				const setStatus = createAccountStatusSink({
					accountId: account.accountId,
					setStatus: ctx.setStatus
				});
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
					const probe = await withTelegramStartupProbeSlot(ctx.abortSignal, () => resolveTelegramProbe()(token, resolveTelegramStartupProbeTimeoutMs(void 0), {
						accountId: account.accountId,
						proxyUrl: account.config.proxy,
						network: account.config.network,
						apiRoot: account.config.apiRoot,
						includeWebhookInfo: false,
						abortSignal: ctx.abortSignal
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
					if (!probe.ok && (probe.status === 401 || probe.status === 404)) {
						await deleteStartupBotInfoCache(account.accountId);
						unauthorizedTokenReason = formatTelegramUnauthorizedTokenError(account, probe.status);
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
					setStatus(channelBlockedPatch(unauthorizedTokenReason));
					throw new Error(unauthorizedTokenReason);
				}
				ctx.log?.info(`[${account.accountId}] starting provider${telegramBotLabel}`);
				return resolveTelegramMonitor()({
					token,
					accountId: account.accountId,
					ownerAgentId,
					config: ctx.cfg,
					runtime: ctx.runtime,
					channelRuntime: ctx.channelRuntime,
					abortSignal: ctx.abortSignal,
					useWebhook: Boolean(account.config.webhookUrl),
					webhookUrl: account.config.webhookUrl,
					webhookSecret: account.config.webhookSecret,
					webhookPath: account.config.webhookPath,
					legacyWebhook: account.config.legacyWebhook,
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
				const { nextConfig, changed, cleared } = clearAccountFieldsFromConfigSection({
					cfg,
					sectionKey: "telegram",
					accountId,
					fields: ["botToken"]
				});
				const loggedOut = resolveTelegramAccount({
					cfg: nextConfig,
					accountId
				}).tokenSource === "none";
				if (changed) await getTelegramRuntime().config.replaceConfigFile({
					nextConfig,
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
		matchesToolContextTarget: ({ target, toolContext }) => {
			return [toolContext.currentMessagingTarget, toolContext.currentChannelId].some((currentTarget) => currentTarget != null && telegramMessagingTargetsMatch(target, currentTarget));
		},
		resolveReplyToMode: ({ cfg, accountId }) => resolveTelegramConfigAccessorAccount({
			cfg,
			accountId
		}).config.replyToMode ?? "off",
		buildToolContext: buildTelegramThreadingToolContext,
		resolveAutoThreadId: resolveTelegramAutoThreadId,
		resolveCurrentChannelId: ({ to, threadId }) => {
			if (threadId == null) return to;
			const parsed = parseTelegramTarget(to);
			return parsed.messageThreadId != null || parsed.directMessagesTopicId != null ? to : `${to}:topic:${threadId}`;
		}
	},
	outbound: telegramChannelOutbound
});
//#endregion
export { fetchTelegramChatId as a, resolveTelegramAutoThreadId as c, resolveTelegramGroupToolPolicy as i, collectTelegramStatusIssues as n, lookupTelegramChatId as o, resolveTelegramGroupRequireMention as r, resolveTelegramChatLookupFetch as s, telegramPlugin as t };
