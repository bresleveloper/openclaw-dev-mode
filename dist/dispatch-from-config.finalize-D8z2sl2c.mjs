import { n as isAbortError, r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, b as markReplyPayloadAsTtsSupplement, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { t as resolveConfiguredTtsMode } from "./tts-config-DK27R_zM.mjs";
import { u as resolveReplyCompletion } from "./source-reply-delivery-mode-CuFZyg4U.mjs";
import { c as settlePendingFinalDelivery } from "./delivery-completion-DxLFTv-D.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { t as registerReplyDispatcherSettledTask } from "./dispatch-dispatcher-C6kknpZM.mjs";
import { r as recordAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-gv15pQgO.mjs";
import { t as resolveChannelTtsVoiceDelivery } from "./tts-capabilities-B5p0KrwX.mjs";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-B0TC0IWT.mjs";
import { t as resolveStatusTtsSnapshot } from "./status-config-BMD-8eHc.mjs";
import { a as formatSuppressedReplyPayloadForLog, d as shouldDeliverDespiteSourceReplySuppression, n as buildNoVisibleReplyFallbackText, r as createFinalDispatchPayloadDedupeKey, t as QUEUE_CAP_REJECTION_TEXT } from "./dispatch-from-config.payloads-66_-9iD5.mjs";
import { n as suppressPendingFinalDelivery, t as clearPendingFinalDeliveryAfterSuccess } from "./dispatch-from-config.pending-final-GQX9YCV_.mjs";
//#region src/auto-reply/reply/dispatch-from-config.abort.ts
var DispatchReplyOperationAbortedError = class extends Error {
	constructor() {
		super("Dispatch reply operation aborted");
		this.name = "AbortError";
	}
};
function isDispatchReplyOperationAbortedError(error) {
	return error instanceof DispatchReplyOperationAbortedError;
}
function runWithDispatchAbortSignal(signal, run, onWorkStarted) {
	if (signal?.aborted) return Promise.reject(new DispatchReplyOperationAbortedError());
	const work = Promise.resolve().then(run);
	onWorkStarted?.(work);
	return racePromiseWithAbortSignal(work, signal).catch((error) => {
		if (signal?.aborted && isAbortError(error)) throw new DispatchReplyOperationAbortedError();
		throw error;
	});
}
function createAbortAwareDispatcher(params) {
	const sendIfActive = (send) => (payload) => params.isAborted() ? false : send(payload);
	const { getCancelledCounts, prepareReplyPayload, sendPreparedReply } = params.dispatcher;
	return {
		...prepareReplyPayload ? { prepareReplyPayload: prepareReplyPayload.bind(params.dispatcher) } : {},
		sendToolResult: sendIfActive(params.dispatcher.sendToolResult),
		sendBlockReply: sendIfActive(params.dispatcher.sendBlockReply),
		sendFinalReply: sendIfActive(params.dispatcher.sendFinalReply),
		...sendPreparedReply ? { sendPreparedReply: (kind, plan) => params.isAborted() ? false : sendPreparedReply(kind, plan) } : {},
		...params.dispatcher.supportsSettledReceipt ? { supportsSettledReceipt: true } : {},
		waitForIdle: () => params.dispatcher.waitForIdle(),
		getQueuedCounts: () => params.dispatcher.getQueuedCounts(),
		...getCancelledCounts ? { getCancelledCounts: () => getCancelledCounts() } : {},
		getFailedCounts: () => params.dispatcher.getFailedCounts(),
		markComplete: () => {
			if (!params.isAborted()) params.dispatcher.markComplete();
		}
	};
}
//#endregion
//#region src/tts/captioned-final.ts
function shouldDeferFinalTtsText(params) {
	if (!resolveChannelTtsVoiceDelivery(params.channelId)?.captionedFinalText) return false;
	if (resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	}) !== "final") return false;
	const status = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	return status != null && status.autoMode !== "off" && status.autoMode !== "tagged" && (status.autoMode !== "inbound" || params.inboundAudio);
}
function mergeDeferredFinalText(streamedText, finalText) {
	const streamed = streamedText.trim();
	const final = finalText?.trim() ?? "";
	if (!streamed) return final;
	if (!final || streamed === final || streamed.startsWith(final)) return streamed;
	if (final.startsWith(streamed)) return final;
	return `${streamed}\n${final}`;
}
function isCaptionedFinalTextPayload(payload) {
	return isReplyPayloadTerminalContent(payload);
}
function cleanDeferredFinalText(text) {
	if (!text) return "";
	const cleaner = createTtsDirectiveTextStreamCleaner();
	return `${cleaner.push(text)}${cleaner.flush()}`.replace(/[ \t]+\n/gu, "\n");
}
function buildCaptionedFinalTextFallback(payload) {
	return copyReplyPayloadMetadata(payload, {
		text: payload.text,
		delivery: payload.delivery,
		replyToId: payload.replyToId,
		replyToTag: payload.replyToTag,
		replyToCurrent: payload.replyToCurrent
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.finalize.ts
const needsTtsFallback = (clean, visible, fallback) => clean && !visible.trim() && Boolean(fallback?.trim());
async function finalizeDispatchAndAudit(state) {
	const { cfg, chatType, ctx, deferFinalTtsText, deliveryChannel, dispatcher, getDispatchAbortSignal, getObservedReplyDelivery, isRoutedReplyDelivered, markInboundDedupeReplayUnsafe, pendingContinuation, pendingContinuationSettlement, replyResult, replyRoute, routeReplyToOriginating, sendPolicyDenied, sessionAgentId, sessionKey, suppressDelivery, throwIfDispatchOperationAborted, turnLedger, waitForPendingDirectBlockReplyDelivery } = state;
	const heartbeat = state.replyOperationRunState.heartbeat;
	const pendingFinalOptions = { preserveActivity: heartbeat !== void 0 };
	throwIfDispatchOperationAborted();
	const heartbeatReply = await heartbeat?.prepareReply(replyResult, state.replyOperationRunState);
	throwIfDispatchOperationAborted();
	const replies = heartbeatReply ? heartbeatReply.reply ? [heartbeatReply.reply] : [] : replyResult ? Array.isArray(replyResult) ? replyResult : [replyResult] : [];
	const pendingFinalDeliveryIdentity = replies.map((reply) => getReplyPayloadMetadata(reply)?.pendingFinalDeliveryCompletion).find((completion) => completion !== void 0);
	const beforeAgentRunBlocked = state.replyOperationRunState.replyCompletion?.outcome === "blocked" || replies.some((reply) => getReplyPayloadMetadata(reply)?.beforeAgentRunBlocked === true);
	let queuedFinal = false;
	let routedFinalCount = 0;
	let attemptedFinalDelivery = false;
	let acceptedFinal = false;
	let sessionWriterDeliveryRevoked = false;
	let channelTransformSuppressedFinal = false;
	const finalDeliveries = [];
	const sentFinalPayloadDedupeKeys = /* @__PURE__ */ new Set();
	let deferredTtsTextPending = state.progressState.accumulatedBlockTtsText;
	let continuationSettlementAttempted = false;
	let continuationSettlementRegistered = false;
	const settleContinuation = async (statusDelivered) => {
		if (!pendingContinuationSettlement || continuationSettlementAttempted) return;
		continuationSettlementAttempted = true;
		try {
			await pendingContinuationSettlement.settle(statusDelivered);
		} catch (error) {
			if (!statusDelivered) throw error;
			logVerbose(`dispatch-from-config: continuation batch handoff failed: ${formatErrorMessage(error)}`);
			await pendingContinuationSettlement.settle(false);
		}
	};
	try {
		if (state.preserveProgressCallbackStartOrder) await state.progressState.progressCallbackStartTail;
		await state.flushPendingCommentaryProgress();
		for (const [replyIndex, reply] of replies.entries()) {
			throwIfDispatchOperationAborted();
			if (reply.isReasoning === true && !state.reasoningPayloadsEnabled) {
				await suppressPendingFinalDelivery(reply, pendingFinalOptions);
				await heartbeatReply?.settle?.("cancelled");
				continue;
			}
			if (reply.isCommentary === true && !state.commentaryPayloadsEnabled) {
				await suppressPendingFinalDelivery(reply, pendingFinalOptions);
				await heartbeatReply?.settle?.("cancelled");
				continue;
			}
			if (suppressDelivery && !shouldDeliverDespiteSourceReplySuppression(reply, state)) {
				if (hasOutboundReplyContent(reply, { trimText: true })) logVerbose([
					`dispatch-from-config: final reply suppressed by ${state.deliverySuppressionReason || "source delivery policy"}`,
					`(session=${state.acpDispatchSessionKey ?? sessionKey ?? "unknown"}`,
					`provider=${ctx.Provider ?? "unknown"}`,
					`surface=${ctx.Surface ?? "unknown"}`,
					`chatType=${chatType ?? "unknown"}`,
					`inboundEventKind=${ctx.InboundEventKind ?? "unknown"}`,
					`message=${ctx.MessageSidFull ?? ctx.MessageSid ?? "unknown"}`,
					`${formatSuppressedReplyPayloadForLog(reply)})`
				].join(" "));
				await suppressPendingFinalDelivery(reply, pendingFinalOptions);
				await heartbeatReply?.settle?.("cancelled");
				continue;
			}
			const finalPayloadDedupeKey = createFinalDispatchPayloadDedupeKey(reply);
			if (sentFinalPayloadDedupeKeys.has(finalPayloadDedupeKey)) {
				await suppressPendingFinalDelivery(reply, pendingFinalOptions);
				await heartbeatReply?.settle?.("cancelled");
				continue;
			}
			sentFinalPayloadDedupeKeys.add(finalPayloadDedupeKey);
			const shouldAttachDeferredText = deferFinalTtsText && isReplyPayloadTerminalContent(reply);
			const finalReply = await state.sendFinalPayload(reply, {
				deliveryId: String(replyIndex),
				...heartbeat ? { skipTts: true } : {},
				...shouldAttachDeferredText ? { deferredTtsText: deferredTtsTextPending } : {}
			});
			if (heartbeatReply?.settle) {
				const settle = heartbeatReply.settle;
				const outcome = finalReply.dispatcherOutcome ?? Promise.resolve(finalReply.blockDeliveryOutcome ?? finalReply.routedOutcome ?? "cancelled");
				registerReplyDispatcherSettledTask(dispatcher, () => outcome.then(settle));
			}
			if (finalReply.sessionWriterDeliveryRevoked) {
				sessionWriterDeliveryRevoked = true;
				continue;
			}
			if (finalReply.suppressionReason) {
				channelTransformSuppressedFinal ||= finalReply.suppressionReason === "channel_transform";
				if (!finalReply.blockDeliveryOutcome) continue;
			}
			finalDeliveries.push(finalReply);
			acceptedFinal = true;
			if (shouldAttachDeferredText) deferredTtsTextPending = "";
			queuedFinal = finalReply.queuedFinal || queuedFinal;
			routedFinalCount += finalReply.routedFinalCount;
			if (finalReply.blockDeliveryOutcome) {
				const completion = getReplyPayloadMetadata(reply)?.pendingFinalDeliveryCompletion;
				if (completion && finalReply.blockDeliveryOutcome === "failed-deliver" && !finalReply.pendingBlock) await settlePendingFinalDelivery({
					kind: "pending-final",
					...completion
				}, "unknown", ["prepared"]);
				else await suppressPendingFinalDelivery(reply, pendingFinalOptions);
				continue;
			}
			attemptedFinalDelivery = true;
			if (finalReply.pendingBlock) continue;
			const onFinalDeliverySuccess = getReplyPayloadMetadata(reply)?.onFinalDeliverySuccess;
			if (onFinalDeliverySuccess) {
				if (finalReply.dispatcherOutcome) registerReplyDispatcherSettledTask(dispatcher, async () => {
					if (await finalReply.dispatcherOutcome === "delivered") onFinalDeliverySuccess();
				});
				else if (finalReply.routedFinalCount > 0) onFinalDeliverySuccess();
			}
			if (pendingContinuationSettlement && getReplyPayloadMetadata(reply)?.continuationStatus) {
				if (finalReply.dispatcherOutcome) {
					registerReplyDispatcherSettledTask(dispatcher, async () => {
						const outcome = await finalReply.dispatcherOutcome;
						await settleContinuation(outcome === "delivered");
					});
					continuationSettlementRegistered = true;
				} else await settleContinuation(finalReply.routedFinalCount > 0);
			}
		}
	} finally {
		if (!continuationSettlementRegistered) await settleContinuation(false);
	}
	let channelTransformSuppressed = (state.progressState.channelTransformSuppressed || channelTransformSuppressedFinal) && !state.progressState.acceptedReplyPayload && !acceptedFinal;
	if (attemptedFinalDelivery) {
		if (queuedFinal && finalDeliveries.every((reply) => !reply.queuedFinal || reply.dispatcherOutcome !== void 0)) {
			const reconcilePendingFinal = Promise.all(finalDeliveries.flatMap((reply) => reply.dispatcherOutcome ? [reply.dispatcherOutcome] : [])).then(async () => {
				await clearPendingFinalDeliveryAfterSuccess(pendingFinalDeliveryIdentity, pendingFinalOptions);
			}).catch((error) => {
				logVerbose(`dispatch-from-config: pending final reconciliation failed: ${formatErrorMessage(error)}`);
			});
			registerReplyDispatcherSettledTask(dispatcher, () => reconcilePendingFinal);
		} else await clearPendingFinalDeliveryAfterSuccess(pendingFinalDeliveryIdentity, pendingFinalOptions);
		throwIfDispatchOperationAborted();
	}
	if (!suppressDelivery && !channelTransformSuppressed) {
		if (resolveConfiguredTtsMode(cfg, {
			agentId: sessionAgentId,
			channelId: deliveryChannel,
			accountId: replyRoute.accountId
		}) === "final" && state.progressState.blockCount > 0 && deferredTtsTextPending.trim() && (replies.length === 0 || deferFinalTtsText)) try {
			await waitForPendingDirectBlockReplyDelivery(getDispatchAbortSignal());
			throwIfDispatchOperationAborted();
			const ttsSyntheticReply = await state.maybeApplyTtsWithFinalizationLease({
				payload: { text: deferredTtsTextPending },
				cfg,
				channel: deliveryChannel,
				kind: "final",
				ttsAuto: state.sessionTtsAuto,
				agentId: sessionAgentId,
				accountId: replyRoute.accountId
			});
			throwIfDispatchOperationAborted();
			if (ttsSyntheticReply.mediaUrl || deferFinalTtsText && ttsSyntheticReply.text?.trim()) {
				const ttsPayload = deferFinalTtsText ? ttsSyntheticReply : {
					mediaUrl: ttsSyntheticReply.mediaUrl,
					audioAsVoice: ttsSyntheticReply.audioAsVoice,
					spokenText: deferredTtsTextPending,
					trustedLocalMedia: true
				};
				const ttsOnlyPayload = !deferFinalTtsText && turnLedger.resolveTerminalDelivery() === "delivered" ? markReplyPayloadAsTtsSupplement(ttsPayload, deferredTtsTextPending, { visibleTextAlreadyDelivered: true }) : ttsPayload;
				const finalReply = await state.sendFinalPayload(ttsOnlyPayload, {
					abortSignal: getDispatchAbortSignal(),
					skipTts: true
				});
				queuedFinal = finalReply.queuedFinal || queuedFinal;
				routedFinalCount += finalReply.routedFinalCount;
			} else if (needsTtsFallback(Boolean(state.cleanBlockTtsDirectiveText), cleanDeferredFinalText(deferredTtsTextPending), ttsSyntheticReply.text)) {
				const finalReply = await state.sendFinalPayload(ttsSyntheticReply, {
					abortSignal: getDispatchAbortSignal(),
					skipTts: true
				});
				queuedFinal = finalReply.queuedFinal || queuedFinal;
				routedFinalCount += finalReply.routedFinalCount;
			}
		} catch (err) {
			if (isDispatchReplyOperationAbortedError(err)) throw err;
			logVerbose(`dispatch-from-config: accumulated block TTS failed: ${formatErrorMessage(err)}`);
			const deferredVisibleText = cleanDeferredFinalText(deferredTtsTextPending);
			if (deferFinalTtsText && deferredVisibleText.trim()) {
				const finalReply = await state.sendFinalPayload({ text: deferredVisibleText }, {
					abortSignal: getDispatchAbortSignal(),
					skipTts: true
				});
				queuedFinal = finalReply.queuedFinal || queuedFinal;
				routedFinalCount += finalReply.routedFinalCount;
			}
		}
	}
	await waitForPendingDirectBlockReplyDelivery(getDispatchAbortSignal());
	const replyCompletion = () => {
		const delivery = turnLedger.resolveTerminalDelivery();
		const owned = state.replyOperationRunState.replyCompletion;
		return resolveReplyCompletion(owned?.expectation ?? "required", beforeAgentRunBlocked || sendPolicyDenied || owned?.outcome === "blocked" ? "blocked" : owned?.outcome === "delivered" || delivery === "delivered" ? "delivered" : pendingContinuation || owned?.outcome === "pending" || getObservedReplyDelivery() ? "pending" : delivery === "missing" ? "empty" : delivery);
	};
	const replyAdmission = state.replyOperationRunState.admission;
	const replyAcceptedByActiveRun = replyAdmission?.status === "accepted";
	const queueCapRejected = replyAdmission?.status === "skipped" && replyAdmission.reason === "queue-cap";
	const noVisibleReplyFallbackAllowed = () => replyCompletion().outcome === "missing" && !suppressDelivery && !sendPolicyDenied && state.sourceReplyDeliveryMode !== "message_tool_only" && !sessionWriterDeliveryRevoked && !channelTransformSuppressed && !replyAcceptedByActiveRun;
	let queuedSettleResult = "settled";
	if (noVisibleReplyFallbackAllowed()) queuedSettleResult = await turnLedger.settleQueued(getDispatchAbortSignal());
	if (queuedSettleResult === "settled") {
		channelTransformSuppressed ||= noVisibleReplyFallbackAllowed() && finalDeliveries.length > 0 && (await Promise.all(finalDeliveries.map((reply) => reply.dispatcherOutcome ?? Promise.resolve(reply.blockDeliveryOutcome ?? reply.routedOutcome)))).every((outcome) => outcome === "channel-transform");
		sessionWriterDeliveryRevoked ||= replies.some((reply) => !state.isSessionWriterDeliveryAuthorized(reply));
	}
	let counts = dispatcher.getQueuedCounts();
	let noVisibleReplyFallbackDelivered = false;
	if (queuedSettleResult === "settled" && noVisibleReplyFallbackAllowed()) try {
		throwIfDispatchOperationAborted();
		const fallbackPayload = { text: queueCapRejected ? QUEUE_CAP_REJECTION_TEXT : buildNoVisibleReplyFallbackText(state.getAgentRunId()) };
		const result = await routeReplyToOriginating(fallbackPayload, {
			abortSignal: getDispatchAbortSignal(),
			kind: "final"
		});
		if (result) {
			if (isRoutedReplyDelivered(result)) {
				queuedFinal = true;
				noVisibleReplyFallbackDelivered = true;
				routedFinalCount += 1;
			} else if (!result.ok) logVerbose(`dispatch-from-config: route-reply (no-visible-reply fallback) failed: ${result.error ?? "unknown error"}`);
		} else {
			throwIfDispatchOperationAborted();
			markInboundDedupeReplayUnsafe();
			if (turnLedger.sendQueued("final", fallbackPayload).queued) {
				const fallbackSettle = await turnLedger.settleQueued(getDispatchAbortSignal());
				throwIfDispatchOperationAborted();
				if (fallbackSettle !== "settled" || turnLedger.mayHaveDelivered()) {
					queuedFinal = true;
					noVisibleReplyFallbackDelivered = true;
					counts = dispatcher.getQueuedCounts();
				}
			}
		}
	} catch (err) {
		if (isDispatchReplyOperationAbortedError(err)) throw err;
		logVerbose(`dispatch-from-config: no-visible-reply fallback failed: ${formatErrorMessage(err)}`);
	}
	counts.final += routedFinalCount;
	const agentRunTerminalOutcome = state.getAgentRunTerminalOutcome();
	state.commitInboundDedupeIfClaimed();
	const messageInjectionAborted = state.replyOperationRunState.messageInjectionAborted === true;
	const questionFailure = replyAdmission?.status === "skipped" && (replyAdmission.reason === "question-response-indeterminate" || replyAdmission.reason === "question-response-refused" || replyAdmission.reason === "question-response-rejected") ? replyAdmission.reason : void 0;
	const preRunRejection = agentRunTerminalOutcome === "failed" ? void 0 : state.replyOperationRunState.preRunRejection;
	const dispatchOutcome = agentRunTerminalOutcome === "failed" || questionFailure ? "error" : queueCapRejected || messageInjectionAborted || preRunRejection ? "skipped" : "completed";
	const dispatchReason = questionFailure ?? (queueCapRejected ? "queue-cap" : messageInjectionAborted ? "reply_operation_aborted" : preRunRejection ? preRunRejection : replyAdmission?.status === "accepted" && replyAdmission.mode === "steer" ? "active_run_injected" : channelTransformSuppressed ? "channel_transform" : state.bindingState.pluginFallbackReason);
	state.recordAgentDispatchCompleted(dispatchOutcome, dispatchReason ? { reason: dispatchReason } : void 0);
	state.recordProcessed(dispatchOutcome, dispatchReason ? { reason: dispatchReason } : void 0);
	state.markIdle(dispatchOutcome === "error" ? "message_error" : queueCapRejected ? "message_queue_cap_rejected" : "message_completed");
	const completion = replyCompletion();
	state.replyOperationRunState.replyCompletion = completion;
	state.completeDispatchReplyOperation();
	const result = state.attachSourceReplyDeliveryMode({
		queuedFinal,
		counts,
		...state.routeState.sessionMetadataChangesForResult ? { sessionMetadataChanges: state.routeState.sessionMetadataChangesForResult } : {},
		...getObservedReplyDelivery() ? { observedReplyDelivery: true } : {},
		...replyAdmission?.status === "accepted" ? { deferredToActiveRun: replyAdmission.mode } : {},
		...completion.outcome === "missing" && queuedSettleResult === "settled" && !noVisibleReplyFallbackDelivered && !replyAcceptedByActiveRun && !channelTransformSuppressed && !sessionWriterDeliveryRevoked ? { noVisibleReplyFallbackEligible: true } : {},
		...noVisibleReplyFallbackDelivered ? { noVisibleReplyFallbackDelivered: true } : {},
		...completion.outcome === "silent" || completion.outcome === "blocked" ? { deliberateSilentTerminalReply: true } : {},
		...beforeAgentRunBlocked ? { beforeAgentRunBlocked } : {}
	});
	if (agentRunTerminalOutcome) recordAgentRunTerminalOutcome(result, agentRunTerminalOutcome);
	return {
		status: "complete",
		result
	};
}
//#endregion
export { isCaptionedFinalTextPayload as a, DispatchReplyOperationAbortedError as c, runWithDispatchAbortSignal as d, cleanDeferredFinalText as i, createAbortAwareDispatcher as l, needsTtsFallback as n, mergeDeferredFinalText as o, buildCaptionedFinalTextFallback as r, shouldDeferFinalTtsText as s, finalizeDispatchAndAudit as t, isDispatchReplyOperationAbortedError as u };
