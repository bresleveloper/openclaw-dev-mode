import { ChannelType } from "discord-api-types/v10";
import { asFiniteNumberInRange, parseDateStringTimestampMs, parseStrictFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { fetchWithSsrFGuard, isBlockedHostnameOrIp, isLoopbackHost } from "openclaw/plugin-sdk/ssrf-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelKeyCandidates, resolveChannelEntryMatchWithFallback, resolveChannelMatchConfig } from "openclaw/plugin-sdk/channel-targets";
import { resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
//#region extensions/discord/src/endpoint-runtime.ts
const DISCORD_ENDPOINT_RESPONSE_MAX_BYTES = 8388608;
const DISCORD_API_URL_ENV = "DISCORD_API_URL";
function parseHttpAnchor(value, label) {
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`${label} must be a valid URL`);
	}
	if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopbackHost(url.hostname))) throw new Error(`${label} must use HTTPS or loopback HTTP`);
	if (url.username || url.password || url.hash) throw new Error(`${label} must not contain credentials or a fragment`);
	return url;
}
function normalizeRestApiBaseUrl(value) {
	const url = parseHttpAnchor(value, "Discord endpoint REST API base URL");
	if (url.search) throw new Error("Discord endpoint REST API base URL must not contain a query");
	url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
	return url;
}
function normalizeGatewayOrigin(value) {
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error("Discord endpoint Gateway origin must be a valid URL");
	}
	if (url.protocol !== "wss:" && !(url.protocol === "ws:" && isLoopbackHost(url.hostname))) throw new Error("Discord endpoint Gateway origin must use WSS or loopback WS");
	if (url.protocol === "wss:" && isBlockedHostnameOrIp(url.hostname)) throw new Error("Discord endpoint Gateway origin must not target a private/internal/special-use hostname or IP address");
	if (url.username || url.password || url.hash || url.pathname !== "/" || url.search) throw new Error("Discord endpoint Gateway origin must be an origin without credentials, path, query, or fragment");
	return url.origin;
}
function resolveDescriptor(apiUrl) {
	const restApiBaseUrl = normalizeRestApiBaseUrl(apiUrl);
	const gatewayBotUrl = new URL(`${restApiBaseUrl.pathname.replace(/\/+$/u, "")}/gateway/bot`, restApiBaseUrl.origin);
	const gatewayOriginUrl = new URL(restApiBaseUrl.origin);
	gatewayOriginUrl.protocol = gatewayOriginUrl.protocol === "https:" ? "wss:" : "ws:";
	return Object.freeze({
		restApiBaseUrl: restApiBaseUrl.toString().replace(/\/$/u, ""),
		gatewayBotUrl: gatewayBotUrl.toString(),
		gatewayOrigin: normalizeGatewayOrigin(gatewayOriginUrl.origin)
	});
}
function isWithinRestApiBase(target, restApiBaseUrl) {
	if (target.origin !== restApiBaseUrl.origin) return false;
	const basePath = restApiBaseUrl.pathname.replace(/\/+$/u, "");
	return basePath === "" || target.pathname === basePath || target.pathname.startsWith(`${basePath}/`);
}
function assertEndpointHttpTarget(target, descriptor) {
	const restApiBaseUrl = new URL(descriptor.restApiBaseUrl);
	const gatewayBotUrl = new URL(descriptor.gatewayBotUrl);
	if (!isWithinRestApiBase(target, restApiBaseUrl) && target.toString() !== gatewayBotUrl.toString()) throw new Error("Discord endpoint request is outside the configured boundaries");
}
function requestInitFromRequest(request, signal) {
	return {
		method: request.method,
		headers: request.headers,
		...request.body ? {
			body: request.body,
			duplex: "half"
		} : {},
		signal,
		cache: request.cache,
		credentials: request.credentials,
		integrity: request.integrity,
		keepalive: request.keepalive,
		mode: request.mode,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy
	};
}
function createEndpointFetch(descriptor) {
	const allowedOrigins = Array.from(/* @__PURE__ */ new Set([new URL(descriptor.restApiBaseUrl).origin, new URL(descriptor.gatewayBotUrl).origin]));
	return async (input, init, beforeRequest) => {
		const request = new Request(input, init);
		const target = new URL(request.url);
		assertEndpointHttpTarget(target, descriptor);
		const guarded = await fetchWithSsrFGuard({
			url: target.toString(),
			init: requestInitFromRequest(request, request.signal),
			signal: request.signal,
			requireHttps: target.protocol === "https:",
			policy: { allowedOrigins },
			maxRedirects: 0,
			capture: false,
			auditContext: "discord.endpoint-runtime",
			beforeRequest
		});
		try {
			const body = await readResponseWithLimit(guarded.response, DISCORD_ENDPOINT_RESPONSE_MAX_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Discord endpoint response too large: ${size} bytes (limit: ${maxBytes} bytes)`) });
			return new Response(body.byteLength > 0 ? new Uint8Array(body) : null, {
				status: guarded.response.status,
				statusText: guarded.response.statusText,
				headers: guarded.response.headers
			});
		} finally {
			await guarded.release();
		}
	};
}
/** Resolve the process-wide Discord API override using the same env convention as sibling channels. */
function getDiscordEndpointRuntime(env = process.env) {
	const apiUrl = env[DISCORD_API_URL_ENV]?.trim();
	if (!apiUrl) return;
	const descriptor = resolveDescriptor(apiUrl);
	return Object.freeze({
		descriptor,
		fetch: createEndpointFetch(descriptor)
	});
}
function resolveDiscordEndpointMediaGuard(url, retainedRuntime) {
	if (retainedRuntime === null) return;
	const runtime = retainedRuntime ?? getDiscordEndpointRuntime();
	if (!runtime) return;
	const target = parseHttpAnchor(url, "Discord endpoint media URL");
	const restOrigin = new URL(runtime.descriptor.restApiBaseUrl).origin;
	if (target.origin !== restOrigin) throw new Error("Discord endpoint media URL is outside the configured REST origin");
	return {
		maxRedirects: 0,
		ssrfPolicy: {
			allowedOrigins: [restOrigin],
			hostnameAllowlist: [target.hostname]
		}
	};
}
function resolveDiscordEndpointAttachmentGuard(url, retainedRuntime) {
	if (retainedRuntime === null) return;
	const runtime = retainedRuntime ?? getDiscordEndpointRuntime();
	if (!runtime) return;
	const target = parseHttpAnchor(url, "Discord endpoint attachment upload URL");
	const restOrigin = new URL(runtime.descriptor.restApiBaseUrl).origin;
	if (target.origin !== restOrigin) throw new Error("Discord endpoint attachment upload URL is outside the configured REST origin");
	return {
		maxRedirects: 0,
		policy: {
			allowedOrigins: [restOrigin],
			hostnameAllowlist: [target.hostname]
		},
		requireHttps: target.protocol === "https:"
	};
}
function assertDiscordEndpointGatewayUrl(url, gatewayOrigin) {
	if (!gatewayOrigin) return;
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("Discord endpoint returned an invalid Gateway WebSocket URL");
	}
	if (parsed.origin !== gatewayOrigin || parsed.username || parsed.password || parsed.hash) throw new Error("Discord endpoint Gateway URL is outside the configured WebSocket origin");
}
//#endregion
//#region extensions/discord/src/retry-after.ts
const RETRY_AFTER_BODY_SECONDS_RE = /^(?:\d+\.?\d*|\.\d+)$/;
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function parseDiscordRetryAfterBodySeconds(value) {
	const seconds = typeof value === "number" ? value : typeof value === "string" && RETRY_AFTER_BODY_SECONDS_RE.test(value.trim()) ? parseStrictFiniteNumber(value.trim()) : void 0;
	return asFiniteNumberInRange(seconds, {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
}
//#endregion
//#region extensions/discord/src/monitor/format.ts
function resolveDiscordSystemLocation(params) {
	const { isDirectMessage, isGroupDm, guild, channelName } = params;
	if (isDirectMessage) return "DM";
	if (isGroupDm) return `Group DM #${channelName}`;
	return guild?.name ? `${guild.name} #${channelName}` : `#${channelName}`;
}
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
function resolveTimestampMs(timestamp) {
	return parseDateStringTimestampMs(timestamp);
}
//#endregion
//#region extensions/discord/src/monitor/allow-list.ts
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
	return normalizeLowercaseStringOrEmpty(value).replace(/^#/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function normalizeDiscordDisplaySlug(value) {
	return normalizeLowercaseStringOrEmpty(value).normalize("NFC").replace(/^#/, "").replace(/[\s_]+/g, "-").replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
function resolveDiscordAllowListNameMatch(list, candidate) {
	const nameSlug = candidate.name ? normalizeDiscordSlug(candidate.name) : "";
	if (nameSlug && list.names.has(nameSlug)) return {
		matchKey: nameSlug,
		matchSource: "name"
	};
	const tagSlug = candidate.tag ? normalizeDiscordSlug(candidate.tag) : "";
	if (tagSlug && list.names.has(tagSlug)) return {
		matchKey: tagSlug,
		matchSource: "tag"
	};
	return null;
}
function allowListMatches(list, candidate, params) {
	if (list.allowAll) return true;
	if (candidate.id && list.ids.has(candidate.id)) return true;
	if (params?.allowNameMatching === true) {
		if (resolveDiscordAllowListNameMatch(list, candidate)) return true;
	}
	return false;
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
	if (params.allowNameMatching === true) {
		const namedMatch = resolveDiscordAllowListNameMatch(allowList, candidate);
		if (namedMatch) return {
			allowed: true,
			...namedMatch
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
function resolveDiscordRoleAllowed(params) {
	const allowList = normalizeDiscordAllowList(params.allowList, ["role:"]);
	if (!allowList) return true;
	if (allowList.allowAll) return true;
	return params.memberRoleIds.some((roleId) => allowList.ids.has(roleId));
}
function resolveDiscordMemberAllowed(params) {
	const hasUserRestriction = Array.isArray(params.userAllowList) && params.userAllowList.length > 0;
	const hasRoleRestriction = Array.isArray(params.roleAllowList) && params.roleAllowList.length > 0;
	if (!hasUserRestriction && !hasRoleRestriction) return true;
	const userOk = hasUserRestriction ? resolveDiscordUserAllowed({
		allowList: params.userAllowList,
		userId: params.userId,
		userName: params.userName,
		userTag: params.userTag,
		allowNameMatching: params.allowNameMatching
	}) : false;
	const roleOk = hasRoleRestriction ? resolveDiscordRoleAllowed({
		allowList: params.roleAllowList,
		memberRoleIds: params.memberRoleIds
	}) : false;
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
		candidate: {
			id: params.sender.id,
			name: params.sender.name,
			tag: params.sender.tag
		},
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
	const allowList = normalizeDiscordAllowList(params.allowFrom, [
		"discord:",
		"user:",
		"pk:"
	]);
	if (!allowList) return true;
	return allowListMatches(allowList, {
		id: params.author.id,
		name: params.author.username,
		tag: formatDiscordUserTag(params.author)
	}, { allowNameMatching: params.allowNameMatching });
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
	const bySlug = entries[slug];
	if (bySlug) return {
		...bySlug,
		id: guildId ?? guild.id,
		slug: slug || bySlug.slug
	};
	const wildcard = entries["*"];
	if (wildcard) return {
		...wildcard,
		id: guildId ?? guild.id,
		slug: slug || wildcard.slug
	};
	return null;
}
function buildDiscordChannelKeys(params) {
	const allowNameMatch = params.allowNameMatch !== false;
	return buildChannelKeyCandidates(params.id, allowNameMatch ? params.slug : void 0, allowNameMatch ? params.name : void 0);
}
function resolveDiscordChannelEntryMatch(channels, params, parentParams) {
	const keys = buildDiscordChannelKeys(params);
	const parentKeys = parentParams ? buildDiscordChannelKeys(parentParams) : void 0;
	return resolveChannelEntryMatchWithFallback({
		entries: channels,
		keys,
		parentKeys,
		wildcardKey: "*"
	});
}
function hasConfiguredDiscordChannels(channels) {
	return Boolean(channels && Object.keys(channels).length > 0);
}
function resolveDiscordChannelConfigEntry(entry) {
	return {
		allowed: entry.enabled !== false,
		requireMention: entry.requireMention,
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
	const { guildInfo, channelId, channelName, channelSlug } = params;
	const channels = guildInfo?.channels;
	if (!hasConfiguredDiscordChannels(channels)) return null;
	const match = resolveDiscordChannelEntryMatch(channels, {
		id: channelId,
		name: channelName,
		slug: channelSlug
	});
	return resolveChannelMatchConfig(match, resolveDiscordChannelConfigEntry) ?? { allowed: false };
}
function resolveDiscordChannelConfigWithFallback(params) {
	const { guildInfo, channelId, channelName, channelSlug, parentId, parentName, parentSlug, scope } = params;
	const channels = guildInfo?.channels;
	if (!hasConfiguredDiscordChannels(channels)) return null;
	const resolvedParentSlug = parentSlug ?? (parentName ? normalizeDiscordSlug(parentName) : "");
	const match = resolveDiscordChannelEntryMatch(channels, {
		id: channelId,
		name: channelName,
		slug: channelSlug,
		allowNameMatch: scope !== "thread"
	}, parentId || parentName || parentSlug ? {
		id: parentId ?? "",
		name: parentName,
		slug: resolvedParentSlug
	} : void 0);
	return resolveChannelMatchConfig(match, resolveDiscordChannelConfigEntry) ?? { allowed: false };
}
function resolveDiscordShouldRequireMention(params) {
	if (!params.isGuildMessage) return false;
	if (params.isAutoThreadOwnedByBot ?? isDiscordAutoThreadOwnedByBot(params)) return false;
	return params.channelConfig?.requireMention ?? params.guildInfo?.requireMention ?? true;
}
function isDiscordAutoThreadOwnedByBot(params) {
	if (!params.isThread) return false;
	if (!params.channelConfig?.autoThread) return false;
	const botId = params.botId?.trim();
	const threadOwnerId = params.threadOwnerId?.trim();
	return Boolean(botId && threadOwnerId && botId === threadOwnerId);
}
function isDiscordGroupAllowedByPolicy(params) {
	if (params.groupPolicy === "allowlist" && !params.guildAllowlisted) return false;
	if (params.groupPolicy === "disabled") return false;
	return params.groupPolicy !== "allowlist" || !params.channelAllowlistConfigured || params.channelAllowed;
}
function resolveDiscordChannelPolicyCommandAuthorizer(params) {
	const channelAllowlistConfigured = Boolean(params.guildInfo?.channels) && Object.keys(params.guildInfo?.channels ?? {}).length > 0;
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
	const accessGuildInfo = params.guildInfo ?? (params.allowlist ? { users: params.allowlist } : null);
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig: params.channelConfig,
		guildInfo: accessGuildInfo,
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
//#endregion
//#region extensions/discord/src/channel-type.ts
function isDiscordThreadChannelType(channelType) {
	return channelType === ChannelType.AnnouncementThread || channelType === ChannelType.PublicThread || channelType === ChannelType.PrivateThread;
}
//#endregion
export { resolveTimestampMs as C, resolveDiscordEndpointAttachmentGuard as D, getDiscordEndpointRuntime as E, resolveDiscordEndpointMediaGuard as O, resolveDiscordSystemLocation as S, assertDiscordEndpointGatewayUrl as T, resolveDiscordShouldRequireMention as _, normalizeDiscordDisplaySlug as a, formatDiscordReactionEmoji as b, resolveDiscordChannelConfig as c, resolveDiscordCommandAuthorized as d, resolveDiscordGuildEntry as f, resolveDiscordOwnerAllowFrom as g, resolveDiscordOwnerAccess as h, normalizeDiscordAllowList as i, resolveDiscordChannelConfigWithFallback as l, resolveDiscordMemberAllowed as m, allowListMatches as n, normalizeDiscordSlug as o, resolveDiscordMemberAccessState as p, isDiscordGroupAllowedByPolicy as r, resolveDiscordAllowListMatch as s, isDiscordThreadChannelType as t, resolveDiscordChannelPolicyCommandAuthorizer as u, resolveGroupDmAllow as v, parseDiscordRetryAfterBodySeconds as w, formatDiscordUserTag as x, shouldEmitDiscordReactionNotification as y };
