import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/gateway/in-process-session-run.ts
const runs = resolveGlobalSingleton(Symbol.for("openclaw.inProcessSessionRuns"), () => /* @__PURE__ */ new WeakMap());
function bindInProcessSessionRun(request, launch) {
	if (request.sessionKey !== launch.sessionKey || request.idempotencyKey !== launch.runId) throw new Error("Session run does not match its prepared target");
	const bound = {
		...request,
		expectedExistingSessionId: launch.sessionId,
		expectedExistingSessionLifecycleRevision: launch.lifecycleRevision
	};
	runs.set(bound, { ...launch });
	return bound;
}
/** Only the first host-bound admission consumes creation facts; wire copies cannot. */
function takeInProcessFreshChildSession(params) {
	const launch = getInProcessSessionRun("agent", params);
	if (!launch) return;
	const { freshChild, ...identity } = launch;
	runs.set(params, identity);
	return freshChild;
}
/** Wire fields cannot grant this alternative; live source and own-session checks still apply. */
function isInProcessSessionRun(method, params) {
	return getInProcessSessionRun(method, params) !== void 0;
}
function getInProcessSessionRun(method, params) {
	const request = asOptionalRecord(params);
	const launch = method === "agent" && request ? runs.get(request) : void 0;
	return launch && request?.sessionKey === launch.sessionKey && request.idempotencyKey === launch.runId && request.expectedExistingSessionId === launch.sessionId && request.expectedExistingSessionLifecycleRevision === launch.lifecycleRevision ? launch : void 0;
}
//#endregion
export { isInProcessSessionRun as n, takeInProcessFreshChildSession as r, bindInProcessSessionRun as t };
