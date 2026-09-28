import { D as Message, mt as getChannelMessage, t as discord_exports } from "./discord-BXpHW-cu.mjs";
import { C as resolveTimestampMs, S as resolveDiscordSystemLocation, _ as resolveDiscordShouldRequireMention, a as normalizeDiscordDisplaySlug, f as resolveDiscordGuildEntry, l as resolveDiscordChannelConfigWithFallback, o as normalizeDiscordSlug, p as resolveDiscordMemberAccessState, x as formatDiscordUserTag } from "./channel-type-DKnjV1XW.mjs";
import { s as resolveDefaultDiscordAccountId } from "./accounts-CwJQoLjM.mjs";
import { n as resolveDiscordChannelInfoSafe, r as resolveDiscordChannelNameSafe } from "./channel-access-C12aDZ0p.mjs";
import { C as resolveForwardedMediaList, M as resolveDiscordMessageChannelId, O as resolveDiscordMessageStickers, b as resolveDiscordMessageMentionDocuments, j as resolveDiscordChannelInfo, k as resolveDiscordReferencedReplyMessage, v as resolveDiscordMessageBatch, w as resolveMediaList, x as resolveDiscordMessageText, y as resolveDiscordMessageHistoryText } from "./transcripts-source-DVegW0WI.mjs";
import { n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "./timeouts-D86uWLt_.mjs";
import { _ as resolveDiscordRuntimeBindingConversationId, f as resolveDiscordConversationRoute, h as resolveDiscordConversationIdentity, p as resolveDiscordEffectiveRoute, u as buildDiscordRoutePeer } from "./outbound-session-route-VulUE0yV.mjs";
import { t as resolveDiscordConversationBindingRoute } from "./conversation-binding-route-B7qImK_b.mjs";
import { S as resolveDiscordTextCommandAccess, _ as handleDiscordDmCommandDecision, n as resolveDiscordPreflightChannelAccess, x as resolveDiscordDmCommandAccess } from "./provider-iOf73HW-.mjs";
import { n as resolveDiscordWebhookId, t as resolveDiscordSenderIdentity } from "./sender-identity-0Ymgvmaj.mjs";
import { a as createDiscordHistorySenderProvenance, c as hasRawDiscordUserMention, d as matchesActiveDiscordMentionPatterns, f as resolveDiscordMentionState, h as shouldIgnoreBoundThreadWebhookMessage, i as loadSystemEventsRuntime, l as isBoundThreadBotSystemMessage, m as resolvePreflightMentionRequirement, n as loadDiscordThreadingRuntime, p as resolveInjectedBoundThreadLookupRecord, r as loadPreflightAudioRuntime, s as resolveDiscordHistoryMediaIds, t as resolveDiscordPreflightPluralKitInfo, u as isDiscordThreadChannelMessage } from "./message-handler.preflight-pluralkit-8Xji34AF.mjs";
import { logDebug } from "openclaw/plugin-sdk/logging-core";
import { MessageReferenceType, MessageType } from "discord-api-types/v10";
import { readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { mimeTypeFromFilePath } from "openclaw/plugin-sdk/media-mime";
import { getChildLogger, logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
import { formatAllowlistMatchMeta } from "openclaw/plugin-sdk/allow-from";
import { isRecentOutboundMessageIdentity } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { buildMentionRegexes, classifyChannelInboundEvent, logInboundDrop, recordChannelBotPairLoopAndCheckSuppression, resolveGroupThreadMentionFacts, resolveInboundMentionDecision, resolveUnmentionedGroupInboundPolicy, toHistoryMediaEntries, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { enqueueRoutedSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { hasControlCommand } from "openclaw/plugin-sdk/command-detection";
import { isAbortRequestText } from "openclaw/plugin-sdk/command-primitives-runtime";
import { shouldHandleTextCommands } from "openclaw/plugin-sdk/command-surface";
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
//#region extensions/discord/src/monitor/message-handler.dm-preflight.ts
const loadConversationRuntime$1 = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/conversation-binding-runtime"));
const loadDiscordSendRuntime = createLazyRuntimeModule(() => import("./send-CIBzvXjS.mjs").then((n) => n.t));
function resolveDiscordDmPairingSenderId(sender) {
	return sender.isPluralKit ? `pk:${sender.id}` : sender.id;
}
async function resolveDiscordDmPreflightAccess(params) {
	if (params.dmPolicy === "disabled") {
		logVerbose("discord: drop dm (dmPolicy: disabled)");
		return null;
	}
	const directBindingConversationId = resolveDiscordConversationIdentity({
		isDirectMessage: true,
		userId: params.author.id
	}) ?? `user:${params.author.id}`;
	const directBindingRecord = (await loadConversationRuntime$1()).getSessionBindingService().resolveByConversation({
		channel: "discord",
		accountId: params.preflight.accountId,
		conversationId: directBindingConversationId
	});
	const resolveChannelIngress = async (contextBinding, conversation) => await resolveDiscordDmCommandAccess({
		accountId: params.resolvedAccountId,
		dmPolicy: params.dmPolicy,
		configuredAllowFrom: params.preflight.allowFrom ?? [],
		sender: {
			id: params.sender.id,
			name: params.sender.name,
			tag: params.sender.tag,
			isPluralKit: params.sender.isPluralKit,
			authorKind: params.author.bot ? "bot" : "user"
		},
		allowNameMatching: params.allowNameMatching,
		cfg: params.preflight.cfg,
		token: params.preflight.token,
		rest: params.preflight.client.rest,
		conversationId: params.conversationId,
		conversationParentId: conversation?.parentId,
		conversationThreadId: conversation?.threadId,
		...contextBinding ? { contextBinding } : {}
	});
	const dmAccess = await resolveChannelIngress();
	if (params.preflight.isPolicyCurrent?.() === false) return null;
	const commandAuthorized = dmAccess.senderAccess.allowed && dmAccess.commandAccess.authorized || directBindingRecord != null;
	if (dmAccess.senderAccess.decision === "allow") return {
		commandAuthorized,
		channelIngress: dmAccess,
		resolveChannelIngress
	};
	if (directBindingRecord) {
		logVerbose(`discord: allow bound DM conversation ${directBindingConversationId} despite dmPolicy=${params.dmPolicy}`);
		return {
			commandAuthorized,
			channelIngress: dmAccess,
			resolveChannelIngress
		};
	}
	await handleDiscordDmCommandDecision({
		senderAccess: dmAccess.senderAccess,
		accountId: params.resolvedAccountId,
		sender: {
			id: resolveDiscordDmPairingSenderId(params.sender),
			tag: params.sender.tag ?? formatDiscordUserTag(params.author),
			name: params.sender.name ?? params.author.username ?? void 0
		},
		onPairingCreated: async (code) => {
			logVerbose(`discord pairing request sender=${params.author.id} tag=${formatDiscordUserTag(params.author)} reason=${dmAccess.senderAccess.reasonCode}`);
			try {
				const conversationRuntime = await loadConversationRuntime$1();
				const { sendMessageDiscord } = await loadDiscordSendRuntime();
				await sendMessageDiscord(`user:${params.author.id}`, conversationRuntime.buildPairingReply({
					channel: "discord",
					idLine: `Your Discord user id: ${params.author.id}`,
					code
				}), {
					cfg: params.preflight.cfg,
					token: params.preflight.token,
					rest: params.preflight.client.rest,
					accountId: params.preflight.accountId
				});
			} catch (err) {
				logVerbose(`discord pairing reply failed for ${params.author.id}: ${String(err)}`);
			}
		},
		onUnauthorized: async () => {
			logVerbose(`Blocked unauthorized discord sender ${params.sender.id} (dmPolicy=${params.dmPolicy}, reason=${dmAccess.senderAccess.reasonCode})`);
		}
	});
	return null;
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.hydration.ts
function mergeFetchedDiscordMessage(base, fetched) {
	const baseRawData = readMessageRawData(base);
	const baseFallback = readMessageFallback(base);
	const rawData = {
		...baseRawData,
		...fetched,
		id: fetched.id ?? baseRawData.id ?? baseFallback.id,
		channel_id: fetched.channel_id ?? baseRawData.channel_id ?? baseFallback.channel_id,
		content: fetched.content ?? baseRawData.content ?? baseFallback.content,
		author: fetched.author ?? baseRawData.author ?? baseFallback.author,
		attachments: fetched.attachments ?? baseRawData.attachments ?? baseFallback.attachments,
		embeds: fetched.embeds ?? baseRawData.embeds ?? baseFallback.embeds,
		mentions: fetched.mentions ?? baseRawData.mentions ?? baseFallback.mentions,
		mention_roles: fetched.mention_roles ?? baseRawData.mention_roles ?? baseFallback.mention_roles,
		mention_everyone: fetched.mention_everyone ?? baseRawData.mention_everyone ?? baseFallback.mention_everyone,
		timestamp: fetched.timestamp ?? baseRawData.timestamp ?? baseFallback.timestamp,
		tts: fetched.tts ?? baseRawData.tts ?? false,
		pinned: fetched.pinned ?? baseRawData.pinned ?? false,
		type: fetched.type ?? baseRawData.type ?? 0,
		message_snapshots: fetched.message_snapshots ?? baseRawData.message_snapshots ?? baseFallback.message_snapshots,
		sticker_items: fetched.sticker_items ?? baseRawData.sticker_items ?? baseFallback.sticker_items
	};
	const hydrated = new Message(readMessageClient(base), rawData);
	copyRuntimeMessageFields(base, hydrated);
	return hydrated;
}
function readMessageClient(message) {
	return message.client;
}
function readMessageRawData(message) {
	try {
		const rawData = message.rawData;
		return rawData && typeof rawData === "object" ? rawData : {};
	} catch {
		return {};
	}
}
function readMessageFallback(message) {
	const value = message;
	return {
		id: typeof value.id === "string" ? value.id : "",
		channel_id: readStringValue(value.channel_id) ?? readStringValue(value.channelId) ?? "",
		content: typeof value.content === "string" ? value.content : "",
		author: normalizeApiUser(value.author),
		attachments: Array.isArray(value.attachments) ? value.attachments : [],
		embeds: Array.isArray(value.embeds) ? value.embeds : [],
		mentions: normalizeApiUsers(value.mentionedUsers),
		mention_roles: normalizeStringArray(value.mentionedRoles),
		mention_everyone: value.mentionedEveryone === true,
		timestamp: readStringValue(value.timestamp) ?? "1970-01-01T00:00:00.000Z",
		sticker_items: Array.isArray(value.sticker_items) ? value.sticker_items : Array.isArray(value.stickers) ? value.stickers : void 0,
		message_snapshots: Array.isArray(value.message_snapshots) ? value.message_snapshots : void 0
	};
}
function normalizeStringArray(value) {
	return Array.isArray(value) ? value.flatMap((entry) => typeof entry === "string" ? [entry] : []) : [];
}
function normalizeApiUsers(value) {
	return Array.isArray(value) ? value.flatMap((entry) => {
		const user = normalizeApiUser(entry);
		return user.id ? [user] : [];
	}) : [];
}
function normalizeApiUser(value) {
	if (!value || typeof value !== "object") return {
		id: "",
		username: "",
		discriminator: "0",
		global_name: null,
		avatar: null
	};
	const input = value;
	return {
		id: readStringValue(input.id) ?? "",
		username: readStringValue(input.username) ?? "",
		discriminator: readStringValue(input.discriminator) ?? "0",
		global_name: readStringValue(input.global_name) ?? readStringValue(input.globalName) ?? null,
		avatar: input.avatar === null ? null : readStringValue(input.avatar) ?? null,
		...typeof input.bot === "boolean" ? { bot: input.bot } : {}
	};
}
function copyRuntimeMessageFields(source, target) {
	const channelDescriptor = Object.getOwnPropertyDescriptor(source, "channel");
	if (channelDescriptor) Object.defineProperty(target, "channel", channelDescriptor);
}
function shouldHydrateDiscordMessagePayload(params) {
	let currentText;
	try {
		currentText = resolveDiscordMessageText(params.message, { includeForwarded: true });
	} catch {
		return true;
	}
	if (!currentText) return true;
	if ((params.message.mentionedUsers?.length ?? 0) > 0 || (params.message.mentionedRoles?.length ?? 0) > 0 || params.message.mentionedEveryone) return false;
	return /<@!?\d+>|<@&\d+>|@everyone|@here/u.test(currentText);
}
function resolveReferencedMessagePayloadState(message) {
	const reference = message.messageReference;
	if (!reference?.message_id) return "complete";
	if (reference.type != null && reference.type !== MessageReferenceType.Default) return "complete";
	if (message.type != null && message.type !== MessageType.Reply) return "complete";
	const rawData = readMessageRawData(message);
	if (!Object.hasOwn(rawData, "referenced_message")) return "missing";
	const referenced = rawData.referenced_message;
	if (referenced == null) return "complete";
	return typeof referenced === "object" && typeof referenced.id === "string" && referenced.id === reference.message_id ? "complete" : "invalid";
}
async function hydrateDiscordReplyReference(params) {
	const payloadState = resolveReferencedMessagePayloadState(params.message);
	if (payloadState === "complete") return params.message;
	const reference = params.message.messageReference;
	const referencedMessageId = reference?.message_id;
	if (!referencedMessageId) return params.message;
	const referencedChannelId = reference.channel_id ?? params.messageChannelId;
	try {
		const referenced = await getChannelMessage(params.client.rest, referencedChannelId, referencedMessageId);
		return mergeFetchedDiscordMessage(params.message, {
			...readMessageRawData(params.message),
			referenced_message: referenced
		});
	} catch (err) {
		logVerbose(`discord: failed to hydrate referenced message ${referencedMessageId}: ${String(err)}`);
		if (payloadState === "invalid") return mergeFetchedDiscordMessage(params.message, {
			...readMessageRawData(params.message),
			referenced_message: null
		});
		return params.message;
	}
}
async function hydrateDiscordMessageIfNeeded(params) {
	params.channelInfo;
	let hydrated = params.message;
	if (shouldHydrateDiscordMessagePayload({ message: params.message })) try {
		const fetched = await getChannelMessage(params.client.rest, params.messageChannelId, params.message.id);
		logVerbose(`discord: hydrated inbound payload via REST for ${params.message.id}`);
		hydrated = mergeFetchedDiscordMessage(params.message, fetched);
	} catch (err) {
		logVerbose(`discord: failed to hydrate message ${params.message.id}: ${String(err)}`);
		return {
			kind: "unavailable",
			message: params.message
		};
	}
	return {
		kind: "authoritative",
		message: await hydrateDiscordReplyReference({
			client: params.client,
			message: hydrated,
			messageChannelId: params.messageChannelId
		})
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-channel-context.ts
function resolveDiscordPreflightChannelContext(params) {
	const threadName = params.threadChannel?.name;
	const configChannelName = params.threadParentName ?? params.channelName;
	const configChannelSlug = configChannelName ? normalizeDiscordSlug(configChannelName) : "";
	const displayChannelName = threadName ?? params.channelName;
	const displayChannelSlug = displayChannelName ? normalizeDiscordDisplaySlug(displayChannelName) : "";
	const guildSlug = params.guildInfo?.slug || (params.guildName ? normalizeDiscordSlug(params.guildName) : "");
	const threadChannelSlug = params.channelName ? normalizeDiscordSlug(params.channelName) : "";
	const threadParentSlug = params.threadParentName ? normalizeDiscordSlug(params.threadParentName) : "";
	return {
		threadName,
		configChannelName,
		configChannelSlug,
		displayChannelName,
		displayChannelSlug,
		guildSlug,
		threadChannelSlug,
		threadParentSlug,
		channelConfig: params.isGuildMessage ? resolveDiscordChannelConfigWithFallback({
			guildInfo: params.guildInfo,
			channelId: params.messageChannelId,
			channelName: params.channelName,
			channelSlug: threadChannelSlug,
			parentId: params.threadParentId,
			parentName: params.threadParentName,
			parentSlug: threadParentSlug,
			scope: params.threadChannel ? "thread" : "channel"
		}) : null
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-context.ts
function buildDiscordMessagePreflightContext({ preflightParams, ...fields }) {
	return {
		cfg: preflightParams.cfg,
		client: preflightParams.client,
		discordConfig: preflightParams.discordConfig,
		accountId: preflightParams.accountId,
		token: preflightParams.token,
		runtime: preflightParams.runtime,
		buildContext: preflightParams.buildContext,
		botUserId: preflightParams.botUserId,
		abortSignal: preflightParams.abortSignal,
		isPolicyCurrent: preflightParams.isPolicyCurrent,
		guildHistories: preflightParams.guildHistories,
		historyLimit: preflightParams.historyLimit,
		mediaMaxBytes: preflightParams.mediaMaxBytes,
		textLimit: preflightParams.textLimit,
		replyToMode: preflightParams.replyToMode,
		ackReactionScope: preflightParams.ackReactionScope,
		groupPolicy: preflightParams.groupPolicy,
		turnAdoptionLifecycle: preflightParams.turnAdoptionLifecycle,
		...fields,
		threadBindings: preflightParams.threadBindings,
		discordRestFetch: preflightParams.discordRestFetch
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-history.ts
function buildDiscordPreflightHistoryEntry(params) {
	const textForHistory = resolveDiscordMessageHistoryText(params.message, { includeForwarded: true });
	return params.isGuildMessage && params.historyLimit > 0 && textForHistory ? {
		sender: params.senderLabel,
		body: textForHistory,
		timestamp: resolveTimestampMs(params.message.timestamp),
		messageId: params.message.id,
		mediaIds: resolveDiscordHistoryMediaIds(params.message),
		senderProvenance: createDiscordHistorySenderProvenance({
			sender: params.sender,
			memberRoleIds: params.memberRoleIds
		})
	} : void 0;
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-logging.ts
function logDiscordPreflightChannelConfig(params) {
	if (!shouldLogVerbose()) return;
	const channelConfigSummary = params.channelConfig ? `allowed=${params.channelConfig.allowed} enabled=${params.channelConfig.enabled ?? "unset"} requireMention=${params.channelConfig.requireMention ?? "unset"} ignoreOtherMentions=${params.channelConfig.ignoreOtherMentions ?? "unset"} matchKey=${params.channelConfig.matchKey ?? "none"} matchSource=${params.channelConfig.matchSource ?? "none"} users=${params.channelConfig.users?.length ?? 0} roles=${params.channelConfig.roles?.length ?? 0} skills=${params.channelConfig.skills?.length ?? 0}` : "none";
	logDebug(`[discord-preflight] channelConfig=${channelConfigSummary} channelMatchMeta=${params.channelMatchMeta} channelId=${params.channelId}`);
}
function logDiscordPreflightInboundSummary(params) {
	if (!shouldLogVerbose()) return;
	logVerbose(`discord: inbound id=${params.messageId} guild=${params.guildId ?? "dm"} channel=${params.channelId} mention=${params.wasMentioned ? "yes" : "no"} type=${params.isDirectMessage ? "dm" : params.isGroupDm ? "group-dm" : "guild"} content=${params.hasContent ? "yes" : "no"}`);
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-thread.ts
async function resolveDiscordPreflightThreadContext(params) {
	const { resolveDiscordThreadChannel, resolveDiscordThreadParentInfo } = await loadDiscordThreadingRuntime();
	const earlyThreadChannel = resolveDiscordThreadChannel({
		isGuildMessage: params.isGuildMessage,
		message: params.message,
		channelInfo: params.channelInfo,
		messageChannelId: params.messageChannelId
	});
	if (!earlyThreadChannel) return { earlyThreadChannel: null };
	const parentInfo = await resolveDiscordThreadParentInfo({
		client: params.client,
		threadChannel: earlyThreadChannel,
		channelInfo: params.channelInfo
	});
	if (params.abortSignal?.aborted) return null;
	return {
		earlyThreadChannel,
		earlyThreadParentId: parentInfo.id,
		earlyThreadParentName: parentInfo.name,
		earlyThreadParentType: parentInfo.type
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.routing-preflight.ts
const loadConversationRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/conversation-binding-runtime"));
async function resolveDiscordPreflightRoute(params) {
	const conversationRuntime = await loadConversationRuntime();
	const route = resolveDiscordConversationRoute({
		cfg: params.preflight.cfg,
		accountId: params.preflight.accountId,
		guildId: params.preflight.data.guild_id ?? void 0,
		memberRoleIds: params.memberRoleIds,
		peer: buildDiscordRoutePeer({
			isDirectMessage: params.isDirectMessage,
			isGroupDm: params.isGroupDm,
			directUserId: params.author.id,
			conversationId: params.messageChannelId
		}),
		parentConversationId: params.earlyThreadParentId
	});
	const bindingConversationId = resolveDiscordRuntimeBindingConversationId({
		isDirectMessage: params.isDirectMessage,
		isGroupDm: params.isGroupDm,
		userId: params.author.id,
		channelId: params.messageChannelId
	});
	const { runtimeRoute, configuredRoute } = resolveDiscordConversationBindingRoute({
		cfg: params.preflight.cfg,
		route,
		accountId: params.preflight.accountId,
		runtimeConversationId: bindingConversationId,
		configuredConversationId: params.messageChannelId,
		parentConversationId: params.earlyThreadParentId
	});
	let threadBinding = runtimeRoute.bindingRecord ?? void 0;
	const configuredBinding = configuredRoute?.bindingResolution ?? null;
	if (!threadBinding && configuredBinding) threadBinding = configuredBinding.record;
	const boundSessionKey = conversationRuntime.isPluginOwnedSessionBindingRecord(threadBinding) ? "" : runtimeRoute.boundSessionKey ?? threadBinding?.targetSessionKey?.trim();
	const effectiveRoute = runtimeRoute.boundSessionKey ? runtimeRoute.route : resolveDiscordEffectiveRoute({
		route: configuredRoute?.route ?? runtimeRoute.route,
		boundSessionKey,
		configuredRoute,
		matchedBy: "binding.channel"
	});
	return {
		conversationRuntime,
		threadBinding,
		configuredBinding,
		boundSessionKey,
		effectiveRoute,
		boundAgentId: boundSessionKey ? effectiveRoute.agentId : void 0,
		baseSessionKey: effectiveRoute.sessionKey
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight.ts
const DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS = 4;
const DISCORD_HISTORY_MEDIA_MAX_BYTES = 10485760;
const DISCORD_HISTORY_MEDIA_IDLE_TIMEOUT_MS = 1e3;
const DISCORD_HISTORY_MEDIA_TOTAL_TIMEOUT_MS = 3e3;
function resolveDiscordPreflightConversationKind(params) {
	const isGroupDm = params.channelType === discord_exports.ChannelType.GroupDM;
	return {
		isDirectMessage: params.channelType === discord_exports.ChannelType.DM || !params.isGuildMessage && !isGroupDm && params.channelType == null,
		isGroupDm
	};
}
function isDiscordImageAttachmentCandidate(attachment) {
	if ((attachment.content_type?.split(";")[0]?.trim().toLowerCase())?.startsWith("image/")) return true;
	return Boolean(mimeTypeFromFilePath(attachment.filename)?.startsWith("image/") || mimeTypeFromFilePath(attachment.url)?.startsWith("image/"));
}
async function resolveDiscordHistoryMediaForPendingRecord(params) {
	const imageAttachments = (params.message.attachments ?? []).filter(isDiscordImageAttachmentCandidate).slice(0, DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS);
	const stickers = resolveDiscordMessageStickers(params.message).slice(0, Math.max(0, DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS - imageAttachments.length));
	if (imageAttachments.length === 0 && stickers.length === 0) return [];
	const rawData = (() => {
		try {
			return params.message.rawData;
		} catch {
			return {};
		}
	})();
	const mediaMessage = Object.assign(Object.create(Object.getPrototypeOf(params.message)), params.message);
	Object.defineProperties(mediaMessage, {
		attachments: { value: imageAttachments },
		rawData: { value: {
			...rawData,
			attachments: imageAttachments,
			sticker_items: stickers,
			stickers
		} },
		stickers: { value: stickers }
	});
	const mediaList = await resolveMediaList(mediaMessage, Math.min(params.preflight.mediaMaxBytes, DISCORD_HISTORY_MEDIA_MAX_BYTES), {
		fetchImpl: params.preflight.discordRestFetch,
		ssrfPolicy: params.preflight.cfg.browser?.ssrfPolicy,
		readIdleTimeoutMs: DISCORD_HISTORY_MEDIA_IDLE_TIMEOUT_MS,
		totalTimeoutMs: DISCORD_HISTORY_MEDIA_TOTAL_TIMEOUT_MS,
		abortSignal: params.preflight.abortSignal
	});
	const stickerStartIndex = Math.max(0, mediaList.length - stickers.length);
	return (await toInboundMediaFactsWithMetadata(mediaList, { messageId: params.message.id })).map((media, index) => ({
		path: media.path,
		url: media.url,
		contentType: media.contentType,
		kind: index >= stickerStartIndex ? "sticker" : media.kind ?? "image",
		durationMs: media.durationMs,
		width: media.width,
		height: media.height,
		transcribed: media.transcribed,
		messageId: media.messageId
	}));
}
async function recordDiscordPendingHistoryEntry(params) {
	if (!params.entry || params.preflight.historyLimit <= 0) return;
	await createChannelHistoryWindow({ historyMap: params.preflight.guildHistories }).recordWithMedia({
		historyKey: params.historyKey,
		entry: params.entry,
		limit: params.preflight.historyLimit,
		mediaLimit: DISCORD_HISTORY_MEDIA_MAX_ATTACHMENTS,
		messageId: params.message.id,
		shouldRecord: () => !params.preflight.abortSignal?.aborted && params.preflight.isPolicyCurrent?.() !== false,
		media: async () => toHistoryMediaEntries(await resolveDiscordHistoryMediaForPendingRecord({
			preflight: params.preflight,
			message: params.message
		}), { messageId: params.message.id })
	});
}
async function preflightDiscordMessage(params) {
	if (params.abortSignal?.aborted || params.isPolicyCurrent?.() === false) return null;
	const logger = getChildLogger({ module: "discord-auto-reply" });
	let message = params.data.message;
	const author = params.data.author;
	if (!author) return null;
	const messageChannelId = resolveDiscordMessageChannelId({
		message,
		eventChannelId: params.data.channel_id
	});
	if (!messageChannelId) {
		logVerbose(`discord: drop message ${message.id} (missing channel id)`);
		return null;
	}
	const allowBotsSetting = params.discordConfig?.allowBots;
	const allowBotsMode = allowBotsSetting === "mentions" ? "mentions" : allowBotsSetting === true ? "all" : "off";
	if (params.botUserId && author.id === params.botUserId) return null;
	const hydratedSources = [];
	for (const source of [...params.precedingMessages ?? [], message]) {
		hydratedSources.push(await hydrateDiscordMessageIfNeeded({
			client: params.client,
			message: source,
			messageChannelId
		}));
		if (params.abortSignal?.aborted || params.isPolicyCurrent?.() === false) return null;
	}
	message = resolveDiscordMessageBatch(hydratedSources.at(-1).message, hydratedSources.slice(0, -1).map((source) => source.message));
	const pluralkitConfig = params.discordConfig?.pluralkit;
	const webhookId = resolveDiscordWebhookId(message);
	if (isRecentOutboundMessageIdentity({
		channel: "discord",
		accountId: params.accountId,
		conversationId: messageChannelId,
		messageId: message.id,
		...webhookId ? { sourceId: webhookId } : {}
	})) {
		logVerbose(`discord: drop recent outbound echo message ${message.id}`);
		return null;
	}
	const isGuildMessage = Boolean(params.data.guild_id);
	const channelInfo = await resolveDiscordChannelInfo(params.client, messageChannelId);
	if (params.abortSignal?.aborted || params.isPolicyCurrent?.() === false) return null;
	const { isDirectMessage, isGroupDm } = resolveDiscordPreflightConversationKind({
		isGuildMessage,
		channelType: channelInfo?.type
	});
	const messageText = resolveDiscordMessageText(message, { includeForwarded: true });
	const injectedBoundThreadBinding = !isDirectMessage && !isGroupDm && (webhookId || author.bot) ? resolveInjectedBoundThreadLookupRecord({
		threadBindings: params.threadBindings,
		threadId: messageChannelId
	}) : void 0;
	if (shouldIgnoreBoundThreadWebhookMessage({
		threadId: messageChannelId,
		webhookId,
		threadBinding: injectedBoundThreadBinding
	})) {
		logVerbose(`discord: drop bound-thread webhook echo message ${message.id}`);
		return null;
	}
	if (isBoundThreadBotSystemMessage({
		isBoundThreadSession: Boolean(injectedBoundThreadBinding) && isDiscordThreadChannelMessage({
			isGuildMessage,
			message,
			channelInfo
		}),
		isBotAuthor: Boolean(author.bot),
		text: messageText
	})) {
		logVerbose(`discord: drop bound-thread bot system message ${message.id}`);
		return null;
	}
	const pluralkitInfo = await resolveDiscordPreflightPluralKitInfo({
		message,
		webhookId,
		config: pluralkitConfig,
		abortSignal: params.abortSignal
	});
	if (params.abortSignal?.aborted || params.isPolicyCurrent?.() === false) return null;
	const sender = resolveDiscordSenderIdentity({
		author,
		member: params.data.member,
		pluralkitInfo
	});
	if (author.bot) {
		if (allowBotsMode === "off" && !sender.isPluralKit) {
			logVerbose("discord: drop bot message (allowBots=false)");
			return null;
		}
	}
	const data = message === params.data.message ? params.data : {
		...params.data,
		message
	};
	logDebug(`[discord-preflight] channelId=${messageChannelId} guild_id=${params.data.guild_id} channelType=${channelInfo?.type} isGuild=${isGuildMessage} isDM=${isDirectMessage} isGroupDm=${isGroupDm}`);
	if (isGroupDm && !params.groupDmEnabled) {
		logVerbose("discord: drop group dm (group dms disabled)");
		return null;
	}
	if (isDirectMessage && !params.dmEnabled) {
		logVerbose("discord: drop dm (dms disabled)");
		return null;
	}
	const dmPolicy = params.dmPolicy;
	const resolvedAccountId = params.accountId ?? resolveDefaultDiscordAccountId(params.cfg);
	const allowNameMatching = isDangerousNameMatchingEnabled(params.discordConfig);
	let commandAuthorized = true;
	let channelIngress;
	let resolveChannelIngress;
	if (isDirectMessage) {
		const access = await resolveDiscordDmPreflightAccess({
			preflight: params,
			author,
			sender,
			dmPolicy,
			resolvedAccountId,
			allowNameMatching,
			conversationId: messageChannelId
		});
		if (params.abortSignal?.aborted || params.isPolicyCurrent?.() === false) return null;
		if (!access) return null;
		commandAuthorized = access.commandAuthorized;
		channelIngress = access.channelIngress;
		resolveChannelIngress = access.resolveChannelIngress;
	}
	const botId = params.botUserId;
	const baseText = resolveDiscordMessageText(message, { includeForwarded: false });
	recordChannelActivity({
		channel: "discord",
		accountId: params.accountId,
		direction: "inbound"
	});
	const channelName = channelInfo?.name ?? (isGuildMessage || isGroupDm ? resolveDiscordChannelNameSafe("channel" in message ? message.channel : void 0) : void 0);
	const threadContext = await resolveDiscordPreflightThreadContext({
		client: params.client,
		isGuildMessage,
		message,
		channelInfo,
		messageChannelId,
		abortSignal: params.abortSignal
	});
	if (!threadContext || params.isPolicyCurrent?.() === false) return null;
	const { earlyThreadChannel, earlyThreadParentId, earlyThreadParentName, earlyThreadParentType } = threadContext;
	const memberRoleIds = Array.isArray(params.data.rawMember?.roles) ? params.data.rawMember.roles : [];
	const routeState = await resolveDiscordPreflightRoute({
		preflight: params,
		author,
		isDirectMessage,
		isGroupDm,
		messageChannelId,
		memberRoleIds,
		earlyThreadParentId
	});
	if (params.isPolicyCurrent?.() === false) return null;
	const { conversationRuntime, threadBinding, configuredBinding, boundSessionKey, effectiveRoute, boundAgentId, baseSessionKey } = routeState;
	if (shouldIgnoreBoundThreadWebhookMessage({
		threadId: messageChannelId,
		webhookId,
		threadBinding
	})) {
		logVerbose(`discord: drop bound-thread webhook echo message ${message.id}`);
		return null;
	}
	const isBoundThreadSession = Boolean(threadBinding && earlyThreadChannel);
	const bypassMentionRequirement = isBoundThreadSession;
	if (isBoundThreadBotSystemMessage({
		isBoundThreadSession,
		isBotAuthor: Boolean(author.bot),
		text: messageText
	})) {
		logVerbose(`discord: drop bound-thread bot system message ${message.id}`);
		return null;
	}
	const mentionRegexes = buildMentionRegexes(params.cfg, effectiveRoute.agentId, {
		provider: "discord",
		conversationId: messageChannelId,
		providerPolicy: params.discordConfig?.mentionPatterns
	});
	const requiresActiveBotMention = author.bot === true && !sender.isPluralKit && allowBotsMode === "mentions";
	const mentionSources = hydratedSources.map(({ message: source, kind }) => {
		const documents = resolveDiscordMessageMentionDocuments(source);
		const hasRawMention = (kind === "unavailable" || requiresActiveBotMention && source.type === discord_exports.MessageType.Reply) && documents.some((text) => hasRawDiscordUserMention(text, botId));
		const explicitlyMentioned = Boolean(botId && (source.mentionedUsers?.some((user) => user.id === botId) || kind === "unavailable" && hasRawMention));
		return {
			documents,
			explicitlyMentioned,
			activeNativeMention: explicitlyMentioned && (source.type !== discord_exports.MessageType.Reply || hasRawMention)
		};
	});
	const explicitlyMentioned = mentionSources.some((source) => source.explicitlyMentioned);
	const hasAnyMention = !isDirectMessage && ((message.mentionedUsers?.length ?? 0) > 0 || (message.mentionedRoles?.length ?? 0) > 0 || message.mentionedEveryone && (!author.bot || sender.isPluralKit));
	const hasUserOrRoleMention = !isDirectMessage && ((message.mentionedUsers?.length ?? 0) > 0 || (message.mentionedRoles?.length ?? 0) > 0);
	if (isGuildMessage && (message.type === discord_exports.MessageType.ChatInputCommand || message.type === discord_exports.MessageType.ContextMenuCommand)) {
		logVerbose("discord: drop channel command message");
		return null;
	}
	const guildInfo = isGuildMessage ? resolveDiscordGuildEntry({
		guild: params.data.guild ?? void 0,
		guildId: params.data.guild_id ?? void 0,
		guildEntries: params.guildEntries
	}) : null;
	logDebug(`[discord-preflight] guild_id=${params.data.guild_id} guild_obj=${Boolean(params.data.guild)} guild_obj_id=${params.data.guild?.id} guildInfo=${Boolean(guildInfo)} guildEntries=${params.guildEntries ? Object.keys(params.guildEntries).join(",") : "none"}`);
	if (isGuildMessage && params.guildEntries && Object.keys(params.guildEntries).length > 0 && !guildInfo) {
		logDebug(`[discord-preflight] guild blocked: guild_id=${params.data.guild_id} guildEntries keys=${Object.keys(params.guildEntries).join(",")}`);
		logVerbose(`Blocked discord guild ${params.data.guild_id ?? "unknown"} (not in discord.guilds)`);
		return null;
	}
	const threadChannel = earlyThreadChannel;
	const threadParentId = earlyThreadParentId;
	const threadParentName = earlyThreadParentName;
	const threadParentType = earlyThreadParentType;
	const { threadName, configChannelName, configChannelSlug, displayChannelName, displayChannelSlug, guildSlug, channelConfig } = resolveDiscordPreflightChannelContext({
		isGuildMessage,
		messageChannelId,
		channelName,
		guildName: params.data.guild?.name,
		guildInfo,
		threadChannel,
		threadParentId,
		threadParentName
	});
	const channelMatchMeta = formatAllowlistMatchMeta(channelConfig);
	logDiscordPreflightChannelConfig({
		channelConfig,
		channelMatchMeta,
		channelId: messageChannelId
	});
	const channelAccess = resolveDiscordPreflightChannelAccess({
		isGuildMessage,
		isGroupDm,
		groupPolicy: params.groupPolicy,
		groupDmChannels: params.groupDmChannels,
		messageChannelId,
		displayChannelName,
		displayChannelSlug,
		guildInfo,
		channelConfig,
		channelMatchMeta
	});
	if (!channelAccess.allowed) return null;
	const { channelAllowlistConfigured, channelAllowed } = channelAccess;
	const historyEntry = buildDiscordPreflightHistoryEntry({
		isGuildMessage,
		historyLimit: params.historyLimit,
		message,
		senderLabel: sender.label,
		sender,
		memberRoleIds
	});
	const threadOwnerId = threadChannel ? resolveDiscordChannelInfoSafe(threadChannel).ownerId ?? channelInfo?.ownerId : void 0;
	const shouldRequireMentionByConfig = resolveDiscordShouldRequireMention({
		isGuildMessage,
		isThread: Boolean(threadChannel),
		botId,
		threadOwnerId,
		channelConfig,
		guildInfo
	});
	const shouldRequireMention = resolvePreflightMentionRequirement({
		shouldRequireMention: shouldRequireMentionByConfig,
		bypassMentionRequirement
	});
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig,
		guildInfo,
		memberRoleIds,
		sender,
		allowNameMatching
	});
	if (isGuildMessage && hasAccessRestrictions && !memberAllowed) {
		logDebug(`[discord-preflight] drop: member not allowed`);
		logVerbose("Blocked discord guild sender (not in users/roles allowlist)");
		return null;
	}
	const { resolveDiscordPreflightAudioMentionContext } = await loadPreflightAudioRuntime();
	if (params.isPolicyCurrent?.() === false) return null;
	const { hasTypedText, transcript: preflightTranscript } = await resolveDiscordPreflightAudioMentionContext({
		message,
		isDirectMessage,
		shouldRequireMention: shouldRequireMention || requiresActiveBotMention,
		mentionRegexes,
		cfg: params.cfg,
		abortSignal: params.abortSignal
	});
	if (params.abortSignal?.aborted || params.isPolicyCurrent?.() === false) return null;
	const mentionText = hasTypedText ? baseText : "";
	const { implicitMentionKinds, wasMentioned: wasNormallyMentioned } = resolveDiscordMentionState({
		authorIsBot: Boolean(author.bot),
		botId,
		hasAnyMention,
		isDirectMessage,
		isExplicitlyMentioned: explicitlyMentioned,
		mentionRegexes,
		mentionText,
		mentionedEveryone: message.mentionedEveryone,
		referencedAuthorId: message.referencedMessage?.author?.id,
		senderIsPluralKit: sender.isPluralKit,
		transcript: preflightTranscript
	});
	const hasActiveBotMention = requiresActiveBotMention && !isDirectMessage && (mentionSources.some((source) => source.activeNativeMention || source.documents.some((text) => matchesActiveDiscordMentionPatterns(text, mentionRegexes))) || matchesActiveDiscordMentionPatterns(preflightTranscript ?? "", mentionRegexes));
	const groupThread = resolveGroupThreadMentionFacts({
		cfg: params.cfg,
		channel: "discord",
		peerId: isDirectMessage ? buildDiscordRoutePeer({
			isDirectMessage,
			isGroupDm,
			directUserId: author.id,
			conversationId: messageChannelId
		}).id : params.cfg.broadcast?.[`discord:${messageChannelId}`] !== void 0 ? messageChannelId : threadParentId ?? messageChannelId,
		text: mentionText || preflightTranscript || "",
		sessionKey: boundSessionKey || effectiveRoute.sessionKey,
		acpBinding: Boolean(configuredBinding)
	});
	const wasMentioned = wasNormallyMentioned || hasActiveBotMention || Boolean(groupThread?.mentionedAgentIds.length);
	logDiscordPreflightInboundSummary({
		messageId: message.id,
		guildId: params.data.guild_id ?? void 0,
		channelId: messageChannelId,
		wasMentioned,
		isDirectMessage,
		isGroupDm,
		hasContent: Boolean(messageText)
	});
	const allowTextCommands = shouldHandleTextCommands({
		cfg: params.cfg,
		surface: "discord"
	});
	const hasControlCommandInMessage = hasControlCommand(baseText, params.cfg);
	const hasAbortRequest = isAbortRequestText(baseText);
	if (!isDirectMessage) {
		const resolveCommandIngress = async (contextBinding, conversation) => await resolveDiscordTextCommandAccess({
			accountId: params.accountId,
			cfg: params.cfg,
			ownerAllowFrom: params.allowFrom,
			sender: {
				id: sender.id,
				name: sender.name,
				tag: sender.tag,
				isPluralKit: sender.isPluralKit,
				authorKind: author.bot ? "bot" : "user"
			},
			memberAccessConfigured: hasAccessRestrictions,
			memberAllowed,
			allowNameMatching,
			allowTextCommands,
			hasControlCommand: hasControlCommandInMessage,
			conversationId: messageChannelId,
			conversationParentId: conversation?.parentId,
			conversationThreadId: conversation?.threadId,
			...contextBinding ? { contextBinding } : {}
		});
		const commandAccess = await resolveCommandIngress();
		if (params.isPolicyCurrent?.() === false) return null;
		commandAuthorized = commandAccess.commandAccess.authorized;
		channelIngress = commandAccess;
		resolveChannelIngress = resolveCommandIngress;
		if (commandAccess.commandAccess.shouldBlockControlCommand) {
			logInboundDrop({
				log: logVerbose,
				channel: "discord",
				reason: "control command (unauthorized)",
				target: sender.id
			});
			return null;
		}
	}
	const canDetectMention = Boolean(groupThread) || Boolean(botId) || mentionRegexes.length > 0;
	const mentionDecision = resolveInboundMentionDecision({
		facts: {
			canDetectMention,
			wasMentioned,
			hasAnyMention,
			implicitMentionKinds
		},
		policy: {
			isGroup: isGuildMessage,
			requireMention: shouldRequireMention,
			allowTextCommands,
			hasControlCommand: hasControlCommandInMessage,
			commandAuthorized
		}
	});
	const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
	const inboundEventKind = classifyChannelInboundEvent({
		conversation: { kind: isDirectMessage ? "direct" : isGroupDm ? "group" : "channel" },
		unmentionedGroupPolicy: resolveUnmentionedGroupInboundPolicy({
			cfg: params.cfg,
			agentId: effectiveRoute.agentId
		}),
		wasMentioned: effectiveWasMentioned,
		hasControlCommand: hasControlCommandInMessage,
		hasAbortRequest
	});
	logDebug(`[discord-preflight] shouldRequireMention=${shouldRequireMention} baseRequireMention=${shouldRequireMentionByConfig} boundThreadSession=${isBoundThreadSession} mentionDecision.shouldSkip=${mentionDecision.shouldSkip} wasMentioned=${wasMentioned}`);
	if (isGuildMessage && shouldRequireMention) {
		if (mentionDecision.shouldSkip) {
			logDebug(`[discord-preflight] drop: no-mention`);
			logVerbose(`discord: drop guild message (mention required, botId=${botId ?? "<missing>"})`);
			logger.info({
				channelId: messageChannelId,
				reason: "no-mention"
			}, "discord: skipping guild message");
			await recordDiscordPendingHistoryEntry({
				preflight: params,
				historyKey: messageChannelId,
				message,
				entry: historyEntry
			});
			return null;
		}
	}
	if (requiresActiveBotMention) {
		if (!(isDirectMessage || hasActiveBotMention || mentionDecision.matchedImplicitMentionKinds.some((kind) => kind !== "reply_to_bot"))) {
			logDebug(`[discord-preflight] drop: bot message missing mention (allowBots=mentions)`);
			logVerbose("discord: drop bot message (allowBots=mentions, missing mention)");
			return null;
		}
	}
	const ignoreOtherMentions = channelConfig?.ignoreOtherMentions ?? guildInfo?.ignoreOtherMentions ?? false;
	const referencedReply = resolveDiscordReferencedReplyMessage(message);
	const referencedWebhookId = referencedReply ? resolveDiscordWebhookId(referencedReply) : null;
	const referencedAuthor = referencedReply?.author;
	const replyTargetsOtherBot = Boolean(botId) && Boolean(referencedAuthor?.bot) && referencedAuthor?.id !== botId && !referencedWebhookId;
	if (isGuildMessage && ignoreOtherMentions && (hasUserOrRoleMention || replyTargetsOtherBot) && !wasMentioned && !mentionDecision.implicitMention) {
		logDebug(`[discord-preflight] drop: addressed-to-other`);
		logVerbose(`discord: drop guild message (addressed to another identity, ignoreOtherMentions=true, botId=${botId})`);
		await recordDiscordPendingHistoryEntry({
			preflight: params,
			historyKey: messageChannelId,
			message,
			entry: historyEntry
		});
		return null;
	}
	const systemLocation = resolveDiscordSystemLocation({
		isDirectMessage,
		isGroupDm,
		guild: params.data.guild ?? void 0,
		channelName: channelName ?? messageChannelId
	});
	const { resolveDiscordSystemEvent } = await loadSystemEventsRuntime();
	if (params.isPolicyCurrent?.() === false) return null;
	const systemText = resolveDiscordSystemEvent(message, systemLocation);
	if (systemText) {
		logDebug(`[discord-preflight] drop: system event`);
		enqueueRoutedSystemEvent(systemText, effectiveRoute, { contextKey: `discord:system:${messageChannelId}:${message.id}` });
		return null;
	}
	const hasNativeMedia = (message.attachments?.length ?? 0) > 0 || resolveDiscordMessageStickers(message).length > 0;
	if (!messageText && !hasNativeMedia) {
		logDebug(`[discord-preflight] drop: empty content`);
		logVerbose(`discord: drop message ${message.id} (empty content)`);
		return null;
	}
	if (configuredBinding) {
		const ensured = await conversationRuntime.ensureConfiguredBindingRouteReady({
			cfg: params.cfg,
			bindingResolution: configuredBinding
		});
		if (params.isPolicyCurrent?.() === false) return null;
		if (!ensured.ok) {
			logVerbose(`discord: configured ACP binding unavailable for channel ${configuredBinding.record.conversation.conversationId}: ${ensured.error}`);
			return null;
		}
	}
	const botLoopProtection = author.bot && !sender.isPluralKit && allowBotsMode !== "off" && params.botUserId && author.id !== params.botUserId ? {
		scopeId: params.accountId,
		conversationId: messageChannelId,
		senderId: author.id,
		receiverId: params.botUserId,
		config: params.discordConfig?.botLoopProtection,
		defaultsConfig: params.cfg.channels?.defaults?.botLoopProtection,
		defaultEnabled: true,
		nowMs: resolveTimestampMs(message.timestamp)
	} : void 0;
	if (botLoopProtection) {
		const botLoopResult = recordChannelBotPairLoopAndCheckSuppression(botLoopProtection);
		if (botLoopResult.suppressed) {
			logVerbose(`discord: bot-to-bot loop detected before media download, suppressing for ${Math.max(0, Math.ceil((botLoopResult.cooldownUntilMs - Date.now()) / 1e3))}s`);
			return null;
		}
	}
	const guildId = isGuildMessage ? data.guild?.id ?? data.guild_id ?? message.guild_id : void 0;
	const conversationAvatar = isDirectMessage || guildId ? params.avatarResolver?.resolve({
		client: params.client,
		conversationId: messageChannelId,
		author,
		...guildId ? { guildId } : {}
	}) : void 0;
	const mediaResolveOptions = {
		fetchImpl: params.discordRestFetch,
		ssrfPolicy: params.cfg.browser?.ssrfPolicy,
		readIdleTimeoutMs: DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
		totalTimeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
		abortSignal: params.abortSignal
	};
	const preparedMedia = await resolveMediaList(message, params.mediaMaxBytes, mediaResolveOptions);
	if (params.abortSignal?.aborted) return null;
	const forwardedMedia = await resolveForwardedMediaList(message, params.mediaMaxBytes, mediaResolveOptions);
	if (params.abortSignal?.aborted) return null;
	preparedMedia.push(...forwardedMedia);
	logDebug(`[discord-preflight] success: route=${effectiveRoute.agentId} sessionKey=${effectiveRoute.sessionKey}`);
	return buildDiscordMessagePreflightContext({
		preflightParams: params,
		groupThread,
		data,
		message,
		sourceMessageIds: hydratedSources.map((source) => source.message.id),
		messageChannelId,
		author,
		sender,
		canonicalMessageId: pluralkitInfo?.original?.trim() || void 0,
		memberRoleIds,
		channelInfo,
		channelName,
		isGuildMessage,
		isDirectMessage,
		isGroupDm,
		commandAuthorized,
		channelIngress,
		resolveChannelIngress,
		baseText,
		messageText,
		...preflightTranscript !== void 0 ? { preflightAudioTranscript: preflightTranscript } : {},
		preparedMedia,
		wasMentioned,
		conversationAvatar,
		route: effectiveRoute,
		threadBinding,
		boundSessionKey: boundSessionKey || void 0,
		boundAgentId,
		guildInfo,
		guildSlug,
		threadChannel,
		threadParentId,
		threadParentName,
		threadParentType,
		threadName,
		configChannelName,
		configChannelSlug,
		displayChannelName,
		displayChannelSlug,
		baseSessionKey,
		channelConfig,
		channelAllowlistConfigured,
		channelAllowed,
		shouldRequireMention,
		groupRequireMention: shouldRequireMentionByConfig,
		hasAnyMention,
		hasControlCommand: hasControlCommandInMessage,
		allowTextCommands,
		shouldBypassMention: mentionDecision.shouldBypassMention,
		effectiveWasMentioned,
		inboundEventKind,
		canDetectMention,
		historyEntry
	});
}
//#endregion
export { preflightDiscordMessage, resolvePreflightMentionRequirement, shouldIgnoreBoundThreadWebhookMessage };
