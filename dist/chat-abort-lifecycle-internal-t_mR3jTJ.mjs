import { g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as PluginRuntimeCloseCompletedError } from "./runtime-close-error-DPmgR5gM.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/chat-abort-lifecycle-internal.ts
const executionContext = resolveGlobalSingleton(Symbol.for("openclaw.chatAbortExecutionContext"), () => new AsyncLocalStorage());
function isCurrentChatAbortExecution(entry) {
	const current = executionContext.getStore();
	return current === entry && current.executionSettlement?.status === "pending";
}
/** Capture one exact registration; a same-key successor is never its completion owner. */
function captureChatAbortExecution(params) {
	const entry = params.entries.get(params.runId);
	return entry && entry.kind === "agent" && entry.sessionKey === params.sessionKey && entry.sessionId === params.sessionId && (params.lifecycleGeneration === void 0 || entry.lifecycleGeneration === params.lifecycleGeneration) ? entry : void 0;
}
/** Bind the raw execution tail before its logical registration can retire. */
function runWithChatAbortExecution(entry, run, cleanup) {
	if (!entry) return run();
	if (entry.executionSettlement) throw new Error("Chat execution already has a settlement owner");
	const { promise: completion, resolve, reject } = createDeferredCore();
	const settlement = {
		completion,
		status: "pending",
		cleanupSettled: false
	};
	entry.executionSettlement = settlement;
	completion.then(() => {
		settlement.status = "fulfilled";
		settlement.cleanupSettled = true;
		if (entry.executionSettlement === settlement && entry.registrationCleanupRequested) cleanup();
	}, (error) => {
		settlement.status = "rejected";
		settlement.cleanupSettled = error instanceof PluginRuntimeCloseCompletedError;
		if (settlement.cleanupSettled && entry.executionSettlement === settlement && entry.registrationCleanupRequested) cleanup();
	});
	try {
		executionContext.run(entry, run).then(resolve, reject);
	} catch (error) {
		reject(error);
	}
	return completion;
}
function removeChatAbortControllerEntry(entries, runId, expectedEntry) {
	const entry = entries.get(runId);
	if (!entry || expectedEntry && entry !== expectedEntry) return false;
	const pending = entry.pendingTimeoutCompletion;
	if (pending) {
		if (isFutureDateTimestampMs(pending.expiresAtMs, { nowMs: Date.now() })) return false;
		entry.pendingTimeoutCompletion = void 0;
		pending.settle();
		if (entries.get(runId) !== entry) return false;
	}
	if (entry.executionSettlement && !entry.executionSettlement.cleanupSettled) return false;
	entries.delete(runId);
	try {
		entry.onRemoved?.();
	} catch {} finally {
		notifyChatAbortControllerRemoved(entry);
	}
	return true;
}
const terminalPersistenceErrorByEntry = /* @__PURE__ */ new WeakMap();
const terminalDispatchByEntry = /* @__PURE__ */ new WeakMap();
const removalWaitersByEntry = /* @__PURE__ */ new WeakMap();
/** Retain the subscription owner's receipt on the exact captured registration. */
function bindChatAbortTerminalDispatch(entries, settled, captured) {
	if (!entries || !captured) return;
	const dispatch = Object.assign(captured, { settled });
	for (const entry of entries) terminalDispatchByEntry.set(entry, dispatch);
}
function markChatAbortTerminalPersistenceError(entry, error) {
	if (error === void 0) {
		terminalPersistenceErrorByEntry.delete(entry);
		return;
	}
	terminalPersistenceErrorByEntry.set(entry, error);
}
function notifyChatAbortControllerRemoved(entry) {
	const waiters = removalWaitersByEntry.get(entry);
	removalWaitersByEntry.delete(entry);
	for (const resolve of waiters ?? []) resolve();
}
/** Cancellation joins terminal dispatch before inspecting its write or intentional no-write. */
async function waitForChatAbortTerminalPersistence(entry) {
	const dispatch = terminalDispatchByEntry.get(entry);
	const preparedPersistence = entry.projectSessionTerminalPersistence;
	if (dispatch) await dispatch.settled;
	const persistence = preparedPersistence ?? entry.projectSessionTerminalPersistence;
	if (persistence) await persistence;
	if (!persistence && terminalPersistenceErrorByEntry.has(entry)) throw terminalPersistenceErrorByEntry.get(entry);
	if (dispatch?.failure) throw dispatch.failure.error;
	if (!persistence && entry.projectSessionTerminalPending === true) throw new Error("Session cancellation has no terminal persistence owner");
}
function isChatAbortTerminalPersistenceSettled(entry) {
	return entry.projectSessionTerminalPending !== true && entry.projectSessionTerminalPersistence === void 0 && !terminalPersistenceErrorByEntry.has(entry);
}
/** Waits for captured run registrations and their terminal persistence owner to leave. */
async function waitForChatAbortControllerRemoval(params) {
	const terminalOwnersSettled = () => params.targets.every(({ entry }) => isChatAbortTerminalPersistenceSettled(entry));
	const registeredWaiters = [];
	const settlements = params.targets.flatMap(({ runId, entry }) => {
		if (isCurrentChatAbortExecution(entry)) return [Promise.resolve().then(() => waitForChatAbortTerminalPersistence(entry)).then(() => true, () => false)];
		if (params.entries.get(runId) !== entry) return [];
		return [new Promise((resolve) => {
			const removed = () => resolve(true);
			const waiters = removalWaitersByEntry.get(entry) ?? /* @__PURE__ */ new Set();
			waiters.add(removed);
			removalWaitersByEntry.set(entry, waiters);
			registeredWaiters.push({
				entry,
				resolve: removed
			});
		})];
	});
	if (settlements.length === 0) return terminalOwnersSettled();
	try {
		const settled = Promise.all(settlements);
		return (params.timeoutMs === null ? await racePromiseWithAbortSignal(settled, params.signal).then(() => true) : await settlesWithin(settled, Math.max(0, params.timeoutMs))) && (await settled).every(Boolean) && terminalOwnersSettled();
	} finally {
		for (const { entry, resolve } of registeredWaiters) {
			const waiters = removalWaitersByEntry.get(entry);
			waiters?.delete(resolve);
			if (waiters?.size === 0) removalWaitersByEntry.delete(entry);
		}
	}
}
//#endregion
export { markChatAbortTerminalPersistenceError as a, waitForChatAbortControllerRemoval as c, isCurrentChatAbortExecution as i, waitForChatAbortTerminalPersistence as l, captureChatAbortExecution as n, removeChatAbortControllerEntry as o, isChatAbortTerminalPersistenceSettled as r, runWithChatAbortExecution as s, bindChatAbortTerminalDispatch as t };
