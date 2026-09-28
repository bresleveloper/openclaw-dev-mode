import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import "./thinking-B1p5pEC8.mjs";
import { i as resolveThinkingSelectionCore } from "./model-thinking-default-BQDdsH3k.mjs";
//#region src/utils/queue-helpers.ts
/**
* Shared queue overflow, debounce, and collection helpers.
*
* Queue owners use these helpers to cap pending work, summarize dropped items,
* debounce drains, and force individual collection when cross-channel ordering matters.
*/
/** Build a summary prompt preview without mutating the source queue state. */
function previewQueueSummaryPrompt(params) {
	if (params.state.droppedCount <= 0) return;
	const lines = [params.title ?? `[Queue overflow] Dropped ${params.state.droppedCount} ${params.noun}${params.state.droppedCount === 1 ? "" : "s"} due to cap.`];
	if (params.state.summaryLines.length > 0) {
		lines.push("Summary:");
		for (const line of params.state.summaryLines) lines.push(`- ${line}`);
	}
	return lines.join("\n");
}
/** Apply runtime queue settings while preserving previous values for omitted fields. */
function applyQueueRuntimeSettings(params) {
	params.target.mode = params.settings.mode;
	params.target.debounceMs = typeof params.settings.debounceMs === "number" ? Math.max(0, params.settings.debounceMs) : params.target.debounceMs;
	params.target.cap = typeof params.settings.cap === "number" && params.settings.cap > 0 ? Math.floor(params.settings.cap) : params.target.cap;
	params.target.dropPolicy = params.settings.dropPolicy ?? params.target.dropPolicy;
}
/** Normalize whitespace and elide one dropped item for queue summaries. */
function buildQueueSummaryLine(text, limit = 160) {
	const cleaned = text.replace(/\s+/g, " ").trim();
	return cleaned.length <= limit ? cleaned : `${truncateUtf16Safe(cleaned, Math.max(0, limit - 1)).trimEnd()}…`;
}
/** Run optional duplicate detection before an item enters a queue. */
function shouldSkipQueueItem(params) {
	if (!params.dedupe) return false;
	return params.dedupe(params.item, params.items);
}
/** Count identities that are still pending in the queue, excluding active deliveries. */
function countPendingQueueItems(items, inFlight) {
	if (!inFlight || inFlight.size === 0) return items.length;
	return items.reduce((count, item) => count + (inFlight.has(item) ? 0 : 1), 0);
}
/** Apply overflow policy before enqueueing another item. */
function applyQueueDropPolicy(params) {
	const cap = params.queue.cap;
	const pendingCount = countPendingQueueItems(params.queue.items, params.inFlight);
	if (cap <= 0 || pendingCount < cap) return true;
	if (params.queue.dropPolicy === "new") return false;
	const dropCount = pendingCount - cap + 1;
	const victimIndices = [];
	for (const [index, item] of params.queue.items.entries()) {
		if (params.inFlight?.has(item) || params.isProtected?.(item) === true) continue;
		victimIndices.push(index);
		if (victimIndices.length === dropCount) break;
	}
	if (victimIndices.length < dropCount) return false;
	const dropped = [];
	for (let i = victimIndices.length - 1; i >= 0; i -= 1) dropped.unshift(...params.queue.items.splice(expectDefined(victimIndices[i], "victim indices entry at i"), 1));
	params.onDrop?.(dropped);
	if (params.queue.dropPolicy === "summarize") {
		for (const item of dropped) {
			params.queue.droppedCount += 1;
			params.queue.summaryLines.push(buildQueueSummaryLine(params.summarize(item)));
		}
		const limit = Math.max(0, params.summaryLimit ?? cap);
		const summaryLines = params.queue.summaryLines;
		if (summaryLines.length > limit) {
			const elidedLines = summaryLines.splice(0, summaryLines.length - Math.floor(limit));
			params.onSummaryElide?.(elidedLines);
		}
	}
	return true;
}
/** Wait until the queue has been quiet for its debounce window. */
function waitForQueueDebounce(queue, abortSignal) {
	if (isFastTestRuntimeEnv()) return Promise.resolve();
	const debounceMs = Math.max(0, queue.debounceMs);
	if (debounceMs <= 0) return Promise.resolve();
	if (abortSignal?.aborted) return Promise.resolve();
	return new Promise((resolve) => {
		let settled = false;
		let timer;
		const finish = () => {
			if (settled) return;
			settled = true;
			if (timer !== void 0) clearTimeout(timer);
			abortSignal?.removeEventListener("abort", finish);
			resolve();
		};
		const check = () => {
			if (abortSignal?.aborted) {
				finish();
				return;
			}
			const since = Date.now() - queue.lastEnqueuedAt;
			if (since >= debounceMs) {
				finish();
				return;
			}
			timer = setTimeout(check, debounceMs - since);
		};
		abortSignal?.addEventListener("abort", finish, { once: true });
		check();
	});
}
/** Mark one queue as draining unless another drain is already active. */
function beginQueueDrain(map, key) {
	const queue = map.get(key);
	if (!queue || queue.draining) return;
	queue.draining = true;
	return queue;
}
function removeQueuedItemsByRef(items, processed) {
	for (const item of processed) {
		const idx = items.indexOf(item);
		if (idx !== -1) items.splice(idx, 1);
	}
}
/** Run and remove the next queued item, returning false when empty. */
async function drainNextQueueItem(items, run, options) {
	const next = items[0];
	if (!next) return false;
	options?.inFlight?.add(next);
	try {
		await run(next);
		removeQueuedItemsByRef(items, [next]);
	} catch (error) {
		if (!(options?.shouldRestoreOnError?.(next) ?? true)) {
			removeQueuedItemsByRef(items, [next]);
			options?.onDiscard?.(next);
		}
		throw error;
	} finally {
		options?.inFlight?.delete(next);
	}
	return true;
}
/** Drain one collect step using mutable queue collection state. */
async function drainCollectQueueStep(params) {
	if (!params.collectState.forceIndividualCollect && !params.isCrossChannel) return "skipped";
	if (params.isCrossChannel) params.collectState.forceIndividualCollect = true;
	return await drainNextQueueItem(params.items, params.run, params.reserveOptions) ? "drained" : "empty";
}
/** Render a collect prompt from queued items and optional overflow summary. */
function buildCollectPrompt(params) {
	const blocks = [params.title];
	if (params.summary) blocks.push(params.summary);
	params.items.forEach((item, idx) => {
		blocks.push(params.renderItem(item, idx));
	});
	return blocks.join("\n\n");
}
/** Return true when queued items span keys or explicitly mark cross-channel state. */
function hasCrossChannelItems(items, resolveKey) {
	let firstKey;
	for (const item of items) {
		const resolved = resolveKey(item);
		if (resolved.cross || resolved.key && firstKey && resolved.key !== firstKey) return true;
		firstKey ||= resolved.key;
	}
	return false;
}
//#endregion
//#region src/auto-reply/reply/queue/lifecycle.ts
const enqueuedTurnAdoptionLifecycles = /* @__PURE__ */ new WeakSet();
const admittedTurnAdoptionLifecycles = /* @__PURE__ */ new WeakSet();
const admittingTurnAdoptionLifecycles = /* @__PURE__ */ new WeakMap();
const retiredTurnAdoptionCancellationLifecycles = /* @__PURE__ */ new WeakSet();
const completedTurnAdoptionLifecycles = /* @__PURE__ */ new WeakSet();
const completedTurnAdoptionLifecycleCallbacks = /* @__PURE__ */ new WeakSet();
const deferredHeartbeatStops = /* @__PURE__ */ new WeakMap();
function startFollowupRunPreAdoptionHeartbeat(lifecycle, abortSignal) {
	if (!lifecycle) return;
	const intervalMs = lifecycle.deferredHeartbeatIntervalMs;
	const heartbeat = lifecycle.onDeferredHeartbeat;
	if (!heartbeat || intervalMs === void 0 || !Number.isFinite(intervalMs) || intervalMs <= 0 || lifecycle.abortSignal?.aborted || abortSignal?.aborted || admittedTurnAdoptionLifecycles.has(lifecycle) || completedTurnAdoptionLifecycles.has(lifecycle)) return;
	deferredHeartbeatStops.get(lifecycle)?.();
	const pulse = () => {
		try {
			heartbeat();
		} catch {
			deferredHeartbeatStops.get(lifecycle)?.();
		}
	};
	const timer = setInterval(pulse, intervalMs).unref();
	const stop = () => {
		clearInterval(timer);
		lifecycle.abortSignal?.removeEventListener("abort", stop);
		abortSignal?.removeEventListener("abort", stop);
		if (deferredHeartbeatStops.get(lifecycle) === stop) deferredHeartbeatStops.delete(lifecycle);
	};
	deferredHeartbeatStops.set(lifecycle, stop);
	lifecycle.abortSignal?.addEventListener("abort", stop, { once: true });
	abortSignal?.addEventListener("abort", stop, { once: true });
	pulse();
	return stop;
}
function markFollowupRunEnqueued(run) {
	const authority = run.operatorAuthority;
	authority?.signal?.throwIfAborted();
	authority?.assertCurrent();
	const lifecycle = run.turnAdoptionLifecycle ?? (authority ? run.turnAdoptionLifecycle = {
		admission: "cancel-only",
		onAdopted: () => {}
	} : void 0);
	if (lifecycle && !enqueuedTurnAdoptionLifecycles.has(lifecycle)) {
		if (lifecycle.onDeferred?.() === false) return false;
		let releaseAuthority;
		try {
			releaseAuthority = authority?.retain?.();
		} catch (error) {
			completeFollowupRunLifecycle(run);
			throw error;
		}
		if (releaseAuthority) {
			const release = releaseAuthority;
			const onSettled = lifecycle.onSettled;
			lifecycle.onSettled = () => {
				try {
					onSettled?.();
				} finally {
					release();
				}
			};
		}
		enqueuedTurnAdoptionLifecycles.add(lifecycle);
		startFollowupRunPreAdoptionHeartbeat(lifecycle);
	}
	return true;
}
function retireFollowupRunCancellation(run) {
	const lifecycle = run.turnAdoptionLifecycle;
	if (!lifecycle || retiredTurnAdoptionCancellationLifecycles.has(lifecycle)) return;
	retiredTurnAdoptionCancellationLifecycles.add(lifecycle);
	lifecycle.onCancellationRetired?.();
}
async function admitFollowupRunLifecycle(run) {
	run.operatorAuthority?.assertCurrent();
	const lifecycle = run.turnAdoptionLifecycle;
	if (!lifecycle || admittedTurnAdoptionLifecycles.has(lifecycle)) return;
	const existing = admittingTurnAdoptionLifecycles.get(lifecycle);
	if (existing) {
		await existing;
		return;
	}
	if (completedTurnAdoptionLifecycles.has(lifecycle)) throw new Error("followup run lifecycle completed before admission");
	const admission = Promise.resolve().then(async () => {
		if (!admittedTurnAdoptionLifecycles.has(lifecycle)) {
			await lifecycle.onAdopted();
			run.operatorAuthority?.assertCurrent();
			admittedTurnAdoptionLifecycles.add(lifecycle);
			deferredHeartbeatStops.get(lifecycle)?.();
		}
	});
	admittingTurnAdoptionLifecycles.set(lifecycle, admission);
	try {
		await admission;
	} finally {
		admittingTurnAdoptionLifecycles.delete(lifecycle);
	}
}
function completeFollowupRunLifecycle(run, disposition) {
	try {
		run.steerPending?.settle(false);
	} finally {
		const lifecycle = run.turnAdoptionLifecycle;
		const finish = () => {
			if (!lifecycle || completedTurnAdoptionLifecycleCallbacks.has(lifecycle)) return;
			completedTurnAdoptionLifecycleCallbacks.add(lifecycle);
			try {
				if (disposition !== "consumed" && !admittedTurnAdoptionLifecycles.has(lifecycle)) lifecycle.onAbandoned?.();
			} finally {
				lifecycle.onSettled?.();
			}
		};
		if (lifecycle && !completedTurnAdoptionLifecycles.has(lifecycle)) {
			deferredHeartbeatStops.get(lifecycle)?.();
			completedTurnAdoptionLifecycles.add(lifecycle);
		}
		const admission = lifecycle ? admittingTurnAdoptionLifecycles.get(lifecycle) : void 0;
		if (!admission) finish();
		else admission.then(finish, finish).catch(() => {});
	}
}
const DEFAULT_QUEUE_DROP = "summarize";
const FOLLOWUP_QUEUES = resolveGlobalMap(Symbol.for("openclaw.followupQueues"));
function getExistingFollowupQueue(key) {
	const cleaned = key.trim();
	if (!cleaned) return;
	return FOLLOWUP_QUEUES.get(cleaned);
}
function hasPendingFollowupQueueWork(keys) {
	const seen = /* @__PURE__ */ new Set();
	for (const key of keys) {
		const cleaned = normalizeOptionalString(key);
		if (!cleaned || seen.has(cleaned)) continue;
		seen.add(cleaned);
		const queue = getExistingFollowupQueue(cleaned);
		if (queue && (queue.items.length > 0 || queue.inFlight.size > 0 || queue.droppedCount > 0)) return true;
	}
	return false;
}
function trimSummaryElisionsToCap(queue) {
	let sourceCount = queue.summaryElisions.reduce((count, entry) => count + entry.sources.filter((source) => !queue.activeSummarySources.has(source)).length, 0);
	while (sourceCount > queue.cap) {
		let evicted = false;
		for (const [entryIndex, entry] of queue.summaryElisions.entries()) {
			const sourceIndex = entry.sources.findIndex((source) => !queue.activeSummarySources.has(source));
			if (sourceIndex < 0) continue;
			const [source] = entry.sources.splice(sourceIndex, 1);
			entry.summaryLines.splice(sourceIndex, 1);
			entry.count = entry.sources.length;
			queue.evictedSummaryCount += 1;
			sourceCount -= 1;
			if (source) completeFollowupRunLifecycle(source);
			if (entry.sources.length === 0) queue.summaryElisions.splice(entryIndex, 1);
			evicted = true;
			break;
		}
		if (!evicted) return;
	}
}
function getFollowupQueue(key, settings) {
	const existing = FOLLOWUP_QUEUES.get(key);
	if (existing) {
		applyQueueRuntimeSettings({
			target: existing,
			settings
		});
		trimSummaryElisionsToCap(existing);
		return existing;
	}
	const created = {
		abortController: new AbortController(),
		items: [],
		draining: false,
		inFlight: /* @__PURE__ */ new Set(),
		lastEnqueuedAt: 0,
		mode: settings.mode,
		debounceMs: typeof settings.debounceMs === "number" ? Math.max(0, settings.debounceMs) : 500,
		cap: typeof settings.cap === "number" && settings.cap > 0 ? Math.floor(settings.cap) : 20,
		dropPolicy: settings.dropPolicy ?? "summarize",
		droppedCount: 0,
		summaryLines: [],
		summarySources: [],
		steerAcceptanceTail: Promise.resolve(true),
		activeSummarySources: /* @__PURE__ */ new WeakSet(),
		summaryElisions: [],
		evictedSummaryCount: 0
	};
	applyQueueRuntimeSettings({
		target: created,
		settings
	});
	FOLLOWUP_QUEUES.set(key, created);
	return created;
}
function clearFollowupQueue(key) {
	const cleaned = key.trim();
	const queue = getExistingFollowupQueue(cleaned);
	if (!queue) return 0;
	queue.abortController.abort();
	const cleared = queue.items.length + queue.droppedCount;
	for (const item of queue.items) completeFollowupRunLifecycle(item);
	for (const item of queue.summarySources) completeFollowupRunLifecycle(item);
	for (const entry of queue.summaryElisions) for (const source of entry.sources) completeFollowupRunLifecycle(source);
	queue.items.length = 0;
	queue.inFlight.clear();
	queue.droppedCount = 0;
	queue.summaryLines = [];
	queue.summarySources = [];
	queue.summaryElisions = [];
	queue.evictedSummaryCount = 0;
	queue.lastRun = void 0;
	queue.lastEnqueuedAt = 0;
	FOLLOWUP_QUEUES.delete(cleaned);
	return cleared;
}
function refreshQueuedFollowupSession(params) {
	const cleaned = params.key.trim();
	if (!cleaned) return;
	const queue = getExistingFollowupQueue(cleaned);
	if (!queue) return;
	const shouldRewriteSession = Boolean(params.previousSessionId) && Boolean(params.nextSessionId) && params.previousSessionId !== params.nextSessionId;
	const hasNextModelRoute = typeof params.nextProvider === "string" || typeof params.nextModel === "string";
	const shouldRewriteModelSelection = hasNextModelRoute || Object.hasOwn(params, "nextModelOverrideSource");
	const shouldRewriteSelection = shouldRewriteModelSelection || Object.hasOwn(params, "nextAuthProfileId") || Object.hasOwn(params, "nextAuthProfileIdSource") || params.nextThinking !== void 0;
	if (!shouldRewriteSession && !shouldRewriteSelection) return;
	const rewriteRun = (run) => {
		if (!run) return;
		if (shouldRewriteSession && run.sessionId === params.previousSessionId) {
			run.sessionId = params.nextSessionId;
			const nextSessionFile = normalizeOptionalString(params.nextSessionFile);
			if (nextSessionFile) run.sessionFile = nextSessionFile;
		}
		if (shouldRewriteSelection) {
			if (typeof params.nextProvider === "string") run.provider = params.nextProvider;
			if (typeof params.nextModel === "string") run.model = params.nextModel;
			if (hasNextModelRoute) run.requestedRouteResolution = params.nextRouteResolution ?? "raw";
			if (shouldRewriteModelSelection) delete run.hasAutoFallbackProvenance;
			if (Object.hasOwn(params, "nextModelOverrideSource")) {
				run.hasSessionModelOverride = params.nextModelOverrideSource !== void 0 && Boolean(run.provider || run.model);
				run.modelOverrideSource = params.nextModelOverrideSource;
			}
			if (Object.hasOwn(params, "nextAuthProfileId")) run.authProfileId = normalizeOptionalString(params.nextAuthProfileId);
			if (Object.hasOwn(params, "nextAuthProfileIdSource")) run.authProfileIdSource = run.authProfileId ? params.nextAuthProfileIdSource : void 0;
			if (params.nextThinking) {
				run.thinkingCatalog = params.nextThinking.catalog;
				const explicitLevel = run.thinkLevelOverride === "default" ? void 0 : run.thinkLevelOverride ?? normalizeThinkLevel(params.nextThinking.level);
				run.thinkLevel = resolveThinkingSelectionCore({
					cfg: run.config,
					agentId: run.agentId,
					provider: run.provider,
					model: run.model,
					catalog: params.nextThinking.catalog,
					agentRuntime: params.nextThinking.agentRuntime,
					level: explicitLevel
				}).level;
			}
		}
	};
	rewriteRun(queue.lastRun);
	for (const item of queue.items) rewriteRun(item.run);
	for (const item of queue.summarySources) rewriteRun(item.run);
	for (const entry of queue.summaryElisions) for (const source of entry.sources) rewriteRun(source.run);
}
//#endregion
export { shouldSkipQueueItem as C, removeQueuedItemsByRef as S, countPendingQueueItems as _, getFollowupQueue as a, hasCrossChannelItems as b, trimSummaryElisionsToCap as c, markFollowupRunEnqueued as d, retireFollowupRunCancellation as f, buildCollectPrompt as g, beginQueueDrain as h, getExistingFollowupQueue as i, admitFollowupRunLifecycle as l, applyQueueDropPolicy as m, FOLLOWUP_QUEUES as n, hasPendingFollowupQueueWork as o, startFollowupRunPreAdoptionHeartbeat as p, clearFollowupQueue as r, refreshQueuedFollowupSession as s, DEFAULT_QUEUE_DROP as t, completeFollowupRunLifecycle as u, drainCollectQueueStep as v, waitForQueueDebounce as w, previewQueueSummaryPrompt as x, drainNextQueueItem as y };
