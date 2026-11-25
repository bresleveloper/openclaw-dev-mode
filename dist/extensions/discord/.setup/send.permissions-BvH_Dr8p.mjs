import { h as normalizeDiscordToken, l as resolveDiscordAccount, s as mergeDiscordAccountConfig } from "./accounts-DtjvhJUj.mjs";
import { A as getThreadMember, N as getGuild, O as getChannel, P as getGuildMember, R as RequestClient, b as getCurrentUser } from "./discord-cXPUdHQi.mjs";
import { w as isDiscordThreadChannelType } from "./allow-list-CkqpzPvP.mjs";
import { y as createDiscordRetryRunner } from "./send.receipt-CZ7ks6g7.mjs";
import { t as resolveDiscordProxyFetchForAccount } from "./proxy-fetch-B8cK6FLQ.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
// extensions/discord/src/monitor/gateway-registry.ts
/**
* Module-level registry of active Discord GatewayPlugin instances.
* Bridges the gap between agent tool handlers (which only have REST access)
* and the gateway WebSocket (needed for operations like updatePresence).
* Follows the same pattern as presence-cache.ts.
*/
const gatewayRegistry = /* @__PURE__ */ new Map();
const DEFAULT_ACCOUNT_KEY = "\0__default__";
function registerGateway(accountId, gateway) {
	gatewayRegistry.set(accountId ?? DEFAULT_ACCOUNT_KEY, gateway);
}
function unregisterGateway(accountId) {
	gatewayRegistry.delete(accountId ?? DEFAULT_ACCOUNT_KEY);
}
function getGateway(accountId) {
	return gatewayRegistry.get(accountId ?? DEFAULT_ACCOUNT_KEY);
}
function clearGateways() {
	gatewayRegistry.clear();
}
// extensions/discord/src/client.ts
function createDiscordRuntimeAccountContext(params) {
	return {
		cfg: params.cfg,
		accountId: normalizeAccountId(params.accountId)
	};
}
function resolveDiscordClientAccountContext(opts) {
	const resolvedCfg = requireRuntimeConfig(opts.cfg, "Discord client");
	const accountId = normalizeAccountId(opts.accountId);
	const config = mergeDiscordAccountConfig(resolvedCfg, accountId);
	const account = {
		accountId,
		enabled: resolvedCfg.channels?.discord?.enabled !== false && config.enabled !== false,
		name: normalizeOptionalString(config.name),
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		config
	};
	return {
		cfg: resolvedCfg,
		account,
		proxyFetch: resolveDiscordProxyFetchForAccount(account, resolvedCfg)
	};
}
function resolveToken(account) {
	const fallback = normalizeDiscordToken(account.token, "channels.discord.token");
	if (!fallback) {
		if (account.tokenStatus === "configured_unavailable") throw new Error(`Discord bot token configured for account "${account.accountId}" is unavailable; resolve SecretRefs against the active runtime snapshot before using this account.`);
		throw new Error(`Discord bot token missing for account "${account.accountId}" (set discord.accounts.${account.accountId}.token or DISCORD_BOT_TOKEN for default).`);
	}
	return fallback;
}
function createDiscordRestClient(opts) {
	const explicitToken = normalizeDiscordToken(opts.token, "channels.discord.token");
	const proxyContext = resolveDiscordClientAccountContext(opts);
	const resolvedCfg = proxyContext.cfg;
	const account = explicitToken ? proxyContext.account : resolveDiscordAccount({
		cfg: resolvedCfg,
		accountId: opts.accountId
	});
	const token = explicitToken ?? resolveToken(account);
	const { rest, signal, callerSignal, timeoutMs } = opts;
	if (rest) return {
		token,
		rest,
		account
	};
	const proxyFetch = proxyContext.proxyFetch ?? resolveDiscordProxyFetchForAccount(account, resolvedCfg);
	return {
		token,
		rest: new RequestClient(token, {
			...proxyFetch ? { fetch: proxyFetch } : {},
			...signal ? { signal } : {},
			...callerSignal ? { callerSignal } : {},
			...timeoutMs !== void 0 ? { timeout: timeoutMs } : {}
		}),
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
			signal: opts.signal && opts.callerSignal ? AbortSignal.any([opts.signal, opts.callerSignal]) : opts.callerSignal ?? opts.signal,
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
// extensions/discord/src/send.permissions.ts
const PERMISSION_ENTRIES = Object.entries(PermissionFlagsBits).filter(([, value]) => typeof value === "bigint");
const ALL_PERMISSIONS = PERMISSION_ENTRIES.reduce((acc, [, value]) => acc | value, 0n);
const ADMINISTRATOR_BIT = PermissionFlagsBits.Administrator;
function addPermissionBits(base, add) {
	return base | BigInt(add || "0");
}
function removePermissionBits(base, deny) {
	return base & ~BigInt(deny || "0");
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
	let permissions = addPermissionBits(0n, params.roles.get(params.guildId)?.permissions);
	for (const roleId of params.member.roles ?? []) permissions = addPermissionBits(permissions, params.roles.get(roleId)?.permissions);
	return permissions;
}
function rolesById(guild) {
	return new Map((guild.roles ?? []).map((role) => [role.id, role]));
}
function rolePosition(role) {
	return typeof role?.position === "number" ? role.position : -1;
}
function highestMemberRolePosition(roles, member) {
	return Math.max(...(member.roles ?? []).map((roleId) => rolePosition(roles.get(roleId))), 0);
}
function resolveMemberChannelPermissionBits(params) {
	let permissions = resolveMemberGuildPermissionBits({
		guildId: params.guildId,
		roles: rolesById(params.guild),
		member: params.member
	});
	if (hasAdministrator(permissions)) return ALL_PERMISSIONS;
	const overwrites = "permission_overwrites" in params.channel ? params.channel.permission_overwrites ?? [] : [];
	for (const overwrite of overwrites) if (overwrite.id === params.guildId) {
		permissions = removePermissionBits(permissions, overwrite.deny);
		permissions = addPermissionBits(permissions, overwrite.allow);
	}
	let roleDeny = 0n;
	let roleAllow = 0n;
	for (const overwrite of overwrites) if (params.member.roles?.includes(overwrite.id)) {
		roleDeny = addPermissionBits(roleDeny, overwrite.deny);
		roleAllow = addPermissionBits(roleAllow, overwrite.allow);
	}
	permissions = permissions & ~roleDeny | roleAllow;
	for (const overwrite of overwrites) if (overwrite.id === params.userId) {
		permissions = removePermissionBits(permissions, overwrite.deny);
		permissions = addPermissionBits(permissions, overwrite.allow);
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
			guildId,
			roles: rolesById(guild),
			member
		});
	} catch {
		return null;
	}
}
async function checkMemberChannelPermissions(guildId, channelId, userId, opts, check) {
	const rest = resolveDiscordRest(opts);
	try {
		const channel = await getChannel(rest, channelId);
		const permissionChannel = await resolveChannelPermissionSubject(rest, channel);
		if (!("guild_id" in permissionChannel) || permissionChannel.guild_id !== guildId) return false;
		const [guild, member] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, userId)]);
		if (guild.owner_id === userId) return true;
		return await check(resolveMemberChannelPermissionBits({
			guildId,
			userId,
			guild,
			member,
			channel: permissionChannel
		}), channel, rest);
	} catch {
		return false;
	}
}
async function canViewChannel(permissions, channel, rest, userId) {
	if (!hasPermissionBit(permissions, PermissionFlagsBits.ViewChannel)) return false;
	if (channel.type === ChannelType.PrivateThread) {
		if (!hasPermissionBit(permissions, PermissionFlagsBits.ManageThreads)) try {
			await getThreadMember(rest, channel.id, userId);
		} catch {
			return false;
		}
	}
	return true;
}
async function canViewDiscordGuildChannel(guildId, channelId, userId, opts) {
	return checkMemberChannelPermissions(guildId, channelId, userId, opts, (permissions, channel, rest) => canViewChannel(permissions, channel, rest, userId));
}
/** Fresh facts for one fork qualification; callers must not retain them for creation. */
async function fetchThreadForkPermissionsDiscord(guildId, source, parent, userId, opts) {
	opts.signal?.throwIfAborted();
	const rest = resolveDiscordRest(opts);
	const [guild, requester, botId] = await Promise.all([
		getGuild(rest, guildId),
		getGuildMember(rest, guildId, userId),
		fetchBotUserId(rest)
	]);
	opts.signal?.throwIfAborted();
	const bot = await getGuildMember(rest, guildId, botId);
	opts.signal?.throwIfAborted();
	const requesterPermissions = guild.owner_id === userId ? ALL_PERMISSIONS : resolveMemberChannelPermissionBits({
		guildId,
		userId,
		guild,
		member: requester,
		channel: parent
	});
	const requesterCanRead = hasPermissionBit(requesterPermissions, PermissionFlagsBits.ReadMessageHistory) && await canViewChannel(requesterPermissions, source, rest, userId);
	opts.signal?.throwIfAborted();
	return {
		requesterCanRead,
		botPermissions: bitfieldToPermissions(resolveMemberChannelPermissionBits({
			guildId,
			userId: botId,
			guild,
			member: bot,
			channel: parent
		}))
	};
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit
* after applying channel/category overwrites.
*/
async function hasAnyChannelPermissionDiscord(guildId, channelId, userId, requiredPermissions, opts) {
	return checkMemberChannelPermissions(guildId, channelId, userId, opts, (permissions) => requiredPermissions.some((permission) => hasPermissionBit(permissions, permission)));
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
		const roles = rolesById(guild);
		const targetRole = roles.get(roleId);
		const targetRolePosition = rolePosition(targetRole);
		if (targetRolePosition < 0) return false;
		const senderPermissions = resolveMemberGuildPermissionBits({
			guildId,
			roles,
			member: senderMember
		});
		if (requirements?.assignablePermissionCeiling && !hasAdministrator(senderPermissions) && (BigInt(targetRole?.permissions ?? "0") & ~senderPermissions) !== 0n) return false;
		const senderHighestRolePosition = highestMemberRolePosition(roles, senderMember);
		if (senderHighestRolePosition <= targetRolePosition) return false;
		return senderHighestRolePosition > highestMemberRolePosition(roles, targetMember);
	} catch {
		return false;
	}
}
async function canManageGuildRoleDiscord(guildId, senderUserId, roleId, opts) {
	const rest = resolveDiscordRest(opts);
	try {
		const [guild, senderMember] = await Promise.all([getGuild(rest, guildId), getGuildMember(rest, guildId, senderUserId)]);
		const roles = rolesById(guild);
		const targetRole = roles.get(roleId);
		if (!targetRole) return null;
		if (guild.owner_id === senderUserId) return true;
		return highestMemberRolePosition(roles, senderMember) > rolePosition(targetRole);
	} catch {
		return false;
	}
}
/**
* Returns true when the user has ADMINISTRATOR or the required permission bits.
*/
async function hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, match, opts) {
	const permissions = await fetchMemberGuildPermissionsDiscord(guildId, userId, opts);
	return permissions !== null && (hasAdministrator(permissions) || requiredPermissions[match]((permission) => hasPermissionBit(permissions, permission)));
}
/**
* Returns true when the user has ADMINISTRATOR or any required permission bit.
*/
async function hasAnyGuildPermissionDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, "some", opts);
}
/**
* Returns true when the user has ADMINISTRATOR or all required permission bits.
*/
async function hasAllGuildPermissionsDiscord(guildId, userId, requiredPermissions, opts) {
	return await hasGuildPermissionsDiscord(guildId, userId, requiredPermissions, "every", opts);
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
export { registerGateway as _, fetchMemberGuildPermissionsDiscord as a, hasAnyChannelPermissionDiscord as c, createDiscordRestClient as d, createDiscordRuntimeAccountContext as f, getGateway as g, clearGateways as h, fetchChannelPermissionsDiscord as i, hasAnyGuildPermissionDiscord as l, resolveDiscordRest as m, canManageGuildRoleDiscord as n, fetchThreadForkPermissionsDiscord as o, resolveDiscordClientAccountContext as p, canViewDiscordGuildChannel as r, hasAllGuildPermissionsDiscord as s, canManageGuildMemberRoleDiscord as t, createDiscordClient as u, unregisterGateway as v };
