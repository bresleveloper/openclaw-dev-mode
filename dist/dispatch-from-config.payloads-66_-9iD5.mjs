import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { T as setReplyPayloadMetadata, _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, h as isReplyPayloadStatusNotice, s as getReplyPayloadMetadata, w as readReplyPayloadSourceOccurrence } from "./reply-payload-B2ZQhznY.mjs";
import { r as shouldAttemptTtsPayload } from "./tts-config-DK27R_zM.mjs";
import { t as runAbortableTimeout } from "./with-timeout-DGbC_uh0.mjs";
import { t as beginReplyOperationFinalizationWork } from "./reply-run-finalization-lease-rtDY_Nul.mjs";
import { v as RUN_STALE_TAKEOVER_MS } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { g as shouldRetryReplyDispatch, m as resolveReplyDispatchErrorOutcome, o as prepareReplyPayloadForDispatcher } from "./reply-dispatcher-CLU3uA4U.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/reply/block-reply-delivery.ts
function hasBlockReplyDeliveryCustody(delivery) {
	return delivery.pending === true || delivery.outcome !== "delivered" && !shouldRetryReplyDispatch(delivery.outcome);
}
const deliveries = new AsyncLocalStorage();
function setBlockReplyDelivery(delivery, payload) {
	const context = deliveries.getStore();
	if (context) {
		context.settlement = delivery;
		context.payload = payload;
	}
}
function createBlockReplySource() {
	const fragments = [];
	let parserComplete = true;
	let pendingRuns = 0;
	let lastDelivery;
	let sequence = Promise.resolve();
	const isDelivered = (delivery) => delivery.outcome === "delivered" && !delivery.pending;
	const source = {
		get complete() {
			return parserComplete && pendingRuns === 0 && (!lastDelivery || isDelivered(lastDelivery));
		},
		get pending() {
			return pendingRuns > 0 || lastDelivery !== void 0 && hasBlockReplyDeliveryCustody(lastDelivery);
		},
		setComplete(complete) {
			parserComplete = complete;
		},
		run(send) {
			const outer = deliveries.getStore();
			if (outer) outer.source = source;
			pendingRuns++;
			let delivery = { outcome: "cancelled" };
			const context = {};
			const operation = sequence.then(() => {
				if (lastDelivery && !isDelivered(lastDelivery)) {
					delivery = lastDelivery;
					return;
				}
				return deliveries.run(context, send);
			});
			const settlement = operation.then(() => context.settlement ?? delivery).then((receipt) => {
				if (context.payload) {
					fragments.push({
						payload: context.payload,
						delivery: receipt
					});
					lastDelivery = receipt;
				}
				return receipt;
			}, (error) => {
				lastDelivery = { outcome: resolveReplyDispatchErrorOutcome(error) };
				return lastDelivery;
			}).finally(() => {
				pendingRuns--;
			});
			sequence = settlement.then(() => void 0);
			if (outer) outer.settlement = settlement;
			return operation;
		},
		settle: () => sequence.then(() => lastDelivery ?? { outcome: "delivered" }),
		recoverPartial(payload) {
			let text = payload.text;
			for (const fragment of fragments) {
				if (!isDelivered(fragment.delivery)) break;
				const prefix = fragment.payload.text?.trimStart();
				if (!prefix) continue;
				const remaining = text?.trimStart();
				if (!remaining?.startsWith(prefix)) break;
				text = remaining.slice(prefix.length);
			}
			return copyReplyPayloadMetadata(payload, {
				...payload,
				text: text || void 0
			});
		}
	};
	return source;
}
async function recoverBlockReplySources(payload, sources) {
	const receipts = await Promise.all(sources.map((source) => source.settle()));
	const delivery = sources.every((source) => source.complete) ? { outcome: "delivered" } : receipts.find(hasBlockReplyDeliveryCustody) ?? (sources.some((source) => source.pending) ? {
		outcome: "delivered-not-visible",
		pending: true
	} : void 0);
	if (delivery) return {
		payload: copyReplyPayloadMetadata(payload, {
			...payload,
			text: void 0
		}),
		delivery
	};
	return { payload: sources.reduce((remaining, source) => source.recoverPartial(remaining), payload) };
}
async function deliverBlockReply(send) {
	const context = {};
	await deliveries.run(context, send);
	const delivery = await context.settlement ?? { outcome: "delivered" };
	return context.source ? {
		...delivery,
		source: context.source
	} : delivery;
}
//#endregion
//#region src/auto-reply/reply/block-reply-coalescer.ts
/** Creates a text coalescer with idle and size-based flush behavior. */
function createBlockReplyCoalescer(params) {
	const { config, shouldAbort, onFlush } = params;
	const minChars = Math.max(1, Math.floor(config.minChars));
	const maxChars = Math.max(minChars, Math.floor(config.maxChars));
	const idleMs = Math.max(0, Math.floor(config.idleMs));
	const joiner = config.joiner ?? "";
	const flushOnEnqueue = config.flushOnEnqueue === true;
	let bufferText = "";
	let bufferSourceText;
	let bufferSourceRange;
	let bufferedPayload;
	let idleTimer;
	const clearIdleTimer = () => {
		if (!idleTimer) return;
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const resetBuffer = () => {
		bufferText = "";
		bufferSourceText = void 0;
		bufferSourceRange = void 0;
		bufferedPayload = void 0;
	};
	const scheduleIdleFlush = () => {
		if (idleMs <= 0) return;
		clearIdleTimer();
		idleTimer = setTimeout(() => {
			flush({ force: false });
		}, idleMs);
	};
	const flush = async (options) => {
		clearIdleTimer();
		if (shouldAbort()) {
			resetBuffer();
			return;
		}
		if (!bufferText || !bufferedPayload) return;
		if (!options?.force && !flushOnEnqueue && bufferText.length < minChars) {
			scheduleIdleFlush();
			return;
		}
		const payload = setReplyPayloadMetadata(copyReplyPayloadMetadata(bufferedPayload, {
			...bufferedPayload,
			text: bufferText
		}), {
			blockSourceText: bufferSourceText,
			blockSourceRange: bufferSourceRange
		});
		resetBuffer();
		await onFlush(payload);
	};
	const canMergeBufferedTextWithMedia = (payload) => Boolean(bufferText) && bufferedPayload !== void 0 && !flushOnEnqueue && !bufferedPayload.audioAsVoice && !payload.audioAsVoice && !payload.isReasoning && !payload.isCommentary && !isReplyPayloadStatusNotice(payload) && !bufferedPayload.isReasoning && !bufferedPayload.isCommentary && !isReplyPayloadStatusNotice(bufferedPayload) && (!payload.replyToId || bufferedPayload.replyToId === payload.replyToId);
	/** Merges buffered text into a media payload without changing media metadata. */
	const mergeBufferedTextWithMedia = (payload, text) => {
		const mergedText = text ? `${bufferText}${joiner}${text}` : bufferText;
		const sourceText = text ? getReplyPayloadMetadata(payload)?.blockSourceText : void 0;
		const sourceRange = text ? getReplyPayloadMetadata(payload)?.blockSourceRange : void 0;
		const mergedSourceText = bufferSourceText !== void 0 || sourceText !== void 0 ? (bufferSourceText ?? bufferText) + (sourceText ?? text) : void 0;
		const mergedSourceRange = bufferSourceRange && sourceRange ? [bufferSourceRange[0], sourceRange[1]] : bufferSourceRange ?? sourceRange;
		const mergedPayload = {
			...bufferedPayload,
			...payload,
			text: mergedText,
			replyToId: payload.replyToId ?? bufferedPayload?.replyToId,
			replyToCurrent: payload.replyToCurrent || bufferedPayload?.replyToCurrent,
			replyToTag: payload.replyToTag || bufferedPayload?.replyToTag
		};
		const metadataMergedPayload = copyReplyPayloadMetadata(bufferedPayload ?? mergedPayload, mergedPayload);
		resetBuffer();
		return setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, metadataMergedPayload), {
			blockSourceText: mergedSourceText,
			blockSourceRange: mergedSourceRange
		});
	};
	const enqueue = (payload) => {
		if (shouldAbort()) return;
		const reply = resolveSendableOutboundReplyParts(payload);
		const hasMedia = reply.hasMedia;
		const text = reply.text;
		const sourceText = getReplyPayloadMetadata(payload)?.blockSourceText;
		const sourceRange = getReplyPayloadMetadata(payload)?.blockSourceRange;
		const hasText = reply.hasText;
		if (hasMedia) {
			if (canMergeBufferedTextWithMedia(payload)) {
				onFlush(mergeBufferedTextWithMedia(payload, text));
				return;
			}
			flush({ force: true });
			onFlush(payload);
			return;
		}
		if (!hasText) return;
		if (flushOnEnqueue) {
			if (bufferText) flush({ force: true });
			bufferedPayload = payload;
			bufferText = text;
			bufferSourceText = sourceText;
			bufferSourceRange = sourceRange;
			flush({ force: true });
			return;
		}
		const replyToConflict = Boolean(bufferText && payload.replyToId && (!bufferedPayload?.replyToId || bufferedPayload.replyToId !== payload.replyToId));
		const visibilityConflict = bufferText && bufferedPayload && (bufferedPayload.isReasoning !== payload.isReasoning || bufferedPayload.isCommentary !== payload.isCommentary || bufferedPayload.isCompactionNotice !== payload.isCompactionNotice || bufferedPayload.isFallbackNotice !== payload.isFallbackNotice || isReplyPayloadStatusNotice(bufferedPayload) !== isReplyPayloadStatusNotice(payload));
		if (bufferText && (replyToConflict || bufferedPayload?.audioAsVoice !== payload.audioAsVoice || visibilityConflict)) flush({ force: true });
		if (!bufferText) bufferedPayload = payload;
		const nextText = bufferText ? `${bufferText}${joiner}${text}` : text;
		if (nextText.length > maxChars) {
			if (bufferText) {
				flush({ force: true });
				bufferedPayload = payload;
				if (text.length >= maxChars) {
					onFlush(payload);
					return;
				}
				bufferText = text;
				bufferSourceText = sourceText;
				bufferSourceRange = sourceRange;
				scheduleIdleFlush();
				return;
			}
			onFlush(payload);
			return;
		}
		bufferSourceText = bufferSourceText !== void 0 || sourceText !== void 0 ? (bufferSourceText ?? bufferText) + (sourceText ?? text) : void 0;
		bufferSourceRange = bufferSourceRange && sourceRange ? [bufferSourceRange[0], sourceRange[1]] : bufferSourceRange ?? sourceRange;
		bufferText = nextText;
		if (bufferText.length >= maxChars) {
			flush({ force: true });
			return;
		}
		scheduleIdleFlush();
	};
	return {
		enqueue,
		flush,
		hasBuffered: () => Boolean(bufferText),
		stop: () => clearIdleTimer()
	};
}
//#endregion
//#region src/auto-reply/reply/block-reply-pipeline.ts
/** Buffers audio payloads so final delivery can preserve voice presentation. */
function createAudioAsVoiceBuffer(params) {
	let seenAudioAsVoice = false;
	return {
		onEnqueue: (payload) => {
			if (payload.audioAsVoice) seenAudioAsVoice = true;
		},
		shouldBuffer: (payload) => params.isAudioPayload(payload),
		finalize: (payload) => seenAudioAsVoice ? copyReplyPayloadMetadata(payload, {
			...payload,
			audioAsVoice: true
		}) : payload
	};
}
function createBlockReplyContentIdentity(payload) {
	const reply = resolveSendableOutboundReplyParts(payload);
	return {
		text: reply.trimmedText,
		mediaList: reply.mediaUrls,
		presentation: payload.presentation ?? null,
		presentationTextMode: payload.presentationTextMode ?? null,
		interactive: payload.interactive ?? null,
		channelData: payload.channelData ?? null,
		location: payload.location ?? null,
		videoAsNote: payload.videoAsNote === true
	};
}
/** Creates a stable duplicate key for a complete outbound payload. */
function createBlockReplyPayloadKey(payload) {
	return JSON.stringify({
		...createBlockReplyContentIdentity(payload),
		statusNotice: isReplyPayloadStatusNotice(payload),
		reasoning: payload.isReasoning === true,
		commentary: payload.isCommentary === true,
		assistantMessageIndex: getReplyPayloadMetadata(payload)?.assistantMessageIndex ?? null,
		replyToId: payload.replyToId ?? null
	});
}
/** Creates a duplicate key that ignores reply target for final suppression. */
function createBlockReplyContentKey(payload) {
	return JSON.stringify(createBlockReplyContentIdentity(payload));
}
function createIndexedBlockReplyContentKey(payload) {
	const contentKey = createBlockReplyContentKey(payload);
	const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
	return assistantMessageIndex === void 0 ? contentKey : `${assistantMessageIndex}:${contentKey}`;
}
function resolveBlockReplyTimeoutMs(timeoutMs) {
	return clampPositiveTimerTimeoutMs(timeoutMs) ?? 0;
}
/** Creates the ordered block reply delivery pipeline for streamed payloads. */
function createBlockReplyPipeline(params) {
	const { onBlockReply, coalescing, buffer } = params;
	const timeoutMs = resolveBlockReplyTimeoutMs(params.timeoutMs);
	const sentKeys = /* @__PURE__ */ new Set();
	const sentContentKeys = /* @__PURE__ */ new Set();
	const sentMediaUrls = /* @__PURE__ */ new Set();
	const pendingKeys = /* @__PURE__ */ new Set();
	const seenKeys = /* @__PURE__ */ new Set();
	const bufferedPayloads = [];
	const blockAttemptsByMessage = /* @__PURE__ */ new Map();
	let bufferedAssistantMessageIndex;
	let sendChain = Promise.resolve();
	let aborted = false;
	let didStream = false;
	let didLogTimeout = false;
	const hasSeenOrQueuedPayloadKey = (payloadKey) => seenKeys.has(payloadKey) || sentKeys.has(payloadKey) || pendingKeys.has(payloadKey);
	const sourceOccurrenceKey = (payload) => {
		const occurrence = readReplyPayloadSourceOccurrence(payload);
		return occurrence ? JSON.stringify([
			occurrence.assistantMessageIndex,
			occurrence.sourceRange[0],
			occurrence.sourceRange[1],
			occurrence.sourceText
		]) : void 0;
	};
	const flushBufferedAssistantBlock = () => {
		bufferedAssistantMessageIndex = void 0;
		coalescer?.flush({ force: true });
	};
	const sendPayload = (payload, bypassSeenCheck = false) => {
		if (aborted) return;
		const payloadKey = createBlockReplyPayloadKey(payload);
		const contentKey = createBlockReplyContentKey(payload);
		const blockSourceText = getReplyPayloadMetadata(payload)?.blockSourceText;
		const occurrenceKey = sourceOccurrenceKey(payload);
		const dedupeKey = occurrenceKey ?? payloadKey;
		const carriesUnkeyedDistinctSource = blockSourceText !== void 0 && occurrenceKey === void 0;
		if (!bypassSeenCheck && !carriesUnkeyedDistinctSource) {
			if (seenKeys.has(dedupeKey)) return;
			seenKeys.add(dedupeKey);
		}
		if (occurrenceKey) seenKeys.add(payloadKey);
		if (!carriesUnkeyedDistinctSource && (sentKeys.has(dedupeKey) || pendingKeys.has(dedupeKey))) return;
		pendingKeys.add(dedupeKey);
		const isTerminalContent = isReplyPayloadTerminalContent(payload);
		const reply = resolveSendableOutboundReplyParts(payload);
		const attempt = {
			outcome: "cancelled",
			sourceText: blockSourceText ?? reply.trimmedText,
			contentKey,
			mediaUrls: reply.mediaUrls,
			terminal: isTerminalContent && hasOutboundReplyContent(payload, { trimText: true })
		};
		const index = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		const attempts = blockAttemptsByMessage.get(index) ?? [];
		attempts.push(attempt);
		blockAttemptsByMessage.set(index, attempts);
		const fallbackAbortController = new AbortController();
		let timeoutSignal;
		sendChain = sendChain.then(async () => {
			if (aborted) return false;
			attempt.outcome = "failed-deliver";
			attempt.pending = true;
			return await runAbortableTimeout(async (signal) => {
				timeoutSignal = signal;
				return await deliverBlockReply(() => onBlockReply(payload, {
					abortSignal: signal ?? fallbackAbortController.signal,
					timeoutMs
				}));
			}, timeoutMs || void 0, "block reply delivery");
		}).then((delivery) => {
			if (!delivery) return;
			Object.assign(attempt, delivery, { pending: delivery.pending === true });
			const isStatusNotice = isReplyPayloadStatusNotice(payload);
			if (delivery.outcome !== "delivered" || delivery.pending) return;
			if (delivery.source?.complete !== false) sentKeys.add(dedupeKey);
			if (isTerminalContent && delivery.source?.complete !== false) {
				if (attempt.terminal) attempt.terminalDeliveryConfirmed = true;
				sentContentKeys.add(contentKey);
				sentContentKeys.add(createIndexedBlockReplyContentKey(payload));
			}
			for (const mediaUrl of reply.mediaUrls) sentMediaUrls.add(mediaUrl);
			if (!isStatusNotice) didStream = true;
		}).catch((err) => {
			if (timeoutSignal?.aborted) {
				aborted = true;
				if (!didLogTimeout) {
					didLogTimeout = true;
					logVerbose(`block reply delivery timed out after ${timeoutMs}ms; skipping remaining block replies to preserve ordering`);
				}
				return;
			}
			attempt.outcome = resolveReplyDispatchErrorOutcome(err);
			attempt.pending = false;
			logVerbose(`block reply delivery failed: ${String(err)}`);
		}).finally(() => {
			pendingKeys.delete(dedupeKey);
		});
	};
	const coalescer = coalescing ? createBlockReplyCoalescer({
		config: coalescing,
		shouldAbort: () => aborted,
		onFlush: (payload) => {
			bufferedAssistantMessageIndex = void 0;
			sendPayload(payload, true);
		}
	}) : null;
	const bufferPayload = (payload) => {
		buffer?.onEnqueue?.(payload);
		if (!buffer?.shouldBuffer(payload)) return false;
		const payloadKey = createBlockReplyPayloadKey(payload);
		if (hasSeenOrQueuedPayloadKey(payloadKey)) return true;
		seenKeys.add(payloadKey);
		bufferedPayloads.push(payload);
		return true;
	};
	const flushBuffered = () => {
		if (!bufferedPayloads.length) return;
		for (const payload of bufferedPayloads) {
			const finalPayload = buffer?.finalize?.(payload) ?? payload;
			sendPayload(finalPayload, true);
		}
		bufferedPayloads.length = 0;
	};
	const enqueueCoalescedPayload = (payload) => {
		if (!coalescer) return;
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		if (assistantMessageIndex !== void 0 && bufferedAssistantMessageIndex !== void 0 && assistantMessageIndex !== bufferedAssistantMessageIndex && coalescer.hasBuffered()) flushBufferedAssistantBlock();
		const payloadKey = createBlockReplyPayloadKey(payload);
		const occurrenceKey = sourceOccurrenceKey(payload);
		const carriesUnkeyedDistinctSource = getReplyPayloadMetadata(payload)?.blockSourceText !== void 0 && occurrenceKey === void 0;
		const dedupeKey = occurrenceKey ?? payloadKey;
		if (!carriesUnkeyedDistinctSource && hasSeenOrQueuedPayloadKey(dedupeKey)) return;
		if (!carriesUnkeyedDistinctSource) seenKeys.add(dedupeKey);
		if (occurrenceKey) seenKeys.add(payloadKey);
		bufferedAssistantMessageIndex = assistantMessageIndex;
		coalescer.enqueue(payload);
	};
	const enqueue = (payload) => {
		if (aborted) return;
		if (bufferPayload(payload)) {
			flushBufferedAssistantBlock();
			return;
		}
		flushBuffered();
		const reply = resolveSendableOutboundReplyParts(payload);
		const hasNonTextContent = hasOutboundReplyContent({
			...payload,
			text: void 0,
			mediaUrl: void 0,
			mediaUrls: void 0
		}, { trimText: true });
		if (reply.hasMedia && coalescer && !hasNonTextContent) {
			enqueueCoalescedPayload(payload);
			return;
		}
		if (reply.hasMedia || hasNonTextContent) {
			coalescer?.flush({ force: true });
			sendPayload(payload, false);
			return;
		}
		if (coalescer) {
			enqueueCoalescedPayload(payload);
			return;
		}
		sendPayload(payload, false);
	};
	const flush = async (options) => {
		await coalescer?.flush(options);
		bufferedAssistantMessageIndex = void 0;
		flushBuffered();
		await sendChain;
	};
	const stop = () => {
		coalescer?.stop();
	};
	const matchingAttempts = (payload) => {
		const index = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		return index === void 0 ? blockAttemptsByMessage.values() : [blockAttemptsByMessage.get(index) ?? []];
	};
	const normalizeSource = (text) => text.replace(/\s+/g, "");
	const matchesSource = (payload, attempts) => {
		const reply = resolveSendableOutboundReplyParts(payload);
		return !reply.hasMedia && Boolean(reply.trimmedText) && attempts.length > 0 && normalizeSource(attempts.map((attempt) => attempt.sourceText).join("")) === normalizeSource(reply.trimmedText);
	};
	return {
		enqueue,
		flush,
		stop,
		hasBuffered: () => coalescer?.hasBuffered() || bufferedPayloads.length > 0,
		didStream: () => didStream,
		didStreamTerminalReply: (minimumAssistantMessageIndex = 0) => {
			for (const [index, attempts] of blockAttemptsByMessage) if ((index ?? 0) >= minimumAssistantMessageIndex && attempts.some((attempt) => attempt.terminalDeliveryConfirmed === true)) return true;
			return false;
		},
		isAborted: () => aborted,
		hasSentExactPayload: (payload) => sentContentKeys.has(createIndexedBlockReplyContentKey(payload)),
		getSourceRecovery: (payload) => {
			const text = normalizeSource(resolveSendableOutboundReplyParts(payload).trimmedText);
			for (const group of matchingAttempts(payload)) {
				const attempts = group.filter((attempt) => attempt.terminal);
				if (text && normalizeSource(attempts.map((attempt) => attempt.sourceText).join("")) === text && attempts.some((attempt) => attempt.source?.complete === false)) return Array.from(new Set(attempts.flatMap((attempt) => attempt.source ?? [])));
			}
		},
		isFinalPayloadRetryBlocked: (payload) => {
			const contentKey = createBlockReplyContentKey(payload);
			const reply = resolveSendableOutboundReplyParts(payload);
			const text = normalizeSource(reply.trimmedText);
			const textOnly = !hasOutboundReplyContent({
				...payload,
				text: void 0
			});
			for (const group of matchingAttempts(payload)) {
				const attempts = group.filter((attempt) => attempt.terminal);
				const blocked = attempts.filter(hasBlockReplyDeliveryCustody);
				const sourcePrefix = normalizeSource(attempts.map((attempt) => attempt.sourceText).join(""));
				if (blocked.some((attempt) => attempt.contentKey === contentKey) || textOnly && blocked.length > 0 && sourcePrefix.length > 0 && text.startsWith(sourcePrefix)) return true;
			}
			return false;
		},
		hasSentPayload: (payload) => {
			const payloadKey = createIndexedBlockReplyContentKey(payload);
			if (sentContentKeys.has(payloadKey)) return true;
			if (!didStream) return false;
			for (const attempts of matchingAttempts(payload)) if (matchesSource(payload, attempts.filter((attempt) => attempt.terminal && attempt.outcome === "delivered" && !attempt.pending && attempt.source?.complete !== false))) return true;
			return false;
		},
		getSentMediaUrls: () => Array.from(sentMediaUrls),
		hasRetryBlockedDelivery: () => Array.from(blockAttemptsByMessage.values()).some((attempts) => attempts.some(hasBlockReplyDeliveryCustody)),
		hasRetryBlockedTerminalDelivery: (minimumAssistantMessageIndex = 0) => {
			for (const [index, attempts] of blockAttemptsByMessage) if ((index ?? 0) >= minimumAssistantMessageIndex && attempts.some((attempt) => attempt.terminal && hasBlockReplyDeliveryCustody(attempt))) return true;
			return false;
		},
		getRetryBlockedMediaUrls: () => Array.from(new Set(Array.from(blockAttemptsByMessage.values()).flatMap((attempts) => attempts.filter(hasBlockReplyDeliveryCustody).flatMap((attempt) => attempt.mediaUrls))))
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.payloads.ts
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const NO_VISIBLE_REPLY_FALLBACK_TEXT = "⚠️ OpenClaw couldn't produce or deliver a reply. Please try again. If this keeps happening, ask the operator to check the gateway logs.";
function buildNoVisibleReplyFallbackText(runId) {
	const reference = normalizeOptionalString(runId);
	return reference && /^[a-z0-9][a-z0-9_-]{0,127}$/iu.test(reference) ? `${NO_VISIBLE_REPLY_FALLBACK_TEXT} Reference: ${reference}.` : NO_VISIBLE_REPLY_FALLBACK_TEXT;
}
const QUEUE_CAP_REJECTION_TEXT = "This message was not queued because the session queue is full. Please try again after the current response finishes.";
function shouldDeliverDespiteSourceReplySuppression(payload, state) {
	return state.suppressAutomaticSourceDelivery && !state.sendPolicyDenied && getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true && (state.ctx.InboundEventKind !== "room_event" || state.explicitCommandTurnCtx);
}
function hasExecApprovalPayload(payload) {
	return isRecord(payload.channelData?.execApproval);
}
function hasExecApprovalUnavailablePayload(payload) {
	return isRecord(payload.channelData?.execApprovalUnavailable);
}
function hasAskUserPayload(payload) {
	return isRecord(payload.channelData?.askUser);
}
function requiresDurableToolResultDelivery(payload) {
	return resolveSendableOutboundReplyParts(payload).hasMedia || hasExecApprovalPayload(payload) || hasExecApprovalUnavailablePayload(payload) || hasAskUserPayload(payload);
}
function createFinalDispatchPayloadDedupeKey(payload) {
	const metadata = getReplyPayloadMetadata(payload);
	return JSON.stringify({
		payload: {
			text: payload.text,
			mediaUrl: payload.mediaUrl,
			mediaUrls: payload.mediaUrls,
			trustedLocalMedia: payload.trustedLocalMedia,
			sensitiveMedia: payload.sensitiveMedia,
			presentation: payload.presentation,
			presentationTextMode: payload.presentationTextMode,
			delivery: payload.delivery,
			interactive: payload.interactive,
			btw: payload.btw,
			replyToId: payload.replyToId,
			replyToTag: payload.replyToTag,
			replyToCurrent: payload.replyToCurrent,
			audioAsVoice: payload.audioAsVoice,
			videoAsNote: payload.videoAsNote === true,
			location: payload.location,
			spokenText: payload.spokenText,
			ttsSupplement: payload.ttsSupplement,
			isError: payload.isError,
			isReasoning: payload.isReasoning,
			isCommentary: payload.isCommentary,
			isReasoningSnapshot: payload.isReasoningSnapshot,
			isCompactionNotice: payload.isCompactionNotice,
			isFallbackNotice: payload.isFallbackNotice,
			isStatusNotice: payload.isStatusNotice,
			channelData: payload.channelData
		},
		identity: {
			assistantMessageIndex: metadata?.assistantMessageIndex,
			assistantTranscriptOwned: metadata?.assistantTranscriptOwned,
			replyToIdExplicit: metadata?.replyToIdExplicit,
			replyDelivery: metadata?.replyDelivery,
			replyDeliverySource: metadata?.replyDeliverySource,
			sourceReplyTranscriptMirror: metadata?.sourceReplyTranscriptMirror
		}
	});
}
function formatSuppressedReplyPayloadForLog(reply) {
	const metadata = getReplyPayloadMetadata(reply);
	const text = normalizeOptionalString(reply.text);
	const textPreview = text ? truncateUtf16Safe(text.replace(/\s+/g, " "), 160) : void 0;
	const sendableParts = resolveSendableOutboundReplyParts(reply);
	const richParts = [
		reply.presentation ? "presentation" : void 0,
		reply.interactive ? "interactive" : void 0,
		reply.channelData ? "channelData" : void 0
	].filter(Boolean);
	return [
		`textChars=${text?.length ?? 0}`,
		`media=${sendableParts.mediaCount}`,
		`rich=${richParts.length ? richParts.join("|") : "none"}`,
		`error=${reply.isError === true}`,
		`beforeAgentRunBlocked=${metadata?.beforeAgentRunBlocked === true}`,
		`deliverDespiteSuppression=${metadata?.deliverDespiteSourceReplySuppression === true}`,
		textPreview ? `textPreview=${JSON.stringify(textPreview)}` : void 0
	].filter(Boolean).join(" ");
}
async function maybeApplyTtsToReplyPayload(params) {
	if (isReplyPayloadStatusNotice(params.payload)) return params.payload;
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	const ttsPayload = await maybeApplyTtsToPayload(params);
	return ttsPayload === params.payload ? ttsPayload : copyReplyPayloadMetadata(params.payload, ttsPayload);
}
function createFinalizationAwareTtsPayloadApplier(params) {
	return async (ttsParams) => {
		const replyOperation = params.getReplyOperation();
		const finishFinalizationWork = replyOperation ? beginReplyOperationFinalizationWork(replyOperation, RUN_STALE_TAKEOVER_MS) : void 0;
		try {
			return await maybeApplyTtsToReplyPayload({
				...ttsParams,
				inboundAudio: params.hasInboundAudio()
			});
		} finally {
			finishFinalizationWork?.();
			replyOperation?.recordActivity();
		}
	};
}
/** Applies dispatcher normalization before TTS or transcript-visible side effects. */
function prepareReplyPayloadForSideEffects(dispatcher, kind, payload, state, onVisibleAccepted) {
	if (!payload) return null;
	const outcome = prepareReplyPayloadForDispatcher(dispatcher, kind, payload);
	if (outcome.kind === "deliver") {
		state.acceptedReplyPayload = true;
		if (outcome.payload.isReasoning !== true && outcome.payload.isCommentary !== true && hasOutboundReplyContent(outcome.payload, { trimText: true })) onVisibleAccepted?.();
		return outcome.payload;
	}
	state.channelTransformSuppressed ||= outcome.reason === "channel_transform";
	return null;
}
//#endregion
export { hasBlockReplyDeliveryCustody as _, formatSuppressedReplyPayloadForLog as a, hasExecApprovalUnavailablePayload as c, shouldDeliverDespiteSourceReplySuppression as d, createAudioAsVoiceBuffer as f, deliverBlockReply as g, createBlockReplySource as h, createFinalizationAwareTtsPayloadApplier as i, prepareReplyPayloadForSideEffects as l, createBlockReplyPipeline as m, buildNoVisibleReplyFallbackText as n, hasAskUserPayload as o, createBlockReplyContentKey as p, createFinalDispatchPayloadDedupeKey as r, hasExecApprovalPayload as s, QUEUE_CAP_REJECTION_TEXT as t, requiresDurableToolResultDelivery as u, recoverBlockReplySources as v, setBlockReplyDelivery as y };
