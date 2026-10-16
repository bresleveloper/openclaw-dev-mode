import { c as resolveDiscordAccount, i as listDiscordStartupAccountIds, l as resolveDiscordAccountAllowFrom, r as listDiscordAccountIds, s as resolveDefaultDiscordAccountId, u as resolveDiscordAccountConfig } from "./accounts-HE9-mj1L.mjs";
import { C as withDiscordRequestAuthority } from "./discord-9gysrhzp.mjs";
import { d as normalizeDiscordMessagingTarget, l as looksLikeDiscordTargetId, p as parseDiscordTarget, u as matchesDiscordToolContextTarget } from "./send.receipt-DVOg2Oaw.mjs";
import { l as withAbortTimeout } from "./timeouts-pun7VJ02.mjs";
import { t as getDiscordRuntime } from "./runtime-DgnVQ7zW.mjs";
import { D as isDiscordExecApprovalClientEnabled, E as isDiscordExecApprovalApprover, O as shouldSuppressLocalDiscordExecApprovalPrompt, T as getDiscordExecApprovalApprovers, _ as resolveDiscordRuntimeBindingConversationId, f as resolveDiscordConversationRoute, t as resolveDiscordOutboundSessionRoute, v as discordMessageActions, w as resolveRequiredDiscordChannelPermissions } from "./outbound-session-route-BvBH4LC6.mjs";
import { a as normalizeDiscordAcpConversationId, c as resolveDiscordInboundConversation, i as matchDiscordAcpConversation, n as discordOutbound, o as resolveDiscordAttachedOutboundTarget, r as buildDiscordCrossContextPresentation, s as resolveDiscordCommandConversation } from "./outbound-adapter-D4wRAb5S.mjs";
import { r as openDiscordCommandDeployHashStore } from "./command-deploy-store-DFkBTViB.mjs";
import { t as resolveDiscordConversationBindingRoute } from "./conversation-binding-route-DicJC1Lj.mjs";
import { a as discordSecurityAdapter, i as discordSetupContract, n as discordConfigAdapter, t as createDiscordPluginBase } from "./shared-BoBnM5kM.mjs";
import { t as normalizeExplicitDiscordSessionKey } from "./session-key-normalization-CCHGNSQw.mjs";
import { i as setThreadBindingMaxAgeBySessionKeyAsync, n as setThreadBindingIdleTimeoutBySessionKeyAsync, r as setThreadBindingMaxAgeBySessionKey, t as setThreadBindingIdleTimeoutBySessionKey } from "./thread-bindings.session-updates-Bu_CGr_O.mjs";
import { t as defaultTopLevelPlacement } from "./thread-binding-api-BDZJD4na.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { PAIRING_APPROVED_MESSAGE, buildTokenChannelStatusSummary, projectCredentialSnapshotFields, resolveConfiguredFromCredentialStatuses } from "openclaw/plugin-sdk/channel-status";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { createChannelMessageAdapterFromOutbound } from "openclaw/plugin-sdk/channel-outbound";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { buildLegacyDmAccountAllowlistAdapter, createAccountScopedAllowlistNameResolver, createNestedAllowlistOverrideResolver } from "openclaw/plugin-sdk/allowlist-config-edit";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createChannelDirectoryAdapter, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { appendMatchMetadata, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, isRecord as isRecord$1, readAccountStatusSnapshot, resolveEnabledConfiguredAccountId } from "openclaw/plugin-sdk/status-helpers";
import { resolveTargetsWithOptionalToken } from "openclaw/plugin-sdk/target-resolver-runtime";
import { createApproverRestrictedNativeApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelApproverDmTargetResolver, createChannelNativeOriginTargetResolver, doesApprovalRequestSelectChannelAccount, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { isChannelExecApprovalClientEnabledFromConfig, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { resolveThreadBindingSpawnPolicy } from "openclaw/plugin-sdk/conversation-runtime";
import { resolveScopeRequireMention, resolveScopeToolsPolicy, scopeKey } from "openclaw/plugin-sdk/channel-policy";
import { normalizeAtHashSlug } from "openclaw/plugin-sdk/string-normalization-runtime";
//#region extensions/discord/src/approval-shared.ts
function isDiscordApprovalAccountEligible(params) {
	const account = resolveDiscordAccount(params);
	const config = params.configOverride ?? account.config.execApprovals;
	return account.enabled && isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getDiscordExecApprovalApprovers(params).length
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function shouldHandleDiscordApprovalRequest(params) {
	const accountId = params.accountId ?? resolveDefaultDiscordAccountId(params.cfg);
	if (!doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "discord",
		defaultAccountId: resolveDefaultDiscordAccountId(params.cfg),
		eligibleAccountIds: isDiscordApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	})) return false;
	return isDiscordApprovalAccountEligible(params);
}
//#endregion
//#region extensions/discord/src/approval-native.ts
function extractDiscordSessionKind(sessionKey) {
	if (!sessionKey) return null;
	const match = sessionKey.match(/discord:(?:[^:]+:)?(channel|group|dm|direct):/);
	if (!match) return null;
	const raw = match[1];
	if (raw === "direct") return "dm";
	return raw === "channel" || raw === "group" || raw === "dm" ? raw : null;
}
function normalizeDiscordOriginChannelId(value) {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const prefixed = trimmed.match(/^(?:channel|group):(\d+)$/i);
	if (prefixed) return prefixed[1] ?? null;
	return /^\d+$/.test(trimmed) ? trimmed : null;
}
function normalizeDiscordThreadId(value) {
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
	if (typeof value !== "string") return;
	const normalized = value.trim();
	return /^\d+$/.test(normalized) ? normalized : void 0;
}
function createDiscordOriginTargetResolver() {
	return createChannelNativeOriginTargetResolver({
		channel: "discord",
		shouldHandleRequest: ({ cfg, accountId, request }) => shouldHandleDiscordApprovalRequest({
			cfg,
			accountId,
			request
		}),
		resolveTurnSourceTarget: (request) => {
			const sessionConversation = resolveApprovalRequestSessionConversation({
				request,
				channel: "discord",
				bundledFallback: false
			});
			const sessionKind = extractDiscordSessionKind(normalizeOptionalString(request.request.sessionKey) ?? null);
			const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
			const rawTurnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
			const turnSourceTo = normalizeDiscordOriginChannelId(rawTurnSourceTo);
			const threadId = normalizeDiscordThreadId(request.request.turnSourceThreadId) ?? normalizeDiscordThreadId(sessionConversation?.threadId);
			const hasExplicitOriginTarget = /^(?:channel|group):/i.test(rawTurnSourceTo);
			if (turnSourceChannel !== "discord" || !turnSourceTo || sessionKind === "dm") return null;
			return hasExplicitOriginTarget || sessionKind === "channel" || sessionKind === "group" ? {
				to: turnSourceTo,
				threadId
			} : null;
		},
		resolveSessionTarget: (sessionTarget, request) => {
			const sessionConversation = resolveApprovalRequestSessionConversation({
				request,
				channel: "discord",
				bundledFallback: false
			});
			if (extractDiscordSessionKind(request.request.sessionKey?.trim() || null) === "dm") return null;
			const targetTo = normalizeDiscordOriginChannelId(sessionTarget.to);
			return targetTo ? {
				to: targetTo,
				threadId: normalizeDiscordThreadId(sessionTarget.threadId) ?? normalizeDiscordThreadId(sessionConversation?.threadId)
			} : null;
		},
		resolveFallbackTarget: (request) => {
			const sessionConversation = resolveApprovalRequestSessionConversation({
				request,
				channel: "discord",
				bundledFallback: false
			});
			if (extractDiscordSessionKind(request.request.sessionKey?.trim() || null) === "dm") return null;
			const fallbackChannelId = normalizeDiscordOriginChannelId(sessionConversation?.id);
			return fallbackChannelId ? {
				to: fallbackChannelId,
				threadId: normalizeDiscordThreadId(sessionConversation?.threadId)
			} : null;
		}
	});
}
function createDiscordApproverDmTargetResolver() {
	return createChannelApproverDmTargetResolver({
		shouldHandleRequest: ({ cfg, accountId, request }) => shouldHandleDiscordApprovalRequest({
			cfg,
			accountId,
			request
		}),
		resolveApprovers: ({ cfg, accountId }) => getDiscordExecApprovalApprovers({
			cfg,
			accountId
		}),
		mapApprover: (approver) => ({ to: approver })
	});
}
function createDiscordApprovalCapability() {
	return createApproverRestrictedNativeApprovalCapability({
		channel: "discord",
		channelLabel: "Discord",
		describeExecApprovalSetup: ({ accountId }) => {
			const prefix = accountId && accountId !== "default" ? `channels.discord.accounts.${accountId}` : "channels.discord";
			return `Approve it from the Web UI for now. Discord supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; set \`${prefix}.execApprovals.enabled\` to \`auto\` or \`true\`.`;
		},
		listAccountIds: listDiscordAccountIds,
		hasApprovers: ({ cfg, accountId }) => getDiscordExecApprovalApprovers({
			cfg,
			accountId
		}).length > 0,
		isExecAuthorizedSender: ({ cfg, accountId, senderId }) => isDiscordExecApprovalApprover({
			cfg,
			accountId,
			senderId
		}),
		isNativeDeliveryEnabled: ({ cfg, accountId }) => isDiscordExecApprovalClientEnabled({
			cfg,
			accountId
		}),
		resolveNativeDeliveryMode: ({ cfg, accountId }) => resolveDiscordAccount({
			cfg,
			accountId
		}).config.execApprovals?.target ?? "dm",
		resolveOriginTarget: createDiscordOriginTargetResolver(),
		resolveApproverDmTargets: createDiscordApproverDmTargetResolver(),
		notifyOriginWhenDmOnly: true,
		nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
			capabilityBoundary: true,
			eventKinds: [
				"exec",
				"plugin",
				"system-agent"
			],
			isConfigured: ({ cfg, accountId }) => isDiscordExecApprovalClientEnabled({
				cfg,
				accountId
			}),
			shouldHandle: ({ cfg, accountId, request }) => shouldHandleDiscordApprovalRequest({
				cfg,
				accountId,
				request
			}),
			load: async () => (await import("./approval-handler.runtime-DmnEa54W.mjs")).discordApprovalNativeRuntime
		})
	});
}
let cachedDiscordApprovalCapability;
function getDiscordApprovalCapability() {
	cachedDiscordApprovalCapability ??= createDiscordApprovalCapability();
	return cachedDiscordApprovalCapability;
}
//#endregion
//#region extensions/discord/src/channel.loaders.ts
const loadDiscordDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-gqsdcplU.mjs").then((n) => n.t));
const loadDiscordResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-DA6QlhZN.mjs").then((n) => n.n));
const loadDiscordResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-DNrwvunm.mjs").then((n) => n.n));
const loadDiscordThreadBindingsManagerModule = createLazyRuntimeModule(() => import("./thread-bindings.manager-D2-GYZ5s.mjs").then((n) => n.r));
const loadDiscordTargetResolverModule = createLazyRuntimeModule(() => import("./target-resolver-CSFoPQ12.mjs").then((n) => n.r));
const loadDiscordProviderRuntime = createLazyRuntimeModule(() => import("./provider.runtime-CZ51OIgD.mjs"));
const loadDiscordProbeRuntime = createLazyRuntimeModule(() => import("./probe-BwSKpnZf.mjs").then((n) => n.o));
async function probeDiscordStatusAccount(params) {
	const startedAtMs = Date.now();
	const runtime = await loadDiscordProbeRuntime();
	const remainingMs = Math.max(1, params.timeoutMs - Math.max(0, Date.now() - startedAtMs));
	return await runtime.probeDiscord(params.token, remainingMs, { includeApplication: true });
}
const loadDiscordAuditModule = createLazyRuntimeModule(() => import("./audit-BpikUwN_.mjs").then((n) => n.n));
const loadDiscordSendModule = createLazyRuntimeModule(() => import("./send-CJk3VP5q.mjs").then((n) => n.t));
const loadDiscordDirectoryLiveModule = createLazyRuntimeModule(() => import("./directory-live-Bipr0eUJ.mjs").then((n) => n.t));
//#endregion
//#region extensions/discord/src/conversation-route-owner.ts
function inspectDiscordConversationRouteOwner(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (params.cfg.channels?.discord?.enabled === false || !listDiscordAccountIds(params.cfg).some((id) => normalizeAccountId(id) === accountId) || resolveDiscordAccountConfig(params.cfg, accountId)?.enabled === false) return null;
	const direct = params.conversation.kind === "direct";
	const nativeConversationId = params.conversation.nativeChannelId ?? params.conversation.peerId;
	const threadConversationId = direct ? void 0 : params.conversation.threadId;
	const runtimeConversationId = threadConversationId ?? resolveDiscordRuntimeBindingConversationId({
		isDirectMessage: direct,
		isGroupDm: params.conversation.kind === "group",
		userId: direct ? params.conversation.peerId : void 0,
		channelId: nativeConversationId
	});
	const route = ({ boundAgentId }) => resolveDiscordConversationRoute({
		cfg: params.cfg,
		defaultAgentId: boundAgentId,
		accountId,
		guildId: params.conversation.context?.guildId,
		memberRoleIds: params.conversation.context?.memberRoleIds,
		peer: {
			kind: params.conversation.kind,
			id: params.conversation.peerId
		},
		parentConversationId: params.conversation.context?.parentPeerId
	});
	const { runtimeRoute, configuredRoute } = resolveDiscordConversationBindingRoute({
		cfg: params.cfg,
		resolveRoute: route,
		accountId,
		runtimeConversationId,
		configuredConversationId: threadConversationId ?? nativeConversationId,
		parentConversationId: params.conversation.context?.parentPeerId,
		touchBinding: false
	});
	if (!runtimeRoute.bindingOwnerAvailable && resolveThreadBindingSpawnPolicy({
		cfg: params.cfg,
		channel: "discord",
		accountId,
		kind: "subagent"
	}).enabled) return { kind: "unavailable" };
	if (runtimeRoute.pluginId) return {
		kind: "plugin",
		pluginId: runtimeRoute.pluginId,
		fallbackAgentId: runtimeRoute.route.agentId
	};
	return {
		kind: "agent",
		agentId: runtimeRoute.boundAgentId ?? configuredRoute?.boundAgentId ?? runtimeRoute.route.agentId
	};
}
//#endregion
//#region extensions/discord/src/group-policy.ts
const guildScopeKey = (guildKey) => scopeKey(["guild", guildKey]);
const channelScopeKey = (guildKey, channelKey) => scopeKey(["guild", guildKey], ["channel", channelKey]);
function resolveDiscordGuildKey(guilds, groupSpace) {
	if (!guilds || Object.keys(guilds).length === 0) return;
	const space = normalizeOptionalString(groupSpace) ?? "";
	if (space && guilds[space]) return space;
	const normalized = normalizeAtHashSlug(space);
	if (normalized && guilds[normalized]) return normalized;
	if (normalized) {
		const match = Object.entries(guilds).find(([, entry]) => normalizeAtHashSlug(entry?.slug ?? void 0) === normalized);
		if (match) return match[0];
	}
	return guilds["*"] ? "*" : void 0;
}
function resolveDiscordChannelKey(channelEntries, params) {
	if (!channelEntries || Object.keys(channelEntries).length === 0) return;
	const groupChannel = params.groupChannel;
	const channelSlug = normalizeAtHashSlug(groupChannel);
	if (params.groupId && channelEntries[params.groupId]) return params.groupId;
	if (channelSlug && channelEntries[channelSlug]) return channelSlug;
	if (channelSlug && channelEntries[`#${channelSlug}`]) return `#${channelSlug}`;
	const normalizedGroupChannel = groupChannel ? normalizeAtHashSlug(groupChannel) : void 0;
	return normalizedGroupChannel !== void 0 && channelEntries[normalizedGroupChannel] ? normalizedGroupChannel : void 0;
}
function buildDiscordPolicyTree(guilds) {
	const scopes = {};
	for (const [guildKey, guild] of Object.entries(guilds ?? {})) {
		scopes[guildScopeKey(guildKey)] = {
			requireMention: guild.requireMention,
			tools: guild.tools,
			toolsBySender: guild.toolsBySender
		};
		for (const [channelKey, channel] of Object.entries(guild.channels ?? {})) scopes[channelScopeKey(guildKey, channelKey)] = {
			requireMention: channel.requireMention,
			tools: channel.tools,
			toolsBySender: channel.toolsBySender
		};
	}
	return { scopes };
}
function resolveDiscordPolicyScope(params) {
	const guilds = (params.accountId ? params.cfg.channels?.discord?.accounts?.[params.accountId]?.guilds : void 0) ?? params.cfg.channels?.discord?.guilds;
	const tree = buildDiscordPolicyTree(guilds);
	const guildKey = resolveDiscordGuildKey(guilds, params.groupSpace);
	if (!guildKey) return {
		tree,
		path: []
	};
	const channelKey = resolveDiscordChannelKey(guilds?.[guildKey]?.channels, params);
	return {
		tree,
		path: [guildScopeKey(guildKey), ...channelKey !== void 0 ? [channelScopeKey(guildKey, channelKey)] : []]
	};
}
function resolveDiscordGroupRequireMention(params) {
	return resolveScopeRequireMention(resolveDiscordPolicyScope(params));
}
function resolveDiscordGroupToolPolicy(params) {
	const scope = resolveDiscordPolicyScope(params);
	return resolveScopeToolsPolicy({
		...scope,
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
//#region extensions/discord/src/status-issues.ts
function isDiscordMessageContentIntentDisabled(value) {
	return isRecord$1(value) && isRecord$1(value.intents) && value.intents.messageContent === "disabled";
}
function readDiscordPermissionsAuditSummary(value) {
	if (!isRecord$1(value)) return {};
	const unresolvedChannels = typeof value.unresolvedChannels === "number" && Number.isFinite(value.unresolvedChannels) ? value.unresolvedChannels : void 0;
	const channelsRaw = value.channels;
	return {
		unresolvedChannels,
		channels: Array.isArray(channelsRaw) ? channelsRaw.map((entry) => {
			if (!isRecord$1(entry)) return null;
			const channelId = normalizeOptionalString(entry.channelId);
			if (!channelId) return null;
			return {
				channelId,
				ok: typeof entry.ok === "boolean" ? entry.ok : void 0,
				missing: normalizeOptionalTrimmedStringList(entry.missing),
				error: normalizeOptionalString(entry.error) ?? null,
				matchKey: normalizeOptionalString(entry.matchKey),
				matchSource: normalizeOptionalString(entry.matchSource)
			};
		}).filter((entry) => entry !== null) : void 0
	};
}
function collectDiscordStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readAccountStatusSnapshot(entry, [
			"application",
			"audit",
			"groupPolicy",
			"guildsConfigured"
		]);
		if (!account) continue;
		const accountId = resolveEnabledConfiguredAccountId(account);
		if (!accountId) continue;
		if (account.groupPolicy === "allowlist" && account.guildsConfigured === 0) {
			const guildGuidance = accountId === "default" ? "Add your server under channels.discord.guilds. If channels.discord.accounts.default.guilds is set, add it there instead." : `Add your server under channels.discord.accounts.${accountId}.guilds.`;
			issues.push({
				channel: "discord",
				accountId,
				kind: "config",
				message: "Discord guild messages are blocked: effective groupPolicy is \"allowlist\", but no guilds are configured.",
				fix: `${guildGuidance} Refresh channel status after the configuration reload applies.`
			});
		}
		if (isDiscordMessageContentIntentDisabled(account.application)) issues.push({
			channel: "discord",
			accountId,
			kind: "intent",
			message: "Message Content Intent is disabled. Bot may not see normal channel messages.",
			fix: "Enable Message Content Intent in Discord Dev Portal → Bot → Privileged Gateway Intents, or require mention-only operation."
		});
		const audit = readDiscordPermissionsAuditSummary(account.audit);
		if (audit.unresolvedChannels && audit.unresolvedChannels > 0) issues.push({
			channel: "discord",
			accountId,
			kind: "config",
			message: `Some configured guild channels are not numeric IDs (unresolvedChannels=${audit.unresolvedChannels}). Permission audit can only check numeric channel IDs.`,
			fix: "Use numeric channel IDs as keys in channels.discord.guilds.*.channels (then rerun channels status --probe)."
		});
		for (const channel of audit.channels ?? []) {
			if (channel.ok === true) continue;
			const missing = channel.missing?.length ? ` missing ${channel.missing.join(", ")}` : "";
			const error = channel.error ? `: ${channel.error}` : "";
			const baseMessage = `Channel ${channel.channelId} permission check failed.${missing}${error}`;
			issues.push({
				channel: "discord",
				accountId,
				kind: "permissions",
				message: appendMatchMetadata(baseMessage, {
					matchKey: channel.matchKey,
					matchSource: channel.matchSource
				}),
				fix: "Ensure the bot role can view + send in this channel (and that channel overrides don't deny it)."
			});
		}
	}
	return issues;
}
//#endregion
//#region extensions/discord/src/thread-bindings-channel.ts
function toConversationLifecycleBinding(binding) {
	return {
		boundAt: binding.boundAt,
		lastActivityAt: typeof binding.lastActivityAt === "number" ? binding.lastActivityAt : binding.boundAt,
		idleTimeoutMs: typeof binding.idleTimeoutMs === "number" ? binding.idleTimeoutMs : void 0,
		maxAgeMs: typeof binding.maxAgeMs === "number" ? binding.maxAgeMs : void 0
	};
}
const discordConversationBindings = {
	supportsCurrentConversationBinding: true,
	bindingStore: "adapter",
	defaultTopLevelPlacement,
	createManager: async ({ cfg, accountId }) => (await loadDiscordThreadBindingsManagerModule()).createThreadBindingManager({
		cfg,
		accountId: accountId ?? void 0,
		persist: false,
		enableSweeper: false
	}),
	setIdleTimeoutBySessionKey: ({ targetSessionKey, accountId, idleTimeoutMs }) => setThreadBindingIdleTimeoutBySessionKey({
		targetSessionKey,
		accountId: accountId ?? void 0,
		idleTimeoutMs
	}).map(toConversationLifecycleBinding),
	setMaxAgeBySessionKey: ({ targetSessionKey, accountId, maxAgeMs }) => setThreadBindingMaxAgeBySessionKey({
		targetSessionKey,
		accountId: accountId ?? void 0,
		maxAgeMs
	}).map(toConversationLifecycleBinding),
	setIdleTimeoutBySessionKeyAsync: async ({ targetSessionKey, accountId, idleTimeoutMs }) => (await setThreadBindingIdleTimeoutBySessionKeyAsync({
		targetSessionKey,
		accountId: accountId ?? void 0,
		idleTimeoutMs
	})).map(toConversationLifecycleBinding),
	setMaxAgeBySessionKeyAsync: async ({ targetSessionKey, accountId, maxAgeMs }) => (await setThreadBindingMaxAgeBySessionKeyAsync({
		targetSessionKey,
		accountId: accountId ?? void 0,
		maxAgeMs
	})).map(toConversationLifecycleBinding)
};
//#endregion
//#region extensions/discord/src/channel.ts
const DISCORD_ACCOUNT_STARTUP_STAGGER_MS = 1e4;
const discordMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "discord",
	outbound: discordOutbound,
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true
		},
		finalizer: { capabilities: {
			finalEdit: false,
			normalFallback: true,
			discardPending: true
		} }
	}
});
async function sendDiscordHeartbeatTyping(params) {
	const resolvedTo = resolveDiscordAttachedOutboundTarget(params);
	const target = parseDiscordTarget(resolvedTo, { defaultKind: "channel" });
	if (!target || target.kind !== "channel") return;
	const { sendTypingDiscord } = await loadDiscordSendModule();
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertPlatformSendAuthorized?.();
	};
	assertCurrent();
	await withDiscordRequestAuthority(assertCurrent, () => sendTypingDiscord(target.id, {
		cfg: params.cfg,
		accountId: params.accountId ?? void 0,
		signal: params.signal
	}));
}
function startDiscordStartupProbe(params) {
	(async () => {
		try {
			const probe = await (await loadDiscordProbeRuntime()).probeDiscord(params.token, 2500, { includeApplication: true });
			if (params.abortSignal.aborted) return;
			params.setStatus({
				accountId: params.accountId,
				bot: probe.bot,
				application: probe.application
			});
			if (probe.ok) {
				const username = probe.bot?.username?.trim();
				if (username) params.log?.info?.(`[${params.accountId}] Discord bot probe resolved @${username}`);
			} else if (getDiscordRuntime().logging.shouldLogVerbose()) params.log?.debug?.(`[${params.accountId}] bot probe degraded: ${probe.error ?? `status ${probe.status ?? "unknown"}`}`);
			const messageContent = probe.application?.intents?.messageContent;
			if (messageContent === "disabled") params.log?.warn?.(`[${params.accountId}] Discord Message Content Intent is disabled; bot may not respond to channel messages. Enable it in Discord Dev Portal (Bot → Privileged Gateway Intents) or require mentions.`);
			else if (messageContent === "limited") params.log?.info?.(`[${params.accountId}] Discord Message Content Intent is limited; bots under 100 servers can use it without verification.`);
		} catch (err) {
			if (!params.abortSignal.aborted) params.setStatus({
				accountId: params.accountId,
				bot: void 0,
				application: void 0
			});
			if (getDiscordRuntime().logging.shouldLogVerbose()) params.log?.debug?.(`[${params.accountId}] bot probe failed: ${String(err)}`);
		}
	})();
}
function shouldTreatDiscordDeliveredTextAsVisible(params) {
	return params.kind === "block" && typeof params.text === "string" && params.text.trim().length > 0;
}
function resolveDiscordStartupDelayMs(cfg, accountId) {
	const startupIndex = listDiscordStartupAccountIds(cfg).findIndex((candidateId) => candidateId === accountId);
	return startupIndex <= 0 ? 0 : startupIndex * DISCORD_ACCOUNT_STARTUP_STAGGER_MS;
}
function formatDiscordIntents(intents) {
	if (!intents) return "unknown";
	return [
		`messageContent=${intents.messageContent ?? "unknown"}`,
		`guildMembers=${intents.guildMembers ?? "unknown"}`,
		`presence=${intents.presence ?? "unknown"}`
	].join(" ");
}
const resolveDiscordAllowlistGroupOverrides = createNestedAllowlistOverrideResolver({
	resolveRecord: (account) => account.config.guilds,
	outerLabel: (guildKey) => `guild ${guildKey}`,
	resolveOuterEntries: (guildCfg) => guildCfg?.users,
	resolveChildren: (guildCfg) => guildCfg?.channels,
	innerLabel: (guildKey, channelKey) => `guild ${guildKey} / channel ${channelKey}`,
	resolveInnerEntries: (channelCfg) => channelCfg?.users
});
const resolveDiscordAllowlistNames = createAccountScopedAllowlistNameResolver({
	resolveAccount: resolveDiscordAccount,
	resolveToken: (account) => account.token,
	resolveNames: async ({ token, entries }) => (await loadDiscordResolveUsersModule()).resolveDiscordUserAllowlist({
		token,
		entries
	})
});
const discordPlugin = createChatChannelPlugin({
	base: {
		...createDiscordPluginBase({ setupContract: discordSetupContract }),
		allowlist: {
			...buildLegacyDmAccountAllowlistAdapter({
				channelId: "discord",
				resolveAccount: resolveDiscordAccount,
				normalize: ({ cfg, accountId, values }) => discordConfigAdapter.formatAllowFrom({
					cfg,
					accountId,
					allowFrom: values
				}),
				resolveDmAllowFrom: (account, { cfg }) => resolveDiscordAccountAllowFrom({
					cfg,
					accountId: account.accountId
				}),
				resolveGroupPolicy: (account) => account.config.groupPolicy,
				resolveGroupOverrides: resolveDiscordAllowlistGroupOverrides
			}),
			resolveNames: resolveDiscordAllowlistNames
		},
		groups: {
			resolveRequireMention: resolveDiscordGroupRequireMention,
			resolveToolPolicy: resolveDiscordGroupToolPolicy
		},
		mentions: { stripPatterns: () => ["<@!?\\d+>"] },
		agentPrompt: { messageToolHints: () => [
			"- Discord mentions: use canonical outbound syntax: users `<@USER_ID>`, channels `<#CHANNEL_ID>`, and roles `<@&ROLE_ID>`. Plain `@name` text only pings when a configured `mentionAliases` entry rewrites it; do not use the legacy `<@!USER_ID>` nickname form.",
			"- Discord components: set `components` when sending messages to include buttons, selects, or v2 containers.",
			"- Forms: add `components.modal` (title, fields). OpenClaw adds a trigger button and routes submissions as new messages."
		] },
		messaging: {
			resolveConversationRouteOwner: inspectDiscordConversationRouteOwner,
			targetPrefixes: ["discord"],
			directTargetStyle: "user-prefixed",
			targetIdComparison: "lowercase",
			normalizeTarget: normalizeDiscordMessagingTarget,
			resolveInboundConversation: resolveDiscordInboundConversation,
			normalizeExplicitSessionKey: ({ sessionKey, ctx }) => normalizeExplicitDiscordSessionKey(sessionKey, ctx),
			resolveSessionTarget: ({ id }) => normalizeDiscordMessagingTarget(`channel:${id}`),
			inferTargetChatType: ({ to }) => {
				try {
					const parsed = parseDiscordTarget(to, { defaultKind: "channel" });
					if (!parsed) return;
					return parsed?.kind === "user" ? "direct" : "channel";
				} catch {
					return;
				}
			},
			buildCrossContextPresentation: buildDiscordCrossContextPresentation,
			resolveOutboundSessionRoute: resolveDiscordOutboundSessionRoute,
			targetResolver: {
				looksLikeId: looksLikeDiscordTargetId,
				hint: "<channelId|user:ID|channel:ID>",
				resolveTarget: async ({ cfg, accountId, input, normalized, preferredKind }) => {
					const defaultKind = preferredKind === "user" || normalized.startsWith("user:") ? "user" : preferredKind === "channel" || preferredKind === "group" || normalized.startsWith("channel:") ? "channel" : void 0;
					const resolved = await (await loadDiscordTargetResolverModule()).resolveDiscordTarget(input, {
						cfg,
						accountId
					}, defaultKind ? { defaultKind } : {});
					if (!resolved) return null;
					if (!looksLikeDiscordTargetId(resolved.normalized)) return null;
					if (!looksLikeDiscordTargetId(input) && defaultKind === "channel" && resolved.kind === "user") return null;
					return {
						to: resolved.normalized,
						kind: resolved.kind === "user" ? "user" : "channel",
						display: resolved.raw,
						source: resolved.normalized === normalized ? "normalized" : "directory"
					};
				}
			}
		},
		approvalCapability: getDiscordApprovalCapability(),
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => (await loadDiscordDirectoryConfigModule()).listDiscordDirectoryPeersFromConfig(params),
			listGroups: async (params) => (await loadDiscordDirectoryConfigModule()).listDiscordDirectoryGroupsFromConfig(params),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadDiscordDirectoryLiveModule,
				listPeersLive: (runtime) => runtime.listDiscordDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listDiscordDirectoryGroupsLive
			})
		}),
		message: discordMessageAdapter,
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind }) => {
			const account = resolveDiscordAccount({
				cfg,
				accountId
			});
			if (kind === "group") return resolveTargetsWithOptionalToken({
				token: account.token,
				inputs,
				missingTokenNote: "missing Discord token",
				resolveWithToken: async ({ token, inputs: inputsValue }) => (await loadDiscordResolveChannelsModule()).resolveDiscordChannelAllowlist({
					token,
					entries: inputsValue
				}),
				mapResolved: (entry) => ({
					input: entry.input,
					resolved: entry.resolved,
					id: entry.channelId ?? entry.guildId,
					name: entry.channelName ?? entry.guildName ?? (entry.guildId && !entry.channelId ? entry.guildId : void 0),
					note: entry.note
				})
			});
			return resolveTargetsWithOptionalToken({
				token: account.token,
				inputs,
				missingTokenNote: "missing Discord token",
				resolveWithToken: async ({ token, inputs: inputsLocal }) => (await loadDiscordResolveUsersModule()).resolveDiscordUserAllowlist({
					token,
					entries: inputsLocal
				}),
				mapResolved: (entry) => ({
					input: entry.input,
					resolved: entry.resolved,
					id: entry.id,
					name: entry.name,
					note: entry.note
				})
			});
		} },
		actions: discordMessageActions,
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeDiscordAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => matchDiscordAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId,
				parentConversationId
			}),
			resolveCommandConversation: resolveDiscordCommandConversation
		},
		conversationBindings: discordConversationBindings,
		heartbeat: {
			sendTyping: sendDiscordHeartbeatTyping,
			sendTypingGuarded: sendDiscordHeartbeatTyping
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, {
				connected: false,
				reconnectAttempts: 0,
				lastConnectedAt: null,
				lastDisconnect: null,
				lastEventAt: null
			}),
			collectStatusIssues: collectDiscordStatusIssues,
			buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot, { includeMode: false }),
			probeAccount: async ({ account, timeoutMs }) => await probeDiscordStatusAccount({
				token: account.token,
				timeoutMs
			}),
			formatCapabilitiesProbe: ({ probe }) => {
				const discordProbe = probe;
				const lines = [];
				if (discordProbe?.bot?.username) {
					const botId = discordProbe.bot.id ? ` (${discordProbe.bot.id})` : "";
					lines.push({ text: `Bot: @${discordProbe.bot.username}${botId}` });
				}
				if (discordProbe?.application?.intents) lines.push({ text: `Intents: ${formatDiscordIntents(discordProbe.application.intents)}` });
				return lines;
			},
			buildCapabilitiesDiagnostics: async ({ account, target, timeoutMs }) => {
				if (!target?.trim()) return;
				const parsedTarget = parseDiscordTarget(target.trim(), { defaultKind: "channel" });
				const details = { target: {
					raw: target,
					normalized: parsedTarget?.normalized,
					kind: parsedTarget?.kind,
					channelId: parsedTarget?.kind === "channel" ? parsedTarget.id : void 0
				} };
				if (!parsedTarget || parsedTarget.kind !== "channel") return {
					details,
					lines: [{
						text: "Permissions: Target looks like a DM user; pass channel:<id> to audit channel permissions.",
						tone: "error"
					}]
				};
				const token = account.token?.trim();
				if (!token) return {
					details,
					lines: [{
						text: "Permissions: Discord bot token missing for permission audit.",
						tone: "error"
					}]
				};
				const statusCfg = { channels: { discord: { accounts: { [account.accountId]: {
					...account.config,
					token
				} } } } };
				try {
					const sendModule = await loadDiscordSendModule();
					const perms = await withAbortTimeout({
						timeoutMs,
						createTimeoutError: () => /* @__PURE__ */ new Error(`Capabilities diagnostic timed out after ${timeoutMs}ms`),
						run: async (signal) => await sendModule.fetchChannelPermissionsDiscord(parsedTarget.id, {
							cfg: statusCfg,
							token,
							accountId: account.accountId ?? void 0,
							signal,
							timeoutMs
						})
					});
					const missingRequired = resolveRequiredDiscordChannelPermissions(perms.channelType).filter((permission) => !perms.permissions.includes(permission));
					details.permissions = {
						channelId: perms.channelId,
						guildId: perms.guildId,
						isDm: perms.isDm,
						channelType: perms.channelType,
						permissions: perms.permissions,
						missingRequired,
						raw: perms.raw
					};
					return {
						details,
						lines: [{ text: `Permissions (${perms.channelId}): ${perms.permissions.length ? perms.permissions.join(", ") : "none"}` }, missingRequired.length > 0 ? {
							text: `Missing required: ${missingRequired.join(", ")}`,
							tone: "warn"
						} : {
							text: "Missing required: none",
							tone: "success"
						}]
					};
				} catch (err) {
					const message = formatErrorMessage(err);
					details.permissions = {
						channelId: parsedTarget.id,
						error: message
					};
					return {
						details,
						lines: [{
							text: `Permissions: ${message}`,
							tone: "error"
						}]
					};
				}
			},
			auditAccount: async ({ account, timeoutMs, cfg }) => {
				const { auditDiscordChannelPermissions, collectDiscordAuditChannelIds } = await loadDiscordAuditModule();
				const { channelIds, unresolvedChannels } = collectDiscordAuditChannelIds({
					cfg,
					accountId: account.accountId
				});
				if (!channelIds.length && unresolvedChannels === 0) return;
				const botToken = account.token?.trim();
				if (!botToken) return {
					ok: unresolvedChannels === 0,
					checkedChannels: 0,
					unresolvedChannels,
					channels: [],
					elapsedMs: 0
				};
				return {
					...await auditDiscordChannelPermissions({
						cfg,
						token: botToken,
						accountId: account.accountId,
						channelIds,
						timeoutMs
					}),
					unresolvedChannels
				};
			},
			resolveAccountSnapshot: ({ account, cfg, runtime, probe, audit }) => {
				const configured = resolveConfiguredFromCredentialStatuses(account) ?? Boolean(account.token?.trim());
				const app = runtime?.application ?? probe?.application;
				const bot = runtime?.bot ?? probe?.bot;
				const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
					providerConfigPresent: cfg.channels?.discord !== void 0,
					groupPolicy: account.config.groupPolicy,
					defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
				});
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: {
						...projectCredentialSnapshotFields(account),
						connected: runtime?.connected ?? false,
						reconnectAttempts: runtime?.reconnectAttempts,
						lastConnectedAt: runtime?.lastConnectedAt ?? null,
						lastDisconnect: runtime?.lastDisconnect ?? null,
						lastEventAt: runtime?.lastEventAt ?? null,
						application: app ?? void 0,
						bot: bot ?? void 0,
						audit,
						groupPolicy,
						guildsConfigured: Object.keys(account.config.guilds ?? {}).length
					}
				};
			}
		}),
		gateway: {
			apiVersion: 2,
			startAccount: async (ctx) => {
				const readConfig = createRuntimeConfigReader(ctx.cfg);
				const account = ctx.account;
				if (account.tokenStatus === "configured_unavailable") throw new Error(`Discord bot token configured for account "${account.accountId}" is unavailable; resolve SecretRefs against the active runtime snapshot before using this account.`);
				const startupDelayMs = resolveDiscordStartupDelayMs(ctx.cfg, account.accountId);
				if (startupDelayMs > 0) {
					ctx.log?.info(`[${account.accountId}] delaying provider startup ${Math.round(startupDelayMs / 1e3)}s to reduce Discord startup rate limits`);
					try {
						await sleepWithAbort(startupDelayMs, ctx.abortSignal);
					} catch {
						return;
					}
				}
				const token = account.token.trim();
				startDiscordStartupProbe({
					accountId: account.accountId,
					token,
					abortSignal: ctx.abortSignal,
					setStatus: ctx.setStatus,
					log: ctx.log
				});
				ctx.log?.info(`[${account.accountId}] starting provider`);
				let commandDeployHashStore;
				try {
					commandDeployHashStore = openDiscordCommandDeployHashStore(getDiscordRuntime().state.openKeyedStore);
				} catch (error) {
					ctx.log?.warn?.(`[${account.accountId}] Discord command deploy cache unavailable; continuing without persistence: ${formatErrorMessage(error)}`);
				}
				return (await loadDiscordProviderRuntime()).monitorDiscordProvider({
					scheduler: ctx.scheduler,
					token,
					accountId: account.accountId,
					config: ctx.cfg,
					readConfig,
					runtime: ctx.runtime,
					channelRuntime: ctx.channelRuntime,
					abortSignal: ctx.abortSignal,
					mediaMaxMb: account.config.mediaMaxMb,
					historyLimit: account.config.historyLimit,
					setStatus: (patch) => ctx.setStatus({
						accountId: account.accountId,
						...patch
					}),
					commandDeployHashStore
				});
			}
		}
	},
	pairing: { text: {
		idLabel: "discordUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^(discord|user):/i),
		notify: async ({ cfg, id, message, accountId }) => {
			await (await loadDiscordSendModule()).sendMessageDiscord(`user:${id}`, message, {
				cfg,
				...accountId ? { accountId } : {}
			});
		}
	} },
	security: discordSecurityAdapter,
	threading: {
		matchesToolContextTarget: matchesDiscordToolContextTarget,
		resolveAutoThreadId: ({ to, toolContext }) => {
			const threadId = normalizeOptionalString(toolContext?.currentThreadTs);
			if (!threadId) return;
			return normalizeDiscordMessagingTarget(to) === `channel:${threadId}` ? threadId : void 0;
		},
		scopedAccountReplyToMode: {
			resolveAccount: (cfg, accountId) => resolveDiscordAccount({
				cfg,
				accountId
			}),
			resolveReplyToMode: (account) => account.config.replyToMode,
			fallback: "off"
		},
		buildToolContext: ({ context, hasRepliedRef }) => {
			const currentMessagingTarget = normalizeOptionalString(context.To);
			const nativeChannelId = normalizeOptionalString(context.NativeChannelId);
			const currentChatType = context.ChatType === "direct" || context.ChatType === "group" || context.ChatType === "channel" ? context.ChatType : void 0;
			return {
				currentChannelId: nativeChannelId ? normalizeDiscordMessagingTarget(nativeChannelId) : currentMessagingTarget,
				currentChatType,
				currentMessagingTarget,
				currentMessageId: context.CurrentMessageId,
				hasRepliedRef
			};
		}
	},
	outbound: {
		...discordOutbound,
		preferFinalAssistantVisibleText: true,
		shouldTreatDeliveredTextAsVisible: shouldTreatDiscordDeliveredTextAsVisible,
		shouldSuppressLocalPayloadPrompt: shouldSuppressLocalDiscordExecApprovalPrompt
	}
});
//#endregion
export { shouldHandleDiscordApprovalRequest as a, resolveDiscordGroupToolPolicy as i, collectDiscordStatusIssues as n, resolveDiscordGroupRequireMention as r, discordPlugin as t };
