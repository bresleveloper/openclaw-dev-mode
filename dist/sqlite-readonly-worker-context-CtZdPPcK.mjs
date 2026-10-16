import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-readonly-worker-context.ts
const readOnlyWorkerScope = new AsyncLocalStorage();
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
export { readOnlyWorkerScope as n, captureSqliteReadOnlyWorkerScope as t };
