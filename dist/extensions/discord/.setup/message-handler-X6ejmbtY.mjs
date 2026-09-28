import { E as getDiscordEndpointRuntime, O as resolveDiscordEndpointMediaGuard } from "./channel-type-DKnjV1XW.mjs";
import { t as getDiscordRuntime } from "./runtime-DgnVQ7zW.mjs";
import { a as resolveDiscordChannelParentSafe, n as resolveDiscordChannelInfoSafe, r as resolveDiscordChannelNameSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-C12aDZ0p.mjs";
import { A as resolveDiscordReferencedReplyMessageId, D as hasDiscordMessageStickers, E as resolveDiscordCdnPolicy, M as resolveDiscordMessageChannelId, x as resolveDiscordMessageText } from "./transcripts-source-DVegW0WI.mjs";
import { v as createDiscordLivePolicyReader, y as mapGatewayDispatchData } from "./provider-iOf73HW-.mjs";
import { logDebug } from "openclaw/plugin-sdk/logging-core";
import { GatewayDispatchEvents } from "discord-api-types/v10";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeNullableString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { danger } from "openclaw/plugin-sdk/runtime-env";
import { resolveBatchedReplyThreadingPolicy } from "openclaw/plugin-sdk/reply-reference";
import { DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS, createChannelIngressError, createChannelIngressMonitor, createChannelRunQueue } from "openclaw/plugin-sdk/channel-outbound";
import { saveRemoteMedia } from "openclaw/plugin-sdk/media-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createChannelInboundDebouncer, resolveInboundDebounceMs, shouldDebounceTextInbound } from "openclaw/plugin-sdk/channel-inbound";
import { fanInChannelIngressLifecycles } from "openclaw/plugin-sdk/channel-ingress-runtime";
//#region extensions/discord/src/monitor/ingress.ts
const DISCORD_INGRESS_PAYLOAD_VERSION = 1;
const DISCORD_INGRESS_DRAIN_INTERVAL_MS = 1e3;
const DiscordIngressPayloadError = createChannelIngressError("DiscordIngressPayloadError");
function inspectDiscordMessage(rawMessage) {
	if (!rawMessage || typeof rawMessage !== "object" || Array.isArray(rawMessage)) throw new DiscordIngressPayloadError("Discord MESSAGE_CREATE payload must be an object");
	const candidate = rawMessage;
	const eventId = normalizeNullableString(candidate.id);
	if (!eventId) throw new DiscordIngressPayloadError("Discord MESSAGE_CREATE payload is missing its snowflake");
	const channelId = normalizeNullableString(candidate.channel_id);
	if (!channelId) throw new DiscordIngressPayloadError("Discord MESSAGE_CREATE payload is missing channel_id");
	return {
		eventId,
		laneKey: `channel:${channelId}`
	};
}
function decodeDiscordIngressPayload(payload, claimedId) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new DiscordIngressPayloadError("Discord ingress payload must be an object");
	const candidate = payload;
	try {
		inspectDiscordMessage(candidate.rawMessage);
	} catch (error) {
		throw new DiscordIngressPayloadError(`Discord ingress payload ${claimedId} is invalid`, { cause: error });
	}
	return {
		version: candidate.version,
		body: {
			receivedAt: candidate.receivedAt,
			rawMessage: candidate.rawMessage
		}
	};
}
function isDiscordAuthenticationFailure(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const candidate = current;
		if (candidate.status === 401 || candidate.statusCode === 401) return true;
		current = candidate.cause;
	}
	return false;
}
function createDiscordIngressMonitor(params) {
	const queue = params.queue ?? getDiscordRuntime().state.openChannelIngressQueue({ accountId: params.accountId });
	const monitor = createChannelIngressMonitor({
		queue,
		inspect: inspectDiscordMessage,
		payload: {
			version: DISCORD_INGRESS_PAYLOAD_VERSION,
			serialize: (rawMessage, { receivedAt }) => ({
				receivedAt,
				rawMessage
			}),
			deserialize: (body) => body.rawMessage,
			encode: ({ body }) => ({
				version: DISCORD_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload, { claim }) => decodeDiscordIngressPayload(payload, claim.id),
			createClaimError: (kind) => new DiscordIngressPayloadError(kind === "invalid-version" ? "Discord ingress payload version is unsupported" : "Discord message identity changed after durable admission")
		},
		deliver: async (rawMessage, lifecycle) => {
			const event = mapGatewayDispatchData(params.client, GatewayDispatchEvents.MessageCreate, rawMessage);
			return await params.dispatch(event, lifecycle);
		},
		pollIntervalMs: DISCORD_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			completedMaxEntries: 5e3,
			failedMaxEntries: 5e3
		},
		appendRetryDelaysMs: [0],
		drain: {
			retryPolicy: {
				maxAttempts: DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS,
				deadLetterMinAgeMs: 0
			},
			resolveNonRetryableFailure: (error) => {
				if (error instanceof DiscordIngressPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isDiscordAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: formatErrorMessage(error)
				};
				return null;
			},
			onLog: (message) => params.runtime.error?.(danger(`discord ingress: ${message}`))
		},
		onError: (error) => params.runtime.error?.(danger(`discord ingress drain failed: ${formatErrorMessage(error)}`))
	});
	return {
		accept: async (rawMessage) => {
			await monitor.admit(rawMessage);
		},
		start: monitor.start,
		stop: monitor.stop
	};
}
//#endregion
//#region extensions/discord/src/monitor/inbound-job.ts
function buildDiscordInboundJob(ctx, options) {
	const { runtime, buildContext, abortSignal, isPolicyCurrent, guildHistories, client, turnAdoptionLifecycle, threadBindings, discordRestFetch, message, data, threadChannel, ...payload } = ctx;
	const sanitizedMessage = sanitizeDiscordInboundMessage(message);
	return {
		payload: {
			...payload,
			message: sanitizedMessage,
			data: {
				...data,
				message: sanitizedMessage
			},
			threadChannel: normalizeDiscordThreadChannel(threadChannel)
		},
		runtime: {
			runtime,
			buildContext,
			abortSignal,
			isPolicyCurrent,
			guildHistories,
			client,
			turnAdoptionLifecycle,
			threadBindings,
			discordRestFetch
		},
		ingressSettlement: options?.ingressSettlement
	};
}
function materializeDiscordInboundJob(job, abortSignal) {
	return {
		...job.payload,
		...job.runtime,
		abortSignal: abortSignal ?? job.runtime.abortSignal
	};
}
function sanitizeDiscordInboundMessage(message) {
	const descriptors = Object.getOwnPropertyDescriptors(message);
	delete descriptors.channel;
	return Object.create(Object.getPrototypeOf(message), descriptors);
}
function normalizeDiscordThreadChannel(threadChannel) {
	if (!threadChannel) return null;
	const channelInfo = resolveDiscordChannelInfoSafe(threadChannel);
	const parent = resolveDiscordChannelParentSafe(threadChannel);
	return {
		id: threadChannel.id,
		name: channelInfo.name,
		parentId: channelInfo.parentId,
		parent: parent ? {
			id: resolveDiscordChannelIdSafe(parent),
			name: resolveDiscordChannelNameSafe(parent)
		} : void 0,
		ownerId: channelInfo.ownerId
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-avatar.ts
const DISCORD_AVATAR_MAX_BYTES = 262144;
const DISCORD_AVATAR_CACHE_MAX_ENTRIES = 128;
const DISCORD_GUILD_ICON_TTL_MS = 3e5;
function setBoundedEntry(map, key, value) {
	map.delete(key);
	map.set(key, value);
	while (map.size > DISCORD_AVATAR_CACHE_MAX_ENTRIES) {
		const oldest = map.keys().next().value;
		if (oldest === void 0) break;
		map.delete(oldest);
	}
}
function discordAvatarUrl(owner, id, hash) {
	return `https://cdn.discordapp.com/${owner}/${id}/${hash}.png?size=128`;
}
/** Dispatcher-lifetime resolver for eventually available Discord conversation images. */
function createDiscordAvatarResolver() {
	const saved = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Set();
	const guildIcons = /* @__PURE__ */ new Map();
	const pendingGuilds = /* @__PURE__ */ new Set();
	const resolveSavedAvatar = (key, url, endpointRuntime) => {
		const cached = saved.get(key);
		if (cached) {
			saved.delete(key);
			saved.set(key, cached);
			return cached;
		}
		if (pending.has(key) || pending.size >= DISCORD_AVATAR_CACHE_MAX_ENTRIES) return;
		let endpointGuard;
		try {
			endpointGuard = resolveDiscordEndpointMediaGuard(url, endpointRuntime);
		} catch (error) {
			logDebug(`discord conversation avatar download blocked: ${formatErrorMessage(error)}`);
			return;
		}
		pending.add(key);
		saveRemoteMedia({
			url,
			filePathHint: "conversation-avatar.png",
			maxBytes: DISCORD_AVATAR_MAX_BYTES,
			ssrfPolicy: endpointGuard?.ssrfPolicy ?? resolveDiscordCdnPolicy(),
			...endpointGuard ? { maxRedirects: endpointGuard.maxRedirects } : {}
		}).then((media) => {
			setBoundedEntry(saved, key, media.path);
		}).catch((error) => {
			logDebug(`discord conversation avatar download failed: ${formatErrorMessage(error)}`);
		}).finally(() => {
			pending.delete(key);
		});
	};
	const refreshGuildIcon = (client, guildId, conversationId, endpointRuntime) => {
		if (pendingGuilds.has(guildId) || pendingGuilds.size >= DISCORD_AVATAR_CACHE_MAX_ENTRIES) return;
		pendingGuilds.add(guildId);
		client.fetchGuild(guildId).then((guild) => {
			const hash = guild.icon ?? null;
			setBoundedEntry(guildIcons, guildId, {
				expiresAt: Date.now() + DISCORD_GUILD_ICON_TTL_MS,
				hash
			});
			if (hash) resolveSavedAvatar(`${conversationId}\0${hash}`, discordAvatarUrl("icons", guildId, hash), endpointRuntime);
		}).catch((error) => {
			logDebug(`discord guild icon lookup failed: ${formatErrorMessage(error)}`);
		}).finally(() => {
			pendingGuilds.delete(guildId);
		});
	};
	return { resolve(params) {
		const endpointRuntime = getDiscordEndpointRuntime() ?? null;
		if (!params.guildId) {
			const hash = params.author.avatar;
			return hash ? resolveSavedAvatar(`${params.conversationId}\0${hash}`, discordAvatarUrl("avatars", params.author.id, hash), endpointRuntime) : void 0;
		}
		const guildIcon = guildIcons.get(params.guildId);
		if (!guildIcon || guildIcon.expiresAt <= Date.now()) refreshGuildIcon(params.client, params.guildId, params.conversationId, endpointRuntime);
		return guildIcon?.hash ? resolveSavedAvatar(`${params.conversationId}\0${guildIcon.hash}`, discordAvatarUrl("icons", params.guildId, guildIcon.hash), endpointRuntime) : void 0;
	} };
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.batch-gate.ts
function applyImplicitReplyBatchGate(ctx, replyToMode, isBatched) {
	const replyThreading = resolveBatchedReplyThreadingPolicy(replyToMode, isBatched);
	if (!replyThreading) return;
	ctx.ReplyThreading = replyThreading;
}
//#endregion
//#region extensions/discord/src/monitor/message-run-queue.ts
const loadMessageProcessRuntime = createLazyRuntimeModule(() => import("./message-handler.process-CCmIVnxy.mjs"));
async function processDiscordQueuedMessage(params) {
	const abortSignal = params.job.runtime.abortSignal && params.lifecycleSignal ? AbortSignal.any([params.job.runtime.abortSignal, params.lifecycleSignal]) : params.job.runtime.abortSignal ?? params.lifecycleSignal;
	try {
		await (params.testing?.processDiscordMessage ?? (await loadMessageProcessRuntime()).processDiscordMessage)(materializeDiscordInboundJob(params.job, abortSignal));
		if (abortSignal?.aborted) await params.job.ingressSettlement?.cancel();
		else await params.job.ingressSettlement?.settle();
	} catch (error) {
		if (abortSignal?.aborted) await params.job.ingressSettlement?.cancel();
		else await params.job.ingressSettlement?.abandon(error);
		throw error;
	}
}
async function cleanupSkippedDiscordQueuedMessage(params) {
	await params.job.ingressSettlement?.cancel();
}
function createDiscordMessageRunQueue(params) {
	const skippedCleanup = /* @__PURE__ */ new Set();
	const runQueue = createChannelRunQueue({
		setStatus: params.setStatus,
		abortSignal: params.abortSignal,
		onError: (error) => {
			params.runtime.error(danger(`discord message run failed: ${String(error)}`));
		}
	});
	let lifecycleActive = !params.abortSignal?.aborted;
	const pendingTasks = /* @__PURE__ */ new Set();
	const onAbort = () => void cleanupSkippedQueuedMessages();
	async function cleanupSkippedQueuedMessages() {
		params.abortSignal?.removeEventListener("abort", onAbort);
		if (!lifecycleActive && skippedCleanup.size === 0) return;
		lifecycleActive = false;
		const cleanups = [...skippedCleanup];
		skippedCleanup.clear();
		for (const cleanup of cleanups) await cleanup();
	}
	if (params.abortSignal?.aborted) cleanupSkippedQueuedMessages();
	else params.abortSignal?.addEventListener("abort", onAbort, { once: true });
	return {
		enqueue(job) {
			let resolvePending;
			const pending = new Promise((resolve) => {
				resolvePending = resolve;
			});
			pendingTasks.add(pending);
			const settlePending = () => {
				pendingTasks.delete(pending);
				resolvePending();
			};
			const cleanupSkipped = async () => {
				try {
					await cleanupSkippedDiscordQueuedMessage({ job });
				} catch (error) {
					try {
						params.runtime.error(danger(`discord queued message cleanup failed: ${String(error)}`));
					} catch {}
				} finally {
					settlePending();
				}
			};
			if (!lifecycleActive) {
				cleanupSkipped();
				return;
			}
			skippedCleanup.add(cleanupSkipped);
			runQueue.enqueue(job.payload.message.id, async ({ lifecycleSignal }) => {
				skippedCleanup.delete(cleanupSkipped);
				try {
					await processDiscordQueuedMessage({
						job,
						lifecycleSignal,
						testing: params.testing
					});
				} finally {
					settlePending();
				}
			});
		},
		async deactivate() {
			runQueue.deactivate();
			await cleanupSkippedQueuedMessages();
			await Promise.allSettled(pendingTasks);
		}
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-dispatcher.ts
const loadMessagePreflightRuntime = createLazyRuntimeModule(() => import("./message-handler.preflight-DE_POxFc.mjs"));
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
function createDiscordMessageDispatcher(params) {
	const readPolicy = params.readPolicy ?? createDiscordLivePolicyReader({
		...params,
		discordConfig: {
			...params.discordConfig,
			dmPolicy: params.dmPolicy,
			allowFrom: params.allowFrom,
			guilds: params.guildEntries,
			dm: {
				...params.discordConfig?.dm,
				enabled: params.dmEnabled,
				groupEnabled: params.groupDmEnabled,
				groupChannels: params.groupDmChannels
			}
		},
		resolvedAllowlist: {
			guildEntries: params.guildEntries,
			allowFrom: params.allowFrom
		}
	});
	const readConfig = createRuntimeConfigReader(params.cfg);
	const preflightDiscordMessageImpl = params.testing?.preflightDiscordMessage;
	const messageRunQueue = createDiscordMessageRunQueue({
		runtime: params.runtime,
		setStatus: params.setStatus,
		abortSignal: params.abortSignal,
		testing: params.testing
	});
	const dispatcherShutdown = new AbortController();
	const avatarResolver = createDiscordAvatarResolver();
	const pendingDebounceEntries = /* @__PURE__ */ new Set();
	const pendingCancellationSettlements = /* @__PURE__ */ new Set();
	const resolveDebounceKey = (entry) => {
		const message = entry.data.message;
		const authorId = entry.data.author?.id;
		if (!message || !authorId) return null;
		const channelId = resolveDiscordMessageChannelId({
			message,
			eventChannelId: entry.data.channel_id
		});
		if (!channelId) return null;
		const replyTargetId = resolveDiscordReferencedReplyMessageId(message);
		return `discord:${params.accountId}:${channelId}:${authorId}:reply:${replyTargetId ?? "none"}`;
	};
	const { debouncer } = createChannelInboundDebouncer({
		cfg: params.cfg,
		channel: "discord",
		resolveDebounceMs: () => resolveInboundDebounceMs({
			cfg: readConfig(),
			channel: "discord"
		}),
		buildKey: resolveDebounceKey,
		shouldDebounce: (entry) => {
			const message = entry.data.message;
			if (!message) return false;
			const baseText = resolveDiscordMessageText(message, { includeForwarded: false });
			return shouldDebounceTextInbound({
				text: baseText,
				cfg: params.cfg,
				hasMedia: message.attachments && message.attachments.length > 0 || hasDiscordMessageStickers(message)
			});
		},
		onFlush: (entries, createFlush) => {
			const ingress = fanInChannelIngressLifecycles(entries.map((entry) => entry.turnAdoptionLifecycle));
			return createFlush({
				lifecycle: ingress.lifecycle,
				dispatch: async (admissionLifecycle) => {
					for (const entry of entries) pendingDebounceEntries.delete(entry);
					const last = entries.at(-1);
					if (!last) return;
					const abortSignal = last.abortSignal;
					if (abortSignal?.aborted) {
						await ingress.cancel();
						return;
					}
					try {
						const policy = await readPolicy();
						const { cfg } = policy;
						const ctx = await (preflightDiscordMessageImpl ?? (await loadMessagePreflightRuntime()).preflightDiscordMessage)({
							...params,
							...policy,
							isPolicyCurrent: policy.isCurrent,
							avatarResolver,
							ackReactionScope: params.discordConfig?.ackReactionScope ?? cfg.messages?.ackReactionScope ?? "group-mentions",
							abortSignal,
							data: last.data,
							client: last.client,
							precedingMessages: entries.slice(0, -1).map((entry) => entry.data.message),
							turnAdoptionLifecycle: admissionLifecycle
						});
						if (abortSignal?.aborted) {
							await ingress.cancel();
							return;
						}
						if (!ctx) {
							await ingress.settle();
							return;
						}
						applyImplicitReplyBatchGate(ctx, params.replyToMode, entries.length > 1);
						const ids = entries.map((entry) => entry.data.message?.id).filter(isNonEmptyString);
						if (entries.length > 1 && ids.length > 0) {
							const ctxBatch = ctx;
							ctxBatch.MessageSids = ids;
							ctxBatch.MessageSidFirst = ids[0];
							ctxBatch.MessageSidLast = ids[ids.length - 1];
						}
						messageRunQueue.enqueue(buildDiscordInboundJob(ctx, { ingressSettlement: ingress }));
					} catch (error) {
						if (abortSignal?.aborted) {
							await ingress.cancel();
							return;
						}
						throw error;
					}
				}
			});
		},
		onError: (err) => {
			params.runtime.error(danger(`discord debounce flush failed: ${String(err)}`));
		},
		onCancel: (entries) => {
			for (const entry of entries) {
				pendingDebounceEntries.delete(entry);
				const settlement = fanInChannelIngressLifecycles([entry.turnAdoptionLifecycle]).cancel().catch((error) => {
					params.runtime.error(danger(`discord ingress cancellation settlement failed: ${String(error)}`));
				}).finally(() => {
					pendingCancellationSettlements.delete(settlement);
				});
				pendingCancellationSettlements.add(settlement);
			}
		}
	});
	const dispatchMessage = async (data, client, options) => {
		try {
			if (dispatcherShutdown.signal.aborted || options?.abortSignal?.aborted) {
				const reason = dispatcherShutdown.signal.aborted ? dispatcherShutdown.signal.reason ?? /* @__PURE__ */ new Error("discord dispatcher shut down") : options?.abortSignal?.reason ?? /* @__PURE__ */ new Error("discord dispatch aborted");
				if (options?.turnAdoptionLifecycle) {
					await fanInChannelIngressLifecycles([options.turnAdoptionLifecycle]).cancel();
					return { kind: "deferred" };
				}
				return {
					kind: "failed-retryable",
					error: reason
				};
			}
			const msgAuthorId = data.message?.author?.id ?? data.author?.id;
			if (params.botUserId && msgAuthorId === params.botUserId) return { kind: "completed" };
			const entry = {
				data,
				client,
				abortSignal: options?.abortSignal ? AbortSignal.any([options.abortSignal, dispatcherShutdown.signal]) : dispatcherShutdown.signal,
				turnAdoptionLifecycle: options?.turnAdoptionLifecycle
			};
			const debounceKey = resolveDebounceKey(entry);
			if (debounceKey) {
				entry.debounceKey = debounceKey;
				pendingDebounceEntries.add(entry);
			}
			await debouncer.enqueue(entry);
			if (options?.turnAdoptionLifecycle) return { kind: "deferred" };
			return { kind: "completed" };
		} catch (err) {
			params.runtime.error(danger(`handler failed: ${String(err)}`));
			if (options?.turnAdoptionLifecycle) throw err;
			return { kind: "completed" };
		}
	};
	const handler = (data, client, options) => {
		const result = dispatchMessage(data, client, options);
		return options?.turnAdoptionLifecycle ? result : result.then(() => void 0);
	};
	handler.deactivate = async () => {
		dispatcherShutdown.abort(/* @__PURE__ */ new Error("discord-message-handler-deactivated"));
		const pendingKeys = new Set([...pendingDebounceEntries].map((entry) => entry.debounceKey).filter((key) => key !== void 0));
		for (const key of pendingKeys) debouncer.cancelKey(key);
		pendingDebounceEntries.clear();
		await Promise.allSettled(pendingCancellationSettlements);
		await debouncer.drain();
		await messageRunQueue.deactivate();
	};
	return handler;
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.ts
function createDiscordMessageHandler(params) {
	const dispatcher = createDiscordMessageDispatcher(params);
	const ingress = (params.testing?.createIngressMonitor ?? createDiscordIngressMonitor)({
		accountId: params.accountId,
		client: params.client,
		runtime: params.runtime,
		dispatch: (event, lifecycle) => dispatcher(event, params.client, {
			abortSignal: lifecycle.abortSignal,
			turnAdoptionLifecycle: lifecycle
		})
	});
	ingress.start();
	const activeAdmissions = /* @__PURE__ */ new Set();
	let accepting = true;
	const handler = async (rawMessage) => {
		if (!accepting) return;
		const admission = ingress.accept(rawMessage);
		activeAdmissions.add(admission);
		try {
			await admission;
		} finally {
			activeAdmissions.delete(admission);
		}
	};
	handler.deactivate = async () => {
		accepting = false;
		await Promise.allSettled(activeAdmissions);
		await dispatcher.deactivate();
		await ingress.stop();
	};
	return handler;
}
//#endregion
export { createDiscordMessageHandler as t };
