import { a as resolveInteractionCallbackPath, c as setInteractionSecret, i as createMattermostInteractionHandler, l as gateway_config_runtime_exports, n as buildButtonProps, r as computeInteractionCallbackUrl, s as setInteractionCallbackUrl } from "./interactions-LQ_rJSdf.mjs";
import { n as getOptionalMattermostRuntime, t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { a as createMattermostPost, d as fetchMattermostUser, h as normalizeMattermostBaseUrl, l as fetchMattermostChannelPosts, m as isRetryableError, n as buildMattermostApiUrl, o as deleteMattermostPost, p as fetchMattermostUserTeams, r as createMattermostClient, s as fetchMattermostChannel, t as MattermostPostSchema, u as fetchMattermostMe, v as sendMattermostTyping, y as updateMattermostPost } from "./client-B_4C9q6z.mjs";
import { C as registerPluginHttpRoute, D as resolveDefaultGroupPolicy, T as resolveChannelMediaMaxBytes, b as logTypingFailure, c as shouldRetainMattermostSenderHistory, d as createChannelHistoryWindow, f as createChannelMessageReplyPipeline, h as isDangerousNameMatchingEnabled, k as warnMissingProviderGroupPolicyFallbackOnce, l as DEFAULT_GROUP_HISTORY_LIMIT, n as authorizeMattermostCommandInvocation, o as resolveMattermostMonitorInboundAccess, p as createChannelPairingController, r as formatMattermostDirectMessageDropLog, s as resolveMattermostTrustedChatKind, t as MATTERMOST_PAIRING_QUEUE_FULL_TEXT, u as buildPreparedModelsProviderData, w as resolveAllowlistProviderRuntimeGroupPolicy, x as prepareSkillCommandsForAgents, y as logInboundDrop } from "./monitor-auth-rr4M-8gH.mjs";
import { n as normalizeMattermostAllowEntry } from "./ingress-identity-D6hxfxvo.mjs";
import { d as resolveMattermostReplyToMode, r as parseMattermostQuestionContext, u as resolveMattermostAccount } from "./normalize-Dli2PK7k.mjs";
import { _ as resolveSlashCommandConfig, a as deliverMattermostReplyPayload, c as parseMattermostModelPickerContext, d as resolveMattermostModelPickerCurrentModel, f as DEFAULT_COMMAND_SPECS, g as resolveCallbackUrl, h as registerSlashCommands, l as renderMattermostModelsPickerView, m as isSlashCommandsEnabled, n as deactivateSlashCommands, o as joinMattermostVisibleContent, p as cleanupSlashCommands, r as getSlashCommandState, s as buildMattermostAllowedModelRefs, t as activateSlashCommands, u as renderMattermostProviderPickerView } from "./slash-state-DJN_cER0.mjs";
import { t as sendMessageMattermost } from "./send-C_-GT5iF.mjs";
import { randomUUID } from "node:crypto";
import { resolvePinnedMainDmOwnerFromAllowlist, sanitizeUntrustedFileName } from "openclaw/plugin-sdk/security-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringEntries, normalizeTrimmedStringList, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { escapeRegExp, sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createAcceptedChannelDeliveryResult, createChannelPartialDeliveryError, formatInboundEnvelope, formatInboundFromLabel, formatInboundMediaUnavailableText, formatMediaPlaceholderText, implicitMentionKindWhen, isChannelPartialDeliveryError, resolveInboundMentionDecision, resolveInboundSessionEnvelopeContextAsync, toInboundMediaFactsWithMetadata } from "openclaw/plugin-sdk/channel-inbound";
import { formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { safeParseJsonWithSchema, safeParseWithSchema } from "openclaw/plugin-sdk/extension-shared";
import { resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { z } from "zod";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, createChannelProgressDraftCompositor, createFinalizableDraftLifecycle, createLivePreviewLifecycle, createMessageReceiptFromOutboundResults, createPreviewMessageReceipt, listMessageReceiptPlatformIds, resolveChannelStreamingPreviewToolProgress } from "openclaw/plugin-sdk/channel-outbound";
import { rawDataToString } from "openclaw/plugin-sdk/webhook-ingress";
import { runDetachedWebhookWork } from "openclaw/plugin-sdk/webhook-request-guards";
import { fanInChannelIngressLifecycles, resolveChannelImplicitMentions } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { resolveChannelGroups, resolveChannelGroupsConfigPath } from "openclaw/plugin-sdk/channel-policy";
import { buildTtsSupplementMediaPayload, countOutboundMedia, getReplyPayloadTtsSupplement, isReasoningReplyPayload, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { isRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { finalizeInboundContext } from "openclaw/plugin-sdk/reply-runtime";
import { getSessionEntryAsync, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { recordDeliveredCommandExchange, scopeCommandTranscriptId } from "openclaw/plugin-sdk/session-transcript-runtime";
import { channelReadyPatch, isLoopbackHost } from "openclaw/plugin-sdk/gateway-runtime";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { captureWsEventAsync, createDebugProxyWebSocketAgent, resolveDebugProxySettings } from "openclaw/plugin-sdk/proxy-capture";
import { WebSocket } from "openclaw/plugin-sdk/websocket-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { resolveInboundLastRouteSessionKey, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { chunkMarkdownTextWithMode } from "openclaw/plugin-sdk/reply-chunking";
import { createPersistentDedupeCache } from "openclaw/plugin-sdk/dedupe-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region extensions/mattermost/src/mattermost/monitor-helpers.ts
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
	const botUsername = normalizeLowercaseStringOrEmpty(params.botUsername);
	const bareMention = params.rawText.match(/^[ \t]*(@\S+)[ \t]*$/u)?.[1];
	return !botUsername || normalizeLowercaseStringOrEmpty(bareMention) !== `@${botUsername}`;
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
		const captureEvent = (event) => {
			captureWsEventAsync({
				...event,
				url: opts.wsUrl,
				flowId,
				meta: {
					subsystem: "mattermost-websocket",
					...event.meta
				}
			}).catch(() => {});
		};
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
				let stopped = false;
				let healthCheckTimer;
				let protocolPingTimer;
				let protocolPongTimer;
				let initialUpdateAt;
				let authenticationSeq;
				let authTimer;
				const stopHealthChecks = () => {
					stopped = true;
					clearTimeout(healthCheckTimer);
					clearTimeout(authTimer);
					clearTimeout(protocolPingTimer);
					clearTimeout(protocolPongTimer);
				};
				const sendProtocolPing = () => {
					if (stopped) return;
					clearTimeout(protocolPongTimer);
					protocolPongTimer = setTimeout(() => {
						protocolPongTimer = void 0;
						opts.runtime.error?.("mattermost websocket pong timeout — reconnecting");
						stopHealthChecks();
						ws.terminate();
					}, pongTimeoutMs);
					try {
						ws.ping();
					} catch (err) {
						opts.runtime.error?.(`mattermost websocket ping failed: ${String(err)}`);
						stopHealthChecks();
						ws.terminate();
					}
				};
				const scheduleProtocolPing = () => {
					if (stopped || protocolPingTimer !== void 0) return;
					protocolPingTimer = setTimeout(() => {
						protocolPingTimer = void 0;
						sendProtocolPing();
					}, pingIntervalMs);
				};
				const scheduleHealthCheck = () => {
					if (!getBotUpdateAt || stopped) return;
					healthCheckTimer = setTimeout(() => {
						healthCheckTimer = void 0;
						runHealthCheck();
					}, healthCheckIntervalMs);
				};
				const runHealthCheck = async () => {
					if (!getBotUpdateAt || stopped) return;
					try {
						const current = await getBotUpdateAt();
						if (stopped) return;
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
						if (stopped) return;
						const label = initialUpdateAt === void 0 ? "mattermost: failed to get initial update_at" : "mattermost: health check error";
						opts.runtime.error?.(`${label}: ${String(err)}`);
					} finally {
						scheduleHealthCheck();
					}
				};
				ws.on("open", () => {
					opened = true;
					captureEvent({
						direction: "local",
						kind: "ws-open"
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
					captureEvent({
						direction: "outbound",
						kind: "ws-frame",
						payload: authPayload,
						meta: { eventType: "authentication_challenge" }
					});
					ws.send(authPayload);
					authTimer = setTimeout(() => {
						authTimer = void 0;
						opts.runtime.error?.("mattermost websocket authentication timed out — reconnecting");
						stopHealthChecks();
						ws.terminate();
					}, MATTERMOST_WEBSOCKET_AUTH_TIMEOUT_MS);
					scheduleProtocolPing();
					if (getBotUpdateAt) runHealthCheck();
				});
				ws.on("pong", () => {
					clearTimeout(protocolPongTimer);
					protocolPongTimer = void 0;
					scheduleProtocolPing();
				});
				ws.on("message", async (data) => {
					const raw = rawDataToString(data);
					captureEvent({
						direction: "inbound",
						kind: "ws-frame",
						payload: Buffer.from(raw)
					});
					const payload = parseMattermostEventPayload(raw);
					if (!payload) return;
					if (payload.status === "OK" && payload.seq_reply === authenticationSeq) {
						authenticated = true;
						clearTimeout(authTimer);
						authTimer = void 0;
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
					captureEvent({
						direction: "local",
						kind: "ws-close",
						closeCode: code,
						payload: reason
					});
					stopHealthChecks();
					const message = reason.toString("utf8");
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
						resolve();
						return;
					}
					if (opened) {
						reject(new WebSocketClosedBeforeAuthenticationError(code, message || void 0));
						return;
					}
					reject(new WebSocketClosedBeforeOpenError(code, message || void 0));
				});
				ws.on("error", (err) => {
					captureEvent({
						direction: "local",
						kind: "error",
						errorText: String(err)
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
		inspect: inspectMattermostIngressEvent,
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
//#region extensions/mattermost/src/mattermost/monitor-context.ts
function shouldUpdateMattermostDraftToolProgress(account) {
	return account.streamingMode !== "off" && resolveChannelStreamingPreviewToolProgress(account.config, account.streamingMode !== "progress", account.streamingMode);
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
	if (params.outcome === "text" || params.outcome === "media") return `delivered reply to ${params.to}`;
	if (params.outcome === "empty") {
		const finalText = typeof params.payload.text === "string" ? params.payload.text.trim() : "";
		const mediaUrlCount = countOutboundMedia(params.payload);
		if (finalText.length > 0 || mediaUrlCount > 0) return `mattermost no-visible-reply: no-visible-reply-after-final-delivery to=${params.to} accountId=${params.accountId} agentId=${params.agentId ?? "unknown"} outcome=${params.outcome} finalTextLength=${finalText.length} mediaUrlCount=${mediaUrlCount}`;
	}
}
function resolveMattermostThreadSessionContext(params) {
	const effectiveReplyToId = params.kind === "direct" && params.replyToMode === "off" ? void 0 : normalizeOptionalString(params.threadRootId) ?? (params.replyToMode !== "off" ? normalizeOptionalString(params.postId) : void 0);
	const threadKeys = resolveThreadSessionKeys({
		baseSessionKey: params.baseSessionKey,
		threadId: effectiveReplyToId,
		normalizeThreadId: (threadId) => threadId,
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
	const from = kind === "direct" ? `mattermost:${params.senderId}` : kind === "group" ? `mattermost:group:${params.channelId}` : `mattermost:channel:${params.channelId}`;
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
		from,
		finalizeContext: (context) => finalizeInboundContext({
			...context,
			From: from,
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
//#region extensions/mattermost/src/mattermost/monitor-interaction-dispatch.ts
async function dispatchMattermostInteractionReply(monitor, eventPlan, params) {
	const { account, cfg, core, runtime } = monitor;
	const { channelId, kind, route, thread, to } = eventPlan;
	const { replyOptions, replyPipeline, tableMode, textLimit } = eventPlan.createReplyPlan();
	const isModelPicker = params.kind === "model picker";
	await core.channel.inbound.dispatch({
		cfg,
		channel: "mattermost",
		accountId: account.accountId,
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			sessionKey: thread.sessionKey
		},
		ctxPayload: params.ctxPayload,
		delivery: {
			observeMessageSent: true,
			deliver: async (payload) => {
				const reply = isModelPicker ? {
					...payload,
					text: core.channel.text.convertMarkdownTables(payload.text ?? "", tableMode).trim()
				} : payload;
				const result = await deliverMattermostReplyPayload({
					core,
					cfg,
					payload: reply,
					channelId,
					accountId: account.accountId,
					agentId: route.agentId,
					replyToId: resolveMattermostInteractionReplyRootId({
						kind,
						threadRootId: thread.effectiveReplyToId,
						replyToId: reply.replyToId,
						interactionMessageSid: params.interactionMessageSid,
						sourcePostId: params.sourcePostId
					}),
					textLimit,
					tableMode: isModelPicker ? "off" : tableMode,
					sendMessage: sendMessageMattermost
				});
				if (!isModelPicker && result.visibleReplySent) runtime.log?.(`delivered button-click reply to ${to}`);
				return result;
			},
			onError: (err, info) => {
				runtime.error?.(`mattermost ${params.kind} ${info.kind} reply failed: ${String(err)}`);
			}
		},
		replyPipeline,
		...!isModelPicker ? { dispatcherOptions: { humanDelay: resolveHumanDelayConfig(cfg, route.agentId) } } : {},
		replyOptions
	});
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
	const { account, cfg, client, core, pairing, resources, runtime } = monitor;
	const { resolveChannelInfo } = resources;
	const handleQuestionInteraction = createMattermostQuestionInteractionHandler(monitor);
	return registerPluginHttpRoute({
		path: params.interactionPath,
		fallbackPath: "/mattermost/interactions/default",
		auth: "plugin",
		handler: createMattermostInteractionHandler({
			client,
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
				const { channelDisplay, kind } = eventPlan;
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
				await dispatchMattermostInteractionReply(monitor, eventPlan, {
					ctxPayload,
					interactionMessageSid,
					sourcePostId,
					kind: "button-click"
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
				return { ephemeral_text: code ? core.channel.pairing.buildPairingReply({
					channel: "mattermost",
					idLine: `Your Mattermost user id: ${params.payload.user_id}`,
					code
				}) : MATTERMOST_PAIRING_QUEUE_FULL_TEXT };
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
		const sessionEntry = await getSessionEntryAsync({
			agentId: modelSessionRoute.agentId,
			storePath: resolveStorePath(cfg.session?.store, { agentId: modelSessionRoute.agentId }),
			sessionKey: modelSessionRoute.sessionKey,
			readConsistency: "latest"
		});
		const data = await buildPreparedModelsProviderData(cfg, eventPlan.route.agentId, { sessionEntry });
		const interactionId = params.payload.trigger_id ?? `${params.payload.post_id}:${params.payload.user_id}:${pickerCommandText}:${"page" in pickerState ? pickerState.page : 1}`;
		const messageSid = pickerState.action === "select" ? buildMattermostModelPickerSelectMessageSid({
			postId: params.payload.post_id,
			provider: pickerState.provider,
			model: pickerState.model
		}) : interactionId;
		const commandId = pickerState.action === "select" ? scopeCommandTranscriptId(messageSid, {
			channelId: "mattermost",
			accountId: account.accountId,
			conversationId: eventPlan.to
		}) : `mattermost:${account.accountId}:${params.payload.channel_id}:${interactionId}`;
		const updatePickerPost = async (message, buttons) => {
			const text = [data.refreshWarning, message].filter(Boolean).join("\n\n");
			const response = await updateModelPickerPost({
				channelId: params.payload.channel_id,
				postId: params.payload.post_id,
				message: text,
				buttons
			});
			await recordDeliveredCommandExchange({
				config: cfg,
				...modelSessionRoute,
				expectedSessionId: sessionEntry?.sessionId,
				commandText: pickerCommandText,
				commandId,
				replyId: "picker-update",
				replyText: [text, ...(buttons ?? []).map((row) => row.map((button) => button.text).join(", "))].join("\n")
			});
			return response;
		};
		if (data.providers.length === 0) return await updatePickerPost("No models available.");
		if (pickerState.action !== "select") {
			const currentModel = await resolveMattermostModelPickerCurrentModel({
				cfg,
				route: modelSessionRoute,
				data,
				sessionEntry
			});
			const viewParams = {
				ownerUserId: pickerState.ownerUserId,
				data,
				currentModel
			};
			const view = pickerState.action === "list" ? renderMattermostModelsPickerView({
				...viewParams,
				provider: pickerState.provider,
				page: pickerState.page
			}) : renderMattermostProviderPickerView(viewParams);
			return await updatePickerPost(view.text, view.buttons);
		}
		const targetModelRef = `${pickerState.provider}/${pickerState.model}`;
		if (!buildMattermostAllowedModelRefs(data).has(targetModelRef)) return { ephemeral_text: `That model is no longer available: ${targetModelRef}` };
		runDetachedWebhookWork(async () => {
			const commandText = `/model ${targetModelRef}`;
			const sourcePostId = params.post.id || params.payload.post_id;
			const { channelDisplay, kind, roomLabel } = eventPlan;
			const fromLabel = kind === "direct" ? `Mattermost DM from ${params.userName}` : `Mattermost message in ${roomLabel} from ${params.userName}`;
			const ctxPayload = eventPlan.finalizeContext({
				Body: commandText,
				BodyForAgent: commandText,
				RawBody: commandText,
				CommandBody: commandText,
				ConversationLabel: fromLabel,
				GroupSubject: kind !== "direct" ? channelDisplay || roomLabel : void 0,
				SenderName: params.userName,
				MessageSid: messageSid,
				Timestamp: Date.now(),
				WasMentioned: true,
				CommandAuthorized: auth.commandAuthorized,
				CommandSource: "native"
			});
			await dispatchMattermostInteractionReply(monitor, eventPlan, {
				ctxPayload,
				interactionMessageSid: messageSid,
				sourcePostId,
				kind: "model picker"
			});
			const currentModel = await resolveMattermostModelPickerCurrentModel({
				cfg,
				route: modelSessionRoute,
				data,
				sessionEntry: await getSessionEntryAsync({
					agentId: modelSessionRoute.agentId,
					storePath: resolveStorePath(cfg.session?.store, { agentId: modelSessionRoute.agentId }),
					sessionKey: modelSessionRoute.sessionKey
				})
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
//#region src/channels/mention-gating.ts
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
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
const POST_CACHE_TTL_MS = 3e5;
const MONITOR_RESOURCE_CACHE_MAX_ENTRIES = 1e3;
const MATTERMOST_MEDIA_RESPONSE_HEADER_TIMEOUT_MS = 12e4;
const MATTERMOST_MEDIA_READ_IDLE_TIMEOUT_MS = 3e4;
function createMattermostMonitorResources(params) {
	const { accountId, callbackUrl, client, logger, mediaMaxBytes, saveRemoteMedia, mediaKindFromMime } = params;
	function createCachedLookup(label, ttlMs, fetchValue) {
		const cache = /* @__PURE__ */ new Map();
		return async (id) => {
			const now = Date.now();
			const cached = cache.get(id);
			if (cached && cached.expiresAt > now) return cached.value;
			cache.delete(id);
			try {
				const value = await fetchValue(id);
				cache.delete(id);
				cache.set(id, {
					value,
					expiresAt: now + ttlMs
				});
				pruneMapToMaxSize(cache, MONITOR_RESOURCE_CACHE_MAX_ENTRIES);
				return value;
			} catch (err) {
				logger.debug?.(`mattermost: ${label} lookup failed: ${String(err)}`);
				return null;
			}
		};
	}
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
	const resolveChannelInfo = createCachedLookup("channel", CHANNEL_CACHE_TTL_MS, (channelId) => fetchMattermostChannel(client, channelId));
	const resolveUserInfo = createCachedLookup("user", USER_CACHE_TTL_MS, (userId) => fetchMattermostUser(client, userId));
	const resolvePostInfo = createCachedLookup("post", POST_CACHE_TTL_MS, async (postId) => {
		const info = MattermostPostSchema.parse(await client.request(`/posts/${encodeURIComponent(postId)}`));
		if (info.id !== postId) throw new Error("Mattermost post lookup returned a different post id");
		return info;
	});
	const updateModelPickerPost = async (paramsLocal) => {
		const props = buildButtonProps({
			callbackUrl,
			accountId,
			channelId: paramsLocal.channelId,
			buttons: paramsLocal.buttons ?? []
		}) ?? { attachments: [] };
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
		resolvePostInfo,
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
	const readIdentity = async (turn) => {
		const entry = await getSessionEntryAsync({
			agentId: turn.agentId,
			storePath: resolveStorePath(cfg.session?.store, { agentId: turn.agentId }),
			sessionKey: turn.historyKey,
			readConsistency: "latest"
		});
		return entry ? JSON.stringify([entry.sessionId ?? null, entry.lifecycleRevision ?? null]) : null;
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
		if (historyLimit <= 0 || !Number.isFinite(turn.currentPostTimestamp) || turn.currentPostTimestamp <= 0) return {};
		let identity;
		try {
			identity = await readIdentity(turn);
		} catch {
			monitor.logVerboseMessage("mattermost: thread recovery skipped (session store unavailable)");
			return {};
		}
		const previous = recoveries.get(turn.historyKey);
		let recovery = previous;
		if (!recovery || recovery.identity !== identity) {
			recovery = {
				identity,
				attempts: 0,
				nextAttemptAt: 0,
				status: "pending"
			};
			if (!previous && (channelHistories.get(turn.historyKey)?.length ?? 0) > 0) recovery.status = "seeded";
		}
		touch(turn.historyKey, recovery);
		if (recovery.completion) return { history: await recovery.completion };
		if (recovery.status === "settled") return {};
		if (recovery.status === "seeded" && channelHistories.has(turn.historyKey)) return {};
		if (recovery.attempts >= MAX_ATTEMPTS || Date.now() < recovery.nextAttemptAt || inFlight.size >= MAX_IN_FLIGHT) return {};
		recovery.attempts++;
		recovery.nextAttemptAt = Date.now() + COOLDOWN_MS;
		const owner = recovery;
		const controller = new AbortController();
		const boundedOperation = raceWithTimeout(() => {
			const operation = fetchEntries(turn, controller.signal);
			inFlight.add(operation);
			operation.then(() => inFlight.delete(operation), () => inFlight.delete(operation));
			return operation;
		}, TIMEOUT_MS, () => {
			const error = new DOMException("Mattermost thread recovery deadline", "TimeoutError");
			controller.abort(error);
			throw error;
		});
		owner.completion = (async () => {
			try {
				const entries = await boundedOperation;
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
				owner.status = error instanceof Error && isRetryableError(error) && owner.attempts < MAX_ATTEMPTS ? "pending" : "settled";
				monitor.logVerboseMessage(`mattermost: thread recovery ${owner.status === "pending" ? "retry scheduled" : "gave up"} attempt=${owner.attempts}/${MAX_ATTEMPTS}`);
				return;
			} finally {
				owner.completion = void 0;
			}
		})();
		return { history: await owner.completion };
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
function createMattermostDraftStream(params) {
	const maxChars = Math.min(params.maxChars ?? MATTERMOST_STREAM_MAX_CHARS, MATTERMOST_STREAM_MAX_CHARS);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const streamState = {
		stopped: false,
		final: false
	};
	let terminalAcceptedDeliveryError;
	const retainAcceptedDeliveryFailure = (err) => {
		if (isChannelPartialDeliveryError(err)) {
			const acceptedDeliveryError = toErrorObject(err, "Mattermost accepted delivery failed");
			streamState.stopped = true;
			terminalAcceptedDeliveryError = acceptedDeliveryError;
			return acceptedDeliveryError;
		}
	};
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
			const acceptedDeliveryError = retainAcceptedDeliveryFailure(err);
			params.warn?.(`mattermost stream preview failed: ${err instanceof Error ? err.message : String(err)}`);
			if (acceptedDeliveryError) throw acceptedDeliveryError;
			return false;
		}
	};
	const { loop, update: updateLifecycle, stop: stopLifecycle, stopForClear, clearWithStop, seal: sealLifecycle } = createFinalizableDraftLifecycle({
		throttleMs,
		coalesceInFlight: true,
		state: streamState,
		sendOrEditStreamMessage,
		readMessageId: () => currentGeneration.postId,
		clearMessageId: () => {
			currentGeneration.postId = void 0;
		},
		isValidMessageId: (value) => typeof value === "string" && value.length > 0,
		deleteMessage: (postId) => deleteMattermostPost(params.client, postId),
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
				if (streamState.stopped && !streamState.final) return;
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
				const acceptedDeliveryError = retainAcceptedDeliveryFailure(err);
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
	const settleOperation = (operation) => async () => {
		assertNoAcceptedDeliveryFailure();
		await operation();
		await currentGeneration.ready;
		assertNoAcceptedDeliveryFailure();
	};
	const discardPending = settleOperation(stopForClear);
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
			const completed = sealedText.text;
			if (!remainingText.startsWith(completed)) return {
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
	const findPostAfter = async (postId) => {
		const { messages } = await fetchMattermostChannelPosts(params.client, params.channelId, {
			after: postId,
			limit: 200,
			skipFetchThreads: true
		});
		return messages.find((post) => !post.type?.startsWith("system_") && (!params.rootId || post.root_id === params.rootId))?.id;
	};
	params.log?.(`mattermost stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update,
		updateAssistantText,
		flush: settleOperation(loop.flush),
		postId: () => currentGeneration.postId,
		clear,
		deleteCurrentMessage,
		discardPending,
		seal: settleOperation(sealLifecycle),
		stop: settleOperation(stopLifecycle),
		forceNewMessage,
		settleBoundaries,
		resolveFinalText,
		findPostAfter
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
					const newerPostId = await params.findPostAfterPreview?.(previewPostId).catch((err) => {
						params.logVerboseMessage(`mattermost preview order check failed; finalizing in place (${String(err)})`);
					});
					if (newerPostId) {
						params.logVerboseMessage(`mattermost preview ${previewPostId} is above newer post ${newerPostId}; sending the final as a new post`);
						return { visibleReplySent: false };
					}
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
		openStore: (options) => getOptionalMattermostRuntime()?.state.openKeyedStoreV2(options),
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
	const draftStream = draftPreviewEnabled ? createMattermostDraftStream({
		client,
		channelId,
		rootId: effectiveReplyToId,
		throttleMs: 1200,
		chunkText: (value) => core.channel.text.chunkMarkdownTextWithMode(core.channel.text.convertMarkdownTables(value, tableMode), textLimit, chunkMode),
		log: monitor.logVerboseMessage,
		warn: monitor.logVerboseMessage
	}) : void 0;
	let hasStreamedPreview = false;
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
			draftStream?.update(previewText);
			if (options?.flush) await draftStream?.flush();
		},
		deleteCurrent: () => draftStream?.deleteCurrentMessage()
	});
	const enterBlockPreviewActivity = (activity) => {
		if (account.streamingMode !== "block") return;
		const continuesCurrentActivity = activity === "tool" && blockPreviewActivity === "tool" || activity === "text" && blockPreviewActivity === "text" && !blockPreviewAssistantMessagePending || activity === "reasoning" && blockPreviewActivity === "reasoning";
		const startsNewGeneration = !continuesCurrentActivity && blockPreviewActivity !== "reasoning";
		if (startsNewGeneration) currentAssistantPreviewUsesPrefix = false;
		let boundarySettled;
		if (startsNewGeneration && draftStream && hasStreamedPreview) {
			hasStreamedPreview = false;
			boundarySettled = draftStream.forceNewMessage();
		}
		if (!continuesCurrentActivity) progressDraft.resetActivity();
		blockPreviewActivity = activity;
		blockPreviewAssistantMessagePending = false;
		if (activity === "tool") lastPartialText = "";
		return boundarySettled;
	};
	const previewLifecycle = createLivePreviewLifecycle({
		draft: draftStream ? {
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
		const finalText = typeof text === "string" ? text : "";
		const resolution = draftStream?.resolveFinalText(finalText) ?? {
			kind: "full",
			text: finalText,
			publishedParts: []
		};
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
		const trimmed = chunks.length === 1 ? chunks[0]?.trim() : void 0;
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
		draftStream?.updateAssistantText(previewText);
		hasStreamedPreview = true;
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
				await draftStream?.settleBoundaries();
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
				findPostAfterPreview: draftStream?.findPostAfter,
				deliverPayload: async (payloadToDeliver) => {
					const finalTextResolution = info.kind === "final" && !payloadToDeliver.isError && typeof payloadToDeliver.text === "string" ? draftStream?.resolveFinalText(payloadToDeliver.text) : void 0;
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
						...draftPreviewEnabled ? { suppressDefaultToolProgressMessages: true } : {},
						onModelSelected,
						onPartialReply: (payloadResult) => account.streamingMode === "progress" ? false : updateDraftFromPartial(payloadResult.text),
						onAssistantMessageStart: () => {
							lastPartialText = "";
							progressDraft.beginAssistantMessage();
							if (account.streamingMode === "block") blockPreviewAssistantMessagePending = true;
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
								draftStream?.update("Thinking…");
								hasStreamedPreview = true;
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
							hasStreamedPreview = true;
							const [, visible] = await Promise.all([boundarySettled, progressSettled]);
							return visible;
						},
						onToolStart: (payload) => progressDraft.pushToolEvent(payload),
						onItemEvent: async (payloadLocal) => {
							if (!draftProgressEnabled) return false;
							if (payloadLocal.hideFromChannelProgress || payloadLocal.suppressChannelProgress) return progressDraft.pushItemEvent(payloadLocal);
							const boundarySettled = enterBlockPreviewActivity("tool");
							const progressSettled = progressDraft.pushItemEvent(payloadLocal);
							hasStreamedPreview = true;
							const [, visible] = await Promise.all([boundarySettled, progressSettled]);
							return visible;
						}
					}
				})
			}
		});
	} finally {
		try {
			await draftStream?.stop();
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
	const groups = resolveChannelGroups(cfg, "mattermost", account.accountId);
	const groupsConfigPath = resolveChannelGroupsConfigPath({
		cfg,
		channel: "mattermost",
		accountId: account.accountId,
		groups
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
		const { envelopeOptions, previousTimestamp } = await resolveInboundSessionEnvelopeContextAsync({
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
		const requireMentionInBotThreads = groups?.[channelId]?.requireMentionInBotThreads ?? groups?.["*"]?.requireMentionInBotThreads ?? account.config.requireMentionInBotThreads;
		const nativeThreadRootId = normalizeOptionalString(post.root_id);
		let isBotOwnedThread = false;
		if (kind !== "direct" && nativeThreadRootId && requireMentionInBotThreads !== void 0) try {
			const root = MattermostPostSchema.safeParse(await monitor.client.request(`/posts/${encodeURIComponent(nativeThreadRootId)}`));
			isBotOwnedThread = root.success && root.data.id === nativeThreadRootId && root.data.channel_id === channelId && root.data.user_id === botUserId && !root.data.delete_at && !normalizeOptionalString(root.data.root_id);
		} catch (err) {
			monitor.logVerboseMessage(`mattermost: failed resolving thread owner channel=${channelId} root=${nativeThreadRootId}: ${String(err)}`);
		}
		const botThreadPolicy = resolveBotThreadMentionPolicy({
			isBotOwnedThread,
			requireMentionInBotThreads,
			requireMention: shouldRequireMention || oncharEnabled,
			implicitMentionKinds: implicitMentionKindWhen("bot_thread_participant", threadAlreadyEngaged)
		});
		const botThreadMentionRequired = isBotOwnedThread && requireMentionInBotThreads === true;
		const mentionDecision = resolveMattermostInboundMentionDecision({
			cfg,
			accountId: account.accountId,
			kind,
			requireMention: botThreadPolicy.requireMention,
			canDetectMention: canDetectMention || oncharEnabled || botThreadMentionRequired,
			wasMentioned: wasMentioned || oncharTriggered,
			implicitMentionKinds: botThreadPolicy.implicitMentionKinds,
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
				hint: `Mention patterns can be derived from the agent identity name. Set ${groupsConfigPath}[${JSON.stringify(channelId)}].${botThreadMentionRequired ? "requireMentionInBotThreads" : "requireMention"}=false to process messages without a mention. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.`
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
		const bodyForAgent = bodyText || rawText;
		core.channel.activity.record({
			channel: "mattermost",
			accountId: account.accountId,
			direction: "inbound"
		});
		const fromLabel = formatInboundFromLabel({
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
			media: await toInboundMediaFactsWithMetadata(mediaList)
		});
		const pinnedMainDmOwner = kind === "direct" ? resolvePinnedMainDmOwnerFromAllowlist({
			dmScope: cfg.session?.dmScope,
			allowFrom: account.config.allowFrom,
			normalizeEntry: normalizeMattermostAllowEntry
		}) : null;
		monitor.logVerboseMessage(`mattermost inbound: from=${ctxPayload.From} id=${post.id} len=${bodyText.length}`);
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
		const reactedPost = await monitor.resources.resolvePostInfo(postId);
		const eventPlan = await buildMattermostEventPlan(monitor, {
			channelId,
			senderId: userId,
			...reactedPost ? {
				postId: reactedPost.id,
				threadRootId: normalizeOptionalString(reactedPost.root_id)
			} : {},
			dropLabel: "reaction"
		});
		if (!eventPlan) return;
		const { kind, thread } = eventPlan;
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
			sessionKey: thread.sessionKey,
			contextKey: `mattermost:reaction:${postId}:${emojiName}:${userId}:${action}`
		});
		monitor.logVerboseMessage(`mattermost reaction: ${action} :${emojiName}: by ${senderName} on ${postId}`);
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/monitor-slash.ts
async function buildSlashCommands(params) {
	const commandsToRegister = [...DEFAULT_COMMAND_SPECS];
	if (!params.nativeSkills) return commandsToRegister;
	try {
		const skillCommands = await prepareSkillCommandsForAgents({ cfg: params.cfg });
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
async function registerMattermostMonitorSlashCommands(params) {
	const commandsRaw = params.account.config.commands;
	const slashConfig = resolveSlashCommandConfig(commandsRaw);
	if (!isSlashCommandsEnabled(slashConfig)) return;
	try {
		const teams = await fetchMattermostUserTeams(params.client, params.botUserId);
		const slashCallbackUrl = resolveCallbackUrl({
			config: slashConfig,
			gatewayPort: (0, gateway_config_runtime_exports.resolveGatewayPort)(params.cfg),
			gatewayHost: params.cfg.gateway?.customBindHost ?? void 0
		});
		warnOnSuspiciousCallbackUrl({
			runtime: params.runtime,
			baseUrl: params.baseUrl,
			callbackUrl: slashCallbackUrl
		});
		const dedupedCommands = dedupeSlashCommands(await buildSlashCommands({
			cfg: params.cfg,
			runtime: params.runtime,
			nativeSkills: slashConfig.nativeSkills === true
		}));
		const registered = [];
		let teamRegistrationFailures = 0;
		for (const team of teams) try {
			const created = await registerSlashCommands({
				client: params.client,
				teamId: team.id,
				creatorUserId: params.botUserId,
				callbackUrl: slashCallbackUrl,
				commands: dedupedCommands,
				log: (msg) => params.runtime.log?.(msg)
			});
			registered.push(...created);
		} catch (err) {
			teamRegistrationFailures += 1;
			params.runtime.error?.(`mattermost: failed to register slash commands for team ${team.id}: ${String(err)}`);
		}
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
async function runWithReconnect(connectFn, opts = {}) {
	const { initialDelayMs = 2e3, maxDelayMs = 6e4 } = opts;
	const jitterRatio = Math.max(0, opts.jitterRatio ?? 0);
	const random = opts.random ?? Math.random;
	let retryDelay = initialDelayMs;
	while (!opts.abortSignal?.aborted) {
		let failed = false;
		try {
			await connectFn();
		} catch (err) {
			if (opts.abortSignal?.aborted) return;
			failed = true;
			opts.onError?.(err);
		}
		if (opts.abortSignal?.aborted) return;
		if (!failed) retryDelay = initialDelayMs;
		const delayMs = withJitter(retryDelay, jitterRatio, random);
		if (!failed && opts.reconnectAfterClose === false) return;
		opts.onReconnect?.(delayMs);
		try {
			await setTimeout$1(delayMs, void 0, { signal: opts.abortSignal });
		} catch (delayError) {
			if (!opts.abortSignal?.aborted) throw delayError;
		}
		if (failed) retryDelay = Math.min(retryDelay * 2, maxDelayMs);
	}
}
function withJitter(baseMs, jitterRatio, random) {
	if (jitterRatio <= 0) return baseMs;
	const normalized = Math.max(0, Math.min(1, random()));
	const spread = baseMs * jitterRatio;
	return Math.max(1, Math.round(baseMs - spread + normalized * spread * 2));
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
		allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true
	});
	let botUser;
	await runWithReconnect(async () => {
		botUser = await fetchMattermostMe(client);
	}, {
		abortSignal: opts.abortSignal,
		jitterRatio: .2,
		reconnectAfterClose: false,
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
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
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
						const mergedPost = entries.length === 1 ? last.post : {
							...last.post,
							message: entries.map((entry) => normalizeOptionalString(entry.post.message) ?? "").filter(Boolean).join("\n"),
							file_ids: []
						};
						await handlePost(mergedPost, last.payload, admissionLifecycle, entries.length > 1 ? entries.map((entry) => entry.post.id) : void 0);
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
	await Promise.resolve(slashShutdownCleanup);
}
//#endregion
export { monitorMattermostProvider };
