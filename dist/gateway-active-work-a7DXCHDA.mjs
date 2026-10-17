import { s as getActiveAgentRunContextCount } from "./agent-run-registry-BaxMDLZF.mjs";
import { a as getActiveGatewayRootWorkCount, o as getActiveGatewayRootWorkHolders } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { c as getActiveCronJobCount } from "./active-jobs-BS2UT6i2.mjs";
import { c as getActiveSessionWorkAdmissionCount, s as getActiveSessionLifecycleMutationCount } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { t as getActiveAcpTurnCount } from "./active-turns-uPxFhqSZ.mjs";
import { t as getActiveEmbeddedRunCount } from "./active-run-projections-DHPboQzB.mjs";
import { s as getActiveBackgroundExecSessionCount } from "./bash-process-registry-BsL_e5bm.mjs";
import { a as getActiveMediaGenerationRunCount } from "./media-generation-activity-JkwDNUkC.mjs";
import { t as getTotalPendingReplies } from "./dispatcher-registry-mpEkB3hL.mjs";
import { n as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-CKD08Yo7.mjs";
import { c as getTotalQueueSize } from "./command-queue-CFE60Avj.mjs";
import { n as readLifecycleWriteCustody } from "./lifecycle-write-custody-C2y9H7om.mjs";
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
		totalActive: 0
	};
	counts.totalActive = Object.values(counts).reduce((total, count) => total + count, 0) - (options.ignoreTerminalSessions ? counts.terminalSessions : 0);
	const blockers = [];
	const add = (count, kind, message) => {
		if (count > 0) blockers.push({
			kind,
			count,
			message: `${count} ${message}`
		});
	};
	add(counts.queueSize, "queue", "queued or active operation(s)");
	add(counts.pendingReplies, "reply", "pending reply delivery operation(s)");
	add(counts.embeddedRuns, "embedded-run", "active embedded run(s)");
	add(counts.backgroundExecSessions, "background-exec", "active background exec session(s)");
	add(counts.cronRuns, "cron-run", "active cron run(s)");
	add(counts.agentRuns, "agent-run", "admitted agent run(s)");
	add(counts.acpRuns, "acp-run", "active ACP turn(s)");
	add(counts.mediaRuns, "media-generation", "active media generation(s)");
	const rootRequestHolders = inspectors.getRootRequests && !inspectors.getRootRequestHolders ? [] : resolved.getRootRequestHolders?.() ?? [];
	const rootRequestHolderNames = rootRequestHolders.toSorted().slice(0, 8);
	if (rootRequestHolders.length > rootRequestHolderNames.length) rootRequestHolderNames.push(`+${rootRequestHolders.length - rootRequestHolderNames.length} more`);
	add(counts.rootRequests, "root-request", `active gateway request(s)${rootRequestHolderNames.length > 0 ? `: ${rootRequestHolderNames.join(", ")}` : ""}`);
	add(counts.sessionAdmissions, "session-admission", "admitted session turn(s)");
	add(counts.sessionMutations, "session-mutation", "active session lifecycle mutation(s)");
	add(counts.chatRuns, "chat-run", "active chat run(s)");
	add(counts.queuedTurns, "queued-turn", "queued chat turn(s)");
	add(counts.terminalPersistence, "terminal-persistence", "pending terminal session write(s)");
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
	const timeout = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.max(0, Math.floor(timeoutMs)) : void 0;
	const deadlineAt = timeout === void 0 ? void 0 : Date.now() + timeout;
	while (true) {
		const snapshot = createGatewayActiveWorkSnapshot();
		options.onSnapshot?.(snapshot);
		if (snapshot.idle) return {
			drained: true,
			snapshot
		};
		const remainingMs = deadlineAt === void 0 ? void 0 : deadlineAt - Date.now();
		if (remainingMs !== void 0 && remainingMs <= 0) return {
			drained: false,
			snapshot
		};
		await new Promise((resolve) => {
			setTimeout(resolve, Math.min(GATEWAY_ACTIVE_WORK_POLL_MS, remainingMs ?? Infinity));
		});
	}
}
//#endregion
export { readGatewayMaintenanceWork as n, waitForGatewayActiveWork as r, createGatewayActiveWorkSnapshot as t };
