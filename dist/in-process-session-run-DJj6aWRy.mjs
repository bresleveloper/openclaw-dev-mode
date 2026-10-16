import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
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
/** Wire fields cannot grant this alternative; live source and own-session checks still apply. */
function isInProcessSessionRun(method, params) {
	const request = asOptionalRecord(params);
	const launch = method === "agent" && request ? runs.get(request) : void 0;
	return Boolean(launch && request?.sessionKey === launch.sessionKey && request.idempotencyKey === launch.runId && request.expectedExistingSessionId === launch.sessionId && request.expectedExistingSessionLifecycleRevision === launch.lifecycleRevision);
}
//#endregion
export { isInProcessSessionRun as n, bindInProcessSessionRun as t };
