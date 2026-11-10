import { a as resolveGlobalSingleton, i as resolveGlobalSet } from "./global-singleton-DrXvEBww.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { a as publishSqliteCommittedState, o as stageSqliteCommittedPublication, r as hasSqlitePostCommitScope, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
//#region src/sessions/session-row-changes.ts
/** Display/runtime and auth refreshes do not replace committed storage facts. */
function sessionChangeScopeAffectsStoredRows(change) {
	if ("all" in change) return typeof change.scope !== "string" || ![
		"profiles",
		"catalog",
		"acp",
		"agent-runs",
		"subagent-runs",
		"worker-placements",
		"worker-environments",
		"config",
		"config-presentation",
		"config-profiles",
		"runtime",
		"automation"
	].includes(change.scope);
	return change.scope !== "automation" && change.scope !== "runtime" && change.scope !== "acp";
}
/** Store discovery fences also apply to agent-scoped topology publications. */
function isSessionStoreTopologyChange(change) {
	return "all" in change && (change.scope === "stores" || typeof change.scope === "object" && change.scope.topology === true);
}
const listeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowChanges"), "close-and-restart");
const factListeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowFactChanges"), "close-and-restart");
const projectionListeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowProjectionChanges"), "close-and-restart");
const invalidationSources = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowInvalidationSources"), () => /* @__PURE__ */ new WeakMap());
const privateFacts = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowPrivateFacts"), () => /* @__PURE__ */ new WeakMap());
const captures = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowChangeCaptures"), () => /* @__PURE__ */ new WeakMap());
const rowRevision = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowChangeRevision"), () => ({ value: 0 }));
/** Fences derived reports across metadata, sharing, topology, and uncertain writes. */
function readSessionRowChangeRevision() {
	return rowRevision.value;
}
/** Worker receipts borrow the producer's transaction postimages, including savepoint rollback. */
function captureSessionRowChanges(database, run) {
	const anchor = sqlPublicationAnchor(database);
	const changes = [];
	const active = captures.get(anchor) ?? /* @__PURE__ */ new Set();
	active.add(changes);
	captures.set(anchor, active);
	try {
		return {
			result: run(changes),
			changes
		};
	} finally {
		active.delete(changes);
		if (active.size === 0) captures.delete(anchor);
	}
}
/** Failure invalidations retain physical provenance, but never their old postimages. */
function sessionRowChangeSource(change) {
	return invalidationSources.get(change) ?? change;
}
const sessionChanges = {
	/** Authority-only facts join commit installation without a duplicate presentation event. */
	markFactsOnly(change, install) {
		privateFacts.set(change, install);
		return change;
	},
	subscribe(listener) {
		return registerListener(listeners, listener);
	},
	/** Install prepared facts only; live-row observers run after every commit callback. */
	subscribeFacts(listener) {
		return registerListener(factListeners, listener);
	},
	/** Refresh resident rows after all committed facts, before public observers can broadcast. */
	subscribeProjection(listener) {
		return registerListener(projectionListeners, listener);
	},
	/** Pending or indeterminate work fences facts without announcing a committed change. */
	invalidate(change) {
		rowRevision.value += 1;
		notifyListeners(factListeners, change);
		if (!privateFacts.has(change)) notifyListeners(projectionListeners, change);
	},
	/** SQLite observers run only after all committed owner state has settled. */
	emit(change, database) {
		sessionChanges.emitBatch([change], database);
	},
	emitBatch(changes, database, beforePublicNotifications) {
		const anchor = database && sqlPublicationAnchor(database);
		if (anchor && hasSqlitePostCommitScope(anchor)) for (const captured of captures.get(anchor) ?? []) {
			const start = captured.length;
			if (!stageSqliteTransactionState(anchor, {
				stage: () => captured.push(...changes),
				commit() {},
				rollback: () => captured.splice(start)
			})) throw new Error("Session receipt capture requires a transaction publication owner");
		}
		const visible = changes.filter((change) => !privateFacts.has(change));
		const install = (targets, batch) => {
			const failures = [];
			for (const change of batch) notifyListeners(targets, change, (error) => failures.push(error));
			if (failures.length > 0) throw new AggregateError(failures, "Session committed fact installation failed");
		};
		const publishFacts = () => {
			rowRevision.value += 1;
			for (const change of changes) privateFacts.get(change)?.();
			install(factListeners, changes);
		};
		const prepareObservers = () => {
			install(projectionListeners, visible);
		};
		const publish = () => {
			try {
				beforePublicNotifications?.();
			} finally {
				for (const change of visible) if ("sessionKey" in change) {
					const { facts: _facts, factsInvalidated: _invalidated, ...notification } = change;
					notifyListeners(listeners, notification);
				} else {
					const { factsInvalidated: _invalidated, ...notification } = change;
					notifyListeners(listeners, notification);
				}
			}
		};
		const publication = {
			installFacts: publishFacts,
			installProjection: prepareObservers,
			invalidate() {
				rowRevision.value += 1;
				const invalidations = changes.map((change) => {
					const invalidated = "sessionKey" in change ? {
						...change,
						facts: void 0,
						factsInvalidated: true
					} : {
						...change,
						factsInvalidated: true
					};
					invalidationSources.set(invalidated, sessionRowChangeSource(change));
					if (privateFacts.has(change)) privateFacts.set(invalidated, void 0);
					return invalidated;
				});
				const failures = [];
				for (const [targets, batch] of [[factListeners, invalidations], [projectionListeners, invalidations.filter((change) => !privateFacts.has(change))]]) try {
					install(targets, batch);
				} catch (error) {
					failures.push(error);
				}
				if (failures.length > 0) throw new AggregateError(failures, "Session publication invalidation failed");
			},
			notify: publish
		};
		if (!anchor || !stageSqliteCommittedPublication(anchor, publication)) publishSqliteCommittedState(publication);
	}
};
//#endregion
export { sessionChanges as a, sessionChangeScopeAffectsStoredRows as i, isSessionStoreTopologyChange as n, sessionRowChangeSource as o, readSessionRowChangeRevision as r, captureSessionRowChanges as t };
