import { g as resolveDiscordToken, h as normalizeDiscordToken, l as resolveDiscordAccount, m as resolveDiscordMaxLinesPerMessage, p as resolveDiscordAccountDmPolicy, s as mergeDiscordAccountConfig, u as resolveDiscordAccountAllowFrom } from "./accounts-DtjvhJUj.mjs";
import { _ as registerGateway, c as hasAnyChannelPermissionDiscord, d as createDiscordRestClient, r as canViewDiscordGuildChannel, v as unregisterGateway } from "./send.permissions-BvH_Dr8p.mjs";
import { B as RateLimitError, J as stripUndefinedFields, L as DISCORD_REST_TIMEOUT_MS, _ as Command, d as hasDiscordV2Components, g as User, h as Message, l as Client, m as Guild, n as GuildCreateListener, o as Modal, r as ReadyListener, t as discord_exports, u as asSerializableComponent, v as CommandWithSubcommands, z as DiscordError } from "./discord-cXPUdHQi.mjs";
import { S as formatDiscordUserTag, _ as resolveDiscordOwnerAllowFrom, a as normalizeDiscordDisplaySlug, b as shouldEmitDiscordReactionNotification, c as resolveDiscordChannelConfig, f as resolveDiscordGuildEntry, g as resolveDiscordOwnerAccess, i as normalizeDiscordAllowList, l as resolveDiscordChannelConfigWithFallback, m as resolveDiscordMemberAllowed, n as hasConfiguredDiscordChannels, o as normalizeDiscordSlug, p as resolveDiscordMemberAccessState, r as isDiscordGroupAllowedByPolicy, s as resolveDiscordAllowListMatch, u as resolveDiscordChannelPolicyCommandAuthorizer, w as isDiscordThreadChannelType, x as formatDiscordReactionEmoji, y as resolveGroupDmAllow } from "./allow-list-CkqpzPvP.mjs";
import { S as chunkDiscordTextWithMode } from "./send.receipt-CZ7ks6g7.mjs";
import { n as getDiscordEndpointRuntime, t as assertDiscordEndpointGatewayUrl } from "./endpoint-runtime-BM3x-m6O.mjs";
import { n as validateDiscordProxyUrl, r as withValidatedDiscordProxy } from "./proxy-fetch-B8cK6FLQ.mjs";
import { a as isDiscordRateLimitResponseBody, s as summarizeDiscordResponseBody } from "./api-C4j_kC-2.mjs";
import { _ as readMessagesDiscord, s as sendVoiceMessageDiscord } from "./send-DKzwsZkm.mjs";
import { s as formatMention, t as sendMessageDiscord } from "./send.outbound-cQ4Ohmsc.mjs";
import { l as withAbortTimeout } from "./timeouts-CT9hnmo4.mjs";
import { r as setPresence, t as clearPresences } from "./presence-cache-B3xj3b0l.mjs";
import { _ as parseDiscordModalCustomId, a as DISCORD_APPROVAL_DECISIONS, b as encodeCustomIdComponent, g as parseDiscordComponentCustomIdForInteraction, h as parseDiscordComponentCustomId, i as parseDiscordQuestionData, m as parseDiscordActivityCustomIdForInteraction, s as parseExecApprovalData, u as buildDiscordActivityCustomId, v as parseDiscordModalCustomIdForInteraction, y as decodeCustomIdComponent } from "./shared-interactive-DKBw4SNV.mjs";
import { a as buildDiscordComponentMessage } from "./components-GePlato3.mjs";
import { a as registerDiscordComponentEntries, o as resolveDiscordComponentEntryWithPersistence, s as resolveDiscordModalEntryWithPersistence, t as editDiscordComponentMessage } from "./send.components-CIZALYDP.mjs";
import { t as getDiscordRuntime } from "./runtime-DcBvHOm1.mjs";
import { n as getDiscordActivitiesRuntime } from "./runtime-DSaHEGJd.mjs";
import { t as resolveDiscordCommandOwnerAllowFrom } from "./command-owners-BzlhNBxA.mjs";
import { D as getDiscordExecApprovalApprovers, _ as resolveDiscordConversationIdentity, a as resolveDiscordComponentSpec, c as formatDiscordApprovalDisplayValue, d as setDiscordPolicyBindings, f as buildDiscordConversationRouteContext, h as resolveDiscordEffectiveRoute, k as isDiscordExecApprovalClientEnabled, m as resolveDiscordConversationRoute, n as DISCORD_PRESENTATION_CAPABILITIES, p as buildDiscordRoutePeer, r as buildDiscordPresentationPayload, s as DISCORD_APPROVAL_ALLOWED_MENTIONS, u as resolveDiscordGroupToolPolicy } from "./outbound-session-route-G_fK5RAh.mjs";
import { n as discordIngressIdentity, t as selectDiscordLivePolicyConfig } from "./live-policy-config-DjIHWFla.mjs";
import { t as resolveDiscordChannelAllowlist } from "./resolve-channels-BNnyfCR8.mjs";
import { t as resolveDiscordUserAllowlist } from "./resolve-users-CDMAGrzv.mjs";
import { a as isThreadArchived, n as getThreadBindingManager } from "./thread-bindings.manager-6EnH3YZh.mjs";
import { n as resolveDiscordChannelNameSafe, r as resolveDiscordChannelTopicSafe, t as resolveDiscordChannelInfoSafe } from "./channel-access-DhJhVrdZ.mjs";
import { a as probeDiscordApplicationId, r as parseApplicationIdFromToken } from "./probe-CfGMZwFD.mjs";
import { O as resolveDiscordReferencedReplyMessage, a as resolveDiscordVoiceEnabled, i as setDiscordTranscriptsVoiceManager, k as resolveDiscordReferencedReplyMessageId, l as resolveDiscordThreadLikeChannelContext, o as authorizeDiscordVoiceIngress, s as resolveDiscordVoiceAccess, u as resolveFetchedDiscordThreadLikeChannelContext } from "./transcripts-source-C3F_ErM1.mjs";
import { t as resolveDiscordSenderIdentity } from "./sender-identity-Dt5ELjRN.mjs";
import { n as hasDiscordApprovalControl, t as discordApprovalMessageUpdates } from "./approval-message-updates-DqOXxPss.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { PlatformMessageNotDispatchedError, formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { createNonExitingRuntime, createSubsystemLogger, danger, formatDurationSeconds, logVerbose, shouldLogVerbose, sleepWithAbort, warn } from "openclaw/plugin-sdk/runtime-env";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { asFiniteNumber, asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries, parseFiniteNumber, readNonBlankString, summarizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { captureRuntimeConfigAsyncReader, createRuntimeConfigReader, getRuntimeConfigSnapshot } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { ApplicationCommandOptionType, ButtonStyle, ChannelType, ComponentType, GatewayCloseCodes, GatewayCloseCodes as GatewayCloseCodes$1, GatewayDispatchEvents, GatewayIntentBits, GatewayOpcodes, PermissionFlagsBits } from "discord-api-types/v10";
import { MediaFetchError, buildOutboundMediaLoadOptions, getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { resolveOutboundMediaAccessForConfig } from "openclaw/plugin-sdk/outbound-media";
import { appendReplyMediaFailures, hasOutboundReplyContent, resolveSendableOutboundReplyParts, resolveTextChunksWithFallback } from "openclaw/plugin-sdk/reply-payload";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { MAX_TIMER_TIMEOUT_MS, asDateTimestampMs, asSafeIntegerInRange, parseStrictInteger, parseStrictPositiveInteger, resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { chunkItems, findCodeRegions, sanitizeAssistantVisibleText, sanitizeAssistantVisibleTextWithProfile } from "openclaw/plugin-sdk/text-chunking";
import { createHttp1Agent, createHttp1EnvHttpProxyAgent, createHttp1ProxyAgent, createNodeProxyAgent, resolveEnvHttpProxyAgentOptions, wrapFetchWithAbortSignal } from "openclaw/plugin-sdk/fetch-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { fetchWithSsrFGuard, formatErrorMessage as formatErrorMessage$1, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { logDebug, logError } from "openclaw/plugin-sdk/logging-core";
import { Type } from "typebox";
import { Check, Errors } from "typebox/value";
import { createHash, randomUUID } from "node:crypto";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { sliceUtf16Safe, truncateCodePoints, truncateUtf16Safe, withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
import { addAllowlistUserEntriesFromConfigEntry, buildAllowlistResolutionSummary, canonicalizeAllowlistWithResolvedIds, patchAllowlistUsersInConfigEntries, summarizeMapping } from "openclaw/plugin-sdk/allow-from";
import { LocalMediaAccessError, loadWebMedia } from "openclaw/plugin-sdk/web-media";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { buildOutboundSessionContext, listMessageReceiptPlatformIds, resolveChannelStreamingBlockEnabled, sendDurableMessageBatch } from "openclaw/plugin-sdk/channel-outbound";
import { resolvePinnedMainDmOwnerFromAllowlist } from "openclaw/plugin-sdk/security-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { GROUP_POLICY_BLOCKED_LABEL, resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { renderPresentationForDelivery } from "openclaw/plugin-sdk/interactive-runtime";
import { truncateWithMarker } from "openclaw/plugin-sdk/string-normalization-runtime";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { buildPairingReply, formatThreadBindingDurationLabel, upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import { ensureConfiguredBindingRouteReady, resolveConfiguredBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { readChannelIngressStoreAllowFromForDmPolicy } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { enqueueKeyedTask } from "openclaw/plugin-sdk/keyed-async-queue";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { resolveNativeCommandsEnabled, resolveNativeSkillsEnabled } from "openclaw/plugin-sdk/native-command-config-runtime";
import { buildChannelInboundEventContext, createChannelPartialDeliveryError, createCommandTurnContext, dispatchChannelInboundTurn, formatInboundEnvelope, hasVisibleInboundReplyDispatch, isChannelPartialDeliveryError, resolveEnvelopeFormatOptions, resolveInboundSupplementalSenderAllowed, runChannelInboundEvent } from "openclaw/plugin-sdk/channel-inbound";
import { clearExpiredCooldowns, ensureAuthProfileStoreAsync, formatReasoningMessage, getPreparedModelCatalogSnapshot, isProfileInCooldown, listAgentIds, resolveAgentAvatar, resolveAgentDir, resolveDefaultModelForAgent, resolveHumanDelayConfig, resolveProfilesUnavailableReason } from "openclaw/plugin-sdk/agent-runtime";
import { deleteSessionEntry, getSessionEntryAsync, listSessionEntriesAsync, readSessionUpdatedAtAsync, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { enqueueRoutedSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { captureHttpExchangeAsync, captureWsEventAsync, resolveDebugProxySettings, resolveEffectiveDebugProxyUrl } from "openclaw/plugin-sdk/proxy-capture";
import { resolveRequestUrl } from "openclaw/plugin-sdk/request-url";
import { fetchWithRuntimeDispatcher } from "openclaw/plugin-sdk/runtime-fetch";
import * as dns from "node:dns";
import { resolveDirectStatusReplyForSession } from "openclaw/plugin-sdk/command-status-runtime";
import { loadCommandArgMenuModelCatalog } from "openclaw/plugin-sdk/command-surface";
import { buildCommandTextFromArgs, findCommandByNativeName, mergeNativeCommandSpecs, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenuAsync, serializeCommandArgs } from "openclaw/plugin-sdk/native-command-registry";
import { PLUGIN_COMMAND_DISPATCH, pluginCommandResultContinuesAgent } from "openclaw/plugin-sdk/plugin-command-runtime";
import { recordDeliveredCommandExchange } from "openclaw/plugin-sdk/session-transcript-runtime";
import { buildCommandTextFromArgs as buildCommandTextFromArgs$1, findCommandByNativeName as findCommandByNativeName$1, formatCommandArgMenuTitle, listChatCommands, listNativeCommandSpecsForConfig, prepareSkillCommandsForAgents, resolveCommandAuthorization, resolveCommandAuthorizationAsync, resolveCommandAuthorizedFromAuthorizers, resolveEffectiveAgentRuntime, resolveNativeCommandSessionTargets, resolveStoredModelOverrideAsync, serializeCommandArgs as serializeCommandArgs$1 } from "openclaw/plugin-sdk/command-auth-native";
import { MODEL_PICKER_CHANGED_MESSAGE, getModelsRuntimeChoices } from "openclaw/plugin-sdk/models-provider-runtime";
import { normalizeProviderId } from "openclaw/plugin-sdk/model-ref-parse";
import { normalizeProviderId as normalizeProviderId$1 } from "openclaw/plugin-sdk/provider-model-shared";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { EventEmitter } from "node:events";
import { WebSocket } from "openclaw/plugin-sdk/websocket-runtime";
import { agentControlText } from "openclaw/plugin-sdk/agent-control-runtime";
import { stripPlainTextToolCallBlocks } from "openclaw/plugin-sdk/tool-payload";
import { createChannelInteractiveDispatcher } from "openclaw/plugin-sdk/plugin-runtime";
import { resolveApprovalOverGateway } from "openclaw/plugin-sdk/approval-gateway-runtime";
import { formatApprovalDecisionLabel } from "openclaw/plugin-sdk/approval-runtime";
import { inspect } from "node:util";
import { channelReadyPatch, createTransportActivityStatusPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { Agent } from "node:https";
import { reportChannelRoomJoin } from "openclaw/plugin-sdk/channel-join-intro-runtime";
// extensions/discord/src/monitor/listeners.queue.ts
const DISCORD_SLOW_LISTENER_THRESHOLD_MS = 3e4;
const discordEventQueueLog = createSubsystemLogger("discord/event-queue");
async function runDiscordListenerWithSlowLog(params) {
	const startedAt = performance.now();
	try {
		await params.run();
	} catch (err) {
		if (params.onError) {
			params.onError(err);
			return;
		}
		throw err;
	} finally {
		const { logger, listener, event } = params;
		const durationMs = performance.now() - startedAt;
		if (!(durationMs < DISCORD_SLOW_LISTENER_THRESHOLD_MS)) {
			const duration = formatDurationSeconds(durationMs, {
				decimals: 1,
				unit: "seconds"
			});
			const message = `Slow listener detected: ${listener} took ${duration} for event ${event}`;
			(logger ?? discordEventQueueLog).warn("Slow listener detected", {
				listener,
				event,
				durationMs,
				duration,
				consoleMessage: message
			});
		}
	}
}
// extensions/discord/src/monitor/presence-events.ts
const DISCORD_PRESENCE_GREETING_COOLDOWN_MS = 288e5;
function isDiscordOnlineStatus(status) {
	return status === "online" || status === "idle" || status === "dnd";
}
function isDiscordOfflineStatus(status) {
	return status === "offline";
}
function resolveDiscordOnlinePresenceEvent(params) {
	const config = params.config;
	const userId = params.data.user?.id?.trim();
	if (!config || config.enabled === false || !userId || userId === params.botUserId || params.data.user.bot === true || !isDiscordOnlineStatus(params.data.status) || !params.availabilityKind) return null;
	if (config.users !== void 0 && !config.users.includes(userId)) return null;
	if (params.lastEmittedAtMs !== void 0 && params.nowMs - params.lastEmittedAtMs < 288e5) return null;
	const lines = [
		"Discord online-presence event:",
		params.availabilityKind === "observed-offline" ? `A human member became available online after being observed offline in guild_id=${JSON.stringify(params.data.guild_id)} user_id=${JSON.stringify(userId)} status=${JSON.stringify(params.data.status)}.` : `A human member became newly visible online since the current guild snapshot in guild_id=${JSON.stringify(params.data.guild_id)} user_id=${JSON.stringify(userId)} status=${JSON.stringify(params.data.status)}. They may have come online or joined after the snapshot; do not claim an exact prior status.`,
		`The authorized greeting target is channel_id=${JSON.stringify(config.channelId)}.`,
		"Before greeting, retrieve relevant memory and wiki context for this immutable user_id, including a known timezone when available. Use their local time for the greeting; if their timezone is unknown, do not guess.",
		"Send at most one short, natural greeting to the target channel. Do not reveal private memory. If no greeting is appropriate, stay silent."
	];
	return {
		channelId: config.channelId,
		userId,
		text: lines.join("\n")
	};
}
// extensions/discord/src/monitor/presence-cooldown-store.ts
const DISCORD_PRESENCE_COOLDOWN_MAX_ENTRIES = 25e3;
function openDiscordPresenceCooldownStore() {
	return getDiscordRuntime().state.openKeyedStore({
		namespace: "presence-greeting-cooldowns",
		maxEntries: DISCORD_PRESENCE_COOLDOWN_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		defaultTtlMs: DISCORD_PRESENCE_GREETING_COOLDOWN_MS
	});
}
// extensions/discord/src/monitor/presence-emission-gate.ts
const DISCORD_PRESENCE_RECONNECT_SUPPRESS_MS = 3e5;
const DISCORD_PRESENCE_BURST_LIMIT = 8;
const DISCORD_PRESENCE_BURST_WINDOW_MS = 6e4;
function resolveDiscordPresenceGateOptions(config) {
	return {
		reconnectSuppressMs: config?.reconnectSuppressSeconds !== void 0 ? config.reconnectSuppressSeconds * 1e3 : DISCORD_PRESENCE_RECONNECT_SUPPRESS_MS,
		burstLimit: config?.burstLimit ?? DISCORD_PRESENCE_BURST_LIMIT,
		burstWindowMs: config?.burstWindowSeconds !== void 0 ? config.burstWindowSeconds * 1e3 : DISCORD_PRESENCE_BURST_WINDOW_MS
	};
}
/**
* Per-account lifecycle gate for online-presence events. Reconnect state belongs to the Gateway
* session, while burst state follows the guild-owned configuration that supplies its limits.
*/
var DiscordPresenceEmissionGate = class {
	constructor() {
		this.reconnectLogged = false;
		this.burstByGuild = /* @__PURE__ */ new Map();
	}
	noteGatewaySessionReset(nowMs) {
		this.lastSessionResetAtMs = nowMs;
		this.reconnectLogged = false;
	}
	evaluateReconnectWindow(nowMs, options) {
		if (this.lastSessionResetAtMs !== void 0 && options.reconnectSuppressMs > 0 && nowMs - this.lastSessionResetAtMs < options.reconnectSuppressMs) {
			const shouldLog = !this.reconnectLogged;
			this.reconnectLogged = true;
			return {
				allowed: false,
				reason: "reconnect-window",
				shouldLog
			};
		}
		return { allowed: true };
	}
	reserveBurst(guildId, nowMs, options) {
		const state = this.burstByGuild.get(guildId) ?? {
			reservations: [],
			logged: false
		};
		state.reservations = state.reservations.filter((reservation) => !reservation.committed || nowMs - reservation.atMs < options.burstWindowMs);
		this.burstByGuild.set(guildId, state);
		if (state.reservations.length >= options.burstLimit) {
			const shouldLog = !state.logged;
			state.logged = true;
			return {
				allowed: false,
				reason: state.reservations.some((reservation) => !reservation.committed) ? "burst-pending" : "burst",
				shouldLog
			};
		}
		state.logged = false;
		const reservation = {
			atMs: nowMs,
			committed: false
		};
		state.reservations.push(reservation);
		return {
			allowed: true,
			reservation
		};
	}
	commitBurst(entry, nowMs) {
		entry.atMs = nowMs;
		entry.committed = true;
	}
	releaseBurst(guildId, reservation) {
		const state = this.burstByGuild.get(guildId);
		if (!state) return;
		state.reservations = state.reservations.filter((candidate) => candidate !== reservation);
		if (state.reservations.length === 0 && !state.logged) this.burstByGuild.delete(guildId);
	}
};
// extensions/discord/src/monitor/presence-transition-cache.ts
const DEFAULT_PRESENCE_BASELINE_MAX_ENTRIES = 75e3;
var DiscordPresenceBaselineCache = class {
	constructor(maxEntries = DEFAULT_PRESENCE_BASELINE_MAX_ENTRIES) {
		this.maxEntries = maxEntries;
		this.offlineByKey = /* @__PURE__ */ new Map();
		this.onlineByKey = /* @__PURE__ */ new Map();
	}
	clear() {
		this.offlineByKey.clear();
		this.onlineByKey.clear();
	}
	clearScope(scope) {
		for (const markers of [this.offlineByKey, this.onlineByKey]) for (const [key, markerScope] of markers) if (markerScope === scope) markers.delete(key);
	}
	isOffline(scope, key) {
		return this.offlineByKey.get(key) === scope;
	}
	isOnline(scope, key) {
		return this.onlineByKey.get(key) === scope;
	}
	observeOffline(scope, key) {
		this.onlineByKey.delete(key);
		return this.observe(this.offlineByKey, scope, key);
	}
	observeOnline(scope, key) {
		this.offlineByKey.delete(key);
		return this.observe(this.onlineByKey, scope, key);
	}
	observe(markers, scope, key) {
		markers.delete(key);
		markers.set(key, scope);
		let evictedScope;
		while (markers.size > this.maxEntries) {
			const oldestKey = markers.keys().next().value;
			if (oldestKey === void 0) break;
			evictedScope = markers.get(oldestKey);
			markers.delete(oldestKey);
		}
		return evictedScope;
	}
};
// extensions/discord/src/monitor/thread-session-close.ts
/**
* Closes every session entry in the store whose key contains {@link threadId}.
* The explicit lifecycle deletion archives the old transcript and guarantees
* that a later inbound message starts a fresh session in every reset mode.
*/
async function closeDiscordThreadSessions(params) {
	const { cfg, threadId } = params;
	const normalizedThreadId = normalizeOptionalLowercaseString(threadId) ?? "";
	if (!normalizedThreadId) return 0;
	const segmentRe = new RegExp(`:${normalizedThreadId}(?::|$)`, "i");
	let resetCount = 0;
	for (const agentId of listAgentIds(cfg)) {
		const storePath = resolveStorePath(cfg.session?.store, { agentId });
		for (const { sessionKey, entry } of await listSessionEntriesAsync({
			agentId,
			storePath
		})) {
			if (!segmentRe.test(sessionKey)) continue;
			if (await deleteSessionEntry({
				archiveTranscript: true,
				expectedSessionId: entry.sessionId ?? null,
				expectedUpdatedAt: entry.updatedAt,
				sessionKey,
				storePath
			})) resetCount += 1;
		}
	}
	return resetCount;
}
// extensions/discord/src/monitor/dm-command-auth.ts
const DISCORD_CHANNEL_ID = "discord";
function createDiscordDmIngressSubject(sender) {
	return {
		stableId: sender.id,
		aliases: {
			discordUserName: sender.name,
			discordUserTag: sender.tag,
			participantKind: sender.isPluralKit ? "pluralkit-member" : sender.authorKind
		},
		...sender.isPluralKit ? { authentication: { discordUserId: "asserted" } } : {}
	};
}
function createDiscordDynamicAccessGroupResolver(params) {
	if (!params.cfg) return;
	const cfg = params.cfg;
	return async ({ group, accountId, subject }) => {
		if (group.type !== "discord.channelAudience") return false;
		const senderId = String(subject.stableId ?? "").trim();
		if (!senderId) return false;
		if ((group.membership ?? "canViewChannel") !== "canViewChannel") return false;
		return await canViewDiscordGuildChannel(group.guildId, group.channelId, senderId, {
			cfg,
			accountId,
			token: params.token,
			rest: params.rest
		});
	};
}
function createDiscordIngressResolver(params) {
	return getDiscordRuntime().channel.inbound.ingress.createResolver({
		channelId: DISCORD_CHANNEL_ID,
		accountId: params.accountId,
		identity: discordIngressIdentity,
		cfg: params.cfg,
		resolveAccessGroupMembership: createDiscordDynamicAccessGroupResolver(params),
		...params.readStoreAllowFrom ? { readStoreAllowFrom: params.readStoreAllowFrom } : {},
		...params.useDefaultPairingStore !== void 0 ? { useDefaultPairingStore: params.useDefaultPairingStore } : {}
	});
}
function createDiscordCommandContext(params, kind, defaultId) {
	return {
		subject: createDiscordDmIngressSubject(params.sender),
		conversation: {
			kind,
			id: params.conversationId ?? defaultId,
			parentId: params.conversationParentId,
			threadId: params.conversationThreadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		childSessionPublication: params.childSessionPublication,
		policy: {
			mutableIdentifierMatching: params.allowNameMatching ? "enabled" : "disabled",
			...params.minIdentifierAuthentication ? { minIdentifierAuthentication: params.minIdentifierAuthentication } : {}
		}
	};
}
async function resolveDiscordDmCommandAccess(params) {
	return await createDiscordIngressResolver({
		...params,
		useDefaultPairingStore: params.readStoreAllowFrom == null
	}).message({
		...createDiscordCommandContext(params, "direct", params.sender.id),
		event: {
			kind: params.eventKind ?? "native-command",
			authMode: "inbound",
			mayPair: true
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: "disabled",
		allowFrom: params.configuredAllowFrom,
		command: {
			hasControlCommand: false,
			modeWhenAccessGroupsOff: "configured"
		}
	});
}
async function resolveDiscordTextCommandAccess(params) {
	const ownerAllowFrom = (params.ownerAllowFrom ?? []).filter((entry) => entry.trim() !== "*");
	const memberAccessGroup = "discord-member-access";
	const commandGroup = params.memberAccessConfigured ? [`accessGroup:${memberAccessGroup}`] : [];
	const accessGroupMembership = params.memberAccessConfigured ? [{
		groupName: memberAccessGroup,
		source: "dynamic",
		...params.memberAllowed ? {
			kind: "matched",
			matchedEntryIds: [memberAccessGroup]
		} : { kind: "not-matched" }
	}] : [];
	return await createDiscordIngressResolver(params).command({
		...createDiscordCommandContext(params, "channel", "discord-command"),
		accessGroupMembership,
		dmPolicy: "allowlist",
		groupPolicy: "allowlist",
		allowFrom: ownerAllowFrom,
		groupAllowFrom: commandGroup,
		command: {
			allowTextCommands: params.allowTextCommands,
			hasControlCommand: params.hasControlCommand,
			modeWhenAccessGroupsOff: "configured"
		}
	});
}
// extensions/discord/src/monitor/listeners.reactions.ts
var DiscordReactionListener = class {
	constructor(params) {
		this.params = params;
		this.type = discord_exports.GatewayDispatchEvents.MessageReactionAdd;
	}
	async handle(data, client) {
		await runDiscordReactionHandler({
			data,
			client,
			action: "added",
			handlerParams: this.params
		});
	}
};
var DiscordReactionRemoveListener = class {
	constructor(params) {
		this.params = params;
		this.type = discord_exports.GatewayDispatchEvents.MessageReactionRemove;
	}
	async handle(data, client) {
		await runDiscordReactionHandler({
			data,
			client,
			action: "removed",
			handlerParams: this.params
		});
	}
};
async function runDiscordReactionHandler(params) {
	params.handlerParams.onEvent?.();
	const policy = await params.handlerParams.readPolicy?.();
	const eventParams = {
		...policy ? {
			...params.handlerParams,
			...policy,
			isPolicyCurrent: policy.isCurrent
		} : params.handlerParams,
		data: params.data,
		client: params.client,
		action: params.action
	};
	try {
		const { data, client, action, botUserId, guildEntries } = eventParams;
		if (!("user" in data)) return;
		const user = data.user;
		if (!user || user.bot) return;
		if (botUserId && user.id === botUserId) return;
		const isGuildMessage = Boolean(data.guild_id);
		const guildInfo = isGuildMessage ? resolveDiscordGuildEntry({
			guild: data.guild ?? void 0,
			guildId: data.guild_id ?? void 0,
			guildEntries
		}) : null;
		if (isGuildMessage && guildEntries && Object.keys(guildEntries).length > 0 && !guildInfo) return;
		const memberRoleIds = Array.isArray(data.rawMember?.roles) ? data.rawMember.roles.slice() : [];
		const reactionMode = guildInfo?.reactionNotifications ?? "own";
		const shouldSkipGuildReactionBeforeChannelFetch = () => {
			if (reactionMode === "off" || eventParams.groupPolicy === "disabled") return true;
			if (reactionMode !== "allowlist") return false;
			if (hasConfiguredDiscordChannels(guildInfo?.channels)) return false;
			return !shouldEmitDiscordReactionNotification({
				mode: reactionMode,
				botId: botUserId,
				userId: user.id,
				userName: user.username,
				userTag: formatDiscordUserTag(user),
				guildInfo,
				memberRoleIds,
				allowNameMatching: eventParams.allowNameMatching
			});
		};
		if (isGuildMessage && shouldSkipGuildReactionBeforeChannelFetch()) return;
		const channel = await client.fetchChannel(data.channel_id);
		if (!channel) return;
		const channelContext = await resolveFetchedDiscordThreadLikeChannelContext({
			client,
			channel,
			channelIdFallback: data.channel_id
		});
		const channelName = channelContext.channelName;
		const channelSlug = channelContext.channelSlug;
		const channelType = channelContext.channelType;
		const isDirectMessage = channelType === discord_exports.ChannelType.DM;
		const isGroupDm = channelType === discord_exports.ChannelType.GroupDM;
		const isThreadChannel = channelContext.isThreadChannel;
		const authorizeDiscordReactionIngress = async (resolvedConfig) => {
			if (eventParams.isPolicyCurrent?.() === false) return {
				allowed: false,
				reason: "policy-changed"
			};
			if (isDirectMessage && !eventParams.dmEnabled) return {
				allowed: false,
				reason: "dm-disabled"
			};
			if (isGroupDm && !eventParams.groupDmEnabled) return {
				allowed: false,
				reason: "group-dm-disabled"
			};
			if (isDirectMessage) {
				const access = await resolveDiscordDmCommandAccess({
					cfg: eventParams.cfg,
					accountId: eventParams.accountId,
					dmPolicy: eventParams.dmPolicy,
					configuredAllowFrom: eventParams.allowFrom,
					sender: {
						id: user.id,
						name: user.username,
						tag: formatDiscordUserTag(user)
					},
					allowNameMatching: eventParams.allowNameMatching,
					eventKind: "reaction"
				});
				if (eventParams.isPolicyCurrent?.() === false) return {
					allowed: false,
					reason: "policy-changed"
				};
				if (access.senderAccess.decision !== "allow") return {
					allowed: false,
					reason: access.senderAccess.reasonCode
				};
			}
			if (isGroupDm && !resolveGroupDmAllow({
				channels: eventParams.groupDmChannels,
				channelId: data.channel_id,
				channelName,
				channelSlug
			})) return {
				allowed: false,
				reason: "group-dm-not-allowlisted"
			};
			if (!isGuildMessage) return { allowed: true };
			const channelAllowlistConfigured = hasConfiguredDiscordChannels(guildInfo?.channels);
			const channelAllowed = resolvedConfig?.allowed !== false;
			if (!isDiscordGroupAllowedByPolicy({
				groupPolicy: eventParams.groupPolicy,
				guildAllowlisted: Boolean(guildInfo),
				channelAllowlistConfigured,
				channelAllowed
			})) return {
				allowed: false,
				reason: "guild-policy"
			};
			if (resolvedConfig?.allowed === false) return {
				allowed: false,
				reason: "guild-channel-denied"
			};
			const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
				channelConfig: resolvedConfig,
				guildInfo,
				memberRoleIds,
				sender: {
					id: user.id,
					name: user.username,
					tag: formatDiscordUserTag(user)
				},
				allowNameMatching: eventParams.allowNameMatching
			});
			if (hasAccessRestrictions && !memberAllowed) return {
				allowed: false,
				reason: "guild-member-denied"
			};
			return { allowed: true };
		};
		if (!isGuildMessage) {
			const ingressAccess = await authorizeDiscordReactionIngress();
			if (!ingressAccess.allowed) {
				logVerbose(`discord reaction blocked sender=${user.id} (reason=${ingressAccess.reason})`);
				return;
			}
		}
		const parentId = isThreadChannel ? channelContext.threadParentId : channelContext.parentId;
		const parentName = isThreadChannel ? channelContext.threadParentName : void 0;
		const parentSlug = isThreadChannel ? channelContext.threadParentSlug : "";
		if (isThreadChannel && reactionMode === "off") return;
		let message = null;
		if (isThreadChannel && reactionMode === "own") message = await data.message.fetch().catch(() => null);
		const channelConfig = resolveDiscordChannelConfigWithFallback({
			guildInfo,
			channelId: data.channel_id,
			channelName,
			channelSlug,
			parentId,
			parentName,
			parentSlug,
			scope: isThreadChannel ? "thread" : "channel"
		});
		if (isGuildMessage || isThreadChannel) {
			if (!(await authorizeDiscordReactionIngress(channelConfig)).allowed) return;
		}
		if (!isThreadChannel && reactionMode === "own") message = await data.message.fetch().catch(() => null);
		if (!shouldEmitDiscordReactionNotification({
			mode: reactionMode,
			botId: botUserId,
			messageAuthorId: message?.author?.id,
			userId: user.id,
			userName: user.username,
			userTag: formatDiscordUserTag(user),
			channelConfig,
			guildInfo,
			memberRoleIds,
			allowNameMatching: eventParams.allowNameMatching
		})) return;
		const emojiLabel = formatDiscordReactionEmoji(data.emoji);
		const actorLabel = formatDiscordUserTag(user) || user.id;
		const guildSlug = guildInfo?.slug || (data.guild?.name ? normalizeDiscordSlug(data.guild.name) : data.guild_id ?? (isGroupDm ? "group-dm" : "dm"));
		const channelLabel = channelSlug ? `#${channelSlug}` : channelName ? `#${normalizeDiscordSlug(channelName)}` : `#${data.channel_id}`;
		const baseText = `Discord ${data.burst ? "super " : ""}reaction ${action}: ${emojiLabel} by ${actorLabel} on ${guildSlug} ${channelLabel} msg ${data.message_id}`;
		const authorLabel = message?.author ? formatDiscordUserTag(message.author) : void 0;
		const text = authorLabel ? `${baseText} from ${authorLabel}` : baseText;
		const contextKey = `discord:reaction:${action}:${data.message_id}:${user.id}:${emojiLabel}${data.burst ? ":burst" : ""}`;
		const route = resolveAgentRoute({
			cfg: eventParams.cfg,
			channel: "discord",
			accountId: eventParams.accountId,
			guildId: data.guild_id ?? void 0,
			memberRoleIds,
			peer: {
				kind: isDirectMessage ? "direct" : isGroupDm ? "group" : "channel",
				id: isDirectMessage ? user.id : data.channel_id
			},
			parentPeer: parentId ? {
				kind: "channel",
				id: parentId
			} : void 0
		});
		enqueueRoutedSystemEvent(text, route, { contextKey });
	} catch (err) {
		eventParams.logger.error(danger(`discord reaction handler failed: ${String(err)}`));
	}
}
// extensions/discord/src/monitor/listeners.ts
function registerDiscordListener(listeners, listener) {
	if (listeners.some((existing) => existing.constructor === listener.constructor)) return false;
	listeners.push(listener);
	return true;
}
var DiscordMessageListener = class {
	constructor(handler, logger, onEvent) {
		this.handler = handler;
		this.logger = logger;
		this.onEvent = onEvent;
		this.type = discord_exports.GatewayDispatchEvents.MessageCreate;
	}
	async handle(data, client) {
		this.onEvent?.();
		try {
			await this.handler(data, client);
		} catch (err) {
			(this.logger ?? discordEventQueueLog).error(danger(`discord handler failed: ${String(err)}`));
		}
	}
};
var DiscordInteractionListener = class {
	constructor(logger, onEvent) {
		this.logger = logger;
		this.onEvent = onEvent;
		this.type = discord_exports.GatewayDispatchEvents.InteractionCreate;
	}
	async handle(data, client) {
		this.onEvent?.();
		Promise.resolve().then(() => client.handleInteraction(data)).catch((err) => {
			(this.logger ?? discordEventQueueLog).error(danger(`discord interaction handler failed: ${String(err)}`));
		});
	}
};
async function isDiscordPresenceMemberAllowed(params) {
	const { client, guildInfo } = params;
	let channelConfig = null;
	if (hasConfiguredDiscordChannels(guildInfo.channels)) {
		const fetched = await client.fetchChannel(params.channelId);
		if (!fetched) return false;
		const channel = await resolveFetchedDiscordThreadLikeChannelContext({
			client,
			channel: fetched,
			channelIdFallback: params.channelId
		});
		channelConfig = resolveDiscordChannelConfigWithFallback({
			guildInfo,
			channelId: params.channelId,
			channelName: channel.channelName,
			channelSlug: channel.channelSlug,
			parentId: channel.isThreadChannel ? channel.threadParentId : channel.parentId,
			parentName: channel.isThreadChannel ? channel.threadParentName : void 0,
			parentSlug: channel.isThreadChannel ? channel.threadParentSlug : "",
			scope: channel.isThreadChannel ? "thread" : "channel"
		});
	}
	const sender = params.allowNameMatching ? await client.fetchUser(params.userId).then((user) => ({
		id: user.id,
		name: user.username,
		tag: formatDiscordUserTag(user)
	})) : { id: params.userId };
	const access = (memberRoleIds) => resolveDiscordMemberAccessState({
		channelConfig,
		guildInfo,
		memberRoleIds,
		sender,
		allowNameMatching: params.allowNameMatching
	});
	const { hasAccessRestrictions, memberAllowed } = access([]);
	if (!hasAccessRestrictions || memberAllowed) return true;
	if (!(channelConfig?.roles ?? guildInfo.roles)?.length) return false;
	return access((await client.fetchMember(params.guildId, params.userId)).roles).memberAllowed;
}
var DiscordPresenceListener = class {
	constructor(params) {
		this.params = params;
		this.type = discord_exports.GatewayDispatchEvents.PresenceUpdate;
		this.pendingByGuildUser = /* @__PURE__ */ new Map();
		this.pendingGuildSeeds = /* @__PURE__ */ new Map();
		this.guildPresenceState = /* @__PURE__ */ new Map();
		this.hasGatewayReset = false;
		this.stopped = false;
		this.cooldownStore = params.cooldownStore ?? openDiscordPresenceCooldownStore();
		this.presenceBaseline = params.presenceBaseline ?? new DiscordPresenceBaselineCache();
		this.emissionGate = params.emissionGate ?? new DiscordPresenceEmissionGate();
	}
	async seedGuildSnapshot(data) {
		if (this.stopped) return;
		this.guildPresenceState.set(data.id, {
			available: data.unavailable !== true,
			inferUnknownAsNewlyAvailable: false
		});
		this.presenceBaseline.clearScope(data.id);
		if (data.unavailable !== true && "presences" in data && Array.isArray(data.presences)) for (const presence of data.presences) {
			const userId = presence.user?.id;
			if (userId) setPresence(this.params.accountId, userId, {
				...presence,
				guild_id: data.id
			});
		}
		if (!this.params.readPolicy) {
			this.seedGuildSnapshotWithPolicy(data, this.params.guildEntries);
			return;
		}
		const seed = this.params.readPolicy().then((policy) => {
			this.seedGuildSnapshotWithPolicy(data, policy.guildEntries);
		});
		this.pendingGuildSeeds.set(data.id, seed);
		try {
			await seed;
		} finally {
			if (this.pendingGuildSeeds.get(data.id) === seed) this.pendingGuildSeeds.delete(data.id);
		}
	}
	seedGuildSnapshotWithPolicy(data, guildEntries) {
		const config = resolveDiscordGuildEntry({
			guildId: data.id,
			guildEntries
		})?.presenceEvents;
		const state = this.guildPresenceState.get(data.id);
		if (!state || !config || config.enabled === false) return;
		const keyPrefix = `${this.params.accountId}:${data.id}:`;
		if (data.unavailable === true || !("presences" in data) || !Array.isArray(data.presences)) return;
		state.inferUnknownAsNewlyAvailable = data.member_count <= 75e3;
		for (const presence of data.presences) {
			const userId = presence.user?.id;
			if (!userId || config.users !== void 0 && !config.users.includes(userId)) continue;
			this.recordPresenceBaseline(data.id, `${keyPrefix}${userId}`, presence.status);
		}
	}
	async handle(data, client) {
		const userId = data.user?.id;
		if (!userId || this.stopped) return;
		setPresence(this.params.accountId, userId, data);
		const pendingSeed = this.pendingGuildSeeds.get(data.guild_id);
		if (pendingSeed) {
			await pendingSeed;
			if (this.stopped) return;
		}
		const presenceKey = `${this.params.accountId}:${data.guild_id}:${userId}`;
		try {
			await enqueueKeyedTask({
				tails: this.pendingByGuildUser,
				key: presenceKey,
				task: () => this.handleSerial(data, client, userId, presenceKey)
			});
		} catch (err) {
			(this.params.logger ?? discordEventQueueLog).error(danger(`discord presence handler failed: ${String(err)}`));
		}
	}
	async stop() {
		this.stopped = true;
		this.resetGatewaySession();
		await Promise.allSettled(this.pendingByGuildUser.values());
	}
	resetGatewaySession() {
		this.hasGatewayReset = true;
		this.emissionGate.noteGatewaySessionReset(this.params.nowMs?.() ?? Date.now());
		this.presenceBaseline.clear();
		this.guildPresenceState.clear();
		this.pendingGuildSeeds.clear();
		clearPresences(this.params.accountId);
	}
	invalidateGuild(guildId) {
		this.pendingGuildSeeds.delete(guildId);
		this.guildPresenceState.set(guildId, {
			available: false,
			inferUnknownAsNewlyAvailable: false
		});
		this.presenceBaseline.clearScope(guildId);
	}
	async handleSerial(data, client, userId, presenceKey) {
		if (this.stopped) return;
		const policy = await this.params.readPolicy?.();
		const cfg = policy?.cfg ?? this.params.cfg;
		const guildInfo = resolveDiscordGuildEntry({
			guildId: data.guild_id,
			guildEntries: policy ? policy.guildEntries : this.params.guildEntries
		});
		const config = guildInfo?.presenceEvents;
		if (!guildInfo || !config || config.enabled === false) return;
		if (config.users !== void 0 && !config.users.includes(userId)) return;
		const route = resolveAgentRoute({
			cfg,
			channel: "discord",
			accountId: this.params.accountId,
			guildId: data.guild_id,
			peer: {
				kind: "channel",
				id: config.channelId
			}
		});
		const lastEmittedAtMs = await this.cooldownStore.lookup(presenceKey);
		const nowMs = this.params.nowMs?.() ?? Date.now();
		const presenceScope = data.guild_id;
		const presenceEvent = resolveDiscordOnlinePresenceEvent({
			config,
			data,
			availabilityKind: this.presenceBaseline.isOffline(presenceScope, presenceKey) ? "observed-offline" : this.guildPresenceState.get(data.guild_id)?.inferUnknownAsNewlyAvailable === true && !this.presenceBaseline.isOnline(presenceScope, presenceKey) ? "first-seen-after-snapshot" : null,
			botUserId: this.params.botUserId,
			nowMs,
			lastEmittedAtMs
		});
		if (!presenceEvent) {
			this.recordPresenceBaseline(data.guild_id, presenceKey, data.status);
			return;
		}
		const gateOptions = resolveDiscordPresenceGateOptions(config);
		const logSuppression = (gate) => {
			if (gate.shouldLog) (this.params.logger ?? discordEventQueueLog).info("Discord presence events suppressed", {
				reason: gate.reason,
				accountId: this.params.accountId,
				guildId: data.guild_id
			});
		};
		const reconnectGate = this.emissionGate.evaluateReconnectWindow(nowMs, gateOptions);
		if (!reconnectGate.allowed) {
			logSuppression(reconnectGate);
			this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			return;
		}
		const burstNowMs = this.params.nowMs?.() ?? Date.now();
		const burstGate = this.emissionGate.reserveBurst(data.guild_id, burstNowMs, gateOptions);
		if (!burstGate.allowed) {
			logSuppression(burstGate);
			if (burstGate.reason === "burst-pending") return;
			this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			return;
		}
		const burstReservation = burstGate.reservation;
		let burstCommitted = false;
		let cooldownReserved = false;
		try {
			const system = getDiscordRuntime().system;
			const expectedTarget = await system.captureSessionEventTarget(route.agentId, route.sessionKey);
			if (this.stopped || policy?.isCurrent() === false || !(this.guildPresenceState.get(data.guild_id)?.available ?? !this.hasGatewayReset)) return;
			if (data.user.bot === void 0 && (await client.fetchUser(userId)).bot === true) {
				this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
				return;
			}
			if (!await isDiscordPresenceMemberAllowed({
				client,
				guildInfo,
				guildId: data.guild_id,
				channelId: presenceEvent.channelId,
				userId,
				allowNameMatching: policy?.allowNameMatching ?? this.params.allowNameMatching ?? false
			})) {
				this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
				return;
			}
			if (!await canViewDiscordGuildChannel(data.guild_id, presenceEvent.channelId, userId, {
				cfg,
				accountId: this.params.accountId,
				rest: client.rest
			})) {
				this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
				return;
			}
			try {
				cooldownReserved = await this.cooldownStore.registerIfAbsent(presenceKey, nowMs, { ttlMs: DISCORD_PRESENCE_GREETING_COOLDOWN_MS });
				if (!cooldownReserved) {
					this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
					return;
				}
			} catch (err) {
				(this.params.logger ?? discordEventQueueLog).warn(danger(`discord presence cooldown persistence failed: ${String(err)}`));
				return;
			}
			if (this.stopped || policy?.isCurrent() === false || !(this.guildPresenceState.get(data.guild_id)?.available ?? !this.hasGatewayReset)) return;
			const currentReconnectGate = this.emissionGate.evaluateReconnectWindow(this.params.nowMs?.() ?? Date.now(), gateOptions);
			if (!currentReconnectGate.allowed) {
				logSuppression(currentReconnectGate);
				this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
				return;
			}
			const receipt = system.enqueueSessionEvent(presenceEvent.text, {
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				expectedTarget,
				createIfMissing: true,
				contextKey: `discord:presence-online:${this.params.accountId}:${data.guild_id}:${userId}`,
				deliveryContext: {
					channel: "discord",
					to: `channel:${presenceEvent.channelId}`,
					accountId: this.params.accountId
				}
			});
			const accepted = await receipt.accepted;
			if (!accepted.ok) {
				(this.params.logger ?? discordEventQueueLog).warn(danger(`discord presence admission failed: ${accepted.error}`));
				return;
			}
			this.emissionGate.commitBurst(burstReservation, this.params.nowMs?.() ?? Date.now());
			burstCommitted = true;
			this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			receipt.settled.then((outcome) => {
				if (outcome.status !== "completed") (this.params.logger ?? discordEventQueueLog).warn(danger(`discord presence follow-up ${outcome.status}: ${outcome.error ?? outcome.status}`));
			});
		} finally {
			if (!burstCommitted) this.emissionGate.releaseBurst(data.guild_id, burstReservation);
			if (cooldownReserved && !burstCommitted) await this.cooldownStore.deleteIfEqual?.(presenceKey, nowMs);
		}
	}
	recordPresenceBaseline(guildId, key, status) {
		const evictedGuildId = isDiscordOfflineStatus(status) ? this.presenceBaseline.observeOffline(guildId, key) : isDiscordOnlineStatus(status) ? this.presenceBaseline.observeOnline(guildId, key) : void 0;
		if (!evictedGuildId) return;
		const state = this.guildPresenceState.get(evictedGuildId);
		if (state) state.inferUnknownAsNewlyAvailable = false;
	}
};
var DiscordPresenceGuildCreateListener = class extends GuildCreateListener {
	constructor(presenceListener) {
		super();
		this.presenceListener = presenceListener;
	}
	async handle(data) {
		await this.presenceListener.seedGuildSnapshot(data);
	}
};
var DiscordPresenceGuildDeleteListener = class {
	constructor(presenceListener) {
		this.presenceListener = presenceListener;
		this.type = discord_exports.GatewayDispatchEvents.GuildDelete;
	}
	handle(data) {
		this.presenceListener.invalidateGuild(data.id);
	}
};
var DiscordSessionResetListener = class extends ReadyListener {
	constructor(owner) {
		super();
		this.owner = owner;
	}
	handle() {
		this.owner.resetGatewaySession();
	}
};
var DiscordPresenceReadyListener = class extends DiscordSessionResetListener {};
var DiscordThreadReadyListener = class extends DiscordSessionResetListener {};
const DISCORD_THREAD_REJOIN_CLAIM_MAX_ENTRIES = 1e4;
var DiscordThreadUpdateListener = class {
	constructor(cfg, logger) {
		this.cfg = cfg;
		this.logger = logger;
		this.type = discord_exports.GatewayDispatchEvents.ThreadUpdate;
		this.rejoinClaims = /* @__PURE__ */ new Map();
	}
	resetGatewaySession() {
		this.rejoinClaims.clear();
	}
	async handle(data, client) {
		await runDiscordListenerWithSlowLog({
			logger: this.logger,
			listener: this.constructor.name,
			event: this.type,
			run: async () => {
				const threadId = "id" in data && typeof data.id === "string" ? data.id : void 0;
				if (!threadId) return;
				const logger = this.logger ?? discordEventQueueLog;
				if (isThreadArchived(data)) {
					this.rejoinClaims.delete(threadId);
					const count = await closeDiscordThreadSessions({
						cfg: this.cfg,
						threadId
					});
					if (count > 0) logger.info("Discord thread archived — reset sessions", {
						threadId,
						count
					});
					return;
				}
				if (this.rejoinClaims.has(threadId)) return;
				this.rejoinClaims.set(threadId, true);
				pruneMapToMaxSize(this.rejoinClaims, DISCORD_THREAD_REJOIN_CLAIM_MAX_ENTRIES);
				try {
					await client.rest.put(`/channels/${threadId}/thread-members/@me`);
					logger.info("Discord active thread — rejoined thread", { threadId });
				} catch (err) {
					this.rejoinClaims.delete(threadId);
					logger.warn(danger(`discord thread rejoin failed: ${String(err)}`), { threadId });
				}
			},
			onError: (err) => {
				(this.logger ?? discordEventQueueLog).error(danger(`discord thread-update handler failed: ${String(err)}`));
			}
		});
	}
};
var DiscordThreadDeleteListener = class {
	constructor(cfg, accountId, logger) {
		this.cfg = cfg;
		this.accountId = accountId;
		this.logger = logger;
		this.type = discord_exports.GatewayDispatchEvents.ThreadDelete;
	}
	async handle(data) {
		await runDiscordListenerWithSlowLog({
			logger: this.logger,
			listener: this.constructor.name,
			event: this.type,
			run: async () => {
				const threadId = data.id;
				await getThreadBindingManager(this.accountId)?.unbindThread({
					threadId,
					reason: "thread-delete",
					sendFarewell: false
				});
				const count = await closeDiscordThreadSessions({
					cfg: this.cfg,
					threadId
				});
				if (count > 0) (this.logger ?? discordEventQueueLog).info("Discord thread deleted — reset sessions", {
					threadId,
					count
				});
			},
			onError: (err) => {
				(this.logger ?? discordEventQueueLog).error(danger(`discord thread-delete handler failed: ${String(err)}`));
			}
		});
	}
};
// extensions/discord/src/internal/gateway-dispatch.ts
function mapGatewayDispatchData(client, type, data) {
	if (type === GatewayDispatchEvents.MessageCreate) return createMessageDispatchData(client, data);
	if (type === GatewayDispatchEvents.MessageReactionAdd || type === GatewayDispatchEvents.MessageReactionRemove) return createReactionDispatchData(client, data);
	return data;
}
function createMessageDispatchData(client, data) {
	const message = new Message(client, data);
	return {
		...data,
		id: data.id,
		channel_id: data.channel_id,
		channelId: data.channel_id,
		message,
		author: message.author ?? (data.author ? new User(client, data.author) : null),
		member: data.member,
		rawMember: data.member,
		guild: data.guild_id ? new Guild(client, data.guild_id) : null
	};
}
function createReactionDispatchData(client, data) {
	const userRaw = data.member?.user && typeof data.member.user === "object" ? {
		id: data.user_id,
		username: "",
		...data.member.user
	} : {
		id: data.user_id,
		username: ""
	};
	return {
		...data,
		user: new User(client, userRaw),
		rawMember: data.member,
		guild: data.guild_id ? new Guild(client, data.guild_id) : null,
		message: new Message(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
	};
}
// extensions/discord/src/monitor/provider.allowlist.ts
function formatResolutionLogDetails(base, details) {
	const nonEmpty = details.map((value) => value?.trim()).filter((value) => Boolean(value));
	return nonEmpty.length > 0 ? `${base} (${nonEmpty.join("; ")})` : base;
}
function hasGuildEntries(value) {
	return Object.keys(value).length > 0;
}
function collectChannelResolutionInputs(guildEntries) {
	const entries = [];
	for (const [guildKey, guildCfg] of Object.entries(guildEntries)) {
		if (guildKey === "*") continue;
		const numericGuild = /^\d+$/.test(guildKey);
		const channels = guildCfg?.channels ?? {};
		const channelKeys = Object.keys(channels).filter((key) => key !== "*");
		if (channelKeys.length === 0) {
			if (!numericGuild) entries.push({
				input: guildKey,
				guildKey
			});
			continue;
		}
		for (const channelKey of channelKeys) {
			if (numericGuild && /^\d+$/.test(channelKey)) continue;
			entries.push({
				input: `${guildKey}/${channelKey}`,
				guildKey,
				channelKey
			});
		}
	}
	return entries;
}
async function resolveUserAllowlist(params, existing, entries, scope, transform) {
	const { token, fetcher, runtime } = params;
	if (entries.length === 0) return existing;
	try {
		const resolvedUsers = await resolveDiscordUserAllowlist({
			token,
			entries,
			fetcher
		});
		const { resolvedMap, mapping, unresolved } = buildAllowlistResolutionSummary(resolvedUsers, {
			formatResolved: (entry) => {
				const displayName = entry.name?.trim();
				const target = displayName || entry.id;
				const formatted = formatResolutionLogDetails(!target || entry.input === target ? entry.input : `${entry.input}→${target}`, [
					displayName && entry.id && entry.id !== entry.input ? `id:${entry.id}` : void 0,
					entry.guildName ? `guild:${entry.guildName}` : void 0,
					entry.note
				]);
				return formatted === entry.input ? null : formatted;
			},
			formatUnresolved: (entry) => formatResolutionLogDetails(entry.input, [
				entry.name ? `name:${entry.name}` : void 0,
				entry.guildName ? `guild:${entry.guildName}` : void 0,
				entry.note
			])
		});
		const next = transform(existing, resolvedMap);
		summarizeMapping(`discord ${scope}s`, mapping, unresolved, runtime);
		return next;
	} catch (err) {
		runtime.log?.(`discord ${scope} resolve failed; using config entries. ${formatErrorMessage$1(err)}`);
		return existing;
	}
}
function collectGuildUserEntries(guildEntries) {
	const userEntries = /* @__PURE__ */ new Set();
	for (const guild of Object.values(guildEntries)) {
		addAllowlistUserEntriesFromConfigEntry(userEntries, guild);
		for (const channel of Object.values(guild.channels ?? {})) addAllowlistUserEntriesFromConfigEntry(userEntries, channel);
	}
	return userEntries;
}
async function resolveDiscordAllowlistConfig(params) {
	let guildEntries = params.guildEntries ?? {};
	let allowFrom = Array.isArray(params.allowFrom) ? normalizeStringEntries(params.allowFrom) : void 0;
	const channelPolicyBindings = [];
	const guildPolicyBindings = /* @__PURE__ */ new Map();
	if (hasGuildEntries(guildEntries)) {
		const sourceGuildEntries = guildEntries;
		const { token, fetcher, runtime } = params;
		guildEntries = await (async () => {
			const entries = collectChannelResolutionInputs(sourceGuildEntries);
			if (entries.length === 0) return sourceGuildEntries;
			try {
				const resolved = await resolveDiscordChannelAllowlist({
					token,
					entries: entries.map((entry) => entry.input),
					fetcher
				});
				const sourceByInput = new Map(entries.map((entry) => [entry.input, entry]));
				const nextGuilds = { ...sourceGuildEntries };
				const mappingByTarget = /* @__PURE__ */ new Map();
				const unresolved = [];
				for (const entry of resolved) {
					const source = sourceByInput.get(entry.input);
					if (!source) continue;
					const sourceGuild = sourceGuildEntries[source.guildKey] ?? {};
					if (!entry.resolved || !entry.guildId) {
						unresolved.push(formatResolutionLogDetails(entry.input, [
							entry.guildName ? `guild:${entry.guildName}` : entry.guildId ? `guildId:${entry.guildId}` : void 0,
							entry.channelName ? `channel:${entry.channelName}` : entry.channelId ? `channelId:${entry.channelId}` : void 0,
							entry.note
						]));
						continue;
					}
					if (!guildPolicyBindings.has(entry.guildId)) guildPolicyBindings.set(entry.guildId, source.guildKey);
					if (source.channelKey && entry.channelId && source.channelKey !== entry.channelId) channelPolicyBindings.push({
						guildKey: source.guildKey,
						channelKey: source.channelKey,
						channelId: entry.channelId
					});
					const target = entry.channelId ? `${entry.guildId}/${entry.channelId}` : entry.guildId;
					const existingGroup = mappingByTarget.get(target) ?? {
						target,
						aliases: [],
						guildName: entry.guildName,
						channelName: entry.channelName,
						note: entry.note
					};
					if (entry.input !== target && !existingGroup.aliases.includes(entry.input)) existingGroup.aliases.push(entry.input);
					for (const key of [
						"guildName",
						"channelName",
						"note"
					]) if (!existingGroup[key] && entry[key]) existingGroup[key] = entry[key];
					mappingByTarget.set(target, existingGroup);
					const existing = nextGuilds[entry.guildId] ?? {};
					let mergedChannels = {
						...sourceGuild.channels,
						...existing.channels
					};
					if (source.channelKey && entry.channelId) {
						const sourceChannel = sourceGuild.channels?.[source.channelKey];
						if (sourceChannel) mergedChannels = {
							...mergedChannels,
							[entry.channelId]: {
								...sourceChannel,
								...mergedChannels[entry.channelId]
							}
						};
					}
					nextGuilds[entry.guildId] = {
						...sourceGuild,
						...existing,
						channels: mergedChannels
					};
				}
				const mapping = [...mappingByTarget.values()].map((group) => {
					const aliases = group.aliases;
					const preview = aliases.slice(0, 3).join(", ");
					const aliasSummary = aliases.length === 0 ? void 0 : aliases.length <= 3 ? preview : `${preview}, +${aliases.length - 3} more`;
					return formatResolutionLogDetails(group.target, [
						group.guildName ? `guild:${group.guildName}` : void 0,
						group.channelName ? `channel:${group.channelName}` : void 0,
						group.note,
						aliasSummary ? `aliases:${aliasSummary}` : void 0
					]);
				});
				summarizeMapping("discord channels", mapping, unresolved, runtime);
				return nextGuilds;
			} catch (err) {
				runtime.log?.(`discord channel resolve failed; using config entries. ${formatErrorMessage$1(err)}`);
				return sourceGuildEntries;
			}
		})();
	}
	setDiscordPolicyBindings(params.accountId, channelPolicyBindings, guildPolicyBindings);
	if (isDangerousNameMatchingEnabled(params.discordConfig)) {
		allowFrom = await resolveUserAllowlist(params, allowFrom, (allowFrom ?? []).filter((entry) => entry !== "*"), "user", (existing, resolvedMap) => canonicalizeAllowlistWithResolvedIds({
			existing,
			resolvedMap
		}));
		if (hasGuildEntries(guildEntries)) guildEntries = await resolveUserAllowlist(params, guildEntries, [...collectGuildUserEntries(guildEntries)], "channel user", (existing, resolvedMap) => {
			const nextGuilds = patchAllowlistUsersInConfigEntries({
				entries: existing,
				resolvedMap,
				strategy: "canonicalize"
			});
			for (const [guildKey, guildConfig] of Object.entries(nextGuilds)) {
				const nextGuild = { ...guildConfig };
				const channels = guildConfig.channels ?? {};
				nextGuild.channels = patchAllowlistUsersInConfigEntries({
					entries: channels,
					resolvedMap,
					strategy: "canonicalize"
				});
				nextGuilds[guildKey] = nextGuild;
			}
			return nextGuilds;
		});
	}
	return {
		guildEntries: hasGuildEntries(guildEntries) ? guildEntries : void 0,
		allowFrom
	};
}
// extensions/discord/src/network-config.ts
const DISCORD_DNS_HOSTS = [
	"discord.com",
	"discord.gg",
	"gateway.discord.gg"
];
function isDiscordTransportHostname(hostname) {
	const normalized = normalizeLowercaseStringOrEmpty(hostname);
	return DISCORD_DNS_HOSTS.some((target) => normalized === target || normalized.endsWith(`.${target}`));
}
function createDiscordDnsLookup() {
	return (hostname, options, callback) => {
		if (!isDiscordTransportHostname(hostname)) return dns.lookup(hostname, options, callback);
		const lookupOptions = typeof options === "number" ? { family: options } : { ...options };
		if (lookupOptions.family === 4 || lookupOptions.family === 6) return dns.lookup(hostname, lookupOptions, callback);
		dns.lookup(hostname, {
			...lookupOptions,
			all: true
		}, (err, addresses) => {
			if (err) {
				callback(err, "", 4);
				return;
			}
			const reordered = addresses.length < 2 ? addresses : [...addresses.filter((entry) => entry.family === 4), ...addresses.filter((entry) => entry.family === 6)];
			if (lookupOptions.all === true) {
				callback(null, reordered);
				return;
			}
			const first = reordered[0];
			if (!first) {
				callback(/* @__PURE__ */ new Error("No Discord DNS addresses resolved"), "", 4);
				return;
			}
			callback(null, first.address, first.family);
		});
	};
}
function createDiscordEndpointDnsLookup(endpointHostname) {
	const normalizedEndpointHostname = normalizeLowercaseStringOrEmpty(endpointHostname);
	if (!normalizedEndpointHostname) throw new Error("Discord endpoint Gateway hostname is required");
	const policy = {
		allowedHostnames: [normalizedEndpointHostname],
		hostnameAllowlist: [normalizedEndpointHostname]
	};
	return (hostname, options, callback) => {
		resolvePinnedHostnameWithPolicy(hostname, { policy }).then((pinned) => pinned.lookup(pinned.hostname, options, callback), (error) => {
			callback(error instanceof Error ? error : new Error(String(error)), "", 4);
		});
	};
}
// extensions/discord/src/monitor/rest-fetch.ts
const discordDnsLookup$1 = createDiscordDnsLookup();
function createDiscordRestFetchWithDispatcher(dispatcher) {
	return wrapFetchWithAbortSignal(((input, init) => fetchWithRuntimeDispatcher(input, {
		...init,
		dispatcher
	}).then((response) => {
		captureHttpExchangeAsync({
			url: resolveRequestUrl(input),
			method: init?.method ?? "GET",
			requestHeaders: init?.headers,
			requestBody: init?.body ?? null,
			response,
			flowId: randomUUID(),
			meta: { subsystem: "discord-rest" }
		}).catch(() => {});
		return response;
	})));
}
function resolveDiscordRestFetch(proxyUrl, runtime) {
	const effectiveProxyUrl = resolveEffectiveDebugProxyUrl(proxyUrl);
	if (effectiveProxyUrl) {
		const fetcher = withValidatedDiscordProxy(effectiveProxyUrl, runtime, (proxy) => createDiscordRestFetchWithDispatcher(createHttp1ProxyAgent({ uri: proxy })));
		if (!fetcher) return fetch;
		runtime.log?.("discord: rest proxy enabled");
		return fetcher;
	}
	let dispatcher;
	const envProxyOptions = resolveEnvHttpProxyAgentOptions();
	if (envProxyOptions) try {
		dispatcher = createHttp1EnvHttpProxyAgent({
			...envProxyOptions,
			connect: { lookup: discordDnsLookup$1 }
		});
	} catch (err) {
		runtime.error?.(danger(`discord: env proxy unavailable for REST fetch; using direct dispatcher: ${formatErrorMessage(err)}`));
	}
	return createDiscordRestFetchWithDispatcher(dispatcher ?? createHttp1Agent({ connect: { lookup: discordDnsLookup$1 } }));
}
// extensions/discord/src/monitor/live-policy.ts
/** One reader belongs to one admitted account; transport and lifetime remain its startup owners. */
function createDiscordLivePolicyReader(params) {
	const readConfig = params.readConfig ?? createRuntimeConfigReader(params.cfg);
	const runtime = params.runtime ?? createNonExitingRuntime();
	const startupConfig = params.discordConfig ?? mergeDiscordAccountConfig(params.cfg, params.accountId);
	const token = params.token ?? resolveDiscordToken(params.cfg, { accountId: params.accountId }).token;
	const fetcher = params.discordRestFetch ?? resolveDiscordRestFetch(startupConfig.proxy, runtime);
	const startupPolicy = selectDiscordLivePolicyConfig(startupConfig);
	const authoredPolicyRevision = (cfg) => JSON.stringify({
		policy: selectDiscordLivePolicyConfig(mergeDiscordAccountConfig(cfg, params.accountId)),
		defaultGroupPolicy: cfg.channels?.defaults?.groupPolicy
	});
	const initialAuthoredPolicyRevision = authoredPolicyRevision(params.cfg);
	let initialPolicyActive = true;
	let cachedConfig;
	let cachedPolicy;
	let resolutionKey = JSON.stringify({
		guildEntries: startupPolicy.guilds,
		allowFrom: startupConfig.allowFrom ?? resolveDiscordAccountAllowFrom(params),
		allowNameMatching: isDangerousNameMatchingEnabled(startupConfig)
	});
	let resolution = params.resolvedAllowlist ? Promise.resolve(params.resolvedAllowlist) : void 0;
	return async () => {
		for (;;) {
			params.abortSignal?.throwIfAborted();
			const cfg = readConfig();
			if (cfg === cachedConfig && cachedPolicy) return cachedPolicy;
			const authoredRevision = authoredPolicyRevision(cfg);
			if (initialPolicyActive && authoredRevision !== initialAuthoredPolicyRevision) {
				initialPolicyActive = false;
				cachedConfig = void 0;
			}
			const useInitialPolicy = initialPolicyActive;
			const merged = useInitialPolicy ? startupConfig : mergeDiscordAccountConfig(cfg, params.accountId);
			const discordConfig = {
				...startupConfig,
				...selectDiscordLivePolicyConfig(merged)
			};
			const allowFrom = (useInitialPolicy ? startupConfig.allowFrom : void 0) ?? resolveDiscordAccountAllowFrom({
				cfg,
				accountId: params.accountId
			});
			const key = JSON.stringify({
				guildEntries: discordConfig.guilds,
				allowFrom,
				allowNameMatching: isDangerousNameMatchingEnabled(discordConfig)
			});
			if (!resolution || key !== resolutionKey) {
				resolutionKey = key;
				resolution = resolveDiscordAllowlistConfig({
					accountId: params.accountId,
					token,
					guildEntries: discordConfig.guilds,
					allowFrom,
					discordConfig,
					fetcher,
					runtime
				});
			}
			const resolved = await resolution;
			params.abortSignal?.throwIfAborted();
			if (cfg !== readConfig() || useInitialPolicy !== initialPolicyActive) continue;
			const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
				providerConfigPresent: cfg.channels?.discord !== void 0,
				groupPolicy: discordConfig.groupPolicy,
				defaultGroupPolicy: cfg.channels?.defaults?.groupPolicy
			});
			cachedConfig = cfg;
			cachedPolicy = {
				isCurrent: () => {
					if (params.abortSignal?.aborted || useInitialPolicy !== initialPolicyActive) return false;
					const currentConfig = readConfig();
					return cfg === currentConfig || authoredRevision === authoredPolicyRevision(currentConfig);
				},
				accountId: params.accountId,
				cfg,
				discordConfig: {
					...discordConfig,
					groupPolicy,
					guilds: resolved.guildEntries
				},
				guildEntries: resolved.guildEntries,
				allowFrom: resolved.allowFrom ?? [],
				dmPolicy: (useInitialPolicy ? startupConfig.dmPolicy : void 0) ?? resolveDiscordAccountDmPolicy({
					cfg,
					accountId: params.accountId
				}) ?? "pairing",
				groupPolicy,
				dmEnabled: discordConfig.dm?.enabled ?? true,
				groupDmEnabled: discordConfig.dm?.groupEnabled ?? false,
				groupDmChannels: discordConfig.dm?.groupChannels ?? [],
				allowNameMatching: isDangerousNameMatchingEnabled(discordConfig)
			};
			return cachedPolicy;
		}
	};
}
// extensions/discord/src/monitor/dm-command-decision.ts
async function handleDiscordDmCommandDecision(params) {
	if (params.senderAccess.decision === "pairing") {
		const result = await createChannelPairingChallengeIssuer({
			channel: "discord",
			accountId: params.accountId,
			upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
				channel: "discord",
				id,
				accountId: params.accountId,
				meta
			})
		})({
			senderId: params.sender.id,
			senderIdLine: `Your Discord user id: ${params.sender.id}`,
			meta: {
				tag: params.sender.tag,
				name: params.sender.name
			},
			sendPairingReply: async () => {}
		});
		if (result.created && result.code) await params.onPairingCreated(result.code);
		return;
	}
	await params.onUnauthorized();
}
// extensions/discord/src/monitor/live-policy-interaction.ts
const INTERACTION_POLICY_WAIT_MS = 1e3;
async function readDiscordInteractionPolicy(readPolicy) {
	const timeout = /* @__PURE__ */ new Error("Discord interaction access policy resolution timed out");
	try {
		return await withTimeout(readPolicy(), INTERACTION_POLICY_WAIT_MS, { createError: () => timeout });
	} catch (error) {
		if (error !== timeout) throw error;
		return null;
	}
}
// extensions/discord/src/monitor/native-command-reply.ts
const DISCORD_EMPTY_VISIBLE_REPLY_WARNING = "⚠️ Command produced no visible reply.";
/** Retain visible component text, not interaction IDs or option values. */
function formatDiscordCommandComponents(components) {
	const text = [];
	const visit = (value) => {
		if (!value || typeof value !== "object") return;
		for (const [key, field] of Object.entries(value)) if ((key === "content" || key === "label" || key === "description" || key === "placeholder") && typeof field === "string") text.push(field);
		else if ((key === "components" || key === "options") && Array.isArray(field)) field.forEach(visit);
		else if (key === "accessory") visit(field);
	};
	components.forEach((component) => visit("serialize" in component ? component.serialize() : component));
	return text.join("\n");
}
function resolveDiscordInteractionReplyOptions(params) {
	return {
		textLimit: resolveTextChunkLimit(params.cfg, "discord", params.accountId, { fallbackLimit: 2e3 }),
		maxLinesPerMessage: resolveDiscordMaxLinesPerMessage(params),
		chunkMode: resolveChunkMode(params.cfg, "discord", params.accountId),
		mediaAccess: resolveOutboundMediaAccessForConfig(params.cfg)
	};
}
function isDiscordUnknownInteraction(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	if (err.discordCode === 10062 || err.rawBody?.code === 10062) return true;
	if (err.status === 404 && /Unknown interaction/i.test(err.message ?? "")) return true;
	return /Unknown interaction/i.test(err.rawBody?.message ?? "");
}
function resolveDiscordInteractionMessageParts(payload) {
	const { components, embeds } = payload.channelData?.discord ?? {};
	return {
		components: Array.isArray(components) && components.length > 0 ? components : void 0,
		embeds: Array.isArray(embeds) && embeds.length > 0 ? embeds : void 0
	};
}
function hasRenderableReplyPayload(payload) {
	const { components, embeds } = resolveDiscordInteractionMessageParts(payload);
	return hasOutboundReplyContent(payload) || Boolean(components || embeds);
}
async function safeDiscordInteractionCall(label, fn) {
	try {
		return await fn();
	} catch (error) {
		if (isDiscordUnknownInteraction(error)) {
			logVerbose(`discord: ${label} skipped (interaction expired)`);
			return null;
		}
		throw error;
	}
}
async function settleDiscordInteractionWithoutVisibleReply(interaction) {
	if (interaction.responseState !== "deferred") return;
	await safeDiscordInteractionCall("interaction delete deferred reply", () => interaction.deleteReply());
}
async function deliverDiscordInteractionReply(params) {
	const { interaction, textLimit, maxLinesPerMessage, chunkMode } = params;
	const nativeParts = resolveDiscordInteractionMessageParts(params.payload);
	const preserveNativeParts = resolveSendableOutboundReplyParts(params.payload).hasMedia || Boolean(nativeParts.components || nativeParts.embeds);
	const payload = await renderPresentationForDelivery({
		presentationCapabilities: DISCORD_PRESENTATION_CAPABILITIES,
		renderPresentation: (adapted) => preserveNativeParts ? null : buildDiscordPresentationPayload({
			payload: adapted,
			presentation: adapted.presentation
		})
	}, params.payload);
	const componentSpec = preserveNativeParts ? void 0 : await resolveDiscordComponentSpec(payload);
	const componentBuild = componentSpec ? buildDiscordComponentMessage({
		spec: componentSpec,
		...params.componentRoute
	}) : void 0;
	const reply = resolveSendableOutboundReplyParts(payload);
	const messageParts = resolveDiscordInteractionMessageParts(payload);
	const firstMessageComponents = componentBuild?.components ?? messageParts.components;
	const firstMessageEmbeds = messageParts.embeds;
	const hasFirstMessageParts = Boolean(firstMessageComponents || firstMessageEmbeds);
	let payloadDelivered = false;
	const deliveredText = params.onDelivered ? [] : void 0;
	const sendMessage = async (content, files) => {
		const firstMessage = !payloadDelivered;
		const components = firstMessage ? firstMessageComponents : void 0;
		const embeds = firstMessage ? firstMessageEmbeds : void 0;
		const hasV2 = hasDiscordV2Components(components);
		const payloadLocal = {
			...content && !hasV2 ? { content } : {},
			...components ? { components } : {},
			...embeds && !hasV2 ? { embeds } : {},
			...params.responseEphemeral !== void 0 ? { ephemeral: params.responseEphemeral } : {},
			...files?.length ? { files } : {}
		};
		try {
			if (await safeDiscordInteractionCall("interaction send", async () => {
				const sent = await interaction.followUp(payloadLocal);
				payloadDelivered = true;
				if (firstMessage && componentBuild) {
					const messageId = sent && typeof sent === "object" && "id" in sent && typeof sent.id === "string" ? sent.id : void 0;
					await registerDiscordComponentEntries({
						entries: componentBuild.entries,
						modals: componentBuild.modals,
						messageId
					});
				}
			}) === null) throw new PlatformMessageNotDispatchedError("Discord interaction expired before message dispatch", { cause: /* @__PURE__ */ new Error("Unknown interaction") });
			if (deliveredText) {
				if (payloadLocal.content) deliveredText.push(payloadLocal.content);
				if (payloadLocal.components) deliveredText.push(formatDiscordCommandComponents(payloadLocal.components));
				for (const embed of payloadLocal.embeds ?? []) deliveredText.push([
					embed.title,
					embed.description,
					embed.author?.name,
					...(embed.fields ?? []).flatMap((field) => [field.name, field.value]),
					embed.footer?.text
				].filter(Boolean).join("\n"));
			}
		} catch (error) {
			if (!payloadDelivered) throw error;
			throw createChannelPartialDeliveryError(error, { visibleReplySent: true });
		}
	};
	const mediaFailures = [];
	const files = (await Promise.all(reply.mediaUrls.map(async (url, index) => {
		try {
			const loaded = await loadWebMedia(url, {
				localRoots: params.mediaLocalRoots,
				ssrfPolicy: buildOutboundMediaLoadOptions({ mediaAccess: params.mediaAccess }).ssrfPolicy
			});
			return {
				name: loaded.fileName ?? "upload",
				data: loaded.buffer,
				contentType: loaded.contentType
			};
		} catch (error) {
			if (!(error instanceof MediaFetchError || error instanceof LocalMediaAccessError)) throw error;
			logVerbose(`discord: interaction media not attached: ${String(error)}`);
			mediaFailures[index] = {
				code: "delivery-failed",
				kind: "document",
				label: (URL.canParse(url) ? new URL(url).pathname : url).split(/[\\/]/).findLast(Boolean) ?? `Attachment ${index + 1}`
			};
			return;
		}
	}))).filter((file) => file !== void 0);
	const text = appendReplyMediaFailures(reply.text, mediaFailures.filter(Boolean)) ?? "";
	if (files.length === 0 && !text.trim() && !hasFirstMessageParts) return false;
	const chunks = resolveTextChunksWithFallback(text, chunkDiscordTextWithMode(text, {
		maxChars: textLimit,
		maxLines: maxLinesPerMessage,
		chunkMode
	}));
	if (chunks.length === 0) chunks.push("");
	for (const [index, chunk] of chunks.entries()) {
		const chunkFiles = index === 0 && files.length > 0 ? files : void 0;
		if (!chunk.trim() && !chunkFiles && (payloadDelivered || !hasFirstMessageParts)) continue;
		await sendMessage(chunk, chunkFiles);
	}
	if (payloadDelivered && params.onDelivered) await params.onDelivered(deliveredText?.filter(Boolean).join("\n") ?? "");
	return payloadDelivered;
}
// extensions/discord/src/monitor/native-command-agent-reply.ts
async function dispatchDiscordNativeAgentReply(params) {
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.discordConfig);
	let didReply = false;
	let finalReplyOutcome;
	let hiddenFinalReply;
	const turnResult = await dispatchChannelInboundTurn({
		assertAuthority: params.assertAuthority,
		cfg: params.cfg,
		channel: "discord",
		accountId: params.effectiveRoute.accountId,
		route: {
			agentId: params.effectiveRoute.agentId,
			sessionKey: params.ctxPayload.SessionKey ?? params.effectiveRoute.sessionKey
		},
		ctxPayload: params.ctxPayload,
		dispatchReplyFromConfig: params.dispatchReplyFromConfig,
		delivery: {
			deliver: async (payload) => {
				if (params.suppressReplies) return {
					visibleReplySent: false,
					suppression: { reason: "channel_transform" }
				};
				const payloadDelivered = await deliverDiscordInteractionReply({
					interaction: params.interaction,
					payload,
					componentRoute: {
						accountId: params.effectiveRoute.accountId,
						agentId: params.effectiveRoute.agentId,
						sessionKey: params.ctxPayload.CommandTargetSessionKey ?? params.effectiveRoute.sessionKey
					},
					mediaLocalRoots: params.mediaLocalRoots,
					...resolveDiscordInteractionReplyOptions(params),
					responseEphemeral: params.responseEphemeral
				});
				didReply ||= payloadDelivered;
				return payloadDelivered ? { visibleReplySent: true } : {
					visibleReplySent: false,
					suppression: { reason: "no_visible_result" }
				};
			},
			onDelivered: (payload, info, result) => {
				if (params.suppressReplies && info.kind === "final" && result?.suppression?.reason === "channel_transform" && payload.text?.trim()) hiddenFinalReply = payload;
				if (info.kind === "final" && result?.visibleReplySent !== void 0 && (result.visibleReplySent || finalReplyOutcome !== "failed")) finalReplyOutcome = result.visibleReplySent ? "accepted" : "suppressed";
			},
			onError: (err, info) => {
				const partialDelivery = isChannelPartialDeliveryError(err);
				if (partialDelivery) {
					didReply = true;
					logVerbose("discord: interaction reply partially delivered before expiry");
				}
				if (info.kind === "final") finalReplyOutcome = partialDelivery ? "accepted" : "failed";
				const message = err instanceof Error ? err.stack ?? err.message : String(err);
				params.log.error(`discord slash ${info.kind} reply failed: ${message}`);
			}
		},
		replyPipeline: {},
		dispatcherOptions: { humanDelay: resolveHumanDelayConfig(params.cfg, params.effectiveRoute.agentId) },
		replyOptions: {
			skillFilter: params.channelConfig?.skills,
			[PLUGIN_COMMAND_DISPATCH]: params.pluginCommandDispatch,
			disableBlockStreaming: typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : void 0
		}
	});
	const shouldSettleWithoutVisibleReply = params.suppressReplies || finalReplyOutcome === "suppressed" || turnResult.dispatched && (turnResult.dispatchResult.deliberateSilentTerminalReply === true || turnResult.dispatchResult.deferredToActiveRun !== void 0);
	const dispatchResult = {
		dispatched: turnResult.dispatched,
		...hiddenFinalReply ? { hiddenFinalReply } : {}
	};
	if (!didReply && shouldSettleWithoutVisibleReply) await settleDiscordInteractionWithoutVisibleReply(params.interaction);
	else if (!didReply && !(turnResult.dispatched && hasVisibleInboundReplyDispatch(turnResult.dispatchResult))) await safeDiscordInteractionCall("interaction empty fallback", () => params.interaction.followUp({
		content: DISCORD_EMPTY_VISIBLE_REPLY_WARNING,
		ephemeral: true
	}));
	return dispatchResult;
}
// extensions/discord/src/monitor/commands.ts
function resolveDiscordSlashCommandConfig(raw) {
	return { ephemeral: raw?.ephemeral !== false };
}
// extensions/discord/src/monitor/native-command-arg-ui.ts
const DISCORD_COMMAND_ARG_CUSTOM_ID_KEY = "cmdarg";
function parseDiscordCommandArgData(data) {
	if (!data || typeof data !== "object") return null;
	const coerce = (value) => typeof value === "string" || typeof value === "number" ? String(value) : "";
	const rawCommand = coerce(data.command);
	const rawArg = coerce(data.arg);
	const rawValue = coerce(data.value);
	const rawUser = coerce(data.user);
	if (!rawCommand || !rawArg || !rawValue || !rawUser) return null;
	return {
		command: decodeCustomIdComponent(rawCommand),
		arg: decodeCustomIdComponent(rawArg),
		value: decodeCustomIdComponent(rawValue),
		userId: decodeCustomIdComponent(rawUser)
	};
}
function buildDiscordCommandArgMenu(params) {
	const { command, menu, userId } = params;
	const commandLabel = command.nativeName ?? command.key;
	const rows = chunkItems(menu.choices, 4).map((choices) => {
		const buttons = choices.map((choice) => {
			const label = choice.label;
			const arg = menu.arg.name;
			const value = choice.value;
			return {
				type: ComponentType.Button,
				label,
				custom_id: [
					`${DISCORD_COMMAND_ARG_CUSTOM_ID_KEY}:command=${encodeCustomIdComponent(commandLabel)}`,
					`arg=${encodeCustomIdComponent(arg)}`,
					`value=${encodeCustomIdComponent(value)}`,
					`user=${encodeCustomIdComponent(userId)}`
				].join(";"),
				style: ButtonStyle.Secondary
			};
		});
		return {
			type: ComponentType.ActionRow,
			components: buttons
		};
	});
	return {
		content: formatCommandArgMenuTitle({
			command,
			menu
		}),
		components: rows
	};
}
function createDiscordCommandArgFallbackButton$1(params) {
	return {
		type: ComponentType.Button,
		customId: "cmdarg:seed=1",
		async run(interaction, data) {
			const { ctx, safeInteractionCall, dispatchCommandInteraction } = params;
			const clearWithMessage = async (content) => await safeInteractionCall("command arg update", () => interaction.update({
				content,
				components: []
			}));
			const parsed = parseDiscordCommandArgData(data);
			if (!parsed) {
				await clearWithMessage("Sorry, that selection is no longer available.");
				return;
			}
			if (interaction.user?.id && interaction.user.id !== parsed.userId) {
				await safeInteractionCall("command arg ack", () => interaction.acknowledge());
				return;
			}
			const commandDefinition = findCommandByNativeName$1(parsed.command, "discord") ?? listChatCommands().find((entry) => entry.key === parsed.command);
			if (!commandDefinition) {
				await clearWithMessage("Sorry, that command is no longer available.");
				return;
			}
			if (await clearWithMessage(`⏳ Applying ${parsed.value}...`) === null) return;
			const commandArgs = { values: { [parsed.arg]: parsed.value } };
			const commandArgsWithRaw = {
				...commandArgs,
				raw: serializeCommandArgs$1(commandDefinition, commandArgs)
			};
			const prompt = buildCommandTextFromArgs$1(commandDefinition, commandArgsWithRaw);
			await dispatchCommandInteraction({
				...ctx,
				interaction,
				prompt,
				command: commandDefinition,
				commandArgs: commandArgsWithRaw,
				responseEphemeral: resolveDiscordSlashCommandConfig(ctx.discordConfig?.slashCommand).ephemeral,
				pluginCommandDispatch: { kind: "non-plugin" }
			});
		}
	};
}
// extensions/discord/src/monitor/inbound-context.ts
function createDiscordSupplementalContextAccessChecker(params) {
	const userAllowList = params.channelConfig?.users ?? params.guildInfo?.users ?? [];
	const roleAllowList = params.channelConfig?.roles ?? params.guildInfo?.roles ?? [];
	const allowFrom = [...userAllowList, ...roleAllowList];
	return (sender) => resolveInboundSupplementalSenderAllowed({
		isGroup: params.isGuild,
		groupPolicy: allowFrom.length === 0 ? "open" : "allowlist",
		allowFrom,
		isSenderAllowed: () => resolveDiscordMemberAllowed({
			userAllowList,
			roleAllowList,
			memberRoleIds: [...sender.memberRoleIds ?? []],
			userId: sender.id ?? "",
			userName: sender.name,
			userTag: sender.tag,
			allowNameMatching: params.allowNameMatching
		})
	});
}
function buildDiscordGroupSystemPrompt(channelConfig) {
	return channelConfig?.systemPrompt?.trim() || void 0;
}
function buildDiscordChannelStructuredContext(params) {
	if (!params.isGuild || typeof params.channelTopic !== "string" || !params.channelTopic.trim()) return;
	return [{
		label: "Discord channel metadata",
		source: "discord",
		type: "channel_metadata",
		payload: { topic: params.channelTopic.trim() }
	}];
}
function buildDiscordInboundAccessContext(params) {
	return {
		toolPolicy: params.isGuild && params.channelConfig?.matchSource === "parent" ? resolveDiscordGroupToolPolicy({
			cfg: params.cfg,
			accountId: params.accountId,
			groupId: params.parentId,
			groupChannel: params.channelConfig?.matchKey,
			groupSpace: params.guildInfo?.id ?? params.guildInfo?.slug,
			senderId: params.sender.id,
			senderName: params.senderName ?? params.sender.name,
			senderUsername: params.senderUsername ?? params.sender.name
		}) : void 0,
		groupSystemPrompt: params.isGuild ? buildDiscordGroupSystemPrompt(params.channelConfig) : void 0,
		channelStructuredContext: buildDiscordChannelStructuredContext(params),
		ownerAllowFrom: resolveDiscordOwnerAllowFrom(params)
	};
}
// extensions/discord/src/monitor/native-command-context.ts
async function buildDiscordNativeInteractionContext(params) {
	const { interaction, route, boundSessionKey, sessionPrefix, channelContext, ...context } = params;
	const targets = resolveNativeCommandSessionTargets({
		agentId: route.agentId,
		sessionPrefix,
		userId: context.user.id,
		targetSessionKey: route.sessionKey,
		boundSessionKey
	});
	const agentId = route.agentId;
	const accountId = route.accountId;
	const interactionId = interaction.rawData.id;
	const channelId = channelContext.rawChannelId || "unknown";
	const threadParentId = channelContext.threadParentId;
	const memberRoleIds = channelContext.memberRoleIds;
	const guildId = interaction.guild?.id;
	const guildName = interaction.guild?.name;
	const channelTopic = resolveDiscordChannelTopicSafe(interaction.channel);
	const isGuild = Boolean(interaction.guild);
	const isDirectMessage = channelContext.isDirectMessage;
	const isGroupDm = channelContext.isGroupDm;
	const isThreadChannel = channelContext.isThreadChannel;
	const conversationLabel = isDirectMessage ? context.user.globalName ?? context.user.username : channelId;
	const { groupSystemPrompt, ownerAllowFrom, channelStructuredContext, toolPolicy } = buildDiscordInboundAccessContext({
		...context,
		accountId,
		parentId: threadParentId,
		channelTopic,
		isGuild,
		senderName: context.user.globalName ?? context.user.username,
		senderUsername: context.user.username
	});
	const conversation = {
		kind: isDirectMessage ? "direct" : isGroupDm ? "group" : "channel",
		id: channelId,
		parentId: isThreadChannel ? threadParentId : void 0,
		threadId: isThreadChannel ? channelId : void 0
	};
	const allowFrom = context.commandAuthorized ? [`user:${context.user.id}`] : [];
	const channelIngress = await getDiscordRuntime().channel.inbound.ingress.createResolver({
		channelId: "discord",
		accountId,
		identity: discordIngressIdentity,
		useDefaultPairingStore: false
	}).command({
		subject: {
			stableId: context.user.id,
			aliases: { participantKind: "user" }
		},
		conversation,
		contextBinding: {
			agentId,
			sessionKey: targets.sessionKey,
			nativeChannelId: channelId,
			messageId: interactionId,
			inboundEventKind: "user_request"
		},
		event: {
			kind: "native-command",
			mayPair: false
		},
		dmPolicy: "allowlist",
		groupPolicy: "allowlist",
		allowFrom,
		groupAllowFrom: allowFrom,
		command: { modeWhenAccessGroupsOff: "configured" }
	});
	return {
		ctxPayload: await (context.buildContext ?? buildChannelInboundEventContext)({
			channel: "discord",
			channelIngress,
			accountId,
			messageId: interactionId,
			timestamp: Date.now(),
			from: isDirectMessage ? `discord:${context.user.id}` : isGroupDm ? `discord:group:${channelId}` : `discord:channel:${channelId}`,
			sender: {
				id: context.user.id,
				name: context.user.globalName ?? context.user.username,
				username: context.user.username,
				tag: context.sender.tag,
				roles: memberRoleIds
			},
			conversation: {
				...conversation,
				nativeChannelId: channelId,
				routePeer: buildDiscordRoutePeer({
					isDirectMessage,
					isGroupDm,
					directUserId: context.user.id,
					conversationId: channelId
				}),
				label: conversationLabel,
				spaceId: isGuild ? context.guildInfo?.id ?? context.guildInfo?.slug ?? guildId : void 0
			},
			route: {
				agentId,
				accountId,
				routeSessionKey: targets.commandTargetSessionKey,
				dispatchSessionKey: targets.sessionKey
			},
			reply: {
				to: `slash:${context.user.id}`,
				originatingTo: resolveDiscordConversationIdentity({
					isDirectMessage,
					userId: context.user.id,
					channelId
				}) ?? (isDirectMessage ? `user:${context.user.id}` : `channel:${channelId}`)
			},
			message: { rawBody: context.prompt },
			access: {
				toolPolicy,
				mentions: {
					canDetectMention: true,
					wasMentioned: true
				},
				commands: { authorized: context.commandAuthorized }
			},
			commandTurn: {
				kind: "native",
				source: "native",
				authorized: context.commandAuthorized,
				body: context.prompt
			},
			supplemental: { groupSystemPrompt },
			extra: {
				CommandArgs: context.commandArgs,
				CommandTargetSessionKey: targets.commandTargetSessionKey,
				CommandSource: "native",
				GroupSubject: isGuild ? guildName : void 0,
				ChannelStructuredContext: channelStructuredContext,
				OwnerAllowFrom: ownerAllowFrom
			}
		}),
		...targets
	};
}
// extensions/discord/src/monitor/native-command-route.ts
function resolveDiscordNativeInteractionRouteState(params) {
	const { channelContext, interaction } = params;
	const conversationId = params.conversationId ?? channelContext.rawChannelId;
	const threadBinding = channelContext.isThreadChannel ? params.threadBindings?.getByThreadId(channelContext.rawChannelId) : void 0;
	const route = resolveDiscordConversationRoute({
		cfg: params.cfg,
		accountId: params.accountId,
		guildId: interaction.guild?.id,
		memberRoleIds: channelContext.memberRoleIds,
		peer: buildDiscordRoutePeer({
			isDirectMessage: channelContext.isDirectMessage,
			isGroupDm: channelContext.isGroupDm,
			directUserId: interaction.user?.id ?? channelContext.rawChannelId,
			conversationId
		}),
		parentConversationId: channelContext.threadParentId
	});
	const configuredRoute = threadBinding == null ? resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId,
			parentConversationId: channelContext.threadParentId
		}
	}) : null;
	const configuredBinding = configuredRoute?.bindingResolution ?? null;
	const configuredBoundSessionKey = normalizeOptionalString(configuredRoute?.boundSessionKey);
	const boundSessionKey = normalizeOptionalString(threadBinding?.targetSessionKey) ?? configuredBoundSessionKey;
	return {
		effectiveRoute: resolveDiscordEffectiveRoute({
			route,
			boundSessionKey,
			configuredRoute,
			matchedBy: configuredBinding ? "binding.channel" : void 0
		}),
		boundSessionKey,
		configuredBinding
	};
}
// extensions/discord/src/monitor/native-interaction-channel-context.ts
async function resolveDiscordNativeInteractionChannelContext(interaction, channelIdFallback) {
	const { channel, client, guild, rawData } = interaction;
	const hasGuild = Boolean(guild);
	const channelContext = await resolveDiscordThreadLikeChannelContext({
		client,
		channel,
		channelIdFallback: rawData.channel_id ?? channelIdFallback
	});
	const channelType = channelContext.channelType;
	return {
		isDirectMessage: channelType === discord_exports.ChannelType.DM,
		isGroupDm: channelType === discord_exports.ChannelType.GroupDM,
		isThreadChannel: channelContext.isThreadChannel,
		channelName: channelContext.channelName,
		channelSlug: channelContext.channelSlug,
		rawChannelId: channelContext.channelId,
		memberRoleIds: interaction.rawData.member?.roles ?? [],
		threadParentId: hasGuild ? channelContext.threadParentId : void 0,
		threadParentName: hasGuild ? channelContext.threadParentName : void 0,
		threadParentSlug: hasGuild ? channelContext.threadParentSlug : ""
	};
}
// extensions/discord/src/monitor/native-command-auth.ts
function resolveDiscordNativePolicyReader(params) {
	return params.readPolicy ?? createDiscordLivePolicyReader({
		...params,
		readConfig: () => getRuntimeConfigSnapshot() ?? params.cfg,
		resolvedAllowlist: {
			guildEntries: params.discordConfig?.guilds,
			allowFrom: params.discordConfig?.allowFrom ?? resolveDiscordAccountAllowFrom(params)
		}
	});
}
async function createDiscordNativeCommandAuthority(params) {
	const assertAdmittedOwner = (await resolveCommandAuthorizationAsync(params)).assertOwnerCurrent;
	const readAuthorization = () => {
		const cfg = getRuntimeConfigSnapshot() ?? params.cfg;
		const owners = resolveDiscordCommandOwnerAllowFrom(cfg);
		const senderIsOwner = params.isPolicyCurrent?.() !== false && (resolveDiscordOwnerAccess({
			allowFrom: owners,
			sender: params.sender,
			allowNameMatching: params.allowNameMatching
		}).ownerAllowed || resolveCommandAuthorization({
			...params,
			cfg
		}).senderIsOwner);
		const commands = resolveDiscordNativeCommandAllowlistAccess({
			cfg,
			sender: params.sender,
			guildId: params.guildId
		});
		return {
			senderIsOwner,
			allowed: (!commands.configured || commands.allowed) && (!owners || owners.includes("*") || senderIsOwner || commands.allowed || params.commandName === "status" || params.pluginCommand)
		};
	};
	const assertActive = () => {
		assertAdmittedOwner?.();
		if (params.isPolicyCurrent?.() === false || !readAuthorization().allowed) throw new Error("Discord command authority changed; send a new request.");
	};
	return {
		assertActive,
		assertOwnerCurrent: () => {
			assertActive();
			if (!readAuthorization().senderIsOwner) throw new Error("Discord owner authority changed; send a new request.");
		},
		senderIsOwner: () => readAuthorization().senderIsOwner,
		isAllowed: () => {
			try {
				assertActive();
				return true;
			} catch {
				return false;
			}
		}
	};
}
function resolveDiscordNativeCommandAllowlistAccess(params) {
	const commandsAllowFrom = params.cfg.commands?.allowFrom;
	if (!commandsAllowFrom || typeof commandsAllowFrom !== "object") return {
		configured: false,
		allowed: false
	};
	const rawAllowList = Array.isArray(commandsAllowFrom.discord) ? commandsAllowFrom.discord : commandsAllowFrom["*"];
	if (!Array.isArray(rawAllowList)) return {
		configured: false,
		allowed: false
	};
	const guildId = normalizeOptionalString(params.guildId);
	if (guildId) for (const entry of rawAllowList) {
		const text = normalizeOptionalString(String(entry)) ?? "";
		if (text.startsWith("guild:") && text.slice(6) === guildId) return {
			configured: true,
			allowed: true
		};
	}
	const allowList = normalizeDiscordAllowList(rawAllowList.map(String), [
		"discord:",
		"user:",
		"pk:"
	]);
	if (!allowList) return {
		configured: true,
		allowed: false
	};
	return {
		configured: true,
		allowed: resolveDiscordAllowListMatch({
			allowList,
			candidate: params.sender,
			allowNameMatching: false
		}).allowed
	};
}
function resolveDiscordNativeCommandAccessContext(params) {
	const allowNameMatching = isDangerousNameMatchingEnabled(params.discordConfig);
	const configuredDmAllowFrom = resolveDiscordAccountAllowFrom(params) ?? [];
	const ownerAccess = resolveDiscordOwnerAccess({
		allowFrom: configuredDmAllowFrom,
		sender: params.sender,
		allowNameMatching
	});
	const guild = params.guild ?? null;
	const commandsAllowFromAccess = resolveDiscordNativeCommandAllowlistAccess({
		cfg: params.cfg,
		sender: params.sender,
		guildId: guild?.id
	});
	const guildInfo = resolveDiscordGuildEntry({
		guild: guild ?? void 0,
		guildId: guild?.id,
		guildEntries: params.discordConfig?.guilds
	});
	const channelConfig = guild ? resolveDiscordChannelConfigWithFallback({
		guildInfo,
		channelId: params.rawChannelId,
		channelName: params.channelName,
		channelSlug: params.channelSlug,
		parentId: params.threadParentId,
		parentName: params.threadParentName,
		parentSlug: params.threadParentSlug,
		scope: params.isThreadChannel ? "thread" : "channel"
	}) : null;
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.discord !== void 0,
		groupPolicy: params.discordConfig?.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	const policyAuthorizer = resolveDiscordChannelPolicyCommandAuthorizer({
		groupPolicy,
		guildInfo,
		channelConfig
	});
	const channelDenial = channelConfig?.enabled === false ? "disabled" : guild && (channelConfig?.allowed === false || !policyAuthorizer.allowed) ? "not-allowed" : void 0;
	return {
		allowNameMatching,
		configuredDmAllowFrom,
		...ownerAccess,
		commandsAllowFromAccess,
		guildInfo,
		channelConfig,
		policyAuthorizer,
		channelDenial
	};
}
async function resolveDiscordGuildNativeCommandAuthorized(params) {
	const { policyAuthorizer } = params;
	if (!policyAuthorizer.allowed) return false;
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState(params);
	const ownerAuthorizer = {
		configured: params.ownerAllowListConfigured,
		allowed: params.ownerAllowed
	};
	const memberAuthorizer = {
		configured: hasAccessRestrictions,
		allowed: memberAllowed
	};
	const hasStricterAccessRestrictions = ownerAuthorizer.configured || memberAuthorizer.configured;
	const fallbackAuthorizers = [
		{
			configured: policyAuthorizer.configured && !hasStricterAccessRestrictions,
			allowed: policyAuthorizer.allowed
		},
		ownerAuthorizer,
		memberAuthorizer
	];
	const authorizers = params.commandsAllowFromAccess.configured ? [params.commandsAllowFromAccess] : fallbackAuthorizers;
	return resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups: true,
		authorizers,
		modeWhenAccessGroupsOff: "configured"
	});
}
function resolveDiscordNativeGroupDmAccess(params) {
	if (!params.isGroupDm) return { allowed: true };
	if (params.groupEnabled === false) return {
		allowed: false,
		reason: "disabled"
	};
	if (!resolveGroupDmAllow({
		channels: params.groupChannels,
		channelId: params.channelId,
		channelName: params.channelName,
		channelSlug: params.channelSlug
	})) return {
		allowed: false,
		reason: "not-allowlisted"
	};
	return { allowed: true };
}
async function resolveDiscordNativeAutocompleteAuthorized(params) {
	const { interaction, cfg, discordConfig, accountId } = params;
	const user = interaction.user;
	if (!user) return false;
	const sender = resolveDiscordSenderIdentity({
		author: user,
		pluralkitInfo: null
	});
	const channelContext = await resolveDiscordNativeInteractionChannelContext(interaction, "");
	const { isDirectMessage, isGroupDm, channelName, channelSlug, rawChannelId, memberRoleIds } = channelContext;
	if (params.isPolicyCurrent?.() === false) return false;
	const channelAccess = resolveDiscordNativeCommandAccessContext({
		cfg,
		accountId,
		discordConfig,
		sender,
		...channelContext,
		guild: interaction.guild ?? null
	});
	const { commandsAllowFromAccess, guildInfo, channelConfig } = channelAccess;
	if (channelAccess.channelDenial) return false;
	const dmEnabled = discordConfig?.dm?.enabled ?? true;
	const dmPolicy = resolveDiscordAccountDmPolicy({
		cfg,
		accountId
	}) ?? "pairing";
	if (isDirectMessage) {
		if (!dmEnabled || dmPolicy === "disabled") return false;
		const dmAccess = await resolveDiscordDmCommandAccess({
			accountId,
			dmPolicy,
			configuredAllowFrom: channelAccess.configuredDmAllowFrom,
			sender,
			allowNameMatching: channelAccess.allowNameMatching,
			cfg,
			rest: interaction.client.rest
		});
		if (params.isPolicyCurrent?.() === false || dmAccess.senderAccess.decision !== "allow") return false;
	}
	if (!resolveDiscordNativeGroupDmAccess({
		isGroupDm,
		groupEnabled: discordConfig?.dm?.groupEnabled,
		groupChannels: discordConfig?.dm?.groupChannels,
		channelId: rawChannelId,
		channelName,
		channelSlug
	}).allowed) return false;
	if (!isDirectMessage) {
		if (!await resolveDiscordGuildNativeCommandAuthorized({
			...channelAccess,
			memberRoleIds,
			sender,
			ownerAllowListConfigured: channelAccess.ownerAllowList != null
		})) return false;
	}
	const commandOwnerAllowFrom = resolveDiscordCommandOwnerAllowFrom(cfg);
	if (params.skipCommandOwnerAllowFrom !== true && commandOwnerAllowFrom && !commandOwnerAllowFrom.includes("*") && !commandsAllowFromAccess.allowed && !resolveDiscordOwnerAccess({
		allowFrom: commandOwnerAllowFrom,
		sender,
		allowNameMatching: channelAccess.allowNameMatching
	}).ownerAllowed) {
		const routeState = resolveDiscordNativeInteractionRouteState({
			cfg,
			accountId,
			interaction,
			channelContext,
			threadBindings: params.threadBindings
		});
		const { ctxPayload } = await buildDiscordNativeInteractionContext({
			cfg,
			buildContext: params.buildContext,
			interaction,
			channelContext,
			route: routeState.effectiveRoute,
			boundSessionKey: routeState.boundSessionKey,
			sessionPrefix: params.sessionPrefix ?? "discord:slash",
			channelConfig,
			guildInfo,
			allowNameMatching: channelAccess.allowNameMatching,
			commandAuthorized: true,
			user,
			sender,
			prompt: "",
			commandArgs: {}
		});
		if (!(await resolveCommandAuthorizationAsync({
			ctx: ctxPayload,
			cfg,
			commandAuthorized: true
		})).senderIsOwner) return false;
	}
	return params.isPolicyCurrent?.() !== false;
}
// extensions/discord/src/monitor/native-command-bypass.ts
function shouldBypassConfiguredAcpEnsure(commandName) {
	const command = commandName.trim().toLowerCase();
	return command === "acp" || command === "status";
}
function shouldBypassConfiguredAcpGuildGuards(commandName) {
	const command = commandName.trim().toLowerCase();
	return command === "new" || command === "reset";
}
// extensions/discord/src/monitor/model-picker-preference-primitives.ts
function splitDiscordModelRef(modelRef) {
	const trimmed = modelRef.trim();
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= trimmed.length - 1) return null;
	const provider = trimmed.slice(0, slashIndex).trim();
	const model = trimmed.slice(slashIndex + 1).trim();
	if (!provider || !model) return null;
	return {
		provider,
		model
	};
}
function normalizeModelRef(raw) {
	const parsed = splitDiscordModelRef(raw ?? "");
	const provider = parsed ? normalizeProviderId(parsed.provider) : "";
	return parsed && provider ? `${provider}/${parsed.model}` : null;
}
function hashSegment(value, length) {
	return createHash("sha256").update(value, "utf8").digest("hex").slice(0, length);
}
function buildPreferenceModelKey(scopeKey, modelRef) {
	return `v1:${hashSegment(scopeKey, 32)}:${hashSegment(modelRef, 24)}`;
}
function preferenceTimestampMs(value) {
	const parsed = typeof value === "string" ? Date.parse(value) : NaN;
	return Number.isFinite(parsed) ? parsed : 0;
}
// extensions/discord/src/monitor/model-picker-preferences.ts
const RECENT_LIMIT = 5;
const PREFERENCE_MAX_ENTRIES = 2e3;
let lastPreferenceTimestampMs = 0;
let lastPreferenceOrder = 0;
function openPreferenceStore() {
	return getDiscordRuntime().state.openKeyedStore({
		namespace: "model-picker-preferences",
		maxEntries: PREFERENCE_MAX_ENTRIES
	});
}
function buildDiscordModelPickerPreferenceKey(scope) {
	const userId = normalizeOptionalString(scope.userId);
	if (!userId) return null;
	const accountId = normalizeAccountId(scope.accountId);
	const guildId = normalizeOptionalString(scope.guildId);
	return `discord:${accountId}:${guildId ? `guild:${guildId}` : "dm"}:user:${userId}`;
}
function sanitizeStoredPreferenceEntry(value) {
	if (!value || typeof value !== "object") return;
	const typedValue = value;
	if (typeof typedValue.scopeKey !== "string" || typeof typedValue.modelRef !== "string") return;
	const modelRef = normalizeModelRef(typedValue.modelRef);
	if (!modelRef) return;
	return {
		scopeKey: typedValue.scopeKey,
		modelRef,
		updatedAt: typeof typedValue.updatedAt === "string" ? typedValue.updatedAt : "",
		updatedOrder: typeof typedValue.updatedOrder === "number" && Number.isSafeInteger(typedValue.updatedOrder) ? typedValue.updatedOrder : void 0
	};
}
function timestampOrder(value) {
	return value !== void 0 && value >= 0 ? value : 0;
}
function scopedPreferenceEntries(entries, scopeKey) {
	return entries.map((entry) => ({
		key: entry.key,
		value: sanitizeStoredPreferenceEntry(entry.value)
	})).filter((entry) => entry.value?.scopeKey === scopeKey);
}
function comparePreferenceEntries(left, right) {
	return preferenceTimestampMs(right.value.updatedAt) - preferenceTimestampMs(left.value.updatedAt) || timestampOrder(right.value.updatedOrder) - timestampOrder(left.value.updatedOrder) || left.key.localeCompare(right.key);
}
function nextPreferenceTimestamp() {
	lastPreferenceTimestampMs = Math.max(Date.now(), lastPreferenceTimestampMs + 1);
	return {
		updatedAt: new Date(lastPreferenceTimestampMs).toISOString(),
		updatedOrder: ++lastPreferenceOrder
	};
}
async function readDiscordModelPickerRecentModels(params) {
	const key = buildDiscordModelPickerPreferenceKey(params.scope);
	if (!key) return [];
	try {
		const recent = scopedPreferenceEntries(await openPreferenceStore().entries(), key).toSorted(comparePreferenceEntries).map((entry) => entry.value.modelRef);
		const visible = !params.allowedModelRefs || params.allowedModelRefs.size === 0 ? recent : recent.filter((modelRef) => params.allowedModelRefs?.has(modelRef));
		return [...new Set(visible)].slice(0, RECENT_LIMIT);
	} catch {
		return [];
	}
}
async function recordDiscordModelPickerRecentModel(params) {
	const key = buildDiscordModelPickerPreferenceKey(params.scope);
	const normalizedModelRef = normalizeModelRef(params.modelRef);
	if (!key || !normalizedModelRef) return;
	try {
		const store = openPreferenceStore();
		const existingEntries = scopedPreferenceEntries(await store.entries(), key);
		const timestamp = nextPreferenceTimestamp();
		const modelKey = buildPreferenceModelKey(key, normalizedModelRef);
		await store.register(modelKey, {
			scopeKey: key,
			modelRef: normalizedModelRef,
			...timestamp
		});
		const expired = existingEntries.filter((entry) => entry.key !== modelKey).toSorted(comparePreferenceEntries).slice(4);
		await Promise.all(expired.map((entry) => store.delete(entry.key)));
	} catch {}
}
// extensions/discord/src/monitor/model-picker.state.ts
const DISCORD_MODEL_PICKER_CUSTOM_ID_KEY = "mdlpk";
const DISCORD_CUSTOM_ID_MAX_CHARS = 100;
const DISCORD_COMPONENT_MAX_SELECT_OPTIONS = 25;
function compareBucketItems(left, right) {
	const normalized = left.toLowerCase().localeCompare(right.toLowerCase());
	return normalized === 0 ? left.localeCompare(right) : normalized;
}
const COMMAND_CONTEXTS = ["model", "models"];
const PICKER_ACTIONS = [
	"open",
	"provider",
	"model",
	"pick",
	"runtime",
	"submit",
	"quick",
	"back",
	"reset",
	"cancel",
	"recents",
	"nav",
	"bucket"
];
const PICKER_VIEWS = [
	"providers",
	"models",
	"recents"
];
const DISCORD_MODEL_PICKER_BUCKET_THRESHOLD = DISCORD_COMPONENT_MAX_SELECT_OPTIONS;
/** Target items per alpha bucket. Discord caps selects at 25 options. */
const DISCORD_MODEL_PICKER_BUCKET_TARGET_SIZE = 20;
const DISCORD_MODEL_PICKER_TOKEN_PATTERN = /^[A-Za-z0-9_-]{8}$/u;
function createDiscordModelPickerModelToken(provider, model) {
	return createHash("sha256").update(JSON.stringify([normalizeProviderId$1(provider), model]), "utf8").digest("base64url").slice(0, 8);
}
function createDiscordModelPickerRuntimeToken(runtime) {
	return createHash("sha256").update(runtime, "utf8").digest("base64url").slice(0, 8);
}
const loadModelsProviderRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/models-provider-runtime"));
function isPickerValue(value, values) {
	return values.some((candidate) => candidate === value);
}
function normalizeModelPickerPage(value) {
	return normalizeOptionalModelPickerIndex(value) ?? 1;
}
function parseRawPage(value) {
	return normalizeModelPickerPage(typeof value === "number" ? value : typeof value === "string" ? parseStrictInteger(value) : void 0);
}
function coerceString(value) {
	return typeof value === "string" || typeof value === "number" ? String(value) : "";
}
function normalizeOptionalModelPickerIndex(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : void 0;
}
async function loadDiscordModelPickerData(cfg, agentId, options) {
	const { buildPreparedModelsProviderData } = await loadModelsProviderRuntime();
	return buildPreparedModelsProviderData(cfg, agentId, options);
}
function buildDiscordModelPickerCustomId(params) {
	const userId = params.userId.trim();
	if (!userId) throw new Error("Discord model picker custom_id requires userId");
	const page = normalizeModelPickerPage(params.page);
	const providerPage = normalizeOptionalModelPickerIndex(params.providerPage);
	const normalizedProvider = params.provider ? normalizeProviderId$1(params.provider) : void 0;
	const modelIndex = normalizeOptionalModelPickerIndex(params.modelIndex);
	const recentSlot = normalizeOptionalModelPickerIndex(params.recentSlot);
	const modelToken = params.modelToken?.trim();
	if (modelToken && !DISCORD_MODEL_PICKER_TOKEN_PATTERN.test(modelToken)) throw new Error("Discord model picker model token is invalid");
	const parts = [
		`${DISCORD_MODEL_PICKER_CUSTOM_ID_KEY}:c=${encodeCustomIdComponent(params.command)}`,
		`a=${encodeCustomIdComponent(params.action)}`,
		`v=${encodeCustomIdComponent(params.view)}`,
		`u=${encodeCustomIdComponent(userId)}`,
		`g=${String(page)}`
	];
	const append = (key, value) => {
		if (value) parts.push(`${key}=${typeof value === "string" ? encodeCustomIdComponent(value) : value}`);
	};
	append("p", normalizedProvider);
	append("r", params.runtime?.trim());
	const runtimeToken = params.runtimeToken?.trim();
	if (runtimeToken && !DISCORD_MODEL_PICKER_TOKEN_PATTERN.test(runtimeToken)) throw new Error("Discord model picker runtime token is invalid");
	append("rt", runtimeToken);
	append("ri", normalizeOptionalModelPickerIndex(params.runtimeIndex));
	append("pp", providerPage);
	if (modelToken) parts.push(`m=${modelToken}`);
	else {
		append("mi", modelIndex);
		append("rs", recentSlot);
	}
	append("pb", params.providerBucket?.trim().toLowerCase());
	append("mb", params.modelBucket?.trim().toLowerCase());
	if (parts.join(";").length > DISCORD_CUSTOM_ID_MAX_CHARS) {
		for (let index = parts.length - 1; index >= 0; index -= 1) if (parts[index] === "g=1" || parts[index] === "pp=1") parts.splice(index, 1);
	}
	if (modelToken && parts.join(";").length > DISCORD_CUSTOM_ID_MAX_CHARS) {
		const providerPart = parts.findIndex((part) => part.startsWith("p="));
		if (providerPart >= 0) parts.splice(providerPart, 1);
	}
	const customId = parts.join(";");
	if (customId.length > DISCORD_CUSTOM_ID_MAX_CHARS) throw new Error(`Discord model picker custom_id exceeds ${DISCORD_CUSTOM_ID_MAX_CHARS} chars (${customId.length})`);
	return customId;
}
function parseDiscordModelPickerData(data) {
	if (!data || typeof data !== "object") return null;
	const command = decodeCustomIdComponent(coerceString(data.c ?? data.cmd));
	const action = decodeCustomIdComponent(coerceString(data.a ?? data.act));
	const view = decodeCustomIdComponent(coerceString(data.v ?? data.view));
	const userId = decodeCustomIdComponent(coerceString(data.u));
	const providerRaw = decodeCustomIdComponent(coerceString(data.p));
	const runtimeRaw = decodeCustomIdComponent(coerceString(data.r));
	const runtimeIndex = parseStrictPositiveInteger(data.ri);
	const runtimeTokenRaw = coerceString(data.rt).trim();
	if (runtimeTokenRaw && !DISCORD_MODEL_PICKER_TOKEN_PATTERN.test(runtimeTokenRaw)) return null;
	if ([
		runtimeRaw.trim(),
		runtimeTokenRaw,
		runtimeIndex
	].filter(Boolean).length > 1) return null;
	const page = parseRawPage(data.g ?? data.pg);
	const providerPage = parseStrictPositiveInteger(data.pp);
	const modelIndex = parseStrictPositiveInteger(data.mi);
	const modelTokenRaw = coerceString(data.m).trim();
	const modelToken = DISCORD_MODEL_PICKER_TOKEN_PATTERN.test(modelTokenRaw) ? modelTokenRaw : void 0;
	const recentSlot = parseStrictPositiveInteger(data.rs);
	const providerBucketRaw = decodeCustomIdComponent(coerceString(data.pb)).trim().toLowerCase();
	const modelBucketRaw = decodeCustomIdComponent(coerceString(data.mb)).trim().toLowerCase();
	if (!isPickerValue(command, COMMAND_CONTEXTS) || !isPickerValue(action, PICKER_ACTIONS) || !isPickerValue(view, PICKER_VIEWS)) return null;
	const trimmedUserId = userId.trim();
	if (!trimmedUserId) return null;
	return {
		command,
		action,
		view,
		userId: trimmedUserId,
		provider: providerRaw ? normalizeProviderId$1(providerRaw) : void 0,
		runtime: runtimeRaw.trim() || void 0,
		...runtimeTokenRaw ? { runtimeToken: runtimeTokenRaw } : {},
		...typeof runtimeIndex === "number" ? { runtimeIndex } : {},
		page,
		...typeof providerPage === "number" ? { providerPage } : {},
		...typeof modelIndex === "number" ? { modelIndex } : {},
		...modelToken ? { modelToken } : {},
		...typeof recentSlot === "number" ? { recentSlot } : {},
		...providerBucketRaw ? { providerBucket: providerBucketRaw } : {},
		...modelBucketRaw ? { modelBucket: modelBucketRaw } : {}
	};
}
function computeAlphaBuckets(sortedItems) {
	if (sortedItems.length === 0) return [];
	if (sortedItems.length <= DISCORD_MODEL_PICKER_BUCKET_THRESHOLD) return [{
		id: "all",
		label: `All (${sortedItems.length})`,
		start: 0,
		end: sortedItems.length
	}];
	const firstLetter = (value) => (Array.from(value)[0] ?? "").toLowerCase();
	const firstItem = expectDefined(sortedItems.at(0), "non-empty sorted model picker items");
	const allSamePrefix = sortedItems.every((item) => firstLetter(item) === firstLetter(firstItem));
	const buckets = [];
	const target = Math.max(DISCORD_MODEL_PICKER_BUCKET_TARGET_SIZE, Math.ceil(sortedItems.length / DISCORD_COMPONENT_MAX_SELECT_OPTIONS));
	let start = 0;
	while (start < sortedItems.length) {
		let end = Math.min(sortedItems.length, start + target);
		if (!allSamePrefix && end < sortedItems.length) {
			const last = firstLetter(expectDefined(sortedItems[end - 1], "bucket end predecessor"));
			while (end < sortedItems.length && firstLetter(expectDefined(sortedItems[end], "bucket extension index")) === last) end += 1;
		}
		const startLetter = firstLetter(expectDefined(sortedItems[start], "bucket start index"));
		const endLetter = firstLetter(expectDefined(sortedItems[end - 1], "bucket end predecessor"));
		const id = allSamePrefix ? `${start + 1}-${end}` : startLetter === endLetter ? startLetter : `${startLetter}-${endLetter}`;
		const label = `${allSamePrefix ? `${start + 1}–${end}` : startLetter === endLetter ? startLetter.toUpperCase() : `${startLetter.toUpperCase()}–${endLetter.toUpperCase()}`} (${end - start})`;
		buckets.push({
			id,
			label,
			start,
			end
		});
		start = end;
	}
	return buckets;
}
function findProviderBucketLocation(data, provider) {
	return findModelPickerBucketLocation(data.providers.toSorted(), normalizeProviderId$1(provider));
}
function findModelPickerBucketLocation(sortedItems, item) {
	const index = sortedItems.indexOf(item);
	const bucket = index < 0 ? void 0 : computeAlphaBuckets(sortedItems).find((entry) => index >= entry.start && index < entry.end);
	return bucket ? {
		...bucket.id === "all" ? {} : { bucket: bucket.id },
		page: Math.floor((index - bucket.start) / DISCORD_COMPONENT_MAX_SELECT_OPTIONS) + 1
	} : void 0;
}
function paginateDiscordModelPickerBucket(params) {
	const buckets = computeAlphaBuckets(params.itemLabels);
	const bucket = buckets.find((entry) => entry.id === params.bucket) ?? buckets[0] ?? null;
	const items = bucket ? params.items.slice(bucket.start, bucket.end) : params.items;
	const pageSize = DISCORD_COMPONENT_MAX_SELECT_OPTIONS;
	const totalItems = items.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const page = Math.min(normalizeModelPickerPage(params.page), totalPages);
	const start = (page - 1) * pageSize;
	return {
		items: items.slice(start, start + pageSize),
		page,
		pageSize,
		totalPages,
		totalItems,
		hasPrev: page > 1,
		hasNext: page < totalPages,
		bucket,
		buckets
	};
}
function getDiscordModelPickerProviderPage(params) {
	const providers = params.data.providers.toSorted();
	return paginateDiscordModelPickerBucket({
		...params,
		itemLabels: providers,
		items: providers.map((provider) => ({
			id: provider,
			count: params.data.byProvider.get(provider)?.size ?? 0
		}))
	});
}
function getDiscordModelPickerModelPage(params) {
	const provider = normalizeProviderId$1(params.provider);
	const modelSet = params.data.byProvider.get(provider);
	if (!modelSet) return null;
	const allModels = [...modelSet].toSorted(compareBucketItems);
	return {
		...paginateDiscordModelPickerBucket({
			...params,
			items: allModels,
			itemLabels: allModels
		}),
		provider
	};
}
function resolveDiscordModelPickerPageForModel(params) {
	const provider = normalizeProviderId$1(params.provider);
	const modelSet = params.data.byProvider.get(provider);
	if (!modelSet) return { page: 1 };
	return findModelPickerBucketLocation([...modelSet].toSorted(compareBucketItems), params.model) ?? { page: 1 };
}
function getDiscordModelPickerRecentModelRefs(data, quickModels) {
	const defaultModelRef = `${data.resolvedDefault.provider}/${data.resolvedDefault.model}`;
	return [defaultModelRef, ...quickModels.filter((modelRef) => modelRef !== defaultModelRef)];
}
// extensions/discord/src/monitor/model-picker.view.ts
const DISCORD_MODEL_PICKER_PAGE_INDICATOR_CUSTOM_ID = "mdlpk:nav-indicator";
function parseCurrentModelRef(raw) {
	const match = raw?.trim().match(/^([^/]+)\/(.+)$/u);
	if (!match) return null;
	const providerText = match[1];
	const model = match[2];
	const provider = providerText ? normalizeProviderId$1(providerText) : "";
	if (!provider || !model) return null;
	return {
		provider,
		model
	};
}
function formatCurrentModelLine(currentModel) {
	const parsed = parseCurrentModelRef(currentModel);
	if (!parsed) return "Current model: default";
	return `Current model: ${parsed.provider}/${parsed.model}`;
}
function createModelPickerButton(label, state, options = {}) {
	const customId = typeof state === "string" ? state : buildDiscordModelPickerCustomId(state);
	return stripUndefinedFields({
		type: ComponentType.Button,
		label,
		custom_id: customId,
		style: options.style ?? ButtonStyle.Secondary,
		disabled: options.disabled || void 0
	});
}
function createModelSelectRow(state, options, placeholder) {
	const customId = buildDiscordModelPickerCustomId(state);
	return {
		type: ComponentType.ActionRow,
		components: [{
			type: ComponentType.StringSelect,
			custom_id: customId,
			options,
			min_values: 1,
			max_values: 1,
			placeholder
		}]
	};
}
function buildBucketSelectRow(params) {
	const { buckets, currentBucketId, ...state } = params;
	if (buckets.length <= 1) return null;
	const options = buckets.map((bucket) => ({
		label: bucket.label,
		value: bucket.id,
		default: bucket.id === currentBucketId
	}));
	return createModelSelectRow({
		...state,
		action: "bucket",
		page: 1
	}, options, params.view === "providers" ? "Filter providers by letter range" : "Filter models by letter range");
}
function getActiveBucketId(bucket) {
	return bucket && bucket.id !== "all" ? bucket.id : void 0;
}
function buildRenderedShell(params) {
	const containerComponents = [{
		type: ComponentType.TextDisplay,
		content: `## ${params.title}`
	}];
	if (params.refreshWarning) containerComponents.push({
		type: ComponentType.TextDisplay,
		content: params.refreshWarning
	});
	containerComponents.push({
		type: ComponentType.TextDisplay,
		content: params.detailLines.join("\n")
	});
	containerComponents.push({
		type: ComponentType.Separator,
		divider: true,
		spacing: 1
	});
	if (params.preRowText) containerComponents.push({
		type: ComponentType.TextDisplay,
		content: params.preRowText
	});
	containerComponents.push(...params.rows);
	if (params.trailingRows && params.trailingRows.length > 0) {
		containerComponents.push({
			type: ComponentType.Separator,
			divider: true,
			spacing: 1
		});
		containerComponents.push(...params.trailingRows);
	}
	if (params.footer) {
		containerComponents.push({
			type: ComponentType.Separator,
			divider: false,
			spacing: 1
		});
		containerComponents.push({
			type: ComponentType.TextDisplay,
			content: `-# ${params.footer}`
		});
	}
	return { components: [asSerializableComponent({
		type: ComponentType.Container,
		components: containerComponents
	})] };
}
function buildProviderSelectRow(params) {
	const { page, currentProvider, showModelCounts, ...state } = params;
	const options = page.items.map((provider) => ({
		label: provider.id,
		value: provider.id,
		default: provider.id === currentProvider,
		...showModelCounts ? { description: `${provider.count} ${provider.count === 1 ? "model" : "models"}` } : {}
	}));
	return createModelSelectRow({
		...state,
		action: "provider",
		view: "models",
		page: page.page,
		providerPage: page.page
	}, options, "Select provider");
}
function buildPaginationRow(params) {
	if (params.totalPages <= 1) return null;
	const { page, totalPages, hasPrev, hasNext, ...navigationState } = params;
	const createNavigationButton = (label, targetPage, enabled) => createModelPickerButton(label, {
		...navigationState,
		action: "nav",
		page: targetPage
	}, { disabled: !enabled });
	const indicatorButton = createModelPickerButton(`Page ${page}/${totalPages}`, DISCORD_MODEL_PICKER_PAGE_INDICATOR_CUSTOM_ID, { disabled: true });
	return {
		type: ComponentType.ActionRow,
		components: [
			createNavigationButton("◀ Prev", Math.max(1, page - 1), hasPrev),
			indicatorButton,
			createNavigationButton("Next ▶", Math.min(totalPages, page + 1), hasNext)
		]
	};
}
function renderDiscordModelPickerProvidersView(params) {
	const page = getDiscordModelPickerProviderPage({
		data: params.data,
		page: params.page,
		bucket: params.providerBucket
	});
	const parsedCurrent = parseCurrentModelRef(params.currentModel);
	const rows = [];
	const bucketRow = buildBucketSelectRow({
		command: params.command,
		userId: params.userId,
		view: "providers",
		buckets: page.buckets,
		currentBucketId: page.bucket?.id
	});
	if (bucketRow) rows.push(bucketRow);
	const activeProviderBucket = getActiveBucketId(page.bucket);
	if (page.items.length > 0) rows.push(buildProviderSelectRow({
		command: params.command,
		userId: params.userId,
		page,
		currentProvider: parsedCurrent?.provider,
		providerBucket: activeProviderBucket,
		showModelCounts: true
	}));
	const navRow = buildPaginationRow({
		command: params.command,
		userId: params.userId,
		view: "providers",
		page: page.page,
		totalPages: page.totalPages,
		hasPrev: page.hasPrev,
		hasNext: page.hasNext,
		providerBucket: activeProviderBucket
	});
	if (navRow) rows.push(navRow);
	const totalProviders = params.data.providers.length;
	const detailLines = [formatCurrentModelLine(params.currentModel), page.bucket && page.bucket.id !== "all" ? `Select a provider (${page.totalItems} in ${page.bucket.label}, ${totalProviders} total).` : `Select a provider (${page.totalItems} available).`];
	const footer = page.totalPages > 1 ? `Showing page ${page.page}/${page.totalPages} · ${page.totalItems} providers total` : `All ${page.totalItems} providers shown`;
	return buildRenderedShell({
		title: "Model Picker",
		refreshWarning: params.data.refreshWarning,
		detailLines,
		rows,
		footer
	});
}
function renderDiscordModelPickerModelsView(params) {
	const requestedProviderPage = normalizeModelPickerPage(params.providerPage);
	const modelPage = getDiscordModelPickerModelPage({
		data: params.data,
		provider: params.provider,
		page: params.page,
		bucket: params.modelBucket
	});
	if (!modelPage) {
		const rows = [{
			type: ComponentType.ActionRow,
			components: [createModelPickerButton("Back", {
				command: params.command,
				action: "back",
				view: "providers",
				page: requestedProviderPage,
				userId: params.userId
			})]
		}];
		return buildRenderedShell({
			title: "Model Picker",
			refreshWarning: params.data.refreshWarning,
			detailLines: [formatCurrentModelLine(params.currentModel), `Provider not found: ${normalizeProviderId$1(params.provider)}`],
			rows,
			footer: "Choose a different provider."
		});
	}
	const parsedCurrentModel = parseCurrentModelRef(params.currentModel);
	const parsedPendingModel = parseCurrentModelRef(params.pendingModel);
	const pendingModelToken = parsedPendingModel ? createDiscordModelPickerModelToken(parsedPendingModel.provider, parsedPendingModel.model) : void 0;
	const modelRows = [];
	const providerPage = getDiscordModelPickerProviderPage({
		data: params.data,
		page: requestedProviderPage,
		bucket: params.providerBucket
	});
	const activeProviderBucket = getActiveBucketId(providerPage.bucket);
	const activeModelBucket = getActiveBucketId(modelPage.bucket);
	if (!(modelPage.buckets.length > 1)) modelRows.push(buildProviderSelectRow({
		command: params.command,
		userId: params.userId,
		page: providerPage,
		provider: modelPage.provider,
		currentProvider: modelPage.provider,
		providerBucket: activeProviderBucket
	}));
	const runtimeModel = parseCurrentModelRef(params.pendingModel ?? params.currentModel);
	const runtimeChoices = getModelsRuntimeChoices(params.data, modelPage.provider, runtimeModel?.provider === normalizeProviderId$1(modelPage.provider) ? runtimeModel.model : void 0);
	const currentRuntime = parsedCurrentModel?.provider === modelPage.provider ? params.currentRuntime : void 0;
	const runtime = params.pendingRuntime?.trim() || currentRuntime?.trim();
	const explicitRuntime = runtime && runtime !== "auto" && runtime !== "default" ? runtime : void 0;
	const selectedRuntime = explicitRuntime ? runtimeChoices?.find((choice) => choice.id === explicitRuntime)?.id : runtimeChoices?.[0]?.id;
	const compactRuntime = explicitRuntime ? { runtimeToken: createDiscordModelPickerRuntimeToken(explicitRuntime) } : {};
	const modelViewState = {
		command: params.command,
		userId: params.userId,
		view: "models",
		provider: modelPage.provider,
		page: modelPage.page,
		providerPage: providerPage.page
	};
	const modelActionState = {
		...modelViewState,
		...compactRuntime
	};
	if (runtimeChoices && (runtimeChoices.length > 1 || runtimeChoices.length === 1 && selectedRuntime === void 0)) modelRows.push(createModelSelectRow({
		...modelViewState,
		action: "runtime",
		modelIndex: params.pendingModelIndex,
		modelToken: pendingModelToken,
		...params.pendingModelIndex === void 0 && activeModelBucket ? { modelBucket: activeModelBucket } : {}
	}, runtimeChoices.map((choice) => ({
		label: choice.label,
		value: choice.id,
		default: choice.id === selectedRuntime,
		...choice.description ? { description: choice.description } : {}
	})), "Choose how to run this model"));
	const selectedModelRef = parsedPendingModel ?? parsedCurrentModel;
	const modelOptions = modelPage.items.map((model) => ({
		label: truncateCodePoints(model, 100),
		value: createDiscordModelPickerModelToken(modelPage.provider, model),
		default: selectedModelRef ? selectedModelRef.provider === modelPage.provider && selectedModelRef.model === model : false
	}));
	modelRows.push(createModelSelectRow({
		...modelActionState,
		action: "pick"
	}, modelOptions, `Select ${modelPage.provider} model`));
	const modelNavRow = buildPaginationRow({
		...modelActionState,
		totalPages: modelPage.totalPages,
		hasPrev: modelPage.hasPrev,
		hasNext: modelPage.hasNext,
		modelIndex: params.pendingModelIndex,
		modelToken: pendingModelToken,
		modelBucket: activeModelBucket
	});
	if (modelNavRow) modelRows.push(modelNavRow);
	const resolvedDefault = params.data.resolvedDefault;
	const shouldDisableReset = parsedCurrentModel?.provider === resolvedDefault.provider && parsedCurrentModel?.model === resolvedDefault.model;
	const hasPendingSelection = parsedPendingModel?.provider === modelPage.provider && typeof params.pendingModelIndex === "number" && params.pendingModelIndex > 0;
	const buttonRowItems = [
		createModelPickerButton("Providers", {
			command: params.command,
			action: "back",
			view: "providers",
			page: providerPage.page,
			providerBucket: activeProviderBucket,
			userId: params.userId
		}),
		createModelPickerButton("Cancel", {
			...modelActionState,
			action: "cancel"
		}),
		createModelPickerButton("Reset to default", {
			...modelActionState,
			action: "reset"
		}, { disabled: shouldDisableReset })
	];
	if (params.quickModels?.length) buttonRowItems.push(createModelPickerButton("Recents", {
		...modelActionState,
		action: "recents",
		view: "recents",
		modelBucket: activeModelBucket
	}));
	buttonRowItems.push(createModelPickerButton("Submit", {
		...modelActionState,
		action: "submit",
		modelIndex: params.pendingModelIndex,
		modelToken: pendingModelToken
	}, {
		style: ButtonStyle.Primary,
		disabled: !hasPendingSelection || selectedRuntime === void 0
	}));
	const buttonRow = {
		type: ComponentType.ActionRow,
		components: buttonRowItems
	};
	const pendingRuntime = params.pendingRuntime?.trim();
	const bucketRow = buildBucketSelectRow({
		command: params.command,
		userId: params.userId,
		view: "models",
		buckets: modelPage.buckets,
		currentBucketId: modelPage.bucket?.id,
		provider: modelPage.provider,
		runtimeToken: pendingRuntime ? createDiscordModelPickerRuntimeToken(pendingRuntime) : void 0,
		providerPage: requestedProviderPage
	});
	const defaultModel = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	const selectedRuntimeLabel = runtimeChoices?.find((choice) => choice.id === selectedRuntime)?.label;
	const pendingLine = !params.pendingModel ? "Select a model, then press Submit." : runtimeChoices === void 0 ? "Could not confirm how to run this model. Open /models to try again." : runtimeChoices.length === 0 ? "This model cannot run with your current connections. Choose another model." : selectedRuntimeLabel ? `Selected: ${params.pendingModel} · ${selectedRuntimeLabel} (press Submit)` : "Choose how to run this model, then press Submit.";
	const detailLines = [formatCurrentModelLine(params.currentModel), `Default: ${defaultModel}`];
	if (modelPage.totalPages > 1) detailLines.push(`${modelPage.provider}: page ${modelPage.page}/${modelPage.totalPages} · ${modelPage.totalItems} models`);
	return buildRenderedShell({
		title: "Model Picker",
		refreshWarning: params.data.refreshWarning,
		detailLines,
		preRowText: pendingLine,
		rows: bucketRow ? [bucketRow, ...modelRows] : modelRows,
		trailingRows: [buttonRow]
	});
}
function renderDiscordModelPickerRecentsView(params) {
	const { data, quickModels, currentModel, modelBucket, ...navigationState } = params;
	const rows = getDiscordModelPickerRecentModelRefs(data, quickModels).map((modelRef, index) => {
		const suffix = index === 0 ? "(default)" : void 0;
		const maxLen = 80;
		const label = suffix ? `${modelRef} ${suffix}` : modelRef;
		const buttonLabel = label.length <= maxLen ? label : suffix ? `${sliceUtf16Safe(modelRef, 0, maxLen - suffix.length - 2)}… ${suffix}` : `${sliceUtf16Safe(modelRef, 0, 79)}…`;
		const parsed = parseCurrentModelRef(modelRef);
		return {
			type: ComponentType.ActionRow,
			components: [createModelPickerButton(buttonLabel, {
				...navigationState,
				action: "submit",
				view: "recents",
				recentSlot: index + 1,
				modelToken: parsed ? createDiscordModelPickerModelToken(parsed.provider, parsed.model) : void 0
			})]
		};
	});
	const backRow = {
		type: ComponentType.ActionRow,
		components: [createModelPickerButton("Back", {
			...navigationState,
			action: "back",
			view: "models",
			modelBucket
		})]
	};
	return buildRenderedShell({
		title: "Recents",
		refreshWarning: data.refreshWarning,
		detailLines: ["Models you've previously selected appear here.", formatCurrentModelLine(currentModel)],
		preRowText: "Tap a model to switch.",
		rows,
		trailingRows: [backRow]
	});
}
// extensions/discord/src/monitor/native-command-model-picker-ui.ts
function createDiscordModelPickerSessionReader(params, readConsistency) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.route.agentId });
	return (sessionKey = params.route.sessionKey) => getSessionEntryAsync({
		agentId: params.route.agentId,
		storePath,
		sessionKey,
		...readConsistency ? { readConsistency } : {}
	});
}
function shouldOpenDiscordModelPickerFromCommand(params) {
	const context = normalizeLowercaseStringOrEmpty(params.command.nativeName ?? params.command.key);
	if (context !== "model" && context !== "models") return null;
	const serializedArgs = normalizeOptionalString(serializeCommandArgs$1(params.command, params.commandArgs)) ?? "";
	if (context === "model") return !normalizeOptionalString(params.commandArgs?.values?.model) && !serializedArgs ? context : null;
	return serializedArgs ? null : context;
}
function buildDiscordModelPickerAllowedModelRefs(data) {
	return new Set(data.providers.flatMap((provider) => [...data.byProvider.get(provider) ?? []].map((model) => `${provider}/${model}`)));
}
function resolveDiscordModelPickerPreferenceScope(params) {
	return {
		accountId: params.accountId,
		guildId: params.interaction.guild?.id,
		userId: params.userId
	};
}
function buildDiscordModelPickerNoticePayload(message) {
	return { components: [{
		type: ComponentType.Container,
		components: [{
			type: ComponentType.TextDisplay,
			content: message
		}]
	}] };
}
async function resolveDiscordModelPickerRoute(params) {
	const { interaction, cfg, accountId } = params;
	return resolveDiscordNativeInteractionRouteState({
		cfg,
		accountId,
		interaction,
		channelContext: await resolveDiscordNativeInteractionChannelContext(interaction, "unknown"),
		threadBindings: params.threadBindings
	}).effectiveRoute;
}
async function resolveDiscordNativeChoiceContext(params) {
	try {
		const route = params.route ?? await resolveDiscordModelPickerRoute(params);
		const fallback = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: route.agentId
		});
		const loadSessionEntry = createDiscordModelPickerSessionReader({
			...params,
			route
		});
		const sessionEntry = await loadSessionEntry();
		const override = await resolveStoredModelOverrideAsync({
			sessionEntry,
			loadSessionEntry,
			sessionKey: route.sessionKey,
			defaultProvider: fallback.provider
		});
		const provider = override?.provider || fallback.provider;
		const model = override?.model || fallback.model;
		return {
			provider,
			model,
			agentId: route.agentId,
			agentRuntime: resolveEffectiveAgentRuntime({
				cfg: params.cfg,
				provider,
				modelId: model,
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				sessionEntry
			})
		};
	} catch {
		return null;
	}
}
async function resolveDiscordModelPickerCurrentModel(params) {
	const fallback = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	try {
		const loadSessionEntry = createDiscordModelPickerSessionReader(params, "latest");
		const override = await resolveStoredModelOverrideAsync({
			sessionEntry: params.sessionEntry,
			loadSessionEntry,
			sessionKey: params.route.sessionKey,
			defaultProvider: params.data.resolvedDefault.provider
		});
		if (!override?.model) return fallback;
		const provider = (override.provider || params.data.resolvedDefault.provider).trim();
		if (!provider) return fallback;
		return `${provider}/${override.model}`;
	} catch {
		return fallback;
	}
}
function resolveDiscordModelPickerCurrentRuntime(params) {
	return normalizeOptionalString(params.sessionEntry?.agentRuntimeOverride) ?? "auto";
}
async function replyWithDiscordModelPickerProviders(params) {
	const route = await resolveDiscordModelPickerRoute(params);
	const sessionEntry = await createDiscordModelPickerSessionReader({
		...params,
		route
	}, "latest")();
	const data = await loadDiscordModelPickerData(params.cfg, route.agentId, { sessionEntry });
	const modelContext = {
		cfg: params.cfg,
		route,
		data,
		sessionEntry
	};
	const currentModel = await resolveDiscordModelPickerCurrentModel(modelContext);
	const currentRuntime = resolveDiscordModelPickerCurrentRuntime(modelContext);
	const quickModels = await readDiscordModelPickerRecentModels({
		scope: resolveDiscordModelPickerPreferenceScope(params),
		allowedModelRefs: buildDiscordModelPickerAllowedModelRefs(data)
	});
	const parsedCurrentRef = splitDiscordModelRef(currentModel);
	const initialProvider = parsedCurrentRef && data.byProvider.has(parsedCurrentRef.provider) ? parsedCurrentRef.provider : data.providers[0] ?? data.resolvedDefault.provider;
	const initialResolved = parsedCurrentRef && parsedCurrentRef.provider === initialProvider ? resolveDiscordModelPickerPageForModel({
		data,
		provider: initialProvider,
		model: parsedCurrentRef.model
	}) : { page: 1 };
	const initialProviderLocation = findProviderBucketLocation(data, initialProvider);
	const rendered = renderDiscordModelPickerModelsView({
		command: params.command,
		userId: params.userId,
		data,
		provider: initialProvider,
		page: initialResolved.page,
		providerPage: initialProviderLocation?.page ?? 1,
		providerBucket: initialProviderLocation?.bucket,
		modelBucket: initialResolved.bucket,
		currentModel,
		currentRuntime,
		quickModels
	});
	const payload = {
		...rendered,
		ephemeral: true
	};
	if (await params.safeInteractionCall("model picker reply", async () => {
		await params.interaction.followUp(payload);
	}) !== null) await recordDeliveredCommandExchange({
		config: params.cfg,
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		expectedSessionId: sessionEntry?.sessionId,
		commandText: `/${params.command}`,
		commandId: `discord:${params.accountId}:${route.sessionKey}:${params.interaction.id}`,
		replyId: "model-picker",
		replyText: formatDiscordCommandComponents(rendered.components)
	});
}
// extensions/discord/src/monitor/native-command-model-picker-interaction.ts
function resolveModelPickerSelectionValue(interaction) {
	return normalizeOptionalString(interaction.values?.[0]) ?? null;
}
function resolveRuntimeToken(choices, token) {
	if (!token) return;
	const matches = choices?.filter((choice) => createDiscordModelPickerRuntimeToken(choice.id) === token);
	return matches?.length === 1 ? matches[0]?.id : void 0;
}
function resolveSelectedBucket(interaction) {
	const raw = resolveModelPickerSelectionValue(interaction)?.toLowerCase();
	return raw && raw !== "all" ? raw : void 0;
}
function listDiscordModelPickerProviderModels(data, provider) {
	return [...data.byProvider.get(provider) ?? []].toSorted((left, right) => left < right ? -1 : left > right ? 1 : 0);
}
function resolveDiscordModelPickerModelRefByToken(data, modelToken) {
	const matchingRefs = [];
	for (const [provider, models] of data.byProvider) for (const model of models) if (createDiscordModelPickerModelToken(provider, model) === modelToken) matchingRefs.push(`${provider}/${model}`);
	return matchingRefs.length === 1 ? matchingRefs[0] ?? null : null;
}
function resolveDiscordModelPickerModelSelection(params) {
	const models = listDiscordModelPickerProviderModels(params.data, params.provider);
	if (params.modelToken) {
		const matchingModels = models.filter((model) => createDiscordModelPickerModelToken(params.provider, model) === params.modelToken);
		return matchingModels.length === 1 ? matchingModels[0] ?? null : null;
	}
	if (params.requireModelToken || !params.modelIndex || params.modelIndex < 1) return null;
	return models[params.modelIndex - 1] ?? null;
}
async function handleDiscordModelPickerInteraction(params) {
	const { interaction, data, ctx } = params;
	const parsed = parseDiscordModelPickerData(data);
	if (!parsed) {
		await params.safeInteractionCall("model picker update", () => interaction.update(buildDiscordModelPickerNoticePayload("Sorry, that model picker interaction is no longer available.")));
		return;
	}
	if (interaction.user?.id && interaction.user.id !== parsed.userId) {
		await params.safeInteractionCall("model picker ack", () => interaction.acknowledge());
		return;
	}
	if (!interaction.acknowledged) {
		if (await params.safeInteractionCall("model picker defer", () => interaction.acknowledge()) === null) return;
	}
	const cfg = getRuntimeConfigSnapshot() ?? ctx.cfg;
	const requireModelToken = cfg !== ctx.cfg;
	const route = await resolveDiscordModelPickerRoute({
		interaction,
		cfg,
		accountId: ctx.accountId,
		threadBindings: ctx.threadBindings
	});
	const sessionEntry = await createDiscordModelPickerSessionReader({
		cfg,
		route
	}, "latest")();
	const pickerData = await loadDiscordModelPickerData(cfg, route.agentId, { sessionEntry });
	const tokenModel = parsed.modelToken ? resolveDiscordModelPickerModelRefByToken(pickerData, parsed.modelToken) : null;
	const parsedProvider = parsed.provider ?? splitDiscordModelRef(tokenModel ?? "")?.provider;
	const modelContext = {
		cfg,
		route,
		data: pickerData,
		sessionEntry
	};
	const currentModelRef = await resolveDiscordModelPickerCurrentModel(modelContext);
	const currentModel = splitDiscordModelRef(currentModelRef);
	const browseProvider = parsedProvider ?? currentModel?.provider ?? pickerData.resolvedDefault.provider;
	const resolvePendingRuntime = (provider) => parsed.runtime ?? resolveRuntimeToken(getModelsRuntimeChoices(pickerData, provider), parsed.runtimeToken);
	const currentRuntime = resolveDiscordModelPickerCurrentRuntime(modelContext);
	const allowedModelRefs = buildDiscordModelPickerAllowedModelRefs(pickerData);
	const preferenceScope = resolveDiscordModelPickerPreferenceScope({
		interaction,
		accountId: ctx.accountId,
		userId: parsed.userId
	});
	const quickModels = await readDiscordModelPickerRecentModels({
		scope: preferenceScope,
		allowedModelRefs
	});
	const recordReply = async (commandText, replyText, replyId) => await recordDeliveredCommandExchange({
		config: cfg,
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		expectedSessionId: sessionEntry?.sessionId,
		commandText,
		commandId: `discord:${ctx.accountId}:${route.sessionKey}:${interaction.id}`,
		replyId,
		replyText
	});
	const updatePicker = async (payload, capture = true) => {
		const delivered = await params.safeInteractionCall("model picker update", () => interaction.editReply(payload));
		if (delivered !== null && capture) await recordReply(`/${parsed.command}`, typeof payload === "string" ? payload : [payload.content, formatDiscordCommandComponents(payload.components ?? [])].filter(Boolean).join("\n"), "picker-update");
		return delivered;
	};
	const showNotice = async (message, capture = true) => await updatePicker(buildDiscordModelPickerNoticePayload(message), capture);
	const renderContext = {
		command: parsed.command,
		userId: parsed.userId,
		data: pickerData,
		currentModel: currentModelRef
	};
	const updateModelsView = async (provider, state = {}) => {
		const rendered = renderDiscordModelPickerModelsView({
			...renderContext,
			provider,
			page: parsed.page,
			providerPage: parsed.providerPage ?? 1,
			providerBucket: parsed.providerBucket ?? findProviderBucketLocation(pickerData, provider)?.bucket,
			currentRuntime,
			quickModels,
			...state
		});
		return await updatePicker(rendered);
	};
	if (parsed.action !== "cancel" && pickerData.isCurrent?.() === false) {
		await showNotice("That model picker expired. Reopen /model to try again.");
		return;
	}
	if (parsed.runtimeIndex !== void 0 && parsed.action !== "cancel" || parsed.runtimeToken && ![
		"submit",
		"reset",
		"quick",
		"cancel"
	].includes(parsed.action) && parsedProvider && !resolvePendingRuntime(parsedProvider)) {
		await showNotice("That runtime selection expired. Reopen /model and choose a runtime again.");
		return;
	}
	if (parsed.action === "recents") {
		await updatePicker(renderDiscordModelPickerRecentsView({
			...renderContext,
			quickModels,
			runtime: parsed.runtime,
			runtimeToken: parsed.runtimeToken,
			provider: parsed.provider,
			page: parsed.page,
			providerPage: parsed.providerPage,
			modelBucket: parsed.modelBucket
		}));
		return;
	}
	if (parsed.view === "providers" && (parsed.action === "back" || parsed.action === "nav" || parsed.action === "bucket")) {
		const selectingBucket = parsed.action === "bucket";
		await updatePicker(renderDiscordModelPickerProvidersView({
			...renderContext,
			page: selectingBucket ? 1 : parsed.page,
			providerBucket: selectingBucket ? resolveSelectedBucket(interaction) : parsed.providerBucket
		}));
		return;
	}
	if (parsed.view === "models" && (parsed.action === "bucket" || parsed.action === "back")) {
		const selectingBucket = parsed.action === "bucket";
		await updateModelsView(browseProvider, {
			page: selectingBucket ? 1 : parsed.page,
			modelBucket: selectingBucket ? resolveSelectedBucket(interaction) : parsed.modelBucket,
			pendingRuntime: resolvePendingRuntime(browseProvider)
		});
		return;
	}
	if (parsed.action === "provider") {
		const selectedProvider = resolveModelPickerSelectionValue(interaction) ?? parsed.provider;
		if (!selectedProvider || !pickerData.byProvider.has(selectedProvider)) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		await updateModelsView(selectedProvider, {
			page: 1,
			providerPage: parsed.providerPage ?? parsed.page
		});
		return;
	}
	if (parsed.action === "model" || parsed.action === "pick" || parsed.action === "runtime" || parsed.action === "nav" && parsed.view === "models") {
		const selectingModel = parsed.action === "model" || parsed.action === "pick";
		const selectingRuntime = parsed.action === "runtime";
		const provider = parsed.action === "nav" ? browseProvider : parsedProvider ?? "";
		if (parsed.action !== "nav" && (!provider || selectingRuntime && !pickerData.byProvider.has(provider))) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const selectedValue = selectingModel ? resolveModelPickerSelectionValue(interaction) : null;
		const selectedModel = parsed.action === "model" ? selectedValue : resolveDiscordModelPickerModelSelection({
			data: pickerData,
			provider,
			modelIndex: selectingModel ? void 0 : parsed.modelIndex,
			modelToken: selectingModel ? selectedValue ?? void 0 : parsed.modelToken,
			requireModelToken: selectingModel || requireModelToken
		});
		const selectedIndex = selectedModel ? listDiscordModelPickerProviderModels(pickerData, provider).indexOf(selectedModel) : -1;
		const modelIndex = selectedIndex < 0 ? void 0 : selectedIndex + 1;
		if (selectingModel && !modelIndex || !selectingModel && (parsed.modelIndex || parsed.modelToken) && !selectedModel) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		let modelBucket = parsed.modelBucket;
		let pendingRuntime;
		if (selectingRuntime) {
			const selectedRuntime = resolveModelPickerSelectionValue(interaction) ?? parsed.runtime;
			const runtimeModel = selectedModel ?? (currentModel?.provider === provider ? currentModel.model : void 0);
			const choices = getModelsRuntimeChoices(pickerData, provider, runtimeModel);
			if (!selectedRuntime || !choices?.some((choice) => choice.id === selectedRuntime)) {
				await showNotice("That runtime is not available for this model. Choose a runtime again.");
				return;
			}
			pendingRuntime = selectedRuntime;
			modelBucket ??= runtimeModel ? resolveDiscordModelPickerPageForModel({
				data: pickerData,
				provider,
				model: runtimeModel
			}).bucket : void 0;
		} else {
			pendingRuntime = resolvePendingRuntime(provider);
			if (selectingModel && selectedModel) modelBucket ??= resolveDiscordModelPickerPageForModel({
				data: pickerData,
				provider,
				model: selectedModel
			}).bucket;
		}
		await updateModelsView(provider, {
			modelBucket,
			...selectedModel ? { pendingModel: `${provider}/${selectedModel}` } : {},
			pendingModelIndex: modelIndex,
			pendingRuntime
		});
		return;
	}
	if (parsed.action === "submit" || parsed.action === "reset" || parsed.action === "quick") {
		const resolveSubmittedModelRef = () => {
			if (parsed.action === "reset") return `${pickerData.resolvedDefault.provider}/${pickerData.resolvedDefault.model}`;
			if (parsed.modelToken) return resolveDiscordModelPickerModelRefByToken(pickerData, parsed.modelToken);
			if (parsed.action === "quick" || parsed.view === "recents") {
				if (requireModelToken) return null;
				const models = parsed.action === "quick" ? quickModels : getDiscordModelPickerRecentModelRefs(pickerData, quickModels);
				const slot = parsed.recentSlot ?? 0;
				return slot >= 1 ? models[slot - 1] ?? null : null;
			}
			const provider = parsed.provider;
			const selectedModel = resolveDiscordModelPickerModelSelection({
				data: pickerData,
				provider: provider ?? "",
				modelIndex: parsed.modelIndex,
				modelToken: parsed.modelToken,
				requireModelToken
			});
			return provider && selectedModel ? `${provider}/${selectedModel}` : null;
		};
		const modelRef = resolveSubmittedModelRef();
		const parsedModelRef = modelRef ? splitDiscordModelRef(modelRef) : null;
		if (!parsedModelRef || !pickerData.byProvider.get(parsedModelRef.provider)?.has(parsedModelRef.model)) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const resolvedModelRef = `${parsedModelRef.provider}/${parsedModelRef.model}`;
		const choices = getModelsRuntimeChoices(pickerData, parsedModelRef.provider, parsedModelRef.model);
		if (choices === void 0) {
			await showNotice("Runtime availability is not confirmed. Reopen /model to try again.");
			return;
		}
		const selectedRuntime = normalizeOptionalString(parsed.runtime) ?? resolveRuntimeToken(choices, parsed.runtimeToken);
		if (choices?.length === 0 || parsed.runtimeToken && selectedRuntime === void 0 || selectedRuntime && selectedRuntime !== "auto" && selectedRuntime !== "default" && !choices?.some((choice) => choice.id === selectedRuntime)) {
			await showNotice("That runtime is not available for this model. Reopen /model and choose again.");
			return;
		}
		const commandDefinition = findCommandByNativeName$1("model", "discord") ?? listChatCommands().find((entry) => entry.key === "model");
		if (!commandDefinition) {
			await showNotice("Sorry, /model is unavailable right now.");
			return;
		}
		const commandArgs = {
			values: { model: resolvedModelRef },
			raw: selectedRuntime ? `${resolvedModelRef} --runtime ${selectedRuntime}` : resolvedModelRef
		};
		const prompt = buildCommandTextFromArgs$1(commandDefinition, commandArgs);
		if (await showNotice(`Applying model change to ${resolvedModelRef}...`, false) === null) return;
		if (pickerData.isCurrent?.() === false) {
			await showNotice("That model picker expired. Reopen /model to try again.");
			return;
		}
		const settleMs = ctx.postApplySettleMs ?? 250;
		const noticeMessage = await (async () => {
			const failureNotice = `❌ Failed to apply ${resolvedModelRef}. Try /model ${resolvedModelRef} directly.`;
			try {
				const dispatchResult = await withTimeout(params.dispatchCommandInteraction({
					readPolicy: ctx.readPolicy,
					interaction,
					prompt,
					command: commandDefinition,
					commandArgs,
					cfg,
					discordConfig: ctx.discordConfig,
					accountId: ctx.accountId,
					sessionPrefix: ctx.sessionPrefix,
					threadBindings: ctx.threadBindings,
					suppressReplies: true,
					buildContext: ctx.buildContext,
					dispatchReplyFromConfig: ctx.dispatchReplyFromConfig,
					pluginCommandDispatch: { kind: "non-plugin" }
				}), 12e3);
				if (!dispatchResult.accepted) return failureNotice;
				const hiddenFinalReply = dispatchResult.hiddenFinalReply;
				const effectiveRoute = dispatchResult.effectiveRoute ?? route;
				if (settleMs > 0) await new Promise((resolve) => {
					setTimeout(resolve, settleMs);
				});
				const currentEntry = await createDiscordModelPickerSessionReader({
					cfg,
					route: effectiveRoute
				})();
				const currentContext = {
					...modelContext,
					route: effectiveRoute,
					sessionEntry: currentEntry
				};
				const effectiveModelRef = await resolveDiscordModelPickerCurrentModel(currentContext);
				const effectiveRuntime = resolveDiscordModelPickerCurrentRuntime(currentContext);
				const currentSelection = `Current selection: ${effectiveModelRef} with runtime ${effectiveRuntime}.`;
				if (hiddenFinalReply?.isError) return `${hiddenFinalReply.text?.trim()}\n${currentSelection}`;
				const runtime = selectedRuntime?.trim();
				const expectedRuntime = runtime === "auto" || runtime === "default" ? "auto" : runtime || void 0;
				const verified = effectiveModelRef === resolvedModelRef && (expectedRuntime === void 0 || effectiveRuntime === expectedRuntime);
				if (verified) await recordDiscordModelPickerRecentModel({
					scope: preferenceScope,
					modelRef: resolvedModelRef
				}).catch(() => void 0);
				return verified ? hiddenFinalReply?.text?.trim() || `✅ Model set to ${resolvedModelRef}.` : `⚠️ Tried to set ${resolvedModelRef}${expectedRuntime ? ` with runtime ${expectedRuntime}` : ""}, but current selection is ${effectiveModelRef} with runtime ${effectiveRuntime}.`;
			} catch (error) {
				if (error instanceof Error && error.message === "timeout") return `⏳ Model change to ${resolvedModelRef} is still processing. Check /status in a few seconds.`;
				return failureNotice;
			}
		})();
		if (await params.safeInteractionCall("model picker follow-up", () => interaction.followUp({
			...buildDiscordModelPickerNoticePayload(noticeMessage),
			ephemeral: true
		})) !== null) await recordReply(prompt, noticeMessage, "selection");
		return;
	}
	if (parsed.action === "cancel") await showNotice(`ℹ️ Model kept as ${currentModelRef}.`);
}
function createDiscordModelPickerFallbackButton$1(params) {
	return {
		type: ComponentType.Button,
		customId: `${DISCORD_MODEL_PICKER_CUSTOM_ID_KEY}:seed=btn`,
		async run(interaction, data) {
			await handleDiscordModelPickerInteraction({
				...params,
				interaction,
				data
			});
		}
	};
}
function createDiscordModelPickerFallbackSelect$1(params) {
	return {
		type: ComponentType.StringSelect,
		customId: `${DISCORD_MODEL_PICKER_CUSTOM_ID_KEY}:seed=sel`,
		async run(interaction, data) {
			await handleDiscordModelPickerInteraction({
				...params,
				interaction,
				data
			});
		}
	};
}
// extensions/discord/src/monitor/native-command.options.ts
const DISCORD_COMMAND_DESCRIPTION_MAX = 100;
function truncateDiscordCommandDescription(params) {
	return truncateUtf16Safe(params.value, DISCORD_COMMAND_DESCRIPTION_MAX);
}
function truncateDiscordCommandDescriptionLocalizations(params) {
	const entries = Object.entries(params.value ?? {});
	if (entries.length === 0) return;
	return Object.fromEntries(entries.map(([locale, description]) => [locale, truncateDiscordCommandDescription({ value: description })]));
}
function buildDiscordChoiceOptions(choices) {
	return choices.slice(0, 25).map((choice) => ({
		name: choice.label,
		value: choice.value
	}));
}
function buildDiscordCommandOptions(params) {
	const { command, cfg, resolveConfig, authorizeChoiceContext, resolveChoiceContext } = params;
	const args = command.args;
	if (!args || args.length === 0) return;
	return args.map((arg) => {
		const base = {
			name: arg.name,
			description: truncateDiscordCommandDescription({ value: arg.description }),
			required: arg.required ?? false
		};
		if (arg.type === "number" || arg.type === "boolean") return arg.type === "number" ? Object.assign(base, { type: ApplicationCommandOptionType.Number }) : Object.assign(base, { type: ApplicationCommandOptionType.Boolean });
		const resolvedChoices = resolveCommandArgChoices({
			command,
			arg,
			cfg
		});
		const autocomplete = arg.preferAutocomplete === true || resolvedChoices.length > 0 && (typeof arg.choices === "function" || resolvedChoices.length > 25) ? async (interaction) => {
			if (typeof arg.choices === "function" && resolveChoiceContext && authorizeChoiceContext && !await authorizeChoiceContext(interaction)) {
				await interaction.respond([]);
				return;
			}
			const focused = interaction.options.getFocused();
			const focusValue = normalizeLowercaseStringOrEmpty(focused?.value);
			const context = typeof arg.choices === "function" && resolveChoiceContext ? await resolveChoiceContext(interaction) : null;
			const currentCfg = resolveConfig?.() ?? cfg;
			const choiceCatalog = command.key === "think" ? getPreparedModelCatalogSnapshot({
				config: currentCfg,
				...context?.agentId ? {
					agentId: context.agentId,
					agentDir: resolveAgentDir(currentCfg, context.agentId)
				} : {}
			})?.entries : void 0;
			const choices = resolveCommandArgChoices({
				command,
				arg,
				cfg: currentCfg,
				provider: context?.provider,
				model: context?.model,
				agentRuntime: context?.agentRuntime,
				catalog: choiceCatalog
			});
			const filtered = focusValue ? choices.filter((choice) => normalizeLowercaseStringOrEmpty(choice.label).includes(focusValue)) : choices;
			await interaction.respond(buildDiscordChoiceOptions(filtered));
		} : void 0;
		return Object.assign(base, {
			type: ApplicationCommandOptionType.String,
			...autocomplete ? { autocomplete } : { choices: resolvedChoices.length > 0 ? buildDiscordChoiceOptions(resolvedChoices) : void 0 }
		});
	});
}
// extensions/discord/src/monitor/native-command.ts
const log = createSubsystemLogger("discord/native-command");
const NON_PLUGIN_COMMAND_DISPATCH = Object.freeze({ kind: "non-plugin" });
function createNativeCommandDefinition(command) {
	return {
		key: command.name,
		nativeName: command.name,
		description: command.description,
		textAliases: [],
		acceptsArgs: command.acceptsArgs,
		args: command.args,
		argsParsing: "none",
		scope: "native"
	};
}
function createDiscordNativeCommand(params) {
	const { command, ephemeralDefault, ...ctx } = params;
	const { cfg, accountId, threadBindings } = ctx;
	const fallbackCommandDefinition = createNativeCommandDefinition(command);
	const pluginCommandCandidate = "prepareDispatch" in command ? command : void 0;
	const commandDefinition = pluginCommandCandidate ? fallbackCommandDefinition : findCommandByNativeName(command.name, "discord", { includeBundledChannelFallback: false }) ?? fallbackCommandDefinition;
	const argDefinitions = commandDefinition.args ?? ("args" in command ? command.args : void 0);
	const resolveCurrentConfig = () => getRuntimeConfigSnapshot() ?? cfg;
	const readPolicy = resolveDiscordNativePolicyReader(params);
	const commandOptions = buildDiscordCommandOptions({
		command: commandDefinition,
		cfg,
		resolveConfig: resolveCurrentConfig,
		authorizeChoiceContext: async (interaction) => {
			const policy = await readDiscordInteractionPolicy(readPolicy);
			if (!policy) return false;
			return await resolveDiscordNativeAutocompleteAuthorized({
				interaction,
				...policy,
				isPolicyCurrent: policy.isCurrent,
				accountId,
				sessionPrefix: ctx.sessionPrefix,
				threadBindings,
				buildContext: ctx.buildContext,
				skipCommandOwnerAllowFrom: pluginCommandCandidate !== void 0
			});
		},
		resolveChoiceContext: async (interaction) => resolveDiscordNativeChoiceContext({
			interaction,
			cfg: resolveCurrentConfig(),
			accountId,
			threadBindings
		})
	});
	const options = commandOptions ? commandOptions : command.acceptsArgs ? [{
		name: "input",
		description: "Command input",
		type: ApplicationCommandOptionType.String,
		required: false
	}] : void 0;
	return new class extends Command {
		constructor(..._args) {
			super(..._args);
			this.name = command.name;
			this.description = truncateDiscordCommandDescription({ value: command.description });
			this.descriptionLocalizations = truncateDiscordCommandDescriptionLocalizations({ value: command.descriptionLocalizations });
			this.defer = false;
			this.ephemeral = ephemeralDefault;
			this.options = options;
		}
		async run(interaction) {
			if (await safeDiscordInteractionCall("interaction defer", () => interaction.defer({ ephemeral: this.ephemeral })) === null) return;
			let commandArgs;
			if (argDefinitions?.length) {
				const values = {};
				for (const definition of argDefinitions) {
					const getter = definition.type === "number" ? "getNumber" : definition.type === "boolean" ? "getBoolean" : "getString";
					const value = interaction.options[getter](definition.name);
					if (value != null) values[definition.name] = value;
				}
				commandArgs = Object.keys(values).length > 0 ? { values } : void 0;
			} else if (command.acceptsArgs) commandArgs = parseCommandArgs(commandDefinition, interaction.options.getString("input") ?? "");
			const commandArgsWithRaw = commandArgs ? {
				...commandArgs,
				raw: serializeCommandArgs(commandDefinition, commandArgs) ?? commandArgs.raw
			} : void 0;
			const prompt = buildCommandTextFromArgs(commandDefinition, commandArgsWithRaw);
			const preparedPluginCommand = pluginCommandCandidate?.prepareDispatch(commandArgsWithRaw?.raw);
			await dispatchDiscordCommandInteraction({
				...ctx,
				readPolicy,
				interaction,
				prompt,
				command: commandDefinition,
				commandArgs: commandArgsWithRaw,
				responseEphemeral: ephemeralDefault,
				pluginCommandDispatch: preparedPluginCommand ?? NON_PLUGIN_COMMAND_DISPATCH
			});
		}
	}();
}
async function dispatchDiscordCommandInteraction(params) {
	const { interaction, prompt, command, commandArgs, cfg: inputConfig, discordConfig: inputDiscordConfig, accountId, sessionPrefix, threadBindings, responseEphemeral, suppressReplies, buildContext, dispatchReplyFromConfig } = params;
	const policy = await params.readPolicy?.();
	const cfg = policy?.cfg ?? getRuntimeConfigSnapshot() ?? inputConfig;
	const discordConfig = policy?.discordConfig ?? inputDiscordConfig;
	const commandName = command.nativeName ?? command.key;
	const respond = async (content, options) => {
		const ephemeral = options?.ephemeral ?? responseEphemeral;
		const payload = {
			content,
			...ephemeral !== void 0 ? { ephemeral } : {}
		};
		return await safeDiscordInteractionCall("interaction reply", async () => {
			await interaction.followUp(payload);
		}) !== null;
	};
	const reject = async (content, ephemeral) => {
		await respond(content, { ephemeral });
		return { accepted: false };
	};
	const user = interaction.user;
	if (!user) return { accepted: false };
	const sender = resolveDiscordSenderIdentity({
		author: user,
		pluralkitInfo: null
	});
	const channelContext = await resolveDiscordNativeInteractionChannelContext(interaction, "");
	const { isDirectMessage, isGroupDm, isThreadChannel, channelName, channelSlug, rawChannelId, memberRoleIds, threadParentId } = channelContext;
	if (policy?.isCurrent() === false) return reject("Access policy changed. Try this interaction again.", true);
	const channelAccess = resolveDiscordNativeCommandAccessContext({
		cfg,
		accountId,
		discordConfig,
		sender,
		...channelContext,
		guild: interaction.guild ?? null
	});
	const { guildInfo, channelConfig } = channelAccess;
	let nativeRouteState;
	const getNativeRouteState = () => nativeRouteState ??= resolveDiscordNativeInteractionRouteState({
		cfg,
		accountId,
		interaction,
		channelContext,
		conversationId: rawChannelId || "unknown",
		threadBindings
	});
	const canBypassConfiguredAcpGuildGuards = () => {
		if (!interaction.guild || !shouldBypassConfiguredAcpGuildGuards(commandName)) return false;
		const routeState = getNativeRouteState();
		return routeState.effectiveRoute.matchedBy === "binding.channel" || routeState.boundSessionKey != null || routeState.configuredBinding != null;
	};
	if (channelAccess.channelDenial && !canBypassConfiguredAcpGuildGuards()) return reject(channelAccess.channelDenial === "disabled" ? "This channel is disabled." : "This channel is not allowed.");
	const dmEnabled = discordConfig?.dm?.enabled ?? true;
	const dmPolicy = resolveDiscordAccountDmPolicy({
		cfg,
		accountId
	}) ?? "pairing";
	let commandAuthorized = true;
	if (isDirectMessage) {
		if (!dmEnabled || dmPolicy === "disabled") return reject("Discord DMs are disabled.");
		const dmAccess = await resolveDiscordDmCommandAccess({
			accountId,
			dmPolicy,
			configuredAllowFrom: channelAccess.configuredDmAllowFrom,
			sender,
			allowNameMatching: channelAccess.allowNameMatching,
			cfg,
			rest: interaction.client.rest
		});
		if (policy?.isCurrent() === false) return reject("Access policy changed. Try this interaction again.", true);
		commandAuthorized = dmAccess.senderAccess.allowed ? dmAccess.commandAccess.authorized : false;
		if (dmAccess.senderAccess.decision !== "allow") {
			await handleDiscordDmCommandDecision({
				senderAccess: dmAccess.senderAccess,
				accountId,
				sender: {
					id: user.id,
					tag: sender.tag,
					name: sender.name
				},
				onPairingCreated: async (code) => {
					await respond(buildPairingReply({
						channel: "discord",
						idLine: `Your Discord user id: ${user.id}`,
						code
					}), { ephemeral: true });
				},
				onUnauthorized: async () => {
					await respond("You are not authorized to use this command.", { ephemeral: true });
				}
			});
			return { accepted: false };
		}
	}
	const groupDmAccess = resolveDiscordNativeGroupDmAccess({
		isGroupDm,
		groupEnabled: discordConfig?.dm?.groupEnabled,
		groupChannels: discordConfig?.dm?.groupChannels,
		channelId: rawChannelId,
		channelName,
		channelSlug
	});
	if (!groupDmAccess.allowed) return reject(groupDmAccess.reason === "disabled" ? "Discord group DMs are disabled." : "This group DM is not allowed.");
	if (!isDirectMessage) {
		commandAuthorized = await resolveDiscordGuildNativeCommandAuthorized({
			...channelAccess,
			memberRoleIds,
			sender,
			ownerAllowListConfigured: channelAccess.ownerAllowList != null
		});
		if (!commandAuthorized && !canBypassConfiguredAcpGuildGuards()) return reject("You are not authorized to use this command.", true);
	}
	if (policy?.isCurrent() === false) return reject("Access policy changed. Try this interaction again.", true);
	const routeState = getNativeRouteState();
	const effectiveRoute = routeState.effectiveRoute;
	const { ctxPayload, sessionKey, commandTargetSessionKey } = await buildDiscordNativeInteractionContext({
		cfg,
		buildContext,
		interaction,
		channelContext,
		route: effectiveRoute,
		boundSessionKey: routeState.boundSessionKey,
		sessionPrefix,
		prompt,
		commandArgs: commandArgs ?? {},
		channelConfig,
		guildInfo,
		allowNameMatching: channelAccess.allowNameMatching,
		commandAuthorized,
		user,
		sender
	});
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, effectiveRoute.agentId);
	if (policy?.isCurrent() === false) return reject("Access policy changed. Try this interaction again.", true);
	const authority = await createDiscordNativeCommandAuthority({
		cfg,
		ctx: ctxPayload,
		commandAuthorized,
		sender,
		allowNameMatching: channelAccess.allowNameMatching,
		isPolicyCurrent: policy?.isCurrent,
		accountId,
		guildId: interaction.guild?.id,
		commandName,
		pluginCommand: params.pluginCommandDispatch.kind === "plugin"
	});
	if (!authority.isAllowed()) return reject("You are not authorized to use this command.", true);
	const bindingReadiness = routeState.configuredBinding && !shouldBypassConfiguredAcpEnsure(commandName) ? await ensureConfiguredBindingRouteReady({
		cfg,
		bindingResolution: routeState.configuredBinding,
		assertActive: authority.assertActive
	}) : null;
	if (!authority.isAllowed()) return reject("You are not authorized to use this command.", true);
	const isGuild = Boolean(interaction.guild);
	const channelId = rawChannelId || "unknown";
	const menuNeedsModelContext = !(commandArgs?.raw && !commandArgs.values) && command.args?.some((arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null);
	const menuModelContext = menuNeedsModelContext && bindingReadiness?.ok !== false ? await resolveDiscordNativeChoiceContext({
		interaction,
		cfg,
		accountId,
		threadBindings,
		route: effectiveRoute
	}) : null;
	const menuModelCatalog = command.key === "think" && menuNeedsModelContext ? await loadCommandArgMenuModelCatalog({
		cfg,
		...menuModelContext?.agentId ? { agentId: menuModelContext.agentId } : {}
	}) : void 0;
	const menu = command.key === "verbose" && bindingReadiness?.ok === false ? null : await resolveCommandArgMenuAsync({
		command,
		args: commandArgs,
		cfg,
		session: command.key === "verbose" ? effectiveRoute : void 0,
		provider: menuModelContext?.provider,
		model: menuModelContext?.model,
		agentRuntime: menuModelContext?.agentRuntime,
		catalog: menuModelCatalog
	});
	if (policy?.isCurrent() === false) return reject("Access policy changed. Try this interaction again.", true);
	if (menu) {
		const menuPayload = buildDiscordCommandArgMenu({
			command,
			menu,
			userId: interaction.user?.id ?? ""
		});
		if (await safeDiscordInteractionCall("interaction follow-up", () => interaction.followUp({
			content: menuPayload.content,
			components: menuPayload.components,
			ephemeral: true
		})) !== null) await recordDeliveredCommandExchange({
			config: cfg,
			agentId: effectiveRoute.agentId,
			sessionKey: commandTargetSessionKey?.trim() || effectiveRoute.sessionKey,
			commandText: prompt,
			commandId: `discord:${accountId}:${channelId}:${interaction.id}`,
			replyId: "argument-menu",
			replyText: `${menuPayload.content}\n${menu.choices.map((choice) => choice.label).join(", ")}`
		});
		return { accepted: true };
	}
	if (params.pluginCommandDispatch.kind === "plugin" && commandName !== "status") {
		if (suppressReplies) {
			await settleDiscordInteractionWithoutVisibleReply(interaction);
			return { accepted: true };
		}
		const messageThreadId = !isDirectMessage && isThreadChannel ? channelId : void 0;
		const pluginThreadParentId = !isDirectMessage && isThreadChannel ? threadParentId : void 0;
		const pluginCommandAgentId = (isThreadChannel ? threadBindings.getByThreadId(rawChannelId)?.agentId : void 0) || routeState.configuredBinding?.statefulTarget.agentId || effectiveRoute.agentId;
		const targetSessionEntry = await getSessionEntryAsync({
			agentId: pluginCommandAgentId,
			sessionKey: effectiveRoute.sessionKey
		});
		authority.assertActive();
		const senderIsOwner = authority.senderIsOwner();
		const pluginReply = await params.pluginCommandDispatch.execute({
			senderId: sender.id,
			channel: "discord",
			channelId,
			isAuthorizedSender: commandAuthorized,
			senderIsOwner,
			...senderIsOwner ? { assertOwnerCurrent: authority.assertOwnerCurrent } : {},
			agentId: pluginCommandAgentId,
			sessionKey: effectiveRoute.sessionKey,
			authProfileId: targetSessionEntry?.authProfileOverride,
			commandBody: prompt,
			config: cfg,
			from: isDirectMessage ? `discord:${user.id}` : isGroupDm ? `discord:group:${channelId}` : `discord:channel:${channelId}`,
			to: `slash:${user.id}`,
			accountId,
			messageThreadId,
			threadParentId: pluginThreadParentId
		});
		if (!pluginCommandResultContinuesAgent(pluginReply)) {
			if (pluginReply.suppressReply === true) {
				await settleDiscordInteractionWithoutVisibleReply(interaction);
				return {
					accepted: true,
					effectiveRoute
				};
			}
			const recordReply = async (replyText) => {
				await recordDeliveredCommandExchange({
					config: cfg,
					agentId: pluginCommandAgentId,
					sessionKey: effectiveRoute.sessionKey,
					expectedSessionId: targetSessionEntry?.sessionId,
					commandText: prompt,
					commandId: `discord:${accountId}:${channelId}:${interaction.id}`,
					replyId: "plugin-reply",
					replyText
				});
			};
			if (hasRenderableReplyPayload(pluginReply)) await deliverDiscordInteractionReply({
				interaction,
				payload: pluginReply,
				...resolveDiscordInteractionReplyOptions({
					cfg,
					discordConfig,
					accountId
				}),
				responseEphemeral,
				onDelivered: recordReply
			});
			else if (await respond("⚠️ Command produced no visible reply.")) await recordReply(DISCORD_EMPTY_VISIBLE_REPLY_WARNING);
			return {
				accepted: true,
				effectiveRoute
			};
		}
	}
	const pickerCommandContext = shouldOpenDiscordModelPickerFromCommand({
		command,
		commandArgs
	});
	if (pickerCommandContext) {
		await replyWithDiscordModelPickerProviders({
			interaction,
			cfg,
			command: pickerCommandContext,
			userId: user.id,
			accountId,
			threadBindings,
			safeInteractionCall: safeDiscordInteractionCall
		});
		return { accepted: true };
	}
	if (bindingReadiness && !bindingReadiness.ok) {
		const configuredBinding = routeState.configuredBinding;
		if (configuredBinding) {
			logVerbose(`discord native command: configured ACP binding unavailable for channel ${configuredBinding.record.conversation.conversationId}: ${bindingReadiness.error}`);
			return reject("Configured ACP binding is unavailable right now. Please try again.");
		}
	}
	const senderIsOwner = authority.senderIsOwner();
	if (!suppressReplies && commandName === "status") {
		const statusReply = await resolveDirectStatusReplyForSession({
			cfg,
			sessionKey: commandTargetSessionKey?.trim() || sessionKey,
			channel: "discord",
			senderId: sender.id,
			senderIsOwner,
			isAuthorizedSender: commandAuthorized,
			isGroup: isGuild || isGroupDm,
			defaultGroupActivation: () => !isGuild ? "always" : channelConfig?.requireMention === false ? "always" : "mention"
		});
		const recordReply = async (replyText) => {
			await recordDeliveredCommandExchange({
				config: cfg,
				agentId: effectiveRoute.agentId,
				sessionKey: commandTargetSessionKey?.trim() || sessionKey,
				commandText: "/status",
				commandId: `discord:${accountId}:${commandTargetSessionKey?.trim() || sessionKey}:${interaction.id}`,
				replyId: "status",
				replyText
			});
		};
		if (statusReply && hasRenderableReplyPayload(statusReply)) await deliverDiscordInteractionReply({
			interaction,
			payload: statusReply,
			mediaLocalRoots,
			...resolveDiscordInteractionReplyOptions({
				cfg,
				discordConfig,
				accountId
			}),
			responseEphemeral,
			onDelivered: recordReply
		});
		else if (await respond("Status unavailable.")) await recordReply("Status unavailable.");
		return {
			accepted: true,
			effectiveRoute
		};
	}
	const { dispatched, hiddenFinalReply } = await dispatchDiscordNativeAgentReply({
		assertAuthority: authority.assertActive,
		cfg,
		discordConfig,
		accountId,
		interaction,
		ctxPayload,
		effectiveRoute,
		channelConfig,
		mediaLocalRoots,
		responseEphemeral,
		suppressReplies,
		dispatchReplyFromConfig,
		log,
		pluginCommandDispatch: params.pluginCommandDispatch
	});
	return {
		accepted: dispatched,
		effectiveRoute,
		hiddenFinalReply
	};
}
function bindDiscordCommandControl(createControl) {
	return (params) => createControl({
		ctx: {
			...params,
			readPolicy: resolveDiscordNativePolicyReader(params)
		},
		safeInteractionCall: safeDiscordInteractionCall,
		dispatchCommandInteraction: dispatchDiscordCommandInteraction
	});
}
const createDiscordCommandArgFallbackButton = bindDiscordCommandControl(createDiscordCommandArgFallbackButton$1);
const createDiscordModelPickerFallbackButton = bindDiscordCommandControl(createDiscordModelPickerFallbackButton$1);
const createDiscordModelPickerFallbackSelect = bindDiscordCommandControl(createDiscordModelPickerFallbackSelect$1);
// extensions/discord/src/monitor/agent-components-reply.ts
async function replySilently(interaction, params, onError) {
	await interaction[interaction.responseState === "deferred-update" ? "followUp" : "reply"](params).catch((error) => onError?.(error));
}
// extensions/discord/src/activities/interaction.ts
const REGISTRATION_WIDGET_ID = "AAAAAAAAAAAAAAAAAAAAAA";
const PENDING_LAUNCH_WRITE_BUDGET_MS = 250;
function createActivityButton(ctx) {
	let pendingLaunchFailureLogged = false;
	const logPendingLaunchFailure = (error) => {
		if (pendingLaunchFailureLogged) return;
		pendingLaunchFailureLogged = true;
		logError(`discord activity: failed to record pending launch: ${String(error)}`);
	};
	return {
		type: ComponentType.Button,
		customId: buildDiscordActivityCustomId(REGISTRATION_WIDGET_ID),
		customIdParser: parseDiscordActivityCustomIdForInteraction,
		async run(interaction, data) {
			if (typeof data.widgetId !== "string") {
				await replySilently(interaction, {
					content: "This widget is no longer valid.",
					ephemeral: true
				});
				return;
			}
			const runtime = getDiscordActivitiesRuntime();
			const channelId = interaction.rawData.channel_id;
			const discordUserId = interaction.userId;
			if (!runtime || !channelId || !discordUserId) logPendingLaunchFailure(/* @__PURE__ */ new Error("missing activity runtime or interaction identity"));
			else {
				const write = runtime.store.recordPendingLaunch({
					accountId: ctx.accountId,
					channelId,
					discordUserId,
					widgetId: data.widgetId,
					createdAt: Date.now()
				}).then(() => "written").catch((error) => {
					logPendingLaunchFailure(error);
					return "failed";
				});
				if (await raceWithTimeout(write, PENDING_LAUNCH_WRITE_BUDGET_MS, () => "timeout", { ref: false }) === "timeout") logPendingLaunchFailure(/* @__PURE__ */ new Error(`pending launch write exceeded ${PENDING_LAUNCH_WRITE_BUDGET_MS}ms`));
			}
			await interaction.launchActivity();
		}
	};
}
function createDiscordActivityButton(ctx, applicationId) {
	const runtime = getDiscordActivitiesRuntime();
	if (!runtime) return null;
	if (applicationId) runtime.registerApplicationId(ctx.accountId, applicationId);
	if (!runtime.resolveAccount(ctx.accountId, ctx.cfg)) return null;
	return createActivityButton(ctx);
}
// extensions/discord/src/internal/gateway-close-codes.ts
const fatalGatewayCloseCodes = /* @__PURE__ */ new Set([
	GatewayCloseCodes.AuthenticationFailed,
	GatewayCloseCodes.InvalidShard,
	GatewayCloseCodes.ShardingRequired,
	GatewayCloseCodes.InvalidAPIVersion,
	GatewayCloseCodes.InvalidIntents,
	GatewayCloseCodes.DisallowedIntents
]);
const nonResumableGatewayCloseCodes = /* @__PURE__ */ new Set([
	GatewayCloseCodes.NotAuthenticated,
	GatewayCloseCodes.InvalidSeq,
	GatewayCloseCodes.SessionTimedOut,
	GatewayCloseCodes.AlreadyAuthenticated
]);
function isFatalGatewayCloseCode(code) {
	return fatalGatewayCloseCodes.has(code);
}
function canResumeAfterGatewayClose(code) {
	return !nonResumableGatewayCloseCodes.has(code);
}
// extensions/discord/src/internal/gateway-identify-limiter.ts
const IDENTIFY_WINDOW_MS = 5e3;
var GatewayIdentifyLimiter = class {
	constructor() {
		this.nextAllowedAt = 0;
	}
	async schedule(identify) {
		for (;;) {
			const waitMs = this.nextAllowedAt - performance.now();
			if (waitMs <= 0) break;
			await new Promise((resolve) => {
				setTimeout(resolve, waitMs).unref();
			});
		}
		if (identify()) this.nextAllowedAt = performance.now() + IDENTIFY_WINDOW_MS;
	}
	reset() {
		this.nextAllowedAt = 0;
	}
};
const sharedGatewayIdentifyLimiter = new GatewayIdentifyLimiter();
// extensions/discord/src/internal/gateway-payload.ts
function ensureGatewayParams(url) {
	const parsed = new URL(url);
	parsed.searchParams.set("v", parsed.searchParams.get("v") ?? "10");
	parsed.searchParams.set("encoding", parsed.searchParams.get("encoding") ?? "json");
	return parsed.toString();
}
function decodeGatewayMessage(incoming) {
	const text = Buffer.isBuffer(incoming) ? incoming.toString("utf8") : incoming instanceof ArrayBuffer ? Buffer.from(incoming).toString("utf8") : Array.isArray(incoming) ? Buffer.concat(incoming.map((entry) => Buffer.from(entry))).toString("utf8") : String(incoming);
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
// extensions/discord/src/internal/gateway-rate-limit.ts
const GATEWAY_SEND_LIMIT = 120;
const GATEWAY_SEND_WINDOW_MS = 6e4;
const GATEWAY_SEND_QUEUE_LIMIT = GATEWAY_SEND_LIMIT;
var GatewaySendLimiter = class {
	constructor(sendNow, emitError, emitOverflowWarning) {
		this.sendNow = sendNow;
		this.emitError = emitError;
		this.emitOverflowWarning = emitOverflowWarning;
		this.outboundSendTimestamps = [];
		this.outboundQueue = [];
		this.droppedEvents = 0;
		this.overflowWarningEmitted = false;
	}
	send(serialized, options) {
		if (this.canSend(Date.now()) || options?.critical) {
			this.sendSerialized(serialized);
			return;
		}
		let shouldEmitOverflowWarning = false;
		if (this.outboundQueue.length >= GATEWAY_SEND_QUEUE_LIMIT) {
			this.outboundQueue.shift();
			this.droppedEvents += 1;
			if (!this.overflowWarningEmitted) {
				this.overflowWarningEmitted = true;
				shouldEmitOverflowWarning = true;
			}
		}
		this.outboundQueue.push(serialized);
		if (shouldEmitOverflowWarning) this.emitOverflowWarning({
			droppedEvents: this.droppedEvents,
			maxQueuedEvents: GATEWAY_SEND_QUEUE_LIMIT,
			policy: "drop-oldest",
			queuedEvents: this.outboundQueue.length
		});
		this.scheduleFlush();
	}
	clear() {
		if (this.outboundFlushTimer) {
			clearTimeout(this.outboundFlushTimer);
			this.outboundFlushTimer = void 0;
		}
		this.outboundQueue = [];
		this.droppedEvents = 0;
		this.overflowWarningEmitted = false;
	}
	pruneWindow(now) {
		const windowStart = now - GATEWAY_SEND_WINDOW_MS;
		while (this.outboundSendTimestamps.length > 0 && (this.outboundSendTimestamps[0] ?? 0) <= windowStart) this.outboundSendTimestamps.shift();
	}
	canSend(now) {
		this.pruneWindow(now);
		return this.outboundSendTimestamps.length < GATEWAY_SEND_LIMIT;
	}
	sendSerialized(serialized) {
		this.outboundSendTimestamps.push(Date.now());
		this.sendNow(serialized);
	}
	scheduleFlush() {
		if (this.outboundFlushTimer || this.outboundQueue.length === 0) return;
		const now = Date.now();
		this.pruneWindow(now);
		const oldest = this.outboundSendTimestamps[0] ?? now;
		const delayMs = this.outboundSendTimestamps.length >= GATEWAY_SEND_LIMIT ? Math.max(0, oldest + GATEWAY_SEND_WINDOW_MS - now) : 0;
		this.outboundFlushTimer = setTimeout(() => {
			this.outboundFlushTimer = void 0;
			this.flush();
		}, delayMs);
		this.outboundFlushTimer.unref();
	}
	flush() {
		while (this.outboundQueue.length > 0 && this.canSend(Date.now())) {
			const queued = this.outboundQueue.shift();
			if (queued === void 0) continue;
			try {
				this.sendSerialized(queued);
			} catch (error) {
				this.emitError(error instanceof Error ? error : new Error(String(error), { cause: error }));
				this.clear();
				return;
			}
		}
		if (this.outboundQueue.length < GATEWAY_SEND_QUEUE_LIMIT) this.overflowWarningEmitted = false;
		this.scheduleFlush();
	}
};
// extensions/discord/src/internal/gateway-voice-state-cache.ts
var DiscordGatewayVoiceStateCache = class {
	constructor() {
		this.statesByGuild = /* @__PURE__ */ new Map();
		this.transitionsByState = /* @__PURE__ */ new WeakMap();
	}
	clear() {
		this.statesByGuild.clear();
		this.transitionsByState = /* @__PURE__ */ new WeakMap();
	}
	listVoiceChannelStates(guildId, channelId) {
		const states = this.statesByGuild.get(guildId);
		if (!states) return null;
		const result = [];
		for (const state of states.values()) if (state.channel_id === channelId) result.push(state);
		return result;
	}
	takeTransition(state) {
		const transition = this.transitionsByState.get(state);
		if (!transition) return null;
		this.transitionsByState.delete(state);
		return transition;
	}
	apply(payload) {
		if (payload.t === GatewayDispatchEvents.Ready) {
			this.clear();
			return;
		}
		if (payload.t === GatewayDispatchEvents.GuildCreate) {
			const guild = payload.d;
			if (guild.unavailable) {
				this.statesByGuild.delete(guild.id);
				return;
			}
			const states = /* @__PURE__ */ new Map();
			const membersByUserId = new Map((guild.members ?? []).map((member) => [member.user.id, member]));
			for (const state of guild.voice_states) if (state.channel_id) {
				const member = state.member ?? membersByUserId.get(state.user_id);
				states.set(state.user_id, {
					...state,
					...member ? { member } : {},
					guild_id: guild.id
				});
			}
			this.statesByGuild.set(guild.id, states);
			return;
		}
		if (payload.t === GatewayDispatchEvents.VoiceStateUpdate) {
			const state = payload.d;
			const guildId = state.guild_id?.trim();
			if (!guildId) return;
			const states = this.statesByGuild.get(guildId) ?? /* @__PURE__ */ new Map();
			const previous = states.get(state.user_id);
			const current = {
				...state,
				...state.member ? {} : previous?.member ? { member: previous.member } : {},
				guild_id: guildId
			};
			this.transitionsByState.set(state, {
				current,
				...previous ? { previous } : {}
			});
			if (state.channel_id) states.set(state.user_id, current);
			else states.delete(state.user_id);
			this.statesByGuild.set(guildId, states);
			return;
		}
		if (payload.t === GatewayDispatchEvents.GuildDelete) {
			const guild = payload.d;
			this.statesByGuild.delete(guild.id);
		}
	}
};
// extensions/discord/src/internal/gateway.ts
const GatewayIntents = GatewayIntentBits;
const READY_STATE_OPEN = 1;
const DEFAULT_GATEWAY_URL = "wss://gateway.discord.gg/";
const DISCORD_GATEWAY_PAYLOAD_LIMIT_BYTES = 4096;
const DISCORD_GATEWAY_WS_CLIENT_OPTIONS = Object.freeze({
	maxPayload: 16777216,
	handshakeTimeout: 3e4
});
const INVALID_SESSION_MIN_DELAY_MS = 1e3;
const INVALID_SESSION_JITTER_MS = 4e3;
const RESUME_FAILURE_THRESHOLD = 3;
const MAX_RECONNECT_ATTEMPTS = 50;
var GatewayPlugin = class {
	constructor(options, gatewayInfo) {
		this.id = "gateway";
		this.ws = null;
		this.sequence = null;
		this.lastHeartbeatAck = true;
		this.emitter = new EventEmitter();
		this.isConnected = false;
		this.sessionId = null;
		this.selfUserId = null;
		this.resumeGatewayUrl = null;
		this.reconnectAttempts = 0;
		this.consecutiveResumeFailures = 0;
		this.shouldReconnect = false;
		this.isConnecting = false;
		this.voiceStateCache = new DiscordGatewayVoiceStateCache();
		this.outboundLimiter = new GatewaySendLimiter((payload) => {
			if (!this.ws || this.ws.readyState !== READY_STATE_OPEN) throw new Error("Discord gateway socket is not open");
			this.ws.send(payload);
		}, (error) => this.emitter.emit("error", error), (warning) => this.emitter.emit("warning", `Gateway outbound queue overflow policy=${warning.policy} droppedEvents=${warning.droppedEvents} queuedEvents=${warning.queuedEvents} maxQueuedEvents=${warning.maxQueuedEvents}`));
		this.emitAsyncError = (error) => {
			this.emitter.emit("error", error instanceof Error ? error : new Error(String(error), { cause: error }));
		};
		this.options = {
			...options,
			intents: options.intents ?? 0
		};
		this.gatewayInfo = gatewayInfo;
	}
	listVoiceChannelStates(guildId, channelId) {
		return this.voiceStateCache.listVoiceChannelStates(guildId, channelId);
	}
	async fetchGuildEmojis(guildId, fetcher) {
		return this.client ? await this.client.fetchGuildEmojis(guildId, fetcher) : await fetcher();
	}
	takeVoiceStateTransition(state) {
		return this.voiceStateCache.takeTransition(state);
	}
	async registerClient(client) {
		this.client = client;
		this.shouldReconnect = true;
		this.connect(false);
	}
	connect(resume = false) {
		this.stopReconnectTimer();
		this.stopHeartbeat();
		if (this.isConnecting) return;
		this.shouldReconnect = true;
		this.lastHeartbeatAck = true;
		this.ws?.close(1e3, "Reconnecting");
		const baseUrl = resume && this.resumeGatewayUrl ? this.resumeGatewayUrl : this.gatewayInfo?.url ?? this.options.url ?? DEFAULT_GATEWAY_URL;
		this.ws = this.createWebSocket(ensureGatewayParams(baseUrl));
		this.isConnecting = true;
		this.isConnected = false;
		const socket = this.ws;
		if (!socket) return;
		socket.on("open", () => {
			if (socket !== this.ws) return;
			this.isConnecting = false;
			this.emitter.emit("debug", "Gateway websocket opened");
		});
		socket.on("message", (incoming) => {
			if (socket !== this.ws) return;
			const payload = decodeGatewayMessage(incoming);
			if (!payload) {
				this.emitter.emit("error", /* @__PURE__ */ new Error("Invalid gateway payload"));
				return;
			}
			if (payload.s !== null && payload.s !== void 0) this.sequence = payload.s;
			switch (payload.op) {
				case GatewayOpcodes.Hello: {
					const intervalMs = asSafeIntegerInRange(asOptionalRecord(payload.d)?.heartbeat_interval, {
						min: 1,
						max: MAX_TIMER_TIMEOUT_MS
					}) ?? 45e3;
					this.stopHeartbeat();
					const scheduleHeartbeatCycle = () => {
						this.heartbeatInterval = setTimeout(() => {
							this.heartbeatInterval = void 0;
							if (!this.lastHeartbeatAck) {
								this.emitter.emit("error", /* @__PURE__ */ new Error("Gateway heartbeat ACK timeout"));
								this.scheduleReconnect({
									reason: "zombie",
									preferResume: true
								});
								return;
							}
							this.sendHeartbeat();
							scheduleHeartbeatCycle();
						}, intervalMs);
						this.heartbeatInterval.unref();
					};
					this.firstHeartbeatTimeout = setTimeout(() => {
						this.firstHeartbeatTimeout = void 0;
						this.sendHeartbeat();
						scheduleHeartbeatCycle();
					}, Math.max(0, intervalMs * Math.random()));
					this.firstHeartbeatTimeout.unref();
					const resumeState = resume ? this.getResumeState() : null;
					if (resumeState) this.send({
						op: GatewayOpcodes.Resume,
						d: {
							token: this.client?.options.token ?? "",
							session_id: resumeState.sessionId,
							seq: resumeState.sequence
						}
					}, true);
					else this.identifyWithConcurrency(socket).catch(this.emitAsyncError);
					break;
				}
				case GatewayOpcodes.HeartbeatAck:
					this.lastHeartbeatAck = true;
					break;
				case GatewayOpcodes.Heartbeat:
					this.sendHeartbeat();
					break;
				case GatewayOpcodes.Dispatch:
					this.handleDispatch(payload).catch(this.emitAsyncError);
					break;
				case GatewayOpcodes.InvalidSession:
					if (!payload.d) this.resetSessionState();
					this.scheduleReconnect({
						reason: "invalid-session",
						preferResume: payload.d,
						minDelayMs: INVALID_SESSION_MIN_DELAY_MS + Math.floor(Math.random() * INVALID_SESSION_JITTER_MS)
					});
					break;
				case GatewayOpcodes.Reconnect: this.scheduleReconnect({
					reason: "reconnect-opcode",
					preferResume: true
				});
			}
		});
		socket.on("close", (code) => {
			if (socket !== this.ws) return;
			const closeCode = code;
			this.stopHeartbeat();
			this.outboundLimiter.clear();
			this.isConnecting = false;
			this.isConnected = false;
			this.emitter.emit("debug", `Gateway websocket closed: ${code}`);
			if (!this.shouldReconnect) return;
			if (isFatalGatewayCloseCode(closeCode)) {
				this.shouldReconnect = false;
				this.emitter.emit("error", /* @__PURE__ */ new Error(`Fatal gateway close code: ${code}`));
				return;
			}
			const canResume = canResumeAfterGatewayClose(closeCode);
			if (!canResume) this.resetSessionState();
			this.scheduleReconnect({
				reason: "close",
				preferResume: canResume,
				closeCode
			});
		});
		socket.on("error", (error) => {
			if (socket !== this.ws) return;
			this.emitter.emit("error", error);
		});
	}
	disconnect() {
		this.shouldReconnect = false;
		this.stopReconnectTimer();
		this.stopHeartbeat();
		this.outboundLimiter.clear();
		this.ws?.close(1e3, "Client disconnect");
		this.ws = null;
		this.isConnecting = false;
		this.isConnected = false;
		this.reconnectAttempts = 0;
		this.consecutiveResumeFailures = 0;
		this.voiceStateCache.clear();
		this.selfUserId = null;
	}
	createWebSocket(url) {
		return new WebSocket(url, DISCORD_GATEWAY_WS_CLIENT_OPTIONS);
	}
	stopHeartbeat() {
		for (const key of ["heartbeatInterval", "firstHeartbeatTimeout"]) {
			clearTimeout(this[key]);
			this[key] = void 0;
		}
	}
	stopReconnectTimer() {
		clearTimeout(this.reconnectTimeout);
		this.reconnectTimeout = void 0;
	}
	sendHeartbeat() {
		if (!this.ws || this.ws.readyState !== READY_STATE_OPEN) return;
		this.lastHeartbeatAck = false;
		this.send({
			op: GatewayOpcodes.Heartbeat,
			d: this.sequence
		}, true);
	}
	identifyWithConcurrency(socket) {
		return sharedGatewayIdentifyLimiter.schedule(() => {
			if (socket !== this.ws) return false;
			if (socket.readyState !== READY_STATE_OPEN) {
				this.scheduleReconnect({
					reason: "identify",
					preferResume: false
				});
				return false;
			}
			this.send({
				op: GatewayOpcodes.Identify,
				d: {
					token: this.client?.options.token ?? "",
					intents: this.options.intents ?? 0,
					properties: {
						os: process.platform,
						browser: "openclaw",
						device: "openclaw"
					}
				}
			}, true);
			return true;
		});
	}
	send(payload, skipRateLimit = false) {
		if (!this.ws || this.ws.readyState !== READY_STATE_OPEN) throw new Error("Discord gateway socket is not open");
		const serialized = JSON.stringify(payload);
		if (Buffer.byteLength(serialized, "utf8") > DISCORD_GATEWAY_PAYLOAD_LIMIT_BYTES) throw new Error(`Discord gateway payload exceeds ${DISCORD_GATEWAY_PAYLOAD_LIMIT_BYTES}-byte limit`);
		this.outboundLimiter.send(serialized, { critical: skipRateLimit });
	}
	async handleDispatch(payload) {
		if (!this.client || !payload.t) return;
		if (payload.t === GatewayDispatchEvents.Ready) {
			const ready = payload.d;
			this.selfUserId = ready.user.id;
			this.sessionId = ready.session_id ?? null;
			this.resumeGatewayUrl = ready.resume_gateway_url ?? null;
		}
		if (payload.t === GatewayDispatchEvents.Ready || payload.t === GatewayDispatchEvents.Resumed) {
			this.reconnectAttempts = 0;
			this.consecutiveResumeFailures = 0;
			this.isConnected = true;
		}
		this.voiceStateCache.apply(payload);
		if (payload.t === GatewayDispatchEvents.VoiceServerUpdate || payload.t === GatewayDispatchEvents.VoiceStateUpdate && payload.d.user_id === this.selfUserId) {
			const adapter = payload.d.guild_id ? this.client.getPlugin("voice")?.adapters.get(payload.d.guild_id) : void 0;
			if (payload.t === GatewayDispatchEvents.VoiceServerUpdate) adapter?.onVoiceServerUpdate(payload.d);
			else adapter?.onVoiceStateUpdate(payload.d);
		}
		const data = payload.t === GatewayDispatchEvents.MessageCreate ? payload.d : mapGatewayDispatchData(this.client, payload.t, payload.d);
		await this.client.dispatchGatewayEvent(payload.t, data);
	}
	resetSessionState() {
		this.sessionId = null;
		this.selfUserId = null;
		this.resumeGatewayUrl = null;
		this.sequence = null;
		this.consecutiveResumeFailures = 0;
		this.voiceStateCache.clear();
	}
	getResumeState() {
		return this.sessionId && this.sequence !== null ? {
			sessionId: this.sessionId,
			sequence: this.sequence
		} : null;
	}
	scheduleReconnect(options) {
		if (!this.shouldReconnect) return;
		this.stopHeartbeat();
		this.stopReconnectTimer();
		this.ws?.close();
		this.ws = null;
		this.isConnecting = false;
		this.isConnected = false;
		this.outboundLimiter.clear();
		this.reconnectAttempts += 1;
		if (this.reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
			this.emitter.emit("error", /* @__PURE__ */ new Error(`Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached${options.closeCode !== void 0 ? ` after close code ${options.closeCode}` : ""}`));
			return;
		}
		let shouldResume = options.preferResume && this.getResumeState() !== null;
		if (shouldResume && this.consecutiveResumeFailures >= RESUME_FAILURE_THRESHOLD) {
			this.resetSessionState();
			shouldResume = false;
			this.emitter.emit("debug", `Gateway forcing fresh IDENTIFY after ${RESUME_FAILURE_THRESHOLD} failed resume attempts`);
		}
		if (shouldResume) this.consecutiveResumeFailures += 1;
		else this.consecutiveResumeFailures = 0;
		const delay = Math.max(options.minDelayMs ?? 0, Math.min(3e4, 1e3 * 2 ** Math.min(this.reconnectAttempts, 5)));
		this.emitter.emit("debug", `Gateway reconnect scheduled in ${delay}ms (${options.reason}, resume=${String(shouldResume)})`);
		this.stopReconnectTimer();
		this.reconnectTimeout = setTimeout(() => {
			this.reconnectTimeout = void 0;
			this.connect(shouldResume);
		}, delay);
		this.reconnectTimeout.unref();
	}
	updatePresence(data) {
		this.send({
			op: GatewayOpcodes.PresenceUpdate,
			d: data
		});
	}
	updateVoiceState(data) {
		this.send({
			op: GatewayOpcodes.VoiceStateUpdate,
			d: data
		}, true);
	}
};
// extensions/discord/src/voice/session.ts
const MIN_SEGMENT_SECONDS = .35;
const CAPTURE_FINALIZE_GRACE_MS = 2e3;
const VOICE_CONNECT_READY_TIMEOUT_MS = 3e4;
const VOICE_RECONNECT_GRACE_MS = 15e3;
function resolveDiscordVoiceMode(voice) {
	return voice?.mode ?? "agent-proxy";
}
function isDiscordRealtimeVoiceMode(mode) {
	return mode === "agent-proxy" || mode === "bidi";
}
function logVoiceVerbose(message) {
	logVerbose(`discord voice: ${message}`);
}
function isVoiceChannel(type) {
	return type === discord_exports.ChannelType.GuildVoice || type === discord_exports.ChannelType.GuildStageVoice;
}
// extensions/discord/src/voice/command.ts
const VOICE_CHANNEL_TYPES = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];
const DISCORD_VOICE_COMMAND_SPEC = {
	name: "vc",
	description: "Voice channel controls",
	acceptsArgs: false
};
async function authorizeVoiceCommand(interaction, params, options) {
	const channelOverride = options?.channelOverride;
	const channel = channelOverride ? void 0 : interaction.channel;
	if (!interaction.guild) return {
		ok: false,
		message: "Voice commands are only available in guilds."
	};
	const user = interaction.user;
	if (!user) return {
		ok: false,
		message: "Unable to resolve command user."
	};
	const channelId = channelOverride?.id ?? channel?.id ?? "";
	const channelContext = await resolveDiscordThreadLikeChannelContext({
		client: interaction.client,
		channel: channelOverride ?? channel,
		channelIdFallback: channelId
	});
	const channelName = channelOverride?.name ?? channelContext.channelName;
	const memberRoleIds = Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.slice() : [];
	const sender = resolveDiscordSenderIdentity({
		author: user,
		member: interaction.rawData.member
	});
	const policy = await params.readPolicy?.();
	if (policy?.isCurrent() === false) return {
		ok: false,
		message: "Access policy changed. Try this interaction again."
	};
	const currentParams = {
		...params,
		...policy
	};
	const voiceAccess = resolveDiscordVoiceAccess(currentParams);
	const access = await authorizeDiscordVoiceIngress({
		cfg: currentParams.cfg,
		discordConfig: currentParams.discordConfig,
		accountId: currentParams.accountId,
		groupPolicy: currentParams.groupPolicy,
		guild: interaction.guild,
		guildId: interaction.guild.id,
		channelId,
		channelName,
		channelSlug: channelContext.channelSlug,
		parentId: channelOverride?.parentId ?? channelContext.threadParentId,
		parentName: channelContext.threadParentName,
		parentSlug: channelContext.threadParentSlug,
		scope: channelContext.isThreadChannel ? "thread" : "channel",
		channelLabel: channelId ? formatMention({ channelId }) : "This channel",
		memberRoleIds,
		admissionAllowFrom: voiceAccess.admissionAllowFrom,
		sender: {
			id: sender.id,
			name: sender.name,
			tag: sender.tag
		}
	});
	if (!access.ok) return {
		ok: false,
		message: access.message
	};
	return {
		ok: true,
		guildId: interaction.guild.id
	};
}
function createDiscordVoiceCommand(startupParams) {
	const params = {
		...startupParams,
		readPolicy: startupParams.readPolicy ?? createDiscordLivePolicyReader({
			...startupParams,
			discordConfig: {
				...startupParams.discordConfig,
				groupPolicy: startupParams.groupPolicy
			},
			resolvedAllowlist: {
				guildEntries: startupParams.discordConfig.guilds,
				allowFrom: startupParams.discordConfig.allowFrom
			}
		})
	};
	class VoiceCommand extends Command {
		constructor(..._args) {
			super(..._args);
			this.defer = true;
			this.ephemeral = params.ephemeralDefault;
		}
		async run(interaction) {
			const content = await this.execute(interaction);
			await interaction.reply({
				content,
				ephemeral: true
			});
		}
	}
	class JoinCommand extends VoiceCommand {
		constructor(..._args2) {
			super(..._args2);
			this.name = "join";
			this.description = "Join a voice channel";
			this.options = [{
				name: "channel",
				description: "Voice channel to join",
				type: ApplicationCommandOptionType.Channel,
				required: true,
				channel_types: VOICE_CHANNEL_TYPES
			}];
		}
		async execute(interaction) {
			const channel = await interaction.options.getChannel("channel", true);
			if (!channel || !("id" in channel)) return "Voice channel not found.";
			const access = await authorizeVoiceCommand(interaction, params, { channelOverride: {
				id: channel.id,
				name: resolveDiscordChannelNameSafe(channel)
			} });
			if (!access.ok) return access.message;
			if (!isVoiceChannel(channel.type)) return "That is not a voice channel.";
			const manager = params.getManager();
			if (!manager) return "Voice manager is not available yet.";
			return (await manager.join({
				guildId: access.guildId,
				channelId: channel.id
			})).message;
		}
	}
	class SessionCommand extends VoiceCommand {
		constructor(name) {
			super();
			this.name = name;
			this.description = name === "leave" ? "Leave the current voice channel" : "Show active voice sessions";
		}
		async execute(interaction) {
			const guildId = interaction.guild?.id;
			if (!guildId) return "Unable to resolve guild for this command.";
			const manager = params.getManager();
			if (!manager) return "Voice manager is not available yet.";
			const sessions = manager.status().filter((entry) => entry.guildId === guildId);
			const sessionChannelId = sessions[0]?.channelId;
			const access = await authorizeVoiceCommand(interaction, params, { channelOverride: sessionChannelId ? { id: sessionChannelId } : void 0 });
			if (!access.ok) return access.message;
			if (this.name === "leave") return (await manager.leave({ guildId })).message;
			if (sessions.length === 0) return "No active voice sessions.";
			return sessions.map((entry) => `• ${formatMention({ channelId: entry.channelId })} (guild ${entry.guildId})${entry.warning ? `\n${entry.warning}` : ""}`).join("\n");
		}
	}
	return new class extends CommandWithSubcommands {
		constructor(..._args3) {
			super(..._args3);
			this.name = DISCORD_VOICE_COMMAND_SPEC.name;
			this.description = DISCORD_VOICE_COMMAND_SPEC.description;
			this.subcommands = [
				new JoinCommand(),
				new SessionCommand("leave"),
				new SessionCommand("status")
			];
		}
	}();
}
// extensions/discord/src/monitor/agent-components-context.ts
function resolveAgentComponentRoute(params) {
	return resolveAgentRoute({
		cfg: params.ctx.cfg,
		channel: "discord",
		accountId: params.ctx.accountId,
		guildId: params.rawGuildId,
		memberRoleIds: params.memberRoleIds,
		peer: {
			kind: params.isDirectMessage ? "direct" : params.isGroupDm ? "group" : "channel",
			id: params.isDirectMessage ? params.userId : params.channelId
		},
		parentPeer: params.parentId ? {
			kind: "channel",
			id: params.parentId
		} : void 0
	});
}
async function ackComponentInteraction(params) {
	await replySilently(params.interaction, {
		content: "✓",
		ephemeral: true
	}, (err) => {
		logError(`${params.label}: failed to acknowledge interaction: ${String(err)}`);
	});
}
async function replyUnavailableComponentInteraction(interaction, content) {
	await replySilently(interaction, {
		content,
		ephemeral: true
	});
}
function resolveDiscordChannelContext(interaction) {
	const channel = interaction.channel;
	const channelInfo = resolveDiscordChannelInfoSafe(channel);
	const channelName = channelInfo.name;
	const channelSlug = channelName ? normalizeDiscordSlug(channelName) : "";
	const displayChannelSlug = channelName ? normalizeDiscordDisplaySlug(channelName) : "";
	const channelType = channelInfo.type;
	const isThread = isDiscordThreadChannelType(channelType);
	const parentId = isThread ? channelInfo.parentId : void 0;
	const parentName = isThread ? channelInfo.parentName : void 0;
	return {
		channelName,
		channelSlug,
		displayChannelSlug,
		channelType,
		isThread,
		parentId,
		parentName,
		parentSlug: parentName ? normalizeDiscordSlug(parentName) : ""
	};
}
async function resolveComponentInteractionContext(params) {
	const { interaction, label } = params;
	const channelId = interaction.rawData.channel_id;
	if (!channelId) {
		logError(`${label}: missing channel_id in interaction`);
		return null;
	}
	const user = interaction.user;
	if (!user) {
		logError(`${label}: missing user in interaction`);
		return null;
	}
	const username = user.discriminator && user.discriminator !== "0" ? `${user.username}#${user.discriminator}` : user.username;
	const userId = user.id;
	const rawGuildId = interaction.rawData.guild_id;
	const channelType = resolveDiscordChannelContext(interaction).channelType;
	const isGroupDm = channelType === ChannelType.GroupDM;
	return {
		channelId,
		user,
		username,
		userId,
		rawGuildId,
		isDirectMessage: channelType === ChannelType.DM || !rawGuildId && !isGroupDm && channelType == null,
		isGroupDm,
		memberRoleIds: Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.slice() : []
	};
}
// extensions/discord/src/monitor/agent-components-data.ts
function readParsedId(data, key) {
	if (!data || typeof data !== "object") return;
	return key in data ? data[key] : data[key === "cid" ? "componentId" : "modalId"];
}
function normalizeComponentId(value) {
	if (typeof value === "string") return normalizeOptionalString(value);
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
}
function mapOptionLabels(options, values) {
	if (!options || options.length === 0) return values;
	const map = new Map(options.map((option) => [option.value, option.label]));
	return values.map((value) => map.get(value) ?? value);
}
function parseAgentComponentData(data) {
	const raw = readParsedId(data, "cid");
	const componentId = typeof raw === "string" ? decodeCustomIdComponent(raw) : typeof raw === "number" ? String(raw) : null;
	if (!componentId) return null;
	return { componentId };
}
function parseDiscordComponentData(data, customId) {
	if (!data || typeof data !== "object") return null;
	const rawComponentId = readParsedId(data, "cid");
	const rawModalId = readParsedId(data, "mid");
	let componentId = normalizeComponentId(rawComponentId);
	let modalId = normalizeComponentId(rawModalId);
	if (!componentId && customId) {
		const parsed = parseDiscordComponentCustomId(customId);
		if (parsed) {
			componentId = parsed.componentId;
			modalId = parsed.modalId;
		}
	}
	if (!componentId) return null;
	return {
		componentId,
		modalId
	};
}
function parseDiscordModalId(data, customId) {
	const modalId = normalizeComponentId(readParsedId(data, "mid"));
	if (modalId) return modalId;
	if (customId) return parseDiscordModalCustomId(customId);
	return null;
}
function resolveInteractionCustomId(interaction) {
	return normalizeOptionalString(interaction.rawData.data?.custom_id);
}
function mapSelectValues(entry, values) {
	switch (entry.selectType) {
		case "string": return mapOptionLabels(entry.options, values);
		case "user":
		case "role":
		case "mentionable":
		case "channel": return values.map((value) => `${entry.selectType}:${value}`);
		default: return values;
	}
}
function resolveModalFieldValues(field, interaction) {
	const fields = interaction.fields;
	const required = field.required === true;
	try {
		switch (field.type) {
			case "text": {
				const value = fields.getText(field.id, required);
				return value ? [value] : [];
			}
			case "select":
			case "checkbox":
			case "radio": return mapOptionLabels(field.options, fields.getStringSelect(field.id, required));
			case "role-select": return fields.getRoleSelect(field.id, required).map((role) => role.name || role.id);
			case "user-select": return fields.getUserSelect(field.id, required).map(formatDiscordUserTag);
			default: return [];
		}
	} catch (err) {
		logError(`agent modal: failed to read field ${field.id}: ${String(err)}`);
		return [];
	}
}
function formatModalSubmissionText(entry, interaction) {
	const title = `Form "${entry.title}" submitted.`;
	const lines = entry.fields.flatMap((field) => {
		const values = resolveModalFieldValues(field, interaction);
		return values.length > 0 ? [`- ${field.label}: ${values.join(", ")}`] : [];
	});
	return [title, ...lines.length > 0 ? lines : ["- (no values)"]].join("\n");
}
// extensions/discord/src/monitor/agent-components-live-policy.ts
async function resolveAgentComponentPolicyContext(params) {
	if (!params.ctx.readPolicy) return params.ctx;
	try {
		const policy = await readDiscordInteractionPolicy(params.ctx.readPolicy);
		if (!policy) {
			await replyUnavailableComponentInteraction(params.interaction, "Access policy is still updating. Try this interaction again.");
			return null;
		}
		return {
			...params.ctx,
			...policy,
			isPolicyCurrent: policy.isCurrent,
			readPolicy: void 0
		};
	} catch (error) {
		await replyUnavailableComponentInteraction(params.interaction, "Could not verify the current access policy. Try this interaction again.");
		throw error;
	}
}
// extensions/discord/src/monitor/agent-components-dm-auth.ts
async function ensureDmComponentAuthorized(params) {
	const { ctx, interaction, user, componentLabel } = params;
	const dmPolicy = ctx.dmPolicy ?? "pairing";
	if (ctx.discordConfig?.dm?.enabled === false || dmPolicy === "disabled") {
		logVerbose(`agent ${componentLabel}: blocked (DM policy disabled)`);
		await replyUnavailableComponentInteraction(interaction, "DM interactions are disabled.");
		return false;
	}
	const access = await resolveDiscordDmCommandAccess({
		accountId: ctx.accountId,
		dmPolicy,
		configuredAllowFrom: ctx.allowFrom ?? [],
		sender: {
			id: user.id,
			name: user.username,
			tag: formatDiscordUserTag(user)
		},
		allowNameMatching: isDangerousNameMatchingEnabled(ctx.discordConfig),
		cfg: ctx.cfg,
		token: ctx.token,
		readStoreAllowFrom: async ({ accountId, dmPolicy: dmPolicyLocal }) => await readChannelIngressStoreAllowFromForDmPolicy({
			provider: "discord",
			accountId,
			dmPolicy: dmPolicyLocal
		}),
		eventKind: "button"
	});
	if (ctx.isPolicyCurrent?.() === false) {
		await replyUnavailableComponentInteraction(interaction, "Access policy changed. Try this interaction again.");
		return false;
	}
	if (access.senderAccess.decision === "allow") return true;
	if (access.senderAccess.decision !== "pairing") {
		logVerbose(`agent ${componentLabel}: blocked DM user ${user.id} (not in allowFrom)`);
		await replyUnavailableComponentInteraction(interaction, `You are not authorized to use this ${componentLabel}.`);
		return false;
	}
	if (!(await createChannelPairingChallengeIssuer({
		channel: "discord",
		accountId: ctx.accountId,
		upsertPairingRequest: ({ id, meta }) => upsertChannelPairingRequest({
			channel: "discord",
			id,
			accountId: ctx.accountId,
			meta
		})
	})({
		senderId: user.id,
		senderIdLine: `Your Discord user id: ${user.id}`,
		meta: {
			tag: formatDiscordUserTag(user),
			name: user.username
		},
		sendPairingReply: async (text) => {
			await interaction.reply({
				content: text,
				ephemeral: true
			});
		}
	})).created) await replyUnavailableComponentInteraction(interaction, "Pairing already requested. Ask the bot owner to approve your code.");
	return false;
}
async function ensureGroupDmComponentAuthorized(params) {
	const { ctx, interaction, channelId, componentLabel } = params;
	if (!(ctx.discordConfig?.dm?.groupEnabled ?? false)) {
		logVerbose(`agent ${componentLabel}: blocked group dm ${channelId} (group DMs disabled)`);
		await replyUnavailableComponentInteraction(interaction, "Group DM interactions are disabled.");
		return false;
	}
	const channelCtx = resolveDiscordChannelContext(interaction);
	if (resolveGroupDmAllow({
		channels: ctx.discordConfig?.dm?.groupChannels,
		channelId,
		channelName: channelCtx.channelName,
		channelSlug: channelCtx.channelSlug
	})) return true;
	logVerbose(`agent ${componentLabel}: blocked group dm ${channelId} (not allowlisted)`);
	await replyUnavailableComponentInteraction(interaction, `You are not authorized to use this ${componentLabel}.`);
	return false;
}
async function resolveInteractionContextWithDmAuth(params) {
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return null;
	const interactionCtx = await resolveComponentInteractionContext({
		interaction: params.interaction,
		label: params.label
	});
	if (!interactionCtx) return null;
	if (ctx.isPolicyCurrent?.() === false) {
		await replyUnavailableComponentInteraction(params.interaction, "Access policy changed. Try this interaction again.");
		return null;
	}
	const authorize = interactionCtx.isDirectMessage ? ensureDmComponentAuthorized : interactionCtx.isGroupDm ? ensureGroupDmComponentAuthorized : void 0;
	if (authorize && !await authorize({
		...params,
		...interactionCtx,
		ctx
	})) return null;
	return interactionCtx;
}
// extensions/discord/src/monitor/agent-components-guild-auth.ts
function resolveComponentGuildContext(params) {
	const guildInfo = resolveDiscordGuildEntry({
		guild: params.interaction.guild ?? void 0,
		guildId: params.rawGuildId,
		guildEntries: params.ctx.guildEntries
	});
	const channelCtx = resolveDiscordChannelContext(params.interaction);
	const channelConfig = resolveDiscordChannelConfigWithFallback({
		guildInfo,
		channelId: params.channelId,
		channelName: channelCtx.channelName,
		channelSlug: channelCtx.channelSlug,
		parentId: channelCtx.parentId,
		parentName: channelCtx.parentName,
		parentSlug: channelCtx.parentSlug,
		scope: channelCtx.isThread ? "thread" : "channel"
	});
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.ctx.cfg.channels?.discord !== void 0,
		groupPolicy: params.ctx.discordConfig?.groupPolicy,
		defaultGroupPolicy: params.ctx.cfg.channels?.defaults?.groupPolicy
	});
	return {
		guildInfo,
		channelCtx,
		channelConfig,
		groupPolicy,
		allowNameMatching: isDangerousNameMatchingEnabled(params.ctx.discordConfig)
	};
}
async function ensureGuildComponentMemberAllowed(params) {
	const { interaction, guildInfo, channelConfig, user, componentLabel, unauthorizedReply } = params;
	if (!params.rawGuildId) return true;
	if (channelConfig?.enabled === false || !resolveDiscordChannelPolicyCommandAuthorizer({
		groupPolicy: params.groupPolicy,
		guildInfo,
		channelConfig
	}).allowed || channelConfig?.allowed === false) {
		await replyUnavailableComponentInteraction(interaction, unauthorizedReply);
		return false;
	}
	const { memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig,
		guildInfo,
		memberRoleIds: params.memberRoleIds,
		sender: {
			id: user.id,
			name: user.username,
			tag: user.discriminator ? `${user.username}#${user.discriminator}` : void 0
		},
		allowNameMatching: params.allowNameMatching
	});
	if (memberAllowed) return true;
	logVerbose(`agent ${componentLabel}: blocked user ${user.id} (not in users/roles allowlist)`);
	await replyUnavailableComponentInteraction(interaction, unauthorizedReply);
	return false;
}
async function ensureAgentComponentInteractionAllowed(params) {
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return null;
	const guildContext = resolveComponentGuildContext({
		...params,
		ctx
	});
	if (!await ensureGuildComponentMemberAllowed({
		...params,
		...guildContext,
		groupPolicy: guildContext.groupPolicy
	})) return null;
	if (ctx.isPolicyCurrent?.() === false) {
		await replyUnavailableComponentInteraction(params.interaction, "Access policy changed. Try this interaction again.");
		return null;
	}
	return { parentId: guildContext.channelCtx.parentId };
}
async function resolveAuthorizedComponentInteraction(params) {
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return null;
	const interactionCtx = await resolveInteractionContextWithDmAuth({
		ctx,
		interaction: params.interaction,
		label: params.label,
		componentLabel: params.componentLabel
	});
	if (!interactionCtx) return null;
	const guildContext = resolveComponentGuildContext({
		...params,
		...interactionCtx,
		ctx
	});
	if (!await ensureGuildComponentMemberAllowed({
		...params,
		...interactionCtx,
		...guildContext,
		groupPolicy: guildContext.groupPolicy
	})) return null;
	const { channelConfig, guildInfo, allowNameMatching } = guildContext;
	const commandAuthorized = await (async () => {
		if (interactionCtx.isDirectMessage) return true;
		const sender = {
			id: interactionCtx.user.id,
			name: interactionCtx.user.username,
			tag: formatDiscordUserTag(interactionCtx.user)
		};
		const { ownerAllowList, ownerAllowed: ownerOk } = resolveDiscordOwnerAccess({
			allowFrom: ctx.allowFrom,
			sender,
			allowNameMatching
		});
		const { hasAccessRestrictions, memberAllowed: commandMemberAllowed } = resolveDiscordMemberAccessState({
			channelConfig,
			guildInfo,
			memberRoleIds: interactionCtx.memberRoleIds,
			sender,
			allowNameMatching
		});
		return resolveCommandAuthorizedFromAuthorizers({
			useAccessGroups: true,
			authorizers: [{
				configured: ownerAllowList != null,
				allowed: ownerOk
			}, {
				configured: hasAccessRestrictions,
				allowed: commandMemberAllowed
			}],
			modeWhenAccessGroupsOff: "configured"
		});
	})();
	if (ctx.isPolicyCurrent?.() === false) {
		await replyUnavailableComponentInteraction(params.interaction, "Access policy changed. Try this interaction again.");
		return null;
	}
	if (params.allowedUsers !== void 0) {
		const { interaction, componentLabel, unauthorizedReply, allowedUsers } = params;
		const user = interactionCtx.user;
		const componentAllowNameMatching = guildContext.allowNameMatching;
		async function ensureComponentUserAllowed() {
			const allowList = normalizeDiscordAllowList(allowedUsers, [
				"discord:",
				"user:",
				"pk:"
			]);
			if (!allowList) return true;
			if (resolveDiscordAllowListMatch({
				allowList,
				candidate: {
					id: user.id,
					name: user.username,
					tag: formatDiscordUserTag(user)
				},
				allowNameMatching: componentAllowNameMatching
			}).allowed) return true;
			logVerbose(`discord component ${componentLabel}: blocked user ${user.id} (not in allowedUsers)`);
			await replyUnavailableComponentInteraction(interaction, unauthorizedReply);
			return false;
		}
		if (!await ensureComponentUserAllowed()) return null;
	}
	return {
		ctx,
		interactionCtx,
		channelCtx: guildContext.channelCtx,
		guildInfo: guildContext.guildInfo,
		channelConfig: guildContext.channelConfig,
		commandAuthorized
	};
}
// extensions/discord/src/monitor/reply-context.ts
function resolveReplyContext(message, resolveDiscordMessageText) {
	const id = resolveDiscordReferencedReplyMessageId(message);
	if (!id) return null;
	const referenced = resolveDiscordReferencedReplyMessage(message);
	if (!referenced?.author || referenced.id !== id) return null;
	const referencedText = resolveDiscordMessageText(referenced, { includeForwarded: true });
	const sender = resolveDiscordSenderIdentity({
		author: referenced.author,
		pluralkitInfo: null
	});
	return {
		id,
		sender: sender.tag ?? sender.label ?? "unknown",
		senderId: referenced.author.id,
		senderName: referenced.author.username,
		senderTag: sender.tag,
		memberRoleIds: referenced.member?.roles,
		...referencedText ? { body: referencedText } : {}
	};
}
function buildDirectLabel(author) {
	return `${resolveDiscordSenderIdentity({
		author,
		pluralkitInfo: null
	}).tag ?? "unknown"} user id:${author.id}`;
}
function buildGuildLabel(params) {
	const { guild, channelName, channelId } = params;
	return `${guild?.name ?? "Guild"} #${channelName} channel id:${channelId}`;
}
// extensions/discord/src/monitor/reply-safety.ts
const DISCORD_INTERNAL_CHANNEL_LINE_RE = /^(?:>\s*)?(?:analysis|commentary|thinking|reasoning)\s*[:=]/i;
function hasNonEmptyRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0);
}
function hasInteractiveOrPresentationBlocks(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	if (typeof record.title === "string" && record.title.trim().length > 0) return true;
	return Array.isArray(record.blocks) && record.blocks.length > 0;
}
function collapseExcessBlankLines(text) {
	return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}
function stripDiscordInternalChannelLines(text) {
	let inFence = false;
	const kept = [];
	for (const line of text.split(/\r?\n/)) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			kept.push(line);
			continue;
		}
		if (!inFence && DISCORD_INTERNAL_CHANNEL_LINE_RE.test(line.trim())) continue;
		kept.push(line);
	}
	return kept.join("\n");
}
function sanitizeDiscordFrontChannelText(text) {
	const withoutToolCallBlocks = stripPlainTextToolCallBlocks(text, { resolveProtectedRanges: findCodeRegions });
	const withoutAssistantScaffolding = sanitizeAssistantVisibleText(withoutToolCallBlocks);
	return collapseExcessBlankLines(stripDiscordInternalChannelLines(stripPlainTextToolCallBlocks(withoutAssistantScaffolding, { resolveProtectedRanges: findCodeRegions }))).trim();
}
function sanitizeDiscordFrontChannelReplyPayloads(payloads, options = {}) {
	const preserveVerboseToolProgress = options.kind === "tool";
	const safePayloads = [];
	for (const payload of payloads) {
		const safeText = typeof payload.text === "string" ? preserveVerboseToolProgress ? collapseExcessBlankLines(sanitizeAssistantVisibleTextWithProfile(payload.text, "tool-progress")).trim() : sanitizeDiscordFrontChannelText(payload.text) : payload.text;
		const nextPayload = safeText === payload.text ? payload : {
			...payload,
			text: safeText || void 0
		};
		if (!resolveSendableOutboundReplyParts(nextPayload).hasContent && !(nextPayload.audioAsVoice === true || hasNonEmptyRecord(nextPayload.channelData) || hasInteractiveOrPresentationBlocks(nextPayload.interactive) || hasInteractiveOrPresentationBlocks(nextPayload.presentation))) continue;
		safePayloads.push(nextPayload);
	}
	return safePayloads;
}
// extensions/discord/src/monitor/reply-delivery.ts
function formatDiscordReplyContext(target, sessionKey) {
	return `target=${target}${sessionKey ? ` session=${sessionKey}` : ""}`;
}
function formatDiscordReplyDeliveryFailure(params) {
	const context = formatDiscordReplyContext(params.target, params.sessionKey);
	return `discord ${params.kind} reply failed (${context}): ${String(params.err)}`;
}
function formatDiscordReplySkip(params) {
	const context = formatDiscordReplyContext(params.target, params.sessionKey);
	return `discord ${params.kind} reply skipped (${params.reason}): ${context}`;
}
function resolveBoundThreadBinding(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!params.threadBindings || !sessionKey) return;
	const targetChannelId = params.target.startsWith("channel:") ? params.target.slice(8).trim() : void 0;
	if (!targetChannelId) return;
	return params.threadBindings.listBySessionKey(sessionKey).find((entry) => entry.threadId === targetChannelId);
}
function resolveBindingIdentity(cfg, binding) {
	if (!binding) return;
	const baseLabel = binding.label?.trim() || binding.agentId;
	if (!baseLabel) return;
	const displayName = `🤖 ${baseLabel}`.trim();
	const identity = { name: truncateUtf16Safe(displayName, 80) };
	try {
		const avatar = binding.agentId ? resolveAgentAvatar(cfg, binding.agentId) : void 0;
		if (avatar?.kind === "remote") identity.avatarUrl = avatar.url;
	} catch {}
	return identity;
}
function formatDiscordReasoningPayload(payload) {
	if (payload.isReasoning !== true) return payload;
	const text = typeof payload.text === "string" ? payload.text.trim() : "";
	const nextPayload = {
		...payload,
		text: formatReasoningMessage(text)
	};
	delete nextPayload.isReasoning;
	return nextPayload;
}
async function deliverDiscordReply(params) {
	const binding = resolveBoundThreadBinding(params);
	const to = binding ? `channel:${binding.channelId}` : params.target;
	const payloads = sanitizeDiscordFrontChannelReplyPayloads(params.replies, { kind: params.kind }).map(formatDiscordReasoningPayload).map((payload) => params.bindPendingFinalDelivery?.(payload) ?? payload);
	if (payloads.length === 0) return {
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
	const { cfg, token, rest, allowedMentions } = params;
	const send = await sendDurableMessageBatch({
		cfg: params.cfg,
		channel: "discord",
		to,
		accountId: params.accountId,
		payloads,
		replyToId: normalizeOptionalString(params.replyToId),
		replyToMode: params.replyToMode ?? "all",
		formatting: {
			textLimit: params.textLimit,
			maxLinesPerMessage: params.maxLinesPerMessage,
			tableMode: params.tableMode,
			chunkMode: params.chunkMode
		},
		threadId: binding?.threadId,
		identity: resolveBindingIdentity(params.cfg, binding),
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertPlatformSendAuthorized,
		deps: {
			discord: (recipient, text, opts) => sendMessageDiscord(recipient, text, {
				...opts,
				cfg: opts?.cfg ?? cfg,
				token,
				rest,
				...allowedMentions ? { allowedMentions } : {}
			}),
			discordVoice: (recipient, audioPath, opts) => sendVoiceMessageDiscord(recipient, audioPath, {
				...opts,
				cfg: opts?.cfg ?? cfg,
				token,
				rest
			})
		},
		mediaAccess: params.mediaLocalRoots?.length ? { localRoots: params.mediaLocalRoots } : void 0,
		session: buildOutboundSessionContext({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: binding?.agentId,
			requesterAccountId: params.accountId
		})
	});
	if (send.status === "failed") throw send.error;
	if (send.status === "suppressed") {
		const hookEffect = send.payloadOutcomes?.find((outcome) => outcome.status === "suppressed")?.hookEffect;
		return {
			visibleReplySent: false,
			suppression: {
				reason: send.reason,
				...hookEffect?.cancelReason ? { cancelReason: hookEffect.cancelReason } : {},
				...hookEffect?.metadata ? { metadata: hookEffect.metadata } : {}
			}
		};
	}
	if (send.results.length === 0) throw new Error(`discord final reply produced no delivered message for ${to}`);
	const deliveryResult = {
		messageIds: listMessageReceiptPlatformIds(send.receipt),
		receipt: send.receipt,
		visibleReplySent: true
	};
	if (send.status === "partial_failed") throw createChannelPartialDeliveryError(send.error, deliveryResult);
	return deliveryResult;
}
// extensions/discord/src/monitor/agent-components.dispatch.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/reply-runtime"));
const loadTypingRuntime = createLazyRuntimeModule(() => import("./typing-DAv4S2fI.mjs").then((n) => n.n));
function buildDiscordComponentConversationLabel(params) {
	if (params.interactionCtx.isDirectMessage) return buildDirectLabel(params.interactionCtx.user);
	if (params.interactionCtx.isGroupDm) return `Group DM #${params.channelCtx.channelName ?? params.interactionCtx.channelId} channel id:${params.interactionCtx.channelId}`;
	return buildGuildLabel({
		guild: params.interaction.guild ?? void 0,
		channelName: params.channelCtx.channelName ?? params.interactionCtx.channelId,
		channelId: params.interactionCtx.channelId
	});
}
async function dispatchDiscordComponentEvent(params) {
	const { ctx, interaction, interactionCtx, channelCtx, guildInfo, eventText } = params;
	const { channelConfig, commandAuthorized } = params;
	const route = resolveAgentComponentRoute({
		ctx,
		...interactionCtx,
		parentId: channelCtx.parentId
	});
	const sessionKey = params.routeOverrides?.sessionKey ?? route.sessionKey;
	const agentId = params.routeOverrides?.agentId ?? route.agentId;
	const accountId = params.routeOverrides?.accountId ?? route.accountId;
	const fromLabel = buildDiscordComponentConversationLabel(params);
	const chatType = interactionCtx.isDirectMessage ? "direct" : interactionCtx.isGroupDm ? "group" : "channel";
	const senderName = interactionCtx.user.globalName ?? interactionCtx.user.username;
	const senderUsername = interactionCtx.user.username;
	const senderTag = formatDiscordUserTag(interactionCtx.user);
	const groupChannel = !interactionCtx.isDirectMessage && channelCtx.displayChannelSlug ? `#${channelCtx.displayChannelSlug}` : void 0;
	const allowNameMatching = isDangerousNameMatchingEnabled(ctx.discordConfig);
	const { ownerAllowFrom, groupSystemPrompt, toolPolicy } = buildDiscordInboundAccessContext({
		cfg: ctx.cfg,
		accountId,
		parentId: channelCtx.parentId,
		channelConfig,
		guildInfo,
		sender: {
			id: interactionCtx.user.id,
			name: interactionCtx.user.username,
			tag: senderTag
		},
		senderName,
		senderUsername,
		allowNameMatching,
		isGuild: !interactionCtx.isDirectMessage
	});
	const pinnedMainDmOwner = interactionCtx.isDirectMessage ? resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: ctx.cfg.session?.dmScope,
		allowFrom: channelConfig?.users ?? guildInfo?.users,
		normalizeEntry: (entry) => {
			const candidate = normalizeDiscordAllowList([entry], [
				"discord:",
				"user:",
				"pk:"
			])?.ids.values().next().value;
			return typeof candidate === "string" && /^\d+$/.test(candidate) ? candidate : void 0;
		}
	}) : null;
	const storePath = resolveStorePath(ctx.cfg.session?.store, { agentId });
	const envelopeOptions = resolveEnvelopeFormatOptions(ctx.cfg);
	const previousTimestamp = await readSessionUpdatedAtAsync({
		storePath,
		sessionKey
	});
	const originatingTo = resolveDiscordConversationIdentity({
		isDirectMessage: interactionCtx.isDirectMessage,
		userId: interactionCtx.userId,
		channelId: interactionCtx.channelId
	});
	const timestamp = Date.now();
	const combinedBody = formatInboundEnvelope({
		channel: "Discord",
		from: fromLabel,
		timestamp,
		body: eventText,
		chatType,
		senderLabel: senderName,
		previousTimestamp,
		envelope: envelopeOptions
	});
	const { createReplyReferencePlanner, finalizeInboundContext, resolveChunkMode, resolveTextChunkLimit } = await loadReplyRuntime();
	const ctxPayload = finalizeInboundContext({
		Body: combinedBody,
		BodyForAgent: eventText,
		RawBody: eventText,
		CommandBody: eventText,
		From: interactionCtx.isDirectMessage ? `discord:${interactionCtx.userId}` : interactionCtx.isGroupDm ? `discord:group:${interactionCtx.channelId}` : `discord:channel:${interactionCtx.channelId}`,
		To: `channel:${interactionCtx.channelId}`,
		SessionKey: sessionKey,
		AccountId: accountId,
		ChatType: chatType,
		...buildDiscordConversationRouteContext({
			isDirectMessage: interactionCtx.isDirectMessage,
			isGroupDm: interactionCtx.isGroupDm,
			directUserId: interactionCtx.userId,
			conversationId: interactionCtx.channelId,
			isThread: channelCtx.isThread,
			parentConversationId: channelCtx.parentId
		}),
		ConversationLabel: fromLabel,
		SenderName: senderName,
		SenderId: interactionCtx.userId,
		SenderUsername: senderUsername,
		SenderTag: senderTag,
		GroupSubject: groupChannel,
		GroupChannel: groupChannel,
		MemberRoleIds: interactionCtx.memberRoleIds,
		GroupSystemPrompt: interactionCtx.isDirectMessage ? void 0 : groupSystemPrompt,
		ConversationToolPolicy: toolPolicy,
		GroupSpace: guildInfo?.id ?? guildInfo?.slug ?? interactionCtx.rawGuildId ?? void 0,
		OwnerAllowFrom: ownerAllowFrom,
		Provider: "discord",
		Surface: "discord",
		WasMentioned: true,
		CommandAuthorized: commandAuthorized,
		CommandTurn: createCommandTurnContext(params.commandSource ?? "text", {
			authorized: commandAuthorized,
			body: eventText
		}),
		CommandSource: params.commandSource ?? "text",
		MessageSid: interaction.rawData.id,
		Timestamp: timestamp,
		OriginatingChannel: "discord",
		OriginatingTo: originatingTo ?? `channel:${interactionCtx.channelId}`
	});
	const deliverTarget = `channel:${interactionCtx.channelId}`;
	const tableMode = resolveMarkdownTableMode({
		cfg: ctx.cfg,
		channel: "discord",
		accountId
	});
	const textLimit = resolveTextChunkLimit(ctx.cfg, "discord", accountId, { fallbackLimit: 2e3 });
	const token = ctx.token ?? "";
	const feedbackRest = createDiscordRestClient({
		cfg: ctx.cfg,
		token,
		accountId
	}).rest;
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(ctx.cfg, agentId);
	const replyToMode = ctx.discordConfig?.replyToMode ?? ctx.cfg.channels?.discord?.replyToMode ?? "off";
	const replyReference = createReplyReferencePlanner({
		replyToMode,
		startId: params.replyToId
	});
	await runChannelInboundEvent({
		channel: "discord",
		accountId,
		raw: interaction,
		adapter: {
			ingest: () => ({
				id: interaction.id,
				rawText: ctxPayload.RawBody ?? "",
				textForAgent: ctxPayload.BodyForAgent,
				textForCommands: ctxPayload.CommandBody,
				raw: interaction
			}),
			resolveTurn: () => ({
				cfg: ctx.cfg,
				channel: "discord",
				accountId,
				route: {
					agentId,
					sessionKey
				},
				ctxPayload,
				dispatchReplyFromConfig: ctx.channelRuntime?.reply?.dispatchReplyFromConfig,
				record: {
					updateLastRoute: interactionCtx.isDirectMessage ? {
						sessionKey,
						channel: "discord",
						to: originatingTo ?? `user:${interactionCtx.userId}`,
						accountId,
						mainDmOwnerPin: sessionKey === route.mainSessionKey && pinnedMainDmOwner ? {
							ownerRecipient: pinnedMainDmOwner,
							senderRecipient: interactionCtx.userId,
							onSkip: ({ ownerRecipient, senderRecipient }) => {
								logVerbose(`discord: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
							}
						} : void 0
					} : void 0,
					onRecordError: (err) => {
						logVerbose(`discord: failed updating component session meta: ${String(err)}`);
					}
				},
				delivery: {
					deliverWithProviderMessageSending: async (payload, info) => {
						const replyToId = replyReference.use();
						const result = await deliverDiscordReply({
							cfg: ctx.cfg,
							replies: [payload],
							target: deliverTarget,
							token,
							accountId,
							rest: interaction.client.rest,
							replyToId,
							replyToMode,
							textLimit,
							maxLinesPerMessage: resolveDiscordMaxLinesPerMessage({
								cfg: ctx.cfg,
								discordConfig: ctx.discordConfig,
								accountId
							}),
							tableMode,
							chunkMode: resolveChunkMode(ctx.cfg, "discord", accountId),
							mediaLocalRoots,
							kind: info.kind,
							bindPendingFinalDelivery: info.bindPendingFinalDelivery,
							onPlatformSendDispatch: info.onPlatformSendDispatch,
							assertPlatformSendAuthorized: info.assertPlatformSendAuthorized
						});
						if (result.visibleReplySent) replyReference.markSent();
						return result;
					},
					onError: (err) => {
						logError(`discord component dispatch failed: ${String(err)}`);
					}
				},
				replyPipeline: {},
				dispatcherOptions: {
					humanDelay: resolveHumanDelayConfig(ctx.cfg, agentId),
					onReplyStart: async () => {
						try {
							const { sendTyping } = await loadTypingRuntime();
							await sendTyping({
								rest: feedbackRest,
								channelId: interactionCtx.channelId
							});
						} catch (err) {
							logVerbose(`discord: typing failed for component reply: ${String(err)}`);
						}
					}
				}
			})
		}
	});
}
// extensions/discord/src/interactive-dispatch.ts
const dispatchDiscordInteractive = createChannelInteractiveDispatcher({
	channel: "discord",
	interactiveKey: "interaction"
});
async function dispatchDiscordPluginInteractiveHandler(params) {
	return await dispatchDiscordInteractive({
		...params,
		dedupeId: params.interactionId
	});
}
// extensions/discord/src/monitor/agent-components.plugin-interactive.ts
const loadConversationRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/conversation-runtime"));
async function dispatchPluginDiscordInteractiveEvent(params) {
	const normalizedConversationId = params.interactionCtx.rawGuildId || params.channelCtx.channelType === ChannelType.GroupDM ? `channel:${params.interactionCtx.channelId}` : `user:${params.interactionCtx.userId}`;
	let responded = false;
	let acknowledged = false;
	const updateOriginalMessage = async (input) => {
		const payload = {
			...input.text !== void 0 ? { content: input.text } : {},
			...input.components !== void 0 ? { components: input.components } : {}
		};
		if (acknowledged) {
			await params.interaction.reply(payload);
			return;
		}
		if (!("update" in params.interaction) || typeof params.interaction.update !== "function") throw new Error("Discord interaction cannot update the source message");
		await params.interaction.update(payload);
	};
	const replyWithText = async (method, { text, ephemeral = true }) => {
		responded = true;
		await params.interaction[method]({
			content: text,
			ephemeral
		});
	};
	const respond = {
		acknowledge: async () => {
			if (responded) return;
			await params.interaction.acknowledge();
			acknowledged = true;
			responded = true;
		},
		reply: (payload) => replyWithText(acknowledged ? "followUp" : "reply", payload),
		followUp: (payload) => replyWithText("followUp", payload),
		editMessage: async (input) => {
			const { text, components } = input;
			responded = true;
			await updateOriginalMessage({
				text,
				components
			});
		},
		clearComponents: async (input) => {
			responded = true;
			await updateOriginalMessage({
				text: input?.text,
				components: []
			});
		}
	};
	const acknowledgeSilently = async () => {
		try {
			await respond.acknowledge();
		} catch {}
	};
	const conversationRuntime = await loadConversationRuntime();
	const pluginBindingApproval = conversationRuntime.parsePluginBindingApprovalCustomId(params.data);
	if (pluginBindingApproval) {
		const { buildPluginBindingResolvedText, resolvePluginConversationBindingApproval } = conversationRuntime;
		await acknowledgeSilently();
		const resolved = await resolvePluginConversationBindingApproval({
			approvalId: pluginBindingApproval.approvalId,
			decision: pluginBindingApproval.decision,
			senderId: params.interactionCtx.userId
		});
		const approvalMessageId = params.messageId?.trim() || params.interaction.message?.id?.trim();
		if (approvalMessageId) try {
			await editDiscordComponentMessage(normalizedConversationId, approvalMessageId, { text: buildPluginBindingResolvedText(resolved) }, {
				cfg: params.ctx.cfg,
				accountId: params.ctx.accountId
			});
		} catch (err) {
			logError(`discord plugin binding approval: failed to clear prompt: ${String(err)}`);
		}
		if (resolved.status !== "approved") try {
			await respond.followUp({
				text: buildPluginBindingResolvedText(resolved),
				ephemeral: true
			});
		} catch (err) {
			logError(`discord plugin binding approval: failed to follow up: ${String(err)}`);
		}
		return "handled";
	}
	const dispatched = await dispatchDiscordPluginInteractiveHandler({
		data: params.data,
		interactionId: params.interaction.id,
		ctx: {
			accountId: params.ctx.accountId,
			interactionId: params.interaction.id,
			conversationId: normalizedConversationId,
			parentConversationId: params.channelCtx.parentId,
			guildId: params.interactionCtx.rawGuildId,
			senderId: params.interactionCtx.userId,
			senderUsername: params.interactionCtx.username,
			auth: { isAuthorizedSender: params.isAuthorizedSender },
			interaction: {
				kind: params.kind,
				messageId: params.messageId,
				values: params.values,
				fields: params.fields
			}
		},
		respond,
		onMatched: acknowledgeSilently
	});
	if (dispatched.matched && dispatched.handled) {
		if (!responded) await acknowledgeSilently();
		return "handled";
	}
	return "unmatched";
}
// extensions/discord/src/monitor/agent-components.system-controls.ts
const AGENT_BUTTON_KEY = "agent";
const AGENT_SELECT_KEY = "agentsel";
async function runAgentSystemControlInteraction(params) {
	const label = `agent ${params.kind}`;
	const componentLabel = params.kind === "button" ? "button" : "select menu";
	const parsed = parseAgentComponentData(params.data);
	if (!parsed) {
		logError(`${label}: failed to parse component data`);
		await replyUnavailableComponentInteraction(params.interaction, `This ${componentLabel} is no longer valid.`);
		return;
	}
	const { componentId } = parsed;
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return;
	const interactionCtx = await resolveInteractionContextWithDmAuth({
		ctx,
		interaction: params.interaction,
		label,
		componentLabel
	});
	if (!interactionCtx) return;
	const { channelId, username, userId } = interactionCtx;
	const allowed = await ensureAgentComponentInteractionAllowed({
		...params,
		...interactionCtx,
		ctx,
		componentLabel: params.kind,
		unauthorizedReply: `You are not authorized to use this ${componentLabel}.`
	});
	if (!allowed) return;
	const route = resolveAgentComponentRoute({
		ctx,
		...interactionCtx,
		parentId: allowed.parentId
	});
	const eventText = params.formatEventText({
		componentId,
		username,
		userId
	});
	logDebug(`${label}: enqueuing event for channel ${channelId} interaction=${params.interaction.id}`);
	enqueueRoutedSystemEvent(eventText, route, { contextKey: `discord:agent-${params.kind}:${channelId}:${componentId}:${userId}:${params.interaction.id}` });
	await ackComponentInteraction({
		interaction: params.interaction,
		label
	});
}
function createAgentComponentButton(ctx) {
	return {
		type: ComponentType.Button,
		customId: `${AGENT_BUTTON_KEY}:seed=1`,
		async run(interaction, data) {
			await runAgentSystemControlInteraction({
				ctx,
				interaction,
				data,
				kind: "button",
				formatEventText: ({ componentId, username, userId }) => `[Discord component: ${componentId} clicked by ${username} (${userId})]`
			});
		}
	};
}
function createAgentSelectMenu(ctx) {
	return {
		type: ComponentType.StringSelect,
		customId: `${AGENT_SELECT_KEY}:seed=1`,
		async run(interaction, data) {
			const values = interaction.values ?? [];
			const valuesText = values.length > 0 ? ` (selected: ${values.join(", ")})` : "";
			await runAgentSystemControlInteraction({
				ctx,
				interaction,
				data,
				kind: "select",
				formatEventText: ({ componentId, username, userId }) => `[Discord select menu: ${componentId} interacted by ${username} (${userId})${valuesText}]`
			});
		}
	};
}
// extensions/discord/src/monitor/agent-components.ts
const loadComponentsRuntime = createLazyRuntimeModule(() => import("./components-GePlato3.mjs").then((n) => n.t));
async function resolveAuthorizedComponentEntry(params) {
	const entry = params.entry ?? await params.resolve(false);
	if (!entry) {
		await replyUnavailableComponentInteraction(params.interaction, params.expiredReply);
		return null;
	}
	const authorized = await resolveAuthorizedComponentInteraction({
		...params,
		allowedUsers: entry.allowedUsers
	});
	if (!authorized) return null;
	const consumed = await params.resolve(!entry.reusable);
	if (!consumed) {
		await replyUnavailableComponentInteraction(params.interaction, params.expiredReply);
		return null;
	}
	return {
		...authorized,
		consumed
	};
}
async function handleDiscordComponentEvent(params) {
	const parsed = parseDiscordComponentData(params.data, resolveInteractionCustomId(params.interaction));
	if (!parsed) {
		logError(`${params.label}: failed to parse component data`);
		await replyUnavailableComponentInteraction(params.interaction, "This component is no longer valid.");
		return;
	}
	const resolved = await resolveAuthorizedComponentEntry({
		...params,
		unauthorizedReply: `You are not authorized to use this ${params.componentLabel}.`,
		expiredReply: "This component has expired.",
		resolve: (consume) => resolveDiscordComponentEntryWithPersistence({
			id: parsed.componentId,
			consume
		})
	});
	if (!resolved) return;
	const { consumed, ...authorized } = resolved;
	if (consumed.kind === "modal-trigger") {
		await replyUnavailableComponentInteraction(params.interaction, "This form is no longer available.");
		return;
	}
	const values = params.values ? mapSelectValues(consumed, params.values) : void 0;
	const selectedValue = consumed.kind === "select" && params.values?.length === 1 ? params.values[0]?.trim() : void 0;
	const agentText = consumed.callbackDataKind === "command" ? void 0 : agentControlText(consumed.callbackData ?? selectedValue);
	const pluginCallbackData = consumed.callbackData ?? (consumed.callbackDataKind === "callback" || agentText ? selectedValue : void 0);
	if (pluginCallbackData) {
		if (await dispatchPluginDiscordInteractiveEvent({
			...authorized,
			interaction: params.interaction,
			isAuthorizedSender: authorized.commandAuthorized,
			data: pluginCallbackData,
			kind: consumed.kind === "select" ? "select" : "button",
			values,
			messageId: consumed.messageId ?? params.interaction.message?.id
		}) === "handled") return;
	}
	const commandFallback = consumed.kind === "button" && consumed.callbackDataKind !== "callback" ? consumed.callbackData?.trim() : consumed.callbackDataKind === "command" ? selectedValue : void 0;
	const eventText = agentText || commandFallback || (await loadComponentsRuntime()).formatDiscordComponentEventText({
		kind: consumed.kind === "select" ? "select" : "button",
		label: consumed.label,
		values
	});
	await ackComponentInteraction({
		interaction: params.interaction,
		label: params.label
	});
	await dispatchDiscordComponentEvent({
		...authorized,
		interaction: params.interaction,
		eventText,
		commandSource: consumed.callbackDataKind === "command" && commandFallback ? "native" : void 0,
		replyToId: consumed.messageId ?? params.interaction.message?.id,
		routeOverrides: consumed
	});
}
async function handleDiscordModalTrigger(params) {
	const parsed = parseDiscordComponentData(params.data, resolveInteractionCustomId(params.interaction));
	if (!parsed) {
		logError(`${params.label}: failed to parse modal trigger data`);
		await replyUnavailableComponentInteraction(params.interaction, "This button is no longer valid.");
		return;
	}
	const entry = await resolveDiscordComponentEntryWithPersistence({
		id: parsed.componentId,
		consume: false
	});
	if (!entry || entry.kind !== "modal-trigger") {
		await replyUnavailableComponentInteraction(params.interaction, "This button has expired.");
		return;
	}
	const modalId = entry.modalId ?? parsed.modalId;
	if (!modalId) {
		await replyUnavailableComponentInteraction(params.interaction, "This form is no longer available.");
		return;
	}
	const resolved = await resolveAuthorizedComponentEntry({
		...params,
		entry,
		componentLabel: "form",
		unauthorizedReply: "You are not authorized to use this form.",
		expiredReply: "This form has expired.",
		resolve: (consume) => resolveDiscordComponentEntryWithPersistence({
			id: parsed.componentId,
			consume
		})
	});
	if (!resolved) return;
	const { consumed } = resolved;
	const resolvedModalId = consumed.modalId ?? modalId;
	const modalEntry = await resolveDiscordModalEntryWithPersistence({
		id: resolvedModalId,
		consume: false
	});
	if (!modalEntry) {
		await replyUnavailableComponentInteraction(params.interaction, "This form has expired.");
		return;
	}
	try {
		await params.interaction.showModal((await loadComponentsRuntime()).createDiscordFormModal(modalEntry));
	} catch (err) {
		logError(`${params.label}: failed to show modal: ${String(err)}`);
		await replyUnavailableComponentInteraction(params.interaction, "Could not open this form. Request a new form and try again.");
	}
}
function createDiscordComponentModal(ctx) {
	return new class extends Modal {
		constructor(..._args) {
			super(..._args);
			this.title = "OpenClaw form";
			this.customId = "__openclaw_discord_component_modal_wildcard__";
			this.components = [];
			this.customIdParser = parseDiscordModalCustomIdForInteraction;
		}
		async run(interaction, data) {
			const modalId = parseDiscordModalId(data, resolveInteractionCustomId(interaction));
			if (!modalId) {
				logError("discord component modal: missing modal id");
				await replyUnavailableComponentInteraction(interaction, "This form is no longer valid.");
				return;
			}
			const resolved = await resolveAuthorizedComponentEntry({
				ctx,
				interaction,
				label: "discord component modal",
				componentLabel: "form",
				unauthorizedReply: "You are not authorized to use this form.",
				expiredReply: "This form has expired.",
				resolve: (consume) => resolveDiscordModalEntryWithPersistence({
					id: modalId,
					consume
				})
			});
			if (!resolved) return;
			const { consumed, ...authorized } = resolved;
			if (consumed.callbackData) {
				const fields = consumed.fields.map((field) => ({
					id: field.id,
					name: field.name,
					values: resolveModalFieldValues(field, interaction)
				}));
				if (await dispatchPluginDiscordInteractiveEvent({
					...authorized,
					interaction,
					isAuthorizedSender: authorized.commandAuthorized,
					data: consumed.callbackData,
					kind: "modal",
					fields,
					messageId: consumed.messageId
				}) === "handled") return;
			}
			try {
				await interaction.acknowledge();
			} catch (err) {
				logError(`discord component modal: failed to acknowledge: ${String(err)}`);
			}
			const eventText = formatModalSubmissionText(consumed, interaction);
			await dispatchDiscordComponentEvent({
				...authorized,
				interaction,
				eventText,
				replyToId: consumed.messageId,
				routeOverrides: consumed
			});
		}
	}();
}
const SELECT_CONTROLS = [
	{
		type: ComponentType.StringSelect,
		kind: "string"
	},
	{
		type: ComponentType.UserSelect,
		kind: "user"
	},
	{
		type: ComponentType.RoleSelect,
		kind: "role"
	},
	{
		type: ComponentType.MentionableSelect,
		kind: "mentionable"
	},
	{
		type: ComponentType.ChannelSelect,
		kind: "channel"
	}
];
function createDiscordComponentSelectControl(spec, ctx) {
	return {
		customIdParser: parseDiscordComponentCustomIdForInteraction,
		type: spec.type,
		customId: `__openclaw_discord_component_${spec.kind}_select_wildcard__`,
		async run(interaction, data) {
			await handleDiscordComponentEvent({
				ctx,
				interaction,
				data,
				componentLabel: spec.kind === "string" ? "select menu" : `${spec.kind} select`,
				label: spec.kind === "string" ? "discord component select" : `discord component ${spec.kind} select`,
				values: interaction.values ?? []
			});
		}
	};
}
function createDiscordComponentButton(ctx) {
	return {
		type: ComponentType.Button,
		customId: "__openclaw_discord_component_button_wildcard__",
		customIdParser: parseDiscordComponentCustomIdForInteraction,
		async run(interaction, data) {
			if (parseDiscordComponentData(data, resolveInteractionCustomId(interaction))?.modalId) {
				await handleDiscordModalTrigger({
					ctx,
					interaction,
					data,
					label: "discord component modal"
				});
				return;
			}
			await handleDiscordComponentEvent({
				ctx,
				interaction,
				data,
				componentLabel: "button",
				label: "discord component button"
			});
		}
	};
}
const createAgentComponentControls = [createAgentComponentButton, createAgentSelectMenu];
const createDiscordComponentControls = [createDiscordComponentButton, ...SELECT_CONTROLS.map((spec) => (ctx) => createDiscordComponentSelectControl(spec, ctx))];
// extensions/discord/src/monitor/exec-approvals.ts
function resolveTerminalLabel(approval) {
	if (approval.status === "allowed" || approval.status === "denied") return formatApprovalDecisionLabel(approval.decision);
	return approval.status === "expired" ? "Expired" : "Cancelled";
}
function buildTerminalPayload(params) {
	const { approval } = params;
	const label = resolveTerminalLabel(approval);
	const accentColor = approval.status === "denied" ? 15548997 : approval.status === "allowed" ? 5763719 : 10070709;
	return {
		allowed_mentions: DISCORD_APPROVAL_ALLOWED_MENTIONS,
		components: [{
			type: ComponentType.Container,
			accent_color: accentColor,
			components: [
				{
					type: ComponentType.TextDisplay,
					content: params.applied ? "## Approval resolved" : "## Approval already resolved"
				},
				{
					type: ComponentType.TextDisplay,
					content: `Recorded result: **${label}**`
				},
				{
					type: ComponentType.Separator,
					divider: false,
					spacing: 1
				},
				{
					type: ComponentType.TextDisplay,
					content: `-# ID: ${formatDiscordApprovalDisplayValue(approval.id)}`
				}
			]
		}]
	};
}
function isStructuredApprovalNotFoundError(err) {
	if (!err || typeof err !== "object") return false;
	const record = err;
	if (record.gatewayCode === "APPROVAL_NOT_FOUND") return true;
	return record.gatewayCode === "INVALID_REQUEST" && record.details?.reason === "APPROVAL_NOT_FOUND";
}
function createExecApprovalButton(ctx) {
	return {
		type: ComponentType.Button,
		customId: "execapproval:seed=1",
		async run(interaction, data) {
			const parsed = parseExecApprovalData(data);
			if (!parsed) {
				await replySilently(interaction, {
					content: "This approval is no longer valid.",
					ephemeral: true
				});
				return;
			}
			const approvers = ctx.getApprovers();
			const userId = interaction.userId;
			if (!approvers.some((id) => id === userId)) {
				await replySilently(interaction, {
					content: "⛔ You are not authorized to approve requests.",
					ephemeral: true
				});
				return;
			}
			const decisionLabel = DISCORD_APPROVAL_DECISIONS[parsed.action].label;
			try {
				await interaction.acknowledge();
			} catch {}
			const result = await ctx.resolveApproval(parsed.approvalId, parsed.approvalKind, parsed.action, userId);
			if (!result.ok) {
				try {
					await interaction.followUp({
						content: result.reason === "not-found" ? `That approval request is no longer pending. It may have expired or already been resolved.` : `Failed to submit approval decision for **${decisionLabel}**. The request may have expired or already been resolved.`,
						ephemeral: true
					});
				} catch {}
				return;
			}
			const terminalLabel = resolveTerminalLabel(result.resolution.approval);
			let terminalized = false;
			try {
				if (interaction.message) terminalized = await discordApprovalMessageUpdates.enqueue(interaction.message.id, async () => {
					if (!hasDiscordApprovalControl(await interaction.fetchReply(), parsed)) return false;
					await interaction.editReply(buildTerminalPayload({
						approval: result.resolution.approval,
						applied: result.resolution.applied
					}));
					return true;
				});
			} catch {}
			if (!terminalized || !result.resolution.applied) try {
				await interaction.followUp({
					content: result.resolution.applied ? `Approval resolved: ${terminalLabel}.` : `This approval was already resolved: ${terminalLabel}.`,
					ephemeral: true
				});
			} catch {}
		}
	};
}
function createDiscordExecApprovalButtonContext(params) {
	return {
		getApprovers: () => getDiscordExecApprovalApprovers({
			cfg: params.cfg,
			accountId: params.accountId,
			configOverride: params.config
		}),
		resolveApproval: async (approvalId, approvalKind, decision, senderId) => {
			try {
				return {
					ok: true,
					resolution: await resolveApprovalOverGateway({
						cfg: params.cfg,
						approvalId,
						approvalKind,
						decision,
						channel: "discord",
						accountId: params.accountId,
						senderId
					})
				};
			} catch (err) {
				return {
					ok: false,
					reason: isStructuredApprovalNotFoundError(err) ? "not-found" : "error"
				};
			}
		}
	};
}
// extensions/discord/src/monitor/gateway-supervisor.ts
var DiscordGatewayLifecycleError = class extends Error {
	constructor(event) {
		super(`discord gateway ${event.type}: ${event.message}`, { cause: event.err instanceof Error ? event.err : void 0 });
		this.name = "DiscordGatewayLifecycleError";
	}
};
const discordGatewayLog = createSubsystemLogger("discord/gateway");
const discordGatewayLateErrorGuards = /* @__PURE__ */ new WeakMap();
function removeDiscordGatewayLateErrorGuard(emitter) {
	const guard = discordGatewayLateErrorGuards.get(emitter);
	if (!guard) return;
	emitter.off("error", guard);
	discordGatewayLateErrorGuards.delete(emitter);
}
function ensureDiscordGatewayLateErrorGuard(emitter) {
	if (emitter.listenerCount("error") > 0) return;
	let logged = false;
	const guard = (err) => {
		if (logged) return;
		logged = true;
		discordGatewayLog.error(`suppressed late gateway error after dispose: ${formatDiscordGatewayErrorMessage(err)}`);
	};
	discordGatewayLateErrorGuards.set(emitter, guard);
	emitter.on("error", guard);
}
function readFirstStackFrame(err) {
	const stack = err.stack;
	if (!stack) return;
	const frame = stack.split("\n").slice(1).map((line) => line.trim()).find(Boolean);
	return frame ? frame.replace(/^at\s+/, "") : void 0;
}
function formatDiscordGatewayErrorMessage(err) {
	const detail = formatErrorMessage$1(err);
	if (!(err instanceof Error)) return detail;
	if (err.message) return err.name ? `${err.name}: ${detail}` : detail;
	const firstFrame = readFirstStackFrame(err);
	if (firstFrame && detail === (err.name || "Error")) return `${detail} @ ${firstFrame}`;
	return detail;
}
function classifyDiscordGatewayEvent(params) {
	const message = formatDiscordGatewayErrorMessage(params.err);
	let type;
	if (params.isDisallowedIntentsError(params.err)) type = "disallowed-intents";
	else if (message.includes("Max reconnect attempts")) type = "reconnect-exhausted";
	else if (params.err instanceof TypeError || message.includes("Fatal Gateway error") || message.includes("Fatal gateway close code") || message.includes("Gateway HELLO missing heartbeat") || message.includes("Invalid gateway payload") || message.includes("Gateway socket emitted an unknown error")) type = "fatal";
	else type = "other";
	return {
		type,
		err: params.err,
		message,
		shouldStopLifecycle: type !== "other"
	};
}
function createDiscordGatewaySupervisor(params) {
	const { emitter } = params.gateway;
	const pending = [];
	let lifecycleHandler;
	let phase = "buffering";
	let loggedLateError = false;
	const onGatewayError = (err) => {
		const event = classifyDiscordGatewayEvent({
			err,
			isDisallowedIntentsError: params.isDisallowedIntentsError
		});
		switch (phase) {
			case "disposed": return;
			case "teardown":
				if (!loggedLateError) {
					loggedLateError = true;
					params.runtime.error?.(danger(`discord: suppressed late gateway ${event.type} error during teardown: ${event.message}`));
				}
				return;
			case "active":
				lifecycleHandler?.(event);
				return;
			case "buffering": pending.push(event);
		}
	};
	removeDiscordGatewayLateErrorGuard(emitter);
	emitter.on("error", onGatewayError);
	return {
		emitter,
		attachLifecycle: (handler) => {
			lifecycleHandler = handler;
			phase = "active";
		},
		detachLifecycle: () => {
			lifecycleHandler = void 0;
			phase = "teardown";
		},
		drainPending: (handler) => {
			const queued = pending.splice(0);
			for (const event of queued) if (handler(event) === "stop") return "stop";
			return "continue";
		},
		dispose: () => {
			if (phase === "disposed") return;
			emitter.off("error", onGatewayError);
			ensureDiscordGatewayLateErrorGuard(emitter);
			lifecycleHandler = void 0;
			phase = "disposed";
			pending.length = 0;
		}
	};
}
// extensions/discord/src/monitor/provider.commands.ts
const loadPluginCommandRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/plugin-command-runtime"));
async function resolveDiscordProviderCommandSpecs(params) {
	const maxDiscordCommands = 100;
	const pluginCommandSpecs = [];
	if (params.nativeEnabled) {
		const candidates = (await loadPluginCommandRuntime()).createPluginCommandRuntime().listNativeCandidates("discord");
		for (const command of candidates) {
			if (command.name.length > 32) {
				params.runtime.error?.(danger(`discord: plugin command "/${command.name.slice(0, 32)}…" exceeds the 32-character name limit. Set a shorter Discord native alias. Skipping.`));
				continue;
			}
			pluginCommandSpecs.push({
				...command,
				name: command.name.toLowerCase()
			});
		}
	}
	const onCollision = (normalizedName) => {
		params.runtime.error?.(danger(`discord: plugin command "/${normalizedName}" duplicates an existing native command. Skipping.`));
	};
	const mergePluginCommandSpecs = (primary, collisionHandler) => mergeNativeCommandSpecs({
		primary,
		secondary: pluginCommandSpecs,
		onCollision: collisionHandler
	});
	const listPrimaryCommandSpecs = (skillCommands) => {
		const standardSpecs = listNativeCommandSpecsForConfig(params.cfg, {
			skillCommands,
			provider: "discord"
		});
		if (!params.voiceEnabled) return standardSpecs;
		const voiceName = DISCORD_VOICE_COMMAND_SPEC.name;
		return [...standardSpecs.filter((spec) => normalizeLowercaseStringOrEmpty(spec.name) !== voiceName), DISCORD_VOICE_COMMAND_SPEC];
	};
	const provisionalCollisions = [];
	const skillCommands = params.nativeEnabled && params.nativeSkillsEnabled ? await prepareSkillCommandsForAgents({ cfg: params.cfg }) : [];
	let commandSpecs = params.nativeEnabled ? mergePluginCommandSpecs(listPrimaryCommandSpecs(skillCommands), (normalizedName) => provisionalCollisions.push(normalizedName)) : [];
	const initialCommandCount = commandSpecs.length;
	if (params.nativeEnabled && params.nativeSkillsEnabled && commandSpecs.length > maxDiscordCommands) {
		commandSpecs = mergePluginCommandSpecs(listPrimaryCommandSpecs([]), onCollision);
		params.runtime.log?.(warn(`${initialCommandCount} commands exceed the ${maxDiscordCommands}-command Discord limit; removing per-skill commands and keeping /skill.`));
	} else for (const normalizedName of provisionalCollisions) onCollision(normalizedName);
	if (params.nativeEnabled && commandSpecs.length > maxDiscordCommands) params.runtime.log?.(warn(`${commandSpecs.length} commands exceed the ${maxDiscordCommands}-command Discord limit; some commands may fail to deploy.`));
	return { commandSpecs };
}
// extensions/discord/src/monitor/provider.deploy-errors.ts
const DISCORD_DEPLOY_REJECTED_ENTRY_LIMIT = 3;
function stringifyDiscordDeployField(value, depth = 2) {
	try {
		return JSON.stringify(value);
	} catch {
		return inspect(value, {
			depth,
			breakLength: 120
		});
	}
}
function readDiscordDeployRejectedFields(value) {
	if (Array.isArray(value)) return value.filter((entry) => typeof entry === "string").slice(0, 6);
	if (!value || typeof value !== "object") return [];
	return Object.keys(value).slice(0, 6);
}
function resolveDiscordRejectedDeployEntriesSource(rawBody) {
	if (!rawBody || typeof rawBody !== "object") return null;
	const payload = rawBody;
	return (payload.errors && typeof payload.errors === "object" ? payload.errors : void 0) ?? rawBody;
}
function isAbortLikeError(err) {
	if (!err || typeof err !== "object") return false;
	const name = "name" in err && typeof err.name === "string" ? err.name : void 0;
	const message = formatErrorMessage$1(err);
	return name === "AbortError" || /\boperation was aborted\b/i.test(message);
}
function formatDiscordDeployErrorMessage(err) {
	if (!isAbortLikeError(err)) return formatErrorMessage$1(err);
	const deployErr = err;
	const requestMs = parseFiniteNumber(deployErr.deployRequestMs);
	const timeoutMs = parseFiniteNumber(deployErr.deployTimeoutMs);
	const method = readNonBlankString(deployErr.deployRestMethod)?.toUpperCase();
	const path = readNonBlankString(deployErr.deployRestPath);
	const operation = method && path ? `${method} ${path}` : method ?? path ?? "request";
	if (!(requestMs !== void 0 || timeoutMs !== void 0 || deployErr.deployRestMethod !== void 0 || deployErr.deployRestPath !== void 0)) return "Discord REST request was aborted";
	const timing = [];
	for (const [label, value] of [["timeout", timeoutMs], ["observed", requestMs]]) if (value !== void 0) timing.push(`${label}=${formatDurationSeconds(value, { decimals: value >= 1e3 ? 1 : 0 })}`);
	const timingText = timing.length > 0 ? ` (${timing.join(", ")})` : "";
	if (timeoutMs !== void 0 && requestMs !== void 0 && requestMs >= timeoutMs) return `Discord REST ${operation} timed out${timingText}`;
	return `Discord REST ${operation} was aborted${timingText}`;
}
function formatDiscordDeployRateLimitDetails(err) {
	if (!(err instanceof RateLimitError)) return "";
	return ` (${[
		`status=${err.status}`,
		`retryAfter=${formatDurationSeconds(err.retryAfter * 1e3, { decimals: 1 })}`,
		`scope=${err.scope ?? "route"}`,
		err.discordCode !== void 0 ? `code=${err.discordCode}` : void 0
	].filter(Boolean).join(", ")})`;
}
function formatDiscordDeployRateLimitWarning(err, accountId) {
	if (!(err instanceof RateLimitError)) return;
	return `${[
		`[${accountId}] slash command deploy rate limited`,
		`retry after ${formatDurationSeconds(err.retryAfter * 1e3, { decimals: 1 })}`,
		`scope=${err.scope ?? "route"}`,
		err.discordCode !== void 0 ? `code=${err.discordCode}` : void 0
	].filter(Boolean).join("; ")}. Existing slash commands stay active. Message send/receive is unaffected.`;
}
function formatDiscordRejectedDeployEntries(params) {
	const requestBody = Array.isArray(params.requestBody) ? params.requestBody : null;
	const rejectedEntriesSource = resolveDiscordRejectedDeployEntriesSource(params.rawBody);
	if (!rejectedEntriesSource || !requestBody || requestBody.length === 0) return [];
	return Object.entries(rejectedEntriesSource).filter(([key]) => /^\d+$/.test(key)).slice(0, DISCORD_DEPLOY_REJECTED_ENTRY_LIMIT).flatMap(([key, value]) => {
		const index = Number.parseInt(key, 10);
		if (!Number.isFinite(index) || index < 0 || index >= requestBody.length) return [];
		const command = requestBody[index];
		if (!command || typeof command !== "object") return [`#${index} fields=${readDiscordDeployRejectedFields(value).join("|") || "unknown"}`];
		const payload = command;
		const parts = [`#${index}`, `fields=${readDiscordDeployRejectedFields(value).join("|") || "unknown"}`];
		if (typeof payload.name === "string" && payload.name.trim().length > 0) parts.push(`name=${payload.name}`);
		if (payload.description !== void 0) parts.push(`description=${stringifyDiscordDeployField(payload.description)}`);
		if (Array.isArray(payload.options) && payload.options.length > 0) parts.push(`options=${payload.options.length}`);
		return [parts.join(" ")];
	});
}
function isRedundantDiscordDeployBody(rawBody) {
	if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) return false;
	const keys = Object.keys(rawBody);
	return keys.length > 0 && keys.every((key) => key === "message" || key === "code");
}
function formatDiscordDeployErrorDetails(err) {
	if (!err || typeof err !== "object") return "";
	const rateLimitDetails = formatDiscordDeployRateLimitDetails(err);
	if (rateLimitDetails) return rateLimitDetails;
	const { status, discordCode, rawBody, deployRequestBody: requestBody } = err;
	const details = [];
	if (typeof status === "number") details.push(`status=${status}`);
	if (typeof discordCode === "number" || typeof discordCode === "string") details.push(`code=${discordCode}`);
	if (rawBody !== void 0 && !isRedundantDiscordDeployBody(rawBody)) {
		const bodyText = stringifyDiscordDeployField(rawBody, 3);
		if (bodyText) {
			const maxLen = 800;
			const trimmed = bodyText.length > maxLen ? `${truncateUtf16Safe(bodyText, maxLen)}...` : bodyText;
			details.push(`body=${trimmed}`);
		}
	}
	const rejectedEntries = formatDiscordRejectedDeployEntries({
		rawBody,
		requestBody
	});
	if (rejectedEntries.length > 0) details.push(`rejected=${rejectedEntries.join("; ")}`);
	return details.length > 0 ? ` (${details.join(", ")})` : "";
}
function isDiscordDeployDailyCreateLimit(err) {
	return err instanceof DiscordError && err.discordCode === 30034 && /daily application command creates/i.test(err.message);
}
// extensions/discord/src/monitor/provider.deploy.ts
function runDiscordCommandDeployInBackground(params) {
	if (!params.enabled) return;
	async function deployDiscordCommands() {
		const { accountId } = params;
		try {
			await params.client.deployCommands();
		} catch (err) {
			if (isDiscordDeployDailyCreateLimit(err)) {
				params.runtime.log?.(warn(`[${accountId}] slash command deploy skipped: daily application command create limit reached. Existing slash commands stay active until Discord resets the quota; message send/receive is unaffected.`));
				return;
			}
			const rateLimitWarning = formatDiscordDeployRateLimitWarning(err, accountId);
			if (rateLimitWarning) {
				params.runtime.log?.(warn(rateLimitWarning));
				return;
			}
			params.runtime.log?.(warn(`[${accountId}] slash command deploy failed (message send/receive unaffected): ${formatDiscordDeployErrorMessage(err)}${formatDiscordDeployErrorDetails(err)}`));
		}
	}
	deployDiscordCommands().catch((err) => {
		params.runtime.log?.(warn(`[${params.accountId}] slash command deploy failed in background (message send/receive unaffected): ${formatErrorMessage$1(err)}`));
	});
}
// extensions/discord/src/monitor/gateway-handle.ts
const DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT = "openclaw:discord-gateway-transport-activity";
// extensions/discord/src/monitor/status.ts
/** READY proves a prior terminal failure was repaired, so the account is restartable again. */
function createDiscordReadyStatusPatch(at = Date.now()) {
	return channelReadyPatch({
		lastConnectedAt: at,
		lastEventAt: at,
		lastDisconnect: null
	});
}
// extensions/discord/src/monitor/provider.lifecycle.ts
const DEFAULT_DISCORD_GATEWAY_READY_TIMEOUT_MS = 15e3;
const DEFAULT_DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_MS = 3e4;
const MAX_DISCORD_GATEWAY_READY_TIMEOUT_MS = 12e4;
const DISCORD_GATEWAY_READY_TIMEOUT_ENV = "OPENCLAW_DISCORD_READY_TIMEOUT_MS";
const DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_ENV = "OPENCLAW_DISCORD_RUNTIME_READY_TIMEOUT_MS";
const DISCORD_GATEWAY_READY_POLL_MS = 250;
const DISCORD_GATEWAY_READY_RETRY_BACKOFF_MS = 2e3;
const DISCORD_GATEWAY_TRANSPORT_ACTIVITY_STATUS_MIN_INTERVAL_MS = 3e4;
const INFO_DEBUG_MARKERS = [
	"Gateway websocket closed",
	"Gateway reconnect scheduled in",
	"Gateway forcing fresh IDENTIFY after"
];
function createGatewayNotReadyStatusPatch(at, reason) {
	return {
		connected: false,
		lifecycle: "recovering",
		lastEventAt: at,
		lastDisconnect: {
			at,
			error: reason
		},
		lastError: reason
	};
}
function normalizeGatewayReadyTimeoutMs(value) {
	const numeric = parseStrictPositiveInteger(value);
	if (numeric === void 0) return;
	return Math.min(numeric, MAX_DISCORD_GATEWAY_READY_TIMEOUT_MS);
}
function parseGatewayCloseCode(message) {
	const match = /Gateway websocket closed:\s*(\d{3,5})/.exec(message);
	if (!match?.[1]) return;
	return Number.parseInt(match[1], 10);
}
function resolveTransportActivityAt(event) {
	const at = event?.at;
	const timestampMs = asDateTimestampMs(at);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : Date.now();
}
async function runDiscordGatewayLifecycle(params) {
	const gateway = params.gateway;
	const gatewayReadyAtLifecycleStart = gateway.isConnected;
	registerGateway(params.accountId, gateway);
	const gatewayEmitter = params.gatewaySupervisor.emitter;
	const loggingRuntime = params.runtime;
	let lifecycleStopping = false;
	let hasConnected = gatewayReadyAtLifecycleStart;
	let reconnectStartedAt;
	const pushStatus = (patch) => {
		if (patch.connected === true) {
			if (reconnectStartedAt !== void 0) loggingRuntime.log?.("discord gateway: connection recovered");
			hasConnected = true;
			reconnectStartedAt = void 0;
		} else if (patch.connected === false && patch.lifecycle === "recovering") patch.lastDisconnect = hasConnected ? {
			...typeof patch.lastDisconnect === "object" ? patch.lastDisconnect : {},
			at: reconnectStartedAt ??= Date.now()
		} : null;
		params.statusSink?.(patch);
	};
	const gatewayReadyTimeoutMs = normalizeGatewayReadyTimeoutMs(process.env[DISCORD_GATEWAY_READY_TIMEOUT_ENV]) ?? DEFAULT_DISCORD_GATEWAY_READY_TIMEOUT_MS;
	const gatewayRuntimeReadyTimeoutMs = normalizeGatewayReadyTimeoutMs(process.env[DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_ENV]) ?? DEFAULT_DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_MS;
	const { abortSignal: observerAbortSignal, runtime: observerRuntime } = params;
	let forceStopHandler;
	let queuedForceStopError;
	let readyPollId;
	let readyTimeoutId;
	const shouldStop = () => observerAbortSignal?.aborted || lifecycleStopping;
	const clearReadyWatch = () => {
		if (readyPollId) {
			clearInterval(readyPollId);
			readyPollId = void 0;
		}
		if (readyTimeoutId) {
			clearTimeout(readyTimeoutId);
			readyTimeoutId = void 0;
		}
	};
	const triggerForceStop = (err) => {
		if (forceStopHandler) {
			forceStopHandler(err);
			return;
		}
		queuedForceStopError = err;
	};
	const startReadyWatch = () => {
		clearReadyWatch();
		const pollConnected = () => {
			if (shouldStop()) {
				clearReadyWatch();
				return;
			}
			if (!gateway.isConnected) return;
			clearReadyWatch();
			pushStatus(createDiscordReadyStatusPatch(Date.now()));
		};
		pollConnected();
		if (!readyTimeoutId) {
			readyPollId = setInterval(pollConnected, DISCORD_GATEWAY_READY_POLL_MS);
			readyPollId.unref();
			readyTimeoutId = setTimeout(() => {
				clearReadyWatch();
				if (shouldStop() || gateway.isConnected) return;
				const at = Date.now();
				const error = /* @__PURE__ */ new Error(`discord gateway opened but did not reach READY within ${gatewayRuntimeReadyTimeoutMs}ms`);
				pushStatus(createGatewayNotReadyStatusPatch(at, "runtime-not-ready"));
				observerRuntime.error?.(danger(error.message));
				triggerForceStop(error);
			}, gatewayRuntimeReadyTimeoutMs);
			readyTimeoutId.unref();
		}
	};
	const onGatewayDebug = (msg) => {
		const logMessage = String(msg);
		logVerbose(`discord gateway: ${logMessage}`);
		if (INFO_DEBUG_MARKERS.some((marker) => logMessage.includes(marker))) loggingRuntime.log?.(`discord gateway: ${logMessage}`);
		if (shouldStop()) return;
		const at = Date.now();
		const message = String(msg);
		if (message.includes("Gateway websocket opened")) {
			pushStatus({
				connected: false,
				lastEventAt: at
			});
			startReadyWatch();
			return;
		}
		if (message.includes("Gateway websocket closed")) {
			clearReadyWatch();
			const code = parseGatewayCloseCode(message);
			const terminalDisconnect = code !== void 0 && isFatalGatewayCloseCode(code);
			pushStatus({
				connected: false,
				lifecycle: terminalDisconnect ? "blocked" : "recovering",
				...terminalDisconnect ? {
					terminalDisconnect: true,
					lastError: message
				} : {},
				lastEventAt: at,
				lastDisconnect: {
					at,
					...code !== void 0 ? { status: code } : {}
				}
			});
			return;
		}
		if (message.includes("Gateway reconnect scheduled in")) {
			clearReadyWatch();
			pushStatus({
				connected: false,
				lifecycle: "recovering",
				lastEventAt: at,
				lastError: message
			});
		}
	};
	const waitForGatewayReady = async () => {
		const { abortSignal, runtime } = params;
		const waitUntilReady = async () => {
			const deadlineAt = performance.now() + gatewayReadyTimeoutMs;
			for (;;) {
				if (abortSignal?.aborted) return "stopped";
				if (await Promise.resolve(drainPendingGatewayErrors()) === "stop") return "stopped";
				if (gateway.isConnected) {
					pushStatus(createDiscordReadyStatusPatch(Date.now()));
					return "ready";
				}
				if (performance.now() >= deadlineAt) return "timeout";
				await new Promise((resolve) => {
					setTimeout(resolve, DISCORD_GATEWAY_READY_POLL_MS).unref();
				});
			}
		};
		let attempt = 0;
		for (;;) {
			if (abortSignal?.aborted) return;
			if (await waitUntilReady() !== "timeout") return;
			attempt += 1;
			const restartAt = Date.now();
			runtime.error?.(danger(`discord: gateway READY wait timed out after ${gatewayReadyTimeoutMs}ms; reconnecting with backoff (attempt ${attempt})`));
			pushStatus(createGatewayNotReadyStatusPatch(restartAt, "startup-not-ready"));
			clearReadyWatch();
			await Promise.resolve();
			if (abortSignal?.aborted) return;
			gateway.disconnect();
			if (abortSignal?.aborted) return;
			gateway.connect(false);
			try {
				await sleepWithAbort(DISCORD_GATEWAY_READY_RETRY_BACKOFF_MS, abortSignal, { ref: false });
			} catch {
				return;
			}
		}
	};
	const onGatewayWarning = (warning) => {
		const message = `discord gateway warning: ${String(warning)}`;
		logVerbose(message);
		loggingRuntime.log?.(warn(message));
	};
	gatewayEmitter.on("debug", onGatewayDebug);
	gatewayEmitter.on("warning", onGatewayWarning);
	let lastTransportActivityStatusAt;
	const onGatewayTransportActivity = (event) => {
		if (lifecycleStopping || params.abortSignal?.aborted) return;
		const at = resolveTransportActivityAt(event);
		if (lastTransportActivityStatusAt !== void 0 && at - lastTransportActivityStatusAt < DISCORD_GATEWAY_TRANSPORT_ACTIVITY_STATUS_MIN_INTERVAL_MS) return;
		lastTransportActivityStatusAt = at;
		pushStatus(createTransportActivityStatusPatch(at));
	};
	gatewayEmitter.on(DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT, onGatewayTransportActivity);
	let sawDisallowedIntents = false;
	const handleGatewayEvent = (event) => {
		if (params.abortSignal?.aborted && event.type === "reconnect-exhausted") {
			lifecycleStopping = true;
			params.runtime.log?.(`discord: treating reconnect-exhausted during expected shutdown as clean: ${event.message}`);
			return "continue";
		}
		if (event.type === "disallowed-intents") {
			lifecycleStopping = true;
			sawDisallowedIntents = true;
			params.runtime.error?.(danger("discord: gateway closed with code 4014 (missing privileged gateway intents). Enable the required intents in the Discord Developer Portal or disable them in config."));
			return "stop";
		}
		if (event.shouldStopLifecycle) lifecycleStopping = true;
		params.runtime.error?.(danger(event.shouldStopLifecycle ? `discord gateway ${event.type}: ${event.message}` : `discord gateway error: ${event.message}`));
		return event.shouldStopLifecycle ? "stop" : "continue";
	};
	const drainPendingGatewayErrors = () => params.gatewaySupervisor.drainPending((event) => {
		if (handleGatewayEvent(event) !== "stop") return "continue";
		if (event.type === "disallowed-intents") return "stop";
		throw new DiscordGatewayLifecycleError(event);
	});
	try {
		if (drainPendingGatewayErrors() === "stop") return;
		if (gatewayReadyAtLifecycleStart && params.voiceManager) params.voiceManager.autoJoin().catch((err) => params.runtime.error?.(danger(`discord voice: autoJoin failed: ${formatErrorMessage$1(err)}`)));
		await waitForGatewayReady();
		if (drainPendingGatewayErrors() === "stop") return;
		const { abortSignal, gatewaySupervisor } = params;
		await new Promise((resolve, reject) => {
			let settled = false;
			const finish = (settle) => {
				if (settled) return;
				settled = true;
				try {
					gateway.disconnect();
				} finally {
					abortSignal?.removeEventListener("abort", onAbort);
					gatewaySupervisor.detachLifecycle();
					settle();
				}
			};
			const finishReject = (err) => {
				finish(() => reject(toErrorObject(err, "Non-Error rejection")));
			};
			const onAbort = () => finish(resolve);
			const onGatewayEvent = (event) => {
				if (handleGatewayEvent(event) === "stop") finishReject(new DiscordGatewayLifecycleError(event));
			};
			if (abortSignal?.aborted) {
				onAbort();
				return;
			}
			abortSignal?.addEventListener("abort", onAbort, { once: true });
			gatewaySupervisor.attachLifecycle(onGatewayEvent);
			forceStopHandler = finishReject;
			if (queuedForceStopError !== void 0) {
				const err = queuedForceStopError;
				queuedForceStopError = void 0;
				finishReject(err);
			}
		});
	} catch (err) {
		if (!sawDisallowedIntents && !params.isDisallowedIntentsError(err)) throw err;
	} finally {
		try {
			lifecycleStopping = true;
			params.gatewaySupervisor.detachLifecycle();
			unregisterGateway(params.accountId);
			gatewayEmitter.removeListener("warning", onGatewayWarning);
			clearReadyWatch();
			forceStopHandler = void 0;
			queuedForceStopError = void 0;
			gatewayEmitter.removeListener("debug", onGatewayDebug);
			gatewayEmitter.removeListener(DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT, onGatewayTransportActivity);
			if (params.voiceManager) {
				await params.voiceManager.destroy();
				setDiscordTranscriptsVoiceManager({
					accountId: params.accountId,
					manager: null,
					expectedManager: params.voiceManager
				});
				params.voiceManagerRef.current = null;
			}
		} finally {
			await params.threadBindings.stop();
		}
	}
}
// extensions/discord/src/internal/voice.ts
var VoicePlugin = class {
	constructor() {
		this.id = "voice";
		this.adapters = /* @__PURE__ */ new Map();
	}
	registerClient(client) {
		this.gatewayPlugin = client.getPlugin("gateway");
		if (!this.gatewayPlugin) throw new Error("Discord voice cannot be used without a gateway connection.");
	}
	getGateway(_guildId) {
		return this.gatewayPlugin;
	}
	getGatewayAdapterCreator(guildId) {
		const gateway = this.getGateway(guildId);
		if (!gateway) throw new Error("Discord voice cannot be used without a gateway connection.");
		return (methods) => {
			this.adapters.set(guildId, methods);
			return {
				sendPayload(payload) {
					try {
						gateway.send(payload, true);
						return true;
					} catch {
						return false;
					}
				},
				destroy: () => {
					if (this.adapters.get(guildId) === methods) this.adapters.delete(guildId);
				}
			};
		};
	}
};
// extensions/discord/src/monitor/presence.ts
const DEFAULT_CUSTOM_ACTIVITY_TYPE = 4;
const CUSTOM_STATUS_NAME = "Custom Status";
function resolveDiscordPresenceUpdate(config) {
	const activityText = normalizeOptionalString(config.activity) ?? "";
	const status = normalizeOptionalString(config.status) ?? "";
	const activityType = config.activityType;
	const activityUrl = normalizeOptionalString(config.activityUrl) ?? "";
	const activities = [];
	if (activityText) {
		const resolvedType = activityType ?? DEFAULT_CUSTOM_ACTIVITY_TYPE;
		const activity = resolvedType === DEFAULT_CUSTOM_ACTIVITY_TYPE ? {
			name: CUSTOM_STATUS_NAME,
			type: resolvedType,
			state: activityText
		} : {
			name: activityText,
			type: resolvedType
		};
		if (resolvedType === 1 && activityUrl) activity.url = activityUrl;
		activities.push(activity);
	}
	return {
		since: null,
		activities,
		status: status || "online",
		afk: false
	};
}
// extensions/discord/src/monitor/auto-presence.ts
const DEFAULT_INTERVAL_MS = 3e4;
const DEFAULT_MIN_UPDATE_INTERVAL_MS = 15e3;
const MIN_INTERVAL_MS = 5e3;
const MIN_UPDATE_INTERVAL_MS = 1e3;
const EXHAUSTED_REASONS = /* @__PURE__ */ new Set([
	"rate_limit",
	"overloaded",
	"billing",
	"auth",
	"auth_permanent"
]);
function resolveAutoPresenceConfig(config) {
	const intervalMs = Math.max(config?.intervalMs ?? DEFAULT_INTERVAL_MS, MIN_INTERVAL_MS);
	const minUpdateIntervalMs = Math.max(config?.minUpdateIntervalMs ?? DEFAULT_MIN_UPDATE_INTERVAL_MS, MIN_UPDATE_INTERVAL_MS);
	return {
		enabled: config?.enabled === true,
		intervalMs,
		minUpdateIntervalMs
	};
}
function createDiscordAutoPresenceController(params) {
	const autoCfg = resolveAutoPresenceConfig(params.discordConfig.autoPresence);
	const loadAuthStore = params.loadAuthStore ?? (() => ensureAuthProfileStoreAsync());
	const now = params.scheduler.now;
	const scheduler = params.scheduler.scope();
	let started = false;
	let lastAppliedSignature = null;
	let lastAppliedAt = 0;
	const runEvaluation = async (options) => {
		if (!autoCfg.enabled || scheduler.signal.aborted) return;
		let presence;
		try {
			const discordConfig = params.discordConfig;
			const authStore = await loadAuthStore();
			const gatewayConnected = params.gateway.isConnected;
			const evaluationNow = now();
			const basePresence = resolveDiscordPresenceUpdate(discordConfig);
			function resolveAuthAvailability() {
				const profileIds = Object.keys(authStore.profiles);
				if (profileIds.length === 0) return "degraded";
				clearExpiredCooldowns(authStore, evaluationNow);
				if (profileIds.some((profileId) => !isProfileInCooldown(authStore, profileId, evaluationNow))) return "healthy";
				const unavailableReason = resolveProfilesUnavailableReason({
					store: authStore,
					profileIds,
					now: evaluationNow
				});
				return unavailableReason !== null && EXHAUSTED_REASONS.has(unavailableReason) ? "exhausted" : "degraded";
			}
			const availability = resolveAuthAvailability();
			const state = gatewayConnected ? availability : "degraded";
			presence = state === "healthy" ? {
				since: null,
				activities: basePresence.activities,
				status: "online",
				afk: false
			} : resolveDiscordPresenceUpdate({
				activity: state === "degraded" ? "runtime degraded" : "token exhausted",
				status: state === "degraded" ? "idle" : "dnd"
			});
		} catch (err) {
			params.log?.(warn(`discord: auto-presence evaluation failed for account ${params.accountId}: ${String(err)}`));
			return;
		}
		if (scheduler.signal.aborted || !params.gateway.isConnected) return;
		const forceApply = options?.force === true;
		const ts = now();
		const signature = JSON.stringify(presence);
		if (!forceApply && signature === lastAppliedSignature) return;
		if (!forceApply && lastAppliedAt > 0 && ts - lastAppliedAt < autoCfg.minUpdateIntervalMs) return;
		params.gateway.updatePresence(presence);
		lastAppliedSignature = signature;
		lastAppliedAt = ts;
	};
	return {
		enabled: autoCfg.enabled,
		refresh: () => runEvaluation({ force: true }),
		start: async () => {
			if (!autoCfg.enabled || started || scheduler.signal.aborted) return;
			started = true;
			const initialEvaluation = runEvaluation({ force: true });
			scheduler.schedule({
				id: "presence",
				delayMs: autoCfg.intervalMs,
				everyMs: autoCfg.intervalMs,
				run: () => runEvaluation()
			});
			await initialEvaluation;
		},
		stop: () => scheduler.stop()
	};
}
// extensions/discord/src/monitor/gateway-metadata.ts
const DISCORD_GATEWAY_BOT_URL = "https://discord.com/api/v10/gateway/bot";
const DISCORD_API_HOST = "discord.com";
const DEFAULT_DISCORD_GATEWAY_URL = "wss://gateway.discord.gg/";
const DEFAULT_DISCORD_GATEWAY_INFO_TIMEOUT_MS = 3e4;
const MAX_DISCORD_GATEWAY_INFO_TIMEOUT_MS = 12e4;
const DISCORD_GATEWAY_INFO_TIMEOUT_ENV = "OPENCLAW_DISCORD_GATEWAY_INFO_TIMEOUT_MS";
const DISCORD_GATEWAY_METADATA_MAX_BYTES = 4194304;
const DISCORD_GATEWAY_METADATA_FALLBACK_LOG_INTERVAL_MS = 6e4;
const discordGatewayBotInfoSchema = Type.Object({
	url: Type.String({ minLength: 1 }),
	shards: Type.Integer({ minimum: 1 }),
	session_start_limit: Type.Object({
		total: Type.Integer({ minimum: 0 }),
		remaining: Type.Integer({ minimum: 0 }),
		reset_after: Type.Number({ minimum: 0 }),
		max_concurrency: Type.Integer({ minimum: 1 })
	})
});
const gatewayMetadataFallbackLogLastAt = /* @__PURE__ */ new WeakMap();
function resolveDiscordGatewayInfoTimeoutMs(params) {
	return Math.min(parseStrictPositiveInteger(params?.env?.[DISCORD_GATEWAY_INFO_TIMEOUT_ENV]) ?? DEFAULT_DISCORD_GATEWAY_INFO_TIMEOUT_MS, MAX_DISCORD_GATEWAY_INFO_TIMEOUT_MS);
}
function isTransientDiscordGatewayResponse(status, body) {
	if (status >= 500 || status === 429 && isDiscordRateLimitResponseBody(body)) return true;
	const normalized = body.toLowerCase();
	return normalized.includes("upstream connect error") || normalized.includes("disconnect/reset before headers") || normalized.includes("reset reason:");
}
function createGatewayMetadataError(params) {
	const error = new Error(params.transient ? "Failed to get gateway information from Discord: fetch failed" : `Failed to get gateway information from Discord: ${params.detail}`, { cause: params.cause ?? (params.transient ? new Error(params.detail) : void 0) });
	Object.defineProperty(error, "transient", {
		value: params.transient,
		enumerable: false
	});
	return error;
}
function summarizeGatewaySchemaErrors(value) {
	const errors = Errors(discordGatewayBotInfoSchema, value);
	if (errors.length === 0) return "unknown schema mismatch";
	return errors.slice(0, 3).map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
}
async function fetchDiscordGatewayInfoWithTimeout(params) {
	const timeoutMs = Math.max(1, params.timeoutMs ?? DEFAULT_DISCORD_GATEWAY_INFO_TIMEOUT_MS);
	return await withAbortTimeout({
		timeoutMs,
		createTimeoutError: () => createGatewayMetadataError({
			detail: `Discord API /gateway/bot timed out after ${timeoutMs}ms`,
			transient: true,
			cause: /* @__PURE__ */ new Error("gateway metadata timeout")
		}),
		run: async (signal) => {
			let response;
			let body;
			try {
				response = await params.fetchImpl(params.gatewayBotUrl ?? DISCORD_GATEWAY_BOT_URL, {
					signal,
					headers: { Authorization: `Bot ${params.token}` }
				});
				body = await response.text();
			} catch (error) {
				throw createGatewayMetadataError({
					detail: formatErrorMessage(error),
					transient: true,
					cause: error
				});
			}
			const summary = summarizeDiscordResponseBody(body, { emptyText: "<empty>" }) ?? "<empty>";
			const transient = isTransientDiscordGatewayResponse(response.status, body);
			if (!response.ok) throw createGatewayMetadataError({
				detail: `Discord API /gateway/bot failed (${response.status}): ${summary}`,
				transient
			});
			try {
				const parsed = JSON.parse(body);
				if (!Check(discordGatewayBotInfoSchema, parsed)) throw new Error(summarizeGatewaySchemaErrors(parsed));
				return parsed;
			} catch (error) {
				throw createGatewayMetadataError({
					detail: `Discord API /gateway/bot returned invalid metadata: ${formatErrorMessage(error)} (${summary})`,
					transient,
					cause: error
				});
			}
		}
	});
}
function resolveGatewayInfoWithFallback(params) {
	if (!params.error?.transient) throw params.error;
	const message = formatErrorMessage(params.error);
	const now = Date.now();
	if (params.runtime) {
		const previous = gatewayMetadataFallbackLogLastAt.get(params.runtime);
		if (previous === void 0 || now - previous >= DISCORD_GATEWAY_METADATA_FALLBACK_LOG_INTERVAL_MS) {
			params.runtime.log?.(`discord: gateway metadata lookup failed transiently; using default gateway url (${message})`);
			gatewayMetadataFallbackLogLastAt.set(params.runtime, now);
		}
	}
	return {
		info: {
			url: DEFAULT_DISCORD_GATEWAY_URL,
			shards: 1,
			session_start_limit: {
				total: 1,
				remaining: 1,
				reset_after: 0,
				max_concurrency: 1
			}
		},
		usedFallback: true
	};
}
async function fetchDiscordGatewayMetadataGuarded(input, init, options) {
	const requestInit = init;
	const signal = requestInit?.signal ?? void 0;
	const guarded = await fetchWithSsrFGuard({
		url: input,
		init: requestInit,
		...signal ? { signal } : {},
		policy: { allowedHostnames: [DISCORD_API_HOST] },
		capture: false,
		auditContext: "discord.gateway.metadata",
		...options?.proxyUrl ? {
			mode: "trusted_explicit_proxy",
			dispatcherPolicy: {
				mode: "explicit-proxy",
				proxyUrl: options.proxyUrl,
				allowPrivateProxy: true
			}
		} : {}
	});
	let response;
	try {
		const source = guarded.response;
		const body = new Uint8Array(await readResponseWithLimit(source, DISCORD_GATEWAY_METADATA_MAX_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Discord gateway metadata response body too large: ${size} bytes (limit: ${maxBytes} bytes)`) }));
		response = new Response(body, {
			status: source.status,
			statusText: source.statusText,
			headers: source.headers
		});
	} finally {
		await guarded.release();
	}
	if (options?.capture) captureHttpExchangeAsync({
		url: input,
		method: init?.method ?? "GET",
		requestHeaders: init?.headers,
		requestBody: init?.body ?? null,
		response,
		flowId: options.capture.flowId,
		meta: options.capture.meta
	}).catch(() => {});
	return response;
}
// extensions/discord/src/monitor/gateway-plugin.ts
const DISCORD_GATEWAY_POLICY_VIOLATION_CLOSE_CODE = 1008;
const DISCORD_GATEWAY_WS_RECEIVER_LIMIT_CODE = "WS_ERR_TOO_MANY_BUFFERED_PARTS";
const DISCORD_GATEWAY_CLOSE_REASON_LOG_MAX_CHARS = 240;
const discordDnsLookup = createDiscordDnsLookup();
const registrationPromises = /* @__PURE__ */ new WeakMap();
function describeDiscordGatewayTransportError(error) {
	const fields = error;
	const rawCode = fields.code;
	const code = typeof rawCode === "string" && rawCode ? rawCode : void 0;
	const closeCode = asFiniteNumber(fields.closeCode);
	const statusCode = asFiniteNumber(fields.statusCode);
	return {
		...error.name ? { name: error.name } : {},
		message: error.message,
		...code ? { code } : {},
		...closeCode !== void 0 ? { closeCode } : {},
		...statusCode !== void 0 ? { statusCode } : {}
	};
}
function formatDiscordGatewayCloseReason(reason) {
	if (!reason.length) return "<empty>";
	const text = reason.toString("utf8").replaceAll(/\s+/g, " ").trim();
	if (!text) return `<${reason.length} bytes>`;
	return truncateWithMarker(text, DISCORD_GATEWAY_CLOSE_REASON_LOG_MAX_CHARS, {
		marker: "...",
		reserve: 0,
		trimEnd: false
	});
}
function formatDiscordGatewayTransportErrorLog(params) {
	return `discord: gateway websocket error ${[
		`flow=${params.flowId}`,
		params.error.name ? `name=${params.error.name}` : void 0,
		params.error.code ? `code=${params.error.code}` : void 0,
		typeof params.error.closeCode === "number" ? `closeCode=${params.error.closeCode}` : void 0,
		typeof params.error.statusCode === "number" ? `statusCode=${params.error.statusCode}` : void 0,
		`message=${params.error.message}`
	].filter(Boolean).join(" ")}`;
}
function resolveDiscordGatewayIntents(params) {
	const intentsConfig = params?.intentsConfig;
	const voiceEnabled = params?.voiceEnabled;
	const voiceStatesEnabled = intentsConfig?.voiceStates ?? voiceEnabled ?? false;
	let intents = GatewayIntents.Guilds | GatewayIntents.GuildExpressions | GatewayIntents.GuildMessages | GatewayIntents.DirectMessages | GatewayIntents.GuildMessageReactions | GatewayIntents.DirectMessageReactions;
	if (intentsConfig?.messageContent !== false) intents |= GatewayIntents.MessageContent;
	if (voiceStatesEnabled) intents |= GatewayIntents.GuildVoiceStates;
	if (intentsConfig?.presence) intents |= GatewayIntents.GuildPresences;
	if (intentsConfig?.guildMembers) intents |= GatewayIntents.GuildMembers;
	return intents;
}
function createDiscordGatewayPlugin(params) {
	const intents = resolveDiscordGatewayIntents({
		intentsConfig: params.discordConfig?.intents,
		voiceEnabled: resolveDiscordVoiceEnabled(params.discordConfig?.voice)
	});
	const proxy = resolveEffectiveDebugProxyUrl(params.discordConfig?.proxy);
	const debugProxySettings = resolveDebugProxySettings();
	const gatewayInfoTimeoutMs = resolveDiscordGatewayInfoTimeoutMs({ env: process.env });
	const endpointRuntime = getDiscordEndpointRuntime();
	const endpoint = endpointRuntime ? {
		gatewayBotUrl: endpointRuntime.descriptor.gatewayBotUrl,
		gatewayOrigin: endpointRuntime.descriptor.gatewayOrigin,
		fetch: endpointRuntime.fetch
	} : void 0;
	const endpointGatewayUrl = endpoint ? new URL(endpoint.gatewayOrigin) : void 0;
	let fetchImpl = createDiscordGatewayMetadataFetch(debugProxySettings.enabled, endpoint ? { endpoint } : void 0);
	let wsAgent = endpointGatewayUrl?.protocol === "ws:" ? void 0 : new Agent({ lookup: endpointGatewayUrl ? createDiscordEndpointDnsLookup(endpointGatewayUrl.hostname) : discordDnsLookup });
	if (proxy && !endpoint) try {
		validateDiscordProxyUrl(proxy);
		wsAgent = createNodeProxyAgent({
			mode: "explicit",
			proxyUrl: proxy,
			protocol: "https"
		});
		fetchImpl = createDiscordGatewayMetadataFetch(debugProxySettings.enabled, { proxyUrl: proxy });
		params.runtime.log?.("discord: gateway proxy enabled");
	} catch (err) {
		params.runtime.error?.(danger(`discord: invalid gateway proxy: ${String(err)}`));
		fetchImpl = (input, init) => fetchDiscordGatewayMetadataGuarded(input, init, { capture: false });
	}
	const { runtime } = params;
	class OpenClawGatewayPlugin extends GatewayPlugin {
		constructor() {
			super({ intents });
			this.gatewayInfoUsedFallback = false;
		}
		registerClient(client) {
			const registration = this.registerClientInternal(client);
			registration.catch(() => {});
			registrationPromises.set(this, registration);
			return registration;
		}
		async registerClientInternal(client) {
			this.client = client;
			if (!this.gatewayInfo || this.gatewayInfoUsedFallback) {
				const resolved = await fetchDiscordGatewayInfoWithTimeout({
					token: client.options.token,
					...endpoint ? { gatewayBotUrl: endpoint.gatewayBotUrl } : {},
					fetchImpl,
					timeoutMs: gatewayInfoTimeoutMs
				}).then((info) => ({
					info,
					usedFallback: false
				})).catch((error) => {
					if (endpoint) throw error;
					return resolveGatewayInfoWithFallback({
						runtime,
						error
					});
				});
				this.gatewayInfo = resolved.info;
				this.gatewayInfoUsedFallback = resolved.usedFallback;
			}
			if (this.ws != null || this.isConnecting) return;
			return super.registerClient(client);
		}
		createWebSocket(url) {
			assertDiscordEndpointGatewayUrl(url, endpoint?.gatewayOrigin);
			const wsFlowId = randomUUID();
			const socket = new WebSocket(url, {
				...DISCORD_GATEWAY_WS_CLIENT_OPTIONS,
				...wsAgent ? { agent: wsAgent } : {}
			});
			let lastTransportError;
			const emitTransportActivity = () => {
				if (this.ws !== socket) return;
				this.emitter.emit(DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT, { at: Date.now() });
			};
			const captureEvent = (event) => {
				captureWsEventAsync({
					url,
					...event(),
					flowId: wsFlowId,
					meta: { subsystem: "discord-gateway" }
				}).catch(() => {});
			};
			captureEvent(() => ({
				direction: "local",
				kind: "ws-open"
			}));
			socket.on("message", (data) => {
				emitTransportActivity();
				captureEvent(() => ({
					direction: "inbound",
					kind: "ws-frame",
					payload: Buffer.isBuffer(data) ? data : Buffer.from(String(data))
				}));
			});
			socket.on("close", (code, closeReason) => {
				captureEvent(() => ({
					direction: "local",
					kind: "ws-close",
					closeCode: code,
					payload: closeReason
				}));
				if (code !== 1e3 && code !== 1001 || closeReason.length > 0 || lastTransportError !== void 0) runtime.log?.(warn(`discord: gateway websocket closed ${[
					`flow=${wsFlowId}`,
					`code=${code}`,
					`reasonBytes=${closeReason.length}`,
					`reason=${formatDiscordGatewayCloseReason(closeReason)}`,
					lastTransportError?.code ? `lastErrorCode=${lastTransportError.code}` : void 0,
					lastTransportError?.message ? `lastError=${lastTransportError.message}` : void 0,
					code === DISCORD_GATEWAY_POLICY_VIOLATION_CLOSE_CODE || lastTransportError?.code === DISCORD_GATEWAY_WS_RECEIVER_LIMIT_CODE ? "hint=possible ws receiver buffered-parts limit" : void 0
				].filter(Boolean).join(" ")}`));
			});
			socket.on("error", (error) => {
				lastTransportError = describeDiscordGatewayTransportError(error);
				captureEvent(() => ({
					direction: "local",
					kind: "error",
					errorText: error.message
				}));
				runtime.log?.(warn(formatDiscordGatewayTransportErrorLog({
					flowId: wsFlowId,
					error: lastTransportError
				})));
			});
			socket.binaryType = "arraybuffer";
			return socket;
		}
	}
	return new OpenClawGatewayPlugin();
}
function createDiscordGatewayMetadataFetch(debugCaptureEnabled, transport) {
	const endpoint = transport?.endpoint;
	if (endpoint) return (input, init) => {
		const signal = init?.signal instanceof AbortSignal ? init.signal : void 0;
		return endpoint.fetch(input, {
			...init?.headers ? { headers: init.headers } : {},
			...signal ? { signal } : {}
		});
	};
	return (input, init) => fetchDiscordGatewayMetadataGuarded(input, init, {
		...debugCaptureEnabled ? {} : { capture: {
			flowId: randomUUID(),
			meta: { subsystem: "discord-gateway-metadata" }
		} },
		...transport?.proxyUrl ? { proxyUrl: transport.proxyUrl } : {}
	});
}
function waitForDiscordGatewayPluginRegistration(plugin) {
	if (typeof plugin !== "object" || plugin === null) return;
	return registrationPromises.get(plugin);
}
// extensions/discord/src/monitor/message-handler.preflight-channel-access.ts
function resolveDiscordPreflightChannelAccess(params) {
	if (params.isGuildMessage && params.channelConfig?.enabled === false) {
		logVerbose(`Blocked discord channel ${params.messageChannelId} (channel disabled, ${params.channelMatchMeta})`);
		return false;
	}
	const groupDmAllowed = params.isGroupDm && resolveGroupDmAllow({
		channels: params.groupDmChannels,
		channelId: params.messageChannelId,
		channelName: params.displayChannelName,
		channelSlug: params.displayChannelSlug
	});
	if (params.isGroupDm && !groupDmAllowed) return false;
	const channelAllowlistConfigured = hasConfiguredDiscordChannels(params.guildInfo?.channels);
	const channelAllowed = params.channelConfig?.allowed !== false;
	if (params.isGuildMessage && !isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(params.guildInfo),
		channelAllowlistConfigured,
		channelAllowed
	})) {
		if (params.groupPolicy === "disabled") logVerbose(`discord: drop guild message (groupPolicy: disabled, ${params.channelMatchMeta})`);
		else if (!channelAllowlistConfigured) logVerbose(`discord: drop guild message (groupPolicy: allowlist, no channel allowlist, ${params.channelMatchMeta})`);
		else logVerbose(`Blocked discord channel ${params.messageChannelId} not in guild channel allowlist (groupPolicy: allowlist, ${params.channelMatchMeta}). Add to guilds.<guildId>.channels to enable.`);
		return false;
	}
	if (params.isGuildMessage && params.channelConfig?.allowed === false) {
		logVerbose(`Blocked discord channel ${params.messageChannelId} not in guild channel allowlist (${params.channelMatchMeta})`);
		return false;
	}
	return true;
}
// extensions/discord/src/monitor/listeners.guild-join.ts
const DISCORD_GUILD_JOIN_INTRO_MAX_AGE_MS = 3e5;
var DiscordGuildJoinIntroductionListener = class extends GuildCreateListener {
	constructor(params) {
		super();
		this.params = params;
		this.stopped = false;
		this.pendingReports = /* @__PURE__ */ new Set();
	}
	async handle(data, client) {
		if (this.stopped) return;
		const policy = await this.params.readPolicy?.();
		if (this.stopped) return;
		const params = {
			...this.params,
			...policy
		};
		if (!("joined_at" in data) || data.unavailable || !params.botUserId) return;
		const joinAgeMs = Date.now() - Date.parse(data.joined_at);
		if (!Number.isFinite(joinAgeMs) || joinAgeMs < 0 || joinAgeMs > DISCORD_GUILD_JOIN_INTRO_MAX_AGE_MS) return;
		const textChannels = data.channels.filter((channel) => channel.type === ChannelType.GuildText);
		const systemChannel = textChannels.find((channel) => channel.id === data.system_channel_id);
		const candidateChannels = systemChannel ? [systemChannel, ...textChannels.filter((channel) => channel !== systemChannel)] : textChannels;
		const discordOptions = {
			cfg: params.cfg,
			accountId: params.accountId,
			rest: client.rest
		};
		const guildInfo = resolveDiscordGuildEntry({
			guild: new Guild(client, data),
			guildId: data.id,
			guildEntries: params.guildEntries
		});
		const guildConfigured = !params.guildEntries || Object.keys(params.guildEntries).length === 0 || Boolean(guildInfo);
		let targetChannel;
		let roomAllowed = false;
		for (const channel of candidateChannels) if (await canViewDiscordGuildChannel(data.id, channel.id, params.botUserId, discordOptions) && await hasAnyChannelPermissionDiscord(data.id, channel.id, params.botUserId, [PermissionFlagsBits.SendMessages], discordOptions)) {
			targetChannel ??= channel;
			const channelConfig = resolveDiscordChannelConfig({
				guildInfo,
				channelId: channel.id,
				channelName: channel.name,
				channelSlug: normalizeDiscordSlug(channel.name)
			});
			roomAllowed = guildConfigured && resolveDiscordPreflightChannelAccess({
				isGuildMessage: true,
				isGroupDm: false,
				groupPolicy: params.groupPolicy,
				messageChannelId: channel.id,
				displayChannelName: channel.name,
				displayChannelSlug: normalizeDiscordDisplaySlug(channel.name),
				guildInfo,
				channelConfig,
				channelMatchMeta: `guild=${data.id} channel=${channel.id}`
			});
			if (roomAllowed) {
				targetChannel = channel;
				break;
			}
		}
		if (this.stopped) return;
		if (policy?.isCurrent() === false) {
			params.logger?.info("Discord guild join introduction skipped: access policy changed", {
				guildId: data.id,
				accountId: params.accountId
			});
			return;
		}
		if (!targetChannel) {
			params.logger?.info("Discord guild join introduction skipped: no writable text channel", {
				guildId: data.id,
				accountId: params.accountId
			});
			return;
		}
		const selectedChannel = targetChannel;
		const report = reportChannelRoomJoin({
			cfg: params.cfg,
			channel: "discord",
			accountId: params.accountId,
			conversationId: data.id,
			deliverTo: `channel:${selectedChannel.id}`,
			route: resolveAgentRoute({
				cfg: params.cfg,
				channel: "discord",
				accountId: params.accountId,
				guildId: data.id,
				peer: {
					kind: "channel",
					id: selectedChannel.id
				}
			}),
			roomAllowed,
			resolveRoomContext: async ({ messageLimit }) => {
				const roomContext = {
					title: `#${selectedChannel.name}`,
					purpose: selectedChannel.topic ?? void 0
				};
				try {
					const messages = await readMessagesDiscord(selectedChannel.id, { limit: messageLimit }, discordOptions);
					return {
						...roomContext,
						recentMessages: messages.toReversed().flatMap(({ author, content }) => content.trim() ? [{
							sender: author.global_name ?? author.username,
							text: content
						}] : [])
					};
				} catch {
					return roomContext;
				}
			}
		});
		this.pendingReports.add(report);
		try {
			await report;
		} finally {
			this.pendingReports.delete(report);
		}
	}
	async stop() {
		this.stopped = true;
		await Promise.allSettled(this.pendingReports);
	}
};
// extensions/discord/src/monitor/provider.startup.ts
async function createDiscordMonitorClient(params) {
	let autoPresenceController = null;
	const gateway = createDiscordGatewayPlugin(params);
	const voicePlugin = params.voiceEnabled ? new VoicePlugin() : void 0;
	const readyDiscordConfig = params.discordConfig;
	const readyListener = new class DiscordStatusReadyListener extends ReadyListener {
		async handle(_data) {
			if (autoPresenceController?.enabled) {
				autoPresenceController.refresh();
				return;
			}
			gateway.updatePresence(resolveDiscordPresenceUpdate(readyDiscordConfig));
		}
	}();
	const client = new Client({
		clientId: params.applicationId,
		token: params.token,
		commandDeployHashStore: params.commandDeployHashStore,
		requestOptions: {
			timeout: DISCORD_REST_TIMEOUT_MS,
			...params.restFetch ? { fetch: params.restFetch } : {}
		},
		eventQueue: {}
	}, {
		commands: params.commands,
		listeners: [readyListener],
		components: params.components,
		modals: params.modals
	}, [gateway]);
	if (voicePlugin) {
		voicePlugin.registerClient(client);
		client.plugins.push(voicePlugin);
	}
	let gatewaySupervisor;
	try {
		await waitForDiscordGatewayPluginRegistration(gateway);
		gatewaySupervisor = createDiscordGatewaySupervisor({
			...params,
			gateway
		});
		autoPresenceController = createDiscordAutoPresenceController({
			...params,
			gateway,
			log: (message) => params.runtime.log?.(message)
		});
		autoPresenceController.start();
		return {
			client,
			gateway,
			gatewaySupervisor,
			autoPresenceController
		};
	} catch (err) {
		try {
			gateway.disconnect();
		} catch (cleanupErr) {
			params.runtime.error?.(danger(`discord: failed to disconnect gateway during startup cleanup: ${String(cleanupErr)}`));
		}
		try {
			gatewaySupervisor?.dispose();
		} catch (cleanupErr) {
			params.runtime.error?.(danger(`discord: failed to dispose supervisor during startup cleanup: ${String(cleanupErr)}`));
		}
		throw err;
	}
}
async function fetchDiscordBotIdentity(params) {
	const parsedBotUserId = parseApplicationIdFromToken(params.token ?? "");
	if (parsedBotUserId) return {
		botUserId: parsedBotUserId,
		botUserName: void 0
	};
	let botUser;
	try {
		botUser = await params.client.fetchUser("@me");
	} catch (err) {
		params.runtime.error?.(danger(`discord: failed to fetch bot identity: ${String(err)}`));
		throw new Error("Failed to resolve Discord bot identity", { cause: err });
	}
	const botUserId = normalizeOptionalString(botUser?.id);
	const botUserName = normalizeOptionalString(botUser?.username) ?? normalizeOptionalString(botUser?.globalName);
	if (!botUserId) {
		params.runtime.error?.(danger(`discord: failed to fetch bot identity: fetchUser("@me") returned no usable id`));
		throw new Error("Failed to resolve Discord bot identity");
	}
	return {
		botUserId,
		botUserName
	};
}
function registerDiscordMonitorListeners(params) {
	const register = (...listeners) => {
		for (const listener of listeners) registerDiscordListener(params.client.listeners, listener);
	};
	register(new DiscordInteractionListener(params.logger, params.trackInboundEvent), new DiscordMessageListener(params.messageHandler, params.logger, params.trackInboundEvent));
	const listenerOptions = {
		readPolicy: params.readPolicy,
		cfg: params.cfg,
		accountId: params.accountId,
		botUserId: params.botUserId,
		guildEntries: params.guildEntries,
		logger: params.logger
	};
	const guildJoinListener = new DiscordGuildJoinIntroductionListener({
		...listenerOptions,
		groupPolicy: params.groupPolicy
	});
	register(guildJoinListener);
	const reactionListenerOptions = {
		...listenerOptions,
		runtime: params.runtime,
		dmEnabled: params.dmEnabled,
		groupDmEnabled: params.groupDmEnabled,
		groupDmChannels: params.groupDmChannels ?? [],
		dmPolicy: params.dmPolicy,
		allowFrom: params.allowFrom ?? [],
		groupPolicy: params.groupPolicy,
		allowNameMatching: isDangerousNameMatchingEnabled(params.discordConfig),
		onEvent: params.trackInboundEvent
	};
	register(new DiscordReactionListener(reactionListenerOptions), new DiscordReactionRemoveListener(reactionListenerOptions));
	const threadUpdateListener = new DiscordThreadUpdateListener(params.cfg, params.logger);
	register(threadUpdateListener, new DiscordThreadReadyListener(threadUpdateListener), new DiscordThreadDeleteListener(params.cfg, params.accountId, params.logger));
	let presenceListener;
	if (params.discordConfig.intents?.presence) {
		presenceListener = new DiscordPresenceListener({
			...listenerOptions,
			allowNameMatching: isDangerousNameMatchingEnabled(params.discordConfig)
		});
		register(presenceListener, new DiscordPresenceGuildCreateListener(presenceListener), new DiscordPresenceGuildDeleteListener(presenceListener), new DiscordPresenceReadyListener(presenceListener));
		params.runtime.log?.("discord: GuildPresences intent enabled — presence listener registered");
	}
	return async () => {
		const introductionsStopped = guildJoinListener.stop();
		try {
			await presenceListener?.stop();
		} finally {
			await introductionsStopped;
		}
	};
}
// extensions/discord/src/monitor/questions.ts
function createDiscordQuestionButton(params) {
	const authContext = params.authContext ?? {
		cfg: params.cfg,
		accountId: params.accountId
	};
	return {
		type: ComponentType.Button,
		customId: "ocq:id=seed;i=0",
		async run(interaction, data) {
			const callback = parseDiscordQuestionData(data);
			if (!callback) {
				await interaction.reply({
					content: "This question is no longer valid.",
					ephemeral: true
				});
				return;
			}
			if (!await resolveAuthorizedComponentInteraction({
				ctx: authContext,
				interaction,
				label: "discord question",
				componentLabel: "button",
				unauthorizedReply: "You are not authorized to answer this question."
			})) return;
			try {
				await interaction.acknowledge();
			} catch {}
			let content;
			try {
				content = (await questionGatewayRuntime.resolveOption({
					cfg: params.cfg,
					questionId: callback.questionId,
					optionIndex: callback.optionIndex,
					senderId: interaction.userId,
					clientDisplayName: `Discord question (${params.accountId})`
				})).status === "answered" ? "Answer submitted." : "This question was already answered.";
			} catch {
				content = "Could not submit this answer.";
			}
			try {
				const feedback = {
					content,
					ephemeral: true
				};
				await (interaction.responseState === "unacknowledged" ? interaction.reply(feedback) : interaction.followUp(feedback));
			} catch {}
		}
	};
}
// extensions/discord/src/monitor/startup-status.ts
function formatDiscordStartupStatusMessage(params) {
	const identitySuffix = params.botIdentity ? ` as ${params.botIdentity}` : "";
	if (params.gatewayReady) return `logged in to discord${identitySuffix}`;
	return `discord client initialized${identitySuffix}; awaiting gateway readiness`;
}
// extensions/discord/src/monitor/provider.ts
const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;
const DISCORD_ACP_STATUS_PROBE_TIMEOUT_MS = 8e3;
const DISCORD_ACP_STALE_RUNNING_ACTIVITY_MS = 12e4;
const DISCORD_DISALLOWED_INTENTS_CODE = GatewayCloseCodes$1.DisallowedIntents;
function formatThreadBindingDurationForConfigLabel(durationMs) {
	const label = formatThreadBindingDurationLabel(durationMs);
	return label === "disabled" ? "off" : label;
}
function isDiscordDisallowedIntentsError(err) {
	if (!err) return false;
	return formatErrorMessage$1(err).includes(String(DISCORD_DISALLOWED_INTENTS_CODE));
}
async function monitorDiscordProvider(opts) {
	const { scheduler } = opts;
	const cfg = opts.config ?? await captureRuntimeConfigAsyncReader()();
	const readConfig = opts.readConfig ?? createRuntimeConfigReader(cfg);
	const account = resolveDiscordAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = normalizeDiscordToken(opts.token ?? void 0, "channels.discord.token") ?? account.token;
	if (!token) throw new Error(`Discord bot token missing for account "${account.accountId}" (set discord.accounts.${account.accountId}.token or DISCORD_BOT_TOKEN for default).`);
	const runtime = opts.runtime ?? createNonExitingRuntime();
	let lifecycleGateway;
	const rawDiscordCfg = account.config;
	const discordRestFetch = resolveDiscordRestFetch(rawDiscordCfg.proxy, runtime);
	const dmConfig = rawDiscordCfg.dm;
	const configuredDmAllowFrom = resolveDiscordAccountAllowFrom({
		cfg,
		accountId: account.accountId
	});
	let guildEntries = rawDiscordCfg.guilds;
	const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
	const providerConfigPresent = cfg.channels?.discord !== void 0;
	const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent,
		groupPolicy: rawDiscordCfg.groupPolicy,
		defaultGroupPolicy
	});
	const discordCfg = rawDiscordCfg.groupPolicy === groupPolicy ? rawDiscordCfg : {
		...rawDiscordCfg,
		groupPolicy
	};
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "discord",
		accountId: account.accountId,
		blockedLabel: GROUP_POLICY_BLOCKED_LABEL.guild,
		log: (message) => runtime.log?.(warn(message))
	});
	let allowFrom = configuredDmAllowFrom ?? [];
	const mediaMaxBytes = (opts.mediaMaxMb ?? discordCfg.mediaMaxMb ?? DEFAULT_DISCORD_MEDIA_MAX_MB) * 1024 * 1024;
	const textLimit = resolveTextChunkLimit(cfg, "discord", account.accountId, { fallbackLimit: 2e3 });
	const historyLimit = resolvePromptHistoryLimit(opts.historyLimit ?? discordCfg.historyLimit ?? cfg.messages?.groupChat?.historyLimit, 20);
	const replyToMode = opts.replyToMode ?? discordCfg.replyToMode ?? "off";
	const dmEnabled = dmConfig?.enabled ?? true;
	const dmPolicy = resolveDiscordAccountDmPolicy({
		cfg,
		accountId: account.accountId
	}) ?? "pairing";
	const discordProviderSessionRuntime = await import("./provider-session.runtime-WYDE3aiz.mjs");
	const threadBindingIdleTimeoutMs = discordProviderSessionRuntime.resolveThreadBindingIdleTimeoutMs({
		channelIdleHoursRaw: discordCfg.threadBindings?.idleHours,
		sessionIdleHoursRaw: cfg.session?.threadBindings?.idleHours
	});
	const threadBindingMaxAgeMs = discordProviderSessionRuntime.resolveThreadBindingMaxAgeMs({
		channelMaxAgeHoursRaw: discordCfg.threadBindings?.maxAgeHours,
		sessionMaxAgeHoursRaw: cfg.session?.threadBindings?.maxAgeHours
	});
	const threadBindingsEnabled = discordProviderSessionRuntime.resolveThreadBindingsEnabled({
		channelEnabledRaw: discordCfg.threadBindings?.enabled,
		sessionEnabledRaw: cfg.session?.threadBindings?.enabled
	});
	const groupDmEnabled = dmConfig?.groupEnabled ?? false;
	const groupDmChannels = dmConfig?.groupChannels;
	const nativeEnabled = resolveNativeCommandsEnabled({
		providerId: "discord",
		providerSetting: discordCfg.commands?.native,
		globalSetting: cfg.commands?.native
	});
	const nativeSkillsEnabled = resolveNativeSkillsEnabled({
		providerId: "discord",
		providerSetting: discordCfg.commands?.nativeSkills,
		globalSetting: cfg.commands?.nativeSkills
	});
	const slashCommand = resolveDiscordSlashCommandConfig(discordCfg.slashCommand);
	const sessionPrefix = "discord:slash";
	const ephemeralDefault = slashCommand.ephemeral;
	const voiceEnabled = resolveDiscordVoiceEnabled(discordCfg.voice);
	if (voiceEnabled && getDiscordEndpointRuntime()) throw new Error("Discord voice transport is unavailable while DISCORD_API_URL is configured");
	const allowlistResolved = await resolveDiscordAllowlistConfig({
		accountId: account.accountId,
		token,
		guildEntries,
		allowFrom,
		discordConfig: discordCfg,
		fetcher: discordRestFetch,
		runtime
	});
	guildEntries = allowlistResolved.guildEntries;
	allowFrom = allowlistResolved.allowFrom ?? [];
	const readPolicy = createDiscordLivePolicyReader({
		cfg,
		readConfig,
		accountId: account.accountId,
		discordConfig: discordCfg,
		token,
		runtime,
		discordRestFetch,
		abortSignal: opts.abortSignal,
		resolvedAllowlist: allowlistResolved
	});
	if (shouldLogVerbose()) {
		const summarize = (entries) => summarizeStringEntries({
			entries,
			limit: 4,
			emptyText: "any"
		});
		const allowFromSummary = summarize(allowFrom);
		const groupDmChannelSummary = summarize(groupDmChannels);
		const guildSummary = summarize(Object.keys(guildEntries ?? {}));
		logVerbose(`discord: config dm=${dmEnabled ? "on" : "off"} dmPolicy=${dmPolicy} allowFrom=${allowFromSummary} groupDm=${groupDmEnabled ? "on" : "off"} groupDmChannels=${groupDmChannelSummary} groupPolicy=${groupPolicy} guilds=${guildSummary} historyLimit=${historyLimit} mediaMaxMb=${Math.round(mediaMaxBytes / 1048576)} native=${nativeEnabled ? "on" : "off"} nativeSkills=${nativeSkillsEnabled ? "on" : "off"} accessGroups=on threadBindings=${threadBindingsEnabled ? "on" : "off"} threadIdleTimeout=${formatThreadBindingDurationForConfigLabel(threadBindingIdleTimeoutMs)} threadMaxAge=${formatThreadBindingDurationForConfigLabel(threadBindingMaxAgeMs)}`);
	}
	const parsedApplicationId = normalizeOptionalString(discordCfg.applicationId) ?? parseApplicationIdFromToken(token);
	const applicationIdProbe = parsedApplicationId ? {
		kind: "resolved",
		applicationId: parsedApplicationId
	} : await probeDiscordApplicationId(token, 4e3, discordRestFetch);
	if (applicationIdProbe.kind !== "resolved") {
		const at = Date.now();
		const terminal = applicationIdProbe.kind === "rejected";
		const probeError = formatErrorMessage$1(applicationIdProbe.error);
		const message = `Failed to resolve Discord application id: ${probeError}`;
		opts.setStatus?.({
			connected: false,
			lifecycle: terminal ? "blocked" : "recovering",
			terminalDisconnect: terminal ? true : void 0,
			lastEventAt: at,
			lastDisconnect: {
				at,
				...applicationIdProbe.status !== null ? { status: applicationIdProbe.status } : {},
				error: probeError
			},
			lastError: message
		});
		throw new Error(message, { cause: applicationIdProbe.error });
	}
	const applicationId = applicationIdProbe.applicationId;
	const { commandSpecs } = await resolveDiscordProviderCommandSpecs({
		cfg,
		runtime,
		nativeEnabled,
		nativeSkillsEnabled,
		voiceEnabled
	});
	const voiceManagerRef = { current: null };
	const threadBindings = threadBindingsEnabled ? await discordProviderSessionRuntime.createThreadBindingManager({
		accountId: account.accountId,
		token,
		cfg,
		idleTimeoutMs: threadBindingIdleTimeoutMs,
		maxAgeMs: threadBindingMaxAgeMs
	}) : discordProviderSessionRuntime.createNoopThreadBindingManager(account.accountId);
	let lifecycleStarted = false;
	let gatewaySupervisor;
	let deactivateMessageHandler;
	let stopMonitorListeners;
	let autoPresenceController = null;
	try {
		if (opts.abortSignal?.aborted) return;
		if (threadBindingsEnabled) {
			const uncertainProbeKeys = /* @__PURE__ */ new Set();
			const reconciliation = await discordProviderSessionRuntime.reconcileAcpThreadBindingsOnStartup({
				cfg,
				accountId: account.accountId,
				sendFarewell: false,
				healthProbe: async ({ sessionKey, session }) => {
					const agentId = session.agentId;
					const storedState = session.acp?.state;
					const lastActivityAt = session.acp?.lastActivityAt;
					const probe = await (async () => {
						const { getAcpSessionManager, isAcpRuntimeError } = discordProviderSessionRuntime;
						const manager = getAcpSessionManager();
						const statusProbeAbortController = new AbortController();
						const statusPromise = manager.getSessionStatus({
							cfg,
							sessionKey,
							agentId,
							signal: statusProbeAbortController.signal
						}).then((status) => ({
							kind: "status",
							status
						})).catch((error) => ({
							kind: "error",
							error
						}));
						const result = await raceWithTimeout(statusPromise, DISCORD_ACP_STATUS_PROBE_TIMEOUT_MS, () => ({ kind: "timeout" }), { ref: false });
						if (result.kind === "timeout") statusProbeAbortController.abort();
						let runningForMs = 0;
						if (storedState === "running") {
							const activityAtMs = asDateTimestampMs(lastActivityAt);
							const boundedActivityAtMs = activityAtMs === void 0 ? 0 : Math.max(0, Math.floor(activityAtMs));
							runningForMs = Math.max(0, Date.now() - boundedActivityAtMs);
						}
						const isStaleRunning = storedState === "running" && runningForMs >= DISCORD_ACP_STALE_RUNNING_ACTIVITY_MS;
						if (result.kind === "timeout") return isStaleRunning ? {
							status: "stale",
							reason: "status-timeout-running-stale"
						} : {
							status: "uncertain",
							reason: "status-timeout"
						};
						if (result.kind === "error") {
							discordProviderSessionRuntime.rethrowIncognitoSessionError(result.error);
							const error = result.error;
							if (isAcpRuntimeError(error) && ["SESSION_OWNER_MIGRATION_REQUIRED", "SESSION_OWNER_UNSUPPORTED"].includes(error.detailCode ?? "")) return {
								status: "uncertain",
								reason: formatErrorMessage$1(error)
							};
							if (isAcpRuntimeError(error) && error.code === "ACP_SESSION_INIT_FAILED") return {
								status: "stale",
								reason: "session-init-failed"
							};
							const message = formatErrorMessage$1(error);
							if (message.includes("Session is not ACP-enabled") || message.includes("ACP session metadata missing")) return {
								status: "stale",
								reason: "session-missing"
							};
							return isStaleRunning ? {
								status: "stale",
								reason: "status-error-running-stale"
							} : {
								status: "uncertain",
								reason: "status-error"
							};
						}
						if (result.status.state === "error") return {
							status: "uncertain",
							reason: "status-error-state"
						};
						return { status: "healthy" };
					})();
					if (probe.status === "uncertain") uncertainProbeKeys.add(`${sessionKey}${probe.reason ? ` (${probe.reason})` : ""}`);
					return probe;
				}
			});
			if (reconciliation.removed > 0) logVerbose(`discord: removed ${reconciliation.removed}/${reconciliation.checked} stale ACP thread bindings on startup for account ${account.accountId}: ${reconciliation.staleSessionKeys.join(", ")}`);
			if (uncertainProbeKeys.size > 0) logVerbose(`discord: ACP thread-binding health check uncertain for account ${account.accountId}: ${[...uncertainProbeKeys].join(", ")}`);
		}
		if (opts.abortSignal?.aborted) return;
		const pluginChannelRuntime = opts.channelRuntime;
		const accountContext = {
			readPolicy,
			cfg,
			discordConfig: discordCfg,
			accountId: account.accountId
		};
		const commandContext = {
			...accountContext,
			sessionPrefix,
			threadBindings,
			buildContext: pluginChannelRuntime?.inbound.buildContext,
			dispatchReplyFromConfig: pluginChannelRuntime?.reply?.dispatchReplyFromConfig
		};
		const commands = commandSpecs.map((spec) => {
			if (nativeEnabled && voiceEnabled && spec.name === DISCORD_VOICE_COMMAND_SPEC.name) return createDiscordVoiceCommand({
				...accountContext,
				groupPolicy,
				getManager: () => voiceManagerRef.current,
				ephemeralDefault
			});
			return createDiscordNativeCommand({
				...commandContext,
				command: spec,
				ephemeralDefault
			});
		});
		const execApprovalsConfig = discordCfg.execApprovals ?? {};
		const execApprovalOptions = {
			cfg,
			accountId: account.accountId,
			configOverride: execApprovalsConfig
		};
		const execApprovalsEnabled = isDiscordExecApprovalClientEnabled(execApprovalOptions);
		const approvalActionsEnabled = getDiscordExecApprovalApprovers(execApprovalOptions).length > 0;
		if (execApprovalsEnabled) registerChannelRuntimeContext({
			channelRuntime: pluginChannelRuntime,
			channelId: "discord",
			accountId: account.accountId,
			capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
			context: {
				token,
				config: execApprovalsConfig
			},
			abortSignal: opts.abortSignal
		});
		const componentContext = {
			...accountContext,
			runtime,
			token,
			guildEntries,
			allowFrom,
			dmPolicy
		};
		const components = [createDiscordQuestionButton({
			cfg,
			accountId: account.accountId,
			authContext: componentContext
		}), ...[
			createDiscordCommandArgFallbackButton,
			createDiscordModelPickerFallbackButton,
			createDiscordModelPickerFallbackSelect
		].map((create) => create(commandContext))];
		const activityButton = createDiscordActivityButton({
			...componentContext,
			channelRuntime: pluginChannelRuntime
		}, applicationId);
		if (activityButton) components.push(activityButton);
		const modals = [];
		if (approvalActionsEnabled) components.push(createExecApprovalButton(createDiscordExecApprovalButtonContext({
			cfg,
			accountId: account.accountId,
			config: execApprovalsConfig
		})));
		if (discordCfg.agentComponents?.enabled ?? true) {
			components.push(...createAgentComponentControls.map((create) => create(componentContext)));
			components.push(...createDiscordComponentControls.map((create) => create(componentContext)));
			modals.push(createDiscordComponentModal(componentContext));
		}
		const { client, gateway, gatewaySupervisor: createdGatewaySupervisor, autoPresenceController: createdAutoPresenceController } = await createDiscordMonitorClient({
			scheduler,
			accountId: account.accountId,
			applicationId,
			token,
			restFetch: discordRestFetch,
			commands,
			components,
			modals,
			voiceEnabled,
			discordConfig: discordCfg,
			runtime,
			commandDeployHashStore: opts.commandDeployHashStore,
			isDisallowedIntentsError: isDiscordDisallowedIntentsError
		});
		lifecycleGateway = gateway;
		gatewaySupervisor = createdGatewaySupervisor;
		autoPresenceController = createdAutoPresenceController;
		runDiscordCommandDeployInBackground({
			client,
			runtime,
			enabled: nativeEnabled,
			accountId: account.accountId
		});
		const logger = createSubsystemLogger("discord/monitor");
		const guildHistories = /* @__PURE__ */ new Map();
		const { botUserId, botUserName } = await fetchDiscordBotIdentity({
			client,
			token,
			runtime
		});
		const monitorOptions = {
			readPolicy,
			client,
			cfg,
			discordConfig: discordCfg,
			accountId: account.accountId,
			runtime,
			botUserId
		};
		let voiceManager = null;
		if (voiceEnabled) {
			const { DiscordVoiceManager } = await import("./voice-runtime-Dlg1zf7v.mjs");
			const { DiscordVoiceGuildCreateListener, DiscordVoiceReadyListener, DiscordVoiceResumedListener, DiscordVoiceStateUpdateListener } = await import("./listeners-DIyynRvV.mjs");
			const { cfg: _startupConfig, ...voiceOptions } = monitorOptions;
			voiceManager = new DiscordVoiceManager({
				...voiceOptions,
				readConfig,
				scheduler
			});
			setDiscordTranscriptsVoiceManager({
				accountId: account.accountId,
				manager: voiceManager
			});
			voiceManagerRef.current = voiceManager;
			registerDiscordListener(client.listeners, new DiscordVoiceGuildCreateListener(voiceManager));
			registerDiscordListener(client.listeners, new DiscordVoiceReadyListener(voiceManager));
			registerDiscordListener(client.listeners, new DiscordVoiceResumedListener(voiceManager));
			registerDiscordListener(client.listeners, new DiscordVoiceStateUpdateListener(voiceManager));
		}
		const messageHandler = discordProviderSessionRuntime.createDiscordMessageHandler({
			...monitorOptions,
			token,
			buildContext: pluginChannelRuntime?.inbound.buildContext,
			setStatus: opts.setStatus,
			abortSignal: opts.abortSignal,
			guildHistories,
			historyLimit,
			mediaMaxBytes,
			textLimit,
			replyToMode,
			dmEnabled,
			dmPolicy,
			groupDmEnabled,
			groupDmChannels,
			allowFrom,
			guildEntries,
			threadBindings,
			discordRestFetch
		});
		deactivateMessageHandler = messageHandler.deactivate;
		const trackInboundEvent = opts.setStatus ? () => {
			const at = Date.now();
			opts.setStatus?.({
				lastEventAt: at,
				lastInboundAt: at
			});
		} : void 0;
		stopMonitorListeners = registerDiscordMonitorListeners({
			...monitorOptions,
			dmEnabled,
			groupDmEnabled,
			groupDmChannels,
			dmPolicy,
			allowFrom,
			groupPolicy,
			guildEntries,
			logger,
			messageHandler,
			trackInboundEvent
		});
		const botIdentity = botUserId && botUserName ? `${botUserId} (${botUserName})` : botUserId ?? botUserName ?? "";
		runtime.log?.(formatDiscordStartupStatusMessage({
			gatewayReady: lifecycleGateway.isConnected,
			botIdentity: botIdentity || void 0
		}));
		if (lifecycleGateway?.isConnected) opts.setStatus?.(createDiscordReadyStatusPatch());
		lifecycleStarted = true;
		await runDiscordGatewayLifecycle({
			accountId: account.accountId,
			gateway: lifecycleGateway,
			runtime,
			abortSignal: opts.abortSignal,
			statusSink: opts.setStatus,
			isDisallowedIntentsError: isDiscordDisallowedIntentsError,
			voiceManager,
			voiceManagerRef,
			threadBindings,
			gatewaySupervisor
		});
	} finally {
		try {
			const listenersStopped = stopMonitorListeners?.();
			try {
				await deactivateMessageHandler?.();
			} finally {
				await listenersStopped;
			}
			await autoPresenceController?.stop();
			opts.setStatus?.({ connected: false });
			if (!lifecycleStarted) try {
				lifecycleGateway?.disconnect();
			} catch (err) {
				runtime.error?.(danger(`discord: failed to disconnect gateway during startup cleanup: ${String(err)}`));
			}
			gatewaySupervisor?.dispose();
		} finally {
			if (!lifecycleStarted) await threadBindings.stop();
		}
	}
}
export { resolveDiscordTextCommandAccess as A, buildDiscordInboundAccessContext as C, createMessageDispatchData as D, createDiscordLivePolicyReader as E, registerDiscordListener as O, buildDiscordGroupSystemPrompt as S, handleDiscordDmCommandDecision as T, isDiscordRealtimeVoiceMode as _, waitForDiscordGatewayPluginRegistration as a, resolveDiscordVoiceMode as b, formatDiscordReplySkip as c, buildGuildLabel as d, resolveReplyContext as f, VOICE_RECONNECT_GRACE_MS as g, VOICE_CONNECT_READY_TIMEOUT_MS as h, resolveDiscordGatewayIntents as i, resolveDiscordDmCommandAccess as k, sanitizeDiscordFrontChannelReplyPayloads as l, MIN_SEGMENT_SECONDS as m, resolveDiscordPreflightChannelAccess as n, deliverDiscordReply as o, CAPTURE_FINALIZE_GRACE_MS as p, createDiscordGatewayPlugin as r, formatDiscordReplyDeliveryFailure as s, monitorDiscordProvider as t, buildDirectLabel as u, isVoiceChannel as v, createDiscordSupplementalContextAccessChecker as w, createDiscordNativeCommand as x, logVoiceVerbose as y };
