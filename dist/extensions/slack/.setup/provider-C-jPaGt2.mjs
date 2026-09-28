import { n as registerSlackHttpHandler, r as normalizeSlackWebhookPath } from "./registry-bbjH7IHX.mjs";
import { a as resolveDefaultSlackAccountId, c as resolveSlackAccountDmPolicy, d as formatSlackBotTokenIdentityWarning, f as resolveSlackAppToken, i as mergeSlackAccountConfig, o as resolveSlackAccount, p as resolveSlackBotToken, s as resolveSlackAccountAllowFrom } from "./accounts-BBHvg0pY.mjs";
import { Ct as registerSlackInstallationState, Dt as isSlackExecApprovalAuthorizedSender, G as isSlackQuestionActionId, Pt as resolveSlackReplyToMode, Tt as isSlackApprovalAuthorizedSender, U as isSlackApprovalActionId, W as isSlackCallbackActionId, c as qualifySlackRoutePeerId, d as resolveSlackConversationBindingRoute, dt as isSlackAnyNativeApprovalClientEnabled, j as truncateSlackText, k as SLACK_TEXT_LIMIT, l as resolveSlackEnterpriseMainDmSessionKey, n as setSlackSessionStatus, ot as escapeSlackMrkdwn, r as buildSlackChannelIdCandidates, s as qualifySlackConversationId, t as renameSlackSession, u as normalizeSlackRouteBindingConfig } from "./session-status-Cf7AvWOt.mjs";
import { a as parseSlackTarget, n as formatSlackTarget } from "./target-parsing-DEsPjngB.mjs";
import { C as allowListMatches, D as normalizeSlackSlug, E as normalizeSlackAllowOwnerEntry, O as resolveSlackAllowListMatch, T as normalizeAllowListLower, a as slackIngressIdentity, b as resolveSlackProxyDispatcher, d as createSlackStartupAuthClient, h as getSlackListenerWriteClient, i as createSlackIngressSubject, k as resolveSlackUserAllowListForTeam, o as formatSlackError, p as createSlackWebClient, s as collectSlackCursorPages, w as normalizeAllowList, x as resolveSlackWebClientOptions, y as resolveSlackLookupClientOptions } from "./probe-DiYIMPJo.mjs";
import { _ as decodeSlackApprovalAction, h as resolveSlackQuestionAction, m as decodeSlackQuestionAction } from "./reply-blocks-Bm8kf6mK.mjs";
import { n as getSlackRuntime, t as getOptionalSlackRuntime } from "./runtime-JSVZSWAj.mjs";
import { C as hasSlackMessageTableBlock, b as saveRemoteMedia, f as readSlackMessages, y as isGovSlackClient } from "./actions-DKCtBgCI.mjs";
import { i as setSlackDefaultSendIdentity, p as requireSlackPostMessageTimestamp } from "./send-Cp6omkOg.mjs";
import { n as resolveSlackChannelConfig, r as resolveSlackChannelLabel, t as isSlackChannelAllowedByPolicy } from "./policy-BApW53pI.mjs";
import { t as resolveSlackChannelAllowlist } from "./resolve-channels-BXbMBbJD.mjs";
import { t as resolveSlackUserAllowlist } from "./resolve-users-65WqvIqD.mjs";
import { n as runSlackApprovalMessageUpdate, t as hasSlackApprovalControl } from "./approval-message-updates-Tb_qRokK.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { asNonArrayRecord, asOptionalRecord, isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries, normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId as normalizeAccountId$1, normalizeMainKey, resolveAgentIdFromSessionKey, resolveAgentRoute, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { createChannelIngressError, createChannelIngressMonitor } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPairingChallengeIssuer } from "openclaw/plugin-sdk/channel-pairing";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { computeBackoff, createNonExitingRuntime, createSubsystemLogger, danger, getChildLogger, logVerbose, shouldLogVerbose, sleepWithAbort, warn } from "openclaw/plugin-sdk/runtime-env";
import { chunkItems } from "openclaw/plugin-sdk/text-chunking";
import { truncateUtf16Safe, withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
import { CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { addAllowlistUserEntriesFromConfigEntry, buildAllowlistResolutionSummary, formatAllowlistMatchMeta, mergeAllowlist, patchAllowlistUsersInConfigEntries, summarizeMapping } from "openclaw/plugin-sdk/allow-from";
import { parseExecApprovalCommandText } from "openclaw/plugin-sdk/approval-reply-runtime";
import { asDateTimestampMs, parseFiniteNumber, parseStrictFiniteNumber, resolveExpiresAtMsFromDurationMs, resolvePromptHistoryLimit, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { WebAPIHTTPError, WebAPIPlatformError, WebAPIRateLimitedError, WebAPIRequestError, WebClient } from "@slack/web-api";
import { classifyTransientNetworkErrorCode } from "openclaw/plugin-sdk/retry-runtime";
import { buildPluginBindingResolvedText, parsePluginBindingApprovalCustomId, resolveConversationLabel, resolvePluginConversationBindingApproval, resolveRuntimeConversationBindingRoute, upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import { readChannelIngressStoreAllowFromForDmPolicy } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { collectErrorGraphCandidates, extractErrorCode, formatErrorMessage, isApprovalNotFoundError, readErrorName, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { buildChannelMetadata } from "openclaw/plugin-sdk/security-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { createDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
import { resolveNativeCommandsEnabled, resolveNativeSkillsEnabled } from "openclaw/plugin-sdk/native-command-config-runtime";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { createRuntimeConfigReader, getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { getConversationSession, getSessionEntry, getSessionEntry as getSessionEntry$1, readSessionUpdatedAt, resolveChannelResetConfig, resolveStorePath, resolveStorePath as resolveStorePath$1, updateLastRoute } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveChannelContextVisibilityMode } from "openclaw/plugin-sdk/context-visibility-runtime";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy as resolveOpenProviderRuntimeGroupPolicy$1, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { channelBlockedPatch, channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { loadPreparedModelCatalog, resolveAgentDir, resolveDefaultModelForAgent } from "openclaw/plugin-sdk/agent-runtime";
import { formatCommandArgMenuTitle, resolveCommandAuthorization, resolveEffectiveAgentRuntime, resolveNativeCommandSessionTargets, resolveStoredModelOverride } from "openclaw/plugin-sdk/command-auth-native";
import { mergeNativeCommandSpecs } from "openclaw/plugin-sdk/native-command-registry";
import { generateSecureToken } from "openclaw/plugin-sdk/secure-random-runtime";
import { resolveChannelConfigWrites } from "openclaw/plugin-sdk/channel-config-writes";
import { mutateConfigFile, readConfigFileSnapshotForWrite } from "openclaw/plugin-sdk/config-mutation";
import { enqueueRoutedSystemEvent } from "openclaw/plugin-sdk/system-event-runtime";
import { resolveApprovalOverGateway } from "openclaw/plugin-sdk/approval-gateway-runtime";
import { requestHeartbeat } from "openclaw/plugin-sdk/heartbeat-runtime";
import { createChannelInteractiveDispatcher } from "openclaw/plugin-sdk/plugin-runtime";
import { reportChannelRoomJoin } from "openclaw/plugin-sdk/channel-join-intro-runtime";
import { finished } from "node:stream/promises";
import { beginWebhookRequestPipelineOrReject, createWebhookInFlightLimiter, readWebhookBodyOrReject } from "openclaw/plugin-sdk/webhook-request-guards";
import { createChannelInboundDebouncer, resolveInboundDebounceMs, shouldDebounceTextInbound } from "openclaw/plugin-sdk/channel-inbound";
import { createChannelReplayGuard, runClaimableDedupeClaimLoop } from "openclaw/plugin-sdk/persistent-dedupe";
//#region extensions/slack/src/monitor/commands.ts
/**
* Strip Slack mentions (<@U123>, <@U123|name>) so command detection works on
* normalized text. Use in both prepare and debounce gate for consistency.
*/
function stripSlackMentionsForCommandDetection(text) {
	return (text ?? "").replace(/<@[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeSlackSlashCommandName(raw) {
	return raw.replace(/^\/+/, "");
}
function resolveSlackSlashCommandConfig(raw) {
	const name = normalizeSlackSlashCommandName(normalizeOptionalString(raw?.name) ?? "openclaw") || "openclaw";
	return {
		enabled: raw?.enabled === true,
		name,
		sessionPrefix: normalizeOptionalString(raw?.sessionPrefix) ?? "slack:slash",
		ephemeral: raw?.ephemeral !== false
	};
}
function buildSlackSlashCommandMatcher(name) {
	const escaped = normalizeSlackSlashCommandName(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^/?${escaped}$`);
}
//#endregion
//#region extensions/slack/src/monitor/agent-view-state.ts
const SLACK_AGENT_VIEW_STATE_NAMESPACE = "agent-view-workspaces";
const SLACK_AGENT_VIEW_THREAD_STATE_NAMESPACE = "agent-view-threads";
const SLACK_AGENT_VIEW_STATE_MAX_ENTRIES = 4096;
const SLACK_AGENT_VIEW_THREAD_STATE_MAX_ENTRIES = 4096;
const SLACK_MANAGED_THREAD_CACHE_MAX_ENTRIES = 4096;
function createSlackAgentViewState(params) {
	let enabled = false;
	let loaded = false;
	let persisted = false;
	let warned = false;
	const managedThreads = /* @__PURE__ */ new Map();
	const warnOnce = (action, error) => {
		if (warned) return;
		warned = true;
		params.warn(action, error);
	};
	const createStoreOpener = (namespace, maxEntries) => {
		let store;
		return () => {
			if (store) return store;
			const runtime = getOptionalSlackRuntime();
			if (!runtime) return;
			try {
				store = runtime.state.openKeyedStore({
					namespace,
					maxEntries
				});
				return store;
			} catch (error) {
				warnOnce("open", error);
				return;
			}
		};
	};
	const openWorkspaceStore = createStoreOpener(SLACK_AGENT_VIEW_STATE_NAMESPACE, SLACK_AGENT_VIEW_STATE_MAX_ENTRIES);
	const openThreadStore = createStoreOpener(SLACK_AGENT_VIEW_THREAD_STATE_NAMESPACE, SLACK_AGENT_VIEW_THREAD_STATE_MAX_ENTRIES);
	const workspaceStateKey = () => {
		const apiAppId = params.getApiAppId();
		return apiAppId ? JSON.stringify([
			"workspace",
			params.accountId,
			params.getTeamId(),
			apiAppId
		]) : void 0;
	};
	const record = async () => {
		enabled = true;
		loaded = true;
		const stateKey = workspaceStateKey();
		if (persisted || !stateKey) return;
		const openedStore = openWorkspaceStore();
		if (!openedStore) return;
		try {
			await openedStore.register(stateKey, {
				experience: "agent",
				observedAt: Date.now()
			});
			persisted = true;
		} catch (error) {
			warnOnce("persist", error);
		}
	};
	const isEnabled = async () => {
		if (enabled) return true;
		if (loaded) return false;
		const stateKey = workspaceStateKey();
		if (!stateKey) return false;
		const openedStore = openWorkspaceStore();
		if (!openedStore) return false;
		try {
			const stored = await openedStore.lookup(stateKey);
			loaded = true;
			enabled = stored?.experience === "agent";
			persisted = enabled;
			return enabled;
		} catch (error) {
			warnOnce("load", error);
			return false;
		}
	};
	const managedThreadKey = (channelId, threadTs) => JSON.stringify([channelId, threadTs]);
	const managedThreadStateKey = (channelId, threadTs) => {
		const apiAppId = params.getApiAppId();
		return apiAppId ? JSON.stringify([
			"thread",
			params.accountId,
			params.getTeamId(),
			apiAppId,
			channelId,
			threadTs
		]) : void 0;
	};
	const rememberManagedThread = (key) => {
		managedThreads.delete(key);
		managedThreads.set(key, true);
		if (managedThreads.size <= SLACK_MANAGED_THREAD_CACHE_MAX_ENTRIES) return;
		const oldestKey = managedThreads.keys().next().value;
		if (oldestKey !== void 0) managedThreads.delete(oldestKey);
	};
	const recordManagedThread = async (channelId, threadTs) => {
		const key = managedThreadKey(channelId, threadTs);
		rememberManagedThread(key);
		const stateKey = managedThreadStateKey(channelId, threadTs);
		const openedStore = stateKey ? openThreadStore() : void 0;
		if (!openedStore || !stateKey) return;
		try {
			await openedStore.register(stateKey, {
				experience: "managed-thread",
				observedAt: Date.now()
			});
		} catch (error) {
			warnOnce("persist", error);
		}
	};
	const isManagedThread = async (channelId, threadTs) => {
		const key = managedThreadKey(channelId, threadTs);
		if (managedThreads.has(key)) return true;
		const stateKey = managedThreadStateKey(channelId, threadTs);
		const openedStore = stateKey ? openThreadStore() : void 0;
		if (!openedStore || !stateKey) return false;
		try {
			const found = (await openedStore.lookup(stateKey))?.experience === "managed-thread";
			if (found) rememberManagedThread(key);
			return found;
		} catch (error) {
			warnOnce("load", error);
			return false;
		}
	};
	return {
		isEnabled,
		isManagedThread,
		record,
		recordManagedThread
	};
}
//#endregion
//#region extensions/slack/src/monitor/assistant-thread-context.ts
const SLACK_ASSISTANT_THREAD_CONTEXT_METADATA_EVENT = "assistant_thread_context";
const SLACK_ASSISTANT_CONTEXT_TTL_MS = 864e5;
const SLACK_ASSISTANT_CONTEXT_CLEANUP_INTERVAL_MS = 6e5;
function buildSlackAssistantThreadMetadata(context) {
	const eventPayload = {};
	if (context.channelId) eventPayload.channel_id = context.channelId;
	if (context.teamId) eventPayload.team_id = context.teamId;
	if (context.enterpriseId) eventPayload.enterprise_id = context.enterpriseId;
	return {
		event_type: SLACK_ASSISTANT_THREAD_CONTEXT_METADATA_EVENT,
		event_payload: eventPayload
	};
}
function parseSlackAssistantThreadMetadata(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const metadata = value;
	if (metadata.event_type !== SLACK_ASSISTANT_THREAD_CONTEXT_METADATA_EVENT) return;
	const payload = metadata.event_payload;
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return;
	const record = payload;
	return {
		channelId: readNonBlankStringField(record, "channel_id"),
		teamId: readNonBlankStringField(record, "team_id"),
		enterpriseId: readNonBlankStringField(record, "enterprise_id")
	};
}
async function readSlackAssistantThreadContext(params) {
	const response = await params.client.conversations.replies({
		channel: params.channelId,
		ts: params.threadTs,
		include_all_metadata: true,
		limit: 4
	});
	for (const message of response.messages ?? []) {
		const context = parseSlackAssistantThreadMetadata(message.metadata);
		if (context) return {
			assistantChannelId: params.channelId,
			threadTs: params.threadTs,
			userId: params.userId,
			...context
		};
	}
}
function createSlackAssistantThreadContextStore(params) {
	const contexts = /* @__PURE__ */ new Map();
	let lastCleanupAt = Date.now();
	const get = (channelId, threadTs, eventScope) => {
		if (!channelId || !threadTs) return;
		const key = buildContextKey(params.accountId, channelId, threadTs, eventScope);
		const entry = contexts.get(key);
		if (!entry) return;
		if (Date.now() - entry.updatedAt > SLACK_ASSISTANT_CONTEXT_TTL_MS) {
			contexts.delete(key);
			return;
		}
		return entry;
	};
	const save = (context, eventScope) => {
		const now = Date.now();
		if (now - lastCleanupAt >= SLACK_ASSISTANT_CONTEXT_CLEANUP_INTERVAL_MS) {
			lastCleanupAt = now;
			const cutoff = now - SLACK_ASSISTANT_CONTEXT_TTL_MS;
			for (const [key, entry] of contexts) if (entry.updatedAt < cutoff) contexts.delete(key);
		}
		contexts.set(buildContextKey(params.accountId, context.assistantChannelId, context.threadTs, eventScope), {
			...context,
			updatedAt: now
		});
	};
	return {
		get,
		save
	};
}
function readNonBlankStringField(record, key) {
	const raw = record[key];
	return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
function buildContextKey(accountId, channelId, threadTs, eventScope) {
	const key = `${channelId}:${threadTs}`;
	return eventScope ? `${accountId}:${eventScope.teamId}:${key}` : key;
}
//#endregion
//#region extensions/slack/src/monitor/channel-type.ts
function inferSlackChannelType(channelId) {
	const trimmed = channelId?.trim();
	if (!trimmed) return;
	if (trimmed.startsWith("D")) return "im";
	if (trimmed.startsWith("C")) return "channel";
	if (trimmed.startsWith("G")) return "group";
}
function normalizeSlackChannelType(channelType, channelId) {
	const normalized = normalizeOptionalLowercaseString(channelType);
	const inferred = inferSlackChannelType(channelId);
	if (normalized === "im" || normalized === "mpim" || normalized === "channel" || normalized === "group") {
		if (inferred === "im" && normalized !== "im") return "im";
		return normalized;
	}
	return inferred ?? "channel";
}
function resolveSlackChatType(channelType) {
	if (channelType === "im") return "direct";
	if (channelType === "mpim") return "group";
	return "channel";
}
//#endregion
//#region extensions/slack/src/monitor/lru-map-cache.ts
/** LRU-touch read: move hit to newest so pruneMapToMaxSize keeps active keys. */
function readLruMapEntry(cache, cacheKey) {
	const cached = cache.get(cacheKey);
	if (cached) {
		cache.delete(cacheKey);
		cache.set(cacheKey, cached);
	}
	return cached;
}
function writeLruMapEntry(cache, cacheKey, entry, maxEntries) {
	cache.delete(cacheKey);
	cache.set(cacheKey, entry);
	pruneMapToMaxSize(cache, maxEntries);
}
//#endregion
//#region extensions/slack/src/monitor/enterprise-install.ts
const SLACK_CHANNEL_ID_RE = /^[CDG][A-Z0-9]{8,}$/;
const SLACK_USER_ID_RE = /^[BUW][A-Z0-9]{8,}$/;
function isWorkspaceScopedSlackChannelEntry(value, options) {
	if (typeof value !== "string") return false;
	const normalized = value.trim();
	if (normalized === "*") return options?.allowWildcard === true;
	return isWorkspaceQualifiedSlackTarget(normalized, "channel");
}
function isStableSlackAllowlistUserEntry(value) {
	if (typeof value !== "string") return false;
	const normalized = value.trim();
	if (normalized === "*") return true;
	if (isWorkspaceQualifiedSlackTarget(normalized, "user")) return true;
	const prefixed = /^(?:slack|user):([BUW][A-Z0-9]{8,})$/.exec(normalized);
	return Boolean(prefixed?.[1]) || SLACK_USER_ID_RE.test(normalized);
}
function isStableSlackToolsBySenderEntry(value) {
	if (typeof value !== "string") return false;
	const normalized = value.trim();
	if (normalized === "*") return true;
	const prefixed = /^(?:id:|channel:slack:)([UW][A-Z0-9]{8,})$/.exec(normalized);
	return Boolean(prefixed?.[1]) || SLACK_USER_ID_RE.test(normalized);
}
function assertStableEntries(params) {
	const invalid = params.values?.find((value) => !params.predicate(value));
	if (invalid !== void 0) throw new Error(`Slack Enterprise Grid org installs require stable Slack IDs in ${params.path}; invalid entry ${JSON.stringify(invalid)}`);
}
function isWorkspaceQualifiedSlackTarget(value, kind) {
	if (typeof value !== "string") return false;
	try {
		const target = parseSlackTarget(value);
		const idPattern = kind === "channel" ? SLACK_CHANNEL_ID_RE : SLACK_USER_ID_RE;
		return target?.kind === kind && /^T[A-Z0-9]{8,}$/.test(target.teamId ?? "") && idPattern.test(target.id);
	} catch {
		return false;
	}
}
/** Validate every policy surface that would otherwise require name resolution. */
function assertEnterpriseSlackPolicyConfig(params) {
	const { config, accountId } = params;
	if (config.dangerouslyAllowNameMatching === true) throw new Error(`Slack Enterprise Grid org account "${accountId}" cannot use dangerouslyAllowNameMatching`);
	assertStableEntries({
		values: config.mentionPatterns?.allowIn,
		path: `channels.slack.accounts.${accountId}.mentionPatterns.allowIn`,
		predicate: (value) => isWorkspaceQualifiedSlackTarget(value, "channel")
	});
	assertStableEntries({
		values: config.mentionPatterns?.denyIn,
		path: `channels.slack.accounts.${accountId}.mentionPatterns.denyIn`,
		predicate: (value) => isWorkspaceQualifiedSlackTarget(value, "channel")
	});
	assertStableEntries({
		values: config.allowFrom,
		path: `channels.slack.accounts.${accountId}.allowFrom`,
		predicate: isStableSlackAllowlistUserEntry
	});
	assertStableEntries({
		values: config.dm?.groupChannels,
		path: `channels.slack.accounts.${accountId}.dm.groupChannels`,
		predicate: (value) => isWorkspaceScopedSlackChannelEntry(value)
	});
	if (config.reactionNotifications === "allowlist") assertStableEntries({
		values: config.reactionAllowlist,
		path: `channels.slack.accounts.${accountId}.reactionAllowlist`,
		predicate: isStableSlackAllowlistUserEntry
	});
	for (const [channelKey, channel] of Object.entries(config.channels ?? {})) {
		if (!isWorkspaceScopedSlackChannelEntry(channelKey, { allowWildcard: true })) throw new Error(`Slack Enterprise Grid org installs require stable Slack channel IDs with workspace scope; invalid channels key ${JSON.stringify(channelKey)}`);
		assertStableEntries({
			values: channel?.users,
			path: `channels.slack.accounts.${accountId}.channels.${channelKey}.users`,
			predicate: isStableSlackAllowlistUserEntry
		});
		assertStableEntries({
			values: Object.keys(channel?.toolsBySender ?? {}),
			path: `channels.slack.accounts.${accountId}.channels.${channelKey}.toolsBySender`,
			predicate: isStableSlackToolsBySenderEntry
		});
	}
}
function assertEnterpriseSlackBindingsAreWorkspaceQualified(params) {
	const accountId = normalizeAccountId(params.accountId);
	const defaultAccountId = normalizeAccountId(resolveDefaultSlackAccountId(params.cfg));
	const configured = params.cfg.bindings?.filter((binding) => {
		if (binding.match.channel.trim().toLowerCase() !== "slack") return false;
		const bindingAccountId = binding.match.accountId?.trim();
		return bindingAccountId === "*" || (bindingAccountId ? normalizeAccountId(bindingAccountId) === accountId : accountId === defaultAccountId);
	});
	for (const binding of configured ?? []) {
		if (binding.type === "acp") throw new Error(`Slack Enterprise Grid org account "${params.accountId}" cannot use configured ACP bindings because current-conversation bindings are not workspace-qualified`);
		const peerId = binding.match.peer?.id.trim();
		if (!peerId || peerId === "*") {
			if (/^T[A-Z0-9]{8,}$/.test(binding.match.teamId?.trim() ?? "")) continue;
			throw new Error(`Slack Enterprise Grid org account "${params.accountId}" requires match.teamId on configured Slack bindings without a workspace-qualified peer`);
		}
		let target;
		try {
			target = parseSlackTarget(peerId);
		} catch {
			target = void 0;
		}
		const expectedKind = binding.match.peer?.kind === "direct" ? "user" : "channel";
		if (!target?.teamId || !isWorkspaceQualifiedSlackTarget(peerId, expectedKind)) throw new Error(`Slack Enterprise Grid org account "${params.accountId}" requires configured Slack binding peers to use team:<team-id>:channel:<channel-id> or team:<team-id>:user:<user-id>`);
		const matchTeamId = binding.match.teamId?.trim();
		if (matchTeamId && matchTeamId.toLowerCase() !== target.teamId.toLowerCase()) throw new Error(`Slack Enterprise Grid org account "${params.accountId}" has conflicting workspace IDs in configured Slack binding match.teamId and peer.id`);
	}
}
function resolveSlackInstallationIdentity(params) {
	const auth = params.auth;
	if (!auth) return {
		kind: "degraded",
		reason: "auth_test_failed"
	};
	const isEnterpriseInstall = auth.is_enterprise_install === true;
	const apiAppId = normalizeOptionalString(auth.app_id);
	const enterpriseId = normalizeOptionalString(auth.enterprise_id);
	const transportApiAppId = normalizeOptionalString(params.transportApiAppId);
	if (isEnterpriseInstall) {
		if (!enterpriseId) throw new Error("Slack org-wide auth.test returned no enterprise_id");
		if (apiAppId && transportApiAppId && apiAppId !== transportApiAppId) throw new Error(`Slack token mismatch: bot token app_id=${apiAppId} but transport app_id=${transportApiAppId}`);
		const effectiveApiAppId = apiAppId ?? transportApiAppId;
		return {
			kind: "enterprise",
			...effectiveApiAppId ? { apiAppId: effectiveApiAppId } : {},
			enterpriseId
		};
	}
	const teamId = normalizeOptionalString(auth.team_id);
	if (!teamId) throw new Error("Slack workspace auth.test returned no team_id");
	const teamName = normalizeOptionalString(auth.team);
	const workspaceApiAppId = apiAppId ?? transportApiAppId;
	return {
		kind: "workspace",
		teamId,
		...teamName ? { teamName } : {},
		...workspaceApiAppId ? { apiAppId: workspaceApiAppId } : {},
		...enterpriseId ? { enterpriseId } : {}
	};
}
function resolveSlackIdentityHealth(params) {
	const lastError = normalizeOptionalString(params.authTestError) ?? normalizeOptionalString(params.authIdentityWarning) ?? (params.installationIdentity.kind === "degraded" || !params.botUserId.trim() ? "slack bot identity unavailable" : void 0);
	return lastError ? {
		lifecycle: "blocked",
		lastError
	} : {
		lifecycle: "ready",
		lastError: null
	};
}
//#endregion
//#region extensions/slack/src/monitor/reconnect-policy.ts
const SLACK_AUTH_ERROR_RE = /account_inactive|invalid_auth|token_revoked|token_expired|not_authed|org_login_required|team_access_not_granted|user_removed_from_team|team_disabled|missing_scope|cannot_find_service|invalid_token/i;
const NO_ERROR_DETAIL = "no error detail";
const SLACK_SOCKET_RECONNECT_POLICY = {
	initialMs: 2e3,
	maxMs: 3e4,
	factor: 1.8,
	jitter: .25
};
const SLACK_SOCKET_SHARED_CONNECTION_DOCS_URL = "https://docs.slack.dev/apis/events-api/using-socket-mode#using-multiple-connections";
const SLACK_SOCKET_HELLO_MARKER = Buffer.from("\"hello\"");
function getSocketEmitter(app) {
	const receiver = app.receiver;
	const client = receiver && typeof receiver === "object" ? receiver.client : void 0;
	if (!client || typeof client !== "object") return null;
	const on = client.on;
	const off = client.off;
	if (typeof on !== "function" || typeof off !== "function") return null;
	return {
		on: (event, listener) => on.call(client, event, listener),
		off: (event, listener) => off.call(client, event, listener)
	};
}
function isBufferArray(value) {
	return Array.isArray(value) && value.every((entry) => Buffer.isBuffer(entry));
}
function resolveSlackSocketModeConnectionCount(message) {
	const buffer = typeof message === "string" ? Buffer.from(message) : Buffer.isBuffer(message) ? message : message instanceof ArrayBuffer ? Buffer.from(message) : isBufferArray(message) ? Buffer.concat(message) : void 0;
	if (!buffer?.includes(SLACK_SOCKET_HELLO_MARKER)) return;
	let payload;
	try {
		payload = JSON.parse(buffer.toString("utf8"));
	} catch {
		return;
	}
	const count = isRecord(payload) && payload.type === "hello" ? payload.num_connections : void 0;
	return typeof count === "number" && Number.isSafeInteger(count) && count >= 0 ? count : void 0;
}
function formatSlackSocketModeSharedConnectionWarning(activeConnections) {
	return [
		`slack socket mode reports ${activeConnections} active connections for this Slack app`,
		"Slack may deliver each event to any one connection",
		"ensure every OpenClaw gateway sharing this app has equivalent routing and authorization, or use a separate Slack app per gateway, one relay ingress, or HTTP Request URLs behind a load balancer",
		`See ${SLACK_SOCKET_SHARED_CONNECTION_DOCS_URL}`
	].join("; ");
}
function registerSlackSocketModeConnectionDiagnostics(params) {
	const emitter = getSocketEmitter(params.app);
	if (!emitter) return () => {};
	let hasWarned = false;
	const listener = (message, isBinary) => {
		if (isBinary === true || hasWarned) return;
		const activeConnections = resolveSlackSocketModeConnectionCount(message);
		if (activeConnections === void 0 || activeConnections <= 1) return;
		hasWarned = true;
		params.onSharedConnection(activeConnections);
	};
	emitter.on("ws_message", listener);
	return () => {
		emitter.off("ws_message", listener);
	};
}
function waitForSlackSocketDisconnect(app, abortSignal) {
	return new Promise((resolve) => {
		const emitter = getSocketEmitter(app);
		if (!emitter) {
			abortSignal?.addEventListener("abort", () => resolve({ event: "disconnect" }), { once: true });
			return;
		}
		const disconnectListener = () => resolveOnce({ event: "disconnect" });
		const startFailListener = (error) => resolveOnce({
			event: "unable_to_socket_mode_start",
			error
		});
		const abortListener = () => resolveOnce({ event: "disconnect" });
		const cleanup = () => {
			emitter.off("disconnected", disconnectListener);
			emitter.off("unable_to_socket_mode_start", startFailListener);
			abortSignal?.removeEventListener("abort", abortListener);
		};
		const resolveOnce = (value) => {
			cleanup();
			resolve(value);
		};
		emitter.on("disconnected", disconnectListener);
		emitter.on("unable_to_socket_mode_start", startFailListener);
		abortSignal?.addEventListener("abort", abortListener, { once: true });
	});
}
/**
* Detect permanent Slack account and credential failures.
* Transient request and HTTP failures stay in OpenClaw's reconnect loop.
*/
function isNonRecoverableSlackAuthError(error) {
	return SLACK_AUTH_ERROR_RE.test(formatUnknownError(error, ""));
}
function formatUnknownError(error, fallback = NO_ERROR_DETAIL) {
	return formatSlackError(error, fallback);
}
//#endregion
//#region extensions/slack/src/monitor/socket-mode-envelope.ts
function installSlackSocketModeEnvelopeGuard(client, acknowledge, logger) {
	const dispatchers = client.listeners("ws_message");
	for (const dispatch of dispatchers) client.off("ws_message", dispatch);
	client.on("ws_message", (data, isBinary) => {
		if (!isBinary) {
			let envelope;
			try {
				envelope = asOptionalRecord(JSON.parse(typeof data === "string" ? data : new TextDecoder().decode(data)));
			} catch {}
			const payload = asOptionalRecord(envelope?.payload);
			const event = asOptionalRecord(payload?.event);
			if (envelope?.type === "events_api" && !normalizeOptionalString(event?.type)) {
				logger.warn(payload?.type === "app_rate_limited" ? "Slack Events API delivery is rate limited; acknowledging the control notification." : "Ignoring a Slack Events API envelope without an event type.");
				const envelopeId = normalizeOptionalString(envelope.envelope_id);
				if (envelopeId) acknowledge(envelopeId).catch(() => {
					logger.warn("Could not acknowledge the event-less Slack envelope; Slack may retry.");
				});
				return;
			}
		}
		for (const dispatch of dispatchers) dispatch.call(client, data, isBinary);
	});
}
//#endregion
//#region extensions/slack/src/monitor/provider-support.ts
const OPENCLAW_SLACK_CLIENT_PING_TIMEOUT_MS = 15e3;
const OPENCLAW_SLACK_SOCKET_START_FAILED_EVENT = "unable_to_socket_mode_start";
const OPENCLAW_SLACK_NATIVE_RECONNECT_OBSERVER_KEY = "__openclawNativeReconnectFailureObserver";
const SLACK_SOCKET_PONG_TIMEOUT_WARNING_PREFIX = "A pong wasn't received from the server";
const SLACK_SOCKET_PING_TIMEOUT_WARNING_PREFIX = "A ping wasn't received from the server";
const SLACK_SOCKET_LOG_LEVEL_IGNORED_WARNING_RE = /^The logLevel given to .+ was ignored as you also gave logger$/;
function isConstructorFunction(value) {
	return typeof value === "function";
}
function installSlackNativeReconnectFailureObserver(receiver) {
	if (!receiver || typeof receiver !== "object") return;
	const client = Reflect.get(receiver, "client");
	if (!client || typeof client !== "object") return;
	if (Reflect.get(client, OPENCLAW_SLACK_NATIVE_RECONNECT_OBSERVER_KEY)) return;
	const delayReconnectAttempt = Reflect.get(client, "delayReconnectAttempt");
	const emit = Reflect.get(client, "emit");
	if (typeof delayReconnectAttempt !== "function" || typeof emit !== "function") return;
	Reflect.set(client, OPENCLAW_SLACK_NATIVE_RECONNECT_OBSERVER_KEY, true);
	Reflect.set(client, "delayReconnectAttempt", function patchedDelayReconnectAttempt(callback) {
		if (typeof callback !== "function") return delayReconnectAttempt.call(this, callback);
		const nextFailureCount = Number(Reflect.get(this, "numOfConsecutiveReconnectionFailures") ?? 0) + 1;
		Reflect.set(this, "numOfConsecutiveReconnectionFailures", nextFailureCount);
		const pingTimeoutMs = Number(Reflect.get(this, "clientPingTimeoutMS"));
		const delayMs = (Number.isFinite(pingTimeoutMs) && pingTimeoutMs >= 0 ? pingTimeoutMs : OPENCLAW_SLACK_CLIENT_PING_TIMEOUT_MS) * nextFailureCount;
		const logger = Reflect.get(this, "logger");
		logger?.debug?.(`Before trying to reconnect, this client will wait for ${delayMs} milliseconds`);
		return new Promise((resolve, reject) => {
			const reconnectTimer = setTimeout(() => {
				Reflect.set(this, "reconnectionTimer", void 0);
				if (Reflect.get(this, "shuttingDown")) {
					logger?.debug?.("Client shutting down, will not attempt reconnect.");
					resolve(void 0);
					return;
				}
				logger?.debug?.("Continuing with reconnect...");
				emit.call(this, "reconnecting");
				Promise.resolve(callback.call(this)).then(resolve, (error) => {
					if (callback === Reflect.get(this, "start")) {
						emit.call(this, OPENCLAW_SLACK_SOCKET_START_FAILED_EVENT, error);
						resolve(void 0);
						return;
					}
					reject(toErrorObject(error, "Non-Error rejection"));
				});
			}, delayMs);
			Reflect.set(this, "reconnectionTimer", reconnectTimer);
		});
	});
}
function createSlackRelayReceiver() {
	return {
		init() {},
		start: () => Promise.resolve(void 0),
		stop: () => Promise.resolve(void 0)
	};
}
function resolveSlackBoltModule(value) {
	if (!value || typeof value !== "object") return null;
	const app = Reflect.get(value, "App");
	const httpReceiver = Reflect.get(value, "HTTPReceiver");
	const socketModeReceiver = Reflect.get(value, "SocketModeReceiver");
	if (!isConstructorFunction(app) || !isConstructorFunction(httpReceiver) || !isConstructorFunction(socketModeReceiver)) return null;
	return {
		App: app,
		HTTPReceiver: httpReceiver,
		SocketModeReceiver: socketModeReceiver
	};
}
function resolveSlackBoltInterop(params) {
	const { defaultImport, namespaceImport } = params;
	const nestedDefault = defaultImport && typeof defaultImport === "object" ? Reflect.get(defaultImport, "default") : void 0;
	const namespaceDefault = namespaceImport && typeof namespaceImport === "object" ? Reflect.get(namespaceImport, "default") : void 0;
	const namespaceReceiver = namespaceImport && typeof namespaceImport === "object" ? Reflect.get(namespaceImport, "HTTPReceiver") : void 0;
	const namespaceSocketModeReceiver = namespaceImport && typeof namespaceImport === "object" ? Reflect.get(namespaceImport, "SocketModeReceiver") : void 0;
	const directModule = resolveSlackBoltModule(defaultImport) ?? resolveSlackBoltModule(nestedDefault) ?? resolveSlackBoltModule(namespaceDefault) ?? resolveSlackBoltModule(namespaceImport);
	if (directModule) return directModule;
	if (isConstructorFunction(defaultImport) && isConstructorFunction(namespaceReceiver) && isConstructorFunction(namespaceSocketModeReceiver)) return {
		App: defaultImport,
		HTTPReceiver: namespaceReceiver,
		SocketModeReceiver: namespaceSocketModeReceiver
	};
	throw new TypeError("Unable to resolve @slack/bolt App/HTTPReceiver exports");
}
function publishSlackConnectedStatus(setStatus, identityHealth = {
	lifecycle: "ready",
	lastError: null
}) {
	if (!setStatus) return;
	const lastConnectedAt = Date.now();
	setStatus(identityHealth.lifecycle === "blocked" ? channelBlockedPatch(identityHealth.lastError, {
		connected: true,
		lastConnectedAt
	}) : channelReadyPatch({ lastConnectedAt }));
}
function publishSlackBlockedStatus(setStatus, error) {
	if (!setStatus) return;
	setStatus(channelBlockedPatch(formatUnknownError(error), { connected: false }));
}
function publishSlackDisconnectedStatus(setStatus, error) {
	if (!setStatus) return;
	const at = Date.now();
	const message = error ? formatUnknownError(error) : void 0;
	setStatus({
		connected: false,
		lifecycle: "recovering",
		lastDisconnect: message ? {
			at,
			error: message
		} : { at },
		lastError: message ?? null
	});
}
function isSlackSocketHeartbeatTimeoutWarning(args) {
	return typeof args[0] === "string" && (args[0].startsWith(SLACK_SOCKET_PONG_TIMEOUT_WARNING_PREFIX) || args[0].startsWith(SLACK_SOCKET_PING_TIMEOUT_WARNING_PREFIX));
}
function isSlackSocketSelfInflictedLoggerWarning(args) {
	return typeof args[0] === "string" && SLACK_SOCKET_LOG_LEVEL_IGNORED_WARNING_RE.test(args[0]);
}
function formatSlackSdkLogArgs(args) {
	return args.map((arg) => formatUnknownError(arg, "")).filter(Boolean).join(" ");
}
function createSlackSocketModeLogger(sink = console) {
	let level = "info";
	let name = "socket-mode";
	const prefix = () => `socket-mode:${name}`;
	let lastMessage;
	const remember = (args) => {
		const message = formatSlackSdkLogArgs([prefix(), ...args]);
		if (message) lastMessage = message;
	};
	return {
		debug: () => {},
		info: () => {},
		warn: (...args) => {
			if (isSlackSocketHeartbeatTimeoutWarning(args) || isSlackSocketSelfInflictedLoggerWarning(args)) return;
			remember(args);
			sink.warn(prefix(), ...args);
		},
		error: (...args) => {
			remember(args);
			sink.error(prefix(), ...args);
		},
		setLevel: (nextLevel) => {
			level = nextLevel;
		},
		getLevel: () => level,
		setName: (nextName) => {
			name = nextName;
		},
		getLastMessage: () => lastMessage
	};
}
function shouldSkipOpenClawSlackSelfEvent(args) {
	const botId = args.context?.botId;
	const botUserId = args.context?.botUserId;
	const message = asOptionalRecord(args.message);
	if (message?.subtype === "bot_message" && botId && message.bot_id === botId) return true;
	const event = asOptionalRecord(args.event);
	if (event?.type === "message" && event.subtype === "message_changed" && event.user === botUserId) return false;
	const eventsWhichShouldBeKept = /* @__PURE__ */ new Set(["member_joined_channel", "member_left_channel"]);
	return Boolean(botUserId && event && event.user === botUserId && typeof event.type === "string" && !eventsWhichShouldBeKept.has(event.type));
}
function createSlackBoltApp(params) {
	const socketModeLogger = createSlackSocketModeLogger();
	const socketModeReceiverOptions = {
		appToken: params.appToken ?? "",
		autoReconnectEnabled: true,
		clientPingTimeout: OPENCLAW_SLACK_CLIENT_PING_TIMEOUT_MS,
		logger: socketModeLogger,
		...params.dispatcher ? { dispatcher: params.dispatcher } : {},
		installerOptions: { clientOptions: params.clientOptions },
		...params.wrapReceiver ? { processEventErrorHandler: async () => false } : {}
	};
	let receiver;
	if (params.slackMode === "socket") {
		const socketReceiver = new params.interop.SocketModeReceiver(socketModeReceiverOptions);
		const socketClient = socketReceiver.client;
		const send = Reflect.get(socketClient, "send");
		if (typeof send !== "function") throw new Error("Slack Socket Mode client requires the SDK acknowledgement sender.");
		installSlackSocketModeEnvelopeGuard(socketClient, async (envelopeId) => {
			await send.call(socketClient, envelopeId);
		}, socketModeLogger);
		installSlackNativeReconnectFailureObserver(socketReceiver);
		receiver = socketReceiver;
	} else if (params.slackMode === "http") receiver = new params.interop.HTTPReceiver({
		signingSecret: params.signingSecret ?? "",
		endpoints: params.slackWebhookPath,
		...params.wrapReceiver ? { processEventErrorHandler: async () => false } : {}
	});
	else receiver = createSlackRelayReceiver();
	const appReceiver = receiver && params.wrapReceiver ? params.wrapReceiver(receiver) : receiver;
	const app = new params.interop.App({
		token: params.token,
		clientOptions: params.clientOptions,
		ignoreSelf: false,
		tokenVerificationEnabled: false,
		...appReceiver ? { receiver: appReceiver } : {}
	});
	app.use(async (args) => {
		await params.onContextIdentity?.({
			...args.context,
			apiAppId: normalizeOptionalString(asOptionalRecord(args.body)?.api_app_id)
		});
		if (shouldSkipOpenClawSlackSelfEvent(args)) return;
		await args.next();
	});
	return {
		app,
		receiver,
		socketModeLogger
	};
}
function createSlackSocketDisconnectWaiter(app, abortSignal) {
	const waiterAbortController = new AbortController();
	const relayAbort = () => waiterAbortController.abort();
	let latest;
	abortSignal?.addEventListener("abort", relayAbort, { once: true });
	return {
		promise: waitForSlackSocketDisconnect(app, waiterAbortController.signal).then((value) => {
			latest = value;
			return value;
		}),
		getLatest: () => latest,
		cancel: () => {
			waiterAbortController.abort();
			abortSignal?.removeEventListener("abort", relayAbort);
		},
		complete: () => {
			abortSignal?.removeEventListener("abort", relayAbort);
		}
	};
}
async function startSlackSocketAndWaitForDisconnect(params) {
	const disconnectWaiter = createSlackSocketDisconnectWaiter(params.app, params.abortSignal);
	try {
		await Promise.resolve(params.app.start());
		if (params.abortSignal?.aborted) {
			disconnectWaiter.cancel();
			return null;
		}
		await params.onStarted?.();
		const disconnect = await disconnectWaiter.promise;
		disconnectWaiter.complete();
		return disconnect;
	} catch (err) {
		await Promise.resolve();
		const disconnect = disconnectWaiter.getLatest();
		disconnectWaiter.cancel();
		if (isMissingSocketStartErrorDetail(err) && disconnect?.error !== void 0) throw toErrorObject(disconnect.error, "Non-Error thrown");
		if (isMissingSocketStartErrorDetail(err)) {
			const suffix = disconnect ? ` after ${disconnect.event}` : "";
			throw new Error(`Slack Socket Mode start failed${suffix} without error detail`, { cause: err });
		}
		throw err;
	}
}
function isMissingSocketStartErrorDetail(err) {
	return err === void 0 || err === null || err === "" || err instanceof Error && err.message === "";
}
function resolveSlackSocketShutdownClient(app) {
	if (!app || typeof app !== "object") return;
	const receiver = Reflect.get(app, "receiver");
	if (!receiver || typeof receiver !== "object") return;
	const client = Reflect.get(receiver, "client");
	if (!client || typeof client !== "object") return;
	return client;
}
async function gracefulStopSlackApp(app) {
	const socketClient = resolveSlackSocketShutdownClient(app);
	if (socketClient) socketClient.shuttingDown = true;
	await Promise.resolve(app.stop()).catch(() => void 0);
}
function formatSlackResolvedLabel(params) {
	const extras = params.extra?.filter(Boolean) ?? [];
	const display = params.name ?? params.id;
	if (params.input === params.id && !params.name && extras.length === 0) return null;
	const details = [...params.input === params.id || display === params.id ? [] : [`id:${params.id}`], ...extras];
	const suffix = details.length > 0 ? ` (${details.join(", ")})` : "";
	return `${params.input}→${display}${suffix}`;
}
function formatSlackChannelResolved(entry) {
	const id = entry.id ?? entry.input;
	return formatSlackResolvedLabel({
		input: entry.input,
		id,
		name: entry.name,
		extra: entry.archived ? ["archived"] : []
	});
}
function formatSlackUserResolved(entry) {
	const id = entry.id ?? entry.input;
	return formatSlackResolvedLabel({
		input: entry.input,
		id,
		name: entry.name,
		extra: entry.note ? [entry.note] : []
	});
}
//#endregion
//#region extensions/slack/src/monitor/system-event-session.ts
function createSlackSystemEventRouteResolver(params) {
	return (event) => {
		const channelId = normalizeOptionalString(event.channelId) ?? "";
		const senderId = normalizeOptionalString(event.senderId) ?? "";
		const channelType = normalizeSlackChannelType(event.channelType ?? params.recallSlackChannelType(channelId, event.eventScope), channelId);
		if (!channelId && (!(channelType === "im") || !senderId)) return {
			agentId: resolveAgentRoute({
				cfg: params.cfg,
				channel: "slack",
				accountId: params.accountId,
				teamId: event.eventScope?.teamId ?? params.getTeamId()
			}).agentId,
			sessionKey: params.mainKey
		};
		const route = resolveSlackSystemEventRoute({
			cfg: params.cfg,
			accountId: params.accountId,
			teamId: params.getTeamId(),
			threadInheritParent: params.threadInheritParent,
			channelId,
			channelType,
			senderId,
			threadTs: event.threadTs,
			eventScope: event.eventScope
		});
		if (route) return route;
		throw new Error("Slack system event route requires a peer");
	};
}
function resolveSlackSystemEventRoute(params) {
	const isDirectMessage = params.channelType === "im";
	const peerId = isDirectMessage ? params.senderId : params.channelId;
	if (!peerId) return;
	const peerKind = isDirectMessage ? "direct" : params.channelType === "mpim" ? "group" : "channel";
	let route = resolveAgentRoute({
		cfg: params.cfg,
		channel: "slack",
		accountId: params.accountId,
		teamId: params.eventScope?.teamId ?? params.teamId,
		peer: {
			kind: peerKind,
			id: qualifySlackRoutePeerId({
				id: peerId,
				kind: isDirectMessage ? "user" : "channel",
				eventScope: params.eventScope
			})
		}
	});
	if (params.eventScope && isDirectMessage && route.dmScope === "main") {
		const sessionKey = resolveSlackEnterpriseMainDmSessionKey({
			baseSessionKey: route.sessionKey,
			accountId: params.accountId,
			eventScope: params.eventScope
		});
		route = {
			...route,
			sessionKey,
			mainSessionKey: sessionKey
		};
	}
	const threadTs = normalizeOptionalString(params.threadTs);
	const baseConversationId = qualifySlackConversationId(isDirectMessage ? `user:${params.senderId}` : params.channelId, params.eventScope);
	const threadBindingRoute = !params.eventScope && threadTs ? resolveRuntimeConversationBindingRoute({
		route,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: threadTs,
			parentConversationId: baseConversationId
		}
	}) : null;
	const runtimeRoute = params.eventScope ? {
		route,
		bindingRecord: null,
		boundSessionKey: void 0
	} : threadBindingRoute?.boundSessionKey || threadBindingRoute?.bindingRecord ? threadBindingRoute : resolveRuntimeConversationBindingRoute({
		route,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: baseConversationId
		}
	});
	if (runtimeRoute.boundSessionKey) return runtimeRoute.route;
	const sessionKey = resolveThreadSessionKeys({
		baseSessionKey: runtimeRoute.route.sessionKey,
		threadId: threadTs,
		parentSessionKey: threadTs && params.threadInheritParent ? runtimeRoute.route.sessionKey : void 0
	}).sessionKey;
	return {
		agentId: runtimeRoute.route.agentId,
		sessionKey
	};
}
//#endregion
//#region extensions/slack/src/monitor/runtime-policy.ts
function resolveSlackMonitorPolicy(cfg, accountId, runtime) {
	const slack = mergeSlackAccountConfig(cfg, accountId);
	const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy$1({
		providerConfigPresent: cfg.channels?.slack !== void 0,
		groupPolicy: slack.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "slack",
		accountId,
		log: (message) => runtime?.log?.(warn(message))
	});
	return {
		historyLimit: resolvePromptHistoryLimit(slack.historyLimit ?? cfg.messages?.groupChat?.historyLimit),
		dmHistoryLimit: resolvePromptHistoryLimit(slack.dmHistoryLimit, 0),
		sessionScope: cfg.session?.scope ?? "per-sender",
		mainKey: normalizeMainKey(cfg.session?.mainKey),
		dmEnabled: slack.dm?.enabled ?? true,
		dmPolicy: resolveSlackAccountDmPolicy({
			cfg,
			accountId
		}) ?? "pairing",
		allowFrom: normalizeAllowList(resolveSlackAccountAllowFrom({
			cfg,
			accountId
		})),
		allowNameMatching: isDangerousNameMatchingEnabled(slack),
		groupDmEnabled: slack.dm?.groupEnabled ?? false,
		groupDmChannels: normalizeAllowList(slack.dm?.groupChannels),
		defaultRequireMention: slack.requireMention ?? true,
		channelsConfig: slack.channels,
		channelsConfigKeys: Object.keys(slack.channels ?? {}),
		groupPolicy,
		useAccessGroups: true,
		reactionMode: slack.reactionNotifications ?? "own",
		reactionAllowlist: slack.reactionAllowlist ?? [],
		replyToMode: slack.replyToMode ?? "off",
		threadHistoryScope: slack.thread?.historyScope ?? "thread",
		threadInheritParent: slack.thread?.inheritParent ?? false,
		textLimit: resolveTextChunkLimit(cfg, "slack", accountId, { fallbackLimit: SLACK_TEXT_LIMIT }),
		typingReaction: slack.typingReaction?.trim() ?? ""
	};
}
function createSlackRuntimeContextReader(ctx, lookupToken) {
	const readConfig = createRuntimeConfigReader(ctx.cfg);
	let current;
	return async () => {
		for (;;) {
			const cfg = readConfig();
			const identity = ctx.installationIdentity;
			if (!current || current.cfg !== cfg || current.identity !== identity) {
				const next = Object.create(ctx);
				const mutableNext = next;
				Object.assign(next, { cfg }, resolveSlackMonitorPolicy(cfg, ctx.accountId, ctx.runtime));
				mutableNext.resolveSlackSystemEventRoute = createSlackSystemEventRouteResolver({
					cfg,
					accountId: ctx.accountId,
					getTeamId: () => ctx.teamId,
					mainKey: next.mainKey,
					threadInheritParent: next.threadInheritParent,
					recallSlackChannelType: ctx.recallSlackChannelType
				});
				mutableNext.readRuntimeContext = async () => next;
				mutableNext.isRuntimePolicyCurrent = () => readConfig() === cfg && ctx.installationIdentity === identity;
				current = {
					cfg,
					identity,
					pending: resolveWorkspacePolicy(next, lookupToken).then(() => next)
				};
			}
			try {
				const resolved = await current.pending;
				if (resolved.isRuntimePolicyCurrent()) return resolved;
			} catch (error) {
				if (readConfig() === cfg && ctx.installationIdentity === identity) throw error;
			}
		}
	};
}
function resolveStableSlackUserIdEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const mention = /^<@([A-Z][A-Z0-9]+)>$/i.exec(trimmed);
	if (mention) return mention[1]?.toUpperCase();
	const prefixed = /^(?:slack:|user:)([A-Z][A-Z0-9]+)$/i.exec(trimmed);
	if (prefixed) return prefixed[1]?.toUpperCase();
	return /^[UW][A-Z0-9]+$/i.test(trimmed) ? trimmed.toUpperCase() : void 0;
}
function resolveStableSlackUserAllowlistEntries(entries) {
	const resolved = [];
	for (const input of entries) {
		const id = resolveStableSlackUserIdEntry(input);
		if (id) resolved.push({
			input,
			resolved: true,
			id
		});
	}
	return resolved;
}
async function resolveWorkspacePolicy(ctx, resolveToken) {
	if (ctx.installationIdentity.kind === "enterprise") {
		assertEnterpriseSlackPolicyConfig({
			config: mergeSlackAccountConfig(ctx.cfg, ctx.accountId),
			accountId: ctx.accountId
		});
		return;
	}
	const runtime = ctx.runtime;
	const allowNameMatching = ctx.allowNameMatching;
	const allowFrom = ctx.allowFrom;
	let channelsConfig = ctx.channelsConfig;
	if (ctx.installationIdentity.kind !== "workspace") return;
	if (channelsConfig && Object.keys(channelsConfig).length > 0) try {
		const entries = Object.keys(channelsConfig).filter((key) => key !== "*");
		if (entries.length > 0) {
			const resolved = await resolveSlackChannelAllowlist({
				token: resolveToken,
				entries
			});
			const nextChannels = { ...channelsConfig };
			const mapping = [];
			const unresolved = [];
			for (const entry of resolved) {
				const source = channelsConfig?.[entry.input];
				if (!source) continue;
				if (!entry.resolved || !entry.id) {
					unresolved.push(entry.input);
					continue;
				}
				const resolvedLabel = formatSlackChannelResolved(entry);
				if (resolvedLabel) mapping.push(resolvedLabel);
				const existing = nextChannels[entry.id] ?? {};
				nextChannels[entry.id] = {
					...source,
					...existing
				};
			}
			channelsConfig = nextChannels;
			ctx.channelsConfig = nextChannels;
			summarizeMapping("slack channels", mapping, unresolved, runtime);
		}
	} catch (err) {
		runtime.log?.(`slack channel resolve failed; using config entries. ${formatUnknownError(err)}`);
	}
	const dmEntries = new Set(normalizeStringEntries(allowFrom).filter((entry) => entry !== "*"));
	const userEntries = new Set(dmEntries);
	for (const channel of Object.values(channelsConfig ?? {})) addAllowlistUserEntriesFromConfigEntry(userEntries, channel);
	const entries = [...userEntries];
	const resolved = resolveStableSlackUserAllowlistEntries(entries);
	if (allowNameMatching && entries.length > 0) try {
		resolved.push(...await resolveSlackUserAllowlist({
			token: resolveToken,
			entries
		}));
	} catch (err) {
		runtime.log?.(`slack user resolve failed; using config entries. ${formatUnknownError(err)}`);
	}
	const { additions } = buildAllowlistResolutionSummary(resolved.filter((entry) => dmEntries.has(entry.input)), { formatResolved: formatSlackUserResolved });
	ctx.allowFrom = normalizeAllowList(mergeAllowlist({
		existing: allowFrom,
		additions
	}));
	const { resolvedMap, mapping, unresolved } = buildAllowlistResolutionSummary(resolved, { formatResolved: formatSlackUserResolved });
	if (channelsConfig) ctx.channelsConfig = patchAllowlistUsersInConfigEntries({
		entries: channelsConfig,
		resolvedMap
	});
	summarizeMapping("slack users", mapping, unresolved, runtime);
	ctx.channelsConfigKeys = Object.keys(ctx.channelsConfig ?? {});
}
//#endregion
//#region extensions/slack/src/monitor/suggested-prompts.ts
const DEFAULT_SLACK_SUGGESTED_PROMPTS = [
	{
		title: "What can you do?",
		message: "What can you help me with?"
	},
	{
		title: "Summarize this channel",
		message: "Summarize the recent activity in this channel."
	},
	{
		title: "Draft a reply",
		message: "Help me draft a reply."
	}
];
async function updateSlackSuggestedPrompts(params) {
	const prompts = params.prompts.map(({ title, message }) => ({
		title: title.trim(),
		message: message.trim()
	})).filter((prompt) => prompt.title && prompt.message).slice(0, 4);
	if (prompts.length === 0) {
		logVerbose(`slack suggested prompts update failed for channel ${params.channelId}: failed (no prompts)`);
		return "failed";
	}
	try {
		await params.client.assistant.threads.setSuggestedPrompts({
			token: params.botToken,
			channel_id: params.channelId,
			...params.threadTs ? { thread_ts: params.threadTs } : {},
			...params.title?.trim() ? { title: params.title.trim() } : {},
			prompts
		});
		return "accepted";
	} catch (error) {
		const code = error instanceof WebAPIPlatformError ? error.data.error : void 0;
		const outcome = code === "not_agent_app" || code === "missing_scope" ? "rejected" : code === "internal_error" ? "internal_error" : "failed";
		logVerbose(`slack suggested prompts update failed for channel ${params.channelId}: ${outcome}: ${formatSlackError(error)}`);
		return outcome;
	}
}
//#endregion
//#region extensions/slack/src/monitor/context.ts
const SLACK_CHANNEL_CACHE_MAX_ENTRIES = 1024;
const SLACK_USER_CACHE_MAX_ENTRIES = 2048;
const SLACK_AVATAR_CACHE_MAX_ENTRIES = 128;
const SLACK_AVATAR_MAX_BYTES = 262144;
const SLACK_AVATAR_SSRF_POLICY = {
	allowedHostnames: ["avatars.slack-edge.com", "*.slack-edge.com"],
	hostnameAllowlist: ["avatars.slack-edge.com", "*.slack-edge.com"]
};
const SLACK_CHANNEL_DENIAL_WARNING_TTL_MS = 3e5;
const SLACK_CHANNEL_DENIAL_WARNING_MAX_ENTRIES = 1024;
function createSlackMonitorContextFields(params) {
	let identity = {
		teamId: params.teamId,
		apiAppId: params.apiAppId
	};
	const logger = getChildLogger({ module: "slack-auto-reply" });
	const channelCache = /* @__PURE__ */ new Map();
	const userCache = /* @__PURE__ */ new Map();
	const avatarCache = /* @__PURE__ */ new Map();
	const pendingAvatars = /* @__PURE__ */ new Set();
	const channelDenialWarnings = createDedupeCache({
		ttlMs: SLACK_CHANNEL_DENIAL_WARNING_TTL_MS,
		maxSize: SLACK_CHANNEL_DENIAL_WARNING_MAX_ENTRIES
	});
	const assistantThreadContextStore = createSlackAssistantThreadContextStore({ accountId: params.accountId });
	const agentViewState = createSlackAgentViewState({
		accountId: params.accountId,
		getTeamId: () => identity.teamId,
		getApiAppId: () => identity.apiAppId,
		warn: (action, error) => logger.warn({ error: formatSlackError(error) }, `Slack Agent View state failed to ${action}`)
	});
	const allowFrom = normalizeAllowList(params.allowFrom);
	const groupDmChannels = normalizeAllowList(params.groupDmChannels);
	const defaultRequireMention = params.defaultRequireMention ?? true;
	const channelsConfigKeys = Object.keys(params.channelsConfig ?? {});
	const scopedKey = (key, eventScope) => eventScope ? `${params.accountId}:${eventScope.teamId}:${key}` : key;
	const rememberSlackChannelType = (channelId, channelType, eventScope) => {
		const id = normalizeOptionalString(channelId);
		const normalizedType = normalizeOptionalString(channelType)?.toLowerCase();
		if (!id || normalizedType !== "im" && normalizedType !== "mpim" && normalizedType !== "channel" && normalizedType !== "group") return;
		const cacheKey = scopedKey(id, eventScope);
		const cached = readLruMapEntry(channelCache, cacheKey);
		const type = normalizeSlackChannelType(normalizedType, id);
		if (cached?.info.type === type) return;
		writeLruMapEntry(channelCache, cacheKey, {
			info: {
				...cached?.info,
				type
			},
			metadataLoaded: cached?.metadataLoaded ?? false
		}, SLACK_CHANNEL_CACHE_MAX_ENTRIES);
	};
	const recallSlackChannelType = (channelId, eventScope) => {
		const id = normalizeOptionalString(channelId);
		return id ? readLruMapEntry(channelCache, scopedKey(id, eventScope))?.info.type : void 0;
	};
	const resolveSlackSystemEventRoute = createSlackSystemEventRouteResolver({
		cfg: params.cfg,
		accountId: params.accountId,
		getTeamId: () => identity.teamId,
		mainKey: params.mainKey,
		threadInheritParent: params.threadInheritParent,
		recallSlackChannelType
	});
	const resolveChannelName = async (channelId, eventScope) => {
		const cacheKey = scopedKey(channelId, eventScope);
		const cached = readLruMapEntry(channelCache, cacheKey);
		if (cached?.metadataLoaded) return cached.info;
		try {
			const info = await (eventScope?.client ?? params.app.client).conversations.info({
				token: params.botToken,
				channel: channelId
			});
			const name = info.channel && "name" in info.channel ? info.channel.name : void 0;
			const channel = info.channel ?? void 0;
			const type = channel?.is_im ? "im" : channel?.is_mpim ? "mpim" : channel?.is_channel ? "channel" : channel?.is_group ? "group" : void 0;
			const topic = channel && "topic" in channel ? channel.topic?.value ?? void 0 : void 0;
			const purpose = channel && "purpose" in channel ? channel.purpose?.value ?? void 0 : void 0;
			const entry = {
				info: {
					name,
					type: cached?.info.type ?? type,
					topic,
					purpose
				},
				metadataLoaded: true
			};
			writeLruMapEntry(channelCache, cacheKey, entry, SLACK_CHANNEL_CACHE_MAX_ENTRIES);
			return entry.info;
		} catch {
			return cached?.info ?? {};
		}
	};
	const resolveUserName = async (userId, eventScope) => {
		const cacheKey = scopedKey(userId, eventScope);
		const cached = readLruMapEntry(userCache, cacheKey);
		if (cached) return cached;
		try {
			const info = await (eventScope?.client ?? params.app.client).users.info({
				token: params.botToken,
				user: userId
			});
			const profile = info.user?.profile;
			const entry = {
				name: profile?.display_name || profile?.real_name || info.user?.name || void 0,
				imageUrl: normalizeOptionalString(profile?.image_192) ?? normalizeOptionalString(profile?.image_512) ?? normalizeOptionalString(profile?.image_72)
			};
			writeLruMapEntry(userCache, cacheKey, entry, SLACK_USER_CACHE_MAX_ENTRIES);
			return entry;
		} catch (error) {
			return { error };
		}
	};
	const resolveUserAvatar = (userId, eventScope) => {
		const client = eventScope?.client ?? params.app.client;
		if (isGovSlackClient(client)) return;
		const imageUrl = readLruMapEntry(userCache, scopedKey(userId, eventScope))?.imageUrl;
		if (!imageUrl) return;
		const cacheKey = scopedKey(`${userId}\0${imageUrl}`, eventScope);
		const cached = readLruMapEntry(avatarCache, cacheKey);
		if (cached) return cached;
		if (pendingAvatars.has(cacheKey) || pendingAvatars.size >= SLACK_AVATAR_CACHE_MAX_ENTRIES) return;
		pendingAvatars.add(cacheKey);
		saveRemoteMedia({
			url: imageUrl,
			filePathHint: "conversation-avatar.png",
			maxBytes: SLACK_AVATAR_MAX_BYTES,
			ssrfPolicy: SLACK_AVATAR_SSRF_POLICY
		}).then((media) => {
			writeLruMapEntry(avatarCache, cacheKey, media.path, SLACK_AVATAR_CACHE_MAX_ENTRIES);
		}).catch((error) => {
			logger.debug({
				error: formatSlackError(error),
				userId
			}, "Slack conversation avatar download failed");
		}).finally(() => {
			pendingAvatars.delete(cacheKey);
		});
	};
	const sessionTitles = /* @__PURE__ */ new Map();
	const recordSlackSessionTitle = (p) => {
		writeLruMapEntry(sessionTitles, scopedKey(`${p.channelId}:${p.threadTs}`, p.eventScope), truncateUtf16Safe(p.title, 200), 1024);
	};
	const updateSessionStatus = async (p) => {
		const key = scopedKey(`${p.channelId}:${p.threadTs}`, p.eventScope);
		const previousTitle = readLruMapEntry(sessionTitles, key);
		const client = p.eventScope?.client ?? params.app.client;
		const updated = await setSlackSessionStatus({
			...p,
			client,
			token: params.botToken,
			runtime: params.runtime
		});
		if (!updated.ok || p.status !== "processing" || !p.threadTs || p.title === void 0) return updated.ok;
		const title = truncateUtf16Safe(p.title, 200);
		if (readLruMapEntry(sessionTitles, key) !== previousTitle) return true;
		if (updated.title === title || previousTitle !== title && await renameSlackSession({
			client,
			token: params.botToken,
			channelId: p.channelId,
			threadTs: p.threadTs,
			title
		})) {
			if (readLruMapEntry(sessionTitles, key) === previousTitle) recordSlackSessionTitle({
				...p,
				threadTs: p.threadTs,
				title
			});
		}
		return true;
	};
	const setSlackSuggestedPrompts = (input) => updateSlackSuggestedPrompts({
		...input,
		botToken: params.botToken,
		client: params.app.client
	});
	function isChannelAllowed(p) {
		const channelType = normalizeSlackChannelType(p.channelType, p.channelId);
		const isDirectMessage = channelType === "im";
		const isGroupDm = channelType === "mpim";
		const isRoom = channelType === "channel" || channelType === "group";
		if (isDirectMessage && !this.dmEnabled) return false;
		if (isGroupDm && !this.groupDmEnabled) return false;
		if (isGroupDm && this.groupDmChannels.length > 0) {
			const groupDmChannelsLower = new Set(normalizeAllowListLower(this.groupDmChannels).map((entry) => entry.replace(/^channel:/, "")));
			const candidates = [
				...buildSlackChannelIdCandidates(p.channelId, p.teamId, { allowUnscoped: this.installationIdentity?.kind !== "enterprise" }),
				p.channelName ? `#${p.channelName}` : void 0,
				p.channelName,
				p.channelName ? normalizeSlackSlug(p.channelName) : void 0
			].filter((value) => Boolean(value)).map((value) => normalizeLowercaseStringOrEmpty(value));
			if (!(groupDmChannelsLower.has("*") || candidates.some((candidate) => groupDmChannelsLower.has(candidate)))) return false;
		}
		if (isRoom && p.channelId) {
			const channelConfig = resolveSlackChannelConfig({
				teamId: p.teamId,
				allowUnscoped: this.installationIdentity?.kind !== "enterprise",
				channelId: p.channelId,
				channelName: p.channelName,
				channels: this.channelsConfig,
				channelKeys: this.channelsConfigKeys,
				defaultRequireMention: this.defaultRequireMention,
				allowNameMatching: this.allowNameMatching
			});
			const channelMatchMeta = formatAllowlistMatchMeta(channelConfig);
			const channelAllowed = channelConfig?.allowed !== false;
			const channelAllowlistConfigured = this.channelsConfigKeys.length > 0;
			const allowedByPolicy = isSlackChannelAllowedByPolicy({
				groupPolicy: this.groupPolicy,
				channelAllowlistConfigured,
				channelAllowed
			});
			const explicitlyDisabled = this.groupPolicy !== "disabled" && channelConfig?.allowed === false && channelConfig.matchSource !== void 0;
			if (!allowedByPolicy || this.groupPolicy === "open" && explicitlyDisabled) {
				if (explicitlyDisabled) {
					const reason = "channel_not_allowed";
					const warningKey = `${this.accountId}:${p.teamId ? `${p.teamId}:` : ""}${p.channelId}:${reason}`;
					if (!channelDenialWarnings.peek(warningKey)) {
						channelDenialWarnings.check(warningKey);
						logger.warn({
							provider: "slack",
							accountId: this.accountId,
							channelId: p.channelId,
							reason,
							cause: "channel_disabled",
							groupPolicy: this.groupPolicy,
							matchSource: channelConfig.matchSource,
							matchKey: channelConfig.matchKey
						}, "Slack channel denied by configuration");
					}
				}
				logVerbose(`slack: drop channel ${p.channelId} (groupPolicy=${this.groupPolicy}, ${channelMatchMeta})`);
				return false;
			}
			logVerbose(`slack: allow channel ${p.channelId} (${channelMatchMeta})`);
		}
		return true;
	}
	const shouldDropMismatchedSlackEvent = (body) => {
		if (!body || typeof body !== "object") return false;
		const raw = body;
		const incomingApiAppId = typeof raw.api_app_id === "string" ? raw.api_app_id : "";
		const incomingTeamId = typeof raw.team_id === "string" ? raw.team_id : typeof raw.team?.id === "string" ? raw.team.id : "";
		if (identity.apiAppId && incomingApiAppId && incomingApiAppId !== identity.apiAppId) {
			logVerbose(`slack: drop event with api_app_id=${incomingApiAppId} (expected ${identity.apiAppId})`);
			return true;
		}
		if (identity.teamId && incomingTeamId && incomingTeamId !== identity.teamId) {
			logVerbose(`slack: drop event with team_id=${incomingTeamId} (expected ${identity.teamId})`);
			return true;
		}
		return false;
	};
	const channelRuntime = params.channelRuntime;
	return {
		fields: {
			cfg: params.cfg,
			accountId: params.accountId,
			botToken: params.botToken,
			app: params.app,
			runtime: params.runtime,
			channelRuntime: params.channelRuntime,
			buildContext: channelRuntime?.inbound.buildContext,
			dispatchReplyFromConfig: channelRuntime?.reply?.dispatchReplyFromConfig,
			botUserId: params.botUserId,
			botId: params.botId,
			identityHealth: params.identityHealth,
			teamId: params.teamId,
			apiAppId: params.apiAppId,
			installationIdentity: params.installationIdentity ?? {
				kind: "degraded",
				reason: "auth_test_failed"
			},
			historyLimit: params.historyLimit,
			dmHistoryLimit: Math.max(0, params.dmHistoryLimit ?? 0),
			sessionScope: params.sessionScope,
			mainKey: params.mainKey,
			dmEnabled: params.dmEnabled,
			dmPolicy: params.dmPolicy,
			allowFrom,
			allowNameMatching: params.allowNameMatching,
			groupDmEnabled: params.groupDmEnabled,
			groupDmChannels,
			defaultRequireMention,
			channelsConfig: params.channelsConfig,
			channelsConfigKeys,
			groupPolicy: params.groupPolicy,
			useAccessGroups: params.useAccessGroups,
			reactionMode: params.reactionMode,
			reactionAllowlist: params.reactionAllowlist,
			replyToMode: params.replyToMode,
			threadHistoryScope: params.threadHistoryScope,
			threadInheritParent: params.threadInheritParent,
			slashCommand: params.slashCommand,
			textLimit: params.textLimit,
			typingReaction: params.typingReaction,
			mediaMaxBytes: params.mediaMaxBytes,
			logger,
			shouldDropMismatchedSlackEvent,
			resolveSlackSystemEventRoute,
			isChannelAllowed,
			resolveChannelName,
			rememberSlackChannelType,
			recallSlackChannelType,
			resolveUserName,
			resolveUserAvatar,
			setSlackSessionStatus: updateSessionStatus,
			recordSlackSessionTitle,
			getSlackAssistantThreadContext: assistantThreadContextStore.get,
			saveSlackAssistantThreadContext: assistantThreadContextStore.save,
			setSlackSuggestedPrompts,
			recordSlackAgentView: agentViewState.record,
			isSlackAgentView: agentViewState.isEnabled,
			recordSlackManagedViewThread: agentViewState.recordManagedThread,
			isSlackManagedViewThread: agentViewState.isManagedThread
		},
		bindIdentity(next) {
			identity = next;
		}
	};
}
function createSlackMonitorContext(params) {
	const built = createSlackMonitorContextFields(params);
	const ctx = {
		...built.fields,
		readRuntimeContext: async () => ctx,
		isRuntimePolicyCurrent: () => false
	};
	built.bindIdentity(ctx);
	ctx.readRuntimeContext = createSlackRuntimeContextReader(ctx, params.lookupToken ?? params.botToken);
	return ctx;
}
//#endregion
//#region extensions/slack/src/streaming.ts
/**
* Thrown when Slack definitively rejects a stream flush/finalize while text
* remains buffered locally by the Slack SDK. Carries the pending text so the
* caller can deliver it via the normal Slack reply path.
*/
var SlackStreamNotDeliveredError = class extends Error {
	constructor(pendingText, slackCode) {
		super(`slack-stream: finalize failed with ${slackCode} before buffered text reached Slack (${pendingText.length} chars pending)`);
		this.name = "SlackStreamNotDeliveredError";
		this.pendingText = pendingText;
		this.slackCode = slackCode;
	}
};
const streamsByClient = /* @__PURE__ */ new WeakMap();
const stateBySession = /* @__PURE__ */ new WeakMap();
const SLACK_STOPPED_STREAMS_MAX = 1024;
function getSlackClientStreams(client) {
	let state = streamsByClient.get(client);
	if (!state) {
		state = {
			sessions: /* @__PURE__ */ new Set(),
			stopped: /* @__PURE__ */ new Map()
		};
		streamsByClient.set(client, state);
	}
	return state;
}
function releaseSlackStream(session) {
	stateBySession.get(session)?.sessions.delete(session);
}
function applySlackStreamStop(session) {
	if (session.stoppedBySlack) return true;
	const state = stateBySession.get(session);
	const ts = session.streamer.ts;
	if (!ts || !state?.stopped.delete(`${session.channel}:${ts}`)) return false;
	session.stopped = true;
	session.stoppedBySlack = true;
	releaseSlackStream(session);
	return true;
}
/** Record streams Slack already halted; never flush their locally buffered tail. */
function markSlackStreamsStopped(client, channelId, streamingMessageTs) {
	const state = getSlackClientStreams(client);
	for (const ts of streamingMessageTs) state.stopped.set(`${channelId}:${ts}`, true);
	for (const session of state.sessions) applySlackStreamStop(session);
	pruneMapToMaxSize(state.stopped, SLACK_STOPPED_STREAMS_MAX);
}
/**
* Start a new Slack text stream.
*
* Returns a {@link SlackStreamSession} that should be passed to
* {@link appendSlackStream} and {@link stopSlackStream}.
*
* The first chunk of text can optionally be included via `text`.
*/
async function startSlackStream(params) {
	const { client, channel, threadTs, text, chunks, taskDisplayMode, teamId, userId, identity } = params;
	const identityPayload = identity?.iconUrl ? {
		...identity.username ? { username: identity.username } : {},
		icon_url: identity.iconUrl
	} : identity?.iconEmoji ? {
		...identity.username ? { username: identity.username } : {},
		icon_emoji: identity.iconEmoji
	} : identity?.username ? { username: identity.username } : {};
	logVerbose(`slack-stream: starting stream in ${channel} thread=${threadTs}${teamId ? ` team=${teamId}` : ""}${userId ? ` user=${userId}` : ""}`);
	const writeClient = getSlackListenerWriteClient({
		listenerClient: client,
		clientOptions: params.clientOptions,
		teamId: params.clientOptions?.teamId
	});
	if (!writeClient) throw new Error("Slack streaming requires an authenticated client with matching workspace scope");
	const streamer = writeClient.chatStream({
		channel,
		thread_ts: threadTs,
		...taskDisplayMode ? { task_display_mode: taskDisplayMode } : {},
		...teamId ? { recipient_team_id: teamId } : {},
		...userId ? { recipient_user_id: userId } : {},
		...identityPayload
	});
	const session = {
		streamer,
		channel,
		threadTs,
		stopped: false,
		delivered: false,
		pendingText: ""
	};
	const state = getSlackClientStreams(client);
	state.sessions.add(session);
	stateBySession.set(session, state);
	if (text || chunks?.length) {
		if (text) session.pendingText += text;
		try {
			const result = await streamer.append({
				...text ? { markdown_text: text } : {},
				...chunks ? { chunks } : {}
			});
			if (result) {
				session.delivered = true;
				session.pendingText = "";
			}
			applySlackStreamStop(session);
			logVerbose(`slack-stream: appended initial payload (${text?.length ?? 0} chars, ${chunks?.length ?? 0} chunks, ${result ? "flushed" : "buffered"})`);
		} catch (err) {
			if (applySlackStreamStop(session)) return session;
			releaseSlackStream(session);
			throwSlackStreamFailure(session, err);
		}
	}
	return session;
}
/**
* Append markdown text to an active Slack stream.
*/
async function appendSlackStream(params) {
	const { session, text, chunks } = params;
	if (applySlackStreamStop(session) || session.stopped) {
		logVerbose("slack-stream: attempted to append to a stopped stream, ignoring");
		return;
	}
	if (!text && !chunks?.length) return;
	if (text) session.pendingText += text;
	try {
		const result = await session.streamer.append({
			...text ? { markdown_text: text } : {},
			...chunks ? { chunks } : {}
		});
		if (result) {
			session.delivered = true;
			session.pendingText = "";
		}
		applySlackStreamStop(session);
		logVerbose(`slack-stream: appended ${text?.length ?? 0} chars, ${chunks?.length ?? 0} chunks (${result ? "flushed" : "buffered"})`);
	} catch (err) {
		if (applySlackStreamStop(session)) return;
		releaseSlackStream(session);
		throwSlackStreamFailure(session, err);
	}
}
/**
* Stop (finalize) a Slack stream.
*
* After calling this the stream message becomes a normal Slack message.
* Optionally include final chunks to append before stopping.
*
* If Slack's `chat.stopStream` responds with a definitive recipient/channel
* rejection while text is still buffered locally, this function throws a
* {@link SlackStreamNotDeliveredError} carrying that pending text so the caller
* can deliver it through the normal Slack reply path. Ambiguous failures
* propagate unchanged because Slack may have committed the request.
*
* If Slack responds with a known benign finalize error (see
* {@link BENIGN_SLACK_FINALIZE_ERROR_CODES}) after prior `append` calls already
* landed, the error is swallowed and the session is marked stopped - the
* already-delivered text stays visible.
*
* Errors without buffered text propagate unchanged.
*
* On success, returns the finalized message's Slack `ts` (when reported) so the
* caller can emit the `message_sent` hook with a populated `messageId`.
*/
async function stopSlackStream(params) {
	const { session, chunks, metadata } = params;
	if (applySlackStreamStop(session) || session.stopped) {
		logVerbose("slack-stream: stream already stopped, ignoring duplicate stop");
		return {};
	}
	session.stopped = true;
	logVerbose(`slack-stream: stopping stream in ${session.channel} thread=${session.threadTs}`);
	try {
		const stopResponse = await session.streamer.stop(chunks?.length || metadata ? {
			...chunks?.length ? { chunks } : {},
			...metadata ? { metadata } : {}
		} : void 0);
		if (applySlackStreamStop(session)) return {};
		session.delivered = true;
		session.pendingText = "";
		logVerbose("slack-stream: stream stopped");
		const messageId = stopResponse?.ts ?? stopResponse?.message?.ts;
		return messageId ? { messageId } : {};
	} catch (err) {
		if (applySlackStreamStop(session)) return {};
		const code = extractSlackErrorCode(err) ?? "unknown";
		if (!session.pendingText && session.delivered && BENIGN_SLACK_FINALIZE_ERROR_CODES.has(code)) {
			logVerbose(`slack-stream: finalize rejected by Slack (${code}); prior appends delivered, treating stream as stopped`);
			return {};
		}
		return throwSlackStreamFailure(session, err);
	} finally {
		releaseSlackStream(session);
	}
}
/**
* Slack API error codes that indicate `chat.stopStream` (or the
* `chat.startStream` call the SDK issues inside `stop()` when the buffer
* never flushed) cannot finalize the stream for the current recipient or
* team. Either the caller falls back to a normal message (see
* {@link SlackStreamNotDeliveredError}) or, if prior appends already
* delivered text, the error is logged verbosely and swallowed.
*/
const BENIGN_SLACK_FINALIZE_ERROR_CODES = /* @__PURE__ */ new Set([
	"user_not_found",
	"team_not_found",
	"missing_recipient_user_id",
	"missing_recipient_team_id",
	"message_not_in_streaming_state",
	"method_not_supported_for_channel_type",
	"channel_type_not_supported",
	"enterprise_is_restricted"
]);
function throwSlackStreamFailure(session, err) {
	const code = extractSlackErrorCode(err) ?? "unknown";
	if (session.pendingText && (BENIGN_SLACK_FINALIZE_ERROR_CODES.has(code) || code === "missing_scope")) throw new SlackStreamNotDeliveredError(session.pendingText, code);
	session.stopped = true;
	throw err;
}
function extractSlackErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const record = err;
	if (record.data && typeof record.data === "object") {
		const inner = record.data.error;
		if (typeof inner === "string") return inner;
	}
	return (typeof record.message === "string" ? record.message : "").match(/An API error occurred:\s*([a-z_][a-z0-9_]*)/i)?.[1];
}
function markSlackStreamFallbackDelivered(session) {
	if (applySlackStreamStop(session)) return;
	const nativeStreamWasStarted = session.delivered || Boolean(session.streamer.ts);
	session.pendingText = "";
	session.streamer.buffer = "";
	session.stopped = !nativeStreamWasStarted;
	if (session.stopped) releaseSlackStream(session);
	else stateBySession.get(session)?.sessions.add(session);
}
//#endregion
//#region extensions/slack/src/monitor/thread-resolution.ts
const DEFAULT_THREAD_TS_CACHE_TTL_MS = 6e4;
const DEFAULT_THREAD_TS_CACHE_MAX = 500;
const markAmbiguousThreadReply = (message) => ({
	...message,
	_ambiguousThreadReply: true
});
function isTransientSlackThreadLookupError(error) {
	if (error instanceof WebAPIRateLimitedError) return true;
	if (error instanceof WebAPIHTTPError) return error.statusCode === 408 || error.statusCode === 429 || error.statusCode >= 500 && error.statusCode < 600;
	if (error instanceof WebAPIPlatformError) return error.data.error === "internal_error" || error.data.error === "service_unavailable";
	if (!(error instanceof WebAPIRequestError)) return false;
	if (/^A rate limit was exceeded \(url: .+, retry-after: \d+\)$/.test(error.original.message)) return true;
	return collectErrorGraphCandidates(error.original, (current) => [
		current.cause,
		current.error,
		current.original
	]).some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) || readErrorName(candidate) === "TimeoutError");
}
async function resolveThreadTsFromHistory(params) {
	const response = await params.client.conversations.history({
		channel: params.channelId,
		latest: params.messageTs,
		oldest: params.messageTs,
		inclusive: true,
		limit: 1
	});
	const message = response.messages?.find((entry) => entry.ts === params.messageTs) ?? response.messages?.[0];
	return normalizeOptionalString(message?.thread_ts);
}
function createSlackThreadTsResolver(params) {
	const ttlMs = Math.max(0, parseFiniteNumber(params.cacheTtlMs) ?? DEFAULT_THREAD_TS_CACHE_TTL_MS);
	const maxSize = Math.max(0, parseFiniteNumber(params.maxSize) ?? DEFAULT_THREAD_TS_CACHE_MAX);
	const cache = /* @__PURE__ */ new Map();
	const inflight = /* @__PURE__ */ new Map();
	const getCached = (key, now) => {
		const entry = cache.get(key);
		if (!entry) return;
		if (entry.expiresAt === 0) {
			cache.delete(key);
			cache.set(key, entry);
			return entry.threadTs;
		}
		const normalizedNow = asDateTimestampMs(now);
		if (normalizedNow === void 0 || asDateTimestampMs(entry.expiresAt) === void 0 || entry.expiresAt <= normalizedNow) {
			cache.delete(key);
			return;
		}
		cache.delete(key);
		cache.set(key, entry);
		return entry.threadTs;
	};
	const setCached = (key, threadTs, now) => {
		const expiresAt = ttlMs > 0 ? resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now }) : 0;
		if (expiresAt === void 0) {
			cache.delete(key);
			return;
		}
		cache.delete(key);
		cache.set(key, {
			threadTs,
			expiresAt
		});
		pruneMapToMaxSize(cache, maxSize);
	};
	return { resolve: async (request) => {
		const { message } = request;
		if (!message.parent_user_id || message.thread_ts || !message.ts) return message;
		const cacheKey = `${message.channel}:${message.ts}`;
		const cached = getCached(cacheKey, Date.now());
		if (cached !== void 0) return cached ? {
			...message,
			thread_ts: cached
		} : markAmbiguousThreadReply(message);
		if (shouldLogVerbose()) logVerbose(`slack inbound: missing thread_ts for thread reply channel=${message.channel} ts=${message.ts} source=${request.source}`);
		let pending = inflight.get(cacheKey);
		if (!pending) {
			pending = resolveThreadTsFromHistory({
				client: params.client,
				channelId: message.channel,
				messageTs: message.ts
			});
			inflight.set(cacheKey, pending);
		}
		let resolved;
		try {
			resolved = await pending;
		} catch (err) {
			if (shouldLogVerbose()) logVerbose(`slack inbound: failed to resolve thread_ts via conversations.history for channel=${message.channel} ts=${message.ts}: ${formatSlackError(err)}`);
			if (isTransientSlackThreadLookupError(err)) {
				if (request.turnAdoptionLifecycle) throw err;
				return markAmbiguousThreadReply(message);
			}
		} finally {
			inflight.delete(cacheKey);
		}
		setCached(cacheKey, resolved ?? null, Date.now());
		if (resolved) {
			if (shouldLogVerbose()) logVerbose(`slack inbound: resolved missing thread_ts channel=${message.channel} ts=${message.ts} -> thread_ts=${resolved}`);
			return {
				...message,
				thread_ts: resolved
			};
		}
		if (shouldLogVerbose()) logVerbose(`slack inbound: could not resolve missing thread_ts channel=${message.channel} ts=${message.ts}; marking reply ambiguous`);
		return markAmbiguousThreadReply(message);
	} };
}
//#endregion
//#region extensions/slack/src/monitor/auth.ts
const slackChannelMembersCache = /* @__PURE__ */ new WeakMap();
const DEFAULT_CHANNEL_MEMBERS_CACHE_TTL_MS = 6e4;
const CHANNEL_MEMBERS_CACHE_MAX = 512;
const SLACK_CHANNEL_ID = "slack";
var SlackSystemEventAuthRetryError = class extends Error {};
function createSlackIngressResolver(ctx) {
	return getSlackRuntime().channel.inbound.ingress.createResolver({
		channelId: SLACK_CHANNEL_ID,
		accountId: ctx.accountId,
		identity: slackIngressIdentity,
		cfg: ctx.cfg
	});
}
function readSlackCacheTtlMs(envName, fallback) {
	const raw = process.env[envName]?.trim();
	if (!raw) return fallback;
	const parsed = /^\d+$/.test(raw) ? Number(raw) : NaN;
	return Number.isSafeInteger(parsed) ? parsed : fallback;
}
function getChannelMembersCache(ctx) {
	const existing = slackChannelMembersCache.get(ctx);
	if (existing) return existing;
	const next = /* @__PURE__ */ new Map();
	slackChannelMembersCache.set(ctx, next);
	return next;
}
function pruneChannelMembersCache(cache) {
	while (cache.size > CHANNEL_MEMBERS_CACHE_MAX) {
		const oldest = cache.keys().next();
		if (oldest.done) return;
		cache.delete(oldest.value);
	}
}
function buildBaseAllowFrom(ctx, teamId) {
	return resolveSlackUserAllowListForTeam({
		allowList: ctx.allowFrom,
		teamId
	});
}
async function resolveSlackEffectiveAllowFrom(ctx, options) {
	const teamId = options?.eventScope?.teamId ?? ctx.teamId;
	const base = buildBaseAllowFrom(ctx, teamId);
	if (options?.includePairingStore !== true) return base;
	let storeAllowFrom;
	try {
		const resolved = await readChannelIngressStoreAllowFromForDmPolicy({
			provider: "slack",
			accountId: ctx.accountId,
			dmPolicy: ctx.dmPolicy
		});
		storeAllowFrom = Array.isArray(resolved) ? resolved : [];
	} catch {
		storeAllowFrom = [];
	}
	return resolveSlackUserAllowListForTeam({
		allowList: [...base, ...storeAllowFrom],
		teamId
	});
}
async function fetchSlackChannelMemberIds(ctx, channelId, eventScope) {
	const members = await collectSlackCursorPages({
		fetchPage: (cursor) => (eventScope?.client ?? ctx.app.client).conversations.members({
			token: ctx.botToken,
			channel: channelId,
			limit: 999,
			...cursor ? { cursor } : {}
		}),
		collectPageItems: (response) => normalizeAllowListLower(response.members)
	});
	return new Set(members);
}
async function resolveSlackChannelMemberIds(ctx, channelId, eventScope) {
	const cache = getChannelMembersCache(ctx);
	const key = `${ctx.accountId}:${eventScope ? `${eventScope.teamId}:` : ""}${channelId}`;
	const ttlMs = readSlackCacheTtlMs("OPENCLAW_SLACK_CHANNEL_MEMBERS_CACHE_TTL_MS", DEFAULT_CHANNEL_MEMBERS_CACHE_TTL_MS);
	const rawNowMs = Date.now();
	const nowMs = asDateTimestampMs(rawNowMs);
	const cached = cache.get(key);
	if (cached?.members) {
		if (ttlMs > 0 && nowMs !== void 0 && cached.expiresAtMs >= nowMs) return cached.members;
		cache.delete(key);
	}
	if (cached?.pending) return await cached.pending;
	const pending = fetchSlackChannelMemberIds(ctx, channelId, eventScope);
	const pendingExpiresAtMs = ttlMs > 0 ? resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNowMs }) : void 0;
	cache.set(key, {
		expiresAtMs: pendingExpiresAtMs ?? 0,
		pending
	});
	pruneChannelMembersCache(cache);
	try {
		const members = await pending;
		const membersExpiresAtMs = ttlMs > 0 ? resolveExpiresAtMsFromDurationMs(ttlMs) : void 0;
		if (membersExpiresAtMs !== void 0) {
			cache.set(key, {
				expiresAtMs: membersExpiresAtMs,
				members
			});
			pruneChannelMembersCache(cache);
		} else cache.delete(key);
		return members;
	} finally {
		if (cache.get(key)?.pending === pending) cache.delete(key);
	}
}
function resolveExplicitSlackOwnerIds(allowFromLower) {
	const ownerIds = /* @__PURE__ */ new Set();
	for (const entry of allowFromLower) {
		const ownerId = normalizeSlackAllowOwnerEntry(entry);
		if (ownerId) ownerIds.add(ownerId);
	}
	return [...ownerIds];
}
async function authorizeSlackBotRoomMessage(params) {
	const channelUserAllowList = normalizeAllowListLower(params.channelUsers).filter((entry) => entry !== "*");
	if (channelUserAllowList.length > 0 && allowListMatches({
		allowList: channelUserAllowList,
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		id: params.senderId,
		name: params.senderName,
		allowNameMatching: params.ctx.allowNameMatching
	})) return true;
	const explicitOwnerIds = resolveExplicitSlackOwnerIds(params.allowFromLower);
	if (explicitOwnerIds.length === 0) {
		logVerbose(`slack: drop bot message ${params.senderId} in ${params.channelId} (no explicit owner id for presence check)`);
		return false;
	}
	try {
		const channelMemberIds = await resolveSlackChannelMemberIds(params.ctx, params.channelId, params.eventScope);
		if (explicitOwnerIds.some((ownerId) => channelMemberIds.has(ownerId))) return true;
		logVerbose(`slack: drop bot message ${params.senderId} in ${params.channelId} (no owner present)`);
	} catch (error) {
		logVerbose(`slack: drop bot message ${params.senderId} in ${params.channelId} (owner presence lookup failed: ${formatErrorMessage(error)})`);
	}
	return false;
}
function wildcardWhenOpen(entries) {
	return entries.length > 0 ? [...entries] : ["*"];
}
function slackIngressConversationKind(channelType) {
	return channelType === "im" ? "direct" : channelType === "mpim" ? "group" : "channel";
}
async function resolveSlackCommandIngress(params) {
	const isDirectMessage = params.channelType === "im";
	const isGroupDm = params.channelType === "mpim";
	const teamId = params.teamId ?? params.ctx.teamId;
	const ownerAllowFrom = resolveSlackUserAllowListForTeam({
		allowList: params.ownerAllowFromLower,
		teamId
	});
	const channelUsers = resolveSlackUserAllowListForTeam({
		allowList: params.channelUsers,
		teamId
	});
	const channelUsersConfigured = !isDirectMessage && !isGroupDm && normalizeAllowListLower(params.channelUsers).length > 0;
	const groupAllowFrom = isGroupDm ? ownerAllowFrom : channelUsersConfigured ? channelUsers : [];
	return await createSlackIngressResolver(params.ctx).message({
		subject: createSlackIngressSubject({
			senderId: params.senderId,
			senderName: params.senderName,
			teamId
		}),
		conversation: {
			kind: slackIngressConversationKind(params.channelType),
			id: params.channelId,
			threadId: params.threadId
		},
		contextBinding: params.contextBinding,
		event: {
			kind: params.eventKind ?? "message",
			authMode: "inbound",
			mayPair: false
		},
		dmPolicy: isDirectMessage ? "open" : "disabled",
		groupPolicy: isGroupDm || channelUsersConfigured ? "allowlist" : "open",
		policy: {
			groupAllowFromFallbackToAllowFrom: false,
			mutableIdentifierMatching: params.ctx.allowNameMatching ? "enabled" : "disabled",
			...params.activation ? { activation: params.activation } : {}
		},
		mentionFacts: params.mentionFacts,
		allowFrom: isDirectMessage ? ["*"] : ownerAllowFrom,
		groupAllowFrom,
		command: {
			allowTextCommands: params.allowTextCommands,
			hasControlCommand: params.hasControlCommand,
			modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff,
			...isDirectMessage ? { commandOwnerAllowFrom: ownerAllowFrom } : {}
		}
	});
}
async function decideSlackSystemIngress(params) {
	const isDirectMessage = params.channelType === "im";
	const isGroupDm = params.channelType === "mpim";
	const teamId = params.teamId ?? params.ctx.teamId;
	const ownerAllowFromLower = resolveSlackUserAllowListForTeam({
		allowList: params.ownerAllowFromLower,
		teamId
	});
	const channelUsers = resolveSlackUserAllowListForTeam({
		allowList: params.channelUsers,
		teamId
	});
	const channelUsersConfigured = !isDirectMessage && !isGroupDm && normalizeAllowListLower(params.channelUsers).length > 0;
	const ownerAllowFrom = params.interactiveEvent && channelUsersConfigured ? ownerAllowFromLower.filter((entry) => entry !== "*") : ownerAllowFromLower;
	const hasAnyCommandAllowlist = ownerAllowFrom.length > 0 || channelUsersConfigured;
	const groupAllowFrom = (() => {
		if (isDirectMessage) return [];
		if (isGroupDm) return ownerAllowFrom;
		if (params.interactiveEvent && hasAnyCommandAllowlist) return channelUsersConfigured ? channelUsers : [];
		if (channelUsersConfigured) return channelUsers;
		return params.channelId ? ["*"] : wildcardWhenOpen(ownerAllowFromLower);
	})();
	const subject = (senderName) => createSlackIngressSubject({
		senderId: params.senderId,
		senderName,
		teamId
	});
	const resolver = createSlackIngressResolver(params.ctx);
	const input = {
		subject: subject(params.senderName),
		conversation: {
			kind: slackIngressConversationKind(params.channelType),
			id: params.channelId ?? "slack-system"
		},
		event: {
			kind: params.interactiveEvent ? "button" : "system",
			authMode: params.interactiveEvent && hasAnyCommandAllowlist ? "command" : "inbound",
			mayPair: false
		},
		dmPolicy: isDirectMessage ? "open" : "disabled",
		groupPolicy: isGroupDm ? "allowlist" : params.interactiveEvent && hasAnyCommandAllowlist ? "open" : channelUsersConfigured || !params.channelId && ownerAllowFromLower.length > 0 ? "allowlist" : "open",
		policy: {
			groupAllowFromFallbackToAllowFrom: false,
			mutableIdentifierMatching: params.ctx.allowNameMatching ? "enabled" : "disabled"
		},
		allowFrom: isDirectMessage ? wildcardWhenOpen(ownerAllowFromLower) : ownerAllowFrom,
		groupAllowFrom,
		command: params.interactiveEvent && hasAnyCommandAllowlist ? {
			useAccessGroups: true,
			allowTextCommands: true,
			modeWhenAccessGroupsOff: "configured",
			commandOwnerAllowFrom: ownerAllowFrom
		} : void 0
	};
	const result = await resolver.message(input);
	if (result.ingress.decision !== "allow" && params.retryNameLookup && result.state.allowlists[isDirectMessage ? "dm" : "group"].normalizedEntries.some((entry) => entry.kind === "plugin:slack-user-name")) {
		const lookup = await params.ctx.resolveUserName(params.senderId, params.eventScope);
		if (lookup.error && isTransientSlackThreadLookupError(lookup.error)) throw new SlackSystemEventAuthRetryError(formatErrorMessage(lookup.error));
		if (lookup.name) return (await resolver.message({
			...input,
			subject: subject(lookup.name)
		})).ingress;
	}
	return result.ingress;
}
async function authorizeSlackSystemEventSender(params) {
	const senderId = params.senderId?.trim();
	if (!senderId) return {
		allowed: false,
		reason: "missing-sender"
	};
	const expectedSenderId = params.expectedSenderId?.trim();
	if (expectedSenderId && expectedSenderId !== senderId) return {
		allowed: false,
		reason: "sender-mismatch"
	};
	if (params.interactiveEvent && !expectedSenderId) return {
		allowed: false,
		reason: "missing-expected-sender"
	};
	const channelId = params.channelId?.trim();
	let channelType = normalizeSlackChannelType(params.channelType, channelId);
	let channelName;
	if (channelId) {
		const info = await params.ctx.resolveChannelName(channelId, params.eventScope).catch(() => ({}));
		channelName = info.name;
		const resolvedTypeSource = params.channelType ?? info.type;
		channelType = normalizeSlackChannelType(resolvedTypeSource, channelId);
		if (!params.ctx.isChannelAllowed({
			teamId: params.eventScope?.teamId ?? params.ctx.teamId,
			channelId,
			channelName,
			channelType
		})) return {
			allowed: false,
			reason: "channel-not-allowed",
			channelType,
			channelName
		};
		if (params.interactiveEvent) {
			const inferredFromId = inferSlackChannelType(channelId);
			const sourceNormalized = typeof resolvedTypeSource === "string" ? resolvedTypeSource.toLowerCase().trim() : void 0;
			if (inferredFromId === void 0 && !(sourceNormalized === "im" || sourceNormalized === "mpim" || sourceNormalized === "channel" || sourceNormalized === "group")) return {
				allowed: false,
				reason: "ambiguous-channel-type",
				channelType,
				channelName
			};
		}
	}
	const senderInfo = params.retryNameLookup ? void 0 : await params.ctx.resolveUserName(senderId, params.eventScope);
	const ingressChannelType = channelType ?? "channel";
	if (ingressChannelType === "im") {
		if (!params.ctx.dmEnabled || params.ctx.dmPolicy === "disabled") return {
			allowed: false,
			reason: "dm-disabled",
			channelType,
			channelName
		};
	}
	const allowFromLower = await resolveSlackEffectiveAllowFrom(params.ctx, {
		includePairingStore: ingressChannelType === "im",
		eventScope: params.eventScope
	});
	const channelConfig = channelId ? resolveSlackChannelConfig({
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		allowUnscoped: params.ctx.installationIdentity?.kind !== "enterprise",
		channelId,
		channelName,
		channels: params.ctx.channelsConfig,
		channelKeys: params.ctx.channelsConfigKeys,
		defaultRequireMention: params.ctx.defaultRequireMention,
		allowNameMatching: params.ctx.allowNameMatching
	}) : null;
	const channelUsersAllowlistConfigured = Array.isArray(channelConfig?.users) && channelConfig.users.length > 0;
	if ((await decideSlackSystemIngress({
		ctx: params.ctx,
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		senderId,
		senderName: senderInfo?.name,
		channelType: ingressChannelType,
		channelId,
		ownerAllowFromLower: allowFromLower,
		channelUsers: channelConfig?.users,
		interactiveEvent: params.interactiveEvent === true,
		retryNameLookup: params.retryNameLookup && params.ctx.allowNameMatching,
		eventScope: params.eventScope
	})).decision === "allow") return {
		allowed: true,
		channelType,
		channelName
	};
	if (channelType === "im" || !channelId) return {
		allowed: false,
		reason: "sender-not-allowlisted",
		...channelId ? {
			channelType,
			channelName
		} : {}
	};
	return {
		allowed: false,
		reason: params.interactiveEvent && channelUsersAllowlistConfigured && allowFromLower.length > 0 ? "sender-not-authorized" : channelUsersAllowlistConfigured ? "sender-not-channel-allowed" : "sender-not-allowlisted",
		channelType,
		channelName
	};
}
//#endregion
//#region extensions/slack/src/threading.ts
function resolveSlackThreadContext(params) {
	const incomingThreadTs = params.message.thread_ts;
	const eventTs = params.message.event_ts;
	const messageTs = params.message.ts ?? eventTs;
	const hasThreadTs = typeof incomingThreadTs === "string" && incomingThreadTs.length > 0;
	const isThreadReply = hasThreadTs && (incomingThreadTs !== messageTs || Boolean(params.message.parent_user_id));
	const replyToId = isThreadReply ? incomingThreadTs : void 0;
	const isAssistantDmThreadRoot = hasThreadTs && !isThreadReply && params.isDirectMessage === true;
	return {
		incomingThreadTs,
		messageTs,
		isThreadReply,
		replyToId,
		messageThreadId: isThreadReply || isAssistantDmThreadRoot ? incomingThreadTs : params.replyToMode === "all" ? messageTs : void 0
	};
}
/**
* Resolves Slack thread targeting for replies and status indicators.
*
* @returns replyThreadTs - Thread timestamp for reply messages
* @returns statusThreadTs - Thread timestamp for status indicators (typing, etc.)
* @returns isThreadReply - true if this is a genuine user reply in a thread,
*                          false if thread_ts comes from a bot status message (e.g. typing indicator)
*/
function resolveSlackThreadTargets(params) {
	const { incomingThreadTs, messageTs, isThreadReply } = resolveSlackThreadContext(params);
	const replyThreadTs = isThreadReply ? incomingThreadTs : params.replyToMode === "all" ? messageTs : void 0;
	return {
		replyThreadTs,
		statusThreadTs: replyThreadTs,
		isThreadReply
	};
}
//#endregion
//#region extensions/slack/src/monitor/session-run-targets.ts
function captureSlackSessionTargetGuard(ctx, route, isActive) {
	const scope = {
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		storePath: resolveStorePath(ctx.cfg.session?.store, { agentId: route.agentId })
	};
	const selected = getSessionEntry(scope);
	return () => {
		const current = getSessionEntry(scope);
		return isActive?.() !== false && current?.sessionId === selected?.sessionId && current?.lifecycleRevision === selected?.lifecycleRevision;
	};
}
const runs = /* @__PURE__ */ new WeakMap();
function addressKey(address) {
	return JSON.stringify([
		address.eventScope?.teamId ?? "",
		address.channelId,
		address.threadTs
	]);
}
/** Registers the exact publisher before status/output; the dispatch owner must release it. */
function registerSlackSessionRun(ctx, address, route) {
	if (!address.threadTs) return () => {};
	const byAddress = runs.get(ctx.app) ?? /* @__PURE__ */ new Map();
	runs.set(ctx.app, byAddress);
	const key = addressKey(address);
	const targets = byAddress.get(key) ?? /* @__PURE__ */ new Set();
	byAddress.set(key, targets);
	const target = {
		route,
		isActive: () => targets.has(target)
	};
	targets.add(target);
	return () => {
		targets.delete(target);
		if (targets.size === 0 && byAddress.get(key) === targets) byAddress.delete(key);
	};
}
function getSlackSessionRuns(ctx, address) {
	const targets = [...runs.get(ctx.app)?.get(addressKey(address)) ?? []];
	return [...new Map(targets.map((target) => [target.route.sessionKey, target])).values()].map((target) => ({
		route: target.route,
		isActive: () => targets.some((candidate) => candidate.route.sessionKey === target.route.sessionKey && candidate.isActive())
	}));
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/prepare-routing.ts
function resolveSlackBaseConversationId(params) {
	const raw = params.isDirectMessage ? `user:${params.message.user ?? "unknown"}` : params.message.channel;
	return qualifySlackConversationId(raw, params.eventScope);
}
function resolveSlackInitialAgentRoute(params) {
	const route = resolveAgentRoute({
		cfg: normalizeSlackRouteBindingConfig(params.ctx.cfg),
		channel: "slack",
		accountId: params.account.accountId,
		teamId: params.eventScope?.teamId || params.ctx.teamId || void 0,
		peer: {
			kind: params.isDirectMessage ? "direct" : params.isRoom ? "channel" : "group",
			id: qualifySlackRoutePeerId({
				id: params.isDirectMessage ? params.message.user ?? "unknown" : params.message.channel,
				kind: params.isDirectMessage ? "user" : "channel",
				eventScope: params.eventScope
			})
		}
	});
	if (!params.eventScope || !params.isDirectMessage || route.dmScope !== "main") return route;
	const sessionKey = resolveSlackEnterpriseMainDmSessionKey({
		baseSessionKey: route.sessionKey,
		accountId: params.account.accountId,
		eventScope: params.eventScope
	});
	return {
		...route,
		sessionKey,
		mainSessionKey: sessionKey
	};
}
function resolveSlackRoutingContext(params) {
	const { ctx, account, message, isDirectMessage, isGroupDm, isRoom, isRoomish, channelConfig, seedTopLevelRoomThread, assistantThreadTs, agentViewThreadTs, eventScope } = params;
	let route = resolveSlackInitialAgentRoute({
		ctx,
		account,
		message,
		isDirectMessage,
		isRoom,
		eventScope
	});
	const chatType = isDirectMessage ? "direct" : isGroupDm ? "group" : "channel";
	const replyToMode = channelConfig?.replyToMode ?? resolveSlackReplyToMode(account, chatType);
	const threadContext = resolveSlackThreadContext({
		message,
		replyToMode,
		isDirectMessage
	});
	const threadTs = threadContext.incomingThreadTs;
	const isThreadReply = threadContext.isThreadReply;
	const autoThreadId = !isThreadReply && replyToMode === "all" && threadContext.messageTs ? threadContext.messageTs : void 0;
	const seedCandidateThreadId = threadContext.incomingThreadTs ?? threadContext.messageTs;
	const routedThreadId = (isDirectMessage ? assistantThreadTs ?? agentViewThreadTs : isRoomish ? isThreadReply && threadTs ? threadTs : void 0 : isThreadReply ? threadTs : autoThreadId) ?? (isRoomish ? !isThreadReply && isRoom && seedTopLevelRoomThread && replyToMode !== "off" && seedCandidateThreadId ? seedCandidateThreadId : void 0 : void 0);
	const baseConversationId = resolveSlackBaseConversationId({
		message,
		isDirectMessage,
		eventScope
	});
	const runtimeBindingThreadId = routedThreadId ?? (isDirectMessage && isThreadReply ? threadTs : void 0);
	const bindingRoute = resolveSlackConversationBindingRoute({
		cfg: ctx.cfg,
		route,
		accountId: account.accountId,
		baseConversationId,
		runtimeBindingThreadId,
		bindingsEnabled: !eventScope
	});
	const runtimeRoute = bindingRoute.runtimeRoute;
	const configuredBinding = bindingRoute.configuredRoute?.bindingResolution ?? null;
	const configuredBindingSessionKey = bindingRoute.configuredRoute?.boundSessionKey ?? "";
	route = bindingRoute.route;
	const threadKeys = runtimeRoute.boundSessionKey || configuredBindingSessionKey ? {
		sessionKey: route.sessionKey,
		parentSessionKey: void 0
	} : resolveThreadSessionKeys({
		baseSessionKey: route.sessionKey,
		threadId: routedThreadId,
		parentSessionKey: routedThreadId && ctx.threadInheritParent ? route.sessionKey : void 0
	});
	const sessionKey = threadKeys.sessionKey;
	return {
		route,
		runtimeBinding: runtimeRoute.bindingRecord,
		runtimeBoundSessionKey: runtimeRoute.boundSessionKey,
		configuredBinding,
		configuredBindingSessionKey,
		chatType,
		replyToMode,
		threadContext,
		threadTs,
		isThreadReply,
		threadKeys,
		sessionKey
	};
}
async function resolveSlackSessionEventRoutingContext(params) {
	const { ctx, message, eventScope } = params;
	const threadTs = message.thread_ts;
	const routing = resolveSlackRoutingContext(params);
	const address = {
		agentId: routing.route.agentId,
		storePath: resolveStorePath$1(ctx.cfg.session?.store, { agentId: routing.route.agentId }),
		channel: "slack",
		accountId: params.account.accountId,
		kind: routing.chatType,
		peerId: qualifySlackRoutePeerId({
			id: params.isDirectMessage ? message.user ?? "unknown" : message.channel,
			kind: params.isDirectMessage ? "user" : "channel",
			eventScope
		})
	};
	const threadAddress = {
		...address,
		threadId: threadTs
	};
	const liveAddress = {
		channelId: message.channel,
		threadTs,
		eventScope
	};
	let allowDirectParent = false;
	const readOwner = () => {
		const recorded = getConversationSession(threadAddress);
		if (recorded) return {
			route: {
				...routing.route,
				sessionKey: recorded.sessionKey
			},
			source: "recorded"
		};
		const live = getSlackSessionRuns(ctx, liveAddress).at(-1);
		if (live) return {
			route: live.route,
			source: "live",
			isActive: live.isActive
		};
		const parent = allowDirectParent ? getConversationSession(address) : void 0;
		return parent ? {
			route: {
				...routing.route,
				sessionKey: parent.sessionKey
			},
			source: "parent"
		} : void 0;
	};
	let owner = readOwner();
	if (owner?.source === "live" && params.isDirectMessage) allowDirectParent = getConversationSession(address)?.sessionKey === owner.route.sessionKey;
	if (!owner && params.isDirectMessage && threadTs) {
		const assistantContext = ctx.getSlackAssistantThreadContext(message.channel, threadTs, eventScope);
		const managedThread = !eventScope && (await ctx.isSlackManagedViewThread(message.channel, threadTs) || await ctx.isSlackAgentView());
		allowDirectParent = !(assistantContext ?? (managedThread ? void 0 : await readSlackAssistantThreadContext({
			client: eventScope?.client ?? ctx.app.client,
			channelId: message.channel,
			threadTs,
			userId: message.user
		}))) && !managedThread;
		owner = readOwner();
	}
	if (!owner) throw new Error("No recorded session owns this Slack conversation");
	const { route } = owner;
	const isCurrentIncarnation = params.intent === "stop" ? captureSlackSessionTargetGuard(ctx, route, owner.isActive) : void 0;
	return {
		...routing,
		route,
		sessionKey: route.sessionKey,
		isCurrentSession: () => readOwner()?.route.sessionKey === route.sessionKey && isCurrentIncarnation?.() !== false
	};
}
//#endregion
//#region extensions/slack/src/monitor/deferred-action-routing.ts
function resolveSlackDeferredActionTarget(params) {
	if (!params.id) throw new Error("Slack deferred action is missing a target ID");
	if (!params.eventScope) return {
		peerId: params.id,
		target: `${params.kind}:${params.id}`
	};
	const target = `team:${encodeURIComponent(params.eventScope.teamId)}:${params.kind}:${encodeURIComponent(params.id)}`;
	return {
		peerId: target,
		target
	};
}
//#endregion
//#region extensions/slack/src/monitor/dm-auth.ts
async function authorizeSlackDirectMessage(params) {
	if (!params.ctx.dmEnabled || params.ctx.dmPolicy === "disabled") {
		await params.onDisabled();
		return false;
	}
	if (params.ctx.dmPolicy === "open" && params.allowFromLower.includes("*")) return true;
	const senderName = (await params.resolveSenderName(params.senderId))?.name ?? void 0;
	const allowMatch = resolveSlackAllowListMatch({
		allowList: params.allowFromLower,
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		id: params.senderId,
		name: senderName,
		allowNameMatching: params.ctx.allowNameMatching
	});
	const allowMatchMeta = formatAllowlistMatchMeta(allowMatch);
	if (allowMatch.allowed) return true;
	if (params.ctx.dmPolicy === "pairing") {
		const pairingSenderId = formatSlackTarget({
			teamId: params.eventScope?.teamId,
			kind: "user",
			id: params.senderId
		});
		await createChannelPairingChallengeIssuer({
			channel: "slack",
			accountId: params.accountId,
			upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
				channel: "slack",
				id,
				accountId: params.accountId,
				meta
			})
		})({
			senderId: pairingSenderId,
			senderIdLine: `Your Slack user id: ${params.senderId}`,
			meta: {
				name: senderName,
				teamId: params.eventScope?.teamId,
				senderId: params.senderId
			},
			sendPairingReply: params.sendPairingReply,
			onCreated: () => {
				params.log(`slack pairing request sender=${params.senderId} name=${senderName ?? "unknown"} (${allowMatchMeta})`);
			},
			onReplyError: (err) => {
				params.log(`slack pairing reply failed for ${params.senderId}: ${formatErrorMessage(err)}`);
			}
		});
		return false;
	}
	await params.onUnauthorized({
		allowMatchMeta,
		senderName
	});
	return false;
}
//#endregion
//#region extensions/slack/src/monitor/event-scope.ts
function resolveSlackListenerEventScope$1(params) {
	const resolved = resolveSlackEventScope(params);
	if (!resolved.ok) {
		params.onDrop?.(resolved.reason);
		return null;
	}
	return resolved.scope;
}
function resolveSlackEventScope(params) {
	const context = params.context ?? {};
	if (params.identity.kind !== "enterprise") return context.isEnterpriseInstall === true ? {
		ok: false,
		reason: "enterprise_event_for_workspace_account"
	} : { ok: true };
	const body = params.body && typeof params.body === "object" ? params.body : {};
	const apiAppId = normalizeOptionalString(body.api_app_id);
	if (apiAppId && params.identity.apiAppId && apiAppId !== params.identity.apiAppId) return {
		ok: false,
		reason: "wrong_app"
	};
	if (context.isEnterpriseInstall !== true) return {
		ok: false,
		reason: "not_enterprise_install"
	};
	const enterpriseId = normalizeOptionalString(context.enterpriseId);
	if (!enterpriseId) return {
		ok: false,
		reason: "missing_enterprise_id"
	};
	if (enterpriseId !== params.identity.enterpriseId) return {
		ok: false,
		reason: "wrong_enterprise"
	};
	const teamId = normalizeOptionalString(context.teamId);
	if (!teamId) return {
		ok: false,
		reason: "missing_team_id"
	};
	if (!params.client) return {
		ok: false,
		reason: "missing_listener_client"
	};
	const writeClient = getSlackListenerWriteClient({
		listenerClient: params.client,
		teamId,
		clientOptions: params.clientOptions
	});
	return {
		ok: true,
		scope: {
			teamId,
			client: params.client,
			...writeClient ? { writeClient } : {}
		}
	};
}
//#endregion
//#region extensions/slack/src/monitor/external-arg-menu-store.ts
const SLACK_EXTERNAL_ARG_MENU_TOKEN_BYTES = 18;
const SLACK_EXTERNAL_ARG_MENU_TOKEN_PATTERN = new RegExp(`^[A-Za-z0-9_-]{${Math.ceil(24)}}$`);
const SLACK_EXTERNAL_ARG_MENU_TTL_MS = 6e5;
const SLACK_EXTERNAL_ARG_MENU_PREFIX = "openclaw_cmdarg_ext:";
function pruneSlackExternalArgMenuStore(store, rawNow) {
	const now = asDateTimestampMs(rawNow);
	if (now === void 0) {
		store.clear();
		return;
	}
	for (const [token, entry] of store.entries()) if (asDateTimestampMs(entry.expiresAt) === void 0 || entry.expiresAt <= now) store.delete(token);
}
function createSlackExternalArgMenuToken(store) {
	let token;
	do
		token = generateSecureToken(SLACK_EXTERNAL_ARG_MENU_TOKEN_BYTES);
	while (store.has(token));
	return token;
}
function createSlackExternalArgMenuStore() {
	const store = /* @__PURE__ */ new Map();
	return {
		create(params, now = Date.now()) {
			pruneSlackExternalArgMenuStore(store, now);
			const token = createSlackExternalArgMenuToken(store);
			const expiresAt = resolveExpiresAtMsFromDurationMs(SLACK_EXTERNAL_ARG_MENU_TTL_MS, { nowMs: now });
			if (expiresAt !== void 0) store.set(token, {
				choices: params.choices,
				userId: params.userId,
				expiresAt
			});
			return token;
		},
		readToken(raw) {
			if (typeof raw !== "string" || !raw.startsWith("openclaw_cmdarg_ext:")) return;
			const token = raw.slice(20).trim();
			return SLACK_EXTERNAL_ARG_MENU_TOKEN_PATTERN.test(token) ? token : void 0;
		},
		get(token, now = Date.now()) {
			pruneSlackExternalArgMenuStore(store, now);
			return store.get(token);
		}
	};
}
//#endregion
//#region extensions/slack/src/monitor/response-url-budget.ts
const SLACK_RESPONSE_URL_MAX_CALLS = 5;
var SlackResponseAlreadyReportedError = class extends Error {};
function isSlackResponseAlreadyReportedError(error) {
	return error instanceof SlackResponseAlreadyReportedError;
}
/** Count every response_url attempt, including requests Slack rejects. */
function createSlackResponseUrlBudget(respond, maxCalls = SLACK_RESPONSE_URL_MAX_CALLS) {
	let remaining = maxCalls;
	return {
		remaining: () => remaining,
		respond: async (payload) => {
			if (remaining <= 0) throw new Error(`Slack response_url cannot be used more than ${String(maxCalls)} times.`);
			remaining -= 1;
			return await respond(payload);
		}
	};
}
//#endregion
//#region extensions/slack/src/monitor/room-context.ts
function resolveSlackRoomContextHints(params) {
	const channelMetadata = params.isRoomish ? buildChannelMetadata({
		source: "slack",
		label: "Slack channel description",
		entries: [params.channelInfo?.topic, params.channelInfo?.purpose]
	}) : void 0;
	const systemPromptParts = [params.isRoomish ? normalizeOptionalString(params.channelConfig?.systemPrompt) ?? null : null].filter((entry) => Boolean(entry));
	return {
		channelMetadata,
		groupSystemPrompt: systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : void 0
	};
}
//#endregion
//#region extensions/slack/src/monitor/slash.ts
const SLACK_COMMAND_ARG_ACTION_ID = "openclaw_cmdarg";
const SLACK_COMMAND_ARG_ACTION_LISTENER = /^openclaw_cmdarg/;
const SLACK_COMMAND_ARG_VALUE_PREFIX = "cmdarg";
const SLACK_COMMAND_ARG_BUTTON_ROW_SIZE = 5;
const SLACK_COMMAND_ARG_OVERFLOW_MIN = 3;
const SLACK_COMMAND_ARG_OVERFLOW_MAX = 5;
const SLACK_COMMAND_ARG_SELECT_OPTIONS_MAX = 100;
const SLACK_COMMAND_ARG_SELECT_OPTION_TEXT_MAX = 75;
const SLACK_COMMAND_ARG_SELECT_OPTION_VALUE_MAX = 150;
const SLACK_COMMAND_ARG_BUTTON_TEXT_MAX = 75;
const SLACK_COMMAND_ARG_BUTTON_VALUE_MAX = 2e3;
const SLACK_COMMAND_ARG_CONFIRM_TEXT_MAX = 300;
const SLACK_HEADER_TEXT_MAX = 150;
const SLACK_COMMAND_ARG_ACTION_BLOCKS_MAX = 47;
const loadSlashCommandsRuntime = createLazyRuntimeModule(() => import("./slash-commands.runtime-BpSH0b3q.mjs"));
const loadSlashDispatchRuntime = createLazyRuntimeModule(() => import("./slash-dispatch.runtime-HFy_XvyO.mjs"));
const loadSlashSkillCommandsRuntime = createLazyRuntimeModule(() => import("./slash-skill-commands.runtime-Bi1JWZHY.mjs"));
const loadPluginCommandRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/plugin-command-runtime"));
function resolveSlackCommandMenuModelContext(params) {
	if (!params.sessionKey.trim()) return {};
	try {
		const defaultModel = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.agentId
		});
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const entry = getSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		});
		let provider;
		let model;
		if (entry?.modelOverrideSource === "auto" && normalizeOptionalString(entry.modelOverride)) {
			provider = defaultModel.provider;
			model = defaultModel.model;
		} else {
			const override = resolveStoredModelOverride({
				sessionEntry: entry,
				loadSessionEntry: (sessionKey) => getSessionEntry({
					storePath,
					sessionKey
				}),
				sessionKey: params.sessionKey,
				defaultProvider: defaultModel.provider
			});
			provider = override?.model ? override.provider || defaultModel.provider : normalizeOptionalString(entry?.providerOverride) ?? normalizeOptionalString(entry?.modelProvider);
			model = override?.model ? override.model : normalizeOptionalString(entry?.modelOverride) ?? normalizeOptionalString(entry?.model);
		}
		return {
			...provider ? { provider } : {},
			...model ? { model } : {},
			agentRuntime: resolveEffectiveAgentRuntime({
				cfg: params.cfg,
				provider: provider ?? defaultModel.provider,
				modelId: model ?? defaultModel.model,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionEntry: entry
			})
		};
	} catch {
		return {};
	}
}
const slackExternalArgMenuStore = createSlackExternalArgMenuStore();
function buildSlackArgMenuConfirm(params) {
	const command = escapeSlackMrkdwn(params.command);
	const arg = escapeSlackMrkdwn(params.arg);
	return {
		title: {
			type: "plain_text",
			text: "Confirm selection"
		},
		text: {
			type: "mrkdwn",
			text: truncateSlackText(`Run */${command}* with *${arg}* set to this value?`, SLACK_COMMAND_ARG_CONFIRM_TEXT_MAX)
		},
		confirm: {
			type: "plain_text",
			text: "Run command"
		},
		deny: {
			type: "plain_text",
			text: "Cancel"
		}
	};
}
function storeSlackExternalArgMenu(params) {
	return slackExternalArgMenuStore.create({
		choices: params.choices,
		userId: params.userId
	});
}
function readSlackExternalArgMenuToken(raw) {
	return slackExternalArgMenuStore.readToken(raw);
}
function encodeSlackCommandArgValue(parts) {
	return [
		SLACK_COMMAND_ARG_VALUE_PREFIX,
		encodeURIComponent(parts.command),
		encodeURIComponent(parts.arg),
		encodeURIComponent(parts.value),
		encodeURIComponent(parts.userId)
	].join("|");
}
function parseSlackCommandArgValue(raw) {
	if (!raw) return null;
	const parts = raw.split("|");
	if (parts.length !== 5 || parts[0] !== SLACK_COMMAND_ARG_VALUE_PREFIX) return null;
	const [, command, arg, value, userId] = parts;
	if (!command || !arg || !value || !userId) return null;
	const decode = (text) => {
		try {
			return decodeURIComponent(text);
		} catch {
			return null;
		}
	};
	const decodedCommand = decode(command);
	const decodedArg = decode(arg);
	const decodedValue = decode(value);
	const decodedUserId = decode(userId);
	if (!decodedCommand || !decodedArg || !decodedValue || !decodedUserId) return null;
	return {
		command: decodedCommand,
		arg: decodedArg,
		value: decodedValue,
		userId: decodedUserId
	};
}
function buildSlackArgMenuOptions(choices) {
	return choices.map((choice) => ({
		text: {
			type: "plain_text",
			text: truncateSlackText(choice.label, SLACK_COMMAND_ARG_SELECT_OPTION_TEXT_MAX)
		},
		value: choice.value
	}));
}
function buildSlackCommandArgMenuBlocks(params) {
	const encodedChoices = params.choices.map((choice) => ({
		label: choice.label,
		value: encodeSlackCommandArgValue({
			command: params.command,
			arg: params.arg,
			value: choice.value,
			userId: params.userId
		})
	}));
	const canUseStaticSelect = encodedChoices.every((choice) => choice.value.length <= SLACK_COMMAND_ARG_SELECT_OPTION_VALUE_MAX);
	const canUseOverflow = canUseStaticSelect && encodedChoices.length >= SLACK_COMMAND_ARG_OVERFLOW_MIN && encodedChoices.length <= SLACK_COMMAND_ARG_OVERFLOW_MAX;
	const canUseExternalSelect = params.supportsExternalSelect && canUseStaticSelect && encodedChoices.length > SLACK_COMMAND_ARG_SELECT_OPTIONS_MAX;
	const rows = canUseOverflow ? [{
		type: "actions",
		elements: [{
			type: "overflow",
			action_id: SLACK_COMMAND_ARG_ACTION_ID,
			confirm: buildSlackArgMenuConfirm({
				command: params.command,
				arg: params.arg
			}),
			options: buildSlackArgMenuOptions(encodedChoices)
		}]
	}] : canUseExternalSelect ? [{
		type: "actions",
		block_id: `${SLACK_EXTERNAL_ARG_MENU_PREFIX}${params.createExternalMenuToken(encodedChoices)}`,
		elements: [{
			type: "external_select",
			action_id: SLACK_COMMAND_ARG_ACTION_ID,
			confirm: buildSlackArgMenuConfirm({
				command: params.command,
				arg: params.arg
			}),
			min_query_length: 0,
			placeholder: {
				type: "plain_text",
				text: `Search ${params.arg}`
			}
		}]
	}] : encodedChoices.length <= SLACK_COMMAND_ARG_BUTTON_ROW_SIZE || !canUseStaticSelect ? chunkItems(encodedChoices.filter((choice) => choice.value.length <= SLACK_COMMAND_ARG_BUTTON_VALUE_MAX), SLACK_COMMAND_ARG_BUTTON_ROW_SIZE).map((choices, rowIndex) => ({
		type: "actions",
		elements: choices.map((choice, colIndex) => ({
			type: "button",
			action_id: `${SLACK_COMMAND_ARG_ACTION_ID}_${rowIndex}_${colIndex}`,
			text: {
				type: "plain_text",
				text: truncateSlackText(choice.label, SLACK_COMMAND_ARG_BUTTON_TEXT_MAX)
			},
			value: choice.value,
			confirm: buildSlackArgMenuConfirm({
				command: params.command,
				arg: params.arg
			})
		}))
	})) : chunkItems(encodedChoices, SLACK_COMMAND_ARG_SELECT_OPTIONS_MAX).map((choices, index) => ({
		type: "actions",
		elements: [{
			type: "static_select",
			action_id: SLACK_COMMAND_ARG_ACTION_ID,
			confirm: buildSlackArgMenuConfirm({
				command: params.command,
				arg: params.arg
			}),
			placeholder: {
				type: "plain_text",
				text: index === 0 ? `Choose ${params.arg}` : `Choose ${params.arg} (${index + 1})`
			},
			options: buildSlackArgMenuOptions(choices)
		}]
	}));
	const headerText = truncateSlackText(`/${params.command}: choose ${params.arg}`, SLACK_HEADER_TEXT_MAX);
	const sectionText = truncateSlackText(params.title, 3e3);
	const contextText = truncateSlackText(`Select one option to continue /${params.command} (${params.arg})`, 3e3);
	const visibleRows = rows.slice(0, SLACK_COMMAND_ARG_ACTION_BLOCKS_MAX);
	return [
		{
			type: "header",
			text: {
				type: "plain_text",
				text: headerText
			}
		},
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: sectionText
			}
		},
		{
			type: "context",
			elements: [{
				type: "mrkdwn",
				text: contextText
			}]
		},
		...visibleRows
	];
}
const NON_PLUGIN_COMMAND_DISPATCH = Object.freeze({ kind: "non-plugin" });
function createSlackCommandHandler(params) {
	const { ctx: monitor, account: startupAccount, trackEvent } = params;
	const runtime = monitor.runtime;
	const supportsInteractiveArgMenus = typeof monitor.app.action === "function";
	const slashCommand = resolveSlackSlashCommandConfig(monitor.slashCommand ?? startupAccount.config.slashCommand);
	return async (p) => {
		const { command, ack, respond: respondWithoutBudget, body, eventScope, prompt, commandArgs, commandDefinition, pluginCommandReplyOptions } = p;
		const responseBudget = p.responseTransport === "web-api" ? {
			respond: respondWithoutBudget,
			remaining: () => void 0
		} : createSlackResponseUrlBudget(respondWithoutBudget);
		const respond = responseBudget.respond;
		let cfg = monitor.cfg;
		try {
			if (monitor.shouldDropMismatchedSlackEvent?.(body)) {
				await ack();
				runtime.log?.(`slack: drop slash command from user=${command.user_id ?? "unknown"} channel=${command.channel_id ?? "unknown"} (mismatched app/team)`);
				return false;
			}
			trackEvent?.();
			if (!prompt.trim()) {
				await ack({
					text: "Message required.",
					response_type: "ephemeral"
				});
				return false;
			}
			await ack();
			const ctx = await monitor.readRuntimeContext();
			cfg = ctx.cfg;
			const account = resolveSlackAccount({
				cfg,
				accountId: params.account.accountId
			});
			if (ctx.botUserId && command.user_id === ctx.botUserId) return false;
			const channelInfo = await ctx.resolveChannelName(command.channel_id, eventScope);
			const channelType = normalizeSlackChannelType(channelInfo?.type ?? (command.channel_name === "directmessage" ? "im" : void 0), command.channel_id);
			const chatType = resolveSlackChatType(channelType);
			const isDirectMessage = channelType === "im";
			const isGroupDm = channelType === "mpim";
			const isRoom = channelType === "channel" || channelType === "group";
			const isRoomish = isRoom || isGroupDm;
			if (!ctx.isChannelAllowed({
				teamId: eventScope?.teamId ?? ctx.teamId,
				channelId: command.channel_id,
				channelName: channelInfo?.name,
				channelType
			})) {
				await respond({
					text: "This channel is not allowed.",
					response_type: "ephemeral"
				});
				return false;
			}
			const effectiveAllowFromLower = await resolveSlackEffectiveAllowFrom(ctx, {
				includePairingStore: isDirectMessage,
				eventScope
			});
			let commandAuthorized = false;
			let channelConfig = null;
			if (isDirectMessage) {
				if (!await authorizeSlackDirectMessage({
					ctx,
					accountId: ctx.accountId,
					senderId: command.user_id,
					eventScope,
					allowFromLower: effectiveAllowFromLower,
					resolveSenderName: (userId) => ctx.resolveUserName(userId, eventScope),
					sendPairingReply: async (text) => {
						await respond({
							text,
							response_type: "ephemeral"
						});
					},
					onDisabled: async () => {
						await respond({
							text: "Slack DMs are disabled.",
							response_type: "ephemeral"
						});
					},
					onUnauthorized: async ({ allowMatchMeta }) => {
						logVerbose(`slack: blocked slash sender ${command.user_id} (dmPolicy=${ctx.dmPolicy}, ${allowMatchMeta})`);
						await respond({
							text: "You are not authorized to use this command.",
							response_type: "ephemeral"
						});
					},
					log: logVerbose
				})) return false;
			}
			if (isRoom) {
				channelConfig = resolveSlackChannelConfig({
					teamId: eventScope?.teamId ?? ctx.teamId,
					allowUnscoped: ctx.installationIdentity?.kind !== "enterprise",
					channelId: command.channel_id,
					channelName: channelInfo?.name,
					channels: ctx.channelsConfig,
					channelKeys: ctx.channelsConfigKeys,
					defaultRequireMention: ctx.defaultRequireMention,
					allowNameMatching: ctx.allowNameMatching
				});
				if (ctx.useAccessGroups) {
					const channelAllowlistConfigured = (ctx.channelsConfigKeys?.length ?? 0) > 0;
					const channelAllowed = channelConfig?.allowed !== false;
					if (!isSlackChannelAllowedByPolicy({
						groupPolicy: ctx.groupPolicy,
						channelAllowlistConfigured,
						channelAllowed
					})) {
						await respond({
							text: "This channel is not allowed.",
							response_type: "ephemeral"
						});
						return false;
					}
					const hasExplicitConfig = Boolean(channelConfig?.matchSource);
					if (!channelAllowed && (ctx.groupPolicy !== "open" || hasExplicitConfig)) {
						await respond({
							text: "This channel is not allowed.",
							response_type: "ephemeral"
						});
						return false;
					}
				}
			}
			const senderName = (await ctx.resolveUserName(command.user_id, eventScope))?.name ?? command.user_name ?? command.user_id;
			const slashIngress = await resolveSlackCommandIngress({
				ctx,
				teamId: eventScope?.teamId ?? ctx.teamId,
				senderId: command.user_id,
				senderName,
				channelType: channelType ?? "channel",
				channelId: command.channel_id,
				threadId: p.threadTs,
				ownerAllowFromLower: effectiveAllowFromLower,
				channelUsers: isRoom ? channelConfig?.users : void 0,
				allowTextCommands: false,
				hasControlCommand: false,
				eventKind: "slash-command",
				modeWhenAccessGroupsOff: "configured"
			});
			const senderGate = slashIngress.senderAccess.gate;
			if (isRoomish && senderGate?.allowed === false) {
				await respond({
					text: "You are not authorized to use this command here.",
					response_type: "ephemeral"
				});
				return false;
			}
			commandAuthorized = slashIngress.commandAccess.authorized;
			if (isRoomish) {
				if (ctx.useAccessGroups && !commandAuthorized) {
					await respond({
						text: "You are not authorized to use this command.",
						response_type: "ephemeral"
					});
					return false;
				}
			}
			const routeTarget = resolveSlackDeferredActionTarget({
				eventScope,
				kind: isDirectMessage ? "user" : "channel",
				id: isDirectMessage ? command.user_id : command.channel_id
			});
			const routingTeamId = (eventScope?.teamId ?? ctx.teamId) || void 0;
			let resolvedSlashRoute;
			let isCurrentSession = p.isSessionTargetCurrent;
			const resolveSlashRoute = async () => {
				if (resolvedSlashRoute) return resolvedSlashRoute;
				if (p.threadTs) {
					if (p.sessionTarget) {
						resolvedSlashRoute = p.sessionTarget;
						isCurrentSession = captureSlackSessionTargetGuard(ctx, p.sessionTarget, p.isSessionTargetCurrent);
						return resolvedSlashRoute;
					}
					const routing = await resolveSlackSessionEventRoutingContext({
						intent: "stop",
						ctx,
						account,
						message: {
							type: "message",
							channel: command.channel_id,
							user: command.user_id,
							ts: p.eventTs,
							thread_ts: p.threadTs
						},
						isDirectMessage,
						isGroupDm,
						isRoom,
						isRoomish,
						channelConfig,
						eventScope
					});
					resolvedSlashRoute = routing.route;
					isCurrentSession = routing.isCurrentSession;
					return resolvedSlashRoute;
				}
				const { resolveAgentRoute } = await loadSlashDispatchRuntime();
				resolvedSlashRoute = resolveAgentRoute({
					cfg,
					channel: "slack",
					accountId: account.accountId,
					teamId: routingTeamId,
					peer: {
						kind: isDirectMessage ? "direct" : isRoom ? "channel" : "group",
						id: routeTarget.peerId
					}
				});
				return resolvedSlashRoute;
			};
			if (commandDefinition && supportsInteractiveArgMenus) {
				const { resolveCommandArgMenu } = await loadSlashCommandsRuntime();
				const menuNeedsModelContext = !(commandArgs?.raw && !commandArgs.values) && commandDefinition.args?.some((arg) => typeof arg.choices === "function" && commandArgs?.values?.[arg.name] == null);
				const menuRoute = menuNeedsModelContext || commandDefinition.key === "verbose" ? await resolveSlashRoute() : void 0;
				const menuModelContext = menuNeedsModelContext && menuRoute ? resolveSlackCommandMenuModelContext({
					cfg,
					agentId: menuRoute.agentId,
					sessionKey: menuRoute.sessionKey
				}) : {};
				const menuModelCatalog = commandDefinition.key === "think" && menuNeedsModelContext ? await loadPreparedModelCatalog({
					config: cfg,
					...menuRoute ? {
						agentId: menuRoute.agentId,
						agentDir: resolveAgentDir(cfg, menuRoute.agentId)
					} : {},
					readOnly: true
				}) : void 0;
				const menu = resolveCommandArgMenu({
					command: commandDefinition,
					args: commandArgs,
					cfg,
					session: menuRoute,
					...menuModelContext,
					catalog: menuModelCatalog
				});
				if (menu) {
					const commandLabel = commandDefinition.nativeName ?? commandDefinition.key;
					const title = formatCommandArgMenuTitle({
						command: commandDefinition,
						menu
					});
					await respond({
						text: title,
						blocks: buildSlackCommandArgMenuBlocks({
							title,
							command: commandLabel,
							arg: menu.arg.name,
							choices: menu.choices,
							userId: command.user_id,
							supportsExternalSelect: params.supportsExternalArgMenus?.() ?? false,
							createExternalMenuToken: (choices) => storeSlackExternalArgMenu({
								choices,
								userId: command.user_id
							})
						}),
						response_type: "ephemeral"
					});
					return false;
				}
			}
			const channelName = channelInfo?.name;
			const roomLabel = channelName ? `#${channelName}` : `#${command.channel_id}`;
			const { deliverSlackSlashReplies, dispatchChannelInboundTurn, finalizeInboundContext, isChannelPartialDeliveryError, resolveChunkMode, resolveConversationLabel, resolveMarkdownTableMode, sanitizeSlackMonitorReplyPayload } = await loadSlashDispatchRuntime();
			const route = await resolveSlashRoute();
			const { channelMetadata, groupSystemPrompt } = resolveSlackRoomContextHints({
				isRoomish,
				channelInfo,
				channelConfig
			});
			const slashUserTarget = resolveSlackDeferredActionTarget({
				eventScope,
				kind: "user",
				id: command.user_id
			});
			const { sessionKey, commandTargetSessionKey } = resolveNativeCommandSessionTargets({
				agentId: route.agentId,
				sessionPrefix: slashCommand.sessionPrefix,
				userId: slashUserTarget.peerId,
				targetSessionKey: route.sessionKey,
				sessionKeyCase: "lowercase"
			});
			const slashReplyTarget = resolveSlackDeferredActionTarget({
				eventScope,
				kind: !slashCommand.ephemeral && isRoomish ? "channel" : "user",
				id: !slashCommand.ephemeral && isRoomish ? command.channel_id : command.user_id
			}).target;
			const ctxPayload = finalizeInboundContext({
				Body: prompt,
				BodyForAgent: prompt,
				RawBody: prompt,
				CommandBody: prompt,
				CommandArgs: commandArgs,
				From: isDirectMessage ? `slack:${routeTarget.peerId}` : isRoom ? `slack:channel:${routeTarget.peerId}` : `slack:group:${routeTarget.peerId}`,
				To: `slash:${slashUserTarget.peerId}`,
				ChatType: chatType,
				ConversationLabel: resolveConversationLabel({
					ChatType: chatType,
					SenderName: senderName,
					GroupSubject: isRoomish ? roomLabel : void 0,
					From: isDirectMessage ? `slack:${routeTarget.peerId}` : isRoom ? `slack:channel:${routeTarget.peerId}` : `slack:group:${routeTarget.peerId}`
				}) ?? (isDirectMessage ? senderName : roomLabel),
				GroupSubject: isRoomish ? roomLabel : void 0,
				GroupSpace: ctx.teamId || void 0,
				GroupSystemPrompt: groupSystemPrompt,
				ChannelPromptContext: channelMetadata ? [channelMetadata] : void 0,
				SenderName: senderName,
				SenderId: command.user_id,
				Provider: "slack",
				Surface: "slack",
				WasMentioned: true,
				MessageSid: p.eventTs ?? command.trigger_id,
				MessageThreadId: p.threadTs,
				Timestamp: Date.now(),
				SessionKey: sessionKey,
				CommandTargetSessionKey: commandTargetSessionKey,
				AccountId: route.accountId,
				CommandSource: "native",
				CommandAuthorized: commandAuthorized,
				OriginatingChannel: "slack",
				OriginatingTo: p.threadTs ? resolveSlackDeferredActionTarget({
					eventScope,
					kind: "channel",
					id: command.channel_id
				}).target : slashReplyTarget
			});
			const messageSentHookTarget = ctxPayload.OriginatingTo ?? ctxPayload.To ?? slashReplyTarget;
			const deliverSlashPayloads = async (replies, onReplySettled) => {
				await deliverSlackSlashReplies({
					replies,
					respond,
					ephemeral: p.threadTs ? false : slashCommand.ephemeral,
					textLimit: ctx.textLimit,
					messageSentHookTarget,
					accountId: route.accountId,
					sessionKeyForInternalHooks: ctxPayload.SessionKey ?? route.sessionKey,
					isGroup: isRoomish,
					groupId: isRoomish ? command.channel_id : void 0,
					chunkMode: resolveChunkMode(cfg, "slack", route.accountId),
					tableMode: resolveMarkdownTableMode({
						cfg,
						channel: "slack",
						accountId: route.accountId
					}),
					responseBudget,
					onReplySettled
				});
			};
			const pendingSlashReplies = [];
			const shouldDeliverBlockImmediately = commandDefinition?.key === "login";
			const builtInDispatch = p.builtInCommand ? { [(await loadPluginCommandRuntime()).PLUGIN_COMMAND_DISPATCH]: NON_PLUGIN_COMMAND_DISPATCH } : void 0;
			if (commandAuthorized) {
				if (isCurrentSession?.() === false || p.onAdmitted?.() === false) {
					await respond({
						text: "The selected run has already finished.",
						response_type: "ephemeral"
					});
					return false;
				}
			}
			await dispatchChannelInboundTurn({
				cfg,
				channel: "slack",
				accountId: route.accountId,
				route: {
					agentId: route.agentId,
					sessionKey: ctxPayload.SessionKey ?? route.sessionKey
				},
				ctxPayload,
				dispatchReplyFromConfig: ctx.dispatchReplyFromConfig,
				replyPipeline: { transformReplyPayload: sanitizeSlackMonitorReplyPayload },
				dispatcherOptions: { onSettled: async () => {
					if (pendingSlashReplies.length === 0) return;
					const pending = pendingSlashReplies.splice(0);
					const settled = /* @__PURE__ */ new Set();
					try {
						await deliverSlashPayloads(pending.map((entry) => entry.payload), ({ replyIndex, visibleReplySent, error }) => {
							const entry = pending[replyIndex];
							if (!entry || settled.has(replyIndex)) return;
							settled.add(replyIndex);
							if (error !== void 0) {
								entry.finalization.reject(error);
								return;
							}
							entry.finalization.resolve({ visibleReplySent });
						});
					} catch (error) {
						const unsettledError = isChannelPartialDeliveryError(error) ? error.cause ?? error : error;
						for (const [replyIndex, entry] of pending.entries()) if (!settled.has(replyIndex)) entry.finalization.reject(unsettledError);
						throw error;
					}
				} },
				delivery: {
					deliver: async (payload, info) => {
						if (info.kind === "block" && shouldDeliverBlockImmediately) {
							let visibleReplySent = false;
							await deliverSlashPayloads([payload], (settlement) => {
								visibleReplySent = settlement.visibleReplySent;
							});
							return visibleReplySent ? { visibleReplySent: true } : {
								visibleReplySent: false,
								suppression: { reason: "no_visible_result" }
							};
						}
						const finalization = createDeferred();
						pendingSlashReplies.push({
							payload,
							finalization
						});
						return {
							visibleReplySent: false,
							finalization: finalization.promise
						};
					},
					onError: (err, info) => {
						runtime.error?.(danger(`slack slash ${info.kind} reply failed: ${formatSlackError(err)}`));
					}
				},
				replyOptions: {
					isCommandTargetCurrent: isCurrentSession,
					skillFilter: channelConfig?.skills,
					...pluginCommandReplyOptions,
					...builtInDispatch
				}
			});
			return true;
		} catch (err) {
			runtime.error?.(danger(`slack slash handler failed: ${formatErrorMessage(err)}`));
			if (!isSlackResponseAlreadyReportedError(err) && responseBudget.remaining() !== 0) await respond({
				text: "Sorry, something went wrong handling that command.",
				response_type: "ephemeral"
			});
		}
		return false;
	};
}
async function registerSlackMonitorSlashCommands(params) {
	const { ctx, account, trackEvent } = params;
	const startupCfg = ctx.cfg;
	const runtime = ctx.runtime;
	const resolveEventScope = (args) => resolveSlackListenerEventScope$1({
		identity: ctx.installationIdentity,
		body: args.body,
		context: args.context,
		client: args.client,
		clientOptions: ctx.app.webClientOptions,
		onDrop: (reason) => runtime.log?.(`slack: drop slash payload (${reason})`)
	});
	const supportsInteractiveArgMenus = typeof ctx.app.action === "function";
	let supportsExternalArgMenus = typeof ctx.app.options === "function";
	const slashCommand = resolveSlackSlashCommandConfig(ctx.slashCommand ?? account.config.slashCommand);
	let registration = slashCommand.enabled ? {
		mode: "single",
		name: slashCommand.name
	} : { mode: "disabled" };
	const handleSlashCommand = createSlackCommandHandler({
		ctx,
		account,
		trackEvent,
		supportsExternalArgMenus: () => supportsExternalArgMenus
	});
	let nativeCommands = [];
	let slashCommandsRuntime = null;
	let pluginCommandRuntimeModule = null;
	let pluginCommandRuntime = null;
	if (registration.mode === "disabled" && resolveNativeCommandsEnabled({
		providerId: "slack",
		providerSetting: account.config.commands?.native,
		globalSetting: startupCfg.commands?.native
	})) {
		slashCommandsRuntime = await loadSlashCommandsRuntime();
		const skillCommands = resolveNativeSkillsEnabled({
			providerId: "slack",
			providerSetting: account.config.commands?.nativeSkills,
			globalSetting: startupCfg.commands?.nativeSkills
		}) ? (await loadSlashSkillCommandsRuntime()).listSkillCommandsForAgents({ cfg: startupCfg }) : [];
		nativeCommands = slashCommandsRuntime.listNativeCommandSpecsForConfig(startupCfg, {
			skillCommands,
			provider: "slack"
		});
		pluginCommandRuntimeModule = await loadPluginCommandRuntime();
		pluginCommandRuntime = pluginCommandRuntimeModule.createPluginCommandRuntime();
		nativeCommands = mergeNativeCommandSpecs({
			primary: nativeCommands,
			secondary: pluginCommandRuntime.listNativeCandidates("slack")
		});
		registration = nativeCommands.length > 0 ? { mode: "native" } : { mode: "disabled" };
	}
	if (registration.mode === "single") ctx.app.command(buildSlackSlashCommandMatcher(registration.name), async (args) => {
		const { command, ack, respond, body } = args;
		const eventScope = resolveEventScope(args);
		if (eventScope === null) {
			await ack({
				text: "This Slack workspace is unavailable.",
				response_type: "ephemeral"
			});
			return;
		}
		await handleSlashCommand({
			command,
			ack,
			respond: createSlackSlashResponderWithFallback({
				respond,
				client: args.client,
				command,
				runtime
			}),
			body,
			eventScope,
			prompt: command.text?.trim() ?? ""
		});
	});
	else if (registration.mode === "native") {
		if (!slashCommandsRuntime || !pluginCommandRuntimeModule || !pluginCommandRuntime) throw new Error("Missing command runtimes for native Slack commands.");
		for (const command of nativeCommands) {
			const pluginCommandCandidate = "prepareDispatch" in command ? command : void 0;
			ctx.app.command(`/${command.name}`, async (args) => {
				const { command: cmd, ack, respond, body } = args;
				const eventScope = resolveEventScope(args);
				if (eventScope === null) {
					await ack({
						text: "This Slack workspace is unavailable.",
						response_type: "ephemeral"
					});
					return;
				}
				const commandDefinition = pluginCommandCandidate ? void 0 : slashCommandsRuntime.findCommandByNativeName(command.name, "slack");
				const rawText = cmd.text?.trim() ?? "";
				const pluginCommandDispatch = pluginCommandCandidate?.prepareDispatch(rawText) ?? NON_PLUGIN_COMMAND_DISPATCH;
				const commandArgs = commandDefinition ? slashCommandsRuntime.parseCommandArgs(commandDefinition, rawText) : rawText ? { raw: rawText } : void 0;
				const prompt = commandDefinition ? slashCommandsRuntime.buildCommandTextFromArgs(commandDefinition, commandArgs) : rawText ? `/${command.name} ${rawText}` : `/${command.name}`;
				await handleSlashCommand({
					command: cmd,
					ack,
					respond: createSlackSlashResponderWithFallback({
						respond,
						client: args.client,
						command: cmd,
						runtime
					}),
					body,
					eventScope,
					prompt,
					commandArgs,
					commandDefinition: commandDefinition ?? void 0,
					pluginCommandReplyOptions: { [pluginCommandRuntimeModule.PLUGIN_COMMAND_DISPATCH]: pluginCommandDispatch }
				});
			});
		}
	} else logVerbose("slack: slash commands disabled");
	if (registration.mode !== "native" || !supportsInteractiveArgMenus) return registration;
	const registerArgOptions = () => {
		const appWithOptions = ctx.app;
		if (typeof appWithOptions.options !== "function") return;
		appWithOptions.options(SLACK_COMMAND_ARG_ACTION_ID, async (args) => {
			const { ack, body } = args;
			if (resolveEventScope(args) === null) {
				await ack({ options: [] });
				return;
			}
			if (ctx.shouldDropMismatchedSlackEvent?.(body)) {
				await ack({ options: [] });
				runtime.log?.("slack: drop slash arg options payload (mismatched app/team)");
				return;
			}
			trackEvent?.();
			const typedBody = body;
			const token = readSlackExternalArgMenuToken(typedBody.actions?.[0]?.block_id ?? typedBody.block_id);
			if (!token) {
				await ack({ options: [] });
				return;
			}
			const entry = slackExternalArgMenuStore.get(token);
			if (!entry) {
				await ack({ options: [] });
				return;
			}
			const requesterUserId = typedBody.user?.id?.trim();
			if (!requesterUserId || requesterUserId !== entry.userId) {
				await ack({ options: [] });
				return;
			}
			const query = normalizeLowercaseStringOrEmpty(typedBody.value);
			await ack({ options: entry.choices.filter((choice) => !query || normalizeLowercaseStringOrEmpty(choice.label).includes(query)).slice(0, SLACK_COMMAND_ARG_SELECT_OPTIONS_MAX).map((choice) => ({
				text: {
					type: "plain_text",
					text: truncateSlackText(choice.label, SLACK_COMMAND_ARG_SELECT_OPTION_TEXT_MAX)
				},
				value: choice.value
			})) });
		});
	};
	try {
		registerArgOptions();
	} catch (err) {
		supportsExternalArgMenus = false;
		runtime.log?.(warn("slack: external arg-menu registration failed; falling back to static slash command menus. Enable verbose logs for details."));
		logVerbose(`slack: external arg-menu registration failed, falling back to static menus: ${formatErrorMessage(err)}`);
	}
	const registerArgAction = (actionId) => {
		ctx.app.action(actionId, async (args) => {
			const { ack, body } = args;
			const respond = args.respond;
			const action = args.action;
			await ack();
			const eventScope = resolveEventScope(args);
			if (eventScope === null) return;
			if (ctx.shouldDropMismatchedSlackEvent?.(body)) {
				runtime.log?.("slack: drop slash arg action payload (mismatched app/team)");
				return;
			}
			const respondFn = respond ?? (async (message) => {
				if (!body.channel?.id || !body.user?.id) return new Response(null, { status: 204 });
				const payload = typeof message === "string" ? { text: message } : message;
				const threadTs = body.container?.thread_ts ?? body.message?.thread_ts;
				await args.client.chat.postEphemeral({
					token: ctx.botToken,
					channel: body.channel.id,
					user: body.user.id,
					text: payload.text ?? "",
					...threadTs ? { thread_ts: threadTs } : {},
					...payload.blocks ? { blocks: payload.blocks } : {},
					...typeof payload.mrkdwn === "boolean" ? { mrkdwn: payload.mrkdwn } : {}
				});
				return new Response(null, { status: 200 });
			});
			const parsed = parseSlackCommandArgValue(action?.value ?? action?.selected_option?.value);
			if (!parsed) {
				await respondFn({
					text: "Sorry, that button is no longer valid.",
					response_type: "ephemeral"
				});
				return;
			}
			if (body.user?.id && parsed.userId !== body.user.id) {
				await respondFn({
					text: "That menu is for another user.",
					response_type: "ephemeral"
				});
				return;
			}
			const { buildCommandTextFromArgs, findCommandByNativeName } = await loadSlashCommandsRuntime();
			const commandDefinition = findCommandByNativeName(parsed.command, "slack");
			const commandArgs = { values: { [parsed.arg]: parsed.value } };
			const prompt = commandDefinition ? buildCommandTextFromArgs(commandDefinition, commandArgs) : `/${parsed.command} ${parsed.value}`;
			const user = body.user;
			const userName = user && "name" in user && user.name ? user.name : user && "username" in user && user.username ? user.username : user?.id ?? "";
			const triggerId = "trigger_id" in body ? body.trigger_id : void 0;
			const commandPayload = {
				user_id: user?.id ?? "",
				user_name: userName,
				channel_id: body.channel?.id ?? "",
				channel_name: body.channel?.name ?? body.channel?.id ?? "",
				trigger_id: triggerId,
				team_id: args.context.teamId ?? ""
			};
			await handleSlashCommand({
				command: commandPayload,
				ack: async () => {},
				respond: respondFn,
				responseTransport: respond ? "response-url" : "web-api",
				body,
				eventScope,
				prompt,
				commandArgs,
				commandDefinition: commandDefinition ?? void 0,
				pluginCommandReplyOptions: pluginCommandRuntimeModule ? { [pluginCommandRuntimeModule.PLUGIN_COMMAND_DISPATCH]: NON_PLUGIN_COMMAND_DISPATCH } : void 0
			});
		});
	};
	registerArgAction(SLACK_COMMAND_ARG_ACTION_LISTENER);
	return registration;
}
function createSlackSlashResponderWithFallback(params) {
	return async (message) => {
		try {
			return await params.respond(message);
		} catch (error) {
			if (!isSlackBoltRespondError(error)) throw error;
			params.runtime.log?.(warn(`slack slash response_url failed; falling back to Web API: ${formatErrorMessage(error)}`));
			return await deliverSlackSlashResponseWithWebApi({
				client: params.client,
				command: params.command,
				message
			});
		}
	};
}
async function deliverSlackSlashResponseWithWebApi(params) {
	const payload = typeof params.message === "string" ? { text: params.message } : params.message;
	const text = payload.text ?? "";
	const blocks = "blocks" in payload && Array.isArray(payload.blocks) ? payload.blocks : void 0;
	const mrkdwn = "mrkdwn" in payload && typeof payload.mrkdwn === "boolean" ? payload.mrkdwn : void 0;
	if (payload.response_type === "in_channel") {
		const postSlackMessage = params.client.chat.postMessage;
		const response = await postSlackMessage({
			channel: params.command.channel_id,
			...params.threadTs ? { thread_ts: params.threadTs } : {},
			text,
			...blocks ? { blocks } : {},
			...mrkdwn !== void 0 ? { mrkdwn } : {}
		});
		requireSlackPostMessageTimestamp(response);
	} else await params.client.chat.postEphemeral({
		channel: params.command.channel_id,
		...params.threadTs ? { thread_ts: params.threadTs } : {},
		user: params.command.user_id,
		text,
		...blocks ? { blocks } : {},
		...mrkdwn !== void 0 ? { mrkdwn } : {}
	});
	return new Response(null, { status: 200 });
}
function isSlackBoltRespondError(error) {
	return Boolean(error) && typeof error === "object" && error.code === "slack_bolt_respond_error";
}
//#endregion
//#region extensions/slack/src/monitor/events/system-event-context.ts
async function authorizeAndResolveSlackSystemEventContext(params) {
	const { senderId, channelId, channelType, eventKind } = params;
	const ctx = await params.ctx.readRuntimeContext();
	const auth = await authorizeSlackSystemEventSender({
		ctx,
		senderId,
		channelId,
		channelType,
		eventScope: params.eventScope,
		retryNameLookup: eventKind.startsWith("member-")
	});
	if (!auth.allowed) {
		logVerbose(`slack: drop ${eventKind} sender ${senderId ?? "unknown"} channel=${channelId ?? "unknown"} reason=${auth.reason ?? "unauthorized"}`);
		return;
	}
	return {
		channelLabel: resolveSlackChannelLabel({
			channelId,
			channelName: auth.channelName
		}),
		route: ctx.resolveSlackSystemEventRoute({
			channelId,
			channelType: auth.channelType,
			senderId,
			threadTs: auth.channelType === "im" ? void 0 : params.threadTs,
			eventScope: params.eventScope
		})
	};
}
function resolveSlackListenerEventScope(params) {
	const resolved = resolveSlackEventScope({
		identity: params.ctx.installationIdentity,
		body: params.body,
		context: params.context,
		client: params.client,
		clientOptions: params.ctx.app.webClientOptions
	});
	if (!resolved.ok) {
		logVerbose(`slack: drop listener event (${resolved.reason})`);
		return null;
	}
	return resolved.scope;
}
//#endregion
//#region extensions/slack/src/monitor/events/agent.ts
function registerSlackAgentEvents(params) {
	const { ctx, trackEvent } = params;
	const slackApp = ctx.app;
	const handleCommand = createSlackCommandHandler({
		ctx,
		account: resolveSlackAccount({
			cfg: ctx.cfg,
			accountId: ctx.accountId
		}),
		trackEvent
	});
	slackApp.event("app_context_changed", async ({ body }) => {
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		await ctx.recordSlackAgentView();
	});
	slackApp.event("agent_session_stopped", async ({ event, body, context, client }) => {
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		const eventScope = resolveSlackListenerEventScope({
			ctx,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		const slackClient = eventScope?.client ?? ctx.app.client;
		const command = {
			user_id: event.user,
			user_name: event.user,
			channel_id: event.channel,
			channel_name: event.channel
		};
		const address = {
			channelId: event.channel,
			threadTs: event.thread_ts,
			eventScope
		};
		const targets = getSlackSessionRuns(ctx, address);
		const responses = [];
		const results = [];
		for (const target of targets.length > 0 ? targets : [void 0]) results.push(await handleCommand({
			command,
			ack: async () => {},
			respond: async (message) => {
				responses.push(message);
			},
			responseTransport: "web-api",
			body,
			eventScope,
			prompt: "/stop",
			builtInCommand: "stop",
			sessionTarget: target?.route,
			isSessionTargetCurrent: target?.isActive,
			onAdmitted: () => {
				if (target && !target.isActive()) return false;
				markSlackStreamsStopped(slackClient, event.channel, event.streaming_message_ts);
				return true;
			},
			threadTs: event.thread_ts,
			eventTs: event.event_ts
		}));
		for (const message of responses) await deliverSlackSlashResponseWithWebApi({
			client: slackClient,
			command,
			threadTs: event.thread_ts,
			message
		});
		if (!results.every(Boolean) || getSlackSessionRuns(ctx, address).length > 0) return;
		await ctx.setSlackSessionStatus({
			channelId: event.channel,
			threadTs: event.thread_ts,
			status: "active",
			eventScope
		});
	});
	slackApp.event("agent_session_title_changed", async ({ event, body, context, client }) => {
		const runtimeContext = await params.ctx.readRuntimeContext();
		const runtimeAccount = resolveSlackAccount({
			cfg: runtimeContext.cfg,
			accountId: runtimeContext.accountId
		});
		if (runtimeContext.shouldDropMismatchedSlackEvent(body)) return;
		const eventScope = resolveSlackListenerEventScope({
			ctx: runtimeContext,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		trackEvent?.();
		try {
			const auth = await authorizeSlackSystemEventSender({
				ctx: runtimeContext,
				senderId: event.user,
				channelId: event.channel,
				eventScope
			});
			if (!auth.allowed) return;
			const isDirectMessage = auth.channelType === "im";
			const isGroupDm = auth.channelType === "mpim";
			const isRoom = auth.channelType === "channel" || auth.channelType === "group";
			const routing = await resolveSlackSessionEventRoutingContext({
				intent: "title",
				ctx: runtimeContext,
				account: runtimeAccount,
				message: {
					type: "message",
					channel: event.channel,
					user: event.user,
					ts: event.event_ts,
					thread_ts: event.thread_ts
				},
				isDirectMessage,
				isGroupDm,
				isRoom,
				isRoomish: isRoom || isGroupDm,
				eventScope
			});
			if (!await getSlackRuntime().agent.session.patchSessionEntry({
				agentId: routing.route.agentId,
				storePath: resolveStorePath$1(runtimeContext.cfg.session?.store, { agentId: routing.route.agentId }),
				sessionKey: routing.sessionKey,
				preserveActivity: true,
				assertCommitAllowed: () => {
					if (!routing.isCurrentSession()) throw new Error("Slack conversation owner changed before the title update");
				},
				update: () => ({ displayName: event.title })
			})) throw new Error("Slack conversation session disappeared before the title update");
			runtimeContext.recordSlackSessionTitle({
				channelId: event.channel,
				threadTs: event.thread_ts,
				title: event.title,
				eventScope
			});
		} catch (error) {
			runtimeContext.runtime.error?.(`slack session title update failed: ${formatErrorMessage(error)}`);
		}
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/assistant.ts
function normalizeAssistantThread(event, getPrevious) {
	const thread = event.assistant_thread;
	if (!thread) return null;
	const channelId = thread.channel_id?.trim();
	const threadTs = thread.thread_ts?.trim();
	if (!channelId || !threadTs) return null;
	const previous = getPrevious?.(channelId, threadTs);
	const threadContext = thread.context;
	const eventContext = event.context;
	const resolveContextString = (key, previousValue) => threadContext?.[key]?.trim() || eventContext?.[key]?.trim() || previousValue;
	const enterpriseId = (() => {
		if (threadContext && "enterprise_id" in threadContext) return threadContext.enterprise_id === null ? null : threadContext.enterprise_id?.trim() || previous?.enterpriseId;
		if (eventContext && "enterprise_id" in eventContext) return eventContext.enterprise_id === null ? null : eventContext.enterprise_id?.trim() || previous?.enterpriseId;
		return previous?.enterpriseId;
	})();
	return {
		assistantChannelId: channelId,
		threadTs,
		userId: thread.user_id?.trim() || previous?.userId,
		channelId: resolveContextString("channel_id", previous?.channelId),
		teamId: resolveContextString("team_id", previous?.teamId),
		enterpriseId
	};
}
async function persistAssistantThreadMetadata(params) {
	const { ctx, assistantThread } = params;
	const initialMessage = ((await ctx.app.client.conversations.replies({
		token: ctx.botToken,
		channel: assistantThread.assistantChannelId,
		ts: assistantThread.threadTs,
		include_all_metadata: true,
		limit: 4
	})).messages ?? []).find((message) => !message.subtype && message.user === ctx.botUserId && message.ts);
	if (!initialMessage?.ts) return;
	await ctx.app.client.chat.update({
		token: ctx.botToken,
		channel: assistantThread.assistantChannelId,
		ts: initialMessage.ts,
		text: initialMessage.text ?? "",
		blocks: Array.isArray(initialMessage.blocks) ? initialMessage.blocks : [],
		metadata: buildSlackAssistantThreadMetadata(assistantThread)
	});
}
function registerSlackAssistantEvents(params) {
	const { ctx, trackEvent } = params;
	const slackApp = ctx.app;
	slackApp.event("assistant_thread_started", async ({ event, body }) => {
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		const assistantThread = normalizeAssistantThread(event, ctx.getSlackAssistantThreadContext);
		if (!assistantThread) {
			logVerbose("slack assistant_thread_started dropped: missing assistant thread channel/thread");
			return;
		}
		ctx.saveSlackAssistantThreadContext(assistantThread);
		await ctx.setSlackSuggestedPrompts({
			channelId: assistantThread.assistantChannelId,
			threadTs: assistantThread.threadTs,
			title: "Try asking",
			prompts: DEFAULT_SLACK_SUGGESTED_PROMPTS
		});
	});
	slackApp.event("assistant_thread_context_changed", async ({ event, body }) => {
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		const assistantThread = normalizeAssistantThread(event, ctx.getSlackAssistantThreadContext);
		if (!assistantThread) {
			logVerbose("slack assistant_thread_context_changed dropped: missing assistant thread channel/thread");
			return;
		}
		ctx.saveSlackAssistantThreadContext(assistantThread);
		await persistAssistantThreadMetadata({
			ctx,
			assistantThread
		});
	});
}
//#endregion
//#region extensions/slack/src/channel-migration.ts
function resolveAccountChannels(cfg, accountId) {
	if (!accountId) return {};
	const normalized = normalizeAccountId$1(accountId);
	const accounts = cfg.channels?.slack?.accounts;
	if (!accounts || typeof accounts !== "object") return {};
	const exact = accounts[normalized];
	if (exact?.channels) return { channels: exact.channels };
	const matchKey = Object.keys(accounts).find((key) => normalizeLowercaseStringOrEmpty(key) === normalizeLowercaseStringOrEmpty(normalized));
	return { channels: matchKey ? accounts[matchKey]?.channels : void 0 };
}
function migrateSlackChannelsInPlace(channels, oldChannelId, newChannelId) {
	if (!channels) return {
		migrated: false,
		skippedExisting: false
	};
	if (oldChannelId === newChannelId) return {
		migrated: false,
		skippedExisting: false
	};
	if (!Object.hasOwn(channels, oldChannelId)) return {
		migrated: false,
		skippedExisting: false
	};
	if (Object.hasOwn(channels, newChannelId)) return {
		migrated: false,
		skippedExisting: true
	};
	const channelConfig = channels[oldChannelId];
	if (!channelConfig) return {
		migrated: false,
		skippedExisting: false
	};
	channels[newChannelId] = channelConfig;
	delete channels[oldChannelId];
	return {
		migrated: true,
		skippedExisting: false
	};
}
function migrateSlackChannelConfig(params) {
	const scopes = [];
	let migrated = false;
	let skippedExisting = false;
	const accountChannels = resolveAccountChannels(params.cfg, params.accountId).channels;
	if (accountChannels) {
		const result = migrateSlackChannelsInPlace(accountChannels, params.oldChannelId, params.newChannelId);
		if (result.migrated) {
			migrated = true;
			scopes.push("account");
		}
		if (result.skippedExisting) skippedExisting = true;
	}
	const globalChannels = params.cfg.channels?.slack?.channels;
	if (globalChannels) {
		const result = migrateSlackChannelsInPlace(globalChannels, params.oldChannelId, params.newChannelId);
		if (result.migrated) {
			migrated = true;
			scopes.push("global");
		}
		if (result.skippedExisting) skippedExisting = true;
	}
	return {
		migrated,
		skippedExisting,
		scopes
	};
}
//#endregion
//#region extensions/slack/src/types.ts
function parseSlackMessageEvent(value) {
	const record = asOptionalRecord(value);
	return record?.type === "message" && typeof record.channel === "string" ? {
		...record,
		type: "message",
		channel: record.channel
	} : void 0;
}
function requireSlackMessageEvent(value) {
	const event = parseSlackMessageEvent(value);
	if (!event) throw new TypeError("Invalid persisted Slack message event");
	return event;
}
//#endregion
//#region extensions/slack/src/monitor/ingress.ts
const SLACK_INGRESS_PAYLOAD_VERSION = 1;
const SLACK_INGRESS_POLL_INTERVAL_MS = 1e3;
const SLACK_BOLT_AUTHORIZATION_ERROR = "slack_bolt_authorization_error";
const SLACK_INGRESS_LIFECYCLE_CONTEXT_KEY = "openclawIngressLifecycle";
/** Logical message identity: mirrors the retired guard key (team:channel:ts). */
function resolveSlackRelayIngressEventId(event) {
	const ts = event.message.ts?.trim();
	if (!event.message.channel?.trim() || !ts) return `relay:${event.deliveryId}`;
	const team = event.message.team?.trim();
	return `message:${team ? `${team}:` : ""}${event.message.channel.trim()}:${ts}`;
}
const SlackIngressPayloadError = createChannelIngressError("SlackIngressPayloadError");
function resolveSlackEventId(body) {
	const eventId = asOptionalRecord(body)?.event_id;
	return typeof eventId === "string" && eventId.trim() ? eventId.trim() : null;
}
function resolveSlackIngressLane(body, eventId) {
	const envelope = asOptionalRecord(body);
	const event = asOptionalRecord(envelope?.event);
	const item = asOptionalRecord(event?.item);
	const assistantThread = asOptionalRecord(event?.assistant_thread);
	const team = asOptionalRecord(envelope?.team);
	const teamId = [
		envelope?.team_id,
		team?.id,
		event?.team
	].find((value) => typeof value === "string" && value.trim())?.toString().trim() || "workspace";
	const channelId = [
		event?.channel,
		event?.channel_id,
		event?.new_channel_id,
		item?.channel,
		assistantThread?.channel_id
	].find((value) => typeof value === "string" && value.trim())?.toString().trim();
	if (channelId) return `team:${teamId}:conversation:${channelId}`;
	const userId = [event?.user, event?.user_id].find((value) => typeof value === "string" && value.trim())?.toString().trim();
	return userId ? `team:${teamId}:user:${userId}` : `event:${eventId}`;
}
function isSlackEventCallback(body) {
	return asOptionalRecord(body)?.type === "event_callback";
}
function decodeSlackIngressPayload(payload, eventId) {
	if (payload.kind === "relay") {
		if (!parseSlackMessageEvent(payload.message)) throw new SlackIngressPayloadError(`Slack relay ingress payload ${eventId} was invalid.`);
		return {
			version: payload.version,
			body: payload
		};
	}
	if (!asOptionalRecord(payload.body) || resolveSlackEventId(payload.body) !== eventId) throw new SlackIngressPayloadError(`Slack ingress payload ${eventId} was invalid.`);
	return {
		version: payload.version,
		body: payload
	};
}
function inspectSlackIngress(raw) {
	if (raw.kind === "relay") {
		const eventId = resolveSlackRelayIngressEventId({
			deliveryId: raw.deliveryId,
			message: raw.message
		});
		return {
			eventId,
			laneKey: resolveSlackIngressLane({ event: raw.message }, eventId)
		};
	}
	const eventId = resolveSlackEventId(raw.body);
	if (!eventId) throw new SlackIngressPayloadError("Slack Events API envelope missing event_id.");
	return {
		eventId,
		laneKey: resolveSlackIngressLane(raw.body, eventId)
	};
}
function resolveSlackIngressNonRetryableFailure(error) {
	const candidates = collectErrorGraphCandidates(error, (current) => [
		current.cause,
		current.error,
		current.original
	]);
	const transientAuthorizationFailure = candidates.some(isTransientSlackThreadLookupError);
	for (const candidate of candidates) {
		if (candidate instanceof SlackIngressPayloadError || candidate instanceof SyntaxError) return {
			reason: "invalid-event",
			message: formatErrorMessage(candidate)
		};
		if (extractErrorCode(candidate) === SLACK_BOLT_AUTHORIZATION_ERROR && !transientAuthorizationFailure || isNonRecoverableSlackAuthError(candidate)) return {
			reason: "slack-auth",
			message: formatErrorMessage(candidate)
		};
	}
	return null;
}
function resolveSlackIngressTurnLifecycle(context) {
	const candidate = asOptionalRecord(context)?.[SLACK_INGRESS_LIFECYCLE_CONTEXT_KEY];
	if (!candidate || typeof candidate !== "object") return null;
	const lifecycle = candidate;
	return typeof lifecycle.onAdopted === "function" && lifecycle.abortSignal instanceof AbortSignal ? lifecycle : null;
}
function createSlackDurableIngress(options) {
	let app;
	let relayDispatch;
	const activeSessionTurns = /* @__PURE__ */ new Map();
	const activeChannelTurns = /* @__PURE__ */ new Map();
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getSlackRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: inspectSlackIngress,
		payload: {
			version: SLACK_INGRESS_PAYLOAD_VERSION,
			serialize: (raw, { receivedAt }) => raw.kind === "relay" ? {
				kind: "relay",
				receivedAt,
				message: raw.message
			} : {
				kind: "events-api",
				receivedAt,
				body: raw.body,
				...raw.retryNum === void 0 ? {} : { retryNum: raw.retryNum },
				...raw.retryReason === void 0 ? {} : { retryReason: raw.retryReason }
			},
			deserialize: (body, { claim }) => body.kind === "relay" ? {
				kind: "relay",
				deliveryId: claim.id.startsWith("relay:") ? claim.id.slice(6) : claim.id,
				message: body.message
			} : {
				kind: "events-api",
				body: body.body,
				...body.retryNum === void 0 ? {} : { retryNum: body.retryNum },
				...body.retryReason === void 0 ? {} : { retryReason: body.retryReason }
			},
			encode: ({ body }) => ({
				version: SLACK_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload, { claim }) => decodeSlackIngressPayload(payload, claim.id),
			createClaimError: (_kind, claim) => new SlackIngressPayloadError(`Slack ingress payload ${claim.id} was invalid.`)
		},
		onDurableAdmission: async (raw) => {
			if (raw.kind === "events-api") await raw.afterDurableAdmission?.();
		},
		deliver: async (raw, lifecycle, claim) => {
			const laneKey = claim.laneKey ?? inspectSlackIngress(raw).laneKey;
			let releaseSession;
			let releaseChannel;
			let routedSession;
			let adoptOnCompletion = false;
			const settleSession = () => {
				adoptOnCompletion = false;
				releaseSession?.();
			};
			const settleTurn = () => {
				settleSession();
				releaseChannel?.();
				lifecycle.abortSignal.removeEventListener("abort", settleTurn);
			};
			const retainChannelTurn = () => {
				if (releaseChannel) return;
				const channelTurn = createDeferred();
				const channelTurns = activeChannelTurns.get(laneKey) ?? /* @__PURE__ */ new Set();
				channelTurns.add(channelTurn.promise);
				activeChannelTurns.set(laneKey, channelTurns);
				releaseChannel = () => channelTurn.resolve();
				channelTurn.promise.then(() => {
					channelTurns.delete(channelTurn.promise);
					if (channelTurns.size === 0 && activeChannelTurns.get(laneKey) === channelTurns) activeChannelTurns.delete(laneKey);
				});
				lifecycle.abortSignal.addEventListener("abort", settleTurn, { once: true });
			};
			const routedLifecycle = {
				...lifecycle,
				onDispatchWaiting: () => {
					lifecycle.abortSignal.throwIfAborted();
					retainChannelTurn();
					adoptOnCompletion = true;
					lifecycle.onDeferred();
					lifecycle.onAdoptionFinalizing();
					monitor.requestDrain();
				},
				onSessionRouted: async (sessionKey) => {
					if (routedSession !== void 0) {
						if (routedSession !== sessionKey) throw new Error("Slack ingress session ownership changed after routing.");
						return;
					}
					lifecycle.abortSignal.throwIfAborted();
					routedSession = sessionKey;
					adoptOnCompletion = true;
					const previousTurn = activeSessionTurns.get(sessionKey);
					const releasedCurrentTurn = createDeferred();
					const currentTurn = previousTurn ? previousTurn.then(() => releasedCurrentTurn.promise) : releasedCurrentTurn.promise;
					activeSessionTurns.set(sessionKey, currentTurn);
					retainChannelTurn();
					currentTurn.then(() => {
						if (activeSessionTurns.get(sessionKey) === currentTurn) activeSessionTurns.delete(sessionKey);
					});
					releaseSession = () => releasedCurrentTurn.resolve();
					lifecycle.onDeferred();
					if (previousTurn) lifecycle.onAdoptionFinalizing();
					monitor.requestDrain();
					await previousTurn;
					lifecycle.abortSignal.throwIfAborted();
				},
				onAdopted: async () => {
					try {
						await lifecycle.onAdopted();
					} finally {
						settleTurn();
					}
				},
				onDeferred: () => {
					lifecycle.onDeferred();
					settleSession();
					monitor.requestDrain();
				},
				onAbandoned: async () => {
					try {
						await lifecycle.onAbandoned();
					} finally {
						settleTurn();
					}
				}
			};
			try {
				const event = raw.kind === "events-api" ? asOptionalRecord(raw.body)?.event : void 0;
				if (asOptionalRecord(event)?.type === "channel_id_changed") {
					const channelTurns = activeChannelTurns.get(laneKey);
					if (channelTurns && channelTurns.size > 0) {
						adoptOnCompletion = true;
						lifecycle.onAdoptionFinalizing();
						await Promise.all(channelTurns);
						lifecycle.abortSignal.throwIfAborted();
					}
				}
				if (raw.kind === "relay") {
					if (!relayDispatch) throw new Error("Slack relay ingress dispatcher is not attached.");
					await relayDispatch(raw.message, routedLifecycle);
				} else {
					if (!app) throw new Error("Slack ingress receiver is not attached to a Bolt app.");
					await app.processEvent({
						body: raw.body,
						ack: async () => {},
						...raw.retryNum === void 0 ? {} : { retryNum: raw.retryNum },
						...raw.retryReason === void 0 ? {} : { retryReason: raw.retryReason },
						customProperties: { [SLACK_INGRESS_LIFECYCLE_CONTEXT_KEY]: routedLifecycle }
					});
				}
				if (adoptOnCompletion) await routedLifecycle.onAdopted();
			} catch (error) {
				try {
					await lifecycle.onFailed?.(error);
				} finally {
					settleTurn();
				}
				throw error;
			}
		},
		deferredClaims: "wait-on-stop",
		pollIntervalMs: options.pollIntervalMs ?? SLACK_INGRESS_POLL_INTERVAL_MS,
		retention: "standard",
		appendRetryDelaysMs: [0],
		drain: {
			resolveNonRetryableFailure: resolveSlackIngressNonRetryableFailure,
			deferredLaneOccupancy: "release",
			deriveLaneKey: (record) => record.payload.kind === "relay" ? resolveSlackIngressLane({ event: record.payload.message }, record.id) : resolveSlackIngressLane(record.payload.body, record.id),
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			...options.onLog ? { onLog: options.onLog } : {}
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		onError: (error) => options.onLog?.(`slack ingress drain failed: ${formatErrorMessage(error)}`)
	});
	const acceptReceiverEvent = async (event) => {
		if (!isSlackEventCallback(event.body)) {
			if (!app) throw new Error("Slack ingress receiver is not attached to a Bolt app.");
			await app.processEvent(event);
			return;
		}
		await monitor.admit({
			kind: "events-api",
			body: event.body,
			...event.retryNum === void 0 ? {} : { retryNum: event.retryNum },
			...event.retryReason === void 0 ? {} : { retryReason: event.retryReason },
			afterDurableAdmission: () => event.ack()
		});
	};
	const acceptRelayEvent = async (event) => {
		await monitor.admit({
			kind: "relay",
			deliveryId: event.deliveryId,
			message: event.message
		});
	};
	return {
		wrapReceiver: (receiver) => {
			const client = Reflect.get(receiver, "client");
			return {
				init: (nextApp) => {
					app = nextApp;
					receiver.init({ processEvent: acceptReceiverEvent });
				},
				start: (...args) => receiver.start(...args),
				stop: (...args) => receiver.stop(...args),
				...client === void 0 ? {} : { client }
			};
		},
		acceptRelayEvent,
		attachRelayDispatch: (dispatch) => {
			relayDispatch = dispatch;
		},
		start: monitor.start,
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/slack/src/monitor/events/channels.ts
function registerSlackChannelEvents(params) {
	const { ctx, trackEvent } = params;
	const enqueueChannelSystemEvent = async (paramsLocal) => {
		const runtimeContext = await params.ctx.readRuntimeContext();
		if (!runtimeContext.isChannelAllowed({
			teamId: paramsLocal.eventScope?.teamId ?? runtimeContext.teamId,
			channelId: paramsLocal.channelId,
			channelName: paramsLocal.channelName,
			channelType: "channel"
		})) return;
		const label = resolveSlackChannelLabel({
			channelId: paramsLocal.channelId,
			channelName: paramsLocal.channelName
		});
		const route = runtimeContext.resolveSlackSystemEventRoute({
			channelId: paramsLocal.channelId,
			channelType: "channel",
			eventScope: paramsLocal.eventScope
		});
		enqueueRoutedSystemEvent(`Slack channel ${paramsLocal.kind}: ${label}.`, route, { contextKey: `slack:channel:${paramsLocal.eventScope ? `${paramsLocal.eventScope.teamId}:` : ""}${paramsLocal.kind}:${paramsLocal.channelId ?? paramsLocal.channelName ?? "unknown"}:${paramsLocal.eventId}` });
	};
	ctx.app.event("channel_created", async (args) => {
		const { event, body, context, client } = args;
		const eventScope = resolveSlackListenerEventScope({
			ctx,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		const payload = event;
		const channelId = payload.channel?.id;
		const channelName = payload.channel?.name;
		await enqueueChannelSystemEvent({
			kind: "created",
			channelId,
			channelName,
			eventId: body.event_id,
			eventScope
		});
	});
	ctx.app.event("channel_rename", async (args) => {
		const { event, body, context, client } = args;
		const eventScope = resolveSlackListenerEventScope({
			ctx,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		const payload = event;
		const channelId = payload.channel?.id;
		const channelName = payload.channel?.name_normalized ?? payload.channel?.name;
		await enqueueChannelSystemEvent({
			kind: "renamed",
			channelId,
			channelName,
			eventId: body.event_id,
			eventScope
		});
	});
}
function registerSlackChannelIdChangedEvent(params) {
	const { ctx, trackEvent } = params;
	ctx.app.event("channel_id_changed", async ({ event, body, context }) => {
		const turnAdoptionLifecycle = resolveSlackIngressTurnLifecycle(context);
		try {
			if (ctx.shouldDropMismatchedSlackEvent(body)) return;
			trackEvent?.();
			const payload = event;
			const oldChannelId = payload.old_channel_id;
			const newChannelId = payload.new_channel_id;
			if (!oldChannelId || !newChannelId) return;
			const channelInfo = await ctx.resolveChannelName(newChannelId);
			const label = resolveSlackChannelLabel({
				channelId: newChannelId,
				channelName: channelInfo?.name
			});
			ctx.runtime.log?.(warn(`[slack] Channel ID changed: ${oldChannelId} → ${newChannelId} (${label})`));
			if (!resolveChannelConfigWrites({
				cfg: ctx.cfg,
				channelId: "slack",
				accountId: ctx.accountId
			})) {
				ctx.runtime.log?.(warn("[slack] Config writes disabled; skipping channel config migration."));
				return;
			}
			const { snapshot } = await readConfigFileSnapshotForWrite();
			const preview = migrateSlackChannelConfig({
				cfg: structuredClone(snapshot.sourceConfig),
				accountId: ctx.accountId,
				oldChannelId,
				newChannelId
			});
			if (preview.migrated) {
				if ((await mutateConfigFile({
					baseHash: snapshot.hash ?? void 0,
					afterWrite: { mode: "auto" },
					mutate: (draft) => migrateSlackChannelConfig({
						cfg: draft,
						accountId: ctx.accountId,
						oldChannelId,
						newChannelId
					})
				})).result?.migrated) ctx.runtime.log?.(warn("[slack] Channel config migrated and saved successfully."));
			} else if (preview.skippedExisting) ctx.runtime.log?.(warn(`[slack] Channel config already exists for ${newChannelId}; leaving ${oldChannelId} unchanged`));
			else ctx.runtime.log?.(warn(`[slack] No config found for old channel ID ${oldChannelId}; migration logged only`));
		} catch (err) {
			ctx.runtime.error?.(danger(`slack channel_id_changed handler failed: ${formatErrorMessage(err)}`));
			if (turnAdoptionLifecycle) throw err;
		}
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/home.ts
function buildSlackHomeView(slashCommandName) {
	return {
		type: "home",
		callback_id: "openclaw:home",
		blocks: [
			{
				type: "header",
				text: {
					type: "plain_text",
					text: "OpenClaw"
				}
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: slashCommandName ? `Send a DM, mention OpenClaw in a channel, or use \`/${slashCommandName}\` to start a session.` : "Send a DM or mention OpenClaw in a channel to start a session."
				}
			},
			{
				type: "context",
				elements: [{
					type: "mrkdwn",
					text: "This Home tab is safe to show to any workspace member who opens the app."
				}]
			}
		]
	};
}
function registerSlackHomeEvents(params) {
	const { ctx, slashCommandName, trackEvent } = params;
	ctx.app.event("app_home_opened", async ({ event, body }) => {
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		const payload = event;
		if (!payload.user) return;
		if (payload.tab === "messages") {
			if (!payload.channel) return;
			const outcome = await ctx.setSlackSuggestedPrompts({
				channelId: payload.channel,
				title: "Try asking",
				prompts: DEFAULT_SLACK_SUGGESTED_PROMPTS
			});
			if (outcome === "accepted" || outcome === "internal_error") await ctx.recordSlackAgentView();
			return;
		}
		await ctx.app.client.views.publish({
			token: ctx.botToken,
			user_id: payload.user,
			view: buildSlackHomeView(slashCommandName)
		});
	});
}
//#endregion
//#region extensions/slack/src/interactive-dispatch.ts
const dispatchSlackInteractive = createChannelInteractiveDispatcher({
	channel: "slack",
	interactiveKey: "interaction"
});
async function dispatchSlackPluginInteractiveHandler(params) {
	const senderId = params.ctx.senderId?.trim();
	const rawBaseConversationId = params.channelType === "im" ? senderId ? `user:${senderId}` : "" : params.ctx.conversationId.trim();
	const threadId = params.ctx.threadId?.trim() || void 0;
	const qualify = (value) => params.teamId ? `team:${encodeURIComponent(params.teamId)}:${value}` : value;
	const baseConversationId = qualify(rawBaseConversationId);
	const qualifiedThreadId = threadId ? qualify(threadId) : void 0;
	const qualifiedParentConversationId = params.ctx.parentConversationId ? qualify(params.ctx.parentConversationId) : void 0;
	return await dispatchSlackInteractive({
		...params,
		dedupeId: qualify(params.interactionId),
		conversation: {
			channel: "slack",
			accountId: params.ctx.accountId,
			conversationId: qualifiedThreadId ?? baseConversationId,
			parentConversationId: qualifiedThreadId ? qualifiedParentConversationId ?? baseConversationId : qualifiedParentConversationId,
			threadId: qualifiedThreadId
		}
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/interactions.block-actions.ts
function readOptionValues(options) {
	if (!Array.isArray(options)) return;
	const values = options.map((option) => option && typeof option === "object" ? option.value : null).filter((value) => typeof value === "string" && value.trim().length > 0);
	return values.length > 0 ? values : void 0;
}
function readOptionLabels(options) {
	if (!Array.isArray(options)) return;
	const labels = options.map((option) => option && typeof option === "object" ? option.text?.text ?? null : null).filter((label) => typeof label === "string" && label.trim().length > 0);
	return labels.length > 0 ? labels : void 0;
}
function uniqueNonEmptyStrings(values) {
	return normalizeUniqueTrimmedStringList(values);
}
function collectRichTextFragments(value, out) {
	if (!value || typeof value !== "object") return;
	const typed = value;
	if (typeof typed.text === "string" && typed.text.trim().length > 0) out.push(typed.text.trim());
	if (Array.isArray(typed.elements)) for (const child of typed.elements) collectRichTextFragments(child, out);
}
function summarizeRichTextPreview(value) {
	const fragments = [];
	collectRichTextFragments(value, fragments);
	if (fragments.length === 0) return;
	const joined = fragments.join(" ").replace(/\s+/g, " ").trim();
	if (!joined) return;
	const max = 120;
	return joined.length <= max ? joined : truncateSlackText(joined, max);
}
function summarizeAction(action) {
	const typed = action;
	const actionType = typed.type;
	const selectedUsers = uniqueNonEmptyStrings([...typed.selected_user ? [typed.selected_user] : [], ...Array.isArray(typed.selected_users) ? typed.selected_users : []]);
	const selectedChannels = uniqueNonEmptyStrings([...typed.selected_channel ? [typed.selected_channel] : [], ...Array.isArray(typed.selected_channels) ? typed.selected_channels : []]);
	const selectedConversations = uniqueNonEmptyStrings([...typed.selected_conversation ? [typed.selected_conversation] : [], ...Array.isArray(typed.selected_conversations) ? typed.selected_conversations : []]);
	const selectedValues = uniqueNonEmptyStrings([
		...typed.selected_option?.value ? [typed.selected_option.value] : [],
		...readOptionValues(typed.selected_options) ?? [],
		...selectedUsers,
		...selectedChannels,
		...selectedConversations
	]);
	const selectedLabels = uniqueNonEmptyStrings([...typed.selected_option?.text?.text ? [typed.selected_option.text.text] : [], ...readOptionLabels(typed.selected_options) ?? []]);
	const inputValue = typeof typed.value === "string" ? typed.value : void 0;
	const inputNumber = actionType === "number_input" && inputValue != null ? parseStrictFiniteNumber(inputValue) : void 0;
	const parsedNumber = Number.isFinite(inputNumber) ? inputNumber : void 0;
	const inputEmail = actionType === "email_text_input" && inputValue?.includes("@") ? inputValue : void 0;
	let inputUrl;
	if (actionType === "url_text_input" && inputValue) try {
		inputUrl = new URL(inputValue).toString();
	} catch {
		inputUrl = void 0;
	}
	const richTextValue = actionType === "rich_text_input" ? typed.rich_text_value : void 0;
	const richTextPreview = summarizeRichTextPreview(richTextValue);
	return {
		actionType,
		inputKind: actionType === "number_input" ? "number" : actionType === "email_text_input" ? "email" : actionType === "url_text_input" ? "url" : actionType === "rich_text_input" ? "rich_text" : inputValue != null ? "text" : void 0,
		value: typed.value,
		selectedValues: selectedValues.length > 0 ? selectedValues : void 0,
		selectedUsers: selectedUsers.length > 0 ? selectedUsers : void 0,
		selectedChannels: selectedChannels.length > 0 ? selectedChannels : void 0,
		selectedConversations: selectedConversations.length > 0 ? selectedConversations : void 0,
		selectedLabels: selectedLabels.length > 0 ? selectedLabels : void 0,
		selectedDate: typed.selected_date,
		selectedTime: typed.selected_time,
		selectedDateTime: typeof typed.selected_date_time === "number" ? typed.selected_date_time : void 0,
		inputValue,
		inputNumber: parsedNumber,
		inputEmail,
		inputUrl,
		richTextValue,
		richTextPreview,
		workflowTriggerUrl: typed.workflow?.trigger_url,
		workflowId: typed.workflow?.workflow_id
	};
}
function formatInteractionSelectionLabel(params) {
	if (params.summary.actionType === "button" && params.buttonText?.trim()) return params.buttonText.trim();
	if (params.summary.selectedLabels?.length) {
		if (params.summary.selectedLabels.length <= 3) return params.summary.selectedLabels.join(", ");
		return `${params.summary.selectedLabels.slice(0, 3).join(", ")} +${params.summary.selectedLabels.length - 3}`;
	}
	if (params.summary.selectedValues?.length) {
		if (params.summary.selectedValues.length <= 3) return params.summary.selectedValues.join(", ");
		return `${params.summary.selectedValues.slice(0, 3).join(", ")} +${params.summary.selectedValues.length - 3}`;
	}
	if (params.summary.selectedDate) return params.summary.selectedDate;
	if (params.summary.selectedTime) return params.summary.selectedTime;
	if (typeof params.summary.selectedDateTime === "number") {
		const selectedDateTime = timestampMsToIsoString(params.summary.selectedDateTime * 1e3);
		if (selectedDateTime) return selectedDateTime;
	}
	if (params.summary.richTextPreview) return params.summary.richTextPreview;
	if (params.summary.value?.trim()) return params.summary.value.trim();
	return params.actionId;
}
function formatInteractionConfirmationText(params) {
	const userId = normalizeOptionalString(params.userId);
	const actor = userId ? ` by <@${userId}>` : "";
	return `:white_check_mark: *${escapeSlackMrkdwn(params.selectedLabel)}* selected${actor}`;
}
function buildSlackPluginInteractionData(params) {
	const actionId = normalizeOptionalString(params.actionId) ?? "";
	if (!actionId) return null;
	const payload = normalizeOptionalString(params.summary.value) || params.summary.selectedValues?.map((value) => normalizeOptionalString(value)).find(Boolean) || "";
	if (actionId === "openclaw:reply_button" || actionId === "openclaw:reply_select" || isSlackCallbackActionId(actionId) || actionId.startsWith(`openclaw:reply_button:`) || actionId.startsWith(`openclaw:reply_select:`)) return payload || null;
	return payload ? `${actionId}:${payload}` : actionId;
}
function isSlackReplyActionId(actionId) {
	return actionId === "openclaw:reply_button" || actionId === "openclaw:reply_select" || actionId.startsWith(`openclaw:reply_button:`) || actionId.startsWith(`openclaw:reply_select:`);
}
function readSlackApprovalAction(parsed) {
	const value = normalizeOptionalString(parsed.actionSummary.value) ?? parsed.actionSummary.selectedValues?.map((entry) => normalizeOptionalString(entry)).find((entry) => Boolean(entry));
	return decodeSlackApprovalAction(value);
}
function isSlackReplyLinkAction(parsed) {
	if (parsed.actionId === "openclaw:session_link") return true;
	if (parsed.actionId === "openclaw:reply_link" || parsed.actionId.startsWith(`openclaw:reply_link:`)) return true;
	const legacyUrl = normalizeOptionalString(parsed.typedAction.url);
	return Boolean(legacyUrl && isSlackReplyActionId(parsed.actionId));
}
function buildSlackPluginInteractionId(params) {
	const primaryValue = normalizeOptionalString(params.summary.value) || params.summary.selectedValues?.map((value) => normalizeOptionalString(value)).find(Boolean) || "";
	return [
		normalizeOptionalString(params.userId) ?? "",
		normalizeOptionalString(params.channelId) ?? "",
		normalizeOptionalString(params.messageTs) ?? "",
		normalizeOptionalString(params.triggerId) ?? "",
		normalizeOptionalString(params.actionId) ?? "",
		primaryValue
	].join(":");
}
function parseSlackBlockAction(params) {
	const typedBody = params.body;
	const typedAction = asOptionalRecord(params.action);
	if (!typedAction) {
		params.log?.(`slack:interaction malformed action payload channel=${typedBody.channel?.id ?? typedBody.container?.channel_id ?? "unknown"} user=${typedBody.user?.id ?? "unknown"}`);
		return null;
	}
	const typedActionWithText = typedAction;
	return {
		typedBody,
		typedAction,
		typedActionWithText,
		actionId: typeof typedActionWithText.action_id === "string" ? typedActionWithText.action_id : "unknown",
		blockId: typedActionWithText.block_id,
		userId: typedBody.user?.id ?? "unknown",
		channelId: typedBody.channel?.id ?? typedBody.container?.channel_id,
		messageTs: typedBody.message?.ts ?? typedBody.container?.message_ts,
		threadTs: typedBody.container?.thread_ts ?? typedBody.message?.thread_ts,
		actionSummary: summarizeAction(typedAction)
	};
}
async function respondEphemeral(respond, text) {
	if (!respond) return;
	try {
		await respond({
			text,
			response_type: "ephemeral"
		});
	} catch {}
}
async function updateSlackInteractionMessage(params) {
	if (!params.channelId || !params.messageTs) return;
	await (params.eventScope?.client ?? params.ctx.app.client).chat.update({
		channel: params.channelId,
		ts: params.messageTs,
		text: params.text,
		...params.blocks ? { blocks: params.blocks } : {}
	});
}
function resolveSlackApprovalTerminalLabel(approval) {
	if (approval.status === "allowed") return approval.decision === "allow-always" ? "Allowed always" : "Allowed once";
	if (approval.status === "denied") return "Denied";
	if (approval.status === "expired") return "Expired";
	return "Cancelled";
}
function removeSlackApprovalControls(blocks) {
	return blocks.flatMap((block) => {
		if (!block || typeof block !== "object" || Array.isArray(block)) return [block];
		const typedBlock = block;
		if (typedBlock.type !== "actions" || !Array.isArray(typedBlock.elements)) return [block];
		const elements = typedBlock.elements.filter((element) => typeof element.action_id !== "string" || !isSlackApprovalActionId(element.action_id));
		return elements.length > 0 ? [{
			...block,
			elements
		}] : [];
	});
}
function buildSlackApprovalTerminalBlocks(params) {
	const blocks = removeSlackApprovalControls(params.blocks ?? []).filter((block) => {
		const blockId = block.block_id;
		return !(block.type === "section" && blockId === "openclaw_approval_header");
	});
	return [{
		type: "section",
		text: {
			type: "mrkdwn",
			text: `*${params.prefix}: ${params.label}*`
		}
	}, ...blocks];
}
async function authorizeSlackBlockAction(params) {
	const auth = await authorizeSlackSystemEventSender({
		ctx: params.ctx,
		eventScope: params.eventScope,
		senderId: params.parsed.userId,
		channelId: params.parsed.channelId,
		channelType: params.parsed.channelId ? void 0 : "im",
		expectedSenderId: params.parsed.userId,
		interactiveEvent: true
	});
	if (auth.allowed) return auth;
	params.ctx.runtime.log?.(`slack:interaction drop action=${params.parsed.actionId} user=${params.parsed.userId} channel=${params.parsed.channelId ?? "unknown"} reason=${auth.reason ?? "unauthorized"}`);
	await respondEphemeral(params.respond, "You are not authorized to use this control.");
	return { allowed: false };
}
async function handleSlackPluginBindingApproval(params) {
	const pluginBindingApproval = parsePluginBindingApprovalCustomId(params.pluginInteractionData);
	if (!pluginBindingApproval) return false;
	const resolved = await resolvePluginConversationBindingApproval({
		approvalId: pluginBindingApproval.approvalId,
		decision: pluginBindingApproval.decision,
		senderId: params.parsed.userId
	});
	try {
		await updateSlackInteractionMessage({
			ctx: params.ctx,
			eventScope: params.eventScope,
			channelId: params.parsed.channelId,
			messageTs: params.parsed.messageTs,
			text: params.parsed.typedBody.message?.text ?? "",
			blocks: []
		});
	} catch {}
	await respondEphemeral(params.respond, buildPluginBindingResolvedText(resolved));
	return true;
}
function formatSlackPluginApprovalSenderId(userId, eventScope) {
	return formatSlackTarget({
		kind: "user",
		id: userId,
		teamId: eventScope?.teamId
	});
}
async function handleSlackApprovalInteraction(params) {
	const pluginSenderId = formatSlackPluginApprovalSenderId(params.parsed.userId, params.eventScope);
	const pluginApprovalAuthorizedSender = isSlackApprovalAuthorizedSender({
		cfg: params.ctx.cfg,
		accountId: params.ctx.accountId,
		senderId: pluginSenderId
	});
	const execApprovalAuthorizedSender = isSlackExecApprovalAuthorizedSender({
		cfg: params.ctx.cfg,
		accountId: params.ctx.accountId,
		senderId: params.parsed.userId
	});
	if (!(params.approval.approvalKind === "plugin" ? pluginApprovalAuthorizedSender : execApprovalAuthorizedSender)) {
		params.ctx.runtime.log?.(`slack:interaction drop ${params.approval.approvalKind} approval user=${params.parsed.userId} (not authorized)`);
		await respondEphemeral(params.respond, "You are not authorized to approve this request.");
		return true;
	}
	try {
		const result = await resolveApprovalOverGateway({
			cfg: params.ctx.cfg,
			approvalId: params.approval.approvalId,
			approvalKind: params.approval.approvalKind,
			decision: params.approval.decision,
			channel: "slack",
			accountId: params.ctx.accountId,
			senderId: params.approval.approvalKind === "plugin" ? pluginSenderId : params.parsed.userId
		});
		const terminalLabel = resolveSlackApprovalTerminalLabel(result.approval);
		const prefix = result.applied ? "Resolved" : "Already resolved";
		const { channelId, messageTs } = params.parsed;
		let terminalized = false;
		if (channelId && messageTs) try {
			terminalized = await runSlackApprovalMessageUpdate({
				accountId: params.ctx.accountId,
				channelId,
				messageTs
			}, async () => {
				const { readSlackMessages } = await import("./actions-DKCtBgCI.mjs").then((n) => n.t);
				const { messages } = await readSlackMessages(channelId, {
					client: params.eventScope?.client ?? params.ctx.app.client,
					messageId: messageTs,
					threadId: params.parsed.threadTs
				});
				const current = messages[0];
				if (!hasSlackApprovalControl(current?.blocks, params.approval)) return false;
				await updateSlackInteractionMessage({
					ctx: params.ctx,
					eventScope: params.eventScope,
					channelId,
					messageTs,
					text: truncateSlackText(`${prefix}: ${terminalLabel}`, 4e3),
					blocks: buildSlackApprovalTerminalBlocks({
						blocks: current?.blocks,
						label: terminalLabel,
						prefix
					})
				});
				return true;
			});
		} catch {}
		if (!terminalized || !result.applied) await respondEphemeral(params.respond, result.applied ? `Approval resolved: ${terminalLabel}.` : `This approval was already resolved: ${terminalLabel}.`);
	} catch (error) {
		params.ctx.runtime.log?.(`slack:interaction approval resolve failed id=${params.approval.approvalId}: ${String(error)}`);
		if (isApprovalNotFoundError(error)) {
			await respondEphemeral(params.respond, "This approval is no longer pending.");
			return true;
		}
		await respondEphemeral(params.respond, "Could not reach the Gateway to resolve this approval. Try again.");
		throw error;
	}
	return true;
}
async function handleSlackLegacyApprovalInteraction(params) {
	const parsedApproval = parseExecApprovalCommandText(params.pluginInteractionData);
	if (!parsedApproval) return false;
	const pluginSenderId = formatSlackPluginApprovalSenderId(params.parsed.userId, params.eventScope);
	const pluginAuthorized = isSlackApprovalAuthorizedSender({
		cfg: params.ctx.cfg,
		accountId: params.ctx.accountId,
		senderId: pluginSenderId
	});
	const execAuthorized = isSlackExecApprovalAuthorizedSender({
		cfg: params.ctx.cfg,
		accountId: params.ctx.accountId,
		senderId: params.parsed.userId
	});
	const resolveMethods = [];
	if (execAuthorized) resolveMethods.push("exec");
	if (pluginAuthorized) resolveMethods.push("plugin");
	if (resolveMethods.length === 0) {
		params.ctx.runtime.log?.(`slack:interaction drop legacy approval user=${params.parsed.userId} (not authorized)`);
		await respondEphemeral(params.respond, "You are not authorized to approve this request.");
		return true;
	}
	for (const [index, resolveMethod] of resolveMethods.entries()) try {
		await resolveApprovalOverGateway({
			cfg: params.ctx.cfg,
			approvalId: parsedApproval.approvalId,
			decision: parsedApproval.decision,
			channel: "slack",
			accountId: params.ctx.accountId,
			senderId: resolveMethod === "plugin" ? pluginSenderId : params.parsed.userId,
			resolveMethod
		});
		try {
			await updateSlackInteractionMessage({
				ctx: params.ctx,
				eventScope: params.eventScope,
				channelId: params.parsed.channelId,
				messageTs: params.parsed.messageTs,
				text: params.parsed.typedBody.message?.text ?? "",
				blocks: []
			});
		} catch {}
		return true;
	} catch (error) {
		if (index + 1 < resolveMethods.length && isApprovalNotFoundError(error)) continue;
		params.ctx.runtime.log?.(`slack:interaction legacy approval resolve failed id=${parsedApproval.approvalId}: ${String(error)}`);
		throw error;
	}
	return true;
}
async function dispatchSlackPluginInteraction(params) {
	const pluginInteractionId = buildSlackPluginInteractionId({
		userId: params.parsed.userId,
		channelId: params.parsed.channelId,
		messageTs: params.parsed.messageTs,
		triggerId: params.parsed.typedBody.trigger_id,
		actionId: params.parsed.actionId,
		summary: params.parsed.actionSummary
	});
	if (await handleSlackPluginBindingApproval({
		ctx: params.ctx,
		eventScope: params.eventScope,
		parsed: params.parsed,
		pluginInteractionData: params.pluginInteractionData,
		respond: params.respond
	})) return true;
	const pluginResult = await dispatchSlackPluginInteractiveHandler({
		data: params.pluginInteractionData,
		interactionId: pluginInteractionId,
		teamId: params.eventScope?.teamId,
		channelType: params.channelType,
		ctx: {
			accountId: params.ctx.accountId,
			interactionId: pluginInteractionId,
			conversationId: params.parsed.channelId ?? "",
			parentConversationId: void 0,
			threadId: params.parsed.threadTs,
			senderId: params.parsed.userId,
			senderUsername: void 0,
			auth: params.auth,
			interaction: {
				kind: params.parsed.actionSummary.actionType === "button" ? "button" : "select",
				actionId: params.parsed.actionId,
				blockId: params.parsed.blockId,
				messageTs: params.parsed.messageTs,
				threadTs: params.parsed.threadTs,
				value: params.parsed.actionSummary.value,
				selectedValues: params.parsed.actionSummary.selectedValues,
				selectedLabels: params.parsed.actionSummary.selectedLabels,
				triggerId: params.parsed.typedBody.trigger_id,
				responseUrl: params.parsed.typedBody.response_url
			}
		},
		respond: {
			acknowledge: async () => {},
			reply: async ({ text, responseType }) => {
				if (!text) return;
				await params.respond?.({
					text,
					response_type: responseType ?? "ephemeral"
				});
			},
			followUp: async ({ text, responseType }) => {
				if (!text) return;
				await params.respond?.({
					text,
					response_type: responseType ?? "ephemeral"
				});
			},
			editMessage: async ({ text, blocks }) => {
				await updateSlackInteractionMessage({
					ctx: params.ctx,
					eventScope: params.eventScope,
					channelId: params.parsed.channelId,
					messageTs: params.parsed.messageTs,
					text: text ?? params.parsed.typedBody.message?.text ?? "",
					blocks: Array.isArray(blocks) ? blocks : void 0
				});
			}
		}
	});
	return pluginResult.matched && pluginResult.handled;
}
async function resolveSlackBlockActionCommandAuthorized(params) {
	const commandsAllowFrom = params.ctx.cfg.commands?.allowFrom;
	if (commandsAllowFrom != null && typeof commandsAllowFrom === "object" && (Array.isArray(commandsAllowFrom.slack) || Array.isArray(commandsAllowFrom["*"]))) return resolveCommandAuthorization({
		ctx: {
			Provider: "slack",
			Surface: "slack",
			OriginatingChannel: "slack",
			AccountId: params.ctx.accountId,
			ChatType: params.auth.channelType === "im" ? "direct" : "group",
			From: params.parsed.channelId ? `slack:${params.parsed.channelId}` : "slack",
			SenderId: params.parsed.userId
		},
		cfg: params.ctx.cfg,
		commandAuthorized: false
	}).isAuthorizedSender;
	const isDirectMessage = params.auth.channelType === "im";
	const isRoom = params.auth.channelType === "channel" || params.auth.channelType === "group";
	const allowFromLower = await resolveSlackEffectiveAllowFrom(params.ctx, {
		includePairingStore: isDirectMessage,
		eventScope: params.eventScope
	});
	const senderName = (await params.ctx.resolveUserName(params.parsed.userId, params.eventScope).catch(() => void 0))?.name;
	let channelUsers = [];
	if (isRoom && params.parsed.channelId) {
		const channelConfig = resolveSlackChannelConfig({
			teamId: params.eventScope?.teamId ?? params.ctx.teamId,
			allowUnscoped: params.ctx.installationIdentity?.kind !== "enterprise",
			channelId: params.parsed.channelId,
			channelName: params.auth.channelName,
			channels: params.ctx.channelsConfig,
			channelKeys: params.ctx.channelsConfigKeys,
			defaultRequireMention: params.ctx.defaultRequireMention,
			allowNameMatching: params.ctx.allowNameMatching
		});
		channelUsers = Array.isArray(channelConfig?.users) ? channelConfig.users : [];
	}
	return (await resolveSlackCommandIngress({
		ctx: params.ctx,
		teamId: params.eventScope?.teamId ?? params.ctx.teamId,
		senderId: params.parsed.userId,
		senderName,
		channelType: params.auth.channelType ?? "channel",
		channelId: params.parsed.channelId ?? "slack-interaction",
		ownerAllowFromLower: allowFromLower,
		channelUsers,
		allowTextCommands: false,
		hasControlCommand: true,
		eventKind: "button",
		modeWhenAccessGroupsOff: "configured"
	})).commandAccess.authorized;
}
function enqueueSlackBlockActionEvent(params) {
	const targetKind = params.auth.channelType === "im" ? "user" : "channel";
	const targetId = targetKind === "user" ? params.parsed.userId : params.parsed.channelId;
	const deferredTarget = targetId ? resolveSlackDeferredActionTarget({
		eventScope: params.eventScope,
		kind: targetKind,
		id: targetId
	}) : void 0;
	const eventPayload = {
		interactionType: "block_action",
		actionId: params.parsed.actionId,
		blockId: params.parsed.blockId,
		...params.parsed.actionSummary,
		userId: params.parsed.userId,
		teamId: params.teamId,
		triggerId: params.parsed.typedBody.trigger_id,
		responseUrl: params.parsed.typedBody.response_url,
		channelId: params.parsed.channelId,
		messageTs: params.parsed.messageTs,
		threadTs: params.parsed.threadTs
	};
	params.ctx.runtime.log?.(`slack:interaction action=${params.parsed.actionId} type=${params.parsed.actionSummary.actionType ?? "unknown"} user=${params.parsed.userId} channel=${params.parsed.channelId}`);
	const route = params.ctx.resolveSlackSystemEventRoute({
		channelId: params.parsed.channelId,
		channelType: params.auth.channelType,
		senderId: params.parsed.userId,
		threadTs: params.parsed.threadTs,
		eventScope: params.eventScope
	});
	const contextParts = [
		"slack:interaction",
		params.teamId,
		params.parsed.channelId,
		params.parsed.messageTs,
		params.parsed.actionId,
		normalizeOptionalString(params.parsed.typedActionWithText.action_ts) ?? params.parsed.typedBody.trigger_id
	].filter(Boolean);
	if (enqueueRoutedSystemEvent(params.formatSystemEvent(eventPayload), route, {
		contextKey: contextParts.join(":"),
		deliveryContext: {
			channel: "slack",
			to: deferredTarget?.target,
			accountId: params.ctx.accountId,
			threadId: params.parsed.threadTs
		}
	})) requestHeartbeat({
		source: "hook",
		intent: "immediate",
		reason: "hook:slack-interaction",
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		heartbeat: { target: "last" }
	});
}
function buildSlackConfirmationBlocks(params) {
	const selectedLabel = formatInteractionSelectionLabel({
		actionId: params.parsed.actionId,
		summary: params.parsed.actionSummary,
		buttonText: params.parsed.typedActionWithText.text?.text
	});
	return params.originalBlocks.map((block) => {
		const typedBlock = block;
		if (typedBlock.type === "actions" && typedBlock.block_id === params.parsed.blockId) return {
			type: "context",
			elements: [{
				type: "mrkdwn",
				text: formatInteractionConfirmationText({
					selectedLabel,
					userId: params.parsed.userId
				})
			}]
		};
		return block;
	});
}
async function updateSlackLegacyBlockAction(params) {
	const originalBlocks = params.parsed.typedBody.message?.blocks;
	if (!Array.isArray(originalBlocks) || !params.parsed.channelId || !params.parsed.messageTs || !params.parsed.blockId) return;
	try {
		await updateSlackInteractionMessage({
			ctx: params.ctx,
			eventScope: params.eventScope,
			channelId: params.parsed.channelId,
			messageTs: params.parsed.messageTs,
			text: params.parsed.typedBody.message?.text ?? "",
			blocks: buildSlackConfirmationBlocks({
				parsed: params.parsed,
				originalBlocks
			})
		});
	} catch {
		await respondEphemeral(params.respond, `Button "${params.parsed.actionId}" clicked!`);
	}
}
async function handleSlackBlockAction(params) {
	const { ack, body, action, respond } = params.args;
	await ack();
	const runtimeContext = await params.ctx.readRuntimeContext();
	const eventScope = resolveSlackListenerEventScope$1({
		identity: runtimeContext.installationIdentity,
		body,
		context: params.args.context,
		client: params.args.client,
		clientOptions: runtimeContext.app.webClientOptions,
		onDrop: (reason) => runtimeContext.runtime.log?.(`slack:interaction drop action ${reason}`)
	});
	if (eventScope === null) return;
	if (runtimeContext.shouldDropMismatchedSlackEvent?.(body)) {
		runtimeContext.runtime.log?.("slack:interaction drop block action payload (mismatched app/team)");
		return;
	}
	const parsed = parseSlackBlockAction({
		body,
		action,
		log: runtimeContext.runtime.log
	});
	if (!parsed) return;
	if (isSlackReplyLinkAction(parsed)) return;
	params.trackEvent?.();
	if (isSlackApprovalActionId(parsed.actionId)) {
		const approval = readSlackApprovalAction(parsed);
		if (!approval) {
			runtimeContext.runtime.log?.(`slack:interaction drop malformed approval action user=${parsed.userId} channel=${parsed.channelId ?? "unknown"}`);
			await respondEphemeral(respond, "This approval action is invalid or expired.");
			return;
		}
		await handleSlackApprovalInteraction({
			ctx: runtimeContext,
			eventScope,
			parsed,
			approval,
			respond
		});
		return;
	}
	if (isSlackQuestionActionId(parsed.actionId)) {
		const question = decodeSlackQuestionAction(parsed.actionSummary.value);
		if (!question) {
			await respondEphemeral(respond, "This question action is invalid or expired.");
			return;
		}
		if (!(await authorizeSlackBlockAction({
			ctx: runtimeContext,
			eventScope,
			parsed,
			respond
		})).allowed) return;
		await resolveSlackQuestionAction({
			action: question,
			cfg: runtimeContext.cfg,
			accountId: runtimeContext.accountId,
			userId: parsed.userId,
			respond: async (text) => await respondEphemeral(respond, text)
		});
		return;
	}
	const pluginInteractionData = buildSlackPluginInteractionData({
		actionId: parsed.actionId,
		summary: parsed.actionSummary
	});
	if (pluginInteractionData && isSlackReplyActionId(parsed.actionId)) {
		if (await handleSlackLegacyApprovalInteraction({
			ctx: runtimeContext,
			eventScope,
			parsed,
			pluginInteractionData,
			respond
		})) return;
	}
	const auth = await authorizeSlackBlockAction({
		ctx: runtimeContext,
		eventScope,
		parsed,
		respond
	});
	if (!auth.allowed) return;
	if (pluginInteractionData && isSlackReplyActionId(parsed.actionId)) {
		if (await handleSlackPluginBindingApproval({
			ctx: runtimeContext,
			eventScope,
			parsed,
			pluginInteractionData,
			respond
		})) return;
	} else if (pluginInteractionData) {
		if (await dispatchSlackPluginInteraction({
			ctx: runtimeContext,
			eventScope,
			parsed,
			pluginInteractionData,
			auth: { isAuthorizedSender: await resolveSlackBlockActionCommandAuthorized({
				ctx: runtimeContext,
				eventScope,
				parsed,
				auth
			}) },
			channelType: auth.channelType,
			respond
		})) return;
	}
	enqueueSlackBlockActionEvent({
		ctx: runtimeContext,
		eventScope,
		teamId: params.args.context.teamId,
		parsed,
		auth,
		formatSystemEvent: params.formatSystemEvent
	});
	await updateSlackLegacyBlockAction({
		ctx: runtimeContext,
		eventScope,
		parsed,
		respond
	});
}
function registerSlackBlockActionHandler(params) {
	if (typeof params.ctx.app.action !== "function") return;
	params.ctx.app.action(/.+/, async (args) => {
		await handleSlackBlockAction({
			ctx: params.ctx,
			trackEvent: params.trackEvent,
			args,
			formatSystemEvent: params.formatSystemEvent
		});
	});
}
//#endregion
//#region extensions/slack/src/modal-metadata.ts
function parseSlackModalPrivateMetadata(raw) {
	if (typeof raw !== "string" || raw.trim().length === 0) return {};
	try {
		const parsed = JSON.parse(raw);
		return {
			sessionKey: normalizeOptionalString(parsed.sessionKey),
			channelId: normalizeOptionalString(parsed.channelId),
			channelType: normalizeOptionalString(parsed.channelType),
			userId: normalizeOptionalString(parsed.userId),
			pluginInteractiveData: normalizeOptionalString(parsed.pluginInteractiveData)
		};
	} catch {
		return {};
	}
}
//#endregion
//#region extensions/slack/src/monitor/events/interactions.modal.ts
const OPENCLAW_MODAL_CALLBACK_PREFIX = "openclaw:";
function resolveSlackModalPluginInteractiveData(params) {
	const metadataData = params.metadata.pluginInteractiveData?.trim();
	if (metadataData) return metadataData;
	if (!params.callbackId.startsWith(OPENCLAW_MODAL_CALLBACK_PREFIX)) return;
	return params.callbackId.slice(9).trim() || void 0;
}
function shouldHandleSlackModalLifecycleBody(body) {
	const typed = body;
	if ((typed.view?.callback_id ?? "").startsWith(OPENCLAW_MODAL_CALLBACK_PREFIX)) return true;
	const metadata = parseSlackModalPrivateMetadata(typed.view?.private_metadata);
	return Boolean(metadata.pluginInteractiveData?.trim());
}
function resolveSlackModalPluginNamespace(data) {
	if (!data) return;
	const separatorIndex = data.indexOf(":");
	return separatorIndex >= 0 ? data.slice(0, separatorIndex) : data;
}
function resolveSlackPluginSystemEventPayload(result) {
	if (!result || typeof result !== "object") return;
	const systemEvent = result.systemEvent;
	if (!systemEvent || typeof systemEvent !== "object") return;
	const typed = systemEvent;
	const output = {};
	if (typeof typed.summary === "string" && typed.summary.trim()) output.summary = typed.summary;
	if (typeof typed.reference === "string" && typed.reference.trim()) output.reference = typed.reference;
	if (typed.data && typeof typed.data === "object" && !Array.isArray(typed.data)) output.data = typed.data;
	return Object.keys(output).length > 0 ? output : void 0;
}
function resolveModalSessionRouting(params) {
	const metadata = params.metadata;
	const metadataAgentId = metadata.sessionKey ? resolveAgentIdFromSessionKey(metadata.sessionKey) : void 0;
	if (metadata.sessionKey && metadataAgentId && !params.eventScope) return {
		agentId: metadataAgentId,
		sessionKey: metadata.sessionKey,
		channelId: metadata.channelId,
		channelType: metadata.channelType
	};
	const routing = metadata.channelId ? {
		...params.ctx.resolveSlackSystemEventRoute({
			channelId: metadata.channelId,
			channelType: metadata.channelType,
			senderId: params.userId,
			eventScope: params.eventScope
		}),
		channelId: metadata.channelId,
		channelType: metadata.channelType
	} : {
		...params.ctx.resolveSlackSystemEventRoute({
			channelType: "im",
			senderId: params.userId,
			eventScope: params.eventScope
		}),
		channelType: params.eventScope ? "im" : void 0
	};
	if (metadata.sessionKey && (metadata.sessionKey === routing.sessionKey || metadata.sessionKey.startsWith(`${routing.sessionKey}:thread:`))) return {
		...routing,
		sessionKey: metadata.sessionKey
	};
	return routing;
}
function summarizeSlackViewLifecycleContext(view) {
	const rootViewId = view.root_view_id;
	const previousViewId = view.previous_view_id;
	return {
		rootViewId,
		previousViewId,
		externalId: view.external_id,
		viewHash: view.hash,
		isStackedView: Boolean(previousViewId)
	};
}
function resolveSlackModalEventBase(params) {
	const metadata = parseSlackModalPrivateMetadata(params.body.view?.private_metadata);
	const callbackId = params.body.view?.callback_id ?? "unknown";
	const userId = params.body.user?.id ?? "unknown";
	const viewId = params.body.view?.id;
	const inputs = params.summarizeViewState(params.body.view?.state?.values);
	const sessionRouting = resolveModalSessionRouting({
		ctx: params.ctx,
		metadata,
		userId,
		eventScope: params.eventScope
	});
	return {
		callbackId,
		userId,
		expectedUserId: metadata.userId,
		viewId,
		sessionRouting,
		stateValues: params.body.view?.state?.values,
		payload: {
			actionId: `view:${callbackId}`,
			callbackId,
			viewId,
			userId,
			teamId: params.teamId,
			...summarizeSlackViewLifecycleContext({
				root_view_id: params.body.view?.root_view_id,
				previous_view_id: params.body.view?.previous_view_id,
				external_id: params.body.view?.external_id,
				hash: params.body.view?.hash
			}),
			privateMetadata: params.body.view?.private_metadata,
			routedChannelId: sessionRouting.channelId,
			routedChannelType: sessionRouting.channelType,
			inputs
		}
	};
}
async function dispatchSlackModalPluginInteractiveHandler(params) {
	if (!params.data) return {
		matched: false,
		handled: false,
		duplicate: false
	};
	const isViewClosed = params.interactionType === "view_closed";
	const interactionId = [
		params.interactionType,
		params.payload.callbackId,
		params.payload.viewId,
		params.payload.userId
	].filter(Boolean).join(":");
	const result = await dispatchSlackPluginInteractiveHandler({
		data: params.data,
		interactionId,
		teamId: params.eventScope?.teamId,
		channelType: params.channelType,
		ctx: {
			accountId: params.ctx.accountId,
			interactionId,
			conversationId: params.sessionRouting.channelId ?? "",
			parentConversationId: void 0,
			threadId: void 0,
			senderId: params.payload.userId,
			senderUsername: void 0,
			auth: params.auth,
			interaction: {
				kind: params.interactionType,
				callbackId: params.payload.callbackId,
				viewId: params.payload.viewId,
				rootViewId: params.payload.rootViewId,
				previousViewId: params.payload.previousViewId,
				externalId: params.payload.externalId,
				isStackedView: params.payload.isStackedView,
				isCleared: isViewClosed ? params.body.is_cleared === true : void 0,
				inputs: params.payload.inputs,
				stateValues: params.stateValues,
				triggerId: params.body.trigger_id
			}
		},
		respond: {
			acknowledge: async () => {},
			reply: async () => {},
			followUp: async () => {},
			editMessage: async () => {}
		}
	});
	return {
		...result,
		namespace: result.matched ? resolveSlackModalPluginNamespace(params.data) : void 0,
		systemEvent: result.matched ? resolveSlackPluginSystemEventPayload(result.result) : void 0
	};
}
async function emitSlackModalLifecycleEvent(params) {
	const { callbackId, userId, expectedUserId, viewId, sessionRouting, stateValues, payload } = resolveSlackModalEventBase({
		ctx: params.ctx,
		body: params.body,
		eventScope: params.eventScope,
		teamId: params.teamId,
		summarizeViewState: params.summarizeViewState
	});
	const pluginInteractiveData = resolveSlackModalPluginInteractiveData({
		callbackId,
		metadata: parseSlackModalPrivateMetadata(params.body.view?.private_metadata)
	});
	const isViewClosed = params.interactionType === "view_closed";
	const isCleared = params.body.is_cleared === true;
	const eventPayload = isViewClosed ? {
		interactionType: params.interactionType,
		...payload,
		isCleared
	} : {
		interactionType: params.interactionType,
		...payload
	};
	if (isViewClosed) params.ctx.runtime.log?.(`slack:interaction view_closed callback=${callbackId} user=${userId} cleared=${isCleared}`);
	else params.ctx.runtime.log?.(`slack:interaction view_submission callback=${callbackId} user=${userId} inputs=${payload.inputs.length}`);
	if (!expectedUserId) {
		if (pluginInteractiveData) try {
			await dispatchSlackModalPluginInteractiveHandler({
				ctx: params.ctx,
				body: params.body,
				eventScope: params.eventScope,
				teamId: params.teamId,
				interactionType: params.interactionType,
				data: pluginInteractiveData,
				auth: { isAuthorizedSender: false },
				payload,
				stateValues,
				sessionRouting
			});
		} catch (error) {
			params.ctx.runtime.log?.(`slack:interaction modal plugin dispatch failed callback=${callbackId} error=${error instanceof Error ? error.message : String(error)}`);
		}
		params.ctx.runtime.log?.(`slack:interaction drop modal callback=${callbackId} user=${userId} reason=missing-expected-user`);
		return;
	}
	const auth = await authorizeSlackSystemEventSender({
		ctx: params.ctx,
		eventScope: params.eventScope,
		senderId: userId,
		channelId: sessionRouting.channelId,
		channelType: sessionRouting.channelType,
		expectedSenderId: expectedUserId,
		interactiveEvent: true
	});
	if (!auth.allowed) {
		params.ctx.runtime.log?.(`slack:interaction drop modal callback=${callbackId} user=${userId} reason=${auth.reason ?? "unauthorized"}`);
		return;
	}
	let pluginDispatch;
	try {
		pluginDispatch = await dispatchSlackModalPluginInteractiveHandler({
			ctx: params.ctx,
			body: params.body,
			eventScope: params.eventScope,
			teamId: params.teamId,
			interactionType: params.interactionType,
			data: pluginInteractiveData,
			auth: { isAuthorizedSender: auth.allowed },
			channelType: auth.channelType,
			payload,
			stateValues,
			sessionRouting
		});
	} catch (error) {
		params.ctx.runtime.log?.(`slack:interaction modal plugin dispatch failed callback=${callbackId} error=${error instanceof Error ? error.message : String(error)}`);
	}
	const pluginEventFields = pluginDispatch?.matched === true ? {
		pluginHandled: pluginDispatch.handled,
		pluginNamespace: pluginDispatch.namespace,
		pluginDuplicate: pluginDispatch.duplicate || void 0,
		pluginSystemEvent: pluginDispatch.systemEvent
	} : {};
	const targetKind = auth.channelType === "im" ? "user" : "channel";
	const targetId = targetKind === "user" ? userId : sessionRouting.channelId;
	const deferredTarget = targetId ? resolveSlackDeferredActionTarget({
		eventScope: params.eventScope,
		kind: targetKind,
		id: targetId
	}) : void 0;
	if (enqueueRoutedSystemEvent(params.formatSystemEvent({
		...eventPayload,
		...pluginEventFields
	}), sessionRouting, {
		contextKey: [
			params.contextPrefix,
			params.teamId,
			callbackId,
			viewId,
			userId
		].filter(Boolean).join(":"),
		deliveryContext: {
			channel: "slack",
			...deferredTarget ? { to: deferredTarget.target } : {},
			accountId: params.ctx.accountId
		}
	})) requestHeartbeat({
		source: "hook",
		intent: "immediate",
		reason: "hook:slack-interaction",
		agentId: sessionRouting.agentId,
		sessionKey: sessionRouting.sessionKey,
		heartbeat: { target: "last" }
	});
}
function registerModalLifecycleHandler(params) {
	params.register(params.matcher, async (args) => {
		const { ack, body } = args;
		if (!shouldHandleSlackModalLifecycleBody(body)) return;
		await ack();
		const eventScope = resolveSlackListenerEventScope$1({
			identity: params.ctx.installationIdentity,
			body,
			context: args.context,
			client: args.client,
			clientOptions: params.ctx.app.webClientOptions,
			onDrop: (reason) => params.ctx.runtime.log?.(`slack:interaction drop ${params.interactionType} ${reason}`)
		});
		if (eventScope === null) return;
		if (params.ctx.shouldDropMismatchedSlackEvent?.(body)) {
			params.ctx.runtime.log?.(`slack:interaction drop ${params.interactionType} payload (mismatched app/team)`);
			return;
		}
		params.trackEvent?.();
		const typedBody = body;
		await emitSlackModalLifecycleEvent({
			ctx: await params.ctx.readRuntimeContext(),
			body: typedBody,
			eventScope,
			teamId: args.context.teamId,
			interactionType: params.interactionType,
			contextPrefix: params.contextPrefix,
			summarizeViewState: params.summarizeViewState,
			formatSystemEvent: params.formatSystemEvent
		});
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/interactions.shortcuts.ts
function resolveMessageThreadTs(body) {
	const threadTs = body.message.thread_ts;
	return typeof threadTs === "string" && threadTs.trim() ? threadTs.trim() : void 0;
}
async function handleSlackShortcut(params) {
	const { ack, body } = params.args;
	await ack();
	const runtimeContext = await params.ctx.readRuntimeContext();
	const eventScope = resolveSlackListenerEventScope$1({
		identity: runtimeContext.installationIdentity,
		body,
		context: params.args.context,
		client: params.args.client,
		clientOptions: runtimeContext.app.webClientOptions,
		onDrop: (reason) => runtimeContext.runtime.log?.(`slack:interaction drop shortcut ${reason}`)
	});
	if (eventScope === null) return;
	if (runtimeContext.shouldDropMismatchedSlackEvent?.(body)) {
		runtimeContext.runtime.log?.("slack:interaction drop shortcut payload (mismatched app/team)");
		return;
	}
	const callbackId = body.callback_id?.trim();
	const userId = body.user?.id?.trim();
	if (!callbackId || !userId) {
		runtimeContext.runtime.log?.("slack:interaction drop shortcut reason=invalid-payload");
		return;
	}
	params.trackEvent?.();
	const isMessageShortcut = body.type === "message_action";
	const messageBody = isMessageShortcut ? body : void 0;
	const channelId = messageBody?.channel.id?.trim() || void 0;
	if (isMessageShortcut && !channelId) {
		runtimeContext.runtime.log?.(`slack:interaction drop shortcut callback=${callbackId} user=${userId} reason=missing-channel`);
		return;
	}
	const threadTs = messageBody ? resolveMessageThreadTs(messageBody) : void 0;
	const auth = await authorizeSlackSystemEventSender({
		ctx: runtimeContext,
		eventScope,
		senderId: userId,
		channelId,
		channelType: isMessageShortcut ? void 0 : "im",
		expectedSenderId: userId,
		interactiveEvent: true
	});
	if (!auth.allowed) {
		runtimeContext.runtime.log?.(`slack:interaction drop shortcut callback=${callbackId} user=${userId} reason=${auth.reason ?? "unauthorized"}`);
		return;
	}
	const interactionType = isMessageShortcut ? "message_shortcut" : "global_shortcut";
	const messageTs = messageBody?.message.ts || messageBody?.message_ts;
	const teamId = params.args.context.teamId;
	const deferredTarget = resolveSlackDeferredActionTarget({
		eventScope,
		kind: auth.channelType === "im" ? "user" : "channel",
		id: auth.channelType === "im" ? userId : channelId ?? ""
	});
	const eventPayload = {
		interactionType,
		actionId: `shortcut:${callbackId}`,
		callbackId,
		userId,
		teamId,
		triggerId: body.trigger_id,
		actionTs: body.action_ts,
		channelId,
		channelName: messageBody?.channel.name,
		messageTs,
		threadTs,
		messageUserId: messageBody?.message.user,
		messageText: messageBody?.message.text,
		responseUrl: messageBody?.response_url
	};
	const route = runtimeContext.resolveSlackSystemEventRoute({
		channelId,
		channelType: auth.channelType,
		senderId: userId,
		threadTs,
		eventScope
	});
	const contextKey = [
		"slack:interaction:shortcut",
		interactionType,
		teamId,
		callbackId,
		channelId,
		messageTs,
		body.action_ts
	].filter(Boolean).join(":");
	runtimeContext.runtime.log?.(`slack:interaction ${interactionType} callback=${callbackId} user=${userId} channel=${channelId ?? "direct"}`);
	if (enqueueRoutedSystemEvent(params.formatSystemEvent(eventPayload), route, {
		contextKey,
		deliveryContext: {
			channel: "slack",
			to: deferredTarget.target,
			accountId: runtimeContext.accountId,
			threadId: threadTs
		}
	})) requestHeartbeat({
		source: "hook",
		intent: "immediate",
		reason: "hook:slack-interaction",
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		heartbeat: { target: "last" }
	});
}
function registerSlackShortcutHandler(params) {
	if (typeof params.ctx.app.shortcut !== "function") return;
	params.ctx.app.shortcut(/.+/, async (args) => {
		await handleSlackShortcut({
			ctx: params.ctx,
			trackEvent: params.trackEvent,
			args,
			formatSystemEvent: params.formatSystemEvent
		});
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/interactions.ts
const SLACK_INTERACTION_EVENT_PREFIX = "Slack interaction: ";
const REDACTED_INTERACTION_VALUE = "[redacted]";
const SLACK_INTERACTION_EVENT_MAX_CHARS = 2400;
const SLACK_INTERACTION_STRING_MAX_CHARS = 160;
const SLACK_INTERACTION_ARRAY_MAX_ITEMS = 64;
const SLACK_INTERACTION_COMPACT_INPUTS_MAX_ITEMS = 3;
const SLACK_INTERACTION_REDACTED_KEYS = /* @__PURE__ */ new Set([
	"triggerId",
	"responseUrl",
	"workflowTriggerUrl",
	"privateMetadata",
	"viewHash"
]);
function sanitizeSlackInteractionPayloadValue(value, key) {
	if (value === void 0) return;
	if (key && SLACK_INTERACTION_REDACTED_KEYS.has(key)) {
		if (typeof value !== "string" || value.trim().length === 0) return;
		return REDACTED_INTERACTION_VALUE;
	}
	if (typeof value === "string") return truncateSlackText(value, SLACK_INTERACTION_STRING_MAX_CHARS);
	if (Array.isArray(value)) {
		const sanitized = value.slice(0, SLACK_INTERACTION_ARRAY_MAX_ITEMS).map((entry) => sanitizeSlackInteractionPayloadValue(entry)).filter((entry) => entry !== void 0);
		if (value.length > SLACK_INTERACTION_ARRAY_MAX_ITEMS) sanitized.push(`…+${value.length - SLACK_INTERACTION_ARRAY_MAX_ITEMS} more`);
		return sanitized;
	}
	if (!value || typeof value !== "object") return value;
	const output = {};
	for (const [entryKey, entryValue] of Object.entries(value)) {
		const sanitized = sanitizeSlackInteractionPayloadValue(entryValue, entryKey);
		if (sanitized === void 0) continue;
		if (typeof sanitized === "string" && sanitized.length === 0) continue;
		if (Array.isArray(sanitized) && sanitized.length === 0) continue;
		output[entryKey] = sanitized;
	}
	return output;
}
function buildCompactSlackInteractionPayload(payload) {
	const rawInputs = Array.isArray(payload.inputs) ? payload.inputs : [];
	const compactInputs = rawInputs.slice(0, SLACK_INTERACTION_COMPACT_INPUTS_MAX_ITEMS).flatMap((entry) => {
		if (!entry || typeof entry !== "object") return [];
		const typed = entry;
		return [{
			actionId: typed.actionId,
			blockId: typed.blockId,
			actionType: typed.actionType,
			inputKind: typed.inputKind,
			selectedValues: typed.selectedValues,
			selectedLabels: typed.selectedLabels,
			inputValue: typed.inputValue,
			inputNumber: typed.inputNumber,
			selectedDate: typed.selectedDate,
			selectedTime: typed.selectedTime,
			selectedDateTime: typed.selectedDateTime,
			richTextPreview: typed.richTextPreview
		}];
	});
	return {
		interactionType: payload.interactionType,
		actionId: payload.actionId,
		callbackId: payload.callbackId,
		actionType: payload.actionType,
		actionTs: payload.actionTs,
		userId: payload.userId,
		teamId: payload.teamId,
		channelId: payload.channelId ?? payload.routedChannelId,
		messageTs: payload.messageTs,
		threadTs: payload.threadTs,
		messageUserId: payload.messageUserId,
		messageText: payload.messageText,
		viewId: payload.viewId,
		isCleared: payload.isCleared,
		selectedValues: payload.selectedValues,
		selectedLabels: payload.selectedLabels,
		selectedDate: payload.selectedDate,
		selectedTime: payload.selectedTime,
		selectedDateTime: payload.selectedDateTime,
		workflowId: payload.workflowId,
		routedChannelType: payload.routedChannelType,
		pluginHandled: payload.pluginHandled,
		pluginNamespace: payload.pluginNamespace,
		pluginDuplicate: payload.pluginDuplicate,
		pluginSystemEvent: payload.pluginSystemEvent,
		inputs: compactInputs.length > 0 ? compactInputs : void 0,
		inputsOmitted: rawInputs.length > SLACK_INTERACTION_COMPACT_INPUTS_MAX_ITEMS ? rawInputs.length - SLACK_INTERACTION_COMPACT_INPUTS_MAX_ITEMS : void 0,
		payloadTruncated: true
	};
}
function formatSlackInteractionSystemEvent(payload) {
	const toEventText = (value) => `${SLACK_INTERACTION_EVENT_PREFIX}${JSON.stringify(value)}`;
	const sanitizedPayload = sanitizeSlackInteractionPayloadValue(payload) ?? {};
	let eventText = toEventText(sanitizedPayload);
	if (eventText.length <= SLACK_INTERACTION_EVENT_MAX_CHARS) return eventText;
	eventText = toEventText(sanitizeSlackInteractionPayloadValue(buildCompactSlackInteractionPayload(sanitizedPayload)));
	if (eventText.length <= SLACK_INTERACTION_EVENT_MAX_CHARS) return eventText;
	return toEventText({
		interactionType: sanitizedPayload.interactionType,
		actionId: sanitizedPayload.actionId ?? "unknown",
		userId: sanitizedPayload.userId,
		channelId: sanitizedPayload.channelId ?? sanitizedPayload.routedChannelId,
		payloadTruncated: true
	});
}
function summarizeViewState(values) {
	if (!values || typeof values !== "object") return [];
	const entries = [];
	for (const [blockId, blockValue] of Object.entries(values)) {
		if (!blockValue || typeof blockValue !== "object") continue;
		for (const [actionId, rawAction] of Object.entries(blockValue)) {
			if (!rawAction || typeof rawAction !== "object") continue;
			const actionSummary = summarizeAction(rawAction);
			entries.push({
				blockId,
				actionId,
				...actionSummary
			});
		}
	}
	return entries;
}
function registerSlackInteractionEvents(params) {
	const { ctx, trackEvent } = params;
	registerSlackBlockActionHandler({
		ctx,
		trackEvent,
		formatSystemEvent: formatSlackInteractionSystemEvent
	});
	registerSlackShortcutHandler({
		ctx,
		trackEvent,
		formatSystemEvent: formatSlackInteractionSystemEvent
	});
	if (typeof ctx.app.view !== "function") return;
	const modalMatcher = /.*/;
	for (const [interactionType, contextPrefix] of [["view_submission", "slack:interaction:view"], ["view_closed", "slack:interaction:view-closed"]]) registerModalLifecycleHandler({
		register: (matcher, handler) => ctx.app.view({
			callback_id: matcher,
			type: interactionType
		}, handler),
		matcher: modalMatcher,
		ctx,
		trackEvent,
		interactionType,
		contextPrefix,
		summarizeViewState,
		formatSystemEvent: formatSlackInteractionSystemEvent
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/members.ts
function registerSlackMemberEvents(params) {
	const { ctx, trackEvent } = params;
	const handleMemberChannelEvent = async (paramsLocal) => {
		try {
			const runtimeContext = await params.ctx.readRuntimeContext();
			const eventScope = resolveSlackListenerEventScope({
				ctx: runtimeContext,
				body: paramsLocal.body,
				context: paramsLocal.context,
				client: paramsLocal.client
			});
			if (eventScope === null) return;
			if (runtimeContext.shouldDropMismatchedSlackEvent(paramsLocal.body)) return;
			trackEvent?.();
			const payload = paramsLocal.event;
			const channelId = payload.channel;
			const channelInfo = channelId ? await runtimeContext.resolveChannelName(channelId, eventScope) : {};
			const channelType = payload.channel_type ?? channelInfo?.type;
			if (paramsLocal.verb === "joined" && payload.user === runtimeContext.botUserId && channelId) {
				const roomType = normalizeSlackChannelType(channelType, channelId);
				if (roomType === "channel" || roomType === "group") {
					const roomAllowed = runtimeContext.isChannelAllowed({
						teamId: eventScope?.teamId ?? runtimeContext.teamId,
						channelId,
						channelName: channelInfo.name,
						channelType: roomType
					});
					const inviterLabel = roomAllowed && payload.inviter ? (await runtimeContext.resolveUserName(payload.inviter, eventScope)).name ?? payload.inviter : void 0;
					await reportChannelRoomJoin({
						cfg: runtimeContext.cfg,
						channel: "slack",
						accountId: runtimeContext.accountId,
						conversationId: channelId,
						deliverTo: `channel:${channelId}`,
						route: runtimeContext.resolveSlackSystemEventRoute({
							channelId,
							channelType: roomType,
							eventScope
						}),
						inviterLabel,
						roomAllowed,
						resolveRoomContext: async ({ messageLimit }) => {
							const purpose = [channelInfo.purpose, channelInfo.topic].filter((value) => Boolean(value?.trim())).join("\n");
							const roomContext = {
								title: channelInfo.name ? `#${channelInfo.name}` : void 0,
								purpose: purpose || void 0
							};
							try {
								const { messages } = await readSlackMessages(channelId, {
									limit: messageLimit,
									client: eventScope?.client ?? runtimeContext.app.client
								});
								return {
									...roomContext,
									recentMessages: messages.toReversed().flatMap(({ user, text }) => text?.trim() ? [{
										sender: user,
										text
									}] : [])
								};
							} catch {
								return roomContext;
							}
						}
					});
					return;
				}
			}
			const ingressContext = await authorizeAndResolveSlackSystemEventContext({
				ctx: runtimeContext,
				senderId: payload.user,
				channelId,
				channelType,
				eventKind: `member-${paramsLocal.verb}`,
				eventScope
			});
			if (!ingressContext) return;
			const userLabel = (payload.user ? await runtimeContext.resolveUserName(payload.user, eventScope) : {})?.name ?? payload.user ?? "someone";
			enqueueRoutedSystemEvent(`Slack: ${userLabel} ${paramsLocal.verb} ${ingressContext.channelLabel}.`, ingressContext.route, { contextKey: `slack:member:${eventScope ? `${eventScope.teamId}:` : ""}${paramsLocal.verb}:${channelId ?? "unknown"}:${payload.user ?? "unknown"}:${paramsLocal.eventId}` });
		} catch (err) {
			ctx.runtime.error?.(danger(`slack ${paramsLocal.verb} handler failed: ${formatErrorMessage(err)}`));
			if (err instanceof SlackSystemEventAuthRetryError) throw err;
		}
	};
	ctx.app.event("member_joined_channel", async (args) => {
		const { event, body, context, client } = args;
		await handleMemberChannelEvent({
			verb: "joined",
			event,
			body,
			eventId: body.event_id,
			context,
			client
		});
	});
	ctx.app.event("member_left_channel", async (args) => {
		const { event, body, context, client } = args;
		await handleMemberChannelEvent({
			verb: "left",
			event,
			body,
			eventId: body.event_id,
			context,
			client
		});
	});
}
//#endregion
//#region extensions/slack/src/draft-message-boundaries.ts
const activeDraftsByConversation = /* @__PURE__ */ new Map();
function conversationKey(conversation) {
	return [
		conversation.accountId ?? "default",
		conversation.teamId ?? "",
		conversation.channelId,
		conversation.threadTs ?? ""
	].join(":");
}
function isLaterSlackMessage(candidate, current) {
	const candidateTimestamp = Number(candidate);
	const currentTimestamp = Number(current);
	return Number.isFinite(candidateTimestamp) && Number.isFinite(currentTimestamp) && candidateTimestamp > currentTimestamp;
}
/** Keeps a live preview attached to its actual place in the Slack conversation. */
function trackSlackDraftMessage(conversation) {
	const key = conversationKey(conversation);
	const activeDraft = {
		messageTs: conversation.messageTs,
		onInterveningMessage: conversation.onInterveningMessage
	};
	const drafts = activeDraftsByConversation.get(key) ?? /* @__PURE__ */ new Set();
	drafts.add(activeDraft);
	activeDraftsByConversation.set(key, drafts);
	const stop = () => {
		const currentDrafts = activeDraftsByConversation.get(key);
		currentDrafts?.delete(activeDraft);
		if (currentDrafts?.size === 0) activeDraftsByConversation.delete(key);
	};
	return {
		setMessageTs: (messageTs) => {
			activeDraft.messageTs = messageTs;
			if (activeDraft.latestHumanMessageTs && isLaterSlackMessage(activeDraft.latestHumanMessageTs, messageTs)) activeDraft.onInterveningMessage();
		},
		stop
	};
}
/** A later human message means subsequent assistant output belongs below it. */
function noteSlackDraftConversationMessage(conversation) {
	if (!conversation.messageTs || !conversation.userId || conversation.userId === conversation.botUserId || conversation.botId || conversation.subtype === "bot_message") return;
	const drafts = activeDraftsByConversation.get(conversationKey(conversation));
	if (!drafts) return;
	for (const draft of drafts) {
		if (!draft.messageTs) {
			if (!draft.latestHumanMessageTs || isLaterSlackMessage(conversation.messageTs, draft.latestHumanMessageTs)) draft.latestHumanMessageTs = conversation.messageTs;
			continue;
		}
		if (isLaterSlackMessage(conversation.messageTs, draft.messageTs)) draft.onInterveningMessage();
	}
}
//#endregion
//#region extensions/slack/src/monitor/events/message-subtype-handlers.ts
function resolveNestedThreadTs(event) {
	const changed = event;
	const message = changed.message?.thread_ts ? changed.message : changed.previous_message;
	if (!message) return;
	return resolveSlackThreadContext({
		message: {
			type: "message",
			channel: event.channel,
			...message
		},
		replyToMode: "off"
	}).replyToId;
}
const SUBTYPE_HANDLER_REGISTRY = {
	message_changed: {
		eventKind: "message_changed",
		describe: (channelLabel) => `Slack message edited in ${channelLabel}.`,
		contextKey: (event) => {
			const changed = event;
			return `slack:message:changed:${changed.channel ?? "unknown"}:${changed.message?.ts ?? changed.previous_message?.ts ?? changed.event_ts ?? "unknown"}`;
		},
		resolveSenderId: (event) => {
			const changed = event;
			return changed.message?.user ?? changed.previous_message?.user ?? changed.message?.bot_id ?? changed.previous_message?.bot_id;
		},
		resolveThreadTs: resolveNestedThreadTs
	},
	message_deleted: {
		eventKind: "message_deleted",
		describe: (channelLabel) => `Slack message deleted in ${channelLabel}.`,
		contextKey: (event) => {
			const deleted = event;
			return `slack:message:deleted:${deleted.channel ?? "unknown"}:${deleted.deleted_ts ?? deleted.event_ts ?? "unknown"}`;
		},
		resolveSenderId: (event) => {
			const deleted = event;
			return deleted.previous_message?.user ?? deleted.previous_message?.bot_id;
		},
		resolveThreadTs: resolveNestedThreadTs
	}
};
function resolveSlackMessageSubtypeHandler(event) {
	const subtype = event.subtype;
	if (subtype !== "message_changed" && subtype !== "message_deleted") return;
	return SUBTYPE_HANDLER_REGISTRY[subtype];
}
//#endregion
//#region extensions/slack/src/monitor/events/messages.ts
const slackInboundLog = createSubsystemLogger("gateway/channels/slack").child("inbound");
function formatSlackInboundLogLine(params) {
	return `Inbound app_mention ${`slack:${params.workspaceId}:channel:${params.channelId}:user:${params.userId}`} -> bot:${params.botUserId} (${params.channelType}, ${params.bodyChars} chars)`;
}
function isSlackUserId(value) {
	return /^[UW][A-Z0-9]+$/.test(value);
}
function isBotAuthoredEnterpriseEvent(event) {
	return Boolean(normalizeOptionalString(event.bot_id)) || event.subtype === "bot_message";
}
async function resolveSlackAppMentionChannelType(params) {
	const explicitType = normalizeOptionalString(params.mention.channel_type);
	if (explicitType) return normalizeSlackChannelType(explicitType, params.mention.channel);
	const rememberedType = params.ctx.recallSlackChannelType(params.mention.channel, params.eventScope);
	if (rememberedType) return normalizeSlackChannelType(rememberedType, params.mention.channel);
	const resolved = await params.ctx.resolveChannelName(params.mention.channel, params.eventScope).catch(() => ({ type: void 0 }));
	return resolved.type ? normalizeSlackChannelType(resolved.type, params.mention.channel) : void 0;
}
function addUserCandidate(candidates, value, botUserId) {
	const id = normalizeOptionalString(value);
	if (!id || id === botUserId || !isSlackUserId(id)) return;
	candidates.add(id);
}
function collectMetadataUserCandidates(candidates, value, botUserId) {
	const metadata = asOptionalRecord(value);
	const payload = asOptionalRecord(metadata?.event_payload);
	if (!payload) return;
	for (const key of [
		"user",
		"user_id",
		"actor_user_id",
		"author_user_id",
		"slack_user_id"
	]) addUserCandidate(candidates, payload[key], botUserId);
}
function resolveAssistantMessageChangedSender(params) {
	const candidates = /* @__PURE__ */ new Set();
	collectMetadataUserCandidates(candidates, params.message?.metadata, params.botUserId);
	return candidates.size === 1 ? [...candidates][0] : void 0;
}
function isSelfAttributedMessageChange(params) {
	const topUser = normalizeOptionalString(params.event.user);
	const messageUser = normalizeOptionalString(params.message?.user);
	const messageBotId = normalizeOptionalString(params.message?.bot_id);
	return Boolean(params.ctx.botUserId) && (topUser === params.ctx.botUserId || messageUser === params.ctx.botUserId) || Boolean(params.ctx.botId) && messageBotId === params.ctx.botId;
}
function resolveAssistantMessageChangedInbound(params) {
	if (params.event.subtype !== "message_changed") return;
	const changed = params.event;
	const message = asOptionalRecord(changed.message);
	if (!message || !isSelfAttributedMessageChange({
		event: changed,
		message,
		ctx: params.ctx
	})) return;
	if (normalizeSlackChannelType(normalizeOptionalString(changed.channel_type), changed.channel) !== "im") return;
	const senderId = resolveAssistantMessageChangedSender({
		message,
		botUserId: params.ctx.botUserId
	});
	if (!senderId) {
		if (shouldLogVerbose()) logVerbose(`slack: assistant_app_thread message_changed in DM channel=${changed.channel} dropped: no sender resolved from metadata`);
		return;
	}
	return {
		type: "message",
		channel: changed.channel ?? params.event.channel,
		channel_type: "im",
		user: senderId,
		text: normalizeOptionalString(message.text),
		ts: normalizeOptionalString(message.ts) ?? normalizeOptionalString(changed.event_ts),
		thread_ts: normalizeOptionalString(message.thread_ts),
		event_ts: changed.event_ts,
		assistant_thread: asOptionalRecord(message.assistant_thread) ?? asOptionalRecord(changed.assistant_thread),
		files: Array.isArray(message.files) ? message.files : void 0,
		attachments: Array.isArray(message.attachments) ? message.attachments : void 0,
		blocks: Array.isArray(message.blocks) ? message.blocks : void 0
	};
}
function registerSlackMessageEvents(params) {
	const { ctx, handleSlackMessage } = params;
	const resolveEventScope = (args) => resolveSlackListenerEventScope$1({
		identity: ctx.installationIdentity,
		body: args.body,
		context: args.context,
		client: args.client,
		clientOptions: ctx.app.webClientOptions,
		onDrop: (reason) => logVerbose(`slack: drop event (${reason})`)
	});
	const noteConversationMessage = (message, eventScope) => {
		noteSlackDraftConversationMessage({
			accountId: ctx.accountId,
			teamId: eventScope?.teamId,
			channelId: message.channel,
			threadTs: message.thread_ts,
			messageTs: message.ts ?? message.event_ts,
			userId: normalizeOptionalString(message.user),
			botUserId: ctx.botUserId,
			botId: normalizeOptionalString(message.bot_id),
			subtype: "subtype" in message ? normalizeOptionalString(message.subtype) : void 0
		});
	};
	const handleIncomingMessageEvent = async ({ event, body, context, client }) => {
		const turnAdoptionLifecycle = resolveSlackIngressTurnLifecycle(context);
		try {
			const eventScope = resolveEventScope({
				body,
				context,
				client
			});
			if (eventScope === null) return;
			if (ctx.shouldDropMismatchedSlackEvent(body)) return;
			const message = event;
			ctx.rememberSlackChannelType(message.channel, message.channel_type, eventScope);
			const assistantChangedInbound = resolveAssistantMessageChangedInbound({
				event: message,
				ctx
			});
			if (assistantChangedInbound) {
				noteConversationMessage(assistantChangedInbound, eventScope);
				await handleSlackMessage(assistantChangedInbound, {
					source: "message",
					eventScope,
					...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
					...eventScope || turnAdoptionLifecycle ? { awaitDispatch: true } : {}
				});
				return;
			}
			if (message.subtype === "message_changed" && isSelfAttributedMessageChange({
				event: message,
				message: asOptionalRecord(message.message),
				ctx
			})) return;
			const subtypeHandler = resolveSlackMessageSubtypeHandler(message);
			if (subtypeHandler) {
				const ingressContext = await authorizeAndResolveSlackSystemEventContext({
					ctx,
					senderId: subtypeHandler.resolveSenderId(message),
					channelId: message.channel,
					threadTs: subtypeHandler.resolveThreadTs(message),
					eventKind: subtypeHandler.eventKind,
					eventScope
				});
				if (!ingressContext) return;
				enqueueRoutedSystemEvent(subtypeHandler.describe(ingressContext.channelLabel), ingressContext.route, { contextKey: `${subtypeHandler.contextKey(message)}:${body.event_id}` });
				return;
			}
			noteConversationMessage(message, eventScope);
			await handleSlackMessage(message, {
				source: "message",
				eventScope,
				...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
				...eventScope || turnAdoptionLifecycle ? { awaitDispatch: true } : {}
			});
		} catch (err) {
			if (turnAdoptionLifecycle) throw err;
			ctx.runtime.error?.(danger(`slack handler failed: ${formatErrorMessage(err)}`));
		}
	};
	ctx.app.event("message", async (args) => {
		await handleIncomingMessageEvent(args);
	});
	ctx.app.event("app_mention", async (args) => {
		const { event, body, context, client } = args;
		const turnAdoptionLifecycle = resolveSlackIngressTurnLifecycle(context);
		try {
			const eventScope = resolveEventScope({
				body,
				context,
				client
			});
			if (eventScope === null) return;
			if (ctx.shouldDropMismatchedSlackEvent(body)) return;
			const mention = event;
			if (eventScope && isBotAuthoredEnterpriseEvent(mention)) {
				logVerbose("slack: drop enterprise bot-authored app_mention");
				return;
			}
			const channelType = await resolveSlackAppMentionChannelType({
				ctx,
				mention,
				eventScope
			});
			if (!channelType) {
				logVerbose(`slack: drop typeless app_mention channel=${mention.channel} (conversation type unresolved; waiting for message event)`);
				return;
			}
			if (channelType === "im" || channelType === "mpim") return;
			slackInboundLog.info(formatSlackInboundLogLine({
				workspaceId: eventScope?.teamId ?? ctx.teamId,
				channelId: mention.channel,
				channelType: channelType ?? "channel",
				userId: normalizeOptionalString(mention.user) ?? "unknown",
				botUserId: ctx.botUserId,
				bodyChars: normalizeOptionalString(mention.text)?.length ?? 0
			}));
			noteConversationMessage(mention, eventScope);
			await handleSlackMessage(mention, {
				source: "app_mention",
				wasMentioned: true,
				eventScope,
				...turnAdoptionLifecycle ? { turnAdoptionLifecycle } : {},
				...eventScope || turnAdoptionLifecycle ? { awaitDispatch: true } : {}
			});
		} catch (err) {
			if (turnAdoptionLifecycle) throw err;
			ctx.runtime.error?.(danger(`slack mention handler failed: ${formatErrorMessage(err)}`));
		}
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/pins.ts
async function handleSlackPinEvent(params) {
	const { ctx, trackEvent, body, context, client, event, eventId, action, contextKeySuffix, errorLabel } = params;
	try {
		const eventScope = resolveSlackListenerEventScope({
			ctx,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		trackEvent?.();
		const payload = event;
		const channelId = payload.channel_id;
		const ingressContext = await authorizeAndResolveSlackSystemEventContext({
			ctx,
			senderId: payload.user,
			channelId,
			eventKind: "pin",
			eventScope
		});
		if (!ingressContext) return;
		const userLabel = (payload.user ? await (eventScope ? ctx.resolveUserName(payload.user, eventScope) : ctx.resolveUserName(payload.user)) : {})?.name ?? payload.user ?? "someone";
		const itemType = payload.item?.type ?? "item";
		const messageId = payload.item?.message?.ts ?? payload.event_ts;
		enqueueRoutedSystemEvent(`Slack: ${userLabel} ${action} a ${itemType} in ${ingressContext.channelLabel}.`, ingressContext.route, { contextKey: `slack:pin:${eventScope ? `${eventScope.teamId}:` : ""}${contextKeySuffix}:${channelId ?? "unknown"}:${messageId ?? "unknown"}:${eventId}` });
	} catch (err) {
		ctx.runtime.error?.(danger(`slack ${errorLabel} handler failed: ${formatErrorMessage(err)}`));
	}
}
function registerSlackPinEvents(params) {
	const { ctx, trackEvent } = params;
	ctx.app.event("pin_added", async (args) => {
		const { event, body, context, client } = args;
		await handleSlackPinEvent({
			ctx,
			trackEvent,
			body,
			context,
			client,
			event,
			eventId: body.event_id,
			action: "pinned",
			contextKeySuffix: "added",
			errorLabel: "pin added"
		});
	});
	ctx.app.event("pin_removed", async (args) => {
		const { event, body, context, client } = args;
		await handleSlackPinEvent({
			ctx,
			trackEvent,
			body,
			context,
			client,
			event,
			eventId: body.event_id,
			action: "unpinned",
			contextKeySuffix: "removed",
			errorLabel: "pin removed"
		});
	});
}
//#endregion
//#region extensions/slack/src/monitor/events/reactions.ts
function shouldEmitSlackReactionNotification(params) {
	const { ctx, event, actorName } = params;
	if (ctx.reactionMode === "off") return false;
	if (ctx.reactionMode === "own") return Boolean(ctx.botUserId && event.item_user === ctx.botUserId);
	if (ctx.reactionMode === "allowlist") {
		const allowList = normalizeAllowListLower(ctx.reactionAllowlist);
		if (allowList.length === 0) return false;
		return allowListMatches({
			allowList,
			teamId: params.eventScope?.teamId ?? ctx.teamId,
			id: event.user,
			name: actorName,
			allowNameMatching: ctx.allowNameMatching
		});
	}
	return ctx.reactionMode === "all";
}
function registerSlackReactionEvents(params) {
	const { ctx, trackEvent } = params;
	const resolveUserName = (userId, eventScope) => eventScope ? ctx.resolveUserName(userId, eventScope) : ctx.resolveUserName(userId);
	const handleReactionEvent = async (event, action, eventScope, eventId) => {
		try {
			const runtimeContext = await params.ctx.readRuntimeContext();
			const item = event.item;
			if (!item || item.type !== "message") return;
			if (runtimeContext.reactionMode === "off") return;
			if (runtimeContext.reactionMode === "own" && (!runtimeContext.botUserId || event.item_user !== runtimeContext.botUserId)) return;
			trackEvent?.();
			const ingressContext = await authorizeAndResolveSlackSystemEventContext({
				ctx: runtimeContext,
				senderId: event.user,
				channelId: item.channel,
				eventKind: "reaction",
				eventScope
			});
			if (!ingressContext) return;
			const actorInfoPromise = event.user ? resolveUserName(event.user, eventScope) : Promise.resolve(void 0);
			const authorInfoPromise = event.item_user ? resolveUserName(event.item_user, eventScope) : Promise.resolve(void 0);
			const [actorInfo, authorInfo] = await Promise.all([actorInfoPromise, authorInfoPromise]);
			if (!shouldEmitSlackReactionNotification({
				ctx: runtimeContext,
				event,
				eventScope,
				actorName: actorInfo?.name
			})) return;
			const actorLabel = actorInfo?.name ?? event.user;
			const emojiLabel = event.reaction ?? "emoji";
			const authorLabel = authorInfo?.name ?? event.item_user;
			const baseText = `Slack reaction ${action}: :${emojiLabel}: by ${actorLabel} in ${ingressContext.channelLabel} msg ${item.ts}`;
			const text = authorLabel ? `${baseText} from ${authorLabel}` : baseText;
			enqueueRoutedSystemEvent(text, ingressContext.route, { contextKey: `slack:reaction:${eventScope ? `${eventScope.teamId}:` : ""}${action}:${item.channel}:${item.ts}:${event.user}:${emojiLabel}:${eventId}` });
		} catch (err) {
			ctx.runtime.error?.(danger(`slack reaction handler failed: ${formatErrorMessage(err)}`));
		}
	};
	ctx.app.event("reaction_added", async (args) => {
		const { event, body, context, client } = args;
		const eventScope = resolveSlackListenerEventScope({
			ctx,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		await handleReactionEvent(event, "added", eventScope, body.event_id);
	});
	ctx.app.event("reaction_removed", async (args) => {
		const { event, body, context, client } = args;
		const eventScope = resolveSlackListenerEventScope({
			ctx,
			body,
			context,
			client
		});
		if (eventScope === null) return;
		if (ctx.shouldDropMismatchedSlackEvent(body)) return;
		await handleReactionEvent(event, "removed", eventScope, body.event_id);
	});
}
//#endregion
//#region extensions/slack/src/monitor/events.ts
function registerSlackCommonEvents(params) {
	registerSlackMessageEvents({
		ctx: params.ctx,
		handleSlackMessage: params.handleSlackMessage
	});
	registerSlackReactionEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
	registerSlackPinEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
	registerSlackMemberEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
	registerSlackChannelEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
	registerSlackInteractionEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
}
function registerSlackWorkspaceEvents(params) {
	registerSlackChannelIdChangedEvent({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
	registerSlackHomeEvents({
		ctx: params.ctx,
		slashCommandName: params.appHomeSlashCommandName,
		trackEvent: params.trackEvent
	});
	registerSlackAgentEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
	registerSlackAssistantEvents({
		ctx: params.ctx,
		trackEvent: params.trackEvent
	});
}
//#endregion
//#region extensions/slack/src/monitor/http-handler.ts
const SLACK_WEBHOOK_MAX_BODY_BYTES = 1048576;
const SLACK_WEBHOOK_BODY_TIMEOUT_MS = 3e4;
function createSlackHttpRequestHandler(params) {
	const inFlightLimiter = createWebhookInFlightLimiter();
	const inFlightKey = `slack:${params.accountId}`;
	return async (req, res) => {
		const lifecycle = beginWebhookRequestPipelineOrReject({
			req,
			res,
			allowMethods: ["POST"],
			inFlightLimiter,
			inFlightKey
		});
		if (!lifecycle.ok) return;
		try {
			const body = await readWebhookBodyOrReject({
				req,
				res,
				maxBytes: SLACK_WEBHOOK_MAX_BODY_BYTES,
				timeoutMs: SLACK_WEBHOOK_BODY_TIMEOUT_MS,
				profile: "pre-auth"
			});
			if (!body.ok) return;
			Object.assign(req, { rawBody: Buffer.from(body.value) });
			params.receiver.requestListener(req, res);
			await finished(res, { cleanup: true }).catch(() => void 0);
		} finally {
			lifecycle.release();
		}
	};
}
//#endregion
//#region extensions/slack/src/monitor/message-dispatch-dedupe.ts
const SLACK_MESSAGE_DISPATCH_DEDUPE_TTL_MS = 864e5;
const SLACK_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES = 2e4;
const SLACK_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES = 2e4;
const SLACK_MESSAGE_DISPATCH_DEDUPE_NAMESPACE = "global";
const SLACK_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX = "slack.message-dispatch-dedupe";
const SLACK_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID = "slack-message-dispatch-dedupe";
var SlackMessageDispatchRetryError = class extends Error {
	constructor(cause) {
		super("Slack dispatch owner released while its twin was waiting", { cause });
	}
};
function buildSlackMessageDispatchReplayKey(params) {
	const channelId = params.channelId?.trim();
	const ts = params.ts?.trim();
	if (!channelId || !ts) return null;
	const teamId = params.teamId?.trim();
	return JSON.stringify([
		"message",
		params.accountId,
		teamId ?? "",
		channelId,
		ts
	]);
}
function createSlackMessageDispatchReplayGuard(params = {}) {
	return createChannelReplayGuard({
		dedupe: {
			ttlMs: SLACK_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
			memoryMaxSize: SLACK_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES,
			pluginId: SLACK_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
			namespacePrefix: SLACK_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
			stateMaxEntries: SLACK_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
			...params.onDiskError ? { onDiskError: params.onDiskError } : {}
		},
		buildReplayKey: (event) => event.keys,
		namespace: () => SLACK_MESSAGE_DISPATCH_DEDUPE_NAMESPACE
	});
}
/** Claim one logical message key; an in-flight sibling claim settles to duplicate. */
async function claimSlackMessageDispatchReplay(params) {
	const claim = await runClaimableDedupeClaimLoop(async () => {
		const next = await params.guard.claim({ keys: [params.key] });
		if (next.kind === "inflight") params.onWaiting?.();
		return next;
	}, (error, rejectionCount) => {
		if (params.onWaiting) throw new SlackMessageDispatchRetryError(error);
		return rejectionCount <= 1;
	});
	return claim.kind === "claimed" ? {
		kind: "claimed",
		handle: claim.handle
	} : { kind: "duplicate" };
}
//#endregion
//#region extensions/slack/src/monitor/message-handler/debounce-key.ts
function resolveSlackSenderId(message) {
	return message.user ?? message.bot_id ?? null;
}
function isSlackDirectMessageChannel(channelId) {
	return channelId.startsWith("D");
}
function isTopLevelSlackMessage(message) {
	return !message.thread_ts && !message.parent_user_id;
}
function buildTopLevelSlackConversationKey(message, accountId, teamId) {
	if (!isTopLevelSlackMessage(message)) return null;
	const senderId = resolveSlackSenderId(message);
	if (!senderId) return null;
	return `slack:${accountId}:${teamId ? `${teamId}:` : ""}${message.channel}:${senderId}`;
}
function buildSlackDebounceKey(message, accountId, teamId) {
	const senderId = resolveSlackSenderId(message);
	if (!senderId) return null;
	const messageTs = message.ts ?? message.event_ts;
	const threadKey = message.thread_ts ? `${message.channel}:${message.thread_ts}` : message.parent_user_id && messageTs ? `${message.channel}:maybe-thread:${messageTs}` : messageTs && !isSlackDirectMessageChannel(message.channel) ? `${message.channel}:${messageTs}` : message.channel;
	return `slack:${accountId}:${teamId ? `${teamId}:` : ""}${threadKey}:${senderId}`;
}
//#endregion
//#region extensions/slack/src/monitor/message-handler.ts
const loadSlackMessagePipeline = createLazyRuntimeModule(() => import("./pipeline.runtime-BlPOexmJ.mjs"));
const RETRYABLE_FLUSH_MAX_ATTEMPTS = 3;
const RETRYABLE_FLUSH_RETRY_DELAY_MS = 1e3;
const REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE = /reply session initialization conflicted for \S+/u;
function isRetryableSlackInboundError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).some((candidate) => candidate instanceof SlackMessageDispatchRetryError || REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE.test(formatErrorMessage(candidate)));
}
function shouldDebounceSlackMessage(message, cfg) {
	const textForCommandDetection = stripSlackMentionsForCommandDetection(message.text ?? "");
	return shouldDebounceTextInbound({
		text: textForCommandDetection,
		cfg,
		hasMedia: Boolean(message.files && message.files.length > 0) || hasSlackMessageTableBlock(message)
	});
}
function createSlackMessageHandler(params) {
	const { ctx, trackEvent, onPrepared } = params;
	const readConfig = createRuntimeConfigReader(ctx.cfg);
	const dispatchReplayGuard = params.dispatchReplayGuard ?? createSlackMessageDispatchReplayGuard({ onDiskError: (error) => ctx.runtime.error?.(`slack message dispatch dedupe persistence failed: ${formatErrorMessage(error)}`) });
	const { debouncer } = createChannelInboundDebouncer({
		cfg: ctx.cfg,
		channel: "slack",
		serializeImmediate: true,
		resolveDebounceMs: (entry) => entry.debounceMs,
		buildKey: (entry) => buildSlackDebounceKey(entry.message, ctx.accountId, entry.opts.eventScope?.teamId),
		shouldDebounce: (entry) => !entry.retry && !entry.opts.eventScope && shouldDebounceSlackMessage(entry.message, ctx.cfg),
		onFlush: (entries, createFlush) => createFlush({
			lifecycle: { abortSignal: AbortSignal.any([params.abortSignal, ...entries.map((entry) => entry.opts.turnAdoptionLifecycle?.abortSignal)].filter((signal) => signal !== void 0)) },
			dispatch: async (admissionLifecycle) => {
				const completions = entries.map((entry) => entry.opts.dispatchCompletion).filter((completion) => completion !== void 0);
				const retry = entries.find((entry) => entry.retry)?.retry;
				let admittedContext = retry?.runtimeContext;
				for (let retryAttempt = retry?.attempt ?? 0;; retryAttempt += 1) try {
					const runtimeContext = admittedContext ??= await ctx.readRuntimeContext();
					admissionLifecycle.abortSignal.throwIfAborted();
					await (async () => {
						const flushedEntry = entries.at(-1);
						if (flushedEntry) {
							const teamId = flushedEntry.opts.eventScope?.teamId;
							const flushedKey = buildSlackDebounceKey(flushedEntry.message, ctx.accountId, teamId);
							const topLevelConversationKey = buildTopLevelSlackConversationKey(flushedEntry.message, ctx.accountId, teamId);
							if (flushedKey && topLevelConversationKey) {
								const pendingKeys = pendingTopLevelDebounceKeys.get(topLevelConversationKey);
								if (pendingKeys) {
									pendingKeys.delete(flushedKey);
									if (pendingKeys.size === 0) pendingTopLevelDebounceKeys.delete(topLevelConversationKey);
								}
							}
						}
						const claims = [];
						const releaseClaims = (error) => {
							for (const handle of claims) handle.release(error === void 0 ? {} : { error });
						};
						const claimedKeys = /* @__PURE__ */ new Map();
						const surviving = [];
						let latestSurviving;
						for (const entry of entries) {
							const replayKey = buildSlackMessageDispatchReplayKey({
								accountId: ctx.accountId,
								channelId: entry.message.channel,
								ts: entry.message.ts,
								teamId: entry.opts.eventScope?.teamId
							});
							if (!replayKey) {
								surviving.push(entry);
								latestSurviving = entry;
								continue;
							}
							const existingIndex = claimedKeys.get(replayKey);
							if (existingIndex !== void 0) {
								const existing = surviving[existingIndex];
								const merged = {
									...entry,
									opts: {
										...entry.opts,
										...existing?.opts.source === "app_mention" ? { source: "app_mention" } : {},
										...existing?.opts.wasMentioned ? { wasMentioned: true } : {}
									}
								};
								surviving[existingIndex] = merged;
								latestSurviving = merged;
								continue;
							}
							const claim = await claimSlackMessageDispatchReplay({
								guard: dispatchReplayGuard,
								key: replayKey,
								onWaiting: () => {
									entry.opts.turnAdoptionLifecycle?.onDispatchWaiting?.();
									admissionLifecycle.onDeferred();
								}
							}).catch((error) => {
								releaseClaims(error);
								throw error;
							});
							if (claim.kind === "claimed") {
								claims.push(claim.handle);
								claimedKeys.set(replayKey, surviving.length);
								surviving.push(entry);
								latestSurviving = entry;
							}
						}
						const commitClaims = async () => {
							for (const handle of claims) await handle.commit();
						};
						const last = latestSurviving;
						if (!last) {
							releaseClaims();
							return;
						}
						const combinedText = surviving.length === 1 ? last.message.text ?? "" : surviving.map((entry) => entry.message.text ?? "").filter(Boolean).join("\n");
						const combinedMentioned = surviving.some((entry) => Boolean(entry.opts.wasMentioned));
						const syntheticMessage = {
							...last.message,
							text: combinedText
						};
						const { dispatchCompletion: _completion, awaitDispatch: _awaitDispatch, turnAdoptionLifecycle, ...lastOpts } = last.opts;
						let visibleDrop = false;
						let settlementHandedOff = false;
						try {
							admissionLifecycle.abortSignal.throwIfAborted();
							const { prepareSlackMessage, dispatchPreparedSlackMessage } = await loadSlackMessagePipeline();
							admissionLifecycle.abortSignal.throwIfAborted();
							const prepared = await prepareSlackMessage({
								ctx: runtimeContext,
								account: resolveSlackAccount({
									cfg: runtimeContext.cfg,
									accountId: ctx.accountId
								}),
								message: syntheticMessage,
								opts: {
									...lastOpts,
									wasMentioned: combinedMentioned || last.opts.wasMentioned,
									sourceMessageIds: surviving.flatMap((entry) => entry.message.ts ? [entry.message.ts] : []),
									abortSignal: admissionLifecycle.abortSignal,
									isRuntimePolicyCurrent: runtimeContext.isRuntimePolicyCurrent,
									onVisibleDrop: () => {
										visibleDrop = true;
									}
								}
							});
							if (!prepared) {
								if (visibleDrop) {
									await commitClaims();
									return;
								}
								releaseClaims();
								return;
							}
							await turnAdoptionLifecycle?.onSessionRouted?.(prepared.route.sessionKey);
							const deferredHeartbeatIntervals = [turnAdoptionLifecycle?.deferredHeartbeatIntervalMs, admissionLifecycle.deferredHeartbeatIntervalMs].filter((interval) => interval !== void 0 && Number.isFinite(interval) && interval > 0);
							prepared.turnAdoptionLifecycle = {
								...turnAdoptionLifecycle,
								admission: turnAdoptionLifecycle?.admission ?? "exclusive",
								abortSignal: turnAdoptionLifecycle?.abortSignal ?? admissionLifecycle.abortSignal,
								onAdopted: async () => {
									settlementHandedOff = true;
									await commitClaims();
									await turnAdoptionLifecycle?.onAdopted();
									await admissionLifecycle.onAdopted();
								},
								onDeferred: () => {
									turnAdoptionLifecycle?.onDeferred();
									if (admissionLifecycle.onDeferred() === false) return false;
									settlementHandedOff = true;
								},
								onDeferredHeartbeat: () => {
									turnAdoptionLifecycle?.onDeferredHeartbeat?.();
									admissionLifecycle.onDeferredHeartbeat?.();
								},
								...deferredHeartbeatIntervals.length > 0 ? { deferredHeartbeatIntervalMs: Math.min(...deferredHeartbeatIntervals) } : {},
								onAbandoned: () => {
									settlementHandedOff = true;
									releaseClaims();
									turnAdoptionLifecycle?.onAbandoned();
									admissionLifecycle.onAbandoned();
								}
							};
							onPrepared?.(prepared);
							if (surviving.length > 1) {
								const ids = surviving.map((entry) => entry.message.ts).filter(Boolean);
								if (ids.length > 0) {
									prepared.ctxPayload.MessageSids = ids;
									prepared.ctxPayload.MessageSidFirst = ids[0];
									prepared.ctxPayload.MessageSidLast = ids[ids.length - 1];
								}
							}
							await dispatchPreparedSlackMessage(prepared);
							if (!turnAdoptionLifecycle && !settlementHandedOff) await commitClaims();
							else if (!settlementHandedOff) releaseClaims();
						} catch (error) {
							releaseClaims(error);
							throw error;
						}
					})();
					for (const completion of completions) completion.resolve();
					break;
				} catch (error) {
					const runtimeContext = admittedContext;
					if (runtimeContext && retryAttempt < RETRYABLE_FLUSH_MAX_ATTEMPTS && isRetryableSlackInboundError(error) && !entries.some((entry) => entry.opts.eventScope || entry.opts.dispatchCompletion)) {
						await sleepWithAbort(RETRYABLE_FLUSH_RETRY_DELAY_MS, admissionLifecycle.abortSignal);
						if (error instanceof SlackMessageDispatchRetryError) {
							await Promise.all(entries.map((entry) => debouncer.enqueue({
								...entry,
								retry: {
									attempt: retryAttempt + 1,
									runtimeContext
								}
							})));
							return;
						}
						continue;
					}
					for (const completion of completions) completion.reject(error);
					throw error;
				}
			}
		}),
		onError: (err) => {
			ctx.runtime.error?.(`slack inbound debounce flush failed: ${formatErrorMessage(err)}`);
		}
	});
	const threadTsResolvers = /* @__PURE__ */ new WeakMap();
	const pendingTopLevelDebounceKeys = /* @__PURE__ */ new Map();
	async function enqueueSlackMessage(message, opts) {
		if (opts.source === "message" && message.type !== "message") return;
		if (opts.source === "message" && message.subtype && message.subtype !== "file_share" && message.subtype !== "bot_message" && message.subtype !== "thread_broadcast") return;
		ctx.rememberSlackChannelType(message.channel, message.channel_type, opts.eventScope);
		trackEvent?.();
		const client = opts.eventScope?.client ?? ctx.app.client;
		let threadTsResolver = threadTsResolvers.get(client);
		if (!threadTsResolver) {
			threadTsResolver = createSlackThreadTsResolver({ client });
			threadTsResolvers.set(client, threadTsResolver);
		}
		const resolvedMessage = await threadTsResolver.resolve({
			message,
			source: opts.source,
			...opts.turnAdoptionLifecycle ? { turnAdoptionLifecycle: opts.turnAdoptionLifecycle } : {}
		});
		const teamId = opts.eventScope?.teamId;
		const debounceKey = buildSlackDebounceKey(resolvedMessage, ctx.accountId, teamId);
		const conversationKey = buildTopLevelSlackConversationKey(resolvedMessage, ctx.accountId, teamId);
		const debounceMs = resolveInboundDebounceMs({
			cfg: readConfig(),
			channel: "slack"
		});
		const canDebounce = !opts.eventScope && debounceMs > 0 && shouldDebounceSlackMessage(resolvedMessage, ctx.cfg);
		if (!canDebounce && conversationKey) {
			const pendingKeys = pendingTopLevelDebounceKeys.get(conversationKey);
			if (pendingKeys && pendingKeys.size > 0) {
				const keysToFlush = Array.from(pendingKeys);
				for (const pendingKey of keysToFlush) await debouncer.flushKey(pendingKey);
			}
		}
		if (canDebounce && debounceKey && conversationKey) {
			const pendingKeys = pendingTopLevelDebounceKeys.get(conversationKey) ?? /* @__PURE__ */ new Set();
			pendingKeys.add(debounceKey);
			pendingTopLevelDebounceKeys.set(conversationKey, pendingKeys);
		}
		const dispatchCompletion = opts.awaitDispatch ? createDeferred() : void 0;
		await debouncer.enqueue({
			debounceMs,
			message: resolvedMessage,
			opts: {
				...opts,
				...dispatchCompletion ? { dispatchCompletion: {
					resolve: dispatchCompletion.resolve,
					reject: dispatchCompletion.reject
				} } : {}
			}
		});
		return dispatchCompletion;
	}
	return async (message, opts) => {
		await (await enqueueSlackMessage(message, opts))?.promise;
	};
}
//#endregion
//#region extensions/slack/src/monitor/presence-monitor.ts
const SLACK_PRESENCE_GREETING_COOLDOWN_MS = 288e5;
const SLACK_PRESENCE_REQUEST_TIMEOUT_MS = 3e4;
const SLACK_PRESENCE_POLL_INTERVAL_MS = 6e4;
const SLACK_PRESENCE_AUTO_MAX_PARTICIPANTS = 8;
const SLACK_PRESENCE_TARGET_TTL_MS = 864e5;
const SLACK_PRESENCE_MAX_POLLS_PER_INTERVAL = 45;
const SLACK_PRESENCE_MAX_TARGETS = 2e3;
const DEFAULT_SLACK_PRESENCE_EVENT_PROMPT = ["Before greeting, retrieve relevant memory and wiki context for this immutable user_id, including a known timezone when available. Use their local time; if their timezone is unknown, do not guess.", "Send at most one short, natural greeting in this Slack conversation. Do not reveal private memory. If no greeting is appropriate, stay silent."];
function resolveMode(channelConfig, accountConfig) {
	return channelConfig?.mode ?? accountConfig?.mode ?? "off";
}
function resolvePrompt(channelConfig, accountConfig) {
	return channelConfig?.prompt ?? accountConfig?.prompt;
}
function hasSlackPresenceEventsEnabled(params) {
	if (resolveMode(void 0, params.account) !== "off") return true;
	return Object.values(params.channels ?? {}).some((entry) => resolveMode(entry?.presenceEvents, void 0) !== "off");
}
function isTargetEligible(target) {
	if (target.mode === "on") return true;
	if (target.autoEligibleKind === "channel") return false;
	return target.participants.size <= SLACK_PRESENCE_AUTO_MAX_PARTICIPANTS;
}
function formatSlackPresenceEvent(target, userId, awayObservation) {
	const { observedAwayAtMs, observedActiveAtMs } = awayObservation;
	const observedAwayDurationMs = Math.max(0, observedActiveAtMs - observedAwayAtMs);
	const promptLines = target.prompt === void 0 ? DEFAULT_SLACK_PRESENCE_EVENT_PROMPT : target.prompt.length > 0 ? [target.prompt] : [];
	return [
		"Slack presence event:",
		`A human participant became active on Slack after being observed away: user_id=${JSON.stringify(userId)}${target.teamId ? ` team_id=${JSON.stringify(target.teamId)}` : ""} channel_id=${JSON.stringify(target.channelId)}${target.threadId ? ` thread_ts=${JSON.stringify(target.threadId)}` : ""}.`,
		`observed_away_at_ms=${observedAwayAtMs} observed_active_at_ms=${observedActiveAtMs} observed_away_duration_ms=${observedAwayDurationMs}`,
		...promptLines
	].join("\n");
}
function resolveObservedTarget(params) {
	const { prepared } = params;
	const userId = prepared.message.user?.trim();
	if (!userId || prepared.message.bot_id || prepared.message.subtype === "bot_message") return null;
	const mode = resolveMode(prepared.channelConfig?.presenceEvents, params.accountConfig);
	if (mode === "off") return null;
	const channelId = prepared.message.channel;
	const rawThreadId = prepared.ctxPayload.MessageThreadId ?? prepared.ctxPayload.TransportThreadId ?? void 0;
	const threadId = rawThreadId === void 0 ? void 0 : String(rawThreadId);
	const channelType = prepared.message.channel_type;
	const autoEligibleKind = prepared.isDirectMessage ? "direct" : channelType === "mpim" ? "group" : threadId ? "thread" : "channel";
	if (mode === "auto" && autoEligibleKind === "channel") return null;
	const targetSuffix = threadId ? `:thread:${threadId}` : ":top";
	const teamId = prepared.eventScope?.teamId;
	const targetKind = prepared.isDirectMessage ? "user" : "channel";
	const targetId = prepared.isDirectMessage ? userId : channelId;
	return {
		key: `${teamId ? `team:${teamId}:` : ""}${channelId}${targetSuffix}`,
		...teamId ? { teamId } : {},
		mode,
		prompt: resolvePrompt(prepared.channelConfig?.presenceEvents, params.accountConfig),
		channelId,
		threadId,
		to: formatSlackTarget({
			teamId,
			kind: targetKind,
			id: targetId,
			explicitKind: true
		}),
		sessionKey: prepared.route.sessionKey,
		agentId: prepared.route.agentId,
		isPolicyCurrent: prepared.ctx.isRuntimePolicyCurrent,
		participants: /* @__PURE__ */ new Map([[userId, params.nowMs]]),
		lastActivityAtMs: params.nowMs,
		autoEligibleKind
	};
}
function createSlackPresenceMonitor(params) {
	const resolveClient = params.resolveClient ?? (() => params.client);
	if (!params.client && !params.resolveClient) throw new Error("Slack presence monitor requires a client or client resolver");
	const targets = /* @__PURE__ */ new Map();
	const presenceByUser = /* @__PURE__ */ new Map();
	const nowMs = params.nowMs ?? Date.now;
	const enqueue = params.enqueue ?? enqueueRoutedSystemEvent;
	const wake = params.wake ?? requestHeartbeat;
	let pollOffset = 0;
	let timer;
	let activePoll;
	const rateLimitedUntilByWorkspace = /* @__PURE__ */ new Map();
	let stopped = false;
	const pruneTargets = (now) => {
		for (const [key, target] of targets) if (!target.isPolicyCurrent() || now - target.lastActivityAtMs >= SLACK_PRESENCE_TARGET_TTL_MS) targets.delete(key);
		while (targets.size > SLACK_PRESENCE_MAX_TARGETS) {
			const oldestKey = targets.keys().next().value;
			if (typeof oldestKey !== "string") break;
			targets.delete(oldestKey);
		}
		const eligibleUsers = new Set(Array.from(targets.values()).filter(isTargetEligible).flatMap((target) => Array.from(target.participants.keys()).map((userId) => presenceSubjectKey({
			teamId: target.teamId,
			userId
		}))));
		for (const userId of presenceByUser.keys()) if (!eligibleUsers.has(userId)) presenceByUser.delete(userId);
	};
	const observe = (prepared) => {
		const now = nowMs();
		pruneTargets(now);
		const observed = resolveObservedTarget({
			prepared,
			accountConfig: params.accountConfig,
			nowMs: now
		});
		if (!observed || !observed.isPolicyCurrent()) return;
		const current = targets.get(observed.key);
		if (current) {
			current.mode = observed.mode;
			current.prompt = observed.prompt;
			current.sessionKey = observed.sessionKey;
			current.agentId = observed.agentId;
			current.to = observed.to;
			current.lastActivityAtMs = now;
			for (const [participant, observedAt] of observed.participants) current.participants.set(participant, observedAt);
			targets.delete(observed.key);
			targets.set(observed.key, current);
		} else targets.set(observed.key, observed);
		pruneTargets(now);
	};
	const emitTransition = async (subject, awayObservation) => {
		const { teamId, userId } = subject;
		const resolveTarget = () => Array.from(targets.values()).filter((candidate) => candidate.teamId === teamId && candidate.participants.has(userId) && isTargetEligible(candidate)).toSorted((a, b) => (b.participants.get(userId) ?? 0) - (a.participants.get(userId) ?? 0))[0];
		if (!resolveTarget()) return;
		const workspaceKey = teamId ?? "workspace";
		const cooldownKey = `${params.accountId}:${workspaceKey}:${userId}`;
		const now = awayObservation.observedActiveAtMs;
		let reserved;
		try {
			reserved = await params.cooldownStore.registerIfAbsent(cooldownKey, now, { ttlMs: SLACK_PRESENCE_GREETING_COOLDOWN_MS });
		} catch (err) {
			params.error?.(`slack presence cooldown persistence failed: ${String(err)}`);
			return;
		}
		if (!reserved) return;
		pruneTargets(nowMs());
		const target = stopped ? void 0 : resolveTarget();
		if (!target) {
			await params.cooldownStore.deleteIfEqual?.(cooldownKey, now);
			return;
		}
		if (!enqueue(formatSlackPresenceEvent(target, userId, awayObservation), target, {
			contextKey: `slack:presence-active:${params.accountId}:${workspaceKey}:${userId}`,
			deliveryContext: {
				channel: "slack",
				to: target.to,
				accountId: params.accountId,
				threadId: target.threadId
			}
		})) {
			await params.cooldownStore.deleteIfEqual?.(cooldownKey, now);
			return;
		}
		wake({
			source: "notifications-event",
			intent: "immediate",
			reason: "wake",
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			heartbeat: {
				target: "slack",
				to: target.to,
				accountId: params.accountId
			}
		});
	};
	const performPoll = async () => {
		const now = nowMs();
		pruneTargets(now);
		const candidatesByKey = /* @__PURE__ */ new Map();
		for (const target of targets.values()) {
			if (!isTargetEligible(target)) continue;
			for (const userId of target.participants.keys()) {
				const subject = {
					teamId: target.teamId,
					userId
				};
				candidatesByKey.set(presenceSubjectKey(subject), subject);
			}
		}
		const candidates = Array.from(candidatesByKey.entries()).toSorted(([left], [right]) => left.localeCompare(right)).map(([, subject]) => subject);
		if (candidates.length === 0) return;
		const count = Math.min(candidates.length, SLACK_PRESENCE_MAX_POLLS_PER_INTERVAL);
		const selected = Array.from({ length: count }, (_, index) => candidates[(pollOffset + index) % candidates.length]).filter((subject) => Boolean(subject));
		for (const subject of selected) {
			if (stopped) return;
			const { teamId, userId } = subject;
			const workspaceKey = teamId ?? "workspace";
			const rateLimitedUntilMs = rateLimitedUntilByWorkspace.get(workspaceKey) ?? 0;
			if (rateLimitedUntilMs > now) continue;
			rateLimitedUntilByWorkspace.delete(workspaceKey);
			let consumed = false;
			try {
				const client = resolveClient(teamId);
				if (!client) throw new Error("Slack presence client is unavailable");
				const response = await withTimeout(client.getPresence({ user: userId }), SLACK_PRESENCE_REQUEST_TIMEOUT_MS, { message: `Slack presence request timed out after ${SLACK_PRESENCE_REQUEST_TIMEOUT_MS}ms` });
				if (stopped) return;
				consumed = true;
				const next = response.presence === "active" || response.presence === "away" ? response.presence : void 0;
				if (!next) continue;
				const subjectKey = presenceSubjectKey(subject);
				const previous = presenceByUser.get(subjectKey);
				const observedAtMs = nowMs();
				const observation = next === "away" ? previous?.presence === "away" ? previous : {
					presence: "away",
					firstObservedAtMs: observedAtMs
				} : { presence: "active" };
				presenceByUser.set(subjectKey, observation);
				if (previous?.presence === "away" && next === "active") await emitTransition(subject, {
					observedAwayAtMs: previous.firstObservedAtMs,
					observedActiveAtMs: observedAtMs
				});
			} catch (err) {
				if (stopped) return;
				if (err instanceof WebAPIRateLimitedError) {
					rateLimitedUntilByWorkspace.set(workspaceKey, Math.max(rateLimitedUntilMs, nowMs() + Math.max(0, err.retryAfter) * 1e3));
					params.error?.(`slack presence polling rate limited; retrying after ${err.retryAfter}s`);
					continue;
				}
				consumed = true;
				params.error?.(`slack presence poll failed for workspace ${workspaceKey} user ${userId}: ${String(err)}`);
			} finally {
				if (consumed) pollOffset = (pollOffset + 1) % candidates.length;
			}
		}
	};
	const pollOnce = () => {
		if (stopped) return Promise.resolve();
		if (activePoll) return activePoll;
		const run = performPoll().finally(() => {
			if (activePoll === run) activePoll = void 0;
		});
		activePoll = run;
		return run;
	};
	return {
		observe,
		pollOnce,
		start: () => {
			if (timer) return;
			stopped = false;
			params.log?.(`slack presence polling enabled for account ${params.accountId}`);
			timer = setInterval(() => void pollOnce(), SLACK_PRESENCE_POLL_INTERVAL_MS);
			timer.unref?.();
		},
		stop: async () => {
			stopped = true;
			if (timer) {
				clearInterval(timer);
				timer = void 0;
			}
			await activePoll;
		}
	};
}
function presenceSubjectKey(subject) {
	return `${subject.teamId ?? "workspace"}:${subject.userId}`;
}
//#endregion
//#region extensions/slack/src/monitor/presence-cooldown-store.ts
const SLACK_PRESENCE_COOLDOWN_MAX_ENTRIES = 25e3;
function openSlackPresenceCooldownStore() {
	return getSlackRuntime().state.openKeyedStore({
		namespace: "presence-greeting-cooldowns",
		maxEntries: SLACK_PRESENCE_COOLDOWN_MAX_ENTRIES,
		overflowPolicy: "reject-new",
		defaultTtlMs: SLACK_PRESENCE_GREETING_COOLDOWN_MS
	});
}
//#endregion
//#region extensions/slack/src/monitor/provider.ts
let slackBoltInterop;
function withSlackPresenceLifecycleSignal(fetchImpl, lifecycleSignal) {
	return async (input, init) => await fetchImpl(input, {
		...init,
		signal: init?.signal ? AbortSignal.any([init.signal, lifecycleSignal]) : lifecycleSignal
	});
}
async function getSlackBoltInterop() {
	if (!slackBoltInterop) {
		const slackBoltModule = await import("@slack/bolt");
		slackBoltInterop = resolveSlackBoltInterop({
			defaultImport: slackBoltModule.default,
			namespaceImport: slackBoltModule
		});
	}
	return slackBoltInterop;
}
const loadSlackRelaySource = createLazyRuntimeModule(() => import("./relay-source-DfOnjJTE.mjs"));
function resolveSlackRuntimeIdentity(params) {
	const botUserId = normalizeOptionalString(params.botUserId);
	const botId = normalizeOptionalString(params.botId);
	if (!botUserId || params.identity === "bot" && !botId) return;
	return {
		botUserId,
		...botId ? { botId } : {}
	};
}
function applySlackInstallationIdentity(ctx, identity) {
	ctx.installationIdentity = identity;
	ctx.teamId = identity.kind === "workspace" ? identity.teamId : "";
	ctx.apiAppId = identity.kind === "degraded" ? "" : identity.apiAppId ?? "";
}
function adoptSlackIdentity(params) {
	if (params.ctx.identityHealth.lifecycle !== "blocked" || params.installationIdentity.kind === "degraded") return false;
	const resolved = resolveSlackRuntimeIdentity(params);
	if (!resolved) return false;
	applySlackInstallationIdentity(params.ctx, params.installationIdentity);
	params.ctx.botUserId = resolved.botUserId;
	params.ctx.botId = resolved.botId;
	params.ctx.identityHealth = resolveSlackIdentityHealth({
		installationIdentity: params.installationIdentity,
		botUserId: resolved.botUserId
	});
	return true;
}
function formatSlackSocketReconnectMessage(params) {
	const suffix = params.error ? ` (${formatUnknownError(params.error)})` : "";
	return `slack socket disconnected (${params.event}); reconnecting in ${Math.round(params.delayMs / 1e3)}s (attempt ${params.attempt}/∞)${suffix}`;
}
function formatSlackSocketStartRetryMessage(params) {
	const reason = formatUnknownError(params.error, "Slack Socket Mode start failed without error detail");
	const sdkContext = params.sdkContext?.trim() ? `; last SDK log: ${params.sdkContext.trim()}` : "";
	return `slack socket mode failed to start; retry ${params.attempt}/∞ in ${Math.round(params.delayMs / 1e3)}s reason="${reason}${sdkContext}"`;
}
function parseApiAppIdFromAppToken(raw) {
	const token = raw?.trim();
	if (!token) return;
	return /^xapp-\d-([a-z0-9]+)-/i.exec(token)?.[1]?.toUpperCase();
}
function resolveSlackRelayConfig(params) {
	const relay = asNonArrayRecord(params.relay);
	const url = normalizeOptionalString(relay.url);
	const authToken = normalizeResolvedSecretInputString({
		value: relay.authToken,
		path: `channels.slack.accounts.${params.accountId}.relay.authToken`
	});
	const gatewayId = normalizeOptionalString(relay.gatewayId);
	if (!url || !authToken || !gatewayId) throw new Error(`Slack relay mode requires relay.url, relay.authToken, and relay.gatewayId for account "${params.accountId}".`);
	return {
		url,
		authToken,
		gatewayId
	};
}
async function monitorSlackProvider(opts = {}) {
	const cfg = opts.config ?? getRuntimeConfig();
	const runtime = opts.runtime ?? createNonExitingRuntime();
	const account = resolveSlackAccount({
		cfg,
		accountId: opts.accountId
	});
	if (!account.enabled) {
		runtime.log?.(`[${account.accountId}] slack account disabled; monitor startup skipped`);
		if (opts.abortSignal?.aborted) return;
		await new Promise((resolve) => {
			opts.abortSignal?.addEventListener("abort", () => resolve(), { once: true });
		});
		return;
	}
	const slackMode = opts.mode ?? account.config.mode ?? "socket";
	const slackWebhookPath = normalizeSlackWebhookPath(account.config.webhookPath);
	const signingSecret = slackMode === "http" ? normalizeResolvedSecretInputString({
		value: account.config.signingSecret,
		path: `channels.slack.accounts.${account.accountId}.signingSecret`
	}) : void 0;
	const botToken = resolveSlackBotToken(opts.botToken ?? account.botToken);
	const userToken = account.userToken;
	const appToken = resolveSlackAppToken(opts.appToken ?? account.appToken);
	const relayConfig = slackMode === "relay" ? resolveSlackRelayConfig({
		relay: account.config.relay,
		accountId: account.accountId
	}) : void 0;
	let token;
	if (account.identity === "user") {
		if (!userToken) throw new Error(`Slack user token missing for account "${account.accountId}" (set channels.slack.accounts.${account.accountId}.userToken or SLACK_USER_TOKEN for default).`);
		if (slackMode === "socket" && !appToken) throw new Error(`Slack app token missing for user-identity socket mode account "${account.accountId}" (set channels.slack.accounts.${account.accountId}.appToken or SLACK_APP_TOKEN for default).`);
		if (slackMode === "http" && !signingSecret) throw new Error(`Slack signing secret missing for user-identity HTTP mode account "${account.accountId}" (set channels.slack.signingSecret or channels.slack.accounts.${account.accountId}.signingSecret).`);
		token = userToken;
	} else {
		if (!botToken || slackMode === "socket" && !appToken) {
			const missing = slackMode === "http" ? `Slack bot token missing for account "${account.accountId}" (set channels.slack.accounts.${account.accountId}.botToken or SLACK_BOT_TOKEN for default).` : slackMode === "relay" ? `Slack bot token missing for account "${account.accountId}" (set channels.slack.accounts.${account.accountId}.botToken or SLACK_BOT_TOKEN for default).` : `Slack bot + app tokens missing for account "${account.accountId}" (set channels.slack.accounts.${account.accountId}.botToken/appToken or SLACK_BOT_TOKEN/SLACK_APP_TOKEN for default).`;
			throw new Error(missing);
		}
		if (slackMode === "http" && !signingSecret) throw new Error(`Slack signing secret missing for account "${account.accountId}" (set channels.slack.signingSecret or channels.slack.accounts.${account.accountId}.signingSecret).`);
		token = botToken;
	}
	const slackCfg = account.config;
	const slashCommand = resolveSlackSlashCommandConfig(opts.slashCommand ?? slackCfg.slashCommand);
	const mediaMaxBytes = (opts.mediaMaxMb ?? slackCfg.mediaMaxMb ?? 20) * 1024 * 1024;
	const slackDispatcher = resolveSlackProxyDispatcher();
	const clientOptions = resolveSlackWebClientOptions({}, slackDispatcher);
	const durableIngress = createSlackDurableIngress({
		accountId: account.accountId,
		...runtime.log ? { onLog: runtime.log } : {},
		...opts.abortSignal ? { abortSignal: opts.abortSignal } : {}
	});
	const monitorContextRef = {};
	const { app, receiver, socketModeLogger } = createSlackBoltApp({
		interop: await getSlackBoltInterop(),
		slackMode,
		token,
		appToken: slackMode === "socket" ? appToken ?? void 0 : void 0,
		signingSecret: signingSecret ?? void 0,
		slackWebhookPath,
		clientOptions,
		dispatcher: slackDispatcher,
		wrapReceiver: durableIngress.wrapReceiver,
		onContextIdentity: async (identity) => {
			const current = monitorContextRef.current;
			if (!current) return;
			const recovered = current.identityHealth.lifecycle === "blocked" ? await recoverSlackIdentity() : false;
			const contextTeamId = normalizeOptionalString(identity.teamId);
			const contextEnterpriseId = normalizeOptionalString(identity.enterpriseId);
			const contextInstallationIdentity = identity.isEnterpriseInstall === false && contextTeamId ? {
				kind: "workspace",
				teamId: contextTeamId,
				...contextEnterpriseId ? { enterpriseId: contextEnterpriseId } : {}
			} : void 0;
			const adopted = current.identityHealth.lifecycle === "blocked" && contextInstallationIdentity !== void 0 && adoptSlackIdentity({
				ctx: current,
				identity: account.identity,
				installationIdentity: contextInstallationIdentity,
				botUserId: identity.botUserId,
				botId: identity.botId
			});
			if (adopted && contextInstallationIdentity) {
				installationState.update(contextInstallationIdentity.kind);
				await installSlackRuntimeForIdentity(contextInstallationIdentity);
			}
			if (!current.apiAppId && identity.apiAppId && current.installationIdentity.kind !== "degraded") {
				applySlackInstallationIdentity(current, {
					...current.installationIdentity,
					apiAppId: identity.apiAppId
				});
				runtime.log?.(`[${account.accountId}] slack app id ${identity.apiAppId} learned from signed event`);
			}
			if (recovered || adopted) publishSlackConnectedStatus(opts.setStatus, current.identityHealth);
		}
	});
	const gracefulStop = async () => {
		await gracefulStopSlackApp(app);
	};
	const slackHttpHandler = slackMode === "http" && receiver ? createSlackHttpRequestHandler({
		receiver,
		accountId: account.accountId
	}) : null;
	let unregisterHttpHandler = null;
	const unregisterSocketModeConnectionDiagnostics = slackMode === "socket" ? registerSlackSocketModeConnectionDiagnostics({
		app,
		onSharedConnection: (activeConnections) => {
			runtime.log?.(warn(formatSlackSocketModeSharedConnectionWarning(activeConnections)));
		}
	}) : () => {};
	let botUserId = "";
	let botId = "";
	const expectedApiAppIdFromAppToken = slackMode === "socket" ? parseApiAppIdFromAppToken(appToken) : void 0;
	let authTestError;
	let authIdentityWarning;
	let authTestIdentity;
	try {
		const auth = await createSlackStartupAuthClient(token, clientOptions).auth.test();
		const authUserId = normalizeOptionalString(auth.user_id) ?? "";
		const resolvedIdentity = resolveSlackRuntimeIdentity({
			identity: account.identity,
			botUserId: authUserId,
			botId: auth.bot_id
		});
		botUserId = resolvedIdentity?.botUserId ?? "";
		botId = resolvedIdentity?.botId ?? "";
		authTestIdentity = auth;
		if (account.identity === "bot") authIdentityWarning = formatSlackBotTokenIdentityWarning({
			auth,
			accountId: account.accountId
		});
		if (!authUserId) authTestError = "auth.test returned no user_id";
	} catch (err) {
		authTestError = err instanceof Error ? err.message : String(err);
	}
	const assertSlackInstallationPolicy = (identity) => {
		if (identity.kind === "degraded") {
			if (slackMode === "relay") throw new Error(`Slack relay account "${account.accountId}" requires a successful auth.test before startup`);
			return;
		}
		if (identity.kind !== "enterprise") return;
		if (slackMode === "relay") throw new Error(`Slack Enterprise Grid org account "${account.accountId}" requires direct socket or HTTP delivery; relay mode is unsupported`);
		assertEnterpriseSlackPolicyConfig({
			config: account.config,
			accountId: account.accountId
		});
		assertEnterpriseSlackBindingsAreWorkspaceQualified({
			cfg,
			accountId: account.accountId
		});
	};
	const installationIdentity = resolveSlackInstallationIdentity({
		auth: authTestError === void 0 ? authTestIdentity : void 0,
		transportApiAppId: expectedApiAppIdFromAppToken
	});
	assertSlackInstallationPolicy(installationIdentity);
	const teamId = installationIdentity.kind === "workspace" ? installationIdentity.teamId : "";
	const apiAppId = installationIdentity.kind === "degraded" ? "" : installationIdentity.apiAppId ?? "";
	if (authTestError !== void 0) {
		const identityFailureDetail = account.identity === "user" ? "explicit self-mention detection will be disabled while the user identity is unresolved" : "explicit bot-mention detection will be disabled while the bot identity is unresolved";
		runtime.log?.(warn(`[${account.accountId}] slack auth.test failed at boot (${authTestError}); ${identityFailureDetail}; required-mention channels will fail closed without another trusted activation signal`));
	}
	if (authIdentityWarning) runtime.log?.(warn(authIdentityWarning));
	const identityHealth = resolveSlackIdentityHealth({
		installationIdentity,
		botUserId,
		authTestError,
		authIdentityWarning
	});
	if (apiAppId && expectedApiAppIdFromAppToken && apiAppId !== expectedApiAppIdFromAppToken) {
		const identityTokenLabel = account.identity === "user" ? "user token" : "bot token";
		runtime.error?.(`slack token mismatch: ${identityTokenLabel} app_id=${apiAppId} but app token looks like app_id=${expectedApiAppIdFromAppToken}`);
	}
	const ctx = createSlackMonitorContext({
		cfg,
		accountId: account.accountId,
		botToken: token,
		lookupToken: account.userToken || botToken,
		app,
		runtime,
		channelRuntime: opts.channelRuntime,
		botUserId,
		botId,
		identityHealth,
		teamId,
		apiAppId,
		installationIdentity,
		...resolveSlackMonitorPolicy(cfg, account.accountId, runtime),
		slashCommand,
		mediaMaxBytes
	});
	monitorContextRef.current = ctx;
	const trackEvent = opts.setStatus ? () => {
		opts.setStatus({
			lastEventAt: Date.now(),
			lastInboundAt: Date.now()
		});
	} : void 0;
	const presenceEventsEnabled = hasSlackPresenceEventsEnabled({
		account: slackCfg.presenceEvents,
		channels: slackCfg.channels
	});
	let presenceRequestAbort;
	let presenceMonitor;
	let presenceMonitorStarted = false;
	let runtimeStarted = false;
	const startPresenceMonitor = () => {
		if (!presenceMonitor || presenceMonitorStarted) return;
		presenceMonitor.start();
		presenceMonitorStarted = true;
	};
	const installSlackPresenceRuntime = (identity) => {
		if (!presenceEventsEnabled || presenceMonitor || identity.kind === "degraded" || opts.abortSignal?.aborted) return;
		presenceRequestAbort = new AbortController();
		const options = resolveSlackLookupClientOptions({
			...clientOptions,
			timeout: SLACK_PRESENCE_REQUEST_TIMEOUT_MS
		}, slackDispatcher);
		options.fetch = withSlackPresenceLifecycleSignal(options.fetch ?? globalThis.fetch, presenceRequestAbort.signal);
		const resolveClient = createSlackWorkspaceClientResolver({
			appClient: new WebClient(token, options),
			token,
			clientOptions: options,
			installationIdentity: identity
		});
		presenceMonitor = createSlackPresenceMonitor({
			accountId: account.accountId,
			accountConfig: slackCfg.presenceEvents,
			resolveClient: (workspaceTeamId) => resolveClient(workspaceTeamId).users,
			cooldownStore: openSlackPresenceCooldownStore(),
			log: runtime.log,
			error: runtime.error
		});
		if (runtimeStarted) startPresenceMonitor();
	};
	const handleSlackMessage = createSlackMessageHandler({
		ctx,
		abortSignal: opts.abortSignal,
		trackEvent,
		onPrepared: (prepared) => presenceMonitor?.observe(prepared)
	});
	registerSlackCommonEvents({
		ctx,
		handleSlackMessage,
		trackEvent
	});
	const commandRegistration = await registerSlackMonitorSlashCommands({
		ctx,
		account,
		trackEvent
	});
	const appHomeSlashCommandName = commandRegistration.mode === "single" ? commandRegistration.name : void 0;
	let workspaceRuntimePromise;
	const installSlackWorkspaceRuntime = async () => {
		if (workspaceRuntimePromise) return await workspaceRuntimePromise;
		workspaceRuntimePromise = (async () => {
			registerSlackWorkspaceEvents({
				ctx,
				appHomeSlashCommandName,
				trackEvent
			});
			ctx.readRuntimeContext();
			if (runtimeStarted) startPresenceMonitor();
		})();
		return await workspaceRuntimePromise;
	};
	let approvalRuntimeInstalled = false;
	function installSlackApprovalRuntime(identity) {
		if (approvalRuntimeInstalled || identity.kind === "degraded" || !isSlackAnyNativeApprovalClientEnabled({
			cfg,
			accountId: account.accountId
		})) return;
		const resolveClient = createSlackWorkspaceClientResolver({
			appClient: app.client,
			token,
			clientOptions,
			installationIdentity: identity
		});
		registerChannelRuntimeContext({
			channelRuntime: opts.channelRuntime,
			channelId: "slack",
			accountId: account.accountId,
			capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
			context: {
				app,
				config: slackCfg.execApprovals ?? {},
				resolveClient,
				...identity.kind === "enterprise" ? { enterprise: { enterpriseId: identity.enterpriseId } } : {}
			},
			abortSignal: opts.abortSignal
		});
		approvalRuntimeInstalled = true;
	}
	async function installSlackRuntimeForIdentity(identity) {
		installSlackApprovalRuntime(identity);
		installSlackPresenceRuntime(identity);
		if (identity.kind === "workspace") await installSlackWorkspaceRuntime();
	}
	let identityRecoveryPromise;
	async function recoverSlackIdentity() {
		if (ctx.identityHealth.lifecycle !== "blocked") return false;
		if (identityRecoveryPromise) return await identityRecoveryPromise;
		const recovery = (async () => {
			try {
				const auth = await createSlackStartupAuthClient(token, clientOptions).auth.test();
				const recoveredInstallationIdentity = resolveSlackInstallationIdentity({
					auth,
					transportApiAppId: expectedApiAppIdFromAppToken
				});
				assertSlackInstallationPolicy(recoveredInstallationIdentity);
				if (!adoptSlackIdentity({
					ctx,
					identity: account.identity,
					installationIdentity: recoveredInstallationIdentity,
					botUserId: auth.user_id,
					botId: auth.bot_id
				})) return false;
				installationState.update(recoveredInstallationIdentity.kind);
				await installSlackRuntimeForIdentity(recoveredInstallationIdentity);
				return true;
			} catch (err) {
				ctx.identityHealth = {
					lifecycle: "blocked",
					lastError: formatUnknownError(err)
				};
				return false;
			}
		})();
		identityRecoveryPromise = recovery;
		try {
			return await recovery;
		} finally {
			if (identityRecoveryPromise === recovery) identityRecoveryPromise = void 0;
		}
	}
	const stopOnAbort = () => {
		if (opts.abortSignal?.aborted && slackMode === "socket") gracefulStop();
	};
	opts.abortSignal?.addEventListener("abort", stopOnAbort, { once: true });
	const installationState = registerSlackInstallationState(account.accountId, installationIdentity.kind);
	try {
		await installSlackRuntimeForIdentity(installationIdentity);
		durableIngress.start();
		runtimeStarted = true;
		startPresenceMonitor();
		if (slackMode === "http" && slackHttpHandler) {
			unregisterHttpHandler = registerSlackHttpHandler({
				path: slackWebhookPath,
				handler: slackHttpHandler,
				log: runtime.log,
				accountId: account.accountId
			});
			publishSlackConnectedStatus(opts.setStatus, ctx.identityHealth);
		}
		if (slackMode === "socket") {
			let reconnectAttempts = 0;
			let hasLoggedSocketConnected = false;
			while (!opts.abortSignal?.aborted) try {
				const disconnect = await startSlackSocketAndWaitForDisconnect({
					app,
					abortSignal: opts.abortSignal,
					onStarted: async () => {
						reconnectAttempts = 0;
						await recoverSlackIdentity();
						publishSlackConnectedStatus(opts.setStatus, ctx.identityHealth);
						if (!hasLoggedSocketConnected) {
							hasLoggedSocketConnected = true;
							runtime.log?.(ctx.identityHealth.lifecycle === "blocked" ? "slack socket mode connected (degraded identity)" : "slack socket mode connected");
						}
					}
				});
				if (!disconnect) break;
				if (opts.abortSignal?.aborted) break;
				publishSlackDisconnectedStatus(opts.setStatus, disconnect.error);
				if (disconnect.error && isNonRecoverableSlackAuthError(disconnect.error)) {
					publishSlackBlockedStatus(opts.setStatus, disconnect.error);
					runtime.error?.(`slack socket mode disconnected due to non-recoverable auth error — skipping channel (${formatUnknownError(disconnect.error)})`);
					throw disconnect.error instanceof Error ? disconnect.error : new Error(formatUnknownError(disconnect.error));
				}
				reconnectAttempts += 1;
				const delayMs = computeBackoff(SLACK_SOCKET_RECONNECT_POLICY, reconnectAttempts);
				runtime.log?.(warn(formatSlackSocketReconnectMessage({
					event: disconnect.event,
					attempt: reconnectAttempts,
					delayMs,
					error: disconnect.error
				})));
				await gracefulStop();
				try {
					await sleepWithAbort(delayMs, opts.abortSignal);
				} catch {
					break;
				}
			} catch (err) {
				if (isNonRecoverableSlackAuthError(err)) {
					publishSlackBlockedStatus(opts.setStatus, err);
					runtime.error?.(`slack socket mode failed to start due to non-recoverable auth error — skipping channel (${formatUnknownError(err)})`);
					throw err;
				}
				publishSlackDisconnectedStatus(opts.setStatus, err);
				reconnectAttempts += 1;
				const delayMs = computeBackoff(SLACK_SOCKET_RECONNECT_POLICY, reconnectAttempts);
				runtime.error?.(formatSlackSocketStartRetryMessage({
					attempt: reconnectAttempts,
					delayMs,
					error: err,
					sdkContext: socketModeLogger.getLastMessage()
				}));
				try {
					await sleepWithAbort(delayMs, opts.abortSignal);
				} catch {
					break;
				}
				continue;
			}
		} else if (slackMode === "relay" && relayConfig) {
			const relaySource = await loadSlackRelaySource();
			runtime.log?.(`slack relay mode connecting to ${relayConfig.url} gateway_id:${relayConfig.gatewayId}`);
			durableIngress.attachRelayDispatch(async (message, turnAdoptionLifecycle) => {
				await handleSlackMessage(relaySource.requireSlackMessageEvent(message), {
					source: "message",
					wasMentioned: true,
					awaitDispatch: true,
					turnAdoptionLifecycle
				});
			});
			await relaySource.monitorSlackRelaySource({
				config: relayConfig,
				acceptRelayEvent: durableIngress.acceptRelayEvent,
				runtime,
				abortSignal: opts.abortSignal,
				identityHealth: ctx.identityHealth,
				setStatus: opts.setStatus,
				setIdentity: (identity) => setSlackDefaultSendIdentity(account.accountId, identity)
			});
		} else {
			runtime.log?.(`slack http mode listening at ${slackWebhookPath}`);
			if (!opts.abortSignal?.aborted) await new Promise((resolve) => {
				opts.abortSignal?.addEventListener("abort", () => resolve(), { once: true });
			});
		}
	} finally {
		installationState.release();
		runtimeStarted = false;
		presenceRequestAbort?.abort();
		await presenceMonitor?.stop();
		if (slackMode === "relay") setSlackDefaultSendIdentity(account.accountId, void 0);
		opts.abortSignal?.removeEventListener("abort", stopOnAbort);
		unregisterSocketModeConnectionDiagnostics();
		unregisterHttpHandler?.();
		await durableIngress.stop();
		await gracefulStop();
		await slackDispatcher?.close();
	}
}
function createSlackWorkspaceClientResolver(params) {
	if (params.installationIdentity.kind !== "enterprise") return () => params.appClient;
	const clients = /* @__PURE__ */ new Map();
	return (rawTeamId) => {
		const teamId = rawTeamId;
		if (!teamId || !/^T[A-Z0-9]+$/.test(teamId)) throw new Error("Slack Enterprise Grid workspace client requires a valid teamId");
		const cached = clients.get(teamId);
		if (cached) return cached;
		const client = createSlackWebClient(params.token, {
			...params.clientOptions,
			teamId
		});
		clients.set(teamId, client);
		return client;
	};
}
const resolveSlackRuntimeGroupPolicy = resolveOpenProviderRuntimeGroupPolicy$1;
//#endregion
export { resolveChannelContextVisibilityMode as A, formatUnknownError as C, readSlackAssistantThreadContext as D, buildSlackAssistantThreadMetadata as E, stripSlackMentionsForCommandDetection as F, resolveStorePath$1 as M, updateLastRoute as N, getSessionEntry$1 as O, buildSlackSlashCommandMatcher as P, SLACK_SOCKET_RECONNECT_POLICY as S, resolveSlackChatType as T, SlackStreamNotDeliveredError as _, requireSlackMessageEvent as a, startSlackStream as b, createSlackResponseUrlBudget as c, resolveSlackRoutingContext as d, registerSlackSessionRun as f, resolveSlackEffectiveAllowFrom as g, resolveSlackCommandIngress as h, parseSlackMessageEvent as i, resolveChannelResetConfig as j, readSessionUpdatedAt as k, authorizeSlackDirectMessage as l, authorizeSlackBotRoomMessage as m, resolveSlackRuntimeGroupPolicy as n, resolveSlackRoomContextHints as o, resolveSlackThreadTargets as p, trackSlackDraftMessage as r, SlackResponseAlreadyReportedError as s, monitorSlackProvider as t, resolveConversationLabel as u, appendSlackStream as v, normalizeSlackChannelType as w, stopSlackStream as x, markSlackStreamFallbackDelivered as y };
