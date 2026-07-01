//#region src/llm/session-resources.ts
const sessionResourceCleanups = /* @__PURE__ */ new Set();
/** Registers a session-resource cleanup hook and returns an unregister function. */
function registerSessionResourceCleanup(cleanup) {
	sessionResourceCleanups.add(cleanup);
	return () => {
		sessionResourceCleanups.delete(cleanup);
	};
}
/** Runs all registered cleanup hooks, aggregating failures after every hook has run. */
function cleanupSessionResources(sessionId) {
	const errors = [];
	for (const cleanup of sessionResourceCleanups) try {
		cleanup(sessionId);
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to cleanup session resources");
}
//#endregion
export { registerSessionResourceCleanup as n, cleanupSessionResources as t };
