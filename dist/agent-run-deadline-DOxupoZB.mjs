import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
//#region src/infra/agent-run-deadline.ts
function getRenewers() {
	return resolveGlobalSingleton(Symbol.for("openclaw.agentRunDeadline.renewers"), () => /* @__PURE__ */ new Map());
}
/** The Gateway owns reply deadlines; fallback only requests a fresh attempt budget. */
function registerAgentRunDeadlineRenewer(runId, renew) {
	const renewers = getRenewers();
	renewers.set(runId, renew);
	return () => {
		if (renewers.get(runId) === renew) renewers.delete(runId);
	};
}
function renewAgentRunDeadline(runId) {
	return runId ? getRenewers().get(runId)?.() ?? false : false;
}
//#endregion
export { renewAgentRunDeadline as n, registerAgentRunDeadlineRenewer as t };
