import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { ct as validateConversationListParams, dt as validateConversationTurnParams, lt as validateConversationSendParams, ut as validateConversationTurnCancelParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { R as buildConversationIdentity } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { a as registerConversationAddresses, i as readConversation, r as prepareConversationRegistryScope, t as listConversations, u as runConversationDatabaseWrite } from "./conversation-registry-CcMjrJ1T.mjs";
import { i as resolveMessageReceiptPrimaryId } from "./receipt-Be_FOFUF.mjs";
import { t as ConversationDeliveryInputError } from "./conversation-delivery-store.types-CMzZxTv2.mjs";
import { d as getConversationDeliveryOperation, l as beginConversationDeliveryOperation, m as markConversationDeliverySuppressed, p as markConversationDeliverySent, t as captureConversationDeliveryTarget } from "./delivery-completion-D_UNTyTR.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-DMBKJyb_.mjs";
import { r as registerPendingConversationTurn, t as cancelPendingConversationTurn } from "./conversation-turns-HyjSEYj4.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { a as resolveOutboundSessionRoute, i as prepareOutboundSessionBinding, n as captureOutboundSessionBinding, t as bindOutboundSessionEntry } from "./outbound-session-BzsWVtaq.mjs";
import { n as runMessageAction } from "./message-action-runner-Df0TIl9E.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
import { a as resolveConversationRouteFingerprint, i as resolveConversationRouteEligibilityForAgent, n as assertConversationRouteEligibleForAgent, o as ConversationInputError, s as ConversationOperationConflictError, t as assertConversationDeliveryAttemptAuthorized } from "./conversation-route-ownership-nNlK5875.mjs";
import { n as resolveGatewayInflightRequest, r as runGatewayInflightWork, t as cacheGatewayDedupeResult } from "./inflight-C7tVF6RA.mjs";
import crypto from "node:crypto";
//#region src/gateway/conversation-list.ts
const log = createSubsystemLogger("gateway/conversations");
const defaultDeps = {
	listConversations,
	registerConversationAddresses,
	resolveOutboundChannelPlugin,
	resolveOutboundSessionRoute
};
function presentConversation(conversation) {
	return {
		conversationRef: conversation.conversationRef,
		channel: conversation.channel,
		accountId: conversation.accountId,
		kind: conversation.kind,
		target: conversation.target,
		...conversation.threadId ? { threadId: conversation.threadId } : {},
		...conversation.label ? { label: conversation.label } : {},
		firstSeenAt: conversation.firstSeenAt,
		lastSeenAt: conversation.lastSeenAt
	};
}
async function listLiveDirectoryEntries(params) {
	try {
		return await params.run();
	} catch (error) {
		log.warn("live directory discovery failed; using configured entries", {
			channel: params.channel,
			accountId: params.accountId,
			kind: params.kind,
			error: formatErrorMessage(error)
		});
		return [];
	}
}
async function listDirectoryEntries(params) {
	const input = {
		cfg: params.config,
		accountId: params.accountId,
		...params.query ? { query: params.query } : {},
		limit: params.limit,
		runtime: defaultRuntime
	};
	const directory = params.plugin.directory;
	const listPeersLive = directory?.listPeersLive;
	const listGroupsLive = directory?.listGroupsLive;
	const [configuredPeers, livePeers, configuredGroups, liveGroups] = await Promise.all([
		directory?.listPeers?.(input) ?? [],
		listPeersLive ? listLiveDirectoryEntries({
			channel: params.plugin.id,
			accountId: params.accountId,
			kind: "peers",
			run: () => listPeersLive(input)
		}) : [],
		directory?.listGroups?.(input) ?? [],
		listGroupsLive ? listLiveDirectoryEntries({
			channel: params.plugin.id,
			accountId: params.accountId,
			kind: "groups",
			run: () => listGroupsLive(input)
		}) : []
	]);
	const entries = /* @__PURE__ */ new Map();
	for (const entry of [
		...configuredPeers,
		...livePeers,
		...configuredGroups,
		...liveGroups
	]) entries.set(`${entry.kind}\u0000${entry.id.trim()}`, entry);
	return [...entries.values()];
}
async function discoverChannelAddresses(params) {
	const plugin = params.deps.resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.config
	});
	if (!plugin?.directory) return {
		channel: params.channel.trim().toLowerCase(),
		discoveredConversationRefs: /* @__PURE__ */ new Set()
	};
	const identities = /* @__PURE__ */ new Map();
	for (const accountId of new Set(plugin.config.listAccountIds(params.config).filter(Boolean))) {
		const account = await resolveChannelAccount({
			plugin,
			cfg: params.config,
			accountId
		});
		if (plugin.config.isEnabled?.(account, params.config) === false) continue;
		if (plugin.config.isConfigured && !await plugin.config.isConfigured(account, params.config)) continue;
		const entries = await listDirectoryEntries({
			config: params.config,
			accountId,
			...params.query ? { query: params.query } : {},
			limit: params.limit,
			plugin
		});
		for (const entry of entries) {
			const target = entry.id.trim();
			if (!target) continue;
			const display = entry.name?.trim() || entry.handle?.trim() || void 0;
			const route = await params.deps.resolveOutboundSessionRoute({
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
	const eligibleIdentities = await runConversationDatabaseWrite(params.scope, (scope) => {
		const currentConfig = params.readCurrentConfig?.() ?? params.config;
		const eligible = [...identities.values()].filter((identity) => {
			const eligibility = resolveConversationRouteEligibilityForAgent({
				config: currentConfig,
				agentId: params.agentId,
				conversation: {
					...identity,
					target: identity.deliveryTarget
				}
			});
			if (eligibility === "unavailable") throw new Error("Conversation route ownership is temporarily unavailable");
			return eligibility === "eligible";
		});
		params.deps.registerConversationAddresses(scope, eligible);
		return eligible;
	});
	return {
		channel: plugin.id,
		discoveredConversationRefs: new Set(eligibleIdentities.map((identity) => identity.conversationRef))
	};
}
function matchesConversationQuery(conversation, query) {
	return [
		conversation.conversationRef,
		conversation.target,
		conversation.label
	].some((value) => value?.toLowerCase().includes(query));
}
/** Lists persisted and channel-directory addresses from the Gateway's live plugin runtime. */
async function runGatewayConversationList(params, deps = defaultDeps) {
	const scope = await prepareConversationRegistryScope(params);
	const query = params.query?.trim() || void 0;
	const discovery = params.channel ? await discoverChannelAddresses({
		config: params.config,
		agentId: params.agentId,
		channel: params.channel,
		...query ? { query } : {},
		limit: params.limit,
		scope,
		deps,
		...params.readCurrentConfig ? { readCurrentConfig: params.readCurrentConfig } : {}
	}) : void 0;
	const conversations = await deps.listConversations(scope, discovery ? { channel: discovery.channel } : {});
	const currentConfig = params.readCurrentConfig?.() ?? params.config;
	const normalizedQuery = query?.toLowerCase() ?? "";
	const searchQuery = normalizedQuery.startsWith("@") && normalizedQuery.length > 1 ? normalizedQuery.slice(1) : normalizedQuery;
	return { conversations: conversations.filter((entry) => {
		if (query && discovery?.discoveredConversationRefs.has(entry.conversationRef) !== true && !matchesConversationQuery(entry, searchQuery)) return false;
		const eligibility = resolveConversationRouteEligibilityForAgent({
			config: currentConfig,
			agentId: params.agentId,
			conversation: entry
		});
		if (eligibility === "unavailable") throw new Error("Conversation route ownership is temporarily unavailable");
		return eligibility === "eligible";
	}).slice(0, params.limit).map(presentConversation) };
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
	if (result.kind !== "send") return;
	const sendResult = result.sendResult?.result;
	if (sendResult && "receipt" in sendResult && sendResult.receipt) {
		const receiptId = resolveMessageReceiptPrimaryId(sendResult.receipt);
		if (receiptId) return receiptId;
	}
	if (sendResult && "messageId" in sendResult && typeof sendResult.messageId === "string") return sendResult.messageId.trim() || void 0;
	const payload = result.payload;
	if (payload && typeof payload === "object" && !Array.isArray(payload)) {
		const messageId = payload.messageId;
		return typeof messageId === "string" && messageId.trim() ? messageId.trim() : void 0;
	}
}
function resultFromExistingOperation(operation) {
	switch (operation.status) {
		case "sent":
		case "replied": return {
			deliveryStatus: "sent",
			operation,
			...operation.platformMessageId || operation.preparedMessageId ? { messageId: operation.platformMessageId ?? operation.preparedMessageId } : {}
		};
		case "queued": return {
			deliveryStatus: "queued",
			operation,
			...operation.preparedMessageId ? { messageId: operation.preparedMessageId } : {}
		};
		case "suppressed": return {
			deliveryStatus: "suppressed",
			operation
		};
		case "rejected": throw new ConversationDeliveryRejectedError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
		case "unknown": return {
			deliveryStatus: "unknown",
			operation
		};
		case "created": return;
	}
	return operation.status;
}
/**
* Sends one external message after a durable operation and queue intent exist.
* A retry with the same operation id observes prior state instead of re-sending.
*/
async function sendGatewayConversationMessage(params) {
	const scope = params.scope;
	const conversationDeliveryTarget = captureConversationDeliveryTarget(scope);
	const begun = params.operation ? {
		created: false,
		record: params.operation
	} : await beginConversationDeliveryOperation(scope, {
		operationId: params.operationId,
		operationKind: params.operationKind,
		conversationRef: params.conversation.conversationRef,
		...params.context.sourceSessionKey ? { sourceSessionKey: params.context.sourceSessionKey } : {},
		message: params.message,
		...params.preparedMessageId ? { preparedMessageId: params.preparedMessageId } : {}
	}, params.assertCurrent);
	params.assertCurrent();
	const existing = resultFromExistingOperation(begun.record);
	if (existing) return existing;
	const readAuthoritativeOperation = async () => await getConversationDeliveryOperation(scope, begun.record.operationId) ?? begun.record;
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
			deliveryIntentId: buildConversationDeliveryIntentId(params.context.agentId, begun.record.operationId),
			deliveryCompletion: {
				kind: "conversation",
				agentId: scope.agentId,
				operationId: begun.record.operationId,
				storePath: scope.storePath,
				routeFingerprint: params.routeFingerprint
			},
			conversationDeliveryTarget,
			onDeliveryAttempt: async () => params.assertCurrent(),
			...begun.record.preparedMessageId ? { preparedMessageId: begun.record.preparedMessageId } : {},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		if (action.kind !== "send") throw new Error(`Conversation delivery returned unexpected action: ${action.kind}`);
		if (action.dryRun) throw new Error("Conversation delivery was only prepared; no message was sent");
		if (action.handledBy !== "core" || !action.sendResult) throw new Error("Conversation delivery did not return a core platform send result");
		const messageId = readMessageIdFromActionResult(action);
		if (action.sendResult.deliveryStatus === "suppressed") return {
			deliveryStatus: "suppressed",
			operation: await markConversationDeliverySuppressed(scope, begun.record.operationId)
		};
		if (action.sendResult.deliveryStatus !== "sent") throw new Error(`Conversation delivery was not confirmed (${action.sendResult.deliveryStatus ?? "unknown"})`);
		const operation = await markConversationDeliverySent(scope, begun.record.operationId, messageId);
		const confirmedMessageId = messageId ?? operation.platformMessageId ?? operation.preparedMessageId;
		return {
			deliveryStatus: "sent",
			operation,
			...confirmedMessageId ? { messageId: confirmedMessageId } : {}
		};
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
		assertConversationRouteEligibleForAgent({
			config: currentConfig,
			agentId: params.agentId,
			conversation
		});
		const routeFingerprint = resolveConversationRouteFingerprint(conversation);
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
			assertCurrent: () => {
				params.signal?.throwIfAborted();
				assertConversationDeliveryAttemptAuthorized({
					config: params.readCurrentConfig?.() ?? currentConfig,
					agentId: params.agentId,
					conversationRef: conversation.conversationRef,
					expectedRouteFingerprint: routeFingerprint,
					scope
				});
			},
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
	}
}
//#endregion
//#region src/gateway/conversation-turn.ts
function hasConversationSessionBinding(conversation) {
	return Boolean(conversation.sessionId && conversation.sessionKey);
}
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
	switch (operation.status) {
		case "sent": return {
			...base,
			status: "sent",
			correlationPersisted: true,
			error: "Message was already sent; no process-local reply waiter remains."
		};
		case "queued": return {
			...base,
			status: "queued",
			correlationPersisted: true,
			error: "Delivery is queued; a later reply will start an ordinary inbound turn."
		};
		case "suppressed": return {
			...base,
			status: "suppressed",
			correlationPersisted: false,
			error: "Delivery was suppressed before a message was sent."
		};
		case "rejected": throw new ConversationInputError(operation.rejectionError ?? "Conversation delivery was permanently rejected");
		case "unknown": return {
			...base,
			status: "unknown",
			correlationPersisted: false,
			error: "Delivery could not be confirmed and will not be retried automatically."
		};
		case "replied": return {
			...base,
			status: "sent",
			correlationPersisted: true,
			error: "A reply was recorded, but its durable reply payload is incomplete."
		};
	}
	return operation.status;
}
function prepareConversationMessageId(params) {
	const prepare = params.plugin?.outbound?.prepareConversationTurnMessageId;
	if (!prepare) throw new ConversationInputError(`Channel ${params.conversation.channel} does not support correlated conversation turns; use conversations_send`);
	let preparedMessageId;
	try {
		preparedMessageId = prepare({
			cfg: params.config,
			to: params.conversation.target,
			text: params.message,
			accountId: params.conversation.accountId,
			threadId: params.conversation.threadId
		}).trim();
	} catch (error) {
		throw new ConversationInputError(error instanceof Error ? error.message : String(error));
	}
	if (!preparedMessageId) throw new ConversationInputError(`Channel ${params.conversation.channel} prepared an empty conversation-turn message id`);
	return preparedMessageId;
}
async function ensureConversationContextBinding(params) {
	if (hasConversationSessionBinding(params.conversation)) return params.conversation;
	const binding = prepareOutboundSessionBinding(params.binding);
	const channel = params.plugin?.id ?? params.conversation.channel;
	const route = await resolveOutboundSessionRoute({
		cfg: params.config,
		channel,
		...params.plugin ? { plugin: params.plugin } : {},
		agentId: params.agentId,
		accountId: params.conversation.accountId,
		target: params.conversation.target,
		...params.conversation.threadId ? { threadId: params.conversation.threadId } : {}
	});
	if (!route) throw new ConversationInputError(`Conversation ${params.conversation.conversationRef} no longer resolves to a channel route`);
	await bindOutboundSessionEntry({
		cfg: params.config,
		channel,
		accountId: params.conversation.accountId,
		route,
		sourceSessionKey: params.sourceSessionKey,
		assertCommitAllowed: () => {
			assertConversationDeliveryAttemptAuthorized({
				config: params.readCurrentConfig(),
				agentId: params.agentId,
				conversationRef: params.conversation.conversationRef,
				expectedRouteFingerprint: params.expectedRouteFingerprint,
				scope: params.scope
			});
		}
	}, binding);
	const bound = await readConversation(params.scope, params.conversation.conversationRef);
	if (!bound || !hasConversationSessionBinding(bound)) throw new Error(`Conversation ${params.conversation.conversationRef} could not create its local context binding`);
	return bound;
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
	assertConversationRouteEligibleForAgent({
		config: currentConfig,
		agentId: params.agentId,
		conversation: discoveredConversation
	});
	const discoveredRouteFingerprint = resolveConversationRouteFingerprint(discoveredConversation);
	if (begun) {
		const completed = resultForCompletedOperation(begun.record);
		if (completed) return completed;
	}
	const plugin = resolveOutboundChannelPlugin({
		channel: discoveredConversation.channel,
		cfg: currentConfig
	});
	const candidatePreparedMessageId = begun ? begun.record.preparedMessageId : prepareConversationMessageId({
		plugin,
		config: currentConfig,
		conversation: discoveredConversation,
		message: params.message
	});
	if (!candidatePreparedMessageId) throw new ConversationInputError(`Conversation turn ${params.turnId} is missing its prepared message id`);
	const conversation = await ensureConversationContextBinding({
		scope,
		binding,
		config: currentConfig,
		agentId: params.agentId,
		sourceSessionKey: params.sourceSessionKey,
		conversation: discoveredConversation,
		plugin,
		expectedRouteFingerprint: discoveredRouteFingerprint,
		readCurrentConfig
	});
	const authorizedConfig = readCurrentConfig();
	assertConversationRouteEligibleForAgent({
		config: authorizedConfig,
		agentId: params.agentId,
		conversation
	});
	const routeFingerprint = resolveConversationRouteFingerprint(conversation);
	const assertCurrent = () => {
		assertConversationDeliveryAttemptAuthorized({
			config: readCurrentConfig(),
			agentId: params.agentId,
			conversationRef: conversation.conversationRef,
			expectedRouteFingerprint: routeFingerprint,
			expectedSessionId: conversation.sessionId,
			expectedSessionKey: conversation.sessionKey,
			scope
		});
	};
	if (!begun) {
		try {
			begun = await beginConversationDeliveryOperation(scope, {
				operationId: params.turnId,
				operationKind: "turn",
				conversationRef: conversation.conversationRef,
				...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
				message: params.message,
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
			assertCurrent
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
}
//#endregion
//#region src/gateway/server-methods/conversations.ts
function validateConversationSourceSession(params) {
	if (!params.sourceSessionKey) return true;
	const parsed = parseAgentSessionKey(params.sourceSessionKey);
	if (parsed) {
		if (normalizeAgentId(parsed.agentId) === normalizeAgentId(params.agentId)) return true;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${params.agentId}" does not match session key agent "${parsed.agentId}"`));
		return false;
	}
	const owner = resolveRequestedSessionAgentId(params.config, params.sourceSessionKey, params.agentId);
	if (owner.ok) return true;
	params.respond(false, void 0, owner.error);
	return false;
}
function conversationOperationKey(params) {
	return `conversations.${params.method}:${JSON.stringify([params.agentId, params.operationId])}`;
}
function bindConversationOperationIdentity(context, request) {
	const identity = sha256Hex(JSON.stringify([
		request.agentId,
		request.sourceSessionKey ?? null,
		request.conversationRef,
		request.message,
		request.timeoutMs ?? null
	]));
	const operationKey = conversationOperationKey(request);
	const identityKey = `${operationKey}:identity`;
	const completed = context.dedupe.get(operationKey);
	if (completed && completed.requestIdentity !== identity) return null;
	const prior = context.dedupe.get(identityKey);
	if (prior) {
		if (!prior.ok || prior.requestIdentity !== identity) return null;
		context.dedupe.set(identityKey, {
			...prior,
			ts: Date.now()
		});
		return identity;
	}
	context.dedupe.set(identityKey, {
		ts: Date.now(),
		ok: true,
		requestIdentity: identity
	});
	return identity;
}
function releaseConversationOperationIdentity(params) {
	const identityKey = `${params.operationKey}:identity`;
	if (params.context.dedupe.get(identityKey)?.requestIdentity === params.requestIdentity) params.context.dedupe.delete(identityKey);
}
async function runConversationOperation(params) {
	const inflight = resolveGatewayInflightRequest({
		context: params.context,
		dedupeKey: params.dedupeKey,
		idempotencyKey: params.operationId,
		respond: params.respond
	});
	if (inflight.kind === "handled") {
		await inflight.done;
		return;
	}
	const { dedupeKey, inflightMap } = inflight;
	let releaseRequestIdentity = false;
	const work = (async () => {
		try {
			const payload = await params.execute();
			const result = {
				ok: true,
				payload,
				meta: { channel: payload.channel }
			};
			cacheGatewayDedupeResult({
				context: params.context,
				dedupeKey,
				requestIdentity: params.requestIdentity,
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
				context: params.context,
				dedupeKey,
				requestIdentity: params.requestIdentity,
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
			respond: params.respond
		});
	} finally {
		if (releaseRequestIdentity) releaseConversationOperationIdentity({
			context: params.context,
			operationKey: dedupeKey,
			requestIdentity: params.requestIdentity
		});
	}
}
async function handleConversationWrite({ context, client, respond }, request) {
	const readCurrentConfig = () => context.getRuntimeConfig();
	const config = readCurrentConfig();
	if (!validateConversationSourceSession({
		...request,
		config,
		respond
	})) return;
	const requestIdentity = bindConversationOperationIdentity(context, request);
	if (!requestIdentity) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `conversation ${request.method} ${request.operationId} was already used with different input`));
		return;
	}
	await runConversationOperation({
		context,
		dedupeKey: conversationOperationKey(request),
		operationId: request.operationId,
		requestIdentity,
		respond,
		execute: () => {
			const command = {
				config,
				readCurrentConfig,
				agentId: request.agentId,
				senderIsOwner: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true,
				...request.sourceSessionKey ? { sourceSessionKey: request.sourceSessionKey } : {},
				conversationRef: request.conversationRef,
				message: request.message
			};
			return request.method === "send" ? runGatewayConversationSend({
				...command,
				operationId: request.operationId
			}) : runGatewayConversationTurn({
				...command,
				turnId: request.operationId,
				timeoutMs: request.timeoutMs
			});
		}
	});
}
const conversationHandlers = {
	"conversations.list": defineValidatedGatewayMethod("conversations.list", validateConversationListParams, async ({ params: request, respond, context }) => {
		const readCurrentConfig = () => context.getRuntimeConfig();
		try {
			respond(true, await runGatewayConversationList({
				config: readCurrentConfig(),
				readCurrentConfig,
				agentId: request.agentId,
				...request.channel ? { channel: request.channel } : {},
				...request.query ? { query: request.query } : {},
				limit: request.limit ?? 50
			}), void 0);
		} catch (cause) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, cause instanceof Error ? cause.message : String(cause)));
		}
	}),
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
