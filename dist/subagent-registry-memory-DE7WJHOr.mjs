import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { f as bindGatewayContextResolver, g as getGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as prepareGatewayContextBindingOwner } from "./gateway-context-binding-owner-bQvbtsTz.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { r as resolveSubagentChildAgentId, t as matchesSubagentChildSessionOwner } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { D as isQueuedSubagentRunRekey, E as getSubagentRunRuntimeKey, O as isSameSubagentRun, P as retainSubagentRunRuntimeOwner, k as isSameSubagentRunOwner, t as SubagentSessionReadLookup, v as projectSubagentRunForSessionList } from "./subagent-session-read-scope-7jPlY84h.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/completion/session-followup-cohort.ts
const owners = resolveGlobalSingleton(Symbol.for("openclaw.sessions.followupCohorts"), () => /* @__PURE__ */ new WeakMap());
function getFollowupCohortOwner(entry) {
	return owners.get(getSubagentRunRuntimeKey(entry));
}
function bindFollowupCohortOwner(entry, owner) {
	owners.set(getSubagentRunRuntimeKey(entry), owner);
}
function transferFollowupCohort(previous, next) {
	if (isSameSubagentRun(previous, next) && !isSameSubagentRunOwner(previous, next)) return;
	const owner = owners.get(getSubagentRunRuntimeKey(previous));
	if (!owner) return;
	owners.set(getSubagentRunRuntimeKey(next), owner);
	owner.replaceCohortEntry(previous, next);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-publication.ts
let revision = 0;
const listeners = {
	projection: /* @__PURE__ */ new Set(),
	persistence: /* @__PURE__ */ new Set()
};
function subscribeSubagentRunChanges(phase, listener) {
	return registerListener(listeners[phase], listener);
}
/** Read projections reuse registry facts until an owner publishes a mutation. */
function getSubagentRegistryPublicationRevision() {
	return revision;
}
function publishSubagentRunChanges(keys, runIds, source = "memory") {
	revision++;
	const event = {
		runIds,
		sessionKeys: keys
	};
	for (const listener of listeners.projection) listener(event);
	if (!keys?.length) sessionChanges.emit({
		all: true,
		scope: "subagent-runs"
	});
	for (const sessionKey of new Set(keys)) if (sessionKey) sessionChanges.emit({
		sessionKey,
		scope: "runtime"
	});
	if (source === "persistence") notifyListeners(listeners.persistence, event);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-work-index.ts
const SUBAGENT_SESSION_RUN_TTL_MS = 3e5;
function needsSubagentActivation(entry) {
	return entry.execution.status !== "terminal" || entry.cleanupCompletedAt === void 0 || entry.terminalOwner === "interrupted-recovery" || entry.delivery?.status === "pending" || entry.delivery?.status === "in_progress" || entry.delivery?.status === "suspended" || Boolean(entry.requesterTurnRunId && entry.expectsCompletionMessage === true || entry.requesterSettleWake || entry.pauseReason || entry.killIntent || entry.killReconciliation || entry.collectorLaunchCleanupPending || entry.execution.restartRecovery);
}
function subagentSweepAt(entry) {
	if (needsSubagentActivation(entry) || entry.delivery?.status === "pending" || entry.delivery?.status === "in_progress" || entry.delivery?.status === "suspended") return 0;
	if (entry.archiveAtMs) return entry.archiveAtMs;
	return entry.cleanup === "keep" && entry.spawnMode !== "session" ? Infinity : (entry.cleanupCompletedAt ?? Infinity) + SUBAGENT_SESSION_RUN_TTL_MS + 1;
}
/** Only registry publication changes membership; time promotes retained cleanup candidates. */
var SubagentRunWorkIndex = class {
	constructor() {
		this.activationRuns = /* @__PURE__ */ new Map();
		this.sweepRuns = /* @__PURE__ */ new Map();
		this.deadlines = /* @__PURE__ */ new Map();
		this.nextSweepAt = Infinity;
	}
	set(runId, entry) {
		if (needsSubagentActivation(entry)) this.activationRuns.set(runId, entry);
		else this.activationRuns.delete(runId);
		this.deadlines.delete(runId);
		const at = subagentSweepAt(entry);
		if (at === 0) this.sweepRuns.set(runId, entry);
		else {
			this.sweepRuns.delete(runId);
			if (at < Infinity) {
				this.deadlines.set(runId, {
					at,
					entry
				});
				this.nextSweepAt = Math.min(this.nextSweepAt, at);
			}
		}
	}
	delete(runId) {
		this.activationRuns.delete(runId);
		this.sweepRuns.delete(runId);
		this.deadlines.delete(runId);
	}
	clear() {
		this.activationRuns.clear();
		this.sweepRuns.clear();
		this.deadlines.clear();
		this.nextSweepAt = Infinity;
	}
	sweepCandidates(now) {
		if (this.nextSweepAt <= now) {
			this.nextSweepAt = Infinity;
			for (const [runId, { at, entry }] of this.deadlines) if (at <= now) {
				this.deadlines.delete(runId);
				this.sweepRuns.set(runId, entry);
			} else this.nextSweepAt = Math.min(this.nextSweepAt, at);
		}
		return this.sweepRuns.values();
	}
};
//#endregion
//#region src/agents/subagents/registry/subagent-registry-memory.ts
function freezeValue(value) {
	if (!value || typeof value !== "object" || Object.isFrozen(value)) return;
	for (const child of Object.values(value)) freezeValue(child);
	Object.freeze(value);
}
const immutableSessionListFacts = /* @__PURE__ */ new WeakMap();
/** A row replacement owns a new projection; retired immutable rows release theirs through GC. */
function immutableSubagentRunSessionList(entry) {
	const prepared = immutableSessionListFacts.get(entry);
	if (prepared) return prepared;
	prepareGatewayContextBindingOwner(entry);
	freezeSubagentRunReadRecord(entry);
	const projection = freezeSubagentRunReadRecord(projectSubagentRunForSessionList(entry));
	immutableSessionListFacts.set(entry, projection);
	return projection;
}
function immutableSubagentRun(entry) {
	immutableSubagentRunSessionList(entry);
	return entry;
}
/** Registry projections contain only canonical JSON fields and owner-created containers. */
function freezeSubagentRunReadRecord(record) {
	freezeValue(record);
	return record;
}
var SubagentRunIndex = class extends Map {
	constructor(keyFor) {
		super();
		this.keyFor = keyFor;
		this.latest = /* @__PURE__ */ new Map();
	}
	update(runId, entry, operation) {
		const key = this.keyFor(entry);
		if (!key) return;
		const indexedRuns = this.get(key);
		if (operation === "remove") {
			if (indexedRuns?.get(runId) !== entry) return;
			indexedRuns.delete(runId);
			if (indexedRuns.size === 0) {
				this.delete(key);
				this.latest.delete(key);
			} else if (this.latest.get(key) === entry) for (const remaining of indexedRuns.values()) this.latest.set(key, remaining);
		} else {
			if (indexedRuns) indexedRuns.set(runId, entry);
			else this.set(key, /* @__PURE__ */ new Map([[runId, entry]]));
			this.latest.set(key, entry);
		}
	}
	getLatest(key) {
		return this.latest.get(key);
	}
	clear() {
		super.clear();
		this.latest.clear();
	}
};
const collectorsByChildSessionOwner = new SubagentRunIndex((entry) => entry.collect === true ? childSessionOwnerKey(entry) : void 0);
const childSessionCandidatesByKey = new SubagentRunIndex((entry) => entry.childSessionKey);
const runsByChildSessionOwner = new SubagentRunIndex(childSessionOwnerKey);
const runsByRequesterSessionKey = new SubagentRunIndex((entry) => entry.requesterSessionKey);
const runsByCollectorGroupKey = new SubagentRunIndex(collectorGroupKey);
const runIndexes = [
	collectorsByChildSessionOwner,
	childSessionCandidatesByKey,
	runsByChildSessionOwner,
	runsByRequesterSessionKey,
	runsByCollectorGroupKey
];
function childSessionOwnerKey(entry) {
	const owner = resolveSubagentChildAgentId(entry);
	return owner ? JSON.stringify([owner, entry.childSessionKey]) : void 0;
}
function collectorGroupKey(entry) {
	if (entry.collect !== true || !entry.groupId) return;
	return JSON.stringify([entry.swarmRequesterSessionKey ?? entry.requesterSessionKey, entry.groupId]);
}
const retirementPublications = /* @__PURE__ */ new WeakMap();
function waitForSubagentRetirementPublication(observed) {
	const entry = getCurrentSubagentRunOwner(subagentRuns, observed) ?? observed;
	const pending = retirementPublications.get(getSubagentRunRuntimeKey(entry));
	if (!pending?.size) return;
	return Promise.all([...pending].map((publication) => publication.promise)).then(() => void 0);
}
function hasPendingSubagentRetirementPublication(observed) {
	const entry = getCurrentSubagentRunOwner(subagentRuns, observed) ?? observed;
	return Boolean(retirementPublications.get(getSubagentRunRuntimeKey(entry))?.size);
}
function completeRetirementPublication(scope) {
	const publication = scope.publication;
	if (publication.settled) return;
	publication.settled = true;
	const pending = retirementPublications.get(getSubagentRunRuntimeKey(publication.entry));
	pending?.delete(publication);
	if (pending?.size === 0) retirementPublications.delete(getSubagentRunRuntimeKey(publication.entry));
	publication.resolve();
}
var SubagentRunMap = class extends Map {
	constructor(..._args) {
		super(..._args);
		this.readLookup = new SubagentSessionReadLookup();
		this.workIndex = new SubagentRunWorkIndex();
		this.retirementScopes = /* @__PURE__ */ new Set();
		this.registrationScopes = /* @__PURE__ */ new Set();
		this.completionAuthorities = /* @__PURE__ */ new Map();
		this.operatorCompletionEntries = /* @__PURE__ */ new WeakSet();
		this.retiredCompletionEntries = /* @__PURE__ */ new WeakSet();
	}
	requireCompletionAuthority(entry) {
		this.operatorCompletionEntries.add(getSubagentRunRuntimeKey(entry));
	}
	hasCompletionAuthority(entry) {
		return this.completionAuthorities.has(getSubagentRunRuntimeKey(entry));
	}
	retireCompletionAuthority(observed) {
		const entry = this.currentValue(observed);
		this.retiredCompletionEntries.add(getSubagentRunRuntimeKey(entry));
		this.releaseCompletionAuthority(entry);
	}
	isCompletionAuthorityRetired(entry) {
		return this.retiredCompletionEntries.has(getSubagentRunRuntimeKey(this.currentValue(entry)));
	}
	currentValue(entry) {
		return getCurrentSubagentRunOwner(this, entry) ?? entry;
	}
	bindCompletionAuthority(observed, authority) {
		const entry = this.currentValue(observed);
		this.operatorCompletionEntries.add(getSubagentRunRuntimeKey(entry));
		authority.assertCurrent();
		if (this.retiredCompletionEntries.has(getSubagentRunRuntimeKey(entry)) && !isSameSubagentRunOwner(this.get(entry.runId), entry)) throw new Error("Subagent completion retry no longer owns its source");
		this.releaseCompletionAuthority(entry);
		this.retiredCompletionEntries.delete(getSubagentRunRuntimeKey(entry));
		const custody = {
			authority,
			entry,
			stop: () => authority.signal.removeEventListener("abort", revoked)
		};
		const revoked = () => this.releaseCompletionAuthority(custody.entry);
		this.completionAuthorities.set(getSubagentRunRuntimeKey(entry), custody);
		authority.signal.addEventListener("abort", revoked, { once: true });
		if (authority.signal.aborted) revoked();
	}
	releaseCompletionAuthority(observed) {
		const entry = this.currentValue(observed);
		const custody = this.completionAuthorities.get(getSubagentRunRuntimeKey(entry));
		this.completionAuthorities.delete(getSubagentRunRuntimeKey(entry));
		custody?.stop();
		custody?.authority.release();
	}
	assertCompletionEntryCurrent(observed) {
		const entry = this.currentValue(observed);
		const current = this.get(entry.runId) ?? this.readLookup.selectRunIds(/* @__PURE__ */ new Set([entry.swarmRunId ?? entry.runId])).map((id) => this.get(id)).find((candidate) => candidate && isQueuedSubagentRunRekey(entry, candidate));
		if (current && !isSameSubagentRunOwner(current, entry)) throw new Error("Subagent completion runtime owner is no longer active");
		if (this.retiredCompletionEntries.has(getSubagentRunRuntimeKey(entry))) throw new Error("Subagent completion requester store was retired");
		if (this.operatorCompletionEntries.has(getSubagentRunRuntimeKey(entry)) && !isSameSubagentRunOwner(this.get(entry.runId), entry)) throw new Error("Subagent completion authority is no longer active");
	}
	runWithCompletionAuthority(observed, run) {
		const entry = this.currentValue(observed);
		this.assertCompletionEntryCurrent(entry);
		const custody = this.completionAuthorities.get(getSubagentRunRuntimeKey(entry));
		if (entry.endedReason === "subagent-killed" && entry.execution.outcome?.status === "error") return run();
		if ((entry.completionAuthorityRequired || this.operatorCompletionEntries.has(getSubagentRunRuntimeKey(entry))) && !custody) throw new Error("Subagent completion authority is no longer active");
		return custody ? custody.authority.run(run) : run();
	}
	runWithCompletionBatchAuthority(observed, run) {
		const batch = observed.map((entry) => this.currentValue(entry));
		batch.forEach((entry) => this.assertCompletionEntryCurrent(entry));
		const resultEntry = batch.find((entry) => !(entry.endedReason === "subagent-killed" && entry.execution.outcome?.status === "error"));
		if (!resultEntry) return run();
		const first = this.completionAuthorities.get(getSubagentRunRuntimeKey(resultEntry))?.authority.operatorAuthority;
		for (const entry of batch) {
			const source = this.completionAuthorities.get(getSubagentRunRuntimeKey(entry))?.authority.operatorAuthority;
			if ((entry.completionAuthorityRequired || this.operatorCompletionEntries.has(getSubagentRunRuntimeKey(entry))) && !source) throw new Error("Subagent completion authority is no longer active");
			source?.assertCurrent();
			if (source?.source !== first?.source && !(entry.operatorRecoverySource && resultEntry.operatorRecoverySource && isDeepStrictEqual(entry.operatorRecoverySource, resultEntry.operatorRecoverySource) && isDeepStrictEqual(source?.recoverySnapshot, first?.recoverySnapshot)) || !isDeepStrictEqual(source?.scopes, first?.scopes)) throw new Error("Subagent completion batch has incompatible operator authority");
		}
		return this.runWithCompletionAuthority(resultEntry, run);
	}
	/** Committed replacement transfers custody without reviving a retired source. */
	transferCompletionAuthority(previous, next) {
		transferFollowupCohort(previous, next);
		for (const entries of [this.retiredCompletionEntries, this.operatorCompletionEntries]) if (entries.has(getSubagentRunRuntimeKey(previous))) entries.add(getSubagentRunRuntimeKey(next));
		const custody = this.completionAuthorities.get(getSubagentRunRuntimeKey(previous));
		if (!custody) return;
		this.completionAuthorities.delete(getSubagentRunRuntimeKey(previous));
		custody.entry = next;
		this.completionAuthorities.set(getSubagentRunRuntimeKey(next), custody);
		this.operatorCompletionEntries.add(getSubagentRunRuntimeKey(next));
	}
	/** Only acknowledged registry state retires completion custody. */
	settleCompletionAuthorities(committed, changedRunIds) {
		const changed = changedRunIds && new Set(changedRunIds);
		for (const { entry } of this.completionAuthorities.values()) {
			if (changed && !changed.has(entry.runId)) continue;
			const record = committed.get(entry.runId);
			if (!record || !isSameSubagentRunOwner(this.get(entry.runId), entry) || record.generation !== entry.generation || !record.requesterTurnRunId && !record.requesterSettleWake && record.pauseReason !== "sessions_yield" && (record.cleanupCompletedAt !== void 0 || record.delivery?.status === "suspended" || record.delivery?.status === "discarded" || record.suppressCompletionDelivery === true)) this.releaseCompletionAuthority(entry);
		}
	}
	/** A cancellation borrows retirement evidence only for its own lexical lifetime. */
	captureRetirement(entry, isSuccessor) {
		const { promise, resolve } = createDeferredCore();
		const publication = {
			entry,
			promise,
			resolve,
			settled: false
		};
		const scope = {
			observation: {
				entry,
				generation: entry.generation,
				createdAt: entry.createdAt,
				state: "selected"
			},
			isSuccessor,
			publication
		};
		this.retirementScopes.add(scope);
		const pending = retirementPublications.get(getSubagentRunRuntimeKey(entry));
		if (pending) pending.add(publication);
		else retirementPublications.set(getSubagentRunRuntimeKey(entry), /* @__PURE__ */ new Set([publication]));
		return {
			get observation() {
				return scope.observation;
			},
			completePublication: () => completeRetirementPublication(scope),
			release: () => {
				completeRetirementPublication(scope);
				scope.observation = { state: "superseded" };
				this.retirementScopes.delete(scope);
			}
		};
	}
	/** A committed successor remains superseding even if it retires before preparation finishes. */
	captureRegistrationOwnership(childSessionKey, expectedEntry, childAgentId) {
		const scope = {
			childSessionKey,
			childAgentId,
			current: true,
			superseded: false,
			expectedEntry
		};
		this.registrationScopes.add(scope);
		return {
			get superseded() {
				return scope.superseded;
			},
			assertCurrent: () => {
				if (!scope.current) throw new Error("Subagent registration owner changed during preparation");
			},
			accept: (entry) => {
				if (!scope.current || entry.childSessionKey !== childSessionKey) throw new Error("Subagent registration owner changed before publication");
				scope.expectedEntry = entry;
				this.commitOwnership(entry);
			},
			release: () => {
				scope.current = false;
				this.registrationScopes.delete(scope);
			}
		};
	}
	/** Publish accepted runtime ownership after the row's commit acknowledgement. */
	commitOwnership(entry) {
		if (this.settleCommittedOwnership(entry)) publishSubagentRunChanges([entry.childSessionKey], [entry.runId]);
	}
	/** Bulk restore settles custody before its one atomic row publication notifies readers. */
	settleCommittedOwnership(entry) {
		if (!isSameSubagentRunOwner(this.get(entry.runId), entry)) return false;
		for (const scope of this.registrationScopes) if (matchesSubagentChildSessionOwner(entry, scope.childSessionKey, scope.childAgentId) && !isSameSubagentRunOwner(scope.expectedEntry, entry)) {
			scope.current = false;
			scope.superseded = true;
		}
		for (const scope of this.retirementScopes) {
			const previous = scope.observation.entry;
			if (previous && !isSameSubagentRunOwner(previous, entry) && previous.childSessionKey === entry.childSessionKey && scope.isSuccessor(entry)) scope.observation = { state: "superseded" };
		}
		return true;
	}
	/** Normal cleanup calls this only after its deletion commits; raw map deletion is not evidence. */
	confirmRetirement(entry) {
		for (const scope of this.retirementScopes) {
			const observed = scope.observation;
			if (isSameSubagentRunOwner(observed.entry, entry) && observed.state === "selected" && !isSameSubagentRunOwner(this.get(entry.runId), entry)) observed.state = "retired";
		}
		publishSubagentRunChanges([entry.childSessionKey], [entry.runId]);
	}
	publishRuntimeOwner(previous, entry) {
		this.transferCompletionAuthority(previous, entry);
		bindGatewayContextResolver(entry, getGatewayContextResolver(previous));
		const retirements = retirementPublications.get(getSubagentRunRuntimeKey(previous));
		if (retirements) for (const publication of retirements) publication.entry = entry;
		for (const scope of this.retirementScopes) if (scope.observation.state !== "superseded" && isSameSubagentRunOwner(scope.observation.entry, previous)) scope.observation = {
			...scope.observation,
			entry,
			generation: entry.generation,
			createdAt: entry.createdAt
		};
	}
	/** The row owner invokes this only after the source deletion and accepted address commit. */
	publishQueuedSubagentRunRekey(previous, accepted) {
		const current = this.get(accepted.runId);
		if (!current || !isSameSubagentRunOwner(current, accepted)) return;
		if (!isSameSubagentRunOwner(previous, current) || !isQueuedSubagentRunRekey(previous, current)) throw new Error("Queued subagent rekey lost its physical execution owner");
		this.publishRuntimeOwner(previous, current);
	}
	set(runId, entry) {
		const prev = this.get(runId);
		retainSubagentRunRuntimeOwner(prev, entry);
		if (prev && prev !== entry && isSameSubagentRunOwner(prev, entry)) this.publishRuntimeOwner(prev, entry);
		if (prev) for (const index of runIndexes) index.update(runId, prev, "remove");
		super.set(runId, entry);
		this.readLookup.set(runId, entry);
		for (const index of runIndexes) index.update(runId, entry, "add");
		this.workIndex.set(runId, entry);
		return this;
	}
	delete(runId) {
		this.workIndex.delete(runId);
		this.readLookup.set(runId, void 0);
		const prev = this.get(runId);
		if (prev) for (const index of runIndexes) index.update(runId, prev, "remove");
		return super.delete(runId);
	}
	clear() {
		for (const scope of this.registrationScopes) {
			scope.current = false;
			scope.superseded = true;
		}
		this.registrationScopes.clear();
		for (const { entry } of this.completionAuthorities.values()) this.releaseCompletionAuthority(entry);
		for (const scope of this.retirementScopes) {
			completeRetirementPublication(scope);
			scope.observation = { state: "superseded" };
		}
		this.retirementScopes.clear();
		super.clear();
		this.readLookup = new SubagentSessionReadLookup();
		this.workIndex.clear();
		for (const index of runIndexes) index.clear();
		publishSubagentRunChanges();
	}
};
const subagentRuns = new SubagentRunMap();
/** Publication owns membership; time only promotes due retained cleanup. */
function getSubagentSweepRuns(runs, now) {
	return runs instanceof SubagentRunMap ? runs.workIndex.sweepCandidates(now) : [...runs.values()].filter((entry) => subagentSweepAt(entry) <= now);
}
function getSubagentActivationRuns(runs) {
	return runs instanceof SubagentRunMap ? runs.workIndex.activationRuns.values() : [...runs.values()].filter(needsSubagentActivation);
}
subscribeSubagentRunChanges("projection", ({ runIds: ids }) => {
	if (!ids) subagentRuns.readLookup.invalidateSessions();
	else for (const id of ids) subagentRuns.readLookup.set(id, subagentRuns.get(id));
});
function getSubagentSessionReadLookup(runs) {
	return runs instanceof SubagentRunMap ? runs.readLookup : new SubagentSessionReadLookup(runs);
}
/** Resolve an observed physical execution through its existing queued/accepted address index. */
function getCurrentSubagentRunOwner(runs, observed) {
	const ids = /* @__PURE__ */ new Set([observed.runId, observed.swarmRunId ?? observed.runId]);
	for (const id of getSubagentSessionReadLookup(runs).selectRunIds(ids)) {
		const current = runs.get(id);
		if (current && isSameSubagentRunOwner(current, observed)) return current;
	}
}
function getSubagentChildSessionCandidates(childSessionKey) {
	return childSessionCandidatesByKey.get(childSessionKey)?.values() ?? [];
}
/** Iterate live generations for one child session without scanning the registry. */
function* getSubagentRunsForChildSession(childSessionKey, childAgentId) {
	const key = childSessionOwnerKey({
		childSessionKey,
		childAgentId
	});
	yield* (key ? runsByChildSessionOwner.get(key)?.values() : void 0) ?? [];
}
/** Current requester-owned generations, without restoring or scanning retained rows. */
function getSubagentRunsForRequesterSession(requesterSessionKey) {
	return runsByRequesterSessionKey.get(requesterSessionKey)?.values() ?? [];
}
/** Iterate live collector members for one requester/group archive decision. */
function getSubagentRunsForCollectorGroup(requesterSessionKey, groupId, requesterAgentId) {
	const key = JSON.stringify([requesterSessionKey, groupId]);
	return [...runsByCollectorGroupKey.get(key)?.entries() ?? []].filter(([, entry]) => entry.requesterAgentId === requesterAgentId);
}
/** Resolve a collector tombstone that reserves its child session from ordinary turns. */
function findSwarmCollectorSession(childSessionKey, childAgentId) {
	const key = childSessionKey?.trim();
	if (!key) return;
	const ownerKey = childSessionOwnerKey({
		childSessionKey: key,
		childAgentId
	});
	return ownerKey ? collectorsByChildSessionOwner.getLatest(ownerKey) : void 0;
}
/** Resolve the host-registered collector that authorizes a Gateway request. */
function findAuthorizedSwarmCollectorRequest(params) {
	const idempotencyKey = params.idempotencyKey?.trim();
	if (!idempotencyKey) return;
	const entry = findSwarmCollectorSession(params.childSessionKey, params.childAgentId);
	if (!entry) return;
	return entry.swarmLaunchIdempotencyKey === idempotencyKey && isDeepStrictEqual(entry.outputSchema, params.outputSchema) ? entry : void 0;
}
//#endregion
export { getFollowupCohortOwner as S, SUBAGENT_SESSION_RUN_TTL_MS as _, getSubagentActivationRuns as a, subscribeSubagentRunChanges as b, getSubagentRunsForCollectorGroup as c, getSubagentSweepRuns as d, hasPendingSubagentRetirementPublication as f, waitForSubagentRetirementPublication as g, subagentRuns as h, getCurrentSubagentRunOwner as i, getSubagentRunsForRequesterSession as l, immutableSubagentRunSessionList as m, findSwarmCollectorSession as n, getSubagentChildSessionCandidates as o, immutableSubagentRun as p, freezeSubagentRunReadRecord as r, getSubagentRunsForChildSession as s, findAuthorizedSwarmCollectorRequest as t, getSubagentSessionReadLookup as u, getSubagentRegistryPublicationRevision as v, bindFollowupCohortOwner as x, publishSubagentRunChanges as y };
