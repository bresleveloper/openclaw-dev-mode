import { c as getActiveAgentRunContextCount } from "./agent-run-registry-gmaPgO-n.mjs";
import { c as getActiveGatewayRootWorkHolders, s as getActiveGatewayRootWorkCount } from "./gateway-work-admission-FWbk4b3p.mjs";
import { u as getActiveCronJobCount } from "./active-jobs-CqHAjCGh.mjs";
import { d as getActiveSessionWorkAdmissionCount, u as getActiveSessionLifecycleMutationCount } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { s as getActiveBackgroundExecSessionCount } from "./bash-process-registry-D3AARAgk.mjs";
import { t as getActiveEmbeddedRunCount } from "./active-run-projections-Crpg2l0z.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-CPznLgPI.mjs";
import { t as getActiveAcpTurnCount } from "./active-turns-B6t2-4H3.mjs";
import { o as getActiveMediaGenerationRunCount } from "./media-generation-activity-CdYWMYrm.mjs";
import { n as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BecFApIY.mjs";
import { c as getTotalQueueSize, d as listCommandLaneTotals } from "./command-queue-Dvag6gVL.mjs";
import { n as waitForGatewayDrain } from "./gateway-drain-B-8TjNxn.mjs";
import { n as readLifecycleWriteCustody } from "./lifecycle-write-custody-DbKodwJy.mjs";
//#region src/infra/gateway-active-work.ts
const defaultInspectors = {
	getQueueSize: getTotalQueueSize,
	getPendingReplies: getTotalPendingReplies,
	getEmbeddedRuns: getActiveEmbeddedRunCount,
	getBackgroundExecSessions: getActiveBackgroundExecSessionCount,
	getCronRuns: () => Math.max(getActiveCronJobCount(), getSuspensionVisibleCronTaskRunCount()),
	getAgentRuns: getActiveAgentRunContextCount,
	getAcpRuns: getActiveAcpTurnCount,
	getMediaRuns: getActiveMediaGenerationRunCount,
	getRootRequests: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }),
	getRootRequestHolders: () => getActiveGatewayRootWorkHolders({ excludeCurrent: true }),
	getSessionAdmissions: getActiveSessionWorkAdmissionCount,
	getSessionMutations: getActiveSessionLifecycleMutationCount,
	getChatRuns: () => 0,
	getQueuedTurns: () => 0,
	getTerminalPersistence: () => 0,
	getTerminalSessions: () => 0
};
function normalizeCount(value) {
	return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
/** Cheap projection for status; suspension still uses the complete snapshot below. */
function readGatewayMaintenanceWork(inspectors = {}) {
	const resolved = {
		...defaultInspectors,
		...inspectors
	};
	const writeCustody = readLifecycleWriteCustody();
	const counts = {
		rootRequests: normalizeCount(resolved.getRootRequests()),
		cronRuns: normalizeCount(resolved.getCronRuns()),
		sessionMutations: normalizeCount(resolved.getSessionMutations()),
		terminalPersistence: normalizeCount(resolved.getTerminalPersistence()),
		lifecycleWrites: writeCustody.reduce((sum, fact) => sum + fact.count, 0)
	};
	for (const [phase, count] of [["session-mutation", counts.sessionMutations], ["terminal-persistence", counts.terminalPersistence]]) if (count > 0) writeCustody.push({
		phase,
		count
	});
	return {
		counts,
		writeCustody
	};
}
function createGatewayActiveWorkSnapshot(inspectors = {}, options = {}) {
	const resolved = {
		...defaultInspectors,
		...inspectors
	};
	const maintenance = readGatewayMaintenanceWork(inspectors);
	const counts = {
		queueSize: normalizeCount(resolved.getQueueSize()),
		pendingReplies: normalizeCount(resolved.getPendingReplies()),
		embeddedRuns: normalizeCount(resolved.getEmbeddedRuns()),
		backgroundExecSessions: normalizeCount(resolved.getBackgroundExecSessions()),
		agentRuns: normalizeCount(resolved.getAgentRuns()),
		acpRuns: normalizeCount(resolved.getAcpRuns()),
		mediaRuns: normalizeCount(resolved.getMediaRuns()),
		sessionAdmissions: normalizeCount(resolved.getSessionAdmissions()),
		chatRuns: normalizeCount(resolved.getChatRuns()),
		queuedTurns: normalizeCount(resolved.getQueuedTurns()),
		terminalSessions: normalizeCount(resolved.getTerminalSessions()),
		...maintenance.counts,
		/** Compatibility aggregate. Categories can overlap; use individual counts for diagnostics. */
		totalActive: 0
	};
	counts.totalActive = Object.values(counts).reduce((total, count) => total + count, 0) - (options.ignoreTerminalSessions ? counts.terminalSessions : 0);
	const blockers = [];
	const add = (count, kind, message, getHolders) => {
		if (count > 0) {
			const holders = getHolders?.().toSorted() ?? [];
			const names = holders.slice(0, 8).map((name) => name.replace(/[\r\n\t]/g, " ").slice(0, 256));
			if (holders.length > names.length) names.push(`+${holders.length - names.length} more`);
			blockers.push({
				kind,
				count,
				message: `${count} ${message}${names.length > 0 ? `: ${names.join(", ")}` : ""}`
			});
		}
	};
	add(counts.queueSize, "queue", "queued or active operation(s)", inspectors.getQueueSize ? void 0 : () => listCommandLaneTotals().filter(({ activeCount, queuedCount }) => activeCount + queuedCount > 0).map(({ lane, activeCount, queuedCount }) => `${lane} (active=${activeCount}, queued=${queuedCount})`));
	add(counts.pendingReplies, "reply", "pending reply delivery operation(s)");
	add(counts.embeddedRuns, "embedded-run", "active embedded run(s)");
	add(counts.backgroundExecSessions, "background-exec", "active background exec session(s)");
	add(counts.cronRuns, "cron-run", "active cron run(s)");
	add(counts.agentRuns, "agent-run", "admitted agent run(s)");
	add(counts.acpRuns, "acp-run", "active ACP turn(s)");
	add(counts.mediaRuns, "media-generation", "active media generation(s)");
	add(counts.rootRequests, "root-request", "active gateway request(s)", inspectors.getRootRequests && !inspectors.getRootRequestHolders ? void 0 : resolved.getRootRequestHolders);
	add(counts.sessionAdmissions, "session-admission", "admitted session turn(s)");
	add(counts.sessionMutations, "session-mutation", "active session lifecycle mutation(s)");
	add(counts.chatRuns, "chat-run", "active chat run(s)", resolved.getChatRunHolders);
	add(counts.queuedTurns, "queued-turn", "queued chat turn(s)");
	add(counts.terminalPersistence, "terminal-persistence", "pending terminal session write(s)", resolved.getTerminalPersistenceHolders);
	if (!options.ignoreTerminalSessions) add(counts.terminalSessions, "terminal-session", "open terminal session(s)");
	return {
		idle: counts.totalActive === 0,
		counts,
		blockers,
		writeCustody: maintenance.writeCustody
	};
}
const GATEWAY_ACTIVE_WORK_POLL_MS = 250;
/** Waits for the complete process-wide active-work inventory to become idle. */
async function waitForGatewayActiveWork(timeoutMs, options = {}) {
	return waitForGatewayDrain(createGatewayActiveWorkSnapshot, timeoutMs, {
		...options,
		pollMs: GATEWAY_ACTIVE_WORK_POLL_MS
	});
}
//#endregion
export { readGatewayMaintenanceWork as n, waitForGatewayActiveWork as r, createGatewayActiveWorkSnapshot as t };
