import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, l as normalizeOptionalStringifiedId } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { n as normalizeAtHashSlug } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-CRO4LGEB.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { n as sleepWithAbort } from "./backoff-DPz-g2bN.js";
import { i as resolveToolsBySender } from "./group-policy-BiTZkkCF.js";
import { n as resolveTargetsWithOptionalToken } from "./target-resolvers-C4bHUKEV.js";
import "./error-runtime-CDUW9C58.js";
import "./runtime-env-Ds0QYZS5.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import { i as createChatChannelPlugin } from "./core-BsEPrOqQ.js";
import "./channel-core-CSgoR9CB.js";
import "./channel-policy-D4rA0xDW.js";
import { t as createChannelDirectoryAdapter } from "./directory-runtime-CdMqHLJx.js";
import { t as createRuntimeDirectoryLiveAdapter } from "./runtime-forwarders-Dxil5z45.js";
import { a as resolveConfiguredFromCredentialStatuses, r as projectCredentialSnapshotFields } from "./account-snapshot-fields-4NHkrqwW.js";
import { w as createChannelMessageAdapterFromOutbound } from "./channel-outbound-BopAOIGF.js";
import { c as createNestedAllowlistOverrideResolver, o as createAccountScopedAllowlistNameResolver, r as buildLegacyDmAccountAllowlistAdapter } from "./allowlist-config-edit-__fkJx_h.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { _ as resolveEnabledConfiguredAccountId, d as createDefaultChannelRuntimeState, m as asString, o as buildTokenChannelStatusSummary, p as appendMatchMetadata, u as createComputedAccountStatusAdapter } from "./status-helpers-Dy-C1WAt.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-PoA7hMtC.js";
import { c as resolveDiscordAccountAllowFrom, i as listEnabledDiscordAccounts, o as resolveDefaultDiscordAccountId, s as resolveDiscordAccount } from "./accounts-BBrII5kD.js";
import "./channel-api-5lWY15Mx.js";
import { t as parseDiscordTarget } from "./target-parsing-Drh12j1V.js";
import { t as resolveDiscordOutboundSessionRoute } from "./outbound-session-route-jbu6NmiJ.js";
import { n as looksLikeDiscordTargetId, r as normalizeDiscordMessagingTarget } from "./normalize-wDcoT-ST.js";
import { t as getDiscordRuntime } from "./runtime-n11XewvP.js";
import { a as shouldSuppressLocalDiscordExecApprovalPrompt } from "./approval-shared-Brp4oqjE.js";
import { t as getDiscordApprovalCapability } from "./approval-native-C4v0_AOj.js";
import { r as resolveRequiredDiscordChannelPermissions } from "./audit-core-d-u5XiNI.js";
import { t as discordMessageActions$1 } from "./channel-actions-BKyIUNk1.js";
import { n as resolveDiscordCurrentConversationIdentity } from "./conversation-identity-BZAnCfhb.js";
import { n as setThreadBindingMaxAgeBySessionKey, t as setThreadBindingIdleTimeoutBySessionKey } from "./thread-bindings.session-updates-DbgsTwSj.js";
import { d as withAbortTimeout } from "./timeouts-BG9tJyKJ.js";
import { n as discordOutbound } from "./outbound-adapter-Ceg4tRLy.js";
import { i as discordSecurityAdapter, n as discordConfigAdapter, r as discordSetupAdapter, t as createDiscordPluginBase } from "./shared-DYafIJhO.js";
import { t as normalizeExplicitDiscordSessionKey } from "./session-key-normalization-C6vjE-oH.js";
//#region extensions/discord/src/channel.conversation.ts
function resolveDiscordAttachedOutboundTarget(params) {
	if (params.threadId == null) return params.to;
	const threadId = normalizeOptionalStringifiedId(params.threadId) ?? "";
	return threadId ? `channel:${threadId}` : params.to;
}
function buildDiscordCrossContextPresentation(params) {
	return {
		tone: "neutral",
		blocks: [...params.message.trim() ? [{
			type: "text",
			text: params.message
		}, { type: "divider" }] : [], {
			type: "context",
			text: `From ${params.originLabel}`
		}]
	};
}
function normalizeDiscordAcpConversationId(conversationId) {
	const normalized = conversationId.trim();
	return normalized ? { conversationId: normalized } : null;
}
function matchDiscordAcpConversation(params) {
	if (params.bindingConversationId === params.conversationId) return {
		conversationId: params.conversationId,
		matchPriority: 2
	};
	if (params.parentConversationId && params.parentConversationId !== params.conversationId && params.bindingConversationId === params.parentConversationId) return {
		conversationId: params.parentConversationId,
		matchPriority: 1
	};
	return null;
}
function resolveDiscordConversationIdFromTargets(targets) {
	for (const raw of targets) {
		const trimmed = raw?.trim();
		if (!trimmed) continue;
		try {
			const target = parseDiscordTarget(trimmed, { defaultKind: "channel" });
			if (target?.normalized) return target.normalized;
		} catch {
			const mentionMatch = trimmed.match(/^<#(\d+)>$/);
			if (mentionMatch?.[1]) return `channel:${mentionMatch[1]}`;
			if (/^\d{6,}$/.test(trimmed)) return normalizeDiscordMessagingTarget(trimmed);
		}
	}
}
function parseDiscordParentChannelFromSessionKey(raw) {
	const sessionKey = normalizeLowercaseStringOrEmpty(raw);
	if (!sessionKey) return;
	const match = sessionKey.match(/(?:^|:)channel:([^:]+)$/);
	return match?.[1] ? `channel:${match[1]}` : void 0;
}
function resolveDiscordCommandConversation(params) {
	const threadConversation = resolveDiscordThreadConversationRef(params);
	if (threadConversation) return threadConversation;
	const conversationId = resolveDiscordCurrentConversationIdentity({
		from: params.from,
		chatType: params.chatType,
		originatingTo: params.originatingTo,
		commandTo: params.commandTo,
		fallbackTo: params.fallbackTo
	});
	return conversationId ? { conversationId } : null;
}
function resolveDiscordThreadConversationRef(params) {
	const threadId = normalizeOptionalStringifiedId(params.threadId);
	if (!threadId) return null;
	const targets = [
		params.originatingTo ?? params.to,
		params.commandTo,
		params.fallbackTo ?? params.conversationId
	];
	const parentConversationId = normalizeDiscordMessagingTarget(normalizeOptionalStringifiedId(params.threadParentId) ?? "") || parseDiscordParentChannelFromSessionKey(params.parentSessionKey) || resolveDiscordConversationIdFromTargets(targets);
	return {
		conversationId: threadId,
		...parentConversationId && parentConversationId !== threadId ? { parentConversationId } : {}
	};
}
function resolveDiscordInboundConversation(params) {
	const threadConversation = resolveDiscordThreadConversationRef({
		to: params.to,
		conversationId: params.conversationId,
		threadId: params.threadId,
		threadParentId: params.threadParentId
	});
	if (threadConversation) return threadConversation;
	const conversationId = resolveDiscordCurrentConversationIdentity({
		from: params.from,
		chatType: params.isGroup ? "group" : "direct",
		originatingTo: params.to,
		fallbackTo: params.conversationId
	});
	return conversationId ? { conversationId } : null;
}
//#endregion
//#region extensions/discord/src/channel.loaders.ts
const loadDiscordDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-BThAK0l7.js"));
const loadDiscordResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-DYOcljaK.js"));
const loadDiscordResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-BGYpS0rq.js"));
const loadDiscordThreadBindingsManagerModule = createLazyRuntimeModule(() => import("./thread-bindings.manager-CtZqJsha.js"));
const loadDiscordTargetResolverModule = createLazyRuntimeModule(() => import("./target-resolver-D6jsTToy.js"));
const loadDiscordProviderRuntime = createLazyRuntimeModule(() => import("./provider.runtime.js"));
const loadDiscordProbeRuntime = createLazyRuntimeModule(() => import("./probe.runtime-BrBnsRCC.js"));
const loadDiscordAuditModule = createLazyRuntimeModule(() => import("./audit-Ciz6_AC3.js"));
const loadDiscordSendModule = createLazyRuntimeModule(() => import("./send-BM7U6xbQ.js"));
const loadDiscordDirectoryLiveModule = createLazyRuntimeModule(() => import("./directory-live-CFYDczVQ.js"));
//#endregion
//#region extensions/discord/src/group-policy.ts
function normalizeDiscordSlug(value) {
	return normalizeAtHashSlug(value);
}
function resolveDiscordGuildEntry(guilds, groupSpace) {
	if (!guilds || Object.keys(guilds).length === 0) return null;
	const space = normalizeOptionalString(groupSpace) ?? "";
	if (space && guilds[space]) return guilds[space];
	const normalized = normalizeDiscordSlug(space);
	if (normalized && guilds[normalized]) return guilds[normalized];
	if (normalized) {
		const match = Object.values(guilds).find((entry) => normalizeDiscordSlug(entry?.slug ?? void 0) === normalized);
		if (match) return match;
	}
	return guilds["*"] ?? null;
}
function resolveDiscordChannelEntry(channelEntries, params) {
	if (!channelEntries || Object.keys(channelEntries).length === 0) return;
	const groupChannel = params.groupChannel;
	const channelSlug = normalizeDiscordSlug(groupChannel);
	return (params.groupId ? channelEntries[params.groupId] : void 0) ?? (channelSlug ? channelEntries[channelSlug] ?? channelEntries[`#${channelSlug}`] : void 0) ?? (groupChannel ? channelEntries[normalizeDiscordSlug(groupChannel)] : void 0);
}
function resolveSenderToolsEntry(entry, params) {
	if (!entry) return;
	return resolveToolsBySender({
		toolsBySender: entry.toolsBySender,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	}) ?? entry.tools;
}
function resolveDiscordPolicyContext(params) {
	const guildEntry = resolveDiscordGuildEntry((params.accountId ? params.cfg.channels?.discord?.accounts?.[params.accountId]?.guilds : void 0) ?? params.cfg.channels?.discord?.guilds, params.groupSpace);
	const channelEntries = guildEntry?.channels;
	return {
		guildEntry,
		channelEntry: channelEntries && Object.keys(channelEntries).length > 0 ? resolveDiscordChannelEntry(channelEntries, params) : void 0
	};
}
function resolveDiscordGroupRequireMention(params) {
	const context = resolveDiscordPolicyContext(params);
	if (typeof context.channelEntry?.requireMention === "boolean") return context.channelEntry.requireMention;
	if (typeof context.guildEntry?.requireMention === "boolean") return context.guildEntry.requireMention;
	return true;
}
function resolveDiscordGroupToolPolicy(params) {
	const context = resolveDiscordPolicyContext(params);
	const channelPolicy = resolveSenderToolsEntry(context.channelEntry, params);
	if (channelPolicy) return channelPolicy;
	return resolveSenderToolsEntry(context.guildEntry, params);
}
//#endregion
//#region extensions/discord/src/status-issues.ts
function readDiscordAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		configured: value.configured,
		running: value.running,
		connected: value.connected,
		healthState: value.healthState,
		application: value.application,
		audit: value.audit
	};
}
function readDiscordApplicationSummary(value) {
	if (!isRecord(value)) return {};
	const intentsRaw = value.intents;
	if (!isRecord(intentsRaw)) return {};
	return { intents: { messageContent: intentsRaw.messageContent === "enabled" || intentsRaw.messageContent === "limited" || intentsRaw.messageContent === "disabled" ? intentsRaw.messageContent : void 0 } };
}
function readDiscordPermissionsAuditSummary(value) {
	if (!isRecord(value)) return {};
	const unresolvedChannels = typeof value.unresolvedChannels === "number" && Number.isFinite(value.unresolvedChannels) ? value.unresolvedChannels : void 0;
	const channelsRaw = value.channels;
	return {
		unresolvedChannels,
		channels: Array.isArray(channelsRaw) ? channelsRaw.map((entry) => {
			if (!isRecord(entry)) return null;
			const channelId = asString(entry.channelId);
			if (!channelId) return null;
			const ok = typeof entry.ok === "boolean" ? entry.ok : void 0;
			const missing = Array.isArray(entry.missing) ? entry.missing.map((v) => asString(v)).filter(Boolean) : void 0;
			const error = asString(entry.error) ?? null;
			const matchKey = asString(entry.matchKey) ?? void 0;
			const matchSource = asString(entry.matchSource) ?? void 0;
			return {
				channelId,
				ok,
				missing: missing?.length ? missing : void 0,
				error,
				matchKey,
				matchSource
			};
		}).filter(Boolean) : void 0
	};
}
function collectDiscordStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readDiscordAccountStatus(entry);
		if (!account) continue;
		const accountId = resolveEnabledConfiguredAccountId(account);
		if (!accountId) continue;
		const running = account.running === true;
		const healthState = asString(account.healthState);
		if (healthState === "stale-socket" || healthState === "stuck" || healthState === "disconnected" || healthState === "not-running") {
			const runningLabel = running ? "running" : "not running";
			issues.push({
				channel: "discord",
				accountId,
				kind: "runtime",
				message: `Discord gateway transport is degraded (${healthState}; account is ${runningLabel}).`,
				fix: "Check gateway event-loop health and Discord connectivity, then restart the Discord channel or gateway if the transport does not recover."
			});
		} else if (running && account.connected === false) issues.push({
			channel: "discord",
			accountId,
			kind: "runtime",
			message: "Discord gateway transport is running but disconnected.",
			fix: "Check gateway logs for Discord websocket errors and wait for reconnect; restart the Discord channel or gateway if it does not recover."
		});
		if (readDiscordApplicationSummary(account.application).intents?.messageContent === "disabled") issues.push({
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
function resolveRuntimeDiscordMessageActions() {
	try {
		return getDiscordRuntime().channel?.discord?.messageActions ?? null;
	} catch {
		return null;
	}
}
const discordMessageActions = {
	resolveExecutionMode: (ctx) => resolveRuntimeDiscordMessageActions()?.resolveExecutionMode?.(ctx) ?? discordMessageActions$1.resolveExecutionMode?.(ctx) ?? "local",
	describeMessageTool: (ctx) => resolveRuntimeDiscordMessageActions()?.describeMessageTool?.(ctx) ?? discordMessageActions$1.describeMessageTool?.(ctx) ?? null,
	extractToolSend: (ctx) => resolveRuntimeDiscordMessageActions()?.extractToolSend?.(ctx) ?? discordMessageActions$1.extractToolSend?.(ctx) ?? null,
	prepareSendPayload: (ctx) => resolveRuntimeDiscordMessageActions()?.prepareSendPayload?.(ctx) ?? discordMessageActions$1.prepareSendPayload?.(ctx) ?? null,
	handleAction: async (ctx) => {
		const runtimeHandleAction = resolveRuntimeDiscordMessageActions()?.handleAction;
		if (runtimeHandleAction) return await runtimeHandleAction(ctx);
		if (!discordMessageActions$1.handleAction) throw new Error("Discord message actions not available");
		return await discordMessageActions$1.handleAction(ctx);
	}
};
function resolveDiscordStartupAccountIds(cfg) {
	const startupAccountIds = listEnabledDiscordAccounts(cfg).filter((candidate) => resolveConfiguredFromCredentialStatuses(candidate) ?? Boolean(normalizeOptionalString(candidate.token))).map((candidate) => candidate.accountId);
	const defaultAccountId = resolveDefaultDiscordAccountId(cfg);
	if (!startupAccountIds.includes(defaultAccountId)) return startupAccountIds;
	return [defaultAccountId, ...startupAccountIds.filter((candidateId) => candidateId !== defaultAccountId)];
}
function resolveDiscordStartupDelayMs(cfg, accountId) {
	const startupIndex = resolveDiscordStartupAccountIds(cfg).findIndex((candidateId) => candidateId === accountId);
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
function toConversationLifecycleBinding(binding) {
	return {
		boundAt: binding.boundAt,
		lastActivityAt: typeof binding.lastActivityAt === "number" ? binding.lastActivityAt : binding.boundAt,
		idleTimeoutMs: typeof binding.idleTimeoutMs === "number" ? binding.idleTimeoutMs : void 0,
		maxAgeMs: typeof binding.maxAgeMs === "number" ? binding.maxAgeMs : void 0
	};
}
const discordPlugin = createChatChannelPlugin({
	base: {
		...createDiscordPluginBase({ setup: discordSetupAdapter }),
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
			targetPrefixes: ["discord"],
			normalizeTarget: normalizeDiscordMessagingTarget,
			resolveInboundConversation: ({ from, to, conversationId, threadId, threadParentId, isGroup }) => resolveDiscordInboundConversation({
				from,
				to,
				conversationId,
				threadId,
				threadParentId,
				isGroup
			}),
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
			resolveOutboundSessionRoute: (params) => resolveDiscordOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeDiscordTargetId,
				hint: "<channelId|user:ID|channel:ID>",
				resolveTarget: async ({ cfg, accountId, input, normalized, preferredKind }) => {
					const resolved = await (await loadDiscordTargetResolverModule()).resolveDiscordTarget(input, {
						cfg,
						accountId
					}, preferredKind === "user" ? { defaultKind: "user" } : preferredKind === "channel" || preferredKind === "group" ? { defaultKind: "channel" } : {});
					if (!resolved) return null;
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
			resolveCommandConversation: ({ threadId, threadParentId, parentSessionKey, from, chatType, originatingTo, commandTo, fallbackTo }) => resolveDiscordCommandConversation({
				threadId,
				threadParentId,
				parentSessionKey,
				from,
				chatType,
				originatingTo,
				commandTo,
				fallbackTo
			})
		},
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			defaultTopLevelPlacement: "child",
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
			}).map(toConversationLifecycleBinding)
		},
		heartbeat: { sendTyping: async ({ cfg, to, accountId, threadId }) => {
			const target = parseDiscordTarget(resolveDiscordAttachedOutboundTarget({
				to,
				threadId
			}), { defaultKind: "channel" });
			if (!target || target.kind !== "channel") return;
			await (await loadDiscordSendModule()).sendTypingDiscord(target.id, {
				cfg,
				accountId: accountId ?? void 0
			});
		} },
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
			probeAccount: async ({ account, timeoutMs }) => (await loadDiscordProbeRuntime()).probeDiscord(account.token, timeoutMs, { includeApplication: true }),
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
			resolveAccountSnapshot: ({ account, runtime, probe, audit }) => {
				const configured = resolveConfiguredFromCredentialStatuses(account) ?? Boolean(account.token?.trim());
				const app = runtime?.application ?? probe?.application;
				const bot = runtime?.bot ?? probe?.bot;
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
						audit
					}
				};
			}
		}),
		gateway: { startAccount: async (ctx) => {
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
			return (await loadDiscordProviderRuntime()).monitorDiscordProvider({
				token,
				accountId: account.accountId,
				config: ctx.cfg,
				runtime: ctx.runtime,
				channelRuntime: ctx.channelRuntime,
				abortSignal: ctx.abortSignal,
				mediaMaxMb: account.config.mediaMaxMb,
				historyLimit: account.config.historyLimit,
				setStatus: (patch) => ctx.setStatus({
					accountId: account.accountId,
					...patch
				})
			});
		} }
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
	threading: { scopedAccountReplyToMode: {
		resolveAccount: (cfg, accountId) => resolveDiscordAccount({
			cfg,
			accountId
		}),
		resolveReplyToMode: (account) => account.config.replyToMode,
		fallback: "off"
	} },
	outbound: {
		...discordOutbound,
		preferFinalAssistantVisibleText: true,
		shouldTreatDeliveredTextAsVisible: shouldTreatDiscordDeliveredTextAsVisible,
		shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) => shouldSuppressLocalDiscordExecApprovalPrompt({
			cfg,
			accountId,
			payload,
			hint
		})
	}
});
//#endregion
export { resolveDiscordGroupToolPolicy as i, collectDiscordStatusIssues as n, resolveDiscordGroupRequireMention as r, discordPlugin as t };
