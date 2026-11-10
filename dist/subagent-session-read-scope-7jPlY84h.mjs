import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as resolveSubagentChildAgentId, t as matchesSubagentChildSessionOwner } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { r as normalizeAgentRunTerminalReplySnapshot } from "./agent-run-terminal-reply-Cj4mTBR2.mjs";
//#region src/agents/subagents/registry/subagent-run-generation.ts
/** Durable execution identity is independent of the host runtime incarnation. */
function getSubagentRunIdentity(entry) {
	return JSON.stringify([
		entry.runId,
		entry.taskRunId ?? entry.runId,
		normalizeGeneration(entry),
		entry.createdAt,
		entry.childSessionKey,
		entry.childAgentId,
		entry.requesterSessionKey,
		entry.requesterAgentId,
		entry.requesterStorePath
	]);
}
function isSameSubagentRun(current, expected) {
	return Boolean(current && expected && getSubagentRunIdentity(current) === getSubagentRunIdentity(expected));
}
const runtimeKeys = /* @__PURE__ */ new WeakMap();
/** A host execution incarnation survives metadata copies, but not Gateway recovery adoption. */
function getSubagentRunRuntimeKey(entry) {
	let key = runtimeKeys.get(entry);
	if (!key) {
		key = {};
		runtimeKeys.set(entry, key);
	}
	return key;
}
/** Row producers associate aliases before retaining them or publishing an immutable copy. */
function bindSubagentRunRuntimeKey(entry, key) {
	runtimeKeys.set(entry, key);
}
/** Hydration keeps an existing host incarnation unless its producer supplied a fresh one. */
function retainSubagentRunRuntimeOwner(current, next) {
	if (!runtimeKeys.has(next)) bindSubagentRunRuntimeKey(next, current && isSameSubagentRun(current, next) ? getSubagentRunRuntimeKey(current) : {});
}
/** Accepted collector launch changes its address, not its queued physical execution. */
function isQueuedSubagentRunRekey(previous, next) {
	const alias = previous.swarmRunId ?? previous.runId;
	return previous.runId !== next.runId && previous.collect === true && next.collect === true && next.swarmRunId === alias && (previous.schedulerSlotId ?? alias) === (next.schedulerSlotId ?? next.swarmRunId) && (previous.taskRunId ?? alias) === (next.taskRunId ?? next.swarmRunId) && normalizeGeneration(previous) === normalizeGeneration(next) && previous.createdAt === next.createdAt && previous.childSessionKey === next.childSessionKey && previous.childAgentId === next.childAgentId && previous.requesterSessionKey === next.requesterSessionKey && previous.requesterAgentId === next.requesterAgentId && previous.requesterStorePath === next.requesterStorePath;
}
function isSameSubagentRunOwner(current, expected) {
	if (!current || !expected) return false;
	if (current === expected) return true;
	const key = runtimeKeys.get(current);
	return key !== void 0 && key === runtimeKeys.get(expected) && (isSameSubagentRun(current, expected) || isQueuedSubagentRunRekey(expected, current) || isQueuedSubagentRunRekey(current, expected));
}
/** The live row when `observed`'s owner still holds its run id; otherwise `observed` itself. */
function currentSubagentRunOrObserved(runs, observed) {
	const current = runs.get(observed.runId);
	return current && isSameSubagentRunOwner(current, observed) ? current : observed;
}
function copySubagentRunRuntimeOwner(source, copy) {
	bindSubagentRunRuntimeKey(copy, getSubagentRunRuntimeKey(source));
	return copy;
}
function normalizeGeneration(entry) {
	return asFiniteNumber(entry.generation) ?? 0;
}
/** Orders runs that share a child session, including legacy rows without a generation. */
function compareSubagentRunGeneration(left, right) {
	const generationDelta = normalizeGeneration(left) - normalizeGeneration(right);
	if (generationDelta !== 0) return generationDelta;
	const createdAtDelta = left.createdAt - right.createdAt;
	if (createdAtDelta !== 0) return createdAtDelta;
	return left.runId.localeCompare(right.runId);
}
/** Keeps the newest generation at the grouping key prepared by the caller. */
function recordLatestSubagentRun(map, key, entry) {
	const existing = map.get(key);
	if (!existing || compareSubagentRunGeneration(entry, existing) > 0) map.set(key, entry);
}
/** Selects the newest matching generation from an existing group. */
function latestSubagentRun(runs, matches) {
	let latest;
	for (const entry of runs) if ((!matches || matches(entry)) && (!latest || compareSubagentRunGeneration(entry, latest) > 0)) latest = entry;
	return latest;
}
function isSubagentRunGenerationCandidate(entry, childSessionKey, childAgentId) {
	return entry.childSessionKey === childSessionKey && (!resolveSubagentChildAgentId(entry) || matchesSubagentChildSessionOwner(entry, childSessionKey, childAgentId));
}
/** Allocates a durable monotonic generation within one child session. */
function nextSubagentRunGeneration(runs, childSessionKey, childAgentId) {
	let generation = 0;
	for (const entry of runs) if (isSubagentRunGenerationCandidate(entry, childSessionKey, childAgentId)) generation = Math.max(generation, normalizeGeneration(entry));
	return generation + 1;
}
//#endregion
//#region src/agents/subagents/registry/subagent-delivery-state.ts
function resetRequesterSettleWakeRetry(wake) {
	return {
		...wake,
		status: "pending",
		attemptCount: 0,
		replayCount: void 0,
		nextAttemptAt: void 0,
		deferralCount: void 0,
		lastError: void 0
	};
}
/** A pause uses the existing retry owner, but never consumes the completion cohort. */
function consumeSubagentPauseNotice(entry) {
	const wake = entry.requesterSettleWake;
	if (entry.pauseReason !== "sessions_yield" || !wake?.pauseNotice) return false;
	const { pauseNotice: _notice, ...completionWake } = wake;
	entry.requesterSettleWake = resetRequesterSettleWakeRetry(completionWake);
	return true;
}
function projectSubagentRunForSessionList(entry) {
	return {
		runId: entry.runId,
		...entry.taskRunId !== void 0 ? { taskRunId: entry.taskRunId } : {},
		...entry.pauseReason ? { pauseReason: entry.pauseReason } : {},
		...entry.swarmRunId ? { swarmRunId: entry.swarmRunId } : {},
		...entry.schedulerSlotId ? { schedulerSlotId: entry.schedulerSlotId } : {},
		...entry.swarmLaunchReplayKey ? { swarmLaunchReplayKey: entry.swarmLaunchReplayKey } : {},
		childSessionKey: entry.childSessionKey,
		...entry.childAgentId ? { childAgentId: entry.childAgentId } : {},
		...entry.controllerSessionKey ? { controllerSessionKey: entry.controllerSessionKey } : {},
		requesterSessionKey: entry.requesterSessionKey,
		requesterStorePath: entry.requesterStorePath,
		controllerStorePath: entry.controllerStorePath,
		...entry.collect ? {
			collect: true,
			groupId: entry.groupId,
			swarmRequesterSessionKey: entry.swarmRequesterSessionKey
		} : {},
		...entry.collectorCompletion ? { collectorCompletion: { status: entry.collectorCompletion.status } } : {},
		...entry.requesterAgentId ? { requesterAgentId: entry.requesterAgentId } : {},
		...entry.model ? { model: entry.model } : {},
		...entry.generation !== void 0 ? { generation: entry.generation } : {},
		createdAt: entry.createdAt,
		execution: {
			status: entry.execution.status,
			...entry.execution.interruptionReason ? { interruptionReason: entry.execution.interruptionReason } : {},
			...entry.execution.startedAt !== void 0 ? { startedAt: entry.execution.startedAt } : {},
			...entry.execution.endedAt !== void 0 ? { endedAt: entry.execution.endedAt } : {},
			...entry.execution.outcome ? { outcome: { status: entry.execution.outcome.status } } : {}
		},
		...entry.sessionStartedAt !== void 0 ? { sessionStartedAt: entry.sessionStartedAt } : {},
		...entry.accumulatedRuntimeMs !== void 0 ? { accumulatedRuntimeMs: entry.accumulatedRuntimeMs } : {},
		...entry.runTimeoutSeconds !== void 0 ? { runTimeoutSeconds: entry.runTimeoutSeconds } : {},
		...entry.endedReason ? { endedReason: entry.endedReason } : {},
		...entry.cleanupCompletedAt !== void 0 ? { cleanupCompletedAt: entry.cleanupCompletedAt } : {},
		...entry.delivery ? { delivery: {
			status: entry.delivery.status,
			...entry.delivery.disposition === "intentional_non_delivery" ? { disposition: entry.delivery.disposition } : {},
			...entry.delivery.suspendedAt !== void 0 ? { suspendedAt: entry.delivery.suspendedAt } : {}
		} } : {}
	};
}
function normalizeSubagentRunState(entry) {
	entry.taskRunId = normalizeOptionalString(entry.taskRunId);
	const requesterTurnRunId = normalizeOptionalString(entry.requesterTurnRunId);
	entry.requesterTurnRunId = requesterTurnRunId;
	entry.requesterTurnYielded = requesterTurnRunId && entry.requesterTurnYielded === true ? true : void 0;
	entry.retireAfterRequesterTurn = requesterTurnRunId && entry.retireAfterRequesterTurn === true ? true : void 0;
	entry.generation = asPositiveSafeInteger(entry.generation);
	entry.deleteCleanupDispatchedAt = Number.isFinite(entry.deleteCleanupDispatchedAt) ? entry.deleteCleanupDispatchedAt : void 0;
	entry.suppressCompletionDelivery = entry.suppressCompletionDelivery === true ? true : void 0;
	entry.terminalOwner = entry.terminalOwner === "interrupted-recovery" && Number.isFinite(entry.execution.endedAt) && entry.execution.outcome?.status === "error" && entry.endedReason === "subagent-error" && entry.pauseReason !== "sessions_yield" ? "interrupted-recovery" : void 0;
	if (entry.completion) entry.completion.terminalReply = normalizeAgentRunTerminalReplySnapshot(entry.completion.terminalReply);
	const killReconciliation = entry.killReconciliation;
	if (!killReconciliation || typeof killReconciliation !== "object" || !Number.isFinite(killReconciliation.killedAt)) delete entry.killReconciliation;
	else entry.killReconciliation = {
		killedAt: killReconciliation.killedAt,
		taskCancellationAccepted: killReconciliation.taskCancellationAccepted === true ? true : void 0,
		suppressTaskDelivery: killReconciliation.suppressTaskDelivery === true ? true : void 0,
		supersededAt: Number.isFinite(killReconciliation.supersededAt) ? killReconciliation.supersededAt : void 0
	};
	const killIntent = entry.killIntent;
	if (!killIntent || typeof killIntent !== "object" || !Number.isFinite(killIntent.requestedAt) || typeof killIntent.reason !== "string" || !killIntent.reason.trim()) delete entry.killIntent;
	else entry.killIntent = {
		requestedAt: killIntent.requestedAt,
		reason: killIntent.reason.trim(),
		lifecycleGeneration: normalizeOptionalString(killIntent.lifecycleGeneration),
		sessionId: normalizeOptionalString(killIntent.sessionId),
		sessionLifecycleRevision: normalizeOptionalString(killIntent.sessionLifecycleRevision),
		suppressTaskDelivery: killIntent.suppressTaskDelivery === true ? true : void 0
	};
	if (entry.cleanupHandled === true && typeof entry.cleanupCompletedAt !== "number" && entry.delivery?.status !== "discarded") entry.cleanupHandled = false;
	return entry;
}
function ensureCompletionState(entry) {
	entry.completion ??= { required: entry.expectsCompletionMessage === true };
	return entry.completion;
}
function ensureDeliveryState(entry) {
	entry.delivery ??= { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
	return entry.delivery;
}
function clearDeliveryState(entry) {
	entry.delivery = { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
}
function isDeliverySuspended(entry) {
	return entry.delivery?.status === "suspended" && typeof entry.delivery.suspendedAt === "number";
}
/** A finished requester without its required message receipt must not execute again implicitly. */
function isCompletedRequesterDeliveryBlocked(entry) {
	return isDeliverySuspended(entry) && entry.delivery?.suspendedReason === "permanent_failure" && entry.delivery.lastDropReason === "message_tool_delivery_missing";
}
/** Returns true when required delivery still owns the row after its child session is gone. */
function hasRetainedRequiredCompletionDelivery(entry) {
	const delivery = entry.delivery;
	if (entry.expectsCompletionMessage !== true || entry.suppressCompletionDelivery === true || entry.completion?.required !== true || !delivery?.payload) return false;
	if (isDeliverySuspended(entry)) return true;
	if (delivery.status === "in_progress") return true;
	return delivery.status === "pending" && delivery.disposition !== "ambiguous" && delivery.disposition !== "intentional_non_delivery" && delivery.disposition !== "permanent_failure";
}
function getDeliveryLastError(entry) {
	const error = entry.delivery?.lastError;
	return typeof error === "string" && error.trim() ? error : void 0;
}
const markRequesterSettleWakePending = (entry, options) => {
	const existing = entry.requesterSettleWake;
	entry.requesterSettleWake = {
		...structuredClone(existing),
		status: existing?.status ?? "pending",
		attemptCount: existing?.attemptCount ?? 0,
		...existing?.retireAfterSettle === true || options?.retireAfterSettle === true ? { retireAfterSettle: true } : {}
	};
};
const clearSubagentPendingDelivery = (entry) => {
	const delivery = ensureDeliveryState(entry);
	delivery.payload = void 0;
	delivery.createdAt = void 0;
	delivery.lastAttemptAt = void 0;
	delivery.nextAttemptAt = void 0;
	delivery.attemptCount = void 0;
	delivery.lastError = void 0;
	delivery.suspendedAt = void 0;
	delivery.suspendedReason = void 0;
	if (delivery.status !== "delivered" && delivery.status !== "failed") clearDeliveryState(entry);
};
const loadPendingFinalDeliveryPayload = (entry) => {
	return {
		requesterSessionKey: entry.delivery?.payload?.requesterSessionKey ?? entry.requesterSessionKey,
		requesterOrigin: entry.delivery?.payload?.requesterOrigin ?? entry.requesterOrigin,
		requesterDisplayKey: entry.delivery?.payload?.requesterDisplayKey ?? entry.requesterDisplayKey,
		childSessionKey: entry.delivery?.payload?.childSessionKey ?? entry.childSessionKey,
		childRunId: entry.delivery?.payload?.childRunId ?? entry.runId,
		task: entry.delivery?.payload?.task ?? entry.task,
		label: entry.delivery?.payload?.label ?? entry.label,
		startedAt: entry.delivery?.payload?.startedAt ?? entry.execution.startedAt,
		endedAt: entry.delivery?.payload?.endedAt ?? entry.execution.endedAt,
		outcome: entry.delivery?.payload?.outcome ?? entry.execution.outcome,
		expectsCompletionMessage: entry.delivery?.payload?.expectsCompletionMessage ?? entry.expectsCompletionMessage,
		completionTarget: entry.completionTarget,
		completionRequesterSessionId: entry.completionRequesterSessionId,
		spawnMode: entry.delivery?.payload?.spawnMode ?? entry.spawnMode,
		wakeOnDescendantSettle: entry.delivery?.payload?.wakeOnDescendantSettle ?? entry.wakeOnDescendantSettle,
		terminalReply: entry.completion?.terminalReply ?? entry.delivery?.payload?.terminalReply
	};
};
function transitionRequesterSettleWakeState(entry, state) {
	entry.requesterSettleWake = {
		...state,
		...entry.requesterSettleWake?.progressOperationId ? { progressOperationId: entry.requesterSettleWake.progressOperationId } : {},
		...entry.requesterSettleWake?.retireAfterSettle === true ? { retireAfterSettle: true } : {}
	};
}
function completeRequesterSettleWakeState(entry) {
	let retire = false;
	if (entry.pauseReason !== "sessions_yield") {
		if (entry.requesterTurnRunId && entry.expectsCompletionMessage === true) entry.retireAfterRequesterTurn = entry.retireAfterRequesterTurn === true || entry.requesterSettleWake?.retireAfterSettle === true ? true : void 0;
		else retire = entry.requesterSettleWake?.retireAfterSettle === true;
	}
	entry.requesterSettleWake = void 0;
	return retire;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-topology.ts
const NO_DESCENDANTS = Object.freeze([]);
function updateIndex(index, key, value) {
	if (value === void 0) index.delete(key);
	else index.set(key, value);
}
function resolveControllerSessionKey(entry) {
	return entry.controllerSessionKey?.trim() || entry.requesterSessionKey;
}
/** Mutable membership belongs to the resident index; query windows own time and liveness. */
function buildSubagentRunReadTopology(params) {
	const { runs } = params;
	const inMemoryDisplayByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByChildSessionKey = /* @__PURE__ */ new Map();
	const latestRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByControllerSessionKey = /* @__PURE__ */ new Map();
	const swarmRunsByRequesterSessionKey = /* @__PURE__ */ new Map();
	const latestRunByRequesterAndChildSessionKey = /* @__PURE__ */ new Map();
	const descendantsBySessionKey = /* @__PURE__ */ new Map();
	let revision = {};
	const snapshotRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const memoryRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const memoryChildKeys = /* @__PURE__ */ new Map();
	const runKeys = /* @__PURE__ */ new Map();
	const groupingKeys = (entry) => [
		entry.childSessionKey.trim(),
		resolveControllerSessionKey(entry),
		entry.collect && entry.groupId ? entry.swarmRequesterSessionKey ?? "" : "",
		entry.requesterSessionKey
	];
	const positionsByIndex = /* @__PURE__ */ new Map();
	const updateBucket = (index, key, runId, entry) => {
		if (!key) return;
		const rows = index.get(key) ?? [];
		let positions = positionsByIndex.get(index);
		if (!positions) {
			positions = /* @__PURE__ */ new Map();
			positionsByIndex.set(index, positions);
		}
		const position = positions.get(runId);
		if (position !== void 0) {
			if (entry) rows[position] = entry;
			else {
				rows.splice(position, 1);
				positions.delete(runId);
				for (let next = position; next < rows.length; next++) {
					const row = rows[next];
					if (row) positions.set(row.runId, next);
				}
			}
		} else if (entry) {
			positions.set(runId, rows.length);
			rows.push(entry);
		}
		updateIndex(index, key, rows.length ? rows : void 0);
	};
	for (const entry of params.inMemoryRuns ?? []) {
		const childSessionKey = entry.childSessionKey.trim();
		memoryChildKeys.set(entry.runId, childSessionKey);
		updateBucket(memoryRunsByChildSessionKey, childSessionKey, entry.runId, entry);
		if (!childSessionKey) continue;
		recordLatestSubagentRun(inMemoryDisplayByChildSessionKey, childSessionKey, entry);
	}
	const inputs = {
		runs,
		inMemoryRuns: new Set(inMemoryDisplayByChildSessionKey.values())
	};
	function patch(changes, inMemoryChanges) {
		descendantsBySessionKey.clear();
		revision = {};
		const affected = /* @__PURE__ */ new Map();
		const touch = (child) => {
			if (child && !affected.has(child)) affected.set(child, new Set((snapshotRunsByChildSessionKey.get(child) ?? []).map((entry) => runKeys.get(entry.runId)?.[3] ?? entry.requesterSessionKey)));
		};
		const groups = [
			snapshotRunsByChildSessionKey,
			runsByControllerSessionKey,
			swarmRunsByRequesterSessionKey
		];
		for (const [runId, entry] of changes) {
			const previous = runKeys.get(runId) ?? [];
			const next = entry ? groupingKeys(entry) : [];
			touch(previous[0] ?? "");
			touch(next[0] ?? "");
			groups.forEach((index, position) => {
				if (previous[position] && previous[position] !== next[position]) updateBucket(index, previous[position], runId);
				updateBucket(index, next[position] ?? "", runId, entry);
			});
			if (entry) {
				if (changes !== runs) runs.set(runId, entry);
				runKeys.set(runId, next);
			} else {
				runs.delete(runId);
				runKeys.delete(runId);
			}
		}
		for (const [runId, entry] of inMemoryChanges) {
			const previous = memoryChildKeys.get(runId) ?? "";
			const next = entry?.childSessionKey.trim() ?? "";
			touch(previous);
			touch(next);
			if (previous !== next) updateBucket(memoryRunsByChildSessionKey, previous, runId);
			updateBucket(memoryRunsByChildSessionKey, next, runId, entry);
			updateIndex(memoryChildKeys, runId, entry ? next : void 0);
		}
		for (const [child, previousRequesters] of affected) {
			const rows = snapshotRunsByChildSessionKey.get(child) ?? [];
			const memory = latestSubagentRun(memoryRunsByChildSessionKey.get(child) ?? []);
			const latest = latestSubagentRun(rows);
			const previousMemory = inMemoryDisplayByChildSessionKey.get(child);
			if (previousMemory !== memory) {
				if (previousMemory) inputs.inMemoryRuns.delete(previousMemory);
				if (memory) inputs.inMemoryRuns.add(memory);
			}
			for (const [index, entry] of [[inMemoryDisplayByChildSessionKey, memory], [latestRunsByChildSessionKey, latest]]) updateIndex(index, child, entry);
			const candidates = [.../* @__PURE__ */ new Set([...rows, ...memory ? [memory] : []])];
			updateIndex(runsByChildSessionKey, child, candidates.length ? candidates : void 0);
			const byRequester = /* @__PURE__ */ new Map();
			for (const row of rows) if (row.requesterSessionKey) recordLatestSubagentRun(byRequester, row.requesterSessionKey, row);
			for (const requester of /* @__PURE__ */ new Set([...previousRequesters, ...byRequester.keys()])) {
				const children = latestRunByRequesterAndChildSessionKey.get(requester) ?? /* @__PURE__ */ new Map();
				updateIndex(children, child, byRequester.get(requester));
				updateIndex(latestRunByRequesterAndChildSessionKey, requester, children.size ? children : void 0);
			}
		}
	}
	patch(runs, /* @__PURE__ */ new Map());
	for (const [key, entry] of inMemoryDisplayByChildSessionKey) if (!runsByChildSessionKey.has(key)) runsByChildSessionKey.set(key, [entry]);
	function getDescendantRuns(rootSessionKey) {
		const root = rootSessionKey.trim();
		if (!root || !latestRunByRequesterAndChildSessionKey.has(root)) return NO_DESCENDANTS;
		const cached = descendantsBySessionKey.get(root);
		if (cached) return cached;
		const descendants = [];
		const pending = [root];
		const visited = new Set(pending);
		for (const requester of pending) for (const [childSessionKey, entry] of latestRunByRequesterAndChildSessionKey.get(requester) ?? []) {
			if (latestRunsByChildSessionKey.get(childSessionKey) !== entry) continue;
			descendants.push(entry);
			if (!visited.has(childSessionKey)) {
				visited.add(childSessionKey);
				pending.push(childSessionKey);
			}
		}
		descendantsBySessionKey.set(root, Object.freeze(descendants));
		return descendants;
	}
	return {
		inputs,
		requesterSessionKeys: () => latestRunByRequesterAndChildSessionKey.keys(),
		get revision() {
			return revision;
		},
		getDescendantRuns,
		inMemoryDisplayByChildSessionKey,
		runsByChildSessionKey,
		latestRunsByChildSessionKey,
		runsByControllerSessionKey,
		swarmRunsByRequesterSessionKey,
		patch
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-session-read-scope.ts
function buildChildren(runGroups) {
	const children = /* @__PURE__ */ new Map();
	for (const runs of runGroups) for (const run of runs) {
		const child = run.childSessionKey.trim();
		if (!child) continue;
		const siblings = children.get(run.requesterSessionKey) ?? /* @__PURE__ */ new Set();
		siblings.add(child);
		children.set(run.requesterSessionKey, siblings);
	}
	return children;
}
function collectKeys(sessionKeys, ...childrenForRequester) {
	const selected = new Set(sessionKeys.map((key) => key.trim()).filter(Boolean));
	for (const requester of selected) for (const children of childrenForRequester) for (const child of children(requester)) selected.add(child);
	return selected;
}
/** Select a complete requester closure; the read index still owns generation and liveness policy. */
function collectSubagentSessionReadKeys(sessionKeys, ...runGroups) {
	const children = buildChildren(runGroups);
	return collectKeys(sessionKeys, (requester) => children.get(requester) ?? []);
}
/** Derived membership only; the cache's snapshot Map remains the record owner. */
var SubagentSessionReadLookup = class {
	#memberships = /* @__PURE__ */ new Map();
	#byRunId = /* @__PURE__ */ new Map();
	#byRequesterTurn = /* @__PURE__ */ new Map();
	#sessions;
	#topology;
	#nextOrder = 0;
	constructor(entries = []) {
		for (const [cacheKey, entry] of entries) this.set(cacheKey, entry);
	}
	set(cacheKey, entry) {
		this.#topology = void 0;
		const previous = this.#memberships.get(cacheKey);
		if (!entry) {
			if (previous) {
				this.#index(previous, false);
				this.#memberships.delete(cacheKey);
			}
			return;
		}
		const child = entry.childSessionKey.trim();
		const requester = entry.requesterSessionKey;
		const controller = resolveControllerSessionKey(entry);
		if (previous && previous.runId === entry.runId && previous.swarmRunId === entry.swarmRunId && previous.schedulerSlotId === entry.schedulerSlotId && previous.requesterTurnRunId === entry.requesterTurnRunId && previous.child === child && previous.requester === requester && previous.controller === controller) {
			previous.entry = entry;
			return;
		}
		if (previous) this.#index(previous, false);
		const membership = {
			cacheKey,
			entry,
			runId: entry.runId,
			swarmRunId: entry.swarmRunId,
			schedulerSlotId: entry.schedulerSlotId,
			requesterTurnRunId: entry.requesterTurnRunId,
			child,
			requester,
			controller,
			order: previous?.order ?? this.#nextOrder++
		};
		this.#memberships.set(cacheKey, membership);
		this.#index(membership);
	}
	/** Broad publications invalidate relationships without rebuilding the eager run-ID index. */
	invalidateSessions() {
		this.#sessions = void 0;
		this.#topology = void 0;
	}
	/** Durable comparison bases share immutable links until their row owner changes. */
	captureTopology() {
		return this.#topology ??= Object.freeze([...this.#memberships.values()].map(({ entry: { childSessionKey, requesterSessionKey } }) => Object.freeze({
			childSessionKey,
			requesterSessionKey
		})).toSorted((left, right) => left.childSessionKey.localeCompare(right.childSessionKey) || left.requesterSessionKey.localeCompare(right.requesterSessionKey)));
	}
	#sessionBuckets() {
		if (!this.#sessions) {
			this.#sessions = {
				children: /* @__PURE__ */ new Map(),
				byChild: /* @__PURE__ */ new Map(),
				byController: /* @__PURE__ */ new Map(),
				byOwner: /* @__PURE__ */ new Map()
			};
			for (const membership of this.#memberships.values()) {
				membership.child = membership.entry.childSessionKey.trim();
				membership.requester = membership.entry.requesterSessionKey;
				membership.controller = resolveControllerSessionKey(membership.entry);
				this.#indexSession(membership);
			}
		}
		return this.#sessions;
	}
	#indexSession(membership, add = true) {
		const buckets = this.#sessions;
		if (!buckets) return;
		const { requester, controller, child } = membership;
		for (const owner of /* @__PURE__ */ new Set([requester.trim(), controller.trim()])) this.#updateBucket(buckets.byOwner, owner, membership, add);
		if (child) {
			const children = buckets.children.get(requester) ?? /* @__PURE__ */ new Map();
			const count = (children.get(child) ?? 0) + (add ? 1 : -1);
			if (count > 0) children.set(child, count);
			else children.delete(child);
			if (children.size) buckets.children.set(requester, children);
			else buckets.children.delete(requester);
			this.#updateBucket(buckets.byChild, child, membership, add);
		}
		if (controller) this.#updateBucket(buckets.byController, controller, membership, add);
	}
	selectRunIds(ids, additionalCacheKeys = []) {
		return this.#select(this.#byRunId, ids, additionalCacheKeys);
	}
	selectRequesterTurn(requesterTurnRunId) {
		return this.#select(this.#byRequesterTurn, /* @__PURE__ */ new Set([requesterTurnRunId]));
	}
	selectSessions(sessionKeys, live) {
		const buckets = this.#sessionBuckets();
		const liveBuckets = live.#sessionBuckets();
		const selected = collectKeys(sessionKeys, (requester) => buckets.children.get(requester)?.keys() ?? [], (requester) => liveBuckets.children.get(requester)?.keys() ?? []);
		return {
			sessionKeys: selected,
			cacheKeys: this.#select(buckets.byChild, selected)
		};
	}
	selectChildren(childKeys) {
		return this.#select(this.#sessionBuckets().byChild, childKeys);
	}
	selectControllers(controllerKeys) {
		return this.#select(this.#sessionBuckets().byController, controllerKeys);
	}
	/** Include every generation of selected children, even after an ownership move. */
	selectReadScope(sessionKeys, other, descendants, additionalCacheKeys = []) {
		const owners = new Set(sessionKeys.map((key) => key.trim()).filter(Boolean));
		const children = new Set(descendants ? owners : []);
		const buckets = this.#sessionBuckets();
		const otherBuckets = other.#sessionBuckets();
		for (const owner of owners) for (const lookup of [buckets, otherBuckets]) for (const row of lookup.byOwner.get(owner) ?? []) if (row.child) {
			children.add(row.child);
			if (descendants) owners.add(row.child);
		}
		return [.../* @__PURE__ */ new Set([
			...this.#select(buckets.byOwner, owners),
			...this.selectChildren(children),
			...additionalCacheKeys.filter((key) => this.#memberships.has(key))
		])].toSorted((a, b) => this.#memberships.get(a).order - this.#memberships.get(b).order);
	}
	#select(buckets, keys, additionalCacheKeys = []) {
		const selected = /* @__PURE__ */ new Set();
		for (const key of keys) for (const membership of buckets.get(key) ?? []) selected.add(membership);
		for (const key of additionalCacheKeys) {
			const membership = this.#memberships.get(key);
			if (membership) selected.add(membership);
		}
		if (selected.size === this.#memberships.size) return [...this.#memberships.keys()];
		return [...selected].toSorted((left, right) => left.order - right.order).map((row) => row.cacheKey);
	}
	#updateBucket(buckets, key, membership, add = true) {
		const bucket = buckets.get(key) ?? /* @__PURE__ */ new Set();
		if (add) bucket.add(membership);
		else bucket.delete(membership);
		if (bucket.size) buckets.set(key, bucket);
		else buckets.delete(key);
	}
	#index(membership, add = true) {
		if (membership.requesterTurnRunId) this.#updateBucket(this.#byRequesterTurn, membership.requesterTurnRunId, membership, add);
		for (const id of [
			membership.runId,
			membership.swarmRunId,
			membership.schedulerSlotId
		]) if (id) this.#updateBucket(this.#byRunId, id, membership, add);
		this.#indexSession(membership, add);
	}
};
//#endregion
export { isSubagentRunGenerationCandidate as A, copySubagentRunRuntimeOwner as C, isQueuedSubagentRunRekey as D, getSubagentRunRuntimeKey as E, nextSubagentRunGeneration as M, recordLatestSubagentRun as N, isSameSubagentRun as O, retainSubagentRunRuntimeOwner as P, compareSubagentRunGeneration as S, getSubagentRunIdentity as T, normalizeSubagentRunState as _, clearDeliveryState as a, transitionRequesterSettleWakeState as b, consumeSubagentPauseNotice as c, getDeliveryLastError as d, hasRetainedRequiredCompletionDelivery as f, markRequesterSettleWakePending as g, loadPendingFinalDeliveryPayload as h, resolveControllerSessionKey as i, latestSubagentRun as j, isSameSubagentRunOwner as k, ensureCompletionState as l, isDeliverySuspended as m, collectSubagentSessionReadKeys as n, clearSubagentPendingDelivery as o, isCompletedRequesterDeliveryBlocked as p, buildSubagentRunReadTopology as r, completeRequesterSettleWakeState as s, SubagentSessionReadLookup as t, ensureDeliveryState as u, projectSubagentRunForSessionList as v, currentSubagentRunOrObserved as w, bindSubagentRunRuntimeKey as x, resetRequesterSettleWakeRetry as y };
