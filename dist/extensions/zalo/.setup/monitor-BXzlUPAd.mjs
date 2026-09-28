import { n as resolveZaloRuntimeGroupPolicy, t as normalizeZaloAllowEntry } from "./group-access-8qHRzDHx.mjs";
import { t as getZaloRuntime } from "./runtime-Dfhzt7qb.mjs";
import { c as sendChatAction, d as setWebhook, f as ZALO_OUTBOUND_MEDIA_TTL_MS, i as deleteWebhook, l as sendMessage, n as resolveZaloProxyFetch, o as getUpdates, r as ZaloApiError, s as getWebhookInfo, u as sendPhoto } from "./send-Div0xZFE.mjs";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeModule, createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { deliverTextOrMediaReply, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
import { registerPluginHttpRoute, resolveWebhookPath } from "openclaw/plugin-sdk/webhook-ingress";
import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { createChannelPartialDeliveryError, formatInboundMediaUnavailableText, resolveChannelInboundRouteEnvelope } from "openclaw/plugin-sdk/channel-inbound";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { sleepWithAbort, waitForAbortSignal } from "openclaw/plugin-sdk/runtime-env";
import { createHostedOutboundMediaStore } from "openclaw/plugin-sdk/outbound-media";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/zalo/src/monitor-durable.ts
function prepareZaloDurableReplyPayload(params) {
	if (!params.payload.text) return params.payload;
	return {
		...params.payload,
		text: params.convertMarkdownTables(params.payload.text, params.tableMode)
	};
}
function resolveZaloDurableReplyOptions(params) {
	if (params.infoKind !== "final") return false;
	const reply = resolveSendableOutboundReplyParts(params.payload);
	if (reply.hasMedia || !reply.hasText) return false;
	return { to: params.chatId };
}
//#endregion
//#region extensions/zalo/src/outbound-media.ts
const ZALO_OUTBOUND_MEDIA_SEGMENT = "media";
const ZALO_OUTBOUND_MEDIA_PREFIX = `/${ZALO_OUTBOUND_MEDIA_SEGMENT}/`;
const ZALO_OUTBOUND_MEDIA_ID_RE = /^[a-f0-9]{24}$/;
const ZALO_OUTBOUND_MEDIA_NAMESPACE = "hosted-outbound-media";
const ZALO_OUTBOUND_MEDIA_CHUNKS_NAMESPACE = "hosted-outbound-media-chunks";
const ZALO_OUTBOUND_MEDIA_MAX_ENTRIES = 64;
const ZALO_OUTBOUND_MEDIA_MAX_CHUNK_ROWS = ZALO_OUTBOUND_MEDIA_MAX_ENTRIES * 256;
let hostedZaloMediaStore;
function createHostedZaloMediaStore() {
	const runtime = getZaloRuntime();
	return createHostedOutboundMediaStore({
		metadataStore: runtime.state.openKeyedStore({
			namespace: ZALO_OUTBOUND_MEDIA_NAMESPACE,
			maxEntries: 80
		}),
		chunkStore: runtime.state.openKeyedStore({
			namespace: ZALO_OUTBOUND_MEDIA_CHUNKS_NAMESPACE,
			maxEntries: ZALO_OUTBOUND_MEDIA_MAX_CHUNK_ROWS
		}),
		ttlMs: ZALO_OUTBOUND_MEDIA_TTL_MS,
		maxEntries: ZALO_OUTBOUND_MEDIA_MAX_ENTRIES,
		maxChunkRows: ZALO_OUTBOUND_MEDIA_MAX_CHUNK_ROWS,
		resolveExpiresAtMs: (ttlMs) => resolveExpiresAtMsFromDurationMs(ttlMs)
	});
}
function getHostedZaloMediaStore() {
	hostedZaloMediaStore ??= createHostedZaloMediaStore();
	return hostedZaloMediaStore;
}
function resolveHostedZaloMediaRoutePrefix(params) {
	const webhookRoutePath = resolveWebhookPath({
		webhookPath: params.webhookPath,
		webhookUrl: params.webhookUrl,
		defaultPath: null
	});
	if (!webhookRoutePath) throw new Error("Zalo webhookPath could not be derived for outbound media hosting");
	return webhookRoutePath === "/" ? `/${ZALO_OUTBOUND_MEDIA_SEGMENT}` : `${webhookRoutePath}/${ZALO_OUTBOUND_MEDIA_SEGMENT}`;
}
function resolveHostedZaloMediaRoutePath(params) {
	return `${resolveHostedZaloMediaRoutePrefix(params)}/`;
}
async function prepareHostedZaloMediaUrl(params) {
	const now = asDateTimestampMs(Date.now());
	if ((now === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(12e4, { nowMs: now })) === void 0) throw new Error("Zalo outbound media expiry could not be resolved");
	const routePath = resolveHostedZaloMediaRoutePath({
		webhookUrl: params.webhookUrl,
		webhookPath: params.webhookPath
	});
	const publicBaseUrl = new URL(params.webhookUrl).origin;
	return await getHostedZaloMediaStore().prepareUrl({
		mediaUrl: params.mediaUrl,
		routePath,
		publicBaseUrl,
		maxBytes: params.maxBytes,
		...params.proxyUrl ? { proxyUrl: params.proxyUrl } : {}
	});
}
async function tryHandleHostedZaloMediaRequest(req, res) {
	const store = getHostedZaloMediaStore();
	await store.cleanupExpired();
	const method = req.method ?? "GET";
	if (method !== "GET" && method !== "HEAD") return false;
	let url;
	try {
		url = new URL(req.url ?? "/", "http://localhost");
	} catch {
		return false;
	}
	const mediaPath = url.pathname;
	const prefixIndex = mediaPath.lastIndexOf(ZALO_OUTBOUND_MEDIA_PREFIX);
	if (prefixIndex < 0) return false;
	const routePath = mediaPath.slice(0, prefixIndex + ZALO_OUTBOUND_MEDIA_PREFIX.length);
	const id = mediaPath.slice(prefixIndex + ZALO_OUTBOUND_MEDIA_PREFIX.length);
	if (!id || !ZALO_OUTBOUND_MEDIA_ID_RE.test(id)) {
		res.statusCode = 404;
		res.end("Not Found");
		return true;
	}
	const now = asDateTimestampMs(Date.now());
	if (now === void 0) {
		await store.delete(id);
		res.statusCode = 410;
		res.end("Expired");
		return true;
	}
	const metadata = await store.readMetadata(id, now);
	if (!metadata || metadata.routePath !== routePath) {
		res.statusCode = 404;
		res.end("Not Found");
		return true;
	}
	const expiresAt = asDateTimestampMs(metadata.expiresAt);
	if (expiresAt === void 0 || expiresAt <= now) {
		await store.delete(id);
		res.statusCode = 410;
		res.end("Expired");
		return true;
	}
	const token = url.searchParams.get("token");
	if (!safeEqualSecret(token, metadata.token)) {
		res.statusCode = 401;
		res.end("Unauthorized");
		return true;
	}
	let servedMetadata = metadata;
	let body;
	if (method === "GET") {
		const entry = await store.read(id, now);
		if (!entry || entry.metadata.routePath !== routePath || !safeEqualSecret(token, entry.metadata.token)) {
			res.statusCode = 404;
			res.end("Not Found");
			return true;
		}
		servedMetadata = entry.metadata;
		body = entry.buffer;
	}
	if (servedMetadata.contentType) res.setHeader("Content-Type", servedMetadata.contentType);
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Content-Length", String(servedMetadata.byteLength));
	res.statusCode = 200;
	res.end(body);
	if (method === "HEAD") return true;
	await store.delete(id);
	return true;
}
//#endregion
//#region extensions/zalo/src/monitor.ts
/** Default idle timeout for Zalo inbound photo downloads (30 seconds). */
const ZALO_MEDIA_READ_IDLE_TIMEOUT_MS = 3e4;
/** Maximum wait for Zalo inbound photo response headers (120 seconds). */
const ZALO_MEDIA_RESPONSE_HEADER_TIMEOUT_MS = 12e4;
const ZALO_TEXT_LIMIT = 2e3;
const DEFAULT_MEDIA_MAX_MB = 5;
const WEBHOOK_CLEANUP_TIMEOUT_MS = 5e3;
const ZALO_TYPING_TIMEOUT_MS = 5e3;
const UNIX_MILLISECONDS_THRESHOLD = 0xe8d4a51000;
function resolveZaloTimestampMs(date) {
	if (!date) return;
	return date >= UNIX_MILLISECONDS_THRESHOLD ? date : date * 1e3;
}
const loadZaloWebhookRuntime = createLazyRuntimeNamedExport(() => import("./monitor.webhook-B_9qJI4O.mjs"), "zaloWebhookRuntime");
const loadZaloWebhookIngressRuntime = createLazyRuntimeNamedExport(() => import("./webhook-spool-BSTKDQ8X.mjs"), "zaloWebhookIngressRuntime");
const loadZaloWebhookModule = createLazyRuntimeModule(async () => ({
	...await loadZaloWebhookRuntime(),
	...await loadZaloWebhookIngressRuntime()
}));
function registerSharedHostedMediaRoute(params) {
	return registerPluginHttpRoute({
		auth: "plugin",
		match: "prefix",
		path: params.path,
		pluginId: "zalo",
		source: "zalo-hosted-media",
		log: params.log,
		reuseExistingSameOwner: true,
		throwOnFailure: true,
		handler: async (req, res) => {
			if (!await tryHandleHostedZaloMediaRequest(req, res) && !res.headersSent) {
				res.statusCode = 404;
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end("Not Found");
			}
		}
	});
}
function formatZaloError(error) {
	if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`;
	return String(error);
}
function describeWebhookTarget(rawUrl) {
	try {
		const parsed = new URL(rawUrl);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return rawUrl;
	}
}
function normalizeWebhookUrl(url) {
	const trimmed = url?.trim();
	return trimmed ? trimmed : void 0;
}
function logVerbose(core, runtime, message) {
	if (core.logging.shouldLogVerbose()) runtime.log?.(`[zalo] ${message}`);
}
async function handleZaloWebhookRequest(req, res) {
	const { handleZaloWebhookRequest: handleZaloWebhookRequestInternal } = await loadZaloWebhookModule();
	return await handleZaloWebhookRequestInternal(req, res);
}
function startPollingLoop(params) {
	const { token, account, config, runtime, core, mediaMaxMb, canHostMedia, webhookUrl, webhookPath, abortSignal, isStopped, statusSink, fetcher } = params;
	const pollTimeout = 30;
	const processingContext = {
		token,
		account,
		config,
		runtime,
		core,
		mediaMaxMb,
		canHostMedia,
		webhookUrl,
		webhookPath,
		statusSink,
		fetcher
	};
	runtime.log?.(`[${account.accountId}] Zalo polling loop started timeout=${String(pollTimeout)}s`);
	const poll = async () => {
		if (isStopped() || abortSignal.aborted) return;
		try {
			const response = await getUpdates(token, { timeout: pollTimeout }, fetcher);
			if (isStopped() || abortSignal.aborted) return;
			if (response.ok) statusSink?.(channelReadyPatch());
			if (response.ok && response.result) {
				statusSink?.({ lastInboundAt: Date.now() });
				await processUpdate({
					update: response.result,
					...processingContext
				});
			}
		} catch (err) {
			if (err instanceof ZaloApiError && err.isPollingTimeout) {} else if (!isStopped() && !abortSignal.aborted) {
				const error = formatZaloError(err);
				runtime.error?.(`[${account.accountId}] Zalo polling error: ${error}`);
				statusSink?.({
					connected: false,
					lifecycle: "recovering",
					lastError: error
				});
				await sleepWithAbort(5e3, abortSignal).catch(() => void 0);
			}
		}
		if (!isStopped() && !abortSignal.aborted) setImmediate(() => {
			poll();
		});
	};
	poll();
}
async function processUpdate(params) {
	const { update, token, account, config, runtime, core, mediaMaxMb, statusSink, fetcher } = params;
	const { event_name, message } = update;
	const sharedContext = {
		token,
		account,
		config,
		runtime,
		core,
		mediaMaxMb,
		canHostMedia: params.canHostMedia,
		webhookUrl: params.webhookUrl,
		webhookPath: params.webhookPath,
		statusSink,
		fetcher,
		turnAdoptionLifecycle: params.turnAdoptionLifecycle
	};
	if (!message) return;
	switch (event_name) {
		case "message.text.received":
			await handleTextMessage({
				message,
				...sharedContext
			});
			break;
		case "message.image.received":
			await handleImageMessage({
				message,
				...sharedContext,
				mediaMaxMb
			});
			break;
		case "message.sticker.received":
			logVerbose(core, runtime, `[${account.accountId}] Received sticker from ${message.from.id}`);
			break;
		case "message.unsupported.received": logVerbose(core, runtime, `[${account.accountId}] Received unsupported message type from ${message.from.id}`);
	}
}
async function handleTextMessage(params) {
	const { message } = params;
	const { text } = message;
	if (!text?.trim()) return;
	await processMessageWithPipeline({
		...params,
		text,
		mediaKind: void 0,
		mediaPath: void 0,
		mediaType: void 0
	});
}
async function handleImageMessage(params) {
	const { message, mediaMaxMb, account, core, runtime } = params;
	const { photo_url, caption } = message;
	const authorization = await authorizeZaloMessage({
		...params,
		text: caption,
		mediaKind: "image",
		mediaPath: void 0,
		mediaType: void 0
	});
	if (!authorization) return;
	let mediaPath;
	let mediaType;
	if (photo_url) try {
		const maxBytes = mediaMaxMb * 1024 * 1024;
		const saved = await core.channel.media.saveRemoteMedia({
			url: photo_url,
			maxBytes,
			responseHeaderTimeoutMs: ZALO_MEDIA_RESPONSE_HEADER_TIMEOUT_MS,
			readIdleTimeoutMs: ZALO_MEDIA_READ_IDLE_TIMEOUT_MS
		});
		mediaPath = saved.path;
		mediaType = saved.contentType;
	} catch (err) {
		runtime.error?.(`[${account.accountId}] Failed to download Zalo image: ${String(err)}`);
	}
	const agentBody = mediaPath ? authorization.rawBody : formatInboundMediaUnavailableText({
		body: authorization.rawBody,
		notice: "[zalo image attachment unavailable]"
	});
	await processMessageWithPipeline({
		...params,
		authorization,
		agentBody,
		mediaKind: "image",
		text: caption,
		mediaPath,
		mediaType
	});
}
async function authorizeZaloMessage(params) {
	const { message, account, config, runtime, core, text, token, statusSink, fetcher } = params;
	const pairing = createChannelPairingController({
		core,
		channel: "zalo",
		accountId: account.accountId
	});
	const { from, chat } = message;
	const isGroup = chat.chat_type === "GROUP";
	const chatId = chat.id;
	const senderId = from.id;
	const senderName = from.display_name ?? from.name;
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	const defaultGroupPolicy = resolveDefaultGroupPolicy(config);
	const rawBody = text?.trim() ?? "";
	const { groupPolicy, providerMissingFallbackApplied } = resolveZaloRuntimeGroupPolicy({
		providerConfigPresent: config.channels?.zalo !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy
	});
	const shouldComputeAuth = core.channel.commands.shouldComputeCommandAuthorized(rawBody, config);
	const resolveChannelIngress = async (contextBinding) => await core.channel.inbound.ingress.resolveStable({
		channelId: "zalo",
		accountId: account.accountId,
		identity: {
			key: "zalo-user-id",
			normalize: normalizeZaloAllowEntry,
			sensitivity: "pii",
			entryIdPrefix: "zalo-entry"
		},
		cfg: config,
		readStoreAllowFrom: async () => await pairing.readAllowFromStore(),
		subject: { stableId: senderId },
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: chatId
		},
		contextBinding,
		providerMissingFallbackApplied,
		dmPolicy,
		groupPolicy,
		policy: { groupAllowFromFallbackToAllowFrom: true },
		allowFrom: normalizeStringEntries(account.config.allowFrom),
		groupAllowFrom: normalizeStringEntries(account.config.groupAllowFrom),
		command: shouldComputeAuth ? {} : void 0
	});
	const access = await resolveChannelIngress();
	const senderAccess = access.senderAccess;
	if (isGroup) {
		warnMissingProviderGroupPolicyFallbackOnce({
			providerMissingFallbackApplied: senderAccess.providerMissingFallbackApplied,
			providerKey: "zalo",
			accountId: account.accountId,
			log: (messageValue) => logVerbose(core, runtime, messageValue)
		});
		if (!senderAccess.allowed) {
			if (senderAccess.reasonCode === "group_policy_disabled") logVerbose(core, runtime, `zalo: drop group ${chatId} (groupPolicy=disabled)`);
			else if (senderAccess.reasonCode === "group_policy_empty_allowlist") logVerbose(core, runtime, `zalo: drop group ${chatId} (groupPolicy=allowlist, no groupAllowFrom)`);
			else if (senderAccess.reasonCode === "group_policy_not_allowlisted") logVerbose(core, runtime, `zalo: drop group sender ${senderId} (groupPolicy=allowlist)`);
			return;
		}
	}
	if (!isGroup && senderAccess.decision === "block" && senderAccess.reasonCode === "dm_policy_disabled") {
		logVerbose(core, runtime, `Blocked zalo DM from ${senderId} (dmPolicy=disabled)`);
		return;
	}
	if (!isGroup && senderAccess.decision !== "allow") {
		if (dmPolicy === "pairing") await pairing.issueChallenge({
			senderId,
			senderIdLine: `Your Zalo user id: ${senderId}`,
			meta: { name: senderName ?? void 0 },
			onCreated: () => {
				logVerbose(core, runtime, `zalo pairing request sender=${senderId}`);
			},
			sendPairingReply: async (textLocal) => {
				await sendMessage(token, {
					chat_id: chatId,
					text: textLocal
				}, fetcher);
				statusSink?.({ lastOutboundAt: Date.now() });
			},
			onReplyError: (err) => {
				logVerbose(core, runtime, `zalo pairing reply failed for ${senderId}: ${String(err)}`);
			}
		});
		else logVerbose(core, runtime, `Blocked unauthorized zalo sender ${senderId} (dmPolicy=${dmPolicy})`);
		return;
	}
	return {
		channelIngress: access,
		resolveChannelIngress,
		chatId,
		commandAuthorized: access.commandAccess.requested ? access.commandAccess.authorized : void 0,
		isGroup,
		rawBody,
		senderId,
		senderName
	};
}
async function processMessageWithPipeline(params) {
	const { message, token, account, config, runtime, core, mediaPath, mediaKind, mediaType, statusSink, fetcher, agentBody: agentBodyOverride, authorization: authorizationOverride } = params;
	const { message_id, date } = message;
	const authorization = authorizationOverride ?? await authorizeZaloMessage({
		...params,
		mediaPath,
		mediaType
	});
	if (!authorization) return;
	const { isGroup, chatId, senderId, senderName, rawBody } = authorization;
	const agentBody = agentBodyOverride ?? rawBody;
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: config,
		channel: "zalo",
		accountId: account.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: chatId
		}
	});
	const channelIngress = await authorization.resolveChannelIngress({
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		messageId: message_id,
		inboundEventKind: "user_request"
	});
	if (!channelIngress.senderAccess.allowed) {
		logVerbose(core, runtime, `zalo: authorization changed before dispatch for ${senderId}`);
		return;
	}
	const commandAuthorized = channelIngress.commandAccess.requested ? channelIngress.commandAccess.authorized : void 0;
	if (isGroup && core.channel.commands.isControlCommandMessage(rawBody, config) && commandAuthorized !== true) {
		logVerbose(core, runtime, `zalo: drop control command from unauthorized sender ${senderId}`);
		return;
	}
	const fromLabel = isGroup ? `group:${chatId}` : senderName || `user:${senderId}`;
	const timestamp = resolveZaloTimestampMs(date);
	const body = buildEnvelope({
		channel: "Zalo",
		from: fromLabel,
		timestamp,
		body: agentBody
	});
	const ctxPayload = core.channel.inbound.buildContext({
		channelIngress,
		channel: "zalo",
		accountId: route.accountId,
		messageId: message_id,
		timestamp,
		from: isGroup ? `zalo:group:${chatId}` : `zalo:${senderId}`,
		sender: {
			id: senderId,
			name: senderName || void 0
		},
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: chatId,
			label: fromLabel
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: { to: `zalo:${chatId}` },
		message: {
			body,
			bodyForAgent: agentBody,
			rawBody,
			commandBody: rawBody
		},
		media: mediaKind || mediaPath || mediaType ? [{
			path: mediaPath,
			url: mediaPath,
			contentType: mediaType,
			kind: mediaKind ?? void 0
		}] : void 0,
		extra: {
			CommandAuthorized: commandAuthorized,
			GroupSubject: void 0
		}
	});
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg: config,
		channel: "zalo",
		accountId: account.accountId
	});
	await core.channel.inbound.dispatch({
		cfg: config,
		channel: "zalo",
		accountId: account.accountId,
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		delivery: {
			preparePayload: (payload) => prepareZaloDurableReplyPayload({
				payload,
				tableMode,
				convertMarkdownTables: core.channel.text.convertMarkdownTables
			}),
			durable: (payload, info) => resolveZaloDurableReplyOptions({
				payload,
				infoKind: info.kind,
				chatId
			}),
			deliver: async (payload) => {
				await deliverZaloReply({
					payload,
					token,
					chatId,
					core,
					config,
					webhookUrl: params.webhookUrl,
					webhookPath: params.webhookPath,
					proxyUrl: account.config.proxy,
					mediaMaxBytes: params.mediaMaxMb * 1024 * 1024,
					canHostMedia: params.canHostMedia,
					accountId: account.accountId,
					statusSink,
					fetcher,
					tableMode: "off"
				});
			},
			onDelivered: (_payload, _info, result) => {
				if (result?.visibleReplySent !== false) statusSink?.({ lastOutboundAt: Date.now() });
			},
			onError: (err, info) => {
				runtime.error?.(`[${account.accountId}] Zalo ${info.kind} reply failed: ${String(err)}`);
			}
		},
		replyPipeline: { typing: {
			start: async () => {
				await sendChatAction(token, {
					chat_id: chatId,
					action: "typing"
				}, fetcher, ZALO_TYPING_TIMEOUT_MS);
			},
			onStartError: (err) => {
				logTypingFailure({
					log: (messageLocal) => logVerbose(core, runtime, messageLocal),
					channel: "zalo",
					action: "start",
					target: chatId,
					error: err
				});
			}
		} },
		record: { onRecordError: (err) => {
			runtime.error?.(`zalo: failed updating session meta: ${String(err)}`);
		} },
		...params.turnAdoptionLifecycle ? { turnAdoptionLifecycle: params.turnAdoptionLifecycle } : {}
	});
}
async function deliverZaloReply(params) {
	const { payload, token, chatId, core, config, webhookUrl, webhookPath, proxyUrl, mediaMaxBytes, canHostMedia, accountId, statusSink, fetcher } = params;
	const tableMode = params.tableMode ?? "code";
	const reply = resolveSendableOutboundReplyParts(payload, { text: core.channel.text.convertMarkdownTables(payload.text ?? "", tableMode) });
	const chunkMode = core.channel.text.resolveChunkMode(config, "zalo", accountId);
	const acceptedMessageIds = [];
	let visibleReplySent = false;
	const recordAcceptedSend = (result) => {
		const messageId = result.result?.message_id;
		if (messageId) acceptedMessageIds.push(messageId);
		visibleReplySent = true;
		statusSink?.({ lastOutboundAt: Date.now() });
	};
	try {
		await deliverTextOrMediaReply({
			payload,
			text: reply.text,
			chunkText: (value) => core.channel.text.chunkMarkdownTextWithMode(value, ZALO_TEXT_LIMIT, chunkMode),
			sendText: async (chunk) => {
				recordAcceptedSend(await sendMessage(token, {
					chat_id: chatId,
					text: chunk
				}, fetcher));
			},
			sendMedia: async ({ mediaUrl, caption }) => {
				const sendableMediaUrl = canHostMedia && webhookUrl && webhookPath ? await prepareHostedZaloMediaUrl({
					mediaUrl,
					webhookUrl,
					webhookPath,
					maxBytes: mediaMaxBytes,
					proxyUrl
				}) : mediaUrl;
				recordAcceptedSend(await sendPhoto(token, {
					chat_id: chatId,
					photo: sendableMediaUrl,
					caption
				}, fetcher));
			}
		});
	} catch (error) {
		if (!visibleReplySent) throw error;
		const receipt = createMessageReceiptFromOutboundResults({
			results: acceptedMessageIds.map((messageId) => ({
				channel: "zalo",
				messageId
			})),
			kind: reply.hasMedia ? "media" : "text"
		});
		throw createChannelPartialDeliveryError(error, {
			messageIds: acceptedMessageIds,
			receipt,
			visibleReplySent: true
		});
	}
}
async function monitorZaloProvider(options) {
	const { token, account, config, runtime, abortSignal, useWebhook, webhookUrl, webhookSecret, webhookPath, statusSink, fetcher: fetcherOverride } = options;
	const core = getZaloRuntime();
	const configuredMediaMaxMb = account.config.mediaMaxMb;
	const effectiveMediaMaxMb = typeof configuredMediaMaxMb === "number" && configuredMediaMaxMb > 0 ? configuredMediaMaxMb : DEFAULT_MEDIA_MAX_MB;
	const fetcher = fetcherOverride ?? resolveZaloProxyFetch(account.config.proxy);
	const mode = useWebhook ? "webhook" : "polling";
	const effectiveWebhookUrl = normalizeWebhookUrl(webhookUrl ?? account.config.webhookUrl);
	const effectiveWebhookPath = effectiveWebhookUrl || webhookPath?.trim() || account.config.webhookPath?.trim() ? resolveWebhookPath({
		webhookPath: webhookPath ?? account.config.webhookPath,
		webhookUrl: effectiveWebhookUrl,
		defaultPath: null
	}) ?? void 0 : void 0;
	const canHostMedia = Boolean(effectiveWebhookUrl && effectiveWebhookPath);
	const hostedMediaRoutePath = canHostMedia && effectiveWebhookUrl ? resolveHostedZaloMediaRoutePrefix({
		webhookUrl: effectiveWebhookUrl,
		webhookPath: effectiveWebhookPath
	}) : void 0;
	let stopped = false;
	const stopHandlers = [];
	const asyncStopHandlers = [];
	let cleanupWebhook;
	const stop = () => {
		if (stopped) return;
		stopped = true;
		for (const handler of stopHandlers) handler();
	};
	const stopOnAbort = () => {
		if (!useWebhook) stop();
	};
	if (abortSignal.aborted) {
		stopOnAbort();
		return;
	}
	abortSignal.addEventListener("abort", stopOnAbort, { once: true });
	runtime.log?.(`[${account.accountId}] Zalo provider init mode=${mode} mediaMaxMb=${String(effectiveMediaMaxMb)}`);
	try {
		if (hostedMediaRoutePath) {
			const unregisterHostedMediaRoute = registerSharedHostedMediaRoute({
				path: hostedMediaRoutePath,
				log: runtime.log
			});
			stopHandlers.push(unregisterHostedMediaRoute);
		}
		if (useWebhook) {
			const { createZaloWebhookIngress, registerZaloWebhookTarget } = await loadZaloWebhookModule();
			if (!effectiveWebhookUrl || !webhookSecret) throw new Error("Zalo webhookUrl and webhookSecret are required for webhook mode");
			if (!effectiveWebhookUrl.startsWith("https://")) throw new Error("Zalo webhook URL must use HTTPS");
			if (webhookSecret.length < 8 || webhookSecret.length > 256) throw new Error("Zalo webhook secret must be 8-256 characters");
			const path = effectiveWebhookPath;
			if (!path) throw new Error("Zalo webhookPath could not be derived");
			runtime.log?.(`[${account.accountId}] Zalo configuring webhook path=${path} target=${describeWebhookTarget(effectiveWebhookUrl)}`);
			const ingress = createZaloWebhookIngress({
				accountId: account.accountId,
				runtime,
				deliver: async (update, turnAdoptionLifecycle) => {
					statusSink?.({ lastInboundAt: Date.now() });
					await processUpdate({
						update,
						token,
						account,
						config,
						runtime,
						core,
						mediaMaxMb: effectiveMediaMaxMb,
						canHostMedia,
						webhookUrl: effectiveWebhookUrl,
						webhookPath: path,
						statusSink,
						fetcher,
						turnAdoptionLifecycle
					});
				}
			});
			ingress.start();
			asyncStopHandlers.push(ingress.stop);
			const unregister = registerZaloWebhookTarget({
				account,
				config,
				runtime,
				path,
				secret: webhookSecret,
				acceptWebhook: ingress.accept
			}, { route: {
				auth: "plugin",
				match: "exact",
				pluginId: "zalo",
				source: "zalo-webhook",
				accountId: account.accountId,
				log: runtime.log,
				throwOnFailure: true,
				handler: async (req, res) => {
					if (!await handleZaloWebhookRequest(req, res) && !res.headersSent) {
						res.statusCode = 404;
						res.setHeader("Content-Type", "text/plain; charset=utf-8");
						res.end("Not Found");
					}
				}
			} });
			stopHandlers.push(unregister);
			await setWebhook(token, {
				url: effectiveWebhookUrl,
				secret_token: webhookSecret
			}, fetcher);
			statusSink?.(channelReadyPatch());
			let webhookCleanupPromise;
			cleanupWebhook = async () => {
				if (!webhookCleanupPromise) webhookCleanupPromise = (async () => {
					runtime.log?.(`[${account.accountId}] Zalo stopping; deleting webhook`);
					try {
						await deleteWebhook(token, fetcher, WEBHOOK_CLEANUP_TIMEOUT_MS);
						runtime.log?.(`[${account.accountId}] Zalo webhook deleted`);
					} catch (err) {
						const detail = err instanceof Error && err.name === "AbortError" ? `timed out after ${String(WEBHOOK_CLEANUP_TIMEOUT_MS)}ms` : formatZaloError(err);
						runtime.error?.(`[${account.accountId}] Zalo webhook delete failed: ${detail}`);
					}
				})();
				await webhookCleanupPromise;
			};
			runtime.log?.(`[${account.accountId}] Zalo webhook registered path=${path}`);
			await waitForAbortSignal(abortSignal);
			return;
		}
		runtime.log?.(`[${account.accountId}] Zalo polling mode: clearing webhook before startup`);
		try {
			try {
				const currentWebhookUrl = normalizeWebhookUrl((await getWebhookInfo(token, fetcher)).result?.url);
				if (!currentWebhookUrl) runtime.log?.(`[${account.accountId}] Zalo polling mode ready (no webhook configured)`);
				else {
					runtime.log?.(`[${account.accountId}] Zalo polling mode disabling existing webhook ${describeWebhookTarget(currentWebhookUrl)}`);
					await deleteWebhook(token, fetcher);
					runtime.log?.(`[${account.accountId}] Zalo polling mode ready (webhook disabled)`);
				}
			} catch (err) {
				if (err instanceof ZaloApiError && err.errorCode === 404) runtime.log?.(`[${account.accountId}] Zalo polling mode webhook inspection unavailable; continuing without webhook cleanup`);
				else throw err;
			}
		} catch (err) {
			runtime.error?.(`[${account.accountId}] Zalo polling startup could not clear webhook: ${formatZaloError(err)}`);
		}
		startPollingLoop({
			token,
			account,
			config,
			runtime,
			core,
			canHostMedia,
			webhookUrl: effectiveWebhookUrl,
			webhookPath: effectiveWebhookPath,
			abortSignal,
			isStopped: () => stopped,
			mediaMaxMb: effectiveMediaMaxMb,
			statusSink,
			fetcher
		});
		await waitForAbortSignal(abortSignal);
	} catch (err) {
		const error = formatZaloError(err);
		runtime.error?.(`[${account.accountId}] Zalo provider startup failed mode=${mode}: ${error}`);
		statusSink?.({
			connected: false,
			lifecycle: "recovering",
			lastError: error
		});
		throw err;
	} finally {
		abortSignal.removeEventListener("abort", stopOnAbort);
		await cleanupWebhook?.();
		stop();
		for (const stopAsync of asyncStopHandlers) await stopAsync();
		runtime.log?.(`[${account.accountId}] Zalo provider stopped mode=${mode}`);
	}
}
//#endregion
export { monitorZaloProvider };
