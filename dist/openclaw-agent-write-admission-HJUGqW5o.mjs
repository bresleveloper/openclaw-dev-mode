import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as withSqliteWorkerReservationObservation } from "./worker-request-diagnostics-BrY1pZl2.mjs";
import { i as runQueuedStoreWrite, n as isActiveStoreWriter } from "./store-writer-queue-AKR6NnXM.mjs";
import { i as agentDatabaseWriteAdmissionState } from "./worker-task-pool-registry-D6q0YAmu.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import { t as runStoreWriterAcquisitions } from "./store-writer-acquisitions-Q--yqQda.mjs";
import { isMainThread, threadId } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
//#region src/state/openclaw-agent-write-admission.ts
const reservationDiagnostics = channel("openclaw.agent-database.reservation");
function observeWriteAdmission(operation, timing, run, caller, worker) {
	const observed = timing ?? {};
	observed.operation ??= operation;
	observed.caller ??= caller;
	observed.worker ??= worker;
	if (timing) return run(observed);
	const enqueuedAt = performance.now();
	const report = (outcome) => {
		if (observed.reentrant !== false || observed.startedAt === void 0 || observed.finishedAt === void 0 || observed.finishedAt - enqueuedAt < 1e3 && !reservationDiagnostics.hasSubscribers) return;
		const completedAt = performance.now();
		const fields = {
			operation,
			...caller ? { caller } : {},
			...worker ? {
				workerOperations: [...worker.operations],
				...worker.transactionCount !== void 0 ? { transactionCount: worker.transactionCount } : {}
			} : {},
			...observed.blockingOperation ? { blockingOperation: observed.blockingOperation } : {},
			...observed.blockingCaller ? { blockingCaller: observed.blockingCaller } : {},
			...observed.blockingWorker ? { blockingWorkerOperations: [...observed.blockingWorker.operations] } : {},
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			reentrant: false,
			elapsedMs: Math.round(completedAt - enqueuedAt),
			queueWaitMs: Math.round(observed.startedAt - enqueuedAt),
			writerExecutionMs: Math.round(observed.finishedAt - observed.startedAt),
			completionDelayMs: Math.round(completedAt - observed.finishedAt)
		};
		if (reservationDiagnostics.hasSubscribers) reservationDiagnostics.publish(fields);
		if (observed.finishedAt - enqueuedAt < 1e3) return;
		try {
			getChildLogger({ subsystem: "session-sqlite" }).warn(fields, "slow agent database reservation");
		} catch {}
	};
	return run(observed).then((value) => {
		report("ok");
		return value;
	}, (error) => {
		report("error");
		throw error;
	});
}
function runOpenClawAgentWriteAdmission(options, run, reentrant = false, timing, signal, caller) {
	return runOpenClawAgentPathWriteAdmission(resolveOpenClawAgentSqlitePath(options), run, reentrant, timing, signal, caller);
}
/** A captured physical actor needs no logical agent or ambient path resolution. */
function runOpenClawAgentPathWriteAdmission(pathname, run, reentrant = false, timing, signal, caller) {
	const identity = readDatabasePathIdentitySync(pathname);
	const storePath = identity.canonicalPath;
	const assertCurrent = () => {
		if (identity.key.startsWith("file:")) try {
			assertExistingDatabaseIdentity(pathname, identity.key, identity.birthtime);
		} catch (cause) {
			throw new Error("Agent database target changed before write admission", { cause });
		}
		else if (readDatabasePathIdentitySync(pathname).canonicalPath !== storePath) throw new Error("Agent database target changed before write admission");
	};
	return observeWriteAdmission("direct", timing, (observed) => {
		const holder = agentDatabaseWriteAdmissionState.queues.get(storePath)?.holder;
		observed.blockingOperation = holder?.operation;
		observed.blockingCaller = holder?.caller;
		observed.blockingWorker = holder?.worker;
		return runWithSqliteDatabaseAdmissionTurn([pathname], () => runQueuedStoreWrite({
			queues: agentDatabaseWriteAdmissionState.queues,
			storePath,
			label: "agent database write admission",
			reentrant: reentrant && !agentDatabaseWriteAdmissionState.queues.get(storePath)?.holder?.worker,
			fn: async () => {
				assertCurrent();
				const queue = agentDatabaseWriteAdmissionState.queues.get(storePath);
				const previousHolder = queue.holder;
				queue.holder = observed;
				try {
					return await run(identity, assertCurrent);
				} finally {
					queue.holder = previousHolder;
				}
			},
			timing: observed,
			signal
		}), [], signal);
	}, caller);
}
/** Reserve a native write permit without admitting inherited foreground callbacks. */
async function runOpenClawAgentWorkerWrite(options, run, timing, signal, priority, caller) {
	if (priority === "background") {
		const storePath = readDatabasePathIdentitySync(resolveOpenClawAgentSqlitePath(options)).canonicalPath;
		let draining;
		while (draining = agentDatabaseWriteAdmissionState.queues.get(storePath)?.drainPromise) await racePromiseWithAbortSignal(draining, signal, (aborted) => aborted.reason);
	}
	const worker = { operations: /* @__PURE__ */ new Set() };
	return observeWriteAdmission("worker", timing, (observed) => runOpenClawAgentWriteAdmission(options, () => withSqliteWorkerReservationObservation(worker, run), true, observed, signal), caller, worker);
}
/** Compose the existing foreground queues without inverting inherited acquisition order. */
async function runOpenClawAgentWriteAdmissions(options, run, reentrant = false, signal) {
	signal?.throwIfAborted();
	let selected = new Map(options.map((option) => [resolveOpenClawAgentSqlitePath(option), option]));
	const inherited = [...agentDatabaseWriteAdmissionState.queues.keys()].filter((pathname) => isActiveStoreWriter(agentDatabaseWriteAdmissionState.queues, pathname));
	if (selected.size > 1) {
		const physicalKey = (pathname) => {
			const identity = readDatabasePathIdentitySync(pathname);
			return `${identity.key}:${identity.birthtime ?? ""}`;
		};
		const representatives = new Map(inherited.map((pathname) => [physicalKey(pathname), pathname]));
		const physical = /* @__PURE__ */ new Map();
		for (const [pathname, option] of selected) {
			const identity = physicalKey(pathname);
			const representative = representatives.get(identity) ?? pathname;
			representatives.set(identity, representative);
			physical.set(representative, {
				...option,
				path: representative
			});
		}
		selected = physical;
	}
	const paths = [...selected.keys()].toSorted();
	if (paths.some((pathname) => inherited.includes(pathname) && (!reentrant || paths.length !== 1 || agentDatabaseWriteAdmissionState.queues.get(pathname)?.holder?.worker))) throw new Error("Session read batch cannot reenter an active SQLite writer admission");
	if (paths.some((pathname) => inherited.some((held) => held > pathname))) throw new Error("Session read batch would invert inherited SQLite writer admission order");
	return await runWithSqliteDatabaseAdmissionTurn(paths, () => runStoreWriterAcquisitions((index, next) => {
		const pathname = paths[index];
		return pathname === void 0 ? Promise.resolve().then(run) : observeWriteAdmission("ordered-read", void 0, (timing) => runOpenClawAgentWriteAdmission(selected.get(pathname), next, true, timing, signal));
	}), [], signal);
}
//#endregion
export { runOpenClawAgentWriteAdmissions as i, runOpenClawAgentWorkerWrite as n, runOpenClawAgentWriteAdmission as r, runOpenClawAgentPathWriteAdmission as t };
