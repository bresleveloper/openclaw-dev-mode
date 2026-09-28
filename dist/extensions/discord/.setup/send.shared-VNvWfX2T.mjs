import { A as serializePayload, At as getGuild, g as RequestClient, ht as getThreadMember, j as Embed, jt as getGuildMember, k as hasDiscordV2Components, nt as createUserDmChannel, pt as getChannel, rt as getCurrentUser, st as createChannelMessage } from "./discord-BXpHW-cu.mjs";
import { t as isDiscordThreadChannelType } from "./channel-type-DKnjV1XW.mjs";
import { c as resolveDiscordAccount, m as normalizeDiscordToken, o as mergeDiscordAccountConfig } from "./accounts-CwJQoLjM.mjs";
import { f as resolveDiscordReplyMessageId, o as chunkDiscordTextWithMode, r as createDiscordRetryRunner } from "./retry-BEYkDy0P.mjs";
import { t as parseAndResolveDiscordTarget } from "./target-resolver-BXpy6VT8.mjs";
import { ChannelType, MessageFlags, PermissionFlagsBits } from "discord-api-types/v10";
import { randomBytes } from "node:crypto";
import { makeProxyFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveTextChunksWithFallback } from "openclaw/plugin-sdk/reply-payload";
import { danger } from "openclaw/plugin-sdk/runtime-env";
import { PollLayoutType } from "discord-api-types/payloads/v10";
import { buildOutboundMediaLoadOptions, extensionForMime, normalizePollDurationHours, normalizePollInput } from "openclaw/plugin-sdk/media-runtime";
import { loadWebMedia } from "openclaw/plugin-sdk/web-media";
//#region extensions/discord/src/recipient-resolution.ts
async function parseAndResolveRecipient(raw, cfg, accountId, parseOptions = {}) {
	if (!cfg) throw new Error("Discord recipient resolution requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const resolvedCfg = requireRuntimeConfig(cfg, "Discord recipient resolution");
	const accountInfo = resolveDiscordAccount({
		cfg: resolvedCfg,
		accountId
	});
	const resolved = await parseAndResolveDiscordTarget(raw, {
		cfg: resolvedCfg,
		accountId: accountInfo.accountId
	}, parseOptions);
	return {
		kind: resolved.kind,
		id: resolved.id
	};
}
async function parseAndResolveChannelRecipient(raw, cfg, accountId) {
	const resolvedCfg = requireRuntimeConfig(cfg, "Discord recipient resolution");
	const resolved = await parseAndResolveDiscordTarget(raw, {
		cfg: resolvedCfg,
		accountId
	}, { defaultKind: "channel" });
	return {
		kind: resolved.kind,
		id: resolved.id
	};
}
//#endregion
//#region extensions/discord/src/monitor/gateway-registry.ts
/**
* Module-level registry of active Discord GatewayPlugin instances.
* Bridges the gap between agent tool handlers (which only have REST access)
* and the gateway WebSocket (needed for operations like updatePresence).
* Follows the same pattern as presence-cache.ts.
*/
const gatewayRegistry = /* @__PURE__ */ new Map();
const DEFAULT_ACCOUNT_KEY = "\0__default__";
function resolveAccountKey(accountId) {
	return accountId ?? DEFAULT_ACCOUNT_KEY;
}
/** Register a GatewayPlugin instance for an account. */
function registerGateway(accountId, gateway) {
	gatewayRegistry.set(resolveAccountKey(accountId), gateway);
}
/** Unregister a GatewayPlugin instance for an account. */
function unregisterGateway(accountId) {
	gatewayRegistry.delete(resolveAccountKey(accountId));
}
/** Get the GatewayPlugin for an account. Returns undefined if not registered. */
function getGateway(accountId) {
	return gatewayRegistry.get(resolveAccountKey(accountId));
}
/** Clear all registered gateways (for testing). */
function clearGateways() {
	gatewayRegistry.clear();
}
//#endregion
//#region extensions/discord/src/proxy-fetch.ts
function resolveDiscordProxyUrl(account, cfg) {
	const accountProxy = normalizeOptionalString(account.config.proxy);
	if (accountProxy) return accountProxy;
	return normalizeOptionalString(cfg?.channels?.discord?.proxy);
}
function resolveDiscordProxyFetchByUrl(proxyUrl, runtime) {
	return withValidatedDiscordProxy(proxyUrl, runtime, (proxy) => makeProxyFetch(proxy));
}
function resolveDiscordProxyFetchForAccount(account, cfg, runtime) {
	return resolveDiscordProxyFetchByUrl(resolveDiscordProxyUrl(account, cfg), runtime);
}
function withValidatedDiscordProxy(proxyUrl, runtime, createValue) {
	const proxy = proxyUrl?.trim();
	if (!proxy) return;
	try {
		validateDiscordProxyUrl(proxy);
		return createValue(proxy);
	} catch (err) {
		runtime?.error?.(danger(`discord: invalid rest proxy: ${String(err)}`));
		return;
	}
}
function validateDiscordProxyUrl(proxyUrl) {
	let parsed;
	try {
		parsed = new URL(proxyUrl);
	} catch {
		throw new Error("Proxy URL must be a valid http or https URL");
	}
	if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Proxy URL must use http or https");
	if (!parsed.hostname) throw new Error("Proxy URL must include a host");
	return proxyUrl;
}
//#endregion
//#region extensions/discord/src/proxy-request-client.ts
const DISCORD_REST_TIMEOUT_MS = 15e3;
function createDiscordRequestClient(token, options) {
	if (!options?.fetch) return new RequestClient(token, options);
	return new RequestClient(token, {
		runtimeProfile: "persistent",
		maxQueueSize: 1e3,
		timeout: DISCORD_REST_TIMEOUT_MS,
		...options,
		fetch: options.fetch
	});
}
//#endregion
//#region extensions/discord/src/client.ts
function createDiscordRuntimeAccountContext(params) {
	return {
		cfg: params.cfg,
		accountId: normalizeAccountId(params.accountId)
	};
}
function resolveDiscordClientAccountContext(opts, runtime) {
	const resolvedCfg = requireRuntimeConfig(opts.cfg, "Discord client");
	const account = resolveAccountWithoutToken({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	return {
		cfg: resolvedCfg,
		account,
		proxyFetch: resolveDiscordProxyFetchForAccount(account, resolvedCfg, runtime)
	};
}
function resolveToken(params) {
	const fallback = normalizeDiscordToken(params.fallbackToken, "channels.discord.token");
	if (!fallback) {
		if (params.account.tokenStatus === "configured_unavailable") throw new Error(`Discord bot token configured for account "${params.accountId}" is unavailable; resolve SecretRefs against the active runtime snapshot before using this account.`);
		throw new Error(`Discord bot token missing for account "${params.accountId}" (set discord.accounts.${params.accountId}.token or DISCORD_BOT_TOKEN for default).`);
	}
	return fallback;
}
function resolveRest(token, account, cfg, rest, proxyFetch, signal, timeoutMs) {
	if (rest) return rest;
	const resolvedProxyFetch = proxyFetch ?? resolveDiscordProxyFetchForAccount(account, cfg);
	return createDiscordRequestClient(token, {
		...resolvedProxyFetch ? { fetch: resolvedProxyFetch } : {},
		...signal ? { signal } : {},
		...timeoutMs !== void 0 ? { timeout: timeoutMs } : {}
	});
}
function resolveAccountWithoutToken(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = mergeDiscordAccountConfig(params.cfg, accountId);
	const baseEnabled = params.cfg.channels?.discord?.enabled !== false;
	const accountEnabled = merged.enabled !== false;
	return {
		accountId,
		enabled: baseEnabled && accountEnabled,
		name: normalizeOptionalString(merged.name),
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		config: merged
	};
}
function createDiscordRestClient(opts) {
	const explicitToken = normalizeDiscordToken(opts.token, "channels.discord.token");
	const proxyContext = resolveDiscordClientAccountContext(opts);
	const resolvedCfg = proxyContext.cfg;
	const account = explicitToken ? proxyContext.account : resolveDiscordAccount({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	const token = explicitToken ?? resolveToken({
		account,
		accountId: account.accountId,
		fallbackToken: account.token
	});
	return {
		token,
		rest: resolveRest(token, account, resolvedCfg, opts.rest, proxyContext.proxyFetch, opts.signal, opts.timeoutMs),
		account
	};
}
function createDiscordClient(opts) {
	const { token, rest, account: restAccount } = createDiscordRestClient(opts);
	const account = normalizeDiscordToken(opts.token, "channels.discord.token") ? resolveDiscordAccount({
		cfg: opts.cfg,
		accountId: opts.accountId
	}) : restAccount;
	return {
		token,
		rest,
		request: createDiscordRetryRunner({
			retry: opts.retry,
			verbose: opts.verbose,
			isGatewayDisconnected: () => {
				const gateway = getGateway(restAccount.accountId);
				return gateway !== void 0 && !gateway.isConnected;
			}
		}),
		account
	};
}
function resolveDiscordRest(opts) {
	return createDiscordRestClient(opts).rest;
}
//#endregion
//#region extensions/discord/src/send.message-request.ts
const SUPPRESS_EMBEDS_FLAG = MessageFlags.SuppressEmbeds;
const SUPPRESS_NOTIFICATIONS_FLAG = MessageFlags.SuppressNotifications;
function createDiscordMessageNonce() {
	return randomBytes(12).toString("hex");
}
function resolveDiscordSendComponents(params) {
	if (!params.components || !params.isFirst) return;
	return typeof params.components === "function" ? params.components(params.text) : params.components;
}
function normalizeDiscordEmbeds(embeds) {
	if (!embeds?.length) return;
	return embeds.map((embed) => embed instanceof Embed ? embed : new Embed(embed));
}
function resolveDiscordSendEmbeds(params) {
	if (!params.embeds || !params.isFirst) return;
	return normalizeDiscordEmbeds(params.embeds);
}
function buildDiscordMessagePayload(params) {
	const payload = {};
	const hasV2 = hasDiscordV2Components(params.components);
	const trimmed = params.text.trim();
	if (!hasV2 && trimmed) payload.content = params.text;
	if (params.components?.length) payload.components = params.components;
	if (!hasV2 && params.embeds?.length) payload.embeds = params.embeds;
	if (params.allowedMentions) payload.allowed_mentions = params.allowedMentions;
	if (params.flags !== void 0) payload.flags = params.flags;
	if (params.files?.length) payload.files = params.files;
	return payload;
}
function resolveDiscordMessageFlags(params) {
	let flags = 0;
	if (params.suppressEmbeds) flags |= SUPPRESS_EMBEDS_FLAG;
	if (params.silent) flags |= SUPPRESS_NOTIFICATIONS_FLAG;
	return flags || void 0;
}
function resolveDiscordSuppressEmbeds(params) {
	return params.override ?? params.configured ?? true;
}
function buildDiscordMessageRequest(params) {
	const payload = buildDiscordMessagePayload(params);
	const nonce = params.endpoint === "create-message" ? params.nonce ?? createDiscordMessageNonce() : void 0;
	return {
		...serializePayload(payload),
		...params.replyTo ? { message_reference: {
			message_id: params.replyTo,
			fail_if_not_exists: false
		} } : {},
		...nonce !== void 0 ? { nonce } : {},
		...nonce ? { enforce_nonce: true } : {}
	};
}
//#endregion
//#region extensions/discord/src/send.permissions.ts
const PERMISSION_ENTRIES = Object.entries(PermissionFlagsBits).filter(([, value]) => typeof value === "bigint");
const ALL_PERMISSIONS = PERMISSION_ENTRIES.reduce((acc, [, value]) => acc | value, 0n);
const ADMINISTRATOR_BIT = PermissionFlagsBits.Administrator;
function addPermissionBits(base, add) {
	if (!add) return base;
	return base | BigInt(add);
}
function removePermissionBits(base, deny) {
	if (!deny) return base;
	return base & ~BigInt(deny);
}
function bitfieldToPermissions(bitfield) {
	return PERMISSION_ENTRIES.filter(([, value]) => (bitfield & value) === value).map(([name]) => name).toSorted();
}
function hasAdministrator(bitfield) {
	return (bitfield & ADMINISTRATOR_BIT) === ADMINISTRATOR_BIT;
}
function hasPermissionBit(bitfield, permission) {
	return (bitfield & permission) === permission;
}
async function fetchBotUserId(rest) {
	const me = await getCurrentUser(rest);
	if (!me?.id) throw new Error("Failed to resolve bot user id");
	return me.id;
}
function resolveMemberGuildPermissionBits(params) {
	const rolesByIdLocal = new Map((params.guild.roles ?? []).map((role) => [role.id, role]));
	const everyoneRole = rolesByIdLocal.get(params.guild.id);
	let permissions = 0n;
	if (everyoneRole?.permissions) permissions = addPermissionBits(permissions, everyoneRole.permissions);
	for (const roleId of params.member.roles ?? []) {
		const role = rolesByIdLocal.get(roleId);
		if (role?.permissions) permissions = addPermissionBits(permissions, role.permissions);
	}
	return permissions;
}
function rolesById(guild) {
	return new Map((guild.roles ?? []).map((role) => [role.id, role]));
}
function rolePosition(role) {
	return typeof role?.position === "number" ? role.position : -1;
}
function highestMemberRolePosition(guild, member) {
	const roles = rolesById(guild);
	return Math.max(...(member.roles ?? []).map((roleId) => rolePosition(roles.get(roleId))), 0);
}
function resolveMemberChannelPermissionBits(params) {
	let permissions = resolveMemberGuildPermissionBits({
		guild: params.guild,
		member: params.member
	});
	if (hasAdministrator(permissions)) return ALL_PERMISSIONS;
	const overwrites = "permission_overwrites" in params.channel ? params.channel.permission_overwrites ?? [] : [];
	for (const overwrite of overwrites) if (overwrite.id === params.guildId) {
		permissions = removePermissionBits(permissions, overwrite.deny ?? "0");
		permissions = addPermissionBits(permissions, overwrite.allow ?? "0");
	}
	let roleDeny = 0n;
	let roleAllow = 0n;
	for (const overwrite of overwrites) if (params.member.roles?.includes(overwrite.id)) {
		roleDeny = addPermissionBits(roleDeny, overwrite.deny ?? "0");
		roleAllow = addPermissionBits(roleAllow, overwrite.allow ?? "0");
	}
	permissions = permissions & ~roleDeny;
	permissions = permissions | roleAllow;
	for (const overwrite of overwrites) if (overwrite.id === params.userId) {
		permissions = removePermissionBits(permissions, overwrite.deny ?? "0");
		permissions = addPermissionBits(permissions, overwrite.allow ?? "0");
	}
	return permissions;
}
async function resolveChannelPermissionSubject(rest, channel) {
	const channelType = "type" in channel ? channel.type : void 0;
	const parentId = "parent_id" in channel ? channel.parent_id : void 0;
	if (isDiscordThreadChannelType(channelType) && parentId) return await getChannel(rest, parentId);
	return channel;
}
/**
* Fetch guild-level permissions for a user. This does not include channel-specific overwrites.
*/
async function fetchMemberGuildPermissionsDiscord(guildId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return ALL_PERMISSIONS;
		return resolveMemberGuildPermissionBits({
			guild,
			member
		});
	} catch {
		return null;
	}
}
async function canViewDiscordGuildChannel(guildId, channelId, userId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const channel = await getChannel(rest, channelId);
		const permissionChannel = await resolveChannelPermissionSubject(rest, channel);
		if (("guild_id" in permissionChannel ? permissionChannel.guild_id : void 0) !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		const permissions = resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		});
		if (!hasPermissionBit(permissions, PermissionFlagsBits.ViewChannel)) return false;
		if ("type" in channel && channel.type === ChannelType.PrivateThread) {
			if (hasPermissionBit(permissions, PermissionFlagsBits.ManageThreads)) return true;
			await getThreadMember(rest, channel.id, userId);
		}
		return true;
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit
* after applying channel/category overwrites.
*/
async function hasAnyChannelPermissionDiscord(guildId, channelId, userId, requiredPermissions, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const permissionChannel = await resolveChannelPermissionSubject(rest, await getChannel(rest, channelId));
		if (("guild_id" in permissionChannel ? permissionChannel.guild_id : void 0) !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		const permissions = resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		});
		return requiredPermissions.some((permission) => hasPermissionBit(permissions, permission));
	} catch {
		return false;
	}
}
async function canManageGuildMemberRoleDiscord(guildId, senderUserId, targetUserId, roleId, opts, requirements) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember, targetMember] = await Promise.all([
			getGuild(rest, guildId),
			getGuildMember(rest, guildId, senderUserId),
			getGuildMember(rest, guildId, targetUserId)
		]);
		if (guild.owner_id === senderUserId) return true;
		if (guild.owner_id === targetUserId) return false;
		const targetRole = rolesById(guild).get(roleId);
		const targetRolePosition = rolePosition(targetRole);
		if (targetRolePosition < 0) return false;
		const senderPermissions = resolveMemberGuildPermissionBits({
			guild,
			member: senderMember
		});
		if (requirements?.assignablePermissionCeiling && !hasAdministrator(senderPermissions) && (BigInt(targetRole?.permissions ?? "0") & ~senderPermissions) !== 0n) return false;
		const senderHighestRolePosition = highestMemberRolePosition(guild, senderMember);
		if (senderHighestRolePosition <= targetRolePosition) return false;
		return senderHighestRolePosition > highestMemberRolePosition(guild, targetMember);
	} catch {
		return false;
	}
}
async function canManageGuildRoleDiscord(guildId, senderUserId, roleId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, senderUserId)]);
		const targetRole = rolesById(guild).get(roleId);
		if (!targetRole) return null;
		if (guild.owner_id === senderUserId) return true;
		return highestMemberRolePosition(guild, senderMember) > rolePosition(targetRole);
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or required permission bits
* matching the provided predicate.
*/
async function hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, check, opts) {
	const permissions = await fetchMemberGuildPermissionsDiscord(guildId, userId, opts);
	if (permissions === null) return false;
	if (hasAdministrator(permissions)) return true;
	return check(permissions, requiredPermissions);
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit.
*/
async function hasAnyGuildPermissionDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, (permissions, required) => required.some((permission) => hasPermissionBit(permissions, permission)), opts);
}
/**
* Returns true when the user has ADMINISTRATOR or all required permission bits.
*/
async function hasAllGuildPermissionsDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, (permissions, required) => required.every((permission) => hasPermissionBit(permissions, permission)), opts);
}
async function fetchChannelPermissionsDiscord(channelId, opts) {
	opts.signal?.throwIfAborted();
	const rest = resolveDiscordRest(opts);
	const channel = await getChannel(rest, channelId);
	opts.signal?.throwIfAborted();
	const channelType = "type" in channel ? channel.type : void 0;
	const permissionChannel = await resolveChannelPermissionSubject(rest, channel);
	opts.signal?.throwIfAborted();
	const guildId = "guild_id" in permissionChannel ? permissionChannel.guild_id : void 0;
	if (!guildId) return {
		channelId,
		permissions: [],
		raw: "0",
		isDm: true,
		channelType
	};
	const botId = await fetchBotUserId(rest);
	opts.signal?.throwIfAborted();
	const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, botId)]);
	opts.signal?.throwIfAborted();
	const permissions = resolveMemberChannelPermissionBits({
		guildId,
		userId: botId,
		guild,
		member,
		channel: permissionChannel
	});
	return {
		channelId,
		guildId,
		permissions: bitfieldToPermissions(permissions),
		raw: permissions.toString(),
		isDm: false,
		channelType
	};
}
//#endregion
//#region extensions/discord/src/send.types.ts
var DiscordSendError = class extends Error {
	constructor(message, opts) {
		super(message);
		this.name = "DiscordSendError";
		if (opts) Object.assign(this, opts);
	}
	toString() {
		return this.message;
	}
};
const DISCORD_MAX_EMOJI_BYTES = 262144;
const DISCORD_MAX_STICKER_BYTES = 524288;
const DISCORD_MAX_EVENT_COVER_BYTES = 8388608;
//#endregion
//#region extensions/discord/src/send.shared.ts
const DISCORD_TEXT_LIMIT = 2e3;
const DISCORD_MAX_STICKERS = 3;
const DISCORD_POLL_MAX_ANSWERS = 10;
const DISCORD_POLL_MAX_DURATION_HOURS = 768;
const DISCORD_MISSING_PERMISSIONS = 50013;
const DISCORD_CANNOT_DM = 50007;
const DISCORD_UPLOAD_TOO_LARGE = 40005;
const DISCORD_UPLOAD_TOO_LARGE_STATUS = 413;
const DISCORD_UPLOAD_TOO_LARGE_NOTICE = "Attachment skipped: Discord rejected the file as too large.";
function resolveRequiredDiscordSendPermissions(channelType) {
	return isDiscordThreadChannelType(channelType) ? ["ViewChannel", "SendMessagesInThreads"] : ["ViewChannel", "SendMessages"];
}
function normalizeReactionEmoji(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("emoji required");
	const customMatch = trimmed.match(/^<a?:([^:>]+):(\d+)>$/);
	const identifier = customMatch ? `${customMatch[1]}:${customMatch[2]}` : trimmed.replace(/[\uFE0E\uFE0F]/g, "");
	return encodeURIComponent(identifier);
}
function normalizeStickerIds(raw) {
	const ids = normalizeStringEntries(raw);
	if (ids.length === 0) throw new Error("At least one sticker id is required");
	if (ids.length > DISCORD_MAX_STICKERS) throw new Error("Discord supports up to 3 stickers per message");
	return ids;
}
function normalizeEmojiName(raw, label) {
	const name = raw.trim();
	if (!name) throw new Error(`${label} is required`);
	return name;
}
function normalizeDiscordPollInput(input) {
	const poll = normalizePollInput(input, { maxOptions: DISCORD_POLL_MAX_ANSWERS });
	const duration = normalizePollDurationHours(poll.durationHours, {
		defaultHours: 24,
		maxHours: DISCORD_POLL_MAX_DURATION_HOURS
	});
	return {
		question: { text: poll.question },
		answers: poll.options.map((answer) => ({ poll_media: { text: answer } })),
		duration,
		allow_multiselect: poll.maxSelections > 1,
		layout_type: PollLayoutType.Default
	};
}
function getDiscordErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "code" in err && err.code !== void 0 ? err.code : "rawError" in err && err.rawError && typeof err.rawError === "object" ? err.rawError.code : void 0;
	if (typeof candidate === "number") return candidate;
	if (typeof candidate === "string" && /^\d+$/.test(candidate)) return Number(candidate);
}
function getDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	const candidate = "status" in err && err.status !== void 0 ? err.status : "statusCode" in err && err.statusCode !== void 0 ? err.statusCode : void 0;
	if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
	if (typeof candidate === "string" && /^\d+$/.test(candidate)) return Number(candidate);
}
function isDiscordUploadTooLargeError(err) {
	return getDiscordErrorCode(err) === DISCORD_UPLOAD_TOO_LARGE || getDiscordErrorStatus(err) === DISCORD_UPLOAD_TOO_LARGE_STATUS;
}
function buildDiscordUploadTooLargeFallbackText(text) {
	return text.trim() ? `${text}\n\n[${DISCORD_UPLOAD_TOO_LARGE_NOTICE}]` : DISCORD_UPLOAD_TOO_LARGE_NOTICE;
}
async function buildDiscordSendError(err, ctx) {
	if (err instanceof DiscordSendError) return err;
	const code = getDiscordErrorCode(err);
	if (code === DISCORD_CANNOT_DM) return new DiscordSendError(`discord dm failed: user blocks dms or privacy settings disallow it (code=${code})`, {
		kind: "dm-blocked",
		discordCode: code,
		status: getDiscordErrorStatus(err)
	});
	if (code !== DISCORD_MISSING_PERMISSIONS) return err;
	let missing = [];
	let probedChannelType;
	try {
		const permissions = await fetchChannelPermissionsDiscord(ctx.channelId, {
			rest: ctx.rest,
			token: ctx.token,
			cfg: ctx.cfg
		});
		probedChannelType = permissions.channelType;
		const current = new Set(permissions.permissions);
		const required = resolveRequiredDiscordSendPermissions(probedChannelType);
		if (ctx.hasMedia) required.push("AttachFiles");
		missing = required.filter((permission) => !current.has(permission));
	} catch {}
	const status = getDiscordErrorStatus(err);
	const apiDetails = [`code=${code}`, status != null ? `status=${status}` : void 0].filter(Boolean).join(" ");
	const probedPermissions = resolveRequiredDiscordSendPermissions(probedChannelType);
	if (ctx.hasMedia) probedPermissions.push("AttachFiles");
	const probeSummary = probedPermissions.join("/");
	return new DiscordSendError(`${missing.length ? `discord missing permissions in channel ${ctx.channelId}: ${missing.join(", ")}` : `discord missing permissions in channel ${ctx.channelId}; permission probe did not identify missing ${probeSummary}`} (${apiDetails}). bot might be blocked by channel/thread overrides, archived thread state, reply target visibility, or app-role position`, {
		kind: "missing-permissions",
		channelId: ctx.channelId,
		missingPermissions: missing,
		discordCode: code,
		status
	});
}
async function resolveChannelId(rest, recipient, request) {
	if (recipient.kind === "channel") return { channelId: recipient.id };
	const dmChannel = await request(() => createUserDmChannel(rest, recipient.id), "dm-channel");
	if (!dmChannel?.id) throw new Error("Failed to create Discord DM channel");
	return {
		channelId: dmChannel.id,
		dm: true
	};
}
async function resolveDiscordTargetChannelId(raw, opts) {
	const recipient = await parseAndResolveRecipient(raw, requireRuntimeConfig(opts.cfg, "Discord target channel resolution"), opts.accountId, { defaultKind: "channel" });
	const { rest, request } = createDiscordClient(opts);
	return await resolveChannelId(rest, recipient, request);
}
async function resolveDiscordChannel(rest, channelId) {
	try {
		return await getChannel(rest, channelId);
	} catch {
		return;
	}
}
function buildDiscordTextChunks(text, opts = {}) {
	if (!text) return [];
	const chunks = chunkDiscordTextWithMode(text, {
		maxChars: opts.maxChars ?? DISCORD_TEXT_LIMIT,
		maxLines: opts.maxLinesPerMessage,
		chunkMode: opts.chunkMode
	});
	return resolveTextChunksWithFallback(text, chunks);
}
async function sendDiscordChunks(params, upload) {
	const chunks = buildDiscordTextChunks(params.text, params);
	if (!chunks.length) chunks.push("");
	const platformMessageIds = [];
	let primary;
	for (const [index, chunk] of chunks.entries()) {
		const isFirst = index === 0;
		if (upload && !isFirst && !chunk.trim()) continue;
		const files = isFirst ? upload?.files : void 0;
		const components = resolveDiscordSendComponents({
			...params,
			text: chunk,
			isFirst
		});
		const embeds = resolveDiscordSendEmbeds({
			...params,
			isFirst
		});
		if (!chunk.trim() && !components?.length && !embeds?.length && !files?.length) throw new Error("Message must be non-empty for Discord sends");
		const replyToId = resolveDiscordReplyMessageId(params.reply, isFirst);
		const kind = files ? "media" : components?.length || embeds?.length ? "card" : "text";
		const body = buildDiscordMessageRequest({
			endpoint: "create-message",
			text: chunk,
			components,
			embeds,
			files,
			allowedMentions: params.allowedMentions,
			flags: resolveDiscordMessageFlags({
				silent: params.silent,
				suppressEmbeds: params.suppressEmbeds && !embeds?.length
			}),
			replyTo: replyToId
		});
		let result;
		try {
			result = await params.request(async () => {
				await params.onPlatformSendDispatch?.();
				params.assertPlatformSendAuthorized?.();
				return createChannelMessage(params.rest, params.channelId, { body });
			}, files ? "media" : "text", { safety: "nonce-protected-create" });
		} catch (error) {
			if (files && upload) return upload.onRejected(error);
			throw error;
		}
		await params.onResult?.(result, kind, replyToId);
		if (result.id) platformMessageIds.push(result.id);
		primary = upload ? primary ?? result : result;
	}
	if (!primary) throw new Error("Discord send failed (empty chunk result)");
	return {
		...primary,
		platformMessageIds
	};
}
async function sendDiscordText(params) {
	return sendDiscordChunks(params);
}
async function sendDiscordMedia(params) {
	const media = await loadWebMedia(params.mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes: params.maxBytes,
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile
	}));
	const resolvedFileName = params.filename?.trim() || media.fileName || (media.contentType ? `upload${extensionForMime(media.contentType) ?? ""}` : "") || "upload";
	return sendDiscordChunks(params, {
		files: [{
			data: media.buffer,
			name: resolvedFileName,
			contentType: media.contentType
		}],
		onRejected(error) {
			if (!isDiscordUploadTooLargeError(error)) throw error;
			return sendDiscordText({
				...params,
				text: buildDiscordUploadTooLargeFallbackText(params.text),
				components: void 0,
				embeds: void 0
			});
		}
	});
}
function buildReactionIdentifier(emoji) {
	if (emoji.id && emoji.name) return `${emoji.name}:${emoji.id}`;
	return emoji.name ?? "";
}
function formatReactionEmoji(emoji) {
	return buildReactionIdentifier(emoji);
}
//#endregion
export { resolveDiscordSendComponents as A, validateDiscordProxyUrl as B, hasAllGuildPermissionsDiscord as C, buildDiscordMessageRequest as D, SUPPRESS_NOTIFICATIONS_FLAG as E, createDiscordRuntimeAccountContext as F, unregisterGateway as G, clearGateways as H, resolveDiscordClientAccountContext as I, parseAndResolveChannelRecipient as K, resolveDiscordRest as L, resolveDiscordSuppressEmbeds as M, createDiscordClient as N, createDiscordMessageNonce as O, createDiscordRestClient as P, DISCORD_REST_TIMEOUT_MS as R, fetchMemberGuildPermissionsDiscord as S, hasAnyGuildPermissionDiscord as T, getGateway as U, withValidatedDiscordProxy as V, registerGateway as W, DiscordSendError as _, normalizeDiscordPollInput as a, canViewDiscordGuildChannel as b, normalizeStickerIds as c, resolveDiscordTargetChannelId as d, sendDiscordMedia as f, DISCORD_MAX_STICKER_BYTES as g, DISCORD_MAX_EVENT_COVER_BYTES as h, formatReactionEmoji as i, resolveDiscordSendEmbeds as j, resolveDiscordMessageFlags as k, resolveChannelId as l, DISCORD_MAX_EMOJI_BYTES as m, buildDiscordTextChunks as n, normalizeEmojiName as o, sendDiscordText as p, buildReactionIdentifier as r, normalizeReactionEmoji as s, buildDiscordSendError as t, resolveDiscordChannel as u, canManageGuildMemberRoleDiscord as v, hasAnyChannelPermissionDiscord as w, fetchChannelPermissionsDiscord as x, canManageGuildRoleDiscord as y, resolveDiscordProxyFetchForAccount as z };
