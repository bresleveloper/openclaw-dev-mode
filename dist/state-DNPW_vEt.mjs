import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { s as isFastTestRuntimeEnv } from "./env-DbG527wb.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
//#region src/utils/queue-helpers.ts
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
function buildQueueSummaryLine(text) {
	const cleaned = text.replace(/\s+/g, " ").trim();
	return cleaned.length <= 160 ? cleaned : `${truncateUtf16Safe(cleaned, 159).trimEnd()}…`;
}
/** Count identities that are still pending in the queue, excluding active deliveries. */
function countPendingQueueItems(items, inFlight) {
	if (!inFlight || inFlight.size === 0) return items.length;
	return items.reduce((count, item) => count + (inFlight.has(item) ? 0 : 1), 0);
}
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
function waitForQueueDebounce(queue, abortSignal) {
	if (isFastTestRuntimeEnv()) return Promise.resolve();
	const debounceMs = Math.max(0, queue.debounceMs);
	if (debounceMs <= 0) return Promise.resolve();
	if (abortSignal?.aborted) return Promise.resolve();
	return new Promise((resolve) => {
		let timer;
		let observedEnqueuedAt;
		let observedAtMs = 0;
		const finish = () => {
			if (timer !== void 0) clearTimeout(timer);
			abortSignal?.removeEventListener("abort", finish);
			resolve();
		};
		const check = () => {
			if (abortSignal?.aborted) {
				finish();
				return;
			}
			const nowMs = performance.now();
			if (queue.lastEnqueuedAt !== observedEnqueuedAt) {
				observedEnqueuedAt = queue.lastEnqueuedAt;
				observedAtMs = nowMs;
			}
			const since = Math.max(Date.now() - queue.lastEnqueuedAt, nowMs - observedAtMs);
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
async function drainCollectQueueStep(params) {
	if (!params.collectState.forceIndividualCollect && !params.isCrossChannel) return "skipped";
	if (params.isCrossChannel) params.collectState.forceIndividualCollect = true;
	return await drainNextQueueItem(params.items, params.run, params.reserveOptions) ? "drained" : "empty";
}
function buildCollectPrompt(params) {
	const blocks = [params.title];
	if (params.summary) blocks.push(params.summary);
	params.items.forEach((item, idx) => {
		blocks.push(params.renderItem(item, idx));
	});
	return blocks.join("\n\n");
}
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
//#region src/auto-reply/reply/queue/types.ts
var FollowupRunDeferredError = class extends Error {
	constructor(message = "Follow-up run deferred") {
		super(message);
		this.name = "FollowupRunDeferredError";
	}
};
function bindReplyOperationQueueDisposition(run, state) {
	const observe = run.onQueueDisposition;
	run.onQueueDisposition = (disposition) => {
		observe?.(disposition);
		if (state && (disposition !== "queue-cap-old" || state.admission?.status !== "accepted")) state.admission = {
			status: "skipped",
			reason: "queue-cap"
		};
	};
}
function isFollowupRunAborted(run) {
	return run.abortSignal?.aborted === true || run.queueAbortSignal?.aborted === true || run.operatorAuthority?.signal?.aborted === true;
}
function resolveFollowupAbortSignal(run) {
	const signals = [
		run.abortSignal,
		run.queueAbortSignal,
		run.operatorAuthority?.signal
	].filter((signal) => signal !== void 0);
	return signals.length > 1 ? AbortSignal.any(signals) : signals[0];
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
function stopFollowupRunPreAdoptionHeartbeat(lifecycle) {
	if (lifecycle) deferredHeartbeatStops.get(lifecycle)?.();
}
function updateFollowupRetryHeartbeats(error, sources) {
	for (const source of sources) if (error instanceof FollowupRunDeferredError) startFollowupRunPreAdoptionHeartbeat(source.turnAdoptionLifecycle);
	else stopFollowupRunPreAdoptionHeartbeat(source.turnAdoptionLifecycle);
}
function startFollowupRunPreAdoptionHeartbeat(lifecycle, abortSignal) {
	if (!lifecycle) return;
	const intervalMs = lifecycle.deferredHeartbeatIntervalMs;
	const heartbeat = lifecycle.onDeferredHeartbeat;
	if (!heartbeat || intervalMs === void 0 || !Number.isFinite(intervalMs) || intervalMs <= 0 || lifecycle.abortSignal?.aborted || abortSignal?.aborted || admittedTurnAdoptionLifecycles.has(lifecycle) || completedTurnAdoptionLifecycles.has(lifecycle)) return;
	stopFollowupRunPreAdoptionHeartbeat(lifecycle);
	const pulse = () => {
		try {
			heartbeat();
		} catch {
			stopFollowupRunPreAdoptionHeartbeat(lifecycle);
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
			stopFollowupRunPreAdoptionHeartbeat(lifecycle);
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
			stopFollowupRunPreAdoptionHeartbeat(lifecycle);
			completedTurnAdoptionLifecycles.add(lifecycle);
		}
		const admission = lifecycle ? admittingTurnAdoptionLifecycles.get(lifecycle) : void 0;
		if (!admission) finish();
		else admission.then(finish, finish).catch(() => {});
	}
}
function completeFollowupRuns(items, onError) {
	for (const item of items) try {
		completeFollowupRunLifecycle(item);
	} catch (error) {
		if (!onError) throw error;
		onError(error);
	}
}
const DEFAULT_QUEUE_DROP = "summarize";
const FOLLOWUP_QUEUES = resolveGlobalMap(Symbol.for("openclaw.followupQueues"));
function* followupQueueSources(queue) {
	yield* queue.items;
	yield* queue.summarySources;
	for (const entry of queue.summaryElisions) yield* entry.sources;
}
function getExistingFollowupQueue(key) {
	const cleaned = key.trim();
	return cleaned ? FOLLOWUP_QUEUES.get(cleaned) : void 0;
}
function hasPendingFollowupQueueWork(keys) {
	for (const key of keys) {
		const cleaned = normalizeOptionalString(key);
		if (!cleaned) continue;
		const queue = FOLLOWUP_QUEUES.get(cleaned);
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
	const queue = existing ?? {
		abortController: new AbortController(),
		items: [],
		draining: false,
		inFlight: /* @__PURE__ */ new Set(),
		lastEnqueuedAt: 0,
		mode: settings.mode,
		debounceMs: 500,
		cap: 20,
		dropPolicy: "summarize",
		droppedCount: 0,
		summaryLines: [],
		summarySources: [],
		steerAcceptanceTail: Promise.resolve(true),
		activeSummarySources: /* @__PURE__ */ new WeakSet(),
		summaryElisions: [],
		evictedSummaryCount: 0
	};
	applyQueueRuntimeSettings({
		target: queue,
		settings
	});
	if (existing) trimSummaryElisionsToCap(queue);
	else FOLLOWUP_QUEUES.set(key, queue);
	return queue;
}
function clearFollowupQueueContent(queue) {
	queue.items.length = 0;
	queue.droppedCount = 0;
	queue.summaryLines = [];
	queue.summarySources = [];
	queue.summaryElisions = [];
	queue.evictedSummaryCount = 0;
}
function clearFollowupQueue(key) {
	const cleaned = key.trim();
	const queue = getExistingFollowupQueue(cleaned);
	if (!queue) return 0;
	queue.abortController.abort();
	const cleared = queue.items.length + queue.droppedCount;
	completeFollowupRuns(followupQueueSources(queue));
	clearFollowupQueueContent(queue);
	queue.inFlight.clear();
	queue.lastRun = void 0;
	queue.lastEnqueuedAt = 0;
	FOLLOWUP_QUEUES.delete(cleaned);
	return cleared;
}
function clearRemovedQueuedAuthProfiles(params) {
	const clearRun = (run) => {
		const removed = params.removedByAgent.get(normalizeAgentId(run.agentId));
		if (!removed?.size) return;
		run.config = params.rewriteConfig(run.config);
		if (run.authProfileId && removed.has(run.authProfileId)) {
			delete run.authProfileId;
			delete run.authProfileIdSource;
		}
		const probe = run.autoFallbackPrimaryProbe;
		if (probe?.fallbackAuthProfileId && removed.has(probe.fallbackAuthProfileId)) {
			delete probe.fallbackAuthProfileId;
			delete probe.fallbackAuthProfileIdSource;
		}
	};
	for (const queue of FOLLOWUP_QUEUES.values()) {
		if (queue.lastRun) clearRun(queue.lastRun);
		for (const item of followupQueueSources(queue)) clearRun(item.run);
	}
}
function refreshQueuedFollowupSession(params) {
	const queue = getExistingFollowupQueue(params.key);
	if (!queue) return;
	const shouldRewriteSession = Boolean(params.previousSessionId) && Boolean(params.nextSessionId) && params.previousSessionId !== params.nextSessionId;
	const hasNextModelRoute = typeof params.nextProvider === "string" || typeof params.nextModel === "string";
	const shouldRewriteModelSelection = hasNextModelRoute || Object.hasOwn(params, "nextModelOverrideSource");
	const shouldRewriteSelection = shouldRewriteModelSelection || Object.hasOwn(params, "nextAuthProfileId") || Object.hasOwn(params, "nextAuthProfileIdSource") || params.nextThinking !== void 0;
	if (!shouldRewriteSession && !shouldRewriteSelection) return;
	const rewriteRun = (run) => {
		if (shouldRewriteSession && run.sessionId === params.previousSessionId) {
			run.sessionId = params.nextSessionId;
			const nextSessionFile = normalizeOptionalString(params.nextSessionFile);
			if (nextSessionFile) run.sessionFile = nextSessionFile;
		}
		if (shouldRewriteSelection) {
			if (typeof params.nextProvider === "string") run.provider = params.nextProvider;
			if (typeof params.nextModel === "string") run.model = params.nextModel;
			if (hasNextModelRoute) run.requestedRouteResolution = params.nextRouteResolution ?? "raw";
			if (shouldRewriteModelSelection) {
				delete run.hasAutoFallbackProvenance;
				delete run.autoFallbackPrimaryProbe;
			}
			if (Object.hasOwn(params, "nextModelOverrideSource")) {
				run.hasSessionModelOverride = params.nextModelOverrideSource !== void 0 && Boolean(run.provider || run.model);
				run.modelOverrideSource = params.nextModelOverrideSource;
			}
			if (Object.hasOwn(params, "nextAuthProfileId")) run.authProfileId = normalizeOptionalString(params.nextAuthProfileId);
			if (Object.hasOwn(params, "nextAuthProfileIdSource")) run.authProfileIdSource = run.authProfileId ? params.nextAuthProfileIdSource : void 0;
			if (params.nextThinking) {
				run.thinkingCatalog = params.nextThinking.catalog;
				const explicitLevel = run.thinkLevelOverride === "default" ? void 0 : run.thinkLevelOverride ?? normalizeThinkLevel(params.nextThinking.level);
				run.thinkingExplicit = explicitLevel !== void 0 || resolveConfiguredThinkingDefaultCore({
					cfg: run.config,
					agentId: run.agentId,
					provider: run.provider,
					model: run.model
				}) !== void 0;
				run.thinkLevel = resolveThinkingSelectionCore({
					cfg: run.config,
					agentId: run.agentId,
					provider: run.provider,
					model: run.model,
					catalog: params.nextThinking.catalog,
					agentRuntime: params.nextThinking.agentRuntime,
					level: explicitLevel
				}).requestedLevel;
			}
		}
	};
	if (queue.lastRun) rewriteRun(queue.lastRun);
	for (const item of followupQueueSources(queue)) rewriteRun(item.run);
}
//#endregion
export { previewQueueSummaryPrompt as A, applyQueueDropPolicy as C, drainCollectQueueStep as D, countPendingQueueItems as E, waitForQueueDebounce as M, drainNextQueueItem as O, resolveFollowupAbortSignal as S, buildCollectPrompt as T, startFollowupRunPreAdoptionHeartbeat as _, clearRemovedQueuedAuthProfiles as a, bindReplyOperationQueueDisposition as b, getFollowupQueue as c, trimSummaryElisionsToCap as d, admitFollowupRunLifecycle as f, retireFollowupRunCancellation as g, markFollowupRunEnqueued as h, clearFollowupQueueContent as i, removeQueuedItemsByRef as j, hasCrossChannelItems as k, hasPendingFollowupQueueWork as l, completeFollowupRuns as m, FOLLOWUP_QUEUES as n, followupQueueSources as o, completeFollowupRunLifecycle as p, clearFollowupQueue as r, getExistingFollowupQueue as s, DEFAULT_QUEUE_DROP as t, refreshQueuedFollowupSession as u, updateFollowupRetryHeartbeats as v, beginQueueDrain as w, isFollowupRunAborted as x, FollowupRunDeferredError as y };
