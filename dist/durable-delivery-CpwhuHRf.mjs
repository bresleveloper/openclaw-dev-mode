import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as getPluginRuntimeGatewayRequestScope, u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { _ as isPluginRegistryGatewayViewOf, d as getPluginRegistryGatewayOwner, u as getPluginRegistryGatewayChannelRegistration } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { i as getPluginRuntimeLoadContext } from "./load-context-Bf_u2yr8.mjs";
import { s as getGroupThreadDispatchContext } from "./group-thread-context-Dq9sbt-L.mjs";
import { _ as isReplyPayloadTargetSuppressed } from "./reply-payload-NzglYOOT.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { c as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-AM7vMnRv.mjs";
import { s as resolveOutboundDurableFinalDeliverySupport } from "./deliver-prepare-Cs0EjsCO.mjs";
import { t as buildOutboundSessionContext } from "./session-context-Kov7ff_A.mjs";
import { n as sendDurableMessageBatchCore, r as sendStructuredDurableMessageBatchCore, t as durableMessageBatchMayHaveReachedRecipient } from "./send-BOL6c5DR.mjs";
import { t as deriveDurableFinalDeliveryRequirements } from "./capabilities-CZr1Vdri.mjs";
import { t as normalizeDeliverableOutboundChannel } from "./channel-resolution-DMBKJyb_.mjs";
import "./deliver-CYqnNQia.mjs";
import { c as createChannelDeliveryResultFromReceipt, u as createChannelPartialDeliveryError } from "./live-TWzvpgza.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/channels/turn/durable-delivery-runtime.ts
/** Final delivery is a new operation of the admitting Gateway, not of the completed model turn. */
function withDurableDeliveryRuntime(input, deliver) {
	const registry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const owner = registry && getPluginRegistryGatewayOwner(registry);
	if (!registry || !owner) return deliver(input.cfg);
	const current = owner.current();
	const reject = (message) => {
		throw new PlatformMessageNotDispatchedError(message, {
			cause: new Error(message),
			retryable: false
		});
	};
	if (!current) return reject("The Gateway that admitted this reply is closing.");
	const assertCurrent = () => {
		if (owner.current() !== current) reject("The reply delivery runtime changed before sending.");
	};
	if (current === registry || isPluginRegistryGatewayViewOf(registry, current)) return runOutsidePluginRuntimeGenerationScope(() => withPluginRuntimeRegistryScope(current, () => deliver(input.cfg, assertCurrent)));
	const cfg = getPluginRuntimeLoadContext(current)?.rawConfig;
	const channel = current.channels.find((entry) => entry.plugin.id === input.channel);
	const prepareRuntimeHandoff = input.prepareRuntimeHandoff;
	const admittedChannel = getPluginRegistryGatewayChannelRegistration(registry, input.channel);
	const retainedChannel = channel && admittedChannel?.pluginId === channel.pluginId && admittedChannel.plugin === channel.plugin;
	if (!cfg || !isDeepStrictEqual(cfg.channels?.[input.channel], input.cfg.channels?.[input.channel]) || !isDeepStrictEqual(cfg.channels?.defaults, input.cfg.channels?.defaults) || !channel || !retainedChannel || !isDeepStrictEqual(cfg.plugins?.entries?.[channel.pluginId], input.cfg.plugins?.entries?.[channel.pluginId])) return reject("The reply channel changed; delivery was not started.");
	return runOutsidePluginRuntimeGenerationScope(() => withPluginRuntimeRegistryScope(current, () => {
		const preparedCfg = prepareRuntimeHandoff ? prepareRuntimeHandoff(cfg) : cfg;
		assertCurrent();
		return deliver(preparedCfg, assertCurrent);
	}));
}
//#endregion
//#region src/channels/turn/durable-delivery.ts
function resolveDeliveryTarget(params) {
	return normalizeOptionalString(params.to) ?? normalizeOptionalString(params.ctxPayload.OriginatingTo) ?? normalizeOptionalString(params.ctxPayload.To);
}
function resolveDurableInboundReplyToId(params) {
	if (isReplyPayloadTargetSuppressed(params.payload)) return null;
	if (params.replyToId === null || params.payload.replyToId === null) return null;
	return normalizeOptionalString(params.replyToId) ?? normalizeOptionalString(params.payload.replyToId) ?? normalizeOptionalString(params.ctxPayload.ReplyToIdFull) ?? normalizeOptionalString(params.ctxPayload.ReplyToId);
}
function toDeliveryIntent(intent) {
	return {
		id: intent.id,
		kind: "outbound_queue",
		queuePolicy: intent.queuePolicy
	};
}
function resolveDurableSuppression(send) {
	const hookEffect = send.payloadOutcomes?.find((outcome) => outcome.status === "suppressed")?.hookEffect;
	return {
		reason: send.reason,
		...hookEffect?.cancelReason ? { cancelReason: hookEffect.cancelReason } : {},
		...hookEffect?.metadata ? { metadata: hookEffect.metadata } : {}
	};
}
function isDurableInboundReplyDeliveryHandled(result) {
	return result.status === "handled_visible" || result.status === "handled_no_send";
}
function throwIfDurableInboundReplyDeliveryFailed(result) {
	if (result.status === "failed") throw result.error;
}
function resolveAcceptedVisibleContent(results) {
	return results.map((result) => result.meta?.visibleText).filter((value) => typeof value === "string").join("") || void 0;
}
async function deliverInboundReplyWithMessageSendContextCore(params) {
	return await deliverInboundReplyWithMessageSendContext(params, sendDurableMessageBatchCore);
}
/** Delivers a prepared final reply through the same durable owner without parsing its text. */
async function deliverStructuredInboundReplyWithMessageSendContextCore(params) {
	const { plan, ...context } = params;
	return await deliverInboundReplyWithMessageSendContext({
		...context,
		payload: plan.payload
	}, ({ payloads: _payloads, ...sendParams }) => sendStructuredDurableMessageBatchCore({
		...sendParams,
		plan: [plan]
	}));
}
async function deliverInboundReplyWithMessageSendContext(input, sendBatch) {
	if (input.info.kind !== "final") return {
		status: "not_applicable",
		reason: "non_final"
	};
	try {
		return await withDurableDeliveryRuntime(input, (cfg, assertCurrent) => deliverAdmittedInboundReply({
			...input,
			cfg
		}, sendBatch, assertCurrent));
	} catch (error) {
		return {
			status: "failed",
			error
		};
	}
}
async function deliverAdmittedInboundReply(input, sendBatch, assertCurrent) {
	const group = getGroupThreadDispatchContext();
	const params = group ? {
		...input,
		agentId: group.ctx.AgentId ?? input.agentId,
		ctxPayload: group.ctx,
		runId: group.runState.runId,
		executionIdentityToken: group.runState.executionIdentityToken
	} : input;
	const channel = normalizeDeliverableOutboundChannel(params.channel);
	const to = resolveDeliveryTarget(params);
	if (!channel) return {
		status: "unsupported",
		reason: "missing_channel"
	};
	if (!to) return {
		status: "unsupported",
		reason: "missing_target"
	};
	const replyToId = resolveDurableInboundReplyToId(params);
	const threadId = "threadId" in params ? params.threadId : params.ctxPayload.MessageThreadId;
	const requiredCapabilities = params.requiredCapabilities ?? deriveDurableFinalDeliveryRequirements({
		payload: params.payload,
		replyToId,
		threadId,
		silent: params.silent
	});
	const durability = requiredCapabilities.reconcileUnknownSend === true ? "required" : "best_effort";
	const support = await resolveOutboundDurableFinalDeliverySupport({
		cfg: params.cfg,
		agentId: params.agentId,
		channel,
		requirements: requiredCapabilities
	});
	if (!support.ok) return {
		status: "unsupported",
		reason: support.reason,
		...support.capability ? { capability: support.capability } : {}
	};
	const session = buildOutboundSessionContext({
		cfg: params.cfg,
		sessionKey: params.ctxPayload.SessionKey,
		policySessionKey: params.ctxPayload.RuntimePolicySessionKey,
		conversationType: params.ctxPayload.ChatType,
		agentId: params.agentId,
		requesterAccountId: params.accountId ?? params.ctxPayload.AccountId,
		requesterSenderId: params.ctxPayload.SenderId ?? params.ctxPayload.From,
		requesterSenderName: params.ctxPayload.SenderName,
		requesterSenderUsername: params.ctxPayload.SenderUsername,
		requesterSenderE164: params.ctxPayload.SenderE164
	});
	assertCurrent?.();
	const send = await sendBatch({
		assertDirectAdapterHandoff: assertCurrent,
		cfg: params.cfg,
		channel,
		to,
		accountId: params.accountId,
		payloads: [params.payload],
		...params.runId ?? params.executionIdentityToken?.runId ? { runId: params.runId ?? params.executionIdentityToken?.runId } : {},
		...params.executionIdentityToken ? { executionIdentityToken: params.executionIdentityToken } : {},
		threadId,
		replyToId,
		replyToMode: params.replyToMode,
		formatting: params.formatting,
		identity: params.identity,
		deps: params.deps,
		mediaAccess: params.mediaAccess,
		silent: params.silent,
		durability,
		...requiredCapabilities.reconcileUnknownSend === true ? { requireUnknownSendReconciliation: true } : {},
		session,
		gatewayClientScopes: params.ctxPayload.GatewayClientScopes ?? []
	});
	if (send.status === "failed") return {
		status: "failed",
		error: send.error,
		...!durableMessageBatchMayHaveReachedRecipient(send) && isProvenDeliveryNotSentError(send.error) ? { sentBeforeError: false } : {}
	};
	const content = send.status === "partial_failed" ? resolveAcceptedVisibleContent(send.results) : void 0;
	const receiptDelivery = createChannelDeliveryResultFromReceipt({
		receipt: send.receipt,
		threadId: threadId == null ? void 0 : String(threadId),
		...replyToId ? { replyToId } : {},
		visibleReplySent: send.status !== "suppressed",
		...content ? { content } : {},
		...send.deliveryIntent ? { deliveryIntent: toDeliveryIntent(send.deliveryIntent) } : {}
	});
	if (send.status === "partial_failed") return {
		status: "failed",
		error: createChannelPartialDeliveryError(send.error, {
			...receiptDelivery,
			visibleReplySent: true
		}),
		sentBeforeError: true
	};
	if (send.status === "suppressed") return {
		status: "handled_no_send",
		reason: "no_visible_result",
		delivery: {
			...receiptDelivery,
			suppression: resolveDurableSuppression(send)
		}
	};
	return {
		status: "handled_visible",
		delivery: receiptDelivery
	};
}
//#endregion
export { throwIfDurableInboundReplyDeliveryFailed as i, deliverStructuredInboundReplyWithMessageSendContextCore as n, isDurableInboundReplyDeliveryHandled as r, deliverInboundReplyWithMessageSendContextCore as t };
