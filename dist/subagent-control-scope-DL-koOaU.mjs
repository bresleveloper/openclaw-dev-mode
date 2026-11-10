import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { r as isSystemEventStoreCurrent } from "./system-event-ownership-DAgHWXZ1.mjs";
import { c as execRequestMatches } from "./exec-request-context-CWnK9ayt.mjs";
import { r as resolveSubagentChildAgentId, t as matchesSubagentChildSessionOwner } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { E as getSubagentRunRuntimeKey, O as isSameSubagentRun, j as latestSubagentRun, k as isSameSubagentRunOwner } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, i as getCurrentSubagentRunOwner, l as getSubagentRunsForRequesterSession } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { N as listRunsForControllerFromRuns, T as buildSubagentRunReadIndexFromRuns, a as getSubagentControlRunsSnapshotForRead, b as withSubagentRunReadSnapshot } from "./subagent-registry-state-DBdy-FdI.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey, l as listSubagentRunsForRequester } from "./subagent-registry-read-DY0g8fGW.mjs";
import { r as resolveStoredSubagentCapabilities } from "./subagent-capabilities-l3WVTf-e.mjs";
import { s as isRequesterSettleWakeForRun } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { f as resolveSubagentRequesterAgentId } from "./requester-cron-authority-DgypcQxN.mjs";
import { n as readSubagentExecRequestController, o as captureSubagentRetainedWork } from "./subagent-exec-request-ownership-C-0uyQ3B.mjs";
import { o as resolveInternalSessionKey, s as resolveMainSessionAlias } from "./sessions-resolution-CQXReb8R.mjs";
import "./sessions-helpers-DCz0gP72.mjs";
import { n as resolveSubagentLabel } from "./subagents-utils-DV33DlwQ.mjs";
import { i as observeSubagentExecution, n as captureSubagentListReadContext } from "./subagent-list-DEF_NGEA.mjs";
const MAX_RECENT_MINUTES = 1440;
/** Lifecycle cleanup owns both the requester and its separately scoped controller. */
async function prepareSessionSubagentKillSelection(params) {
	const controller = {
		controllerSessionKey: params.sessionKey,
		controllerAgentId: params.agentId
	};
	const ownsRoot = (entry) => !ensureSubagentControllerOwnsRun({
		cfg: params.cfg,
		controller,
		entry
	}) || entry.requesterSessionKey === params.sessionKey && resolveSubagentRequesterAgentId(params.cfg, entry) === params.agentId;
	const runs = new Map([...listSubagentRunsForRequester(params.sessionKey, { requesterAgentId: params.agentId }), ...listRunsForControllerFromRuns(subagentRuns, params.sessionKey, params.agentId)].map((entry) => [entry.runId, entry]));
	const preparationErrors = [];
	const hasRetainedWork = captureSubagentRetainedWork();
	for (const entry of runs.values()) if (entry.execution.suppressSessionEffects !== true && ownsRoot(entry) && !hasRetainedWork(entry)) runs.delete(entry.runId);
	for (const entry of runs.values()) {
		if (entry.execution.status !== "terminal" || entry.execution.suppressSessionEffects !== true || entry.pauseReason === "sessions_yield" || !ownsRoot(entry)) continue;
		const assertCurrent = () => {
			params.assertCurrent?.();
			const current = getCurrentSubagentRunOwner(subagentRuns, entry);
			if (!current || !ownsRoot(current) || current.execution.status !== "terminal" || current.execution.suppressSessionEffects !== true || current.pauseReason === "sessions_yield") throw new Error("Subagent completion changed during session cleanup; retry.");
		};
		try {
			const { cancelSubagentRequesterSettleWake } = await import("./subagent-registry-BSZR34Tv.mjs");
			assertCurrent();
			await cancelSubagentRequesterSettleWake(entry, assertCurrent);
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			preparationErrors.push(`${resolveSubagentLabel(entry)}: ${formatErrorMessage(error)}`);
		}
		const current = getCurrentSubagentRunOwner(subagentRuns, entry);
		if (current && hasRetainedWork(current)) runs.set(entry.runId, current);
		else runs.delete(entry.runId);
	}
	return {
		cfg: params.cfg,
		assertCurrent: params.assertCurrent,
		runs: runs.values(),
		ownsRoot,
		suppressTaskDelivery: true,
		preparationErrors
	};
}
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
function listControlledSubagentRunsForTurn(cfg, controller, requesterTurnRunId) {
	const controlledRuns = listRunsForControllerFromRuns(subagentRuns, controller.controllerSessionKey).filter((entry) => !ensureSubagentControllerOwnsRun({
		cfg,
		controller,
		entry
	}));
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
/** Freeze native owners before cancellation yields; routed IDs never grant control. */
function captureExecRequestSubagentSelection(params) {
	const owners = new Set(params.owners);
	const origin = params.requesterTurnRunId === void 0 ? params.sessionOrigin ?? params.candidateOrigin : void 0;
	if (origin && (origin.target.sessionKey !== params.controller.controllerSessionKey || origin.target.agentId !== params.controller.controllerAgentId)) throw new Error("Native Stop origin does not match its admitted controller.");
	const acceptsOrigin = (owner) => Boolean(origin && execRequestMatches(owner, origin.target) && origin.acceptsRequest(owner.identity));
	const turnIds = params.requesterTurnRunId ? [.../* @__PURE__ */ new Set([params.requesterTurnRunId, ...params.owners.flatMap((owner) => [...owner.turnRunIds])])] : [void 0];
	const selected = /* @__PURE__ */ new Map();
	const capture = (entry, controller, requestOwners) => {
		const key = getSubagentRunRuntimeKey(entry);
		const existing = selected.get(key);
		if (existing) {
			if (params.acceptsRequest && requestOwners) existing.requestOwners = requestOwners;
			return false;
		}
		selected.set(key, {
			entry,
			controller,
			requestOwners
		});
		return true;
	};
	const selectPublishedRoot = (entry) => {
		const controller = readSubagentExecRequestController(entry, (owner) => owners.has(owner) && (params.acceptsRequest?.(owner.identity) ?? true));
		return controller !== void 0 && capture(entry, controller, owners);
	};
	let selectedByOrigin = false;
	for (const runId of turnIds) for (const entry of listControlledSubagentRunsForTurn(params.cfg, params.controller, runId)) capture(entry, params.controller);
	if (owners.size > 0 || origin) for (const entry of subagentRuns.values()) {
		const controller = readSubagentExecRequestController(entry, (owner) => owners.has(owner));
		if (controller) capture(entry, controller, owners);
		else if (origin) {
			const originOwners = /* @__PURE__ */ new Set();
			const originController = readSubagentExecRequestController(entry, (owner) => {
				if (!acceptsOrigin(owner)) return false;
				originOwners.add(owner);
				return true;
			});
			if (originController) selectedByOrigin = capture(entry, originController, originOwners) || selectedByOrigin;
		}
	}
	return {
		runs: [...selected.values()].map(({ entry }) => entry),
		selectPublishedRoot: owners.size > 0 ? selectPublishedRoot : void 0,
		sessionGeneration: selectedByOrigin ? params.sessionOrigin?.target : void 0,
		ownsRoot(entry) {
			const captured = selected.get(getSubagentRunRuntimeKey(entry));
			return Boolean(captured && isSameSubagentRunOwner(entry, captured.entry) && (!captured.requestOwners || readSubagentExecRequestController(entry, (owner) => captured.requestOwners?.has(owner) === true && (params.acceptsRequest?.(owner.identity) ?? true))) && !ensureSubagentControllerOwnsRun({
				cfg: params.cfg,
				controller: captured.controller,
				entry
			}));
		}
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
function selectControlledSubagentRunFacts(index, sessionKey, agentId, cfg) {
	return [...index.runsByChildSessionKey.values()].flatMap((runs) => runs.filter((entry) => isSubagentRunVisibleToSession(entry, sessionKey, agentId, cfg) && (resolveSubagentChildAgentId(entry) === void 0 || latestSubagentRun(runs, (candidate) => matchesSubagentChildSessionOwner(candidate, entry.childSessionKey, entry.childAgentId)) === entry)));
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
	return selectControlledSubagentRunFacts(buildSubagentRunReadIndexFromRuns({ runs: getSubagentControlRunsSnapshotForRead(controllerSessionKey) }), controllerSessionKey, controllerAgentId, cfg);
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
function getLatestOwnedSubagentRun(childSessionKey, agentId, _cfg) {
	const key = childSessionKey.trim();
	return getLatestLiveSubagentRunByChildSessionKey(key, void 0, agentId) ?? void 0;
}
function isCurrentSubagentRun(entry, cfg) {
	return isSameSubagentRunOwner(getLatestOwnedSubagentRun(entry.childSessionKey, resolveSubagentChildAgentId(entry), cfg), entry);
}
//#endregion
export { getLatestOwnedSubagentRun as a, listControlledSubagentRunFacts as c, resolveSubagentControllerIdentity as d, ensureSubagentControllerOwnsRun as i, prepareSessionSubagentKillSelection as l, buildControlledSubagentRunsReadContext as n, isCurrentSubagentRun as o, captureExecRequestSubagentSelection as r, isSubagentRunVisibleToSession as s, MAX_RECENT_MINUTES as t, resolveSubagentController as u };
