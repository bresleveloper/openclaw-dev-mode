import { i as resolveLineAccount, r as resolveDefaultLineAccountId, t as listLineAccountIds } from "./accounts-BBEFMYbY.mjs";
import { t as hasLineCredentials } from "./account-helpers-BSUyZwLm.mjs";
import { S as LineChannelConfigSchema, _ as resolveLineGroupLookupIds, a as renderLineCard, b as normalizeAllowFrom, f as buildLineQuickReplyFallbackText, g as resolveLineGroupConfigEntry, h as resolveExactLineGroupConfigKey, n as createLineQuickReply, o as renderLinePresentation, p as getLineRuntime, r as lineMessageActions, t as LINE_PRESENTATION_CAPABILITIES } from "./rich-messages-d8CmBVJj.mjs";
import { F as inferLineTargetChatType, I as normalizeLineMessagingTarget, O as reportLineQuoteCarrierMissing, T as canCarryLineQuoteToken, j as buildLineMediaMessage, k as resolveLineQuoteToken, s as createLineSendReceipt, t as explainLineRefusal } from "./send-retry-DbfiHBPd.mjs";
import { r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-CcfKJKtr.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { buildDmGroupAccountAllowlistAdapter, createFlatAllowlistOverrideResolver } from "openclaw/plugin-sdk/allowlist-config-edit";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { buildChannelGroupsScopeTree, createRestrictSendersChannelSecurity, resolveScopeRequireMention } from "openclaw/plugin-sdk/channel-policy";
import { createChannelDirectoryAdapter, createResolvedDirectoryEntriesLister } from "openclaw/plugin-sdk/directory-runtime";
import { describeWebhookAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { clearAccountFieldsFromConfigSection, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { isRecord, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parseAccessGroupAllowFromEntry } from "openclaw/plugin-sdk/access-groups";
import { firstDefined } from "openclaw/plugin-sdk/allow-from";
import { createAccountStatusSink, defineChannelMessageAdapter, listMessageReceiptPlatformIds } from "openclaw/plugin-sdk/channel-outbound";
import { buildTokenChannelStatusSummary, collectIssuesForEnabledAccounts, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, createDependentCredentialStatusIssueCollector } from "openclaw/plugin-sdk/status-helpers";
import { createChannelPartialDeliveryError, isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { createAttachedChannelResultAdapter, createEmptyChannelResult } from "openclaw/plugin-sdk/channel-send-result";
import { PlatformMessageNotDispatchedError } from "openclaw/plugin-sdk/error-runtime";
import { resolveOutboundMediaUrls } from "openclaw/plugin-sdk/reply-payload";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/line/src/bindings.ts
function normalizeLineConversationId(raw) {
	const trimmed = raw?.trim() ?? "";
	if (!trimmed) return null;
	return (trimmed.match(/^line:(?:(?:user|group|room):)?(.+)$/i)?.[1] ?? trimmed).trim() || null;
}
function resolveLineCommandConversation(params) {
	const conversationId = normalizeLineConversationId(params.originatingTo) ?? normalizeLineConversationId(params.commandTo) ?? normalizeLineConversationId(params.fallbackTo);
	return conversationId ? { conversationId } : null;
}
function resolveLineInboundConversation(params) {
	const conversationId = normalizeLineConversationId(params.conversationId) ?? normalizeLineConversationId(params.to);
	return conversationId ? { conversationId } : null;
}
const lineBindingsAdapter = {
	compileConfiguredBinding: ({ conversationId }) => {
		const normalized = normalizeLineConversationId(conversationId);
		return normalized ? { conversationId: normalized } : null;
	},
	matchInboundConversation: ({ compiledBinding, conversationId }) => {
		const normalizedIncoming = normalizeLineConversationId(conversationId);
		if (!normalizedIncoming || compiledBinding.conversationId !== normalizedIncoming) return null;
		return {
			conversationId: normalizedIncoming,
			matchPriority: 2
		};
	},
	resolveCommandConversation: ({ originatingTo, commandTo, fallbackTo }) => resolveLineCommandConversation({
		originatingTo,
		commandTo,
		fallbackTo
	}),
	resolveInboundConversation: ({ to, conversationId }) => resolveLineInboundConversation({
		to,
		conversationId
	})
};
//#endregion
//#region extensions/line/src/config-adapter.ts
function normalizeLineAllowFrom(entry) {
	return entry.replace(/^line:(?:user:)?/i, "");
}
const lineConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "line",
	listAccountIds: listLineAccountIds,
	resolveAccount: (cfg, accountId) => resolveLineAccount({
		cfg,
		accountId: accountId ?? void 0
	}),
	defaultAccountId: resolveDefaultLineAccountId,
	clearBaseFields: [
		"channelAccessToken",
		"channelSecret",
		"tokenFile",
		"secretFile",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => normalizeStringEntries(allowFrom).map(normalizeLineAllowFrom)
});
const lineChannelPluginCommon = {
	meta: {
		id: "line",
		label: "LINE",
		selectionLabel: "LINE (Messaging API)",
		detailLabel: "LINE Bot",
		docsPath: "/channels/line",
		docsLabel: "line",
		blurb: "LINE Messaging API bot for Japan/Taiwan/Thailand markets.",
		systemImage: "message.fill",
		quickstartAllowFrom: true
	},
	capabilities: {
		chatTypes: ["direct", "group"],
		reactions: false,
		threads: false,
		media: true,
		nativeCommands: false,
		blockStreaming: true
	},
	reload: { configPrefixes: ["channels.line"] },
	configSchema: LineChannelConfigSchema,
	config: {
		...lineConfigAdapter,
		isConfigured: (account) => hasLineCredentials(account),
		describeAccount: (account) => describeWebhookAccountSnapshot({
			account,
			configured: hasLineCredentials(account),
			extra: {
				tokenSource: account.tokenSource ?? void 0,
				signingSecretSource: account.signingSecretSource ?? void 0,
				tokenStatus: account.tokenStatus,
				signingSecretStatus: account.signingSecretStatus
			}
		})
	}
};
//#endregion
//#region extensions/line/src/doctor.ts
const GROUP_DEFAULTS_KEY = "*";
function classifyAllowFrom(values) {
	const entries = Array.isArray(values) ? normalizeAllowFrom(values).entries : [];
	return {
		covered: entries.some((entry) => parseAccessGroupAllowFromEntry(entry) === null),
		referenced: entries.some((entry) => parseAccessGroupAllowFromEntry(entry) !== null)
	};
}
/**
* Read the group map one scope at a time, the way account resolution does.
*
* `mergeAccountConfig` spreads account keys over channel keys and LINE declares no
* nested object keys, so an account that authors `groups` replaces the channel-level
* map outright instead of merging entry by entry. Reading both scopes together would
* credit an account with groups its runtime never sees.
*/
function readGroupEntries(account, parent) {
	const groups = isRecord(account?.groups) ? account.groups : parent?.groups;
	if (!isRecord(groups)) return [];
	return Object.entries(groups).filter((entry) => isRecord(entry[1]));
}
function inspectLineGroupCoverage(params) {
	const empty = {
		group: [],
		defaults: [],
		channel: []
	};
	const entries = readGroupEntries(params.account, params.parent);
	const groups = Object.fromEntries(entries);
	const defaults = groups[GROUP_DEFAULTS_KEY];
	const defaultCoverage = classifyAllowFrom(firstDefined(defaults?.allowFrom, params.groupAllowFrom));
	let covered = defaults?.enabled !== false && defaultCoverage.covered;
	const referenceBacked = defaults?.enabled !== false && defaultCoverage.referenced ? [GROUP_DEFAULTS_KEY] : [];
	const uncovered = [];
	for (const [id, group] of entries) {
		if (id === GROUP_DEFAULTS_KEY) continue;
		const groupId = resolveLineGroupLookupIds(id)[0];
		if (resolveExactLineGroupConfigKey({
			groups,
			groupId
		}) !== id) continue;
		const effectiveGroup = resolveLineGroupConfigEntry(groups, { groupId });
		if (effectiveGroup?.enabled === false) continue;
		const allowlist = classifyAllowFrom(firstDefined(effectiveGroup?.allowFrom, params.groupAllowFrom));
		if (allowlist.referenced) referenceBacked.push(id);
		if (allowlist.covered) covered = true;
		else if (allowlist.referenced) continue;
		else if (group.allowFrom !== void 0) empty.group.push(id);
		else if (defaults?.allowFrom !== void 0) empty.defaults.push(id);
		else if (params.groupAllowFrom !== void 0) empty.channel.push(id);
		else uncovered.push(id);
	}
	return {
		covered,
		referenceBacked,
		uncovered,
		empty
	};
}
function readLineGroupCoverage(params) {
	const { account, parent } = params;
	return inspectLineGroupCoverage({
		account,
		...parent ? { parent } : {},
		groupAllowFrom: firstDefined(account.groupAllowFrom, parent?.groupAllowFrom)
	});
}
function readGroupPolicy(value) {
	return typeof value === "string" ? value : void 0;
}
function isLineGroupAllowlistScope(params) {
	return params.channelName === "line" && (readGroupPolicy(params.account.groupPolicy) ?? readGroupPolicy(params.parent?.groupPolicy)) === "allowlist";
}
function formatGroupIds(ids) {
	return ids.map((id) => `"${id}"`).join(", ");
}
/** Name blocked groups when a working per-group allowlist makes the shared warning untrue. */
function collectLineEmptyAllowlistExtraWarnings(params) {
	if (!isLineGroupAllowlistScope(params)) return [];
	const { covered, referenceBacked, uncovered, empty } = readLineGroupCoverage(params);
	const warnings = [];
	if (referenceBacked.length > 0) {
		const single = referenceBacked.length === 1;
		warnings.push(`- ${params.prefix}.groups: ${single ? "group" : "groups"} ${formatGroupIds(referenceBacked)} ${single ? "uses" : "use"} access-group references. Doctor cannot verify their LINE sender membership here. Check the referenced access groups before relying on group access.`);
	}
	const dropped = (ids) => `- ${params.prefix}.groups: ${ids.length === 1 ? "group" : "groups"} ${formatGroupIds(ids)} ${ids.length === 1 ? "resolves" : "resolve"} to an empty sender allowlist — messages there are silently dropped.`;
	if (empty.group.length > 0) warnings.push(`${dropped(empty.group)} The empty list is authored on ${empty.group.length === 1 ? "that entry" : "those entries"} and overrides every wider list, so add sender IDs there, or remove the allowFrom key to inherit.`);
	if (empty.defaults.length > 0) warnings.push(`${dropped(empty.defaults)} The empty list comes from ${params.prefix}.groups."*".allowFrom, so add sender IDs to that entry, or give ${empty.defaults.length === 1 ? "the group" : "each group"} its own allowFrom.`);
	if (empty.channel.length > 0) warnings.push(`${dropped(empty.channel)} The empty list comes from ${params.prefix}.groupAllowFrom, so add sender IDs there, or give ${empty.channel.length === 1 ? "the group" : "each group"} its own allowFrom.`);
	if ((covered || referenceBacked.length > 0) && uncovered.length > 0) {
		const single = uncovered.length === 1;
		const otherGroups = referenceBacked.length > 0 ? "" : " while your other groups keep working";
		warnings.push(`- ${params.prefix}.groups: ${single ? "group" : "groups"} ${formatGroupIds(uncovered)} ${single ? "has" : "have"} no sender allowlist — messages there are silently dropped${otherGroups}. Add sender IDs under ${params.prefix}.groups.<id>.allowFrom, or under ${params.prefix}.groups."*".allowFrom to cover every group, or to ${params.prefix}.groupAllowFrom.`);
	}
	return warnings;
}
const lineDoctor = {
	collectEmptyAllowlistExtraWarnings: collectLineEmptyAllowlistExtraWarnings,
	shouldSkipDefaultEmptyGroupAllowlistWarning: (params) => {
		if (!isLineGroupAllowlistScope(params)) return false;
		const { covered, referenceBacked } = readLineGroupCoverage(params);
		return covered || referenceBacked.length > 0;
	}
};
//#endregion
//#region extensions/line/src/status.ts
const loadLineProbeRuntime$1 = createLazyRuntimeModule(() => import("./probe.runtime-CMf8b-jB.mjs"));
const collectLineCredentialIssues = createDependentCredentialStatusIssueCollector({
	channel: "line",
	dependencySourceKey: "tokenSource",
	missingPrimaryMessage: "LINE channel access token not configured",
	missingDependentMessage: "LINE channel secret not configured"
});
function readProbeWebhookState(probe) {
	if (!isRecord(probe) || !isRecord(probe.webhook)) return;
	const { status } = probe.webhook;
	return status === "active" || status === "disabled" || status === "unset" ? { status } : void 0;
}
/**
* What to tell an operator about a webhook LINE will not deliver to, or nothing when
* it will. Startup and status both report this, and share one wording so the account
* that logged the warning cannot describe itself differently when asked again.
*
* Each state names the action it needs, and only the action: a registered-but-off
* webhook needs the console switch, an unregistered one needs the route this account
* serves. Both name where to look rather than what is there — a registered URL, and an
* opaque configured route, are strings an operator may be using as a shared secret, and
* neither is needed to act: the console holds the first, and the operator's own config
* holds the second.
*/
function describeLineWebhookDelivery(params) {
	const { webhook } = params;
	if (!webhook || webhook.status === "active") return;
	const consoleTab = "the channel's Messaging API tab in the LINE Developers Console";
	return webhook.status === "disabled" ? {
		message: "LINE is not delivering webhook events: this channel's webhook URL is registered but switched off.",
		fix: `turn Use webhook on in ${consoleTab}`
	} : {
		message: "LINE is not delivering webhook events: this channel has no webhook URL registered.",
		fix: `register your gateway's public HTTPS URL for the route in channels.line.webhookPath (default /line/webhook) in ${consoleTab}, then turn Use webhook on`
	};
}
function collectLineWebhookIssues(accounts) {
	return collectIssuesForEnabledAccounts({
		accounts,
		readAccount: (account) => account.configured === false ? null : account,
		collectIssues: ({ account, accountId, issues }) => {
			const delivery = describeLineWebhookDelivery({ webhook: readProbeWebhookState(account.probe) });
			if (delivery) issues.push({
				channel: "line",
				accountId,
				kind: "config",
				...delivery
			});
		}
	});
}
const lineStatusAdapter = createComputedAccountStatusAdapter({
	defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
	collectStatusIssues: (accounts) => [...collectLineCredentialIssues(accounts), ...collectLineWebhookIssues(accounts)],
	buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot),
	probeAccount: async ({ account, timeoutMs }) => await (await loadLineProbeRuntime$1()).probeLineBot(account.channelAccessToken, timeoutMs),
	resolveAccountSnapshot: ({ account, probe }) => ({
		accountId: account.accountId,
		name: account.name,
		enabled: account.enabled,
		configured: hasLineCredentials(account),
		extra: {
			tokenSource: account.tokenSource,
			signingSecretSource: account.signingSecretSource,
			tokenStatus: account.tokenStatus,
			signingSecretStatus: account.signingSecretStatus,
			mode: "webhook",
			...probe?.quota ? { quota: probe.quota } : {}
		}
	})
});
//#endregion
//#region extensions/line/src/gateway.ts
const loadLineProbeRuntime = createLazyRuntimeModule(() => import("./probe.runtime-CMf8b-jB.mjs"));
const loadLineMonitorRuntime = createLazyRuntimeModule(() => import("./monitor.runtime-BGhxYDKG.mjs"));
const lineGatewayAdapter = {
	startAccount: async (ctx) => {
		const account = ctx.account;
		const statusSink = createAccountStatusSink({
			accountId: account.accountId,
			setStatus: ctx.setStatus
		});
		const token = account.channelAccessToken.trim();
		const secret = account.channelSecret.trim();
		if (!token) throw new Error(`LINE webhook mode requires a non-empty channel access token for account "${account.accountId}".`);
		if (!secret) throw new Error(`LINE webhook mode requires a non-empty channel secret for account "${account.accountId}".`);
		statusSink({ lifecycle: "starting" });
		let lineBotLabel = "";
		try {
			const probe = await (await loadLineProbeRuntime()).probeLineBot(token, 2500);
			const displayName = probe.ok ? probe.bot?.displayName?.trim() : null;
			if (displayName) lineBotLabel = ` (${displayName})`;
			const delivery = describeLineWebhookDelivery({ webhook: probe.ok ? probe.webhook : void 0 });
			if (delivery) ctx.log?.warn(`[${account.accountId}] ${delivery.message} Fix: ${delivery.fix}.`);
		} catch (err) {
			if (getLineRuntime().logging.shouldLogVerbose()) ctx.log?.debug?.(`[${account.accountId}] bot probe failed: ${String(err)}`);
		}
		ctx.log?.info(`[${account.accountId}] starting LINE provider${lineBotLabel}`);
		return await (getLineRuntime().channel.line?.monitorLineProvider ?? (await loadLineMonitorRuntime()).monitorLineProvider)({
			channelAccessToken: token,
			channelSecret: secret,
			accountId: account.accountId,
			config: ctx.cfg,
			runtime: ctx.runtime,
			buildContext: ctx.channelRuntime?.inbound.buildContext,
			abortSignal: ctx.abortSignal,
			webhookPath: account.config.webhookPath,
			statusSink
		});
	},
	logoutAccount: async ({ accountId, cfg }) => {
		const envToken = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim() ?? "";
		const { nextConfig, changed, cleared } = clearAccountFieldsFromConfigSection({
			cfg,
			sectionKey: "line",
			accountId,
			fields: [
				"channelAccessToken",
				"channelSecret",
				"tokenFile",
				"secretFile"
			],
			markClearedOnFieldPresence: true
		});
		if (changed) await getLineRuntime().config.replaceConfigFile({
			nextConfig,
			afterWrite: { mode: "auto" }
		});
		const loggedOut = resolveLineAccount({
			cfg: nextConfig,
			accountId
		}).tokenSource === "none";
		return {
			cleared,
			envToken: Boolean(envToken),
			loggedOut
		};
	}
};
//#endregion
//#region extensions/line/src/group-policy.ts
function resolveLineGroupRequireMention(params) {
	const tree = buildChannelGroupsScopeTree(params.cfg, "line", params.accountId);
	const matchedKey = resolveExactLineGroupConfigKey({
		groups: tree.scopes,
		groupId: params.groupId
	});
	return resolveScopeRequireMention({
		tree,
		path: matchedKey ? [matchedKey] : []
	});
}
//#endregion
//#region extensions/line/src/outbound.ts
const loadLineOutboundRuntime = createLazyRuntimeModule(() => import("./outbound.runtime-QGvZy8Em.mjs"));
function quotedOption(quoteToken) {
	return quoteToken ? { quoteToken } : {};
}
const lineOutboundAdapter = {
	deliveryMode: "direct",
	chunker: (text, limit) => getLineRuntime().channel.text.chunkMarkdownText(text, limit),
	textChunkLimit: 5e3,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	presentationCapabilities: LINE_PRESENTATION_CAPABILITIES,
	renderPresentation: ({ payload, presentation, sourcePresentation, ctx }) => renderLinePresentation(payload, presentation, ctx.to, sourcePresentation),
	sendPayload: async ({ to, payload, accountId, cfg, replyToId, onDeliveryResult, assertDirectAdapterHandoff }) => {
		const runtime = getLineRuntime();
		const outboundRuntime = await loadLineOutboundRuntime();
		const rawLineData = payload.channelData?.line ?? {};
		const lineData = rawLineData.card && !rawLineData.flexMessage ? {
			...rawLineData,
			flexMessage: renderLineCard(rawLineData.card)
		} : rawLineData;
		const lineRuntime = runtime.channel.line;
		const location = lineData.location;
		const locationMessage = location ? outboundRuntime.createLocationMessage(location) : null;
		const sendText = lineRuntime?.pushMessageLine ?? outboundRuntime.pushMessageLine;
		const sendBatch = lineRuntime?.pushMessagesLine ?? outboundRuntime.pushMessagesLine;
		const sendFlex = lineRuntime?.pushFlexMessage ?? outboundRuntime.pushFlexMessage;
		const sendTemplate = lineRuntime?.pushTemplateMessage ?? outboundRuntime.pushTemplateMessage;
		const sendLocation = lineRuntime?.pushLocationMessage ?? outboundRuntime.pushLocationMessage;
		const sendQuickReplies = lineRuntime?.pushTextMessageWithQuickReplies ?? outboundRuntime.pushTextMessageWithQuickReplies;
		const buildTemplate = lineRuntime?.buildTemplateMessageFromPayload ?? outboundRuntime.buildTemplateMessageFromPayload;
		const sendOptions = {
			verbose: false,
			cfg,
			accountId: accountId ?? void 0,
			authorize: assertDirectAdapterHandoff ? () => {
				assertDirectAdapterHandoff();
				return true;
			} : void 0
		};
		let lastResult = null;
		const recordResult = async (resultPromise) => {
			let result;
			try {
				result = await resultPromise;
			} catch (error) {
				const refusal = lastResult !== null || isChannelPartialDeliveryError(error) ? void 0 : await explainLineRefusal({
					error,
					cfg,
					accountId
				});
				throw refusal?.retryable !== void 0 ? new PlatformMessageNotDispatchedError(refusal.reason, {
					cause: error,
					retryable: refusal.retryable
				}) : error;
			}
			lastResult = result;
			try {
				await onDeliveryResult?.(createEmptyChannelResult("line", { ...result }));
			} catch (error) {
				throw createChannelPartialDeliveryError(error, {
					messageIds: listMessageReceiptPlatformIds(result.receipt),
					receipt: result.receipt,
					visibleReplySent: true
				});
			}
			return result;
		};
		const quickReplies = lineData.quickReplies ?? [];
		const quickReplyItems = lineData.quickReplyItems ?? [];
		const hasQuickReplies = quickReplies.length > 0 || quickReplyItems.length > 0;
		const quickReply = quickReplyItems.length ? createLineQuickReply(quickReplyItems) : quickReplies.length ? (lineRuntime?.createQuickReplyItems ?? outboundRuntime.createQuickReplyItems)(quickReplies) : void 0;
		const quickReplyLabels = quickReplyItems.length ? quickReplyItems.map((item) => item.label) : quickReplies;
		const sendMessageBatch = async (messages) => {
			if (messages.length === 0) return;
			for (let i = 0; i < messages.length; i += 5) {
				const batch = messages.slice(i, i + 5);
				await recordResult(sendBatch(to, batch, sendOptions));
			}
		};
		let replyQuoteToken = resolveLineQuoteToken({
			cfg,
			accountId,
			chatId: to,
			messageId: replyToId
		});
		const sendTextWithQuickReply = async (text, quoteToken) => {
			if (quickReplyItems.length > 0 && quickReply) {
				await sendMessageBatch([{
					type: "text",
					text,
					quickReply,
					...quotedOption(quoteToken)
				}]);
				return;
			}
			await recordResult(sendQuickReplies(to, text, quickReplies, {
				...sendOptions,
				...quotedOption(quoteToken)
			}));
		};
		const processed = payload.text ? outboundRuntime.processLineMessage(payload.text) : {
			text: "",
			flexMessages: []
		};
		const chunkLimit = runtime.channel.text.resolveTextChunkLimit?.(cfg, "line", accountId ?? void 0, { fallbackLimit: 5e3 }) ?? 5e3;
		const orderedMessages = processed.segments?.flatMap((segment) => segment.type === "flex" ? [segment.message] : runtime.channel.text.chunkMarkdownText(segment.text, chunkLimit).map((text) => ({
			type: "text",
			text
		})));
		const chunks = orderedMessages ? orderedMessages.flatMap((message) => message.type === "text" ? [message.text] : []) : processed.text ? runtime.channel.text.chunkMarkdownText(processed.text, chunkLimit) : [];
		const mediaUrls = resolveOutboundMediaUrls(payload);
		const mediaOptions = {
			mediaKind: lineData.mediaKind,
			previewImageUrl: lineData.previewImageUrl,
			durationMs: lineData.durationMs,
			trackingId: lineData.trackingId
		};
		const shouldSendQuickRepliesInline = chunks.length === 0 && hasQuickReplies;
		const sendMediaMessages = async () => {
			for (const url of mediaUrls) {
				const trimmed = url?.trim();
				if (!trimmed) continue;
				await recordResult((lineRuntime?.sendMessageLine ?? outboundRuntime.sendMessageLine)(to, "", {
					...sendOptions,
					...mediaOptions,
					mediaUrl: trimmed
				}));
			}
		};
		if (!shouldSendQuickRepliesInline) {
			if (lineData.flexMessage) {
				const flexContents = lineData.flexMessage.contents;
				await recordResult(sendFlex(to, lineData.flexMessage.altText, flexContents, sendOptions));
			}
			if (lineData.templateMessage) {
				const template = buildTemplate(lineData.templateMessage);
				if (template?.type === "template") await recordResult(sendTemplate(to, template, sendOptions));
				else if (template) {
					await recordResult(sendText(to, template.text, {
						...sendOptions,
						...quotedOption(replyQuoteToken)
					}));
					replyQuoteToken = void 0;
				}
			}
			if (location) await recordResult(sendLocation(to, location, sendOptions));
			if (!orderedMessages) for (const flexMsg of processed.flexMessages) await recordResult(sendFlex(to, flexMsg.altText, flexMsg.contents, sendOptions));
		}
		const sendMediaAfterText = !(hasQuickReplies && chunks.length > 0);
		if (mediaUrls.length > 0 && !shouldSendQuickRepliesInline && !sendMediaAfterText) await sendMediaMessages();
		if (orderedMessages && !shouldSendQuickRepliesInline) {
			const quotedIndex = orderedMessages.findIndex(canCarryLineQuoteToken);
			if (replyQuoteToken && quotedIndex < 0) reportLineQuoteCarrierMissing(to);
			for (const [index, message] of orderedMessages.entries()) {
				const isLast = index === orderedMessages.length - 1;
				const quoteToken = index === quotedIndex ? replyQuoteToken : void 0;
				if (message.type === "flex") {
					if (isLast && quickReply) await sendMessageBatch([{
						...message,
						quickReply
					}]);
					else await recordResult(sendFlex(to, message.altText, message.contents, sendOptions));
				} else if (isLast && hasQuickReplies) await sendTextWithQuickReply(message.text, quoteToken);
				else await recordResult(sendText(to, message.text, {
					...sendOptions,
					...quotedOption(quoteToken)
				}));
			}
		} else if (chunks.length > 0) for (const [i, chunk] of chunks.entries()) {
			const isLast = i === chunks.length - 1;
			const quoteToken = i === 0 ? replyQuoteToken : void 0;
			if (isLast && hasQuickReplies) await sendTextWithQuickReply(chunk, quoteToken);
			else await recordResult(sendText(to, chunk, {
				...sendOptions,
				...quotedOption(quoteToken)
			}));
		}
		else if (shouldSendQuickRepliesInline) {
			const quickReplyMessages = [];
			if (lineData.flexMessage) quickReplyMessages.push(outboundRuntime.createFlexMessage(lineData.flexMessage.altText, lineData.flexMessage.contents));
			if (lineData.templateMessage) {
				const template = buildTemplate(lineData.templateMessage);
				if (template) quickReplyMessages.push(template.type === "text" ? {
					...template,
					...quotedOption(replyQuoteToken)
				} : template);
			}
			if (locationMessage) quickReplyMessages.push(locationMessage);
			for (const flexMsg of processed.flexMessages) quickReplyMessages.push(outboundRuntime.createFlexMessage(flexMsg.altText, flexMsg.contents));
			for (const url of mediaUrls) {
				const trimmed = url?.trim();
				if (!trimmed) continue;
				quickReplyMessages.push(await buildLineMediaMessage(trimmed, mediaOptions, to));
			}
			if (quickReplyMessages.length > 0 && quickReply) {
				const lastIndex = quickReplyMessages.length - 1;
				quickReplyMessages[lastIndex] = {
					...quickReplyMessages[lastIndex],
					quickReply
				};
				await sendMessageBatch(quickReplyMessages);
			} else if (quickReply) await sendTextWithQuickReply(buildLineQuickReplyFallbackText(quickReplyLabels), replyQuoteToken);
		}
		if (mediaUrls.length > 0 && !shouldSendQuickRepliesInline && sendMediaAfterText) await sendMediaMessages();
		const completedResult = lastResult;
		if (!completedResult) throw new Error("Message must be non-empty for LINE sends");
		return createEmptyChannelResult("line", { ...completedResult });
	},
	...createAttachedChannelResultAdapter({
		channel: "line",
		sendText: async (ctx) => await lineOutboundAdapter.sendPayload({
			...ctx,
			payload: { text: ctx.text }
		}),
		sendMedia: async ({ cfg, to, text, mediaUrl, accountId, replyToId, assertDirectAdapterHandoff }) => await (await loadLineOutboundRuntime()).sendMessageLine(to, text, {
			verbose: false,
			mediaUrl,
			cfg,
			accountId: accountId ?? void 0,
			authorize: assertDirectAdapterHandoff ? () => {
				assertDirectAdapterHandoff();
				return true;
			} : void 0,
			quoteToken: resolveLineQuoteToken({
				cfg,
				accountId,
				chatId: to,
				messageId: replyToId
			})
		})
	})
};
function toLineMessageSendResult(result, kind) {
	const source = result;
	const receipt = result.receipt ?? (result.messageId ? createLineSendReceipt({
		messageId: result.messageId,
		chatId: source.chatId ?? "",
		kind
	}) : void 0);
	if (!receipt) throw new Error("LINE message adapter send did not return a receipt");
	return {
		messageId: result.messageId || receipt.primaryPlatformMessageId,
		receipt
	};
}
const lineMessageAdapter = defineChannelMessageAdapter({
	id: "line",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		replyTo: true,
		messageSendingHooks: true
	} },
	send: {
		text: async ({ onDeliveryResult, ...ctx }) => {
			return toLineMessageSendResult(await lineOutboundAdapter.sendPayload({
				...ctx,
				payload: { text: ctx.text },
				onDeliveryResult: async (deliveryResult) => {
					await onDeliveryResult?.(toLineMessageSendResult(deliveryResult, "text"));
				}
			}), "text");
		},
		media: async ({ onDeliveryResult, ...ctx }) => {
			return toLineMessageSendResult(await lineOutboundAdapter.sendPayload({
				...ctx,
				payload: {
					text: ctx.text,
					mediaUrl: ctx.mediaUrl
				},
				onDeliveryResult: async (deliveryResult) => {
					await onDeliveryResult?.(toLineMessageSendResult(deliveryResult, "media"));
				}
			}), "media");
		}
	},
	receive: {
		defaultAckPolicy: "after_receive_record",
		supportedAckPolicies: ["after_receive_record"]
	}
});
//#endregion
//#region extensions/line/src/channel.ts
const loadLineChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-BtkeDELb.mjs"));
const lineSecurityAdapter = createRestrictSendersChannelSecurity({
	channelKey: "line",
	resolveDmPolicy: (account) => account.config.dmPolicy,
	resolveDmAllowFrom: (account) => account.config.allowFrom,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "LINE groups",
	openScope: "any member in groups",
	groupPolicyPath: "channels.line.groupPolicy",
	groupAllowFromPath: "channels.line.groupAllowFrom",
	mentionGated: false,
	findingTitle: "LINE security warning",
	policyPathSuffix: "dmPolicy",
	approveHint: "openclaw pairing approve line <code>",
	normalizeDmEntry: (raw) => raw.replace(/^line:(?:user:)?/i, "")
});
function normalizeLineDirectoryId(entry, kind) {
	const id = normalizeLineMessagingTarget(entry);
	return id && inferLineTargetChatType(id) === kind ? id : null;
}
const linePlugin = createChatChannelPlugin({
	base: {
		id: "line",
		...lineChannelPluginCommon,
		setupWizard: lineSetupWizard,
		groups: { resolveRequireMention: resolveLineGroupRequireMention },
		allowlist: buildDmGroupAccountAllowlistAdapter({
			channelId: "line",
			resolveAccount: ({ cfg, accountId }) => resolveLineAccount({
				cfg,
				accountId: accountId ?? void 0
			}),
			normalize: ({ cfg, accountId, values }) => lineConfigAdapter.formatAllowFrom({
				cfg,
				accountId,
				allowFrom: values
			}),
			resolveDmAllowFrom: (account) => account.config.allowFrom,
			resolveGroupAllowFrom: (account) => account.config.groupAllowFrom,
			resolveDmPolicy: (account) => account.config.dmPolicy,
			resolveGroupPolicy: (account) => account.config.groupPolicy,
			resolveGroupOverrides: createFlatAllowlistOverrideResolver({
				resolveRecord: (account) => account.config.groups,
				label: (groupId) => groupId,
				resolveEntries: (groupCfg) => groupCfg?.allowFrom
			})
		}),
		messaging: {
			targetPrefixes: ["line"],
			normalizeTarget: normalizeLineMessagingTarget,
			inferTargetChatType: ({ to }) => inferLineTargetChatType(to),
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target }) => {
				const peerId = normalizeLineMessagingTarget(target);
				const chatType = inferLineTargetChatType(target);
				if (!peerId || !chatType) return null;
				const isRoom = peerId.startsWith("R");
				return buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: "line",
					accountId,
					recipientSessionExact: true,
					peer: {
						kind: chatType,
						id: peerId
					},
					chatType,
					from: chatType === "direct" ? `line:${peerId}` : isRoom ? `line:room:${peerId}` : `line:group:${peerId}`,
					to: peerId
				});
			},
			resolveInboundConversation: lineBindingsAdapter.resolveInboundConversation,
			targetResolver: {
				looksLikeId: (id) => {
					const trimmed = id?.trim();
					if (!trimmed) return false;
					return /^[UCR][a-f0-9]{32}$/i.test(trimmed) || /^line:/i.test(trimmed);
				},
				hint: "<userId|groupId|roomId>"
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: createResolvedDirectoryEntriesLister({
				kind: "user",
				resolveAccount: (cfg, accountId) => resolveLineAccount({
					cfg,
					accountId: accountId ?? void 0
				}),
				resolveSources: ({ config }) => [
					config.allowFrom ?? [],
					config.groupAllowFrom ?? [],
					...Object.values(config.groups ?? {}).map((group) => group?.allowFrom ?? [])
				],
				normalizeId: (entry) => normalizeLineDirectoryId(entry, "direct")
			}),
			listGroups: createResolvedDirectoryEntriesLister({
				kind: "group",
				resolveAccount: (cfg, accountId) => resolveLineAccount({
					cfg,
					accountId: accountId ?? void 0
				}),
				resolveSources: ({ config }) => [Object.keys(config.groups ?? {})],
				normalizeId: (entry) => normalizeLineDirectoryId(resolveLineGroupLookupIds(entry)[0] ?? "", "group")
			})
		}),
		setupContract: lineSetupContract,
		status: lineStatusAdapter,
		doctor: lineDoctor,
		gateway: lineGatewayAdapter,
		heartbeat: { sendTyping: async ({ cfg, to, accountId }) => {
			const chatId = normalizeLineMessagingTarget(to);
			if (!chatId || inferLineTargetChatType(chatId) !== "direct") return;
			const { showLoadingAnimation } = await loadLineChannelRuntime();
			await showLoadingAnimation(chatId, {
				cfg,
				accountId: accountId ?? void 0
			});
		} },
		message: lineMessageAdapter,
		actions: lineMessageActions,
		bindings: lineBindingsAdapter,
		conversationBindings: { defaultTopLevelPlacement: "current" },
		agentPrompt: {
			messageToolCapabilities: () => ["inlineButtons"],
			messageToolHints: () => [
				"",
				"### LINE structured output",
				"Use `presentation.blocks` for buttons, yes/no choices, and selectable options; LINE maps them to Flex controls or quick replies.",
				"Use `channelData.line.location` for a location pin and `channelData.line.card` for one LINE-specific card. Supported card types are `media_player`, `event`, `agenda`, `device`, and `appletv_remote`.",
				"Send rich output with the structured message fields. Double-bracket marker text has no special meaning."
			]
		}
	},
	pairing: { text: {
		idLabel: "lineUserId",
		message: "OpenClaw: your access has been approved.",
		normalizeAllowEntry: createPairingPrefixStripper(/^line:(?:user:)?/i),
		notify: async ({ cfg, id, message, accountId }) => {
			const account = (getLineRuntime().channel.line?.resolveLineAccount ?? resolveLineAccount)({
				cfg,
				accountId
			});
			if (!account.channelAccessToken) throw new Error("LINE channel access token not configured");
			await (getLineRuntime().channel.line?.pushMessageLine ?? (await loadLineChannelRuntime()).pushMessageLine)(id, message, {
				cfg,
				accountId: account.accountId,
				channelAccessToken: account.channelAccessToken
			});
		}
	} },
	security: lineSecurityAdapter,
	threading: { scopedAccountReplyToMode: {
		resolveAccount: (cfg, accountId) => resolveLineAccount({
			cfg,
			accountId: accountId ?? void 0
		}),
		resolveReplyToMode: (account) => account.config.replyToMode,
		fallback: "off"
	} },
	outbound: lineOutboundAdapter
});
//#endregion
export { lineChannelPluginCommon as n, linePlugin as t };
