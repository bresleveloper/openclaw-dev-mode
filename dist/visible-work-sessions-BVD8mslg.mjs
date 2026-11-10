import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/reply/visible-work-sessions.ts
const reporters = resolveGlobalSingleton(Symbol.for("openclaw.visibleWorkSessionReporter"), () => new AsyncLocalStorage());
/** Child runs start a fresh scope even when their caller has a channel reporter. */
async function withVisibleWorkSessionReporter(params, run) {
	const reporter = params.requesterSessionKey && params.report ? {
		requesterSessionKey: params.requesterSessionKey,
		report: params.report,
		active: true
	} : void 0;
	try {
		return await reporters.run(reporter, run);
	} finally {
		if (reporter) reporter.active = false;
	}
}
/** Await channel-owned initialization before a fresh visible child's first turn. */
async function reportCreatedVisibleWorkSession(params) {
	const reporter = reporters.getStore();
	if (reporter?.active && reporter.requesterSessionKey === params.requesterSessionKey) await reporter.report(params.visibleSession ? [{
		sessionKey: params.sessionKey,
		...params.visibleSession
	}] : [], { createdSessionKey: params.sessionKey });
}
//#endregion
export { withVisibleWorkSessionReporter as n, reportCreatedVisibleWorkSession as t };
