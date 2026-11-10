import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-readonly-worker-context.ts
const readOnlyWorkerScope = new AsyncLocalStorage();
/** Reuse child imports until the lifecycle owner closes; reads reacquire source admission. */
function createSqliteReadOnlyWorkerScope(options) {
	const scope = {
		active: true,
		busy: false,
		controller: new AbortController(),
		pending: /* @__PURE__ */ new Set(),
		deadlineOwnedByCaller: options?.deadlineOwnedByCaller ?? false
	};
	const abort = () => scope.controller.abort(options?.signal.reason);
	options?.signal.addEventListener("abort", abort, { once: true });
	if (options?.signal.aborted) abort();
	let closing;
	return {
		run(operation) {
			return readOnlyWorkerScope.run(scope, operation);
		},
		close() {
			closing ??= (async () => {
				options?.signal.removeEventListener("abort", abort);
				scope.active = false;
				scope.controller.abort(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
				await Promise.allSettled(scope.pending);
				const failures = (await Promise.allSettled([scope.worker?.close(), scope.releaseReadWorker?.()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "SQLite read-only worker scope cleanup failed");
			})();
			return closing;
		}
	};
}
/** Carry the owning readers into callbacks without retaining startup or request authority. */
function captureSqliteReadOnlyWorkerScope() {
	const scope = readOnlyWorkerScope.getStore();
	return (operation) => {
		if (!scope) return readOnlyWorkerScope.exit(operation);
		if (!scope.active) throw new Error("SQLite read-only worker scope closed");
		scope.controller.signal.throwIfAborted();
		return readOnlyWorkerScope.run(scope, operation);
	};
}
//#endregion
export { createSqliteReadOnlyWorkerScope as n, readOnlyWorkerScope as r, captureSqliteReadOnlyWorkerScope as t };
