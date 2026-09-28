import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { setImmediate } from "node:timers/promises";
import { performance } from "node:perf_hooks";
//#region src/shared/store-writer-queue.ts
const MAX_WRITERS_PER_TURN = 4;
const WRITER_TURN_BUDGET_MS = 4;
const activeStoreWriters = resolveGlobalSingleton(Symbol.for("openclaw.activeStoreWriters"), () => new AsyncLocalStorage());
const writerTurn = resolveGlobalSingleton(Symbol.for("openclaw.storeWriterTurn"), () => ({
	started: 0,
	startedAt: 0,
	reset: void 0,
	wait: void 0
}));
function claimStoreWriterTurn(immediate) {
	const now = performance.now();
	if (!writerTurn.reset) {
		writerTurn.started = 0;
		writerTurn.startedAt = now;
		writerTurn.reset = setImmediate().then(() => {
			writerTurn.reset = void 0;
		});
	}
	if (!immediate && (writerTurn.wait || writerTurn.started >= MAX_WRITERS_PER_TURN || now - writerTurn.startedAt >= WRITER_TURN_BUDGET_MS)) return writerTurn.wait ??= setImmediate().then(() => {
		writerTurn.wait = void 0;
	});
	writerTurn.started++;
}
function isActiveStoreWriter(queues, storePath) {
	if (!queues.has(storePath)) return false;
	let active = activeStoreWriters.getStore();
	while (active) {
		if (active.active && active.queues === queues && active.storePath === storePath) return true;
		active = active.parent;
	}
	return false;
}
async function runActiveStoreWriter(queues, storePath, fn, timing) {
	const writer = {
		active: true,
		parent: activeStoreWriters.getStore(),
		queues,
		storePath
	};
	if (timing) {
		timing.reentrant = false;
		timing.startedAt = performance.now();
	}
	try {
		return await activeStoreWriters.run(writer, fn);
	} finally {
		if (timing) timing.finishedAt = performance.now();
		writer.active = false;
	}
}
function getOrCreateStoreWriterQueue(queues, storePath) {
	const existing = queues.get(storePath);
	if (existing) return existing;
	const created = {
		pending: [],
		drainPromise: null
	};
	queues.set(storePath, created);
	return created;
}
async function drainStoreWriterQueue(queues, storePath) {
	const queue = queues.get(storePath);
	if (!queue || queue.drainPromise) return;
	const drain = createDeferredCore();
	queue.drainPromise = drain.promise;
	let first = true;
	try {
		while (queue.pending.length > 0) {
			let wait;
			while (wait = claimStoreWriterTurn(first)) await wait;
			first = false;
			const task = queue.pending.shift();
			if (!task) continue;
			await task.fn().then(task.resolve, task.reject);
		}
	} finally {
		queue.drainPromise = null;
		queues.delete(storePath);
		drain.resolve();
	}
}
/** Runs one store write after prior writes for the same store path have finished. */
async function runQueuedStoreWrite(params) {
	if (!params.storePath || typeof params.storePath !== "string") throw new Error(`${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`);
	if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath)) {
		if (params.timing) {
			params.timing.reentrant = true;
			params.timing.startedAt = performance.now();
		}
		try {
			return await params.fn();
		} finally {
			if (params.timing) params.timing.finishedAt = performance.now();
		}
	}
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	const queue = getOrCreateStoreWriterQueue(params.queues, params.storePath);
	return await new Promise((resolve, reject) => {
		const task = {
			fn: async () => await runInAsyncContext(runActiveStoreWriter, params.queues, params.storePath, params.fn, params.timing),
			resolve: (value) => resolve(value),
			reject
		};
		queue.pending.push(task);
		drainStoreWriterQueue(params.queues, params.storePath);
	});
}
/** Rejects pending queued writes and clears queue state for test cleanup. */
function clearStoreWriterQueuesForTest(queues, message) {
	for (const queue of queues.values()) {
		for (const task of queue.pending) task.reject(new Error(message));
		queue.pending.length = 0;
	}
	queues.clear();
}
//#endregion
//#region src/state/openclaw-agent-write-admission.ts
const admission = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({
	queues: /* @__PURE__ */ new Map(),
	workers: /* @__PURE__ */ new Map()
}));
const SQLITE_SESSION_WRITER_QUEUES = admission.queues;
function runOpenClawAgentWriteAdmission(options, run, reentrant = false, timing) {
	const storePath = resolveOpenClawAgentSqlitePath(options);
	return runQueuedStoreWrite({
		queues: admission.queues,
		storePath,
		label: "agent database write admission",
		reentrant: reentrant && !admission.workers.has(storePath),
		fn: async () => await run(),
		timing
	});
}
/** Reserve a native write permit without admitting inherited foreground callbacks. */
function runOpenClawAgentWorkerWrite(options, run, timing) {
	const storePath = resolveOpenClawAgentSqlitePath(options);
	return runOpenClawAgentWriteAdmission(options, async () => {
		const owner = {};
		admission.workers.set(storePath, owner);
		try {
			return await run();
		} finally {
			if (admission.workers.get(storePath) === owner) admission.workers.delete(storePath);
		}
	}, true, timing);
}
//#endregion
export { runQueuedStoreWrite as a, clearStoreWriterQueuesForTest as i, runOpenClawAgentWorkerWrite as n, runOpenClawAgentWriteAdmission as r, SQLITE_SESSION_WRITER_QUEUES as t };
