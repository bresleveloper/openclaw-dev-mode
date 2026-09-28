import { r as createRuntimeConfigReader } from "./runtime-snapshot-DbgWcCyV.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-rFSl4uOZ.mjs";
import { o as defineStableChannelIngressIdentity } from "./runtime-DRt6NcU3.mjs";
import { n as firstDefined } from "./allow-from-Dq2DvsNl.mjs";
import "./channel-outbound-r_EvcKqq.mjs";
import { t as hasControlCommand } from "./command-detection-CzqdezWl.mjs";
import { t as resolveChannelGroupPolicy } from "./group-policy-CsBeuTe8.mjs";
import { I as formatChannelProgressDraftDiffStat, N as isChannelProgressAttentionLine, j as selectPlanChecklistSteps, r as compactChannelProgressDraftLine } from "./streaming-BRWehz40.mjs";
import { a as mergeTelegramAccountConfig } from "./account-selection-DO7ZNLRi.mjs";
import { t as createInboundEventDeliveryCorrelation } from "./inbound-event-delivery-CTNTAGiS.mjs";
import "./runtime-config-snapshot-Bc7N5SpK.mjs";
import "./command-auth-native-l-wQHDTC.mjs";
import "./command-detection-BoX4adnw.mjs";
import "./channel-ingress-runtime-C6YRK_Rb.mjs";
import "./channel-policy-DjBYx8KH.mjs";
import { i as normalizeAllowFrom, t as expandTelegramAllowFromWithAccessGroups } from "./access-groups-Brlf3mfl.mjs";
import { l as stripTelegramInternalPrefixes } from "./topic-conversation-BlxRQJEK.mjs";
import { n as getTelegramRuntime } from "./runtime-DiTlx7dk.mjs";
import { O as getTelegramTextParts, p as isTelegramCommandsAllowFromConfigured } from "./helpers-TUQ5gNqR.mjs";
import { F as renderTelegramHtmlText, K as resolveTelegramScopedGroupConfig, _ as boldRichText, i as buildTelegramRichBlocksPlan, u as markdownToTelegramRichBlocks, v as italicRichText, y as paragraphBlock, z as escapeTelegramHtml } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { $ as isTelegramMessageFromCurrentBot, vt as evaluateTelegramGroupBaseAccess, yt as evaluateTelegramGroupPolicyAccess } from "./send-DZq2Pk_C.mjs";
//#region extensions/telegram/src/ingress.ts
const TELEGRAM_CHANNEL_ID = "telegram";
const telegramIngressIdentity = defineStableChannelIngressIdentity({
	key: "telegram-user-id",
	authentication: "verified",
	normalize: (value) => {
		const normalized = normalizeAllowFrom([value]);
		return normalized.entries[0] ?? (normalized.hasWildcard ? "*" : null);
	},
	sensitivity: "pii"
});
function createTelegramIngressSubject(senderId) {
	return { stableId: senderId };
}
function createTelegramIngressResolver(params) {
	return getTelegramRuntime().channel.inbound.ingress.createResolver({
		channelId: TELEGRAM_CHANNEL_ID,
		accountId: params.accountId ?? "default",
		identity: telegramIngressIdentity,
		cfg: params.cfg,
		useDefaultPairingStore: params.useDefaultPairingStore
	});
}
function telegramAllowEntries(allow) {
	return [...allow.hasWildcard ? ["*"] : [], ...allow.entries];
}
function resolveTelegramNativeCommandBody(params) {
	const entity = params.msg.entities?.find((entry) => entry.type === "bot_command" && entry.offset === 0);
	const text = params.msg.text;
	if (!entity || !text) return;
	const [name, target] = text.slice(1, entity.length).toLowerCase().split("@");
	if (!name || target && target !== params.botUsername?.toLowerCase()) return;
	const commandName = params.nativeCommandNames?.get(name);
	return commandName ? `/${commandName}${text.slice(entity.length)}` : void 0;
}
function telegramConversation(params) {
	return {
		kind: params.isGroup ? "group" : "direct",
		id: String(params.chatId),
		...params.resolvedThreadId != null ? { threadId: String(params.resolvedThreadId) } : {}
	};
}
async function buildTelegramNativeCommandOwnerContext(params) {
	const conversation = telegramConversation(params);
	const channelIngress = await createTelegramIngressResolver({
		accountId: params.accountId,
		cfg: params.cfg,
		useDefaultPairingStore: false
	}).event({
		subject: createTelegramIngressSubject(params.senderId),
		conversation,
		contextBinding: {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			messageId: params.messageId,
			inboundEventKind: "user_request"
		},
		event: {
			kind: "native-command",
			authMode: "none",
			mayPair: false
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: "allowlist",
		command: false
	});
	return getTelegramRuntime().channel.inbound.buildContext({
		channel: "telegram",
		accountId: params.accountId,
		channelIngress,
		messageId: params.messageId,
		from: params.isGroup ? `telegram:group:${params.chatId}` : `telegram:${params.chatId}`,
		sender: { id: params.senderId },
		conversation,
		route: {
			agentId: params.agentId,
			routeSessionKey: params.sessionKey
		},
		reply: {
			to: `telegram:${params.chatId}`,
			messageThreadId: params.resolvedThreadId
		},
		message: {
			rawBody: params.rawBody,
			inboundEventKind: "user_request"
		}
	});
}
async function resolveTelegramCommandIngressAuthorization(params) {
	const ownerAccess = resolveCommandAuthorization({
		cfg: params.cfg,
		ctx: params.ownerContext ?? {
			Provider: "telegram",
			AccountId: params.accountId,
			ChatType: params.isGroup ? "group" : "direct",
			SenderId: params.senderId
		},
		commandAuthorized: false
	});
	const commandsAllowFromConfigured = isTelegramCommandsAllowFromConfigured(params.cfg);
	const authorizedByConfig = commandsAllowFromConfigured ? ownerAccess.isAuthorizedSender : ownerAccess.senderIsOwner;
	if (commandsAllowFromConfigured || authorizedByConfig) {
		const authorized = authorizedByConfig;
		const shouldBlockControlCommand = params.allowTextCommands === true && params.hasControlCommand === true && !authorized;
		return {
			requested: true,
			authorized,
			authorizedByConfig,
			senderIsOwner: ownerAccess.senderIsOwner,
			assertOwnerCurrent: ownerAccess.assertOwnerCurrent,
			shouldBlockControlCommand,
			reasonCode: shouldBlockControlCommand ? "control_command_unauthorized" : "command_authorized"
		};
	}
	const effectiveDmAllow = params.effectiveDmAllow ?? normalizeAllowFrom([]);
	const effectiveGroupAllow = params.effectiveGroupAllow ?? normalizeAllowFrom([]);
	const commandOwner = [...params.isGroup && params.includeDmAllowForGroupCommands === false ? [] : telegramAllowEntries(effectiveDmAllow), ...ownerAccess.ownerList];
	return {
		...(await createTelegramIngressResolver({
			accountId: params.accountId,
			cfg: params.cfg
		}).command({
			subject: createTelegramIngressSubject(params.senderId),
			conversation: telegramConversation(params),
			event: { kind: params.eventKind ?? "native-command" },
			dmPolicy: params.dmPolicy,
			groupPolicy: "allowlist",
			allowFrom: commandOwner,
			groupAllowFrom: params.isGroup ? telegramAllowEntries(effectiveGroupAllow) : [],
			command: {
				allowTextCommands: params.allowTextCommands ?? false,
				hasControlCommand: params.hasControlCommand ?? false,
				modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff ?? "configured"
			}
		})).commandAccess,
		authorizedByConfig,
		senderIsOwner: ownerAccess.senderIsOwner,
		assertOwnerCurrent: ownerAccess.assertOwnerCurrent
	};
}
async function resolveTelegramNativeCommandAdmission(params) {
	if (resolveTelegramNativeCommandBody(params) === void 0) return false;
	return (await resolveTelegramCommandIngressAuthorization(params)).authorizedByConfig;
}
async function resolveTelegramEventIngressAuthorization(params) {
	return (await createTelegramIngressResolver({ accountId: params.accountId }).event({
		subject: createTelegramIngressSubject(params.senderId),
		conversation: telegramConversation(params),
		event: {
			kind: params.eventKind,
			authMode: "inbound"
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: params.enforceGroupAuthorization ? "allowlist" : "open",
		allowFrom: telegramAllowEntries(params.effectiveDmAllow),
		groupAllowFrom: params.enforceGroupAuthorization ? telegramAllowEntries(params.effectiveGroupAllow) : []
	})).ingress;
}
//#endregion
//#region extensions/telegram/src/history-policy.ts
function createTelegramHistoryPolicyAssertion(params, cfg, getConfig) {
	return () => {
		params.assertCurrent?.();
		if (getConfig() !== cfg) throw new Error("Telegram history policy changed during the read; retry with current permissions.");
	};
}
async function isTelegramHistoryNodeAllowed(params) {
	params.assertCurrent?.();
	const { node } = params;
	const msg = node.sourceMessage;
	if (node.historyEligible !== true || msg.chat.type !== "group" && msg.chat.type !== "supergroup" || node.threadBinding?.threadSpec.scope === "dm" || node.threadBinding?.threadSpec.scope === "direct-messages" || String(msg.chat.id) !== String(params.chatId) || node.threadId !== (params.threadId === void 0 ? void 0 : String(params.threadId))) return false;
	return await isTelegramHistorySenderAllowed({
		...params,
		senderId: msg.from?.id == null ? "" : String(msg.from.id),
		message: msg
	});
}
async function isTelegramHistorySenderAllowed(params) {
	params.assertCurrent?.();
	const getConfig = createRuntimeConfigReader(params.cfg);
	const cfg = getConfig();
	const assertCurrent = createTelegramHistoryPolicyAssertion(params, cfg, getConfig);
	const telegramCfg = mergeTelegramAccountConfig(cfg, params.accountId);
	if (!cfg.channels?.telegram || cfg.channels.telegram.enabled === false || telegramCfg.enabled === false) return false;
	const { groupConfig, topicConfig } = resolveTelegramScopedGroupConfig(telegramCfg, params.chatId, params.threadId);
	const ownBot = params.message !== void 0 && params.botUserId !== void 0 && isTelegramMessageFromCurrentBot(params.message, params.botUserId);
	const senderId = params.senderId;
	const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
	const effectiveGroupAllow = normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
		cfg,
		accountId: params.accountId,
		senderId,
		allowFrom: groupAllowOverride ?? telegramCfg.groupAllowFrom ?? telegramCfg.allowFrom
	}));
	assertCurrent();
	if (!evaluateTelegramGroupBaseAccess({
		isGroup: true,
		groupConfig,
		topicConfig,
		hasGroupAllowOverride: groupAllowOverride !== void 0,
		effectiveGroupAllow,
		senderId,
		enforceAllowOverride: !ownBot,
		requireSenderForAllowOverride: true
	}).allowed) return false;
	const text = params.message && getTelegramTextParts(params.message);
	const commandAccess = !ownBot && text !== void 0 && (hasControlCommand(text.text, cfg) || text.entities.some((entity) => entity.type === "bot_command" && entity.offset === 0)) ? await resolveTelegramCommandIngressAuthorization({
		accountId: params.accountId,
		cfg,
		dmPolicy: "pairing",
		isGroup: true,
		chatId: params.chatId,
		resolvedThreadId: params.threadId,
		senderId: senderId ?? "",
		effectiveGroupAllow,
		eventKind: "message",
		allowTextCommands: true,
		hasControlCommand: true,
		modeWhenAccessGroupsOff: "allow",
		includeDmAllowForGroupCommands: false
	}) : void 0;
	assertCurrent();
	if (commandAccess && !commandAccess.authorized) return false;
	return evaluateTelegramGroupPolicyAccess({
		isGroup: true,
		chatId: params.chatId,
		cfg,
		telegramCfg,
		groupConfig,
		topicConfig,
		effectiveGroupAllow,
		senderId,
		resolveGroupPolicy: (chatId, currentCfg) => resolveChannelGroupPolicy({
			cfg: currentCfg,
			channel: "telegram",
			accountId: params.accountId,
			groupId: String(chatId)
		}),
		enforcePolicy: true,
		enforceAllowlistAuthorization: !ownBot && !commandAccess?.authorizedByConfig,
		allowEmptyAllowlistEntries: false,
		requireSenderForAllowlistAuthorization: true,
		checkChatAllowlist: true
	}).allowed;
}
async function readTelegramHistoryWindow(params) {
	if (!Number.isSafeInteger(params.limit) || params.limit <= 0) return [];
	const getConfig = createRuntimeConfigReader(params.cfg);
	const cfg = getConfig();
	const assertCurrent = createTelegramHistoryPolicyAssertion(params, cfg, getConfig);
	assertCurrent();
	const candidates = await params.cache.readHistoryWindow({
		accountId: params.accountId,
		chatId: params.chatId,
		threadId: params.threadId,
		before: params.before,
		limit: Math.max(256, params.limit)
	});
	assertCurrent();
	const messages = [];
	for (let index = candidates.length - 1; index >= 0 && messages.length < params.limit; index--) {
		const node = candidates[index];
		const allowed = await isTelegramHistoryNodeAllowed({
			...params,
			cfg,
			node,
			assertCurrent
		});
		assertCurrent();
		if (allowed) messages.push(node);
	}
	messages.reverse();
	return messages;
}
async function readTelegramHistory(params) {
	if (params.limit <= 0) return {
		messages: [],
		hasMore: false
	};
	const getConfig = createRuntimeConfigReader(params.cfg);
	const cfg = getConfig();
	const assertCurrent = createTelegramHistoryPolicyAssertion(params, cfg, getConfig);
	const ascending = params.after !== void 0 && params.before === void 0;
	let before = params.before;
	let after = params.after;
	const messages = [];
	while (messages.length <= params.limit) {
		assertCurrent();
		const page = await params.cache.readHistory({
			accountId: params.accountId,
			chatId: params.chatId,
			threadId: params.threadId,
			before,
			after,
			limit: Math.min(100, params.limit + 1)
		});
		assertCurrent();
		const candidates = ascending ? page.messages : page.messages.toReversed();
		for (const node of candidates) {
			const allowed = await isTelegramHistoryNodeAllowed({
				...params,
				cfg,
				node,
				assertCurrent
			});
			assertCurrent();
			if (allowed) {
				messages.push(node);
				if (messages.length > params.limit) break;
			}
		}
		if (!page.hasMore || page.messages.length === 0) break;
		if (ascending) after = page.messages.at(-1).messageId;
		else before = page.messages[0].messageId;
	}
	const hasMore = messages.length > params.limit;
	if (hasMore) messages.pop();
	if (!ascending) messages.reverse();
	assertCurrent();
	return {
		messages,
		hasMore
	};
}
//#endregion
//#region extensions/telegram/src/inbound-event-delivery.ts
function normalizeTelegramDeliveryTarget(value) {
	return stripTelegramInternalPrefixes(value).toLowerCase();
}
function stripTelegramTopicTarget(value) {
	return value.replace(/:topic:\d+$/u, "");
}
function hasTelegramTopicTarget(value) {
	return /:topic:\d+$/u.test(value);
}
function telegramDeliveryTargetsMatch(expected, actual) {
	const expectedTarget = normalizeTelegramDeliveryTarget(expected);
	const actualTarget = normalizeTelegramDeliveryTarget(actual);
	if (expectedTarget === actualTarget) return true;
	if (hasTelegramTopicTarget(expectedTarget)) return false;
	const expectedBase = stripTelegramTopicTarget(expectedTarget);
	const actualBase = stripTelegramTopicTarget(actualTarget);
	return expectedBase === actualBase && (expectedTarget === expectedBase || actualTarget === actualBase);
}
const telegramInboundEventDelivery = createInboundEventDeliveryCorrelation({ targetsMatch: telegramDeliveryTargetsMatch });
//#endregion
//#region extensions/telegram/src/progress-draft-preview.ts
function isTelegramProgressPriorityLine(line) {
	if (typeof line === "string") return false;
	const status = line.status?.toLowerCase();
	return line.kind === "approval" || status === "failed" || status === "error" || status === "blocked";
}
function literalProgressText(text, style) {
	const escaped = escapeTelegramHtml(text);
	if (style === "code") return {
		html: `<code>${escaped}</code>`,
		rich: {
			type: "code",
			text
		}
	};
	return style === "bold" ? {
		html: `<b>${escaped}</b>`,
		rich: boldRichText(text)
	} : style === "italic" ? {
		html: `<i>${escaped}</i>`,
		rich: italicRichText(text)
	} : {
		html: escaped,
		rich: text
	};
}
function joinProgressText(parts, separator) {
	return {
		html: parts.map((part) => part.html).join(separator === "\n" ? "<br>" : separator),
		rich: parts.flatMap((part, index) => index ? [separator, part.rich] : [part.rich])
	};
}
function markdownProgressText(text) {
	const { blocks } = markdownToTelegramRichBlocks(text, { skipEntityDetection: true });
	return {
		html: renderTelegramHtmlText(text),
		rich: blocks[0]?.type === "paragraph" ? blocks[0].text : text
	};
}
function progressLineText(line, maxLineChars) {
	const compact = (text) => compactChannelProgressDraftLine(text, maxLineChars);
	if (typeof line === "string" || !line.icon && (!line.label || line.label === "Commentary")) return markdownProgressText(compact(typeof line === "string" ? line : line.text));
	const label = [line.icon, line.label].filter(Boolean).join(" ");
	const parts = [literalProgressText(label, "bold")];
	const detail = line.detail && line.detail !== line.label ? line.detail : void 0;
	if (detail) parts.push(literalProgressText(compact(detail)));
	else if (!line.toolName && line.text.trim() && line.text.trim() !== label) parts.push(literalProgressText(compact(line.text)));
	if (line.status && line.status !== "completed" && line.status !== line.detail) parts.push(literalProgressText(line.status, "italic"));
	return joinProgressText(parts, " ");
}
function renderTelegramProgressDraftPreview(snapshot, options) {
	const { maxLines, maxLineChars } = options;
	const activity = snapshot.statusHeadline || snapshot.plan?.length ? snapshot.lines.filter((line) => typeof line !== "string" && !line.id?.startsWith("reasoning:")) : snapshot.lines;
	const isPriorityLine = options.toolProgress ? isTelegramProgressPriorityLine : isChannelProgressAttentionLine;
	const attention = activity.filter(isPriorityLine);
	const checklist = selectPlanChecklistSteps(snapshot.plan ?? [], { maxLines: maxLines - attention.length });
	const checklistLines = checklist.steps.length + (checklist.summary ? 1 : 0);
	const lineBudget = Math.max(0, maxLines - checklistLines);
	const lines = [...activity.filter((line) => !isPriorityLine(line)), ...attention];
	const visibleLines = lineBudget ? lines.slice(-lineBudget) : [];
	const diffStat = visibleLines.length + checklistLines < maxLines ? formatChannelProgressDraftDiffStat(snapshot.diffStat) : void 0;
	const label = checklistLines || visibleLines.length + (diffStat ? 1 : 0) < maxLines ? snapshot.label : void 0;
	const blocks = [];
	const html = [];
	const addParagraph = (text) => {
		blocks.push(paragraphBlock(text.rich));
		html.push(text.html);
	};
	if (label) addParagraph(literalProgressText(compactChannelProgressDraftLine(label, maxLineChars), "bold"));
	if (snapshot.statusHeadline) {
		const text = compactChannelProgressDraftLine(snapshot.statusHeadline, maxLineChars);
		const plain = snapshot.statusHeadlineFormat === "plain";
		const status = plain ? literalProgressText(text, "code") : markdownProgressText(text);
		addParagraph(label || plain ? status : {
			html: `<b>${status.html}</b>`,
			rich: {
				type: "bold",
				text: status.rich
			}
		});
	}
	if (visibleLines.length) addParagraph(joinProgressText(visibleLines.map((line) => progressLineText(line, maxLineChars)), "\n"));
	if (checklist.summary) addParagraph(literalProgressText(compactChannelProgressDraftLine(checklist.summary, maxLineChars)));
	if (checklist.steps.length) blocks.push({
		type: "list",
		items: checklist.steps.map((step) => {
			const active = step.status === "in_progress";
			const text = literalProgressText(compactChannelProgressDraftLine(active ? `${step.step} (in progress)` : step.step, maxLineChars), active ? "bold" : void 0);
			const completed = step.status === "completed";
			html.push(`${completed ? "[x]" : "[ ]"} ${text.html}`);
			return {
				blocks: [paragraphBlock(text.rich)],
				has_checkbox: true,
				is_checked: completed || void 0
			};
		})
	});
	if (diffStat) addParagraph(literalProgressText(compactChannelProgressDraftLine(diffStat, maxLineChars)));
	const plan = buildTelegramRichBlocksPlan(blocks, { skipEntityDetection: true });
	return options.richMessages ? {
		text: plan.plainText,
		richMessage: plan.richMessage,
		complete: true
	} : {
		text: html.join("<br>"),
		parseMode: "HTML",
		complete: true
	};
}
//#endregion
export { readTelegramHistory as a, createTelegramIngressResolver as c, resolveTelegramEventIngressAuthorization as d, resolveTelegramNativeCommandAdmission as f, isTelegramHistorySenderAllowed as i, createTelegramIngressSubject as l, telegramAllowEntries as m, telegramInboundEventDelivery as n, readTelegramHistoryWindow as o, resolveTelegramNativeCommandBody as p, isTelegramHistoryNodeAllowed as r, buildTelegramNativeCommandOwnerContext as s, renderTelegramProgressDraftPreview as t, resolveTelegramCommandIngressAuthorization as u };
