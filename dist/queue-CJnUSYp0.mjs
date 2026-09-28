import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as resolveGlobalDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-Czo5mOSj.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { a as logMessageQueuedWithBacklogPolicy } from "./diagnostic-runtime-BQEUFA0X.mjs";
import { t as resolveQueueSettingsCore } from "./settings-DtJ6NdCU.mjs";
import { C as shouldSkipQueueItem, _ as countPendingQueueItems, a as getFollowupQueue, c as trimSummaryElisionsToCap, d as markFollowupRunEnqueued, i as getExistingFollowupQueue, m as applyQueueDropPolicy, n as FOLLOWUP_QUEUES, u as completeFollowupRunLifecycle } from "./state-B1aZH2hx.mjs";
import { a as rememberFollowupDrainCallback, c as isFollowupRunAborted, d as createOverflowSummaryRetrySource, f as resolveFollowupDeliveryContextKey, l as resolveFollowupAbortSignal, n as dropAbortedFollowups, r as kickFollowupDrainIfIdle, t as clearFollowupDrainCallback } from "./drain-D4BsFyL3.mjs";
import "./cleanup-Oz9EeewQ.mjs";
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
function appendQueueItem(params) {
	params.queue.lastEnqueuedAt = Date.now();
	params.queue.lastRun = params.run.run;
	params.run.queueAbortSignal = params.queue.abortController.signal;
	params.queue.items[params.front ? "unshift" : "push"](params.run);
	if (params.recentMessageIdKey) recordRecentQueueMessageId(params.run, params.recentMessageIdKey);
	const runFollowup = params.runFollowup;
	if (runFollowup) rememberFollowupDrainCallback(params.key, runFollowup);
	const signal = resolveFollowupAbortSignal({
		abortSignal: params.run.abortSignal,
		operatorAuthority: params.run.operatorAuthority
	});
	const lifecycle = params.run.turnAdoptionLifecycle;
	if (signal && lifecycle && runFollowup) {
		const onAbort = () => {
			const queue = getExistingFollowupQueue(params.key);
			if (queue) dropAbortedFollowups(queue, runFollowup).catch((error) => {
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
	if (params.restartIfIdle && !params.queue.draining) kickFollowupDrainIfIdle(params.key);
}
function enqueueFollowupRun(key, run, settings, dedupeMode = "message-id", runFollowup, restartIfIdle = true, options = {}) {
	if (isFollowupRunAborted(run)) return false;
	if (options.position === "front") run.protectFromQueueOverflow = true;
	if (options.steerCandidate) run.steerAnchor = true;
	const recentMessageIdKey = dedupeMode !== "none" ? buildRecentMessageIdKey(run, key) : void 0;
	if (recentMessageIdKey && peekRecentQueueMessageId(recentMessageIdKey)) return false;
	const queue = getFollowupQueue(key, settings);
	const dedupe = dedupeMode === "none" ? void 0 : isRunAlreadyQueued;
	if (shouldSkipQueueItem({
		item: run,
		items: queue.items,
		dedupe
	})) return false;
	if (options.steerCandidate) {
		if (!markFollowupRunEnqueued(run)) return false;
		const { promise: acceptance, resolve: settle } = createDeferredCore();
		run.steerPending = {
			phase: "waiting",
			predecessor: queue.steerAcceptanceTail,
			settle
		};
		queue.steerAcceptanceTail = acceptance;
		appendQueueItem({
			key,
			queue,
			run,
			recentMessageIdKey,
			runFollowup,
			restartIfIdle,
			front: options.position === "front"
		});
		return true;
	}
	if (queue.items.some((item) => item.steerPending)) {
		if (!markFollowupRunEnqueued(run)) return false;
		appendQueueItem({
			key,
			queue,
			run,
			recentMessageIdKey,
			runFollowup,
			restartIfIdle,
			front: false
		});
		return true;
	}
	const pendingCount = countPendingQueueItems(queue.items, queue.inFlight);
	if (!options.steerCandidate && queue.dropPolicy === "new" && queue.cap > 0 && pendingCount >= queue.cap) {
		run.onQueueDisposition?.("queue-cap-new");
		completeFollowupRunLifecycle(run);
		return false;
	}
	if (!markFollowupRunEnqueued(run)) return false;
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
		isProtected: (item) => item.protectFromQueueOverflow === true || item.steerAnchor === true
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
				if (lastElision?.contextKey === contextKey) {
					const compactSource = createOverflowSummaryRetrySource(item);
					lastElision.count += 1;
					lastElision.sources.push(compactSource);
					lastElision.summaryLines.push(summaryLine);
					lastElision.sourceRefs.set(item, compactSource);
					if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
				} else {
					const compactSource = createOverflowSummaryRetrySource(item);
					queue.summaryElisions.push({
						contextKey,
						count: 1,
						sources: [compactSource],
						summaryLines: [summaryLine],
						sourceRefs: new WeakMap([[item, compactSource]])
					});
					if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
				}
				trimSummaryElisionsToCap(queue);
			}
		}
	}
	if (!shouldEnqueue) {
		run.onQueueDisposition?.("queue-cap");
		completeFollowupRunLifecycle(run);
		return false;
	}
	appendQueueItem({
		key,
		queue,
		run,
		recentMessageIdKey,
		runFollowup,
		restartIfIdle,
		front: options.position === "front"
	});
	return true;
}
function getFollowupQueueDepth(key) {
	const queue = getExistingFollowupQueue(key);
	if (!queue) return 0;
	return countPendingQueueItems(queue.items, queue.inFlight);
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
function isParkedFollowupRunOwned(key, run) {
	return getExistingFollowupQueue(key)?.items.includes(run) === true;
}
function reapplyDeferredOverflow(key) {
	const queue = getExistingFollowupQueue(key);
	if (!queue || queue.items.some((item) => item.steerPending)) return;
	const lastAnchor = queue.items.findLastIndex((item) => item.steerAnchor === true);
	const suffix = queue.items.splice(lastAnchor + 1);
	if (suffix.length === 0) return;
	const originalCap = queue.cap;
	const settings = {
		mode: queue.mode,
		debounceMs: queue.debounceMs,
		cap: originalCap + lastAnchor + 1,
		dropPolicy: queue.dropPolicy
	};
	for (const item of suffix) if (!enqueueFollowupRun(key, item, settings, "none", void 0, false)) completeFollowupRunLifecycle(item);
	queue.cap = originalCap;
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
	delete run.steerAnchor;
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
			const predecessorAccepted = await racePromiseWithAbortSignal(pending?.predecessor ?? Promise.resolve(true), resolveFollowupAbortSignal(run)).catch((error) => {
				if (isFollowupRunAborted(run)) return false;
				throw error;
			});
			if (isFollowupRunAborted(run) || !isParkedFollowupRunOwned(key, run)) return "cancelled";
			if (!predecessorAccepted || !pending || run.steerPending !== pending) return "fallback";
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
/** Resolves plugin-provided debounce defaults for a channel queue. */
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
export { parkSteerCandidate as i, enqueueFollowupRun as n, getFollowupQueueDepth as r, resolveQueueSettings as t };
