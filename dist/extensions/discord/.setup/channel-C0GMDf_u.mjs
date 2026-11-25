import { a as listDiscordStartupAccountIds, c as resolveDefaultDiscordAccountId, d as resolveDiscordAccountConfig, i as listDiscordAccountIds, l as resolveDiscordAccount, u as resolveDiscordAccountAllowFrom } from "./accounts-DtjvhJUj.mjs";
import { q as withDiscordRequestAuthority } from "./discord-cXPUdHQi.mjs";
import { c as normalizeDiscordMessagingTarget, d as normalizeDiscordSnowflake, o as looksLikeDiscordTargetId, s as matchesDiscordToolContextTarget } from "./send.receipt-CZ7ks6g7.mjs";
import { t as parseDiscordTarget } from "./target-parsing-BiuhcK9Q.mjs";
import { l as withAbortTimeout } from "./timeouts-CT9hnmo4.mjs";
import { t as getDiscordRuntime } from "./runtime-DcBvHOm1.mjs";
import { A as shouldSuppressLocalDiscordExecApprovalPrompt, D as getDiscordExecApprovalApprovers, E as resolveRequiredDiscordChannelPermissions, O as isDiscordExecApprovalApprover, b as discordMessageActions, k as isDiscordExecApprovalClientEnabled, l as resolveDiscordGroupRequireMention, m as resolveDiscordConversationRoute, t as resolveDiscordOutboundSessionRoute, u as resolveDiscordGroupToolPolicy, y as resolveDiscordRuntimeBindingConversationId } from "./outbound-session-route-G_fK5RAh.mjs";
import { a as resolveDiscordInboundConversation, i as resolveDiscordCommandConversation, n as discordOutbound, r as resolveDiscordAttachedOutboundTarget } from "./outbound-payload-Dh6xCO6z.mjs";
import { r as openDiscordCommandDeployHashStore } from "./command-deploy-store-DPWiBMks.mjs";
import { t as resolveDiscordConversationBindingRoute } from "./conversation-binding-route-CAaWWJdQ.mjs";
import { i as discordSecurityAdapter, n as discordConfigAdapter, r as discordSetupContract, t as createDiscordPluginBase } from "./shared-Bf7ifHlc.mjs";
import { t as normalizeExplicitDiscordSessionKey } from "./session-key-normalization-Cfvze5hd.mjs";
import { i as setThreadBindingMaxAgeBySessionKeyAsync, n as setThreadBindingIdleTimeoutBySessionKeyAsync, r as setThreadBindingMaxAgeBySessionKey, t as setThreadBindingIdleTimeoutBySessionKey } from "./thread-bindings.session-updates-BPO6pPzd.mjs";
import { t as defaultTopLevelPlacement } from "./thread-binding-api-Drd4Zu-5.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { PAIRING_APPROVED_MESSAGE, buildTokenChannelStatusSummary, projectCredentialSnapshotFields, resolveConfiguredFromCredentialStatuses } from "openclaw/plugin-sdk/channel-status";
import { asFiniteNumber, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { createChannelMessageAdapterFromOutbound } from "openclaw/plugin-sdk/channel-outbound";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { buildLegacyDmAccountAllowlistAdapter, createAccountScopedAllowlistNameResolver, createNestedAllowlistOverrideResolver } from "openclaw/plugin-sdk/allowlist-config-edit";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createChannelDirectoryAdapter, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { appendMatchMetadata, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, isRecord as isRecord$1, readAccountStatusSnapshot, resolveEnabledConfiguredAccountId } from "openclaw/plugin-sdk/status-helpers";
import { resolveTargetsWithOptionalToken } from "openclaw/plugin-sdk/target-resolver-runtime";
import { createApproverRestrictedNativeApprovalCapabilityAsync } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapterAsync } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelApproverDmTargetResolverAsync, createChannelNativeOriginTargetResolverAsync, doesApprovalRequestSelectChannelAccountAsync, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { isChannelExecApprovalClientEnabledFromConfig, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { resolveThreadBindingSpawnPolicy } from "openclaw/plugin-sdk/conversation-runtime";
// extensions/discord/src/approval-shared.ts
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
async function shouldHandleDiscordApprovalRequest(params) {
	const accountId = params.accountId ?? resolveDefaultDiscordAccountId(params.cfg);
	return await doesApprovalRequestSelectChannelAccountAsync({
		...params,
		channel: "discord",
		defaultAccountId: resolveDefaultDiscordAccountId(params.cfg),
		eligibleAccountIds: isDiscordApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	}) && isDiscordApprovalAccountEligible(params);
}
// extensions/discord/src/approval-native.ts
function extractDiscordSessionKind(sessionKey) {
	if (!sessionKey) return null;
	const raw = sessionKey.match(/discord:(?:[^:]+:)?(channel|group|dm|direct):/)?.[1];
	if (raw === "direct") return "dm";
	return raw === "channel" || raw === "group" || raw === "dm" ? raw : null;
}
function normalizeDiscordOriginChannelId(value) {
	if (!value) return null;
	const trimmed = value.trim();
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
	const resolveConversation = (request) => resolveApprovalRequestSessionConversation({
		request,
		channel: "discord",
		bundledFallback: false
	});
	const resolveSessionOrigin = (request, sessionTarget) => {
		const sessionConversation = resolveConversation(request);
		if (extractDiscordSessionKind(request.request.sessionKey?.trim() || null) === "dm") return null;
		const to = normalizeDiscordOriginChannelId(sessionTarget ? sessionTarget.to : sessionConversation?.id);
		return to ? {
			to,
			threadId: (sessionTarget ? normalizeDiscordThreadId(sessionTarget.threadId) : void 0) ?? normalizeDiscordThreadId(sessionConversation?.threadId)
		} : null;
	};
	return createChannelNativeOriginTargetResolverAsync({
		channel: "discord",
		shouldHandleRequest: shouldHandleDiscordApprovalRequest,
		resolveTurnSourceTarget: (request) => {
			const sessionConversation = resolveConversation(request);
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
		resolveSessionTarget: (sessionTarget, request) => resolveSessionOrigin(request, sessionTarget),
		resolveFallbackTarget: (request) => resolveSessionOrigin(request)
	});
}
function getDiscordApprovalCapability() {
	return createApproverRestrictedNativeApprovalCapabilityAsync({
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
		isNativeDeliveryEnabled: async ({ cfg, accountId }) => isDiscordExecApprovalClientEnabled({
			cfg,
			accountId
		}),
		resolveNativeDeliveryMode: ({ cfg, accountId }) => resolveDiscordAccount({
			cfg,
			accountId
		}).config.execApprovals?.target ?? "dm",
		resolveOriginTarget: createDiscordOriginTargetResolver(),
		resolveApproverDmTargets: createChannelApproverDmTargetResolverAsync({
			shouldHandleRequest: shouldHandleDiscordApprovalRequest,
			resolveApprovers: ({ cfg, accountId }) => getDiscordExecApprovalApprovers({
				cfg,
				accountId
			}),
			mapApprover: (approver) => ({ to: approver })
		}),
		notifyOriginWhenDmOnly: true,
		nativeRuntimeAsync: createLazyChannelApprovalNativeRuntimeAdapterAsync({
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
			shouldHandle: shouldHandleDiscordApprovalRequest,
			load: async () => (await import("./approval-handler.runtime-Dpezhzba.mjs")).discordApprovalNativeRuntime
		})
	});
}
// extensions/discord/src/channel.loaders.ts
const loadDiscordDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-BXJuh9-J.mjs").then((n) => n.t));
const loadDiscordResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-BNnyfCR8.mjs").then((n) => n.n));
const loadDiscordResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-CDMAGrzv.mjs").then((n) => n.n));
const loadDiscordThreadBindingsManagerModule = createLazyRuntimeModule(() => import("./thread-bindings.manager-6EnH3YZh.mjs").then((n) => n.r));
const loadDiscordConversationForkModule = createLazyRuntimeModule(() => import("./conversation-fork-B6PiUuln.mjs"));
const loadDiscordTargetResolverModule = createLazyRuntimeModule(() => import("./target-resolver-48znkzky.mjs").then((n) => n.r));
const loadDiscordProviderRuntime = createLazyRuntimeModule(() => import("./provider.runtime-Bei0R2QA.mjs"));
const loadDiscordProbeRuntime = createLazyRuntimeModule(() => import("./probe-CfGMZwFD.mjs").then((n) => n.o));
async function probeDiscordStatusAccount(params) {
	const startedAtMs = Date.now();
	const runtime = await loadDiscordProbeRuntime();
	const remainingMs = Math.max(1, params.timeoutMs - Math.max(0, Date.now() - startedAtMs));
	return await runtime.probeDiscord(params.token, remainingMs, { includeApplication: true });
}
const loadDiscordAuditModule = createLazyRuntimeModule(() => import("./audit-B9vk3V2z.mjs").then((n) => n.n));
const loadDiscordSendModule = createLazyRuntimeModule(() => import("./send-DKzwsZkm.mjs").then((n) => n.t));
const loadDiscordDirectoryLiveModule = createLazyRuntimeModule(() => import("./directory-live-B9UoQG9g.mjs").then((n) => n.t));
// extensions/discord/src/conversation-route-owner.ts
async function prepareDiscordConversationRouteOwnersAsync(inputs, inspectBindings) {
	const prepared = inputs.map((params) => {
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
		const input = {
			cfg: params.cfg,
			resolveRoute: route,
			accountId,
			runtimeConversationId,
			configuredConversationId: threadConversationId ?? nativeConversationId,
			parentConversationId: params.conversation.context?.parentPeerId
		};
		return {
			conversation: {
				channel: "discord",
				accountId,
				conversationId: runtimeConversationId,
				parentConversationId: params.conversation.context?.parentPeerId
			},
			resolve(inspection) {
				const { runtimeRoute, configuredRoute } = resolveDiscordConversationBindingRoute({
					...input,
					inspection
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
		};
	});
	const inspect = await inspectBindings(prepared.flatMap((item) => item ? [item.conversation] : []));
	let index = 0;
	return prepared.map((item) => {
		if (!item) return () => null;
		const position = index++;
		return () => item.resolve(inspect()[position]);
	});
}
// extensions/discord/src/status-issues.ts
function isDiscordMessageContentIntentDisabled(value) {
	return isRecord$1(value) && isRecord$1(value.intents) && value.intents.messageContent === "disabled";
}
function readDiscordPermissionsAuditSummary(value) {
	if (!isRecord$1(value)) return {};
	const unresolvedChannels = asFiniteNumber(value.unresolvedChannels);
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
		const addIssue = (kind, message, fix) => issues.push({
			channel: "discord",
			accountId,
			kind,
			message,
			fix
		});
		if (account.groupPolicy === "allowlist" && account.guildsConfigured === 0) addIssue("config", "Discord guild messages are blocked: effective groupPolicy is \"allowlist\", but no guilds are configured.", `${accountId === "default" ? "Add your server under channels.discord.guilds. If channels.discord.accounts.default.guilds is set, add it there instead." : `Add your server under channels.discord.accounts.${accountId}.guilds.`} Refresh channel status after the configuration reload applies.`);
		if (isDiscordMessageContentIntentDisabled(account.application)) addIssue("intent", "Message Content Intent is disabled. Bot may not see normal channel messages.", "Enable Message Content Intent in Discord Dev Portal → Bot → Privileged Gateway Intents, or require mention-only operation.");
		const audit = readDiscordPermissionsAuditSummary(account.audit);
		if (audit.unresolvedChannels && audit.unresolvedChannels > 0) addIssue("config", `Some configured guild channels are not numeric IDs (unresolvedChannels=${audit.unresolvedChannels}). Permission audit can only check numeric channel IDs.`, "Use numeric channel IDs as keys in channels.discord.guilds.*.channels (then rerun channels status --probe).");
		for (const channel of audit.channels ?? []) {
			if (channel.ok === true) continue;
			const missing = channel.missing?.length ? ` missing ${channel.missing.join(", ")}` : "";
			const error = channel.error ? `: ${channel.error}` : "";
			const baseMessage = `Channel ${channel.channelId} permission check failed.${missing}${error}`;
			addIssue("permissions", appendMatchMetadata(baseMessage, channel), "Check that the bot role can view + send in this channel (and that channel overrides don't deny it).");
		}
	}
	return issues;
}
// extensions/discord/src/thread-bindings-channel.ts
function toConversationLifecycleBinding(binding) {
	return {
		boundAt: binding.boundAt,
		lastActivityAt: binding.lastActivityAt ?? binding.boundAt,
		idleTimeoutMs: binding.idleTimeoutMs,
		maxAgeMs: binding.maxAgeMs
	};
}
const discordConversationBindings = {
	prepareFork: async (params) => (await loadDiscordConversationForkModule()).prepareDiscordConversationFork(params),
	supportsCurrentConversationBinding: true,
	bindingStore: "adapter",
	defaultTopLevelPlacement,
	createManager: async ({ cfg, accountId }) => (await loadDiscordThreadBindingsManagerModule()).createThreadBindingManager({
		cfg,
		accountId: accountId ?? void 0,
		persist: false,
		enableSweeper: false
	}),
	setIdleTimeoutBySessionKey: (params) => setThreadBindingIdleTimeoutBySessionKey({
		...params,
		accountId: params.accountId ?? void 0
	}).map(toConversationLifecycleBinding),
	setMaxAgeBySessionKey: (params) => setThreadBindingMaxAgeBySessionKey({
		...params,
		accountId: params.accountId ?? void 0
	}).map(toConversationLifecycleBinding),
	setIdleTimeoutBySessionKeyAsync: async (params) => (await setThreadBindingIdleTimeoutBySessionKeyAsync({
		...params,
		accountId: params.accountId ?? void 0
	})).map(toConversationLifecycleBinding),
	setMaxAgeBySessionKeyAsync: async (params) => (await setThreadBindingMaxAgeBySessionKeyAsync({
		...params,
		accountId: params.accountId ?? void 0
	})).map(toConversationLifecycleBinding)
};
// extensions/discord/src/channel.ts
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
const discordPluginBase = createDiscordPluginBase({ setupContract: discordSetupContract });
const discordPlugin = createChatChannelPlugin({
	base: {
		...discordPluginBase,
		identityLink: { prepare: async (cfg, accountId) => (await import("./identity-link-B7KOBo_l.mjs")).discordIdentityLink.prepare(cfg, accountId) },
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
		agentPrompt: {
			questionInputMode: "buttons",
			messageToolHints: () => [
				"- Discord mentions: use supported mention syntax: users `<@USER_ID>`, channels `<#CHANNEL_ID>`, and roles `<@&ROLE_ID>`. Plain `@name` text only pings when a configured `mentionAliases` entry rewrites it; do not use the legacy `<@!USER_ID>` nickname form.",
				"- Discord components: set `components` when sending messages to include buttons, selects, or v2 containers.",
				"- Forms: add `components.modal` (title, fields). OpenClaw adds a trigger button and routes submissions as new messages."
			]
		},
		messaging: {
			directTargetStyle: discordPluginBase.messaging?.directTargetStyle,
			inferTargetChatType: discordPluginBase.messaging?.inferTargetChatType,
			prepareConversationRouteOwnersAsync: prepareDiscordConversationRouteOwnersAsync,
			targetPrefixes: ["discord"],
			targetIdComparison: "lowercase",
			normalizeTarget: normalizeDiscordMessagingTarget,
			resolveInboundConversation: resolveDiscordInboundConversation,
			normalizeExplicitSessionKey: ({ sessionKey, ctx }) => normalizeExplicitDiscordSessionKey(sessionKey, ctx),
			resolveSessionTarget: ({ id }) => normalizeDiscordMessagingTarget(`channel:${id}`),
			buildCrossContextPresentation: ({ originLabel, message }) => {
				return {
					tone: "neutral",
					blocks: [...message.trim() ? [{
						type: "text",
						text: message
					}, { type: "divider" }] : [], {
						type: "context",
						text: `From ${originLabel}`
					}]
				};
			},
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
					if (!resolved || !looksLikeDiscordTargetId(resolved.normalized)) return null;
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
			compileConfiguredBinding: ({ conversationId }) => {
				const normalized = conversationId.trim();
				return normalized ? { conversationId: normalized } : null;
			},
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => {
				const bindingConversationId = compiledBinding.conversationId;
				if (bindingConversationId === conversationId) return {
					conversationId,
					matchPriority: 2
				};
				if (parentConversationId && parentConversationId !== conversationId && bindingConversationId === parentConversationId) return {
					conversationId: parentConversationId,
					matchPriority: 1
				};
				return null;
			},
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
				const intents = discordProbe?.application?.intents;
				if (intents) {
					const summary = [
						`messageContent=${intents.messageContent ?? "unknown"}`,
						`guildMembers=${intents.guildMembers ?? "unknown"}`,
						`presence=${intents.presence ?? "unknown"}`
					].join(" ");
					lines.push({ text: `Intents: ${summary}` });
				}
				return lines;
			},
			buildCapabilitiesDiagnostics: async ({ account, target, timeoutMs }) => {
				if (!target?.trim()) return;
				const parsedTarget = parseDiscordTarget(target, { defaultKind: "channel" });
				const details = { target: {
					raw: target,
					normalized: parsedTarget?.normalized,
					kind: parsedTarget?.kind,
					channelId: parsedTarget?.kind === "channel" ? parsedTarget.id : void 0
				} };
				const permissionError = (text) => ({
					details,
					lines: [{
						text,
						tone: "error"
					}]
				});
				if (!parsedTarget || parsedTarget.kind !== "channel") return permissionError("Permissions: Target looks like a DM user; pass channel:<id> to audit channel permissions.");
				const token = account.token?.trim();
				if (!token) return permissionError("Permissions: Discord bot token missing for permission audit.");
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
					return permissionError(`Permissions: ${message}`);
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
				const startupIndex = listDiscordStartupAccountIds(ctx.cfg).indexOf(account.accountId);
				const startupDelayMs = Math.max(0, startupIndex) * DISCORD_ACCOUNT_STARTUP_STAGGER_MS;
				if (startupDelayMs > 0) {
					ctx.log?.info(`[${account.accountId}] delaying provider startup ${Math.round(startupDelayMs / 1e3)}s to reduce Discord startup rate limits`);
					try {
						await sleepWithAbort(startupDelayMs, ctx.abortSignal);
					} catch {
						return;
					}
				}
				const token = account.token.trim();
				(async () => {
					try {
						const probe = await (await loadDiscordProbeRuntime()).probeDiscord(token, 2500, { includeApplication: true });
						if (ctx.abortSignal.aborted) return;
						ctx.setStatus({
							accountId: account.accountId,
							bot: probe.bot,
							application: probe.application
						});
						if (probe.ok) {
							const username = probe.bot?.username?.trim();
							if (username) ctx.log?.info?.(`[${account.accountId}] Discord bot check resolved @${username}`);
						} else if (getDiscordRuntime().logging.shouldLogVerbose()) ctx.log?.debug?.(`[${account.accountId}] bot check degraded: ${probe.error ?? `status ${probe.status ?? "unknown"}`}`);
						const messageContent = probe.application?.intents?.messageContent;
						if (messageContent === "disabled") ctx.log?.warn?.(`[${account.accountId}] Discord Message Content Intent is disabled; bot may not respond to channel messages. Enable it in Discord Dev Portal (Bot → Privileged Gateway Intents) or require mentions.`);
						else if (messageContent === "limited") ctx.log?.info?.(`[${account.accountId}] Discord Message Content Intent is limited; bots under 100 servers can use it without verification.`);
					} catch (err) {
						if (!ctx.abortSignal.aborted) ctx.setStatus({
							accountId: account.accountId,
							bot: void 0,
							application: void 0
						});
						if (getDiscordRuntime().logging.shouldLogVerbose()) ctx.log?.debug?.(`[${account.accountId}] bot check failed: ${String(err)}`);
					}
				})();
				ctx.log?.info(`[${account.accountId}] starting provider`);
				let commandDeployHashStore;
				try {
					commandDeployHashStore = openDiscordCommandDeployHashStore(getDiscordRuntime().state.openKeyedStore);
				} catch (error) {
					ctx.log?.warn?.(`[${account.accountId}] Discord command deploy cache unavailable; continuing without persistence: ${formatErrorMessage(error)}`);
				}
				await (await loadDiscordProviderRuntime()).monitorDiscordProvider({
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
		isThreadAddressedByTarget: ({ to, threadId }) => /^\d+$/.test(String(threadId)) && to === resolveDiscordAttachedOutboundTarget({
			to,
			threadId
		}),
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
				currentMessageId: normalizeDiscordSnowflake(context.CurrentMessageId ?? "") ?? void 0,
				hasRepliedRef
			};
		},
		resolveReplyTransport: ({ replyToId }) => replyToId && !normalizeDiscordSnowflake(replyToId) ? { replyToId: null } : null
	},
	outbound: {
		...discordOutbound,
		preferFinalAssistantVisibleText: true,
		shouldTreatDeliveredTextAsVisible: ({ kind, text }) => kind === "block" && typeof text === "string" && text.trim().length > 0,
		shouldSuppressLocalPayloadPrompt: shouldSuppressLocalDiscordExecApprovalPrompt
	}
});
export { collectDiscordStatusIssues as n, shouldHandleDiscordApprovalRequest as r, discordPlugin as t };
