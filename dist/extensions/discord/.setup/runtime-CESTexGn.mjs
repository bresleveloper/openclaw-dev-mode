import { o as mergeDiscordAccountConfig, s as resolveDefaultDiscordAccountId, t as createDiscordActionGate } from "./accounts-HE9-mj1L.mjs";
import { A as isDiscordThreadChannelType, l as resolveDiscordChannelConfigWithFallback, n as hasConfiguredDiscordChannels, o as normalizeDiscordSlug, r as isDiscordGroupAllowedByPolicy, y as resolveGroupDmAllow } from "./allow-list-vxkG9_JD.mjs";
import { C as hasAnyChannelPermissionDiscord, F as createDiscordRuntimeAccountContext, U as getGateway, _ as canManageGuildMemberRoleDiscord, b as fetchChannelPermissionsDiscord, n as buildDiscordTextChunks, u as resolveDiscordTargetChannelId, v as canManageGuildRoleDiscord, w as hasAnyGuildPermissionDiscord, y as canViewDiscordGuildChannel } from "./send.shared-C4CN24D9.mjs";
import { n as getPresence } from "./presence-cache-Dg3_dADn.mjs";
import { a as createReusableDiscordReplyReference, m as resolveDiscordChannelId, p as parseDiscordTarget, s as resolveDiscordReplyReference } from "./send.receipt-DVOg2Oaw.mjs";
import { A as listScheduledEventsDiscord, B as moveChannelDiscord, C as fetchChannelInfoDiscord, D as fetchVoiceStatusDiscord, E as fetchRoleInfoDiscord, F as uploadEmojiDiscord, H as setChannelPermissionDiscord, I as uploadStickerDiscord, L as createChannelDiscord, M as resolveEventCoverImage, N as timeoutMemberDiscord, O as kickMemberDiscord, P as listGuildEmojisDiscord, R as deleteChannelDiscord, S as createScheduledEventDiscord, T as fetchMemberInfoDiscord, V as removeChannelPermissionDiscord, _ as readMessagesDiscord, a as removeReactionDiscord, b as addRoleDiscord, d as deleteMessageDiscord, f as editMessageDiscord, g as pinMessageDiscord, h as listThreadsDiscord, i as removeOwnReactionsDiscord, j as removeRoleDiscord, k as listGuildChannelsDiscord, l as DiscordThreadInitialMessageError, m as listPinsDiscord, n as fetchReactionsDiscord, p as fetchMessageDiscord, r as reactMessageDiscord, s as sendVoiceMessageDiscord, u as createThreadDiscord, v as searchMessagesDiscord, w as fetchGuildInfoDiscord, x as banMemberDiscord, y as unpinMessageDiscord, z as editChannelDiscord } from "./send-CJk3VP5q.mjs";
import { r as sendStickerDiscord, t as sendMessageDiscord } from "./send.outbound-rOboMO_6.mjs";
import "./targets-bqXQENmX.mjs";
import { h as readDiscordComponentSpec, m as coerceDiscordComponentParam } from "./components-DLJR0xU-.mjs";
import { r as sendDiscordComponentMessage } from "./send.components-dPljuV24.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asBoolean, asOptionalRecord, isRecord, normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { assertMediaNotDataUrl, jsonResult, parseAvailableTags, readNonNegativeIntegerParam, readPositiveIntegerParam, readReactionParams, readStringArrayParam, readStringParam, withNormalizedTimestamp } from "openclaw/plugin-sdk/channel-actions";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import { createChannelProgressDraftCompositor } from "openclaw/plugin-sdk/channel-outbound";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
//#region extensions/discord/src/actions/runtime.messaging.thread-list.ts
function readDiscordChannelStringField(value, ...keys) {
	if (!value || typeof value !== "object") return;
	const record = value;
	for (const key of keys) {
		const candidate = record[key];
		if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
	}
}
function readDiscordChannelType(value) {
	if (!value || typeof value !== "object") return;
	const type = value.type;
	return typeof type === "number" ? type : void 0;
}
function isDiscordThreadChannel(value) {
	return isDiscordThreadChannelType(readDiscordChannelType(value));
}
function filterDiscordActiveThreadList(params) {
	const response = asOptionalRecord(params.value);
	if (!Array.isArray(response?.threads) || !Array.isArray(response.members)) throw new Error("Unexpected Discord response for active thread list.");
	const { guildId, channelId, parent } = params;
	const parentAncestor = {
		channelId,
		channelSlug: parent.channelSlug,
		...parent.channelName ? { channelName: parent.channelName } : {}
	};
	const threads = [];
	const threadIds = /* @__PURE__ */ new Set();
	for (const thread of response.threads) {
		const id = readDiscordChannelStringField(thread, "id");
		const parentId = readDiscordChannelStringField(thread, "parent_id");
		const threadGuildId = readDiscordChannelStringField(thread, "guild_id");
		const channelType = readDiscordChannelType(thread);
		if (!id || parentId !== channelId || threadGuildId !== guildId || !isDiscordThreadChannelType(channelType)) continue;
		const channelName = readDiscordChannelStringField(thread, "name");
		const target = {
			channelId: id,
			channelSlug: channelName ? normalizeDiscordSlug(channelName) : id,
			guildId,
			metadataKnown: true,
			ancestryComplete: parent.ancestryComplete,
			ancestors: [parentAncestor, ...parent.ancestors],
			channelType,
			scope: "thread",
			parentId: channelId,
			parentSlug: parent.channelSlug,
			...channelName ? { channelName } : {},
			...parent.channelName ? { parentName: parent.channelName } : {}
		};
		if (!params.isAllowed(target)) continue;
		threads.push(thread);
		threadIds.add(id);
	}
	return {
		threads,
		members: response.members.filter((member) => {
			const id = readDiscordChannelStringField(member, "id");
			return id !== void 0 && threadIds.has(id);
		})
	};
}
//#endregion
//#region extensions/discord/src/actions/runtime.shared.ts
/** Discord REST auto_archive_duration allowlist (minutes). */
const DISCORD_AUTO_ARCHIVE_MINUTES = /* @__PURE__ */ new Set([
	60,
	1440,
	4320,
	10080
]);
function readDiscordParentIdParam(params) {
	if (params.clearParent === true || params.parentId === null) return null;
	return readStringParam(params, "parentId");
}
/**
* Reads Discord auto-archive duration minutes and rejects values Discord will
* not accept, so thread/channel edits fail closed before the REST call.
*/
function readDiscordAutoArchiveDurationParam(params, key) {
	const value = readPositiveIntegerParam(params, key);
	if (value === void 0) return;
	if (!DISCORD_AUTO_ARCHIVE_MINUTES.has(value)) throw new Error(`${key} must be one of 60, 1440, 4320, or 10080 minutes`);
	return value;
}
function createDiscordActionOptions(params) {
	return {
		cfg: params.cfg,
		...params.accountId ? { accountId: params.accountId } : {},
		...params.extra ?? {}
	};
}
function readDiscordChannelCreateParams(params) {
	const parentId = readDiscordParentIdParam(params);
	return {
		guildId: readStringParam(params, "guildId", { required: true }),
		name: readStringParam(params, "name", { required: true }),
		type: readNonNegativeIntegerParam(params, "channelType") ?? readNonNegativeIntegerParam(params, "type"),
		parentId: parentId ?? void 0,
		topic: readStringParam(params, "topic"),
		position: readNonNegativeIntegerParam(params, "position"),
		nsfw: asBoolean(params.nsfw)
	};
}
function readDiscordChannelEditParams(params) {
	const parentId = readDiscordParentIdParam(params);
	return {
		channelId: readStringParam(params, "channelId", { required: true }),
		name: readStringParam(params, "name"),
		topic: readStringParam(params, "topic"),
		position: readNonNegativeIntegerParam(params, "position"),
		parentId,
		nsfw: asBoolean(params.nsfw),
		rateLimitPerUser: readNonNegativeIntegerParam(params, "rateLimitPerUser"),
		archived: asBoolean(params.archived),
		locked: asBoolean(params.locked),
		autoArchiveDuration: readDiscordAutoArchiveDurationParam(params, "autoArchiveDuration"),
		availableTags: parseAvailableTags(params.availableTags)
	};
}
function readDiscordChannelMoveParams(params) {
	const parentId = readDiscordParentIdParam(params);
	return {
		guildId: readStringParam(params, "guildId", { required: true }),
		channelId: readStringParam(params, "channelId", { required: true }),
		parentId,
		position: readNonNegativeIntegerParam(params, "position")
	};
}
//#endregion
//#region extensions/discord/src/actions/runtime.messaging.shared.ts
function allowsAllDiscordGuildChannels(channels) {
	const wildcard = channels?.["*"];
	if (!wildcard || wildcard.enabled === false) return false;
	return Object.values(channels ?? {}).every((entry) => entry?.enabled !== false);
}
function resolveDiscordActionGuildEntry(params) {
	const guildId = params.guildId?.trim();
	if (!params.guilds) return null;
	if (guildId && params.guilds[guildId]) return {
		...params.guilds[guildId],
		id: guildId
	};
	if (guildId) {
		const byConfiguredId = Object.values(params.guilds).find((guild) => guild?.id === guildId);
		if (byConfiguredId) return {
			...byConfiguredId,
			id: guildId
		};
	}
	const guildSlug = params.guildName ? normalizeDiscordSlug(params.guildName) : "";
	if (guildSlug) {
		const bySlug = params.guilds[guildSlug] ?? Object.values(params.guilds).find((guild) => guild?.slug === guildSlug);
		if (bySlug) return {
			...bySlug,
			id: guildId,
			slug: guildSlug || bySlug.slug
		};
	}
	if (params.includeWildcard === false) return null;
	const wildcard = params.guilds["*"];
	return wildcard ? {
		...wildcard,
		id: guildId
	} : null;
}
async function resolveDiscordReadAncestry(params) {
	const ancestors = [];
	const visited = /* @__PURE__ */ new Set([params.channelId]);
	let parentId = params.parentId;
	for (let depth = 0; parentId && depth < 2; depth++) {
		if (visited.has(parentId)) return {
			ancestors,
			complete: false
		};
		visited.add(parentId);
		const parent = await params.loadChannel(parentId);
		if (!parent) {
			ancestors.push({
				channelId: parentId,
				channelSlug: normalizeDiscordSlug(parentId) || parentId
			});
			return {
				ancestors,
				complete: false
			};
		}
		const parentName = readDiscordChannelStringField(parent, "name");
		ancestors.push({
			channelId: parentId,
			...parentName ? { channelName: parentName } : {},
			channelSlug: parentName ? normalizeDiscordSlug(parentName) : parentId
		});
		parentId = readDiscordChannelStringField(parent, "parent_id", "parentId");
	}
	return {
		ancestors,
		complete: !parentId
	};
}
async function buildDiscordReadTarget(params) {
	const channelName = readDiscordChannelStringField(params.channelInfo, "name");
	const channelType = readDiscordChannelType(params.channelInfo);
	const target = {
		channelId: params.channelId,
		channelSlug: channelName ? normalizeDiscordSlug(channelName) : params.fallbackSlug,
		metadataKnown: true,
		ancestryComplete: true,
		ancestors: [],
		...params.guildId ? { guildId: params.guildId } : {},
		...channelName ? { channelName } : {},
		...channelType !== void 0 ? { channelType } : {},
		...isDiscordThreadChannel(params.channelInfo) ? { scope: "thread" } : {}
	};
	const ancestry = await resolveDiscordReadAncestry({
		channelId: params.channelId,
		parentId: readDiscordChannelStringField(params.channelInfo, "parent_id", "parentId"),
		loadChannel: params.loadChannel
	});
	target.ancestors = ancestry.ancestors;
	target.ancestryComplete = ancestry.complete;
	const immediateParent = target.ancestors[0];
	if (immediateParent) {
		target.parentId = immediateParent.channelId;
		if (immediateParent.channelName) target.parentName = immediateParent.channelName;
		target.parentSlug = immediateParent.channelSlug;
	}
	return target;
}
function isDiscordReadAncestryAllowed(params) {
	for (const ancestor of params.target.ancestors) {
		const config = resolveDiscordChannelConfigWithFallback({
			guildInfo: params.guildInfo,
			channelId: ancestor.channelId,
			channelName: ancestor.channelName,
			channelSlug: ancestor.channelSlug
		});
		if (config?.matchSource === "direct" && !config.allowed) return false;
	}
	return params.target.ancestryComplete || !hasExplicitlyDisabledDiscordChannels(params.guildInfo?.channels);
}
function isDiscordReadTargetAllowedInGuild(params) {
	if (!params.target.metadataKnown) {
		if (hasExplicitlyDisabledDiscordChannels(params.guildInfo?.channels)) return false;
		return isDiscordReadTargetExplicitlyAllowedById(params);
	}
	if (!isDiscordReadAncestryAllowed(params)) return false;
	if (resolveDiscordChannelConfigWithFallback({
		...params.target,
		guildInfo: params.guildInfo
	})?.allowed === false) return false;
	return isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(params.guildInfo),
		channelAllowlistConfigured: hasConfiguredDiscordChannels(params.guildInfo?.channels),
		channelAllowed: true
	});
}
function isDiscordReadTargetExplicitlyAllowedById(params) {
	const channelEntry = params.guildInfo?.channels?.[params.target.channelId];
	if (!channelEntry || channelEntry.enabled === false) return false;
	return isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(params.guildInfo),
		channelAllowlistConfigured: true,
		channelAllowed: true
	});
}
function hasExplicitlyDisabledDiscordChannelConfig(guilds) {
	return Object.values(guilds ?? {}).some((guild) => hasExplicitlyDisabledDiscordChannels(guild?.channels));
}
function hasExplicitlyDisabledDiscordChannels(channels) {
	return Object.values(channels ?? {}).some((channel) => channel.enabled === false);
}
function createDiscordMessagingActionContext(params) {
	const accountId = readStringParam(params.input, "accountId");
	const cfgOptions = { cfg: params.cfg };
	const accountConfig = mergeDiscordAccountConfig(params.cfg, accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const guilds = accountConfig.guilds;
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.discord !== void 0,
		groupPolicy: accountConfig.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	const directOperator = params.options?.conversationReadOrigin === "direct-operator";
	const currentReadContext = params.options?.readContext;
	const directDmEnabled = accountConfig.dm?.enabled !== false && (accountConfig.dmPolicy ?? "pairing") !== "disabled";
	const withOpts = (extra) => createDiscordActionOptions({
		cfg: params.cfg,
		accountId,
		extra
	});
	const resolvedReactionAccountId = accountId ?? resolveDefaultDiscordAccountId(params.cfg);
	const isCurrentReadTarget = (channelId) => {
		const requesterAccountId = currentReadContext?.requesterAccountId?.trim();
		const currentChannelId = currentReadContext?.currentChannelId?.trim();
		if (currentReadContext?.currentChannelProvider?.trim().toLowerCase() !== "discord" || !requesterAccountId || !currentChannelId || normalizeAccountId(requesterAccountId) !== normalizeAccountId(resolvedReactionAccountId)) return false;
		try {
			return resolveDiscordChannelId(currentChannelId) === channelId;
		} catch {
			return false;
		}
	};
	const reactionRuntimeOptions = resolvedReactionAccountId ? createDiscordRuntimeAccountContext({
		cfg: params.cfg,
		accountId: resolvedReactionAccountId
	}) : cfgOptions;
	const guildNameById = /* @__PURE__ */ new Map();
	const resolveGuildName = async (guildId) => {
		if (guildNameById.has(guildId)) return guildNameById.get(guildId) ?? null;
		try {
			const guildName = readDiscordChannelStringField(await fetchGuildInfoDiscord(guildId, withOpts()), "name") ?? null;
			guildNameById.set(guildId, guildName);
			return guildName;
		} catch {
			guildNameById.set(guildId, null);
			return null;
		}
	};
	const resolveReadGuildEntry = async (guildId) => {
		const direct = resolveDiscordActionGuildEntry({
			guilds,
			guildId,
			includeWildcard: false
		});
		if (direct || !guildId) return direct;
		const guildName = await resolveGuildName(guildId);
		const named = resolveDiscordActionGuildEntry({
			guilds,
			guildId,
			guildName: guildName ?? void 0,
			includeWildcard: false
		});
		if (named) return named;
		return resolveDiscordActionGuildEntry({
			guilds,
			guildId
		});
	};
	const resolveReadTargetContext = async (channelId) => {
		const fallback = {
			channelId,
			channelSlug: normalizeDiscordSlug(channelId) || channelId,
			metadataKnown: false,
			ancestryComplete: false,
			ancestors: []
		};
		let channelInfo;
		try {
			channelInfo = await fetchChannelInfoDiscord(channelId, withOpts());
		} catch {
			return fallback;
		}
		return buildDiscordReadTarget({
			channelId,
			channelInfo,
			guildId: readDiscordChannelStringField(channelInfo, "guild_id", "guildId"),
			fallbackSlug: fallback.channelSlug,
			loadChannel: async (parentId) => {
				try {
					return await fetchChannelInfoDiscord(parentId, withOpts());
				} catch {
					return;
				}
			}
		});
	};
	const isExpandedReadTargetEnabled = (guildInfo, target, currentConversation) => {
		const groupDmEnabled = accountConfig.dm?.groupEnabled === true && (currentConversation || resolveGroupDmAllow({
			channels: accountConfig.dm?.groupChannels,
			channelId: target.channelId,
			channelName: target.channelName,
			channelSlug: target.channelSlug
		}));
		if (!target.metadataKnown) return groupPolicy !== "disabled" && directDmEnabled && groupDmEnabled && !hasExplicitlyDisabledDiscordChannelConfig(guilds);
		if (!target.guildId) {
			if (target.channelType === ChannelType.GroupDM) return groupDmEnabled;
			if (target.channelType === ChannelType.DM) return directDmEnabled;
			return directDmEnabled && groupDmEnabled;
		}
		if (groupPolicy === "disabled") return false;
		if (!isDiscordReadAncestryAllowed({
			guildInfo,
			target
		})) return false;
		const channelConfig = resolveDiscordChannelConfigWithFallback({
			...target,
			guildInfo
		});
		return !channelConfig?.matchSource || channelConfig.allowed;
	};
	return {
		action: params.action,
		params: params.input,
		isActionEnabled: params.isActionEnabled,
		cfg: params.cfg,
		accountConfig,
		options: params.options,
		accountId,
		resolveChannelId: () => resolveDiscordChannelId(readStringParam(params.input, "channelId", { required: true })),
		assertReadTargetAllowed: async ({ guildId, channelId, requireGuildMetadata }) => {
			const targetChannelId = resolveDiscordChannelId(channelId);
			const target = await resolveReadTargetContext(targetChannelId);
			if (requireGuildMetadata && (!guildId || !target.metadataKnown || target.guildId !== guildId)) throw new Error("Discord active thread parent metadata is unavailable.");
			const currentConversation = isCurrentReadTarget(targetChannelId);
			if (guildId && target.metadataKnown && target.guildId !== guildId) throw new Error("Discord read target channel is not allowed.");
			const targetGuildId = guildId || target.guildId;
			if (targetGuildId) {
				const guildInfo = await resolveReadGuildEntry(targetGuildId);
				if (directOperator && isExpandedReadTargetEnabled(guildInfo, target, false) || currentConversation && isExpandedReadTargetEnabled(guildInfo, target, true)) return;
				if (!isDiscordReadTargetAllowedInGuild({
					groupPolicy,
					guildInfo,
					target
				})) throw new Error("Discord read target channel is not allowed.");
				return;
			}
			const allowed = !target.metadataKnown && Object.values(guilds ?? {}).some((guildInfo) => isDiscordReadTargetAllowedInGuild({
				groupPolicy,
				guildInfo: guildInfo ?? null,
				target
			}));
			if (directOperator && isExpandedReadTargetEnabled(null, target, false) || currentConversation && isExpandedReadTargetEnabled(null, target, true)) return;
			if (!allowed) throw new Error("Discord read target channel is not allowed.");
		},
		assertGuildReadTargetAllowed: async ({ guildId, channelTargetRequiredMessage, filteredResults }) => {
			const guildInfo = await resolveReadGuildEntry(guildId);
			if (directOperator && groupPolicy !== "disabled" && (filteredResults === true || !hasExplicitlyDisabledDiscordChannels(guildInfo?.channels))) return;
			if (!isDiscordGroupAllowedByPolicy({
				groupPolicy,
				guildAllowlisted: Boolean(guildInfo),
				channelAllowlistConfigured: false,
				channelAllowed: true
			})) throw new Error("Discord read target channel is not allowed.");
			if (hasConfiguredDiscordChannels(guildInfo?.channels) && !allowsAllDiscordGuildChannels(guildInfo.channels)) throw new Error(channelTargetRequiredMessage ?? "Discord message search requires channelId or channelIds so each read target can be authorized.");
		},
		filterActiveThreadList: async ({ guildId, channelId, value }) => {
			const parent = await resolveReadTargetContext(channelId);
			if (!parent.metadataKnown || parent.guildId !== guildId) throw new Error("Discord active thread parent metadata is unavailable.");
			const guildInfo = await resolveReadGuildEntry(guildId);
			return filterDiscordActiveThreadList({
				value,
				guildId,
				channelId,
				parent,
				isAllowed: (target) => directOperator && isExpandedReadTargetEnabled(guildInfo, target, false) || isCurrentReadTarget(target.channelId) && isExpandedReadTargetEnabled(guildInfo, target, true) || isDiscordReadTargetAllowedInGuild({
					groupPolicy,
					guildInfo,
					target
				})
			});
		},
		filterGuildChannelList: async ({ guildId, channels }) => {
			if (!directOperator) return channels;
			const guildInfo = await resolveReadGuildEntry(guildId);
			const channelById = new Map(channels.flatMap((channel) => {
				const channelId = readDiscordChannelStringField(channel, "id");
				return channelId ? [[channelId, channel]] : [];
			}));
			const visibleChannels = [];
			for (const channel of channels) {
				const channelId = readDiscordChannelStringField(channel, "id");
				if (!channelId) continue;
				const target = await buildDiscordReadTarget({
					channelId,
					channelInfo: channel,
					guildId,
					fallbackSlug: channelId,
					loadChannel: async (parentId) => channelById.get(parentId)
				});
				if (!isDiscordReadAncestryAllowed({
					guildInfo,
					target
				})) continue;
				const channelConfig = resolveDiscordChannelConfigWithFallback({
					...target,
					guildInfo
				});
				if (!channelConfig?.matchSource || channelConfig.allowed) visibleChannels.push(channel);
			}
			return visibleChannels;
		},
		resolveReactionChannelId: async () => {
			const target = readStringParam(params.input, "channelId") ?? readStringParam(params.input, "to", { required: true });
			if (params.action === "reactions" && !directOperator) {
				const reactionTarget = parseDiscordTarget(target, { defaultKind: "channel" });
				if (reactionTarget?.kind === "user" && currentReadContext?.currentChatType === "direct") {
					const currentTarget = parseDiscordTarget(currentReadContext.currentMessagingTarget ?? "", { defaultKind: "channel" });
					if (currentTarget?.kind === "user" && currentTarget.id === reactionTarget.id) {
						const currentChannelId = resolveDiscordChannelId(currentReadContext.currentChannelId ?? "");
						if (isCurrentReadTarget(currentChannelId)) return currentChannelId;
					}
				}
				return resolveDiscordChannelId(target);
			}
			try {
				return resolveDiscordChannelId(target);
			} catch {
				return (await resolveDiscordTargetChannelId(target, {
					cfg: params.cfg,
					accountId: resolvedReactionAccountId
				})).channelId;
			}
		},
		withOpts,
		withReactionRuntimeOptions: (extra) => ({
			...reactionRuntimeOptions ?? cfgOptions,
			...extra
		}),
		normalizeMessage: (message) => {
			if (!message || typeof message !== "object") return message;
			return withNormalizedTimestamp(message, message.timestamp);
		}
	};
}
//#endregion
//#region extensions/discord/src/actions/runtime.guild.ts
const expressionPermissions = [
	PermissionFlagsBits.ManageGuildExpressions,
	PermissionFlagsBits.CreateGuildExpressions,
	PermissionFlagsBits.ManageEmojisAndStickers
];
const channelGuard = {
	gate: "channels",
	disabledMessage: "Discord channel management is disabled.",
	permissions: [PermissionFlagsBits.ManageChannels]
};
const existingChannelGuard = {
	...channelGuard,
	permissionScope: "channel"
};
const channelPermissionGuard = {
	...channelGuard,
	permissions: [PermissionFlagsBits.ManageRoles],
	permissionScope: "channel"
};
const guildAdminActionGuards = {
	emojiUpload: {
		gate: "emojiUploads",
		disabledMessage: "Discord emoji uploads are disabled.",
		permissions: expressionPermissions
	},
	stickerUpload: {
		gate: "stickerUploads",
		disabledMessage: "Discord sticker uploads are disabled.",
		permissions: expressionPermissions
	},
	roleAdd: {
		gate: "roles",
		defaultEnabled: false,
		disabledMessage: "Discord role changes are disabled.",
		permissions: [PermissionFlagsBits.ManageRoles]
	},
	roleRemove: {
		gate: "roles",
		defaultEnabled: false,
		disabledMessage: "Discord role changes are disabled.",
		permissions: [PermissionFlagsBits.ManageRoles]
	},
	eventCreate: {
		gate: "events",
		disabledMessage: "Discord events are disabled.",
		permissions: [PermissionFlagsBits.ManageEvents, PermissionFlagsBits.CreateEvents]
	},
	channelCreate: channelGuard,
	channelEdit: existingChannelGuard,
	channelDelete: existingChannelGuard,
	channelMove: existingChannelGuard,
	categoryCreate: channelGuard,
	categoryEdit: existingChannelGuard,
	categoryDelete: existingChannelGuard,
	channelPermissionSet: channelPermissionGuard,
	channelPermissionRemove: channelPermissionGuard
};
function isLockedThreadChannel(channel) {
	if (!channel || typeof channel !== "object") return false;
	return channel.thread_metadata?.locked === true;
}
function assertGuildAdminActionEnabled(action, isActionEnabled) {
	const guard = guildAdminActionGuards[action];
	if (guard && !isActionEnabled(guard.gate, guard.defaultEnabled)) throw new Error(guard.disabledMessage);
}
async function resolveGuildIdForGuildAdminAction(params) {
	const guildId = readStringParam(params.values, "guildId");
	if (guildId) return guildId;
	const channelLikeId = readStringParam(params.values, "channelId") ?? readStringParam(params.values, "categoryId");
	if (!channelLikeId) return;
	const channel = await fetchChannelInfoDiscord(channelLikeId, createDiscordActionOptions({
		cfg: params.cfg,
		accountId: params.accountId
	}));
	return "guild_id" in channel ? channel.guild_id ?? void 0 : void 0;
}
function readChannelScopedPermissionTargetId(action, values) {
	if (action === "categoryEdit" || action === "categoryDelete") return readStringParam(values, "categoryId");
	return readStringParam(values, "channelId");
}
async function resolveGuildAdminActionPermissions(params) {
	if (params.action !== "channelEdit") return params.guard.permissions;
	const channelId = readStringParam(params.values, "channelId");
	if (!channelId) return params.guard.permissions;
	const channel = await fetchChannelInfoDiscord(channelId, createDiscordActionOptions({
		cfg: params.cfg,
		accountId: params.accountId
	}));
	const channelType = "type" in channel ? channel.type : void 0;
	if (!isDiscordThreadChannelType(channelType)) return params.guard.permissions;
	const edit = readDiscordChannelEditParams(params.values);
	return edit.archived === false && Object.entries(edit).every(([field, value]) => value === void 0 || field === "channelId" || field === "archived") && !isLockedThreadChannel(channel) ? [PermissionFlagsBits.ManageThreads, PermissionFlagsBits.SendMessages] : [PermissionFlagsBits.ManageThreads];
}
async function verifySenderGuildAdminPermission(params) {
	const guard = guildAdminActionGuards[params.action];
	const senderUserId = readStringParam(params.values, "senderUserId");
	if (!guard?.permissions.length || !senderUserId) return;
	const requiredPermissions = await resolveGuildAdminActionPermissions({
		...params,
		guard
	});
	const guildId = await resolveGuildIdForGuildAdminAction(params);
	if (!guildId) throw new Error(`Guild id required to authorize Discord guild action: ${params.action}`);
	const actionOptions = createDiscordActionOptions({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const targetChannelId = guard?.permissionScope === "channel" || params.action === "eventCreate" ? readChannelScopedPermissionTargetId(params.action, params.values) : void 0;
	const hasPermission = targetChannelId ? await hasAnyChannelPermissionDiscord(guildId, targetChannelId, senderUserId, requiredPermissions, actionOptions) : await hasAnyGuildPermissionDiscord(guildId, senderUserId, requiredPermissions, actionOptions);
	const requiresCurrentThreadAccess = params.action === "channelEdit" && requiredPermissions.includes(PermissionFlagsBits.SendMessages);
	if (!hasPermission || requiresCurrentThreadAccess && (!targetChannelId || !await canViewDiscordGuildChannel(guildId, targetChannelId, senderUserId, actionOptions))) throw new Error("Sender does not have required permissions for this guild action.");
	if (params.action === "roleAdd" || params.action === "roleRemove") {
		const targetUserId = readStringParam(params.values, "userId", { required: true });
		const roleId = readStringParam(params.values, "roleId", { required: true });
		if (!await canManageGuildMemberRoleDiscord(guildId, senderUserId, targetUserId, roleId, actionOptions, { assignablePermissionCeiling: params.action === "roleAdd" })) throw new Error("Sender cannot manage the requested role or member.");
	}
	if (params.action === "channelPermissionSet" || params.action === "channelPermissionRemove") {
		const targetType = readStringParam(params.values, "targetType");
		if (targetType === "member") return;
		const targetId = readStringParam(params.values, "targetId", { required: true });
		const canManageRole = await canManageGuildRoleDiscord(guildId, senderUserId, targetId, actionOptions);
		if (canManageRole === false || targetType === "role" && canManageRole === null) throw new Error("Sender cannot manage the requested role overwrite.");
	}
}
function readChannelPermissionTarget(params) {
	return {
		channelId: readStringParam(params, "channelId", { required: true }),
		targetId: readStringParam(params, "targetId", { required: true })
	};
}
async function handleDiscordGuildAction(action, params, isActionEnabled, cfg, options) {
	const accountId = readStringParam(params, "accountId");
	if (!cfg) throw new Error("Discord guild actions require a resolved runtime config.");
	assertGuildAdminActionEnabled(action, isActionEnabled);
	await verifySenderGuildAdminPermission({
		action,
		values: params,
		accountId,
		cfg
	});
	const readTargetGate = createDiscordMessagingActionContext({
		action,
		input: params,
		isActionEnabled,
		cfg,
		options
	});
	const withOpts = (extra) => createDiscordActionOptions({
		cfg,
		accountId,
		extra
	});
	const mediaPolicyOptions = {
		mediaAccess: options?.mediaAccess,
		mediaLocalRoots: options?.mediaLocalRoots,
		mediaReadFile: options?.mediaReadFile
	};
	const assertGuildMetadataReadAllowed = async (guildId, readOptions) => {
		await readTargetGate.assertGuildReadTargetAllowed({
			guildId,
			filteredResults: readOptions?.filteredResults,
			channelTargetRequiredMessage: "Discord guild metadata reads require a wildcard channel allowlist for this guild."
		});
	};
	assertGuildAdminActionEnabled(action, isActionEnabled);
	switch (action) {
		case "memberInfo": {
			if (!isActionEnabled("memberInfo")) throw new Error("Discord member info is disabled.");
			const guildId = readStringParam(params, "guildId", { required: true });
			await assertGuildMetadataReadAllowed(guildId);
			const userId = readStringParam(params, "userId", { required: true });
			const effectiveAccountId = accountId ?? resolveDefaultDiscordAccountId(cfg);
			const member = await fetchMemberInfoDiscord(guildId, userId, createDiscordActionOptions({
				cfg,
				accountId: effectiveAccountId
			}));
			const presence = getPresence(effectiveAccountId, userId);
			const activities = presence?.activities ?? void 0;
			const status = presence?.status ?? void 0;
			return jsonResult({
				ok: true,
				member,
				...presence ? {
					status,
					activities
				} : {}
			});
		}
		case "roleInfo":
		case "eventList": {
			const roleInfo = action === "roleInfo";
			if (!isActionEnabled(roleInfo ? "roleInfo" : "events")) throw new Error(roleInfo ? "Discord role info is disabled." : "Discord events are disabled.");
			const guildId = readStringParam(params, "guildId", { required: true });
			await assertGuildMetadataReadAllowed(guildId);
			const read = roleInfo ? fetchRoleInfoDiscord : listScheduledEventsDiscord;
			return jsonResult({
				ok: true,
				[roleInfo ? "roles" : "events"]: await read(guildId, withOpts())
			});
		}
		case "emojiList": {
			if (!isActionEnabled("reactions")) throw new Error("Discord reactions are disabled.");
			const guildId = await resolveGuildIdForGuildAdminAction({
				values: params,
				accountId,
				cfg
			});
			if (!guildId) throw new Error("Discord emoji listing requires guildId or a server channel.");
			await assertGuildMetadataReadAllowed(guildId);
			const limit = Math.min(readPositiveIntegerParam(params, "limit") ?? 100, 100);
			const fetchEmojis = async () => (await listGuildEmojisDiscord(guildId, withOpts())).flatMap(({ name, id, animated }) => name && id ? [{
				name,
				identifier: `${name}:${id}`,
				...animated ? { animated } : {}
			}] : []).toSorted((left, right) => left.name.localeCompare(right.name) || left.identifier.localeCompare(right.identifier));
			const gateway = getGateway(accountId ?? resolveDefaultDiscordAccountId(cfg));
			const emojis = gateway ? await gateway.fetchGuildEmojis(guildId, fetchEmojis) : await fetchEmojis();
			return jsonResult({
				ok: true,
				emojis: emojis.slice(0, limit)
			});
		}
		case "emojiUpload": {
			const upload = {
				guildId: readStringParam(params, "guildId", { required: true }),
				name: readStringParam(params, "name", { required: true }),
				mediaUrl: readStringParam(params, "mediaUrl", { required: true }),
				roleIds: readStringArrayParam(params, "roleIds")
			};
			const emoji = await uploadEmojiDiscord({
				...upload,
				roleIds: upload.roleIds?.length ? upload.roleIds : void 0
			}, createDiscordActionOptions({
				cfg,
				accountId,
				extra: mediaPolicyOptions
			}));
			return jsonResult({
				ok: true,
				emoji
			});
		}
		case "stickerUpload": {
			const sticker = await uploadStickerDiscord({
				guildId: readStringParam(params, "guildId", { required: true }),
				name: readStringParam(params, "name", { required: true }),
				description: readStringParam(params, "description", { required: true }),
				tags: readStringParam(params, "tags", { required: true }),
				mediaUrl: readStringParam(params, "mediaUrl", { required: true })
			}, createDiscordActionOptions({
				cfg,
				accountId,
				extra: mediaPolicyOptions
			}));
			return jsonResult({
				ok: true,
				sticker
			});
		}
		case "roleAdd":
		case "roleRemove": {
			const guildId = readStringParam(params, "guildId", { required: true });
			const userId = readStringParam(params, "userId", { required: true });
			const roleId = readStringParam(params, "roleId", { required: true });
			await (action === "roleAdd" ? addRoleDiscord : removeRoleDiscord)({
				guildId,
				userId,
				roleId
			}, withOpts());
			return jsonResult({ ok: true });
		}
		case "channelInfo": {
			if (!isActionEnabled("channelInfo")) throw new Error("Discord channel info is disabled.");
			const channelId = readStringParam(params, "channelId", { required: true });
			await readTargetGate.assertReadTargetAllowed({ channelId });
			const channel = await fetchChannelInfoDiscord(channelId, withOpts());
			return jsonResult({
				ok: true,
				channel
			});
		}
		case "channelList": {
			if (!isActionEnabled("channelInfo")) throw new Error("Discord channel info is disabled.");
			const guildId = readStringParam(params, "guildId", { required: true });
			await assertGuildMetadataReadAllowed(guildId, { filteredResults: true });
			const channels = await listGuildChannelsDiscord(guildId, withOpts());
			const visibleChannels = await readTargetGate.filterGuildChannelList({
				guildId,
				channels
			});
			return jsonResult({
				ok: true,
				channels: visibleChannels
			});
		}
		case "voiceStatus": {
			if (!isActionEnabled("voiceStatus")) throw new Error("Discord voice status is disabled.");
			const guildId = readStringParam(params, "guildId", { required: true });
			await assertGuildMetadataReadAllowed(guildId);
			const userId = readStringParam(params, "userId", { required: true });
			const voice = await fetchVoiceStatusDiscord(guildId, userId, withOpts());
			return jsonResult({
				ok: true,
				voice
			});
		}
		case "eventCreate": {
			const guildId = readStringParam(params, "guildId", { required: true });
			const name = readStringParam(params, "name", { required: true });
			const startTime = readStringParam(params, "startTime", { required: true });
			const endTime = readStringParam(params, "endTime");
			const description = readStringParam(params, "description");
			const channelId = readStringParam(params, "channelId");
			const location = readStringParam(params, "location");
			const imageUrl = readStringParam(params, "image", { trim: false });
			const entityTypeRaw = readStringParam(params, "entityType");
			const entityType = entityTypeRaw === "stage" ? 1 : entityTypeRaw === "external" ? 3 : 2;
			const image = imageUrl ? await resolveEventCoverImage(imageUrl, mediaPolicyOptions) : void 0;
			const event = await createScheduledEventDiscord(guildId, {
				name,
				description,
				scheduled_start_time: startTime,
				scheduled_end_time: endTime,
				entity_type: entityType,
				channel_id: channelId,
				entity_metadata: entityType === 3 && location ? { location } : void 0,
				image,
				privacy_level: 2
			}, withOpts());
			return jsonResult({
				ok: true,
				event
			});
		}
		case "categoryCreate":
		case "channelCreate": {
			const channel = await createChannelDiscord(action === "categoryCreate" ? {
				guildId: readStringParam(params, "guildId", { required: true }),
				name: readStringParam(params, "name", { required: true }),
				type: 4,
				position: readNonNegativeIntegerParam(params, "position")
			} : readDiscordChannelCreateParams(params), withOpts());
			return jsonResult({
				ok: true,
				[action === "categoryCreate" ? "category" : "channel"]: channel
			});
		}
		case "categoryEdit":
		case "channelEdit": {
			const channel = await editChannelDiscord(action === "categoryEdit" ? {
				channelId: readStringParam(params, "categoryId", { required: true }),
				name: readStringParam(params, "name"),
				position: readNonNegativeIntegerParam(params, "position")
			} : readDiscordChannelEditParams(params), withOpts());
			return jsonResult({
				ok: true,
				[action === "categoryEdit" ? "category" : "channel"]: channel
			});
		}
		case "categoryDelete":
		case "channelDelete": {
			const channelId = readStringParam(params, action === "categoryDelete" ? "categoryId" : "channelId", { required: true });
			const result = await deleteChannelDiscord(channelId, withOpts());
			return jsonResult(result);
		}
		case "channelMove":
			await moveChannelDiscord(readDiscordChannelMoveParams(params), withOpts());
			return jsonResult({ ok: true });
		case "channelPermissionSet": {
			const { channelId, targetId } = readChannelPermissionTarget(params);
			const targetType = readStringParam(params, "targetType", { required: true }) === "member" ? 1 : 0;
			const allow = readStringParam(params, "allow");
			const deny = readStringParam(params, "deny");
			await setChannelPermissionDiscord({
				channelId,
				targetId,
				targetType,
				allow: allow ?? void 0,
				deny: deny ?? void 0
			}, withOpts());
			return jsonResult({ ok: true });
		}
		case "channelPermissionRemove": {
			const { channelId, targetId } = readChannelPermissionTarget(params);
			await removeChannelPermissionDiscord(channelId, targetId, withOpts());
			return jsonResult({ ok: true });
		}
		default: throw new Error(`Unknown action: ${action}`);
	}
}
//#endregion
//#region extensions/discord/src/actions/runtime.messaging.messages.ts
function parseDiscordMessageLink(link) {
	const match = link.trim().match(/^(?:https?:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)(?:\/?|\?.*)$/i);
	if (!match) throw new Error("Invalid Discord message link. Expected https://discord.com/channels/<guildId>/<channelId>/<messageId>.");
	return {
		guildId: match[1],
		channelId: match[2],
		messageId: match[3]
	};
}
async function handleDiscordMessageManagementAction(ctx) {
	switch (ctx.action) {
		case "permissions": {
			if (!ctx.isActionEnabled("permissions")) throw new Error("Discord permissions are disabled.");
			const channelId = ctx.resolveChannelId();
			await ctx.assertReadTargetAllowed({ channelId });
			const permissions = await fetchChannelPermissionsDiscord(channelId, ctx.withOpts());
			return jsonResult({
				ok: true,
				permissions
			});
		}
		case "fetchMessage": {
			if (!ctx.isActionEnabled("messages")) throw new Error("Discord message reads are disabled.");
			const messageLink = readStringParam(ctx.params, "messageLink");
			let guildId = readStringParam(ctx.params, "guildId");
			let channelId = readStringParam(ctx.params, "channelId");
			let messageId = readStringParam(ctx.params, "messageId");
			if (messageLink) {
				const parsed = parseDiscordMessageLink(messageLink);
				guildId = parsed.guildId;
				channelId = parsed.channelId;
				messageId = parsed.messageId;
			}
			if (!guildId || !channelId || !messageId) throw new Error("Discord message fetch requires guildId, channelId, and messageId (or a valid messageLink).");
			await ctx.assertReadTargetAllowed({
				guildId,
				channelId
			});
			const message = await fetchMessageDiscord(channelId, messageId, ctx.withOpts());
			return jsonResult({
				ok: true,
				message: ctx.normalizeMessage(message),
				guildId,
				channelId,
				messageId
			});
		}
		case "readMessages": {
			if (!ctx.isActionEnabled("messages")) throw new Error("Discord message reads are disabled.");
			const channelId = ctx.resolveChannelId();
			await ctx.assertReadTargetAllowed({ channelId });
			const messageId = readStringParam(ctx.params, "messageId");
			const query = {
				limit: readPositiveIntegerParam(ctx.params, "limit"),
				before: readStringParam(ctx.params, "before"),
				after: readStringParam(ctx.params, "after"),
				around: readStringParam(ctx.params, "around")
			};
			const messages = messageId ? [await fetchMessageDiscord(channelId, messageId, ctx.withOpts())] : await readMessagesDiscord(channelId, query, ctx.withOpts());
			return jsonResult({
				ok: true,
				channelId,
				messages: messages.map((message) => ctx.normalizeMessage(message))
			});
		}
		case "editMessage": {
			if (!ctx.isActionEnabled("messages")) throw new Error("Discord message edits are disabled.");
			const channelId = ctx.resolveChannelId();
			const messageId = readStringParam(ctx.params, "messageId", { required: true });
			const snapshot = ctx.options?.progressSnapshot;
			const content = snapshot ? buildDiscordTextChunks(createChannelProgressDraftCompositor({
				entry: ctx.accountConfig,
				mode: "progress",
				active: true,
				seed: `${ctx.accountId}:${channelId}`,
				initialSnapshot: snapshot
			}).getText(), {
				maxChars: Math.min(ctx.accountConfig.textChunkLimit ?? 2e3, 2e3),
				maxLinesPerMessage: Number.MAX_SAFE_INTEGER
			})[0] ?? "" : readStringParam(ctx.params, "content", {
				required: true,
				allowEmpty: true,
				trim: false
			});
			await ctx.assertReadTargetAllowed({ channelId });
			const message = await editMessageDiscord(channelId, messageId, {
				content,
				...snapshot ? { allowedMentions: { parse: [] } } : {}
			}, ctx.withOpts());
			return jsonResult({
				ok: true,
				message
			});
		}
		case "deleteMessage":
		case "pinMessage":
		case "unpinMessage": {
			const deleting = ctx.action === "deleteMessage";
			if (!ctx.isActionEnabled(deleting ? "messages" : "pins")) throw new Error(deleting ? "Discord message deletes are disabled." : "Discord pins are disabled.");
			const channelId = ctx.resolveChannelId();
			const messageId = readStringParam(ctx.params, "messageId", { required: true });
			await ctx.assertReadTargetAllowed({ channelId });
			await (deleting ? deleteMessageDiscord : ctx.action === "pinMessage" ? pinMessageDiscord : unpinMessageDiscord)(channelId, messageId, ctx.withOpts());
			return jsonResult({ ok: true });
		}
		case "listPins": {
			if (!ctx.isActionEnabled("pins")) throw new Error("Discord pins are disabled.");
			const channelId = ctx.resolveChannelId();
			await ctx.assertReadTargetAllowed({ channelId });
			const pins = await listPinsDiscord(channelId, ctx.withOpts());
			return jsonResult({
				ok: true,
				pins: pins.map((pin) => ctx.normalizeMessage(pin))
			});
		}
		case "searchMessages": {
			if (!ctx.isActionEnabled("search")) throw new Error("Discord search is disabled.");
			let guildId = readStringParam(ctx.params, "guildId");
			const content = readStringParam(ctx.params, "content") ?? readStringParam(ctx.params, "query");
			if (!content) throw new Error("Discord search requires content or query text.");
			const channelId = readStringParam(ctx.params, "channelId");
			const channelIds = readStringArrayParam(ctx.params, "channelIds");
			if (!guildId) {
				const rawInferChannelId = channelId ?? channelIds?.[0];
				if (rawInferChannelId) try {
					const inferChannelId = resolveDiscordChannelId(rawInferChannelId);
					const channelInfo = await fetchChannelInfoDiscord(inferChannelId, ctx.withOpts());
					if (isRecord(channelInfo)) {
						const resolved = channelInfo.guild_id ?? channelInfo.guildId;
						if (typeof resolved === "string" && resolved.trim()) guildId = resolved.trim();
					}
				} catch {}
			}
			if (!guildId) throw new Error("Discord search requires guildId. Provide guildId explicitly, or provide channelId so the guild can be resolved from the channel.");
			const authorId = readStringParam(ctx.params, "authorId");
			const authorIds = readStringArrayParam(ctx.params, "authorIds");
			const limit = readPositiveIntegerParam(ctx.params, "limit");
			const channelIdList = [...(channelIds ?? []).map((id) => resolveDiscordChannelId(id)), ...channelId ? [resolveDiscordChannelId(channelId)] : []];
			if (channelIdList.length > 0) for (const targetChannelId of channelIdList) await ctx.assertReadTargetAllowed({
				guildId,
				channelId: targetChannelId
			});
			else await ctx.assertGuildReadTargetAllowed({ guildId });
			const authorIdList = [...authorIds ?? [], ...authorId ? [authorId] : []];
			const results = await searchMessagesDiscord({
				guildId,
				content,
				channelIds: channelIdList.length ? channelIdList : void 0,
				authorIds: authorIdList.length ? authorIdList : void 0,
				limit
			}, ctx.withOpts());
			const messages = results.messages;
			const normalizedMessages = Array.isArray(messages) ? messages.map((group) => Array.isArray(group) ? group.map((msg) => ctx.normalizeMessage(msg)) : group) : messages;
			return jsonResult({
				ok: true,
				results: {
					...results,
					messages: normalizedMessages
				}
			});
		}
		default: return;
	}
}
//#endregion
//#region extensions/discord/src/actions/runtime.messaging.reactions.ts
async function handleDiscordReactionMessagingAction(ctx) {
	switch (ctx.action) {
		case "react": {
			if (!ctx.isActionEnabled("reactions")) throw new Error("Discord reactions are disabled.");
			const channelId = await ctx.resolveReactionChannelId();
			const messageId = readStringParam(ctx.params, "messageId", { required: true });
			const { emoji, remove, isEmpty } = readReactionParams(ctx.params, { removeErrorMessage: "Emoji is required to remove a Discord reaction." });
			await ctx.assertReadTargetAllowed({ channelId });
			if (isEmpty) {
				const removed = await removeOwnReactionsDiscord(channelId, messageId, ctx.withReactionRuntimeOptions());
				return jsonResult({
					ok: true,
					removed: removed.removed
				});
			}
			await (remove ? removeReactionDiscord : reactMessageDiscord)(channelId, messageId, emoji, ctx.withReactionRuntimeOptions());
			return jsonResult({
				ok: true,
				[remove ? "removed" : "added"]: emoji
			});
		}
		case "reactions": {
			if (!ctx.isActionEnabled("reactions")) throw new Error("Discord reactions are disabled.");
			const channelId = await ctx.resolveReactionChannelId();
			const messageId = readStringParam(ctx.params, "messageId", { required: true });
			const limit = readPositiveIntegerParam(ctx.params, "limit");
			await ctx.assertReadTargetAllowed({ channelId });
			const reactions = await fetchReactionsDiscord(channelId, messageId, ctx.withReactionRuntimeOptions({ limit }));
			return jsonResult({
				ok: true,
				reactions
			});
		}
		default: return;
	}
}
//#endregion
//#region extensions/discord/src/actions/runtime.messaging.send.ts
function resolveActionReplyReference(ctx, replyToId) {
	const reply = ctx.options?.reply;
	return reply ? resolveDiscordReplyReference({
		replyToId: reply.replyToId,
		replyToIdSource: reply.source,
		replyToMode: reply.source === "implicit" ? reply.mode : void 0
	}) : createReusableDiscordReplyReference(replyToId);
}
function readDiscordThreadArchiveTimestamp(thread) {
	const archiveTimestamp = asOptionalRecord(asOptionalRecord(thread)?.thread_metadata)?.archive_timestamp;
	return typeof archiveTimestamp === "string" && archiveTimestamp.trim() ? archiveTimestamp : void 0;
}
function normalizeDiscordThreadListActionResult(params) {
	const record = asOptionalRecord(params.value);
	const threadItems = Array.isArray(record?.threads) ? record.threads : [];
	const hasMore = record?.has_more === true;
	const nextBefore = params.includeArchived && hasMore ? readDiscordThreadArchiveTimestamp(threadItems[threadItems.length - 1]) : void 0;
	return {
		ok: true,
		threads: params.value,
		complete: !hasMore,
		hasMore,
		returnedCount: threadItems.length,
		source: params.includeArchived ? "discord.threadList.archived" : "discord.threadList.active",
		query: {
			guildId: params.guildId,
			...params.channelId ? { channelId: params.channelId } : {},
			includeArchived: params.includeArchived,
			...params.before ? { before: params.before } : {},
			...params.limit !== void 0 ? { limit: params.limit } : {}
		},
		...nextBefore ? { nextBefore } : {}
	};
}
async function appendDiscordThreadRenameResult(ctx, params) {
	const threadName = params.threadName?.trim();
	if (!threadName) return params.payload;
	if (!ctx.isActionEnabled("channels")) return {
		...params.payload,
		warning: "Discord threadName was ignored because Discord channel management is disabled."
	};
	let channelId;
	try {
		channelId = resolveDiscordChannelId(params.target);
	} catch {
		return {
			...params.payload,
			warning: "Discord threadName was ignored because the send target is not a channel/thread."
		};
	}
	try {
		const channel = await fetchChannelInfoDiscord(channelId, ctx.withOpts());
		if (!isDiscordThreadChannelType(channel.type)) return {
			...params.payload,
			warning: "Discord threadName was ignored because the send target is not a thread."
		};
		const renamed = await editChannelDiscord({
			channelId,
			name: threadName
		}, ctx.withOpts());
		return {
			...params.payload,
			threadRename: {
				ok: true,
				channelId,
				name: renamed.name ?? threadName
			}
		};
	} catch (error) {
		return {
			...params.payload,
			warning: `Discord message was sent, but thread rename failed: ${formatErrorMessage(error)}`
		};
	}
}
async function handleDiscordMessageSendAction(ctx) {
	switch (ctx.action) {
		case "sticker": {
			if (!ctx.isActionEnabled("stickers")) throw new Error("Discord stickers are disabled.");
			const to = readStringParam(ctx.params, "to", { required: true });
			const content = readStringParam(ctx.params, "content", { trim: false });
			const stickerIds = readStringArrayParam(ctx.params, "stickerIds", {
				required: true,
				label: "stickerIds"
			});
			const result = await sendStickerDiscord(to, stickerIds, ctx.withOpts({
				content,
				...ctx.params.silent === true ? { silent: true } : {}
			}));
			return jsonResult({
				ok: true,
				result
			});
		}
		case "sendMessage": {
			if (!ctx.isActionEnabled("messages")) throw new Error("Discord message sends are disabled.");
			const to = readStringParam(ctx.params, "to", { required: true });
			const asVoice = ctx.params.asVoice === true;
			const silent = ctx.params.silent === true;
			const suppressEmbeds = ctx.params.suppressEmbeds === void 0 ? void 0 : ctx.params.suppressEmbeds === true;
			const rawComponents = coerceDiscordComponentParam(ctx.params.components);
			const componentRecord = asOptionalRecord(rawComponents);
			const componentSpec = componentRecord && Object.keys(componentRecord).length > 0 ? readDiscordComponentSpec(componentRecord) : null;
			const components = Array.isArray(rawComponents) || typeof rawComponents === "function" ? rawComponents : void 0;
			const mediaUrl = readStringParam(ctx.params, "mediaUrl", { trim: false }) ?? readStringParam(ctx.params, "path", { trim: false }) ?? readStringParam(ctx.params, "filePath", { trim: false });
			const rawEmbeds = ctx.params.embeds;
			const embeds = Array.isArray(rawEmbeds) ? rawEmbeds : void 0;
			const content = readStringParam(ctx.params, "content", {
				required: !asVoice && !componentSpec && !components && !embeds?.length && !mediaUrl,
				allowEmpty: true,
				trim: false
			});
			const filename = readStringParam(ctx.params, "filename");
			const replyTo = readStringParam(ctx.params, "replyTo");
			const threadName = readStringParam(ctx.params, "threadName");
			const sessionKey = readStringParam(ctx.params, "__sessionKey");
			const agentId = readStringParam(ctx.params, "__agentId");
			const sendOptions = {
				...ctx.withOpts(),
				reply: resolveActionReplyReference(ctx, replyTo),
				silent,
				mediaAccess: ctx.options?.mediaAccess,
				mediaLocalRoots: ctx.options?.mediaLocalRoots,
				mediaReadFile: ctx.options?.mediaReadFile
			};
			let result;
			if (componentSpec) {
				if (asVoice) throw new Error("Discord components cannot be sent as voice messages.");
				if (embeds?.length) throw new Error("Discord components cannot include embeds.");
				const normalizedContent = content?.trim() ? content : void 0;
				const payload = componentSpec.text ? componentSpec : {
					...componentSpec,
					text: normalizedContent
				};
				result = await sendDiscordComponentMessage(to, payload, {
					...sendOptions,
					sessionKey,
					agentId,
					mediaUrl,
					filename,
					...suppressEmbeds === void 0 ? {} : { suppressEmbeds }
				});
			} else if (asVoice) {
				if (!mediaUrl) throw new Error("Voice messages require a media file reference (mediaUrl, path, or filePath).");
				if (content && content.trim()) throw new Error("Voice messages cannot include text content (Discord limitation). Remove the content parameter.");
				assertMediaNotDataUrl(mediaUrl);
				result = await sendVoiceMessageDiscord(to, mediaUrl, sendOptions);
			} else result = await sendMessageDiscord(to, content ?? "", {
				...sendOptions,
				mediaUrl,
				filename,
				components,
				embeds,
				...suppressEmbeds === void 0 ? {} : { suppressEmbeds }
			});
			return jsonResult(await appendDiscordThreadRenameResult(ctx, {
				payload: {
					ok: true,
					result,
					...componentSpec ? { components: true } : asVoice ? { voiceMessage: true } : {}
				},
				target: asVoice ? to : result.receipt?.threadId ?? to,
				threadName
			}));
		}
		case "threadCreate": {
			if (!ctx.isActionEnabled("threads")) throw new Error("Discord threads are disabled.");
			const channelId = ctx.resolveChannelId();
			const name = readStringParam(ctx.params, "name", { required: true });
			const messageId = readStringParam(ctx.params, "messageId");
			const content = readStringParam(ctx.params, "content", { trim: false });
			const payload = {
				name,
				messageId,
				autoArchiveMinutes: readDiscordAutoArchiveDurationParam(ctx.params, "autoArchiveMinutes"),
				content,
				appliedTags: readStringArrayParam(ctx.params, "appliedTags") ?? void 0
			};
			try {
				const { initialMessageDelivery, ...thread } = await createThreadDiscord(channelId, payload, ctx.withOpts());
				return jsonResult({
					ok: true,
					thread,
					...initialMessageDelivery ? {
						threadSnapshot: "creation",
						initialMessageDelivery
					} : {}
				});
			} catch (error) {
				if (error instanceof DiscordThreadInitialMessageError) {
					const initialMessageDelivery = error.initialMessageDelivery;
					return jsonResult({
						ok: true,
						partial: true,
						thread: error.thread,
						warning: `${error.initialMessageWarning}.`,
						initialMessageError: error.initialMessageError,
						...initialMessageDelivery ? { initialMessageDelivery } : {}
					});
				}
				throw error;
			}
		}
		case "threadList": {
			if (!ctx.isActionEnabled("threads")) throw new Error("Discord threads are disabled.");
			const guildId = readStringParam(ctx.params, "guildId", { required: true });
			const rawChannelId = readStringParam(ctx.params, "channelId");
			const channelId = rawChannelId ? resolveDiscordChannelId(rawChannelId) : void 0;
			const includeArchived = readBooleanParam(ctx.params, "includeArchived");
			const before = readStringParam(ctx.params, "before");
			const limit = readPositiveIntegerParam(ctx.params, "limit");
			if (channelId) await ctx.assertReadTargetAllowed({
				guildId,
				channelId,
				requireGuildMetadata: includeArchived !== true
			});
			else await ctx.assertGuildReadTargetAllowed({
				guildId,
				channelTargetRequiredMessage: "Discord active thread lists require a wildcard channel allowlist so each read target can be authorized."
			});
			const response = await listThreadsDiscord({
				guildId,
				channelId,
				includeArchived,
				before,
				limit
			}, ctx.withOpts());
			const threads = channelId && includeArchived !== true ? await ctx.filterActiveThreadList({
				guildId,
				channelId,
				value: response
			}) : response;
			return jsonResult(normalizeDiscordThreadListActionResult({
				value: threads,
				guildId,
				channelId,
				includeArchived: includeArchived === true,
				before,
				limit
			}));
		}
		case "threadReply": {
			if (!ctx.isActionEnabled("threads")) throw new Error("Discord threads are disabled.");
			const channelId = ctx.resolveChannelId();
			const content = readStringParam(ctx.params, "content", {
				required: true,
				trim: false
			});
			const mediaUrl = readStringParam(ctx.params, "mediaUrl");
			const replyTo = readStringParam(ctx.params, "replyTo");
			const result = await sendMessageDiscord(`channel:${channelId}`, content, {
				...ctx.withOpts(),
				mediaUrl,
				mediaAccess: ctx.options?.mediaAccess,
				mediaLocalRoots: ctx.options?.mediaLocalRoots,
				mediaReadFile: ctx.options?.mediaReadFile,
				reply: resolveActionReplyReference(ctx, replyTo),
				...ctx.params.silent === true ? { silent: true } : {}
			});
			return jsonResult({
				ok: true,
				result
			});
		}
		default: return;
	}
}
//#endregion
//#region extensions/discord/src/actions/runtime.messaging.ts
async function handleDiscordMessagingAction(action, params, isActionEnabled, cfg, options) {
	if (!cfg) throw new Error("Discord messaging actions require a resolved runtime config.");
	const ctx = createDiscordMessagingActionContext({
		action,
		input: params,
		isActionEnabled,
		cfg,
		options
	});
	return await handleDiscordReactionMessagingAction(ctx) ?? await handleDiscordMessageSendAction(ctx) ?? await handleDiscordMessageManagementAction(ctx) ?? (() => {
		throw new Error(`Unknown action: ${action}`);
	})();
}
//#endregion
//#region extensions/discord/src/actions/runtime.moderation-shared.ts
const moderationPermissions = {
	timeout: PermissionFlagsBits.ModerateMembers,
	kick: PermissionFlagsBits.KickMembers,
	ban: PermissionFlagsBits.BanMembers
};
function isDiscordModerationAction(action) {
	return action === "timeout" || action === "kick" || action === "ban";
}
function requiredGuildPermissionForModerationAction(action) {
	return moderationPermissions[action];
}
function readDiscordModerationCommand(action, params) {
	if (!isDiscordModerationAction(action)) throw new Error(`Unsupported Discord moderation action: ${action}`);
	return {
		action,
		guildId: readStringParam(params, "guildId", { required: true }),
		userId: readStringParam(params, "userId", { required: true }),
		durationMinutes: readNonNegativeIntegerParam(params, "durationMinutes"),
		until: readStringParam(params, "until"),
		reason: readStringParam(params, "reason"),
		deleteMessageDays: readNonNegativeIntegerParam(params, "deleteMessageDays", {
			max: 7,
			message: "deleteMessageDays must be an integer from 0 to 7"
		})
	};
}
//#endregion
//#region extensions/discord/src/actions/runtime.moderation.ts
async function verifySenderModerationPermission(params) {
	if (!params.senderUserId) return;
	if (!await hasAnyGuildPermissionDiscord(params.guildId, params.senderUserId, [params.requiredPermission], createDiscordActionOptions({
		cfg: params.cfg,
		accountId: params.accountId
	}))) throw new Error("Sender does not have required permissions for this moderation action.");
}
async function handleDiscordModerationAction(action, params, isActionEnabled, cfg) {
	if (!isDiscordModerationAction(action)) throw new Error(`Unknown action: ${action}`);
	if (!isActionEnabled("moderation", false)) throw new Error("Discord moderation is disabled.");
	if (!cfg) throw new Error("Discord moderation actions require a resolved runtime config.");
	const accountId = readStringParam(params, "accountId");
	const command = readDiscordModerationCommand(action, params);
	const senderUserId = readStringParam(params, "senderUserId");
	const withOpts = () => createDiscordActionOptions({
		cfg,
		accountId
	});
	await verifySenderModerationPermission({
		guildId: command.guildId,
		senderUserId,
		requiredPermission: requiredGuildPermissionForModerationAction(command.action),
		accountId,
		cfg
	});
	const target = {
		guildId: command.guildId,
		userId: command.userId,
		reason: command.reason
	};
	if (command.action === "timeout") {
		const member = await timeoutMemberDiscord({
			...target,
			durationMinutes: command.durationMinutes,
			until: command.until
		}, withOpts());
		return jsonResult({
			ok: true,
			member
		});
	}
	if (command.action === "kick") {
		await kickMemberDiscord(target, withOpts());
		return jsonResult({ ok: true });
	}
	await banMemberDiscord({
		...target,
		deleteMessageDays: command.deleteMessageDays
	}, withOpts());
	return jsonResult({ ok: true });
}
//#endregion
//#region extensions/discord/src/actions/runtime.presence.ts
const ACTIVITY_TYPE_MAP = /* @__PURE__ */ new Map([
	["playing", 0],
	["streaming", 1],
	["listening", 2],
	["watching", 3],
	["custom", 4],
	["competing", 5]
]);
const VALID_STATUSES = /* @__PURE__ */ new Set([
	"online",
	"dnd",
	"idle",
	"invisible"
]);
async function handleDiscordPresenceAction(action, params, isActionEnabled, cfg) {
	if (action !== "setPresence") throw new Error(`Unknown presence action: ${action}`);
	if (!isActionEnabled("presence", false)) throw new Error("Discord presence changes are disabled.");
	const accountId = readStringParam(params, "accountId") ?? resolveDefaultDiscordAccountId(cfg);
	const gateway = getGateway(accountId);
	if (!gateway) throw new Error(`Discord gateway not available for account "${accountId}". The bot may not be connected.`);
	if (!gateway.isConnected) throw new Error(`Discord gateway is not connected for account "${accountId}".`);
	const statusRaw = readStringParam(params, "status") ?? "online";
	if (!VALID_STATUSES.has(statusRaw)) throw new Error(`Invalid status "${statusRaw}". Must be one of: ${[...VALID_STATUSES].join(", ")}`);
	const status = statusRaw;
	const activityTypeRaw = readStringParam(params, "activityType");
	const activityName = readStringParam(params, "activityName");
	const activities = [];
	if (activityTypeRaw || activityName) {
		if (!activityTypeRaw) throw new Error(`activityType is required when activityName is provided. Valid types: ${[...ACTIVITY_TYPE_MAP.keys()].join(", ")}`);
		const typeNum = ACTIVITY_TYPE_MAP.get(normalizeLowercaseStringOrEmpty(activityTypeRaw));
		if (typeNum === void 0) throw new Error(`Invalid activityType "${activityTypeRaw}". Must be one of: ${[...ACTIVITY_TYPE_MAP.keys()].join(", ")}`);
		const activity = {
			name: activityName ?? "",
			type: typeNum
		};
		if (typeNum === 1) {
			const url = readStringParam(params, "activityUrl");
			if (url) activity.url = url;
		}
		const state = readStringParam(params, "activityState");
		if (state) activity.state = state;
		activities.push(activity);
	}
	const presenceData = {
		since: null,
		activities,
		status,
		afk: false
	};
	gateway.updatePresence(presenceData);
	return jsonResult({
		ok: true,
		status,
		activities: activities.map((a) => Object.assign({
			type: a.type,
			name: a.name
		}, a.url ? { url: a.url } : {}, a.state ? { state: a.state } : {}))
	});
}
//#endregion
//#region extensions/discord/src/actions/runtime.ts
const messagingActions = /* @__PURE__ */ new Set([
	"react",
	"reactions",
	"sticker",
	"poll",
	"permissions",
	"fetchMessage",
	"readMessages",
	"sendMessage",
	"editMessage",
	"deleteMessage",
	"threadCreate",
	"threadList",
	"threadReply",
	"pinMessage",
	"unpinMessage",
	"listPins",
	"searchMessages"
]);
const guildActions = /* @__PURE__ */ new Set([
	"memberInfo",
	"roleInfo",
	"emojiList",
	"emojiUpload",
	"stickerUpload",
	"roleAdd",
	"roleRemove",
	"channelInfo",
	"channelList",
	"voiceStatus",
	"eventList",
	"eventCreate",
	"channelCreate",
	"channelEdit",
	"channelDelete",
	"channelMove",
	"categoryCreate",
	"categoryEdit",
	"categoryDelete",
	"channelPermissionSet",
	"channelPermissionRemove"
]);
async function handleDiscordAction(params, cfg, options) {
	const action = readStringParam(params, "action", { required: true });
	const accountId = readStringParam(params, "accountId");
	const isActionEnabled = createDiscordActionGate({
		cfg,
		accountId
	});
	if (messagingActions.has(action)) return await handleDiscordMessagingAction(action, params, isActionEnabled, cfg, options);
	if (guildActions.has(action)) return await handleDiscordGuildAction(action, params, isActionEnabled, cfg, options);
	if (isDiscordModerationAction(action)) return await handleDiscordModerationAction(action, params, isActionEnabled, cfg);
	if (action === "setPresence") return await handleDiscordPresenceAction(action, params, isActionEnabled, cfg);
	throw new Error(`Unknown action: ${action}`);
}
//#endregion
export { readDiscordAutoArchiveDurationParam as a, readDiscordChannelMoveParams as c, requiredGuildPermissionForModerationAction as i, readDiscordParentIdParam as l, isDiscordModerationAction as n, readDiscordChannelCreateParams as o, readDiscordModerationCommand as r, readDiscordChannelEditParams as s, handleDiscordAction as t };
