import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { S as getGroupThreadDispatchContext } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { a as copyChannelParticipantAdmissionEvidence } from "./admission-evidence-aqOMZf0e.mjs";
import { c as isPlatformMessageNotDispatchedError, l as isPlatformMessageRejectedError, r as PlatformMessageNotDispatchedError } from "./deliver-types-Diy-VQKA.mjs";
import { r as resolveMessageReceiptPrimaryId } from "./receipt-CV_GHeLg.mjs";
import { c as settlePendingFinalDelivery } from "./delivery-completion-DxLFTv-D.mjs";
import { n as createStructuredOutboundPayloadPlan, u as summarizeOutboundPayloadForTransport } from "./payloads-Ce1fWBq6.mjs";
import { p as isReplyDispatchDeliveryPending } from "./reply-dispatcher-CLU3uA4U.mjs";
import { c as applyMessageSendingHook } from "./deliver-prepare-CcRB3z1q.mjs";
import { n as deriveInboundMessageHookContext, r as resolveInboundReplyHookTarget } from "./message-hook-mappers-OANlfuGW.mjs";
import { h as normalizeEmptyPayloadForDelivery } from "./delivery-queue-reconciliation-CRIys7F4.mjs";
import { a as dispatchInboundMessageWithRoutedChannelDispatcher } from "./dispatch-0xqXE-dj.mjs";
import { n as withReplySystemEventContext } from "./system-event-session-key-d4mk05_u.mjs";
import { n as suppressPendingFinalDelivery } from "./dispatch-from-config.pending-final-GQX9YCV_.mjs";
import { l as createMessageSentEmitter, v as assertReplyPayloadSessionWriterDeliveryAuthorized } from "./delivery-queue-recovery-C10ZMWin.mjs";
import { f as isChannelPartialDeliveryError, u as createSuppressedChannelDeliveryResult } from "./live-CJusMVR5.mjs";
import { t as recordInboundSession } from "./session-2tgOCGL5.mjs";
import { n as runWithSessionInitConflictRetry } from "./session-init-conflict-retry-BzOtorl_.mjs";
import { i as throwIfDurableInboundReplyDeliveryFailed, n as deliverStructuredInboundReplyWithMessageSendContextCore, r as isDurableInboundReplyDeliveryHandled, t as deliverInboundReplyWithMessageSendContextCore } from "./durable-delivery-Ck_U7DL3.mjs";
import { n as runPreparedChannelTurnCore } from "./execution-C0xq17nP.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-i3g0Dbwp.mjs";
//#region src/channels/turn/direct-delivery-custody.ts
const NO_PENDING_FINAL_CUSTODY = {
	assertPlatformSendAuthorized: () => void 0,
	onPlatformSendDispatch: () => Promise.resolve()
};
function resolvePendingFinalCompletion(payload) {
	const identity = getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion;
	return identity ? {
		kind: "pending-final",
		...identity
	} : void 0;
}
function createDirectPendingFinalCustody(payload, fallbackStorePath) {
	const completion = resolvePendingFinalCompletion(payload);
	const hasWriterAuthority = Boolean(getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority);
	if (!completion && !hasWriterAuthority) return;
	const identity = completion ? (({ kind: _kind, ...value }) => value)(completion) : void 0;
	let firstDispatch = true;
	let admissionTail = Promise.resolve();
	return {
		bindPendingFinalDelivery: (nextPayload) => identity ? setReplyPayloadMetadata(nextPayload, { pendingFinalDeliveryCompletion: identity }) : nextPayload,
		assertPlatformSendAuthorized: () => assertReplyPayloadSessionWriterDeliveryAuthorized(payload, fallbackStorePath),
		onPlatformSendDispatch: () => {
			const expectedStates = firstDispatch ? ["prepared", "queued"] : ["unknown"];
			firstDispatch = false;
			const admission = admissionTail.then(async () => {
				assertReplyPayloadSessionWriterDeliveryAuthorized(payload, fallbackStorePath);
				if (!completion) return;
				const result = await settlePendingFinalDelivery(completion, "unknown", expectedStates);
				if (result.state !== "unknown") throw new PlatformMessageNotDispatchedError("Pending final delivery ownership changed before platform dispatch", { cause: /* @__PURE__ */ new Error(`pending final delivery is ${result.state}`) });
			});
			admissionTail = admission.catch(() => void 0);
			return admission;
		}
	};
}
function toCoreManagedDeliveryInfo(info) {
	return {
		kind: info.kind,
		...info.participant ? { participant: info.participant } : {},
		...info.assistantMessageIndex === void 0 ? {} : { assistantMessageIndex: info.assistantMessageIndex }
	};
}
//#endregion
//#region src/channels/turn/route-dm-scope.ts
function applyRouteDmScope(context, dmScope) {
	if (!dmScope || context.DmScope === dmScope) return context;
	const scoped = {
		...context,
		DmScope: dmScope
	};
	copyChannelParticipantAdmissionEvidence(context, scoped);
	return scoped;
}
//#endregion
//#region src/channels/turn/lifecycle.ts
function resolvePartialChannelDeliveryResult(error) {
	return isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
}
function assembleResolvedChannelTurn(value) {
	if (!("route" in value)) return value;
	const { cfg, route } = value;
	const routing = {
		ctxPayload: applyRouteDmScope(value.ctxPayload, route.dmScope),
		routeSessionKey: route.sessionKey,
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: route.agentId }),
		recordInboundSession
	};
	if ("runDispatch" in value) {
		const { cfg: _cfg, route: _route, ...turn } = value;
		return {
			...turn,
			...routing
		};
	}
	const { cfg: _cfg, route: _route, ...turn } = value;
	return {
		...turn,
		...routing,
		cfg,
		agentId: route.agentId
	};
}
function resolveAssembledReplyPipeline(params) {
	const adoption = params.turnAdoptionLifecycle ?? params.replyOptions?.turnAdoptionLifecycle;
	let replyOptions = adoption ? {
		...params.replyOptions,
		turnAdoptionLifecycle: adoption
	} : params.replyOptions;
	if (params.routeSessionKey !== params.ctxPayload.SessionKey) replyOptions = withReplySystemEventContext(replyOptions ?? {}, { sessionKey: params.routeSessionKey });
	if (!params.replyPipeline) return {
		dispatcherOptions: params.dispatcherOptions,
		replyOptions
	};
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		...params.replyPipeline
	});
	return {
		dispatcherOptions: {
			...replyPipeline,
			...params.dispatcherOptions
		},
		replyOptions: {
			onModelSelected,
			...replyOptions
		}
	};
}
function isExplicitlyNonVisibleChannelDelivery(result) {
	return typeof result === "object" && result !== null && !Array.isArray(result) && result.visibleReplySent === false;
}
function markChannelDeliveryErrorVisible(error) {
	if (typeof error === "object" && error !== null && !Array.isArray(error)) try {
		Object.assign(error, {
			sentBeforeError: true,
			visibleReplySent: true
		});
		return error;
	} catch {}
	const visibleError = new Error("visible channel reply delivery failed", { cause: error });
	Object.assign(visibleError, {
		sentBeforeError: true,
		visibleReplySent: true
	});
	return visibleError;
}
async function runChannelDeliveryObserver(params) {
	if (!params.onDelivered || isReplyDispatchDeliveryPending(params.result)) return;
	try {
		await params.onDelivered(params.payload, params.info, params.result);
	} catch (error) {
		throw isExplicitlyNonVisibleChannelDelivery(params.result) ? error : markChannelDeliveryErrorVisible(error);
	}
}
function resolveChannelDeliveryMessageId(result) {
	return result?.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : result?.messageIds?.find((messageId) => messageId.trim());
}
async function settleChannelDeliveryAttempts(attempts, delivery) {
	let preferredSettlementError;
	for (const attempt of attempts) try {
		await settleChannelDeliveryAttempt(attempt, delivery.onDelivered, (error) => delivery.onError?.(error, attempt.info));
	} catch (error) {
		if (preferredSettlementError === void 0 || resolvePartialChannelDeliveryResult(error) !== void 0 && resolvePartialChannelDeliveryResult(preferredSettlementError) === void 0) preferredSettlementError = error;
	}
	if (preferredSettlementError !== void 0) throw toErrorObject(preferredSettlementError, "channel delivery settlement failed");
}
async function settleFailedPendingFinalDelivery(payload, error) {
	const completion = resolvePendingFinalCompletion(payload);
	if (!completion) return;
	if (isPlatformMessageRejectedError(error)) await settlePendingFinalDelivery(completion, "suppressed", [
		"prepared",
		"queued",
		"unknown"
	]);
	else if (isPlatformMessageNotDispatchedError(error)) await settlePendingFinalDelivery(completion, "prepared", ["queued", "unknown"]);
	else await settlePendingFinalDelivery(completion, "unknown", ["queued", "unknown"]);
}
async function settleChannelDeliveryAttempt(attempt, onDelivered, onFinalizationError) {
	const emitFailure = (error) => {
		const partial = resolvePartialChannelDeliveryResult(error);
		if (!isPlatformMessageNotDispatchedError(error)) attempt.emitMessageSent?.({
			success: false,
			content: partial?.content ?? attempt.payload.text ?? "",
			error: formatErrorMessage(error),
			messageId: resolveChannelDeliveryMessageId(partial)
		});
	};
	if (attempt.state === "rejected") {
		emitFailure(attempt.error);
		return;
	}
	let finalized;
	try {
		finalized = attempt.result || void 0;
		if (finalized?.finalization) finalized = {
			...finalized,
			...await finalized.finalization,
			finalization: void 0
		};
	} catch (error) {
		try {
			await onFinalizationError?.(error);
		} catch {}
		await settleFailedPendingFinalDelivery(attempt.payload, error);
		emitFailure(error);
		throw toErrorObject(error, "channel delivery finalization failed");
	}
	const pending = isReplyDispatchDeliveryPending(finalized);
	if (!pending && !isExplicitlyNonVisibleChannelDelivery(finalized)) attempt.emitMessageSent?.({
		success: true,
		content: finalized?.content ?? attempt.payload.text ?? "",
		messageId: resolveChannelDeliveryMessageId(finalized)
	});
	const completion = resolvePendingFinalCompletion(attempt.payload);
	if (completion) await settlePendingFinalDelivery(completion, pending ? "unknown" : isExplicitlyNonVisibleChannelDelivery(finalized) ? "suppressed" : "delivered");
	await runChannelDeliveryObserver({
		onDelivered,
		payload: attempt.payload,
		info: attempt.info,
		result: finalized
	});
}
async function applyRoutedDirectMessageSending(params) {
	const hookRunner = getGlobalHookRunner();
	const hookCtx = deriveInboundMessageHookContext(params.turn.ctxPayload);
	const hookResult = await applyMessageSendingHook({
		hookRunner,
		enabled: hookRunner?.hasHooks("message_sending") ?? false,
		payload: params.payload,
		payloadSummary: summarizeOutboundPayloadForTransport(params.payload),
		to: resolveInboundReplyHookTarget(params.turn.ctxPayload, hookCtx),
		channel: params.turn.channel,
		accountId: params.turn.accountId,
		replyToId: params.payload.replyToId ?? params.turn.ctxPayload.ReplyToIdFull ?? params.turn.ctxPayload.ReplyToId,
		threadId: params.turn.ctxPayload.MessageThreadId,
		sessionKey: params.turn.routeSessionKey
	});
	if (hookResult.cancelled) return {
		payload: params.payload,
		suppression: createSuppressedChannelDeliveryResult({
			reason: "cancelled_by_message_sending_hook",
			cancelReason: hookResult.cancelReason,
			metadata: hookResult.hookMetadata
		})
	};
	const payload = normalizeEmptyPayloadForDelivery(hookResult.payload);
	if (!payload) return {
		payload: hookResult.payload,
		suppression: createSuppressedChannelDeliveryResult({ reason: hookResult.contentRewritten ? "empty_after_message_sending_hook" : "no_visible_payload" })
	};
	return { payload: copyReplyPayloadMetadata(params.payload, payload) };
}
function createObserveOnlyDeliveryAdapter() {
	return { deliver: async () => ({ visibleReplySent: false }) };
}
async function dispatchChannelTurnWithDeliveryOwner(...args) {
	const [params, ownership] = args;
	const replyPipeline = resolveAssembledReplyPipeline(params);
	const adoption = params.turnAdoptionLifecycle ?? params.replyOptions?.turnAdoptionLifecycle;
	const delivery = params.admission?.kind === "observeOnly" ? createObserveOnlyDeliveryAdapter() : params.delivery;
	const pendingDeliveryAttempts = [];
	const normalizationSuppressionAttempts = [];
	let agentRun = [];
	const onAgentRunStart = replyPipeline.replyOptions?.onAgentRunStart;
	const replyOptions = {
		...replyPipeline.replyOptions,
		onAgentRunStart: (...runStartArgs) => {
			agentRun = [runStartArgs[0], runStartArgs[1]];
			return onAgentRunStart?.(...runStartArgs);
		}
	};
	const hookCtx = delivery.observeMessageSent ? deriveInboundMessageHookContext(params.ctxPayload) : void 0;
	let messageSentEmitter;
	const getMessageSentEmitter = () => {
		if (!delivery.observeMessageSent || !hookCtx) return;
		const group = getGroupThreadDispatchContext();
		if (!group && messageSentEmitter) return messageSentEmitter;
		const emitter = createMessageSentEmitter({
			hookRunner: getGlobalHookRunner(),
			channel: params.channel,
			to: resolveInboundReplyHookTarget(params.ctxPayload, hookCtx),
			accountId: params.accountId,
			sessionKeyForInternalHooks: group?.ctx.SessionKey ?? params.routeSessionKey,
			runId: group ? group.runState.runId : agentRun[0],
			isGroup: hookCtx.isGroup,
			groupId: hookCtx.groupId,
			logPrefix: "dispatchAssembledChannelTurn"
		});
		if (!group) messageSentEmitter = emitter;
		return emitter;
	};
	const suppressReply = async (payload, info, reason) => {
		const result = createSuppressedChannelDeliveryResult({ reason });
		await suppressPendingFinalDelivery(payload);
		await runChannelDeliveryObserver({
			onDelivered: delivery.onDelivered,
			payload,
			info,
			result
		});
		return result;
	};
	const onReplySuppressed = async (payload, info, reason) => {
		await suppressReply(payload, info, reason);
	};
	const rawDeliver = delivery.deliver?.bind(delivery);
	const rawProviderDeliver = "deliverWithProviderMessageSending" in delivery ? delivery.deliverWithProviderMessageSending?.bind(delivery) : void 0;
	const preparedDeliver = delivery.deliverPrepared?.bind(delivery);
	const preparedProviderDeliver = "deliverPreparedWithProviderMessageSending" in delivery ? delivery.deliverPreparedWithProviderMessageSending?.bind(delivery) : void 0;
	const rawOperation = {
		prepare: (payload) => ({ payload }),
		deliver: rawDeliver ? (value, info) => rawDeliver(value.payload, info) : void 0,
		deliverWithProviderMessageSending: rawProviderDeliver ? (value, info) => rawProviderDeliver(value.payload, info) : void 0,
		deliverDurable: (value, context) => deliverInboundReplyWithMessageSendContextCore({
			...context,
			payload: value.payload
		})
	};
	async function deliverReply(payload, info, operation) {
		const preparedPayloadResult = delivery.preparePayload ? await delivery.preparePayload(payload, info) : payload;
		const preparedValue = preparedPayloadResult === null ? null : operation.prepare(copyReplyPayloadMetadata(payload, preparedPayloadResult));
		if (preparedValue === null) return await suppressReply(payload, info, "no_visible_payload");
		const preparedPayload = preparedValue.payload;
		const declaredDurable = "durable" in delivery ? delivery.durable : void 0;
		const durableOptions = typeof declaredDurable === "function" ? await declaredDurable(preparedPayload, info) : declaredDurable;
		if (durableOptions) {
			const durable = await operation.deliverDurable(preparedValue, {
				cfg: params.cfg,
				channel: params.channel,
				accountId: params.accountId,
				agentId: params.agentId,
				ctxPayload: params.ctxPayload,
				info,
				executionIdentityToken: agentRun[1],
				...durableOptions
			});
			throwIfDurableInboundReplyDeliveryFailed(durable);
			if (isDurableInboundReplyDeliveryHandled(durable)) {
				await runChannelDeliveryObserver({
					onDelivered: delivery.onDelivered,
					payload: preparedPayload,
					info,
					result: durable.delivery
				});
				return durable.delivery;
			}
		}
		let effectiveValue = preparedValue;
		let effectivePayload = preparedPayload;
		let result = void 0;
		let directInfo = info;
		const emitMessageSentForDelivery = delivery.observeMessageSent ? getGroupThreadDispatchContext() ? getMessageSentEmitter()?.emitMessageSent : (event) => getMessageSentEmitter()?.emitMessageSent(event) : void 0;
		try {
			if (ownership === "routed-delivery" && operation.deliverWithProviderMessageSending) {
				const providerInfo = {
					...info,
					...createDirectPendingFinalCustody(effectivePayload, params.storePath) ?? NO_PENDING_FINAL_CUSTODY
				};
				directInfo = providerInfo;
				result = await operation.deliverWithProviderMessageSending(effectiveValue, providerInfo);
			} else {
				if (ownership === "routed-delivery" && params.admission?.kind !== "observeOnly") {
					const hook = await applyRoutedDirectMessageSending({
						turn: params,
						payload: effectivePayload
					});
					effectivePayload = hook.payload;
					if (hook.suppression) result = hook.suppression;
					else {
						const nextValue = operation.prepare(effectivePayload);
						if (nextValue) {
							effectiveValue = nextValue;
							effectivePayload = nextValue.payload;
						} else result = createSuppressedChannelDeliveryResult({ reason: "no_visible_payload" });
					}
				}
				if (!result) {
					if (!operation.deliver) throw new Error("channel delivery adapter is missing a direct deliverer");
					await createDirectPendingFinalCustody(effectivePayload, params.storePath)?.onPlatformSendDispatch();
					result = await operation.deliver(effectiveValue, toCoreManagedDeliveryInfo(info));
				}
			}
		} catch (error) {
			await settleFailedPendingFinalDelivery(effectivePayload, error);
			if (delivery.observeMessageSent) await settleChannelDeliveryAttempt({
				state: "rejected",
				payload: effectivePayload,
				info: directInfo,
				error,
				emitMessageSent: emitMessageSentForDelivery
			}, delivery.onDelivered);
			throw error;
		}
		const attempt = {
			state: "fulfilled",
			payload: effectivePayload,
			info: directInfo,
			result,
			emitMessageSent: emitMessageSentForDelivery
		};
		if (result?.finalization) {
			result.finalization.catch(() => void 0);
			pendingDeliveryAttempts.push(attempt);
		} else await settleChannelDeliveryAttempt(attempt, delivery.onDelivered);
		return result;
	}
	const deliverPrepared = (plan, info) => deliverReply(plan.payload, info, {
		prepare: (payload) => {
			const [entry] = createStructuredOutboundPayloadPlan([payload]);
			return entry ? {
				...entry,
				sourceIndex: plan.sourceIndex
			} : null;
		},
		deliver: preparedDeliver ?? rawOperation.deliver,
		deliverWithProviderMessageSending: preparedProviderDeliver ?? rawOperation.deliverWithProviderMessageSending,
		deliverDurable: (value, context) => deliverStructuredInboundReplyWithMessageSendContextCore({
			...context,
			plan: value
		})
	});
	return await runPreparedChannelTurnCore({
		channel: params.channel,
		accountId: params.accountId,
		routeSessionKey: params.routeSessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.recordInboundSession,
		afterRecord: params.afterRecord,
		record: params.record,
		history: params.history,
		admission: params.admission,
		botLoopProtection: params.botLoopProtection,
		outboundEchoSourceId: params.outboundEchoSourceId,
		log: params.log,
		messageId: params.messageId,
		...adoption ? { runDispatchLifecycle: {
			turnAdoptionLifecycle: adoption,
			onDispatchSkipped: async () => await adoption.onAdopted()
		} } : {},
		runDispatch: async () => {
			let dispatchResult;
			let dispatchError;
			try {
				dispatchResult = await runWithSessionInitConflictRetry(() => (ownership === "routed-delivery" ? dispatchInboundMessageWithRoutedChannelDispatcher : params.dispatchReplyWithBufferedBlockDispatcher)({
					ctx: params.ctxPayload,
					cfg: params.cfg,
					...ownership === "routed-delivery" ? {
						...params.admission?.kind === "observeOnly" ? { suppressOutboundHooks: true } : {},
						onReplyPayloadSuppressed: onReplySuppressed
					} : {},
					dispatcherOptions: {
						...replyPipeline.dispatcherOptions,
						onSkip: (payload, info) => {
							replyPipeline.dispatcherOptions?.onSkip?.(payload, info);
							if (info.reason !== "channel_transform") return;
							const { reason: _reason, ...deliveryInfo } = info;
							normalizationSuppressionAttempts.push({
								state: "fulfilled",
								payload,
								info: deliveryInfo,
								result: createSuppressedChannelDeliveryResult({ reason: info.reason })
							});
						},
						deliver: (payload, info) => deliverReply(payload, info, rawOperation),
						deliverPrepared,
						onError: delivery.onError
					},
					dispatchReplyFromConfig: params.dispatchReplyFromConfig,
					toolsAllow: params.toolsAllow,
					replyOptions,
					replyResolver: params.replyResolver
				}), params.sessionInitRetry ? {
					retryDelaysMs: params.sessionInitRetry.delaysMs,
					signal: params.sessionInitRetry.signal,
					sleep: params.sessionInitRetry.sleep
				} : void 0);
			} catch (error) {
				dispatchError = error;
			}
			let settlementError;
			try {
				await settleChannelDeliveryAttempts(normalizationSuppressionAttempts, delivery);
				await settleChannelDeliveryAttempts(pendingDeliveryAttempts, delivery);
			} catch (error) {
				settlementError = error;
			}
			if (settlementError !== void 0 && resolvePartialChannelDeliveryResult(settlementError) !== void 0) throw toErrorObject(settlementError, "channel delivery settlement failed");
			if (dispatchError !== void 0) throw toErrorObject(dispatchError, "channel dispatch failed");
			if (settlementError !== void 0) throw toErrorObject(settlementError, "channel delivery settlement failed");
			return dispatchResult;
		}
	}, { suppressObserveOnlyDispatch: false });
}
async function dispatchAssembledChannelTurn(params) {
	return await dispatchChannelTurnWithDeliveryOwner(params, "legacy-dispatcher");
}
async function dispatchRoutedChannelTurn(params) {
	return await dispatchChannelTurnWithDeliveryOwner(assembleResolvedChannelTurn(params), "routed-delivery");
}
//#endregion
export { dispatchAssembledChannelTurn as n, dispatchRoutedChannelTurn as r, assembleResolvedChannelTurn as t };
