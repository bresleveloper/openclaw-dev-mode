import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { i as resolveMessageReceiptThreadId, n as listMessageReceiptPlatformIds, t as createMessageReceiptFromOutboundResults } from "./receipt-CV_GHeLg.mjs";
//#region src/channels/turn/partial-delivery-error.ts
const CHANNEL_PARTIAL_DELIVERY_ERROR_CODE = "CHANNEL_PARTIAL_DELIVERY";
/** Preserves provider-visible delivery facts when a later native operation fails. */
function createChannelPartialDeliveryError(cause, deliveryResult) {
	return Object.assign(new Error(formatErrorMessage(cause), { cause }), {
		code: "CHANNEL_PARTIAL_DELIVERY",
		deliveryResult,
		sentBeforeError: true,
		visibleReplySent: true
	});
}
function isChannelPartialDeliveryError(error) {
	if (!error || typeof error !== "object" || Array.isArray(error)) return false;
	const candidate = error;
	return candidate.code === CHANNEL_PARTIAL_DELIVERY_ERROR_CODE && Boolean(candidate.deliveryResult && typeof candidate.deliveryResult === "object" && !Array.isArray(candidate.deliveryResult) && candidate.deliveryResult.visibleReplySent === true);
}
//#endregion
//#region src/channels/turn/delivery-result.ts
/** Aggregates caller-confirmed sends, preserving nested receipts before legacy message IDs. */
function createAcceptedChannelDeliveryResult(params) {
	const { deliveryResults, content, ...receiptParams } = params;
	const results = deliveryResults ? [...receiptParams.results ?? [], ...deliveryResults.flatMap((result) => result.receipt ? [{ receipt: result.receipt }] : (result.messageIds ?? []).map((messageId) => ({ messageId })))] : receiptParams.results ?? [];
	const receipt = createMessageReceiptFromOutboundResults({
		...receiptParams,
		results
	});
	return {
		messageIds: listMessageReceiptPlatformIds(receipt),
		receipt,
		visibleReplySent: true,
		...content === void 0 ? {} : { content }
	};
}
/** Builds a typed non-visible channel outcome without transport identity. */
function createSuppressedChannelDeliveryResult(params) {
	return {
		visibleReplySent: false,
		suppression: {
			reason: params.reason,
			...params.cancelReason ? { cancelReason: params.cancelReason } : {},
			...params.metadata ? { metadata: params.metadata } : {}
		}
	};
}
/** Converts a normalized message receipt into the delivery result shape used by channel turns. */
function createChannelDeliveryResultFromReceipt(params) {
	const messageIds = listMessageReceiptPlatformIds(params.receipt);
	const threadId = resolveMessageReceiptThreadId(params.receipt, params.threadId);
	return {
		...messageIds.length > 0 ? { messageIds } : {},
		receipt: params.receipt,
		...threadId ? { threadId } : {},
		...params.replyToId ? { replyToId: params.replyToId } : {},
		...params.visibleReplySent === void 0 ? {} : { visibleReplySent: params.visibleReplySent },
		...params.content === void 0 ? {} : { content: params.content },
		...params.deliveryIntent ? { deliveryIntent: params.deliveryIntent } : {}
	};
}
//#endregion
//#region src/channels/message/live.ts
function defineFinalizableLivePreviewAdapter(adapter) {
	return adapter;
}
function createLiveMessageState(params) {
	return {
		phase: params?.receipt ? "previewing" : "idle",
		canFinalizeInPlace: params?.canFinalizeInPlace ?? Boolean(params?.receipt),
		...params?.receipt ? { receipt: params.receipt } : {},
		...params?.lastRendered ? { lastRendered: params.lastRendered } : {}
	};
}
function createPreviewMessageReceipt(params) {
	const platformMessageId = String(params.id);
	return {
		primaryPlatformMessageId: platformMessageId,
		platformMessageIds: [platformMessageId],
		parts: [{
			platformMessageId,
			kind: "preview",
			index: 0,
			...params.threadId ? { threadId: params.threadId } : {},
			...params.replyToId ? { replyToId: params.replyToId } : {}
		}],
		...params.threadId ? { threadId: params.threadId } : {},
		...params.replyToId ? { replyToId: params.replyToId } : {},
		sentAt: params.sentAt ?? Date.now(),
		...params.raw === void 0 ? {} : { raw: [{ meta: { raw: params.raw } }] }
	};
}
function visibleDelivery(result) {
	if (typeof result === "object") return result.visibleReplySent ? result : void 0;
	return result === false ? void 0 : { visibleReplySent: true };
}
function combineDelivery(first, next) {
	if (!first || first === next) return next;
	return createAcceptedChannelDeliveryResult({
		deliveryResults: [first, next],
		content: [first.content, next.content].filter(Boolean).join("\n")
	});
}
function warnCleanupFailure() {
	console.warn("Live preview cleanup failed after delivery; a stale preview may remain");
}
/** The single promotion/replacement algorithm, shared by stateful and published stateless callers. */
async function deliverPreview(params, owner) {
	let liveState = params.liveState ?? createLiveMessageState({ canFinalizeInPlace: Boolean(params.draft) });
	let accepted;
	let normalAccepted = false;
	const update = (next) => {
		liveState = next;
		owner?.update(next);
	};
	const accept = (result, partial = false) => {
		accepted = combineDelivery(accepted, result);
		owner?.accept(result, partial);
	};
	const send = async (payload, deliver) => {
		if (owner && !owner.isCurrent()) return {
			visibleReplySent: false,
			suppression: { reason: "no_visible_result" }
		};
		let result;
		try {
			result = await deliver(payload);
		} catch (error) {
			if (isChannelPartialDeliveryError(error)) accept(error.deliveryResult, true);
			throw error;
		}
		const normalized = typeof result === "object" ? result : visibleDelivery(result) ?? { visibleReplySent: false };
		if (normalized.visibleReplySent) accept(normalized);
		return normalized;
	};
	const normal = async (payload, completesFinal = false) => {
		const delivery = await send(payload, params.deliverNormally);
		if (delivery.visibleReplySent) {
			normalAccepted = true;
			if (completesFinal) owner?.complete();
			if (owner?.isCurrent() ?? true) await params.onNormalDelivered?.();
		}
		return delivery;
	};
	const result = (kind) => ({
		kind,
		liveState,
		...accepted ? { deliveryResult: accepted } : {}
	});
	try {
		if (owner && !owner.isCurrent()) return result("normal-skipped");
		if (params.kind !== "final" || !params.draft || liveState.phase === "finalized") return result((await normal(params.payload, true)).visibleReplySent ? "normal-delivered" : "normal-skipped");
		const draft = params.draft;
		const edit = liveState.canFinalizeInPlace ? params.buildFinalEdit?.(params.payload) : void 0;
		if (edit !== void 0 && params.editFinal) {
			await draft.flush();
			if (owner && !owner.isCurrent()) return result("normal-skipped");
			const previewId = draft.id();
			if (previewId !== void 0) {
				await draft.seal?.();
				if (owner && !owner.isCurrent()) return result("normal-skipped");
				let editResult = void 0;
				let edited = false;
				try {
					editResult = await params.editFinal(previewId, edit);
					edited = editResult?.visibleReplySent !== false;
				} catch (error) {
					if (isChannelPartialDeliveryError(error)) {
						update({
							...liveState,
							phase: "finalized",
							canFinalizeInPlace: false,
							receipt: error.deliveryResult.receipt ?? createPreviewMessageReceipt({ id: previewId })
						});
						accept(error.deliveryResult, true);
						throw error;
					}
					params.logPreviewEditFailure?.(error);
					if (await params.handlePreviewEditError?.({
						error,
						id: previewId,
						edit,
						payload: params.payload,
						liveState
					}) === "retain") {
						update({
							...liveState,
							phase: "previewing",
							canFinalizeInPlace: true,
							receipt: liveState.receipt ?? params.createPreviewReceipt?.(previewId, edit) ?? createPreviewMessageReceipt({ id: previewId })
						});
						return result("preview-retained");
					}
				}
				if (edited) {
					const finalizedId = params.resolveFinalizedId?.(previewId, edit) ?? previewId;
					const receipt = editResult?.receipt ?? params.createPreviewReceipt?.(finalizedId, edit) ?? createPreviewMessageReceipt({ id: finalizedId });
					update({
						...liveState,
						phase: "finalized",
						receipt,
						canFinalizeInPlace: false
					});
					accept(editResult ?? {
						visibleReplySent: true,
						receipt
					});
					if (owner?.isCurrent() ?? true) await params.onPreviewFinalized?.(finalizedId, receipt, liveState);
					const supplemental = params.buildSupplementalPayload?.(params.payload);
					if (supplemental !== void 0) {
						const delivered = params.deliverSupplemental ? await send(supplemental, params.deliverSupplemental) : await normal(supplemental);
						if (!delivered.visibleReplySent && !delivered.suppression) {
							const fallback = params.deliverSupplemental ? await normal(supplemental) : delivered;
							if (!fallback.visibleReplySent && !fallback.suppression) throw new Error("Live preview supplemental payload was not delivered");
						}
					}
					owner?.complete();
					return result("preview-finalized");
				}
			}
		}
		if (owner && !owner.isCurrent()) return result("normal-skipped");
		if (draft.discardPending) await draft.discardPending();
		else await draft.clear();
		if (owner && !owner.isCurrent()) return result("normal-skipped");
		update({
			...liveState,
			phase: "cancelled",
			canFinalizeInPlace: false
		});
		try {
			return result((await normal(params.payload, true)).visibleReplySent ? "normal-delivered" : "normal-skipped");
		} finally {
			if (normalAccepted && (owner?.cleanup ?? true) && (owner?.isCurrent() ?? true)) await runBestEffortCleanup({
				cleanup: async () => {
					if (await draft.clear() === false) throw new Error("Live preview deletion was not confirmed");
				},
				onError: owner?.onCleanupFailure ?? warnCleanupFailure
			});
		}
	} catch (error) {
		if (accepted) throw createChannelPartialDeliveryError(error, {
			...accepted,
			visibleReplySent: true
		});
		throw error;
	}
}
/** Published stateless contract. Bundled channels use createLivePreviewLifecycle. */
async function deliverFinalizableLivePreview(params) {
	return await deliverPreview(params);
}
/** Published adapter contract; shares the stateful owner's delivery implementation. */
async function deliverWithFinalizableLivePreviewAdapter(params) {
	return await deliverPreview({
		...params.adapter,
		...params
	});
}
/** Owns one admitted turn's final facts and preview custody, not provider wire semantics. */
function createLivePreviewLifecycle(options = {}) {
	const newGeneration = () => ({
		state: createLiveMessageState({ canFinalizeInPlace: Boolean(options.draft) }),
		outcome: "pending"
	});
	let generation = newGeneration();
	const hasAccepted = (current) => current.outcome === "accepted" || current.outcome === "delivered" || current.outcome === "error" || current.outcome === "partial";
	const cleanup = async (current, failed = false) => {
		if (current !== generation) return;
		await runBestEffortCleanup({
			cleanup: async () => {
				await options.draft?.discardPending?.();
				if (current !== generation || current.state.phase === "finalized" || current.outcome === "failed" || current.outcome === "sending" || current.outcome === "accepted" || current.outcome === "partial" || current.outcome === "error" && options.retainOnError || !hasAccepted(current) && (failed || !options.cleanupUndelivered)) return;
				if (await options.draft?.clear() === false) throw new Error("Live preview deletion was not confirmed");
			},
			onError: options.onCleanupFailure ?? warnCleanupFailure
		});
	};
	return {
		get previewFinalized() {
			return generation.state.phase === "finalized" || generation.state.phase === "cancelled" && generation.outcome === "delivered";
		},
		get finalDelivered() {
			return hasAccepted(generation);
		},
		get finalSucceeded() {
			return generation.outcome === "delivered";
		},
		get finalFailed() {
			return generation.outcome === "failed" || generation.outcome === "partial";
		},
		get finalStarted() {
			return generation.outcome !== "pending";
		},
		async deliver(params) {
			const current = generation;
			const terminal = params.kind === "final";
			const previouslyAccepted = current.outcome === "delivered";
			if (terminal && current.outcome === "pending") {
				current.outcome = "sending";
				options.onFinalStarted?.();
			}
			try {
				const result = await deliverPreview({
					...params.adapter,
					...params,
					draft: options.draft,
					liveState: current.state
				}, {
					isCurrent: () => current === generation,
					update: (state) => {
						current.state = state;
					},
					accept: (_result, partial) => {
						if (!terminal || previouslyAccepted || current.outcome === "delivered") return;
						current.outcome = partial ? "partial" : params.isError ? "error" : "accepted";
					},
					complete: () => {
						if (!terminal || current.outcome === "delivered") return;
						current.outcome = params.isError ? "error" : "delivered";
						if (current === generation && !params.isError) options.onFinalDelivered?.();
					},
					cleanup: !(params.isError && options.retainOnError),
					onCleanupFailure: options.onCleanupFailure
				});
				if (terminal && !hasAccepted(current)) current.outcome = "suppressed";
				return result;
			} catch (error) {
				if (terminal && !previouslyAccepted && current.outcome !== "delivered") current.outcome = hasAccepted(current) ? "partial" : "failed";
				throw error;
			}
		},
		async observeDelivery(result) {
			if (!result.visibleReplySent) return;
			const current = generation;
			const started = current.outcome !== "pending";
			const notify = current.outcome !== "delivered";
			current.outcome = "delivered";
			if (current.state.phase !== "finalized") current.state = {
				...current.state,
				phase: "cancelled",
				canFinalizeInPlace: false
			};
			try {
				if (!started) options.onFinalStarted?.();
				if (notify) options.onFinalDelivered?.();
			} catch (error) {
				throw createChannelPartialDeliveryError(error, {
					...result,
					visibleReplySent: true
				});
			} finally {
				await cleanup(current);
			}
		},
		observeFailure() {
			if (!hasAccepted(generation)) generation.outcome = "failed";
		},
		async cleanup(params) {
			await cleanup(generation, params?.failed);
		},
		retainPreview() {
			generation.state = {
				...generation.state,
				phase: "finalized",
				canFinalizeInPlace: false
			};
		},
		reset() {
			generation = newGeneration();
		}
	};
}
function markLiveMessagePreviewUpdated(state, rendered) {
	return {
		...state,
		phase: "previewing",
		lastRendered: rendered
	};
}
//#endregion
export { deliverFinalizableLivePreview as a, createAcceptedChannelDeliveryResult as c, createChannelPartialDeliveryError as d, isChannelPartialDeliveryError as f, defineFinalizableLivePreviewAdapter as i, createChannelDeliveryResultFromReceipt as l, createLivePreviewLifecycle as n, deliverWithFinalizableLivePreviewAdapter as o, createPreviewMessageReceipt as r, markLiveMessagePreviewUpdated as s, createLiveMessageState as t, createSuppressedChannelDeliveryResult as u };
