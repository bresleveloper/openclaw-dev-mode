import { u as scheduleGatewayRestart } from "./restart-DQIBmMjt.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-D2-QpshF.mjs";
//#region src/infra/restart-coordinator.ts
function createSafeGatewayRestartPreflight(inspectors = {}) {
	const snapshot = createGatewayActiveWorkSnapshot({
		...inspectors,
		getSessionAdmissions: () => 0,
		getSessionMutations: () => 0,
		getChatRuns: () => 0,
		getQueuedTurns: () => 0,
		getTerminalPersistence: () => 0,
		getTerminalSessions: () => 0
	});
	const counts = {
		queueSize: snapshot.counts.queueSize,
		pendingReplies: snapshot.counts.pendingReplies,
		embeddedRuns: snapshot.counts.embeddedRuns,
		cronRuns: snapshot.counts.cronRuns,
		backgroundExecSessions: snapshot.counts.backgroundExecSessions,
		rootRequests: snapshot.counts.rootRequests,
		agentRuns: snapshot.counts.agentRuns,
		acpRuns: snapshot.counts.acpRuns,
		mediaRuns: snapshot.counts.mediaRuns
	};
	const totalActive = Object.values(counts).reduce((total, count) => total + count, 0);
	const blockers = snapshot.blockers;
	const summary = blockers.length === 0 ? "safe to restart now" : `restart deferred: ${blockers.map((blocker) => blocker.message).join("; ")}`;
	return {
		safe: totalActive === 0,
		counts: {
			...counts,
			totalActive
		},
		blockers,
		summary
	};
}
/** Schedule a gateway restart after collecting tracked active-work blockers. */
function scheduleSafeGatewayRestart(opts = {}) {
	const preflight = createSafeGatewayRestartPreflight(opts.inspect);
	const skipDeferral = opts.skipDeferral === true;
	const restart = scheduleGatewayRestart({
		delayMs: opts.delayMs ?? 0,
		reason: opts.reason ?? "gateway.restart.safe",
		...skipDeferral ? {
			preservePendingEmitHooksOnDeferralBypass: true,
			skipDeferral: true
		} : {}
	});
	return {
		ok: true,
		status: restart.coalesced ? "coalesced" : skipDeferral || preflight.safe ? "scheduled" : "deferred",
		preflight,
		restart
	};
}
//#endregion
export { scheduleSafeGatewayRestart as n, createSafeGatewayRestartPreflight as t };
