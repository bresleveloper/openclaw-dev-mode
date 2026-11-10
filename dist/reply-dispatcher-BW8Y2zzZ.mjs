import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as generateSecureInt } from "./secure-random-DxCgeORs.mjs";
import { D as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { c as getGroupThreadParticipant } from "./group-thread-context-pdg_twmg.mjs";
import { r as recordReplyPayloadMediaSelectionChange, t as collectReplyMediaEntries } from "./reply-media-entries-B41MzEkm.mjs";
import { n as registerDispatcher } from "./dispatcher-registry-CPznLgPI.mjs";
import { d as resolveDeliveryNotSentRetryability, s as isDeliveryRecoveryOwnedRetry, u as isRetryableDeliveryNotSentError } from "./delivery-recovery.shared-BD9P01Ce.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-CZkv8Yff.mjs";
import { o as settlePendingFinalDelivery } from "./delivery-completion-4GBUPDR3.mjs";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply-Bw7WQh_g.mjs";
//#region src/auto-reply/reply/dispatch-from-config.pending-final.ts
const terminalReceipts = resolveGlobalSingleton(Symbol.for("openclaw.pendingFinalDeliveryReceipts"), () => /* @__PURE__ */ new WeakMap());
/** Channel settlement and dispatcher cleanup share the same committed receipt. */
async function settleReplyPendingFinalDelivery(payload, state, expectedStates) {
	const metadata = getReplyPayloadMetadata(payload);
	const completion = metadata?.pendingFinalDeliveryCompletion;
	if (!completion) return;
	const cleanup = metadata.pendingFinalDeliveryCleanup;
	const terminal = state === "delivered" || state === "suppressed";
	const receipt = terminalReceipts.get(completion);
	if (receipt && (!terminal || !cleanup || receipt.cleared)) return { state: receipt.state };
	const result = await settlePendingFinalDelivery({
		kind: "pending-final",
		...completion
	}, state, expectedStates, terminal && cleanup ? {
		preserveActivity: cleanup.preserveActivity,
		clearAfterSettled: { recoveryRunId: completion.recoveryRunId }
	} : void 0);
	if (result.state === "delivered" || result.state === "suppressed") terminalReceipts.set(completion, {
		state: result.state,
		cleared: terminal && Boolean(cleanup)
	});
	return result;
}
async function suppressPendingFinalDelivery(payload, options = {}) {
	const completion = payload ? getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion : void 0;
	if (completion) await settlePendingFinalDelivery({
		kind: "pending-final",
		...completion
	}, "suppressed", ["prepared"], {
		...options,
		clearAfterSettled: { recoveryRunId: completion.recoveryRunId }
	});
}
async function clearPendingFinalDeliveryAfterSuccess(identity, options = {}) {
	if (!identity) return;
	await applySessionEntryOperation({
		agentId: identity.agentId,
		storePath: identity.storePath,
		sessionKey: identity.sessionKey
	}, {
		kind: "pending-final-clear",
		sessionId: identity.sessionId,
		intentId: identity.intentId,
		recoveryRunId: identity.recoveryRunId,
		now: Date.now()
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		preserveActivity: options.preserveActivity,
		workerGuard: {}
	});
}
//#endregion
//#region src/auto-reply/reply/reply-dispatch-before-deliver.ts
const DEFAULT_BEFORE_DELIVER_TIMEOUT_MS = 15e3;
const stagesByHook = /* @__PURE__ */ new WeakMap();
function resolveTimeoutMs(options) {
	const timeoutMs = options?.timeoutMs ?? 15e3;
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError("beforeDeliver timeoutMs must be a positive finite number");
	return timeoutMs;
}
async function runReplyDispatchBeforeDeliverStage(stage, payload, info) {
	if (!stage.timeoutMs) return await stage.hook(payload, info);
	return await raceWithTimeout(() => Promise.resolve(stage.hook(payload, info)), stage.timeoutMs, () => {
		throw new Error(`beforeDeliver timed out after ${stage.timeoutMs}ms`);
	}, { ref: false });
}
function resolveStages(input) {
	if (!input) return [];
	const hook = typeof input === "function" ? input : input.hook;
	return stagesByHook.get(hook) ?? [{
		hook,
		timeoutMs: resolveTimeoutMs(typeof input === "function" ? void 0 : input.options)
	}];
}
function composeReplyDispatchBeforeDeliver(...hooks) {
	const stages = hooks.flatMap(resolveStages);
	if (stages.length === 0) return;
	const composed = async (payload, info) => {
		let current = payload;
		for (const stage of stages) {
			const previousMediaUrls = collectReplyMediaEntries(current).map(({ url }) => url);
			const next = await runReplyDispatchBeforeDeliverStage(stage, current, info);
			if (!next) return null;
			current = recordReplyPayloadMediaSelectionChange(previousMediaUrls, copyReplyPayloadMetadata(current, next));
		}
		return current;
	};
	stagesByHook.set(composed, stages);
	return composed;
}
function markReplyDispatchBeforeDeliverDeadlineOwned(hook) {
	stagesByHook.set(hook, [{ hook }]);
	return hook;
}
//#endregion
//#region src/auto-reply/reply/reply-dispatch-delay.ts
const DEFAULT_RANGE = {
	min: 800,
	max: 2500
};
function resolveHumanDelayRange(config) {
	if (!config?.mode || config.mode === "off") return;
	return config.mode === "custom" ? {
		min: config.minMs ?? DEFAULT_RANGE.min,
		max: config.maxMs ?? DEFAULT_RANGE.max
	} : DEFAULT_RANGE;
}
function getHumanDelay(config) {
	const range = resolveHumanDelayRange(config);
	if (!range || range.max <= range.min) return range?.min ?? 0;
	return range.min + generateSecureInt(range.max - range.min + 1);
}
function getHumanDelayMax(config) {
	const range = resolveHumanDelayRange(config);
	return range ? Math.max(range.min, range.max) : 0;
}
//#endregion
//#region src/auto-reply/reply/reply-dispatch-outcome.ts
const REPLY_DISPATCH_DELIVERY_ERROR_CODE = "REPLY_DISPATCH_DELIVERY_ERROR";
const REPLY_DISPATCH_OUTCOME_COUNTS = {
	delivered: "delivered",
	"delivered-not-visible": "deliveredNotVisible",
	"channel-transform": "deliveredNotVisible",
	cancelled: "cancelled",
	"failed-before-deliver": "failedBeforeSend",
	"recovery-owned": "failedBeforeSend",
	"failed-deliver": "failedAfterSend"
};
var ReplyDispatchDeliveryError = class extends Error {
	constructor(outcome) {
		super("queued reply delivery failed");
		this.outcome = outcome;
		this.code = REPLY_DISPATCH_DELIVERY_ERROR_CODE;
		this.name = "ReplyDispatchDeliveryError";
	}
};
function isReplyDispatchDeliveryError(error) {
	return isRecord(error) && error.code === REPLY_DISPATCH_DELIVERY_ERROR_CODE && typeof error.outcome === "string" && Object.hasOwn(REPLY_DISPATCH_OUTCOME_COUNTS, error.outcome);
}
function shouldRetryReplyDispatch(outcome) {
	return outcome === "delivered-not-visible" || outcome === "cancelled" || outcome === "failed-before-deliver";
}
/** Identityless completion proves ambiguity, not queue custody or an intentional no-send. */
function isReplyDispatchDeliveryPending(result) {
	return isRecord(result) && isRecord(result.suppression) && result.suppression.reason === "adapter_returned_no_identity";
}
function resolveReplyDispatchDeliveryOutcome(result) {
	if (isReplyDispatchDeliveryPending(result)) return "delivered-not-visible";
	if (isRecord(result) && result.ambiguous === true) return "failed-deliver";
	if (!isRecord(result) || result.visibleReplySent !== false) return "delivered";
	return isRecord(result.suppression) && result.suppression.reason === "channel_transform" ? "channel-transform" : "delivered-not-visible";
}
function createReplyDispatchSettledCounts() {
	return {
		delivered: 0,
		deliveredNotVisible: 0,
		cancelled: 0,
		failedBeforeSend: 0,
		failedAfterSend: 0
	};
}
function resolveReplyDispatchErrorOutcome(error) {
	return isRetryableDeliveryNotSentError(error) ? isDeliveryRecoveryOwnedRetry(error) ? "recovery-owned" : "failed-before-deliver" : "failed-deliver";
}
function resolveRoutedReplyDeliveryOutcome(result) {
	if (result.ambiguous) return "failed-deliver";
	if (result.delivered) return "delivered";
	if (result.queueCustody === "held") return "recovery-owned";
	if (!result.ok) return resolveReplyDispatchErrorOutcome(result.cause);
	return result.reason === "channel_transform" ? "channel-transform" : "delivered-not-visible";
}
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.types.ts
function mapReplyDispatchCounts(counts, select) {
	return {
		tool: select(counts.tool),
		block: select(counts.block),
		final: select(counts.final)
	};
}
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.ts
/** Invoke immediately without letting observer failures interrupt delivery bookkeeping. */
function invokeReplyDispatcherObserver(observer, onError = () => void 0) {
	try {
		return Promise.resolve(observer()).catch(onError);
	} catch (error) {
		onError(error);
		return Promise.resolve();
	}
}
function replaceDispatchPayload(input, payload) {
	if (input.kind === "raw") return {
		kind: "raw",
		payload
	};
	const [plan] = createStructuredOutboundPayloadPlan([payload]);
	return plan ? {
		kind: "prepared",
		plan: {
			...plan,
			sourceIndex: input.plan.sourceIndex
		}
	} : null;
}
const silentReplyLogger = createSubsystemLogger("silent-reply/dispatcher");
const { deliveryOutcomeTrackers, undeliveredFallbacks, conversationContextsByDispatcher } = resolveGlobalSingleton(Symbol.for("openclaw.replyDispatcherState"), () => ({
	deliveryOutcomeTrackers: /* @__PURE__ */ new WeakMap(),
	undeliveredFallbacks: /* @__PURE__ */ new WeakMap(),
	conversationContextsByDispatcher: /* @__PURE__ */ new WeakMap()
}));
/** Associate this turn's finalized prompt with its exact dispatcher without changing the SDK. */
function bindReplyDispatcherConversationContext(dispatcher, conversationContext) {
	conversationContextsByDispatcher.set(dispatcher, conversationContext);
}
/** Capture one core-dispatcher delivery outcome without changing send* return types. */
function captureReplyDispatchDeliveryOutcome(payload) {
	let tracker = deliveryOutcomeTrackers.get(payload);
	if (!tracker) {
		tracker = {
			...createDeferredCore(),
			tracked: false,
			pending: false
		};
		deliveryOutcomeTrackers.set(payload, tracker);
	}
	return {
		promise: tracker.promise,
		isTracked: () => tracker.tracked,
		hasPendingDelivery: () => tracker.pending,
		getDeliveredPayload: () => tracker.deliveredPayload
	};
}
/** Attach a text alternative that is delivered only when the primary payload is proven unsent. */
function attachReplyDispatchUndeliveredFallback(payload, fallback) {
	undeliveredFallbacks.set(payload, fallback);
}
function buildReplyDispatchRuntimeInfo(payload, kind) {
	const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
	const participant = getGroupThreadParticipant();
	return {
		kind,
		...assistantMessageIndex !== void 0 ? { assistantMessageIndex } : {},
		...participant ? { participant } : {}
	};
}
/** Normalize through a dispatcher's exact owner before TTS or other visible side effects. */
function prepareReplyPayloadForDispatcher(dispatcher, kind, payload) {
	return dispatcher.prepareReplyPayload ? dispatcher.prepareReplyPayload(kind, payload) : {
		kind: "deliver",
		payload
	};
}
function createReplyDispatcher(options) {
	let beforeDeliver = composeReplyDispatchBeforeDeliver(options.beforeDeliver ? {
		hook: options.beforeDeliver,
		options: options.beforeDeliverOptions
	} : void 0);
	let pending = 1;
	let completeCalled = false;
	let sentFirstBlock = false;
	const queuedCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const settledCounts = mapReplyDispatchCounts(queuedCounts, createReplyDispatchSettledCounts);
	let retryableNoSendError;
	let hasPendingDelivery = false;
	let sendChain = Promise.resolve();
	let settlementChain = Promise.resolve();
	let pendingFinalizations = 0;
	let idleNotified = false;
	const ignoreResult = () => void 0;
	const notifyIdle = () => {
		if (idleNotified) return;
		idleNotified = true;
		invokeReplyDispatcherObserver(() => options.onIdle?.());
	};
	const scheduleDelivery = (run) => {
		idleNotified = false;
		const delivery = sendChain.then(run);
		sendChain = delivery.then(ignoreResult, ignoreResult);
		const drained = sendChain;
		drained.then(() => drained === sendChain && pendingFinalizations > 0 && notifyIdle());
		return delivery;
	};
	const waitForIdle = async () => {
		let sent;
		let settled;
		do {
			sent = sendChain;
			settled = settlementChain;
			await Promise.all([sent, settled]);
		} while (sent !== sendChain || settled !== settlementChain);
	};
	const buildReceipt = () => ({
		counts: mapReplyDispatchCounts(settledCounts, (counts) => ({ ...counts })),
		anyVisibleDelivered: Object.values(settledCounts).some((counts) => counts.delivered > 0 || counts.failedAfterSend > 0),
		...hasPendingDelivery ? { hasPendingDelivery: true } : {}
	});
	const unregister = registerDispatcher(() => pending);
	const releasePending = () => {
		pending -= 1;
		if (pending === 1 && completeCalled) pending -= 1;
		if (pending === 0) {
			unregister();
			notifyIdle();
		}
	};
	const reportObserverError = (err, info) => {
		invokeReplyDispatcherObserver(() => options.onError?.(err, info));
	};
	const normalizeForDispatch = (kind, payload, notifySkip) => normalizeReplyPayloadOutcome(payload, {
		responsePrefix: options.responsePrefix,
		responsePrefixContext: options.responsePrefixContextProvider?.() ?? options.responsePrefixContext,
		transformReplyPayload: options.transformReplyPayload,
		conversationContext: conversationContextsByDispatcher.get(dispatcher),
		onHeartbeatStrip: options.onHeartbeatStrip,
		onSkip: notifySkip ? (reason) => options.onSkip?.(payload, {
			...buildReplyDispatchRuntimeInfo(payload, kind),
			reason
		}) : void 0
	});
	const notifyBeforeDeliverCancelled = async (payload, info) => {
		const observer = options.onBeforeDeliverCancelled;
		if (!observer) return;
		try {
			await runReplyDispatchBeforeDeliverStage({
				hook: async (current, currentInfo) => {
					await observer(current, currentInfo);
					return current;
				},
				timeoutMs: DEFAULT_BEFORE_DELIVER_TIMEOUT_MS
			}, payload, info);
		} catch (err) {
			reportObserverError(err, info);
		}
	};
	const deliverOnce = async (input, info) => {
		const payload = input.kind === "prepared" ? input.plan.payload : input.payload;
		let deliveryInput = input;
		let deliveryStarted = false;
		let pendingDelivery = false;
		const settleCustody = getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion && ((state, expectedStates = ["queued"]) => settleReplyPendingFinalDelivery(payload, state, expectedStates));
		const settleFailure = async (error) => {
			const retryableNoSend = isRetryableDeliveryNotSentError(error);
			const queueHeld = isDeliveryRecoveryOwnedRetry(error);
			pendingDelivery ||= queueHeld || deliveryStarted && !retryableNoSend && resolveDeliveryNotSentRetryability(error) !== false;
			hasPendingDelivery ||= pendingDelivery;
			const outcome = deliveryStarted ? resolveReplyDispatchErrorOutcome(error) : "failed-before-deliver";
			if (retryableNoSend) retryableNoSendError ??= toErrorObject(error, "reply delivery failed before dispatch");
			if (settleCustody && deliveryStarted && !queueHeld && options.pendingFinalDeliveryAdmission !== "deliver") await settleCustody(outcome === "failed-deliver" ? "unknown" : "prepared", outcome === "failed-deliver" ? ["queued"] : ["queued", "unknown"]);
			return outcome;
		};
		try {
			if (beforeDeliver) {
				const originalText = payload.text;
				let deliverPayload;
				try {
					deliverPayload = await beforeDeliver(payload, info);
				} catch (error) {
					await notifyBeforeDeliverCancelled(payload, info);
					throw error;
				}
				if (deliverPayload?.textMode === "delta" && deliverPayload.text !== originalText) {
					const { textMode: _textMode, ...snapshot } = deliverPayload;
					deliverPayload = snapshot;
				}
				deliveryInput = deliverPayload ? replaceDispatchPayload(input, copyReplyPayloadMetadata(payload, deliverPayload)) : null;
				if (!deliveryInput && settleCustody) await settleCustody("suppressed", ["prepared"]);
			}
			if (deliveryInput && settleCustody && options.pendingFinalDeliveryAdmission !== "deliver") {
				if ((await settleCustody("queued", ["prepared"]))?.state !== "queued") deliveryInput = null;
			}
			if (!deliveryInput) {
				await notifyBeforeDeliverCancelled(payload, info);
				return { settlement: Promise.resolve("cancelled") };
			}
			deliveryStarted = true;
			const deliveredPayload = deliveryInput.kind === "prepared" ? deliveryInput.plan.payload : deliveryInput.payload;
			const continuation = info.kind === "final" ? getReplyPayloadMetadata(deliveredPayload)?.progressContinuation : void 0;
			const deliveryInfo = continuation ? {
				...info,
				adoptProgressDraft: continuation.adopt
			} : info;
			const result = deliveryInput.kind === "prepared" && options.deliverPrepared ? await options.deliverPrepared(deliveryInput.plan, deliveryInfo) : await options.deliver(deliveredPayload, deliveryInfo);
			const finalization = isRecord(result) && result.finalization instanceof Promise ? result.finalization : void 0;
			pendingFinalizations += finalization ? 1 : 0;
			return {
				payload: deliveredPayload,
				deferred: Boolean(finalization),
				get pendingDelivery() {
					return pendingDelivery;
				},
				settlement: (async () => {
					try {
						const finalized = finalization ? await finalization : void 0;
						const settledResult = finalization && isRecord(result) && isRecord(finalized) ? {
							...result,
							...finalized,
							finalization: void 0
						} : result;
						const outcome = resolveReplyDispatchDeliveryOutcome(settledResult);
						pendingDelivery = isReplyDispatchDeliveryPending(settledResult);
						hasPendingDelivery ||= pendingDelivery;
						await settleCustody?.(pendingDelivery || outcome === "failed-deliver" ? "unknown" : outcome === "channel-transform" ? "suppressed" : "delivered");
						return outcome;
					} catch (error) {
						return await settleFailure(error);
					} finally {
						pendingFinalizations -= finalization ? 1 : 0;
					}
				})()
			};
		} catch (error) {
			const outcome = await settleFailure(error);
			await invokeReplyDispatcherObserver(() => options.onError?.(error, info));
			return {
				settlement: Promise.resolve(outcome),
				pendingDelivery
			};
		}
	};
	const enqueue = (kind, input) => {
		const payload = input.kind === "prepared" ? input.plan.payload : input.payload;
		const deliveryOutcomeTracker = deliveryOutcomeTrackers.get(payload);
		deliveryOutcomeTrackers.delete(payload);
		const fallback = undeliveredFallbacks.get(payload);
		undeliveredFallbacks.delete(payload);
		const originalWasExactSilent = isSilentReplyText(payload.text, SILENT_REPLY_TOKEN);
		const normalizedPrimary = getReplyPayloadMetadata(payload)?.replyDispatcherNormalizationOwner === dispatcher ? {
			kind: "deliver",
			payload
		} : normalizeForDispatch(kind, payload, true);
		const normalizedFallback = fallback && !(normalizedPrimary.kind === "suppress" && normalizedPrimary.reason === "channel_transform") ? normalizeForDispatch(kind, fallback, false) : void 0;
		const normalized = normalizedPrimary.kind === "deliver" ? normalizedPrimary.payload : normalizedFallback?.kind === "deliver" ? normalizedFallback.payload : null;
		const normalizedInput = normalized ? replaceDispatchPayload(input, normalized) : null;
		if (!normalizedInput) {
			if (kind === "final" && originalWasExactSilent) silentReplyLogger.debug("exact NO_REPLY final payload was skipped before delivery", {
				hasSessionKey: Boolean(options.silentReplyContext?.sessionKey),
				surface: options.silentReplyContext?.surface,
				conversationType: options.silentReplyContext?.conversationType
			});
			return false;
		}
		let deliveryFallback = normalizedPrimary.kind === "deliver" && normalizedFallback?.kind === "deliver" ? replaceDispatchPayload(input, normalizedFallback.payload) : null;
		queuedCounts[kind] += 1;
		pending += 1;
		if (deliveryOutcomeTracker) deliveryOutcomeTracker.tracked = true;
		const shouldDelay = kind === "block" && sentFirstBlock;
		if (kind === "block") sentFirstBlock = true;
		let deliveryOutcome = "failed-before-deliver";
		const dispatchInfo = buildReplyDispatchRuntimeInfo(normalizedInput.kind === "prepared" ? normalizedInput.plan.payload : normalizedInput.payload, kind);
		const delivery = scheduleDelivery(async () => {
			if (shouldDelay) {
				const delayMs = getHumanDelay(options.humanDelay);
				if (delayMs > 0) await sleep(delayMs);
			}
			const attempt = await deliverOnce(normalizedInput, dispatchInfo);
			if (deliveryFallback && !attempt.deferred && shouldRetryReplyDispatch(await attempt.settlement) && !attempt.pendingDelivery) {
				const fallbackInput = deliveryFallback;
				deliveryFallback = null;
				return await deliverOnce(fallbackInput, dispatchInfo);
			}
			return attempt;
		});
		settlementChain = settlementChain.then(async () => {
			let attempt;
			try {
				attempt = await delivery;
				deliveryOutcome = await attempt.settlement;
				if (deliveryFallback && !attempt.pendingDelivery && shouldRetryReplyDispatch(deliveryOutcome)) {
					const fallbackInput = deliveryFallback;
					attempt = await scheduleDelivery(() => deliverOnce(fallbackInput, dispatchInfo));
					deliveryOutcome = await attempt.settlement;
				}
				settledCounts[kind][REPLY_DISPATCH_OUTCOME_COUNTS[deliveryOutcome]] += 1;
			} catch (err) {
				settledCounts[kind].failedBeforeSend += 1;
				await invokeReplyDispatcherObserver(() => options.onError?.(err, dispatchInfo));
				deliveryOutcome = "failed-before-deliver";
			} finally {
				if (deliveryOutcomeTracker) {
					deliveryOutcomeTracker.pending = attempt?.pendingDelivery === true;
					deliveryOutcomeTracker.deliveredPayload = deliveryOutcome === "delivered" ? attempt?.payload : void 0;
					deliveryOutcomeTracker.resolve(deliveryOutcome);
				}
				invokeReplyDispatcherObserver(() => options.onDeliverySettled?.(dispatchInfo), (error) => reportObserverError(error, dispatchInfo));
				releasePending();
			}
		});
		return true;
	};
	const markComplete = () => {
		if (completeCalled) return;
		completeCalled = true;
		Promise.resolve().then(() => {
			if (pending === 1) releasePending();
		});
	};
	const dispatcher = {
		prepareReplyPayload: (kind, payload) => {
			const outcome = normalizeForDispatch(kind, payload, true);
			return outcome.kind === "deliver" ? {
				kind: "deliver",
				payload: setReplyPayloadMetadata(outcome.payload, { replyDispatcherNormalizationOwner: dispatcher })
			} : outcome;
		},
		sendToolResult: (payload) => enqueue("tool", {
			kind: "raw",
			payload
		}),
		sendBlockReply: (payload) => enqueue("block", {
			kind: "raw",
			payload
		}),
		sendFinalReply: (payload) => enqueue("final", {
			kind: "raw",
			payload
		}),
		sendPreparedReply: (kind, plan) => enqueue(kind, {
			kind: "prepared",
			plan
		}),
		appendBeforeDeliver: (hook, stageOptions) => {
			beforeDeliver = composeReplyDispatchBeforeDeliver(beforeDeliver, {
				hook,
				options: stageOptions
			});
		},
		supportsSettledReceipt: true,
		waitForIdle: async () => {
			await waitForIdle();
			const receipt = buildReceipt();
			if (options.propagateRetryableNoSendFailure === true && !hasPendingDelivery && !receipt.anyVisibleDelivered && retryableNoSendError !== void 0) throw retryableNoSendError;
			return receipt;
		},
		getQueuedCounts: () => ({ ...queuedCounts }),
		getCancelledCounts: () => mapReplyDispatchCounts(settledCounts, (counts) => counts.cancelled),
		getFailedCounts: () => mapReplyDispatchCounts(settledCounts, (counts) => counts.failedBeforeSend + counts.failedAfterSend),
		markComplete,
		resolveFollowupAdmissionBarrierTimeoutPolicy: options.resolveFollowupAdmissionBarrierTimeoutPolicy ? () => options.resolveFollowupAdmissionBarrierTimeoutPolicy?.({
			queuedCounts: { ...queuedCounts },
			humanDelayBudgetMs: Math.max(0, queuedCounts.block - 1) * getHumanDelayMax(options.humanDelay)
		}) : void 0
	};
	return dispatcher;
}
async function waitForReplyDispatcherIdle(dispatcher, abortSignal) {
	if (!abortSignal) return await dispatcher.waitForIdle() || void 0;
	if (abortSignal.aborted) return;
	const aborted = createDeferredCore();
	const onAbort = () => aborted.resolve(void 0);
	abortSignal.addEventListener("abort", onAbort, { once: true });
	try {
		return await Promise.race([dispatcher.waitForIdle(), aborted.promise]) || void 0;
	} finally {
		abortSignal.removeEventListener("abort", onAbort);
	}
}
function createReplyDispatcherWithTyping(options) {
	const { typingCallbacks, onReplyStart, onIdle, onSettled, onFreshSettledDelivery: _onFreshSettledDelivery, onCleanup, ...dispatcherOptions } = options;
	const resolvedOnReplyStart = onReplyStart ?? typingCallbacks?.onReplyStart;
	const resolvedOnIdle = onIdle ?? typingCallbacks?.onIdle;
	const resolvedOnCleanup = onCleanup ?? typingCallbacks?.onCleanup;
	let typingController;
	return {
		dispatcher: createReplyDispatcher({
			...dispatcherOptions,
			onIdle: async () => {
				typingController?.markDispatchIdle();
				const idle = resolvedOnIdle?.();
				if (idle) await Promise.resolve(idle);
				await onSettled?.();
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
export { composeReplyDispatchBeforeDeliver as _, createReplyDispatcherWithTyping as a, settleReplyPendingFinalDelivery as b, mapReplyDispatchCounts as c, createReplyDispatchSettledCounts as d, isReplyDispatchDeliveryError as f, shouldRetryReplyDispatch as g, resolveRoutedReplyDeliveryOutcome as h, createReplyDispatcher as i, REPLY_DISPATCH_OUTCOME_COUNTS as l, resolveReplyDispatchErrorOutcome as m, bindReplyDispatcherConversationContext as n, prepareReplyPayloadForDispatcher as o, isReplyDispatchDeliveryPending as p, captureReplyDispatchDeliveryOutcome as r, waitForReplyDispatcherIdle as s, attachReplyDispatchUndeliveredFallback as t, ReplyDispatchDeliveryError as u, markReplyDispatchBeforeDeliverDeadlineOwned as v, suppressPendingFinalDelivery as x, clearPendingFinalDeliveryAfterSuccess as y };
