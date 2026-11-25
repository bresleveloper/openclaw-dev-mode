import { t as getZalouserRuntime } from "./runtime-DAny-gS9.mjs";
import { a as buildZalouserGroupCandidates, i as resolveZalouserMessageSid, o as findZalouserGroupEntry, r as formatZalouserMessageSidFull, s as isZalouserGroupEntryAllowed } from "./channel-B4uMhrLj.mjs";
import { t as resolveZalouserDmSessionScope } from "./session-scope-6Av6wh6a.mjs";
import { F as ThreadType, I as buildZaloNameIndex, _ as sendZaloSeenEvent, b as startZaloListener, d as resolveZaloGroupContext, l as normalizeZaloInboundMessage, m as sendZaloDeliveredEvent, o as listZaloGroups, p as resolveZaloOwnUserId, r as listZaloFriends, y as sendZaloTypingEvent } from "./zalo-js-CarmVXWA.mjs";
import { n as sendMessageZalouser } from "./send-pZM09l4B.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeNullableString, normalizeOptionalLowercaseString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_INGRESS_ADOPTION_STALL_MS, bindIngressLifecycleToReplyOptions, createChannelIngressError, createChannelIngressMonitor } from "openclaw/plugin-sdk/channel-outbound";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { resolveChannelGroupsConfigPath } from "openclaw/plugin-sdk/channel-policy";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { collectErrorGraphCandidates, extractErrorCode, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { deliverTextOrMediaReply, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { mergeAllowlist, summarizeMapping } from "openclaw/plugin-sdk/allow-from";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { resolvePromptHistoryLimit } from "openclaw/plugin-sdk/number-runtime";
import { resolveOutboundMediaAccessForConfig } from "openclaw/plugin-sdk/outbound-media";
import { createAcceptedChannelDeliveryResult, createChannelInboundEnvelopeBuilderAsync, createChannelPartialDeliveryError, formatInboundMediaUnavailableText, implicitMentionKindWhen, isChannelPartialDeliveryError, logInboundDrop, resolveInboundMentionDecision } from "openclaw/plugin-sdk/channel-inbound";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { resolveDefaultGroupPolicy, resolveOpenProviderRuntimeGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { isRecord as isRecord$1 } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
// extensions/zalouser/src/ingress.ts
const ZALOUSER_INGRESS_PAYLOAD_VERSION = 1;
const ZALOUSER_INGRESS_POLL_INTERVAL_MS = 1e3;
const ZALOUSER_INGRESS_APPEND_RETRY_DELAYS_MS = [
	0,
	100,
	300
];
const ZalouserIngressPayloadError = createChannelIngressError("ZalouserIngressPayloadError");
function inspectZalouserIngressMessage(message) {
	if (!isRecord$1(message) || !isRecord$1(message.data)) throw new ZalouserIngressPayloadError("zca-js message envelope must contain data.");
	const eventId = normalizeNullableString(message.data.msgId);
	if (!eventId) throw new ZalouserIngressPayloadError("zca-js message envelope is missing data.msgId.");
	if (message.type === ThreadType.Group) {
		const groupId = normalizeNullableString(message.data.idTo);
		if (!groupId) throw new ZalouserIngressPayloadError("zca-js group message is missing data.idTo.");
		return {
			eventId,
			laneKey: `group:${groupId}`
		};
	}
	if (message.type !== ThreadType.User) throw new ZalouserIngressPayloadError("zca-js message has an unsupported thread type.");
	const senderId = normalizeNullableString(message.data.uidFrom);
	if (!senderId) throw new ZalouserIngressPayloadError("zca-js direct message is missing data.uidFrom.");
	return {
		eventId,
		laneKey: `direct:${senderId}`
	};
}
function serializeZalouserIngressMessage(message) {
	try {
		const serialized = JSON.stringify(message);
		if (typeof serialized !== "string") throw new ZalouserIngressPayloadError("zca-js message envelope is not serializable.");
		return serialized;
	} catch (error) {
		if (error instanceof ZalouserIngressPayloadError) throw error;
		throw new ZalouserIngressPayloadError("zca-js message envelope is not serializable.", { cause: error });
	}
}
function deserializeZalouserIngressMessage(rawMessage) {
	let parsed;
	try {
		parsed = JSON.parse(rawMessage);
	} catch (error) {
		throw new ZalouserIngressPayloadError("Zalouser ingress message JSON is invalid.", { cause: error });
	}
	return parsed;
}
function isZalouserAuthenticationFailure(error) {
	for (const candidate of collectErrorGraphCandidates(error, (current) => [current.cause])) {
		const code = extractErrorCode(candidate);
		const record = candidate;
		if (code === "401" || code === "403" || record.status === 401 || record.status === 403 || record.statusCode === 401 || record.statusCode === 403) return true;
	}
	return false;
}
function createZalouserIngressMonitor(options) {
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? (() => getZalouserRuntime().state.openChannelIngressQueue({ accountId: options.accountId })),
		inspect: (message) => inspectZalouserIngressMessage(message),
		payload: {
			version: ZALOUSER_INGRESS_PAYLOAD_VERSION,
			serialize: (message, { receivedAt }) => ({
				receivedAt,
				rawMessage: serializeZalouserIngressMessage(message)
			}),
			deserialize: (body) => deserializeZalouserIngressMessage(body.rawMessage),
			encode: ({ body }) => ({
				version: ZALOUSER_INGRESS_PAYLOAD_VERSION,
				...body
			}),
			decode: (payload) => {
				if (!isRecord$1(payload) || typeof payload.rawMessage !== "string") throw new ZalouserIngressPayloadError("Zalouser ingress payload is invalid.");
				return {
					version: payload.version,
					body: {
						receivedAt: typeof payload.receivedAt === "number" ? payload.receivedAt : 0,
						rawMessage: payload.rawMessage
					}
				};
			},
			createClaimError: (kind) => new ZalouserIngressPayloadError(kind === "invalid-version" ? "Zalouser ingress payload is invalid." : "Zalouser message identity changed after durable admission.")
		},
		deliver: async (rawMessage, lifecycle) => {
			const message = normalizeZaloInboundMessage(rawMessage, options.ownUserId);
			if (!message) throw new ZalouserIngressPayloadError("Zalouser message could not be normalized.");
			await options.dispatch(message, bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle);
		},
		pollIntervalMs: ZALOUSER_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e3,
			failedMaxEntries: 1e3
		},
		appendRetryDelaysMs: ZALOUSER_INGRESS_APPEND_RETRY_DELAYS_MS,
		deferredClaims: "settle-on-abort",
		drain: {
			orderBy: "received",
			adoptionStallTimeoutMs: options.adoptionStallTimeoutMs ?? DEFAULT_INGRESS_ADOPTION_STALL_MS,
			resolveNonRetryableFailure: (error) => {
				if (error instanceof ZalouserIngressPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isZalouserAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: formatErrorMessage(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(`zalouser ingress: ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("Zalouser ingress monitor is stopped."),
		onError: (error) => options.runtime.error?.(`zalouser ingress drain failed: ${formatErrorMessage(error)}`)
	});
	monitor.start();
	return {
		receive: async (message) => {
			if (monitor.isStopped()) throw new Error("Zalouser ingress monitor is stopped.");
			const facts = inspectZalouserIngressMessage(message);
			try {
				await monitor.admit(message, { facts });
			} catch (error) {
				if (error instanceof ZalouserIngressPayloadError) throw error;
				throw new Error("Zalouser durable ingress append failed.", { cause: error });
			}
		},
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
// extensions/zalouser/src/monitor.ts
const ZALOUSER_TEXT_LIMIT = 2e3;
function normalizeZalouserAllowEntry(entry) {
	return entry.replace(/^(zalouser|zlu):/i, "").trim();
}
function normalizeZalouserSender(value) {
	return normalizeOptionalLowercaseString(normalizeZalouserAllowEntry(value)) || null;
}
function logVerbose(core, runtime, message) {
	if (core.logging.shouldLogVerbose()) runtime.log(`[zalouser] ${message}`);
}
async function monitorZalouserProvider(options) {
	const { config } = options;
	let { account } = options;
	const { abortSignal, statusSink, runtime } = options;
	const groupsConfigPath = resolveChannelGroupsConfigPath({
		cfg: config,
		channel: "zalouser",
		accountId: account.accountId,
		groups: account.config.groups
	});
	const core = getZalouserRuntime();
	const historyLimit = resolvePromptHistoryLimit(account.config.historyLimit ?? config.messages?.groupChat?.historyLimit);
	const groupHistories = /* @__PURE__ */ new Map();
	try {
		const profile = account.profile;
		const allowFromEntries = (account.config.allowFrom ?? []).map((entry) => normalizeZalouserAllowEntry(String(entry))).filter((entry) => entry && entry !== "*");
		const groupAllowFromEntries = (account.config.groupAllowFrom ?? []).map((entry) => normalizeZalouserAllowEntry(String(entry))).filter((entry) => entry && entry !== "*");
		const allowNameMatching = isDangerousNameMatchingEnabled(account.config);
		if (allowNameMatching && (allowFromEntries.length > 0 || groupAllowFromEntries.length > 0)) {
			const friends = await listZaloFriends(profile);
			const byName = buildZaloNameIndex(friends, (friend) => friend.displayName);
			account = {
				...account,
				config: { ...account.config }
			};
			for (const [key, entries, label] of [[
				"allowFrom",
				allowFromEntries,
				"zalouser users"
			], [
				"groupAllowFrom",
				groupAllowFromEntries,
				"zalouser group users"
			]]) {
				if (entries.length === 0) continue;
				const additions = [];
				const mapping = [];
				const unresolved = [];
				for (const entry of entries) {
					if (/^\d+$/.test(entry)) {
						additions.push(entry);
						continue;
					}
					const id = (byName.get(normalizeLowercaseStringOrEmpty(entry)) ?? [])[0]?.userId;
					if (id) {
						additions.push(id);
						mapping.push(`${entry}->${id}`);
					} else unresolved.push(entry);
				}
				account.config[key] = mergeAllowlist({
					existing: account.config[key],
					additions
				});
				summarizeMapping(label, mapping, unresolved, runtime);
			}
		}
		const groupsConfig = account.config.groups ?? {};
		const groupKeys = Object.keys(groupsConfig).filter((key) => key !== "*");
		if (allowNameMatching && groupKeys.length > 0) {
			const groups = await listZaloGroups(profile);
			const byName = buildZaloNameIndex(groups, (group) => group.name);
			const mapping = [];
			const unresolved = [];
			const nextGroups = { ...groupsConfig };
			for (const entry of groupKeys) {
				const cleaned = normalizeZalouserAllowEntry(entry);
				const id = /^\d+$/.test(cleaned) ? cleaned : byName.get(normalizeLowercaseStringOrEmpty(cleaned))?.[0]?.groupId;
				if (!id) {
					unresolved.push(entry);
					continue;
				}
				if (!nextGroups[id]) nextGroups[id] = expectDefined(groupsConfig[entry], "enumerated Zalouser group config");
				mapping.push(`${entry}→${id}`);
			}
			account = {
				...account,
				config: {
					...account.config,
					groups: nextGroups
				}
			};
			summarizeMapping("zalouser groups", mapping, unresolved, runtime);
		}
	} catch (err) {
		runtime.log?.(`zalouser resolve failed; using config entries. ${String(err)}`);
	}
	const ownUserId = await resolveZaloOwnUserId(account.profile);
	const ingress = createZalouserIngressMonitor({
		accountId: account.accountId,
		ownUserId,
		runtime,
		...options.ingressQueue ? { queue: options.ingressQueue } : {},
		dispatch: async (message, turnAdoptionLifecycle) => {
			const pairing = createChannelPairingController({
				core,
				channel: "zalouser",
				accountId: account.accountId
			});
			const rawBody = message.content?.trim();
			if (!rawBody) return;
			const commandBody = message.commandContent?.trim() || rawBody;
			const isGroup = message.isGroup;
			const chatId = message.threadId;
			const senderId = message.senderId?.trim();
			if (!senderId) {
				logVerbose(core, runtime, `zalouser: drop message ${chatId} (missing senderId)`);
				return;
			}
			const senderName = message.senderName ?? "";
			const configuredGroupName = message.groupName?.trim() || "";
			const groupContext = isGroup && !configuredGroupName ? await resolveZaloGroupContext(account.profile, chatId).catch((err) => {
				logVerbose(core, runtime, `zalouser: group context lookup failed for ${chatId}: ${String(err)}`);
				return null;
			}) : null;
			const groupName = configuredGroupName || groupContext?.name?.trim() || "";
			const groupMembers = groupContext?.members?.slice(0, 20).join(", ") || void 0;
			if (message.eventMessage) try {
				const ack = {
					profile: account.profile,
					isGroup,
					message: message.eventMessage
				};
				await sendZaloDeliveredEvent(ack);
				await sendZaloSeenEvent(ack);
			} catch (err) {
				logVerbose(core, runtime, `zalouser: delivery/seen ack failed for ${chatId}: ${String(err)}`);
			}
			const defaultGroupPolicy = resolveDefaultGroupPolicy(config);
			const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
				providerConfigPresent: config.channels?.zalouser !== void 0,
				groupPolicy: account.config.groupPolicy,
				defaultGroupPolicy
			});
			warnMissingProviderGroupPolicyFallbackOnce({
				providerMissingFallbackApplied,
				providerKey: "zalouser",
				accountId: account.accountId,
				log: (entry) => logVerbose(core, runtime, entry)
			});
			const groups = account.config.groups ?? {};
			const routeAllowlistConfigured = Object.keys(groups).length > 0;
			const allowNameMatching = isDangerousNameMatchingEnabled(account.config);
			let requireMention = false;
			if (isGroup) {
				const groupEntry = findZalouserGroupEntry(groups, buildZalouserGroupCandidates({
					groupId: chatId,
					groupName,
					includeGroupIdAlias: true,
					allowNameMatching
				}));
				requireMention = typeof groupEntry?.requireMention === "boolean" ? groupEntry.requireMention : true;
				const routeMatched = Boolean(groupEntry);
				const routeEnabled = isZalouserGroupEntryAllowed(groupEntry);
				if (groupPolicy === "disabled") {
					logVerbose(core, runtime, `zalouser: drop group ${chatId} (groupPolicy=disabled)`);
					return;
				}
				if (routeMatched && !routeEnabled) {
					logVerbose(core, runtime, `zalouser: drop group ${chatId} (group disabled)`);
					return;
				}
				if (groupPolicy === "allowlist") {
					if (!routeAllowlistConfigured) {
						logVerbose(core, runtime, `zalouser: drop group ${chatId} (groupPolicy=allowlist, no allowlist)`);
						return;
					}
					if (!routeMatched) {
						logVerbose(core, runtime, `zalouser: drop group ${chatId} (not allowlisted)`);
						return;
					}
				}
			}
			const dmPolicy = account.config.dmPolicy ?? "pairing";
			const configAllowFrom = normalizeStringEntries(account.config.allowFrom);
			const configGroupAllowFrom = normalizeStringEntries(account.config.groupAllowFrom);
			const senderGroupPolicy = routeAllowlistConfigured && configGroupAllowFrom.length === 0 ? groupPolicy : groupPolicy === "disabled" ? "disabled" : configGroupAllowFrom.length > 0 ? "allowlist" : "open";
			const shouldComputeCommandAuth = core.channel.commands.shouldComputeCommandAuthorized(commandBody, config);
			const resolveAccessDecision = async (contextBinding) => await core.channel.inbound.ingress.resolveStable({
				channelId: "zalouser",
				accountId: account.accountId,
				identity: {
					normalize: normalizeZalouserSender,
					sensitivity: "pii",
					entryIdPrefix: "zalouser-entry"
				},
				cfg: config,
				readStoreAllowFrom: async () => await pairing.readAllowFromStore(),
				subject: { stableId: senderId },
				conversation: {
					kind: isGroup ? "group" : "direct",
					id: isGroup ? chatId : senderId
				},
				contextBinding,
				dmPolicy,
				groupPolicy: senderGroupPolicy,
				policy: { groupAllowFromFallbackToAllowFrom: false },
				allowFrom: configAllowFrom,
				groupAllowFrom: configGroupAllowFrom,
				command: shouldComputeCommandAuth ? {
					directGroupAllowFrom: "effective",
					commandGroupAllowFromFallbackToAllowFrom: true
				} : void 0
			});
			let accessDecision = await resolveAccessDecision();
			if (isGroup && accessDecision.senderAccess.decision !== "allow") {
				if (accessDecision.senderAccess.reasonCode === "group_policy_empty_allowlist") logVerbose(core, runtime, "Blocked zalouser group message (no group allowlist)");
				else if (accessDecision.senderAccess.reasonCode === "group_policy_not_allowlisted") logVerbose(core, runtime, `Blocked zalouser sender ${senderId} (not in groupAllowFrom/allowFrom)`);
				return;
			}
			if (!isGroup && accessDecision.senderAccess.decision !== "allow") {
				if (accessDecision.senderAccess.decision === "pairing") {
					await pairing.issueChallenge({
						senderId,
						senderIdLine: `Your Zalo user id: ${senderId}`,
						meta: { name: senderName || void 0 },
						onCreated: () => {
							logVerbose(core, runtime, `zalouser pairing request sender=${senderId}`);
						},
						sendPairingReply: async (text) => {
							await sendMessageZalouser(chatId, text, { profile: account.profile });
							statusSink?.({ lastOutboundAt: Date.now() });
						},
						onReplyError: (err) => {
							logVerbose(core, runtime, `zalouser pairing reply failed for ${senderId}: ${String(err)}`);
						}
					});
					return;
				}
				if (accessDecision.senderAccess.reasonCode === "dm_policy_disabled") logVerbose(core, runtime, `Blocked zalouser DM from ${senderId} (dmPolicy=disabled)`);
				else logVerbose(core, runtime, `Blocked unauthorized zalouser sender ${senderId} (dmPolicy=${dmPolicy})`);
				return;
			}
			let commandAuthorized = accessDecision.commandAccess.requested ? accessDecision.commandAccess.authorized : void 0;
			const hasControlCommand = core.channel.commands.isControlCommandMessage(commandBody, config);
			if (isGroup && hasControlCommand && commandAuthorized !== true) {
				logVerbose(core, runtime, `zalouser: drop control command from unauthorized sender ${senderId}`);
				return;
			}
			const peer = isGroup ? {
				kind: "group",
				id: chatId
			} : {
				kind: "direct",
				id: senderId
			};
			const route = core.channel.routing.resolveAgentRoute({
				cfg: config,
				channel: "zalouser",
				accountId: account.accountId,
				dmScope: resolveZalouserDmSessionScope(config),
				peer
			});
			const messageSid = resolveZalouserMessageSid({
				msgId: message.msgId,
				cliMsgId: message.cliMsgId,
				fallback: `${message.timestampMs}`
			});
			const routeContextBinding = {
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				messageId: messageSid,
				inboundEventKind: "user_request"
			};
			accessDecision = await resolveAccessDecision(routeContextBinding);
			if (!accessDecision.senderAccess.allowed) {
				logVerbose(core, runtime, `zalouser: authorization changed before dispatch for ${senderId}`);
				return;
			}
			commandAuthorized = accessDecision.commandAccess.requested ? accessDecision.commandAccess.authorized : void 0;
			if (isGroup && hasControlCommand && commandAuthorized !== true) {
				logVerbose(core, runtime, `zalouser: drop control command from unauthorized sender ${senderId}`);
				return;
			}
			const historyKey = isGroup ? route.sessionKey : void 0;
			const channelHistory = createChannelHistoryWindow({ historyMap: groupHistories });
			const mentionRegexes = core.channel.mentions.buildMentionRegexes(config, route.agentId);
			const explicitMention = {
				hasAnyMention: message.hasAnyMention === true,
				isExplicitlyMentioned: message.wasExplicitlyMentioned === true,
				canResolveExplicit: message.canResolveExplicitMention === true
			};
			const wasMentioned = isGroup ? core.channel.mentions.matchesMentionWithExplicit({
				text: rawBody,
				mentionRegexes,
				explicit: explicitMention
			}) : true;
			const canDetectMention = mentionRegexes.length > 0 || explicitMention.canResolveExplicit;
			const mentionDecision = resolveInboundMentionDecision({
				facts: {
					canDetectMention,
					wasMentioned,
					hasAnyMention: explicitMention.hasAnyMention,
					implicitMentionKinds: implicitMentionKindWhen("quoted_bot", message.implicitMention === true)
				},
				policy: {
					isGroup,
					requireMention,
					allowTextCommands: core.channel.commands.shouldHandleTextCommands({
						cfg: config,
						surface: "zalouser"
					}),
					hasControlCommand,
					commandAuthorized: commandAuthorized === true
				}
			});
			if (isGroup && requireMention && !canDetectMention && !mentionDecision.effectiveWasMentioned) {
				runtime.error?.(`[${account.accountId}] zalouser mention required but detection unavailable (missing mention regexes and bot self id); dropping group ${chatId}`);
				return;
			}
			if (isGroup && mentionDecision.shouldSkip) {
				channelHistory.record({
					historyKey: historyKey ?? "",
					limit: historyLimit,
					entry: historyKey && rawBody ? {
						sender: senderName || senderId,
						body: rawBody,
						timestamp: message.timestampMs,
						messageId: messageSid
					} : null
				});
				logInboundDrop({
					log: runtime.log,
					channel: "zalouser",
					reason: "no mention",
					target: chatId,
					onceKey: JSON.stringify([account.accountId, chatId]),
					hint: `Mention patterns can be derived from the agent identity name. Set ${groupsConfigPath}[${JSON.stringify(chatId)}].requireMention=false to process messages without a mention. Preserve existing groups entries; when adding the first groups map, include "*": {} to keep other chats admitted.`
				});
				return;
			}
			const fromLabel = isGroup ? groupName || `group:${chatId}` : senderName || `user:${senderId}`;
			const buildEnvelope = await createChannelInboundEnvelopeBuilderAsync({
				cfg: config,
				route
			});
			const body = buildEnvelope({
				channel: "Zalo Personal",
				from: fromLabel,
				timestamp: message.timestampMs,
				body: rawBody
			});
			const combinedBody = isGroup && historyKey ? channelHistory.buildPendingContext({
				historyKey,
				limit: historyLimit,
				currentMessage: body,
				formatEntry: (entry) => buildEnvelope({
					channel: "Zalo Personal",
					from: fromLabel,
					timestamp: entry.timestamp,
					previousTimestamp: null,
					body: `${entry.sender}: ${entry.body}${entry.messageId ? ` [id:${entry.messageId}]` : ""}`
				})
			}) : body;
			const inboundHistory = isGroup && historyKey && historyLimit > 0 ? channelHistory.buildInboundHistory({
				historyKey,
				limit: historyLimit
			}) : void 0;
			const normalizedTo = isGroup ? `zalouser:group:${chatId}` : `zalouser:${chatId}`;
			const messageSidFull = formatZalouserMessageSidFull({
				msgId: message.msgId,
				cliMsgId: message.cliMsgId
			});
			let bodyForAgent = rawBody;
			let media;
			const attachment = message.attachment;
			if (attachment) {
				const signal = turnAdoptionLifecycle ? AbortSignal.any([abortSignal, turnAdoptionLifecycle.abortSignal]) : abortSignal;
				accessDecision = await resolveAccessDecision(routeContextBinding);
				signal.throwIfAborted();
				if (!accessDecision.senderAccess.allowed || isGroup && hasControlCommand && !accessDecision.commandAccess.authorized) return;
				let saved;
				try {
					saved = await core.channel.media.saveRemoteMedia({
						url: attachment.url,
						maxBytes: account.mediaMaxBytes,
						requireHttps: true,
						ssrfPolicy: { hostnameAllowlist: [
							"*.zdn.vn",
							"*.dlfl.vn",
							"*.flchat.vn",
							"*.dlmd.me"
						] },
						responseHeaderTimeoutMs: 3e4,
						readIdleTimeoutMs: 3e4,
						timeoutMs: 12e4,
						requestInit: { signal },
						assertCurrent: () => signal.throwIfAborted(),
						originalFilename: attachment.fileName,
						filePathHint: attachment.fileName
					});
				} catch {
					signal.throwIfAborted();
					runtime.error?.(`[${account.accountId}] Failed to download Zalo ${attachment.kind}`);
					bodyForAgent = formatInboundMediaUnavailableText({
						body: rawBody,
						notice: `[zalouser ${attachment.kind} attachment unavailable]`
					});
				}
				try {
					accessDecision = await resolveAccessDecision(routeContextBinding);
					signal.throwIfAborted();
					commandAuthorized = accessDecision.commandAccess.requested ? accessDecision.commandAccess.authorized : void 0;
					if (!accessDecision.senderAccess.allowed || isGroup && hasControlCommand && commandAuthorized !== true) return;
					if (saved) media = [{
						path: saved.path,
						url: saved.path,
						contentType: saved.contentType,
						fileName: attachment.fileName ?? saved.fileName,
						sizeBytes: saved.size,
						kind: attachment.kind
					}];
				} finally {
					if (saved && !media) await core.channel.media.deleteMediaBuffer(saved.id).catch(() => {
						runtime.error?.(`[${account.accountId}] Failed to discard rejected Zalo attachment`);
					});
				}
			}
			const ctxPayload = core.channel.inbound.buildContext({
				channelIngress: accessDecision,
				channel: "zalouser",
				accountId: route.accountId,
				messageId: messageSid,
				messageIdFull: messageSidFull,
				timestamp: message.timestampMs,
				from: isGroup ? `zalouser:group:${chatId}` : `zalouser:${senderId}`,
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
					routeSessionKey: route.sessionKey,
					dispatchSessionKey: route.sessionKey
				},
				reply: {
					to: normalizedTo,
					originatingTo: normalizedTo
				},
				message: {
					body: combinedBody,
					bodyForAgent,
					rawBody,
					commandBody,
					inboundHistory
				},
				media,
				extra: {
					BodyForCommands: commandBody,
					GroupSubject: isGroup ? groupName || void 0 : void 0,
					GroupChannel: isGroup ? groupName || void 0 : void 0,
					GroupMembers: isGroup ? groupMembers : void 0,
					WasMentioned: isGroup ? mentionDecision.effectiveWasMentioned : void 0,
					CommandAuthorized: commandAuthorized,
					ReplyToId: message.quotedGlobalMsgId || void 0,
					ReplyToBody: message.quotedBody || void 0,
					ReplyToIsQuote: message.quotedGlobalMsgId ? true : void 0
				}
			});
			await core.channel.inbound.dispatch({
				channel: "zalouser",
				accountId: account.accountId,
				cfg: config,
				route: {
					agentId: route.agentId,
					dmScope: route.dmScope,
					sessionKey: route.sessionKey
				},
				ctxPayload,
				delivery: {
					preparePayload: (payload) => {
						if (payload.text === void 0) return payload;
						return {
							...payload,
							text: core.channel.text.convertMarkdownTables(payload.text, core.channel.text.resolveMarkdownTableMode({
								cfg: config,
								channel: "zalouser",
								accountId: account.accountId
							}))
						};
					},
					durable: () => ({ to: normalizedTo }),
					deliver: async (payload) => {
						const profile = account.profile;
						const mediaMaxBytes = account.mediaMaxBytes;
						const deliveryAccountId = account.accountId;
						let visibleReplySent = false;
						const reply = resolveSendableOutboundReplyParts(payload);
						const chunkMode = core.channel.text.resolveChunkMode(config, "zalouser", deliveryAccountId);
						const textChunkLimit = core.channel.text.resolveTextChunkLimit(config, "zalouser", deliveryAccountId, { fallbackLimit: ZALOUSER_TEXT_LIMIT });
						const accepted = [];
						const sendReplyPart = async (text, mediaUrl) => {
							await sendMessageZalouser(chatId, text, {
								profile,
								mediaMaxBytes,
								...mediaUrl ? {
									mediaUrl,
									mediaAccess: resolveOutboundMediaAccessForConfig(config)
								} : {},
								isGroup,
								textMode: "markdown",
								textChunkMode: chunkMode,
								textChunkLimit,
								onDeliveryResult: (result) => {
									accepted.push(result);
									visibleReplySent = true;
								}
							});
							visibleReplySent = true;
						};
						try {
							await deliverTextOrMediaReply({
								payload,
								text: reply.text,
								sendText: sendReplyPart,
								sendMedia: async ({ mediaUrl, caption }) => {
									await sendReplyPart(caption ?? "", mediaUrl);
								}
							});
						} catch (error) {
							if (!visibleReplySent) throw error;
							throw createChannelPartialDeliveryError(error, createAcceptedChannelDeliveryResult({
								results: accepted.map((result) => ({ receipt: result.receipt })),
								kind: reply.hasMedia ? "media" : "text"
							}));
						}
						return { visibleReplySent };
					},
					onDelivered: (_payload, _info, result) => {
						if (result?.visibleReplySent !== false) statusSink?.({ lastOutboundAt: Date.now() });
					},
					onError: (err, info) => {
						if (isChannelPartialDeliveryError(err)) statusSink?.({ lastOutboundAt: Date.now() });
						runtime.error(`[${account.accountId}] Zalouser ${info.kind} reply failed: ${String(err)}`);
					}
				},
				replyPipeline: { typing: {
					start: async () => {
						await sendZaloTypingEvent(chatId, {
							profile: account.profile,
							isGroup
						});
					},
					onStartError: (err) => {
						runtime.error?.(`[${account.accountId}] zalouser typing start failed for ${chatId}: ${String(err)}`);
						logVerbose(core, runtime, `zalouser typing failed for ${chatId}: ${String(err)}`);
					}
				} },
				record: { onRecordError: (err) => {
					runtime.error?.(`zalouser: failed updating session meta: ${String(err)}`);
				} },
				replyOptions: turnAdoptionLifecycle ? { turnAdoptionLifecycle } : void 0
			});
			if (isGroup && historyKey) channelHistory.clear({
				historyKey,
				limit: historyLimit
			});
		}
	});
	let listenerStop = null;
	let stopped = false;
	let stopTask;
	const stop = () => {
		stopTask ??= (async () => {
			stopped = true;
			listenerStop?.();
			listenerStop = null;
			await ingress.stop();
		})();
		return stopTask;
	};
	const { promise: waitForExit, resolve: resolveRun, reject: rejectRun } = createDeferred();
	const settleSuccess = () => {
		stop().then(resolveRun, rejectRun);
	};
	const settleFailure = (error) => {
		const failure = error instanceof Error ? error : new Error(String(error));
		stop().then(() => rejectRun(failure), (stopError) => rejectRun(stopError instanceof Error ? stopError : new Error(String(stopError))));
	};
	abortSignal.addEventListener("abort", settleSuccess, { once: true });
	let listener;
	try {
		listener = await startZaloListener({
			accountId: account.accountId,
			profile: account.profile,
			abortSignal,
			onMessage: async (msg) => {
				if (stopped) return;
				statusSink?.({ lastInboundAt: Date.now() });
				await ingress.receive(msg);
			},
			onError: (err) => {
				if (stopped || abortSignal.aborted) return;
				runtime.error(`[${account.accountId}] Zalo listener error: ${String(err)}`);
				settleFailure(err);
			}
		});
	} catch (error) {
		abortSignal.removeEventListener("abort", settleSuccess);
		await ingress.stop();
		throw error;
	}
	listenerStop = listener.stop;
	if (stopped) {
		listenerStop();
		listenerStop = null;
	} else if (!abortSignal.aborted) statusSink?.(channelReadyPatch());
	if (abortSignal.aborted) settleSuccess();
	try {
		await waitForExit;
	} finally {
		abortSignal.removeEventListener("abort", settleSuccess);
	}
	return { stop };
}
export { monitorZalouserProvider };
