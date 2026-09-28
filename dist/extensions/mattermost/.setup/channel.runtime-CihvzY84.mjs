import { n as getOptionalMattermostRuntime, t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { a as resolveInteractionCallbackPath, c as setInteractionSecret, i as createMattermostInteractionHandler, n as buildButtonProps, r as computeInteractionCallbackUrl, s as setInteractionCallbackUrl } from "./interactions-rBQWCbK8.mjs";
import { _ as readMattermostError, a as createMattermostPost, d as fetchMattermostUser, h as normalizeMattermostBaseUrl, l as fetchMattermostChannelPosts, m as isRetryableError, n as buildMattermostApiUrl, o as deleteMattermostPost, p as fetchMattermostUserTeams, r as createMattermostClient, s as fetchMattermostChannel, t as MattermostPostSchema, u as fetchMattermostMe, v as sendMattermostTyping, y as updateMattermostPost } from "./client-BSSVve1x.mjs";
import { C as resolveAllowlistProviderRuntimeGroupPolicy$1, E as resolveDefaultGroupPolicy, O as warnMissingProviderGroupPolicyFallbackOnce, S as registerPluginHttpRoute, _ as listSkillCommandsForAgents, a as resolveMattermostMonitorInboundAccess, b as logTypingFailure, c as DEFAULT_GROUP_HISTORY_LIMIT, d as createChannelMessageReplyPipeline, f as createChannelPairingController, l as buildPreparedModelsProviderData, m as isDangerousNameMatchingEnabled, n as formatMattermostDirectMessageDropLog, o as resolveMattermostTrustedChatKind, s as shouldRetainMattermostSenderHistory, t as authorizeMattermostCommandInvocation, u as createChannelHistoryWindow, w as resolveChannelMediaMaxBytes, y as logInboundDrop } from "./monitor-auth-CCpN0z_f.mjs";
import { n as normalizeMattermostAllowEntry } from "./ingress-identity-DNl4yQSc.mjs";
import { c as listMattermostAccountIds, d as resolveMattermostReplyToMode, n as normalizeMattermostMessagingTarget, o as inspectMattermostAccount, r as parseMattermostQuestionContext, u as resolveMattermostAccount } from "./normalize-DM54w7ud.mjs";
import { _ as registerSlashCommands, a as sendMessageMattermost, c as joinMattermostVisibleContent, d as renderMattermostModelsPickerView, f as renderMattermostProviderPickerView, g as isSlashCommandsEnabled, h as cleanupSlashCommands, l as buildMattermostAllowedModelRefs, m as DEFAULT_COMMAND_SPECS, n as deactivateSlashCommands, o as resolveMattermostOpaqueTarget, p as resolveMattermostModelPickerCurrentModel, r as getSlashCommandState, s as deliverMattermostReplyPayload, t as activateSlashCommands, u as parseMattermostModelPickerContext, v as resolveCallbackUrl, y as resolveSlashCommandConfig } from "./slash-state-DfnmzXMr.mjs";
import { randomUUID } from "node:crypto";
import { resolveGatewayPort } from "openclaw/plugin-sdk/gateway-config-runtime";
import { resolvePinnedMainDmOwnerFromAllowlist, sanitizeUntrustedFileName } from "openclaw/plugin-sdk/security-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringEntries, normalizeTrimmedStringList, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelInboundMediaPayload, createAcceptedChannelDeliveryResult, createChannelPartialDeliveryError, formatInboundEnvelope, formatInboundFromLabel, formatInboundMediaUnavailableText, formatMediaPlaceholderText, implicitMentionKindWhen, isChannelPartialDeliveryError, resolveInboundMentionDecision, resolveInboundSessionEnvelopeContext, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { safeParseJsonWithSchema, safeParseWithSchema } from "openclaw/plugin-sdk/extension-shared";
import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolvePromptHistoryLimit, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, isPrivateNetworkOptInEnabled, ssrfPolicyFromPrivateNetworkOptIn } from "openclaw/plugin-sdk/ssrf-runtime";
import { z } from "zod";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelProgressDraftCompositor, createFinalizableDraftLifecycle, createLivePreviewLifecycle, createMessageReceiptFromOutboundResults, createPreviewMessageReceipt, listMessageReceiptPlatformIds, resolveChannelStreamingPreviewToolProgress } from "openclaw/plugin-sdk/channel-outbound";
import { resolveAllowlistProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
import { rawDataToString } from "openclaw/plugin-sdk/webhook-ingress";
import { runDetachedWebhookWork } from "openclaw/plugin-sdk/webhook-request-guards";
import { fanInChannelIngressLifecycles, resolveChannelImplicitMentions } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { resolveChannelGroups, resolveChannelGroupsConfigPath } from "openclaw/plugin-sdk/channel-policy";
import { buildTtsSupplementMediaPayload, countOutboundMedia, getReplyPayloadTtsSupplement, isReasoningReplyPayload, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { isRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { resolveInboundLastRouteSessionKey, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { escapeRegExp, runChannelProbe, sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { finalizeInboundContext } from "openclaw/plugin-sdk/reply-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { channelReadyPatch, isLoopbackHost } from "openclaw/plugin-sdk/gateway-runtime";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { captureWsEvent, createDebugProxyWebSocketAgent, resolveDebugProxySettings } from "openclaw/plugin-sdk/proxy-capture";
import { WebSocket } from "openclaw/plugin-sdk/websocket-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { chunkMarkdownTextWithMode } from "openclaw/plugin-sdk/reply-chunking";
import { createPersistentDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
//#region extensions/mattermost/src/mattermost/directory.ts
function buildClient(params) {
	const account = inspectMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.enabled || !account.botToken || !account.baseUrl) return null;
	return createMattermostClient({
		baseUrl: account.baseUrl,
		botToken: account.botToken,
		allowPrivateNetwork: isPrivateNetworkOptInEnabled(account.config)
	});
}
/** Build the requested account client, or aggregate accounts for an explicitly unscoped lookup. */
function buildClients(params) {
	const requestedAccountId = params.accountId?.trim();
	const accountIds = requestedAccountId ? [requestedAccountId] : listMattermostAccountIds(params.cfg);
	const seen = /* @__PURE__ */ new Set();
	const clients = [];
	for (const id of accountIds) {
		const client = buildClient({
			cfg: params.cfg,
			accountId: id
		});
		if (client && !seen.has(client.token)) {
			seen.add(client.token);
			clients.push(client);
		}
	}
	return clients;
}
/**
* List channels (public + private) visible to any configured bot account.
*
* NOTE: Uses per_page=200 which covers most instances. Mattermost does not
* return a "has more" indicator, so very large instances (200+ channels per bot)
* may see incomplete results. Pagination can be added if needed.
*/
async function listMattermostDirectoryGroups(params) {
	const clients = buildClients(params);
	if (!clients.length) return [];
	const q = normalizeLowercaseStringOrEmpty(params.query);
	const seenIds = /* @__PURE__ */ new Set();
	const entries = [];
	for (const client of clients) try {
		const me = await fetchMattermostMe(client);
		const channels = await client.request(`/users/${me.id}/channels?per_page=200`);
		for (const ch of channels) {
			if (ch.type !== "O" && ch.type !== "P") continue;
			if (seenIds.has(ch.id)) continue;
			if (q) {
				const name = normalizeLowercaseStringOrEmpty(ch.name);
				const display = normalizeLowercaseStringOrEmpty(ch.display_name);
				if (!name.includes(q) && !display.includes(q)) continue;
			}
			seenIds.add(ch.id);
			entries.push({
				kind: resolveMattermostTrustedChatKind({ channelType: ch.type }) === "group" ? "group" : "channel",
				id: `channel:${ch.id}`,
				name: ch.name ?? void 0,
				handle: ch.display_name ?? void 0
			});
		}
	} catch (err) {
		console.debug?.("[mattermost-directory] listGroups: skipping account:", err?.message);
		continue;
	}
	return params.limit && params.limit > 0 ? entries.slice(0, params.limit) : entries;
}
/**
* List team members as peer directory entries.
*
* Uses only the first available client since all bots in a team see the same
* user list (unlike channels where membership varies). Uses the first team
* returned — multi-team setups will only see members from that team.
*
* Uses paginated member listing with per_page=200, the Mattermost API maximum.
*/
async function listMattermostDirectoryPeers(params) {
	const clients = buildClients(params);
	if (!clients.length) return [];
	const client = clients[0];
	if (!client) return [];
	try {
		const me = await fetchMattermostMe(client);
		const teams = await client.request("/users/me/teams");
		if (!teams.length) return [];
		const team = teams[0];
		if (!team) return [];
		const teamId = team.id;
		const q = normalizeLowercaseStringOrEmpty(params.query);
		let users;
		if (q) users = await client.request("/users/search", {
			method: "POST",
			body: JSON.stringify({
				term: q,
				team_id: teamId
			})
		});
		else {
			const pageSize = 200;
			const userIds = [];
			for (let page = 0;; page += 1) {
				const pageMembers = await client.request(`/teams/${teamId}/members?page=${page}&per_page=${pageSize}`);
				for (const member of pageMembers) if (member.user_id !== me.id) userIds.push(member.user_id);
				if (pageMembers.length < pageSize) break;
			}
			if (!userIds.length) return [];
			users = [];
			for (let index = 0; index < userIds.length; index += pageSize) {
				const userIdBatch = userIds.slice(index, index + pageSize);
				users.push(...await client.request("/users/ids", {
					method: "POST",
					body: JSON.stringify(userIdBatch)
				}));
			}
		}
		const entries = users.filter((u) => u.id !== me.id).map((u) => ({
			kind: "user",
			id: `user:${u.id}`,
			name: u.username ?? void 0,
			handle: [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.nickname || void 0
		}));
		return params.limit && params.limit > 0 ? entries.slice(0, params.limit) : entries;
	} catch (err) {
		console.debug?.("[mattermost-directory] listPeers failed:", err?.message);
		return [];
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-helpers.ts
const formatInboundFromLabel$1 = formatInboundFromLabel;
function resolveThreadSessionKeys$1(params) {
	return resolveThreadSessionKeys({
		...params,
		normalizeThreadId: (threadId) => threadId
	});
}
function buildMattermostBotMentionPattern(username) {
	return `(?<![a-z0-9_])@${escapeRegExp(username)}(?![a-z0-9_]|[.:-]+[a-z0-9_])`;
}
function matchesMattermostBotMention(text, botUsername) {
	if (!botUsername) return false;
	return new RegExp(buildMattermostBotMentionPattern(botUsername), "i").test(text);
}
/**
* Strip bot mention from message text while preserving newlines and
* block-level Markdown formatting (headings, lists, blockquotes).
*/
function normalizeMention(text, mention) {
	if (!mention) return text.trim();
	const pattern = buildMattermostBotMentionPattern(mention);
	const hasMentionRe = new RegExp(pattern, "i");
	const leadingMentionRe = new RegExp(`^([\\t ]*)${pattern}[\\t ]*`, "i");
	const trailingMentionRe = new RegExp(`[\\t ]*${pattern}[\\t ]*$`, "i");
	const normalizedLines = text.split("\n").map((line) => {
		if (!hasMentionRe.test(line)) return {
			text: line,
			mentionOnlyBlank: false
		};
		const normalizedLine = line.replace(leadingMentionRe, "$1").replace(trailingMentionRe, "").replace(new RegExp(pattern, "gi"), "").replace(/(\S)[ \t]{2,}/g, "$1 ");
		return {
			text: normalizedLine,
			mentionOnlyBlank: normalizedLine.trim() === ""
		};
	});
	while (normalizedLines[0]?.mentionOnlyBlank) normalizedLines.shift();
	while (normalizedLines.at(-1)?.text.trim() === "") normalizedLines.pop();
	return normalizedLines.map((line) => line.text).join("\n");
}
function shouldDropEmptyMattermostBody(params) {
	if (/[^\p{White_Space}\p{Cc}\p{Cf}\p{M}]/u.test(params.bodyText)) return false;
	const botUsername = normalizeLowercaseStringOrEmpty(params.botUsername ?? "");
	const bareMention = params.rawText.match(/^[ \t]*(@\S+)[ \t]*$/u)?.[1];
	return !botUsername || normalizeLowercaseStringOrEmpty(bareMention ?? "") !== `@${botUsername}`;
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-websocket.ts
const MATTERMOST_WEBSOCKET_MAX_PAYLOAD_BYTES = 16777216;
const MATTERMOST_WEBSOCKET_HANDSHAKE_TIMEOUT_MS = 3e4;
const MATTERMOST_WEBSOCKET_AUTH_TIMEOUT_MS = 3e4;
const MattermostEventPayloadSchema = z.object({
	event: z.string().optional(),
	status: z.string().optional(),
	seq_reply: z.number().optional(),
	data: z.object({
		post: z.unknown().optional(),
		reaction: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
		channel_id: z.string().optional(),
		channel_name: z.string().optional(),
		channel_display_name: z.string().optional(),
		channel_type: z.string().optional(),
		sender_name: z.string().optional(),
		team_id: z.string().optional()
	}).optional(),
	broadcast: z.object({
		channel_id: z.string().optional(),
		team_id: z.string().optional(),
		user_id: z.string().optional()
	}).optional()
});
function parseMattermostEventPayload(raw) {
	return safeParseJsonWithSchema(MattermostEventPayloadSchema, raw);
}
function parseMattermostPost(value) {
	if (typeof value === "string") return safeParseJsonWithSchema(MattermostPostSchema, value);
	return safeParseWithSchema(MattermostPostSchema, value);
}
var WebSocketClosedBeforeOpenError = class extends Error {
	constructor(code, reason) {
		super(`websocket closed before open (code ${code})`);
		this.code = code;
		this.reason = reason;
		this.name = "WebSocketClosedBeforeOpenError";
	}
};
var WebSocketClosedBeforeAuthenticationError = class extends Error {
	constructor(code, reason) {
		super(`websocket closed before authentication completed (code ${code}) — either the bot token was rejected or the connection dropped (server restart, proxy reset); check the Mattermost bot token if this repeats`);
		this.code = code;
		this.reason = reason;
		this.name = "WebSocketClosedBeforeAuthenticationError";
	}
};
const defaultMattermostWebSocketFactory = (url, options) => {
	const agent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
	return new WebSocket(url, {
		...options,
		...agent ? { agent } : {}
	});
};
function createMattermostConnectOnce(opts) {
	const webSocketFactory = opts.webSocketFactory ?? defaultMattermostWebSocketFactory;
	const healthCheckIntervalMs = opts.healthCheckIntervalMs ?? 3e4;
	const pingIntervalMs = opts.pingIntervalMs ?? 3e4;
	const pongTimeoutMs = opts.pongTimeoutMs ?? 1e4;
	return async () => {
		const flowId = randomUUID();
		const ws = webSocketFactory(opts.wsUrl, {
			maxPayload: MATTERMOST_WEBSOCKET_MAX_PAYLOAD_BYTES,
			handshakeTimeout: MATTERMOST_WEBSOCKET_HANDSHAKE_TIMEOUT_MS
		});
		const onAbort = () => ws.terminate();
		opts.abortSignal?.addEventListener("abort", onAbort, { once: true });
		const getBotUpdateAt = opts.getBotUpdateAt;
		try {
			return await new Promise((resolve, reject) => {
				let opened = false;
				let authenticated = false;
				let settled = false;
				let healthCheckEnabled = getBotUpdateAt != null;
				let healthCheckInFlight = false;
				let healthCheckTimer;
				let protocolKeepaliveEnabled = true;
				let protocolPingTimer;
				let protocolPongTimer;
				let initialUpdateAt;
				let authenticationSeq;
				let authTimer;
				const clearTimers = () => {
					if (healthCheckTimer !== void 0) {
						clearTimeout(healthCheckTimer);
						healthCheckTimer = void 0;
					}
					if (authTimer !== void 0) {
						clearTimeout(authTimer);
						authTimer = void 0;
					}
					if (protocolPingTimer !== void 0) {
						clearTimeout(protocolPingTimer);
						protocolPingTimer = void 0;
					}
					if (protocolPongTimer !== void 0) {
						clearTimeout(protocolPongTimer);
						protocolPongTimer = void 0;
					}
				};
				const stopHealthChecks = () => {
					healthCheckEnabled = false;
					protocolKeepaliveEnabled = false;
					clearTimers();
				};
				const sendProtocolPing = () => {
					if (!protocolKeepaliveEnabled || settled) return;
					if (protocolPongTimer !== void 0) clearTimeout(protocolPongTimer);
					protocolPongTimer = setTimeout(() => {
						protocolPongTimer = void 0;
						if (!protocolKeepaliveEnabled || settled) return;
						opts.runtime.error?.("mattermost websocket pong timeout — reconnecting");
						stopHealthChecks();
						ws.terminate();
					}, pongTimeoutMs);
					try {
						ws.ping();
					} catch (err) {
						if (!protocolKeepaliveEnabled || settled) return;
						opts.runtime.error?.(`mattermost websocket ping failed: ${String(err)}`);
						stopHealthChecks();
						ws.terminate();
					}
				};
				const scheduleProtocolPing = () => {
					if (!protocolKeepaliveEnabled || settled || protocolPingTimer !== void 0) return;
					protocolPingTimer = setTimeout(() => {
						protocolPingTimer = void 0;
						sendProtocolPing();
					}, pingIntervalMs);
				};
				const scheduleHealthCheck = () => {
					if (!getBotUpdateAt || !healthCheckEnabled || settled || healthCheckInFlight) return;
					healthCheckTimer = setTimeout(() => {
						healthCheckTimer = void 0;
						runHealthCheck();
					}, healthCheckIntervalMs);
				};
				const runHealthCheck = async () => {
					if (!getBotUpdateAt || !healthCheckEnabled || settled || healthCheckInFlight) return;
					healthCheckInFlight = true;
					try {
						const current = await getBotUpdateAt();
						if (!healthCheckEnabled || settled) return;
						if (initialUpdateAt === void 0) {
							initialUpdateAt = current;
							return;
						}
						if (current !== initialUpdateAt) {
							opts.runtime.log?.(`mattermost: bot account updated (update_at changed: ${initialUpdateAt} → ${current}) — reconnecting`);
							stopHealthChecks();
							ws.terminate();
						}
					} catch (err) {
						if (!healthCheckEnabled || settled) return;
						const label = initialUpdateAt === void 0 ? "mattermost: failed to get initial update_at" : "mattermost: health check error";
						opts.runtime.error?.(`${label}: ${String(err)}`);
					} finally {
						healthCheckInFlight = false;
						scheduleHealthCheck();
					}
				};
				const resolveOnce = () => {
					if (settled) return;
					settled = true;
					stopHealthChecks();
					resolve();
				};
				const rejectOnce = (error) => {
					if (settled) return;
					settled = true;
					stopHealthChecks();
					reject(error);
				};
				ws.on("open", () => {
					opened = true;
					captureWsEvent({
						url: opts.wsUrl,
						direction: "local",
						kind: "ws-open",
						flowId,
						meta: { subsystem: "mattermost-websocket" }
					});
					opts.statusSink?.({
						connected: true,
						lifecycle: "starting"
					});
					authenticationSeq = opts.nextSeq();
					const authPayload = JSON.stringify({
						seq: authenticationSeq,
						action: "authentication_challenge",
						data: { token: opts.botToken }
					});
					captureWsEvent({
						url: opts.wsUrl,
						direction: "outbound",
						kind: "ws-frame",
						flowId,
						payload: authPayload,
						meta: {
							subsystem: "mattermost-websocket",
							eventType: "authentication_challenge"
						}
					});
					ws.send(authPayload);
					authTimer = setTimeout(() => {
						authTimer = void 0;
						if (settled) return;
						opts.runtime.error?.("mattermost websocket authentication timed out — reconnecting");
						stopHealthChecks();
						ws.terminate();
					}, MATTERMOST_WEBSOCKET_AUTH_TIMEOUT_MS);
					scheduleProtocolPing();
					if (getBotUpdateAt) runHealthCheck();
				});
				ws.on("pong", () => {
					if (protocolPongTimer !== void 0) {
						clearTimeout(protocolPongTimer);
						protocolPongTimer = void 0;
					}
					scheduleProtocolPing();
				});
				ws.on("message", async (data) => {
					const raw = rawDataToString(data);
					captureWsEvent({
						url: opts.wsUrl,
						direction: "inbound",
						kind: "ws-frame",
						flowId,
						payload: Buffer.from(raw),
						meta: { subsystem: "mattermost-websocket" }
					});
					const payload = parseMattermostEventPayload(raw);
					if (!payload) return;
					if (payload.status === "OK" && payload.seq_reply === authenticationSeq) {
						authenticated = true;
						if (authTimer !== void 0) {
							clearTimeout(authTimer);
							authTimer = void 0;
						}
						opts.statusSink?.(channelReadyPatch());
						return;
					}
					if (payload.event === "reaction_added" || payload.event === "reaction_removed") {
						if (!opts.onReaction) return;
						try {
							await opts.onReaction(payload);
						} catch (err) {
							opts.runtime.error?.(`mattermost reaction handler failed: ${String(err)}`);
						}
						return;
					}
					if (payload.event !== "posted") return;
					try {
						await opts.onPosted(raw);
					} catch (err) {
						opts.runtime.error?.(`mattermost durable admission failed; terminating websocket: ${String(err)}`);
						ws.terminate();
					}
				});
				ws.on("close", (code, reason) => {
					captureWsEvent({
						url: opts.wsUrl,
						direction: "local",
						kind: "ws-close",
						flowId,
						closeCode: code,
						payload: reason,
						meta: { subsystem: "mattermost-websocket" }
					});
					stopHealthChecks();
					const message = reasonToString(reason);
					opts.statusSink?.({
						connected: false,
						lifecycle: "recovering",
						lastDisconnect: {
							at: Date.now(),
							status: code,
							error: message || void 0
						}
					});
					if (opened && authenticated) {
						resolveOnce();
						return;
					}
					if (opened) {
						rejectOnce(new WebSocketClosedBeforeAuthenticationError(code, message || void 0));
						return;
					}
					rejectOnce(new WebSocketClosedBeforeOpenError(code, message || void 0));
				});
				ws.on("error", (err) => {
					captureWsEvent({
						url: opts.wsUrl,
						direction: "local",
						kind: "error",
						flowId,
						errorText: String(err),
						meta: { subsystem: "mattermost-websocket" }
					});
					opts.runtime.error?.(`mattermost websocket error: ${String(err)}`);
					opts.statusSink?.({
						connected: false,
						lifecycle: "recovering",
						lastError: String(err)
					});
					try {
						ws.close();
					} catch {}
				});
			});
		} finally {
			opts.abortSignal?.removeEventListener("abort", onAbort);
		}
	};
}
function reasonToString(reason) {
	if (!reason) return "";
	if (typeof reason === "string") return reason;
	return reason.length > 0 ? reason.toString("utf8") : "";
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-ingress.ts
const MATTERMOST_INGRESS_PAYLOAD_VERSION = 1;
const MATTERMOST_INGRESS_POLL_INTERVAL_MS = 1e3;
const MattermostIngressPermanentError = createChannelIngressError("MattermostIngressPermanentError", { withReason: true });
function parseRawObject(raw, subject) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new MattermostIngressPermanentError("invalid-event", `${subject} contains invalid JSON.`, { cause: error });
	}
	if (!isRecord(parsed)) throw new MattermostIngressPermanentError("invalid-event", `${subject} must be a JSON object.`);
	return parsed;
}
function parseRawPost(value) {
	if (typeof value === "string") return parseRawObject(value, "Mattermost posted event post");
	if (isRecord(value)) return value;
	throw new MattermostIngressPermanentError("invalid-event", "Mattermost posted event is missing its post object.");
}
function requiredString(value, field) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new MattermostIngressPermanentError("invalid-event", `Mattermost posted event is missing ${field}.`);
}
function inspectMattermostIngressEvent(rawEvent) {
	const envelope = parseRawObject(rawEvent, "Mattermost WebSocket event");
	if (envelope.event !== "posted") return null;
	const data = isRecord(envelope.data) ? envelope.data : null;
	const post = parseRawPost(data?.post);
	const eventId = requiredString(post.id, "post.id");
	requiredString(post.user_id, "post.user_id");
	const broadcast = isRecord(envelope.broadcast) ? envelope.broadcast : null;
	return {
		eventId,
		laneKey: `channel:${typeof post.channel_id === "string" && post.channel_id.trim() ? post.channel_id.trim() : typeof data?.channel_id === "string" && data.channel_id.trim() ? data.channel_id.trim() : requiredString(broadcast?.channel_id, "channel_id")}`
	};
}
function parseClaimedEvent(rawEvent, eventId) {
	const payload = parseMattermostEventPayload(rawEvent);
	if (!payload || payload.event !== "posted") throw new MattermostIngressPermanentError("invalid-event", `Mattermost ingress row ${eventId} is not a posted event.`);
	const post = parseMattermostPost(payload.data?.post);
	const claimedChannelId = post?.channel_id?.trim() || payload.data?.channel_id?.trim() || payload.broadcast?.channel_id?.trim();
	const senderId = post?.user_id?.trim();
	if (!post || post.id !== eventId || !senderId || !claimedChannelId) throw new MattermostIngressPermanentError("invalid-event", `Mattermost ingress row ${eventId} has invalid post identity.`);
	return {
		post: {
			...post,
			user_id: senderId
		},
		payload
	};
}
function resolveMattermostIngressNonRetryableFailure(error) {
	if (error instanceof MattermostIngressPermanentError) return {
		reason: error.reason,
		message: error.message
	};
	const message = formatErrorMessage(error);
	return /Mattermost API (?:401|403)\b/.test(message) ? {
		reason: "mattermost-auth",
		message
	} : null;
}
function createMattermostIngressMonitor(options) {
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getMattermostRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (rawEvent) => inspectMattermostIngressEvent(rawEvent),
		payload: {
			version: MATTERMOST_INGRESS_PAYLOAD_VERSION,
			serialize: (rawEvent, { receivedAt }) => ({
				receivedAt,
				rawEvent
			}),
			deserialize: (body) => body.rawEvent,
			encode: ({ body }) => ({
				version: MATTERMOST_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: {
					receivedAt: payload.receivedAt,
					rawEvent: payload.rawEvent
				}
			}),
			createClaimError: (kind, claim) => new MattermostIngressPermanentError("invalid-event", kind === "invalid-version" ? `Mattermost ingress row ${claim.id} has an unsupported version.` : `Mattermost ingress row ${claim.id} has invalid post identity.`)
		},
		deliver: async (rawEvent, lifecycle, claim) => {
			const { post, payload } = parseClaimedEvent(rawEvent, claim.id);
			return await options.dispatch(post, payload, lifecycle);
		},
		pollIntervalMs: options.pollIntervalMs ?? MATTERMOST_INGRESS_POLL_INTERVAL_MS,
		waitForDeliveryIdleBeforeRepump: true,
		retention: "standard",
		drain: {
			resolveNonRetryableFailure: resolveMattermostIngressNonRetryableFailure,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.log?.(`mattermost ${message}`)
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		createStoppedError: () => /* @__PURE__ */ new Error("Mattermost ingress is stopped."),
		onError: (error) => options.runtime.error?.(`mattermost ingress drain failed: ${formatErrorMessage(error)}`)
	});
	monitor.start();
	return {
		receive: async (rawEvent) => {
			try {
				await monitor.admit(rawEvent);
			} catch (error) {
				if (!(error instanceof MattermostIngressPermanentError) || error.reason !== "invalid-event") throw error;
				options.runtime.error?.(`mattermost ingress rejected invalid event: ${error.message}`);
			}
		},
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/no-visible-reply-diagnostic.ts
/**
* Detects the #80501 symptom: `deliverMattermostReplyPayload` accepted a
* substantive (non-reasoning) payload, called the underlying
* `deliverTextOrMediaReply`, and the outcome was `"empty"` — meaning the
* payload had no text and no media to send, so no Mattermost API call
* happened. The agent's run completes successfully, but no visible
* channel/thread reply ever surfaces to the user.
*
* Returns a structured violation when the outcome is `"empty"` for a payload
* that nominally carried user-facing content (text or media bytes that ended
* up dropped by `resolveSendableOutboundReplyParts`/`sendMediaWithLeadingCaption`).
* Returns `null` for `"reasoning_skipped"` (intentional suppression),
* `"text"`, or `"media"` (successful visible sends).
*/
function evaluateMattermostNoVisibleReply(params) {
	if (params.outcome !== "empty") return null;
	const finalText = typeof params.payload.text === "string" ? params.payload.text.trim() : "";
	const mediaUrlCount = countOutboundMedia(params.payload);
	if (finalText.length === 0 && mediaUrlCount === 0) return null;
	return {
		reason: "no-visible-reply-after-final-delivery",
		outcome: params.outcome,
		finalTextLength: finalText.length,
		mediaUrlCount
	};
}
function formatMattermostNoVisibleReplyLog(params) {
	return `mattermost no-visible-reply: ${params.violation.reason} to=${params.to} accountId=${params.accountId} agentId=${params.agentId ?? "unknown"} outcome=${params.violation.outcome} finalTextLength=${params.violation.finalTextLength} mediaUrlCount=${params.violation.mediaUrlCount}`;
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-context.ts
function shouldUpdateMattermostDraftToolProgress(account) {
	return account.streamingMode !== "off" && resolveChannelStreamingPreviewToolProgress(account.config, account.streamingMode !== "progress", account.streamingMode);
}
function shouldSuppressMattermostDefaultToolProgressMessages(account) {
	return account.streamingMode !== "off";
}
function buildMattermostModelPickerSelectMessageSid(params) {
	const provider = normalizeLowercaseStringOrEmpty(params.provider);
	const model = normalizeLowercaseStringOrEmpty(params.model);
	return `interaction:${params.postId}:select:${provider}/${model}`;
}
function buildMattermostButtonInteractionMessageSid(params) {
	return `interaction:${params.postId}:${params.actionId}`;
}
function resolveMattermostReplyRootId(params) {
	const threadRootId = normalizeOptionalString(params.threadRootId);
	if (params.kind === "direct" && !threadRootId) return;
	if (threadRootId) return threadRootId;
	return normalizeOptionalString(params.replyToId);
}
function resolveMattermostInteractionReplyRootId(params) {
	const interactionMessageSid = normalizeOptionalString(params.interactionMessageSid);
	const replyToId = normalizeOptionalString(params.replyToId);
	const providerReplyToId = replyToId === interactionMessageSid ? normalizeOptionalString(params.sourcePostId) : replyToId;
	return resolveMattermostReplyRootId({
		kind: params.kind,
		threadRootId: params.threadRootId,
		replyToId: providerReplyToId
	});
}
function canFinalizeMattermostPreviewInPlace(params) {
	return resolveMattermostReplyRootId({
		kind: params.kind,
		threadRootId: params.threadRootId,
		replyToId: params.replyToId
	}) === params.previewRootId?.trim();
}
function formatMattermostFinalDeliveryOutcomeLog(params) {
	const violation = evaluateMattermostNoVisibleReply({
		outcome: params.outcome,
		payload: params.payload
	});
	if (violation) return formatMattermostNoVisibleReplyLog({
		violation,
		to: params.to,
		accountId: params.accountId,
		agentId: params.agentId
	});
	if (params.outcome === "text" || params.outcome === "media") return `delivered reply to ${params.to}`;
}
function resolveMattermostEffectiveReplyToId(params) {
	if (params.kind === "direct" && params.replyToMode === "off") return;
	const threadRootId = normalizeOptionalString(params.threadRootId);
	if (threadRootId) return threadRootId;
	const postId = normalizeOptionalString(params.postId);
	if (!postId) return;
	return params.replyToMode === "all" || params.replyToMode === "first" || params.replyToMode === "batched" ? postId : void 0;
}
function resolveMattermostThreadSessionContext(params) {
	const effectiveReplyToId = resolveMattermostEffectiveReplyToId({
		kind: params.kind,
		postId: params.postId,
		replyToMode: params.replyToMode,
		threadRootId: params.threadRootId
	});
	const threadKeys = resolveThreadSessionKeys$1({
		baseSessionKey: params.baseSessionKey,
		threadId: effectiveReplyToId,
		parentSessionKey: effectiveReplyToId && params.kind !== "direct" ? params.baseSessionKey : void 0
	});
	return {
		effectiveReplyToId,
		sessionKey: threadKeys.sessionKey,
		parentSessionKey: threadKeys.parentSessionKey
	};
}
function resolveMattermostPendingHistoryKey(params) {
	return params.kind === "direct" && !params.threadRootId ? null : params.sessionKey;
}
function resolveMattermostReactionChannelId(payload) {
	return normalizeOptionalString(payload.broadcast?.channel_id) ?? normalizeOptionalString(payload.data?.channel_id);
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-event-plan.ts
async function buildMattermostEventPlan(monitor, params) {
	const channelInfo = params.channelInfo ?? await monitor.resources.resolveChannelInfo(params.channelId);
	const channelType = channelInfo?.type?.trim() || params.channelTypeFallback?.trim();
	if (!channelType) {
		monitor.logVerboseMessage(`mattermost: drop ${params.dropLabel} (cannot resolve channel type for ${params.channelId})`);
		return null;
	}
	const kind = resolveMattermostTrustedChatKind({ channelType });
	const teamId = params.teamId ?? channelInfo?.team_id ?? void 0;
	const channelName = params.channelName ?? channelInfo?.name ?? "";
	const channelDisplay = params.channelDisplay ?? channelInfo?.display_name ?? channelName;
	const roomLabel = channelName ? `#${channelName}` : channelDisplay || `#${params.channelId}`;
	const route = monitor.core.channel.routing.resolveAgentRoute({
		cfg: monitor.cfg,
		channel: "mattermost",
		accountId: monitor.account.accountId,
		teamId,
		peer: {
			kind,
			id: kind === "direct" ? params.senderId : params.channelId
		}
	});
	const thread = resolveMattermostThreadSessionContext({
		baseSessionKey: route.sessionKey,
		kind,
		postId: params.postId,
		replyToMode: resolveMattermostReplyToMode(monitor.account, kind),
		threadRootId: params.threadRootId
	});
	const to = kind === "direct" ? `user:${params.senderId}` : `channel:${params.channelId}`;
	return {
		channelId: params.channelId,
		senderId: params.senderId,
		channelInfo,
		kind,
		teamId,
		channelName,
		channelDisplay,
		roomLabel,
		route,
		thread,
		to,
		finalizeContext: (context) => finalizeInboundContext({
			...context,
			From: kind === "direct" ? `mattermost:${params.senderId}` : kind === "group" ? `mattermost:group:${params.channelId}` : `mattermost:channel:${params.channelId}`,
			To: to,
			SessionKey: thread.sessionKey,
			DmScope: route.dmScope,
			ParentSessionKey: thread.parentSessionKey,
			AccountId: route.accountId,
			ChatType: kind,
			ConversationRouteContextObserved: true,
			ConversationRoutePeerId: kind === "direct" ? params.senderId : params.channelId,
			GroupChannel: channelName ? `#${channelName}` : void 0,
			GroupSpace: teamId,
			SenderId: params.senderId,
			Provider: "mattermost",
			Surface: "mattermost",
			ReplyToId: thread.effectiveReplyToId,
			MessageThreadId: thread.effectiveReplyToId,
			NativeChannelId: params.channelId,
			InboundAccessAuthorized: true,
			OriginatingChannel: "mattermost",
			OriginatingTo: to
		}),
		createReplyPlan: () => ({
			textLimit: monitor.core.channel.text.resolveTextChunkLimit(monitor.cfg, "mattermost", monitor.account.accountId, { fallbackLimit: monitor.account.textChunkLimit ?? 4e3 }),
			tableMode: monitor.core.channel.text.resolveMarkdownTableMode({
				cfg: monitor.cfg,
				channel: "mattermost",
				accountId: monitor.account.accountId
			}),
			replyPipeline: { typing: {
				start: () => monitor.resources.sendTypingIndicator(params.channelId, thread.effectiveReplyToId),
				onStartError: (error) => {
					logTypingFailure({
						log: monitor.logDebugMessage,
						channel: "mattermost",
						target: params.channelId,
						error
					});
				}
			} },
			replyOptions: { disableBlockStreaming: typeof monitor.account.blockStreaming === "boolean" ? !monitor.account.blockStreaming : void 0 }
		})
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-interactions.ts
/**
* Answer an ask_user question from the button its own prompt offered.
*
* The Gateway owns the answer, so this consumes the click instead of letting it
* fall through to the synthetic `[Button click: ...]` message the generic path
* sends; that message would reach the agent as prose while the question stayed
* open.
*/
function createMattermostQuestionInteractionHandler(monitor) {
	const { account, cfg, core, pairing, resources, runtime } = monitor;
	return async (interaction) => {
		const selection = parseMattermostQuestionContext(interaction.context);
		if (!selection) return null;
		const channelInfo = await resources.resolveChannelInfo(interaction.payload.channel_id);
		const decide = async () => await authorizeMattermostCommandInvocation({
			account,
			cfg,
			senderId: interaction.payload.user_id,
			senderName: interaction.userName,
			channelId: interaction.payload.channel_id,
			channelInfo,
			readStoreAllowFrom: pairing.readAllowFromStore,
			allowTextCommands: core.channel.commands.shouldHandleTextCommands({
				cfg,
				surface: "mattermost"
			}),
			hasControlCommand: false
		});
		const auth = await decide();
		if (!auth.ok) return { ephemeral_text: `OpenClaw ignored this action for ${auth.roomLabel}.` };
		try {
			const result = await questionGatewayRuntime.resolveOption({
				cfg,
				questionId: selection.questionId,
				optionIndex: selection.optionIndex,
				senderId: interaction.payload.user_id,
				clientDisplayName: `Mattermost question (${account.accountId})`,
				authorize: async () => (await decide()).ok
			});
			if (result.status === "denied") return { ephemeral_text: `OpenClaw ignored this action for ${auth.roomLabel}.` };
			if (result.status !== "answered") return { ephemeral_text: "This question was already answered." };
		} catch (err) {
			runtime.error?.(`mattermost question interaction failed: ${String(err)}`);
			return { ephemeral_text: "Could not submit this answer." };
		}
		return {
			update: {
				message: interaction.post.message ?? "",
				props: { attachments: [{ text: `✓ **${interaction.actionName}** selected by @${interaction.userName}` }] }
			},
			ephemeral_text: "Answer submitted."
		};
	};
}
function registerMattermostInteractions(params) {
	const { monitor } = params;
	const { account, botUserId, cfg, client, core, pairing, resources, runtime } = monitor;
	const { resolveChannelInfo } = resources;
	const handleQuestionInteraction = createMattermostQuestionInteractionHandler(monitor);
	return registerPluginHttpRoute({
		path: params.interactionPath,
		fallbackPath: "/mattermost/interactions/default",
		auth: "plugin",
		handler: createMattermostInteractionHandler({
			client,
			botUserId,
			accountId: account.accountId,
			allowedSourceIps: params.allowedSourceIps,
			trustedProxies: cfg.gateway?.trustedProxies,
			allowRealIpFallback: cfg.gateway?.allowRealIpFallback === true,
			handleInteraction: async (interaction) => await handleQuestionInteraction(interaction) ?? await params.handleModelPickerInteraction(interaction),
			authorizeButtonClick: async ({ payload }) => {
				const channelInfo = await resolveChannelInfo(payload.channel_id);
				const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
					cfg,
					surface: "mattermost"
				});
				const decision = await authorizeMattermostCommandInvocation({
					account,
					cfg,
					senderId: payload.user_id,
					senderName: payload.user_name ?? "",
					channelId: payload.channel_id,
					channelInfo,
					readStoreAllowFrom: pairing.readAllowFromStore,
					allowTextCommands,
					hasControlCommand: false
				});
				if (decision.ok) return { ok: true };
				return {
					ok: false,
					response: { ephemeral_text: `OpenClaw ignored this action for ${decision.roomLabel}.` }
				};
			},
			resolveSessionKey: async ({ channelId, userId, post }) => {
				const eventPlan = await buildMattermostEventPlan(monitor, {
					channelId,
					senderId: userId,
					postId: post.id,
					threadRootId: post.root_id,
					dropLabel: "interaction session event"
				});
				if (!eventPlan) throw new Error("Mattermost channel type could not be resolved");
				return eventPlan.thread.sessionKey;
			},
			dispatchButtonClick: async (button) => {
				const sourcePostId = button.post.id || button.postId;
				const interactionMessageSid = buildMattermostButtonInteractionMessageSid({
					postId: button.postId,
					actionId: button.actionId
				});
				const eventPlan = await buildMattermostEventPlan(monitor, {
					channelId: button.channelId,
					senderId: button.userId,
					postId: sourcePostId,
					threadRootId: button.post.root_id,
					dropLabel: "interaction dispatch"
				});
				if (!eventPlan) return;
				const { channelDisplay, channelId, kind, route, thread, to } = eventPlan;
				const bodyText = `[Button click: user @${button.userName} selected "${button.actionName}"]`;
				const ctxPayload = eventPlan.finalizeContext({
					Body: bodyText,
					BodyForAgent: bodyText,
					RawBody: bodyText,
					CommandBody: bodyText,
					ConversationLabel: `mattermost:${button.userName}`,
					GroupSubject: kind !== "direct" ? channelDisplay || button.channelId : void 0,
					SenderName: button.userName,
					MessageSid: interactionMessageSid,
					WasMentioned: true,
					CommandAuthorized: false
				});
				const { replyOptions, replyPipeline, tableMode, textLimit } = eventPlan.createReplyPlan();
				await core.channel.inbound.dispatch({
					cfg,
					channel: "mattermost",
					accountId: account.accountId,
					route: {
						agentId: route.agentId,
						dmScope: route.dmScope,
						sessionKey: thread.sessionKey
					},
					ctxPayload,
					delivery: {
						observeMessageSent: true,
						deliver: async (payload) => {
							const result = await deliverMattermostReplyPayload({
								core,
								cfg,
								payload,
								channelId,
								accountId: account.accountId,
								agentId: route.agentId,
								replyToId: resolveMattermostInteractionReplyRootId({
									kind,
									threadRootId: thread.effectiveReplyToId,
									replyToId: payload.replyToId,
									interactionMessageSid,
									sourcePostId
								}),
								textLimit,
								tableMode,
								sendMessage: sendMessageMattermost
							});
							if (result.visibleReplySent) runtime.log?.(`delivered button-click reply to ${to}`);
							return result;
						},
						onError: (err, info) => {
							runtime.error?.(`mattermost button-click ${info.kind} reply failed: ${String(err)}`);
						}
					},
					replyPipeline,
					dispatcherOptions: { humanDelay: resolveHumanDelayConfig(cfg, route.agentId) },
					replyOptions
				});
			},
			log: (message) => runtime.log?.(message)
		}),
		pluginId: "mattermost",
		source: "mattermost-interactions",
		accountId: account.accountId,
		log: (message) => runtime.log?.(message),
		throwOnFailure: true
	});
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-model-picker.ts
function createMattermostModelPickerInteractionHandler(monitor) {
	const { account, cfg, core, pairing, resources, runtime } = monitor;
	const { resolveChannelInfo, updateModelPickerPost } = resources;
	const runModelPickerCommand = async (params) => {
		const { channelDisplay, channelId, kind, roomLabel, route, thread } = params.eventPlan;
		const fromLabel = kind === "direct" ? `Mattermost DM from ${params.senderName}` : `Mattermost message in ${roomLabel} from ${params.senderName}`;
		const ctxPayload = params.eventPlan.finalizeContext({
			Body: params.commandText,
			BodyForAgent: params.commandText,
			RawBody: params.commandText,
			CommandBody: params.commandText,
			ConversationLabel: fromLabel,
			GroupSubject: kind !== "direct" ? channelDisplay || roomLabel : void 0,
			SenderName: params.senderName,
			MessageSid: params.messageSid,
			Timestamp: Date.now(),
			WasMentioned: true,
			CommandAuthorized: params.commandAuthorized,
			CommandSource: "native"
		});
		const { replyOptions, replyPipeline, tableMode, textLimit } = params.eventPlan.createReplyPlan();
		await core.channel.inbound.dispatch({
			cfg,
			channel: "mattermost",
			accountId: account.accountId,
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				sessionKey: thread.sessionKey
			},
			ctxPayload,
			delivery: {
				observeMessageSent: true,
				deliver: async (payload) => {
					const trimmedPayload = {
						...payload,
						text: core.channel.text.convertMarkdownTables(payload.text ?? "", tableMode).trim()
					};
					return await deliverMattermostReplyPayload({
						core,
						cfg,
						payload: trimmedPayload,
						channelId,
						accountId: account.accountId,
						agentId: route.agentId,
						replyToId: resolveMattermostInteractionReplyRootId({
							kind,
							threadRootId: thread.effectiveReplyToId,
							replyToId: trimmedPayload.replyToId,
							interactionMessageSid: params.messageSid,
							sourcePostId: params.sourcePostId
						}),
						textLimit,
						tableMode: "off",
						sendMessage: sendMessageMattermost
					});
				},
				onError: (err, info) => {
					runtime.error?.(`mattermost model picker ${info.kind} reply failed: ${String(err)}`);
				}
			},
			replyPipeline,
			replyOptions
		});
	};
	return async (params) => {
		const pickerState = parseMattermostModelPickerContext(params.context);
		if (!pickerState) return null;
		if (pickerState.ownerUserId !== params.payload.user_id) return { ephemeral_text: "Only the person who opened this picker can use it." };
		const channelInfo = await resolveChannelInfo(params.payload.channel_id);
		const pickerCommandText = pickerState.action === "select" ? `/model ${pickerState.provider}/${pickerState.model}` : pickerState.action === "list" ? `/models ${pickerState.provider}` : "/models";
		const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
			cfg,
			surface: "mattermost"
		});
		const auth = await authorizeMattermostCommandInvocation({
			account,
			cfg,
			senderId: params.payload.user_id,
			senderName: params.userName,
			channelId: params.payload.channel_id,
			channelInfo,
			readStoreAllowFrom: pairing.readAllowFromStore,
			allowTextCommands,
			hasControlCommand: core.channel.text.hasControlCommand(pickerCommandText, cfg)
		});
		if (!auth.ok) {
			if (auth.denyReason === "dm-pairing") {
				const { code } = await pairing.upsertPairingRequest({
					id: params.payload.user_id,
					meta: { name: params.userName }
				});
				return { ephemeral_text: core.channel.pairing.buildPairingReply({
					channel: "mattermost",
					idLine: `Your Mattermost user id: ${params.payload.user_id}`,
					code
				}) };
			}
			return { ephemeral_text: auth.denyReason === "unknown-channel" ? "Temporary error: unable to determine channel type. Please try again." : auth.denyReason === "dm-disabled" ? "This bot is not accepting direct messages." : auth.denyReason === "channels-disabled" ? "Model picker actions are disabled in channels." : auth.denyReason === "channel-no-allowlist" ? "Model picker actions are not configured for this channel." : "Unauthorized." };
		}
		const teamId = auth.channelInfo.team_id ?? params.payload.team_id ?? void 0;
		const eventPlan = await buildMattermostEventPlan(monitor, {
			channelId: params.payload.channel_id,
			senderId: params.payload.user_id,
			postId: params.post.id || params.payload.post_id,
			threadRootId: params.post.root_id,
			channelInfo: auth.channelInfo,
			teamId,
			channelName: auth.channelName,
			channelDisplay: auth.channelDisplay,
			dropLabel: "model picker event"
		});
		if (!eventPlan) return { ephemeral_text: "Temporary error: unable to determine channel type. Please try again." };
		const modelSessionRoute = {
			agentId: eventPlan.route.agentId,
			sessionKey: eventPlan.thread.sessionKey
		};
		const sessionEntry = getSessionEntry({
			storePath: resolveStorePath(cfg.session?.store, { agentId: modelSessionRoute.agentId }),
			sessionKey: modelSessionRoute.sessionKey,
			readConsistency: "latest"
		});
		const data = await buildPreparedModelsProviderData(cfg, eventPlan.route.agentId, { sessionEntry });
		const updatePickerPost = (message, buttons) => updateModelPickerPost({
			channelId: params.payload.channel_id,
			postId: params.payload.post_id,
			message: [data.refreshWarning, message].filter(Boolean).join("\n\n"),
			buttons
		});
		if (data.providers.length === 0) return await updatePickerPost("No models available.");
		if (pickerState.action === "providers" || pickerState.action === "back") {
			const currentModel = resolveMattermostModelPickerCurrentModel({
				cfg,
				route: modelSessionRoute,
				data
			});
			const view = renderMattermostProviderPickerView({
				ownerUserId: pickerState.ownerUserId,
				data,
				currentModel
			});
			return await updatePickerPost(view.text, view.buttons);
		}
		if (pickerState.action === "list") {
			const currentModel = resolveMattermostModelPickerCurrentModel({
				cfg,
				route: modelSessionRoute,
				data
			});
			const view = renderMattermostModelsPickerView({
				ownerUserId: pickerState.ownerUserId,
				data,
				provider: pickerState.provider,
				page: pickerState.page,
				currentModel
			});
			return await updatePickerPost(view.text, view.buttons);
		}
		const targetModelRef = `${pickerState.provider}/${pickerState.model}`;
		if (!buildMattermostAllowedModelRefs(data).has(targetModelRef)) return { ephemeral_text: `That model is no longer available: ${targetModelRef}` };
		const messageSid = buildMattermostModelPickerSelectMessageSid({
			postId: params.payload.post_id,
			provider: pickerState.provider,
			model: pickerState.model
		});
		runDetachedWebhookWork(async () => {
			await runModelPickerCommand({
				commandText: `/model ${targetModelRef}`,
				commandAuthorized: auth.commandAuthorized,
				eventPlan,
				senderName: params.userName,
				messageSid,
				sourcePostId: params.post.id || params.payload.post_id
			});
			const currentModel = resolveMattermostModelPickerCurrentModel({
				cfg,
				route: modelSessionRoute,
				data,
				readConsistency: "latest"
			});
			const view = renderMattermostModelsPickerView({
				ownerUserId: pickerState.ownerUserId,
				data,
				provider: pickerState.provider,
				page: pickerState.page,
				currentModel
			});
			await updatePickerPost(view.text, view.buttons);
		}).catch((err) => {
			runtime.error?.(`mattermost model picker select failed: ${String(err)}`);
		});
		return {};
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-activation.ts
function resolveMattermostInboundMentionDecision(params) {
	const implicitMentions = resolveChannelImplicitMentions({
		cfg: params.cfg,
		channel: "mattermost",
		accountId: params.accountId
	});
	return resolveInboundMentionDecision({
		facts: {
			canDetectMention: params.canDetectMention,
			wasMentioned: params.wasMentioned,
			implicitMentionKinds: params.implicitMentionKinds
		},
		policy: {
			isGroup: params.kind !== "direct",
			requireMention: params.requireMention,
			implicitMentions,
			allowTextCommands: params.allowTextCommands,
			hasControlCommand: params.hasControlCommand,
			commandAuthorized: params.commandAuthorized
		}
	});
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-onchar.ts
const DEFAULT_ONCHAR_PREFIXES = [">", "!"];
function resolveOncharPrefixes(prefixes) {
	const cleaned = prefixes ? normalizeStringEntries(prefixes) : DEFAULT_ONCHAR_PREFIXES;
	return cleaned.length > 0 ? cleaned : DEFAULT_ONCHAR_PREFIXES;
}
function stripOncharPrefix(text, prefixes) {
	const trimmed = text.trimStart();
	for (const prefix of prefixes) {
		if (!prefix) continue;
		if (trimmed.startsWith(prefix)) return {
			triggered: true,
			stripped: trimmed.slice(prefix.length).trimStart()
		};
	}
	return {
		triggered: false,
		stripped: text
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-resources.ts
async function buildMattermostInboundMediaPayload(media) {
	const facts = await toInboundMediaFactsWithMetadata(media);
	return {
		...buildChannelInboundMediaPayload(facts),
		media: facts
	};
}
function formatMattermostPendingMediaText(params) {
	return [params.body, formatMediaPlaceholderText(params.media)].filter(Boolean).join("\n").trim();
}
function sanitizeOptionalAttachmentName(fileName) {
	const sanitized = sanitizeUntrustedFileName(fileName, "_");
	if (sanitized === "_" && sanitizeUntrustedFileName(fileName, "-") === "-") return "";
	return sanitized;
}
function formatMattermostInboundMediaText(params) {
	const materializedCount = params.materializedMedia.filter((media) => Boolean(media.path) || Boolean(media.url)).length;
	const unavailableCount = Math.max(0, params.nativeMedia.length - materializedCount);
	if (unavailableCount === 0) return params.body;
	const unavailableFileNames = params.materializedMedia.filter((media) => !media.path && !media.url && media.fileName).map((media) => sanitizeOptionalAttachmentName(media.fileName ?? "")).filter(Boolean).join(", ");
	const fileNameNotice = unavailableFileNames ? ` ${JSON.stringify(truncateUtf16Safe(unavailableFileNames, 512))}` : "";
	return formatInboundMediaUnavailableText({
		body: params.body,
		notice: `[mattermost ${unavailableCount > 1 ? `${unavailableCount} attachments` : "attachment"} unavailable]${fileNameNotice}`
	});
}
const CHANNEL_CACHE_TTL_MS = 3e5;
const USER_CACHE_TTL_MS = 6e5;
const MONITOR_RESOURCE_CACHE_MAX_ENTRIES = 1e3;
const MATTERMOST_MEDIA_RESPONSE_HEADER_TIMEOUT_MS = 12e4;
const MATTERMOST_MEDIA_READ_IDLE_TIMEOUT_MS = 3e4;
function createMattermostMonitorResources(params) {
	const { accountId, callbackUrl, client, logger, mediaMaxBytes, saveRemoteMedia, mediaKindFromMime } = params;
	const channelCache = /* @__PURE__ */ new Map();
	const userCache = /* @__PURE__ */ new Map();
	const getCachedValue = (cache, key, nowMs) => {
		const cached = cache.get(key);
		if (!cached) return;
		if (nowMs !== void 0 && cached.expiresAt > nowMs) return cached.value;
		cache.delete(key);
	};
	const setCachedValue = (cache, key, value, ttlMs, rawNowMs) => {
		const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNowMs });
		if (expiresAt !== void 0) {
			cache.delete(key);
			cache.set(key, {
				value,
				expiresAt
			});
			pruneMapToMaxSize(cache, MONITOR_RESOURCE_CACHE_MAX_ENTRIES);
		}
	};
	const resolveMattermostMedia = async (fileIds) => {
		const ids = normalizeStringEntries(fileIds ?? []);
		if (ids.length === 0) return [];
		const out = [];
		for (const fileId of ids) {
			let downloadUrl;
			try {
				downloadUrl = buildMattermostApiUrl(client.baseUrl, `/files/${fileId}`);
			} catch (err) {
				logger.debug?.(`mattermost: failed to resolve file ${fileId}: ${String(err)}`);
				out.push({ kind: "unknown" });
				continue;
			}
			try {
				const saved = await saveRemoteMedia({
					url: downloadUrl,
					requestInit: { headers: { Authorization: `Bearer ${client.token}` } },
					filePathHint: fileId,
					maxBytes: mediaMaxBytes,
					ssrfPolicy: { allowedHostnames: [new URL(client.baseUrl).hostname] },
					responseHeaderTimeoutMs: MATTERMOST_MEDIA_RESPONSE_HEADER_TIMEOUT_MS,
					readIdleTimeoutMs: MATTERMOST_MEDIA_READ_IDLE_TIMEOUT_MS
				});
				const contentType = saved.contentType ?? void 0;
				out.push({
					path: saved.path,
					contentType,
					...saved.fileName ? { fileName: saved.fileName } : {},
					kind: mediaKindFromMime(contentType) ?? "unknown"
				});
			} catch (err) {
				logger.debug?.(`mattermost: failed to download file ${fileId}: ${String(err)}`);
				let info;
				try {
					info = await client.request(`/files/${fileId}/info`);
				} catch (infoErr) {
					logger.debug?.(`mattermost: failed to resolve metadata for file ${fileId}: ${String(infoErr)}`);
				}
				const contentType = info?.mime_type?.trim() || void 0;
				const fileName = info?.name?.trim();
				out.push({
					contentType,
					...fileName ? { fileName } : {},
					kind: mediaKindFromMime(contentType) ?? "unknown"
				});
			}
		}
		return out;
	};
	const sendTypingIndicator = async (channelId, parentId) => {
		await sendMattermostTyping(client, {
			channelId,
			parentId
		});
	};
	const resolveChannelInfo = async (channelId) => {
		const rawNow = Date.now();
		const cached = getCachedValue(channelCache, channelId, asDateTimestampMs(rawNow));
		if (cached !== void 0) return cached;
		try {
			const info = await fetchMattermostChannel(client, channelId);
			setCachedValue(channelCache, channelId, info, CHANNEL_CACHE_TTL_MS, rawNow);
			return info;
		} catch (err) {
			logger.debug?.(`mattermost: channel lookup failed: ${String(err)}`);
			return null;
		}
	};
	const resolveUserInfo = async (userId) => {
		const rawNow = Date.now();
		const cached = getCachedValue(userCache, userId, asDateTimestampMs(rawNow));
		if (cached !== void 0) return cached;
		try {
			const info = await fetchMattermostUser(client, userId);
			setCachedValue(userCache, userId, info, USER_CACHE_TTL_MS, rawNow);
			return info;
		} catch (err) {
			logger.debug?.(`mattermost: user lookup failed: ${String(err)}`);
			return null;
		}
	};
	const buildModelPickerProps = (channelId, buttons) => buildButtonProps({
		callbackUrl,
		accountId,
		channelId,
		buttons
	});
	const updateModelPickerPost = async (paramsLocal) => {
		const props = buildModelPickerProps(paramsLocal.channelId, paramsLocal.buttons ?? []) ?? { attachments: [] };
		await updateMattermostPost(client, paramsLocal.postId, {
			message: paramsLocal.message,
			props
		});
		return {};
	};
	return {
		resolveMattermostMedia,
		sendTypingIndicator,
		resolveChannelInfo,
		resolveUserInfo,
		updateModelPickerPost
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-thread-backfill.ts
const TIMEOUT_MS = 5e3;
const COOLDOWN_MS = 6e4;
const MAX_ATTEMPTS = 3;
const MAX_RECOVERIES = 1e3;
const MAX_IN_FLIGHT = 8;
const MAX_THREAD_POSTS = 200;
const ThreadSchema = z.object({
	order: z.array(z.string()),
	posts: z.record(z.string(), MattermostPostSchema)
});
/** Recovery and pending history share one monitor lifetime, never a durable shadow store. */
function createMattermostThreadBackfill(params) {
	const { monitor, channelHistories, historyLimit } = params;
	const { account, cfg, client } = monitor;
	const histories = createChannelHistoryWindow({ historyMap: channelHistories });
	const recoveries = /* @__PURE__ */ new Map();
	const inFlight = /* @__PURE__ */ new Set();
	const readIdentity = (turn) => {
		const entry = getSessionEntry({
			agentId: turn.agentId,
			storePath: resolveStorePath(cfg.session?.store, { agentId: turn.agentId }),
			sessionKey: turn.historyKey,
			readConsistency: "latest"
		});
		return entry ? JSON.stringify([entry.sessionId ?? null, entry.lifecycleRevision ?? null]) : null;
	};
	const owns = (turn, recovery) => {
		if (recoveries.get(turn.historyKey) !== recovery) return false;
		try {
			return readIdentity(turn) === recovery.identity;
		} catch {
			return false;
		}
	};
	const touch = (key, recovery) => {
		recoveries.delete(key);
		recoveries.set(key, recovery);
		for (const [oldKey, old] of recoveries) {
			if (recoveries.size <= MAX_RECOVERIES) break;
			if (!old.completion) recoveries.delete(oldKey);
		}
	};
	const fetchEntries = async (turn, signal) => {
		const query = new URLSearchParams({
			perPage: String(Math.min(historyLimit + 1, MAX_THREAD_POSTS)),
			direction: "up",
			fromPost: turn.currentPostId,
			fromCreateAt: String(turn.currentPostTimestamp)
		});
		const raw = await client.request(`/posts/${encodeURIComponent(turn.threadRootId)}/thread?${query}`, {
			signal,
			timeoutMs: TIMEOUT_MS
		});
		signal.throwIfAborted();
		const thread = ThreadSchema.parse(raw);
		const candidates = thread.order.slice(0, MAX_THREAD_POSTS).flatMap((id) => {
			const post = thread.posts[id];
			if (!post || post.id !== id || post.id === turn.currentPostId || post.channel_id !== turn.channelId || post.id !== turn.threadRootId && post.root_id !== turn.threadRootId || post.type || !post.user_id || typeof post.create_at !== "number" || post.create_at > turn.currentPostTimestamp || !post.message?.trim() && !post.file_ids?.length) return [];
			return [post];
		});
		const senderIds = [...new Set(candidates.map((post) => post.user_id))];
		let users = [];
		if (senderIds.length && isDangerousNameMatchingEnabled(account.config)) {
			users = await client.request("/users/ids", {
				method: "POST",
				body: JSON.stringify(senderIds),
				signal,
				timeoutMs: TIMEOUT_MS
			});
			signal.throwIfAborted();
		}
		const names = new Map(users.map((user) => [user.id, user.username ?? user.id]));
		let storeFailed = false;
		let storeRead;
		const readStoreAllowFrom = () => storeRead ??= monitor.pairing.readAllowFromStore().catch((error) => {
			storeFailed = true;
			throw error;
		});
		const allowed = new Map(await Promise.all(senderIds.map(async (senderId) => {
			try {
				signal.throwIfAborted();
				const access = await resolveMattermostMonitorInboundAccess({
					account,
					cfg,
					senderId,
					senderName: names.get(senderId) ?? senderId,
					channelId: turn.channelId,
					kind: turn.kind,
					groupPolicy: monitor.groupPolicy,
					readStoreAllowFrom,
					allowTextCommands: false,
					hasControlCommand: false,
					mayPair: false
				});
				signal.throwIfAborted();
				return [senderId, !storeFailed && shouldRetainMattermostSenderHistory({
					cfg,
					accountId: account.accountId,
					kind: turn.kind,
					ingress: access.ingress
				})];
			} catch {
				return [senderId, false];
			}
		})));
		signal.throwIfAborted();
		return candidates.filter((post) => allowed.get(post.user_id)).toSorted((a, b) => a.create_at - b.create_at || a.id.localeCompare(b.id)).map((post) => ({
			sender: names.get(post.user_id) ?? post.user_id,
			body: post.message?.trim() || "[attachment]",
			timestamp: post.create_at,
			messageId: post.id
		}));
	};
	return async (turn) => {
		if (historyLimit <= 0 || !Number.isFinite(turn.currentPostTimestamp) || turn.currentPostTimestamp <= 0) return { current: true };
		let identity;
		try {
			identity = readIdentity(turn);
		} catch {
			monitor.logVerboseMessage("mattermost: thread recovery skipped (session store unavailable)");
			return { current: true };
		}
		const previous = recoveries.get(turn.historyKey);
		let recovery = previous;
		if (!recovery || recovery.identity !== identity) {
			const adopting = previous?.identity === null && identity !== null;
			recovery = {
				identity,
				attempts: adopting ? previous.attempts : 0,
				nextAttemptAt: adopting ? previous.nextAttemptAt : 0,
				status: adopting && !previous.completion && previous.attempts > 0 ? previous.status : "pending"
			};
			if (!previous && (channelHistories.get(turn.historyKey)?.length ?? 0) > 0) recovery.status = "seeded";
		}
		touch(turn.historyKey, recovery);
		if (recovery.completion) {
			const history = await recovery.completion;
			return {
				current: owns(turn, recovery),
				history
			};
		}
		if (recovery.status === "settled") return { current: true };
		if (recovery.status === "seeded" && channelHistories.has(turn.historyKey)) return { current: true };
		if (recovery.attempts >= MAX_ATTEMPTS || Date.now() < recovery.nextAttemptAt || inFlight.size >= MAX_IN_FLIGHT) return { current: true };
		recovery.attempts++;
		recovery.nextAttemptAt = Date.now() + COOLDOWN_MS;
		const owner = recovery;
		const controller = new AbortController();
		const deadlineAt = performance.now() + TIMEOUT_MS;
		let timer;
		const deadline = new Promise((_, reject) => {
			timer = setTimeout(() => {
				const error = new DOMException("Mattermost thread recovery deadline", "TimeoutError");
				controller.abort(error);
				reject(error);
			}, TIMEOUT_MS);
		});
		const operation = fetchEntries(turn, controller.signal);
		inFlight.add(operation);
		operation.then(() => inFlight.delete(operation), () => inFlight.delete(operation));
		owner.completion = (async () => {
			try {
				const entries = await Promise.race([operation, deadline]);
				if (performance.now() >= deadlineAt) throw new DOMException("Mattermost thread recovery deadline", "TimeoutError");
				if (!owns(turn, owner)) return;
				const live = channelHistories.get(turn.historyKey) ?? [];
				const merged = /* @__PURE__ */ new Map();
				for (const entry of [...entries, ...live]) merged.set(entry.messageId ?? entry, entry);
				const snapshot = [...merged.values()].toSorted((a, b) => (a.timestamp ?? Infinity) - (b.timestamp ?? Infinity));
				const window = snapshot.slice(-historyLimit);
				if (window.length) {
					histories.clear({
						historyKey: turn.historyKey,
						limit: historyLimit
					});
					for (const entry of window) histories.record({
						historyKey: turn.historyKey,
						limit: historyLimit,
						entry
					});
				}
				owner.attempts = 0;
				owner.nextAttemptAt = 0;
				owner.status = window.length ? "seeded" : "settled";
				monitor.logVerboseMessage(`mattermost: thread recovery retained ${entries.length} entries historyKey=${turn.historyKey}`);
				return snapshot;
			} catch (error) {
				if (!owns(turn, owner)) return;
				owner.status = error instanceof Error && isRetryableError(error) && owner.attempts < MAX_ATTEMPTS ? "pending" : "settled";
				monitor.logVerboseMessage(`mattermost: thread recovery ${owner.status === "pending" ? "retry scheduled" : "gave up"} attempt=${owner.attempts}/${MAX_ATTEMPTS}`);
				return;
			} finally {
				clearTimeout(timer);
				owner.completion = void 0;
			}
		})();
		const history = await owner.completion;
		return {
			current: owns(turn, owner),
			history
		};
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/draft-stream.ts
const MATTERMOST_STREAM_MAX_CHARS = 4e3;
const DEFAULT_THROTTLE_MS = 1e3;
function normalizeMattermostDraftText(text, maxChars) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	if (trimmed.length <= maxChars) return trimmed;
	return `${sliceUtf16Safe(trimmed, 0, Math.max(0, maxChars - 3)).trimEnd()}...`;
}
function consumeMattermostPublishedChunk(params) {
	const chunk = params.chunk.trim();
	if (!chunk) return params.offset;
	let offset = params.offset;
	while (offset < params.source.length && /\s/.test(params.source[offset] ?? "")) offset += 1;
	return params.source.startsWith(chunk, offset) ? offset + chunk.length : void 0;
}
function createMattermostDraftPreviewBoundaryController(params) {
	let hasStreamedContent = false;
	return {
		noteUpdate() {
			hasStreamedContent = true;
		},
		async noteBoundary() {
			if (!params.enabled) return;
			if (!hasStreamedContent) return;
			hasStreamedContent = false;
			await params.forceNewMessage();
		}
	};
}
function createMattermostDraftStream(params) {
	const maxChars = Math.min(params.maxChars ?? MATTERMOST_STREAM_MAX_CHARS, MATTERMOST_STREAM_MAX_CHARS);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const streamState = {
		stopped: false,
		final: false
	};
	let terminalAcceptedDeliveryError;
	const assertNoAcceptedDeliveryFailure = () => {
		if (terminalAcceptedDeliveryError !== void 0) throw terminalAcceptedDeliveryError;
	};
	let currentGeneration = {
		lastSentText: "",
		latestSourceText: "",
		ready: Promise.resolve()
	};
	const sealedAssistantTexts = [];
	const publishedAssistantParts = /* @__PURE__ */ new Map();
	const sendOrEditStreamMessage = async (text) => {
		if (streamState.stopped && !streamState.final) return false;
		const target = currentGeneration;
		const normalized = normalizeMattermostDraftText(params.renderText?.(text) ?? text, maxChars);
		if (!normalized) return false;
		await target.ready;
		if (streamState.stopped && !streamState.final) return false;
		if (normalized === target.lastSentText) return true;
		try {
			if (target.postId) target.lastProviderText = (await updateMattermostPost(params.client, target.postId, { message: normalized })).message ?? normalized;
			else {
				const sent = await createMattermostPost(params.client, {
					channelId: params.channelId,
					message: normalized,
					rootId: params.rootId
				});
				target.postId = sent.id;
				target.lastProviderText = sent.message ?? normalized;
			}
			target.lastSentText = normalized;
			return true;
		} catch (err) {
			streamState.stopped = true;
			const acceptedDeliveryError = isChannelPartialDeliveryError(err) ? toErrorObject(err, "Mattermost accepted delivery failed") : void 0;
			if (acceptedDeliveryError) terminalAcceptedDeliveryError = acceptedDeliveryError;
			params.warn?.(`mattermost stream preview failed: ${err instanceof Error ? err.message : String(err)}`);
			if (acceptedDeliveryError) throw acceptedDeliveryError;
			return false;
		}
	};
	const clearMessageId = () => {
		currentGeneration.postId = void 0;
	};
	const isValidMessageId = (value) => typeof value === "string" && value.length > 0;
	const deleteMessage = async (postId) => {
		await deleteMattermostPost(params.client, postId);
	};
	const { loop, update: updateLifecycle, stop: stopLifecycle, stopForClear, clearWithStop, seal: sealLifecycle } = createFinalizableDraftLifecycle({
		throttleMs,
		state: streamState,
		sendOrEditStreamMessage,
		readMessageId: () => currentGeneration.postId,
		clearMessageId,
		isValidMessageId,
		deleteMessage,
		warn: params.warn,
		warnPrefix: "mattermost stream preview cleanup failed"
	});
	const forceNewMessage = () => {
		if (terminalAcceptedDeliveryError !== void 0) return Promise.reject(terminalAcceptedDeliveryError);
		if (streamState.stopped || streamState.final) return Promise.resolve();
		const pendingText = loop.takePending();
		const inFlightAtBoundary = loop.waitForInFlight();
		const sealed = currentGeneration;
		const assistantText = sealed.latestAssistantText?.trim();
		let publishedAssistantOffset = 0;
		const recordPublishedAssistantPart = (messageId, content, offset) => {
			if (!assistantText) return;
			publishedAssistantParts.set(messageId, {
				messageId,
				content
			});
			publishedAssistantOffset = consumeMattermostPublishedChunk({
				source: assistantText,
				offset,
				chunk: content
			}) ?? offset;
		};
		const boundary = (async () => {
			try {
				await sealed.ready;
				assertNoAcceptedDeliveryFailure();
				await inFlightAtBoundary;
				assertNoAcceptedDeliveryFailure();
				if (streamState.stopped && !streamState.final) {
					assertNoAcceptedDeliveryFailure();
					return;
				}
				const sourceText = pendingText.trim() ? pendingText : sealed.latestSourceText;
				const finalizedText = (params.renderText?.(sourceText) ?? sourceText).trim();
				const chunks = params.chunkText?.(finalizedText) ?? chunkMarkdownTextWithMode(finalizedText, maxChars, "length");
				const firstChunk = chunks[0];
				if (!firstChunk) return;
				if (sealed.postId) {
					if (assistantText && (sealed.lastProviderText || sealed.lastSentText)) {
						const publishedContent = sealed.lastProviderText ?? sealed.lastSentText;
						recordPublishedAssistantPart(sealed.postId, publishedContent, 0);
					}
					let providerFirstChunk = sealed.lastProviderText ?? firstChunk;
					if (firstChunk !== sealed.lastSentText) providerFirstChunk = (await updateMattermostPost(params.client, sealed.postId, { message: firstChunk })).message ?? firstChunk;
					recordPublishedAssistantPart(sealed.postId, providerFirstChunk, 0);
				} else {
					const firstPost = await createMattermostPost(params.client, {
						channelId: params.channelId,
						message: firstChunk,
						rootId: params.rootId
					});
					recordPublishedAssistantPart(firstPost.id, firstPost.message ?? firstChunk, 0);
				}
				for (const chunk of chunks.slice(1)) {
					const post = await createMattermostPost(params.client, {
						channelId: params.channelId,
						message: chunk,
						rootId: params.rootId
					});
					recordPublishedAssistantPart(post.id, post.message ?? chunk, publishedAssistantOffset);
				}
				if (assistantText) sealedAssistantTexts.push({
					text: assistantText,
					requiresBlockBoundary: true
				});
			} catch (err) {
				const acceptedDeliveryError = isChannelPartialDeliveryError(err) ? toErrorObject(err, "Mattermost accepted delivery failed") : void 0;
				if (acceptedDeliveryError) {
					streamState.stopped = true;
					terminalAcceptedDeliveryError = acceptedDeliveryError;
				}
				const publishedAssistantPrefix = assistantText?.slice(0, publishedAssistantOffset).trim();
				if (publishedAssistantPrefix) sealedAssistantTexts.push({
					text: publishedAssistantPrefix,
					requiresBlockBoundary: false
				});
				params.warn?.(`mattermost stream preview boundary flush failed: ${err instanceof Error ? err.message : String(err)}`);
				if (acceptedDeliveryError) throw acceptedDeliveryError;
			}
		})();
		currentGeneration = {
			lastSentText: "",
			latestSourceText: "",
			ready: boundary
		};
		loop.resetThrottleWindow();
		return boundary;
	};
	const flush = async () => {
		assertNoAcceptedDeliveryFailure();
		await loop.flush();
		await currentGeneration.ready;
		assertNoAcceptedDeliveryFailure();
	};
	const discardPending = async () => {
		assertNoAcceptedDeliveryFailure();
		await stopForClear();
		await currentGeneration.ready;
		assertNoAcceptedDeliveryFailure();
	};
	const clear = async () => {
		assertNoAcceptedDeliveryFailure();
		await clearWithStop(discardPending);
		assertNoAcceptedDeliveryFailure();
	};
	const deleteCurrentMessage = async () => {
		assertNoAcceptedDeliveryFailure();
		const retiring = currentGeneration;
		loop.resetPending();
		const inFlight = loop.waitForInFlight();
		const retirement = clearWithStop(async () => {
			await retiring.ready;
			await inFlight;
			assertNoAcceptedDeliveryFailure();
		}, {
			readMessageId: () => retiring.postId,
			clearMessageId: () => {
				retiring.postId = void 0;
			}
		});
		currentGeneration = {
			lastSentText: "",
			latestSourceText: "",
			ready: retirement
		};
		loop.resetThrottleWindow();
		await retirement;
		assertNoAcceptedDeliveryFailure();
	};
	const seal = async () => {
		assertNoAcceptedDeliveryFailure();
		await sealLifecycle();
		await currentGeneration.ready;
		assertNoAcceptedDeliveryFailure();
	};
	const stop = async () => {
		assertNoAcceptedDeliveryFailure();
		await stopLifecycle();
		await currentGeneration.ready;
		assertNoAcceptedDeliveryFailure();
	};
	const update = (text) => {
		currentGeneration.latestSourceText = text;
		currentGeneration.latestAssistantText = void 0;
		updateLifecycle(text);
	};
	const updateAssistantText = (text) => {
		currentGeneration.latestSourceText = text;
		currentGeneration.latestAssistantText = text;
		updateLifecycle(text);
	};
	const settleBoundaries = async () => {
		assertNoAcceptedDeliveryFailure();
		await currentGeneration.ready;
		assertNoAcceptedDeliveryFailure();
	};
	const resolveFinalText = (text) => {
		const publishedParts = [...publishedAssistantParts.values()];
		if (sealedAssistantTexts.length === 0) return {
			kind: "full",
			text,
			publishedParts
		};
		let remainingText = text.trim();
		for (const sealedText of sealedAssistantTexts) {
			const completed = sealedText.text.trim();
			if (!completed || !remainingText.startsWith(completed)) return {
				kind: "full",
				text,
				publishedParts
			};
			const suffix = remainingText.slice(completed.length);
			if (sealedText.requiresBlockBoundary && suffix && !/^\r?\n/.test(suffix)) return {
				kind: "full",
				text,
				publishedParts
			};
			remainingText = suffix.replace(sealedText.requiresBlockBoundary ? /^(?:\r?\n)+/ : /^\s+/, "");
		}
		const currentText = currentGeneration.latestAssistantText?.trim() ?? "";
		const remaining = remainingText.trim();
		if (currentText && !remaining.startsWith(currentText)) return {
			kind: "full",
			text,
			publishedParts
		};
		return remaining ? {
			kind: "remaining",
			text: remaining,
			publishedParts
		} : {
			kind: "already-delivered",
			publishedParts
		};
	};
	params.log?.(`mattermost stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update,
		updateAssistantText,
		flush,
		postId: () => currentGeneration.postId,
		clear,
		deleteCurrentMessage,
		discardPending,
		seal,
		stop,
		forceNewMessage,
		settleBoundaries,
		resolveFinalText
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-draft-delivery.ts
function combineMattermostVisibleDeliveryResults(results, outcome) {
	const visibleResults = results.filter((result) => result?.visibleReplySent === true);
	if (visibleResults.length === 0) return;
	return {
		outcome,
		...createAcceptedChannelDeliveryResult({
			deliveryResults: visibleResults,
			content: joinMattermostVisibleContent(visibleResults.map((result) => result.content))
		})
	};
}
async function deliverMattermostReplyWithDraftPreview(params) {
	if (isReasoningReplyPayload(params.payload)) return {
		outcome: "reasoning_skipped",
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
	let outcome = "text";
	const ttsSupplement = getReplyPayloadTtsSupplement(params.payload);
	const previewFinalResolution = params.info.kind === "final" && !params.previewLifecycle.previewFinalized ? params.resolvePreviewFinalText(params.payload.text ?? ttsSupplement?.spokenText) : void 0;
	const confirmedPreviewDelivery = previewFinalResolution?.confirmedDelivery;
	const previewFinalDeliveryText = previewFinalResolution?.deliveryText;
	let previewFinalTextAlreadyDelivered = previewFinalResolution?.alreadyDelivered === true && params.payload.isError !== true;
	if (previewFinalTextAlreadyDelivered && !resolveSendableOutboundReplyParts(params.payload).hasMedia && !params.payload.presentation && confirmedPreviewDelivery?.visibleReplySent) try {
		await params.previewLifecycle.observeDelivery(confirmedPreviewDelivery);
		await params.recordThreadParticipation?.();
		return confirmedPreviewDelivery;
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			...confirmedPreviewDelivery,
			visibleReplySent: true
		});
	}
	try {
		return combineMattermostVisibleDeliveryResults([confirmedPreviewDelivery, (await params.previewLifecycle.deliver({
			kind: params.info.kind,
			payload: params.payload,
			isError: params.payload.isError,
			adapter: {
				buildFinalEdit: (payload) => {
					const hasMedia = Boolean(payload.mediaUrl) || (payload.mediaUrls?.length ?? 0) > 0;
					const previewFinalText = previewFinalResolution?.editText;
					if (hasMedia && !ttsSupplement || typeof previewFinalText !== "string" || payload.isError || payload.presentation || !canFinalizeMattermostPreviewInPlace({
						kind: params.kind,
						previewRootId: params.effectiveReplyToId,
						threadRootId: params.effectiveReplyToId,
						replyToId: payload.replyToId
					})) return;
					return { message: previewFinalText };
				},
				editFinal: async (previewPostId, edit) => {
					const post = await updateMattermostPost(params.client, previewPostId, edit);
					const receipt = createPreviewMessageReceipt({ id: post.id ?? previewPostId });
					return {
						messageIds: receipt.platformMessageIds,
						receipt,
						visibleReplySent: true,
						content: post.message ?? edit.message
					};
				},
				onPreviewFinalized: async () => {
					previewFinalTextAlreadyDelivered = true;
					await params.recordThreadParticipation?.();
				},
				buildSupplementalPayload: (payload) => getReplyPayloadTtsSupplement(payload) ? buildTtsSupplementMediaPayload(payload) : void 0,
				deliverSupplemental: async (payload) => {
					const delivered = await params.deliverPayload(payload);
					if (delivered.outcome === "media") outcome = "media";
					return delivered.visibleReplySent ? delivered : false;
				},
				logPreviewEditFailure: (err) => {
					params.logVerboseMessage(`mattermost preview final edit failed; falling back to normal send (${String(err)})`);
				}
			},
			deliverNormally: async (payload) => {
				const supplement = getReplyPayloadTtsSupplement(payload);
				const resolvedDeliveryText = previewFinalDeliveryText ?? (previewFinalTextAlreadyDelivered ? "" : void 0);
				const payloadText = payload.text?.trim();
				const deliveryPayload = payload.isError !== true && supplement && (previewFinalTextAlreadyDelivered || !payloadText && supplement.visibleTextAlreadyDelivered === true) ? buildTtsSupplementMediaPayload(payload) : payload.isError !== true && supplement && !payloadText ? {
					...payload,
					text: resolvedDeliveryText?.trim() ? resolvedDeliveryText : supplement.spokenText
				} : payload.isError !== true && typeof resolvedDeliveryText === "string" ? {
					...payload,
					text: resolvedDeliveryText
				} : payload;
				const delivered = await params.deliverPayload(deliveryPayload);
				if (delivered.outcome === "media") outcome = "media";
				return delivered;
			},
			onNormalDelivered: params.recordThreadParticipation
		})).deliveryResult], outcome) ?? {
			outcome: "empty",
			visibleReplySent: false,
			suppression: { reason: "no_visible_result" }
		};
	} catch (error) {
		if (!confirmedPreviewDelivery?.visibleReplySent) throw error;
		const failedPartial = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
		throw createChannelPartialDeliveryError(error, createAcceptedChannelDeliveryResult({
			deliveryResults: [confirmedPreviewDelivery, ...failedPartial ? [failedPartial] : []],
			content: joinMattermostVisibleContent([confirmedPreviewDelivery.content, failedPartial?.content])
		}));
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/thread-participation.ts
const threadParticipation = createPersistentDedupeCache({
	globalKey: Symbol.for("openclaw.mattermostThreadParticipation"),
	ttlMs: 6048e5,
	maxSize: 5e3,
	persistent: {
		namespace: "mattermost.thread-participation",
		maxEntries: 1e3,
		openStore: (options) => getOptionalMattermostRuntime()?.state.openKeyedStore(options),
		logError: createPluginStateErrorReporter(getOptionalMattermostRuntime, "mattermost", "thread-participation-state", "Mattermost persistent thread participation state failed"),
		readTimestamp: ({ repliedAt }) => repliedAt
	}
});
function makeKey(accountId, channelId, threadRootId) {
	return `${accountId}:${channelId}:${threadRootId}`;
}
async function recordMattermostThreadParticipation(accountId, channelId, threadRootId, opts) {
	if (!accountId || !channelId || !threadRootId) return;
	await threadParticipation.register(makeKey(accountId, channelId, threadRootId), {
		...opts?.agentId ? { agentId: opts.agentId } : {},
		repliedAt: Date.now()
	});
}
async function hasMattermostThreadParticipationWithPersistence(params) {
	if (!params.accountId || !params.channelId || !params.threadRootId) return false;
	return await threadParticipation.lookup(makeKey(params.accountId, params.channelId, params.threadRootId));
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-turn.ts
function createDisabledMattermostDraftStream() {
	const noopAsync = async () => {};
	return {
		update: () => {},
		updateAssistantText: () => {},
		flush: noopAsync,
		postId: () => void 0,
		clear: noopAsync,
		deleteCurrentMessage: noopAsync,
		discardPending: noopAsync,
		seal: noopAsync,
		stop: noopAsync,
		forceNewMessage: noopAsync,
		settleBoundaries: noopAsync,
		resolveFinalText: (text) => ({
			kind: "full",
			text,
			publishedParts: []
		})
	};
}
async function dispatchMattermostInboundTurn(monitor, params) {
	const { account, cfg, client, core, runtime } = monitor;
	const { channelHistories, ctxPayload, eventPlan, historyKey, historyLimit, pinnedMainDmOwner, post, rawText, turnAdoptionLifecycle } = params;
	const { channelId, kind, route, senderId, thread, to } = eventPlan;
	const { effectiveReplyToId } = thread;
	const { replyOptions, replyPipeline: baseReplyPipeline, tableMode, textLimit } = eventPlan.createReplyPlan();
	const chunkMode = core.channel.text.resolveChunkMode(cfg, "mattermost", account.accountId);
	const { onModelSelected, typingCallbacks, resolveResponsePrefix, ...dispatcherPipeline } = createChannelMessageReplyPipeline({
		cfg,
		agentId: route.agentId,
		channel: "mattermost",
		accountId: account.accountId,
		typing: baseReplyPipeline.typing
	});
	const hookRunner = getGlobalHookRunner();
	const draftPreviewEnabled = !((hookRunner?.hasHooks("reply_payload_sending") ?? false) || (hookRunner?.hasHooks("message_sending") ?? false)) && account.streamingMode !== "off";
	const draftProgressEnabled = draftPreviewEnabled && (account.streamingMode === "progress" || shouldUpdateMattermostDraftToolProgress(account));
	const suppressDefaultToolProgressMessages = draftPreviewEnabled && shouldSuppressMattermostDefaultToolProgressMessages(account);
	const draftStream = draftPreviewEnabled ? createMattermostDraftStream({
		client,
		channelId,
		rootId: effectiveReplyToId,
		throttleMs: 1200,
		chunkText: (value) => core.channel.text.chunkMarkdownTextWithMode(core.channel.text.convertMarkdownTables(value, tableMode), textLimit, chunkMode),
		log: monitor.logVerboseMessage,
		warn: monitor.logVerboseMessage
	}) : createDisabledMattermostDraftStream();
	const previewBoundaryController = createMattermostDraftPreviewBoundaryController({
		enabled: draftPreviewEnabled && account.streamingMode === "block",
		forceNewMessage: async () => {
			await draftStream.forceNewMessage();
		}
	});
	let lastPartialText = "";
	let firstAssistantPreviewPrefix;
	let firstAssistantPreviewPrefixPending = true;
	let currentAssistantPreviewUsesPrefix = false;
	let blockPreviewActivity = "none";
	let blockPreviewAssistantMessagePending = false;
	const progressDraft = createChannelProgressDraftCompositor({
		preparedItems: true,
		entry: account.config,
		mode: account.streamingMode,
		active: draftPreviewEnabled,
		seed: `${account.accountId}:${channelId}`,
		shouldStartNow: (line) => typeof line === "object" && line.kind === "item",
		update: async (previewText, options) => {
			draftStream.update(previewText);
			if (options?.flush) await draftStream.flush();
		},
		deleteCurrent: () => draftStream.deleteCurrentMessage()
	});
	const enterBlockPreviewActivity = (activity) => {
		if (account.streamingMode !== "block") return;
		const continuesCurrentActivity = activity === "tool" && blockPreviewActivity === "tool" || activity === "text" && blockPreviewActivity === "text" && !blockPreviewAssistantMessagePending || activity === "reasoning" && blockPreviewActivity === "reasoning";
		const startsNewGeneration = !continuesCurrentActivity && blockPreviewActivity !== "reasoning";
		if (startsNewGeneration) currentAssistantPreviewUsesPrefix = false;
		const boundarySettled = startsNewGeneration ? previewBoundaryController.noteBoundary() : void 0;
		if (!continuesCurrentActivity) progressDraft.resetActivity();
		blockPreviewActivity = activity;
		blockPreviewAssistantMessagePending = false;
		if (activity === "tool") lastPartialText = "";
		return boundarySettled;
	};
	const previewLifecycle = createLivePreviewLifecycle({
		draft: draftPreviewEnabled ? {
			flush: draftStream.flush,
			id: draftStream.postId,
			seal: draftStream.seal,
			discardPending: draftStream.discardPending,
			clear: draftStream.clear
		} : void 0,
		onFinalStarted: () => progressDraft.markFinalReplyStarted(),
		onFinalDelivered: () => progressDraft.markFinalReplyDelivered(),
		onCleanupFailure: (err) => monitor.logVerboseMessage(`mattermost draft preview cleanup failed: ${String(err)}`)
	});
	const resolvePreviewFinalText = (text) => {
		const resolution = draftStream.resolveFinalText(typeof text === "string" ? text : "");
		const confirmedDelivery = resolution.publishedParts.length > 0 ? (() => {
			const receipt = createMessageReceiptFromOutboundResults({
				results: resolution.publishedParts.map((part) => ({
					channel: "mattermost",
					messageId: part.messageId,
					channelId
				})),
				kind: "preview",
				...effectiveReplyToId ? { replyToId: effectiveReplyToId } : {}
			});
			return {
				outcome: "text",
				messageIds: listMessageReceiptPlatformIds(receipt),
				receipt,
				visibleReplySent: true,
				content: joinMattermostVisibleContent(resolution.publishedParts.map((part) => part.content))
			};
		})() : void 0;
		const deliveryText = resolution.kind === "already-delivered" ? "" : resolution.text;
		const formatted = core.channel.text.convertMarkdownTables(deliveryText, tableMode);
		const chunks = core.channel.text.chunkMarkdownTextWithMode(formatted, textLimit, chunkMode);
		if (!chunks.length && formatted) chunks.push(formatted);
		if (chunks.length !== 1) return {
			deliveryText,
			confirmedDelivery,
			alreadyDelivered: resolution.kind === "already-delivered"
		};
		const trimmed = chunks[0]?.trim();
		if (!trimmed) return {
			deliveryText,
			confirmedDelivery,
			alreadyDelivered: resolution.kind === "already-delivered"
		};
		if (lastPartialText && lastPartialText.startsWith(trimmed) && trimmed.length < lastPartialText.length) return {
			deliveryText,
			confirmedDelivery,
			alreadyDelivered: false
		};
		return {
			editText: trimmed,
			deliveryText,
			confirmedDelivery,
			alreadyDelivered: false
		};
	};
	const updateDraftFromPartial = (text) => {
		const cleaned = text?.trim();
		if (!cleaned || cleaned === lastPartialText) return;
		if (lastPartialText && lastPartialText.startsWith(cleaned) && cleaned.length < lastPartialText.length) return;
		const boundarySettled = enterBlockPreviewActivity("text");
		progressDraft.resetActivity({ suppressed: true });
		lastPartialText = cleaned;
		if (firstAssistantPreviewPrefixPending) {
			firstAssistantPreviewPrefix = resolveResponsePrefix?.();
			firstAssistantPreviewPrefixPending = false;
			currentAssistantPreviewUsesPrefix = Boolean(firstAssistantPreviewPrefix);
		}
		const previewText = currentAssistantPreviewUsesPrefix && firstAssistantPreviewPrefix ? cleaned.startsWith(firstAssistantPreviewPrefix) ? cleaned : `${firstAssistantPreviewPrefix} ${cleaned}` : cleaned;
		draftStream.updateAssistantText(previewText);
		previewBoundaryController.noteUpdate();
		return boundarySettled;
	};
	const dispatcherOptions = {
		...dispatcherPipeline,
		humanDelay: resolveHumanDelayConfig(cfg, route.agentId),
		typingCallbacks
	};
	const delivery = {
		observeMessageSent: true,
		deliver: async (payloadEntry, info) => {
			if (info.kind === "final") {
				await enterBlockPreviewActivity("text");
				await draftStream.settleBoundaries();
			}
			let threadParticipationRecorded = false;
			const markThreadParticipation = async () => {
				if (!threadParticipationRecorded && kind !== "direct" && effectiveReplyToId) {
					threadParticipationRecorded = true;
					await recordMattermostThreadParticipation(account.accountId, channelId, effectiveReplyToId, { agentId: route.agentId });
				}
			};
			const result = await deliverMattermostReplyWithDraftPreview({
				payload: payloadEntry,
				info,
				kind,
				client,
				previewLifecycle,
				effectiveReplyToId,
				resolvePreviewFinalText,
				logVerboseMessage: monitor.logVerboseMessage,
				recordThreadParticipation: markThreadParticipation,
				deliverPayload: async (payloadToDeliver) => {
					const finalTextResolution = info.kind === "final" && !payloadToDeliver.isError && typeof payloadToDeliver.text === "string" ? draftStream.resolveFinalText(payloadToDeliver.text) : void 0;
					const resolvedPayload = finalTextResolution ? {
						...payloadToDeliver,
						text: finalTextResolution.kind === "already-delivered" ? "" : finalTextResolution.text
					} : payloadToDeliver;
					const deliveryResult = await deliverMattermostReplyPayload({
						core,
						cfg,
						payload: resolvedPayload,
						channelId,
						accountId: account.accountId,
						agentId: route.agentId,
						replyToId: resolveMattermostReplyRootId({
							kind,
							threadRootId: effectiveReplyToId,
							replyToId: payloadToDeliver.replyToId
						}),
						textLimit,
						tableMode,
						sendMessage: sendMessageMattermost
					});
					const deliveryLog = formatMattermostFinalDeliveryOutcomeLog({
						outcome: deliveryResult.outcome,
						payload: resolvedPayload,
						to,
						accountId: account.accountId,
						agentId: route.agentId
					});
					if (deliveryLog) runtime.log?.(deliveryLog);
					return deliveryResult;
				}
			}).catch(async (error) => {
				if (isChannelPartialDeliveryError(error)) await markThreadParticipation();
				throw error;
			});
			if (result.visibleReplySent) await markThreadParticipation();
			return result;
		},
		onError: (err, info) => {
			runtime.error?.(`mattermost ${info.kind} reply failed: ${String(err)}`);
		}
	};
	const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
		route,
		sessionKey: route.sessionKey
	});
	try {
		await core.channel.inbound.run({
			channel: "mattermost",
			accountId: route.accountId,
			raw: post,
			adapter: {
				ingest: () => ({
					id: post.id ?? `${to}:${Date.now()}`,
					timestamp: post.create_at ?? void 0,
					rawText,
					textForAgent: ctxPayload.BodyForAgent,
					textForCommands: ctxPayload.CommandBody,
					raw: post
				}),
				resolveTurn: () => ({
					cfg,
					channel: "mattermost",
					accountId: route.accountId,
					route: {
						agentId: route.agentId,
						dmScope: route.dmScope,
						sessionKey: route.sessionKey
					},
					ctxPayload,
					record: {
						updateLastRoute: kind === "direct" ? {
							sessionKey: inboundLastRouteSessionKey,
							channel: "mattermost",
							to,
							accountId: route.accountId,
							mainDmOwnerPin: inboundLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner ? {
								ownerRecipient: pinnedMainDmOwner,
								senderRecipient: normalizeMattermostAllowEntry(senderId),
								onSkip: ({ ownerRecipient, senderRecipient }) => {
									monitor.logVerboseMessage(`mattermost: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
								}
							} : void 0
						} : void 0,
						onRecordError: (err) => {
							monitor.logVerboseMessage(`mattermost: failed updating session meta id=${post.id ?? "unknown"}: ${String(err)}`);
						}
					},
					history: {
						isGroup: Boolean(historyKey),
						historyKey: historyKey ?? void 0,
						historyMap: channelHistories,
						limit: historyLimit
					},
					dispatcherOptions,
					delivery,
					replyOptions: {
						progressPreambleEnabled: draftProgressEnabled,
						commentaryProgressEnabled: progressDraft.commentaryProgressEnabled,
						...turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(turnAdoptionLifecycle) : {},
						allowProgressCallbacksWhenSourceDeliverySuppressed: draftProgressEnabled ? true : void 0,
						preserveProgressCallbackStartOrder: draftPreviewEnabled ? true : void 0,
						onObservedReplyDelivery: draftPreviewEnabled ? () => previewLifecycle.observeDelivery({ visibleReplySent: true }) : void 0,
						disableBlockStreaming: draftPreviewEnabled ? true : replyOptions.disableBlockStreaming,
						...suppressDefaultToolProgressMessages ? { suppressDefaultToolProgressMessages: true } : {},
						onModelSelected,
						onPartialReply: (payloadResult) => account.streamingMode === "progress" ? false : updateDraftFromPartial(payloadResult.text),
						onAssistantMessageStart: () => {
							lastPartialText = "";
							progressDraft.beginAssistantMessage();
							if (account.streamingMode === "block") {
								blockPreviewAssistantMessagePending = true;
								return false;
							}
							return false;
						},
						onReasoningEnd: () => {
							lastPartialText = "";
							progressDraft.resetReasoningProgress();
							return false;
						},
						onReasoningStream: async (payloadResult) => {
							if (account.streamingMode === "progress") return await progressDraft.pushReasoningProgress(payloadResult.text || "Thinking…", { snapshot: payloadResult.isReasoningSnapshot === true });
							if (!lastPartialText) {
								const boundarySettled = enterBlockPreviewActivity("reasoning");
								draftStream.update("Thinking…");
								previewBoundaryController.noteUpdate();
								await boundarySettled;
							}
							return false;
						},
						onPlanUpdate: async (payloadValue) => {
							if (!draftProgressEnabled || payloadValue.phase !== "update") return false;
							const boundarySettled = enterBlockPreviewActivity("tool");
							const progressSettled = progressDraft.pushPlanProgress(payloadValue.steps, {
								explanation: payloadValue.explanation,
								explanationFormat: payloadValue.explanationFormat
							});
							previewBoundaryController.noteUpdate();
							const [, visible] = await Promise.all([boundarySettled, progressSettled]);
							return visible;
						},
						onToolStart: (payload) => progressDraft.pushToolEvent(payload),
						onItemEvent: async (payloadLocal) => {
							if (!draftProgressEnabled) return false;
							if (payloadLocal.hideFromChannelProgress || payloadLocal.suppressChannelProgress) return progressDraft.pushItemEvent(payloadLocal);
							const boundarySettled = enterBlockPreviewActivity("tool");
							const progressSettled = progressDraft.pushItemEvent(payloadLocal);
							previewBoundaryController.noteUpdate();
							const [, visible] = await Promise.all([boundarySettled, progressSettled]);
							return visible;
						}
					}
				})
			}
		});
	} finally {
		try {
			await draftStream.stop();
			await previewLifecycle.cleanup();
		} catch (err) {
			monitor.logVerboseMessage(`mattermost draft preview cleanup failed: ${String(err)}`);
		}
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-posts.ts
function createMattermostPostHandler(monitor) {
	const { account, botUserId, botUsername, cfg, core, groupPolicy, pairing, resources } = monitor;
	const groupsConfigPath = resolveChannelGroupsConfigPath({
		cfg,
		channel: "mattermost",
		accountId: account.accountId,
		groups: resolveChannelGroups(cfg, "mattermost", account.accountId)
	});
	const { resolveMattermostMedia, resolveUserInfo } = resources;
	const channelHistories = /* @__PURE__ */ new Map();
	const historyLimit = resolvePromptHistoryLimit(account.config.historyLimit ?? cfg.messages?.groupChat?.historyLimit, DEFAULT_GROUP_HISTORY_LIMIT);
	const recoverThread = createMattermostThreadBackfill({
		monitor,
		channelHistories,
		historyLimit
	});
	return async (post, payload, turnAdoptionLifecycle, messageIds) => {
		const channelId = post.channel_id ?? payload.data?.channel_id ?? payload.broadcast?.channel_id;
		if (!channelId) {
			monitor.logVerboseMessage("mattermost: drop post (missing channel id)");
			return;
		}
		if (!post.id) {
			monitor.logVerboseMessage("mattermost: drop post (missing message id)");
			return;
		}
		const allMessageIds = messageIds?.length ? messageIds : [post.id];
		const senderId = post.user_id;
		if (senderId === botUserId) {
			monitor.logVerboseMessage(`mattermost: drop post (self sender=${senderId})`);
			return;
		}
		if (normalizeOptionalString(post.type) !== void 0) {
			monitor.logVerboseMessage(`mattermost: drop post (system post type=${post.type ?? "unknown"})`);
			return;
		}
		const eventPlan = await buildMattermostEventPlan(monitor, {
			channelId,
			senderId,
			postId: post.id,
			threadRootId: normalizeOptionalString(post.root_id),
			channelTypeFallback: payload.data?.channel_type,
			teamId: payload.data?.team_id,
			channelName: payload.data?.channel_name,
			channelDisplay: payload.data?.channel_display_name,
			dropLabel: "post"
		});
		if (!eventPlan) return;
		const { channelDisplay, kind, roomLabel, route, thread } = eventPlan;
		const senderName = normalizeOptionalString(payload.data?.sender_name) ?? normalizeOptionalString((await resolveUserInfo(senderId))?.username) ?? senderId;
		const rawPostText = typeof post.message === "string" ? post.message : "";
		const rawText = normalizeOptionalString(rawPostText) ?? "";
		const commandBody = normalizeMention(rawText, botUsername).trim();
		const { effectiveReplyToId, sessionKey } = thread;
		const { envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
			cfg,
			agentId: route.agentId,
			sessionKey
		});
		const historyKey = resolveMattermostPendingHistoryKey({
			kind,
			sessionKey,
			threadRootId: effectiveReplyToId
		});
		const fileIds = uniqueStrings(normalizeTrimmedStringList(post.file_ids ?? []));
		const nativeMedia = fileIds.map(() => ({}));
		const pendingBody = formatMattermostPendingMediaText({
			body: rawText,
			media: nativeMedia
		});
		const recordPendingHistory = () => {
			const trimmed = pendingBody.trim();
			createChannelHistoryWindow({ historyMap: channelHistories }).record({
				limit: historyLimit,
				historyKey: historyKey ?? "",
				entry: historyKey && trimmed ? {
					sender: senderName,
					body: trimmed,
					timestamp: typeof post.create_at === "number" ? post.create_at : void 0,
					messageId: post.id
				} : null
			});
		};
		const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
			cfg,
			surface: "mattermost"
		});
		const isControlCommand = allowTextCommands && core.channel.commands.isControlCommandMessage(commandBody, cfg);
		const accessDecision = await resolveMattermostMonitorInboundAccess({
			account,
			cfg,
			senderId,
			senderName,
			channelId,
			kind,
			groupPolicy,
			readStoreAllowFrom: pairing.readAllowFromStore,
			allowTextCommands,
			hasControlCommand: isControlCommand,
			eventKind: "message",
			mayPair: true
		});
		const commandAuthorized = accessDecision.commandAccess.authorized;
		if (accessDecision.ingress.decision !== "allow") {
			if (kind === "direct") {
				if (accessDecision.ingress.reasonCode === "dm_policy_disabled") {
					monitor.logVerboseMessage(`mattermost: drop dm (dmPolicy=disabled sender=${senderId})`);
					return;
				}
				if (accessDecision.ingress.decision === "pairing") {
					const { code, created } = await pairing.upsertPairingRequest({
						id: senderId,
						meta: { name: senderName }
					});
					monitor.logVerboseMessage(`mattermost: pairing request sender=${senderId} created=${created}`);
					if (created) try {
						await sendMessageMattermost(`channel:${channelId}`, core.channel.pairing.buildPairingReply({
							channel: "mattermost",
							idLine: `Your Mattermost user id: ${senderId}`,
							code
						}), {
							cfg,
							accountId: account.accountId
						});
						monitor.statusSink?.({ lastOutboundAt: Date.now() });
					} catch (err) {
						monitor.logVerboseMessage(`mattermost: pairing reply failed for ${senderId}: ${String(err)}`);
					}
					return;
				}
				monitor.logVerboseMessage(formatMattermostDirectMessageDropLog({
					senderId,
					dmPolicy: account.config.dmPolicy ?? "pairing",
					reasonCode: accessDecision.senderAccess.reasonCode
				}));
				return;
			}
			if (accessDecision.ingress.reasonCode === "group_policy_disabled") {
				monitor.logVerboseMessage("mattermost: drop group message (groupPolicy=disabled)");
				return;
			}
			if (accessDecision.ingress.reasonCode === "group_policy_empty_allowlist") {
				monitor.logVerboseMessage("mattermost: drop group message (no group allowlist)");
				return;
			}
			if (accessDecision.ingress.reasonCode === "group_policy_not_allowlisted") {
				if (shouldRetainMattermostSenderHistory({
					cfg,
					accountId: account.accountId,
					kind,
					ingress: accessDecision.ingress
				})) recordPendingHistory();
				monitor.logVerboseMessage(`mattermost: drop group sender=${senderId} (not in groupAllowFrom)`);
				return;
			}
			monitor.logVerboseMessage(`mattermost: drop group message (groupPolicy=${groupPolicy} reason=${accessDecision.senderAccess.reasonCode})`);
			return;
		}
		if (kind !== "direct" && accessDecision.commandAccess.shouldBlockControlCommand) {
			logInboundDrop({
				log: monitor.logVerboseMessage,
				channel: "mattermost",
				reason: "control command (unauthorized)",
				target: senderId
			});
			return;
		}
		const mentionRegexes = core.channel.mentions.buildMentionRegexes(cfg, route.agentId);
		const wasMentioned = kind !== "direct" && (matchesMattermostBotMention(rawText, botUsername) || core.channel.mentions.matchesMentionPatterns(rawText, mentionRegexes));
		const oncharEnabled = account.chatmode === "onchar" && kind !== "direct";
		const oncharPrefixes = oncharEnabled ? resolveOncharPrefixes(account.oncharPrefixes) : [];
		const oncharResult = oncharEnabled ? stripOncharPrefix(rawText, oncharPrefixes) : {
			triggered: false,
			stripped: rawText
		};
		const oncharTriggered = oncharResult.triggered;
		const canDetectMention = Boolean(botUsername) || mentionRegexes.length > 0;
		const threadAlreadyEngaged = kind !== "direct" && effectiveReplyToId ? await hasMattermostThreadParticipationWithPersistence({
			accountId: account.accountId,
			channelId,
			threadRootId: effectiveReplyToId
		}) : false;
		const shouldRequireMention = kind !== "direct" && core.channel.groups.resolveRequireMention({
			cfg,
			channel: "mattermost",
			accountId: account.accountId,
			groupId: channelId,
			requireMentionOverride: account.requireMention
		});
		const mentionDecision = resolveMattermostInboundMentionDecision({
			cfg,
			accountId: account.accountId,
			kind,
			requireMention: shouldRequireMention || oncharEnabled,
			canDetectMention: canDetectMention || oncharEnabled,
			wasMentioned: wasMentioned || oncharTriggered,
			implicitMentionKinds: implicitMentionKindWhen("bot_thread_participant", threadAlreadyEngaged),
			allowTextCommands,
			hasControlCommand: isControlCommand,
			commandAuthorized
		});
		const { shouldBypassMention } = mentionDecision;
		if (mentionDecision.shouldSkip && oncharEnabled && !oncharTriggered && !wasMentioned && !shouldBypassMention) {
			monitor.logVerboseMessage(`mattermost: drop group message (onchar not triggered channel=${channelId} sender=${senderId})`);
			recordPendingHistory();
			return;
		}
		if (mentionDecision.shouldSkip) {
			logInboundDrop({
				log: monitor.runtime.log,
				channel: "mattermost",
				reason: "no mention",
				target: channelId,
				onceKey: JSON.stringify([account.accountId, channelId]),
				hint: `Mention patterns can be derived from the agent identity name. Set ${groupsConfigPath}[${JSON.stringify(channelId)}].requireMention=false to process messages without a mention. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.`
			});
			recordPendingHistory();
			return;
		}
		const mediaList = await resolveMattermostMedia(fileIds);
		const bodyText = normalizeMention(formatMattermostInboundMediaText({
			body: oncharTriggered ? oncharResult.stripped : rawText,
			nativeMedia,
			materializedMedia: mediaList
		}), botUsername);
		if (mediaList.length === 0 && shouldDropEmptyMattermostBody({
			bodyText,
			rawText: rawPostText,
			botUsername
		})) {
			monitor.logVerboseMessage(`mattermost: drop message (empty body after normalization channel=${channelId} sender=${senderId} wasMentioned=${wasMentioned})`);
			return;
		}
		const bodyForAgent = bodyText || rawText.trim();
		core.channel.activity.record({
			channel: "mattermost",
			accountId: account.accountId,
			direction: "inbound"
		});
		const fromLabel = formatInboundFromLabel$1({
			isGroup: kind !== "direct",
			groupLabel: channelDisplay || roomLabel,
			groupId: channelId,
			groupFallback: roomLabel || "Channel",
			directLabel: senderName,
			directId: senderId
		});
		const textWithId = `${bodyText}\n[mattermost message id: ${post.id} channel: ${channelId}]`;
		const body = formatInboundEnvelope({
			channel: "Mattermost",
			from: fromLabel,
			timestamp: typeof post.create_at === "number" ? post.create_at : void 0,
			body: textWithId,
			chatType: kind,
			sender: {
				name: senderName,
				id: senderId
			},
			previousTimestamp,
			envelope: envelopeOptions
		});
		const backfill = historyKey && effectiveReplyToId ? await recoverThread({
			historyKey,
			threadRootId: effectiveReplyToId,
			currentPostId: post.id,
			currentPostTimestamp: post.create_at ?? 0,
			agentId: route.agentId,
			channelId,
			kind
		}) : void 0;
		if (backfill && !backfill.current) {
			monitor.logVerboseMessage("mattermost: drop stale thread turn after session rotation");
			return;
		}
		const turnHistories = new Map(historyKey ? [[historyKey, (backfill?.history ?? channelHistories.get(historyKey) ?? []).filter((entry) => !allMessageIds.includes(entry.messageId ?? "") && (entry.timestamp === void 0 || post.create_at == null || entry.timestamp <= post.create_at)).slice(-historyLimit)]] : []);
		let combinedBody = body;
		if (historyKey) combinedBody = createChannelHistoryWindow({ historyMap: turnHistories }).buildPendingContext({
			historyKey,
			limit: historyLimit,
			currentMessage: combinedBody,
			formatEntry: (entry) => formatInboundEnvelope({
				channel: "Mattermost",
				from: fromLabel,
				timestamp: entry.timestamp,
				body: `${entry.body}${entry.messageId ? ` [id:${entry.messageId} channel:${channelId}]` : ""}`,
				chatType: kind,
				senderLabel: entry.sender,
				envelope: envelopeOptions
			})
		});
		const inboundHistory = historyKey && historyLimit > 0 ? createChannelHistoryWindow({ historyMap: turnHistories }).buildInboundHistory({
			historyKey,
			limit: historyLimit
		}) : void 0;
		const ctxPayload = eventPlan.finalizeContext({
			Body: combinedBody,
			BodyForAgent: bodyForAgent,
			InboundHistory: inboundHistory,
			RawBody: commandBody,
			CommandBody: commandBody,
			BodyForCommands: commandBody,
			ConversationLabel: fromLabel,
			GroupSubject: kind !== "direct" ? channelDisplay || roomLabel : void 0,
			SenderName: senderName,
			MessageSid: post.id,
			MessageSids: allMessageIds.length > 1 ? allMessageIds : void 0,
			MessageSidFirst: allMessageIds.length > 1 ? allMessageIds[0] : void 0,
			MessageSidLast: allMessageIds.length > 1 ? allMessageIds[allMessageIds.length - 1] : void 0,
			Timestamp: typeof post.create_at === "number" ? post.create_at : void 0,
			WasMentioned: kind !== "direct" ? mentionDecision.effectiveWasMentioned : void 0,
			CommandAuthorized: commandAuthorized,
			CommandSource: commandAuthorized && isControlCommand ? "text" : void 0,
			...await buildMattermostInboundMediaPayload(mediaList)
		});
		const pinnedMainDmOwner = kind === "direct" ? resolvePinnedMainDmOwnerFromAllowlist({
			dmScope: cfg.session?.dmScope,
			allowFrom: account.config.allowFrom,
			normalizeEntry: normalizeMattermostAllowEntry
		}) : null;
		const previewLine = truncateUtf16Safe(bodyText, 200).replace(/\n/g, "\\n");
		monitor.logVerboseMessage(`mattermost inbound: from=${ctxPayload.From} len=${bodyText.length} preview="${previewLine}"`);
		await dispatchMattermostInboundTurn(monitor, {
			post,
			rawText,
			ctxPayload,
			eventPlan,
			historyKey,
			historyLimit,
			channelHistories,
			pinnedMainDmOwner,
			turnAdoptionLifecycle
		});
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-reactions.ts
function createMattermostReactionHandler(monitor) {
	const { account, botUserId, cfg, core, groupPolicy, pairing, resources } = monitor;
	const { resolveUserInfo } = resources;
	return async (payload) => {
		const reactionData = payload.data?.reaction;
		if (!reactionData) return;
		let reaction = null;
		if (typeof reactionData === "string") try {
			reaction = JSON.parse(reactionData);
		} catch {
			return;
		}
		else if (typeof reactionData === "object") reaction = reactionData;
		const userId = reaction?.user_id?.trim();
		const postId = reaction?.post_id?.trim();
		const emojiName = reaction?.emoji_name?.trim();
		if (!userId || !postId || !emojiName || userId === botUserId) return;
		const action = payload.event === "reaction_removed" ? "removed" : "added";
		const senderName = normalizeOptionalString((await resolveUserInfo(userId))?.username) ?? userId;
		const channelId = resolveMattermostReactionChannelId(payload);
		if (!channelId) {
			monitor.logVerboseMessage("mattermost: drop reaction (no channel_id in broadcast, cannot enforce policy)");
			return;
		}
		const eventPlan = await buildMattermostEventPlan(monitor, {
			channelId,
			senderId: userId,
			dropLabel: "reaction"
		});
		if (!eventPlan) return;
		const { kind, route } = eventPlan;
		const reactionAccess = await resolveMattermostMonitorInboundAccess({
			account,
			cfg,
			senderId: userId,
			senderName,
			channelId,
			kind,
			groupPolicy,
			readStoreAllowFrom: pairing.readAllowFromStore,
			allowTextCommands: false,
			hasControlCommand: false,
			eventKind: "reaction",
			mayPair: false
		});
		if (reactionAccess.ingress.decision !== "allow") {
			monitor.logVerboseMessage(kind === "direct" ? `mattermost: drop reaction (dmPolicy=${account.config.dmPolicy ?? "pairing"} sender=${userId} reason=${reactionAccess.senderAccess.reasonCode})` : `mattermost: drop reaction (groupPolicy=${groupPolicy} sender=${userId} reason=${reactionAccess.senderAccess.reasonCode} channel=${channelId})`);
			return;
		}
		const eventText = `Mattermost reaction ${action}: :${emojiName}: by @${senderName} on post ${postId} in channel ${channelId}`;
		core.system.enqueueSystemEvent(eventText, {
			sessionKey: route.sessionKey,
			contextKey: `mattermost:reaction:${postId}:${emojiName}:${userId}:${action}`
		});
		monitor.logVerboseMessage(`mattermost reaction: ${action} :${emojiName}: by ${senderName} on ${postId}`);
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-slash.ts
function buildSlashCommands(params) {
	const commandsToRegister = [...DEFAULT_COMMAND_SPECS];
	if (!params.nativeSkills) return commandsToRegister;
	try {
		const skillCommands = listSkillCommandsForAgents({ cfg: params.cfg });
		for (const spec of skillCommands) {
			const name = typeof spec.name === "string" ? spec.name.trim() : "";
			if (!name) continue;
			const trigger = name.startsWith("oc_") ? name : `oc_${name}`;
			commandsToRegister.push({
				trigger,
				description: spec.description || `Run skill ${name}`,
				autoComplete: true,
				autoCompleteHint: "[args]",
				originalName: name
			});
		}
	} catch (err) {
		params.runtime.error?.(`mattermost: failed to list skill commands: ${String(err)}`);
	}
	return commandsToRegister;
}
function dedupeSlashCommands(commands) {
	const seen = /* @__PURE__ */ new Set();
	return commands.filter((cmd) => {
		const key = cmd.trigger.trim();
		if (!key || seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function buildTriggerMap(commands) {
	const triggerMap = /* @__PURE__ */ new Map();
	for (const cmd of commands) if (cmd.originalName) triggerMap.set(cmd.trigger, cmd.originalName);
	return triggerMap;
}
function warnOnSuspiciousCallbackUrl(params) {
	try {
		const mmHost = new URL(normalizeMattermostBaseUrl(params.baseUrl) ?? params.baseUrl).hostname;
		const callbackHost = new URL(params.callbackUrl).hostname;
		if (isLoopbackHost(callbackHost) && !isLoopbackHost(mmHost)) params.runtime.error?.(`mattermost: slash commands callbackUrl resolved to ${params.callbackUrl} (loopback) while baseUrl is ${params.baseUrl}. This MAY be unreachable depending on your deployment. If native slash commands don't work, set channels.mattermost.commands.callbackUrl to a URL reachable from the Mattermost server (e.g. your public reverse proxy URL).`);
	} catch {}
}
async function registerSlashCommandsAcrossTeams(params) {
	const registered = [];
	let teamRegistrationFailures = 0;
	for (const team of params.teams) try {
		const created = await registerSlashCommands({
			client: params.client,
			teamId: team.id,
			creatorUserId: params.botUserId,
			callbackUrl: params.callbackUrl,
			commands: params.commands,
			log: (msg) => params.runtime.log?.(msg)
		});
		registered.push(...created);
	} catch (err) {
		teamRegistrationFailures += 1;
		params.runtime.error?.(`mattermost: failed to register slash commands for team ${team.id}: ${String(err)}`);
	}
	return {
		registered,
		teamRegistrationFailures
	};
}
async function registerMattermostMonitorSlashCommands(params) {
	const commandsRaw = params.account.config.commands;
	const slashConfig = resolveSlashCommandConfig(commandsRaw);
	if (!isSlashCommandsEnabled(slashConfig)) return;
	try {
		const teams = await fetchMattermostUserTeams(params.client, params.botUserId);
		const slashCallbackUrl = resolveCallbackUrl({
			config: slashConfig,
			gatewayPort: resolveGatewayPort(params.cfg),
			gatewayHost: params.cfg.gateway?.customBindHost ?? void 0
		});
		warnOnSuspiciousCallbackUrl({
			runtime: params.runtime,
			baseUrl: params.baseUrl,
			callbackUrl: slashCallbackUrl
		});
		const dedupedCommands = dedupeSlashCommands(buildSlashCommands({
			cfg: params.cfg,
			runtime: params.runtime,
			nativeSkills: slashConfig.nativeSkills === true
		}));
		const { registered, teamRegistrationFailures } = await registerSlashCommandsAcrossTeams({
			client: params.client,
			teams,
			botUserId: params.botUserId,
			callbackUrl: slashCallbackUrl,
			commands: dedupedCommands,
			runtime: params.runtime
		});
		if (registered.length === 0) {
			params.runtime.error?.("mattermost: native slash commands enabled but no commands could be registered; keeping slash callbacks inactive");
			return;
		}
		if (teamRegistrationFailures > 0) params.runtime.error?.(`mattermost: slash command registration completed with ${teamRegistrationFailures} team error(s)`);
		activateSlashCommands({
			account: params.account,
			commandTokens: registered.map((cmd) => cmd.token).filter(Boolean),
			registeredCommands: registered,
			triggerMap: buildTriggerMap(dedupedCommands),
			api: {
				cfg: params.cfg,
				runtime: params.runtime
			},
			log: (msg) => params.runtime.log?.(msg)
		});
		params.runtime.log?.(`mattermost: slash commands registered (${registered.length} commands across ${teams.length} teams, callback=${slashCallbackUrl})`);
	} catch (err) {
		params.runtime.error?.(`mattermost: failed to register slash commands: ${String(err)}`);
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/reconnect.ts
/**
* Reconnection loop with exponential backoff.
*
* Calls `connectFn` in a while loop. On normal resolve (connection closed),
* the backoff resets. On thrown error (connection failed), the current delay is
* used, then doubled for the next retry.
* The loop exits when `abortSignal` fires.
*/
async function runWithReconnect(connectFn, opts = {}) {
	const { initialDelayMs = 2e3, maxDelayMs = 6e4 } = opts;
	const jitterRatio = Math.max(0, opts.jitterRatio ?? 0);
	const random = opts.random ?? Math.random;
	const backoff = createReconnectBackoff(initialDelayMs, maxDelayMs);
	let attempt = 0;
	while (!opts.abortSignal?.aborted) {
		let outcome = "resolved";
		let error;
		try {
			await connectFn();
			backoff.reset();
		} catch (err) {
			if (opts.abortSignal?.aborted) return;
			outcome = "rejected";
			error = err;
			opts.onError?.(err);
		}
		if (opts.abortSignal?.aborted) return;
		const delayMs = withJitter(backoff.current(), jitterRatio, random);
		if (!(opts.shouldReconnect?.({
			attempt,
			delayMs,
			outcome,
			error
		}) ?? true)) return;
		opts.onReconnect?.(delayMs);
		await sleepAbortable(delayMs, opts.abortSignal);
		if (outcome === "rejected") backoff.increase();
		attempt++;
	}
}
function createReconnectBackoff(initialDelayMs, maxDelayMs) {
	let retryDelay = initialDelayMs;
	return {
		current: () => retryDelay,
		reset: () => {
			retryDelay = initialDelayMs;
		},
		increase: () => {
			retryDelay = Math.min(retryDelay * 2, maxDelayMs);
		}
	};
}
function withJitter(baseMs, jitterRatio, random) {
	if (jitterRatio <= 0) return baseMs;
	const normalized = Math.max(0, Math.min(1, random()));
	const spread = baseMs * jitterRatio;
	return Math.max(1, Math.round(baseMs - spread + normalized * spread * 2));
}
function sleepAbortable(ms, signal) {
	return new Promise((resolve) => {
		if (signal?.aborted) {
			resolve();
			return;
		}
		const onAbort = () => {
			clearTimeout(timer);
			resolve();
		};
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor.ts
function publishMattermostRecoveringStatus(statusSink, error) {
	statusSink?.({
		lastError: String(error),
		connected: false,
		lifecycle: "recovering"
	});
}
async function monitorMattermostProvider(opts = {}) {
	const core = getMattermostRuntime();
	const runtime = opts.runtime ?? {
		log: console.log,
		error: console.error,
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	};
	const cfg = opts.config ?? core.config.current();
	const readConfig = createRuntimeConfigReader(cfg);
	const resolveDebounceMs = () => core.channel.debounce.resolveInboundDebounceMs({
		cfg: readConfig(),
		channel: "mattermost"
	});
	const account = resolveMattermostAccount({
		cfg,
		accountId: opts.accountId
	});
	const pairing = createChannelPairingController({
		core,
		channel: "mattermost",
		accountId: account.accountId
	});
	const botToken = normalizeOptionalString(opts.botToken) ?? normalizeOptionalString(account.botToken);
	if (!botToken) throw new Error(`Mattermost bot token missing for account "${account.accountId}" (set channels.mattermost.accounts.${account.accountId}.botToken or MATTERMOST_BOT_TOKEN for default).`);
	const baseUrl = normalizeMattermostBaseUrl(opts.baseUrl ?? account.baseUrl);
	if (!baseUrl) throw new Error(`Mattermost baseUrl missing for account "${account.accountId}" (set channels.mattermost.accounts.${account.accountId}.baseUrl or MATTERMOST_URL for default).`);
	const client = createMattermostClient({
		baseUrl,
		botToken,
		allowPrivateNetwork: isPrivateNetworkOptInEnabled(account.config)
	});
	let botUser;
	await runWithReconnect(async () => {
		botUser = await fetchMattermostMe(client);
	}, {
		abortSignal: opts.abortSignal,
		jitterRatio: .2,
		shouldReconnect: ({ outcome }) => outcome === "rejected",
		onError: (err) => {
			runtime.error?.(`mattermost: API auth failed: ${String(err)}`);
			publishMattermostRecoveringStatus(opts.statusSink, err);
		},
		onReconnect: (delayMs) => {
			runtime.log?.(`mattermost: API not accessible, retrying in ${Math.round(delayMs / 1e3)}s`);
		}
	});
	if (opts.abortSignal?.aborted) return;
	const botUserId = botUser.id;
	const botUsername = normalizeOptionalString(botUser.username);
	runtime.log?.(`mattermost connected as ${botUsername ? `@${botUsername}` : botUserId}`);
	setInteractionSecret(account.accountId, botToken);
	const interactionPath = resolveInteractionCallbackPath(account.accountId);
	const callbackUrl = computeInteractionCallbackUrl(account.accountId, {
		gateway: cfg.gateway,
		interactions: account.config.interactions
	});
	setInteractionCallbackUrl(account.accountId, callbackUrl);
	const allowedInteractionSourceIps = normalizeTrimmedStringList(account.config.interactions?.allowedSourceIps);
	try {
		const mmHost = new URL(baseUrl).hostname;
		const callbackHost = new URL(callbackUrl).hostname;
		if (isLoopbackHost(callbackHost) && !isLoopbackHost(mmHost)) runtime.error?.(`mattermost: interactions callbackUrl resolved to ${callbackUrl} (loopback) while baseUrl is ${baseUrl}. This MAY be unreachable depending on your deployment. If button clicks don't work, set channels.mattermost.interactions.callbackBaseUrl to a URL reachable from the Mattermost server (e.g. your public reverse proxy URL).`);
		if (!isLoopbackHost(callbackHost) && allowedInteractionSourceIps.length === 0) runtime.error?.(`mattermost: interactions callbackUrl resolved to ${callbackUrl} without channels.mattermost.interactions.allowedSourceIps. For safety, non-loopback callback sources will be rejected until you allowlist the Mattermost server or trusted ingress IPs.`);
	} catch {}
	const logger = core.logging.getChildLogger({ module: "mattermost" });
	const logVerboseMessage = (message) => {
		if (core.logging.shouldLogVerbose()) logger.debug?.(message);
	};
	const mediaMaxBytes = resolveChannelMediaMaxBytes({
		cfg,
		resolveChannelLimitMb: () => account.config.mediaMaxMb,
		accountId: account.accountId
	}) ?? 8388608;
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy$1({
		providerConfigPresent: cfg.channels?.mattermost !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "mattermost",
		accountId: account.accountId,
		log: logVerboseMessage
	});
	const monitor = {
		core,
		runtime,
		cfg,
		account,
		client,
		pairing,
		botUserId,
		botUsername,
		groupPolicy,
		resources: createMattermostMonitorResources({
			accountId: account.accountId,
			callbackUrl,
			client,
			logger: { debug: (message) => logger.debug?.(String(message)) },
			mediaMaxBytes,
			saveRemoteMedia: (params) => core.channel.media.saveRemoteMedia(params),
			mediaKindFromMime: (contentType) => core.media.mediaKindFromMime(contentType)
		}),
		logDebugMessage: (message) => logger.debug?.(message),
		logVerboseMessage,
		statusSink: opts.statusSink
	};
	const unregisterInteractions = registerMattermostInteractions({
		monitor,
		interactionPath,
		allowedSourceIps: allowedInteractionSourceIps.length > 0 ? allowedInteractionSourceIps : ["127.0.0.1", "::1"],
		handleModelPickerInteraction: createMattermostModelPickerInteractionHandler(monitor)
	});
	try {
		await registerMattermostMonitorSlashCommands({
			client,
			cfg,
			runtime,
			account,
			baseUrl,
			botUserId
		});
	} catch (error) {
		unregisterInteractions();
		throw error;
	}
	const slashEnabled = getSlashCommandState(account.accountId) != null;
	const handlePost = createMattermostPostHandler(monitor);
	const handleReactionEvent = createMattermostReactionHandler(monitor);
	const debouncer = core.channel.debounce.createInboundDebouncer({
		debounceMs: resolveDebounceMs(),
		resolveDebounceMs,
		buildKey: (entry) => {
			const channelId = entry.post.channel_id ?? entry.payload.data?.channel_id ?? entry.payload.broadcast?.channel_id;
			if (!channelId || !entry.post.user_id) return null;
			const threadId = normalizeOptionalString(entry.post.root_id);
			return `mattermost:${account.accountId}:${channelId}:${threadId ? `thread:${threadId}` : "channel"}:${entry.post.user_id}`;
		},
		shouldDebounce: (entry) => {
			if (normalizeOptionalString(entry.post.type) !== void 0 || entry.post.file_ids?.length) return false;
			const text = normalizeOptionalString(entry.post.message) ?? "";
			return Boolean(text) && !core.channel.commands.isControlCommandMessage(normalizeMention(text, botUsername), cfg);
		},
		onFlush: (entries, createFlush) => {
			const last = entries.at(-1);
			const { lifecycle, settle } = fanInChannelIngressLifecycles(entries.map((entry) => entry.turnAdoptionLifecycle));
			return createFlush({
				lifecycle,
				dispatch: async (admissionLifecycle) => {
					if (!last) return;
					try {
						if (entries.length === 1) {
							await handlePost(last.post, last.payload, admissionLifecycle);
							await settle();
							return;
						}
						const mergedPost = {
							...last.post,
							message: entries.map((entry) => normalizeOptionalString(entry.post.message) ?? "").filter(Boolean).join("\n"),
							file_ids: []
						};
						await handlePost(mergedPost, last.payload, admissionLifecycle, entries.map((entry) => entry.post.id));
						await settle();
					} catch (error) {
						await admissionLifecycle.onAbandoned();
						throw error;
					}
				}
			});
		},
		onError: (err) => {
			runtime.error?.(`mattermost debounce flush failed: ${String(err)}`);
		}
	});
	const ingress = createMattermostIngressMonitor({
		accountId: account.accountId,
		runtime,
		abortSignal: opts.abortSignal,
		dispatch: async (post, payload, turnAdoptionLifecycle) => {
			await debouncer.enqueue({
				post,
				payload,
				turnAdoptionLifecycle
			});
			return { kind: "deferred" };
		}
	});
	let sequence = 1;
	const connectOnce = createMattermostConnectOnce({
		wsUrl: `${baseUrl.replace(/^http/i, "ws")}/api/v4/websocket`,
		botToken,
		abortSignal: opts.abortSignal,
		statusSink: opts.statusSink,
		runtime,
		webSocketFactory: opts.webSocketFactory,
		nextSeq: () => sequence++,
		getBotUpdateAt: async () => (await fetchMattermostMe(client)).update_at ?? 0,
		onPosted: ingress.receive,
		onReaction: handleReactionEvent
	});
	let slashShutdownCleanup = null;
	if (slashEnabled) {
		const runAbortCleanup = () => {
			if (slashShutdownCleanup) return;
			const commands = getSlashCommandState(account.accountId)?.registeredCommands ?? [];
			deactivateSlashCommands(account.accountId);
			slashShutdownCleanup = cleanupSlashCommands({
				client,
				commands,
				log: (message) => runtime.log?.(message)
			}).catch((err) => {
				runtime.error?.(`mattermost: slash cleanup failed: ${String(err)}`);
			});
		};
		if (opts.abortSignal?.aborted) runAbortCleanup();
		else opts.abortSignal?.addEventListener("abort", runAbortCleanup, { once: true });
	}
	try {
		await runWithReconnect(connectOnce, {
			abortSignal: opts.abortSignal,
			jitterRatio: .2,
			onError: (err) => {
				runtime.error?.(`mattermost connection failed: ${String(err)}`);
				publishMattermostRecoveringStatus(opts.statusSink, err);
			},
			onReconnect: (delayMs) => {
				runtime.log?.(`mattermost reconnecting in ${Math.round(delayMs / 1e3)}s`);
			}
		});
	} finally {
		await ingress.stop();
		unregisterInteractions();
	}
	const slashShutdownCleanupPromise = slashShutdownCleanup;
	if (slashShutdownCleanupPromise) await Promise.resolve(slashShutdownCleanupPromise);
}
//#endregion
//#region extensions/mattermost/src/mattermost/probe.ts
async function probeMattermost(baseUrl, botToken, timeoutMs = 2500, allowPrivateNetwork = false, deps) {
	const normalized = normalizeMattermostBaseUrl(baseUrl);
	if (!normalized) return {
		ok: false,
		error: "baseUrl missing"
	};
	const url = `${normalized}/api/v4/users/me`;
	const headers = { Authorization: `Bearer ${botToken}` };
	return await runChannelProbe(void 0, async ({ elapsedMs }) => {
		const resolvedTimeoutMs = timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 2500) : void 0;
		const { response: res, release } = await fetchWithSsrFGuard({
			url,
			init: { headers },
			auditContext: "mattermost-probe",
			policy: ssrfPolicyFromPrivateNetworkOptIn(allowPrivateNetwork),
			...resolvedTimeoutMs !== void 0 ? { timeoutMs: resolvedTimeoutMs } : {},
			...deps?.fetchImpl ? { fetchImpl: deps.fetchImpl } : {},
			...deps?.lookupFn ? { lookupFn: deps.lookupFn } : {}
		});
		const requestElapsedMs = elapsedMs();
		try {
			if (!res.ok) {
				const detail = await readMattermostError(res, headers);
				return {
					ok: false,
					status: res.status,
					error: detail || res.statusText,
					elapsedMs: requestElapsedMs
				};
			}
			const bot = await readProviderJsonResponse(res, "Mattermost probe /users/me");
			return {
				ok: true,
				status: res.status,
				elapsedMs: requestElapsedMs,
				bot
			};
		} finally {
			await release();
		}
	}, (error) => ({
		ok: false,
		status: null,
		error: formatErrorMessage(error)
	}));
}
//#endregion
//#region extensions/mattermost/src/mattermost/reactions.ts
const BOT_USER_CACHE_TTL_MS = 6e5;
const botUserIdCache = /* @__PURE__ */ new Map();
async function resolveBotUserId(client, cacheKey) {
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	const cached = botUserIdCache.get(cacheKey);
	if (cached) {
		if (now !== void 0 && cached.expiresAt > now) return cached.userId;
		botUserIdCache.delete(cacheKey);
	}
	const userId = (await fetchMattermostMe(client))?.id?.trim();
	if (!userId) return null;
	const expiresAt = resolveExpiresAtMsFromDurationMs(BOT_USER_CACHE_TTL_MS, { nowMs: rawNow });
	if (expiresAt !== void 0) botUserIdCache.set(cacheKey, {
		userId,
		expiresAt
	});
	return userId;
}
async function addMattermostReaction(params) {
	return runMattermostReaction(params, {
		action: "add",
		mutation: createReaction
	});
}
async function removeMattermostReaction(params) {
	return runMattermostReaction(params, {
		action: "remove",
		mutation: deleteReaction
	});
}
function parseAuthorizedReactionTarget(rawTarget) {
	const normalized = rawTarget ? normalizeMattermostMessagingTarget(rawTarget) : void 0;
	if (!normalized) return null;
	if (normalized.startsWith("channel:")) {
		const id = normalized.slice(8).trim();
		return id ? {
			kind: "channel",
			id
		} : null;
	}
	if (normalized.startsWith("user:")) {
		const id = normalized.slice(5).trim();
		return id ? {
			kind: "user",
			id
		} : null;
	}
	return null;
}
async function authorizeMattermostReactionResource(params) {
	const target = parseAuthorizedReactionTarget(params.authorizedTarget);
	if (!target) throw new Error("Mattermost delegated reactions require a canonical authorized conversation target.");
	const postChannelId = (await params.client.request(`/posts/${encodeURIComponent(params.postId)}`)).channel_id?.trim();
	if (!postChannelId) throw new Error("Mattermost reaction post is missing its conversation binding.");
	if (target.kind === "channel") {
		if (postChannelId !== target.id) throw new Error("Mattermost reaction post belongs to a different conversation.");
		return;
	}
	const botUserId = await resolveBotUserId(params.client, params.cacheKey);
	if (!botUserId) throw new Error("Mattermost reactions failed: could not resolve bot user id.");
	const channel = await fetchMattermostChannel(params.client, postChannelId);
	const participants = channel.name?.split("__").map((entry) => entry.trim()).filter(Boolean).toSorted() ?? [];
	const authorizedParticipants = [botUserId, target.id].toSorted();
	if (channel.type !== "D" || participants.length !== 2 || participants[0] !== authorizedParticipants[0] || participants[1] !== authorizedParticipants[1]) throw new Error("Mattermost reaction post belongs to a different direct conversation.");
	return botUserId;
}
async function runMattermostReaction(params, options) {
	const resolved = resolveMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const baseUrl = resolved.baseUrl?.trim();
	const botToken = resolved.botToken?.trim();
	if (!baseUrl || !botToken) return {
		ok: false,
		error: "Mattermost botToken/baseUrl missing."
	};
	const client = createMattermostClient({
		baseUrl,
		botToken,
		fetchImpl: params.fetchImpl,
		allowPrivateNetwork: isPrivateNetworkOptInEnabled(resolved.config)
	});
	const cacheKey = `${baseUrl}:${botToken}`;
	try {
		const userId = (params.conversationReadOrigin === "direct-operator" ? void 0 : await authorizeMattermostReactionResource({
			client,
			cacheKey,
			postId: params.postId,
			authorizedTarget: params.authorizedTarget
		})) ?? await resolveBotUserId(client, cacheKey);
		if (!userId) return {
			ok: false,
			error: "Mattermost reactions failed: could not resolve bot user id."
		};
		await options.mutation(client, {
			userId,
			postId: params.postId,
			emojiName: params.emojiName
		});
	} catch (err) {
		return {
			ok: false,
			error: `Mattermost ${options.action} reaction failed: ${String(err)}`
		};
	}
	return { ok: true };
}
async function createReaction(client, params) {
	await client.request("/reactions", {
		method: "POST",
		body: JSON.stringify({
			user_id: params.userId,
			post_id: params.postId,
			emoji_name: params.emojiName
		})
	});
}
async function deleteReaction(client, params) {
	const emoji = encodeURIComponent(params.emojiName);
	await client.request(`/users/${params.userId}/posts/${params.postId}/reactions/${emoji}`, { method: "DELETE" });
}
//#endregion
//#region extensions/mattermost/src/mattermost/read.ts
function parseMattermostChannelTarget(rawTarget) {
	const normalized = normalizeMattermostMessagingTarget(rawTarget);
	if (normalized?.startsWith("channel:")) return normalized.slice(8).trim() || void 0;
	const trimmed = rawTarget.trim();
	return trimmed && !trimmed.includes(":") ? trimmed : void 0;
}
function isCurrentMattermostReadTarget(params) {
	const toolContext = params.context.toolContext;
	const requesterAccountId = params.context.requesterAccountId?.trim();
	if (normalizeLowercaseStringOrEmpty(toolContext?.currentChannelProvider) !== "mattermost" || !requesterAccountId || normalizeAccountId(requesterAccountId) !== normalizeAccountId(params.accountId)) return false;
	const nativeChannelId = toolContext?.currentChannelId;
	if (typeof nativeChannelId === "string" && nativeChannelId.trim()) return parseMattermostChannelTarget(nativeChannelId) === params.channelId;
	const messagingTarget = toolContext?.currentMessagingTarget;
	return typeof messagingTarget === "string" && Boolean(messagingTarget.trim()) && parseMattermostChannelTarget(messagingTarget) === params.channelId;
}
function isConfiguredMattermostReadTarget(params) {
	const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.mattermost !== void 0,
		groupPolicy: params.account.config.groupPolicy,
		defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy
	});
	if (groupPolicy === "disabled") return false;
	if (groupPolicy === "open") return true;
	const groups = params.account.config.groups;
	return groups?.[params.channelId] !== void 0 || groups?.["*"] !== void 0;
}
async function readMattermostMessages(params) {
	const account = resolveMattermostAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.enabled) throw new Error(`Mattermost account "${account.accountId}" is disabled`);
	const baseUrl = account.baseUrl?.trim();
	const botToken = account.botToken?.trim();
	if (!baseUrl || !botToken) throw new Error("Mattermost botToken/baseUrl missing.");
	const client = createMattermostClient({
		baseUrl,
		botToken,
		fetchImpl: params.fetchImpl,
		allowPrivateNetwork: isPrivateNetworkOptInEnabled(account.config)
	});
	const directOperator = params.context.conversationReadOrigin === "direct-operator";
	const currentConversation = isCurrentMattermostReadTarget({
		accountId: account.accountId,
		channelId: params.channelId,
		context: params.context
	});
	if (!directOperator && !currentConversation) {
		const requesterAccountId = params.context.requesterAccountId?.trim();
		const sameProvider = normalizeLowercaseStringOrEmpty(params.context.toolContext?.currentChannelProvider) === "mattermost";
		const sameAccount = requesterAccountId && normalizeAccountId(requesterAccountId) === normalizeAccountId(account.accountId);
		if (!sameProvider || !sameAccount) throw new Error("Mattermost delegated reads require the current Mattermost account.");
		const channel = await fetchMattermostChannel(client, params.channelId);
		if (channel.type !== "O" && channel.type !== "P" || !isConfiguredMattermostReadTarget({
			cfg: params.cfg,
			account,
			channelId: params.channelId
		})) throw new Error("Mattermost read target channel is not allowed.");
	}
	return await fetchMattermostChannelPosts(client, params.channelId, {
		limit: params.limit,
		before: params.before,
		after: params.after
	});
}
//#endregion
export { addMattermostReaction, listMattermostDirectoryGroups, listMattermostDirectoryPeers, monitorMattermostProvider, probeMattermost, readMattermostMessages, removeMattermostReaction, resolveMattermostOpaqueTarget, sendMessageMattermost };
