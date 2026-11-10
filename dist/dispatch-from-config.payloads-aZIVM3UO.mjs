import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { D as setReplyPayloadMetadata, E as readReplyPayloadSourceOccurrence, _ as isReplyPayloadStatusNotice, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, y as isReplyPayloadTerminalContent } from "./reply-payload-BLX_BF2U.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { o as shouldAttemptTtsPayload } from "./tts-config-C3g0K7Hg.mjs";
import { t as runAbortableTimeout } from "./with-timeout-BD1Rfbmo.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-79LnOCyy.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-XnYlwTNV.mjs";
import { g as shouldRetryReplyDispatch, m as resolveReplyDispatchErrorOutcome, o as prepareReplyPayloadForDispatcher } from "./reply-dispatcher-BW8Y2zzZ.mjs";
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
function createBlockReplyCoalescer(params) {
	const { config, shouldAbort, onFlush } = params;
	const minChars = Math.max(1, Math.floor(config.minChars));
	const maxChars = Math.max(minChars, Math.floor(config.maxChars));
	const idleMs = Math.max(0, Math.floor(config.idleMs));
	const joiner = config.joiner ?? "";
	let bufferText = "";
	let bufferSource = {};
	let bufferedPayload;
	let idleTimer;
	const clearIdleTimer = () => {
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const resetBuffer = () => {
		bufferText = "";
		bufferSource = {};
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
		if (!options?.force && bufferText.length < minChars) {
			scheduleIdleFlush();
			return;
		}
		const payload = setReplyPayloadMetadata(copyReplyPayloadMetadata(bufferedPayload, {
			...bufferedPayload,
			text: bufferText
		}), bufferSource);
		resetBuffer();
		await onFlush(payload);
	};
	const canMergeBufferedTextWithMedia = (payload, text) => Boolean(bufferText) && (!text || bufferText.length + joiner.length + text.length <= maxChars) && bufferedPayload !== void 0 && [bufferedPayload, payload].every((part) => !part.audioAsVoice && !part.isReasoning && !part.isCommentary && !isReplyPayloadStatusNotice(part)) && (!payload.replyToId || bufferedPayload.replyToId === payload.replyToId);
	const mergeSource = (text, source) => ({
		blockSourceText: bufferSource.blockSourceText !== void 0 || source.blockSourceText !== void 0 ? (bufferSource.blockSourceText ?? bufferText) + (source.blockSourceText ?? text) : void 0,
		blockSourceRange: bufferSource.blockSourceRange && source.blockSourceRange ? [bufferSource.blockSourceRange[0], source.blockSourceRange[1]] : bufferSource.blockSourceRange ?? source.blockSourceRange
	});
	const mergeBufferedTextWithMedia = (payload, text) => {
		const mergedText = text ? `${bufferText}${joiner}${text}` : bufferText;
		const mergedSource = mergeSource(text, text ? getReplyPayloadMetadata(payload) ?? {} : {});
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
		return setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, metadataMergedPayload), mergedSource);
	};
	const enqueue = (payload) => {
		if (shouldAbort()) return;
		const reply = resolveSendableOutboundReplyParts(payload);
		const text = reply.text;
		const source = {
			blockSourceText: getReplyPayloadMetadata(payload)?.blockSourceText,
			blockSourceRange: getReplyPayloadMetadata(payload)?.blockSourceRange
		};
		if (reply.hasMedia) {
			if (canMergeBufferedTextWithMedia(payload, text)) {
				onFlush(mergeBufferedTextWithMedia(payload, text));
				return;
			}
			flush({ force: true });
			onFlush(payload);
			return;
		}
		if (!reply.hasText) return;
		const replyToConflict = Boolean(payload.replyToId && bufferedPayload?.replyToId !== payload.replyToId);
		const visibilityConflict = bufferedPayload && (bufferedPayload.isReasoning !== payload.isReasoning || bufferedPayload.isCommentary !== payload.isCommentary || bufferedPayload.isCompactionNotice !== payload.isCompactionNotice || bufferedPayload.isFallbackNotice !== payload.isFallbackNotice || isReplyPayloadStatusNotice(bufferedPayload) !== isReplyPayloadStatusNotice(payload));
		if (bufferText && (replyToConflict || bufferedPayload?.audioAsVoice !== payload.audioAsVoice || visibilityConflict)) flush({ force: true });
		if (!bufferText) bufferedPayload = payload;
		let nextText = bufferText ? `${bufferText}${joiner}${text}` : text;
		const replaceSource = nextText.length > maxChars;
		if (replaceSource) {
			if (bufferText) {
				flush({ force: true });
				bufferedPayload = payload;
			}
			if (text.length >= maxChars) {
				onFlush(payload);
				return;
			}
			nextText = text;
		}
		bufferSource = replaceSource ? source : mergeSource(text, source);
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
		stop: clearIdleTimer
	};
}
//#endregion
//#region src/auto-reply/reply/block-reply-pipeline.ts
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
function createBlockReplyContentKey(payload) {
	return JSON.stringify(createBlockReplyContentIdentity(payload));
}
function createIndexedBlockReplyContentKey(payload) {
	const contentKey = createBlockReplyContentKey(payload);
	const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
	return assistantMessageIndex === void 0 ? contentKey : `${assistantMessageIndex}:${contentKey}`;
}
function createBlockReplyPipeline(params) {
	const { onBlockReply, coalescing, isAudioPayload } = params;
	const timeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs) ?? 0;
	const sentKeys = /* @__PURE__ */ new Set();
	const sentContentKeys = /* @__PURE__ */ new Set();
	const sentMediaUrls = /* @__PURE__ */ new Set();
	const pendingKeys = /* @__PURE__ */ new Set();
	const seenKeys = /* @__PURE__ */ new Set();
	const bufferedPayloads = [];
	let seenAudioAsVoice = false;
	const blockAttemptsByMessage = /* @__PURE__ */ new Map();
	let bufferedAssistantMessageIndex;
	let sendChain = Promise.resolve();
	let aborted = false;
	let didStream = false;
	const hasSeenOrQueuedPayloadKey = (payloadKey) => seenKeys.has(payloadKey) || sentKeys.has(payloadKey) || pendingKeys.has(payloadKey);
	const resolveDedupeIdentity = (payload, payloadKey) => {
		const sourceText = getReplyPayloadMetadata(payload)?.blockSourceText;
		const occurrence = readReplyPayloadSourceOccurrence(payload);
		const occurrenceKey = occurrence ? JSON.stringify(occurrence) : void 0;
		return {
			sourceText,
			occurrenceKey,
			key: occurrenceKey ?? payloadKey,
			unkeyedSource: sourceText !== void 0 && occurrenceKey === void 0
		};
	};
	const flushBufferedAssistantBlock = () => {
		bufferedAssistantMessageIndex = void 0;
		coalescer?.flush({ force: true });
	};
	const sendPayload = (payload, bypassSeenCheck = false) => {
		if (aborted) return;
		const payloadKey = createBlockReplyPayloadKey(payload);
		const contentKey = createBlockReplyContentKey(payload);
		const identity = resolveDedupeIdentity(payload, payloadKey);
		if (!bypassSeenCheck && !identity.unkeyedSource) {
			if (seenKeys.has(identity.key)) return;
			seenKeys.add(identity.key);
		}
		if (identity.occurrenceKey) seenKeys.add(payloadKey);
		if (!identity.unkeyedSource && (sentKeys.has(identity.key) || pendingKeys.has(identity.key))) return;
		pendingKeys.add(identity.key);
		const isTerminalContent = isReplyPayloadTerminalContent(payload);
		const reply = resolveSendableOutboundReplyParts(payload);
		const metadata = getReplyPayloadMetadata(payload);
		const attempt = {
			outcome: "cancelled",
			sourceText: identity.sourceText ?? reply.trimmedText,
			contentKey,
			mediaUrls: reply.mediaUrls,
			terminal: isTerminalContent && hasOutboundReplyContent(payload, { trimText: true }),
			messageStart: metadata?.assistantMessageStartIndex
		};
		const index = metadata?.assistantMessageIndex;
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
			if (delivery.source?.complete !== false) {
				sentKeys.add(identity.key);
				if (isTerminalContent) {
					if (attempt.terminal) attempt.terminalDeliveryConfirmed = true;
					sentContentKeys.add(contentKey);
					sentContentKeys.add(createIndexedBlockReplyContentKey(payload));
				}
			}
			for (const mediaUrl of reply.mediaUrls) sentMediaUrls.add(mediaUrl);
			if (!isStatusNotice) didStream = true;
		}).catch((err) => {
			if (timeoutSignal?.aborted) {
				aborted = true;
				logVerbose(`block reply delivery timed out after ${timeoutMs}ms; skipping remaining block replies to preserve ordering`);
				return;
			}
			attempt.outcome = resolveReplyDispatchErrorOutcome(err);
			attempt.pending = false;
			logVerbose(`block reply delivery failed: ${String(err)}`);
		}).finally(() => {
			pendingKeys.delete(identity.key);
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
		seenAudioAsVoice ||= Boolean(payload.audioAsVoice);
		if (!isAudioPayload?.(payload)) return false;
		const payloadKey = createBlockReplyPayloadKey(payload);
		if (hasSeenOrQueuedPayloadKey(payloadKey)) return true;
		seenKeys.add(payloadKey);
		bufferedPayloads.push(payload);
		return true;
	};
	const flushBuffered = () => {
		for (const payload of bufferedPayloads) {
			const finalPayload = seenAudioAsVoice ? copyReplyPayloadMetadata(payload, {
				...payload,
				audioAsVoice: true
			}) : payload;
			sendPayload(finalPayload, true);
		}
		bufferedPayloads.length = 0;
	};
	const enqueueCoalescedPayload = (payload) => {
		if (!coalescer) return;
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		if (assistantMessageIndex !== void 0 && bufferedAssistantMessageIndex !== void 0 && assistantMessageIndex !== bufferedAssistantMessageIndex && coalescer.hasBuffered()) flushBufferedAssistantBlock();
		const payloadKey = createBlockReplyPayloadKey(payload);
		const identity = resolveDedupeIdentity(payload, payloadKey);
		if (!identity.unkeyedSource && hasSeenOrQueuedPayloadKey(identity.key)) return;
		if (!identity.unkeyedSource) seenKeys.add(identity.key);
		if (identity.occurrenceKey) seenKeys.add(payloadKey);
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
		const hasNonTextContent = hasOutboundReplyContent({
			...payload,
			text: void 0,
			mediaUrl: void 0,
			mediaUrls: void 0
		}, { trimText: true });
		if (coalescer && !hasNonTextContent) {
			enqueueCoalescedPayload(payload);
			return;
		}
		coalescer?.flush({ force: true });
		sendPayload(payload, false);
	};
	const flush = async (options) => {
		await coalescer?.flush(options);
		bufferedAssistantMessageIndex = void 0;
		flushBuffered();
		await sendChain;
	};
	const matchingTerminalAttempts = function* (payload) {
		const index = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		if (index === void 0) {
			for (const attempts of blockAttemptsByMessage.values()) yield attempts.filter((attempt) => attempt.terminal);
			return;
		}
		const start = blockAttemptsByMessage.get(index)?.[0]?.messageStart ?? index;
		for (let item = index, run = []; item >= start; item--) {
			const attempts = blockAttemptsByMessage.get(item);
			if (attempts?.length) {
				run = [...attempts.filter((attempt) => attempt.terminal), ...run];
				yield run;
			}
		}
	};
	const normalizeSource = (text) => text.replace(/\s+/g, "");
	const combinedSource = (attempts) => normalizeSource(attempts.map((attempt) => attempt.sourceText).join(""));
	const hasAttempt = (predicate, minimumAssistantMessageIndex) => {
		for (const [index, attempts] of blockAttemptsByMessage) if ((minimumAssistantMessageIndex === void 0 || (index ?? 0) >= minimumAssistantMessageIndex) && attempts.some(predicate)) return true;
		return false;
	};
	return {
		enqueue,
		flush,
		stop: () => coalescer?.stop(),
		hasBuffered: () => coalescer?.hasBuffered() || bufferedPayloads.length > 0,
		didStream: () => didStream,
		didStreamTerminalReply: (minimumAssistantMessageIndex = 0) => hasAttempt((attempt) => attempt.terminalDeliveryConfirmed === true, minimumAssistantMessageIndex),
		isAborted: () => aborted,
		hasSentExactPayload: (payload) => sentContentKeys.has(createIndexedBlockReplyContentKey(payload)),
		getSourceRecovery: (payload) => {
			const text = normalizeSource(resolveSendableOutboundReplyParts(payload).trimmedText);
			for (const attempts of matchingTerminalAttempts(payload)) if (text && combinedSource(attempts) === text && attempts.some((attempt) => attempt.source?.complete === false)) return Array.from(new Set(attempts.flatMap((attempt) => attempt.source ?? [])));
		},
		isFinalPayloadRetryBlocked: (payload) => {
			const contentKey = createBlockReplyContentKey(payload);
			const reply = resolveSendableOutboundReplyParts(payload);
			const text = normalizeSource(reply.trimmedText);
			const textOnly = !hasOutboundReplyContent({
				...payload,
				text: void 0
			});
			for (const attempts of matchingTerminalAttempts(payload)) {
				const blocked = attempts.filter(hasBlockReplyDeliveryCustody);
				const sourcePrefix = combinedSource(attempts);
				if (blocked.some((attempt) => attempt.contentKey === contentKey) || textOnly && blocked.length > 0 && sourcePrefix.length > 0 && text.startsWith(sourcePrefix)) return true;
			}
			return false;
		},
		hasSentPayload: (payload) => {
			const payloadKey = createIndexedBlockReplyContentKey(payload);
			if (sentContentKeys.has(payloadKey)) return true;
			if (!didStream) return false;
			const reply = resolveSendableOutboundReplyParts(payload);
			if (reply.hasMedia || !reply.trimmedText) return false;
			const sourceText = normalizeSource(reply.trimmedText);
			for (const group of matchingTerminalAttempts(payload)) {
				const attempts = group.filter((attempt) => attempt.outcome === "delivered" && !attempt.pending && attempt.source?.complete !== false);
				if (attempts.length > 0 && combinedSource(attempts) === sourceText) return true;
			}
			return false;
		},
		getSentMediaUrls: () => Array.from(sentMediaUrls),
		hasRetryBlockedDelivery: () => hasAttempt(hasBlockReplyDeliveryCustody),
		hasRetryBlockedTerminalDelivery: (minimumAssistantMessageIndex = 0) => hasAttempt((attempt) => attempt.terminal && hasBlockReplyDeliveryCustody(attempt), minimumAssistantMessageIndex),
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
		preparedTtsPreferences: params.preparedTtsPreferences,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	const ttsPayload = await maybeApplyTtsToPayload(params);
	return ttsPayload === params.payload ? ttsPayload : copyReplyPayloadMetadata(params.payload, ttsPayload);
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
export { recoverBlockReplySources as _, hasAskUserPayload as a, maybeApplyTtsToReplyPayload as c, shouldDeliverDespiteSourceReplySuppression as d, createBlockReplyContentKey as f, hasBlockReplyDeliveryCustody as g, deliverBlockReply as h, formatSuppressedReplyPayloadForLog as i, prepareReplyPayloadForSideEffects as l, createBlockReplySource as m, buildNoVisibleReplyFallbackText as n, hasExecApprovalPayload as o, createBlockReplyPipeline as p, createFinalDispatchPayloadDedupeKey as r, hasExecApprovalUnavailablePayload as s, QUEUE_CAP_REJECTION_TEXT as t, requiresDurableToolResultDelivery as u, setBlockReplyDelivery as v };
