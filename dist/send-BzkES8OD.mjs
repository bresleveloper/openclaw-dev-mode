import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { s as isOutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-Be_FOFUF.mjs";
import { i as normalizeReplyPayloadsForDelivery } from "./payloads-RF8yW6z7.mjs";
import { n as normalizeReplyPayload } from "./normalize-reply-C8IYvn0x.mjs";
import { i as createRenderedMessageBatch } from "./deliver-prepare-Cnyl_ncu.mjs";
import { r as normalizeOutboundReplyFacts } from "./reply-policy-D40tu-98.mjs";
import { r as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-state-Cmhed7ry.mjs";
import { x as assertSessionWriterDeliveryAuthorized } from "./delivery-queue-recovery-kW-G1ot6.mjs";
import { n as runOutboundDeliveryInternal, r as runStructuredOutboundDeliveryInternal } from "./deliver-A0X4qcDr.mjs";
import { o as markLiveMessagePreviewUpdated, t as createLiveMessageState } from "./live-TWzvpgza.mjs";
//#region src/auto-reply/reply/pending-final-delivery.ts
/** Normalize raw final payloads into the channel-agnostic sendable set recovery can mark. */
function normalizePendingFinalDeliveryPayloads(payloads) {
	return normalizeReplyPayloadsForDelivery(normalizePendingFinalRecoveryPayloads(payloads));
}
/** Normalize raw final payloads for durable recovery without stripping delivery directives. */
function normalizePendingFinalRecoveryPayloads(payloads) {
	return payloads.flatMap((payload) => {
		const normalized = normalizeReplyPayload(payload, { applyChannelTransforms: false });
		return normalized ? [normalized] : [];
	});
}
/** Build durable recovery text only for payload shapes this marker can replay without loss. */
function buildRecoverablePendingFinalDeliveryText(payloads) {
	const sendablePayloads = [];
	for (const payload of payloads) {
		if (payload.isReasoning === true) continue;
		const recoveryPayload = payload.replyToId && getReplyPayloadMetadata(payload)?.replyToIdExplicit !== true ? {
			...payload,
			replyToId: void 0
		} : payload;
		const deliveryPayloads = normalizeReplyPayloadsForDelivery([recoveryPayload]);
		if (deliveryPayloads.length === 0) continue;
		if (hasUnsupportedDurableRecoveryShape(recoveryPayload) || deliveryPayloads.some(hasUnrecoverableNormalizedDeliveryShape)) return;
		sendablePayloads.push(...deliveryPayloads);
	}
	if (sendablePayloads.length > 1 && sendablePayloads.some((payload) => hasDurableMedia(payload) || hasMediaDirectiveText(payload))) return;
	const recoveryText = [];
	for (const payload of sendablePayloads) {
		const textAndMedia = [payload.text, ...(payload.mediaUrls ?? []).map((mediaUrl) => `MEDIA:${mediaUrl}`)].filter((value) => Boolean(value?.trim())).join("\n");
		if (textAndMedia) recoveryText.push(textAndMedia);
	}
	return sanitizePendingFinalDeliveryText(recoveryText.join("\n\n")) || void 0;
}
function resolvePendingFinalDeliveryCompletion(payloads) {
	const metadata = payloads?.map((payload) => getReplyPayloadMetadata(payload)).find((candidate) => candidate?.pendingFinalDeliveryCompletion);
	const completion = metadata?.pendingFinalDeliveryCompletion;
	return completion ? {
		kind: "pending-final",
		...completion,
		...metadata.sessionWriterDeliveryAuthority ? { sessionWriterDeliveryAuthority: metadata.sessionWriterDeliveryAuthority } : {}
	} : void 0;
}
function hasUnsupportedDurableRecoveryShape(payload) {
	const hasMedia = hasDurableMedia(payload);
	return payload.sensitiveMedia === true || payload.trustedLocalMedia === true || payload.presentation !== void 0 || payload.interactive !== void 0 || payload.btw !== void 0 || payload.delivery !== void 0 || payload.channelData !== void 0 || payload.location !== void 0 || hasUnrecoverableNormalizedDeliveryShape(payload) || payload.spokenText !== void 0 || payload.ttsSupplement !== void 0 || hasMedia && (payload.isCommentary === true || payload.isStatusNotice === true);
}
function hasDurableMedia(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((url) => url.trim()));
}
function hasMediaDirectiveText(payload) {
	return /^\s*MEDIA:/imu.test(payload.text ?? "");
}
function hasUnrecoverableNormalizedDeliveryShape(payload) {
	return payload.replyToCurrent === true || payload.replyToTag === true || payload.replyToId !== void 0 || payload.audioAsVoice === true || payload.videoAsNote === true;
}
//#endregion
//#region src/channels/message/send.ts
const log = createSubsystemLogger("channels/message/send");
/** Whether platform delivery completed or advanced far enough that retry could duplicate it. */
function durableMessageBatchMayHaveReachedRecipient(result) {
	if (result.status === "sent" || result.status === "partial_failed") return true;
	if (result.status === "suppressed" && result.reason === "adapter_returned_no_identity") return true;
	if (result.status === "failed" && isOutboundDeliveryError(result.error) && result.error.sentBeforeError) return true;
	return result.payloadOutcomes?.some((outcome) => outcome.status === "failed" ? outcome.sentBeforeError : outcome.status === "sent" || outcome.reason === "adapter_returned_no_identity") === true;
}
function serializeDurableMessagePayloadOutcomes(outcomes, options) {
	if (!outcomes || outcomes.length === 0) return;
	return outcomes.map((outcome) => {
		if (outcome.status === "sent") return {
			index: outcome.index,
			status: "sent",
			resultCount: outcome.results.length
		};
		if (outcome.status === "suppressed") return {
			index: outcome.index,
			status: "suppressed",
			reason: outcome.reason,
			...options?.includeHookEffect === true && outcome.hookEffect ? { hookEffect: outcome.hookEffect } : {}
		};
		return {
			index: outcome.index,
			status: "failed",
			error: formatErrorMessage(outcome.error),
			sentBeforeError: outcome.sentBeforeError,
			stage: outcome.stage
		};
	});
}
const neverAbortedSignal = new AbortController().signal;
function toDurableMessageIntent(intent, renderedBatch) {
	return {
		id: intent.id,
		channel: intent.channel,
		to: intent.to,
		...intent.accountId ? { accountId: intent.accountId } : {},
		durability: intent.queuePolicy === "required" ? "required" : "best_effort",
		renderedBatch
	};
}
async function withDurableMessageSendContextCore(params, run, conversationDeliveryTarget, queueContext) {
	return await withMessageSendContext(params, run, (delivery) => runOutboundDeliveryInternal(delivery, queueContext), conversationDeliveryTarget);
}
async function withMessageSendContext(params, run, deliver, conversationDeliveryTarget) {
	let deliveryIntent;
	const { attempt, durability, onDeleteReceipt, onDeliveryIntent, onEditReceipt, onCommitReceipt, onPreviewUpdate, onSendFailure, onPayloadDeliveryOutcome, payloads, preview, previousReceipt, signal, abortSignal, ...deliveryParams } = params;
	const replyToId = normalizeOutboundReplyFacts(deliveryParams)?.replyToId;
	const effectiveSignal = signal ?? abortSignal;
	const queuePolicy = durability === "best_effort" ? "best_effort" : "required";
	let liveState = preview ?? createLiveMessageState();
	const ctx = {
		id: `${params.channel}:${params.to}`,
		channel: params.channel,
		to: params.to,
		...params.accountId ? { accountId: params.accountId } : {},
		durability: durability ?? "required",
		attempt: attempt ?? 1,
		signal: effectiveSignal ?? neverAbortedSignal,
		...previousReceipt ? { previousReceipt } : {},
		preview: liveState,
		render: async () => createRenderedMessageBatch(payloads),
		previewUpdate: async (rendered) => {
			liveState = onPreviewUpdate ? await onPreviewUpdate(rendered, liveState) : markLiveMessagePreviewUpdated(liveState, rendered);
			ctx.preview = liveState;
			return liveState;
		},
		send: async (rendered) => {
			const payloadOutcomes = [];
			const failed = (error, stage, results, outcomes) => {
				const failure = {
					error,
					...outcomes.length > 0 ? { payloadOutcomes: [...outcomes] } : {}
				};
				return results.length > 0 ? {
					...failure,
					status: "partial_failed",
					results,
					receipt: createMessageReceiptFromOutboundResults({
						results,
						threadId: params.threadId == null ? void 0 : String(params.threadId),
						replyToId
					}),
					sentBeforeError: true,
					...deliveryIntent ? { deliveryIntent } : {}
				} : {
					...failure,
					status: "failed",
					stage
				};
			};
			try {
				const results = await deliver({
					...deliveryParams,
					conversationDeliveryTarget,
					payloads: rendered.payloads,
					renderedBatchPlan: rendered.plan,
					queuePolicy,
					...effectiveSignal ? { abortSignal: effectiveSignal } : {},
					onPayloadDeliveryOutcome: (outcome) => {
						payloadOutcomes.push(outcome);
						onPayloadDeliveryOutcome?.(outcome);
					},
					onDeliveryIntent: (intent) => {
						deliveryIntent = intent;
						const durableIntent = toDurableMessageIntent(intent, rendered);
						ctx.intent = durableIntent;
						onDeliveryIntent?.(durableIntent);
					}
				});
				const failedOutcome = payloadOutcomes.find((outcome) => outcome.status === "failed");
				if (failedOutcome) return failed(failedOutcome.error, failedOutcome.stage, results, payloadOutcomes);
				const delivered = {
					receipt: createMessageReceiptFromOutboundResults({
						results,
						threadId: params.threadId == null ? void 0 : String(params.threadId),
						replyToId
					}),
					...deliveryIntent ? { deliveryIntent } : {},
					...payloadOutcomes.length > 0 ? { payloadOutcomes: [...payloadOutcomes] } : {}
				};
				return results.length === 0 ? {
					...delivered,
					status: "suppressed",
					results: [],
					reason: payloadOutcomes.find((outcome) => outcome.status === "suppressed")?.reason ?? "no_visible_result"
				} : {
					...delivered,
					status: "sent",
					results
				};
			} catch (error) {
				if (isOutboundDeliveryError(error)) return failed(error, error.stage, error.results, error.payloadOutcomes);
				return {
					status: "failed",
					error
				};
			}
		},
		edit: async (receipt, rendered) => {
			if (!onEditReceipt) throw new Error("message send context edit is not configured");
			const editedReceipt = await onEditReceipt(receipt, rendered);
			liveState = {
				...liveState,
				receipt: editedReceipt,
				lastRendered: rendered
			};
			ctx.preview = liveState;
			return editedReceipt;
		},
		delete: async (receipt) => {
			if (!onDeleteReceipt) throw new Error("message send context delete is not configured");
			await onDeleteReceipt(receipt);
		},
		commit: async (receipt) => {
			await onCommitReceipt?.(receipt);
		},
		fail: async (error) => {
			try {
				await onSendFailure?.(error);
			} catch (cleanupError) {
				log.warn(`message send failure cleanup failed; preserving original send error: ${formatErrorMessage(cleanupError)}`);
			}
		}
	};
	try {
		return await run(ctx);
	} catch (error) {
		await ctx.fail(error);
		throw error;
	}
}
async function sendDurableMessageBatchCore(params, conversationDeliveryTarget, queueContext, sessionGeneration) {
	return await sendMessageBatch(params, (delivery) => runOutboundDeliveryInternal({
		...delivery,
		sessionGeneration
	}, queueContext), conversationDeliveryTarget);
}
async function sendStructuredDurableMessageBatchCore(input, conversationDeliveryTarget) {
	const { plan, ...params } = input;
	return await sendMessageBatch({
		...params,
		payloads: plan.map((entry) => entry.payload)
	}, ({ payloads: _payloads, ...delivery }) => runStructuredOutboundDeliveryInternal({
		...delivery,
		plan
	}), conversationDeliveryTarget);
}
async function sendMessageBatch(params, deliver, conversationDeliveryTarget) {
	const pendingFinalCompletion = params.deliveryCompletion ? void 0 : resolvePendingFinalDeliveryCompletion(params.payloads);
	const pendingFinalDelivery = pendingFinalCompletion ? {
		deliveryCompletion: pendingFinalCompletion,
		deliveryIntentId: pendingFinalCompletion.deliveryId,
		durability: "required"
	} : {};
	const ephemeralWriterAuthorities = pendingFinalCompletion ? [] : params.payloads.flatMap((payload) => {
		const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
		return authority ? [authority] : [];
	});
	const onPlatformSendDispatch = ephemeralWriterAuthorities.length > 0 ? async () => {
		for (const authority of ephemeralWriterAuthorities) assertSessionWriterDeliveryAuthorized(authority);
		await params.onPlatformSendDispatch?.();
	} : params.onPlatformSendDispatch;
	const assertDirectAdapterHandoff = ephemeralWriterAuthorities.length > 0 ? () => {
		params.assertDirectAdapterHandoff?.();
		for (const authority of ephemeralWriterAuthorities) assertSessionWriterDeliveryAuthorized(authority);
	} : params.assertDirectAdapterHandoff;
	return await withMessageSendContext({
		...params,
		...pendingFinalDelivery,
		onPlatformSendDispatch,
		assertDirectAdapterHandoff
	}, async (ctx) => {
		const rendered = await ctx.render();
		const result = await ctx.send(rendered);
		if (result.status === "sent" || result.status === "suppressed") await ctx.commit(result.receipt);
		else await ctx.fail(result.error);
		return result;
	}, deliver, conversationDeliveryTarget);
}
//#endregion
export { withDurableMessageSendContextCore as a, normalizePendingFinalRecoveryPayloads as c, serializeDurableMessagePayloadOutcomes as i, resolvePendingFinalDeliveryCompletion as l, sendDurableMessageBatchCore as n, buildRecoverablePendingFinalDeliveryText as o, sendStructuredDurableMessageBatchCore as r, normalizePendingFinalDeliveryPayloads as s, durableMessageBatchMayHaveReachedRecipient as t };
