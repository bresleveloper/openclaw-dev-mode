import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-database-verify.ts
const log = createSubsystemLogger("state/database-verify");
const integrityCheckQueues = resolveGlobalSingleton(Symbol.for("openclaw.databaseIntegrityChecks"), () => /* @__PURE__ */ new Map());
function integrityCheckQueue(env) {
	const key = path.resolve(resolveOpenClawStateSqlitePath(env));
	let queue = integrityCheckQueues.get(key);
	if (!queue) {
		queue = {
			paths: /* @__PURE__ */ new Map(),
			releases: /* @__PURE__ */ new Set()
		};
		integrityCheckQueues.set(key, queue);
	}
	return queue;
}
function enqueueCheck(queue, pathname, request) {
	if (request.check === "full" || queue.paths.get(pathname)?.check !== "full") {
		const previous = queue.paths.get(pathname);
		queue.paths.set(pathname, request);
		if (previous) releaseCheck(queue, previous);
	} else releaseCheck(queue, request);
}
function releaseCheck(queue, request) {
	const release = request.release;
	request.release = void 0;
	if (!release) return;
	const pending = release().catch((error) => {
		log.error("database integrity verification cleanup failed", { error: String(error) });
	});
	queue.releases.add(pending);
	pending.finally(() => queue.releases.delete(pending));
}
/** Admitted opens queue work; only the listening Gateway starts the verifier. */
function requestOpenClawAgentDatabaseIntegrityCheck(options) {
	const queue = integrityCheckQueue(options.env);
	enqueueCheck(queue, path.resolve(options.path), {
		check: options.check,
		proof: options.proof,
		release: options.release
	});
	queue.wake?.();
}
/** Consume requested agent checks for the listening Gateway. */
function startOpenClawDatabaseIntegrityVerifier(options) {
	const env = { ...options.env };
	const queue = integrityCheckQueue(env);
	if (queue.wake) throw new Error("A database integrity verifier is already running for this state directory");
	const inOwnerContext = AsyncLocalStorage.snapshot();
	let activeWorker;
	let activeRun;
	let stopPromise;
	let stopped = false;
	const controller = new AbortController();
	let timer;
	const workerLifetime = {
		onWorker: (worker) => {
			activeWorker = worker;
		},
		assertCurrent: () => {
			if (stopped) throw new Error("database integrity verifier stopped");
		}
	};
	const schedule = () => {
		if (stopped || queue.active || queue.paths.size === 0) return;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = void 0;
			if (stopped || queue.active || queue.paths.size === 0) return;
			queue.active = true;
			activeRun = inOwnerContext(run).finally(() => {
				activeRun = void 0;
				queue.active = false;
				queue.wake?.();
			});
		}, 0);
		timer.unref?.();
	};
	const run = async () => {
		const checks = new Map(queue.paths);
		queue.paths.clear();
		try {
			const { applyOpenClawDatabaseVerificationResults, runDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-xgUyMJc2.mjs");
			if (stopped) return;
			const targets = Array.from(checks, ([pathname, request]) => ({
				kind: "agent",
				label: "OpenClaw agent database",
				path: pathname,
				check: request.check,
				...request.proof ? { identity: request.proof.identity } : {}
			}));
			const results = await runDatabaseVerifyWorker(targets, workerLifetime);
			if (!stopped) await applyOpenClawDatabaseVerificationResults({
				env,
				results,
				targets,
				workerLifetime,
				onVerified: async (pathname) => {
					const request = checks.get(pathname);
					if (request?.check === "full") return request.proof?.complete(workerLifetime.assertCurrent, controller.signal);
				}
			});
		} catch (error) {
			if (!stopped) log.error("database integrity verifier failed", { error: String(error) });
		} finally {
			activeWorker = void 0;
			for (const check of checks.values()) releaseCheck(queue, check);
			await Promise.all(queue.releases);
		}
	};
	const wake = () => inOwnerContext(schedule);
	queue.wake = wake;
	wake();
	return { stop: () => {
		if (stopPromise) return stopPromise;
		stopped = true;
		controller.abort(/* @__PURE__ */ new Error("database integrity verifier stopped"));
		queue.wake = void 0;
		for (const check of queue.paths.values()) releaseCheck(queue, check);
		queue.paths.clear();
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
		stopPromise = (async () => {
			try {
				const worker = activeWorker;
				if (worker) {
					const { terminateDatabaseVerifyWorker } = await import("./openclaw-database-verify.impl-xgUyMJc2.mjs");
					await terminateDatabaseVerifyWorker(worker);
				}
			} finally {
				await activeRun;
				await Promise.all(queue.releases);
			}
		})();
		return stopPromise;
	} };
}
//#endregion
export { startOpenClawDatabaseIntegrityVerifier as n, requestOpenClawAgentDatabaseIntegrityCheck as t };
