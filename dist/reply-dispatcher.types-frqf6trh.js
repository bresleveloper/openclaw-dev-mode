import { v as sleep } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata } from "./reply-payload-HLWc9ssO.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-Zsy11rTo.js";
import { r as generateSecureInt } from "./secure-random-Ds4AFLgz.js";
import { t as normalizeReplyPayload } from "./normalize-reply-CZRULv1j.js";
import { n as registerDispatcher } from "./dispatcher-registry-CaTZukRA.js";
//#region src/auto-reply/reply/reply-dispatcher.ts
const DEFAULT_HUMAN_DELAY_MIN_MS = 800;
const DEFAULT_HUMAN_DELAY_MAX_MS = 2500;
const silentReplyLogger = createSubsystemLogger("silent-reply/dispatcher");
function buildReplyDispatchRuntimeInfo(payload, kind) {
	const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
	return {
		kind,
		...assistantMessageIndex !== void 0 ? { assistantMessageIndex } : {}
	};
}
/** Generate a random delay within the configured range. */
function getHumanDelay(config) {
	const mode = config?.mode ?? "off";
	if (mode === "off") return 0;
	const min = mode === "custom" ? config?.minMs ?? DEFAULT_HUMAN_DELAY_MIN_MS : DEFAULT_HUMAN_DELAY_MIN_MS;
	const max = mode === "custom" ? config?.maxMs ?? DEFAULT_HUMAN_DELAY_MAX_MS : DEFAULT_HUMAN_DELAY_MAX_MS;
	if (max <= min) return min;
	return min + generateSecureInt(max - min + 1);
}
function getHumanDelayMax(config) {
	const mode = config?.mode ?? "off";
	if (mode === "off") return 0;
	const min = mode === "custom" ? config?.minMs ?? DEFAULT_HUMAN_DELAY_MIN_MS : DEFAULT_HUMAN_DELAY_MIN_MS;
	const max = mode === "custom" ? config?.maxMs ?? DEFAULT_HUMAN_DELAY_MAX_MS : DEFAULT_HUMAN_DELAY_MAX_MS;
	return max <= min ? min : max;
}
function normalizeReplyPayloadInternal(payload, opts) {
	const prefixContext = opts.responsePrefixContextProvider?.() ?? opts.responsePrefixContext;
	return normalizeReplyPayload(payload, {
		responsePrefix: opts.responsePrefix,
		responsePrefixContext: prefixContext,
		onHeartbeatStrip: opts.onHeartbeatStrip,
		transformReplyPayload: opts.transformReplyPayload,
		onSkip: opts.onSkip
	});
}
function createReplyDispatcher(options) {
	let beforeDeliver = options.beforeDeliver;
	let sendChain = Promise.resolve();
	let pending = 1;
	let completeCalled = false;
	let sentFirstBlock = false;
	const queuedCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const failedCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const cancelledCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const { unregister } = registerDispatcher({
		pending: () => pending,
		waitForIdle: () => sendChain
	});
	const enqueue = (kind, payload) => {
		const originalWasExactSilent = isSilentReplyText(payload.text, SILENT_REPLY_TOKEN);
		const normalized = normalizeReplyPayloadInternal(payload, {
			responsePrefix: options.responsePrefix,
			responsePrefixContext: options.responsePrefixContext,
			responsePrefixContextProvider: options.responsePrefixContextProvider,
			transformReplyPayload: options.transformReplyPayload,
			onHeartbeatStrip: options.onHeartbeatStrip,
			onSkip: (reason) => options.onSkip?.(payload, {
				...buildReplyDispatchRuntimeInfo(payload, kind),
				reason
			})
		});
		if (!normalized) {
			if (kind === "final" && originalWasExactSilent) silentReplyLogger.debug("exact NO_REPLY final payload was skipped before delivery", {
				hasSessionKey: Boolean(options.silentReplyContext?.sessionKey),
				surface: options.silentReplyContext?.surface,
				conversationType: options.silentReplyContext?.conversationType
			});
			return false;
		}
		queuedCounts[kind] += 1;
		pending += 1;
		const shouldDelay = kind === "block" && sentFirstBlock;
		if (kind === "block") sentFirstBlock = true;
		sendChain = sendChain.then(async () => {
			if (shouldDelay) {
				const delayMs = getHumanDelay(options.humanDelay);
				if (delayMs > 0) await sleep(delayMs);
			}
			const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
			let deliverPayload = normalized;
			if (beforeDeliver) {
				try {
					deliverPayload = await beforeDeliver(normalized, dispatchInfo);
				} catch (err) {
					try {
						await options.onBeforeDeliverCancelled?.(normalized, dispatchInfo);
					} catch (cancelErr) {
						options.onError?.(cancelErr, dispatchInfo);
					}
					throw err;
				}
				if (!deliverPayload) {
					cancelledCounts[kind] += 1;
					try {
						await options.onBeforeDeliverCancelled?.(normalized, dispatchInfo);
					} catch (err) {
						options.onError?.(err, dispatchInfo);
					}
					return;
				}
				deliverPayload = copyReplyPayloadMetadata(normalized, deliverPayload);
			}
			await options.deliver(deliverPayload, dispatchInfo);
		}).catch((err) => {
			failedCounts[kind] += 1;
			options.onError?.(err, buildReplyDispatchRuntimeInfo(normalized, kind));
		}).finally(() => {
			const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
			try {
				options.onDeliverySettled?.(dispatchInfo);
			} catch (err) {
				options.onError?.(err, dispatchInfo);
			}
			pending -= 1;
			if (pending === 1 && completeCalled) pending -= 1;
			if (pending === 0) {
				unregister();
				options.onIdle?.();
			}
		});
		return true;
	};
	const markComplete = () => {
		if (completeCalled) return;
		completeCalled = true;
		Promise.resolve().then(() => {
			if (pending === 1 && completeCalled) {
				pending -= 1;
				if (pending === 0) {
					unregister();
					options.onIdle?.();
				}
			}
		});
	};
	return {
		sendToolResult: (payload) => enqueue("tool", payload),
		sendBlockReply: (payload) => enqueue("block", payload),
		sendFinalReply: (payload) => enqueue("final", payload),
		appendBeforeDeliver: (hook) => {
			const previousBeforeDeliver = beforeDeliver;
			beforeDeliver = previousBeforeDeliver ? async (payload, info) => {
				const previousPayload = await previousBeforeDeliver(payload, info);
				return previousPayload ? hook(copyReplyPayloadMetadata(payload, previousPayload), info) : null;
			} : hook;
		},
		waitForIdle: () => sendChain,
		getQueuedCounts: () => ({ ...queuedCounts }),
		getCancelledCounts: () => ({ ...cancelledCounts }),
		getFailedCounts: () => ({ ...failedCounts }),
		markComplete,
		resolveFollowupAdmissionBarrierTimeoutPolicy: options.resolveFollowupAdmissionBarrierTimeoutPolicy ? () => options.resolveFollowupAdmissionBarrierTimeoutPolicy?.({
			queuedCounts: { ...queuedCounts },
			humanDelayBudgetMs: Math.max(0, queuedCounts.block - 1) * getHumanDelayMax(options.humanDelay)
		}) : void 0
	};
}
async function waitForReplyDispatcherIdle(dispatcher, abortSignal) {
	if (!abortSignal) {
		await dispatcher.waitForIdle();
		return;
	}
	if (abortSignal.aborted) return;
	let removeAbortListener;
	const aborted = new Promise((resolve) => {
		const onAbort = () => resolve();
		abortSignal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
	});
	try {
		await Promise.race([dispatcher.waitForIdle(), aborted]);
	} finally {
		removeAbortListener?.();
	}
}
function createReplyDispatcherWithTyping(options) {
	const { typingCallbacks, onReplyStart, onIdle, onSettled: _onSettled, onFreshSettledDelivery: _onFreshSettledDelivery, onCleanup, ...dispatcherOptions } = options;
	const resolvedOnReplyStart = onReplyStart ?? typingCallbacks?.onReplyStart;
	const resolvedOnIdle = onIdle ?? typingCallbacks?.onIdle;
	const resolvedOnCleanup = onCleanup ?? typingCallbacks?.onCleanup;
	let typingController;
	return {
		dispatcher: createReplyDispatcher({
			...dispatcherOptions,
			onIdle: () => {
				typingController?.markDispatchIdle();
				return resolvedOnIdle?.();
			}
		}),
		replyOptions: {
			onReplyStart: resolvedOnReplyStart,
			onTypingCleanup: resolvedOnCleanup,
			onTypingController: (typing) => {
				typingController = typing;
			}
		},
		markDispatchIdle: () => {
			typingController?.markDispatchIdle();
			resolvedOnIdle?.();
		},
		markRunComplete: () => {
			typingController?.markRunComplete();
		}
	};
}
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.types.ts
function readDispatcherFailedCounts(dispatcher) {
	return dispatcher.getFailedCounts?.() ?? {
		tool: 0,
		block: 0,
		final: 0
	};
}
//#endregion
export { waitForReplyDispatcherIdle as i, createReplyDispatcher as n, createReplyDispatcherWithTyping as r, readDispatcherFailedCounts as t };
