import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/channels/draft-stream-loop.ts
/**
* Throttled draft stream loop.
*
* Sends the latest pending draft text with single-flight edit semantics.
*/
/** Creates a single-flight draft stream loop that preserves the newest pending value. */
function createDraftStreamLoop(params) {
	const throttleMs = resolveTimerTimeoutMs(params.throttleMs, 0, 0);
	const emptyValue = params.emptyValue ?? "";
	const isEmpty = params.isEmpty ?? ((value) => typeof value === "string" && value.trim().length === 0);
	const hasPendingValue = (value) => typeof value === "string" ? value.length > 0 : !isEmpty(value);
	let lastSentAt = 0;
	let pendingValue = emptyValue;
	let inFlightPromise;
	let timer;
	const flush = async (background = false) => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		while (!params.isStopped()) {
			if (inFlightPromise) {
				await inFlightPromise;
				if (background && params.coalesceInFlight) return;
				continue;
			}
			const value = pendingValue;
			if (isEmpty(value)) {
				pendingValue = emptyValue;
				return;
			}
			pendingValue = emptyValue;
			let current;
			let sent;
			try {
				current = Promise.resolve(params.sendOrEditStreamMessage(value)).finally(() => {
					if (inFlightPromise === current) inFlightPromise = void 0;
				});
				inFlightPromise = current;
				sent = await current;
			} catch (err) {
				if (!hasPendingValue(pendingValue)) pendingValue = value;
				else if (background && params.coalesceInFlight) schedule();
				throw err;
			}
			if (sent === false) {
				if (!hasPendingValue(pendingValue)) pendingValue = value;
				else if (background && params.coalesceInFlight) schedule();
				return;
			}
			lastSentAt = Date.now();
			if (!hasPendingValue(pendingValue)) return;
			if (background && params.coalesceInFlight) {
				schedule();
				return;
			}
		}
	};
	const startBackgroundFlush = () => {
		flush(true).catch((err) => {
			try {
				params.onBackgroundFlushError?.(err);
			} catch {}
		});
	};
	const schedule = () => {
		if (timer) return;
		const delay = Math.max(0, throttleMs - (Date.now() - lastSentAt));
		timer = setTimeout(() => {
			startBackgroundFlush();
		}, delay);
	};
	return {
		update: (value) => {
			if (params.isStopped()) return;
			pendingValue = value;
			if (inFlightPromise) {
				if (!params.coalesceInFlight) schedule();
				return;
			}
			if (!timer && Date.now() - lastSentAt >= throttleMs) {
				startBackgroundFlush();
				return;
			}
			schedule();
		},
		flush: () => flush(),
		stop: () => {
			pendingValue = emptyValue;
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		},
		resetPending: () => {
			pendingValue = emptyValue;
		},
		resetThrottleWindow: () => {
			lastSentAt = 0;
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		},
		waitForInFlight: async () => {
			if (inFlightPromise) await inFlightPromise;
		},
		takePending: () => {
			const value = pendingValue;
			pendingValue = emptyValue;
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
			return value;
		}
	};
}
//#endregion
//#region src/channels/draft-stream-controls.ts
/**
* Finalizable draft stream controls.
*
* Coordinates preview updates, final flushes, clears, and deletion callbacks for channel drafts.
*/
/**
* Creates controls for streaming preview messages that can be finalized, sealed, or cleared.
*/
function createFinalizableDraftStreamControls(params) {
	const loop = createDraftStreamLoop({
		throttleMs: params.throttleMs,
		coalesceInFlight: params.coalesceInFlight,
		isStopped: params.isStopped,
		sendOrEditStreamMessage: params.sendOrEditStreamMessage,
		...params.emptyValue !== void 0 ? { emptyValue: params.emptyValue } : {},
		...params.isEmpty ? { isEmpty: params.isEmpty } : {}
	});
	const update = (value) => {
		if (params.isStopped() || params.isFinal()) return;
		loop.update(value);
	};
	const stop = async () => {
		params.markFinal();
		await loop.flush();
	};
	const stopForClear = async () => {
		params.markStopped();
		loop.stop();
		await loop.waitForInFlight();
	};
	const seal = async () => {
		params.markFinal();
		loop.stop();
		await loop.waitForInFlight();
	};
	return {
		loop,
		update,
		stop,
		seal,
		discardPending: stopForClear,
		stopForClear
	};
}
/**
* Creates finalizable draft controls backed by a shared mutable state object.
*/
function createFinalizableDraftStreamControlsForState(params) {
	return createFinalizableDraftStreamControls({
		throttleMs: params.throttleMs,
		coalesceInFlight: params.coalesceInFlight,
		isStopped: () => params.state.stopped,
		isFinal: () => params.state.final,
		markStopped: () => {
			params.state.stopped = true;
		},
		markFinal: () => {
			params.state.final = true;
		},
		sendOrEditStreamMessage: params.sendOrEditStreamMessage,
		...params.emptyValue !== void 0 ? { emptyValue: params.emptyValue } : {},
		...params.isEmpty ? { isEmpty: params.isEmpty } : {}
	});
}
/**
* Stops a draft stream, reads the current preview message id, then clears the stored id.
*/
async function takeMessageIdAfterStop(params) {
	await params.stopForClear();
	const messageId = params.readMessageId();
	params.clearMessageId();
	return messageId;
}
async function deleteFinalizableDraftMessage(params, messageId) {
	try {
		if (await params.deleteMessage(messageId) === false) return false;
	} catch (err) {
		params.warn?.(`${params.warnPrefix}: ${formatErrorMessage(err)}`);
		return false;
	}
	try {
		if (Object.is(params.readMessageId(), messageId)) params.clearMessageId();
		params.onDeleteSuccess?.(messageId);
	} catch (err) {
		params.warn?.(`${params.warnPrefix} after delete: ${formatErrorMessage(err)}`);
	}
	return true;
}
/**
* Stops a draft stream and deletes its preview message when the stored id is valid.
* Claims the current id before deletion; stateful callers can retain failures through
* onDeleteFailure without making overlapping clears delete the same message twice.
*/
async function clearFinalizableDraftMessage(params) {
	await params.stopForClear();
	const messageId = params.readMessageId();
	params.clearMessageId();
	if (!params.isValidMessageId(messageId)) return;
	if (!await deleteFinalizableDraftMessage(params, messageId)) params.onDeleteFailure?.(messageId);
}
/**
* Builds the standard draft lifecycle used by channel streaming preview implementations.
*/
function createFinalizableDraftLifecycle(params) {
	const controls = createFinalizableDraftStreamControlsForState({
		throttleMs: params.throttleMs,
		coalesceInFlight: params.coalesceInFlight,
		state: params.state,
		sendOrEditStreamMessage: params.sendOrEditStreamMessage,
		...params.emptyValue !== void 0 ? { emptyValue: params.emptyValue } : {},
		...params.isEmpty ? { isEmpty: params.isEmpty } : {}
	});
	const pending = /* @__PURE__ */ new Map();
	let clearTail = Promise.resolve();
	const claim = (messageId, owner) => {
		let retirement = pending.get(messageId);
		if (!retirement) {
			retirement = { owner };
			pending.set(messageId, retirement);
		}
		return retirement;
	};
	const attemptDelete = (messageId, retirement) => {
		retirement.attempt ??= Promise.resolve().then(async () => {
			try {
				const deleted = await deleteFinalizableDraftMessage(retirement.owner, messageId);
				if (deleted && pending.get(messageId) === retirement) pending.delete(messageId);
				return deleted;
			} finally {
				retirement.attempt = void 0;
			}
		});
		return retirement.attempt;
	};
	const drainDeletes = async (retainedId) => {
		const visited = /* @__PURE__ */ new Set();
		for (const [messageId, retirement] of pending) {
			if (visited.has(messageId) || Object.is(messageId, retainedId)) continue;
			visited.add(messageId);
			await attemptDelete(messageId, retirement);
		}
		return pending.size === 0;
	};
	const retire = async (messageId, options) => {
		const retirement = claim(messageId, params);
		if (!options?.defer) await attemptDelete(messageId, retirement);
	};
	const serializeCleanup = (operation) => {
		const cleanupRun = clearTail.catch(() => {}).then(operation);
		clearTail = cleanupRun;
		return cleanupRun;
	};
	const clearWithStop = (stopForClear, messageIdOwner) => {
		const owner = messageIdOwner ? {
			...params,
			...messageIdOwner
		} : params;
		return serializeCleanup(async () => {
			await stopForClear();
			const messageId = owner.readMessageId();
			if (owner.isValidMessageId(messageId)) claim(messageId, owner);
			else owner.clearMessageId();
			await drainDeletes();
		});
	};
	const stop = () => {
		const previousClear = clearTail.catch(() => {});
		const stopRun = Promise.allSettled([controls.stop(), previousClear]).then(async ([stopped]) => {
			if (stopped.status === "rejected") throw stopped.reason;
			await drainDeletes(params.readMessageId());
		});
		clearTail = stopRun;
		return stopRun;
	};
	return {
		...controls,
		stop,
		clear: () => clearWithStop(controls.stopForClear),
		clearWithStop,
		retire,
		cleanupPending: (prepareCleanup) => serializeCleanup(async () => {
			prepareCleanup?.();
			await drainDeletes(params.readMessageId());
		})
	};
}
//#endregion
export { takeMessageIdAfterStop as a, createFinalizableDraftStreamControlsForState as i, createFinalizableDraftLifecycle as n, createDraftStreamLoop as o, createFinalizableDraftStreamControls as r, clearFinalizableDraftMessage as t };
