import { c as normalizeFeishuExternalKey, d as listEnabledFeishuAccounts, f as listFeishuAccountIds, g as resolveFeishuRuntimeAccount, h as resolveFeishuAccount, m as resolveDefaultFeishuAccountId } from "./doctor-contract-DyOo8NvC.mjs";
import { l as normalizeFeishuTarget, s as detectIdType, u as resolveReceiveIdType } from "./conversation-id-C1ofUfU8.mjs";
import { t as getFeishuRuntime } from "./runtime-C5JxBWZp.mjs";
import { c as withFeishuMessageDispatch, o as captureFeishuSendAuthority, r as createFeishuClient, s as runBeforeFeishuMessageDispatch } from "./client-CcxmEkoy.mjs";
import { normalizeAccountId, normalizeOptionalAccountId, resolveMergedAccountConfig } from "openclaw/plugin-sdk/account-resolution";
import { compileAllowlist, resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
import { ToolAuthorizationError } from "openclaw/plugin-sdk/channel-actions";
import { normalizeChannelDmPolicy } from "openclaw/plugin-sdk/channel-config-helpers";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { PlatformMessageNotDispatchedError, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { legacyInteractiveReplyToPresentation, normalizeLegacyInteractiveReply, normalizeMessagePresentation, renderMessagePresentationChartFallbackText, renderMessagePresentationFallbackText, renderMessagePresentationTableFallbackText, renderPresentationForDelivery, resolveLegacyInteractiveTextFallback } from "openclaw/plugin-sdk/interactive-runtime";
import { parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries, normalizeTrimmedStringList, readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { convertMarkdownTables, markdownToIRWithMeta } from "openclaw/plugin-sdk/text-chunking";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { defineStableChannelIngressIdentity } from "openclaw/plugin-sdk/channel-ingress-runtime";
import path from "node:path";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTable } from "micromark-extension-gfm-table";
import { chunkMarkdownTextWithMode } from "openclaw/plugin-sdk/reply-chunking";
import { createAcceptedChannelDeliveryResult, createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { wrapExternalContent, writeExternalFileWithinRoot } from "openclaw/plugin-sdk/security-runtime";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import { Type } from "typebox";
import { isBlockedHostnameOrIp, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { detectMime, mediaKindFromMime } from "openclaw/plugin-sdk/media-mime";
import { MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS, buildOutboundMediaLoadOptions, runFfmpeg, runFfprobe } from "openclaw/plugin-sdk/media-runtime";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
import { saveMediaStream } from "openclaw/plugin-sdk/media-store";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { escapeHtml, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/feishu/src/card-interaction.ts
const FEISHU_CARD_INTERACTION_VERSION = "ocf1";
function isInteractionKind(value) {
	return value === "button" || value === "quick" || value === "meta";
}
function isMetadataValue(value) {
	return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function createFeishuCardInteractionEnvelope(envelope) {
	return {
		oc: FEISHU_CARD_INTERACTION_VERSION,
		...envelope
	};
}
function buildFeishuCardActionTextFallback(event) {
	const actionValue = event.action.value;
	if (isRecord(actionValue)) {
		if (typeof actionValue.text === "string") return actionValue.text;
		if (typeof actionValue.command === "string") return actionValue.command;
		return JSON.stringify(actionValue);
	}
	return String(actionValue);
}
function decodeFeishuCardAction(params) {
	const { event, now = Date.now() } = params;
	const actionValue = event.action.value;
	if (!isRecord(actionValue) || actionValue.oc !== "ocf1") return {
		kind: "legacy",
		text: buildFeishuCardActionTextFallback(event)
	};
	if (!isInteractionKind(actionValue.k) || typeof actionValue.a !== "string" || !actionValue.a) return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.q !== void 0 && typeof actionValue.q !== "string") return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.m !== void 0 && (!isRecord(actionValue.m) || !Object.values(actionValue.m).every(isMetadataValue))) return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.c !== void 0) {
		if (!isRecord(actionValue.c)) return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.u !== void 0 && typeof actionValue.c.u !== "string" || actionValue.c.h !== void 0 && typeof actionValue.c.h !== "string" || actionValue.c.s !== void 0 && typeof actionValue.c.s !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.e !== void 0 && !Number.isFinite(actionValue.c.e)) return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.t !== void 0 && actionValue.c.t !== "p2p" && actionValue.c.t !== "group") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (typeof actionValue.c.e === "number" && actionValue.c.e < now) return {
			kind: "invalid",
			reason: "stale"
		};
		const expectedUser = actionValue.c.u?.trim();
		if (expectedUser && expectedUser !== (event.operator.open_id ?? "").trim()) return {
			kind: "invalid",
			reason: "wrong_user"
		};
		const expectedChat = actionValue.c.h?.trim();
		if (expectedChat && expectedChat !== (event.context.chat_id ?? "").trim()) return {
			kind: "invalid",
			reason: "wrong_conversation"
		};
	}
	return {
		kind: "structured",
		envelope: actionValue
	};
}
//#endregion
//#region extensions/feishu/src/chat-type.ts
function normalizeFeishuChatType(value) {
	if (value === "group" || value === "topic_group") return "group";
	if (value === "p2p") return "p2p";
}
function normalizeFeishuChatMode(value) {
	return value === "topic" ? "group" : normalizeFeishuChatType(value);
}
function resolveFeishuChatType(chat) {
	return normalizeFeishuChatMode(chat.chat_mode) ?? normalizeFeishuChatType(chat.chat_type);
}
//#endregion
//#region extensions/feishu/src/policy.ts
const FEISHU_PROVIDER_PREFIX_RE = /^(feishu|lark):/i;
const FEISHU_TYPED_PREFIX_RE = /^(chat|group|channel|user|dm|open_id):/i;
const FEISHU_ID_KIND = "plugin:feishu-id";
const feishuIngressIdentity = defineStableChannelIngressIdentity({
	key: "feishu-id",
	kind: FEISHU_ID_KIND,
	normalize: normalizeFeishuAllowEntry,
	sensitivity: "pii",
	aliases: [{
		key: "feishu-alt-id",
		kind: FEISHU_ID_KIND,
		normalizeEntry: normalizeFeishuAllowEntry,
		normalizeSubject: normalizeFeishuAllowEntry,
		sensitivity: "pii"
	}],
	isWildcardEntry: (entry) => normalizeFeishuAllowEntry(entry) === "*",
	resolveEntryId: ({ entryIndex }) => `feishu-entry-${entryIndex + 1}`
});
function normalizeFeishuAllowEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "*";
	let withoutProviderPrefix = trimmed;
	while (FEISHU_PROVIDER_PREFIX_RE.test(withoutProviderPrefix)) withoutProviderPrefix = withoutProviderPrefix.replace(FEISHU_PROVIDER_PREFIX_RE, "").trim();
	if (withoutProviderPrefix === "*") return "*";
	const lowered = normalizeOptionalLowercaseString(withoutProviderPrefix) ?? "";
	if (!lowered) return "";
	const prefixed = lowered.match(FEISHU_TYPED_PREFIX_RE);
	if (prefixed?.[1]) {
		const kind = [
			"chat",
			"group",
			"channel"
		].includes(prefixed[1]) ? "chat" : "user";
		const value = withoutProviderPrefix.slice(prefixed[0].length).trim();
		return value === "*" ? "*" : value ? `${kind}:${value}` : "";
	}
	const detectedType = detectIdType(withoutProviderPrefix);
	if (detectedType === "chat_id") return `chat:${withoutProviderPrefix}`;
	if (detectedType === "open_id" || detectedType === "user_id") return `user:${withoutProviderPrefix}`;
	return "";
}
function normalizeFeishuGroupPolicy(policy) {
	return policy === "allowall" ? "open" : policy;
}
function createFeishuIngressSubject(params) {
	const ids = [params.primaryId, ...params.alternateIds ?? []].map((value) => value?.trim()).filter((value) => Boolean(value));
	return {
		stableId: ids[0],
		aliases: { "feishu-alt-id": ids[1] }
	};
}
function createFeishuIngressResolver(params) {
	return getFeishuRuntime().channel.inbound.ingress.createResolver({
		channelId: "feishu",
		accountId: normalizeAccountId(params.accountId) ?? "default",
		identity: feishuIngressIdentity,
		cfg: params.cfg,
		...params.readAllowFromStore ? { readStoreAllowFrom: params.readAllowFromStore } : {}
	});
}
async function resolveFeishuDmIngressAccess(params) {
	return await createFeishuIngressResolver(params).message({
		subject: createFeishuIngressSubject({
			primaryId: params.senderOpenId,
			alternateIds: [params.senderUserId]
		}),
		conversation: {
			kind: "direct",
			id: params.conversationId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		event: { mayPair: params.mayPair },
		dmPolicy: normalizeChannelDmPolicy(params.dmPolicy ?? void 0) ?? "pairing",
		groupPolicy: "disabled",
		allowFrom: params.allowFrom ?? [],
		...params.command ? { command: params.command } : {}
	});
}
async function resolveFeishuGroupConversationIngressAccess(params) {
	const groupPolicy = normalizeFeishuGroupPolicy(params.groupPolicy);
	const groupAllowFrom = groupPolicy === "allowlist" && params.groupExplicitlyConfigured ? [...params.groupAllowFrom ?? [], params.chatId] : params.groupAllowFrom ?? [];
	return await createFeishuIngressResolver(params).message({
		subject: createFeishuIngressSubject({ primaryId: params.chatId }),
		conversation: {
			kind: "group",
			id: params.chatId,
			threadId: params.threadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		dmPolicy: "disabled",
		groupPolicy,
		groupAllowFrom
	});
}
async function resolveFeishuGroupSenderActivationIngressAccess(params) {
	const groupAllowFrom = params.allowFrom ?? [];
	return await createFeishuIngressResolver(params).message({
		subject: createFeishuIngressSubject({
			primaryId: params.senderOpenId,
			alternateIds: [params.senderUserId]
		}),
		conversation: {
			kind: "group",
			id: params.chatId,
			threadId: params.threadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		dmPolicy: "disabled",
		groupPolicy: groupAllowFrom.length > 0 ? "allowlist" : "open",
		groupAllowFrom,
		mentionFacts: {
			canDetectMention: true,
			wasMentioned: params.mentionedBot
		},
		policy: { activation: {
			requireMention: params.requireMention,
			allowTextCommands: false
		} },
		...params.command ? { command: params.command } : {}
	});
}
function resolveFeishuExplicitGroupConfigKey(params) {
	const groups = params.cfg?.groups ?? {};
	const groupId = params.groupId?.trim();
	if (!groupId || groupId === "*") return;
	if (Object.hasOwn(groups, groupId)) return groupId;
	const lowered = normalizeOptionalLowercaseString(groupId) ?? "";
	return Object.keys(groups).find((key) => key !== "*" && normalizeOptionalLowercaseString(key) === lowered);
}
function resolveFeishuGroupConfig(params) {
	if (!params.groupId?.trim()) return;
	const groups = params.cfg?.groups ?? {};
	const key = resolveFeishuExplicitGroupConfigKey(params);
	return key ? groups[key] : groups["*"];
}
function hasExplicitFeishuGroupConfig(params) {
	return resolveFeishuExplicitGroupConfigKey(params) !== void 0;
}
function resolveFeishuGroupToolPolicy(params) {
	return resolveFeishuGroupConfig({
		cfg: params.cfg.channels?.feishu,
		groupId: params.groupId
	})?.tools;
}
function resolveFeishuReplyPolicy(params) {
	if (params.isDirectMessage) return { requireMention: false };
	const feishuCfg = params.cfg.channels?.feishu;
	const resolvedCfg = resolveMergedAccountConfig({
		channelConfig: feishuCfg,
		accounts: feishuCfg?.accounts,
		accountId: normalizeAccountId(params.accountId),
		normalizeAccountId,
		omitKeys: ["defaultAccount"]
	});
	const groupRequireMention = resolveFeishuGroupConfig({
		cfg: resolvedCfg,
		groupId: params.groupId
	})?.requireMention;
	return { requireMention: typeof groupRequireMention === "boolean" ? groupRequireMention : typeof resolvedCfg.requireMention === "boolean" ? resolvedCfg.requireMention : params.groupPolicy !== "open" };
}
//#endregion
//#region extensions/feishu/src/read-policy.ts
function isActionContext(ctx) {
	return "toolContext" in ctx;
}
function normalizeChatId(raw) {
	if (!raw) return "";
	return normalizeFeishuTarget(raw) ?? raw.trim();
}
function normalizeFeishuAllowlist(entries) {
	return (entries ?? []).map((entry) => normalizeFeishuAllowEntry(String(entry))).filter(Boolean);
}
function readContextFields(ctx) {
	if (isActionContext(ctx)) return {
		accountId: normalizeOptionalString(ctx.accountId),
		currentChannelId: normalizeOptionalString(ctx.toolContext?.currentChannelId),
		currentProvider: normalizeOptionalString(ctx.toolContext?.currentChannelProvider),
		requesterAccountId: normalizeOptionalString(ctx.requesterAccountId),
		requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
		directOperator: ctx.conversationReadOrigin === "direct-operator"
	};
	return {
		accountId: normalizeOptionalString(ctx.agentAccountId),
		currentChannelId: normalizeOptionalString(ctx.nativeChannelId),
		currentProvider: normalizeOptionalString(ctx.messageChannel ?? ctx.deliveryContext?.channel),
		requesterAccountId: normalizeOptionalString(ctx.deliveryContext?.accountId),
		requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
		directOperator: ctx.conversationReadOrigin === "direct-operator"
	};
}
function isCurrentChat(params) {
	const context = readContextFields(params.ctx);
	return context.currentProvider?.toLowerCase() === "feishu" && context.requesterAccountId === params.account.accountId && (context.accountId ?? params.account.accountId) === params.account.accountId && normalizeChatId(context.currentChannelId) === normalizeChatId(params.chatId);
}
function resolveFeishuReadGroupPolicy(cfg, account) {
	return resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.feishu !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	}).groupPolicy;
}
function isFeishuGroupReadAllowed(cfg, account, chatId, current) {
	const policy = resolveFeishuReadGroupPolicy(cfg, account);
	if (policy === "disabled") return false;
	if (resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	})?.enabled === false) return false;
	if (current || policy === "open") return true;
	const explicitlyConfigured = hasExplicitFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	});
	const normalizedChatId = normalizeFeishuAllowEntry(chatId);
	return explicitlyConfigured || resolveAllowlistMatchByCandidates({
		allowList: normalizeFeishuAllowlist(account.config.groupAllowFrom),
		candidates: [{
			value: normalizedChatId,
			source: "id"
		}]
	}).allowed;
}
function isFeishuGroupReadEnabled(cfg, account, chatId) {
	if (resolveFeishuReadGroupPolicy(cfg, account) === "disabled") return false;
	return resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	})?.enabled !== false;
}
function canEnumerateAllFeishuPeers(account) {
	return compileAllowlist(normalizeFeishuAllowlist(account.config.allowFrom)).wildcard;
}
function assertFeishuChatReadAllowed(params) {
	const authorization = resolveFeishuChatReadPreliminaryAuthorization(params);
	if (authorization.decision !== "allow") throw new ToolAuthorizationError("Feishu read target is not allowed.");
	return authorization.chatId;
}
function resolveFeishuChatReadPreliminaryAuthorization(params) {
	const chatId = normalizeChatId(params.chatId);
	const resolvedChatType = normalizeFeishuChatType(params.chatType);
	const knownGroup = resolvedChatType === "group" || params.chatType === void 0 && hasExplicitFeishuGroupConfig({
		cfg: params.account.config,
		groupId: chatId
	});
	const knownDm = resolvedChatType === "p2p";
	const current = isCurrentChat({
		account: params.account,
		chatId,
		ctx: params.ctx
	});
	const directOperator = readContextFields(params.ctx).directOperator;
	const groupAllowed = directOperator ? isFeishuGroupReadEnabled(params.cfg, params.account, chatId) : isFeishuGroupReadAllowed(params.cfg, params.account, chatId, current);
	const dmAllowed = directOperator || current || canEnumerateAllFeishuPeers(params.account);
	if (knownGroup) return {
		chatId,
		decision: groupAllowed ? "allow" : "deny"
	};
	if (knownDm) return {
		chatId,
		decision: dmAllowed ? "allow" : "deny"
	};
	if (groupAllowed === dmAllowed) return {
		chatId,
		decision: groupAllowed ? "allow" : "deny"
	};
	return {
		chatId,
		decision: "needs-metadata"
	};
}
async function readFeishuChatInfoWithAuthorization(params, readChatInfo) {
	let chat;
	try {
		chat = await readChatInfo(params.preliminary.chatId);
	} catch (error) {
		if (params.preliminary.decision === "needs-metadata") assertFeishuChatReadAllowed({
			cfg: params.cfg,
			account: params.account,
			chatId: params.preliminary.chatId,
			ctx: params.ctx
		});
		throw error;
	}
	assertFeishuChatReadAllowed({
		cfg: params.cfg,
		account: params.account,
		chatId: params.preliminary.chatId,
		chatType: resolveFeishuChatType(chat),
		ctx: params.ctx
	});
	return chat;
}
function authorizeFeishuChatMemberRead(params) {
	const chatId = assertFeishuChatReadAllowed(params);
	const chatType = normalizeFeishuChatType(params.chatType);
	if (chatType === "group") return {
		kind: "group",
		chatId
	};
	if (chatType !== "p2p") throw new ToolAuthorizationError("Feishu chat member reads require a known chat type.");
	if (!isCurrentChat({
		account: params.account,
		chatId,
		ctx: params.ctx
	})) throw new ToolAuthorizationError("Feishu direct-chat member reads require the current conversation.");
	const requesterSenderId = normalizeChatId(readContextFields(params.ctx).requesterSenderId);
	if (!requesterSenderId) throw new ToolAuthorizationError("Feishu direct-chat member identity is unavailable.");
	const requesterSenderIdType = detectIdType(requesterSenderId);
	if (requesterSenderIdType !== "open_id" && requesterSenderIdType !== "user_id") throw new ToolAuthorizationError("Feishu direct-chat member identity type is unavailable.");
	if (params.memberIdType && params.memberIdType !== requesterSenderIdType) throw new ToolAuthorizationError("Feishu direct-chat member identifier type must match the current sender.");
	if (params.memberId && normalizeChatId(params.memberId) !== requesterSenderId) throw new ToolAuthorizationError("Feishu direct-chat member reads are limited to the current sender.");
	return {
		kind: "direct",
		chatId,
		memberId: requesterSenderId,
		memberIdType: requesterSenderIdType
	};
}
function canEnumerateAllFeishuGroups(cfg, account) {
	const policy = resolveFeishuReadGroupPolicy(cfg, account);
	return policy === "open" || policy === "allowlist" && compileAllowlist(normalizeFeishuAllowlist(account.config.groupAllowFrom)).wildcard;
}
//#endregion
//#region extensions/feishu/src/markdown.ts
const FEISHU_POST_MAX_BYTES = 30720;
function shouldUseFeishuCard(text) {
	return /```[\s\S]*?```/.test(text) || /\|.+\|[\r\n]+\|[-:| ]+\|/.test(text);
}
/** One parser contract for Feishu message and document Markdown decisions. */
function parseFeishuMarkdown(text) {
	return fromMarkdown(text, {
		extensions: [gfmTable()],
		mdastExtensions: [gfmTableFromMarkdown()]
	});
}
function visitFeishuMarkdown(root, visitor) {
	const pending = [root];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) continue;
		visitor(node);
		for (let index = (node.children?.length ?? 0) - 1; index >= 0; index -= 1) {
			const child = node.children?.[index];
			if (child) pending.push(child);
		}
	}
}
function buildFeishuPostMentionElements(mentions) {
	if (!mentions?.length) return [];
	const elements = [];
	for (const mention of mentions) {
		const userId = mention.openId.trim();
		if (!userId) continue;
		const userName = mention.name.trim();
		elements.push({
			tag: "at",
			user_id: userId,
			...userName ? { user_name: userName } : {}
		});
	}
	return elements;
}
function buildFeishuPostMessageContent(params) {
	const content = [...buildFeishuPostMentionElements(params.mentions), {
		tag: "md",
		text: params.messageText
	}];
	return JSON.stringify({ zh_cn: { content: [content] } });
}
function assertFeishuPostWithinEnvelope(content, label) {
	if (Buffer.byteLength(content, "utf8") > FEISHU_POST_MAX_BYTES) throw new Error(`${label} exceeds the 30 KB rich-post API limit`);
}
function collectSoftBreakOffsets(text) {
	const root = parseFeishuMarkdown(text);
	const offsets = [];
	visitFeishuMarkdown(root, (node) => {
		if (node.type !== "text") return;
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		if (start === void 0 || end === void 0) return;
		for (let offset = start; offset < end; offset += 1) {
			const char = text[offset];
			if (char === "\n") {
				if (text[offset - 1] !== "\r") offsets.push(offset);
				continue;
			}
			if (char === "\r") {
				offsets.push(offset);
				if (text[offset + 1] === "\n") offset += 1;
			}
		}
	});
	return offsets.toSorted((left, right) => left - right);
}
/**
* Materialize CommonMark soft breaks for Feishu post `md` rendering.
*
* The parser identifies only soft breaks, then upgrades them to CommonMark
* hard breaks. Structural line endings and code, HTML, definitions, setext
* headings, and existing hard breaks retain their source bytes.
*/
function materializeFeishuPostMarkdownSoftBreaks(text) {
	if (!text.includes("\n") && !text.includes("\r")) return text;
	const softBreakOffsets = collectSoftBreakOffsets(text);
	if (softBreakOffsets.length === 0) return text;
	const parts = [];
	let cursor = 0;
	for (const offset of softBreakOffsets) {
		const lineEnding = text[offset] === "\r" ? text[offset + 1] === "\n" ? "\r\n" : "\r" : "\n";
		parts.push(text.slice(cursor, offset), "  ", lineEnding);
		cursor = offset + lineEnding.length;
	}
	parts.push(text.slice(cursor));
	return parts.join("");
}
/** Keep every platform chunk independently valid Markdown, including fences. */
function chunkFeishuMarkdown(text, limit) {
	return chunkMarkdownTextWithMode(text, limit, "length");
}
function postContentBytes(messageText, mentions) {
	return Buffer.byteLength(buildFeishuPostMessageContent({
		messageText,
		mentions
	}), "utf8");
}
function chunkFeishuPostMarkdown(params) {
	return chunkFeishuMarkdownByEnvelope({
		...params,
		contentBytes: (text, isFirst) => postContentBytes(text, [...params.chunkMentions ?? [], ...isFirst ? params.firstChunkMentions ?? [] : []])
	});
}
/** Measure the actual transport envelope, including UTF-8, JSON escapes and fence wrappers. */
function chunkFeishuMarkdownByEnvelope(params) {
	const { text } = params;
	if (!text) return [];
	const requestedLimit = Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : text.length;
	const initialChunks = params.initialChunks ?? chunkMarkdownTextWithMode(text, requestedLimit, params.mode ?? "length");
	const output = [];
	for (const initialChunk of initialChunks) {
		if (params.contentBytes(initialChunk, output.length === 0) <= FEISHU_POST_MAX_BYTES) {
			output.push(initialChunk);
			continue;
		}
		let adaptiveLimit = Math.max(1, Math.min(requestedLimit, initialChunk.length));
		while (true) {
			const chunks = chunkMarkdownTextWithMode(initialChunk, adaptiveLimit, params.mode ?? "length");
			let largestContentBytes = 0;
			let oversizedChunk;
			for (const [index, chunk] of chunks.entries()) {
				const contentBytes = params.contentBytes(chunk, output.length === 0 && index === 0);
				largestContentBytes = Math.max(largestContentBytes, contentBytes);
				if (contentBytes > FEISHU_POST_MAX_BYTES && oversizedChunk === void 0) oversizedChunk = chunk;
			}
			if (oversizedChunk === void 0) {
				output.push(...chunks);
				break;
			}
			if (adaptiveLimit === 1) throw new Error("Feishu Markdown chunk exceeds the 30 KB API limit");
			adaptiveLimit = Math.max(1, Math.min(adaptiveLimit - 1, Math.floor(adaptiveLimit * FEISHU_POST_MAX_BYTES / largestContentBytes) - 1));
		}
	}
	return output;
}
//#endregion
//#region extensions/feishu/src/native-card.ts
const FEISHU_CARD_TEMPLATES = /* @__PURE__ */ new Set([
	"blue",
	"green",
	"red",
	"orange",
	"purple",
	"indigo",
	"wathet",
	"turquoise",
	"yellow",
	"grey",
	"carmine",
	"violet",
	"lime"
]);
function resolveFeishuCardTemplate(template) {
	const normalized = normalizeOptionalLowercaseString(template);
	if (!normalized || !FEISHU_CARD_TEMPLATES.has(normalized)) return;
	return normalized;
}
function escapeFeishuCardMarkdownText(text) {
	return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function escapeFeishuCardPlainText(text) {
	return escapeFeishuCardMarkdownText(text).replace(/([\\`*_{}[\]()#+\-!|>~])/g, "\\$1");
}
function resolveSafeFeishuButtonUrl(url) {
	const trimmed = typeof url === "string" ? url.trim() : "";
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		return parsed.protocol === "https:" || parsed.protocol === "http:" ? trimmed : void 0;
	} catch {
		return;
	}
}
function sanitizeNativeFeishuButtonBehavior(behavior) {
	if (!isRecord(behavior)) return;
	if (behavior.type === "open_url") {
		const safeUrl = resolveSafeFeishuButtonUrl(behavior.default_url) ?? resolveSafeFeishuButtonUrl(behavior.url);
		return safeUrl ? {
			type: "open_url",
			default_url: safeUrl
		} : void 0;
	}
	if (behavior.type === "callback" && isRecord(behavior.value) && behavior.value.oc === "ocf1") return {
		type: "callback",
		value: behavior.value
	};
}
function resolveFeishuButtonType(style) {
	return style === "primary" || style === "success" ? "primary" : style === "danger" ? "danger" : "default";
}
function sanitizeNativeFeishuCardButton(button) {
	if (!isRecord(button)) return;
	const text = isRecord(button.text) && typeof button.text.content === "string" ? button.text.content : void 0;
	if (!text?.trim()) return;
	const behaviors = Array.isArray(button.behaviors) ? button.behaviors.map(sanitizeNativeFeishuButtonBehavior).filter((behavior) => Boolean(behavior)) : [];
	const rootSafeUrl = resolveSafeFeishuButtonUrl(button.url);
	if (rootSafeUrl) behaviors.push({
		type: "open_url",
		default_url: rootSafeUrl
	});
	if (isRecord(button.value) && button.value.oc === "ocf1") behaviors.push({
		type: "callback",
		value: button.value
	});
	if (behaviors.length === 0) return;
	return {
		tag: "button",
		text: {
			tag: "plain_text",
			content: text
		},
		type: resolveFeishuButtonType(button.type),
		behaviors
	};
}
function sanitizeNativeFeishuCardElements(element) {
	if (!isRecord(element) || typeof element.tag !== "string") return [];
	if (element.tag === "hr") return [{ tag: "hr" }];
	if (element.tag === "markdown" && typeof element.content === "string") return [{
		tag: "markdown",
		content: escapeFeishuCardMarkdownText(element.content)
	}];
	if (element.tag === "div" && isRecord(element.text)) {
		const text = element.text;
		if ((text.tag === "lark_md" || text.tag === "plain_text") && typeof text.content === "string") return [{
			tag: "markdown",
			content: (text.tag === "plain_text" ? escapeFeishuCardPlainText : escapeFeishuCardMarkdownText)(text.content)
		}];
		return [];
	}
	if (element.tag === "button") {
		const button = sanitizeNativeFeishuCardButton(element);
		return button ? [button] : [];
	}
	if (element.tag === "action" && Array.isArray(element.actions)) return element.actions.map(sanitizeNativeFeishuCardButton).filter((action) => Boolean(action));
	return [];
}
function sanitizeNativeFeishuCard(card) {
	const normalizedCard = card.type === "interactive" && isRecord(card.card) ? card.card : card;
	const body = isRecord(normalizedCard.body) ? normalizedCard.body : void 0;
	const elements = (Array.isArray(body?.elements) ? body.elements : Array.isArray(normalizedCard.elements) ? normalizedCard.elements : []).flatMap(sanitizeNativeFeishuCardElements);
	if (elements.length === 0) return;
	const header = isRecord(normalizedCard.header) ? normalizedCard.header : void 0;
	const title = isRecord(header?.title) && typeof header.title.content === "string" ? header.title.content : void 0;
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		...title?.trim() ? { header: {
			title: {
				tag: "plain_text",
				content: title
			},
			template: resolveFeishuCardTemplate(typeof header?.template === "string" ? header.template : void 0) ?? "blue"
		} } : {},
		body: { elements }
	};
}
function readNativeFeishuCardJson(text, options) {
	let trimmed = text?.trim();
	const responsePrefix = options?.responsePrefix;
	if (trimmed && responsePrefix && trimmed.startsWith(responsePrefix)) {
		const suffix = trimmed.slice(responsePrefix.length);
		if (/^\s+\{/.test(suffix)) trimmed = suffix.trimStart();
	}
	if (!trimmed?.startsWith("{") || !trimmed.endsWith("}")) return;
	try {
		const parsed = JSON.parse(trimmed);
		return isRecord(parsed) ? sanitizeNativeFeishuCard(parsed) : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/feishu/src/comment-target.ts
const FEISHU_COMMENT_FILE_TYPES = [
	"doc",
	"docx",
	"file",
	"sheet",
	"slides"
];
function normalizeCommentFileType(value) {
	return typeof value === "string" && FEISHU_COMMENT_FILE_TYPES.includes(value) ? value : void 0;
}
function buildFeishuCommentTarget(params) {
	return `comment:${params.fileType}:${params.fileToken}:${params.commentId}`;
}
function parseFeishuCommentTarget(raw) {
	const trimmed = raw?.trim();
	if (!trimmed?.startsWith("comment:")) return null;
	const parts = trimmed.split(":");
	if (parts.length !== 4) return null;
	const fileType = normalizeCommentFileType(parts[1]);
	const fileToken = parts[2]?.trim();
	const commentId = parts[3]?.trim();
	if (!fileType || !fileToken || !commentId) return null;
	return {
		fileType,
		fileToken,
		commentId
	};
}
//#endregion
//#region extensions/feishu/src/send-rate-limit.ts
const FEISHU_SEND_RATE_LIMIT_CODES = /* @__PURE__ */ new Set([230020, 11232]);
function getFeishuSendRateLimitCode(error) {
	if (!isRecord(error)) return;
	const response = isRecord(error.response) ? error.response : void 0;
	if (response?.status === 429) return 429;
	return getFeishuSendRateLimitCodeFromResponse(response?.data);
}
function getFeishuSendRateLimitCodeFromResponse(response) {
	if (!isRecord(response)) return;
	const code = response.code;
	return typeof code === "number" && FEISHU_SEND_RATE_LIMIT_CODES.has(code) ? code : void 0;
}
//#endregion
//#region extensions/feishu/src/comment-shared.ts
var FeishuReplyCommentError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "FeishuReplyCommentError";
		this.httpStatus = params.httpStatus;
		this.feishuCode = params.feishuCode;
		this.feishuMsg = params.feishuMsg;
		this.feishuLogId = params.feishuLogId;
	}
};
function encodeQuery(params) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		const trimmed = value?.trim();
		if (trimmed) query.set(key, trimmed);
	}
	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
}
function formatFeishuApiError(error, options = {}) {
	if (!isRecord(error)) return typeof error === "string" ? error : JSON.stringify(error);
	const config = isRecord(error.config) ? error.config : void 0;
	const response = isRecord(error.response) ? error.response : void 0;
	const responseData = isRecord(response?.data) ? response?.data : void 0;
	const feishuLogId = readStringValue(responseData?.log_id) || (options.includeNestedErrorLogId ? readStringValue(isRecord(responseData?.error) ? responseData.error.log_id : void 0) : void 0);
	const nestedError = isRecord(responseData?.error) ? responseData.error : void 0;
	return JSON.stringify({
		message: typeof error.message === "string" ? error.message : JSON.stringify(error),
		code: readStringValue(error.code),
		method: readStringValue(config?.method),
		url: readStringValue(config?.url),
		...options.includeConfigParams ? { params: config?.params } : {},
		http_status: typeof response?.status === "number" ? response.status : void 0,
		feishu_code: typeof responseData?.code === "number" ? responseData.code : readStringValue(responseData?.code),
		feishu_msg: readStringValue(responseData?.msg),
		feishu_log_id: feishuLogId,
		feishu_troubleshooter: readStringValue(responseData?.troubleshooter) || readStringValue(nestedError?.troubleshooter)
	});
}
const FEISHU_SEND_RETRY_BASE_MS = 500;
async function requestFeishuApi(request, errorPrefix, options = {}) {
	const assertSendAuthority = captureFeishuSendAuthority();
	try {
		return await retryAsync(async () => {
			assertSendAuthority?.();
			const result = await request();
			const fulfilledRateLimit = getFeishuSendRateLimitCodeFromResponse(result);
			if (fulfilledRateLimit !== void 0) throw Object.assign(/* @__PURE__ */ new Error(`Request fulfilled with rate-limit code ${fulfilledRateLimit}`), { response: {
				status: 200,
				data: result
			} });
			return result;
		}, {
			attempts: 3,
			minDelayMs: FEISHU_SEND_RETRY_BASE_MS,
			shouldRetry: (error) => getFeishuSendRateLimitCode(error) !== void 0
		});
	} catch (error) {
		const details = formatFeishuApiError(error, options);
		throw new Error(`${errorPrefix}: ${details || "unknown error"}`, { cause: error });
	}
}
function readDocsLinkUrl(element) {
	const docsLink = isRecord(element.docs_link) ? element.docs_link : void 0;
	return normalizeOptionalString(docsLink?.url) || normalizeOptionalString(docsLink?.link) || normalizeOptionalString(element.url) || normalizeOptionalString(element.link) || void 0;
}
function readMentionUserId(element) {
	const mention = isRecord(element.mention) ? element.mention : void 0;
	const person = isRecord(element.person) ? element.person : void 0;
	return normalizeOptionalString(person?.user_id) || normalizeOptionalString(mention?.user_id) || normalizeOptionalString(mention?.open_id) || normalizeOptionalString(element.mention_user) || normalizeOptionalString(element.user_id) || void 0;
}
function readMentionDisplayText(element, userId) {
	const mention = isRecord(element.mention) ? element.mention : void 0;
	const mentionName = normalizeOptionalString(mention?.name) || normalizeOptionalString(mention?.display_name) || normalizeOptionalString(element.name);
	return mentionName ? `@${mentionName}` : `@${userId}`;
}
function readElementTextPreservingWhitespace(element) {
	return (isRecord(element.text_run) ? readStringValue(element.text_run.content) || readStringValue(element.text_run.text) : void 0) || readStringValue(element.text) || readStringValue(element.content) || readStringValue(element.name) || void 0;
}
const FEISHU_LINK_TOKEN_MIN_LENGTH = 22;
const FEISHU_LINK_TOKEN_MAX_LENGTH = 28;
const COMMENT_LINK_KIND_ALIASES = /* @__PURE__ */ new Map([
	["doc", "doc"],
	["docs", "doc"],
	["docx", "docx"],
	["sheet", "sheet"],
	["sheets", "sheet"],
	["slide", "slides"],
	["slides", "slides"],
	["file", "file"],
	["files", "file"],
	["wiki", "wiki"],
	["mindnote", "mindnote"],
	["mindnotes", "mindnote"],
	["bitable", "bitable"],
	["base", "base"]
]);
function isReasonableFeishuLinkToken(token) {
	return typeof token === "string" && token.length >= FEISHU_LINK_TOKEN_MIN_LENGTH && token.length <= FEISHU_LINK_TOKEN_MAX_LENGTH;
}
function parseCommentLinkedDocumentPath(pathname) {
	const segments = normalizeStringEntries(pathname.split("/"));
	const offset = segments[0]?.toLowerCase() === "space" ? 1 : 0;
	const kind = COMMENT_LINK_KIND_ALIASES.get(segments[offset]?.toLowerCase() ?? "");
	const token = normalizeOptionalString(segments[offset + 1]);
	if (!kind || !isReasonableFeishuLinkToken(token)) return null;
	return {
		urlKind: kind,
		token
	};
}
function hasResolvedLinkedDocumentReference(link) {
	return link.urlKind !== "unknown" && (Boolean(link.resolvedObjToken) || Boolean(link.wikiNodeToken));
}
function resolveCommentLinkedDocumentFromUrl(params) {
	const link = {
		rawUrl: params.rawUrl,
		urlKind: "unknown"
	};
	try {
		const parsedPath = parseCommentLinkedDocumentPath(new URL(params.rawUrl).pathname);
		if (!parsedPath) return link;
		const { urlKind, token } = parsedPath;
		link.urlKind = urlKind;
		if (urlKind === "wiki") link.wikiNodeToken = token;
		else {
			link.resolvedObjType = urlKind;
			link.resolvedObjToken = token;
		}
		if (link.resolvedObjType && link.resolvedObjToken && normalizeCommentFileType(link.resolvedObjType)) link.isCurrentDocument = params.currentDocument?.fileType === link.resolvedObjType && params.currentDocument.fileToken === link.resolvedObjToken;
	} catch {
		return link;
	}
	return link;
}
function parseCommentContentElements(params) {
	const elements = Array.isArray(params.elements) ? params.elements : [];
	const plainTextParts = [];
	const semanticTextParts = [];
	const mentions = [];
	const linkedDocuments = [];
	const botIds = new Set(normalizeTrimmedStringList(Array.from(params.botOpenIds ?? [])));
	const linkedDocumentKeys = /* @__PURE__ */ new Set();
	let botMentioned = false;
	for (const rawElement of elements) {
		if (!isRecord(rawElement)) continue;
		const element = rawElement;
		const type = normalizeOptionalString(element.type);
		if (type === "mention" || type === "mention_user" || type === "person") {
			const userId = readMentionUserId(element);
			if (userId) {
				const displayText = readMentionDisplayText(element, userId);
				const isBotMention = botIds.has(userId);
				mentions.push({
					userId,
					displayText,
					isBotMention
				});
				plainTextParts.push(displayText);
				if (!isBotMention) semanticTextParts.push(displayText);
				else botMentioned = true;
				continue;
			}
		}
		if (type === "docs_link" || type === "link") {
			const rawUrl = readDocsLinkUrl(element);
			if (rawUrl) {
				plainTextParts.push(rawUrl);
				semanticTextParts.push(rawUrl);
				const linkedDocument = resolveCommentLinkedDocumentFromUrl({
					rawUrl,
					currentDocument: params.currentDocument
				});
				if (hasResolvedLinkedDocumentReference(linkedDocument)) {
					const key = [
						linkedDocument.rawUrl,
						linkedDocument.urlKind,
						linkedDocument.resolvedObjType,
						linkedDocument.resolvedObjToken,
						linkedDocument.wikiNodeToken
					].join(":");
					if (!linkedDocumentKeys.has(key)) {
						linkedDocumentKeys.add(key);
						linkedDocuments.push(linkedDocument);
					}
				}
				continue;
			}
		}
		const text = readElementTextPreservingWhitespace(element);
		if (text) {
			plainTextParts.push(text);
			semanticTextParts.push(text);
		}
	}
	return {
		plainText: normalizeOptionalString(plainTextParts.join("")),
		semanticText: normalizeOptionalString(semanticTextParts.join("").replace(/\s+/g, " ")),
		mentions,
		linkedDocuments,
		botMentioned
	};
}
function extractReplyText(reply) {
	if (!reply || !isRecord(reply.content)) return;
	return parseCommentContentElements({ elements: Array.isArray(reply.content.elements) ? reply.content.elements : [] }).plainText;
}
//#endregion
//#region extensions/feishu/src/comment-reaction.ts
const COMMENT_TYPING_REACTION_TYPE = "Typing";
const COMMENT_REACTION_TIMEOUT_MS = 3e4;
const commentTypingReactionState = /* @__PURE__ */ new Map();
function buildCommentTypingReactionKey(params) {
	return `${params.fileType}:${params.fileToken}:${params.replyId}`;
}
function ensureCommentTypingReactionState(key) {
	const existing = commentTypingReactionState.get(key);
	if (existing) return existing;
	const created = {
		active: false,
		cleaned: false,
		cleanupPromise: void 0
	};
	commentTypingReactionState.set(key, created);
	return created;
}
async function requestCommentTypingReactionWithClient(params) {
	try {
		const response = await params.client.request({
			method: "POST",
			url: `/open-apis/drive/v2/files/${encodeURIComponent(params.fileToken)}/comments/reaction` + encodeQuery({ file_type: params.fileType }),
			data: {
				action: params.action,
				reply_id: params.replyId,
				reaction_type: COMMENT_TYPING_REACTION_TYPE
			},
			timeout: COMMENT_REACTION_TIMEOUT_MS
		});
		if (response.code === 0) return true;
		params.runtime?.log?.(`${params.logPrefix ?? "[feishu]"}: comment typing reaction ${params.action} failed reply=${params.replyId} file=${params.fileType}:${params.fileToken} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"} log_id=${response.log_id ?? response.error?.log_id ?? "unknown"}`);
	} catch (error) {
		params.runtime?.log?.(`${params.logPrefix ?? "[feishu]"}: comment typing reaction ${params.action} threw reply=${params.replyId} file=${params.fileType}:${params.fileToken} error=${formatFeishuApiError(error, { includeNestedErrorLogId: true })}`);
	}
	return false;
}
async function requestCommentTypingReaction(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured || !(account.config.typingIndicator ?? true)) return false;
	return requestCommentTypingReactionWithClient({
		client: createFeishuClient(account),
		fileToken: params.fileToken,
		fileType: params.fileType,
		replyId: params.replyId,
		action: params.action,
		runtime: params.runtime,
		logPrefix: `feishu[${account.accountId}]`
	});
}
async function cleanupCommentTypingReactionByKey(params) {
	const state = ensureCommentTypingReactionState(params.key);
	if (state.cleaned) return false;
	if (state.cleanupPromise) return await state.cleanupPromise;
	const cleanupPromise = (async () => {
		if (!state.active) {
			state.cleaned = true;
			return false;
		}
		const deleted = await params.performDelete();
		if (deleted) {
			state.cleaned = true;
			state.active = false;
		}
		return deleted;
	})();
	state.cleanupPromise = cleanupPromise;
	try {
		return await cleanupPromise;
	} finally {
		state.cleanupPromise = void 0;
		if (state.cleaned) {
			state.active = false;
			commentTypingReactionState.delete(params.key);
		}
	}
}
async function cleanupAmbientCommentTypingReaction(params) {
	const deliveryContext = params.deliveryContext;
	if (deliveryContext?.channel && deliveryContext.channel !== "feishu" && deliveryContext.channel !== "feishu-comment") return false;
	const target = parseFeishuCommentTarget(deliveryContext?.to);
	const replyId = typeof deliveryContext?.threadId === "string" || typeof deliveryContext?.threadId === "number" ? String(deliveryContext.threadId).trim() : "";
	if (!target || !replyId) return false;
	return cleanupCommentTypingReactionByKey({
		key: buildCommentTypingReactionKey({
			...target,
			replyId
		}),
		performDelete: () => requestCommentTypingReactionWithClient({
			...target,
			client: params.client,
			replyId,
			action: "delete",
			runtime: params.runtime,
			logPrefix: "[feishu]"
		})
	});
}
function createCommentTypingReactionLifecycle(params) {
	const key = params.replyId?.trim() ? buildCommentTypingReactionKey({
		...params,
		replyId: params.replyId.trim()
	}) : void 0;
	const state = key ? ensureCommentTypingReactionState(key) : void 0;
	return {
		start: async () => {
			const replyId = params.replyId?.trim();
			if (!state || state.cleaned || state.active || !replyId) return;
			state.active = await requestCommentTypingReaction({
				...params,
				replyId,
				action: "add"
			});
		},
		cleanup: async () => {
			const replyId = params.replyId?.trim();
			if (!key || !replyId) return;
			await cleanupCommentTypingReactionByKey({
				key,
				performDelete: () => requestCommentTypingReaction({
					...params,
					replyId,
					action: "delete"
				})
			});
		}
	};
}
//#endregion
//#region extensions/feishu/src/api-response.ts
function assertFeishuApiSuccess(response, errorPrefix) {
	if (response.code !== 0) throw new Error(errorPrefix === void 0 ? response.msg : `${errorPrefix}: ${response.msg || `code ${response.code}`}`);
}
//#endregion
//#region extensions/feishu/src/drive-schema.ts
const FileType = Type.Union([
	Type.Literal("doc"),
	Type.Literal("docx"),
	Type.Literal("sheet"),
	Type.Literal("bitable"),
	Type.Literal("folder"),
	Type.Literal("file"),
	Type.Literal("mindnote"),
	Type.Literal("shortcut")
]);
const CommentFileType = Type.Union([
	Type.Literal("doc"),
	Type.Literal("docx"),
	Type.Literal("sheet"),
	Type.Literal("file"),
	Type.Literal("slides")
]);
const FeishuDriveSchema = Type.Union([
	Type.Object({
		action: Type.Literal("list"),
		folder_token: Type.Optional(Type.String({ description: "Folder token (optional, omit for root directory)" })),
		page_size: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 200,
			description: "Items per folder page (1-200; requires folder_token)"
		})),
		page_token: Type.Optional(Type.String({ description: "Continuation token from a prior list result (requires the same folder_token)" }))
	}),
	Type.Object({
		action: Type.Literal("info"),
		file_token: Type.String({ description: "File or folder token" }),
		type: FileType
	}),
	Type.Object({
		action: Type.Literal("create_folder"),
		name: Type.String({ description: "Folder name" }),
		folder_token: Type.Optional(Type.String({ description: "Parent folder token (optional, omit for root)" }))
	}),
	Type.Object({
		action: Type.Literal("move"),
		file_token: Type.String({ description: "File token to move" }),
		type: FileType,
		folder_token: Type.String({ description: "Target folder token" })
	}),
	Type.Object({
		action: Type.Literal("delete"),
		file_token: Type.String({ description: "File token to delete" }),
		type: FileType
	}),
	Type.Object({
		action: Type.Literal("list_comments"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(CommentFileType),
		page_size: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 100,
			description: "Page size"
		})),
		page_token: Type.Optional(Type.String({ description: "Comment page token" }))
	}),
	Type.Object({
		action: Type.Literal("list_comment_replies"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(CommentFileType),
		comment_id: Type.String({ description: "Comment id" }),
		page_size: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 100,
			description: "Page size"
		})),
		page_token: Type.Optional(Type.String({ description: "Reply page token" }))
	}),
	Type.Object({
		action: Type.Literal("add_comment"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(Type.Union([Type.Literal("doc"), Type.Literal("docx")], { description: "Document type. Defaults to docx when omitted." })),
		content: Type.String({ description: "Comment text content" }),
		block_id: Type.Optional(Type.String({ description: "Optional docx block id for a local comment. Omit to create a full-document comment." }))
	}),
	Type.Object({
		action: Type.Literal("reply_comment"),
		file_token: Type.String({ description: "Document token" }),
		file_type: Type.Optional(CommentFileType),
		comment_id: Type.String({ description: "Comment id" }),
		content: Type.String({ description: "Reply text content" })
	})
]);
//#endregion
//#region extensions/feishu/src/tools-config.ts
/**
* Default tool configuration.
* - doc, chat, wiki, drive, scopes, bitable: enabled by default
* - perm: disabled by default (sensitive operation)
*/
const DEFAULT_TOOLS_CONFIG = {
	doc: true,
	chat: true,
	wiki: true,
	drive: true,
	perm: false,
	scopes: true,
	bitable: true
};
function resolveToolsConfig(cfg) {
	return {
		...DEFAULT_TOOLS_CONFIG,
		...cfg
	};
}
//#endregion
//#region extensions/feishu/src/tool-account.ts
function resolveImplicitToolAccountId(params) {
	const explicitAccountId = normalizeOptionalString(params.executeParams?.accountId);
	if (explicitAccountId) {
		const normalizedAccountId = normalizeOptionalAccountId(explicitAccountId);
		if (!normalizedAccountId) throw new Error(`Invalid Feishu account ID "${explicitAccountId}"`);
		const listedAccountId = listFeishuAccountIds(params.cfg).find((accountId) => normalizeOptionalAccountId(accountId) === normalizedAccountId) ?? (() => {
			const defaultAccountId = resolveDefaultFeishuAccountId(params.cfg);
			return normalizeOptionalAccountId(defaultAccountId) === normalizedAccountId ? defaultAccountId : void 0;
		})();
		if (!listedAccountId) throw new Error(`Unknown Feishu account "${explicitAccountId}"`);
		if (!resolveFeishuAccount({
			cfg: params.cfg,
			accountId: normalizedAccountId
		}).enabled) throw new Error(`Feishu account "${listedAccountId}" is disabled`);
		return normalizedAccountId;
	}
	const contextualAccountId = normalizeOptionalAccountId(params.defaultAccountId);
	if (contextualAccountId !== void 0 && listFeishuAccountIds(params.cfg).some((accountId) => normalizeOptionalAccountId(accountId) === contextualAccountId)) {
		if (resolveFeishuAccount({
			cfg: params.cfg,
			accountId: contextualAccountId
		}).enabled) return contextualAccountId;
	}
	const configuredDefaultAccountId = normalizeOptionalString((params.cfg.channels?.feishu)?.defaultAccount);
	if (configuredDefaultAccountId && resolveFeishuAccount({
		cfg: params.cfg,
		accountId: configuredDefaultAccountId
	}).enabled) return configuredDefaultAccountId;
	for (const accountId of listFeishuAccountIds(params.cfg)) {
		const account = resolveFeishuAccount({
			cfg: params.cfg,
			accountId
		});
		if (account.enabled && account.configured && resolveToolsConfig(account.config.tools)[params.requiredTool.family]) return accountId;
	}
	throw new Error(`No usable Feishu account has ${params.requiredTool.label} tools enabled`);
}
function resolveFeishuToolAccount(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: resolveImplicitToolAccountId(params)
	});
	if (!resolveToolsConfig(account.config.tools)[params.requiredTool.family]) throw new Error(`Feishu ${params.requiredTool.label} tools are disabled for account "${account.accountId}"`);
	return account;
}
function createFeishuToolClient(params) {
	return createFeishuClient(resolveFeishuToolAccount(params));
}
function resolveAnyEnabledFeishuToolsConfig(config) {
	const accounts = listEnabledFeishuAccounts(config);
	const merged = {
		doc: false,
		chat: false,
		wiki: false,
		drive: false,
		perm: false,
		scopes: false,
		bitable: false
	};
	for (const account of accounts) {
		const cfg = resolveToolsConfig(account.config.tools);
		merged.doc = merged.doc || cfg.doc;
		merged.chat = merged.chat || cfg.chat;
		merged.wiki = merged.wiki || cfg.wiki;
		merged.drive = merged.drive || cfg.drive;
		merged.perm = merged.perm || cfg.perm;
		merged.scopes = merged.scopes || cfg.scopes;
		merged.bitable = merged.bitable || cfg.bitable;
	}
	return merged;
}
//#endregion
//#region extensions/feishu/src/tool-result.ts
function feishuExternalToolResult(details) {
	return {
		content: [{
			type: "text",
			text: wrapExternalContent(JSON.stringify(details, null, 2), {
				source: "api",
				includeWarning: false
			})
		}],
		details
	};
}
function unknownToolActionResult(action) {
	return jsonResult({ error: `Unknown action: ${String(action)}` });
}
function toolExecutionErrorResult(error) {
	return feishuExternalToolResult({ error: formatErrorMessage(error) });
}
//#endregion
//#region extensions/feishu/src/tool-registration.ts
function registerFeishuTool(api, tool) {
	api.registerTool((ctx) => {
		const cfg = ctx.runtimeConfig ?? ctx.config ?? api.config;
		if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg)[tool.family]) return null;
		const execute = tool.createExecute(ctx, cfg);
		return {
			name: tool.name,
			label: tool.label,
			description: tool.description,
			parameters: tool.parameters,
			resultContentSource: "network",
			async execute(_toolCallId, params) {
				try {
					return await execute(params);
				} catch (error) {
					return (tool.onError ?? toolExecutionErrorResult)(error);
				}
			}
		};
	}, { name: tool.name });
}
//#endregion
//#region extensions/feishu/src/drive.ts
const FEISHU_DRIVE_REQUEST_TIMEOUT_MS = 3e4;
function requestDriveApi(params) {
	return params.client.request({
		method: params.method,
		url: params.url,
		params: params.query ?? {},
		data: params.data ?? {},
		timeout: FEISHU_DRIVE_REQUEST_TIMEOUT_MS
	});
}
function assertDriveApiSuccess(response) {
	if (response.code !== 0) throw new Error(response.msg ?? "Feishu Drive API request failed");
	return response;
}
function normalizeCommentReply(reply) {
	return {
		reply_id: reply.reply_id,
		user_id: reply.user_id,
		create_time: reply.create_time,
		update_time: reply.update_time,
		text: extractReplyText(reply)
	};
}
function normalizeCommentCard(comment) {
	const replies = comment.reply_list?.replies ?? [];
	const rootReply = replies[0];
	return {
		comment_id: comment.comment_id,
		user_id: comment.user_id,
		create_time: comment.create_time,
		update_time: comment.update_time,
		is_solved: comment.is_solved,
		is_whole: comment.is_whole,
		quote: comment.quote,
		text: extractReplyText(rootReply),
		has_more_replies: comment.has_more,
		replies_page_token: comment.page_token,
		replies: replies.slice(1).map(normalizeCommentReply)
	};
}
function normalizeCommentPageSize(pageSize) {
	if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) return;
	return String(Math.min(Math.max(Math.floor(pageSize), 1), 100));
}
function resolveAmbientCommentTarget(context) {
	const deliveryContext = context?.deliveryContext;
	if (deliveryContext?.channel && deliveryContext.channel !== "feishu") return null;
	return parseFeishuCommentTarget(deliveryContext?.to);
}
function resolveDriveCommentParams(params, context, action) {
	const ambient = resolveAmbientCommentTarget(context);
	let resolved = params;
	if (ambient && (action !== "add_comment" || ambient.fileType === "doc" || ambient.fileType === "docx")) resolved = {
		...params,
		file_token: params.file_token?.trim() || ambient.fileToken,
		file_type: params.file_type ?? ambient.fileType,
		...action !== "add_comment" && { comment_id: params.comment_id?.trim() || ambient.commentId }
	};
	const fileType = resolved.file_type ?? "docx";
	if (!resolved.file_type) console.info(`[feishu_drive] ${action} missing file_type; defaulting to docx file_token=${resolved.file_token ?? "unknown"}`);
	return {
		...resolved,
		file_type: fileType
	};
}
function extractDriveApiErrorMeta(error) {
	if (!isRecord(error)) return { message: typeof error === "string" ? error : JSON.stringify(error) };
	const response = isRecord(error.response) ? error.response : void 0;
	const responseData = isRecord(response?.data) ? response?.data : void 0;
	return {
		message: typeof error.message === "string" ? error.message : JSON.stringify(error),
		httpStatus: typeof response?.status === "number" ? response.status : void 0,
		feishuCode: typeof responseData?.code === "number" ? responseData.code : readStringValue(responseData?.code),
		feishuMsg: readStringValue(responseData?.msg),
		feishuLogId: readStringValue(responseData?.log_id)
	};
}
async function getRootFolderToken(client) {
	const domain = client.domain ?? "https://open.feishu.cn";
	const res = await client.httpInstance.get(`${domain}/open-apis/drive/explorer/v2/root_folder/meta`);
	if (res.code !== 0) throw new Error(res.msg ?? "Failed to get root folder");
	const token = res.data?.token;
	if (!token) throw new Error("Root folder token not found");
	return token;
}
async function listFolder(client, params = {}) {
	const folderToken = typeof params.folder_token === "string" ? params.folder_token.trim() : void 0;
	const validFolderToken = folderToken && folderToken !== "0" ? folderToken : void 0;
	const pageSize = readPositiveIntegerParam(params, "page_size", {
		max: 200,
		message: "page_size must be a positive integer between 1 and 200"
	});
	const pageToken = typeof params.page_token === "string" ? params.page_token.trim() : void 0;
	const listParams = validFolderToken ? {
		folder_token: validFolderToken,
		...pageSize ? { page_size: pageSize } : {},
		...pageToken ? { page_token: pageToken } : {}
	} : {};
	const res = await client.drive.file.list({ params: listParams });
	assertFeishuApiSuccess(res);
	return {
		files: res.data?.files?.map((f) => ({
			token: f.token,
			name: f.name,
			type: f.type,
			url: f.url,
			created_time: f.created_time,
			modified_time: f.modified_time,
			owner_id: f.owner_id
		})) ?? [],
		next_page_token: res.data?.next_page_token
	};
}
async function getRootFileInfo(client, fileToken) {
	const { files } = await listFolder(client);
	const file = files.find((candidate) => candidate.token === fileToken);
	if (!file) throw new Error(`File not found: ${fileToken}`);
	return file;
}
async function getFileInfo(client, fileToken, type) {
	if (type === "shortcut") return getRootFileInfo(client, fileToken);
	let res;
	try {
		res = await client.drive.meta.batchQuery({ data: {
			request_docs: [{
				doc_token: fileToken,
				doc_type: type
			}],
			with_url: true
		} });
	} catch (error) {
		if (extractDriveApiErrorMeta(error).feishuCode === 99991672) return getRootFileInfo(client, fileToken);
		throw error;
	}
	if (res.code === 99991672) return getRootFileInfo(client, fileToken);
	assertFeishuApiSuccess(res);
	const file = res.data?.metas?.find((meta) => meta.doc_token === fileToken || meta.request_doc_info?.doc_token === fileToken);
	if (!file) throw new Error(`File not found: ${fileToken}`);
	return {
		token: file.doc_token,
		name: file.title,
		type: file.doc_type,
		url: file.url,
		created_time: file.create_time,
		modified_time: file.latest_modify_time,
		owner_id: file.owner_id
	};
}
async function createFolder(client, name, folderToken) {
	let effectiveToken = folderToken && folderToken !== "0" ? folderToken : "0";
	if (effectiveToken === "0") try {
		effectiveToken = await getRootFolderToken(client);
	} catch {}
	const res = await client.drive.file.createFolder({ data: {
		name,
		folder_token: effectiveToken
	} });
	assertFeishuApiSuccess(res);
	return {
		token: res.data?.token,
		url: res.data?.url
	};
}
async function moveFile(client, fileToken, type, folderToken) {
	const res = await client.drive.file.move({
		path: { file_token: fileToken },
		data: {
			type,
			folder_token: folderToken
		}
	});
	assertFeishuApiSuccess(res);
	return {
		success: true,
		task_id: res.data?.task_id
	};
}
async function deleteFile(client, fileToken, type) {
	const res = await client.drive.file.delete({
		path: { file_token: fileToken },
		params: { type }
	});
	assertFeishuApiSuccess(res);
	return {
		success: true,
		task_id: res.data?.task_id
	};
}
async function listDriveCommentPage(client, params) {
	const filePath = `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments`;
	const isReplies = params.action === "list_comment_replies";
	const response = assertDriveApiSuccess(await requestDriveApi({
		client,
		method: "GET",
		url: (isReplies ? `${filePath}/${encodeURIComponent(params.comment_id)}/replies` : filePath) + encodeQuery({
			file_type: params.file_type,
			page_size: normalizeCommentPageSize(params.page_size),
			page_token: params.page_token,
			user_id_type: "open_id"
		})
	}));
	return {
		has_more: response.data?.has_more ?? false,
		page_token: response.data?.page_token,
		...isReplies ? { replies: (response.data?.items ?? []).map(normalizeCommentReply) } : { comments: (response.data?.items ?? []).map(normalizeCommentCard) }
	};
}
async function addComment(client, params) {
	if (params.block_id?.trim() && params.file_type !== "docx") throw new Error("block_id is only supported for docx comments");
	return {
		success: true,
		...assertDriveApiSuccess(await withFeishuMessageDispatch(() => requestDriveApi({
			client,
			method: "POST",
			url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/new_comments`,
			data: {
				file_type: params.file_type,
				reply_elements: [{
					type: "text",
					text: params.content
				}],
				...params.block_id?.trim() ? { anchor: { block_id: params.block_id.trim() } } : {}
			}
		}))).data
	};
}
async function queryCommentById(client, params) {
	return assertDriveApiSuccess(await requestDriveApi({
		client,
		method: "POST",
		url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/batch_query` + encodeQuery({
			file_type: params.file_type,
			user_id_type: "open_id"
		}),
		data: { comment_ids: [params.comment_id] }
	})).data?.items?.find((comment) => comment.comment_id?.trim() === params.comment_id);
}
async function replyComment(client, params) {
	const url = `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/${encodeURIComponent(params.comment_id)}/replies`;
	const query = { file_type: params.file_type };
	try {
		const response = await withFeishuMessageDispatch(() => requestDriveApi({
			client,
			method: "POST",
			url,
			query,
			data: { content: { elements: [{
				type: "text_run",
				text_run: { text: params.content }
			}] } }
		}));
		if (response.code === 0) return {
			success: true,
			...response.data
		};
		console.warn(`[feishu_drive] replyComment failed comment=${params.comment_id} file_type=${params.file_type} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"} log_id=${response.log_id ?? "unknown"}`);
		throw new FeishuReplyCommentError({
			message: response.msg ?? "Feishu Drive reply comment failed",
			feishuCode: response.code,
			feishuMsg: response.msg,
			feishuLogId: response.log_id
		});
	} catch (error) {
		if (error instanceof FeishuReplyCommentError || error instanceof PlatformMessageNotDispatchedError) throw error;
		const meta = extractDriveApiErrorMeta(error);
		console.warn(`[feishu_drive] replyComment threw comment=${params.comment_id} file_type=${params.file_type} error=${formatFeishuApiError(error, { includeConfigParams: true })}`);
		throw new FeishuReplyCommentError(meta);
	}
}
async function deliverCommentThreadText(client, params) {
	let isWholeComment = params.is_whole_comment;
	if (isWholeComment === void 0) try {
		isWholeComment = (await queryCommentById(client, params))?.is_whole === true;
	} catch (error) {
		console.warn(`[feishu_drive] comment metadata preflight failed comment=${params.comment_id} file_type=${params.file_type} error=${formatErrorMessage(error)}`);
		isWholeComment = false;
	}
	if (isWholeComment) {
		if (params.file_type !== "doc" && params.file_type !== "docx") throw new Error(`Whole-document comment follow-ups are only supported for doc/docx (got ${params.file_type})`);
		console.info(`[feishu_drive] whole-comment compatibility path comment=${params.comment_id} file_type=${params.file_type} mode=add_comment`);
	} else try {
		return {
			delivery_mode: "reply_comment",
			...await replyComment(client, params)
		};
	} catch (error) {
		if (!(error instanceof FeishuReplyCommentError) || error.feishuCode !== 1069302) throw error;
		if (params.file_type !== "doc" && params.file_type !== "docx") throw error;
		console.info(`[feishu_drive] reply-not-allowed compatibility path comment=${params.comment_id} file_type=${params.file_type} mode=add_comment log_id=${error.feishuLogId ?? "unknown"}`);
	}
	return {
		delivery_mode: "add_comment",
		...await addComment(client, {
			file_token: params.file_token,
			file_type: params.file_type,
			content: params.content
		})
	};
}
function registerFeishuDriveTools(api) {
	registerFeishuTool(api, {
		family: "drive",
		name: "feishu_drive",
		label: "Feishu Drive",
		description: "Feishu cloud storage operations. Actions: list, info, create_folder, move, delete, list_comments, list_comment_replies, add_comment, reply_comment",
		parameters: FeishuDriveSchema,
		createExecute(ctx, cfg) {
			const defaultAccountId = ctx.agentAccountId;
			return async (p) => {
				const client = createFeishuToolClient({
					cfg,
					executeParams: p,
					defaultAccountId,
					requiredTool: {
						family: "drive",
						label: "Drive"
					}
				});
				switch (p.action) {
					case "list": return feishuExternalToolResult(await listFolder(client, p));
					case "info": return feishuExternalToolResult(await getFileInfo(client, p.file_token, p.type));
					case "create_folder": return feishuExternalToolResult(await createFolder(client, p.name, p.folder_token));
					case "move": return feishuExternalToolResult(await moveFile(client, p.file_token, p.type, p.folder_token));
					case "delete": return feishuExternalToolResult(await deleteFile(client, p.file_token, p.type));
					case "list_comments":
					case "list_comment_replies": return feishuExternalToolResult(await listDriveCommentPage(client, resolveDriveCommentParams(p, ctx, p.action)));
					case "add_comment":
					case "reply_comment": {
						const resolved = resolveDriveCommentParams(p, ctx, p.action);
						try {
							return feishuExternalToolResult(await (resolved.action === "add_comment" ? addComment(client, resolved) : deliverCommentThreadText(client, resolved)));
						} finally {
							cleanupAmbientCommentTypingReaction({
								client,
								deliveryContext: ctx.deliveryContext
							});
						}
					}
					default: return unknownToolActionResult(p.action);
				}
			};
		}
	});
}
//#endregion
//#region extensions/feishu/src/identity-header.ts
const emojiSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
const keycapEmojiPattern = /^[0-9#*]\uFE0F?\u20E3$/u;
const emojiLikeSegmentPattern = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Regional_Indicator}]/u;
function splitGraphemes(input) {
	if (!emojiSegmenter) return Array.from(input);
	return Array.from(emojiSegmenter.segment(input), (segment) => segment.segment);
}
function isEmojiSegment(segment) {
	return keycapEmojiPattern.test(segment) || emojiLikeSegmentPattern.test(segment);
}
function resolveFeishuIdentityEmoji(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	return splitGraphemes(trimmed).filter(isEmojiSegment).join("") || void 0;
}
function resolveFeishuIdentityHeaderTitle(identity) {
	if (!identity) return "";
	const name = identity.name?.trim() ?? "";
	const emoji = resolveFeishuIdentityEmoji(identity.emoji);
	return (emoji ? `${emoji} ${name}` : name).trim();
}
//#endregion
//#region extensions/feishu/src/media-fallback.ts
const FEISHU_MEDIA_UPLOAD_FAILURE_FALLBACK_TEXT = "Media upload failed. Please try again.";
function hasAsciiControlCharacter(value) {
	return Array.from(value).some((character) => {
		const code = character.charCodeAt(0);
		return code <= 31 || code === 127;
	});
}
async function resolvePublicFeishuMediaReference(value) {
	const raw = value?.trim();
	if (!raw || hasAsciiControlCharacter(raw)) return;
	try {
		const parsed = new URL(raw);
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
		if (parsed.username || parsed.password || isBlockedHostnameOrIp(parsed.hostname)) return;
		await resolvePinnedHostnameWithPolicy(parsed.hostname);
		return parsed.href;
	} catch {
		return;
	}
}
async function buildFeishuMediaFallbackText(params) {
	const mediaUrl = await resolvePublicFeishuMediaReference(params.mediaUrl);
	const attachmentText = mediaUrl ? `${params.mediaLinkStyle === "plain" ? "" : "📎 "}${mediaUrl}` : FEISHU_MEDIA_UPLOAD_FAILURE_FALLBACK_TEXT;
	return [params.text?.trim(), attachmentText].filter(Boolean).join("\n\n");
}
//#endregion
//#region extensions/feishu/src/media-chunk-idle.ts
var FeishuInboundMediaTimeoutError = class extends Error {
	constructor(chunkTimeoutMs) {
		super(`Feishu media download stalled: no data received for ${chunkTimeoutMs}ms`);
		this.name = "FeishuInboundMediaTimeoutError";
		this.chunkTimeoutMs = chunkTimeoutMs;
	}
};
function destroySource(source) {
	const s = source;
	if (typeof s.destroy === "function") s.destroy();
}
function withChunkIdleTimeout(source, chunkTimeoutMs, teardownSource) {
	return { async *[Symbol.asyncIterator]() {
		const iterator = source[Symbol.asyncIterator]();
		let exhausted = false;
		try {
			while (true) {
				const nextPromise = iterator.next();
				let timeoutHandle;
				const timeoutPromise = new Promise((_, reject) => {
					timeoutHandle = setTimeout(() => {
						reject(new FeishuInboundMediaTimeoutError(chunkTimeoutMs));
						teardownSource();
					}, chunkTimeoutMs);
				});
				let result;
				try {
					result = await Promise.race([nextPromise, timeoutPromise]);
				} finally {
					if (timeoutHandle !== void 0) clearTimeout(timeoutHandle);
				}
				if (result.done) {
					exhausted = true;
					return;
				}
				yield result.value;
			}
		} finally {
			if (!exhausted && typeof iterator.return === "function") iterator.return().catch(() => void 0);
		}
	} };
}
async function saveMediaStreamWithIdleTimeout(stream, contentType, maxBytes, fileName, chunkTimeoutMs) {
	let teardownAttempted = false;
	const teardownSource = () => {
		if (teardownAttempted) return;
		teardownAttempted = true;
		try {
			destroySource(stream);
		} catch {}
	};
	try {
		return await saveMediaStream(withChunkIdleTimeout(stream, chunkTimeoutMs, teardownSource), contentType, "inbound", maxBytes, fileName);
	} catch (error) {
		teardownSource();
		throw error;
	}
}
//#endregion
//#region extensions/feishu/src/configured-client.ts
function createConfiguredFeishuClient(params) {
	const account = resolveFeishuRuntimeAccount(params);
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	return createFeishuClient(account);
}
//#endregion
//#region extensions/feishu/src/send-target.ts
function resolveFeishuSendTarget(params) {
	const target = params.to.trim();
	const client = createConfiguredFeishuClient(params);
	const receiveId = normalizeFeishuTarget(target);
	if (!receiveId) throw new Error(`Invalid Feishu target: ${params.to}`);
	const withoutProviderPrefix = target.replace(/^(feishu|lark):/i, "");
	return {
		client,
		receiveId,
		receiveIdType: resolveReceiveIdType(withoutProviderPrefix)
	};
}
//#endregion
//#region extensions/feishu/src/post.ts
const FALLBACK_POST_TEXT = "[Rich text message]";
const MARKDOWN_SPECIAL_CHARS = /([\\`*_{}[\]()#+\-!|>~])/g;
function toStringOrEmpty(value) {
	return typeof value === "string" ? value : "";
}
function escapeMarkdownText(text) {
	return text.replace(MARKDOWN_SPECIAL_CHARS, "\\$1");
}
function wrapInlineCode(text) {
	const maxRun = Math.max(0, ...(text.match(/`+/g) ?? []).map((run) => run.length));
	const fence = "`".repeat(maxRun + 1);
	return `${fence}${text.startsWith("`") || text.endsWith("`") ? ` ${text} ` : text}${fence}`;
}
function sanitizeFenceLanguage(language) {
	return language.trim().replace(/[^A-Za-z0-9_+#.-]/g, "");
}
function applyInlineStyles(text, style) {
	const content = text.trim();
	if (!content || !Array.isArray(style)) return text;
	let rendered = content;
	if (style.includes("bold")) rendered = `**${rendered}**`;
	if (style.includes("italic")) rendered = `*${rendered}*`;
	if (style.includes("underline")) rendered = `<u>${rendered}</u>`;
	if (style.includes("lineThrough")) rendered = `~~${rendered}~~`;
	return text.replace(content, () => rendered);
}
function renderLinkElement(element) {
	const href = toStringOrEmpty(element.href).trim();
	const text = toStringOrEmpty(element.text) || href;
	if (!text) return "";
	if (!href) return escapeMarkdownText(text);
	return `[${escapeMarkdownText(text)}](${href})`;
}
function renderMentionElement(element) {
	const mention = toStringOrEmpty(element.user_name) || toStringOrEmpty(element.user_id) || toStringOrEmpty(element.open_id);
	if (!mention) return "";
	return `@${escapeMarkdownText(mention)}`;
}
function renderEmotionElement(element) {
	return escapeMarkdownText(toStringOrEmpty(element.emoji) || toStringOrEmpty(element.text) || toStringOrEmpty(element.emoji_type));
}
function renderCodeBlockElement(element) {
	const language = sanitizeFenceLanguage(toStringOrEmpty(element.language) || toStringOrEmpty(element.lang));
	const code = (toStringOrEmpty(element.text) || toStringOrEmpty(element.content)).replace(/\r\n/g, "\n");
	return `\`\`\`${language}\n${code}${code.endsWith("\n") ? "" : "\n"}\`\`\``;
}
function renderElement(element, attachments, mentionedOpenIds, renderMediaPlaceholders) {
	if (!isRecord(element)) return escapeMarkdownText(toStringOrEmpty(element));
	switch (normalizeLowercaseStringOrEmpty(element.tag)) {
		case "text": return applyInlineStyles(escapeMarkdownText(toStringOrEmpty(element.text)), element.style);
		case "a": return applyInlineStyles(renderLinkElement(element), element.style);
		case "at":
			{
				const mentioned = toStringOrEmpty(element.open_id) || toStringOrEmpty(element.user_id);
				const normalizedMention = normalizeFeishuExternalKey(mentioned);
				if (normalizedMention) mentionedOpenIds.push(normalizedMention);
			}
			return applyInlineStyles(renderMentionElement(element), element.style);
		case "img": {
			const imageKey = normalizeFeishuExternalKey(element.image_key);
			if (imageKey) attachments.push({
				kind: "image",
				key: imageKey
			});
			return renderMediaPlaceholders ? "![image]" : "";
		}
		case "media": {
			const fileKey = normalizeFeishuExternalKey(element.file_key);
			if (fileKey) {
				const fileName = toStringOrEmpty(element.file_name) || void 0;
				attachments.push({
					kind: "file",
					key: fileKey,
					...fileName ? { fileName } : {}
				});
			}
			return renderMediaPlaceholders ? "[media]" : "";
		}
		case "emotion": return renderEmotionElement(element);
		case "md":
		case "lark_md": return toStringOrEmpty(element.text) || toStringOrEmpty(element.content);
		case "br": return "\n";
		case "hr": return "\n\n---\n\n";
		case "code": {
			const code = toStringOrEmpty(element.text) || toStringOrEmpty(element.content);
			return code ? wrapInlineCode(code) : "";
		}
		case "code_block":
		case "pre": return renderCodeBlockElement(element);
		default: return escapeMarkdownText(toStringOrEmpty(element.text));
	}
}
function appendTopLevelPostFiles(attachments, files) {
	if (!Array.isArray(files)) return;
	const seenFileKeys = new Set(attachments.filter((attachment) => attachment.kind === "file").map((attachment) => attachment.key));
	for (const entry of files) {
		if (!isRecord(entry) || entry.is_folder === true) continue;
		const fileKey = normalizeFeishuExternalKey(entry.file_key);
		if (!fileKey || seenFileKeys.has(fileKey)) continue;
		seenFileKeys.add(fileKey);
		const fileName = toStringOrEmpty(entry.file_name) || void 0;
		attachments.push({
			kind: "file",
			key: fileKey,
			origin: "top-level",
			...fileName ? { fileName } : {}
		});
	}
}
function toPostPayload(candidate) {
	if (!isRecord(candidate) || !Array.isArray(candidate.content)) return null;
	return {
		title: toStringOrEmpty(candidate.title),
		content: candidate.content,
		...Array.isArray(candidate.files) ? { files: candidate.files } : {}
	};
}
function resolveLocalePayload(candidate) {
	const direct = toPostPayload(candidate);
	if (direct) return direct;
	if (!isRecord(candidate)) return null;
	for (const value of Object.values(candidate)) {
		const localePayload = toPostPayload(value);
		if (localePayload) return localePayload;
	}
	return null;
}
function resolvePostPayload(parsed) {
	return toPostPayload(parsed) ?? (isRecord(parsed) ? resolveLocalePayload(parsed.post) ?? resolveLocalePayload(parsed) : null);
}
function parsePostContent(content, options = {}) {
	try {
		return renderPostContent(JSON.parse(content), options);
	} catch {
		return {
			textContent: FALLBACK_POST_TEXT,
			attachments: [],
			mentionedOpenIds: []
		};
	}
}
function renderPostContent(parsed, options = {}) {
	try {
		const payload = resolvePostPayload(parsed);
		if (!payload) return {
			textContent: FALLBACK_POST_TEXT,
			attachments: [],
			mentionedOpenIds: []
		};
		const attachments = [];
		const mentionedOpenIds = [];
		const paragraphs = [];
		for (const paragraph of payload.content) {
			if (!Array.isArray(paragraph)) continue;
			let renderedParagraph = "";
			for (const element of paragraph) renderedParagraph += renderElement(element, attachments, mentionedOpenIds, options.renderMediaPlaceholders !== false);
			paragraphs.push(renderedParagraph);
		}
		if (options.includeTopLevelFiles !== false) {
			appendTopLevelPostFiles(attachments, payload.files);
			if (isRecord(parsed)) appendTopLevelPostFiles(attachments, parsed.files);
		}
		return {
			textContent: [escapeMarkdownText(payload.title.trim()), paragraphs.join("\n").trim()].filter(Boolean).join("\n\n").trim() || (options.emptyTextFallback ?? FALLBACK_POST_TEXT),
			attachments,
			mentionedOpenIds
		};
	} catch {
		return {
			textContent: FALLBACK_POST_TEXT,
			attachments: [],
			mentionedOpenIds: []
		};
	}
}
//#endregion
//#region extensions/feishu/src/interactive-message-content.ts
const INTERACTIVE_CARD_FALLBACK_TEXT = "[Interactive Card]";
const POST_FALLBACK_TEXT = "[Rich text message]";
function normalizeCardTemplateVariable(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
}
function readCardTemplateVariables(parsed) {
	const variables = /* @__PURE__ */ new Map();
	for (const source of [parsed.template_variable, parsed.template_variables]) {
		if (!isRecord(source)) continue;
		for (const [key, value] of Object.entries(source)) {
			const normalized = normalizeCardTemplateVariable(value);
			if (normalized !== void 0) variables.set(key, normalized);
		}
	}
	return variables;
}
function applyCardTemplateVariables(text, variables) {
	if (variables.size === 0) return text;
	return text.replace(/\$\{([A-Za-z0-9_.-]+)\}|\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (match, a, b) => {
		const variableName = typeof a === "string" ? a : b;
		return variables.get(variableName) ?? match;
	});
}
function normalizeInteractiveValue(value, variables) {
	const scalar = normalizeCardTemplateVariable(value);
	if (scalar !== void 0) return applyCardTemplateVariables(scalar, variables);
	if (Array.isArray(value)) return value.map((entry) => normalizeInteractiveValue(entry, variables)).filter(Boolean).join(", ");
	if (!isRecord(value)) return "";
	for (const key of [
		"content",
		"text",
		"label",
		"name",
		"display_name",
		"user_name",
		"user_id",
		"open_id",
		"id",
		"value"
	]) {
		const text = normalizeInteractiveValue(value[key], variables);
		if (text) return text;
	}
	return "";
}
function extractInteractiveTableText(element, variables) {
	if (!Array.isArray(element.columns) || !Array.isArray(element.rows)) return;
	const columns = element.columns.flatMap((column) => {
		if (!isRecord(column) || typeof column.name !== "string") return [];
		return [{
			name: column.name,
			title: typeof column.display_name === "string" ? column.display_name : column.name
		}];
	});
	if (columns.length === 0) return;
	const lines = [columns.map((column) => applyCardTemplateVariables(column.title, variables)).join(" | ")];
	for (const row of element.rows) {
		if (!isRecord(row)) continue;
		const cells = columns.map((column) => normalizeInteractiveValue(row[column.name], variables));
		if (cells.some(Boolean)) lines.push(cells.join(" | "));
	}
	return lines.join("\n");
}
function extractInteractiveElementText(element, variables) {
	if (!isRecord(element)) return;
	const tag = typeof element.tag === "string" ? element.tag : "";
	const text = isRecord(element.text) ? element.text : void 0;
	if (tag === "div") {
		const parts = [normalizeInteractiveValue(element.text, variables)];
		if (Array.isArray(element.fields)) parts.push(extractInteractiveElementsText(element.fields, variables));
		return parts.filter(Boolean).join("\n") || void 0;
	}
	if ((tag === "markdown" || tag === "lark_md" || tag === "plain_text") && typeof element.content === "string") return applyCardTemplateVariables(element.content, variables);
	if ((tag === "text" || tag === "a" || tag === "button") && element.text !== void 0) return normalizeInteractiveValue(element.text, variables) || void 0;
	if (tag === "at") {
		const mention = normalizeInteractiveValue(element.user_name ?? element.user_id, variables);
		return mention ? mention.startsWith("@") ? mention : `@${mention}` : void 0;
	}
	if (tag === "table") return extractInteractiveTableText(element, variables);
	return [
		element.elements,
		element.columns,
		element.children,
		element.fields,
		element.actions
	].filter(Array.isArray).map((children) => extractInteractiveElementsText(children, variables)).filter(Boolean).join("\n") || (typeof text?.content === "string" ? text.content : void 0);
}
function extractInteractiveElementsText(elements, variables) {
	const texts = [];
	for (const element of elements) {
		if (Array.isArray(element)) {
			const row = element.map((part) => extractInteractiveElementText(part, variables)).filter((part) => Boolean(part)).join(" ").trim();
			if (row) texts.push(row);
			continue;
		}
		const text = extractInteractiveElementText(element, variables);
		if (text !== void 0) texts.push(text);
	}
	return texts.join("\n").trim();
}
function readInteractiveElementArrays(parsed) {
	const body = isRecord(parsed.body) ? parsed.body : void 0;
	const elementArrays = [];
	for (const candidate of [parsed.elements, body?.elements]) if (Array.isArray(candidate)) elementArrays.push(candidate);
	for (const candidate of [parsed.i18n_elements, body?.i18n_elements]) {
		if (!isRecord(candidate)) continue;
		for (const localeElements of Object.values(candidate)) if (Array.isArray(localeElements)) elementArrays.push(localeElements);
	}
	return elementArrays;
}
function readInteractiveCardTitle(parsed, variables) {
	if (typeof parsed.title === "string") return applyCardTemplateVariables(parsed.title, variables).trim();
	const header = isRecord(parsed.header) ? parsed.header : void 0;
	const title = isRecord(header?.title) ? header.title : void 0;
	return typeof title?.content === "string" ? applyCardTemplateVariables(title.content, variables).trim() : "";
}
function parseInteractiveCardContent(parsed) {
	if (!isRecord(parsed)) return INTERACTIVE_CARD_FALLBACK_TEXT;
	const variables = readCardTemplateVariables(parsed);
	const title = readInteractiveCardTitle(parsed, variables);
	for (const elements of readInteractiveElementArrays(parsed)) {
		const text = extractInteractiveElementsText(elements, variables);
		if (text) return title ? `${title}\n${text}` : text;
	}
	const postText = renderPostContent(parsed).textContent.trim();
	if (postText && postText !== POST_FALLBACK_TEXT) return postText;
	return title || INTERACTIVE_CARD_FALLBACK_TEXT;
}
//#endregion
//#region extensions/feishu/src/types.ts
function normalizeFeishuEventChatType(value) {
	return value === "group" || value === "topic_group" || value === "private" || value === "p2p" ? value : void 0;
}
function isFeishuGroupChatType(chatType) {
	return chatType === "group" || chatType === "topic_group";
}
//#endregion
//#region extensions/feishu/src/mention.ts
function isFeishuBroadcastMention(mention) {
	const normalizedKey = mention.key?.trim().toLowerCase();
	if (normalizedKey === "@all" || normalizedKey === "@_all") return true;
	return [
		mention.id?.open_id,
		mention.id?.user_id,
		mention.id?.union_id
	].some((id) => id?.trim().toLowerCase() === "all");
}
/**
* Extract mention targets from message event (excluding the bot itself)
*/
function extractMentionTargets(event, botOpenId) {
	return (event.message.mentions ?? []).filter((m) => !isFeishuBroadcastMention(m) && m.id.open_id !== botOpenId && Boolean(m.id.open_id)).map((m) => ({
		openId: m.id.open_id,
		name: m.name,
		key: m.key
	}));
}
/**
* Check if message is a mention forward request
* Rules:
* - Group: message mentions bot + at least one other user
* - DM: message mentions any user (no need to mention bot)
*/
function isMentionForwardRequest(event, botOpenId) {
	const mentions = event.message.mentions ?? [];
	if (mentions.length === 0) return false;
	const normalizedBotOpenId = botOpenId?.trim();
	if (!normalizedBotOpenId) return false;
	const isDirectMessage = !isFeishuGroupChatType(event.message.chat_type);
	const userMentions = mentions.filter((m) => !isFeishuBroadcastMention(m));
	return userMentions.some((m) => m.id.open_id !== normalizedBotOpenId) && (isDirectMessage || userMentions.some((m) => m.id.open_id === normalizedBotOpenId));
}
function buildMentionedCardContent(targets, message) {
	if (targets.length === 0) return message;
	return `${targets.map((target) => `<at id=${target.openId}></at>`).join(" ")} ${message}`;
}
//#endregion
//#region extensions/feishu/src/message-content.ts
function formatFeishuMediaContent(parsed, messageType) {
	if (messageType === "sticker") {
		const fileKey = normalizeFeishuExternalKey(parsed?.file_key);
		return fileKey ? `<sticker key="${escapeHtml(fileKey)}"/>` : "[Sticker]";
	}
	const speechToText = messageType === "audio" && typeof parsed.speech_to_text === "string" ? parsed.speech_to_text.trim() : "";
	if (speechToText) return speechToText;
	return "";
}
function formatSubMessageContent(content, contentType) {
	try {
		const parsed = JSON.parse(content);
		switch (contentType) {
			case "text": return parsed.text || content;
			case "post": return renderPostContent(parsed).textContent;
			case "interactive": return parseInteractiveCardContent(parsed);
			case "image": return "[Image]";
			case "file": return `[File: ${parsed.file_name || "unknown"}]`;
			case "audio": return "[Audio]";
			case "video": return "[Video]";
			case "sticker": return formatFeishuMediaContent(parsed, contentType);
			case "merge_forward": return "[Nested Merged Forward]";
			default: return `[${contentType}]`;
		}
	} catch {
		return content;
	}
}
function parseMergeForwardContent(items) {
	const maxMessages = 50;
	if (items.length === 0) return "[Merged and Forwarded Message - no sub-messages]";
	const container = items.find((item) => item.msg_type === "merge_forward" && !item.upper_message_id);
	const subMessages = container ? items.filter((item) => item !== container) : items.filter((item) => item.upper_message_id);
	if (subMessages.length === 0) return "[Merged and Forwarded Message - no sub-messages found]";
	subMessages.sort((a, b) => (parseStrictNonNegativeInteger(a.create_time) ?? 0) - (parseStrictNonNegativeInteger(b.create_time) ?? 0));
	const lines = ["[Merged and Forwarded Messages]"];
	for (const item of subMessages.slice(0, maxMessages)) lines.push(`- ${formatSubMessageContent(item.body?.content || "", item.msg_type || "text")}`);
	if (subMessages.length > maxMessages) lines.push(`... and ${subMessages.length - maxMessages} more messages`);
	const rendered = lines.join("\n");
	return rendered.length <= 2e4 ? rendered : `${truncateUtf16Safe(rendered, 19961).trimEnd()}
... [Merged-forward content truncated]`;
}
//#endregion
//#region extensions/feishu/src/send-result.ts
function resolveFeishuReceiptKind(msgType) {
	switch (msgType) {
		case "audio": return "voice";
		case "image":
		case "media":
		case "file":
		case "sticker": return "media";
		case "interactive": return "card";
		case "post":
		case "text": return "text";
		default: return "unknown";
	}
}
function createFeishuSendReceipt(params) {
	const messageId = params.messageId?.trim();
	const chatId = params.chatId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "feishu",
			messageId,
			chatId,
			conversationId: chatId
		}] : [],
		...params.replyToId?.trim() ? { replyToId: params.replyToId.trim() } : {},
		kind: params.kind ?? "unknown"
	});
}
function toFeishuSendResult(response, chatId, kind, errorPrefix = "Feishu send failed", replyToId) {
	const messageId = response.data?.message_id?.trim();
	if (!messageId) throw createChannelPartialDeliveryError(/* @__PURE__ */ new Error(`${errorPrefix}: no message_id returned`), {
		messageIds: [],
		visibleReplySent: true
	});
	return {
		messageId,
		chatId,
		receipt: createFeishuSendReceipt({
			messageId,
			chatId,
			kind,
			replyToId
		})
	};
}
function toFeishuMessageSendResult(result, kind) {
	const receipt = result.receipt ?? createFeishuSendReceipt({
		messageId: result.messageId,
		chatId: result.chatId ?? "",
		kind
	});
	return {
		messageId: result.messageId || receipt.primaryPlatformMessageId,
		receipt
	};
}
//#endregion
//#region extensions/feishu/src/send.ts
const WITHDRAWN_REPLY_ERROR_CODES = /* @__PURE__ */ new Set([230011, 231003]);
function shouldFallbackFromReplyTarget(response) {
	if (response.code !== void 0 && WITHDRAWN_REPLY_ERROR_CODES.has(response.code)) return true;
	const msg = normalizeLowercaseStringOrEmpty(response.msg);
	return msg.includes("withdrawn") || msg.includes("not found");
}
/** Check whether a thrown error indicates a withdrawn/not-found reply target. */
function isWithdrawnReplyError(err) {
	if (typeof err !== "object" || err === null) return false;
	const code = err.code;
	if (typeof code === "number" && WITHDRAWN_REPLY_ERROR_CODES.has(code)) return true;
	const response = err.response;
	if (typeof response?.data?.code === "number" && WITHDRAWN_REPLY_ERROR_CODES.has(response.data.code)) return true;
	const cause = err.cause;
	if (cause && cause !== err) return isWithdrawnReplyError(cause);
	return false;
}
async function sendReplyOrFallbackDirect(target, params) {
	const { client, receiveId, receiveIdType } = target;
	const sendDirect = async () => {
		const response = await requestFeishuApi(() => withFeishuMessageDispatch(() => client.im.message.create({
			params: { receive_id_type: receiveIdType },
			data: {
				receive_id: receiveId,
				content: params.content,
				msg_type: params.msgType
			}
		})), params.directErrorPrefix, { includeNestedErrorLogId: true });
		assertFeishuApiSuccess(response, params.directErrorPrefix);
		return toFeishuSendResult(response, receiveId, resolveFeishuReceiptKind(params.msgType), params.directErrorPrefix);
	};
	if (!params.replyToMessageId) return sendDirect();
	const replyTargetFallbackError = params.replyInThread && params.allowTopLevelReplyFallback !== true ? /* @__PURE__ */ new Error("Feishu thread reply failed: reply target is unavailable and cannot safely fall back to a top-level send.") : null;
	let response;
	try {
		response = await requestFeishuApi(() => withFeishuMessageDispatch(() => client.im.message.reply({
			path: { message_id: params.replyToMessageId },
			data: {
				content: params.content,
				msg_type: params.msgType,
				...params.replyInThread ? { reply_in_thread: true } : {}
			}
		})), params.replyErrorPrefix, { includeNestedErrorLogId: true });
	} catch (err) {
		if (!isWithdrawnReplyError(err)) throw err;
		if (replyTargetFallbackError) throw replyTargetFallbackError;
		return sendDirect();
	}
	if (shouldFallbackFromReplyTarget(response)) {
		if (replyTargetFallbackError) throw replyTargetFallbackError;
		return sendDirect();
	}
	assertFeishuApiSuccess(response, params.replyErrorPrefix);
	return toFeishuSendResult(response, receiveId, resolveFeishuReceiptKind(params.msgType), params.replyErrorPrefix, params.replyToMessageId);
}
function parseFeishuMessageContent(rawContent, msgType, messageId) {
	if (!rawContent) return "";
	let parsed;
	try {
		parsed = JSON.parse(rawContent);
	} catch {
		const safeId = messageId ? ` (id: ${messageId})` : "";
		logVerbose(`feishu message content parse failed for ${msgType} message${safeId}`);
		return rawContent;
	}
	if (msgType === "text") {
		const text = parsed?.text;
		return typeof text === "string" ? text : "[Text message]";
	}
	if (msgType === "post") return renderPostContent(parsed).textContent;
	if (msgType === "interactive") return parseInteractiveCardContent(parsed);
	if (typeof parsed === "string") return parsed;
	const genericText = parsed?.text;
	if (typeof genericText === "string" && genericText.trim()) return genericText;
	const genericTitle = parsed?.title;
	if (typeof genericTitle === "string" && genericTitle.trim()) return genericTitle;
	return `[${msgType || "unknown"} message]`;
}
function parseFeishuMessageItem(item, fallbackMessageId) {
	const msgType = item.msg_type ?? "text";
	const rawContent = item.body?.content ?? "";
	return {
		messageId: item.message_id ?? fallbackMessageId ?? "",
		chatId: item.chat_id ?? "",
		chatType: normalizeFeishuEventChatType(item.chat_type),
		senderId: item.sender?.id,
		senderOpenId: item.sender?.id_type === "open_id" ? item.sender?.id : void 0,
		senderType: item.sender?.sender_type,
		content: parseFeishuMessageContent(rawContent, msgType, item.message_id),
		contentType: msgType,
		createTime: parseStrictNonNegativeInteger(item.create_time),
		...item.root_id ? { rootId: item.root_id } : {},
		threadId: item.thread_id || void 0
	};
}
async function getMessageFeishu(params) {
	const { cfg, messageId, accountId } = params;
	const client = createConfiguredFeishuClient({
		cfg,
		accountId
	});
	try {
		const response = await client.im.message.get({
			params: { card_msg_content_type: "user_card_content" },
			path: { message_id: messageId }
		});
		if (response.code !== 0) return null;
		const responseItems = response.data?.items;
		const rawItem = responseItems?.find((item) => item.msg_type === "merge_forward" && !item.upper_message_id) ?? responseItems?.[0] ?? response.data;
		const item = rawItem && (rawItem.body !== void 0 || rawItem.message_id !== void 0) ? rawItem : null;
		if (!item) return null;
		const parsedItem = parseFeishuMessageItem(item, messageId);
		if (parsedItem.contentType === "merge_forward" && responseItems) return {
			...parsedItem,
			content: parseMergeForwardContent(responseItems)
		};
		return parsedItem;
	} catch {
		return null;
	}
}
/**
* List messages in a Feishu thread (topic).
* Uses container_id_type=thread to directly query thread messages,
* which includes both the root message and all replies (including bot replies).
*/
async function listFeishuThreadMessages(params) {
	const { cfg, threadId, currentMessageId, rootMessageId, limit = 20, accountId } = params;
	const client = createConfiguredFeishuClient({
		cfg,
		accountId
	});
	const results = [];
	const seenMessageIds = /* @__PURE__ */ new Set();
	const seenPageTokens = /* @__PURE__ */ new Set();
	let pageToken;
	while (results.length < limit) {
		const response = await client.im.message.list({ params: {
			container_id_type: "thread",
			container_id: threadId,
			sort_type: "ByCreateTimeDesc",
			page_size: Math.min(limit + 1, 50),
			...pageToken ? { page_token: pageToken } : {},
			card_msg_content_type: "user_card_content"
		} });
		if (response.code !== 0) throw new Error(`Feishu thread list failed: code=${response.code} msg=${response.msg ?? "unknown"}`);
		for (const item of response.data?.items ?? []) {
			if (currentMessageId && item.message_id === currentMessageId || rootMessageId && item.message_id === rootMessageId || item.message_id && seenMessageIds.has(item.message_id)) continue;
			const parsed = parseFeishuMessageItem(item);
			if (parsed.messageId) seenMessageIds.add(parsed.messageId);
			results.push({
				messageId: parsed.messageId,
				senderId: parsed.senderId,
				senderType: parsed.senderType,
				content: parsed.content,
				contentType: parsed.contentType,
				createTime: parsed.createTime
			});
			if (results.length >= limit) break;
		}
		if (results.length >= limit || response.data?.has_more !== true) break;
		const nextPageToken = response.data.page_token?.trim();
		if (!nextPageToken || seenPageTokens.has(nextPageToken)) throw new Error(`Feishu thread history pagination returned a ${nextPageToken ? "repeated" : "missing"} page token`);
		seenPageTokens.add(nextPageToken);
		pageToken = nextPageToken;
	}
	results.reverse();
	return results;
}
async function sendMessageFeishu(params) {
	const { cfg, text, preparedPostText, mentions } = params;
	const target = resolveFeishuSendTarget(params);
	let messageText = text;
	if (!preparedPostText) {
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "feishu"
		});
		messageText = materializeFeishuPostMarkdownSoftBreaks(convertMarkdownTables(text ?? "", tableMode));
	}
	const content = buildFeishuPostMessageContent({
		messageText,
		mentions
	});
	assertFeishuPostWithinEnvelope(content, "Feishu post");
	return sendReplyOrFallbackDirect(target, {
		...params,
		content,
		msgType: "post",
		directErrorPrefix: "Feishu send failed",
		replyErrorPrefix: "Feishu reply failed"
	});
}
async function sendCardFeishu(params) {
	return sendReplyOrFallbackDirect(resolveFeishuSendTarget(params), {
		...params,
		content: JSON.stringify(params.card),
		msgType: "interactive",
		directErrorPrefix: "Feishu card send failed",
		replyErrorPrefix: "Feishu card reply failed"
	});
}
async function editMessageFeishu(params) {
	const { cfg, messageId, text, card, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	if ((typeof text === "string" && text.trim().length > 0) === Boolean(card)) throw new Error("Feishu edit requires exactly one of text or card.");
	const client = createFeishuClient(account);
	if (card) {
		const content = JSON.stringify(card);
		assertFeishuApiSuccess(await client.im.message.patch({
			path: { message_id: messageId },
			data: { content }
		}), "Feishu message edit failed");
		return {
			messageId,
			contentType: "interactive"
		};
	}
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	});
	const content = buildFeishuPostMessageContent({ messageText: materializeFeishuPostMarkdownSoftBreaks(convertMarkdownTables(text, tableMode)) });
	assertFeishuPostWithinEnvelope(content, "Feishu message edit");
	assertFeishuApiSuccess(await client.im.message.update({
		path: { message_id: messageId },
		data: {
			msg_type: "post",
			content
		}
	}), "Feishu message edit failed");
	return {
		messageId,
		contentType: "post"
	};
}
function buildStructuredCard(text, options) {
	const elements = [{
		tag: "markdown",
		content: options?.mentions?.length ? buildMentionedCardContent(options.mentions, text) : text
	}];
	if (options?.note) {
		elements.push({ tag: "hr" });
		elements.push({
			tag: "markdown",
			content: `<font color='grey'>${options.note}</font>`
		});
	}
	const card = {
		schema: "2.0",
		config: { width_mode: "fill" },
		body: { elements }
	};
	if (options?.header) card.header = {
		title: {
			tag: "plain_text",
			content: options.header.title
		},
		template: resolveFeishuCardTemplate(options.header.template) ?? "blue"
	};
	return card;
}
function chunkFeishuCardMarkdown(params) {
	return chunkFeishuMarkdownByEnvelope({
		...params,
		contentBytes: (text, isFirst) => Buffer.byteLength(JSON.stringify(buildStructuredCard(text, {
			header: params.header,
			note: params.note,
			mentions: [...params.chunkMentions ?? [], ...isFirst ? params.firstChunkMentions ?? [] : []]
		})), "utf8")
	});
}
async function sendStructuredCardFeishu(params) {
	return sendCardFeishu({
		...params,
		card: buildStructuredCard(params.text, params)
	});
}
//#endregion
//#region extensions/feishu/src/media.ts
const FEISHU_MEDIA_HTTP_TIMEOUT_MS = 12e4;
const FEISHU_MAX_FILE_UPLOAD_BYTES = 31457280;
const FEISHU_MAX_IMAGE_UPLOAD_BYTES = 10485760;
const FEISHU_VOICE_FILE_NAME = "voice.ogg";
const FEISHU_VOICE_SAMPLE_RATE_HZ = 48e3;
const FEISHU_VOICE_BITRATE = "64k";
const FEISHU_SUPPORTED_IMAGE_CONTENT_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/bmp",
	"image/x-ms-bmp",
	"image/tiff",
	"image/tif",
	"image/heic",
	"image/x-icon",
	"image/ico",
	"image/vnd.microsoft.icon"
]);
const FEISHU_TRANSCODABLE_AUDIO_EXTS = /* @__PURE__ */ new Set([
	".aac",
	".aiff",
	".alac",
	".amr",
	".caf",
	".flac",
	".m4a",
	".mp3",
	".oga",
	".wav",
	".webm",
	".wma"
]);
function createConfiguredFeishuMediaClient(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	return createFeishuClient({
		...account,
		httpTimeoutMs: FEISHU_MEDIA_HTTP_TIMEOUT_MS
	});
}
function asHeaderMap(value) {
	if (!value) return;
	const entries = Object.entries(value);
	if (entries.every(([, entry]) => typeof entry === "string" || Array.isArray(entry))) return Object.fromEntries(entries);
}
function extractFeishuUploadKey(response, params) {
	if (!response) throw new Error(`${params.errorPrefix}: empty response`);
	const wrappedResponse = response;
	if (wrappedResponse.code !== void 0 && wrappedResponse.code !== 0) throw new Error(`${params.errorPrefix}: ${wrappedResponse.msg || `code ${wrappedResponse.code}`}`);
	const key = wrappedResponse[params.key] ?? wrappedResponse.data?.[params.key];
	if (!key) throw new Error(`${params.errorPrefix}: no ${params.key} returned`);
	return key;
}
function readHeaderValue(headers, name) {
	if (!headers) return;
	for (const [key, value] of Object.entries(headers)) {
		if (normalizeLowercaseStringOrEmpty(key) !== normalizeLowercaseStringOrEmpty(name)) continue;
		if (typeof value === "string" && value.trim()) return value.trim();
		if (Array.isArray(value)) {
			const first = value.find((entry) => typeof entry === "string" && entry.trim());
			if (typeof first === "string") return first.trim();
		}
	}
}
function readHttpStatusFromError(error) {
	if (!error || typeof error !== "object") return;
	const response = error.response;
	if (response && typeof response === "object") {
		const status = response.status;
		if (typeof status === "number") return status;
	}
	const status = error.status;
	return typeof status === "number" ? status : void 0;
}
function containsEastAsianScript(value) {
	return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(value);
}
function recoverUtf8FileNameFromLatin1Header(value) {
	const recovered = Buffer.from(value, "latin1").toString("utf8");
	if (recovered !== value && !recovered.includes("�") && containsEastAsianScript(recovered)) return recovered;
	return value;
}
function decodeDispositionFileName(value) {
	const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
	if (utf8Match?.[1]) try {
		return decodeURIComponent(utf8Match[1].trim().replace(/^"(.*)"$/, "$1"));
	} catch {
		return utf8Match[1].trim().replace(/^"(.*)"$/, "$1");
	}
	const plainFileName = value.match(/filename="?([^";]+)"?/i)?.[1]?.trim();
	return plainFileName ? recoverUtf8FileNameFromLatin1Header(plainFileName) : void 0;
}
async function saveMessageResourceWithType(params) {
	const response = await params.client.im.messageResource.get({
		path: {
			message_id: params.messageId,
			file_key: params.fileKey
		},
		params: { type: params.type }
	});
	const headers = asHeaderMap(response.headers);
	const contentType = readHeaderValue(headers, "content-type");
	const disposition = readHeaderValue(headers, "content-disposition");
	const fileName = disposition ? decodeDispositionFileName(disposition) : void 0;
	return {
		saved: await saveMediaStreamWithIdleTimeout(response.getReadableStream(), contentType, params.maxBytes, fileName ?? (params.originalFilename ? recoverUtf8FileNameFromLatin1Header(params.originalFilename) : void 0), FEISHU_MEDIA_HTTP_TIMEOUT_MS),
		contentType,
		fileName
	};
}
async function saveMessageResourceFeishu(params) {
	const { cfg, messageId, fileKey, type, accountId, maxBytes, originalFilename } = params;
	const normalizedFileKey = normalizeFeishuExternalKey(fileKey);
	if (!normalizedFileKey) throw new Error("Feishu message resource download failed: invalid file_key");
	const request = {
		client: createConfiguredFeishuMediaClient({
			cfg,
			accountId
		}),
		messageId,
		fileKey: normalizedFileKey,
		type,
		maxBytes,
		originalFilename
	};
	try {
		return await saveMessageResourceWithType(request);
	} catch (err) {
		if (type !== "file" || readHttpStatusFromError(err) !== 502) throw err;
		try {
			return await saveMessageResourceWithType({
				...request,
				type: "media"
			});
		} catch {
			throw err;
		}
	}
}
/**
* Sanitize a filename for safe use in Feishu multipart/form-data uploads.
* Strips control characters and multipart-injection vectors (CWE-93) while
* preserving the original UTF-8 display name (Chinese, emoji, etc.).
*
* Previous versions percent-encoded non-ASCII characters, but the Feishu
* `im.file.create` API uses `file_name` as a literal display name — it does
* NOT decode percent-encoding — so encoded filenames appeared as garbled text
* in chat (regression in v2026.3.2).
*/
function sanitizeFileNameForUpload(fileName) {
	return fileName.replace(/[\p{Cc}"\\]/gu, "_");
}
async function sendUploadedMediaFeishu(params, media, msgType) {
	const target = resolveFeishuSendTarget(params);
	const label = msgType === "image" ? "image" : "file";
	return sendReplyOrFallbackDirect(target, {
		...params,
		content: JSON.stringify(media),
		msgType,
		directErrorPrefix: `Feishu ${label} send failed`,
		replyErrorPrefix: `Feishu ${label} reply failed`
	});
}
function sendStickerFeishu(params) {
	return sendUploadedMediaFeishu(params, { file_key: params.fileKey }, "sticker");
}
function detectFileType(fileName) {
	switch (normalizeLowercaseStringOrEmpty(path.extname(fileName))) {
		case ".pdf": return "pdf";
		case ".doc":
		case ".docx": return "doc";
		case ".xls":
		case ".xlsx": return "xls";
		case ".ppt":
		case ".pptx": return "ppt";
		default: return "stream";
	}
}
async function resolveFeishuOutboundMediaKind(params) {
	const { buffer, fileName, contentType } = params;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(fileName));
	const detectedContentType = await detectMime({ buffer }) ?? "";
	if (FEISHU_SUPPORTED_IMAGE_CONTENT_TYPES.has(detectedContentType)) return { msgType: "image" };
	if (ext === ".opus" || ext === ".ogg" || contentType === "audio/ogg" || contentType === "audio/opus") return {
		fileType: "opus",
		msgType: "audio"
	};
	if ([
		".mp4",
		".mov",
		".avi"
	].includes(ext) || contentType === "video/mp4" || contentType === "video/quicktime" || contentType === "video/x-msvideo") return {
		fileType: "mp4",
		msgType: "media"
	};
	return {
		fileType: detectFileType(fileName),
		msgType: "file"
	};
}
function assertFeishuUploadWithinEnvelope(params) {
	if (params.buffer.byteLength === 0) throw new Error("Feishu attachments cannot be empty");
	const maxBytes = params.msgType === "image" ? Math.min(params.mediaMaxBytes, FEISHU_MAX_IMAGE_UPLOAD_BYTES) : params.mediaMaxBytes;
	if (params.buffer.byteLength > maxBytes) {
		const label = params.msgType === "image" ? "image" : "file";
		throw new Error(`Feishu ${label} exceeds its ${String(maxBytes)}-byte upload limit`);
	}
}
function isFeishuNativeVoiceAudio(params) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
	const contentType = normalizeLowercaseStringOrEmpty(params.contentType);
	return ext === ".opus" || ext === ".ogg" || contentType === "audio/ogg" || contentType === "audio/opus";
}
function normalizeMediaNameForExtension(raw) {
	try {
		return new URL(raw).pathname;
	} catch {
		return raw.split(/[?#]/, 1)[0] ?? raw;
	}
}
function shouldSuppressFeishuTextForVoiceMedia(params) {
	if (params.ttsSupplement) return params.ttsSupplement.visibleTextAlreadyDelivered === true;
	if (params.audioAsVoice === true) return true;
	if (params.fileName && isFeishuNativeVoiceAudio({
		fileName: params.fileName,
		contentType: params.contentType
	})) return true;
	if (!params.mediaUrl) return false;
	return isFeishuNativeVoiceAudio({
		fileName: normalizeMediaNameForExtension(params.mediaUrl),
		contentType: params.contentType
	});
}
function isLikelyTranscodableAudio(params) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
	const contentType = normalizeLowercaseStringOrEmpty(params.contentType);
	return FEISHU_TRANSCODABLE_AUDIO_EXTS.has(ext) || mediaKindFromMime(contentType) === "audio";
}
async function transcodeToFeishuVoiceOpus(params) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "feishu-voice-"
	}, async (workspace) => {
		const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
		const inputExt = ext && ext.length <= 12 ? ext : ".audio";
		const inputPath = await workspace.write(`input${inputExt}`, params.buffer);
		await writeExternalFileWithinRoot({
			rootDir: workspace.dir,
			path: FEISHU_VOICE_FILE_NAME,
			write: async (outputPath) => {
				await runFfmpeg([
					"-hide_banner",
					"-loglevel",
					"error",
					"-y",
					"-i",
					inputPath,
					"-vn",
					"-sn",
					"-dn",
					"-t",
					String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
					"-ar",
					String(FEISHU_VOICE_SAMPLE_RATE_HZ),
					"-ac",
					"1",
					"-c:a",
					"libopus",
					"-b:a",
					FEISHU_VOICE_BITRATE,
					"-f",
					"ogg",
					outputPath
				]);
			}
		});
		return {
			buffer: await workspace.read(FEISHU_VOICE_FILE_NAME),
			fileName: FEISHU_VOICE_FILE_NAME,
			contentType: "audio/ogg"
		};
	});
}
async function prepareFeishuVoiceMedia(params) {
	if (isFeishuNativeVoiceAudio(params)) return params;
	if (params.audioAsVoice !== true || !isLikelyTranscodableAudio(params)) return params;
	try {
		return await transcodeToFeishuVoiceOpus(params);
	} catch (err) {
		console.warn(`[feishu] audioAsVoice transcode failed; sending ${params.fileName} as a file attachment:`, err);
		return params;
	}
}
async function probeMediaDurationMs(params) {
	try {
		return await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "feishu-media-probe-"
		}, async (workspace) => {
			const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
			const inferredExt = ext && ext.length <= 12 ? ext : mediaKindFromMime(params.contentType) === "video" ? ".mp4" : ".ogg";
			const inputPath = await workspace.write(`input${inferredExt}`, params.buffer);
			const stdout = await runFfprobe([
				"-v",
				"error",
				"-show_entries",
				"format=duration",
				"-of",
				"csv=p=0",
				inputPath
			], { timeoutMs: 5e3 });
			const seconds = Number.parseFloat(stdout.trim());
			if (!Number.isFinite(seconds) || seconds <= 0) return;
			return Math.max(1, Math.round(seconds * 1e3));
		});
	} catch (err) {
		console.warn("[feishu] failed to probe media duration; upload will omit it:", err);
		return;
	}
}
/**
* Upload and send media (image or file) from URL, local path, or buffer.
* Local paths require host-owned mediaAccess or approved legacy roots/readers.
*/
async function sendMediaFeishu(params) {
	const { cfg, mediaUrl, mediaBuffer, fileName, accountId, mediaLocalRoots, audioAsVoice } = params;
	const account = await runBeforeFeishuMessageDispatch(() => {
		const resolved = resolveFeishuRuntimeAccount({
			cfg,
			accountId
		});
		if (!resolved.configured) throw new Error(`Feishu account "${resolved.accountId}" not configured`);
		return resolved;
	});
	const mediaMaxBytes = Math.min((account.config?.mediaMaxMb ?? 30) * 1024 * 1024, FEISHU_MAX_FILE_UPLOAD_BYTES);
	const loaded = await runBeforeFeishuMessageDispatch(async () => {
		if (mediaBuffer) return {
			buffer: mediaBuffer,
			fileName: fileName ?? "file",
			contentType: void 0
		};
		if (mediaUrl) {
			const media = await getFeishuRuntime().media.loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
				maxBytes: mediaMaxBytes,
				mediaAccess: params.mediaAccess,
				mediaLocalRoots,
				mediaReadFile: params.mediaReadFile,
				optimizeImages: false
			}));
			return {
				buffer: media.buffer,
				fileName: fileName ?? media.fileName ?? "file",
				contentType: media.contentType
			};
		}
		throw new Error("Either mediaUrl or mediaBuffer must be provided");
	});
	const loadedRouting = await runBeforeFeishuMessageDispatch(() => resolveFeishuOutboundMediaKind(loaded));
	await runBeforeFeishuMessageDispatch(() => assertFeishuUploadWithinEnvelope({
		buffer: loaded.buffer,
		mediaMaxBytes,
		msgType: loadedRouting.msgType
	}));
	const prepared = await runBeforeFeishuMessageDispatch(() => prepareFeishuVoiceMedia({
		...loaded,
		audioAsVoice
	}));
	const { buffer, fileName: name, contentType } = prepared;
	const routing = prepared.buffer === loaded.buffer && prepared.fileName === loaded.fileName && prepared.contentType === loaded.contentType ? loadedRouting : await runBeforeFeishuMessageDispatch(() => resolveFeishuOutboundMediaKind({
		buffer,
		fileName: name,
		contentType
	}));
	const voiceIntentDegradedToFile = routing.msgType !== "audio" && shouldSuppressFeishuTextForVoiceMedia({
		mediaUrl,
		audioAsVoice
	});
	await runBeforeFeishuMessageDispatch(() => assertFeishuUploadWithinEnvelope({
		buffer,
		mediaMaxBytes,
		msgType: routing.msgType
	}));
	const durationMs = routing.msgType === "audio" || routing.msgType === "media" ? await probeMediaDurationMs({
		buffer,
		fileName: name,
		contentType
	}) : void 0;
	return {
		...await sendUploadedMediaFeishu(params, await runBeforeFeishuMessageDispatch(async () => {
			const client = createConfiguredFeishuMediaClient({
				cfg,
				accountId
			});
			const isImage = routing.msgType === "image";
			const errorPrefix = `Feishu ${isImage ? "image" : "file"} upload failed`;
			const key = extractFeishuUploadKey(await requestFeishuApi(() => isImage ? client.im.image.create({ data: {
				image_type: "message",
				image: buffer
			} }) : client.im.file.create({ data: {
				file_type: routing.fileType ?? "stream",
				file_name: sanitizeFileNameForUpload(name),
				file: buffer,
				...durationMs !== void 0 ? { duration: durationMs } : {}
			} }), errorPrefix, { includeNestedErrorLogId: true }), {
				key: isImage ? "image_key" : "file_key",
				errorPrefix
			});
			return isImage ? { image_key: key } : { file_key: key };
		}), routing.msgType),
		...voiceIntentDegradedToFile ? { voiceIntentDegradedToFile: true } : {}
	};
}
//#endregion
//#region extensions/feishu/src/presentation-card.ts
const RENDERED_FEISHU_CARD = Symbol("openclaw.renderedFeishuCard");
const FEISHU_PRESENTATION_FALLBACK_MARKER = "__openclawPresentationFallback";
const FEISHU_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: false,
	context: true,
	divider: true,
	limits: {
		actions: {
			maxActions: 20,
			maxActionsPerRow: 5,
			maxLabelLength: 40,
			maxValueBytes: 1024
		},
		text: {
			maxLength: 4e3,
			encoding: "characters",
			markdownDialect: "markdown"
		}
	}
};
const FEISHU_CARD_MAX_BYTES = 30720;
const FEISHU_CARD_MAX_ELEMENTS = 200;
function resolveFeishuRichReply(payload) {
	const interactive = normalizeLegacyInteractiveReply(payload.interactive);
	return {
		interactive,
		presentation: normalizeMessagePresentation(payload.presentation) ?? (interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0)
	};
}
function buildFeishuPresentationFallback(params) {
	const fallbackText = renderFeishuPresentationFallbackText(params, params.textFormat);
	const fallbackHasCommand = params.fallbackHasCommand === true || params.presentation?.blocks.some((block) => block.type === "select" ? block.options.some(({ action }) => action?.type === "command") : block.type === "buttons" && block.buttons.some(({ action, disabled }) => !disabled && action?.type === "command")) === true;
	return {
		fallbackText,
		fallbackHasCommand,
		commentText: fallbackHasCommand ? `${fallbackText}\n\n> Interactive buttons are unavailable in Feishu document comments. You can type the command shown above manually.` : fallbackText
	};
}
function countFeishuCardElements(value, ancestors = /* @__PURE__ */ new Set()) {
	if (Array.isArray(value)) return value.reduce((count, entry) => count + countFeishuCardElements(entry, ancestors), 0);
	if (!isRecord(value)) return 0;
	if (ancestors.has(value)) return 201;
	ancestors.add(value);
	let count = typeof value.tag === "string" ? 1 : 0;
	for (const entry of Object.values(value)) {
		count += countFeishuCardElements(entry, ancestors);
		if (count > FEISHU_CARD_MAX_ELEMENTS) break;
	}
	ancestors.delete(value);
	return count;
}
function isFeishuCardWithinEnvelope(card) {
	try {
		return Buffer.byteLength(JSON.stringify(card), "utf8") <= FEISHU_CARD_MAX_BYTES && countFeishuCardElements(card) <= FEISHU_CARD_MAX_ELEMENTS;
	} catch {
		return false;
	}
}
function assertFeishuCardWithinEnvelope(card, label = "Feishu card") {
	if (!isFeishuCardWithinEnvelope(card)) throw new Error(`${label} exceeds the 30 KB or 200-element API limit.`);
}
/** Feishu allows at most five table components per static interactive card. */
const FEISHU_CARD_TABLE_LIMIT = 5;
function countMarkdownTables(text) {
	return text.includes("|") ? markdownToIRWithMeta(text, { tableMode: "block" }).tables.length : 0;
}
function withinCardTableLimit(text) {
	return countMarkdownTables(text) <= FEISHU_CARD_TABLE_LIMIT;
}
function feishuCardWithinTableLimit(card) {
	let remaining = FEISHU_CARD_TABLE_LIMIT;
	const visit = (value) => {
		if (Array.isArray(value)) return value.every(visit);
		if (!isRecord(value)) return true;
		if (value.tag === "markdown" && typeof value.content === "string") remaining -= countMarkdownTables(value.content);
		return remaining >= 0 && Object.values(value).every(visit);
	};
	return visit(card);
}
function resolveFeishuButtonUrl(button) {
	if (button.action?.type === "url" || button.action?.type === "web-app") return button.action.url;
	if (button.action) return;
	return button.url ?? button.webApp?.url ?? button.web_app?.url;
}
function resolveFeishuCommandButtonValue(button) {
	if (button.action?.type === "command") return button.action.command;
	if (button.action) return;
	return button.value;
}
function renderFeishuPresentationFallbackText(params, textFormat = "plain") {
	const presentation = params.presentation;
	return renderMessagePresentationFallbackText({
		...params,
		presentation: presentation && {
			...presentation,
			blocks: presentation.blocks.map((block) => block.type === "buttons" ? {
				type: block.type,
				buttons: block.buttons.map((button) => {
					const url = resolveFeishuButtonUrl(button);
					return {
						...button,
						...textFormat === "markdown" ? { label: escapeFeishuCardPlainText(button.label) } : {},
						...url && !resolveSafeFeishuButtonUrl(url) ? { disabled: true } : {}
					};
				})
			} : block)
		}
	});
}
function buildFeishuPayloadButton(button) {
	const url = resolveSafeFeishuButtonUrl(resolveFeishuButtonUrl(button));
	const value = resolveFeishuCommandButtonValue(button);
	if (button.disabled || !url && !value) return {
		tag: "markdown",
		content: `- ${escapeFeishuCardPlainText(button.label)}`
	};
	const behaviors = [];
	if (url) behaviors.push({
		type: "open_url",
		default_url: url
	});
	if (value) behaviors.push({
		type: "callback",
		value: createFeishuCardInteractionEnvelope({
			k: "quick",
			a: "feishu.payload.button",
			q: value
		})
	});
	return {
		tag: "button",
		text: {
			tag: "plain_text",
			content: button.label
		},
		type: resolveFeishuButtonType(button.style),
		behaviors
	};
}
function buildFeishuCardElementsForBlock(block) {
	if (block.type === "divider") return [{ tag: "hr" }];
	if (block.type === "buttons") return block.buttons.map(buildFeishuPayloadButton);
	let text;
	switch (block.type) {
		case "text":
		case "context":
			text = block.text;
			break;
		case "chart":
			text = renderMessagePresentationChartFallbackText(block);
			break;
		case "table":
			text = renderMessagePresentationTableFallbackText(block);
			break;
		default: text = renderMessagePresentationFallbackText({ presentation: { blocks: [block] } });
	}
	const content = escapeFeishuCardMarkdownText(text);
	return [{
		tag: "markdown",
		content: block.type === "context" ? `<font color='grey'>${content}</font>` : content
	}];
}
function resolvePresentationHeaderTemplate(tone) {
	if (tone === "danger") return "red";
	if (tone === "warning") return "orange";
	if (tone === "success") return "green";
	return "blue";
}
function buildFeishuPresentationCardElements(params) {
	const elements = [];
	const fallbackText = params.fallbackText?.trim();
	if (fallbackText) elements.push({
		tag: "markdown",
		content: escapeFeishuCardMarkdownText(fallbackText)
	});
	for (const block of params.presentation.blocks) elements.push(...buildFeishuCardElementsForBlock(block));
	if (elements.length > 0) return elements;
	return [{
		tag: "markdown",
		content: ""
	}];
}
function buildFeishuPresentationCard(params) {
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		...params.presentation.title ? { header: {
			title: {
				tag: "plain_text",
				content: params.presentation.title
			},
			template: resolvePresentationHeaderTemplate(params.presentation.tone)
		} } : {},
		body: { elements: buildFeishuPresentationCardElements(params) }
	};
}
function markRenderedFeishuCard(card) {
	Object.defineProperty(card, RENDERED_FEISHU_CARD, {
		value: true,
		enumerable: false
	});
	return card;
}
function readNativeFeishuCard(payload) {
	const feishuData = payload.channelData?.feishu;
	if (!isRecord(feishuData)) return;
	const card = feishuData.card ?? feishuData.interactiveCard;
	if (!isRecord(card)) return;
	const rendered = card;
	if (rendered[RENDERED_FEISHU_CARD] === true) return rendered;
	const sanitizedCard = sanitizeNativeFeishuCard(card);
	return sanitizedCard ? markRenderedFeishuCard(sanitizedCard) : void 0;
}
function consumeFeishuPresentationFallbackMarker(payload) {
	const feishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
	const presentationFallback = feishuData?.[FEISHU_PRESENTATION_FALLBACK_MARKER];
	if (!isRecord(presentationFallback) || typeof presentationFallback.hasVisibleContent !== "boolean") return { payload };
	const nextFeishuData = { ...feishuData };
	delete nextFeishuData[FEISHU_PRESENTATION_FALLBACK_MARKER];
	const nextChannelData = { ...payload.channelData };
	if (Object.keys(nextFeishuData).length > 0) nextChannelData.feishu = nextFeishuData;
	else delete nextChannelData.feishu;
	return {
		payload: {
			...payload,
			channelData: Object.keys(nextChannelData).length > 0 ? nextChannelData : void 0
		},
		presentationFallback: { hasVisibleContent: presentationFallback.hasVisibleContent }
	};
}
function buildFeishuPayloadCard(params) {
	const nativeCard = readNativeFeishuCard(params.payload);
	const rawText = params.text ?? params.payload.text;
	const textCard = readNativeFeishuCardJson(rawText);
	const { interactive, presentation } = resolveFeishuRichReply(params.payload);
	let card = nativeCard ?? (!presentation ? textCard : void 0);
	const isNativeCard = card !== void 0;
	if (!card && presentation) card = buildFeishuPresentationCard({
		presentation: {
			...presentation,
			title: presentation.title ?? resolveFeishuIdentityHeaderTitle(params.identity)
		},
		fallbackText: textCard ? void 0 : resolveLegacyInteractiveTextFallback({
			text: rawText,
			interactive
		})
	});
	if (!card) return;
	if (params.mentions?.length) card = {
		...card,
		body: {
			...card.body,
			elements: [{
				tag: "markdown",
				content: buildMentionedCardContent(params.mentions, "").trimEnd()
			}, ...card.body.elements]
		}
	};
	if (isNativeCard) {
		assertFeishuCardWithinEnvelope(card, "Feishu native card");
		return markRenderedFeishuCard(card);
	}
	return isFeishuCardWithinEnvelope(card) && feishuCardWithinTableLimit(card) ? markRenderedFeishuCard(card) : void 0;
}
function renderFeishuPresentationPayload({ payload, presentation, sourcePresentation, ctx }) {
	const card = buildFeishuPayloadCard({
		payload,
		text: payload.text,
		identity: ctx.identity,
		mentions: ctx.mentions
	});
	const isComment = Boolean(parseFeishuCommentTarget(ctx.to));
	const fallbackPresentation = !card || isComment ? sourcePresentation ?? presentation : presentation;
	const { fallbackText, fallbackHasCommand } = buildFeishuPresentationFallback({
		text: readNativeFeishuCardJson(payload.text) ? void 0 : payload.text,
		presentation: fallbackPresentation,
		textFormat: isComment ? "plain" : "markdown"
	});
	const existingFeishuData = isRecord(payload.channelData?.feishu) ? payload.channelData.feishu : void 0;
	return {
		...payload,
		text: fallbackText,
		channelData: {
			...payload.channelData,
			feishu: {
				...existingFeishuData,
				...card ? { card } : { [FEISHU_PRESENTATION_FALLBACK_MARKER]: { hasVisibleContent: Boolean(renderFeishuPresentationFallbackText({ presentation: fallbackPresentation }).trim()) } },
				...fallbackHasCommand ? { fallbackHasCommand: true } : {}
			}
		}
	};
}
async function renderFeishuReplyPayload(payload, ctx) {
	const { presentation } = resolveFeishuRichReply(payload);
	if (!presentation) return { payload };
	const { interactive: _interactive, ...withoutInteractive } = await renderPresentationForDelivery({
		presentationCapabilities: FEISHU_PRESENTATION_CAPABILITIES,
		renderPresentation: (adapted, sourcePresentation) => renderFeishuPresentationPayload({
			payload: adapted,
			presentation: adapted.presentation,
			sourcePresentation,
			ctx
		})
	}, {
		...payload,
		presentation
	});
	return {
		payload: withoutInteractive,
		card: readNativeFeishuCard(withoutInteractive)
	};
}
//#endregion
//#region extensions/feishu/src/reply-delivery-result.ts
const noVisibleFeishuReplyDelivery = { visibleReplySent: false };
function shouldSendNoVisibleReplyFallback(dispatchResult) {
	const emptyEligibleDispatch = dispatchResult.noVisibleReplyFallbackEligible === true && dispatchResult.settledReceipt?.anyVisibleDelivered !== true;
	const finalFailedBeforeSend = (dispatchResult.settledReceipt?.counts.final.failedBeforeSend ?? 0) > 0;
	return dispatchResult.sendPolicyDenied !== true && dispatchResult.sourceReplyDeliveryMode !== "message_tool_only" && (emptyEligibleDispatch || finalFailedBeforeSend);
}
function hasProviderIdentity(result) {
	return Boolean(result && (result.messageId?.trim() || result.receipt?.primaryPlatformMessageId?.trim() || result.receipt?.platformMessageIds.length));
}
/** Normalizes every physical Lark send behind one logical reply payload. */
function createFeishuReplyDeliveryResult(params) {
	const results = params.visibleReplySent ? (params.results ?? []).filter(hasProviderIdentity) : [];
	if (results.length === 0) return {
		visibleReplySent: params.visibleReplySent,
		...params.content === void 0 ? {} : { content: params.content }
	};
	return createAcceptedChannelDeliveryResult({
		results,
		kind: params.kind,
		content: params.content
	});
}
/** Preserves the first result's provider identity while retaining supplemental ids. */
function mergeFeishuReplyDeliveryResults(results, content) {
	const visible = results.filter((result) => result.visibleReplySent === true);
	const acceptedContent = visible.flatMap((result) => result.content === void 0 ? [] : [result.content]);
	return createFeishuReplyDeliveryResult({
		results: visible,
		visibleReplySent: visible.length > 0,
		content: content === void 0 ? acceptedContent.length > 0 ? acceptedContent.join("\n\n") : void 0 : content
	});
}
/** Keeps a failed outcome while exposing the provider-visible subset to core lifecycle hooks. */
function createFeishuPartialReplyDeliveryError(cause, result) {
	if (result.visibleReplySent !== true) return cause instanceof Error ? cause : new Error(formatErrorMessage(cause), { cause });
	return createChannelPartialDeliveryError(cause, {
		...result,
		visibleReplySent: true
	});
}
//#endregion
export { cleanupAmbientCommentTypingReaction as $, sendMessageFeishu as A, resolveFeishuGroupSenderActivationIngressAccess as At, parsePostContent as B, sendStickerFeishu as C, readFeishuChatInfoWithAuthorization as Ct, getMessageFeishu as D, resolveFeishuDmIngressAccess as Dt, editMessageFeishu as E, normalizeFeishuAllowEntry as Et, isFeishuBroadcastMention as F, FEISHU_CARD_INTERACTION_VERSION as Ft, deliverCommentThreadText as G, buildFeishuMediaFallbackText as H, isMentionForwardRequest as I, createFeishuCardInteractionEnvelope as It, feishuExternalToolResult as J, registerFeishuDriveTools as K, isFeishuGroupChatType as L, decodeFeishuCardAction as Lt, toFeishuMessageSendResult as M, resolveFeishuReplyPolicy as Mt, formatFeishuMediaContent as N, normalizeFeishuChatType as Nt, listFeishuThreadMessages as O, resolveFeishuGroupConfig as Ot, extractMentionTargets as P, resolveFeishuChatType as Pt, assertFeishuApiSuccess as Q, normalizeFeishuEventChatType as R, sendMediaFeishu as S, isFeishuGroupReadEnabled as St, chunkFeishuCardMarkdown as T, hasExplicitFeishuGroupConfig as Tt, resolveFeishuIdentityEmoji as U, createConfiguredFeishuClient as V, resolveFeishuIdentityHeaderTitle as W, createFeishuToolClient as X, unknownToolActionResult as Y, resolveFeishuToolAccount as Z, renderFeishuPresentationPayload as _, assertFeishuChatReadAllowed as _t, shouldSendNoVisibleReplyFallback as a, requestFeishuApi as at, withinCardTableLimit as b, canEnumerateAllFeishuPeers as bt, buildFeishuPayloadCard as c, parseFeishuCommentTarget as ct, consumeFeishuPresentationFallbackMarker as d, chunkFeishuMarkdown as dt, createCommentTypingReactionLifecycle as et, feishuCardWithinTableLimit as f, chunkFeishuPostMarkdown as ft, renderFeishuPresentationFallbackText as g, visitFeishuMarkdown as gt, readNativeFeishuCard as h, shouldUseFeishuCard as ht, noVisibleFeishuReplyDelivery as i, parseCommentContentElements as it, sendStructuredCardFeishu as j, resolveFeishuGroupToolPolicy as jt, sendCardFeishu as k, resolveFeishuGroupConversationIngressAccess as kt, buildFeishuPresentationCard as l, readNativeFeishuCardJson as lt, markRenderedFeishuCard as m, parseFeishuMarkdown as mt, createFeishuReplyDeliveryResult as n, extractReplyText as nt, FEISHU_PRESENTATION_CAPABILITIES as o, buildFeishuCommentTarget as ot, isFeishuCardWithinEnvelope as p, materializeFeishuPostMarkdownSoftBreaks as pt, registerFeishuTool as q, mergeFeishuReplyDeliveryResults as r, formatFeishuApiError as rt, assertFeishuCardWithinEnvelope as s, normalizeCommentFileType as st, createFeishuPartialReplyDeliveryError as t, encodeQuery as tt, buildFeishuPresentationFallback as u, resolveFeishuCardTemplate as ut, renderFeishuReplyPayload as v, authorizeFeishuChatMemberRead as vt, shouldSuppressFeishuTextForVoiceMedia as w, resolveFeishuChatReadPreliminaryAuthorization as wt, saveMessageResourceFeishu as x, isFeishuGroupReadAllowed as xt, resolveFeishuRichReply as y, canEnumerateAllFeishuGroups as yt, parseInteractiveCardContent as z };
