import { a as resolveIrcGroupRequireMention, c as connectIrcClient, d as sanitizeIrcAssistantText, f as createIrcIngressSubject, h as normalizeIrcAllowEntry, i as resolveIrcGroupMatch, l as parseIrcLine, m as isChannelTarget, o as sendMessageIrc, p as ircIngressIdentity, s as buildIrcConnectOptions, u as parseIrcPrefix, y as resolveIrcAccount } from "./channel-hBHc-p9Z.mjs";
import { t as getIrcRuntime } from "./runtime-xy-FcjJC.mjs";
import { channelIngressRoutes } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor, resolveChannelStreamingBlockEnabled } from "openclaw/plugin-sdk/channel-outbound";
import { randomUUID } from "node:crypto";
import { resolveLoggerBackedRuntime } from "openclaw/plugin-sdk/extension-shared";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { logInboundDrop, resolveChannelInboundRouteEnvelope } from "openclaw/plugin-sdk/channel-inbound";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { deliverFormattedTextWithAttachments } from "openclaw/plugin-sdk/reply-payload";
import { GROUP_POLICY_BLOCKED_LABEL, resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/irc/src/inbound.ts
const CHANNEL_ID = "irc";
const escapeIrcRegexLiteral = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const IRC_NICK_CHARACTER = String.raw`[A-Za-z0-9_\-\[\]\\\x60^{}|~]`;
const IRC_RFC1459_CASE_EQUIVALENTS = /* @__PURE__ */ new Map([
	["[", "{"],
	["{", "["],
	["]", "}"],
	["}", "]"],
	["\\", "|"],
	["|", "\\"],
	["^", "~"],
	["~", "^"]
]);
function buildIrcNickMentionPattern(value) {
	return Array.from(value, (character) => {
		const equivalent = IRC_RFC1459_CASE_EQUIVALENTS.get(character);
		return equivalent ? `[${escapeIrcRegexLiteral(character)}${escapeIrcRegexLiteral(equivalent)}]` : escapeIrcRegexLiteral(character);
	}).join("");
}
function hasEntries(entries) {
	return normalizeStringEntries(entries).some((entry) => normalizeIrcAllowEntry(entry));
}
function routeDescriptorsForIrcGroup(params) {
	if (!params.isGroup) return [];
	return channelIngressRoutes(params.groupPolicy === "allowlist" && {
		id: "irc:channel",
		allowed: params.hasConfiguredGroups && params.groupAllowed,
		precedence: 0,
		matchId: "irc-channel",
		blockReason: "channel_not_allowlisted"
	}, !params.groupEnabled && {
		id: "irc:channel-enabled",
		enabled: false,
		precedence: 10,
		blockReason: "channel_disabled"
	}, hasEntries(params.routeGroupAllowFrom) && {
		id: "irc:channel-sender",
		precedence: 20,
		senderPolicy: "replace",
		senderAllowFrom: params.routeGroupAllowFrom
	});
}
async function deliverIrcReply(params) {
	await deliverFormattedTextWithAttachments({
		payload: {
			...params.payload,
			text: sanitizeIrcAssistantText(params.payload.text ?? "")
		},
		send: async ({ text, replyToId }) => {
			if (params.sendReply) await params.sendReply(params.target, text, replyToId);
			else await sendMessageIrc(params.target, text, {
				cfg: params.cfg,
				accountId: params.accountId,
				replyTo: replyToId
			});
			params.statusSink?.({ lastOutboundAt: Date.now() });
		}
	});
}
async function handleIrcInbound(params) {
	const { message, account, config, runtime, connectedNick, statusSink, turnAdoptionLifecycle } = params;
	const core = getIrcRuntime();
	const pairing = createChannelPairingController({
		core,
		channel: CHANNEL_ID,
		accountId: account.accountId
	});
	const rawBody = message.text?.trim() ?? "";
	if (!rawBody) return { kind: "completed" };
	if (turnAdoptionLifecycle?.abortSignal.aborted) return {
		kind: "failed-retryable",
		error: turnAdoptionLifecycle.abortSignal.reason
	};
	statusSink?.({ lastInboundAt: message.timestamp });
	const senderDisplay = message.senderHost ? `${message.senderNick}!${message.senderUser ?? "?"}@${message.senderHost}` : message.senderNick;
	const allowNameMatching = isDangerousNameMatchingEnabled(account.config);
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	const defaultGroupPolicy = resolveDefaultGroupPolicy(config);
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: config.channels?.irc !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy
	});
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "irc",
		accountId: account.accountId,
		blockedLabel: GROUP_POLICY_BLOCKED_LABEL.channel,
		log: (messageLocal) => runtime.log?.(messageLocal)
	});
	const groupMatch = resolveIrcGroupMatch({
		groups: account.config.groups,
		target: message.target
	});
	const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
		cfg: config,
		surface: CHANNEL_ID
	});
	const hasControlCommand = core.channel.text.hasControlCommand(rawBody, config);
	const mentionRegexes = core.channel.mentions.buildMentionRegexes(config);
	const mentionNick = connectedNick?.trim() || account.nick;
	const explicitMentionRegex = mentionNick ? new RegExp(`(?<!${IRC_NICK_CHARACTER})${buildIrcNickMentionPattern(mentionNick)}(?!${IRC_NICK_CHARACTER})[:,]?`, "i") : null;
	const wasMentioned = core.channel.mentions.matchesMentionPatterns(rawBody, mentionRegexes) || (explicitMentionRegex ? explicitMentionRegex.test(rawBody) : false);
	const requireMention = message.isGroup ? resolveIrcGroupRequireMention({
		groups: account.config.groups,
		target: message.target
	}) : false;
	const routeGroupAllowFrom = normalizeStringEntries(groupMatch.groupConfig?.allowFrom?.length ? groupMatch.groupConfig.allowFrom : groupMatch.wildcardConfig?.allowFrom);
	const accessGroupPolicy = groupPolicy === "open" && (hasEntries(account.config.groupAllowFrom) || hasEntries(routeGroupAllowFrom)) ? "allowlist" : groupPolicy;
	const channelTarget = message.target.startsWith("#") || message.target.startsWith("&") ? message.target : `#${message.target}`;
	const peerId = message.isGroup ? channelTarget : message.senderNick;
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: config,
		channel: CHANNEL_ID,
		accountId: account.accountId,
		peer: {
			kind: message.isGroup ? "group" : "direct",
			id: peerId
		}
	});
	const access = await core.channel.inbound.ingress.createResolver({
		channelId: CHANNEL_ID,
		accountId: account.accountId,
		identity: ircIngressIdentity,
		cfg: config,
		readStoreAllowFrom: async () => await pairing.readAllowFromStore()
	}).message({
		subject: createIrcIngressSubject(message),
		conversation: {
			kind: message.isGroup ? "group" : "direct",
			id: message.target
		},
		contextBinding: {
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			...message.messageId ? { messageId: message.messageId } : {},
			inboundEventKind: "user_request"
		},
		route: routeDescriptorsForIrcGroup({
			isGroup: message.isGroup,
			groupPolicy,
			groupAllowed: groupMatch.allowed,
			hasConfiguredGroups: groupMatch.hasConfiguredGroups,
			groupEnabled: groupMatch.groupConfig?.enabled !== false && groupMatch.wildcardConfig?.enabled !== false,
			routeGroupAllowFrom
		}),
		mentionFacts: message.isGroup ? {
			canDetectMention: true,
			wasMentioned,
			hasAnyMention: wasMentioned
		} : void 0,
		dmPolicy,
		groupPolicy: accessGroupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: false,
			mutableIdentifierMatching: allowNameMatching ? "enabled" : "disabled",
			activation: {
				requireMention: message.isGroup && requireMention,
				allowTextCommands
			}
		},
		allowFrom: account.config.allowFrom,
		groupAllowFrom: account.config.groupAllowFrom,
		command: {
			allowTextCommands,
			hasControlCommand
		}
	});
	const commandAuthorized = access.commandAccess.authorized;
	if (access.ingress.admission === "pairing-required") {
		await pairing.issueChallenge({
			senderId: normalizeLowercaseStringOrEmpty(senderDisplay),
			senderIdLine: `Your IRC id: ${senderDisplay}`,
			meta: { name: message.senderNick || void 0 },
			sendPairingReply: async (text) => {
				await deliverIrcReply({
					payload: { text },
					cfg: config,
					target: message.senderNick,
					accountId: account.accountId,
					sendReply: params.sendReply,
					statusSink
				});
			},
			onReplyError: (err) => {
				runtime.error?.(`irc: pairing reply failed for ${senderDisplay}: ${String(err)}`);
			}
		});
		runtime.log?.(`irc: drop DM sender ${senderDisplay} (dmPolicy=${dmPolicy})`);
		return { kind: "completed" };
	}
	if (access.ingress.admission === "skip") {
		runtime.log?.(`irc: drop channel ${message.target} (missing-mention)`);
		return { kind: "completed" };
	}
	if (access.ingress.admission !== "dispatch") {
		if (message.isGroup && access.ingress.decisiveGateId === "command" && access.commandAccess.shouldBlockControlCommand) {
			logInboundDrop({
				log: (line) => runtime.log?.(line),
				channel: CHANNEL_ID,
				reason: "control command (unauthorized)",
				target: senderDisplay
			});
			return { kind: "completed" };
		}
		if (message.isGroup) {
			if (access.routeAccess.reason === "channel_not_allowlisted") runtime.log?.(`irc: drop channel ${message.target} (not allowlisted)`);
			else if (access.routeAccess.reason === "channel_disabled") runtime.log?.(`irc: drop channel ${message.target} (disabled)`);
			else runtime.log?.(`irc: drop group sender ${senderDisplay} (policy=${groupPolicy})`);
		} else runtime.log?.(`irc: drop DM sender ${senderDisplay} (dmPolicy=${dmPolicy})`);
		return { kind: "completed" };
	}
	if (turnAdoptionLifecycle?.abortSignal.aborted) return {
		kind: "failed-retryable",
		error: turnAdoptionLifecycle.abortSignal.reason
	};
	const fromLabel = message.isGroup ? message.target : senderDisplay;
	const body = buildEnvelope({
		channel: "IRC",
		from: fromLabel,
		timestamp: message.timestamp,
		body: rawBody
	});
	const groupSystemPrompt = normalizeOptionalString(groupMatch.groupConfig?.systemPrompt);
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config);
	const ctxPayload = core.channel.inbound.buildContext({
		channelIngress: access,
		channel: CHANNEL_ID,
		accountId: route.accountId,
		messageId: message.messageId,
		timestamp: message.timestamp,
		from: message.isGroup ? `channel:${channelTarget}` : `irc:${senderDisplay}`,
		sender: {
			id: senderDisplay,
			name: message.senderNick || void 0
		},
		conversation: {
			kind: message.isGroup ? "group" : "direct",
			id: peerId,
			label: fromLabel
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: message.isGroup ? `channel:${channelTarget}` : `irc:${peerId}`,
			originatingTo: message.isGroup ? `channel:${channelTarget}` : `irc:${peerId}`
		},
		message: {
			body,
			bodyForAgent: rawBody,
			rawBody,
			commandBody: rawBody
		},
		access: {
			commands: { authorized: commandAuthorized },
			mentions: {
				canDetectMention: message.isGroup,
				wasMentioned
			}
		},
		extra: {
			GroupSubject: message.isGroup ? message.target : void 0,
			GroupSystemPrompt: message.isGroup ? groupSystemPrompt : void 0
		}
	});
	const ingressState = { handoff: "none" };
	const trackedIngressLifecycle = turnAdoptionLifecycle ? {
		...turnAdoptionLifecycle,
		onAdopted: async () => {
			ingressState.handoff = "adopted";
			await turnAdoptionLifecycle.onAdopted();
		},
		onDeferred: () => {
			ingressState.handoff = "deferred";
			turnAdoptionLifecycle.onDeferred();
		},
		onAbandoned: async () => {
			ingressState.handoff = "abandoned";
			await turnAdoptionLifecycle.onAbandoned();
		}
	} : void 0;
	await core.channel.inbound.dispatch({
		cfg: config,
		channel: CHANNEL_ID,
		accountId: account.accountId,
		route: {
			agentId: route.agentId,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		delivery: {
			deliver: async (payload) => {
				await deliverIrcReply({
					payload,
					cfg: config,
					target: peerId,
					accountId: account.accountId,
					sendReply: params.sendReply,
					statusSink
				});
			},
			onError: (err, info) => {
				runtime.error?.(`irc ${info.kind} reply failed: ${String(err)}`);
			}
		},
		replyPipeline: {},
		replyOptions: {
			...trackedIngressLifecycle ? bindIngressLifecycleToReplyOptions(trackedIngressLifecycle) : {},
			skillFilter: groupMatch.groupConfig?.skills,
			disableBlockStreaming: typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : void 0
		},
		record: { onRecordError: (err) => {
			runtime.error?.(`irc: failed updating session meta: ${String(err)}`);
		} }
	});
	if (turnAdoptionLifecycle?.abortSignal.aborted && ingressState.handoff === "none") return {
		kind: "failed-retryable",
		error: turnAdoptionLifecycle.abortSignal.reason
	};
	if (turnAdoptionLifecycle && ingressState.handoff === "none") {
		await turnAdoptionLifecycle.onAdopted();
		ingressState.handoff = "adopted";
	}
	return ingressState.handoff === "deferred" || ingressState.handoff === "abandoned" ? { kind: "deferred" } : { kind: "completed" };
}
//#endregion
//#region extensions/irc/src/irc-ingress.ts
const IRC_INGRESS_PAYLOAD_VERSION = 1;
const IRC_INGRESS_POLL_INTERVAL_MS = 1e3;
const IrcIngressPayloadError = createChannelIngressError("IrcIngressPayloadError");
function inspectRawPrivmsg(rawLine) {
	const line = parseIrcLine(rawLine);
	if (!line || line.command !== "PRIVMSG") throw new IrcIngressPayloadError("IRC ingress row is not a PRIVMSG line.");
	const rawTarget = line.params[0]?.trim() ?? "";
	const text = line.trailing ?? line.params[1] ?? "";
	const prefix = parseIrcPrefix(line.prefix);
	const senderNick = prefix.nick?.trim() ?? "";
	if (!rawTarget || !senderNick || !text.trim()) throw new IrcIngressPayloadError("IRC PRIVMSG line is missing target, sender, or text.");
	const isGroup = isChannelTarget(rawTarget);
	const target = isGroup ? rawTarget : senderNick;
	const lanePeer = normalizeLowercaseStringOrEmpty(target);
	return {
		laneKey: `${isGroup ? "channel" : "direct"}:${lanePeer}`,
		message: {
			target,
			rawTarget,
			senderNick,
			senderUser: prefix.user?.trim() || void 0,
			senderHost: prefix.host?.trim() || void 0,
			text,
			isGroup
		}
	};
}
function decodeIrcIngressPayload(payload, claimedId) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload) || typeof payload.eventId !== "string" || !Number.isSafeInteger(payload.receivedAt) || (payload.receivedAt ?? 0) <= 0 || typeof payload.connectionEpoch !== "string" || !payload.connectionEpoch?.trim() || typeof payload.connectedNick !== "string" || !payload.connectedNick?.trim() || typeof payload.rawLine !== "string") throw new IrcIngressPayloadError(`IRC ingress row ${claimedId} has invalid metadata.`);
	const validPayload = payload;
	return {
		version: validPayload.version,
		body: {
			eventId: validPayload.eventId,
			receivedAt: validPayload.receivedAt,
			connectionEpoch: validPayload.connectionEpoch,
			connectedNick: validPayload.connectedNick,
			rawLine: validPayload.rawLine
		}
	};
}
function inspectIrcIngress(raw, phase) {
	try {
		const projection = inspectRawPrivmsg(raw.body.rawLine);
		if (phase === "claim") raw.claimedProjection = projection;
		return {
			eventId: raw.body.eventId,
			laneKey: projection.laneKey
		};
	} catch (error) {
		if (phase === "admission" && error instanceof IrcIngressPayloadError) return {
			eventId: raw.body.eventId,
			laneKey: `invalid:${raw.body.eventId}`
		};
		throw error;
	}
}
function resolveIrcIngressNonRetryableFailure(error) {
	return error instanceof IrcIngressPayloadError ? {
		reason: "invalid-event",
		message: error.message
	} : null;
}
function createIrcIngressMonitor(options) {
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getIrcRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (raw, context) => inspectIrcIngress(raw, context.phase),
		payload: {
			version: IRC_INGRESS_PAYLOAD_VERSION,
			serialize: (raw) => raw.body,
			deserialize: (body) => ({ body }),
			encode: ({ body }) => ({
				version: IRC_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload, { claim }) => decodeIrcIngressPayload(payload, claim.id),
			createClaimError: (_kind, claim) => new IrcIngressPayloadError(`IRC ingress row ${claim.id} has invalid metadata.`)
		},
		deliver: (raw, lifecycle, claim) => {
			const message = {
				...raw.claimedProjection.message,
				messageId: claim.id,
				timestamp: raw.body.receivedAt
			};
			return options.dispatch(message, lifecycle, {
				connectedNick: raw.body.connectedNick.trim(),
				connectionEpoch: raw.body.connectionEpoch.trim()
			});
		},
		pollIntervalMs: options.pollIntervalMs ?? IRC_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e3,
			failedMaxEntries: 1e3
		},
		drain: {
			resolveNonRetryableFailure: resolveIrcIngressNonRetryableFailure,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.log?.(`irc ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("IRC ingress is stopped."),
		onError: (error) => options.runtime.error?.(`irc ingress drain failed: ${String(error)}`)
	});
	return {
		openConnection: (connectionEpoch = randomUUID()) => {
			const epoch = connectionEpoch.trim();
			if (!epoch) throw new Error("IRC ingress connection epoch is required.");
			let sequence = 0;
			return {
				connectionEpoch: epoch,
				accept: (rawLine, connectedNick) => {
					if (monitor.isStopped()) return Promise.reject(/* @__PURE__ */ new Error("IRC ingress is stopped."));
					sequence += 1;
					const eventId = `local:${epoch}:${String(sequence).padStart(12, "0")}`;
					const receivedAt = Date.now();
					const normalizedNick = connectedNick.trim();
					if (!normalizedNick) return Promise.reject(/* @__PURE__ */ new Error("IRC ingress connected nickname is required."));
					return monitor.admit({ body: {
						eventId,
						rawLine,
						receivedAt,
						connectionEpoch: epoch,
						connectedNick: normalizedNick
					} }, { receivedAt }).then(() => void 0);
				}
			};
		},
		start: monitor.start,
		pause: monitor.pause,
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
//#endregion
//#region extensions/irc/src/monitor.ts
const IRC_MONITOR_RECONNECT_DELAY_MS = 1e3;
async function monitorIrcProvider(opts) {
	const core = getIrcRuntime();
	const cfg = opts.config ?? core.config.current();
	const account = resolveIrcAccount({
		cfg,
		accountId: opts.accountId
	});
	const runtime = resolveLoggerBackedRuntime(opts.runtime, core.logging.getChildLogger());
	if (!account.configured) throw new Error(`IRC is not configured for account "${account.accountId}" (need host and nick in channels.irc).`);
	const logger = core.logging.getChildLogger({
		channel: "irc",
		accountId: account.accountId
	});
	let client = null;
	let activeConnectionEpoch = null;
	let ingressPause = Promise.resolve();
	let reconnectTimer = null;
	let stopped = false;
	const monitorAbort = new AbortController();
	let removeAbortListener = null;
	if (opts.abortSignal) {
		const forwardAbort = () => monitorAbort.abort();
		if (opts.abortSignal.aborted) forwardAbort();
		else {
			opts.abortSignal.addEventListener("abort", forwardAbort, { once: true });
			removeAbortListener = () => opts.abortSignal?.removeEventListener("abort", forwardAbort);
		}
	}
	const ingress = createIrcIngressMonitor({
		accountId: account.accountId,
		runtime,
		...opts.ingressQueue ? { queue: opts.ingressQueue } : {},
		dispatch: async (message, turnAdoptionLifecycle, context) => {
			const activeClient = client;
			if (!activeClient || stopped || monitorAbort.signal.aborted) return {
				kind: "failed-retryable",
				error: /* @__PURE__ */ new Error("IRC transport disconnected before ingress dispatch.")
			};
			if (normalizeLowercaseStringOrEmpty(message.senderNick) === normalizeLowercaseStringOrEmpty(context.connectedNick)) return { kind: "completed" };
			if (!message.isGroup && context.connectionEpoch !== activeConnectionEpoch) {
				logger.warn?.(`[${account.accountId}] dropping replayed IRC DM after the connection changed`);
				return { kind: "completed" };
			}
			if (opts.onMessage) {
				await opts.onMessage(message, activeClient);
				return { kind: "completed" };
			}
			return await handleIrcInbound({
				message,
				account,
				config: cfg,
				runtime,
				connectedNick: context.connectedNick,
				turnAdoptionLifecycle,
				sendReply: async (target, text) => {
					const replyClient = client;
					if (!replyClient || !replyClient.isReady() || stopped || monitorAbort.signal.aborted) throw new Error("IRC transport disconnected before reply send.");
					if (!message.isGroup && context.connectionEpoch !== activeConnectionEpoch) throw new Error("IRC connection changed before private reply send.");
					replyClient.sendPrivmsg(target, text);
					opts.statusSink?.({ lastOutboundAt: Date.now() });
					core.channel.activity.record({
						channel: "irc",
						accountId: account.accountId,
						direction: "outbound"
					});
				},
				statusSink: opts.statusSink
			});
		}
	});
	function scheduleReconnect() {
		if (stopped || monitorAbort.signal.aborted || reconnectTimer) return;
		opts.statusSink?.({ lifecycle: "recovering" });
		reconnectTimer = setTimeout(() => {
			reconnectTimer = null;
			connect().catch((error) => {
				if (stopped || monitorAbort.signal.aborted) return;
				const message = error instanceof Error ? error.message : String(error);
				logger.error(`[${account.accountId}] IRC reconnect failed: ${message}`);
				scheduleReconnect();
			});
		}, IRC_MONITOR_RECONNECT_DELAY_MS);
	}
	async function connect() {
		if (stopped || monitorAbort.signal.aborted) return;
		const ingressConnection = ingress.openConnection();
		const nextClient = await connectIrcClient(buildIrcConnectOptions(account, {
			channels: account.config.channels,
			abortSignal: monitorAbort.signal,
			onLine: (line) => {
				if (core.logging.shouldLogVerbose()) logger.debug?.(`[${account.accountId}] << ${line}`);
			},
			onNotice: (text, target) => {
				if (core.logging.shouldLogVerbose()) logger.debug?.(`[${account.accountId}] notice ${target ?? ""}: ${text}`);
			},
			onError: (error) => {
				logger.error(`[${account.accountId}] IRC error: ${error.message}`);
			},
			onDisconnect: () => {
				if (stopped || monitorAbort.signal.aborted) return;
				ingressPause = ingress.pause();
				if (activeConnectionEpoch === ingressConnection.connectionEpoch) activeConnectionEpoch = null;
				client = null;
				logger.warn?.(`[${account.accountId}] IRC connection closed; reconnecting in ${IRC_MONITOR_RECONNECT_DELAY_MS}ms`);
				scheduleReconnect();
			},
			onPrivmsg: async (event) => {
				await ingressConnection.accept(event.rawLine, event.connectedNick);
				if (normalizeLowercaseStringOrEmpty(event.senderNick) === normalizeLowercaseStringOrEmpty(event.connectedNick)) return;
				core.channel.activity.record({
					channel: "irc",
					accountId: account.accountId,
					direction: "inbound",
					at: Date.now()
				});
			}
		}));
		if (stopped || monitorAbort.signal.aborted) {
			nextClient.quit("shutdown");
			return;
		}
		client = nextClient;
		activeConnectionEpoch = ingressConnection.connectionEpoch;
		await ingressPause;
		if (client !== nextClient || !nextClient.isReady()) {
			if (activeConnectionEpoch === ingressConnection.connectionEpoch) activeConnectionEpoch = null;
			return;
		}
		ingress.start();
		opts.statusSink?.(channelReadyPatch());
		logger.info(`[${account.accountId}] connected to ${account.host}:${account.port}${account.tls ? " (tls)" : ""} as ${nextClient.nick}`);
	}
	try {
		await connect();
	} catch (error) {
		removeAbortListener?.();
		removeAbortListener = null;
		await ingress.stop();
		throw error;
	}
	let stopTask;
	return { stop: () => {
		stopTask ??= (async () => {
			stopped = true;
			removeAbortListener?.();
			removeAbortListener = null;
			if (!monitorAbort.signal.aborted) monitorAbort.abort();
			if (reconnectTimer) {
				clearTimeout(reconnectTimer);
				reconnectTimer = null;
			}
			client?.quit("shutdown");
			client = null;
			activeConnectionEpoch = null;
			await ingress.stop();
		})();
		return stopTask;
	} };
}
//#endregion
export { monitorIrcProvider, sendMessageIrc };
