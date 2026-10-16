import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { n as resolveGlobalDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-BIxMkFzo.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { H as extractTextFromChatContent } from "./user-facing-text-DC1sCo4O.mjs";
import { a as logMessageQueuedWithBacklogPolicy } from "./diagnostic-runtime-Clvsorku.mjs";
import { t as resolveQueueSettingsCore } from "./settings-DJWifhdm.mjs";
import { f as completeFollowupRunLifecycle, g as applyQueueDropPolicy, n as FOLLOWUP_QUEUES, o as getExistingFollowupQueue, p as markFollowupRunEnqueued, s as getFollowupQueue, u as trimSummaryElisionsToCap, y as countPendingQueueItems } from "./state-C3aKakvf.mjs";
import { a as rememberFollowupDrainCallback, c as isFollowupRunAborted, d as createOverflowSummaryRetrySource, f as resolveFollowupAuthorizationKey, l as resolveFollowupAbortSignal, n as dropAbortedFollowups, p as resolveFollowupDeliveryContextKey, r as kickFollowupDrainIfIdle, t as clearFollowupDrainCallback } from "./drain-DzWe8OCf.mjs";
//#region src/auto-reply/reply/queue/recent-message-ids.ts
/**
* Keep queued message-id dedupe shared across bundled chunks so redeliveries
* are rejected no matter which chunk receives the enqueue call.
*/
const RECENT_QUEUE_MESSAGE_IDS = resolveGlobalDedupeCache(Symbol.for("openclaw.recentQueueMessageIdOwners"), {
	ttlMs: 3e5,
	maxSize: 1e4
});
function peekRecentQueueMessageId(key, now = Date.now()) {
	return RECENT_QUEUE_MESSAGE_IDS.peek(key, now);
}
function recordRecentQueueMessageId(run, key, now = Date.now()) {
	const ownerToken = {};
	RECENT_QUEUE_MESSAGE_IDS.delete(key);
	RECENT_QUEUE_MESSAGE_IDS.check(key, now, ownerToken);
	const lifecycle = run.turnAdoptionLifecycle;
	if (lifecycle) {
		const onAbandoned = lifecycle.onAbandoned;
		lifecycle.onAbandoned = () => {
			RECENT_QUEUE_MESSAGE_IDS.delete(key, ownerToken);
			onAbandoned?.();
		};
	}
}
function resetRecentQueuedMessageIdDedupe() {
	RECENT_QUEUE_MESSAGE_IDS.clear();
}
//#endregion
//#region src/auto-reply/reply/queue/enqueue.ts
function followupMessageRouteIdentityKey(run) {
	return JSON.stringify([channelRouteDedupeKey({
		channel: run.originatingChannel,
		to: run.originatingTo,
		accountId: run.originatingAccountId,
		threadId: run.originatingThreadId
	}), normalizeChatType(run.originatingChatType) ?? ""]);
}
function buildRecentMessageIdKey(run, queueKey) {
	const messageId = normalizeOptionalString(run.messageId);
	if (!messageId) return;
	return JSON.stringify([
		"queue",
		queueKey,
		followupMessageRouteIdentityKey(run),
		messageId
	]);
}
function isRunAlreadyQueued(run, items) {
	const messageId = normalizeOptionalString(run.messageId);
	if (messageId) {
		const messageRouteKey = followupMessageRouteIdentityKey(run);
		return items.some((item) => normalizeOptionalString(item.messageId) === messageId && followupMessageRouteIdentityKey(item) === messageRouteKey);
	}
	return false;
}
function enqueueFollowupRun(key, run, settings, dedupeMode = "message-id", runFollowup, restartIfIdle = true, options = {}) {
	if (isFollowupRunAborted(run)) return false;
	if (options.position === "front") run.protectFromQueueOverflow = true;
	const recentMessageIdKey = dedupeMode !== "none" ? buildRecentMessageIdKey(run, key) : void 0;
	if (recentMessageIdKey && peekRecentQueueMessageId(recentMessageIdKey)) return false;
	const queue = getFollowupQueue(key, settings);
	if (dedupeMode !== "none" && isRunAlreadyQueued(run, queue.items)) return false;
	const deferOverflow = options.steerCandidate || queue.items.some((item) => item.steerPending);
	if (!deferOverflow && queue.dropPolicy === "new" && queue.cap > 0 && countPendingQueueItems(queue.items, queue.inFlight) >= queue.cap) {
		run.onQueueDisposition?.("queue-cap-new");
		completeFollowupRunLifecycle(run);
		return false;
	}
	if (!markFollowupRunEnqueued(run)) return false;
	if (deferOverflow) {
		if (options.steerCandidate) {
			const { promise: acceptance, resolve: settle } = createDeferredCore();
			run.steerPending = {
				phase: "waiting",
				predecessor: queue.steerAcceptanceTail,
				settle
			};
			queue.steerAcceptanceTail = queue.steerAcceptanceTail.then(() => acceptance);
		}
	} else if (!applyFollowupQueueOverflow(queue, run)) return false;
	const front = options.position === "front" && (!deferOverflow || options.steerCandidate === true);
	queue.lastEnqueuedAt = Date.now();
	queue.lastRun = run.run;
	run.queueAbortSignal = queue.abortController.signal;
	queue.items[front ? "unshift" : "push"](run);
	if (recentMessageIdKey) recordRecentQueueMessageId(run, recentMessageIdKey);
	if (runFollowup) rememberFollowupDrainCallback(key, runFollowup);
	const signal = resolveFollowupAbortSignal({
		abortSignal: run.abortSignal,
		operatorAuthority: run.operatorAuthority
	});
	const lifecycle = run.turnAdoptionLifecycle;
	if (signal && lifecycle && runFollowup) {
		const onAbort = () => {
			const currentQueue = getExistingFollowupQueue(key);
			if (currentQueue) dropAbortedFollowups(currentQueue, runFollowup).catch((error) => {
				defaultRuntime.error?.(`followup queue cancellation failed: ${String(error)}`);
			});
		};
		const onSettled = lifecycle.onSettled;
		lifecycle.onSettled = () => {
			signal.removeEventListener("abort", onAbort);
			onSettled?.();
		};
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	}
	if (restartIfIdle && !queue.draining) kickFollowupDrainIfIdle(key);
	return true;
}
function applyFollowupQueueOverflow(queue, run) {
	const elidedSummaryLines = [];
	const shouldEnqueue = applyQueueDropPolicy({
		queue,
		inFlight: queue.inFlight,
		summarize: (item) => {
			const approved = item.userTurnTranscriptRecorder?.getPendingInputMessage?.();
			return approved ? extractTextFromChatContent(approved.content, {
				normalizeText: (text) => text,
				joinWith: "\n"
			}) ?? "" : normalizeOptionalString(item.summaryLine) || item.prompt.trim();
		},
		onSummaryElide: (lines) => elidedSummaryLines.push(...lines),
		onDrop: (dropped) => {
			if (queue.dropPolicy === "summarize") {
				queue.summarySources.push(...dropped);
				return;
			}
			for (const item of dropped) {
				item.onQueueDisposition?.("queue-cap-old");
				completeFollowupRunLifecycle(item);
			}
		},
		isProtected: (item) => item.protectFromQueueOverflow === true
	});
	if (queue.dropPolicy === "summarize") {
		const overflow = queue.summarySources.length - queue.summaryLines.length;
		if (overflow > 0) {
			const removed = queue.summarySources.splice(0, overflow);
			for (const [index, item] of removed.entries()) {
				const summaryLine = elidedSummaryLines[index];
				if (summaryLine === void 0) throw new Error("followup queue summary source lost its elided line");
				const contextKey = resolveFollowupDeliveryContextKey(item);
				const lastElision = queue.summaryElisions.at(-1);
				const compactSource = createOverflowSummaryRetrySource(item);
				if (lastElision?.contextKey === contextKey) {
					lastElision.sources.push(compactSource);
					lastElision.summaryLines.push(summaryLine);
					lastElision.sourceRefs.set(item, compactSource);
				} else queue.summaryElisions.push({
					contextKey,
					sources: [compactSource],
					summaryLines: [summaryLine],
					sourceRefs: new WeakMap([[item, compactSource]])
				});
				if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
				trimSummaryElisionsToCap(queue);
			}
		}
	}
	if (!shouldEnqueue) {
		run.onQueueDisposition?.(queue.dropPolicy === "new" ? "queue-cap-new" : "queue-cap");
		completeFollowupRunLifecycle(run);
		return false;
	}
	return true;
}
function getFollowupQueueDepth(key) {
	const queue = getExistingFollowupQueue(key);
	if (!queue) return 0;
	return countPendingQueueItems(queue.items, queue.inFlight);
}
/**
* Claims the next pending user request when it comes from the same route and principal
* as `source`, so it can answer for it; internal retries and ambient events do not count.
* The claimed request survives overflow eviction like a front-queued recovery run.
*/
function claimNextQueuedFollowupRequestFrom(key, source) {
	const queue = getExistingFollowupQueue(key);
	const next = queue?.items.find((item) => !queue.inFlight.has(item) && !isFollowupRunAborted(item) && item.run.terminalReplyExpectation === "required" && item.strandedReplyRetry !== true);
	if (!next || followupMessageRouteIdentityKey(next) !== followupMessageRouteIdentityKey(source) || resolveFollowupAuthorizationKey(next) !== resolveFollowupAuthorizationKey(source)) return;
	next.protectFromQueueOverflow = true;
	return next;
}
function settleParkedSteerAcceptance(key, run, accepted) {
	const queue = getExistingFollowupQueue(key);
	const pending = run.steerPending;
	if (!queue?.items.includes(run) || !pending) return false;
	pending.settle(accepted);
	if (!accepted) {
		delete run.steerPending;
		reapplyDeferredOverflow(key);
		kickFollowupDrainIfIdle(key);
	}
	return true;
}
function reapplyDeferredOverflow(key) {
	const queue = getExistingFollowupQueue(key);
	if (!queue || queue.items.some((item) => item.steerPending) || countPendingQueueItems(queue.items, queue.inFlight) <= queue.cap) return;
	const items = queue.items.splice(0);
	for (const item of items) if (queue.inFlight.has(item) || applyFollowupQueueOverflow(queue, item)) queue.items.push(item);
}
/** Remove an exactly committed steer while preserving every sibling's FIFO position. */
function consumeParkedFollowupRun(key, run, disposition) {
	const queue = getExistingFollowupQueue(key);
	const index = queue?.items.indexOf(run) ?? -1;
	if (!queue || index < 0) return false;
	queue.items.splice(index, 1);
	run.steerPending?.settle(true);
	delete run.steerPending;
	delete run.protectFromQueueOverflow;
	reapplyDeferredOverflow(key);
	completeFollowupRunLifecycle(run, disposition);
	if (!queue.draining && queue.items.length === 0 && queue.inFlight.size === 0 && queue.droppedCount === 0 && FOLLOWUP_QUEUES.get(key) === queue) {
		FOLLOWUP_QUEUES.delete(key);
		clearFollowupDrainCallback(key);
	} else kickFollowupDrainIfIdle(key);
	return true;
}
function parkSteerCandidate(key, run, settings, runFollowup) {
	if (!enqueueFollowupRun(key, run, settings, "message-id", runFollowup, false, { steerCandidate: true })) return;
	logMessageQueuedWithBacklogPolicy({
		sessionId: run.run.sessionId,
		sessionKey: key,
		channel: run.originatingChannel ?? run.run.messageProvider,
		source: "followup-queue-steer"
	}, false);
	return {
		async admit() {
			const pending = run.steerPending;
			await racePromiseWithAbortSignal(pending?.predecessor ?? Promise.resolve(true), resolveFollowupAbortSignal(run)).catch((error) => {
				if (isFollowupRunAborted(run)) return false;
				throw error;
			});
			if (isFollowupRunAborted(run) || !getExistingFollowupQueue(key)?.items.includes(run)) return "cancelled";
			if (!pending || run.steerPending !== pending) return "fallback";
			pending.phase = "injecting";
			return "steer";
		},
		accepted: (accepted) => settleParkedSteerAcceptance(key, run, accepted),
		fallback: () => settleParkedSteerAcceptance(key, run, false),
		consume: (disposition) => consumeParkedFollowupRun(key, run, disposition)
	};
}
if (process.env.VITEST === "true" || false) globalThis[Symbol.for("openclaw.queueEnqueueTestApi")] = { resetRecentQueuedMessageIdDedupe };
//#endregion
//#region src/auto-reply/reply/queue/settings-runtime.ts
function resolvePluginDebounce(channelKey) {
	if (!channelKey) return;
	const value = getLoadedChannelPlugin(channelKey)?.defaults?.queue?.debounceMs;
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
/** Resolves queue settings with channel plugin defaults layered into core config. */
function resolveQueueSettings(params) {
	const channelKey = normalizeOptionalLowercaseString(params.channel);
	return resolveQueueSettingsCore({
		...params,
		pluginDebounceMs: params.pluginDebounceMs ?? resolvePluginDebounce(channelKey)
	});
}
//#endregion
export { parkSteerCandidate as a, getFollowupQueueDepth as i, claimNextQueuedFollowupRequestFrom as n, enqueueFollowupRun as r, resolveQueueSettings as t };
