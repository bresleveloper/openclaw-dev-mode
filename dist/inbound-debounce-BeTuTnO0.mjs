import { M as resolveNonNegativeIntegerOption, N as resolveOptionalIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./errors-DPfGDWk1.mjs";
import { E as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
//#region src/auto-reply/inbound-debounce.ts
/** Resolve effective inbound debounce milliseconds from explicit, channel, and global config. */
function resolveInboundDebounceMs(params) {
	const inbound = params.cfg.messages?.inbound;
	for (const value of [
		params.overrideMs,
		inbound?.byChannel?.[params.channel],
		inbound?.debounceMs
	]) {
		const resolved = resolveOptionalIntegerOption(value, { min: 0 });
		if (resolved !== void 0) return resolved;
	}
	return 0;
}
/**
* Start one flush and bind its admission signal to the turn lifecycle.
* Completion also releases admission for gated work that never enters a session lane.
*/
function createInboundDebounceFlush(params) {
	let admitted = false;
	const { promise: admission, resolve: resolveAdmission } = createDeferredCore();
	const markAdmitted = () => {
		admitted = true;
		resolveAdmission();
	};
	const source = params.lifecycle;
	const lifecycle = {
		abortSignal: source?.abortSignal ?? new AbortController().signal,
		onAdopted: async () => {
			await source?.onAdopted?.();
			markAdmitted();
		},
		onDeferred: () => {
			const accepted = source?.onDeferred?.();
			if (accepted !== false) markAdmitted();
			return accepted;
		},
		onDeferredHeartbeat: () => source?.onDeferredHeartbeat?.(),
		deferredHeartbeatIntervalMs: source?.deferredHeartbeatIntervalMs,
		onAdoptionFinalizing: () => source?.onAdoptionFinalizing?.(),
		onFailed: source?.onFailed ? async (error) => {
			try {
				await source.onFailed?.(error);
			} finally {
				markAdmitted();
			}
		} : void 0,
		onAbandoned: async () => source?.onAbandoned?.()
	};
	return {
		admission,
		completion: runWithGatewayIndependentRootWorkContinuation(async () => params.dispatch(lifecycle), "channel:inbound-dispatch").catch(async (error) => {
			const failure = toErrorObject(error, "Inbound debounce dispatch failed");
			if (!admitted && lifecycle.onFailed) await Promise.allSettled([lifecycle.onFailed(failure)]);
			throw failure;
		}).finally(markAdmitted)
	};
}
const DEFAULT_MAX_TRACKED_KEYS = 2048;
const MAX_DEBOUNCE_WINDOW_MULTIPLIER = 5;
/** Create a keyed debouncer with flush/cancel controls and same-key serialization. */
function createInboundDebouncer(params) {
	const buffers = /* @__PURE__ */ new Map();
	const pendingBuffers = /* @__PURE__ */ new Map();
	const pendingImmediate = /* @__PURE__ */ new Map();
	const keyChains = /* @__PURE__ */ new Map();
	const activeCompletions = /* @__PURE__ */ new Set();
	const defaultDebounceMs = resolveNonNegativeIntegerOption(params.debounceMs, 0);
	const maxTrackedKeys = Math.max(1, Math.trunc(params.maxTrackedKeys ?? DEFAULT_MAX_TRACKED_KEYS));
	const resolveDebounceMs = (item, pending) => {
		const resolved = params.resolveDebounceMs?.(item, pending);
		return resolveNonNegativeIntegerOption(resolved, defaultDebounceMs);
	};
	const resolvePending = (item, key) => {
		const buffer = buffers.get(key);
		return buffer && (params.canAppend?.(item, buffer.items) ?? true) ? buffer : void 0;
	};
	const shouldBuffer = (item) => {
		const key = params.buildKey(item);
		return Boolean(key && resolveDebounceMs(item, resolvePending(item, key)?.items) > 0 && (params.shouldDebounce?.(item) ?? true));
	};
	const notifyObserver = (notify) => {
		try {
			notify();
		} catch {}
	};
	const reportFlushError = (error, items) => notifyObserver(() => params.onError?.(error, items));
	const cancelItems = (items) => notifyObserver(() => params.onCancel?.(items));
	const runFlush = async (items) => {
		let flush;
		try {
			const result = params.onFlush(items, createInboundDebounceFlush);
			if ("then" in result) {
				const completion = Promise.resolve(result);
				flush = {
					admission: completion,
					completion
				};
			} else flush = result;
		} catch (err) {
			reportFlushError(err, items);
			return;
		}
		let reported = false;
		const reportOnce = (err) => {
			if (reported) return;
			reported = true;
			reportFlushError(err, items);
		};
		const admission = flush.admission.catch(reportOnce);
		const completion = flush.completion.catch(reportOnce);
		activeCompletions.add(completion);
		completion.then(() => activeCompletions.delete(completion));
		await Promise.race([admission, completion]);
	};
	const untrackKeyTask = (key, settled) => {
		if (keyChains.get(key) === settled) keyChains.delete(key);
	};
	const enqueueKeyTask = (key, task) => {
		const previous = keyChains.get(key);
		const next = previous ? previous.then(task) : task();
		const settled = next.catch(() => void 0);
		keyChains.set(key, settled);
		settled.then(() => untrackKeyTask(key, settled));
		return next;
	};
	const enqueueImmediate = (key, item) => {
		const items = [item];
		const pending = pendingImmediate.get(key) ?? /* @__PURE__ */ new Set();
		pending.add(items);
		pendingImmediate.set(key, pending);
		return enqueueKeyTask(key, async () => {
			pending.delete(items);
			if (pending.size === 0) pendingImmediate.delete(key);
			if (items.length > 0) await runFlush(items);
		});
	};
	const detachBuffer = (key, buffer) => {
		if (buffers.get(key) === buffer) buffers.delete(key);
		if (buffer.timeout) {
			clearTimeout(buffer.timeout);
			buffer.timeout = null;
		}
	};
	const flushBuffer = async (key, buffer) => {
		detachBuffer(key, buffer);
		buffer.releaseReady();
		await buffer.task;
	};
	const flushKey = async (key) => {
		const buffer = buffers.get(key);
		if (!buffer) return;
		await flushBuffer(key, buffer);
	};
	const cancelKey = (key) => {
		const pending = pendingBuffers.get(key);
		if (!pending?.size && !keyChains.has(key)) return false;
		for (const buffer of pending ?? []) {
			detachBuffer(key, buffer);
			const canceledItems = buffer.items;
			buffer.items = [];
			cancelItems(canceledItems);
			buffer.releaseReady();
		}
		for (const items of pendingImmediate.get(key) ?? []) if (items.length > 0) cancelItems(items.splice(0));
		pendingBuffers.delete(key);
		return true;
	};
	const settleQuietFlush = async (key, buffer) => {
		if (!params.shouldHoldFlush || performance.now() >= buffer.flushDeadlineMs) {
			await flushBuffer(key, buffer);
			return;
		}
		buffer.timeout = setTimeout(() => {
			flushBuffer(key, buffer);
		}, Math.max(0, buffer.flushDeadlineMs - performance.now()));
		buffer.timeout.unref?.();
		let shouldHold;
		try {
			shouldHold = await params.shouldHoldFlush(buffer.items);
		} catch {
			shouldHold = false;
		}
		if (buffers.get(key) !== buffer) return;
		if (shouldHold) scheduleFlush(key, buffer);
		else await flushBuffer(key, buffer);
	};
	const scheduleFlush = (key, buffer) => {
		if (buffer.timeout) clearTimeout(buffer.timeout);
		const delayMs = Math.min(buffer.debounceMs, Math.max(0, buffer.flushDeadlineMs - performance.now()));
		buffer.timeout = setTimeout(() => {
			if (params.shouldHoldFlush) settleQuietFlush(key, buffer);
			else flushBuffer(key, buffer);
		}, delayMs);
		buffer.timeout.unref?.();
	};
	const enqueue = async (item) => {
		const key = params.buildKey(item);
		const existing = key ? resolvePending(item, key) : void 0;
		const debounceMs = resolveDebounceMs(item, existing?.items);
		if (!(debounceMs > 0 && (params.shouldDebounce?.(item) ?? true)) || !key) {
			if (key && (buffers.has(key) || keyChains.has(key) || params.serializeImmediate)) {
				flushKey(key);
				await enqueueImmediate(key, item);
				return;
			}
			await runFlush([item]);
			return;
		}
		if (existing) {
			existing.items.push(item);
			existing.debounceMs = debounceMs;
			scheduleFlush(key, existing);
			return;
		}
		if (buffers.has(key)) flushKey(key);
		if (!(keyChains.has(key) || keyChains.size < maxTrackedKeys)) {
			await enqueueImmediate(key, item);
			return;
		}
		const { promise: ready, resolve: releaseReady } = createDeferredCore();
		const task = enqueueKeyTask(key, async () => {
			await ready;
			const pending = pendingBuffers.get(key);
			pending?.delete(buffer);
			if (pending?.size === 0) pendingBuffers.delete(key);
			if (buffer.items.length === 0) return;
			await runFlush(buffer.items);
		});
		const buffer = {
			items: [item],
			timeout: null,
			debounceMs,
			flushDeadlineMs: performance.now() + Math.max(debounceMs, resolveNonNegativeIntegerOption(typeof params.maxWaitMs === "function" ? params.maxWaitMs(item) : params.maxWaitMs, debounceMs * MAX_DEBOUNCE_WINDOW_MULTIPLIER)),
			releaseReady,
			task
		};
		buffers.set(key, buffer);
		const pending = pendingBuffers.get(key) ?? /* @__PURE__ */ new Set();
		pending.add(buffer);
		pendingBuffers.set(key, pending);
		scheduleFlush(key, buffer);
	};
	const drain = async () => {
		while (keyChains.size > 0 || activeCompletions.size > 0) await Promise.all([...keyChains.values(), ...activeCompletions]);
	};
	return {
		enqueue,
		shouldBuffer,
		flushKey,
		cancelKey,
		drain
	};
}
//#endregion
export { resolveInboundDebounceMs as n, createInboundDebouncer as t };
