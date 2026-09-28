import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { i as channelRouteTargetsMatchExact } from "./channel-route-Czo5mOSj.mjs";
import { x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { rt as buildConversationIdentity } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { _ as recordConversationProgressReceipt, f as getConversationDeliveryOperation, p as getConversationProgressSnapshot, v as updateConversationProgressSnapshot } from "./delivery-completion-DF_myTJP.mjs";
import { a as resolveCurrentConversationSession, i as resolveConversationRegistryScope, r as resolveConversation, s as runConversationDatabaseWrite } from "./conversation-registry-CUSGHWCk.mjs";
import { a as normalizeTargetForProvider } from "./target-normalization-DqKkj4kz.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { o as isChannelAccountExplicitlyDisabled } from "./account-state-Bap6_YQI.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-kP4MplS_.mjs";
import { a as resolveOutboundTarget } from "./targets-xfpX_XXd.mjs";
import { n as resolveMessageActionOutcome } from "./message-action-contracts-B8BlEOFc.mjs";
import { n as runMessageAction } from "./message-action-runner-Bo0kYPqQ.mjs";
import { t as createTypingCallbacks } from "./typing-C8rPbA2A.mjs";
import "./message.config.runtime-C4b-icHJ.mjs";
//#region src/tasks/task-registry-progress-runtime.ts
async function prepareTaskProgressTarget(params, action = "edit") {
	const cfg = getRuntimeConfig();
	const channel = params.origin.channel;
	const to = params.origin.to;
	if (!channel || !to) throw new Error("Task progress has no captured destination");
	const plugin = getChannelPlugin(channel);
	if (!plugin) return "unknown";
	const accountId = params.origin.accountId ?? resolveChannelDefaultAccountId({
		plugin,
		cfg
	});
	const scope = resolveConversationRegistryScope({
		agentId: params.agentId,
		config: cfg
	});
	const assertRequester = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
		const currentConfig = getRuntimeConfig();
		if (!plugin.config.listAccountIds(currentConfig).includes(accountId) || isChannelAccountExplicitlyDisabled({
			cfg: currentConfig,
			channel,
			accountId
		})) throw new Error("Task progress account is no longer available");
		if (loadSessionEntryReadOnly({
			storePath: scope.storePath,
			sessionKey: params.sessionKey
		})?.sessionId !== params.requesterSessionId) throw new Error("Task progress requester was replaced");
	};
	assertRequester();
	const existing = getConversationDeliveryOperation(scope, params.operationId);
	const hooks = getGlobalHookRunner();
	if (hooks?.hasHooks("reply_payload_sending")) return "suppressed";
	if (!plugin.actions?.writeAuthorityActions?.includes(action) || hooks?.hasHooks("message_sending")) return existing ? "unknown" : "unsupported";
	const target = resolveOutboundTarget({
		cfg,
		plugin,
		channel,
		accountId,
		to,
		mode: "explicit"
	});
	if (!target.ok) throw target.error;
	const route = await resolveOutboundSessionRoute({
		cfg,
		plugin,
		channel,
		accountId,
		agentId: params.agentId,
		target: target.to,
		threadId: params.origin.threadId
	});
	assertRequester();
	const identity = route ? buildConversationIdentity({
		channel,
		accountId,
		kind: route.chatType,
		peerId: route.peer.id,
		deliveryTarget: route.to,
		threadId: route.threadId
	}) : null;
	const conversation = identity ? resolveConversation(scope, identity.conversationRef) : void 0;
	if (!conversation || !route) return existing ? "unknown" : "unsupported";
	const assertCurrent = () => {
		assertRequester();
		const current = resolveCurrentConversationSession(scope, conversation.conversationRef, {
			sessionKey: params.sessionKey,
			sessionId: params.requesterSessionId
		});
		if (current?.sessionKey !== params.sessionKey || current.sessionId !== params.requesterSessionId) throw new Error("Task progress conversation was replaced");
		const currentHooks = getGlobalHookRunner();
		if (currentHooks?.hasHooks("message_sending") || currentHooks?.hasHooks("reply_payload_sending")) throw new Error("Task progress preview policy changed");
	};
	assertCurrent();
	return {
		cfg,
		channel,
		plugin,
		accountId,
		scope,
		route,
		conversation,
		assertCurrent
	};
}
/** Adopts positive platform evidence without sending or editing a message. */
async function adoptTaskProgressMessage(params) {
	const prepared = await prepareTaskProgressTarget(params);
	if (typeof prepared === "string") return false;
	const { cfg, channel, plugin, accountId, scope, route, conversation, assertCurrent } = prepared;
	assertCurrent();
	const { receipt } = params;
	if (!receipt.messageId.trim()) return false;
	const target = resolveOutboundTarget({
		cfg,
		plugin,
		channel,
		accountId,
		to: receipt.to,
		mode: "explicit"
	});
	if (!target.ok) return false;
	const receiptRoute = await resolveOutboundSessionRoute({
		cfg,
		plugin,
		channel,
		accountId,
		agentId: params.agentId,
		target: target.to,
		threadId: receipt.threadId
	});
	assertCurrent();
	if (!receiptRoute || !channelRouteTargetsMatchExact({
		left: {
			channel: receipt.channel,
			accountId: receipt.accountId ?? resolveChannelDefaultAccountId({
				plugin,
				cfg
			}),
			to: normalizeTargetForProvider(channel, receiptRoute.to, plugin),
			threadId: receiptRoute.threadId
		},
		right: {
			channel,
			accountId,
			to: normalizeTargetForProvider(channel, route.to, plugin),
			threadId: route.threadId
		}
	})) return false;
	await runConversationDatabaseWrite(scope, (writeScope) => recordConversationProgressReceipt(writeScope, {
		operationId: params.operationId,
		conversationRef: conversation.conversationRef,
		sourceSessionKey: params.sessionKey,
		message: receipt.text,
		platformMessageId: receipt.messageId,
		progressSnapshot: receipt.snapshot,
		assertCurrent
	}));
	assertCurrent();
	return true;
}
/** Presentation state is scoped to the live requester window, not write authority. */
function readTaskProgressSnapshot(params) {
	const scope = resolveConversationRegistryScope({
		agentId: params.agentId,
		config: getRuntimeConfig()
	});
	if (loadSessionEntryReadOnly({
		storePath: scope.storePath,
		sessionKey: params.sessionKey
	})?.sessionId !== params.requesterSessionId) return;
	const receipt = getConversationDeliveryOperation(scope, params.operationId);
	if (!receipt || receipt.operationKind !== "send" || receipt.sourceSessionKey !== params.sessionKey) return;
	const current = resolveCurrentConversationSession(scope, receipt.conversationRef, {
		sessionKey: params.sessionKey,
		sessionId: params.requesterSessionId
	});
	return current?.sessionKey === params.sessionKey && current.sessionId === params.requesterSessionId ? getConversationProgressSnapshot(scope, params.operationId) : void 0;
}
/** Edits only the previously adopted card; an absent or uncertain receipt cannot create one. */
function publishTaskProgressMessage(params) {
	return mutateTaskProgressMessage(params, params);
}
/** Deletes only the previously adopted card after the caller drains its pending edits. */
function deleteTaskProgressMessage(params) {
	return mutateTaskProgressMessage(params);
}
async function mutateTaskProgressMessage(params, update) {
	const action = update ? "edit" : "delete";
	const prepared = await prepareTaskProgressTarget(params, action);
	if (typeof prepared === "string") return prepared;
	const { cfg, channel, plugin, accountId, scope, route, conversation } = prepared;
	const assertReceipt = (receipt) => {
		if (receipt.operationKind !== "send" || receipt.conversationRef !== conversation.conversationRef || receipt.sourceSessionKey !== params.sessionKey) throw new Error("Task progress receipt belongs to another destination");
	};
	prepared.assertCurrent();
	const receipt = getConversationDeliveryOperation(scope, params.operationId);
	if (!receipt) return "unknown";
	assertReceipt(receipt);
	if (receipt.status === "suppressed") return "suppressed";
	const messageId = receipt.platformMessageId;
	if (receipt.status !== "sent" && receipt.status !== "replied" || !messageId) return "unknown";
	const assertCurrent = () => {
		prepared.assertCurrent();
		const current = getConversationDeliveryOperation(scope, params.operationId);
		if (!current || current.status !== "sent" && current.status !== "replied" || current.platformMessageId !== messageId) throw new Error("Task progress receipt is no longer identified");
		assertReceipt(current);
	};
	if (update) {
		await runConversationDatabaseWrite(scope, (writeScope) => updateConversationProgressSnapshot(writeScope, {
			operationId: params.operationId,
			progressSnapshot: update.snapshot,
			assertCurrent
		}));
		assertCurrent();
		if (update.previousContent === update.content) return "unchanged";
	}
	const result = await runMessageAction({
		cfg,
		action,
		progressSnapshot: update?.snapshot,
		params: {
			channel,
			to: route.to,
			messageId,
			...update ? { message: update.content } : {},
			threadId: route.threadId
		},
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.requesterSessionId,
		defaultAccountId: accountId,
		requesterAccountId: accountId,
		toolContext: {
			currentChannelId: String(params.sourceChannelId ?? route.peer.id),
			currentMessagingTarget: route.to,
			currentChannelProvider: plugin.id,
			currentChatType: route.chatType,
			currentThreadTs: route.threadId === void 0 ? void 0 : String(route.threadId),
			currentMessageId: params.sourceMessageId,
			sameChannelThreadRequired: route.threadId !== void 0
		},
		assertDirectAdapterHandoff: assertCurrent,
		abortSignal: params.signal,
		suppressTranscriptMirror: true,
		gatewayOwnedDelivery: true
	});
	return !result.dryRun && resolveMessageActionOutcome(result).ok ? "sent" : "unknown";
}
/** Reuses the channel typing loop; the task batch owns its lifetime and cancellation. */
function startTaskProgressTyping(params) {
	const channel = params.origin.channel;
	const to = params.origin.to;
	if (!channel || !to || params.signal.aborted) return false;
	const plugin = getChannelPlugin(channel);
	const sendTyping = plugin?.heartbeat?.sendTypingGuarded;
	if (!plugin || !sendTyping) return false;
	const cfg = getRuntimeConfig();
	const accountId = params.origin.accountId ?? resolveChannelDefaultAccountId({
		plugin,
		cfg
	});
	const scope = resolveConversationRegistryScope({
		agentId: params.agentId,
		config: cfg
	});
	const receipt = getConversationDeliveryOperation(scope, params.operationId);
	if (!receipt || receipt.operationKind !== "send" || receipt.sourceSessionKey !== params.sessionKey) return false;
	const controller = new AbortController();
	const signal = AbortSignal.any([params.signal, controller.signal]);
	const assertCurrent = (assertTaskCurrent) => {
		signal.throwIfAborted();
		assertTaskCurrent();
		const currentConfig = getRuntimeConfig();
		const requester = loadSessionEntryReadOnly({
			storePath: scope.storePath,
			sessionKey: params.sessionKey
		});
		const mode = resolveAgentConfig(currentConfig, params.agentId)?.typingMode ?? currentConfig.agents?.defaults?.typingMode;
		const hooks = getGlobalHookRunner();
		const association = resolveCurrentConversationSession(scope, receipt.conversationRef, {
			sessionKey: params.sessionKey,
			sessionId: params.requesterSessionId
		});
		if (requester?.sessionId !== params.requesterSessionId || !association || mode === "never" || !params.isExecutionActive() || !plugin.config.listAccountIds(currentConfig).includes(accountId) || isChannelAccountExplicitlyDisabled({
			cfg: currentConfig,
			channel,
			accountId
		}) || hooks?.hasHooks("message_sending") || hooks?.hasHooks("reply_payload_sending")) throw new Error("Task progress typing is no longer authorized");
	};
	const callbacks = createTypingCallbacks({
		start: async () => {
			await runWithGatewayDetachedWorkContinuation(async () => {
				const assertTaskCurrent = await params.prepareCurrent();
				const assertAuthorized = () => assertCurrent(assertTaskCurrent);
				assertAuthorized();
				await sendTyping({
					cfg: getRuntimeConfig(),
					to,
					accountId,
					threadId: params.origin.threadId,
					signal,
					assertPlatformSendAuthorized: assertAuthorized
				});
			}, "tasks:progress-typing");
		},
		maxDurationMs: 0,
		onStartError: (error) => {
			stop();
			if (!params.signal.aborted) params.onError(error);
		}
	});
	function stop() {
		if (controller.signal.aborted) return;
		controller.abort();
		callbacks.onCleanup?.();
		params.signal.removeEventListener("abort", stop);
		params.onStopped();
	}
	params.signal.addEventListener("abort", stop, { once: true });
	if (params.signal.aborted) {
		stop();
		return false;
	}
	callbacks.onReplyStart();
	return true;
}
//#endregion
export { adoptTaskProgressMessage, deleteTaskProgressMessage, publishTaskProgressMessage, readTaskProgressSnapshot, startTaskProgressTyping };
