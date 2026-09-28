import { D as Message, E as Guild, G as Row, J as StringSelectMenu, L as Button, O as User, P as Modal, Q as BaseMessageInteractiveComponent, T as CommandWithSubcommands, Y as TextDisplay, a as MessageCreateListener, c as PresenceUpdateListener, d as ThreadDeleteListener, f as ThreadUpdateListener, h as Plugin, i as InteractionCreateListener, k as hasDiscordV2Components, l as ReadyListener, m as Client, n as GuildCreateListener, o as MessageReactionAddListener, q as Separator, r as GuildDeleteListener, s as MessageReactionRemoveListener, t as discord_exports, v as RateLimitError, w as Command, z as Container } from "./discord-BXpHW-cu.mjs";
import { C as parseDiscordActivityCustomIdForInteraction, D as parseDiscordModalCustomIdForInteraction, E as parseDiscordModalCustomId, O as decodeCustomIdComponent, T as parseDiscordComponentCustomIdForInteraction, c as parseExecApprovalData, d as buildDiscordComponentMessage, k as encodeCustomIdComponent, o as parseDiscordQuestionData, w as parseDiscordComponentCustomId, y as buildDiscordActivityCustomId } from "./components-yBEb75bB.mjs";
import { C as resolveTimestampMs, E as getDiscordEndpointRuntime, T as assertDiscordEndpointGatewayUrl, a as normalizeDiscordDisplaySlug, b as formatDiscordReactionEmoji, c as resolveDiscordChannelConfig, f as resolveDiscordGuildEntry, g as resolveDiscordOwnerAllowFrom, h as resolveDiscordOwnerAccess, i as normalizeDiscordAllowList, l as resolveDiscordChannelConfigWithFallback, m as resolveDiscordMemberAllowed, o as normalizeDiscordSlug, p as resolveDiscordMemberAccessState, r as isDiscordGroupAllowedByPolicy, s as resolveDiscordAllowListMatch, t as isDiscordThreadChannelType, u as resolveDiscordChannelPolicyCommandAuthorizer, v as resolveGroupDmAllow, x as formatDiscordUserTag, y as shouldEmitDiscordReactionNotification } from "./channel-type-DKnjV1XW.mjs";
import { c as resolveDiscordAccount, f as resolveDiscordAccountDmPolicy, h as resolveDiscordToken, l as resolveDiscordAccountAllowFrom, m as normalizeDiscordToken, o as mergeDiscordAccountConfig, p as resolveDiscordMaxLinesPerMessage } from "./accounts-CwJQoLjM.mjs";
import { a as registerDiscordComponentEntries, o as resolveDiscordComponentEntryWithPersistence, s as resolveDiscordModalEntryWithPersistence, t as editDiscordComponentMessage } from "./send.components-ChY21qr-.mjs";
import { t as getDiscordRuntime } from "./runtime-DgnVQ7zW.mjs";
import { a as isDiscordRateLimitResponseBody, o as summarizeDiscordResponseBody } from "./api-CBK9zcq5.mjs";
import { o as chunkDiscordTextWithMode } from "./retry-BEYkDy0P.mjs";
import { B as validateDiscordProxyUrl, G as unregisterGateway, P as createDiscordRestClient, R as DISCORD_REST_TIMEOUT_MS, V as withValidatedDiscordProxy, W as registerGateway, b as canViewDiscordGuildChannel, w as hasAnyChannelPermissionDiscord } from "./send.shared-VNvWfX2T.mjs";
import { o as formatMention, t as sendMessageDiscord } from "./send.outbound-QTyuFupn.mjs";
import { n as getDiscordActivitiesRuntime } from "./runtime-DisDbixd.mjs";
import { t as resolveDiscordCommandOwnerAllowFrom } from "./command-owners-D78sAoOz.mjs";
import { n as resolveDiscordChannelInfoSafe, o as resolveDiscordChannelTopicSafe, r as resolveDiscordChannelNameSafe } from "./channel-access-C12aDZ0p.mjs";
import { O as resolveDiscordMessageStickers, c as authorizeDiscordVoiceIngress, d as resolveDiscordThreadLikeChannelContext, f as resolveFetchedDiscordThreadLikeChannelContext, i as setDiscordTranscriptsVoiceManager, l as resolveDiscordVoiceAccess, s as resolveDiscordVoiceEnabled } from "./transcripts-source-DVegW0WI.mjs";
import { i as setPresence, t as clearPresences } from "./presence-cache-dYSHPWMx.mjs";
import { _ as readMessagesDiscord, s as sendVoiceMessageDiscord } from "./send-CIBzvXjS.mjs";
import { c as raceWithTimeout, u as withAbortTimeout } from "./timeouts-D86uWLt_.mjs";
import { D as isDiscordExecApprovalClientEnabled, T as getDiscordExecApprovalApprovers, a as resolveDiscordComponentSpec, c as formatDiscordApprovalDisplayValue, d as resolveDiscordBoundConversationRoute, h as resolveDiscordConversationIdentity, l as buildDiscordConversationRouteContext, n as DISCORD_PRESENTATION_CAPABILITIES, p as resolveDiscordEffectiveRoute, r as buildDiscordPresentationPayload, s as DISCORD_APPROVAL_ALLOWED_MENTIONS, u as buildDiscordRoutePeer } from "./outbound-session-route-VulUE0yV.mjs";
import { n as discordIngressIdentity, t as selectDiscordLivePolicyConfig } from "./live-policy-config-eKQ-PLdy.mjs";
import { t as resolveDiscordChannelAllowlist } from "./resolve-channels-BbvsLQOZ.mjs";
import { t as resolveDiscordUserAllowlist } from "./resolve-users-ByFlR7LQ.mjs";
import { o as isThreadArchived, r as getThreadBindingManager, u as formatThreadBindingDurationLabel } from "./thread-bindings.manager-ve-i6oqt.mjs";
import { a as probeDiscordApplicationId, r as parseApplicationIdFromToken } from "./probe-CupW4we4.mjs";
import { i as sanitizeRecentModels, n as normalizeModelRef, r as preferenceTimestampMs, t as buildPreferenceModelKey } from "./model-picker-preference-primitives-BHT1LkR_.mjs";
import { t as resolveDiscordSenderIdentity } from "./sender-identity-0Ymgvmaj.mjs";
import { n as hasDiscordApprovalControl, t as discordApprovalMessageUpdates } from "./approval-message-updates-jf9zMaIC.mjs";
import { createRequire } from "node:module";
import { logDebug, logError } from "openclaw/plugin-sdk/logging-core";
import { ApplicationCommandOptionType, ButtonStyle, ChannelType, ComponentType, GatewayCloseCodes, GatewayCloseCodes as GatewayCloseCodes$1, GatewayDispatchEvents, GatewayIntentBits, GatewayOpcodes, PermissionFlagsBits } from "discord-api-types/v10";
import { Type } from "typebox";
import { Check, Errors } from "typebox/value";
import { createHash, randomUUID } from "node:crypto";
import { MAX_DATE_TIMESTAMP_MS, MAX_TIMER_TIMEOUT_MS, asDateTimestampMs, asSafeIntegerInRange, parseFiniteNumber, parseStrictInteger, parseStrictPositiveInteger, resolveDateTimestampMs, resolvePromptHistoryLimit, resolveTimestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { inspect } from "node:util";
import { createHttp1EnvHttpProxyAgent, createHttp1ProxyAgent, createNodeProxyAgent, resolveEnvHttpProxyAgentOptions, wrapFetchWithAbortSignal } from "openclaw/plugin-sdk/fetch-runtime";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { fetchWithSsrFGuard, formatErrorMessage, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
import { PlatformMessageNotDispatchedError, formatErrorMessage as formatErrorMessage$1, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { asFiniteNumber, asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries, parseFiniteNumber as parseFiniteNumber$1, parseStrictNonNegativeInteger as parseStrictNonNegativeInteger$1, summarizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createRuntimeConfigReader, getRuntimeConfig, getRuntimeConfigSnapshot } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { renderPresentationForDelivery } from "openclaw/plugin-sdk/interactive-runtime";
import { hasOutboundReplyContent, resolveSendableOutboundReplyParts, resolveTextChunksWithFallback } from "openclaw/plugin-sdk/reply-payload";
import { createNonExitingRuntime, createSubsystemLogger, danger, formatDurationSeconds, isVerbose, logVerbose, shouldLogVerbose, sleepWithAbort, warn } from "openclaw/plugin-sdk/runtime-env";
import { sliceUtf16Safe, truncateUtf16Safe, withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
import { addAllowlistUserEntriesFromConfigEntry, buildAllowlistResolutionSummary, canonicalizeAllowlistWithResolvedIds, patchAllowlistUsersInConfigEntries, summarizeMapping } from "openclaw/plugin-sdk/allow-from";
import { resolveChunkMode, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { chunkItems, findCodeRegions, sanitizeAssistantVisibleText, sanitizeAssistantVisibleTextWithProfile } from "openclaw/plugin-sdk/text-chunking";
import { buildOutboundSessionContext, listMessageReceiptPlatformIds, resolveChannelStreamingBlockEnabled, sendDurableMessageBatch } from "openclaw/plugin-sdk/channel-outbound";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { loadWebMedia } from "openclaw/plugin-sdk/web-media";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { buildCommandTextFromArgs, findCommandByNativeName, formatCommandArgMenuTitle, listChatCommands, listNativeCommandSpecsForConfig, listSkillCommandsForAgents, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveEffectiveAgentRuntime, resolveNativeCommandSessionTargets, resolveStoredModelOverride, serializeCommandArgs } from "openclaw/plugin-sdk/command-auth-native";
import { GROUP_POLICY_BLOCKED_LABEL, resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { buildChannelInboundEventContext, createChannelPartialDeliveryError, createCommandTurnContext, dispatchChannelInboundTurn, formatInboundEnvelope, hasVisibleInboundReplyDispatch, isChannelPartialDeliveryError, resolveEnvelopeFormatOptions, resolveInboundSupplementalSenderAllowed, runChannelInboundEvent } from "openclaw/plugin-sdk/channel-inbound";
import path from "node:path";
import { resolvePinnedMainDmOwnerFromAllowlist as resolvePinnedMainDmOwnerFromAllowlist$1 } from "openclaw/plugin-sdk/security-runtime";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { buildPairingReply, upsertChannelPairingRequest, upsertChannelPairingRequest as upsertChannelPairingRequest$1 } from "openclaw/plugin-sdk/conversation-runtime";
import { ensureConfiguredBindingRouteReady, resolveConfiguredBindingRoute } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { readChannelIngressStoreAllowFromForDmPolicy } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { resolveNativeCommandsEnabled, resolveNativeSkillsEnabled } from "openclaw/plugin-sdk/native-command-config-runtime";
import { requestHeartbeat } from "openclaw/plugin-sdk/heartbeat-runtime";
import { enqueueRoutedSystemEvent, enqueueRoutedSystemEvent as enqueueRoutedSystemEvent$1 } from "openclaw/plugin-sdk/system-event-runtime";
import { clearExpiredCooldowns, ensureAuthProfileStore, formatReasoningMessage, getPreparedModelCatalogSnapshot, isProfileInCooldown, listAgentIds, loadPreparedModelCatalog, resolveAgentAvatar, resolveAgentDir, resolveDefaultModelForAgent, resolveHumanDelayConfig, resolveProfilesUnavailableReason } from "openclaw/plugin-sdk/agent-runtime";
import { deleteSessionEntry, getSessionEntry, listSessionEntries, readSessionUpdatedAt as readSessionUpdatedAt$1, resolveStorePath, resolveStorePath as resolveStorePath$1 } from "openclaw/plugin-sdk/session-store-runtime";
import { captureHttpExchange, captureWsEvent, resolveDebugProxySettings, resolveEffectiveDebugProxyUrl } from "openclaw/plugin-sdk/proxy-capture";
import { resolveRequestUrl } from "openclaw/plugin-sdk/request-url";
import { fetchWithRuntimeDispatcher } from "openclaw/plugin-sdk/runtime-fetch";
import { Agent } from "undici";
import * as dns from "node:dns";
import { buildCommandTextFromArgs as buildCommandTextFromArgs$1, findCommandByNativeName as findCommandByNativeName$1, mergeNativeCommandSpecs, parseCommandArgs, resolveCommandArgChoices, resolveCommandArgMenu, serializeCommandArgs as serializeCommandArgs$1 } from "openclaw/plugin-sdk/native-command-registry";
import { PLUGIN_COMMAND_DISPATCH } from "openclaw/plugin-sdk/plugin-command-runtime";
import { resolveDirectStatusReplyForSession } from "openclaw/plugin-sdk/command-status-runtime";
import * as modelsProviderRuntime from "openclaw/plugin-sdk/models-provider-runtime";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { EventEmitter } from "node:events";
import { Agent as Agent$1 } from "node:https";
import { channelReadyPatch, createTransportActivityStatusPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { stripPlainTextToolCallBlocks } from "openclaw/plugin-sdk/tool-payload";
import { createChannelInteractiveDispatcher } from "openclaw/plugin-sdk/plugin-runtime";
import { resolveApprovalOverGateway } from "openclaw/plugin-sdk/approval-gateway-runtime";
import { reportChannelRoomJoin } from "openclaw/plugin-sdk/channel-join-intro-runtime";
//#region extensions/discord/src/monitor/listeners.queue.ts
const DISCORD_SLOW_LISTENER_THRESHOLD_MS = 3e4;
const discordEventQueueLog = createSubsystemLogger("discord/event-queue");
function formatListenerContextValue(value) {
	if (value === void 0 || value === null) return null;
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : null;
	}
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	return null;
}
function formatListenerContextSuffix(context) {
	if (!context) return "";
	const entries = Object.entries(context).flatMap(([key, value]) => {
		const formatted = formatListenerContextValue(value);
		return formatted ? [`${key}=${formatted}`] : [];
	});
	if (entries.length === 0) return "";
	return ` (${entries.join(" ")})`;
}
function logSlowDiscordListener(params) {
	if (params.durationMs < DISCORD_SLOW_LISTENER_THRESHOLD_MS) return;
	const duration = formatDurationSeconds(params.durationMs, {
		decimals: 1,
		unit: "seconds"
	});
	const message = `Slow listener detected: ${params.listener} took ${duration} for event ${params.event}`;
	(params.logger ?? discordEventQueueLog).warn("Slow listener detected", {
		listener: params.listener,
		event: params.event,
		durationMs: params.durationMs,
		duration,
		...params.context,
		consoleMessage: `${message}${formatListenerContextSuffix(params.context)}`
	});
}
async function runDiscordListenerWithSlowLog(params) {
	const startedAt = Date.now();
	try {
		await params.run();
	} catch (err) {
		if (params.onError) {
			params.onError(err);
			return;
		}
		throw err;
	} finally {
		logSlowDiscordListener({
			logger: params.logger,
			listener: params.listener,
			event: params.event,
			durationMs: Date.now() - startedAt,
			context: params.context
		});
	}
}
//#endregion
//#region extensions/discord/src/monitor/presence-events.ts
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
//#endregion
//#region extensions/discord/src/monitor/presence-cooldown-store.ts
const DISCORD_PRESENCE_COOLDOWN_MAX_ENTRIES = 25e3;
function openDiscordPresenceCooldownStore() {
	return getDiscordRuntime().state.openKeyedStore({
		namespace: "presence-greeting-cooldowns",
		maxEntries: DISCORD_PRESENCE_COOLDOWN_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		defaultTtlMs: DISCORD_PRESENCE_GREETING_COOLDOWN_MS
	});
}
//#endregion
//#region extensions/discord/src/monitor/presence-emission-gate.ts
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
		this.nextReservationId = 0;
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
			id: this.nextReservationId++,
			atMs: nowMs,
			committed: false
		};
		state.reservations.push(reservation);
		return {
			allowed: true,
			reservation: reservation.id
		};
	}
	commitBurst(guildId, reservation, nowMs) {
		const entry = this.burstByGuild.get(guildId)?.reservations.find((candidate) => candidate.id === reservation);
		if (!entry) return;
		entry.atMs = nowMs;
		entry.committed = true;
	}
	releaseBurst(guildId, reservation) {
		const state = this.burstByGuild.get(guildId);
		if (!state) return;
		state.reservations = state.reservations.filter((candidate) => candidate.id !== reservation);
		if (state.reservations.length === 0 && !state.logged) this.burstByGuild.delete(guildId);
	}
};
//#endregion
//#region extensions/discord/src/monitor/presence-transition-cache.ts
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
		this.deleteMarker(this.onlineByKey, scope, key);
		return this.observe(this.offlineByKey, scope, key);
	}
	observeOnline(scope, key) {
		this.deleteMarker(this.offlineByKey, scope, key);
		return this.observe(this.onlineByKey, scope, key);
	}
	deleteMarker(markers, scope, key) {
		if (markers.get(key) === scope) markers.delete(key);
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
//#endregion
//#region extensions/discord/src/monitor/thread-session-close.ts
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
	function sessionKeyContainsThreadId(key) {
		return segmentRe.test(key);
	}
	let resetCount = 0;
	for (const agentId of listAgentIds(cfg)) {
		const storePath = resolveStorePath(cfg.session?.store, { agentId });
		for (const { sessionKey, entry } of listSessionEntries({
			agentId,
			storePath,
			readOnly: true
		})) {
			if (!sessionKeyContainsThreadId(sessionKey)) continue;
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
//#endregion
//#region extensions/discord/src/monitor/dm-command-auth.ts
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
	return async ({ name, group, accountId, subject }) => {
		if (group.type !== "discord.channelAudience") return false;
		const senderId = String(subject.stableId ?? "").trim();
		if (!senderId) return false;
		if ((group.membership ?? "canViewChannel") !== "canViewChannel") return false;
		try {
			return await canViewDiscordGuildChannel(group.guildId, group.channelId, senderId, {
				cfg,
				accountId,
				token: params.token,
				rest: params.rest
			});
		} catch (err) {
			logVerbose(`discord: accessGroup:${name} lookup failed for user ${senderId}: ${String(err)}`);
			throw err;
		}
	};
}
function createDiscordIngressResolver(params) {
	return getDiscordRuntime().channel.inbound.ingress.createResolver({
		channelId: DISCORD_CHANNEL_ID,
		accountId: params.accountId,
		identity: discordIngressIdentity,
		cfg: params.cfg,
		resolveAccessGroupMembership: createDiscordDynamicAccessGroupResolver({
			cfg: params.cfg,
			token: params.token,
			rest: params.rest
		}),
		...params.readStoreAllowFrom ? { readStoreAllowFrom: params.readStoreAllowFrom } : {},
		...params.useDefaultPairingStore !== void 0 ? { useDefaultPairingStore: params.useDefaultPairingStore } : {}
	});
}
function syntheticAccessGroupMembership(groupName, allowed) {
	return allowed ? {
		kind: "matched",
		groupName,
		source: "dynamic",
		matchedEntryIds: [groupName]
	} : {
		kind: "not-matched",
		groupName,
		source: "dynamic"
	};
}
async function resolveDiscordDmCommandAccess(params) {
	return await createDiscordIngressResolver({
		accountId: params.accountId,
		cfg: params.cfg,
		token: params.token,
		rest: params.rest,
		readStoreAllowFrom: params.readStoreAllowFrom,
		useDefaultPairingStore: params.readStoreAllowFrom == null
	}).message({
		subject: createDiscordDmIngressSubject(params.sender),
		conversation: {
			kind: "direct",
			id: params.conversationId ?? params.sender.id,
			parentId: params.conversationParentId,
			threadId: params.conversationThreadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		event: {
			kind: params.eventKind ?? "native-command",
			authMode: "inbound",
			mayPair: true
		},
		dmPolicy: params.dmPolicy,
		groupPolicy: "disabled",
		policy: {
			mutableIdentifierMatching: params.allowNameMatching ? "enabled" : "disabled",
			...params.minIdentifierAuthentication ? { minIdentifierAuthentication: params.minIdentifierAuthentication } : {}
		},
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
	const accessGroupMembership = params.memberAccessConfigured ? [syntheticAccessGroupMembership(memberAccessGroup, params.memberAllowed)] : [];
	return await createDiscordIngressResolver({
		accountId: params.accountId,
		cfg: params.cfg,
		token: params.token,
		rest: params.rest
	}).command({
		subject: createDiscordDmIngressSubject(params.sender),
		conversation: {
			kind: "channel",
			id: params.conversationId ?? "discord-command",
			parentId: params.conversationParentId,
			threadId: params.conversationThreadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		accessGroupMembership,
		dmPolicy: "allowlist",
		groupPolicy: "allowlist",
		policy: {
			mutableIdentifierMatching: params.allowNameMatching ? "enabled" : "disabled",
			...params.minIdentifierAuthentication ? { minIdentifierAuthentication: params.minIdentifierAuthentication } : {}
		},
		allowFrom: ownerAllowFrom,
		groupAllowFrom: commandGroup,
		command: {
			allowTextCommands: params.allowTextCommands,
			hasControlCommand: params.hasControlCommand,
			modeWhenAccessGroupsOff: "configured"
		}
	});
}
//#endregion
//#region extensions/discord/src/monitor/listeners.reactions.ts
var DiscordReactionListener = class extends MessageReactionAddListener {
	constructor(params) {
		super();
		this.params = params;
	}
	async handle(data, client) {
		this.params.onEvent?.();
		await runDiscordReactionHandler({
			data,
			client,
			action: "added",
			handlerParams: this.params,
			listener: this.constructor.name,
			event: this.type
		});
	}
};
var DiscordReactionRemoveListener = class extends MessageReactionRemoveListener {
	constructor(params) {
		super();
		this.params = params;
	}
	async handle(data, client) {
		this.params.onEvent?.();
		await runDiscordReactionHandler({
			data,
			client,
			action: "removed",
			handlerParams: this.params,
			listener: this.constructor.name,
			event: this.type
		});
	}
};
async function runDiscordReactionHandler(initialParams) {
	const policy = await initialParams.handlerParams.readPolicy?.();
	const params = policy ? {
		...initialParams,
		handlerParams: {
			...initialParams.handlerParams,
			...policy,
			isPolicyCurrent: policy.isCurrent
		}
	} : initialParams;
	await runDiscordListenerWithSlowLog({
		logger: params.handlerParams.logger,
		listener: params.listener,
		event: params.event,
		run: async () => handleDiscordReactionEvent({
			data: params.data,
			client: params.client,
			action: params.action,
			cfg: params.handlerParams.cfg,
			isPolicyCurrent: params.handlerParams.isPolicyCurrent,
			accountId: params.handlerParams.accountId,
			botUserId: params.handlerParams.botUserId,
			dmEnabled: params.handlerParams.dmEnabled,
			groupDmEnabled: params.handlerParams.groupDmEnabled,
			groupDmChannels: params.handlerParams.groupDmChannels,
			dmPolicy: params.handlerParams.dmPolicy,
			allowFrom: params.handlerParams.allowFrom,
			groupPolicy: params.handlerParams.groupPolicy,
			allowNameMatching: params.handlerParams.allowNameMatching,
			guildEntries: params.handlerParams.guildEntries,
			logger: params.handlerParams.logger
		})
	});
}
async function authorizeDiscordReactionIngress(params) {
	if (params.isPolicyCurrent?.() === false) return {
		allowed: false,
		reason: "policy-changed"
	};
	if (params.isDirectMessage && !params.dmEnabled) return {
		allowed: false,
		reason: "dm-disabled"
	};
	if (params.isGroupDm && !params.groupDmEnabled) return {
		allowed: false,
		reason: "group-dm-disabled"
	};
	if (params.isDirectMessage) {
		const access = await resolveDiscordDmCommandAccess({
			cfg: params.cfg,
			accountId: params.accountId,
			dmPolicy: params.dmPolicy,
			configuredAllowFrom: params.allowFrom,
			sender: {
				id: params.user.id,
				name: params.user.username,
				tag: formatDiscordUserTag(params.user)
			},
			allowNameMatching: params.allowNameMatching,
			eventKind: "reaction"
		});
		if (params.isPolicyCurrent?.() === false) return {
			allowed: false,
			reason: "policy-changed"
		};
		if (access.senderAccess.decision !== "allow") return {
			allowed: false,
			reason: access.senderAccess.reasonCode
		};
	}
	if (params.isGroupDm && !resolveGroupDmAllow({
		channels: params.groupDmChannels,
		channelId: params.channelId,
		channelName: params.channelName,
		channelSlug: params.channelSlug
	})) return {
		allowed: false,
		reason: "group-dm-not-allowlisted"
	};
	if (!params.isGuildMessage) return { allowed: true };
	const channelAllowlistConfigured = Boolean(params.guildInfo?.channels) && Object.keys(params.guildInfo?.channels ?? {}).length > 0;
	const channelAllowed = params.channelConfig?.allowed !== false;
	if (!isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(params.guildInfo),
		channelAllowlistConfigured,
		channelAllowed
	})) return {
		allowed: false,
		reason: "guild-policy"
	};
	if (params.channelConfig?.allowed === false) return {
		allowed: false,
		reason: "guild-channel-denied"
	};
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig: params.channelConfig,
		guildInfo: params.guildInfo,
		memberRoleIds: params.memberRoleIds,
		sender: {
			id: params.user.id,
			name: params.user.username,
			tag: formatDiscordUserTag(params.user)
		},
		allowNameMatching: params.allowNameMatching
	});
	if (hasAccessRestrictions && !memberAllowed) return {
		allowed: false,
		reason: "guild-member-denied"
	};
	return { allowed: true };
}
async function handleDiscordThreadReactionNotification(params) {
	if (params.reactionMode === "off") return;
	if (params.reactionMode === "all" || params.reactionMode === "allowlist") {
		const { access, channelConfig } = await params.resolveThreadChannelAccess();
		if (!access.allowed || !params.shouldNotifyReaction({
			mode: params.reactionMode,
			channelConfig
		})) return;
		const { baseText } = params.resolveReactionBase();
		params.emitReaction(baseText, params.parentId);
		return;
	}
	const message = await params.message.fetch().catch(() => null);
	const { access, channelConfig } = await params.resolveThreadChannelAccess();
	const messageAuthorId = message?.author?.id ?? void 0;
	if (!access.allowed || !params.shouldNotifyReaction({
		mode: params.reactionMode,
		messageAuthorId,
		channelConfig
	})) return;
	params.emitReactionWithAuthor(message);
}
async function handleDiscordChannelReactionNotification(params) {
	if (params.isGuildMessage) {
		if (!(await params.authorizeReactionIngressForChannel(params.channelConfig)).allowed) return;
	}
	if (params.reactionMode === "off") return;
	if (params.reactionMode === "all" || params.reactionMode === "allowlist") {
		if (!params.shouldNotifyReaction({
			mode: params.reactionMode,
			channelConfig: params.channelConfig
		})) return;
		const { baseText } = params.resolveReactionBase();
		params.emitReaction(baseText, params.parentId);
		return;
	}
	const message = await params.message.fetch().catch(() => null);
	const messageAuthorId = message?.author?.id ?? void 0;
	if (!params.shouldNotifyReaction({
		mode: params.reactionMode,
		messageAuthorId,
		channelConfig: params.channelConfig
	})) return;
	params.emitReactionWithAuthor(message);
}
function hasDiscordGuildChannelOverrides(guildInfo) {
	return Boolean(guildInfo?.channels && Object.keys(guildInfo.channels).length > 0);
}
function shouldSkipGuildReactionBeforeChannelFetch(params) {
	if (params.reactionMode === "off" || params.groupPolicy === "disabled") return true;
	if (params.reactionMode !== "allowlist") return false;
	if (hasDiscordGuildChannelOverrides(params.guildInfo)) return false;
	return !shouldEmitDiscordReactionNotification({
		mode: params.reactionMode,
		botId: params.botUserId,
		userId: params.user.id,
		userName: params.user.username,
		userTag: formatDiscordUserTag(params.user),
		guildInfo: params.guildInfo,
		memberRoleIds: params.memberRoleIds,
		allowNameMatching: params.allowNameMatching
	});
}
async function handleDiscordReactionEvent(params) {
	try {
		const { data, client, action, botUserId, guildEntries } = params;
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
		const memberRoleIds = Array.isArray(data.rawMember?.roles) ? data.rawMember.roles.map((roleId) => roleId) : [];
		const reactionMode = guildInfo?.reactionNotifications ?? "own";
		if (isGuildMessage && shouldSkipGuildReactionBeforeChannelFetch({
			reactionMode,
			guildInfo,
			groupPolicy: params.groupPolicy,
			memberRoleIds,
			user,
			botUserId,
			allowNameMatching: params.allowNameMatching
		})) return;
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
		const reactionIngressBase = {
			isPolicyCurrent: params.isPolicyCurrent,
			cfg: params.cfg,
			accountId: params.accountId,
			user,
			memberRoleIds,
			isDirectMessage,
			isGroupDm,
			isGuildMessage,
			channelId: data.channel_id,
			channelName,
			channelSlug,
			dmEnabled: params.dmEnabled,
			groupDmEnabled: params.groupDmEnabled,
			groupDmChannels: params.groupDmChannels,
			dmPolicy: params.dmPolicy,
			allowFrom: params.allowFrom,
			groupPolicy: params.groupPolicy,
			allowNameMatching: params.allowNameMatching,
			guildInfo
		};
		if (!isGuildMessage) {
			const ingressAccess = await authorizeDiscordReactionIngress(reactionIngressBase);
			if (!ingressAccess.allowed) {
				logVerbose(`discord reaction blocked sender=${user.id} (reason=${ingressAccess.reason})`);
				return;
			}
		}
		const parentId = isThreadChannel ? channelContext.threadParentId : channelContext.parentId;
		const parentName = isThreadChannel ? channelContext.threadParentName : void 0;
		const parentSlug = isThreadChannel ? channelContext.threadParentSlug : "";
		let reactionBase = null;
		const resolveReactionBase = () => {
			if (reactionBase) return reactionBase;
			const emojiLabel = formatDiscordReactionEmoji(data.emoji);
			const actorLabel = formatDiscordUserTag(user) || user.id;
			const guildSlug = guildInfo?.slug || (data.guild?.name ? normalizeDiscordSlug(data.guild.name) : data.guild_id ?? (isGroupDm ? "group-dm" : "dm"));
			const channelLabel = channelSlug ? `#${channelSlug}` : channelName ? `#${normalizeDiscordSlug(channelName)}` : `#${data.channel_id}`;
			reactionBase = {
				baseText: `Discord ${data.burst ? "super " : ""}reaction ${action}: ${emojiLabel} by ${actorLabel} on ${guildSlug} ${channelLabel} msg ${data.message_id}`,
				contextKey: `discord:reaction:${action}:${data.message_id}:${user.id}:${emojiLabel}${data.burst ? ":burst" : ""}`
			};
			return reactionBase;
		};
		const emitReaction = (text, parentPeerId) => {
			const { contextKey } = resolveReactionBase();
			const route = resolveAgentRoute({
				cfg: params.cfg,
				channel: "discord",
				accountId: params.accountId,
				guildId: data.guild_id ?? void 0,
				memberRoleIds,
				peer: {
					kind: isDirectMessage ? "direct" : isGroupDm ? "group" : "channel",
					id: isDirectMessage ? user.id : data.channel_id
				},
				parentPeer: parentPeerId ? {
					kind: "channel",
					id: parentPeerId
				} : void 0
			});
			enqueueRoutedSystemEvent(text, route, { contextKey });
		};
		const shouldNotifyReaction = (options) => shouldEmitDiscordReactionNotification({
			mode: options.mode,
			botId: botUserId,
			messageAuthorId: options.messageAuthorId,
			userId: user.id,
			userName: user.username,
			userTag: formatDiscordUserTag(user),
			channelConfig: options.channelConfig,
			guildInfo,
			memberRoleIds,
			allowNameMatching: params.allowNameMatching
		});
		const emitReactionWithAuthor = (message) => {
			const { baseText } = resolveReactionBase();
			const authorLabel = message?.author ? formatDiscordUserTag(message.author) : void 0;
			const text = authorLabel ? `${baseText} from ${authorLabel}` : baseText;
			emitReaction(text, parentId);
		};
		const resolveThreadChannelConfig = () => resolveDiscordChannelConfigWithFallback({
			guildInfo,
			channelId: data.channel_id,
			channelName,
			channelSlug,
			parentId,
			parentName,
			parentSlug,
			scope: "thread"
		});
		const authorizeReactionIngressForChannel = async (channelConfig) => await authorizeDiscordReactionIngress({
			...reactionIngressBase,
			channelConfig
		});
		const resolveThreadChannelAccess = async () => {
			const channelConfig = resolveThreadChannelConfig();
			return {
				access: await authorizeReactionIngressForChannel(channelConfig),
				channelConfig
			};
		};
		if (isThreadChannel) {
			await handleDiscordThreadReactionNotification({
				reactionMode,
				message: data.message,
				parentId,
				resolveThreadChannelAccess,
				shouldNotifyReaction,
				resolveReactionBase,
				emitReaction,
				emitReactionWithAuthor
			});
			return;
		}
		const channelConfig = resolveDiscordChannelConfigWithFallback({
			guildInfo,
			channelId: data.channel_id,
			channelName,
			channelSlug,
			parentId,
			parentName,
			parentSlug,
			scope: "channel"
		});
		await handleDiscordChannelReactionNotification({
			isGuildMessage,
			reactionMode,
			message: data.message,
			channelConfig,
			parentId,
			authorizeReactionIngressForChannel,
			shouldNotifyReaction,
			resolveReactionBase,
			emitReaction,
			emitReactionWithAuthor
		});
	} catch (err) {
		params.logger.error(danger(`discord reaction handler failed: ${String(err)}`));
	}
}
//#endregion
//#region extensions/discord/src/monitor/listeners.ts
function registerDiscordListener(listeners, listener) {
	if (listeners.some((existing) => existing.constructor === listener.constructor)) return false;
	listeners.push(listener);
	return true;
}
var DiscordMessageListener = class extends MessageCreateListener {
	constructor(handler, logger, onEvent) {
		super();
		this.handler = handler;
		this.logger = logger;
		this.onEvent = onEvent;
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
var DiscordInteractionListener = class extends InteractionCreateListener {
	constructor(logger, onEvent) {
		super();
		this.logger = logger;
		this.onEvent = onEvent;
	}
	async handle(data, client) {
		this.onEvent?.();
		Promise.resolve().then(() => client.handleInteraction(data, {})).catch((err) => {
			(this.logger ?? discordEventQueueLog).error(danger(`discord interaction handler failed: ${String(err)}`));
		});
	}
};
var DiscordPresenceListener = class extends PresenceUpdateListener {
	constructor(params) {
		super();
		this.params = params;
		this.pendingByGuildUser = /* @__PURE__ */ new Map();
		this.pendingGuildSeeds = /* @__PURE__ */ new Map();
		this.guildPresenceState = /* @__PURE__ */ new Map();
		this.gatewayGeneration = 0;
		this.stopped = false;
		this.activeRuns = /* @__PURE__ */ new Set();
		this.cooldownStore = params.cooldownStore ?? openDiscordPresenceCooldownStore();
		this.presenceBaseline = params.presenceBaseline ?? new DiscordPresenceBaselineCache();
		this.emissionGate = params.emissionGate ?? new DiscordPresenceEmissionGate();
	}
	async seedGuildSnapshot(data) {
		if (this.stopped) return;
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
		this.invalidateGuild(data.id);
		const gatewayGeneration = this.gatewayGeneration;
		const guildGeneration = this.guildPresenceState.get(data.id).generation;
		const seed = (async () => {
			const policy = await this.params.readPolicy();
			if (!this.isCurrentGeneration(data.id, gatewayGeneration, guildGeneration) || !policy.isCurrent()) return false;
			this.seedGuildSnapshotWithPolicy(data, policy.guildEntries);
			return true;
		})();
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
		if (!config || config.enabled === false) return;
		const keyPrefix = `${this.params.accountId}:${data.id}:`;
		const generation = (this.guildPresenceState.get(data.id)?.generation ?? 0) + 1;
		this.guildPresenceState.set(data.id, {
			generation,
			inferUnknownAsNewlyAvailable: false
		});
		this.detachPendingPrefix(keyPrefix);
		this.presenceBaseline.clearScope(data.id);
		if (data.unavailable === true || !("presences" in data) || !Array.isArray(data.presences)) return;
		this.guildPresenceState.set(data.id, {
			generation,
			inferUnknownAsNewlyAvailable: data.member_count <= 75e3
		});
		for (const presence of data.presences) {
			const userId = presence.user?.id;
			if (!userId || config.users !== void 0 && !config.users.includes(userId)) continue;
			const key = `${keyPrefix}${userId}`;
			if (isDiscordOfflineStatus(presence.status)) this.recordPresenceBaseline(data.id, key, "offline");
			else if (isDiscordOnlineStatus(presence.status)) this.recordPresenceBaseline(data.id, key, "online");
		}
	}
	async handle(data, client) {
		const userId = data.user?.id;
		if (!userId || this.stopped) return;
		setPresence(this.params.accountId, userId, data);
		const pendingSeed = this.pendingGuildSeeds.get(data.guild_id);
		if (pendingSeed && !await pendingSeed) return;
		if (this.stopped) return;
		const presenceKey = `${this.params.accountId}:${data.guild_id}:${userId}`;
		const gatewayGeneration = this.gatewayGeneration;
		const guildGeneration = this.guildPresenceState.get(data.guild_id)?.generation ?? 0;
		const run = (this.pendingByGuildUser.get(presenceKey) ?? Promise.resolve()).then(() => this.handleSerial(data, client, userId, presenceKey, gatewayGeneration, guildGeneration), () => this.handleSerial(data, client, userId, presenceKey, gatewayGeneration, guildGeneration));
		this.pendingByGuildUser.set(presenceKey, run);
		this.activeRuns.add(run);
		try {
			await run;
		} catch (err) {
			(this.params.logger ?? discordEventQueueLog).error(danger(`discord presence handler failed: ${String(err)}`));
		} finally {
			this.activeRuns.delete(run);
			if (this.pendingByGuildUser.get(presenceKey) === run) this.pendingByGuildUser.delete(presenceKey);
		}
	}
	async stop() {
		this.stopped = true;
		this.resetGatewaySession();
		await Promise.allSettled(this.activeRuns);
	}
	resetGatewaySession() {
		this.gatewayGeneration += 1;
		this.emissionGate.noteGatewaySessionReset(this.params.nowMs?.() ?? Date.now());
		this.presenceBaseline.clear();
		this.guildPresenceState.clear();
		this.pendingGuildSeeds.clear();
		this.pendingByGuildUser.clear();
		clearPresences(this.params.accountId);
	}
	invalidateGuild(guildId) {
		this.pendingGuildSeeds.delete(guildId);
		const keyPrefix = `${this.params.accountId}:${guildId}:`;
		const generation = (this.guildPresenceState.get(guildId)?.generation ?? 0) + 1;
		this.guildPresenceState.set(guildId, {
			generation,
			inferUnknownAsNewlyAvailable: false
		});
		this.presenceBaseline.clearScope(guildId);
		this.detachPendingPrefix(keyPrefix);
	}
	detachPendingPrefix(prefix) {
		for (const key of this.pendingByGuildUser.keys()) if (key.startsWith(prefix)) this.pendingByGuildUser.delete(key);
	}
	async handleSerial(data, client, userId, presenceKey, gatewayGeneration, guildGeneration) {
		if (!this.isCurrentGeneration(data.guild_id, gatewayGeneration, guildGeneration)) return;
		const policy = await this.params.readPolicy?.();
		const cfg = policy?.cfg ?? this.params.cfg;
		if (!this.isCurrentGeneration(data.guild_id, gatewayGeneration, guildGeneration) || policy?.isCurrent() === false) return;
		const config = resolveDiscordGuildEntry({
			guildId: data.guild_id,
			guildEntries: policy ? policy.guildEntries : this.params.guildEntries
		})?.presenceEvents;
		if (!config || config.enabled === false) return;
		if (config.users !== void 0 && !config.users.includes(userId)) return;
		const lastEmittedAtMs = await this.cooldownStore.lookup(presenceKey);
		if (!this.isCurrentGeneration(data.guild_id, gatewayGeneration, guildGeneration) || policy?.isCurrent() === false) return;
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
			if (isDiscordOfflineStatus(data.status)) this.recordPresenceBaseline(data.guild_id, presenceKey, "offline");
			else if (isDiscordOnlineStatus(data.status)) this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			return;
		}
		const gateOptions = resolveDiscordPresenceGateOptions(config);
		const reconnectGate = this.emissionGate.evaluateReconnectWindow(nowMs, gateOptions);
		if (!reconnectGate.allowed) {
			if (reconnectGate.shouldLog) (this.params.logger ?? discordEventQueueLog).info("Discord presence events suppressed", {
				reason: reconnectGate.reason,
				accountId: this.params.accountId,
				guildId: data.guild_id
			});
			this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			return;
		}
		const burstNowMs = this.params.nowMs?.() ?? Date.now();
		const burstGate = this.emissionGate.reserveBurst(data.guild_id, burstNowMs, gateOptions);
		if (!burstGate.allowed) {
			if (burstGate.shouldLog) (this.params.logger ?? discordEventQueueLog).info("Discord presence events suppressed", {
				reason: burstGate.reason,
				accountId: this.params.accountId,
				guildId: data.guild_id
			});
			if (burstGate.reason === "burst-pending") return;
			this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			return;
		}
		const burstReservation = burstGate.reservation;
		let burstCommitted = false;
		let cooldownReserved = false;
		try {
			const fetchedUserIsBot = data.user.bot === void 0 && (await client.fetchUser(userId)).bot === true;
			if (!this.isCurrentGeneration(data.guild_id, gatewayGeneration, guildGeneration)) return;
			if (fetchedUserIsBot) {
				this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
				return;
			}
			const canViewTargetChannel = await canViewDiscordGuildChannel(data.guild_id, presenceEvent.channelId, userId, {
				cfg,
				accountId: this.params.accountId,
				rest: client.rest
			});
			if (!this.isCurrentGeneration(data.guild_id, gatewayGeneration, guildGeneration) || policy?.isCurrent() === false) return;
			if (!canViewTargetChannel) {
				this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
				return;
			}
			const route = resolveAgentRoute({
				cfg,
				channel: "discord",
				accountId: this.params.accountId,
				guildId: data.guild_id,
				peer: {
					kind: "channel",
					id: presenceEvent.channelId
				}
			});
			try {
				cooldownReserved = await this.cooldownStore.registerIfAbsent(presenceKey, nowMs, { ttlMs: DISCORD_PRESENCE_GREETING_COOLDOWN_MS });
				if (!this.isCurrentGeneration(data.guild_id, gatewayGeneration, guildGeneration) || policy?.isCurrent() === false) return;
				if (!cooldownReserved) {
					this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
					return;
				}
			} catch (err) {
				(this.params.logger ?? discordEventQueueLog).warn(danger(`discord presence cooldown persistence failed: ${String(err)}`));
				return;
			}
			if (!enqueueRoutedSystemEvent(presenceEvent.text, route, {
				contextKey: `discord:presence-online:${this.params.accountId}:${data.guild_id}:${userId}`,
				deliveryContext: {
					channel: "discord",
					to: `channel:${presenceEvent.channelId}`,
					accountId: this.params.accountId
				}
			})) return;
			this.emissionGate.commitBurst(data.guild_id, burstReservation, this.params.nowMs?.() ?? Date.now());
			burstCommitted = true;
			this.recordPresenceBaseline(data.guild_id, presenceKey, "online");
			requestHeartbeat({
				source: "notifications-event",
				intent: "immediate",
				reason: "wake",
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				heartbeat: {
					target: "discord",
					to: `channel:${presenceEvent.channelId}`,
					accountId: this.params.accountId
				}
			});
		} finally {
			if (!burstCommitted) this.emissionGate.releaseBurst(data.guild_id, burstReservation);
			if (cooldownReserved && !burstCommitted) await this.cooldownStore.deleteIfEqual?.(presenceKey, nowMs);
		}
	}
	isCurrentGeneration(guildId, gatewayGeneration, guildGeneration) {
		return !this.stopped && gatewayGeneration === this.gatewayGeneration && guildGeneration === (this.guildPresenceState.get(guildId)?.generation ?? 0);
	}
	recordPresenceBaseline(guildId, key, status) {
		const evictedGuildId = status === "offline" ? this.presenceBaseline.observeOffline(guildId, key) : this.presenceBaseline.observeOnline(guildId, key);
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
var DiscordPresenceGuildDeleteListener = class extends GuildDeleteListener {
	constructor(presenceListener) {
		super();
		this.presenceListener = presenceListener;
	}
	handle(data) {
		this.presenceListener.invalidateGuild(data.id);
	}
};
var DiscordPresenceReadyListener = class extends ReadyListener {
	constructor(presenceListener) {
		super();
		this.presenceListener = presenceListener;
	}
	handle() {
		this.presenceListener.resetGatewaySession();
	}
};
const DISCORD_THREAD_REJOIN_CLAIM_MAX_ENTRIES = 1e4;
var DiscordThreadUpdateListener = class extends ThreadUpdateListener {
	constructor(cfg, logger) {
		super();
		this.cfg = cfg;
		this.logger = logger;
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
				const claim = Symbol(threadId);
				this.rejoinClaims.set(threadId, claim);
				pruneMapToMaxSize(this.rejoinClaims, DISCORD_THREAD_REJOIN_CLAIM_MAX_ENTRIES);
				try {
					await client.rest.put(`/channels/${threadId}/thread-members/@me`);
					logger.info("Discord active thread — rejoined thread", { threadId });
				} catch (err) {
					if (this.rejoinClaims.get(threadId) === claim) this.rejoinClaims.delete(threadId);
					logger.warn(danger(`discord thread rejoin failed: ${String(err)}`), { threadId });
				}
			},
			onError: (err) => {
				(this.logger ?? discordEventQueueLog).error(danger(`discord thread-update handler failed: ${String(err)}`));
			}
		});
	}
};
var DiscordThreadReadyListener = class extends ReadyListener {
	constructor(threadUpdateListener) {
		super();
		this.threadUpdateListener = threadUpdateListener;
	}
	handle() {
		this.threadUpdateListener.resetGatewaySession();
	}
};
var DiscordThreadDeleteListener = class extends ThreadDeleteListener {
	constructor(cfg, accountId, logger) {
		super();
		this.cfg = cfg;
		this.accountId = accountId;
		this.logger = logger;
	}
	async handle(data) {
		await runDiscordListenerWithSlowLog({
			logger: this.logger,
			listener: this.constructor.name,
			event: this.type,
			run: async () => {
				const threadId = data.id;
				getThreadBindingManager(this.accountId)?.unbindThread({
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
//#endregion
//#region extensions/discord/src/internal/gateway-dispatch.ts
function dispatchVoiceGatewayEvent(client, type, data) {
	const guildId = readGuildId(data);
	if (!guildId) return;
	const adapter = (client.getPlugin("voice")?.adapters)?.get(guildId);
	const voiceServerUpdate = GatewayDispatchEvents.VoiceServerUpdate;
	const voiceStateUpdate = GatewayDispatchEvents.VoiceStateUpdate;
	if (type === voiceServerUpdate) adapter?.onVoiceServerUpdate?.(data);
	if (type === voiceStateUpdate) adapter?.onVoiceStateUpdate?.(data);
}
function mapGatewayDispatchData(client, type, data) {
	const messageCreate = GatewayDispatchEvents.MessageCreate;
	const reactionAdd = GatewayDispatchEvents.MessageReactionAdd;
	const reactionRemove = GatewayDispatchEvents.MessageReactionRemove;
	if (type === messageCreate) return createMessageDispatchData(client, data);
	if (type === reactionAdd || type === reactionRemove) return createReactionDispatchData(client, data);
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
function readGuildId(data) {
	return data && typeof data === "object" && typeof data.guild_id === "string" ? data.guild_id : void 0;
}
//#endregion
//#region extensions/discord/src/monitor/provider.allowlist.ts
function formatResolutionLogDetails(base, details) {
	const nonEmpty = details.map((value) => value?.trim()).filter((value) => Boolean(value));
	return nonEmpty.length > 0 ? `${base} (${nonEmpty.join("; ")})` : base;
}
function formatResolvedBase(input, target) {
	if (!target) return input;
	return input === target ? input : `${input}→${target}`;
}
function formatAliasSummary(aliases) {
	if (aliases.length === 0) return;
	const preview = aliases.slice(0, 3).join(", ");
	if (aliases.length <= 3) return preview;
	return `${preview}, +${aliases.length - 3} more`;
}
function formatDiscordChannelResolvedGroup(entry) {
	const aliasSummary = formatAliasSummary(entry.aliases);
	return formatResolutionLogDetails(entry.target, [
		entry.guildName ? `guild:${entry.guildName}` : void 0,
		entry.channelName ? `channel:${entry.channelName}` : void 0,
		entry.note,
		aliasSummary ? `aliases:${aliasSummary}` : void 0
	]);
}
function formatDiscordChannelUnresolved(entry) {
	return formatResolutionLogDetails(entry.input, [
		entry.guildName ? `guild:${entry.guildName}` : entry.guildId ? `guildId:${entry.guildId}` : void 0,
		entry.channelName ? `channel:${entry.channelName}` : entry.channelId ? `channelId:${entry.channelId}` : void 0,
		entry.note
	]);
}
function formatDiscordUserResolved(entry) {
	const displayName = entry.name?.trim();
	const target = displayName || entry.id;
	const formatted = formatResolutionLogDetails(formatResolvedBase(entry.input, target), [
		displayName && entry.id && entry.id !== entry.input ? `id:${entry.id}` : void 0,
		entry.guildName ? `guild:${entry.guildName}` : void 0,
		entry.note
	]);
	return formatted === entry.input ? null : formatted;
}
function formatDiscordUserUnresolved(entry) {
	return formatResolutionLogDetails(entry.input, [
		entry.name ? `name:${entry.name}` : void 0,
		entry.guildName ? `guild:${entry.guildName}` : void 0,
		entry.note
	]);
}
function toGuildEntries(value) {
	if (!value || typeof value !== "object") return {};
	const out = {};
	for (const [key, entry] of Object.entries(value)) {
		if (!entry || typeof entry !== "object") continue;
		out[key] = entry;
	}
	return out;
}
function toAllowlistEntries(value) {
	if (!Array.isArray(value)) return;
	return normalizeStringEntries(value);
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
async function resolveGuildEntriesByChannelAllowlist(params) {
	const entries = collectChannelResolutionInputs(params.guildEntries);
	if (entries.length === 0) return params.guildEntries;
	try {
		const resolved = await resolveDiscordChannelAllowlist({
			token: params.token,
			entries: entries.map((entry) => entry.input),
			fetcher: params.fetcher
		});
		const sourceByInput = new Map(entries.map((entry) => [entry.input, entry]));
		const nextGuilds = { ...params.guildEntries };
		const mappingByTarget = /* @__PURE__ */ new Map();
		const unresolved = [];
		for (const entry of resolved) {
			const source = sourceByInput.get(entry.input);
			if (!source) continue;
			const sourceGuild = params.guildEntries[source.guildKey] ?? {};
			if (!entry.resolved || !entry.guildId) {
				unresolved.push(formatDiscordChannelUnresolved(entry));
				continue;
			}
			const target = entry.channelId ? `${entry.guildId}/${entry.channelId}` : entry.guildId;
			const existingGroup = mappingByTarget.get(target) ?? {
				target,
				aliases: [],
				guildName: entry.guildName,
				channelName: entry.channelName,
				note: entry.note
			};
			if (entry.input !== target && !existingGroup.aliases.includes(entry.input)) existingGroup.aliases.push(entry.input);
			if (!existingGroup.guildName && entry.guildName) existingGroup.guildName = entry.guildName;
			if (!existingGroup.channelName && entry.channelName) existingGroup.channelName = entry.channelName;
			if (!existingGroup.note && entry.note) existingGroup.note = entry.note;
			mappingByTarget.set(target, existingGroup);
			const existing = nextGuilds[entry.guildId] ?? {};
			const mergedChannels = {
				...sourceGuild.channels,
				...existing.channels
			};
			const mergedGuild = {
				...sourceGuild,
				...existing,
				channels: mergedChannels
			};
			nextGuilds[entry.guildId] = mergedGuild;
			if (source.channelKey && entry.channelId) {
				const sourceChannel = sourceGuild.channels?.[source.channelKey];
				if (sourceChannel) nextGuilds[entry.guildId] = {
					...mergedGuild,
					channels: {
						...mergedChannels,
						[entry.channelId]: {
							...sourceChannel,
							...mergedChannels[entry.channelId]
						}
					}
				};
			}
		}
		const mapping = [...mappingByTarget.values()].map((group) => formatDiscordChannelResolvedGroup(group));
		summarizeMapping("discord channels", mapping, unresolved, params.runtime);
		return nextGuilds;
	} catch (err) {
		params.runtime.log?.(`discord channel resolve failed; using config entries. ${formatErrorMessage(err)}`);
		return params.guildEntries;
	}
}
async function resolveAllowFromByUserAllowlist(params) {
	const allowEntries = normalizeStringEntries(params.allowFrom).filter((entry) => entry !== "*");
	if (allowEntries.length === 0) return params.allowFrom;
	try {
		const resolvedUsers = await resolveDiscordUserAllowlist({
			token: params.token,
			entries: allowEntries,
			fetcher: params.fetcher
		});
		const { resolvedMap, mapping, unresolved } = buildAllowlistResolutionSummary(resolvedUsers, {
			formatResolved: formatDiscordUserResolved,
			formatUnresolved: formatDiscordUserUnresolved
		});
		const allowFrom = canonicalizeAllowlistWithResolvedIds({
			existing: params.allowFrom,
			resolvedMap
		});
		summarizeMapping("discord users", mapping, unresolved, params.runtime);
		return allowFrom;
	} catch (err) {
		params.runtime.log?.(`discord user resolve failed; using config entries. ${formatErrorMessage(err)}`);
		return params.allowFrom;
	}
}
function collectGuildUserEntries(guildEntries) {
	const userEntries = /* @__PURE__ */ new Set();
	for (const guild of Object.values(guildEntries)) {
		if (!guild || typeof guild !== "object") continue;
		addAllowlistUserEntriesFromConfigEntry(userEntries, guild);
		const channels = guild.channels ?? {};
		for (const channel of Object.values(channels)) addAllowlistUserEntriesFromConfigEntry(userEntries, channel);
	}
	return userEntries;
}
async function resolveGuildEntriesByUserAllowlist(params) {
	const userEntries = collectGuildUserEntries(params.guildEntries);
	if (userEntries.size === 0) return params.guildEntries;
	try {
		const resolvedUsers = await resolveDiscordUserAllowlist({
			token: params.token,
			entries: Array.from(userEntries),
			fetcher: params.fetcher
		});
		const { resolvedMap, mapping, unresolved } = buildAllowlistResolutionSummary(resolvedUsers, {
			formatResolved: formatDiscordUserResolved,
			formatUnresolved: formatDiscordUserUnresolved
		});
		const nextGuilds = { ...params.guildEntries };
		for (const [guildKey, guildConfig] of Object.entries(params.guildEntries)) {
			if (!guildConfig || typeof guildConfig !== "object") continue;
			const nextGuild = { ...guildConfig };
			const users = guildConfig.users;
			if (Array.isArray(users) && users.length > 0) nextGuild.users = canonicalizeAllowlistWithResolvedIds({
				existing: users,
				resolvedMap
			});
			const channels = guildConfig.channels ?? {};
			if (channels && typeof channels === "object") nextGuild.channels = patchAllowlistUsersInConfigEntries({
				entries: channels,
				resolvedMap,
				strategy: "canonicalize"
			});
			nextGuilds[guildKey] = nextGuild;
		}
		summarizeMapping("discord channel users", mapping, unresolved, params.runtime);
		return nextGuilds;
	} catch (err) {
		params.runtime.log?.(`discord channel user resolve failed; using config entries. ${formatErrorMessage(err)}`);
		return params.guildEntries;
	}
}
async function resolveDiscordAllowlistConfig(params) {
	let guildEntries = toGuildEntries(params.guildEntries);
	let allowFrom = toAllowlistEntries(params.allowFrom);
	if (hasGuildEntries(guildEntries)) guildEntries = await resolveGuildEntriesByChannelAllowlist({
		token: params.token,
		guildEntries,
		fetcher: params.fetcher,
		runtime: params.runtime
	});
	if (isDangerousNameMatchingEnabled(params.discordConfig)) {
		allowFrom = await resolveAllowFromByUserAllowlist({
			token: params.token,
			allowFrom,
			fetcher: params.fetcher,
			runtime: params.runtime
		});
		if (hasGuildEntries(guildEntries)) guildEntries = await resolveGuildEntriesByUserAllowlist({
			token: params.token,
			guildEntries,
			fetcher: params.fetcher,
			runtime: params.runtime
		});
	}
	return {
		guildEntries: hasGuildEntries(guildEntries) ? guildEntries : void 0,
		allowFrom
	};
}
//#endregion
//#region extensions/discord/src/network-config.ts
const DISCORD_DNS_HOSTS = [
	"discord.com",
	"discord.gg",
	"gateway.discord.gg"
];
function normalizeHostname(hostname) {
	return hostname.trim().toLowerCase();
}
function isDiscordTransportHostname(hostname) {
	const normalized = normalizeHostname(hostname);
	if (!normalized) return false;
	return DISCORD_DNS_HOSTS.some((target) => normalized === target || normalized.endsWith(`.${target}`));
}
function reorderLookupAddresses(addresses) {
	if (!Array.isArray(addresses) || addresses.length < 2) return addresses;
	const ipv4 = addresses.filter((entry) => entry.family === 4);
	const ipv6 = addresses.filter((entry) => entry.family === 6);
	if (ipv4.length === 0) return ipv6;
	if (ipv6.length === 0) return ipv4;
	return [...ipv4, ...ipv6];
}
function createDiscordDnsLookup() {
	return (hostname, options, callback) => {
		if (!isDiscordTransportHostname(hostname)) return dns.lookup(hostname, options, callback);
		const lookupOptions = typeof options === "number" ? { family: options } : options === void 0 ? {} : { ...options };
		if (lookupOptions.family === 4 || lookupOptions.family === 6) return dns.lookup(hostname, lookupOptions, callback);
		dns.lookup(hostname, {
			...lookupOptions,
			all: true
		}, (err, addresses) => {
			if (err) {
				callback(err, "", 4);
				return;
			}
			if (!Array.isArray(addresses)) {
				callback(/* @__PURE__ */ new Error("Expected all lookup addresses to be an array"), "", 4);
				return;
			}
			const reordered = reorderLookupAddresses(addresses);
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
	const normalizedEndpointHostname = normalizeHostname(endpointHostname);
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
//#endregion
//#region extensions/discord/src/monitor/rest-fetch.ts
const discordDnsLookup$1 = createDiscordDnsLookup();
function createDirectDiscordRestDispatcher() {
	return new Agent({
		allowH2: false,
		connect: { lookup: discordDnsLookup$1 }
	});
}
function createEnvProxyDiscordRestDispatcher(runtime) {
	const envProxyOptions = resolveEnvHttpProxyAgentOptions();
	if (!envProxyOptions) return;
	try {
		return createHttp1EnvHttpProxyAgent({
			...envProxyOptions,
			connect: { lookup: discordDnsLookup$1 }
		});
	} catch (err) {
		runtime.error?.(danger(`discord: env proxy unavailable for REST fetch; using direct dispatcher: ${formatErrorMessage$1(err)}`));
		return;
	}
}
function createDiscordRestFetchWithDispatcher(dispatcher) {
	return wrapFetchWithAbortSignal(((input, init) => fetchWithRuntimeDispatcher(input, {
		...init,
		dispatcher
	}).then((response) => {
		captureHttpExchange({
			url: resolveRequestUrl(input),
			method: init?.method ?? "GET",
			requestHeaders: init?.headers,
			requestBody: init?.body ?? null,
			response,
			flowId: randomUUID(),
			meta: { subsystem: "discord-rest" }
		});
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
	return createDiscordRestFetchWithDispatcher(createEnvProxyDiscordRestDispatcher(runtime) ?? createDirectDiscordRestDispatcher());
}
//#endregion
//#region extensions/discord/src/monitor/live-policy.ts
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
			const allowFrom = useInitialPolicy ? startupConfig.allowFrom ?? resolveDiscordAccountAllowFrom({
				cfg,
				accountId: params.accountId
			}) : resolveDiscordAccountAllowFrom({
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
//#endregion
//#region extensions/discord/src/monitor/dm-command-decision.ts
async function handleDiscordDmCommandDecision(params) {
	if (params.senderAccess.decision === "allow") return true;
	if (params.senderAccess.decision === "pairing") {
		const upsertPairingRequest = params.upsertPairingRequest ?? upsertChannelPairingRequest;
		const result = await createChannelPairingChallengeIssuer({
			channel: "discord",
			accountId: params.accountId,
			upsertPairingRequest: async ({ id, meta }) => await upsertPairingRequest({
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
		return false;
	}
	await params.onUnauthorized();
	return false;
}
//#endregion
//#region extensions/discord/src/monitor/live-policy-interaction.ts
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
//#endregion
//#region extensions/discord/src/monitor/native-command-reply.ts
const DISCORD_EMPTY_VISIBLE_REPLY_WARNING = "⚠️ Command produced no visible reply.";
function isDiscordUnknownInteraction(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	if (err.discordCode === 10062 || err.rawBody?.code === 10062) return true;
	if (err.status === 404 && /Unknown interaction/i.test(err.message ?? "")) return true;
	if (/Unknown interaction/i.test(err.rawBody?.message ?? "")) return true;
	return false;
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
	const { interaction, textLimit, maxLinesPerMessage, preferFollowUp, chunkMode } = params;
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
	let componentBuild = componentSpec ? buildDiscordComponentMessage({
		spec: componentSpec,
		...params.componentRoute
	}) : void 0;
	const reply = resolveSendableOutboundReplyParts(payload);
	let { components: firstMessageComponents, embeds: firstMessageEmbeds } = resolveDiscordInteractionMessageParts(payload);
	if (componentBuild) firstMessageComponents = componentBuild.components;
	let payloadDelivered = false;
	const sendMessage = async (content, files, components, embeds) => {
		const hasV2 = hasDiscordV2Components(components);
		const payloadLocal = {
			...content && !hasV2 ? { content } : {},
			...components ? { components } : {},
			...embeds && !hasV2 ? { embeds } : {},
			...params.responseEphemeral !== void 0 ? { ephemeral: params.responseEphemeral } : {},
			...files?.length ? { files } : {}
		};
		let result;
		try {
			result = await safeDiscordInteractionCall("interaction send", async () => {
				const sent = !preferFollowUp && !payloadDelivered ? await interaction.reply(payloadLocal) : await interaction.followUp(payloadLocal);
				payloadDelivered = true;
				firstMessageComponents = void 0;
				firstMessageEmbeds = void 0;
				if (componentBuild) {
					const messageId = sent && typeof sent === "object" && "id" in sent && typeof sent.id === "string" ? sent.id : void 0;
					await registerDiscordComponentEntries({
						entries: componentBuild.entries,
						modals: componentBuild.modals,
						messageId
					});
					componentBuild = void 0;
				}
			});
		} catch (error) {
			if (!payloadDelivered) throw error;
			throw createChannelPartialDeliveryError(error, { visibleReplySent: true });
		}
		if (result !== null) return;
		const expiry = new PlatformMessageNotDispatchedError("Discord interaction expired before message dispatch", { cause: /* @__PURE__ */ new Error("Unknown interaction") });
		if (!payloadDelivered) throw expiry;
		throw createChannelPartialDeliveryError(expiry, { visibleReplySent: true });
	};
	if (reply.hasMedia) {
		const media = await Promise.all(reply.mediaUrls.map(async (url) => {
			const loaded = await loadWebMedia(url, { localRoots: params.mediaLocalRoots });
			return {
				name: loaded.fileName ?? "upload",
				data: loaded.buffer,
				contentType: loaded.contentType
			};
		}));
		const chunks = resolveTextChunksWithFallback(reply.text, chunkDiscordTextWithMode(reply.text, {
			maxChars: textLimit,
			maxLines: maxLinesPerMessage,
			chunkMode
		}));
		await sendMessage(chunks[0] ?? "", media, firstMessageComponents, firstMessageEmbeds);
		for (const chunk of chunks.slice(1)) {
			if (!chunk.trim()) continue;
			await sendMessage(chunk);
		}
		return payloadDelivered;
	}
	if (!reply.hasText && !firstMessageComponents && !firstMessageEmbeds) return false;
	const chunks = resolveTextChunksWithFallback(reply.text, chunkDiscordTextWithMode(reply.text, {
		maxChars: textLimit,
		maxLines: maxLinesPerMessage,
		chunkMode
	}));
	if (chunks.length === 0) chunks.push("");
	for (const chunk of chunks) {
		if (!chunk.trim() && !firstMessageComponents && !firstMessageEmbeds) continue;
		await sendMessage(chunk, void 0, firstMessageComponents, firstMessageEmbeds);
	}
	return payloadDelivered;
}
//#endregion
//#region extensions/discord/src/monitor/native-command-route.ts
function resolveDiscordNativeInteractionRouteState(params) {
	const route = resolveDiscordBoundConversationRoute({
		cfg: params.cfg,
		accountId: params.accountId,
		guildId: params.guildId,
		memberRoleIds: params.memberRoleIds,
		isDirectMessage: params.isDirectMessage,
		isGroupDm: params.isGroupDm,
		directUserId: params.directUserId,
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	const configuredRoute = params.threadBinding == null ? resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "discord",
			accountId: params.accountId,
			conversationId: params.conversationId,
			parentConversationId: params.parentConversationId
		}
	}) : null;
	const configuredBinding = configuredRoute?.bindingResolution ?? null;
	const configuredBoundSessionKey = normalizeOptionalString(configuredRoute?.boundSessionKey);
	const boundSessionKey = normalizeOptionalString(params.threadBinding?.targetSessionKey) ?? configuredBoundSessionKey;
	return {
		route,
		effectiveRoute: resolveDiscordEffectiveRoute({
			route,
			boundSessionKey,
			configuredRoute,
			matchedBy: configuredBinding ? "binding.channel" : void 0
		}),
		boundSessionKey,
		configuredRoute,
		configuredBinding
	};
}
//#endregion
//#region extensions/discord/src/monitor/native-command.runtime.ts
const nativeCommandRuntime = {
	dispatchChannelInboundTurn,
	ensureConfiguredBindingRouteReady,
	resolveDirectStatusReplyForSession,
	resolveDiscordNativeInteractionRouteState,
	getSessionEntry
};
//#endregion
//#region extensions/discord/src/monitor/native-command-agent-reply.ts
async function dispatchDiscordNativeAgentReply(params) {
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.discordConfig);
	let didReply = false;
	let finalReplyOutcome;
	let hiddenFinalReply;
	const turnResult = await nativeCommandRuntime.dispatchChannelInboundTurn({
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
					textLimit: resolveTextChunkLimit(params.cfg, "discord", params.accountId, { fallbackLimit: 2e3 }),
					maxLinesPerMessage: resolveDiscordMaxLinesPerMessage({
						cfg: params.cfg,
						discordConfig: params.discordConfig,
						accountId: params.accountId
					}),
					preferFollowUp: params.preferFollowUp || didReply,
					responseEphemeral: params.responseEphemeral,
					chunkMode: resolveChunkMode(params.cfg, "discord", params.accountId)
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
	if (!didReply && shouldSettleWithoutVisibleReply) {
		await settleDiscordInteractionWithoutVisibleReply(params.interaction);
		return dispatchResult;
	}
	if (didReply || turnResult.dispatched && hasVisibleInboundReplyDispatch(turnResult.dispatchResult)) return dispatchResult;
	await safeDiscordInteractionCall("interaction empty fallback", async () => {
		const payload = {
			content: DISCORD_EMPTY_VISIBLE_REPLY_WARNING,
			ephemeral: true
		};
		if (params.preferFollowUp) {
			await params.interaction.followUp(payload);
			return;
		}
		await params.interaction.reply(payload);
	});
	return dispatchResult;
}
//#endregion
//#region extensions/discord/src/monitor/commands.ts
function resolveDiscordSlashCommandConfig(raw) {
	return { ephemeral: raw?.ephemeral !== false };
}
//#endregion
//#region extensions/discord/src/monitor/native-command-arg-ui.ts
const DISCORD_COMMAND_ARG_CUSTOM_ID_KEY = "cmdarg";
function createCommandArgsWithValue(params) {
	return { values: { [params.argName]: params.value } };
}
function buildDiscordCommandArgCustomId(params) {
	return [
		`${DISCORD_COMMAND_ARG_CUSTOM_ID_KEY}:command=${encodeCustomIdComponent(params.command)}`,
		`arg=${encodeCustomIdComponent(params.arg)}`,
		`value=${encodeCustomIdComponent(params.value)}`,
		`user=${encodeCustomIdComponent(params.userId)}`
	].join(";");
}
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
async function handleDiscordCommandArgInteraction(params) {
	const { interaction, data, ctx } = params;
	const clearWithMessage = async (content) => await params.safeInteractionCall("command arg update", () => interaction.update({
		content,
		components: []
	}));
	const parsed = parseDiscordCommandArgData(data);
	if (!parsed) {
		await clearWithMessage("Sorry, that selection is no longer available.");
		return;
	}
	if (interaction.user?.id && interaction.user.id !== parsed.userId) {
		await params.safeInteractionCall("command arg ack", () => interaction.acknowledge());
		return;
	}
	const commandDefinition = findCommandByNativeName(parsed.command, "discord") ?? listChatCommands().find((entry) => entry.key === parsed.command);
	if (!commandDefinition) {
		await clearWithMessage("Sorry, that command is no longer available.");
		return;
	}
	if (await clearWithMessage(`⏳ Applying ${parsed.value}...`) === null) return;
	const commandArgs = createCommandArgsWithValue({
		argName: parsed.arg,
		value: parsed.value
	});
	const commandArgsWithRaw = {
		...commandArgs,
		raw: serializeCommandArgs(commandDefinition, commandArgs)
	};
	const prompt = buildCommandTextFromArgs(commandDefinition, commandArgsWithRaw);
	await params.dispatchCommandInteraction({
		readPolicy: ctx.readPolicy,
		interaction,
		prompt,
		command: commandDefinition,
		commandArgs: commandArgsWithRaw,
		cfg: ctx.cfg,
		discordConfig: ctx.discordConfig,
		accountId: ctx.accountId,
		sessionPrefix: ctx.sessionPrefix,
		preferFollowUp: true,
		threadBindings: ctx.threadBindings,
		responseEphemeral: resolveDiscordSlashCommandConfig(ctx.discordConfig?.slashCommand).ephemeral,
		buildContext: ctx.buildContext,
		dispatchReplyFromConfig: ctx.dispatchReplyFromConfig,
		pluginCommandDispatch: { kind: "non-plugin" }
	});
}
async function runDiscordCommandArgButton(params) {
	await handleDiscordCommandArgInteraction(params);
}
var DiscordCommandArgButton = class extends Button {
	constructor(params) {
		super();
		this.style = ButtonStyle.Secondary;
		this.label = params.label;
		this.customId = params.customId;
		this.params = params;
	}
	async run(interaction, data) {
		await runDiscordCommandArgButton({
			...this.params,
			interaction,
			data
		});
	}
};
function buildDiscordCommandArgMenu(params) {
	const { command, menu, interaction } = params;
	const commandLabel = command.nativeName ?? command.key;
	const userId = interaction.user?.id ?? "";
	const rows = chunkItems(menu.choices, 4).map((choices) => {
		const buttons = choices.map((choice) => new DiscordCommandArgButton({
			label: choice.label,
			customId: buildDiscordCommandArgCustomId({
				command: commandLabel,
				arg: menu.arg.name,
				value: choice.value,
				userId
			}),
			ctx: params.ctx,
			safeInteractionCall: params.safeInteractionCall,
			dispatchCommandInteraction: params.dispatchCommandInteraction
		}));
		return new Row(buttons);
	});
	return {
		content: formatCommandArgMenuTitle({
			command,
			menu
		}),
		components: rows
	};
}
var DiscordCommandArgFallbackButton = class extends Button {
	constructor(params) {
		super();
		this.params = params;
		this.label = "cmdarg";
		this.customId = "cmdarg:seed=1";
	}
	async run(interaction, data) {
		await runDiscordCommandArgButton({
			...this.params,
			interaction,
			data
		});
	}
};
function createDiscordCommandArgFallbackButton$1(params) {
	return new DiscordCommandArgFallbackButton(params);
}
//#endregion
//#region extensions/discord/src/monitor/inbound-context.ts
function createDiscordSupplementalContextAccessChecker(params) {
	const userAllowList = params.channelConfig?.users ?? params.guildInfo?.users ?? [];
	const roleAllowList = params.channelConfig?.roles ?? params.guildInfo?.roles ?? [];
	const allowFrom = [...userAllowList, ...roleAllowList];
	return (sender) => {
		return resolveInboundSupplementalSenderAllowed({
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
	};
}
function buildDiscordGroupSystemPrompt(channelConfig) {
	return channelConfig?.systemPrompt?.trim() || void 0;
}
function buildDiscordChannelStructuredContext(params) {
	if (!params.isGuild) return;
	const entries = [];
	if (typeof params.channelTopic === "string" && params.channelTopic.trim().length > 0) entries.push({
		label: "Discord channel metadata",
		source: "discord",
		type: "channel_metadata",
		payload: { topic: params.channelTopic.trim() }
	});
	return entries.length > 0 ? entries : void 0;
}
function buildDiscordInboundAccessContext(params) {
	return {
		groupSystemPrompt: params.isGuild ? buildDiscordGroupSystemPrompt(params.channelConfig) : void 0,
		channelStructuredContext: buildDiscordChannelStructuredContext({
			isGuild: params.isGuild,
			channelTopic: params.channelTopic
		}),
		ownerAllowFrom: resolveDiscordOwnerAllowFrom({
			channelConfig: params.channelConfig,
			guildInfo: params.guildInfo,
			sender: params.sender,
			allowNameMatching: params.allowNameMatching
		})
	};
}
//#endregion
//#region extensions/discord/src/monitor/native-command-context.ts
async function buildDiscordNativeCommandContext(params) {
	const conversationLabel = params.isDirectMessage ? params.user.globalName ?? params.user.username : params.channelId;
	const { groupSystemPrompt, ownerAllowFrom, channelStructuredContext } = buildDiscordInboundAccessContext({
		channelConfig: params.channelConfig,
		guildInfo: params.guildInfo,
		sender: params.sender,
		allowNameMatching: params.allowNameMatching,
		isGuild: params.isGuild,
		channelTopic: params.channelTopic
	});
	const conversation = {
		kind: params.isDirectMessage ? "direct" : params.isGroupDm ? "group" : "channel",
		id: params.channelId,
		parentId: params.isThreadChannel ? params.threadParentId : void 0,
		threadId: params.isThreadChannel ? params.channelId : void 0
	};
	const allowFrom = params.commandAuthorized ? [`user:${params.user.id}`] : [];
	const channelIngress = await getDiscordRuntime().channel.inbound.ingress.createResolver({
		channelId: "discord",
		accountId: params.accountId,
		identity: discordIngressIdentity,
		useDefaultPairingStore: false
	}).command({
		subject: {
			stableId: params.user.id,
			aliases: { participantKind: "user" }
		},
		conversation,
		contextBinding: {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			nativeChannelId: params.channelId,
			messageId: params.interactionId,
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
	return await (params.buildContext ?? buildChannelInboundEventContext)({
		channel: "discord",
		channelIngress,
		accountId: params.accountId,
		messageId: params.interactionId,
		timestamp: params.timestampMs ?? Date.now(),
		from: params.isDirectMessage ? `discord:${params.user.id}` : params.isGroupDm ? `discord:group:${params.channelId}` : `discord:channel:${params.channelId}`,
		sender: {
			id: params.user.id,
			name: params.user.globalName ?? params.user.username,
			username: params.user.username,
			tag: params.sender.tag,
			roles: params.memberRoleIds
		},
		conversation: {
			...conversation,
			nativeChannelId: params.channelId,
			routePeer: buildDiscordRoutePeer({
				isDirectMessage: params.isDirectMessage,
				isGroupDm: params.isGroupDm,
				directUserId: params.user.id,
				conversationId: params.channelId
			}),
			label: conversationLabel,
			spaceId: params.isGuild ? params.guildInfo?.id ?? params.guildInfo?.slug ?? params.guildId : void 0
		},
		route: {
			agentId: params.agentId,
			accountId: params.accountId,
			routeSessionKey: params.commandTargetSessionKey,
			dispatchSessionKey: params.sessionKey
		},
		reply: {
			to: `slash:${params.user.id}`,
			originatingTo: resolveDiscordConversationIdentity({
				isDirectMessage: params.isDirectMessage,
				userId: params.user.id,
				channelId: params.channelId
			}) ?? (params.isDirectMessage ? `user:${params.user.id}` : `channel:${params.channelId}`)
		},
		message: { rawBody: params.prompt },
		access: {
			mentions: {
				canDetectMention: true,
				wasMentioned: true
			},
			commands: { authorized: params.commandAuthorized }
		},
		commandTurn: {
			kind: "native",
			source: "native",
			authorized: params.commandAuthorized,
			body: params.prompt
		},
		supplemental: { groupSystemPrompt },
		extra: {
			CommandArgs: params.commandArgs,
			CommandTargetSessionKey: params.commandTargetSessionKey,
			CommandSource: "native",
			GroupSubject: params.isGuild ? params.guildName : void 0,
			ChannelStructuredContext: channelStructuredContext,
			OwnerAllowFrom: ownerAllowFrom
		}
	});
}
async function buildDiscordNativeInteractionContext(params) {
	const { interaction, route, boundSessionKey, sessionPrefix, channelContext, ...context } = params;
	const targets = resolveNativeCommandSessionTargets({
		agentId: route.agentId,
		sessionPrefix,
		userId: context.user.id,
		targetSessionKey: route.sessionKey,
		boundSessionKey
	});
	return {
		ctxPayload: await buildDiscordNativeCommandContext({
			...context,
			...targets,
			agentId: route.agentId,
			accountId: route.accountId,
			interactionId: interaction.rawData.id,
			channelId: channelContext.rawChannelId || "unknown",
			threadParentId: channelContext.threadParentId,
			memberRoleIds: Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles : [],
			guildId: interaction.guild?.id,
			guildName: interaction.guild?.name,
			channelTopic: resolveDiscordChannelTopicSafe(interaction.channel),
			isGuild: Boolean(interaction.guild),
			isDirectMessage: channelContext.isDirectMessage,
			isGroupDm: channelContext.isGroupDm,
			isThreadChannel: channelContext.isThreadChannel
		}),
		...targets
	};
}
//#endregion
//#region extensions/discord/src/monitor/native-interaction-channel-context.ts
async function resolveDiscordNativeInteractionChannelContext(params) {
	const channelContext = await resolveDiscordThreadLikeChannelContext({
		client: params.client,
		channel: params.channel,
		channelIdFallback: params.channelIdFallback
	});
	const channelType = channelContext.channelType;
	return {
		channelType,
		isDirectMessage: channelType === discord_exports.ChannelType.DM,
		isGroupDm: channelType === discord_exports.ChannelType.GroupDM,
		isThreadChannel: channelContext.isThreadChannel,
		channelName: channelContext.channelName,
		channelSlug: channelContext.channelSlug,
		rawChannelId: channelContext.channelId,
		threadParentId: params.hasGuild ? channelContext.threadParentId : void 0,
		threadParentName: params.hasGuild ? channelContext.threadParentName : void 0,
		threadParentSlug: params.hasGuild ? channelContext.threadParentSlug : ""
	};
}
//#endregion
//#region extensions/discord/src/monitor/native-command-auth.ts
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
function createDiscordNativeCommandAuthority(params) {
	const assertAdmittedOwner = resolveCommandAuthorization(params).assertOwnerCurrent;
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
			accountId: params.accountId,
			sender: params.sender,
			chatType: params.ctx.ChatType === "direct" ? "direct" : "channel",
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
function resolveDiscordNativeCommandChannelAccessContext(params) {
	const guild = params.guild ?? null;
	const commandsAllowFromAccess = resolveDiscordNativeCommandAllowlistAccess({
		cfg: params.cfg,
		accountId: params.accountId,
		sender: params.sender,
		chatType: params.isDirectMessage ? "direct" : params.isThreadChannel ? "thread" : guild ? "channel" : "group",
		conversationId: params.rawChannelId || void 0,
		guildId: guild?.id
	});
	const guildInfo = resolveDiscordGuildEntry({
		guild: guild ?? void 0,
		guildId: guild?.id ?? void 0,
		guildEntries: params.discordConfig?.guilds
	});
	return {
		commandsAllowFromAccess,
		guildInfo,
		channelConfig: guild ? resolveDiscordChannelConfigWithFallback({
			guildInfo,
			channelId: params.rawChannelId,
			channelName: params.channelName,
			channelSlug: params.channelSlug,
			parentId: params.threadParentId,
			parentName: params.threadParentName,
			parentSlug: params.threadParentSlug,
			scope: params.isThreadChannel ? "thread" : "channel"
		}) : null
	};
}
async function resolveDiscordGuildNativeCommandAuthorized(params) {
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.discord !== void 0,
		groupPolicy: params.discordConfig?.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	const policyAuthorizer = resolveDiscordChannelPolicyCommandAuthorizer({
		groupPolicy,
		guildInfo: params.guildInfo,
		channelConfig: params.channelConfig
	});
	if (!policyAuthorizer.allowed) return false;
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig: params.channelConfig,
		guildInfo: params.guildInfo,
		memberRoleIds: params.memberRoleIds,
		sender: params.sender,
		allowNameMatching: params.allowNameMatching
	});
	const commandAllowlistAuthorizer = {
		configured: params.commandsAllowFromAccess.configured,
		allowed: params.commandsAllowFromAccess.allowed
	};
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
	const authorizers = params.commandsAllowFromAccess.configured ? [commandAllowlistAuthorizer] : fallbackAuthorizers;
	return resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups: params.useAccessGroups,
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
	const channelContext = await resolveDiscordNativeInteractionChannelContext({
		channel: interaction.channel,
		client: interaction.client,
		hasGuild: Boolean(interaction.guild),
		channelIdFallback: interaction.rawData.channel_id ?? ""
	});
	const { isDirectMessage, isGroupDm, isThreadChannel, channelName, channelSlug, rawChannelId, threadParentId, threadParentName, threadParentSlug } = channelContext;
	if (params.isPolicyCurrent?.() === false) return false;
	const memberRoleIds = Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.map((roleId) => roleId) : [];
	const allowNameMatching = isDangerousNameMatchingEnabled(discordConfig);
	const useAccessGroups = true;
	const configuredDmAllowFrom = resolveDiscordAccountAllowFrom({
		cfg,
		accountId
	}) ?? [];
	const { ownerAllowList, ownerAllowed: ownerOk } = resolveDiscordOwnerAccess({
		allowFrom: configuredDmAllowFrom,
		sender: {
			id: sender.id,
			name: sender.name,
			tag: sender.tag
		},
		allowNameMatching
	});
	const { commandsAllowFromAccess, guildInfo, channelConfig } = resolveDiscordNativeCommandChannelAccessContext({
		cfg,
		discordConfig,
		accountId,
		sender,
		isDirectMessage,
		isThreadChannel,
		guild: interaction.guild ?? null,
		rawChannelId,
		channelName,
		channelSlug,
		threadParentId,
		threadParentName,
		threadParentSlug
	});
	if (channelConfig?.enabled === false) return false;
	if (interaction.guild && channelConfig?.allowed === false) return false;
	if (interaction.guild) {
		const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
			providerConfigPresent: cfg.channels?.discord !== void 0,
			groupPolicy: discordConfig?.groupPolicy,
			defaultGroupPolicy: cfg.channels?.defaults?.groupPolicy
		});
		if (!resolveDiscordChannelPolicyCommandAuthorizer({
			groupPolicy,
			guildInfo,
			channelConfig
		}).allowed) return false;
	}
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
			configuredAllowFrom: configuredDmAllowFrom,
			sender: {
				id: sender.id,
				name: sender.name,
				tag: sender.tag
			},
			allowNameMatching,
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
			cfg,
			accountId,
			discordConfig,
			useAccessGroups,
			commandsAllowFromAccess,
			guildInfo,
			channelConfig,
			memberRoleIds,
			sender,
			allowNameMatching,
			ownerAllowListConfigured: ownerAllowList != null,
			ownerAllowed: ownerOk
		})) return false;
	}
	const commandOwnerAllowFrom = resolveDiscordCommandOwnerAllowFrom(cfg);
	if (params.skipCommandOwnerAllowFrom !== true && commandOwnerAllowFrom && !commandOwnerAllowFrom.includes("*") && !commandsAllowFromAccess.allowed && !resolveDiscordOwnerAccess({
		allowFrom: commandOwnerAllowFrom,
		sender,
		allowNameMatching
	}).ownerAllowed) {
		const routeState = resolveDiscordNativeInteractionRouteState({
			cfg,
			accountId,
			guildId: interaction.guild?.id,
			memberRoleIds,
			isDirectMessage,
			isGroupDm,
			directUserId: user.id,
			conversationId: rawChannelId,
			parentConversationId: threadParentId,
			threadBinding: isThreadChannel ? params.threadBindings?.getByThreadId(rawChannelId) : void 0
		});
		const { ctxPayload } = await buildDiscordNativeInteractionContext({
			buildContext: params.buildContext,
			interaction,
			channelContext,
			route: routeState.effectiveRoute,
			boundSessionKey: routeState.boundSessionKey,
			sessionPrefix: params.sessionPrefix ?? "discord:slash",
			channelConfig,
			guildInfo,
			allowNameMatching,
			commandAuthorized: true,
			user,
			sender,
			prompt: "",
			commandArgs: {}
		});
		if (!resolveCommandAuthorization({
			ctx: ctxPayload,
			cfg,
			commandAuthorized: true
		}).senderIsOwner) return false;
	}
	return params.isPolicyCurrent?.() !== false;
}
//#endregion
//#region extensions/discord/src/monitor/native-command-bypass.ts
function shouldBypassConfiguredAcpEnsure(commandName) {
	const command = commandName.trim().toLowerCase();
	return command === "acp" || command === "status";
}
function shouldBypassConfiguredAcpGuildGuards(commandName) {
	const command = commandName.trim().toLowerCase();
	return command === "new" || command === "reset";
}
//#endregion
//#region extensions/discord/src/monitor/model-picker-preferences.ts
const DEFAULT_RECENT_LIMIT = 5;
const PREFERENCE_MAX_ENTRIES = 2e3;
let lastPreferenceTimestampMs = 0;
let lastPreferenceOrder = 0;
function openPreferenceStore(env) {
	return getDiscordRuntime().state.openKeyedStore({
		namespace: "model-picker-preferences",
		maxEntries: PREFERENCE_MAX_ENTRIES,
		...env ? { env } : {}
	});
}
function normalizeId(value) {
	return normalizeOptionalString(value) ?? "";
}
function buildDiscordModelPickerPreferenceKey(scope) {
	const userId = normalizeId(scope.userId);
	if (!userId) return null;
	const accountId = normalizeAccountId(scope.accountId);
	const guildId = normalizeId(scope.guildId);
	if (guildId) return `discord:${accountId}:guild:${guildId}:user:${userId}`;
	return `discord:${accountId}:dm:user:${userId}`;
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
function comparePreferenceEntries(left, right) {
	return preferenceTimestampMs(right.value.updatedAt) - preferenceTimestampMs(left.value.updatedAt) || timestampOrder(right.value.updatedOrder) - timestampOrder(left.value.updatedOrder) || left.key.localeCompare(right.key);
}
function nextPreferenceTimestamp(existingEntries) {
	const existingMaxTimestampMs = existingEntries.reduce((max, entry) => Math.max(max, preferenceTimestampMs(entry.updatedAt)), 0);
	lastPreferenceTimestampMs = Math.min(Math.max(resolveDateTimestampMs(Date.now(), 0), lastPreferenceTimestampMs + 1, existingMaxTimestampMs + 1), MAX_DATE_TIMESTAMP_MS);
	const existingMaxOrder = existingEntries.reduce((max, entry) => Math.max(max, timestampOrder(entry.updatedOrder)), 0);
	lastPreferenceOrder = Math.max(lastPreferenceOrder + 1, existingMaxOrder + 1);
	return {
		updatedAt: resolveTimestampMsToIsoString(lastPreferenceTimestampMs),
		updatedOrder: lastPreferenceOrder
	};
}
async function readDiscordModelPickerRecentModels(params) {
	const key = buildDiscordModelPickerPreferenceKey(params.scope);
	if (!key) return [];
	const limit = Math.max(1, Math.min(params.limit ?? DEFAULT_RECENT_LIMIT, 10));
	try {
		const recent = (await openPreferenceStore(params.env).entries()).map((entry) => ({
			key: entry.key,
			value: sanitizeStoredPreferenceEntry(entry.value)
		})).filter((entry) => entry.value?.scopeKey === key).toSorted(comparePreferenceEntries).map((entry) => entry.value.modelRef);
		if (!params.allowedModelRefs || params.allowedModelRefs.size === 0) return sanitizeRecentModels(recent, limit);
		return sanitizeRecentModels(recent.filter((modelRef) => params.allowedModelRefs?.has(modelRef)), limit);
	} catch {
		return [];
	}
}
async function recordDiscordModelPickerRecentModel(params) {
	const key = buildDiscordModelPickerPreferenceKey(params.scope);
	const normalizedModelRef = normalizeModelRef(params.modelRef);
	if (!key || !normalizedModelRef) return;
	try {
		const store = openPreferenceStore(params.env);
		const timestamp = nextPreferenceTimestamp((await store.entries()).map((entry) => sanitizeStoredPreferenceEntry(entry.value)).filter((entry) => entry?.scopeKey === key));
		await store.register(buildPreferenceModelKey(key, normalizedModelRef), {
			scopeKey: key,
			modelRef: normalizedModelRef,
			...timestamp
		});
		const limit = Math.max(1, Math.min(params.limit ?? DEFAULT_RECENT_LIMIT, 10));
		const scopedEntries = (await store.entries()).map((entry) => ({
			key: entry.key,
			value: sanitizeStoredPreferenceEntry(entry.value)
		})).filter((entry) => entry.value?.scopeKey === key).toSorted(comparePreferenceEntries);
		await Promise.all(scopedEntries.slice(limit).map((entry) => store.delete(entry.key)));
	} catch {}
}
//#endregion
//#region extensions/discord/src/monitor/model-picker.runtime.ts
const hostSdk = modelsProviderRuntime;
const MODEL_PICKER_CHANGED_MESSAGE = hostSdk.MODEL_PICKER_CHANGED_MESSAGE ?? "Available models changed. Open /models and choose again.";
function supportsDiscordModelPickerRuntimeChoices() {
	return hostSdk.getModelsRuntimeChoices !== void 0;
}
function getDiscordModelPickerRuntimeChoices(...args) {
	return hostSdk.getModelsRuntimeChoices?.(...args);
}
//#endregion
//#region extensions/discord/src/monitor/model-picker.state.ts
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
/**
* Alpha buckets engage only when the sorted item list exceeds the single-page
* select cap. Below this threshold the user gets the existing flat list +
* prev/next behavior unchanged.
*/
const DISCORD_MODEL_PICKER_BUCKET_THRESHOLD = DISCORD_COMPONENT_MAX_SELECT_OPTIONS;
/** Target items per alpha bucket. Discord caps selects at 25 options. */
const DISCORD_MODEL_PICKER_BUCKET_TARGET_SIZE = 20;
const DISCORD_MODEL_PICKER_TOKEN_PATTERN = /^[A-Za-z0-9_-]{8}$/u;
function createDiscordModelPickerModelToken(provider, model) {
	return createHash("sha256").update(JSON.stringify([normalizeProviderId(provider), model]), "utf8").digest("base64url").slice(0, 8);
}
function createDiscordModelPickerRuntimeToken(runtime) {
	return createHash("sha256").update(runtime, "utf8").digest("base64url").slice(0, 8);
}
const loadModelsProviderRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/models-provider-runtime"));
function isValidCommandContext(value) {
	return COMMAND_CONTEXTS.includes(value);
}
function isValidPickerAction(value) {
	return PICKER_ACTIONS.includes(value);
}
function isValidPickerView(value) {
	return PICKER_VIEWS.includes(value);
}
function normalizeModelPickerPage(value) {
	const numeric = typeof value === "number" ? value : NaN;
	if (!Number.isFinite(numeric)) return 1;
	return Math.max(1, Math.floor(numeric));
}
function parseRawPage(value) {
	if (typeof value === "number") return normalizeModelPickerPage(value);
	if (typeof value === "string") {
		const parsed = parseStrictInteger(value);
		if (parsed !== void 0) return normalizeModelPickerPage(parsed);
	}
	return 1;
}
function coerceString(value) {
	return typeof value === "string" || typeof value === "number" ? String(value) : "";
}
function clampPageSize(rawPageSize) {
	if (!Number.isFinite(rawPageSize)) return DISCORD_COMPONENT_MAX_SELECT_OPTIONS;
	return Math.min(DISCORD_COMPONENT_MAX_SELECT_OPTIONS, Math.max(1, Math.floor(rawPageSize ?? DISCORD_COMPONENT_MAX_SELECT_OPTIONS)));
}
function normalizeOptionalModelPickerIndex(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : void 0;
}
function paginateItems(params) {
	const totalItems = params.items.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize));
	const page = Math.max(1, Math.min(params.page, totalPages));
	const startIndex = (page - 1) * params.pageSize;
	const endIndexExclusive = Math.min(totalItems, startIndex + params.pageSize);
	return {
		items: params.items.slice(startIndex, endIndexExclusive),
		page,
		pageSize: params.pageSize,
		totalPages,
		totalItems,
		hasPrev: page > 1,
		hasNext: page < totalPages
	};
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
	const normalizedProvider = params.provider ? normalizeProviderId(params.provider) : void 0;
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
	if (normalizedProvider) parts.push(`p=${encodeCustomIdComponent(normalizedProvider)}`);
	const runtime = params.runtime?.trim();
	if (runtime) parts.push(`r=${encodeCustomIdComponent(runtime)}`);
	const runtimeToken = params.runtimeToken?.trim();
	if (runtimeToken && !DISCORD_MODEL_PICKER_TOKEN_PATTERN.test(runtimeToken)) throw new Error("Discord model picker runtime token is invalid");
	if (runtimeToken) parts.push(`rt=${runtimeToken}`);
	const runtimeIndex = normalizeOptionalModelPickerIndex(params.runtimeIndex);
	if (runtimeIndex) parts.push(`ri=${String(runtimeIndex)}`);
	if (providerPage) parts.push(`pp=${String(providerPage)}`);
	if (modelToken) parts.push(`m=${modelToken}`);
	else {
		if (modelIndex) parts.push(`mi=${String(modelIndex)}`);
		if (recentSlot) parts.push(`rs=${String(recentSlot)}`);
	}
	const providerBucket = params.providerBucket?.trim().toLowerCase();
	if (providerBucket) parts.push(`pb=${encodeCustomIdComponent(providerBucket)}`);
	const modelBucket = params.modelBucket?.trim().toLowerCase();
	if (modelBucket) parts.push(`mb=${encodeCustomIdComponent(modelBucket)}`);
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
	if (!isValidCommandContext(command) || !isValidPickerAction(action) || !isValidPickerView(view)) return null;
	const trimmedUserId = userId.trim();
	if (!trimmedUserId) return null;
	return {
		command,
		action,
		view,
		userId: trimmedUserId,
		provider: providerRaw ? normalizeProviderId(providerRaw) : void 0,
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
/**
* Split a sorted item list into letter-range buckets when its length exceeds
* {@link DISCORD_MODEL_PICKER_BUCKET_THRESHOLD}. Items below the threshold
* return a single "All" bucket so callers can render the same code path.
*
* The boundary extender keeps items sharing the same starting letter inside
* the same bucket — selecting "A–G" never strands a stray "g" item in the
* next bucket. If every item shares a first letter (e.g. all `qwen3-*`),
* the function falls back to count-based numeric chunks so the user still
* gets a finite-cardinality picker.
*/
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
	if (sortedItems.every((item) => firstLetter(item) === firstLetter(firstItem))) return chunkBucketsByCount(sortedItems);
	const buckets = [];
	const target = computeBucketTargetSize(sortedItems.length);
	let start = 0;
	while (start < sortedItems.length) {
		let end = Math.min(sortedItems.length, start + target);
		if (end < sortedItems.length) {
			const last = firstLetter(expectDefined(sortedItems[end - 1], "bucket end predecessor"));
			while (end < sortedItems.length && firstLetter(expectDefined(sortedItems[end], "bucket extension index")) === last) end += 1;
		}
		const startLetter = firstLetter(expectDefined(sortedItems[start], "bucket start index"));
		const endLetter = firstLetter(expectDefined(sortedItems[end - 1], "bucket end predecessor"));
		const id = startLetter === endLetter ? startLetter : `${startLetter}-${endLetter}`;
		const label = startLetter === endLetter ? `${startLetter.toUpperCase()} (${end - start})` : `${startLetter.toUpperCase()}–${endLetter.toUpperCase()} (${end - start})`;
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
/**
* Pick the per-bucket target size such that the resulting bucket count never
* exceeds {@link DISCORD_COMPONENT_MAX_SELECT_OPTIONS} (Discord's hard select
* cap). Stays at the default {@link DISCORD_MODEL_PICKER_BUCKET_TARGET_SIZE}
* for typical inputs and grows linearly for very large lists.
*/
function computeBucketTargetSize(totalItems) {
	const minTarget = DISCORD_MODEL_PICKER_BUCKET_TARGET_SIZE;
	const capByBucketCount = Math.ceil(totalItems / DISCORD_COMPONENT_MAX_SELECT_OPTIONS);
	return Math.max(minTarget, capByBucketCount);
}
function chunkBucketsByCount(sortedItems) {
	const buckets = [];
	const target = computeBucketTargetSize(sortedItems.length);
	for (let start = 0; start < sortedItems.length; start += target) {
		const end = Math.min(sortedItems.length, start + target);
		buckets.push({
			id: `${start + 1}-${end}`,
			label: `${start + 1}–${end} (${end - start})`,
			start,
			end
		});
	}
	return buckets;
}
/**
* Resolve a bucket from a list given a (possibly user-supplied) bucket id.
* Falls back to the first bucket when the id does not match — mirrors the
* "bad customId → reset to defaults" semantics already used for other
* state fields.
*/
function resolveBucket(buckets, id) {
	if (buckets.length === 0) return null;
	if (!id) return expectDefined(buckets.at(0), "non-empty model picker buckets");
	return buckets.find((bucket) => bucket.id === id) ?? expectDefined(buckets.at(0), "non-empty model picker buckets");
}
/**
* Derive the alpha-bucket id that contains a given provider id. Returns
* `undefined` when bucketing is inactive (all providers fit in one bucket)
* or the provider is unknown. Used by the interaction handler to recompute
* `providerBucket` at re-render time without forcing every customId to
* carry the bucket field — the bucket is a pure function of the provider
* list + provider id.
*/
function findProviderBucketId(data, provider) {
	return findProviderBucketLocation(data, provider)?.bucket;
}
function findProviderBucketLocation(data, provider) {
	return findModelPickerBucketLocation([...data.providers].toSorted(), normalizeProviderId(provider));
}
/**
* Derive the alpha-bucket id that contains a given model id within the
* named provider. Same rationale as {@link findProviderBucketId} — saves
* customId budget by recomputing the bucket from the durable state
* (provider + model) rather than carrying it as a parameter.
*/
function findModelBucketId(data, provider, model) {
	const modelSet = data.byProvider.get(normalizeProviderId(provider));
	return modelSet ? findModelPickerBucketLocation([...modelSet].toSorted(compareBucketItems), model)?.bucket : void 0;
}
function findModelPickerBucketLocation(sortedItems, item, pageSize = DISCORD_COMPONENT_MAX_SELECT_OPTIONS) {
	const index = sortedItems.indexOf(item);
	const bucket = index < 0 ? void 0 : computeAlphaBuckets(sortedItems).find((entry) => index >= entry.start && index < entry.end);
	return bucket ? {
		...bucket.id === "all" ? {} : { bucket: bucket.id },
		page: Math.floor((index - bucket.start) / pageSize) + 1
	} : void 0;
}
function paginateDiscordModelPickerBucket(params) {
	const buckets = computeAlphaBuckets(params.itemLabels);
	const bucket = resolveBucket(buckets, params.bucket);
	const items = bucket ? params.items.slice(bucket.start, bucket.end) : params.items;
	const pageSize = clampPageSize(params.pageSize);
	return {
		...paginateItems({
			items,
			page: normalizeModelPickerPage(params.page),
			pageSize
		}),
		bucket,
		buckets
	};
}
function getDiscordModelPickerProviderPage(params) {
	const providers = [...params.data.providers].toSorted();
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
	const provider = normalizeProviderId(params.provider);
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
	const provider = normalizeProviderId(params.provider);
	const modelSet = params.data.byProvider.get(provider);
	if (!modelSet) return { page: 1 };
	const sorted = [...modelSet].toSorted(compareBucketItems);
	const pageSize = clampPageSize(params.pageSize);
	return findModelPickerBucketLocation(sorted, params.model, pageSize) ?? { page: 1 };
}
//#endregion
//#region extensions/discord/src/monitor/model-picker.view.ts
const DISCORD_MODEL_PICKER_PAGE_INDICATOR_CUSTOM_ID = "mdlpk:nav-indicator";
function parseCurrentModelRef(raw) {
	const match = (raw?.trim())?.match(/^([^/]+)\/(.+)$/u);
	if (!match) return null;
	const providerText = match[1];
	const model = match[2];
	if (providerText === void 0 || model === void 0) return null;
	const provider = normalizeProviderId(providerText);
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
function createModelPickerButton(params) {
	class DiscordModelPickerButton extends Button {
		constructor(..._args) {
			super(..._args);
			this.label = params.label;
			this.customId = params.customId;
			this.style = params.style ?? ButtonStyle.Secondary;
			this.disabled = params.disabled ?? false;
		}
	}
	return new DiscordModelPickerButton();
}
function createModelSelect(params) {
	class DiscordModelPickerSelect extends StringSelectMenu {
		constructor(..._args2) {
			super(..._args2);
			this.customId = params.customId;
			this.options = params.options;
			this.minValues = 1;
			this.maxValues = 1;
			this.placeholder = params.placeholder;
			this.disabled = params.disabled ?? false;
		}
	}
	return new DiscordModelPickerSelect();
}
/**
* Build the alpha-bucket select row that appears above the provider/model
* surface when the list exceeds {@link DISCORD_MODEL_PICKER_BUCKET_THRESHOLD}.
*
* Selecting a bucket emits action=bucket. The chosen bucket travels in the
* select value, while the custom_id carries only the stable context needed to
* rebuild the picker under Discord's 100-character custom_id limit.
*/
function buildBucketSelectRow(params) {
	if (params.buckets.length <= 1) return null;
	const options = params.buckets.map((bucket) => ({
		label: bucket.label,
		value: bucket.id,
		default: bucket.id === params.currentBucketId
	}));
	const select = createModelSelect({
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "bucket",
			view: params.view,
			userId: params.userId,
			page: 1,
			provider: params.provider,
			runtime: params.runtime,
			runtimeToken: params.runtimeToken,
			providerPage: params.providerPage,
			modelIndex: params.modelIndex
		}),
		options,
		placeholder: params.view === "providers" ? "Filter providers by letter range" : "Filter models by letter range"
	});
	return new Row([select]);
}
function getRuntimeChoices(params) {
	const model = parseCurrentModelRef(params.modelRef);
	return getDiscordModelPickerRuntimeChoices(params.data, params.provider, model?.provider === normalizeProviderId(params.provider) ? model.model : void 0);
}
function resolveExplicitRuntimeState(params) {
	const runtime = params.pendingRuntime?.trim() || params.currentRuntime?.trim();
	return runtime && runtime !== "auto" && runtime !== "default" ? runtime : void 0;
}
function resolveSelectedRuntime(params) {
	const choices = getRuntimeChoices(params);
	const explicit = resolveExplicitRuntimeState(params);
	return explicit ? choices?.find((choice) => choice.id === explicit)?.id : choices?.[0]?.id;
}
function getActiveBucketId(bucket) {
	return bucket && bucket.id !== "all" ? bucket.id : void 0;
}
function resolveCompactRuntimeState(params) {
	if (!supportsDiscordModelPickerRuntimeChoices()) return {};
	const runtime = resolveExplicitRuntimeState(params);
	return runtime ? { runtimeToken: createDiscordModelPickerRuntimeToken(runtime) } : {};
}
function buildRenderedShell(params) {
	const containerComponents = [new TextDisplay(`## ${params.title}`)];
	if (params.refreshWarning) containerComponents.push(new TextDisplay(params.refreshWarning));
	if (params.detailLines.length > 0) containerComponents.push(new TextDisplay(params.detailLines.join("\n")));
	containerComponents.push(new Separator({
		divider: true,
		spacing: "small"
	}));
	if (params.preRowText) containerComponents.push(new TextDisplay(params.preRowText));
	containerComponents.push(...params.rows);
	if (params.trailingRows && params.trailingRows.length > 0) {
		containerComponents.push(new Separator({
			divider: true,
			spacing: "small"
		}));
		containerComponents.push(...params.trailingRows);
	}
	if (params.footer) {
		containerComponents.push(new Separator({
			divider: false,
			spacing: "small"
		}));
		containerComponents.push(new TextDisplay(`-# ${params.footer}`));
	}
	return { components: [new Container(containerComponents)] };
}
function buildProviderSelectRow(params) {
	if (params.page.items.length === 0) return null;
	const options = params.page.items.map((provider) => ({
		label: provider.id,
		value: provider.id,
		default: provider.id === params.currentProvider,
		description: `${provider.count} ${provider.count === 1 ? "model" : "models"}`
	}));
	return new Row([createModelSelect({
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "provider",
			view: "models",
			page: params.page.page,
			providerPage: params.page.page,
			providerBucket: params.providerBucket,
			userId: params.userId
		}),
		options,
		placeholder: "Select provider"
	})]);
}
function buildPaginationRow(params) {
	if (params.totalPages <= 1) return null;
	const { page, totalPages, hasPrev, hasNext, ...navigationState } = params;
	const createNavigationButton = (label, targetPage, enabled) => createModelPickerButton({
		label,
		disabled: !enabled,
		customId: buildDiscordModelPickerCustomId({
			...navigationState,
			action: "nav",
			page: targetPage
		})
	});
	const indicatorButton = createModelPickerButton({
		label: `Page ${page}/${totalPages}`,
		disabled: true,
		customId: DISCORD_MODEL_PICKER_PAGE_INDICATOR_CUSTOM_ID
	});
	return new Row([
		createNavigationButton("◀ Prev", Math.max(1, page - 1), hasPrev),
		indicatorButton,
		createNavigationButton("Next ▶", Math.min(totalPages, page + 1), hasNext)
	]);
}
function buildModelRows(params) {
	const parsedCurrentModel = parseCurrentModelRef(params.currentModel);
	const parsedPendingModel = parseCurrentModelRef(params.pendingModel);
	const pendingModelToken = parsedPendingModel ? createDiscordModelPickerModelToken(parsedPendingModel.provider, parsedPendingModel.model) : void 0;
	const rows = [];
	const hasQuickModels = (params.quickModels ?? []).length > 0;
	const providerPage = getDiscordModelPickerProviderPage({
		data: params.data,
		page: params.providerPage,
		bucket: params.providerBucket
	});
	const providerOptions = providerPage.items.map((provider) => ({
		label: provider.id,
		value: provider.id,
		default: provider.id === params.modelPage.provider
	}));
	const activeProviderBucket = getActiveBucketId(providerPage.bucket);
	const activeModelBucket = getActiveBucketId(params.modelPage.bucket);
	if (!((params.modelPage.buckets?.length ?? 0) > 1)) rows.push(new Row([createModelSelect({
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "provider",
			view: "models",
			provider: params.modelPage.provider,
			page: providerPage.page,
			providerPage: providerPage.page,
			providerBucket: activeProviderBucket,
			userId: params.userId
		}),
		options: providerOptions,
		placeholder: "Select provider"
	})]));
	const runtimeChoices = getRuntimeChoices({
		data: params.data,
		provider: params.modelPage.provider,
		modelRef: params.pendingModel ?? params.currentModel
	});
	const currentRuntime = parsedCurrentModel?.provider === params.modelPage.provider ? params.currentRuntime : void 0;
	const selectedRuntime = resolveSelectedRuntime({
		data: params.data,
		provider: params.modelPage.provider,
		modelRef: params.pendingModel ?? params.currentModel,
		currentRuntime,
		pendingRuntime: params.pendingRuntime
	});
	const compactRuntime = resolveCompactRuntimeState({
		currentRuntime,
		pendingRuntime: params.pendingRuntime
	});
	if (runtimeChoices && (runtimeChoices.length > 1 || runtimeChoices.length === 1 && selectedRuntime === void 0)) rows.push(new Row([createModelSelect({
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "runtime",
			view: "models",
			provider: params.modelPage.provider,
			page: params.modelPage.page,
			providerPage: providerPage.page,
			modelIndex: params.pendingModelIndex,
			modelToken: pendingModelToken,
			...params.pendingModelIndex === void 0 && activeModelBucket ? { modelBucket: activeModelBucket } : {},
			userId: params.userId
		}),
		options: runtimeChoices.map((choice) => {
			const option = {
				label: choice.label,
				value: choice.id,
				default: choice.id === selectedRuntime
			};
			if (choice.description) option.description = choice.description;
			return option;
		}),
		placeholder: "Choose how to run this model"
	})]));
	const selectedModelRef = parsedPendingModel ?? parsedCurrentModel;
	const modelOptions = params.modelPage.items.map((model) => ({
		label: model,
		value: model,
		default: selectedModelRef ? selectedModelRef.provider === params.modelPage.provider && selectedModelRef.model === model : false
	}));
	rows.push(new Row([createModelSelect({
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "model",
			view: "models",
			provider: params.modelPage.provider,
			...compactRuntime,
			page: params.modelPage.page,
			providerPage: providerPage.page,
			userId: params.userId
		}),
		options: modelOptions,
		placeholder: `Select ${params.modelPage.provider} model`
	})]));
	const modelNavRow = buildPaginationRow({
		command: params.command,
		userId: params.userId,
		view: "models",
		page: params.modelPage.page,
		totalPages: params.modelPage.totalPages,
		hasPrev: params.modelPage.hasPrev,
		hasNext: params.modelPage.hasNext,
		provider: params.modelPage.provider,
		...compactRuntime,
		providerPage: providerPage.page,
		modelIndex: params.pendingModelIndex,
		modelToken: pendingModelToken,
		modelBucket: params.modelPage.bucket && params.modelPage.bucket.id !== "all" ? params.modelPage.bucket.id : void 0
	});
	if (modelNavRow) rows.push(modelNavRow);
	const resolvedDefault = params.data.resolvedDefault;
	const shouldDisableReset = Boolean(parsedCurrentModel) && parsedCurrentModel?.provider === resolvedDefault.provider && parsedCurrentModel?.model === resolvedDefault.model;
	const hasPendingSelection = Boolean(parsedPendingModel) && parsedPendingModel?.provider === params.modelPage.provider && typeof params.pendingModelIndex === "number" && params.pendingModelIndex > 0;
	const modelActionState = {
		command: params.command,
		provider: params.modelPage.provider,
		...compactRuntime,
		page: params.modelPage.page,
		providerPage: providerPage.page,
		userId: params.userId
	};
	const buttonRowItems = [
		createModelPickerButton({
			label: "Providers",
			customId: buildDiscordModelPickerCustomId({
				command: params.command,
				action: "back",
				view: "providers",
				page: providerPage.page,
				providerBucket: activeProviderBucket,
				userId: params.userId
			})
		}),
		createModelPickerButton({
			label: "Cancel",
			customId: buildDiscordModelPickerCustomId({
				...modelActionState,
				action: "cancel",
				view: "models"
			})
		}),
		createModelPickerButton({
			label: "Reset to default",
			disabled: shouldDisableReset,
			customId: buildDiscordModelPickerCustomId({
				...modelActionState,
				action: "reset",
				view: "models"
			})
		})
	];
	if (hasQuickModels) buttonRowItems.push(createModelPickerButton({
		label: "Recents",
		customId: buildDiscordModelPickerCustomId({
			...modelActionState,
			action: "recents",
			view: "recents",
			modelBucket: activeModelBucket
		})
	}));
	buttonRowItems.push(createModelPickerButton({
		label: "Submit",
		style: ButtonStyle.Primary,
		disabled: !hasPendingSelection || supportsDiscordModelPickerRuntimeChoices() && selectedRuntime === void 0,
		customId: buildDiscordModelPickerCustomId({
			...modelActionState,
			action: "submit",
			view: "models",
			modelIndex: params.pendingModelIndex,
			modelToken: pendingModelToken
		})
	}));
	return {
		rows,
		buttonRow: new Row(buttonRowItems)
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
	const activeProviderBucket = page.bucket && page.bucket.id !== "all" ? page.bucket.id : void 0;
	const providerRow = buildProviderSelectRow({
		command: params.command,
		userId: params.userId,
		page,
		currentProvider: parsedCurrent?.provider,
		providerBucket: activeProviderBucket
	});
	if (providerRow) rows.push(providerRow);
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
	const providerPage = normalizeModelPickerPage(params.providerPage);
	const modelPage = getDiscordModelPickerModelPage({
		data: params.data,
		provider: params.provider,
		page: params.page,
		bucket: params.modelBucket
	});
	if (!modelPage) {
		const rows = [new Row([createModelPickerButton({
			label: "Back",
			customId: buildDiscordModelPickerCustomId({
				command: params.command,
				action: "back",
				view: "providers",
				page: providerPage,
				userId: params.userId
			})
		})])];
		return buildRenderedShell({
			title: "Model Picker",
			refreshWarning: params.data.refreshWarning,
			detailLines: [formatCurrentModelLine(params.currentModel), `Provider not found: ${normalizeProviderId(params.provider)}`],
			rows,
			footer: "Choose a different provider."
		});
	}
	const { rows: modelRows, buttonRow } = buildModelRows({
		command: params.command,
		userId: params.userId,
		data: params.data,
		providerPage,
		modelPage,
		currentModel: params.currentModel,
		currentRuntime: params.currentRuntime,
		pendingModel: params.pendingModel,
		pendingModelIndex: params.pendingModelIndex,
		pendingRuntime: params.pendingRuntime,
		quickModels: params.quickModels,
		providerBucket: params.providerBucket
	});
	const pendingRuntime = params.pendingRuntime?.trim();
	const rows = [];
	const bucketRow = buildBucketSelectRow({
		command: params.command,
		userId: params.userId,
		view: "models",
		buckets: modelPage.buckets,
		currentBucketId: modelPage.bucket?.id,
		provider: modelPage.provider,
		runtimeToken: pendingRuntime ? createDiscordModelPickerRuntimeToken(pendingRuntime) : void 0,
		providerPage,
		providerBucket: params.providerBucket
	});
	if (bucketRow) rows.push(bucketRow);
	rows.push(...modelRows);
	const defaultModel = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	const choices = getRuntimeChoices({
		data: params.data,
		provider: modelPage.provider,
		modelRef: params.pendingModel ?? params.currentModel
	});
	const selectedRuntime = resolveSelectedRuntime({
		data: params.data,
		provider: modelPage.provider,
		modelRef: params.pendingModel ?? params.currentModel,
		currentRuntime: parseCurrentModelRef(params.currentModel)?.provider === modelPage.provider ? params.currentRuntime : void 0,
		pendingRuntime: params.pendingRuntime
	});
	const selectedRuntimeLabel = choices?.find((choice) => choice.id === selectedRuntime)?.label;
	const pendingLine = !params.pendingModel ? "Select a model, then press Submit." : !supportsDiscordModelPickerRuntimeChoices() ? `Selected: ${params.pendingModel} (press Submit)` : choices === void 0 ? "Could not confirm how to run this model. Open /models to try again." : choices.length === 0 ? "This model cannot run with your current connections. Choose another model." : selectedRuntimeLabel ? `Selected: ${params.pendingModel} · ${selectedRuntimeLabel} (press Submit)` : "Choose how to run this model, then press Submit.";
	const detailLines = [formatCurrentModelLine(params.currentModel), `Default: ${defaultModel}`];
	if (modelPage.totalPages > 1) detailLines.push(`${modelPage.provider}: page ${modelPage.page}/${modelPage.totalPages} · ${modelPage.totalItems} models`);
	return buildRenderedShell({
		title: "Model Picker",
		refreshWarning: params.data.refreshWarning,
		detailLines,
		preRowText: pendingLine,
		rows,
		trailingRows: [buttonRow]
	});
}
function formatRecentsButtonLabel(modelRef, suffix) {
	const maxLen = 80;
	const label = suffix ? `${modelRef} ${suffix}` : modelRef;
	if (label.length <= maxLen) return label;
	return suffix ? `${sliceUtf16Safe(modelRef, 0, maxLen - suffix.length - 2)}… ${suffix}` : `${sliceUtf16Safe(modelRef, 0, 79)}…`;
}
function createModelRefToken(modelRef) {
	const parsed = parseCurrentModelRef(modelRef);
	return parsed ? createDiscordModelPickerModelToken(parsed.provider, parsed.model) : void 0;
}
function renderDiscordModelPickerRecentsView(params) {
	const defaultModelRef = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	const rows = [];
	const recentModels = [defaultModelRef, ...params.quickModels.filter((modelRef) => modelRef !== defaultModelRef)];
	for (const [index, modelRef] of recentModels.entries()) rows.push(new Row([createModelPickerButton({
		label: formatRecentsButtonLabel(modelRef, index === 0 ? "(default)" : void 0),
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "submit",
			view: "recents",
			recentSlot: index + 1,
			modelToken: createModelRefToken(modelRef),
			provider: params.provider,
			runtime: params.runtime,
			runtimeToken: params.runtimeToken,
			page: params.page,
			providerPage: params.providerPage,
			userId: params.userId
		})
	})]));
	const backRow = new Row([createModelPickerButton({
		label: "Back",
		customId: buildDiscordModelPickerCustomId({
			command: params.command,
			action: "back",
			view: "models",
			provider: params.provider,
			runtime: params.runtime,
			runtimeToken: params.runtimeToken,
			page: params.page,
			providerPage: params.providerPage,
			modelBucket: params.modelBucket,
			userId: params.userId
		})
	})]);
	return buildRenderedShell({
		title: "Recents",
		refreshWarning: params.data.refreshWarning,
		detailLines: ["Models you've previously selected appear here.", formatCurrentModelLine(params.currentModel)],
		preRowText: "Tap a model to switch.",
		rows,
		trailingRows: [backRow]
	});
}
//#endregion
//#region extensions/discord/src/monitor/native-command-model-picker-apply.ts
function normalizeExpectedRuntime(value) {
	const runtime = value?.trim();
	if (!runtime) return;
	return runtime === "auto" || runtime === "default" ? "auto" : runtime;
}
async function applyDiscordModelPickerSelection(params) {
	try {
		const dispatchResult = await withTimeout(params.dispatchCommandInteraction({
			readPolicy: params.readPolicy,
			interaction: params.interaction,
			prompt: params.selectionCommand.prompt,
			command: params.selectionCommand.command,
			commandArgs: params.selectionCommand.args,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			sessionPrefix: params.sessionPrefix,
			preferFollowUp: true,
			threadBindings: params.threadBindings,
			suppressReplies: true,
			buildContext: params.buildContext,
			dispatchReplyFromConfig: params.dispatchReplyFromConfig,
			pluginCommandDispatch: { kind: "non-plugin" }
		}), 12e3);
		if (!dispatchResult.accepted) return {
			status: "rejected",
			noticeMessage: `❌ Failed to apply ${params.resolvedModelRef}. Try /model ${params.resolvedModelRef} directly.`
		};
		const hiddenFinalReply = dispatchResult.hiddenFinalReply;
		const effectiveRoute = dispatchResult.effectiveRoute ?? params.route;
		if (params.settleMs > 0) await new Promise((resolve) => {
			setTimeout(resolve, params.settleMs);
		});
		const effectiveModelRef = params.resolveCurrentModel(effectiveRoute);
		const effectiveRuntime = params.resolveCurrentRuntime(effectiveRoute);
		const currentSelection = `Current selection: ${effectiveModelRef} with runtime ${effectiveRuntime}.`;
		if (hiddenFinalReply?.isError) return {
			status: "rejected",
			noticeMessage: `${hiddenFinalReply.text?.trim()}\n${currentSelection}`
		};
		const expectedRuntime = normalizeExpectedRuntime(params.selectedRuntime);
		const verified = effectiveModelRef === params.resolvedModelRef && (expectedRuntime === void 0 || effectiveRuntime === expectedRuntime);
		if (verified) await recordDiscordModelPickerRecentModel({
			scope: params.preferenceScope,
			modelRef: params.resolvedModelRef,
			limit: 5
		}).catch(() => void 0);
		return verified ? {
			status: "success",
			effectiveModelRef,
			noticeMessage: hiddenFinalReply?.text?.trim() || `✅ Model set to ${params.resolvedModelRef}.`
		} : {
			status: "mismatch",
			effectiveModelRef,
			noticeMessage: `⚠️ Tried to set ${params.resolvedModelRef}${expectedRuntime ? ` with runtime ${expectedRuntime}` : ""}, but current selection is ${effectiveModelRef} with runtime ${effectiveRuntime}.`
		};
	} catch (error) {
		if (error instanceof Error && error.message === "timeout") return {
			status: "timeout",
			noticeMessage: `⏳ Model change to ${params.resolvedModelRef} is still processing. Check /status in a few seconds.`
		};
		return {
			status: "failed",
			noticeMessage: `❌ Failed to apply ${params.resolvedModelRef}. Try /model ${params.resolvedModelRef} directly.`
		};
	}
}
//#endregion
//#region extensions/discord/src/monitor/native-command-model-picker-ui.ts
function resolveDiscordModelPickerCommandContext(command) {
	const normalized = normalizeLowercaseStringOrEmpty(command.nativeName ?? command.key);
	if (normalized === "model" || normalized === "models") return normalized;
	return null;
}
function resolveCommandArgStringValue(args, key) {
	const value = args?.values?.[key];
	if (typeof value !== "string") return "";
	return value.trim();
}
function shouldOpenDiscordModelPickerFromCommand(params) {
	const context = resolveDiscordModelPickerCommandContext(params.command);
	if (!context) return null;
	const serializedArgs = normalizeOptionalString(serializeCommandArgs(params.command, params.commandArgs)) ?? "";
	if (context === "model") return !resolveCommandArgStringValue(params.commandArgs, "model") && !serializedArgs ? context : null;
	return serializedArgs ? null : context;
}
function buildDiscordModelPickerAllowedModelRefs(data) {
	const out = /* @__PURE__ */ new Set();
	for (const provider of data.providers) {
		const models = data.byProvider.get(provider);
		if (!models) continue;
		for (const model of models) out.add(`${provider}/${model}`);
	}
	return out;
}
function resolveDiscordModelPickerPreferenceScope(params) {
	return {
		accountId: params.accountId,
		guildId: params.interaction.guild?.id ?? void 0,
		userId: params.userId
	};
}
function buildDiscordModelPickerNoticePayload(message) {
	return { components: [new Container([new TextDisplay(message)])] };
}
async function resolveDiscordModelPickerRouteState(params) {
	const { interaction, cfg, accountId } = params;
	const { isDirectMessage, isGroupDm, isThreadChannel, rawChannelId, threadParentId } = await resolveDiscordNativeInteractionChannelContext({
		channel: interaction.channel,
		client: interaction.client,
		hasGuild: Boolean(interaction.guild),
		channelIdFallback: interaction.rawData.channel_id ?? "unknown"
	});
	const memberRoleIds = Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.map((roleId) => roleId) : [];
	const threadBinding = isThreadChannel ? params.threadBindings.getByThreadId(rawChannelId) : void 0;
	return resolveDiscordNativeInteractionRouteState({
		cfg,
		accountId,
		guildId: interaction.guild?.id ?? void 0,
		memberRoleIds,
		isDirectMessage,
		isGroupDm,
		directUserId: interaction.user?.id ?? rawChannelId,
		conversationId: rawChannelId,
		parentConversationId: threadParentId,
		threadBinding
	});
}
async function resolveDiscordModelPickerRoute(params) {
	return (await resolveDiscordModelPickerRouteState(params)).effectiveRoute;
}
async function resolveDiscordNativeChoiceContext(params) {
	try {
		const route = params.route ?? await resolveDiscordModelPickerRoute(params);
		const fallback = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: route.agentId
		});
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: route.agentId });
		const sessionEntry = getSessionEntry({
			storePath,
			sessionKey: route.sessionKey
		});
		const override = resolveStoredModelOverride({
			sessionEntry,
			loadSessionEntry: (sessionKey) => getSessionEntry({
				storePath,
				sessionKey
			}),
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
function resolveDiscordModelPickerCurrentModel(params) {
	const fallback = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.route.agentId });
		const sessionEntry = getSessionEntry({
			storePath,
			sessionKey: params.route.sessionKey,
			readConsistency: "latest"
		});
		const override = resolveStoredModelOverride({
			sessionEntry,
			loadSessionEntry: (sessionKey) => getSessionEntry({
				storePath,
				sessionKey,
				readConsistency: "latest"
			}),
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
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.route.agentId });
		const sessionRuntime = normalizeOptionalString(getSessionEntry({
			storePath,
			sessionKey: params.route.sessionKey,
			readConsistency: "latest"
		})?.agentRuntimeOverride);
		if (sessionRuntime) return sessionRuntime;
	} catch {}
	return "auto";
}
async function replyWithDiscordModelPickerProviders(params) {
	const route = await resolveDiscordModelPickerRoute({
		interaction: params.interaction,
		cfg: params.cfg,
		accountId: params.accountId,
		threadBindings: params.threadBindings
	});
	const sessionEntry = getSessionEntry({
		storePath: resolveStorePath(params.cfg.session?.store, { agentId: route.agentId }),
		sessionKey: route.sessionKey,
		readConsistency: "latest"
	});
	const data = await loadDiscordModelPickerData(params.cfg, route.agentId, { sessionEntry });
	const currentModel = resolveDiscordModelPickerCurrentModel({
		cfg: params.cfg,
		route,
		data
	});
	const currentRuntime = resolveDiscordModelPickerCurrentRuntime({
		cfg: params.cfg,
		route
	});
	const quickModels = await readDiscordModelPickerRecentModels({
		scope: resolveDiscordModelPickerPreferenceScope({
			interaction: params.interaction,
			accountId: params.accountId,
			userId: params.userId
		}),
		allowedModelRefs: buildDiscordModelPickerAllowedModelRefs(data),
		limit: 5
	});
	const parsedCurrentRef = splitDiscordModelRef(currentModel ?? "");
	const initialProvider = parsedCurrentRef && data.byProvider.has(parsedCurrentRef.provider) ? parsedCurrentRef.provider : data.providers[0] ?? data.resolvedDefault.provider;
	const initialResolved = parsedCurrentRef && parsedCurrentRef.provider === initialProvider ? resolveDiscordModelPickerPageForModel({
		data,
		provider: initialProvider,
		model: parsedCurrentRef.model
	}) : { page: 1 };
	const initialPage = initialResolved.page;
	const initialModelBucket = initialResolved.bucket;
	const initialProviderLocation = findProviderBucketLocation(data, initialProvider);
	const payload = {
		...renderDiscordModelPickerModelsView({
			command: params.command,
			userId: params.userId,
			data,
			provider: initialProvider,
			page: initialPage,
			providerPage: initialProviderLocation?.page ?? 1,
			providerBucket: initialProviderLocation?.bucket,
			modelBucket: initialModelBucket,
			currentModel,
			currentRuntime,
			quickModels
		}),
		ephemeral: true
	};
	await params.safeInteractionCall("model picker reply", async () => {
		if (params.preferFollowUp) {
			await params.interaction.followUp(payload);
			return;
		}
		await params.interaction.reply(payload);
	});
}
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
//#endregion
//#region extensions/discord/src/monitor/native-command-model-picker-interaction.ts
function resolveModelPickerSelectionValue(interaction) {
	const rawValues = interaction.values;
	if (!Array.isArray(rawValues) || rawValues.length === 0) return null;
	const first = rawValues[0];
	if (typeof first !== "string") return null;
	return first.trim() || null;
}
function resolveRuntimeToken(choices, token) {
	if (!token) return;
	const matches = choices?.filter((choice) => createDiscordModelPickerRuntimeToken(choice.id) === token);
	return matches?.length === 1 ? matches[0]?.id : void 0;
}
function resolveModelPickerProvider(params) {
	return params.parsedProvider ?? splitDiscordModelRef(params.currentModelRef ?? "")?.provider ?? params.data.resolvedDefault.provider;
}
function resolveSelectedBucket(interaction) {
	const raw = resolveModelPickerSelectionValue(interaction)?.toLowerCase();
	return raw && raw !== "all" ? raw : void 0;
}
function resolvePendingRuntime(params) {
	return params.parsed.runtime ?? resolveRuntimeToken(getDiscordModelPickerRuntimeChoices(params.data, params.provider), params.parsed.runtimeToken);
}
function resolveSubmittedModelRef(params) {
	if (params.parsed.action === "reset") return `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	if (params.parsed.modelToken) return resolveDiscordModelPickerModelRefByToken(params.data, params.parsed.modelToken);
	if (params.parsed.action === "quick") {
		if (params.requireModelToken) return null;
		const slot = params.parsed.recentSlot ?? 0;
		return slot >= 1 ? params.quickModels[slot - 1] ?? null : null;
	}
	if (params.parsed.view === "recents") {
		if (params.requireModelToken) return null;
		const defaultModelRef = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
		const dedupedRecents = params.quickModels.filter((ref) => ref !== defaultModelRef);
		const slot = params.parsed.recentSlot ?? 0;
		if (slot === 1) return defaultModelRef;
		return slot >= 2 ? dedupedRecents[slot - 2] ?? null : null;
	}
	const provider = params.parsed.provider;
	const selectedModel = resolveDiscordModelPickerModelSelection({
		data: params.data,
		provider: provider ?? "",
		modelIndex: params.parsed.modelIndex,
		modelToken: params.parsed.modelToken,
		requireModelToken: params.requireModelToken
	});
	return provider && selectedModel ? `${provider}/${selectedModel}` : null;
}
function buildDiscordModelPickerSelectionCommand(params) {
	const commandDefinition = findCommandByNativeName("model", "discord") ?? listChatCommands().find((entry) => entry.key === "model");
	if (!commandDefinition) return null;
	const commandArgs = {
		values: { model: params.modelRef },
		raw: params.runtime ? `${params.modelRef} --runtime ${params.runtime}` : params.modelRef
	};
	return {
		command: commandDefinition,
		args: commandArgs,
		prompt: buildCommandTextFromArgs(commandDefinition, commandArgs)
	};
}
function listDiscordModelPickerProviderModels(data, provider) {
	const modelSet = data.byProvider.get(provider);
	if (!modelSet) return [];
	return [...modelSet].toSorted((left, right) => left < right ? -1 : left > right ? 1 : 0);
}
function resolveDiscordModelPickerModelRefByToken(data, modelToken) {
	const matchingRefs = [];
	for (const [provider, models] of data.byProvider) for (const model of models) if (createDiscordModelPickerModelToken(provider, model) === modelToken) matchingRefs.push(`${provider}/${model}`);
	return matchingRefs.length === 1 ? matchingRefs[0] ?? null : null;
}
function resolveDiscordModelPickerModelIndex(params) {
	const models = listDiscordModelPickerProviderModels(params.data, params.provider);
	if (!models.length) return null;
	const index = models.indexOf(params.model);
	if (index < 0) return null;
	return index + 1;
}
function resolveDiscordModelPickerModelSelection(params) {
	const models = listDiscordModelPickerProviderModels(params.data, params.provider);
	if (!models.length) return null;
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
	let deferredUpdate = interaction.acknowledged;
	if (!deferredUpdate) {
		if (await params.safeInteractionCall("model picker defer", () => interaction.acknowledge()) === null) return;
		deferredUpdate = true;
	}
	const cfg = getRuntimeConfigSnapshot() ?? ctx.cfg;
	const requireModelToken = cfg !== ctx.cfg;
	const route = await resolveDiscordModelPickerRoute({
		interaction,
		cfg,
		accountId: ctx.accountId,
		threadBindings: ctx.threadBindings
	});
	const sessionEntry = getSessionEntry({
		storePath: resolveStorePath(cfg.session?.store, { agentId: route.agentId }),
		sessionKey: route.sessionKey,
		readConsistency: "latest"
	});
	const pickerData = await loadDiscordModelPickerData(cfg, route.agentId, { sessionEntry });
	const tokenModel = parsed.modelToken ? resolveDiscordModelPickerModelRefByToken(pickerData, parsed.modelToken) : null;
	const parsedProvider = parsed.provider ?? splitDiscordModelRef(tokenModel ?? "")?.provider;
	const currentModelRef = resolveDiscordModelPickerCurrentModel({
		cfg,
		route,
		data: pickerData
	});
	const currentRuntime = resolveDiscordModelPickerCurrentRuntime({
		cfg,
		route
	});
	const allowedModelRefs = buildDiscordModelPickerAllowedModelRefs(pickerData);
	const preferenceScope = resolveDiscordModelPickerPreferenceScope({
		interaction,
		accountId: ctx.accountId,
		userId: parsed.userId
	});
	const quickModels = await readDiscordModelPickerRecentModels({
		scope: preferenceScope,
		allowedModelRefs,
		limit: 5
	});
	const updatePicker = async (payload) => await params.safeInteractionCall("model picker update", () => deferredUpdate ? interaction.editReply(payload) : interaction.update(payload));
	const showNotice = async (message) => await updatePicker(buildDiscordModelPickerNoticePayload(message));
	const updateModelsView = async (provider, state = {}) => {
		const rendered = renderDiscordModelPickerModelsView({
			command: parsed.command,
			userId: parsed.userId,
			data: pickerData,
			provider,
			page: parsed.page,
			providerPage: parsed.providerPage ?? 1,
			providerBucket: parsed.providerBucket ?? findProviderBucketId(pickerData, provider),
			currentModel: currentModelRef,
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
	if (parsed.runtimeIndex !== void 0 && parsed.action !== "cancel") {
		await showNotice("That runtime selection expired. Reopen /model and choose a runtime again.");
		return;
	}
	if (parsed.runtimeToken && ![
		"submit",
		"reset",
		"quick",
		"cancel"
	].includes(parsed.action) && parsedProvider && !resolvePendingRuntime({
		data: pickerData,
		provider: parsedProvider,
		parsed
	})) {
		await showNotice("That runtime selection expired. Reopen /model and choose a runtime again.");
		return;
	}
	if (parsed.action === "recents") {
		await updatePicker(renderDiscordModelPickerRecentsView({
			command: parsed.command,
			userId: parsed.userId,
			data: pickerData,
			quickModels,
			currentModel: currentModelRef,
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
			command: parsed.command,
			userId: parsed.userId,
			data: pickerData,
			page: selectingBucket ? 1 : parsed.page,
			providerBucket: selectingBucket ? resolveSelectedBucket(interaction) : parsed.providerBucket,
			currentModel: currentModelRef
		}));
		return;
	}
	if (parsed.action === "bucket" && parsed.view === "models") {
		const provider = resolveModelPickerProvider({
			parsedProvider,
			currentModelRef,
			data: pickerData
		});
		await updateModelsView(provider, {
			page: 1,
			modelBucket: resolveSelectedBucket(interaction),
			pendingRuntime: resolvePendingRuntime({
				data: pickerData,
				provider,
				parsed
			})
		});
		return;
	}
	if (parsed.action === "nav" && parsed.view === "models") {
		const provider = resolveModelPickerProvider({
			parsedProvider,
			currentModelRef,
			data: pickerData
		});
		const pendingModel = resolveDiscordModelPickerModelSelection({
			data: pickerData,
			provider,
			modelIndex: parsed.modelIndex,
			modelToken: parsed.modelToken,
			requireModelToken
		});
		if ((parsed.modelIndex || parsed.modelToken) && !pendingModel) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const pendingModelIndex = pendingModel ? resolveDiscordModelPickerModelIndex({
			data: pickerData,
			provider,
			model: pendingModel
		}) : void 0;
		await updateModelsView(provider, {
			modelBucket: parsed.modelBucket,
			...pendingModel ? { pendingModel: `${provider}/${pendingModel}` } : {},
			pendingModelIndex: pendingModelIndex ?? void 0,
			pendingRuntime: resolvePendingRuntime({
				data: pickerData,
				provider,
				parsed
			})
		});
		return;
	}
	if (parsed.action === "back" && parsed.view === "models") {
		const provider = resolveModelPickerProvider({
			parsedProvider,
			currentModelRef,
			data: pickerData
		});
		await updateModelsView(provider, {
			modelBucket: parsed.modelBucket,
			pendingRuntime: resolvePendingRuntime({
				data: pickerData,
				provider,
				parsed
			})
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
	if (parsed.action === "model") {
		const selectedModel = resolveModelPickerSelectionValue(interaction);
		const provider = parsedProvider;
		if (!provider || !selectedModel) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const modelIndex = resolveDiscordModelPickerModelIndex({
			data: pickerData,
			provider,
			model: selectedModel
		});
		if (!modelIndex) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const modelRef = `${provider}/${selectedModel}`;
		await updateModelsView(provider, {
			modelBucket: parsed.modelBucket ?? findModelBucketId(pickerData, provider, selectedModel),
			pendingModel: modelRef,
			pendingModelIndex: modelIndex,
			pendingRuntime: resolvePendingRuntime({
				data: pickerData,
				provider,
				parsed
			})
		});
		return;
	}
	if (parsed.action === "runtime") {
		const selectedRuntime = resolveModelPickerSelectionValue(interaction) ?? parsed.runtime;
		const provider = parsedProvider;
		if (!provider || !pickerData.byProvider.has(provider)) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const selectedModel = resolveDiscordModelPickerModelSelection({
			data: pickerData,
			provider,
			modelIndex: parsed.modelIndex,
			modelToken: parsed.modelToken,
			requireModelToken
		});
		if ((parsed.modelIndex || parsed.modelToken) && !selectedModel) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const currentModel = splitDiscordModelRef(currentModelRef ?? "");
		const choices = getDiscordModelPickerRuntimeChoices(pickerData, provider, selectedModel ?? (currentModel?.provider === provider ? currentModel.model : void 0));
		if (!selectedRuntime || !choices?.some((choice) => choice.id === selectedRuntime)) {
			await showNotice("That runtime is not available for this model. Choose a runtime again.");
			return;
		}
		const pendingModel = selectedModel ? `${provider}/${selectedModel}` : void 0;
		const pendingModelIndex = selectedModel ? resolveDiscordModelPickerModelIndex({
			data: pickerData,
			provider,
			model: selectedModel
		}) : void 0;
		const currentModelOnly = splitDiscordModelRef(currentModelRef ?? "");
		await updateModelsView(provider, {
			modelBucket: parsed.modelBucket ?? (selectedModel ? findModelBucketId(pickerData, provider, selectedModel) : currentModelOnly && currentModelOnly.provider === provider ? findModelBucketId(pickerData, provider, currentModelOnly.model) : void 0),
			...pendingModel ? { pendingModel } : {},
			pendingModelIndex: pendingModelIndex ?? void 0,
			pendingRuntime: selectedRuntime
		});
		return;
	}
	if (parsed.action === "submit" || parsed.action === "reset" || parsed.action === "quick") {
		const modelRef = resolveSubmittedModelRef({
			data: pickerData,
			parsed,
			quickModels,
			requireModelToken
		});
		const parsedModelRef = modelRef ? splitDiscordModelRef(modelRef) : null;
		if (!parsedModelRef || !pickerData.byProvider.get(parsedModelRef.provider)?.has(parsedModelRef.model)) {
			await showNotice(MODEL_PICKER_CHANGED_MESSAGE);
			return;
		}
		const resolvedModelRef = `${parsedModelRef.provider}/${parsedModelRef.model}`;
		const choices = getDiscordModelPickerRuntimeChoices(pickerData, parsedModelRef.provider, parsedModelRef.model);
		const modelOnlyHost = !supportsDiscordModelPickerRuntimeChoices();
		const supportsModelOnlySelection = () => {
			const currentEntry = getSessionEntry({
				storePath: resolveStorePath(cfg.session?.store, { agentId: route.agentId }),
				sessionKey: route.sessionKey,
				readConsistency: "latest"
			});
			const override = currentEntry?.agentRuntimeOverride?.trim();
			if (override && ![
				"auto",
				"default",
				"openclaw"
			].includes(override)) return false;
			const model = pickerData.modelCatalog?.find((entry) => entry.provider === parsedModelRef.provider && entry.id === parsedModelRef.model);
			return resolveEffectiveAgentRuntime({
				cfg,
				provider: parsedModelRef.provider,
				modelId: parsedModelRef.model,
				modelApi: model?.api,
				modelBaseUrl: model?.baseUrl,
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				sessionEntry: currentEntry
			}) === "openclaw";
		};
		const legacyRuntimeNotice = "This OpenClaw version supports model-only selection here. Update OpenClaw to change runtimes in the picker.";
		if (modelOnlyHost && (parsed.runtime || parsed.runtimeToken || !supportsModelOnlySelection())) {
			await showNotice(legacyRuntimeNotice);
			return;
		}
		if (!modelOnlyHost && choices === void 0) {
			await showNotice("Runtime availability is not confirmed. Reopen /model to try again.");
			return;
		}
		const selectedRuntime = normalizeOptionalString(parsed.runtime) ?? resolveRuntimeToken(choices, parsed.runtimeToken);
		if (choices?.length === 0 || parsed.runtimeToken && selectedRuntime === void 0 || selectedRuntime && selectedRuntime !== "auto" && selectedRuntime !== "default" && !choices?.some((choice) => choice.id === selectedRuntime)) {
			await showNotice("That runtime is not available for this model. Reopen /model and choose again.");
			return;
		}
		const selectionCommand = buildDiscordModelPickerSelectionCommand({
			modelRef: resolvedModelRef,
			runtime: selectedRuntime
		});
		if (!selectionCommand) {
			await showNotice("Sorry, /model is unavailable right now.");
			return;
		}
		if (await showNotice(`Applying model change to ${resolvedModelRef}...`) === null) return;
		if (pickerData.isCurrent?.() === false) {
			await showNotice("That model picker expired. Reopen /model to try again.");
			return;
		}
		if (modelOnlyHost && !supportsModelOnlySelection()) {
			await showNotice(legacyRuntimeNotice);
			return;
		}
		const applyResult = await applyDiscordModelPickerSelection({
			...ctx,
			interaction,
			selectionCommand,
			dispatchCommandInteraction: params.dispatchCommandInteraction,
			cfg,
			route,
			resolvedModelRef,
			selectedRuntime,
			preferenceScope,
			settleMs: ctx.postApplySettleMs ?? 250,
			resolveCurrentModel: (currentRoute) => resolveDiscordModelPickerCurrentModel({
				cfg,
				route: currentRoute,
				data: pickerData
			}),
			resolveCurrentRuntime: (currentRoute) => resolveDiscordModelPickerCurrentRuntime({
				cfg,
				route: currentRoute
			})
		});
		await params.safeInteractionCall("model picker follow-up", () => interaction.followUp({
			...buildDiscordModelPickerNoticePayload(applyResult.noticeMessage),
			ephemeral: true
		}));
		return;
	}
	if (parsed.action === "cancel") await showNotice(`ℹ️ Model kept as ${currentModelRef ?? "default"}.`);
}
async function runDiscordModelPickerFallback(params) {
	await handleDiscordModelPickerInteraction(params);
}
var DiscordModelPickerFallbackButton = class extends Button {
	constructor(params) {
		super();
		this.params = params;
		this.label = "modelpick";
		this.customId = `${DISCORD_MODEL_PICKER_CUSTOM_ID_KEY}:seed=btn`;
	}
	async run(interaction, data) {
		await runDiscordModelPickerFallback({
			...this.params,
			interaction,
			data
		});
	}
};
var DiscordModelPickerFallbackSelect = class extends StringSelectMenu {
	constructor(params) {
		super();
		this.params = params;
		this.customId = `${DISCORD_MODEL_PICKER_CUSTOM_ID_KEY}:seed=sel`;
		this.options = [];
	}
	async run(interaction, data) {
		await runDiscordModelPickerFallback({
			...this.params,
			interaction,
			data
		});
	}
};
function createDiscordModelPickerFallbackButton$1(params) {
	return new DiscordModelPickerFallbackButton(params);
}
function createDiscordModelPickerFallbackSelect$1(params) {
	return new DiscordModelPickerFallbackSelect(params);
}
//#endregion
//#region extensions/discord/src/monitor/native-command-status.ts
async function maybeDeliverDiscordDirectStatus(params) {
	if (params.suppressReplies || params.commandName !== "status") return null;
	const statusReply = await params.resolveDirectStatusReplyForSession({
		cfg: params.cfg,
		sessionKey: params.commandTargetSessionKey?.trim() || params.sessionKey,
		channel: params.channel,
		senderId: params.senderId,
		senderIsOwner: params.senderIsOwner,
		isAuthorizedSender: params.isAuthorizedSender,
		isGroup: params.isGroup,
		defaultGroupActivation: params.defaultGroupActivation
	});
	if (statusReply && hasRenderableReplyPayload(statusReply)) {
		await deliverDiscordInteractionReply({
			interaction: params.interaction,
			payload: statusReply,
			mediaLocalRoots: params.mediaLocalRoots,
			textLimit: resolveTextChunkLimit(params.cfg, "discord", params.accountId, { fallbackLimit: 2e3 }),
			maxLinesPerMessage: resolveDiscordMaxLinesPerMessage({
				cfg: params.cfg,
				discordConfig: params.discordConfig,
				accountId: params.accountId
			}),
			preferFollowUp: params.preferFollowUp,
			responseEphemeral: params.responseEphemeral,
			chunkMode: resolveChunkMode(params.cfg, "discord", params.accountId)
		});
		return {
			accepted: true,
			effectiveRoute: params.effectiveRoute
		};
	}
	await params.respond("Status unavailable.");
	return {
		accepted: true,
		effectiveRoute: params.effectiveRoute
	};
}
//#endregion
//#region extensions/discord/src/monitor/native-command.args.ts
function readDiscordCommandArgs(interaction, definitions) {
	if (!definitions || definitions.length === 0) return;
	const values = {};
	for (const definition of definitions) {
		let value;
		if (definition.type === "number") value = interaction.options.getNumber(definition.name) ?? null;
		else if (definition.type === "boolean") value = interaction.options.getBoolean(definition.name) ?? null;
		else value = interaction.options.getString(definition.name) ?? null;
		if (value != null) values[definition.name] = value;
	}
	return Object.keys(values).length > 0 ? { values } : void 0;
}
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
//#endregion
//#region extensions/discord/src/monitor/native-command.options.ts
const log$1 = createSubsystemLogger("discord/native-command");
const DISCORD_COMMAND_DESCRIPTION_MAX = 100;
function truncateDiscordCommandDescription(params) {
	const { value, label } = params;
	if (value.length <= DISCORD_COMMAND_DESCRIPTION_MAX) return value;
	log$1.debug(`discord: truncating native command description (${label}) from ${value.length} to ${DISCORD_COMMAND_DESCRIPTION_MAX}: ${JSON.stringify(value)}`);
	return truncateUtf16Safe(value, DISCORD_COMMAND_DESCRIPTION_MAX);
}
function truncateDiscordCommandDescriptionLocalizations(params) {
	const entries = Object.entries(params.value ?? {});
	if (entries.length === 0) return;
	return Object.fromEntries(entries.map(([locale, description]) => [locale, truncateDiscordCommandDescription({
		value: description,
		label: `${params.label} locale:${locale}`
	})]));
}
function resolveDiscordCommandLogLabel(command) {
	if (typeof command.nativeName === "string" && command.nativeName.trim().length > 0) return command.nativeName;
	return command.key;
}
function buildDiscordCommandOptions(params) {
	const { command, cfg, resolveConfig, authorizeChoiceContext, resolveChoiceContext } = params;
	const commandLabel = resolveDiscordCommandLogLabel(command);
	const args = command.args;
	if (!args || args.length === 0) return;
	return args.map((arg) => {
		const required = arg.required ?? false;
		if (arg.type === "number" || arg.type === "boolean") return {
			name: arg.name,
			description: truncateDiscordCommandDescription({
				value: arg.description,
				label: `command:${commandLabel} arg:${arg.name}`
			}),
			type: arg.type === "number" ? ApplicationCommandOptionType.Number : ApplicationCommandOptionType.Boolean,
			required
		};
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
			await interaction.respond(filtered.slice(0, 25).map((choice) => ({
				name: choice.label,
				value: choice.value
			})));
		} : void 0;
		const choices = resolvedChoices.length > 0 && !autocomplete ? resolvedChoices.slice(0, 25).map((choice) => ({
			name: choice.label,
			value: choice.value
		})) : void 0;
		return {
			name: arg.name,
			description: truncateDiscordCommandDescription({
				value: arg.description,
				label: `command:${commandLabel} arg:${arg.name}`
			}),
			type: ApplicationCommandOptionType.String,
			required,
			choices,
			autocomplete
		};
	});
}
//#endregion
//#region extensions/discord/src/monitor/native-command.ts
const log = createSubsystemLogger("discord/native-command");
const NON_PLUGIN_COMMAND_DISPATCH = Object.freeze({ kind: "non-plugin" });
function createDiscordNativeCommand(params) {
	const { command, cfg, discordConfig, accountId, sessionPrefix, ephemeralDefault, threadBindings, buildContext, dispatchReplyFromConfig } = params;
	const fallbackCommandDefinition = createNativeCommandDefinition(command);
	const pluginCommandCandidate = "prepareDispatch" in command ? command : void 0;
	const commandDefinition = pluginCommandCandidate ? fallbackCommandDefinition : findCommandByNativeName$1(command.name, "discord", { includeBundledChannelFallback: false }) ?? fallbackCommandDefinition;
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
				sessionPrefix,
				threadBindings,
				buildContext,
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
			this.description = truncateDiscordCommandDescription({
				value: command.description,
				label: `command:${command.name}`
			});
			this.descriptionLocalizations = truncateDiscordCommandDescriptionLocalizations({
				value: command.descriptionLocalizations,
				label: `command:${command.name}`
			});
			this.defer = false;
			this.ephemeral = ephemeralDefault;
			this.options = options;
		}
		async run(interaction) {
			if (await safeDiscordInteractionCall("interaction defer", () => interaction.defer({ ephemeral: this.ephemeral })) === null) return;
			const commandArgs = argDefinitions?.length ? readDiscordCommandArgs(interaction, argDefinitions) : command.acceptsArgs ? parseCommandArgs(commandDefinition, interaction.options.getString("input") ?? "") : void 0;
			const commandArgsWithRaw = commandArgs ? {
				...commandArgs,
				raw: serializeCommandArgs$1(commandDefinition, commandArgs) ?? commandArgs.raw
			} : void 0;
			const prompt = buildCommandTextFromArgs$1(commandDefinition, commandArgsWithRaw);
			const preparedPluginCommand = pluginCommandCandidate?.prepareDispatch(commandArgsWithRaw?.raw);
			await dispatchDiscordCommandInteraction({
				readPolicy,
				interaction,
				prompt,
				command: commandDefinition,
				commandArgs: commandArgsWithRaw,
				cfg,
				discordConfig,
				accountId,
				sessionPrefix,
				preferFollowUp: true,
				threadBindings,
				responseEphemeral: ephemeralDefault,
				buildContext,
				dispatchReplyFromConfig,
				pluginCommandDispatch: preparedPluginCommand ?? NON_PLUGIN_COMMAND_DISPATCH
			});
		}
	}();
}
async function dispatchDiscordCommandInteraction(params) {
	const { interaction, prompt, command, commandArgs, cfg: inputConfig, discordConfig: inputDiscordConfig, accountId, sessionPrefix, preferFollowUp, threadBindings, responseEphemeral, suppressReplies, buildContext, dispatchReplyFromConfig } = params;
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
		await safeDiscordInteractionCall("interaction reply", async () => {
			if (preferFollowUp) {
				await interaction.followUp(payload);
				return;
			}
			await interaction.reply(payload);
		});
	};
	const useAccessGroups = true;
	const user = interaction.user;
	if (!user) return { accepted: false };
	const sender = resolveDiscordSenderIdentity({
		author: user,
		pluralkitInfo: null
	});
	const channel = interaction.channel;
	const channelContext = await resolveDiscordNativeInteractionChannelContext({
		channel,
		client: interaction.client,
		hasGuild: Boolean(interaction.guild),
		channelIdFallback: interaction.rawData.channel_id ?? ""
	});
	const { isDirectMessage, isGroupDm, isThreadChannel, channelName, channelSlug, rawChannelId, threadParentId, threadParentName, threadParentSlug } = channelContext;
	if (policy?.isCurrent() === false) {
		await respond("Access policy changed. Try this interaction again.", { ephemeral: true });
		return { accepted: false };
	}
	const memberRoleIds = Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.map((roleId) => roleId) : [];
	const allowNameMatching = isDangerousNameMatchingEnabled(discordConfig);
	const configuredDmAllowFrom = resolveDiscordAccountAllowFrom({
		cfg,
		accountId
	}) ?? [];
	const { ownerAllowList: discordOwnerAllowList, ownerAllowed: discordOwnerOk } = resolveDiscordOwnerAccess({
		allowFrom: configuredDmAllowFrom,
		sender: {
			id: sender.id,
			name: sender.name,
			tag: sender.tag
		},
		allowNameMatching
	});
	const ownerAllowListConfigured = discordOwnerAllowList != null;
	const ownerOk = discordOwnerOk;
	const { commandsAllowFromAccess, guildInfo, channelConfig } = resolveDiscordNativeCommandChannelAccessContext({
		cfg,
		discordConfig,
		accountId,
		sender,
		isDirectMessage,
		isThreadChannel,
		guild: interaction.guild ?? null,
		rawChannelId,
		channelName,
		channelSlug,
		threadParentId,
		threadParentName,
		threadParentSlug
	});
	let nativeRouteState;
	const getNativeRouteState = () => nativeRouteState ??= nativeCommandRuntime.resolveDiscordNativeInteractionRouteState({
		cfg,
		accountId,
		guildId: interaction.guild?.id ?? void 0,
		memberRoleIds,
		isDirectMessage,
		isGroupDm,
		directUserId: user.id,
		conversationId: rawChannelId || "unknown",
		parentConversationId: threadParentId,
		threadBinding: isThreadChannel ? threadBindings.getByThreadId(rawChannelId) : void 0
	});
	const canBypassConfiguredAcpGuildGuards = () => {
		if (!interaction.guild || !shouldBypassConfiguredAcpGuildGuards(commandName)) return false;
		const routeState = getNativeRouteState();
		return routeState.effectiveRoute.matchedBy === "binding.channel" || routeState.boundSessionKey != null || routeState.configuredBinding != null;
	};
	if (channelConfig?.enabled === false && !canBypassConfiguredAcpGuildGuards()) {
		await respond("This channel is disabled.");
		return { accepted: false };
	}
	if (interaction.guild && channelConfig?.allowed === false && !canBypassConfiguredAcpGuildGuards()) {
		await respond("This channel is not allowed.");
		return { accepted: false };
	}
	if (interaction.guild) {
		const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
			providerConfigPresent: cfg.channels?.discord !== void 0,
			groupPolicy: discordConfig?.groupPolicy,
			defaultGroupPolicy: cfg.channels?.defaults?.groupPolicy
		});
		if (!resolveDiscordChannelPolicyCommandAuthorizer({
			groupPolicy,
			guildInfo,
			channelConfig
		}).allowed && !canBypassConfiguredAcpGuildGuards()) {
			await respond("This channel is not allowed.");
			return { accepted: false };
		}
	}
	if (policy?.isCurrent() === false) {
		await respond("Access policy changed. Try this interaction again.", { ephemeral: true });
		return { accepted: false };
	}
	const dmEnabled = discordConfig?.dm?.enabled ?? true;
	const dmPolicy = resolveDiscordAccountDmPolicy({
		cfg,
		accountId
	}) ?? "pairing";
	let commandAuthorized = true;
	if (isDirectMessage) {
		if (!dmEnabled || dmPolicy === "disabled") {
			await respond("Discord DMs are disabled.");
			return { accepted: false };
		}
		const dmAccess = await resolveDiscordDmCommandAccess({
			accountId,
			dmPolicy,
			configuredAllowFrom: configuredDmAllowFrom,
			sender: {
				id: sender.id,
				name: sender.name,
				tag: sender.tag
			},
			allowNameMatching,
			cfg,
			rest: interaction.client.rest
		});
		if (policy?.isCurrent() === false) {
			await respond("Access policy changed. Try this interaction again.", { ephemeral: true });
			return { accepted: false };
		}
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
	if (!groupDmAccess.allowed) {
		await respond(groupDmAccess.reason === "disabled" ? "Discord group DMs are disabled." : "This group DM is not allowed.");
		return { accepted: false };
	}
	if (!isDirectMessage) {
		commandAuthorized = await resolveDiscordGuildNativeCommandAuthorized({
			cfg,
			accountId,
			discordConfig,
			useAccessGroups,
			commandsAllowFromAccess,
			guildInfo,
			channelConfig,
			memberRoleIds,
			sender,
			allowNameMatching,
			ownerAllowListConfigured,
			ownerAllowed: ownerOk
		});
		if (!commandAuthorized && !canBypassConfiguredAcpGuildGuards()) {
			await respond("You are not authorized to use this command.", { ephemeral: true });
			return { accepted: false };
		}
	}
	if (policy?.isCurrent() === false) {
		await respond("Access policy changed. Try this interaction again.", { ephemeral: true });
		return { accepted: false };
	}
	const routeState = getNativeRouteState();
	const effectiveRoute = routeState.effectiveRoute;
	const { ctxPayload, sessionKey, commandTargetSessionKey } = await buildDiscordNativeInteractionContext({
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
		allowNameMatching,
		commandAuthorized,
		user,
		sender
	});
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, effectiveRoute.agentId);
	if (policy?.isCurrent() === false) {
		await respond("Access policy changed. Try this interaction again.", { ephemeral: true });
		return { accepted: false };
	}
	const authority = createDiscordNativeCommandAuthority({
		cfg,
		ctx: ctxPayload,
		commandAuthorized,
		sender,
		allowNameMatching,
		isPolicyCurrent: policy?.isCurrent,
		accountId,
		guildId: interaction.guild?.id,
		commandName,
		pluginCommand: params.pluginCommandDispatch.kind === "plugin"
	});
	if (!authority.isAllowed()) {
		await respond("You are not authorized to use this command.", { ephemeral: true });
		return { accepted: false };
	}
	const bindingReadiness = routeState.configuredBinding && !shouldBypassConfiguredAcpEnsure(commandName) ? await nativeCommandRuntime.ensureConfiguredBindingRouteReady({
		cfg,
		bindingResolution: routeState.configuredBinding,
		assertActive: authority.assertActive
	}) : null;
	if (!authority.isAllowed()) {
		await respond("You are not authorized to use this command.", { ephemeral: true });
		return { accepted: false };
	}
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
	const menuModelCatalog = command.key === "think" && menuNeedsModelContext ? await loadPreparedModelCatalog({
		config: cfg,
		...menuModelContext?.agentId ? {
			agentId: menuModelContext.agentId,
			agentDir: resolveAgentDir(cfg, menuModelContext.agentId)
		} : {},
		readOnly: true
	}) : void 0;
	const menu = command.key === "verbose" && bindingReadiness?.ok === false ? null : resolveCommandArgMenu({
		command,
		args: commandArgs,
		cfg,
		session: command.key === "verbose" ? effectiveRoute : void 0,
		provider: menuModelContext?.provider,
		model: menuModelContext?.model,
		agentRuntime: menuModelContext?.agentRuntime,
		catalog: menuModelCatalog
	});
	if (policy?.isCurrent() === false) {
		await respond("Access policy changed. Try this interaction again.", { ephemeral: true });
		return { accepted: false };
	}
	if (menu) {
		const menuPayload = buildDiscordCommandArgMenu({
			command,
			menu,
			interaction,
			ctx: {
				cfg,
				discordConfig,
				accountId,
				sessionPrefix,
				threadBindings,
				buildContext,
				dispatchReplyFromConfig
			},
			safeInteractionCall: safeDiscordInteractionCall,
			dispatchCommandInteraction: dispatchDiscordCommandInteraction
		});
		if (preferFollowUp) {
			await safeDiscordInteractionCall("interaction follow-up", () => interaction.followUp({
				content: menuPayload.content,
				components: menuPayload.components,
				ephemeral: true
			}));
			return { accepted: true };
		}
		await safeDiscordInteractionCall("interaction reply", () => interaction.reply({
			content: menuPayload.content,
			components: menuPayload.components,
			ephemeral: true
		}));
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
		const targetSessionEntry = nativeCommandRuntime.getSessionEntry({
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
		if (pluginReply.suppressReply === true) {
			await settleDiscordInteractionWithoutVisibleReply(interaction);
			return {
				accepted: true,
				effectiveRoute
			};
		}
		if (!hasRenderableReplyPayload(pluginReply)) {
			await respond(DISCORD_EMPTY_VISIBLE_REPLY_WARNING);
			return {
				accepted: true,
				effectiveRoute
			};
		}
		await deliverDiscordInteractionReply({
			interaction,
			payload: pluginReply,
			textLimit: resolveTextChunkLimit(cfg, "discord", accountId, { fallbackLimit: 2e3 }),
			maxLinesPerMessage: resolveDiscordMaxLinesPerMessage({
				cfg,
				discordConfig,
				accountId
			}),
			preferFollowUp,
			responseEphemeral,
			chunkMode: resolveChunkMode(cfg, "discord", accountId)
		});
		return {
			accepted: true,
			effectiveRoute
		};
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
			preferFollowUp,
			safeInteractionCall: safeDiscordInteractionCall
		});
		return { accepted: true };
	}
	if (bindingReadiness && !bindingReadiness.ok) {
		const configuredBinding = routeState.configuredBinding;
		if (configuredBinding) {
			logVerbose(`discord native command: configured ACP binding unavailable for channel ${configuredBinding.record.conversation.conversationId}: ${bindingReadiness.error}`);
			await respond("Configured ACP binding is unavailable right now. Please try again.");
			return { accepted: false };
		}
	}
	const directStatusResult = await maybeDeliverDiscordDirectStatus({
		commandName,
		suppressReplies,
		resolveDirectStatusReplyForSession: nativeCommandRuntime.resolveDirectStatusReplyForSession,
		cfg,
		discordConfig,
		accountId,
		sessionKey,
		commandTargetSessionKey,
		channel: "discord",
		senderId: sender.id,
		senderIsOwner: authority.senderIsOwner(),
		isAuthorizedSender: commandAuthorized,
		isGroup: isGuild || isGroupDm,
		defaultGroupActivation: () => !isGuild ? "always" : channelConfig?.requireMention === false ? "always" : "mention",
		interaction,
		mediaLocalRoots,
		preferFollowUp,
		responseEphemeral,
		effectiveRoute,
		respond
	});
	if (directStatusResult) return directStatusResult;
	const { dispatched, hiddenFinalReply } = await dispatchDiscordNativeAgentReply({
		cfg,
		discordConfig,
		accountId,
		interaction,
		ctxPayload,
		effectiveRoute,
		channelConfig,
		mediaLocalRoots,
		preferFollowUp,
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
function createDiscordCommandArgFallbackButton(params) {
	return createDiscordCommandArgFallbackButton$1({
		ctx: {
			...params,
			readPolicy: resolveDiscordNativePolicyReader(params)
		},
		safeInteractionCall: safeDiscordInteractionCall,
		dispatchCommandInteraction: dispatchDiscordCommandInteraction
	});
}
function createDiscordModelPickerFallbackButton(params) {
	return createDiscordModelPickerFallbackButton$1({
		ctx: {
			...params,
			readPolicy: resolveDiscordNativePolicyReader(params)
		},
		safeInteractionCall: safeDiscordInteractionCall,
		dispatchCommandInteraction: dispatchDiscordCommandInteraction
	});
}
function createDiscordModelPickerFallbackSelect(params) {
	return createDiscordModelPickerFallbackSelect$1({
		ctx: {
			...params,
			readPolicy: resolveDiscordNativePolicyReader(params)
		},
		safeInteractionCall: safeDiscordInteractionCall,
		dispatchCommandInteraction: dispatchDiscordCommandInteraction
	});
}
//#endregion
//#region extensions/discord/src/internal/gateway-close-codes.ts
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
//#endregion
//#region extensions/discord/src/internal/gateway-identify-limiter.ts
const IDENTIFY_WINDOW_MS = 5e3;
function normalizeMaxConcurrency(value) {
	const parsed = parseFiniteNumber(value);
	return parsed === void 0 ? 1 : Math.max(1, Math.floor(parsed));
}
var GatewayIdentifyLimiter = class {
	constructor() {
		this.stateByKey = /* @__PURE__ */ new Map();
	}
	async wait(params) {
		const maxConcurrency = normalizeMaxConcurrency(params.maxConcurrency);
		const rateKey = (params.shardId ?? 0) % maxConcurrency;
		const now = Date.now();
		const state = this.stateByKey.get(rateKey);
		const clockMovedBackward = state !== void 0 && now < state.lastObservedAt;
		const nextAllowedAt = state === void 0 ? now : clockMovedBackward ? now + IDENTIFY_WINDOW_MS : state.nextAllowedAt;
		const waitMs = Math.max(0, nextAllowedAt - now);
		this.stateByKey.set(rateKey, {
			lastObservedAt: now,
			nextAllowedAt: Math.max(now, nextAllowedAt) + IDENTIFY_WINDOW_MS
		});
		if (waitMs > 0) await new Promise((resolve) => {
			setTimeout(resolve, waitMs).unref?.();
		});
	}
	reset() {
		this.stateByKey.clear();
	}
};
const sharedGatewayIdentifyLimiter = new GatewayIdentifyLimiter();
//#endregion
//#region extensions/discord/src/internal/gateway-lifecycle.ts
var GatewayHeartbeatTimers = class {
	scheduleHeartbeatCycle(params) {
		this.heartbeatInterval = setTimeout(() => {
			this.heartbeatInterval = void 0;
			if (!params.isAcked()) {
				params.onAckTimeout();
				return;
			}
			params.onHeartbeat();
			this.scheduleHeartbeatCycle(params);
		}, params.intervalMs);
		this.heartbeatInterval.unref?.();
	}
	start(params) {
		this.stop();
		const random = params.random ?? Math.random;
		this.firstHeartbeatTimeout = setTimeout(() => {
			this.firstHeartbeatTimeout = void 0;
			params.onHeartbeat();
			this.scheduleHeartbeatCycle(params);
		}, Math.max(0, params.intervalMs * random()));
		this.firstHeartbeatTimeout.unref?.();
	}
	stop() {
		if (this.heartbeatInterval) {
			clearTimeout(this.heartbeatInterval);
			this.heartbeatInterval = void 0;
		}
		if (this.firstHeartbeatTimeout) {
			clearTimeout(this.firstHeartbeatTimeout);
			this.firstHeartbeatTimeout = void 0;
		}
	}
};
var GatewayReconnectTimer = class {
	stop() {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = void 0;
		}
	}
	schedule(delayMs, callback) {
		this.stop();
		this.timeout = setTimeout(() => {
			this.timeout = void 0;
			callback();
		}, delayMs);
		this.timeout.unref?.();
	}
};
//#endregion
//#region extensions/discord/src/internal/gateway-payload.ts
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
//#endregion
//#region extensions/discord/src/internal/gateway-rate-limit.ts
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
		if (options?.critical || this.canSend(Date.now())) {
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
		this.outboundQueue.push({ payload: serialized });
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
	getStatus() {
		const now = Date.now();
		this.pruneWindow(now);
		const oldest = this.outboundSendTimestamps[0] ?? now;
		return {
			remainingEvents: Math.max(0, GATEWAY_SEND_LIMIT - this.outboundSendTimestamps.length),
			resetTime: this.outboundSendTimestamps.length > 0 ? oldest + GATEWAY_SEND_WINDOW_MS : now + GATEWAY_SEND_WINDOW_MS,
			currentEventCount: this.outboundSendTimestamps.length,
			queuedEvents: this.outboundQueue.length,
			droppedEvents: this.droppedEvents
		};
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
		this.outboundFlushTimer.unref?.();
	}
	flush() {
		while (this.outboundQueue.length > 0 && this.canSend(Date.now())) {
			const queued = this.outboundQueue.shift();
			if (!queued) continue;
			try {
				this.sendSerialized(queued.payload);
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
//#endregion
//#region extensions/discord/src/internal/gateway-voice-state-cache.ts
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
		for (const state of states.values()) if (state.channel_id === channelId) result.push({ ...state });
		return result;
	}
	takeTransition(state) {
		const transition = this.transitionsByState.get(state);
		if (!transition) return null;
		this.transitionsByState.delete(state);
		return {
			current: { ...transition.current },
			...transition.previous ? { previous: { ...transition.previous } } : {}
		};
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
				...previous ? { previous: { ...previous } } : {}
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
//#endregion
//#region extensions/discord/src/internal/ws-runtime.ts
const require = createRequire(import.meta.url);
const WebSocket = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
//#region extensions/discord/src/internal/gateway.ts
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
var GatewayPlugin = class extends Plugin {
	constructor(options, gatewayInfo) {
		super();
		this.id = "gateway";
		this.ws = null;
		this.sequence = null;
		this.lastHeartbeatAck = true;
		this.emitter = new EventEmitter();
		this.isConnected = false;
		this.sessionId = null;
		this.resumeGatewayUrl = null;
		this.reconnectAttempts = 0;
		this.consecutiveResumeFailures = 0;
		this.shouldReconnect = false;
		this.isConnecting = false;
		this.heartbeatTimers = new GatewayHeartbeatTimers();
		this.reconnectTimer = new GatewayReconnectTimer();
		this.voiceStateCache = new DiscordGatewayVoiceStateCache();
		this.outboundLimiter = new GatewaySendLimiter((payload) => this.sendSerializedGatewayEvent(payload), (error) => this.emitter.emit("error", error), (warning) => this.emitter.emit("warning", `Gateway outbound queue overflow policy=${warning.policy} droppedEvents=${warning.droppedEvents} queuedEvents=${warning.queuedEvents} maxQueuedEvents=${warning.maxQueuedEvents}`));
		this.options = {
			...options,
			reconnect: {
				maxAttempts: 50,
				...options.reconnect
			},
			autoInteractions: options.autoInteractions ?? true,
			intents: options.intents ?? 0
		};
		this.gatewayInfo = gatewayInfo;
	}
	get ping() {
		return null;
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
	get heartbeatInterval() {
		return this.heartbeatTimers.heartbeatInterval;
	}
	set heartbeatInterval(timer) {
		this.heartbeatTimers.heartbeatInterval = timer;
	}
	get firstHeartbeatTimeout() {
		return this.heartbeatTimers.firstHeartbeatTimeout;
	}
	set firstHeartbeatTimeout(timer) {
		this.heartbeatTimers.firstHeartbeatTimeout = timer;
	}
	async registerClient(client) {
		this.client = client;
		if (this.options.shard) {
			client.shardId = this.options.shard[0];
			client.totalShards = this.options.shard[1];
			this.shardId = this.options.shard[0];
			this.totalShards = this.options.shard[1];
		}
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
		this.setupWebSocket(resume);
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
	}
	createWebSocket(url) {
		return new WebSocket(url, DISCORD_GATEWAY_WS_CLIENT_OPTIONS);
	}
	setupWebSocket(resume) {
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
			this.handlePayload(payload, resume, socket);
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
	handlePayload(payload, resume, sourceSocket) {
		if (payload.s !== null && payload.s !== void 0) this.sequence = payload.s;
		switch (payload.op) {
			case GatewayOpcodes.Hello: {
				this.startHeartbeat(asSafeIntegerInRange(asOptionalRecord(payload.d)?.heartbeat_interval, {
					min: 1,
					max: MAX_TIMER_TIMEOUT_MS
				}) ?? 45e3);
				const resumeState = resume ? this.getResumeState() : null;
				if (resumeState) this.send({
					op: GatewayOpcodes.Resume,
					d: {
						token: this.client?.options.token ?? "",
						session_id: resumeState.sessionId,
						seq: resumeState.sequence
					}
				}, true);
				else this.identifyWithConcurrency(sourceSocket).catch((error) => {
					this.emitter.emit("error", error instanceof Error ? error : new Error(String(error), { cause: error }));
				});
				break;
			}
			case GatewayOpcodes.HeartbeatAck:
				this.lastHeartbeatAck = true;
				break;
			case GatewayOpcodes.Heartbeat:
				this.sendHeartbeat();
				break;
			case GatewayOpcodes.Dispatch:
				this.handleDispatch(payload).catch((error) => {
					this.emitter.emit("error", error instanceof Error ? error : new Error(String(error), { cause: error }));
				});
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
	}
	startHeartbeat(intervalMs) {
		this.heartbeatTimers.start({
			intervalMs,
			isAcked: () => this.lastHeartbeatAck,
			onHeartbeat: () => this.sendHeartbeat(),
			onAckTimeout: () => {
				this.emitter.emit("error", /* @__PURE__ */ new Error("Gateway heartbeat ACK timeout"));
				this.scheduleReconnect({
					reason: "zombie",
					preferResume: true
				});
			}
		});
	}
	stopHeartbeat() {
		this.heartbeatTimers.stop();
	}
	stopReconnectTimer() {
		this.reconnectTimer.stop();
	}
	sendHeartbeat() {
		if (!this.ws || this.ws.readyState !== READY_STATE_OPEN) return;
		this.lastHeartbeatAck = false;
		this.send({
			op: GatewayOpcodes.Heartbeat,
			d: this.sequence
		}, true);
	}
	identify() {
		this.send({
			op: GatewayOpcodes.Identify,
			d: {
				token: this.client?.options.token ?? "",
				intents: this.options.intents ?? 0,
				properties: {
					os: process.platform,
					browser: "openclaw",
					device: "openclaw"
				},
				shard: this.options.shard
			}
		}, true);
	}
	async identifyWithConcurrency(sourceSocket) {
		await sharedGatewayIdentifyLimiter.wait({
			shardId: this.shardId,
			maxConcurrency: this.gatewayInfo?.session_start_limit.max_concurrency
		});
		const socket = sourceSocket ?? this.ws;
		if (!socket || socket !== this.ws) return;
		if (socket.readyState !== READY_STATE_OPEN) {
			this.scheduleReconnect({
				reason: "identify",
				preferResume: false
			});
			return;
		}
		this.identify();
	}
	send(payload, skipRateLimit = false) {
		if (!this.ws || this.ws.readyState !== READY_STATE_OPEN) throw new Error("Discord gateway socket is not open");
		const serialized = JSON.stringify(payload);
		if ((typeof Buffer !== "undefined" ? Buffer.byteLength(serialized, "utf8") : new TextEncoder().encode(serialized).byteLength) > DISCORD_GATEWAY_PAYLOAD_LIMIT_BYTES) throw new Error(`Discord gateway payload exceeds ${DISCORD_GATEWAY_PAYLOAD_LIMIT_BYTES}-byte limit`);
		this.outboundLimiter.send(serialized, { critical: skipRateLimit });
	}
	sendSerializedGatewayEvent(serialized) {
		if (!this.ws || this.ws.readyState !== READY_STATE_OPEN) throw new Error("Discord gateway socket is not open");
		this.ws.send(serialized);
	}
	async handleDispatch(payload) {
		if (!this.client || !payload.t) return;
		if (payload.t === GatewayDispatchEvents.Ready) {
			const ready = payload.d;
			this.sessionId = ready.session_id ?? null;
			this.resumeGatewayUrl = ready.resume_gateway_url ?? null;
			this.reconnectAttempts = 0;
			this.consecutiveResumeFailures = 0;
			this.isConnected = true;
		}
		if (payload.t === GatewayDispatchEvents.Resumed) {
			this.reconnectAttempts = 0;
			this.consecutiveResumeFailures = 0;
			this.isConnected = true;
		}
		this.voiceStateCache.apply(payload);
		dispatchVoiceGatewayEvent(this.client, payload.t, payload.d);
		const data = payload.t === GatewayDispatchEvents.MessageCreate ? payload.d : mapGatewayDispatchData(this.client, payload.t, payload.d);
		await this.client.dispatchGatewayEvent(payload.t, data);
		if (payload.t === GatewayDispatchEvents.InteractionCreate && this.options.autoInteractions) await this.client.handleInteraction(payload.d);
	}
	resetSessionState() {
		this.sessionId = null;
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
		if (this.reconnectAttempts > (this.options.reconnect?.maxAttempts ?? 50)) {
			const maxAttempts = this.options.reconnect?.maxAttempts ?? 50;
			this.emitter.emit("error", /* @__PURE__ */ new Error(`Max reconnect attempts (${maxAttempts}) reached${options.closeCode !== void 0 ? ` after close code ${options.closeCode}` : ""}`));
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
		this.reconnectTimer.schedule(delay, () => {
			this.connect(shouldResume);
		});
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
	requestGuildMembers(data) {
		if (!this.hasIntent(GatewayIntentBits.GuildMembers)) throw new Error("GUILD_MEMBERS intent is required for requestGuildMembers");
		if (data.presences && !this.hasIntent(GatewayIntentBits.GuildPresences)) throw new Error("GUILD_PRESENCES intent is required when requesting presences");
		if (!data.query && data.query !== "" && !data.user_ids) throw new Error("Either query or user_ids is required for requestGuildMembers");
		this.send({
			op: GatewayOpcodes.RequestGuildMembers,
			d: data
		});
	}
	getRateLimitStatus() {
		return this.outboundLimiter.getStatus();
	}
	hasIntent(intent) {
		return Boolean((this.options.intents ?? 0) & intent);
	}
};
//#endregion
//#region extensions/discord/src/monitor/presence.ts
const DEFAULT_CUSTOM_ACTIVITY_TYPE$1 = 4;
const CUSTOM_STATUS_NAME$1 = "Custom Status";
function resolveDiscordPresenceUpdate(config) {
	const activityText = normalizeOptionalString(config.activity) ?? "";
	const status = normalizeOptionalString(config.status) ?? "";
	const activityType = config.activityType;
	const activityUrl = normalizeOptionalString(config.activityUrl) ?? "";
	const hasActivity = Boolean(activityText);
	if (!hasActivity && !Boolean(status)) return {
		since: null,
		activities: [],
		status: "online",
		afk: false
	};
	const activities = [];
	if (hasActivity) {
		const resolvedType = activityType ?? DEFAULT_CUSTOM_ACTIVITY_TYPE$1;
		const activity = resolvedType === DEFAULT_CUSTOM_ACTIVITY_TYPE$1 ? {
			name: CUSTOM_STATUS_NAME$1,
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
//#endregion
//#region extensions/discord/src/monitor/auto-presence.ts
const DEFAULT_CUSTOM_ACTIVITY_TYPE = 4;
const CUSTOM_STATUS_NAME = "Custom Status";
const DEFAULT_INTERVAL_MS = 3e4;
const DEFAULT_MIN_UPDATE_INTERVAL_MS = 15e3;
const MIN_INTERVAL_MS = 5e3;
const MIN_UPDATE_INTERVAL_MS = 1e3;
function clampPositiveInt(value, fallback, minValue) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const rounded = Math.round(value);
	if (rounded <= 0) return fallback;
	return Math.max(minValue, rounded);
}
function resolveAutoPresenceConfig(config) {
	const intervalMs = clampPositiveInt(config?.intervalMs, DEFAULT_INTERVAL_MS, MIN_INTERVAL_MS);
	const minUpdateIntervalMs = clampPositiveInt(config?.minUpdateIntervalMs, DEFAULT_MIN_UPDATE_INTERVAL_MS, MIN_UPDATE_INTERVAL_MS);
	return {
		enabled: config?.enabled === true,
		intervalMs,
		minUpdateIntervalMs
	};
}
function buildCustomStatusActivity(text) {
	return {
		name: CUSTOM_STATUS_NAME,
		type: DEFAULT_CUSTOM_ACTIVITY_TYPE,
		state: text
	};
}
function isExhaustedUnavailableReason(reason) {
	if (!reason) return false;
	return reason === "rate_limit" || reason === "overloaded" || reason === "billing" || reason === "auth" || reason === "auth_permanent";
}
function resolveAuthAvailability(params) {
	const profileIds = Object.keys(params.store.profiles);
	if (profileIds.length === 0) return "degraded";
	clearExpiredCooldowns(params.store, params.now);
	if (profileIds.some((profileId) => !isProfileInCooldown(params.store, profileId, params.now))) return "healthy";
	return isExhaustedUnavailableReason(resolveProfilesUnavailableReason({
		store: params.store,
		profileIds,
		now: params.now
	})) ? "exhausted" : "degraded";
}
function resolvePresenceActivities(params) {
	if (params.state === "healthy") return params.basePresence?.activities ?? [];
	return [buildCustomStatusActivity(params.state === "degraded" ? "runtime degraded" : "token exhausted")];
}
function resolvePresenceStatus(state) {
	if (state === "healthy") return "online";
	if (state === "exhausted") return "dnd";
	return "idle";
}
function resolveDiscordAutoPresenceUpdate(params) {
	if (!resolveAutoPresenceConfig(params.discordConfig.autoPresence).enabled) return null;
	const now = params.now ?? Date.now();
	const basePresence = resolveDiscordPresenceUpdate(params.discordConfig);
	const availability = resolveAuthAvailability({
		store: params.authStore,
		now
	});
	const state = params.gatewayConnected ? availability : "degraded";
	return {
		since: null,
		activities: resolvePresenceActivities({
			state,
			basePresence
		}),
		status: resolvePresenceStatus(state),
		afk: false
	};
}
function stablePresenceSignature(payload) {
	return JSON.stringify({
		status: payload.status,
		afk: payload.afk,
		since: payload.since,
		activities: payload.activities.map((activity) => ({
			type: activity.type,
			name: activity.name,
			state: activity.state,
			url: activity.url
		}))
	});
}
function createDiscordAutoPresenceController(params) {
	const autoCfg = resolveAutoPresenceConfig(params.discordConfig.autoPresence);
	if (!autoCfg.enabled) return {
		enabled: false,
		start: () => void 0,
		stop: () => void 0,
		refresh: () => void 0,
		runNow: () => void 0
	};
	const loadAuthStore = params.loadAuthStore ?? (() => ensureAuthProfileStore());
	const now = params.now ?? (() => Date.now());
	let timer;
	let lastAppliedSignature = null;
	let lastAppliedAt = 0;
	const runEvaluation = (options) => {
		let presence;
		try {
			presence = resolveDiscordAutoPresenceUpdate({
				discordConfig: params.discordConfig,
				authStore: loadAuthStore(),
				gatewayConnected: params.gateway.isConnected,
				now: now()
			});
		} catch (err) {
			params.log?.(warn(`discord: auto-presence evaluation failed for account ${params.accountId}: ${String(err)}`));
			return;
		}
		if (!presence || !params.gateway.isConnected) return;
		const forceApply = options?.force === true;
		const ts = now();
		const signature = stablePresenceSignature(presence);
		if (!forceApply && signature === lastAppliedSignature) return;
		if (!forceApply && lastAppliedAt > 0 && ts - lastAppliedAt < autoCfg.minUpdateIntervalMs) return;
		params.gateway.updatePresence(presence);
		lastAppliedSignature = signature;
		lastAppliedAt = ts;
	};
	return {
		enabled: true,
		runNow: () => runEvaluation(),
		refresh: () => runEvaluation({ force: true }),
		start: () => {
			if (timer) return;
			runEvaluation({ force: true });
			timer = setInterval(() => runEvaluation(), autoCfg.intervalMs);
		},
		stop: () => {
			if (!timer) return;
			clearInterval(timer);
			timer = void 0;
		}
	};
}
//#endregion
//#region extensions/discord/src/monitor/gateway-handle.ts
const DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT = "openclaw:discord-gateway-transport-activity";
//#endregion
//#region extensions/discord/src/monitor/gateway-metadata.ts
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
function resolveFetchInputUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	return input.url;
}
async function materializeGuardedResponse(response) {
	const body = new Uint8Array(await readResponseWithLimit(response, DISCORD_GATEWAY_METADATA_MAX_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Discord gateway metadata response body too large: ${size} bytes (limit: ${maxBytes} bytes)`) }));
	return new Response(body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function normalizeGatewayInfoTimeoutMs(value) {
	const numeric = parseStrictPositiveInteger(value);
	if (numeric === void 0) return;
	return Math.min(numeric, MAX_DISCORD_GATEWAY_INFO_TIMEOUT_MS);
}
function resolveDiscordGatewayInfoTimeoutMs(params) {
	return normalizeGatewayInfoTimeoutMs(params?.env?.[DISCORD_GATEWAY_INFO_TIMEOUT_ENV]) ?? DEFAULT_DISCORD_GATEWAY_INFO_TIMEOUT_MS;
}
function summarizeGatewayResponseBody(body) {
	return summarizeDiscordResponseBody(body, { emptyText: "<empty>" }) ?? "<empty>";
}
function isDiscordGatewayRateLimitResponse(status, body) {
	return status === 429 && isDiscordRateLimitResponseBody(body);
}
function isTransientDiscordGatewayResponse(status, body) {
	if (status >= 500) return true;
	if (isDiscordGatewayRateLimitResponse(status, body)) return true;
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
function isTransientGatewayMetadataError(error) {
	return Boolean(error?.transient);
}
function createDefaultGatewayInfo() {
	return {
		url: DEFAULT_DISCORD_GATEWAY_URL,
		shards: 1,
		session_start_limit: {
			total: 1,
			remaining: 1,
			reset_after: 0,
			max_concurrency: 1
		}
	};
}
function summarizeGatewaySchemaErrors(value) {
	const errors = Errors(discordGatewayBotInfoSchema, value);
	if (errors.length === 0) return "unknown schema mismatch";
	return errors.slice(0, 3).map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
}
function parseDiscordGatewayInfoBody(body) {
	const parsed = JSON.parse(body);
	if (!Check(discordGatewayBotInfoSchema, parsed)) throw new Error(summarizeGatewaySchemaErrors(parsed));
	return parsed;
}
async function fetchDiscordGatewayInfo(params) {
	let response;
	try {
		response = await params.fetchImpl(params.gatewayBotUrl ?? DISCORD_GATEWAY_BOT_URL, {
			...params.fetchInit,
			headers: {
				...params.fetchInit?.headers,
				Authorization: `Bot ${params.token}`
			}
		});
	} catch (error) {
		throw createGatewayMetadataError({
			detail: formatErrorMessage$1(error),
			transient: true,
			cause: error
		});
	}
	let body;
	try {
		body = await response.text();
	} catch (error) {
		throw createGatewayMetadataError({
			detail: formatErrorMessage$1(error),
			transient: true,
			cause: error
		});
	}
	const summary = summarizeGatewayResponseBody(body);
	const transient = isTransientDiscordGatewayResponse(response.status, body);
	if (!response.ok) throw createGatewayMetadataError({
		detail: `Discord API /gateway/bot failed (${response.status}): ${summary}`,
		transient
	});
	try {
		return parseDiscordGatewayInfoBody(body);
	} catch (error) {
		throw createGatewayMetadataError({
			detail: `Discord API /gateway/bot returned invalid metadata: ${formatErrorMessage$1(error)} (${summary})`,
			transient,
			cause: error
		});
	}
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
		run: async (signal) => await fetchDiscordGatewayInfo({
			token: params.token,
			gatewayBotUrl: params.gatewayBotUrl,
			fetchImpl: params.fetchImpl,
			fetchInit: {
				...params.fetchInit,
				signal
			}
		})
	});
}
function resolveGatewayInfoWithFallback(params) {
	if (!isTransientGatewayMetadataError(params.error)) throw params.error;
	const message = formatErrorMessage$1(params.error);
	const now = Date.now();
	if (params.runtime) {
		const previous = gatewayMetadataFallbackLogLastAt.get(params.runtime);
		if (previous === void 0 || now - previous >= DISCORD_GATEWAY_METADATA_FALLBACK_LOG_INTERVAL_MS) {
			params.runtime.log?.(`discord: gateway metadata lookup failed transiently; using default gateway url (${message})`);
			gatewayMetadataFallbackLogLastAt.set(params.runtime, now);
		}
	}
	return {
		info: createDefaultGatewayInfo(),
		usedFallback: true
	};
}
async function fetchDiscordGatewayMetadataGuarded(input, init, options) {
	const requestInit = init;
	const signal = requestInit?.signal ?? void 0;
	const guarded = await fetchWithSsrFGuard({
		url: resolveFetchInputUrl(input),
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
		response = await materializeGuardedResponse(guarded.response);
	} finally {
		await guarded.release();
	}
	if (options?.capture) captureHttpExchange({
		url: input,
		method: init?.method ?? "GET",
		requestHeaders: init?.headers,
		requestBody: init?.body ?? null,
		response,
		flowId: options.capture.flowId,
		meta: options.capture.meta
	});
	return response;
}
//#endregion
//#region extensions/discord/src/monitor/gateway-plugin.ts
const DISCORD_GATEWAY_POLICY_VIOLATION_CLOSE_CODE = 1008;
const DISCORD_GATEWAY_WS_RECEIVER_LIMIT_CODE = "WS_ERR_TOO_MANY_BUFFERED_PARTS";
const DISCORD_GATEWAY_CLOSE_REASON_LOG_MAX_CHARS = 240;
const discordDnsLookup = createDiscordDnsLookup();
const registrationPromises = /* @__PURE__ */ new WeakMap();
function assignGatewayClient(plugin, client) {
	plugin.client = client;
}
function hasGatewaySocketStarted(plugin) {
	const state = plugin;
	return state.ws != null || state.isConnecting === true;
}
function readStringProperty(value, key) {
	const property = value[key];
	return typeof property === "string" && property ? property : void 0;
}
function readNumberProperty(value, key) {
	return asFiniteNumber(value[key]);
}
function describeDiscordGatewayTransportError(error) {
	const code = readStringProperty(error, "code");
	const closeCode = readNumberProperty(error, "closeCode");
	const statusCode = readNumberProperty(error, "statusCode");
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
	if (text.length <= DISCORD_GATEWAY_CLOSE_REASON_LOG_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, DISCORD_GATEWAY_CLOSE_REASON_LOG_MAX_CHARS)}...`;
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
function formatDiscordGatewayTransportCloseLog(params) {
	const receiverLimit = params.code === DISCORD_GATEWAY_POLICY_VIOLATION_CLOSE_CODE || params.lastError?.code === DISCORD_GATEWAY_WS_RECEIVER_LIMIT_CODE;
	return `discord: gateway websocket closed ${[
		`flow=${params.flowId}`,
		`code=${params.code}`,
		`reasonBytes=${params.reason.length}`,
		`reason=${formatDiscordGatewayCloseReason(params.reason)}`,
		params.lastError?.code ? `lastErrorCode=${params.lastError.code}` : void 0,
		params.lastError?.message ? `lastError=${params.lastError.message}` : void 0,
		receiverLimit ? "hint=possible ws receiver buffered-parts limit" : void 0
	].filter(Boolean).join(" ")}`;
}
function shouldLogDiscordGatewayTransportClose(params) {
	return params.code === DISCORD_GATEWAY_POLICY_VIOLATION_CLOSE_CODE || params.code !== 1e3 && params.code !== 1001 || params.reason.length > 0 || params.lastError !== void 0;
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
function createGatewayPlugin(params) {
	class OpenClawGatewayPlugin extends GatewayPlugin {
		constructor() {
			super(params.options);
			this.gatewayInfoUsedFallback = false;
		}
		registerClient(client) {
			const registration = this.registerClientInternal(client);
			registration.catch(() => {});
			registrationPromises.set(this, registration);
			return registration;
		}
		async registerClientInternal(client) {
			assignGatewayClient(this, client);
			if (!this.gatewayInfo || this.gatewayInfoUsedFallback) {
				const resolved = await fetchDiscordGatewayInfoWithTimeout({
					token: client.options.token,
					...params.endpoint ? { gatewayBotUrl: params.endpoint.gatewayBotUrl } : {},
					fetchImpl: params.fetchImpl,
					fetchInit: params.fetchInit,
					timeoutMs: params.gatewayInfoTimeoutMs
				}).then((info) => ({
					info,
					usedFallback: false
				})).catch((error) => {
					if (params.endpoint) throw error;
					return resolveGatewayInfoWithFallback({
						runtime: params.runtime,
						error
					});
				});
				this.gatewayInfo = resolved.info;
				this.gatewayInfoUsedFallback = resolved.usedFallback;
			}
			if (params.testing?.registerClient) {
				await params.testing.registerClient(this, client);
				return;
			}
			if (hasGatewaySocketStarted(this)) return;
			return super.registerClient(client);
		}
		createWebSocket(url) {
			if (!url) throw new Error("Gateway URL is required");
			assertDiscordEndpointGatewayUrl(url, params.endpoint?.gatewayOrigin);
			const wsFlowId = randomUUID();
			const socket = new ((params.testing?.webSocketCtor) ?? WebSocket)(url, {
				...DISCORD_GATEWAY_WS_CLIENT_OPTIONS,
				...params.wsAgent ? { agent: params.wsAgent } : {}
			});
			let lastTransportError;
			const emitTransportActivity = () => {
				if (this.ws !== socket) return;
				this.emitter.emit(DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT, { at: Date.now() });
			};
			captureWsEvent({
				url,
				direction: "local",
				kind: "ws-open",
				flowId: wsFlowId,
				meta: { subsystem: "discord-gateway" }
			});
			socket.on?.("message", (data) => {
				emitTransportActivity();
				captureWsEvent({
					url,
					direction: "inbound",
					kind: "ws-frame",
					flowId: wsFlowId,
					payload: Buffer.isBuffer(data) ? data : Buffer.from(String(data)),
					meta: { subsystem: "discord-gateway" }
				});
			});
			socket.on?.("close", (code, reason) => {
				const closeReason = Buffer.isBuffer(reason) ? reason : Buffer.from(String(reason ?? ""));
				captureWsEvent({
					url,
					direction: "local",
					kind: "ws-close",
					flowId: wsFlowId,
					closeCode: code,
					payload: closeReason,
					meta: { subsystem: "discord-gateway" }
				});
				if (shouldLogDiscordGatewayTransportClose({
					code,
					reason: closeReason,
					lastError: lastTransportError
				})) params.runtime?.log?.(warn(formatDiscordGatewayTransportCloseLog({
					flowId: wsFlowId,
					code,
					reason: closeReason,
					lastError: lastTransportError
				})));
			});
			socket.on?.("error", (error) => {
				lastTransportError = describeDiscordGatewayTransportError(error);
				captureWsEvent({
					url,
					direction: "local",
					kind: "error",
					flowId: wsFlowId,
					errorText: error.message,
					meta: { subsystem: "discord-gateway" }
				});
				params.runtime?.log?.(warn(formatDiscordGatewayTransportErrorLog({
					flowId: wsFlowId,
					error: lastTransportError
				})));
			});
			if ("binaryType" in socket) try {
				socket.binaryType = "arraybuffer";
			} catch {}
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
	let wsAgent = endpointGatewayUrl?.protocol === "ws:" ? void 0 : new Agent$1({ lookup: endpointGatewayUrl ? createDiscordEndpointDnsLookup(endpointGatewayUrl.hostname) : discordDnsLookup });
	if (proxy && !endpoint) try {
		validateDiscordProxyUrl(proxy);
		wsAgent = params.testing?.createProxyAgent?.(proxy) ?? createNodeProxyAgent({
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
	return createGatewayPlugin({
		options: {
			reconnect: { maxAttempts: 50 },
			intents,
			autoInteractions: false
		},
		gatewayInfoTimeoutMs,
		...endpoint ? { endpoint } : {},
		fetchImpl,
		runtime: params.runtime,
		testing: params.testing,
		...wsAgent ? { wsAgent } : {}
	});
}
//#endregion
//#region extensions/discord/src/monitor/gateway-supervisor.ts
var DiscordGatewayLifecycleError = class extends Error {
	constructor(event) {
		super(`discord gateway ${event.type}: ${event.message}`, { cause: event.err instanceof Error ? event.err : void 0 });
		this.name = "DiscordGatewayLifecycleError";
		this.eventType = event.type;
	}
};
function getDiscordGatewayEmitter(gateway) {
	return gateway?.emitter;
}
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
	const seenMessages = /* @__PURE__ */ new Set();
	const guard = (err) => {
		const message = formatDiscordGatewayErrorMessage(err);
		if (seenMessages.has(message)) return;
		seenMessages.add(message);
		discordGatewayLog.error(`suppressed late gateway error after dispose: ${message}`);
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
	if (!(err instanceof Error)) return formatErrorMessage(err);
	if (err.message) {
		const detail = formatErrorMessage(err);
		return err.name ? `${err.name}: ${detail}` : detail;
	}
	const detail = formatErrorMessage(err);
	const firstFrame = readFirstStackFrame(err);
	if (firstFrame && detail === (err.name || "Error")) return `${detail} @ ${firstFrame}`;
	return detail;
}
function classifyDiscordGatewayEvent(params) {
	const message = formatDiscordGatewayErrorMessage(params.err);
	if (params.isDisallowedIntentsError(params.err)) return {
		type: "disallowed-intents",
		err: params.err,
		message,
		shouldStopLifecycle: true
	};
	if (message.includes("Max reconnect attempts")) return {
		type: "reconnect-exhausted",
		err: params.err,
		message,
		shouldStopLifecycle: true
	};
	if (params.err instanceof TypeError || message.includes("Fatal Gateway error") || message.includes("Fatal gateway close code") || message.includes("Gateway HELLO missing heartbeat") || message.includes("Invalid gateway payload") || message.includes("Gateway socket emitted an unknown error")) return {
		type: "fatal",
		err: params.err,
		message,
		shouldStopLifecycle: true
	};
	return {
		type: "other",
		err: params.err,
		message,
		shouldStopLifecycle: false
	};
}
function createDiscordGatewaySupervisor(params) {
	const emitter = getDiscordGatewayEmitter(params.gateway);
	const pending = [];
	if (!emitter) return {
		attachLifecycle: () => {},
		detachLifecycle: () => {},
		drainPending: () => "continue",
		dispose: () => {},
		emitter
	};
	let lifecycleHandler;
	let phase = "buffering";
	const seenLateEventKeys = /* @__PURE__ */ new Set();
	const logLateEvent = (state) => (event) => {
		const key = `${state}:${event.type}:${event.message}`;
		if (seenLateEventKeys.has(key)) return;
		seenLateEventKeys.add(key);
		params.runtime.error?.(danger(`discord: suppressed late gateway ${event.type} error ${state === "disposed" ? "after dispose" : "during teardown"}: ${event.message}`));
	};
	const onGatewayError = (err) => {
		const event = classifyDiscordGatewayEvent({
			err,
			isDisallowedIntentsError: params.isDisallowedIntentsError
		});
		switch (phase) {
			case "disposed":
				logLateEvent("disposed")(event);
				return;
			case "active":
				lifecycleHandler?.(event);
				return;
			case "teardown":
				logLateEvent("teardown")(event);
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
			if (pending.length === 0) return "continue";
			const queued = [...pending];
			pending.length = 0;
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
//#endregion
//#region extensions/discord/src/gateway-logging.ts
const INFO_DEBUG_MARKERS = [
	"Gateway websocket closed",
	"Gateway reconnect scheduled in",
	"Gateway forcing fresh IDENTIFY after"
];
const shouldPromoteGatewayDebug = (message) => INFO_DEBUG_MARKERS.some((marker) => message.includes(marker));
const formatGatewayMetrics = (metrics) => {
	if (metrics === null || metrics === void 0) return String(metrics);
	if (typeof metrics === "string") return metrics;
	if (typeof metrics === "number" || typeof metrics === "boolean" || typeof metrics === "bigint") return String(metrics);
	try {
		return JSON.stringify(metrics);
	} catch {
		return "[unserializable metrics]";
	}
};
function attachDiscordGatewayLogging(params) {
	const { emitter, runtime } = params;
	if (!emitter) return () => {};
	const onGatewayDebug = (msg) => {
		const message = String(msg);
		logVerbose(`discord gateway: ${message}`);
		if (shouldPromoteGatewayDebug(message)) runtime.log?.(`discord gateway: ${message}`);
	};
	const onGatewayWarning = (warning) => {
		const message = `discord gateway warning: ${String(warning)}`;
		logVerbose(message);
		runtime.log?.(warn(message));
	};
	const onGatewayMetrics = (metrics) => {
		logVerbose(`discord gateway metrics: ${formatGatewayMetrics(metrics)}`);
	};
	emitter.on("debug", onGatewayDebug);
	emitter.on("warning", onGatewayWarning);
	emitter.on("metrics", onGatewayMetrics);
	return () => {
		emitter.removeListener("debug", onGatewayDebug);
		emitter.removeListener("warning", onGatewayWarning);
		emitter.removeListener("metrics", onGatewayMetrics);
	};
}
//#endregion
//#region extensions/discord/src/monitor.gateway.ts
async function waitForDiscordGatewayStop(params) {
	const { gateway, abortSignal } = params;
	return await new Promise((resolve, reject) => {
		let settled = false;
		const cleanup = () => {
			abortSignal?.removeEventListener("abort", onAbort);
			params.gatewaySupervisor?.detachLifecycle();
		};
		const finishResolve = () => {
			if (settled) return;
			settled = true;
			try {
				gateway?.disconnect?.();
			} finally {
				cleanup();
				resolve();
			}
		};
		const finishReject = (err) => {
			if (settled) return;
			settled = true;
			try {
				gateway?.disconnect?.();
			} finally {
				cleanup();
				reject(toErrorObject(err, "Non-Error rejection"));
			}
		};
		const onAbort = () => {
			finishResolve();
		};
		const onGatewayEvent = (event) => {
			if ((params.onGatewayEvent?.(event) ?? "stop") === "stop") finishReject(new DiscordGatewayLifecycleError(event));
		};
		const onForceStop = (err) => {
			finishReject(err);
		};
		if (abortSignal?.aborted) {
			onAbort();
			return;
		}
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		params.gatewaySupervisor?.attachLifecycle(onGatewayEvent);
		params.registerForceStop?.(onForceStop);
	});
}
//#endregion
//#region extensions/discord/src/monitor/status.ts
/** READY proves a prior terminal failure was repaired, so the account is restartable again. */
function createDiscordReadyStatusPatch(at = Date.now()) {
	return channelReadyPatch({
		lastConnectedAt: at,
		lastEventAt: at,
		lastDisconnect: null
	});
}
//#endregion
//#region extensions/discord/src/monitor/provider.lifecycle.ts
const DEFAULT_DISCORD_GATEWAY_READY_TIMEOUT_MS = 15e3;
const DEFAULT_DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_MS = 3e4;
const MAX_DISCORD_GATEWAY_READY_TIMEOUT_MS = 12e4;
const DISCORD_GATEWAY_READY_TIMEOUT_ENV = "OPENCLAW_DISCORD_READY_TIMEOUT_MS";
const DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_ENV = "OPENCLAW_DISCORD_RUNTIME_READY_TIMEOUT_MS";
const DISCORD_GATEWAY_READY_POLL_MS = 250;
const DISCORD_GATEWAY_READY_RETRY_BACKOFF_MS = 2e3;
const DISCORD_GATEWAY_STARTUP_DISCONNECT_DRAIN_TIMEOUT_MS = 5e3;
const DISCORD_GATEWAY_STARTUP_TERMINATE_CLOSE_TIMEOUT_MS = 1e3;
const DISCORD_GATEWAY_TRANSPORT_ACTIVITY_STATUS_MIN_INTERVAL_MS = 3e4;
function normalizeGatewayReadyTimeoutMs(value) {
	const numeric = parseStrictPositiveInteger(value);
	if (numeric === void 0) return;
	return Math.min(numeric, MAX_DISCORD_GATEWAY_READY_TIMEOUT_MS);
}
function resolveDiscordGatewayReadyTimeoutMs(params) {
	return normalizeGatewayReadyTimeoutMs(params?.env?.[DISCORD_GATEWAY_READY_TIMEOUT_ENV]) ?? DEFAULT_DISCORD_GATEWAY_READY_TIMEOUT_MS;
}
function resolveDiscordGatewayRuntimeReadyTimeoutMs(params) {
	return normalizeGatewayReadyTimeoutMs(params?.env?.[DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_ENV]) ?? DEFAULT_DISCORD_GATEWAY_RUNTIME_READY_TIMEOUT_MS;
}
async function restartGatewayAfterReadyTimeout(params) {
	if (!params.gateway || params.abortSignal?.aborted) return;
	const socket = params.gateway.ws;
	if (!socket) {
		params.gateway.disconnect();
		if (!params.abortSignal?.aborted) params.gateway.connect(false);
		return;
	}
	await new Promise((resolve, reject) => {
		let settled = false;
		let drainTimeout;
		let terminateCloseTimeout;
		const ignoreSocketError = () => {};
		const clearTimers = () => {
			if (drainTimeout) {
				clearTimeout(drainTimeout);
				drainTimeout = void 0;
			}
			if (terminateCloseTimeout) {
				clearTimeout(terminateCloseTimeout);
				terminateCloseTimeout = void 0;
			}
		};
		const cleanup = () => {
			clearTimers();
			socket.removeListener("close", onClose);
			socket.removeListener("error", ignoreSocketError);
		};
		const finishResolve = () => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve();
		};
		const finishReject = (error) => {
			if (params.abortSignal?.aborted) {
				finishResolve();
				return;
			}
			if (settled) return;
			settled = true;
			cleanup();
			reject(error);
		};
		const onClose = () => {
			finishResolve();
		};
		socket.on("error", ignoreSocketError);
		socket.on("close", onClose);
		params.gateway?.disconnect();
		drainTimeout = setTimeout(() => {
			if (settled) return;
			if (typeof socket.terminate !== "function") {
				finishReject(/* @__PURE__ */ new Error(`discord gateway socket did not close within ${DISCORD_GATEWAY_STARTUP_DISCONNECT_DRAIN_TIMEOUT_MS}ms before restart`));
				return;
			}
			params.runtime.error?.(danger(`discord: startup restart waiting on a stale gateway socket for ${DISCORD_GATEWAY_STARTUP_DISCONNECT_DRAIN_TIMEOUT_MS}ms; forcing terminate before reconnect`));
			try {
				socket.terminate();
			} catch {
				finishReject(/* @__PURE__ */ new Error(`discord gateway socket did not close within ${DISCORD_GATEWAY_STARTUP_DISCONNECT_DRAIN_TIMEOUT_MS}ms before restart`));
				return;
			}
			terminateCloseTimeout = setTimeout(() => {
				finishReject(/* @__PURE__ */ new Error(`discord gateway socket did not close within ${DISCORD_GATEWAY_STARTUP_DISCONNECT_DRAIN_TIMEOUT_MS}ms before restart`));
			}, DISCORD_GATEWAY_STARTUP_TERMINATE_CLOSE_TIMEOUT_MS);
			terminateCloseTimeout.unref?.();
		}, DISCORD_GATEWAY_STARTUP_DISCONNECT_DRAIN_TIMEOUT_MS);
		drainTimeout.unref?.();
	});
	if (!params.abortSignal?.aborted) params.gateway.connect(false);
}
function parseGatewayCloseCode(message) {
	const match = /Gateway websocket closed:\s*(\d{3,5})/.exec(message);
	if (!match?.[1]) return;
	const code = Number.parseInt(match[1], 10);
	return Number.isFinite(code) ? code : void 0;
}
function resolveTransportActivityAt(event) {
	const at = event?.at;
	const timestampMs = asDateTimestampMs(at);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : Date.now();
}
function createGatewayStatusObserver(params) {
	let forceStopHandler;
	let queuedForceStopError;
	let readyPollId;
	let readyTimeoutId;
	const shouldStop = () => params.abortSignal?.aborted || params.isLifecycleStopping();
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
	const pushConnectedStatus = (at) => {
		params.pushStatus(createDiscordReadyStatusPatch(at));
	};
	const startReadyWatch = () => {
		clearReadyWatch();
		const pollConnected = () => {
			if (shouldStop()) {
				clearReadyWatch();
				return;
			}
			if (!params.gateway?.isConnected) return;
			clearReadyWatch();
			pushConnectedStatus(Date.now());
		};
		pollConnected();
		if (!readyTimeoutId) {
			readyPollId = setInterval(pollConnected, DISCORD_GATEWAY_READY_POLL_MS);
			readyPollId.unref?.();
			readyTimeoutId = setTimeout(() => {
				clearReadyWatch();
				if (shouldStop() || params.gateway?.isConnected) return;
				const at = Date.now();
				const error = /* @__PURE__ */ new Error(`discord gateway opened but did not reach READY within ${params.runtimeReadyTimeoutMs}ms`);
				params.pushStatus({
					connected: false,
					lifecycle: "recovering",
					lastEventAt: at,
					lastDisconnect: {
						at,
						error: "runtime-not-ready"
					},
					lastError: "runtime-not-ready"
				});
				params.runtime.error?.(danger(error.message));
				triggerForceStop(error);
			}, params.runtimeReadyTimeoutMs);
			readyTimeoutId.unref?.();
		}
	};
	const onGatewayDebug = (msg) => {
		if (shouldStop()) return;
		const at = Date.now();
		const message = String(msg);
		if (message.includes("Gateway websocket opened")) {
			params.pushStatus({
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
			params.pushStatus({
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
			params.pushStatus({
				connected: false,
				lifecycle: "recovering",
				lastEventAt: at,
				lastError: message
			});
		}
	};
	return {
		onGatewayDebug,
		clearReadyWatch,
		registerForceStop: (handler) => {
			forceStopHandler = handler;
			if (queuedForceStopError !== void 0) {
				const err = queuedForceStopError;
				queuedForceStopError = void 0;
				handler(err);
			}
		},
		dispose: () => {
			clearReadyWatch();
			forceStopHandler = void 0;
			queuedForceStopError = void 0;
		}
	};
}
async function waitForGatewayReady(params) {
	const waitUntilReady = async () => {
		const deadlineAt = Date.now() + params.readyTimeoutMs;
		while (!params.abortSignal?.aborted) {
			if (await params.beforePoll?.() === "stop") return "stopped";
			if (params.gateway?.isConnected === true) {
				const at = Date.now();
				params.pushStatus?.(createDiscordReadyStatusPatch(at));
				return "ready";
			}
			if (Date.now() >= deadlineAt) return "timeout";
			await new Promise((resolve) => {
				setTimeout(resolve, DISCORD_GATEWAY_READY_POLL_MS).unref?.();
			});
		}
		return "stopped";
	};
	if (!params.gateway) {
		if (await waitUntilReady() === "timeout") throw new Error(`discord gateway did not reach READY within ${params.readyTimeoutMs}ms`);
		return;
	}
	let attempt = 0;
	while (!params.abortSignal?.aborted) {
		if (await waitUntilReady() !== "timeout") return;
		attempt += 1;
		const restartAt = Date.now();
		params.runtime.error?.(danger(`discord: gateway READY wait timed out after ${params.readyTimeoutMs}ms; reconnecting with backoff (attempt ${attempt})`));
		params.pushStatus?.({
			connected: false,
			lifecycle: "recovering",
			lastEventAt: restartAt,
			lastDisconnect: {
				at: restartAt,
				error: "startup-not-ready"
			},
			lastError: "startup-not-ready"
		});
		await params.beforeRestart?.();
		await restartGatewayAfterReadyTimeout({
			gateway: params.gateway,
			abortSignal: params.abortSignal,
			runtime: params.runtime
		});
		if (params.abortSignal?.aborted) return;
		try {
			await sleepWithAbort(DISCORD_GATEWAY_READY_RETRY_BACKOFF_MS, params.abortSignal, { ref: false });
		} catch {
			return;
		}
	}
}
async function runDiscordGatewayLifecycle(params) {
	const gateway = params.gateway;
	const gatewayReadyAtLifecycleStart = gateway?.isConnected === true;
	if (gateway) registerGateway(params.accountId, gateway);
	const gatewayEmitter = params.gatewaySupervisor.emitter ?? getDiscordGatewayEmitter(gateway);
	const stopGatewayLogging = attachDiscordGatewayLogging({
		emitter: gatewayEmitter,
		runtime: params.runtime
	});
	let lifecycleStopping = false;
	const pushStatus = (patch) => {
		params.statusSink?.(patch);
	};
	const gatewayReadyTimeoutMs = resolveDiscordGatewayReadyTimeoutMs({ env: process.env });
	const gatewayRuntimeReadyTimeoutMs = resolveDiscordGatewayRuntimeReadyTimeoutMs({ env: process.env });
	const statusObserver = createGatewayStatusObserver({
		gateway,
		abortSignal: params.abortSignal,
		runtime: params.runtime,
		pushStatus,
		isLifecycleStopping: () => lifecycleStopping,
		runtimeReadyTimeoutMs: gatewayRuntimeReadyTimeoutMs
	});
	gatewayEmitter?.on("debug", statusObserver.onGatewayDebug);
	let lastTransportActivityStatusAt;
	const onGatewayTransportActivity = (event) => {
		if (lifecycleStopping || params.abortSignal?.aborted) return;
		const at = resolveTransportActivityAt(event);
		if (lastTransportActivityStatusAt !== void 0 && at - lastTransportActivityStatusAt < DISCORD_GATEWAY_TRANSPORT_ACTIVITY_STATUS_MIN_INTERVAL_MS) return;
		lastTransportActivityStatusAt = at;
		pushStatus(createTransportActivityStatusPatch(at));
	};
	gatewayEmitter?.on(DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT, onGatewayTransportActivity);
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
		if (gatewayReadyAtLifecycleStart && params.voiceManager) params.voiceManager.autoJoin().catch((err) => params.runtime.error?.(danger(`discord voice: autoJoin failed: ${formatErrorMessage(err)}`)));
		await waitForGatewayReady({
			gateway,
			abortSignal: params.abortSignal,
			beforePoll: drainPendingGatewayErrors,
			pushStatus,
			runtime: params.runtime,
			beforeRestart: statusObserver.clearReadyWatch,
			readyTimeoutMs: gatewayReadyTimeoutMs
		});
		if (drainPendingGatewayErrors() === "stop") return;
		await waitForDiscordGatewayStop({
			gateway: gateway ? { disconnect: () => gateway.disconnect() } : void 0,
			abortSignal: params.abortSignal,
			gatewaySupervisor: params.gatewaySupervisor,
			onGatewayEvent: handleGatewayEvent,
			registerForceStop: statusObserver.registerForceStop
		});
	} catch (err) {
		if (!sawDisallowedIntents && !params.isDisallowedIntentsError(err)) throw err;
	} finally {
		lifecycleStopping = true;
		params.gatewaySupervisor.detachLifecycle();
		unregisterGateway(params.accountId);
		stopGatewayLogging();
		statusObserver.dispose();
		gatewayEmitter?.removeListener("debug", statusObserver.onGatewayDebug);
		gatewayEmitter?.removeListener(DISCORD_GATEWAY_TRANSPORT_ACTIVITY_EVENT, onGatewayTransportActivity);
		if (params.voiceManager) {
			await params.voiceManager.destroy();
			setDiscordTranscriptsVoiceManager({
				accountId: params.accountId,
				manager: null,
				expectedManager: params.voiceManager
			});
			params.voiceManagerRef.current = null;
		}
		params.threadBindings.stop();
	}
}
//#endregion
//#region extensions/discord/src/monitor/provider-runtime.ts
let discordVoiceRuntimePromise;
let discordProviderSessionRuntimePromise;
async function loadDiscordVoiceRuntime() {
	const promise = discordVoiceRuntimePromise ?? import("./voice-runtime-elTtjEIG.mjs").then((n) => n.t);
	discordVoiceRuntimePromise = promise;
	try {
		return await promise;
	} catch (error) {
		if (discordVoiceRuntimePromise === promise) discordVoiceRuntimePromise = void 0;
		throw error;
	}
}
async function loadDiscordProviderSessionRuntime() {
	const promise = discordProviderSessionRuntimePromise ?? import("./provider-session.runtime-DrGAYnZv.mjs");
	discordProviderSessionRuntimePromise = promise;
	try {
		return await promise;
	} catch (error) {
		if (discordProviderSessionRuntimePromise === promise) discordProviderSessionRuntimePromise = void 0;
		throw error;
	}
}
const discordProviderRuntime = {
	probeDiscordApplicationId,
	createDiscordNativeCommand,
	runDiscordGatewayLifecycle,
	loadDiscordVoiceRuntime,
	loadDiscordProviderSessionRuntime,
	createClient: (...args) => new Client(...args),
	resolveDiscordAccount,
	resolveNativeCommandsEnabled,
	resolveNativeSkillsEnabled,
	listNativeCommandSpecsForConfig,
	listSkillCommandsForAgents,
	isVerbose,
	shouldLogVerbose
};
//#endregion
//#region extensions/discord/src/monitor/provider.acp.ts
const DISCORD_ACP_STATUS_PROBE_TIMEOUT_MS = 8e3;
const DISCORD_ACP_STALE_RUNNING_ACTIVITY_MS = 12e4;
function isLegacyMissingSessionError(message) {
	return message.includes("Session is not ACP-enabled") || message.includes("ACP session metadata missing");
}
function classifyAcpStatusProbeError(params) {
	if (params.isAcpRuntimeError(params.error) && ["SESSION_OWNER_MIGRATION_REQUIRED", "SESSION_OWNER_UNSUPPORTED"].includes(params.error.detailCode ?? "")) return {
		status: "uncertain",
		reason: formatErrorMessage(params.error)
	};
	if (params.isAcpRuntimeError(params.error) && params.error.code === "ACP_SESSION_INIT_FAILED") return {
		status: "stale",
		reason: "session-init-failed"
	};
	if (isLegacyMissingSessionError(formatErrorMessage(params.error))) return {
		status: "stale",
		reason: "session-missing"
	};
	return params.isStaleRunning ? {
		status: "stale",
		reason: "status-error-running-stale"
	} : {
		status: "uncertain",
		reason: "status-error"
	};
}
function resolveRunningActivityAgeMs(params) {
	if (params.storedState !== "running") return 0;
	const nowMs = asDateTimestampMs(Date.now());
	if (nowMs === void 0) return 0;
	const activityAtMs = asDateTimestampMs(params.lastActivityAt);
	return Math.max(0, nowMs - (activityAtMs === void 0 ? 0 : Math.max(0, Math.floor(activityAtMs))));
}
async function probeDiscordAcpBindingHealth(params) {
	const { getAcpSessionManager, isAcpRuntimeError } = params.providerSessionRuntime;
	const manager = getAcpSessionManager();
	const statusProbeAbortController = new AbortController();
	const statusPromise = manager.getSessionStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		signal: statusProbeAbortController.signal
	}).then((status) => ({
		kind: "status",
		status
	})).catch((error) => ({
		kind: "error",
		error
	}));
	const result = await raceWithTimeout({
		promise: statusPromise,
		timeoutMs: DISCORD_ACP_STATUS_PROBE_TIMEOUT_MS,
		onTimeout: () => ({ kind: "timeout" })
	});
	if (result.kind === "timeout") statusProbeAbortController.abort();
	const runningForMs = resolveRunningActivityAgeMs(params);
	const isStaleRunning = params.storedState === "running" && runningForMs >= DISCORD_ACP_STALE_RUNNING_ACTIVITY_MS;
	if (result.kind === "timeout") return isStaleRunning ? {
		status: "stale",
		reason: "status-timeout-running-stale"
	} : {
		status: "uncertain",
		reason: "status-timeout"
	};
	if (result.kind === "error") return classifyAcpStatusProbeError({
		error: result.error,
		isStaleRunning,
		isAcpRuntimeError
	});
	if (result.status.state === "error") return {
		status: "uncertain",
		reason: "status-error-state"
	};
	return { status: "healthy" };
}
//#endregion
//#region extensions/discord/src/monitor/provider.cleanup.ts
async function cleanupDiscordProviderStartup(params) {
	const listenersStopped = params.stopMonitorListeners?.();
	try {
		await params.deactivateMessageHandler?.();
	} finally {
		await listenersStopped;
	}
	params.autoPresenceController?.stop();
	params.setStatus?.({ connected: false });
	if (params.onEarlyGatewayDebug) params.earlyGatewayEmitter?.removeListener("debug", params.onEarlyGatewayDebug);
	if (!params.lifecycleStarted) try {
		params.lifecycleGateway?.disconnect();
	} catch (err) {
		params.runtime.error?.(danger(`discord: failed to disconnect gateway during startup cleanup: ${String(err)}`));
	}
	params.gatewaySupervisor?.dispose();
	if (!params.lifecycleStarted) params.threadBindings.stop();
}
//#endregion
//#region extensions/discord/src/voice/command.ts
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
	const memberRoleIds = Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.map((roleId) => roleId) : [];
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
		useAccessGroups: currentParams.useAccessGroups,
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
async function resolveVoiceCommandRuntimeContext(interaction, params) {
	const guildId = interaction.guild?.id;
	if (!guildId) {
		await interaction.reply({
			content: "Unable to resolve guild for this command.",
			ephemeral: true
		});
		return null;
	}
	const manager = params.getManager();
	if (!manager) {
		await interaction.reply({
			content: "Voice manager is not available yet.",
			ephemeral: true
		});
		return null;
	}
	return {
		guildId,
		manager
	};
}
async function ensureVoiceCommandAccess(params) {
	const access = await authorizeVoiceCommand(params.interaction, params.context, { channelOverride: params.channelOverride });
	if (access.ok) return true;
	await params.interaction.reply({
		content: access.message ?? "Not authorized.",
		ephemeral: true
	});
	return false;
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
	const resolveSessionChannelId = (manager, guildId) => manager.status().find((entry) => entry.guildId === guildId)?.channelId;
	class JoinCommand extends Command {
		constructor(..._args) {
			super(..._args);
			this.name = "join";
			this.description = "Join a voice channel";
			this.defer = true;
			this.ephemeral = params.ephemeralDefault;
			this.options = [{
				name: "channel",
				description: "Voice channel to join",
				type: ApplicationCommandOptionType.Channel,
				required: true,
				channel_types: VOICE_CHANNEL_TYPES
			}];
		}
		async run(interaction) {
			const channel = await interaction.options.getChannel("channel", true);
			if (!channel || !("id" in channel)) {
				await interaction.reply({
					content: "Voice channel not found.",
					ephemeral: true
				});
				return;
			}
			const access = await authorizeVoiceCommand(interaction, params, { channelOverride: {
				id: channel.id,
				name: resolveDiscordChannelNameSafe(channel)
			} });
			if (!access.ok) {
				await interaction.reply({
					content: access.message ?? "Not authorized.",
					ephemeral: true
				});
				return;
			}
			if (!isVoiceChannelType(channel.type)) {
				await interaction.reply({
					content: "That is not a voice channel.",
					ephemeral: true
				});
				return;
			}
			const guildId = access.guildId ?? ("guildId" in channel ? channel.guildId : void 0);
			if (!guildId) {
				await interaction.reply({
					content: "Unable to resolve guild for this voice channel.",
					ephemeral: true
				});
				return;
			}
			const manager = params.getManager();
			if (!manager) {
				await interaction.reply({
					content: "Voice manager is not available yet.",
					ephemeral: true
				});
				return;
			}
			const result = await manager.join({
				guildId,
				channelId: channel.id
			});
			await interaction.reply({
				content: result.message,
				ephemeral: true
			});
		}
	}
	class LeaveCommand extends Command {
		constructor(..._args2) {
			super(..._args2);
			this.name = "leave";
			this.description = "Leave the current voice channel";
			this.defer = true;
			this.ephemeral = params.ephemeralDefault;
		}
		async run(interaction) {
			const runtimeContext = await resolveVoiceCommandRuntimeContext(interaction, params);
			if (!runtimeContext) return;
			const sessionChannelId = resolveSessionChannelId(runtimeContext.manager, runtimeContext.guildId);
			if (!await ensureVoiceCommandAccess({
				interaction,
				context: params,
				channelOverride: sessionChannelId ? { id: sessionChannelId } : void 0
			})) return;
			const result = await runtimeContext.manager.leave({ guildId: runtimeContext.guildId });
			await interaction.reply({
				content: result.message,
				ephemeral: true
			});
		}
	}
	class StatusCommand extends Command {
		constructor(..._args3) {
			super(..._args3);
			this.name = "status";
			this.description = "Show active voice sessions";
			this.defer = true;
			this.ephemeral = params.ephemeralDefault;
		}
		async run(interaction) {
			const runtimeContext = await resolveVoiceCommandRuntimeContext(interaction, params);
			if (!runtimeContext) return;
			const sessions = runtimeContext.manager.status().filter((entry) => entry.guildId === runtimeContext.guildId);
			const sessionChannelId = sessions[0]?.channelId;
			if (!await ensureVoiceCommandAccess({
				interaction,
				context: params,
				channelOverride: sessionChannelId ? { id: sessionChannelId } : void 0
			})) return;
			if (sessions.length === 0) {
				await interaction.reply({
					content: "No active voice sessions.",
					ephemeral: true
				});
				return;
			}
			const lines = sessions.map((entry) => `• ${formatMention({ channelId: entry.channelId })} (guild ${entry.guildId})${entry.warning ? `\n${entry.warning}` : ""}`);
			await interaction.reply({
				content: lines.join("\n"),
				ephemeral: true
			});
		}
	}
	return new class extends CommandWithSubcommands {
		constructor(..._args4) {
			super(..._args4);
			this.name = DISCORD_VOICE_COMMAND_SPEC.name;
			this.description = DISCORD_VOICE_COMMAND_SPEC.description;
			this.subcommands = [
				new JoinCommand(),
				new LeaveCommand(),
				new StatusCommand()
			];
		}
	}();
}
function isVoiceChannelType(type) {
	return type === ChannelType.GuildVoice || type === ChannelType.GuildStageVoice;
}
//#endregion
//#region extensions/discord/src/monitor/provider.commands.ts
const loadPluginCommandRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/plugin-command-runtime"));
async function resolveDiscordProviderCommandSpecs(params) {
	const listSkillCommands = params.listSkillCommandsForAgents ?? listSkillCommandsForAgents;
	const listNativeCommandSpecs = params.listNativeCommandSpecsForConfig ?? listNativeCommandSpecsForConfig;
	const maxDiscordCommands = params.maxDiscordCommands ?? 100;
	const pluginCommandSpecs = params.nativeEnabled ? (await loadPluginCommandRuntime()).createPluginCommandRuntime().listNativeCandidates("discord") : [];
	const onCollision = (normalizedName) => {
		params.runtime.error?.(danger(`discord: plugin command "/${normalizedName}" duplicates an existing native command. Skipping.`));
	};
	const mergePluginCommandSpecs = (primary, collisionHandler) => mergeNativeCommandSpecs({
		primary,
		secondary: pluginCommandSpecs,
		onCollision: collisionHandler
	});
	const listPrimaryCommandSpecs = (skillCommands) => {
		const standardSpecs = listNativeCommandSpecs(params.cfg, {
			skillCommands,
			provider: "discord"
		});
		if (!params.voiceEnabled) return standardSpecs;
		const voiceName = DISCORD_VOICE_COMMAND_SPEC.name;
		return [...standardSpecs.filter((spec) => normalizeLowercaseStringOrEmpty(spec.name) !== voiceName), DISCORD_VOICE_COMMAND_SPEC];
	};
	const provisionalCollisions = [];
	let skillCommands = params.nativeEnabled && params.nativeSkillsEnabled ? listSkillCommands({ cfg: params.cfg }) : [];
	let commandSpecs = params.nativeEnabled ? mergePluginCommandSpecs(listPrimaryCommandSpecs(skillCommands), (normalizedName) => provisionalCollisions.push(normalizedName)) : [];
	const initialCommandCount = commandSpecs.length;
	if (params.nativeEnabled && params.nativeSkillsEnabled && commandSpecs.length > maxDiscordCommands) {
		skillCommands = [];
		commandSpecs = mergePluginCommandSpecs(listPrimaryCommandSpecs([]), onCollision);
		params.runtime.log?.(warn(`${initialCommandCount} commands exceed the ${maxDiscordCommands}-command Discord limit; removing per-skill commands and keeping /skill.`));
	} else for (const normalizedName of provisionalCollisions) onCollision(normalizedName);
	if (params.nativeEnabled && commandSpecs.length > maxDiscordCommands) params.runtime.log?.(warn(`${commandSpecs.length} commands exceed the ${maxDiscordCommands}-command Discord limit; some commands may fail to deploy.`));
	return {
		skillCommands,
		commandSpecs
	};
}
//#endregion
//#region extensions/discord/src/monitor/provider.config-log.ts
function formatThreadBindingDurationForConfigLabel(durationMs) {
	const label = formatThreadBindingDurationLabel(durationMs);
	return label === "disabled" ? "off" : label;
}
function logDiscordResolvedConfig(params) {
	const allowFromSummary = summarizeStringEntries({
		entries: params.allowFrom ?? [],
		limit: 4,
		emptyText: "any"
	});
	const groupDmChannelSummary = summarizeStringEntries({
		entries: params.groupDmChannels ?? [],
		limit: 4,
		emptyText: "any"
	});
	const guildSummary = summarizeStringEntries({
		entries: Object.keys(params.guildEntries ?? {}),
		limit: 4,
		emptyText: "any"
	});
	logVerbose(`discord: config dm=${params.dmEnabled ? "on" : "off"} dmPolicy=${params.dmPolicy} allowFrom=${allowFromSummary} groupDm=${params.groupDmEnabled ? "on" : "off"} groupDmChannels=${groupDmChannelSummary} groupPolicy=${params.groupPolicy} guilds=${guildSummary} historyLimit=${params.historyLimit} mediaMaxMb=${Math.round(params.mediaMaxBytes / 1048576)} native=${params.nativeEnabled ? "on" : "off"} nativeSkills=${params.nativeSkillsEnabled ? "on" : "off"} accessGroups=${params.useAccessGroups ? "on" : "off"} threadBindings=${params.threadBindingsEnabled ? "on" : "off"} threadIdleTimeout=${formatThreadBindingDurationForConfigLabel(params.threadBindingIdleTimeoutMs)} threadMaxAge=${formatThreadBindingDurationForConfigLabel(params.threadBindingMaxAgeMs)}`);
}
//#endregion
//#region extensions/discord/src/monitor/provider.deploy-errors.ts
const DISCORD_DEPLOY_REJECTED_ENTRY_LIMIT = 3;
function attachDiscordDeployRequestBody(err, body) {
	if (!err || typeof err !== "object" || body === void 0) return;
	const deployErr = err;
	if (deployErr.deployRequestBody === void 0) deployErr.deployRequestBody = body;
}
function attachDiscordDeployRestContext(err, context) {
	if (!err || typeof err !== "object") return;
	const deployErr = err;
	deployErr.deployRestMethod = context.method;
	deployErr.deployRestPath = context.path;
	deployErr.deployRequestMs = context.requestMs;
	if (typeof context.timeoutMs === "number" && Number.isFinite(context.timeoutMs)) deployErr.deployTimeoutMs = context.timeoutMs;
}
function stringifyDiscordDeployField(value) {
	if (typeof value === "string") return JSON.stringify(value);
	try {
		return JSON.stringify(value);
	} catch {
		return inspect(value, {
			depth: 2,
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
	const source = (payload.errors && typeof payload.errors === "object" ? payload.errors : void 0) ?? rawBody;
	return source && typeof source === "object" ? source : null;
}
function readDiscordDeployObjectField(value, field) {
	return value && typeof value === "object" && field in value ? value[field] : void 0;
}
function isAbortLikeError(err) {
	if (!err || typeof err !== "object") return false;
	const name = "name" in err && typeof err.name === "string" ? err.name : void 0;
	const message = formatErrorMessage(err);
	return name === "AbortError" || message === "This operation was aborted" || message === "The operation was aborted" || /\boperation was aborted\b/i.test(message);
}
function formatDiscordDeployRestOperation(err) {
	const method = typeof err.deployRestMethod === "string" && err.deployRestMethod.trim().length > 0 ? err.deployRestMethod.toUpperCase() : void 0;
	const path = typeof err.deployRestPath === "string" && err.deployRestPath.trim().length > 0 ? err.deployRestPath : void 0;
	if (method && path) return `${method} ${path}`;
	if (method) return method;
	if (path) return path;
	return "request";
}
function formatDiscordDeployErrorMessage(err) {
	if (!isAbortLikeError(err)) return formatErrorMessage(err);
	const deployErr = err && typeof err === "object" ? err : {};
	const requestMs = parseFiniteNumber$1(deployErr.deployRequestMs);
	const timeoutMs = parseFiniteNumber$1(deployErr.deployTimeoutMs);
	const operation = formatDiscordDeployRestOperation(deployErr);
	if (!(requestMs !== void 0 || timeoutMs !== void 0 || deployErr.deployRestMethod !== void 0 || deployErr.deployRestPath !== void 0)) return "Discord REST request was aborted";
	const timing = [];
	if (timeoutMs !== void 0) timing.push(`timeout=${formatDurationSeconds(timeoutMs, { decimals: timeoutMs >= 1e3 ? 1 : 0 })}`);
	if (requestMs !== void 0) timing.push(`observed=${formatDurationSeconds(requestMs, { decimals: requestMs >= 1e3 ? 1 : 0 })}`);
	const timingText = timing.length > 0 ? ` (${timing.join(", ")})` : "";
	if (timeoutMs !== void 0 && requestMs !== void 0 && requestMs >= timeoutMs) return `Discord REST ${operation} timed out${timingText}`;
	return `Discord REST ${operation} was aborted${timingText}`;
}
function resolveDiscordDeployRateLimitDetails(err) {
	if (!err || typeof err !== "object") return;
	const deployErr = err;
	const status = parseStrictNonNegativeInteger$1(deployErr.status) ?? parseStrictNonNegativeInteger$1(deployErr.statusCode);
	const retryAfterSeconds = parseFiniteNumber$1(deployErr.retryAfter) ?? parseFiniteNumber$1(readDiscordDeployObjectField(deployErr.rawBody, "retry_after"));
	if (!(err instanceof RateLimitError || status === 429 || retryAfterSeconds !== void 0)) return;
	const rawGlobal = readDiscordDeployObjectField(deployErr.rawBody, "global");
	const scope = typeof deployErr.scope === "string" && deployErr.scope.trim().length > 0 ? deployErr.scope : rawGlobal === true ? "global" : rawGlobal === false ? "route" : void 0;
	const discordCode = typeof deployErr.discordCode === "number" || typeof deployErr.discordCode === "string" ? deployErr.discordCode : void 0;
	return {
		status,
		retryAfterMs: retryAfterSeconds === void 0 ? void 0 : Math.max(0, retryAfterSeconds * 1e3),
		scope,
		discordCode
	};
}
function formatDiscordDeployRateLimitDetails(err) {
	const rateLimit = resolveDiscordDeployRateLimitDetails(err);
	if (!rateLimit) return "";
	const details = [];
	if (typeof rateLimit.status === "number") details.push(`status=${rateLimit.status}`);
	if (typeof rateLimit.retryAfterMs === "number") details.push(`retryAfter=${formatDurationSeconds(rateLimit.retryAfterMs, { decimals: 1 })}`);
	if (rateLimit.scope) details.push(`scope=${rateLimit.scope}`);
	if (typeof rateLimit.discordCode === "number" || typeof rateLimit.discordCode === "string") details.push(`code=${rateLimit.discordCode}`);
	return details.length > 0 ? ` (${details.join(", ")})` : "";
}
function formatDiscordDeployRateLimitWarning(err, accountId) {
	const rateLimit = resolveDiscordDeployRateLimitDetails(err);
	if (!rateLimit) return;
	const parts = [`[${accountId}] slash command deploy rate limited`];
	if (typeof rateLimit.retryAfterMs === "number") parts.push(`retry after ${formatDurationSeconds(rateLimit.retryAfterMs, { decimals: 1 })}`);
	if (rateLimit.scope) parts.push(`scope=${rateLimit.scope}`);
	if (typeof rateLimit.discordCode === "number" || typeof rateLimit.discordCode === "string") parts.push(`code=${rateLimit.discordCode}`);
	return `${parts.join("; ")}. Existing slash commands stay active. Message send/receive is unaffected.`;
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
	const status = err.status;
	const discordCode = err.discordCode;
	const rawBody = err.rawBody;
	const requestBody = err.deployRequestBody;
	const details = [];
	if (typeof status === "number") details.push(`status=${status}`);
	if (typeof discordCode === "number" || typeof discordCode === "string") details.push(`code=${discordCode}`);
	if (rawBody !== void 0 && !isRedundantDiscordDeployBody(rawBody)) {
		let bodyText;
		try {
			bodyText = JSON.stringify(rawBody);
		} catch {
			bodyText = typeof rawBody === "string" ? rawBody : inspect(rawBody, {
				depth: 3,
				breakLength: 120
			});
		}
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
	if (!err || typeof err !== "object") return false;
	const deployErr = err;
	const discordCode = parseStrictNonNegativeInteger$1(deployErr.discordCode);
	const rawCode = parseStrictNonNegativeInteger$1(readDiscordDeployObjectField(deployErr.rawBody, "code"));
	return (discordCode === 30034 || rawCode === 30034) && /daily application command creates/i.test(formatErrorMessage(err));
}
//#endregion
//#region extensions/discord/src/monitor/provider.startup-log.ts
function formatDiscordStartupGatewayState(gateway) {
	if (!gateway) return "gateway=missing";
	const reconnectAttempts = gateway.reconnectAttempts;
	return `gatewayConnected=${gateway.isConnected ? "true" : "false"} reconnectAttempts=${typeof reconnectAttempts === "number" ? reconnectAttempts : "na"}`;
}
function logDiscordStartupPhase$1(params) {
	if (!(params.isVerbose ?? isVerbose)()) return;
	const elapsedMs = Math.max(0, Date.now() - params.startAt);
	const suffix = [params.details, formatDiscordStartupGatewayState(params.gateway)].filter((value) => Boolean(value)).join(" ");
	params.runtime.log?.(`discord startup [${params.accountId}] ${params.phase} ${elapsedMs}ms${suffix ? ` ${suffix}` : ""}`);
}
//#endregion
//#region extensions/discord/src/monitor/provider.deploy.ts
function readDeployRequestBody(data) {
	return data && typeof data === "object" && "body" in data ? data.body : void 0;
}
function isDeployCommandsPath(path) {
	return path.startsWith("/applications/") && path.includes("/commands");
}
function wrapDeployRestMethod(params) {
	return async (path, data, query) => {
		if (!isDeployCommandsPath(path)) return params.original[params.method](path, data, query);
		const startedAt = Date.now();
		const body = readDeployRequestBody(data);
		const commandCount = Array.isArray(body) ? body.length : void 0;
		const bodyBytes = body === void 0 ? void 0 : Buffer.byteLength(typeof body === "string" ? body : JSON.stringify(body), "utf8");
		if (params.shouldLogVerbose()) params.runtime.log?.(`discord startup [${params.accountId}] native-slash-command-deploy-rest:${params.method}:start ${Math.max(0, Date.now() - params.startupStartedAt)}ms path=${path}${typeof commandCount === "number" ? ` commands=${commandCount}` : ""}${typeof bodyBytes === "number" ? ` bytes=${bodyBytes}` : ""}`);
		try {
			const result = await params.original[params.method](path, data, query);
			if (params.shouldLogVerbose()) params.runtime.log?.(`discord startup [${params.accountId}] native-slash-command-deploy-rest:${params.method}:done ${Math.max(0, Date.now() - params.startupStartedAt)}ms path=${path} requestMs=${Date.now() - startedAt}`);
			return result;
		} catch (err) {
			const requestMs = Date.now() - startedAt;
			attachDiscordDeployRequestBody(err, body);
			attachDiscordDeployRestContext(err, {
				method: params.method,
				path,
				requestMs,
				timeoutMs: params.timeoutMs
			});
			const rateLimitDetails = formatDiscordDeployRateLimitDetails(err);
			if (rateLimitDetails) {
				if (params.shouldLogVerbose()) params.runtime.log?.(warn(`discord startup [${params.accountId}] native-slash-command-deploy-rest:${params.method}:rate-limited ${Math.max(0, Date.now() - params.startupStartedAt)}ms path=${path} requestMs=${requestMs}${rateLimitDetails}`));
			} else if (params.shouldLogVerbose()) {
				const details = formatDiscordDeployErrorDetails(err);
				params.runtime.error?.(`discord startup [${params.accountId}] native-slash-command-deploy-rest:${params.method}:error ${Math.max(0, Date.now() - params.startupStartedAt)}ms path=${path} requestMs=${requestMs} error=${formatDiscordDeployErrorMessage(err)}${details}`);
			}
			throw err;
		}
	};
}
function installDeployRestLogging(params) {
	const original = {
		get: params.rest.get.bind(params.rest),
		post: params.rest.post.bind(params.rest),
		put: params.rest.put.bind(params.rest),
		patch: params.rest.patch.bind(params.rest),
		delete: params.rest.delete.bind(params.rest)
	};
	for (const method of Object.keys(original)) {
		const timeout = params.rest.options?.timeout;
		params.rest[method] = wrapDeployRestMethod({
			method,
			original,
			runtime: params.runtime,
			accountId: params.accountId,
			startupStartedAt: params.startupStartedAt,
			timeoutMs: typeof timeout === "number" ? timeout : void 0,
			shouldLogVerbose: params.shouldLogVerbose
		});
	}
	return () => {
		params.rest.get = original.get;
		params.rest.post = original.post;
		params.rest.put = original.put;
		params.rest.patch = original.patch;
		params.rest.delete = original.delete;
	};
}
async function deployDiscordCommands(params) {
	if (!params.enabled) return;
	const startupStartedAt = params.startupStartedAt ?? Date.now();
	const accountId = params.accountId ?? "default";
	const restoreDeployRestLogging = installDeployRestLogging({
		rest: params.client.rest,
		runtime: params.runtime,
		accountId,
		startupStartedAt,
		shouldLogVerbose: params.shouldLogVerbose
	});
	try {
		try {
			await params.client.deployCommands({ mode: "reconcile" });
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
			throw err;
		}
	} catch (err) {
		params.runtime.log?.(warn(`[${accountId}] slash command deploy failed (message send/receive unaffected): ${formatDiscordDeployErrorMessage(err)}${formatDiscordDeployErrorDetails(err)}`));
	} finally {
		restoreDeployRestLogging();
	}
}
function runDiscordCommandDeployInBackground(params) {
	if (!params.enabled) return;
	logDiscordStartupPhase$1({
		runtime: params.runtime,
		accountId: params.accountId,
		phase: "deploy-commands:scheduled",
		startAt: params.startupStartedAt,
		details: "mode=reconcile background=true",
		isVerbose: params.isVerbose
	});
	deployDiscordCommands(params).then(() => {
		logDiscordStartupPhase$1({
			runtime: params.runtime,
			accountId: params.accountId,
			phase: "deploy-commands:done",
			startAt: params.startupStartedAt,
			details: "background=true",
			isVerbose: params.isVerbose
		});
	}).catch((err) => {
		params.runtime.log?.(warn(`[${params.accountId}] slash command deploy failed in background (message send/receive unaffected): ${formatErrorMessage(err)}`));
	});
}
//#endregion
//#region extensions/discord/src/monitor/agent-components-reply.ts
async function replySilently(interaction, params) {
	try {
		await interaction.reply(params);
	} catch {}
}
//#endregion
//#region extensions/discord/src/activities/interaction.ts
const REGISTRATION_WIDGET_ID = "AAAAAAAAAAAAAAAAAAAAAA";
const PENDING_LAUNCH_WRITE_BUDGET_MS = 250;
var DiscordActivityButton = class extends Button {
	constructor(ctx, deps) {
		super();
		this.ctx = ctx;
		this.deps = deps;
		this.label = "Open widget";
		this.customId = buildDiscordActivityCustomId(REGISTRATION_WIDGET_ID);
		this.customIdParser = parseDiscordActivityCustomIdForInteraction;
		this.pendingLaunchFailureLogged = false;
	}
	logPendingLaunchFailure(error) {
		if (this.pendingLaunchFailureLogged) return;
		this.pendingLaunchFailureLogged = true;
		this.deps.logError(`discord activity: failed to record pending launch: ${String(error)}`);
	}
	async run(interaction, data) {
		if (typeof data.widgetId !== "string") {
			await this.deps.reply(interaction, {
				content: "This widget is no longer valid.",
				ephemeral: true
			});
			return;
		}
		const runtime = getDiscordActivitiesRuntime();
		const channelId = interaction.rawData.channel_id;
		const discordUserId = interaction.userId;
		if (!runtime || !channelId || !discordUserId) this.logPendingLaunchFailure(/* @__PURE__ */ new Error("missing activity runtime or interaction identity"));
		else {
			const write = runtime.store.recordPendingLaunch({
				accountId: this.ctx.accountId,
				channelId,
				discordUserId,
				widgetId: data.widgetId,
				createdAt: Date.now()
			}).then(() => "written").catch((error) => {
				this.logPendingLaunchFailure(error);
				return "failed";
			});
			let timer;
			const timeout = new Promise((resolve) => {
				timer = setTimeout(() => resolve("timeout"), PENDING_LAUNCH_WRITE_BUDGET_MS);
				timer.unref?.();
			});
			try {
				if (await Promise.race([write, timeout]) === "timeout") this.logPendingLaunchFailure(/* @__PURE__ */ new Error(`pending launch write exceeded ${PENDING_LAUNCH_WRITE_BUDGET_MS}ms`));
			} finally {
				if (timer) clearTimeout(timer);
			}
		}
		await interaction.launchActivity();
	}
};
function createDiscordActivityButton(ctx, applicationId, deps = {}) {
	const runtime = getDiscordActivitiesRuntime();
	if (!runtime || !runtime.isAccountEnabled(ctx.accountId, ctx.cfg)) return null;
	if (applicationId) runtime.registerApplicationId(ctx.accountId, applicationId);
	if (!runtime.resolveAccount(ctx.accountId, ctx.cfg)) return null;
	return new DiscordActivityButton(ctx, {
		reply: deps.reply ?? replySilently,
		logError: deps.logError ?? logError
	});
}
//#endregion
//#region extensions/discord/src/monitor/agent-components-context.ts
function formatUsername(user) {
	if (user.discriminator && user.discriminator !== "0") return `${user.username}#${user.discriminator}`;
	return user.username;
}
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
	try {
		await params.interaction.reply({
			content: "✓",
			...params.replyOpts
		});
	} catch (err) {
		logError(`${params.label}: failed to acknowledge interaction: ${String(err)}`);
	}
}
async function replyUnavailableComponentInteraction(interaction, content) {
	try {
		await interaction.reply({
			content,
			ephemeral: true
		});
	} catch {}
}
function resolveDiscordChannelContext(interaction) {
	const channel = interaction.channel;
	const channelInfo = resolveDiscordChannelInfoSafe(channel);
	const channelName = channelInfo.name;
	const channelSlug = channelName ? normalizeDiscordSlug(channelName) : "";
	const displayChannelSlug = channelName ? normalizeDiscordDisplaySlug(channelName) : "";
	const channelType = channelInfo.type;
	const isThread = isDiscordThreadChannelType(channelType);
	let parentId;
	let parentName;
	let parentSlug = "";
	if (isThread) {
		parentId = channelInfo.parentId;
		parentName = channelInfo.parentName;
		if (parentName) parentSlug = normalizeDiscordSlug(parentName);
	}
	return {
		channelName,
		channelSlug,
		displayChannelSlug,
		channelType,
		isThread,
		parentId,
		parentName,
		parentSlug
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
	const shouldDefer = params.defer !== false && "defer" in interaction;
	let didDefer = false;
	if (shouldDefer) try {
		await interaction.defer({ ephemeral: true });
		didDefer = true;
	} catch (err) {
		logError(`${label}: failed to defer interaction: ${String(err)}`);
	}
	const replyOpts = didDefer ? {} : { ephemeral: true };
	const username = formatUsername(user);
	const userId = user.id;
	const rawGuildId = interaction.rawData.guild_id;
	const channelType = resolveDiscordChannelContext(interaction).channelType;
	const isGroupDm = channelType === ChannelType.GroupDM;
	return {
		channelId,
		user,
		username,
		userId,
		replyOpts,
		rawGuildId,
		isDirectMessage: channelType === ChannelType.DM || !rawGuildId && !isGroupDm && channelType == null,
		isGroupDm,
		memberRoleIds: Array.isArray(interaction.rawData.member?.roles) ? interaction.rawData.member.roles.map((roleId) => roleId) : []
	};
}
//#endregion
//#region extensions/discord/src/monitor/agent-components-live-policy.ts
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
//#endregion
//#region extensions/discord/src/monitor/agent-components-dm-auth.ts
async function ensureDmComponentAuthorized(params) {
	const { ctx, interaction, user, componentLabel, replyOpts } = params;
	const dmPolicy = ctx.dmPolicy ?? "pairing";
	if (ctx.discordConfig?.dm?.enabled === false || dmPolicy === "disabled") {
		logVerbose(`agent ${componentLabel}: blocked (DM policy disabled)`);
		await replySilently(interaction, {
			content: "DM interactions are disabled.",
			...replyOpts
		});
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
		await replySilently(interaction, {
			content: "Access policy changed. Try this interaction again.",
			...replyOpts
		});
		return false;
	}
	if (access.senderAccess.decision === "allow") return true;
	if (access.senderAccess.decision !== "pairing") {
		logVerbose(`agent ${componentLabel}: blocked DM user ${user.id} (not in allowFrom)`);
		await replySilently(interaction, {
			content: `You are not authorized to use this ${componentLabel}.`,
			...replyOpts
		});
		return false;
	}
	if (!(await createChannelPairingChallengeIssuer({
		channel: "discord",
		accountId: ctx.accountId,
		upsertPairingRequest: async ({ id, meta }) => {
			return await upsertChannelPairingRequest$1({
				channel: "discord",
				id,
				accountId: ctx.accountId,
				meta
			});
		}
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
				...replyOpts
			});
		}
	})).created) await replySilently(interaction, {
		content: "Pairing already requested. Ask the bot owner to approve your code.",
		...replyOpts
	});
	return false;
}
async function ensureGroupDmComponentAuthorized(params) {
	const { ctx, interaction, channelId, componentLabel, replyOpts } = params;
	if (!(ctx.discordConfig?.dm?.groupEnabled ?? false)) {
		logVerbose(`agent ${componentLabel}: blocked group dm ${channelId} (group DMs disabled)`);
		await replySilently(interaction, {
			content: "Group DM interactions are disabled.",
			...replyOpts
		});
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
	await replySilently(interaction, {
		content: `You are not authorized to use this ${componentLabel}.`,
		...replyOpts
	});
	return false;
}
async function resolveInteractionContextWithDmAuth(params) {
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return null;
	const interactionCtx = await resolveComponentInteractionContext({
		interaction: params.interaction,
		label: params.label,
		defer: params.defer
	});
	if (!interactionCtx) return null;
	if (ctx.isPolicyCurrent?.() === false) {
		await replySilently(params.interaction, {
			content: "Access policy changed. Try this interaction again.",
			...interactionCtx.replyOpts
		});
		return null;
	}
	if (interactionCtx.isDirectMessage) {
		if (!await ensureDmComponentAuthorized({
			ctx,
			interaction: params.interaction,
			user: interactionCtx.user,
			componentLabel: params.componentLabel,
			replyOpts: interactionCtx.replyOpts
		})) return null;
	}
	if (interactionCtx.isGroupDm) {
		if (!await ensureGroupDmComponentAuthorized({
			ctx,
			interaction: params.interaction,
			channelId: interactionCtx.channelId,
			componentLabel: params.componentLabel,
			replyOpts: interactionCtx.replyOpts
		})) return null;
	}
	return interactionCtx;
}
//#endregion
//#region extensions/discord/src/monitor/agent-components-guild-auth.ts
function resolveComponentRuntimeGroupPolicy(ctx) {
	return resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: ctx.cfg.channels?.discord !== void 0,
		groupPolicy: ctx.discordConfig?.groupPolicy,
		defaultGroupPolicy: ctx.cfg.channels?.defaults?.groupPolicy
	}).groupPolicy;
}
async function ensureGuildComponentMemberAllowed(params) {
	const { interaction, guildInfo, channelId, rawGuildId, channelCtx, memberRoleIds, user, replyOpts, componentLabel, unauthorizedReply } = params;
	if (!rawGuildId) return true;
	const replyUnauthorized = async () => {
		await replySilently(interaction, {
			content: unauthorizedReply,
			...replyOpts
		});
	};
	const channelConfig = resolveDiscordChannelConfigWithFallback({
		guildInfo,
		channelId,
		channelName: channelCtx.channelName,
		channelSlug: channelCtx.channelSlug,
		parentId: channelCtx.parentId,
		parentName: channelCtx.parentName,
		parentSlug: channelCtx.parentSlug,
		scope: channelCtx.isThread ? "thread" : "channel"
	});
	if (channelConfig?.enabled === false) {
		await replyUnauthorized();
		return false;
	}
	const channelAllowlistConfigured = Boolean(guildInfo?.channels) && Object.keys(guildInfo?.channels ?? {}).length > 0;
	const channelAllowed = channelConfig?.allowed !== false;
	if (!isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(guildInfo),
		channelAllowlistConfigured,
		channelAllowed
	})) {
		await replyUnauthorized();
		return false;
	}
	if (channelConfig?.allowed === false) {
		await replyUnauthorized();
		return false;
	}
	const { memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig,
		guildInfo,
		memberRoleIds,
		sender: {
			id: user.id,
			name: user.username,
			tag: user.discriminator ? `${user.username}#${user.discriminator}` : void 0
		},
		allowNameMatching: params.allowNameMatching
	});
	if (memberAllowed) return true;
	logVerbose(`agent ${componentLabel}: blocked user ${user.id} (not in users/roles allowlist)`);
	await replyUnauthorized();
	return false;
}
async function ensureComponentUserAllowed(params) {
	const allowList = normalizeDiscordAllowList(params.entry.allowedUsers, [
		"discord:",
		"user:",
		"pk:"
	]);
	if (!allowList) return true;
	if (resolveDiscordAllowListMatch({
		allowList,
		candidate: {
			id: params.user.id,
			name: params.user.username,
			tag: formatDiscordUserTag(params.user)
		},
		allowNameMatching: params.allowNameMatching
	}).allowed) return true;
	logVerbose(`discord component ${params.componentLabel}: blocked user ${params.user.id} (not in allowedUsers)`);
	await replySilently(params.interaction, {
		content: params.unauthorizedReply,
		...params.replyOpts
	});
	return false;
}
async function ensureAgentComponentInteractionAllowed(params) {
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return null;
	const guildInfo = resolveDiscordGuildEntry({
		guild: params.interaction.guild ?? void 0,
		guildId: params.rawGuildId,
		guildEntries: ctx.guildEntries
	});
	const channelCtx = resolveDiscordChannelContext(params.interaction);
	if (!await ensureGuildComponentMemberAllowed({
		interaction: params.interaction,
		guildInfo,
		channelId: params.channelId,
		rawGuildId: params.rawGuildId,
		channelCtx,
		memberRoleIds: params.memberRoleIds,
		user: params.user,
		replyOpts: params.replyOpts,
		componentLabel: params.componentLabel,
		unauthorizedReply: params.unauthorizedReply,
		allowNameMatching: isDangerousNameMatchingEnabled(ctx.discordConfig),
		groupPolicy: resolveComponentRuntimeGroupPolicy(ctx)
	})) return null;
	if (ctx.isPolicyCurrent?.() === false) {
		await replySilently(params.interaction, {
			content: "Access policy changed. Try this interaction again.",
			...params.replyOpts
		});
		return null;
	}
	return { parentId: channelCtx.parentId };
}
async function resolveAuthorizedComponentInteraction(params) {
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return null;
	const interactionCtx = await resolveInteractionContextWithDmAuth({
		ctx,
		interaction: params.interaction,
		label: params.label,
		componentLabel: params.componentLabel,
		defer: params.defer
	});
	if (!interactionCtx) return null;
	const { channelId, user, replyOpts, rawGuildId, memberRoleIds } = interactionCtx;
	const guildInfo = resolveDiscordGuildEntry({
		guild: params.interaction.guild ?? void 0,
		guildId: rawGuildId,
		guildEntries: ctx.guildEntries
	});
	const channelCtx = resolveDiscordChannelContext(params.interaction);
	const allowNameMatching = isDangerousNameMatchingEnabled(ctx.discordConfig);
	const channelConfig = resolveDiscordChannelConfigWithFallback({
		guildInfo,
		channelId,
		channelName: channelCtx.channelName,
		channelSlug: channelCtx.channelSlug,
		parentId: channelCtx.parentId,
		parentName: channelCtx.parentName,
		parentSlug: channelCtx.parentSlug,
		scope: channelCtx.isThread ? "thread" : "channel"
	});
	if (!await ensureGuildComponentMemberAllowed({
		interaction: params.interaction,
		guildInfo,
		channelId,
		rawGuildId,
		channelCtx,
		memberRoleIds,
		user,
		replyOpts,
		componentLabel: params.componentLabel,
		unauthorizedReply: params.unauthorizedReply,
		allowNameMatching,
		groupPolicy: resolveComponentRuntimeGroupPolicy(ctx)
	})) return null;
	const commandAuthorized = await resolveComponentCommandAuthorized({
		ctx,
		interactionCtx,
		channelConfig,
		guildInfo,
		allowNameMatching
	});
	if (ctx.isPolicyCurrent?.() === false) {
		await replySilently(params.interaction, {
			content: "Access policy changed. Try this interaction again.",
			...replyOpts
		});
		return null;
	}
	return {
		ctx,
		interactionCtx,
		channelCtx,
		guildInfo,
		channelConfig,
		allowNameMatching,
		commandAuthorized,
		user,
		replyOpts
	};
}
async function resolveComponentCommandAuthorized(params) {
	const { ctx, interactionCtx, channelConfig, guildInfo } = params;
	if (interactionCtx.isDirectMessage) return true;
	const { ownerAllowList, ownerAllowed: ownerOk } = resolveDiscordOwnerAccess({
		allowFrom: ctx.allowFrom,
		sender: {
			id: interactionCtx.user.id,
			name: interactionCtx.user.username,
			tag: formatDiscordUserTag(interactionCtx.user)
		},
		allowNameMatching: params.allowNameMatching
	});
	const { hasAccessRestrictions, memberAllowed } = resolveDiscordMemberAccessState({
		channelConfig,
		guildInfo,
		memberRoleIds: interactionCtx.memberRoleIds,
		sender: {
			id: interactionCtx.user.id,
			name: interactionCtx.user.username,
			tag: formatDiscordUserTag(interactionCtx.user)
		},
		allowNameMatching: params.allowNameMatching
	});
	return resolveCommandAuthorizedFromAuthorizers({
		useAccessGroups: true,
		authorizers: [{
			configured: ownerAllowList != null,
			allowed: ownerOk
		}, {
			configured: hasAccessRestrictions,
			allowed: memberAllowed
		}],
		modeWhenAccessGroupsOff: "configured"
	});
}
//#endregion
//#region extensions/discord/src/monitor/agent-components-data.ts
function readParsedComponentId(data) {
	if (!data || typeof data !== "object") return;
	return "cid" in data ? data.cid : data.componentId;
}
function normalizeComponentId(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed ? trimmed : void 0;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
}
function mapOptionLabels(options, values) {
	if (!options || options.length === 0) return values;
	const map = new Map(options.map((option) => [option.value, option.label]));
	return values.map((value) => map.get(value) ?? value);
}
function parseAgentComponentData(data) {
	const raw = readParsedComponentId(data);
	const componentId = typeof raw === "string" ? decodeCustomIdComponent(raw) : typeof raw === "number" ? String(raw) : null;
	if (!componentId) return null;
	return { componentId };
}
function parseDiscordComponentData(data, customId) {
	if (!data || typeof data !== "object") return null;
	const rawComponentId = readParsedComponentId(data);
	const rawModalId = "mid" in data ? data.mid : data.modalId;
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
	if (data && typeof data === "object") {
		const modalId = normalizeComponentId("mid" in data ? data.mid : data.modalId);
		if (modalId) return modalId;
	}
	if (customId) return parseDiscordModalCustomId(customId);
	return null;
}
function resolveInteractionCustomId(interaction) {
	if (!interaction?.rawData || typeof interaction.rawData !== "object") return;
	if (!("data" in interaction.rawData)) return;
	const customId = interaction.rawData.data?.custom_id;
	if (typeof customId !== "string") return;
	const trimmed = customId.trim();
	return trimmed ? trimmed : void 0;
}
function mapSelectValues(entry, values) {
	if (entry.selectType === "string") return mapOptionLabels(entry.options, values);
	if (entry.selectType === "user") return values.map((value) => `user:${value}`);
	if (entry.selectType === "role") return values.map((value) => `role:${value}`);
	if (entry.selectType === "mentionable") return values.map((value) => `mentionable:${value}`);
	if (entry.selectType === "channel") return values.map((value) => `channel:${value}`);
	return values;
}
function resolveModalFieldValues(field, interaction) {
	const fields = interaction.fields;
	const optionLabels = field.options?.map((option) => ({
		value: option.value,
		label: option.label
	}));
	const required = field.required === true;
	try {
		switch (field.type) {
			case "text": {
				const value = required ? fields.getText(field.id, true) : fields.getText(field.id);
				return value ? [value] : [];
			}
			case "select":
			case "checkbox":
			case "radio": return mapOptionLabels(optionLabels, required ? fields.getStringSelect(field.id, true) : fields.getStringSelect(field.id) ?? []);
			case "role-select": try {
				return (required ? fields.getRoleSelect(field.id, true) : fields.getRoleSelect(field.id) ?? []).map((role) => role.name ?? role.id);
			} catch {
				return required ? fields.getStringSelect(field.id, true) : fields.getStringSelect(field.id) ?? [];
			}
			case "user-select": return (required ? fields.getUserSelect(field.id, true) : fields.getUserSelect(field.id) ?? []).map((user) => formatDiscordUserTag(user));
			default: return [];
		}
	} catch (err) {
		logError(`agent modal: failed to read field ${field.id}: ${String(err)}`);
		return [];
	}
}
function formatModalSubmissionText(entry, interaction) {
	const lines = [`Form "${entry.title}" submitted.`];
	for (const field of entry.fields) {
		const values = resolveModalFieldValues(field, interaction);
		if (values.length === 0) continue;
		lines.push(`- ${field.label}: ${values.join(", ")}`);
	}
	if (lines.length === 1) lines.push("- (no values)");
	return lines.join("\n");
}
//#endregion
//#region extensions/discord/src/monitor/agent-components-helpers.ts
const AGENT_BUTTON_KEY = "agent";
const AGENT_SELECT_KEY = "agentsel";
//#endregion
//#region extensions/discord/src/monitor/reply-context.ts
function resolveReplyContext(message, resolveDiscordMessageText) {
	const referenced = message.referencedMessage;
	if (!referenced?.author) return null;
	const referencedText = resolveDiscordMessageText(referenced, { includeForwarded: true });
	const hasVisibleMedia = referenced.attachments.length > 0 || !referencedText && resolveDiscordMessageStickers(referenced).length > 0;
	if (!referencedText && !hasVisibleMedia) return null;
	const sender = resolveDiscordSenderIdentity({
		author: referenced.author,
		pluralkitInfo: null
	});
	return {
		id: referenced.id,
		channelId: referenced.channelId,
		sender: sender.tag ?? sender.label ?? "unknown",
		senderId: referenced.author.id,
		senderName: referenced.author.username ?? void 0,
		senderTag: sender.tag ?? void 0,
		memberRoleIds: (() => {
			const roles = referenced.member?.roles;
			return Array.isArray(roles) ? roles.map((roleId) => roleId) : void 0;
		})(),
		...referencedText ? { body: referencedText } : {},
		timestamp: resolveTimestampMs(referenced.timestamp)
	};
}
function buildDirectLabel(author, tagOverride) {
	return `${(tagOverride?.trim() || resolveDiscordSenderIdentity({
		author,
		pluralkitInfo: null
	}).tag) ?? "unknown"} user id:${author.id}`;
}
function buildGuildLabel(params) {
	const { guild, channelName, channelId } = params;
	return `${guild?.name ?? "Guild"} #${channelName} channel id:${channelId}`;
}
//#endregion
//#region extensions/discord/src/monitor/reply-safety.ts
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
function hasNonTextReplyPayloadContent(payload) {
	return payload.audioAsVoice === true || hasNonEmptyRecord(payload.channelData) || hasInteractiveOrPresentationBlocks(payload.interactive) || hasInteractiveOrPresentationBlocks(payload.presentation);
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
		if (!resolveSendableOutboundReplyParts(nextPayload).hasContent && !hasNonTextReplyPayloadContent(nextPayload)) continue;
		safePayloads.push(nextPayload);
	}
	return safePayloads;
}
//#endregion
//#region extensions/discord/src/monitor/reply-delivery.ts
function formatDiscordReplyDeliveryFailure(params) {
	const context = [`target=${params.target}`, params.sessionKey ? `session=${params.sessionKey}` : void 0].filter(Boolean).join(" ");
	return `discord ${params.kind} reply failed (${context}): ${String(params.err)}`;
}
function formatDiscordReplySkip(params) {
	const context = [`target=${params.target}`, params.sessionKey ? `session=${params.sessionKey}` : void 0].filter(Boolean).join(" ");
	return `discord ${params.kind} reply skipped (${params.reason}): ${context}`;
}
function resolveTargetChannelId(target) {
	if (!target.startsWith("channel:")) return;
	return target.slice(8).trim() || void 0;
}
function resolveBoundThreadBinding(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!params.threadBindings || !sessionKey) return;
	const targetChannelId = resolveTargetChannelId(params.target);
	if (!targetChannelId) return;
	return params.threadBindings.listBySessionKey(sessionKey).find((entry) => entry.threadId === targetChannelId);
}
function resolveBindingIdentity(cfg, binding) {
	if (!binding) return;
	const displayName = `🤖 ${binding.label?.trim() || binding.agentId}`.trim() || "🤖 agent";
	const identity = { name: truncateUtf16Safe(displayName, 80) };
	try {
		const avatar = resolveAgentAvatar(cfg, binding.agentId);
		if (avatar.kind === "remote") identity.avatarUrl = avatar.url;
	} catch {}
	return identity;
}
function createDiscordDeliveryDeps(params) {
	return {
		discord: (to, text, opts) => sendMessageDiscord(to, text, {
			...opts,
			cfg: opts?.cfg ?? params.cfg,
			token: params.token,
			rest: params.rest,
			...params.allowedMentions ? { allowedMentions: params.allowedMentions } : {}
		}),
		discordVoice: (to, audioPath, opts) => sendVoiceMessageDiscord(to, audioPath, {
			...opts,
			cfg: opts?.cfg ?? params.cfg,
			token: params.token,
			rest: params.rest
		})
	};
}
function resolveDiscordDeliveryOptions(params) {
	const binding = resolveBoundThreadBinding({
		threadBindings: params.threadBindings,
		sessionKey: params.sessionKey,
		target: params.target
	});
	return {
		to: binding ? `channel:${binding.channelId}` : params.target,
		threadId: binding?.threadId,
		agentId: binding?.agentId,
		identity: resolveBindingIdentity(params.cfg, binding),
		mediaAccess: params.mediaLocalRoots?.length ? { localRoots: params.mediaLocalRoots } : void 0,
		replyToMode: params.replyToMode ?? "all",
		formatting: {
			textLimit: params.textLimit,
			maxLinesPerMessage: params.maxLinesPerMessage,
			tableMode: params.tableMode,
			chunkMode: params.chunkMode
		}
	};
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
	params.runtime;
	const delivery = resolveDiscordDeliveryOptions(params);
	const payloads = sanitizeDiscordFrontChannelReplyPayloads(params.replies, { kind: params.kind }).map(formatDiscordReasoningPayload).map((payload) => params.bindPendingFinalDelivery?.(payload) ?? payload);
	if (payloads.length === 0) return {
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
	const send = await sendDurableMessageBatch({
		cfg: params.cfg,
		channel: "discord",
		to: delivery.to,
		accountId: params.accountId,
		payloads,
		replyToId: normalizeOptionalString(params.replyToId),
		replyToMode: delivery.replyToMode,
		formatting: delivery.formatting,
		threadId: delivery.threadId,
		identity: delivery.identity,
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertPlatformSendAuthorized,
		deps: createDiscordDeliveryDeps({
			cfg: params.cfg,
			token: params.token,
			rest: params.rest,
			allowedMentions: params.allowedMentions
		}),
		mediaAccess: delivery.mediaAccess,
		session: buildOutboundSessionContext({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: delivery.agentId,
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
	if (send.results.length === 0) throw new Error(`discord final reply produced no delivered message for ${delivery.to}`);
	const deliveryResult = {
		messageIds: listMessageReceiptPlatformIds(send.receipt),
		receipt: send.receipt,
		visibleReplySent: true
	};
	if (send.status === "partial_failed") throw createChannelPartialDeliveryError(send.error, deliveryResult);
	return deliveryResult;
}
//#endregion
//#region extensions/discord/src/monitor/agent-components.dispatch.ts
const loadConversationRuntime$1 = createLazyRuntimeModule(() => import("./agent-components.runtime-CEPrf2SY.mjs"));
const loadTypingRuntime = createLazyRuntimeModule(() => import("./typing-BKZL5fGj.mjs").then((n) => n.n));
function buildDiscordComponentConversationLabel(params) {
	if (params.interactionCtx.isDirectMessage) return buildDirectLabel(params.interactionCtx.user);
	if (params.interactionCtx.isGroupDm) return `Group DM #${params.channelCtx.channelName ?? params.interactionCtx.channelId} channel id:${params.interactionCtx.channelId}`;
	return buildGuildLabel({
		guild: params.interaction.guild ?? void 0,
		channelName: params.channelCtx.channelName ?? params.interactionCtx.channelId,
		channelId: params.interactionCtx.channelId
	});
}
function resolveDiscordComponentChatType(interactionCtx) {
	if (interactionCtx.isDirectMessage) return "direct";
	if (interactionCtx.isGroupDm) return "group";
	return "channel";
}
function resolveDiscordComponentOriginatingTo(interactionCtx) {
	return resolveDiscordConversationIdentity({
		isDirectMessage: interactionCtx.isDirectMessage,
		userId: interactionCtx.userId,
		channelId: interactionCtx.channelId
	});
}
async function dispatchDiscordComponentEvent(params) {
	const { ctx, interaction, interactionCtx, channelCtx, guildInfo, eventText } = params;
	const runtime = ctx.runtime ?? createNonExitingRuntime();
	const route = resolveAgentComponentRoute({
		ctx,
		rawGuildId: interactionCtx.rawGuildId,
		memberRoleIds: interactionCtx.memberRoleIds,
		isDirectMessage: interactionCtx.isDirectMessage,
		isGroupDm: interactionCtx.isGroupDm,
		userId: interactionCtx.userId,
		channelId: interactionCtx.channelId,
		parentId: channelCtx.parentId
	});
	const sessionKey = params.routeOverrides?.sessionKey ?? route.sessionKey;
	const agentId = params.routeOverrides?.agentId ?? route.agentId;
	const accountId = params.routeOverrides?.accountId ?? route.accountId;
	const inboundLastRouteSessionKey = sessionKey;
	const fromLabel = buildDiscordComponentConversationLabel({
		interactionCtx,
		interaction,
		channelCtx
	});
	const chatType = resolveDiscordComponentChatType(interactionCtx);
	const senderName = interactionCtx.user.globalName ?? interactionCtx.user.username;
	const senderUsername = interactionCtx.user.username;
	const senderTag = formatDiscordUserTag(interactionCtx.user);
	const groupChannel = !interactionCtx.isDirectMessage && channelCtx.displayChannelSlug ? `#${channelCtx.displayChannelSlug}` : void 0;
	const groupSubject = interactionCtx.isDirectMessage ? void 0 : groupChannel;
	const channelConfig = resolveDiscordChannelConfigWithFallback({
		guildInfo,
		channelId: interactionCtx.channelId,
		channelName: channelCtx.channelName,
		channelSlug: channelCtx.channelSlug,
		parentId: channelCtx.parentId,
		parentName: channelCtx.parentName,
		parentSlug: channelCtx.parentSlug,
		scope: channelCtx.isThread ? "thread" : "channel"
	});
	const allowNameMatching = isDangerousNameMatchingEnabled(ctx.discordConfig);
	const { ownerAllowFrom } = buildDiscordInboundAccessContext({
		channelConfig,
		guildInfo,
		sender: {
			id: interactionCtx.user.id,
			name: interactionCtx.user.username,
			tag: senderTag
		},
		allowNameMatching,
		isGuild: !interactionCtx.isDirectMessage
	});
	const groupSystemPrompt = buildDiscordGroupSystemPrompt(channelConfig);
	const pinnedMainDmOwner = interactionCtx.isDirectMessage ? resolvePinnedMainDmOwnerFromAllowlist$1({
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
	const commandAuthorized = await resolveComponentCommandAuthorized({
		ctx,
		interactionCtx,
		channelConfig,
		guildInfo,
		allowNameMatching
	});
	const storePath = resolveStorePath$1(ctx.cfg.session?.store, { agentId });
	const envelopeOptions = resolveEnvelopeFormatOptions(ctx.cfg);
	const previousTimestamp = readSessionUpdatedAt$1({
		storePath,
		sessionKey
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
	const { createReplyReferencePlanner, finalizeInboundContext, resolveChunkMode, resolveTextChunkLimit } = await (async () => {
		return { ...await loadConversationRuntime$1() };
	})();
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
		GroupSubject: groupSubject,
		GroupChannel: groupChannel,
		MemberRoleIds: interactionCtx.memberRoleIds,
		GroupSystemPrompt: interactionCtx.isDirectMessage ? void 0 : groupSystemPrompt,
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
		OriginatingTo: resolveDiscordComponentOriginatingTo(interactionCtx) ?? `channel:${interactionCtx.channelId}`
	});
	const deliverTarget = `channel:${interactionCtx.channelId}`;
	const typingChannelId = interactionCtx.channelId;
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
						sessionKey: inboundLastRouteSessionKey,
						channel: "discord",
						to: resolveDiscordComponentOriginatingTo(interactionCtx) ?? `user:${interactionCtx.userId}`,
						accountId,
						mainDmOwnerPin: inboundLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner ? {
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
							runtime,
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
								channelId: typingChannelId
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
//#endregion
//#region extensions/discord/src/interactive-dispatch.ts
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
//#endregion
//#region extensions/discord/src/monitor/agent-components.plugin-interactive.ts
const loadConversationRuntime = createLazyRuntimeModule(() => import("./agent-components.runtime-CEPrf2SY.mjs"));
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
	const respond = {
		acknowledge: async () => {
			if (responded) return;
			await params.interaction.acknowledge();
			acknowledged = true;
			responded = true;
		},
		reply: async ({ text, ephemeral = true }) => {
			responded = true;
			const payload = {
				content: text,
				ephemeral
			};
			await (acknowledged ? params.interaction.followUp(payload) : params.interaction.reply(payload));
		},
		followUp: async ({ text, ephemeral = true }) => {
			responded = true;
			await params.interaction.followUp({
				content: text,
				ephemeral
			});
		},
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
	const conversationRuntime = await loadConversationRuntime();
	const pluginBindingApproval = conversationRuntime.parsePluginBindingApprovalCustomId(params.data);
	if (pluginBindingApproval) {
		const { buildPluginBindingResolvedText, resolvePluginConversationBindingApproval } = conversationRuntime;
		try {
			await respond.acknowledge();
		} catch {}
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
		onMatched: async () => {
			try {
				await respond.acknowledge();
			} catch {}
		}
	});
	if (!dispatched.matched) return "unmatched";
	if (dispatched.handled) {
		if (!responded) try {
			await respond.acknowledge();
		} catch {}
		return "handled";
	}
	return "unmatched";
}
//#endregion
//#region extensions/discord/src/monitor/agent-components.handlers.ts
const loadComponentsRuntime = createLazyRuntimeModule(() => import("./components-yBEb75bB.mjs").then((n) => n.t));
async function handleDiscordComponentEvent(params) {
	const parsed = parseDiscordComponentData(params.data, resolveInteractionCustomId(params.interaction));
	if (!parsed) {
		logError(`${params.label}: failed to parse component data`);
		await replyUnavailableComponentInteraction(params.interaction, "This component is no longer valid.");
		return;
	}
	const entry = await resolveDiscordComponentEntryWithPersistence({
		id: parsed.componentId,
		consume: false
	});
	if (!entry) {
		await replyUnavailableComponentInteraction(params.interaction, "This component has expired.");
		return;
	}
	const unauthorizedReply = `You are not authorized to use this ${params.componentLabel}.`;
	const authorized = await resolveAuthorizedComponentInteraction({
		ctx: params.ctx,
		interaction: params.interaction,
		label: params.label,
		componentLabel: params.componentLabel,
		unauthorizedReply,
		defer: false
	});
	if (!authorized) return;
	const { ctx, interactionCtx, channelCtx, guildInfo, allowNameMatching, commandAuthorized, user, replyOpts } = authorized;
	if (!await ensureComponentUserAllowed({
		entry,
		interaction: params.interaction,
		user,
		replyOpts,
		componentLabel: params.componentLabel,
		unauthorizedReply,
		allowNameMatching
	})) return;
	const consumed = await resolveDiscordComponentEntryWithPersistence({
		id: parsed.componentId,
		consume: !entry.reusable
	});
	if (!consumed) {
		await replyUnavailableComponentInteraction(params.interaction, "This component has expired.");
		return;
	}
	if (consumed.kind === "modal-trigger") {
		await replyUnavailableComponentInteraction(params.interaction, "This form is no longer available.");
		return;
	}
	const values = params.values ? mapSelectValues(consumed, params.values) : void 0;
	const selectedCallbackData = consumed.kind === "select" && consumed.callbackDataKind === "callback" && params.values?.length === 1 ? params.values[0]?.trim() : void 0;
	const pluginCallbackData = consumed.callbackData ?? selectedCallbackData;
	if (pluginCallbackData) {
		if (await dispatchPluginDiscordInteractiveEvent({
			ctx,
			interaction: params.interaction,
			interactionCtx,
			channelCtx,
			isAuthorizedSender: commandAuthorized,
			data: pluginCallbackData,
			kind: consumed.kind === "select" ? "select" : "button",
			values,
			messageId: consumed.messageId ?? params.interaction.message?.id
		}) === "handled") return;
	}
	const buttonCallbackFallback = consumed.kind === "button" && consumed.callbackDataKind !== "callback" ? consumed.callbackData?.trim() : void 0;
	const selectedCommandFallback = consumed.kind === "select" && consumed.callbackDataKind === "command" && params.values?.length === 1 ? params.values[0]?.trim() : void 0;
	const eventText = buttonCallbackFallback || selectedCommandFallback || (await loadComponentsRuntime()).formatDiscordComponentEventText({
		kind: consumed.kind === "select" ? "select" : "button",
		label: consumed.label,
		values
	});
	try {
		await params.interaction.reply({
			content: "✓",
			...replyOpts
		});
	} catch (err) {
		logError(`${params.label}: failed to acknowledge interaction: ${String(err)}`);
	}
	await dispatchDiscordComponentEvent({
		ctx,
		interaction: params.interaction,
		interactionCtx,
		channelCtx,
		guildInfo,
		eventText,
		commandSource: consumed.callbackDataKind === "command" && (buttonCallbackFallback || selectedCommandFallback) ? "native" : void 0,
		replyToId: consumed.messageId ?? params.interaction.message?.id,
		routeOverrides: {
			sessionKey: consumed.sessionKey,
			agentId: consumed.agentId,
			accountId: consumed.accountId
		}
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
	const unauthorizedReply = "You are not authorized to use this form.";
	const authorized = await resolveAuthorizedComponentInteraction({
		ctx: params.ctx,
		interaction: params.interaction,
		label: params.label,
		componentLabel: "form",
		unauthorizedReply,
		defer: false
	});
	if (!authorized) return;
	const { user, replyOpts, allowNameMatching } = authorized;
	if (!await ensureComponentUserAllowed({
		entry,
		interaction: params.interaction,
		user,
		replyOpts,
		componentLabel: "form",
		unauthorizedReply,
		allowNameMatching
	})) return;
	const consumed = await resolveDiscordComponentEntryWithPersistence({
		id: parsed.componentId,
		consume: !entry.reusable
	});
	if (!consumed) {
		await replyUnavailableComponentInteraction(params.interaction, "This form has expired.");
		return;
	}
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
const discordComponentControlHandlers = {
	handleComponentEvent: handleDiscordComponentEvent,
	handleModalTrigger: handleDiscordModalTrigger
};
//#endregion
//#region extensions/discord/src/monitor/agent-components.modal.ts
var DiscordComponentModal = class extends Modal {
	constructor(ctx) {
		super();
		this.title = "OpenClaw form";
		this.customId = "__openclaw_discord_component_modal_wildcard__";
		this.components = [];
		this.customIdParser = parseDiscordModalCustomIdForInteraction;
		this.ctx = ctx;
	}
	async run(interaction, data) {
		const modalId = parseDiscordModalId(data, resolveInteractionCustomId(interaction));
		if (!modalId) {
			logError("discord component modal: missing modal id");
			await replyUnavailableComponentInteraction(interaction, "This form is no longer valid.");
			return;
		}
		const modalEntry = await resolveDiscordModalEntryWithPersistence({
			id: modalId,
			consume: false
		});
		if (!modalEntry) {
			await replyUnavailableComponentInteraction(interaction, "This form has expired.");
			return;
		}
		const unauthorizedReply = "You are not authorized to use this form.";
		const authorized = await resolveAuthorizedComponentInteraction({
			ctx: this.ctx,
			interaction,
			label: "discord component modal",
			componentLabel: "form",
			unauthorizedReply,
			defer: false
		});
		if (!authorized) return;
		const ctx = authorized.ctx;
		const { interactionCtx, channelCtx, guildInfo, allowNameMatching, commandAuthorized, user, replyOpts } = authorized;
		if (!await ensureComponentUserAllowed({
			entry: {
				id: modalEntry.id,
				kind: "button",
				label: modalEntry.title,
				allowedUsers: modalEntry.allowedUsers
			},
			interaction,
			user,
			replyOpts,
			componentLabel: "form",
			unauthorizedReply,
			allowNameMatching
		})) return;
		const consumed = await resolveDiscordModalEntryWithPersistence({
			id: modalId,
			consume: !modalEntry.reusable
		});
		if (!consumed) {
			await replyUnavailableComponentInteraction(interaction, "This form has expired.");
			return;
		}
		if (consumed.callbackData) {
			const fields = consumed.fields.map((field) => ({
				id: field.id,
				name: field.name,
				values: resolveModalFieldValues(field, interaction)
			}));
			if (await dispatchPluginDiscordInteractiveEvent({
				ctx,
				interaction,
				interactionCtx,
				channelCtx,
				isAuthorizedSender: commandAuthorized,
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
		await dispatchDiscordComponentEvent({
			ctx,
			interaction,
			interactionCtx,
			channelCtx,
			guildInfo,
			eventText: formatModalSubmissionText(consumed, interaction),
			replyToId: consumed.messageId,
			routeOverrides: {
				sessionKey: consumed.sessionKey,
				agentId: consumed.agentId,
				accountId: consumed.accountId
			}
		});
	}
};
//#endregion
//#region extensions/discord/src/monitor/agent-components.system-controls.ts
async function runAgentSystemControlInteraction(params) {
	const parsed = parseAgentComponentData(params.data);
	if (!parsed) {
		logError(`${params.label}: failed to parse component data`);
		await replyUnavailableComponentInteraction(params.interaction, params.invalidReply);
		return;
	}
	const { componentId } = parsed;
	const ctx = await resolveAgentComponentPolicyContext(params);
	if (!ctx) return;
	const interactionCtx = await resolveInteractionContextWithDmAuth({
		ctx,
		interaction: params.interaction,
		label: params.label,
		componentLabel: params.interactionComponentLabel,
		defer: false
	});
	if (!interactionCtx) return;
	const { channelId, user, username, userId, replyOpts, rawGuildId, isDirectMessage, isGroupDm, memberRoleIds } = interactionCtx;
	const allowed = await ensureAgentComponentInteractionAllowed({
		ctx,
		interaction: params.interaction,
		channelId,
		rawGuildId,
		memberRoleIds,
		user,
		replyOpts,
		componentLabel: params.authorizationComponentLabel,
		unauthorizedReply: params.unauthorizedReply
	});
	if (!allowed) return;
	const route = resolveAgentComponentRoute({
		ctx,
		rawGuildId,
		memberRoleIds,
		isDirectMessage,
		isGroupDm,
		userId,
		channelId,
		parentId: allowed.parentId
	});
	const eventText = params.formatEventText({
		componentId,
		username,
		userId
	});
	logDebug(`${params.label}: enqueuing event for channel ${channelId}: ${eventText}`);
	enqueueRoutedSystemEvent$1(eventText, route, { contextKey: `${params.contextKeyPrefix}:${channelId}:${componentId}:${userId}:${params.interaction.id}` });
	await ackComponentInteraction({
		interaction: params.interaction,
		replyOpts,
		label: params.label
	});
}
var AgentComponentButton = class extends Button {
	constructor(ctx) {
		super();
		this.label = AGENT_BUTTON_KEY;
		this.customId = `${AGENT_BUTTON_KEY}:seed=1`;
		this.style = ButtonStyle.Primary;
		this.ctx = ctx;
	}
	async run(interaction, data) {
		await runAgentSystemControlInteraction({
			ctx: this.ctx,
			interaction,
			data,
			label: "agent button",
			interactionComponentLabel: "button",
			authorizationComponentLabel: "button",
			invalidReply: "This button is no longer valid.",
			unauthorizedReply: "You are not authorized to use this button.",
			contextKeyPrefix: "discord:agent-button",
			formatEventText: ({ componentId, username, userId }) => `[Discord component: ${componentId} clicked by ${username} (${userId})]`
		});
	}
};
var AgentSelectMenu = class extends StringSelectMenu {
	constructor(ctx) {
		super();
		this.customId = `${AGENT_SELECT_KEY}:seed=1`;
		this.options = [];
		this.ctx = ctx;
	}
	async run(interaction, data) {
		const values = interaction.values ?? [];
		const valuesText = values.length > 0 ? ` (selected: ${values.join(", ")})` : "";
		await runAgentSystemControlInteraction({
			ctx: this.ctx,
			interaction,
			data,
			label: "agent select",
			interactionComponentLabel: "select menu",
			authorizationComponentLabel: "select",
			invalidReply: "This select menu is no longer valid.",
			unauthorizedReply: "You are not authorized to use this select menu.",
			contextKeyPrefix: "discord:agent-select",
			formatEventText: ({ componentId, username, userId }) => `[Discord select menu: ${componentId} interacted by ${username} (${userId})${valuesText}]`
		});
	}
};
function createAgentComponentButton(ctx) {
	return new AgentComponentButton(ctx);
}
function createAgentSelectMenu(ctx) {
	return new AgentSelectMenu(ctx);
}
//#endregion
//#region extensions/discord/src/monitor/agent-components.wildcard-controls.ts
const SELECT_CONTROLS = {
	string: {
		type: ComponentType.StringSelect,
		customId: "__openclaw_discord_component_string_select_wildcard__",
		componentLabel: "select menu",
		label: "discord component select"
	},
	user: {
		type: ComponentType.UserSelect,
		customId: "__openclaw_discord_component_user_select_wildcard__",
		componentLabel: "user select",
		label: "discord component user select"
	},
	role: {
		type: ComponentType.RoleSelect,
		customId: "__openclaw_discord_component_role_select_wildcard__",
		componentLabel: "role select",
		label: "discord component role select"
	},
	mentionable: {
		type: ComponentType.MentionableSelect,
		customId: "__openclaw_discord_component_mentionable_select_wildcard__",
		componentLabel: "mentionable select",
		label: "discord component mentionable select"
	},
	channel: {
		type: ComponentType.ChannelSelect,
		customId: "__openclaw_discord_component_channel_select_wildcard__",
		componentLabel: "channel select",
		label: "discord component channel select"
	}
};
var DiscordComponentSelectControl = class extends BaseMessageInteractiveComponent {
	constructor(spec, ctx, handlers) {
		super();
		this.spec = spec;
		this.ctx = ctx;
		this.handlers = handlers;
		this.customIdParser = parseDiscordComponentCustomIdForInteraction;
		this.type = spec.type;
		this.customId = spec.customId;
	}
	serialize() {
		return this.type === ComponentType.StringSelect ? {
			type: this.type,
			custom_id: this.customId,
			options: []
		} : {
			type: this.type,
			custom_id: this.customId
		};
	}
	async run(interaction, data) {
		await this.handlers.handleComponentEvent({
			ctx: this.ctx,
			interaction,
			data,
			componentLabel: this.spec.componentLabel,
			label: this.spec.label,
			values: interaction.values ?? []
		});
	}
};
var DiscordComponentButton = class extends Button {
	constructor(ctx, handlers) {
		super();
		this.ctx = ctx;
		this.handlers = handlers;
		this.label = "component";
		this.customId = "__openclaw_discord_component_button_wildcard__";
		this.style = ButtonStyle.Primary;
		this.customIdParser = parseDiscordComponentCustomIdForInteraction;
	}
	async run(interaction, data) {
		if (parseDiscordComponentData(data, resolveInteractionCustomId(interaction))?.modalId) {
			await this.handlers.handleModalTrigger({
				ctx: this.ctx,
				interaction,
				data,
				label: "discord component modal"
			});
			return;
		}
		await this.handlers.handleComponentEvent({
			ctx: this.ctx,
			interaction,
			data,
			componentLabel: "button",
			label: "discord component button"
		});
	}
};
function createSelectControl(spec, ctx, handlers) {
	return new DiscordComponentSelectControl(spec, ctx, handlers);
}
function bindSelectControl(spec) {
	return (ctx, handlers) => createSelectControl(spec, ctx, handlers);
}
function createDiscordComponentButtonControl(ctx, handlers) {
	return new DiscordComponentButton(ctx, handlers);
}
const createDiscordComponentStringSelectControl = bindSelectControl(SELECT_CONTROLS.string);
const createDiscordComponentUserSelectControl = bindSelectControl(SELECT_CONTROLS.user);
const createDiscordComponentRoleSelectControl = bindSelectControl(SELECT_CONTROLS.role);
const createDiscordComponentMentionableSelectControl = bindSelectControl(SELECT_CONTROLS.mentionable);
const createDiscordComponentChannelSelectControl = bindSelectControl(SELECT_CONTROLS.channel);
//#endregion
//#region extensions/discord/src/monitor/agent-components.ts
function bindDiscordComponentControl(createControl) {
	return (ctx) => createControl(ctx, discordComponentControlHandlers);
}
const createDiscordComponentButton = bindDiscordComponentControl(createDiscordComponentButtonControl);
const createDiscordComponentStringSelect = bindDiscordComponentControl(createDiscordComponentStringSelectControl);
const createDiscordComponentUserSelect = bindDiscordComponentControl(createDiscordComponentUserSelectControl);
const createDiscordComponentRoleSelect = bindDiscordComponentControl(createDiscordComponentRoleSelectControl);
const createDiscordComponentMentionableSelect = bindDiscordComponentControl(createDiscordComponentMentionableSelectControl);
const createDiscordComponentChannelSelect = bindDiscordComponentControl(createDiscordComponentChannelSelectControl);
const createAgentComponentControls = [createAgentComponentButton, createAgentSelectMenu];
const createDiscordComponentControls = [
	createDiscordComponentButton,
	createDiscordComponentStringSelect,
	createDiscordComponentUserSelect,
	createDiscordComponentRoleSelect,
	createDiscordComponentMentionableSelect,
	createDiscordComponentChannelSelect
];
function createDiscordComponentModal(ctx) {
	return new DiscordComponentModal(ctx);
}
//#endregion
//#region extensions/discord/src/monitor/exec-approvals.ts
function resolveTerminalLabel(approval) {
	if (approval.status === "allowed") return approval.decision === "allow-always" ? "Allowed always" : "Allowed once";
	if (approval.status === "denied") return "Denied";
	return approval.status === "expired" ? "Expired" : "Cancelled";
}
function buildTerminalPayload(params) {
	const { approval } = params;
	const label = resolveTerminalLabel(approval);
	const accentColor = approval.status === "denied" ? "#ED4245" : approval.status === "allowed" ? "#57F287" : "#99AAB5";
	return {
		allowed_mentions: DISCORD_APPROVAL_ALLOWED_MENTIONS,
		components: [new Container([
			new TextDisplay(params.applied ? "## Approval resolved" : "## Approval already resolved"),
			new TextDisplay(`Canonical result: **${label}**`),
			new Separator({
				divider: false,
				spacing: "small"
			}),
			new TextDisplay(`-# ID: ${formatDiscordApprovalDisplayValue(approval.id)}`)
		], { accentColor })]
	};
}
function isStructuredApprovalNotFoundError(err) {
	if (!err || typeof err !== "object") return false;
	const record = err;
	if (record.gatewayCode === "APPROVAL_NOT_FOUND") return true;
	return record.gatewayCode === "INVALID_REQUEST" && record.details?.reason === "APPROVAL_NOT_FOUND";
}
var ExecApprovalButton = class extends Button {
	constructor(ctx) {
		super();
		this.ctx = ctx;
		this.label = "execapproval";
		this.customId = "execapproval:seed=1";
		this.style = ButtonStyle.Primary;
	}
	async run(interaction, data) {
		const parsed = parseExecApprovalData(data);
		if (!parsed) {
			try {
				await interaction.reply({
					content: "This approval is no longer valid.",
					ephemeral: true
				});
			} catch {}
			return;
		}
		const approvers = this.ctx.getApprovers();
		const userId = interaction.userId;
		if (!approvers.some((id) => id === userId)) {
			try {
				await interaction.reply({
					content: "⛔ You are not authorized to approve requests.",
					ephemeral: true
				});
			} catch {}
			return;
		}
		const decisionLabel = parsed.action === "allow-once" ? "Allowed (once)" : parsed.action === "allow-always" ? "Allowed (always)" : "Denied";
		try {
			await interaction.acknowledge();
		} catch {}
		const result = await this.ctx.resolveApproval(parsed.approvalId, parsed.approvalKind, parsed.action, userId);
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
function createExecApprovalButton(ctx) {
	return new ExecApprovalButton(ctx);
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
						senderId,
						gatewayUrl: params.gatewayUrl
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
//#endregion
//#region extensions/discord/src/monitor/questions.ts
var QuestionButton = class extends Button {
	constructor(ctx) {
		super();
		this.ctx = ctx;
		this.label = "question";
		this.customId = "ocq:id=seed;i=0";
		this.style = ButtonStyle.Primary;
	}
	async run(interaction, data) {
		const callback = parseDiscordQuestionData(data);
		if (!callback) {
			await interaction.reply({
				content: "This question is no longer valid.",
				ephemeral: true
			});
			return;
		}
		if (!await this.ctx.authorizeQuestion(interaction)) return;
		try {
			await interaction.acknowledge();
		} catch {}
		let content;
		try {
			content = (await this.ctx.resolveQuestion({
				cfg: this.ctx.cfg,
				questionId: callback.questionId,
				optionIndex: callback.optionIndex,
				senderId: interaction.userId,
				clientDisplayName: `Discord question (${this.ctx.accountId})`
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
function createDiscordQuestionButton(params) {
	const authContext = params.authContext ?? {
		cfg: params.cfg,
		accountId: params.accountId
	};
	return new QuestionButton({
		cfg: params.cfg,
		accountId: params.accountId,
		resolveQuestion: params.resolveQuestion ?? questionGatewayRuntime.resolveOption,
		authorizeQuestion: params.authorizeQuestion ?? (async (interaction) => Boolean(await resolveAuthorizedComponentInteraction({
			ctx: authContext,
			interaction,
			label: "discord question",
			componentLabel: "button",
			unauthorizedReply: "You are not authorized to answer this question.",
			defer: false
		})))
	});
}
//#endregion
//#region extensions/discord/src/monitor/provider.interactions.ts
function createDiscordProviderInteractionSurface(params) {
	const createNativeCommand = params.createNativeCommand ?? createDiscordNativeCommand;
	const commands = params.commandSpecs.map((spec) => {
		if (params.nativeEnabled && params.voiceEnabled && spec.name === DISCORD_VOICE_COMMAND_SPEC.name) return createDiscordVoiceCommand({
			readPolicy: params.readPolicy,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			groupPolicy: params.groupPolicy,
			useAccessGroups: params.useAccessGroups,
			getManager: () => params.voiceManagerRef.current,
			ephemeralDefault: params.ephemeralDefault
		});
		return createNativeCommand({
			readPolicy: params.readPolicy,
			command: spec,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			sessionPrefix: params.sessionPrefix,
			ephemeralDefault: params.ephemeralDefault,
			threadBindings: params.threadBindings,
			buildContext: params.channelRuntime?.inbound.buildContext,
			dispatchReplyFromConfig: params.channelRuntime?.reply?.dispatchReplyFromConfig
		});
	});
	const execApprovalsConfig = params.discordConfig.execApprovals ?? {};
	const execApprovalsEnabled = isDiscordExecApprovalClientEnabled({
		cfg: params.cfg,
		accountId: params.accountId,
		configOverride: execApprovalsConfig
	});
	const approvalActionsEnabled = getDiscordExecApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId,
		configOverride: execApprovalsConfig
	}).length > 0;
	if (execApprovalsEnabled) registerChannelRuntimeContext({
		channelRuntime: params.channelRuntime,
		channelId: "discord",
		accountId: params.accountId,
		capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
		context: {
			token: params.token,
			config: execApprovalsConfig
		},
		abortSignal: params.abortSignal
	});
	const components = [
		createDiscordQuestionButton({
			cfg: params.cfg,
			accountId: params.accountId,
			authContext: {
				readPolicy: params.readPolicy,
				cfg: params.cfg,
				accountId: params.accountId,
				discordConfig: params.discordConfig,
				runtime: params.runtime,
				token: params.token,
				guildEntries: params.guildEntries,
				allowFrom: params.allowFrom,
				dmPolicy: params.dmPolicy
			}
		}),
		createDiscordCommandArgFallbackButton({
			readPolicy: params.readPolicy,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			sessionPrefix: params.sessionPrefix,
			threadBindings: params.threadBindings,
			buildContext: params.channelRuntime?.inbound.buildContext,
			dispatchReplyFromConfig: params.channelRuntime?.reply?.dispatchReplyFromConfig
		}),
		createDiscordModelPickerFallbackButton({
			readPolicy: params.readPolicy,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			sessionPrefix: params.sessionPrefix,
			threadBindings: params.threadBindings,
			buildContext: params.channelRuntime?.inbound.buildContext,
			dispatchReplyFromConfig: params.channelRuntime?.reply?.dispatchReplyFromConfig
		}),
		createDiscordModelPickerFallbackSelect({
			readPolicy: params.readPolicy,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			sessionPrefix: params.sessionPrefix,
			threadBindings: params.threadBindings,
			buildContext: params.channelRuntime?.inbound.buildContext,
			dispatchReplyFromConfig: params.channelRuntime?.reply?.dispatchReplyFromConfig
		})
	];
	const activityButton = createDiscordActivityButton({
		readPolicy: params.readPolicy,
		cfg: params.cfg,
		discordConfig: params.discordConfig,
		accountId: params.accountId,
		guildEntries: params.guildEntries,
		allowFrom: params.allowFrom,
		dmPolicy: params.dmPolicy,
		runtime: params.runtime,
		channelRuntime: params.channelRuntime,
		token: params.token
	}, params.applicationId);
	if (activityButton) components.push(activityButton);
	const modals = [];
	if (approvalActionsEnabled) components.push(createExecApprovalButton(createDiscordExecApprovalButtonContext({
		cfg: params.cfg,
		accountId: params.accountId,
		config: execApprovalsConfig
	})));
	if ((params.discordConfig.agentComponents ?? {}).enabled ?? true) {
		const componentContext = {
			readPolicy: params.readPolicy,
			cfg: params.cfg,
			discordConfig: params.discordConfig,
			accountId: params.accountId,
			guildEntries: params.guildEntries,
			allowFrom: params.allowFrom,
			dmPolicy: params.dmPolicy,
			runtime: params.runtime,
			token: params.token
		};
		components.push(...createAgentComponentControls.map((create) => create(componentContext)));
		components.push(...createDiscordComponentControls.map((create) => create(componentContext)));
		modals.push(createDiscordComponentModal(componentContext));
	}
	return {
		commands,
		components,
		modals
	};
}
//#endregion
//#region extensions/discord/src/internal/voice.ts
var VoicePlugin = class extends Plugin {
	constructor(..._args) {
		super(..._args);
		this.id = "voice";
		this.adapters = /* @__PURE__ */ new Map();
	}
	registerClient(client) {
		this.client = client;
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
//#endregion
//#region extensions/discord/src/monitor/message-handler.preflight-channel-access.ts
function resolveDiscordPreflightChannelAccess(params) {
	if (params.isGuildMessage && params.channelConfig?.enabled === false) {
		logDebug(`[discord-preflight] drop: channel disabled`);
		logVerbose(`Blocked discord channel ${params.messageChannelId} (channel disabled, ${params.channelMatchMeta})`);
		return {
			allowed: false,
			channelAllowlistConfigured: false,
			channelAllowed: false
		};
	}
	const groupDmAllowed = params.isGroupDm && resolveGroupDmAllow({
		channels: params.groupDmChannels,
		channelId: params.messageChannelId,
		channelName: params.displayChannelName,
		channelSlug: params.displayChannelSlug
	});
	if (params.isGroupDm && !groupDmAllowed) return {
		allowed: false,
		channelAllowlistConfigured: false,
		channelAllowed: false
	};
	const channelAllowlistConfigured = Boolean(params.guildInfo?.channels) && Object.keys(params.guildInfo?.channels ?? {}).length > 0;
	const channelAllowed = params.channelConfig?.allowed !== false;
	if (params.isGuildMessage && !isDiscordGroupAllowedByPolicy({
		groupPolicy: params.groupPolicy,
		guildAllowlisted: Boolean(params.guildInfo),
		channelAllowlistConfigured,
		channelAllowed
	})) {
		if (params.groupPolicy === "disabled") {
			logDebug(`[discord-preflight] drop: groupPolicy disabled`);
			logVerbose(`discord: drop guild message (groupPolicy: disabled, ${params.channelMatchMeta})`);
		} else if (!channelAllowlistConfigured) {
			logDebug(`[discord-preflight] drop: groupPolicy allowlist, no channel allowlist configured`);
			logVerbose(`discord: drop guild message (groupPolicy: allowlist, no channel allowlist, ${params.channelMatchMeta})`);
		} else {
			logDebug(`[discord] Ignored message from channel ${params.messageChannelId} (not in guild allowlist). Add to guilds.<guildId>.channels to enable.`);
			logVerbose(`Blocked discord channel ${params.messageChannelId} not in guild channel allowlist (groupPolicy: allowlist, ${params.channelMatchMeta})`);
		}
		return {
			allowed: false,
			channelAllowlistConfigured,
			channelAllowed
		};
	}
	if (params.isGuildMessage && params.channelConfig?.allowed === false) {
		logDebug(`[discord-preflight] drop: channelConfig.allowed===false`);
		logVerbose(`Blocked discord channel ${params.messageChannelId} not in guild channel allowlist (${params.channelMatchMeta})`);
		return {
			allowed: false,
			channelAllowlistConfigured,
			channelAllowed
		};
	}
	if (params.isGuildMessage) {
		logDebug(`[discord-preflight] pass: channel allowed`);
		logVerbose(`discord: allow channel ${params.messageChannelId} (${params.channelMatchMeta})`);
	}
	return {
		allowed: true,
		channelAllowlistConfigured,
		channelAllowed
	};
}
//#endregion
//#region extensions/discord/src/monitor/listeners.guild-join.ts
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
			}).allowed;
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
//#endregion
//#region extensions/discord/src/monitor/provider.startup.ts
function registerLatePlugin(client, plugin) {
	plugin.registerClient?.(client);
	plugin.registerRoutes?.(client);
	if (!client.plugins.some((entry) => entry.id === plugin.id)) client.plugins.push({
		id: plugin.id,
		plugin
	});
}
function createDiscordStatusReadyListener(params) {
	return new class DiscordStatusReadyListener extends ReadyListener {
		async handle(_data, client) {
			const autoPresenceController = params.getAutoPresenceController();
			if (autoPresenceController?.enabled) {
				autoPresenceController.refresh();
				return;
			}
			const gateway = client.getPlugin("gateway");
			if (!gateway) return;
			const presence = resolveDiscordPresenceUpdate(params.discordConfig);
			if (!presence) return;
			gateway.updatePresence(presence);
		}
	}();
}
async function createDiscordMonitorClient(params) {
	let autoPresenceController = null;
	const clientPlugins = [params.createGatewayPlugin({
		discordConfig: params.discordConfig,
		runtime: params.runtime
	})];
	if (params.voiceEnabled) clientPlugins.push(new VoicePlugin());
	const voicePlugin = clientPlugins.find((plugin) => plugin.id === "voice");
	const constructorPlugins = voicePlugin ? clientPlugins.filter((plugin) => plugin !== voicePlugin) : clientPlugins;
	const eventQueueOpts = {
		listenerTimeout: 12e4,
		slowListenerThreshold: 3e4
	};
	const readyListener = createDiscordStatusReadyListener({
		discordConfig: params.discordConfig,
		getAutoPresenceController: () => autoPresenceController
	});
	const client = params.createClient({
		baseUrl: "http://localhost",
		deploySecret: "a",
		clientId: params.applicationId,
		publicKey: "a",
		token: params.token,
		autoDeploy: false,
		commandDeployHashStore: params.commandDeployHashStore,
		requestOptions: {
			timeout: DISCORD_REST_TIMEOUT_MS,
			runtimeProfile: "persistent",
			maxQueueSize: 1e3,
			...params.restFetch ? { fetch: params.restFetch } : {}
		},
		eventQueue: eventQueueOpts
	}, {
		commands: params.commands,
		listeners: [readyListener],
		components: params.components,
		modals: params.modals
	}, constructorPlugins);
	if (voicePlugin) registerLatePlugin(client, voicePlugin);
	const gateway = client.getPlugin("gateway");
	await waitForDiscordGatewayPluginRegistration(gateway);
	const gatewaySupervisor = params.createGatewaySupervisor({
		gateway,
		isDisallowedIntentsError: params.isDisallowedIntentsError,
		runtime: params.runtime
	});
	if (gateway) {
		autoPresenceController = params.createAutoPresenceController({
			accountId: params.accountId,
			discordConfig: params.discordConfig,
			gateway,
			log: (message) => params.runtime.log?.(message)
		});
		autoPresenceController.start();
	}
	return {
		client,
		gateway,
		gatewaySupervisor,
		autoPresenceController,
		eventQueueOpts
	};
}
async function fetchDiscordBotIdentity(params) {
	params.logStartupPhase("fetch-bot-identity:start");
	const parsedBotUserId = parseApplicationIdFromToken(params.token ?? "");
	if (parsedBotUserId) {
		params.logStartupPhase("fetch-bot-identity:done", `botUserId=${parsedBotUserId} botUserName=<missing> source=token`);
		return {
			botUserId: parsedBotUserId,
			botUserName: void 0
		};
	}
	let botUser;
	try {
		botUser = await params.client.fetchUser("@me");
	} catch (err) {
		params.runtime.error?.(danger(`discord: failed to fetch bot identity: ${String(err)}`));
		params.logStartupPhase("fetch-bot-identity:error", String(err));
		throw new Error("Failed to resolve Discord bot identity", { cause: err });
	}
	const botUserRecord = botUser;
	const botUserId = normalizeOptionalString(botUserRecord?.id);
	const botUserName = normalizeOptionalString(botUserRecord?.username) ?? normalizeOptionalString(botUserRecord?.globalName);
	if (!botUserId) {
		const details = "fetchUser(\"@me\") returned no usable id";
		params.runtime.error?.(danger(`discord: failed to fetch bot identity: ${details}`));
		params.logStartupPhase("fetch-bot-identity:error", details);
		throw new Error("Failed to resolve Discord bot identity");
	}
	params.logStartupPhase("fetch-bot-identity:done", `botUserId=${botUserId} botUserName=${botUserName ?? "<missing>"}`);
	return {
		botUserId,
		botUserName
	};
}
function registerDiscordMonitorListeners(params) {
	registerDiscordListener(params.client.listeners, new DiscordInteractionListener(params.logger, params.trackInboundEvent));
	registerDiscordListener(params.client.listeners, new DiscordMessageListener(params.messageHandler, params.logger, params.trackInboundEvent));
	const guildJoinListener = new DiscordGuildJoinIntroductionListener({
		readPolicy: params.readPolicy,
		cfg: params.cfg,
		accountId: params.accountId,
		botUserId: params.botUserId,
		groupPolicy: params.groupPolicy,
		guildEntries: params.guildEntries,
		logger: params.logger
	});
	registerDiscordListener(params.client.listeners, guildJoinListener);
	const reactionListenerOptions = {
		readPolicy: params.readPolicy,
		cfg: params.cfg,
		accountId: params.accountId,
		runtime: params.runtime,
		botUserId: params.botUserId,
		dmEnabled: params.dmEnabled,
		groupDmEnabled: params.groupDmEnabled,
		groupDmChannels: params.groupDmChannels ?? [],
		dmPolicy: params.dmPolicy,
		allowFrom: params.allowFrom ?? [],
		groupPolicy: params.groupPolicy,
		allowNameMatching: isDangerousNameMatchingEnabled(params.discordConfig),
		guildEntries: params.guildEntries,
		logger: params.logger,
		onEvent: params.trackInboundEvent
	};
	registerDiscordListener(params.client.listeners, new DiscordReactionListener(reactionListenerOptions));
	registerDiscordListener(params.client.listeners, new DiscordReactionRemoveListener(reactionListenerOptions));
	const threadUpdateListener = new DiscordThreadUpdateListener(params.cfg, params.logger);
	registerDiscordListener(params.client.listeners, threadUpdateListener);
	registerDiscordListener(params.client.listeners, new DiscordThreadReadyListener(threadUpdateListener));
	registerDiscordListener(params.client.listeners, new DiscordThreadDeleteListener(params.cfg, params.accountId, params.logger));
	let presenceListener;
	if (params.discordConfig.intents?.presence) {
		presenceListener = new DiscordPresenceListener({
			readPolicy: params.readPolicy,
			cfg: params.cfg,
			logger: params.logger,
			accountId: params.accountId,
			botUserId: params.botUserId,
			guildEntries: params.guildEntries
		});
		registerDiscordListener(params.client.listeners, presenceListener);
		registerDiscordListener(params.client.listeners, new DiscordPresenceGuildCreateListener(presenceListener));
		registerDiscordListener(params.client.listeners, new DiscordPresenceGuildDeleteListener(presenceListener));
		registerDiscordListener(params.client.listeners, new DiscordPresenceReadyListener(presenceListener));
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
//#endregion
//#region extensions/discord/src/monitor/startup-status.ts
function formatDiscordStartupStatusMessage(params) {
	const identitySuffix = params.botIdentity ? ` as ${params.botIdentity}` : "";
	if (params.gatewayReady) return `logged in to discord${identitySuffix}`;
	return `discord client initialized${identitySuffix}; awaiting gateway readiness`;
}
//#endregion
//#region extensions/discord/src/monitor/provider.ts
const DEFAULT_DISCORD_MEDIA_MAX_MB = 100;
function logDiscordStartupPhase(params) {
	logDiscordStartupPhase$1({
		...params,
		isVerbose: discordProviderRuntime.isVerbose
	});
}
const DISCORD_DISALLOWED_INTENTS_CODE = GatewayCloseCodes$1.DisallowedIntents;
function isDiscordDisallowedIntentsError(err) {
	if (!err) return false;
	return formatErrorMessage(err).includes(String(DISCORD_DISALLOWED_INTENTS_CODE));
}
async function monitorDiscordProvider(opts = {}) {
	const startupStartedAt = Date.now();
	const cfg = opts.config ?? getRuntimeConfig();
	const readConfig = opts.readConfig ?? createRuntimeConfigReader(cfg);
	const account = discordProviderRuntime.resolveDiscordAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = normalizeDiscordToken(opts.token ?? void 0, "channels.discord.token") ?? account.token;
	if (!token) throw new Error(`Discord bot token missing for account "${account.accountId}" (set discord.accounts.${account.accountId}.token or DISCORD_BOT_TOKEN for default).`);
	const runtime = opts.runtime ?? createNonExitingRuntime();
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
	const discordProviderSessionRuntime = await discordProviderRuntime.loadDiscordProviderSessionRuntime();
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
	const nativeEnabled = discordProviderRuntime.resolveNativeCommandsEnabled({
		providerId: "discord",
		providerSetting: discordCfg.commands?.native,
		globalSetting: cfg.commands?.native
	});
	const nativeSkillsEnabled = discordProviderRuntime.resolveNativeSkillsEnabled({
		providerId: "discord",
		providerSetting: discordCfg.commands?.nativeSkills,
		globalSetting: cfg.commands?.nativeSkills
	});
	const useAccessGroups = true;
	const slashCommand = resolveDiscordSlashCommandConfig(discordCfg.slashCommand);
	const sessionPrefix = "discord:slash";
	const ephemeralDefault = slashCommand.ephemeral;
	const voiceEnabled = resolveDiscordVoiceEnabled(discordCfg.voice);
	if (voiceEnabled && getDiscordEndpointRuntime()) throw new Error("Discord voice transport is unavailable while DISCORD_API_URL is configured");
	const allowlistResolved = await resolveDiscordAllowlistConfig({
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
	if (discordProviderRuntime.shouldLogVerbose()) logDiscordResolvedConfig({
		dmEnabled,
		dmPolicy,
		allowFrom,
		groupDmEnabled,
		groupDmChannels,
		groupPolicy,
		guildEntries,
		historyLimit,
		mediaMaxBytes,
		nativeEnabled,
		nativeSkillsEnabled,
		useAccessGroups,
		threadBindingsEnabled,
		threadBindingIdleTimeoutMs,
		threadBindingMaxAgeMs
	});
	logDiscordStartupPhase({
		runtime,
		accountId: account.accountId,
		phase: "fetch-application-id:start",
		startAt: startupStartedAt
	});
	const parsedApplicationId = (typeof discordCfg.applicationId === "string" && discordCfg.applicationId.trim() ? discordCfg.applicationId.trim() : void 0) ?? parseApplicationIdFromToken(token);
	const applicationIdProbe = parsedApplicationId ? {
		kind: "resolved",
		applicationId: parsedApplicationId
	} : await discordProviderRuntime.probeDiscordApplicationId(token, 4e3, discordRestFetch);
	if (applicationIdProbe.kind !== "resolved") {
		const at = Date.now();
		const terminal = applicationIdProbe.kind === "rejected";
		const probeError = formatErrorMessage(applicationIdProbe.error);
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
	logDiscordStartupPhase({
		runtime,
		accountId: account.accountId,
		phase: "fetch-application-id:done",
		startAt: startupStartedAt,
		details: `applicationId=${applicationId}`
	});
	const { commandSpecs } = await resolveDiscordProviderCommandSpecs({
		cfg,
		runtime,
		nativeEnabled,
		nativeSkillsEnabled,
		voiceEnabled,
		listSkillCommandsForAgents: discordProviderRuntime.listSkillCommandsForAgents,
		listNativeCommandSpecsForConfig: discordProviderRuntime.listNativeCommandSpecsForConfig
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
	let lifecycleGateway;
	let earlyGatewayEmitter = gatewaySupervisor?.emitter;
	let onEarlyGatewayDebug;
	try {
		if (opts.abortSignal?.aborted) return;
		if (threadBindingsEnabled) {
			const uncertainProbeKeys = /* @__PURE__ */ new Set();
			const reconciliation = await discordProviderSessionRuntime.reconcileAcpThreadBindingsOnStartup({
				cfg,
				accountId: account.accountId,
				sendFarewell: false,
				healthProbe: async ({ sessionKey, session }) => {
					const probe = await probeDiscordAcpBindingHealth({
						cfg,
						sessionKey,
						agentId: session.agentId,
						storedState: session.acp?.state,
						lastActivityAt: session.acp?.lastActivityAt,
						providerSessionRuntime: discordProviderSessionRuntime
					});
					if (probe.status === "uncertain") uncertainProbeKeys.add(`${sessionKey}${probe.reason ? ` (${probe.reason})` : ""}`);
					return probe;
				}
			});
			if (reconciliation.removed > 0) logVerbose(`discord: removed ${reconciliation.removed}/${reconciliation.checked} stale ACP thread bindings on startup for account ${account.accountId}: ${reconciliation.staleSessionKeys.join(", ")}`);
			if (uncertainProbeKeys.size > 0) logVerbose(`discord: ACP thread-binding health probe uncertain for account ${account.accountId}: ${[...uncertainProbeKeys].join(", ")}`);
		}
		if (opts.abortSignal?.aborted) return;
		const pluginChannelRuntime = opts.channelRuntime;
		const { commands, components, modals } = createDiscordProviderInteractionSurface({
			readPolicy,
			cfg,
			discordConfig: discordCfg,
			accountId: account.accountId,
			applicationId,
			token,
			commandSpecs,
			nativeEnabled,
			voiceEnabled,
			groupPolicy,
			useAccessGroups,
			sessionPrefix,
			ephemeralDefault,
			threadBindings,
			voiceManagerRef,
			guildEntries,
			allowFrom,
			dmPolicy,
			runtime,
			channelRuntime: pluginChannelRuntime,
			abortSignal: opts.abortSignal,
			createNativeCommand: discordProviderRuntime.createDiscordNativeCommand
		});
		const { client, gateway, gatewaySupervisor: createdGatewaySupervisor, autoPresenceController: createdAutoPresenceController } = await createDiscordMonitorClient({
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
			createClient: discordProviderRuntime.createClient,
			createGatewayPlugin: createDiscordGatewayPlugin,
			createGatewaySupervisor: createDiscordGatewaySupervisor,
			createAutoPresenceController: createDiscordAutoPresenceController,
			isDisallowedIntentsError: isDiscordDisallowedIntentsError
		});
		lifecycleGateway = gateway;
		gatewaySupervisor = createdGatewaySupervisor;
		autoPresenceController = createdAutoPresenceController;
		earlyGatewayEmitter = gatewaySupervisor.emitter;
		onEarlyGatewayDebug = (msg) => {
			if (!discordProviderRuntime.isVerbose()) return;
			runtime.log?.(`discord startup [${account.accountId}] gateway-debug ${Math.max(0, Date.now() - startupStartedAt)}ms ${String(msg)}`);
		};
		earlyGatewayEmitter?.on("debug", onEarlyGatewayDebug);
		logDiscordStartupPhase({
			runtime,
			accountId: account.accountId,
			phase: "deploy-commands:schedule",
			startAt: startupStartedAt,
			gateway: lifecycleGateway,
			details: `native=${nativeEnabled ? "on" : "off"} reconcile=on commandCount=${commands.length}`
		});
		runDiscordCommandDeployInBackground({
			client,
			runtime,
			enabled: nativeEnabled,
			accountId: account.accountId,
			startupStartedAt,
			shouldLogVerbose: discordProviderRuntime.shouldLogVerbose,
			isVerbose: discordProviderRuntime.isVerbose
		});
		const logger = createSubsystemLogger("discord/monitor");
		const guildHistories = /* @__PURE__ */ new Map();
		const { botUserId, botUserName } = await fetchDiscordBotIdentity({
			client,
			token,
			runtime,
			logStartupPhase: (phase, details) => logDiscordStartupPhase({
				runtime,
				accountId: account.accountId,
				phase,
				startAt: startupStartedAt,
				gateway: lifecycleGateway,
				details
			})
		});
		let voiceManager = null;
		if (voiceEnabled) {
			const { DiscordVoiceGuildCreateListener, DiscordVoiceManager, DiscordVoiceReadyListener, DiscordVoiceResumedListener, DiscordVoiceStateUpdateListener } = await discordProviderRuntime.loadDiscordVoiceRuntime();
			voiceManager = new DiscordVoiceManager({
				readPolicy,
				client,
				cfg,
				discordConfig: discordCfg,
				accountId: account.accountId,
				runtime,
				botUserId
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
			readPolicy,
			client,
			cfg,
			discordConfig: discordCfg,
			accountId: account.accountId,
			token,
			runtime,
			buildContext: pluginChannelRuntime?.inbound.buildContext,
			setStatus: opts.setStatus,
			abortSignal: opts.abortSignal,
			botUserId,
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
			readPolicy,
			cfg,
			client,
			accountId: account.accountId,
			discordConfig: discordCfg,
			runtime,
			botUserId,
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
		logDiscordStartupPhase({
			runtime,
			accountId: account.accountId,
			phase: "client-start",
			startAt: startupStartedAt,
			gateway: lifecycleGateway
		});
		const botIdentity = botUserId && botUserName ? `${botUserId} (${botUserName})` : botUserId ?? botUserName ?? "";
		runtime.log?.(formatDiscordStartupStatusMessage({
			gatewayReady: lifecycleGateway?.isConnected === true,
			botIdentity: botIdentity || void 0
		}));
		if (lifecycleGateway?.isConnected) opts.setStatus?.(createDiscordReadyStatusPatch());
		lifecycleStarted = true;
		earlyGatewayEmitter?.removeListener("debug", onEarlyGatewayDebug);
		onEarlyGatewayDebug = void 0;
		await discordProviderRuntime.runDiscordGatewayLifecycle({
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
		await cleanupDiscordProviderStartup({
			deactivateMessageHandler,
			stopMonitorListeners,
			autoPresenceController,
			setStatus: opts.setStatus,
			onEarlyGatewayDebug,
			earlyGatewayEmitter,
			lifecycleStarted,
			lifecycleGateway,
			gatewaySupervisor,
			threadBindings,
			runtime
		});
	}
}
//#endregion
export { resolveDiscordTextCommandAccess as S, handleDiscordDmCommandDecision as _, formatDiscordReplySkip as a, registerDiscordListener as b, buildGuildLabel as c, resolveDiscordGatewayIntents as d, waitForDiscordGatewayPluginRegistration as f, createDiscordSupplementalContextAccessChecker as g, buildDiscordInboundAccessContext as h, formatDiscordReplyDeliveryFailure as i, resolveReplyContext as l, buildDiscordGroupSystemPrompt as m, resolveDiscordPreflightChannelAccess as n, sanitizeDiscordFrontChannelReplyPayloads as o, createDiscordNativeCommand as p, deliverDiscordReply as r, buildDirectLabel as s, monitorDiscordProvider as t, createDiscordGatewayPlugin as u, createDiscordLivePolicyReader as v, resolveDiscordDmCommandAccess as x, mapGatewayDispatchData as y };
