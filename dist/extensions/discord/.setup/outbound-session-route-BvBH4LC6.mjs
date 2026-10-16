import { c as resolveDiscordAccount, r as listDiscordAccountIds, t as createDiscordActionGate } from "./accounts-HE9-mj1L.mjs";
import { t as inspectDiscordAccount } from "./account-inspect-DsER5ILV.mjs";
import { A as isDiscordThreadChannelType } from "./allow-list-vxkG9_JD.mjs";
import { d as normalizeDiscordMessagingTarget, p as parseDiscordTarget, u as matchesDiscordToolContextTarget } from "./send.receipt-DVOg2Oaw.mjs";
import { h as readDiscordComponentSpec, m as coerceDiscordComponentParam } from "./components-DLJR0xU-.mjs";
import { n as resolveDiscordCommandOwnerEntries } from "./command-owners-D78sAoOz.mjs";
import { createLazyRuntimeMethod, createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asOptionalRecord, isRecord, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildOutboundBaseSessionKey, deriveLastRoutePolicy, isAcpSessionKey, isSubagentSessionKey, parseAgentSessionKey, resolveAgentIdFromSessionKey, resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { createUnionActionGate } from "openclaw/plugin-sdk/channel-actions";
import { ChannelType } from "discord-api-types/v10";
import { resolveAskUserQuestionOptionIndices } from "openclaw/plugin-sdk/reply-payload";
import { Type } from "typebox";
import { buildThreadAwareOutboundSessionRoute } from "openclaw/plugin-sdk/channel-core";
import { getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { createInboundEventDeliveryCorrelation } from "openclaw/plugin-sdk/inbound-event-delivery";
//#region extensions/discord/src/exec-approvals.ts
function normalizeDiscordApproverId(value) {
	const trimmed = value.trim();
	if (!trimmed) return;
	if (/^\d+$/.test(trimmed)) return trimmed;
	try {
		const target = parseDiscordTarget(trimmed);
		return target?.kind === "user" ? target.id : void 0;
	} catch {
		return;
	}
}
function resolveDiscordOwnerApprovers(cfg) {
	return resolveApprovalApprovers({
		explicit: resolveDiscordCommandOwnerEntries(cfg),
		normalizeApprover: (value) => normalizeDiscordApproverId(String(value))
	});
}
function getDiscordExecApprovalApprovers(params) {
	return resolveApprovalApprovers({
		explicit: params.configOverride?.approvers ?? resolveDiscordAccount(params).config.execApprovals?.approvers ?? resolveDiscordOwnerApprovers(params.cfg),
		normalizeApprover: (value) => normalizeDiscordApproverId(String(value))
	});
}
function isDiscordExecApprovalClientEnabled(params) {
	const config = params.configOverride ?? resolveDiscordAccount(params).config.execApprovals;
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getDiscordExecApprovalApprovers({
			cfg: params.cfg,
			accountId: params.accountId,
			configOverride: params.configOverride
		}).length
	});
}
function isDiscordExecApprovalApprover(params) {
	const senderId = params.senderId?.trim();
	if (!senderId) return false;
	return getDiscordExecApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId,
		configOverride: params.configOverride
	}).includes(senderId);
}
function shouldSuppressLocalDiscordExecApprovalPrompt(params) {
	const metadata = getExecApprovalReplyMetadata(params.payload);
	const config = resolveDiscordAccount(params).config.execApprovals;
	return params.hint?.kind === "approval-pending" && params.hint.nativeRouteActive === true && isDiscordExecApprovalClientEnabled(params) && metadata !== null && matchesApprovalRequestFilters({
		request: {
			agentId: metadata.agentId,
			sessionKey: metadata.sessionKey
		},
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
//#endregion
//#region extensions/discord/src/audit-core.ts
const REQUIRED_TEXT_CHANNEL_PERMISSIONS = ["ViewChannel", "SendMessages"];
const REQUIRED_THREAD_CHANNEL_PERMISSIONS = ["ViewChannel", "SendMessagesInThreads"];
const REQUIRED_VOICE_CHANNEL_PERMISSIONS = [
	"ViewChannel",
	"Connect",
	"Speak",
	"SendMessages",
	"ReadMessageHistory"
];
function resolveRequiredDiscordChannelPermissions(channelType) {
	if (isDiscordThreadChannelType(channelType)) return [...REQUIRED_THREAD_CHANNEL_PERMISSIONS];
	if (channelType === ChannelType.GuildVoice || channelType === ChannelType.GuildStageVoice) return [...REQUIRED_VOICE_CHANNEL_PERMISSIONS];
	return [...REQUIRED_TEXT_CHANNEL_PERMISSIONS];
}
function listConfiguredGuildChannelKeys(guilds) {
	if (!guilds) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const entry of Object.values(guilds)) {
		if (!entry || typeof entry !== "object") continue;
		const channelsRaw = entry.channels;
		if (!isRecord(channelsRaw)) continue;
		for (const [key, value] of Object.entries(channelsRaw)) {
			const channelId = normalizeOptionalString(key) ?? "";
			if (!channelId) continue;
			if (channelId === "*") continue;
			if (value?.enabled === false) continue;
			ids.add(channelId);
		}
	}
	return [...ids].toSorted((a, b) => a.localeCompare(b));
}
function collectDiscordAuditChannelIdsForGuilds(guilds) {
	const keys = listConfiguredGuildChannelKeys(guilds);
	const channelIds = keys.filter((key) => /^\d+$/.test(key));
	return {
		channelIds,
		unresolvedChannels: keys.length - channelIds.length
	};
}
function collectDiscordAuditChannelIdsForAccount(config) {
	const collected = collectDiscordAuditChannelIdsForGuilds(config.guilds);
	const channelIds = new Set(collected.channelIds);
	let unresolvedVoiceChannels = 0;
	for (const entry of config.voice?.autoJoin ?? []) {
		const channelId = normalizeOptionalString(entry?.channelId) ?? "";
		if (/^\d+$/.test(channelId)) channelIds.add(channelId);
		else if (channelId) unresolvedVoiceChannels++;
	}
	return {
		channelIds: [...channelIds].toSorted((a, b) => a.localeCompare(b)),
		unresolvedChannels: collected.unresolvedChannels + unresolvedVoiceChannels
	};
}
async function auditDiscordChannelPermissionsWithFetcher(params) {
	const started = Date.now();
	const token = normalizeOptionalString(params.token) ?? "";
	if (!token || params.channelIds.length === 0) return {
		ok: true,
		checkedChannels: 0,
		unresolvedChannels: 0,
		channels: [],
		elapsedMs: Date.now() - started
	};
	const channels = [];
	for (const channelId of params.channelIds) try {
		const perms = await params.fetchChannelPermissions(channelId, {
			cfg: params.cfg,
			token,
			accountId: params.accountId ?? void 0
		});
		const missing = resolveRequiredDiscordChannelPermissions(perms.channelType).filter((p) => !perms.permissions.includes(p));
		channels.push({
			channelId,
			ok: missing.length === 0,
			missing: missing.length ? missing : void 0,
			error: null,
			matchKey: channelId,
			matchSource: "id"
		});
	} catch (err) {
		channels.push({
			channelId,
			ok: false,
			error: formatErrorMessage(err),
			matchKey: channelId,
			matchSource: "id"
		});
	}
	return {
		ok: channels.every((c) => c.ok),
		checkedChannels: channels.length,
		unresolvedChannels: 0,
		channels,
		elapsedMs: Date.now() - started
	};
}
//#endregion
//#region extensions/discord/src/inbound-event-delivery.ts
const DISCORD_INBOUND_EVENT_DELIVERY_KEY = "__openclawInboundEventDelivery";
function normalizeDiscordDeliveryTarget(value) {
	return value.trim().replace(/^discord:/iu, "").replace(/^channel:/iu, "").toLowerCase();
}
const discordInboundEventDelivery = createInboundEventDeliveryCorrelation({ targetsMatch: (expected, actual) => normalizeDiscordDeliveryTarget(expected) === normalizeDiscordDeliveryTarget(actual) });
function withDiscordInboundEventDeliveryMetadata(payload, params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey || params.inboundEventKind !== "room_event") return payload;
	const channelData = asOptionalRecord(payload.channelData) ?? {};
	const discordData = asOptionalRecord(channelData.discord) ?? {};
	return {
		...payload,
		channelData: {
			...channelData,
			discord: {
				...discordData,
				[DISCORD_INBOUND_EVENT_DELIVERY_KEY]: {
					sessionKey,
					inboundEventKind: params.inboundEventKind
				}
			}
		}
	};
}
function notifyDiscordInboundEventOutboundPayloadSuccess(params) {
	const channelData = asOptionalRecord(params.payload.channelData);
	const discordData = asOptionalRecord(channelData?.discord);
	const metadata = asOptionalRecord(discordData?.[DISCORD_INBOUND_EVENT_DELIVERY_KEY]);
	if (!metadata) return;
	discordInboundEventDelivery.notify({
		sessionKey: normalizeOptionalString(metadata.sessionKey),
		inboundEventKind: normalizeOptionalString(metadata.inboundEventKind),
		to: params.to,
		accountId: params.accountId
	});
}
//#endregion
//#region extensions/discord/src/trusted-requester-actions.ts
const trustedRequesterGuildAdminActions = /* @__PURE__ */ new Set([
	"emoji-upload",
	"sticker-upload",
	"role-add",
	"role-remove",
	"channel-create",
	"channel-edit",
	"channel-delete",
	"channel-move",
	"category-create",
	"category-edit",
	"category-delete",
	"event-create",
	"timeout",
	"kick",
	"ban"
]);
function isTrustedRequesterGuildAdminAction(action) {
	return trustedRequesterGuildAdminActions.has(action);
}
//#endregion
//#region extensions/discord/src/channel-actions.ts
const localExecutionActions = /* @__PURE__ */ new Set([
	"send",
	"poll",
	"upload-file",
	"thread-reply",
	"sticker",
	"emoji-upload",
	"sticker-upload",
	"event-create"
]);
function resolveDiscordActionExecutionMode({ action }) {
	return localExecutionActions.has(action) ? "local" : "gateway";
}
function resolveDiscordThreadReplyDeliveryAlias(args) {
	if (normalizeOptionalString(args.target) || normalizeOptionalString(args.to) || normalizeOptionalString(args.channelId)) return;
	const threadId = normalizeOptionalString(args.threadId);
	return threadId ? normalizeDiscordMessagingTarget(`channel:${threadId}`) : void 0;
}
function resolveDiscordThreadReplyTarget(args) {
	const threadId = normalizeOptionalString(args.threadId);
	const target = threadId !== void 0 ? `channel:${threadId}` : normalizeOptionalString(args.channelId) ?? normalizeOptionalString(args.to) ?? normalizeOptionalString(args.target);
	return target ? normalizeDiscordMessagingTarget(target) : void 0;
}
const loadDiscordChannelActionsRuntime = createLazyRuntimeModule(() => import("./handle-action-UmkjXBfo.mjs"));
const discordActionGroups = [
	{
		gate: "polls",
		actions: ["poll"]
	},
	{
		gate: "reactions",
		actions: [
			"react",
			"reactions",
			"emoji-list"
		]
	},
	{
		gate: "messages",
		actions: [
			"upload-file",
			"read",
			"edit",
			"delete"
		]
	},
	{
		gate: "pins",
		actions: [
			"pin",
			"unpin",
			"list-pins"
		]
	},
	{
		gate: "permissions",
		actions: ["permissions"]
	},
	{
		gate: "threads",
		actions: [
			"thread-create",
			"thread-list",
			"thread-reply"
		]
	},
	{
		gate: "search",
		actions: ["search"]
	},
	{
		gate: "stickers",
		actions: ["sticker"]
	},
	{
		gate: "memberInfo",
		actions: ["member-info"]
	},
	{
		gate: "roleInfo",
		actions: ["role-info"]
	},
	{
		gate: "emojiUploads",
		actions: ["emoji-upload"]
	},
	{
		gate: "stickerUploads",
		actions: ["sticker-upload"]
	},
	{
		gate: "roles",
		actions: ["role-add", "role-remove"],
		defaultEnabled: false
	},
	{
		gate: "channelInfo",
		actions: ["channel-info", "channel-list"]
	},
	{
		gate: "channels",
		actions: [
			"channel-create",
			"channel-edit",
			"channel-delete",
			"channel-move",
			"category-create",
			"category-edit",
			"category-delete"
		]
	},
	{
		gate: "voiceStatus",
		actions: ["voice-status"]
	},
	{
		gate: "events",
		actions: ["event-list", "event-create"]
	},
	{
		gate: "moderation",
		actions: [
			"timeout",
			"kick",
			"ban"
		],
		defaultEnabled: false
	},
	{
		gate: "presence",
		actions: ["set-presence"],
		defaultEnabled: false
	}
];
function describeDiscordMessageTool({ cfg, accountId }) {
	const accounts = (accountId ? [accountId] : listDiscordAccountIds(cfg)).map((id) => inspectDiscordAccount({
		cfg,
		accountId: id
	})).filter((account) => account.enabled && account.configured);
	if (accounts.length === 0) return {
		actions: [],
		capabilities: [],
		schema: null
	};
	const isEnabled = createUnionActionGate(accounts, (account) => createDiscordActionGate({
		cfg,
		accountId: account.accountId
	}));
	const actions = /* @__PURE__ */ new Set(["send"]);
	for (const group of discordActionGroups) if (isEnabled(group.gate, group.defaultEnabled ?? true)) for (const action of group.actions) actions.add(action);
	const schema = [];
	if (actions.has("react")) schema.push({
		actions: ["react", "reactions"],
		properties: { emoji: Type.Optional(Type.String({ description: `Unicode emoji or custom name:id (also <:name:id> / <a:name:id>).${actions.has("emoji-list") ? " Use action:\"emoji-list\" for server emojis." : ""}` })) }
	});
	if (actions.has("send")) schema.push({
		actions: ["send"],
		visibility: "all-configured",
		properties: { components: Type.Optional(Type.Object({
			blocks: Type.Optional(Type.Array(Type.Unknown(), { description: "Discord Components V2 blocks such as text, buttons, selects, media, containers, and separators." })),
			modal: Type.Optional(Type.Object({}, {
				additionalProperties: true,
				description: "Optional Discord modal triggered by generated components."
			}))
		}, {
			additionalProperties: true,
			description: "Discord Components V2 payload for send actions. Accepts the same object consumed by the Discord components adapter."
		})) }
	});
	return {
		actions: Array.from(actions),
		capabilities: ["presentation"],
		schema
	};
}
const discordMessageActions = {
	providerOwnedReadGates: true,
	readAuthorityActions: [
		"read",
		"search",
		"reactions",
		"list-pins",
		"thread-list",
		"channel-info",
		"permissions",
		"member-info",
		"role-info",
		"emoji-list",
		"channel-list",
		"voice-status",
		"event-list"
	],
	writeAuthorityActions: [
		"channel-edit",
		"delete",
		"edit",
		"pin",
		"unpin"
	],
	resolveExecutionMode: resolveDiscordActionExecutionMode,
	describeMessageTool: describeDiscordMessageTool,
	supportsAction: ({ action }) => action !== "poll",
	messageActionTargetAliases: { "thread-reply": {
		aliases: ["threadId"],
		deliveryTargetAliases: ["threadId"],
		resolveDeliveryTarget: ({ args }) => resolveDiscordThreadReplyDeliveryAlias(args),
		matchesCurrentConversation: ({ args, toolContext }) => {
			const target = resolveDiscordThreadReplyTarget(args);
			return target ? matchesDiscordToolContextTarget({
				target,
				toolContext
			}) : false;
		}
	} },
	requiresTrustedRequesterSender: ({ action, toolContext }) => Boolean(toolContext) && isTrustedRequesterGuildAdminAction(action),
	extractToolSend: ({ args }) => {
		const action = normalizeOptionalString(args.action) ?? "";
		if (action === "sendMessage") return extractToolSend(args, "sendMessage");
		if (action === "threadReply") {
			const channelId = normalizeOptionalString(args.channelId) ?? "";
			return channelId ? { to: `channel:${channelId}` } : null;
		}
		return null;
	},
	prepareSendPayload: ({ ctx, payload }) => {
		if (ctx.action !== "send") return null;
		const payloadWithDeliveryMetadata = withDiscordInboundEventDeliveryMetadata(payload, {
			sessionKey: ctx.sessionKey,
			inboundEventKind: ctx.inboundEventKind
		});
		const rawComponents = coerceDiscordComponentParam(ctx.params.components);
		if (typeof rawComponents === "function") return null;
		const componentSpec = rawComponents && typeof rawComponents === "object" && !Array.isArray(rawComponents) ? readDiscordComponentSpec(rawComponents) : void 0;
		const nativeComponents = Array.isArray(rawComponents) ? rawComponents : void 0;
		const embeds = Array.isArray(ctx.params.embeds) ? ctx.params.embeds : void 0;
		if ((componentSpec || nativeComponents) && embeds?.length) return null;
		const filename = normalizeOptionalString(ctx.params.filename);
		if (!componentSpec && !nativeComponents && !embeds?.length && !filename) return payloadWithDeliveryMetadata;
		const discordData = payloadWithDeliveryMetadata.channelData?.discord && typeof payloadWithDeliveryMetadata.channelData.discord === "object" && !Array.isArray(payloadWithDeliveryMetadata.channelData.discord) ? payloadWithDeliveryMetadata.channelData.discord : {};
		return {
			...payloadWithDeliveryMetadata,
			channelData: {
				...payloadWithDeliveryMetadata.channelData,
				discord: {
					...discordData,
					...componentSpec ? { components: componentSpec } : {},
					...nativeComponents ? { components: nativeComponents } : {},
					...embeds?.length ? { embeds } : {},
					...filename ? { filename } : {}
				}
			}
		};
	},
	handleAction: async ({ channel: _channel, sessionKey, ...ctx }) => (await loadDiscordChannelActionsRuntime()).handleDiscordMessageAction({
		...ctx,
		...sessionKey ? { sessionKey } : {}
	})
};
//#endregion
//#region extensions/discord/src/conversation-identity.ts
function normalizeDiscordTarget(raw, defaultKind) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return;
	return parseDiscordTarget(trimmed, { defaultKind })?.normalized;
}
function buildDiscordConversationIdentity(kind, rawId) {
	const trimmed = normalizeOptionalString(rawId);
	return trimmed ? `${kind}:${trimmed}` : void 0;
}
function resolveDiscordConversationIdentity(params) {
	return params.isDirectMessage ? buildDiscordConversationIdentity("user", params.userId) : buildDiscordConversationIdentity("channel", params.channelId);
}
function resolveDiscordRuntimeBindingConversationId(params) {
	if (params.isDirectMessage && !params.isGroupDm) return buildDiscordConversationIdentity("user", params.userId) ?? params.channelId;
	return params.channelId;
}
function resolveDiscordCurrentConversationIdentity(params) {
	if (normalizeOptionalLowercaseString(params.chatType) === "direct") {
		const senderTarget = normalizeDiscordTarget(params.from, "user");
		if (senderTarget?.startsWith("user:")) return senderTarget;
	}
	for (const candidate of [
		params.originatingTo,
		params.commandTo,
		params.fallbackTo
	]) {
		const target = normalizeDiscordTarget(candidate, "channel");
		if (target) return target;
	}
}
//#endregion
//#region extensions/discord/src/monitor/route-resolution.ts
function buildDiscordRoutePeer(params) {
	return {
		kind: params.isGroupDm ? "group" : params.isDirectMessage ? "direct" : "channel",
		id: params.isDirectMessage && !params.isGroupDm ? params.directUserId?.trim() || params.conversationId : params.conversationId
	};
}
function buildDiscordConversationRouteContext(params) {
	return {
		ConversationRouteContextObserved: true,
		ConversationRoutePeerId: buildDiscordRoutePeer(params).id,
		NativeChannelId: params.conversationId,
		InboundAccessAuthorized: true,
		MessageThreadId: params.isThread ? params.conversationId : void 0,
		ThreadParentId: params.isThread ? params.parentConversationId : void 0
	};
}
function resolveDiscordConversationRoute(params) {
	const input = {
		cfg: params.cfg,
		channel: "discord",
		accountId: params.accountId,
		guildId: params.guildId ?? void 0,
		memberRoleIds: params.memberRoleIds,
		peer: params.peer,
		parentPeer: params.parentConversationId ? {
			kind: "channel",
			id: params.parentConversationId
		} : void 0
	};
	try {
		return resolveAgentRoute(input);
	} catch (error) {
		if (!params.defaultAgentId || !(error instanceof Error) || !("code" in error) || error.code !== "AGENT_SELECTION_REQUIRED") throw error;
		return resolveAgentRoute({
			...input,
			defaultAgentId: params.defaultAgentId
		});
	}
}
function resolveDiscordBoundConversationRoute(params) {
	return resolveDiscordEffectiveRoute({
		route: resolveDiscordConversationRoute({
			cfg: params.cfg,
			accountId: params.accountId,
			guildId: params.guildId,
			memberRoleIds: params.memberRoleIds,
			peer: buildDiscordRoutePeer({
				isDirectMessage: params.isDirectMessage,
				isGroupDm: params.isGroupDm,
				directUserId: params.directUserId,
				conversationId: params.conversationId
			}),
			parentConversationId: params.parentConversationId
		}),
		boundSessionKey: params.boundSessionKey,
		configuredRoute: params.configuredRoute,
		matchedBy: params.matchedBy
	});
}
function resolveDiscordEffectiveRoute(params) {
	const boundSessionKey = params.boundSessionKey?.trim();
	if (!boundSessionKey) return params.configuredRoute?.route ?? params.route;
	return {
		...params.route,
		sessionKey: boundSessionKey,
		agentId: resolveAgentIdFromSessionKey(boundSessionKey),
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey: boundSessionKey,
			mainSessionKey: params.route.mainSessionKey
		}),
		...params.matchedBy ? { matchedBy: params.matchedBy } : {}
	};
}
function hasExplicitRuntimeBindingIntent(record) {
	if (record.targetKind === "subagent") return true;
	if (isAcpSessionKey(record.targetSessionKey) || isSubagentSessionKey(record.targetSessionKey)) return true;
	const metadata = record.metadata;
	if (!metadata || typeof metadata !== "object") return false;
	return typeof metadata.boundBy === "string" || typeof metadata.label === "string" || typeof metadata.threadName === "string" || metadata.pluginBindingOwner === "plugin";
}
function shouldIgnoreStaleDiscordRouteBinding(params) {
	const bindingRecord = params.bindingRecord;
	const boundSessionKey = bindingRecord?.targetSessionKey?.trim();
	if (!bindingRecord || !boundSessionKey || hasExplicitRuntimeBindingIntent(bindingRecord)) return false;
	const bound = parseAgentSessionKey(boundSessionKey);
	const routed = parseAgentSessionKey(params.route.sessionKey);
	if (!bound || !routed || bound.rest !== routed.rest) return false;
	return bound.agentId !== params.route.agentId;
}
//#endregion
//#region extensions/discord/src/approval-message-safety.ts
const DISCORD_APPROVAL_ALLOWED_MENTIONS = { parse: [] };
const DISCORD_MARKDOWN_META_CHARACTERS = /* @__PURE__ */ new Set([
	"\\",
	"`",
	"*",
	"_",
	"{",
	"}",
	"[",
	"]",
	"(",
	")",
	"<",
	">",
	"#",
	"+",
	"-",
	".",
	"!",
	"|",
	"~"
]);
function escapeDiscordApprovalDisplayCharacter(character) {
	if (character === "\n") return "\\n";
	if (character === "\r") return "\\r";
	if (character === "	") return "\\t";
	const codePoint = character.codePointAt(0) ?? 0;
	if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159 || codePoint === 8232 || codePoint === 8233) return `\\u{${codePoint.toString(16).padStart(4, "0")}}`;
	return DISCORD_MARKDOWN_META_CHARACTERS.has(character) ? `\\${character}` : character;
}
/** Keep opaque approval metadata bounded, single-line, and inert in Discord Markdown. */
function formatDiscordApprovalDisplayValue(value, maxChars = 200) {
	const limit = Number.isFinite(maxChars) ? Math.max(0, Math.trunc(maxChars)) : 200;
	const escapedParts = Array.from(value, escapeDiscordApprovalDisplayCharacter);
	const escaped = escapedParts.join("");
	if (escaped.length <= limit) return escaped;
	if (limit <= 3) return ".".repeat(limit);
	let bounded = "";
	for (const part of escapedParts) {
		if (bounded.length + part.length > limit - 3) break;
		bounded += part;
	}
	return `${bounded}...`;
}
//#endregion
//#region extensions/discord/src/outbound-components.ts
const DISCORD_MESSAGE_COMPONENT_LIMIT = 40;
const DISCORD_TEXT_DISPLAY_LIMIT = 2e3;
const DISCORD_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: true,
	charts: false,
	limits: {
		actions: {
			maxActions: 25,
			maxActionsPerRow: 5,
			maxRows: 5,
			maxLabelLength: 80,
			supportsDisabled: true
		},
		selects: {
			maxOptions: 25,
			maxLabelLength: 100,
			maxValueBytes: 100
		},
		text: {
			maxLength: DISCORD_TEXT_DISPLAY_LIMIT - Array.from("-# ").length,
			encoding: "characters",
			markdownDialect: "discord-markdown"
		}
	}
};
const sendDiscordComponentMessageLazy = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./send.components-dPljuV24.mjs").then((n) => n.i)), (runtime) => runtime.sendDiscordComponentMessage);
const loadDiscordSharedInteractive = createLazyRuntimeModule(() => import("./components-DLJR0xU-.mjs").then((n) => n.a));
function addPayloadTextFallback(spec, payload) {
	return spec.text ? spec : {
		...spec,
		text: payload.text?.trim() ? payload.text : void 0
	};
}
function countDiscordComponentBlock(block) {
	if (block.type === "section") return 1 + (block.texts?.length ? block.texts.length : block.text ? 1 : 0) + (block.accessory ? 1 : 0);
	if (block.type === "actions") return 1 + (block.buttons?.length ?? (block.select ? 1 : 0));
	return 1;
}
function countDiscordMessageComponents(params) {
	const blocks = params.spec.blocks ?? [];
	let count = 1 + (params.spec.text ? 1 : 0);
	for (const block of blocks) count += countDiscordComponentBlock(block);
	if (params.spec.modal) {
		const lastBlock = blocks.at(-1);
		const triggerFitsLastRow = lastBlock?.type === "actions" && !lastBlock.select && (lastBlock.buttons?.length ?? 0) < 5;
		count += triggerFitsLastRow ? 1 : 2;
	}
	const hasFileBlock = blocks.some((block) => block.type === "file");
	if (params.includesMedia && !hasFileBlock) count += 1;
	return count;
}
function isDiscordComponentSpecWithinMessageLimit(params) {
	const countedSpec = addPayloadTextFallback(params.spec, { text: params.fallbackText });
	if (countedSpec.text && Array.from(countedSpec.text).length > DISCORD_TEXT_DISPLAY_LIMIT) return false;
	return countDiscordMessageComponents({
		spec: countedSpec,
		includesMedia: params.includesMedia === true
	}) <= DISCORD_MESSAGE_COMPONENT_LIMIT;
}
async function buildDiscordPresentationPayload(params) {
	const componentSpec = (await loadDiscordSharedInteractive()).buildDiscordPresentationComponents(params.presentation, { questionOptionIndices: resolveAskUserQuestionOptionIndices(params.payload) });
	if (!componentSpec) return null;
	const includesMedia = Boolean(params.payload.mediaUrl || params.payload.mediaUrls?.some((mediaUrl) => mediaUrl));
	if (!isDiscordComponentSpecWithinMessageLimit({
		spec: componentSpec,
		fallbackText: params.payload.text,
		includesMedia
	})) return null;
	return {
		...params.payload,
		channelData: {
			...params.payload.channelData,
			discord: {
				...params.payload.channelData?.discord,
				presentationComponents: componentSpec
			}
		}
	};
}
async function resolveDiscordComponentSpec(payload) {
	const discordData = payload.channelData?.discord;
	const rawComponentSpec = discordData?.presentationComponents ?? (discordData?.components && typeof discordData.components === "object" && !Array.isArray(discordData.components) ? readDiscordComponentSpec(discordData.components) : null);
	if (rawComponentSpec) return addPayloadTextFallback(rawComponentSpec, payload);
	if (!payload.interactive) return;
	const interactiveSpec = (await loadDiscordSharedInteractive()).buildDiscordInteractiveComponents(payload.interactive);
	return interactiveSpec ? addPayloadTextFallback(interactiveSpec, payload) : void 0;
}
//#endregion
//#region extensions/discord/src/outbound-session-route.ts
function resolveDiscordOutboundSessionRoute(params) {
	const parsed = parseDiscordTarget(params.target, { defaultKind: resolveDiscordOutboundTargetKindHint(params) });
	if (!parsed) return null;
	const explicitThreadId = params.threadId == null ? void 0 : String(params.threadId).trim();
	const peerId = explicitThreadId || parsed.id;
	const isDm = parsed.kind === "user" && !explicitThreadId;
	const recipientSessionExact = /^\d+$/.test(peerId);
	const peer = {
		kind: isDm ? "direct" : "channel",
		id: peerId
	};
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "discord",
		accountId: params.accountId,
		peer
	});
	return buildThreadAwareOutboundSessionRoute({
		route: {
			sessionKey: baseSessionKey,
			baseSessionKey,
			recipientSessionExact,
			peer,
			chatType: isDm ? "direct" : "channel",
			from: isDm ? `discord:${peerId}` : `discord:channel:${peerId}`,
			to: isDm ? `user:${peerId}` : `channel:${peerId}`
		},
		threadId: params.threadId,
		precedence: ["threadId"],
		useSuffix: false
	});
}
function resolveDiscordOutboundTargetKindHint(params) {
	const resolvedKind = params.resolvedTarget?.kind;
	if (resolvedKind === "user") return "user";
	if (resolvedKind === "group" || resolvedKind === "channel") return "channel";
	const target = params.target.trim();
	if (/^channel:/i.test(target)) return "channel";
	if (/^(user:|discord:|@|<@!?)/i.test(target)) return "user";
	return "channel";
}
//#endregion
export { collectDiscordAuditChannelIdsForAccount as C, isDiscordExecApprovalClientEnabled as D, isDiscordExecApprovalApprover as E, shouldSuppressLocalDiscordExecApprovalPrompt as O, auditDiscordChannelPermissionsWithFetcher as S, getDiscordExecApprovalApprovers as T, resolveDiscordRuntimeBindingConversationId as _, resolveDiscordComponentSpec as a, discordInboundEventDelivery as b, formatDiscordApprovalDisplayValue as c, resolveDiscordBoundConversationRoute as d, resolveDiscordConversationRoute as f, resolveDiscordCurrentConversationIdentity as g, resolveDiscordConversationIdentity as h, isDiscordComponentSpecWithinMessageLimit as i, buildDiscordConversationRouteContext as l, shouldIgnoreStaleDiscordRouteBinding as m, DISCORD_PRESENTATION_CAPABILITIES as n, sendDiscordComponentMessageLazy as o, resolveDiscordEffectiveRoute as p, buildDiscordPresentationPayload as r, DISCORD_APPROVAL_ALLOWED_MENTIONS as s, resolveDiscordOutboundSessionRoute as t, buildDiscordRoutePeer as u, discordMessageActions as v, resolveRequiredDiscordChannelPermissions as w, notifyDiscordInboundEventOutboundPayloadSuccess as x, isTrustedRequesterGuildAdminAction as y };
