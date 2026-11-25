import { q as withDiscordRequestAuthority } from "./discord-cXPUdHQi.mjs";
import { i as resolveDiscordEndpointMediaGuard, n as getDiscordEndpointRuntime } from "./endpoint-runtime-BM3x-m6O.mjs";
import { t as getDiscordRuntime } from "./runtime-DcBvHOm1.mjs";
import { D as createMessageDispatchData, E as createDiscordLivePolicyReader } from "./provider-BvhSlcJy.mjs";
import { E as hasDiscordMessageStickers, T as resolveDiscordCdnPolicy, b as resolveDiscordMessageText, j as resolveDiscordMessageChannelId, k as resolveDiscordReferencedReplyMessageId } from "./transcripts-source-C3F_ErM1.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { danger } from "openclaw/plugin-sdk/runtime-env";
import { normalizeNullableString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createRuntimeConfigReader } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { Routes } from "discord-api-types/v10";
import { saveRemoteMedia } from "openclaw/plugin-sdk/media-runtime";
import { logDebug } from "openclaw/plugin-sdk/logging-core";
import { createDeferred } from "openclaw/plugin-sdk/concurrency-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS, createChannelIngressError, createChannelIngressMonitor, createChannelRunQueue, resolveChannelMessageSourceReplyDeliveryMode } from "openclaw/plugin-sdk/channel-outbound";
import { racePromiseWithAbortSignal } from "openclaw/plugin-sdk/time-runtime";
import { fanInChannelIngressLifecycles, prepareChannelIngressEvent } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { createChannelInboundDebouncer, resolveInboundDebounceMs, shouldDebounceTextInbound } from "openclaw/plugin-sdk/channel-inbound";
// extensions/discord/src/monitor/ingress.ts
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
		abortSignal: params.abortSignal,
		inspect: inspectDiscordMessage,
		prepareAdmission: async (rawMessage, { receivedAt, signal }) => {
			const prepared = await prepareChannelIngressEvent(rawMessage, {
				channelId: "discord",
				accountId: params.accountId,
				signal
			});
			if (!prepared) return;
			return {
				raw: decodeDiscordIngressPayload({
					version: DISCORD_INGRESS_PAYLOAD_VERSION,
					receivedAt,
					rawMessage: prepared.event
				}, rawMessage.id).body.rawMessage,
				assertCurrent: prepared.assertCurrent
			};
		},
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
			const event = createMessageDispatchData(params.client, rawMessage);
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
			prioritizePending: ({ payload }) => {
				const raw = payload?.rawMessage;
				return Boolean(params.botUserId && raw?.guild_id && Date.parse(raw.timestamp) >= Date.now() - 9e5 && Array.isArray(raw.mentions) && raw.mentions.some((user) => user?.id === params.botUserId));
			},
			deferredLaneOccupancy: "release",
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
			onDeadLetter: async (claim, _failure, signal) => {
				const { rawMessage } = decodeDiscordIngressPayload(claim.payload, claim.id).body;
				await params.onDeadLetter?.(createMessageDispatchData(params.client, rawMessage), signal);
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
// extensions/discord/src/monitor/message-avatar.ts
const DISCORD_AVATAR_MAX_BYTES = 262144;
const DISCORD_AVATAR_CACHE_MAX_ENTRIES = 128;
const DISCORD_GUILD_ICON_TTL_MS = 3e5;
function setBoundedEntry(map, key, value) {
	map.delete(key);
	map.set(key, value);
	pruneMapToMaxSize(map, DISCORD_AVATAR_CACHE_MAX_ENTRIES);
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
				expiresAt: performance.now() + DISCORD_GUILD_ICON_TTL_MS,
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
		if (!guildIcon || guildIcon.expiresAt <= performance.now()) refreshGuildIcon(params.client, params.guildId, params.conversationId, endpointRuntime);
		return guildIcon?.hash ? resolveSavedAvatar(`${params.conversationId}\0${guildIcon.hash}`, discordAvatarUrl("icons", params.guildId, guildIcon.hash), endpointRuntime) : void 0;
	} };
}
// extensions/discord/src/monitor/message-dispatcher.ts
const loadMessagePreflightRuntime = createLazyRuntimeModule(() => import("./message-handler.preflight-BrKcDJ2G.mjs"));
const loadMessageProcessRuntime = createLazyRuntimeModule(() => import("./message-handler.process-GpZpRyHA.mjs"));
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
	const dispatcherShutdown = new AbortController();
	const avatarResolver = createDiscordAvatarResolver();
	const preflightMessage = async (data, client, options) => {
		const policy = await readPolicy();
		const { preflightDiscordMessage } = await loadMessagePreflightRuntime();
		return await preflightDiscordMessage({
			...params,
			...policy,
			...options,
			readPolicy,
			isPolicyCurrent: policy.isCurrent,
			avatarResolver,
			ackReactionScope: params.discordConfig?.ackReactionScope ?? policy.cfg.messages?.ackReactionScope ?? "group-mentions",
			data,
			client
		});
	};
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
						const ctx = await racePromiseWithAbortSignal(() => preflightMessage(last.data, last.client, {
							abortSignal,
							precedingMessages: entries.slice(0, -1).map((entry) => entry.data.message),
							turnAdoptionLifecycle: admissionLifecycle
						}), abortSignal);
						if (abortSignal?.aborted) {
							await ingress.cancel();
							return;
						}
						if (!ctx) {
							await ingress.settle();
							return;
						}
						const { promise: pending, resolve: resolvePending } = createDeferred();
						pendingTasks.add(pending);
						const settlePending = () => {
							pendingTasks.delete(pending);
							resolvePending();
						};
						const cleanupSkipped = async () => {
							try {
								await ingress.cancel();
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
						runQueue.enqueue(ctx.message.id, async ({ lifecycleSignal }) => {
							skippedCleanup.delete(cleanupSkipped);
							try {
								const processAbortSignal = ctx.abortSignal && lifecycleSignal ? AbortSignal.any([ctx.abortSignal, lifecycleSignal]) : ctx.abortSignal ?? lifecycleSignal;
								try {
									await racePromiseWithAbortSignal(async () => {
										const { processDiscordMessage } = await loadMessageProcessRuntime();
										await processDiscordMessage({
											...ctx,
											abortSignal: processAbortSignal
										});
									}, processAbortSignal);
									if (processAbortSignal?.aborted) await ingress.cancel();
									else await ingress.settle();
								} catch (error) {
									if (processAbortSignal?.aborted) await ingress.cancel();
									else {
										await ingress.abandon(error);
										throw error;
									}
								}
							} finally {
								settlePending();
							}
						});
						await pending;
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
			return { kind: options?.turnAdoptionLifecycle ? "deferred" : "completed" };
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
	handler.notifyDeadLetter = async (data, client, signal) => {
		const abortSignal = AbortSignal.any([
			signal,
			dispatcherShutdown.signal,
			...params.abortSignal ? [params.abortSignal] : []
		]);
		const ctx = await preflightMessage(data, client, { abortSignal });
		if (!ctx) {
			params.runtime.error(danger(`discord ingress: dead-letter notice suppressed for ${data.message.id} (access or reply policy denied, or authority expired)`));
			return;
		}
		const assertCurrent = () => {
			abortSignal.throwIfAborted();
			if (!lifecycleActive || ctx.isPolicyCurrent?.() !== true) throw new Error("discord dead-letter notice suppressed: access authority expired");
			if (resolveChannelMessageSourceReplyDeliveryMode({
				cfg: readConfig(),
				ctx: {
					ChatType: ctx.isDirectMessage ? "direct" : ctx.isGroupDm ? "group" : ctx.isGuildMessage ? "channel" : void 0,
					InboundEventKind: ctx.inboundEventKind
				}
			}) === "message_tool_only") throw new Error("discord dead-letter notice suppressed: source-reply policy");
		};
		assertCurrent();
		await withDiscordRequestAuthority(assertCurrent, () => client.rest.post(Routes.channelMessages(ctx.messageChannelId), { body: {
			content: "⚠️ Couldn't process this message after repeated failures. Please try again.",
			message_reference: {
				message_id: data.message.id,
				fail_if_not_exists: false
			},
			allowed_mentions: {
				parse: [],
				replied_user: false
			}
		} }));
	};
	handler.deactivate = async () => {
		dispatcherShutdown.abort(/* @__PURE__ */ new Error("discord-message-handler-deactivated"));
		const pendingKeys = new Set([...pendingDebounceEntries].map((entry) => entry.debounceKey).filter((key) => key !== void 0));
		for (const key of pendingKeys) debouncer.cancelKey(key);
		pendingDebounceEntries.clear();
		await Promise.allSettled(pendingCancellationSettlements);
		runQueue.deactivate();
		await cleanupSkippedQueuedMessages();
		await debouncer.drain();
		await Promise.allSettled(pendingTasks);
	};
	return handler;
}
// extensions/discord/src/monitor/message-handler.ts
function createDiscordMessageHandler(params) {
	const dispatcher = createDiscordMessageDispatcher(params);
	const ingress = createDiscordIngressMonitor({
		...params,
		dispatch: (event, lifecycle) => dispatcher(event, params.client, {
			abortSignal: lifecycle.abortSignal,
			turnAdoptionLifecycle: lifecycle
		}),
		onDeadLetter: (event, signal) => dispatcher.notifyDeadLetter(event, params.client, signal)
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
export { createDiscordMessageHandler as t };
