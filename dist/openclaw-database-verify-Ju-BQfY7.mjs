import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-database-verify.ts
const log = createSubsystemLogger("state/database-verify");
const OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS = 3e5;
const OPENCLAW_DATABASE_VERIFY_INTERVAL_MS = 864e5;
const quickCheckQueues = resolveGlobalSingleton(Symbol.for("openclaw.databaseIntegrityQuickChecks"), () => /* @__PURE__ */ new Map());
function quickCheckQueue(env) {
	const key = path.resolve(resolveOpenClawStateSqlitePath(env));
	let queue = quickCheckQueues.get(key);
	if (!queue) {
		queue = {
			paths: /* @__PURE__ */ new Set(),
			subscribers: /* @__PURE__ */ new Set(),
			nextFullCheckAt: Infinity
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
/** Start the Gateway-owned delayed daily integrity verifier and queued quick checks. */
function startOpenClawDatabaseIntegrityVerifier(options) {
	const env = { ...options.env };
	const queue = quickCheckQueue(env);
	if (queue.subscribers.size === 0) queue.nextFullCheckAt = Date.now() + OPENCLAW_DATABASE_VERIFY_INITIAL_DELAY_MS;
	const owner = {};
	const inOwnerContext = AsyncLocalStorage.snapshot();
	let activeWorker;
	let activeRun;
	let claimedQuickPaths = [];
	let stopPromise;
	let stopped = false;
	let timer;
	const schedule = () => {
		if (stopped || queue.active) return;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
			if (stopped || queue.active) return;
			queue.active = owner;
			activeRun = inOwnerContext(run).finally(() => {
				activeRun = void 0;
				queue.active = void 0;
				wakeSubscribers(queue);
			});
		}, queue.paths.size > 0 ? 0 : Math.max(0, queue.nextFullCheckAt - Date.now()));
		timer.unref?.();
	};
	const run = async () => {
		const full = Date.now() >= queue.nextFullCheckAt;
		const quickPaths = [...queue.paths];
		claimedQuickPaths = quickPaths;
		queue.paths.clear();
		try {
			const { applyOpenClawDatabaseVerificationResults, collectOpenClawDatabaseVerifyTargets, runDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-D3Owlgpi.mjs");
			if (stopped) return;
			const targetsByPath = new Map((full ? collectOpenClawDatabaseVerifyTargets({ env }) : []).map((target) => [path.resolve(target.path), target]));
			for (const pathname of quickPaths) if (!targetsByPath.has(pathname)) targetsByPath.set(pathname, {
				kind: "agent",
				label: "OpenClaw agent database",
				path: pathname,
				check: "quick"
			});
			const targets = [...targetsByPath.values()];
			if (targets.length > 0) {
				const results = await runDatabaseVerifyWorker(targets, { onWorker: (worker) => {
					activeWorker = worker;
				} });
				if (!stopped) await applyOpenClawDatabaseVerificationResults({
					env,
					results,
					targets
				});
			}
		} catch (error) {
			if (!stopped) log.error("database integrity verifier failed", { error: String(error) });
		} finally {
			activeWorker = void 0;
			claimedQuickPaths = [];
			if (full && !stopped) queue.nextFullCheckAt = Date.now() + OPENCLAW_DATABASE_VERIFY_INTERVAL_MS;
		}
	};
	const wake = () => inOwnerContext(schedule);
	queue.subscribers.add(wake);
	wake();
	return { stop: () => {
		if (stopPromise) return stopPromise;
		stopped = true;
		queue.subscribers.delete(wake);
		if (queue.subscribers.size === 0) {
			queue.paths.clear();
			queue.nextFullCheckAt = Infinity;
		} else {
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
					const { terminateDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-D3Owlgpi.mjs");
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
