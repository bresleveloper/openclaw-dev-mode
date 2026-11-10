import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Dt as validateConversationSendParams, Et as validateConversationListParams, Ng as errorShape, Ot as validateConversationTurnCancelParams, kt as validateConversationTurnParams } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as resolveConversationRouteFingerprint, r as ConversationDeliveryInputError } from "./conversation-delivery-policy-BttgDEjN.mjs";
import { t as buildConversationIdentity } from "./conversation-identity-BApT92qN.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { i as resolveMessageReceiptPrimaryId } from "./receipt-C1maBxgO.mjs";
import { a as registerConversationAddresses, i as readConversation, r as prepareConversationRegistryScope, t as listConversations } from "./conversation-registry-DdNx9ZQ8.mjs";
import { c as markConversationDeliverySuppressed, r as getConversationDeliveryOperation, s as markConversationDeliverySent, t as beginConversationDeliveryOperation } from "./conversation-delivery-store-O6xnH1gE.mjs";
import { t as captureConversationDeliveryTarget } from "./delivery-completion-4GBUPDR3.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-JZ360Soo.mjs";
import { r as registerPendingConversationTurn, t as cancelPendingConversationTurn } from "./conversation-turns-D0Uj09Lv.mjs";
import { a as resolveOutboundSessionRoute, i as prepareOutboundSessionBinding, n as captureOutboundSessionBinding, t as bindOutboundSessionEntry } from "./outbound-session-Y84oqniG.mjs";
import { n as runMessageAction } from "./message-action-runner-DVO8q4sH.mjs";
import { i as withAuthorizedConversationDelivery, n as prepareConversationRouteEligibilitiesForAgent, o as ConversationInputError, r as resolveConversationRouteEligibilitiesForAgent, s as ConversationOperationConflictError, t as prepareConversationDeliveryRouteAuthorization } from "./conversation-route-ownership-BwU3sGGv.mjs";
import { n as resolveGatewayInflightRequest, r as runGatewayInflightWork, t as cacheGatewayDedupeResult } from "./inflight-CJ-JRY7g.mjs";
import crypto from "node:crypto";
//#region src/gateway/conversation-list.ts
const log = createSubsystemLogger("gateway/conversations");
/** Lists persisted and channel-directory addresses from the Gateway's live plugin runtime. */
async function runGatewayConversationList(params, deps = {
	listConversations,
	registerConversationAddresses,
	resolveOutboundChannelPlugin,
	resolveOutboundSessionRoute
}) {
	const scope = await prepareConversationRegistryScope(params);
	const query = params.query?.trim() || void 0;
	let discoveryChannel;
	let registeredConversations;
	const discoveredConversationRefs = /* @__PURE__ */ new Set();
	if (params.channel) {
		const plugin = deps.resolveOutboundChannelPlugin({
			channel: params.channel,
			cfg: params.config
		});
		discoveryChannel = plugin?.directory ? plugin.id : params.channel.trim().toLowerCase();
		if (plugin?.directory) {
			const identities = /* @__PURE__ */ new Map();
			for (const accountId of new Set(plugin.config.listAccountIds(params.config).filter(Boolean))) {
				const account = await resolveChannelAccount({
					plugin,
					cfg: params.config,
					accountId
				});
				if (plugin.config.isEnabled?.(account, params.config) === false) continue;
				if (plugin.config.isConfigured && !await plugin.config.isConfigured(account, params.config)) continue;
				const input = {
					cfg: params.config,
					accountId,
					...query ? { query } : {},
					limit: params.limit,
					runtime: defaultRuntime
				};
				const directory = plugin.directory;
				const listPeersLive = directory?.listPeersLive;
				const listGroupsLive = directory?.listGroupsLive;
				const listLiveDirectoryEntries = async (kind, run) => {
					try {
						return await run();
					} catch (error) {
						log.warn("live directory discovery failed; using configured entries", {
							channel: plugin.id,
							accountId,
							kind,
							error: formatErrorMessage(error)
						});
						return [];
					}
				};
				const [configuredPeers, livePeers, configuredGroups, liveGroups] = await Promise.all([
					directory?.listPeers?.(input) ?? [],
					listPeersLive ? listLiveDirectoryEntries("peers", () => listPeersLive(input)) : [],
					directory?.listGroups?.(input) ?? [],
					listGroupsLive ? listLiveDirectoryEntries("groups", () => listGroupsLive(input)) : []
				]);
				const entries = /* @__PURE__ */ new Map();
				for (const entry of [
					...configuredPeers,
					...livePeers,
					...configuredGroups,
					...liveGroups
				]) entries.set(`${entry.kind}\u0000${entry.id.trim()}`, entry);
				for (const entry of entries.values()) {
					const target = entry.id.trim();
					if (!target) continue;
					const display = entry.name?.trim() || entry.handle?.trim() || void 0;
					const route = await deps.resolveOutboundSessionRoute({
						cfg: params.config,
						channel: plugin.id,
						plugin,
						agentId: params.agentId,
						accountId,
						target,
						resolvedTarget: {
							to: target,
							kind: entry.kind,
							...display ? { display } : {},
							source: "directory",
							resolutionSource: "directory"
						}
					});
					if (!route) continue;
					const identity = buildConversationIdentity({
						channel: plugin.id,
						accountId,
						kind: route.chatType,
						peerId: route.from,
						deliveryTarget: route.to,
						...route.threadId !== void 0 ? { threadId: route.threadId } : {},
						...route.peer.kind === "direct" ? { nativeDirectUserId: route.peer.id } : { nativeChannelId: route.peer.id },
						...display ? { label: display } : {}
					});
					if (identity) identities.set(identity.conversationRef, identity);
				}
			}
			const discoveredIdentities = [...identities.values()];
			const routeConfig = params.readCurrentConfig?.() ?? params.config;
			const prepared = await prepareConversationRouteEligibilitiesForAgent({
				config: routeConfig,
				agentId: params.agentId,
				conversations: discoveredIdentities.map((identity) => ({
					...identity,
					target: identity.deliveryTarget
				}))
			});
			const indexes = new Map(discoveredIdentities.map((identity, index) => [identity.conversationRef, index]));
			try {
				registeredConversations = await deps.registerConversationAddresses(scope, discoveredIdentities, Date.now(), (candidates) => {
					if ((params.readCurrentConfig?.() ?? params.config) !== routeConfig) return candidates.map(() => false);
					const all = prepared.read();
					const eligibility = candidates.map((identity) => all[indexes.get(identity.conversationRef) ?? -1] ?? "denied");
					if (eligibility.includes("unavailable")) throw new Error("Conversation route ownership is temporarily unavailable");
					return eligibility.map((value) => value === "eligible");
				}, { channel: discoveryChannel });
			} finally {
				prepared.dispose();
			}
			for (const identity of discoveredIdentities) discoveredConversationRefs.add(identity.conversationRef);
		}
	}
	const conversations = registeredConversations ?? await deps.listConversations(scope, discoveryChannel !== void 0 ? { channel: discoveryChannel } : {});
	const currentConfig = params.readCurrentConfig?.() ?? params.config;
	const normalizedQuery = query?.toLowerCase() ?? "";
	const searchQuery = normalizedQuery.startsWith("@") && normalizedQuery.length > 1 ? normalizedQuery.slice(1) : normalizedQuery;
	const candidates = conversations.filter((entry) => !query || discoveredConversationRefs.has(entry.conversationRef) || [
		entry.conversationRef,
		entry.target,
		entry.label
	].some((value) => value?.toLowerCase().includes(searchQuery)));
	const eligibility = await resolveConversationRouteEligibilitiesForAgent({
		config: currentConfig,
		agentId: params.agentId,
		conversations: candidates
	});
	if (eligibility.includes("unavailable")) throw new Error("Conversation route ownership is temporarily unavailable");
	return { conversations: candidates.filter((_, index) => eligibility[index] === "eligible").slice(0, params.limit).map((conversation) => {
		const row = {
			conversationRef: conversation.conversationRef,
			channel: conversation.channel,
			accountId: conversation.accountId,
			kind: conversation.kind,
			target: conversation.target
		};
		if (conversation.threadId) row.threadId = conversation.threadId;
		if (conversation.label) row.label = conversation.label;
		return Object.assign(row, {
			firstSeenAt: conversation.firstSeenAt,
			lastSeenAt: conversation.lastSeenAt
		});
	}) };
}
//#endregion
//#region src/infra/outbound/conversation-delivery.ts
/** Durable external-conversation delivery independent from local model sessions. */
var ConversationDeliveryRejectedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConversationDeliveryRejectedError";
	}
};
function buildConversationDeliveryIntentId(agentId, operationId) {
	return `convq_${crypto.createHash("sha256").update(JSON.stringify([agentId, operationId])).digest("hex").slice(0, 32)}`;
}
function readMessageIdFromActionResult(result) {
	const sendResult = result.sendResult?.result;
	if (sendResult && "receipt" in sendResult && sendResult.receipt) {
		const receiptId = resolveMessageReceiptPrimaryId(sendResult.receipt);
		if (receiptId) return receiptId;
	}
	if (sendResult && "messageId" in sendResult && typeof sendResult.messageId === "string") return sendResult.messageId.trim() || void 0;
	return normalizeOptionalString(asOptionalRecord(result.payload)?.messageId);
}
function resultFromExistingOperation(operation) {
	if (operation.status === "created") return;
	if (operation.status === "rejected") throw new ConversationDeliveryRejectedError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
	const deliveryStatus = operation.status === "replied" ? "sent" : operation.status;
	const platformMessageId = deliveryStatus === "sent" ? operation.platformMessageId : void 0;
	const preparedMessageId = deliveryStatus === "sent" || deliveryStatus === "queued" ? operation.preparedMessageId : void 0;
	return {
		deliveryStatus,
		operation,
		...platformMessageId || preparedMessageId ? { messageId: platformMessageId ?? preparedMessageId } : {}
	};
}
/**
* Sends one external message after a durable operation and queue intent exist.
* A retry with the same operation id observes prior state instead of re-sending.
*/
async function sendGatewayConversationMessage(params) {
	const scope = params.scope;
	const conversationDeliveryTarget = captureConversationDeliveryTarget(scope);
	const record = params.operation ?? (await beginConversationDeliveryOperation(scope, {
		operationId: params.operationId,
		operationKind: params.operationKind,
		conversationRef: params.conversation.conversationRef,
		...params.context.sourceSessionKey ? { sourceSessionKey: params.context.sourceSessionKey } : {},
		message: params.message,
		authority: params.authority,
		...params.preparedMessageId ? { preparedMessageId: params.preparedMessageId } : {}
	}, params.assertCurrent)).record;
	params.assertCurrent();
	const existing = resultFromExistingOperation(record);
	if (existing) return existing;
	const readAuthoritativeOperation = async () => await getConversationDeliveryOperation(scope, record.operationId) ?? record;
	try {
		const action = await runMessageAction({
			cfg: params.context.config,
			action: "send",
			params: {
				channel: params.conversation.channel,
				to: params.conversation.target,
				message: params.message,
				...params.conversation.threadId ? { threadId: params.conversation.threadId } : {},
				idempotencyKey: params.operationId
			},
			defaultAccountId: params.conversation.accountId,
			agentId: params.context.agentId,
			sessionKey: params.context.sourceSessionKey,
			senderIsOwner: params.context.senderIsOwner,
			suppressTranscriptMirror: true,
			forceCoreDelivery: true,
			gatewayOwnedDelivery: true,
			requireQueuePersistence: true,
			deliveryIntentId: buildConversationDeliveryIntentId(params.context.agentId, record.operationId),
			deliveryCompletion: {
				kind: "conversation",
				agentId: scope.agentId,
				operationId: record.operationId,
				storePath: scope.storePath,
				routeFingerprint: params.routeFingerprint
			},
			conversationDeliveryTarget,
			withDirectAdapterHandoff: params.withDirectAdapterHandoff,
			...record.preparedMessageId ? { preparedMessageId: record.preparedMessageId } : {},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		if (action.kind !== "send") throw new Error(`Conversation delivery returned unexpected action: ${action.kind}`);
		if (action.dryRun) throw new Error("Conversation delivery was only prepared; no message was sent");
		if (action.handledBy !== "core" || !action.sendResult) throw new Error("Conversation delivery did not return a core platform send result");
		const deliveryStatus = action.sendResult.deliveryStatus;
		const operation = deliveryStatus === "suppressed" ? await markConversationDeliverySuppressed(scope, record.operationId) : deliveryStatus === "sent" ? await markConversationDeliverySent(scope, record.operationId, readMessageIdFromActionResult(action)) : void 0;
		const completed = operation ? resultFromExistingOperation(operation) : void 0;
		if (completed) return completed;
		throw new Error(`Conversation delivery was not confirmed (${deliveryStatus ?? "unknown"})`);
	} catch (error) {
		const persisted = resultFromExistingOperation(await readAuthoritativeOperation());
		if (persisted) return persisted;
		throw error;
	}
}
//#endregion
//#region src/gateway/conversation-send.ts
/** Performs one durable conversation send inside the Gateway channel owner. */
async function runGatewayConversationSend(params) {
	const scope = await prepareConversationRegistryScope(params);
	params.signal?.throwIfAborted();
	let routeAuthority;
	try {
		const operation = await getConversationDeliveryOperation(scope, params.operationId, {
			operationKind: "send",
			conversationRef: params.conversationRef,
			...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
			message: params.message
		});
		const conversation = await readConversation(scope, params.conversationRef);
		params.signal?.throwIfAborted();
		if (!conversation) throw new ConversationInputError(`Conversation not found: ${params.conversationRef} (use conversations_list)`);
		const currentConfig = params.readCurrentConfig?.() ?? params.config;
		const routeFingerprint = resolveConversationRouteFingerprint(conversation);
		const authority = {
			conversationRef: conversation.conversationRef,
			expectedRouteFingerprint: routeFingerprint
		};
		routeAuthority = await prepareConversationDeliveryRouteAuthorization({
			...authority,
			config: currentConfig,
			readCurrentConfig: params.readCurrentConfig,
			agentId: params.agentId,
			conversation
		});
		routeAuthority.assertRequestEligible();
		const completed = operation ? resultFromExistingOperation(operation) : void 0;
		const sent = completed ?? await sendGatewayConversationMessage({
			scope,
			context: {
				agentId: params.agentId,
				...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
				config: currentConfig,
				senderIsOwner: params.senderIsOwner
			},
			conversation,
			message: params.message,
			operationId: params.operationId,
			operationKind: "send",
			routeFingerprint,
			authority,
			assertCurrent: () => {
				params.signal?.throwIfAborted();
				routeAuthority.assertCurrent(conversation);
			},
			withDirectAdapterHandoff: (initiate) => withAuthorizedConversationDelivery({
				...authority,
				config: currentConfig,
				readCurrentConfig: params.readCurrentConfig,
				agentId: params.agentId,
				scope,
				routeAuthority
			}, () => {
				params.signal?.throwIfAborted();
				return initiate();
			}),
			...operation ? { operation } : {},
			...params.signal ? { signal: params.signal } : {}
		});
		const resultConversation = completed ? completed.operation : conversation;
		return {
			status: sent.deliveryStatus,
			conversationRef: resultConversation.conversationRef,
			channel: resultConversation.channel,
			...sent.messageId ? { messageId: sent.messageId } : {},
			...sent.operation.queueId ? { queueId: sent.operation.queueId } : {}
		};
	} catch (error) {
		if (error instanceof ConversationDeliveryInputError) throw new ConversationOperationConflictError(error.message);
		if (error instanceof ConversationDeliveryRejectedError) throw new ConversationInputError(error.message);
		throw error;
	} finally {
		routeAuthority?.dispose();
	}
}
//#endregion
//#region src/gateway/conversation-turn.ts
function hasConversationSessionBinding(conversation) {
	return Boolean(conversation.sessionId && conversation.sessionKey);
}
const COMPLETED_TURN_MESSAGES = {
	sent: "Message was already sent; no process-local reply waiter remains.",
	queued: "Delivery is queued; a later reply will start an ordinary inbound turn.",
	suppressed: "Delivery was suppressed before a message was sent.",
	unknown: "Delivery could not be confirmed and will not be retried automatically.",
	replied: "A reply was recorded, but its durable reply payload is incomplete."
};
function resultForCompletedOperation(operation) {
	const messageId = operation.platformMessageId ?? operation.preparedMessageId;
	if (operation.status === "replied" && operation.reply && messageId) return {
		status: "replied",
		conversationRef: operation.conversationRef,
		channel: operation.channel,
		messageId,
		correlationPersisted: true,
		reply: {
			conversationRef: operation.conversationRef,
			messageId: operation.reply.messageId,
			...operation.reply.replyToId ? { replyToId: operation.reply.replyToId } : {},
			...operation.reply.threadId ? { threadId: operation.reply.threadId } : {},
			text: operation.reply.text,
			timestamp: operation.reply.timestamp
		}
	};
	if (operation.status === "created") return;
	const base = {
		conversationRef: operation.conversationRef,
		channel: operation.channel,
		...messageId ? { messageId } : {}
	};
	if (operation.status === "rejected") throw new ConversationInputError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
	return {
		...base,
		status: operation.status === "replied" ? "sent" : operation.status,
		correlationPersisted: operation.status === "sent" || operation.status === "queued" || operation.status === "replied",
		error: COMPLETED_TURN_MESSAGES[operation.status]
	};
}
/** Owns correlation, delivery, and waiting inside the Gateway process that receives ingress. */
async function runGatewayConversationTurn(params) {
	const scope = await prepareConversationRegistryScope(params);
	const binding = captureOutboundSessionBinding({
		cfg: params.config,
		scope,
		sourceSessionKey: params.sourceSessionKey
	});
	let begun;
	try {
		const prior = await getConversationDeliveryOperation(scope, params.turnId, {
			operationKind: "turn",
			conversationRef: params.conversationRef,
			...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
			message: params.message
		});
		begun = prior ? {
			created: false,
			record: prior
		} : void 0;
	} catch (error) {
		if (error instanceof ConversationDeliveryInputError) throw new ConversationOperationConflictError(error.message);
		throw error;
	}
	const discoveredConversation = await readConversation(scope, params.conversationRef);
	if (!discoveredConversation) throw new ConversationInputError(`Conversation not found: ${params.conversationRef} (use conversations_list)`);
	const readCurrentConfig = params.readCurrentConfig ?? (() => params.config);
	const currentConfig = readCurrentConfig();
	const discoveredRouteFingerprint = resolveConversationRouteFingerprint(discoveredConversation);
	const routeAuthority = await prepareConversationDeliveryRouteAuthorization({
		config: currentConfig,
		readCurrentConfig,
		agentId: params.agentId,
		conversation: discoveredConversation,
		conversationRef: discoveredConversation.conversationRef,
		expectedRouteFingerprint: discoveredRouteFingerprint
	});
	try {
		routeAuthority.assertRequestEligible();
		if (begun) {
			const completed = resultForCompletedOperation(begun.record);
			if (completed) return completed;
		}
		const plugin = resolveOutboundChannelPlugin({
			channel: discoveredConversation.channel,
			cfg: currentConfig
		});
		let candidatePreparedMessageId = begun?.record.preparedMessageId;
		if (!begun) {
			const prepare = plugin?.outbound?.prepareConversationTurnMessageId;
			if (!prepare) throw new ConversationInputError(`Channel ${discoveredConversation.channel} does not support correlated conversation turns; use conversations_send`);
			try {
				candidatePreparedMessageId = prepare({
					cfg: currentConfig,
					to: discoveredConversation.target,
					text: params.message,
					accountId: discoveredConversation.accountId,
					threadId: discoveredConversation.threadId
				}).trim();
			} catch (error) {
				throw new ConversationInputError(error instanceof Error ? error.message : String(error));
			}
			if (!candidatePreparedMessageId) throw new ConversationInputError(`Channel ${discoveredConversation.channel} prepared an empty conversation-turn message id`);
		}
		if (!candidatePreparedMessageId) throw new ConversationInputError(`Conversation turn ${params.turnId} is missing its prepared message id`);
		let conversation;
		if (hasConversationSessionBinding(discoveredConversation)) conversation = discoveredConversation;
		else {
			const preparedBinding = prepareOutboundSessionBinding(binding);
			const channel = plugin?.id ?? discoveredConversation.channel;
			const route = await resolveOutboundSessionRoute({
				cfg: currentConfig,
				channel,
				...plugin ? { plugin } : {},
				agentId: params.agentId,
				accountId: discoveredConversation.accountId,
				target: discoveredConversation.target,
				...discoveredConversation.threadId ? { threadId: discoveredConversation.threadId } : {}
			});
			if (!route) throw new ConversationInputError(`Conversation ${discoveredConversation.conversationRef} no longer resolves to a channel route`);
			await bindOutboundSessionEntry({
				cfg: currentConfig,
				channel,
				accountId: discoveredConversation.accountId,
				route,
				sourceSessionKey: params.sourceSessionKey,
				workerGuard: {
					conversation: {
						conversationRef: discoveredConversation.conversationRef,
						expectedRouteFingerprint: discoveredRouteFingerprint
					},
					assertCurrent: () => {
						routeAuthority.assertCurrent(discoveredConversation);
					}
				}
			}, preparedBinding);
			const bound = await readConversation(scope, discoveredConversation.conversationRef);
			if (!bound || !hasConversationSessionBinding(bound)) throw new Error(`Conversation ${discoveredConversation.conversationRef} could not create its local context binding`);
			conversation = bound;
		}
		const authorizedConfig = readCurrentConfig();
		routeAuthority.assertCurrent(conversation);
		const routeFingerprint = resolveConversationRouteFingerprint(conversation);
		const authority = {
			conversationRef: conversation.conversationRef,
			expectedRouteFingerprint: routeFingerprint,
			expectedSessionId: conversation.sessionId,
			expectedSessionKey: conversation.sessionKey
		};
		const assertCurrent = () => {
			routeAuthority.assertCurrent(conversation, authority);
		};
		if (!begun) {
			try {
				begun = await beginConversationDeliveryOperation(scope, {
					operationId: params.turnId,
					operationKind: "turn",
					conversationRef: conversation.conversationRef,
					...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
					message: params.message,
					authority,
					preparedMessageId: candidatePreparedMessageId
				}, assertCurrent);
				assertCurrent();
			} catch (error) {
				if (error instanceof ConversationDeliveryInputError) throw new ConversationOperationConflictError(error.message);
				throw error;
			}
			const completed = resultForCompletedOperation(begun.record);
			if (completed) return completed;
		}
		const preparedMessageId = begun.record.preparedMessageId;
		if (!preparedMessageId) throw new ConversationInputError(`Conversation turn ${params.turnId} is missing its prepared message id`);
		const pending = registerPendingConversationTurn({
			agentId: params.agentId,
			id: params.turnId,
			conversationRef: conversation.conversationRef,
			sessionId: conversation.sessionId,
			...conversation.threadId ? { threadId: conversation.threadId } : {},
			timeoutMs: params.timeoutMs
		});
		pending.setOutboundMessageId(preparedMessageId);
		try {
			const sent = await sendGatewayConversationMessage({
				scope,
				context: {
					agentId: params.agentId,
					...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
					config: authorizedConfig,
					senderIsOwner: params.senderIsOwner
				},
				conversation,
				message: params.message,
				operationId: pending.id,
				operationKind: "turn",
				operation: begun.record,
				preparedMessageId,
				routeFingerprint,
				authority,
				assertCurrent,
				withDirectAdapterHandoff: (initiate) => withAuthorizedConversationDelivery({
					...authority,
					config: authorizedConfig,
					readCurrentConfig,
					agentId: params.agentId,
					scope,
					routeAuthority
				}, initiate)
			});
			if (sent.deliveryStatus !== "sent") {
				pending.cancel();
				return resultForCompletedOperation(sent.operation);
			}
			if (!(sent.messageId === preparedMessageId)) {
				pending.cancel();
				return {
					status: "sent",
					conversationRef: conversation.conversationRef,
					channel: conversation.channel,
					...sent.messageId ? { messageId: sent.messageId } : {},
					correlationPersisted: true,
					error: "Channel delivery did not preserve its prepared message id; reply correlation was disabled."
				};
			}
			pending.markReady();
			const reply = await pending.wait();
			const delivered = {
				conversationRef: conversation.conversationRef,
				channel: conversation.channel,
				messageId: preparedMessageId,
				correlationPersisted: true
			};
			return reply ? {
				status: "replied",
				...delivered,
				reply
			} : {
				status: "timeout",
				...delivered
			};
		} catch (error) {
			pending.cancel();
			if (error instanceof ConversationDeliveryRejectedError) throw new ConversationInputError(error.message);
			throw error;
		}
	} finally {
		routeAuthority.dispose();
	}
}
//#endregion
//#region src/gateway/server-methods/conversations.ts
async function handleConversationWrite({ context, client, respond }, request) {
	const readCurrentConfig = () => context.getRuntimeConfig();
	const config = readCurrentConfig();
	if (request.sourceSessionKey) {
		const parsed = parseAgentSessionKey(request.sourceSessionKey);
		if (parsed) {
			if (normalizeAgentId(parsed.agentId) !== normalizeAgentId(request.agentId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${request.agentId}" does not match session key agent "${parsed.agentId}"`));
				return;
			}
		} else {
			const owner = resolveRequestedSessionAgentId(config, request.sourceSessionKey, request.agentId);
			if (!owner.ok) {
				respond(false, void 0, owner.error);
				return;
			}
		}
	}
	const operationKey = `conversations.${request.method}:${JSON.stringify([request.agentId, request.operationId])}`;
	const identityKey = `${operationKey}:identity`;
	const requestIdentity = sha256Hex(JSON.stringify([
		request.agentId,
		request.sourceSessionKey ?? null,
		request.conversationRef,
		request.message,
		request.method === "turn" ? request.timeoutMs : null
	]));
	const completed = context.dedupe.get(operationKey);
	const prior = context.dedupe.get(identityKey);
	if (completed && completed.requestIdentity !== requestIdentity || prior && (!prior.ok || prior.requestIdentity !== requestIdentity)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `conversation ${request.method} ${request.operationId} was already used with different input`));
		return;
	}
	context.dedupe.set(identityKey, prior ? {
		...prior,
		ts: Date.now()
	} : {
		ts: Date.now(),
		ok: true,
		requestIdentity
	});
	const inflight = resolveGatewayInflightRequest({
		context,
		dedupeKey: operationKey,
		idempotencyKey: request.operationId,
		respond
	});
	if (inflight.kind === "handled") {
		await inflight.done;
		return;
	}
	const { dedupeKey, inflightMap } = inflight;
	let releaseRequestIdentity = false;
	const work = (async () => {
		try {
			const command = {
				config,
				readCurrentConfig,
				agentId: request.agentId,
				senderIsOwner: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true,
				...request.sourceSessionKey ? { sourceSessionKey: request.sourceSessionKey } : {},
				conversationRef: request.conversationRef,
				message: request.message
			};
			const payload = await (request.method === "send" ? runGatewayConversationSend({
				...command,
				operationId: request.operationId
			}) : runGatewayConversationTurn({
				...command,
				turnId: request.operationId,
				timeoutMs: request.timeoutMs
			}));
			const result = {
				ok: true,
				payload,
				meta: { channel: payload.channel }
			};
			cacheGatewayDedupeResult({
				context,
				dedupeKey,
				requestIdentity,
				result
			});
			return result;
		} catch (cause) {
			const isTerminalInputError = cause instanceof ConversationInputError;
			const isOperationConflict = cause instanceof ConversationOperationConflictError;
			const result = {
				ok: false,
				error: errorShape(isTerminalInputError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, cause instanceof Error ? cause.message : String(cause)),
				meta: { error: formatForLog(cause) }
			};
			if (isOperationConflict) releaseRequestIdentity = true;
			else if (isTerminalInputError) cacheGatewayDedupeResult({
				context,
				dedupeKey,
				requestIdentity,
				result
			});
			return result;
		}
	})();
	try {
		await runGatewayInflightWork({
			inflightMap,
			dedupeKey,
			work,
			respond
		});
	} finally {
		if (releaseRequestIdentity && context.dedupe.get(identityKey)?.requestIdentity === requestIdentity) context.dedupe.delete(identityKey);
	}
}
const conversationHandlers = {
	"conversations.list": defineValidatedGatewayMethod("conversations.list", validateConversationListParams, async ({ params: request, respond, context }) => {
		const readCurrentConfig = () => context.getRuntimeConfig();
		respond(true, await runGatewayConversationList({
			config: readCurrentConfig(),
			readCurrentConfig,
			agentId: request.agentId,
			...request.channel ? { channel: request.channel } : {},
			...request.query ? { query: request.query } : {},
			limit: request.limit ?? 50
		}), void 0);
	}, (cause) => errorShape(ErrorCodes.UNAVAILABLE, cause instanceof Error ? cause.message : String(cause))),
	"conversations.send": defineValidatedGatewayMethod("conversations.send", validateConversationSendParams, (options) => handleConversationWrite(options, {
		...options.params,
		method: "send"
	})),
	"conversations.turn.cancel": defineValidatedGatewayMethod("conversations.turn.cancel", validateConversationTurnCancelParams, ({ params: request, respond }) => {
		respond(true, { cancelled: cancelPendingConversationTurn({
			agentId: request.agentId,
			id: request.turnId
		}) }, void 0);
	}),
	"conversations.turn": defineValidatedGatewayMethod("conversations.turn", validateConversationTurnParams, (options) => handleConversationWrite(options, {
		...options.params,
		operationId: options.params.turnId,
		method: "turn"
	}))
};
//#endregion
export { conversationHandlers };
