import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-database-verify.ts
const log = createSubsystemLogger("state/database-verify");
const quickCheckQueues = resolveGlobalSingleton(Symbol.for("openclaw.databaseIntegrityQuickChecks"), () => /* @__PURE__ */ new Map());
function quickCheckQueue(env) {
	const key = path.resolve(resolveOpenClawStateSqlitePath(env));
	let queue = quickCheckQueues.get(key);
	if (!queue) {
		queue = {
			paths: /* @__PURE__ */ new Set(),
			subscribers: /* @__PURE__ */ new Set()
		};
		quickCheckQueues.set(key, queue);
	}
	return queue;
}
function wakeSubscribers(queue) {
	for (const wake of queue.subscribers) wake();
}
/** Cached opens queue work; only the listening Gateway starts the verifier. */
function requestOpenClawAgentDatabaseQuickCheck(options) {
	const queue = quickCheckQueue(options.env);
	queue.paths.add(path.resolve(options.path));
	wakeSubscribers(queue);
}
/** Consume requested agent quick checks for the listening Gateway. */
function startOpenClawDatabaseIntegrityVerifier(options) {
	const env = { ...options.env };
	const queue = quickCheckQueue(env);
	const owner = {};
	const inOwnerContext = AsyncLocalStorage.snapshot();
	let activeWorker;
	let activeRun;
	let claimedQuickPaths = [];
	let stopPromise;
	let stopped = false;
	let timer;
	const schedule = () => {
		if (stopped || queue.active || queue.paths.size === 0) return;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
			if (stopped || queue.active || queue.paths.size === 0) return;
			queue.active = owner;
			activeRun = inOwnerContext(run).finally(() => {
				activeRun = void 0;
				queue.active = void 0;
				wakeSubscribers(queue);
			});
		}, 0);
		timer.unref?.();
	};
	const run = async () => {
		const quickPaths = [...queue.paths];
		claimedQuickPaths = quickPaths;
		queue.paths.clear();
		try {
			const { applyOpenClawDatabaseVerificationResults, runDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-DFskDWNO.mjs");
			if (stopped) return;
			const targets = quickPaths.map((pathname) => ({
				kind: "agent",
				label: "OpenClaw agent database",
				path: pathname,
				check: "quick"
			}));
			const results = await runDatabaseVerifyWorker(targets, { onWorker: (worker) => {
				activeWorker = worker;
			} });
			if (!stopped) await applyOpenClawDatabaseVerificationResults({
				env,
				results,
				targets
			});
		} catch (error) {
			if (!stopped) log.error("database integrity verifier failed", { error: String(error) });
		} finally {
			activeWorker = void 0;
			claimedQuickPaths = [];
		}
	};
	const wake = () => inOwnerContext(schedule);
	queue.subscribers.add(wake);
	wake();
	return { stop: () => {
		if (stopPromise) return stopPromise;
		stopped = true;
		queue.subscribers.delete(wake);
		if (queue.subscribers.size === 0) queue.paths.clear();
		else {
			for (const pathname of claimedQuickPaths) queue.paths.add(pathname);
			wakeSubscribers(queue);
		}
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		stopPromise = (async () => {
			try {
				const worker = activeWorker;
				if (worker) {
					const { terminateDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-DFskDWNO.mjs");
					await terminateDatabaseVerifyWorker(worker);
				}
			} finally {
				await activeRun;
			}
		})();
		return stopPromise;
	} };
}
//#endregion
export { startOpenClawDatabaseIntegrityVerifier as n, requestOpenClawAgentDatabaseQuickCheck as t };
