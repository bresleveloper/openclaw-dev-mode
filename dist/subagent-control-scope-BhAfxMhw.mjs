import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { n as isSystemEventStoreCurrent } from "./system-event-ownership-CHVGbaAW.mjs";
import { E as readTaskBackingInstance } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { A as getSubagentRunsForRequesterSession, j as subagentRuns } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { D as getSubagentSessionListRunsSnapshotForRead, L as withSubagentRunReadSnapshot, a as getLatestLiveSubagentRunByChildSessionKey, v as buildSubagentRunReadIndexFromRuns } from "./subagent-registry-read-C2SIiLpb.mjs";
import { n as findTaskByRunId } from "./task-registry-query-Cb1HIUfX.mjs";
import { r as resolveStoredSubagentCapabilities } from "./subagent-capabilities-CXh51XLK.mjs";
import { n as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-CrNX9EIS.mjs";
import { n as observeSubagentExecution } from "./subagent-execution-observation-DY2StZMb.mjs";
import { t as getTaskExecutionObservation } from "./task-execution-observation-Dq08a4Iy.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-Cb0fH5Ru.mjs";
import { n as captureSubagentListReadContext } from "./subagent-list-CpXlBriY.mjs";
//#region src/agents/subagents/registry/subagent-control-scope.ts
/** Recent-run default window used by subagent control UI/tools. */
const DEFAULT_RECENT_MINUTES = 30;
/** Maximum recent-run window accepted by subagent control UI/tools. */
const MAX_RECENT_MINUTES = 1440;
/** Resolves which subagent runs the caller is allowed to control. */
function resolveSubagentController(params) {
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	const callerRaw = params.agentSessionKey?.trim() || alias;
	const callerSessionKey = resolveInternalSessionKey({
		key: callerRaw,
		alias,
		mainKey
	});
	const controllerAgentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: callerSessionKey,
		agentId: params.agentId
	});
	if (!isSubagentSessionKey(callerSessionKey)) return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId,
		callerSessionKey,
		callerIsSubagent: false,
		controlScope: "children"
	};
	return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId,
		callerSessionKey,
		callerIsSubagent: true,
		controlScope: resolveStoredSubagentCapabilities(callerSessionKey, {
			cfg: params.cfg,
			agentId: controllerAgentId
		}).controlScope
	};
}
function resolveRunRequesterAgentId(entry, cfg) {
	if (entry.requesterAgentId) return entry.requesterAgentId;
	const parsed = parseAgentSessionKey(entry.requesterSessionKey)?.agentId;
	if (parsed || !cfg) return parsed;
	return resolveSubagentRequesterAgentId(cfg, entry);
}
function isSubagentRunVisibleToSession(entry, sessionKey, agentId, cfg) {
	const controllerKey = entry.controllerSessionKey?.trim();
	const requesterKey = entry.requesterSessionKey.trim();
	const requesterAgentId = resolveRunRequesterAgentId(entry, cfg);
	const controllerAgentId = (controllerKey ? parseAgentSessionKey(controllerKey)?.agentId : void 0) ?? requesterAgentId;
	const normalizedAgentId = normalizeAgentId(agentId);
	return controllerKey === sessionKey && controllerAgentId === normalizedAgentId || requesterKey === sessionKey && requesterAgentId === normalizedAgentId;
}
/** Builds one stable snapshot for controlled-run listing and descendant status reads. */
async function buildControlledSubagentRunsReadContext(controllerSessionKey, controllerAgentId, cfg, recentMinutes = 30) {
	const key = controllerSessionKey.trim();
	const agentId = controllerAgentId ?? parseAgentSessionKey(key)?.agentId;
	if (!key || !agentId) return {
		runs: [],
		list: captureSubagentListReadContext([], buildSubagentRunReadIndexFromRuns({ runs: /* @__PURE__ */ new Map() }), /* @__PURE__ */ new Map(), recentMinutes),
		getExecutionObservation: () => ({ state: "unknown" })
	};
	const select = (snapshot) => {
		const index = buildSubagentRunReadIndexFromRuns({
			runs: snapshot,
			inMemoryRuns: subagentRuns.values()
		});
		const visible = [...index.latestRunsByChildSessionKey.values()].filter((entry) => isSubagentRunVisibleToSession(entry, key, agentId, cfg));
		return {
			index,
			runIds: visible.map((entry) => entry.runId),
			sessionKeys: visible.filter((entry) => entry.pauseReason === "sessions_yield").map((entry) => entry.childSessionKey)
		};
	};
	return withSubagentRunReadSnapshot(subagentRuns, select, (selection, snapshot) => buildControlledReadContext(snapshot, selection.index, new Set(selection.runIds), cfg, recentMinutes));
}
function buildControlledReadContext(snapshot, readIndex, visibleIds, cfg, recentMinutes = 30) {
	const runs = [...snapshot.values()].filter((entry) => visibleIds.has(entry.runId));
	const list = captureSubagentListReadContext(runs, readIndex, snapshot, recentMinutes);
	return {
		runs: list.view.latest,
		list,
		getExecutionObservation: (entry) => {
			const taskRunId = entry.taskRunId ?? entry.runId;
			const task = findTaskByRunId(taskRunId);
			const backing = readTaskBackingInstance(task?.detail);
			const requesterAgentId = resolveRunRequesterAgentId(entry, cfg);
			if (task?.runtime === "subagent" && task.runId === taskRunId && task.childSessionKey === entry.childSessionKey && task.requesterSessionKey === entry.requesterSessionKey && requesterAgentId !== void 0 && task.requesterAgentId === requesterAgentId && task.agentId === (parseAgentSessionKey(entry.childSessionKey)?.agentId ?? requesterAgentId) && backing?.runtime === "subagent" && backing.generation === entry.generation) return getTaskExecutionObservation(task);
			return observeSubagentExecution(entry, getSubagentRunsForRequesterSession(entry.childSessionKey));
		}
	};
}
/** Cancellation consumes current ownership facts without hydrating retained result payloads. */
function listControlledSubagentRunFacts(controllerSessionKey, controllerAgentId, cfg) {
	if (!controllerAgentId) return [];
	return [...buildSubagentRunReadIndexFromRuns({ runs: getSubagentSessionListRunsSnapshotForRead(subagentRuns) }).latestRunsByChildSessionKey.values()].filter((entry) => isSubagentRunVisibleToSession(entry, controllerSessionKey, controllerAgentId, cfg));
}
function ensureSubagentControllerOwnsRun(params) {
	const controllerKey = params.entry.controllerSessionKey?.trim();
	const owner = controllerKey || params.entry.requesterSessionKey;
	const ownerStorePath = controllerKey ? params.entry.controllerStorePath : params.entry.requesterStorePath;
	const ownerAgentId = parseAgentSessionKey(owner)?.agentId ?? resolveRunRequesterAgentId(params.entry, params.cfg);
	const controllerAgentId = params.controller.controllerAgentId ?? parseAgentSessionKey(params.controller.controllerSessionKey)?.agentId;
	if (owner === params.controller.controllerSessionKey && ownerAgentId === controllerAgentId && (ownerStorePath === void 0 || isSystemEventStoreCurrent(owner, ownerStorePath, ownerAgentId))) return;
	return "Subagents can only control runs spawned from their own session.";
}
function getLatestOwnedSubagentRun(childSessionKey, agentId, cfg) {
	const ownerFilter = parseAgentSessionKey(childSessionKey) ? void 0 : agentId;
	return getLatestLiveSubagentRunByChildSessionKey(childSessionKey, ownerFilter ? (candidate) => resolveRunRequesterAgentId(candidate, cfg) === ownerFilter : void 0) ?? void 0;
}
function isCurrentSubagentRun(entry, cfg) {
	if (!cfg) return getLatestLiveSubagentRunByChildSessionKey(entry.childSessionKey) === entry;
	return getLatestOwnedSubagentRun(entry.childSessionKey, resolveRunRequesterAgentId(entry, cfg), cfg) === entry;
}
function isSameSubagentRunGeneration(live, snapshot) {
	return live.childSessionKey === snapshot.childSessionKey && live.runId === snapshot.runId && live.generation === snapshot.generation && live.createdAt === snapshot.createdAt;
}
//#endregion
export { getLatestOwnedSubagentRun as a, isSubagentRunVisibleToSession as c, ensureSubagentControllerOwnsRun as i, listControlledSubagentRunFacts as l, MAX_RECENT_MINUTES as n, isCurrentSubagentRun as o, buildControlledSubagentRunsReadContext as r, isSameSubagentRunGeneration as s, DEFAULT_RECENT_MINUTES as t, resolveSubagentController as u };
