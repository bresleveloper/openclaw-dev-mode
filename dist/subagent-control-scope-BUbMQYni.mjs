import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { r as isSystemEventStoreCurrent } from "./system-event-ownership-BkQcgSZJ.mjs";
import { C as latestSubagentRun, D as matchesSubagentChildSessionOwner, S as isSameSubagentRunOwner, x as isSameSubagentRun } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { r as resolveStoredSubagentCapabilities } from "./subagent-capabilities-wl-IV_LE.mjs";
import { o as getSubagentRunsForRequesterSession, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { u as getSubagentSessionListRunsSnapshotForRead, y as withSubagentRunReadSnapshot } from "./subagent-registry-state-CVSclnHX.mjs";
import { s as isRequesterSettleWakeForRun } from "./subagent-requester-settle-identity-Blu5INx9.mjs";
import { n as buildSubagentRunReadIndexFromRuns } from "./subagent-registry-queries-rT6zMXb5.mjs";
import { c as listSubagentRunsForController, i as getLatestLiveSubagentRunByChildSessionKey, l as listSubagentRunsForRequester } from "./subagent-registry-read-BE_xWkJl.mjs";
import { t as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-DUxJU45s.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-xzpaoE7C.mjs";
import "./sessions-helpers-CULwdUYq.mjs";
import { i as observeSubagentExecution, n as captureSubagentListReadContext } from "./subagent-list-BCU-0paG.mjs";
//#region src/agents/subagents/registry/subagent-control-scope.ts
const DEFAULT_RECENT_MINUTES = 30;
const MAX_RECENT_MINUTES = 1440;
/** Resolve caller routing before preparing its persisted capability facts. */
function resolveSubagentControllerIdentity(params) {
	const { alias } = resolveMainSessionAlias(params.cfg);
	const callerRaw = params.agentSessionKey?.trim() || alias;
	const callerSessionKey = resolveInternalSessionKey({
		key: callerRaw,
		alias
	});
	return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId: resolveSessionAgentId({
			config: params.cfg,
			sessionKey: callerSessionKey,
			agentId: params.agentId
		}),
		callerSessionKey,
		callerIsSubagent: isSubagentSessionKey(callerSessionKey)
	};
}
function resolveSubagentController(params) {
	const identity = resolveSubagentControllerIdentity(params);
	if (!identity.callerIsSubagent) return {
		...identity,
		controlScope: "children"
	};
	const capabilities = resolveStoredSubagentCapabilities(identity.callerSessionKey, {
		cfg: params.cfg,
		agentId: identity.controllerAgentId,
		store: params.capabilityStore
	});
	return {
		...identity,
		controlScope: capabilities.controlScope
	};
}
function listControlledSubagentRunsForTurn(controller, requesterTurnRunId) {
	const controlledRuns = listSubagentRunsForController(controller.controllerSessionKey, controller.controllerAgentId);
	if (requesterTurnRunId === void 0) return controlledRuns;
	const requesterRuns = listSubagentRunsForRequester(controller.controllerSessionKey, { requesterAgentId: controller.controllerAgentId });
	const runsById = new Map(requesterRuns.filter((entry) => isSameSubagentRun(getLatestLiveSubagentRunByChildSessionKey(entry.childSessionKey, void 0, entry.childAgentId), entry)).map((entry) => [entry.runId, entry]));
	return controlledRuns.filter((entry) => entry.requesterTurnRunId === requesterTurnRunId || isRequesterSettleWakeForRun({
		entry,
		runId: requesterTurnRunId,
		requesterSessionKey: controller.controllerSessionKey,
		requesterAgentId: controller.controllerAgentId,
		runsById
	}));
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
function selectControlledSubagentRunFacts(index, sessionKey, agentId, cfg) {
	return [...index.runsByChildSessionKey.values()].flatMap((runs) => runs.filter((entry) => isSubagentRunVisibleToSession(entry, sessionKey, agentId, cfg) && (entry.childAgentId === void 0 ? index.latestRunsByChildSessionKey.get(entry.childSessionKey.trim()) : latestSubagentRun(runs, (candidate) => matchesSubagentChildSessionOwner(candidate, entry.childSessionKey, entry.childAgentId))) === entry));
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
			inMemoryRuns: [...snapshot.keys()].flatMap((id) => subagentRuns.get(id) ?? [])
		});
		const visible = selectControlledSubagentRunFacts(index, key, agentId, cfg);
		return {
			index,
			runIds: visible.map((entry) => entry.runId),
			sessionKeys: visible.filter((entry) => entry.pauseReason === "sessions_yield").map((entry) => entry.childSessionKey)
		};
	};
	return withSubagentRunReadSnapshot(subagentRuns, select, (selection, snapshot) => {
		const visibleIds = new Set(selection.runIds);
		const runs = [...snapshot.values()].filter((entry) => visibleIds.has(entry.runId));
		const list = captureSubagentListReadContext(runs, selection.index, snapshot, recentMinutes);
		return {
			runs: list.view.latest,
			list,
			getExecutionObservation: (entry) => observeSubagentExecution(entry, getSubagentRunsForRequesterSession(entry.childSessionKey))
		};
	}, {
		sessionKeys: [key],
		descendants: true
	});
}
/** Cancellation consumes current ownership facts without hydrating retained result payloads. */
function listControlledSubagentRunFacts(controllerSessionKey, controllerAgentId, cfg) {
	if (!controllerAgentId) return [];
	return selectControlledSubagentRunFacts(buildSubagentRunReadIndexFromRuns({ runs: getSubagentSessionListRunsSnapshotForRead(subagentRuns) }), controllerSessionKey, controllerAgentId, cfg);
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
	const key = childSessionKey.trim();
	const owner = agentId === void 0 || parseAgentSessionKey(key) ? void 0 : normalizeAgentIdStrict(agentId);
	return getLatestLiveSubagentRunByChildSessionKey(key, owner === void 0 ? void 0 : (candidate) => owner.ok && matchesSubagentChildSessionOwner(candidate, key, owner.value) && (candidate.childAgentId !== void 0 || resolveRunRequesterAgentId(candidate, cfg) === owner.value)) ?? void 0;
}
function isCurrentSubagentRun(entry, cfg) {
	return isSameSubagentRunOwner(getLatestOwnedSubagentRun(entry.childSessionKey, entry.childAgentId ?? resolveRunRequesterAgentId(entry, cfg), cfg), entry);
}
//#endregion
export { getLatestOwnedSubagentRun as a, listControlledSubagentRunFacts as c, resolveSubagentControllerIdentity as d, ensureSubagentControllerOwnsRun as i, listControlledSubagentRunsForTurn as l, MAX_RECENT_MINUTES as n, isCurrentSubagentRun as o, buildControlledSubagentRunsReadContext as r, isSubagentRunVisibleToSession as s, DEFAULT_RECENT_MINUTES as t, resolveSubagentController as u };
