//#region packages/ai/src/session-resources.ts
const sessionResourceCleanups = /* @__PURE__ */ new Set();
const sessionResourceCleanupObservers = /* @__PURE__ */ new Set();
const sessionResourceOwnerIds = /* @__PURE__ */ new WeakMap();
let nextSessionResourceOwnerId = 1;
/** Returns a process-local key that keeps retained resources separated by runtime owner. */
function getSessionResourceOwnerId(owner) {
	const existing = sessionResourceOwnerIds.get(owner);
	if (existing !== void 0) return existing;
	const id = nextSessionResourceOwnerId++;
	sessionResourceOwnerIds.set(owner, id);
	return id;
}
/** Registers a session-resource cleanup hook and returns an unregister function. */
function registerSessionResourceCleanup(cleanup) {
	sessionResourceCleanups.add(cleanup);
	return () => {
		sessionResourceCleanups.delete(cleanup);
	};
}
/** Registers metadata cleanup that runs only after every resource cleanup succeeds. */
function registerSessionResourceCleanupObserver(observer) {
	sessionResourceCleanupObservers.add(observer);
	return () => {
		sessionResourceCleanupObservers.delete(observer);
	};
}
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
function cleanupSessionResources(sessionId, owner) {
	const errors = [];
	for (const cleanup of sessionResourceCleanups) try {
		cleanup(sessionId, owner);
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to cleanup session resources");
	for (const observer of sessionResourceCleanupObservers) observer(sessionId, owner);
}
//#endregion
export { registerSessionResourceCleanupObserver as i, getSessionResourceOwnerId as n, registerSessionResourceCleanup as r, cleanupSessionResources as t };
