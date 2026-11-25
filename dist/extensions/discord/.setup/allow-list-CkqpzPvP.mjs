import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ChannelType } from "discord-api-types/v10";
import { asFiniteNumberInRange, parseStrictFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
import { buildChannelKeyCandidates, normalizeChannelSlug, resolveChannelEntryMatchWithFallback, resolveChannelMatchConfig } from "openclaw/plugin-sdk/channel-targets";
import { resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
// extensions/discord/src/channel-type.ts
function isDiscordThreadChannelType(channelType) {
	return channelType === ChannelType.AnnouncementThread || channelType === ChannelType.PublicThread || channelType === ChannelType.PrivateThread;
}
// extensions/discord/src/retry-after.ts
const RETRY_AFTER_BODY_SECONDS_RE = /^(?:\d+\.?\d*|\.\d+)$/;
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function parseDiscordRetryAfterBodySeconds(value) {
	const seconds = typeof value === "number" ? value : typeof value === "string" && RETRY_AFTER_BODY_SECONDS_RE.test(value.trim()) ? parseStrictFiniteNumber(value.trim()) : void 0;
	return asFiniteNumberInRange(seconds, {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
}
// extensions/discord/src/monitor/format.ts
function formatDiscordReactionEmoji(emoji) {
	if (emoji.id && emoji.name) return `<:${emoji.name}:${emoji.id}>`;
	if (emoji.id) return `emoji:${emoji.id}`;
	return emoji.name ?? "emoji";
}
function formatDiscordUserTag(user) {
	const discriminator = (user.discriminator ?? "").trim();
	if (discriminator && discriminator !== "0") return `${user.username}#${discriminator}`;
	return user.username ?? user.id;
}
// extensions/discord/src/monitor/allow-list.ts
const DISCORD_OWNER_ALLOWLIST_PREFIXES = [
	"discord:",
	"user:",
	"pk:"
];
function normalizeDiscordAllowList(raw, prefixes) {
	if (!raw || raw.length === 0) return null;
	const ids = /* @__PURE__ */ new Set();
	const names = /* @__PURE__ */ new Set();
	const allowAll = raw.some((entry) => (normalizeOptionalString(entry) ?? "") === "*");
	for (const entry of raw) {
		const text = normalizeOptionalString(entry) ?? "";
		if (!text || text === "*") continue;
		const normalized = normalizeDiscordSlug(text);
		const maybeId = text.replace(/^<@!?/, "").replace(/>$/, "");
		if (/^\d+$/.test(maybeId)) {
			ids.add(maybeId);
			continue;
		}
		const prefix = prefixes.find((entryLocal) => text.startsWith(entryLocal));
		if (prefix) {
			const candidate = text.slice(prefix.length);
			if (candidate) ids.add(candidate);
			continue;
		}
		if (normalized) names.add(normalized);
	}
	return {
		allowAll,
		ids,
		names
	};
}
function normalizeDiscordSlug(value) {
	return normalizeChannelSlug(value);
}
function normalizeDiscordDisplaySlug(value) {
	return normalizeLowercaseStringOrEmpty(value).normalize("NFC").replace(/[\uFE0E\uFE0F\u20E3]/g, "").replace(/^#/, "").replace(/[\s_]+/g, "-").replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
function allowListMatches(list, candidate, params) {
	return resolveDiscordAllowListMatch({
		allowList: list,
		candidate,
		allowNameMatching: params?.allowNameMatching
	}).allowed;
}
function resolveDiscordAllowListMatch(params) {
	const { allowList, candidate } = params;
	if (allowList.allowAll) return {
		allowed: true,
		matchKey: "*",
		matchSource: "wildcard"
	};
	if (candidate.id && allowList.ids.has(candidate.id)) return {
		allowed: true,
		matchKey: candidate.id,
		matchSource: "id"
	};
	if (params.allowNameMatching === true) for (const matchSource of ["name", "tag"]) {
		const value = candidate[matchSource];
		const matchKey = value ? normalizeDiscordSlug(value) : "";
		if (matchKey && allowList.names.has(matchKey)) return {
			allowed: true,
			matchKey,
			matchSource
		};
	}
	return { allowed: false };
}
function resolveDiscordUserAllowed(params) {
	const allowList = normalizeDiscordAllowList(params.allowList, [
		"discord:",
		"user:",
		"pk:"
	]);
	if (!allowList) return true;
	return allowListMatches(allowList, {
		id: params.userId,
		name: params.userName,
		tag: params.userTag
	}, { allowNameMatching: params.allowNameMatching });
}
function resolveDiscordMemberAllowed(params) {
	const hasUserRestriction = Array.isArray(params.userAllowList) && params.userAllowList.length > 0;
	const hasRoleRestriction = Array.isArray(params.roleAllowList) && params.roleAllowList.length > 0;
	if (!hasUserRestriction && !hasRoleRestriction) return true;
	const userOk = hasUserRestriction ? resolveDiscordUserAllowed({
		...params,
		allowList: params.userAllowList
	}) : false;
	const roles = hasRoleRestriction ? normalizeDiscordAllowList(params.roleAllowList, ["role:"]) : null;
	const roleOk = Boolean(roles && (roles.allowAll || params.memberRoleIds.some((roleId) => roles.ids.has(roleId))));
	return userOk || roleOk;
}
function resolveDiscordMemberAccessState(params) {
	const channelUsers = params.channelConfig?.users ?? params.guildInfo?.users;
	const channelRoles = params.channelConfig?.roles ?? params.guildInfo?.roles;
	return {
		channelUsers,
		channelRoles,
		hasAccessRestrictions: Array.isArray(channelUsers) && channelUsers.length > 0 || Array.isArray(channelRoles) && channelRoles.length > 0,
		memberAllowed: resolveDiscordMemberAllowed({
			userAllowList: channelUsers,
			roleAllowList: channelRoles,
			memberRoleIds: params.memberRoleIds,
			userId: params.sender.id,
			userName: params.sender.name,
			userTag: params.sender.tag,
			allowNameMatching: params.allowNameMatching
		})
	};
}
function resolveDiscordOwnerAllowFrom(params) {
	const rawAllowList = params.channelConfig?.users ?? params.guildInfo?.users;
	if (!Array.isArray(rawAllowList) || rawAllowList.length === 0) return;
	const allowList = normalizeDiscordAllowList(rawAllowList, [
		"discord:",
		"user:",
		"pk:"
	]);
	if (!allowList) return;
	const match = resolveDiscordAllowListMatch({
		allowList,
		candidate: params.sender,
		allowNameMatching: params.allowNameMatching
	});
	if (!match.allowed || !match.matchKey || match.matchKey === "*") return;
	return [match.matchKey];
}
function resolveDiscordOwnerAccess(params) {
	const ownerAllowList = normalizeDiscordAllowList(params.allowFrom?.filter((entry) => (normalizeOptionalString(entry) ?? "") !== "*"), DISCORD_OWNER_ALLOWLIST_PREFIXES);
	return {
		ownerAllowList,
		ownerAllowed: ownerAllowList !== null && allowListMatches(ownerAllowList, params.sender, { allowNameMatching: params.allowNameMatching })
	};
}
function resolveDiscordCommandAuthorized(params) {
	if (!params.isDirectMessage) return true;
	return resolveDiscordUserAllowed({
		allowList: params.allowFrom,
		userId: params.author.id,
		userName: params.author.username,
		userTag: formatDiscordUserTag(params.author),
		allowNameMatching: params.allowNameMatching
	});
}
function resolveDiscordGuildEntry(params) {
	const guild = params.guild;
	const entries = params.guildEntries;
	const guildId = params.guildId?.trim() || guild?.id;
	if (!entries) return null;
	const byId = guildId ? entries[guildId] : void 0;
	if (byId) return {
		...byId,
		id: guildId
	};
	if (!guild) return null;
	const slug = normalizeDiscordSlug(guild.name ?? "");
	const byName = entries[slug] || entries["*"];
	return byName ? {
		...byName,
		id: guildId ?? guild.id,
		slug: slug || byName.slug
	} : null;
}
function hasConfiguredDiscordChannels(channels) {
	return Boolean(channels && Object.keys(channels).length > 0);
}
function resolveDiscordChannelConfigEntry(entry) {
	return {
		allowed: entry.enabled !== false,
		requireMention: entry.requireMention,
		requireMentionInBotThreads: entry.requireMentionInBotThreads,
		ignoreOtherMentions: entry.ignoreOtherMentions,
		skills: entry.skills,
		enabled: entry.enabled,
		users: entry.users,
		roles: entry.roles,
		systemPrompt: entry.systemPrompt,
		includeThreadStarter: entry.includeThreadStarter,
		autoThread: entry.autoThread,
		autoThreadName: entry.autoThreadName,
		autoArchiveDuration: entry.autoArchiveDuration
	};
}
function resolveDiscordChannelConfig(params) {
	return resolveDiscordChannelConfigWithFallback({
		guildInfo: params.guildInfo,
		channelId: params.channelId,
		channelName: params.channelName,
		channelSlug: params.channelSlug
	});
}
function resolveDiscordChannelConfigWithFallback(params) {
	const { guildInfo, channelId, channelName, channelSlug, parentId, parentName, parentSlug, scope } = params;
	const channels = guildInfo?.channels;
	if (!hasConfiguredDiscordChannels(channels)) return null;
	const resolvedParentSlug = parentSlug ?? (parentName ? normalizeDiscordSlug(parentName) : "");
	const match = resolveChannelEntryMatchWithFallback({
		entries: channels,
		keys: buildChannelKeyCandidates(channelId, scope === "thread" ? void 0 : channelSlug, scope === "thread" ? void 0 : channelName),
		parentKeys: parentId || parentName || parentSlug ? buildChannelKeyCandidates(parentId ?? "", resolvedParentSlug, parentName) : void 0,
		wildcardKey: "*"
	});
	return resolveChannelMatchConfig(match, resolveDiscordChannelConfigEntry) ?? { allowed: false };
}
/** Boolean runtime API retained for plugins built against OpenClaw 2026.9.6. */
function resolveDiscordShouldRequireMention(params) {
	return resolveDiscordMentionPolicy(params).requireMention;
}
function resolveDiscordMentionPolicy(params) {
	const botId = params.botId?.trim();
	const threadOwnerId = params.threadOwnerId?.trim();
	const isBotOwnedThread = Boolean(params.isGuildMessage && (params.isAutoThreadOwnedByBot === true || params.isThread && botId && threadOwnerId === botId));
	const isAutoThreadOwnedByBot = params.isAutoThreadOwnedByBot ?? (isBotOwnedThread && params.channelConfig?.autoThread);
	const requireMentionInBotThreads = isBotOwnedThread ? params.channelConfig?.requireMentionInBotThreads ?? params.guildInfo?.requireMentionInBotThreads : void 0;
	return {
		requireMention: requireMentionInBotThreads ?? (params.isGuildMessage && !isAutoThreadOwnedByBot ? params.channelConfig?.requireMention ?? params.guildInfo?.requireMention ?? true : false),
		allowedImplicitMentionKinds: requireMentionInBotThreads === true ? ["native"] : void 0
	};
}
function isDiscordGroupAllowedByPolicy(params) {
	if (params.groupPolicy === "allowlist" && !params.guildAllowlisted) return false;
	if (params.groupPolicy === "disabled") return false;
	return params.groupPolicy !== "allowlist" || !params.channelAllowlistConfigured || params.channelAllowed;
}
function resolveDiscordChannelPolicyCommandAuthorizer(params) {
	const channelAllowlistConfigured = hasConfiguredDiscordChannels(params.guildInfo?.channels);
	return {
		configured: params.groupPolicy === "allowlist" && (Boolean(params.guildInfo) || channelAllowlistConfigured),
		allowed: isDiscordGroupAllowedByPolicy({
			groupPolicy: params.groupPolicy,
			guildAllowlisted: Boolean(params.guildInfo),
			channelAllowlistConfigured,
			channelAllowed: params.channelConfig?.allowed !== false
		})
	};
}
function resolveGroupDmAllow(params) {
	const { channels, channelId, channelName, channelSlug } = params;
	if (!channels || channels.length === 0) return true;
	return resolveAllowlistMatchByCandidates({
		allowList: channels.map((entry) => normalizeDiscordSlug(entry)),
		candidates: [
			{
				value: normalizeDiscordSlug(channelId),
				source: "id"
			},
			{
				value: channelSlug,
				source: "slug"
			},
			{
				value: channelName ? normalizeDiscordSlug(channelName) : void 0,
				source: "name"
			}
		]
	}).allowed;
}
function shouldEmitDiscordReactionNotification(params) {
	const mode = params.mode ?? "own";
	if (mode === "off") return false;
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig: params.channelConfig,
		guildInfo: params.guildInfo,
		memberRoleIds: params.memberRoleIds ?? [],
		sender: {
			id: params.userId,
			name: params.userName,
			tag: params.userTag
		},
		allowNameMatching: params.allowNameMatching
	});
	if (mode === "allowlist") return hasAccessRestrictions && memberAllowed;
	if (hasAccessRestrictions && !memberAllowed) return false;
	if (mode === "all") return true;
	if (mode === "own") return Boolean(params.botId && params.messageAuthorId === params.botId);
	return false;
}
export { parseDiscordRetryAfterBodySeconds as C, formatDiscordUserTag as S, resolveDiscordOwnerAllowFrom as _, normalizeDiscordDisplaySlug as a, shouldEmitDiscordReactionNotification as b, resolveDiscordChannelConfig as c, resolveDiscordCommandAuthorized as d, resolveDiscordGuildEntry as f, resolveDiscordOwnerAccess as g, resolveDiscordMentionPolicy as h, normalizeDiscordAllowList as i, resolveDiscordChannelConfigWithFallback as l, resolveDiscordMemberAllowed as m, hasConfiguredDiscordChannels as n, normalizeDiscordSlug as o, resolveDiscordMemberAccessState as p, isDiscordGroupAllowedByPolicy as r, resolveDiscordAllowListMatch as s, allowListMatches as t, resolveDiscordChannelPolicyCommandAuthorizer as u, resolveDiscordShouldRequireMention as v, isDiscordThreadChannelType as w, formatDiscordReactionEmoji as x, resolveGroupDmAllow as y };
